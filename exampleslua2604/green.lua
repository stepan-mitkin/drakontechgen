local add
local addCore
local complexAnd
local complexOr
local complexSilhouette
local degenerateSelect
local doWhile
local doWhileDo
local earlyExit
local empty
local fibonacci
local fizzBuzz
local forEachUntil
local forLoopNoDeclare
local foreachLoopArray
local foreachLoopObject
local generateId
local getSecret
local hello
local inversedAnd
local inversedOr
local mul
local noDublicates
local questionMerge
local scope3
local selectArrow
local selectShortCircuit
local selectWithDefault
local selectWithoutDefault
local sil2
local simpleAnd
local simpleOr
local twoExits
local whileDo
local multiply
multiply = require("exampleslua2604.ops")
.multiply
local secretValue = 23;
local nextId = 1
add = function(left, right)
    local result
    result = addCore(left, right)
    return result
end
addCore = function(left, right)
    return left + right
end
complexAnd = function(valueA, valueB, valueC)
    if ((not (valueA)) and (valueB)) or (valueC) then
        return true
    else
        return false
    end
end
complexOr = function(valueA, valueB, valueC)
    if (valueA) or ((not (valueB)) and (valueC)) then
        return true
    else
        return false
    end
end
complexSilhouette = function(left, right)
    local _branch_, result
    _branch_ = "First"
    while _branch_ do
        if _branch_ == "First" then
            _branch_ = nil
            result = 0
            if left == 3 then
                result = result + right
                _branch_ = "Second"
            else
                _branch_ = "Third"
            end
        elseif _branch_ == "Second" then
            _branch_ = nil
            result = result + 2
            _branch_ = "Third"
        elseif _branch_ == "Third" then
            _branch_ = nil
            result = result + 10
            _branch_ = "Exit"
        elseif _branch_ == "Exit" then
            _branch_ = nil
            return result
        else
            return
        end
    end
end
degenerateSelect = function(value)
    if value == 10 then
        return "ten"
    else
        return "other"
    end
end
doWhile = function()
    local result
    result = 0
    while true do
        result = result + 3
        if result > 20 then
            break
        end
    end
    return
    result
end
doWhileDo = function()
    local result
    result = 0
    while true do
        result = result + 7
        if result > 20 then
            break
        else
            result = result + 3
        end
    end
    return result
end
earlyExit = function(array, value)
    local index
    index = -1
    i = 1
    while i <= #array do
        if array[i] == value then
            index = i
            break
        else
            i = i + 1
        end
    end
    if not (index == -1) then
        table.remove(array, index)
    end
    return array
end
empty = function()
end
fibonacci = function(ordinal)
    local _branch_, i_1, i_2, result
    _branch_ = "Simple case"
    while _branch_ do
        if _branch_ == "Simple case" then
            _branch_ = nil
            if (ordinal == 0) or (ordinal == 1) then
                result = ordinal
                _branch_ = "Exit"
            else
                _branch_ = "Normal case"
            end
        elseif _branch_ == "Normal case" then
            _branch_ = nil
            i_2 = 0
            i_1 = 1
            i = 2
            while i <= ordinal do
                result = i_2 + i_1
                i_2 = i_1
                i_1 = result
                i = i + 1
            end
            _branch_ = "Exit"
        elseif _branch_ == "Exit" then
            _branch_ = nil
            return result
        else
            return
        end
    end
end
fizzBuzz = function(number)
    if number % 3 == 0 then
        if number % 5 == 0 then
            return 'FizzBuzz'
        else
            return 'Fizz'
        end
    else
        if number % 5 == 0 then
            return 'Buzz'
        else
            return nil
        end
    end
end
forEachUntil = function(array, action)
    local mustExit
    for _, element in ipairs(array) do
        mustExit = action(element)
        if mustExit then
            break
        end
    end
end
forLoopNoDeclare = function(array)
    local copy, key, value
    copy = {}
    i = 1
    while i <  # array do
        key = array[i]
        value = array[i + 1]
        copy[key] = value
        i = i + 2
    end
    return copy
end
foreachLoopArray = function(array, value)
    local copy, value2
    copy = {}
    for _, item in ipairs(array) do
        value2 = item + value
        table.insert(copy, value2)
    end
    return copy
end
foreachLoopObject = function(object, value)
    local copy, value2, wrapper
    copy = {}
    wrapper = {collection = object}
    _var8 = wrapper.collection
    for key, item in pairs(_var8) do
        value2 = item + value
        copy[key] = value2
    end
    return copy
end
generateId = function()
    local id
    id = nextId
    nextId = nextId + 1
    return id
end
getSecret = function()
    return secretValue
