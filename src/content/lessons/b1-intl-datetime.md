---
summary: "`Intl.DateTimeFormat` turns an instant into text a person in a particular language and time zone expects to read. You will learn how locales and options control the output, how to show any IANA time zone, how `formatToParts` and `formatRange` give you structured and range output, and why formatted strings are for display only."
difficulty: intermediate
minutes: 40
objectives:
  - Format a date for a given locale and time zone with `dateStyle`/`timeStyle` or individual component options
  - Explain how locale negotiation, the default locale and the default time zone are chosen
  - Choose between `hour12` and `hourCycle`, and between the `timeZoneName` styles
  - Use `formatToParts` to style output or to read wall-clock fields in another time zone
  - Reuse formatters for performance and avoid tests and parsers that depend on exact formatted strings
---

## Introduction

A `Date` holds an instant; people read wall-clock text. The same instant should appear as "Mar 9, 2024, 4:05 PM" to an American, "9 Mar 2024, 16:05" to a Briton, and "2024/03/09 16:05" to a Japanese reader — and if the American lives in New York, the hour should be 11:05 AM, not 4:05 PM. Getting this right by hand means knowing every language's month names, word order, separators, 12- or 24-hour preference and time-zone rules. Nobody should write that code.

**`Intl.DateTimeFormat`** is the built-in formatter that does it. It is part of the **ECMAScript Internationalization API** (ECMA-402), a companion standard to the JavaScript language specification that defines `Intl.NumberFormat`, `Intl.PluralRules`, `Intl.RelativeTimeFormat` and others. Engines implement it with **ICU** (International Components for Unicode), a C/C++ library, and **CLDR** (the Unicode Common Locale Data Repository), which supplies the formatting conventions for hundreds of locales. Time-zone rules come from the IANA time-zone database.

The mental model is a printer. You configure it once with a locale and options; then you hand it instants and it returns strings. It does not parse, it does not do arithmetic, and it never changes the date you give it. That separation matters: keep data as instants (`Date`, timestamps, ISO strings) and only format at the moment you display it.

## Before you start

- **Date basics** — a `Date` is a millisecond time value, read either in UTC or the host zone. See [[b1-date-basics]].
- **Local time versus UTC** — what a time zone and an offset are, and why the "previous day" bug happens. See [[b1-local-vs-utc]].
- **Objects and destructuring** — options are passed as an object. See [[b1-object-literals]].

Snippets run in Node.js 22 (ICU 78) as ES modules. Formatting output comes from CLDR data, which changes between releases: your runtime may differ in small details such as spaces or punctuation. That point comes back in the section on testing.

## The intuition

Imagine an airline's departure board. The flight data in the airline's system says "departs at instant 1710000300000". The board in Frankfurt shows `16:05`, the airline app on a passenger's phone in New York shows `11:05 AM`, and the passenger's Japanese colleague sees `1:05` the next morning. None of these screens changed the departure time; each formatted the same instant for its reader.

`Intl.DateTimeFormat` is the software behind those screens. The **locale** decides language and conventions (`de-DE`, `en-US`, `ja-JP`). The **time zone** decides which wall clock to read. The **options** decide which pieces to show and how long they are. The **instant** is the only input that should come from your data.

## Creating and using a formatter

The constructor takes a locale (or list of locales) and an options object. Its `format` method takes a `Date` or a millisecond number and returns a string.

```javascript title="locales.mjs"
const order = new Date('2024-03-09T16:05:00Z');
const options = { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' };

for (const locale of ['en-US', 'en-GB', 'de-DE', 'ja-JP', 'hi-IN']) {
  const fmt = new Intl.DateTimeFormat(locale, options);
  console.log(locale.padEnd(6), fmt.format(order));
}
```

```output
en-US  Mar 9, 2024, 4:05 PM
en-GB  9 Mar 2024, 16:05
de-DE  09.03.2024, 16:05
ja-JP  2024/03/09 16:05
hi-IN  9 मार्च 2024, 4:05 pm
```

