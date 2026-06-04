"use strict";

let error_list = [];
let global_options = undefined;

function build_module_tree(module, options) {
    error_list = [];
    global_options = options;

    const tree = {
        type: "module",
        body: []
    };

    generate_method_body(module.header, tree.body);

    const names = Object.keys(module.classes);
    names.sort();

    for (const name of names) {
        const clazz = module.classes[name];
        build_class_tree(clazz, tree.body);
    }

    if (error_list.length === 0) {
        return {
            module: tree
        };
    }

    return {
        errors: error_list
    };
}

function build_class_tree(clazz, output) {
    const class_tree = {
        type: clazz.type,
        name: clazz.name,
        body: []
    };

    output.push(class_tree);

    generate_method_body(
        clazz.class_body,
        class_tree.body
    );

    if (clazz.constructor !== undefined) {
        build_method_tree(
            clazz.constructor,
            class_tree.body
        );
    }

    const names = Object.keys(clazz.methods);
    names.sort();

    for (const name of names) {
        const method = clazz.methods[name];
        build_method_tree(
            method,
            class_tree.body
        );
    }
}

function build_method_tree(method, output) {
    const tree = {
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

function generate_method_body(doc, output) {
    if (doc === undefined) {
        return;
    }

    const raw_tree = drakon_to_tree(doc, false);

    if (raw_tree.branches.length === 0) {
        return;
    }

    const first = raw_tree.branches[0];
    const declarations = doc.declarations || [];

    if (raw_tree.branches.length === 1) {
        const context = {
            declarations: declarations,
            doc: doc,
            simple: true
        };

        convert_tree(context, first.body, output);
        return;
    }

    if (is_simple_silhouette(raw_tree)) {
        const context = {
            declarations: declarations,
            doc: doc,
            simple: true,
            branches: raw_tree.branches
        };

        convert_tree(context, first.body, output);
        return;
    }

    add_action(
        "Перем _ветка_ тип Строка = \"" + first.name + "\"",
        output
    );

    const context = {
        declarations: declarations,
        doc: doc,
        simple: false,
        branches: raw_tree.branches,
        state_var: "_ветка_"
    };

    complex_silhouette_to_tree(context, output);
}

function complex_silhouette_to_tree(context, body) {
    const first_branch = context.branches[0];
    let branches = context.branches;

    if (first_branch.refs === 0) {
        convert_tree(
            context,
            first_branch.body,
            body
        );

        branches = context.branches.slice(1);
    }

    const state_var = context.state_var;

    const loop = {
        type: "loop",
        content: "Цикл",
        body: []
    };

    body.push(loop);

    const switch_item = {
        type: "if-switch",
        options: [],
        other: []
    };

    loop.body.push(switch_item);

    for (const branch of branches) {
        const condition = state_var + " = \"" + branch.name + "\"";

        const option = {
            type: "option",
            condition: condition,
            body: []
        };

        switch_item.options.push(option);
        convert_tree(context, branch.body, option.body);
    }
}

function convert_tree(context, nodes, body) {
    for (const node of nodes) {
        if (is_declaration(context, node)) {
            continue;
        }

        if (node.type === "action") {
            add_action_node(context, node, body);
        } else if (node.type === "exit") {
            add_exit_node(context, body);
        } else if (node.type === "question") {
            add_question_node(context, node, body);
        } else if (node.type === "loop") {
            add_loop_node(context, node, body);
        } else if (node.type === "address") {
            add_address_node(context, node, body);
        } else if (node.type === "break") {
            add_break_node(body);
        } else if (node.type === "error") {
            add_error_node(node, body);
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

function is_declaration(context, node) {
    if (node.id === undefined) {
        return false;
    }

    return context.declarations.indexOf(node.id) !== -1;
}

function add_action_node(context, node, body) {
    const item = {
        content: node.content,
        type: node.type,
        final: is_final(context.doc, node)
    };

    body.push(item);
}

function add_exit_node(context, body) {
    if (context.simple) {
        return;
    }

    if (has_final(body)) {
        return;
    }

    body.push({
        type: "exit",
        final: true
    });
}

function add_question_node(context, node, body) {
    const item = {
        content: qc(node.content),
        type: node.type,
        yes: [],
        no: []
    };

    convert_tree(context, node.yes, item.yes);
    convert_tree(context, node.no, item.no);

    body.push(item);
}

function add_loop_node(context, node, body) {
    const content = node.content || "Цикл";

    const item = {
        type: "loop",
        content: content,
        body: []
    };

    convert_tree(context, node.body, item.body);
    body.push(item);
}

function add_address_node(context, node, body) {
    if (has_final(body)) {
        return;
    }

    if (context.simple) {
        const next_branch = find_branch(context.branches, node.content);

        if (next_branch === undefined) {
            report_error(
                "Branch not found: " + node.content,
                context.doc.path,
                node.id,
                undefined
            );
            return;
        }

        convert_tree(context, next_branch.body, body);
    } else {
        add_action(
            context.state_var + " = \"" + node.content + "\"",
            body,
            false
        );
    }
}

function add_break_node(body) {
    if (has_final(body)) {
        return;
    }

    add_action("Прервать", body, true);
}

function add_error_node(node, body) {
    add_action(
        "ВызватьИсключение \"" + node.message + ": \" + " + node.content,
        body,
        true
    );
}

function find_branch(branches, name) {
    for (const branch of branches) {
        if (branch.name === name) {
            return branch;
        }
    }

    return undefined;
}

function add_action(content, body, final) {
    const item = {
        type: "action",
        content: content,
        final: final || false
    };

    body.push(item);
}

function drakon_to_tree(doc, noLoop) {
    const tmp = {
        items: doc.items
    };

    const json = JSON.stringify(tmp);

    const options = {
        noLoop: noLoop
    };

    const raw_tree_json = global_options.toTree(
        json,
        doc.name,
        doc.path,
        "en",
        options
    );

    return JSON.parse(raw_tree_json);
}

function has_final(body) {
    if (body.length === 0) {
        return false;
    }

    const last = body[body.length - 1];

    if (last.final) {
        return true;
    }

    if (last.type === "question" && has_final(last.yes) && has_final(last.no)) {
        return true;
    }

    return false;
}

function is_final(doc, node) {
    if (node.id === undefined) {
        return false;
    }

    const item = doc.items[node.id];

    if (item === undefined) {
        return false;
    }

    if (item.content === undefined) {
        return false;
    }

    return (
        item.content.startsWith("Возврат ") ||
        item.content.startsWith("ВызватьИсключение ")
    );
}

function is_simple_silhouette(raw_tree) {
    const first_branch = raw_tree.branches[0];

    if (first_branch.refs > 0) {
        return false;
    }

    const last_index = raw_tree.branches.length - 1;

    for (let index = 0; index < raw_tree.branches.length; index++) {
        const branch = raw_tree.branches[index];
        const is_last = index === last_index;

        if (branch.refs > 1) {
            return false;
        }

        if (is_last && branch.body.length > 2) {
            return false;
        }
    }

    return true;
}

function qc(content) {
    if (typeof content === "string") {
        return content;
    }

    if (content.operator === "not") {
        return "Не (" + qc(content.operand) + ")";
    }

    if (content.operator === "and") {
        return "(" + qc(content.left) + ") И (" + qc(content.right) + ")";
    }

    if (content.operator === "or") {
        return "(" + qc(content.left) + ") Или (" + qc(content.right) + ")";
    }

    if (content.operator === "equal") {
        return qc(content.left) + " = " + qc(content.right);
    }

    report_error(
        "Unexpected operator: " + content.operator,
        undefined,
        undefined,
        content.operator
    );

    return "";
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