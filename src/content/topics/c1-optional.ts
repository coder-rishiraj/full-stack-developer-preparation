import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Optional<T> is a container that may or may not hold a non-null value, introduced in Java 8 to replace null returns with an explicit API. It encourages callers to handle absence via orElse, orElseGet, orElseThrow, ifPresent, and map/flatMap chains.',
  whyExists:
    'NullPointerException is Java\'s billion-dollar mistake. Returning null from getUserById forces every caller to remember null checks. Optional makes absence visible in the type signature and provides composable handling — though it should mainly be used as return type, not fields or parameters.',
  mentalModel:
    'A box that is either empty or contains exactly one value. Never holds null — Optional.of(null) throws. Empty Optional is a singleton Optional.empty().',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Optional.of(value) — value must be non-null.',
        'Optional.ofNullable(value) — empty if null.',
        'Optional.empty() — shared empty instance.',
        'isPresent/isEmpty test; ifPresent(Consumer) side effect.',
        'map transforms value; flatMap when mapper returns Optional.',
        'orElse(default), orElseGet(Supplier), orElseThrow() for unwrap.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Intended usage',
      text: 'Use Optional primarily as method return type. Avoid Optional fields, method parameters, collections of Optional, and serialization.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Return Optional from lookup',
      code: `public Optional<User> findByEmail(String email) {
  User user = cache.get(email);
  return Optional.ofNullable(user);
}

// Caller
String name = findByEmail("ada@example.com")
    .map(User::getName)
    .orElse("Unknown");`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'flatMap chains optional steps',
      code: `public Optional<String> getCityZip(UserId id) {
  return findUser(id)
      .flatMap(User::getAddress)      // Optional<Address>
      .map(Address::getCityZip);      // Optional<String> if map returns optional step
}

// orElseThrow with custom exception
User user = findUser(id)
    .orElseThrow(() -> new NotFoundException(id));`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Implementation: private final T value or empty marker — lightweight object on stack/heap.',
        'Optional is final; not serializable by design recommendation.',
        'Stream integration: stream() on Optional (Java 9) yields 0 or 1 element.',
        'ifPresentOrElse (Java 9) handles both branches without explicit isPresent.',
        'or() (Java 9) provides alternative Optional if empty.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Explicit absence in return type',
      'Composable map/flatMap/filter without null checks',
      'orElseGet lazy — supplier only if empty',
      'Documents API may not find result',
    ],
    disadvantages: [
      'Boxing overhead for primitives — use OptionalInt, OptionalLong, OptionalDouble',
      'Misused as fields/parameters adds ceremony',
      'Not JSON-friendly by default',
      'get() without check throws NoSuchElementException — discouraged',
    ],
    alternatives: [
      'Null return with @Nullable documentation — legacy',
      'Sealed result types: Success | NotFound',
      'Exceptions for truly exceptional miss',
    ],
    whenToUse: [
      'Method return when zero or one result expected',
      'Chaining nullable transformations in business logic',
      'Stream sources with findFirst/findAny',
    ],
    whenNotToUse: [
      'Method parameters — overload or nullable arg instead',
      'Class fields — use null or redesign',
      'Collections — use empty collection instead',
      'Serialization DTOs',
    ],
  },
  failureModes: [
    'optional.get() without isPresent — NoSuchElementException.',
    'Optional.of(null) — immediate NPE.',
    'Using orElse with expensive default — always evaluated; use orElseGet.',
    'Optional in JSON API — unexpected object shape.',
    'Three-valued logic bugs: empty vs present-null confusion (ofNullable vs of).',
  ],
  interview: {
    expectations: [
      'of vs ofNullable vs empty',
      'map vs flatMap',
      'orElse vs orElseGet vs orElseThrow',
      'When NOT to use Optional',
    ],
    commonQuestions: [
      'What is Optional?',
      'Difference orElse and orElseGet?',
      'Optional.of vs ofNullable?',
      'Should fields be Optional?',
    ],
    followUps: [
      'Optional and serialization?',
      'OptionalInt vs Optional<Integer>?',
    ],
    misconceptions: [
      'Optional eliminates all NPEs (only helps when used consistently on returns)',
      'Optional is recommended for fields and parameters (Joshua Bloch advises against)',
    ],
    traps: ['orElse(expensive()) always runs expensive()'],
    strongSignals: [
      'flatMap for nested Optional flattening',
      'Return-type-only guidance',
      'Lazy orElseGet for expensive defaults',
    ],
  },
  keyTakeaways: [
    'Container for 0 or 1 non-null value.',
    'of non-null; ofNullable nullable; empty for absent.',
    'map/flatMap chain without null checks.',
    'orElseGet lazy; orElseThrow for fail-fast.',
    'Return types only — not fields or params.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the difference between Optional.of and Optional.ofNullable?',
      answerHint: 'of requires non-null or NPE; ofNullable wraps null as empty Optional.',
    },
    {
      level: 'intermediate',
      question: 'When to use flatMap vs map on Optional?',
      answerHint: 'flatMap when mapper returns Optional — avoids Optional<Optional<T>> nesting.',
    },
    {
      level: 'advanced',
      question: 'Why is Optional generally a bad choice for fields?',
      answerHint: 'Adds memory/overhead everywhere; null or redesign simpler; serializing awkward.',
    },
  ],
  flashcards: [
    { front: 'Optional.of(null)', back: 'Throws NullPointerException immediately' },
    { front: 'orElse vs orElseGet', back: 'orElse always evaluates arg; orElseGet supplier only if empty' },
    { front: 'Optional.get()', back: 'Unsafe — throws if empty; prefer orElseThrow/orElseGet' },
  ],
  quickRevision: [
    'Zero or one value container',
    'of / ofNullable / empty',
    'map flatMap filter chain',
    'orElseGet lazy default',
    'Return type primarily',
    'Not for fields or params',
    'OptionalInt for primitives',
  ],
}
