local GreyClass
local YellowClass
local runGrey

GreyClass = function()
    local getValue
    local init
    local log
    local smarterAdd
    local self = {_type="GreyClass"}
    
    getValue = function()
        log("getValue")
        return smarterAdd(self.value, 20)
    end
    
    init = function(value)
        self.value = value
    end
    
    log = function(message)
        print("GreyClass " .. message)
    end
    
    smarterAdd = function(left, right)
        return (left + right) * 2
    end
    
    self.getValue = getValue
    self.init = init
    return self
end

YellowClass = function(name, color, arg1, arg2)
    local getFullInfo
    local greet
    local log
    local setName
    local setTitle
    local self = {_type="YellowClass"}
    local a, b, title, x, y
    title = "Dr."
    local
    greeting = "Hello"
    x = arg1.x
    y = arg1.y
    a = arg2[1]
    b = arg2[2]
    
    getFullInfo = function()
        local result
        log("getFullInfo")
        a = 1000
        result = {
            name = name,
            color = color,
            address = self.address,
            a = a,
            b = b,
            x = x,
            y = y
        }
        return result
    end
    
    greet = function()
        local message
        log("greet")
        message = greeting .. ", " .. title .. " " ..
        name .. "!"
        return message
    end
    
    log = function(message)
        print("YellowClass " .. message)
    end
    
    setName = function(newName)
        log("setName: " .. newName)
        name = newName
    end
    
    setTitle = function(newTitle)
        log("setTitle: " .. newTitle)
        title = newTitle
    end
    
    self.getFullInfo = getFullInfo
    self.greet = greet
    self.setName = setName
    self.setTitle = setTitle
    return self
end

runGrey = function()
    local grey
    grey = GreyClass()
    grey.init(42)
    return grey.getValue()
end

return {
    YellowClass = YellowClass,
    runGrey = runGrey
}