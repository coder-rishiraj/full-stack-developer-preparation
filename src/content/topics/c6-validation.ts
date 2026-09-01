import type { TopicContent } from '@/domain/types'

export const validationContent: TopicContent = {
  whatIsIt:
    'Bean Validation (Jakarta Validation / Hibernate Validator) declaratively constrains Java objects via annotations (@NotNull, @Size, @Email) — triggered in Spring with @Valid or @Validated on @RequestBody, method params, or @ConfigurationProperties.',
  whyExists:
    'Invalid input causes bad data, security issues, and obscure DB errors. Validating at the API boundary returns structured 400 responses before business logic runs — fail fast with clear field-level messages.',
  mentalModel:
    'Annotate DTO fields → @Valid on controller param → MethodValidationInterceptor or WebDataBinder runs Validator → ConstraintViolationException or BindingResult errors → @ControllerAdvice maps to ProblemDetail/JSON error body.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Add spring-boot-starter-validation (Hibernate Validator).',
        'Annotate DTO: @NotBlank, @Email, @Min, @Max, @Pattern, custom @Constraint.',
        '@Valid on @RequestBody triggers validation before method body.',
        '@Validated on class enables method-level validation (@NotNull on params).',
        'Groups (@Validated(Create.class)) for different rules on create vs update.',
      ],
    },
    {
      type: 'table',
      headers: ['Annotation', 'Checks', 'Example'],
      rows: [
        ['@NotNull', 'Not null', 'Required field'],
        ['@NotBlank', 'Not null/empty/whitespace', 'String name'],
        ['@Email', 'Email format', 'user@domain.com'],
        ['@Size', 'Length min/max', 'Password 8–72'],
        ['@Past / @Future', 'Date constraints', 'birthDate'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Req[HTTP JSON] --> DTO[Request DTO]
  DTO --> Valid{@Valid}
  Valid -->|fail| Err[MethodArgumentNotValidException]
  Valid -->|ok| Ctrl[Controller method]
  Err --> Advice[@ControllerAdvice → 400]`,
    caption: 'Validation before controller logic executes',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'DTO validation + controller',
      code: `public record CreateOrderRequest(
    @NotNull @Positive Long productId,
    @Min(1) @Max(99) int quantity,
    @NotBlank @Size(max = 500) String shippingAddress
) {}

@PostMapping("/orders")
public OrderResponse create(@Valid @RequestBody CreateOrderRequest req) {
  return orderService.create(req);
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Custom constraint',
      code: `@Target({FIELD, PARAMETER})
@Retention(RUNTIME)
@Constraint(validatedBy = SkuValidator.class)
public @interface ValidSku {
  String message() default "invalid SKU format";
  Class<?>[] groups() default {};
  Class<? extends Payload>[] payload() default {};
}

public class SkuValidator implements ConstraintValidator<ValidSku, String> {
  @Override
  public boolean isValid(String value, ConstraintValidatorContext ctx) {
    return value != null && value.matches("[A-Z0-9]{6,12}");
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Method-level @Validated',
      code: `@RestController
@Validated
public class SearchController {
  @GetMapping("/search")
  public List<Item> search(@RequestParam @Size(min = 2, max = 50) String q) {
    return searchService.search(q);
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'LocalValidatorFactoryBean registered by Boot auto-config.',
        'MethodValidationPostProcessor enables @Validated on @Service methods.',
        'Cascading: @Valid on nested object validates children.',
        'Hibernate Validator implements Jakarta Validation 3.0 spec.',
        'Optional groups and @GroupSequence for ordered validation.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Declarative, reusable constraints',
      'Standard spec — not Spring-specific',
      'Field-level error messages for clients',
    ],
    disadvantages: [
      'Annotations alone cannot express all business rules',
      'Complex cross-field rules need custom validators',
    ],
    alternatives: [
      'Manual if-checks in service (duplicated, inconsistent)',
      'JSON Schema validation at gateway',
    ],
    whenToUse: [
      'Structural validation on API inputs (format, size, required)',
      'Configuration properties @Validated at startup',
    ],
    whenNotToUse: [
      'Domain invariants needing DB (unique email) — service layer',
      'Authorization — security layer not @NotNull',
    ],
  },
  failureModes: [
    'Forgot @Valid — invalid data passes through.',
    '@Validated on controller missing for @RequestParam constraints.',
    'Validation only on DTO but raw Map accepted.',
    'Generic error message — clients cannot fix input.',
    'Duplicate validation in service and DTO inconsistently.',
  ],
  production: {
    maintainability: ['Consistent error JSON schema via @ControllerAdvice'],
    security: ['Validate upload size at servlet + @Size; not only client'],
  },
  interview: {
    expectations: [
      '@Valid vs @Validated',
      'Common constraint annotations',
      'How errors returned to client',
    ],
    commonQuestions: [
      'How validate request body in Spring?',
      'Custom validator implementation?',
      'Validate path variables?',
    ],
    followUps: [
      'Validation groups for PATCH?',
      'Service-layer @Validated?',
    ],
    misconceptions: [
      '@NotNull on entity sufficient without @Valid on controller',
      'Bean Validation replaces business validation entirely',
    ],
    traps: ['Only validating in service without @Valid on API'],
    strongSignals: [
      'Records with constraint annotations',
      '@Validated on class for param validation',
      'Custom ConstraintValidator for domain formats',
    ],
  },
  keyTakeaways: [
    'spring-boot-starter-validation + @Valid on @RequestBody.',
    'Annotations on DTO fields — structural rules.',
    '@Validated on class for method/param validation.',
    'Business rules (unique, balance) in service layer.',
    '@ControllerAdvice maps to 400 with field errors.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'How enable validation on POST body?',
      answerHint: '@Valid @RequestBody on DTO with constraint annotations.',
    },
    {
      level: 'intermediate',
      question: '@Valid vs @Validated?',
      answerHint: '@Valid cascades object graph; @Validated enables Spring method validation + groups.',
    },
    {
      level: 'advanced',
      question: 'Validate "endDate after startDate"?',
      answerHint: 'Class-level @Constraint on DTO or custom validator accessing both fields.',
    },
  ],
  flashcards: [
    { front: 'Trigger body validation', back: '@Valid on @RequestBody' },
    { front: '@NotBlank vs @NotNull', back: 'NotBlank rejects empty/whitespace strings' },
    { front: 'Param validation', back: '@Validated on controller class' },
  ],
  quickRevision: [
    'starter-validation dependency',
    '@Valid on RequestBody',
    'DTO annotations',
    '@Validated for params',
    'Custom @Constraint',
    'Business rules in service',
    'ControllerAdvice 400 errors',
  ],
}

export const content = validationContent
