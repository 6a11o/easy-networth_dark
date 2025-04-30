import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Define available currencies
export const availableCurrencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
];

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatAmount: (amount: number) => string;
}

const defaultCurrency = availableCurrencies[0]; // USD by default

const CurrencyContext = createContext<CurrencyContextType>({
  currency: defaultCurrency,
  setCurrency: () => {},
  formatAmount: () => "",
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    // Try to load from localStorage on init
    const savedCurrency = localStorage.getItem("preferredCurrency");
    if (savedCurrency) {
      try {
        return JSON.parse(savedCurrency);
      } catch (e) {
        return defaultCurrency;
      }
    }
    return defaultCurrency;
  });

  // Save to localStorage whenever currency changes
  useEffect(() => {
    localStorage.setItem("preferredCurrency", JSON.stringify(currency));
  }, [currency]);

  // Format amount based on current currency
  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.code,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
};
