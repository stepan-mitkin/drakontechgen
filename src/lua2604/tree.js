"use strict";

var error_list = [];
var global_options = undefined;

function add_action(content, body, final) {
    var item;

    item = {
        type: "action",
        content: content,
        final: final
    };

    body.push(item);
}

function add_class_exports(exported, body) {
    var i;
    var name;

    for (i = 0; i < exported.length; i += 1) {
        name = exported[i];
        add_action("self." + name + " = " + name, body);
    }

    add_action("return self", body);
}

function add_module_exports(exported, body) {
    var lines;
    var i;
    var name;
    var content;

    lines = [];

    for (i = 0; i < exported.length; i += 1) {
        name = exported[i];
        lines.push("    " + name + " = " + name);
    }

    content = "return {\n" + lines.join(",\n") + "\n}";
    add_action(content, body);
}

function add_self(doc, fun_node) {
    var content;

    content = "local self = {_type=\"" + doc.name + "\"}";
    add_action(content, fun_node.body);
}

function build_function_tree(doc) {
    var raw_tree_json;
    var raw_tree;
    var fun_node;
    var names;
    var first;
    var context;
    var exported;
    var i;
    var name;
    var member;
    var member_node;

    raw_tree_json = drakon_to_tree(doc);
    raw_tree = JSON.parse(raw_tree_json);

    fun_node = create_function_node(doc);

    names = Object.keys(doc.members || {});
    names.sort();

    for (i = 0; i < names.length; i += 1) {
        name = names[i];
        add_action("local " + name, fun_node.body);
    }

    if (doc.type === "class") {
        add_self(doc, fun_node);
    }

    first = raw_tree.branches[0];

    if (raw_tree.branches.length === 1) {
        declare_variables(doc.scope, fun_node.body);

        context = {
            doc: doc,
            simple: true
        };

        convert_tree(context, first.body, fun_node.body);
    } else if (is_simple_silhouette(raw_tree)) {
        declare_variables(doc.scope, fun_node.body);

        context = {
            doc: doc,
            simple: true,
            branches: raw_tree.branches
        };

        convert_tree(context, first.body, fun_node.body);
    } else {
        doc.scope.declarations["_branch_"] = "local";
        declare_variables(doc.scope, fun_node.body);
        add_action("_branch_ = \"" + first.name + "\"", fun_node.body);

        context = {
            doc: doc,
            simple: false,
            branches: raw_tree.branches
        };

        complex_silhouette_to_tree(context, fun_node.body);
    }

    exported = [];

    for (i = 0; i < names.length; i += 1) {
        name = names[i];
        member = doc.members[name];

        if (member.keywords && member.keywords.export) {
            exported.push(name);
        }

        member_node = build_function_tree(member);
        fun_node.body.push(member_node);
    }

    if (doc.type === "class") {
        add_class_exports(exported, fun_node.body);
    } else if (doc.type === "module") {
        add_module_exports(exported, fun_node.body);
    }

    return fun_node;
}

function build_module_tree(module, options) {
    var tree;

    error_list = [];
    global_options = options;

    tree = build_function_tree(module);

    if (error_list.length === 0) {
        return {
            module: tree
        };
    }

    return {
        errors: error_list
    };
}

function complex_silhouette_to_tree(context, body) {
    var loop;
    var switch_node;
    var i;
    var branch;
    var condition;
    var option;

    loop = {
        type: "loop",
        content: "while _branch_ do",
        body: []
    };
    body.push(loop);

    switch_node = {
        type: "if-switch",
        options: [],
        other: []
    };
    loop.body.push(switch_node);

    for (i = 0; i < context.branches.length; i += 1) {
        branch = context.branches[i];
        condition = "_branch_ == \"" + branch.name + "\"";

        option = {
            type: "option",
            condition: condition,
            body: []
        };

        switch_node.options.push(option);

        add_action("_branch_ = nil", option.body);
        convert_tree(context, branch.body, option.body);
    }

    add_action("return", switch_node.other, true);
}

