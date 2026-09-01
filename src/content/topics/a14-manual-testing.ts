import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Manual testing in interviews means walking through your code with concrete examples—including edge cases—on paper or verbally, simulating variable values line by line before declaring done. No IDE debugger required.',
  whyExists:
    'Live coding lacks unit test runners. Manual traces catch off-by-one errors, null handling bugs, and wrong return values. Demonstrates verification discipline expected in production.',
  mentalModel:
    'Dry run like a CPU: track variables in a small table for each line on a tiny input, then on an edge input.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Use given example first; show variable states.',
        'Run one edge case (empty, single, max).',
        'Check loop invariants at entry/exit.',
        'Verify return value and side effects.',
        'If bug found, fix and re-trace affected section only.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Binary search target=3 in [1,2,3,4]: lo=0,hi=3,mid=1,val=2<3 → lo=2; mid=2,val=3 return 2. Edge: empty → return -1 immediately.',
    },
  ],
  tradeoffs: {
    advantages: ['Catches bugs before submit', 'Shows rigor', 'No tooling needed'],
    disadvantages: ['Slow on long code', 'Easy to hand-wave incorrectly'],
    alternatives: ['Mini test table on whiteboard', 'Write pseudo-assertions after code'],
    whenToUse: ['Before saying finished', 'After bug fix', 'When interviewer asks walkthrough'],
    whenNotToUse: ['Do not skip on "easy" problems—edges still fail'],
  },
  failureModes: [
    'Only trace happy path.',
    'Hand-wave loops without updating indices.',
    'Ignore mutated input state.',
  ],
  interview: {
    expectations: ['Trace at least 2 cases', 'Find own bug if present', 'Clear variable tracking'],
    commonQuestions: ['Walk me through your code', 'What if input empty?'],
    followUps: ['Add failing test?', 'Complexity of trace?'],
    misconceptions: ['Compiler will catch it', 'One example enough'],
    traps: ['Infinite loop not noticed', 'Wrong mid in binary search trace'],
    strongSignals: ['Structured table trace', 'Proactively tests edge without prompt'],
  },
  keyTakeaways: [
    'Dry-run given example plus one edge case.',
    'Track key variables each loop iteration.',
    'Verify return and in-place mutations.',
    'Fix and re-test after changes.',
    'Manual test replaces debugger in interview.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Minimum tests before done?', answerHint: 'Provided example + at least one edge e.g. empty or single.' },
    { level: 'intermediate', question: 'How trace nested loops?', answerHint: 'Small input; table of i,j and condition; watch when inner breaks.' },
    { level: 'advanced', question: 'Test recursive function manually?', answerHint: 'Draw call tree small input; verify base case returns; track stack depth.' },
  ],
  flashcards: [
    { front: 'Manual test minimum cases', back: 'Happy path example + one edge case.' },
    { front: 'When to manual test', back: 'Before declaring solution complete.' },
  ],
  quickRevision: [
    'Trace line by line',
    'Happy + edge case',
    'Track loop variables',
    'Check return value',
    'Verify mutations',
    'Re-trace after fix',
    'No debugger needed',
  ],
}
