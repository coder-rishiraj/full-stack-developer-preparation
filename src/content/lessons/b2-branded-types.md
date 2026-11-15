---
summary: TypeScript compares types by shape, so a user ID and an order ID that are both strings are interchangeable. Branded types add a compile-time-only marker that makes such values distinct, at zero runtime cost. You will learn how to build brands, how to create branded values safely through validation, and where the technique stops protecting you.
difficulty: advanced
minutes: 40
objectives:
  - Explain why structural typing lets same-shaped values be mixed up, and how a brand makes them incompatible
  - Build a reusable `Brand` helper using an intersection and a `unique symbol` key
  - Create branded values only through validating constructors, type guards or assertion functions
  - Predict when a brand is lost, such as arithmetic, string methods and JSON round-trips
  - Compare brands with class-based and wrapper-object alternatives and choose between them
---

## Introduction

Look at this function signature:

```typescript title="signature.ts"
function refund(customerId: string, orderId: string, amount: number) {}
```

Every argument is a primitive, so every call that passes two strings and a number compiles — including `refund(orderId, customerId, amountInDollars)`, which swaps the IDs and uses the wrong unit. The compiler cannot help, because as far as TypeScript is concerned a customer ID *is* a string, an order ID *is* a string, and dollars and cents are both numbers.

This class of bug is real and expensive. NASA's Mars Climate Orbiter was lost in 1999 because one piece of software produced impulse values in pound-force seconds while another expected newton-seconds: two numbers with the same type and different meanings. In web applications the same mistake shows up as a user ID passed where an organisation ID was expected, an unvalidated email address reaching the mail service, or untrusted HTML reaching `innerHTML`.

A **branded type** (also called an *opaque*, *tagged* or *nominal* type) fixes this by giving such values a distinct type that only exists at compile time:

```typescript title="preview.ts"
type CustomerId = string & { readonly __brand: "CustomerId" };
type OrderId = string & { readonly __brand: "OrderId" };
```

At runtime a `CustomerId` is still an ordinary string. At compile time it carries an invisible label, and a value labelled `OrderId` is rejected wherever a `CustomerId` is required. You pay nothing in performance or memory, and you gain an error at exactly the line where the mix-up happens.

The technique is a staple of domain-heavy TypeScript code (payments, healthcare, anything with many kinds of identifiers), is built into validation libraries such as Zod, and is a common interview question because it tests whether you understand how TypeScript compares types.

## Before you start

- **Structural typing** — TypeScript decides compatibility by comparing shapes, not names. See [[b2-structural-typing]], which also gives a short first look at brands; this lesson goes deeper.
- **Literal types** — `"CustomerId"` as a type, not just a value. See [[b2-literal-types]].
- **Type assertions (`as`)** — and why they are unchecked claims. See [[b2-type-assertions]].
- **Type guards and narrowing** — `x is T` and `asserts x is T`. See [[b2-narrowing]].
- **Symbols** — what a JavaScript `Symbol` is. See [[b1-symbols]].
- **Generics** — writing a reusable `Brand<T, Name>`. See [[b2-generics]].

## The intuition

Picture a warehouse full of identical brown boxes. Some hold customer records, some hold orders. Because the boxes look the same, a worker can easily put one on the wrong shelf. The fix is not to change the boxes — that would be expensive — but to stick a coloured label on each: blue for customers, green for orders. The shelves only accept boxes with the right colour label.

A brand is that label, with one important twist: **it exists only on the paperwork**. The compiler sees the label and enforces the shelf rules; at runtime there is no label, just the box. So whoever sticks on the labels must check what is inside first. If they label an order box blue without looking, the compiler will happily put it on the customer shelf. In code, "sticking on the label" is a type assertion, and "checking what is inside" is validation. Most of this lesson is about making those two happen together.

## Structural versus nominal typing

In a **nominal** type system — Java, C#, Rust — two types are compatible only if they have the same *name* (or one is declared as a subtype of the other). Two classes with identical fields are still different types.

TypeScript is **structural**: two types are compatible when their *shapes* are compatible. That matches how JavaScript is written — objects are created from literals and passed around freely — and it makes most code pleasant to type. It also means that type aliases are only nicknames:

