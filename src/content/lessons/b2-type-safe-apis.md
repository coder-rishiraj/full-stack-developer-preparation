---
summary: A type-safe API makes the client and the server agree on request and response shapes at compile time, and checks untrusted JSON once at the network boundary so the rest of the code can trust its types. You will learn why `as User` on a response is a lie, how to validate at the edge, how to model success and failure as data, and how to type PATCH payloads that cannot overwrite fields they should not touch.
difficulty: intermediate
minutes: 50
objectives:
  - Explain why a type assertion on parsed JSON gives no runtime safety, and where validation belongs instead
  - Implement a typed fetch wrapper that returns a discriminated `ApiResult<T>` instead of throwing untyped errors
  - Derive TypeScript types from a runtime schema so the type and the validator cannot drift apart
  - Design PATCH payload types with `Partial<Pick<T, K>>` and explain the gaps the type leaves for runtime code to close
  - Compare hand-written types, OpenAPI code generation, tRPC and GraphQL code generation for end-to-end safety
---

## Introduction

A frontend spends much of its life talking to servers. It sends `GET /api/users/42`, receives a string of JSON, turns that string into an object and renders it. Every one of those exchanges is a contract: the client assumes a user has a `name`, the server promises to send one. When the two sides disagree — the backend renames `name` to `fullName`, makes `email` nullable, or starts returning dates as numbers — the client does not find out at build time. It finds out in production, as `Cannot read properties of undefined`.

TypeScript cannot see across the network. The compiler checks your code, but the bytes that arrive from `fetch` were produced by another program, possibly deployed yesterday, possibly by another team. Whatever type you write for them is a *claim*, and nothing checks the claim unless you write code that does.

**Type-safe API design** is the set of techniques that make those claims trustworthy. It has three parts:

1. **Describe the contract in types** — request bodies, response bodies, path parameters and error shapes — so both the calling code and the implementing code are checked against one description.
2. **Validate at the boundary** — turn `unknown` data into typed data exactly once, at the point where it enters your program, with code that really inspects it.
3. **Model failure as data** — represent "it worked" and "it failed, and here is how" as a union the compiler makes you handle, rather than as exceptions of type `any`.

This lesson builds each part with runnable code. It ends with a nested topic that comes up constantly in real APIs and in interviews: typing partial updates (PATCH payloads) so a client can change a user's name but never their `id`.

## Before you start

- **Generics** — writing `function apiGet<T>(…): Promise<T>` and having `T` inferred. See [[b2-generics]].
- **Discriminated unions and narrowing** — a union of object types with a shared literal field, and `if (result.ok)` narrowing it. See [[b2-discriminated-unions]] and [[b2-narrowing]].
- **`unknown` versus `any`** — why `unknown` forces you to check before use. See [[b2-unknown]].
- **Type assertions** — what `x as T` does and does not do. See [[b2-type-assertions]].
- **`Pick`, `Partial` and `Omit`** — used in the PATCH section. See [[b2-pick]], [[b2-partial]] and [[b2-omit]].

## The intuition: a border with customs

Picture your application as a country. Inside the border, every value has been inspected and carries a correct label: this is a `User`, this is an `Order`. Code inside can rely on the labels, which is what makes TypeScript useful. Outside the border is everything you did not produce: HTTP responses, `localStorage`, URL query strings, messages from a WebSocket, files a user uploads.

A type-safe API puts **customs at the border**. Data arriving from outside is held as `unknown` until a validator checks it. If it passes, it enters with a trustworthy type; if it fails, it is rejected with a clear error *at the border*, not deep inside a component three function calls later.

Two consequences follow. First, validation happens **once**, at the edge, not in every function that touches the data. Inside the border you trust the types — that is the whole point. Second, a type assertion like `as User` is a forged stamp: it labels the data without inspecting it. The analogy has one limit worth stating: customs here only checks *shape* (fields and their types), not *meaning*. A validator can confirm that `email` is a string; whether that user is allowed to see this page is a separate authorisation question.

## Why `as User` is a lie

Here is the code most projects start with, and why it fails.

```typescript title="cast.ts"
type User = { id: string; name: string; email: string };

// Pretend this text came back from GET /api/users/42.
// The backend renamed `name` to `fullName` last week.
const body = '{"id":"42","fullName":"Ada Lovelace","email":"ada@example.com"}';

const user = JSON.parse(body) as User; // compiles: a cast is a promise, not a check
console.log(user.name);
console.log(user.name.toUpperCase());
```

