"use strict";

var error_list = [];
var global_options = undefined;

function build_module_tree(module, options) {
    var tree;
    var header;
    var start;
    var names;
    var name;
    var fun;
    var i;

    global_options = options;
    error_list = [];

    tree = {
        type: "module",
        body: []
    };

    header = find_function_by_name(module, "заголовок");
    if (header) {
        generate_method_body(header, tree.body);
    }

    start = find_function_by_name(module, "старт");
    if (start) {
        build_method_tree(start, tree.body);
    }

    names = Object.keys(module.functions);
    names.sort();

    for (i = 0; i < names.length; i++) {
        name = names[i];

        if (!(name === "старт" || name === "заголовок")) {
            fun = module.functions[name];
            build_method_tree(fun, tree.body);
        }
    }

    tree.body.push({
        type: "empty-line"
    });

    if (error_list.length === 0) {
        return {
            module: tree
        };
    } else {
        return {
            errors: error_list
        };
    }
}

function add_action(content, body, final) {
    var item;

    item = {
        type: "action",
        content: content,
        final: final || false
    };

    body.push(item);
}

function build_method_tree(method, output) {
    var tree;

    tree = {
        type: "function",
        keywords: method.keywords,
        name: method.name,
        args: method.args,
        returns: method.returns,
        body: []
    };

    output.push(tree);
    generate_method_body(method, tree.body);
}

function complex_silhouette_to_tree(context, body) {
    var first_branch;
    var branches;
    var state_var;
    var loop;
    var switch_item;
    var branch;
    var condition;
    var option;
    var i;

    first_branch = context.branches[0];

    if (first_branch.refs === 0) {
        convert_tree(context, first_branch.body, body);

        branches = [];
        for (i = 1; i < context.branches.length; i++) {
            branches.push(context.branches[i]);
        }
    } else {
        branches = context.branches;
    }

    state_var = context.state_var;

    loop = {
        type: "loop",
        content: "пока да",
        body: []
    };
    body.push(loop);

    switch_item = {
        type: "if-switch",
        options: [],
        other: []
    };
    loop.body.push(switch_item);

    for (i = 0; i < branches.length; i++) {
        branch = branches[i];

        condition = state_var + " = \"" + branch.name + "\"";

        option = {
            type: "option",
            condition: condition,
            body: []
        };

        switch_item.options.push(option);
        convert_tree(context, branch.body, option.body);
    }

    add_action(
        "вывод \"Неверное значение метки силуэта: \" + " + state_var + ", нс",
        switch_item.other,
        true
    );

    add_action(
        "выход",
        switch_item.other,
        true
    );
}

function convert_tree(context, nodes, body) {
    var node;
    var content;
    var final;
    var item;
    var next_branch;
    var i;

    for (i = 0; i < nodes.length; i++) {
        node = nodes[i];

        if (node.type === "action") {
            content = node.content;
            final = is_final(context.doc, node);

            item = {
                content: content,
                type: node.type,
                final: final
            };

            body.push(item);
        } else if (node.type === "exit") {
            if (!context.simple) {
                item = {
                    type: node.type,
                    final: true
                };

                if (!has_final(body)) {
                    body.push(item);
                }
            }
        } else if (node.type === "question") {
            content = qc(node.content);

            item = {
                content: content,
                type: node.type,
                yes: [],
                no: []
            };

            convert_tree(context, node.yes, item.yes);
            convert_tree(context, node.no, item.no);

            body.push(item);
        } else if (node.type === "loop") {
            content = node.content || "пока да";

            item = {
                type: "loop",
                content: content,
                body: []
            };

            convert_tree(context, node.body, item.body);
            body.push(item);
        } else if (node.type === "address") {
            if (!has_final(body)) {
                if (context.simple) {
                    next_branch = find_branch_by_name(context.branches, node.content);

                    if (next_branch) {
                        convert_tree(context, next_branch.body, body);
                    } else {
                        report_error(
                            "Ветка не найдена: " + node.content,
                            context.doc.path,
                            node.id,
                            undefined
                        );
                    }
                } else {
                    add_action(
                        context.state_var + " := \"" + node.content + "\"",
                        body,
                        false
                    );
                }
            }
        } else if (node.type === "break") {
            if (!has_final(body)) {
                add_action("выход", body, true);
            }
        } else if (node.type === "error") {
            add_action(
                "вывод \"" + node.message + "\", " + node.content + ", нс",
                body,
                true
            );
        } else {
            report_error(
                "Unexpected node type: " + node.type,
                context.doc.path,
                node.id,
                undefined
            );
        }
    }
}

