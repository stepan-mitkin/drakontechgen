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

module.exports = {
    findFirst,
    addRange
}