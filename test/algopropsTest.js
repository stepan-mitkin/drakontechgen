const algoprops = require("../examples/algoprops/algoprops")

QUnit.module('Algoprops');

QUnit.test("Module algoprops", assert => {
    var value = algoprops.calculateYellow()
    console.log(value)
    assert.equal(value, 530)
})
