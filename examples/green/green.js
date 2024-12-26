function add(left, right) {
    result = addCore(left, right);
    return result;
}
function addCore(left, right) {
    return left + right;
}
function complexAnd(valueA, valueB, valueC) {
    if (!valueA && valueB || valueC) {
        return true;
    } else {
        return false;
    }
}
function complexOr(valueA, valueB, valueC) {
    if (valueA || !valueB && valueC) {
        return true;
    } else {
        return false;
    }
}
function complexSilhouette(left, right) {
    var _state_ = 'First';
    while (true) {
        switch (_state_) {
        case 'First':
            result = 0;
            if (left === 3) {
                result += right;
                _state_ = 'Second';
            } else {
                _state_ = 'Third';
            }
            break;
        case 'Second':
            result += 2;
            _state_ = 'Third';
            break;
        case 'Third':
            result += 10;
            _state_ = 'Exit';
            break;
        case 'Exit':
            _state_ = undefined;
            return result;
        default:
            return;
        }
    }
}
function degenerateSelect(value) {
    if (value === 10) {
        return 'ten';
    } else {
        return 'other';
    }
}
function doWhile() {
    result = 0;
    while (true) {
        result += 3;
        if (result > 20) {
            break;
        }
    }
    return result;
}
function doWhileDo() {
    result = 0;
    while (true) {
        result += 7;
        if (result > 20) {
            break;
        } else {
            result += 3;
        }
    }
    return result;
}
function earlyExit(array, value) {
    index = -1;
    for (i = 0; i < array.length; i++) {
        if (item[i] === value) {
            index = i;
            break;
        }
    }
    if (index !== -1) {
        array.splice(index, 1);
    }
}
function empty() {
}
function fibonacci(ordinal) {
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
function fizzBuzz(number) {
    if (number % 3) {
        if (number % 5) {
            return 'FizzBuzz';
        } else {
            return 'Fizz';
        }
    } else {
        if (number % 5) {
            return 'Buzz';
        } else {
            return undefined;
        }
    }
}
function forEachUntil(array, action) {
    for (var element of array) {
        mustExit = action(element);
        if (mustExit) {
            break;
        }
    }
}
function forLoopDeclare(array) {
    copy = {};
    for (var i = 0; i < array.length; i += 2) {
        key = array[i];
        value = array[i + 1];
        copy[key] = value;
    }
    return copy;
}
function forLoopNoDeclare(array) {
    copy = {};
    for (i = 0; i < array.length; i += 2) {
        key = array[i];
        value = array[i + 1];
        copy[key] = value;
    }
    return copy;
}
function foreachLoopArray(array, value) {
    copy = [];
    for (var item of array) {
        value2 = item + value;
        copy.push(value2);
    }
    return copy;
}
function foreachLoopObject(object, value) {
    copy = {};
    wrapper = { collection: object };
    _collection_2 = wrapper.collection;
    for (var key in _collection_2) {
        item = _collection_2[key];
        value2 = item + value;
        copy[key] = value2;
    }
    return copy;
}
function generateId() {
    id = nextId;
    nextId = nextId + 1;
    return id;
}
function getSecret() {
    return secretValue;
}
function hello() {
    console.log('Hello, world');
}
function mul(left, right) {
    return multiply(left, right);
}
function questionMerge(left, right) {
    result = 0;
    if (left) {
        result += 10;
    } else {
        result++;
        if (right) {
            result += 10;
        } else {
            result += 5;
        }
    }
    return result;
}
function scope3(array, sortProp, cutoff) {
    result = undefined;
    var found = undefined;
    array.sort((a, b) => {
        left = a[sortProp];
        right = b[sortProp];
        if (left < right) {
            return -1;
        }
        if (left > right) {
            return 1;
        }
        return 0;
    });
    forEachUntil(array, function (element) {
        e2 = element * 2;
        if (e2 > cutoff) {
            result = e2;
            found = element;
            return true;
        }
        return false;
    });
    return {
        result,
        found
    };
}
function selectArrow() {
    result = 0;
    while (true) {
        if (result === 10) {
            break;
        } else {
            if (result === 5) {
                result += 2;
            } else {
                result++;
            }
        }
    }
    return result;
}
function selectShortCircuit(value) {
    _selectValue_5 = value + 5;
    if (_selectValue_5 === 10 || _selectValue_5 === 20) {
        return 'good';
    } else {
        if (_selectValue_5 !== 30) {
            throw new Error('Unexpected case value: ' + _selectValue_5);
        }
        return 'bad';
    }
}
function selectWithDefault(value) {
    if (value === 10) {
        return 'ten';
    } else {
        if (value === 20) {
            return 'twenty';
        } else {
            return 'other';
        }
    }
}
function selectWithoutDefault(value) {
    _selectValue_7 = value + 5;
    if (_selectValue_7 === 10) {
        return 'ten';
    } else {
        if (_selectValue_7 === 20) {
            return 'twenty';
        } else {
            if (_selectValue_7 !== 30) {
                throw new Error('Unexpected case value: ' + _selectValue_7);
            }
            return 'thirty';
        }
    }
}
function simpleAnd(valueA, valueB, valueC) {
    if (valueA && valueB && valueC) {
        return true;
    } else {
        return false;
    }
}
function simpleOr(valueA, valueB, valueC) {
    if (valueA || valueB || valueC) {
        return true;
    } else {
        return false;
    }
}
function twoExits(array, value) {
    while (true) {
        let i = 0;
        if (i < array.length) {
            item = array[i];
            if (item === value) {
                index = i;
                break;
            } else {
                i++;
            }
        } else {
            index = -1;
            break;
        }
    }
    return index;
}
function whileDo() {
    result = 0;
    while (true) {
        if (result > 20) {
            break;
        } else {
            result += 3;
        }
    }
    return result;
}
module.exports = {
    add,
    complexAnd,
    complexOr,
    complexSilhouette,
    degenerateSelect,
    doWhile,
    doWhileDo,
    earlyExit,
    empty,
    fibonacci,
    fizzBuzz,
    forLoopDeclare,
    forLoopNoDeclare,
    foreachLoopArray,
    foreachLoopObject,
    generateId,
    getSecret,
    hello,
    mul,
    questionMerge,
    scope3,
    selectArrow,
    selectShortCircuit,
    selectWithDefault,
    selectWithoutDefault,
    simpleAnd,
    simpleOr,
    twoExits,
    whileDo
};