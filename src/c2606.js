function C2606Generator(tools) {
    var self = { _type: 'C2606Generator' };
    function buildCode(tree) {
    }
    function buildTree(project) {
    }
    async function parseItems(project) {
    }
    async function readProject() {
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
        var _collection_19, error, result;
        result = await runCore();
        if (result.errors.length === 0) {
            await options.onData(result.code);
        } else {
            _collection_19 = result.errors;
            for (error of _collection_19) {
                options.onError(error);
            }
        }
    }
    async function runCore() {
        var code, ex, generator, project, tools, tree;
        try {
            tools = GenTools(options, errors);
            generator = buildGenerator(tools);
            errors = [];
            code = '';
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
    async function readChildren(node) {
        var _collection_21, child, childPath, result;
        if (node.children) {
            result = [];
            _collection_21 = node.children;
            for (childPath of _collection_21) {
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
    function reportError(message, filename, nodeId, data) {
        errors.push({
            message: message,
            filename: filename,
            nodeId: nodeId,
            data: data
        });
    }
    self.readChildren = readChildren;
    self.readObject = readObject;
    self.readRoot = readRoot;
    self.reportError = reportError;
    return self;
}
function createC2606Generator(options) {
    return GenRunner(options, C2606Generator);
}
module.exports = {
    GenRunner,
    createC2606Generator
};