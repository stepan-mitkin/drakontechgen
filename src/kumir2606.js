const {read_project} = require("./kumir2606/reader")
const {parse_items} = require("./kumir2606/parser")
const {build_module_tree} = require("./kumir2606/tree")
const {build_module_code} = require("./kumir2606/printer")

function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


async function generate_kumir(options) {
    var project;
    var parse_result;
    var tree;
    var module_src;

    project = await read_project(options);
    if (project.errors && project.errors.length) {
        return {
            errors: project.errors
        };
    }

    await pause(1);

    parse_result = parse_items(
        project.module,
        options
    );
    if (parse_result.errors && parse_result.errors.length) {
        return {
            errors: parse_result.errors
        };
    }



    await pause(1);

    tree = build_module_tree(
        project.module,
        options
    );
    if (tree.errors && tree.errors.length) {
        return {
            errors: tree.errors
        };
    }

    await pause(1);
    module_src = build_module_code(
        tree.module,
        options
    );
    if (module_src.errors && module_src.errors.length) {
        return {
            errors: module_src.errors
        };
    }

    return {
        code: module_src.code
    };
}

async function wrapKumirGenerator(options) {
    var result
    try {
        result = await generate_kumir(options)
    } catch (ex) {
        options.onError({
            message: ex.message,
            filename: ex.filename,
            nodeId: ex.nodeId,
            data: ex.data
        })
        return
    }
    if (result.errors && result.errors.length != 0) {
        for (var error of result.errors) {
            options.onError(error)
        }
    } else {
        await options.onData(result.code)
    }
}


function Kumir2606Generator(options) {
    var self = { _type: 'Kumir2606Generator' };
    self.run = () => wrapKumirGenerator(options)
    self.stop = function() {}
    return self
}

module.exports = { Kumir2606Generator };