import type { TopicContent } from '@/domain/types'

export const paginationContent: TopicContent = {
  whatIsIt:
    'Pagination splits large result sets into pages — in Spring Data use Pageable (page, size, sort) with Page<T> return type; exposed via request params page/size/sort and returned as JSON with content, totalElements, totalPages metadata.',
  whyExists:
    'Unbounded SELECT * returns millions of rows — memory exhaustion, slow responses, poor UX. Pagination caps payload size, enables stable UI navigation, and lets DB use LIMIT/OFFSET or keyset strategies efficiently.',
  mentalModel:
    'Client sends ?page=0&size=20&sort=createdAt,desc → Spring resolves Pageable → repository.findAll(pageable) → SQL LIMIT 20 OFFSET 0 → Page wraps List + total count query → serialize to JSON with Spring Data PageImpl structure or custom DTO.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Spring Data JPA: Page<User> findByStatus(String status, Pageable pageable).',
        'Controller: Pageable param auto-resolved from page, size, sort query params.',
        'PageableDefault(size=20) when client omits params.',
        'Sort: sort=field,dir or multiple sort params.',
        'Count query: Spring Data runs separate COUNT for totalElements (watch perf on huge tables).',
      ],
    },
    {
      type: 'table',
      headers: ['Strategy', 'SQL pattern', 'Tradeoff'],
      rows: [
        ['Offset (default)', 'LIMIT n OFFSET m', 'Slow deep pages — scans skipped rows'],
        ['Keyset / seek', 'WHERE id > :cursor LIMIT n', 'Stable for infinite scroll; no skip cost'],
        ['Cursor opaque token', 'Encoded sort keys', 'API hides internal sort columns'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Client["?page=2&size=20"] --> Ctrl[Controller Pageable]
  Ctrl --> Repo[JpaRepository]
  Repo --> Q1["SELECT ... LIMIT OFFSET"]
  Repo --> Q2["SELECT COUNT(*)"]
  Q1 --> Page[Page T]
  Q2 --> Page
  Page --> JSON[JSON response]`,
    caption: 'Pageable drives data + count queries',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Controller + repository pagination',
      code: `@GetMapping("/users")
public Page<UserResponse> listUsers(
    @RequestParam(required = false) String status,
    @PageableDefault(size = 20, sort = "createdAt", direction = DESC)
    Pageable pageable) {
  return userService.findByStatus(status, pageable)
      .map(UserResponse::from);
}

public interface UserRepository extends JpaRepository<User, Long> {
  Page<User> findByStatus(String status, Pageable pageable);
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Custom page response DTO (stable API)',
      code: `public record PagedResponse<T>(
    List<T> items,
    int page,
    int size,
    long totalItems,
    int totalPages
) {
  public static <E> PagedResponse<E> from(Page<E> page) {
    return new PagedResponse<>(
        page.getContent(), page.getNumber(), page.getSize(),
        page.getTotalElements(), page.getTotalPages());
  }
}`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Keyset pagination (manual)',
      code: `SELECT id, name, created_at
FROM users
WHERE created_at < :cursorCreatedAt
   OR (created_at = :cursorCreatedAt AND id < :cursorId)
ORDER BY created_at DESC, id DESC
LIMIT 20;`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'PageableHandlerMethodArgumentResolver binds query params.',
        'PageImpl serializes via Jackson — spring.data.web.pageable.default-page-size config.',
        'Slice<T> — no count query, hasNext only — better for infinite feeds.',
        'max-page-size property caps abuse (spring.data.web.pageable.max-page-size).',
        'Native queries: countQuery attribute on @Query for custom COUNT.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Standard Spring Data integration',
      'Rich metadata for UI page controls',
      'Sortable columns declaratively',
    ],
    disadvantages: [
      'OFFSET pagination degrades on deep pages',
      'COUNT(*) expensive on large filtered sets',
    ],
    alternatives: [
      'Keyset/cursor pagination for feeds',
      'Slice without total count',
      'GraphQL relay cursors',
    ],
    whenToUse: [
      'Admin tables with page numbers',
      'Moderate-size datasets with offset OK',
    ],
    whenNotToUse: [
      'Real-time infinite scroll at scale — keyset',
      'Export all rows — streaming/job not pagination API',
    ],
  },
  failureModes: [
    'No max page size — client requests size=1000000.',
    'Sort on unindexed column — slow sort + offset.',
    'Exposing internal Page JSON breaking API when upgrading Spring Data.',
    'N+1 on Page content when mapping to DTO with lazy fields.',
    'Off-by-one: page 0-based vs 1-based client assumption.',
  ],
  production: {
    performance: [
      'Index columns in sort and filter',
      'Consider Slice or keyset for large tables',
      'Cache count approximately if exact total not needed',
    ],
    security: ['Cap page size; validate sort fields whitelist — SQL injection via sort'],
  },
  interview: {
    expectations: [
      'Pageable and Page in Spring Data',
      'Offset vs keyset tradeoffs',
      'COUNT query cost',
    ],
    commonQuestions: [
      'Implement pagination in Spring Boot?',
      'Why offset slow for page 10000?',
      'Page vs Slice?',
    ],
    followUps: [
      'Keyset pagination design?',
      'Secure sort parameter?',
    ],
    misconceptions: [
      'Pagination always includes total count for free',
      'page=1 is first page in Spring (first page is page=0)',
    ],
    traps: ['Unbounded sort field from user input'],
    strongSignals: [
      'PageableDefault and max-page-size',
      'Keyset for deep pagination',
      'Custom PagedResponse DTO',
    ],
  },
  keyTakeaways: [
    'Pageable from page/size/sort query params.',
    'Page<T> = content + totalElements + totalPages.',
    'OFFSET slow deep — prefer keyset at scale.',
    'Slice avoids COUNT when hasNext enough.',
    'Whitelist sort fields; cap page size.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Spring Data pagination params?',
      answerHint: 'page, size, sort — resolved to Pageable automatically.',
    },
    {
      level: 'intermediate',
      question: 'Offset pagination problem at high page?',
      answerHint: 'DB must scan and discard OFFSET rows — O(offset) cost.',
    },
    {
      level: 'advanced',
      question: 'Page vs Slice?',
      answerHint: 'Page runs count query for totals; Slice only hasNext — cheaper for streams.',
    },
  ],
  flashcards: [
    { front: 'Spring page index', back: '0-based — first page is page=0' },
    { front: 'Slice advantage', back: 'No COUNT query — only hasNext' },
    { front: 'Deep page fix', back: 'Keyset/seek pagination on indexed columns' },
  ],
  quickRevision: [
    'Pageable + Page<T>',
    'page/size/sort params',
    '@PageableDefault',
    'max-page-size cap',
    'OFFSET vs keyset',
    'Slice for feeds',
    'Index sort columns',
  ],
}

export const content = paginationContent
