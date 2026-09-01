import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "BigInt",
  "whatIsIt": "BigInt is a primitive for integers of unlimited width: 10n, BigInt('10'). Mixed arithmetic with number throws. Division truncates toward 0. It cannot be JSON.stringified by default. typed arrays and Math.* mostly do not take bigint. 0n is falsy.",
  "whyExists": "2^53 is too small for some IDs and crypto-adjacent integers. bigint extends integers without changing IEEE number.",
  "mentalModel": "An integer that never becomes a float and refuses to silently mix with doubles.",
  "how": [
    "Write n suffix or BigInt(str) from API strings.",
    "Convert at the edge: Number(x) only if safe.",
    "Use 0n/1n literals in loops instead of 0/1.",
    "Provide a JSON replacer if you must serialize."
  ],
  "callout": {
    "title": "Watch for",
    "text": "JSON.parse cannot produce bigint; large numbers already rounded before you can ‘upgrade’ them.",
    "variant": "warning"
  },
  "example": "const a = 10n;\nconst b = BigInt('9007199254740993');\nconsole.log(a + b, b / 2n, 5n % 2n);\ntry { console.log(a + 1); } catch (e) { console.log(e.name); }\nconsole.log(Boolean(0n), 0n === 0);\nconsole.log(1n < 2, 2n > 1);\n",
  "exampleCaption": "bigint ops, mixed throw, relational mix allowed",
  "internals": [
    "typeof is 'bigint'; Type(x) is BigInt.",
    "Relational comparison may compare number and bigint by mathematical value.",
    "Bitwise ops on bigint are arbitrary precision two’s complement."
  ],
  "takeaways": [
    "Write n suffix or BigInt(str) from API strings.",
    "Convert at the edge: Number(x) only if safe.",
    "JSON.parse cannot produce bigint; large numbers already rounded before you can ‘upgrade’ them.",
    "typeof is 'bigint'; Type(x) is BigInt."
  ],
  "revision": [
    "BigInt: An integer that never becomes a float and refuses to silently mix with doubles.",
    "Write n suffix or BigInt(str) from API strings.",
    "Convert at the edge: Number(x) only if safe.",
    "Use 0n/1n literals in loops instead of 0/1.",
    "Trap: JSON.parse cannot produce bigint; large numbers already rounded before you can ‘upgrade’ them."
  ],
  "flashcards": [
    [
      "BigInt",
      "BigInt is a primitive for integers of unlimited width: 10n, BigInt('10')."
    ],
    [
      "Mental model",
      "An integer that never becomes a float and refuses to silently mix with doubles."
    ],
    [
      "Common trap",
      "JSON.parse cannot produce bigint; large numbers already rounded before you can ‘upgrade’ them."
    ],
    [
      "Write n suffix or BigInt(str) from API strings.",
      "Convert at the edge: Number(x) only if safe."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is BigInt and where does a beginner first see it?",
      "answerHint": "BigInt is a primitive for integers of unlimited width: 10n, BigInt('10'). Mixed arithmetic with number throws. Division truncates toward 0. It cannot be JSON.stringified by default. typed arrays and Math.* mostly do not take bigint. 0n is falsy."
    },
    {
      "level": "intermediate",
      "question": "Walk through how BigInt works and name the main pitfall.",
      "answerHint": "Write n suffix or BigInt(str) from API strings. Convert at the edge: Number(x) only if safe. Use 0n/1n literals in loops instead of 0/1. Provide a JSON replacer if you must serialize. Pitfall: JSON.parse cannot produce bigint; large numbers already rounded before you can ‘upgrade’ them."
    },
    {
      "level": "advanced",
      "question": "How would you explain BigInt at an interview, including engine/spec details?",
      "answerHint": "typeof is 'bigint'; Type(x) is BigInt. Relational comparison may compare number and bigint by mathematical value. Bitwise ops on bigint are arbitrary precision two’s complement."
    }
  ],
  "pitfalls": [
    "JSON.parse cannot produce bigint; large numbers already rounded before you can ‘upgrade’ them.",
    "Provide a JSON replacer if you must serialize."
  ],
  "interview": {
    "expectations": [
      "Explain BigInt without mixing it up with a nearby B1.8 — Numbers & Math topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "typeof is 'bigint'; Type(x) is BigInt."
    ],
    "commonQuestions": [
      "What is BigInt?",
      "Why does JavaScript bigint behave this way?",
      "What is the classic BigInt interview trap?"
    ],
    "traps": [
      "JSON.parse cannot produce bigint; large numbers already rounded before you can ‘upgrade’ them."
    ],
    "misconceptions": [
      "2^53 is too small for some IDs and crypto-adjacent integers. bigint extends integers without changing IEEE number."
    ],
    "strongSignals": [
      "Separates BigInt from lookalike APIs and can draw the mental model."
    ]
  }
})
