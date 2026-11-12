---
summary: Math is JavaScript's built-in library of numeric functions and constants — min and max, powers and roots, logarithms, trigonometry, rounding and random numbers. You will learn how each group behaves at its edges, why Math.round(-2.5) is -2, how to pick random integers and shuffle without bias, and when Math.random must be replaced by the Web Crypto API.
difficulty: beginner
minutes: 55
objectives:
  - Use Math.min, Math.max, Math.hypot, Math.atan2 and the logarithm functions correctly, including their empty-input and precision edge cases
  - Compare Math.floor, Math.ceil, Math.trunc and Math.round on positive and negative inputs and choose the right one for paging, display and integer conversion
  - Explain why rounding to decimal places with Math.round(x * 100) / 100 fails for values like 1.005 and choose a correct alternative
  - Generate uniformly distributed random integers and unbiased shuffles, and explain why sort(() => Math.random() - 0.5) is biased
  - Decide when to use crypto.getRandomValues or crypto.randomUUID instead of Math.random
---

## Introduction

Sooner or later every frontend needs arithmetic beyond `+` and `*`. A chart needs axis ticks at "nice" values like 0, 20, 40. A carousel wraps around and needs to clamp an index. A game rotates a sprite to face the mouse pointer. A pagination bar needs the number of pages. A quiz shuffles its questions. An avatar component picks a random background colour.

JavaScript provides these operations through a single built-in object called **`Math`**: a collection of constants such as `Math.PI` and functions such as `Math.max`, `Math.sqrt`, `Math.round` and `Math.random`. It is not a class and you never create one; you call its functions directly.

Most `Math` functions do exactly what their names suggest. The value of this lesson is in the edges where they do not: `Math.max()` with no arguments returns `-Infinity`; `Math.sin(Math.PI)` is not `0`; `Math.round(-2.5)` is `-2`; `Math.round(1.005 * 100) / 100` is `1`, not `1.01`; and `Math.random()` must never be used for passwords or tokens. Two topics are large enough to have their own sections — [[b1-rounding]] and [[b1-random]] — and each can be read on its own.

## Before you start

- **Number representation** — numbers are 64-bit doubles, decimal fractions are stored approximately, and the special values `NaN`, `Infinity` and `-0` exist. See [[b1-number-representation]] and [[b1-nan-infinity]].
- **Arithmetic operators** — including the exponent operator `**` and the remainder operator `%`. See [[b1-arithmetic-operators]].
- **Type coercion** — `Math` functions convert their arguments to numbers, which follows the rules in [[b1-type-coercion]].
- **Spread syntax** — `Math.max(...array)` passes array elements as separate arguments. See [[b1-spread-rest]].

## The intuition

Think of `Math` as a drawer of calculator buttons. You do not build a new calculator each time; you open the drawer and press the button you need: `Math.sqrt(16)`, `Math.max(3, 7)`. The buttons are labelled with the same names used in mathematics and in other languages — Java's `Math` class was the model, so `Math.floor`, `Math.pow` and `Math.random` will look familiar if you have used Java.

The drawer analogy also explains what `Math` is *not*. It holds no state between calls (except the hidden state of the random number generator), it does not know about bigints, and it does not do decimal arithmetic. Every button takes doubles in and gives doubles out, with all the rounding behaviour described in [[b1-floating-point]].

## What Math is

`Math` is an ordinary object whose properties happen to be functions and constants. It is not a constructor and not a function:

```javascript title="math-object.js"
try { new Math(); } catch (e) { console.log(e.name + ': ' + e.message); }
try { Math(); } catch (e) { console.log(e.name + ': ' + e.message); }
console.log(typeof Math, Object.prototype.toString.call(Math));
console.log(Math.PI, Math.E, Math.SQRT2, Math.LN2);
```

```output
TypeError: Math is not a constructor
TypeError: Math is not a function
object [object Math]
3.141592653589793 2.718281828459045 1.4142135623730951 0.6931471805599453
```

