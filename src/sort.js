function topologicaSort(start, getAdjacentNodes, reportError) {
    var context = {
        permanent: {},
        temporary: {},
        output: [],
        getAdjacentNodes: getAdjacentNodes,
        reportError: reportError
    }
    var crumbs = ""
    topologicaSortCore(context, start, crumbs)
    return context.output
}

function topologicaSortCore(context, key, crumbs) {
    if (crumbs) {
        crumbs = crumbs + " > " + key
    } else {
        crumbs = key
    }

    if (key in context.permanent) {
        return
    }    

    if (key in context.temporary) {
        context.reportError(key, crumbs)
        return
    }

    context.temporary[key] = true
    var nodes = context.getAdjacentNodes(key)
    nodes.forEach(node => topologicaSortCore(context, node, crumbs))
    context.permanent[key] = true
    context.output.push(key)
}

module.exports = {
    topologicaSort
}