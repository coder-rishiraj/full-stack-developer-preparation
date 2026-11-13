---
summary: Experienced TypeScript engineers reuse a small set of type-alias patterns to turn domain rules into types — branded IDs, Result unions, derived input types, values-first unions, deep partials and non-empty arrays. You will learn what each pattern is for, how it works, where it stops protecting you, and how to combine them in a real module.
difficulty: intermediate
minutes: 45
objectives:
  - Implement branded types with smart constructors and explain why brands need runtime validation
  - Model fallible operations with a generic `Result` union and narrow it safely
  - Derive input, update and response types from one source type with utility types, `typeof`, `Parameters` and `ReturnType`
  - Define a union from a runtime array with `as const` and check lookup tables with `satisfies`
  - Choose when a pattern adds real safety and when it only adds indirection
---

## Introduction

[[b2-type-aliases]] showed that `type Name = ...` can name any type. Knowing the syntax is the easy part. The harder skill is knowing *which* aliases to write so that the compiler catches the bugs your application is actually prone to: passing an order ID where a user ID belongs, forgetting to handle a failed request, letting the "create user" form accept an `id`, or adding a new status without adding its label.

Over time, the TypeScript community has converged on a handful of alias patterns that solve these problems. They show up in production codebases, popular libraries and senior-level interviews, and each one is small — usually one to three lines. This lesson teaches them one at a time, with the problem each solves, how it works, and the honest limits of each. At the end, a worked example combines them into one module.

A useful way to think about these patterns: they build a **domain vocabulary**. Once a module defines `UserId`, `Cents`, `Result<T>` and `NewUser`, its function signatures read like a description of the business rules, and the compiler enforces that description.

## Before you start

- **Type aliases** — syntax, generics, transparency. See [[b2-type-aliases]].
- **Unions and intersections** — `A | B`, `A & B`. See [[b2-unions]] and [[b2-intersections]].
- **Literal types** — `"draft"` as a type. See [[b2-literal-types]].
- **Utility types** — `Partial`, `Pick`, `Omit`, `Record`; this lesson uses them and explains each briefly. See [[b2-utility-types]].

## Pattern 1: branded types for IDs and units

### The problem

Aliases are transparent, so `type UserId = string` and `type OrderId = string` are interchangeable. In a codebase with a dozen kinds of ID, all strings, passing the wrong one is an easy mistake and the compiler is silent about it. The same happens with units: `amountCents` and `amountDollars` are both `number`.

### The pattern

A **branded type** intersects the underlying type with an object type containing a marker property that no real value has:

```typescript title="brand.ts"
type Brand<T, Name extends string> = T & { readonly __brand: Name };

type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;
type Cents = Brand<number, "Cents">;

function loadUser(id: UserId): void { /* ... */ }

const orderId = "o_1" as OrderId;
loadUser(orderId);   // error: OrderId is not a UserId
loadUser("u_1");     // error: a plain string is not a UserId either
```

```output
error TS2345: Argument of type 'OrderId' is not assignable to parameter of type 'UserId'.
error TS2345: Argument of type 'string' is not assignable to parameter of type 'UserId'.
```

(Each error is followed by indented lines explaining that the `__brand` property is missing or holds a different literal.)

Here is why it works. Structural typing compares shapes. `UserId` has the shape "a string that also has `__brand: "UserId"`", and `OrderId` has `__brand: "OrderId"`, so their shapes differ and they are no longer interchangeable. A plain `string` has no `__brand` at all, so it is rejected too. Yet a `UserId` is still a `string` — the intersection includes it — so you can call `.toUpperCase()` on it or pass it anywhere a `string` is accepted. The marker only blocks the direction that matters: turning an arbitrary string into a `UserId`.

The `__brand` property never exists at runtime. It is a **phantom** property: a claim made to the type checker only. That is why branded values are created with a type assertion (`as UserId`), which tells the compiler "trust me".

A variant you will see uses a `unique symbol` key instead of the string `"__brand"`, for example `declare const userIdBrand: unique symbol; type UserId = string & { readonly [userIdBrand]: true }`. The symbol cannot be named outside its module, so no other code can forge the brand by writing an object literal. Either form works; the string version is simpler and common in application code.