One set of options produced five correct, different strings. The order of day and month, the separators, the month name language and the 12- or 24-hour clock all came from the locale's CLDR data. Your code only chose *how much* to show (`medium` date, `short` time).

### Locales and negotiation

A **locale** identifier is a BCP 47 language tag: a language (`en`), optionally a region (`en-GB`), a script (`zh-Hant`), and Unicode extensions after `-u-` (covered below). You can pass a single tag, an array in order of preference, or `undefined` to use the runtime's default locale — in a browser, usually derived from the user's language settings; in Node.js, from the environment.

The formatter performs **locale negotiation**: it picks the best locale it actually supports from your list, falling back to the default. `resolvedOptions().locale` tells you what it chose, and `Intl.DateTimeFormat.supportedLocalesOf(list)` filters a list to supported tags.

```javascript title="negotiation.mjs"
console.log(Intl.DateTimeFormat.supportedLocalesOf(['fr-CA', 'xx-XX', 'en']));
console.log(new Intl.DateTimeFormat(['xx-XX', 'fr-FR'], { timeZone: 'UTC' })
  .resolvedOptions().locale);
```

```output
[ 'fr-CA', 'en' ]
fr-FR
```

In a browser, `navigator.languages` gives the user's preference list and is a good argument to pass. Passing nothing is also reasonable for "the user's own conventions". Hard-coding `'en-US'` is right only when the product really is US-English only.

### The time zone

Without a `timeZone` option, the formatter uses the **host time zone** — the same zone that `Date`'s local methods use. With one, you can display any IANA zone, which `Date` alone cannot do.

```javascript title="zones.mjs"
const instant = new Date('2024-03-09T16:05:00Z');
for (const timeZone of ['UTC', 'America/New_York', 'Asia/Kolkata', 'Asia/Tokyo']) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone,
  });
  console.log(timeZone.padEnd(17), fmt.format(instant));
}
```

```output
UTC               Saturday, March 9, 2024 at 4:05 PM
America/New_York  Saturday, March 9, 2024 at 11:05 AM
Asia/Kolkata      Saturday, March 9, 2024 at 9:35 PM
Asia/Tokyo        Sunday, March 10, 2024 at 1:05 AM
```

In Tokyo it is already Sunday. The formatter applies each zone's rules, including daylight saving time (DST), for the specific instant. Use IANA names (`Europe/London`), not abbreviations (`BST`) — abbreviations are ambiguous ("IST" is used for India, Ireland and Israel) and are not accepted as zone identifiers. An unknown name throws `RangeError` at construction, which is useful: validate zone names users choose by constructing a formatter. `Intl.supportedValuesOf('timeZone')` lists the zones the runtime knows.

The browser's zone is available as `Intl.DateTimeFormat().resolvedOptions().timeZone`. Send it to your server when the user signs up so emails and reports can be formatted for them.

## Choosing what to show

There are two ways to describe the output, and they cannot be mixed.

### Style shortcuts: `dateStyle` and `timeStyle`

`dateStyle` and `timeStyle` each take `'full'`, `'long'`, `'medium'` or `'short'`. They let the locale decide everything else, which is the easiest way to get output that looks native.

```javascript title="styles.mjs"
const d = new Date('2024-03-09T16:05:00Z');
const style = (dateStyle) =>
  new Intl.DateTimeFormat('en-US', { dateStyle, timeZone: 'UTC' }).format(d);
for (const s of ['full', 'long', 'medium', 'short']) console.log(s.padEnd(6), style(s));
const tstyle = (timeStyle) =>
  new Intl.DateTimeFormat('en-US', { timeStyle, timeZone: 'UTC' }).format(d);
for (const s of ['full', 'long', 'medium', 'short']) console.log(s.padEnd(6), tstyle(s));
```

```output
full   Saturday, March 9, 2024
long   March 9, 2024
medium Mar 9, 2024
short  3/9/24
full   4:05:00 PM Coordinated Universal Time
long   4:05:00 PM UTC
medium 4:05:00 PM
short  4:05 PM
```

