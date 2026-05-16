"use strict";

var global_options = undefined;
var error_list = [];

function add_action(content, body, final) {
    var item;

    item = {
        type: "action",
        content: content,
        final: final || false
    };

    body.push(item);
}

function add_class_exports(exported, body) {
    var name;

    add_empty_line(body);

    for (name of exported) {
        add_action(
            "self." + name + " = " + name,
            body
        );
    }

    add_action(
        "return self",
        body
    );
}

function add_empty_line(body) {
    var item;

    item = {
        type: "empty-line"
    };

    body.push(item);
}

function add_module_exports(exported, body) {
    var lines;
    var name;
    var export_body;
    var content;

    add_empty_line(body);

    lines = [];
    for (name of exported) {
        lines.push("    " + name + " = " + name);
    }

    export_body = lines.join(",\n");
    content = "return {\n" + export_body + "\n}";

    add_action(
        content,
        body
    );
}

function add_self(doc, fun_node) {
    var content;

    content = "local self = {_type=\"" + doc.name + "\"}";
    add_action(content, fun_node.body);
}

function add_subfunction(doc, entry_id, body, start_state) {
    var sub;
    var raw_tree;
    var first;
    var context;

    sub = build_subfunction(
        doc,
        entry_id,
        start_state
    );

    if (!(error_list.length === 0)) {
        return;
    }

    raw_tree = drakon_to_tree(
        sub,
        true
    );

    if (raw_tree.branches.length === 1) {
        first = raw_tree.branches[0];

        context = {
            doc: sub,
            simple: true,
            branches: raw_tree.branches,
            state_var: "me.state"
        };

        convert_tree(
            context,
            first.body,
            body
        );
    } else {
        context = {
            doc: sub,
            simple: false,
            branches: raw_tree.branches,
            state_var: "me.state"
        };

        complex_silhouette_to_tree(
            context,
            body
        );
    }
}

function build_function_tree(doc) {
    var fun_node;
    var names;
    var name;
    var exported;
    var member;
    var member_node;

    fun_node = create_function_node(doc);

    names = Object.keys(doc.members);
    names.sort();

    if (is_machine(doc)) {
        build_machine(
            doc,
            fun_node
        );
    } else {
        build_normal_function(
            doc,
            fun_node
        );
    }

    exported = [];

    for (name of names) {
        member = doc.members[name];

        if (member.keywords.export) {
            exported.push(name);
        }

        member_node = build_function_tree(member);
        fun_node.body.push(member_node);
    }

    if (doc.type === "class") {
        add_class_exports(exported, fun_node.body);
    } else {
        if (doc.type === "module") {
            add_module_exports(exported, fun_node.body);
        }
    }

    return fun_node;
}

function build_machine(doc, fun_node) {
    var first_id;
    var me_node;
    var run;
    var error_node;
    var state_check;
    var set_state_node;
    var messages;
    var message;
    var message_method;
    var stop_node;
    var return_node;

    first_id = find_first_node(doc);

    declare_variables(
        doc.scope,
        fun_node.body
    );

    me_node = {
        type: "action",
        content: "local me = {state = \"created\", _buzy = true}"
    };

    fun_node.body.push(me_node);

    run = create_function(
        "run",
        [],
        "me"
    );

    error_node = {
        type: "action",
        content: "error(\"run() can be called only once\")"
    };

    state_check = {
        type: "question",
        content: "me.state ~= \"created\"",
        yes: [error_node],
        no: []
    };

    run.body.push(state_check);

    set_state_node = {
        type: "action",
        content: "me.state = \"" + first_id + "\""
    };

    run.body.push(set_state_node);

    add_subfunction(
        doc,
        first_id,
        run.body,
        first_id
    );

    fun_node.body.push(run);

    messages = Object.keys(doc.messages);
    messages.sort();

    for (message of messages) {
        message_method = build_message_method(
            doc,
            message
        );

        fun_node.body.push(message_method);
    }

    stop_node = {
        type: "action",
        content: "me.stop = function() me.state = nil end"
    };

    fun_node.body.push(stop_node);

    return_node = {
        type: "action",
        content: "return me"
    };

    fun_node.body.push(return_node);
}

