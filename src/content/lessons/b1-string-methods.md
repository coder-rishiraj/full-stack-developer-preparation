---
summary: JavaScript strings come with a toolbox of methods for changing case, searching, extracting, replacing, splitting and trimming text. You will learn the handful of rules every method follows, how each family behaves at its edges, and how to combine them into reliable text-processing pipelines without the classic `indexOf`, `substring` and `replace` bugs.
difficulty: beginner
minutes: 50
objectives:
  - Explain the rules all string methods share — they never mutate, they use code-unit positions, and they convert their arguments
  - Choose between `indexOf`, `includes`, `startsWith`, `endsWith` and `search`, and avoid the "found at index 0" bug
  - Extract text with `slice`, `substring` and `at`, and predict their results for negative, swapped and out-of-range arguments
  - Use `replace`, `replaceAll`, replacement patterns and replacement functions correctly, including with untrusted input
  - Split and trim text, and predict `split` results for empty strings, limits and regular-expression separators
  - Combine methods into pipelines that clean, parse and normalise real input
---

## Introduction

Much of the code in a web application is text processing. A sign-up form trims the e-mail address and lower-cases it before checking whether the account exists. A router splits `/users/42/orders` into segments. A search box checks whether a product name includes what the user typed. A blog turns "Hello, World!" into the URL slug `hello-world`. A logger pads numbers so columns line up.

JavaScript provides around fifty methods on `String.prototype` for this work. You do not need to memorise all of them — but you do need to know the dozen that appear in almost every codebase, and you need to know exactly how they behave at their edges, because that is where bugs live. What does `indexOf` return when the text is at the very start? What does `substring(5, 2)` do? Why does `replace('a', 'b')` change only the first `a`? Why does a dollar sign in a user's name corrupt the output of `replace`?

This lesson starts with the rules every string method shares, then works through the method families one at a time. Three of them have their own nested sections, which can be read on their own: [[b1-string-search|searching]], [[b1-string-extract|extracting]], and [[b1-string-replace|replacing, splitting and trimming]]. The lesson ends by combining them into pipelines that clean and parse real input.

## Before you start

- **String basics** — strings are immutable primitives, and indexes count UTF-16 code units. See [[b1-string-creation]] and its section [[b1-string-indexing]].
- **Autoboxing** — how a primitive can have methods. See [[b1-autoboxing]]; you need only the idea that calling `'abc'.toUpperCase()` works through a temporary wrapper.
- **Truthy and falsy values** — why `0` and `''` count as false in an `if`. See [[b1-truthy-falsy]]; it explains the most common search bug.
- **Arrays** — `split` returns an array and `join` turns one back into a string. See [[b1-array-basics]].

A few examples use **regular expressions** — patterns such as `/\d+/g` that describe text. You can follow this lesson without knowing their syntax; each pattern is explained where it appears, and the full topic is in [[b1-regex-basics]] and [[b1-regex-methods]].

## The intuition

Think of string methods as a workshop full of tools that each take a piece of text and hand you back something new — a different string, a number, a boolean or an array. No tool ever alters the piece you handed in. If you want to keep the result, you have to catch it: store it in a variable, pass it on, or return it.

That is why string code tends to read as a **pipeline**: `input.trim().toLowerCase().replace(...)`. Each method receives the previous method's result and returns a new string for the next one. The original `input` passes through untouched, and only the final result is stored.

The second half of the intuition is that every position you pass to or receive from these tools is an index into the string's UTF-16 code units, counted from zero. A "range" is always **half-open**: it includes the start index and excludes the end index, the same convention as Python's slices and array `slice`. `'JavaScript'.slice(0, 4)` covers indexes 0, 1, 2 and 3 — four code units, `'Java'`.

## Rules every string method follows

Four rules apply across the whole toolbox. Knowing them lets you predict methods you have never used.

**1. Methods never mutate.** Strings are immutable ([[b1-immutability-primitives]]), so every method returns a new value. Calling `name.trim()` without using the result has no effect.

**2. Positions are code-unit indexes in half-open ranges.** `indexOf` returns a code-unit index; `slice(start, end)` includes `start` and excludes `end`. For ASCII text that is the same as "characters"; for emoji it is not (see [[b1-unicode-strings]]).

**3. Arguments are converted.** A search argument is converted to a string, and a position argument is converted to an integer. This usually helps — `'abc'.slice('1')` works — but it creates surprises with missing arguments:

```javascript title="argument-conversion.js"
console.log('JavaScript'.slice('2', '5'), 'JavaScript'.slice(1.7, 3.2));
console.log('null pointer'.includes(null));
console.log('undefined'.indexOf(), 'abc'.includes());
```

```output
vaS av
true
0 false
```

Fractional positions are truncated toward zero, so `slice(1.7, 3.2)` behaves like `slice(1, 3)`. A search for `null` searches for the text `'null'`. Calling `indexOf()` with no argument searches for the text `'undefined'` — it is found at index 0 in the string `'undefined'`, and not found in `'abc'`. If a variable you meant to search for is accidentally `undefined`, these methods will not throw; they will search for the word "undefined".

**4. Methods are generic.** Each method converts its `this` value to a string first, so it works on anything that can become a string. This is mostly a curiosity, but it explains an error message you will see:

```javascript title="generic-methods.js"
console.log(String.prototype.slice.call(12345, 1, 3));
console.log(String.prototype.toUpperCase.call(true));
let missing;
try {
  missing.trim();
} catch (err) {
  console.log(err.constructor.name + ': ' + err.message);
}
```

```output
23
TRUE
TypeError: Cannot read properties of undefined (reading 'trim')
```

