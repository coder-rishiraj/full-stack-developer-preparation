---
summary: The `infer` keyword lets a conditional type capture part of the type it matched — a function's return type, an array's element type, the value inside a promise. You will learn where `infer` is allowed, how the compiler fills it in, how to rebuild `ReturnType` and `Parameters` from scratch, and the edge cases around overloads, generics and multiple matches.
difficulty: advanced
minutes: 45
objectives:
  - Explain what `infer X` declares and why it is only allowed in the `extends` clause of a conditional type
  - Implement `ReturnType`, `Parameters`, an element-type extractor and a promise unwrapper from scratch
  - Predict what `infer` produces for overloaded functions, generic functions and repeated `infer` names
  - Use `infer` with tuple spreads, template literal types and `extends` constraints
  - Derive types from existing code (such as action creators) instead of duplicating them by hand
---

## Introduction

You have a function, and you need the type of what it returns. Perhaps it is `createUser()` from a library, and you want to store its result in React state. You could copy the return type out of the editor tooltip and paste it as an interface, but then two definitions describe the same thing, and the first time the library changes, they drift apart.

What you want is to say to the compiler: "here is a function type; *whatever* it returns, give me that". Conditional types (from [[b2-conditional-types]]) can already ask "is this a function?", but they cannot yet name the part they found. The **`infer`** keyword adds that ability:

```typescript title="first-look.ts"
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function createUser() {
  return { id: "u1", roles: ["admin"] };
}

type User = MyReturnType<typeof createUser>; // { id: string; roles: string[] }
```

`infer R` declares a new type variable `R` *inside the pattern*. If `T` matches the shape "a function returning something", the compiler works out what that something is, binds it to `R`, and `R` can be used in the true branch. If `T` does not match, the false branch is taken and `R` is not available.

Almost every standard utility that extracts a type — `ReturnType`, `Parameters`, `ConstructorParameters`, `InstanceType`, `Awaited` — is a conditional type with `infer`. Being able to write them yourself means you can derive types from the code that already exists instead of maintaining parallel declarations.

## Before you start

- **Conditional types and distribution** — `T extends U ? X : Y`, and why a naked `T` is evaluated per union member. See [[b2-conditional-types]].
- **Function types** — `(a: string) => number`, rest parameters `(...args: P) => R`. See [[b2-typed-functions]].
- **Tuples** — fixed-length arrays such as `[string, number]` and spreads like `[...T]`. See [[b2-tuples]].
- **`typeof` in type positions** — turning a value (a function, an object) into its type. See [[b2-typeof]].

## The intuition

If you have used regular expressions, you already know this idea. The pattern `/^user_(\d+)$/` matched against `"user_42"` succeeds and hands you a **capture group** containing `"42"`. The pattern describes the shape; the parentheses mark the part you want to keep.

`infer` is a capture group for types. The `extends` clause is the pattern, and each `infer X` marks a hole whose contents you want back:

```text
pattern:   (...args: any[]) => infer R
matched:   (id: string) => Promise<User>
captured:  R = Promise<User>
```

Like a regex, the match can fail, and then there is nothing to capture — the false branch runs instead. Where the analogy stops working: a regex searches a string left to right, while the compiler matches structurally, by comparing the two types part by part, and it may combine several candidates for the same hole, as you will see below.

## Writing extractors with `infer`

### Function return and parameter types

These two definitions are exactly how the standard library defines them in `lib.es5.d.ts`:

```typescript title="lib.ts"
type Parameters<T extends (...args: any) => any> =
  T extends (...args: infer P) => any ? P : never;

type ReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : any;
```

`Parameters` captures the whole parameter list as a tuple, including names and optional markers:

```typescript title="parameters.ts"
function search(query: string, limit?: number) {
  return [query.slice(0, limit)];
}

type SearchArgs = Parameters<typeof search>;   // [query: string, limit?: number | undefined]
type SearchResult = ReturnType<typeof search>; // string[]
```

The constraint `T extends (...args: any) => any` on the built-ins means you get a compile error if you pass something that is not a function, which is more helpful than silently getting `never`. Your own versions can omit the constraint if you want them to accept anything.

You can also capture a single parameter by putting `infer` in that position:

