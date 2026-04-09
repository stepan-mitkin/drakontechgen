var x = {
  path: "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/classes",
  type: "folder",
  name: "classes",
  children: {
    GreyClass: {
      path: "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/classes/GreyClass",
      type: "folder",
      name: "GreyClass",
      children: {
        class: {
          type: "drakon",
          items: {
            1: {
              type: "end",
            },
            2: {
              type: "branch",
              branchId: 0,
              one: "1",
            },
          },
          keywords: {
            export: false,
            function: true,
            scenario: false,
            async: false,
            algoprop: false,
          },
          params: "value",
          path: "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/classes/GreyClass/class.drakon",
          name: "class",
        },
        getValue: {
          type: "drakon",
          items: {
            1: {
              type: "end",
            },
            2: {
              type: "branch",
              branchId: 0,
              one: "4",
            },
            3: {
              type: "action",
              one: "1",
              content: "return value",
            },
            4: {
              type: "action",
              one: "3",
              content: 'log("getValue")',
            },
          },
          keywords: {
            export: true,
            function: true,
            scenario: false,
            async: false,
            algoprop: false,
          },
          params: "",
          path: "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/classes/GreyClass/getValue.drakon",
          name: "getValue",
        },
        log: {
          type: "drakon",
          items: {
            1: {
              type: "end",
            },
            2: {
              type: "branch",
              branchId: 0,
              one: "4",
            },
            4: {
              type: "action",
              one: "1",
              content: 'console.log("GreyClass", message)',
            },
          },
          keywords: {
            export: false,
            function: true,
            scenario: false,
            async: false,
            algoprop: false,
          },
          params: "message",
          path: "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/classes/GreyClass/log.drakon",
          name: "log",
        },
      },
    },
    YellowClass: {
      path: "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/classes/YellowClass",
      type: "folder",
      name: "YellowClass",
      children: {
        API: {
          path: "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/classes/YellowClass/API",
          type: "folder",
          name: "API",
          children: {
            getFullInfo: {
              type: "drakon",
              items: {
                1: {
                  type: "end",
                },
                2: {
                  type: "branch",
                  branchId: 0,
                  one: "5",
                },
                3: {
                  type: "action",
                  one: "4",
                  content:
                    "result = {\n    name: name,\n    color: color,\n    address: self.address,\n    a: a,\n    b: b,\n    x: x,\n    y: y\n}",
                },
                4: {
                  type: "action",
                  one: "1",
                  content: "return result",
                },
                5: {
                  type: "action",
                  one: "6",
                  content: 'log("getFullInfo")',
                },
                6: {
                  type: "action",
                  one: "3",
                  content: "a = 1000",
                },
              },
              keywords: {
                export: true,
                function: true,
                scenario: false,
                async: false,
                algoprop: false,
              },
              params: "",
              path: "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/classes/YellowClass/API/getFullInfo.drakon",
              name: "getFullInfo",
            },
            greet: {
              type: "drakon",
              items: {
                1: {
                  type: "end",
                },
                2: {
                  type: "branch",
                  branchId: 0,
                  one: "4",
                },
                3: {
                  type: "action",
                  one: "5",
                  content:
                    'message = greeting + ", " + title + " " +\nname + "!"',
                },
                4: {
                  type: "action",
                  one: "3",
                  content: 'log("greet")',
                },
                5: {
                  type: "action",
                  one: "1",
                  content: "return message",
                },
              },
              keywords: {
                export: true,
                function: true,
                scenario: false,
                async: false,
                algoprop: false,
              },
              params: "",
              path: "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/classes/YellowClass/API/greet.drakon",
              name: "greet",
            },
            setName: {
              type: "drakon",
              items: {
                1: {
                  type: "end",
                },
                2: {
                  type: "branch",
                  branchId: 0,
                  one: "4",
                },
                3: {
                  type: "action",
                  one: "1",
                  content: "name = newName",
                },
                4: {
                  type: "action",
                  one: "3",
                  content: 'log("setName: " + newName)',
                },
              },
              keywords: {
                export: true,
                function: true,
                scenario: false,
                async: false,
                algoprop: false,
              },
              params: "newName",
              path: "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/classes/YellowClass/API/setName.drakon",
              name: "setName",
            },
            setTitle: {
              type: "drakon",
              items: {
                1: {
                  type: "end",
                },
                2: {
                  type: "branch",
                  branchId: 0,
                  one: "4",
                },
                3: {
                  type: "action",
                  one: "1",
                  content: "title = newTitle",
                },
                4: {
                  type: "action",
                  one: "3",
                  content: 'log("setTitle: " + newTitle)',
                },
              },
              keywords: {
                export: true,
                function: true,
                scenario: false,
                async: false,
                algoprop: false,
              },
              params: "newTitle",
              path: "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/classes/YellowClass/API/setTitle.drakon",
              name: "setTitle",
            },
          },
        },
        Private: {
          path: "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/classes/YellowClass/Private",
          type: "folder",
          name: "Private",
          children: {
            log: {
              type: "drakon",
              items: {
                1: {
                  type: "end",
                },
                2: {
                  type: "branch",
                  branchId: 0,
                  one: "3",
                },
                3: {
                  type: "action",
                  one: "1",
                  content: 'console.log("YellowClass", message)',
                },
              },
              keywords: {
                export: false,
                function: true,
                scenario: false,
                async: false,
                algoprop: false,
              },
              params: "message",
              path: "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/classes/YellowClass/Private/log.drakon",
              name: "log",
            },
          },
        },
        class: {
          type: "drakon",
          items: {
            1: {
              type: "end",
            },
            2: {
              type: "branch",
              branchId: 0,
              one: "3",
            },
            3: {
              type: "action",
              one: "4",
              content: 'title = "Dr."',
            },
            4: {
              type: "action",
              one: "5",
              content: 'const greeting = "Hello"',
            },
            5: {
              type: "action",
              one: "1",
              content: "const {\n    x,\n    y\n} = arg1\nvar [a, b] = arg2",
            },
          },
          keywords: {
            export: true,
            function: true,
            async: false,
            algoprop: false,
            lazy: false,
          },
          params: "name\ncolor\narg1\narg2",
          path: "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/classes/YellowClass/class.drakon",
          name: "class",
        },
      },
    },
    runGrey: {
      type: "drakon",
      items: {
        1: {
          type: "end",
        },
        2: {
          type: "branch",
          branchId: 0,
          one: "3",
        },
        3: {
          type: "action",
          one: "4",
          content: "grey = GreyClass(42)",
        },
        4: {
          type: "action",
          one: "1",
          content: "return grey.getValue()",
        },
      },
      keywords: {
        export: true,
        function: true,
        scenario: false,
        async: false,
        algoprop: false,
      },
      params: "",
      path: "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/classes/runGrey.drakon",
      name: "runGrey",
    },
    solution: {
      language: "JS2604",
      outputFile: "../classes.js",
      path: "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/classes/solution.json",
      name: "solution",
    },
  },
};
