import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Role-Based Access Control (RBAC) assigns permissions to roles, roles to users. Authorization checks whether user roles include permission for action on resource. Variants: flat roles (ADMIN, USER), hierarchical roles (MANAGER inherits USER), and permission strings (orders:read). Spring Security: GrantedAuthority, @PreAuthorize, method security.',
  whyExists:
    'Hard-coding user id checks does not scale. RBAC centralizes policy: add role once, many users inherit. Auditors understand role matrices. Supports least privilege and separation of duties (e.g., approver vs creator).',
  mentalModel:
    'Users wear hats (roles). Each hat unlocks doors (permissions). API asks: does any of this user hats include orders:delete? Enforce on server for every endpoint — UI hiding buttons is not security.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Concept', 'Example', 'Spring'],
      rows: [
        ['Role', 'ROLE_ADMIN, ROLE_SUPPORT', 'hasRole("ADMIN")'],
        ['Permission/Authority', 'orders:write, users:read', 'hasAuthority("orders:write")'],
        ['Role hierarchy', 'ADMIN > MANAGER > USER', 'RoleHierarchy bean'],
        ['Resource-based', 'Owner can edit own order', 'Custom PermissionEvaluator'],
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Method-level authorization',
      code: `@PreAuthorize("hasAuthority('orders:read')")
@GetMapping("/orders/{id}")
Order getOrder(@PathVariable Long id) { ... }

@PreAuthorize("hasRole('ADMIN') or @orderAuth.isOwner(#id, authentication)")
@DeleteMapping("/orders/{id}")
void deleteOrder(@PathVariable Long id) { ... }`,
    },
    {
      type: 'mermaid',
      caption: 'RBAC check flow',
      diagram: `flowchart LR
  U[User] --> R[Roles]
  R --> P[Permissions]
  P --> A{Allowed action?}
  A -->|yes| OK[Execute handler]
  A -->|no| DENY[403 Forbidden]`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Support role: tickets:read, tickets:update — no refunds:approve. Admin inherits support + users:manage. JWT contains scope or roles claim; API maps to GrantedAuthority list in JwtAuthenticationConverter.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'RBAC vs ABAC: RBAC groups permissions in roles; ABAC uses attributes (department, clearance, resource tags)',
        'Spring SecurityFilterChain runs before @PreAuthorize AOP',
        'Default deny — explicit permit rules for public endpoints',
        'Multi-tenant: scope roles per tenant_id to prevent cross-tenant role bleed',
        'Audit log: who granted role changes',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Simple mental model', 'Easy audit matrix', 'Central policy changes'],
    disadvantages: ['Role explosion in complex orgs', 'Coarse unless split into permissions', 'Static roles miss context (owner, time)'],
    alternatives: ['ABAC / policy engines (OPA, Cedar)', 'ACL per resource', 'Scope-based OAuth'],
    whenToUse: ['Enterprise apps with stable job functions', 'Admin consoles', 'Internal tools'],
    whenNotToUse: ['Fine-grained dynamic policies alone — combine with ABAC or resource checks'],
  },
  failureModes: [
    'Client-side only role checks',
    'Forgotten @PreAuthorize on new endpoint',
    'ROLE_ prefix confusion in Spring hasRole vs hasAuthority',
    'Global admin role overused — blast radius',
    'JWT roles stale until token refresh after demotion',
  ],
  production: {
    security: ['Server-side enforcement every mutating path', 'Integration tests per role matrix row'],
    maintainability: ['Permission catalog documented', 'Role assignment workflow with approval'],
    observability: ['Log authZ denials with user, role, resource, action'],
    reliability: ['Propagate role changes — shorten token TTL or force re-auth on privilege change'],
  },
  interview: {
    expectations: ['RBAC model', 'Spring @PreAuthorize', 'RBAC vs ABAC', 'IDOR beyond roles'],
    commonQuestions: ['Design roles for e-commerce admin?', 'Enforce in microservices?'],
    followUps: ['Role hierarchy pitfalls?', 'OAuth scopes vs app RBAC?'],
    misconceptions: ['Roles in JWT enough without server check', 'RBAC replaces resource ownership checks'],
    traps: ['Only checking authentication not authorization'],
    strongSignals: ['Permission granularity, default deny, owner checks, audit role changes'],
  },
  keyTakeaways: [
    'Roles aggregate permissions; users get roles.',
    'Enforce authorization server-side on every request.',
    'Combine RBAC with resource ownership for IDOR prevention.',
    'Spring: GrantedAuthority, @PreAuthorize, RoleHierarchy.',
    'Short token TTL or revocation when roles change.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is RBAC?', answerHint: 'Access based on roles assigned to users; roles hold permissions.' },
    { level: 'intermediate', question: 'RBAC vs ABAC?', answerHint: 'RBAC: role-permission matrix; ABAC: policies on attributes (user dept, resource sensitivity, time).' },
    { level: 'advanced', question: 'User owns order but lacks admin — how authorize delete?', answerHint: 'Resource-based rule: owner OR admin; custom PermissionEvaluator; still deny cross-user IDOR.' },
  ],
  flashcards: [
    { front: 'RBAC', back: 'Users → roles → permissions' },
    { front: '@PreAuthorize', back: 'Spring method security — runs after authentication' },
    { front: 'Default deny', back: 'Block unless explicitly permitted' },
    { front: 'Role explosion', back: 'Too many fine roles — consider permissions or ABAC' },
  ],
  quickRevision: ['Users→roles→perms', 'Server enforce', '@PreAuthorize', 'Owner + role', 'Audit changes'],
}
