import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Core String Methods",
  "whatIsIt": "Core methods return new strings or numbers: toLowerCase/toUpperCase, trim, includes, startsWith, indexOf, slice, substring, split, replace/replaceAll, padStart, repeat, concat. None mutate the original. Many take indexes in code units. replace without /g replaces once.",
  "whyExists": "Text processing is the web’s daily work. Putting methods on String.prototype keeps them on every primitive via autoboxing.",
  "mentalModel": "A toolbox that always hands you a new tape (or a number). The old tape stays on the shelf.",
  "how": [
    "Prefer slice over substring (substring swaps args if start > end).",
    "Use includes/startsWith instead of indexOf !== -1.",
    "replaceAll or /g for every match.",
    "trim before comparing user input."
  ],
  "callout": {
    "title": "Watch for",
    "text": "substring(1, 0) is not empty — it swaps to substring(0, 1). slice(1, 0) is empty.",
    "variant": "warning"
  },
  "example": "const s = '  JavaScript  ';\nconsole.log(s.trim().toLowerCase());\nconsole.log(s.includes('Script'), s.trim().startsWith('Java'));\nconsole.log('a-b-c'.split('-'));\nconsole.log('abab'.replace('ab', 'X'), 'abab'.replaceAll('ab', 'X'));\n",
  "exampleCaption": "trim, search, split, replace vs replaceAll",
  "internals": [
    "Methods are generic: they ToString(this), so String.prototype.slice.call(true) works.",
    "replace with a string pattern is not regex unless you pass a RegExp.",
    "split with empty string splits by UTF-16 units, not always graphemes."
  ],
  "takeaways": [
    "Prefer slice over substring (substring swaps args if start > end).",
    "Use includes/startsWith instead of indexOf !== -1.",
    "substring(1, 0) is not empty — it swaps to substring(0, 1). slice(1, 0) is empty.",
    "Methods are generic: they ToString(this), so String.prototype.slice.call(true) works."
  ],
  "revision": [
    "Core String Methods: A toolbox that always hands you a new tape (or a number). The old tape stays on the shelf.",
    "Prefer slice over substring (substring swaps args if start > end).",
    "Use includes/startsWith instead of indexOf !== -1.",
    "replaceAll or /g for every match.",
    "Trap: substring(1, 0) is not empty — it swaps to substring(0, 1). slice(1, 0) is empty."
  ],
  "flashcards": [
    [
      "Core String Methods",
      "Core methods return new strings or numbers: toLowerCase/toUpperCase, trim, includes, startsWith, indexOf, slice, substring, split, replace/replaceAll, padStart, repeat, concat."
    ],
    [
      "Mental model",
      "A toolbox that always hands you a new tape (or a number). The old tape stays on the shelf."
    ],
    [
      "Common trap",
      "substring(1, 0) is not empty — it swaps to substring(0, 1). slice(1, 0) is empty."
    ],
    [
      "Prefer slice over substring (substring swaps args if start > end).",
      "Use includes/startsWith instead of indexOf !== -1."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Core String Methods and where does a beginner first see it?",
      "answerHint": "Core methods return new strings or numbers: toLowerCase/toUpperCase, trim, includes, startsWith, indexOf, slice, substring, split, replace/replaceAll, padStart, repeat, concat. None mutate the original. Many take indexes in code units. replace without /g replaces once."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Core String Methods works and name the main pitfall.",
      "answerHint": "Prefer slice over substring (substring swaps args if start > end). Use includes/startsWith instead of indexOf !== -1. replaceAll or /g for every match. trim before comparing user input. Pitfall: substring(1, 0) is not empty — it swaps to substring(0, 1). slice(1, 0) is empty."
    },
    {
      "level": "advanced",
      "question": "How would you explain Core String Methods at an interview, including engine/spec details?",
      "answerHint": "Methods are generic: they ToString(this), so String.prototype.slice.call(true) works. replace with a string pattern is not regex unless you pass a RegExp. split with empty string splits by UTF-16 units, not always graphemes."
    }
  ],
  "pitfalls": [
    "substring(1, 0) is not empty — it swaps to substring(0, 1). slice(1, 0) is empty.",
    "trim before comparing user input."
  ],
  "interview": {
    "expectations": [
      "Explain Core String Methods without mixing it up with a nearby B1.7 — Strings topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Methods are generic: they ToString(this), so String.prototype.slice.call(true) works."
    ],
    "commonQuestions": [
      "What is Core String Methods?",
      "Why does JavaScript core string methods behave this way?",
      "What is the classic Core String Methods interview trap?"
    ],
    "traps": [
      "substring(1, 0) is not empty — it swaps to substring(0, 1). slice(1, 0) is empty."
    ],
    "misconceptions": [
      "Text processing is the web’s daily work. Putting methods on String.prototype keeps them on every primitive via autoboxing."
    ],
    "strongSignals": [
      "Separates Core String Methods from lookalike APIs and can draw the mental model."
    ]
  }
})
