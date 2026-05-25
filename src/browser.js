const {
  createDrakonTechGenerator,
  createClojureGenerator,
} = require("./drakontechgen");
const { Js2604Generator } = require("./js2604");
const { Lua2604Generator } = require("./lua2604");
const { Pfl2605Generator } = require("./pfl2605");
const { Os2605Generator } = require("./os2605");


window.drakontechgen = {
  buildGenerator: function (
    name,
    root,
    getObjectByHandle,
    onError,
    onData,
    language,
    main,
    settings,
  ) {
    language = language || "JS2604";
    var genOptions = {
      toTree: window.drakongen.toTree,
      escodegen: window.escodegen,
      esprima: window.esprima,
      parseLua: function(text) { return window.luaparse.parse(text)},
      name: name,
      main: main,
      root: root,
      getObjectByHandle: getObjectByHandle,
      onError: onError,
      onData: onData,
      settings: settings,
    };

    if (language === "JS") {
      return createDrakonTechGenerator(genOptions);
    } else if (language === "LUA2604") {
      return Lua2604Generator(genOptions);    
    } else if (language === "JS2604") {
      return Js2604Generator(genOptions);
    } else if (language === "OS2605") {
      return Os2605Generator(genOptions);          
    } else if (language === "PFL2605") {
      return Pfl2605Generator(genOptions);      
    } else {
      return createClojureGenerator(genOptions);
    }
  },
};