The number `12345` becomes `'12345'` before slicing. `null` and `undefined` cannot be converted to an object, so calling any method on them throws — and the error comes from the property lookup, before the method even runs. When you see "Cannot read properties of undefined (reading 'trim')", the bug is that the variable holding your string was never set.

## A map of the toolbox

| Family | Methods | Returns |
|---|---|---|
| Case | `toLowerCase`, `toUpperCase`, `toLocaleLowerCase`, `toLocaleUpperCase` | new string |
| Searching | `indexOf`, `lastIndexOf`, `includes`, `startsWith`, `endsWith`, `search`, `match`, `matchAll` | index, boolean, or match data |
| Extracting | `slice`, `substring`, `at`, `charAt`, (`substr`, legacy) | new string |
| Replacing | `replace`, `replaceAll` | new string |
| Splitting and joining | `split` (and the array method `join`) | array (string) |
| Trimming | `trim`, `trimStart`, `trimEnd` | new string |
| Building | `padStart`, `padEnd`, `repeat`, `concat` | new string |
| Comparing | `localeCompare`, `normalize` | number, new string |

The building methods — `padStart`, `padEnd`, `repeat` and `concat` — were introduced in [[b1-string-creation]]. Comparison and normalisation are covered in [[b1-comparison-operators]] and [[b1-unicode-strings]].

## Changing case

`toLowerCase()` and `toUpperCase()` return a copy of the string with every letter converted. Their main job in application code is **case-insensitive comparison**: convert both sides to the same case, then compare.

```javascript title="case.js"
const typed = 'Ada@Example.COM';
const stored = 'ada@example.com';
console.log(typed === stored, typed.toLowerCase() === stored.toLowerCase());

console.log('straße'.toUpperCase(), 'straße'.toUpperCase().length);
console.log('TITLE'.toLowerCase(), 'TITLE'.toLocaleLowerCase('tr'));
```

```output
false true
STRASSE 7
title tıtle
```

The first line is the everyday use. The next two show that case conversion is a Unicode operation, not a simple letter swap. The German `ß` has no single upper-case form in standard conversion, so it becomes `SS` and the string gets *longer* — code that assumes `s.toUpperCase().length === s.length` is wrong. And case rules depend on language: in Turkish, upper-case `I` lowers to a dotless `ı`. The plain methods use language-neutral rules; the `toLocale…` versions accept a locale tag such as `'tr'`.

For comparing user-visible text without regard to case or accents, `localeCompare` with a sensitivity option is more robust than lower-casing:

```javascript title="locale-compare.js"
console.log('résumé'.localeCompare('Resume', 'en', { sensitivity: 'base' }));
console.log('apple'.localeCompare('Banana', 'en'));
```

```output
0
-1
```

A result of `0` means "equal under these rules"; negative means the first string sorts before the second. `sensitivity: 'base'` ignores case and accents, so "résumé" and "Resume" compare equal.

## Searching strings {#b1-string-search}

Searching answers two kinds of question: *is* this text present, and *where* is it? JavaScript has separate methods for each, and confusing them is the source of one of the most common bugs in the language.

### `indexOf` and `lastIndexOf`: where is it?

`str.indexOf(search)` returns the index of the first occurrence of `search` in `str`, or **`-1`** if it does not occur. `lastIndexOf` returns the index of the last occurrence. Both accept an optional second argument giving the position to start from.

```javascript title="index-of.js"
const s = 'JavaScript';
console.log(s.indexOf('a'), s.indexOf('a', 2), s.indexOf('z'));
console.log(s.lastIndexOf('a'), s.lastIndexOf('a', 2));
console.log(s.indexOf('Script'), s.indexOf('script'));
```

```output
1 3 -1
3 1
4 -1
```

`indexOf('a', 2)` starts looking at index 2 and finds the second `a` at index 3. `lastIndexOf('a', 2)` searches *backwards* from index 2 and finds the `a` at index 1. The last line shows that all searching is **case-sensitive**: `'script'` with a lower-case `s` is not found.

The return value is designed so that every valid result, including `0`, means "found". `0` means found at the very start. That interacts badly with truthiness:

```javascript title="index-of-bug.js"
const command = '/help';
if (command.indexOf('/')) {
  console.log('looks like a command');
} else {
  console.log('not a command?');
}
console.log(command.indexOf('/'), Boolean(command.indexOf('/')));
console.log(Boolean('abc'.indexOf('z')));
```

```output
not a command?
0 false
true
```

The slash is at index 0, `0` is falsy, so the `if` takes the wrong branch. And the opposite case is equally wrong: "not found" is `-1`, which is truthy. Using `indexOf` directly as a condition is backwards in both directions. If you need `indexOf`, compare explicitly: `indexOf(x) !== -1`. Better still, use the boolean methods.

### `includes`, `startsWith` and `endsWith`: is it there?

These three (added in ES2015) return `true` or `false`, which is what a condition wants:

```javascript title="boolean-search.js"
const s = 'JavaScript';
console.log(s.includes('Script'), s.startsWith('Java'), s.endsWith('pt'));
console.log(s.includes('Script', 5), s.startsWith('Script', 4), s.endsWith('Java', 4));
console.log(s.includes(''), s.toLowerCase().includes('script'));
```

```output
true true true
false true true
true true
```

Each accepts a position. For `includes` and `startsWith`, it is where to start looking: `startsWith('Script', 4)` asks "does the text starting at index 4 begin with `Script`?". For `endsWith` the position is where the string should be treated as *ending*: `endsWith('Java', 4)` considers only the first four code units. Every string includes the empty string, so `includes('')` is always `true`. For case-insensitive search, lower-case both sides.

