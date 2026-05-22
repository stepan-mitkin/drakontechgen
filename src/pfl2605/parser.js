"use strict";

var global_options = undefined;
var error_list = [];
var next_id = 1;

function is_declaration(item) {
    if ((item.type === "action" && item.content) &&
        item.content.startsWith("Перем ")) {
        return true;
    } else {
        return false;
    }
}

function parse_arguments(doc) {
    var lines;
    var args;
    var i;
    var line;
    var arg;
    var last;

    if (doc.params) {
        lines = doc.params.split(/\r?\n/);
        args = [];

        for (i = 0; i < lines.length; i++) {
            line = lines[i];
            arg = line.trim();

            if (arg !== "") {
                if (args.indexOf(arg) !== -1) {
                    report_error(
                        "Аргумент неуникальный",
                        doc.path,
                        "params",
                        arg
                    );
                }

                args.push(arg);
            }
        }

        if (args.length !== 0) {
            last = args[args.length - 1];

            if (last.startsWith("тип ")) {
                args.pop();
                doc.returns = last;
            }
        }

        doc.args = args;
    } else {
        doc.args = [];
    }
}

function parse_items(module, options) {
    var class_name;
    var klass;
    var method_name;
    var method;

    global_options = options;
    error_list = [];

    for (class_name in module.classes) {
        if (class_name in module.classes) {
            klass = module.classes[class_name];

            if (klass.constructor) {
                parse_items_in_document(klass.constructor);
            }

            for (method_name in klass.methods) {
                if (method_name in klass.methods) {
                    method = klass.methods[method_name];
                    parse_items_in_document(method);
                }
            }
        }
    }

    return {
        errors: error_list
    };
}

function parse_items_in_document(doc) {
    var item_id;
    var item;

    parse_arguments(doc);

    doc.declarations = [];

    if (!doc.items) {
        return;
    }

    for (item_id in doc.items) {
        if (item_id in doc.items) {
            item = doc.items[item_id];

            if (is_declaration(item)) {
                doc.declarations.push(item_id);
            } else {
                if (item.type === "end") {
                    item.type = "exit";
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

module.exports = {
    parse_items: parse_items
};