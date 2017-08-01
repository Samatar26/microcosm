/**
 * @flow
 */

import React from 'react'
import { Action, merge } from '../microcosm'

/* istanbul ignore next */
const identity = () => {}

class ActionButton extends React.PureComponent {
  send: Sender
  click: (event: Event) => Action

  constructor(props: Object, context: ?Object) {
    super(props, context)

    this.send = this.props.send || this.context.send
    this.click = this.click.bind(this)
  }

  static contextTypes = {
    send: identity
  }

  static defaultProps = {
    tag: 'button',
    prepare: (event, value) => value
  }

  click(event: Event): Action {
    let payload = this.props.prepare(event, this.props.value)
    let action = this.send(this.props.action, payload)

    if (action && action instanceof Action) {
      action
        .onOpen(this.props.onOpen)
        .onUpdate(this.props.onUpdate)
        .onCancel(this.props.onCancel)
        .onDone(this.props.onDone)
        .onError(this.props.onError)
    }

    if (this.props.onClick) {
      this.props.onClick(event, action)
    }

    return action
  }

  render() {
    const props = merge(this.props, { onClick: this.click })

    delete props.tag
    delete props.action
    delete props.value
    delete props.onOpen
    delete props.onDone
    delete props.onUpdate
    delete props.onCancel
    delete props.onError
    delete props.send
    delete props.prepare

    if (this.props.tag === 'button' && props.type == null) {
      props.type = 'button'
    }

    return React.createElement(this.props.tag, props)
  }
}

export default ActionButton
