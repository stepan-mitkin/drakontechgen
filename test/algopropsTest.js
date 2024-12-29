const algoprops = require("../examples/algoprops/algoprops")
const classAlgoprops = require("../examples/classAlgoprops/classAlgoprops")

QUnit.module('Algoprops');

QUnit.test("Module algoprops", assert => {
    var value = algoprops.calculateYellow()    
    assert.equal(value, 530)
})


QUnit.test("Class algoprops", assert => {
    var pink = classAlgoprops.Pink(250)
    var value = pink.calculateYellow()   
    assert.equal(value, 520)
})


QUnit.test("Lazy algoprops", assert => {
    var lilla = classAlgoprops.Lilla()
    var value = lilla.getTotal()   
    assert.equal(value, 30)
})