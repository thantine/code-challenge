// Three ways to sum to n

// 1: Loop
var sum_to_n_a = function(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

// 2: Recursion
var sum_to_n_b = function(n) {
  if (n <= 1) return n;
};

// 3: Mathematical formula
var sum_to_n_c = function(n) {
  return n * (n + 1) / 2;
};  