These methods search for **literal text**. Passing a regular expression is an error rather than a silent conversion, because the designers wanted to prevent the confusion of `startsWith(/a./)` being treated as the text `'/a./'`:

```javascript title="no-regex.js"
try {
  'JavaScript'.startsWith(/J/);
} catch (err) {
  console.log(err.constructor.name + ': ' + err.message);
}
console.log('a.b'.includes('.'));
```

```output
TypeError: First argument to String.prototype.startsWith must not be a regular expression
true
```

The upside is that characters like `.`, `*` and `?` have no special meaning — `includes('.')` looks for a literal dot, so there is nothing to escape.

### `search`, `match` and `matchAll`: pattern search

When you need to find text by **pattern** rather than exact content — "the first run of digits", "a word starting with a capital" — use a regular expression. `search(regex)` is `indexOf` for patterns: it returns the index of the first match or `-1`.

```javascript title="search.js"
const s = 'JavaScript';
console.log(s.search(/script/i));
console.log('a.b'.search('.'), 'a.b'.indexOf('.'));
console.log('order 66, item 7'.match(/\d+/));
console.log('order 66, item 7'.match(/\d+/g));
console.log([...'a1b22c333'.matchAll(/\d+/g)].map((m) => [m[0], m.index]));
```

```output
4
0 1
[ '66', index: 6, input: 'order 66, item 7', groups: undefined ]
[ '66', '7' ]
[ [ '1', 1 ], [ '22', 3 ], [ '333', 6 ] ]
```

The `i` flag in `/script/i` makes the search case-insensitive, which `indexOf` cannot do. The second line is a trap: `search` converts a string argument into a regular expression, and in a regex `.` means "any character", so `'a.b'.search('.')` matches the `a` at index 0. `indexOf('.')` looks for a literal dot. `match` with a non-global regex returns the first match with extra information (its `index`, and any captured groups); with the `g` flag it returns all matched strings. `matchAll` (ES2020) returns an iterator of full match objects and requires the `g` flag. These belong to the regular-expression API and are covered in depth in [[b1-regex-methods]].

### Choosing a search method

| Question | Method | Not found |
|---|---|---|
| Is the text present anywhere? | `includes` | `false` |
| Does it start / end with this? | `startsWith` / `endsWith` | `false` |
| Where is the first / last occurrence? | `indexOf` / `lastIndexOf` | `-1` |
| Where is the first match of a pattern? | `search` | `-1` |
| What did a pattern match? | `match` / `matchAll` | `null` / empty iterator |

The same family exists on arrays — `Array.prototype.includes` and `indexOf` — with the same `-1` convention; see [[b1-includes-indexof]].

## Extracting and slicing {#b1-string-extract}

Extracting means taking part of a string — the domain of an e-mail address, the extension of a file name, the first fifty characters of a preview. JavaScript has three methods that do this with a start and end index — `slice`, `substring` and the legacy `substr` — plus `at` for a single position. They exist side by side because the language accumulated them over time; their behaviour differs in exactly the cases where bugs hide.

### `slice(start, end)`

`slice` returns the code units from `start` up to, but **not including**, `end`. If `end` is omitted, it goes to the end of the string. Negative numbers count back from the end.

```javascript title="slice.js"
const s = 'JavaScript';
console.log(s.slice(0, 4), s.slice(4), s.slice(-6), s.slice(-6, -3));
console.log(JSON.stringify(s.slice(4, 0)), s.slice(2, 100), s.slice(-100, 2));
console.log(s.slice() === s);
```

```output
Java Script Script Scr
"" vaScript Ja
true
```

Picture the indexes as positions *between* characters:

```text
  J   a   v   a   S   c   r   i   p   t
0   1   2   3   4   5   6   7   8   9   10
-10 -9  -8  -7  -6  -5  -4  -3  -2  -1
```

`slice(0, 4)` takes everything between position 0 and position 4: `Java`. `slice(-6)` starts six positions from the end — position 4 — so it gives `Script`. The half-open convention has two useful consequences: the length of `slice(a, b)` is `b - a`, and `s.slice(0, k) + s.slice(k)` always rebuilds `s` exactly, which makes splitting at a position trivial.

The edge rules are consistent. A negative index `n` becomes `length + n`, clamped to 0. Indexes larger than `length` are clamped to `length`. If `start` ends up at or after `end`, the result is empty — `slice(4, 0)` is `''`. `slice()` with no arguments returns the whole string; because strings are immutable it gives an equal value, not a meaningfully separate copy.

### `substring(start, end)`

`substring` looks like `slice` but has two different rules: **negative arguments become 0**, and **if `start` is greater than `end`, the two are swapped**.

```javascript title="substring.js"
const s = 'JavaScript';
console.log(s.substring(0, 4), s.substring(4));
console.log(s.substring(4, 0), JSON.stringify(s.slice(4, 0)));
console.log(s.substring(-3), s.slice(-3));
console.log(s.substring(4, -1));
```

```output
Java Script
Java ""
JavaScript ipt
Java
```

With ordinary arguments the two agree. The differences appear exactly where you are least likely to be checking. `substring(4, 0)` is silently treated as `substring(0, 4)`, so a calculation that accidentally produces a start after the end returns text instead of the empty string. `substring(-3)` treats `-3` as `0` and returns the *whole* string, while `slice(-3)` returns the last three units. `substring(4, -1)` turns `-1` into `0` and then swaps, giving `Java`. The swap behaviour dates from the language's earliest versions and is kept for compatibility; it is rarely what anyone wants.

### `substr` (legacy) and `at`

`substr(start, length)` takes a *length* rather than an end index: `'JavaScript'.substr(4, 3)` is `'Scr'`. It is defined only in Annex B of the specification, the section for legacy features kept for web compatibility, and should not be used in new code — `slice(start, start + length)` does the same job. You will still meet it in older code, so recognise it.

