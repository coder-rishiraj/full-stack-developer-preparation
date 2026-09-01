import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "React + TypeScript",
  "whatIsIt": "React + TS types components as functions/classes returning JSX, props as interfaces, hooks with generics, and events from @types/react. Strict mode catches missing props, wrong children, and ref types.",
  "whyExists": "Modern front-end jobs expect typed React — props, context, reducers.",
  "mentalModel": "Components are typed functions from props to JSX.Element.",
  "how": [
    "function Component(props: Props): JSX.Element.",
    "React.FC optional — explicit props preferred.",
    "useState infers from initial value; annotate when null.",
    "Event types: React.ChangeEvent<HTMLInputElement>.",
    "Generic components for lists and form fields."
  ],
  "callout": {
    "title": "Watch for",
    "text": "React.FC implicit children — explicit Props clearer.",
    "variant": "warning"
  },
  "example": "type Props = { label: string; onClick: () => void };\nexport function Button({ label, onClick }: Props) {\n  return <button type=\"button\" onClick={onClick}>{label}</button>;\n}\nconst __typed: Props = {} as Props;\nconsole.log(\"export type { Props }\");\n// type Props = { label: string; onClick: () => void }; narrows allowed values\nconsole.log(Button('demo'));\n// Props is available to importers as a type alias",
  "exampleCaption": "Button props typed label + onClick",
  "internals": [
    "JSX.IntrinsicElements for DOM attribute typing.",
    "RefObject<T | null> for useRef DOM nodes.",
    "Server Components change some prop/async patterns in Next.js."
  ],
  "takeaways": [
    "function Component(props: Props): JSX.Element.",
    "React.FC optional — explicit props preferred.",
    "React.FC implicit children — explicit Props clearer.",
    "JSX.IntrinsicElements for DOM attribute typing."
  ],
  "revision": [
    "React + TypeScript: Components are typed functions from props to JSX.Element.",
    "function Component(props: Props): JSX.Element.",
    "React.FC optional — explicit props preferred.",
    "useState infers from initial value; annotate when null.",
    "Trap: React.FC implicit children — explicit Props clearer."
  ],
  "flashcards": [
    [
      "React + TypeScript",
      "React + TS types components as functions/classes returning JSX, props as interfaces, hooks with generics, and events from @types/react."
    ],
    [
      "Mental model",
      "Components are typed functions from props to JSX.Element."
    ],
    [
      "Common trap",
      "React.FC implicit children — explicit Props clearer."
    ],
    [
      "function Component(props: Props): JSX.Element.",
      "React.FC optional — explicit props preferred."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is React + TypeScript in TypeScript and when do you use it?",
      "answerHint": "React + TS types components as functions/classes returning JSX, props as interfaces, hooks with generics, and events from @types/react. Strict mode catches missing props, wrong children, and ref types."
    },
    {
      "level": "intermediate",
      "question": "Explain React + TypeScript with a code example and one pitfall.",
      "answerHint": "function Component(props: Props): JSX.Element. React.FC optional — explicit props preferred. useState infers from initial value; annotate when null. Event types: React.ChangeEvent<HTMLInputElement>. Generic components for lists and form fields. Pitfall: React.FC implicit children — explicit Props clearer."
    },
    {
      "level": "advanced",
      "question": "How would you explain React + TypeScript in a senior frontend interview?",
      "answerHint": "JSX.IntrinsicElements for DOM attribute typing. RefObject<T | null> for useRef DOM nodes. Server Components change some prop/async patterns in Next.js. type Props = { label: string; onClick: () => void };\nexport function Button({ label, onClick }: Props) {\n  return <butto"
    }
  ],
  "pitfalls": [
    "React.FC implicit children — explicit Props clearer."
  ],
  "interview": {
    "expectations": [
      "Explain React + TypeScript with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "JSX.IntrinsicElements for DOM attribute typing."
    ],
    "commonQuestions": [
      "What is React + TypeScript?",
      "When would you choose React + TypeScript over alternatives?",
      "What is the classic React + TypeScript interview trap?"
    ],
    "traps": [
      "React.FC implicit children — explicit Props clearer."
    ],
    "misconceptions": [
      "Modern front-end jobs expect typed React — props, context, reducers."
    ],
    "strongSignals": [
      "Uses React + TypeScript to remove invalid states, not just document them."
    ]
  }
})
