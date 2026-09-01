import type { TopicContent } from '@/domain/types'

export const equalsContent: TopicContent = {
  whatIsIt:
    'equals() defines value equality for Java objects — whether two references represent the same logical value. Object.equals defaults to reference equality (==); value types and domain entities override it with field-wise comparison.',
  whyExists:
    '== compares references, not meaning. Collections (HashMap, HashSet), sorting, and business logic need consistent “same value” semantics. Without a correct equals contract, maps duplicate keys and sets leak entries.',
  mentalModel:
    'equals answers: “Would a domain expert say these two objects are the same thing?” It must be reflexive, symmetric, transitive, consistent, and never null-hostile. Pair it with hashCode whenever instances are used in hash-based structures.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'If references are identical (==), return true.',
        'If other is null or different runtime class (usually), return false.',
        'Compare significant fields — primitives with ==, objects with Objects.equals, arrays with Arrays.equals.',
        'For inheritance, prefer getClass() over instanceof unless subclass fields are symmetric.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Records (Java 16+)',
      text: 'Records auto-generate equals/hashCode/toString from components — ideal for immutable value keys.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Canonical equals override',
      code: `@Override
public boolean equals(Object o) {
  if (this == o) return true;
  if (!(o instanceof Money that)) return false;
  return amount == that.amount && currency.equals(that.currency);
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Record — equals generated',
      code: `public record Money(long amount, Currency currency) {}
// equals compares amount and currency; use for HashMap keys`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Broken equals — asymmetric with subclass',
      code: `class Point { int x, y; }
class ColoredPoint extends Point { Color c; }
// equals(Point) ignores color; equals(ColoredPoint) checks color → not symmetric`,
    },
  ],
  internals: [
    {
      type: 'table',
      headers: ['Method', 'Compares', 'Typical use'],
      rows: [
        ['==', 'Reference identity', 'Singletons, enum constants, interned strings'],
        ['equals', 'Logical value (overrideable)', 'Collections, DTOs, domain equality'],
        ['compareTo', 'Ordering (Comparable)', 'Sort, TreeSet/TreeMap'],
        ['Objects.equals(a,b)', 'Null-safe field compare', 'Inside equals implementations'],
      ],
    },
    {
      type: 'list',
      items: [
        'Contract (Java API): reflexive, symmetric, transitive, consistent; x.equals(null) == false.',
        'Liskov: subclass equals must not break superclass expectations — often use final class or composition.',
        'Float/double: use Float.compare / Double.compare or convert to integer cents for money.',
        'Entity vs value object: JPA entities often use id-based equals only when persisted.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Enables correct collection behavior',
      'Clear domain semantics for “same value”',
      'Records eliminate boilerplate bugs',
    ],
    disadvantages: [
      'Easy to break symmetry/transitivity with inheritance',
      'Must stay in sync with hashCode for hash collections',
      'Deep equals on graphs is expensive and cycle-prone',
    ],
    alternatives: [
      'Identity semantics only (default Object.equals) for true singletons',
      'External equivalence (Guava Equivalence, custom comparators)',
      'Database unique constraints instead of in-memory dedup',
    ],
    whenToUse: [
      'Value objects, DTOs, map/set keys',
      'Any type stored in HashMap/HashSet',
    ],
    whenNotToUse: [
      'Mutable entities where identity is database id only mid-lifecycle',
      'Types where “partial equality” differs by caller context',
    ],
  },
  failureModes: [
    'equals without hashCode override → HashMap duplicates and broken Set membership.',
    'Using instanceof with asymmetric subclass fields → contract violation.',
    'Comparing doubles with == instead of compare.',
    'Including mutable fields in equals → key changes after insert.',
    'Entity equals on all fields before id assigned → inconsistent across persistence states.',
  ],
  interview: {
    expectations: [
      'State full equals contract',
      'Show correct override pattern or record',
      'Explain == vs equals and link to hashCode',
    ],
    commonQuestions: [
      'Difference between == and equals?',
      'Rules for overriding equals and hashCode?',
      'Why is String equals safe as a HashMap key?',
    ],
    followUps: [
      'How do you implement equals for inheritance hierarchies?',
      'equals for JPA entities?',
    ],
    misconceptions: [
      'equals and == are interchangeable',
      'hashCode must be unique per object',
      'Auto-generated equals from IDE is always correct for hierarchies',
    ],
    traps: ['Implementing equals with getClass() in open hierarchy without explaining Liskov trade-off'],
    strongSignals: [
      'Mentions symmetry/transitivity bugs with subclass',
      'Uses Objects.equals and getClass/instanceof deliberately',
      'Connects to HashMap key immutability',
    ],
  },
  keyTakeaways: [
    '== is identity; equals is value — override for domain equality.',
    'Contract: reflexive, symmetric, transitive, consistent, non-null.',
    'Always override hashCode when overriding equals.',
    'Prefer records or final value classes for keys.',
    'Never use mutable fields in equals for hash-based collections.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does Object.equals do by default?',
      answerHint: 'Same as == — reference equality.',
    },
    {
      level: 'intermediate',
      question: 'State the equals contract.',
      answerHint: 'Reflexive, symmetric, transitive, consistent; false for null.',
    },
    {
      level: 'advanced',
      question: 'Why is equals/hashCode problematic with JPA entity inheritance?',
      answerHint: 'Lazy proxies, id assignment timing, asymmetric subclass fields.',
    },
  ],
  flashcards: [
    { front: '== vs equals', back: '== reference; equals value (overrideable)' },
    { front: 'equals + hashCode rule', back: 'Override both together for hash collections' },
    { front: 'Money compare', back: 'Use integer minor units or BigDecimal, not raw double ==' },
  ],
  quickRevision: [
    'Default equals is ==',
    'Contract: reflexive, symmetric, transitive, consistent',
    'Override hashCode with equals',
    'Records auto equals/hashCode',
    'Immutable keys; no mutable fields in equals',
    'Objects.equals for null-safe fields',
    'Entity equals often id-based when persisted',
  ],
}

export const content = equalsContent
