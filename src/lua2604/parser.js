var global_options = undefined;
var error_list = [];
var next_id = 0;

function add_signature(doc, item_id, item, state_id) {
    var expr = item.value;
    var message;
    var args;
    var arg_str;
    var message_info;
    var i;
    var argument;

    if (expr && ((expr.type === "CallExpression" && expr.base) && expr.base.type === "Identifier")) {
        message = expr.base.name;
        args = [];

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
                return null;
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
    } else {
        report_error(
            "A function call expression is expected here",
            doc.path,
            item_id
        );
        return null;
    }
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
    var var_name;

    if (!(item.value.type === "Identifier")) {
        var_name = generate_random_var_name();
        doc.scope.declarations[var_name] = "local";

        insert_action_before(
            doc,
            item_id,
            var_name + " = " + item.content
        );

        item.value = create_identifier(var_name);
        item.content = var_name;
    }
}

function find_cases(context) {
    var item = context.item;
    var current_case_id = item.one;
    var case_item;

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
    var role;

    while (true) {
        if (current) {
            role = current.scope.declarations[name];

            if (role) {
                return role;
            } else {
                current = current.parent;
            }
        } else {
            return null;
        }
    }
}

function find_loop_end(doc, item_id, item) {
    var depth = 1;
    var current_id = item.one;
    var current_item;

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
            return null;
        }
    }
}

function generate_random_var_name() {
    next_id++;
    return "_var" + next_id;
}

