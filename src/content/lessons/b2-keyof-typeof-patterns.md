---
summary: Combining `as const`, `typeof`, `keyof` and indexed access lets one runtime object or array define both the values your program uses and the union types that check them. You will learn the standard idioms — key unions, value unions, element unions, enum-like constants, exhaustive lookup tables and typed handler maps — and the runtime checks that must accompany them.
difficulty: intermediate
minutes: 40
objectives:
  - Derive key, value and element unions from constants with `keyof typeof`, `(typeof X)[keyof typeof X]` and `(typeof X)[number]`
  - Replace a TypeScript `enum` with an `as const` object and explain the trade-offs
  - Use `satisfies` to check a constant's shape or completeness without losing its literal types
  - Build a typed handler map whose payload types are derived from the handlers themselves
  - Write runtime guards that turn untrusted strings into the derived union types safely
---

## Introduction

Applications are full of small closed sets: user roles, route paths, order statuses, supported locales, analytics event names. Each set is needed twice — at **runtime** (to render a dropdown, build a URL, loop over options) and at **compile time** (to reject `"admn"` as a role). Writing it twice is the classic source of drift:

```typescript title="drift.ts"
type Role = "admin" | "editor" | "viewer";         // compile-time copy
const ROLES = ["admin", "editor", "viewer"];       // runtime copy
// Someone adds "owner" to ROLES and forgets Role, or the other way round.
```

The **keyof + typeof pattern** removes the duplication. You write the set once, as a runtime value marked `as const`, and derive the type from it:

```typescript title="single-source.ts"
const ROLES = ["admin", "editor", "viewer"] as const;
type Role = (typeof ROLES)[number]; // "admin" | "editor" | "viewer"

for (const r of ROLES) console.log(r.toUpperCase());
```

```output
ADMIN
EDITOR
VIEWER
```

This lesson collects the idioms built from four tools you have met separately — `as const` ([[b2-as-const]]), the type query `typeof` ([[b2-typeof]]), `keyof` ([[b2-keyof]]) and indexed access ([[b2-indexed-access]]) — and shows where each fits, what it costs and what it does *not* protect you from.

## Before you start

- **`typeof` at the type level** — getting a value's type. See [[b2-typeof]].
- **`keyof`** — the union of a type's keys. See [[b2-keyof]].
- **Indexed access** — `T[K]` and `T[number]`. See [[b2-indexed-access]].
- **`as const`** — literal, read-only inference. See [[b2-as-const]] and [[b2-as-const-objects]].
- **Literal unions versus enums** — why many teams avoid `enum`. See [[b2-literal-unions-vs-enums]].

## The intuition

Think of the constant as a master list pinned to the wall. Runtime code reads the list directly. The type system photocopies the list at compile time and uses the copy to check every place a value from the list is expected. Because the copy is regenerated on every compile, the two can never disagree.

`as const` is what makes the photocopy legible. Without it, the compiler records only "an array of strings", not which strings — and a union built from that is just `string`.

## The core idioms

### Keys of an object: `keyof typeof X`

```typescript title="routes.ts"
const ROUTES = {
  home: "/",
  settings: "/settings",
  orders: "/orders",
} as const;

type RouteName = keyof typeof ROUTES;            // "home" | "settings" | "orders"
type RoutePath = (typeof ROUTES)[RouteName];     // "/" | "/settings" | "/orders"

function link(name: RouteName): RoutePath {
  return ROUTES[name];
}
console.log(link("settings"));
```

```output
/settings
```

Read `keyof typeof ROUTES` from right to left: take the *value* `ROUTES`, get its *type* with `typeof`, then take that type's *keys* with `keyof`. Parentheses are not needed because `typeof` binds tighter than `keyof`.

The key union works even without `as const`, because object keys are never widened. The **value** union is different: without `as const`, every path widens to `string`, and `RoutePath` collapses to `string`.

### Values of an object: `(typeof X)[keyof typeof X]`

`RoutePath` above is the general "union of all values" idiom. Since it appears often, many codebases name it:

```typescript title="value-of.ts"
type ValueOf<T> = T[keyof T];

const HTTP_STATUS = { ok: 200, notFound: 404, serverError: 500 } as const;
type HttpStatus = ValueOf<typeof HTTP_STATUS>; // 200 | 404 | 500
```

