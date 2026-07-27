function fibonacci(ordinal) {
    var i, i_1, i_2, result;
    if (ordinal === 0 || ordinal === 1) {
        result = ordinal;
        return result;
    } else {
        i_2 = 0;
        i_1 = 1;
        for (i = 2; i <= ordinal; i++) {
            result = i_2 + i_1;
            i_2 = i_1;
            i_1 = result;
        }
        return result;
    }
}
export {
    fibonacci
};