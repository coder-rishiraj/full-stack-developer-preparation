import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Fetch API",
  "whatIsIt": "fetch(url, init) is a Web API that returns a Promise<Response> for an HTTP request. Default GET, CORS mode, no cookies unless credentials: 'include'. Response is a stream: call .json/.text once. HTTP 404 is still a fulfilled promise — check response.ok. Abort with init.signal. It is not ECMAScript.",
  "whyExists": "XHR was event-based and clunky. fetch is promise-based HTTP with streaming bodies, matching modern async JS.",
  "mentalModel": "Mail a Request, get a Response box. Status is on the box; the body is a one-shot stream inside. 404 is a delivered box with a sad stamp, not a thrown letter.",
  "how": [
    "const r = await fetch(url, { signal, headers }); if (!r.ok) throw ...; return r.json().",
    "POST JSON: method, headers Content-Type, body JSON.stringify.",
    "Do not fetch file:// in pages casually (CORS).",
    "Opaque CORS responses hide body/headers.",
    "Clone the response if you must read twice."
  ],
  "callout": {
    "title": "Watch for",
    "text": "await fetch() throwing only on network failure — 500 is not a throw unless you check ok.",
    "variant": "warning"
  },
  "example": "const ac = new AbortController();\nconst res = await fetch('/api/item', { signal: ac.signal });\nif (!res.ok) throw new Error(String(res.status));\nconst data = await res.json();\nconsole.log(data);\n// ac.abort();\n",
  "exampleCaption": "fetch, ok check, json(), optional abort",
  "internals": [
    "Fetch spec: request/response/body streams, CORS, redirect modes.",
    "Body mixin: bodyUsed flag after json/text/arrayBuffer.",
    "HTTP cache and service workers can intercept."
  ],
  "takeaways": [
    "const r = await fetch(url, { signal, headers }); if (!r.ok) throw ...; return r.json().",
    "POST JSON: method, headers Content-Type, body JSON.stringify.",
    "await fetch() throwing only on network failure — 500 is not a throw unless you check ok.",
    "Fetch spec: request/response/body streams, CORS, redirect modes."
  ],
  "revision": [
    "Fetch API: Mail a Request, get a Response box. Status is on the box; the body is a one-shot stream inside. 404 is a delivered box with a sad stamp, not a thrown letter.",
    "const r = await fetch(url, { signal, headers }); if (!r.ok) throw ...; return r.json().",
    "POST JSON: method, headers Content-Type, body JSON.stringify.",
    "Do not fetch file:// in pages casually (CORS).",
    "Trap: await fetch() throwing only on network failure — 500 is not a throw unless you check ok."
  ],
  "flashcards": [
    [
      "Fetch API",
      "fetch(url, init) is a Web API that returns a Promise<Response> for an HTTP request."
    ],
    [
      "Mental model",
      "Mail a Request, get a Response box. Status is on the box; the body is a one-shot stream inside. 404 is a delivered box with a sad stamp, not a thrown letter."
    ],
    [
      "Common trap",
      "await fetch() throwing only on network failure — 500 is not a throw unless you check ok."
    ],
    [
      "const r = await fetch(url, { signal, headers }); if (!r.ok) throw ...; return r.",
      "POST JSON: method, headers Content-Type, body JSON.stringify."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Fetch API and where does a beginner first see it?",
      "answerHint": "fetch(url, init) is a Web API that returns a Promise<Response> for an HTTP request. Default GET, CORS mode, no cookies unless credentials: 'include'. Response is a stream: call .json/.text once. HTTP 404 is still a fulfilled promise — check response.ok. Abort with init.signal. It is not ECMAScript."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Fetch API works and name the main pitfall.",
      "answerHint": "const r = await fetch(url, { signal, headers }); if (!r.ok) throw ...; return r.json(). POST JSON: method, headers Content-Type, body JSON.stringify. Do not fetch file:// in pages casually (CORS). Opaque CORS responses hide body/headers. Clone the response if you must read twice. Pitfall: await fetch() throwing only on network failure — 500 is not a throw unless you check ok."
    },
    {
      "level": "advanced",
      "question": "How would you explain Fetch API at an interview, including engine/spec details?",
      "answerHint": "Fetch spec: request/response/body streams, CORS, redirect modes. Body mixin: bodyUsed flag after json/text/arrayBuffer. HTTP cache and service workers can intercept."
    }
  ],
  "pitfalls": [
    "await fetch() throwing only on network failure — 500 is not a throw unless you check ok.",
    "Clone the response if you must read twice."
  ],
  "interview": {
    "expectations": [
      "Explain Fetch API without mixing it up with a nearby B3 — Browser Fundamentals topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Fetch spec: request/response/body streams, CORS, redirect modes."
    ],
    "commonQuestions": [
      "What is Fetch API?",
      "Why does JavaScript fetch api behave this way?",
      "What is the classic Fetch API interview trap?"
    ],
    "traps": [
      "await fetch() throwing only on network failure — 500 is not a throw unless you check ok."
    ],
    "misconceptions": [
      "XHR was event-based and clunky. fetch is promise-based HTTP with streaming bodies, matching modern async JS."
    ],
    "strongSignals": [
      "Separates Fetch API from lookalike APIs and can draw the mental model."
    ]
  }
})
