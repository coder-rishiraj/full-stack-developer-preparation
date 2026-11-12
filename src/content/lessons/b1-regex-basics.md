---
summary: A regular expression is a small pattern language for describing text, and in JavaScript every pattern is a RegExp object created either with a /literal/ or with the RegExp constructor. You will learn when to use each form, how escaping really works, why a regex object can carry state between calls, and the building blocks — classes, quantifiers, anchors and flags — that every pattern is made from.
difficulty: intermediate
minutes: 50
objectives:
  - Create RegExp objects with a literal and with the constructor, and choose the right form for a given situation
  - Explain why new RegExp('\d') does not match digits and fix it with double escaping or String.raw
  - Escape untrusted input safely before building a pattern from it
  - Read and write patterns using character classes, quantifiers, anchors and flags
  - Predict greedy versus lazy matching and the effect of the g, i, m, s, u, v, y and d flags
  - Recognise patterns that can cause catastrophic backtracking
---

## Introduction

A large share of everyday programming is text handling. A sign-up form must check that a postcode looks like a postcode. A log viewer must pull the timestamp and status code out of each line. A search box must highlight every occurrence of a word, ignoring case. A build tool must find every `import` statement in a file. You could write each of these with loops and `indexOf`, but the code becomes long, fragile and different every time.

A **regular expression** (regex) is a compact way to describe *the shape of text you are looking for*. Instead of writing the loop, you write a pattern such as `/\d{3}-\d{4}/` — "three digits, a hyphen, four digits" — and hand it to a matching engine that does the searching for you. Almost every programming language, editor and command-line tool understands regular expressions, and the dialects are similar enough that a pattern you learn in JavaScript mostly works in `grep`, VS Code's search box, Python or Java.

In JavaScript a regular expression is not a string; it is an object of type `RegExp`. This lesson covers how those objects are created and what they contain, then teaches the pattern syntax itself — the part that looks like line noise until you can read its four building blocks. The methods that *use* a regex (`test`, `exec`, `match`, `replace`, `matchAll`) are taught in [[b1-regex-methods]], and capture groups and lookaround in [[b1-regex-groups]].

## Before you start

- **Strings and escape sequences** — you should know that `'\n'` in source code is one newline character and that `'\\'` is one backslash. See [[b1-escape-sequences]] and [[b1-string-creation]].
- **Template literals** — used here for `String.raw`. See [[b1-template-literals]] and [[b1-tagged-templates]].
- **Objects and references** — a RegExp is an object, and two separately created objects are never `===`. See [[b1-primitive-vs-reference]].
- **Basic string methods** — `includes`, `indexOf`, `split`. See [[b1-string-methods]].

## The intuition

Think of a regex as a tiny machine with a reading head. You feed it a string. The machine tries to line its pattern up at position 0; if the pattern does not fit there, it slides one character to the right and tries again, and so on until it either finds a place where the whole pattern fits or runs out of string. The pattern itself is a list of instructions: "here, accept one digit", "now accept one or more letters", "now require that we are at the end of the line".

Two consequences of that picture matter immediately. First, by default the machine reports the **first, leftmost** place the pattern fits, not the longest or the best. Second, because the machine is an *object*, it can remember things between uses — in particular, a regex with the `g` flag remembers where its last match ended. That memory is useful and is also the source of a classic bug, covered below.

## Two ways to create a RegExp

### The literal form

The most common way to write a regex is a **regex literal**: the pattern between two forward slashes, optionally followed by flags.

```javascript title="literal-vs-constructor.js"
const literal = /ab+c/i;
const built = new RegExp('ab+c', 'i');
console.log(literal.test('xABBBCx'), built.test('xABBBCx'));
console.log(literal.source, literal.flags);
console.log(typeof literal, literal instanceof RegExp);
console.log(literal === built, String(literal) === String(built));
```

```output
true true
ab+c i
object true
false true
```

Both objects describe the same pattern — an `a`, one or more `b`s, then a `c`, case-insensitively — and both find `ABBBC` inside the test string. Every RegExp exposes its pattern text as `source` and its flags as `flags`. It is an ordinary object (`typeof` gives `'object'`), so two RegExp objects are never `===` to each other even when they describe the same pattern; compare `String(re)` or `source` plus `flags` if you need to know whether two patterns are textually the same.

