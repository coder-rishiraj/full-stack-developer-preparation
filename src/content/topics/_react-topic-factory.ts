import type { TopicContent } from '@/domain/types'

type ReactTopicInput = {
  title: string
  sectionTitle: string
  parentTitle?: string
}

const SECTION_FOCUS: Record<string, string> = {
  'React Foundations':
    'the declarative component model, JSX output, element identity, and the React/renderer boundary',
  'Props, State & Data Flow':
    'ownership, immutable updates, state snapshots, and explicit communication between components',
  'Rendering & Reconciliation':
    'pure render work, fiber identity, reconciliation heuristics, and DOM commits',
  Events:
    'React event handlers, SyntheticEvent behavior, and browser event propagation',
  Forms:
    'input ownership, validation, submission, and asynchronous form states',
  'Hooks Fundamentals':
    'stable hook ordering, render snapshots, effect synchronization, and reusable stateful logic',
  Context:
    'dependency distribution through a tree and the render cost of changing provider values',
  'Refs & Imperative React':
    'stable mutable references and narrowly scoped imperative interaction with DOM or component APIs',
  'Portals & Advanced Component Patterns':
    'composition techniques that keep component APIs reusable without coupling visual structure',
  'Error Handling':
    'failure isolation, fallback UI, recovery, and production error reporting',
  'Suspense & Async UI':
    'coordinating pending work through boundaries, fallbacks, streaming, and error handling',
  'Performance Engineering':
    'measurement-led optimization of render work, loading, network waterfalls, and bundle cost',
  'Concurrent React':
    'interruptible rendering and assigning different priorities to urgent and non-urgent updates',
  'Data Fetching & Server State':
    'request lifecycles, cancellation, caching, revalidation, races, and server-cache ownership',
  'State Management':
    'choosing the narrowest state owner and escalating to stores only when coordination requires it',
  'React Router':
    'URL-driven UI, nested route composition, navigation, parameters, and authorization boundaries',
  'React 19 & Modern React':
    'Actions, optimistic UI, form status, ref-as-prop, resource handling, and compiler-aware code',
  'Server Rendering & Server Components':
    'server/client execution boundaries, hydration, streaming, serialization, and bundle ownership',
  'Next.js Integration':
    'framework routing, server/client components, caching, rendering strategies, and deployment',
  'React Testing':
    'user-visible behavior, accessible queries, async assertions, realistic network mocks, and test scope',
  'Accessibility in React':
    'semantic output, keyboard behavior, focus management, stable IDs, and accessible async navigation',
  Internationalization:
    'locale ownership, message formatting, plural rules, RTL behavior, and translation loading',
  'Legacy React & Existing Codebases':
    'reading class state and lifecycle code while recognizing deprecated APIs and modern replacements',
  'React Architecture & Production Engineering':
    'clear feature boundaries, state ownership, dependency direction, observability, and maintainability',
}

export function createReactTopicContent({
  title,
  sectionTitle,
  parentTitle,
}: ReactTopicInput): TopicContent {
  const focus =
    SECTION_FOCUS[sectionTitle] ??
    'React behavior, component boundaries, state ownership, and production trade-offs'
  const parentContext = parentTitle ? ` It is a focused part of ${parentTitle}.` : ''

  return {
    whatIsIt:
      `${title} is a React concept within ${sectionTitle}.${parentContext} ` +
      `Study it in terms of ${focus}, not as an isolated API name.`,
    whyExists:
      `${title} matters because production React work requires a predictable mental model for ` +
      `${focus}. It helps you explain both expected behavior and the bugs caused by violating that model.`,
    mentalModel:
      `For ${title}, identify the owner, the render-time input, the update trigger, and the commit or ` +
      `external side effect. Then ask what identity React preserves and which boundary is responsible.`,
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: [
          `Define ${title} in the context of ${sectionTitle}.`,
          'Trace data and control flow from the owning component through render and commit.',
          'Separate React guarantees from browser behavior and framework-specific conventions.',
          'Verify the behavior with a minimal component, React DevTools, and a focused test.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Interview standard',
        text:
          `Do not answer ${title} with syntax alone. Explain why it exists, what triggers it, ` +
          'how identity and ownership affect it, and one failure mode you have debugged.',
      },
    ],
    internals: [
      {
        type: 'list',
        items: [
          `Connect ${title} to React's render and commit phases where applicable.`,
          'State and props are snapshots for a render; mutable external systems require an explicit synchronization boundary.',
          'Type, key, reference equality, and provider/store subscriptions determine whether work is preserved or repeated.',
        ],
      },
    ],
    failureModes: [
      `Treating ${title} as memorized syntax without understanding ownership or lifecycle.`,
      'Mixing render-time derivation with imperative side effects.',
      'Applying memoization, context, or global state before measuring the actual coordination problem.',
    ],
    interview: {
      expectations: [
        `Define ${title} precisely and place it within ${sectionTitle}.`,
        'Explain one production use case and one misuse.',
        'Connect the answer to rendering, identity, state ownership, or external synchronization.',
      ],
      commonQuestions: [
        `What problem does ${title} solve?`,
        `When would you avoid ${title}?`,
        `How would you test or debug ${title}?`,
      ],
      followUps: ['What changes under concurrent rendering?', 'What is the performance implication?'],
      misconceptions: [`${title} is only syntax and has no architectural trade-offs.`],
      traps: ['Giving a framework-specific answer as if it were a React core guarantee.'],
      strongSignals: [
        'Uses a concrete production example.',
        'Separates render, commit, browser, and server responsibilities.',
      ],
    },
    keyTakeaways: [
      `${title} belongs to ${sectionTitle}.`,
      `Reason about ${title} through ownership, identity, update triggers, and boundaries.`,
      'Prefer a small reproducible example and profiler/test evidence over assumptions.',
    ],
    interviewQuestions: [
      {
        level: 'basic',
        question: `What is ${title}, and what problem does it solve?`,
        answerHint: `Define it within ${sectionTitle}, then name the ownership or lifecycle problem it addresses.`,
      },
      {
        level: 'intermediate',
        question: `Show a practical use of ${title} and one common mistake.`,
        answerHint: 'Use a minimal component and explain the render/update sequence before discussing syntax.',
      },
      {
        level: 'advanced',
        question: `What production trade-offs or debugging signals matter for ${title}?`,
        answerHint: `Discuss ${focus}, then explain how you would verify behavior with DevTools or tests.`,
      },
    ],
    flashcards: [
      {
        front: title,
        back: `${sectionTitle}: reason about ownership, identity, update triggers, and boundaries.`,
      },
      {
        front: `${title} interview signal`,
        back: 'Definition → mechanism → use case → failure mode → verification.',
      },
    ],
    quickRevision: [
      `${title} — ${sectionTitle}`,
      `Focus: ${focus}`,
      'Owner → input snapshot → trigger → render/commit → observable result',
      'Know one use case, one misuse, and one debugging method',
    ],
  }
}
