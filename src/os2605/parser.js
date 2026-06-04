"use strict";

let error_list = [];
let global_options = undefined;

function parse_items(module, options) {
    error_list = [];
    global_options = options;

    for (const fun_name in module.functions) {
        const fun = module.functions[fun_name];
        parse_items_in_document(fun);
    }

    return {
        errors: error_list
    };
}

function parse_items_in_document(doc) {
    parse_arguments(doc);

    doc.returnsValue = false;

    if (doc.items === undefined) {
        return;
    }

    for (const item_id in doc.items) {
        const item = doc.items[item_id];

        if (is_return(item)) {
            doc.returnsValue = true;
        } else if (item.type === "end") {
            item.type = "exit";
        }
    }
}

function is_return(item) {
    if (item.type === "action" && item.content !== undefined) {
        const content = item.content.trim();
        const parts = content.split(" ");

        if (parts.length > 1 && parts[0].toLowerCase() === "возврат") {
            return true;
        }

        return false;
    }

    return false;
}

function parse_arguments(doc) {
    const lines = split_params(doc);
    const decorations = [];
    const args = [];

    trim_and_filter(doc, lines, decorations, args);
}

function split_params(doc) {
    if (doc.params !== undefined && doc.params !== "") {
        return split_lines(doc.params);
    }

    return [];
}

function trim_and_filter(doc, lines, decorations, args) {
    const seen = {};

    for (const line of lines) {
        const arg = line.trim();

        if (arg !== "") {
            if (arg.startsWith("&")) {
                decorations.push(arg);
            } else {
                if (arg in seen) {
                    report_error(
                        "Аргумент неуникальный",
                        doc.path,
                        "params",
                        arg
                    );
                }

                seen[arg] = true;
                args.push(arg);
            }
        }
    }

    doc.args = args;
    doc.decorations = decorations;
}

function split_lines(text) {
    return text.split(/\r\n|\n|\r/);
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