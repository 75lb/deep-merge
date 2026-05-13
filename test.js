import { strict as a } from 'assert'
import deepMerge from '@75lb/deep-merge'

const [test, only, skip] = [new Map(), new Map(), new Map()]

test.set('simple', function () {
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

test.set('deep object properties', function () {
  const result = deepMerge(
    { port: 8000, data: { animal: 'cow' } },
    { stack: ['one'] },
    { stack: ['two'], help: true },
    { data: { animal: 'bat', metal: 'iron' } }
  )
  a.deepEqual(result, {
    port: 8000,
    stack: ['two'],
    help: true,
    data: { animal: 'bat', metal: 'iron' }
  })
})

test.set('arrays: new array does not overwrite if it is empty', function () {
  const stack = ['one']
  const result = deepMerge(
    { stack },
    { stack: [] }
  )
  a.deepEqual(result, { stack: ['one'] })
  a.equal(result.stack, stack)
})

test.set('arrays 2: later array overwrites if it has items', function () {
  const stack = ['one']
  const result = deepMerge(
    { stack: [] },
    { stack }
  )
  a.deepEqual(result, { stack: ['one'] })
  a.equal(result.stack, stack)
})

test.set('arrays 3: later array overwrites if it has items', function () {
  const result = deepMerge(
    { stack: ['two'] },
    { stack: ['one'] }
  )
  a.deepEqual(result, {
    stack: ['one']
  })
})

test.set('new class instance not created', function () {
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

test.set('does not pollute Object.prototype via __proto__', function () {
  const payload = JSON.parse('{"__proto__":{"polluted":"yes"}}')
  deepMerge({}, payload)
  a.equal({}.polluted, undefined)
  a.equal(Object.prototype.polluted, undefined)
})

test.set('does not pollute Object.prototype via nested __proto__', function () {
  const payload = JSON.parse('{"a":{"__proto__":{"polluted":"yes"}}}')
  deepMerge({ a: {} }, payload)
  a.equal({}.polluted, undefined)
  a.equal(Object.prototype.polluted, undefined)
})

export { test, only, skip }
