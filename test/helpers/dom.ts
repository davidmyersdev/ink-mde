import { vi } from 'vitest'

export const mockAll = () => {
  mockGetElementById()
  mockMatchMedia()
}

export const mockGetElementById = () => {
  vi.spyOn(document, 'getElementById').mockImplementation(() => document.createElement('div'))
}

export const mockMatchMedia = () => {
  // https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}