### Elements of an array: `(typeof X)[number]`

For a list of allowed values, an `as const` array is often more natural than an object, and it gives you an ordered runtime list to render:

```typescript title="locales.ts"
const LOCALES = ["en-GB", "en-US", "de-DE"] as const;
type Locale = (typeof LOCALES)[number]; // "en-GB" | "en-US" | "de-DE"
```

`[number]` asks "what type is at any numeric index", which for a read-only tuple of literals is the union of those literals.

## Enum-like constants

TypeScript `enum`s generate runtime objects and have some quirks (numeric enums accept any number in older versions, reverse mappings, not erasable by type-stripping tools). A common replacement is an `as const` object with a type of the **same name**:

```typescript title="status.ts"
const OrderStatus = {
  Pending: "pending",
  Paid: "paid",
  Shipped: "shipped",
} as const;
type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
// "pending" | "paid" | "shipped"

function label(s: OrderStatus): string {
  switch (s) {
    case OrderStatus.Pending: return "Awaiting payment";
    case OrderStatus.Paid: return "Paid";
    case OrderStatus.Shipped: return "On its way";
  }
}

console.log(label(OrderStatus.Paid), label("shipped"));
```

```output
Paid On its way
```

Giving the value and the type the same name is legal because TypeScript keeps values and types in separate namespaces; which one you mean is decided by where you write the name (the mechanism is explained in [[b2-declaration-merging]]). Callers can write `OrderStatus.Paid` like an enum member, or the plain string `"paid"`, which is convenient for data from JSON. Unlike a string enum, which only accepts its own members, this union accepts the matching string literals. Whether that is a feature or a loss of strictness is a team decision; [[b2-enums]] and [[b2-literal-unions-vs-enums]] compare them.

The `switch` with no `default` compiles under `strict` because TypeScript sees every member handled; add a member and the function no longer returns on all paths, which is an error. [[b2-exhaustiveness-assertnever]] shows the more explicit `assertNever` technique.

## Checking shape and completeness with `satisfies`

`as const` gives precise types but checks nothing about the object's shape. An annotation like `const ROUTES: Record<string, string> = ...` checks the shape but throws away the literal types. The **`satisfies` operator** (TypeScript 4.9+) does both: it checks the value against a type and keeps the inferred type ([[b2-satisfies]]).

```typescript title="satisfies.ts"
const ROLES = ["admin", "editor", "viewer"] as const;
type Role = (typeof ROLES)[number];

// Every path must start with "/", and the literal paths are kept.
const ROUTES = {
  home: "/",
  settings: "/settings",
} as const satisfies Record<string, `/${string}`>;

// Every role must have a label: a missing one is a compile error.
const ROLE_LABELS = {
  admin: "Administrator",
  editor: "Editor",
} satisfies Record<Role, string>;
```

```output
error TS1360: Type '{ admin: string; editor: string; }' does not satisfy the expected type 'Record<"admin" | "editor" | "viewer", string>'.
  Property 'viewer' is missing in type '{ admin: string; editor: string; }' but required in type 'Record<"admin" | "editor" | "viewer", string>'.
```

The second constant is the important pattern: a lookup table keyed by a derived union, checked for **completeness**. When someone adds `"owner"` to `ROLES`, every `satisfies Record<Role, ...>` table that lacks an `owner` entry fails to compile, pointing at exactly the places that need updating. Note the order `as const satisfies ...`: the assertion applies first, then the check.

## Typed handler maps

The same idea scales to functions. Here an object of handlers defines both the set of event names and each event's payload type:

```typescript title="handlers.ts"
const handlers = {
  login: (p: { userId: string }) => `login ${p.userId}`,
  addToCart: (p: { sku: string; qty: number }) => `add ${p.qty} x ${p.sku}`,
  logout: () => "logout",
};

type Handlers = typeof handlers;
type EventName = keyof Handlers;                          // "login" | "addToCart" | "logout"
type Payload<E extends EventName> = Parameters<Handlers[E]>;

function dispatch<E extends EventName>(name: E, ...payload: Payload<E>): string {
  const handler = handlers[name] as (...args: Payload<E>) => string;
  return handler(...payload);
}

console.log(dispatch("login", { userId: "u7" }));
console.log(dispatch("addToCart", { sku: "A1", qty: 2 }));
console.log(dispatch("logout"));
// dispatch("addToCart", { sku: "A1" });  // error: qty is missing
```