`at(i)` (ES2022) returns the single code unit at `i`, with negative values counting from the end. `s.at(-1)` is the last code unit. It is covered with indexing in [[b1-string-indexing]].

### Comparing the extraction methods

| Call on `'JavaScript'` | `slice` | `substring` |
|---|---|---|
| `(0, 4)` | `'Java'` | `'Java'` |
| `(4)` | `'Script'` | `'Script'` |
| `(-3)` | `'ipt'` | `'JavaScript'` (negative → 0) |
| `(4, 0)` | `''` | `'Java'` (swapped) |
| `(2, 100)` | `'vaScript'` | `'vaScript'` |

The practical rule is: **use `slice`**. It has one consistent model — half-open range, negatives from the end, empty when the range is backwards — which matches `Array.prototype.slice` ([[b1-slice-splice]]) and Python. `substring` offers nothing extra except surprises.

### Extracting around a delimiter

Most real extraction combines a search with a slice: find a marker with `indexOf` or `lastIndexOf`, then cut on either side of it.

```javascript title="extract-around.js"
const email = 'ada@example.com';
const at = email.indexOf('@');
console.log(email.slice(0, at), email.slice(at + 1));

const ext = (name) => {
  const dot = name.lastIndexOf('.');
  return dot === -1 ? '' : name.slice(dot + 1);
};
console.log(ext('report.final.pdf'), JSON.stringify(ext('README')));

const preview = (text, max) => (text.length <= max ? text : text.slice(0, max - 1) + '…');
console.log(preview('Strings are immutable primitives', 12));
```

```output
ada example.com
pdf ""
Strings are…
```

`lastIndexOf('.')` finds the *final* dot, so `report.final.pdf` gives `pdf`. The `dot === -1` check is essential: without it, `README` would compute `slice(0)` and return the whole name as its "extension". The preview function keeps `max - 1` code units and adds an ellipsis so the result is exactly `max` long. Like every index-based cut, it can split an emoji in half; a grapheme-aware version is in [[b1-unicode-strings]].

## Replacing, splitting and trimming {#b1-string-replace}

These three operations are the everyday clean-up pipeline. **Replacing** substitutes new text for matches of a pattern. **Splitting** cuts a string into an array of pieces at a separator. **Trimming** removes whitespace from the ends. All three return new values and leave the original string alone.

### `replace` with a string pattern: first match only

`str.replace(pattern, replacement)` returns a new string in which a match of `pattern` is replaced. When `pattern` is a string, it is matched literally, and **only the first occurrence** is replaced:

```javascript title="replace-string.js"
console.log('a a a'.replace('a', 'b'));
console.log('1+1'.replace('+', '-'));
console.log('2024-01-15'.replace('-', '/'));
```

```output
b a a
1-1
2024/01-15
```

The third line shows how easy this is to get wrong: someone expecting `2024/01/15` gets a half-converted date. This mirrors how regular expressions behave: without the `g` flag, a regex replacement also stops after the first match.

### `replace` with a regular expression

When `pattern` is a regular expression, the regex's flags decide what happens. Without the `g` (global) flag, only the first match is replaced; with it, every match is.

```javascript title="replace-regex.js"
console.log('2024-01-15'.replace(/-/g, '/'));
console.log('Hello hello HELLO'.replace(/hello/gi, 'hi'));
console.log('1.1.1'.replace(/./g, 'x'));
```

```output
2024/01/15
hi hi hi
xxxxx
```

The last line is a regex trap rather than a `replace` trap: an unescaped `.` matches any character, so every character was replaced. To match a literal dot in a regex, write `\.`.

### `replaceAll`

`replaceAll` (ES2021) replaces every occurrence. With a string pattern it is literal, so there is nothing to escape:

```javascript title="replace-all.js"
console.log('a a a'.replaceAll('a', 'b'));
console.log('1.1.1'.replaceAll('.', 'x'));
try {
  'aaa'.replaceAll(/a/, 'b');
} catch (err) {
  console.log(err.constructor.name + ': ' + err.message);
}
console.log('aaa'.replaceAll(/a/g, 'b'));
```

```output
b b b
1x1x1
TypeError: String.prototype.replaceAll called with a non-global RegExp argument
bbb
```

`replaceAll` with a regex *requires* the `g` flag and throws without it. That is deliberate: a non-global regex in a method called "replace all" is a contradiction, and failing loudly is better than replacing one match. For literal text, `replaceAll(string, …)` is now the clearest choice; before ES2021 people wrote `split(x).join(y)` or built an escaped global regex.

### Replacement patterns: the dollar sign is special

The replacement string is not always taken literally. Sequences starting with `$` are **replacement patterns** that insert parts of the match:

| Pattern | Inserts |
|---|---|
| `$$` | A literal `$` |
| `$&` | The whole matched text |
| `$` followed by a backtick | The text before the match |
| `$'` | The text after the match |
| `$1`, `$2`, … | The text of a numbered capture group (regex patterns only) |
| `$<name>` | The text of a named capture group (regex patterns only) |

```javascript title="replacement-patterns.js"
console.log('price: 10'.replace(/\d+/, '[$&]'));
console.log('id=10'.replace(/id=(\d+)/, 'id($1)'));
console.log('2024-01-15'.replace(/(?<y>\d+)-(?<m>\d+)-(?<d>\d+)/, '$<d>/$<m>/$<y>'));
console.log('cost'.replace('cost', '$$5'));
```

```output
price: [10]
id(10)
15/01/2024
$5
```

