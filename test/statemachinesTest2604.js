const machines = require("../examples2604/machines");

function pause(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

QUnit.module("State machines 2604");

QUnit.test("primInput", async (assert) => {
  var obj = machines.primInput_create(2, 3);
  obj.run();
  await pause(0);
  obj.nudge(10);
  await pause(0);
  assert.equal(obj.total, 15);
});

QUnit.test("silReceive", async (assert) => {
  var obj = machines.silReceive_create(2, 3);
  obj.run();
  await pause(0);
  obj.left(1);
  await pause(0);
  obj.right(2);
  await pause(0);
  obj.right(3);
  await pause(0);
  obj.left(4);
  await pause(0);
  obj.print("meou");
  await pause(0);

  assert.equal(obj.a1, 17);
  assert.equal(obj.a2, 10);
});

QUnit.test("Red", async (assert) => {
  var obj = machines.Red("Reddie");
  var machine = obj.machineMethod_create(5);
  machine.run();
  await pause(0);
  machine.bar(10);
  await pause(0);
  assert.equal(obj.getValue(), "Reddie: 15");
  assert.equal(obj.value, 15);
  assert.equal(machine.hello, 10);
});
