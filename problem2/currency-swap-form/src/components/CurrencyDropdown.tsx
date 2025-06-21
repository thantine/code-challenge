import { useCallback, useMemo, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import type { BaseProps } from "../typings";

export default function CurrencyDropdown({
  currencies,
  selectedCurrency,
  onCurrencyChange,
}: BaseProps) {
  const [open, setOpen] = useState(false);

  const selectedItem = useMemo(() => {
    if (!currencies.length || !selectedCurrency) {
      return null;
    }
    return currencies.find(item => item.currency === selectedCurrency);
  }, [selectedCurrency, currencies]);

  const dropdownList = useMemo(() => {
    if (!open || !currencies.length) {
      return null;
    }

    return (
      <ul
        className="absolute z-10 mt-1 w-36 p-1.5 border border-gray-300 bg-white shadow-2xl max-h-64 overflow-y-auto"
        role="listbox"
      >
        {currencies.map((item) => (
          <li
            key={item.currency}
            role="option"
            aria-selected={item.currency === selectedCurrency}
            className={`flex items-center gap-2 px-3 py-2 text-base text-gray-700 cursor-pointer hover:bg-indigo-50 ${item.currency === selectedCurrency ? "bg-indigo-100" : ""}`}
            onClick={() => {
              onCurrencyChange(item.currency);
              setOpen(false);
            }}
          >
            <img src={item.iconUrl} alt={item.currency} className="w-5 h-5 rounded-full" />
            <span>{item.currency}</span>
          </li>
        ))}
      </ul>
    )
  }, [open, currencies]);

  const handleDropdownButtonClick = useCallback(() => setOpen(isOpen => !isOpen), [open, setOpen]);

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center gap-2 py-1.5 pr-7 pl-3 rounded-md text-base text-gray-700 focus:outline-none bg-white"
        onClick={handleDropdownButtonClick}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selectedItem && <img src={selectedItem.iconUrl} alt={selectedCurrency} className="w-5 h-5 rounded-full" />}
        <span className="font-medium">{selectedCurrency}</span>
        <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
      </button>
      {dropdownList}
    </div>
  );
}