Notice the `short` date uses a two-digit year and that `long` and `full` times include the zone name. Pass only `dateStyle` for a date without time, only `timeStyle` for a time without date, or both.

### Component options

For finer control, request individual fields: `weekday`, `era`, `year`, `month`, `day`, `dayPeriod`, `hour`, `minute`, `second`, `fractionalSecondDigits` and `timeZoneName`. Most take `'numeric'` or `'2-digit'`; `month` also takes `'long'`, `'short'` and `'narrow'`; `weekday` takes `'long'`, `'short'` or `'narrow'`.

```javascript title="components.mjs"
const d = new Date('2024-03-09T16:05:00Z');
const custom = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'America/New_York',
  timeZoneName: 'short',
});
console.log(custom.format(d));

const monthYear = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });
console.log(monthYear.format(d));

try {
  new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', hour: 'numeric' });
} catch (err) {
  console.log(err.name);
}
```

```output
Sat, Mar 9, 11:05 AM EST
March 2024
TypeError
```

You choose *which* fields appear; the locale still decides their order and punctuation. You cannot say "put the year first" — that would defeat the purpose. If no date or time fields are given at all, the default is a numeric date (`3/9/2024` in `en-US`). Combining `dateStyle`/`timeStyle` with component options throws a `TypeError`.

### 12-hour or 24-hour: `hour12` and `hourCycle`

Each locale has a preferred **hour cycle**: `h12` (1–12, with AM/PM; US), `h23` (0–23; most of Europe), and the rarer `h11` (0–11 with a day period, an option in Japanese) and `h24` (1–24). Two options override it:

```javascript title="hour-cycle.mjs"
const d = new Date('2024-03-09T00:05:00Z');
const show = (locale, extra) =>
  new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', timeZone: 'UTC', ...extra })
    .format(d);
console.log(show('en-US', {}));
console.log(show('en-GB', {}));
console.log(show('en-US', { hour12: false }));
console.log(show('en-US', { hourCycle: 'h23' }));
console.log(show('en-GB', { hour12: true }));
console.log(show('ja-JP', { hourCycle: 'h11' }));
console.log(show('en-US-u-hc-h23', {}));
```

```output
12:05 AM
0:05
00:05
00:05
12:05 am
午前0:05
00:05
```

`hour12: true/false` says "12-hour or not" and lets the locale pick which variant. `hourCycle` names the exact cycle. If both are given, `hour12` wins and `hourCycle` is ignored. The hour cycle can also come from the locale tag's Unicode extension, `-u-hc-h23`, which is how a user preference stored as a locale string can carry it. Prefer leaving the cycle to the locale unless the user chose otherwise in your app's settings; Americans generally expect AM/PM and most Europeans do not.

### Time-zone names

`timeZoneName` controls how the zone is labelled. The offset and generic styles are newer additions, supported in current browsers and Node.js.

```javascript title="zone-names.mjs"
const d = new Date('2024-07-09T16:05:00Z');
for (const timeZoneName of ['short', 'long', 'shortOffset', 'longOffset', 'shortGeneric', 'longGeneric']) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric', minute: '2-digit', timeZone: 'America/Los_Angeles', timeZoneName,
  });
  console.log(timeZoneName.padEnd(12), fmt.format(d));
}
```

```output
short        9:05 AM PDT
long         9:05 AM Pacific Daylight Time
shortOffset  9:05 AM GMT-7
longOffset   9:05 AM GMT-07:00
shortGeneric 9:05 AM PT
longGeneric  9:05 AM Pacific Time
```

`short` names such as `PDT` exist only for zones that have well-known abbreviations in that locale; for others (`Asia/Kolkata` in `en-US`) you get `GMT+5:30`. The generic styles ("Pacific Time") suit schedules that span DST changes, such as "Meetings every Tuesday at 9:00 AM PT".

### Calendars and numbering systems

The `-u-` extension (or the `calendar` and `numberingSystem` options) changes the calendar or digits. `ar-EG` uses Arabic-Indic digits by default, while `ar-EG-u-nu-latn` uses Latin digits; `en-US-u-ca-buddhist` formats 9 March 2024 as `March 9, 2567 BE`. You rarely set these yourself, but users' locales may carry them, which is another reason not to parse formatted output.

