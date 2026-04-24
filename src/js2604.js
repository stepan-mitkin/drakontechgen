const {sortBy, findFirst, addRange, clone, replace} = require('./tools');
function Js2604Generator(options) {
    var self = { _type: 'Js2604Generator' };
    var failed, gBranches, gById, gDebugAst, gDropAddress, gSimpleSilhouette, nextId, state;
    state = 'idle';
    failed = false;
    nextId = 2;
    gSimpleSilhouette = true;
    gDropAddress = false;
    gBranches = {};
    gDebugAst = false;
    gById = {};
    function addActionToAst(step, body) {
        var _collection_139, expr;
        if (step.content) {
            _collection_139 = step.content;
            for (expr of _collection_139) {
                body.push(expr);
            }
        }
    }
    function addAddressToAst(step, body) {
        var assi, nextBranch, statement;
        if (!gDropAddress) {
            if (gSimpleSilhouette) {
                nextBranch = gBranches[step.content];
                convertNodesToAst(nextBranch.body, body);
            } else {
                assi = createAssignment(createIdentifier('_branch_'), createStringLiteral(step.content));
                statement = createExpression(assi);
                body.push(statement);
            }
        }
    }
    function addChild(parent, folder) {
        var scope;
        if (isFunctionNameUnique(parent, folder.name)) {
            enrichFolder(folder);
            scope = createScope('function', folder.name);
            folder.scope = scope;
            parent.children[folder.name] = folder;
            folder.parent = parent.id;
            generateFunctionId(folder);
        } else {
            reportError('Name is not unique: ' + folder.name, folder.path, undefined);
        }
    }
    function addDeclaration(scope, name) {
        scope.declarations[name] = true;
    }
    function addDeclarationsInFunction(step) {
        var visitor;
        visitor = function (node) {
            return scanForAssignments(step, node);
        };
        traverseAst(step.body, visitor);
        addDeclaratonsToBody(step);
    }
    function addDeclarationsRecursive(step, folder) {
        var _collection_170, canDeclare, child, childStep, name;
        addDeclarationsInFunction(step);
        _collection_170 = folder.children;
        for (name in _collection_170) {
            child = _collection_170[name];
            canDeclare = child.type === 'class';
            childStep = createScopeStep(step, name, child.path, child.scope, getFunBody(child.ast), true, canDeclare);
            childStep.canAwait = child.keywords.async;
            addDeclarationsRecursive(childStep, child);
        }
    }
    function addDeclaratonsToBody(step) {
        var allVars, locals, loop;
        locals = Object.keys(step.scope.locals);
        loop = Object.keys(step.scope.loop);
        allVars = locals.concat(loop);
        if (!(allVars.length === 0)) {
            allVars.sort();
            step.body.unshift(createDeclaration(allVars));
        }
    }
    function addDefaultReturnNull(sw) {
        var cs;
        cs = createCase(null);
        sw.cases.push(cs);
        cs.consequent.push(createReturn(createIdentifier('false')));
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
    function addEventCase(event, cs) {
        var _collection_141, arg;
        cs.consequent.push(parseStatement('_args_=[]'));
        cs.consequent.push(parseStatement('_args_.push("' + event.name + '")'));
        _collection_141 = event.args;
        for (arg of _collection_141) {
            cs.consequent.push(parseStatement('_args_.push(' + arg + ')'));
        }
        cs.consequent.push(parseStatement('me._busy =true'));
        cs.consequent.push(parseStatement('_topGen_.next(_args_)'));
        cs.consequent.push(createBreak());
    }
    function addEventSignature(folder, caseId, caseItem) {
        var args, eventInfo, existing, name, signature;
        name = caseItem.content.callee.name;
        args = caseItem.content.arguments.map(arg => arg.name);
        signature = args.join(',');
        existing = folder.events[name];
        if (existing) {
            if (signature === existing.signature) {
                return name;
            } else {
                reportError('Incompatible signature', folder.path, caseId);
                return undefined;
            }
        } else {
            eventInfo = {
                name: name,
                signature: signature,
                args: args
            };
            folder.events[name] = eventInfo;
            return name;
        }
    }
    function addExports(module, src) {
        var _collection_204, child, code, dep, deps, exportSrc, exported, line, lines, name, parsed;
        exported = [];
        _collection_204 = module.children;
        for (name in _collection_204) {
            child = _collection_204[name];
            if (child.keywords.export) {
                exported.push(child.name);
            }
        }
        if (exported.length === 0) {
            return src;
        } else {
            exported.sort();
            if (isIife()) {
                code = exported.map(name => 'window.' + name + '=' + name).join('\n');
            } else {
                if (isUnit()) {
                    lines = exported.map(name => 'unit.' + name + '=' + name);
                    deps = getDependencies();
                    for (dep of deps) {
                        line = 'Object.defineProperty(unit,\'' + dep + '\',{get:function(){return ' + dep + ';},set:function(newValue){' + dep + '=newValue;},enumerable:true,configurable:true});';
                        lines.push(line);
                    }
                    code = lines.join('\n');
                } else {
                    code = 'module.exports = {' + exported.join(', ') + '}';
                }
            }
            parsed = options.esprima.parseScript(code, { loc: false });
            exportSrc = options.escodegen.generate(parsed);
            return src + '\n' + exportSrc;
        }
    }
    function addInputEvent(folder, item, id) {
        var name;
        item.eventNames = [];
        if (ensureCall(folder, id, item)) {
            name = addEventSignature(folder, id, item);
            if (name) {
                item.eventNames.push(name);
                rewriteEventInput(folder, id, item, name);
            }
        }
    }
    function addLocal(scope, variable) {
        scope.locals[variable] = true;
        addDeclaration(scope, variable);
    }
    function addLoopToAst(step, body) {
        var node;
        if (step.content) {
            node = step.content;
            node = clone(step.content);
            node.body = createBlock();
        } else {
            node = createWhileTrue();
        }
        convertNodesToAst(step.body, node.body.body);
        body.push(node);
    }
    function addLoopVar(scope, variable) {
        scope.loop[variable] = true;
        addDeclaration(scope, variable);
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
    function addResolveAtEnd(ast) {
        var body, last;
        body = ast.body.body;
        if (body.length === 0) {
            body.push(parseStatement('_topResolve_()'));
        } else {
            last = body[body.length - 1];
            if (!(last.type === 'ReturnStatement')) {
                body.push(parseStatement('_topResolve_()'));
            }
        }
    }
    function addSelectEvent(folder, item, id) {
        var _collection_186, caseId, caseItem, content, lines, name;
        addLocal(folder.scope, '_eventType_');
        addLocal(folder.scope, '_event_');
        item.content = createIdentifier('_eventType_');
        lines = [
            'me.state = "' + id + '"',
            'me._busy = false',
            '_event_ = yield',
            '_eventType_ = _event_[0]'
        ];
        content = linesToContent(folder, id, lines);
        insertActionBefore(folder, id, content);
        item.eventNames = [];
        _collection_186 = item.cases;
        for (caseId of _collection_186) {
            caseItem = folder.items[caseId];
            if (ensureCall(folder, caseId, caseItem)) {
                name = addEventSignature(folder, caseId, caseItem);
                if (name) {
                    item.eventNames.push(name);
                    rewriteEventCase(folder, caseId, caseItem, name);
                }
            }
        }
    }
    function addVariableDeclarations(module) {
        var rootStep;
        rootStep = createScopeStep(undefined, 'module', module.path, module.scope, getFunBody(module.ast), true, true);
        addDeclarationsRecursive(rootStep, module);
    }
    function assignEventArguments(folder, name, lines) {
        var _collection_188, arg, counter, eventInfo;
        eventInfo = folder.events[name];
        counter = 1;
        _collection_188 = eventInfo.args;
        for (arg of _collection_188) {
            lines.push(arg + ' = _event_[' + counter + ']');
            counter++;
        }
    }
    function buildComplexSilhouette(fun, tree, functionBody) {
        var _collection_143, branch, branchState, caseBody, caseClause, defClause, end, firstName, lastBranch, loop, loopBody, ordinal, select;
        branchState = '_branch_';
        addLocal(fun.scope, branchState);
        firstName = tree.branches[0].name;
        pushAssi(branchState, createStringLiteral(firstName), functionBody);
        loop = createWhileTrue();
        functionBody.push(loop);
        loopBody = loop.body.body;
        select = createSwitch(createIdentifier(branchState));
        loopBody.push(select);
        ordinal = 0;
        end = hasEnd(fun);
        _collection_143 = tree.branches;
        for (branch of _collection_143) {
            if (!(branch.name === 'catch')) {
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
            }
            ordinal++;
        }
        defClause = createCase(null);
        if (fun.isMachine) {
            defClause.consequent.push(parseStatement('_topResolve_()'));
        }
        defClause.consequent.push(createReturn(null));
        select.cases.push(defClause);
    }
    function buildFunctionAst(fun) {
        var _selectValue_145, drakonJson, funAst, functionBody, genOptions, tree, treeStr;
        funAst = createFunction(fun.name, fun.arguments);
        if (fun.keywords.async) {
            funAst.async = true;
        }
        functionBody = funAst.body.body;
        drakonJson = JSON.stringify(fun, null, 4);
        genOptions = { secondary: 'catch' };
        try {
            treeStr = options.toTree(drakonJson, fun.name, fun.path, options.language, genOptions);
        } catch (ex) {
            reportError(ex.message, fun.path, ex.nodeId);
            return funAst;
        }
        tree = JSON.parse(treeStr);
        _selectValue_145 = tree.branches.length;
        if (!(_selectValue_145 === 0)) {
            if (_selectValue_145 === 1) {
                convertNodesToAst(tree.branches[0].body, functionBody);
            } else {
                convertSilhouetteToAst(fun, tree, functionBody);
            }
        }
        if (gDebugAst) {
            try {
                options.escodegen.generate(funAst);
            } catch (ex) {
                console.log('---------------');
                console.log(ex);
                console.log(JSON.stringify(funAst, null, 4));
            }
        }
        return funAst;
    }
    function buildLauncherAst(fun, className) {
        var argstr, functionBody, name, originalName;
        fun.ast = createFunction(fun.name, fun.arguments);
        fun.scope = createScope('function', fun.name);
        functionBody = fun.ast.body.body;
        if (className) {
            originalName = makeMethodName(className, fun.name);
        } else {
            originalName = fun.name;
        }
        name = makeCreateName(originalName);
        argstr = fun.arguments.join(', ');
        functionBody.push(parseStatement('_obj_ = ' + name + '(' + argstr + ')'));
        functionBody.push(parseStatement('return _obj_.run()'));
    }
    function buildMachineAst(parent, fun) {
        var _collection_147, _collection_149, ctr, eventName, evt, functionBody, guard, mainAst, me, name, runAst;
        ctr = createEmptyFunction(makeCreateName(fun.name));
        ctr.arguments = fun.arguments.slice();
        if (fun.keywords.export) {
            ctr.keywords.export = true;
        }
        addChild(parent, ctr);
        _collection_147 = ctr.arguments;
        for (name of _collection_147) {
            addDeclaration(ctr.scope, name);
        }
        ctr.ast = createFunction(ctr.name, ctr.arguments);
        functionBody = ctr.ast.body.body;
        addLocal(ctr.scope, '_earlyPromise_');
        addLocal(ctr.scope, '_topGen_');
        addLocal(ctr.scope, '_topResolve_');
        addLocal(ctr.scope, '_topReject_');
        me = 'me = {_type:"' + fun.originalName + '",_busy:true,state:"created"}';
        functionBody.push(parseStatement(me));
        functionBody.push(parseStatement('_topResolve_ = function(_value_)' + '{_earlyPromise_ = Promise.resolve(_value_);}'));
        functionBody.push(parseStatement('_topReject_ = function(_value_)' + '{throw _value_;}'));
        replaceReturnInMachine(fun);
        mainAst = buildFunctionAst(fun);
        addResolveAtEnd(mainAst);
        mainAst.id.name = makeMainName(fun.name);
        mainAst.params = [];
        mainAst.async = false;
        mainAst.generator = true;
        functionBody.push(mainAst);
        runAst = createFunction(makeRunName(fun.name));
        functionBody.push(runAst);
        guard = [
            'if(me.state!=="created")',
            '{throw new Error("run() can be called only once");}'
        ];
        runAst.body.body.push(parseStatement(guard.join('')));
        runAst.body.body.push(parseStatement('me.state="started"'));
        runAst.body.body.push(parseStatement('_topGen_ = ' + makeMainName(fun.name) + '()'));
        runAst.body.body.push(parseStatement('_topGen_.next()'));
        runAst.body.body.push(parseStatement('if (_earlyPromise_){return _earlyPromise_;}'));
        runAst.body.body.push(parseStatement('return new Promise((resolve, reject) => {' + '_topResolve_ = resolve;_topReject_=reject;})'));
        functionBody.push(parseStatement('me.run=' + makeRunName(fun.name)));
        functionBody.push(parseStatement('me.stop=function() {me.state=undefined;}'));
        _collection_149 = fun.events;
        for (eventName in _collection_149) {
            evt = _collection_149[eventName];
            createEventMethod(fun, eventName, functionBody);
        }
        functionBody.push(parseStatement('return me'));
    }
    function buildModuleAst(folder) {
        var child, className, name, names;
        folder.ast = buildFunctionAst(folder);
        names = Object.keys(folder.children);
        names.sort();
        for (name of names) {
            child = folder.children[name];
            if (child.isMachine) {
                buildMachineAst(folder, child);
                if (folder.type === 'class') {
                    className = folder.name;
                } else {
                    className = undefined;
                }
                buildLauncherAst(child, className);
            } else {
                buildModuleAst(child);
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
    function collectReceiveCases(folder, item) {
        var caseItem, current;
        item.cases = [];
        current = item.one;
        while (true) {
            if (current) {
                item.cases.push(current);
                caseItem = folder.items[current];
                current = caseItem.two;
            } else {
                break;
            }
        }
    }
    function combineClassAst(folder) {
        var child, exported, initBody, name, names, stm;
        initBody = getFunBody(folder.ast);
        stm = 'var self = {_type:"' + folder.name + '"}';
        initBody.unshift(parseStatement(stm));
        exported = [];
        names = Object.keys(folder.children);
        names.sort();
        for (name of names) {
            child = folder.children[name];
            initBody.push(child.ast);
            if (child.keywords.export) {
                child.ast.id.name = makeMethodName(folder.name, name);
                exported.push(name);
            }
        }
        exported.sort();
        for (name of exported) {
            initBody.push(parseStatement('self.' + name + ' = ' + makeMethodName(folder.name, name)));
        }
        initBody.push(parseStatement('return self'));
        return folder.ast;
    }
    function combineModuleAst(module) {
        var child, childAst, initBody, name, names, program, step;
        program = createProgram();
        initBody = getFunBody(module.ast);
        for (step of initBody) {
            program.body.push(step);
        }
        names = Object.keys(module.children);
        names.sort();
        for (name of names) {
            child = module.children[name];
            if (child.type === 'class') {
                childAst = combineClassAst(child);
            } else {
                childAst = child.ast;
            }
            program.body.push(childAst);
        }
        return program;
    }
    function convertNodesToAst(steps, body) {
        var _selectValue_152, step;
        for (step of steps) {
            _selectValue_152 = step.type;
            if (_selectValue_152 === 'action') {
                addActionToAst(step, body);
            } else {
                if (_selectValue_152 === 'question') {
                    addQuestionToAst(step, body);
                } else {
                    if (_selectValue_152 === 'loop') {
                        addLoopToAst(step, body);
                    } else {
                        if (_selectValue_152 === 'error') {
                            addErrorToAst(step, body);
                        } else {
                            if (_selectValue_152 === 'break') {
                                if (!endsWithReturn(body)) {
                                    body.push(createBreak());
                                }
                            } else {
                                if (_selectValue_152 === 'address') {
                                    if (!endsWithReturn(body)) {
                                        addAddressToAst(step, body);
                                    }
                                } else {
                                    console.log('Unexpected step type: ' + step.type);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    function convertReturnToResolve(stm, fun) {
        var arg;
        arg = stm.argument;
        delete stm.argument;
        stm.type = 'ExpressionStatement';
        stm.expression = {
            'type': 'CallExpression',
            'callee': {
                'type': 'Identifier',
                'name': fun
            },
            'arguments': [arg]
        };
    }
    function convertSilhouetteToAst(fun, tree, functionBody) {
        var _collection_154, branch, catchBranch, catchNode;
        gBranches = {};
        _collection_154 = tree.branches;
        for (branch of _collection_154) {
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
        if (tree.secondary) {
            gDropAddress = true;
            catchNode = createTryCatch('_handlerData_');
            functionBody.push(catchNode);
            catchBranch = tree.branches[tree.secondary];
            convertNodesToAst(catchBranch.body, catchNode.handler.body.body);
            functionBody = catchNode.block.body;
        }
        gDropAddress = false;
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
            keywords: {},
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
    function createEventMethod(fun, eventName, functionBody) {
        var _collection_156, body, cs, def, event, eventItem, funAst, itemId, sw;
        event = fun.events[eventName];
        funAst = createFunction(eventName, event.args);
        delete funAst.id;
        funAst.type = 'FunctionExpression';
        body = getFunBody(funAst);
        body.push(parseStatement('if (me._busy) {throw new Error("Synchronous reentry is not allowed");}'));
        sw = createSwitch(createMember(createIdentifier('me'), 'state'));
        body.push(sw);
        _collection_156 = fun.eventItems;
        for (itemId of _collection_156) {
            eventItem = fun.items[itemId];
            if (!(eventItem.eventNames.indexOf(eventName) === -1)) {
                cs = createCase(createStringLiteral(itemId));
                sw.cases.push(cs);
            }
        }
        addEventCase(event, cs);
        def = createCase(null);
        sw.cases.push(def);
        def.consequent.push(createBreak());
        functionBody.push(createExpression(createAssignment(createMember(createIdentifier('me'), eventName), funAst)));
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
    function createMember(obj, prop) {
        return {
            type: 'MemberExpression',
            computed: false,
            object: obj,
            property: createIdentifier(prop)
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
    function createScopeStep(parent, name, path, scope, body, canAssign, canDeclare) {
        return {
            parent: parent,
            name: name,
            path: path || '',
            scope: scope,
            body: body,
            canAssign: canAssign || false,
            canDeclare: canDeclare || false
        };
    }
    function createScopeStepForLambda(step, node) {
        var _collection_173, nextScope, nextStep, param;
        nextScope = createScope('lambda', 'lambda');
        _collection_173 = node.params;
        for (param of _collection_173) {
            if (param.type === 'Identifier') {
                addDeclaration(nextScope, param.name);
            }
        }
        nextStep = createScopeStep(step, 'lambda', step.path, nextScope, node.body.body, true, false);
        nextStep.itemId = step.itemId;
        return nextStep;
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
    function createTryCatch(variableName) {
        return {
            'type': 'TryStatement',
            'block': {
                'type': 'BlockStatement',
                'body': []
            },
            'handler': {
                'type': 'CatchClause',
                'param': {
                    'type': 'Identifier',
                    'name': variableName
                },
                'body': {
                    'type': 'BlockStatement',
                    'body': []
                }
            },
            'finalizer': null
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
        var _selectValue_158, decoded, left, right;
        _selectValue_158 = content.operator;
        if (_selectValue_158 === 'not') {
            decoded = decodeQuestionContent(content.operand);
            return createNot(decoded);
        } else {
            if (_selectValue_158 === 'and') {
                left = decodeQuestionContent(content.left);
                right = decodeQuestionContent(content.right);
                return createAnd(left, right);
            } else {
                if (_selectValue_158 === 'or') {
                    left = decodeQuestionContent(content.left);
                    right = decodeQuestionContent(content.right);
                    return createOr(left, right);
                } else {
                    if (_selectValue_158 === 'equal') {
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
    function ensureCall(folder, id, item) {
        var _collection_190, arg;
        if (item.content && (item.content.type === 'CallExpression' && item.content.callee.type === 'Identifier')) {
            _collection_190 = item.content.arguments;
            for (arg of _collection_190) {
                if (!(arg.type === 'Identifier')) {
                    reportError('This call expression expects variables', folder.path, id);
                    return false;
                }
            }
            return true;
        } else {
            reportError('A function call expression expected here', folder.path, id);
            return false;
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
    function extractVariablesFromDeclaration(node, scope) {
        var _collection_175, _collection_179, _collection_181, _selectValue_177, decl, item, prop;
        _collection_175 = node.declarations;
        for (decl of _collection_175) {
            if (decl.type === 'VariableDeclarator') {
                _selectValue_177 = decl.id.type;
                if (_selectValue_177 === 'ObjectPattern') {
                    _collection_181 = decl.id.properties;
                    for (prop of _collection_181) {
                        tryAddIdentifier(scope, prop.key);
                    }
                } else {
                    if (_selectValue_177 === 'ArrayPattern') {
                        _collection_179 = decl.id.elements;
                        for (item of _collection_179) {
                            tryAddIdentifier(scope, item);
                        }
                    } else {
                        tryAddIdentifier(scope, decl.id);
                    }
                }
            }
        }
    }
    function findClassDiagram(folders) {
        var cls, folder;
        cls = undefined;
        for (folder of folders) {
            if (folder.name === 'class') {
                enrichFolder(folder);
                cls = folder;
            } else {
                if (folder.name === 'module') {
                    reportError('module is not expected in this folder', folder.path);
                }
            }
        }
        return cls;
    }
    function generateFunctionId(folder) {
        folder.id = generateId('fun');
        gById[folder.id] = folder;
    }
    function generateId(prefix) {
        var id;
        id = prefix + '_' + nextId;
        nextId++;
        return id;
    }
    function getDepDeclarations() {
        var dependencies;
        dependencies = getDependencies();
        return dependencies.map(dep => 'var ' + dep + ';').join('\n') + '\n';
    }
    function getDependencies() {
        var deps;
        if (options.settings && options.settings.dependencies) {
            deps = splitTrim(options.settings.dependencies, '\n');
            deps.sort();
            return deps;
        } else {
            return [];
        }
    }
    function getExpression(item) {
        var expr;
        if (item.content && item.content.length === 1) {
            expr = item.content[0];
            if (expr.type === 'ExpressionStatement' && !(expr.expression.type === 'AssignmentExpression') && !(expr.expression.type === 'SequenceExpression')) {
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
        var _collection_160, id, item;
        _collection_160 = fun.items;
        for (id in _collection_160) {
            item = _collection_160[id];
            if (item.type === 'end') {
                return true;
            }
        }
        return false;
    }
    function insertActionAfter(folder, existingId, content) {
        var before, id, item;
        id = generateId('_item_');
        before = folder.items[existingId];
        item = {
            id: id,
            type: 'action',
            content: content,
            one: before.one
        };
        before.one = id;
        folder.items[id] = item;
    }
    function insertActionBefore(folder, beforeId, expression) {
        var _collection_201, content, existingItem, id, item, itemId;
        id = generateId('_item_');
        if (Array.isArray(expression)) {
            content = expression;
        } else {
            content = [createExpression(expression)];
        }
        item = {
            id: id,
            type: 'action',
            content: content,
            one: beforeId
        };
        _collection_201 = folder.items;
        for (itemId in _collection_201) {
            existingItem = _collection_201[itemId];
            if (existingItem.one === beforeId) {
                existingItem.one = id;
            }
            if (existingItem.two === beforeId) {
                existingItem.two = id;
            }
        }
        folder.items[id] = item;
    }
    function isDeclared(step, varName) {
        var current;
        current = step;
        while (true) {
            if (current) {
                if (varName in current.scope.declarations) {
                    return true;
                } else {
                    current = current.parent;
                }
            } else {
                return false;
            }
        }
    }
    function isFunctionNameUnique(parent, name) {
        var current;
        current = parent;
        while (true) {
            if (name in current.children) {
                return false;
            } else {
                if (current.parent) {
                    current = gById[current.parent];
                } else {
                    return true;
                }
            }
        }
    }
    function isIife() {
        if (options.settings && options.settings.iife) {
            return true;
        } else {
            return false;
        }
    }
    function isSimpleSilhouette(branches) {
        var branch, i;
        for (i = 0; i < branches.length; i++) {
            branch = branches[i];
            if (branch.refs > 1) {
                if (i === branches.length - 1) {
                    return simpleBranch(branch);
                } else {
                    return false;
                }
            }
        }
        return true;
    }
    function isUnit() {
        if (options.settings && options.settings.unit) {
            return true;
        } else {
            return false;
        }
    }
    function linesToContent(folder, id, lines) {
        var dummyItem, src;
        src = lines.join('\n');
        dummyItem = { content: src };
        parseItemContent(folder, id, dummyItem);
        return dummyItem.content;
    }
    function makeCreateName(name) {
        return name + '_create';
    }
    function makeMainName(name) {
        return name + '_main';
    }
    function makeMethodName(className, name) {
        return name;
    }
    function makeRunName(name) {
        return name + '_run';
    }
    function mustStop() {
        if (!failed && state) {
            return false;
        } else {
            return true;
        }
    }
    function normalizeAsync(folder) {
        if (folder.keywords.machine || folder.keywords.async) {
            delete folder.keywords.machine;
            folder.keywords.async = true;
        } else {
            folder.keywords.async = false;
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
            addDeclaration(folder.scope, name);
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
        var expr1, expr2, first, newContent, oldContent, second, var1, var2, varName;
        expr1 = item.content[0];
        expr2 = item.content[1];
        if (expr1.type === 'ExpressionStatement' && expr2.type === 'ExpressionStatement') {
            first = expr1.expression;
            second = expr2.expression;
            if (!(second.type === 'Identifier')) {
                varName = generateId('_collection');
                addLocal(folder.scope, varName);
                oldContent = second;
                second = createIdentifier(varName);
                newContent = createAssignment(createIdentifier(varName), oldContent);
                insertActionBefore(folder, id, newContent);
            }
            if (first.type === 'Identifier') {
                item.subtype = 'array';
                item.variable = first.name;
                item.content = createForOf(item.variable, second);
                item.content.itemId = id;
                addLoopVar(folder.scope, item.variable);
            } else {
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
                        addLoopVar(folder.scope, item.keyVariable);
                        addLoopVar(folder.scope, item.valueVariable);
                    } else {
                        reportBadLoop(folder, id, item);
                    }
                } else {
                    reportBadLoop(folder, id, item);
                }
            }
        } else {
            reportBadLoop(folder, id, item);
        }
    }
    function parseItem(folder, id, item) {
        var _selectValue_192;
        _selectValue_192 = item.type;
        if (_selectValue_192 === 'action') {
            parseAction(folder, id, item);
        } else {
            if (_selectValue_192 === 'question') {
                parseQuestion(folder, id, item);
            } else {
                if (_selectValue_192 === 'select') {
                    parseSelect(folder, id, item);
                } else {
                    if (_selectValue_192 === 'case') {
                        parseCase(folder, id, item);
                    } else {
                        if (_selectValue_192 === 'loopbegin') {
                            parseLoop(folder, id, item);
                        } else {
                            if (_selectValue_192 === 'soutput') {
                                parseOutput(folder, id, item);
                            } else {
                                if (_selectValue_192 === 'sinput') {
                                    parseSInput(folder, id, item);
                                } else {
                                    if (_selectValue_192 === 'pause') {
                                        parsePause(folder, id, item);
                                    }
                                }
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
        var _collection_194, child, name;
        parseItemsInFunction(folder);
        _collection_194 = folder.children;
        for (name in _collection_194) {
            child = _collection_194[name];
            parseItems(child);
        }
    }
    function parseItemsInFunction(folder) {
        var id, ids, item;
        parseArguments(folder);
        normalizeAsync(folder);
        folder.eventItems = [];
        ids = Object.keys(folder.items);
        for (id of ids) {
            item = folder.items[id];
            parseItem(folder, id, item);
        }
        setUpMachine(folder);
    }
    function parseLoop(folder, id, item) {
        var _selectValue_197, init, test, update;
        parseItemContent(folder, id, item);
        if (ensureHasContent(folder, id, item)) {
            _selectValue_197 = item.content.length;
            if (_selectValue_197 === 2) {
                parseForEachLoop(folder, id, item);
            } else {
                if (_selectValue_197 === 3) {
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
    function parseOutput(folder, id, item) {
        if (item.content) {
            item.content = 'setTimeout(() => {' + item.content + '}, 0);';
        }
        item.type = 'action';
        parseItemContent(folder, id, item);
    }
    function parsePause(folder, id, item) {
        if (item.content) {
            item.content = 'await new Promise(resolve=>setTimeout(resolve,' + item.content + '))';
            parseAction(folder, id, item);
        }
        item.type = 'action';
    }
    function parseQuestion(folder, id, item) {
        parseItemContent(folder, id, item);
        if (ensureHasContent(folder, id, item)) {
            ensureExpression(folder, id, item);
        }
    }
    function parseSInput(folder, id, item) {
        parseItemContent(folder, id, item);
        if (ensureHasContent(folder, id, item) && ensureExpression(folder, id, item) && ensureCall(folder, id, item)) {
            folder.eventItems.push(id);
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
                    collectReceiveCases(folder, item);
                }
            } else {
                varName = generateId('_selectValue');
                addLocal(folder.scope, varName);
                item.content = createIdentifier(varName);
                newContent = createAssignment(createIdentifier(varName), expr);
                insertActionBefore(folder, id, newContent);
            }
        }
    }
    function parseStatement(code) {
        var parsed, wrapped;
        wrapped = 'async function wrp() { ' + code + '\n}';
        parsed = options.esprima.parseScript(wrapped, { loc: false });
        return parsed.body[0].body.body[0];
    }
    function pushAssi(variable, value, body) {
        body.push(createExpression(createAssignment(createIdentifier(variable), value)));
    }
    async function readChildren(folder) {
        var _collection_207, child, childPath, result;
        result = [];
        _collection_207 = folder.children;
        for (childPath of _collection_207) {
            child = await options.getObjectByHandle(childPath);
            if (child) {
                if (!(child.type === 'folder')) {
                    enrichFolder(child);
                }
                result.push(child);
            }
        }
        return result;
    }
    async function readClassFolder(parent, folder) {
        var child, children, cls;
        children = await readChildren(folder);
        cls = findClassDiagram(children);
        if (cls) {
            reportError('class is not expected here', cls.path);
        }
        for (child of children) {
            if (child.type === 'folder') {
                await readClassFolder(parent, child);
            } else {
                addChild(parent, child);
            }
        }
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
    async function readHoloFolder(parent, folder) {
        var child, children, cls;
        children = await readChildren(folder);
        cls = findClassDiagram(children);
        if (cls) {
            reportError('class is not expected here', cls.path);
        }
        for (child of children) {
            if (child.type === 'folder') {
                await readHoloFolder(parent, child);
            } else {
                addChild(parent, child);
            }
        }
    }
    async function readModuleFolder(parent, folder) {
        var child, children, className, cls;
        children = await readChildren(folder);
        cls = findClassDiagram(children);
        className = tryGetHoloClassName(folder.name);
        if (className) {
            if (!cls) {
                cls = createEmptyFunction('class');
            }
            cls.keywords.export = true;
            cls.type = 'class';
            cls.name = className;
            addChild(parent, cls);
            for (child of children) {
                if (child.type === 'folder') {
                    await readModuleFolder(parent, child);
                }
            }
            for (child of children) {
                if (!(child.type === 'folder' || child.name === className)) {
                    child.keywords.export = true;
                    addChild(cls, child);
                }
            }
        } else {
            if (cls) {
                className = folder.name;
                cls.type = 'class';
                cls.name = className;
                addChild(parent, cls);
                for (child of children) {
                    if (child.type === 'folder') {
                        await readModuleFolder(cls, child);
                    } else {
                        if (!(child.name === className)) {
                            addChild(cls, child);
                        }
                    }
                }
            } else {
                for (child of children) {
                    if (child.type === 'folder') {
                        await readModuleFolder(parent, child);
                    } else {
                        addChild(parent, child);
                    }
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
        generateFunctionId(module);
        children = await readChildren(rootFolder);
        for (child of children) {
            if (child.type === 'folder') {
                await readModuleFolder(module, child);
            } else {
                if (child.name === 'class') {
                    reportError('class is not expected here', child.path);
                } else {
                    if (child.name === 'module') {
                        if (child.keywords.async) {
                            reportError('module cannot be async', child.path);
                        }
                        if (child.params) {
                            reportError('module cannot have arguments', child.path);
                        }
                        module.items = child.items;
                    } else {
                        addChild(module, child);
                    }
                }
            }
        }
        return module;
    }
    function replaceReturnInAction(item) {
        var _collection_163, _selectValue_165, index, stm;
        if (item.type === 'action' && item.content) {
            index = 0;
            _collection_163 = item.content;
            for (stm of _collection_163) {
                _selectValue_165 = stm.type;
                if (_selectValue_165 === 'ReturnStatement') {
                    convertReturnToResolve(stm, '_topResolve_');
                    item.content.splice(index + 1, 0, createReturn(null));
                    return;
                } else {
                    if (_selectValue_165 === 'ThrowStatement') {
                        convertReturnToResolve(stm, '_topReject_');
                        item.content.splice(index + 1, 0, createReturn(null));
                        return;
                    }
                }
                index++;
            }
        }
    }
    function replaceReturnInMachine(fun) {
        var _collection_167, id, item;
        _collection_167 = fun.items;
        for (id in _collection_167) {
            item = _collection_167[id];
            replaceReturnInAction(item);
        }
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
    function rewriteEventCase(folder, caseId, caseItem, name) {
        var content, lines;
        caseItem.content = createStringLiteral(name);
        lines = [];
        assignEventArguments(folder, name, lines);
        content = linesToContent(folder, caseId, lines);
        insertActionAfter(folder, caseId, content);
    }
    function rewriteEventInput(folder, id, item, name) {
        var lines;
        addLocal(folder.scope, '_event_');
        lines = [
            'me.state = "' + id + '"',
            'me._busy = false',
            '_event_ = yield'
        ];
        assignEventArguments(folder, name, lines);
        item.content = linesToContent(folder, id, lines);
        item.type = 'action';
    }
    async function run() {
        var ast, deps, module, src;
        if (!(state === 'idle')) {
            throw new Error('Invalid state');
        }
        state = 'started';
        module = await readRootFolder();
        if (mustStop()) {
        } else {
            parseItems(module);
            await pause(1);
            if (mustStop()) {
            } else {
                buildModuleAst(module);
                await pause(1);
                if (mustStop()) {
                } else {
                    addVariableDeclarations(module);
                    ast = combineModuleAst(module);
                    await pause(1);
                    if (mustStop()) {
                    } else {
                        src = options.escodegen.generate(ast);
                        src = addExports(module, src);
                        if (isIife()) {
                            src = '(function() {\n' + src + '\n})();';
                        } else {
                            if (isUnit()) {
                                deps = getDepDeclarations();
                                src = 'function ' + options.name + '() {\nvar unit = {};\n' + deps + src + '\nreturn unit;\n}';
                            }
                        }
                        await options.onData(src);
                    }
                }
            }
        }
    }
    function scanForAssignments(step, node) {
        var _selectValue_183, nextStep, varName;
        if (node.itemId) {
            step.itemId = node.itemId;
        }
        _selectValue_183 = node.type;
        if (_selectValue_183 === 'AssignmentExpression') {
            if (node.left.type === 'Identifier') {
                varName = node.left.name;
                if (!isDeclared(step, varName)) {
                    addLocal(step.scope, varName);
                }
            }
            return true;
        } else {
            if (_selectValue_183 === 'CallExpression') {
                if (node.callee.type === 'Identifier' && node.callee.name === 'getHandlerData') {
                    node.type = 'Identifier';
                    node.name = '_handlerData_';
                    delete node.callee;
                    delete node.arguments;
                    return false;
                } else {
                    return true;
                }
            } else {
                if (_selectValue_183 === 'VariableDeclaration') {
                    if (step.canDeclare) {
                        extractVariablesFromDeclaration(node, step.scope);
                    } else {
                        reportError('var, const, let are not allowed here', step.path, step.itemId);
                    }
                    return true;
                } else {
                    if (_selectValue_183 === 'AwaitExpression') {
                        if (!step.canAwait) {
                            reportError('await is allowed only in async functions', step.path, step.itemId);
                        }
                        return true;
                    } else {
                        if ((_selectValue_183 === 'FunctionExpression' || _selectValue_183 === 'ArrowFunctionExpression' || _selectValue_183 === 'FunctionDeclaration') && node.body.type === 'BlockStatement') {
                            nextStep = createScopeStepForLambda(step, node);
                            nextStep.canAwait = node.async;
                            addDeclarationsInFunction(nextStep);
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
            }
        }
    }
    function setUpMachine(folder) {
        var _collection_199, id, item;
        if (folder.keywords.async) {
            if (!(folder.eventItems.length === 0)) {
                reportError('events are not allowed in async functions', folder.path, folder.eventItems[0]);
            }
        } else {
            folder.events = {};
            _collection_199 = folder.eventItems;
            for (id of _collection_199) {
                item = folder.items[id];
                if (item.type === 'select') {
                    addSelectEvent(folder, item, id);
                } else {
                    addInputEvent(folder, item, id);
                }
            }
            if (!(folder.eventItems.length === 0)) {
                folder.isMachine = true;
                folder.originalName = folder.name;
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
    function traverseAst(obj, visitor) {
        var item, key, recurse, value;
        if (obj) {
            if (Array.isArray(obj)) {
                for (item of obj) {
                    traverseAst(item, visitor);
                }
            } else {
                if (typeof obj === 'object' && obj.type) {
                    recurse = visitor(obj);
                    if (recurse) {
                        for (key in obj) {
                            value = obj[key];
                            traverseAst(value, visitor);
                        }
                    }
                }
            }
        }
    }
    function tryAddIdentifier(scope, item) {
        if (item.type === 'Identifier') {
            addDeclaration(scope, item.name);
        }
    }
    function tryGetHoloClassName(name) {
        if (name.startsWith('class ')) {
            return name.substring('class '.length);
        } else {
            return undefined;
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