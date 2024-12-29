function traverseAst(context, node, itemId, parentNode, property) {
    if (!node) { return }
    if (Array.isArray(node)) {
        for (var child of node) {
            traverseAst(context, child, itemId, parentNode, property)
        }
    } else if (typeof node === "object" && node.type) {
        if (node.itemId) {
            itemId = node.itemId
        }
        if (node.type === "MemberExpression") {
            traverseAst(context, node.object, itemId, node, "object")
            if (node.computed) {
                traverseAst(context, node.property, itemId, node, "property")
            }
        } else if (node.type === "ObjectExpression") {
            for (var property of node.properties) {
                if (property.computed) {
                    traverseAst(context, property.key, itemId, node, "key")
                }
                traverseAst(context, property.value, itemId, node, "value")
            }
        } else if (node.type === "ArrayPattern") {
            for (var element of node.elements) {
                context.visit(element, itemId, node, "dec")
            }
        } else if (node.type === "ObjectPattern") {
            for (var property of node.properties) {
                if (!property.computed) {
                    context.visit(property.key, itemId, node, "dec")
                }
            }
        } else {
            context = context.visit(node, itemId, parentNode, property)
            if (node.type !== "Identifier" && node.type !== "Literal") {
                for (var key in node) {
                    if (key === "scope") {continue}
                    var child = node[key]
                    traverseAst(context, child, itemId, node, key)
                }
            }
        }
    }
}

module.exports = {
    traverseAst
}