function deepMerge (...args) {
  const assignWith = require('lodash.assignwith')
  const t = require('typical')

  function customiser(objValue, srcValue) {
    if (t.isPlainObject(objValue) && t.isPlainObject(srcValue)) {
      return assignWith(objValue, srcValue, customiser)
    }
  }
   
  return assignWith(...args, customiser)
}

module.exports = deepMerge
