"use strict";

function add_line(text, depth, lines) {
    var indent;
    var line;

    indent = " ".repeat(depth * 4);
    line = indent + text;
    lines.push(line);
}

function build_module_code(root, options) {
    var lines;
    var code;
    var i;
    var node;

    lines = [];

    for (i = 0; i < root.body.length; i++) {
        node = root.body[i];
        print_node(node, 0, lines);
    }

    code = lines.join("\n");

    return {
        code: code
    };
}

function print_action(node, depth, lines) {
    var parts;
    var i;
    var part;

    if (node.content) {
        parts = node.content.split("\n");

        for (i = 0; i < parts.length; i++) {
            part = parts[i];
            add_line(part, depth, lines);
        }
    }
}

function print_body(body, depth, lines) {
    var i;
    var child;

    for (i = 0; i < body.length; i++) {
        child = body[i];
        print_node(child, depth + 1, lines);
    }
}

function print_exit(node, depth, lines) {
    add_line("Возврат;", depth, lines);
}

function print_function(node, depth, lines) {
    var args;
    var line;

    add_line("", depth, lines);

    args = node.args.join(", ");

    if (node.returnsValue) {
        line = "Функция " + node.name + "(" + args + ")";
    } else {
        line = "Процедура " + node.name + "(" + args + ")";
    }

    if (node.keywords && node.keywords.export === true) {
        line = line + " Экспорт";
    }

    add_line(line, depth, lines);

    print_body(node.body, depth, lines);

    if (node.returnsValue) {
        add_line("КонецФункции", depth, lines);
    } else {
        add_line("КонецПроцедуры", depth, lines);
    }
}

function print_loop(node, depth, lines) {
    add_line(node.content, depth, lines);
    print_body(node.body, depth, lines);
    add_line("КонецЦикла;", depth, lines);
}

function print_node(node, depth, lines) {
    if (node.type === "function") {
        print_function(node, depth, lines);
    } else if (node.type === "action") {
        print_action(node, depth, lines);
    } else if (node.type === "question") {
        print_question(node, depth, lines);
    } else if (node.type === "loop") {
        print_loop(node, depth, lines);
    } else if (node.type === "if-switch") {
        print_switch(node, depth, lines);
    } else if (node.type === "empty-line") {
        add_line("", depth, lines);
    } else if (node.type === "exit") {
        print_exit(node, depth, lines);
    } else {
        throw Error("Unexpected case value: " + node.type);
    }
}

function print_question(node, depth, lines) {
    var parts;
    var content;

    parts = node.content.split("\n");
    content = parts.join(" ");

    add_line("Если " + content + " Тогда", depth, lines);

    print_body(node.yes, depth, lines);

    if (node.no.length !== 0) {
        add_line("Иначе", depth, lines);
        print_body(node.no, depth, lines);
    }

    add_line("КонецЕсли;", depth, lines);
}

function print_switch(node, depth, lines) {
    var i;
    var option;

    for (i = 0; i < node.options.length; i++) {
        option = node.options[i];

        if (i === 0) {
            add_line("Если " + option.condition + " Тогда", depth, lines);
        } else {
            add_line("ИначеЕсли " + option.condition + " Тогда", depth, lines);
        }

        print_body(option.body, depth, lines);
    }

    if (node.other.length !== 0) {
        add_line("Иначе", depth, lines);
        print_body(node.other, depth, lines);
    }

    add_line("КонецЕсли;", depth, lines);
}

module.exports = {
    build_module_code: build_module_code
};