import type { Currency, CurrencyItem } from "../typings";
import { getLatestCurrencies } from "../utils";

/**
 * Fetch currencies from an API endpoint, filter for latest entries, and map to items with iconUrl.
 * @param apiUrl Full URL to the currencies API
 */
export async function fetchCurrencyItems(apiUrl: string): Promise<CurrencyItem[]> {
  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error(`Failed to fetch currencies: ${response.status}`);
  const data: Currency[] = await response.json();
  return getLatestCurrencies(data);
}