### Smart constructors: where the brand becomes trustworthy

If `as UserId` can be written anywhere, the brand is only as reliable as every place that writes it. The fix is to create branded values in exactly one function, which validates the input first — a **smart constructor**:

```typescript title="smart-constructor.ts"
function toUserId(raw: string): UserId {
  if (!/^u_\d+$/.test(raw)) {
    throw new Error(`invalid user id: ${raw}`);
  }
  return raw as UserId;
}
```

Now a `UserId` means "a string that passed this check". Code that receives a `UserId` does not have to re-validate it. Ban `as UserId` everywhere else (a code-review rule or a lint rule), and the type carries a real guarantee.

> [!WARNING] Brands are compile-time only
> At runtime a `UserId` is a plain string. If an API response is cast with `as User`, its `id` is "branded" without ever being checked. Brands protect you from mixing values *inside* your code; validating data that arrives from outside still needs a runtime check, ideally in the smart constructor.

Branded numbers have one more limit worth knowing: arithmetic drops the brand. `c + c` where `c: Cents` has type `number`, so `const total: Cents = c + c` is an error and needs another assertion or a helper such as `addCents(a, b)`. Brands are covered further in [[b2-branded-types]].

## Pattern 2: the Result union for expected failures

### The problem

Functions that can fail usually signal it by throwing. But a function's type says nothing about what it throws, so callers easily forget a `try`/`catch`, and failures that are perfectly normal (invalid input, "not found") end up handled like crashes.

### The pattern

Return the failure as a value, using a union with a **discriminant** property:

```typescript title="result.ts"
type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

A `Result<User>` is either `{ ok: true, value: user }` or `{ ok: false, error: "..." }`. The second type parameter has a default, so `Result<User>` uses string errors while `Result<User, ApiError>` uses a richer error type.

The compiler will not let a caller read `value` before checking `ok`:

```typescript title="result-use.ts"
declare const r: Result<number>;

console.log(r.value);          // error

if (r.ok) {
  console.log(r.value * 2);    // fine: narrowed to the success branch
} else {
  console.log(r.error);        // fine: narrowed to the failure branch
}
```

```output
error TS2339: Property 'value' does not exist on type 'Result<number, string>'.
  Property 'value' does not exist on type '{ ok: false; error: string; }'.
```

This works because `ok` has a **literal** type in each branch (`true` or `false`). Checking it tells the compiler which branch you are in — a technique called narrowing, taught in [[b2-narrowing]] and [[b2-discriminated-unions]]. The effect is that handling failure is part of the function's type, and forgetting it is a compile error rather than an unhandled exception.

Use `Result` for **expected** failures — validation, parsing, "not found", a declined payment. Keep throwing for genuine bugs and unrecoverable situations, which callers cannot meaningfully handle anyway. Mixing the two is normal and healthy.

## Pattern 3: deriving types from one source of truth

### The problem

An app usually needs several related shapes for one entity: the full record from the database, the input to create one (no `id` yet), the input to update one (every field optional), a public view (no password hash). Writing each by hand means four definitions to keep in sync.

### The pattern

Write the full type once and **derive** the others with utility types:

```typescript title="derived.ts"
type User = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
};

type NewUser = Omit<User, "id" | "createdAt">;              // create input
type UserUpdate = Partial<Pick<User, "email" | "name">>;    // patch input
type PublicUser = Omit<User, "passwordHash">;               // safe to send
type ReadonlyUser = Readonly<User>;                         // cannot be modified
```

`Omit<T, K>` removes keys, `Pick<T, K>` keeps only the listed keys, `Partial<T>` makes every property optional and `Readonly<T>` makes every property read-only. Add a `phone` field to `User` and `NewUser`, `PublicUser` and `ReadonlyUser` gain it automatically; `UserUpdate` deliberately does not, because it lists its keys explicitly. That is a design decision you make once, in one place.

### Deriving from functions and values

Sometimes the source of truth is not a type but code. Built-in utilities extract types from functions:

```typescript title="from-functions.ts"
function createUser(input: { name: string; email: string }, opts?: { notify: boolean }) {
  return { id: "u_1", ...input, createdAt: new Date() };
}

