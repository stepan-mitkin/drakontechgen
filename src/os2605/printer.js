"use strict";

let error_list = [];

function build_module_code(root, options) {
    error_list = [];

    const lines = [];

    for (const node of root.body) {
        print_node(node, 0, lines);
    }

    if (error_list.length !== 0) {
        return {
            errors: error_list
        };
    }

    return {
        code: lines.join("\n")
    };
}

function print_node(node, depth, lines) {
    const context = {
        node: node,
        depth: depth,
        lines: lines
    };

    if (node.type === "function") {
        print_function(context);
    } else if (node.type === "action") {
        print_action(context);
    } else if (node.type === "question") {
        print_question(context);
    } else if (node.type === "loop") {
        print_loop(context);
    } else if (node.type === "if-switch") {
        print_switch(context);
    } else if (node.type === "empty-line") {
        add_line(context, "");
    } else if (node.type === "exit") {
        print_exit(context);
    } else {
        report_error(
            "Unexpected node type: " + node.type,
            undefined,
            undefined,
            node.type
        );
    }
}

function print_function(context) {
    const node = context.node;

    add_line(context, "");

    if (node.decorations !== undefined) {
        for (const dec of node.decorations) {
            add_line(context, dec);
        }
    }

    const args = safe_array(node.args).join(", ");
    let line = undefined;

    if (node.returnsValue) {
        line = "Функция " + node.name + "(" + args + ")";
    } else {
        line = "Процедура " + node.name + "(" + args + ")";
    }

    if (
        node.keywords !== undefined &&
        node.keywords.export === true
    ) {
        line = line + " Экспорт";
    }

    add_line(context, line);
    print_body(context, node.body);

    if (node.returnsValue) {
        add_line(context, "КонецФункции");
    } else {
        add_line(context, "КонецПроцедуры");
    }
}

function print_action(context) {
    const node = context.node;

    if (node.content !== undefined && node.content !== "") {
        const parts = node.content.split("\n");

        for (const part of parts) {
            add_line(context, part);
        }
    }
}

function print_question(context) {
    const node = context.node;
    const parts = node.content.split("\n");
    const content = parts.join(" ");

    add_line(context, "Если " + content + " Тогда");

    print_body(context, node.yes);

    if (node.no !== undefined && node.no.length !== 0) {
        add_line(context, "Иначе");
        print_body(context, node.no);
    }

    add_line(context, "КонецЕсли;");
}

function print_loop(context) {
    const node = context.node;

    add_line(context, node.content);
    print_body(context, node.body);
    add_line(context, "КонецЦикла;");
}

function print_switch(context) {
    const node = context.node;
    let first = true;

    for (const option of node.options) {
        if (first) {
            add_line(context, "Если " + option.condition + " Тогда");
            first = false;
        } else {
            add_line(context, "ИначеЕсли " + option.condition + " Тогда");
        }

        print_body(context, option.body);
    }

    if (node.other !== undefined && node.other.length !== 0) {
        add_line(context, "Иначе");
        print_body(context, node.other);
    }

    add_line(context, "КонецЕсли;");
}

function print_exit(context) {
    add_line(context, "Возврат;");
}

function print_body(context, body) {
    const depth = context.depth;
    const lines = context.lines;

    if (body === undefined) {
        return;
    }

    for (const child of body) {
        print_node(child, depth + 1, lines);
    }
}

function add_line(context, text) {
    const depth = context.depth;
    const lines = context.lines;
    const indent = repeat_string(" ", depth * 4);
    const line = indent + text;

    lines.push(line);
}

function repeat_string(text, count) {
    let result = "";

    for (let index = 0; index < count; index++) {
        result += text;
    }

    return result;
}

function safe_array(value) {
    if (value === undefined) {
        return [];
    }

    return value;
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
    build_module_code: build_module_code
};