---
summary: TypeScript offers two main ways to model a fixed set of values — a union of literal types such as `"idle" | "loading" | "done"`, or an enum. You will compare them on what they compile to, how they accept data, how you list their values, how they refactor and how they work with modern tooling, and leave with a clear rule for choosing.
difficulty: intermediate
minutes: 40
objectives:
  - Compare literal unions and enums on runtime output, assignability, iteration, refactoring and tooling compatibility
  - Explain why a literal union accepts `"paid"` directly while a string enum does not, and why both still need validation for untrusted strings
  - Derive a union type from a runtime array or object so that values can be listed and checked without an enum
  - Choose between a literal union, an `as const` object and an enum for a given codebase and justify the choice
  - Migrate an enum to a literal union safely
---

## Introduction

Suppose a request can be `idle`, `loading`, `success` or `error`. In TypeScript you can describe that set in two quite different ways:

```typescript title="two-ways.ts"
// 1. A union of string literal types
type RequestStatus = "idle" | "loading" | "success" | "error";

// 2. A string enum
enum RequestStatusEnum {
  Idle = "idle",
  Loading = "loading",
  Success = "success",
  Error = "error",
}

const a: RequestStatus = "loading";
const b: RequestStatusEnum = RequestStatusEnum.Loading;
console.log(a === b);
```

```output
true
```

At runtime the two variables hold the same string, and both declarations give you autocomplete, typo detection and exhaustive `switch` checking. So why does the choice matter? Because the two approaches differ in what they emit, in how they accept values, in how you list their members and in which build tools can handle them. Those differences show up daily: in how much code a call site needs, in how API data flows in, and in whether your project can run TypeScript directly in Node.

This lesson puts the two side by side, introduces the `as const` object pattern that combines their strengths, and ends with a practical decision rule. It assumes you know both features individually.

## Before you start

- **Literal types and unions** — `"idle"` as a type, and how `|` combines them. See [[b2-literal-types]] and [[b2-unions]].
- **Enums** — numeric and string enums and what they compile to. See [[b2-enums]] and [[b2-string-enums]].
- **Narrowing and exhaustiveness** — `switch` with a `never` check. See [[b2-narrowing]] and [[b2-exhaustiveness-assertnever]].
- **`typeof` and `keyof` in type positions** — used to derive types from values. See [[b2-typeof]] and [[b2-keyof]].

## The intuition

A literal union is a **rule**: "the value must be one of these exact strings". It lives only in the type checker. The strings themselves are ordinary strings, typed wherever they are used.

An enum is a **registry**: an object that holds the official list of values, plus a rule that says "the value must come from this registry". The registry exists while the program runs, and the rule is strict about provenance — a string with the right contents is not accepted unless it came through the registry.

Most of the practical differences follow from that: rules cost nothing at runtime and accept any matching string; registries can be listed and imported but must be consulted every time.

## Difference 1: what reaches the JavaScript

A union type is erased completely. An enum emits an object. Here is the JavaScript `tsc` produces for the two declarations above, with the `console.log` removed:

```javascript title="two-ways.js"
var RequestStatusEnum;
(function (RequestStatusEnum) {
    RequestStatusEnum["Idle"] = "idle";
    RequestStatusEnum["Loading"] = "loading";
    RequestStatusEnum["Success"] = "success";
    RequestStatusEnum["Error"] = "error";
})(RequestStatusEnum || (RequestStatusEnum = {}));
const a = "loading";
const b = RequestStatusEnum.Loading;
```

`RequestStatus` left no trace. The enum left a small object and a property lookup at each use. The bytes are rarely significant on their own, but the *kind* of output matters more than its size:

- A union is pure type syntax, so any tool that strips types — Node's built-in TypeScript support, esbuild, SWC, Babel — handles it trivially.
- An enum needs to be **transformed**, not stripped. Node 22.18+ refuses to run files containing enums without an experimental flag, and the TypeScript 5.8 option `erasableSyntaxOnly` reports them as errors. A project that adopts either cannot use enums at all.

## Difference 2: what values are accepted

A union accepts any expression whose type is one of its literals. A string enum accepts only its own members.

