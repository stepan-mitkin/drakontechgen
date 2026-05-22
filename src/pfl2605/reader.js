"use strict";

var error_list = [];
var global_options = undefined;
var next_id = 1;

async function read_project(options) {
    error_list = [];
    global_options = options;

    var root_folder = await read_object(global_options.root);
    var module = create_module();

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

function create_module() {
    return {
        header: undefined,
        classes: {}
    };
}

function create_class_object(name, type) {
    return {
        name: name,
        type: type,
        class_body: undefined,
        methods: {},
        constructor: undefined
    };
}

async function add_function(klass, func) {
    if (func.name in klass.methods) {
        report_error(
            "Имя функции неуникально",
            func.path
        );
    } else {
        klass.methods[func.name] = func;
    }
}

async function create_class(module, folder) {
    var name = try_extract_name(
        folder.name,
        "класс"
    );

    if (name in module.classes) {
        report_error(
            "Имя класса неуникально",
            folder.path
        );
    } else {
        var klass = create_class_object(
            name,
            "class"
        );

        module.classes[name] = klass;

        await read_class_folder(
            klass,
            folder
        );
    }
}

async function create_program(module, folder) {
    var name = try_extract_name(
        folder.name,
        "программа"
    );

    if (name in module.classes) {
        report_error(
            "Имя программы неуникально",
            folder.path
        );
    } else {
        var program = create_class_object(
            name,
            "program"
        );

        module.classes[name] = program;

        await read_program_folder(
            program,
            folder
        );
    }
}

function is_class(text) {
    var name = try_extract_name(
        text,
        "класс"
    );

    if (name) {
        return true;
    } else {
        return false;
    }
}

function is_program(text) {
    var name = try_extract_name(
        text,
        "программа"
    );

    if (name) {
        return true;
    } else {
        return false;
    }
}

async function read_children(node) {
    if (node.children) {
        var result = [];
        var i = 0;

        while (i < node.children.length) {
            var child_path = node.children[i];
            var child = await read_object(child_path);

            if (child && (child.type === "drakon" || child.type === "folder")) {
                result.push(child);
            }

            i++;
        }

        return result;
    } else {
        return [];
    }
}

async function read_class_folder(klass, folder) {
    var children = await read_children(folder);
    var i = 0;

    while (i < children.length) {
        var child = children[i];

        if (child.name === "Заголовок") {
            report_error(
                "Заголовок не может быть внутри класса",
                child.path
            );
        } else if (child.name === "ТелоКласса") {
            set_class_body(
                klass,
                child
            );
        } else if (child.name === "Конструктор") {
            set_constructor(
                klass,
                child
            );
        } else if (child.type === "folder") {
            if (is_program(child.name)) {
                report_error(
                    "Программа не может быть внутри класса",
                    child.path
                );
            } else if (is_class(child.name)) {
                report_error(
                    "Класс не может быть внутри класса",
                    child.path
                );
            } else {
                await read_class_folder(
                    klass,
                    child
                );
            }
        } else {
            await add_function(
                klass,
                child
            );
        }

        i++;
    }
}

async function read_object(handle) {
    var node = await global_options.getObjectByHandle(
        handle
    );

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

async function read_program_folder(program, folder) {
    var children = await read_children(folder);
    var i = 0;

    while (i < children.length) {
        var child = children[i];

        if (child.name === "Заголовок") {
            report_error(
                "Заголовок не может быть внутри программы",
                child.path
            );
        } else if (child.name === "ТелоКласса") {
            report_error(
                "Тело класса может быть только в классе",
                child.path
            );
        } else if (child.name === "Конструктор") {
            report_error(
                "Конструкторы могут быть только в классах",
                child.path
            );
        } else if (child.type === "folder") {
            if (is_program(child.name)) {
                report_error(
                    "Программа не может быть внутри программы",
                    child.path
                );
            } else if (is_class(child.name)) {
                report_error(
                    "Класс не может быть внутри программы",
                    child.path
                );
            } else {
                await read_program_folder(
                    program,
                    child
                );
            }
        } else {
            await add_function(
                program,
                child
            );
        }

        i++;
    }
}

async function read_project_folder(module, folder) {
    var children = await read_children(folder);
    var i = 0;

    while (i < children.length) {
        var child = children[i];

        if (child.name === "Заголовок") {
            set_header(
                module,
                child
            );
        } else if (child.name === "ТелоКласса") {
            report_error(
                "Тело класса может быть только в классе",
                child.path
            );
        } else if (child.name === "Конструктор") {
            report_error(
                "Конструкторы могут быть только в классах",
                child.path
            );
        } else if (child.type === "folder") {
            if (is_program(child.name)) {
                await create_program(
                    module,
                    child
                );
            } else if (is_class(child.name)) {
                await create_class(
                    module,
                    child
                );
            } else {
                await read_project_folder(
                    module,
                    child
                );
            }
        } else {
            report_error(
                "Функции могут быть только в классах и программах",
                child.path
            );
        }

        i++;
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

function set_class_body(klass, folder) {
    if (klass.class_body) {
        report_error(
            "Тело класса уже есть",
            folder.path
        );
    } else {
        klass.class_body = folder;
    }
}

function set_constructor(klass, folder) {
    if (klass.constructor) {
        report_error(
            "Конструктор уже есть",
            folder.path
        );
    } else {
        klass.constructor = folder;
    }
}

function set_header(module, folder) {
    if (module.header) {
        report_error(
            "Заголовок уже есть",
            folder.path
        );
    } else {
        module.header = folder;
    }
}

function try_extract_name(text, prefix) {
    var low = text.toLowerCase();
    var before = prefix + " ";

    if (low.startsWith(before)) {
        return text.substring(before.length);
    } else {
        return undefined;
    }
}

module.exports = {
    read_project: read_project
};