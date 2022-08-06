// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { mockAll } from '/test/helpers/dom'
import { ink } from '/src/index'
import example from '/test/assets/example.md?raw'

describe('ink', () => {
  beforeEach(() => {
    mockAll()
  })

  it('mounts without errors', () => {
    const instance = ink(document.createElement('div'))

    expect(instance).toBeDefined()
  })

  it('matches the given options', () => {
    const instance = ink(document.createElement('div'), {
      doc: '# Hello',
    })

    expect(instance.doc()).toEqual('# Hello')
  })

  it('can be reconfigured', () => {
    const instance = ink(document.createElement('div'), {
      interface: {
        appearance: 'light',
      },
    })

    instance.reconfigure({ interface: { appearance: 'light' } })

    expect(instance.options().interface.appearance).toEqual('light')
  })

  it('matches the snapshot', () => {
    const target = document.createElement('div')

    // Todo: Use a comprehensive starter doc.
    ink(target, {
      doc: example,
      interface: {
        images: true,
        toolbar: true,
      },
    })

    expect(target).toMatchSnapshot()
  })
})