```typescript title="alias.ts"
type CustomerId = string;
type OrderId = string;

const order: OrderId = "ord_42";
const customer: CustomerId = order; // compiles: both are just string
```

A type alias does not create a new type; it gives an existing one another name. To make `CustomerId` and `OrderId` incompatible, their *shapes* must differ. A brand is a way to make the shapes differ without changing the runtime value.

## Building a brand step by step

### An intersection with a property that never exists

Start with an **intersection type**, `A & B`, which describes values that are both an `A` and a `B`. Intersect `string` with an object type holding a marker property:

```typescript title="basic-brand.ts"
type CustomerId = string & { readonly __brand: "CustomerId" };
type OrderId = string & { readonly __brand: "OrderId" };

function refund(customerId: CustomerId, orderId: OrderId) {
  return `refund ${orderId} for ${customerId}`;
}

const customerId = "cus_7" as CustomerId;
const orderId = "ord_42" as OrderId;

console.log(refund(customerId, orderId));
// refund(orderId, customerId);  // error: '"OrderId"' is not assignable to '"CustomerId"'
// refund("cus_7", orderId);     // error: string is missing property '__brand'
```

```output
refund ord_42 for cus_7
```

Three things make this work:

1. **The shapes now differ.** `CustomerId` requires `__brand: "CustomerId"`, `OrderId` requires `__brand: "OrderId"`, and those two literal types are incompatible. Swapping the arguments is a compile error.
2. **A plain string is not enough.** `"cus_7"` has no `__brand` property, so it cannot be passed where a `CustomerId` is required. You cannot get a branded value by accident.
3. **The branded value is still a string.** Because `CustomerId` is `string & ...`, it is assignable to `string` and has every string method. `customerId.startsWith("cus_")` works, and you can pass it to any function that accepts a `string`.

The `__brand` property is a **phantom property**: the type system believes it exists, but no real string has it. That is the whole trick. It is also why the brand is created with `as` — no actual value has the type, so you have to *assert* it. The `readonly` modifier stops code from appearing to assign the brand, which would be meaningless.

### Hiding the key with `unique symbol`

The string key `__brand` has two weaknesses. It shows up in editor autocompletion on every branded value, inviting people to read a property that is always `undefined` at runtime. And two brands declared independently with the same name are the *same* type — if two packages each define `string & { __brand: "UserId" }`, their IDs are interchangeable, because structurally they are identical.

A **`unique symbol`** solves both. A `unique symbol` type is a symbol type that is distinct from every other symbol type, tied to one specific declaration:

```typescript title="symbol-brand.ts"
declare const customerIdBrand: unique symbol;
type CustomerId = string & { readonly [customerIdBrand]: true };
```

`declare const` tells the compiler "a constant with this type exists" without creating one, so it emits **no JavaScript at all** — the symbol never exists at runtime, it is purely a type-level key. Because the key is a symbol nobody else can name, the brand cannot be forged by writing an object literal with the right property, does not appear as a normal property in autocompletion, and cannot collide with a brand declared anywhere else.

### A reusable `Brand` helper

Declaring a symbol for every brand is repetitive. A common shape is one module-private symbol and a generic helper:

```typescript title="brand.ts"
declare const brand: unique symbol;

export type Brand<T, Name extends string> =
  T & { readonly [brand]: { readonly [K in Name]: true } };

export type UserId = Brand<string, "UserId">;
export type Cents = Brand<number, "Cents">;
```

The brand's value is a small object with one key per brand name — `{ UserId: true }` — rather than a single string literal. That detail matters once you want **brands that build on each other**, covered below. If you never need that, `{ readonly [brand]: Name }` works too; both are common in real codebases.

## Creating branded values safely

The brand is only as trustworthy as the code that creates it. The rule that makes branding worthwhile is: **only one place in the codebase may assert a brand, and that place validates first.** That place is usually called a **smart constructor**.

### Smart constructors

A smart constructor is a function that takes a raw value, checks it, and returns the branded type (or throws):

