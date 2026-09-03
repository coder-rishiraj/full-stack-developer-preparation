import type { ReactInterviewItem } from './types'

export const REACT_INTERVIEW_MCQ: ReactInterviewItem[] = [
  {
    id: 'mcq-necessary-api',
    question: '______ is a necessary API for every React class component.',
    mcq: {
      options: ['renderComponent', 'render', 'SetinitialComponent', 'All of the above'],
      correctIndex: 1,
      explanation:
        'Class components must implement render(). Function components are themselves the render function. renderComponent is not a React API.',
    },
    answer: [],
  },
  {
    id: 'mcq-react-used-for',
    question: 'React is mainly used for developing ______.',
    mcq: {
      options: ['Connectivity', 'Database', 'User interface', 'Design platform'],
      correctIndex: 2,
      explanation: 'React is a UI library. Networking and databases are separate layers.',
    },
    answer: [],
  },
  {
    id: 'mcq-keys-unique',
    question: 'Keys given to a list of elements in React should be ______.',
    relatedTopicIds: ['b4-keys'],
    mcq: {
      options: [
        'Not necessarily unique',
        'Unique among the siblings only',
        'Unique in the entire DOM',
        'None of the above',
      ],
      correctIndex: 1,
      explanation: 'Keys identify siblings in one list. The same key may appear in a different parent list.',
    },
    answer: [],
  },
  {
    id: 'mcq-return-elements',
    question: 'How many root nodes can a React component return?',
    mcq: {
      options: ['Any number of DOM nodes via a single parent or a Fragment', 'Exactly 5', 'Exactly 3', 'Exactly 2'],
      correctIndex: 0,
      explanation:
        'Older quizzes said “1 element.” Today you return one React node, which may be a Fragment wrapping many DOM nodes — or an array in some cases. You do not return two adjacent JSX roots without a wrapper/Fragment.',
    },
    answer: [],
  },
  {
    id: 'mcq-limitations',
    question: 'Which of these is a real limitation of React?',
    mcq: {
      options: [
        'JSX and the view-only scope mean you still choose the rest of the stack',
        'React cannot run in the browser',
        'React forbids CSS',
        'React cannot be used with TypeScript',
      ],
      correctIndex: 0,
      explanation:
        'React is the view layer. JSX is an extra syntax. Those are the honest limitations — not “the library is too large” as a unique fact, and not fictional bans on CSS or TS.',
    },
    answer: [],
  },
  {
    id: 'mcq-render-html',
    question: 'What function historically mounted a React tree into an HTML node?',
    mcq: {
      options: ['React.render()', 'ReactDOM.start()', 'React.mount()', 'ReactDOM.render() / createRoot().render()'],
      correctIndex: 3,
      explanation:
        'Legacy: ReactDOM.render(element, node). Modern: createRoot(node).render(element). There is no React.mount().',
    },
    answer: [],
  },
  {
    id: 'mcq-state',
    question: 'What is state in React?',
    relatedTopicIds: ['b4-state'],
    mcq: {
      options: [
        'Internal data the component owns and that can change over time',
        'Read-only data from a parent',
        'The browser cookie jar',
        'A Redux-only concept',
      ],
      correctIndex: 0,
      explanation: 'State is component-owned and mutable via setters. Props are the external inputs.',
    },
    answer: [],
  },
  {
    id: 'mcq-react-is',
    question: 'What is React / ReactJS?',
    mcq: {
      options: [
        'A component-based JavaScript library for UI',
        'A relational database',
        'A CSS preprocessor',
        'A JVM framework',
      ],
      correctIndex: 0,
      explanation: 'Library, not a full framework; UI components, not a database.',
    },
    answer: [],
  },
  {
    id: 'mcq-dynamic-list',
    question: 'What is the idiomatic way to render a dynamic list from an array?',
    relatedTopicIds: ['b4-keys'],
    mcq: {
      options: [
        'A special <Each/> component built into React',
        'Array.reduce only',
        'Array.map() to elements with keys',
        'A raw for loop inside JSX (syntax error)',
      ],
      correctIndex: 2,
      explanation: 'map in JSX is the usual pattern. You can also build an array of elements in a loop, then return it — but not a C-style for inside the JSX tag soup.',
    },
    answer: [],
  },
  {
    id: 'mcq-setstate',
    question: 'What is true about setState / the useState setter?',
    relatedTopicIds: ['b4-usestate'],
    mcq: {
      options: [
        'It always merges objects like class setState even in useState',
        'Updates are queued and re-render later; functional updaters see the latest snapshot',
        'It mutates state in place immediately',
        'It only works in class components',
      ],
      correctIndex: 1,
      explanation:
        'Class setState merges objects; useState replaces. Neither mutates immediately. Functional updates are the safe way when next depends on previous.',
    },
    answer: [],
  },
  {
    id: 'mcq-props-pass',
    question: 'What is used to pass data into a component from outside?',
    relatedTopicIds: ['b4-props'],
    mcq: {
      options: ['render() arguments', 'setState', 'PropTypes (runtime checks only)', 'props'],
      correctIndex: 3,
      explanation: 'Props are the inputs. PropTypes validate them in older JS apps; TypeScript is the usual check now.',
    },
    answer: [],
  },
  {
    id: 'mcq-create-app',
    question: 'Which command is the current default for a new React SPA (Vite)?',
    mcq: {
      options: [
        'npm install create-react-app',
        'npm create vite@latest',
        'npm install -g create-react-app (only official path)',
        'npx react-new',
      ],
      correctIndex: 1,
      explanation:
        'create-react-app is in maintenance sunset. Vite (or a framework like Next.js) is what you should name in 2026 interviews.',
    },
    answer: [],
  },
  {
    id: 'mcq-advantages',
    question: 'Which of the following are advantages of React?',
    mcq: {
      options: [
        'It can sit next to other view layers and uses a reconciler for targeted updates',
        'It replaces SQL',
        'It forbids server rendering',
        'It requires jQuery',
      ],
      correctIndex: 0,
      explanation: 'React is embeddable, can SSR, and does not need jQuery.',
    },
    answer: [],
  },
  {
    id: 'mcq-webpack',
    question: 'Which statement about webpack is true?',
    relatedTopicIds: ['b4-bundle-optimization'],
    mcq: {
      options: [
        'It is only a React development server',
        'It is a module bundler (often used to pack JS/CSS for the browser)',
        'It is a React Hook',
        'It is the DOM itself',
      ],
      correctIndex: 1,
      explanation:
        'webpack bundles modules. Vite uses esbuild/Rollup instead. A local dev server is a separate concern (webpack-dev-server, Vite).',
    },
    answer: [],
  },
  {
    id: 'mcq-unidirectional',
    question: 'Which idea most directly describes unidirectional data in the React ecosystem?',
    mcq: {
      options: ['The DOM tree', 'Props as one-way inputs (Flux/Redux as an optional pattern)', 'JSX syntax', 'CSS modules'],
      correctIndex: 1,
      explanation:
        'Data flows down through props; Flux/Redux formalize a one-way store. JSX is syntax. The DOM is the platform, not the React data model.',
    },
    answer: [],
  },
]
