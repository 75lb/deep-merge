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

test.set('does not overwrite Object.prototype methods with data keys', function () {
  const result = deepMerge({}, { toString: 'EVIL', hasOwnProperty: 'nope', valueOf: 'nope' })
  a.equal(result.toString, Object.prototype.toString)
  a.equal(result.hasOwnProperty, Object.prototype.hasOwnProperty)
  a.equal(result.valueOf, Object.prototype.valueOf)
  a.equal(typeof result.toString, 'function')
  a.equal(`${result}`, '[object Object]')
  a.equal(Object.prototype.hasOwnProperty.call(result, 'toString'), false)
})

test.set('does not overwrite Object.prototype methods at any depth', function () {
  const result = deepMerge({ a: { b: {} } }, { a: { b: { toString: 'EVIL', isPrototypeOf: 'EVIL' } } })
  a.equal(result.a.b.toString, Object.prototype.toString)
  a.equal(result.a.b.isPrototypeOf, Object.prototype.isPrototypeOf)
  a.equal(`${result.a.b}`, '[object Object]')
})

test.set('blocks the full Object.prototype key set, including future built-ins', function () {
  const source = {}
  for (const key of Object.getOwnPropertyNames(Object.prototype)) source[key] = 'EVIL'
  const result = deepMerge({}, source)
  for (const key of Object.getOwnPropertyNames(Object.prototype)) {
    a.equal(Object.prototype.hasOwnProperty.call(result, key), false, `key ${key} became an own property of the result`)
  }
  a.equal(typeof result.toString, 'function')
  a.equal(Object.prototype.polluted, undefined)
  a.equal({}.polluted, undefined)
})

test.set('keeps legitimate data keys', function () {
  const result = deepMerge({ a: { one: 1 } }, { a: { two: 2 }, b: 3 })
  a.deepEqual(result, { a: { one: 1, two: 2 }, b: 3 })
})

test.set('constructor key does not stop the merge, and is not carried over', function () {
  const result = deepMerge({ a: { one: 1 } }, { a: { constructor: 'EVIL', two: 2 } })
  a.deepEqual(result, { a: { one: 1, two: 2 } })
  a.equal(Object.prototype.hasOwnProperty.call(result.a, 'constructor'), false)
  a.equal(result.a.constructor, Object)
})

test.set('does not mutate the source objects', function () {
  const source = { a: { toString: 'EVIL' } }
  deepMerge({}, source)
  a.equal(source.a.toString, 'EVIL')
})

export { test, only, skip }
