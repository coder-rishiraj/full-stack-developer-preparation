import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Tagged Template Literals",
  "whatIsIt": "A tag is a function called as tag`s ${x}`: first argument is a frozen strings array (with .raw), then the interpolated values. The tag can return any type, not just a string. This powers DSLs (css``, graphql``, sanitizers). Untagged templates skip this call.",
  "whyExists": "Libraries needed interpolation without immediately concatenating, so they could escape HTML or parse SQL safely.",
  "mentalModel": "Do not glue yet. Hand me the pieces and the values; I will decide the result.",
  "how": [
    "Write function tag(strings, ...values).",
    "Use strings.raw for unprocessed escapes.",
    "The same site’s strings array is cached/identity-stable.",
    "Return a string or a structured object as your DSL needs."
  ],
  "callout": {
    "title": "Watch for",
    "text": "tag`${user}` is not automatically safe HTML — the tag must escape; the syntax alone does nothing.",
    "variant": "warning"
  },
  "example": "function sql(strings, ...values) {\n  return {\n    text: strings.reduce((acc, s, i) => acc + s + (i < values.length ? '?' : ''), ''),\n    values,\n  };\n}\nconst id = 7;\nconsole.log(sql`select * from users where id = ${id}`);\nfunction shout(strings, ...vals) {\n  return strings[0] + vals.map(String).join('').toUpperCase();\n}\nconsole.log(shout`hi ${'ada'}`);\n",
  "exampleCaption": "Tag functions receiving strings + values",
  "internals": [
    "GetTemplateObject returns a cached frozen array with a raw property.",
    "Call the tag as a function (not a method unless it is one); this is undefined in strict.",
    "The cooked vs raw difference appears with escapes like \\n vs strings.raw."
  ],
  "takeaways": [
    "Write function tag(strings, ...values).",
    "Use strings.raw for unprocessed escapes.",
    "tag`${user}` is not automatically safe HTML — the tag must escape; the syntax alone does nothing.",
    "GetTemplateObject returns a cached frozen array with a raw property."
  ],
  "revision": [
    "Tagged Template Literals: Do not glue yet. Hand me the pieces and the values; I will decide the result.",
    "Write function tag(strings, ...values).",
    "Use strings.raw for unprocessed escapes.",
    "The same site’s strings array is cached/identity-stable.",
    "Trap: tag`${user}` is not automatically safe HTML — the tag must escape; the syntax alone does nothing."
  ],
  "flashcards": [
    [
      "Tagged Template Literals",
      "A tag is a function called as tag`s ${x}`: first argument is a frozen strings array (with .raw), then the interpolated values."
    ],
    [
      "Mental model",
      "Do not glue yet. Hand me the pieces and the values; I will decide the result."
    ],
    [
      "Common trap",
      "tag`${user}` is not automatically safe HTML — the tag must escape; the syntax alone does nothing."
    ],
    [
      "Write function tag(strings, ...values).",
      "Use strings.raw for unprocessed escapes."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Tagged Template Literals and where does a beginner first see it?",
      "answerHint": "A tag is a function called as tag`s ${x}`: first argument is a frozen strings array (with .raw), then the interpolated values. The tag can return any type, not just a string. This powers DSLs (css``, graphql``, sanitizers). Untagged templates skip this call."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Tagged Template Literals works and name the main pitfall.",
      "answerHint": "Write function tag(strings, ...values). Use strings.raw for unprocessed escapes. The same site’s strings array is cached/identity-stable. Return a string or a structured object as your DSL needs. Pitfall: tag`${user}` is not automatically safe HTML — the tag must escape; the syntax alone does nothing."
    },
    {
      "level": "advanced",
      "question": "How would you explain Tagged Template Literals at an interview, including engine/spec details?",
      "answerHint": "GetTemplateObject returns a cached frozen array with a raw property. Call the tag as a function (not a method unless it is one); this is undefined in strict. The cooked vs raw difference appears with escapes like \\n vs strings.raw."
    }
  ],
  "pitfalls": [
    "tag`${user}` is not automatically safe HTML — the tag must escape; the syntax alone does nothing.",
    "Return a string or a structured object as your DSL needs."
  ],
  "interview": {
    "expectations": [
      "Explain Tagged Template Literals without mixing it up with a nearby B1.7 — Strings topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "GetTemplateObject returns a cached frozen array with a raw property."
    ],
    "commonQuestions": [
      "What is Tagged Template Literals?",
      "Why does JavaScript tagged template literals behave this way?",
      "What is the classic Tagged Template Literals interview trap?"
    ],
    "traps": [
      "tag`${user}` is not automatically safe HTML — the tag must escape; the syntax alone does nothing."
    ],
    "misconceptions": [
      "Libraries needed interpolation without immediately concatenating, so they could escape HTML or parse SQL safely."
    ],
    "strongSignals": [
      "Separates Tagged Template Literals from lookalike APIs and can draw the mental model."
    ]
  }
})
