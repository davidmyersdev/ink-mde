// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mockAll } from '/test/helpers/dom'

describe('autocomplete', () => {
  it('runs without errors', async () => {
    mockAll()

    await expect(import('./autocomplete')).resolves.not.toThrow()
  })
})
