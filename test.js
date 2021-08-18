import TestRunner from 'test-runner'
import { strict as a } from 'assert'
import deepMerge from '@75lb/deep-merge'

const tom = new TestRunner.Tom()

tom.test('simple', function () {
  const result = deepMerge(
    { port: 8000 },
    { stack: ['one'] },
    { stack: ['two'], help: true }
  )
  a.deepEqual(result, {
    port: 8000,
    stack: ['two'],
    help: true
  })
})

tom.test('arrays: new array does not overwrite if it is empty', function () {
  const stack = ['one']
  const result = deepMerge(
    { stack },
    { stack: [] }
  )
  a.deepEqual(result, { stack: ['one'] })
  a.equal(result.stack, stack)
})

tom.test('arrays 2: later array overwrites if it has items', function () {
  const stack = ['one']
  const result = deepMerge(
    { stack: [] },
    { stack }
  )
  a.deepEqual(result, { stack: ['one'] })
  a.equal(result.stack, stack)
})

tom.test('arrays 3: later array overwrites if it has items', function () {
  const result = deepMerge(
    { stack: ['two'] },
    { stack: ['one'] }
  )
  a.deepEqual(result, {
    stack: ['one']
  })
})

tom.test('new class instance not created', function () {
  class One {
    something () {}
  }
  const arr = [new One()]
  const result = deepMerge(
    { arr },
    { arr: [] }
  )
  a.equal(result.arr, arr)
})

export default tom
