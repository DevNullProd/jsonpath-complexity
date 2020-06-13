var assert = require('assert');
var jpc = require('../');

suite('complexity', function() {
  test('invalid jsonpath expression', function() {
    assert.throws(function() { jpc.complexity("$(") }, /Invalid expression/);
  })

  test('simple expression with no filter or script expressions', function() {
    const expected = {
       components : 2,
      expressions : 0,
            unary : 0,
           binary : 0,
          logical : 0
    }

    assert.deepEqual(jpc.complexity("$.a"), expected)
  });

  test('expression with filter and script expressions', function() {
    const expected = {
       components : 4,
      expressions : 2,
            unary : 0,
           binary : 0,
          logical : 0
    }

    assert.deepEqual(jpc.complexity("$.a[(@.b)][?(@.c)]"), expected)
  })

  test('filter and script expressions with unary, binary, and logical expressions', function() {
    const expected = {
       components : 4,
      expressions : 2,
            unary : 1,
           binary : 2,
          logical : 3
    }

    assert.deepEqual(jpc.complexity("$.a[(@.b + 1 == 5)][?(@.c && @d || !@.e || @.f)]"), expected)
  })

});
