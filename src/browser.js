const { createDrakonTechGenerator } = require("./drakontechgen")

window.drakontechgen = {
    buildGenerator: function (name, root, getObjectByHandle, onError, onData) {
        var genOptions = {
            toTree: window.drakongen.toTree,
            escodegen: window.escodegen,
            esprima: window.esprima,
            name: name,
            root: root,
            getObjectByHandle: getObjectByHandle,
            onError: onError,
            onData: onData
        }

        return createDrakonTechGenerator(genOptions)
    }
}