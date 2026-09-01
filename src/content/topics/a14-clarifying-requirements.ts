import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Clarifying requirements means asking targeted questions before coding—input sizes, edge cases, duplicates, negative numbers, sorted input, return format, and whether to optimize time or space. Converts ambiguous prompts into a concrete spec.',
  whyExists:
    'Many interview problems are intentionally underspecified. Candidates who assume wrong constraints build incorrect solutions. Clarifying mirrors real engineering before implementation and earns interviewer trust.',
  mentalModel:
    'Contract negotiation before construction: agree on what "done" means so you do not build the wrong house.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Input domain: empty? negatives? duplicates? sorted?',
        'Output: index vs value? all solutions or one? sort order?',
        'Constraints: n max, memory limits, modify in-place?',
        'Behavior on invalid input: throw vs return sentinel?',
        'Confirm examples including edge cases verbally.',
      ],
    },
    {
      type: 'table',
      headers: ['Question', 'Why it matters'],
      rows: [
        ['Can input be empty?', 'Base case handling'],
        ['Distinct elements?', 'Set vs multiset algorithms'],
        ['Sorted array?', 'Two-pointer vs sort first'],
        ['Return any valid answer?', 'Early exit vs enumerate all'],
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Before Two Sum: ask if array sorted, duplicates allowed, return indices or values, and behavior when no pair exists.',
    },
  ],
  tradeoffs: {
    advantages: ['Prevents wrong assumptions', 'Shows product sense', 'Short questions save rework'],
    disadvantages: ['Too many questions delay start', 'Some interviewers want fast coding'],
    alternatives: ['State assumptions explicitly if no answer', 'Use provided examples as spec'],
    whenToUse: ['Start of every problem', 'Whenever examples contradict your assumption'],
    whenNotToUse: ['Interviewer says "assume standard LeetCode constraints" after first batch'],
  },
  failureModes: [
    'Never ask then fail on empty input.',
    'Ask ten low-value questions without coding.',
    'Ignore answer and assume anyway.',
  ],
  interview: {
    expectations: ['2-5 good clarifying questions', 'State assumptions if unanswered', 'Confirm with example trace'],
    commonQuestions: ['Evaluate requirement gathering', 'Two Sum variant clarifications'],
    followUps: ['What if interviewer is vague?', 'Written vs verbal clarify?'],
    misconceptions: ['Asking questions looks weak', 'Examples optional'],
    traps: ['Modify input when forbidden', 'Return wrong type (index 0 vs value)'],
    strongSignals: ['Tailored questions per problem', 'Records assumptions on board'],
  },
  keyTakeaways: [
    'Ask before code: size, duplicates, sorted, output format.',
    'Confirm edge cases: empty, single element, negatives.',
    'State assumptions explicitly if unanswered.',
    '2-5 focused questions beat twenty vague ones.',
    'Examples are part of the spec—walk through them.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What to clarify on array problem?', answerHint: 'Empty, sorted, duplicates, value range, return indices or values.' },
    { level: 'intermediate', question: 'Interviewer vague on constraints?', answerHint: 'State reasonable assumption aloud and proceed; adjust if corrected.' },
    { level: 'advanced', question: 'Clarify for system design vs coding?', answerHint: 'Coding: I/O and edges; design: scale, SLA, consistency, actors.' },
  ],
  flashcards: [
    { front: 'Always clarify', back: 'Input/output format, edges, constraints.' },
    { front: 'If no answer to question', back: 'State assumption explicitly and continue.' },
  ],
  quickRevision: [
    'Ask before coding',
    'Empty and single edge',
    'Duplicates sorted?',
    'Output format exact',
    'Modify in-place OK?',
    'State assumptions',
    'Walk given examples',
  ],
}
