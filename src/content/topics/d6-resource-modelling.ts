import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Resource modelling maps domain entities to REST (or RPC) resources — nouns, URIs, representations, and relationships. Good models expose consistent collections (/orders), singletons (/orders/42), sub-resources (/orders/42/items), and use IDs stable across versions.',
  whyExists:
    'Poor modelling confuses API consumers: verbs in URLs, ambiguous nesting, duplicate endpoints for same entity. Clear resources enable predictable CRUD, caching, authorization scopes, and OpenAPI documentation aligned with domain language.',
  mentalModel:
    'Identify aggregates (order + line items), pick canonical resource names (plural nouns), decide embed vs link (/orders/42/items vs /order-items?order_id=). URLs identify WHAT; HTTP methods HOW. Keep resource graph shallow where possible.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Pattern', 'URI', 'When'],
      rows: [
        ['Collection', 'GET /v1/products', 'List/create (POST) collection'],
        ['Singleton', 'GET /v1/products/{id}', 'Read/update/delete one'],
        ['Sub-resource', 'GET /v1/orders/{id}/items', 'Strong parent ownership'],
        ['Action (RPC lean)', 'POST /v1/orders/{id}/cancel', 'State transition not CRUD mappable'],
        ['Relationship', 'POST /v1/users/{id}/roles/{roleId}', 'Link existing resources'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Resource relationship graph',
      diagram: `flowchart TB
  Users[/users/]
  Orders[/orders/]
  Items[/orders/{id}/items/]
  Products[/products/]
  Users -->|places| Orders
  Orders --> Items
  Items -->|references| Products`,
    },
    {
      type: 'list',
      items: [
        'Use plural nouns consistently: /users not /user',
        'IDs opaque (UUID) vs sequential — security vs simplicity tradeoff',
        'Hypermedia links optional: { "self": "/v1/orders/42" }',
        'Avoid deep nesting >2 levels — flatten to top-level with filter',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'E-commerce resource sketch',
      code: `GET    /v1/customers/{customerId}
GET    /v1/customers/{customerId}/orders
POST   /v1/customers/{customerId}/orders
GET    /v1/orders/{orderId}
POST   /v1/orders/{orderId}/cancel    # action when state machine
GET    /v1/products/{productId}`,
    },
  ],
  tradeoffs: {
    advantages: ['Predictable API surface', 'Clear authz per resource', 'Cache-friendly GET URLs'],
    disadvantages: ['RPC-heavy domains awkward as pure REST', 'Over-nesting complicates URLs'],
    alternatives: ['GraphQL single endpoint schema', 'gRPC proto messages'],
    whenToUse: ['Public HTTP APIs', 'CRUD-heavy domains', 'Partner integrations'],
    whenNotToUse: ['Internal high-performance mesh preferring proto'],
  },
  failureModes: [
    'Two URLs same resource → cache/auth confusion',
    'Leaking internal DB joins as nested mess',
    'Verb URLs (/getOrder) breaking HTTP semantics',
    'Inconsistent pluralization across teams',
  ],
  production: {
    maintainability: ['OpenAPI as contract source', 'Naming guide in repo'],
    security: ['Authz check on every resource id access', 'No enumerable ids for private data without auth'],
    observability: ['Per-resource metrics paths normalized'],
    scalability: ['Resource ids shard-friendly (UUID)'],
  },
  interview: {
    expectations: ['Design URLs for domain', 'Sub-resource vs query param', 'When RPC action OK'],
    commonQuestions: ['Model comments on posts?', 'Cancel booking URL?'],
    followUps: ['Bulk operations resource?', 'File upload modelling?'],
    misconceptions: ['REST forbids any actions', 'Resources must mirror DB tables exactly'],
    traps: ['Deep nest /users/1/orders/2/items/3/shipments/4'],
    strongSignals: ['Consistent plural nouns', 'Actions for state transitions', 'OpenAPI examples'],
  },
  keyTakeaways: [
    'Resources are nouns; methods are verbs.',
    'Collections vs singletons; shallow nesting.',
    'Sub-resources for strong composition; query params for filters.',
    'RPC actions sparingly for state transitions.',
    'Align URLs with domain language and auth boundaries.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Good REST resource name?', answerHint: 'Plural nouns: /orders, /products — not verbs.' },
    { level: 'intermediate', question: '/posts/{id}/comments vs /comments?postId=?', answerHint: 'Pick one style; nested shows ownership; top-level + filter scales for many comments.' },
    { level: 'advanced', question: 'Model shared cart across guest and user?', answerHint: '/carts/{cartId} resource; merge on login action; stable cart id cookie/token.' },
  ],
  flashcards: [
    { front: 'Collection URI', back: 'Plural noun e.g. GET /v1/invoices' },
    { front: 'RPC action exception', back: 'POST /orders/{id}/cancel for state transition' },
    { front: 'Nesting guideline', back: 'Max ~2 levels; else flatten with query filter' },
    { front: 'Resource vs DB table', back: 'Model domain aggregates not 1:1 every table' },
  ],
  quickRevision: [
    'Nouns plural',
    'Shallow nest',
    'Actions for states',
    'UUID ids',
    'OpenAPI contract',
  ],
  systemDesign: {
    problem: 'Model REST resources for a project management SaaS (workspaces, projects, tasks, assignees, comments).',
    requirements: {
      functional: ['CRUD tasks', 'Assign user', 'Comment thread', 'Multi-tenant workspaces'],
      nonFunctional: ['Clear partner API', 'Authz per workspace', 'Versioned /v1/'],
    },
    scaleAssumptions: ['10k workspaces', 'API partners integrate'],
    capacityEstimates: ['Standard REST scaling — model clarity primary'],
    api: [
      {
        type: 'code',
        language: 'http',
        code: `GET  /v1/workspaces/{wsId}/projects
GET  /v1/projects/{projectId}/tasks
POST /v1/projects/{projectId}/tasks
GET  /v1/tasks/{taskId}
POST /v1/tasks/{taskId}/assignments
GET  /v1/tasks/{taskId}/comments
POST /v1/tasks/{taskId}/comments`,
      },
    ],
    dataModel: [{ type: 'list', items: ['Workspace scopes all ids in authz', 'Task embeds projectId link in representation'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'Gateway validates workspace membership on every resource id lookup.' }],
    diagram: {
      mermaid: `flowchart TB
  WS[workspace] --> PR[project]
  PR --> TA[task]
  TA --> CO[comment]
  TA --> AS[assignment → user]`,
      caption: 'Aggregate ownership for authz',
    },
    dataFlow: ['Client navigates workspace → project → task', 'Comments sub-resource of task'],
    storage: ['Relational backend matching aggregates'],
    caching: ['ETag on task GET'],
    asyncProcessing: ['Webhook on task.completed'],
    scaling: ['Standard horizontal API'],
    consistency: ['Strong on task updates'],
    reliability: ['Idempotent POST assignments'],
    failureScenarios: ['Cross-workspace id guess → 404 not 403 leak'],
    security: ['Workspace in authz middleware'],
    observability: ['Per-resource request metrics'],
    bottlenecks: ['List all tasks — pagination required'],
    alternatives: ['GraphQL for flexible mobile client'],
    tradeoffs: ['Nested URLs long vs flat with filters'],
    interviewFollowUps: ['Bulk move tasks between projects?'],
    evolution: [
      { stage: '1. Simple design', description: 'Flat /tasks only.', bottleneck: 'Authz unclear.' },
      { stage: '2. Improve', description: 'Workspace scoped paths.', bottleneck: 'Deep URLs.' },
      { stage: '3. Improve', description: 'Hybrid flat ids + workspace header.', bottleneck: 'Client confusion — document one style.' },
      { stage: '4. Scale further', description: 'OpenAPI + SDK generation.', bottleneck: 'Breaking changes — version.' },
    ],
  },
}