```typescript title="smart-constructor.ts"
function toUserId(raw: string): UserId {
  if (!/^u_[a-z0-9]+$/.test(raw)) {
    throw new Error(`invalid user id: ${raw}`);
  }
  return raw as UserId; // the only `as UserId` in the codebase
}
```

Every other part of the code receives `UserId` values from this function, from another function that already holds one, or from a parser at the system boundary. If you search the codebase for `as UserId` and find it only here, you know every `UserId` in the program has passed the check. That is the real value of branding: **the type becomes proof that validation happened**.

### Type guards and assertion functions

A smart constructor that throws is not always what you want. Two other shapes create brands without an explicit return:

```typescript title="guards.ts"
type Email = Brand<string, "Email">;

// Type guard: narrows in the true branch.
function isEmail(s: string): s is Email {
  return /^[^@\s]+@[^@\s]+$/.test(s);
}

// Assertion function: narrows everything after the call, or throws.
function assertCents(n: number): asserts n is Cents {
  if (!Number.isSafeInteger(n)) throw new Error(`not whole cents: ${n}`);
}
```

Use a type guard when invalid input is an expected case that you branch on (a form field), and an assertion function when invalid input means a bug or bad data that should stop the operation. Both narrow the original variable to the branded type, so you do not need a new variable.

### Brands that refine other brands

Some values move through stages: a string becomes an `Email` after syntax validation, and later a verified email after the user clicks a confirmation link. You want a verified email to be usable anywhere an email is, but not the other way round. With the object-valued brand from `brand.ts`, that falls out of how intersections combine:

```typescript title="refine.ts"
type VerifiedEmail = Brand<Email, "Verified">;
// = string & { [brand]: { Email: true } } & { [brand]: { Verified: true } }

function verify(e: Email): VerifiedEmail { return e as VerifiedEmail; }
function sendNewsletter(to: Email) { return `newsletter sent to ${to}`; }
function sendWelcome(to: VerifiedEmail) { return `welcome sent to ${to}`; }
```

The two brand objects intersect into `{ Email: true; Verified: true }`, so a `VerifiedEmail` has everything an `Email` has (it can be passed to `sendNewsletter`) while a plain `Email` lacks `Verified` (it cannot be passed to `sendWelcome`). With a single string literal as the brand value, `"Email" & "Verified"` would reduce to `never` and the refinement would be unusable — which is why the helper uses one key per name.

## Worked example: a small payments module

Here is everything together, compiled with `strict` and run with Node. The commented-out lines are the ones the compiler rejects.

```typescript title="payments.ts"
declare const brand: unique symbol;
type Brand<T, Name extends string> =
  T & { readonly [brand]: { readonly [K in Name]: true } };

type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;
type Cents = Brand<number, "Cents">;
type Email = Brand<string, "Email">;
type VerifiedEmail = Brand<Email, "Verified">;

function toUserId(raw: string): UserId {
  if (!/^u_[a-z0-9]+$/.test(raw)) throw new Error(`invalid user id: ${raw}`);
  return raw as UserId;
}
function isEmail(s: string): s is Email {
  return /^[^@\s]+@[^@\s]+$/.test(s);
}
function assertCents(n: number): asserts n is Cents {
  if (!Number.isSafeInteger(n)) throw new Error(`not whole cents: ${n}`);
}
function verify(e: Email): VerifiedEmail { return e as VerifiedEmail; }
function sendNewsletter(to: Email) { return `newsletter sent to ${to}`; }
function sendWelcome(to: VerifiedEmail) { return `welcome sent to ${to}`; }

const id = toUserId("u_42");
const asString: string = id;          // a brand is still a string
// const wrong: UserId = "o_9" as OrderId;  // error: property 'UserId' is missing
// const raw: UserId = "u_42";             // error: string is not UserId

const input = "ada@example.com";
if (isEmail(input)) {
  console.log(sendNewsletter(input));
  // sendWelcome(input);              // error: property 'Verified' is missing
  const verified = verify(input);
  console.log(sendNewsletter(verified), "|", sendWelcome(verified));
}

const price = 1999;
assertCents(price);
const total = price + price;          // arithmetic result is plain number
// const t: Cents = total;            // error: number is not Cents

console.log(asString.toUpperCase(), typeof id, JSON.stringify({ id, total }));
try {
  toUserId("ORDER-9");
} catch (e) {
  console.log((e as Error).message);
}
```

