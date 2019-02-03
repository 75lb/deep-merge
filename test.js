const TestRunner = require('test-runner')
const a = require('assert')
const deepMerge = require('./')

const runner = new TestRunner()

runner.test('simple', function () {
  const result = deepMerge({ a: 1 }, { b: 2 })
  a.deepEqual(result, {
    a: 1,
    b: 2
  })
})

runner.test('one level', function () {
  const result = deepMerge(
    { a: 1, c: { d: 'd' } },
    { b: 2 }
  )
  a.deepEqual(result, {
    a: 1,
    b: 2,
    c: {
      d: 'd'
    }
  })
})

runner.test('one level update', function () {
  const result = deepMerge(
    { a: 1, c: { d: 'd' } },
    { a: 2, c: { d: 'e' } },
  )
  a.deepEqual(result, {
    a: 2,
    c: {
      d: 'e'
    }
  })
})
