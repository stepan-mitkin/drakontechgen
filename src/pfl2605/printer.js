"use strict";

function add_line(text) {
    var depth = this.depth;
    var lines = this.lines;
    var indent = " ".repeat(depth * 4);
    var line = indent + text;

    lines.push(line);
}

function build_module_code(root, options) {
    var lines = [];
    var i;
    var node;
    var code;

    for (i = 0; i < root.body.length; i++) {
        node = root.body[i];
        print_node(node, 0, lines);
    }

    code = lines.join("\n");

    return {
        code: code
    };
}

function make_context(node, depth, lines) {
    return {
        node: node,
        depth: depth,
        lines: lines
    };
}

function print_action() {
    var node = this.node;
    var parts;
    var i;
    var part;

    if (node.content) {
        parts = node.content.split("\n");

        for (i = 0; i < parts.length; i++) {
            part = parts[i];
            add_line.call(this, part);
        }
    }
}

function print_body(body) {
    var depth = this.depth;
    var lines = this.lines;
    var i;
    var child;

    for (i = 0; i < body.length; i++) {
        child = body[i];
        print_node(child, depth + 1, lines);
    }
}

function print_class() {
    var node = this.node;

    add_line.call(this, "");
    add_line.call(this, "&ВидноВсем");
    add_line.call(this, "Класс " + node.name);
    print_body.call(this, node.body);
    add_line.call(this, "КонецКласса");
}

function print_exit() {
    add_line.call(this, "Возврат");
}

function print_function() {
    var node = this.node;
    var args;

    add_line.call(this, "");

    if (node.keywords.export) {
        add_line.call(this, "&ВидноВсем");
    }

    if (node.keywords.async) {
        add_line.call(this, "&Асинх");
    }

    args = node.args.join(", ");

    if (node.returns) {
        add_line.call(this, "Функция " + node.name + "(" + args + ") " + node.returns);
    } else {
        add_line.call(this, "Процедура " + node.name + "(" + args + ")");
    }

    print_body.call(this, node.body);

    if (node.returns) {
        add_line.call(this, "КонецФункции");
    } else {
        add_line.call(this, "КонецПроцедуры");
    }
}

function print_loop() {
    var node = this.node;

    add_line.call(this, node.content);
    print_body.call(this, node.body);
    add_line.call(this, "КонецЦикла");
}

function print_node(node, depth, lines) {
    var context = make_context(node, depth, lines);

    if (node.type === "function") {
        print_function.call(context);
    } else {
        if (node.type === "action") {
            print_action.call(context);
        } else {
            if (node.type === "question") {
                print_question.call(context);
            } else {
                if (node.type === "loop") {
                    print_loop.call(context);
                } else {
                    if (node.type === "if-switch") {
                        print_switch.call(context);
                    } else {
                        if (node.type === "empty-line") {
                            add_line.call(context, "");
                        } else {
                            if (node.type === "exit") {
                                print_exit.call(context);
                            } else {
                                if (node.type === "class") {
                                    print_class.call(context);
                                } else {
                                    if (!(node.type === "program")) {
                                        throw new Error("Unexpected case value: " + node.type);
                                    }

                                    print_program.call(context);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function print_program() {
    var node = this.node;

    add_line.call(this, "");
    add_line.call(this, "Программа " + node.name);
    print_body.call(this, node.body);
    add_line.call(this, "КонецПрограммы");
}

function print_question() {
    var node = this.node;
    var parts;
    var content;

    parts = node.content.split("\n");
    content = parts.join(" ");

    add_line.call(this, "Если " + content + " Тогда");
    print_body.call(this, node.yes);

    if (node.no.length !== 0) {
        add_line.call(this, "Иначе");
        print_body.call(this, node.no);
    }

    add_line.call(this, "КонецЕсли");
}

function print_switch() {
    var node = this.node;
    var i;
    var option;

    for (i = 0; i < node.options.length; i++) {
        option = node.options[i];

        if (i === 0) {
            add_line.call(this, "Если " + option.condition + " Тогда");
        } else {
            add_line.call(this, "ИначеЕсли " + option.condition + " Тогда");
        }

        print_body.call(this, option.body);
    }

    if (node.other.length !== 0) {
        add_line.call(this, "Иначе");
        print_body.call(this, node.other);
    }

    add_line.call(this, "КонецЕсли");
}

module.exports = {
    build_module_code: build_module_code
};