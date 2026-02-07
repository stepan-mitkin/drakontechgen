const {
  sil2,
  add,
  complexAnd,
  complexOr,
  complexSilhouette,
  degenerateSelect,
  doWhile,
  doWhileDo,
  earlyExit,
  empty,
  fibonacci,
  fizzBuzz,
  forLoopNoDeclare,
  foreachLoopArray,
  foreachLoopObject,
  generateId,
  getSecret,
  hello,
  mul,
  questionMerge,
  scope3,
  selectArrow,
  selectShortCircuit,
  selectWithDefault,
  selectWithoutDefault,
  simpleAnd,
  simpleOr,
  twoExits,
  inversedOr,
  whileDo,
} = require("../examples/green/green");

QUnit.module("Functions");

QUnit.test("add", (assert) => {
  empty();
  hello();
  var result = add(2, 3);
  assert.equal(result, 5);
});

QUnit.test("complexAnd", (assert) => {
  assert.equal(complexAnd(false, false, false), false);
  assert.equal(complexAnd(false, true, false), true);
  assert.equal(complexAnd(true, true, true), true);
});

QUnit.test("complexOr", (assert) => {
  assert.equal(complexOr(false, true, true), false);
  assert.equal(complexOr(true, false, false), true);
  assert.equal(complexOr(true, false, true), true);
});

QUnit.test("complexSilhouette", (assert) => {
  assert.equal(complexSilhouette(3, 5), 17);
});

QUnit.test("degenerateSelect", (assert) => {
  assert.equal(degenerateSelect(10), "ten");
  assert.equal(degenerateSelect(20), "other");
});

QUnit.test("doWhile", (assert) => {
  assert.equal(doWhile(), 21);
});

QUnit.test("doWhileDo", (assert) => {
  assert.equal(doWhileDo(), 27);
});

QUnit.test("earlyExit", (assert) => {
  assert.equal(JSON.stringify(earlyExit([1, 2, 3], 2)), "[1,3]");
  assert.equal(JSON.stringify(earlyExit([1, 2, 3], 4)), "[1,2,3]");
});

QUnit.test("fibonacci", (assert) => {
  assert.equal(fibonacci(0), 0);
  assert.equal(fibonacci(1), 1);
  assert.equal(fibonacci(2), 1);
  assert.equal(fibonacci(3), 2);
  assert.equal(fibonacci(4), 3);
  assert.equal(fibonacci(5), 5);
});

QUnit.test("sil2", (assert) => {
  assert.equal(sil2(2), 25);
});

QUnit.test("fizzBuzz", (assert) => {
  assert.equal(fizzBuzz(1), undefined);
  assert.equal(fizzBuzz(2), undefined);
  assert.equal(fizzBuzz(3), "Fizz");
  assert.equal(fizzBuzz(4), undefined);
  assert.equal(fizzBuzz(5), "Buzz");
  assert.equal(fizzBuzz(15), "FizzBuzz");
});

QUnit.test("forLoopNoDeclare", (assert) => {
  assert.equal(
    JSON.stringify(forLoopNoDeclare(["one", 1, "two", 2])),
    '{"one":1,"two":2}',
  );
});

QUnit.test("foreachLoopArray", (assert) => {
  assert.equal(JSON.stringify(foreachLoopArray([1, 2], 5)), "[6,7]");
});

QUnit.test("foreachLoopObject", (assert) => {
  assert.equal(
    JSON.stringify(foreachLoopObject({ one: 1, two: 2 }, 5)),
    '{"one":6,"two":7}',
  );
});

QUnit.test("generateId", (assert) => {
  assert.equal(generateId(), 1);
  assert.equal(generateId(), 2);
  assert.equal(generateId(), 3);
});

QUnit.test("getSecret", (assert) => {
  assert.equal(getSecret(), 23);
});

QUnit.test("mul", (assert) => {
  assert.equal(mul(3, 4), 12);
});

QUnit.test("questionMerge", (assert) => {
  assert.equal(questionMerge(false, true), 11);
});

QUnit.test("scope3", (assert) => {
  var input = [
    { name: "c", value: 30 },
    { name: "a", value: 10 },
    { name: "b", value: 20 },
  ];
  var output = scope3(input, "name", 29);
  assert.equal(output.result, 40);
  assert.equal(output.found.name, "b");
});

QUnit.test("selectArrow", (assert) => {
  assert.equal(selectArrow(), 10);
});

QUnit.test("selectShortCircuit", (assert) => {
  assert.equal(selectShortCircuit(15), "good");
  assert.equal(selectShortCircuit(25), "bad");
});

QUnit.test("selectWithDefault", (assert) => {
  assert.equal(selectWithDefault(10), "ten");
  assert.equal(selectWithDefault(25), "other");
});

QUnit.test("selectWithoutDefault", (assert) => {
  assert.equal(selectWithoutDefault(5), "ten");
  assert.equal(selectWithoutDefault(25), "thirty");
});

QUnit.test("simpleAnd", (assert) => {
  assert.equal(simpleAnd(false, false, false), false);
  assert.equal(simpleAnd(true, true, true), true);
  assert.equal(simpleAnd(true, false, true), false);
});

QUnit.test("simpleOr", (assert) => {
  assert.equal(simpleOr(false, false, false), false);
  assert.equal(simpleOr(true, true, true), true);
  assert.equal(simpleOr(true, false, true), true);
});

QUnit.test("twoExits", (assert) => {
  assert.equal(twoExits([10, 20, 30], 30), 2);
  assert.equal(twoExits([10, 20, 30], 10), 0);
  assert.equal(twoExits([10, 20, 30], 15), -1);
  assert.equal(twoExits(undefined, 15), -1);
});

QUnit.test("whileDo", (assert) => {
  assert.equal(whileDo(), 21);
});

QUnit.test("inversedOr", (assert) => {
  assert.equal(inversedOr(1, 2, 3), false);
});

QUnit.test("inversedAnd", (assert) => {
  assert.equal(inversedAnd(4, 5, 6), true);
});
