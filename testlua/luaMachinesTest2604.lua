local machines = require("exampleslua2604.machines")

describe("Lua State machines 2604", function()

    it("primInput", function()
        local obj = machines.primInput(2, 3)
        local promise = obj.run()
        obj.nudge(10)

        assert.are.equal(15, obj.total)
    end)

    it("silReceive", function()
        local obj = machines.silReceive(2, 3)

        obj.run()
        obj.left(1)
        obj.right(2)
        obj.right(3)
        obj.left(4)
        obj.print("meou")

        assert.are.equal(17, obj.a1)
        assert.are.equal(10, obj.a2)
    end)

    it("Red", function()
        local obj = machines.Red("Reddie")
        local machine = obj.machineMethod(5)

        machine.run()
        machine.bar(10)

        assert.are.equal("Reddie: 15", obj.getValue())
        assert.are.equal(15, obj.value)
        assert.are.equal(10, machine.hello)
    end)

end)