In `/id=(\d+)/`, the parentheses form a **capture group** that records the digits, and `$1` inserts them. `(?<y>…)` is a named group, inserted with `$<y>`. Groups are taught in [[b1-regex-groups]]. The last line shows `$$` producing one dollar sign.

These patterns are useful in hand-written replacements and dangerous when the replacement comes from data. If a user's display name or a price string contains `$&` or `$'`, it is interpreted rather than inserted:

```javascript title="dollar-trap.js"
const template = 'Hello, NAME!';
const name = "Bob$'s shop";
console.log(template.replace('NAME', name));
console.log(template.replace('NAME', () => name));
```

```output
Hello, Bob!s shop!
Hello, Bob$'s shop!
```

In the first call, `$'` was replaced by the text after the match — the `!` — corrupting the output. The fix is the second form: pass a **function** as the replacement. Its return value is inserted literally, with no pattern processing.

### Replacement functions

When the replacement is a function, `replace` calls it for each match and inserts whatever it returns. The function receives the matched text, then any capture groups, then the match's offset and the whole string:

```javascript title="replace-function.js"
console.log('hello world'.replace(/\b\w/g, (letter) => letter.toUpperCase()));
console.log('a-b'.replace('-', (match, offset, whole) => `[${match}@${offset} of ${whole}]`));

const prices = 'apple 120, pear 85';
console.log(prices.replace(/(\d+)/g, (m, cents) => '$' + (Number(cents) / 100).toFixed(2)));

let calls = 0;
'aXbXc'.replace(/X/, () => { calls++; return '-'; });
console.log('without g:', calls);
calls = 0;
'aXbXc'.replace(/X/g, () => { calls++; return '-'; });
console.log('with g:', calls);
```

```output
Hello World
a[-@1 of a-b]b
apple $1.20, pear $0.85
without g: 1
with g: 2
```

`/\b\w/g` matches each word character that sits at a word boundary — the first letter of every word — and the function upper-cases it. The price line converts each captured number of cents into a formatted amount, something no fixed replacement string could do. The last part shows that the callback runs once per replaced match, so adding or removing the `g` flag changes how many times it runs. That matters if the callback has side effects such as counting or logging.

### `split`: cutting a string into an array

`str.split(separator, limit)` cuts the string at every occurrence of `separator` and returns the pieces in an array. The separator itself is not included.

```javascript title="split.js"
console.log('a,b,,c'.split(','));
console.log('a,b,,c'.split(',', 2));
console.log('2024-01-15'.split('-').map(Number));
console.log('abc'.split(''), 'abc'.split());
console.log(''.split(','), ''.split(''));
console.log('one  two   three'.split(' '));
console.log('one  two   three'.split(/\s+/));
console.log('a1b2c3'.split(/(\d)/));
```

```output
[ 'a', 'b', '', 'c' ]
[ 'a', 'b' ]
[ 2024, 1, 15 ]
[ 'a', 'b', 'c' ] [ 'abc' ]
[ '' ] []
[ 'one', '', 'two', '', '', 'three' ]
[ 'one', 'two', 'three' ]
[
  'a', '1', 'b',
  '2', 'c', '3',
  ''
]
```

Read the edge cases carefully, because each one has caused production bugs:

- **Adjacent separators produce empty strings.** `'a,b,,c'` has an empty field between the two commas, and `split` keeps it. That is correct for CSV-like data, where an empty field is meaningful.
- **`limit` caps the number of pieces** and discards the rest; it does not put the remainder in the last piece. `'a,b,,c'.split(',', 2)` drops `''` and `'c'`.
- **An empty separator splits into code units.** `'abc'.split('')` gives single characters — and splits emoji into broken halves, which is why `split('')` is the wrong way to get characters from arbitrary text. Use `[...str]` instead (see [[b1-unicode-strings]]).
- **No separator returns the whole string in an array.** `'abc'.split()` is `['abc']`.
- **Splitting an empty string gives `['']`**, an array with one empty string, not an empty array. Code that counts "how many tags did the user enter?" with `input.split(',').length` reports 1 for an empty input.
- **Repeated spaces** produce empty strings with `split(' ')`. Split on the regex `/\s+/` (one or more whitespace characters) to treat any run of whitespace as one separator — after trimming, or the leading whitespace produces an empty first element.
- **Capture groups in a regex separator are included** in the result, which is occasionally useful for tokenisers and usually a surprise.

`split` has an inverse: the array method `join(separator)`. Together they form a classic idiom — `parts = str.split(a)`, modify `parts`, then `parts.join(b)`.

### `trim`, `trimStart` and `trimEnd`

`trim()` returns the string with **whitespace removed from both ends**. `trimStart()` and `trimEnd()` (ES2019; older aliases are `trimLeft` and `trimRight`) remove it from one end only. None of them touch whitespace in the middle.

```javascript title="trim.js"
const raw = ' \t\n  ada@example.com  ';
console.log(JSON.stringify(raw.trim()));
console.log(JSON.stringify('  hi  '.trimStart()), JSON.stringify('  hi  '.trimEnd()));
console.log(JSON.stringify('  a    b  '.trim()));
console.log(JSON.stringify('  a    b  '.trim().replace(/\s+/g, ' ')));
```

```output
"ada@example.com"
"hi  " "  hi"
"a    b"
"a b"
```

"Whitespace" here is broad: spaces, tabs, newlines, carriage returns, the no-break space ` ` (common in text pasted from web pages and word processors), the byte-order mark `﻿`, and the other Unicode space separators. That breadth is helpful — users paste text with invisible characters at the edges all the time. To collapse runs of internal whitespace into single spaces, combine `trim` with `replace(/\s+/g, ' ')`, as the last line does.

