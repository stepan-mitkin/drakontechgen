local classes = require("exampleslua2604.classes")

describe("Lua Classes", function()

    it("GreyClass", function()
        assert.are.equal(124, classes.runGrey())
    end)

    it("YellowClass", function()
        local yellow
        local info

        yellow = classes.YellowClass("Lunia", "tiger", { x = 1, y = 2 }, { 3, 4 })

        assert.are.equal("Hello, Dr. Lunia!", yellow.greet())

        yellow.address = "Storgata 1"
        info = yellow.getFullInfo()

        assert.are.equal("Lunia", info.name)
        assert.are.equal("tiger", info.color)
        assert.are.equal("Storgata 1", info.address)
        assert.are.equal(1000, info.a)
        assert.are.equal(4, info.b)
        assert.are.equal(1, info.x)
        assert.are.equal(2, info.y)

        yellow.setName("Lykke")
        yellow.setTitle("Ms.")

        assert.are.equal("Hello, Ms. Lykke!", yellow.greet())
    end)

end)