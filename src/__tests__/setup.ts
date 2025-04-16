import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { TextDecoder, TextEncoder } from 'util';

// Add globals that jsdom doesn't provide
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock localStorage using Object.defineProperty instead of direct assignment
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true
}); 