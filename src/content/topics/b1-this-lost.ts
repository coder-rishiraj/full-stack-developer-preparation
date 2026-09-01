import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Losing this in Callbacks",
  "whatIsIt": "this is lost when a method is used as a bare callback: btn.addEventListener('click', obj.method) calls method with this = the element (or undefined in some APIs), not obj. setTimeout(obj.method) is a bare call. Fixes: wrap in arrow, bind, or use a class field arrow.",
  "whyExists": "Passing functions around is JS’s superpower; call-site this is its tax. Losing this is the tax bill.",
  "mentalModel": "You tore the method off the object and mailed only the function. The postage (this) is filled by the mailer, not the object.",
  "how": [
    "addEventListener('click', () => obj.method()).",
    "addEventListener('click', obj.method.bind(obj)).",
    "Do not bind in render loops without memoizing — new function every time.",
    "Check the API: some like React class methods need bind in the constructor historically."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Binding in a render: <button onClick={this.fn.bind(this)}> creates a new function every render and breaks shouldComponentUpdate-style identity checks.",
    "variant": "warning"
  },
  "example": "const counter = {\n  n: 0,\n  inc() { this.n += 1; return this.n; },\n};\nconst stolen = counter.inc;\ntry { stolen(); } catch (e) { console.log(e.name); }\nconsole.log(counter.inc());\nsetTimeout(() => console.log('wrapped', counter.inc()), 0);\nsetTimeout(counter.inc.bind(counter), 0);\n",
  "exampleCaption": "Stolen method throws; bind/wrap restore this",
  "internals": [
    "Host APIs call the callback with their chosen thisArg (the event target for many DOM events).",
    "setTimeout in browsers uses a this of window for classic functions in sloppy mode.",
    "bind creates a new exotic function identity."
  ],
  "takeaways": [
    "addEventListener('click', () => obj.method()).",
    "addEventListener('click', obj.method.bind(obj)).",
    "Binding in a render: <button onClick={this.fn.bind(this)}> creates a new function every render and breaks shouldComponentUpdate-style identity checks.",
    "Host APIs call the callback with their chosen thisArg (the event target for many DOM events)."
  ],
  "revision": [
    "Losing this in Callbacks: You tore the method off the object and mailed only the function. The postage (this) is filled by the mailer, not the object.",
    "addEventListener('click', () => obj.method()).",
    "addEventListener('click', obj.method.bind(obj)).",
    "Do not bind in render loops without memoizing — new function every time.",
    "Trap: Binding in a render: <button onClick={this.fn.bind(this)}> creates a new function every render and breaks shouldComponentUpdate-style identity checks."
  ],
  "flashcards": [
    [
      "Losing this in Callbacks",
      "this is lost when a method is used as a bare callback: btn.addEventListener('click', obj.method) calls method with this = the element (or undefined in some APIs), not obj."
    ],
    [
      "Mental model",
      "You tore the method off the object and mailed only the function. The postage (this) is filled by the mailer, not the object."
    ],
    [
      "Common trap",
      "Binding in a render: <button onClick={this.fn.bind(this)}> creates a new function every render and breaks shouldComponentUpdate-style identity checks."
    ],
    [
      "addEventListener('click', () => obj.method()).",
      "addEventListener('click', obj.method.bind(obj))."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Losing this in Callbacks and where does a beginner first see it?",
      "answerHint": "this is lost when a method is used as a bare callback: btn.addEventListener('click', obj.method) calls method with this = the element (or undefined in some APIs), not obj. setTimeout(obj.method) is a bare call. Fixes: wrap in arrow, bind, or use a class field arrow."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Losing this in Callbacks works and name the main pitfall.",
      "answerHint": "addEventListener('click', () => obj.method()). addEventListener('click', obj.method.bind(obj)). Do not bind in render loops without memoizing — new function every time. Check the API: some like React class methods need bind in the constructor historically. Pitfall: Binding in a render: <button onClick={this.fn.bind(this)}> creates a new function every render and breaks shouldComponentUpdate-style identity checks."
    },
    {
      "level": "advanced",
      "question": "How would you explain Losing this in Callbacks at an interview, including engine/spec details?",
      "answerHint": "Host APIs call the callback with their chosen thisArg (the event target for many DOM events). setTimeout in browsers uses a this of window for classic functions in sloppy mode. bind creates a new exotic function identity."
    }
  ],
  "pitfalls": [
    "Binding in a render: <button onClick={this.fn.bind(this)}> creates a new function every render and breaks shouldComponentUpdate-style identity checks.",
    "Check the API: some like React class methods need bind in the constructor historically."
  ],
  "interview": {
    "expectations": [
      "Explain Losing this in Callbacks without mixing it up with a nearby B1.15 — this, call, apply, bind topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Host APIs call the callback with their chosen thisArg (the event target for many DOM events)."
    ],
    "commonQuestions": [
      "What is Losing this in Callbacks?",
      "Why does JavaScript losing this in callbacks behave this way?",
      "What is the classic Losing this in Callbacks interview trap?"
    ],
    "traps": [
      "Binding in a render: <button onClick={this.fn.bind(this)}> creates a new function every render and breaks shouldComponentUpdate-style identity checks."
    ],
    "misconceptions": [
      "Passing functions around is JS’s superpower; call-site this is its tax. Losing this is the tax bill."
    ],
    "strongSignals": [
      "Separates Losing this in Callbacks from lookalike APIs and can draw the mental model."
    ]
  }
})