function build_message_method(doc, message) {
    var message_info;
    var method;
    var error_node;
    var state_check;
    var switch_node;
    var index;
    var state_id;
    var entry_id;
    var option;
    var reset_state;

    message_info = doc.messages[message];

    method = create_function(
        message,
        message_info.args,
        "me"
    );

    error_node = {
        type: "action",
        content: "error(\"Synchronous reentry is not allowed\")"
    };

    state_check = {
        type: "question",
        content: "me._buzy",
        yes: [error_node],
        no: []
    };

    method.body.push(state_check);

    switch_node = {
        type: "if-switch",
        options: [],
        other: []
    };

    method.body.push(switch_node);

    for (index = 0; index < message_info.states.length; index++) {
        state_id = message_info.states[index];
        entry_id = message_info.items[index];

        option = {
            type: "option",
            condition: "me.state == \"" + state_id + "\"",
            body: []
        };

        reset_state = {
            type: "action",
            content: "me._buzy = true"
        };

        option.body.push(reset_state);

        add_subfunction(
            doc,
            entry_id,
            option.body,
            state_id
        );

        switch_node.options.push(option);
    }

    return method;
}

function build_module_tree(module, options) {
    var tree;

    global_options = options;
    error_list = [];

    tree = build_function_tree(module);

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

function build_normal_function(doc, fun_node) {
    var raw_tree;
    var first;
    var context;

    raw_tree = drakon_to_tree(
        doc,
        false
    );

    if (doc.type === "class") {
        add_self(doc, fun_node);
    }

    if (raw_tree.branches.length === 0) {
        return;
    }

    first = raw_tree.branches[0];

    if (raw_tree.branches.length === 1) {
        declare_variables(
            doc.scope,
            fun_node.body
        );

        context = {
            doc: doc,
            simple: true
        };

        convert_tree(
            context,
            first.body,
            fun_node.body
        );
    } else {
        if (is_simple_silhouette(raw_tree)) {
            declare_variables(
                doc.scope,
                fun_node.body
            );

            context = {
                doc: doc,
                simple: true,
                branches: raw_tree.branches
            };

            convert_tree(
                context,
                first.body,
                fun_node.body
            );
        } else {
            doc.scope.declarations["_branch_"] = "local";

            declare_variables(
                doc.scope,
                fun_node.body
            );

            add_action("_branch_ = \"" + first.name + "\"", fun_node.body);

            context = {
                doc: doc,
                simple: false,
                branches: raw_tree.branches,
                state_var: "_branch_"
            };

            complex_silhouette_to_tree(context, fun_node.body);
        }
    }
}

function build_subfunction(doc, entry_id, start_state) {
    var subfunction;
    var context;

    subfunction = {
        name: doc.name,
        path: doc.path,
        items: {}
    };

    context = {
        doc: doc,
        input: doc.items,
        output: subfunction.items
    };

    traverse_graph(
        context,
        entry_id,
        copy_subfunction_node
    );

    subfunction.items["sub-start"] = {
        type: "branch",
        branchId: 0,
        content: start_state,
        one: entry_id
    };

    return subfunction;
}

function complex_silhouette_to_tree(context, body) {
    var state_var = context.state_var;
    var loop;
    var switch_item;
    var i;
    var branch;
    var condition;
    var option;

    loop = {
        type: "loop",
        content: "while true do",
        body: []
    };
    body.push(loop);

    switch_item = {
        type: "if-switch",
        options: [],
        other: []
    };
    loop.body.push(switch_item);

    for (i = 0; i < context.branches.length; i++) {
        branch = context.branches[i];
        condition = state_var + " == \"" + branch.name + "\"";

        option = {
            type: "option",
            condition: condition,
            body: []
        };
        switch_item.options.push(option);

        add_action(state_var + " = nil", option.body, false);
        convert_tree(context, branch.body, option.body);
    }

    add_action("return", switch_item.other, true);
}

function convert_tree(context, nodes, body) {
    for (var node of nodes) {
        if (node.type === "action") {
            var content = node.content;
            var final = is_final(context.doc, node);
            var item = {
                content: content,
                type: node.type,
                final: final
            };
            body.push(item);
        } else {
            if (node.type === "exit") {
                var item = {
                    type: node.type,
                    final: true
                };
                body.push(item);
            } else {
                if (node.type === "event") {
                    var state_id = node.content;
                    var content = "me.state = \"" + state_id + "\"\nme._buzy = false\nreturn";
                    var final = true;
                    var item = {
                        content: content,
                        type: "action",
                        final: final
                    };
                    body.push(item);
                } else {
                    if (node.type === "question") {
                        var content = qc(node.content);
                        var item = {
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
                            var content = node.content || "while true do";
                            var item = {
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
                                        var next_branch = undefined;
                                        for (var branch of context.branches) {
                                            if (branch.name === node.content) {
                                                next_branch = branch;
                                                break;
                                            }
                                        }
                                        convert_tree(context, next_branch.body, body);
                                    } else {
                                        add_action(context.state_var + " = \"" + node.content + "\"", body);
                                    }
                                }
                            } else {
                                if (node.type === "break") {
                                    if (!has_final(body)) {
                                        add_action("break", body, true);
                                    }
                                } else {
                                    if (node.type === "error") {
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
                        }
                    }
                }
            }
        }
    }
}

function copy_subfunction_node(context, node_id, node) {
    if (node.type === "sinput" || (node.type === "select" && node.content === "receive")) {
        context.output[node_id] = {
            type: "event",
            content: node_id,
            final: true
        };
        return false;
    } else {
        if (node.type === "arrow-loop" || node.type === "loopbegin") {
            report_error(
                "This item is not allowed in a state machine",
                context.doc.path,
                node_id
            );
            return false;
        } else {
            if (node.type === "end") {
                context.output[node_id] = {
                    type: "exit",
                    final: false
                };
                return false;
            } else {
                context.output[node_id] = node;
                return true;
            }
        }
    }
}

function create_function(name, args, self_name) {
    return {
        type: "function",
        name: name,
        args: args,
        self_name: self_name,
        body: []
    };
}

function create_function_node(doc) {
    return {
        type: "function",
        name: doc.name,
        args: doc.args,
        body: []
    };
}

function declare_variables(scope, body) {
    var locals;
    var name;
    var type;
    var content;

    locals = [];

    for (name in scope.declarations) {
        type = scope.declarations[name];

        if (type === "local") {
            locals.push(name);
        }
    }

    if (locals.length !== 0) {
        locals.sort();
        content = "local " + locals.join(", ");
        add_action(content, body);
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

function find_first_node(doc) {
    var branches;
    var item_id;
    var branch;
    var first;

    branches = [];

    for (item_id of doc.branches) {
        branch = doc.items[item_id];
        branches.push(branch);
    }

    branches.sort(function (left, right) {
        return left.branchId - right.branchId;
    });

    first = branches[0];
    return first.one;
}

function has_final(body) {
    var last;

    if (body.length === 0) {
        return false;
    } else {
        last = body[body.length - 1];
        return last.final;
    }
}

function is_final(doc, node) {
    var item;
    var last;

    if (node.id) {
        item = doc.items[node.id];

        if (item.statements && item.statements.length !== 0) {
            last = item.statements[item.statements.length - 1];

            if (last.type === "ReturnStatement") {
                return true;
            } else {
                if (
                    last.type === "CallStatement" &&
                    last.expression.type === "CallExpression" &&
                    last.expression.base.type === "Identifier" &&
                    last.expression.base.name === "error"
                ) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function is_machine(doc) {
    if (doc.states.length === 0) {
        return false;
    } else {
        return true;
    }
}

function is_simple_silhouette(raw_tree) {
    var first_branch = raw_tree.branches[0];

    if (first_branch.refs > 0) {
        return false;
    }

    for (var i = 0; i < raw_tree.branches.length; i++) {
        var branch = raw_tree.branches[i];
        var is_last = i === raw_tree.branches.length - 1;

        if (branch.refs > 1) {
            if (!is_last) {
                return false;
            } else {
                if (branch.body.length > 1) {
                    return false;
                }
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
            return "not (" + operand + ")";
        } else {
            if (content.operator === "and") {
                left = qc(content.left);
                right = qc(content.right);
                return "(" + left + ") and (" + right + ")";
            } else {
                if (content.operator === "or") {
                    left = qc(content.left);
                    right = qc(content.right);
                    return "(" + left + ") or (" + right + ")";
                } else {
                    if (content.operator !== "equal") {
                        throw new Error("Unexpected case value: " + content.operator);
                    }

                    left = qc(content.left);
                    right = qc(content.right);
                    return left + " == " + right;
                }
            }
        }
    }
}

function report_error(message, handle, item_id, data) {
    error_list.push({
        message: message,
        filename: handle,
        nodeId: item_id,
        data: data
    });
}

function find_branch(branches, name) {
    var branch;

    for (branch of branches) {
        if (branch.name === name) {
            return branch;
        }
    }

    return undefined;
}

function traverse_graph(context, first_node_id, visitor) {
    var visited;

    visited = {};
    traverse_graph_node(context, first_node_id, visitor, visited);
}

function traverse_graph_node(context, node_id, visitor, visited) {
    var node;
    var should_continue;

    if (node_id === undefined || node_id === null) {
        return;
    }

    if (node_id in visited) {
        return;
    }

    visited[node_id] = true;

    node = context.input[node_id];
    if (!node) {
        return;
    }

    should_continue = visitor(context, node_id, node);

    if (should_continue === false) {
        return;
    }

    traverse_graph_node(context, node.one, visitor, visited);
    traverse_graph_node(context, node.two, visitor, visited);
}

module.exports = {
    build_module_tree: build_module_tree
};