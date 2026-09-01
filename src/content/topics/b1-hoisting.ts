import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Hoisting is JavaScript compile-time behavior where declarations (var, function, class, let, const) are registered in their scope before execution. var and function declarations behave differently from let/const (TDZ). Assignments are not hoisted.',
  whyExists:
    'Engines parse code in two phases — creation then execution — so bindings must exist before lines run. Historical function declaration hoisting enabled mutual recursion; let/const TDZ fixes var bugs while keeping declarative hoisting.',
  mentalModel:
    'Before the first line runs, the engine scans the scope and reserves names on shelves. var shelves get undefined; function declarations get the full function; let/const shelves exist but are locked (TDZ) until their line runs. Assignments happen only when the line executes.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'var: hoisted and initialized undefined; usable before line (value undefined).',
        'function declaration: hoisted with full body — callable before definition line in same scope.',
        'let/const: hoisted but in Temporal Dead Zone until declaration — ReferenceError if accessed early.',
        'class: hoisted like let — TDZ until class statement.',
        'function expression / arrow: only variable name hoisted (var), not the function value until assignment.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Only declarations hoist',
      text: 'console.log(x); var x = 5 → undefined, not 5. console.log(y); let y = 5 → ReferenceError (TDZ).',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Parse[Parse scope]
  Var[var → undefined]
  Fn[function decl → fn object]
  TDZ[let/const/class → TDZ]
  Run[Execute line by line]
  Parse --> Var
  Parse --> Fn
  Parse --> TDZ
  Var --> Run
  Fn --> Run
  TDZ -->|after decl line| Run`,
    caption: 'Declarations registered at creation; let/const blocked until init',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'var vs let vs function declaration',
      code: `console.log(foo()); // works — function hoisted
function foo() { return 'hi'; }

console.log(a); // undefined
var a = 1;

console.log(b); // ReferenceError — TDZ
let b = 2;

console.log(typeof c); // ReferenceError — TDZ (not 'undefined')
let c = 3;`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Function expression vs declaration',
      code: `console.log(fdecl()); // OK
function fdecl() { return 1; }

console.log(fexpr); // undefined (var hoisted)
console.log(fexpr()); // TypeError — not a function yet
var fexpr = function () { return 2; };`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Creation phase of execution context registers bindings.',
        'TDZ: binding exists but IsInitialized false until declaration evaluated.',
        'Block-scoped function declarations behave differently in sloppy vs strict blocks (ES6 nuance).',
        'import declarations hoisted but live bindings — TDZ-like until module evaluated.',
        'Hoisting is per scope — function body has own hoisting realm.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Function declarations enable mutual recursion',
      'let/const TDZ catches use-before-declare bugs',
      'Predictable once rules understood',
    ],
    disadvantages: [
      'var hoisting causes undefined reads instead of errors',
      'Surprises newcomers and linters exist for reason',
      'Block function decl edge cases in older modes',
    ],
    alternatives: ['Always let/const; declare before use; eslint no-use-before-define'],
    whenToUse: ['Understanding ReferenceError vs undefined bugs'],
    whenNotToUse: ['Relying on var/function hoisting in new code — declare first'],
  },
  failureModes: [
    'var in loops + closures before let existed.',
    'Temporal dead zone with typeof let in TDZ.',
    'Assuming import hoisting means synchronous value available anywhere.',
  ],
  production: {
    maintainability: ['eslint: no-var, no-use-before-define; prefer const'],
    reliability: ['TDZ errors in init order — reorder declarations'],
  },
  interview: {
    expectations: [
      'var undefined vs let TDZ',
      'function declaration hoisted fully',
      'Assignments not hoisted',
    ],
    commonQuestions: ['Output before var/let?', 'Hoist function expression?', 'What is TDZ?'],
    followUps: ['class hoisting?', 'import hoisting?'],
    misconceptions: ['Hoisting moves lines physically', 'let not hoisted at all'],
    traps: ['typeof undeclared var vs let in TDZ'],
    strongSignals: ['Creation phase, TDZ, declaration vs assignment, function decl vs expr'],
  },
  keyTakeaways: [
    'Declarations registered before run; assignments stay in place.',
    'var → undefined; function decl → full function.',
    'let/const/class → TDZ until declaration line.',
    'Function expressions: only var name hoisted.',
    'Prefer let/const and declare before use.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is hoisting?',
      answerHint: 'Declarations processed before execution in scope; behavior differs by kind.',
    },
    {
      level: 'intermediate',
      question: 'What is the Temporal Dead Zone?',
      answerHint: 'let/const bound but inaccessible from start of block until declaration — ReferenceError.',
    },
    {
      level: 'advanced',
      question: 'Difference hoisting function declaration vs var fn = function?',
      answerHint: 'Decl: whole function hoisted; expr: var undefined until assignment line.',
    },
  ],
  flashcards: [
    { front: 'var before decl', back: 'undefined (hoisted + init undefined)' },
    { front: 'let before decl', back: 'ReferenceError — TDZ' },
    { front: 'function declaration', back: 'Fully hoisted — callable early' },
  ],
  quickRevision: [
    'Creation phase registers bindings',
    'var: undefined early',
    'let/const: TDZ',
    'function decl: hoisted body',
    'expr: var name only',
    'Assignments not hoisted',
  ],
}
