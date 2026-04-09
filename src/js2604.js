const {sortBy, findFirst, addRange, clone, replace} = require('./tools');
function Js2604Generator(options) {
    var self = {};
    var failed, nextId, state;
    state = 'idle';
    failed = false;
    nextId = 2;
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
    function addLoopVar(folder, variable) {
        folder.scope.loop[variable] = true;
        addDeclaration(folder, variable);
    }
    function buildAsts(folder) {
        var _collection_2, child, name;
        if (folder.type !== 'folder') {
            _collection_2 = folder.children;
            for (name in _collection_2) {
                child = _collection_2[name];
                buildAsts(child);
            }
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
    function createComputedMember(obj, prop) {
        return {
            type: 'MemberExpression',
            computed: true,
            object: obj,
            property: createIdentifier(prop)
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
    function createGetValue(valueVar, keyVar, collection) {
        var expr;
        expr = createAssignment(valueVar, createComputedMember(collection, keyVar));
        expr.loopInternal = true;
        return expr;
    }
    function createIdentifier(name) {
        return {
            type: 'Identifier',
            name: name
        };
    }
    function createScope(type, name) {
        return {
            _type: 'scope',
            type: type,
            name: name,
            declarations: {},
            loop: {},
            children: {}
        };
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
    function insertActionBefore(folder, beforeId, expression) {
        var _collection_12, existingItem, id, item, itemId;
        id = generateId('_item_');
        item = {
            id: id,
            type: 'action',
            content: [createExpression(expression)],
            one: beforeId
        };
        _collection_12 = folder.items;
        for (itemId in _collection_12) {
            existingItem = _collection_12[itemId];
            if (existingItem.one === beforeId) {
                existingItem.one = id;
            }
            if (existingItem.two === beforeId) {
                existingItem.two = id;
            }
        }
        folder.items[id] = item;
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
        folder.argNames = names;
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
        var _selectValue_5;
        _selectValue_5 = item.type;
        if (_selectValue_5 === 'action') {
            parseAction(folder, id, item);
        } else {
            if (_selectValue_5 === 'question') {
                parseQuestion(folder, id, item);
            } else {
                if (_selectValue_5 === 'select') {
                    parseSelect(folder, id, item);
                } else {
                    if (_selectValue_5 === 'case') {
                        parseCase(folder, id, item);
                    } else {
                        if (_selectValue_5 === 'loopbegin') {
                            parseLoop(folder, id, item);
                        } else {
                            if (_selectValue_5 === 'soutput') {
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
        var _collection_7, child, name;
        if (folder.type === 'drakon') {
            parseItemsInFunction(folder);
            _collection_7 = folder.children;
            for (name in _collection_7) {
                child = _collection_7[name];
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
        var _selectValue_10, init, test, update;
        parseItemContent(folder, id, item);
        if (ensureHasContent(folder, id, item)) {
            _selectValue_10 = item.content.length;
            if (_selectValue_10 === 2) {
                parseForEachLoop(folder, id, item);
            } else {
                if (_selectValue_10 === 3) {
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
                item.content = createIdentifier(varName);
                newContent = createAssignment(createIdentifier(varName), expr);
                insertActionBefore(folder, id, newContent);
            }
        }
    }
    async function readChildren(folder) {
        var _collection_15, child, childPath, result;
        result = [];
        _collection_15 = folder.children;
        for (childPath of _collection_15) {
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
        var _state_, content, module;
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
                _state_ = 'Build source code';
                break;
            case 'Build source code':
                content = JSON.stringify(module, null, 4);
                await options.onData(content);
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