import Microcosm from '../../src/microcosm'
import { STATUSES } from '../../src/get-registration'

const action = n => n

describe('getRegistration', function() {
  it('can use nested objects to return specific statuses', function() {
    let handler = jest.fn()

    class Repo extends Microcosm {
      register() {
        return {
          [action]: {
            reject: handler
          }
        }
      }
    }

    let repo = new Repo()

    repo.append(action).reject()

    expect(handler).toHaveBeenCalled()
  })

  it.dev('throws if given an invalid status', function() {
    let repo = new Microcosm()

    let fail = function() {
      repo.append(action, 'totally-missing')
    }

    expect(fail).toThrow('Invalid action status totally-missing')
  })

  describe('Action aliasing', function() {
    for (let status in STATUSES) {
      if (status === 'inactive') {
        continue
      }

      let alias = STATUSES[status]

      it(`can inspect the ${status} status`, function() {
        let handler = jest.fn()

        class Repo extends Microcosm {
          register() {
            return {
              [action]: {
                [status]: handler
              }
            }
          }
        }

        let repo = new Repo()

        repo.append(action, status)

        expect(handler).toHaveBeenCalled()
      })

      it(`can register the ${alias} alias`, function() {
        let handler = jest.fn()

        class Repo extends Microcosm {
          register() {
            return {
              [action]: {
                [alias]: handler
              }
            }
          }
        }

        let repo = new Repo()

        repo.append(action, status)

        expect(handler).toHaveBeenCalled()
      })
    }
  })

  it.dev(
    'prints the action name in the warning when a handler is undefined',
    function() {
      let getUser = n => n

      class Repo extends Microcosm {
        register() {
          return {
            [getUser]: undefined
          }
        }
      }

      let repo = new Repo()

      expect(repo.prepare(getUser)).toThrow(
        'getUser key within a registration is undefined. Is it being referenced correctly?'
      )
    }
  )
})
