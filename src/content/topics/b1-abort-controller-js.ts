import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "AbortController / AbortSignal (Language)",
  "whatIsIt": "AbortController is a language-adjacent Web/Node API: controller.abort(reason) flips signal.aborted and fires ‘abort’. Promises do not auto-cancel; fetch and some streams observe the signal. You can abort(reason) and awaiters can throw AbortError. This topic is the signal as a token; fetch details live in B3.",
  "whyExists": "Race conditions and navigation needed a standard cancel token instead of ad-hoc cancelled flags.",
  "mentalModel": "A shared tripwire. abort() yanks it; anyone holding the signal can stop work and reject.",
  "how": [
    "const c = new AbortController(); pass c.signal.",
    "abort() in cleanup / timeout / new request.",
    "Check signal.aborted or listen once.",
    "Wrap user promises to reject on abort if the API ignores signals."
  ],
  "callout": {
    "title": "Watch for",
    "text": "abort() does not stop a running CPU loop — only cooperative APIs and checks.",
    "variant": "warning"
  },
  "example": "const c = new AbortController();\nconst { signal } = c;\nconst p = new Promise((resolve, reject) => {\n  signal.addEventListener('abort', () => reject(signal.reason), { once: true });\n  setTimeout(() => resolve('ok'), 50);\n});\nc.abort(new Error('cancel'));\ntry { await p; } catch (e) { console.log(e.message); }\n",
  "exampleCaption": "AbortSignal rejecting a hand-rolled promise",
  "internals": [
    "AbortSignal is an EventTarget with aborted flag and reason.",
    "AbortError DOMException is conventional for fetch.",
    "The spec for promises has no abort; integration is host APIs."
  ],
  "takeaways": [
    "const c = new AbortController(); pass c.signal.",
    "abort() in cleanup / timeout / new request.",
    "abort() does not stop a running CPU loop — only cooperative APIs and checks.",
    "AbortSignal is an EventTarget with aborted flag and reason."
  ],
  "revision": [
    "AbortController / AbortSignal (Language): A shared tripwire. abort() yanks it; anyone holding the signal can stop work and reject.",
    "const c = new AbortController(); pass c.signal.",
    "abort() in cleanup / timeout / new request.",
    "Check signal.aborted or listen once.",
    "Trap: abort() does not stop a running CPU loop — only cooperative APIs and checks."
  ],
  "flashcards": [
    [
      "AbortController / AbortSignal (Language)",
      "AbortController is a language-adjacent Web/Node API: controller.abort(reason) flips signal.aborted and fires ‘abort’."
    ],
    [
      "Mental model",
      "A shared tripwire. abort() yanks it; anyone holding the signal can stop work and reject."
    ],
    [
      "Common trap",
      "abort() does not stop a running CPU loop — only cooperative APIs and checks."
    ],
    [
      "const c = new AbortController(); pass c.signal.",
      "abort() in cleanup / timeout / new request."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is AbortController / AbortSignal (Language) and where does a beginner first see it?",
      "answerHint": "AbortController is a language-adjacent Web/Node API: controller.abort(reason) flips signal.aborted and fires ‘abort’. Promises do not auto-cancel; fetch and some streams observe the signal. You can abort(reason) and awaiters can throw AbortError. This topic is the signal as a token; fetch details live in B3."
    },
    {
      "level": "intermediate",
      "question": "Walk through how AbortController / AbortSignal (Language) works and name the main pitfall.",
      "answerHint": "const c = new AbortController(); pass c.signal. abort() in cleanup / timeout / new request. Check signal.aborted or listen once. Wrap user promises to reject on abort if the API ignores signals. Pitfall: abort() does not stop a running CPU loop — only cooperative APIs and checks."
    },
    {
      "level": "advanced",
      "question": "How would you explain AbortController / AbortSignal (Language) at an interview, including engine/spec details?",
      "answerHint": "AbortSignal is an EventTarget with aborted flag and reason. AbortError DOMException is conventional for fetch. The spec for promises has no abort; integration is host APIs."
    }
  ],
  "pitfalls": [
    "abort() does not stop a running CPU loop — only cooperative APIs and checks.",
    "Wrap user promises to reject on abort if the API ignores signals."
  ],
  "interview": {
    "expectations": [
      "Explain AbortController / AbortSignal (Language) without mixing it up with a nearby B1.31 — Async Cancellation & Coordination topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "AbortSignal is an EventTarget with aborted flag and reason."
    ],
    "commonQuestions": [
      "What is AbortController / AbortSignal (Language)?",
      "Why does JavaScript abortcontroller / abortsignal (language) behave this way?",
      "What is the classic AbortController / AbortSignal (Language) interview trap?"
    ],
    "traps": [
      "abort() does not stop a running CPU loop — only cooperative APIs and checks."
    ],
    "misconceptions": [
      "Race conditions and navigation needed a standard cancel token instead of ad-hoc cancelled flags."
    ],
    "strongSignals": [
      "Separates AbortController / AbortSignal (Language) from lookalike APIs and can draw the mental model."
    ]
  }
})
