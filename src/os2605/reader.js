"use strict";

var error_list = [];
var global_options = undefined;

async function add_function(module, function_doc) {
    if (function_doc.name in module.functions) {
        report_error(
            "Имя функции неуникально",
            function_doc.path,
            undefined,
            undefined
        );
    } else {
        module.functions[function_doc.name] = function_doc;
    }
}

async function read_children(node) {
    var result;
    var i;
    var child_path;
    var child;

    if (node.children) {
        result = [];

        for (i = 0; i < node.children.length; i++) {
            child_path = node.children[i];
            child = await read_object(child_path);

            if (child && (child.type === "drakon" || child.type === "folder")) {
                result.push(child);
            }
        }

        return result;
    } else {
        return [];
    }
}

async function read_object(handle) {
    var node;

    node = await global_options.getObjectByHandle(handle);

    if (node && node.type === "drakon") {
        if (!node.keywords) {
            node.keywords = {};
        }

        if (!node.items) {
            node.items = {};
        }
    }

    return node;
}

async function read_project(options) {
    var root_folder;
    var module;

    error_list = [];
    global_options = options;

    root_folder = await read_object(global_options.root);

    module = {
        header: undefined,
        body: undefined,
        functions: {}
    };

    await read_project_folder(module, root_folder);

    if (error_list.length === 0) {
        return {
            module: module
        };
    } else {
        return {
            errors: error_list
        };
    }
}

async function read_project_folder(module, folder) {
    var children;
    var i;
    var child;

    children = await read_children(folder);

    for (i = 0; i < children.length; i++) {
        child = children[i];

        if (child.name === "Заголовок") {
            set_header(module, child);
        } else if (child.name === "Тело") {
            set_body(module, child);
        } else if (child.type === "folder") {
            await read_project_folder(module, child);
        } else {
            await add_function(module, child);
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

function set_body(module, folder) {
    if (module.body) {
        report_error(
            "Тело уже есть",
            folder.path,
            undefined,
            undefined
        );
    } else {
        module.body = folder;
    }
}

function set_header(module, folder) {
    if (module.header) {
        report_error(
            "Заголовок уже есть",
            folder.path,
            undefined,
            undefined
        );
    } else {
        module.header = folder;
    }
}

module.exports = {
    read_project: read_project
};