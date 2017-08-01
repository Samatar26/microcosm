/**
 * @fileoverview Leaf nodes of the comparison tree are queries. A
 * grouping of data subscriptions.
 * @flow
 */

import Emitter from '../emitter'
import { get } from '../utils'
import { getKeyStrings, type KeyPath } from '../key-path'

class Query extends Emitter {
  id: string
  keyPaths: KeyPath[]

  static getId(keyPaths: KeyPath[]) {
    return 'query:' + getKeyStrings(keyPaths)
  }

  constructor(id: string, keys: KeyPath[]) {
    super()

    this.id = id
    this.keyPaths = keys
  }

  extract(state: Object) {
    let len = this.keyPaths.length
    let data = Array(len)

    for (var i = 0; i < len; i++) {
      data[i] = get(state, this.keyPaths[i])
    }

    return data
  }

  trigger(state: Object) {
    this._emit('change', ...this.extract(state))
  }

  isAlone() {
    return this._events.length <= 0
  }
}

export default Query
