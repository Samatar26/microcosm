import Microcosm from '../src/microcosm'

describe('indexing', function () {

  test('can save an index for later', function() {
    let repo = new Microcosm(null, { styles: { color: 'red' } })

    repo.reset({ styles: { color: 'red' } })

    repo.index('color', 'styles.color', state => state.styles.color)

    let color = repo.compute('color')

    expect(color).toEqual('red')
  })

  test('computing an index twice returns the same value', function () {
    let repo = new Microcosm({}, { styles: { color: 'red' } })

    repo.index('color', 'styles.color')

    let a = repo.compute('color')
    let b = repo.compute('color')

    expect(a).toBe(b)
  })

  test('updates if state changes', function () {
    let repo = new Microcosm({}, { styles: { color: 'red' } })

    repo.index('color', 'styles.color', state => state.styles.color)

    let a = repo.compute('color')

    repo.patch({ styles: { color: 'blue' } })

    let b = repo.compute('color')

    expect(a).not.toBe(b)
    expect(b).toEqual('blue')
  })

})

describe('compute', function () {

  it('can perform additional data processing on indexes', function () {
    let repo = new Microcosm({}, { styles: { color: 'red' } })

    repo.index('color', 'styles.color', state => state.styles.color)

    let value = repo.compute('color', color => color.toUpperCase())

    expect(value).toEqual('RED')
  })

})

describe('query', function () {

  it('returns the same result if state has not changed', function () {
    let repo = new Microcosm({}, { styles: { color: 'red' } })

    repo.index('color', 'styles.color', state => state.styles.color)

    let query = repo.query('color', color => color.toUpperCase())

    let a = query()
    let b = query()

    expect(a).toEqual('RED')
    expect(a).toBe(b)
  })

  it('returns a new result if state has changed', function () {
    let repo = new Microcosm({}, { styles: { color: 'red' } })

    repo.index('color', 'styles.color', state => state.styles.color)

    let query = repo.query('color', color => color.toUpperCase())

    let a = query()

    repo.patch({ styles: { color: 'blue' }})
    
    let b = query()

    expect(a).toEqual('RED')
    expect(b).toEqual('BLUE')
  })

  it('queries may run multiple processors', function () {
    let repo = new Microcosm({}, { styles: { color: 'red' } })

    repo.index('color', 'styles.color', state => state.styles.color)

    let query = repo.query('color',
                           color => color.toUpperCase(),
                           color => color + ' - test')

    expect(query()).toEqual('RED - test')
  })
})