"use strict";

let error_list = [];
let global_options = undefined;
let next_id = 1;

async function parse_items(module, options) {
    error_list = [];
    global_options = options;

    for (const class_name in module.classes) {
        const clazz = module.classes[class_name];

        if (clazz.constructor !== undefined) {
            parse_items_in_document(clazz.constructor);
        }

        for (const method_name in clazz.methods) {
            const method = clazz.methods[method_name];
            parse_items_in_document(method);
        }
    }

    return {
        errors: error_list
    };
}

function parse_items_in_document(doc) {
    parse_arguments(doc);

    if (doc.items === undefined) {
        return;
    }

    for (const item_id in doc.items) {
        const item = doc.items[item_id];

        if (item.type === "end") {
            item.type = "exit";
        }
    }
}

function parse_arguments(doc) {
    split_params(doc);
}

function split_params(doc) {
    if (doc.params !== undefined && doc.params !== "") {
        const lines = split_lines(doc.params);
        const args = [];
        trim_and_filter(doc, lines, args);
    } else {
        doc.args = [];
    }
}

function trim_and_filter(doc, lines, args) {
    const seen = {};

    for (const line of lines) {
        const arg = line.trim();

        if (arg !== "") {
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

    parse_return_type(doc, args);
}

function parse_return_type(doc, args) {
    if (args.length !== 0) {
        const last = args[args.length - 1];

        if (last.startsWith("тип ")) {
            args.pop();
            doc.returns = last;
        }
    }

    doc.args = args;
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