Trimming user input before validating or comparing it is a basic habit. An e-mail address typed as `'ada@example.com '` with a trailing space is not equal to the stored `'ada@example.com'`, and a "required" field containing only spaces should usually count as empty: `if (!input.trim())`.

## Chaining methods into pipelines

Because each method returns a new string, methods chain naturally. Read a chain from left to right as a sequence of transformations:

```javascript title="pipeline.js"
const tagsInput = '  React, typescript ,, CSS ,react ';
const tags = tagsInput
  .split(',')
  .map((tag) => tag.trim().toLowerCase())
  .filter((tag) => tag !== '');
console.log(tags);
console.log([...new Set(tags)].join(', '));
```

```output
[ 'react', 'typescript', 'css', 'react' ]
react, typescript, css
```

`split(',')` turns the input into raw pieces, including empty ones from `,,`. The `map` callback cleans each piece with a two-step string pipeline. `filter` removes the empty strings that `split` produced. A `Set` removes duplicates ([[b1-set]]), and `join` builds the display string. Each step is simple and testable, which is the main benefit of this style.

## How it works internally

The specification describes each method as a short algorithm, and a few of its steps explain behaviour you have already seen.

Nearly every method begins with **RequireObjectCoercible(this)** — which throws a `TypeError` for `null` and `undefined` — followed by **ToString(this)**. That is why methods are generic, and why `undefined.trim()` fails. Search arguments then go through ToString (so `includes(null)` searches for `'null'`), and positions go through **ToIntegerOrInfinity**, which truncates fractions and turns `NaN` into `0`. `slice` then applies relative indexing: a negative value becomes `max(length + n, 0)`; `substring` instead clamps to `[0, length]` and swaps if needed.

`includes`, `startsWith` and `endsWith` call **IsRegExp** on their argument and throw if it is a regex. The search itself uses an abstract operation called **StringIndexOf**, which the specification defines in terms of comparing code units. The specification describes *results*, not algorithms; engines are free to use fast substring-search techniques internally.

`replace`, `replaceAll`, `split`, `search`, `match` and `matchAll` first check whether the pattern argument has a method under a **well-known symbol** — `Symbol.replace`, `Symbol.split`, `Symbol.search`, `Symbol.match`, `Symbol.matchAll`. Regular expressions have these methods, so `'x'.replace(/x/, 'y')` actually delegates to `RegExp.prototype[Symbol.replace]`. If the pattern has no such method, it is converted to a string and matched literally. This design is why string methods behave so differently with a string versus a regex, and it means any object can define its own matching behaviour ([[b1-well-known-symbols]]). Replacement patterns such as `$&` are expanded by an abstract operation called **GetSubstitution**, which is skipped when the replacement is a function.

```mermaid title="How str.replace(pattern, replacement) decides what to do"
flowchart TD
    A["str.replace(pattern, replacement)"] --> B{"pattern has Symbol.replace?"}
    B -- "yes (a RegExp)" --> C["RegExp handles it: g flag decides first or all"]
    B -- no --> D["pattern converted to string, first literal match found"]
    C --> E{"replacement is a function?"}
    D --> E
    E -- yes --> F["call it per match, insert result literally"]
    E -- no --> G["expand $&, $1, $$ via GetSubstitution"]
```

Performance is rarely a concern for typical inputs — these methods are implemented in optimised native code. What can matter is calling an O(n) method inside a loop over the same string, such as repeated `indexOf` calls that each start from the beginning. Passing the `fromIndex` argument, or using `matchAll`, keeps a scan linear.

## Worked example: cleaning and parsing input

This example combines search, extraction, splitting, trimming and replacing to solve two everyday problems: parsing a `Cookie` header into an object and turning an article title into a URL slug.

```javascript title="parse-and-slug.js"
function parseCookies(header) {
  const cookies = {};
  for (const part of header.split(';')) {
    const pair = part.trim();
    if (!pair) continue;                 // tolerate ";;" and trailing ";"
    const eq = pair.indexOf('=');        // first "=" only: values may contain "="
    const key = eq === -1 ? pair : pair.slice(0, eq);
    const value = eq === -1 ? '' : pair.slice(eq + 1);
    cookies[key] = value;
  }
  return cookies;
}

function slugify(title) {
  return title
    .normalize('NFD')                    // split "é" into "e" + combining accent
    .replace(/[̀-ͯ]/g, '')     // drop the combining accents
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')         // any run of other characters becomes "-"
    .replace(/^-+|-+$/g, '');            // no leading or trailing "-"
}

console.log(parseCookies('theme=dark; lang=en-GB;  token=a=b;;'));
console.log(slugify('  Hello, World! 2024 Edition  '));
console.log(slugify('Café au lait — a guide'));
console.log(JSON.stringify(slugify('!!!')));
```

```output
{ theme: 'dark', lang: 'en-GB', token: 'a=b' }
hello-world-2024-edition
cafe-au-lait-a-guide
""
```

`parseCookies` splits on semicolons, then trims each piece because cookie headers put a space after each `;` (and sloppy input may have more). The `if (!pair) continue` line handles empty pieces from `;;` or a trailing semicolon — remember that `split` keeps them. The key design choice is `indexOf('=')` rather than `split('=')`: a value such as a token can itself contain `=`, and `split('=')` would cut it into pieces. Taking everything after the *first* `=` with `slice(eq + 1)` keeps `'a=b'` intact. (Real cookie values may also be percent-encoded and need `decodeURIComponent`; this example leaves that out.)

