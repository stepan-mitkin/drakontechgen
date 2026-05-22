"use strict";

var global_options = undefined;
var error_list = [];

function add_action(content, body, final) {
    var item = {
        type: "action",
        content: content,
        final: final || false
    };

    body.push(item);
}

function build_class_tree(klass, output) {
    var class_tree;
    var names;
    var i;
    var name;
    var method;

    class_tree = {
        type: klass.type,
        name: klass.name,
        body: []
    };

    output.push(class_tree);

    generate_method_body(
        klass.class_body,
        class_tree.body
    );

    if (klass.constructor) {
        build_method_tree(
            klass.constructor,
            class_tree.body
        );
    }

    names = Object.keys(klass.methods);
    names.sort();

    for (i = 0; i < names.length; i++) {
        name = names[i];
        method = klass.methods[name];

        build_method_tree(
            method,
            class_tree.body
        );
    }
}

function build_method_tree(method, output) {
    var tree = {
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

function build_module_tree(module, options) {
    var tree;
    var names;
    var i;
    var name;
    var klass;

    global_options = options;
    error_list = [];

    tree = {
        type: "module",
        body: []
    };

    generate_method_body(
        module.header,
        tree.body
    );

    names = Object.keys(module.classes);
    names.sort();

    for (i = 0; i < names.length; i++) {
        name = names[i];
        klass = module.classes[name];

        build_class_tree(
            klass,
            tree.body
        );
    }

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

function complex_silhouette_to_tree(context, body) {
    var state_var;
    var loop;
    var switch_node;
    var i;
    var branch;
    var condition;
    var option;

    state_var = context.state_var;

    loop = {
        type: "loop",
        content: "Цикл",
        body: []
    };

    body.push(loop);

    switch_node = {
        type: "if-switch",
        options: [],
        other: []
    };

    loop.body.push(switch_node);

    for (i = 0; i < context.branches.length; i++) {
        branch = context.branches[i];
        condition = state_var + " = \"" + branch.name + "\"";

        option = {
            type: "option",
            condition: condition,
            body: []
        };

        switch_node.options.push(option);

        convert_tree(context, branch.body, option.body);
    }
}

function convert_tree(context, nodes, body) {
    var i;
    var node;
    var content;
    var final;
    var item;
    var next_branch;

    for (i = 0; i < nodes.length; i++) {
        node = nodes[i];

        if (node.id && context.declarations.indexOf(node.id) !== -1) {
            continue;
        }

        if (node.type === "action") {
            content = node.content;
            final = is_final(context.doc, node);

            item = {
                content: content,
                type: node.type,
                final: final
            };

            body.push(item);
        } else {
            if (node.type === "exit") {
                if (!context.simple) {
                    item = {
                        type: node.type,
                        final: true
                    };

                    if (!has_final(body)) {
                        body.push(item);
                    }
                }
            } else {
                if (node.type === "question") {
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
                } else {
                    if (node.type === "loop") {
                        content = node.content || "Цикл";

                        item = {
                            type: "loop",
                            content: content,
                            body: []
                        };

                        convert_tree(context, node.body, item.body);

                        body.push(item);
                    } else {
                        if (node.type === "address") {
                            if (!has_final(body)) {
                                if (context.simple) {
                                    next_branch = find_branch(context.branches, node.content);

                                    if (next_branch) {
                                        convert_tree(context, next_branch.body, body);
                                    } else {
                                        report_error(
                                            "Branch not found: " + node.content,
                                            context.doc.path,
                                            node.id
                                        );
                                    }
                                } else {
                                    add_action(context.state_var + " = \"" + node.content + "\"", body);
                                }
                            }
                        } else {
                            if (node.type === "break") {
                                if (!has_final(body)) {
                                    add_action("Прервать", body, true);
                                }
                            } else {
                                if (node.type === "error") {
                                    add_action(
                                        "ВызватьИсключение \"" + node.message + ": \" + " + node.content,
                                        body,
                                        true
                                    );
                                } else {
                                    report_error(
                                        "Unexpected node type: " + node.type,
                                        context.doc.path,
                                        node.id
                                    );
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function declare_variables(doc, output) {
    var i;
    var item_id;
    var item;

    if (doc.declarations) {
        for (i = 0; i < doc.declarations.length; i++) {
            item_id = doc.declarations[i];
            item = doc.items[item_id];

            add_action(
                item.content,
                output
            );
        }
    }
}

function drakon_to_tree(doc, noLoop) {
    var tmp;
    var json;
    var options;
    var raw_tree_json;

    tmp = {
        items: doc.items
    };

    json = JSON.stringify(tmp);

    options = {
        noLoop: noLoop
    };

    raw_tree_json = global_options.toTree(
        json,
        doc.name,
        doc.path,
        "en",
        options
    );

    return JSON.parse(raw_tree_json);
}

function generate_method_body(doc, output) {
    var raw_tree;
    var first;
    var declarations;
    var context;

    if (!doc) {
        return;
    }

    raw_tree = drakon_to_tree(
        doc,
        false
    );

    if (raw_tree.branches.length === 0) {
        return;
    }

    first = raw_tree.branches[0];
    declarations = doc.declarations || [];

    declare_variables(
        doc,
        output
    );

    if (raw_tree.branches.length === 1) {
        context = {
            declarations: declarations,
            doc: doc,
            simple: true,
            branches: raw_tree.branches
        };

        convert_tree(
            context,
            first.body,
            output
        );
    } else {
        if (is_simple_silhouette(raw_tree)) {
            context = {
                declarations: declarations,
                doc: doc,
                simple: true,
                branches: raw_tree.branches
            };

            convert_tree(
                context,
                first.body,
                output
            );
        } else {
            add_action(
                "Перем _ветка_  тип Строка = \"" + first.name + "\"",
                output
            );

            context = {
                declarations: declarations,
                doc: doc,
                simple: false,
                branches: raw_tree.branches,
                state_var: "_ветка_ "
            };

            complex_silhouette_to_tree(
                context,
                output
            );
        }
    }
}

function has_final(body) {
    var last;

    if (body.length === 0) {
        return false;
    } else {
        last = body[body.length - 1];

        if (last.final) {
            return true;
        } else {
            if ((last.type === "question" && has_final(last.yes)) && has_final(last.no)) {
                return true;
            } else {
                return false;
            }
        }
    }
}

function is_final(doc, node) {
    var item;

    if (node.id) {
        item = doc.items[node.id];

        if (item.content &&
            (item.content.startsWith("Возврат ") ||
                item.content.startsWith("ВызватьИсключение "))) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function is_simple_silhouette(raw_tree) {
    var first_branch;
    var i;
    var branch;
    var is_last;

    first_branch = raw_tree.branches[0];

    if (first_branch.refs > 0) {
        return false;
    }

    for (i = 0; i < raw_tree.branches.length; i++) {
        branch = raw_tree.branches[i];
        is_last = i === raw_tree.branches.length - 1;

        if (branch.refs > 1) {
            if (!(is_last && !(branch.body.length > 2))) {
                return false;
            }
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
    } else {
        if (content.operator === "not") {
            operand = qc(content.operand);
            return "Не (" + operand + ")";
        } else {
            if (content.operator === "and") {
                left = qc(content.left);
                right = qc(content.right);
                return "(" + left + ") И (" + right + ")";
            } else {
                if (content.operator === "or") {
                    left = qc(content.left);
                    right = qc(content.right);
                    return "(" + left + ") Или (" + right + ")";
                } else {
                    if (!(content.operator === "equal")) {
                        throw new Error("Unexpected case value: " + content.operator);
                    }

                    left = qc(content.left);
                    right = qc(content.right);

                    return left + " = " + right;
                }
            }
        }
    }
}

function find_branch(branches, name) {
    var i;
    var branch;

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