```typescript title="first-arg.ts"
type FirstArg<T> = T extends (first: infer A, ...rest: any[]) => any ? A : never;

type A1 = FirstArg<(id: string, retries: number) => void>; // string
```

### Element types of arrays and tuples

`infer` can sit anywhere in the pattern, including inside an array type:

```typescript title="element-type.ts"
type ElementType<T> = T extends readonly (infer E)[] ? E : T;

type E1 = ElementType<string[]>;            // string
type E2 = ElementType<(string | number)[]>; // string | number
type E3 = ElementType<boolean>;             // boolean (not an array, returned as-is)
```

The parentheses in `(infer E)[]` matter: without them, `infer E[]` would parse as "infer a type named `E[]`", which is not valid. Using `readonly ... []` in the pattern makes the extractor accept both mutable and read-only arrays.

Tuple patterns with spreads let you take a tuple apart, which is the basis of type-level list processing:

```typescript title="tuples.ts"
type First<T extends readonly unknown[]> = T extends [infer H, ...unknown[]] ? H : never;
type Last<T extends readonly unknown[]> = T extends [...unknown[], infer L] ? L : never;
type Tail<T extends readonly unknown[]> = T extends [unknown, ...infer R] ? R : never;

type F1 = First<[1, 2, 3]>;       // 1
type F2 = First<[]>;              // never — an empty tuple has no first element
type L1 = Last<["a", "b", "c"]>;  // "c"
type T1 = Tail<[1, 2, 3]>;        // [2, 3]
```

### Unwrapping a promise, and recursion

Capturing the value inside a `Promise` is one line:

```typescript title="unwrap.ts"
type UnwrapPromise<T> = T extends Promise<infer V> ? V : T;

type U1 = UnwrapPromise<Promise<string>>;          // string
type U2 = UnwrapPromise<Promise<Promise<number>>>; // Promise<number>
```

`U2` peels only one layer. To unwrap any depth, recurse in the true branch:

```typescript title="deep-unwrap.ts"
type DeepUnwrap<T> = T extends Promise<infer V> ? DeepUnwrap<V> : T;

type U3 = DeepUnwrap<Promise<Promise<number>>>; // number
```

This is the core of the built-in `Awaited<T>`, which also handles non-`Promise` "thenable" objects and is covered with async functions in [[b2-async-return-infer]].

## Where `infer` is allowed

`infer` declarations may appear **only in the `extends` clause of a conditional type**. Anywhere else is an error:

```typescript title="invalid.ts"
type Bad<T> = infer U; // error
```

```output
error TS1338: 'infer' declarations are only permitted in the 'extends' clause of a conditional type.
```

The rule follows from what `infer` means. It is a placeholder that the compiler fills in *by matching* the checked type against a pattern. Outside a conditional's `extends` clause there is no pattern and nothing to match, so there is nothing to infer from. Likewise the captured variable is in scope only in the **true branch**: in the false branch the match failed, so the variable has no value.

`infer` also has nothing to do with runtime values. It does not create a variable you can `console.log`; it names a type that exists only during type checking.

## How the compiler fills in `infer`

When the checker evaluates `T extends Pattern ? X : Y` and `Pattern` contains `infer` declarations, it runs the same inference algorithm it uses for generic function calls:

1. Walk `T` and `Pattern` side by side. Wherever `Pattern` has `infer V` and `T` has some type `S` in the same position, record `S` as a **candidate** for `V`.
2. When all candidates are collected, choose a type for each `infer` variable from its candidates (details below). If there are no candidates, use the variable's constraint, or `unknown`.
3. Substitute the inferred types into `Pattern` and check whether `T` is assignable to it. If yes, take the true branch with the variables bound; if no, take the false branch.

So `infer` is not magic syntax; it is the same machinery that works out `T` when you call `identity("hi")`, applied to a type pattern.

### The same name in several positions

You may use the same `infer` name more than once. How the candidates are combined depends on the **variance** of the positions (see [[b2-function-variance]]):

```typescript title="multiple-candidates.ts"
// Property positions are covariant: candidates combine into a union.
type Both<T> = T extends { a: infer U; b: infer U } ? U : never;
type B1 = Both<{ a: string; b: number }>; // string | number

// Parameter positions are contravariant: candidates combine into an intersection.
type Param<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void } ? U : never;
type P1 = Param<{ a: (x: { id: string }) => void; b: (x: { ok: boolean }) => void }>;
// { id: string } & { ok: boolean }
type P2 = Param<{ a: (x: string) => void; b: (x: number) => void }>;
// never — string & number has no values
```

