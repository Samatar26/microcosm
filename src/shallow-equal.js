const hasOwn = Object.prototype.hasOwnProperty

/**
 * @private
 */
export default function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true
  }

  if ((objA && !objB) || (!objA && objB)) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }

  // Test for A's keys different from B.
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false
    }
  }

  return true
}
