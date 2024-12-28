const classes = require("../examples/classes/classes")

QUnit.module('Classes');

QUnit.test("GreyClass", assert => {
    assert.equal(classes.runGrey(), 42)
})


QUnit.test("YellowClass", assert => {
    var yellow = classes.YellowClass("Lunia", "tiger")
    assert.equal(yellow.greet(), "Hello, Dr. Lunia!")
    yellow.address = "Storgata 1"
    var info = yellow.getFullInfo()
    assert.equal(info.name, "Lunia")
    assert.equal(info.color, "tiger")
    assert.equal(info.address, "Storgata 1")
    yellow.setName("Lykke")
    yellow.setTitle("Ms.")
    assert.equal(yellow.greet(), "Hello, Ms. Lykke!")
})