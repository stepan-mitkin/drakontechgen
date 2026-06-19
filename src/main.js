const esprima = require("esprima");
const escodegen = require("escodegen");
const luaparse = require('luaparse')
const fs = require("fs").promises;
const path = require("path");
const {
  createDrakonTechGenerator,
  createClojureGenerator,
} = require("./drakontechgen");
const { Js2604Generator } = require("./js2604");
const { Lua2604Generator } = require("./lua2604")
const { Kumir2606Generator } = require("./kumir2606")
const { toTree } = require("drakongen");
const { Pfl2605Generator } = require("./pfl2605");
const { Os2605Generator } = require("./os2605");
const { createC2606Generator } = require("./c2606")

var success = undefined;

// Display usage summary
function displayUsage() {
  console.log(`Usage:
    drakontechgen <path>                        Read the project from <path> and output the generated file the same folder
    drakontechgen <path> --language <language>  Read the project from <path> and set the output language (JS or clojure).
    drakontechgen <path> --language clojure --main <main-fun>
                                                Read the project from <path> and call the function <main-fun>.
    drakontechgen --output <output file> <path> Read the project from <path> and output the generated file to the specified filename
    drakontechgen                             Display this usage summary.`);
}

function parseCommandLine() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    return false;
  }

  let options = {};
  options.language = "JS";

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--main":
        options.main = args[++i];
        break;
      case "--output":
        options.output = args[++i];
        break;
      case "--language":
        options.language = args[++i];
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

  options.projectFolder = path.resolve(options.projectFolder);

  if (!options.output) {
    var parsed = path.parse(options.projectFolder);
    var ext = ".js";
    if (options.language === "JS" || options.language === "JS2604") {
      ext = ".js";
    } else if (options.language === "LUA2604") {
      ext = ".lua";
    } else if (options.language === "OS2605") {
      ext = ".os";
    } else if (options.language === "C2606") {
      ext = ".c";
    } else {
      ext = ".clj";
    }
    options.output = path.join(options.projectFolder, parsed.name + ext);
  }
  options.name = path.parse(options.projectFolder).name;

  return options;
}

function isGoodName(filename) {
  if (filename.startsWith(".")) {
    return false;
  }
  return true;
}

async function getObjectByHandle(filepath) {
  var stats = await fs.stat(filepath);
  var parsed = path.parse(filepath);
  if (stats.isDirectory()) {
    var files = await fs.readdir(filepath);
    var goodNames = files.filter(isGoodName);
    return {
      path: filepath,
      type: "folder",
      name: parsed.base,
      children: goodNames.map((file) => path.join(filepath, file)),
    };
  } else {
    if (parsed.ext === ".drakon") {
      try {
        var content = await fs.readFile(filepath, "utf-8");
        var obj = JSON.parse(content);
        obj.path = filepath;
        obj.name = parsed.name;
        return obj;
      } catch (ex) {
        onError({
          message: ex.message,
          filename: filepath,
        });
      }
    }
    return undefined;
  }
}

function onError(err) {
  console.error(`${err.message}`);
  console.error(`Filename: ${err.filename}`);
  if (err.nodeId) {
    console.error(`Node id: ${err.nodeId}`);
  }
  if (err.stack) {
    console.log(err.stack);
  }
  success = false;
}

function makeAuxFilename(output, newName) {
  return path.join(path.dirname(output), newName)
}

// Main logic
async function main() {
  var options = parseCommandLine();
  if (!options) {
    displayUsage();
    return;
  }
  var genOptions = {
    toTree: toTree,
    escodegen: escodegen,
    esprima: esprima,
    parseLua: function(text) { return luaparse.parse(text)},
    name: options.name,
    root: options.projectFolder,
    main: options.main,
    settings: { iife: false, unit: false, dependencies: "depX\ndepA" },
    getObjectByHandle: function (filepath) {
      return getObjectByHandle(filepath, genOptions);
    },
    onError: onError,
    onData: async function (content) {
      await fs.writeFile(options.output, content, "utf-8");
      success = true;
    },
    onAuxData: async function (auxName, auxContent) {
      var filename = makeAuxFilename(options.output, auxName)
      await fs.writeFile(filename, auxContent, "utf-8");
    }
  };

  var generator;
  if (options.language === "JS") {
    generator = createDrakonTechGenerator(genOptions);
  } else if (options.language === "JS2604") {
    generator = Js2604Generator(genOptions);
  } else if (options.language === "LUA2604") {
    generator = Lua2604Generator(genOptions);
  } else if (options.language === "KUMIR2606") {
    generator = Kumir2606Generator(genOptions);
  } else if (options.language === "C2606") {
    generator = createC2606Generator(genOptions)
  } else if (options.language === "PFL2605") {
    generator = Pfl2605Generator(genOptions);
  } else if (options.language === "OS2605") {
    generator = Os2605Generator(genOptions);    
  } else if (options.language === "clojure") {
    generator = createClojureGenerator(genOptions);
  } else {
    console.error(
      "Unexpected language. --language must be JS2604, JS, LUA2604, KUMIR2606, C2606, PFL2605, OS2605, or clojure",
    );
    return;
  }
  await generator.run();

  if (!success) {
    console.log("Build failed");
  }
}

main();
