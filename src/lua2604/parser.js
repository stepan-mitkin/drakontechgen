"use strict";

var error_list = [];
var global_options = undefined;
var next_id = 1;

function parse_items(doc, options) {
    error_list = [];
    global_options = options;
    next_id = 1;

    traverse_document_tree(doc, parse_items_in_document);

    if (error_list.length === 0) {
        process_assignments(doc, undefined);
    }

    return {
        errors: error_list
    };
}

function traverse_document_tree(doc, visitor) {
    var name = undefined;

    if (!doc) {
        return;
    }

    visitor(doc);

    if (!doc.members) {
        return;
    }

    for (name in doc.members) {
        if (name in doc.members) {
            traverse_document_tree(doc.members[name], visitor);
        }
    }
}

function add_signature(doc, item_id, item, state_id) {
    var expr = item.value;
    var message = undefined;
    var args = [];
    var argument = undefined;
    var arg_str = undefined;
    var message_info = undefined;
    var i = 0;

    if (
        !expr ||
        expr.type !== "CallExpression" ||
        !expr.base ||
        expr.base.type !== "Identifier"
    ) {
        report_error(
            "A function call expression is expected here",
            doc.path,
            item_id
        );
        return undefined;
    }

    message = expr.base.name;

    for (i = 0; i < expr.arguments.length; i++) {
        argument = expr.arguments[i];

        if (argument.type === "Identifier") {
            args.push(argument.name);
        } else {
            report_error(
                "Only identifiers are allowed in incoming messages",
                doc.path,
                item_id
            );
            return undefined;
        }
    }

    arg_str = args.join(",");

    if (message in doc.messages) {
        message_info = doc.messages[message];

        if (message_info.arg_str === arg_str) {
            message_info.states.push(state_id);
            message_info.items.push(item.one);
        } else {
            report_error(
                "Signature mismatch in incoming message",
                doc.path,
                item_id
            );
            return undefined;
        }
    } else {
        doc.messages[message] = {
            message: message,
            args: args,
            arg_str: arg_str,
            states: [state_id],
            items: [item.one]
        };
    }

    item.message = message;
    return message;
}

function can_declare(doc) {
    if (doc.type === "module") {
        return true;
    } else {
        if (doc.type === "class") {
            return true;
        } else {
            return false;
        }
    }
}

function create_identifier(name) {
    return {
        type: "Identifier",
        name: name
    };
}

function extract_expression(context) {
    var doc = context.doc;
    var item_id = context.item_id;
    var item = context.item;
    var var_name = undefined;
    var statements = undefined;

    if (item.value.type !== "Identifier") {
        var_name = generate_random_var_name();
        doc.scope.declarations[var_name] = "local";

        statements = parse_statements({
            doc: doc,
            item_id: item_id,
            item: item,
            content: var_name + " = " + item.content
        });

        insert_action_before(
            doc,
            item_id,
            var_name + " = " + item.content,
            statements
        );

        item.value = create_identifier(var_name);
        item.content = var_name;
    }
}

function find_cases(context) {
    var item = context.item;
    var current_case_id = item.one;
    var case_item = undefined;

    item.cases = [];

    while (true) {
        if (current_case_id) {
            case_item = context.doc.items[current_case_id];
            item.cases.push(current_case_id);
            current_case_id = case_item.two;
        } else {
            break;
        }
    }
}

function find_declaration(step, name) {
    var current = step;
    var role = undefined;

    while (true) {
        if (current) {
            role = current.scope.declarations[name];

            if (role) {
                return role;
            } else {
                current = current.parent;
            }
        } else {
            return undefined;
        }
    }
}

function find_loop_end(doc, item_id, item) {
    var depth = 1;
    var current_id = item.one;
    var current_item = undefined;

    while (true) {
        if (current_id) {
            current_item = doc.items[current_id];

            if (current_item.type === "loopbegin") {
                depth++;
            } else {
                if (current_item.type === "loopend") {
                    depth--;
                }
            }

            if (depth === 0) {
                return current_id;
            } else {
                current_id = current_item.one;
            }
        } else {
            report_error(
                "loop end icon not found",
                doc.path,
                item_id
            );
            return undefined;
        }
    }
}

function generate_random_var_name() {
    next_id++;
    return "_var" + next_id;
}

function get_messages_from_cases(doc, state_id, select) {
    var i = 0;
    var case_id = undefined;
    var item = undefined;

    for (i = 0; i < select.cases.length; i++) {
        case_id = select.cases[i];
        item = doc.items[case_id];

        add_signature(
            doc,
            case_id,
            item,
            state_id
        );
    }
}

