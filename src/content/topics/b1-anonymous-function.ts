import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Anonymous Function",
  "whatIsIt": "An anonymous function has no identifier between function and (): function () {}. Today engines infer .name from the variable or property they are assigned to. Completely anonymous functions still appear in stacks as 'anonymous'. Arrow functions are always anonymous in syntax (name can still be inferred).",
  "whyExists": "Callbacks were often throwaway. Anonymity kept syntax short; inferred names later improved debugging without extra tokens.",
  "mentalModel": "A nameless value. If you store it in const foo, DevTools may still label it foo.",
  "how": [
    "Prefer named functions for non-trivial callbacks.",
    "Rely on inferred names only as a debug aid, not as an API.",
    "export default function () {} is anonymous (name default in some tools).",
    "Function constructor creates unnamed functions."
  ],
  "callout": {
    "title": "Watch for",
    "text": "After .bind, name becomes 'bound ' + original — stacks look different than you grepped.",
    "variant": "warning"
  },
  "example": "const namedGuess = function () { return 1; };\nconsole.log(namedGuess.name);\nsetTimeout(function () { console.log('timer', namedGuess.name); }, 0);\nconst obj = { method: function () {} };\nconsole.log(obj.method.name);\nconsole.log((() => {}).name);\n",
  "exampleCaption": "Inferred .name on anonymous functions",
  "internals": [
    "SetFunctionName during assignment/property definition infers names.",
    "AnonymousFunctionName in the spec vs named.",
    "The [[SourceText]] internal slot may still omit a name token."
  ],
  "takeaways": [
    "Prefer named functions for non-trivial callbacks.",
    "Rely on inferred names only as a debug aid, not as an API.",
    "After .bind, name becomes 'bound ' + original — stacks look different than you grepped.",
    "SetFunctionName during assignment/property definition infers names."
  ],
  "revision": [
    "Anonymous Function: A nameless value. If you store it in const foo, DevTools may still label it foo.",
    "Prefer named functions for non-trivial callbacks.",
    "Rely on inferred names only as a debug aid, not as an API.",
    "export default function () {} is anonymous (name default in some tools).",
    "Trap: After .bind, name becomes 'bound ' + original — stacks look different than you grepped."
  ],
  "flashcards": [
    [
      "Anonymous Function",
      "An anonymous function has no identifier between function and (): function () {}."
    ],
    [
      "Mental model",
      "A nameless value. If you store it in const foo, DevTools may still label it foo."
    ],
    [
      "Common trap",
      "After .bind, name becomes 'bound ' + original — stacks look different than you grepped."
    ],
    [
      "Prefer named functions for non-trivial callbacks.",
      "Rely on inferred names only as a debug aid, not as an API."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Anonymous Function and where does a beginner first see it?",
      "answerHint": "An anonymous function has no identifier between function and (): function () {}. Today engines infer .name from the variable or property they are assigned to. Completely anonymous functions still appear in stacks as 'anonymous'. Arrow functions are always anonymous in syntax (name can still be inferred)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Anonymous Function works and name the main pitfall.",
      "answerHint": "Prefer named functions for non-trivial callbacks. Rely on inferred names only as a debug aid, not as an API. export default function () {} is anonymous (name default in some tools). Function constructor creates unnamed functions. Pitfall: After .bind, name becomes 'bound ' + original — stacks look different than you grepped."
    },
    {
      "level": "advanced",
      "question": "How would you explain Anonymous Function at an interview, including engine/spec details?",
      "answerHint": "SetFunctionName during assignment/property definition infers names. AnonymousFunctionName in the spec vs named. The [[SourceText]] internal slot may still omit a name token."
    }
  ],
  "pitfalls": [
    "After .bind, name becomes 'bound ' + original — stacks look different than you grepped.",
    "Function constructor creates unnamed functions."
  ],
  "interview": {
    "expectations": [
      "Explain Anonymous Function without mixing it up with a nearby B1.9 — Functions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "SetFunctionName during assignment/property definition infers names."
    ],
    "commonQuestions": [
      "What is Anonymous Function?",
      "Why does JavaScript anonymous function behave this way?",
      "What is the classic Anonymous Function interview trap?"
    ],
    "traps": [
      "After .bind, name becomes 'bound ' + original — stacks look different than you grepped."
    ],
    "misconceptions": [
      "Callbacks were often throwaway. Anonymity kept syntax short; inferred names later improved debugging without extra tokens."
    ],
    "strongSignals": [
      "Separates Anonymous Function from lookalike APIs and can draw the mental model."
    ]
  }
})