A literal is checked **when the script is parsed**. If you write `/(unclosed/` in a file, the whole file fails to load with a `SyntaxError` before any of it runs. That is a feature: a typo in a static pattern is caught immediately rather than when a user happens to reach that line. Literals are also easier to read, because you write the pattern exactly as the engine sees it, with no extra layer of string escaping.

The one thing you must escape inside a literal is the forward slash itself, since it would otherwise end the literal: `/a\/b/` matches the text `a/b`.

### The constructor form

`new RegExp(pattern, flags)` builds a regex from a **string** at run time. You need it whenever the pattern is not known when you write the code — a search term typed by a user, a list of keywords loaded from configuration, a prefix passed as a function argument:

```javascript title="dynamic.js"
function startsWithAny(prefixes) {
  return new RegExp('^(?:' + prefixes.join('|') + ')');
}
console.log(startsWithAny(['GET', 'POST']).test('POST /login'));
```

```output
true
```

Because the pattern is only known at run time, errors are also only found at run time. `new RegExp('(unclosed')` throws a `SyntaxError` at the moment the constructor is called, which you can catch:

```javascript title="constructor-errors.js"
try { new RegExp('(unclosed'); } catch (e) { console.log(e.name + ': ' + e.message); }
try { new RegExp('a', 'gg'); } catch (e) { console.log(e.name + ': ' + e.message); }
```

```output
SyntaxError: Invalid regular expression: /(unclosed/: Unterminated group
SyntaxError: Invalid flags supplied to RegExp constructor 'gg'
```

The exact message text is V8's (Node 22, Chrome); other engines word it differently, but the error type is always `SyntaxError`.

The constructor also accepts an existing regex, which is the standard way to copy one or to change its flags:

```javascript title="copy-regex.js"
const re = /cat/g;
const copy = new RegExp(re, 'i');
console.log(copy.source, copy.flags, copy === re);
console.log(new RegExp('a', 'yigm').flags);
```

```output
cat i false
gimy
```

The copy keeps the source but takes the new flags. Notice that `flags` is always reported in a fixed alphabetical order, whatever order you passed them in.

| | Literal `/…/flags` | Constructor `new RegExp(str, flags)` |
|---|---|---|
| Pattern known | When writing the code | At run time |
| Syntax errors found | When the script is parsed | When the constructor runs |
| Backslashes | Written once: `/\d/` | Written twice in a normal string: `'\\d'` |
| Forward slash | Must be escaped: `/a\/b/` | No escape needed: `'a/b'` |
| Typical use | Fixed patterns in code | User input, configuration, building from parts |

The rule of thumb is simple: **use a literal whenever the pattern is fixed**, and reach for the constructor only when part of the pattern is data.

## The double-escaping trap

The constructor takes a *string*, and JavaScript processes escape sequences in a string literal before the RegExp ever sees it. So there are two layers of escaping: the string layer and the regex layer.

```javascript title="double-escape.js"
const wrong = new RegExp('\d+');
const right = new RegExp('\\d+');
const raw = new RegExp(String.raw`\d+`);
console.log(wrong.source, wrong.test('42'), wrong.test('ddd'));
console.log(right.source, right.test('42'));
console.log(raw.source, raw.test('42'));
```

```output
d+ false true
\d+ true
\d+ true
```

