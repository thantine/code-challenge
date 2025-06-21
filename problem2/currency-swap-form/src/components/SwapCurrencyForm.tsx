import React, { useEffect, useMemo, useState } from "react";
import CurrencyAmountField from "./CurrencyAmountField";
import { ArrowDownIcon } from "@heroicons/react/16/solid";
import type { CurrencyItem } from "../typings";
import { fetchCurrencyItems } from "../services";
import Loading from "./Loading";
import { formatAmount } from "../utils";

const SETTINGS = {
  MAX: 500 // amount in USD
}

export default function SwapTokenForm() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currencyLoading, setCurrencyLoading] = useState(true);
  const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);

  useEffect(() => {
    fetchCurrencyItems('https://interview.switcheo.com/prices.json')
      .then(currencies => {
        setCurrencies(currencies);
        if (currencies.length) {
          setFromCurrency(currencies[0].currency);
          setToCurrency(currencies[0].currency);
        }
      })
      .catch(console.log)
      .finally(() => setCurrencyLoading(false));
  }, []);

  const toAmount = useMemo(() => {
    if (fromCurrency === toCurrency) {
      return formatAmount(amount);
    }

    const to = currencies.find(item => item.currency === toCurrency);
    const from = currencies.find(item => item.currency === fromCurrency);

    if (!from || !to) {
      return formatAmount(0);
    }

    return formatAmount(from.price * amount / to.price);

  }, [amount, fromCurrency, toCurrency]);

  const fromAmountInUsd = useMemo(() => {
    const from = currencies.find(item => item.currency === fromCurrency);

    if (!from) {
      return 0;
    }

    return amount * from.price;
  }, [amount, currencies]);

  const fromAmountError = useMemo(
    () => fromAmountInUsd > SETTINGS.MAX ? `Amount exceeds the maximum allowed swap (${formatAmount(SETTINGS.MAX)})` : '',
    [fromAmountInUsd]
  );

  const formContent = currencyLoading ? <Loading /> : (
    <>
      <CurrencyAmountField
        label="From"
        amount={amount}
        currencies={currencies}
        amountInUsd={formatAmount(fromAmountInUsd, 2)}
        selectedCurrency={fromCurrency}
        onAmountChange={setAmount}
        onCurrencyChange={setFromCurrency} />

      <ArrowDownIcon
        aria-hidden="true"
        className="pointer-events-none size-8 mb-4 mx-auto text-gray-500" />

      <CurrencyAmountField
        readOnly
        label="To"
        amount={toAmount}
        currencies={currencies}
        selectedCurrency={toCurrency}
        onCurrencyChange={setToCurrency} />

      {fromAmountError && (
        <div className="mb-2 text-sm text-red-600">{fromAmountError}</div>
      )}

      <button
        type="submit"
        className="flex items-center justify-center space-x-2 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded 
                disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
        disabled={!!fromAmountError || isSubmitting || !amount || fromCurrency === toCurrency}
      >
        {isSubmitting && <span className="spinner"></span>}
        <span>Swap</span>
      </button>
    </>
  );

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000)
  };

  return (
    <form
      className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md p-8 space-y-6 min-h-[392px]"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-3 text-center">Swap Currency</h2>
      {formContent}
    </form>
  );
}