The reasoning is the same as for function parameters in general. A value that must be *read* from either property can be either type, so a union is the safe answer. A value that must be *passed* to both functions must be acceptable to both, so it has to satisfy both types at once — an intersection. This union-to-intersection trick is used in advanced libraries, but in application code, repeating an `infer` name is rare.

### Constraining what `infer` accepts

Since TypeScript 4.7 you can attach a constraint directly to an `infer` declaration with `infer X extends C`. The match succeeds only if the captured type satisfies the constraint:

```typescript title="infer-extends.ts"
type FirstString<T> = T extends [infer S extends string, ...unknown[]] ? S : never;
type S1 = FirstString<["id", 2]>; // "id"
type S2 = FirstString<[1, 2]>;    // never

type ToNumber<T> = T extends `${infer N extends number}` ? N : never;
type N1 = ToNumber<"42">;  // 42
type N2 = ToNumber<"abc">; // never
```

Before 4.7 you needed a second nested conditional (`T extends [infer S, ...unknown[]] ? S extends string ? S : never : never`). The constrained form is shorter and, in the template-literal case, has a bonus: since TypeScript 4.8, `infer N extends number` inside a template literal type converts the matched text `"42"` into the number literal type `42`.

### Inferring from template literal types

`infer` also works inside template literal types, which lets you parse strings at the type level:

```typescript title="parse-route.ts"
type EventName<T> = T extends `on${infer E}` ? Uncapitalize<E> : never;
type N3 = EventName<"onClick" | "onKeyDown" | "value">; // "click" | "keyDown"
```

The conditional distributes over the union; `"value"` does not match the `on...` pattern and becomes `never`, which drops out. Template literal parsing is taught fully in [[b2-template-literal-types]].

## Edge cases you will meet

```typescript title="edge-cases.ts"
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

declare function parse(x: string): string;
declare function parse(x: number): number;

type O1 = MyReturnType<typeof parse>;             // number — the last overload
type O2 = Parameters<typeof parse>;               // [x: number]
type G1 = MyReturnType<<T>(value: T) => T>;       // unknown
type I1 = InstanceType<typeof Date>;              // Date
type R2 = MyReturnType<string>;                   // never — not a function
```

**Overloads: only the last signature is used.** An overloaded function has several call signatures, and a conditional type cannot match all of them at once. TypeScript matches against the last declared signature, which is usually the most general one. If you need the result of a specific overload, there is no general built-in way; declare the type you need explicitly.

**Generic functions: type parameters become `unknown`.** `<T>(value: T) => T` has no fixed return type; it depends on how it is called. With nothing to bind `T` to, inference falls back to its constraint, which here is `unknown`.

**Constructors** are matched with `abstract new (...args: any) => infer R`, which is how `InstanceType` and `ConstructorParameters` work.

**A failed match falls to the false branch.** Choosing what that branch returns is a design decision. `never` makes misuse disappear silently from unions, which can hide bugs; returning the input unchanged (like `ElementType<boolean>` above) is friendlier for "unwrap if wrapped" helpers; constraining `T` so misuse is a compile error is clearest of all.

## Worked example: deriving an action union

A common real use of `infer`-based utilities is to stop writing the same type twice. Here is a small state reducer whose action types are derived from the action creator functions, run with Node.js 22.

```typescript title="actions.ts"
const actions = {
  add: (text: string) => ({ type: "add" as const, text }),
  toggle: (id: number) => ({ type: "toggle" as const, id }),
  clear: () => ({ type: "clear" as const }),
};

// For every creator, take its return type; then make a union of them.
type ActionCreators = typeof actions;
type Action = ReturnType<ActionCreators[keyof ActionCreators]>;

type Todo = { id: number; text: string; done: boolean };

function reducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case "add":
      return [...state, { id: state.length + 1, text: action.text, done: false }];
    case "toggle":
      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case "clear":
      return [];
  }
}

let todos: Todo[] = [];
todos = reducer(todos, actions.add("Write lesson"));
todos = reducer(todos, actions.add("Review"));
todos = reducer(todos, actions.toggle(1));
console.log(todos.map((t) => `${t.id}:${t.done ? "x" : " "} ${t.text}`).join("\n"));
```

