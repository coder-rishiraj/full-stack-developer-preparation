import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Replacing / Splitting / Trimming",
  "whatIsIt": "replace(pattern, repl) replaces one match if pattern is a string, or uses regex flags if a RegExp. replaceAll requires a global regex or a string. split(sep) returns an array; empty sep splits code units. trim/trimStart/trimEnd remove whitespace. Replacement strings can use $& and capture $1.",
  "whyExists": "Cleanup of user input and templates is constant. replace+split+trim is the everyday pipeline.",
  "mentalModel": "replace paints over matches; split cuts a tape into boxes; trim shaves edges. Original string never changes.",
  "how": [
    "replaceAll for every occurrence of a literal.",
    "Pass a function as the replacement for computed text.",
    "split limit argument caps the number of pieces.",
    "trim does not remove inner spaces."
  ],
  "callout": {
    "title": "Watch for",
    "text": "replace(/a/, 'b') without g still replaces once; people add /g later and change call counts in callbacks.",
    "variant": "warning"
  },
  "example": "console.log('a a a'.replace('a', 'b'));\nconsole.log('a a a'.replaceAll('a', 'b'));\nconsole.log('2020-01-02'.split('-'));\nconsole.log('  x  '.trim());\nconsole.log('id=10'.replace(/id=(\\d+)/, 'id($1)'));\n",
  "exampleCaption": "replace once vs all, split, trim, capture $1",
  "internals": [
    "String.prototype.replace uses GetSubstitution for $ patterns.",
    "replaceAll on RegExp throws if global flag is missing.",
    "split with capturing groups includes captures in the result array."
  ],
  "takeaways": [
    "replaceAll for every occurrence of a literal.",
    "Pass a function as the replacement for computed text.",
    "replace(/a/, 'b') without g still replaces once; people add /g later and change call counts in callbacks.",
    "String.prototype.replace uses GetSubstitution for $ patterns."
  ],
  "revision": [
    "Replacing / Splitting / Trimming: replace paints over matches; split cuts a tape into boxes; trim shaves edges. Original string never changes.",
    "replaceAll for every occurrence of a literal.",
    "Pass a function as the replacement for computed text.",
    "split limit argument caps the number of pieces.",
    "Trap: replace(/a/, 'b') without g still replaces once; people add /g later and change call counts in callbacks."
  ],
  "flashcards": [
    [
      "Replacing / Splitting / Trimming",
      "replace(pattern, repl) replaces one match if pattern is a string, or uses regex flags if a RegExp."
    ],
    [
      "Mental model",
      "replace paints over matches; split cuts a tape into boxes; trim shaves edges. Original string never changes."
    ],
    [
      "Common trap",
      "replace(/a/, 'b') without g still replaces once; people add /g later and change call counts in callbacks."
    ],
    [
      "replaceAll for every occurrence of a literal.",
      "Pass a function as the replacement for computed text."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Replacing / Splitting / Trimming and where does a beginner first see it?",
      "answerHint": "replace(pattern, repl) replaces one match if pattern is a string, or uses regex flags if a RegExp. replaceAll requires a global regex or a string. split(sep) returns an array; empty sep splits code units. trim/trimStart/trimEnd remove whitespace. Replacement strings can use $& and capture $1."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Replacing / Splitting / Trimming works and name the main pitfall.",
      "answerHint": "replaceAll for every occurrence of a literal. Pass a function as the replacement for computed text. split limit argument caps the number of pieces. trim does not remove inner spaces. Pitfall: replace(/a/, 'b') without g still replaces once; people add /g later and change call counts in callbacks."
    },
    {
      "level": "advanced",
      "question": "How would you explain Replacing / Splitting / Trimming at an interview, including engine/spec details?",
      "answerHint": "String.prototype.replace uses GetSubstitution for $ patterns. replaceAll on RegExp throws if global flag is missing. split with capturing groups includes captures in the result array."
    }
  ],
  "pitfalls": [
    "replace(/a/, 'b') without g still replaces once; people add /g later and change call counts in callbacks.",
    "trim does not remove inner spaces."
  ],
  "interview": {
    "expectations": [
      "Explain Replacing / Splitting / Trimming without mixing it up with a nearby B1.7 — Strings topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "String.prototype.replace uses GetSubstitution for $ patterns."
    ],
    "commonQuestions": [
      "What is Replacing / Splitting / Trimming?",
      "Why does JavaScript replacing / splitting / trimming behave this way?",
      "What is the classic Replacing / Splitting / Trimming interview trap?"
    ],
    "traps": [
      "replace(/a/, 'b') without g still replaces once; people add /g later and change call counts in callbacks."
    ],
    "misconceptions": [
      "Cleanup of user input and templates is constant. replace+split+trim is the everyday pipeline."
    ],
    "strongSignals": [
      "Separates Replacing / Splitting / Trimming from lookalike APIs and can draw the mental model."
    ]
  }
})