## Structured output: `formatToParts`

`format` returns one string. `formatToParts` returns the same output as an array of `{ type, value }` pieces, where `type` is a field name (`weekday`, `month`, `day`, `hour`, `dayPeriod`, `timeZoneName`, …) or `literal` for separators.

```javascript title="parts.mjs"
const d = new Date('2024-03-09T16:05:00Z');
const fmt = new Intl.DateTimeFormat('en-US', {
  weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC',
});
console.log(fmt.format(d));
const parts = fmt.formatToParts(d);
console.log(parts);
const html = parts
  .map(({ type, value }) => (type === 'weekday' ? `<strong>${value}</strong>` : value))
  .join('');
console.log(html);
```

```output
Saturday, March 9
[
  { type: 'weekday', value: 'Saturday' },
  { type: 'literal', value: ', ' },
  { type: 'month', value: 'March' },
  { type: 'literal', value: ' ' },
  { type: 'day', value: '9' }
]
<strong>Saturday</strong>, March 9
```

Joining all `value`s always reproduces `format`'s output. Use parts when you need to style one piece (bold weekday, smaller year) without assuming where it sits — in German the weekday is still first, in Japanese it is last. Parts are also the reliable way to *read* fields, as the worked example shows; do not split the formatted string on spaces or commas.

## Ranges: `formatRange`

Showing a span — a hotel stay, an event — with two separate `format` calls repeats information ("Mar 9, 2024 – Mar 12, 2024"). `formatRange(start, end)` collapses shared fields the way the locale prefers.

```javascript title="ranges.mjs"
const fmt = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' });
const checkIn = new Date('2024-03-09T00:00:00Z');
console.log(fmt.formatRange(checkIn, new Date('2024-03-12T00:00:00Z')));
console.log(fmt.formatRange(checkIn, new Date('2024-04-02T00:00:00Z')));
console.log(fmt.formatRange(checkIn, new Date('2025-01-02T00:00:00Z')));
const t = new Intl.DateTimeFormat('en-GB', { timeStyle: 'short', timeZone: 'UTC' });
console.log(t.formatRange(new Date('2024-03-09T09:00:00Z'), new Date('2024-03-09T10:30:00Z')));
```

```output
Mar 9 – 12, 2024
Mar 9 – Apr 2, 2024
Mar 9, 2024 – Jan 2, 2025
09:00–10:30
```

The en-US ranges use a thin space (U+2009) around the en dash, which looks like a normal space but is not one — a detail that matters in tests. `formatRangeToParts` gives the structured version, with each part tagged `source: 'startRange' | 'endRange' | 'shared'`.

## How it works internally

Construction does most of the work. The constructor canonicalises the locale list, negotiates against available locales, reads and validates every option (throwing `RangeError` for bad values such as an unknown zone, `TypeError` for conflicting options), resolves the defaults the locale implies (hour cycle, calendar, numbering system), and asks ICU to build a **pattern** — a template like `MMM d, y, h:mm a` — for exactly those fields in that locale. `format` then converts the time value to wall-clock fields in the chosen zone and fills the pattern.

That split explains the performance advice. Building a formatter loads locale data and compiles a pattern, which is far more expensive than formatting one value. `Date.prototype.toLocaleString`, `toLocaleDateString` and `toLocaleTimeString` accept the same `(locales, options)` arguments, but conceptually create a new formatter on each call (engines may cache some cases).

```javascript title="reuse.mjs"
const dates = Array.from({ length: 50000 }, (_, i) => new Date(Date.UTC(2024, 0, 1) + i * 60000));
let t = performance.now();
for (const d of dates) d.toLocaleDateString('en-US', { timeZone: 'UTC', dateStyle: 'medium' });
console.log('toLocaleDateString', Math.round(performance.now() - t), 'ms');
const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', dateStyle: 'medium' });
t = performance.now();
for (const d of dates) fmt.format(d);
console.log('reused formatter  ', Math.round(performance.now() - t), 'ms');
```

