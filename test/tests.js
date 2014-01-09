test("Factory.define(type, constrFn)", function() {
  expect(2);

  // Check for the right errors to happen
  throws(
    function() {
      Factory.define("player", "not a function");
    },
    /constrFn is not a function/,
    "raises error, constrFn is not a function"
  );

  throws(
    function() {
      Factory.define("player", function() {});
      Factory.define("player", function() {});
    },
    /already defined/,
    "raises error, type was already defined"
  );

});

test("Factory.build(type)", function() {
  expect(2);

  // Check for building objects
  var SimpleObjectConstructor = function() {
    this.name = "simple";
  },
  aSimpleObject = {};

  Factory.define("simple", SimpleObjectConstructor);
  aSimpleObject = Factory.build("simple");

  ok(aSimpleObject, "it builds a object");

  // Check for right errors
  throws(
    function() {
      Factory.build("nonexistent");
    },
    /doesn't exist/,
    "raises error, constructor type doesn't exists"
  );

});

test("Factory.buildList(type, quantity)", function() {
  expect(11);

  // Check for building a list of objects
  var ComputerConstructor = function() {
    this.brand = "Apple";
  },
  computerList = [],
  computersCount = 10,
  i = 0;

  Factory.define("computer", ComputerConstructor).sequence("id").sequence("name");
  computerList = Factory.buildList("computer", computersCount);

  equal(computerList.length, computersCount, "built the right amount of objects");

  for(i = 0; i < computersCount; i += 1) {
    equal(computerList[i].id, i + 1, "progressive id numbers generated by the sequence function");
  }

});
