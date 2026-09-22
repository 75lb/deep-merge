import assignWith from 'lodash/assignWith.js'
import { isPlainObject, isDefined } from 'typical'

/* Every own property name of `Object.prototype` (`__proto__`, `constructor`, `toString`,
`hasOwnProperty`, `valueOf`, `isPrototypeOf`, ...), computed dynamically so newly added
built-ins are covered without maintaining a manual list. `prototype` is kept for the same
reason as before. */
const FORBIDDEN_KEYS = new Set([...Object.getOwnPropertyNames(Object.prototype), 'prototype'])

/* A plain object, checked via its prototype rather than via `typical.isPlainObject`. That
helper is `input.constructor === Object`, so it reports an object carrying an own `constructor`
data key as "not plain" — exactly the shape this guard needs to inspect. */
function isRecord (value) {
  if (value === null || typeof value !== 'object') return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/* Return a copy of `value` with every forbidden key removed, recursing into records.
Sanitising the sources up front (rather than only checking the key inside the customiser) is
what keeps the keys off the merged result: lodash's `assignWith` always assigns whatever the
customiser returns, so returning `previousValue` for a forbidden key would still create an own
property on the result — holding the inherited method, but shadowing it all the same. */
function stripPrototypeKeys (value) {
  if (!isRecord(value)) return value
  const clean = {}
  for (const key of Object.keys(value)) {
    if (FORBIDDEN_KEYS.has(key)) continue
    clean[key] = stripPrototypeKeys(value[key])
  }
  return clean
}

function customiser (previousValue, newValue, key, object, source) {
  /* refuse to merge into prototype-affecting keys */
  if (FORBIDDEN_KEYS.has(key)) {
    return previousValue
  }
  /* deep merge plain objects */
  if (isPlainObject(previousValue) && isPlainObject(newValue)) {
    return assignWith(previousValue, newValue, customiser)
    /* overwrite arrays if the new array has items */
  } else if (Array.isArray(previousValue) && Array.isArray(newValue) && newValue.length) {
    return newValue
    /* ignore incoming arrays if empty */
  } else if (Array.isArray(newValue) && !newValue.length) {
    return previousValue
  } else if (!isDefined(previousValue) && Array.isArray(newValue)) {
    return newValue
  }
}

function deepMerge (target, ...sources) {
  return assignWith(target, ...sources.map(stripPrototypeKeys), customiser)
}

export default deepMerge
