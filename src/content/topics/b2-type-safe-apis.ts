import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Type-safe APIs encode request/response contracts, route params, query strings, and error shapes in TypeScript so callers and implementations agree at compile time. Patterns include typed fetch wrappers, discriminated results, branded IDs, and schema validation at boundaries with inferred types.',
  whyExists:
    'Untyped REST and JSON boundaries are the #1 source of frontend production bugs — wrong field names, missing null checks, drift from backend. Type-safe APIs catch mismatches before deploy and improve autocomplete for consumers.',
  mentalModel:
    'Draw a fence at the network boundary. Outside is unknown — validate once. Inside is typed — trust the types. Shared types (OpenAPI, tRPC, GraphQL codegen) keep both sides on one contract.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Define DTO interfaces or Zod schemas; infer types with z.infer<typeof Schema>.',
        'Wrap fetch: api.get<User>(`/users/${id}`) returns Promise<Result<User, ApiError>>.',
        'Path params typed via template literal routes or router generics.',
        'Discriminated union for success/error — never throw untyped any.',
        'End-to-end: tRPC, GraphQL codegen, openapi-typescript for zero drift.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Boundary rule',
      text: 'Parse, don\'t cast — JSON.parse as User is a lie. Use Zod/Valibot at the edge; internal code stays typed.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'typescript',
      caption: 'Typed client with discriminated result',
      code: `type ApiError = { code: string; message: string };

type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: ApiError };

async function apiGet<T>(
  path: string,
  schema: { parse: (u: unknown) => T }
): Promise<ApiResult<T>> {
  const res = await fetch(path);
  const json: unknown = await res.json();
  if (!res.ok) {
    return { ok: false, status: res.status, error: json as ApiError };
  }
  try {
    return { ok: true, data: schema.parse(json) };
  } catch {
    return { ok: false, status: res.status, error: { code: 'PARSE', message: 'Invalid shape' } };
  }
}`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Route-typed paths (pattern)',
      code: `const routes = {
  user: (id: string) => \`/api/users/\${id}\`,
  posts: (userId: string) => \`/api/users/\${userId}/posts\`,
} as const;

type User = { id: string; name: string };

async function loadUser(id: string): Promise<User | null> {
  const result = await apiGet(routes.user(id), UserSchema);
  return result.ok ? result.data : null;
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'OpenAPI → typescript types; optional runtime validators via openapi-zod-client.',
        'tRPC: router procedures infer input/output — no manual fetch typing.',
        'GraphQL: typed documents with graphql-codegen.',
        'MSW handlers typed against same interfaces for tests.',
        'Versioned API: union on apiVersion field for backward compatible types.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Fewer runtime field typos',
      'Refactor-safe client when schema changes',
      'Better DX with autocomplete',
    ],
    disadvantages: [
      'Schema maintenance cost',
      'Codegen pipeline complexity',
      'Types can lie if validation skipped',
    ],
    alternatives: ['Runtime-only validation without TS', 'Protobuf/gRPC with generated stubs'],
    whenToUse: ['Any HTTP/JSON boundary, design systems consuming CMS typed content'],
    whenNotToUse: ['Throwaway scripts — overhead not worth it'],
  },
  failureModes: [
    'Casting fetch json as T without parse — types diverge from reality.',
    'Optional backend fields marked required — undefined at runtime.',
    'Date fields stay strings if not transformed in schema.',
    'Error response shape not modeled — catch blocks use any.',
  ],
  production: {
    reliability: ['Validate all external JSON; log parse failures with request id'],
    maintainability: ['Single schema source; CI diff OpenAPI vs generated types'],
    observability: ['Track API parse error rate separately from HTTP 4xx/5xx'],
    security: ['Typed auth headers; never string-concat secrets into URLs'],
  },
  interview: {
    expectations: [
      'Describe boundary validation pattern',
      'Typed result union vs throwing',
      'Mention codegen or tRPC for E2E safety',
    ],
    commonQuestions: ['How type fetch responses?', 'tRPC vs REST typing?', 'Where validate JSON?'],
    followUps: ['Handle API versioning in types?', 'MSW for typed mocks?'],
    misconceptions: ['TypeScript validates JSON at runtime'],
    traps: ['as User on parse — no runtime check'],
    strongSignals: ['Parse don\'t cast, discriminated ApiResult, Zod infer, openapi/tRPC mention'],
  },
  keyTakeaways: [
    'Validate at network boundary; typed core inside.',
    'Discriminated result types for success/error.',
    'Shared schema/codegen prevents drift.',
    'Never trust JSON without runtime parse.',
    'Branded IDs and DTO utilities layer public shapes.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why isn\'t `await res.json() as User` enough?',
      answerHint: 'Casts don\'t validate — runtime shape may differ; use schema parse.',
    },
    {
      level: 'intermediate',
      question: 'How model fetch errors type-safely?',
      answerHint: 'Discriminated union ok/data vs ok/error with status and error shape.',
    },
    {
      level: 'advanced',
      question: 'Compare openapi-typescript vs tRPC for type safety.',
      answerHint: 'OpenAPI generates client types from spec; tRPC infers from server router — no separate spec drift.',
    },
  ],
  flashcards: [
    { front: 'Parse don\'t cast', back: 'Validate unknown JSON before treating as T' },
    { front: 'ApiResult<T>', back: 'Discriminated ok/data | ok/error union' },
    { front: 'Boundary', back: 'Where unknown becomes typed — once' },
    { front: 'z.infer', back: 'Type from Zod schema — single source' },
  ],
  quickRevision: [
    'Unknown at boundary',
    'Zod parse + infer',
    'ApiResult discriminated union',
    'Codegen/tRPC for E2E',
    'DTO Omit for public fields',
    'Never as User on JSON',
  ],
}