`slugify` is a pipeline of six transformations. The first two handle accented letters: `normalize('NFD')` decomposes `é` into a plain `e` followed by a separate combining accent character, and the regex range `̀-ͯ` removes the combining accents. Without these steps, `Café` would become `caf-au-lait`, because `é` is not in `a-z`. Then `trim` and `toLowerCase` standardise the text, `/[^a-z0-9]+/g` replaces every run of characters that are not lower-case letters or digits — spaces, punctuation, the em dash — with a single hyphen, and the last regex removes hyphens at either end. The final test shows an edge case a caller must handle: a title with no letters or digits produces an empty slug.

## In real systems

**Form handling.** Sign-up and login flows almost always `trim()` and lower-case e-mail addresses before storing or comparing them, and validate "required" fields with `value.trim() !== ''`. Server-side code must repeat these checks, because a client can send anything.

**Routing and URLs.** Routers split paths on `/`, filter out empty segments (from leading or trailing slashes), and match the pieces. For full URLs, use the built-in `URL` and `URLSearchParams` APIs rather than splitting by hand: they handle encoding, ports, fragments and repeated parameters correctly.

**Search and filtering.** A typical client-side filter lower-cases both the query and each item and uses `includes`. For international content, `localeCompare` with `sensitivity: 'base'` or `Intl.Collator` handles accents and case more correctly than `toLowerCase`.

**Templating and code generation.** Build tools, linters and code generators use `replace` with functions and regexes heavily. Because replacement strings interpret `$`, careful codebases always use function replacements when the inserted text comes from data.

**Parsing structured text.** For CSV, JSON, HTML or URLs, use a real parser (`JSON.parse`, `DOMParser`, `URL`, a CSV library) rather than `split`. Hand-written splitting breaks on quoted fields, escaped separators and nested structures.

## Trade-offs and alternatives

| Need | Prefer | Avoid | Why |
|---|---|---|---|
| Presence check | `includes`, `startsWith`, `endsWith` | `if (s.indexOf(x))` | Booleans read clearly; `indexOf` returns 0 for a hit at the start |
| Position | `indexOf` / `lastIndexOf` with `!== -1` | Assuming a hit | `-1` must be handled before slicing |
| Extract a range | `slice` | `substring`, `substr` | One consistent model; `substr` is legacy |
| Replace every literal occurrence | `replaceAll(string, …)` | `replace(string, …)` | `replace` with a string changes only the first match |
| Replace with data | Function replacement | String replacement | `$&`, `$'` and `$1` are interpreted in replacement strings |
| Split on whitespace | `trim().split(/\s+/)` | `split(' ')` | Runs of spaces produce empty strings |
| Parse URLs, CSV, HTML | `URL`, a parser library, `DOMParser` | `split` and `indexOf` | Hand parsing breaks on escaping and quoting |

String methods are code-unit based. For text where emoji, combined characters or many languages matter, add the Unicode-aware tools from [[b1-unicode-strings]] — `[...str]`, `Intl.Segmenter`, `normalize` and `localeCompare`.

## Common mistakes

> [!MISTAKE] Using `indexOf` as a condition
> `if (s.indexOf('x'))` is wrong both ways: a match at index 0 is falsy, and "not found" (`-1`) is truthy. Use `s.includes('x')`, or compare explicitly with `s.indexOf('x') !== -1`.

**Expecting `replace` with a string to replace everything.** `'a-b-c'.replace('-', '/')` gives `'a/b-c'`. Use `replaceAll('-', '/')` or a regex with the `g` flag.

**Forgetting the `g` flag in `replaceAll`.** `replaceAll(/x/, …)` throws a `TypeError`. Add `g`, or pass a string pattern.

**Inserting data with a replacement string.** If the inserted text can contain `$`, it may be interpreted as a pattern. Use `replace(pattern, () => data)`.

**Using `substring` with negative or swapped arguments.** `substring(-3)` returns the whole string and `substring(5, 2)` swaps silently. Use `slice`, where negative means "from the end" and a backwards range is empty.

**Slicing with `-1` from `indexOf`.** If `indexOf` returns `-1` and you write `s.slice(0, idx)`, you get everything except the last character, not "nothing". Always handle `-1` first.

**Assuming `''.split(',')` is empty.** It is `['']`, so its length is 1. Check for empty input first, or filter out empty strings.

**Forgetting to store the result.** `input.trim();` alone does nothing. Every method returns a new string.

## Interview perspective

String-method questions appear as quick-fire knowledge checks and inside coding problems — palindromes, anagrams, parsing, word counts. Interviewers watch for clean method choices and correct handling of edge cases such as the empty string and "not found".

> [!INTERVIEW] "What is the difference between `slice` and `substring`?"
> "Both extract a half-open range of code units and return a new string. `slice` treats negative arguments as offsets from the end and returns an empty string if start is past end. `substring` clamps negatives to zero and swaps the arguments if start is greater than end. So `slice(-3)` is the last three characters but `substring(-3)` is the whole string. I default to `slice` because it matches `Array.prototype.slice`."

Questions you should be able to answer:

- **Why is `if (str.indexOf(x))` a bug?** Index 0 is a hit and falsy; `-1` is a miss and truthy. Use `includes`.
- **How do you replace every occurrence of a substring?** `replaceAll(sub, rep)`, or `replace` with a global regex (escaping regex special characters), or the older `split(sub).join(rep)`.
- **What does `'a,b,,c'.split(',')` return?** `['a', 'b', '', 'c']` — empty fields are kept.
- **What does `$&` mean in a replacement?** The matched text; `$$` is a literal dollar. Use a replacement function for data.
- **Does `trim` remove inner spaces?** No — only leading and trailing whitespace, including tabs, newlines and no-break spaces.
- **Implement "is palindrome", ignoring case and punctuation.** Lower-case, remove non-alphanumerics with `replace(/[^a-z0-9]/g, '')`, then compare with its reverse or use two indexes moving inward.

