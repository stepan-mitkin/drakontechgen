const {
  createDrakonTechGenerator,
  createClojureGenerator,
} = require("./drakontechgen");

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
    } else {
      return createClojureGenerator(genOptions);
    }
  },
};