```output
undefined
TypeError: Cannot read properties of undefined (reading 'toUpperCase')
```

`JSON.parse` returns `any`, and `as User` tells the compiler "trust me". The compiler does trust you: `user.name` has type `string` everywhere in the program. At runtime there is no `name` property, so the first `console.log` prints `undefined` and the second crashes. The same thing happens with `const user: User = await res.json()` — `res.json()` returns `Promise<any>`, and `any` is assignable to everything, so the annotation is an assertion in disguise.

The deeper problem is *where* the error appears. The cast happened in the data layer; the crash happens wherever `name` is first used as a string — perhaps in a component rendering an avatar. The stack trace points at innocent code, and nothing tells you the server changed. TypeScript's types are erased when the code is compiled to JavaScript (see [[b2-tsc-compilation]]), so there is no hidden runtime check to save you. If you want the shape checked, you must write — or generate — code that checks it.

> [!IMPORTANT] Parse, don't cast
> At a trust boundary, convert `unknown` into `T` with a function that inspects the value and either returns a correctly-typed result or fails loudly. A cast converts nothing; it only silences the compiler.

## Validating at the boundary

A **parser** (or validator) is a function of type `(input: unknown) => T` that throws or returns an error when the input does not have the expected shape. You can write one by hand, which is the clearest way to see what the libraries do for you.

```typescript title="parse.ts"
type User = { id: string; name: string; email: string };

function parseUser(input: unknown): User {
  if (typeof input !== "object" || input === null) {
    throw new Error("User: expected an object");
  }
  const o = input as Record<string, unknown>;
  for (const key of ["id", "name", "email"] as const) {
    if (typeof o[key] !== "string") {
      throw new Error(`User.${key}: expected string, got ${typeof o[key]}`);
    }
  }
  // Build a fresh object so unexpected extra fields never leak inward.
  return { id: o.id as string, name: o.name as string, email: o.email as string };
}

const good = '{"id":"42","name":"Ada","email":"ada@example.com","role":"admin"}';
const bad = '{"id":"42","fullName":"Ada Lovelace","email":"ada@example.com"}';

console.log(parseUser(JSON.parse(good)));
try {
  parseUser(JSON.parse(bad));
} catch (e) {
  console.log((e as Error).message);
}
```

```output
{ id: '42', name: 'Ada', email: 'ada@example.com' }
User.name: expected string, got undefined
```

Walk through what changed. The parameter is `unknown`, so the compiler refuses any property access until we have checked the value is an object. The cast to `Record<string, unknown>` is honest — every property of an object is, at worst, `unknown` — and it lets us read keys we have not yet verified. The loop checks each field and fails with a message that names the field, which is exactly the information you want in an error log. Finally, the function builds a *new* object containing only the three known fields, so the unexpected `role` does not travel into the app.

The two remaining `as string` casts are safe because the loop has just proved them, but the compiler cannot follow that proof through a loop over keys. That is the weakness of hand-written validators: the type and the checking code are two separate things that you keep in sync by hand. Add a field to `User`, forget the check, and you are back to lying.

### Deriving the type from a schema

Schema libraries such as Zod, Valibot and ArkType remove that duplication. You describe the shape once as a runtime value, and the library gives you both a validator and the TypeScript type inferred from it. With Zod 4:

```typescript title="user-schema.ts"
import { z } from "zod";

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  createdAt: z.string().transform((s) => new Date(s)),
});
type User = z.infer<typeof UserSchema>;
// { id: string; name: string; email: string; createdAt: Date }

const ok = UserSchema.safeParse({
  id: "1", name: "Ada", email: "ada@example.com",
  createdAt: "2024-05-01T10:00:00Z", role: "admin",
});
if (ok.success) {
  const user: User = ok.data;
  console.log(user.createdAt.getUTCFullYear(), Object.keys(user));
}

const bad = UserSchema.safeParse({ id: "2", fullName: "Grace", email: "g@example.com" });
if (!bad.success) {
  console.log(bad.error.issues.map((i) => `${i.path.join(".")}: ${i.code}`));
}
```

```output
2024 [ 'id', 'name', 'email', 'createdAt' ]
[ 'name: invalid_type', 'createdAt: invalid_type' ]
```

