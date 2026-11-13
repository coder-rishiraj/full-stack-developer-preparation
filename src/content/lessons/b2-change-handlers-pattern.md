---
summary: The ChangeHandlers pattern derives one correctly typed `onXxxChange` callback per field from a form's state type — `onEmailChange(value: string)`, `onAgeChange(value: number)` — using a mapped type, key remapping and a template literal type. You will learn to build it, adapt it for optional, read-only and skipped fields, implement it at runtime, use it in React props, and compare it with a single `onChange(field, value)`.
difficulty: advanced
minutes: 40
objectives:
  - Build a `ChangeHandlers<T>` type from a mapped type, an `as` clause and a template literal type, and explain each part
  - Predict how optional and read-only fields appear in the generated handlers and adjust them with `-?`, `-readonly` and `never`
  - Implement a runtime factory that produces the handlers object and justify the one assertion it needs
  - Use the pattern in React component props and check hand-written handler objects with `satisfies`
  - Compare per-field handler props with a generic `onChange(field, value)` and a field-change union, and choose between them
---

## Introduction

A form component usually needs one callback per field. For a profile form that means `onNameChange`, `onAgeChange` and `onNewsletterChange`, each receiving a value of a different type. Written by hand, the props look like this:

```typescript title="manual-props.ts"
type Profile = { name: string; age: number; newsletter: boolean };

type ProfileFormProps = {
  values: Profile;
  onNameChange: (value: string) => void;
  onAgeChange: (value: number) => void;
  onNewsletterChange: (value: boolean) => void;
};
```

It works today. The problem is tomorrow. Someone renames `newsletter` to `marketingOptIn` in `Profile`, and `onNewsletterChange` stays — still compiling, now describing a field that no longer exists. Someone changes `age` to a `string` from a text input, and `onAgeChange` still promises a `number`. Every field is described twice, and nothing links the two descriptions.

The **ChangeHandlers pattern** links them. It computes the handler props from the state type:

```typescript title="change-handlers.ts"
type ChangeHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void;
};

type Profile = { name: string; age: number; newsletter: boolean };
type ProfileHandlers = ChangeHandlers<Profile>;
// { onNameChange: (value: string) => void;
//   onAgeChange: (value: number) => void;
//   onNewsletterChange: (value: boolean) => void }
```

Rename a field and its handler is renamed; change a field's type and its handler's parameter changes; add a field and every place that must supply handlers reports the missing one. It is a small, real-world combination of three features you have already met, and a common senior-level interview exercise because it tests whether you can compose them.

## Before you start

- **Mapped types and key remapping** — `[K in keyof T as NewKey]`. See [[b2-mapped-types]], in particular its key remapping section.
- **Template literal types** — `` `on${Capitalize<...>}Change` ``. See [[b2-template-literal-types]].
- **Indexed access** — `T[K]`, the type of one property. See [[b2-indexed-access]].
- **Controlled form inputs in React** — state owned by a parent, changes reported by callbacks. See [[b4-controlled-forms]].
- **`satisfies`** — checking a value against a type without changing its inferred type. See [[b2-satisfies]].

## The intuition

Think of a hotel's key cabinet. The front desk keeps one hook per room, and each hook is labelled with the room number. Nobody writes the labels by hand when a room is added; the cabinet is built from the floor plan, so a new room automatically gets a hook, and a removed room loses its hook.

`ChangeHandlers<T>` is that cabinet for a form. The floor plan is the state type `T`. Each field gets a hook — a handler prop — with a label derived from the field's name and a shape that fits exactly the kind of value that field holds. Where the analogy stops: the type only describes the cabinet. Building the actual handler functions is still the job of your code, as the runtime section shows.

## Building the type, piece by piece

Read `ChangeHandlers<T>` from the outside in.

```text
{ [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void }
    ─────┬─────    ──────────────────┬──────────────────   ─────────┬─────────
   loop over T's     new property name for this K          handler for this K's
   field names                                             original value type
```

1. **`[K in keyof T ...]`** — a mapped type that visits each field name of `T` in turn: `"name"`, then `"age"`, then `"newsletter"`.
2. **`string & K`** — keeps `K` only if it is a string key. `keyof T` may include `number` and `symbol` keys, and `Capitalize` accepts only strings; without this the type fails with error TS2344. Non-string keys become `never` and are dropped.
3. **`` `on${Capitalize<...>}Change` ``** — a template literal type that turns `"name"` into `"onNameChange"`. `Capitalize` upper-cases the first character only, which matches React's camelCase prop convention.
4. **`as ...`** — key remapping: write the property under the new name instead of `K`.
5. **`(value: T[K]) => void`** — the value type uses the *original* `K`, so `onAgeChange` receives `Profile["age"]`, which is `number`.

