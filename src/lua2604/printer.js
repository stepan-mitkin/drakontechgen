"use strict";

function add_line(text, depth, lines) {
    var indent = "";
    var i = 0;

    for (i = 0; i < depth * 4; i++) {
        indent += " ";
    }

    lines.push(indent + text);
}

function build_module_code(root, options) {
    var lines = [];
    var i = 0;
    var node = undefined;

    if (!root || !root.body) {
        return { code: "" };
    }

    for (i = 0; i < root.body.length; i++) {
        node = root.body[i];
        print_node(node, 0, lines);
    }

    return {
        code: lines.join("\n")
    };
}

function print_action(node, depth, lines) {
    var parts = undefined;
    var i = 0;

    if (!node || !node.content) {
        return;
    }

    parts = node.content.split("\n");

    for (i = 0; i < parts.length; i++) {
        add_line(parts[i], depth, lines);
    }
}

function print_body(body, depth, lines) {
    var i = 0;

    if (!body) {
        return;
    }

    for (i = 0; i < body.length; i++) {
        print_node(body[i], depth + 1, lines);
    }
}

function print_function(node, depth, lines) {
    var args = "";
    var header = "";

    add_line("", depth, lines);

    if (!node) {
        return;
    }

    if (node.args) {
        args = node.args.join(", ");
    }

    if (node.self_name) {
        header = node.self_name + "." + node.name + " = function(" + args + ")";
    } else {
        header = node.name + " = function(" + args + ")";
    }

    add_line(header, depth, lines);

    print_body(node.body, depth, lines);

    add_line("end", depth, lines);
}

function print_loop(node, depth, lines) {
    if (!node) {
        return;
    }

    add_line(node.content || "while true do", depth, lines);
    print_body(node.body, depth, lines);
    add_line("end", depth, lines);
}

function print_question(node, depth, lines) {
    var parts = undefined;
    var content = "";
    var i = 0;

    if (!node) {
        return;
    }

    if (node.content) {
        parts = node.content.split("\n");
        content = parts.join(" ");
    }

    add_line("if " + content + " then", depth, lines);

    print_body(node.yes, depth, lines);

    if (node.no && node.no.length > 0) {
        add_line("else", depth, lines);
        print_body(node.no, depth, lines);
    }

    add_line("end", depth, lines);
}

function print_switch(node, depth, lines) {
    var i = 0;
    var option = undefined;

    if (!node || !node.options || node.options.length === 0) {
        return;
    }

    for (i = 0; i < node.options.length; i++) {
        option = node.options[i];

        if (i === 0) {
            add_line("if " + option.condition + " then", depth, lines);
        } else {
            add_line("elseif " + option.condition + " then", depth, lines);
        }

        print_body(option.body, depth, lines);
    }

    if (node.other && node.other.length > 0) {
        add_line("else", depth, lines);
        print_body(node.other, depth, lines);
    }

    add_line("end", depth, lines);
}

function print_node(node, depth, lines) {
    if (!node) {
        return;
    }

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
    } else {
        throw new Error("Unexpected node type: " + node.type);
    }
}

module.exports = {
    build_module_code: build_module_code
};