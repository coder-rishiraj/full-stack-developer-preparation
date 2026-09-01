import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "parseInt / parseFloat",
  "whatIsIt": "parseInt(string, radix) reads a prefix of digits in a given base and stops at the first invalid character. parseFloat reads a decimal prefix. They ignore trailing junk ('10px' → 10). Without radix, parseInt('08') is 8 in modern engines but was octal in ancient ones. parseInt of a number still ToStrings first (parseInt(0.0000008) is a famous mess).",
  "whyExists": "HTML attributes and CSS-like strings mix numbers with units. Stopping at the first non-digit was convenient for '12px'.",
  "mentalModel": "A scanner, not a full-string validator. It is happy to return 10 from '10px' and NaN from ''.",
  "how": [
    "Always pass radix 10 for decimal text.",
    "Use Number() when the entire string must be numeric.",
    "Check Number.isNaN(parseInt(s, 10)).",
    "Do not parseInt floats expecting rounding of the fraction — it stops at '.'."
  ],
  "callout": {
    "title": "Watch for",
    "text": "parseInt(0.0000008) becomes parseInt('8e-7') → 8 because of scientific notation in ToString.",
    "variant": "warning"
  },
  "example": "console.log(parseInt('10px', 10), parseFloat('3.14px'));\nconsole.log(parseInt('08', 10), parseInt('08', 8));\nconsole.log(parseInt('101', 2));\nconsole.log(parseInt(''), parseInt('  12', 10));\nconsole.log(parseInt(0.0000008));\nconsole.log(parseInt(8.9, 10));\n",
  "exampleCaption": "Prefix parsing, radix, and the 0.0000008 trap",
  "internals": [
    "parseInt: ToString, strip whitespace, optional sign, radix heuristics, then digit loop.",
    "Radix 0 means detect 0x hex; remaining decimal in modern spec (no octal 0 prefix).",
    "parseFloat does not take a radix; hex strings are not hex there."
  ],
  "takeaways": [
    "Always pass radix 10 for decimal text.",
    "Use Number() when the entire string must be numeric.",
    "parseInt(0.0000008) becomes parseInt('8e-7') → 8 because of scientific notation in ToString.",
    "parseInt: ToString, strip whitespace, optional sign, radix heuristics, then digit loop."
  ],
  "revision": [
    "parseInt / parseFloat: A scanner, not a full-string validator. It is happy to return 10 from '10px' and NaN from ''.",
    "Always pass radix 10 for decimal text.",
    "Use Number() when the entire string must be numeric.",
    "Check Number.isNaN(parseInt(s, 10)).",
    "Trap: parseInt(0.0000008) becomes parseInt('8e-7') → 8 because of scientific notation in ToString."
  ],
  "flashcards": [
    [
      "parseInt / parseFloat",
      "parseInt(string, radix) reads a prefix of digits in a given base and stops at the first invalid character."
    ],
    [
      "Mental model",
      "A scanner, not a full-string validator. It is happy to return 10 from '10px' and NaN from ''."
    ],
    [
      "Common trap",
      "parseInt(0.0000008) becomes parseInt('8e-7') → 8 because of scientific notation in ToString."
    ],
    [
      "Always pass radix 10 for decimal text.",
      "Use Number() when the entire string must be numeric."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is parseInt / parseFloat and where does a beginner first see it?",
      "answerHint": "parseInt(string, radix) reads a prefix of digits in a given base and stops at the first invalid character. parseFloat reads a decimal prefix. They ignore trailing junk ('10px' → 10). Without radix, parseInt('08') is 8 in modern engines but was octal in ancient ones. parseInt of a number still ToStrings first (parseInt(0.0000008) is a famous mess)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how parseInt / parseFloat works and name the main pitfall.",
      "answerHint": "Always pass radix 10 for decimal text. Use Number() when the entire string must be numeric. Check Number.isNaN(parseInt(s, 10)). Do not parseInt floats expecting rounding of the fraction — it stops at '.'. Pitfall: parseInt(0.0000008) becomes parseInt('8e-7') → 8 because of scientific notation in ToString."
    },
    {
      "level": "advanced",
      "question": "How would you explain parseInt / parseFloat at an interview, including engine/spec details?",
      "answerHint": "parseInt: ToString, strip whitespace, optional sign, radix heuristics, then digit loop. Radix 0 means detect 0x hex; remaining decimal in modern spec (no octal 0 prefix). parseFloat does not take a radix; hex strings are not hex there."
    }
  ],
  "pitfalls": [
    "parseInt(0.0000008) becomes parseInt('8e-7') → 8 because of scientific notation in ToString.",
    "Do not parseInt floats expecting rounding of the fraction — it stops at '.'."
  ],
  "interview": {
    "expectations": [
      "Explain parseInt / parseFloat without mixing it up with a nearby B1.4 — Type Conversion & Coercion topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "parseInt: ToString, strip whitespace, optional sign, radix heuristics, then digit loop."
    ],
    "commonQuestions": [
      "What is parseInt / parseFloat?",
      "Why does JavaScript parseint / parsefloat behave this way?",
      "What is the classic parseInt / parseFloat interview trap?"
    ],
    "traps": [
      "parseInt(0.0000008) becomes parseInt('8e-7') → 8 because of scientific notation in ToString."
    ],
    "misconceptions": [
      "HTML attributes and CSS-like strings mix numbers with units. Stopping at the first non-digit was convenient for '12px'."
    ],
    "strongSignals": [
      "Separates parseInt / parseFloat from lookalike APIs and can draw the mental model."
    ]
  }
})
