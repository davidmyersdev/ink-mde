// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'

describe('minimal', () => {
  it('runs without errors', async () => {
    vi.spyOn(document, 'getElementById').mockImplementation(() => document.createElement('div'))

    await expect(import('./minimal')).resolves.not.toThrow()
  })
})
