# Computational Inefficiencies

- **Redundant Priority Calculations**  
  `getPriority` is called multiple times for the same blockchain within both `.filter()` and `.sort()`, resulting in unnecessary repeated computation.

- **Double Iteration Over Data**  
  The code maps over `sortedBalances` twice: once to build `formattedBalances`, and again to create `rows`, duplicating iteration and work.

- **Unused Computed Array**  
  `formattedBalances` is created but never used, resulting in wasted computation.

- **Incorrect useMemo Dependencies**  
  The `useMemo` for `sortedBalances` depends on both `balances` and `prices`, but only `balances` is necessary, causing unnecessary recomputation.

- **Inline Calculations in Render**  
  The calculation of `usdValue` (`prices[balance.currency] * balance.amount`) is performed inline in every render, which can be expensive and should be memoized if possible.

------------------------------------------------------------------------------------------

# Anti-patterns

- **Accessing Undeclared Properties**  
  The code accesses `balance.blockchain`, but the `WalletBalance` interface does not declare a `blockchain` property.

- **Incorrect Variable Usage**  
  Uses an undeclared variable `lhsPriority` in the filter callback; should use `balancePriority` instead.

- **Unstable Sort Comparator**  
  The sort comparator does not handle the case where priorities are equal, which can lead to unstable sorting.

- **Type Mismatch**  
  The code treats `sortedBalances` as if its elements have a `formatted` field, but only `formattedBalances` does; this leads to potential runtime errors.

- **Using Array Index as React Key**  
  The React list uses the array index as a key, which can cause rendering issues if the array order changes.

- **Incorrect Spread of Props**  
  Spreading `{...rest}` onto a native `<div>` may add invalid DOM attributes, causing React warnings and potential bugs.

- **No Guard for Undefined Values**  
  There’s no check for `prices[balance.currency]` being `undefined`, which can result in `NaN` for `usdValue`.

- **Formatting Amounts Without Precision Control**  
  `.toFixed()` is called with no arguments (defaults to 0 decimal places), which is often inappropriate for currency amounts.

- **Poor Separation of Concerns**  
  All logic (filtering, sorting, formatting, rendering) is implemented within the main component, reducing maintainability and testability.

- **Unused `children` Prop**  
  The component destructures `children` but neither uses nor renders it, leading to confusion for consumers of the component.

---