function drakon_to_tree(doc) {
    var tmp;
    var json;
    var options;
    var raw_tree_json;

    tmp = {
        items: doc.items
    };

    json = JSON.stringify(tmp);
    options = {};

    raw_tree_json = global_options.toTree(
        json,
        doc.name,
        doc.path,
        "ru",
        options
    );

    return JSON.parse(raw_tree_json);
}

function find_function_by_name(module, name) {
    return module.functions[name];
}

function generate_method_body(doc, output) {
    var raw_tree;
    var first;
    var context;

    if (doc) {
        raw_tree = drakon_to_tree(doc);

        if (raw_tree.branches.length === 0) {
            return;
        }

        first = raw_tree.branches[0];

        if (raw_tree.branches.length === 1) {
            context = {
                doc: doc,
                simple: true,
                branches: raw_tree.branches
            };

            convert_tree(context, first.body, output);
        } else if (is_simple_silhouette(raw_tree)) {
            context = {
                doc: doc,
                simple: true,
                branches: raw_tree.branches
            };

            convert_tree(context, first.body, output);
        } else {
            add_action(
                "лит _ветка_ = \"" + first.name + "\"",
                output,
                false
            );

            context = {
                doc: doc,
                simple: false,
                branches: raw_tree.branches,
                state_var: "_ветка_ "
            };

            complex_silhouette_to_tree(context, output);
        }
    }
}

function has_final(body) {
    var last;

    if (body.length === 0) {
        return false;
    }

    last = body[body.length - 1];

    if (last.final) {
        return true;
    }

    if (last.type === "question" && has_final(last.yes) && has_final(last.no)) {
        return true;
    }

    return false;
}

function is_final(doc, node) {
    var item;

    if (node.id) {
        item = doc.items[node.id];

        if (item && item.content && item.content === "выход") {
            return true;
        }

        return false;
    }

    return false;
}

function is_simple_silhouette(raw_tree) {
    var first_branch;
    var branch;
    var last_index;
    var i;

    first_branch = raw_tree.branches[0];

    if (first_branch.refs > 0) {
        return false;
    }

    last_index = raw_tree.branches.length - 1;

    for (i = 0; i < raw_tree.branches.length; i++) {
        branch = raw_tree.branches[i];

        if (!(!(branch.refs > 1) || (i === last_index && !(branch.body.length > 2)))) {
            return false;
        }
    }

    return true;
}

function qc(content) {
    var operand;
    var left;
    var right;

    if (typeof content === "string") {
        return content;
    }

    if (content.operator === "not") {
        operand = qc(content.operand);
        return "не (" + operand + ")";
    }

    if (content.operator === "and") {
        left = qc(content.left);
        right = qc(content.right);
        return "(" + left + ") и (" + right + ")";
    }

    if (content.operator === "or") {
        left = qc(content.left);
        right = qc(content.right);
        return "(" + left + ") или (" + right + ")";
    }

    if (content.operator === "equal") {
        left = qc(content.left);
        right = qc(content.right);
        return left + " = " + right;
    }

    report_error(
        "Unexpected case value: " + content.operator,
        undefined,
        undefined,
        content
    );

    return "";
}

function find_branch_by_name(branches, name) {
    var branch;
    var i;

    for (i = 0; i < branches.length; i++) {
        branch = branches[i];

        if (branch.name === name) {
            return branch;
        }
    }

    return undefined;
}

function report_error(message, handle, item_id, data) {
    error_list.push({
        message: message,
        filename: handle,
        nodeId: item_id,
        data: data
    });
}

module.exports = {
    build_module_tree: build_module_tree
};