export interface Currency {
  currency: string;
  price: number;
  date: string; // ISO string
};

export type CurrencyItem = Omit<Currency, 'date'> & {
  iconUrl: string;
};

export interface BaseProps {
  currencies: CurrencyItem[];
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
}