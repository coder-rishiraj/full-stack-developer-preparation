import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Authentication vs authorization: authentication (AuthN) verifies identity—who you are. Authorization (AuthZ) verifies permissions—what you may do. Login proves AuthN; checking role or scope before delete is AuthZ. Confusing them causes 401 vs 403 bugs and security holes.',
  whyExists:
    'Every secured system needs both steps. APIs return 401 when credentials missing/invalid; 403 when identity known but action forbidden. Spring Security, OAuth2, and JWT flows separate these concerns.',
  mentalModel:
    'Building badge (AuthN) vs room access list (AuthZ). Badge proves identity; list decides which doors open.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'AuthN: passwords, MFA, JWT signature validation, session cookie, mTLS client cert.',
        'AuthZ: RBAC roles, ABAC attributes, OAuth scopes, resource ownership checks.',
        'Order: authenticate first, authorize per endpoint/resource.',
        '401 Unauthorized: not authenticated or bad token.',
        '403 Forbidden: authenticated but insufficient permission.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Request flow',
      diagram: `sequenceDiagram
  participant Client
  participant API
  participant AuthZ as AuthZ service
  Client->>API: Request + credentials
  API->>API: AuthN validate identity
  alt invalid
    API-->>Client: 401
  else valid
    API->>AuthZ: Check permission for resource
    alt denied
      API-->>Client: 403
    else allowed
      API-->>Client: 200 + data
    end
  end`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'User logs in (AuthN) → receives JWT. DELETE /invoices/99 validates JWT (AuthN) then checks invoice.owner == sub (AuthZ). Wrong password → 401; owns invoice but lacks invoices:delete scope → 403.',
    },
  ],
  tradeoffs: {
    advantages: ['Clear separation of concerns', 'Standard HTTP semantics', 'Composable middleware filters'],
    disadvantages: ['Easy to check only AuthN', 'Scope explosion in large systems', '403 vs 404 information leak debate'],
    alternatives: ['Central policy engine (OPA)', 'Graph-based AuthZ'],
    whenToUse: ['Every protected API', 'Multi-tenant SaaS'],
    whenNotToUse: ['Public read-only assets need neither for GET'],
  },
  failureModes: [
    'AuthN OK but no per-resource AuthZ (IDOR).',
    'Return 401 when should be 403 confuses clients.',
    'Roles in JWT without server-side revalidation.',
  ],
  production: {
    security: ['AuthZ on every mutating endpoint', 'Least privilege scopes', 'Revalidate tenant on each request'],
    reliability: ['Fail closed on AuthN errors', 'Cache AuthZ decisions with TTL carefully'],
    observability: ['Separate 401 vs 403 metrics', 'Audit denied access'],
    maintainability: ['Central @PreAuthorize or policy layer', 'Document scope matrix'],
    performance: ['JWT local validation fast AuthN', 'AuthZ cache with invalidation on role change'],
    scalability: ['Stateless JWT AuthN scales horizontally'],
    cost: ['Managed IdP vs self-hosted tradeoff'],
  },
  interview: {
    expectations: ['401 vs 403', 'AuthN before AuthZ', 'Resource ownership check'],
    commonQuestions: ['Authentication vs authorization?', 'Where check roles in Spring?'],
    followUps: ['IDOR prevention?', 'Hide existence with 404?'],
    misconceptions: ['JWT alone is AuthZ', 'Login enough for delete any id'],
    traps: ['Trust client-sent userId field', 'Admin role in token never revoked'],
    strongSignals: ['Mentions scope + resource check', '403 vs 401 precise'],
  },
  keyTakeaways: [
    'AuthN = identity; AuthZ = permission.',
    '401 unauthenticated; 403 authenticated forbidden.',
    'Always AuthZ per resource id not only role.',
    'JWT validates AuthN; scopes/roles feed AuthZ.',
    'IDOR is missing AuthZ on object access.',
  ],
  interviewQuestions: [
    { level: 'basic', question: '401 vs 403?', answerHint: '401 not authenticated; 403 authenticated but not allowed.' },
    { level: 'intermediate', question: 'Prevent IDOR on GET /users/{id}?', answerHint: 'AuthN token then AuthZ verify requester can access that user id.' },
    { level: 'advanced', question: '403 vs 404 for unauthorized resource?', answerHint: '403 reveals existence; some APIs return 404 to avoid leaking resource presence.' },
  ],
  flashcards: [
    { front: 'AuthN meaning', back: 'Who you are—identity verification.' },
    { front: '403 HTTP meaning', back: 'Authenticated but not authorized for action.' },
  ],
  quickRevision: [
    'AuthN then AuthZ',
    '401 vs 403',
    'Per-resource checks',
    'JWT = AuthN mostly',
    'Scopes/roles = AuthZ input',
    'IDOR = AuthZ gap',
    'Fail closed',
  ],
}