In `'\d+'`, the string parser sees `\d`, which is not a recognised string escape, so it quietly drops the backslash. The RegExp receives `d+` — "one or more letter d" — which does not match `42` but does match `ddd`. Nothing throws; the program just behaves wrongly. To deliver a real backslash to the regex engine you must write `'\\d+'`: the string layer turns `\\` into one `\`, and the regex layer then reads `\d`.

`String.raw` is a tagged template that leaves backslashes untouched, so `` String.raw`\d+` `` produces the three characters `\d+`. It makes dynamic patterns read like literals and is worth using whenever the pattern contains several backslashes.

> [!WARNING] Silent failure
> `new RegExp('\d')` is `/d/`, and `new RegExp('\b')` is a pattern containing a *backspace character*, not a word boundary. Neither throws. When a constructed pattern "never matches", print its `source` first.

## Escaping untrusted input

The other half of the escaping story is the opposite problem. Suppose a user types `1+1` into a search box and you build `new RegExp(search)`. To the regex engine, `+` is not a plus sign; it means "one or more of the previous thing". So the pattern `1+1` means "one or more 1s followed by a 1", and searching `'1+1=2'` fails. Worse, a user who types `(` gets a `SyntaxError`, and a user who types `.*` matches everything.

The fix is to escape every character that has special meaning before inserting user text into a pattern:

```javascript title="escape-regexp.js"
function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
}
const search = '1+1';
console.log(new RegExp(search).test('1+1=2'));
console.log(new RegExp(escapeRegExp(search)).test('1+1=2'));
console.log(escapeRegExp('price: $5.00 (approx)'));
```

```output
false
true
price: \$5\.00 \(approx\)
```

The helper's pattern is a character class listing every special character; `g` makes `replace` handle all of them, and the replacement `'\\$&'` means "a backslash followed by the whole match" (`$&` is explained in [[b1-regex-methods]]). After escaping, the user's text is matched literally.

ES2025 adds a built-in `RegExp.escape(text)` for exactly this purpose. It is available in Node 24 and current browsers but not in Node 22, where the examples in this lesson were run, so check your runtime before relying on it; the hand-written helper above works everywhere. If you only need a *literal* substring check and no pattern features at all, skip regex entirely and use `includes`, `indexOf`, `split` or `replaceAll` with a string argument.

> [!IMPORTANT] Regex from user input is a security boundary
> Unescaped input does not only cause wrong matches. A malicious pattern such as `(a+)+$` can make the matching engine run for seconds or minutes (see catastrophic backtracking below), freezing a browser tab or blocking a Node.js server's event loop. Never build a pattern from untrusted text without escaping it.

## A RegExp object has state

Most regexes are stateless in practice, but every RegExp has a writable property called **`lastIndex`**. When the regex has the `g` (global) or `y` (sticky) flag, the methods `exec` and `test` start searching at `lastIndex` and, after a match, set it to the position just past that match. After a failed search they reset it to `0`.

```javascript title="lastindex.js"
const re = /o/g;
console.log(re.lastIndex, re.test('foo'), re.lastIndex);
console.log(re.test('foo'), re.lastIndex);
console.log(re.test('foo'), re.lastIndex);
console.log(re.test('foo'), re.lastIndex);
```

```output
0 true 2
true 3
false 0
true 2
```

Calling `test` on the same string with the same arguments gives `true`, `true`, `false`, `true`. The regex is behaving like a cursor that walks through the string: it found the `o` at index 1, then the `o` at index 2, then ran off the end and reset. This is deliberate — it is how you iterate over all matches with `exec` — but it means a global regex stored in a module-level constant and reused by a helper function can return different answers on consecutive calls. The full story and the safe alternatives are in [[b1-regex-methods]]. For now, remember: **do not share a `g` or `y` regex between unrelated calls to `test` or `exec`**.

Note that a regex literal creates a new object each time the expression is evaluated. `function make() { return /x/g; }` returns a fresh object, with `lastIndex` 0, on every call, so a literal written inside the function that uses it avoids the sharing problem.

## How it works internally

Under the hood, a RegExp instance is an object with special internal slots defined by the ECMAScript specification: `[[OriginalSource]]` and `[[OriginalFlags]]` hold the text you wrote, and `[[RegExpMatcher]]` holds the compiled matcher. `source` and `flags` are getters on `RegExp.prototype` that read those slots, while `lastIndex` is an ordinary data property on each instance.

Engines compile a pattern the first time it is needed. V8 (Chrome, Node) parses the pattern into a tree, then compiles it either to bytecode for its Irregexp interpreter or to native machine code for patterns used often. A literal that appears in a loop is parsed once with the script, so you are not paying compilation cost for each evaluation of the same literal; a `new RegExp(str)` inside a hot loop does more work each time, which is one more reason to hoist dynamic patterns out of loops when the input does not change.

The specification describes matching as a **backtracking** search, similar to a non-deterministic finite automaton explored depth-first: the engine tries one way of matching, and if a later part of the pattern fails, it goes back and tries the next alternative. This is what gives JavaScript regex features such as backreferences and lookaround, and it is also what makes certain patterns exponentially slow.

Finally, the string methods `match`, `matchAll`, `replace`, `search` and `split` do not contain regex logic themselves. They look up a well-known symbol method on their argument — `Symbol.match`, `Symbol.replace` and so on — and RegExp objects implement those methods. That is how `'a1b2'.match(/\d/g)` ends up running RegExp code, and it is why a custom object can pretend to be a matcher.

## Classes, Quantifiers, Anchors and Flags {#b1-regex-classes-quantifiers}

Every regular expression, however intimidating, is built from four kinds of piece. **Character classes** say *which characters* are allowed at one position. **Quantifiers** say *how many times* the previous piece may repeat. **Anchors** say *where* in the string a match may sit, without consuming any characters. **Flags**, written after the closing slash, switch the whole engine into a different mode, such as case-insensitive or multi-line. Once you can name each piece in a pattern, `^\d{3}-\d{4}$` stops being noise and reads as "start, three digits, hyphen, four digits, end".

Any character with no special meaning matches itself: `/cat/` matches the three characters c, a, t in a row. The special characters are `\ ^ $ . | ? * + ( ) [ ] { }` and, in literals, `/`; put a backslash in front of any of them to match it literally, as in `/1\+1/`.

### Character classes

Square brackets match **exactly one character** from a set. Inside them you can list characters, give ranges with a hyphen, or negate the whole set with a leading `^`:

```javascript title="classes.js"
console.log('grey gray groy'.match(/gr[ae]y/g));
console.log('a1b2c3'.match(/[^0-9]/g));
console.log('tab\there new\nline'.split(/\s+/));
console.log(/\w+/.exec('café au lait')[0]);
console.log('1.5 + 2'.match(/[.+]/g));
```

```output
[ 'grey', 'gray' ]
[ 'a', 'b', 'c' ]
[ 'tab', 'here', 'new', 'line' ]
caf
[ '.', '+' ]
```

`[ae]` accepts `a` or `e` in that one position, so `groy` is rejected. `[^0-9]` accepts any single character that is not a digit. The last line shows something useful: inside square brackets most special characters lose their meaning, so `[.+]` matches a literal dot or plus. Only `]`, `\`, `^` (at the start) and `-` (between two characters) need care inside a class.

JavaScript provides shorthand classes for the most common sets:

| Shorthand | Matches | Negated form |
|---|---|---|
| `\d` | A digit `0`–`9` | `\D` |
| `\w` | A "word" character: `A`–`Z`, `a`–`z`, `0`–`9`, `_` | `\W` |
| `\s` | Whitespace: space, tab, newline, carriage return, and Unicode spaces | `\S` |
| `.` | Any character except a line terminator (unless the `s` flag is set) | — |

The `café` line is a trap worth remembering: **`\w` is ASCII-only**, even with the `u` flag. It stops at `é`. For international text, use Unicode property escapes such as `\p{L}` (any letter), shown in the flags section below. Similarly `\d` only matches the ASCII digits, not Arabic-Indic or full-width digits.

### Quantifiers

A quantifier follows a character, class or group and says how many times it may repeat:

| Quantifier | Meaning |
|---|---|
| `*` | 0 or more |
| `+` | 1 or more |
| `?` | 0 or 1 (optional) |
| `{n}` | Exactly n |
| `{n,}` | n or more |
| `{n,m}` | Between n and m, inclusive |

All of these are **greedy** by default: they take as many characters as they can and give some back only if the rest of the pattern would otherwise fail. Adding a `?` after a quantifier makes it **lazy**: it takes as few as possible and grows only when forced to.

```javascript title="greedy-lazy.js"
const html = '<b>bold</b> and <i>italic</i>';
console.log(html.match(/<.+>/)[0]);
console.log(html.match(/<.+?>/)[0]);
console.log(html.match(/<[^>]+>/g));
console.log('aaaa'.match(/a{2,3}/)[0], 'aaaa'.match(/a{2,3}?/)[0]);
console.log('color colour'.match(/colou?r/g));
console.log('2024-05-09'.match(/\d{4}-\d{2}-\d{2}/)[0]);
```

```output
<b>bold</b> and <i>italic</i>
<b>
[ '<b>', '</b>', '<i>', '</i>' ]
aaa aa
[ 'color', 'colour' ]
2024-05-09
```

Trace the first line. `<` matches at index 0. Then `.+` greedily swallows *everything* to the end of the string. Now `>` must match, but there is nothing left, so the engine backtracks: `.+` gives back one character, the final `>`, and `>` matches it. The result runs from the first `<` to the last `>` — the whole string. The lazy `.+?` instead takes one character, checks whether `>` can match next, and only grows if not, so it stops at the first `>`.

The third line shows the better habit: a **negated class** `[^>]+` ("one or more characters that are not `>`") says exactly what you mean, cannot run past a `>`, and needs no backtracking. Prefer a precise class over a lazy dot whenever you can describe the allowed characters.

### Anchors and boundaries

Anchors match a *position*, not a character. They consume nothing; they only constrain where a match may be.

```javascript title="anchors.js"
console.log(/^\d+$/.test('123'), /^\d+$/.test('12a3'), /\d+/.test('12a3'));
const text = 'id: 7\nid: 42\nname: x';
console.log(text.match(/^id: \d+$/g));
console.log(text.match(/^id: \d+$/gm));
console.log('cat concat cat.'.replace(/\bcat\b/g, 'dog'));
console.log(/^\d+$/.test('12\n'), /^\d+$/m.test('12\n3'));
```

```output
true false true
null
[ 'id: 7', 'id: 42' ]
dog concat dog.
false true
```

`^` is the start of the input and `$` the end. Without them, `/\d+/` happily finds `12` inside `12a3`, which is why **validation patterns must be anchored at both ends** — otherwise you are asking "does this string *contain* digits?", not "is this string digits?".

With the `m` (multiline) flag, `^` and `$` also match just after and just before each line terminator, so the pattern can match each line of a multi-line string separately. Without `m`, the second pattern fails because `$` is not at the end of the input after `7`.

`\b` is a **word boundary**: a position with a word character (`\w`) on one side and a non-word character or string edge on the other. `\bcat\b` matches `cat` as a whole word and skips the `cat` inside `concat`. Using spaces instead (`/ cat /`) would miss words at the start or end of the string and next to punctuation. `\B` is the opposite, a position that is *not* a word boundary. Because `\b` is defined using `\w`, it also treats `é` as a non-word character.

The last line shows a difference from Perl and Python: in JavaScript, `$` without the `m` flag matches only at the very end of the input, never before a trailing newline, so `/^\d+$/.test('12\n')` is `false`.

### Flags

Flags come after the closing slash (or as the second constructor argument) and change how the whole pattern behaves.

| Flag | Property | Effect |
|---|---|---|
| `g` | `global` | Find all matches; makes `exec`/`test` use and update `lastIndex` |
| `i` | `ignoreCase` | Case-insensitive matching |
| `m` | `multiline` | `^` and `$` match at line breaks as well as input edges |
| `s` | `dotAll` | `.` also matches line terminators (ES2018) |
| `u` | `unicode` | Treat the pattern and input as Unicode code points; enables `\p{…}` (ES2015) |
| `v` | `unicodeSets` | Stricter successor of `u` with set operations in classes (ES2024) |
| `y` | `sticky` | Match only at exactly `lastIndex`, no scanning forward |
| `d` | `hasIndices` | Record start and end indices for the match and each group (ES2022) |

```javascript title="flags.js"
console.log(/hello/i.test('HeLLo'));
console.log(/a.b/.test('a\nb'), /a.b/s.test('a\nb'));
console.log('😀'.length, /^.$/.test('😀'), /^.$/u.test('😀'));
console.log('Zoë Ølsen 東京 42'.match(/\p{L}+/gu));
const sticky = /\d+/y;
sticky.lastIndex = 3;
console.log(sticky.exec('ab 12 34')?.[0], sticky.lastIndex);
sticky.lastIndex = 2;
console.log(sticky.exec('ab 12 34'), sticky.lastIndex);
const m = /(\d+)-(\d+)/d.exec('call 555-1234');
console.log(m.indices[0], m.indices[1], m.indices[2]);
```

```output
true
false true
2 false true
[ 'Zoë', 'Ølsen', '東京' ]
12 5
null 0
[ 5, 13 ] [ 5, 8 ] [ 9, 13 ]
```

Line by line:

- `i` makes `hello` match `HeLLo`.
- The dot does **not** match `\n` by default; this surprises people parsing multi-line text. The `s` flag fixes it. The older workaround `[\s\S]` ("any whitespace or non-whitespace") still appears in legacy code and means the same thing.
- `'😀'.length` is 2 because JavaScript strings are sequences of UTF-16 code units and an emoji outside the Basic Multilingual Plane takes two (a surrogate pair; see [[b1-unicode-strings]]). Without `u`, `.` matches one code unit, so `^.$` fails. With `u`, the engine works in whole code points and the emoji is one character.
- `\p{L}` is a **Unicode property escape**: any character in the Unicode "Letter" category, in any script. It requires `u` or `v`. Without those flags, `\p{L}` is not an error in old-style patterns; it silently means the literal text `p{L}`, another quiet failure.
- `y` (sticky) anchors the match at exactly `lastIndex`. At index 3 there are digits, so it matches `12` and moves `lastIndex` to 5. At index 2 there is a space, and instead of scanning forward the way `g` would, it fails immediately. Sticky matching is what you want when writing a tokenizer that consumes input piece by piece.
- `d` adds an `indices` array of `[start, end]` pairs for the whole match and each group, useful for editors and syntax highlighters that need positions rather than text.

The `v` flag (ES2024; Node 20+, current browsers) is a stricter version of `u` that you choose instead of it — you cannot combine `u` and `v`. It adds set operations inside classes, such as `[\p{L}--[a-z]]` (letters except lowercase ASCII) and `[\p{L}&&\p{Script=Greek}]` (intersection), and properties of strings such as `\p{RGI_Emoji}`. For new code that handles international text, `u` is the safe baseline and `v` is worth adopting where your target runtimes support it.

> [!TIP] Reading a pattern
> Read left to right and name each piece: `/^[A-Z]{2}\d{4}$/` is "start; two characters from A–Z; four digits; end". If you cannot name a piece, look it up before using the pattern.

### Catastrophic backtracking

Greedy quantifiers and alternation give the engine choices, and a backtracking engine explores choices one by one. Usually only a few are tried. But when a pattern nests quantifiers over the same characters — `(a+)+`, `(\w+\s?)*`, `(a|a)*` — and the overall match fails, the engine may try every way of dividing the input among the inner and outer quantifiers. For `n` characters that is about `2ⁿ` ways.

```javascript title="backtracking.js"
const evil = /^(a+)+$/;
for (const n of [20, 24, 26]) {
  const input = 'a'.repeat(n) + '!';
  const t = performance.now();
  evil.test(input);
  console.log(n, Math.round(performance.now() - t) + ' ms');
}
```

On one run on Node 22 this printed roughly 34 ms, 102 ms and 447 ms; exact times depend on the machine, but the growth is exponential, so thirty-something characters already take minutes. The input ends with `!` so that the final `$` can never match, forcing the engine to exhaust every split before giving up. The equivalent pattern `/^a+$/` answers instantly for a hundred thousand characters, because there is only one way to match it.

This is called **ReDoS** (Regular expression Denial of Service). Matching runs synchronously on the main thread, so in a browser the tab freezes and in Node.js the whole server stops handling requests while one regex runs. Defences: avoid nested quantifiers over overlapping character sets, prefer precise negated classes to `.*`, cap input length before matching, and never let users supply raw patterns.

```quiz
Q: What does `/^\d{3}$/.test('1234')` return, and why?
- [ ] `true`, because the string contains three digits
- [x] `false`, because the anchors require the whole string to be exactly three digits
- [ ] `true`, because `\d{3}` means "at least three digits"
- [ ] It throws, because `{3}` needs a range like `{3,3}`
> `^` and `$` pin the match to the start and end of the input, so only a string of exactly three digits passes. Without the anchors, `\d{3}` would find `123` inside `1234` and return true. `{3}` means exactly three; `{3,}` would mean three or more.

