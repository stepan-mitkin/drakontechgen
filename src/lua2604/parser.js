"use strict";

var error_list = [];
var global_options = undefined;
var next_id = 1;

function create_identifier(name) {
    return {
        type: "identifier",
        name: name
    };
}

function create_scope(name) {
    return {
        declarations: {},
        name: name
    };
}

function report_error(message, handle, item_id, data) {
    error_list.push({
        message: message,
        filename: handle,
        nodeId: item_id,
        data: data
    });
}
function generate_random_var_name() {
    next_id++;
    return "_var" + next_id;
}

function parse_lua(text) {
    if (global_options.parseLua) {
        return global_options.parseLua(text);
    }
    return global_options.parse(text);
}

function parse_statements(context) {
    var wrapped;
    var ast;
    var func;

    try {
        wrapped = "function _wrap_() " + context.content + " end";
        ast = parse_lua(wrapped);
        func = ast.body[0];
        return func.body;
    } catch (ex) {
        report_error(
            ex.message || String(ex),
            context.doc.path,
            context.item_id
        );
        return undefined;
    }
}

function parse_value(context) {
    var wrapped;
    var ast;

    try {
        wrapped = "x=" + context.content;
        ast = parse_lua(wrapped);
        return ast.body[0].init[0];
    } catch (ex) {
        report_error(
            ex.message || String(ex),
            context.doc.path,
            context.item_id
        );
        return undefined;
    }
}