```output
login u7
add 2 x A1
logout
```

`Handlers[E]` (indexed access) picks one handler's type, `Parameters` turns it into a tuple of its arguments, and the rest parameter `...payload: Payload<E>` makes `dispatch("logout")` take no payload while `dispatch("login", ...)` requires one. Adding a handler automatically adds an event name with the right payload.

The cast inside `dispatch` is needed because, inside the generic body, `handlers[name]` has the type `Handlers[E]` — a union of three different function types while `E` is unresolved — and TypeScript cannot prove that calling it with `Payload<E>` is safe. This is a common, contained use of an assertion: the public signature is fully checked, and the cast lives in one line of implementation ([[b2-type-assertions]]).

## How it works internally

All of these idioms are compile-time computations on the type of a single declaration. When the checker sees `const ROUTES = {...} as const`, it infers a read-only object type with literal property types and stores it on the `ROUTES` symbol. `typeof ROUTES` retrieves that type, `keyof` lists its property names, and indexed access looks up property types. The derived aliases are recomputed on every compile, which is why they cannot fall out of sync.

At runtime nothing remains but the constant itself:

```typescript title="emit.ts"
const ROLES = ["admin", "editor"] as const;
type Role = (typeof ROLES)[number];
const r: Role = "admin";
```

compiles to

```javascript title="emit.js"
const ROLES = ["admin", "editor"];
const r = "admin";
```

`as const` is erased too: the array is an ordinary mutable array at runtime. If mutation is a real risk, add `Object.freeze`.

## Runtime validation: the part types cannot do

Derived unions describe values *inside* your program. Strings arriving from a URL, `localStorage` or an API are just `string` and must be checked before you treat them as the union. Because the allowed values exist at runtime, the check can reuse the same constant:

```typescript title="guard.ts"
const ROLES = ["admin", "editor", "viewer"] as const;
type Role = (typeof ROLES)[number];

function isRole(x: string): x is Role {
  return (ROLES as readonly string[]).includes(x);
}

for (const input of ["editor", "owner"]) {
  console.log(input, isRole(input) ? "valid" : "rejected");
}
```

```output
editor valid
owner rejected
```

The cast `ROLES as readonly string[]` is needed because `ROLES.includes` is typed to accept only `Role` — calling it with a `string` is an error (`Argument of type 'string' is not assignable to parameter of type '"admin" | "editor" | "viewer"'`). Widening the array to `readonly string[]` for the check is safe, because you only *read* from it. The function's return type `x is Role` is a **type predicate**: after `if (isRole(input))`, the compiler narrows `input` to `Role` ([[b2-custom-type-guards]]).

For objects, the equivalent guard is `key in ROUTES` (or `Object.hasOwn(ROUTES, key)`, which ignores inherited properties such as `toString`).

> [!WARNING] `Object.keys` and assertions
> `Object.keys(ROUTES)` is typed `string[]`. Writing `Object.keys(ROUTES) as RouteName[]` is reasonable for a constant you declared yourself, because you know it has no extra keys. Do not apply the same assertion to objects that come from outside, where extra keys are possible; that is exactly why TypeScript does not do it for you ([[b2-keyof]]).

## Worked example: a typed settings registry

A product has user settings, each with a default value and a label for the settings page. The registry should drive the UI, the stored data type and the update function.

```typescript title="registry.ts"
const SETTINGS = {
  theme: { label: "Theme", default: "system" as "light" | "dark" | "system" },
  fontSize: { label: "Font size", default: 14 as number },
  notifications: { label: "Email notifications", default: true as boolean },
} as const;

type SettingKey = keyof typeof SETTINGS;
type SettingValues = { -readonly [K in SettingKey]: (typeof SETTINGS)[K]["default"] };

function defaults(): SettingValues {
  const out = {} as Record<SettingKey, unknown>;
  for (const key of Object.keys(SETTINGS) as SettingKey[]) {
    out[key] = SETTINGS[key].default;
  }
  return out as SettingValues;
}

function update<K extends SettingKey>(values: SettingValues, key: K, value: SettingValues[K]) {
  return { ...values, [key]: value };
}

let current = defaults();
current = update(current, "theme", "dark");
current = update(current, "fontSize", 16);
// update(current, "fontSize", "16");  // error: string is not number
// update(current, "theme", "blue");   // error: not a theme

for (const key of Object.keys(SETTINGS) as SettingKey[]) {
  console.log(`${SETTINGS[key].label}: ${current[key]}`);
}
```