end
hello = function()
    print("Hello, world")
end
inversedAnd = function(one, two, three)
    if ((one == 1) or (two == 2)) or (three == 3) then
        return false 
    else
        return true 
    end
end
inversedOr = function(one, two, three)
    if ((one == 1) and (two == 2)) and (three == 3) then
        return false 
    else
        return true 
    end
end
mul = function(left, right)
    return multiply(left, right)
end
noDublicates = function(x, y)
    local result
    if x > 0 then
        result = 1000
        i = 0
        while i < x + y do
            result = result + i
            i = i + 1
        end
        return result
    else
        x = -x
        if y > 0 then
            result = 1000
            i = 0
            while i < x + y do
                result = result + i
                i = i + 1
            end
            return result
        else
            return -1
        end
    end
end
questionMerge = function(left, right)
    local result
    result = 0
    if left then
        result = result + 10
    else
        result = result + 1
        if right then
            result = result + 10
        else
            result = result + 5
        end
    end
    return result
end
scope3 = function(array, sortProp, cutoff)
    local found, result
    result = nil
    found = nil
    table.sort(
        array,
        function (a, b)
        left = a[sortProp]
        right = b[sortProp]
        if left < right
        then return true
        end if left > right
        then return false
        end a = "what?"
        return false
        end 
    )
    forEachUntil(
        array,
        function (element)
        e2 = element.value * 2
        if e2 > cutoff
        then result = e2
        found = element
        return true
        end return false
        end 
    )
    return {
        result = result,
        found = found
    }
end
selectArrow = function()
    local result
    result = 0
    while true do
        if result == 10 then
            break
        else
            if result == 5 then
                result = result + 2
            else
                result = result + 1
            end
        end
    end
    return result
end
selectShortCircuit = function(value)
    _var10 = value + 5
    if (_var10 == 10) or (_var10 == 20) then
        return "good"
    else
        if not (_var10 == 30) then
            error("Unexpected case value: " .. tostring(_var10))
        end
        return "bad"
    end
end
selectWithDefault = function(value)
    if value == 10 then
        return "ten"
    else
        if value == 20 then
            return "twenty"
        else
            return "other"
        end
    end
end
selectWithoutDefault = function(value)
    _var12 = value + 5
    if _var12 == 10 then
        return "ten"
    else
        if _var12 == 20 then
            return "twenty"
        else
            if not (_var12 == 30) then
                error("Unexpected case value: " .. tostring(_var12))
            end
            return "thirty"
        end
    end
end
sil2 = function(value)
    local foo
    if value >= 0 then
        if value % 10 == 0 then
            foo = value * 10
        else
            foo = value * 10
        end
    else
        foo = value * 10
    end
    foo = foo + 5
    return foo
end
simpleAnd = function(valueA, valueB, valueC)
    if ((valueA) and (valueB)) and (valueC) then
        return true
    else
        return false
    end
end
simpleOr = function(valueA, valueB, valueC)
    if ((valueA) or (valueB)) or (valueC) then
        return true
    else
        return false
    end
end
twoExits = function(array, value)
    local i, item
    if not (array) then
        array = {}
    end
    i = 1
    while true do
        if i <=  # array then
            item = array[i]
            if item == value then
                return i
            else
                i = i + 1
            end
        else
            return -1
        end
    end
end
whileDo = function()
    local result
    result = 0
    while true do
        if result > 20 then
            break
        else
            result = result + 3
        end
    end
    return result
end
return {
    add = add,
    complexAnd = complexAnd,
    complexOr = complexOr,
    complexSilhouette = complexSilhouette,
    degenerateSelect = degenerateSelect,
    doWhile = doWhile,
    doWhileDo = doWhileDo,
    earlyExit = earlyExit,
    empty = empty,
    fibonacci = fibonacci,
    fizzBuzz = fizzBuzz,
    forLoopNoDeclare = forLoopNoDeclare,
    foreachLoopArray = foreachLoopArray,
    foreachLoopObject = foreachLoopObject,
    generateId = generateId,
    getSecret = getSecret,
    hello = hello,
    inversedAnd = inversedAnd,
    inversedOr = inversedOr,
    mul = mul,
    noDublicates = noDublicates,
    questionMerge = questionMerge,
    scope3 = scope3,
    selectArrow = selectArrow,
    selectShortCircuit = selectShortCircuit,
    selectWithDefault = selectWithDefault,
    selectWithoutDefault = selectWithoutDefault,
    sil2 = sil2,
    simpleAnd = simpleAnd,
    simpleOr = simpleOr,
    twoExits = twoExits,
    whileDo = whileDo
}