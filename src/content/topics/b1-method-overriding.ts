import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Method Overriding",
  "whatIsIt": "A subclass method with the same name hides the parent’s on the instance’s prototype chain (the instance’s proto is Sub.prototype which has the new method). Parent code that calls this.method() from a parent function will still dispatch to the subclass (polymorphism) unless it uses super. There is no Java-style overload by arity.",
  "whyExists": "Polymorphism: one call site, many behaviors. Overriding is how subclasses specialize.",
  "mentalModel": "The nearest method on the chain wins. Parent methods that call this.foo() look up foo from the instance, which may be the override.",
  "how": [
    "Override to specialize; call super.method() to extend.",
    "Keep the same contract (args/return) to avoid LSP surprises.",
    "There is no overload — last method of that name in the class body wins.",
    "Arrow fields on the subclass shadow prototype methods of the parent."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Thinking parent.shout always uses parent.speak — this.speak is dynamic dispatch.",
    "variant": "warning"
  },
  "example": "class Speaker {\n  speak() { return 'base'; }\n  shout() { return this.speak().toUpperCase(); }\n}\nclass Robot extends Speaker {\n  speak() { return 'beep'; }\n}\nconsole.log(new Robot().shout());\nconsole.log(new Speaker().shout());\n",
  "exampleCaption": "Parent shout dispatches to overridden speak",
  "internals": [
    "Method lookup is [[Get]] on the receiver starting at its prototype.",
    "super.speak is a different reference that starts at [[HomeObject]].[[Prototype]].",
    "No multiple dispatch; arity does not select methods."
  ],
  "takeaways": [
    "Override to specialize; call super.method() to extend.",
    "Keep the same contract (args/return) to avoid LSP surprises.",
    "Thinking parent.shout always uses parent.speak — this.speak is dynamic dispatch.",
    "Method lookup is [[Get]] on the receiver starting at its prototype."
  ],
  "revision": [
    "Method Overriding: The nearest method on the chain wins. Parent methods that call this.foo() look up foo from the instance, which may be the override.",
    "Override to specialize; call super.method() to extend.",
    "Keep the same contract (args/return) to avoid LSP surprises.",
    "There is no overload — last method of that name in the class body wins.",
    "Trap: Thinking parent.shout always uses parent.speak — this.speak is dynamic dispatch."
  ],
  "flashcards": [
    [
      "Method Overriding",
      "A subclass method with the same name hides the parent’s on the instance’s prototype chain (the instance’s proto is Sub.prototype which has the new method)."
    ],
    [
      "Mental model",
      "The nearest method on the chain wins. Parent methods that call this.foo() look up foo from the instance, which may be the override."
    ],
    [
      "Common trap",
      "Thinking parent.shout always uses parent.speak — this.speak is dynamic dispatch."
    ],
    [
      "Override to specialize; call super.method() to extend.",
      "Keep the same contract (args/return) to avoid LSP surprises."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Method Overriding and where does a beginner first see it?",
      "answerHint": "A subclass method with the same name hides the parent’s on the instance’s prototype chain (the instance’s proto is Sub.prototype which has the new method). Parent code that calls this.method() from a parent function will still dispatch to the subclass (polymorphism) unless it uses super. There is no Java-style overload by arity."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Method Overriding works and name the main pitfall.",
      "answerHint": "Override to specialize; call super.method() to extend. Keep the same contract (args/return) to avoid LSP surprises. There is no overload — last method of that name in the class body wins. Arrow fields on the subclass shadow prototype methods of the parent. Pitfall: Thinking parent.shout always uses parent.speak — this.speak is dynamic dispatch."
    },
    {
      "level": "advanced",
      "question": "How would you explain Method Overriding at an interview, including engine/spec details?",
      "answerHint": "Method lookup is [[Get]] on the receiver starting at its prototype. super.speak is a different reference that starts at [[HomeObject]].[[Prototype]]. No multiple dispatch; arity does not select methods."
    }
  ],
  "pitfalls": [
    "Thinking parent.shout always uses parent.speak — this.speak is dynamic dispatch.",
    "Arrow fields on the subclass shadow prototype methods of the parent."
  ],
  "interview": {
    "expectations": [
      "Explain Method Overriding without mixing it up with a nearby B1.17 — Classes & OOP topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Method lookup is [[Get]] on the receiver starting at its prototype."
    ],
    "commonQuestions": [
      "What is Method Overriding?",
      "Why does JavaScript method overriding behave this way?",
      "What is the classic Method Overriding interview trap?"
    ],
    "traps": [
      "Thinking parent.shout always uses parent.speak — this.speak is dynamic dispatch."
    ],
    "misconceptions": [
      "Polymorphism: one call site, many behaviors. Overriding is how subclasses specialize."
    ],
    "strongSignals": [
      "Separates Method Overriding from lookalike APIs and can draw the mental model."
    ]
  }
})
