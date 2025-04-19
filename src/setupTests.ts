import '@testing-library/jest-dom'
import * as matchers from '@testing-library/jest-dom/matchers'
import { expect, vi, beforeEach } from 'vitest'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn(),
}

// Set up global localStorage mock
global.localStorage = localStorageMock;

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

// Add any other global test setup here 