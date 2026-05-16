function build_module_code(root, options) {
    var lines = [];

    for (var node of root.body) {
        print_node(node, 0, lines);
    }

    return {
        code: lines.join("\n")
    };
}

function add_line(context, text) {
    var depth = context.depth;
    var lines = context.lines;
    var indent = " ".repeat(depth * 4);
    var line = indent + text;
    lines.push(line);
}

function print_action(context) {
    var node = context.node;

    if (node.content) {
        var parts = node.content.split("\n");
        for (var part of parts) {
            add_line(context, part);
        }
    }
}

function print_body(context, body) {
    var depth = context.depth;
    var lines = context.lines;

    for (var child of body) {
        print_node(child, depth + 1, lines);
    }
}

function print_exit(context) {
    add_line(context, "me.state = nil");
    add_line(context, "me._buzy = false");
    add_line(context, "return");
}

function print_function(context) {
    var node = context.node;

    add_line(context, "");

    var args = node.args.join(", ");
    if (node.self_name) {
        add_line(context, node.self_name + "." + node.name + " = function(" + args + ")");
    } else {
        add_line(context, "function " + node.name + "(" + args + ")");
    }

    print_body(context, node.body);
    add_line(context, "end");
}

function print_loop(context) {
    var node = context.node;

    add_line(context, node.content);
    print_body(context, node.body);
    add_line(context, "end");
}

function print_node(node, depth, lines) {
    var context = {
        node: node,
        depth: depth,
        lines: lines
    };

    if (node.type === "function") {
        print_function(context);
    } else {
        if (node.type === "action") {
            print_action(context);
        } else {
            if (node.type === "question") {
                print_question(context);
            } else {
                if (node.type === "loop") {
                    print_loop(context);
                } else {
                    if (node.type === "if-switch") {
                        print_switch(context);
                    } else {
                        if (node.type === "empty-line") {
                            add_line(context, "");
                        } else {
                            if (!(node.type === "exit")) {
                                throw new Error("Unexpected case value: " + node.type);
                            }
                            print_exit(context);
                        }
                    }
                }
            }
        }
    }
}

function print_question(context) {
    var node = context.node;
    var parts = node.content.split("\n");
    var content = parts.join(" ");

    add_line(context, "if " + content + " then");
    print_body(context, node.yes);

    if (!(node.no.length === 0)) {
        add_line(context, "else");
        print_body(context, node.no);
    }

    add_line(context, "end");
}

function print_switch(context) {
    var node = context.node;
    var first = true;

    for (var option of node.options) {
        if (first) {
            add_line(context, "if " + option.condition + " then");
            first = false;
        } else {
            add_line(context, "elseif " + option.condition + " then");
        }

        print_body(context, option.body);
    }

    if (!(node.other.length === 0)) {
        add_line(context, "else");
        print_body(context, node.other);
    }

    add_line(context, "end");
}

module.exports = {
    build_module_code: build_module_code
};