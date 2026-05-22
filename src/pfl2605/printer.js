"use strict";

var error_list = [];
var global_options = undefined;
var next_id = 1;

function create_error(message, details) {
    return {
        id: next_id++,
        message: message,
        details: details
    };
}

function report_error(message, details) {
    error_list.push(create_error(message, details));
}

function repeat_space(count) {
    var result = "";
    var i = 0;
    while (i < count) {
        result += " ";
        i++;
    }
    return result;
}

function is_empty(array) {
    return !array || array.length === 0;
}

function add_line(context, text) {
    var indent = repeat_space(context.depth * 4);
    var line = indent + text;
    context.lines.push(line);
}

function build_module_code(root, options) {
    global_options = options;
    error_list = [];

    var lines = [];
    var i = 0;
    var node = undefined;

    if (!root || !root.body) {
        report_error("Root body is missing", undefined);
        return {
            code: "",
            errors: error_list
        };
    }

    while (i < root.body.length) {
        node = root.body[i];
        print_node(node, 0, lines);
        i++;
    }

    return {
        code: lines.join("\n"),
        errors: error_list
    };
}

function print_action(context) {
    var node = context.node;
    var parts = undefined;
    var i = 0;

    if (node.content) {
        parts = node.content.split("\n");
        while (i < parts.length) {
            add_line(context, parts[i]);
            i++;
        }
    }
}

function print_body(context, body) {
    var child_context = undefined;
    var i = 0;

    if (!body) {
        return;
    }

    while (i < body.length) {
        child_context = {
            node: body[i],
            depth: context.depth + 1,
            lines: context.lines
        };
        print_node(child_context.node, child_context.depth, child_context.lines);
        i++;
    }
}

function print_class(context) {
    var node = context.node;

    add_line(context, "");
    add_line(context, "&ВидноВсем");
    add_line(context, "Класс " + node.name);
    print_body(context, node.body);
    add_line(context, "КонецКласса");
}

function print_exit(context) {
    add_line(context, "Возврат");
}

function print_function(context) {
    var node = context.node;
    var args = "";

    add_line(context, "");

    if (
        node.keywords &&
        node.keywords.export === true
    ) {
        add_line(context, "&ВидноВсем");
    }

    if (
        node.keywords &&
        node.keywords.async === true
    ) {
        add_line(context, "&Асинх");
    }

    args = node.args.join(", ");

    if (node.name === "Конструктор") {
        add_line(context, node.name + "(" + args + ")");
    } else {
        if (node.returns) {
            add_line(
                context,
                "Функция " +
                    node.name +
                    "(" +
                    args +
                    ") " +
                    node.returns
            );
        } else {
            add_line(
                context,
                "Процедура " +
                    node.name +
                    "(" +
                    args +
                    ")"
            );
        }
    }

    print_body(context, node.body);

    if (node.name === "Конструктор") {
        add_line(context, "КонецКонструктора");
    } else {
        if (node.returns) {
            add_line(context, "КонецФункции");
        } else {
            add_line(context, "КонецПроцедуры");
        }
    }
}

function print_loop(context) {
    var node = context.node;

    add_line(context, node.content);
    print_body(context, node.body);
    add_line(context, "КонецЦикла");
}

function print_node(node, depth, lines) {
    var context = {
        node: node,
        depth: depth,
        lines: lines
    };

    if (!node) {
        report_error("Node is missing", undefined);
        return;
    }

    if (node.type === "function") {
        print_function(context);
    } else if (node.type === "action") {
        print_action(context);
    } else if (node.type === "question") {
        print_question(context);
    } else if (node.type === "loop") {
        print_loop(context);
    } else if (node.type === "if-switch") {
        print_switch(context);
    } else if (node.type === "empty-line") {
        add_line(context, "");
    } else if (node.type === "exit") {
        print_exit(context);
    } else if (node.type === "class") {
        print_class(context);
    } else if (node.type === "program") {
        print_program(context);
    } else {
        report_error("Unexpected case value", node.type);
    }
}

function print_program(context) {
    var node = context.node;

    add_line(context, "");
    add_line(context, "Программа " + node.name);
    print_body(context, node.body);
    add_line(context, "КонецПрограммы");
}

function print_question(context) {
    var node = context.node;
    var parts = [];
    var content = "";

    if (node.content) {
        parts = node.content.split("\n");
        content = parts.join(" ");
    }

    add_line(context, "Если " + content + " Тогда");
    print_body(context, node.yes);

    if (!is_empty(node.no)) {
        add_line(context, "Иначе");
        print_body(context, node.no);
    }

    add_line(context, "КонецЕсли");
}

function print_switch(context) {
    var node = context.node;
    var i = 0;
    var option = undefined;

    if (node.options) {
        while (i < node.options.length) {
            option = node.options[i];

            if (i === 0) {
                add_line(context, "Если " + option.condition + " Тогда");
            } else {
                add_line(context, "ИначеЕсли " + option.condition + " Тогда");
            }

            print_body(context, option.body);
            i++;
        }
    }

    if (!is_empty(node.other)) {
        add_line(context, "Иначе");
        print_body(context, node.other);
    }

    add_line(context, "КонецЕсли");
}

module.exports = {
    build_module_code: build_module_code
};