Two consequences of step 3 are worth knowing. Multi-word camelCase fields work naturally: `zipCode` becomes `onZipCodeChange`. Snake case does not: `first_name` becomes `onFirst_nameChange`, because only the first character is changed. If your state uses snake case, convert it with a recursive template literal type, or keep the state in camelCase.

## Optional, read-only and skipped fields

Because the map loops over `keyof T`, it copies each field's modifiers to its handler. That is not always what you want:

```typescript title="modifiers.ts"
type ChangeHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void;
};

type Account = { readonly id: string; name: string; nickname?: string };

type A = ChangeHandlers<Account>;
// { readonly onIdChange: (value: string) => void;
//   onNameChange: (value: string) => void;
//   onNicknameChange?: ((value: string | undefined) => void) | undefined }
```

The optional field produced an *optional handler* whose value may be `undefined`. The read-only `id` produced a handler, marked `readonly`, for a field that should not change at all. A stricter variant fixes both: `-?` makes every handler required, `-readonly` removes the modifier, and mapping a key to `never` skips it:

```typescript title="editable-handlers.ts"
type EditableHandlers<T, Skip extends keyof T = never> = {
  -readonly [K in keyof T as K extends Skip ? never : `on${Capitalize<string & K>}Change`]-?:
    (value: T[K]) => void;
};

type Account = { readonly id: string; name: string; nickname?: string };

type B = EditableHandlers<Account, "id">;
// { onNameChange: (value: string) => void;
//   onNicknameChange: (value: string | undefined) => void }
```

`onNicknameChange` is now required — the form must handle the field — while its value still allows `undefined`, so the user can clear it. The `Skip` parameter defaults to `never`, which skips nothing, so `EditableHandlers<Account>` still works without a second argument.

## Implementing the handlers at runtime

Types do not create functions. If a parent component or a form store wants to *produce* a handlers object for any state shape, it has to build it with ordinary code. Here is a small, framework-free version, run with Node.js 22:

```typescript title="form-state.ts"
type ChangeHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void;
};

function handlerName<K extends string>(key: K) {
  return `on${key.charAt(0).toUpperCase()}${key.slice(1)}Change` as `on${Capitalize<K>}Change`;
}

function createFormState<T extends object>(initial: T, onUpdate: (next: T) => void) {
  let state = initial;
  const handlers: Record<string, (value: unknown) => void> = {};
  for (const key of Object.keys(initial) as (keyof T & string)[]) {
    handlers[handlerName(key)] = (value) => {
      state = { ...state, [key]: value };
      onUpdate(state);
    };
  }
  // The loop built one handler per key of `initial`; the mapped type says the same.
  return handlers as ChangeHandlers<T>;
}

type Profile = { name: string; age: number; newsletter: boolean };

const form = createFormState<Profile>(
  { name: "Ada", age: 36, newsletter: false },
  (next) => console.log(JSON.stringify(next)),
);

form.onNameChange("Grace");
form.onAgeChange(37);
form.onNewsletterChange(true);
console.log(Object.keys(form));
```

```output
{"name":"Grace","age":36,"newsletter":false}
{"name":"Grace","age":37,"newsletter":false}
{"name":"Grace","age":37,"newsletter":true}
[ 'onNameChange', 'onAgeChange', 'onNewsletterChange' ]
```

There are two type assertions, and both are deliberate. `handlerName` computes the name with string methods, which TypeScript types as plain `string`; the assertion states that the runtime code follows the same rule as `Capitalize` (first character upper-cased). And the final `as ChangeHandlers<T>` bridges from the loosely typed `Record<string, ...>` the loop builds to the precise mapped type. The compiler cannot verify that a loop over `Object.keys` produces exactly the keys a mapped type describes — the mapped type is deferred while `T` is generic — so the factory takes responsibility in one place, and every caller gets fully typed handlers. `form.onAgeChange("37")` is a compile error.