type CreateUserInput = Parameters<typeof createUser>[0];   // { name: string; email: string }
type CreatedUser = ReturnType<typeof createUser>;          // { id: string; name: string; ... }
```

`typeof createUser` is the function's type, `Parameters<...>` is a tuple of its parameter types, and `[0]` picks the first. This is invaluable when a library exports a function but not the type of its options. React code uses the same idea constantly: `type ButtonProps = React.ComponentProps<typeof Button>` gets the props of a component you did not write. See [[b2-parameters-type]] and [[b2-returntype]].

## Pattern 4: values-first unions with `as const`

### The problem

A literal union such as `type Status = "draft" | "published" | "archived"` is erased at compile time. But you often also need the list at runtime — to render a dropdown, validate input, or loop over statuses. Writing the list twice (once as a type, once as an array) lets them drift apart.

### The pattern

Write the **array** once, freeze its literal types with `as const`, and derive the union from it:

```typescript title="values-first.ts"
const STATUSES = ["draft", "published", "archived"] as const;
type Status = (typeof STATUSES)[number];   // "draft" | "published" | "archived"

function isStatus(x: string): x is Status {
  return (STATUSES as readonly string[]).includes(x);
}
```

`as const` makes the array a readonly tuple of literal types instead of `string[]`. `typeof STATUSES` is that tuple type, and indexing it with `[number]` means "the type of any element", which is the union. Now adding `"scheduled"` to the array adds it to the type, to the dropdown and to the validator at once. The `isStatus` function is a **type predicate** that narrows a string to `Status` after a runtime check ([[b2-custom-type-guards]]). The same idea applies to objects, covered in [[b2-as-const-objects]].

### Checking lookup tables with `satisfies`

Code that maps every status to a label or colour should break when a status is added. The `satisfies` operator checks an object against a type without changing the object's own inferred type:

```typescript title="satisfies.ts"
const LABELS = {
  draft: "Draft",
  published: "Live",
} satisfies Record<Status, string>;
```

```output
error TS1360: Type '{ draft: string; published: string; }' does not satisfy the expected type 'Record<"draft" | "published" | "archived", string>'.
  Property 'archived' is missing in type '{ draft: string; published: string; }' but required in type 'Record<"draft" | "published" | "archived", string>'.
```

`Record<Status, string>` means "an object with a string for every status". Forgetting `archived` is now a compile error. Compared with annotating (`const LABELS: Record<Status, string> = ...`), `satisfies` keeps the literal keys of the object itself, which matters when you later use `keyof typeof LABELS`. See [[b2-satisfies]] and [[b2-variant-map-satisfies]].

## Pattern 5: structural invariants — non-empty arrays and deep partials

Some rules about shape can be encoded directly in an alias.

A **non-empty array** type uses a tuple with a required first element followed by a rest element:

```typescript title="non-empty.ts"
type NonEmptyArray<T> = [T, ...T[]];

function first<T>(items: NonEmptyArray<T>): T {
  return items[0];   // typed T, never undefined
}

console.log(first([3, 4]));
first([]);           // error
```

```output
error TS2345: Argument of type '[]' is not assignable to parameter of type 'NonEmptyArray<unknown>'.
  Source has 0 element(s) but target requires 1.
```

The function no longer has to handle the empty case, because callers cannot pass one. The cost is that ordinary arrays (`number[]`) are not accepted either, since the compiler cannot know their length: callers must check `arr.length > 0` and build a tuple, or you provide a smart constructor that returns `NonEmptyArray<T> | null`.

A **deep partial** makes every nested property optional, which fits settings patches and form drafts:

```typescript title="deep-partial.ts"
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

type Settings = {
  theme: { mode: "light" | "dark"; accent: string };
  notifications: { email: boolean; push: boolean };
};

