import { availableCurrencies } from '@/context/CurrencyContext';

// This would typically be replaced with a real API call to get current exchange rates
// For now, we'll use a simple mock conversion table
const mockExchangeRates: Record<string, number> = {
  'USD': 1,
  'EUR': 0.93,
  'GBP': 0.80,
  'JPY': 151.63,
  'CAD': 1.37,
  'AUD': 1.53,
  'CNY': 7.24,
  'INR': 83.30,
  'BRL': 5.05,
  'AED': 3.67,
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  if (fromCurrency === toCurrency) return amount;
  
  const fromRate = mockExchangeRates[fromCurrency];
  const toRate = mockExchangeRates[toCurrency];
  
  if (!fromRate || !toRate) {
    console.error(`Invalid currency code: ${fromCurrency} or ${toCurrency}`);
    return amount;
  }
  
  // Convert to USD first, then to target currency
  const amountInUSD = amount / fromRate;
  return amountInUSD * toRate;
};

export const formatAmountWithCurrency = (amount: number, currencyCode: string): string => {
  const currency = availableCurrencies.find(c => c.code === currencyCode);
  if (!currency) return `${amount}`;
  
  return `${currency.symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}; 