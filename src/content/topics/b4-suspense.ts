import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Suspense is a React mechanism for declaratively handling components that are not yet ready to render — showing a fallback UI while children suspend (throw a promise) during lazy code loading or async data reads, enabling coordinated loading states and streaming without ad-hoc isLoading flags everywhere.',
  whyExists:
    'Manual loading booleans scatter across components and cause fetch waterfalls. Suspense lets React pause rendering at a boundary, show fallback, and resume when resources resolve — unified model for code splitting and (with frameworks) data fetching.',
  mentalModel:
    '<Suspense fallback={<Skeleton />}><Child /></Suspense>. Child throws promise while loading → nearest boundary catches → fallback. Sibling boundaries can show independently. Avoid putting Suspense too high (whole page spinner) or too low (flash of many spinners).',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Component or hook signals not ready by suspending (throw promise in React implementation).',
        'React walks up to nearest Suspense boundary, renders fallback.',
        'Promise resolves → React retries suspended subtree render.',
        'Nested Suspense: inner resolves first with inner fallback.',
        'Error boundaries catch errors; Suspense catches pending async.',
      ],
    },
    {
      type: 'table',
      headers: ['Use case', 'Suspends on'],
      rows: [
        ['React.lazy', 'Dynamic import chunk load'],
        ['use() with promise', 'Unresolved promise (React 19)'],
        ['Framework data hooks', 'Server/cache read not ready'],
        ['Streaming SSR', 'Server component async segment'],
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Not a data fetching library',
      text: 'Suspense is UI coordination. You still need cache (React Query, Relay, RSC) that integrates with suspend semantics.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Nested Suspense boundaries',
      code: `function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Header />
      <Suspense fallback={<CommentsSkeleton />}>
        <Comments postId={id} />
      </Suspense>
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>
    </Suspense>
  );
}`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Lazy + Suspense',
      code: `const Chart = lazy(() => import('./Chart'));

<Suspense fallback={<ChartPlaceholder />}>
  <Chart data={data} />
</Suspense>`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'SuspenseList experimental coordinates order of revealing siblings.',
        'SSR streaming sends fallbacks first then replaces with content HTML.',
        'useTransition keeps previous UI visible while Suspense boundary pending (optional).',
        'Throwing promise is internal contract — don’t throw promises manually in app code.',
        'Multiple suspending children in one boundary share fallback until all ready (depends on mode).',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Declarative loading UI colocated with tree structure',
      'Enables streaming SSR and progressive reveal',
      'Works with lazy loading out of the box',
    ],
    disadvantages: [
      'Requires Suspense-compatible data layer for fetch',
      'Wrong boundary granularity — bad UX',
      'Mental model unfamiliar vs isLoading flags',
    ],
    alternatives: [
      'Manual loading/error state per component',
      'React Query isLoading without suspense mode',
    ],
    whenToUse: [
      'React.lazy code splitting',
      'Streaming RSC/SSR apps',
      'Framework-supported Suspense data reads',
    ],
    whenNotToUse: [
      'Simple one-off fetch — Query isLoading may suffice',
      'Entire app single Suspense — blank page too long',
    ],
  },
  failureModes: [
    'Lazy component without Suspense ancestor — error.',
    'Single top Suspense — one slow widget blocks whole fallback.',
    'Mixing suspense and non-suspense fetch duplicates loading logic.',
    'Error in suspend not caught — need ErrorBoundary sibling.',
    'Waterfall: sequential nested async components without parallel fetch.',
  ],
  production: {
    performance: ['Granular boundaries match layout skeletons'],
    reliability: ['ErrorBoundary + Suspense sibling pattern'],
    maintainability: ['Skeleton components matching layout reduce CLS'],
  },
  interview: {
    expectations: [
      'Suspense shows fallback while child suspends',
      'Used with React.lazy and async data patterns',
      'Difference from ErrorBoundary',
    ],
    commonQuestions: [
      'What does Suspense do?',
      'Suspense vs conditional loading render?',
      'Can Suspense catch errors?',
    ],
    followUps: [
      'Streaming SSR with Suspense?',
      'use() hook relationship?',
    ],
    misconceptions: [
      'Suspense fetches data by itself',
      'Suspense replaces ErrorBoundary',
      'One Suspense per app is enough',
    ],
    traps: ['Saying Suspense catches JavaScript errors'],
    strongSignals: [
      'Fallback while promise unresolved',
      'Boundary granularity matters',
      'Pairs with lazy and streaming',
    ],
  },
  keyTakeaways: [
    'Suspense declaratively handles not-ready children with fallback.',
    'Required for React.lazy loading.',
    'Place boundaries at meaningful UI sections.',
    'Different from error boundaries — pending vs thrown errors.',
    'Enables streaming and coordinated loading states.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What triggers a Suspense fallback?',
      answerHint: 'Child suspends (e.g. lazy chunk or async read not ready).',
    },
    {
      level: 'intermediate',
      question: 'Why nested Suspense boundaries?',
      answerHint: 'Independent sections load/show skeletons without blocking entire page.',
    },
    {
      level: 'advanced',
      question: 'Suspense during SSR streaming?',
      answerHint: 'Server sends shell + fallbacks first; later chunks stream resolved content.',
    },
  ],
  flashcards: [
    { front: 'Suspense', back: 'Shows fallback while children suspend on async/lazy' },
    { front: 'Suspense vs ErrorBoundary', back: 'Pending loading vs thrown render errors' },
    { front: 'React.lazy requirement', back: 'Must have Suspense ancestor' },
  ],
  quickRevision: [
    'Fallback while pending',
    'lazy needs Suspense',
    'Granular boundaries',
    'Not error catching',
    'Streaming SSR',
    'Coordinate loading UI',
  ],
}
