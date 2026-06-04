"use strict";

var error_list = [];
var global_options = undefined;

function parse_items(module, options) {
    var name;
    var fun;

    global_options = options;
    error_list = [];

    for (name in module.functions) {
        fun = module.functions[name];
        parse_items_in_document(fun);
    }

    return {
        errors: error_list
    };
}

function parse_arguments(doc) {
    var lines;
    var args;
    var line;
    var arg;
    var parts;
    var i;
    var arg_set;

    if (doc.params) {
        lines = doc.params.split(/\r\n|\n|\r/);
    } else {
        lines = [];
    }

    args = [];
    arg_set = {};

    for (i = 0; i < lines.length; i++) {
        line = lines[i];
        arg = line.trim();

        if (arg) {
            if (arg.startsWith("знач ")) {
                if (doc.returns) {
                    report_error(
                        "Тип возвращаемого значения уже определен",
                        doc.path,
                        "params",
                        arg
                    );
                } else {
                    parts = arg.split(" ");
                    doc.returns = parts[1].trim();
                }
            } else {
                if (arg in arg_set) {
                    report_error(
                        "Аргумент неуникальный",
                        doc.path,
                        "params",
                        arg
                    );
                }

                args.push(arg);
                arg_set[arg] = true;
            }
        }
    }

    doc.args = args;
}

function parse_items_in_document(doc) {
    var item_id;
    var item;

    parse_arguments(doc);

    for (item_id in doc.items) {
        item = doc.items[item_id];

        if (item.type === "end") {
            item.type = "exit";
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