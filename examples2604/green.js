{
    "type": "drakon",
    "name": "module",
    "items": {
        "1": {
            "type": "end"
        },
        "2": {
            "type": "branch",
            "branchId": 0,
            "one": "3"
        },
        "3": {
            "type": "action",
            "one": "4",
            "content": [
                {
                    "type": "VariableDeclaration",
                    "declarations": [
                        {
                            "type": "VariableDeclarator",
                            "id": {
                                "type": "ObjectPattern",
                                "properties": [
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "multiply"
                                        },
                                        "computed": false,
                                        "value": {
                                            "type": "Identifier",
                                            "name": "multiply"
                                        },
                                        "kind": "init",
                                        "method": false,
                                        "shorthand": true
                                    }
                                ]
                            },
                            "init": {
                                "type": "CallExpression",
                                "callee": {
                                    "type": "Identifier",
                                    "name": "require"
                                },
                                "arguments": [
                                    {
                                        "type": "Literal",
                                        "value": "./ops",
                                        "raw": "\"./ops\""
                                    }
                                ]
                            }
                        }
                    ],
                    "kind": "const",
                    "itemId": "3"
                }
            ]
        },
        "4": {
            "type": "action",
            "one": "1",
            "content": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": {
                            "type": "Identifier",
                            "name": "secretValue"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 23,
                            "raw": "23"
                        }
                    },
                    "itemId": "4"
                },
                {
                    "type": "VariableDeclaration",
                    "declarations": [
                        {
                            "type": "VariableDeclarator",
                            "id": {
                                "type": "Identifier",
                                "name": "nextId"
                            },
                            "init": {
                                "type": "Literal",
                                "value": 1,
                                "raw": "1"
                            }
                        }
                    ],
                    "kind": "var",
                    "itemId": "4"
                }
            ]
        }
    },
    "keywords": {
        "function": true
    },
    "children": {
        "doWhile": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "3"
                },
                "3": {
                    "type": "action",
                    "one": "7",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "result"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 0,
                                    "raw": "0"
                                }
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "question",
                    "one": "5",
                    "two": "7",
                    "flag1": 1,
                    "content": {
                        "type": "BinaryExpression",
                        "operator": ">",
                        "left": {
                            "type": "Identifier",
                            "name": "result"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 20,
                            "raw": "20"
                        }
                    }
                },
                "5": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Identifier",
                                "name": "result"
                            },
                            "itemId": "5"
                        }
                    ]
                },
                "6": {
                    "type": "action",
                    "one": "4",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "+=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "result"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 3,
                                    "raw": "3"
                                }
                            },
                            "itemId": "6"
                        }
                    ]
                },
                "7": {
                    "type": "arrow-loop",
                    "one": "6"
                }
            },
            "type": "drakon",
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/ArrowLoop/doWhile.drakon",
            "name": "doWhile",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "doWhile",
                "declarations": {},
                "loop": {},
                "children": {}
            },
            "argNames": [],
            "events": {},
            "eventItems": []
        },
        "doWhileDo": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "3"
                },
                "3": {
                    "type": "action",
                    "one": "7",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "result"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 0,
                                    "raw": "0"
                                }
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "question",
                    "one": "5",
                    "two": "8",
                    "flag1": 1,
                    "content": {
                        "type": "BinaryExpression",
                        "operator": ">",
                        "left": {
                            "type": "Identifier",
                            "name": "result"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 20,
                            "raw": "20"
                        }
                    }
                },
                "5": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Identifier",
                                "name": "result"
                            },
                            "itemId": "5"
                        }
                    ]
                },
                "7": {
                    "type": "arrow-loop",
                    "one": "9"
                },
                "8": {
                    "type": "action",
                    "one": "7",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "+=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "result"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 3,
                                    "raw": "3"
                                }
                            },
                            "itemId": "8"
                        }
                    ]
                },
                "9": {
                    "type": "action",
                    "one": "4",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "+=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "result"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 7,
                                    "raw": "7"
                                }
                            },
                            "itemId": "9"
                        }
                    ]
                }
            },
            "type": "drakon",
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/ArrowLoop/doWhileDo.drakon",
            "name": "doWhileDo",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "doWhileDo",
                "declarations": {},
                "loop": {},
                "children": {}
            },
            "argNames": [],
            "events": {},
            "eventItems": []
        },
        "selectArrow": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "3"
                },
                "3": {
                    "type": "action",
                    "one": "9",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "result"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 0,
                                    "raw": "0"
                                }
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "5": {
                    "type": "case",
                    "one": "8",
                    "two": null
                },
                "6": {
                    "type": "case",
                    "one": "10",
                    "two": "11",
                    "content": {
                        "type": "Literal",
                        "value": 10,
                        "raw": "10"
                    }
                },
                "7": {
                    "type": "select",
                    "one": "6",
                    "content": {
                        "type": "Identifier",
                        "name": "result"
                    }
                },
                "8": {
                    "type": "action",
                    "one": "9",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "UpdateExpression",
                                "operator": "++",
                                "argument": {
                                    "type": "Identifier",
                                    "name": "result"
                                },
                                "prefix": false
                            },
                            "itemId": "8"
                        }
                    ]
                },
                "9": {
                    "type": "arrow-loop",
                    "one": "7"
                },
                "10": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Identifier",
                                "name": "result"
                            },
                            "itemId": "10"
                        }
                    ]
                },
                "11": {
                    "one": "12",
                    "type": "case",
                    "two": "5",
                    "content": {
                        "type": "Literal",
                        "value": 5,
                        "raw": "5"
                    }
                },
                "12": {
                    "type": "action",
                    "one": "9",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "+=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "result"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 2,
                                    "raw": "2"
                                }
                            },
                            "itemId": "12"
                        }
                    ]
                }
            },
            "type": "drakon",
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/ArrowLoop/selectArrow.drakon",
            "name": "selectArrow",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "selectArrow",
                "declarations": {},
                "loop": {},
                "children": {}
            },
            "argNames": [],
            "events": {},
            "eventItems": []
        },
        "twoExits": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "14"
                },
                "4": {
                    "type": "question",
                    "one": "10",
                    "two": "7",
                    "flag1": 0,
                    "content": {
                        "type": "BinaryExpression",
                        "operator": "<",
                        "left": {
                            "type": "Identifier",
                            "name": "i"
                        },
                        "right": {
                            "type": "MemberExpression",
                            "computed": false,
                            "object": {
                                "type": "Identifier",
                                "name": "array"
                            },
                            "property": {
                                "type": "Identifier",
                                "name": "length"
                            }
                        }
                    }
                },
                "7": {
                    "type": "action",
                    "one": "8",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "item"
                                },
                                "right": {
                                    "type": "MemberExpression",
                                    "computed": true,
                                    "object": {
                                        "type": "Identifier",
                                        "name": "array"
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "i"
                                    }
                                }
                            },
                            "itemId": "7"
                        }
                    ]
                },
                "8": {
                    "type": "question",
                    "one": "9",
                    "two": "11",
                    "flag1": 1,
                    "content": {
                        "type": "BinaryExpression",
                        "operator": "===",
                        "left": {
                            "type": "Identifier",
                            "name": "item"
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "value"
                        }
                    }
                },
                "9": {
                    "type": "action",
                    "one": "13",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "index"
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "i"
                                }
                            },
                            "itemId": "9"
                        }
                    ]
                },
                "10": {
                    "type": "action",
                    "one": "13",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "index"
                                },
                                "right": {
                                    "type": "UnaryExpression",
                                    "operator": "-",
                                    "argument": {
                                        "type": "Literal",
                                        "value": 1,
                                        "raw": "1"
                                    },
                                    "prefix": true
                                }
                            },
                            "itemId": "10"
                        }
                    ]
                },
                "11": {
                    "type": "action",
                    "one": "12",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "UpdateExpression",
                                "operator": "++",
                                "argument": {
                                    "type": "Identifier",
                                    "name": "i"
                                },
                                "prefix": false
                            },
                            "itemId": "11"
                        }
                    ]
                },
                "12": {
                    "type": "arrow-loop",
                    "one": "4"
                },
                "13": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Identifier",
                                "name": "index"
                            },
                            "itemId": "13"
                        }
                    ]
                },
                "14": {
                    "type": "question",
                    "one": "16",
                    "two": "15",
                    "flag1": 1,
                    "content": {
                        "type": "Identifier",
                        "name": "array"
                    }
                },
                "15": {
                    "type": "action",
                    "one": "16",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "array"
                                },
                                "right": {
                                    "type": "ArrayExpression",
                                    "elements": []
                                }
                            },
                            "itemId": "15"
                        }
                    ]
                },
                "16": {
                    "type": "action",
                    "one": "12",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "i"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 0,
                                    "raw": "0"
                                }
                            },
                            "itemId": "16"
                        }
                    ]
                }
            },
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "array\nvalue",
            "type": "drakon",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/ArrowLoop/twoExits.drakon",
            "name": "twoExits",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "twoExits",
                "declarations": {
                    "array": true,
                    "value": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "array",
                "value"
            ],
            "events": {},
            "eventItems": []
        },
        "whileDo": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "3"
                },
                "3": {
                    "type": "action",
                    "one": "7",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "result"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 0,
                                    "raw": "0"
                                }
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "question",
                    "one": "5",
                    "two": "8",
                    "flag1": 1,
                    "content": {
                        "type": "BinaryExpression",
                        "operator": ">",
                        "left": {
                            "type": "Identifier",
                            "name": "result"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 20,
                            "raw": "20"
                        }
                    }
                },
                "5": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Identifier",
                                "name": "result"
                            },
                            "itemId": "5"
                        }
                    ]
                },
                "7": {
                    "type": "arrow-loop",
                    "one": "4"
                },
                "8": {
                    "type": "action",
                    "one": "7",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "+=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "result"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 3,
                                    "raw": "3"
                                }
                            },
                            "itemId": "8"
                        }
                    ]
                }
            },
            "type": "drakon",
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/ArrowLoop/whileDo.drakon",
            "name": "whileDo",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "whileDo",
                "declarations": {},
                "loop": {},
                "children": {}
            },
            "argNames": [],
            "events": {},
            "eventItems": []
        },
        "pause": {
            "type": "drakon",
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "3"
                },
                "3": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "NewExpression",
                                "callee": {
                                    "type": "Identifier",
                                    "name": "Promise"
                                },
                                "arguments": [
                                    {
                                        "type": "ArrowFunctionExpression",
                                        "id": null,
                                        "params": [
                                            {
                                                "type": "Identifier",
                                                "name": "resolve"
                                            }
                                        ],
                                        "body": {
                                            "type": "CallExpression",
                                            "callee": {
                                                "type": "Identifier",
                                                "name": "setTimeout"
                                            },
                                            "arguments": [
                                                {
                                                    "type": "Identifier",
                                                    "name": "resolve"
                                                },
                                                {
                                                    "type": "Identifier",
                                                    "name": "milliseconds"
                                                }
                                            ]
                                        },
                                        "generator": false,
                                        "expression": true,
                                        "async": false
                                    }
                                ]
                            },
                            "itemId": "3"
                        }
                    ]
                }
            },
            "keywords": {
                "export": false,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "milliseconds",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/Async/pause.drakon",
            "name": "pause",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "pause",
                "declarations": {
                    "milliseconds": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "milliseconds"
            ],
            "events": {},
            "eventItems": []
        },
        "slow": {
            "type": "drakon",
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "3"
                },
                "3": {
                    "type": "action",
                    "one": "5",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "CallExpression",
                                "callee": {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                        "type": "Identifier",
                                        "name": "console"
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "log"
                                    }
                                },
                                "arguments": [
                                    {
                                        "type": "Literal",
                                        "value": "slow",
                                        "raw": "\"slow\""
                                    },
                                    {
                                        "type": "Literal",
                                        "value": "start",
                                        "raw": "\"start\""
                                    }
                                ]
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "CallExpression",
                                "callee": {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                        "type": "Identifier",
                                        "name": "console"
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "log"
                                    }
                                },
                                "arguments": [
                                    {
                                        "type": "Literal",
                                        "value": "slow",
                                        "raw": "\"slow\""
                                    },
                                    {
                                        "type": "Literal",
                                        "value": "end",
                                        "raw": "\"end\""
                                    }
                                ]
                            },
                            "itemId": "4"
                        }
                    ]
                },
                "5": {
                    "type": "action",
                    "one": "4",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AwaitExpression",
                                "argument": {
                                    "type": "CallExpression",
                                    "callee": {
                                        "type": "Identifier",
                                        "name": "pause"
                                    },
                                    "arguments": [
                                        {
                                            "type": "Literal",
                                            "value": 1000,
                                            "raw": "1000"
                                        }
                                    ]
                                }
                            },
                            "itemId": "5"
                        }
                    ]
                }
            },
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": true,
                "algoprop": false
            },
            "params": "",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/Async/slow.drakon",
            "name": "slow",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "slow",
                "declarations": {},
                "loop": {},
                "children": {}
            },
            "argNames": [],
            "events": {},
            "eventItems": []
        },
        "earlyExit": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "7"
                },
                "3": {
                    "type": "action",
                    "one": "10",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "CallExpression",
                                "callee": {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                        "type": "Identifier",
                                        "name": "array"
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "splice"
                                    }
                                },
                                "arguments": [
                                    {
                                        "type": "Identifier",
                                        "name": "index"
                                    },
                                    {
                                        "type": "Literal",
                                        "value": 1,
                                        "raw": "1"
                                    }
                                ]
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "loopend",
                    "one": "9",
                    "content": ""
                },
                "5": {
                    "type": "loopbegin",
                    "one": "6",
                    "content": {
                        "type": "ForStatement",
                        "init": {
                            "type": "AssignmentExpression",
                            "operator": "=",
                            "left": {
                                "type": "Identifier",
                                "name": "i"
                            },
                            "right": {
                                "type": "Literal",
                                "value": 0,
                                "raw": "0"
                            }
                        },
                        "test": {
                            "type": "BinaryExpression",
                            "operator": "<",
                            "left": {
                                "type": "Identifier",
                                "name": "i"
                            },
                            "right": {
                                "type": "MemberExpression",
                                "computed": false,
                                "object": {
                                    "type": "Identifier",
                                    "name": "array"
                                },
                                "property": {
                                    "type": "Identifier",
                                    "name": "length"
                                }
                            }
                        },
                        "update": {
                            "type": "UpdateExpression",
                            "operator": "++",
                            "argument": {
                                "type": "Identifier",
                                "name": "i"
                            },
                            "prefix": false
                        },
                        "body": {
                            "type": "BlockStatement",
                            "body": []
                        },
                        "itemId": "5"
                    }
                },
                "6": {
                    "type": "question",
                    "one": "4",
                    "two": "8",
                    "flag1": 0,
                    "content": {
                        "type": "BinaryExpression",
                        "operator": "===",
                        "left": {
                            "type": "MemberExpression",
                            "computed": true,
                            "object": {
                                "type": "Identifier",
                                "name": "array"
                            },
                            "property": {
                                "type": "Identifier",
                                "name": "i"
                            }
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "value"
                        }
                    }
                },
                "7": {
                    "type": "action",
                    "one": "5",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "index"
                                },
                                "right": {
                                    "type": "UnaryExpression",
                                    "operator": "-",
                                    "argument": {
                                        "type": "Literal",
                                        "value": 1,
                                        "raw": "1"
                                    },
                                    "prefix": true
                                }
                            },
                            "itemId": "7"
                        }
                    ]
                },
                "8": {
                    "type": "action",
                    "one": "9",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "index"
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "i"
                                }
                            },
                            "itemId": "8"
                        }
                    ]
                },
                "9": {
                    "type": "question",
                    "one": "3",
                    "two": "10",
                    "flag1": 0,
                    "content": {
                        "type": "BinaryExpression",
                        "operator": "===",
                        "left": {
                            "type": "Identifier",
                            "name": "index"
                        },
                        "right": {
                            "type": "UnaryExpression",
                            "operator": "-",
                            "argument": {
                                "type": "Literal",
                                "value": 1,
                                "raw": "1"
                            },
                            "prefix": true
                        }
                    }
                },
                "10": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Identifier",
                                "name": "array"
                            },
                            "itemId": "10"
                        }
                    ]
                }
            },
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "array\nvalue",
            "type": "drakon",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/ForLoop/earlyExit.drakon",
            "name": "earlyExit",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "earlyExit",
                "declarations": {
                    "array": true,
                    "value": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "array",
                "value"
            ],
            "events": {},
            "eventItems": []
        },
        "forLoopNoDeclare": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "7"
                },
                "3": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Identifier",
                                "name": "copy"
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "loopend",
                    "one": "3",
                    "content": ""
                },
                "5": {
                    "type": "loopbegin",
                    "one": "8",
                    "content": {
                        "type": "ForStatement",
                        "init": {
                            "type": "AssignmentExpression",
                            "operator": "=",
                            "left": {
                                "type": "Identifier",
                                "name": "i"
                            },
                            "right": {
                                "type": "Literal",
                                "value": 0,
                                "raw": "0"
                            }
                        },
                        "test": {
                            "type": "BinaryExpression",
                            "operator": "<",
                            "left": {
                                "type": "Identifier",
                                "name": "i"
                            },
                            "right": {
                                "type": "MemberExpression",
                                "computed": false,
                                "object": {
                                    "type": "Identifier",
                                    "name": "array"
                                },
                                "property": {
                                    "type": "Identifier",
                                    "name": "length"
                                }
                            }
                        },
                        "update": {
                            "type": "AssignmentExpression",
                            "operator": "+=",
                            "left": {
                                "type": "Identifier",
                                "name": "i"
                            },
                            "right": {
                                "type": "Literal",
                                "value": 2,
                                "raw": "2"
                            }
                        },
                        "body": {
                            "type": "BlockStatement",
                            "body": []
                        },
                        "itemId": "5"
                    }
                },
                "6": {
                    "type": "action",
                    "one": "4",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "MemberExpression",
                                    "computed": true,
                                    "object": {
                                        "type": "Identifier",
                                        "name": "copy"
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "key"
                                    }
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "value"
                                }
                            },
                            "itemId": "6"
                        }
                    ]
                },
                "7": {
                    "type": "action",
                    "one": "5",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "copy"
                                },
                                "right": {
                                    "type": "ObjectExpression",
                                    "properties": []
                                }
                            },
                            "itemId": "7"
                        }
                    ]
                },
                "8": {
                    "type": "action",
                    "one": "6",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "key"
                                },
                                "right": {
                                    "type": "MemberExpression",
                                    "computed": true,
                                    "object": {
                                        "type": "Identifier",
                                        "name": "array"
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "i"
                                    }
                                }
                            },
                            "itemId": "8"
                        },
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "value"
                                },
                                "right": {
                                    "type": "MemberExpression",
                                    "computed": true,
                                    "object": {
                                        "type": "Identifier",
                                        "name": "array"
                                    },
                                    "property": {
                                        "type": "BinaryExpression",
                                        "operator": "+",
                                        "left": {
                                            "type": "Identifier",
                                            "name": "i"
                                        },
                                        "right": {
                                            "type": "Literal",
                                            "value": 1,
                                            "raw": "1"
                                        }
                                    }
                                }
                            },
                            "itemId": "8"
                        }
                    ]
                }
            },
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "array",
            "type": "drakon",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/ForLoop/forLoopNoDeclare.drakon",
            "name": "forLoopNoDeclare",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "forLoopNoDeclare",
                "declarations": {
                    "array": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "array"
            ],
            "events": {},
            "eventItems": []
        },
        "foreachLoopArray": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "7"
                },
                "3": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Identifier",
                                "name": "copy"
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "loopend",
                    "one": "3",
                    "content": ""
                },
                "5": {
                    "type": "loopbegin",
                    "one": "8",
                    "content": {
                        "type": "ForOfStatement",
                        "left": {
                            "type": "Identifier",
                            "name": "item"
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "array"
                        },
                        "body": {
                            "type": "BlockStatement",
                            "body": []
                        },
                        "itemId": "5"
                    },
                    "subtype": "array",
                    "variable": "item"
                },
                "6": {
                    "type": "action",
                    "one": "4",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "CallExpression",
                                "callee": {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                        "type": "Identifier",
                                        "name": "copy"
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "push"
                                    }
                                },
                                "arguments": [
                                    {
                                        "type": "Identifier",
                                        "name": "value2"
                                    }
                                ]
                            },
                            "itemId": "6"
                        }
                    ]
                },
                "7": {
                    "type": "action",
                    "one": "5",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "copy"
                                },
                                "right": {
                                    "type": "ArrayExpression",
                                    "elements": []
                                }
                            },
                            "itemId": "7"
                        }
                    ]
                },
                "8": {
                    "type": "action",
                    "one": "6",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "value2"
                                },
                                "right": {
                                    "type": "BinaryExpression",
                                    "operator": "+",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "item"
                                    },
                                    "right": {
                                        "type": "Identifier",
                                        "name": "value"
                                    }
                                }
                            },
                            "itemId": "8"
                        }
                    ]
                }
            },
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "array\nvalue",
            "type": "drakon",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/ForLoop/foreachLoopArray.drakon",
            "name": "foreachLoopArray",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "foreachLoopArray",
                "declarations": {
                    "array": true,
                    "value": true,
                    "item": true
                },
                "loop": {
                    "item": true
                },
                "children": {}
            },
            "argNames": [
                "array",
                "value"
            ],
            "events": {},
            "eventItems": []
        },
        "foreachLoopObject": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "7"
                },
                "3": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Identifier",
                                "name": "copy"
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "loopend",
                    "one": "3",
                    "content": ""
                },
                "5": {
                    "type": "loopbegin",
                    "one": "_item__4",
                    "content": {
                        "type": "ForInStatement",
                        "left": {
                            "type": "Identifier",
                            "name": "key"
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "_collection_2"
                        },
                        "body": {
                            "type": "BlockStatement",
                            "body": []
                        },
                        "each": false,
                        "itemId": "5"
                    },
                    "subtype": "dictionary",
                    "keyVariable": "key",
                    "valueVariable": "item"
                },
                "6": {
                    "type": "action",
                    "one": "4",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "MemberExpression",
                                    "computed": true,
                                    "object": {
                                        "type": "Identifier",
                                        "name": "copy"
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "key"
                                    }
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "value2"
                                }
                            },
                            "itemId": "6"
                        }
                    ]
                },
                "7": {
                    "type": "action",
                    "one": "9",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "copy"
                                },
                                "right": {
                                    "type": "ObjectExpression",
                                    "properties": []
                                }
                            },
                            "itemId": "7"
                        }
                    ]
                },
                "8": {
                    "type": "action",
                    "one": "6",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "value2"
                                },
                                "right": {
                                    "type": "BinaryExpression",
                                    "operator": "+",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "item"
                                    },
                                    "right": {
                                        "type": "Identifier",
                                        "name": "value"
                                    }
                                }
                            },
                            "itemId": "8"
                        }
                    ]
                },
                "9": {
                    "type": "action",
                    "one": "_item__3",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "wrapper"
                                },
                                "right": {
                                    "type": "ObjectExpression",
                                    "properties": [
                                        {
                                            "type": "Property",
                                            "key": {
                                                "type": "Identifier",
                                                "name": "collection"
                                            },
                                            "computed": false,
                                            "value": {
                                                "type": "Identifier",
                                                "name": "object"
                                            },
                                            "kind": "init",
                                            "method": false,
                                            "shorthand": false
                                        }
                                    ]
                                }
                            },
                            "itemId": "9"
                        }
                    ]
                },
                "_item__3": {
                    "id": "_item__3",
                    "type": "action",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "_collection_2"
                                },
                                "right": {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                        "type": "Identifier",
                                        "name": "wrapper"
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "collection"
                                    }
                                }
                            }
                        }
                    ],
                    "one": "5"
                },
                "_item__4": {
                    "id": "_item__4",
                    "type": "action",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": "item",
                                "right": {
                                    "type": "MemberExpression",
                                    "computed": true,
                                    "object": {
                                        "type": "Identifier",
                                        "name": "_collection_2"
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "key"
                                    }
                                },
                                "loopInternal": true
                            }
                        }
                    ],
                    "one": "8"
                }
            },
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "object\nvalue",
            "type": "drakon",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/ForLoop/foreachLoopObject.drakon",
            "name": "foreachLoopObject",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "foreachLoopObject",
                "declarations": {
                    "object": true,
                    "value": true,
                    "key": true,
                    "item": true
                },
                "loop": {
                    "key": true,
                    "item": true
                },
                "children": {}
            },
            "argNames": [
                "object",
                "value"
            ],
            "events": {},
            "eventItems": []
        },
        "add": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "3"
                },
                "3": {
                    "type": "action",
                    "one": "4",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "result"
                                },
                                "right": {
                                    "type": "CallExpression",
                                    "callee": {
                                        "type": "Identifier",
                                        "name": "addCore"
                                    },
                                    "arguments": [
                                        {
                                            "type": "Identifier",
                                            "name": "left"
                                        },
                                        {
                                            "type": "Identifier",
                                            "name": "right"
                                        }
                                    ]
                                }
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Identifier",
                                "name": "result"
                            },
                            "itemId": "4"
                        }
                    ]
                }
            },
            "type": "drakon",
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "left\nright",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/Math/add.drakon",
            "name": "add",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "add",
                "declarations": {
                    "left": true,
                    "right": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "left",
                "right"
            ],
            "events": {},
            "eventItems": []
        },
        "addCore": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "3"
                },
                "3": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "BinaryExpression",
                                "operator": "+",
                                "left": {
                                    "type": "Identifier",
                                    "name": "left"
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "right"
                                }
                            },
                            "itemId": "3"
                        }
                    ]
                }
            },
            "type": "drakon",
            "keywords": {
                "export": false,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "left\nright",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/Math/addCore.drakon",
            "name": "addCore",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "addCore",
                "declarations": {
                    "left": true,
                    "right": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "left",
                "right"
            ],
            "events": {},
            "eventItems": []
        },
        "mul": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "3"
                },
                "3": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "CallExpression",
                                "callee": {
                                    "type": "Identifier",
                                    "name": "multiply"
                                },
                                "arguments": [
                                    {
                                        "type": "Identifier",
                                        "name": "left"
                                    },
                                    {
                                        "type": "Identifier",
                                        "name": "right"
                                    }
                                ]
                            },
                            "itemId": "3"
                        }
                    ]
                }
            },
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "left\nright",
            "type": "drakon",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/Math/mul.drakon",
            "name": "mul",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "mul",
                "declarations": {
                    "left": true,
                    "right": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "left",
                "right"
            ],
            "events": {},
            "eventItems": []
        },
        "complexAnd": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "4"
                },
                "3": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": true,
                                "raw": "true"
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "question",
                    "one": "5",
                    "two": "8",
                    "flag1": 0,
                    "content": {
                        "type": "Identifier",
                        "name": "valueA"
                    }
                },
                "5": {
                    "type": "question",
                    "one": "3",
                    "two": "8",
                    "flag1": 1,
                    "content": {
                        "type": "Identifier",
                        "name": "valueB"
                    }
                },
                "8": {
                    "type": "question",
                    "one": "3",
                    "two": "9",
                    "flag1": 1,
                    "content": {
                        "type": "Identifier",
                        "name": "valueC"
                    }
                },
                "9": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": false,
                                "raw": "false"
                            },
                            "itemId": "9"
                        }
                    ]
                }
            },
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "valueA\nvalueB\nvalueC",
            "type": "drakon",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/Question/complexAnd.drakon",
            "name": "complexAnd",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "complexAnd",
                "declarations": {
                    "valueA": true,
                    "valueB": true,
                    "valueC": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "valueA",
                "valueB",
                "valueC"
            ],
            "events": {},
            "eventItems": []
        },
        "complexOr": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "4"
                },
                "3": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": true,
                                "raw": "true"
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "question",
                    "one": "3",
                    "two": "8",
                    "flag1": 1,
                    "content": {
                        "type": "Identifier",
                        "name": "valueA"
                    }
                },
                "8": {
                    "type": "question",
                    "one": "11",
                    "two": "12",
                    "flag1": 0,
                    "content": {
                        "type": "Identifier",
                        "name": "valueB"
                    }
                },
                "11": {
                    "type": "question",
                    "one": "3",
                    "two": "12",
                    "flag1": 1,
                    "content": {
                        "type": "Identifier",
                        "name": "valueC"
                    }
                },
                "12": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": false,
                                "raw": "false"
                            },
                            "itemId": "12"
                        }
                    ]
                }
            },
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "valueA\nvalueB\nvalueC",
            "type": "drakon",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/Question/complexOr.drakon",
            "name": "complexOr",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "complexOr",
                "declarations": {
                    "valueA": true,
                    "valueB": true,
                    "valueC": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "valueA",
                "valueB",
                "valueC"
            ],
            "events": {},
            "eventItems": []
        },
        "fizzBuzz": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "4"
                },
                "3": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": "FizzBuzz",
                                "raw": "'FizzBuzz'"
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "question",
                    "one": "5",
                    "two": "7",
                    "flag1": 1,
                    "content": {
                        "type": "BinaryExpression",
                        "operator": "===",
                        "left": {
                            "type": "BinaryExpression",
                            "operator": "%",
                            "left": {
                                "type": "Identifier",
                                "name": "number"
                            },
                            "right": {
                                "type": "Literal",
                                "value": 3,
                                "raw": "3"
                            }
                        },
                        "right": {
                            "type": "Literal",
                            "value": 0,
                            "raw": "0"
                        }
                    }
                },
                "5": {
                    "type": "question",
                    "one": "3",
                    "two": "6",
                    "flag1": 1,
                    "content": {
                        "type": "BinaryExpression",
                        "operator": "===",
                        "left": {
                            "type": "BinaryExpression",
                            "operator": "%",
                            "left": {
                                "type": "Identifier",
                                "name": "number"
                            },
                            "right": {
                                "type": "Literal",
                                "value": 5,
                                "raw": "5"
                            }
                        },
                        "right": {
                            "type": "Literal",
                            "value": 0,
                            "raw": "0"
                        }
                    }
                },
                "6": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": "Fizz",
                                "raw": "'Fizz'"
                            },
                            "itemId": "6"
                        }
                    ]
                },
                "7": {
                    "type": "question",
                    "one": "8",
                    "two": "9",
                    "flag1": 1,
                    "content": {
                        "type": "BinaryExpression",
                        "operator": "===",
                        "left": {
                            "type": "BinaryExpression",
                            "operator": "%",
                            "left": {
                                "type": "Identifier",
                                "name": "number"
                            },
                            "right": {
                                "type": "Literal",
                                "value": 5,
                                "raw": "5"
                            }
                        },
                        "right": {
                            "type": "Literal",
                            "value": 0,
                            "raw": "0"
                        }
                    }
                },
                "8": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": "Buzz",
                                "raw": "'Buzz'"
                            },
                            "itemId": "8"
                        }
                    ]
                },
                "9": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Identifier",
                                "name": "undefined"
                            },
                            "itemId": "9"
                        }
                    ]
                }
            },
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "number",
            "type": "drakon",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/Question/fizzBuzz.drakon",
            "name": "fizzBuzz",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "fizzBuzz",
                "declarations": {
                    "number": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "number"
            ],
            "events": {},
            "eventItems": []
        },
        "inversedAnd": {
            "type": "drakon",
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "4"
                },
                "3": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": true,
                                "raw": "true"
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "question",
                    "one": "8",
                    "two": "10",
                    "flag1": 0,
                    "content": {
                        "type": "BinaryExpression",
                        "operator": "===",
                        "left": {
                            "type": "Identifier",
                            "name": "one"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 1,
                            "raw": "1"
                        }
                    }
                },
                "8": {
                    "type": "question",
                    "one": "9",
                    "two": "10",
                    "flag1": 0,
                    "content": {
                        "type": "BinaryExpression",
                        "operator": "===",
                        "left": {
                            "type": "Identifier",
                            "name": "two"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 2,
                            "raw": "2"
                        }
                    }
                },
                "9": {
                    "type": "question",
                    "one": "3",
                    "two": "10",
                    "flag1": 0,
                    "content": {
                        "type": "BinaryExpression",
                        "operator": "===",
                        "left": {
                            "type": "Identifier",
                            "name": "three"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 3,
                            "raw": "3"
                        }
                    }
                },
                "10": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": false,
                                "raw": "false"
                            },
                            "itemId": "10"
                        }
                    ]
                }
            },
            "keywords": {
                "function": true,
                "machine": false,
                "async": false,
                "export": true,
                "algoprop": false,
                "lazy": false
            },
            "params": "one\ntwo\nthree",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/Question/inversedAnd.drakon",
            "name": "inversedAnd",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "inversedAnd",
                "declarations": {
                    "one": true,
                    "two": true,
                    "three": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "one",
                "two",
                "three"
            ],
            "events": {},
            "eventItems": []
        },
        "inversedOr": {
            "type": "drakon",
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "4"
                },
                "3": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": true,
                                "raw": "true"
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "question",
                    "one": "3",
                    "two": "5",
                    "flag1": 0,
                    "content": {
                        "type": "BinaryExpression",
                        "operator": "===",
                        "left": {
                            "type": "Identifier",
                            "name": "one"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 1,
                            "raw": "1"
                        }
                    }
                },
                "5": {
                    "type": "question",
                    "one": "3",
                    "two": "6",
                    "flag1": 0,
                    "content": {
                        "type": "BinaryExpression",
                        "operator": "===",
                        "left": {
                            "type": "Identifier",
                            "name": "two"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 2,
                            "raw": "2"
                        }
                    }
                },
                "6": {
                    "type": "question",
                    "one": "3",
                    "two": "7",
                    "flag1": 0,
                    "content": {
                        "type": "BinaryExpression",
                        "operator": "===",
                        "left": {
                            "type": "Identifier",
                            "name": "three"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 3,
                            "raw": "3"
                        }
                    }
                },
                "7": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": false,
                                "raw": "false"
                            },
                            "itemId": "7"
                        }
                    ]
                }
            },
            "keywords": {
                "function": true,
                "machine": false,
                "async": false,
                "export": true,
                "algoprop": false,
                "lazy": false
            },
            "params": "one\ntwo\nthree",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/Question/inversedOr.drakon",
            "name": "inversedOr",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "inversedOr",
                "declarations": {
                    "one": true,
                    "two": true,
                    "three": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "one",
                "two",
                "three"
            ],
            "events": {},
            "eventItems": []
        },
        "questionMerge": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "3"
                },
                "3": {
                    "type": "action",
                    "one": "4",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "result"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 0,
                                    "raw": "0"
                                }
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "question",
                    "one": "8",
                    "two": "5",
                    "flag1": 1,
                    "content": {
                        "type": "Identifier",
                        "name": "left"
                    }
                },
                "5": {
                    "type": "action",
                    "one": "6",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "UpdateExpression",
                                "operator": "++",
                                "argument": {
                                    "type": "Identifier",
                                    "name": "result"
                                },
                                "prefix": false
                            },
                            "itemId": "5"
                        }
                    ]
                },
                "6": {
                    "type": "question",
                    "one": "8",
                    "two": "7",
                    "flag1": 1,
                    "content": {
                        "type": "Identifier",
                        "name": "right"
                    }
                },
                "7": {
                    "type": "action",
                    "one": "9",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "+=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "result"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 5,
                                    "raw": "5"
                                }
                            },
                            "itemId": "7"
                        }
                    ]
                },
                "8": {
                    "type": "action",
                    "one": "9",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "+=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "result"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 10,
                                    "raw": "10"
                                }
                            },
                            "itemId": "8"
                        }
                    ]
                },
                "9": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Identifier",
                                "name": "result"
                            },
                            "itemId": "9"
                        }
                    ]
                }
            },
            "type": "drakon",
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "left\nright",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/Question/questionMerge.drakon",
            "name": "questionMerge",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "questionMerge",
                "declarations": {
                    "left": true,
                    "right": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "left",
                "right"
            ],
            "events": {},
            "eventItems": []
        },
        "simpleAnd": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "4"
                },
                "3": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": true,
                                "raw": "true"
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "question",
                    "one": "5",
                    "two": "7",
                    "flag1": 1,
                    "content": {
                        "type": "Identifier",
                        "name": "valueA"
                    }
                },
                "5": {
                    "type": "question",
                    "one": "6",
                    "two": "7",
                    "flag1": 1,
                    "content": {
                        "type": "Identifier",
                        "name": "valueB"
                    }
                },
                "6": {
                    "type": "question",
                    "one": "3",
                    "two": "7",
                    "flag1": 1,
                    "content": {
                        "type": "Identifier",
                        "name": "valueC"
                    }
                },
                "7": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": false,
                                "raw": "false"
                            },
                            "itemId": "7"
                        }
                    ]
                }
            },
            "type": "drakon",
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "valueA\nvalueB\nvalueC",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/Question/simpleAnd.drakon",
            "name": "simpleAnd",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "simpleAnd",
                "declarations": {
                    "valueA": true,
                    "valueB": true,
                    "valueC": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "valueA",
                "valueB",
                "valueC"
            ],
            "events": {},
            "eventItems": []
        },
        "simpleOr": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "4"
                },
                "3": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": true,
                                "raw": "true"
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "question",
                    "one": "3",
                    "two": "8",
                    "flag1": 1,
                    "content": {
                        "type": "Identifier",
                        "name": "valueA"
                    }
                },
                "8": {
                    "type": "question",
                    "one": "3",
                    "two": "9",
                    "flag1": 1,
                    "content": {
                        "type": "Identifier",
                        "name": "valueB"
                    }
                },
                "9": {
                    "type": "question",
                    "one": "3",
                    "two": "10",
                    "flag1": 1,
                    "content": {
                        "type": "Identifier",
                        "name": "valueC"
                    }
                },
                "10": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": false,
                                "raw": "false"
                            },
                            "itemId": "10"
                        }
                    ]
                }
            },
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "valueA\nvalueB\nvalueC",
            "type": "drakon",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/Question/simpleOr.drakon",
            "name": "simpleOr",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "simpleOr",
                "declarations": {
                    "valueA": true,
                    "valueB": true,
                    "valueC": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "valueA",
                "valueB",
                "valueC"
            ],
            "events": {},
            "eventItems": []
        },
        "forEachUntil": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "5"
                },
                "4": {
                    "type": "loopend",
                    "one": "1",
                    "content": ""
                },
                "5": {
                    "type": "loopbegin",
                    "one": "6",
                    "content": {
                        "type": "ForOfStatement",
                        "left": {
                            "type": "Identifier",
                            "name": "element"
                        },
                        "right": {
                            "type": "Identifier",
                            "name": "array"
                        },
                        "body": {
                            "type": "BlockStatement",
                            "body": []
                        },
                        "itemId": "5"
                    },
                    "subtype": "array",
                    "variable": "element"
                },
                "6": {
                    "type": "action",
                    "one": "7",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "mustExit"
                                },
                                "right": {
                                    "type": "CallExpression",
                                    "callee": {
                                        "type": "Identifier",
                                        "name": "action"
                                    },
                                    "arguments": [
                                        {
                                            "type": "Identifier",
                                            "name": "element"
                                        }
                                    ]
                                }
                            },
                            "itemId": "6"
                        }
                    ]
                },
                "7": {
                    "type": "question",
                    "one": "4",
                    "two": "1",
                    "flag1": 0,
                    "content": {
                        "type": "Identifier",
                        "name": "mustExit"
                    }
                }
            },
            "type": "drakon",
            "keywords": {
                "export": false,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "array\naction",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/Scope/forEachUntil.drakon",
            "name": "forEachUntil",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "forEachUntil",
                "declarations": {
                    "array": true,
                    "action": true,
                    "element": true
                },
                "loop": {
                    "element": true
                },
                "children": {}
            },
            "argNames": [
                "array",
                "action"
            ],
            "events": {},
            "eventItems": []
        },
        "scope3": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "4"
                },
                "3": {
                    "type": "action",
                    "one": "5",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "CallExpression",
                                "callee": {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                        "type": "Identifier",
                                        "name": "array"
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "sort"
                                    }
                                },
                                "arguments": [
                                    {
                                        "type": "ArrowFunctionExpression",
                                        "id": null,
                                        "params": [
                                            {
                                                "type": "Identifier",
                                                "name": "a"
                                            },
                                            {
                                                "type": "Identifier",
                                                "name": "b"
                                            }
                                        ],
                                        "body": {
                                            "type": "BlockStatement",
                                            "body": [
                                                {
                                                    "type": "ExpressionStatement",
                                                    "expression": {
                                                        "type": "AssignmentExpression",
                                                        "operator": "=",
                                                        "left": {
                                                            "type": "Identifier",
                                                            "name": "left"
                                                        },
                                                        "right": {
                                                            "type": "MemberExpression",
                                                            "computed": true,
                                                            "object": {
                                                                "type": "Identifier",
                                                                "name": "a"
                                                            },
                                                            "property": {
                                                                "type": "Identifier",
                                                                "name": "sortProp"
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    "type": "ExpressionStatement",
                                                    "expression": {
                                                        "type": "AssignmentExpression",
                                                        "operator": "=",
                                                        "left": {
                                                            "type": "Identifier",
                                                            "name": "right"
                                                        },
                                                        "right": {
                                                            "type": "MemberExpression",
                                                            "computed": true,
                                                            "object": {
                                                                "type": "Identifier",
                                                                "name": "b"
                                                            },
                                                            "property": {
                                                                "type": "Identifier",
                                                                "name": "sortProp"
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    "type": "IfStatement",
                                                    "test": {
                                                        "type": "BinaryExpression",
                                                        "operator": "<",
                                                        "left": {
                                                            "type": "Identifier",
                                                            "name": "left"
                                                        },
                                                        "right": {
                                                            "type": "Identifier",
                                                            "name": "right"
                                                        }
                                                    },
                                                    "consequent": {
                                                        "type": "BlockStatement",
                                                        "body": [
                                                            {
                                                                "type": "ReturnStatement",
                                                                "argument": {
                                                                    "type": "UnaryExpression",
                                                                    "operator": "-",
                                                                    "argument": {
                                                                        "type": "Literal",
                                                                        "value": 1,
                                                                        "raw": "1"
                                                                    },
                                                                    "prefix": true
                                                                }
                                                            }
                                                        ]
                                                    },
                                                    "alternate": null
                                                },
                                                {
                                                    "type": "IfStatement",
                                                    "test": {
                                                        "type": "BinaryExpression",
                                                        "operator": ">",
                                                        "left": {
                                                            "type": "Identifier",
                                                            "name": "left"
                                                        },
                                                        "right": {
                                                            "type": "Identifier",
                                                            "name": "right"
                                                        }
                                                    },
                                                    "consequent": {
                                                        "type": "BlockStatement",
                                                        "body": [
                                                            {
                                                                "type": "ReturnStatement",
                                                                "argument": {
                                                                    "type": "Literal",
                                                                    "value": 1,
                                                                    "raw": "1"
                                                                }
                                                            }
                                                        ]
                                                    },
                                                    "alternate": null
                                                },
                                                {
                                                    "type": "ExpressionStatement",
                                                    "expression": {
                                                        "type": "AssignmentExpression",
                                                        "operator": "=",
                                                        "left": {
                                                            "type": "Identifier",
                                                            "name": "a"
                                                        },
                                                        "right": {
                                                            "type": "Literal",
                                                            "value": "what?",
                                                            "raw": "\"what?\""
                                                        }
                                                    }
                                                },
                                                {
                                                    "type": "ReturnStatement",
                                                    "argument": {
                                                        "type": "Literal",
                                                        "value": 0,
                                                        "raw": "0"
                                                    }
                                                }
                                            ]
                                        },
                                        "generator": false,
                                        "expression": false,
                                        "async": false
                                    }
                                ]
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "action",
                    "one": "3",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "result"
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "undefined"
                                }
                            },
                            "itemId": "4"
                        },
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "found"
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "undefined"
                                }
                            },
                            "itemId": "4"
                        }
                    ]
                },
                "5": {
                    "type": "action",
                    "one": "6",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "CallExpression",
                                "callee": {
                                    "type": "Identifier",
                                    "name": "forEachUntil"
                                },
                                "arguments": [
                                    {
                                        "type": "Identifier",
                                        "name": "array"
                                    },
                                    {
                                        "type": "FunctionExpression",
                                        "id": null,
                                        "params": [
                                            {
                                                "type": "Identifier",
                                                "name": "element"
                                            }
                                        ],
                                        "body": {
                                            "type": "BlockStatement",
                                            "body": [
                                                {
                                                    "type": "ExpressionStatement",
                                                    "expression": {
                                                        "type": "AssignmentExpression",
                                                        "operator": "=",
                                                        "left": {
                                                            "type": "Identifier",
                                                            "name": "e2"
                                                        },
                                                        "right": {
                                                            "type": "BinaryExpression",
                                                            "operator": "*",
                                                            "left": {
                                                                "type": "MemberExpression",
                                                                "computed": false,
                                                                "object": {
                                                                    "type": "Identifier",
                                                                    "name": "element"
                                                                },
                                                                "property": {
                                                                    "type": "Identifier",
                                                                    "name": "value"
                                                                }
                                                            },
                                                            "right": {
                                                                "type": "Literal",
                                                                "value": 2,
                                                                "raw": "2"
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    "type": "IfStatement",
                                                    "test": {
                                                        "type": "BinaryExpression",
                                                        "operator": ">",
                                                        "left": {
                                                            "type": "Identifier",
                                                            "name": "e2"
                                                        },
                                                        "right": {
                                                            "type": "Identifier",
                                                            "name": "cutoff"
                                                        }
                                                    },
                                                    "consequent": {
                                                        "type": "BlockStatement",
                                                        "body": [
                                                            {
                                                                "type": "ExpressionStatement",
                                                                "expression": {
                                                                    "type": "AssignmentExpression",
                                                                    "operator": "=",
                                                                    "left": {
                                                                        "type": "Identifier",
                                                                        "name": "result"
                                                                    },
                                                                    "right": {
                                                                        "type": "Identifier",
                                                                        "name": "e2"
                                                                    }
                                                                }
                                                            },
                                                            {
                                                                "type": "ExpressionStatement",
                                                                "expression": {
                                                                    "type": "AssignmentExpression",
                                                                    "operator": "=",
                                                                    "left": {
                                                                        "type": "Identifier",
                                                                        "name": "found"
                                                                    },
                                                                    "right": {
                                                                        "type": "Identifier",
                                                                        "name": "element"
                                                                    }
                                                                }
                                                            },
                                                            {
                                                                "type": "ReturnStatement",
                                                                "argument": {
                                                                    "type": "Literal",
                                                                    "value": true,
                                                                    "raw": "true"
                                                                }
                                                            }
                                                        ]
                                                    },
                                                    "alternate": null
                                                },
                                                {
                                                    "type": "ReturnStatement",
                                                    "argument": {
                                                        "type": "Literal",
                                                        "value": false,
                                                        "raw": "false"
                                                    }
                                                }
                                            ]
                                        },
                                        "generator": false,
                                        "expression": false,
                                        "async": false
                                    }
                                ]
                            },
                            "itemId": "5"
                        }
                    ]
                },
                "6": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "ObjectExpression",
                                "properties": [
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "result"
                                        },
                                        "computed": false,
                                        "value": {
                                            "type": "Identifier",
                                            "name": "result"
                                        },
                                        "kind": "init",
                                        "method": false,
                                        "shorthand": true
                                    },
                                    {
                                        "type": "Property",
                                        "key": {
                                            "type": "Identifier",
                                            "name": "found"
                                        },
                                        "computed": false,
                                        "value": {
                                            "type": "Identifier",
                                            "name": "found"
                                        },
                                        "kind": "init",
                                        "method": false,
                                        "shorthand": true
                                    }
                                ]
                            },
                            "itemId": "6"
                        }
                    ]
                }
            },
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "array\nsortProp\ncutoff",
            "type": "drakon",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/Scope/scope3.drakon",
            "name": "scope3",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "scope3",
                "declarations": {
                    "array": true,
                    "sortProp": true,
                    "cutoff": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "array",
                "sortProp",
                "cutoff"
            ],
            "events": {},
            "eventItems": []
        },
        "degenerateSelect": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "7"
                },
                "3": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": "ten",
                                "raw": "\"ten\""
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "case",
                    "one": "8"
                },
                "6": {
                    "type": "case",
                    "one": "3",
                    "two": "4",
                    "content": {
                        "type": "Literal",
                        "value": 10,
                        "raw": "10"
                    }
                },
                "7": {
                    "type": "select",
                    "one": "6",
                    "content": {
                        "type": "Identifier",
                        "name": "value"
                    }
                },
                "8": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": "other",
                                "raw": "\"other\""
                            },
                            "itemId": "8"
                        }
                    ]
                }
            },
            "type": "drakon",
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "value",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/Select/degenerateSelect.drakon",
            "name": "degenerateSelect",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "degenerateSelect",
                "declarations": {
                    "value": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "value"
            ],
            "events": {},
            "eventItems": []
        },
        "selectShortCircuit": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "_item__6"
                },
                "3": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": "good",
                                "raw": "\"good\""
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "case",
                    "one": "8",
                    "content": {
                        "type": "Literal",
                        "value": 30,
                        "raw": "30"
                    }
                },
                "6": {
                    "type": "case",
                    "one": "3",
                    "two": "9",
                    "content": {
                        "type": "Literal",
                        "value": 10,
                        "raw": "10"
                    }
                },
                "7": {
                    "type": "select",
                    "one": "6",
                    "content": {
                        "type": "Identifier",
                        "name": "_selectValue_5"
                    }
                },
                "8": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": "bad",
                                "raw": "\"bad\""
                            },
                            "itemId": "8"
                        }
                    ]
                },
                "9": {
                    "one": "3",
                    "type": "case",
                    "two": "4",
                    "content": {
                        "type": "Literal",
                        "value": 20,
                        "raw": "20"
                    }
                },
                "_item__6": {
                    "id": "_item__6",
                    "type": "action",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "_selectValue_5"
                                },
                                "right": {
                                    "type": "BinaryExpression",
                                    "operator": "+",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "value"
                                    },
                                    "right": {
                                        "type": "Literal",
                                        "value": 5,
                                        "raw": "5"
                                    }
                                }
                            }
                        }
                    ],
                    "one": "7"
                }
            },
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "value",
            "type": "drakon",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/Select/selectShortCircuit.drakon",
            "name": "selectShortCircuit",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "selectShortCircuit",
                "declarations": {
                    "value": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "value"
            ],
            "events": {},
            "eventItems": []
        },
        "selectWithDefault": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "7"
                },
                "3": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": "ten",
                                "raw": "\"ten\""
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "case",
                    "one": "8"
                },
                "6": {
                    "type": "case",
                    "one": "3",
                    "two": "9",
                    "content": {
                        "type": "Literal",
                        "value": 10,
                        "raw": "10"
                    }
                },
                "7": {
                    "type": "select",
                    "one": "6",
                    "content": {
                        "type": "Identifier",
                        "name": "value"
                    }
                },
                "8": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": "other",
                                "raw": "\"other\""
                            },
                            "itemId": "8"
                        }
                    ]
                },
                "9": {
                    "one": "10",
                    "type": "case",
                    "two": "4",
                    "content": {
                        "type": "Literal",
                        "value": 20,
                        "raw": "20"
                    }
                },
                "10": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": "twenty",
                                "raw": "\"twenty\""
                            },
                            "itemId": "10"
                        }
                    ]
                }
            },
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "value",
            "type": "drakon",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/Select/selectWithDefault.drakon",
            "name": "selectWithDefault",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "selectWithDefault",
                "declarations": {
                    "value": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "value"
            ],
            "events": {},
            "eventItems": []
        },
        "selectWithoutDefault": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "_item__8"
                },
                "3": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": "ten",
                                "raw": "\"ten\""
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "case",
                    "one": "8",
                    "content": {
                        "type": "Literal",
                        "value": 30,
                        "raw": "30"
                    }
                },
                "6": {
                    "type": "case",
                    "one": "3",
                    "two": "9",
                    "content": {
                        "type": "Literal",
                        "value": 10,
                        "raw": "10"
                    }
                },
                "7": {
                    "type": "select",
                    "one": "6",
                    "content": {
                        "type": "Identifier",
                        "name": "_selectValue_7"
                    }
                },
                "8": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": "thirty",
                                "raw": "\"thirty\""
                            },
                            "itemId": "8"
                        }
                    ]
                },
                "9": {
                    "one": "10",
                    "type": "case",
                    "two": "4",
                    "content": {
                        "type": "Literal",
                        "value": 20,
                        "raw": "20"
                    }
                },
                "10": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": "twenty",
                                "raw": "\"twenty\""
                            },
                            "itemId": "10"
                        }
                    ]
                },
                "_item__8": {
                    "id": "_item__8",
                    "type": "action",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "_selectValue_7"
                                },
                                "right": {
                                    "type": "BinaryExpression",
                                    "operator": "+",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "value"
                                    },
                                    "right": {
                                        "type": "Literal",
                                        "value": 5,
                                        "raw": "5"
                                    }
                                }
                            }
                        }
                    ],
                    "one": "7"
                }
            },
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "value",
            "type": "drakon",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/Select/selectWithoutDefault.drakon",
            "name": "selectWithoutDefault",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "selectWithoutDefault",
                "declarations": {
                    "value": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "value"
            ],
            "events": {},
            "eventItems": []
        },
        "complexSilhouette": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 1,
                    "one": "8",
                    "content": "First"
                },
                "3": {
                    "type": "action",
                    "one": "5",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "+=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "result"
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "right"
                                }
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "branch",
                    "one": "9",
                    "branchId": 4,
                    "content": "Exit"
                },
                "5": {
                    "type": "branch",
                    "one": "10",
                    "branchId": 2,
                    "content": "Second"
                },
                "6": {
                    "type": "question",
                    "one": "3",
                    "two": "7",
                    "flag1": 1,
                    "content": {
                        "type": "BinaryExpression",
                        "operator": "===",
                        "left": {
                            "type": "Identifier",
                            "name": "left"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 3,
                            "raw": "3"
                        }
                    }
                },
                "7": {
                    "type": "branch",
                    "branchId": 3,
                    "one": "11",
                    "content": "Third"
                },
                "8": {
                    "type": "action",
                    "one": "6",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "result"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 0,
                                    "raw": "0"
                                }
                            },
                            "itemId": "8"
                        }
                    ]
                },
                "9": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Identifier",
                                "name": "result"
                            },
                            "itemId": "9"
                        }
                    ]
                },
                "10": {
                    "type": "action",
                    "one": "7",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "+=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "result"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 2,
                                    "raw": "2"
                                }
                            },
                            "itemId": "10"
                        }
                    ]
                },
                "11": {
                    "type": "action",
                    "one": "4",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "+=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "result"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 10,
                                    "raw": "10"
                                }
                            },
                            "itemId": "11"
                        }
                    ]
                }
            },
            "type": "drakon",
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "left  \n\n right",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/Silhouette/complexSilhouette.drakon",
            "name": "complexSilhouette",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "complexSilhouette",
                "declarations": {
                    "left": true,
                    "right": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "left",
                "right"
            ],
            "events": {},
            "eventItems": []
        },
        "fibonacci": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 1,
                    "one": "9",
                    "content": "Simple case"
                },
                "3": {
                    "type": "action",
                    "one": "4",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "result"
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "ordinal"
                                }
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "branch",
                    "one": "10",
                    "branchId": 3,
                    "content": "Exit"
                },
                "5": {
                    "type": "branch",
                    "one": "13",
                    "branchId": 2,
                    "content": "Normal case"
                },
                "6": {
                    "type": "case",
                    "one": "5"
                },
                "7": {
                    "type": "case",
                    "one": "3",
                    "two": "6",
                    "content": {
                        "type": "Literal",
                        "value": 1,
                        "raw": "1"
                    }
                },
                "8": {
                    "type": "case",
                    "one": "3",
                    "two": "7",
                    "content": {
                        "type": "Literal",
                        "value": 0,
                        "raw": "0"
                    }
                },
                "9": {
                    "type": "select",
                    "one": "8",
                    "content": {
                        "type": "Identifier",
                        "name": "ordinal"
                    }
                },
                "10": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Identifier",
                                "name": "result"
                            },
                            "itemId": "10"
                        }
                    ]
                },
                "11": {
                    "type": "loopend",
                    "one": "4",
                    "content": ""
                },
                "12": {
                    "type": "loopbegin",
                    "one": "14",
                    "content": {
                        "type": "ForStatement",
                        "init": {
                            "type": "AssignmentExpression",
                            "operator": "=",
                            "left": {
                                "type": "Identifier",
                                "name": "i"
                            },
                            "right": {
                                "type": "Literal",
                                "value": 2,
                                "raw": "2"
                            }
                        },
                        "test": {
                            "type": "BinaryExpression",
                            "operator": "<=",
                            "left": {
                                "type": "Identifier",
                                "name": "i"
                            },
                            "right": {
                                "type": "Identifier",
                                "name": "ordinal"
                            }
                        },
                        "update": {
                            "type": "UpdateExpression",
                            "operator": "++",
                            "argument": {
                                "type": "Identifier",
                                "name": "i"
                            },
                            "prefix": false
                        },
                        "body": {
                            "type": "BlockStatement",
                            "body": []
                        },
                        "itemId": "12"
                    }
                },
                "13": {
                    "type": "action",
                    "one": "12",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "i_2"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 0,
                                    "raw": "0"
                                }
                            },
                            "itemId": "13"
                        },
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "i_1"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 1,
                                    "raw": "1"
                                }
                            },
                            "itemId": "13"
                        }
                    ]
                },
                "14": {
                    "type": "action",
                    "one": "16",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "result"
                                },
                                "right": {
                                    "type": "BinaryExpression",
                                    "operator": "+",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "i_2"
                                    },
                                    "right": {
                                        "type": "Identifier",
                                        "name": "i_1"
                                    }
                                }
                            },
                            "itemId": "14"
                        }
                    ]
                },
                "16": {
                    "type": "action",
                    "one": "11",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "i_2"
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "i_1"
                                }
                            },
                            "itemId": "16"
                        },
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "i_1"
                                },
                                "right": {
                                    "type": "Identifier",
                                    "name": "result"
                                }
                            },
                            "itemId": "16"
                        }
                    ]
                }
            },
            "type": "drakon",
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "ordinal",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/Silhouette/fibonacci.drakon",
            "name": "fibonacci",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "fibonacci",
                "declarations": {
                    "ordinal": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "ordinal"
            ],
            "events": {},
            "eventItems": []
        },
        "sil2": {
            "type": "drakon",
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 1,
                    "one": "4",
                    "content": "Ветка1"
                },
                "3": {
                    "type": "action",
                    "one": "6",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "foo"
                                },
                                "right": {
                                    "type": "BinaryExpression",
                                    "operator": "*",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "value"
                                    },
                                    "right": {
                                        "type": "Literal",
                                        "value": 10,
                                        "raw": "10"
                                    }
                                }
                            },
                            "itemId": "3"
                        }
                    ]
                },
                "4": {
                    "type": "question",
                    "one": "9",
                    "two": "7",
                    "flag1": 1,
                    "content": {
                        "type": "BinaryExpression",
                        "operator": ">=",
                        "left": {
                            "type": "Identifier",
                            "name": "value"
                        },
                        "right": {
                            "type": "Literal",
                            "value": 0,
                            "raw": "0"
                        }
                    }
                },
                "5": {
                    "type": "branch",
                    "one": "12",
                    "branchId": 3,
                    "content": "Exit"
                },
                "6": {
                    "type": "branch",
                    "one": "11",
                    "branchId": 2,
                    "content": "Ветка2"
                },
                "7": {
                    "type": "action",
                    "one": "6",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "foo"
                                },
                                "right": {
                                    "type": "BinaryExpression",
                                    "operator": "*",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "value"
                                    },
                                    "right": {
                                        "type": "Literal",
                                        "value": 10,
                                        "raw": "10"
                                    }
                                }
                            },
                            "itemId": "7"
                        }
                    ]
                },
                "9": {
                    "type": "question",
                    "one": "3",
                    "two": "10",
                    "flag1": 1,
                    "content": {
                        "type": "BinaryExpression",
                        "operator": "===",
                        "left": {
                            "type": "BinaryExpression",
                            "operator": "%",
                            "left": {
                                "type": "Identifier",
                                "name": "value"
                            },
                            "right": {
                                "type": "Literal",
                                "value": 10,
                                "raw": "10"
                            }
                        },
                        "right": {
                            "type": "Literal",
                            "value": 0,
                            "raw": "0"
                        }
                    }
                },
                "10": {
                    "type": "action",
                    "one": "6",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "foo"
                                },
                                "right": {
                                    "type": "BinaryExpression",
                                    "operator": "*",
                                    "left": {
                                        "type": "Identifier",
                                        "name": "value"
                                    },
                                    "right": {
                                        "type": "Literal",
                                        "value": 10,
                                        "raw": "10"
                                    }
                                }
                            },
                            "itemId": "10"
                        }
                    ]
                },
                "11": {
                    "type": "action",
                    "one": "5",
                    "content": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "+=",
                                "left": {
                                    "type": "Identifier",
                                    "name": "foo"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 5,
                                    "raw": "5"
                                }
                            },
                            "itemId": "11"
                        }
                    ]
                },
                "12": {
                    "type": "action",
                    "one": "1",
                    "content": [
                        {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Identifier",
                                "name": "foo"
                            },
                            "itemId": "12"
                        }
                    ]
                }
            },
            "keywords": {
                "function": true,
                "machine": false,
                "async": false,
                "export": true,
                "algoprop": false,
                "lazy": false
            },
            "params": "value",
            "path": "/Users/stipan/Documents/prosjekter/drakontechgen/examples2604/green/Silhouette/sil2.drakon",
            "name": "sil2",
            "children": {},
            "scope": {
                "_type": "scope",
                "type": "function",
                "name": "sil2",
                "declarations": {
                    "value": true
                },
                "loop": {},
                "children": {}
            },
            "argNames": [
                "value"
            ],
            "events": {},
            "eventItems": []
        }
    },
    "scope": {
        "_type": "scope",
        "type": "module",
        "name": "module",
        "declarations": {},
        "loop": {},
        "children": {}
    },
    "argNames": [],
    "events": {},
    "eventItems": []
}