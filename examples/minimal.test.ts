// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mockAll } from '/test/helpers/dom'

describe('minimal', () => {
  it('runs without errors', async () => {
    mockAll()

    await expect(import('./minimal')).resolves.not.toThrow()
  })
})
