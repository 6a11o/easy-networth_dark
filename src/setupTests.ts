import '@testing-library/jest-dom'
import * as matchers from '@testing-library/jest-dom/matchers'
import { expect, vi } from 'vitest'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

// Set up global localStorage mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Add any other global test setup here 