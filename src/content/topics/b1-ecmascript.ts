import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "JavaScript vs ECMAScript",
  "whatIsIt": "ECMAScript (ES) is the standard that specifies JavaScript’s syntax and built-in objects. “JavaScript” is the everyday name of implementations of that standard plus host extras. Yearly editions (ES2015, ES2020, …) add language features; browsers and Node adopt them independently. Saying “ES6 class” means the language feature, not a browser API.",
  "whyExists": "Competing implementations in the 1990s needed a shared spec so code would run across Netscape, IE, and later engines. TC39 now evolves the language in stages so engines can ship features safely.",
  "mentalModel": "ECMAScript is the recipe; JavaScript engines are kitchens following that recipe and adding house spices (host APIs).",
  "how": [
    "TC39 proposals move through stages 0–4; stage 4 is in the spec.",
    "Transpilers (Babel, TypeScript) downlevel newer syntax to older engines.",
    "Feature detection: try the syntax/API or check MDN/compat tables — do not sniff “ES6 support” as one flag.",
    "Host extras (DOM, Node fs) are never in ECMA-262."
  ],
  "callout": {
    "title": "Watch for",
    "text": "People say “ES6 JavaScript” as if the whole platform upgraded in 2015. Modules, optional chaining, and BigInt landed in different years per engine.",
    "variant": "warning"
  },
  "example": "// ES2015 language (spec) vs host\nclass Point { constructor(x, y) { this.x = x; this.y = y; } } // ES\nconst p = new Point(1, 2);\nconsole.log(Object.keys(p)); // [\"x\",\"y\"] — language reflection\n// document.querySelector is NOT ECMAScript",
  "exampleCaption": "An ES class is language; DOM is not",
  "internals": [
    "The spec defines execution contexts, jobs, and abstract operations like ToPrimitive.",
    "Annex B documents web-reality quirks engines still implement for compatibility.",
    "Engines may ship behind flags before a proposal reaches stage 4."
  ],
  "takeaways": [
    "TC39 proposals move through stages 0–4; stage 4 is in the spec.",
    "Transpilers (Babel, TypeScript) downlevel newer syntax to older engines.",
    "People say “ES6 JavaScript” as if the whole platform upgraded in 2015. Modules, optional chaining, and BigInt landed in different years per engine.",
    "The spec defines execution contexts, jobs, and abstract operations like ToPrimitive."
  ],
  "revision": [
    "JavaScript vs ECMAScript: ECMAScript is the recipe; JavaScript engines are kitchens following that recipe and adding house spices (host APIs).",
    "TC39 proposals move through stages 0–4; stage 4 is in the spec.",
    "Transpilers (Babel, TypeScript) downlevel newer syntax to older engines.",
    "Feature detection: try the syntax/API or check MDN/compat tables — do not sniff “ES6 support” as one flag.",
    "Trap: People say “ES6 JavaScript” as if the whole platform upgraded in 2015. Modules, optional chaining, and BigInt landed in different years per engine."
  ],
  "flashcards": [
    [
      "JavaScript vs ECMAScript",
      "ECMAScript (ES) is the standard that specifies JavaScript’s syntax and built-in objects."
    ],
    [
      "Mental model",
      "ECMAScript is the recipe; JavaScript engines are kitchens following that recipe and adding house spices (host APIs)."
    ],
    [
      "Common trap",
      "People say “ES6 JavaScript” as if the whole platform upgraded in 2015. Modules, optional chaining, and BigInt landed in different years per engine."
    ],
    [
      "TC39 proposals move through stages 0–4; stage 4 is in the spec.",
      "Transpilers (Babel, TypeScript) downlevel newer syntax to older engines."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is JavaScript vs ECMAScript and where does a beginner first see it?",
      "answerHint": "ECMAScript (ES) is the standard that specifies JavaScript’s syntax and built-in objects. “JavaScript” is the everyday name of implementations of that standard plus host extras. Yearly editions (ES2015, ES2020, …) add language features; browsers and Node adopt them independently. Saying “ES6 class” means the language feature, not a browser API."
    },
    {
      "level": "intermediate",
      "question": "Walk through how JavaScript vs ECMAScript works and name the main pitfall.",
      "answerHint": "TC39 proposals move through stages 0–4; stage 4 is in the spec. Transpilers (Babel, TypeScript) downlevel newer syntax to older engines. Feature detection: try the syntax/API or check MDN/compat tables — do not sniff “ES6 support” as one flag. Host extras (DOM, Node fs) are never in ECMA-262. Pitfall: People say “ES6 JavaScript” as if the whole platform upgraded in 2015. Modules, optional chaining, and BigInt landed in different years per engine."
    },
    {
      "level": "advanced",
      "question": "How would you explain JavaScript vs ECMAScript at an interview, including engine/spec details?",
      "answerHint": "The spec defines execution contexts, jobs, and abstract operations like ToPrimitive. Annex B documents web-reality quirks engines still implement for compatibility. Engines may ship behind flags before a proposal reaches stage 4."
    }
  ],
  "pitfalls": [
    "People say “ES6 JavaScript” as if the whole platform upgraded in 2015. Modules, optional chaining, and BigInt landed in different years per engine.",
    "Host extras (DOM, Node fs) are never in ECMA-262."
  ],
  "interview": {
    "expectations": [
      "Explain JavaScript vs ECMAScript without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "The spec defines execution contexts, jobs, and abstract operations like ToPrimitive."
    ],
    "commonQuestions": [
      "What is JavaScript vs ECMAScript?",
      "Why does JavaScript javascript vs ecmascript behave this way?",
      "What is the classic JavaScript vs ECMAScript interview trap?"
    ],
    "traps": [
      "People say “ES6 JavaScript” as if the whole platform upgraded in 2015. Modules, optional chaining, and BigInt landed in different years per engine."
    ],
    "misconceptions": [
      "Competing implementations in the 1990s needed a shared spec so code would run across Netscape, IE, and later engines. TC39 now evolves the language in stages so engines can ship features safely."
    ],
    "strongSignals": [
      "Separates JavaScript vs ECMAScript from lookalike APIs and can draw the mental model."
    ]
  }
})
