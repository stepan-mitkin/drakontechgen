"use strict";

function build_module_code(root, options) {
    var lines;
    var node;
    var code;
    var i;

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

function add_line(context, text) {
    var indent;
    var line;
    var i;

    indent = "";

    for (i = 0; i < context.depth * 4; i++) {
        indent += " ";
    }

    line = indent + text;
    context.lines.push(line);
}

function print_action(context) {
    var node;
    var parts;
    var part;
    var i;

    node = context.node;

    if (node.content) {
        parts = node.content.split("\n");

        for (i = 0; i < parts.length; i++) {
            part = parts[i];
            add_line(context, part);
        }
    }
}

function print_body(context, body) {
    var child;
    var child_context;
    var i;

    for (i = 0; i < body.length; i++) {
        child = body[i];

        child_context = {
            node: child,
            depth: context.depth + 1,
            lines: context.lines
        };

        print_node_with_context(child_context);
    }
}

function print_exit(context) {
    add_line(context, "выход");
}

function print_function(context) {
    var node;
    var args;
    var line;

    node = context.node;

    add_line(context, "");

    args = node.args.join(", ");

    if (args) {
        args = "(" + args + ")";
    }

    if (node.returns) {
        line = "алг " + node.returns + " " + node.name + args;
    } else {
        line = "алг " + node.name + args;
    }

    add_line(context, line);
    add_line(context, "нач");
    print_body(context, node.body);
    add_line(context, "кон");
}

function print_loop(context) {
    var node;

    node = context.node;

    add_line(context, "нц " + node.content);
    print_body(context, node.body);
    add_line(context, "кц");
}

function print_node(node, depth, lines) {
    var context;

    context = {
        node: node,
        depth: depth,
        lines: lines
    };

    print_node_with_context(context);
}

function print_node_with_context(context) {
    var node;

    node = context.node;

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
    } else {
        if (!(node.type === "exit")) {
            throw Error("Unexpected case value: " + node.type);
        }

        print_exit(context);
    }
}

function print_question(context) {
    var node;
    var parts;
    var content;

    node = context.node;

    parts = node.content.split("\n");
    content = parts.join(" ");

    add_line(context, "если " + content + " то");

    print_body(context, node.yes);

    if (node.no.length !== 0) {
        add_line(context, "иначе");
        print_body(context, node.no);
    }

    add_line(context, "все");
}

function print_switch(context) {
    var node;
    var option;
    var i;

    node = context.node;

    add_line(context, "выбор");

    for (i = 0; i < node.options.length; i++) {
        option = node.options[i];

        add_line(context, "при " + option.condition + ":");
        print_body(context, option.body);
    }

    if (node.other.length !== 0) {
        add_line(context, "иначе");
        print_body(context, node.other);
    }

    add_line(context, "все");
}

module.exports = {
    build_module_code: build_module_code
};