```output
1:x Write lesson
2:  Review
```

Follow the types from the top. `typeof actions` turns the object value into its type: an object whose properties are three functions. `ActionCreators[keyof ActionCreators]` is an indexed access over all keys (see [[b2-indexed-access]]), which gives the *union* of the three function types. `ReturnType` then receives a union, and because its `T` is a naked type parameter, it distributes: each function's return type is inferred separately, giving

```text
{ type: "add"; text: string } | { type: "toggle"; id: number } | { type: "clear" }
```

That is a discriminated union (see [[b2-discriminated-unions]]), so inside the `switch` the compiler knows `action.text` exists only in the `"add"` case. The `as const` on each `type` keeps it as a literal; without it, every `type` would widen to `string` and the union could no longer be narrowed.

The benefit is maintenance. Add a fourth creator and `Action` updates automatically; because the `switch` no longer covers every case, the compiler then reports that `reducer` "lacks ending return statement" (TS2366) until you handle the new action. Nothing has to be written twice.

## In real systems

**Deriving types from functions you do not own.** `ReturnType<typeof someLibraryFn>` and `Parameters<typeof handler>` are the everyday uses. React code often writes `Parameters<typeof onChange>[0]` to get an event type, or `ReturnType<typeof setTimeout>` to type a timer handle that is `number` in browsers and an object in Node.js.

**Redux and state libraries.** Redux Toolkit documents `ReturnType<typeof store.getState>` as the way to type `RootState`, and the action-union pattern above is common in hand-written reducers.

**Async results.** `Awaited<ReturnType<typeof fetchUser>>` turns an async function into the type of its resolved value — the subject of [[b2-async-return-infer]].

**Libraries.** Schema libraries infer output types from schema objects; routers infer path parameters from strings such as `"/users/:id"` with template-literal `infer`.

## Trade-offs and alternatives

`infer`-based extraction keeps one source of truth, which is its main advantage. The costs are readability and error quality: when a match fails, you often get `never` or `unknown` with no explanation, and the resulting error appears far from the cause.

Prefer the built-ins (`ReturnType`, `Parameters`, `InstanceType`, `ConstructorParameters`, `Awaited`) over custom versions; they are well known and their edge cases are documented. When the "source" type is something you own and is simple, an explicitly declared, exported type can be clearer than extracting it — for example, define `type User = { ... }` and annotate the function to return it, rather than deriving `User` from the function. Use `infer` when the type genuinely belongs to the function (a library, generated code) or when extraction avoids real duplication.

## Common mistakes

> [!MISTAKE] Using `ReturnType` on the function instead of its type
> `ReturnType<createUser>` fails with "'createUser' refers to a value, but is being used as a type here". Utility types take *types*; write `ReturnType<typeof createUser>`.

**Forgetting the parentheses in array patterns.** Write `(infer E)[]`, not `infer E[]`.

**Expecting the type of a specific overload.** Extraction uses the last overload signature. If you need another, declare it explicitly.

**Using the captured variable in the false branch.** It is only in scope in the true branch, because in the false branch nothing was matched.

**Returning `never` where a misuse should be an error.** A silent `never` makes bad input vanish inside unions. Constrain the type parameter (as the built-in `ReturnType` does) so the mistake is reported where it is made.

## Interview perspective

"Implement `ReturnType`" is one of the most common TypeScript interview questions. A strong candidate writes it immediately, explains the pieces, and handles the follow-ups.

> [!INTERVIEW] What a strong answer sounds like
> "`type MyReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : never`. The conditional checks that `T` is a function, and `infer R` asks the compiler to capture the return type during the match. `infer` is only legal in the `extends` clause, and `R` is only in scope in the true branch. For overloaded functions it picks the last signature, and for generic functions the type parameters become `unknown`."

Follow-ups to prepare:

- **Implement `Parameters`, `First`, `Last` and `UnwrapPromise`.** All are one-line patterns: `(...args: infer P)`, `[infer H, ...unknown[]]`, `[...unknown[], infer L]`, `Promise<infer V>`.
- **Unwrap nested promises.** Recurse in the true branch: `T extends Promise<infer V> ? Unwrap<V> : T`; mention that `Awaited` does this and also handles thenables.
- **What happens when the same `infer` name appears twice?** Covariant positions give a union; contravariant (parameter) positions give an intersection.
- **Is `infer` a runtime feature?** No; it is erased with all other types.

## Practice

1. Write `MyParameters<T>` and `MyConstructorParameters<T>` without looking at the lesson, then compare with the built-ins.
2. Write `SecondArg<T>` that returns the type of a function's second parameter, or `never` if it has fewer than two.
3. Write `Flatten<T>` that turns `string[][][]` into `string` using a recursive `infer`.
4. Write `PropType<T, K>` that uses `infer` to extract the type of property `K` from `T` (then notice that `T[K]` does the same job with less code, and explain when `infer` is still needed).
5. Extend the reducer example with a `rename` creator and confirm that the `Action` union and the `switch` pick it up.

```quiz
Q: Where may an `infer` declaration appear?
- [ ] Anywhere a type is expected
- [ ] Only in generic function signatures
- [x] Only in the `extends` clause of a conditional type
- [ ] Only inside `ReturnType` and `Parameters`
> `infer` is a placeholder filled in by matching the checked type against a pattern, and only a conditional's `extends` clause provides that pattern. Elsewhere it is error TS1338. The built-ins are ordinary conditional types, not special cases.

Q: What is `ReturnType<typeof parse>` for `declare function parse(x: string): string; declare function parse(x: number): number;`?
- [ ] `string | number`
- [ ] `string`
- [x] `number`
- [ ] A compile error
> Conditional types match an overloaded function against its last signature only, so the result is `number`. It is tempting to expect a union of all overload results, but the compiler does not combine them.

Q: For `type Both<T> = T extends { a: infer U; b: infer U } ? U : never`, what is `Both<{ a: string; b: boolean }>`?
- [x] `string | boolean`
- [ ] `string & boolean`
- [ ] `never`
- [ ] `string`
> Property types are covariant positions, so the two candidates for `U` are combined into a union. An intersection is produced only when the repeated `infer` is in contravariant positions such as function parameters.

Q: `type Elem<T> = T extends (infer E)[] ? E : never`. What is `Elem<string[] | number>`?
- [ ] `never`
- [x] `string`
- [ ] `string | number`
- [ ] `(string | number)[]`
> `T` is naked, so the conditional distributes: `string[]` matches and gives `string`; `number` does not match and gives `never`, which disappears from the union.
```

## Quick revision {#quick-revision}

- `infer X` declares a type variable captured by matching; legal **only in the `extends` clause** of a conditional type (else TS1338).
- The captured variable is in scope **only in the true branch**.
- `ReturnType<T> = T extends (...args: any) => infer R ? R : any` (with a function constraint on `T`).
- `Parameters<T> = T extends (...args: infer P) => any ? P : never` — gives a labelled tuple.
- Arrays: `T extends readonly (infer E)[]`; tuples: `[infer H, ...unknown[]]`, `[...unknown[], infer L]`, `[unknown, ...infer R]`.
- Promise: `T extends Promise<infer V> ? V : T`; recurse for deep unwrapping; built-in `Awaited` does this and handles thenables.
- Same name twice: covariant → union, contravariant (parameters) → intersection.
- `infer X extends C` (TS 4.7+) constrains the capture; in template literals, `infer N extends number` yields a number literal (TS 4.8+).
- Overloads → last signature; generic functions → type parameters become `unknown`; failed match → false branch.
- Utility types take types: `ReturnType<typeof fn>`, not `ReturnType<fn>`.

## Key takeaways {#key-takeaways}

- `infer` turns a conditional type into a pattern match that can capture part of the matched type, like a regex capture group for types.
- It uses the compiler's ordinary inference algorithm, so variance rules decide how repeated captures combine.
- `ReturnType`, `Parameters`, `InstanceType` and `Awaited` are all small `infer` patterns you should be able to write from memory.
- Overloads, generic functions and failed matches have specific, predictable results — last signature, `unknown`, and the false branch.
- Use extraction to keep one source of truth for types you do not own; prefer explicit declarations for simple types you do own.