```typescript title="assignability.ts"
type Status = "idle" | "loading" | "done";
enum StatusEnum { Idle = "idle", Loading = "loading", Done = "done" }

function setStatus(s: Status) {}
function setStatusEnum(s: StatusEnum) {}

setStatus("done");                 // fine
setStatusEnum("done");             // error TS2345
setStatusEnum(StatusEnum.Done);    // fine

const fromJson: string = "done";
setStatus(fromJson);               // error TS2345
```

```output
assignability.ts(8,15): error TS2345: Argument of type '"done"' is not assignable to parameter of type 'StatusEnum'.
assignability.ts(12,11): error TS2345: Argument of type 'string' is not assignable to parameter of type 'Status'.
```

The output is from `tsc --noEmit`. With the union, call sites, tests, fixtures and generated API types can all write `"done"` directly. With the enum, every one of them needs `import { StatusEnum }` and `StatusEnum.Done`. That is the main day-to-day cost of enums.

Line 12 shows what both have in common: a value typed as plain `string` is accepted by **neither**. Data from JSON, URLs or form fields must be validated into the narrower type in both approaches. Enums do not save you that step, and unions do not make it unnecessary.

One union-specific trap: TypeScript **widens** literal types in mutable positions. `let s = "idle"` has type `string`, and so does `{ status: "idle" }.status`, so passing them to `setStatus` fails even though the value is right. The fixes are to annotate (`let s: Status = "idle"`), or to use `as const` on the literal ([[b2-as-const]]).

## Difference 3: listing the values

Dropdowns, validation and tests often need every allowed value as a list. An enum has one built in, because it is an object: `Object.values(StatusEnum)` returns `["idle", "loading", "done"]` (for string enums; numeric enums need filtering because of the reverse mapping).

A union type has no runtime existence, so there is nothing to iterate. If you write the type first, you also have to write an array, and the two can drift apart. The solution is to write the **array first** and derive the type from it:

```typescript title="derive-from-array.ts"
const STATUSES = ["idle", "loading", "done"] as const;
type Status = (typeof STATUSES)[number]; // "idle" | "loading" | "done"

function isStatus(value: string): value is Status {
  return (STATUSES as readonly string[]).includes(value);
}

console.log(STATUSES.join(" | "));
console.log(isStatus("loading"), isStatus("paused"));
```

```output
idle | loading | done
true false
```

Read the type from the inside out. `as const` makes the array a readonly tuple of literal types, `readonly ["idle", "loading", "done"]`, instead of `string[]`. `typeof STATUSES` takes the type of that value, and indexing it with `[number]` gives the type of any element — the union of the three literals. There is now a single source of truth: add `"error"` to the array and both the runtime list and the type gain it.

The cast inside `isStatus` is needed because `includes` on a `readonly Status[]` only accepts `Status` arguments, and `value` is a `string`. Widening the array to `readonly string[]` for the check is safe, since we only read it. The `as const` details are in [[b2-as-const-objects]].

## Difference 4: refactoring and readability

**Renaming a value.** With a string enum, the value lives in one place. Changing `Done = "done"` to `Done = "completed"` (because the API changed) is a one-line edit; every use refers to `StatusEnum.Done`. With a union, `"done"` is written at each use. Changing it means editing every occurrence — but the compiler finds them all, because every old `"done"` is now a type error. It is more edits, not less safety.

**Renaming the name.** Enums separate the identifier (`Done`) from the value (`"done"`), so you can rename the identifier with your editor's rename command without touching data. Unions have no separate identifier.

**Reading code.** `StatusEnum.Done` makes the domain explicit at the call site. `"done"` is shorter, and with editor hovers and autocomplete it is rarely ambiguous. Teams differ in which they find clearer.

**Exhaustiveness.** Identical. Both are unions to the type checker, so a `switch` with a `never` check in its `default`, or a function with an explicit return type, reports missing cases in both.

**Type-level tools.** Literal unions plug into the rest of the type system directly: `Exclude<Status, "idle">`, template literal types such as `` `on${Capitalize<Status>}` `` (giving `"onIdle" | "onLoading" | "onDone"`), and mapped types. Enum types work with many of these too — `Record<StatusEnum, string>` is fine — but code that manipulates strings at the type level is generally simpler with literal unions. See [[b2-template-literal-types]].

