import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'useRef returns a mutable ref object { current: T } persisting across renders without causing re-renders when .current changes — used for DOM element access, storing mutable values (timers, previous props), and keeping stable containers that should not trigger updates.',
  whyExists:
    'Some values need to survive renders without scheduling updates — imperative DOM focus, interval IDs, latest callback for stable effect deps. useRef separates mutable persistence from reactive state.',
  mentalModel:
    'const ref = useRef(initial). ref.current read/write anytime — no re-render. Pass ref={ref} to DOM for element handle. ref.current = x in render OK for sync external stores with care. Do not read/write ref during render to drive UI — use state for that.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'useRef creates box object stored on fiber across renders.',
        'Updating ref.current does not schedule re-render.',
        'DOM ref: attach to element; .current set after mount.',
        'Callback refs: ref={(el) => ...} for mount/unmount notification.',
        'Initial value only used on first render.',
      ],
    },
    {
      type: 'table',
      headers: ['Use case', 'Pattern'],
      rows: [
        ['Focus input', 'inputRef.current?.focus() in handler'],
        ['Previous value', 'prevRef.current = value in useEffect'],
        ['Stable interval callback', 'onTickRef.current = onTick each render'],
        ['Avoid re-render timer id', 'timerRef.current = setInterval(...)'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'DOM focus ref',
      code: `function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  return <input ref={inputRef} />;
}`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Latest callback ref pattern',
      code: `function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

// In effect with []: latestValueRef.current() always fresh`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'forwardRef passes ref through wrapper components to inner DOM.',
        'useImperativeHandle customizes ref value exposed to parent.',
        'Strict Mode remount resets DOM ref to new element.',
        'Refs not available during SSR render — check before DOM access.',
        'Do not use ref as substitute for lifted state visible in UI.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Mutable storage without re-render',
      'Imperative DOM integration',
      'Stable container for effects',
    ],
    disadvantages: [
      'Changes invisible to React — UI won’t auto-update',
      'Overuse hides reactive data flow',
      'Not serializable for SSR props',
    ],
    alternatives: [
      'useState when UI must reflect value',
      'useSyncExternalStore for external mutable stores',
    ],
    whenToUse: [
      'DOM measurements, focus, scroll, third-party widgets',
      'Previous value tracking, timer/websocket handles',
    ],
    whenNotToUse: [
      'Data that should display in UI — use state',
      'Replacing state to avoid re-renders of displayed data',
    ],
  },
  failureModes: [
    'Reading ref.current during render for UI — no update on change.',
    'Null ref before mount or after unmount.',
    'Storing derived UI state in ref — stale display.',
    'Forgotten forwardRef — ref undefined on wrapper.',
  ],
  production: {
    reliability: ['Null-check ref.current before DOM ops'],
    maintainability: ['useLatest hook for stable effect callbacks'],
  },
  interview: {
    expectations: [
      'Ref persists, no re-render on .current change',
      'DOM access primary use',
      'Ref vs state distinction',
    ],
    commonQuestions: [
      'What is useRef?',
      'Does changing ref.current re-render?',
      'useRef vs useState?',
    ],
    followUps: ['forwardRef purpose?', 'Callback ref vs object ref?'],
    misconceptions: [
      'useRef same as document.getElementById only',
      'Ref changes trigger re-render slowly',
      'Can replace all useState with useRef',
    ],
    traps: ['Saying ref update causes re-render'],
    strongSignals: [
      'Mutable box no re-render',
      'DOM imperative API',
      'Latest value in stable effect',
    ],
  },
  keyTakeaways: [
    'useRef holds mutable .current across renders.',
    'Updating ref does not re-render component.',
    'Primary: DOM refs and non-UI mutable values.',
    'useLatest pattern for fresh values in [] effects.',
    'Use state when value should drive UI.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Changing ref.current triggers re-render?',
      answerHint: 'No — ref updates are silent to React render cycle.',
    },
    {
      level: 'intermediate',
      question: 'useRef vs useState?',
      answerHint: 'State triggers re-render on change; ref persists mutable value without render.',
    },
    {
      level: 'advanced',
      question: 'Why ref pattern for interval callback with [] effect?',
      answerHint: 'Stable effect subscription; ref.current always latest handler without re-subscribing.',
    },
  ],
  flashcards: [
    { front: 'useRef', back: 'Mutable { current } — no re-render on update' },
    { front: 'DOM ref', back: 'ref={ref} → ref.current is HTMLElement after mount' },
    { front: 'Ref not for', back: 'Values that must appear in UI — use state' },
  ],
  quickRevision: [
    'Persists across renders',
    'No re-render on change',
    'DOM focus/measure',
    'Timer/ws handles',
    'useLatest pattern',
    'forwardRef for wrappers',
  ],
}
