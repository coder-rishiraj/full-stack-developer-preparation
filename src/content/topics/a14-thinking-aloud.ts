import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Thinking aloud means narrating your problem-solving process in real time—restating the problem, proposing approaches, noting tradeoffs, and explaining code as you write. Interviewers evaluate communication and reasoning, not just the final answer.',
  whyExists:
    'Silent coding hides mistakes until too late and fails communication rubrics. Verbalizing creates collaboration signals, lets interviewers offer timely hints, and demonstrates senior-level clarity under pressure.',
  mentalModel:
    'Sports commentary on your own play: say what you see, what you plan, and why—so the coach (interviewer) can follow without reading your mind.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Restate problem and confirm inputs/outputs/examples.',
        'Propose brute force first with complexity aloud.',
        'State optimization idea before coding.',
        'Narrate non-obvious lines while typing.',
        'After coding, walk through example and complexity.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: '"This looks like interval scheduling. I will sort by end time, greedily pick compatible intervals—that should be O(n log n). Let me trace [1,3],[2,4],[3,5] after sort..."',
    },
  ],
  tradeoffs: {
    advantages: ['Unlocks hints early', 'Shows structured thinking', 'Reduces silent dead-ends'],
    disadvantages: ['Can slow typing if over-narrate', 'Needs practice to feel natural', 'Risk talking instead of coding'],
    alternatives: ['Write brief outline on whiteboard first', 'Pause points every 5 minutes'],
    whenToUse: ['All live coding interviews', 'When stuck—say what you are considering'],
    whenNotToUse: ['Never go completely silent for 10+ minutes'],
  },
  failureModes: [
    'Narrating syntax letter-by-letter without intent.',
    'Apologizing excessively instead of proceeding.',
    'Stating wrong approach confidently without checking examples.',
  ],
  interview: {
    expectations: ['Continuous partial progress signals', 'Clear structure', 'Invite collaboration when stuck'],
    commonQuestions: ['Evaluate communication rubric', 'Mock feedback on silence'],
    followUps: ['How much detail?', 'Balance talk vs code?'],
    misconceptions: ['Only final code matters', 'Thinking aloud is optional'],
    traps: ['Memorized script without adapting to problem', 'Ignoring interviewer questions while talking'],
    strongSignals: ['Labels phases: clarify, brute, optimize, test', 'Summarizes before deep dive'],
  },
  keyTakeaways: [
    'Talk through clarify → approach → code → test.',
    'Silence longer than 2 minutes is a red flag.',
    'Explain why, not every keystroke.',
    'State complexity when proposing approach.',
    'Invite feedback: "Does this direction sound reasonable?"',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What should you say first in coding interview?', answerHint: 'Restate problem, confirm examples/constraints, outline high-level plan.' },
    { level: 'intermediate', question: 'How to think aloud when stuck?', answerHint: 'State what you tried, what failed, next hypothesis; ask targeted question.' },
    { level: 'advanced', question: 'Balance narration vs coding time?', answerHint: 'Brief plan upfront; narrate key decisions and tricky loops; quiet during boilerplate.' },
  ],
  flashcards: [
    { front: 'First step thinking aloud', back: 'Restate problem and confirm examples.' },
    { front: 'Max silent coding duration guideline', back: 'Avoid long silence; check in every few minutes.' },
  ],
  quickRevision: [
    'Restate problem first',
    'Say brute then optimize',
    'Explain non-obvious code',
    'Trace example after code',
    'State Big-O aloud',
    'Ask if direction OK',
    'No long silence',
  ],
}