A useful follow-up to expect: *"What happens if the input contains emoji?"* Index-based methods and `split('')` work on code units and can split surrogate pairs; mention `[...str]` for code points and `Intl.Segmenter` for user-perceived characters.

```quiz
Q: What does `'/home'.indexOf('/') ? 'yes' : 'no'` evaluate to?
- [ ] `'yes'`, because the slash is found
- [x] `'no'`, because the slash is at index 0, which is falsy
- [ ] It throws, because `indexOf` returns a number
- [ ] `'yes'`, because `indexOf` returns `true`
> `indexOf` returns the position of the first match. The slash is at position 0, and 0 is falsy, so the ternary takes the `'no'` branch even though the text was found. `includes('/')` returns a boolean and avoids the problem.

Q: What does `'JavaScript'.substring(4, 0)` return?
- [ ] `''`
- [x] `'Java'`
- [ ] `'Script'`
- [ ] It throws a `RangeError`
> `substring` swaps its arguments when the start is greater than the end, so the call becomes `substring(0, 4)`. `slice(4, 0)` would return the empty string, which is why `slice` is the safer default.

Q: What is the result of `'a.b.c'.replace('.', '-')`?
- [ ] `'a-b-c'`
- [x] `'a-b.c'`
- [ ] `'-----'`
- [ ] `'a.b.c'`
> With a string pattern, `replace` matches literally (so the dot is an ordinary dot) and replaces only the first occurrence. `'-----'` would require a regex `/./g`, where the dot matches any character. To replace every literal dot, use `replaceAll('.', '-')`.

Q: What does `''.split(',').length` evaluate to?
- [ ] 0
- [x] 1
- [ ] 2
- [ ] It throws
> Splitting a string that contains no separator returns an array holding the whole string. For the empty string, that is `['']`, an array with one empty string. Code that counts items in comma-separated input must handle empty input separately.
```

## Practice

1. **Search predictions.** Predict, then check: `'banana'.indexOf('an', 2)`, `'banana'.lastIndexOf('an')`, `'banana'.includes('')`, `'banana'.endsWith('nan', 5)`, `'a.b'.search('.')`.
2. **Extension and base name.** Write `splitFileName(name)` returning `{ base, ext }` for `'archive.tar.gz'`, `'README'` and `'.gitignore'`. Decide what the right answer is for a leading dot and justify it.
3. **Word count.** Write `countWords(text)` that returns 0 for empty or whitespace-only input and counts words separated by any run of whitespace.
4. **Safe template filling.** Write `fill(template, values)` that replaces `{name}`-style placeholders with values from an object. Make sure a value containing `$&` is inserted literally, and leave unknown placeholders unchanged.
5. **Query-string parser.** Parse `'?q=js+strings&page=2&tag=a&tag=b'` into `{ q: 'js strings', page: '2', tag: ['a', 'b'] }` using only string methods. Then rewrite it with `URLSearchParams` and compare.
6. **Title case.** Write `titleCase(s)` that upper-cases the first letter of each word and lower-cases the rest, using `replace` with a function.

## Quick revision {#quick-revision}

- Methods never mutate; they return new strings, numbers, booleans or arrays. Store the result.
- Positions are UTF-16 code-unit indexes; ranges are half-open `[start, end)`. Arguments are converted: `indexOf()` searches for `'undefined'`; fractions truncate.
- Calling any method on `null`/`undefined` throws `TypeError: Cannot read properties of …`.
- Case: `toLowerCase`/`toUpperCase` (length can change: `'ß'` → `'SS'`); `toLocale…` for language rules; `localeCompare(…, { sensitivity: 'base' })` for case- and accent-insensitive comparison.
- Search: `indexOf`/`lastIndexOf` → index or `-1` (0 is a hit and falsy). `includes`/`startsWith`/`endsWith` → boolean, take a position, reject regexes. `search(regex)` → index; a string argument becomes a regex. `match`/`matchAll` for pattern results.
- Extract: `slice(start, end)` — negatives from end, backwards range is `''`. `substring` — negatives → 0, swaps if start > end. `substr(start, length)` is legacy. `at(-1)` = last unit.
- Replace: string pattern → first literal match only; regex → `g` decides; `replaceAll` → all, regex must have `g`. `$$`, `$&`, `$'`, `$1`, `$<name>` (and `$` plus backtick for the text before) in replacement strings; use a function for data. Callback runs once per replaced match.
- Split: keeps empty fields; `limit` discards the rest; `''` separator → code units; no separator → `[str]`; `''.split(',')` → `['']`; regex captures are included. `join` is the inverse.
- Trim: `trim`/`trimStart`/`trimEnd` remove Unicode whitespace (incl. ` `, `﻿`, newlines) at the ends only; collapse inner runs with `replace(/\s+/g, ' ')`.

## Key takeaways {#key-takeaways}

- Every string method returns a new value and works on code-unit positions with half-open ranges; knowing these shared rules lets you predict unfamiliar methods.
- Use boolean methods (`includes`, `startsWith`, `endsWith`) for presence checks and reserve `indexOf` for when you need the position, always comparing against `-1`.
- Default to `slice` for extraction; `substring`'s clamping and swapping hide bugs, and `substr` is legacy.
- `replace` with a string changes only the first match; use `replaceAll` or a global regex for every match, and a replacement function whenever the inserted text comes from data.
- `split` and `trim` have edge cases — empty fields, `['']` for empty input, inner whitespace untouched — that real input will hit, so handle them deliberately.
- Chaining small, pure string operations into pipelines keeps text-processing code readable and testable.