The runtime code also reveals a subtle gap: the loop uses the keys of the *initial value*, while the type uses the keys of `T`. An optional field that is absent from `initial` would have a handler in the type but not at runtime. Either supply every field in `initial` (use `undefined` for empty optional fields) or build the handler list from an explicit array of field names.

## Using it in React props

In a React component the pattern usually appears as part of the props type. This example was type-checked against React 19's type definitions, not run in a browser:

```tsx title="ProfileForm.tsx"
import { useState } from "react";

type ChangeHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void;
};

type Profile = { name: string; age: number; newsletter: boolean };

type ProfileFormProps = { values: Profile } & ChangeHandlers<Profile>;

function ProfileForm({ values, onNameChange, onAgeChange, onNewsletterChange }: ProfileFormProps) {
  return (
    <form>
      <input value={values.name} onChange={(e) => onNameChange(e.target.value)} />
      <input type="number" value={values.age} onChange={(e) => onAgeChange(e.target.valueAsNumber)} />
      <input type="checkbox" checked={values.newsletter} onChange={(e) => onNewsletterChange(e.target.checked)} />
    </form>
  );
}

export function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({ name: "Ada", age: 36, newsletter: false });
  return (
    <ProfileForm
      values={profile}
      onNameChange={(name) => setProfile((p) => ({ ...p, name }))}
      onAgeChange={(age) => setProfile((p) => ({ ...p, age }))}
      onNewsletterChange={(newsletter) => setProfile((p) => ({ ...p, newsletter }))}
    />
  );
}
```

Two things are checked that a hand-written props type would not keep in sync. Inside `ProfileForm`, writing `onAgeChange(e.target.value)` is an error, because `value` is a `string` and the handler expects `Profile["age"]`, a `number` — which nudges you to `valueAsNumber`. In `ProfilePage`, the `name`, `age` and `newsletter` parameters need no annotations; each arrow function is contextually typed from the generated props. If `Profile` gains a field, `ProfilePage` reports the missing handler prop.

### Checking a partial handler object with `satisfies`

Sometimes you write a handlers object by hand — for analytics, or to attach behaviour to a few fields only. `satisfies` (TypeScript 4.9+) checks it against the pattern while keeping its own, narrower type:

```typescript title="satisfies.ts"
type ChangeHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void;
};
type Profile = { name: string; age: number; newsletter: boolean };

const tracking = {
  onNameChange: (value) => console.log("name length", value.length),
} satisfies Partial<ChangeHandlers<Profile>>;

const typo = {
  onNmaeChange: (value: string) => {},
} satisfies Partial<ChangeHandlers<Profile>>; // error
```

```output
error TS2561: Object literal may only specify known properties, but 'onNmaeChange' does not exist in type 'Partial<ChangeHandlers<Profile>>'. Did you mean to write 'onNameChange'?
```

`value` in `tracking` is contextually typed as `string`, the misspelt key is rejected, and `tracking` keeps the type `{ onNameChange: ... }` — so calling `tracking.onAgeChange` is also an error, because the object really does not have it. With a type annotation (`const tracking: Partial<...>`) instead, every handler would be optional on the variable and the information about which ones exist would be lost.

## Alternatives: one `onChange`, or a change union

Per-field props are not the only design. Two others are common, and the choice is a real trade-off.

**A single generic callback.** One prop takes the field name and a value whose type depends on it:

```typescript title="single-onchange.ts"
type Profile = { name: string; age: number; newsletter: boolean };
type OnChange<T> = <K extends keyof T>(field: K, value: T[K]) => void;

const onChange: OnChange<Profile> = (field, value) => console.log(field, value);
onChange("age", 40);   // ok
onChange("age", "40"); // error: string is not assignable to number
```

**A discriminated union of changes.** Each possible change becomes an object, which suits reducers and event logs:

```typescript title="change-union.ts"
type Profile = { name: string; age: number; newsletter: boolean };
type FieldChange<T> = { [K in keyof T]: { field: K; value: T[K] } }[keyof T];

type ProfileChange = FieldChange<Profile>;
// { field: "name"; value: string } | { field: "age"; value: number }
// | { field: "newsletter"; value: boolean }

function reduce(state: Profile, change: ProfileChange): Profile {
  switch (change.field) {
    case "name": return { ...state, name: change.value.trim() };
    case "age": return { ...state, age: Math.max(0, change.value) };
    case "newsletter": return { ...state, newsletter: change.value };
  }
}
```

