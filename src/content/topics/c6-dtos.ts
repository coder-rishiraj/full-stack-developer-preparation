import type { TopicContent } from '@/domain/types'

export const dtosContent: TopicContent = {
  whatIsIt:
    'DTOs (Data Transfer Objects) are types dedicated to crossing API boundaries — request/response shapes decoupled from JPA entities — typically immutable records or POJOs with validation annotations, carrying only fields clients need.',
  whyExists:
    'Entities encode persistence (relations, lazy loading, internal IDs). Exposing them leaks schema, causes serialization cycles, and couples API to DB. DTOs define stable contracts, hide secrets (password hashes), and version independently of tables.',
  mentalModel:
    'Controller speaks DTO; Service translates DTO ↔ entity. Incoming CreateOrderRequest validated → map to Order entity → save → map to OrderResponse. Never return @Entity from REST. Mapping via manual code, MapStruct, or record constructors.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Request DTOs: @Valid on @RequestBody — size, format, required fields.',
        'Response DTOs: subset of entity fields; computed fields (fullName).',
        'Mapper layer: static methods, MapStruct @Mapper, or service private methods.',
        'Records (Java 16+) ideal for immutable response/request types.',
        'Separate DTOs per use case (CreateUserRequest vs UserResponse vs UserSummary).',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Anti-pattern',
      text: 'Single "UserDTO" used for everything — blurs create/update/response semantics and validation rules.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  JSON[JSON request] --> ReqDTO[CreateUserRequest]
  ReqDTO --> Map1[Mapper]
  Map1 --> Entity[User entity]
  Entity --> Svc[Service / DB]
  Svc --> Map2[Mapper]
  Map2 --> ResDTO[UserResponse]
  ResDTO --> JSON2[JSON response]`,
    caption: 'DTOs at the boundary; entities inside',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Request/response records with validation',
      code: `public record CreateUserRequest(
    @NotBlank @Email String email,
    @Size(min = 8, max = 72) String password
) {}

public record UserResponse(
    Long id,
    String email,
    Instant createdAt
) {
  public static UserResponse from(User user) {
    return new UserResponse(user.getId(), user.getEmail(), user.getCreatedAt());
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Service maps DTO ↔ entity',
      code: `@Service
public class UserService {
  public UserResponse create(CreateUserRequest req) {
    var user = new User();
    user.setEmail(req.email());
    user.setPasswordHash(encoder.encode(req.password()));
    return UserResponse.from(userRepository.save(user));
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'MapStruct mapper (optional)',
      code: `@Mapper(componentModel = "spring")
public interface OrderMapper {
  Order toEntity(CreateOrderRequest req);
  OrderResponse toResponse(Order order);
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Jackson serializes DTO fields via getters/record components — @JsonIgnore hides fields.',
        '@JsonProperty for wire names differing from Java (snake_case).',
        'OpenAPI generators produce DTOs from spec — contract-first workflow.',
        'Projection interfaces in Spring Data can serve read DTOs without full entity.',
        'Entity graphs not loaded — DTO mapping touches only needed columns (avoid N+1 in mapper).',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Stable API contract independent of schema',
      'Security — omit internal fields',
      'Clear validation boundaries',
    ],
    disadvantages: [
      'Boilerplate mapping code',
      'Duplicate field definitions vs entity',
    ],
    alternatives: [
      'MapStruct / ModelMapper for generated mapping',
      'Spring Data interface projections for reads only',
      'JSON views (@JsonView) — lighter but couples entity to API',
    ],
    whenToUse: [
      'All public REST APIs',
      'Different create vs update vs response shapes',
    ],
    whenNotToUse: [
      'Internal service-to-service with shared module — shared API types OK',
      'JsonView for trivial field hiding only (still couples)',
    ],
  },
  failureModes: [
    'Returning entity — LazyInitializationException or password leak.',
    'Mutable DTOs shared and modified across threads.',
    'Mapper not updated when entity field added — silent omission in API.',
    'Giant generic DTO — validation rules impossible to enforce.',
    'Bidirectional mapping loops in MapStruct with nested graphs.',
  ],
  production: {
    maintainability: [
      'One request/response type per endpoint use case',
      'MapStruct compile-time mapping catches refactors',
    ],
    security: ['Never include passwordHash, internal flags in response DTOs'],
    performance: ['Projections/DTO queries fetch only needed columns on hot paths'],
  },
  interview: {
    expectations: [
      'Why not expose JPA entities',
      'Request vs response DTO separation',
      'Mapping strategies',
    ],
    commonQuestions: [
      'What is a DTO and why use it?',
      'DTO vs entity?',
      'How handle mapping boilerplate?',
    ],
    followUps: [
      'MapStruct vs manual mapping?',
      'Partial updates — PATCH DTO design?',
    ],
    misconceptions: [
      'DTO and entity should always mirror each other',
      'Records cannot be used as JPA entities (true) so use for DTOs',
      'Single DTO class is fine for CRUD',
    ],
    traps: ['Suggesting @JsonIgnore on entity password instead of DTO'],
    strongSignals: [
      'Separate Create/Update/Response types',
      'Records with validation on requests',
      'Mentions LazyInitialization and API stability',
    ],
  },
  keyTakeaways: [
    'DTO = API contract; entity = persistence.',
    'Never return @Entity from controllers.',
    'Records + @Valid for requests.',
    'MapStruct or explicit mappers — no entity in JSON.',
    'Per use case DTOs, not one god DTO.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why use DTOs instead of entities in REST?',
      answerHint: 'Decouple API from DB; hide fields; avoid lazy load/serialization issues.',
    },
    {
      level: 'intermediate',
      question: 'Where put mapping logic?',
      answerHint: 'Dedicated mapper, MapStruct, or service — not controller parsing.',
    },
    {
      level: 'advanced',
      question: 'DTO for PATCH partial update?',
      answerHint: 'Optional fields (Optional/nullable) or JsonNullable; merge non-null onto entity.',
    },
  ],
  flashcards: [
    { front: 'DTO purpose', back: 'API boundary type decoupled from persistence' },
    { front: 'LazyInitialization risk', back: 'Serializing entity with unloaded lazy collection' },
    { front: 'Java DTO idiom', back: 'Immutable record + static from(entity)' },
  ],
  quickRevision: [
    'DTO at controller boundary',
    'Entity stays in service/repo',
    'Create vs Response DTOs',
    'Records + @Valid',
    'MapStruct optional',
    'No password in response',
    'Per use case types',
  ],
}

export const content = dtosContent