```output
newsletter sent to ada@example.com
newsletter sent to ada@example.com | welcome sent to ada@example.com
U_42 string {"id":"u_42","total":3998}
invalid user id: ORDER-9
```

Read the output alongside the code. The brand never appears at runtime: `typeof id` is `"string"`, and `JSON.stringify` writes a plain string. The `isEmail` guard narrowed `input` to `Email`, so `sendNewsletter` accepted it but `sendWelcome` would not. After `assertCents(price)`, `price` is `Cents` — but `price + price` is a plain `number`, because the `+` operator on numbers produces `number`, not the brand. And `toUserId` rejected a string with the wrong format at runtime, which is the check the brand stands for.

## Where brands are lost

Since a brand lives only in the type, any operation whose result type is computed from the underlying primitive drops it:

| Operation | Result type | Why |
|---|---|---|
| `cents + cents`, `cents * 2` | `number` | Arithmetic operators return `number` |
| `userId.trim()`, `email.toLowerCase()` | `string` | String methods are declared to return `string` |
| `JSON.parse(JSON.stringify(x))` | `any`, then whatever you annotate | The brand is not data; nothing survives serialisation |
| `fetch(...).then(r => r.json())` | `any` / `unknown` | Values from outside the program were never validated |
| `value as UserId` | `UserId` | Not lost but *forged*: assertion skips validation |

The arithmetic case is usually what you want — adding two `Cents` and getting a `number` forces you to re-brand deliberately (`add(a: Cents, b: Cents): Cents`), which is where a unit check belongs. The serialisation cases are the important ones: **every value entering the program from a network response, storage, URL or form must be re-validated** before it is branded. Brands protect the inside of a program; they do nothing at its edges unless your parsing code creates them.

## Other ways to get nominal behaviour

Brands are not the only nominal-ish tools in TypeScript.

**Classes with private members.** A class with a `private` (or `#private`) member is only compatible with itself and its subclasses, even if another class has an identical shape:

```typescript title="private-nominal.ts"
class Meters { private readonly _unit = true; constructor(readonly value: number) {} }
class Feet { private readonly _unit = true; constructor(readonly value: number) {} }

const height: Meters = new Feet(3);
// error TS2322: Type 'Feet' is not assignable to type 'Meters'.
//   Types have separate declarations of a private property '_unit'.
```

This gives real nominal safety and lets you attach methods (`toFeet()`), but every value is now an object: it costs an allocation, cannot be used where a plain `number` is expected, and must be unwrapped for JSON, maths and comparisons.

**Enums.** Two enums with identical members are not assignable to each other, so enums are nominal in TypeScript (see [[b2-enums]]). They only work for a fixed set of values, not for open-ended IDs.

**Validation libraries.** Zod (version 3.20 and later) has a `.brand<"UserId">()` method on schemas: `z.string().regex(/^u_/).brand<"UserId">()` parses at runtime and, on success, returns a value whose inferred type is `string` plus a Zod brand marker. This is the smart-constructor idea packaged as a schema, and it is the cleanest way to brand data at an API boundary. (Zod is not installed in this project, so that snippet was not run here.) Other libraries offer similar helpers, such as `Tagged` in type-fest and `Brand` in Effect.

## How it works internally

When the compiler checks whether a value of type `S` is assignable to `T`, it compares them structurally. For an intersection target like `string & { readonly [brand]: { UserId: true } }`, the source must be assignable to *each* member. A plain `string` passes the first check and fails the second, because `string` has no property keyed by `brand`. An `OrderId` has that property, but its value `{ OrderId: true }` lacks the required `UserId` key, so the property types are incompatible. Those are exactly the error chains the compiler prints.

In the other direction, `UserId` is assignable to `string` because a value that is `string & X` is in particular a `string`. That asymmetry is what makes brands pleasant: branded values flow into ordinary APIs freely, while ordinary values cannot flow into branded APIs without passing through a constructor.

At emit time all of it disappears. Types and `declare` statements are erased, `as` assertions are erased, and what is left is the validating function and the primitive values themselves. The runtime cost of branding is the cost of your validation, nothing more.

