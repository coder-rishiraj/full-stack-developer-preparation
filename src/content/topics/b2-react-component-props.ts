import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Component Props",
  "whatIsIt": "Component props typed as interface or type: Props with required/optional fields, children?: React.ReactNode, className?, style?. Extend HTML attributes: ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>.",
  "whyExists": "Props are the public API of UI components — typing drives DX.",
  "mentalModel": "Ingredient list on component recipe card.",
  "how": [
    "Separate required vs optional props clearly.",
    "Pick HTML attributes to extend: ComponentPropsWithoutRef<\"button\">.",
    "Document default props via default parameters not defaultProps.",
    "Polymorphic components with as prop need generics.",
    "Export props type for consumers."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Extending entire HTMLAttributes — exposes too many props unintentionally.",
    "variant": "warning"
  },
  "example": "type IconProps = { name: 'check' | 'close'; size?: number };\ntype ButtonProps = IconProps & {\n  label: string;\n  onClick: () => void;\n};\nfunction IconButton({ name, size = 16, label, onClick }: ButtonProps) {\n  return <button aria-label={label} onClick={onClick}>{name} {size}</button>;\n}",
  "exampleCaption": "ButtonProps intersects IconProps + label/onClick",
  "internals": [
    "Intersection merges prop types.",
    "Optional default via destructuring default value.",
    "children typing ReactNode | undefined."
  ],
  "takeaways": [
    "Separate required vs optional props clearly.",
    "Pick HTML attributes to extend: ComponentPropsWithoutRef<\"button\">.",
    "Extending entire HTMLAttributes — exposes too many props unintentionally.",
    "Intersection merges prop types."
  ],
  "revision": [
    "Component Props: Ingredient list on component recipe card.",
    "Separate required vs optional props clearly.",
    "Pick HTML attributes to extend: ComponentPropsWithoutRef<\"button\">.",
    "Document default props via default parameters not defaultProps.",
    "Trap: Extending entire HTMLAttributes — exposes too many props unintentionally."
  ],
  "flashcards": [
    [
      "Component Props",
      "Component props typed as interface or type: Props with required/optional fields, children?: React.ReactNode, className?, style?."
    ],
    [
      "Mental model",
      "Ingredient list on component recipe card."
    ],
    [
      "Common trap",
      "Extending entire HTMLAttributes — exposes too many props unintentionally."
    ],
    [
      "Separate required vs optional props clearly.",
      "Pick HTML attributes to extend: ComponentPropsWithoutRef<\"button\">."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Component Props in TypeScript and when do you use it?",
      "answerHint": "Component props typed as interface or type: Props with required/optional fields, children?: React.ReactNode, className?, style?. Extend HTML attributes: ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>."
    },
    {
      "level": "intermediate",
      "question": "Explain Component Props with a code example and one pitfall.",
      "answerHint": "Separate required vs optional props clearly. Pick HTML attributes to extend: ComponentPropsWithoutRef<\"button\">. Document default props via default parameters not defaultProps. Polymorphic components with as prop need generics. Export props type for consumers. Pitfall: Extending entire HTMLAttributes — exposes too many props unintentionally."
    },
    {
      "level": "advanced",
      "question": "How would you explain Component Props in a senior frontend interview?",
      "answerHint": "Intersection merges prop types. Optional default via destructuring default value. children typing ReactNode | undefined. type IconProps = { name: 'check' | 'close'; size?: number };\ntype ButtonProps = IconProps & {\n  label: string;\n  onClick"
    }
  ],
  "pitfalls": [
    "Extending entire HTMLAttributes — exposes too many props unintentionally."
  ],
  "interview": {
    "expectations": [
      "Explain Component Props with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Intersection merges prop types."
    ],
    "commonQuestions": [
      "What is Component Props?",
      "When would you choose Component Props over alternatives?",
      "What is the classic Component Props interview trap?"
    ],
    "traps": [
      "Extending entire HTMLAttributes — exposes too many props unintentionally."
    ],
    "misconceptions": [
      "Props are the public API of UI components — typing drives DX."
    ],
    "strongSignals": [
      "Uses Component Props to remove invalid states, not just document them."
    ]
  }
})
