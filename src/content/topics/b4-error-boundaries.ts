import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Error boundaries are React class components (or future equivalents) that catch JavaScript errors in their child render tree, log them, and display a fallback UI instead of unmounting the entire app — they do not catch errors in event handlers, async code, or server rendering by themselves.',
  whyExists:
    'A single thrown error during render would otherwise bubble up and white-screen the whole SPA. Boundaries isolate failures to a subtree — e.g. a broken sidebar widget should not crash checkout.',
  mentalModel:
    'Try/catch for the render phase only. Wrap risky subtrees (lazy routes, third-party widgets). getDerivedStateFromError + componentDidCatch. Errors in onClick or useEffect still need try/catch or global handlers.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Child throws during render, lifecycle, or child constructor.',
        'Nearest error boundary catches via getDerivedStateFromError (state update) and componentDidCatch (side effects/logging).',
        'Boundary re-renders with fallback UI from state.',
        'Sibling and parent trees outside the boundary continue normally.',
        'Reset by changing key on boundary or navigating away.',
      ],
    },
    {
      type: 'table',
      headers: ['Caught', 'Not caught'],
      rows: [
        ['Render errors in children', 'Event handler errors (use try/catch)'],
        ['Lifecycle errors in children', 'Async/setTimeout/Promise rejections'],
        ['Constructor errors in children', 'Errors in boundary itself'],
        ['Lazy chunk render failures (sometimes)', 'SSR errors without framework wrapper'],
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Placement strategy',
      text: 'Route-level boundary + feature-level boundaries. Pair with lazy loading — chunk load failures need explicit handling (react-error-boundary onReset).',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Class error boundary',
      code: `class ErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logToService(error, info.componentStack);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Route + lazy chunk recovery',
      code: `<ErrorBoundary fallback={<RouteError onRetry={() => window.location.reload()} />}>
  <Suspense fallback={<Spinner />}>
    <LazyDashboard />
  </Suspense>
</ErrorBoundary>`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'No hook equivalent yet for defining boundaries — class or library (react-error-boundary).',
        'React 19+ may improve error reporting; boundaries remain render-phase only.',
        'Strict Mode double-invokes render — ensure boundaries do not assume single mount.',
        'componentDidCatch runs in commit phase; no setState in getDerivedStateFromError beyond error flag.',
        'Production: integrate with Sentry captureException in componentDidCatch.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Graceful degradation instead of full app crash',
      'Localized fallback UX per feature/route',
      'Centralized error logging hook point',
    ],
    disadvantages: [
      'Class component API (no native function boundary)',
      'Does not catch async/event errors',
      'Can mask bugs if fallback too silent',
    ],
    alternatives: [
      'react-error-boundary with resetKeys',
      'Global window.onerror / unhandledrejection for async',
      'Framework error.tsx (Next.js App Router)',
    ],
    whenToUse: [
      'Lazy-loaded routes, third-party embeds, experimental widgets',
      'Dashboard tiles independently authored',
    ],
    whenNotToUse: [
      'Replacing try/catch in event handlers',
      'Every single component — too granular',
    ],
  },
  failureModes: [
    'Boundary too high — one error still loses whole main content.',
    'Boundary too low — noisy fallbacks everywhere.',
    'Assuming boundary catches fetch errors — those need error state.',
    'No reset path — user stuck on fallback until full reload.',
    'Logging PII in componentDidCatch stacks.',
  ],
  production: {
    reliability: ['Reset boundary on navigation; retry lazy chunk loads'],
    observability: ['Sentry/Datadog in componentDidCatch with componentStack'],
    maintainability: ['react-error-boundary for resetKeys pattern'],
    security: ['Sanitize fallback UI — do not expose raw error messages to users'],
  },
  interview: {
    expectations: [
      'What errors boundaries catch vs not catch',
      'Class API: getDerivedStateFromError + componentDidCatch',
      'Where to place boundaries in app architecture',
    ],
    commonQuestions: [
      'Do error boundaries catch useEffect errors?',
      'Can you use hooks in error boundary?',
      'How handle lazy load failure?',
    ],
    followUps: [
      'Next.js error.tsx vs React boundary?',
      'How reset error boundary state?',
    ],
    misconceptions: [
      'Error boundaries catch all errors in React app',
      'try/catch in render replaces boundary',
      'Function components can be error boundaries natively',
    ],
    traps: ['Saying boundaries catch onClick errors'],
    strongSignals: [
      'Render/lifecycle only',
      'Route-level + feature-level placement',
      'Pair with Suspense and chunk retry',
    ],
  },
  keyTakeaways: [
    'Catch render/lifecycle errors in child tree only.',
    'Event handlers and async need separate handling.',
    'Class component or react-error-boundary library.',
    'Place at route and risky feature boundaries.',
    'Log in componentDidCatch; show user-friendly fallback.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is a React error boundary?',
      answerHint: 'Component that catches child render errors and shows fallback UI.',
    },
    {
      level: 'intermediate',
      question: 'Why won’t an error boundary catch a click handler throw?',
      answerHint: 'Boundaries only wrap render/lifecycle; events run outside that tree catch scope.',
    },
    {
      level: 'advanced',
      question: 'How architect error boundaries in a large SPA?',
      answerHint: 'Route-level outer boundary, per-widget inner boundaries, global handler for async, reset on nav.',
    },
  ],
  flashcards: [
    { front: 'Error boundary catches', back: 'Child render, lifecycle, constructor errors' },
    { front: 'Error boundary does NOT catch', back: 'Event handlers, async, errors in boundary itself' },
    { front: 'componentDidCatch', back: 'Side effects: log error + componentStack' },
  ],
  quickRevision: [
    'Render-phase try/catch for subtree',
    'Class or react-error-boundary',
    'Not for events/async',
    'Route + feature placement',
    'getDerivedStateFromError → fallback',
    'Log in componentDidCatch',
  ],
}