## In real systems

**Identifiers.** Codebases with many entity types brand every ID — `UserId`, `TenantId`, `InvoiceId` — so that functions such as `getInvoice(tenantId, invoiceId)` cannot be called with arguments swapped. The brand is created in the data-access layer when rows are read, and in request parsing when IDs arrive in URLs.

**Money and units.** `Cents`, `Milliseconds`, `Seconds`, `Pixels`. A `setTimeout`-style helper typed as `(ms: Milliseconds)` cannot be called with seconds by mistake, and a payments module that only accepts `Cents` cannot receive a floating-point dollar amount.

**Trust levels.** `SanitizedHtml` (the output of a sanitiser, the only type accepted by the function that sets `innerHTML`), `VerifiedEmail`, `AbsolutePath`, `NonEmptyString`. Here the brand records that a security or correctness check happened, and the check lives in one audited function.

**API boundaries.** Teams combine branding with schema validation — Zod's `.brand()` or a hand-written parser — so that the moment data leaves `unknown` it already has precise, branded types.

## Trade-offs and alternatives

| Approach | Runtime cost | Safety | Ergonomics |
|---|---|---|---|
| Plain alias (`type UserId = string`) | None | None — documentation only | Best |
| Brand (`string & { [brand]: ... }`) | None (plus validation) | Compile-time only; forgeable with `as` | Values still work as strings |
| Class with private member | Object per value | Compile-time nominal; can add runtime checks and methods | Must wrap and unwrap |
| Validation library brand (Zod) | Parsing at the boundary | Same as brand, with validation guaranteed at creation | Needs the library |

Brand the values whose confusion is costly: identifiers that are easy to swap, units, and anything that represents "this passed a check". Do not brand every string in the codebase — each brand adds friction at every creation site, and a brand applied with a bare `as` and no validation adds that friction while proving nothing.

## Common mistakes

**Creating brands with `as` all over the codebase.** If any file may write `x as UserId`, the brand proves nothing. Keep assertions inside smart constructors, guards and parsers, and reject stray assertions in code review.

**Expecting the brand at runtime.** `if (id.__brand === "UserId")` is always false, because the property does not exist. Brands cannot be used for runtime checks; that is what the validating function is for.

**Trusting data from outside the program.** Typing a `fetch` result as `{ id: UserId }` brands unvalidated data. Parse it first, with a schema or a smart constructor.

**Using colliding string brands across packages.** Two independently written `string & { __brand: "UserId" }` types are identical. Use a `unique symbol` key so each brand is tied to its declaration.

**Single-literal brand values with refinement.** Intersecting `{ [brand]: "Email" }` with `{ [brand]: "Verified" }` makes the brand property `never`. Use one key per brand name, as in the `Brand` helper here, if brands need to stack.

**Being surprised that arithmetic drops the brand.** `Cents + Cents` is `number`. Wrap unit-safe operations in small typed functions that re-brand their result.

## Interview perspective

**"TypeScript is structural — how do you prevent passing an `OrderId` where a `UserId` is expected?"** Explain structural typing, then branded types: intersect the primitive with a phantom property keyed by a `unique symbol`, create values only through a validating constructor, and note that the brand has zero runtime cost because it is erased.

**"What does the brand cost at runtime, and what does it guarantee?"** Nothing at runtime, and only a compile-time guarantee. The guarantee is as strong as the discipline around `as`: if creation is centralised and validates, the type is proof of validation; if not, it is a label anyone can forge.

**"Why `unique symbol` rather than a `__brand` string key?"** Distinct per declaration (no collisions between packages), not forgeable via an object literal, and no misleading property in autocompletion.

**Follow-ups worth preparing:** brands versus wrapper classes (allocation versus methods and runtime checks), how brands are lost (arithmetic, string methods, JSON), and how Zod's `.brand()` combines parsing and branding at an API boundary.

## Practice

