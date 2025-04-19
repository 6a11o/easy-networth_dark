export class PremiumFeatureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PremiumFeatureError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
} 