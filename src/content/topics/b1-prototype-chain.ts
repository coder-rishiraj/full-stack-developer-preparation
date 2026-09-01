import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'The prototype chain is JavaScript’s inheritance mechanism: objects delegate property lookups to their [[Prototype]] (accessed via Object.getPrototypeOf or __proto__). If a key is missing on the object, the engine walks the chain until null.',
  whyExists:
    'JS originally had no class syntax. Prototypes let instances share methods on a common object, saving memory and enabling dynamic delegation — the model underlying `new`, `extends`, and built-ins like Array.',
  mentalModel:
    'Each object has a hidden link to a “parent template object.” Read: check self, then parent, then grandparent, until undefined. Write: usually creates own property unless modifying existing accessor on prototype.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Object created with literal, Object.create(proto), or constructor + new.',
        '[[Prototype]] set at creation (or via Object.setPrototypeOf — slow).',
        'Get property: walk own keys → prototype → prototype.prototype → null.',
        'Set property: if own or data prop on chain assignable, set on target object (shadowing).',
        'Functions have .prototype used when called with new — instance [[Prototype]] = Fn.prototype.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Shadowing vs mutation',
      text: 'obj.toString = 1 shadows Object.prototype.toString on obj only. Mutating Array.prototype affects all arrays — avoid in libraries.',
    },
  ],
  architecture: {
    mermaid: `flowchart BT
  inst[instance]
  ctorProto[Constructor.prototype]
  objProto[Object.prototype]
  nullNode[null]
  inst -->|[[Prototype]]| ctorProto
  ctorProto -->|[[Prototype]]| objProto
  objProto --> nullNode
  inst -.->|hasOwnProperty| inst`,
    caption: 'Typical chain: instance → Constructor.prototype → Object.prototype → null',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Delegation lookup',
      code: `const animal = { speaks: true };
const dog = Object.create(animal);
dog.barks = true;

console.log(dog.speaks); // true — delegated
console.log('speaks' in dog); // true — chain walk
console.log(dog.hasOwnProperty('speaks')); // false`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Constructor + new',
      code: `function Person(name) {
  this.name = name;
}
Person.prototype.greet = function () {
  return \`Hi, \${this.name}\`;
};
const p = new Person('Ada');
p.greet(); // Hi, Ada — method on prototype`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'class syntax desugars to constructor + prototype methods (mostly).',
        'Object.create(null) makes dict with no Object.prototype pollution.',
        'hasOwnProperty vs in operator: own vs anywhere on chain.',
        'instanceof checks if Constructor.prototype appears in instance’s prototype chain.',
        'Modern alternative: class fields + private #fields (not on prototype).',
      ],
    },
  ],
  templates: [
    {
      language: 'typescript',
      caption: 'class extends — prototype chain preserved',
      code: `class Animal {
  constructor(public name: string) {}
  speak() { return \`\${this.name} makes a sound\`; }
}
class Dog extends Animal {
  speak() { return \`\${this.name} barks\`; }
}
const d = new Dog('Rex');
d.speak(); // Rex barks — super calls parent prototype method`,
    },
    {
      language: 'javascript',
      caption: 'Safe factory without shared mutable prototype pollution',
      code: `function createUser(name) {
  return Object.assign(Object.create(userProto), { name });
}
const userProto = {
  greet() { return \`Hello, \${this.name}\`; },
};`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Shared methods — memory efficient',
      'Dynamic — add methods to prototype at runtime',
      'Uniform model for builtins (Array, Date)',
    ],
    disadvantages: [
      'Confusing vs class-based languages',
      'Prototype mutation is global side effect',
      'Performance: long chains rare but lookup cost adds up',
    ],
    alternatives: ['Composition over inheritance', 'Object.assign / spread for mixins', 'Class fields (own props)'],
    whenToUse: ['Understanding builtins, instanceof, library extension patterns'],
    whenNotToUse: ['Monkey-patching built-in prototypes in production libs'],
  },
  failureModes: [
    'Mutating Array.prototype breaks assumptions across app.',
    'for-in without hasOwnProperty iterates inherited enumerable keys.',
    'Confusing __proto__ with .prototype on functions.',
    'Object.setPrototypeOf after creation — deopts engines.',
  ],
  production: {
    maintainability: ['Prefer composition; avoid extending native prototypes'],
    performance: ['Keep chains shallow; monomorphic property access helps JIT'],
    reliability: ['Use Object.create(null) for pure maps when needed'],
  },
  interview: {
    expectations: [
      'Explain [[Prototype]] lookup vs own properties',
      'Difference .prototype vs __proto__',
      'How new sets instance prototype',
    ],
    commonQuestions: ['What is prototype chain?', 'Implement new?', 'instanceof how it works?'],
    followUps: ['class vs prototype?', 'Object.create vs {}?'],
    misconceptions: ['Every object copies methods from prototype', '__proto__ is the same as constructor.prototype on instances'],
    traps: ['Where methods live on class syntax', 'Shadowing vs changing prototype object'],
    strongSignals: ['Delegation not copy, hasOwnProperty, null terminator, Fn.prototype on new'],
  },
  keyTakeaways: [
    'Objects delegate to [[Prototype]] — not class copying.',
    'Lookup walks chain until null.',
    'Function.prototype is template for new instances.',
    'class extends builds on same prototype machinery.',
    'Never mutate built-in prototypes in shared code.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What happens when you read a missing property on an object?',
      answerHint: 'Engine walks prototype chain until found or null.',
    },
    {
      level: 'intermediate',
      question: 'Difference between __proto__ and prototype on a function?',
      answerHint: 'Fn.prototype is template for instances; obj.__proto__ is instance’s link (legacy name).',
    },
    {
      level: 'advanced',
      question: 'How does instanceof work internally?',
      answerHint: 'Checks if Constructor.prototype is in object’s prototype chain.',
    },
  ],
  flashcards: [
    { front: 'Prototype chain end', back: 'null' },
    { front: 'new Foo()', back: 'instance [[Prototype]] = Foo.prototype' },
    { front: 'hasOwnProperty vs in', back: 'Own only vs entire chain' },
  ],
  quickRevision: [
    'Delegation via [[Prototype]]',
    'Lookup: own → chain → null',
    'Fn.prototype for new instances',
    'class is prototype sugar',
    'Shadowing hides prototype props',
    'Don’t patch Array.prototype',
  ],
}
