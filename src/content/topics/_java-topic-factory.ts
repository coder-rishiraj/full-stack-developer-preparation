import type { TopicContent } from '@/domain/types'

type JavaTopicInput = {
  title: string
  sectionTitle: string
  parentTitle?: string
}

const SECTION_FOCUS: Record<string, string> = {
  'Syntax & Types':
    'what the compiler accepts, what lives on the stack vs heap, and which conversions are silent',
  'Operators & Control Flow':
    'which branch runs, short-circuiting, and how precedence changes a one-line expression',
  'Arrays & Methods':
    'fixed vs growable storage, overloading resolution, and what is in scope',
  'Strings & Wrappers':
    'immutability, the pool, and when == lies because of caching',
  'OOP Foundations':
    'ownership of state, constructors, and what an interface actually promises',
  'Inheritance & Polymorphism':
    'what the compiler allows vs what the JVM dispatches at runtime',
  'Records, Enums & Nested Types':
    'when a type is a value, a closed set of constants, or a nested implementation detail',
  'Immutability & Object Contract':
    'identity vs equality, and why HashMap keys must not mutate',
  Exceptions:
    'who must handle the failure, what always runs, and what AutoCloseable buys you',
  'Generics & Annotations':
    'compile-time safety that erasure removes, and metadata the runtime or compiler can read',
  'Collections Framework':
    'which contract you chose — uniqueness, order, or key/value — and how iteration fails',
  Lists: 'amortized array growth versus node links, and when synchronization is a trap',
  'Sets, Maps & Queues':
    'hash buckets, ordering trees, heaps, and a map that other threads may write',
  'Functional Java':
    'a single abstract method, a lazy pipeline, and Optional as a return type — not a field',
  'I/O & Serialization':
    'bytes versus chars, buffering, and what the JVM will and will not freeze to a stream',
  'Modern Java Language':
    'expression switch, text blocks, sealed hierarchies, and modules as a deployment boundary',
}

export function createJavaTopicContent({
  title,
  sectionTitle,
  parentTitle,
}: JavaTopicInput): TopicContent {
  const focus =
    SECTION_FOCUS[sectionTitle] ??
    'language semantics you can defend in a Java interview'
  const parentContext = parentTitle ? ` It is a focused part of ${parentTitle}.` : ''

  return {
    whatIsIt:
      `${title} is a Core Java topic in ${sectionTitle}.${parentContext} ` +
      `Study it as ${focus}, not as a tutorial checklist of method names.`,
    whyExists:
      `${title} shows up in 2–7 year Java interviews because interviewers want the rule, ` +
      `a counter-example, and what breaks in collections or concurrency — not a W3Schools recap.`,
    mentalModel:
      `For ${title}, name the compile-time rule, the runtime object model, and one failure ` +
      `(ClassCastException, ConcurrentModificationException, broken equals/hashCode).`,
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: [
          `Define ${title} in one sentence inside ${sectionTitle}.`,
          'Show a 10-line snippet that compiles, then one that does not (or behaves surprisingly).',
          'Say where the data lives: stack, heap, string pool, or a collection bucket.',
          'Name the interview follow-up: equals, generics, or threads.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Interview standard',
        text:
          `Do not answer ${title} with “it is a feature of Java.” State the contract, one misuse, ` +
          'and how you would verify it in jshell or a unit test.',
      },
    ],
    internals: [
      {
        type: 'list',
        items: [
          'Primitives are not objects; wrappers and arrays are.',
          'Overload resolution is compile-time; override dispatch is runtime on the instance.',
          'Hash-based collections trust hashCode and equals together — never one without the other.',
        ],
      },
    ],
    failureModes: [
      `Memorizing ${title} syntax without the object-identity vs equality distinction.`,
      'Using == on wrappers or strings and calling it a language bug.',
      'Mutating a key after it was inserted into a HashMap.',
    ],
    interview: {
      expectations: [
        `Place ${title} in ${sectionTitle}.`,
        'Give a compiling example and a trap.',
        'Connect it to collections, exceptions, or Java 8 when relevant.',
      ],
      commonQuestions: [
        `What is ${title}?`,
        `When would you avoid ${title}?`,
        'What is the output of a related one-liner?',
      ],
      followUps: [
        'Does this involve the string pool or Integer cache?',
        'What happens under two threads?',
      ],
      misconceptions: [`${title} is only beginner material and seniors are not asked it.`],
      traps: ['Answering Spring Boot when the question is still core language.'],
      strongSignals: [
        'Writes a tiny example without an IDE.',
        'Separates compiler rules from JVM dispatch.',
      ],
    },
    keyTakeaways: [
      `${title} belongs to ${sectionTitle}.`,
      `Reason about ${title} through types, identity, and contracts.`,
      'Bring one snippet and one failure mode to the round.',
    ],
    interviewQuestions: [
      {
        level: 'basic',
        question: `What is ${title}, and what problem does it solve?`,
        answerHint: `Define it within ${sectionTitle}, then name the language rule it encodes.`,
      },
      {
        level: 'intermediate',
        question: `Show a practical use of ${title} and one common bug.`,
        answerHint: 'Prefer a 10-line class over a framework stack.',
      },
      {
        level: 'advanced',
        question: `How does ${title} interact with collections, equality, or the JVM?`,
        answerHint: `Discuss ${focus}, then what you would print or assert in a test.`,
      },
    ],
    flashcards: [
      {
        front: title,
        back: `${sectionTitle}: contract, example, trap.`,
      },
      {
        front: `${title} interview signal`,
        back: 'Definition → compile vs runtime → one collection or equals pitfall.',
      },
    ],
    quickRevision: [
      `${title} — ${sectionTitle}`,
      `Focus: ${focus}`,
      'Type / identity / contract',
      'One snippet, one trap',
    ],
  }
}
