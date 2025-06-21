import React, { useMemo } from "react";
import Box, { BoxProps } from "@mui/material/Box";
import { useWalletBalances, usePrices } from "./hooks";
import { WalletRow } from "./components";

/**
 * Represents a wallet balance for a specific currency/blockchain.
 * 
 * The code accesses `balance.blockchain`, so we add it here.
 * This property is not defined elsewhere, but is necessary for component logic:
 * - Used for filtering, sorting, and as a React key in this component.
 * - Allows for disambiguation of the same currency across different chains.
 */
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

/**
 * Represents a wallet balance after formatting and value calculation.
 * Extends WalletBalance, adding:
 * - formatted: string version of amount for display
 * - usdValue: number for value in USD
 */
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
  priority: number;
}

/**
 * Props for the WalletPage component.
 * Inherits all BoxProps except 'children' to prevent unused children prop warnings.
 */
interface Props extends Omit<BoxProps, 'children'> { }

/**
 * Returns a numerical priority for sorting blockchains.
 */
const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case "Osmosis": return 100;
    case "Ethereum": return 50;
    case "Arbitrum": return 30;
    case "Zilliqa":
    case "Neo": return 20;
    default: return -99;
  }
};

const WalletPage: React.FC<Props> = (props) => {
  const balances: WalletBalance[] = useWalletBalances(); // assumming the return type of useWalletBallances
  const prices = usePrices();

  /**
   * Memoized list of balances, filtered, formatted and sorted for display.
   * Uses FormattedWalletBalance to ensure type safety and clarity.
   */
  const walletRows = useMemo<FormattedWalletBalance[]>(() => {
    return balances
      .filter(
        (balance) =>
          getPriority(balance.blockchain) > -99 && balance.amount > 0
      )
      .map((balance) => {
        const priority = getPriority(balance.blockchain);
        const usdValue =
          prices && prices[balance.currency]
            ? prices[balance.currency] * balance.amount
            : 0;
        return {
          ...balance,
          priority,
          usdValue,
          formatted: balance.amount.toFixed(2),
        };
      })
      .sort((a, b) => {
        // Sort by priority first, then currency, then blockchain for stable order

        if (b.priority !== a.priority) {
          return b.priority - a.priority;
        }

        const currCmp = a.currency.localeCompare(b.currency);
        if (currCmp !== 0) {
          return currCmp;
        }

        return a.blockchain.localeCompare(b.blockchain);
      });
  }, [balances, prices]);

  return (
    /*
    Appllies the props on the Box component (instead of a native HTML div tag) to prevent invalid DOM attributes, 
      React warnings, and potential bugs.
    */
    <Box {...props}>
      {walletRows.map((row) => (
        <WalletRow
          key={`${row.currency}-${row.blockchain}`} // Ensures unique key even if same currency is in multiple blockchains
          currency={row.currency}
          amount={row.amount}
          blockchain={row.blockchain}
          formatted={row.formatted}
          usdValue={row.usdValue}
        />
      ))}
    </Box>
  );
};

export default WalletPage;

/*
EXPLANATION OF ALL REFACTORING POINTS:

1. **Type Safety and Interface Extension**
   - `FormattedWalletBalance` extends `WalletBalance` and adds `formatted`, `usdValue`, and `priority`.
   - This ensures that the derived wallet row objects are always correctly typed, allowing for safe access to all properties and improved editor/IDE autocomplete and refactoring support.

2. **Key Uniqueness in Lists**
   - The React key for each `WalletRow` is now `${row.currency}-${row.blockchain}`.
   - This prevents duplicate key warnings and bugs, especially if you have the same currency on multiple blockchains.

3. **Efficient Memoization**
   - All filtering, formatting, sorting, and value calculation logic is handled in a single `useMemo`.
   - This avoids unnecessary recalculation and ensures optimal performance for large lists.

4. **Separation of Concerns**
   - All data shaping (filter, map, sort) is done in `walletRows`. The render logic is kept clean and focused on presentation.

5. **Accurate Formatting**
   - `.toFixed(2)` is used for formatted display of amounts, ensuring two decimal places.
   - Formatting is part of the mapped/derived object, making it available wherever needed.

6. **USD Value Calculation**
   - Handles cases where prices may be missing, defaulting to 0 to avoid `NaN` bugs.

7. **Stable Sorting**
   - Rows are sorted by priority, then by currency, then by blockchain for consistent and user-friendly display order.

8. **No Unused Props**
   - The `Props` type omits `children`, keeping the component signature clean and preventing accidental prop leakage.

9. **Documentation**
   - Inline comments and a full explanation block clarify why each design choice was made, aiding future maintainers and reviewers.

10. **Scalability**
    - This approach is easy to extend in the future (e.g., add more properties to `FormattedWalletBalance`).

11. **Material UI Box Usage**
    - Spreads the rest object as props for the Box component (instead of a native HTML div) to prevent invalid DOM attributes, React warnings, and potential bugs.
*/