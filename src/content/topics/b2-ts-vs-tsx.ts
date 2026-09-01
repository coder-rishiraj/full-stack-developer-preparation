import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": ".ts vs .tsx",
  "whatIsIt": ".ts files contain TypeScript without JSX. .tsx files extend TS with JSX syntax for React (or other JSX factories). The compiler needs tsx to parse angle-bracket tags; jsx setting controls emit (React.createElement vs automatic runtime). Same type system applies to both extensions.",
  "whyExists": "JSX is syntactic sugar incompatible with generic angle brackets in .ts — `<T>` ambiguity forced a separate extension.",
  "mentalModel": ".ts is prose; .tsx is prose with stage directions for UI components.",
  "how": [
    "Rename component files using JSX to .tsx.",
    "Set \"jsx\": \"react-jsx\" for React 17+ automatic runtime.",
    "Generic components: function List<T>(props: { items: T[] }) in .tsx.",
    "Non-React JSX (Preact, Solid) sets jsxFactory/jsxFragmentFactory.",
    "Keep non-UI logic in .ts for faster checks and clearer boundaries."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using .ts for files containing <div> — parser treats < as less-than operator.",
    "variant": "warning"
  },
  "example": "// Button.tsx\ntype Props = { label: string; onClick: () => void };\nexport function Button({ label, onClick }: Props) {\n  return <button type=\"button\" onClick={onClick}>{label}</button>;\n}\nconsole.log(\"export type { Props }\");\n// type Props = { label: string; onClick: () => void }; narrows allowed values\nconsole.log(Button('demo'));\n// Props is available to importers as a type alias",
  "exampleCaption": "TSX pairs JSX with typed props",
  "internals": [
    "JSX emit transforms to createElement or jsxDEV calls.",
    "react-jsx import source is automatic from react/jsx-runtime.",
    "TS 5+ supports other JSX runtimes via jsxImportSource."
  ],
  "takeaways": [
    "Rename component files using JSX to .tsx.",
    "Set \"jsx\": \"react-jsx\" for React 17+ automatic runtime.",
    "Using .ts for files containing <div> — parser treats < as less-than operator.",
    "JSX emit transforms to createElement or jsxDEV calls."
  ],
  "revision": [
    ".ts vs .tsx: .ts is prose; .tsx is prose with stage directions for UI components.",
    "Rename component files using JSX to .tsx.",
    "Set \"jsx\": \"react-jsx\" for React 17+ automatic runtime.",
    "Generic components: function List<T>(props: { items: T[] }) in .tsx.",
    "Trap: Using .ts for files containing <div> — parser treats < as less-than operator."
  ],
  "flashcards": [
    [
      ".ts vs .tsx",
      ".ts files contain TypeScript without JSX."
    ],
    [
      "Mental model",
      ".ts is prose; .tsx is prose with stage directions for UI components."
    ],
    [
      "Common trap",
      "Using .ts for files containing <div> — parser treats < as less-than operator."
    ],
    [
      "Rename component files using JSX to .tsx.",
      "Set \"jsx\": \"react-jsx\" for React 17+ automatic runtime."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is .ts vs .tsx in TypeScript and when do you use it?",
      "answerHint": ".ts files contain TypeScript without JSX. .tsx files extend TS with JSX syntax for React (or other JSX factories). The compiler needs tsx to parse angle-bracket tags; jsx setting controls emit (React.createElement vs automatic runtime). Same type system applies to both extensions."
    },
    {
      "level": "intermediate",
      "question": "Explain .ts vs .tsx with a code example and one pitfall.",
      "answerHint": "Rename component files using JSX to .tsx. Set \"jsx\": \"react-jsx\" for React 17+ automatic runtime. Generic components: function List<T>(props: { items: T[] }) in .tsx. Non-React JSX (Preact, Solid) sets jsxFactory/jsxFragmentFactory. Keep non-UI logic in .ts for faster checks and clearer boundaries. Pitfall: Using .ts for files containing <div> — parser treats < as less-than operator."
    },
    {
      "level": "advanced",
      "question": "How would you explain .ts vs .tsx in a senior frontend interview?",
      "answerHint": "JSX emit transforms to createElement or jsxDEV calls. react-jsx import source is automatic from react/jsx-runtime. TS 5+ supports other JSX runtimes via jsxImportSource. // Button.tsx\ntype Props = { label: string; onClick: () => void };\nexport function Button({ label, onClick }: Props) {\n "
    }
  ],
  "pitfalls": [
    "Using .ts for files containing <div> — parser treats < as less-than operator."
  ],
  "interview": {
    "expectations": [
      "Explain .ts vs .tsx with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "JSX emit transforms to createElement or jsxDEV calls."
    ],
    "commonQuestions": [
      "What is .ts vs .tsx?",
      "When would you choose .ts vs .tsx over alternatives?",
      "What is the classic .ts vs .tsx interview trap?"
    ],
    "traps": [
      "Using .ts for files containing <div> — parser treats < as less-than operator."
    ],
    "misconceptions": [
      "JSX is syntactic sugar incompatible with generic angle brackets in .ts — `<T>` ambiguity forced a separate extension."
    ],
    "strongSignals": [
      "Uses .ts vs .tsx to remove invalid states, not just document them."
    ]
  }
})