```output
Theme: dark
Font size: 16
Email notifications: true
```

Walking through the types:

- `SettingKey` is the key union, derived with `keyof typeof`. Adding a setting to the registry adds a key.
- `SettingValues` is a mapped type ([[b2-mapped-types]]) that, for each key, looks up `(typeof SETTINGS)[K]["default"]` — a chained indexed access — giving `{ theme: "light" | "dark" | "system"; fontSize: number; notifications: boolean }`. The `-readonly` modifier removes the read-only flags that `as const` added.
- The inner `as` on each default is deliberate. `as const` is all-or-nothing: without those assertions, `fontSize` would have the literal type `14`, `notifications` would be `true`, and `theme` would be `"system"`, so `update(current, "fontSize", 16)` would be rejected. A default is *an example of a type*, not the only allowed value, so each entry is widened to the type it stands for while the keys and labels stay literal.
- `Object.keys(SETTINGS) as SettingKey[]` is safe here because `SETTINGS` is a constant declared in this module and cannot carry extra keys. `defaults()` builds the object through `Record<SettingKey, unknown>` and asserts the result once, because TypeScript cannot follow a loop that fills in each key with its own type.

## In real systems

- **Design tokens.** `const tokens = {...} as const` plus `keyof typeof tokens.color` gives component props like `color: "primary" | "danger"` that match the theme.
- **Routing.** Route tables declared once, with `keyof typeof ROUTES` for typed `navigate()` helpers and `satisfies` to enforce path formats.
- **Analytics and event buses.** Handler or schema maps whose keys become event names and whose values define payloads, as in the handler-map section.
- **Permissions.** `PERMISSIONS = { admin: [...], viewer: [...] } satisfies Record<Role, readonly Permission[]>` keeps role tables complete when roles are added.
- **Redux Toolkit and Zod** use the same "derive the type from the runtime object" philosophy (`ReturnType<typeof store.getState>`, `z.infer<typeof schema>`).

## Trade-offs and alternatives

| Approach | Runtime list available | Literal strings accepted | Completeness checks | Notes |
|---|---|---|---|---|
| Hand-written union type | No | Yes | Via `Record<Union, ...>` | Duplicates any runtime list |
| `enum` | Yes (an object) | No (string enums) | Yes | Emits code; not erasable syntax |
| `as const` + `typeof` | Yes | Yes | Yes, with `satisfies` | Standard idiom in modern TypeScript |

The derived-type approach is the default choice for internal constants. Its costs: the derived types are only as precise as the inference (hence the widening adjustments in the registry example), long derived types can make editor tooltips noisy, and exporting derived types from a library makes the constant's exact shape part of your public API.

## Common mistakes

> [!MISTAKE] Forgetting `as const` on the source value
> Without it, `(typeof ROLES)[number]` is `string` and every check silently passes. The key union of an object is unaffected, which makes the bug easy to miss: keys look right while values are `string`.

- **Writing `keyof ROUTES`.** `ROUTES` is a value; `keyof` needs a type. Write `keyof typeof ROUTES`.
- **Writing `typeof ROUTES[keyof ROUTES]`.** The inner `keyof` also needs `typeof`: `(typeof ROUTES)[keyof typeof ROUTES]`.
- **Trusting derived unions for input data.** Validate external strings with a guard built from the same constant.
- **Annotating instead of using `satisfies`.** `const ROUTES: Record<string, string> = {...}` throws away the literal keys and values. Use `satisfies`.
- **Over-freezing with `as const`.** Values meant as defaults or examples become single literals. Widen those entries explicitly.

## Interview perspective

