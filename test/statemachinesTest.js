const machines = require("../examples/machines/machines")

QUnit.module('State machines');

QUnit.test("primInput", assert => {

    var obj = machines.primInput(2, 3)
    obj.nudge(10)
    obj.nudge(20)
    assert.equal(obj.total, 15)
})

QUnit.test("silReceive", assert => {

    var obj = machines.silReceive(2, 3)
    obj.left(1)
    obj.right(2)
    obj.right(3)
    obj.left(4)
    obj.print()

    assert.equal(obj.a1, 17)
    assert.equal(obj.a2, 10)
})
