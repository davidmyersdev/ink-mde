import { describe, expect, it } from 'vitest'
import { mockAll } from '/test/helpers/dom'

describe('hooks', () => {
  it('runs without errors', async () => {
    mockAll()

    await expect(import('./hooks')).resolves.not.toThrow()
  })
})
