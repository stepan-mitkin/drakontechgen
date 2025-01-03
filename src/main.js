const esprima = require('esprima')
const escodegen = require('escodegen')
const fs = require('fs').promises;
const path = require('path');
const { createDrakonTechGenerator } = require("./drakontechgen")
const {toTree} = require("drakongen")

var success = undefined

// Display usage summary
function displayUsage() {
    console.log(`Usage:
    drakontechgen <path>                        Read the project from <path> and output the JS-file the same folder
    drakontechgen --output <output file> <path> Read the project from <path> and output the JS-file to the specified filename
    drakontechgen                             Display this usage summary.`);
}

function parseCommandLine() {
    const args = process.argv.slice(2);

    if (args.length === 0) {        
        return false;
    }

    let options = {}

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--output':
                options.output = args[++i];
                break;
            default:
                if (!options.projectFolder) {
                    options.projectFolder = args[i];
                }
        }
    }
    
    if (!options.projectFolder) {
        return false;
    }

    options.projectFolder = path.resolve(options.projectFolder)

    if (!options.output) {
        var parsed = path.parse(options.projectFolder)
        options.output = path.join(options.projectFolder, parsed.name + ".js")
    }
    options.name = path.parse(options.projectFolder).name

    return options
}

function isGoodName(filename) {
    if (filename.startsWith(".")) {return false}
    return true
}

async function getObjectByHandle(filepath) {
    var stats = await fs.stat(filepath)
    var parsed = path.parse(filepath)
    if (stats.isDirectory()) {
        var files = await fs.readdir(filepath)
        var goodNames = files.filter(isGoodName)
        return {
            path: filepath,
            type: "folder",
            name: parsed.base,
            children: goodNames.map(file => path.join(filepath, file))
        }
    } else {
        if (parsed.ext === ".drakon" || parsed.ext === ".json") {
            try {
                var content = await fs.readFile(filepath, "utf-8")
                var obj = JSON.parse(content)
                obj.path = filepath
                obj.name = parsed.name
                return obj
            } catch (ex) {
                onError({
                    message: ex.message,
                    filename: filepath
                })
            }
        }
        return undefined
    }
}

function onError(err) {
    console.error(`${err.message}`);
    console.error(`Filename: ${err.filename}`);
    if (err.nodeId) {
        console.error(`Node id: ${err.nodeId}`);
    }
    if (err.stack) {
        console.log(err.stack)
    }
    success = false
}

// Main logic
async function main() {
    var options = parseCommandLine()
    if (!options) {
        displayUsage();
        return;       
    }

    var genOptions = {
        toTree: toTree,
        escodegen: escodegen,
        esprima: esprima,
        name: options.name,
        root: options.projectFolder,
        getObjectByHandle: function(filepath) { return getObjectByHandle(filepath, genOptions) },
        onError: onError,
        onData: async function(content) { 
            await fs.writeFile(options.output, content, "utf-8")
            success = true
        }
    }

    var generator = createDrakonTechGenerator(genOptions)
    await generator.run()

    if (!success) {
        console.log("Build failed")
    }
}

main()