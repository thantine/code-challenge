
import CurrencyDropdown from './CurrencyDropdown'
import type { BaseProps } from '../typings';

interface Props extends BaseProps {
  label: string;
  readOnly?: boolean;
  amount?: number | string;
  amountInUsd?: number | string;
  onAmountChange?: (amount: number) => void;
}

export default function CurrencyAmountField({ label, amount, amountInUsd, readOnly, currencies, selectedCurrency, onCurrencyChange, onAmountChange }: Props) {
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onAmountChange) {
      onAmountChange(+event.target.value);
    }
  }

  return (
    <>
      <label htmlFor="price" className="block text-sm/6 font-medium text-gray-900">{label}</label>
      <div className="mt-2">
        <div className="flex items-center rounded-md bg-white outline-1 outline-gray-300">
          <input
            type={readOnly ? "text" : "number"}
            placeholder="10.00"
            className="grow py-1.5 pr-3 pl-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none read-only:bg-gray-100 read-only:text-gray-500"
            value={amount}
            readOnly={readOnly}
            onChange={handleAmountChange}
          />
          <div className="grid shrink-0 grid-cols-1 focus-within:relative">
            <CurrencyDropdown currencies={currencies} selectedCurrency={selectedCurrency} onCurrencyChange={onCurrencyChange} />
          </div>
        </div>
        {!readOnly && amountInUsd && <span className="text-sm text-gray-400 mt-2">Amount in USD: ${amountInUsd}</span>}
      </div>
    </>
  )
}
