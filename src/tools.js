function findFirst(array, predicate) {
    for (var item of array) {
        if (predicate(item)) {
            return item
        }
    }
    return undefined
}


module.exports = {
    findFirst
}