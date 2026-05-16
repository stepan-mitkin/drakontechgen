var error_list = [];
var global_options = undefined;
var next_id = 1;

async function read_project(options) {
    var root_folder;
    var children;
    var module;
    var other_children;
    var i;
    var child;

    error_list = [];
    global_options = options;

    root_folder = await read_object(global_options.root);
    children = await read_children(root_folder);

    module = find_by_name(children, "module");

    if (!module) {
        module = create_document("module", "drakon");
    }

    module.type = "module";
    initialize_document(module);

    other_children = filter_name_not(children, "module");

    for (i = 0; i < other_children.length; i += 1) {
        child = other_children[i];

        if (child.name === "class") {
            report_error(
                "class is not expected here",
                child.path,
                undefined,
                undefined
            );
        } else {
            if (child.type === "folder") {
                await read_folder(module, child);
            } else {
                add_document(module, child);
            }
        }
    }

    if (error_list.length === 0) {
        return {
            module: module
        };
    }

    return {
        errors: error_list
    };
}

function create_document(name, type) {
    var document;

    document = {};
    document.name = name;
    document.type = type;
    document.path = "created-" + next_id;
    next_id += 1;

    document.items = {};
    document.keywords = {};
    document.params = undefined;
    document.parent = undefined;
    document.members = {};
    document.scope = undefined;
    document.args = [];

    return document;
}

function initialize_document(document) {
    if (!document.items) {
        document.items = {};
    }

    if (!document.keywords) {
        document.keywords = {};
    }

    if (!document.members) {
        document.members = {};
    }

    if (!document.args) {
        document.args = [];
    }
}

function add_document(parent, document) {
    var chain;
    var i;
    var element;

    initialize_document(parent);
    initialize_document(document);

    chain = get_document_chain(parent);

    for (i = 0; i < chain.length; i += 1) {
        element = chain[i];

        initialize_document(element);

        if (has_own(element.members, document.name)) {
            report_error(
                "Name is not unique",
                document.path,
                undefined,
                document.name
            );
            return;
        }
    }

    parent.members[document.name] = document;
    document.parent = parent;
}

function get_document_chain(document) {
    var result;
    var current;

    result = [];
    current = document;

    while (current) {
        result.push(current);
        current = current.parent;
    }

    return result;
}

async function read_children(node) {
    var result;
    var i;
    var child_path;
    var child;

    if (!node.children) {
        return [];
    }

    result = [];

    for (i = 0; i < node.children.length; i += 1) {
        child_path = node.children[i];
        child = await read_object(child_path);

        if (child && (child.type === "drakon" || child.type === "folder")) {
            result.push(child);
        }
    }

    return result;
}

async function read_folder(parent, folder) {
    var children;
    var module;
    var class_doc;
    var other_children;
    var i;
    var child;

    children = await read_children(folder);

    module = find_by_name(children, "module");
    class_doc = find_by_name(children, "class");
    other_children = filter_not_module_or_class(children);

    if (module) {
        report_error(
            "module not expected here",
            module.path,
            undefined,
            undefined
        );
    }

    if (class_doc) {
        class_doc.name = folder.name;
        class_doc.type = "class";
        add_document(parent, class_doc);
        parent = class_doc;
    }

    for (i = 0; i < other_children.length; i += 1) {
        child = other_children[i];

        if (child.type === "folder") {
            await read_folder(parent, child);
        } else {
            add_document(parent, child);
        }
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

function report_error(message, handle, item_id, data) {
    error_list.push({
        message: message,
        filename: handle,
        nodeId: item_id,
        data: data
    });
}

function find_by_name(list, name) {
    var i;
    var item;

    for (i = 0; i < list.length; i += 1) {
        item = list[i];

        if (item.name === name) {
            return item;
        }
    }

    return undefined;
}

function filter_name_not(list, name) {
    var result;
    var i;
    var item;

    result = [];

    for (i = 0; i < list.length; i += 1) {
        item = list[i];

        if (item.name !== name) {
            result.push(item);
        }
    }

    return result;
}

function filter_not_module_or_class(list) {
    var result;
    var i;
    var item;

    result = [];

    for (i = 0; i < list.length; i += 1) {
        item = list[i];

        if (item.name !== "module" && item.name !== "class") {
            result.push(item);
        }
    }

    return result;
}

function has_own(map, key) {
    return Object.prototype.hasOwnProperty.call(map, key);
}

module.exports = {
    read_project: read_project
};