function convert_tree(context, nodes, body) {
    var i;
    var node;
    var item;
    var content;
    var next_branch;

    for (i = 0; i < nodes.length; i += 1) {
        node = nodes[i];

        if (node.type === "action") {
            item = {
                content: node.content,
                type: node.type
            };
            item.final = is_final(item);
            body.push(item);
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
            if (!node.content) {
                node.content = "while true do";
            }

            item = {
                content: node.content,
                type: node.type,
                body: []
            };

            convert_tree(context, node.body, item.body);
            body.push(item);
        } else if (node.type === "address") {
            if (!has_final(body)) {
                if (context.simple) {
                    next_branch = find_branch(context.branches, node.content);

                    if (next_branch) {
                        convert_tree(context, next_branch.body, body);
                    }
                } else {
                    add_action("_branch_ = \"" + node.content + "\"", body);
                }
            }
        } else if (node.type === "break") {
            if (!has_final(body)) {
                add_action("break", body, true);
            }
        } else if (node.type === "error") {
            add_action(
                "error(\"" + node.message + ": \" .. tostring(" + node.content + "))",
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

function create_function_node(doc) {
    return {
        type: "function",
        name: doc.name,
        args: doc.args || [],
        body: []
    };
}

function declare_variables(scope, body) {
    var locals;
    var declarations;
    var names;
    var i;
    var name;
    var content;

    if (!scope || !scope.declarations) {
        return;
    }

    locals = [];
    declarations = scope.declarations;
    names = Object.keys(declarations);

    for (i = 0; i < names.length; i += 1) {
        name = names[i];

        if (declarations[name] === "local") {
            locals.push(name);
        }
    }

    locals.sort();

    if (locals.length !== 0) {
        content = "local " + locals.join(", ");
        add_action(content, body);
    }
}

function drakon_to_tree(doc) {
    var tmp;
    var json;

    tmp = {
        items: doc.items
    };

    json = JSON.stringify(tmp);
    return global_options.toTree(json);
}

function find_branch(branches, name) {
    var i;
    var branch;

    for (i = 0; i < branches.length; i += 1) {
        branch = branches[i];

        if (branch.name === name) {
            return branch;
        }
    }

    return undefined;
}

function has_final(body) {
    var last;

    if (!body || body.length === 0) {
        return false;
    }

    last = body[body.length - 1];
    return !!last.final;
}

function is_final(item) {
    var statements;
    var last;

    statements = item.statements;

    if (statements && statements.length !== 0) {
        last = statements[statements.length - 1];

        if (last.type === "ReturnStatement") {
            return true;
        }

        if (
            last.type === "CallStatement" &&
            last.expression &&
            last.expression.type === "CallExpression" &&
            last.expression.base &&
            last.expression.base.type === "Identifier" &&
            last.expression.base.name === "error"
        ) {
            return true;
        }

        if (
            last.type === "CallExpression" &&
            last.callee &&
            last.callee.type === "Identifier" &&
            last.callee.name === "error"
        ) {
            return true;
        }

        return false;
    }

    if (typeof item.content === "string") {
        if (/^\s*return\b/.test(item.content)) {
            return true;
        }

        if (/^\s*error\s*\(/.test(item.content)) {
            return true;
        }
    }

    return false;
}

function is_simple_silhouette(raw_tree) {
    var i;
    var branch;
    var last;
    var node;

    for (i = 0; i < raw_tree.branches.length; i += 1) {
        branch = raw_tree.branches[i];

        if (branch.refs > 1) {
            return false;
        }
    }

    last = raw_tree.branches[raw_tree.branches.length - 1];

    if (last.body.length === 0) {
        return true;
    }

    if (last.body.length === 1) {
        node = last.body[0];
        return node.type === "action";
    }

    return false;
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
        return "not (" + operand + ")";
    }

    if (content.operator === "and") {
        left = qc(content.left);
        right = qc(content.right);
        return "(" + left + ") and (" + right + ")";
    }

    if (content.operator === "or") {
        left = qc(content.left);
        right = qc(content.right);
        return "(" + left + ") or (" + right + ")";
    }

    if (content.operator !== "equal") {
        report_error(
            "Unexpected case value",
            undefined,
            undefined,
            content.operator
        );
        return "";
    }

    return content.left + " == " + content.right;
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