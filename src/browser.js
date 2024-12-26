const { createDrakonTechGenerator } = require("./drakontechgen")

window.generateJavaScript = function (name, root, getObjectByHandle, onError, onData) {
    var genOptions = {
        toTree: window.toTree,
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