## Difference 5: numeric values

Everything above compares *string* enums with string unions. Numeric enums add their own quirks: implicit numbering that shifts when members are inserted, a reverse mapping that doubles `Object.keys`, and acceptance of any `number`. A union of numeric literals (`type Port = 80 | 443 | 8080`) has none of those, but also has no names — `443` explains less than `Port.Https`. When the numbers need names, an `as const` object is usually the cleanest choice:

```typescript title="numeric-names.ts"
const HttpStatus = { Ok: 200, NotFound: 404, ServerError: 500 } as const;
type HttpStatus = (typeof HttpStatus)[keyof typeof HttpStatus]; // 200 | 404 | 500

function isError(code: HttpStatus): boolean {
  return code >= 400;
}

console.log(isError(HttpStatus.NotFound), isError(200));
```

```output
true false
```

`isError(200)` is accepted because `200` is one of the literals; `isError(201)` would be a compile error. Notice that the value and the type share the name `HttpStatus` — TypeScript keeps values and types in separate namespaces, so this is legal and mirrors how an enum name works as both.

## The middle ground: `as const` objects

The last example is the pattern many teams use in place of enums: an ordinary object marked `as const`, plus a union type derived from its values. It gives you:

- **Named members** — `HttpStatus.NotFound`, like an enum.
- **A runtime object** you can iterate with `Object.values`, like an enum.
- **A union type** that accepts plain literals such as `404`, like a union.
- **No special syntax** — it is ordinary JavaScript plus erasable types, so it works with type stripping and `erasableSyntaxOnly`.

It is slightly more verbose to declare, and the derived-type line looks unfamiliar at first. The pattern is taught fully in [[b2-as-const-objects]].

```quiz
Q: Which statement about `type Status = "a" | "b"` and `enum E { A = "a", B = "b" }` is true?
- [ ] Both emit a JavaScript object
- [ ] Both accept the plain string `"a"` as an argument
- [x] Both reject a value whose type is `string`, so untrusted input must be validated in either case
- [ ] Only the enum supports exhaustive `switch` checking
> Neither type accepts the general `string` type, so JSON or URL data must be checked first. Only the enum emits an object; only the union accepts the literal `"a"` directly; both are unions to the checker, so both support exhaustiveness checks.

Q: Why is `type Status = (typeof STATUSES)[number]` written after `const STATUSES = [...] as const` rather than the other way round?
- [ ] Because types must always be declared after values
- [x] Because a type cannot be turned into a runtime array, but a runtime array's type can be extracted, so the array must be the single source of truth
- [ ] Because `as const` only works on types
- [ ] There is no reason; either order produces the same result
> Types are erased, so nothing can generate an array from `"idle" | "loading"`. Starting from the array and deriving the type gives one source for both the runtime list and the type. Without `as const` the array would be `string[]` and the derived type would be `string`.
```

## Worked example: a filter bar without an enum

This example implements a small feature — filter buttons for a task list — with a derived literal union. It needs a list of values (for the buttons), a type (for state), labels for each value, validation of a URL parameter, and exhaustive handling.

```typescript title="filters.ts"
const FILTERS = ["all", "active", "completed"] as const;
type Filter = (typeof FILTERS)[number];

const FILTER_LABELS: Record<Filter, string> = {
  all: "All tasks",
  active: "Still to do",
  completed: "Done",
};

type Task = { title: string; done: boolean };

function isFilter(value: string): value is Filter {
  return (FILTERS as readonly string[]).includes(value);
}

function applyFilter(tasks: Task[], filter: Filter): Task[] {
  switch (filter) {
    case "all":
      return tasks;
    case "active":
      return tasks.filter((t) => !t.done);
    case "completed":
      return tasks.filter((t) => t.done);
  }
}

function filterFromQuery(query: string): Filter {
  const raw = new URLSearchParams(query).get("filter") ?? "";
  return isFilter(raw) ? raw : "all";
}

const tasks: Task[] = [
  { title: "Write lesson", done: true },
  { title: "Review PR", done: false },
];

console.log(FILTERS.map((f) => `[${FILTER_LABELS[f]}]`).join(" "));
for (const query of ["?filter=active", "?filter=archived", ""]) {
  const filter = filterFromQuery(query);
  console.log(filter, applyFilter(tasks, filter).map((t) => t.title));
}
```

