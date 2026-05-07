local green = require("exampleslua2604.green")

describe("Functions 2604", function()

    it("add", function()
        green.empty()
        green.hello()
        assert.are.equal(5, green.add(2, 3))
    end)

    it("complexAnd", function()
        assert.are.equal(false, green.complexAnd(false, false, false))
        assert.are.equal(true, green.complexAnd(false, true, false))
        assert.are.equal(true, green.complexAnd(true, true, true))
    end)

    it("complexOr", function()
        assert.are.equal(false, green.complexOr(false, true, true))
        assert.are.equal(true, green.complexOr(true, false, false))
        assert.are.equal(true, green.complexOr(true, false, true))
    end)

    it("complexSilhouette", function()
        assert.are.equal(17, green.complexSilhouette(3, 5))
    end)

    it("degenerateSelect", function()
        assert.are.equal("ten", green.degenerateSelect(10))
        assert.are.equal("other", green.degenerateSelect(20))
    end)

    it("doWhile", function()
        assert.are.equal(21, green.doWhile())
    end)

    it("doWhileDo", function()
        assert.are.equal(27, green.doWhileDo())
    end)

    it("earlyExit", function()
        assert.are.same({ 1, 3 }, green.earlyExit({ 1, 2, 3 }, 2))
        assert.are.same({ 1, 2, 3 }, green.earlyExit({ 1, 2, 3 }, 4))
    end)

    it("fibonacci", function()
        assert.are.equal(0, green.fibonacci(0))
        assert.are.equal(1, green.fibonacci(1))
        assert.are.equal(1, green.fibonacci(2))
        assert.are.equal(2, green.fibonacci(3))
        assert.are.equal(3, green.fibonacci(4))
        assert.are.equal(5, green.fibonacci(5))
    end)

    it("sil2", function()
        assert.are.equal(25, green.sil2(2))
    end)

    it("fizzBuzz", function()
        assert.is_nil(green.fizzBuzz(1))
        assert.is_nil(green.fizzBuzz(2))
        assert.are.equal("Fizz", green.fizzBuzz(3))
        assert.is_nil(green.fizzBuzz(4))
        assert.are.equal("Buzz", green.fizzBuzz(5))
        assert.are.equal("FizzBuzz", green.fizzBuzz(15))
    end)

    it("forLoopNoDeclare", function()
        assert.are.same({
            one = 1,
            two = 2
        }, green.forLoopNoDeclare({ "one", 1, "two", 2 }))
    end)

    it("foreachLoopArray", function()
        assert.are.same({ 6, 7 }, green.foreachLoopArray({ 1, 2 }, 5))
    end)

    it("foreachLoopObject", function()
        assert.are.same({
            one = 6,
            two = 7
        }, green.foreachLoopObject({ one = 1, two = 2 }, 5))
    end)

    it("generateId", function()
        assert.are.equal(1, green.generateId())
        assert.are.equal(2, green.generateId())
        assert.are.equal(3, green.generateId())
    end)

    it("getSecret", function()
        assert.are.equal(23, green.getSecret())
    end)

    it("mul", function()
        assert.are.equal(12, green.mul(3, 4))
    end)

    it("questionMerge", function()
        assert.are.equal(11, green.questionMerge(false, true))
    end)

    it("scope3", function()
        local input = {
            { name = "c", value = 30 },
            { name = "a", value = 10 },
            { name = "b", value = 20 }
        }

        local output = green.scope3(input, "name", 29)

        assert.are.equal(40, output.result)
        assert.are.equal("b", output.found.name)
    end)

    it("selectArrow", function()
        assert.are.equal(10, green.selectArrow())
    end)

    it("selectShortCircuit", function()
        assert.are.equal("good", green.selectShortCircuit(15))
        assert.are.equal("bad", green.selectShortCircuit(25))
    end)

    it("selectWithDefault", function()
        assert.are.equal("ten", green.selectWithDefault(10))
        assert.are.equal("other", green.selectWithDefault(25))
    end)

    it("selectWithoutDefault", function()
        assert.are.equal("ten", green.selectWithoutDefault(5))
        assert.are.equal("thirty", green.selectWithoutDefault(25))
    end)

    it("simpleAnd", function()
        assert.are.equal(false, green.simpleAnd(false, false, false))
        assert.are.equal(true, green.simpleAnd(true, true, true))
        assert.are.equal(false, green.simpleAnd(true, false, true))
    end)

    it("simpleOr", function()
        assert.are.equal(false, green.simpleOr(false, false, false))
        assert.are.equal(true, green.simpleOr(true, true, true))
        assert.are.equal(true, green.simpleOr(true, false, true))
    end)

    it("twoExits", function()
        assert.are.equal(3, green.twoExits({ 10, 20, 30 }, 30))
        assert.are.equal(1, green.twoExits({ 10, 20, 30 }, 10))
        assert.are.equal(-1, green.twoExits({ 10, 20, 30 }, 15))
        assert.are.equal(-1, green.twoExits(nil, 15))
    end)

    it("whileDo", function()
        assert.are.equal(21, green.whileDo())
    end)

    it("inversedOr", function()
        assert.are.equal(false, green.inversedOr(1, 2, 3))
    end)

    it("inversedAnd", function()
        assert.are.equal(true, green.inversedAnd(4, 5, 6))
    end)

    it("noDublicates", function()
        assert.are.equal(1010, green.noDublicates(2, 3))
        assert.are.equal(1010, green.noDublicates(-2, 3))
        assert.are.equal(-1, green.noDublicates(-2, -3))
    end)

end)