Q: Applied to `'<p>one</p><p>two</p>'`, what does `/<p>.*<\/p>/` match?
- [ ] `<p>one</p>`
- [x] The entire string
- [ ] `<p>two</p>`
- [ ] Nothing, because `/` must not appear in a pattern
> `.*` is greedy: it consumes to the end of the input, then backtracks only until `<\/p>` can match — at the last closing tag. The lazy `.*?` or a precise class such as `[^<]*` would stop at the first `</p>`. Inside a literal, `/` is allowed when escaped as `\/`.

Q: Which flag lets `.` match a newline character?
- [ ] `m`
- [ ] `u`
- [x] `s`
- [ ] `g`
> `s` (dotAll) makes `.` match line terminators. `m` is the tempting wrong answer: it changes `^` and `$` to work per line but does not change what `.` matches.
```

## Worked example: validating and normalising a product code

A shop's product codes look like `AB-1234`: two uppercase letters, a hyphen, four digits. Users type them in all sorts of ways — `ab1234`, ` Ab-1234 `, `AB 1234`. The task is to accept those, normalise them, and reject anything else.

```javascript title="product-code.js"
const CODE = /^([a-z]{2})[\s-]?(\d{4})$/i;

function normaliseCode(input) {
  const m = CODE.exec(input.trim());
  if (m === null) return null;
  return `${m[1].toUpperCase()}-${m[2]}`;
}