```output
[All tasks] [Still to do] [Done]
active [ 'Review PR' ]
all [ 'Write lesson', 'Review PR' ]
all [ 'Write lesson', 'Review PR' ]
```

Walk through it. `FILTERS` is the single source of truth; `Filter` is derived from it. `FILTER_LABELS` is typed `Record<Filter, string>`, so adding `"archived"` to `FILTERS` immediately produces a compile error here (*Property 'archived' is missing*), and another one in `applyFilter`, whose `switch` would no longer cover every case and so would fall off the end without a return. Two edits the compiler forces you to make, and nothing else.

The URL parameter arrives as `string | null`. `?? ""` handles the missing case, and `isFilter` narrows the string to `Filter` only if it is in the list, so `"archived"` falls back to `"all"` instead of reaching `applyFilter`. Inside `applyFilter`, cases are plain string literals — no imports, no qualified names.

The enum version would look almost the same: `enum Filter { All = "all", … }`, `Object.values(Filter)` for the buttons, `Record<Filter, string>` for labels, `case Filter.All:` in the switch. It would also work. The differences are that every file using it needs the import, test code cannot write `"active"`, and the file could not be run by Node's type stripping.

## Migrating from an enum to a union

Teams often migrate when they adopt `erasableSyntaxOnly` or start running TypeScript directly in Node. For a string enum, a safe path is:

1. Replace `enum Status { Idle = "idle", … }` with `const Status = { Idle: "idle", … } as const;` and `type Status = (typeof Status)[keyof typeof Status];`. Existing `Status.Idle` references keep working, both as values and in `switch` cases.
2. Replace any type-position use of a single member, such as `Status.Idle` used as a type, with the literal `"idle"` (or `typeof Status.Idle`), because an object property is not a type.
3. Compile. Places that relied on nominal behaviour — for example, functions overloaded on two enums with the same values — now surface as errors to review.
4. Optionally replace `Status.Idle` with `"idle"` at call sites over time; both are valid.

Numeric enums need more care: if any code uses the reverse mapping (`Status[value]` to get a name), you must add an explicit lookup table.

## In real systems

**Generated API types.** OpenAPI and GraphQL code generators commonly emit string literal unions for enum-like fields, because they need no imports and match JSON exactly. Some generators can emit TypeScript enums instead as an option.

**Libraries.** Library authors favour unions in public APIs: users can pass `"primary"` to a component prop without importing anything, and there is no risk of two copies of an enum object being incompatible across package versions.

**Large application codebases.** Many established codebases use string enums by convention, particularly where the team values the explicit `Status.Paid` style or shares models with C# or Java back ends. Consistency within a codebase matters more than which option is chosen.

**Modern Node and Vite projects.** Projects using `erasableSyntaxOnly` or Node's built-in TypeScript execution use unions and `as const` objects exclusively.

## Trade-offs and alternatives

| Concern | Literal union | String enum | `as const` object + union |
|---|---|---|---|
| Runtime output | None | Object (IIFE) | Plain object |
| Call sites write | `"done"` | `Status.Done` (import needed) | Either |
| Plain matching literal accepted | Yes | No | Yes |
| List of values at runtime | Only with a separate array | `Object.values(E)` | `Object.values(obj)` |
| Change a value in one place | No (compiler finds each use) | Yes | Yes |
| Exhaustiveness checking | Yes | Yes | Yes |
| Type stripping / `erasableSyntaxOnly` | Works | Rejected | Works |

```mermaid title="Choosing a representation"
flowchart TD
    Q1{"Does the codebase forbid enums or rely on type stripping?"} -- yes --> U["Literal union, or as const object if names or a list are needed"]
    Q1 -- no --> Q2{"Does the team convention already use enums?"}
    Q2 -- yes --> E["String enum, consistently"]
    Q2 -- no --> Q3{"Need named members or a runtime list?"}
    Q3 -- yes --> C["as const object with derived union"]
    Q3 -- no --> L["Plain literal union"]
```