`FieldChange` maps each key to a small object type and then indexes the result with `[keyof T]` to collect the values into a union. Because `field` is a literal in each member, the `switch` narrows `change.value` to the right type in each case. Discriminated unions are taught in [[b2-discriminated-unions]].

| Design | Strengths | Weaknesses | Good fit |
|---|---|---|---|
| `ChangeHandlers<T>` props | Each handler is named and typed; easy to wire to individual inputs; missing handlers are reported | Many props; a component cannot easily forward "all changes" in one place | Presentational form components |
| `onChange(field, value)` | One prop; easy to forward and log | Generic call sites; parent needs one function that handles every field | Generic field components, form libraries |
| `FieldChange<T>` union | Works with reducers, undo stacks, event logs; exhaustive `switch` | Needs a dispatcher; slightly more ceremony | `useReducer` and store-based forms |

They compose well: a form can accept `ChangeHandlers<T>` from its parent and internally dispatch `FieldChange<T>` objects, or a form library can expose `onChange(field, value)` and offer `ChangeHandlers<T>` as a convenience.

## In real systems

Design-system components frequently expose `onValueChange`, `onOpenChange` or `onCheckedChange` props whose names and payloads follow a convention; a mapped type keeps a large component set consistent with its state types. Form libraries and internal form helpers derive values, errors, touched flags and handlers from one values type. Code generators for admin screens produce a state type from a database or API schema and derive the handler props from it, so regenerated schemas flow straight into the UI types.

The reverse mapping is also useful — getting the field name back from a handler prop name, for example to log which field changed:

```typescript title="field-of.ts"
type ChangeHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void;
};
type Profile = { name: string; age: number; newsletter: boolean };

type FieldOf<H> = H extends `on${infer F}Change` ? Uncapitalize<F> : never;
type Fields = FieldOf<keyof ChangeHandlers<Profile>>; // "name" | "age" | "newsletter"
```

## Common mistakes

> [!MISTAKE] Writing handler props by hand next to the state type
> Two parallel declarations drift: a renamed field leaves a stale handler, and a changed field type leaves a handler with the old parameter type. Derive the props with `ChangeHandlers<T>` so the compiler keeps them aligned.

**Omitting `string &`.** `Capitalize<K>` fails with TS2344 because `keyof T` can contain number and symbol keys. Use `Capitalize<string & K>`.

**Being surprised by optional handlers.** Optional fields produce optional handlers, and the value type includes `undefined`. Add `-?` if every field must be handled.

**Generating handlers for read-only or computed fields.** Skip them with `K extends Skip ? never : ...`, or with a value-type filter.

**Trusting the runtime factory blindly.** The assertion in `createFormState` is only correct if the runtime naming rule matches `Capitalize` and if every key exists in the initial value. Keep the two rules side by side and test the factory.

**Snake-case keys.** `first_name` becomes `onFirst_nameChange`. Use camelCase field names, or add a case-conversion type.

## Interview perspective

A typical prompt is: "Given `type Form = { email: string; age: number }`, type a props object with `onEmailChange` and `onAgeChange` whose parameters match the field types, without listing the fields." Interviewers want to see you compose a mapped type, an `as` clause and a template literal type, and then discuss edge cases. The step-by-step implementation exercise is [[b2-impl-change-handlers]].

> [!INTERVIEW] What a strong answer sounds like
> "I'd map over `keyof T`, remap each key with the template literal type `on${Capitalize<string & K>}Change` in an `as` clause, and give each property the type `(value: T[K]) => void`. The `string &` drops symbol and number keys so `Capitalize` accepts it, and `T[K]` uses the original key so each handler gets its field's type. Because it maps over `keyof T`, optional fields give optional handlers — I'd add `-?` if every field must be handled — and I can skip fields by remapping them to `never`. At runtime I'd build the object in a loop with one assertion, since the compiler can't check a loop against a mapped type."

Follow-ups:

- **How would you exclude `id`?** `as K extends "id" ? never : ...`, or map over `Exclude<keyof T, "id">`.
- **When would you prefer a single `onChange(field, value)`?** For generic field components or when all changes should flow through one place.
- **How do you get the field name back from `"onEmailChange"`?** `` H extends `on${infer F}Change` ? Uncapitalize<F> : never ``.

## Practice