Grouping the functions on one object keeps names like `sin`, `max` and `round` out of the global scope, where they would clash with your own variables. The constants are the double closest to each mathematical value: `PI`, `E` (Euler's number), `SQRT2`, `SQRT1_2`, `LN2`, `LN10`, `LOG2E` and `LOG10E`. They are read-only.

### Arguments are converted to numbers

Every `Math` function converts its arguments with the same rules as `Number()`, so non-numbers do not throw — they become numbers, often `NaN`:

```javascript title="math-coercion.js"
console.log(Math.abs('-5'), Math.abs('x'), Math.abs(null), Math.abs(undefined), Math.abs([-3]));
console.log(Math.max(1, '3'), Math.max(1, NaN), Math.max(1, undefined), Math.max(1, null, -1));
try { Math.abs(5n); } catch (e) { console.log(e.name + ': ' + e.message); }
```

```output
5 NaN 0 NaN 3
3 NaN NaN 1
TypeError: Cannot convert a BigInt value to a number
```

`null` becomes `0`, `undefined` becomes `NaN`, and a one-element array becomes its element. A single `NaN` among the arguments makes the whole result `NaN`, because `NaN` cannot be ordered against anything. The one type that is refused outright is bigint: `Math` functions are defined only for numbers, and silently converting a large bigint could lose precision (see [[b1-bigint]]). The practical consequence: validate input *before* it reaches `Math`, because `Math` will not tell you something was wrong — it will give you `NaN` or a wrong number.

## Minimum and maximum

`Math.max(a, b, …)` returns the largest argument and `Math.min` the smallest. With **no** arguments they return `-Infinity` and `Infinity` respectively:

```javascript title="min-max.js"
console.log(Math.max(), Math.min(), Math.max(...[]), Math.min(...[4, 2, 8]));
console.log([].reduce((best, x) => Math.max(best, x), -Infinity));
try { [].reduce((best, x) => Math.max(best, x)); } catch (e) { console.log(e.name + ': ' + e.message); }
const clamp = (x, lo, hi) => Math.min(Math.max(x, lo), hi);
console.log(clamp(120, 0, 100), clamp(-5, 0, 100), clamp(42, 0, 100));
```

```output
-Infinity Infinity -Infinity 2
-Infinity
TypeError: Reduce of empty array with no initial value
100 0 42
```

The empty results look strange until you think of them as **identity values**. `-Infinity` is the value that loses to everything in a "largest" contest, so it is the correct starting point: `Math.max(Math.max(), 5)` is `5`, just as adding `0` leaves a sum unchanged. The danger is in application code, where an empty list of prices silently produces a "highest price" of `-Infinity` that is then rendered as text. Decide explicitly what an empty input should mean — usually `null` or a message — and check `array.length` first.

To find the maximum of an array, `Math.max(...arr)` spreads the elements as arguments. That works for typical arrays, but every argument occupies space on the call stack, and very large arrays exceed the engine's limit. In Node.js 22, spreading 100,000 elements worked and 200,000 threw `RangeError: Maximum call stack size exceeded`; the exact limit differs between engines and stack sizes. For data of unknown size, use a loop or `reduce` with `-Infinity` as the initial value, which has no such limit.

The last two lines show **clamping**, one of the most common uses of `min` and `max` together: keep a value inside a range, such as a slider position between 0 and 100 or a carousel index between 0 and `length - 1`. There is no built-in `Math.clamp` in ES2023, so this one-line helper appears in almost every codebase.

## Powers, roots and distances

`Math.pow(base, exponent)` and the operator `base ** exponent` (ES2016) compute powers and give the same results for numbers. The operator has two syntax rules worth knowing: it is right-associative, and it refuses an unparenthesised unary minus on its left, because `-2 ** 2` is ambiguous (mathematicians read it as −4, many programmers expect 4), so it is a `SyntaxError` and you must write `(-2) ** 2` or `-(2 ** 2)`. `**` also works on bigints (`2n ** 64n`), while `Math.pow` throws for them.

```javascript title="powers.js"
console.log(2 ** 10, Math.pow(2, 10), 2 ** 3 ** 2, (2 ** 3) ** 2, 2 ** -1, 4 ** 0.5);
console.log(Math.sqrt(16), Math.sqrt(-1), Math.cbrt(-8), (-8) ** (1 / 3));
console.log(Math.hypot(3, 4), Math.hypot(3, 4, 12));
console.log(Math.hypot(1e200, 1e200), Math.sqrt((1e200) ** 2 + (1e200) ** 2));
```

```output
1024 1024 512 64 0.5 2
4 NaN -2 NaN
5 13
1.414213562373095e+200 Infinity
```

`2 ** 3 ** 2` is `2 ** 9` = 512 because the right-hand `**` is evaluated first. `Math.sqrt(-1)` is `NaN` because there is no real square root. The pair on the second line is a classic trap: `(-8) ** (1 / 3)` is `NaN`, not `-2`, because `1 / 3` is not exactly one third, and raising a negative number to a non-integer power has no real result. `Math.cbrt` computes the cube root directly and handles negatives.

`Math.hypot(a, b, …)` returns the square root of the sum of squares — the length of the hypotenuse, or the distance between two points when you pass `x2 - x1` and `y2 - y1`. It exists for two reasons: readability, and range. Squaring `1e200` overflows to `Infinity` before the square root can bring it back down, while `hypot` scales its inputs internally and returns the right answer. For screen coordinates this rarely matters, but it is the reason the function exists and a common interview follow-up.

## Logarithms and exponentials

`Math.log(x)` is the natural logarithm (base *e*), and `Math.log2` and `Math.log10` give base 2 and base 10 directly. `Math.exp(x)` is *e*ˣ. The edge cases follow mathematics: `Math.log(0)` is `-Infinity` and `Math.log(-1)` is `NaN`.

```javascript title="logs.js"
console.log(Math.log(Math.E), Math.log10(1000), Math.log2(1024), Math.log(0), Math.log(-1));
console.log(Math.log(1000) / Math.LN10, Math.floor(Math.log(1000) / Math.LN10));
console.log(Math.log1p(1e-15), Math.log(1 + 1e-15));
console.log(Math.expm1(1e-10), Math.exp(1e-10) - 1);
```

```output
1 3 10 -Infinity NaN
2.9999999999999996 2
9.999999999999995e-16 1.110223024625156e-15
1.00000000005e-10 1.000000082740371e-10
```

The second line shows why the dedicated functions exist. Computing log₁₀(1000) by the change-of-base formula `Math.log(x) / Math.LN10` gives `2.9999999999999996`, because both the logarithm and the constant are rounded; `Math.floor` then turns it into `2`. Code that counts digits or picks a unit ("KB" versus "MB") with that formula is wrong at exact powers of ten. `Math.log10` and `Math.log2` were added in ES2015 to avoid exactly this. Even so, floating-point logarithms are approximations: to count the digits of an integer, `String(n).length` is exact.

The last two lines show `Math.log1p(x)` (log of 1 + x) and `Math.expm1(x)` (eˣ − 1). For tiny `x`, computing `1 + x` first throws away most of `x`'s digits, because 1 + 10⁻¹⁵ cannot be stored precisely. These functions compute the result without forming `1 + x`, and are used in finance (continuously compounded rates) and statistics.

## Trigonometry

`Math.sin`, `Math.cos`, `Math.tan` and their inverses `Math.asin`, `Math.acos`, `Math.atan` work in **radians**, not degrees. A full circle is 2π radians, so degrees convert with `deg * Math.PI / 180`.

```javascript title="trig.js"
console.log(Math.sin(Math.PI / 2), Math.sin(Math.PI), Math.cos(Math.PI / 2));
console.log(Math.sin(30), Math.sin(30 * Math.PI / 180));
console.log(Math.atan2(1, 1) * 180 / Math.PI, Math.atan2(-1, -1) * 180 / Math.PI);
console.log(Math.atan(-1 / -1) * 180 / Math.PI);
```

```output
1 1.2246467991473532e-16 6.123233995736766e-17
-0.9880316240928618 0.49999999999999994
45 -135
45
```

`Math.sin(Math.PI)` is not zero because `Math.PI` is not exactly π — it is the nearest double — and the sine of a number slightly off π is slightly off zero. Never test trigonometric results with `===`. `Math.sin(30)` treats 30 as radians (about 4.77 full turns) and returns a meaningless value for anyone who meant 30°.

The last two lines show why **`Math.atan2(y, x)`** is the function you want for angles in UIs. Given the vector from an element's centre to the mouse pointer, `atan2` returns the angle in the correct quadrant, from −π to π. `Math.atan(y / x)` loses the signs when it divides: the vectors (1, 1) and (−1, −1) point in opposite directions, but `y / x` is `1` for both, so `atan` returns 45° for both. Note the argument order — `y` first. In screen coordinates *y* grows downward, so angles increase clockwise, which matches CSS `rotate()`.

## Signs and integer helpers

A few smaller functions round out the drawer:

```javascript title="helpers.js"
console.log(Math.sign(-3), Math.sign(0), Math.sign(-0), Math.sign('7'), Math.sign('x'));
console.log(Math.abs(-7.5), Object.is(Math.abs(-0), 0));
console.log(Math.imul(0x7fffffff, 2), 0x7fffffff * 2, Math.clz32(1), Math.fround(5.05));
```

```output
-1 0 -0 1 NaN
7.5 true
-2 4294967294 31 5.050000190734863
```

`Math.sign` returns `1`, `-1`, `0` or `-0` (preserving the sign of zero) and `NaN` for non-numbers. `Math.abs` turns `-0` into `0`. The last line shows three specialised helpers. `Math.imul` multiplies as 32-bit integers with wraparound, which is what hash functions and pseudo-random generators written in C expect. `Math.clz32` counts leading zero bits in a 32-bit integer. `Math.fround` rounds to the nearest single-precision float, the format stored in a `Float32Array`. These are explained with the bitwise operators in [[b1-bitwise-operators]] and with typed arrays in [[b1-number-representation]].

```quiz
Q: What does `Math.max(...prices)` return when `prices` is an empty array?
- [ ] `0`
- [ ] `undefined`
- [x] `-Infinity`
- [ ] It throws a TypeError
> Math.max with no arguments returns -Infinity, the identity value for "largest": anything is larger than it. That is mathematically convenient but rarely what a UI should show, so check for an empty array first. Only reduce without an initial value throws on an empty array.

Q: Why is `Math.atan2(dy, dx)` preferred over `Math.atan(dy / dx)` for rotating an element toward the pointer?
- [ ] atan2 works in degrees
- [x] atan2 uses the signs of both arguments to return the angle in the correct quadrant
- [ ] atan cannot handle negative numbers
- [ ] atan2 is more precise for small angles
> Dividing dy by dx discards the individual signs, so opposite directions such as (1, 1) and (-1, -1) give the same ratio and the same atan result. atan2 receives dy and dx separately and returns an angle from -π to π. Both functions work in radians.
```

## Rounding {#b1-rounding}

**Rounding** turns a number with a fractional part into a nearby whole number (or a number with fewer decimal places). JavaScript provides four functions that round to whole numbers — `Math.floor`, `Math.ceil`, `Math.trunc` and `Math.round` — and each moves in a different direction. Choosing the wrong one gives off-by-one page counts, prices that are a cent off, and negative values that round "the wrong way".

### Four directions on the number line

Picture the number line. `Math.floor(x)` moves **down** (toward −∞) to the nearest integer. `Math.ceil(x)` moves **up** (toward +∞). `Math.trunc(x)` moves **toward zero**, which means it simply chops off the fractional digits. `Math.round(x)` moves to the **nearest** integer, and on an exact half it moves **up** (toward +∞).

```javascript title="rounding-table.js"
const xs = [2.4, 2.5, 2.6, -2.4, -2.5, -2.6];
console.log('x     floor ceil trunc round');
for (const x of xs) {
  console.log(String(x).padEnd(5), String(Math.floor(x)).padEnd(5), String(Math.ceil(x)).padEnd(4),
    String(Math.trunc(x)).padEnd(5), Math.round(x));
}
```

```output
x     floor ceil trunc round
2.4   2     3    2     2
2.5   2     3    2     3
2.6   2     3    2     3
-2.4  -3    -2   -2    -2
-2.5  -3    -2   -2    -2
-2.6  -3    -2   -2    -3
```

For positive numbers, `floor` and `trunc` agree. For negative numbers they differ: `Math.floor(-2.4)` is `-3` because −3 is *below* −2.4, while `Math.trunc(-2.4)` is `-2` because it drops the fraction. If you mean "the integer part", use `trunc`; if you mean "the largest integer not greater than x" — as in index arithmetic — use `floor`.

The `round` column has the famous surprise: `Math.round(-2.5)` is `-2`, not `-3`. The specification defines `Math.round` as "the integer closest to x; if two integers are equally close, the one closer to +∞". On a tie it always moves up the number line, so `2.5 → 3` but `-2.5 → -2`. School rounding usually means *half away from zero*, which would give −3. Neither is wrong; they are different rules, and you must know which one your code uses. Other languages differ too: Java's `Math.round` also rounds half up toward +∞, while Python 3's `round` and C#'s `Math.Round` default to half-to-even.

### Edge cases worth knowing

```javascript title="rounding-edges.js"
console.log(Math.round(0.5), Math.round(1.5), Math.round(-0.5), Math.round(-1.5));
console.log(Object.is(Math.round(-0.4), -0), Object.is(Math.ceil(-0.5), -0));
console.log(new Intl.NumberFormat('en-US').format(Math.round(-0.3)), `${Math.round(-0.3)}°C`);
const x = 0.49999999999999994;
console.log(Math.round(x), Math.floor(x + 0.5));
console.log(Math.round('2.5'), Math.round(null), Math.round(NaN), Math.round(Infinity));
```

```output
1 2 -0 -1
true true
-0 0°C
0 1
3 0 NaN Infinity
```

**Negative zero.** Rounding a small negative number toward zero produces `-0`, not `0`. Template literals and `String()` print `-0` as `"0"`, so you rarely notice — but `Intl.NumberFormat` prints it as `"-0"`, which makes a weather widget show "−0°C". If that matters, normalise with `x === 0 ? 0 : x` (which works because `-0 === 0`). Negative zero is covered in [[b1-nan-infinity]].

**`Math.round` is not `Math.floor(x + 0.5)`.** That formula is a common description of rounding, but it fails when `x + 0.5` itself rounds: 0.49999999999999994 plus 0.5 is not representable and rounds up to exactly 1. `Math.round` is specified on the exact value and correctly returns 0.

**Coercion and special values.** Like all `Math` functions, the rounding functions convert strings (`'2.5'` → 3) and pass `NaN` and `Infinity` through unchanged. A `NaN` page number is a sign that unvalidated input reached the calculation.

### Rounding to decimal places

None of the four functions takes a "number of decimals" argument. The common workaround scales, rounds and scales back: `Math.round(x * 100) / 100`. It fails for values whose stored double is just below a half, because the multiplication exposes the error:

```javascript title="round-decimals.js"
const naive = (x, d) => Math.round(x * 10 ** d) / 10 ** d;
const eps = (x, d) => Math.round((x + Number.EPSILON) * 10 ** d) / 10 ** d;
const viaString = (x, d) => Number(Math.round(Number(x + 'e' + d)) + 'e-' + d);
for (const x of [1.005, 1.255, 10.075, 2.675]) {
  console.log(String(x).padEnd(7), String(x * 100).padEnd(19),
    naive(x, 2), eps(x, 2), viaString(x, 2), x.toFixed(2));
}
```

```output
1.005   100.49999999999999  1 1.01 1.01 1.00
1.255   125.49999999999999  1.25 1.26 1.26 1.25
10.075  1007.4999999999999  10.07 10.07 10.08 10.07
2.675   267.5               2.68 2.68 2.68 2.67
```

Read the second column first: `1.005 * 100` is `100.49999999999999`, so `Math.round` gives 100 and the result is `1`, not `1.01`. This is the stored-value problem from [[b1-floating-point]], not a bug in `Math.round`.

The third column adds `Number.EPSILON` before scaling, a popular fix found on Stack Overflow. It repairs `1.005` and `1.255` but fails for `10.075`, because epsilon is the gap between doubles at 1 and is too small to matter at 10. A fixed nudge cannot be right at every magnitude.

The fourth column uses exponent notation in a string: `'1.005' + 'e2'` is `'1.005e2'`, which `Number` parses directly as 100.5 — the decimal digits you wrote, shifted, without a binary multiplication in between. This works for every row because it rounds the *shortest decimal representation* of the number. Its limits: it breaks for numbers that already print in exponent notation (`1e-7 + 'e2'` is `'1e-7e2'`, which is `NaN`), and it is a string trick that must be explained in a comment.

The last column shows `toFixed`, which rounds the exact binary value. It agrees with the naive version on the first three rows and disagrees on `2.675`: the stored value is just below 2.675, so `toFixed` rounds down, while the multiplication `2.675 * 100` happened to round up to exactly 267.5 and the naive version rounded that up again. (`toFixed` is covered in [[b1-number-methods]].)

The real lesson: **rounding decimal fractions stored as doubles is inherently fragile.** For display, format with `Intl.NumberFormat` (which has `maximumFractionDigits` and a `roundingMode` option in current engines). For money, keep integer cents so the only rounding is of one well-defined intermediate result, such as tax, using an explicit policy.

### Choosing a rounding rule

Different domains need different tie-breaking rules. Here are the two you are most likely to implement yourself, on top of `Math.round`:

```javascript title="rounding-modes.js"
function roundHalfEven(x) {
  const r = Math.round(x);                    // ties go toward +Infinity
  const isTie = Math.abs(x % 1) === 0.5;
  return isTie && r % 2 !== 0 ? r - 1 : r;     // move odd tie results down to even
}
const roundHalfAwayFromZero = (x) => Math.sign(x) * Math.round(Math.abs(x));
for (const x of [0.5, 1.5, 2.5, -1.5, -2.5, 2.4, -2.6]) {
  console.log(String(x).padEnd(5), String(Math.round(x)).padEnd(3),
    String(roundHalfEven(x)).padEnd(3), roundHalfAwayFromZero(x));
}
```

```output
0.5   1   0   1
1.5   2   2   2
2.5   3   2   3
-1.5  -1  -2  -2
-2.5  -2  -2  -3
2.4   2   2   2
-2.6  -3  -3  -3
```

**Half away from zero** (the last column) is symmetric: −2.5 becomes −3 just as 2.5 becomes 3. It matches what most people learned at school and is common for displayed values. **Half to even**, also called **banker's rounding** (the third column), sends ties to the nearest even integer, so over many values half of the ties go up and half go down. That removes the upward bias that "always up on .5" introduces into large sums, which is why it is the default in IEEE 754 arithmetic itself, in Python 3 and in many accounting systems. Apply these helpers to integer-scaled values (cents, tenths) where ties are exact; on arbitrary doubles, a value like 2.675 is not a true tie.

### Rounding in everyday UI code

- **Number of pages:** `Math.ceil(totalItems / pageSize)`. 101 items at 10 per page need 11 pages; `round` would give 10 and hide the last item.
- **Which page an item is on:** `Math.floor(index / pageSize)` for zero-based indexes.
- **Random index or grid cell from a coordinate:** `Math.floor`, because it maps the whole interval [k, k + 1) to k, including for negative coordinates.
- **Dropping a fraction:** `Math.trunc(x)`. Avoid `x | 0` and `~~x`: they convert to a 32-bit integer first and wrap around beyond ±2,147,483,647 (see [[b1-bitwise-operators]]).
- **Pixel snapping:** `Math.round` for positions, so that an element at 10.5px is drawn crisply at a whole pixel.

## Random Numbers {#b1-random}

A **random number generator** produces values that cannot be predicted from earlier ones. JavaScript's built-in `Math.random()` returns a floating-point number from 0 (inclusive) up to but not including 1 — the interval written **[0, 1)**. Everything else — random integers, random array elements, shuffles — is built from that one function. It is fast and good enough for games, animations and sampling, but it is **not** suitable for anything security-related, where the Web Crypto API must be used instead.

### What `Math.random` really is

`Math.random` is a **pseudo-random number generator (PRNG)**: a deterministic algorithm that produces a sequence of numbers that look random, starting from a hidden internal state called the **seed**. The specification requires only that results are approximately uniformly distributed in [0, 1) and that different realms (for example, different iframes) get different sequences. It does not specify the algorithm. V8, the engine in Chrome and Node.js, has used xorshift128+ since 2015; other engines use similar fast generators.

Two consequences follow. First, you cannot seed `Math.random`, so you cannot reproduce a sequence for tests or replays — you need your own PRNG for that, shown below. Second, a PRNG designed for speed is not designed to resist prediction: with enough outputs, an attacker can reconstruct the internal state of xorshift128+ and predict every future value. Anything an attacker benefits from guessing — session tokens, password-reset codes, API keys, lottery draws — must use a **cryptographically secure** generator.

### Random integers in a range

To pick an integer from `min` to `max` inclusive, scale the [0, 1) value to the width of the range, floor it, and shift it:

```javascript title="rand-int.js"
function randomInt(min, max) {            // min and max are integers, inclusive
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const pick = (items) => items[randomInt(0, items.length - 1)];
const rolls = Array.from({ length: 10000 }, () => randomInt(1, 6));
console.log(Math.min(...rolls), Math.max(...rolls));
console.log(typeof pick(['red', 'green', 'blue']));
```

```output
1 6
string
```

The rolls themselves differ on every run, so the program prints only properties that are always true: across 10,000 rolls the smallest value is 1 and the largest is 6. Here is why the formula is right. With `min = 1` and `max = 6`, `max - min + 1` is 6, the number of possible outcomes. `Math.random() * 6` is a value in [0, 6). `Math.floor` maps [0, 1) to 0, [1, 2) to 1, and so on up to [5, 6) to 5 — six intervals of equal width, so six equally likely results. Adding `min` shifts 0–5 to 1–6. Because `Math.random()` never returns exactly 1, the product never reaches 6, and 7 is impossible.

The `+ 1` is the part people forget. `Math.floor(Math.random() * (max - min)) + min` can never return `max`.

### Why `Math.round` gives a biased result

A tempting alternative is `Math.round(Math.random() * (max - min)) + min`. It produces the right *range* but the wrong *distribution*. For a range of 0 to 2:

| Result | Values of `Math.random() * 2` that round to it | Width | Probability |
|---|---|---|---|
| 0 | [0, 0.5) | 0.5 | 25% |
| 1 | [0.5, 1.5) | 1.0 | 50% |
| 2 | [1.5, 2) | 0.5 | 25% |

The two end values get half-width intervals, so they come up half as often as each middle value. `Math.floor` with the `+ 1` gives every result an interval of width exactly 1, which is why it is the correct choice.

### Shuffling: Fisher–Yates, not `sort`

To shuffle an array so that every ordering is equally likely, use the **Fisher–Yates shuffle** (also called the Knuth shuffle). Walk from the last position to the first; at each position `i`, pick a random index `j` from 0 to `i` and swap the two elements. Every element has an equal chance of landing in each position, and the algorithm takes O(n) time.

A widespread shortcut is `array.sort(() => Math.random() - 0.5)`: a comparator that randomly answers "less" or "greater". It is biased, because sorting algorithms assume the comparator is consistent — if `a < b` and `b < c` then `a < c` — and a random comparator breaks that assumption in ways that favour some orderings. To show the difference reproducibly, this program uses a small seeded PRNG called mulberry32 instead of `Math.random`, so the counts are identical every time you run it (in Node.js 22):

```javascript title="shuffle-bias.js"
function mulberry32(seed) {               // small seeded PRNG returning [0, 1)
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function fisherYates(arr, random) {
  const a = arr.slice();                  // do not mutate the caller's array
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));   // 0 <= j <= i
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const sortShuffle = (arr, random) => arr.slice().sort(() => random() - 0.5);
function tally(shuffle, trials) {
  const rand = mulberry32(42);
  const counts = {};
  for (let t = 0; t < trials; t++) {
    const key = shuffle(['A', 'B', 'C'], rand).join('');
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.keys(counts).sort().map((k) => `${k}:${counts[k]}`).join(' ');
}
console.log('fisher-yates', tally(fisherYates, 60000));
console.log('sort-based  ', tally(sortShuffle, 60000));
```

```output
fisher-yates ABC:10084 ACB:9915 BAC:10019 BCA:9784 CAB:10017 CBA:10181
sort-based   ABC:22598 ACB:3851 BAC:7388 BCA:3794 CAB:3660 CBA:18709
```

With three elements there are six orderings, so a fair shuffle produces each about 10,000 times in 60,000 trials, and Fisher–Yates does. The sort-based version produces `ABC` — the original order — more than twice as often as it should and some orderings at barely a third of the expected rate. The exact skew depends on the engine's sorting algorithm, so other browsers show a different pattern, but no engine makes it fair. In a quiz app this means the first question stays first far too often; in anything involving prizes or fairness it is a real defect.

Two implementation details matter in Fisher–Yates. `j` must range over `0..i` *including* `i` (hence `i + 1`), so an element may stay where it is; restricting `j` to `0..i-1` produces a different, biased algorithm. And a fresh random number is needed for every position — reusing one value for all swaps produces only a handful of possible outcomes.

### Seeded generators for tests and replays

The `mulberry32` function above is an example of a **seeded PRNG**: given the same seed, it produces the same sequence. That is exactly what `Math.random` cannot do, and it is useful whenever you need reproducibility — procedural game levels shared by a seed, deterministic visual-regression tests, or replaying a bug report.

```javascript title="seeded.js"
function mulberry32(seed) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const a = mulberry32(42);
console.log(a(), a(), a());
const b = mulberry32(42);
console.log(b());
```

```output
0.6011037519201636 0.44829055899754167 0.8524657934904099
0.6011037519201636
```

Notice the design of `fisherYates(arr, random)` above: the random source is a parameter. That makes the function testable — production passes `Math.random`, tests pass a seeded generator or a stub that returns fixed values — instead of asserting on output that changes every run. Seeded generators like mulberry32 are for reproducibility only; they are no more secure than `Math.random`.

### Secure randomness with Web Crypto

For anything security-sensitive, use the **Web Crypto API**, available as the global `crypto` in all modern browsers and in Node.js 19 and later. It draws from the operating system's cryptographically secure random source.

- `crypto.getRandomValues(typedArray)` fills an integer typed array (such as `Uint8Array` or `Uint32Array`) with random values, at most 65,536 bytes per call.
- `crypto.randomUUID()` returns a random version 4 UUID string such as `"3b241101-e2bb-4255-8caf-4136c566a962"`. In browsers it is only available in secure contexts (HTTPS or `localhost`).

Turning random bits into an integer in a range needs care. `x % 6` on a random 32-bit value is very slightly biased, because 2³² is not a multiple of 6: the lowest remainders occur one extra time. For security-relevant choices, discard values from the uneven tail and draw again — **rejection sampling**:

```javascript title="secure-random.js"
function secureRandomInt(min, max) {               // inclusive range
  const range = max - min + 1;
  if (!Number.isSafeInteger(range) || range <= 0 || range > 2 ** 32) {
    throw new RangeError('range must be 1 to 2^32');
  }
  const limit = 2 ** 32 - (2 ** 32 % range);        // largest multiple of range
  const buf = new Uint32Array(1);
  let x;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);                             // reject the biased tail
  return min + (x % range);
}
const token = Array.from(crypto.getRandomValues(new Uint8Array(16)),
  (b) => b.toString(16).padStart(2, '0')).join('');
console.log(secureRandomInt(1, 6) >= 1, token.length, crypto.randomUUID().length);
```

```output
true 32 36
```

`limit` is the largest multiple of `range` that fits in 32 bits; every value below it maps onto the range evenly, and the rare value at or above it is thrown away. The token is 16 random bytes (128 bits) written as 32 hexadecimal characters, a typical size for a session or reset token. In practice, security tokens should be generated on the server, but the same API is used there in Node.js.

## How it works internally

`Math` is one of the specification's well-known intrinsic objects (`%Math%`), created once per realm, with `Object.prototype` as its prototype and no `[[Call]]` or `[[Construct]]` behaviour — which is why calling or constructing it throws.

Each function begins by converting its arguments with ToNumber, which is where `'3'`, `null` and arrays become numbers and where a bigint throws. `Math.max` and `Math.min` convert *every* argument first and only then compare, so an argument with a side-effecting `valueOf` runs even if an earlier argument was `NaN`.

Precision is specified unevenly. Functions such as `Math.floor`, `Math.ceil`, `Math.trunc`, `Math.round`, `Math.abs`, `Math.sign`, `Math.max` and `Math.min` have exact definitions and give identical results everywhere. Most of the others — `sin`, `cos`, `exp`, `log`, `pow` and friends — are **implementation-approximated**: the specification asks for a close approximation and allows the last bits to differ between engines, and occasionally between operating systems. Results are extremely close but not guaranteed to be bit-for-bit identical. This rarely matters in a UI, but it does if you need bit-identical results across machines — lockstep multiplayer games, deterministic simulations, or hashing computed numbers — in which case avoid those functions in the deterministic core or implement them yourself.

Engines treat `Math` functions as **intrinsics**: the optimising compiler recognises calls like `Math.floor(x)` or `Math.sqrt(x)` and replaces them with single machine instructions when it can prove `x` is a number. That is why idioms like `x | 0` are no longer faster in practice, and why readability should decide. (The compiler pipeline is described in [[b1-parsing-jit]].)

## Worked example: nice axis ticks for a chart

Charting libraries do not label axes at `0, 17.4, 34.8, 52.2`; they choose round steps like 1, 2, 5, 10, 20 or 50. Computing those "nice" ticks uses logarithms, powers, floor and ceil together, and it shows how floating-point noise sneaks into results.

```javascript title="nice-ticks.js"
function niceTicks(dataMin, dataMax, targetCount = 5) {
  const rough = (dataMax - dataMin) / targetCount;
  const magnitude = 10 ** Math.floor(Math.log10(rough));   // power of ten at or below rough
  const residual = rough / magnitude;                      // between 1 and 10
  const nice = residual > 5 ? 10 : residual > 2 ? 5 : residual > 1 ? 2 : 1;
  const step = nice * magnitude;
  const start = Math.floor(dataMin / step);                // integer tick indexes
  const end = Math.ceil(dataMax / step);
  const decimals = Math.max(0, -Math.floor(Math.log10(step)));
  const ticks = [];
  for (let i = start; i <= end; i++) {
    ticks.push(Number((i * step).toFixed(decimals)));     // strip float noise
  }
  return ticks;
}
console.log(niceTicks(0, 87));
console.log(niceTicks(-3.2, 14.7));
console.log(niceTicks(0.012, 0.078));
console.log(niceTicks(0, 0.5));
console.log([0, 1, 2, 3, 4, 5].map((i) => i * 0.1));
```

```output
[ 0, 20, 40, 60, 80, 100 ]
[ -5, 0, 5, 10, 15 ]
[ 0, 0.02, 0.04, 0.06, 0.08 ]
[ 0, 0.1, 0.2, 0.3, 0.4, 0.5 ]
[ 0, 0.1, 0.2, 0.30000000000000004, 0.4, 0.5 ]
```

Trace the first call, data from 0 to 87 with about five ticks:

1. `rough` is 87 / 5 = 17.4, the step we would use if we did not care about round numbers.
2. `Math.log10(17.4)` is about 1.24; `Math.floor` gives 1, so `magnitude` is 10¹ = 10. This separates the size of the step from its leading digits.
3. `residual` is 17.4 / 10 = 1.74, which is between 1 and 2, so the nice multiplier is 2 and `step` is 20.
4. `Math.floor(0 / 20)` is 0 and `Math.ceil(87 / 20)` is 5, so the ticks run from index 0 to 5. `floor` and `ceil` make sure the axis *covers* the data — the lowest tick is at or below the minimum and the highest at or above the maximum. Using `round` here could cut off the top of the chart.

The second call shows why `floor` (not `trunc`) is used for the start: `Math.floor(-3.2 / 5)` is −1, giving a first tick of −5 below the data. `Math.trunc` would give 0 and the lowest values would fall off the axis.

The last line explains the `toFixed` step. Multiplying an integer by 0.1 produces values like `0.30000000000000004`, which would appear on the axis as a long label. The code counts the decimals the step needs — `-Math.floor(Math.log10(0.1))` is 1 — and rounds each tick to that many places. It also computes each tick as `i * step` from an integer `i` rather than repeatedly adding `step`, so errors do not accumulate across ticks.

## In real systems

- **Charting and data visualisation.** Libraries such as D3 compute ticks much as above (D3's `ticks` uses 1, 2 and 5 multiples of powers of ten) and use `Math.log10`, `Math.pow` and careful rounding to avoid labels like `0.30000000000000004`.
- **Pagination and virtual lists.** `Math.ceil(total / pageSize)` for page counts; virtualised lists compute the first visible row with `Math.floor(scrollTop / rowHeight)` and clamp it with `Math.min`/`Math.max`.
- **Animation and games.** Easing curves use `Math.sin`, `Math.cos` and `Math.pow`; rotating toward a target uses `Math.atan2`; collision checks use `Math.hypot`. Engines that must stay in sync across players use fixed-point integers or seeded PRNGs.
- **A/B testing and sampling.** Client-side sampling of analytics events uses `Math.random() < 0.01`. Assigning users to experiment groups, however, is usually done by hashing a stable user ID, so the same user always sees the same variant.
- **Security tokens.** CSRF tokens, OAuth `state` and PKCE verifiers in single-page apps are generated with `crypto.getRandomValues` or `crypto.randomUUID`, never `Math.random`.

## Trade-offs and alternatives

| Need | Use | Avoid |
|---|---|---|
| Largest of a large array | Loop or `reduce(…, -Infinity)` | `Math.max(...arr)` (stack limit) |
| Integer part | `Math.trunc` | `x \| 0`, `~~x` (32-bit wraparound) |
| Page count | `Math.ceil` | `Math.round` |
| Displaying decimals | `Intl.NumberFormat` | `Math.round(x * 100) / 100` on raw doubles |
| Money arithmetic | Integer cents + explicit rounding policy | Rounding fractional dollars |
| Games, animation, sampling | `Math.random` | — |
| Reproducible randomness | Seeded PRNG (mulberry32, or a library) | `Math.random` (cannot be seeded) |
| Tokens, passwords, IDs that must not be guessed | `crypto.getRandomValues`, `crypto.randomUUID` | `Math.random`, seeded PRNGs |
| Bit-identical results across machines | Integer or fixed-point arithmetic | `Math.sin`, `Math.exp`, `Math.pow` |

`Math` is fast, always available and familiar, which makes it the right default for ordinary numeric work. Its limits are the double format underneath it, the lack of decimal and bigint support, and a random generator that is neither seedable nor secure. Each limit has a standard alternative, listed above.

## Common mistakes

**Passing degrees to trigonometric functions.** `Math.sin(90)` is not 1. Convert with `deg * Math.PI / 180`.

**Comparing trigonometric or logarithmic results with `===`.** `Math.sin(Math.PI)` is about 1.2e-16. Use a tolerance.

**Using `Math.round` where the domain needs `floor` or `ceil`.** Page counts, tick ranges and "how many boxes do I need" questions need `ceil`; index-from-coordinate questions need `floor`.

**Assuming `Math.round` rounds half away from zero.** `Math.round(-2.5)` is −2. Use `Math.sign(x) * Math.round(Math.abs(x))` if you need symmetric rounding.

**Rounding to decimals with `Math.round(x * 100) / 100`.** `1.005` becomes `1`. Keep values in integer units, or format for display with `Intl.NumberFormat`.

**Generating random integers with `Math.round` or without `+ 1`.** The ends become half as likely, or `max` can never appear. Use `Math.floor(Math.random() * (max - min + 1)) + min`.

**Shuffling with `sort(() => Math.random() - 0.5)`.** Biased and engine-dependent. Use Fisher–Yates.

**Using `Math.random` for tokens or IDs.** Its output can be predicted. Use `crypto.getRandomValues` or `crypto.randomUUID`.

**Spreading huge arrays into `Math.max`.** Throws `RangeError` beyond an engine-specific size. Use a loop.

## Interview perspective

`Math` questions usually test edge cases and whether you can build correct randomness from `Math.random`.

> [!INTERVIEW] "What does Math.round(-2.5) return, and why?"
> "`-2`. `Math.round` returns the closest integer and, on an exact tie, the one toward positive infinity — so 2.5 goes to 3 and −2.5 goes to −2. It's not 'half away from zero'. If I need symmetric rounding I'd write `Math.sign(x) * Math.round(Math.abs(x))`, and for financial rounding I'd use an explicit policy like half-to-even on integer cents."

> [!INTERVIEW] "Write a function that shuffles an array uniformly."
> "I'd use Fisher–Yates: loop `i` from the last index down to 1, pick `j = Math.floor(Math.random() * (i + 1))`, and swap `a[i]` and `a[j]`. It's O(n) and every permutation is equally likely. I'd avoid `sort(() => Math.random() - 0.5)` because a random comparator is inconsistent and the result is biased in an engine-dependent way. If fairness matters for security — a lottery, say — I'd draw `j` from `crypto.getRandomValues` with rejection sampling."

Other questions to prepare:

- **`Math.max()` with no arguments?** `-Infinity` — the identity for maximum. Follow-up: how do you find the max of a million-element array? A loop, because spreading can overflow the stack.
- **Difference between `Math.floor` and `Math.trunc`?** They differ for negatives: `floor(-2.5)` is −3, `trunc(-2.5)` is −2.
- **Random integer between `min` and `max` inclusive?** `Math.floor(Math.random() * (max - min + 1)) + min`; explain why `round` is biased.
- **Is `Math.random()` secure?** No — it is a fast PRNG (xorshift128+ in V8) whose state can be recovered from outputs; use Web Crypto.
- **Why does `Math.hypot` exist?** Readability and avoiding overflow or underflow when squaring large or tiny values.
- **Why is `(-8) ** (1/3)` NaN?** `1/3` is not exactly a third, and a negative base with a non-integer exponent has no real result; use `Math.cbrt`.

## Practice

1. **Predict, then run.** `Math.round(-0.5)`, `Math.ceil(-0.1)`, `Math.trunc('7.9')`, `Math.max([1, 2])`, `Math.max(...[1, 2])`, `Math.min(null, 1)`, `Math.sign(-0)`, `Math.floor(-0)`, `Math.hypot()`, `Math.atan2(0, -1)`.
2. **Pagination.** Write `pageInfo(total, pageSize, page)` returning `{ pageCount, firstIndex, lastIndex }`, handling `total = 0` and clamping `page` into range.
3. **Rounding modes.** Implement `roundTo(cents, step, mode)` for integer cents where `step` is 5 (round to the nearest 5 cents, as in cash rounding) and `mode` is `'halfUp'`, `'halfEven'` or `'halfAwayFromZero'`. Test it on negative values.
4. **Weighted random.** Write `weightedPick(items)` where `items` is `[{ value, weight }]`, using one call to `Math.random()` and a running sum. Verify the distribution with a seeded PRNG over 100,000 draws.
5. **Secure password.** Using `secureRandomInt`, generate a 16-character password from a 62-character alphabet. Explain why `alphabet[byte % 62]` with raw bytes would be biased.
6. **Rotate toward the pointer.** Given an element's centre `(cx, cy)` and a pointer `(px, py)`, compute the CSS `rotate()` angle in degrees with `Math.atan2`, and explain the effect of screen y-coordinates growing downward.

```quiz
Q: What does `Math.round(-2.5)` return?
- [ ] -3, because .5 rounds away from zero
- [x] -2, because ties round toward positive infinity
- [ ] -2, because Math.round uses banker's rounding
- [ ] -3, because Math.round is Math.floor(x + 0.5)
> The specification says Math.round picks the closest integer and, on a tie, the one closer to +∞, so -2.5 goes up to -2. It is not banker's rounding — Math.round(1.5) is 2 and Math.round(2.5) is 3. And Math.floor(-2.5 + 0.5) would also be -2; the "away from zero" rule is what school arithmetic often uses, not JavaScript.

Q: Why does `Math.round(1.005 * 100) / 100` return `1` instead of `1.01`?
- [ ] Math.round always rounds .5 down
- [x] 1.005 is stored slightly below 1.005, so 1.005 * 100 is 100.49999999999999
- [ ] Division by 100 truncates the result
- [ ] Math.round only works on integers
> The literal 1.005 becomes the nearest double, which is just below 1.005. Multiplying by 100 exposes that error, and Math.round correctly rounds 100.49999999999999 down to 100. Math.round(100.5) would give 101; the rounding rule is fine, the input is not what it looks like.

Q: Which expression returns a uniformly distributed integer from 1 to 6 inclusive?
- [ ] `Math.round(Math.random() * 5) + 1`
- [ ] `Math.floor(Math.random() * 5) + 1`
- [x] `Math.floor(Math.random() * 6) + 1`
- [ ] `Math.ceil(Math.random() * 6)`
> Math.random() * 6 is in [0, 6); floor splits it into six equal-width intervals 0-5, and + 1 shifts to 1-6. The round version gives 1 and 6 half the probability of the others; the floor-by-5 version can never return 6; and the ceil version returns 0 in the rare case Math.random() returns exactly 0.

Q: A password-reset page generates its token with `Math.random().toString(36).slice(2)`. What is the main problem?
- [ ] The token is too short to be unique
- [ ] toString(36) produces characters that are invalid in URLs
- [x] Math.random is not cryptographically secure, so tokens can be predicted
- [ ] Math.random can return 1, producing an empty token
> Math.random is a fast PRNG; observing some outputs lets an attacker reconstruct its state and predict future tokens. Security tokens must come from crypto.getRandomValues or crypto.randomUUID (ideally generated on the server). Math.random never returns 1, and base-36 characters are URL-safe.
```

## Quick revision {#quick-revision}

- `Math` is a namespace object (not a constructor or function); constants `PI`, `E`, `SQRT2`, `SQRT1_2`, `LN2`, `LN10`, `LOG2E`, `LOG10E`.
- All functions apply ToNumber to arguments: `'3'` → 3, `null` → 0, `undefined` → `NaN`; bigint throws; any `NaN` argument → `NaN`.
- `Math.max()` → `-Infinity`, `Math.min()` → `Infinity`. Spreading huge arrays can throw `RangeError`; use a loop/`reduce(…, -Infinity)`. Clamp: `Math.min(Math.max(x, lo), hi)`.
- `**` ≡ `Math.pow` for numbers; right-associative; `-2 ** 2` is a SyntaxError; `**` works with bigint. `(-8) ** (1/3)` → `NaN`; use `Math.cbrt`.
- `Math.hypot` avoids overflow when squaring; `Math.log10`/`log2` beat `log(x)/LN10` at exact powers; `log1p`/`expm1` for tiny x.
- Trig in radians; `Math.sin(Math.PI)` ≈ 1.2e-16; `Math.atan2(y, x)` (y first) gives the correct quadrant.
- Rounding: `floor` → −∞, `ceil` → +∞, `trunc` → 0, `round` → nearest, ties → +∞ (`round(-2.5)` = −2). Can produce `-0` (Intl shows "-0").
- `Math.round(x * 100) / 100` fails for 1.005; `+ Number.EPSILON` fails at larger magnitudes (10.075); exponent-string trick works on the shortest decimal; prefer integer units or `Intl.NumberFormat`.
- Half away from zero: `Math.sign(x) * Math.round(Math.abs(x))`. Half to even (banker's) avoids bias in sums.
- Pages: `Math.ceil(total / size)`; index → page: `Math.floor`. Don't truncate with `| 0`.
- `Math.random()` → [0, 1), unseeded PRNG (V8: xorshift128+), not secure. Integer: `Math.floor(Math.random() * (max - min + 1)) + min`. `round` biases the ends.
- Shuffle with Fisher–Yates (`j` in `0..i`), never `sort(() => Math.random() - 0.5)`. Inject the RNG for tests; use a seeded PRNG for reproducibility.
- Security: `crypto.getRandomValues` (≤ 65,536 bytes per call), `crypto.randomUUID` (secure contexts); rejection sampling avoids modulo bias.
- `sin`, `exp`, `log`, `pow` are implementation-approximated — last bits can differ across engines.

## Key takeaways {#key-takeaways}

- `Math` is a static toolbox of double-precision functions; it coerces arguments silently, so validate input before calling it.
- Know the empty and special cases: `Math.max()` is `-Infinity`, trigonometry uses radians, and transcendental results are approximations never to be compared with `===`.
- Pick the rounding direction deliberately: `floor` for indexes, `ceil` for counts, `trunc` for "drop the fraction", `round` for nearest — remembering that `Math.round` sends ties toward +∞.
- Rounding decimal fractions held in doubles is fragile; keep money in integer units and use `Intl.NumberFormat` for display.
- Build random integers with `Math.floor(Math.random() * (max - min + 1)) + min` and shuffle with Fisher–Yates; both are uniform, while the `round` and `sort` shortcuts are biased.
- `Math.random` is for games and sampling only; tokens and anything an attacker could exploit need `crypto.getRandomValues` or `crypto.randomUUID`.
