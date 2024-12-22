{
    "type": "module",
    "args": {},
    "declared": {},
    "auto": {},
    "all": {
        "doWhile": "function",
        "doWhileDo": "function",
        "selectArrow": "function",
        "twoExits": "function",
        "whileDo": "function",
        "empty": "function",
        "earlyExit": "function",
        "foreachLoopArray": "function",
        "foreachLoopObject": "function",
        "forLoopDeclare": "function",
        "forLoopNoDeclare": "function",
        "generateId": "function",
        "getSecret": "function",
        "hello": "function",
        "add": "function",
        "addCore": "function",
        "mul": "function",
        "complexAnd": "function",
        "complexOr": "function",
        "fizzBuzz": "function",
        "questionMerge": "function",
        "simpleAnd": "function",
        "simpleOr": "function",
        "forEachUntil": "function",
        "scope3": "function",
        "degenerateSelect": "function",
        "selectShortCircuit": "function",
        "selectWithDefault": "function",
        "selectWithoutDefault": "function",
        "complexSilhouette": "function",
        "fibonacci": "function"
    },
    "loop": {},
    "algoprops": {},
    "functions": {
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
                    "content": "result = 0"
                },
                "4": {
                    "type": "question",
                    "one": "5",
                    "two": "7",
                    "flag1": 1,
                    "content": "result > 20"
                },
                "5": {
                    "type": "action",
                    "one": "1",
                    "content": "return result"
                },
                "6": {
                    "type": "action",
                    "one": "4",
                    "content": "result += 3"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\ArrowLoop\\doWhile.drakon",
            "name": "doWhile",
            "scope": {
                "name": "doWhile",
                "type": "function",
                "args": {},
                "declared": {},
                "auto": {},
                "all": {},
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
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
                    "content": "result = 0"
                },
                "4": {
                    "type": "question",
                    "one": "5",
                    "two": "8",
                    "flag1": 1,
                    "content": "result > 20"
                },
                "5": {
                    "type": "action",
                    "one": "1",
                    "content": "return result"
                },
                "7": {
                    "type": "arrow-loop",
                    "one": "9"
                },
                "8": {
                    "type": "action",
                    "one": "7",
                    "content": "result += 3"
                },
                "9": {
                    "type": "action",
                    "one": "4",
                    "content": "result += 7"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\ArrowLoop\\doWhileDo.drakon",
            "name": "doWhileDo",
            "scope": {
                "name": "doWhileDo",
                "type": "function",
                "args": {},
                "declared": {},
                "auto": {},
                "all": {},
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
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
                    "content": "result = 0"
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
                    "content": "10"
                },
                "7": {
                    "type": "select",
                    "one": "6",
                    "content": "result"
                },
                "8": {
                    "type": "action",
                    "one": "9",
                    "content": "result++"
                },
                "9": {
                    "type": "arrow-loop",
                    "one": "7"
                },
                "10": {
                    "type": "action",
                    "one": "1",
                    "content": "return result"
                },
                "11": {
                    "one": "12",
                    "type": "case",
                    "two": "5",
                    "content": "5"
                },
                "12": {
                    "type": "action",
                    "one": "9",
                    "content": "result += 2"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\ArrowLoop\\selectArrow.drakon",
            "name": "selectArrow",
            "scope": {
                "name": "selectArrow",
                "type": "function",
                "args": {},
                "declared": {},
                "auto": {},
                "all": {},
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
        },
        "twoExits": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "12"
                },
                "3": {
                    "type": "action",
                    "one": "4",
                    "content": "let i = 0"
                },
                "4": {
                    "type": "question",
                    "one": "10",
                    "two": "7",
                    "flag1": 0,
                    "content": "i < array.length"
                },
                "7": {
                    "type": "action",
                    "one": "8",
                    "content": "item = array[i]"
                },
                "8": {
                    "type": "question",
                    "one": "9",
                    "two": "11",
                    "flag1": 1,
                    "content": "item === value"
                },
                "9": {
                    "type": "action",
                    "one": "13",
                    "content": "index = i"
                },
                "10": {
                    "type": "action",
                    "one": "13",
                    "content": "index = -1"
                },
                "11": {
                    "type": "action",
                    "one": "12",
                    "content": "i++"
                },
                "12": {
                    "type": "arrow-loop",
                    "one": "3"
                },
                "13": {
                    "type": "action",
                    "one": "1",
                    "content": "return index"
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
            "params": "array\nvalue",
            "path": "C:\\code\\drakontechgen\\examples\\green\\ArrowLoop\\twoExits.drakon",
            "name": "twoExits",
            "scope": {
                "name": "twoExits",
                "type": "function",
                "args": {},
                "declared": {
                    "array": {
                        "name": "array",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\ArrowLoop\\twoExits.drakon",
                        "fun": "twoExits",
                        "type": "argument"
                    },
                    "value": {
                        "name": "value",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\ArrowLoop\\twoExits.drakon",
                        "fun": "twoExits",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "array": "declared",
                    "value": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
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
                    "content": "result = 0"
                },
                "4": {
                    "type": "question",
                    "one": "5",
                    "two": "8",
                    "flag1": 1,
                    "content": "result > 20"
                },
                "5": {
                    "type": "action",
                    "one": "1",
                    "content": "return result"
                },
                "7": {
                    "type": "arrow-loop",
                    "one": "4"
                },
                "8": {
                    "type": "action",
                    "one": "7",
                    "content": "result += 3"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\ArrowLoop\\whileDo.drakon",
            "name": "whileDo",
            "scope": {
                "name": "whileDo",
                "type": "function",
                "args": {},
                "declared": {},
                "auto": {},
                "all": {},
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
        },
        "empty": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "1"
                }
            },
            "keywords": {
                "export": true,
                "function": true,
                "scenario": false,
                "async": false,
                "algoprop": false
            },
            "params": "",
            "type": "drakon",
            "path": "C:\\code\\drakontechgen\\examples\\green\\empty.drakon",
            "name": "empty",
            "scope": {
                "name": "empty",
                "type": "function",
                "args": {},
                "declared": {},
                "auto": {},
                "all": {},
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
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
                    "one": "1",
                    "content": "array.splice(index, 1)"
                },
                "4": {
                    "type": "loopend",
                    "one": "9",
                    "content": ""
                },
                "5": {
                    "type": "loopbegin",
                    "one": "6",
                    "content": "i = 0; i < array.length; i++"
                },
                "6": {
                    "type": "question",
                    "one": "4",
                    "two": "8",
                    "flag1": 0,
                    "content": "item[i] === value"
                },
                "7": {
                    "type": "action",
                    "one": "5",
                    "content": "index = -1"
                },
                "8": {
                    "type": "action",
                    "one": "9",
                    "content": "index = i"
                },
                "9": {
                    "type": "question",
                    "one": "3",
                    "two": "1",
                    "flag1": 0,
                    "content": "index === -1"
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
            "params": "array\nvalue",
            "path": "C:\\code\\drakontechgen\\examples\\green\\ForLoop\\earlyExit.drakon",
            "name": "earlyExit",
            "scope": {
                "name": "earlyExit",
                "type": "function",
                "args": {},
                "declared": {
                    "array": {
                        "name": "array",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\ForLoop\\earlyExit.drakon",
                        "fun": "earlyExit",
                        "type": "argument"
                    },
                    "value": {
                        "name": "value",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\ForLoop\\earlyExit.drakon",
                        "fun": "earlyExit",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "array": "declared",
                    "value": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
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
                    "content": "return copy"
                },
                "4": {
                    "type": "loopend",
                    "one": "3",
                    "content": ""
                },
                "5": {
                    "type": "loopbegin",
                    "one": "8",
                    "content": "item; array"
                },
                "6": {
                    "type": "action",
                    "one": "4",
                    "content": "copy.push(value2)"
                },
                "7": {
                    "type": "action",
                    "one": "5",
                    "content": "copy = []"
                },
                "8": {
                    "type": "action",
                    "one": "6",
                    "content": "value2 = item + value"
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
            "params": "array\nvalue",
            "path": "C:\\code\\drakontechgen\\examples\\green\\ForLoop\\foreachLoopArray.drakon",
            "name": "foreachLoopArray",
            "scope": {
                "name": "foreachLoopArray",
                "type": "function",
                "args": {},
                "declared": {
                    "array": {
                        "name": "array",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\ForLoop\\foreachLoopArray.drakon",
                        "fun": "foreachLoopArray",
                        "type": "argument"
                    },
                    "value": {
                        "name": "value",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\ForLoop\\foreachLoopArray.drakon",
                        "fun": "foreachLoopArray",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "array": "declared",
                    "value": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
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
                    "content": "return copy"
                },
                "4": {
                    "type": "loopend",
                    "one": "3",
                    "content": ""
                },
                "5": {
                    "type": "loopbegin",
                    "one": "8",
                    "content": "key, item; object"
                },
                "6": {
                    "type": "action",
                    "one": "4",
                    "content": "copy[key] = value2"
                },
                "7": {
                    "type": "action",
                    "one": "5",
                    "content": "copy = {}"
                },
                "8": {
                    "type": "action",
                    "one": "6",
                    "content": "value2 = item + value"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\ForLoop\\foreachLoopObject.drakon",
            "name": "foreachLoopObject",
            "scope": {
                "name": "foreachLoopObject",
                "type": "function",
                "args": {},
                "declared": {
                    "object": {
                        "name": "object",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\ForLoop\\foreachLoopObject.drakon",
                        "fun": "foreachLoopObject",
                        "type": "argument"
                    },
                    "value": {
                        "name": "value",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\ForLoop\\foreachLoopObject.drakon",
                        "fun": "foreachLoopObject",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "object": "declared",
                    "value": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
        },
        "forLoopDeclare": {
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
                    "content": "return copy"
                },
                "4": {
                    "type": "loopend",
                    "one": "3",
                    "content": ""
                },
                "5": {
                    "type": "loopbegin",
                    "one": "8",
                    "content": "var i = 0; i < array.length; i += 2"
                },
                "6": {
                    "type": "action",
                    "one": "4",
                    "content": "copy[key] = value"
                },
                "7": {
                    "type": "action",
                    "one": "5",
                    "content": "copy = {}"
                },
                "8": {
                    "type": "action",
                    "one": "6",
                    "content": "key = array[i]\nvalue = array[i + 1]"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\ForLoop\\forLoopDeclare.drakon",
            "name": "forLoopDeclare",
            "scope": {
                "name": "forLoopDeclare",
                "type": "function",
                "args": {},
                "declared": {
                    "array": {
                        "name": "array",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\ForLoop\\forLoopDeclare.drakon",
                        "fun": "forLoopDeclare",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "array": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
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
                    "content": "return copy"
                },
                "4": {
                    "type": "loopend",
                    "one": "3",
                    "content": ""
                },
                "5": {
                    "type": "loopbegin",
                    "one": "8",
                    "content": "i = 0; i < array.length; i += 2"
                },
                "6": {
                    "type": "action",
                    "one": "4",
                    "content": "copy[key] = value"
                },
                "7": {
                    "type": "action",
                    "one": "5",
                    "content": "copy = {}"
                },
                "8": {
                    "type": "action",
                    "one": "6",
                    "content": "key = array[i]\nvalue = array[i + 1]"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\ForLoop\\forLoopNoDeclare.drakon",
            "name": "forLoopNoDeclare",
            "scope": {
                "name": "forLoopNoDeclare",
                "type": "function",
                "args": {},
                "declared": {
                    "array": {
                        "name": "array",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\ForLoop\\forLoopNoDeclare.drakon",
                        "fun": "forLoopNoDeclare",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "array": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
        },
        "generateId": {
            "items": {
                "1": {
                    "type": "end"
                },
                "2": {
                    "type": "branch",
                    "branchId": 0,
                    "one": "5"
                },
                "3": {
                    "type": "action",
                    "one": "1",
                    "content": "return id"
                },
                "4": {
                    "type": "action",
                    "one": "3",
                    "content": "nextId = nextId + 1"
                },
                "5": {
                    "type": "action",
                    "one": "4",
                    "content": "id = nextId"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\generateId.drakon",
            "name": "generateId",
            "scope": {
                "name": "generateId",
                "type": "function",
                "args": {},
                "declared": {},
                "auto": {},
                "all": {},
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
        },
        "getSecret": {
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
                    "content": "return secretValue"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\getSecret.drakon",
            "name": "getSecret",
            "scope": {
                "name": "getSecret",
                "type": "function",
                "args": {},
                "declared": {},
                "auto": {},
                "all": {},
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
        },
        "hello": {
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
                    "content": "console.log(\"Hello, world\")"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\hello.drakon",
            "name": "hello",
            "scope": {
                "name": "hello",
                "type": "function",
                "args": {},
                "declared": {},
                "auto": {},
                "all": {},
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
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
                    "content": "result = addCore(left, right)"
                },
                "4": {
                    "type": "action",
                    "one": "1",
                    "content": "return result"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\Math\\add.drakon",
            "name": "add",
            "scope": {
                "name": "add",
                "type": "function",
                "args": {},
                "declared": {
                    "left": {
                        "name": "left",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Math\\add.drakon",
                        "fun": "add",
                        "type": "argument"
                    },
                    "right": {
                        "name": "right",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Math\\add.drakon",
                        "fun": "add",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "left": "declared",
                    "right": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
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
                    "content": "return left + right"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\Math\\addCore.drakon",
            "name": "addCore",
            "scope": {
                "name": "addCore",
                "type": "function",
                "args": {},
                "declared": {
                    "left": {
                        "name": "left",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Math\\addCore.drakon",
                        "fun": "addCore",
                        "type": "argument"
                    },
                    "right": {
                        "name": "right",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Math\\addCore.drakon",
                        "fun": "addCore",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "left": "declared",
                    "right": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
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
                    "content": "return multiply(left, right)"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\Math\\mul.drakon",
            "name": "mul",
            "scope": {
                "name": "mul",
                "type": "function",
                "args": {},
                "declared": {
                    "left": {
                        "name": "left",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Math\\mul.drakon",
                        "fun": "mul",
                        "type": "argument"
                    },
                    "right": {
                        "name": "right",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Math\\mul.drakon",
                        "fun": "mul",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "left": "declared",
                    "right": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
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
                    "content": "return true"
                },
                "4": {
                    "type": "question",
                    "one": "5",
                    "two": "8",
                    "flag1": 0,
                    "content": "valueA"
                },
                "5": {
                    "type": "question",
                    "one": "3",
                    "two": "8",
                    "flag1": 1,
                    "content": "valueB"
                },
                "8": {
                    "type": "question",
                    "one": "3",
                    "two": "9",
                    "flag1": 1,
                    "content": "valueC"
                },
                "9": {
                    "type": "action",
                    "one": "1",
                    "content": "return false"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\Question\\complexAnd.drakon",
            "name": "complexAnd",
            "scope": {
                "name": "complexAnd",
                "type": "function",
                "args": {},
                "declared": {
                    "valueA": {
                        "name": "valueA",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Question\\complexAnd.drakon",
                        "fun": "complexAnd",
                        "type": "argument"
                    },
                    "valueB": {
                        "name": "valueB",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Question\\complexAnd.drakon",
                        "fun": "complexAnd",
                        "type": "argument"
                    },
                    "valueC": {
                        "name": "valueC",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Question\\complexAnd.drakon",
                        "fun": "complexAnd",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "valueA": "declared",
                    "valueB": "declared",
                    "valueC": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
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
                    "content": "return true"
                },
                "4": {
                    "type": "question",
                    "one": "3",
                    "two": "8",
                    "flag1": 1,
                    "content": "valueA"
                },
                "8": {
                    "type": "question",
                    "one": "11",
                    "two": "12",
                    "flag1": 0,
                    "content": "valueB"
                },
                "11": {
                    "type": "question",
                    "one": "3",
                    "two": "12",
                    "flag1": 1,
                    "content": "valueC"
                },
                "12": {
                    "type": "action",
                    "one": "1",
                    "content": "return false"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\Question\\complexOr.drakon",
            "name": "complexOr",
            "scope": {
                "name": "complexOr",
                "type": "function",
                "args": {},
                "declared": {
                    "valueA": {
                        "name": "valueA",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Question\\complexOr.drakon",
                        "fun": "complexOr",
                        "type": "argument"
                    },
                    "valueB": {
                        "name": "valueB",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Question\\complexOr.drakon",
                        "fun": "complexOr",
                        "type": "argument"
                    },
                    "valueC": {
                        "name": "valueC",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Question\\complexOr.drakon",
                        "fun": "complexOr",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "valueA": "declared",
                    "valueB": "declared",
                    "valueC": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
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
                    "content": "return 'FizzBuzz'"
                },
                "4": {
                    "type": "question",
                    "one": "5",
                    "two": "7",
                    "flag1": 1,
                    "content": "number % 3"
                },
                "5": {
                    "type": "question",
                    "one": "3",
                    "two": "6",
                    "flag1": 1,
                    "content": "number % 5"
                },
                "6": {
                    "type": "action",
                    "one": "1",
                    "content": "return 'Fizz'"
                },
                "7": {
                    "type": "question",
                    "one": "8",
                    "two": "9",
                    "flag1": 1,
                    "content": "number % 5"
                },
                "8": {
                    "type": "action",
                    "one": "1",
                    "content": "return 'Buzz'"
                },
                "9": {
                    "type": "action",
                    "one": "1",
                    "content": "return undefined"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\Question\\fizzBuzz.drakon",
            "name": "fizzBuzz",
            "scope": {
                "name": "fizzBuzz",
                "type": "function",
                "args": {},
                "declared": {
                    "number": {
                        "name": "number",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Question\\fizzBuzz.drakon",
                        "fun": "fizzBuzz",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "number": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
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
                    "content": "result = 0"
                },
                "4": {
                    "type": "question",
                    "one": "8",
                    "two": "5",
                    "flag1": 1,
                    "content": "left"
                },
                "5": {
                    "type": "action",
                    "one": "6",
                    "content": "result++"
                },
                "6": {
                    "type": "question",
                    "one": "8",
                    "two": "7",
                    "flag1": 1,
                    "content": "right"
                },
                "7": {
                    "type": "action",
                    "one": "9",
                    "content": "result += 5"
                },
                "8": {
                    "type": "action",
                    "one": "9",
                    "content": "result += 10"
                },
                "9": {
                    "type": "action",
                    "one": "1",
                    "content": "return result"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\Question\\questionMerge.drakon",
            "name": "questionMerge",
            "scope": {
                "name": "questionMerge",
                "type": "function",
                "args": {},
                "declared": {
                    "left": {
                        "name": "left",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Question\\questionMerge.drakon",
                        "fun": "questionMerge",
                        "type": "argument"
                    },
                    "right": {
                        "name": "right",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Question\\questionMerge.drakon",
                        "fun": "questionMerge",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "left": "declared",
                    "right": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
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
                    "content": "return true"
                },
                "4": {
                    "type": "question",
                    "one": "5",
                    "two": "7",
                    "flag1": 1,
                    "content": "valueA"
                },
                "5": {
                    "type": "question",
                    "one": "6",
                    "two": "7",
                    "flag1": 1,
                    "content": "valueB"
                },
                "6": {
                    "type": "question",
                    "one": "3",
                    "two": "7",
                    "flag1": 1,
                    "content": "valueC"
                },
                "7": {
                    "type": "action",
                    "one": "1",
                    "content": "return false"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\Question\\simpleAnd.drakon",
            "name": "simpleAnd",
            "scope": {
                "name": "simpleAnd",
                "type": "function",
                "args": {},
                "declared": {
                    "valueA": {
                        "name": "valueA",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Question\\simpleAnd.drakon",
                        "fun": "simpleAnd",
                        "type": "argument"
                    },
                    "valueB": {
                        "name": "valueB",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Question\\simpleAnd.drakon",
                        "fun": "simpleAnd",
                        "type": "argument"
                    },
                    "valueC": {
                        "name": "valueC",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Question\\simpleAnd.drakon",
                        "fun": "simpleAnd",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "valueA": "declared",
                    "valueB": "declared",
                    "valueC": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
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
                    "content": "return true"
                },
                "4": {
                    "type": "question",
                    "one": "3",
                    "two": "8",
                    "flag1": 1,
                    "content": "valueA"
                },
                "8": {
                    "type": "question",
                    "one": "3",
                    "two": "9",
                    "flag1": 1,
                    "content": "valueB"
                },
                "9": {
                    "type": "question",
                    "one": "3",
                    "two": "10",
                    "flag1": 1,
                    "content": "valueC"
                },
                "10": {
                    "type": "action",
                    "one": "1",
                    "content": "return false"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\Question\\simpleOr.drakon",
            "name": "simpleOr",
            "scope": {
                "name": "simpleOr",
                "type": "function",
                "args": {},
                "declared": {
                    "valueA": {
                        "name": "valueA",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Question\\simpleOr.drakon",
                        "fun": "simpleOr",
                        "type": "argument"
                    },
                    "valueB": {
                        "name": "valueB",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Question\\simpleOr.drakon",
                        "fun": "simpleOr",
                        "type": "argument"
                    },
                    "valueC": {
                        "name": "valueC",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Question\\simpleOr.drakon",
                        "fun": "simpleOr",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "valueA": "declared",
                    "valueB": "declared",
                    "valueC": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
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
                    "content": "element; array"
                },
                "6": {
                    "type": "action",
                    "one": "7",
                    "content": "mustExit = action(element)"
                },
                "7": {
                    "type": "question",
                    "one": "4",
                    "two": "1",
                    "flag1": 0,
                    "content": "mustExit"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\Scope\\forEachUntil.drakon",
            "name": "forEachUntil",
            "scope": {
                "name": "forEachUntil",
                "type": "function",
                "args": {},
                "declared": {
                    "array": {
                        "name": "array",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Scope\\forEachUntil.drakon",
                        "fun": "forEachUntil",
                        "type": "argument"
                    },
                    "action": {
                        "name": "action",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Scope\\forEachUntil.drakon",
                        "fun": "forEachUntil",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "array": "declared",
                    "action": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
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
                    "content": "array.sort(\n    (a, b) => {\n        left = a[sortProp]\n        right = b[sortProp]\n        if (left < right) {\n            return -1\n        }\n        if (left > right) {\n            return 1\n        }\n        return 0\n    }\n)"
                },
                "4": {
                    "type": "action",
                    "one": "3",
                    "content": "result = undefined\nvar found = undefined"
                },
                "5": {
                    "type": "action",
                    "one": "6",
                    "content": "forEachUntil(\n    array,\n    function (element) {\n        e2 = element * 2\n        if (e2 > cutoff) {\n            result = e2\n            found = element\n            return true\n        }\n        return false\n    }\n)"
                },
                "6": {
                    "type": "action",
                    "one": "1",
                    "content": "return {\n    result,\n    found\n}"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\Scope\\scope3.drakon",
            "name": "scope3",
            "scope": {
                "name": "scope3",
                "type": "function",
                "args": {},
                "declared": {
                    "array": {
                        "name": "array",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Scope\\scope3.drakon",
                        "fun": "scope3",
                        "type": "argument"
                    },
                    "sortProp": {
                        "name": "sortProp",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Scope\\scope3.drakon",
                        "fun": "scope3",
                        "type": "argument"
                    },
                    "cutoff": {
                        "name": "cutoff",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Scope\\scope3.drakon",
                        "fun": "scope3",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "array": "declared",
                    "sortProp": "declared",
                    "cutoff": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
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
                    "content": "return \"ten\""
                },
                "4": {
                    "type": "case",
                    "one": "8"
                },
                "6": {
                    "type": "case",
                    "one": "3",
                    "two": "4",
                    "content": "10"
                },
                "7": {
                    "type": "select",
                    "one": "6",
                    "content": "value"
                },
                "8": {
                    "type": "action",
                    "one": "1",
                    "content": "return \"other\""
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\Select\\degenerateSelect.drakon",
            "name": "degenerateSelect",
            "scope": {
                "name": "degenerateSelect",
                "type": "function",
                "args": {},
                "declared": {
                    "value": {
                        "name": "value",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Select\\degenerateSelect.drakon",
                        "fun": "degenerateSelect",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "value": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
        },
        "selectShortCircuit": {
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
                    "content": "return \"good\""
                },
                "4": {
                    "type": "case",
                    "one": "8",
                    "content": "30"
                },
                "6": {
                    "type": "case",
                    "one": "3",
                    "two": "9",
                    "content": "10"
                },
                "7": {
                    "type": "select",
                    "one": "6",
                    "content": "value + 5"
                },
                "8": {
                    "type": "action",
                    "one": "1",
                    "content": "return \"bad\""
                },
                "9": {
                    "one": "3",
                    "type": "case",
                    "two": "4",
                    "content": "20"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\Select\\selectShortCircuit.drakon",
            "name": "selectShortCircuit",
            "scope": {
                "name": "selectShortCircuit",
                "type": "function",
                "args": {},
                "declared": {
                    "value": {
                        "name": "value",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Select\\selectShortCircuit.drakon",
                        "fun": "selectShortCircuit",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "value": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
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
                    "content": "return \"ten\""
                },
                "4": {
                    "type": "case",
                    "one": "8"
                },
                "6": {
                    "type": "case",
                    "one": "3",
                    "two": "9",
                    "content": "10"
                },
                "7": {
                    "type": "select",
                    "one": "6",
                    "content": "value"
                },
                "8": {
                    "type": "action",
                    "one": "1",
                    "content": "return \"other\""
                },
                "9": {
                    "one": "10",
                    "type": "case",
                    "two": "4",
                    "content": "20"
                },
                "10": {
                    "type": "action",
                    "one": "1",
                    "content": "return \"twenty\""
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\Select\\selectWithDefault.drakon",
            "name": "selectWithDefault",
            "scope": {
                "name": "selectWithDefault",
                "type": "function",
                "args": {},
                "declared": {
                    "value": {
                        "name": "value",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Select\\selectWithDefault.drakon",
                        "fun": "selectWithDefault",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "value": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
        },
        "selectWithoutDefault": {
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
                    "content": "return \"ten\""
                },
                "4": {
                    "type": "case",
                    "one": "8",
                    "content": "30"
                },
                "6": {
                    "type": "case",
                    "one": "3",
                    "two": "9",
                    "content": "10"
                },
                "7": {
                    "type": "select",
                    "one": "6",
                    "content": "value + 5"
                },
                "8": {
                    "type": "action",
                    "one": "1",
                    "content": "return \"thirty\""
                },
                "9": {
                    "one": "10",
                    "type": "case",
                    "two": "4",
                    "content": "20"
                },
                "10": {
                    "type": "action",
                    "one": "1",
                    "content": "return \"twenty\""
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\Select\\selectWithoutDefault.drakon",
            "name": "selectWithoutDefault",
            "scope": {
                "name": "selectWithoutDefault",
                "type": "function",
                "args": {},
                "declared": {
                    "value": {
                        "name": "value",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Select\\selectWithoutDefault.drakon",
                        "fun": "selectWithoutDefault",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "value": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
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
                    "content": "result += right"
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
                    "content": "left === 3"
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
                    "content": "result = 0"
                },
                "9": {
                    "type": "action",
                    "one": "1",
                    "content": "return result"
                },
                "10": {
                    "type": "action",
                    "one": "7",
                    "content": "result += 2"
                },
                "11": {
                    "type": "action",
                    "one": "4",
                    "content": "result += 10"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\Silhouette\\complexSilhouette.drakon",
            "name": "complexSilhouette",
            "scope": {
                "name": "complexSilhouette",
                "type": "function",
                "args": {},
                "declared": {
                    "left": {
                        "name": "left",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Silhouette\\complexSilhouette.drakon",
                        "fun": "complexSilhouette",
                        "type": "argument"
                    },
                    "right": {
                        "name": "right",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Silhouette\\complexSilhouette.drakon",
                        "fun": "complexSilhouette",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "left": "declared",
                    "right": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
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
                    "content": "result = ordinal"
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
                    "content": "1"
                },
                "8": {
                    "type": "case",
                    "one": "3",
                    "two": "7",
                    "content": "0"
                },
                "9": {
                    "type": "select",
                    "one": "8",
                    "content": "ordinal"
                },
                "10": {
                    "type": "action",
                    "one": "1",
                    "content": "return result"
                },
                "11": {
                    "type": "loopend",
                    "one": "4",
                    "content": ""
                },
                "12": {
                    "type": "loopbegin",
                    "one": "14",
                    "content": "i = 2; i <= ordinal; i++"
                },
                "13": {
                    "type": "action",
                    "one": "12",
                    "content": "i_2 = 0\ni_1 = 1"
                },
                "14": {
                    "type": "action",
                    "one": "16",
                    "content": "result = i_2 + i_1"
                },
                "16": {
                    "type": "action",
                    "one": "11",
                    "content": "i_2 = i_1\ni_1 = result"
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
            "path": "C:\\code\\drakontechgen\\examples\\green\\Silhouette\\fibonacci.drakon",
            "name": "fibonacci",
            "scope": {
                "name": "fibonacci",
                "type": "function",
                "args": {},
                "declared": {
                    "ordinal": {
                        "name": "ordinal",
                        "path": "C:\\code\\drakontechgen\\examples\\green\\Silhouette\\fibonacci.drakon",
                        "fun": "fibonacci",
                        "type": "argument"
                    }
                },
                "auto": {},
                "all": {
                    "ordinal": "declared"
                },
                "loop": {},
                "algoprops": {},
                "functions": {},
                "classes": {},
                "assignments": {}
            }
        }
    },
    "classes": {},
    "assignments": {}
}