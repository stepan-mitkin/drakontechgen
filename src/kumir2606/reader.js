"use strict";

var error_list = [];
var global_options = undefined;

async function read_project(options) {
    global_options = options;
    error_list = [];

    var root_folder = await read_object(global_options.root);
    var module = create_module();

    if (root_folder) {
        await read_project_folder(module, root_folder);
    }

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

function create_module() {
    return {
        header: undefined,
        body: undefined,
        functions: {}
    };
}

function add_function(module, func) {
    if (func.name in module.functions) {
        report_error(
            "Имя функции неуникально",
            func.path,
            undefined,
            undefined
        );
    } else {
        module.functions[func.name] = func;
    }
}

async function read_children(node) {
    var result;
    var child_path;
    var child;
    var i;

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

async function read_project_folder(module, folder) {
    var children;
    var child;
    var i;

    children = await read_children(folder);

    for (i = 0; i < children.length; i++) {
        child = children[i];

        if (child.type === "folder") {
            await read_project_folder(module, child);
        } else {
            add_function(
                module,
                child
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

module.exports = {
    read_project: read_project
};