function insert_action_before(doc, item_id, content) {
    var new_item_id;
    var id;
    var other_item;
    var item;
    var context;

    next_id++;
    new_item_id = item_id + "_" + next_id;

    for (id in doc.items) {
        if (Object.prototype.hasOwnProperty.call(doc.items, id)) {
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
        content: content
    };

    doc.items[new_item_id] = item;
}

function extract_expression(context) {
    var doc;
    var item_id;
    var item;
    var var_name;

    doc = context.doc;
    item_id = context.item_id;
    item = context.item;

    if (!item.value || item.value.type !== "Identifier") {
        var_name = generate_random_var_name();

        insert_action_before(
            doc,
            item_id,
            var_name + " = " + item.collection
        );

        item.value = create_identifier(var_name);
        item.content = var_name;
    }
}

function find_cases(context) {
    var current_case_id;
    var case_item;

    context.item.cases = [];
    current_case_id = context.item.one;

    while (true) {
        if (current_case_id) {
            case_item = context.doc.items[current_case_id];
            context.item.cases.push(current_case_id);
            current_case_id = case_item.two;
        } else {
            break;
        }
    }
}

function find_declaration(step, name) {
    var current;
    var role;

    current = step;

    while (true) {
        if (current) {
            role = current.scope.declarations[name];

            if (role) {
                return role;
            }

            current = current.parent;
        } else {
            return undefined;
        }
    }
}

function find_loop_end(doc, item, item_id) {
    var depth;
    var current_id;
    var current_item;

    depth = 1;
    current_id = item.one;

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
            }

            current_id = current_item.one;
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

function parse_arguments(doc) {
    var lines;
    var args;
    var i;
    var line;
    var arg;
    var seen;

    if (doc.params) {
        lines = doc.params.split(/\r\n|\n|\r/);
        args = [];
        seen = {};

        for (i = 0; i < lines.length; i++) {
            line = lines[i];
            arg = line.trim();

            if (arg !== "") {
                if (seen[arg]) {
                    report_error(
                        "Argument is not unique",
                        doc.path,
                        "params",
                        arg
                    );
                }

                seen[arg] = true;
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

function parse_select(context) {
    if (context.content === "") {
        report_error(
            "Icon cannot be empty",
            context.doc.path,
            context.item_id
        );
    } else {
        context.item.collection = context.content;
        context.item.value = parse_value(context);
        extract_expression(context);
        find_cases(context);
    }
}

function parse_loop(context) {
    var doc;
    var item_id;
    var item;
    var content;
    var parts;
    var first;
    var second;
    var third;
    var vars;
    var end_id;

    doc = context.doc;
    item_id = context.item_id;
    item = context.item;
    content = context.content;

    parts = content.split(";");

    if (parts.length === 2) {
        vars = parts[0].split(",");

        if (vars.length === 1) {
            item.var1 = vars[0].trim();
            doc.scope.declarations[item.var1] = "loop";

            item.collection = parts[1].trim();
            item.subtype = "array";

            context.content = item.collection;
            item.value = parse_value(context);
            item.content = item.collection;

            extract_expression(context);

            item.content = "for _, " + item.var1 + " in ipairs(" + item.content + ") do";
            return;
        }

        if (vars.length === 2) {
            item.var1 = vars[0].trim();
            item.var2 = vars[1].trim();

            doc.scope.declarations[item.var1] = "loop";
            doc.scope.declarations[item.var2] = "loop";

            item.collection = parts[1].trim();
            item.subtype = "map";

            context.content = item.collection;
            item.value = parse_value(context);
            item.content = item.collection;

            extract_expression(context);

            item.content = "for " + item.var1 + ", " + item.var2 + " in pairs(" + item.content + ") do";
            return;
        }
    }

    if (parts.length === 3) {
        first = parts[0].trim();
        second = parts[1].trim();
        third = parts[2].trim();

        item.expr1 = first;
        item.expr2 = second;
        item.expr3 = third;
        item.subtype = "for";

        item.ast1 = parse_statements({
            doc: doc,
            item_id: item_id,
            item: item,
            content: first
        });

        item.ast2 = parse_value({
            doc: doc,
            item_id: item_id,
            item: item,
            content: second
        });

        item.ast3 = parse_statements({
            doc: doc,
            item_id: item_id,
            item: item,
            content: third
        });

        item.content = "while " + second + " do";

        insert_action_before(
            doc,
            item_id,
            first
        );

        end_id = find_loop_end(doc, item, item_id);

        if (end_id) {
            insert_action_before(
                doc,
                end_id,
                third
            );
        }

        return;
    }

    report_error(
        "Bad format",
        doc.path,
        item_id
    );
}

function parse_item(doc, item_id, item) {
    var content;
    var context;

    content = item.content || "";

    context = {
        doc: doc,
        item_id: item_id,
        item: item,
        content: content
    };

    if (item.type === "action") {
        if (content !== "") {
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
    }
}

function parse_items_in_document(doc) {
    var item_ids;
    var i;
    var item_id;
    var item;

    doc.scope = create_scope(doc.name);

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
}

function traverse_document_tree(doc, visitor) {
    var name;
    var child;

    visitor(doc);

    if (!doc.members) {
        return;
    }

    for (name in doc.members) {
        if (Object.prototype.hasOwnProperty.call(doc.members, name)) {
            child = doc.members[name];
            traverse_document_tree(child, visitor);
        }
    }
}

function process_assignment(step, item_id, assignment) {
    var i;
    var item;
    var var_type;

    for (i = 0; i < assignment.variables.length; i++) {
        item = assignment.variables[i];

        if (item.type === "identifier" || item.type === "Identifier") {
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

function process_declaration(step, item_id, declaration) {
    var i;
    var variable;

    if (step.declares) {
        for (i = 0; i < declaration.variables.length; i++) {
            variable = declaration.variables[i];

            if (typeof variable === "string") {
                step.scope.declarations[variable] = "declared";
            } else {
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

function can_declare(doc) {
    if (doc.type === "module") {
        return true;
    } else if (doc.type === "class") {
        return true;
    } else {
        return false;
    }
}

function process_assignments(doc, parent) {
    var step;
    var item_ids;
    var i;
    var item_id;
    var item;
    var names;
    var name;
    var member;

    step = {
        parent: parent,
        scope: doc.scope,
        declares: can_declare(doc),
        path: doc.path
    };

    item_ids = Object.keys(doc.items || {});

    for (i = 0; i < item_ids.length; i += 1) {
        item_id = item_ids[i];
        item = doc.items[item_id];

        if (item.type === "action" && item.statements) {
            scan_assignments(step, item_id, item);
        }
    }

    names = Object.keys(doc.members || {});
    names.sort();

    for (i = 0; i < names.length; i += 1) {
        name = names[i];
        member = doc.members[name];
        process_assignments(member, step);
    }
}

function parse_items(doc, options) {
    error_list = [];
    global_options = options;

    traverse_document_tree(doc, parse_items_in_document);

    if (error_list.length === 0) {
        process_assignments(
            doc,
            undefined
        );
    }

    return {
        errors: error_list
    };
}

module.exports = {
    parse_items: parse_items
};