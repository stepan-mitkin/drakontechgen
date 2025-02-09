const { sortBy, findFirst, addRange, clone, replace } = require("./tools")
const { traverseAst } = require("./astScanner")
const { topologicaSort } = require("./sort")

var verbose = false

async function pause(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function createDrakonTechGenerator(options) {
    var gAsts = {}
    var gBranches = {}
    var simpleSilhouette
    var nextId = 2
    var self = {}
    var state = "idle"
    var scopes = {}
    var project = createScope(options.name, "module")
    var failed = false

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
            loop: {},
            algoprops: {},
            functions: {},
            classes: {},
            computes: {},
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
        return folder.type === "drakon" && folder.name === "class" || folder.isCtr
    }

    function isFunction(folder) {
        if (folder.type === "drakon") {
            if (folder.keywords) {
                return folder.keywords.function
            }
            return true
        }
        return false
    }

    function isMachine(folder) {
        if (folder.type === "drakon") {
            if (folder.keywords) {
                return folder.keywords.machine
            }
        }
        return false
    }

    function isAlgoprop(folder) {
        return folder.type === "drakon" && folder.keywords && folder.keywords.algoprop
    }

    function isAsync(folder) {
        return folder.type === "drakon" && folder.keywords && folder.keywords.async
    }

    function createFunctionScope(folder, type, scopeName, parentScope) {
        if (scopeName in scopes) {
            reportError("Name is not unique", folder.path, undefined, scopeName)
        }
        folder.scope = createScope(scopeName, type, parentScope)
    }

    function addFunction(scope, folder, scopeName, parentScope) {
        if (verbose) {
            console.log("addFunction", scope.name, folder.name, folder.path)
        }
        var name = folder.name
        createFunctionScope(folder, "function", scopeName, parentScope)
        scope.functions[name] = folder
    }

    function addAlgoprop(scope, folder, scopeName, parentScope) {
        if (verbose) {
            console.log("addAlgoprop", scope.name, folder.name, folder.path)
        }
        var name = folder.name
        createFunctionScope(folder, "algoprop", scopeName, parentScope)
        scope.algoprops[name] = folder
    }

    function addClass(name, path, ctr) {
        if (verbose) {
            console.log("addClass", name, path)
        }
        createFunctionScope(ctr, "class", name, project.name)
        ctr.scope.allowDeclare = true
        ctr.isCtr = true
        ctr.name = name
        project.classes[name] = ctr
    }

    function addMachine(folder) {
        if (verbose) {
            console.log("addMachine", folder.name, folder.path)
        }
        buildMachine(folder)
    }

    function buildMachine(folder) {
        if (!folder.items) {
            folder.items = {}
        }
        var ctr = createFunctionObject(folder.name, folder.params, folder.keywords, folder.path)
        var inputs = {}
        ctr.keywords.function = true
        ctr.keywords.machine = false
        addClass(folder.name, folder.path, ctr)
        var firstItemId = collectInputs(folder, inputs)
        if (!firstItemId) {return}
        var br = folder.items[firstItemId]
        cutOutSubprogram(folder, br.one, ctr)
        for (var name in inputs) {
            var input = inputs[name]            
            createHandler(ctr.scope, input, folder)            
        }
        ctr.machine = {
            inputs: inputs
        }
    }

    function setBranchName(items, id, visited, branchName) {
        if (!id) {
            return
        }
        if (id in visited) {
            return
        }
        visited[id] = true
        var item = items[id]
        if (item.type === "branch") {
            var fallback = "branch_" + item.branchId
            branchName = extractGoodSymbols(item.content, fallback)
        }
        item.branchName = branchName
        setBranchName(items, item.one, visited, branchName)
        setBranchName(items, item.two, visited, branchName)
    }

    function createHandlerName(input, obj) {
        var name = obj.branchName + "_" + input.name
        return replace(name, "__", "_")
    }

    function createStateName(branchName, id) {
        return branchName        
    }


    function createHandler(scope, input, folder) {
        for (var obj of input.items) {
            var name = createHandlerName(input, obj)
            var fun = createFunctionObject(name, input.params, { function: true }, folder.path)
            var startItem = folder.items[obj.to]
            cutOutSubprogram(folder, startItem.one, fun)
            var scopeName = folder.name + "." + name
            addFunction(scope, fun, scopeName, scope.name)
        }
    }

    function collectInputs(folder, inputs) {
        var branches = []
        for (var id in folder.items) {
            var item = folder.items[id]
            item.id = id
            if (item.type === "branch") {
                branches.push(item)
            }            
        }
        if (branches.length === 0) {
            return undefined
        }
        sortBy(branches, "branchId")
        var firstItemId = branches[0].id
        var visited = {}
        var branchesVisited = {}
        setBranchName(folder.items, firstItemId, visited, "")
        for (var id in folder.items) {
            var item = folder.items[id]        
            if (isReceive(item)) {
                if (!checkOneInputPerBranch(folder, item, branchesVisited)) {return undefined}
                collectInputsFromReceive(folder, inputs, item)
            } else if (item.type === "sinput") {
                if (!checkOneInputPerBranch(folder, item, branchesVisited)) {return undefined}
                collectInputsFromSInput(folder, inputs, item, item.id)
            }
        }
        return firstItemId
    }

    function checkOneInputPerBranch(folder, item, branchesVisited) {
        if (item.branchName in branchesVisited) {
            reportError("Only one input or receive is allowed on one silhouette branch", folder.path, item.id)
            return false
        }
        branchesVisited[item.branchName] = true
        return true
    }

    function isReceive(item) {
        return item.type === "select" && item.content === "receive"
    }

    function cutOutSubprogram(folder, firstItemId, targetFun) {
        var startBranch = {
            type: "branch",
            content: "_start_",
            id: generateId("mi"),
            branchId: 0,
            one: firstItemId
        }
        targetFun.items[startBranch.id] = startBranch
        var visited = {}
        visited[startBranch.id] = true
        copyNode(folder, firstItemId, visited, targetFun)
    }

    function copyNode(folder, itemId, visited, targetFun) {
        if (!itemId) {
            return
        }
        if (itemId in visited) {
            return
        }
        visited[itemId] = true
        var item = folder.items[itemId]        
        if (item.type === "sinput" || isReceive(item)) {
            var stopItem = {
                id: itemId,
                type: "action",
                content: "self.state = \"" + createStateName(item.branchName, item.id) + "\""
            }
            targetFun.items[itemId] = stopItem
            return
        }
        if (item.type === "branch") {
            branchName = extractGoodSymbols(item.content, "")
        }        
        var copy = clone(item)
        if (copy.type === "end") {
            copy.type = "action"
            copy.content = "self.state = undefined"
        }
        targetFun.items[itemId] = copy        
        copyNode(folder, item.one, visited, targetFun)
        copyNode(folder, item.two, visited, targetFun)
    }

    function isGoodSymbol(code) {
        if (code >= 48 && code <= 57) {
            return true;
        }

        // Check for uppercase letters (A-Z)
        if (code >= 65 && code <= 90) {
            return true;
        }

        // Check for lowercase letters (a-z)
        if (code >= 97 && code <= 122) {
            return true;
        }

        // Check for underscore (_)
        if (code === 95) {
            return true;
        }        
        return false
    }

    function extractGoodSymbols(content, fallback) {
        content = content || ""
        var result = ""
        // Iterate through each character in the string
        for (let i = 0; i < content.length; i++) {
            var char = content[i]
            const code = content.charCodeAt(i);
            if (isGoodSymbol(code)) {
                result += char
            }
        }        
        return result || fallback
    }

    function collectInputsFromReceive(folder, inputs, item) {
        var id = item.one
        while (id) {
            var caseItem = folder.items[id]
            collectInputsFromSInput(folder, inputs, caseItem, item.id)
            id = caseItem.two
        }
    }

    function extractInput(folder, item, fromId) {
        if (!item.content) {
            reportError("An input signature is expected here", folder.path, item.id)
            return undefined
        }

        var ast
        try {
            ast = options.esprima.parseScript(item.content)
        } catch (ex) {
            reportError(ex.message, folder.path, item.id)
            return undefined
        }
        var result = getCall(ast.body[0])
        if (!result) {
            reportError("A call expression expected here", folder.path, item.id)
            return undefined
        }        
        addInputItem(result, fromId, item)
        return result
    }

    function addInputItem(result, fromId, item) {
        result.items.push({            
            from: fromId,
            branchName: item.branchName,
            to: item.id
        })
    }

    function getCall(ast) {
        if (ast.type === "ExpressionStatement") {
            var expr = ast.expression
            if (expr.type === "CallExpression") {
                if (expr.callee.type === "Identifier") {
                    var name = expr.callee.name
                    var result = {
                        name: name,
                        arguments: [],
                        signature: "",
                        items: []
                    }
                    for (var arg of expr.arguments) {
                        if (arg.type === "Identifier") {
                            result.arguments.push(arg.name)
                        } else {
                            return undefined
                        }
                    }
                    result.signature = name + "(" + result.arguments.join(",") + ")"
                    result.params = result.arguments.join("\n")
                    return result
                }
            }
        }
        return undefined
    }

    function collectInputsFromSInput(folder, inputs, item, fromId) {
        var input = extractInput(folder, item, fromId)
        if (input) {
            var existing = inputs[input.name]
            if (existing) {
                if (existing.signature === input.signature) {                    
                    addInputItem(existing, fromId, item)
                } else {
                    reportError("Incompatible input signatures", folder.path, item.id)
                }
            } else {
                inputs[input.name] = input
            }
        }
    }

    function createFunctionObject(name, params, keywords, path) {
        var result = {
            name: name,
            type: "drakon",
            params: params,
            keywords: {},
            items: {},
            path: path
        }
        if (keywords) {
            Object.assign(result.keywords, keywords)
        }
        return result
    }

    function addDeclaration(scope, name) {
        scope.declared[name] = true
    }

    function addAssigned(scope, name) {
        scope.assignments[name] = true
    }

    function addArgument(fun, name) {
        fun.arguments.push(name)
        if (name in fun.scope.declared) {
            reportError("Argument name is not unique", fun.path, "params", name)
        }
        addDeclaration(fun.scope, name)
    }

    function checkCancellation() {
        if (!state) {
            var error = new Error("Cancelled")
            error.cancelled = true
            throw error
        }
    }
    async function traverseModuleItem(folder) {
        if (verbose) { console.log("traverseModuleItem", folder.path) }
        checkCancellation()
        if (folder.type === "folder") {
            var children = await readChildren(folder)
            var ctr = findFirst(children, isClass)
            if (ctr) {
                addClass(folder.name, folder.path, ctr)
                for (var child of children) {
                    await traverseClassItem(ctr, child, true)
                }
            } else {
                for (var child of children) {
                    await traverseModuleItem(child)
                }
            }
        } else if (isModule(folder)) {
            reportError("module not expected here", folder.path)
        } else if (isFunction(folder)) {
            addFunction(project, folder, folder.name, project.name)
        } else if (isAlgoprop(folder)) {
            addAlgoprop(project, folder, folder.name, project.name)
        } else if (isMachine(folder)) {
            addMachine(folder)
        }
    }

    async function traverseClassItem(ctr, folder, classAllowed) {
        if (verbose) { console.log("traverseClassItem", folder.path) }
        checkCancellation()
        var scope = ctr.scope
        if (folder.type === "folder") {
            var children = await readChildren(folder)
            for (var child of children) {
                await traverseClassItem(ctr, child, false)
            }
        } else if (isClass(folder)) {
            if (!classAllowed) {
                reportError("class not expected here", folder.path)
            }
        } else if (isModule(folder)) {
            reportError("module not expected here", folder.path)
        } else if (isFunction(folder)) {
            var scopeName = ctr.name + "." + folder.name
            addFunction(scope, folder, scopeName, ctr.name)
        } else if (isAlgoprop(folder)) {
            var scopeName = ctr.name + "." + folder.name
            addAlgoprop(scope, folder, scopeName, ctr.name)
        } else if (isMachine(folder)) {
            reportError("state machines are not allowed in classes", folder.path)
        }
    }

    async function jsPreprocess() {
        var rootFolder = await options.getObjectByHandle(options.root)
        for (var childPath of rootFolder.children) {
            var child = await options.getObjectByHandle(childPath)
            if (!child) { continue }
            if (isClass(child)) {
                reportError("class not expected in the root folder", childPath)
            } else if (isModule(child)) {
                project.moduleInit = child
            } else {
                await traverseModuleItem(child)
            }
        }

        if (project.moduleInit) {
            parseItemsCore(project.moduleInit, parseNormal)
        }

        parseFunctions(project.functions)
        parseFunctions(project.algoprops)

        for (var name in project.classes) {
            parseClassItems(project.classes[name])
        }
    }

    function buildAsts() {
        if (project.moduleInit) {
            buildAst(project.moduleInit)
        }
        buildAstsInFunctions(project.functions)
        buildAstsInFunctions(project.algoprops)
        for (var name in project.classes) {
            buildClassAst(project.classes[name])
        }
    }

    function createFunction(name, arguments) {
        if (!arguments) { arguments = [] }
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
        if (fun.keywords && fun.keywords.async) {
            funAst.async = true
        }

        var functionBody = funAst.body.body
        if (tree.branches.length === 0) {
            return funAst
        } else if (tree.branches.length === 1) {
            convertNodesToAst(tree.branches[0].body, functionBody)
        } else {
            gBranches = {}
            for (var branch of tree.branches) {
                if (!branch.name) {
                    reportError("Branch name cannot be empty", fun.path, branch.id)
                    return funAst
                }
                if (branch.name in gBranches) {
                    reportError("Non-unique branch name", fun.path, branch.id)
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
                functionBody.push(createExpression(createAssignment(createIdentifier("_state_"), createStringLiteral(firstName))))
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
        if (caseBody.length === 0) { return false }
        var last = caseBody[caseBody.length - 1]
        return (last.type === "ReturnStatement" || last.type === "ThrowStatement")
    }

    function hasEnd(fun) {
        for (var id in fun.items) {
            var item = fun.items[id]
            if (item.type === "end") { return true }
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

    function putAst(fun, ast) {
        var key = getAstId(fun)
        gAsts[key] = ast
    }

    function getAstId(fun) {
        if (fun.scope) {
            return fun.scope.name
        }
        return "module"
    }

    function getAst(fun) {
        var key = getAstId(fun)
        return gAsts[key]
    }

    function buildAst(fun) {
        var ast
        try {
            var drakonJson = JSON.stringify(fun, null, 4)
            var treeStr = options.toTree(drakonJson, fun.name, fun.path, options.language)
            var tree = JSON.parse(treeStr)
            var ast = treeToAst(fun, tree)
            if (verbose) {
                try {
                    options.escodegen.generate(ast)
                } catch (ex) {
                    console.log(ex.message)
                    console.log(fun.name, fun.path)
                    console.log(JSON.stringify(ast, null, 4))
                    reportError("Internal error", fun.path)
                    ast = createIdentifier("error")
                }
            }
            putAst(fun, ast)
        } catch (ex) {
            console.log(ex)
            reportError(ex.message, fun.path, ex.nodeId)
        }
    }

    function buildClassAst(cls) {
        buildAst(cls)
        var scope = cls.scope
        buildAstsInFunctions(scope.functions)
        buildAstsInFunctions(scope.algoprops)
    }

    function buildAstsInFunctions(functions) {
        for (var name in functions) {
            var fun = functions[name]
            buildAst(fun)
        }
    }

    function isExported(fun) {
        return fun.keywords && fun.keywords.export
    }

    function parseParams(params) {
        params = params || ""
        var parts = params.split("\n")
        return parts
            .map(part => part.trim())
            .filter(part => !!part)
    }

    function parseNormal(content, itemId) {
        var wrapped = "async function _wpd_() {" + content + "\n}"
        var parsed = options.esprima.parseScript(wrapped, { loc: false })
        var result = parsed.body[0].body.body
        result.forEach(node => { node.itemId = itemId })
        return result
    }

    function parseItemContent(fun, item, parser) {
        var content = item.content || ""
        content = content.trim()
        if (content) {
            try {
                item.content = parser(content, item.id)
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


    function addFunctionParamsToScope(scope, node) {
        if (node.params) {
            for (var param of node.params) {
                if (param.type === "Identifier") {
                    addDeclaration(scope, param.name)
                }
            }
        }
    }

    function isDeclaration(parentNode, property) {
        if (property === "dec") { return true }
        if (parentNode.type === "VariableDeclarator" && property === "id") {
            return true
        }
        return false
    }

    function isNeutral(parentNode, property) {
        if (property === "params") { return true }
        if (property === "left" && parentNode.type === "ForInStatement") { return true }
        if (property === "left" && parentNode.type === "ForOfStatement") { return true }
        return false
    }

    function getObjectTypeDeep(scope, name) {
        var sname = scope.name
        while (sname) {
            var current = scopes[sname]
            var type = getObjectType(current, name)
            if (type) {
                return type
            }
            sname = current.parent
        }
        return undefined
    }

    function getObjectType(scope, name) {
        if (name in scope.classes) {
            return "class"
        }
        if (name in scope.functions) {
            return "function"
        }
        if (name in scope.algoprops) {
            return "algoprop"
        }
        if (name in scope.loop) {
            return "loop"
        }

        return undefined
    }

    function checkCanWriteTo(context, name, itemId, parentNode) {
        var type = getObjectTypeDeep(context.scope, name)
        if (type === "class") {
            reportError("Cannot write to class definition", context.fun.path, itemId)
        } else if (type === "function") {
            reportError("Cannot write to function definition", context.fun.path, itemId)
        } else if (type === "algoprop") {
            reportError("Cannot write to algo-prop definition", context.fun.path, itemId)
        } else if (type === "loop") {
            if (!parentNode.loopInternal) {
                reportError("Cannot write to a loop variable", context.fun.path, itemId)
            }
        }
    }

    function isLazy(algo) {
        return algo.keywords && algo.keywords.lazy
    }

    function isOwnEagerProperty(context, name) {
        var algo = getOwnAlgoprop(context.fun, name)
        if (algo) {
            if (!isLazy(algo)) {
                return true
            }
        }
        return false
    }

    function getComputeArgument(node) {
        if (node.type === "CallExpression") {
            var callee = node.callee
            if (callee.type === "Identifier" && callee.name === "compute") {
                var args = node.arguments
                if (args.length === 1) {
                    var arg = args[0]
                    if (arg.type === "Identifier") {
                        return arg.name
                    }
                }
            }
        }
        return undefined
    }

    function getOwnAlgoprop(fun, name) {
        var scope = getParentScope(fun)
        return scope.algoprops[name]
    }

    function getParentScope(fun) {
        if (fun.scope.parent) {
            return scopes[fun.scope.parent]
        } else {
            return fun.scope
        }
    }

    function computeAllowed(context, itemId, computeArg) {
        var algo = getOwnAlgoprop(context.fun, computeArg)
        if (algo) {
            if (isLazy(algo)) {
                return true
            } else if (!isAlgoprop(context.fun)) {
                return true
            } else {
                reportError("Cannot compute a non-lazy algoprop inside an algoprop", context.fun.path, itemId)
                return false
            }
        }
        reportError("Can compute only own algoprops", context.fun.path, itemId)
        return false
    }

    function firstPass(fun, scope) {
        var context = {
            fun: fun,
            scope: scope
        }
        var self = {}
        self.visit = function (node, itemId, parentNode, property) {
            if (node.type === "ArrowFunctionExpression" || node.type === "FunctionExpression") {
                var name = generateId("scope")
                node.scope = createScope(name, node.type, scope.name)
                addFunctionParamsToScope(node.scope, node)
                return firstPass(fun, node.scope)
            } else if (node.type === "Identifier") {
                if (isDeclaration(parentNode, property)) {
                    if (!scope.allowDeclare) {
                        reportError("Variable declarations allowed only in module and class constructors", fun.path, itemId)
                        return self
                    }
                    addDeclaration(scope, node.name)
                }
                if (isNeutral(parentNode, property)) {
                    return self
                }
                if (isAlgoprop(fun) && isOwnEagerProperty(context, node.name)) {
                    fun.dependencies[node.name] = true
                }
                if (parentNode.type === "UpdateExpression") {
                    checkCanWriteTo(context, node.name, itemId, parentNode)
                } else if (parentNode.type === "AssignmentExpression" && property === "left") {
                    checkCanWriteTo(context, node.name, itemId, parentNode)
                    addAssigned(context.scope, node.name)
                }
            } else {
                var computeArg = getComputeArgument(node)
                if (computeArg) {
                    if (computeAllowed(context, itemId, computeArg)) {
                        var pscope = getParentScope(fun)
                        pscope.computes[computeArg] = true
                    }
                }
            }
            return self
        }
        return self
    }

    function secondPass(fun, scope) {
        var self = {}
        self.visit = function (node, itemId, parentNode, property) {
            if (node.type === "ArrowFunctionExpression" || node.type === "FunctionExpression") {
                if (node.body.type === "BlockStatement") {
                    addVariableDeclarationsCore(node.scope, node.body.body)
                }
                return secondPass(fun, node.scope)
            } else if (node.type === "FunctionDeclaration") {
                addVariableDeclarationsCore(scope, node.body.body)
            } else {
                var computeArg = getComputeArgument(node)
                if (computeArg) {
                    node.callee.name = buildComputeName(computeArg)
                    node.arguments = []
                    var pscope = getParentScope(fun)
                    var compAst = pscope.computeFunctions[computeArg]
                    if (compAst && compAst.async && parentNode.type !== "AwaitExpression") {
                        node.type = "AwaitExpression"
                        node.argument = createCall(createIdentifier(buildComputeName(computeArg)))
                        delete node.callee
                        delete node.arguments
                    }
                }
            }
            return self
        }
        return self
    }


    function parseActionContent(fun, item, parser) {
        parseItemContent(fun, item, parser)
    }

    function parseSOutputContent(fun, item, parser) {
        if (item.content) {
            item.content = "setTimeout(() => {" + item.content + "}, 0);"
        }
        item.type = "action"
        parseItemContent(fun, item, parser)
    }

    function addLoopVar(scope, variable) {
        scope.loop[variable] = true
        scope.auto[variable] = true
    }

    function createForOf(variable, collectionExpr) {
        return {
            type: "ForOfStatement",
            left: createIdentifier(variable),
            right: collectionExpr,
            body: createBlock()
        }
    }

    function createForIn(variable, collectionExpr) {
        return {
            type: "ForInStatement",
            left: createIdentifier(variable),
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
            },
            loopInternal: true
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

    function parseLoopContent(fun, item, parser) {
        parseItemContent(fun, item, parser)
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
                        item.content.itemId = item.id
                        addLoopVar(fun.scope, item.variable)
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
                                item.content.itemId = item.id
                                addLoopVar(fun.scope, item.keyVariable)
                                addLoopVar(fun.scope, item.valueVariable)
                            }
                        }
                    }
                    break
                case 3:
                    var init = stripExpression(item.content[0])
                    var test = stripExpression(item.content[1])
                    var update = stripExpression(item.content[2])
                    item.content = createFor(init, test, update)
                    item.content.itemId = item.id
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

    function createDeclarations(names) {
        return {
            type: "VariableDeclaration",
            declarations: names.map(name => {
                return {
                    type: "VariableDeclarator",
                    id: createIdentifier(name),
                    init: null
                }
            }),
            kind: "var"
        }
    }

    function parseSelectContent(fun, item, parser) {
        parseItemContent(fun, item, parser)
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

    function parseCaseContent(fun, item, parser) {
        parseItemContent(fun, item, parser)
        if (item.two) {
            ensureHasContent(fun, item)
        }
        if (item.content) {
            ensureExpression(fun, item)
        }
    }

    function parseQuestionContent(fun, item, parser) {
        parseItemContent(fun, item, parser)
        if (!ensureHasContent(fun, item)) { return }
        ensureExpression(fun, item)
    }

    function reportBadLoop(fun, item) {
        reportError("Error in loop icon", fun.path, item.id)
        delete item.content
    }

    function parseFunctionItems(fun) {
        fun.arguments = []
        var params = parseParams(fun.params)
        params.forEach(param => addArgument(fun, param))
        parseItemsCore(fun, parseNormal)
    }

    function parseClassItems(cls) {
        if (cls.keywords && cls.keywords.async) {
            reportError("A class constructor cannot be async", cls.path)
        }
        parseFunctionItems(cls)

        var scope = cls.scope
        parseFunctions(scope.functions)
        parseFunctions(scope.algoprops)
    }

    function parseFunctions(functions) {
        for (var name in functions) {
            parseFunctionItems(functions[name])
        }
    }

    function parseItemsCore(fun, parser) {
        fun.dependencies = {}
        fun.items = fun.items || {}
        for (var itemId in fun.items) {
            var item = fun.items[itemId]
            item.id = itemId
            switch (item.type) {
                case "action":
                    parseActionContent(fun, item, parser)
                    break;
                case "soutput":
                    parseSOutputContent(fun, item, parser)
                    break;                    
                case "loopbegin":
                    parseLoopContent(fun, item, parser)
                    break;
                case "select":
                    parseSelectContent(fun, item, parser)
                    break;
                case "case":
                    parseCaseContent(fun, item, parser)
                    break;
                case "question":
                    parseQuestionContent(fun, item, parser)
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

    function createRootNode() {
        return {
            type: "Program",
            body: [],
            sourceType: "module"
        }
    }

    function createDotMember(obj, propertyName) {
        return {
            type: "MemberExpression",
            computed: false,
            object: obj,
            property: createIdentifier(propertyName)
        }
    }

    function createExportNode(exported) {
        var properties = exported.map(name => [createIdentifier(name), createIdentifier(name)])
        return createExpression(
            {
                type: "AssignmentExpression",
                operator: "=",
                left: createDotMember(createIdentifier("module"), "exports"),
                right: createObjectExpression(properties)
            }
        )
    }

    function createInitProperty(key, value) {
        return {
            type: "Property",
            key: key,
            value: value,
            computed: false,
            kind: "init",
            method: false,
            shorthand: true
        }
    }

    function createObjectExpression(properties) {
        return {
            type: "ObjectExpression",
            properties: properties.map(prop => createInitProperty(
                prop[0],
                prop[1]
            ))
        }
    }

    function buildCalcName(name) {
        return "_calc_" + name
    }

    function buildComputeName(name) {
        return "_compute_" + name
    }

    function addAlgopropCode(scope, body) {
        var names = Object.keys(scope.algoprops)
        if (names.length === 0) { return }
        names.sort()
        body.push(createDeclarations(names))
        for (var name of names) {
            var algo = scope.algoprops[name]
            var algoName = buildCalcName(name)
            var ast = getAst(algo)
            ast.id.name = algoName
            body.push(ast)
        }
    }


    function generateSourceCode() {
        var root = createRootNode()
        if (project.moduleInit) {
            var modAst = getAst(project.moduleInit)
            addRange(root.body, modAst.body.body)
        }
        addAlgopropCode(project, root.body)
        var names = Object.keys(project.functions)
        addRange(names, Object.keys(project.classes))
        names.sort()
        var exported = []
        for (var name of names) {
            var fun = project.functions[name] || project.classes[name]
            var ast = getAst(fun)
            if (isClass(fun)) {
                addMembersToClass(fun, ast)
            }
            root.body.push(ast)
            if (isExported(fun)) {
                exported.push(name)
            }
        }
        addComputes(project, root.body)
        if (exported.length > 0) {
            root.body.push(createExportNode(exported))
        }
        var src = options.escodegen.generate(root)
        return src
    }

    function addComputes(scope, body) {
        var names = Object.keys(scope.computeFunctions)
        names.sort()
        for (var name of names) {
            var ast = scope.computeFunctions[name]
            body.push(ast)
        }
    }

    function addMembersToClass(fun, ast) {
        var body = ast.body.body
        var scope = fun.scope
        body.unshift(createDeclaration("self", createObjectExpression([])))
        addAlgopropCode(scope, body)
        var names = Object.keys(scope.functions)
        names.sort()
        var exported = []
        for (var name of names) {
            var method = scope.functions[name]
            var ast = getAst(method)
            body.push(ast)
            if (isExported(method)) {
                exported.push(name)
            }
        }
        addComputes(scope, body)
        for (var name of exported) {
            addMethodExport(name, body)
        }
        addMachineMethods(fun, body)        
        body.push(createReturn(createIdentifier("self")))
    }

    function addMethodExport(name, body) {
        body.push(createExpression(createAssignment(
            createDotMember(
                createIdentifier("self"),
                name
            ),
            createIdentifier(name)
        )))        
    }

    function addMachineMethods(fun, body) {
        if (fun.machine) {
            var inputs = Object.keys(fun.machine.inputs)
            inputs.sort()
            for (var name of inputs) {                
                var input = fun.machine.inputs[name]
                addMachineMethod(input, body)
            }
            for (var name of inputs) {
                addMethodExport(name, body)
            }            
        }
    }

    function addMachineMethod(input, body) {
        var ast = createFunction(input.name, input.arguments)
        var output = ast.body.body
        var stateSwitch = createSwitch(createDotMember(createIdentifier("self"), "state"))
        output.push(stateSwitch)
        for (var obj of input.items) {
            var stateName = createStateName(obj.branchName, obj.from)            
            var cas = createCase(createStringLiteral(stateName))
            stateSwitch.cases.push(cas)
            var name = createHandlerName(input, obj)
            var call = createCall(
                createIdentifier(name),
                input.arguments.map(createIdentifier)
            )
            cas.consequent.push(createReturn(call))
        }
        var def = createCase(null)
        def.consequent.push(createReturn(createIdentifier("undefined")))
        stateSwitch.cases.push(def)
        body.push(ast)
    }

    function scanAsts() {
        project.allowDeclare = true
        if (project.moduleInit) {
            addVariableDeclarations(project, project.moduleInit)
        }
        scanFunctionsAsts(project.functions);
        scanFunctionsAsts(project.algoprops);
        for (var name in project.classes) {
            var cls = project.classes[name]
            scanClassAst(cls)
        }
    }

    function secondScanAstForFunctions(functions) {
        for (var name in functions) {
            var fun = functions[name];
            secondScanAst(fun.scope, fun);
        }
    }

    function getAllDeps(scope, algo) {
        var start = algo.name
        var getAdjacentNodes = key => {
            var current = scope.algoprops[key]
            return Object.keys(current.dependencies)
        }
        var reportError = (key, message) => {
            var current = scope.algoprops[key]
            reportError("Detected a cycle in property dependencies", current.path, undefined, message)
        }
        var deps = topologicaSort(start, getAdjacentNodes, reportError)
        return deps
    }

    function resolveAlgoprops(scope) {
        for (var name in scope.algoprops) {
            var algo = scope.algoprops[name]
            var deps = getAllDeps(scope, algo)
            algo.sortedDeps = deps
        }

        scope.computeFunctions = {}
        var names = Object.keys(scope.computes)
        names.sort()
        for (var name of names) {
            var ast = buildComputeAst(scope, name)
            scope.computeFunctions[name] = ast
        }
    }

    function createCall(callee, arguments) {
        arguments = arguments || []
        return {
            type: "CallExpression",
            callee: callee,
            arguments: arguments
        }
    }

    function createAwait(argument) {
        return {
            type: "AwaitExpression",
            argument: argument
        }
    }


    function buildComputeAst(scope, name) {
        var fname = buildComputeName(name)
        var ast = createFunction(fname)
        var algo = scope.algoprops[name]
        var as = false
        for (var dep of algo.sortedDeps) {
            var depAlgo = scope.algoprops[dep]
            var call = createCall(createIdentifier(buildCalcName(dep)))
            if (isAsync(depAlgo)) {
                call = createAwait(call)
                as = true
            }
            var calcLine = createExpression(createAssignment(createIdentifier(dep), call))
            ast.body.body.push(calcLine)
        }
        if (as) {
            ast.async = true
        }

        return ast
    }

    function secondScanAst(scope, fun) {
        var ast = getAst(fun)
        var context = secondPass(fun, scope)
        traverseAst(context, ast, undefined, {}, undefined)
    }

    function secondScanAsts(scope, ctr) {
        resolveAlgoprops(scope)

        if (ctr) {
            secondScanAst(scope, ctr)
        }
        secondScanAstForFunctions(scope.functions);
        secondScanAstForFunctions(scope.algoprops);
        for (var name in scope.classes) {
            var cls = scope.classes[name]
            secondScanAsts(cls.scope, cls)
        }
    }

    function scanFunctionsAsts(functions) {
        for (var name in functions) {
            var fun = functions[name];
            addVariableDeclarations(fun.scope, fun);
        }
    }

    function scanClassAst(cls) {
        addVariableDeclarations(cls.scope, cls);
        scanFunctionsAsts(cls.scope.functions)
        scanFunctionsAsts(cls.scope.algoprops)
    }

    function addVariableDeclarations(scope, fun) {
        var ast = getAst(fun)
        var context = firstPass(fun, scope)
        traverseAst(context, ast.body.body, undefined, {}, undefined)
    }

    function isDeclared(scope, name) {
        if (name in scope.declared) {
            return true
        }

        if (scope.parent) {
            var parent = scopes[scope.parent]
            if (name in parent.assignments) {
                return true
            }
            return isDeclared(parent, name)
        }
    }

    function calculateAuto(scope) {
        for (var name in scope.assignments) {
            if (!isDeclared(scope, name)) {
                scope.auto[name] = true
            }
        }
    }

    function addVariableDeclarationsCore(scope, body) {
        calculateAuto(scope)
        var auto = Object.keys(scope.auto)
        auto.sort()
        if (auto.length !== 0) {
            body.unshift(createDeclarations(auto))
        }
    }

    async function run() {
        if (state !== "idle") {
            throw new Error("Invalid state " + state)
        }
        try {
            gAsts = {}
            gBranches = {}
            await jsPreprocess()
            if (failed) {
                return
            }
            buildAsts()
            await pause(1)
            if (failed) {
                return
            }
            checkCancellation()
            scanAsts()
            await pause(1)
            if (failed) {
                return
            }
            checkCancellation()
            secondScanAsts(project, project.moduleInit)
            await pause(1)
            if (failed) {
                return
            }
            checkCancellation()
            var src = generateSourceCode()
            await options.onData(src)
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