const patch: DeepPartial<Settings> = { theme: { mode: "dark" } };   // fine
```

It combines a **conditional type** (`T extends object ? ... : ...`) with a **mapped type** and recursion; [[b2-conditional-types]] and [[b2-mapped-types]] explain the parts. Be aware of its rough edges: arrays and functions are objects too, so this simple version also maps over array indices and function types. Production libraries special-case those. Many invariants — "end date is after start date", "email is unique" — cannot be expressed in types at all. For those, put the check in a smart constructor and let a branded or `Result` type carry the fact that it passed.

## Pattern 6: named callback and handler signatures

Callbacks are where unnamed types repeat most. Naming them pays off quickly:

```typescript title="handlers.ts"
type ChangeHandler<T> = (next: T, previous: T) => void;
type Unsubscribe = () => void;
type Subscribe<T> = (handler: ChangeHandler<T>) => Unsubscribe;
```

`Subscribe<number>` now reads as a sentence: "a function that takes a change handler for numbers and gives you back a function to unsubscribe". Implementations get contextual typing for free. Avoid the catch-all `Function` type, which accepts any function and loses all parameter and return checking.

## How it works internally

Every pattern above is erased by the compiler; none adds a single byte of JavaScript. Their power comes from a few checker behaviours working together:

| Pattern | Checker mechanism it relies on |
|---|---|
| Branded types | Structural comparison of intersections: the phantom property makes shapes differ |
| Result union | Narrowing on a literal discriminant property |
| Derived types | Mapped types (`Partial` and `Pick` are mapped types in `lib.es5.d.ts`; `Omit` is built from `Pick`) and `typeof` on values |
| Values-first unions | `as const` literal inference plus indexed access `T[number]` |
| `satisfies` lookup tables | Assignability check without widening the expression's type |
| Non-empty arrays | Tuple types with rest elements and fixed minimum length |

Understanding the right-hand column is what lets you invent a new pattern when none of these fits.

## Worked example: a user module with a domain vocabulary

This module combines branding, smart constructors, `Result` and derived types. It runs as-is with Node 22.18 or later, which strips TypeScript syntax natively.

```typescript title="users.ts"
// ---- Vocabulary: the aliases this module speaks in ----
type Brand<T, Name extends string> = T & { readonly __brand: Name };
type UserId = Brand<string, "UserId">;
type Cents = Brand<number, "Cents">;

type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E };

type User = {
  id: UserId;
  name: string;
  balance: Cents;
};

type NewUser = Omit<User, "id">;                       // what callers supply
type UserUpdate = Partial<Pick<User, "name" | "balance">>;

// ---- Smart constructors: the only places that create branded values ----
function toUserId(raw: string): Result<UserId> {
  return /^u_\d+$/.test(raw)
    ? { ok: true, value: raw as UserId }
    : { ok: false, error: `bad user id "${raw}"` };
}

function toCents(raw: number): Result<Cents> {
  return Number.isInteger(raw) && raw >= 0
    ? { ok: true, value: raw as Cents }
    : { ok: false, error: `bad amount ${raw}` };
}

// ---- A tiny in-memory store ----
const users = new Map<UserId, User>();
let nextId = 1;

function createUser(input: NewUser): User {
  const user: User = { id: `u_${nextId++}` as UserId, ...input };
  users.set(user.id, user);
  return user;
}

function updateUser(id: UserId, changes: UserUpdate): Result<User> {
  const current = users.get(id);
  if (!current) return { ok: false, error: `no user ${id}` };
  const updated = { ...current, ...changes };
  users.set(id, updated);
  return { ok: true, value: updated };
}

// ---- Using it ----
const balance = toCents(2500);
if (balance.ok) {
  const ada = createUser({ name: "Ada", balance: balance.value });
  console.log(updateUser(ada.id, { name: "Ada L." }));
}

for (const raw of ["u_1", "u_9", "42"]) {
  const id = toUserId(raw);
  if (!id.ok) {
    console.log(id.error);
    continue;
  }
  const result = updateUser(id.value, {});
  console.log(result.ok ? `found ${result.value.name}` : result.error);
}