function get_messages_from_cases(doc, state_id, select) {
    var i;
    var case_id;
    var item;

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
    var new_item_id;
    var id;
    var other_item;
    var item;

    next_id++;
    new_item_id = item_id + "_" + next_id;

    for (id in doc.items) {
        other_item = doc.items[id];

        if (other_item.one === item_id) {
            other_item.one = new_item_id;
        }

        if (other_item.two === item_id) {
            other_item.two = new_item_id;
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

function is_iter(content) {
    var parts;

    if (content && content.startsWith("fun.iter")) {
        return true;
    } else {
        if (content && content.endsWith(")")) {
            return false;
        } else {
            parts = content ? content.split(",") : [];

            if (parts.length > 1) {
                return true;
            } else {
                return false;
            }
        }
    }
}

function parse_arguments(doc) {
    var lines;
    var args;
    var i;
    var line;
    var arg;

    if (doc.params) {
        lines = doc.params.split(/\r?\n/);
        args = [];

        for (i = 0; i < lines.length; i++) {
            line = lines[i];
            arg = line.trim();

            if (!(arg === "")) {
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
            arg = args[i];
            doc.scope.declarations[arg] = "arg";
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
        if (!(content === "")) {
            item.statements = parse_statements(context);
        }
    } else if (item.type === "question") {
        if (content === "") {
            report_error("Icon cannot be empty", doc.path, item_id);
        } else {
            item.value = parse_value(context);
        }
    } else if (item.type === "select") {
        parse_select(context);
    } else if (item.type === "case") {
        if (content === "") {
            if (item.two) {
                report_error("Icon cannot be empty", doc.path, item_id);
            }
        } else {
            item.value = parse_value(context);
        }
    } else if (item.type === "loopbegin") {
        if (content === "") {
            report_error("Icon cannot be empty", doc.path, item_id);
        } else {
            parse_loop(context);
        }
    } else if (item.type === "sinput") {
        if (content === "") {
            report_error("Icon cannot be empty", doc.path, item_id);
        } else {
            parse_sinput(context);
        }
    } else if (item.type === "branch") {
        doc.branches.push(item_id);
    }
}

function parse_items(doc, options) {
    global_options = options;
    error_list = [];
    next_id = 0;

    traverse_document_tree(doc);

    if (error_list.length === 0) {
        process_assignments(
            doc,
            null
        );
    }

    return {
        errors: error_list
    };
}

function traverse_document_tree(doc) {
    var key;
    var member;

    parse_items_in_document(doc);

    if (doc.members) {
        for (key in doc.members) {
            member = doc.members[key];
            traverse_document_tree(member);
        }
    }
}

function parse_items_in_document(doc) {
    var item_ids;
    var i;
    var item_id;
    var item;

    doc.scope = {
        name: doc.name,
        declarations: {}
    };
    doc.messages = {};
    doc.states = [];
    doc.branches = [];

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

    if (parts.length === 2) {
        parse_iterator_loop(doc, item_id, item, parts);
    } else if (parts.length === 3) {
        parse_for_loop(doc, item_id, item, parts);
    } else {
        report_error(
            "Bad format",
            doc.path,
            item_id
        );
    }
}

function parse_iterator_loop(doc, item_id, item, parts) {
    var variables = parts[0].split(",");
    var expression = parts[1].trim();
    var collection;

    if (variables.length === 1) {
        item.var1 = variables[0].trim();
        doc.scope.declarations[item.var1] = "loop";
        item.content = expression;
        item.subtype = "array";
        item.value = parse_value({
            doc: doc,
            item_id: item_id,
            item: item,
            content: expression
        });

        if (is_iter(item.content)) {
            collection = item.content;
        } else {
            collection = "ipairs(" + item.content + ")";
        }

        item.content = "for _, " + item.var1 + " in " + collection + " do";
    } else if (variables.length === 2) {
        item.var1 = variables[0].trim();
        doc.scope.declarations[item.var1] = "loop";

        item.var2 = variables[1].trim();
        doc.scope.declarations[item.var2] = "loop";

        item.content = expression;
        item.subtype = "map";
        item.value = parse_value({
            doc: doc,
            item_id: item_id,
            item: item,
            content: expression
        });

        if (is_iter(item.content)) {
            collection = item.content;
        } else {
            collection = "pairs(" + item.content + ")";
        }

        item.content = "for " + item.var1 + ", " + item.var2 + " in " + collection + " do";
    } else {
        report_error(
            "Bad format",
            doc.path,
            item_id
        );
    }
}

function parse_for_loop(doc, item_id, item, parts) {
    var expression1 = parts[0].trim();
    var expression2 = parts[1].trim();
    var expression3 = parts[2].trim();
    var ast1;
    var ast2;
    var ast3;
    var end_id;

    item.subtype = "for";

    ast1 = parse_statements({
        doc: doc,
        item_id: item_id,
        item: item,
        content: expression1
    });

    ast2 = parse_value({
        doc: doc,
        item_id: item_id,
        item: item,
        content: expression2
    });

    ast3 = parse_statements({
        doc: doc,
        item_id: item_id,
        item: item,
        content: expression3
    });

    item.value = ast2;
    item.content = "while " + expression2 + " do";

    insert_action_before(
        doc,
        item_id,
        expression1,
        ast1
    );

    end_id = find_loop_end(doc, item_id, item);

    if (end_id) {
        insert_action_before(
            doc,
            end_id,
            expression3,
            ast3
        );
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
    var ast;

    try {
        ast = parse_lua(wrapped);
        return ast.body[0].body;
    } catch (error) {
        report_error(
            error.message,
            context.doc.path,
            context.item_id
        );
        return null;
    }
}

function parse_value(context) {
    var wrapped = "x=" + context.content;
    var ast;

    try {
        ast = parse_lua(wrapped);
        return ast.body[0].init[0];
    } catch (error) {
        report_error(
            error.message,
            context.doc.path,
            context.item_id
        );
        return null;
    }
}

function process_assignment(step, item_id, assignment) {
    var i;
    var item;
    var var_type;

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
    var step;
    var item_id;
    var item;
    var key;
    var member;

    step = {
        parent: parent,
        scope: doc.scope,
        declares: can_declare(doc),
        path: doc.path
    };

    for (item_id in doc.items) {
        item = doc.items[item_id];

        if (item.type === "action" && item.statements) {
            scan_assignments(step, item_id, item);
        }
    }

    if (doc.members) {
        for (key in doc.members) {
            member = doc.members[key];
            process_assignments(member, step);
        }
    }
}

function process_declaration(step, item_id, declaration) {
    var i;
    var variable;
    var name;

    if (step.declares) {
        for (i = 0; i < declaration.variables.length; i++) {
            variable = declaration.variables[i];

            if (typeof variable === "string") {
                name = variable;
            } else {
                name = variable.name;
            }

            step.scope.declarations[name] = "declared";
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
    var i;
    var item_id;
    var item;

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
    var i;
    var statement;

    for (i = 0; i < item.statements.length; i++) {
        statement = item.statements[i];

        if (statement.type === "AssignmentStatement") {
            process_assignment(step, item_id, statement);
        } else if (statement.type === "LocalStatement") {
            process_declaration(step, item_id, statement);
        }
    }
}

module.exports = {
    parse_items: parse_items
};