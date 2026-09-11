import type { TopicContent } from '@/domain/types'

export type GraphCode = { caption: string; code: string }

export type GraphAlgoSpec = {
  problem: string
  intuition: string
  steps: string[]
  codes: GraphCode[]
  time: string
  space: string
  analysis: string
  notes?: string[]
  patterns?: string[]
  mistakes?: string[]
  takeaways?: string[]
}

/** Shared study scaffold matching the printable Graph Algorithms Reference depth. */
export function buildGraphAlgo(spec: GraphAlgoSpec): TopicContent {
  const notes = spec.notes ?? []
  return {
    whatIsIt: spec.problem,
    whyExists: spec.intuition,
    mentalModel: spec.intuition,
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: spec.steps,
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Complexity analysis',
        text: spec.analysis,
      },
      ...(notes.length
        ? ([
            {
              type: 'callout' as const,
              variant: 'tip' as const,
              title: 'Notes',
              text: notes.join(' '),
            },
          ] as const)
        : []),
    ],
    templates: spec.codes.map((c) => ({
      language: 'java',
      caption: c.caption,
      code: c.code,
    })),
    complexity: {
      best: spec.time,
      average: spec.time,
      worst: spec.time,
      space: spec.space,
    },
    patternRecognition: spec.patterns ?? [
      'Identify vertices, edges, direction, and weights before coding.',
      'Match the ask (path / cycle / order / MST / SCC) to this template.',
    ],
    commonMistakes: spec.mistakes ?? [
      'Forgetting disconnected components (loop all unvisited starts).',
      'Using the wrong shortest-path family for the weight model.',
    ],
    keyTakeaways: spec.takeaways ?? [
      spec.problem.split('.')[0] + '.',
      `Time ${spec.time}; space ${spec.space}.`,
      spec.intuition.slice(0, 140) + (spec.intuition.length > 140 ? '…' : ''),
    ],
    interview: {
      expectations: [
        'State the problem, graph model (directed/weighted), and complexity.',
        'Name the invariant (queue order, parent, GRAY stack, disc/low, heap key, etc.).',
        'Give one classic practice problem that uses this template.',
      ],
      commonQuestions: [
        'Walk through the steps on a small graph.',
        'What breaks if the graph is disconnected or has negative weights?',
        'How does this compare to the next-best algorithm for the same ask?',
      ],
      followUps: [
        'Can you reconstruct the path / cycle / MST edges?',
        'What is the space bottleneck on V≈1e5?',
      ],
      misconceptions: [
        'Treating visited alone as enough for directed cycles.',
        'Using Dijkstra with negative edges.',
      ],
      traps: [
        'Coding before classifying direction and weights.',
        'Forgetting the all-components loop.',
      ],
      strongSignals: [
        'Recites the algorithm with complexity and a clear failure mode.',
        'Connects the template to constraints (V, E, weight signs).',
      ],
    },
    interviewQuestions: [
      {
        level: 'basic',
        question: 'State the problem this algorithm solves and its complexity.',
        answerHint: `${spec.time} time, ${spec.space} space. ${spec.problem.slice(0, 120)}`,
      },
      {
        level: 'intermediate',
        question: 'Walk through the steps and the key invariant.',
        answerHint: spec.steps.join(' → '),
      },
      {
        level: 'advanced',
        question: 'When would you pick a different algorithm instead?',
        answerHint: spec.notes?.join(' ') || spec.analysis,
      },
    ],
    flashcards: [
      {
        front: 'Problem',
        back: spec.problem,
      },
      {
        front: 'Complexity',
        back: `Time ${spec.time}; space ${spec.space}`,
      },
      {
        front: 'Main idea',
        back: spec.intuition.slice(0, 200) + (spec.intuition.length > 200 ? '…' : ''),
      },
    ],
    quickRevision: [
      spec.problem.split('.')[0],
      `Idea: ${spec.intuition.slice(0, 100)}${spec.intuition.length > 100 ? '…' : ''}`,
      `Time ${spec.time} · Space ${spec.space}`,
      ...spec.steps.slice(0, 3).map((s, i) => `${i + 1}. ${s}`),
    ],
  }
}