```output
toLocaleDateString 1669 ms
reused formatter   25 ms
```

The timings are from one run on one machine and will vary, but the gap — tens of times faster — is typical when options are passed. For a table of 50 rows it does not matter; for a virtualised list or a chart axis with thousands of labels it does. Create formatters once (module level, or `useMemo` in React keyed by locale and zone) and reuse them. `fmt.format` is a getter returning a bound function, so `dates.map(fmt.format)` works without `.bind`.

## Worked example: wall-clock fields in another zone

A support desk in Tokyo is open Monday to Friday, 09:00–18:00 Tokyo time. The web app, running anywhere, must show "open" or "closed". `Date`'s local methods only know the host zone, but a formatter with `timeZone: 'Asia/Tokyo'` and `formatToParts` can read Tokyo's wall clock for any instant.

```javascript title="desk-hours.mjs"
// Read the wall-clock fields of an instant in any IANA time zone.
const partsFormatters = new Map();   // formatters are costly to build: cache per zone

function zonedFields(date, timeZone) {
  let fmt = partsFormatters.get(timeZone);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', weekday: 'short',
      hourCycle: 'h23',                // 0-23, never "24" or AM/PM
    });
    partsFormatters.set(timeZone, fmt);
  }
  const fields = {};
  for (const { type, value } of fmt.formatToParts(date)) {
    if (type !== 'literal') fields[type] = value;
  }
  return {
    dateKey: `${fields.year}-${fields.month}-${fields.day}`,
    hour: Number(fields.hour),
    minute: Number(fields.minute),
    weekday: fields.weekday,
  };
}

// Is a support desk in Tokyo open (Mon-Fri, 09:00-18:00 local)?
function isDeskOpen(date) {
  const { weekday, hour } = zonedFields(date, 'Asia/Tokyo');
  return !['Sat', 'Sun'].includes(weekday) && hour >= 9 && hour < 18;
}

const instants = ['2024-03-08T01:30:00Z', '2024-03-08T09:30:00Z', '2024-03-09T01:30:00Z'];
for (const iso of instants) {
  const d = new Date(iso);
  console.log(iso, zonedFields(d, 'Asia/Tokyo'), isDeskOpen(d));
}
```

```output
2024-03-08T01:30:00Z { dateKey: '2024-03-08', hour: 10, minute: 30, weekday: 'Fri' } true
2024-03-08T09:30:00Z { dateKey: '2024-03-08', hour: 18, minute: 30, weekday: 'Fri' } false
2024-03-09T01:30:00Z { dateKey: '2024-03-09', hour: 10, minute: 30, weekday: 'Sat' } false
```

Step by step:

- The formatter is fixed to `'en-US'` on purpose. This is not display code; it is extracting machine-readable fields, so the locale must be stable (Latin digits, English weekday abbreviations). Using the user's locale here would break the `'Sat'` check for a German user.
- `hourCycle: 'h23'` guarantees hours from `00` to `23`. Without it, `en-US` gives AM/PM, and `hour12: false` in some older engines produced `24` for midnight.
- The parts are collected by `type`, never by position, so the code does not depend on `en-US` field order.
- The formatters are cached per zone because `zonedFields` may run for every row of a list.
- The `dateKey` is the Tokyo calendar date, useful for grouping events by the day *in that office*, which `toISOString().slice(0, 10)` (the UTC day) cannot give.

Going the other way — "what instant is 09:00 in Tokyo on 8 March?" — is not something `Intl` can do, because a formatter cannot parse. That needs `Temporal.ZonedDateTime` ([[b1-temporal-api]]) or a library such as Luxon.

## In real systems