function insert_action_before(doc, item_id, content, statements) {
    var new_item_id = undefined;
    var id = undefined;
    var other_item = undefined;
    var item = undefined;

    next_id++;
    new_item_id = item_id + "_" + next_id;

    for (id in doc.items) {
        if (id in doc.items) {
            other_item = doc.items[id];

            if (other_item.one === item_id) {
                other_item.one = new_item_id;
            }

            if (other_item.two === item_id) {
                other_item.two = new_item_id;
            }
        }
    }

    item = {
        type: "action",
        one: item_id,
        content: content,
        statements: statements
    };

    doc.items[new_item_id] = item;
}

function parse_arguments(doc) {
    var lines = undefined;
    var args = [];
    var i = 0;
    var arg = undefined;

    if (doc.params) {
        lines = doc.params.split(/\r?\n/);

        for (i = 0; i < lines.length; i++) {
            arg = lines[i].trim();

            if (arg !== "") {
                if (args.indexOf(arg) !== -1) {
                    report_error(
                        "Argument is not unique",
                        doc.path,
                        "params",
                        arg
                    );
                }

                args.push(arg);
            }
        }

        for (i = 0; i < args.length; i++) {
            doc.scope.declarations[args[i]] = "arg";
        }

        doc.args = args;
    } else {
        doc.args = [];
    }
}

function parse_item(doc, item_id, item) {
    var content = item.content || "";
    var context = {
        doc: doc,
        item_id: item_id,
        item: item,
        content: content
    };

    if (item.type === "action") {
        if (content !== "") {
            item.statements = parse_statements(context);
        }
    } else {
        if (item.type === "question") {
            if (content === "") {
                report_error(
                    "Icon cannot be empty",
                    doc.path,
                    item_id
                );
            } else {
                item.value = parse_value(context);
            }
        } else {
            if (item.type === "select") {
                parse_select(context);
            } else {
                if (item.type === "case") {
                    if (content === "") {
                        if (item.two) {
                            report_error(
                                "Icon cannot be empty",
                                doc.path,
                                item_id
                            );
                        }
                    } else {
                        item.value = parse_value(context);
                    }
                } else {
                    if (item.type === "loopbegin") {
                        if (content === "") {
                            report_error(
                                "Icon cannot be empty",
                                doc.path,
                                item_id
                            );
                        } else {
                            parse_loop(context);
                        }
                    } else {
                        if (item.type === "sinput") {
                            if (content === "") {
                                report_error(
                                    "Icon cannot be empty",
                                    doc.path,
                                    item_id
                                );
                            } else {
                                parse_sinput(context);
                            }
                        } else {
                            if (item.type === "branch") {
                                doc.branches.push(item_id);
                            }
                        }
                    }
                }
            }
        }
    }
}

function parse_items_in_document(doc) {
    var item_ids = undefined;
    var i = 0;
    var item_id = undefined;
    var item = undefined;

    doc.scope = {
        declarations: {},
        name: doc.name
    };

    doc.messages = {};
    doc.states = [];
    doc.branches = [];

    if (!doc.items) {
        doc.items = {};
    }

    if (!doc.members) {
        doc.members = {};
    }

    parse_arguments(doc);

    item_ids = Object.keys(doc.items);

    for (i = 0; i < item_ids.length; i++) {
        item_id = item_ids[i];
        item = doc.items[item_id];
        parse_item(doc, item_id, item);
    }

    read_cases(doc);
}

function parse_loop(context) {
    var doc = context.doc;
    var item_id = context.item_id;
    var item = context.item;
    var content = context.content;
    var parts = content.split(";");
    var left = undefined;
    var vars = undefined;
    var expression = undefined;
    var expression_context = undefined;
    var ast1 = undefined;
    var ast2 = undefined;
    var ast3 = undefined;
    var end_id = undefined;

    if (parts.length === 2) {
        left = parts[0].trim();
        expression = parts[1].trim();
        vars = left.split(",");

        if (vars.length === 1) {
            item.var1 = vars[0].trim();
            doc.scope.declarations[item.var1] = "loop";
            item.content = expression;
            item.subtype = "array";

            expression_context = {
                doc: doc,
                item_id: item_id,
                item: item,
                content: expression
            };

            item.value = parse_value(expression_context);
            extract_expression(expression_context);

            item.content = "for _, " + item.var1 + " in ipairs(" + item.content + ") do";
        } else {
            if (vars.length === 2) {
                item.var1 = vars[0].trim();
                doc.scope.declarations[item.var1] = "loop";
                item.var2 = vars[1].trim();
                doc.scope.declarations[item.var2] = "loop";

                item.content = expression;
                item.subtype = "map";

                expression_context = {
                    doc: doc,
                    item_id: item_id,
                    item: item,
                    content: expression
                };

                item.value = parse_value(expression_context);
                extract_expression(expression_context);

                item.content = "for " + item.var1 + ", " + item.var2 + " in pairs(" + item.content + ") do";
            } else {
                report_error(
                    "Bad format",
                    doc.path,
                    item_id
                );
            }
        }
    } else {
        if (parts.length === 3) {
            item.subtype = "for";

            ast1 = parse_statements({
                doc: doc,
                item_id: item_id,
                item: item,
                content: parts[0].trim()
            });

            ast2 = parse_value({
                doc: doc,
                item_id: item_id,
                item: item,
                content: parts[1].trim()
            });

            ast3 = parse_statements({
                doc: doc,
                item_id: item_id,
                item: item,
                content: parts[2].trim()
            });

            item.content = "while " + parts[1].trim() + " do";

            insert_action_before(
                doc,
                item_id,
                parts[0].trim(),
                ast1
            );

            end_id = find_loop_end(doc, item_id, item);

            if (end_id) {
                insert_action_before(
                    doc,
                    end_id,
                    parts[2].trim(),
                    ast3
                );
            }
        } else {
            report_error(
                "Bad format",
                doc.path,
                item_id
            );
        }
    }
}

