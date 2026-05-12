local Red
local primInput
local silReceive

Red = function(name)
    local getValue
    local machineMethod
    local self = {_type="Red"}
    
    getValue = function()
        return name .. ": " .. self.value
    end
    
    machineMethod = function(foo)
        local me = {state = "created", _buzy = true}
        
        me.run = function()
            if me.state ~= "created" then
                error("run() can be called only once")
            end
            me.state = "4"
            me.state = "4"
            me._buzy = false
            return
        end
        
        me.bar = function(moo)
            if me._buzy then
                error("Synchronous reentry is not allowed")
            end
            if me.state == "4" then
                me._buzy = true
                me.hello = moo
                self.value = foo + moo
            end
        end
        me.stop = function() me.state = nil end
        return me
    end
    
    self.getValue = getValue
    self.machineMethod = machineMethod
    return self
end

primInput = function(left, right)
    local total
    local me = {state = "created", _buzy = true}
    
    me.run = function()
        if me.state ~= "created" then
            error("run() can be called only once")
        end
        me.state = "6"
        total = 0
        me.state = "4"
        me._buzy = false
        return
    end
    
    me.nudge = function(amount)
        if me._buzy then
            error("Synchronous reentry is not allowed")
        end
        if me.state == "4" then
            me._buzy = true
            total = total + amount
            me.total = total + left + right
        end
    end
    me.stop = function() me.state = nil end
    return me
end

silReceive = function(arg1, arg2)
    local x
    local me = {state = "created", _buzy = true}
    
    me.run = function()
        if me.state ~= "created" then
            error("run() can be called only once")
        end
        me.state = "3"
        while me.state do
            if me.state == "3" then
                x = arg1 + 2
                me.state = "Black state"
            elseif me.state == "Black state" then
                me.state = "11"
                me._buzy = false
                return
            else
                return
            end
        end
    end
    
    me.left = function(value)
        if me._buzy then
            error("Synchronous reentry is not allowed")
        end
        if me.state == "11" then
            me._buzy = true
            while me.state do
                if me.state == "11" then
                    if value < 0 then
                        arg2 = arg2 + value
                        me.state = "Red state"
                    else
                        arg1 = arg1 + value
                        me.state = "Inter-transitional"
                    end
                elseif me.state == "Inter-transitional" then
                    arg1 = arg1 + 1
                    me.state = "Red state"
                elseif me.state == "Red state" then
                    me.state = "13"
                    me._buzy = false
                    return
                else
                    return
                end
            end
        elseif me.state == "13" then
            me._buzy = true
            while me.state do
                if me.state == "13" then
                    arg1 = arg1 + value * 2
                    me.state = "Grey state"
                elseif me.state == "Grey state" then
                    x = x + 1
                    me.state = "25"
                    me._buzy = false
                    return
                else
                    return
                end
            end
        end
    end
    
    me.print = function(what)
        if me._buzy then
            error("Synchronous reentry is not allowed")
        end
        if me.state == "25" then
            me._buzy = true
            while me.state do
                if me.state == "25" then
                    print(what)
                    me.a1 = arg1 + x
                    me.a2 = arg2
                    me.state = "Black state"
                elseif me.state == "Black state" then
                    me.state = "11"
                    me._buzy = false
                    return
                else
                    return
                end
            end
        end
    end
    
    me.right = function(value)
        if me._buzy then
            error("Synchronous reentry is not allowed")
        end
        if me.state == "11" then
            me._buzy = true
            while me.state do
                if me.state == "11" then
                    arg2 = arg2 + value
                    me.state = "Red state"
                elseif me.state == "Red state" then
                    me.state = "13"
                    me._buzy = false
                    return
                else
                    return
                end
            end
        elseif me.state == "13" then
            me._buzy = true
            while me.state do
                if me.state == "13" then
                    if value == "7777" then
                        error("Bad right value")
                    end
                    arg2 = arg2 + value * 2
                    me.state = "Black state"
                elseif me.state == "Black state" then
                    me.state = "11"
                    me._buzy = false
                    return
                else
                    return
                end
            end
        end
    end
    me.stop = function() me.state = nil end
    return me
end

return {
    Red = Red,
    primInput = primInput,
    silReceive = silReceive
}