- **Product UIs** create a small set of shared formatters (`formatDate`, `formatDateTime`, `formatTime`) parameterised by the user's locale and zone, so every screen agrees.
- **Server-side rendering** is a common source of hydration mismatches: the server formats in its own locale and zone (often `en-US`, UTC), the browser in the user's, and React warns that the text differs. Fix it by passing the user's locale and `timeZone` explicitly on both sides, or by formatting time-sensitive text only on the client.
- **Emails and notifications** are formatted on the server with the zone stored on the user's profile, since there is no browser to ask.
- **Relative times** ("3 hours ago", "yesterday") use the sibling `Intl.RelativeTimeFormat`: `new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-1, 'day')` returns `'yesterday'`. You compute the difference yourself; it only formats.
- **Temporal objects** (`Temporal.PlainDate`, `ZonedDateTime` and others) can be passed to `format` in engines that support Temporal; see [[b1-temporal-api]].

## Trade-offs and alternatives

`Intl.DateTimeFormat` is built in, so it adds nothing to the bundle, ships locale data for hundreds of locales, and handles DST and time-zone rules correctly. Its limits are deliberate: it formats only, it does not let you dictate field order, and its exact output can change between engine versions as CLDR data improves.

| Need | Use |
|---|---|
| Show a date or time to a user | `Intl.DateTimeFormat` (or `toLocale*String` for one-off calls) |
| A fixed machine format (logs, APIs, file names) | `toISOString()` — never a locale format |
| An exact custom pattern such as `yyyy/MM/dd` | Build it from `formatToParts` or UTC getters, or use a library's pattern formatter |
| "5 minutes ago" | `Intl.RelativeTimeFormat` |
| Parse user-entered dates | A date picker that yields ISO, or explicit parsing code; never parse formatted output |

## Common mistakes

> [!MISTAKE] Asserting exact formatted strings in tests
> CLDR updates change details: around 2023 an update switched the space before AM/PM in `en-US` to a narrow no-break space (U+202F), breaking many test suites, and range output uses thin spaces. Pin `locale` and `timeZone` in tests, compare `formatToParts` fields, or build the expected value with the same formatter.

**Omitting `timeZone` on the server or in tests.** The output then depends on the machine's zone. CI in UTC and a laptop in India will produce different snapshots.

**Parsing formatted text back.** `new Date(fmt.format(d))` works for some locales in some engines and fails for others. Keep the original instant.

**Using offsets or abbreviations as zones.** `'EST'` is not the same as `'America/New_York'` (it never observes DST), and many abbreviations are rejected or ambiguous. Store IANA names.

**Creating a formatter per call in hot paths.** Use one formatter per locale/options combination.

**Mixing `dateStyle`/`timeStyle` with component options.** It throws `TypeError`; pick one approach.

**Expecting `hourCycle` to win over `hour12`.** When both are present, `hour12` takes precedence.

## Interview perspective

**"How would you show an order time to users around the world?"** Store the instant in UTC; format on display with `Intl.DateTimeFormat`, passing the user's locale (from `navigator.languages` or their profile) and their IANA time zone. Mention reusing formatters and that formatted strings are not round-trippable.

**"How do you get the current hour in Tokyo in JavaScript?"** `Date` alone cannot; use `formatToParts` with `timeZone: 'Asia/Tokyo'` and `hourCycle: 'h23'`, or `Temporal.Now.zonedDateTimeISO('Asia/Tokyo').hour` where available.

**"Why does our SSR page warn about text mismatch near dates?"** Server and client format with different default locales or zones; pass both explicitly or render on the client.

**Follow-up: "Why not just use `toLocaleString()`?"** It is fine for one-off use and takes the same options, but in a loop it rebuilds formatting state each call; a reused `Intl.DateTimeFormat` is much faster.

## Practice

1. Format `2024-12-31T23:30:00Z` in `en-US`, `en-GB` and `ja-JP` for `America/Los_Angeles`, `Europe/Paris` and `Asia/Tokyo`. Which combinations show a different year?
2. Write `formatEventTime(date, locale, timeZone)` that caches formatters in a `Map` keyed by `locale + '|' + timeZone`.
3. Use `formatToParts` to render a date with the year in a smaller `<span>` for `en-US` and `de-DE`, without assuming the year's position.
4. Write `isValidTimeZone(name)` using the constructor's `RangeError`, and test it with `'Europe/London'`, `'BST'` and `'Mars/Olympus'`.
5. Write a test for a date label that does not break when CLDR changes spacing.

