const TestRunner = require('test-runner')
const a = require('assert')
const deepMerge = require('./')

const runner = new TestRunner()

runner.test('simple', function () {
  const result = deepMerge({ a: 1 }, { b: 2 })
  a.deepEqual({
    a: 1,
    b: 2
  })
})
