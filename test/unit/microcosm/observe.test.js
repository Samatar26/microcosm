import Microcosm from '../../../src/microcosm'

describe('Microcosm::observe', function() {
  it('listens to a specific key', function() {
    let repo = new Microcosm()
    let changes = []

    repo.addDomain('color', {
      getInitialState() {
        return 'red'
      }
    })

    repo.observe('color').subscribe(color => {
      changes.push(color)
    })

    repo.patch({ color: 'blue' })

    expect(changes).toEqual(['red', 'blue'])
  })
})
