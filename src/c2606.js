function C2606Generator(tools) {
    var self = { _type: 'C2606Generator' };
    function addFunction(module, fun) {
        if (fun.name in module.functions) {
            tools.reportError('Function name is not unique', fun.path);
        } else {
            module.functions[fun.name] = fun;
        }
    }
    function addLine(text, context) {
        tools.addIndentedLine(text, context);
    }
    function buildCode(trees) {
        var _branch_, header, hlines, name, node, result, slines, source;
        _branch_ = 'Ветка1';
        while (true) {
            switch (_branch_) {
            case 'Ветка1':
                source = trees.source;
                header = trees.header;
                name = tools.getProjectName();
                result = {};
                if (header.length === 0) {
                    _branch_ = 'Source';
                } else {
                    _branch_ = 'Header';
                }
                break;
            case 'Header':
                hlines = [];
                headerStart(hlines);
                for (node of header) {
                    printNode(node, 0, hlines);
                }
                headerEnd(hlines);
                result.auxCode = hlines.join('\n');
                result.auxName = name + '.h';
                _branch_ = 'Source';
                break;
            case 'Source':
                slines = [];
                if (!(header.length === 0)) {
                    slines.push('#include "' + name + '.h"');
                }
                slines.push('');
                for (node of source) {
                    printNode(node, 0, slines);
                }
                slines.push('');
                result.code = slines.join('\n');
                _branch_ = 'Exit';
                break;
            case 'Exit':
                _branch_ = undefined;
                return result;
            default:
                return;
            }
        }
    }
    function buildGoto(branches, node) {
        var branch, label;
        branch = tools.findByName(branches, node.content);
        label = tools.buildLabel(branch.name, branch.branchId);
        return 'goto ' + label + ';';
    }
    function buildGuard(name) {
        var random;
        random = tools.random4Digits();
        return name.toUpperCase() + '_H_' + random;
    }
    function buildMethodTree(func, output) {
        var tree;
        tree = {
            type: 'function',
            keywords: func.keywords,
            name: func.name,
            args: func.args,
            returns: func.returns,
            body: []
        };
        generateMethodBody(func, tree.body);
        output.push(tree);
    }
    function buildTree(module) {
        var func, header, name, names, source;
        header = [];
        source = [];
        names = Object.keys(module.functions);
        names = tools.removeElements(names, [
            'begin_header',
            'begin_source'
        ]);
        names.sort();
        if (module.begin_header) {
            generateMethodBody(module.functions['begin_header'], header);
        }
        for (name of names) {
            func = module.functions[name];
            if (func.type === 'struct' && func.keywords.export) {
                generateStruct(func, header);
            }
        }
        for (name of names) {
            func = module.functions[name];
            if (!(func.type === 'struct') && func.keywords.export) {
                generateDeclaration(func, header);
            }
        }
        if (module.begin_source) {
            generateMethodBody(module.functions['begin_source'], source);
        }
        for (name of names) {
            func = module.functions[name];
            if (!(func.type === 'struct' || (func.keywords.export || func.name === 'main'))) {
                generateDeclaration(func, source);
            }
        }
        for (name of names) {
            func = module.functions[name];
            if (func.type === 'struct' && !func.keywords.export) {
                generateStruct(func, source);
            }
        }
        for (name of names) {
            func = module.functions[name];
            if (!(func.type === 'struct')) {
                buildMethodTree(func, source);
            }
        }
        return {
            header: header,
            source: source
        };
    }
    function complexSilhouetteToTree(context, output) {
        var branch, branches, first, label;
        branches = context.branches;
        first = branches[0];
        if (first.refs === 0) {
            tools.convertTree(context, first.body, output);
            branches = branches.slice(1);
        }
        for (branch of branches) {
            label = tools.buildLabel(branch.name, branch.branchId);
            tools.addAction(label + ':', output, false);
            tools.convertTree(context, branch.body, output);
        }
    }
    function generateDeclaration(func, output) {
        var tree;
        tree = {
            type: 'declaration',
            keywords: func.keywords,
            name: func.name,
            args: func.args,
            returns: func.returns
        };
        output.push(tree);
    }
    function generateMethodBody(func, output) {
        var branches, buildGotoCallback, context, first, rawTree;
        if (func) {
            rawTree = tools.drakonToTree(func);
            branches = rawTree.branches;
            if (branches.length === 0) {
            } else {
                buildGotoCallback = node => {
                    return buildGoto(branches, node);
                };
                context = {
                    func: func,
                    simple: true,
                    branches: branches,
                    returnKeyword: 'return',
                    loopContent: 'while (1)',
                    breakContent: 'break;',
                    buildError: () => {
                        return 'abort();';
                    },
                    qc: qc,
                    buildGoto: buildGotoCallback
                };
                first = branches[0];
                if (branches.length === 1) {
                    tools.convertTree(context, first.body, output);
                } else {
                    if (tools.isSimpleSilhouette(rawTree)) {
                        tools.convertTree(context, first.body, output);
                    } else {
                        context.simple = false;
                        complexSilhouetteToTree(context, output);
                    }
                }
            }
        } else {
        }
    }
    function generateStruct(func, output) {
        var tree;
        tree = {
            type: 'struct',
            keywords: func.keywords,
            name: func.name,
            body: []
        };
        generateMethodBody(func, tree.body);
        output.push(tree);
    }
    function headerEnd(hlines) {
        hlines.push('#ifdef __cplusplus');
        hlines.push('}');
        hlines.push('#endif');
        hlines.push('#endif');
        hlines.push('');
    }
    function headerStart(hlines) {
        var guard, name;
        name = tools.getProjectName();
        guard = buildGuard(name);
        hlines.push('#ifndef ' + guard);
        hlines.push('#define ' + guard);
        hlines.push('#ifdef __cplusplus');
        hlines.push('#extern "C"{');
        hlines.push('#endif');
        hlines.push('');
    }
    function parseArguments(doc) {
        var args, line, lines, ret, returns, skip;
        lines = tools.getLines(doc.params);
        args = [];
        returns = 'void';
        ret = 'return ';
        for (line of lines) {
            if (line.startsWith(ret)) {
                skip = ret.length;
                returns = line.substring(skip);
            } else {
                args.push(line);
            }
        }
        if (args.length === 1 && args[0] === 'struct') {
            doc.type = 'struct';
        } else {
            doc.returns = returns;
            doc.args = args;
        }
    }
    async function parseItems(module) {
        var _collection_59, fun, name;
        _collection_59 = module.functions;
        for (name in _collection_59) {
            fun = _collection_59[name];
            parseItemsInDocument(fun);
        }
    }
    function parseItemsInDocument(doc) {
        var _collection_62, _collection_65, _selectValue_68, item, itemId;
        parseArguments(doc);
        if (doc.type === 'struct') {
            _collection_65 = doc.items;
            for (itemId in _collection_65) {
                item = _collection_65[itemId];
                _selectValue_68 = item.type;
                if (!(_selectValue_68 === 'action' || (_selectValue_68 === 'branch' || _selectValue_68 === 'end'))) {
                    tools.reportError('Only action icons are allowed in structs', doc.path, itemId);
                }
            }
        } else {
            _collection_62 = doc.items;
            for (itemId in _collection_62) {
                item = _collection_62[itemId];
                tools.endToExit(item);
            }
        }
    }
    function printBlock(block, context, semi) {
        var depth, lines, node;
        tools.addIndentedLine('{', context);
        depth = context.depth + 1;
        lines = context.lines;
        for (node of block) {
            printNode(node, depth, lines);
        }
        if (semi) {
            tools.addIndentedLine('};', context);
        } else {
            tools.addIndentedLine('}', context);
        }
    }
    function printFunction(context) {
        var lines, node;
        lines = context.lines;
        node = context.node;
        printSignature(false, context);
        printBlock(node.body, context);
    }
    function printLoop(context) {
        var content, node;
        node = context.node;
        if (node.content.startsWith('for ') || node.content.startsWith('while ') || node.content.endsWith(')')) {
            content = node.content;
        } else {
            content = 'for (' + node.content + ')';
        }
        addLine(content, context);
        printBlock(node.body, context);
    }
    function printNode(node, depth, lines) {
        var _selectValue_70, context;
        context = {
            node: node,
            depth: depth,
            lines: lines
        };
        _selectValue_70 = node.type;
        if (_selectValue_70 === 'function') {
            printFunction(context);
        } else {
            if (_selectValue_70 === 'declaration') {
                printSignature(true, context);
            } else {
                if (_selectValue_70 === 'struct') {
                    printStruct(context);
                } else {
                    if (_selectValue_70 === 'action') {
                        tools.printAction(context);
                    } else {
                        if (_selectValue_70 === 'question') {
                            printQuestion(context);
                        } else {
                            if (_selectValue_70 === 'loop') {
                                printLoop(context);
                            } else {
                                if (_selectValue_70 === 'empty-line') {
                                    context.lines.push('');
                                } else {
                                    if (!(_selectValue_70 === 'exit')) {
                                        throw new Error('Unexpected case value: ' + _selectValue_70);
                                    }
                                    addLine('return;', context);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    function printQuestion(context) {
        var condition, node;
        node = context.node;
        condition = tools.toOneLine(node.content);
        addLine('if (' + condition + ')', context);
        printBlock(node.yes, context);
        if (!(node.no.length === 0)) {
            addLine('else', context);
            printBlock(node.no, context);
        }
    }
    function printSignature(addSemicolon, context) {
        var arg, comment, i, lines, name, node, parts;
        lines = context.lines;
        node = context.node;
        lines.push('');
        if (node.keywords.export || node.name === 'main') {
            lines.push(node.returns);
        } else {
            lines.push('static ' + node.returns);
        }
        if (node.args.length === 0) {
            if (addSemicolon) {
                lines.push(node.name + '(void);');
            } else {
                lines.push(node.name + '(void)');
            }
        } else {
            lines.push(node.name + '(');
            for (i = 0; i < node.args.length; i++) {
                arg = node.args[i];
                parts = arg.split('//');
                if (i === node.args.length - 1) {
                    lines.push('    ' + arg);
                } else {
                    if (parts.length === 1) {
                        lines.push('    ' + arg + ',');
                    } else {
                        name = parts[0].trim();
                        comment = parts[1].trim();
                        lines.push('    ' + name + ', //' + comment);
                    }
                }
            }
            if (addSemicolon) {
                lines.push(');');
            } else {
                lines.push(')');
            }
        }
    }
    function printStruct(context) {
        var lines, node;
        lines = context.lines;
        node = context.node;
        lines.push('struct ' + node.name);
        printBlock(node.body, context, true);
    }
    function qc(content) {
        var _selectValue_74, left, operand, right;
        if (typeof content === 'string') {
            return content;
        } else {
            _selectValue_74 = content.operator;
            if (_selectValue_74 === 'not') {
                operand = qc(content.operand);
                return '!(' + operand + ')';
            } else {
                if (_selectValue_74 === 'and') {
                    left = qc(content.left);
                    right = qc(content.right);
                    return '(' + left + ') && (' + right + ')';
                } else {
                    if (_selectValue_74 === 'or') {
                        left = qc(content.left);
                        right = qc(content.right);
                        return '(' + left + ') || (' + right + ')';
                    } else {
                        if (!(_selectValue_74 === 'equal')) {
                            throw new Error('Unexpected case value: ' + _selectValue_74);
                        }
                        left = qc(content.left);
                        right = qc(content.right);
                        return left + ' == ' + right;
                    }
                }
            }
        }
    }
    async function readProject() {
        var module, rootFolder;
        rootFolder = await tools.readRoot();
        module = {
            functions: {},
            begin_source: false,
            begin_header: false
        };
        await readProjectFolder(module, rootFolder);
        return module;
    }
    async function readProjectFolder(module, folder) {
        var _selectValue_72, child, children;
        children = await tools.readChildren(folder);
        for (child of children) {
            if (child.type === 'folder') {
                await readProjectFolder(module, child);
            } else {
                addFunction(module, child);
                _selectValue_72 = child.name;
                if (_selectValue_72 === 'begin_header') {
                    module.begin_header = true;
                } else {
                    if (_selectValue_72 === 'begin_source') {
                        module.begin_source = true;
                    }
                }
            }
        }
    }
    self.buildCode = buildCode;
    self.buildTree = buildTree;
    self.parseItems = parseItems;
    self.readProject = readProject;
    return self;
}
function GenRunner(options, buildGenerator) {
    var self = { _type: 'GenRunner' };
    var errors = [];
    function pause(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function run() {
        var _collection_76, error, result;
        result = await runCore();
        if (result.errors.length === 0) {
            if (result.code.auxCode) {
                await options.onAuxData(result.code.auxName, result.code.auxCode);
            }
            await options.onData(result.code.code);
        } else {
            _collection_76 = result.errors;
            for (error of _collection_76) {
                options.onError(error);
            }
        }
    }
    async function runCore() {
        var code, ex, generator, project, tools, tree;
        try {
            errors = [];
            code = '';
            tools = GenTools(options, errors);
            generator = buildGenerator(tools);
            project = await generator.readProject();
            if (errors.length === 0) {
                await pause(1);
                await generator.parseItems(project);
                if (errors.length === 0) {
                    await pause(1);
                    tree = generator.buildTree(project);
                    if (errors.length === 0) {
                        await pause(1);
                        code = generator.buildCode(tree);
                    }
                }
            }
            return {
                code: code,
                errors: errors
            };
        } catch (_handlerData_) {
            ex = _handlerData_;
            tools.reportError(ex.message, ex.filename, ex.nodeId, ex.data);
            return {
                code: '',
                errors: errors
            };
        }
    }
    function stop() {
    }
    self.run = run;
    self.runCore = runCore;
    self.stop = stop;
    return self;
}
function GenTools(options, errors) {
    var self = { _type: 'GenTools' };
    function addAction(text, output, isFinal) {
        var item;
        item = {
            type: 'action',
            content: text,
            final: isFinal || false
        };
        output.push(item);
    }
    function addIndentedLine(text, context) {
        var indent, line;
        indent = createIndent(context);
        line = indent + text;
        context.lines.push(line);
    }
    function buildLabel(name, id) {
        var result;
        if (!name) {
            return '_' + id;
        }
        result = name.replace(/[^A-Za-z0-9_]/g, '_');
        if (/^[0-9]/.test(result)) {
            result = '_' + result;
        }
        return result;
    }
    function convertTree(context, body, output) {
        var _selectValue_78, content, finalStep, item, next, node;
        for (node of body) {
            _selectValue_78 = node.type;
            if (_selectValue_78 === 'action') {
                content = node.content;
                finalStep = isFinal(context.func, node, context.returnKeyword);
                item = {
                    content: content,
                    type: node.type,
                    final: finalStep
                };
                output.push(item);
            } else {
                if (_selectValue_78 === 'exit') {
                    if (!(context.simple || hasFinal(output))) {
                        item = {
                            type: node.type,
                            final: true
                        };
                        output.push(item);
                    }
                } else {
                    if (_selectValue_78 === 'question') {
                        content = context.qc(node.content);
                        item = {
                            content: content,
                            type: node.type,
                            yes: [],
                            no: []
                        };
                        convertTree(context, node.yes, item.yes);
                        convertTree(context, node.no, item.no);
                        output.push(item);
                    } else {
                        if (_selectValue_78 === 'loop') {
                            content = node.content || context.loopContent;
                            item = {
                                type: 'loop',
                                content: content,
                                body: []
                            };
                            convertTree(context, node.body, item.body);
                            output.push(item);
                        } else {
                            if (_selectValue_78 === 'address') {
                                if (!hasFinal(output)) {
                                    if (context.simple) {
                                        next = findByName(context.branches, node.content);
                                        convertTree(context, next.body, output);
                                    } else {
                                        content = context.buildGoto(node);
                                        addAction(content, output, true);
                                    }
                                }
                            } else {
                                if (_selectValue_78 === 'break') {
                                    if (!hasFinal(output)) {
                                        addAction(context.breakContent, output, true);
                                    }
                                } else {
                                    if (_selectValue_78 === 'error') {
                                        content = context.buildError(node);
                                        addAction(content, output, true);
                                    } else {
                                        reporError('Unexpected node type: ' + node.type, context.func.path, node.id);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    function createIndent(context) {
        return ' '.repeat(4 * context.depth);
    }
    function drakonToTree(func) {
        var json, opt, tmp, treeJson;
        tmp = { items: func.items };
        json = JSON.stringify(tmp);
        opt = {};
        treeJson = options.toTree(json, func.name, func.path, 'en', opt);
        return JSON.parse(treeJson);
    }
    function endToExit(item) {
        if (item.type == 'end') {
            item.type = 'exit';
        }
    }
    function findByName(array, name) {
        var element;
        for (element of array) {
            if (element.name === name) {
                return element;
            }
        }
        return undefined;
    }
    function getLines(text) {
        var line, lines, result, trimmed;
        if (text) {
            lines = text.split('\n');
            result = [];
            for (line of lines) {
                trimmed = line.trim();
                if (trimmed) {
                    result.push(trimmed);
                }
            }
            return result;
        } else {
            return [];
        }
    }
    function getProjectName() {
        return options.name;
    }
    function hasFinal(body) {
        var count, last;
        count = body.length;
        if (count === 0) {
            return false;
        } else {
            last = body[count - 1];
            if (last.final) {
                return true;
            } else {
                if (last.type === 'question' && hasFinal(last.yes) && hasFinal(last.no)) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
    function isFinal(func, node, returnKeyword) {
        var content, item;
        if (node.id) {
            item = func.items[node.id];
            content = item.content;
            if (content && (content.startsWith(returnKeyword + ' ') || content.startsWith(returnKeyword + ';') || content === returnKeyword)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    function isSimpleSilhouette(rawTree) {
        var branch, branches, count, first, i;
        branches = rawTree.branches;
        first = branches[0];
        if (first.refs > 0) {
            return false;
        } else {
            count = branches.length;
            for (i = 0; i < count; i++) {
                branch = branches[i];
                if (!(!(branch.refs > 1) || i === count - 1 && !(branch.body.length > 2))) {
                    return false;
                }
            }
            return true;
        }
    }
    function printAction(context) {
        printIndentedBlock(context.node.content, context);
    }
    function printIndentedBlock(text, context) {
        var indent, line, lines;
        if (text) {
            lines = text.split('\n');
            indent = createIndent(context);
            for (line of lines) {
                context.lines.push(indent + line);
            }
        }
    }
    function random4Digits() {
        return Math.floor(Math.random() * 9000) + 1000;
    }
    async function readChildren(node) {
        var _collection_80, child, childPath, result;
        if (node.children) {
            result = [];
            _collection_80 = node.children;
            for (childPath of _collection_80) {
                child = await readObject(childPath);
                if (child && (child.type === 'drakon' || child.type === 'folder')) {
                    result.push(child);
                }
            }
            return result;
        } else {
            return [];
        }
    }
    async function readObject(handle) {
        var node;
        node = await options.getObjectByHandle(handle);
        if (node && node.type === 'drakon') {
            node.items = node.items || {};
            node.keywords = node.keywords || {};
        }
        return node;
    }
    async function readRoot() {
        return await readObject(options.root);
    }
    function removeElements(from, what) {
        var element, result;
        result = [];
        for (element of from) {
            if (what.indexOf(element) === -1) {
                result.push(element);
            }
        }
        return result;
    }
    function reportError(message, filename, nodeId, data) {
        errors.push({
            message: message,
            filename: filename,
            nodeId: nodeId,
            data: data
        });
    }
    function toOneLine(text) {
        var lines, trimmed;
        if (text) {
            lines = text.split('\n');
            trimmed = lines.map(line => {
                return line.trim();
            });
            return trimmed.join(' ');
        } else {
            return '';
        }
    }
    self.addAction = addAction;
    self.addIndentedLine = addIndentedLine;
    self.buildLabel = buildLabel;
    self.convertTree = convertTree;
    self.createIndent = createIndent;
    self.drakonToTree = drakonToTree;
    self.endToExit = endToExit;
    self.findByName = findByName;
    self.getLines = getLines;
    self.getProjectName = getProjectName;
    self.hasFinal = hasFinal;
    self.isSimpleSilhouette = isSimpleSilhouette;
    self.printAction = printAction;
    self.printIndentedBlock = printIndentedBlock;
    self.random4Digits = random4Digits;
    self.readChildren = readChildren;
    self.readObject = readObject;
    self.readRoot = readRoot;
    self.removeElements = removeElements;
    self.reportError = reportError;
    self.toOneLine = toOneLine;
    return self;
}
function createC2606Generator(options) {
    return GenRunner(options, C2606Generator);
}
module.exports = {
    GenRunner,
    createC2606Generator
};