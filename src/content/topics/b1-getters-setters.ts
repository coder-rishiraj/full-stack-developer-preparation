import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Getters & Setters",
  "whatIsIt": "get x() and set x(v) are accessor properties. Reading x calls get; writing calls set. They can live in literals, classes, or defineProperty. An accessor without a setter is read-only from assignment’s point of view. Getters that mutate are surprising. JSON.stringify invokes getters.",
  "whyExists": "Computed properties and validation need a hook on read/write without changing the obj.x syntax.",
  "mentalModel": "A property that is actually two functions wearing a field costume.",
  "how": [
    "Keep getters cheap and pure.",
    "Use setters to validate or sync side state.",
    "Do not recurse: `set x(v) { this.x = v }` stack-overflows.",
    "defineProperty get/set for dynamic names."
  ],
  "callout": {
    "title": "Watch for",
    "text": "JSON.stringify calls getters — a getter that throws or is expensive will bite serialization.",
    "variant": "warning"
  },
  "example": "const temp = {\n  c: 0,\n  get f() { return this.c * 1.8 + 32; },\n  set f(v) { this.c = (v - 32) / 1.8; },\n};\ntemp.f = 212;\nconsole.log(temp.c, temp.f);\nconst o = { get x() { return 1; } };\ntry { o.x = 2; } catch (e) { console.log(e.name); }\n",
  "exampleCaption": "Fahrenheit accessor over Celsius storage",
  "internals": [
    "[[Get]] calls the get function with this = the receiver.",
    "[[Set]] calls set or fails if no setter and strict.",
    "Accessors have [[Get]]/[[Set]] slots instead of [[Value]]/[[Writable]]."
  ],
  "takeaways": [
    "Keep getters cheap and pure.",
    "Use setters to validate or sync side state.",
    "JSON.stringify calls getters — a getter that throws or is expensive will bite serialization.",
    "[[Get]] calls the get function with this = the receiver."
  ],
  "revision": [
    "Getters & Setters: A property that is actually two functions wearing a field costume.",
    "Keep getters cheap and pure.",
    "Use setters to validate or sync side state.",
    "Do not recurse: `set x(v) { this.x = v }` stack-overflows.",
    "Trap: JSON.stringify calls getters — a getter that throws or is expensive will bite serialization."
  ],
  "flashcards": [
    [
      "Getters & Setters",
      "get x() and set x(v) are accessor properties."
    ],
    [
      "Mental model",
      "A property that is actually two functions wearing a field costume."
    ],
    [
      "Common trap",
      "JSON.stringify calls getters — a getter that throws or is expensive will bite serialization."
    ],
    [
      "Keep getters cheap and pure.",
      "Use setters to validate or sync side state."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Getters & Setters and where does a beginner first see it?",
      "answerHint": "get x() and set x(v) are accessor properties. Reading x calls get; writing calls set. They can live in literals, classes, or defineProperty. An accessor without a setter is read-only from assignment’s point of view. Getters that mutate are surprising. JSON.stringify invokes getters."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Getters & Setters works and name the main pitfall.",
      "answerHint": "Keep getters cheap and pure. Use setters to validate or sync side state. Do not recurse: `set x(v) { this.x = v }` stack-overflows. defineProperty get/set for dynamic names. Pitfall: JSON.stringify calls getters — a getter that throws or is expensive will bite serialization."
    },
    {
      "level": "advanced",
      "question": "How would you explain Getters & Setters at an interview, including engine/spec details?",
      "answerHint": "[[Get]] calls the get function with this = the receiver. [[Set]] calls set or fails if no setter and strict. Accessors have [[Get]]/[[Set]] slots instead of [[Value]]/[[Writable]]."
    }
  ],
  "pitfalls": [
    "JSON.stringify calls getters — a getter that throws or is expensive will bite serialization.",
    "defineProperty get/set for dynamic names."
  ],
  "interview": {
    "expectations": [
      "Explain Getters & Setters without mixing it up with a nearby B1.14 — Object Property Model topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "[[Get]] calls the get function with this = the receiver."
    ],
    "commonQuestions": [
      "What is Getters & Setters?",
      "Why does JavaScript getters & setters behave this way?",
      "What is the classic Getters & Setters interview trap?"
    ],
    "traps": [
      "JSON.stringify calls getters — a getter that throws or is expensive will bite serialization."
    ],
    "misconceptions": [
      "Computed properties and validation need a hook on read/write without changing the obj.x syntax."
    ],
    "strongSignals": [
      "Separates Getters & Setters from lookalike APIs and can draw the mental model."
    ]
  }
})
