function findFirst(array, predicate) {
    for (var item of array) {
        if (predicate(item)) {
            return item
        }
    }
    return undefined
}

function addRange(target, source) {
    source.forEach(item => target.push(item))
}

function sortBy(array, property) {
    array.sort((left, right) => compareBy(left, right, property))
}

function compareBy(leftObj, rightObj, property) {
    var left = leftObj[property]
    var right = rightObj[property]
    if (left < right) {
        return -1
    }
    if (left > right) {
        return 1
    }
    return 0
}

function clone(src) {
    var target = {}
    if (src) {
        Object.assign(target, src)
    }
    return target
}

function replace(str, before, after) {
    var parts = str.split(before)
    return parts.join(after)
}

module.exports = {
    replace,
    clone,
    sortBy,
    findFirst,
    addRange
}