const { findFirst } = require("./tools")

function createDrakonTechGenerator(options) {
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

    function addDeclaration(scope, decl) {
        var name = decl.name
        if (name in scope.all) {
            reportError("Declaration or argument name is not unique", decl.path, undefined, name)
        }
        scope.declared[name] = decl
        scope.all[name] = "declared"
    }

    function addArgument(fun, name) {
        var decl = {
            name: name,
            path: fun.path,
            fun: fun.name,
            type: "argument"
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
            if (!child) {continue}
            if (isClass(child)) {
                reportError("class not expected in the root folder", childPath)
            } else if (isModule(child)) {
                moduleInit = child
            } else {
                await traverseModuleItem(child)
            }
        }

        checkCancellation()
        for (var name in project.functions) {
            parseFunctionItems(project.functions[name], project.name)
        }
        checkCancellation()
        if (failed) {
            return
        }
    }

    function parseParams(params) {
        params = params || ""
        var parts = params.split("\n")
        return parts
            .map(part => part.trim())
            .filter(part => !!part)
    }

    function parseFunctionItems(fun, parentScope) {
        if (fun.name in scopes) {
            reportError("Name is not unique", fun.path, undefined, fun.name)
        }
        fun.scope = createScope(fun.name, "function", parentScope)
        var params = parseParams(fun.params)
        params.forEach(param => addArgument(fun, param))
        fun.items = fun.items || {}
        for (var itemId in fun.items) {
            var item = fun.items[itemId]
            switch (item.type) {
                case "action":
                    break;
                case "loopbegin":
                    break;                    
                case "select":
                    break;
                case "case":
                    break;
                case "question":
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
        console.log(options)
        if (state !== "idle") {
            throw new Error("Invalid state " + state)
        }
        try {
            await jsPreprocess()
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