1. Brand `Milliseconds` and `Seconds`. Write `sleep(ms: Milliseconds)` and a converter `toMs(s: Seconds): Milliseconds`. Confirm that `sleep(toSeconds(2))` fails to compile.
2. Write a `NonEmptyString` brand with a type guard and use it to type a function that builds an HTML `<title>`. What should happen when `title.trim()` is passed back in?
3. Write `addCents(a: Cents, b: Cents): Cents` and `multiplyCents(a: Cents, factor: number): Cents`. Decide what `multiplyCents` must do with fractional results before branding.
4. Model `Email` → `VerifiedEmail` → `PrimaryEmail` as stacked brands, and check which functions each one can be passed to.
5. Write a `parseUser(json: unknown)` function that validates an object with `id` and `email` fields and returns `{ id: UserId; email: Email }`, throwing a helpful error on bad input. Then list every place in your code where an `as` appears and justify each one.

```quiz
Q: Why can a `UserId` (defined as `string & { readonly [brand]: { UserId: true } }`) be passed to a function expecting `string`, but a `string` cannot be passed to one expecting `UserId`?
- [ ] Brands are checked only in one direction by a special compiler rule
- [x] A value of type `string & X` is in particular a `string`, but a plain `string` lacks the brand property required by the intersection
- [ ] `UserId` is a subclass of `String`
- [ ] Because the brand property is `readonly`
> Assignability to an intersection requires assignability to every member. A plain string fails the brand member. In the other direction, an intersection is assignable to each of its members, so `UserId` flows into any `string` parameter. No special rule is involved — it is ordinary structural checking.
```

```quiz
Q: What does `typeof id` print at runtime when `id` is a `UserId` created by a smart constructor from `"u_42"`?
- [ ] `"object"`, because the brand wraps the string
- [ ] `"UserId"`
- [x] `"string"`
- [ ] `"symbol"`, because the brand key is a unique symbol
> Brands are erased. The `unique symbol` is only declared with `declare const`, so it never exists at runtime, and the value returned by the smart constructor is the original string.
```

```quiz
Q: A teammate writes `const res = await fetch(url); const user = (await res.json()) as { id: UserId };`. What is the problem?
- [ ] `res.json()` cannot return branded values
- [ ] The code fails to compile because `json()` returns `any`
- [x] It brands data that was never validated, so `UserId` no longer proves the format was checked
- [ ] Brands are removed by `await`
> The assertion compiles and the brand is applied, but nothing checked that `id` is a well-formed user ID — or even a string. Data entering the program must pass through a smart constructor or schema (for example Zod's `.brand()`) before it gets a branded type.
```

## Quick revision {#quick-revision}

- TypeScript is structural; type aliases are nicknames, so `type UserId = string` and `type OrderId = string` are interchangeable.
- Brand = primitive intersected with a phantom property: `string & { readonly __brand: "UserId" }`. Distinct brands are incompatible; plain values lack the property.
- Branded values are still assignable to the base type and keep all its methods.
- Prefer a `unique symbol` key: `declare const brand: unique symbol;` — emits no code, cannot collide or be forged, hidden from autocompletion.
- Reusable helper: `type Brand<T, N extends string> = T & { readonly [brand]: { readonly [K in N]: true } }`; object-valued brands can be stacked (`Brand<Email, "Verified">`).
- Create brands only in smart constructors (validate then `as`), type guards (`s is Email`) or assertion functions (`asserts n is Cents`).
- Brands vanish at runtime: `typeof` is the primitive, JSON has no brand, `__brand` is `undefined`.
- Lost through arithmetic and string methods; re-validate after JSON, fetch, storage, URLs, forms.
- Alternatives: classes with `private` members (nominal, but allocate), enums (nominal, fixed sets), Zod `.brand()` (validation plus brand at boundaries).

## Key takeaways {#key-takeaways}

- Brands give same-shaped values different compile-time types by adding a phantom property, turning swapped IDs and mixed units into compile errors.
- They cost nothing at runtime because every part of a brand is erased; a branded string is just a string.
- A brand is only meaningful if creating one requires validation, so keep `as Brand` inside one smart constructor, guard or parser per brand.
- Use a `unique symbol` key to make brands collision-proof and unforgeable, and an object-valued brand if brands need to refine each other.
- Brands protect the inside of a program; data crossing its boundary must be parsed and validated before it earns a brand.
