"use strict";

var error_list = [];
var global_options = undefined;

function is_return(item) {
    var content;
    var parts;

    if (item.type === "action" && item.content) {
        content = item.content.trim();
        parts = content.split(" ");

        if (parts.length > 1 && parts[0].toLowerCase() === "возврат") {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function parse_arguments(doc) {
    var lines;
    var args;
    var arg_set;
    var i;
    var arg;

    if (doc.params) {
        lines = doc.params.split(/\r\n|\n|\r/);
        args = [];
        arg_set = {};

        for (i = 0; i < lines.length; i++) {
            arg = lines[i].trim();

            if (arg !== "") {
                if (arg in arg_set) {
                    report_error(
                        "Аргумент неуникальный",
                        doc.path,
                        "params",
                        arg
                    );
                }

                arg_set[arg] = true;
                args.push(arg);
            }
        }

        doc.args = args;
    } else {
        doc.args = [];
    }
}

function parse_items(module, options) {
    var name;
    var fun;

    error_list = [];
    global_options = options;

    for (name in module.functions) {
        fun = module.functions[name];
        parse_items_in_document(fun);
    }

    return {
        errors: error_list
    };
}

function parse_items_in_document(doc) {
    var item_id;
    var item;

    parse_arguments(doc);

    doc.returnsValue = false;

    for (item_id in doc.items) {
        item = doc.items[item_id];

        if (is_return(item)) {
            doc.returnsValue = true;
        } else {
            if (item.type === "end") {
                item.type = "exit";
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
