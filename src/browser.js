const {
  createDrakonTechGenerator,
  createClojureGenerator,
} = require("./drakontechgen");
const { Js2604Generator } = require("./js2604");
const { Lua2604Generator } = require("./lua2604");

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
    language = language || "JS";
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
    } else {
      return createClojureGenerator(genOptions);
    }
  },
};