1. Write `ChangeHandlers<T>` from memory, then a `BlurHandlers<T>` that produces `onEmailBlur(): void` handlers with no parameters.
2. Write `EditableHandlers<T>` that automatically skips every `readonly` field without a `Skip` parameter. (Hint: compare `Pick<T, K>` with `Readonly<Pick<T, K>>` in a conditional type.)
3. Modify `createFormState` so that it takes an explicit list of field names and therefore also creates handlers for optional fields missing from the initial value.
4. Build a `useFormHandlers<T>(state, setState)` React hook that returns `ChangeHandlers<T>`, memoised with `useMemo`.
5. Convert the profile form to the `FieldChange<T>` reducer design and list what got easier and what got harder.

```quiz
Q: What does `ChangeHandlers<{ age: number }>` produce?
- [ ] `{ age: (value: number) => void }`
- [x] `{ onAgeChange: (value: number) => void }`
- [ ] `{ onageChange: (value: number) => void }`
- [ ] `{ onAgeChange: (value: unknown) => void }`
> The `as` clause renames `age` to `` `on${Capitalize<"age">}Change` ``, which is `"onAgeChange"`, and the value type `T[K]` uses the original key, so the parameter is `number`.

Q: A state type has `nickname?: string`. What handler does the basic `ChangeHandlers<T>` generate for it?
- [ ] A required `onNicknameChange: (value: string) => void`
- [x] An optional `onNicknameChange?: (value: string | undefined) => void`
- [ ] No handler, because optional fields are skipped
- [ ] A compile error
> Mapping over `keyof T` is homomorphic, so the optional modifier is copied to the handler, and `T["nickname"]` includes `undefined`. Use `-?` to make the handler required while the value still allows `undefined`.

Q: Why does `createFormState` end with `return handlers as ChangeHandlers<T>`?
- [ ] Assertions make the code run faster
- [ ] `Record<string, ...>` cannot be returned from a generic function
- [x] The compiler cannot prove that a loop over `Object.keys` produces exactly the keys described by the mapped type, so the factory asserts it once
- [ ] Without it, the handlers would be `undefined` at runtime
> Assertions have no runtime effect. Inside the generic function the mapped type is deferred and `Object.keys` is typed as `string[]`, so the precise result must be asserted. Callers then get fully typed handlers.

Q: Which design is the most natural fit for a form built on `useReducer`?
- [ ] Hand-written handler props
- [ ] `ChangeHandlers<T>` props
- [x] A `FieldChange<T>` discriminated union dispatched to the reducer
- [ ] An untyped `onChange(event)`
> A reducer takes action objects, and a union of `{ field, value }` objects lets a `switch` on `field` narrow `value` per case. Per-field props suit presentational components; untyped events lose the field-to-type link.
```

## Quick revision {#quick-revision}

- `` type ChangeHandlers<T> = { [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void } ``.
- Parts: mapped type over `keyof T`; `string & K` drops non-string keys; template literal + `Capitalize` builds the name; `T[K]` types the value.
- Homomorphic: optional fields → optional handlers with `| undefined`; `readonly` copied. Use `-?`, `-readonly`; skip keys with `K extends Skip ? never : ...`.
- `Capitalize` changes only the first character: `zipCode` → `onZipCodeChange`, `first_name` → `onFirst_nameChange`.
- Runtime factory: loop over keys, build `Record<string, fn>`, one `as ChangeHandlers<T>` assertion; keep the naming rule in sync and include every field in the initial value.
- React: `Props = { values: T } & ChangeHandlers<T>`; handler arrows are contextually typed; new fields report missing props.
- `satisfies Partial<ChangeHandlers<T>>` checks hand-written handler objects and keeps their narrow type.
- Alternatives: `<K extends keyof T>(field: K, value: T[K]) => void`; `FieldChange<T> = { [K in keyof T]: { field: K; value: T[K] } }[keyof T]` for reducers.
- Reverse: `` H extends `on${infer F}Change` ? Uncapitalize<F> : never ``.

## Key takeaways {#key-takeaways}

- ChangeHandlers derives handler props from the state type, so names and parameter types cannot drift from the fields they describe.
- It is a composition of a mapped type, key remapping and a template literal type — knowing each part lets you adapt it.
- Optional and read-only fields carry their modifiers into the handlers; adjust with `-?`, `-readonly` and `never`.
- Types do not build functions: a runtime factory needs one well-placed assertion and a naming rule that matches `Capitalize`.
- Per-field handlers, a single generic `onChange` and a change union each fit different components; choose by how changes flow through your form.