`z.infer<typeof UserSchema>` computes the type from the schema value, so the type cannot drift from the check — there is only one source of truth. Three behaviours in the output are worth noticing. The unknown `role` key was **stripped** (Zod's default for objects), mirroring the fresh-object trick in the hand-written parser. The failing input reports *every* problem with its path, not only the first. And `createdAt` arrived as a string but leaves as a `Date`: JSON has no date type, so a plain `createdAt: Date` annotation on a cast response is another quiet lie — the value is a string and `.getUTCFullYear()` would crash. A schema with a transform turns the wire format into the domain type at the border.

`safeParse` returns a discriminated union (`{ success: true, data }` or `{ success: false, error }`); `parse` returns the data or throws. Use `safeParse` where you want to handle failure as a value, which leads to the next section.

## Modelling failure as data

A `fetch` call can end in at least four different ways: a network failure with no response at all, an HTTP error status with an error body, a success status with a body of the wrong shape, and real success. Code that only does `await res.json()` and lets everything else throw collapses those into one `catch (e)` where `e` is `unknown`, and the calling component has no typed way to tell "not found" from "server is down".

A **result type** keeps the cases apart as data. It is a discriminated union whose `ok` field tells the compiler which branch you are in:

```typescript title="api-client.ts"
type User = { id: string; name: string; email: string };
type ApiError = { code: string; message: string };

type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: ApiError };

type Parser<T> = (input: unknown) => T;

function parseUser(input: unknown): User {
  const o = (typeof input === "object" && input !== null ? input : {}) as Record<
    string,
    unknown
  >;
  if (typeof o.id !== "string" || typeof o.name !== "string" ||
      typeof o.email !== "string") {
    throw new Error("response is not a User");
  }
  return { id: o.id, name: o.name, email: o.email };
}

function parseApiError(input: unknown): ApiError {
  const o = (input ?? {}) as Partial<Record<string, unknown>>;
  return typeof o.code === "string" && typeof o.message === "string"
    ? { code: o.code, message: o.message }
    : { code: "UNKNOWN", message: "Unrecognised error body" };
}

async function apiGet<T>(url: string, parse: Parser<T>): Promise<ApiResult<T>> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    // DNS failure, offline, CORS rejection: no HTTP status at all.
    return { ok: false, status: 0, error: { code: "NETWORK", message: "Request failed" } };
  }
  const json: unknown = await res.json().catch(() => undefined);
  if (!res.ok) {
    return { ok: false, status: res.status, error: parseApiError(json) };
  }
  try {
    return { ok: true, data: parse(json) };
  } catch (e) {
    return {
      ok: false,
      status: res.status,
      error: { code: "BAD_SHAPE", message: (e as Error).message },
    };
  }
}

// --- A fake server so the example runs without a network ---
const fakeDb: Record<string, unknown> = {
  "/api/users/1": { id: "1", name: "Ada", email: "ada@example.com" },
  "/api/users/2": { id: "2", fullName: "Grace Hopper", email: "grace@example.com" },
};
globalThis.fetch = (async (input: string | URL | Request) => {
  const body = fakeDb[String(input)];
  return body === undefined
    ? Response.json({ code: "NOT_FOUND", message: "No such user" }, { status: 404 })
    : Response.json(body);
}) as typeof fetch;

async function main() {
  for (const id of ["1", "2", "3"]) {
    const result = await apiGet(`/api/users/${id}`, parseUser);
    if (result.ok) {
      console.log("user:", result.data.name);
    } else {
      console.log(`failed (${result.status}):`, result.error.code, "-", result.error.message);
    }
  }
}
main();
```

```output
user: Ada
failed (200): BAD_SHAPE - response is not a User
failed (404): NOT_FOUND - No such user
```

The example ran on Node.js 22, which has `fetch` and `Response` built in; the fake `fetch` stands in for a server so the output is deterministic.

Follow one call. `apiGet("/api/users/2", parseUser)` infers `T = User` from the parser, so its return type is `Promise<ApiResult<User>>` without any angle brackets at the call site. The server answers `200`, so `res.ok` is true, but the parser rejects the body and the function returns the `BAD_SHAPE` branch. The caller cannot touch `result.data` until it has checked `result.ok`: inside `if (result.ok)` the type narrows to `{ ok: true; data: User }`, and in the `else` branch to the error variant. Forgetting the check is a compile error, not a production bug.

Notice also what the wrapper does with the error body. It does not cast it to `ApiError`; it parses it with a fallback, because a reverse proxy returning an HTML 502 page is entirely normal, and `json as ApiError` would hand the UI an object with no `message`. The `status: 0` convention for network failures lets callers distinguish "offline" from "the server said no".

> [!NOTE] Result types or exceptions?
> Throwing is still fine for truly unexpected failures. Result types shine where callers routinely branch on the outcome — showing "not found" versus "try again" in the UI. Many teams return results from the API layer and let data-fetching libraries such as TanStack Query turn them into loading, error and success states (see [[b2-remote-data-pattern]]).

## Typing the contract itself

Validation protects responses. The other half of the contract is what the client *sends*: URLs, path parameters, query strings and request bodies. Here types can catch mistakes before any request is made.

**Path parameters** are a classic source of bugs: `/users/:userId/posts/:postId` filled in with the IDs swapped, or a parameter forgotten. [[b2-template-literal-types]] let the compiler read the parameter names straight out of the pattern string:

```typescript title="routes.ts"
type PathParams<Path extends string> =
  Path extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof PathParams<`/${Rest}`>]: string }
    : Path extends `${string}:${infer Param}`
      ? { [K in Param]: string }
      : {};

function buildPath<P extends string>(pattern: P, params: PathParams<P>): string {
  return pattern.replace(/:(\w+)/g, (_, name: string) =>
    encodeURIComponent((params as Record<string, string>)[name]),
  );
}

console.log(buildPath("/users/:userId/posts/:postId", { userId: "7", postId: "a b" }));
console.log(buildPath("/health", {}));
buildPath("/users/:userId", { id: "7" });
```

```output
error TS2353: Object literal may only specify known properties, and 'id' does not exist in type '{ userId: string; }'.
```

With the last line removed, the program prints `/users/7/posts/a%20b` and `/health`. `PathParams` takes the text before the first `/` after a colon as one parameter name and recurses on the rest, so `"/users/:userId/posts/:postId"` becomes `{ userId: string; postId: string }`. The call site gets autocompletion for parameter names, and a typo is caught at compile time. The implementation still encodes each value with `encodeURIComponent`, because a type can say a value is a `string` but cannot make it URL-safe.

**Endpoint maps** take this further: one interface lists every route with its body and response types, and a single generic `request` function looks up both from the route key. That is what code generators and tRPC produce for you, as the next section shows.

**Branded IDs** close another gap. If `userId` and `orderId` are both `string`, nothing stops you passing one where the other belongs. A branded type such as `string & { readonly __brand: "UserId" }` makes them incompatible at compile time while staying a plain string at runtime; the technique is covered in [[b2-branded-types]].

## How it works internally: keeping both sides on one contract

Everything so far keeps the *client* honest about the shape it expects. It does not stop the server from changing. To catch drift *before* deploy, both sides must be checked against one shared description. There are three common ways to get that description.

| Approach | Source of truth | How the client gets types | Runtime validation |
|---|---|---|---|
| OpenAPI + code generation (`openapi-typescript`, `orval`) | An OpenAPI spec, written by hand or emitted by the server framework | A build step generates `.ts` types or a full client from the spec | Not by default; some generators also emit Zod schemas |
| tRPC | The TypeScript server code itself | The client imports the router's *type* (`import type`), so inference flows across the network | Each procedure validates its input with a schema |
| GraphQL + code generation (`graphql-codegen`) | The GraphQL schema plus each query document | Types generated per query, containing only the fields that query selects | The server validates queries against the schema |

The key trade-off is **who must use TypeScript**. tRPC gives the tightest loop — rename a field on the server and the client fails to compile in the same editor session — but only works when both ends are TypeScript and usually live in one repository. OpenAPI and GraphQL are language-neutral, so a Java or Go backend can publish a spec, and the price is a generation step that must run whenever the spec changes. Teams usually add a Continuous Integration (CI) check that regenerates the types and fails the build if the committed ones differ.

None of these remove the boundary rule completely. Generated types describe what the server *promises*; a client that talks to a server deployed at a different version can still receive something else. For high-value or third-party endpoints, validate responses even when types are generated, and log validation failures with the request ID so you see drift in monitoring rather than in bug reports. Track that failure rate separately from HTTP 4xx/5xx errors: a spike in shape errors with a normal error rate is the signature of an incompatible deploy.

## Pick + Partial Patch Payloads {#b2-pick-partial-patch}

A **PATCH payload** is the body of a request that changes *some* fields of an existing record — "set this user's email" — rather than replacing the whole record as `PUT` does. Typing it well means answering two questions: which fields may change at all, and which of those this particular request changes. The standard TypeScript answer combines two utility types: `Pick<T, K>` restricts the object to the fields that may change, and `Partial<…>` makes each of them optional.

```typescript
type UserPatch = Partial<Pick<User, "name" | "email">>;
// { name?: string; email?: string }
```

Read it inside out. `Pick<User, "name" | "email">` is `{ name: string; email: string }` — only the editable fields survive. `Partial` then marks each one optional, because a patch may send one, both or (as we will see) neither.

### Why not `Partial<User>`

The tempting shortcut is `Partial<User>`. It type-checks every legitimate patch, which is exactly why it is dangerous: it also accepts `{ id: "admin-1" }` and `{ createdAt: "1970-01-01" }`. Identity and audit fields are now "optional editable fields" as far as the compiler is concerned, and any code path that merges the body into the stored record can overwrite them. With `Partial<Pick<…>>`, a client that tries to send `id` is stopped:

```typescript title="patch-types.ts"
type User = { id: string; name: string; email: string; createdAt: string };

type LoosePatch = Partial<User>;
type UserPatch = Partial<Pick<User, "name" | "email">>;

const evil: LoosePatch = { id: "admin-1" };     // compiles: id is just optional now
const fine: UserPatch = { name: "Ada" };
const blocked: UserPatch = { id: "admin-1" };
```

```output
error TS2353: Object literal may only specify known properties, and 'id' does not exist in type 'Partial<Pick<User, "name" | "email">>'.
```

An equivalent formulation starts from the other end: `Partial<Omit<User, "id" | "createdAt">>`. `Pick` is an allow-list and `Omit` a deny-list. Prefer `Pick` for patch types — when someone adds a `passwordHash` field to `User`, an allow-list keeps it non-editable by default, while a deny-list silently makes it patchable. The pattern generalises to a reusable `type Patch<T, K extends keyof T> = Partial<Pick<T, K>>`, which [[b2-generic-pick-helper]] builds out.

### What the type does not guarantee

A patch type is a compile-time description of what *well-behaved* callers send. Three gaps remain, and each needs runtime code.

**Extra properties are only rejected on fresh literals.** The `TS2353` error above is an *excess property check*, which applies only when an object literal is written directly where the type is expected. Structural typing ([[b2-structural-typing]]) lets an object with *more* properties be assigned through a variable:

```typescript
const fromForm = { name: "Ada", id: "admin-1" };
const sneaky: UserPatch = fromForm;   // compiles; sneaky still carries id at runtime
```

And a request body from the network was never checked by the compiler at all. The server must therefore **reject or strip unknown keys** at runtime — exactly the boundary validation from earlier in this lesson.

**`undefined` is not "absent".** `Partial` makes `name?: string`, which (by default) also accepts `{ name: undefined }`. Merging such a patch with spread syntax *overwrites* the field:

```typescript title="merge.ts"
type User = { id: string; name: string; email: string; createdAt: string };
type UserPatch = Partial<Pick<User, "name" | "email">>;

const user: User = { id: "1", name: "Ada", email: "ada@x.io", createdAt: "2024-01-01" };
const clear: UserPatch = { name: undefined };
console.log({ ...user, ...clear });
console.log(JSON.stringify(clear));
```

```output
{
  id: '1',
  name: undefined,
  email: 'ada@x.io',
  createdAt: '2024-01-01'
}
{}
```

The merged user now violates its own type — `name` is `undefined` but typed `string`. Over the network the problem is hidden, because `JSON.stringify` drops `undefined` properties, so the body arrives as `{}`; in-process merges (a Redux reducer, a server that receives an already-parsed object) are where it bites. The compiler option `exactOptionalPropertyTypes` (see [[b2-strict-compiler-options]]) makes `{ name: undefined }` an error: an optional property may then be *missing* but not *present with `undefined`*. If a field genuinely needs a "clear this" value, model it explicitly as `null` in the domain type (`bio: string | null`), because JSON can carry `null` and cannot carry `undefined`.

**An empty patch type-checks.** `{}` is a valid `Partial<…>`. If a no-op update should be an error, express "at least one key" in the type and check it at runtime too:

```typescript
type AtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Omit<T, K>>;
}[keyof T];
```

This [[b2-mapped-types|mapped type]] builds one variant per key — "`name` required, the rest optional", "`email` required, the rest optional" — and the `[keyof T]` at the end turns the object of variants into their union. `{}` matches none of them.

### Worked example: a PATCH endpoint's body

The program below models the body of `PATCH /users/:id`. It combines an allow-list of editable keys, a nullable `bio`, "at least one change", and a required `version` number for **optimistic concurrency** — the client sends the version it last saw, and the server rejects the write if someone else changed the record in between. That last field shows that not every key in a patch is optional: `Pick<User, "version">` is intersected *without* `Partial`.

```typescript title="patch-endpoint.ts"
type User = {
  id: string;
  name: string;
  email: string;
  bio: string | null;   // null means "no bio"
  version: number;      // bumped on every write (optimistic concurrency)
  createdAt: string;
};

const EDITABLE = ["name", "email", "bio"] as const;
type EditableKey = (typeof EDITABLE)[number];        // "name" | "email" | "bio"

type AtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Omit<T, K>>;
}[keyof T];

// Body of PATCH /users/:id
type UserPatch = AtLeastOne<Pick<User, EditableKey>> & Pick<User, "version">;

function parseUserPatch(input: unknown): UserPatch {
  if (typeof input !== "object" || input === null) throw new Error("expected object");
  const o = input as Record<string, unknown>;
  const out: Partial<Pick<User, EditableKey>> = {};
  for (const key of Object.keys(o)) {
    if (key === "version") continue;
    if (!(EDITABLE as readonly string[]).includes(key)) {
      throw new Error(`field "${key}" cannot be patched`);
    }
  }
  if ("name" in o) {
    if (typeof o.name !== "string") throw new Error("name must be a string");
    out.name = o.name;
  }
  if ("email" in o) {
    if (typeof o.email !== "string") throw new Error("email must be a string");
    out.email = o.email;
  }
  if ("bio" in o) {
    if (o.bio !== null && typeof o.bio !== "string") throw new Error("bio: string|null");
    out.bio = o.bio;
  }
  if (Object.keys(out).length === 0) throw new Error("patch changes nothing");
  if (typeof o.version !== "number") throw new Error("version is required");
  return { ...out, version: o.version } as UserPatch;
}

function applyPatch(user: User, patch: UserPatch): User {
  if (patch.version !== user.version) throw new Error("409: stale version");
  const { version: _ignored, ...changes } = patch;
  return { ...user, ...changes, version: user.version + 1 };
}

let ada: User = {
  id: "1", name: "Ada", email: "ada@x.io", bio: "Analyst", version: 3,
  createdAt: "2024-01-01",
};

const requests = [
  '{"bio":null,"version":3}',
  '{"name":"Ada L.","version":4}',
  '{"id":"999","version":5}',
  '{"version":5}',
  '{"name":"Old tab","version":3}',
];
for (const raw of requests) {
  try {
    ada = applyPatch(ada, parseUserPatch(JSON.parse(raw)));
    console.log("ok  ", ada.name, ada.bio, "v" + ada.version);
  } catch (e) {
    console.log("fail", (e as Error).message);
  }
}
```

```output
ok   Ada null v4
ok   Ada L. null v5
fail field "id" cannot be patched
fail patch changes nothing
fail 409: stale version
```

Trace the five requests. The first clears `bio` with `null` — a legal value — and bumps the version to 4. The second renames the user using the new version. The third tries to set `id`; the type would have rejected it in TypeScript client code, and the runtime allow-list rejects it from any client. The fourth has a version but no change, which `AtLeastOne` forbids in the type and the length check forbids at runtime. The fifth comes from a browser tab that loaded the user at version 3, so the server refuses to overwrite newer data.

One cast remains: `as UserPatch` on the return. The checks above it establish the "at least one key" rule, but in a form (counting keys) the compiler cannot connect to the `AtLeastOne` union. That is the right place for a cast — immediately after the runtime code that justifies it, in the one function whose job is to create the type. With a schema library the same rules read `UserSchema.pick({ name: true, email: true, bio: true }).partial().strict()` plus a refinement for "at least one key"; `.strict()` makes Zod *reject* unknown keys such as `id` instead of silently stripping them, which is usually what you want on a write endpoint so clients learn about their mistake.

At the type level, statements to remember: `Partial<Pick<T, K>>` for "these fields, each optional"; `Required<Pick<T, K>>` or plain `Pick<T, K>` for fields every patch must carry; `Omit` before `Pick` only when the allow-list is easier to state as "everything except".

## In real systems

- **Frontend data layers** wrap `fetch` once (or configure a client such as `ky` or `axios`) so that every call takes a schema and returns a typed result. Components never see `unknown` or `any`.
- **Monorepos with a TypeScript backend** often use tRPC or share Zod schemas from a common package, so the server's input validation and the client's types come from one file.
- **Polyglot organisations** publish OpenAPI specs from Spring, FastAPI or ASP.NET services and generate TypeScript clients in CI. A failing type check after regeneration is the early warning that an endpoint changed incompatibly.
- **Tests** use Mock Service Worker (MSW) handlers typed against the same response types, so mocks cannot return shapes the real API never would.
- **Versioned APIs** sometimes include an `apiVersion` field in responses and model each version as a branch of a discriminated union, letting a client handle old and new shapes during a rollout.
- **Admin and settings screens** are built on PATCH endpoints whose body types are allow-listed `Partial<Pick<…>>` types, with the same allow-list enforced by the server's validator.

## Trade-offs and alternatives

Type-safe APIs buy fewer runtime field typos, safe refactoring when a contract changes (the compiler lists every call site to fix), and accurate autocompletion. The costs are real too. Schemas must be maintained; code generation adds a build step and generated files to review; runtime validation costs CPU on large responses (usually negligible next to the network, but measurable for multi-megabyte payloads); and over-strict validation can turn a harmless new field or enum value from the server into an outage. Validate the fields you use, strip unknown ones, and be deliberate about whether an unknown enum value should fail or fall back.

Alternatives sit on a spectrum. Runtime-only validation without TypeScript still protects production but gives no editor help. Protocol Buffers with gRPC generate typed stubs for both sides from a binary schema, which suits service-to-service traffic more than browsers. At the other end, a throwaway script calling a single endpoint does not need any of this — a cast and a quick `console.log` are fine when nobody depends on the result.

## Common mistakes

- **Casting the response.** `await res.json() as User` or `const user: User = await res.json()` compiles and checks nothing. Fix: parse with a validator at the boundary.
- **Marking optional backend fields as required.** If the server omits `avatarUrl` for new users, a type that says `avatarUrl: string` guarantees a crash. Fix: copy optionality from the real contract (or the generated types) and let the compiler force the `undefined` check.
- **Typing dates as `Date`.** JSON carries strings; the value is still a string unless something converts it. Fix: transform in the schema, or type it as `string` honestly.
- **Ignoring the error body.** `catch (e)` with `e` used as `any`, or `json as ApiError` on a 502 HTML page. Fix: model errors as a branch of a result union and parse error bodies with a fallback.
- **Using `Partial<User>` for updates.** It makes `id` and `createdAt` patchable. Fix: `Partial<Pick<User, EditableKeys>>`, plus a runtime allow-list.
- **Trusting excess-property errors as security.** They apply to object literals in TypeScript source, not to request bodies. Fix: strip or reject unknown keys on the server.
- **Spreading patches with `undefined` values.** `{ ...user, ...{ name: undefined } }` erases the name. Fix: enable `exactOptionalPropertyTypes`, use `null` for "clear", or skip `undefined` keys when merging.

## Interview perspective

**"Why isn't `await res.json() as User` enough?"** A strong answer says that types are erased at compile time, `res.json()` returns `any`, and the assertion only changes what the compiler believes. The real shape is whatever the server sent. Then name the fix — validate with a parser or schema at the boundary, and derive the type from the schema so the two cannot drift.

**"How do you type fetch errors?"** Describe a discriminated `ApiResult<T>` with `ok: true; data` and `ok: false; status; error`, explain the separate cases (network failure, HTTP error, bad shape) and show `if (result.ok)` narrowing. Mention that error bodies need parsing too.

**"How would you type a PATCH endpoint?"** Start with `Partial<Pick<User, "name" | "email">>` and explain why `Partial<User>` is wrong. Interviewers then probe the gaps: extra keys via variables or raw JSON (runtime allow-list), `undefined` versus absent (`exactOptionalPropertyTypes`, `null` for clearing), empty patches (`AtLeastOne`), and mandatory fields like a version number.

**"OpenAPI codegen or tRPC?"** tRPC infers client types from the server router with no spec, so there is no drift inside a TypeScript monorepo, but it couples both ends to TypeScript. OpenAPI is language-neutral and fits separate backend stacks, at the cost of a generation step and a spec that must be kept accurate.

A common follow-up is "where exactly do you validate?" The answer: once, where data enters — the API client on the frontend, the request handler on the backend — and nowhere else, because validating inside the typed core means you did not trust your own types.

## Practice

1. Take the `apiGet` wrapper and add `apiSend<TBody, TRes>(method, url, body, parse)` for POST and PATCH. Make the body parameter typed and the response parsed.
2. Extend `PathParams` so that an optional parameter written `:id?` becomes `{ id?: string }`.
3. Write a `parseApiError` that also accepts the shape `{ errors: [{ field, message }] }` used by a validation endpoint, returning a union of the two error kinds.
4. Write `Patch<T, K extends keyof T>` and use it to type `PATCH /orders/:id` where only `status` and `notes` are editable and `notes` can be cleared with `null`.
5. Turn on `exactOptionalPropertyTypes` in a small project and find every place where it reports an error. For each one, decide whether the `undefined` was intentional.

```quiz
Q: A response is handled with `const user = (await res.json()) as User`. The server omits `name`. What happens?
- [ ] The cast throws a `TypeError` immediately because `name` is missing
- [ ] The compiler reports an error because `res.json()` may not match `User`
- [x] Nothing happens at the cast; `user.name` is `undefined` at runtime while typed as `string`
- [ ] TypeScript fills `name` with an empty string
> Type assertions are erased during compilation, and `res.json()` returns `Promise<any>`, so the compiler has nothing to complain about and no runtime check exists. The failure appears later, wherever `name` is first used as a string.
```

```quiz
Q: Why is `Partial<Pick<User, "name" | "email">>` preferred over `Partial<User>` for a PATCH body?
- [ ] `Partial<User>` cannot be used with object spread
- [x] `Partial<User>` makes every field, including `id` and `createdAt`, an optional editable field
- [ ] `Pick` validates the request body at runtime
- [ ] `Partial<User>` forces every field to be sent
> `Partial` only changes optionality, so `Partial<User>` still contains `id`. `Pick` keeps only the editable keys. Neither type does anything at runtime — the server still needs an allow-list — which is why the third option is wrong.
```

```quiz
Q: `const body = { name: "Ada", id: "1" }; const p: UserPatch = body;` where `UserPatch = Partial<Pick<User, "name">>`. Does it compile?
- [ ] No, excess property checking rejects `id`
- [x] Yes, because excess property checks only apply to fresh object literals
- [ ] Only with `exactOptionalPropertyTypes` enabled
- [ ] No, because `id` is a required property of `User`
> Assigning through a variable uses ordinary structural assignability: `body` has a compatible `name`, and extra properties are allowed. The value still carries `id` at runtime, which is why the server must strip or reject unknown keys.
```

## Quick revision {#quick-revision}

- Types are erased; JSON from the network is `unknown` no matter what you annotate.
- Parse, don't cast: `(input: unknown) => T` validators at the boundary, typed core inside.
- Schema libraries (Zod `z.infer<typeof Schema>`) give one source of truth for the type and the check; transforms turn date strings into `Date`.
- `ApiResult<T> = { ok: true; data: T } | { ok: false; status; error }`; separate network failure, HTTP error and bad shape.
- Parse error bodies too; proxies return HTML.
- Template literal types can extract path params: `"/users/:id"` → `{ id: string }`.
- End-to-end contracts: OpenAPI codegen (language-neutral), tRPC (TS on both ends, no spec), GraphQL codegen (per-query types).
- PATCH body: `Partial<Pick<T, EditableKeys>>`; never `Partial<T>`; `Pick` is an allow-list, `Omit` a deny-list.
- Gaps: extra keys pass through variables and raw JSON; `{ k: undefined }` overwrites on spread (`exactOptionalPropertyTypes` stops it); `{}` is a valid Partial (`AtLeastOne<T>`); use `null` to mean "clear".
- Mandatory patch fields (`version`) go outside `Partial`: `Partial<Pick<…>> & Pick<T, "version">`.

## Key takeaways {#key-takeaways}

- A TypeScript type on network data is a claim; only runtime code turns it into a fact.
- Validate once where data enters, derive types from the validator, and trust the types everywhere inside.
- Represent API outcomes as a discriminated result union so callers must handle failure, and keep the failure kinds distinct.
- Share one contract between client and server — generated from OpenAPI or GraphQL, or inferred with tRPC — to catch drift at build time.
- Type PATCH payloads with `Partial<Pick<T, K>>` over an explicit allow-list, and enforce the same allow-list on the server.
- `Partial` cannot express "absent versus `undefined`" or "at least one field"; use `exactOptionalPropertyTypes`, `null` and `AtLeastOne` when those matter.
