import type { Currency, CurrencyItem } from "../typings";

export const formatAmount = (amount: number, maxFraction?: number): string => {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: maxFraction || 8,
  });
}

export function getLatestCurrencies(data: Currency[]): CurrencyItem[] {
  // Map to store the latest date for each currency
  const latestMap = new Map<string, Currency>();

  // Iterate and keep only the latest entry for each currency
  data.forEach((item) => {

    if (!item.price) {
      return;
    }

    const current = latestMap.get(item.currency);

    if (!current || new Date(item.date) > new Date(current.date)) {
      latestMap.set(item.currency, item);
    }
  });

  return Array.from(latestMap.values()).map(({ currency, price }) => ({
    currency,
    price,
    iconUrl: `/assets/${currency.toLowerCase()}.svg`
  }));;
}