A defensible default for new TypeScript code: **use a literal union; when you also need a runtime list or named constants, use an `as const` object or array and derive the union from it; use string enums when a codebase's established convention calls for them, and avoid numeric enums unless the numbers are inherently meaningful.**

## Common mistakes

> [!MISTAKE] Maintaining a union and an array separately
> `type Status = "a" | "b"` plus `const STATUSES = ["a", "b"]` will drift: someone adds `"c"` to one and not the other. Derive the type from an `as const` array or object.

**Mixing both styles for one concept.** One module passes `"paid"`, another passes `OrderStatus.Paid`; the string is not assignable to the enum, and casts creep in. Pick one representation per domain concept.

**Forgetting widening.** `const state = { status: "idle" }` gives `status` the type `string`, which a `Status` parameter rejects. Annotate the object or use `as const`.

**Assuming either approach validates input.** A JSON string is `string` in both cases. Validate with a membership check or a schema before narrowing.

**Choosing numeric enums for persisted values.** Insertion renumbers members. Use strings, or explicit numbers in an `as const` object.

## Interview perspective

"Enums or union types?" is a common TypeScript interview question because it has no single right answer — interviewers want to hear trade-offs.

> [!INTERVIEW] A balanced answer
> "Unions are erased, accept literals directly and work with type stripping, but they have no runtime list unless I derive the type from an `as const` array or object. String enums give named members and a runtime object, but they emit code, require imports at every call site, reject plain strings, and are not allowed under `erasableSyntaxOnly`. For new code I default to unions or `as const` objects; in a codebase that already uses enums, I stay consistent."

Follow-ups to expect:

- **How do you get the list of values from a union?** You cannot; start from an `as const` array or object and derive the union with `(typeof X)[number]` or `(typeof X)[keyof typeof X]`.
- **Do enums help with API validation?** No; both need a runtime check. Enums only provide a convenient list to check against, which `as const` also provides.
- **What changes with numeric enums?** Reverse mapping, renumbering, and acceptance of any `number`.

## Practice

1. Model a `Size` with values `sm`, `md`, `lg` three ways: a literal union, a string enum and an `as const` object. For each, write `isSize(value: string)` and list the values. Compare the amount of code.
2. Compile the enum version with `tsc` and read the emitted JavaScript. Then run the union version with `node file.ts` (Node 22.18 or later) and the enum version the same way. Explain the difference.
3. Given `const config = { size: "md" }`, explain why `setSize(config.size)` fails for `setSize(s: Size)` and give two fixes.
4. Migrate this enum to an `as const` object without changing call sites: `enum Role { Admin = "ADMIN", Editor = "EDITOR", Viewer = "VIEWER" }`. Which uses (if any) still need editing?
5. Add a new filter value to the worked example and list every compile error the change produces.

## Quick revision {#quick-revision}

- Literal union: type-only, erased, accepts matching literals, no runtime list.
- String enum: emits an object, nominal (plain literals rejected), `Object.values` gives the list, import needed at call sites.
- Neither accepts a general `string`; validate external input in both cases.
- Literals widen in mutable positions (`let`, object properties); annotate or use `as const`.
- Derive unions from values: `(typeof ARR)[number]` for an `as const` array; `(typeof OBJ)[keyof typeof OBJ]` for an `as const` object.
- Exhaustiveness checking works the same for both.
- Enums need transformation; unions and `as const` objects survive type stripping and `erasableSyntaxOnly`.
- Changing a value: one line with an enum or `as const` object; every use with a bare union (the compiler lists them).
- Default for new code: union, or `as const` object when names or a list are needed; follow existing convention otherwise.

## Key takeaways {#key-takeaways}

- Literal unions and string enums give the same compile-time safety for a fixed set of strings, including exhaustiveness checks.
- The differences are practical: runtime output, whether plain literals are accepted, how you list values, and tool compatibility.
- External strings must be validated whichever you choose; neither makes `string` assignable.
- Deriving a union from an `as const` array or object gives one source of truth for both the runtime list and the type.
- Modern TypeScript setups that strip types cannot use enums, which pushes new code towards unions and `as const` objects.
- In an existing codebase, consistency with the established style matters more than either option's advantages.