console.log(toCents(19.99));
```

```output
{ ok: true, value: { id: 'u_1', name: 'Ada L.', balance: 2500 } }
found Ada L.
no user u_9
bad user id "42"
{ ok: false, error: 'bad amount 19.99' }
```

Walk through what the types enforce. `createUser` takes a `NewUser`, so a caller cannot supply an `id`; the store assigns it. `balance` must be `Cents`, and the only legitimate way to get one is `toCents`, which rejects fractions and negatives — that is why `19.99` produces an error value rather than a corrupted balance. Writing `createUser({ name: "Bo", balance: 5 })` fails to compile, because `5` is a plain `number`.

`updateUser` and `toUserId` both return `Result`, so the loop must check `ok` before touching `value`. The three raw IDs show the three outcomes: `"u_1"` is valid and found, `"u_9"` is a valid ID with no user, and `"42"` fails validation before reaching the store. Note the runtime output: the brands are invisible, and `id: 'u_1'` is an ordinary string. Every guarantee here came from the compiler plus the two smart constructors.

## In real systems

**Branded IDs** are common in codebases with many entity types, and validation libraries support them directly (Zod's `.brand<"UserId">()` produces a branded output type after validation, which is the smart-constructor pattern built in).

**Result types** appear in API client layers (`fetchJson` returning `Result<T, HttpError>`), in form submission handlers, and in libraries such as neverthrow. React Query and SWR use a related union for request state; see [[b2-remote-data-pattern]].

**Derived types** are everywhere: DTOs via `Omit` and `Pick`, component prop types via `ComponentProps<typeof X>`, and Redux Toolkit's `type RootState = ReturnType<typeof store.getState>`.

**Values-first unions** drive routing tables, feature flags, permission lists and design tokens, where the runtime list and the type must never diverge.

## Trade-offs

Each pattern moves a class of bug from runtime to compile time, at the cost of some ceremony. Brands need smart constructors and occasional assertions, and they disappear at runtime. `Result` makes call sites longer and does not compose with `async`/`await` as smoothly as exceptions. Deep computed aliases slow the compiler slightly and produce long error messages. Non-empty tuples reject ordinary arrays.

The judgement call is whether the bug is real. A branded `UserId` is worth it in a system with ten ID kinds and a history of mix-ups; a branded `FirstName` usually is not. A `Result` is worth it for operations whose failure is part of normal flow; it is noise for a function that cannot fail.

## Common mistakes

> [!MISTAKE] Treating a cast as validation
> `const id = req.params.id as UserId` makes the compiler trust an unchecked string. Brands are only meaningful if values enter through a smart constructor that actually checks them.

**Using optional fields instead of a union.** `{ ok: boolean; value?: T; error?: string }` allows `{ ok: true, error: "x" }` and lets callers read `value` without checking. A discriminated union makes those states unrepresentable.

**Duplicating shapes instead of deriving them.** A hand-written `NewUser` that repeats `User`'s fields drifts as soon as `User` changes. Derive it.

**Forgetting `as const`.** Without it, `const STATUSES = ["draft", "published"]` is `string[]`, and `(typeof STATUSES)[number]` is just `string`.

**Annotating lookup tables instead of using `satisfies`.** `const LABELS: Record<Status, string>` checks completeness but widens the type; with `satisfies` you get both the check and the precise keys.

**Building unreadable mega-aliases.** If a computed alias needs a comment to explain its expansion, split it into named steps.

## Interview perspective

**"How would you stop developers mixing up `userId` and `orderId` strings?"** Explain branded types, why structural typing needs the phantom property, and the smart-constructor rule. Mention the limit: no runtime effect, so validate at boundaries.

**"Exceptions or Result types?"** Exceptions for unexpected failures; `Result` when failure is a normal outcome callers must handle. Show the discriminated union and how narrowing enforces handling.

**"How do you keep request and response types in sync with your model?"** Derive with `Omit`, `Pick`, `Partial`; derive from code with `typeof`, `ReturnType`, `Parameters`.

**Follow-up: "How do you get a union type and a runtime list from one definition?"** The `as const` array plus `(typeof ARR)[number]`, and `satisfies Record<Union, V>` for complete lookup tables.

## Practice

1. Create `Email` as a branded string with a smart constructor `toEmail(raw: string): Result<Email>` that checks for one `@`. Write `sendWelcome(to: Email)` and show that a plain string is rejected.
2. Given `type Product = { id: string; title: string; priceCents: number; internalNotes: string }`, derive `NewProduct`, `ProductPatch` and `PublicProduct`. Add a field to `Product` and check which derived types change.
3. Define `const ROLES = ["viewer", "editor", "admin"] as const`, derive `Role`, and write `ROLE_RANK` with `satisfies Record<Role, number>`. Add `"owner"` to the array and see what breaks.
4. Write `parseAge(input: string): Result<number>` and a caller that prints either the age or the error. Try reading `.value` without checking `.ok`.
5. Write `function max(values: NonEmptyArray<number>): number` and a helper `toNonEmpty<T>(xs: T[]): NonEmptyArray<T> | null`.

```quiz
Q: Why is `type UserId = string & { readonly __brand: "UserId" }` not assignable from a plain `string`?
- [ ] Because the runtime value is wrapped in an object
- [x] Because a plain `string` lacks the `__brand` property that the intersection requires
- [ ] Because intersections with `string` are always `never`
- [ ] Because `readonly` properties block assignment
> Structural typing compares shapes, and the intersection's shape includes a `__brand` property that no ordinary string has. Nothing is wrapped at runtime — the property is phantom — and `string & { ... }` is not `never`, since the object part has no conflicting members.
```

```quiz
Q: With `type Result<T> = { ok: true; value: T } | { ok: false; error: string }`, why does `r.value` fail to compile before checking `r.ok`?
- [ ] `value` is private to the success branch
- [ ] Result types must be unwrapped with a helper
- [x] `value` exists on only one member of the union, so it cannot be read until the union is narrowed
- [ ] `T` is unknown until runtime
> On a union you can only access members present on every branch. Checking the literal discriminant `ok` narrows `r` to one branch, after which `value` (or `error`) is available.
```

```quiz
Q: What is the type of `Status` in `const S = ["a", "b"]; type Status = (typeof S)[number];`?
- [ ] `"a" | "b"`
- [x] `string`
- [ ] `readonly ["a", "b"]`
- [ ] `never`
> Without `as const`, the array is inferred as `string[]`, so its element type is `string`. Adding `as const` makes it `readonly ["a", "b"]`, whose element type is `"a" | "b"`.
```

## Quick revision {#quick-revision}

- Branded type: `T & { readonly __brand: "Name" }` (or a `unique symbol` key). Phantom, compile-time only; create via a validating smart constructor; arithmetic drops number brands.
- Result: `{ ok: true; value: T } | { ok: false; error: E }`; narrowing on `ok` forces failure handling; use for expected failures, keep exceptions for bugs.
- Derive, do not duplicate: `Omit`, `Pick`, `Partial`, `Readonly`; from code with `typeof`, `Parameters<typeof f>`, `ReturnType<typeof f>`, `ComponentProps<typeof C>`.
- Values-first union: `const X = [...] as const; type U = (typeof X)[number]`; pair with a type-predicate validator.
- Complete lookup tables: `const M = { ... } satisfies Record<U, V>`.
- Non-empty array: `[T, ...T[]]`; deep partial via recursive conditional mapped type (watch arrays and functions).
- Name callback signatures; avoid `Function`.
- All patterns are erased; validate data at boundaries.

## Key takeaways {#key-takeaways}

- Alias patterns turn domain rules into types, so a module's signatures describe and enforce its business rules.
- Branded types restore distinctness that transparent aliases lack, but they are only trustworthy when created by a validating constructor.
- A `Result` union makes failure part of the type, and narrowing makes handling it mandatory.
- Deriving related types from one source keeps them in sync automatically, whether the source is a type, a function or a constant array.
- Use a pattern when it prevents a bug you actually have; otherwise it is only indirection.
