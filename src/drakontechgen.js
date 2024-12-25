const { findFirst } = require("./tools")

function createDrakonTechGenerator(options) {
    var gBranches = {}
    var simpleSilhouette
    var nextId = 2
    var self = {}
    var state = "idle"
    var scopes = {}
    var project = createScope(options.name, "module")
    var failed = false
    var codeIcons = {
        "action": true,
        "loopbegin": true,
        "select": true,
        "case": true,
        "question": true
    }

    function canHaveCode(item) {
        return item.type in codeIcons
    }

    function generateId(prefix) {
        var id = prefix + "_" + nextId
        nextId++
        return id
    }


    function stop() {
        state = undefined
    }

    function createScope(name, type, parent) {
        var scope = {
            name: name,
            type: type,
            parent: parent,
            args: {},
            declared: {},
            auto: {},
            all: {},
            loop: {},
            algoprops: {},
            functions: {},
            classes: {},
            assignments: {}
        }
        scopes[name] = scope
        return scope
    }

    async function readChildren(folder) {
        var result = []
        for (var filepath of folder.children) {
            var child = await options.getObjectByHandle(filepath)
            if (child) {
                result.push(child)
            }
        }
        return result
    }



    function isModule(folder) {
        return folder.type === "drakon" && folder.name === "module"
    }

    function isClass(folder) {
        return folder.type === "drakon" && folder.name === "class"
    }

    function isFunction(folder) {
        return folder.type === "drakon" && folder.keywords.function
    }

    function isAlgoprop(folder) {
        return folder.type === "drakon" && folder.keywords.algoprop
    }

    function addFunction(scope, folder) {
        var name = folder.name
        if (name in scope.all) {
            reportError("Function name is not unique", folder.path, undefined, name)
        }
        scope.functions[name] = folder
        scope.all[name] = "function"
    }

    function addDeclaration(scope, name) {
        scope.declared[name] = true
        scope.all[name] = "declared"
    }

    function addAssigned(scope, name) {
        scope.assignments[name] = true
        scope.all[name] = "assigned"
    }

    function addArgument(fun, name) {
        fun.arguments.push(name)
        var decl = {
            name: name,
            path: fun.path,
            fun: fun.name,
            type: "argument"
        }
        if (name in fun.scope.declared) {
            reportError("Argument name is not unique", fun.path, "params", name)
        }
        addDeclaration(fun.scope, decl)
    }

    function checkCancellation() {
        if (!state) {
            var error = new Error("Cancelled")
            error.cancelled = true
            throw error
        }
    }
    async function traverseModuleItem(folder) {
        checkCancellation()
        if (folder.type === "folder") {
            var children = await readChildren(folder)
            var ctr = findFirst(children, isClass)
            if (ctr) {
                var cls = createClass(folder)
                for (var child of children) {
                    await traverseClassItem(cls, child)
                }
            } else {
                for (var child of children) {
                    await traverseModuleItem(child)
                }
            }
        } else if (isModule(folder)) {
            reportError("module not expected here", folder.path)
        } else if (isFunction(folder)) {
            addFunction(project, folder)
        } else if (isAlgoprop(folder)) {
            createGlobalAlgoprop(folder)
        }
    }

    async function jsPreprocess() {
        var rootFolder = await options.getObjectByHandle(options.root)
        var moduleInit = undefined
        for (var childPath of rootFolder.children) {
            var child = await options.getObjectByHandle(childPath)
            if (!child) { continue }
            if (isClass(child)) {
                reportError("class not expected in the root folder", childPath)
            } else if (isModule(child)) {
                moduleInit = child
            } else {
                await traverseModuleItem(child)
            }
        }

        for (var name in project.functions) {
            checkCancellation()
            parseFunctionItems(project.functions[name], project.name)
        }
    }

    function buildAsts() {
        for (var name in project.functions) {
            checkCancellation()
            buildAst(project.functions[name])
        }
    }

    function createFunction(name, arguments) {
        return {
            type: "FunctionDeclaration",
            id: createIdentifier(name),
            params: arguments.map(createIdentifier),
            body: createBlock(),
            generator: false,
            expression: false,
            async: false
        }
    }

    function createBlock() {
        return {
            type: "BlockStatement",
            body: []
        }
    }

    function addActionToAst(step, body) {
        if (!step.content) { return }
        for (var expr of step.content) {
            body.push(expr)
        }
    }

    function createNot(operand) {
        return {
            type: "UnaryExpression",
            operator: "!",
            argument: operand
        }
    }

    function createOr(left, right) {
        return {
            type: "LogicalExpression",
            operator: "||",
            left: left,
            right: right
        }
    }

    function createAnd(left, right) {
        return {
            type: "LogicalExpression",
            operator: "&&",
            left: left,
            right: right
        }
    }

    function createEqual(left, right) {
        return {
            type: "BinaryExpression",
            operator: "===",
            left: left,
            right: right
        }
    }

    function decodeQuestionContent(content) {
        if (content.operator === "not") {
            var decoded = decodeQuestionContent(content.operand)
            if (decoded.type === "BinaryExpression" && decoded.operator === "===") {
                decoded.operator = "!=="
                return decoded
            }
            return createNot(decodeQuestionContent(content.operand))
        }

        if (content.operator === "and") {
            var left = decodeQuestionContent(content.left)
            var right = decodeQuestionContent(content.right)
            return createAnd(left, right)
        }

        if (content.operator === "or") {
            var left = decodeQuestionContent(content.left)
            var right = decodeQuestionContent(content.right)
            return createOr(left, right)
        }

        if (content.operator === "equal") {
            var left = decodeQuestionContent(content.left)
            var right = decodeQuestionContent(content.right)
            return createEqual(left, right)
        }

        return content
    }

    function addQuestionToAst(step, body) {
        var content = decodeQuestionContent(step.content)
        var node = createIfNode(content)
        convertNodesToAst(step.yes, node.consequent.body)
        if (step.no.length > 0) {
            node.alternate = createBlock()
            convertNodesToAst(step.no, node.alternate.body)
        }
        body.push(node)
    }

    function createIfNode(content) {
        return {
            type: "IfStatement",
            test: content,
            consequent: createBlock()
        }
    }

    function addLoopToAst(step, body) {
        var node
        if (step.content) {
            node = step.content
        } else {
            node = createWhileTrue()
        }
        convertNodesToAst(step.body, node.body.body)
        body.push(node)
    }

    function createWhileTrue() {
        return {
            type: "WhileStatement",
            test: {
                type: "Literal",
                value: true,
                raw: "true"
            },
            body: createBlock()
        }
    }

    function createThrow(message) {
        return {
            type: "ThrowStatement",
            argument: {
                type: "NewExpression",
                "callee": createIdentifier("Error"),
                "arguments": [message]
            }
        }
    }

    function createPlus(left, right) {
        return {
            type: "BinaryExpression",
            operator: "+",
            left: left,
            right: right
        }
    }

    function createStringLiteral(value) {
        return {
            type: "Literal",
            value: value,
            raw: JSON.stringify(value)
        }
    }

    function addErrorToAst(step, body) {
        var message
        if (step.content) {
            message = createPlus(createStringLiteral(step.message + ": "), step.content)
        } else {
            message = createStringLiteral(step.message)
        }
        var expr = createThrow(message)
        body.push(expr)
    }

    function createBreak() {
        return {
            type: "BreakStatement",
            label: null
        }
    }

    function addAddressToAst(step, body) {
        if (simpleSilhouette) {
            var nextBranch = gBranches[step.content]
            convertNodesToAst(nextBranch.body, body)
        } else {
            var assi = createAssignment(createIdentifier("_state_"), createStringLiteral(step.content))
            var statement = createExpression(assi)
            body.push(statement)
        }
    }

    function convertNodesToAst(steps, body) {
        for (var step of steps) {
            if (step.type === "action") {
                addActionToAst(step, body)
            } else if (step.type === "question") {
                addQuestionToAst(step, body)
            } else if (step.type === "loop") {
                addLoopToAst(step, body)
            } else if (step.type === "error") {
                addErrorToAst(step, body)
            } else if (step.type === "break") {
                body.push(createBreak())
            } else if (step.type === "address") {
                addAddressToAst(step, body)
            } else {
                throw new Error("Unexpected step type: " + step.type)
            }
        }
    }

    function treeToAst(fun, tree) {
        var funAst = createFunction(fun.name, fun.arguments)
        var functionBody = funAst.body.body
        if (tree.branches.length === 0) {
            return funAst
        } else if (tree.branches.length === 1) {
            convertNodesToAst(tree.branches[0].body, functionBody)
        } else {
            gBranches = {}
            for (var branch of tree.branches) {
                if (!branch.name) {
                    onError("Branch name cannot be empty", fun.path, branch.id)
                    return funAst
                }
                if (branch.name in gBranches) {
                    onError("Non-unique branch name", fun.path, branch.id)
                    return funAst
                }
                gBranches[branch.name] = branch
            }
            if (isSimpleSilhouette(tree.branches)) {
                simpleSilhouette = true
                convertNodesToAst(tree.branches[0].body, functionBody)
            } else {
                simpleSilhouette = false
                var firstName = tree.branches[0].name
                functionBody.push(createDeclaration("_state_", createStringLiteral(firstName)))
                var loop = createWhileTrue()
                functionBody.push(loop)
                var loopBody = loop.body.body
                var select = createSwitch(createIdentifier("_state_"))
                loopBody.push(select)
                var ordinal = 0
                for (var branch of tree.branches) {
                    var caseClause = createCase(createStringLiteral(branch.name))
                    select.cases.push(caseClause)
                    var caseBody = caseClause.consequent
                    var lastBranch = (ordinal === tree.branches.length - 1 && hasEnd(fun))
                    if (lastBranch) {
                        var assi = createAssignment(createIdentifier("_state_"), createIdentifier("undefined"))
                        caseBody.push(createExpression(assi))
                    }
                    convertNodesToAst(branch.body, caseBody)
                    if (!endsWithReturn(caseBody)) {
                        caseBody.push(createBreak())
                    }
                    ordinal++
                }
                var defClause = createCase(null)
                defClause.consequent.push(createReturn(null))
                select.cases.push(defClause)

            }
        }
        return funAst
    }

    function endsWithReturn(caseBody) {
        if (caseBody.length === 0) {return false}
        var last = caseBody[caseBody.length - 1]
        return (last.type === "ReturnStatement" || last.type === "ThrowStatement")
    }

    function hasEnd(fun) {
        for (var id in fun.items) {
            var item = fun.items[id]
            if (item.type === "end") {return true}
        }
        return false
    }

    function createReturn(value) {
        return {
            type: "ReturnStatement",
            argument: value
        }
    }

    function createSwitch(value) {
        return {
            type: "SwitchStatement",
            discriminant: value,
            cases: []
        }
    }

    function createCase(value) {
        return {
            type: "SwitchCase",
            test: value,
            consequent: []
        }
    }

    function isSimpleSilhouette(branches) {
        for (var i = 0; i < branches.length; i++) {
            var branch = branches[i]
            if (branch.refs > 1) {
                if (i === branches.length - 1) {
                    return simpleBranch(branch)
                }
                return false
            }
        }
        return true
    }

    function simpleBranch(branch) {
        if (branch.body.length === 1) {
            if (branch.body[0].type === "action") {
                return true
            }
        }
        return false
    }

    function buildAst(fun) {
        var ast
        try {
            var drakonJson = JSON.stringify(fun, null, 4)
            var treeStr = options.toTree(drakonJson, fun.name, fun.path, options.language)
            var tree = JSON.parse(treeStr)
            ast = treeToAst(fun, tree)
            var src = options.escodegen.generate(ast)
            console.log(src)
        } catch (ex) {
            console.log(JSON.stringify(ast, null, 4))
            console.log(ex)
            reportError(ex.message, fun.path, ex.nodeId)
        }
    }

    function parseParams(params) {
        params = params || ""
        var parts = params.split("\n")
        return parts
            .map(part => part.trim())
            .filter(part => !!part)
    }

    function parseItemContent(fun, item) {
        var content = item.content || ""
        content = content.trim()
        if (content) {
            try {
                var wrapped = "async function _wpd_() {" + content + "\n}"
                var parsed = options.esprima.parseScript(wrapped, { loc: false })
                item.content = parsed.body[0].body.body
            } catch (ex) {
                reportError(ex.message, fun.path, item.id)
                delete item.content
            }
        } else {
            delete item.content
        }
    }

    function ensureHasContent(fun, item) {
        if (!item.content || item.content.length === 0) {
            reportError("Icon cannot be empty", fun.path, item.id)
            return false
        }
        return true
    }

    function ensureExpression(fun, item) {
        var expression = getExpression(item)
        if (!expression) {
            reportError("A value expression is expected here", fun.path, item.id)
            return false
        }
        item.content = expression
        return true
    }
    function getExpression(item) {
        if (!item.content) {
            return undefined
        }
        if (item.content.length !== 1) { return undefined }
        var expr = item.content[0]
        if (expr.type === "ExpressionStatement") {
            if (expr.expression.type === "AssignmentExpression") {
                return undefined
            }
            if (expr.expression.type === "SequenceExpression") {
                return undefined
            }
            return expr.expression
        }

        return undefined
    }

    function buildSubscopesAssignment(scope, expr) {
        var left = expr.left
        if (left.type === "Identifier") {
            addAssigned(scope, left.name)
        } else {
            buildSubscopes(scope, left)
        }
        buildSubscopes(scope, expr.right)
    }

    function buildSubscopesInExpression(scope, obj) {
        if (obj.expression.type === "AssignmentExpression") {
            buildSubscopesAssignment(scope, obj.expression)
        } else if (obj.expression.type === "SequenceExpression") {
            for (var subexpr of obj.expression.expressions) {
                if (subexpr.expression.type === "AssignmentExpression") {
                    buildSubscopesAssignment(scope, subexpr.expression)
                }
            }
        }
    }

    function buildSubscopes(scope, obj) {
        if (!obj) { return }
        if (Array.isArray(obj)) {
            for (var expr of obj) {
                buildSubscopes(scope, expr)
            }
        } else if (typeof obj === "object" && obj.type) {
            if (obj.type === "ArrowFunctionExpression" || obj.type === "FunctionExpression") {
                var name = buildScopeName()
                obj.scope = createScope(name, obj.type, scope.name)
                buildSubscopes(obj.scope, obj.body)
            } else if (obj.type === "ExpressionStatement") {
                buildSubscopesInExpression(scope, obj)
            } else if (obj.type === "VariableDeclaration") {
                buildSubscopesInDeclaration(scope, obj)
            } else {
                for (var key in obj) {
                    var value = obj[key]
                    buildSubscopes(scope, value)
                }
            }
        }
    }

    function parseActionContent(fun, item) {
        parseItemContent(fun, item)
    }

    function addLoopVar(scope, variable) {
        scope.all[variable] = "loop"
        scope.loop[variable] = true
    }

    function createForOf(variable, collectionExpr) {
        return {
            type: "ForOfStatement",
            left: {
                type: "VariableDeclaration",
                declarations: [
                    {
                        type: "VariableDeclarator",
                        id: {
                            type: "Identifier",
                            name: variable
                        },
                        init: null
                    }
                ],
                kind: "var"
            },
            right: collectionExpr,
            body: createBlock()
        }
    }

    function createForIn(variable, collectionExpr) {
        return {
            type: "ForInStatement",
            left: {
                type: "VariableDeclaration",
                declarations: [
                    {
                        type: "VariableDeclarator",
                        id: createIdentifier(variable),
                        init: null
                    }
                ],
                kind: "var"
            },
            right: collectionExpr,
            body: createBlock(),
            each: false
        }
    }

    function createFor(init, test, update) {
        return {
            type: "ForStatement",
            init: init,
            test: test,
            update: update,
            body: {
                type: "BlockStatement",
                body: []
            }
        }
    }

    function createGetValue(valueVar, keyVar, collection) {
        return {
            type: "AssignmentExpression",
            operator: "=",
            left: createIdentifier(valueVar),
            right: {
                type: "MemberExpression",
                computed: true,
                object: collection,
                property: createIdentifier(keyVar)
            }
        }
    }

    function createExpression(expression) {
        return {
            type: "ExpressionStatement",
            expression: expression
        }
    }

    function insertActionBefore(fun, beforeId, expression) {
        var id = generateId("_item_")
        var item = {
            id: id,
            type: "action",
            content: [createExpression(expression)],
            one: beforeId
        }

        for (var itemId in fun.items) {
            var existingItem = fun.items[itemId]
            if (existingItem.one === beforeId) {
                existingItem.one = id
            }
            if (existingItem.two === beforeId) {
                existingItem.two = id
            }
        }

        fun.items[id] = item
    }

    function parseLoopContent(fun, item) {
        parseItemContent(fun, item)
        if (ensureHasContent(fun, item)) {
            switch (item.content.length) {
                case 2:
                    var expr1 = item.content[0]
                    var expr2 = item.content[1]
                    if (expr1.type !== "ExpressionStatement" || expr2.type !== "ExpressionStatement") {
                        reportBadLoop(fun, item)
                        return
                    }
                    var first = expr1.expression
                    var second = expr2.expression
                    if (second.type !== "Identifier") {
                        var varName = generateId("_collection")
                        var oldContent = second
                        second = createIdentifier(varName)
                        var newContent = createAssignment(createIdentifier(varName), oldContent)
                        insertActionBefore(fun, item.id, newContent)
                    }
                    if (first.type === "Identifier") {
                        item.subtype = "array"
                        item.variable = first.name
                        item.content = createForOf(item.variable, second)
                    } else if (first.type === "SequenceExpression") {
                        if (first.expressions.length !== 2) {
                            reportBadLoop(fun, item)
                            return
                        } else {
                            var var1 = first.expressions[0]
                            var var2 = first.expressions[1]
                            if (var1.type !== "Identifier" || var2.type !== "Identifier") {
                                reportBadLoop(fun, item)
                            } else {
                                item.subtype = "dictionary"
                                item.keyVariable = var1.name
                                item.valueVariable = var2.name
                                insertActionBefore(fun, item.one, createGetValue(item.valueVariable, item.keyVariable, second))
                                item.content = createForIn(item.keyVariable, second)
                            }
                        }
                    }
                    break
                case 3:
                    var init = stripExpression(item.content[0])
                    var test = stripExpression(item.content[1])
                    var update = stripExpression(item.content[2])
                    item.content = createFor(init, test, update)
                    break
                default:
                    reportBadLoop(fun, item)
                    break
            }
        }
    }

    function stripExpression(node) {
        if (node.type === "ExpressionStatement") {
            return node.expression
        }

        return node
    }

    function createIdentifier(name) {
        return {
            type: "Identifier",
            name: name
        }
    }

    function createAssignment(identifier, expression) {
        return {
            type: "AssignmentExpression",
            operator: "=",
            left: identifier,
            right: expression
        }
    }

    function createDeclaration(name, expression) {
        return {
            type: "VariableDeclaration",
            declarations: [
                {
                    type: "VariableDeclarator",
                    id: createIdentifier(name),
                    init: expression
                }
            ],
            kind: "var"
        }
    }

    function parseSelectContent(fun, item) {
        parseItemContent(fun, item)
        if (!ensureHasContent(fun, item)) {
            return
        }
        if (!ensureExpression(fun, item)) {
            return
        }

        var expr = item.content
        if (expr.type !== "Identifier") {
            var varName = generateId("_selectValue")
            item.content = createIdentifier(varName)
            var newContent = createAssignment(createIdentifier(varName), expr)
            insertActionBefore(fun, item.id, newContent)
        }
    }

    function parseCaseContent(fun, item) {
        parseItemContent(fun, item)
        if (item.two) {
            ensureHasContent(fun, item)
        }
        if (item.content) {
            ensureExpression(fun, item)
        }
    }

    function parseQuestionContent(fun, item) {
        parseItemContent(fun, item)
        if (!ensureHasContent(fun, item)) { return }
        ensureExpression(fun, item)
    }

    function reportBadLoop(fun, item) {
        reportError("Error in loop icon", fun.path, item.id)
        delete item.content
    }

    function parseFunctionItems(fun, parentScope) {
        if (fun.name in scopes) {
            reportError("Name is not unique", fun.path, undefined, fun.name)
        }
        fun.scope = createScope(fun.name, "function", parentScope)
        fun.arguments = []
        var params = parseParams(fun.params)
        params.forEach(param => addArgument(fun, param))
        fun.items = fun.items || {}
        for (var itemId in fun.items) {
            var item = fun.items[itemId]
            item.id = itemId
            switch (item.type) {
                case "action":
                    parseActionContent(fun, item)
                    break;
                case "loopbegin":
                    parseLoopContent(fun, item)
                    break;
                case "select":
                    parseSelectContent(fun, item)
                    break;
                case "case":
                    parseCaseContent(fun, item)
                    break;
                case "question":
                    parseQuestionContent(fun, item)
                    break;
                case "branch":
                case "comment":
                case "arrow-loop":
                case "loopend":
                case "end":
                    break;
                default:
                    reportError("Unsupported icon type", fun.path, itemId, item.type)
                    break;
            }
        }
    }

    function reportError(message, filename, nodeId, data) {
        failed = true
        options.onError({
            message: message,
            filename: filename,
            nodeId: nodeId,
            data: data
        })
    }

    async function run() {
        if (state !== "idle") {
            throw new Error("Invalid state " + state)
        }
        try {
            await jsPreprocess()
            if (failed) {
                return
            }
            buildAsts()
            await options.onData(JSON.stringify(project, null, 4))
        } catch (ex) {
            if (ex.cancelled) {
                reportError("Cancelled by user")
            } else {
                options.onError(ex)
            }
        }
    }

    self.stop = stop
    self.run = run
    return self
}


module.exports = {
    createDrakonTechGenerator
}