```quiz
Q: A formatter is created with `new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })` and used on a Node.js server in UTC and in a browser in Tokyo. Why might the two show different dates for the same instant?
- [ ] `en-US` formats dates differently on servers and browsers
- [x] No `timeZone` was given, so each uses its own host zone, and the instant can fall on different calendar days
- [ ] `dateStyle: 'medium'` rounds to the nearest day
- [ ] Browsers always format in UTC
> Without `timeZone`, the formatter uses the host's zone. An instant late on 9 March in UTC is already 10 March in Tokyo. Passing an explicit `timeZone` makes the output depend only on your inputs. The locale controls wording, not the zone.
```

```quiz
Q: You need the hour (0–23) of an instant in `Europe/Berlin`. Which approach is reliable?
- [ ] `date.getHours()` after setting `process.env.TZ` in the browser
- [ ] Split `date.toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })` on spaces and colons
- [x] `formatToParts` with `timeZone: 'Europe/Berlin'`, `hour: '2-digit'`, `hourCycle: 'h23'`, then read the part whose `type` is `'hour'`
- [ ] `new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' })).getHours()`
> `formatToParts` labels each field, so its position and separators do not matter, and `h23` fixes the range. Splitting strings depends on locale and CLDR details. Re-parsing a formatted string relies on unspecified parsing and reintroduces the host zone. Browsers have no `process.env.TZ`.
```

```quiz
Q: What happens with `new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: true, hourCycle: 'h23' })`?
- [ ] It throws because the options conflict
- [ ] It uses 24-hour time because `hourCycle` is more specific
- [x] It uses 12-hour time, because `hour12` overrides `hourCycle`
- [ ] It ignores both and uses the locale default
> The specification gives `hour12` precedence: when it is present, `hourCycle` is ignored and the 12-hour variant suited to the locale is used. Conflicting style and component options (like `dateStyle` with `hour`) throw, but these two do not.
```

## Quick revision {#quick-revision}

- `new Intl.DateTimeFormat(locales, options).format(dateOrMs)` → localised string. Formatting only: no parsing, no arithmetic.
- Specified by ECMA-402; implemented with ICU, CLDR locale data and the IANA zone database. Output may change between versions.
- Locales are BCP 47 tags; a list is negotiated; `resolvedOptions().locale` shows the choice; `undefined` means the runtime default.
- No `timeZone` → host zone. Pass IANA names (`America/New_York`); unknown names throw `RangeError`. User zone: `Intl.DateTimeFormat().resolvedOptions().timeZone`.
- `dateStyle`/`timeStyle` (`full`/`long`/`medium`/`short`) or component options (`weekday`, `year`, `month`, `day`, `hour`, `minute`, `second`, `timeZoneName`, …) — mixing them throws `TypeError`.
- Locale decides field order and punctuation; you decide which fields.
- `hour12` (boolean) overrides `hourCycle` (`h11`/`h12`/`h23`/`h24`); `-u-hc-`, `-u-ca-`, `-u-nu-` extensions set cycle, calendar, digits.
- `timeZoneName`: `short`, `long`, `shortOffset`, `longOffset`, `shortGeneric`, `longGeneric`.
- `formatToParts` → `{ type, value }[]` for styling and for reading zoned fields; `formatRange` collapses shared fields.
- Construction is expensive: reuse formatters; `toLocale*String` with options is much slower in loops. `fmt.format` is pre-bound.
- Do not assert exact strings in tests or parse formatted output; store ISO/timestamps.

## Key takeaways {#key-takeaways}

- Keep instants as data and format only at display time, with an explicit locale and time zone.
- Prefer `dateStyle`/`timeStyle` for native-looking output; use component options when you need specific fields.
- `formatToParts` is the safe way to style pieces or read wall-clock fields in another zone.
- Build formatters once and reuse them.
- Formatted strings are for people: never parse them, and never depend on their exact characters in tests.