- *"How do you avoid an enum but keep autocomplete?"* — `as const` object plus `type X = (typeof X)[keyof typeof X]`, with a same-name type; explain that values and types live in separate namespaces.
- *"Turn this array of strings into a union type."* — `as const` and `(typeof ARR)[number]`; mention why `as const` is required.
- *"How do you make sure a lookup table covers every case?"* — `satisfies Record<Union, V>`; compare with an annotation, which loses literal types.
- *"How do you validate a string from the URL against the union?"* — a type predicate reusing the constant, and why `includes` needs the `readonly string[]` widening.
- Strong candidates separate what the compiler proves (internal consistency) from what needs runtime checks (external data).

## Practice

1. Create `const PLANS = { free: { seats: 1 }, team: { seats: 10 }, enterprise: { seats: 500 } } as const`. Derive `PlanName`, and a union of all seat counts.
2. Write `ICONS` keyed by `OrderStatus` with `satisfies Record<OrderStatus, string>`, then add a fourth status and observe the error.
3. Write `parseLocale(input: string): Locale | undefined` using `LOCALES` from this lesson.
4. Extend the handler map with an event that takes two arguments and confirm `dispatch` enforces both.
5. Explain why `keyof typeof ROUTES` is correct even without `as const`, but `(typeof ROUTES)[keyof typeof ROUTES]` is not.

## Quick revision {#quick-revision}

- One runtime constant, `as const`, is the single source of truth.
- Keys: `keyof typeof X`. Values: `(typeof X)[keyof typeof X]` (`ValueOf<typeof X>`). Elements: `(typeof X)[number]`.
- Enum replacement: `const S = {...} as const; type S = (typeof S)[keyof typeof S];` — same name is allowed (separate value and type namespaces).
- `as const satisfies T` checks shape; `satisfies Record<Union, V>` checks completeness; annotations lose literals.
- Handler maps: `keyof typeof handlers` for names, `Parameters<(typeof handlers)[E]>` for payloads.
- Runtime guard: `(ARR as readonly string[]).includes(x)` with return type `x is Union`; for objects `Object.hasOwn`.
- `as const` is compile-time only; use `Object.freeze` for runtime immutability. Widen entries meant as defaults.

## Key takeaways {#key-takeaways}

- Deriving types from an `as const` value keeps the runtime list and its type identical by construction.
- `keyof`, `typeof` and indexed access combine into a small set of idioms for keys, values and elements.
- `satisfies` adds shape and completeness checks without discarding literal types.
- Derived unions only cover values created in your code; strings from outside need a runtime guard built from the same constant.
- `as const` freezes types completely, so widen entries that represent defaults rather than fixed values.

```quiz
Q: `const SIZES = ["sm", "md", "lg"];` (no `as const`). What is `(typeof SIZES)[number]`?
- [ ] `"sm" | "md" | "lg"`
- [x] `string`
- [ ] `readonly ["sm", "md", "lg"]`
- [ ] An error, because `SIZES` is a value
> Without `as const`, array literals are inferred as `string[]`, so any element is `string`. The literal union needs `as const`; the tuple type is `typeof SIZES` with `as const`, not its element type. `typeof` converts the value to a type, so there is no error.
```

```quiz
Q: Why does `const LABELS = {...} satisfies Record<Role, string>` catch a forgotten role, while keeping each label's own type?
- [ ] `satisfies` converts the object to `Record<Role, string>`
- [x] `satisfies` checks the value against the type but leaves the inferred type of `LABELS` unchanged
- [ ] `satisfies` adds missing keys at runtime
- [ ] It only works together with `as const`
> The check reports missing or wrong keys, but the variable keeps its own inferred type. An annotation would change the variable's type to the `Record`. `satisfies` does nothing at runtime, and it works with or without `as const`.
```

```quiz
Q: In `function isRole(x: string): x is Role { return ROLES.includes(x); }` with `ROLES` declared `as const`, why is there a compile error?
- [ ] Type predicates cannot use `includes`
- [x] `includes` on a read-only tuple of literals only accepts arguments of the element type `Role`, and `x` is `string`
- [ ] `ROLES` is read-only, so `includes` is not available
- [ ] `x is Role` must be written `x as Role`
> The array's type parameter is the literal union, so `includes(searchElement: Role)` rejects a wider `string`. Widening with `(ROLES as readonly string[]).includes(x)` fixes it safely. Read-only arrays still have `includes`, and `x is Role` is the correct predicate syntax.
```
