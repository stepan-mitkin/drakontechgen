"use strict";

function add_line(context, text) {
    var indent;
    var line;

    indent = " ".repeat(context.depth * 4);
    line = indent + text;
    context.lines.push(line);
}

function build_module_code(root, options) {
    var lines;
    var i;
    var node;

    lines = [];

    for (i = 0; i < root.body.length; i += 1) {
        node = root.body[i];
        print_node(node, 0, lines);
    }

    return {
        code: lines.join("\n")
    };
}

function print_action(context) {
    var node;
    var parts;
    var i;
    var part;

    node = context.node;

    if (node.content) {
        parts = node.content.split("\n");

        for (i = 0; i < parts.length; i += 1) {
            part = parts[i];
            add_line(context, part);
        }
    }
}

function print_body(context, body) {
    var i;
    var child;

    for (i = 0; i < body.length; i += 1) {
        child = body[i];
        print_node(child, context.depth + 1, context.lines);
    }
}

function print_function(context) {
    var node;
    var args;

    node = context.node;
    args = node.args.join(", ");

    add_line(context, node.name + " = function(" + args + ")");
    print_body(context, node.body);
    add_line(context, "end");
}

function print_loop(context) {
    var node;

    node = context.node;

    add_line(context, node.content);
    print_body(context, node.body);
    add_line(context, "end");
}

function print_node(node, depth, lines) {
    var context;

    context = {
        node: node,
        depth: depth,
        lines: lines
    };

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
    } else {
        throw new Error("Unexpected case value: " + node.type);
    }
}

function print_question(context) {
    var node;

    node = context.node;

    add_line(context, "if " + node.content + " then");
    print_body(context, node.yes);

    if (node.no.length !== 0) {
        add_line(context, "else");
        print_body(context, node.no);
    }

    add_line(context, "end");
}

function print_switch(context) {
    var node;
    var i;
    var option;

    node = context.node;

    for (i = 0; i < node.options.length; i += 1) {
        option = node.options[i];

        if (i === 0) {
            add_line(context, "if " + option.condition + " then");
        } else {
            add_line(context, "elseif " + option.condition + " then");
        }

        print_body(context, option.body);
    }

    if (node.other.length !== 0) {
        add_line(context, "else");
        print_body(context, node.other);
    }

    add_line(context, "end");
}

module.exports = {
    build_module_code: build_module_code
};