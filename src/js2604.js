const {sortBy, findFirst, addRange, clone, replace} = require('./tools');
function Js2604Generator(options) {
    var self = {};
    var failed, gBranches, gSimpleSilhouette, nextId, state;
    state = 'idle';
    failed = false;
    nextId = 2;
    gSimpleSilhouette = true;
    gBranches = {};
    function addActionToAst(step, body) {
        var _collection_2, expr;
        if (step.content) {
            _collection_2 = step.content;
            for (expr of _collection_2) {
                body.push(expr);
            }
        }
    }
    function addAddressToAst(step, body) {
        var assi, nextBranch, statement;
        if (gSimpleSilhouette) {
            nextBranch = gBranches[step.content];
            convertNodesToAst(nextBranch.body, body);
        } else {
            assi = createAssignment(createIdentifier('_state_'), createStringLiteral(step.content));
            statement = createExpression(assi);
            body.push(statement);
        }
    }
    function addChild(parent, folder) {
        var scope;
        if (folder.name in parent.children) {
            reportError('Name is not unique: ' + folder.name, folder.path, undefined);
        } else {
            enrichFolder(folder);
            scope = createScope('function', folder.name);
            folder.scope = scope;
            parent.children[folder.name] = folder;
        }
    }
    function addDeclaration(folder, name) {
        folder.scope.declarations[name] = true;
    }
    function addErrorToAst(step, body) {
        var expr, message;
        if (step.content) {
            message = createPlus(createStringLiteral(step.message + ': '), step.content);
        } else {
            message = createStringLiteral(step.message);
        }
        expr = createThrow(message);
        body.push(expr);
    }
    function addLocal(folder, variable) {
        folder.scope.locals[variable] = true;
        addDeclaration(folder, variable);
    }
    function addLoopToAst(step, body) {
        var node;
        if (step.content) {
            node = step.content;
        } else {
            node = createWhileTrue();
        }
        convertNodesToAst(step.body, node.body.body);
        body.push(node);
    }
    function addLoopVar(folder, variable) {
        folder.scope.loop[variable] = true;
        addDeclaration(folder, variable);
    }
    function addQuestionToAst(step, body) {
        var content, node;
        content = decodeQuestionContent(step.content);
        node = createIfNode(content);
        convertNodesToAst(step.yes, node.consequent.body);
        if (step.no.length > 0) {
            node.alternate = createBlock();
            convertNodesToAst(step.no, node.alternate.body);
        }
        body.push(node);
    }
    function buildComplexSilhouette(fun, tree, functionBody) {
        var _collection_4, branch, branchState, caseBody, caseClause, defClause, end, firstName, lastBranch, loop, loopBody, ordinal, select;
        branchState = '_branch_';
        addLocal(fun, branchState);
        firstName = tree.branches[0].name;
        pushAssi(branchState, createStringLiteral(firstName), functionBody);
        loop = createWhileTrue();
        functionBody.push(loop);
        loopBody = loop.body.body;
        select = createSwitch(createIdentifier(branchState));
        loopBody.push(select);
        ordinal = 0;
        end = hasEnd(fun);
        _collection_4 = tree.branches;
        for (branch of _collection_4) {
            caseClause = createCase(createStringLiteral(branch.name));
            select.cases.push(caseClause);
            caseBody = caseClause.consequent;
            lastBranch = ordinal === tree.branches.length - 1 && end;
            if (lastBranch) {
                pushAssi(branchState, createIdentifier('undefined'), caseBody);
            }
            convertNodesToAst(branch.body, caseBody);
            if (!endsWithReturn(caseBody)) {
                caseBody.push(createBreak());
            }
            ordinal++;
        }
        defClause = createCase(null);
        defClause.consequent.push(createReturn(null));
        select.cases.push(defClause);
    }
    function buildFunctionAst(fun) {
        var _selectValue_6, drakonJson, funAst, functionBody, tree, treeStr;
        funAst = createFunction(fun.name, fun.arguments);
        if (fun.keywords.async) {
            funAst.async = true;
        }
        functionBody = funAst.body.body;
        drakonJson = JSON.stringify(fun, null, 4);
        treeStr = options.toTree(drakonJson, fun.name, fun.path, options.language);
        tree = JSON.parse(treeStr);
        _selectValue_6 = tree.branches.length;
        if (_selectValue_6 !== 0) {
            if (_selectValue_6 === 1) {
                convertNodesToAst(tree.branches[0].body, functionBody);
            } else {
                convertSilhouetteToAst(fun, tree, functionBody);
            }
        }
        try {
            options.escodegen.generate(funAst);
        } catch (ex) {
            console.log('---------------');
            console.log(ex);
            console.log(JSON.stringify(funAst, null, 4));
        }
        fun.ast = funAst;
    }
    function buildModuleAst(folder) {
        var _collection_8, child, name;
        buildFunctionAst(folder);
        _collection_8 = folder.children;
        for (name in _collection_8) {
            child = _collection_8[name];
            buildFunctionAst(child);
        }
    }
    function checkCancellation() {
        var error;
        if (!state) {
            error = new Error('Cancelled');
            error.cancelled = true;
            throw error;
        }
    }
    function combineModuleAst(module) {
        var _collection_11, child, initBody, name, program, step;
        program = createProgram();
        initBody = getFunBody(module.ast);
        for (step of initBody) {
            program.body.push(step);
        }
        _collection_11 = module.children;
        for (name in _collection_11) {
            child = _collection_11[name];
            program.body.push(child.ast);
        }
        return program;
    }
    function convertNodesToAst(steps, body) {
        var _selectValue_14, step;
        for (step of steps) {
            _selectValue_14 = step.type;
            if (_selectValue_14 === 'action') {
                addActionToAst(step, body);
            } else {
                if (_selectValue_14 === 'question') {
                    addQuestionToAst(step, body);
                } else {
                    if (_selectValue_14 === 'loop') {
                        addLoopToAst(step, body);
                    } else {
                        if (_selectValue_14 === 'error') {
                            addErrorToAst(step, body);
                        } else {
                            if (_selectValue_14 === 'break') {
                                body.push(createBreak());
                            } else {
                                if (_selectValue_14 === 'address') {
                                    addAddressToAst(step, body);
                                } else {
                                    throw new Error('Unexpected step type: ' + step.type);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    function convertSilhouetteToAst(fun, tree, functionBody) {
        var _collection_16, branch;
        gBranches = {};
        _collection_16 = tree.branches;
        for (branch of _collection_16) {
            if (!branch.name) {
                reportError('Branch name cannot be empty', fun.path, branch.id);
                return;
            }
            if (branch.name in gBranches) {
                reportError('Non-unique branch name', fun.path, branch.id);
                return;
            }
            gBranches[branch.name] = branch;
        }
        if (isSimpleSilhouette(tree.branches)) {
            gSimpleSilhouette = true;
            convertNodesToAst(tree.branches[0].body, functionBody);
        } else {
            gSimpleSilhouette = false;
            buildComplexSilhouette(fun, tree, functionBody);
        }
    }
    function createAnd(left, right) {
        return {
            type: 'LogicalExpression',
            operator: '&&',
            left: left,
            right: right
        };
    }
    function createAssignment(identifier, expression) {
        return {
            type: 'AssignmentExpression',
            operator: '=',
            left: identifier,
            right: expression
        };
    }
    function createBlock() {
        return {
            type: 'BlockStatement',
            body: []
        };
    }
    function createBreak() {
        return {
            type: 'BreakStatement',
            label: null
        };
    }
    function createCase(value) {
        return {
            type: 'SwitchCase',
            test: value,
            consequent: []
        };
    }
    function createComputedMember(obj, prop) {
        return {
            type: 'MemberExpression',
            computed: true,
            object: obj,
            property: createIdentifier(prop)
        };
    }
    function createDeclaration(vars) {
        return {
            type: 'VariableDeclaration',
            declarations: vars.map(createVariableDeclaration),
            kind: 'var'
        };
    }
    function createEmptyFunction(name) {
        return {
            type: 'drakon',
            name: name,
            items: {},
            keywords: { 'function': true },
            children: {}
        };
    }
    function createEqual(left, right) {
        return {
            type: 'BinaryExpression',
            operator: '===',
            left: left,
            right: right
        };
    }
    function createExpression(expression) {
        return {
            type: 'ExpressionStatement',
            expression: expression
        };
    }
    function createFor(init, test, update) {
        return {
            type: 'ForStatement',
            init: init,
            test: test,
            update: update,
            body: createBlock()
        };
    }
    function createForIn(variable, collectionExpr) {
        return {
            type: 'ForInStatement',
            left: createIdentifier(variable),
            right: collectionExpr,
            body: createBlock(),
            each: false
        };
    }
    function createForOf(variable, collectionExpr) {
        return {
            type: 'ForOfStatement',
            left: createIdentifier(variable),
            right: collectionExpr,
            body: createBlock()
        };
    }
    function createFunction(name, args) {
        args = args || [];
        return {
            type: 'FunctionDeclaration',
            id: createIdentifier(name),
            params: args.map(createIdentifier),
            body: createBlock(),
            generator: false,
            expression: false,
            async: false
        };
    }
    function createGetValue(valueVar, keyVar, collection) {
        var expr;
        expr = createAssignment(createIdentifier(valueVar), createComputedMember(collection, keyVar));
        expr.loopInternal = true;
        return expr;
    }
    function createIdentifier(name) {
        return {
            type: 'Identifier',
            name: name
        };
    }
    function createIfNode(content) {
        return {
            type: 'IfStatement',
            test: content,
            consequent: createBlock()
        };
    }
    function createNot(operand) {
        return {
            type: 'UnaryExpression',
            operator: '!',
            argument: operand
        };
    }
    function createOr(left, right) {
        return {
            type: 'LogicalExpression',
            operator: '||',
            left: left,
            right: right
        };
    }
    function createPlus(left, right) {
        return {
            type: 'BinaryExpression',
            operator: '+',
            left: left,
            right: right
        };
    }
    function createProgram() {
        return {
            type: 'Program',
            body: []
        };
    }
    function createReturn(value) {
        return {
            type: 'ReturnStatement',
            argument: value
        };
    }
    function createScope(type, name) {
        return {
            _type: 'scope',
            type: type,
            name: name,
            declarations: {},
            loop: {},
            locals: {},
            children: {}
        };
    }
    function createStringLiteral(value) {
        return {
            type: 'Literal',
            value: value,
            raw: JSON.stringify(value)
        };
    }
    function createSwitch(value) {
        return {
            type: 'SwitchStatement',
            discriminant: value,
            cases: []
        };
    }
    function createThrow(message) {
        return {
            type: 'ThrowStatement',
            argument: {
                type: 'NewExpression',
                callee: createIdentifier('Error'),
                arguments: [message]
            }
        };
    }
    function createVariableDeclaration(variable) {
        return {
            type: 'VariableDeclarator',
            id: createIdentifier(variable),
            init: null
        };
    }
    function createWhileTrue() {
        return {
            type: 'WhileStatement',
            test: {
                type: 'Literal',
                value: true,
                raw: 'true'
            },
            body: createBlock()
        };
    }
    function decodeQuestionContent(content) {
        var _selectValue_18, decoded, left, right;
        _selectValue_18 = content.operator;
        if (_selectValue_18 === 'not') {
            decoded = decodeQuestionContent(content.operand);
            if (decoded.type === 'BinaryExpression' && decoded.operator === '===') {
                decoded.operator = '!==';
                return decoded;
            } else {
                return createNot(decodeQuestionContent(content.operand));
            }
        } else {
            if (_selectValue_18 === 'and') {
                left = decodeQuestionContent(content.left);
                right = decodeQuestionContent(content.right);
                return createAnd(left, right);
            } else {
                if (_selectValue_18 === 'or') {
                    left = decodeQuestionContent(content.left);
                    right = decodeQuestionContent(content.right);
                    return createOr(left, right);
                } else {
                    if (_selectValue_18 === 'equal') {
                        left = decodeQuestionContent(content.left);
                        right = decodeQuestionContent(content.right);
                        return createEqual(left, right);
                    } else {
                        return content;
                    }
                }
            }
        }
    }
    function endsWithReturn(caseBody) {
        var last;
        if (caseBody.length === 0) {
            return false;
        } else {
            last = caseBody[caseBody.length - 1];
            if (last.type === 'ReturnStatement' || last.type === 'ThrowStatement') {
                return true;
            } else {
                return false;
            }
        }
    }
    function enrichFolder(folder) {
        if (!folder.keywords) {
            folder.keywords = {};
        }
        if (!folder.items) {
            folder.items = {};
        }
        if (!folder.children) {
            folder.children = {};
        }
    }
    function ensureExpression(folder, id, item) {
        var expression;
        expression = getExpression(item);
        if (expression) {
            item.content = expression;
            return true;
        } else {
            reportError('A value expression is expected here', folder.path, id);
            return false;
        }
    }
    function ensureHasContent(folder, id, item) {
        if (item.content && item.content.length > 0) {
            return true;
        } else {
            reportError('Icon cannot be empty', folder.path, id);
            return false;
        }
    }
    function generateId(prefix) {
        var id;
        id = prefix + '_' + nextId;
        nextId++;
        return id;
    }
    function getExpression(item) {
        var expr;
        if (item.content && item.content.length === 1) {
            expr = item.content[0];
            if (expr.type === 'ExpressionStatement' && expr.expression.type !== 'AssignmentExpression' && expr.expression.type !== 'SequenceExpression') {
                return expr.expression;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }
    function getFunBody(fun) {
        return fun.body.body;
    }
    function hasEnd(fun) {
        var _collection_20, id, item;
        _collection_20 = fun.items;
        for (id in _collection_20) {
            item = _collection_20[id];
            if (item.type === 'end') {
                return true;
            }
        }
        return false;
    }
    function insertActionBefore(folder, beforeId, expression) {
        var _collection_32, existingItem, id, item, itemId;
        id = generateId('_item_');
        item = {
            id: id,
            type: 'action',
            content: [createExpression(expression)],
            one: beforeId
        };
        _collection_32 = folder.items;
        for (itemId in _collection_32) {
            existingItem = _collection_32[itemId];
            if (existingItem.one === beforeId) {
                existingItem.one = id;
            }
            if (existingItem.two === beforeId) {
                existingItem.two = id;
            }
        }
        folder.items[id] = item;
    }
    function isSimpleSilhouette(branches) {
        var branch, i;
        for (i = 0; i < branches.length; i++) {
            branch = branches[i];
            if (branch.refs > 1) {
                if (i === branches.length - 1) {
                    return simpleBranch(branch);
                }
                return false;
            }
        }
        return true;
    }
    function normalizeAsync(folder) {
        if (folder.keywords.machine || folder.keywords.async) {
            delete folder.keywords.machine;
            folder.keywords.async = true;
        }
    }
    function parseAction(folder, id, item) {
        parseItemContent(folder, id, item);
    }
    function parseArguments(folder) {
        var name, names;
        names = splitTrim(folder.params, '\n');
        folder.arguments = names;
        for (name of names) {
            addDeclaration(folder, name);
        }
    }
    function parseCase(folder, id, item) {
        parseItemContent(folder, id, item);
        if (item.two) {
            ensureHasContent(folder, id, item);
        }
        if (item.content) {
            ensureExpression(folder, id, item);
        }
    }
    function parseForEachLoop(folder, id, item) {
        var _state_, expr1, expr2, first, newContent, oldContent, second, var1, var2, varName;
        _state_ = 'Get expressions';
        while (true) {
            switch (_state_) {
            case 'Get expressions':
                expr1 = item.content[0];
                expr2 = item.content[1];
                if (expr1.type === 'ExpressionStatement' && expr2.type === 'ExpressionStatement') {
                    first = expr1.expression;
                    second = expr2.expression;
                    if (second.type !== 'Identifier') {
                        varName = generateId('_collection');
                        addLocal(folder, varName);
                        oldContent = second;
                        second = createIdentifier(varName);
                        newContent = createAssignment(createIdentifier(varName), oldContent);
                        insertActionBefore(folder, id, newContent);
                    }
                    if (first.type === 'Identifier') {
                        _state_ = 'Array loop';
                    } else {
                        _state_ = 'Dictionary loop';
                    }
                } else {
                    reportBadLoop(folder, id, item);
                    _state_ = 'Exit';
                }
                break;
            case 'Array loop':
                item.subtype = 'array';
                item.variable = first.name;
                item.content = createForOf(item.variable, second);
                item.content.itemId = id;
                addLoopVar(folder, item.variable);
                _state_ = 'Exit';
                break;
            case 'Dictionary loop':
                if (first.type === 'SequenceExpression' && first.expressions.length === 2) {
                    var1 = first.expressions[0];
                    var2 = first.expressions[1];
                    if (var1.type === 'Identifier' && var2.type === 'Identifier') {
                        item.subtype = 'dictionary';
                        item.keyVariable = var1.name;
                        item.valueVariable = var2.name;
                        insertActionBefore(folder, item.one, createGetValue(item.valueVariable, item.keyVariable, second));
                        item.content = createForIn(item.keyVariable, second);
                        item.content.itemId = id;
                        addLoopVar(folder, item.keyVariable);
                        addLoopVar(folder, item.valueVariable);
                    } else {
                        reportBadLoop(folder, id, item);
                    }
                } else {
                    reportBadLoop(folder, id, item);
                }
                _state_ = 'Exit';
                break;
            case 'Exit':
                _state_ = undefined;
                break;
            default:
                return;
            }
        }
    }
    function parseItem(folder, id, item) {
        var _selectValue_23;
        _selectValue_23 = item.type;
        if (_selectValue_23 === 'action') {
            parseAction(folder, id, item);
        } else {
            if (_selectValue_23 === 'question') {
                parseQuestion(folder, id, item);
            } else {
                if (_selectValue_23 === 'select') {
                    parseSelect(folder, id, item);
                } else {
                    if (_selectValue_23 === 'case') {
                        parseCase(folder, id, item);
                    } else {
                        if (_selectValue_23 === 'loopbegin') {
                            parseLoop(folder, id, item);
                        } else {
                            if (_selectValue_23 === 'soutput') {
                            }
                        }
                    }
                }
            }
        }
    }
    function parseItemContent(folder, id, item) {
        var content;
        content = item.content || '';
        content = content.trim();
        if (content) {
            try {
                item.content = parseNormal(content, id);
            } catch (ex) {
                reportError(ex.message, folder.path, id);
                delete item.content;
            }
        } else {
            delete item.content;
        }
    }
    function parseItems(folder) {
        var _collection_25, child, name;
        if (folder.type === 'drakon') {
            parseItemsInFunction(folder);
            _collection_25 = folder.children;
            for (name in _collection_25) {
                child = _collection_25[name];
                parseItems(child);
            }
        }
    }
    function parseItemsInFunction(folder) {
        var id, ids, item;
        parseArguments(folder);
        normalizeAsync(folder);
        folder.events = {};
        folder.eventItems = [];
        ids = Object.keys(folder.items);
        for (id of ids) {
            item = folder.items[id];
            parseItem(folder, id, item);
        }
    }
    function parseLoop(folder, id, item) {
        var _selectValue_28, init, test, update;
        parseItemContent(folder, id, item);
        if (ensureHasContent(folder, id, item)) {
            _selectValue_28 = item.content.length;
            if (_selectValue_28 === 2) {
                parseForEachLoop(folder, id, item);
            } else {
                if (_selectValue_28 === 3) {
                    init = stripExpression(item.content[0]);
                    test = stripExpression(item.content[1]);
                    update = stripExpression(item.content[2]);
                    item.content = createFor(init, test, update);
                    item.content.itemId = id;
                } else {
                    reportBadLoop(folder, id, item);
                }
            }
        }
    }
    function parseNormal(content, id) {
        var node, parsed, result, wrapped;
        wrapped = 'async function _wpd_() {' + content + '\n}';
        parsed = options.esprima.parseScript(wrapped, { loc: false });
        result = parsed.body[0].body.body;
        for (node of result) {
            node.itemId = id;
        }
        return result;
    }
    function parseQuestion(folder, id, item) {
        parseItemContent(folder, id, item);
        if (ensureHasContent(folder, id, item)) {
            ensureExpression(folder, id, item);
        }
    }
    function parseSelect(folder, id, item) {
        var expr, newContent, varName;
        parseItemContent(folder, id, item);
        if (ensureHasContent(folder, id, item) && ensureExpression(folder, id, item)) {
            expr = item.content;
            if (expr.type === 'Identifier') {
                if (expr.name === 'receive') {
                    folder.eventItems.push(id);
                }
            } else {
                varName = generateId('_selectValue');
                addLocal(folder, varName);
                item.content = createIdentifier(varName);
                newContent = createAssignment(createIdentifier(varName), expr);
                insertActionBefore(folder, id, newContent);
            }
        }
    }
    function pushAssi(variable, value, body) {
        body.push(createExpression(createAssignment(createIdentifier(variable), value)));
    }
    async function readChildren(folder) {
        var _collection_30, child, childPath, result;
        result = [];
        _collection_30 = folder.children;
        for (childPath of _collection_30) {
            child = await options.getObjectByHandle(childPath);
            if (child) {
                result.push(child);
            }
        }
        return result;
    }
    async function readFolder(folder) {
        var child, children, childrenByName;
        checkCancellation();
        children = await readChildren(folder);
        childrenByName = {};
        for (child of children) {
            if (child.type === 'folder') {
                await readFolder(child);
            } else {
                if (!child.keywords) {
                    child.keywords = {};
                }
                if (!child.items) {
                    child.items = {};
                }
            }
            childrenByName[child.name] = child;
        }
        folder.children = childrenByName;
    }
    async function readModuleFolder(parent, folder) {
        var child, children;
        children = await readChildren(folder);
        for (child of children) {
            if (child.type === 'folder') {
                await readModuleFolder(parent, child);
            } else {
                if (child.name === 'module') {
                    reportError('module is not expected in this folder', child.path);
                } else {
                    addChild(parent, child);
                }
            }
        }
    }
    async function readRootFolder() {
        var child, children, module, rootFolder;
        rootFolder = await options.getObjectByHandle(options.root);
        module = createEmptyFunction('module');
        module.type === 'module';
        module.scope = createScope('module', 'module');
        children = await readChildren(rootFolder);
        for (child of children) {
            if (child.type === 'folder') {
                await readModuleFolder(module, child);
            } else {
                if (child.name === 'module') {
                    enrichFolder(child);
                    if (child.keywords.async) {
                        reportError('module cannot be async', child.path);
                    }
                    if (child.params) {
                        reportError('module cannot have arguments', child.path);
                    }
                    module.items = child.items;
                } else {
                    addChild(rootFolder, child);
                }
            }
        }
        return module;
    }
    function reportBadLoop(folder, id, item) {
        reportError('Error in loop icon', folder.path, id);
        delete item.content;
    }
    function reportError(message, filename, nodeId, data) {
        state = undefined;
        failed = true;
        options.onError({
            message: message,
            filename: filename,
            nodeId: nodeId,
            data: data
        });
    }
    async function run() {
        var _state_, ast, module, src;
        _state_ = 'Init';
        while (true) {
            switch (_state_) {
            case 'Init':
                if (state !== 'idle') {
                    throw new Error('Invalid state');
                }
                state = 'started';
                _state_ = 'Read project';
                break;
            case 'Read project':
                module = await readRootFolder();
                if (failed) {
                    _state_ = 'Exit';
                } else {
                    _state_ = 'Parse items';
                }
                break;
            case 'Parse items':
                parseItems(module);
                if (failed) {
                    _state_ = 'Exit';
                } else {
                    _state_ = 'Build AST';
                }
                break;
            case 'Build AST':
                buildModuleAst(module);
                if (failed) {
                    _state_ = 'Exit';
                } else {
                    ast = combineModuleAst(module);
                    _state_ = 'Build source code';
                }
                break;
            case 'Build source code':
                src = options.escodegen.generate(ast);
                await options.onData(src);
                _state_ = 'Exit';
                break;
            case 'Exit':
                _state_ = undefined;
                break;
            default:
                return;
            }
        }
    }
    function simpleBranch(branch) {
        if (branch.body.length === 0 || branch.body.length === 1 && branch.body[0].type === 'action') {
            return true;
        } else {
            return false;
        }
    }
    function stop() {
        state = undefined;
    }
    function stripExpression(node) {
        if (node.type === 'ExpressionStatement') {
            return node.expression;
        } else {
            return node;
        }
    }
    self.run = run;
    self.stop = stop;
    return self;
}
function pause(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
function splitTrim(text, separator) {
    var parts, trimmed;
    text = text || '';
    parts = text.split(separator);
    trimmed = parts.map(part => part.trim());
    return trimmed.filter(part => Boolean(part));
}
module.exports = { Js2604Generator };