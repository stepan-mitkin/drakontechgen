const machines = require("../examples2604/machines");

function pause(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

QUnit.module("State machines 2604");

QUnit.test("primInput", async (assert) => {
  var obj = machines.primInput_create(2, 3);
  var promise = obj.run();
  obj.nudge(10);
  assert.equal(obj.total, 15);
  var result = await promise;
  assert.equal(result, 15);
});

QUnit.test("silReceive", (assert) => {
  var obj = machines.silReceive_create(2, 3);
  obj.run();
  obj.left(1);
  obj.right(2);
  obj.right(3);
  obj.left(4);
  obj.print("meou");
  assert.equal(obj.a1, 17);
  assert.equal(obj.a2, 10);
});

QUnit.test("Red", (assert) => {
  var obj = machines.Red("Reddie");
  var machine = obj.machineMethod_create(5);
  machine.run();
  machine.bar(10);
  assert.equal(obj.getValue(), "Reddie: 15");
  assert.equal(obj.value, 15);
  assert.equal(machine.hello, 10);
});