function parse_lua(text) {
    return global_options.parseLua(text);
}

function parse_select(context) {
    var doc = context.doc;
    var item_id = context.item_id;
    var item = context.item;
    var content = context.content;

    if (content === "") {
        report_error(
            "Icon cannot be empty",
            doc.path,
            item_id
        );
    } else {
        item.value = parse_value(context);
        extract_expression(context);
        find_cases(context);

        if (content === "receive") {
            doc.states.push(item_id);
        }
    }
}

function parse_sinput(context) {
    var doc = context.doc;
    var item_id = context.item_id;
    var item = context.item;

    item.value = parse_value(context);

    if (add_signature(doc, item_id, item, item_id)) {
        doc.states.push(item_id);
    }
}

function parse_statements(context) {
    var wrapped = "function _wrap_() " + context.content + " end";
    var ast = undefined;

    try {
        ast = parse_lua(wrapped);
    } catch (ex) {
        report_error(
            get_error_message(ex),
            context.doc.path,
            context.item_id
        );
        return undefined;
    }

    return ast.body[0].body;
}

function parse_value(context) {
    var wrapped = undefined;
    var ast = undefined;

    wrapped = "x=" + context.content;

    try {
        ast = parse_lua(wrapped);
    } catch (ex) {
        report_error(
            get_error_message(ex),
            context.doc.path,
            context.item_id
        );
        return undefined;
    }

    return ast.body[0].init[0];
}

function process_assignment(step, item_id, assignment) {
    var i = 0;
    var item = undefined;
    var var_type = undefined;

    for (i = 0; i < assignment.variables.length; i++) {
        item = assignment.variables[i];

        if (item.type === "Identifier") {
            var_type = find_declaration(step, item.name);

            if (var_type) {
                if (var_type === "loop") {
                    report_error(
                        "Cannot assign to loop variable",
                        step.path,
                        item_id
                    );
                }
            } else {
                step.scope.declarations[item.name] = "local";
            }
        }
    }
}

function process_assignments(doc, parent) {
    var step = undefined;
    var item_id = undefined;
    var item = undefined;
    var member_name = undefined;
    var member = undefined;

    step = {
        parent: parent,
        scope: doc.scope,
        declares: can_declare(doc),
        path: doc.path
    };

    for (item_id in doc.items) {
        if (item_id in doc.items) {
            item = doc.items[item_id];

            if (item.type === "action" && item.statements) {
                scan_assignments(step, item_id, item);
            }
        }
    }

    for (member_name in doc.members) {
        if (member_name in doc.members) {
            member = doc.members[member_name];
            process_assignments(member, step);
        }
    }
}

function process_declaration(step, item_id, declaration) {
    var i = 0;
    var variable = undefined;

    if (step.declares) {
        for (i = 0; i < declaration.variables.length; i++) {
            variable = declaration.variables[i];

            if (variable.type === "Identifier") {
                step.scope.declarations[variable.name] = "declared";
            }
        }
    } else {
        report_error(
            "Variable declarations are not allowed in function body",
            step.path,
            item_id
        );
    }
}

function read_cases(doc) {
    var i = 0;
    var item_id = undefined;
    var item = undefined;

    for (i = 0; i < doc.states.length; i++) {
        item_id = doc.states[i];
        item = doc.items[item_id];

        if (item.type === "select") {
            get_messages_from_cases(
                doc,
                item_id,
                item
            );
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

function scan_assignments(step, item_id, item) {
    var i = 0;
    var statement = undefined;
    for (i = 0; i < item.statements.length; i++) {
        statement = item.statements[i];

        if (statement.type === "AssignmentStatement") {
            process_assignment(step, item_id, statement);
        } else {
            if (statement.type === "LocalStatement") {
                process_declaration(step, item_id, statement);
            }
        }
    }
}

function get_error_message(ex) {
    if (!ex) {
        return "Parse error";
    }

    if (ex.message) {
        return ex.message;
    }

    return String(ex);
}

module.exports = {
    parse_items: parse_items
};