for (const s of ['ab1234', ' Ab-1234 ', 'AB 1234', 'ABC-1234', 'AB-123', 'AB-12345']) {
  console.log(JSON.stringify(s), '->', normaliseCode(s));
}
```

```output
"ab1234" -> AB-1234
" Ab-1234 " -> AB-1234
"AB 1234" -> AB-1234
"ABC-1234" -> null
"AB-123" -> null
"AB-12345" -> null
```

Read the pattern piece by piece. `^` and `$` anchor it, so `ABC-1234` and `AB-12345` are rejected instead of matching a substring. `[a-z]{2}` with the `i` flag accepts two letters of either case. `[\s-]?` is an optional single separator: one whitespace character or a hyphen (the hyphen is last in the class, so it is literal). `\d{4}` is exactly four digits. The parentheses capture the letter and digit parts so the function can rebuild the canonical form; groups are explained fully in [[b1-regex-groups]].

The regex is a module-level constant without the `g` flag, so sharing it between calls is safe — `exec` ignores `lastIndex` for non-global, non-sticky patterns. `trim()` handles surrounding whitespace in plain JavaScript rather than complicating the pattern.

## In real systems

**Form validation.** The HTML `pattern` attribute takes a regex (compiled with the `v` flag in current browsers and implicitly anchored at both ends). Client-side checks give quick feedback; the server must still validate, because the client can be bypassed.

**Search and highlight.** A "find in page" feature builds `new RegExp(escapeRegExp(query), 'gi')` and wraps each match in a `<mark>` element. The escaping step is what keeps a search for `C++` from crashing.

**Routing and tooling.** Older routers and many build tools turn path patterns such as `/users/:id` into regexes. Bundler configuration (`test: /\.tsx?$/` in webpack rules), linters and test runners' file filters are all regex literals.

**Log parsing.** Server-side scripts pull fields out of log lines with anchored, grouped patterns, typically with `matchAll` over the whole file.

**What not to use regex for.** HTML, JSON, and programming languages are nested structures; a regular expression cannot reliably match balanced nesting. Use `DOMParser` or the DOM for HTML, `JSON.parse` for JSON, and a real parser for code. Do not use a regex to "sanitize" HTML against cross-site scripting either — see [[b3-xss-prevention]]. Email addresses are another trap: a pattern accurate to the specification is enormous, so practical code uses a loose check such as `/^[^\s@]+@[^\s@]+$/` and confirms the address by sending a message to it.

## Trade-offs and alternatives

Regular expressions are dense: a twenty-character pattern can replace twenty lines of loop code, and the same skill transfers to editors and command-line tools. The price is readability and debuggability. A regex either matches or does not; when it fails, it tells you nothing about *why*.

| Need | Better tool |
|---|---|
| Does the string contain this exact text? | `includes`, `startsWith`, `endsWith` |
| Replace every occurrence of exact text | `replaceAll('old', 'new')` with a string |
| Split on a fixed separator | `split(',')` |
| Parse a URL | `new URL(str)` and `URLSearchParams` |
| Parse a date | `Date`, `Intl`, or Temporal |
| Parse HTML or JSON | `DOMParser`, `JSON.parse` |
| Short, flat patterns with variable shape | A regex |

When a pattern grows past one line, break it up: build it from named parts with `new RegExp(parts.join(''))`, or validate in several simple steps instead of one clever pattern. Write tests that include both matching and non-matching inputs; a regex that accepts everything passes every positive test.

## Common mistakes

> [!MISTAKE] Single backslashes in the constructor
> `new RegExp('\d+')` silently becomes `/d+/`. Write `'\\d+'`, or use `` String.raw`\d+` ``, and print `re.source` when in doubt.

**Forgetting anchors on validation.** `/\d{5}/.test('my zip is 123456')` is `true`. A validation pattern needs `^…$`.

**Interpolating user input unescaped.** It produces wrong matches, syntax errors on `(` or `[`, and ReDoS risk. Escape with a helper (or `RegExp.escape` where supported), or avoid regex for literal searches.

**Assuming `.` matches everything.** It skips `\n`, `\r`, and the Unicode line and paragraph separators. Use the `s` flag for multi-line content.

**Assuming `\w` and `\b` understand accented letters.** They are ASCII-based. Use `\p{L}` with `u` or `v` for letters in any language.

**Reusing a global regex.** `const RE = /x/g` shared across calls to `test` makes answers depend on the previous call's `lastIndex`. Drop the `g` when you only need a yes/no answer.

**Greedy `.*` over structured text.** It runs to the last possible delimiter. Use a negated class like `[^"]*` or a lazy quantifier.

## Interview perspective

Interviewers ask about regex to see whether you understand JavaScript's object model and its sharp edges, not whether you have memorised syntax.

> [!INTERVIEW] A strong answer about literal versus constructor
> "A literal is parsed with the script, so syntax errors surface immediately and I don't double-escape backslashes. I use `new RegExp` only when part of the pattern is runtime data, and then I escape that data first — both for correctness and because unescaped input can be a ReDoS vector. Either way the result is a stateful object: with `g` or `y`, `lastIndex` makes `test` and `exec` resume from the last match, so I don't share global regexes."

Questions you should be able to answer:

- **Why does `new RegExp('\d')` not match digits?** String escape processing drops the backslash before the RegExp sees it.
- **What is `lastIndex` and when does it matter?** The resume position for `exec`/`test` with `g` or `y`; it causes alternating results when a global regex is reused.
- **Greedy versus lazy?** Greedy takes as much as possible and backtracks; lazy takes as little as possible and grows. Show `<.+>` versus `<.+?>`.
- **What does the `m` flag change, and what does `s` change?** `m` changes `^`/`$`; `s` changes `.`. Candidates often mix these up.
- **What is catastrophic backtracking?** Nested or overlapping quantifiers give exponentially many ways to fail; the fix is to remove ambiguity and limit input length.

## Practice

1. Write a pattern that accepts a 24-hour time such as `09:30` or `23:59` and rejects `24:00` and `9:30`. Test it with at least four rejecting inputs.
2. Write `highlight(text, query)` that wraps every case-insensitive occurrence of `query` in `[` and `]`, and make sure `highlight('a+b and A+B', 'a+b')` works.
3. Build a regex from an array of banned words that matches any of them as a whole word, ignoring case. What happens if one of the words is `c++`?
4. Explain why `/^(\d+)*$/` is dangerous and rewrite it to accept the same strings safely.
5. Write a pattern that matches a word made only of letters in any script, and show that it accepts `Zoë` and rejects `Zoë2`.

## Quick revision {#quick-revision}

- A regex is a `RegExp` object: `/pattern/flags` or `new RegExp('pattern', 'flags')`; `source`, `flags`, `lastIndex` are its key properties.
- Literal: parsed with the script, errors early, single backslashes. Constructor: runtime, needs `'\\d'` or `String.raw`, throws `SyntaxError` when called.
- `new RegExp('\d')` is `/d/` — silent failure. Print `source` to debug.
- Escape user input before building a pattern (`escapeRegExp` helper; `RegExp.escape` in ES2025, Node 24+).
- `g`/`y` regexes are stateful through `lastIndex`; do not share them between unrelated `test`/`exec` calls.
- Classes `[abc] [^abc] [a-z] \d \w \s .`; `\w`, `\d`, `\b` are ASCII-only; use `\p{L}` with `u`/`v`.
- Quantifiers `* + ? {n} {n,} {n,m}` are greedy; add `?` for lazy. Prefer negated classes like `[^>]+`.
- Anchors `^ $ \b \B` match positions; anchor validation patterns at both ends.
- Flags: `g` all, `i` case, `m` line anchors, `s` dot matches newline, `u`/`v` Unicode, `y` sticky, `d` indices.
- Nested quantifiers such as `(a+)+` can backtrack exponentially (ReDoS).

## Key takeaways {#key-takeaways}

- Use a regex literal for fixed patterns and the constructor only when part of the pattern is runtime data.
- The constructor takes a string, so every regex backslash must survive string escaping first; `String.raw` makes this painless.
- Text from users must be escaped before it becomes part of a pattern, for correctness and for safety.
- A RegExp with `g` or `y` carries a cursor in `lastIndex`, which makes reuse across calls a source of bugs.
- Every pattern is classes, quantifiers, anchors and flags; naming each piece is how you read and debug one.
- Regex is the right tool for short, flat text patterns and the wrong tool for nested formats like HTML and JSON.
