// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'

describe('hooks', () => {
  it('runs without errors', async () => {
    vi.spyOn(document, 'getElementById').mockImplementation(() => document.createElement('div'))

    await expect(import('./hooks')).resolves.not.toThrow()
  })
})
