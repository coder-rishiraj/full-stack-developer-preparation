import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Composition assembles behavior by containing other objects (“has-a”); inheritance derives behavior from a parent class (“is-a”). Favor composition when relationships are behavioral reuse or variation, not true subtype substitutability.',
  whyExists:
    'Deep inheritance hierarchies become rigid — changing a base class breaks subclasses, diamond problems appear, and LSP violations hide in overrides. Composition lets you combine capabilities flexibly without locking into a single taxonomy.',
  mentalModel:
    'Inheritance: Duck extends Bird — fixed taxonomy. Composition: Robot has a FlyBehavior and a SpeakBehavior — swap behaviors at runtime. “Has-a” beats fragile “is-a” when the relationship is feature mixing, not biological category.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Aspect', 'Inheritance', 'Composition'],
      rows: [
        ['Relationship', 'is-a (subtype)', 'has-a (delegate)'],
        ['Flexibility', 'Fixed at compile time', 'Swap collaborators at runtime'],
        ['Coupling', 'Tight to superclass changes', 'Looser via interfaces'],
        ['Reuse', 'Override/extend methods', 'Delegate to composed objects'],
        ['Risk', 'LSP violations, fragile base class', 'More wiring/boilerplate'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Composition: context delegates to strategy components',
      diagram: `classDiagram
  class Car {
    -engine: Engine
    -gps: Navigation
    +drive()
  }
  class Engine
  class ElectricEngine
  class GasEngine
  Engine <|.. ElectricEngine
  Engine <|.. GasEngine
  Car --> Engine
  Car --> Navigation`,
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Classic smell',
      text: 'Stack extends ArrayList “for reuse” — exposes wrong API (push on index 5). Prefer composition: Stack wraps private List and exposes push/pop only.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Text styling: inheritance `BoldItalicUnderlineText extends BoldText` explodes combinations. Composition: Text with list of `TextDecorator` (Bold, Italic) applied in order.',
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Composition over inheritance for behaviors',
      code: `public interface FlyBehavior { void fly(); }

public class Duck {
  private FlyBehavior flyBehavior;
  public Duck(FlyBehavior flyBehavior) { this.flyBehavior = flyBehavior; }
  public void performFly() { flyBehavior.fly(); }
  public void setFlyBehavior(FlyBehavior b) { this.flyBehavior = b; }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Inheritance when true subtype contract holds',
      code: `public abstract class Shape {
  public abstract double area();
}
public class Circle extends Shape {
  private final double radius;
  public double area() { return Math.PI * radius * radius; }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Delegate instead of extend for reuse',
      code: `public class Stack<E> {
  private final Deque<E> deque = new ArrayDeque<>();
  public void push(E e) { deque.push(e); }
  public E pop() { return deque.pop(); }
}`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Composition: runtime flexibility, smaller hierarchies',
      'Inheritance: concise when subtype relationship is real and stable',
      'Composition avoids fragile base class problem',
    ],
    disadvantages: [
      'Composition: more objects and delegation boilerplate',
      'Inheritance: deep trees hard to navigate and test',
      'Over-composition: wrapper hell without clear interfaces',
    ],
    alternatives: [
      'Mixins / traits (language-dependent)',
      'Functional composition of plain functions',
      'Delegation via default interface methods',
    ],
    whenToUse: [
      'Composition: varying behavior, strategy-like features',
      'Inheritance: shared template with fixed skeleton (Template Method)',
      'Inheritance: true polymorphic substitutability (Shape, Stream)',
    ],
    whenNotToUse: [
      'Inheritance for code reuse only (Stack extends Vector)',
      'Composition when framework requires subclass hook (Servlet)',
    ],
  },
  failureModes: [
    'Subclass overrides break base invariants (LSP)',
    'God superclass accumulating unrelated methods',
    'Composition without interfaces → concrete coupling',
    'Multiple inheritance workarounds (mixing interfaces with default methods poorly)',
  ],
  production: {
    maintainability: ['Prefer shallow inheritance (≤2 levels)', 'Document which collaborators are swappable'],
    performance: ['Delegation cost negligible vs I/O; don’t inherit for micro-opts'],
  },
  interview: {
    expectations: [
      'State “favor composition over inheritance” with nuance',
      'Give Stack/ArrayList or Duck/FlyBehavior example',
      'Link to LSP and fragile base class',
    ],
    commonQuestions: [
      'Composition vs inheritance?',
      'When is inheritance appropriate?',
      'Fix Square extends Rectangle',
    ],
    followUps: [
      'How does Decorator relate?',
      'Composition in React (hooks vs HOC)?',
    ],
    misconceptions: [
      'Never use inheritance — Template Method and frameworks use it legitimately',
      'Composition always means more classes is bad',
    ],
    traps: [
      'Reciting slogan without example',
      'Proposing inheritance for every shared method',
    ],
    strongSignals: [
      'Square/Rectangle fix via composition or separate types',
      'Mentions Strategy/Decorator as composition patterns',
    ],
  },
  keyTakeaways: [
    'Default to composition for behavioral reuse.',
    'Use inheritance when is-a is true and substitutability holds.',
    'Avoid inheriting just to reuse code — delegate instead.',
    'Fragile base class: parent change breaks children.',
    'Decorator/Strategy are composition in pattern form.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Composition vs inheritance?', answerHint: 'Has-a delegate vs is-a extend; composition more flexible.' },
    { level: 'intermediate', question: 'Square/Rectangle problem?', answerHint: 'Inheritance breaks LSP; use separate types or composition.' },
    { level: 'intermediate', question: 'When inherit?', answerHint: 'Stable subtype, shared protocol, framework extension points.' },
    { level: 'advanced', question: 'Fragile base class?', answerHint: 'Subclass depends on parent internals; parent change breaks subclasses.' },
  ],
  flashcards: [
    { front: 'Favor composition over inheritance', back: 'Delegate behaviors; avoid deep is-a trees for reuse' },
    { front: 'Fragile base class', back: 'Superclass changes ripple unpredictably to subclasses' },
    { front: 'Stack extends ArrayList smell', back: 'Wrong is-a; wrap List instead' },
    { front: 'LSP link', back: 'Bad inheritance → subtypes break caller assumptions' },
  ],
  quickRevision: [
    'Has-a > is-a for behavior mix',
    'Inherit real subtypes only',
    'Delegate to composed objects',
    'Stack wraps List',
    'Decorator = composition pattern',
  ],
  patternRecognition: [
    'Deep hierarchy for feature flags → Strategy + composition',
    'extends for one helper method → extract utility or compose',
  ],
  commonMistakes: [
    'Inheriting concrete class to call protected method',
    'Multiple parallel subclasses for combinatorial features',
  ],
}
