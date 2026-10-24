# Contents — SE Prep (Full Stack Developer)

## Site pages

- Dashboard / Roadmap — `/`
- Tracks — `/tracks/:trackId`
- Topics — `/topics/:topicId` (full · study · revision)
- DSA Explorer (CSES + NeetCode 250) — `/dsa`
- Revision — `/revision`
- Interview Prep — `/interview` (Java `/interview/java`, React `/interview/react`)
- Capstone — `/capstone`
- Print Center — `/print` (curriculum index/outline, DSA sheet, revision sheet, graphs handbook)
- Favorites — `/favorites`
- Settings — `/settings`

## Curriculum

- [Track A — DSA & Problem Solving](#track-a)
- [Track B — Frontend Engineering](#track-b)
- [Track C — Java & Backend Engineering](#track-c)
- [Track D — LLD, System Design & Distributed Systems](#track-d)
- [Track E — Applied AI Engineering](#track-e)

<a id="track-a"></a>

### Track A — DSA & Problem Solving

#### A1. Programming for Interviews

- Java Syntax for Competitive Coding
- Collections Framework
  - HashMap
  - HashSet
  - TreeMap
  - TreeSet
  - Deque
  - PriorityQueue
- Comparable / Comparator
- Strings / StringBuilder
- Custom Classes
- Recursion
- Time/Space Complexity
  - Space Complexity
- Big-O Analysis
- Java Streams for Interviews

#### A2. Arrays & Strings

- Array/String Traversal and Manipulation
- Prefix/Suffix Techniques
- Two Pointers
- Sliding Window
- Frequency Counting
- Hashing
- Sorting-Based Problems
- Matrix Problems
- Interval Problems
- Kadane's Algorithm
- Difference Arrays

#### A3. Searching & Sorting

- Binary Search
- Binary Search on Answer
- Lower/Upper Bounds
- Merge Sort
- Quick Sort Concepts
- Comparator-Based Sorting
- Quickselect
- Counting/Bucket Sorting Concepts
  - Bucket Sort Concepts

#### A4. Linked Lists

- Singly/Doubly Linked Lists
  - Doubly Linked Lists
- Fast/Slow Pointers
- Linked List Reversal
- Cycle Detection
- Merge Lists
- List Intersection
- LRU-Style Linked-List Manipulation

#### A5. Stack & Queue

- Stack
- Queue
- Deque
- Monotonic Stack
- Monotonic Queue
- Next Greater/Smaller Element
- Parentheses/Expression Problems
  - Expression Problems

#### A6. Trees

- Binary Trees
- Tree DFS
- Tree BFS/Level-Order Traversal
  - Level-Order Traversal
- Binary Search Trees
- Tree Height/Depth
- Tree Diameter
- Lowest Common Ancestor
- Tree Path Problems
- Tree Construction
- Serialization/Deserialization
- Tree Views
- N-ary Trees

#### A7. Heaps

- Min/Max Heap
  - Max Heap
- Priority Queues
- Top-K Problems
- K-way Merge
- Running Median
- Two-Heap Pattern

#### A8.1. Graph Foundations & Representations

- Graph Representation
  - Directed, Undirected, Weighted & Unweighted
  - Degree, Path, Cycle & Connectivity Terms
  - Adjacency List (Default CP Choice)
  - Adjacency Matrix
  - Edge List
  - Choosing Matrix vs List vs Edge List
  - Transitive Closure
  - Graph from Given Degrees of Vertices

#### A8.2. BFS & DFS Traversal

- BFS (Breadth-First Search)
  - DFS (Depth-First Search)
  - BFS vs DFS — When to Use Which
  - BFS Shortest Path (Unweighted)
  - Iterative DFS with Explicit Stack
  - Clone Graph (BFS / DFS)
  - Clone a Directed Acyclic Graph

#### A8.3. Grid Graphs & Pattern BFS

- Multi-source BFS
  - Grid as a Graph
  - 0-1 BFS (Deque)
  - Flood Fill
  - Number of Islands
  - Rotten Oranges / Multi-source Spread
  - Word Ladder
  - Snakes and Ladders
  - Shortest Path in Binary Matrix
  - Pacific Atlantic Water Flow
  - Steps by Knight (BFS on Grid)
  - Water Jug Problem
  - Boggle (All Words in a Board)

#### A8.4. Cycle Detection — Undirected Graphs

- Cycle Detection in Undirected Graphs
  - Undirected Cycle via DFS + Parent
  - Undirected Cycle via BFS + Parent
  - Print Shortest Cycle / Minimum Weight Cycle
  - Cycles of Length N
  - Print All Cycles

#### A8.5. Cycle Detection — Directed Graphs

- Graph Cycle Detection (Directed)
  - Directed Cycle via DFS Colors / Recursion Stack
  - Directed Cycle via BFS (Kahn / Toposort)
  - Cycle Detection Using Colors (White / Gray / Black)
  - Negative Weight Cycle Detection

#### A8.6. Topological Sort & DAG Algorithms

- Topological Sorting
  - Kahn's Algorithm (BFS + Indegree)
  - Topological Sort via DFS + Stack
  - Shortest Path in a DAG
  - DAG Dynamic Programming
  - Topological Sort Using Departure Time of Vertex
  - All Topological Sorts of a DAG
  - Maximum Edges That Can Be Added to a DAG
  - Longest Path in a DAG
  - Find Itinerary from a List of Tickets
  - Course Schedule / Dependency Ordering

#### A8.7. Bipartite Graphs

- Bipartite Graphs
  - Bipartite Check via BFS 2-Coloring
  - Bipartite Check via DFS 2-Coloring
  - Odd Cycle ⇔ Not Bipartite
  - Two Clique Problem

#### A8.8. Connected Components

- Connected Components
  - Components via BFS (Graph & Grid)
  - Components via DFS (Graph & Grid)
  - Largest Region in a Boolean Matrix
  - Count Trees in a Forest
  - Universal Sink
  - Number of Sinks in a Graph

#### A8.9. Disjoint Set Union (Union-Find)

- Union-Find / DSU
  - Path Compression
  - Union by Rank
  - Union by Size
  - DSU on Grids
  - Dynamic Connectivity Patterns

#### A8.10. Shortest Paths — Non-negative Weights

- Dijkstra
  - Dijkstra with Priority Queue (Standard)
  - Dijkstra with Set
  - Print Shortest Path (Dijkstra)
  - Why Dijkstra Fails on Negative Edges
  - Shortest-Path Algorithm Decision Tree
  - Dial's Algorithm
  - D'Esopo-Pape Algorithm

#### A8.11. Shortest Paths — Negative Weights & All-Pairs

- Bellman-Ford
  - Edge Relaxation & V−1 Iterations
  - Negative Cycle Detection (Nth Iteration)
- Floyd-Warshall
  - All-Pairs Shortest Paths via Intermediates
  - Johnson's Algorithm
  - Multistage Graph (Shortest Path)
  - Shortest Path in a Binary Graph
  - Minimum Mean Weight Cycle

#### A8.12. Minimum Spanning Trees

- Minimum Spanning Tree (Kruskal)
  - MST — Prim
  - Prim vs Kruskal
  - Spanning Tree vs MST
  - Minimum Cost to Connect All Cities
  - Applications of Minimum Spanning Tree
  - Total Spanning Trees
  - Minimum Product Spanning Tree
  - Reverse Delete Algorithm for MST
  - Borůvka's Algorithm for MST

#### A8.13. Strongly Connected Components

- Strongly Connected Components
  - Kosaraju's Algorithm (2× DFS)
  - Tarjan's Algorithm for SCC (1× DFS)
  - Condensation Graph (SCC → DAG)
  - Kosaraju vs Tarjan
  - Count Walks with Exactly K Edges
  - Array of Strings Chained to Form a Circle

#### A8.14. Bridges & Articulation Points

- Bridges in a Graph
  - Finding Bridges (disc / low)
  - Critical Connections in a Network
- Articulation Points (Cut Vertices)
  - Finding Articulation Points (disc / low)
  - Bridges vs Articulation Points
  - Biconnected Components

#### A8.15. Flow, Matching & Eulerian Paths

- Maximum Flow
  - Ford-Fulkerson / Edmonds-Karp
  - Dinic's Algorithm
  - Bipartite Matching via Flow
  - Push-Relabel Algorithm
  - Maximum Edge-Disjoint Paths
  - Minimum s–t Cut in a Flow Network
  - Hopcroft–Karp Maximum Matching
  - Channel Assignment Problem
  - Karger's Algorithm (Min Cut)
- Euler Path & Circuit
  - Euler vs Hamiltonian
  - Euler Circuit in a Directed Graph
  - Fleury's Algorithm for Euler Path / Circuit
  - Hierholzer's Algorithm (Directed / Undirected)
  - Seven Bridges of Königsberg
  - Chinese Postman / Route Inspection

#### A8.16. Interview Decision Framework & Must-Do Patterns

- Graph Interview Decision Framework
  - Identify Vertices & Edges First
  - Choose Algorithm from Constraints
  - Common Graph Mistakes
  - Must-Do Graph Patterns Cheat Sheet
  - Graph Complexity Cheat Sheet

#### A8.17. Classic & Advanced Graph Problems (GFG)

- Graph Coloring
  - Traveling Salesman (TSP)
  - Erdős–Rényi Model
  - Petersen Graph
- GFG Must-Do Graph Extras
  - Shortest Chain to Reach the Target Word

#### A9. Recursion & Backtracking

- Subsets
- Permutations
- Combinations
- Combination Sum
- Grid Search Backtracking
- N-Queens
- Constraint-Based Backtracking
- Pruning

#### A10. Greedy

- Interval Scheduling
- Sorting + Greedy
- Heap + Greedy
- Local vs Global Optimum Reasoning

#### A11. Dynamic Programming

- Memoization vs Tabulation
  - Tabulation
- 1D DP
- 2D DP
- Knapsack Patterns
- Subsequence Problems
- Longest Increasing Subsequence
- Longest Common Subsequence
- Grid DP
- Partition DP Basics
- DP on Trees
- State-Machine DP
- Bitmask DP

#### A12. Tries & Advanced Structures

- Trie
- Prefix Matching
- Segment Trees
- Fenwick Tree
- Sparse Tables

#### A13. Bit Manipulation

- AND / OR / XOR
- Set/Unset/Check Bit
  - Unset Bit
  - Check Bit
- Powers of Two
- XOR Tricks
- Bitmasking

#### A14. Coding Interview Execution

- Clarifying Requirements
- Explaining Brute-Force First
- Deriving Optimized Solution
- Thinking Aloud
- Clean Coding Without IDE Assistance
- Manual Testing
- Edge-Case Identification
- Complexity Analysis in Interviews
- Responding to Interviewer Hints
- Timed Mock Interviews
  - Mock Interviews

<a id="track-b"></a>

### Track B — Frontend Engineering

#### B1.1. JavaScript Foundations

- What JavaScript Is
- JavaScript vs ECMAScript
- JavaScript Runtimes
  - Browser Runtime
  - JavaScript Engine
  - Web APIs vs Language
  - Node.js Conceptually
- How JavaScript Loads in a Webpage
  - Inline Scripts
  - External Scripts
  - script async
  - script defer
  - type="module"
- Statements vs Expressions
- Syntax Basics
  - Comments
  - Identifiers
  - Keywords and Reserved Words
  - Case Sensitivity
  - Semicolons / ASI
  - Strict Mode
  - Console and Output
- Basic Debugging

#### B1.2. Variables & Declarations

- Variables
  - Declaration
  - Initialization
  - Assignment vs Reassignment
  - Redeclaration
- var
- let
- const
- var vs let vs const
  - Function Scope
  - Block Scope
  - Global Scope
- Temporal Dead Zone
- Global Variables and globalThis
- Variable Naming / Best Practices

#### B1.3. Types & Values

- Primitive Types
  - string
  - number
  - bigint
  - boolean
  - undefined
  - null
  - symbol
- Objects as Values
- Primitive vs Reference Types
  - Primitive Immutability
  - Object Mutability
  - Call-by-Sharing / Parameter Passing
- typeof
  - typeof null
- undefined vs null vs Undeclared
- NaN, Infinity, and Safe Numbers
  - Number.isNaN()
  - Object.is()
- Wrapper Objects / Autoboxing
- Truthy and Falsy Values
- instanceof
- Symbol.toStringTag

#### B1.4. Type Conversion & Coercion

- Explicit Conversion
  - String()
  - Number()
  - Boolean()
  - parseInt / parseFloat
  - Unary +
- Type Coercion
  - Implicit Coercion
  - Coercion with +
- Equality Operators
  - == Abstract Equality
  - === Strict Equality
  - != and !==
- Object-to-Primitive Conversion
  - valueOf()
  - toString()
  - Symbol.toPrimitive

#### B1.5. Operators & Expressions

- Arithmetic Operators
- Assignment Operators
- Comparison Operators
- Logical Operators
  - Short-Circuit Evaluation
- Unary Operators
  - Increment / Decrement
- Ternary Operator
- Operator Precedence & Associativity
- Optional Chaining
- Nullish Coalescing
  - Logical Assignment (&&= ||= ??=)
- Bitwise Operators
- in, delete, void, instanceof

#### B1.6. Control Flow

- if / else / else if
- switch
- for / while / do...while
- for...of vs for...in
- break / continue
  - Labels
- Nested Control Flow

#### B1.7. Strings

- String Creation & Immutability
  - Indexing and Length
- Core String Methods
  - Searching Strings
  - Extracting / Slicing
  - Replacing / Splitting / Trimming
- Template Literals
  - Interpolation
  - Multiline Strings
  - Escape Sequences
- Tagged Template Literals
- Unicode / UTF-16 Basics

#### B1.8. Numbers & Math

- Number Representation
  - Floating-Point and 0.1 + 0.2
  - Safe Integers
- Number Methods & Parsing
- Math
  - Rounding
  - Random Numbers
- BigInt

#### B1.9. Functions

- Function Declaration
- Function Expression
  - Named Function Expression
  - Anonymous Function
- Arrow Functions
  - Lexical this
- Parameters, Defaults, Rest, arguments
- First-Class / Higher-Order Functions
  - Callbacks
- Pure vs Impure Functions
  - Side Effects
- IIFE
- Function Hoisting vs Expression
- Recursion
- Currying & Partial Application
  - compose / pipe
- Memoization

#### B1.10. Scope & Lexical Environments

- Scope
  - Module Scope
- Lexical Scope
  - Scope Chain
  - Lexical Environment
  - Shadowing
- Variable Resolution

#### B1.11. Hoisting & Temporal Dead Zone

- Hoisting
  - Creation vs Execution Phase
  - var Hoisting
  - let/const Hoisting
  - Class Hoisting
- Hoisting Interview Puzzles

#### B1.12. Closures

- Closures
  - Closure Lifecycle
  - Private State / Function Factories
- Loops + Closures
  - var Loop Problem
- Stale Closures
  - Closures in React
- Closure Memory Implications
- Closure Interview Puzzles

#### B1.13. Objects

- Object Literals
  - Dot vs Bracket Notation
  - Computed Property Names
  - Property / Method Shorthand
- Object APIs
  - keys / values / entries / fromEntries
  - Object.assign / Object.create
  - freeze / seal / preventExtensions
  - hasOwn / ownership
- Shallow vs Deep Copy
  - structuredClone
  - Why JSON Cloning Is Problematic

#### B1.14. Object Property Model

- Own vs Inherited Properties
  - Enumerable Properties
- Property Descriptors
  - Object.defineProperty
  - writable / enumerable / configurable
- Getters & Setters

#### B1.15. this, call, apply, bind

- this
  - Default / Global Binding
  - Implicit Binding
  - Explicit Binding
  - new Binding
  - Arrow-Function Lexical Binding
  - Losing this in Callbacks
- call, apply, bind
  - apply
  - bind
  - Function Borrowing

#### B1.16. Prototypes & Prototype Chain

- Prototypes
  - [[Prototype]] / getPrototypeOf
- Prototype Chain
  - Property Lookup & Shadowing
- Constructor Functions
  - What new Actually Does
  - constructor Property
- Object.create
- Prototype Pollution (Concept)

#### B1.17. Classes & OOP

- Classes
  - constructor
  - Instance vs Static Methods
  - Public / Private Fields
- extends / super / Inheritance
  - Method Overriding
- Encapsulation, Polymorphism, Composition
- Classes vs Factories vs Constructors

#### B1.18. Arrays

- Array Creation, Indexing, Length
  - Sparse Arrays
- Mutating vs Non-Mutating Methods
  - push / pop / shift / unshift
  - slice vs splice
- Searching Arrays
  - includes / indexOf / find
  - some / every
- map / filter / reduce
  - forEach
  - flat / flatMap
- sort and JavaScript Sorting Gotchas
- Array.from / Array.isArray
- Copying Arrays

#### B1.19. Maps, Sets & Weak Collections

- Set
  - Set vs Array
- Map
  - Map vs Object
- WeakMap
- WeakSet
  - Weak References & GC

#### B1.20. Destructuring, Spread & Modern Syntax

- Destructuring
  - Defaults / Renaming / Nested
- Spread/Rest

#### B1.21. Iterables, Iterators & Generators

- Iterators/Generators
  - Iterable / Iterator Protocol
  - Symbol.iterator
  - Generators
  - yield / yield*
  - Async Iterators / for await...of

#### B1.22. Symbols

- Symbols
  - Symbol.for / keyFor
  - Well-known Symbols

#### B1.23. Execution Context

- Execution Contexts
  - Global Execution Context
  - Function Execution Context
  - Variable / Lexical Environment

#### B1.24. Call Stack

- Call Stack
  - Stack Frames
  - Stack Overflow
  - Reading Stack Traces

#### B1.25. JavaScript Runtime & Engine

- JavaScript Engine
  - Engine vs Host Environment
  - Heap
- Parsing, AST, Interpreter, JIT
  - V8 Architecture Conceptually
  - Hidden Classes / Inline Caching

#### B1.26. Event Loop

- JavaScript Event Loop
  - Run-to-Completion
- Microtasks vs Macrotasks
  - Macrotasks
  - queueMicrotask
  - Microtask Starvation
- Event-Loop Interview Puzzles

#### B1.27. Timers & Scheduling

- setTimeout / clearTimeout
- setInterval / clearInterval
  - Minimum-Delay Misconception
- requestAnimationFrame (Language View)

#### B1.28. Callbacks

- Callback Concept
  - Sync vs Async Callbacks
  - Error-First Callback Pattern
- Callback Hell & Inversion of Control

#### B1.29. Promises

- Promises
  - Pending / Fulfilled / Rejected
  - .then / .catch / .finally
  - Promise Chaining
- Error Propagation
- Promise Combinators
  - Promise.all
  - Promise.allSettled
  - Promise.race
  - Promise.any
- Sequential vs Parallel Async Work

#### B1.30. Async/Await

- async/await
  - try/catch with await
  - Why await Does Not Block the Runtime
- Async Control Flow

#### B1.31. Async Cancellation & Coordination

- AbortController / AbortSignal (Language)
- Race Conditions & Stale Requests
  - Timeouts / Retries / Deduplication
- Concurrency Limiting

#### B1.32. Error Handling

- Error Types
  - TypeError / ReferenceError / RangeError
- throw / try / catch / finally
- Custom Errors
- Unhandled Promise Rejection

#### B1.33. Debugging

- Browser DevTools
  - Breakpoints & Stepping
  - Watch / Scope / Call Stack
- Async Debugging
- Source Maps Conceptually
- Performance & Memory Profiling Basics

#### B1.34. Modules

- Modules
  - export / import
  - Default vs Named Exports
  - Dynamic import()
- ESM vs CommonJS
  - Live Bindings
  - Circular Dependencies
  - Top-level await
  - Tree Shaking Conceptually
- IIFE / Module Pattern (Historical)

#### B1.35. JSON & Serialization

- JSON vs JavaScript Objects
  - JSON.stringify / parse
  - Unsupported Values & Circular Refs
- replacer / reviver / toJSON

#### B1.36. Dates & Time

- Date Basics
  - Unix Timestamps
  - Local Time vs UTC
- Date Arithmetic Pitfalls
- Intl.DateTimeFormat
- Temporal API Direction

#### B1.37. Regular Expressions

- Regex Literals & Constructor
  - Classes, Quantifiers, Anchors, Flags
- test / exec / match / replace
- Groups & Lookaround Basics

#### B1.38. Functional JavaScript

- Declarative vs Imperative Style
  - Immutability
- Referential Transparency Concept

#### B1.39. Memory Management & Garbage Collection

- Memory Management
  - Reachability & Roots
- Garbage Collection
  - Mark-and-Sweep / Generational GC
- Common Memory Leaks
  - Heap Snapshots

#### B1.40. Performance Patterns

- Debouncing
- Throttling
  - Debounce vs Throttle
- Long Tasks / Main-Thread Blocking

#### B1.41. Proxy & Reflect

- Proxy/Reflect
  - Reflect
  - Traps (get/set/has/deleteProperty)
  - Validation / Reactivity Concepts

#### B1.42. Binary Data

- ArrayBuffer / TypedArray / DataView
- Blob / File / FileReader (Language)

#### B1.43. JavaScript Implementation Exercises

- Implement map / filter / reduce / forEach
- Implement call / apply / bind
- Implement Promise.all / allSettled / race
- Implement debounce / throttle / memoize
- Implement curry / compose / pipe
- Implement deep clone / flatten / deep equality
- Implement get(object, path)
- Implement EventEmitter
- Implement retry / sleep / concurrency limiter
- Implement a Promise
- Implement LRU Cache in JavaScript

#### B2.1. Introduction & Setup

- What TypeScript Is
- TypeScript vs JavaScript
- Why Use TypeScript
- TypeScript Trade-offs
- Optional Static Typing
- Compiling with tsc
- .ts vs .tsx

#### B2.2. Simple Types & Annotations

- Primitive & Object Types
  - string
  - number
  - boolean
- Explicit Types
- Type Annotations

#### B2.3. Type Inference

- Type Inference
- When to Annotate vs Infer

#### B2.4. Special Types

- any, unknown, never, void
  - Avoiding any
  - unknown
  - never
  - void
- null & undefined
- strictNullChecks

#### B2.5. Arrays

- Typed Arrays
  - Readonly Arrays
  - Array Type Inference

#### B2.6. Tuples

- Tuples
- Readonly Tuples

#### B2.7. Object Types

- Object Types
  - Optional Properties
  - readonly Properties
- Parameter Destructuring

#### B2.8. Enums & Literal Constants

- Enums
  - String Enums
- Literal Unions vs Enums
- as const Objects

#### B2.9. Interfaces

- Interfaces
  - Extending Interfaces
- Interface vs Type — When to Use

#### B2.10. Type Aliases

- Type Aliases
- Type Alias Patterns

#### B2.11. Unions & Intersections

- Union Types
  - Intersection Types
- Union & Intersection Patterns

#### B2.12. Literal Types & Discriminated Unions

- Literal Types
- Discriminated Unions
  - Exhaustiveness & assertNever
- RemoteData Async State Pattern

#### B2.13. Type Narrowing & Type Guards

- Type Narrowing
  - typeof Narrowing
  - instanceof Narrowing
  - in Operator
  - Custom Type Guards

#### B2.14. Functions

- Typed Functions
- Function Overloading
  - Optional & Rest Parameters
  - Arrow Functions
- Function Type Variance

#### B2.15. Casting & Assertions

- Type Assertions (as)
  - as const Assertion
  - Non-null Assertion (!)

#### B2.16. Classes

- Classes
  - Class Inheritance
  - super & Constructor

#### B2.17. Access Modifiers & Encapsulation

- public / private / protected
  - readonly Members
- Parameter Properties

#### B2.18. Abstract Classes & implements

- Abstract Classes
- implements vs extends
  - Method Overriding
- Singleton Pattern

#### B2.19. Generics

- Generics
- Generic Constraints
  - Generic Classes
  - Default Type Parameters

#### B2.20. Utility Types

- Utility Types Overview
  - Partial
  - Required
  - Pick
  - Omit
  - Record
  - Readonly
  - ReturnType
  - Parameters
  - Awaited

#### B2.21. keyof, typeof & Indexed Access

- keyof
- typeof (type level)
- Indexed Access Types
- keyof + typeof Patterns

#### B2.22. Structural Typing & Declaration Merging

- Structural Typing
- Declaration Merging
  - Module Augmentation

#### B2.23. Index Signatures

- Index Signatures
- Record vs Index Signature

#### B2.24. satisfies & as const

- satisfies
- as const
- Variant Maps with satisfies

#### B2.25. Conditional Types & infer

- Conditional Types
- infer
- Async Return with infer / Awaited

#### B2.26. Mapped & Template Literal Types

- Mapped Types
- Template Literal Types
  - Key Remapping (as)
- ChangeHandlers Pattern

#### B2.27. Type-Safe API Design

- Type-Safe API Design
  - Pick + Partial Patch Payloads
- Generic pick() Helper

#### B2.28. React + TypeScript

- React + TypeScript
  - Component Props
- Mutually Exclusive Props
  - Controlled vs Uncontrolled
- Typing Hooks

#### B2.29. Node.js + TypeScript

- Node.js + TypeScript
  - Express Request/Response Typing

#### B2.30. Modules

- TypeScript Modules
- ESM vs CommonJS in TS
- Namespaces

#### B2.31. tsconfig & Compiler Options

- tsconfig.json
  - strict & Compiler Flags
  - noImplicitAny
- Declaration Files (.d.ts)
- Source Maps & Debugging

#### B2.32. Tooling & Ecosystem

- Definitely Typed (@types)
- Third-Party Library Types
- ESLint + TypeScript
- Vite / Build Tooling

#### B2.33. Migration & Decorators

- Migrating JavaScript → TypeScript
  - allowJs & checkJs
- Decorators

#### B2.34. Advanced Patterns

- Mixins
- this Types
- Branded / Nominal Types

#### B2.35. TypeScript Implementation Exercises

- Implement type-safe pick()
- Implement RemoteData<T>
- Implement Exclusive Button Props
- Implement ChangeHandlers<T>
- Implement isPreferences Guard

#### B3.1. Browser Architecture

- Browser Architecture Overview
- Browser Processes
  - Browser Process
  - Renderer Process
  - GPU Process
  - Network Process
  - Utility / Plugin Processes
- Browser Threads
  - Main Thread
  - Compositor Thread
  - Raster Threads
  - Worker Threads in the Browser
- URL Navigation Lifecycle
  - DNS Resolution
  - TCP & TLS Handshake
  - HTTP Request & Response
  - Document Download & Parsing Start
- Site Isolation & Process Model
  - Origin-Keyed Processes
  - Cross-Site iframe Process Boundaries
- Rendering Engine (Blink / WebKit)
- JavaScript Engine in the Browser
- Browser Security Sandbox
- Multi-Tab & Multi-Window Architecture

#### B3.2. Window, Document & BOM

- Browser Object Model (BOM)
- window Object
  - Global Scope & window
  - Window Properties & Methods
  - window.open / close / focus
- document Object
  - document Properties
  - document Methods
  - document.readyState
- globalThis in the Browser
- navigator Object
  - userAgent & Client Hints
  - language & languages
  - onLine & Connection Info
  - clipboard (Overview)
- location Object
  - href / origin / pathname / search / hash
  - assign / replace / reload
- history Object
  - History Stack Model
  - back / forward / go
- History API
  - pushState / replaceState
  - popstate Event
  - hashchange Event
- screen Object
- console in the Browser
- setTimeout / setInterval in Browser
- alert / prompt / confirm

#### B3.3. DOM Fundamentals

- DOM
  - DOM Elements
- DOM Tree Model
  - Node Types (Element, Text, Comment, Document)
  - Parent / Child / Sibling Relationships
  - DocumentFragment
- Selecting Elements
  - querySelector / querySelectorAll
  - getElementById
  - getElementsByClassName
  - getElementsByTagName
  - matches / closest
- DOM Manipulation
  - createElement / createTextNode
  - append / prepend / appendChild
  - insertBefore / insertAdjacentElement
  - remove / replaceChild / replaceWith
  - cloneNode
- DOM Content & Text
  - textContent vs innerText
  - innerHTML / outerHTML
  - insertAdjacentHTML
- Attributes & Properties
  - getAttribute / setAttribute / removeAttribute
  - Attributes vs Properties
  - data-* & dataset
  - classList
  - element.style
- DOM Traversal
  - parentElement / children / childNodes
  - firstChild / lastChild / nextSibling / previousSibling
  - TreeWalker / NodeIterator
- Live vs Static Collections
- Shadow DOM (Overview)

#### B3.4. DOM Events

- DOM Events
  - addEventListener
  - removeEventListener
  - Listener Options (once, passive, capture)
- Event Object
  - target vs currentTarget
  - preventDefault()
  - stopPropagation / stopImmediatePropagation
  - type / eventPhase / bubbles / cancelable
- Event Bubbling & Capturing
  - Event Capturing
- Event Delegation
- Custom Events
  - CustomEvent Constructor
  - dispatchEvent
- Event Categories
  - Mouse Events
  - Keyboard Events
  - Focus Events
  - Form & Input Events
  - Touch & Pointer Events
  - Scroll Events
  - Clipboard Events
  - Drag Events
- Inline Event Handlers
- Event Timing & Order

#### B3.5. HTML Parsing & Page Loading

- HTML Parsing
  - Tokenization & Tree Construction
  - Parser-Blocking Resources
  - Preload Scanner / Speculative Parsing
- Script Loading
  - async Scripts
  - defer Scripts
  - type="module" Scripts
  - Dynamic import() in Browser
- Stylesheet Loading
  - Render-Blocking CSS
  - media Attribute & Conditional CSS
- Page Load Lifecycle Events
  - DOMContentLoaded
  - load Event
  - beforeunload / unload
- Resource Load Priority
- First Paint & First Contentful Paint

#### B3.6. Critical Rendering Path

- Critical Rendering Path
  - CSSOM
  - Render Tree
  - DOM + CSSOM → Render Tree
- display:none vs visibility:hidden
- Blocking vs Non-Blocking Resources
- Critical CSS Extraction
- Above-the-Fold Rendering Strategy
- Font Loading & FOIT/FOUT
  - font-display
- content-visibility

#### B3.7. Layout, Reflow, Paint & Compositing

- Layout (Reflow)
  - Box Model in Layout
  - Normal Flow & Positioning Impact
  - Flexbox & Grid Layout
- Paint
  - Paint Layers & Recording
  - Paint Optimization
- Compositing
  - Compositor Layers
  - GPU Acceleration
  - transform & opacity Compositing
- Reflow & Repaint
  - What Triggers Reflow
  - What Triggers Repaint
- Layout Thrashing
  - Read/Write DOM Interleaving
  - Batching DOM Reads & Writes
- will-change
- contain Property
- Layer Promotion & Demotion

#### B3.8. Browser Event Loop & Rendering

- Browser Event Loop
  - Task Queue vs Microtask Queue
  - Rendering Steps in the Loop
  - Style → Layout → Paint → Composite Order
- Long Tasks in the Browser
  - Long Task API / PerformanceLongTaskTiming
  - Main-Thread Blocking Symptoms
- requestIdleCallback
- Scheduler.postTask
- Input Delay & Responsiveness
- Frame Budget (16.67ms)
- Event Loop vs Rendering Sync Points

#### B3.9. requestAnimationFrame

- requestAnimationFrame
  - rAF Callback Timing
  - cancelAnimationFrame
  - rAF vs setTimeout for Animation
- rAF Animation Patterns
  - Game Loop Pattern
  - Scroll-Synced Animation
- Measuring Layout in rAF
- Double rAF Pattern

#### B3.10. Browser HTTP

- HTTP in the Browser
  - HTTP Request Structure
  - HTTP Response Structure
  - HTTP Methods (GET, POST, PUT, PATCH, DELETE)
- HTTP Headers
  - Common Request Headers
  - Common Response Headers
  - Content-Type & Charset
  - Cache-Control Headers
  - Set-Cookie / Cookie Headers
- HTTP Status Codes
  - 2xx Success Codes
  - 3xx Redirection Codes
  - 4xx Client Error Codes
  - 5xx Server Error Codes
- HTTP Versions
  - HTTP/1.1
  - HTTP/2
  - HTTP/3 & QUIC
- HTTPS in the Browser
  - TLS Certificates & Trust
  - Mixed Content
- Cookies in HTTP

#### B3.11. Fetch API

- Fetch API
  - Request Object
  - Response Object
  - Headers Object
  - GET / POST / PUT / DELETE with fetch
  - response.json() / text() / blob()
  - credentials: include / same-origin / omit
  - mode: cors / no-cors / same-origin
  - cache Option
- Fetch Error Handling
  - Network vs HTTP Errors
  - response.ok & Status Checking
- Streaming with Fetch
  - ReadableStream Response Body
- Fetch vs XMLHttpRequest
- FormData with Fetch

#### B3.12. AbortController & Cancellation

- AbortController
  - AbortSignal
  - Aborting fetch Requests
  - Timeout via AbortController
- Stale Request Handling
  - Request Deduplication
  - Ignoring Stale Responses
- Race Conditions in Data Fetching
  - Latest-Request-Wins Pattern
- AbortSignal with Other APIs

#### B3.13. Same-Origin Policy

- Same-Origin Policy
  - Origin Definition (scheme + host + port)
  - Same-Site vs Same-Origin
  - SOP & DOM Access
  - SOP & Network Access
  - SOP & Storage Access
- Cross-Origin Isolation
  - COOP & COEP Headers
- document.domain (Legacy)

#### B3.14. CORS

- CORS
  - Preflight Requests (OPTIONS)
  - Simple vs Non-Simple Requests
  - Access-Control-* Headers
  - Credentials in CORS
  - CORS Error Messages & Debugging
- Server-Side CORS Configuration
- CORS Proxy Patterns (Dev)
- JSONP (Legacy)

#### B3.15. Cookies

- Cookies
  - Cookie Attributes
  - HttpOnly
  - Secure
  - SameSite (Strict / Lax / None)
  - Domain & Path
  - Max-Age & Expires
- document.cookie API
- Cookie Size & Count Limits
- Third-Party Cookies
  - Third-Party Cookie Deprecation
- Cookie Security Model
- Cookie Store API

#### B3.16. Web Storage

- Web Storage API
  - localStorage
  - sessionStorage
  - localStorage API (getItem / setItem / removeItem)
  - sessionStorage Tab Lifecycle
- localStorage vs sessionStorage vs Cookies
  - Storage Quotas & Limits
  - storage Event
- Web Storage Security Considerations
- Storage Serialization (Strings Only)

#### B3.17. IndexedDB

- IndexedDB
  - IDBDatabase
  - Transactions & Version Changes
  - Object Stores & Indexes
  - Cursors & Key Ranges
- IndexedDB vs localStorage
- IndexedDB Async Model
- IndexedDB Wrapper Libraries

#### B3.18. Browser Caching

- HTTP Caching
  - Cache-Control Directives
  - ETag & If-None-Match
  - Last-Modified & If-Modified-Since
  - Cache Validation vs Freshness
- Memory Cache vs Disk Cache
  - Cache Partitioning (Third-Party)
- Service Worker Cache (Overview)
- Cache Busting Strategies
  - Asset Fingerprinting / Hashing
- stale-while-revalidate

#### B3.19. Content Security Policy

- Content Security Policy
  - CSP Directives
  - script-src
  - style-src
  - img-src & media-src
  - connect-src
  - frame-ancestors
  - Content-Security-Policy-Report-Only
  - Nonces & Hashes
  - Inline Script Restrictions
- CSP Deployment Strategy

#### B3.20. Browser Security Fundamentals

- Browser Security Fundamentals
- Cross-Site Scripting (XSS)
  - Reflected XSS
  - Stored XSS
  - DOM-Based XSS
  - XSS Prevention (encode, sanitize, CSP)
- Cross-Site Request Forgery (CSRF)
  - CSRF Tokens
  - SameSite Cookie Defense
  - Double-Submit Cookie Pattern
- Clickjacking
  - X-Frame-Options
  - Frame Busting (Legacy)
- Open Redirect Vulnerabilities
- Security Headers Overview
  - Strict-Transport-Security (HSTS)
  - Referrer-Policy
  - Permissions-Policy

#### B3.21. Web Workers

- Web Workers
  - Dedicated Workers
  - Shared Workers
  - postMessage & Message Passing
  - Transferable Objects
  - Worker Termination
- Worker Limitations (No DOM)
- Worker Use Cases
  - Offloading Heavy Computation
  - Background Parsing / Processing
- Module Workers (type: module)

#### B3.22. Service Workers

- Service Workers
  - Service Worker Lifecycle
  - install Event
  - activate Event
  - Update & skipWaiting
  - fetch Event & Request Interception
  - Cache API with Service Workers
  - Service Worker Scope
- Offline-First Patterns
- Push Notifications (Overview)
- Background Sync (Overview)

#### B3.23. WebSockets

- WebSockets
  - WebSocket Handshake
  - WebSocket API (send / close / events)
  - Binary & Text Messages
  - Reconnection Strategies
- WebSockets vs HTTP Polling
- WebSocket Security (wss://)
- WebSocket Use Cases

#### B3.24. Server-Sent Events

- Server-Sent Events (SSE)
  - EventSource API
  - SSE Event Format
  - Automatic Reconnection
- SSE vs WebSockets
- SSE vs Long Polling
- SSE Use Cases

#### B3.25. Observer APIs

- Intersection Observer
  - root / rootMargin / threshold
  - Lazy Loading with Intersection Observer
  - Infinite Scroll Detection
- Mutation Observer
  - observe Options & Callback
  - DOM Change Detection Use Cases
- Resize Observer
  - Element Resize Detection
- Performance Observer
  - Performance Entry Types
  - Observing Web Vitals

#### B3.26. Blob & File APIs

- Blob & File API
  - Blob Constructor
  - File Object
  - FileReader
  - URL.createObjectURL / revokeObjectURL
- Downloading Blobs
  - Anchor download Attribute
- Uploading Blobs via Fetch
- Blob Streaming

#### B3.27. Browser Performance

- Browser Performance
- Core Web Vitals
  - Largest Contentful Paint (LCP)
  - Interaction to Next Paint (INP)
  - Cumulative Layout Shift (CLS)
  - FCP & TTFB
- Performance API
  - performance.now()
  - Performance Timing / Navigation Timing
  - Resource Timing API
  - User Timing API (mark / measure)
- Performance Profiling with DevTools
  - Flame Chart Reading
  - Main-Thread Analysis
- Runtime Performance Optimization
- Loading Performance Optimization

#### B3.28. Resource Loading & Performance

- Resource Hints
  - preload
  - prefetch
  - preconnect & dns-prefetch
  - modulepreload
- Lazy Loading
  - loading="lazy" on Images
  - Lazy Loading iframes
- Image Optimization in Browser
  - srcset & sizes
  - picture Element
  - WebP / AVIF
- Font Loading Performance
- Code Splitting in the Browser
- Bundle Size & Tree Shaking Impact

#### B3.29. Navigation & SPA Browser Behavior

- SPA Navigation in the Browser
  - Client-Side Routing
  - History API in SPAs
  - Hash-Based Routing
- Scroll Restoration
  - history.scrollRestoration
- Page Lifecycle API
  - Page Visibility (document.visibilityState)
  - freeze / resume Events
- Back/Forward Cache (bfcache)
  - bfcache Blockers
- Hard Navigation vs Soft Navigation

#### B3.30. iframe & Cross-Document Communication

- iframe Fundamentals
  - sandbox Attribute
  - iframe Loading & Lazy Loading
  - iframe Security Considerations
- postMessage API
  - Origin Validation
  - Structured Clone Algorithm
- window.opener Security
  - rel="noopener"
- MessageChannel
- BroadcastChannel
- Cross-Document Embedding Patterns

#### B3.31. URL & URL APIs

- URL Parsing & Structure
  - scheme / host / port / path / query / hash
  - URL Encoding (encodeURIComponent)
- URL API
  - URLSearchParams
  - Base URLs & Relative Resolution
- URL.canParse()
- URL Fragment Directives
- URL Security (javascript: / data: URLs)

#### B3.32. Forms & Browser Input

- Forms in the Browser
  - Form Submission (GET / POST)
  - HTML5 Form Validation
  - Constraint Validation API
  - checkValidity / reportValidity
- Input Types & Browser Behavior
  - date / time / datetime-local
  - file Input
  - number / range
- Form Events (submit / reset / input / change)
- autocomplete Attribute
- Form Serialization
  - FormData API

#### B3.33. Clipboard, Drag & Drop, Selection

- Clipboard API
  - navigator.clipboard.readText / writeText
  - Clipboard Permissions
- Drag & Drop API
  - dragstart / dragover / drop
  - dataTransfer Object
- Selection API
  - window.getSelection()
  - Selection Ranges
- contenteditable

#### B3.34. Permissions & Device APIs

- Permissions API
  - navigator.permissions.query()
  - Permission Lifecycle & Prompts
- Geolocation API
- MediaDevices (Camera / Microphone)
  - getUserMedia()
- Notifications API
- Vibration API
- Battery Status API
- Device Orientation / Motion
- Web Bluetooth / USB (Overview)

#### B3.35. Accessibility Tree & Focus

- Accessibility Tree
  - How the Accessibility Tree Is Built
  - ARIA Roles in the Browser
  - Accessible Name & Description
- Focus Management
  - tabindex
  - Focus Trap Pattern
  - :focus-visible
  - element.focus() / blur()
- Keyboard Navigation
  - Roving Tabindex
- Live Regions (aria-live)
- Screen Reader Browser Interaction

#### B3.36. Browser Developer Tools

- Browser DevTools Overview
- Elements Panel
  - DOM Inspector & Styles
  - Computed Styles & Layout
  - Event Listeners Panel
- Console Panel
  - Logging Levels & Filtering
  - Live Expressions
- Network Panel
  - Network Waterfall Analysis
  - Network Throttling
  - Request Initiator Chain
- Performance Panel
  - Recording & Profiling
  - Performance Insights
- Application Panel
  - Storage Inspector (Cookies, LS, IDB)
  - Service Workers in DevTools
- Sources Panel & Debugging
  - Breakpoints & Conditional Breakpoints
  - Source Maps in DevTools
- Lighthouse in DevTools
- Memory Panel
  - Heap Snapshots

#### B3.37. Browser Interview Scenarios

- Explain the Critical Rendering Path
- What Triggers Reflow vs Repaint?
- Browser Event Loop & Rendering
- Explain CORS End-to-End
- Same-Origin Policy Scenarios
- Cookies vs localStorage vs sessionStorage
- XSS vs CSRF — Prevention
- HTTP Caching Strategy Design
- Fetch Cancellation & Race Conditions
- When to Use Each Observer API
- Web Workers vs Service Workers
- WebSockets vs SSE vs Polling
- Improve LCP / INP / CLS
- SPA Navigation & bfcache
- Debounce vs rAF vs setTimeout
- Secure postMessage Patterns
- Detect & Fix Layout Thrashing
- async vs defer vs module
- Design a CSP for a SPA
- Browser Process Architecture

#### B4.1. React Foundations

- React Component Model
  - What React Is & Problems It Solves
  - Declarative vs Imperative UI
  - Component-Based Architecture
  - One-Way Data Flow
- React vs ReactDOM
  - createRoot & Application Root
  - React Application Structure
- Function & Class Components
  - Function Components
  - Class Components — Legacy Understanding
  - Function vs Class Components
- React Node, Element & Component
  - React Node
  - React Element
  - React Component
- JSX
  - JSX Expressions
  - JSX Attributes
  - JSX Children
  - JSX vs HTML
  - JSX Transformation & Automatic Runtime
  - createElement
- Fragments
  - React.Fragment & Keyed Fragments
- Component Composition
  - children
  - Passing Components as Props

#### B4.2. Props, State & Data Flow

- Props
  - Props Destructuring
  - Default Prop Values
  - Props Immutability
- State
  - Props vs State
  - Initial State
  - Updating State
  - Functional / Updater State Updates
  - State Update Batching
  - Scheduled State Updates
  - State as a Snapshot
- State Immutability
  - Updating Objects in State
  - Updating Arrays in State
- Derived & Redundant State
  - Computed State
  - Avoiding Redundant State
- State Placement & Ownership
  - Lifting State Up
  - Sharing State Between Components
  - State Colocation
  - Single Source of Truth
  - Prop Drilling
- Component Communication
  - Parent → Child via Props
  - Child → Parent via Callbacks
  - Sibling Communication
- Controlled Components
  - Uncontrolled Components
- Preserving & Resetting State
  - Preserving State
  - Resetting State
  - How Keys Affect Component State

#### B4.3. Rendering & Reconciliation

- Rendering Lifecycle
  - Render vs Re-render
  - What Causes a Component to Render
  - Parent / Child Rendering Behavior
  - Render Phase
  - Commit Phase
- Reconciliation
  - Diffing Heuristics
- Virtual DOM
  - Virtual DOM Limitations
- React Fiber
  - Fiber Tree Concepts
  - Fiber Work Loop
- Keys & Component Identity
  - Stable Keys
  - Why Array-Index Keys Are Dangerous
  - Component Identity
- Rendering Patterns
  - Conditional Rendering
  - Rendering Lists
  - Nested Lists
  - Rendering null
- Pure Rendering
  - Side Effects During Render
- Strict Mode
  - Development Double Render / Effect Cycle
- Modern React Rendering Model

#### B4.4. Events

- React Event Handling
  - Event Handlers
  - Passing Handlers as Props
- Synthetic Events
  - Native vs Synthetic Events
- Event Propagation
  - Event Bubbling
  - Event Capturing
  - preventDefault
  - stopPropagation
  - Events Through Portals

#### B4.5. Forms

- Forms in React
  - Controlled Forms
  - Uncontrolled Forms
- Form Controls
  - Text Inputs
  - Textareas
  - Selects
  - Checkboxes
  - Radio Buttons
  - Multiple Inputs
- Form Submission
  - Form Validation Concepts
  - Pending / Error / Success States
- Form State Architecture
  - Form Libraries — Concepts

#### B4.6. Hooks Fundamentals

- Hooks Mental Model
  - Why Hooks Exist
  - Rules of Hooks
  - Hook Call Ordering
- useState
  - Lazy State Initialization
  - Functional State Updates
- useEffect
  - Effect Lifecycle
  - Dependency Arrays
  - Effect Cleanup
  - Stale Closures
  - Infinite Effect Loops
  - Race Conditions in Effects
  - When Effects Are Needed
  - When Not to Use Effects
  - Separating Events from Effects
- useRef
  - Ref vs State
  - DOM Refs
  - Mutable Values with Refs
- useContext
- useReducer
  - Reducer Patterns
- useMemo
- useCallback
- useLayoutEffect
- useImperativeHandle
- useId
- useDebugValue
- Custom Hooks
  - Designing Good Custom Hooks
  - Hook Composition

#### B4.7. Context

- Context API
  - createContext
  - Context Provider
  - Consuming Context
  - Context vs Props
  - Context vs State Management
- Context Performance
  - Context Re-render Behavior
  - Splitting Contexts
  - Memoizing Context Values
  - Context Pitfalls

#### B4.8. Refs & Imperative React

- Refs
  - Ref Lifecycle
  - Callback Refs
  - createRef
  - useRef vs createRef
- Ref Forwarding
  - forwardRef — Legacy / Pre-React-19
  - React 19 ref as a Prop
- Imperative Component APIs
  - When Imperative APIs Are Appropriate
  - Measuring DOM Nodes
  - Focus Management

#### B4.9. Portals & Advanced Component Patterns

- React Portals
  - Portal Event Propagation
- Higher-Order Components
- Render Props
- Compound Components
- Headless Components
- Reusable Component Patterns
  - Controlled Component Pattern
  - Provider Pattern
  - Container / Presentational Pattern
  - Composition over Inheritance
  - Reusable Component API Design

#### B4.10. Error Handling

- Error Boundaries
  - What Error Boundaries Catch
  - What Error Boundaries Do Not Catch
  - Error Fallback UI
  - Error Recovery
  - Error Reporting & Logging
- Async & Event-Handler Error Handling
  - Errors with Suspense

#### B4.11. Suspense & Async UI

- Suspense
  - Suspense Boundaries
  - Fallback UI
  - Nested Suspense
  - Suspense + Lazy Loading
  - Suspense + Data
- Async UI States
  - Loading States
  - Error States
  - Streaming Concepts
  - Async Rendering Mental Model

#### B4.12. Performance Engineering

- React Performance Mental Model
  - Why Components Re-render
  - Detecting Unnecessary Renders
- React DevTools
- React Profiler
  - Profiling Render Performance
- Memoization for Performance
  - React.memo
  - Shallow Comparison
  - Referential Equality
  - When Memoization Helps
  - When Memoization Hurts
- List Virtualization
  - Pagination
  - Infinite Scrolling
- Code Splitting
  - React.lazy & Lazy Loading
  - Dynamic Imports
  - Bundle Splitting
- Bundle-Size Optimization
  - Image & Resource Optimization Concepts
- Network Waterfalls
  - Avoiding Request Waterfalls
- Performance Measurement
- React Compiler & Automatic Memoization

#### B4.13. Concurrent React

- Concurrent Rendering
  - Interruptible Rendering
  - Update Priorities
  - Urgent vs Non-Urgent Updates
- Transitions
  - startTransition
  - useTransition
  - Pending Transition State
- useDeferredValue
  - useTransition vs useDeferredValue
- Suspense with Concurrent Rendering

#### B4.14. Data Fetching & Server State

- Data-Fetching Patterns
  - Fetching in Effects
  - Effect-Based Fetching Pitfalls
  - Loading / Error / Data States
  - Request Cancellation
  - Request Race Conditions
- Server Cache
  - Request Deduplication
  - Caching
  - Stale Data
  - Revalidation
  - Optimistic Updates
  - Infinite Queries
- Server vs Client State
- Server-State Libraries
  - TanStack Query Concepts
  - SWR Concepts
  - Choosing a Fetching Architecture

#### B4.15. State Management

- Kinds of Application State
  - Local State
  - Lifted State
  - Shared State
  - Global State
  - URL State
  - Form State
- State-Management Trade-offs
  - Context + Reducer
  - Context vs Redux vs Zustand
  - Avoiding Unnecessary Global State
- Redux Fundamentals
  - Redux Architecture
  - Actions
  - Reducers
  - Store & Dispatch
  - Selectors
- Redux Toolkit
  - Slices
  - configureStore
  - useSelector
  - useDispatch
  - createAsyncThunk
  - Middleware Concepts
  - Redux DevTools
- Zustand Concepts

#### B4.16. React Router

- React Router
  - SPA Routing
  - Client vs Server Routing
- Router Types
  - BrowserRouter
  - HashRouter
  - MemoryRouter
- Routes & Route Configuration
  - Routes
  - Route
  - Nested Routes & Outlet
  - Dynamic Routes
  - 404 / Catch-All Routes
- Router Navigation
  - Link
  - NavLink
  - useNavigate
  - useLocation
  - Programmatic Navigation & Redirects
- Route & Search Parameters
  - useParams
  - useSearchParams
- Protected Routes
  - Authentication & Authorization Routing
- Route-Level Lazy Loading
- Route Architecture

#### B4.17. React 19 & Modern React

- React 19 Overview
- Actions
  - Async Actions
  - useActionState
  - useOptimistic
  - use
  - useFormStatus
- Function-Based Form Actions
  - form action
  - formAction
  - Optimistic UI
- React 19 Platform Changes
  - Document Metadata Support
  - Stylesheet & Resource Handling
- React Compiler
  - Automatic Memoization
- Modern React Rules
  - Legacy APIs vs Modern Replacements

#### B4.18. Server Rendering & Server Components

- Client-Side Rendering (CSR)
- Server-Side Rendering (SSR)
- Static Site Generation (SSG)
- Hydration
  - Hydration Mismatches
  - Streaming SSR
  - Selective / Progressive Hydration
- React Server Components
  - Client Components
  - Server vs Client Components
  - 'use client'
  - Server-Only Code
  - Server Actions Concepts
  - RSC Serialization Boundaries
  - Data Fetching in Server Components
  - Suspense + Streaming
  - RSC Bundle-Size Implications

#### B4.19. Next.js Integration

- Next.js Architecture
  - Why React Frameworks Exist
  - App Router Concepts
  - Layouts & Pages
  - Routing & Dynamic Routes
  - Loading & Error UI
  - Data Fetching
  - Caching & Revalidation
  - Server Actions
  - SSR / SSG / ISR Strategies
  - Middleware Concepts
  - Authentication Architecture
  - Deployment Concepts

#### B4.20. React Testing

- React Testing Philosophy
  - Unit vs Integration vs E2E
  - Avoiding Implementation-Detail Tests
- React Testing Library
  - Rendering Components in Tests
  - Queries
  - getBy / queryBy / findBy
  - Role-Based Queries
  - userEvent
  - Testing Interactions & Forms
- Testing Async UI
  - waitFor
  - Testing Loading & Error States
  - Mocking API Requests
  - MSW Concepts
- Testing React Integrations
  - Testing Context
  - Testing Router
  - Testing Redux
- Testing Custom Hooks
  - renderHook
  - act
- Snapshot Testing & Limitations
- E2E with Playwright / Cypress

#### B4.21. Accessibility in React

- React Accessibility
  - Semantic Components
  - Accessible Forms & Labels
  - Keyboard Interactions
  - ARIA in React
  - Accessible Modals
  - Accessible Custom Widgets
  - useId for Accessibility
  - Route-Change Accessibility
  - Accessibility Testing Concepts

#### B4.22. Internationalization

- Internationalization in React
  - i18n vs l10n
  - Translation Architecture
  - Locale Management
  - Intl with React
  - react-i18next / react-intl Concepts
  - Numbers, Dates & Currency
  - Pluralization
  - RTL Layouts
  - Lazy-Loading Translations

#### B4.23. Legacy React & Existing Codebases

- Reading Class Components
  - this.props
  - this.state & setState
  - constructor
- Class Lifecycle Methods
  - componentDidMount
  - componentDidUpdate
  - componentWillUnmount
  - shouldComponentUpdate
  - PureComponent
  - Error-Boundary Lifecycle Methods
- Legacy & Deprecated APIs
  - Legacy Context — Awareness
  - Deprecated Lifecycle Methods

#### B4.24. React Architecture & Production Engineering

- Component Boundaries
  - Feature-Based Organization
  - Container / UI Separation
  - Custom-Hook Architecture
  - State Ownership
  - Dependency Direction
- Production UI Architecture
  - API & Data Layer
  - Error Architecture
  - Loading-State Architecture
  - Authentication & Authorization Integration
  - Feature Flags
  - Configuration & Environments
  - Design-System Integration
- Large-Scale React Application Structure
  - Performance Budgets
  - Observability & Error Monitoring
  - Analytics Integration
  - Maintainability & Refactoring
- React Anti-Patterns
  - Direct State Mutation
  - Effect Misuse
  - Bad Keys
  - Conditional Hooks
  - Excessive Global State

#### B5.1. Cascade & Selectors

- The Cascade
  - Origin, Importance & Source Order
  - Inheritance
  - !important
- Specificity
  - Specificity Calculation
  - :is() & :where()
  - :has()
- @layer Cascade Layers

#### B5.2. Box Model & Flow

- Box Model
  - box-sizing
  - Margin Collapse
  - Overflow
  - min-width: 0 & Flex/Grid Shrink Bugs
- Block Formatting Context
  - Containing Floats

#### B5.3. Display & Visibility

- The display Property
  - block vs inline
  - inline-block
  - none vs visibility vs opacity

#### B5.4. Flexbox

- Flexbox
  - Main Axis vs Cross Axis
  - Wrapping
  - flex-grow, flex-shrink & flex-basis
  - Alignment & Centering
  - When Flexbox vs Grid

#### B5.5. Grid

- Grid
  - Tracks, fr & gap
  - minmax()
  - Grid Template Areas
  - auto-fit vs auto-fill
  - Subgrid

#### B5.6. Positioning & Stacking

- Positioning
  - Containing Block
  - relative & absolute
  - position: fixed
  - position: sticky
- Stacking Context
  - z-index
  - What Creates a Stacking Context

#### B5.7. Units, Color & Typography

- CSS Units
  - px vs rem vs em
  - Viewport Units (vw, svh)
  - clamp() & Fluid Values
- Typography
  - Line Height & Measure
  - Web Fonts
- Color
  - color-scheme & light-dark()

#### B5.8. Responsive Design

- Responsive Design
  - Mobile-First
  - Media Queries
  - Fluid Type & Spacing
- Container Queries
- Logical Properties

#### B5.9. Theming & Custom Properties

- Custom Properties
  - Theming with CSS Variables
  - Tokens vs Preprocessor Variables

#### B5.10. Motion

- Transitions
  - Compositor-Safe Animation
- Animations
  - @keyframes
  - prefers-reduced-motion

#### B5.11. CSS Architecture

- CSS Architecture
  - BEM
  - CSS Modules
  - Utility-First / Tailwind
  - CSS-in-JS Trade-offs
- Design Systems
  - Design Tokens

#### B5.12. HTML & CSS Accessibility

- Semantic HTML
  - Landmarks & Document Outline
  - Accessible HTML Forms
- Accessibility
  - Focus Styles
  - forced-colors
- ARIA Basics
  - When Not to Use ARIA

#### B6.1. Interview Method

- RADIO Framework
  - Requirements & Constraints
  - Architecture Sketch
  - Data Model & Ownership
  - Interface & API Contracts
  - Optimizations (Perf, A11y, i18n)
- Question Types: Apps vs Widgets
  - Application / Product HLD
  - UI Component / Widget LLD
  - Hybrid: Widget Inside a Product
- Evaluation Criteria & Timeboxing
  - Common Interview Mistakes
  - Time Split in a 45-Minute Round

#### B6.2. Application Architecture

- Large-Application Architecture
  - SPA vs MPA Trade-offs
  - CSR, SSR, SSG & Streaming Choice
  - Feature Boundaries & Folder Structure
  - Config-Driven UI
- Frontend Error Handling
  - Error Boundaries at Product Edges
  - Retry, Timeout & Fallback UI
  - Empty, Partial & Degraded States
- SEO-Aware Frontend Architecture
  - SSR, Metadata & Crawlability
  - Forms, Checkout & Conversion UX

#### B6.3. Component & Widget LLD

- Component Architecture
  - Compound & Headless Components
  - Composition vs Configuration
  - Shimmer / Skeleton Loading
  - Autocomplete / Typeahead
  - Dropdown Menu
  - Image Carousel
  - Modal Dialog
  - Data Table
  - Poll Widget
  - Accordion
  - Nested Comments
  - Rich Text Editor

#### B6.4. State Architecture

- State Architecture
  - Client, Server & URL State
  - Store Boundaries & Ownership
  - Optimistic UI & Rollback
  - Derived vs Normalized State

#### B6.5. API Layer

- API-Layer Design
  - BFF & Aggregation
  - REST vs GraphQL vs RPC at the Client
  - List Contracts: Offset, Cursor, Relay
  - Error Envelopes & Idempotency

#### B6.6. Frontend Authentication

- Frontend Authentication
  - Session Cookies vs Tokens on the Client
  - Protected Routes & Auth Gates
  - Authorization in the UI
  - Refresh, Logout & Session Expiry

#### B6.7. Lists, Search & Pagination

- Pagination / Infinite Scrolling
  - Infinite Scrolling
  - Cursor vs Offset Pagination
  - Windowing & Virtualization
- Search & Autocomplete Architecture
  - Debounce, Cancel & Stale Responses
  - Ranking, Empty States & No-Results
  - Prefetch & Typeahead Caching

#### B6.8. Realtime UI

- Real-time UI
  - Polling vs WebSocket vs SSE
  - Presence, Typing & Read Receipts
  - Ordering, Gaps & Replay
  - Reconnect, Backoff & Fan-out

#### B6.9. Frontend Performance

- Frontend Performance
  - Core Web Vitals as Design Constraints
  - Rendering Patterns at Product Scale
  - Network & Build Optimization Choices
  - Performance Budgets & Monitoring
  - Main-Thread Work & Interaction Latency

#### B6.10. Caching & Offline

- Frontend Caching
  - HTTP Caching Strategy
  - API Cache & Stale-While-Revalidate
  - In-Memory Cache & Request Deduping
- Offline & PWA Strategy
  - Service Worker Caching Strategies
  - Offline Queue, Sync & Conflict UI

#### B6.11. Frontend Security Architecture

- Frontend Security Architecture
  - XSS & CSRF as Design Choices
  - Headers, SRI & iframe Isolation
  - Third-Party Scripts & Supply Chain
  - Untrusted HTML, Markdown & Embeds

#### B6.12. Observability

- Frontend Observability
  - Telemetry & Real User Monitoring
  - Alerting on Client Failures
  - Session Replay & Privacy

#### B6.13. A11y, i18n & Design Systems

- Accessibility in Large Apps
  - Keyboard & Focus at App Scale
  - A11y, Performance & Dynamic Content
- Internationalization
  - RTL, Locale Routing & Copy Length
  - ICU, Plurals & Date/Number Formats
- Design Systems (System Design)
  - Tokens, Versioning & Governance
  - Adoption, Overrides & Multi-Brand

#### B6.14. HLD Case Studies & Microfrontends

- HLD Practice Cases
  - Practice: News Feed / Infinite Social Feed
  - Practice: Google Docs Frontend
  - Practice: YouTube Frontend
  - Practice: Chat App (Messenger / Slack)
  - Practice: Email Client (Gmail / Outlook)
  - Practice: Uber Web App
  - Practice: Trading Dashboard
  - Practice: Pinterest Masonry
  - Practice: Video Streaming (Netflix)
  - Practice: E-commerce Marketplace
  - Practice: Travel Booking
  - Practice: Photo Sharing
  - Practice: Music Streaming
  - Practice: Video Conferencing
  - Practice: Collaborative Spreadsheet
  - Practice: Design / Drawing Tool
  - Practice: Analytics Dashboard
  - Practice: Kanban Board
  - Practice: Live Commentary
- Micro-frontends Concepts
  - When Not to Use Microfrontends
  - Integration: Build, Runtime & Routing
  - Shared Dependencies & Design System

<a id="track-c"></a>

### Track C — Java & Backend Engineering

#### C1.1. Syntax & Types

- Language Syntax & Compilation
  - Comments
  - main() & Program Entry
  - Packages
- Data Types & Variables
  - Primitive Types
  - Reference Types
  - Type Casting
  - Local-Variable Type Inference (var)
- Scanner & User Input

#### C1.2. Operators & Control Flow

- Operators
  - Arithmetic & Assignment
  - Relational & Logical
  - Bitwise Operators
  - Precedence & Associativity
- Control Flow
  - if / else
  - switch
  - for / while / do-while
  - break & continue

#### C1.3. Arrays & Methods

- Arrays
  - Multidimensional Arrays
  - Arrays vs ArrayList
- Methods
  - Parameters & Return
  - Method Overloading
  - Variable Scope
  - Recursion
  - varargs

#### C1.4. Strings & Wrappers

- Strings
  - String Pool
  - StringBuilder / StringBuffer
  - == vs equals() on Strings
- Wrapper Classes
  - Autoboxing & Unboxing
  - Integer Cache

#### C1.5. OOP Foundations

- OOP
  - Aggregation & Composition
- Encapsulation
- Classes/Interfaces
  - Interfaces
  - Constructors
  - this Keyword
  - Access Modifiers

#### C1.6. Inheritance & Polymorphism

- Inheritance
  - super Keyword
  - java.lang.Object
- Polymorphism
  - Overloading vs Overriding
  - Dynamic vs Static Binding
  - Why static Methods Are Not Overridden
- Abstract Classes
  - Abstract Class vs Interface

#### C1.7. Records, Enums & Nested Types

- Records
- Enums
  - Enum Constructors & Fields
- Inner & Nested Classes
  - Anonymous Classes
  - Static Nested Classes

#### C1.8. Immutability & Object Contract

- Immutability
  - Defensive Copies
- equals() / hashCode()
  - hashCode()
  - equals vs Comparable

#### C1.9. Exceptions

- Exceptions
  - Checked vs Unchecked
  - try / catch / finally
  - try-with-resources
  - throw vs throws
  - Custom Exceptions

#### C1.10. Generics & Annotations

- Generics
  - Wildcards & Bounds
  - Type Erasure
- Annotations
  - Built-in Annotations

#### C1.11. Collections Framework

- List / Set / Map
  - Collection vs Collections
  - Fail-Fast vs Fail-Safe
  - Iterator & ListIterator
  - Comparable & Comparator

#### C1.12. Lists

- ArrayList
  - LinkedList
  - Vector vs ArrayList
  - List Sorting

#### C1.13. Sets, Maps & Queues

- HashMap Internals
  - Hash Collisions & Treeify
  - Resize & Transfer
- HashSet
  - TreeSet
  - LinkedHashSet
- TreeMap
- PriorityQueue
- ConcurrentHashMap

#### C1.14. Functional Java

- Lambdas
- Functional Interfaces
  - Default Methods on Interfaces
- Streams
  - Collectors
  - Intermediate vs Terminal Ops
- Optional
- Method References

#### C1.15. I/O & Serialization

- File I/O
  - Byte vs Character Streams
  - BufferedReader / BufferedWriter
  - NIO Path & Files
- Serialization
  - transient & Serializable
  - serialVersionUID

#### C1.16. Modern Java Language

- Switch Expressions
- Text Blocks
- Sealed Classes
- Pattern Matching
- Module System

#### C2.1. JDK, Runtime & JVM

- JDK / Runtime / JVM
  - javac, java, jar & jlink
  - Modern Runtime Images vs Legacy JRE
  - WORA & Platform-Specific JVM Builds

#### C2.2. Bytecode & Class Files

- Bytecode
  - .class File Structure
  - Runtime Constant Pool
  - Bytecode Verification
  - Inspecting Bytecode with javap
  - Class Version & UnsupportedClassVersionError

#### C2.3. JVM Architecture

- JVM Architecture
  - Class Loader Subsystem
  - Runtime Data Areas
  - Execution Engine
- JNI & Native Libraries
  - Native Method Stack

#### C2.4. Class Loading & Initialization

- Class Loading
  - Loading → Linking → Initialization
  - Verify, Prepare & Resolve
  - Bootstrap, Platform & Application Loaders
  - Parent Delegation
  - <clinit>, Static Blocks & Initialization Order
  - ClassNotFoundException vs NoClassDefFoundError
  - Class Unloading & Loader Leaks

#### C2.5. Runtime Memory Areas

- Stack vs Heap
  - Heap Area
  - Method Area & Metaspace
  - Stack Frames: Locals, Operand Stack & Frame Data
  - Per-Thread PC Register
  - JIT Code Cache
  - Direct / Off-Heap Memory

#### C2.6. Object Allocation

- Object Allocation
  - TLAB Fast-Path Allocation
  - Object Header, Mark Word & Klass Pointer
  - Compressed Oops
  - Escape Analysis & Scalar Replacement
  - Eden, Survivor & Promotion

#### C2.7. Interpreter & JIT

- JIT Compilation
  - Interpreter
  - Tiered Compilation: C1 & C2
  - Invocation Counters & Hot Methods
  - On-Stack Replacement
  - Inlining & Speculative Optimization
  - Deoptimization

#### C2.8. Garbage Collection Foundations

- Garbage Collection
  - Reachability & GC Roots
  - Young, Survivor & Old Generations
  - Young, Major & Full GC
- GC Algorithms/Concepts
  - Mark, Sweep, Compact & Copy
  - Safepoints & Stop-the-World
  - Write Barriers & Remembered Sets
  - Soft, Weak & Phantom References
  - Finalization, Cleaner & Resource Lifecycle

#### C2.9. Garbage Collectors

- JVM Garbage Collectors
  - Serial GC
  - Parallel / Throughput GC
  - G1 GC
  - ZGC
  - Shenandoah
  - CMS (Historical / Removed)

#### C2.10. Runtime Failures & Leaks

- Common JVM Errors
  - OutOfMemoryError: Java Heap Space
  - OutOfMemoryError: Metaspace
  - OutOfMemoryError: Direct Buffer Memory
  - StackOverflowError
- Memory Leaks
  - Caches, Listeners & ThreadLocal Leaks
  - Native Memory Leaks

#### C2.11. Diagnostics & Profiling

- JVM Profiling
  - Java Flight Recorder & Mission Control
  - async-profiler & Flame Graphs
  - jcmd, jstat & jstack
- Heap Dumps / Thread Dumps
  - Thread Dumps
  - Heap Dominators & Retained Size
  - Unified GC Logs

#### C2.12. JVM Tuning & Measurement

- JVM Tuning Strategy
  - -Xms, -Xmx & Heap Sizing
  - Latency vs Throughput
  - Container Memory Awareness
  - JMH, Warm-up & Benchmark Traps

#### C3.1. Concurrency Foundations

- Processes vs Threads
  - Concurrency vs Parallelism
  - Platform vs Virtual Threads
- Thread Safety
  - Shared Mutable State
  - Thread Confinement & Immutability

#### C3.2. Thread API & Lifecycle

- Thread Lifecycle
  - NEW, RUNNABLE, BLOCKED, WAITING & TERMINATED
  - Thread, Runnable & Callable
  - start() vs run()
  - sleep(), yield() & join()
  - Interruption & Cooperative Cancellation
  - Daemon Threads
  - UncaughtExceptionHandler
  - ThreadLocal & Cleanup

#### C3.3. Race Conditions & Safe State

- Race Conditions
  - Atomicity, Visibility & Ordering
  - Check-Then-Act & Read-Modify-Write
  - Critical Sections & Invariants
  - Safe Publication
  - Immutable Snapshots

#### C3.4. Java Memory Model

- Java Memory Model
  - Happens-Before Rules
  - Compiler & CPU Reordering
  - Sequential Consistency for Data-Race-Free Programs
  - Final-Field Semantics
  - Double-Checked Locking
  - JMM Causality & Data-Race Outcomes
- volatile
  - Visibility & Release/Acquire Ordering
  - Why volatile Does Not Make ++ Atomic
  - Flags, Publication & Single-Writer State
  - VarHandle Memory Modes

#### C3.5. Intrinsic Monitors

- Synchronization
  - synchronized
  - Object Monitor & Mutual Exclusion
  - Instance vs Class Lock
  - Monitor Reentrancy
  - wait(), notify() & notifyAll()
  - Guarded Blocks & Spurious Wakeups

#### C3.6. Explicit Locks & AQS

- Locks
  - ReentrantLock
  - Condition
  - ReadWriteLock
  - StampedLock
  - Fair vs Non-Fair Locks
  - LockSupport park/unpark
  - AbstractQueuedSynchronizer

#### C3.7. Atomics & Lock-Free Programming

- Atomic Classes
  - Compare-And-Set (CAS)
  - AtomicReference & AtomicStampedReference
  - ABA Problem
  - LongAdder vs AtomicLong
  - Atomic Field Updaters
  - Blocking, Lock-Free & Wait-Free

#### C3.8. Coordination Utilities

- Concurrency Synchronizers
  - CountDownLatch
  - CyclicBarrier
  - Phaser
  - Semaphore
  - Exchanger

#### C3.9. Concurrent Collections

- Concurrent Collections
  - ConcurrentHashMap
  - compute, merge & putIfAbsent
  - CopyOnWriteArrayList
  - ConcurrentLinkedQueue / Deque
  - ConcurrentSkipListMap / Set
  - Weakly Consistent Iterators
  - Synchronized Wrappers vs Concurrent Types

#### C3.10. Producer–Consumer & Backpressure

- Producer-Consumer
  - BlockingQueue
  - ArrayBlockingQueue vs LinkedBlockingQueue
  - offer/put & poll/take
  - Poison Pill & Shutdown
  - Bounded Queues & Backpressure

#### C3.11. Executors & Thread Pools

- Thread Pools
  - CPU-Bound vs I/O-Bound Sizing
  - Bulkheads & Pool Isolation
  - ThreadFactory, Naming & Context
  - Pool Saturation Metrics
  - Thread-Pool Starvation Deadlock
- Executors
  - ThreadPoolExecutor
  - Work Queues: Direct, Bounded & Unbounded
  - Rejection Policies & CallerRuns
  - ScheduledExecutorService
  - Graceful Executor Shutdown

#### C3.12. Future & CompletableFuture

- Future
  - Callable & FutureTask
  - get(), Timeout & Exception Wrapping
  - Cancellation & Interruption
  - ExecutorCompletionService
- CompletableFuture
  - thenApply vs thenCompose
  - thenCombine, allOf & anyOf
  - handle, exceptionally & whenComplete
  - orTimeout & completeOnTimeout
  - Common Pool vs Explicit Executor
  - ThreadLocal / Trace Context Propagation
  - Cancellation Does Not Automatically Stop Work

#### C3.13. Fork/Join & Data Parallelism

- ForkJoinPool
  - Work Stealing
  - RecursiveTask & RecursiveAction
  - ForkJoin Common Pool
  - Parallel Streams
  - ManagedBlocker & Blocking Hazards

#### C3.14. Liveness & Failure Analysis

- Deadlocks
  - Four Coffman Conditions
  - Lock Ordering & Prevention
  - Thread Dumps & Deadlock Detection
  - Dining Philosophers
  - Timed Acquisition & Recovery
- Starvation
  - Livelock
  - Priority Inversion
  - Fairness vs Throughput

#### C3.15. Virtual Threads

- Virtual Threads
  - Mounting, Unmounting & Carrier Threads
  - One Virtual Thread per Task — Do Not Pool
  - Blocking I/O with Synchronous Code
  - Semaphore for Resource Concurrency Limits
  - Why Virtual Threads Do Not Speed CPU Work
  - ThreadLocal Cost & Context
  - Pinning: JDK 21–23 vs JDK 24+
  - JFR & Thread-Dump Observability

#### C3.16. Structured Concurrency & Scoped Values

- Structured Concurrency (Preview)
  - StructuredTaskScope
  - Parent–Child Task Trees
  - Failure, Cancellation & Join Policies
  - Joiners & Fan-Out/Fan-In
  - JDK 26 Preview Status & API Evolution
  - Structured Thread Dumps
- Scoped Values
  - ScopedValue vs ThreadLocal
  - Inheritance into Structured Subtasks
  - Immutable Request Context

#### C3.17. Concurrency Testing

- Testing Concurrent Code
  - Deterministic Tests with Latches & Barriers
  - Why Tests Must Not Coordinate with sleep()
  - JCStress & JMM Litmus Tests
  - Lincheck for Concurrent Data Structures
  - Stress Loops, Timeouts & Failure Capture

#### C4.1. Network Foundations & Models

- Computer Networking Fundamentals
  - Why Networks Exist
  - LAN, WAN, PAN & Internet
  - Client–Server vs Peer-to-Peer
  - Bandwidth, Throughput, Latency & Jitter
- TCP/IP Concepts
  - OSI Seven-Layer Model
  - TCP/IP Model
  - OSI vs TCP/IP
  - Encapsulation: Data, Segment, Packet & Frame

#### C4.2. Devices, Media & Wireless

- Network Devices
  - Network Interface Card & MAC Address
  - Hub vs Switch vs Router
  - Modem, Gateway & Wireless Access Point
  - Physical Layer & Signaling
  - Copper, Fiber & Radio Media
  - Simplex, Half-Duplex & Full-Duplex
- Wireless Networks
  - Wi-Fi & IEEE 802.11
  - Bluetooth & Short-Range Networking
  - Channels, Interference & Roaming

#### C4.3. Ethernet & Data Link Layer

- Ethernet & Data Link Layer
  - Ethernet Frame & MTU
  - MAC Addressing & Broadcast Domains
  - Layer-2 Switching & MAC Tables
  - VLANs & 802.1Q Tags
  - Framing
  - CRC & Error Detection
  - Link-Layer Flow Control & ARQ

#### C4.4. IP Addressing & Subnetting

- Internet Protocol & Addressing
  - IPv4 Address Structure
  - IPv4 Datagram Header
  - CIDR & Subnet Masks
  - Network, Broadcast & Host Ranges
  - VLSM & Supernetting
  - Private, Public, Loopback & Link-Local IPs
  - IPv4 vs IPv6
  - IPv6 Addressing & Neighbor Discovery

#### C4.5. Routing, NAT & Network Control

- Routing & Network Boundaries
  - Default Gateway & Routing Table
  - Static vs Dynamic Routing
  - Distance-Vector vs Link-State Routing
  - OSPF & BGP Awareness
  - NAT, PAT & Port Exhaustion
  - ARP vs IPv6 NDP
  - DHCP Lease Lifecycle
  - ICMP, Errors & Reachability

#### C4.6. Transport Layer & Sockets

- Transport Layer
  - Ports, Sockets & the Five-Tuple
  - TCP vs UDP
  - UDP Datagrams, Loss & Ordering
  - bind, listen, accept & connect
  - Byte Streams vs Message Boundaries
  - SCTP Awareness
  - QUIC Transport Overview

#### C4.7. TCP Reliability & Performance

- Transmission Control Protocol
  - TCP Three-Way Handshake
  - FIN, RST & Connection Termination
  - Sequence Numbers, ACKs & Retransmission
  - Receive Window & Flow Control
  - Slow Start & Congestion Control
  - TIME_WAIT & Ephemeral-Port Exhaustion
  - SYN Queue, Accept Queue & Backlog
  - Nagle, Delayed ACK & TCP_NODELAY
  - MTU, MSS & Path MTU Discovery

#### C4.8. DNS & Service Discovery

- Domain Name System
  - Root, TLD & Authoritative Servers
  - Recursive vs Iterative Resolution
  - A, AAAA, CNAME, MX, TXT, NS & SRV
  - Caching, TTL & Negative Answers
  - UDP, TCP, DoT, DoH & DoQ
  - DNSSEC & Cache-Poisoning Defense
  - SVCB & HTTPS Records
  - Service Discovery & Split-Horizon DNS
  - DNS Failure, Stale Cache & Failover

#### C4.9. TLS & HTTPS

- Transport Layer Security
  - HTTPS
  - TLS 1.3 Handshake
  - Certificates, PKI & Chain Validation
  - SNI & ALPN
  - Forward Secrecy & AEAD
  - Session Resumption & Replay-Safe 0-RTT
  - Mutual TLS
  - TLS Termination & Re-Encryption
  - Certificate Rotation, Revocation & OCSP Stapling

#### C4.10. HTTP Semantics

- HTTP
  - Request & Response Message Structure
  - HTTP Methods
  - Safe, Idempotent & Cacheable Methods
  - HTTP Headers
  - HTTP Status Codes
  - URI, URL, Authority & Origin
  - Media Types, MIME & Content-Type
  - Content Negotiation
  - Retries, Idempotency Keys & Duplicate Effects

#### C4.11. HTTP Connections, Caching & Delivery

- Connection Reuse & Keep-Alive
  - Connection Pooling
  - HTTP/1.1 Pipelining & Head-of-Line Blocking
  - Content-Length, Chunked Transfer & Trailers
  - Streaming & Range Requests
- HTTP Caching
  - Cache-Control Directives
  - ETag, Last-Modified & Conditional Requests
  - Public, Private, no-cache & no-store
  - Vary & Cache-Key Correctness
  - gzip, Brotli & Compression Trade-Offs

#### C4.12. HTTP/2, HTTP/3 & QUIC

- HTTP/2
  - Binary Frames & Streams
  - Multiplexing & TCP Head-of-Line Blocking
  - HPACK Header Compression
  - Stream & Connection Flow Control
  - Priorities & Why Server Push Declined
- HTTP/3
  - QUIC Streams & Loss Isolation
  - QPACK Header Compression
  - Connection IDs & Migration
  - Alt-Svc, HTTPS Records, ALPN & Fallback

#### C4.13. Cookies, Sessions & Browser Boundaries

- Cookies
  - Domain, Path, Expires & Max-Age
  - Secure, HttpOnly & SameSite
  - Cookie Scope, __Host- & __Secure- Prefixes
- Sessions
  - Session IDs & Server-Side Stores
  - Sticky vs Shared Sessions
  - Session Rotation & Fixation Defense
- CORS
  - Same-Origin Policy
  - Simple Requests & Preflight
  - Credentials, Origins & Cache Variation

#### C4.14. Proxies, Load Balancers & CDN

- Reverse Proxies
  - Forward vs Reverse Proxy
  - Forwarded & X-Forwarded-* Headers
  - Buffering, Timeouts & Request Limits
  - API Gateway
  - Gateway Authentication, Rate Limits & Routing
- Load Balancers
  - Layer 4 vs Layer 7 Load Balancing
  - Round Robin, Least Connections & Hashing
  - Health Checks, Readiness & Connection Draining
  - Session Affinity & Long-Lived Connections
- Content Delivery Networks
  - Edge Caching & Origin Shield
  - Invalidation, Purge & Versioned Assets
  - Anycast & Geo-Routing

#### C4.15. API & Realtime Protocols

- REST
  - Resources, Representations & Uniform Interface
  - Pagination, Errors & Versioning
  - JSON
  - RPC vs REST
  - OpenAPI & Swagger Contracts
  - Problem Details Error Responses
  - GraphQL over HTTP
- gRPC
  - Protocol Buffers & Schema Evolution
  - Unary, Client, Server & Bidirectional Streaming
  - Deadlines, Cancellation & Status Codes
- Realtime Web Protocols
  - WebSocket Handshake, Frames & Heartbeats
  - Server-Sent Events
  - Long Polling
  - Webhooks, Signatures & Retries
  - WebTransport

#### C4.16. Network Security Fundamentals

- Network Security Fundamentals
  - Authentication vs Authorization
  - Encryption in Transit
  - Firewalls & Stateful Filtering
  - Segmentation, DMZ & Zero Trust
  - VPN, Tunnels & IPsec
  - IDS & IPS
  - DDoS, SYN Floods & Rate Limiting
  - MAC Filtering Limitations

#### C4.17. Cloud & Container Networking

- Cloud Networking
  - VPCs & Public/Private Subnets
  - Internet Gateway vs NAT Gateway
  - Security Groups vs Network ACLs
  - Cloud DNS & Service Discovery
  - Container Ports, Bridges & Overlay Networks
  - Kubernetes Pod, Service & Ingress Networking
  - Service Mesh & Sidecar Proxies

#### C4.18. Performance & Troubleshooting

- Network Troubleshooting
  - What Happens When You Enter a URL?
  - ping, ICMP & traceroute
  - dig, nslookup & DNS Diagnosis
  - curl & openssl s_client
  - ss, netstat & lsof
  - tcpdump & Wireshark
  - Layered Connectivity Diagnosis
- Network Performance
  - RTT & End-to-End Latency Budgets
  - Packet Loss, Retransmission & Tail Latency
  - Timeouts, Retries, Backoff & Jitter
  - Bandwidth–Delay Product
  - QoS, Token Bucket & Leaky Bucket
  - DNS, Connect, TLS, TTFB & Download Timing

#### C4.19. Java Networking APIs

- Java Networking APIs
  - URI, URL & InetAddress
  - Java 11+ HttpClient
  - Connect, Request & Read Timeouts
  - sendAsync & CompletableFuture
  - Connection Reuse, HTTP/2 & Pooling
  - RestClient, WebClient & HTTP Interfaces
  - ServerSocket, Channels & Selectors
  - Netty Event Loop & Channels

#### C5.1. IoC & the Container

- IoC
  - Hollywood Principle
  - IoC vs Dependency Injection
  - IoC vs Service Locator
  - XML, Annotations & Java Config Metadata

#### C5.2. ApplicationContext

- ApplicationContext
  - BeanFactory vs ApplicationContext
  - refresh(), start & close
  - WebApplicationContext
  - getBean() as a Service Locator
  - ApplicationContextAware

#### C5.3. Dependency Injection

- Dependency Injection
  - Constructor Injection
  - Setter Injection
  - Field Injection
  - @Autowired, @Qualifier & @Primary
  - @Inject vs @Resource
  - ObjectProvider & Delayed Lookup
  - Optional Dependencies

#### C5.4. Beans, Names & Scopes

- Beans
  - @Component, @Service, @Repository, @Controller
  - Bean Names & Aliases
  - Singleton Scope & Thread Safety
  - Prototype Scope
  - Request, Session & Application Scopes
  - FactoryBean
  - @Lazy Initialization

#### C5.5. Bean Lifecycle

- Bean Lifecycle
  - Instantiation & Population
  - @PostConstruct & @PreDestroy
  - InitializingBean & DisposableBean
  - init-method & destroy-method
  - BeanPostProcessor in the Lifecycle
  - Prototype Destroy Ownership
  - SmartLifecycle & Phased Start

#### C5.6. Component Scanning

- Component Scanning
  - Base Packages & Default-Package Trap
  - includeFilters & excludeFilters
  - Stereotype Semantics
  - spring.components Index

#### C5.7. Java Configuration

- Configuration
  - @Bean Factory Methods
  - Full @Configuration vs Lite @Bean
  - @Import & @ImportResource
  - @Conditional Bean Registration
  - XML Configuration (Legacy)

#### C5.8. Profiles & Environment

- Profiles
  - Active & Default Profiles
  - Environment Abstraction
  - @Value & @PropertySource
  - SpEL in Injection Points

#### C5.9. Wiring Conflicts & Cycles

- Wiring Conflicts & Circular Dependencies
  - NoUniqueBeanDefinitionException
  - Circular Dependencies
  - allow-circular-references (Boot 2.6+)
  - @Lookup Method Injection
  - @DependsOn

#### C5.10. Events, Resources & i18n

- Events, Resources & MessageSource
  - ApplicationEvent & ApplicationPublisher
  - @EventListener & Transactional Events
  - Resource & ResourceLoader
  - MessageSource & i18n

#### C5.11. Aspect-Oriented Programming

- AOP
  - Join Points & Pointcuts
  - Before, After, AfterReturning, AfterThrowing
  - @Around & ProceedingJoinPoint
  - Aspect @Order
  - Spring AOP vs AspectJ Weaving
  - @Transactional as AOP

#### C5.12. Spring Proxies

- Spring Proxies
  - JDK Dynamic Proxy vs CGLIB
  - Self-Invocation Bypass
  - AopContext.exposeProxy
  - Scoped Proxies
  - proxy-target-class
  - final Classes, Methods & Visibility

#### C5.13. Container Internals

- BeanFactory Internals
  - BeanDefinition
  - BeanFactoryPostProcessor
  - InstantiationAwareBeanPostProcessor
  - ConfigurationClassPostProcessor

#### C5.14. Testing Spring Core

- Testing Spring Core
  - Plain Unit Tests via Constructor DI
  - @ContextConfiguration
  - @DirtiesContext
  - @MockitoBean vs @MockBean

#### C6.1. Boot Foundations & Project Structure

- Spring Boot Foundations & Project Structure
  - Spring Framework vs Spring Boot
  - Spring Initializr
  - Package by Layer vs Package by Feature
  - Maven & Gradle Boot Plugins
  - Starter Dependencies
  - BOM & Dependency Management
  - Executable & Layered JARs
  - DevTools & Restart Classloader

#### C6.2. SpringApplication & Startup

- SpringApplication & Startup Lifecycle
  - @SpringBootApplication Composition
  - SpringApplication.run()
  - Servlet, Reactive & Non-Web Application Types
  - Startup Events & Listeners
  - CommandLineRunner & ApplicationRunner
  - Application Exit Codes
  - FailureAnalyzers & Startup Diagnostics

#### C6.3. Auto-configuration & Starters

- Auto-configuration
  - @EnableAutoConfiguration
  - AutoConfiguration.imports
  - @ConditionalOn* Annotations
  - Back-off & User Overrides
  - Auto-configuration Ordering
  - Condition Evaluation Report
  - Excluding Auto-configuration
  - Custom Auto-configuration & Starters
  - Boot 4 Modular Auto-configuration

#### C6.4. Externalized Configuration

- Externalized Configuration & Properties
  - Property Source Precedence
  - Config Data API & Imports
  - application.properties vs YAML
  - Environment, CLI & SPRING_APPLICATION_JSON
  - Profiles, Groups & Activation
  - @ConfigurationProperties
  - @Value vs @ConfigurationProperties
  - Relaxed Binding
  - Duration, DataSize & Custom Conversion
  - Configuration Validation
  - configtree: & Mounted Secrets

#### C6.5. Embedded Web Runtime

- Embedded Web Server & Runtime
  - Embedded Tomcat
  - Jetty & Undertow Alternatives
  - Server Port, Context Path & Compression
  - HTTP/2, TLS & SSL Bundles
  - Servlet Thread-per-Request Model
  - Boot Virtual Thread Integration
  - Executable JAR vs Traditional WAR

#### C6.6. Spring MVC Request Lifecycle

- Request/Response Lifecycle
  - Servlet API & Container Bridge
  - DispatcherServlet Front Controller
  - HandlerMapping & HandlerAdapter
  - HandlerMethodArgumentResolver
  - Return Value Handlers
  - HttpMessageConverters
  - Content Negotiation
  - MVC Async: Callable, DeferredResult & Streaming
  - Spring MVC vs WebFlux

#### C6.7. REST Controllers & HTTP Semantics

- REST Controllers
  - @Controller vs @RestController
  - @RequestMapping & HTTP Method Mappings
  - Path, Query & Header Binding
  - @RequestBody, @ResponseStatus & ResponseEntity
  - HTTP Status & Method Semantics
  - MVC CORS Configuration
  - Multipart Uploads & Downloads
  - OpenAPI with springdoc

#### C6.8. DTOs, JSON & API Boundaries

- DTOs & API Boundaries
  - Request vs Response DTOs
  - Java Records as DTOs
  - Why APIs Must Not Expose Entities
  - Jackson Serialization & Deserialization
  - Naming, Inclusion & Unknown Fields
  - ObjectMapper & JsonMapper Customization
  - Jackson 2 to Jackson 3 Migration
  - Manual Mapping vs MapStruct

#### C6.9. Validation & Data Binding

- Validation & Data Binding
  - Jakarta Bean Validation
  - @Valid vs @Validated
  - Built-in Constraint Annotations
  - Custom Constraints
  - Validation Groups
  - Method Validation
  - BindingResult & Field Errors
  - Converter, Formatter & DataBinder

#### C6.10. Exception Handling & Error Contracts

- Global Exception Handling
  - @ExceptionHandler
  - @ControllerAdvice & @RestControllerAdvice
  - HandlerExceptionResolver Chain
  - ProblemDetail & RFC 9457
  - Stable Validation Error Responses
  - Correlation IDs in Error Responses
  - Preventing Error Information Leaks

#### C6.11. Filters, Interceptors & Web Hooks

- Servlet Filters & MVC Interceptors
  - HandlerInterceptor
  - Filter vs Interceptor vs AOP
  - OncePerRequestFilter
  - FilterRegistrationBean & Ordering
  - Request/Response Wrappers & Body Caching
  - WebMvcConfigurer
  - Controller Advice Binding Hooks

#### C6.12. API Versioning & Evolution

- API Versioning & Evolution
  - URI, Header & Media-Type Versioning
  - Spring Framework 7 API Versioning
  - Breaking vs Additive Changes
  - Deprecation, Sunset & Migration Windows
  - Versioned Controllers & DTOs
  - Compatibility & Contract Tests

#### C6.13. Pagination, Sorting & Collection APIs

- Pagination, Sorting & Collection APIs
  - Pageable, Page & Sort
  - Page vs Slice
  - Offset Pagination
  - Keyset/Cursor Pagination
  - Bounds, Maximum Page Size & Stable Ordering
  - Metadata, Links & HATEOAS
  - Filtering & Search Parameters

#### C6.14. HTTP Clients & Service Integration

- HTTP Clients & Service Integration
  - RestClient
  - WebClient
  - HTTP Service Clients & @HttpExchange
  - RestTemplate (Legacy)
  - Base URL, Headers & Message Conversion
  - Connect, Read & Request Timeouts
  - Status Handling & Error Mapping
  - Client Observations & Context Propagation

#### C6.15. Task Execution & Scheduling

- Task Execution & Scheduling
  - @EnableAsync & @Async
  - @Async Proxy & Self-Invocation
  - @EnableScheduling & @Scheduled
  - Cron, fixedDelay & fixedRate
  - TaskExecutor Auto-configuration
  - TaskScheduler Auto-configuration
  - TaskDecorator & Context Propagation
  - Duplicate Scheduling in a Cluster

#### C6.16. Logging & Diagnostics

- Logging & Diagnostics
  - SLF4J, Logback & LoggingSystem
  - Levels, Groups & Package Configuration
  - Console Patterns, Files & Rotation
  - Built-in Structured Logging
  - MDC & Correlation IDs
  - Runtime Log-Level Changes
  - --debug & Startup Reports

#### C6.17. Actuator & Application Availability

- Actuator & Application Availability
  - Actuator Endpoint Model
  - Exposure, Access & Management Port
  - HealthContributor & HealthIndicator
  - Liveness, Readiness & Availability States
  - Health Groups
  - Micrometer Metrics Bridge
  - Securing Sensitive Endpoints
  - Custom Actuator Endpoints

#### C6.18. Spring Boot Testing

- Spring Boot Testing
  - @SpringBootTest
  - @WebMvcTest & MockMvc
  - @WebFluxTest & WebTestClient
  - @JsonTest & REST Client Tests
  - Test Slices & Restricted Contexts
  - @MockitoBean & @MockitoSpyBean
  - Context Caching & @DirtiesContext
  - Testcontainers & @ServiceConnection
  - @DynamicPropertySource
  - RANDOM_PORT & Real HTTP Tests

#### C6.19. AOT, Native Images & Runtime Efficiency

- AOT Processing & Native Images
  - Spring AOT Processing
  - GraalVM Native Images
  - RuntimeHints & Reflection Metadata
  - Generated Initializers & Proxies
  - Native Build & Test Lifecycle
  - Startup/Memory vs Build/Compatibility Trade-offs
  - CRaC Checkpoint/Restore

#### C6.20. Production Lifecycle & Packaging

- Production Lifecycle & Packaging
  - Graceful Shutdown & Timeout
  - spring.main.keep-alive & Daemon Threads
  - OCI Images with Cloud Native Buildpacks
  - Development-time Docker Compose Support
  - Layered Container Images
  - Remote Admin & Unsafe Endpoint Traps
  - Production Configuration Checklist

#### C7.1. Relational & PostgreSQL Foundations

- Relational Databases & PostgreSQL
  - What SQL Is
  - RDBMS vs Files & Spreadsheets
  - Relations, Tuples, Attributes & Domains
  - DDL, DML, DQL, DCL & TCL
  - Standard SQL vs PostgreSQL Dialect
  - PostgreSQL Client/Server Architecture
  - Installation, Cluster & Database Initialization
  - Getting Started & Demo Database
  - psql Essentials
  - pgAdmin 4 & Database GUI Tools
  - Database, Schema & search_path

#### C7.2. SQL Syntax, Types & Expressions

- SQL Syntax, Data Types & Expressions
  - Identifiers, Keywords & Quoting
  - Statements, Semicolons & Comments
  - Numeric, Boolean & Character Types
  - DATE, TIME, TIMESTAMP & INTERVAL
  - timestamp vs timestamptz
  - NULL & Three-Valued Logic
  - SQL Operators
  - Arithmetic & Comparison Operators
  - AND, OR & NOT
  - AND
  - OR
  - NOT
  - String Concatenation
  - CAST, :: & Type Conversion
  - Operator Precedence

#### C7.3. Databases, Schemas & Table DDL

- Database, Schema & Table DDL
  - CREATE & DROP DATABASE
  - CREATE DATABASE
  - DROP DATABASE
  - CREATE & DROP SCHEMA
  - CREATE TABLE
  - ALTER TABLE
  - ADD COLUMN
  - ALTER COLUMN
  - DROP COLUMN
  - DROP vs TRUNCATE vs DELETE
  - CREATE INDEX Syntax
  - Renaming Tables & Columns
  - Temporary & Unlogged Tables
  - CREATE TABLE AS & SELECT INTO
  - COPY for Bulk Import/Export
  - Transactional DDL in PostgreSQL

#### C7.4. Keys, Constraints & Generated Values

- Keys, Constraints & Generated Values
  - PRIMARY KEY
  - FOREIGN KEY & Referential Actions
  - UNIQUE & NULL Semantics
  - NOT NULL
  - CHECK Constraints
  - DEFAULT Values
  - Composite & Candidate Keys
  - Named Table & Column Constraints
  - DROP CONSTRAINT
  - IDENTITY Columns
  - AUTO INCREMENT vs IDENTITY
  - Sequences & nextval()
  - serial / bigserial (Legacy Convenience)
  - Deferrable Constraints
  - Exclusion Constraints

#### C7.5. CRUD & Data Modification

- SELECT, INSERT, UPDATE & DELETE
  - SELECT & Projection
  - SELECT * vs Explicit Columns
  - Fetching Rows
  - DISTINCT & DISTINCT ON
  - INSERT & Multi-row VALUES
  - NULL Values in INSERT/UPDATE
  - INSERT INTO … SELECT
  - UPDATE & UPDATE … FROM
  - DELETE & DELETE … USING
  - RETURNING
  - INSERT … ON CONFLICT (UPSERT)
  - MERGE
  - Data-Modifying CTEs
  - Safe UPDATE/DELETE Practices

#### C7.6. Filtering, Ordering & Conditional Logic

- Filtering, Ordering & Conditional Logic
  - WHERE
  - LIKE, ILIKE & Wildcards
  - SQL Wildcards
  - IN, NOT IN & NULL Trap
  - BETWEEN & Range Boundaries
  - IS NULL, IS DISTINCT FROM
  - EXISTS & NOT EXISTS
  - ANY, ALL & Array Comparisons
  - ANY / SOME
  - ALL
  - CASE Expressions
  - COALESCE & NULLIF
  - ORDER BY & NULLS FIRST/LAST
  - SELECT TOP vs LIMIT & FETCH
  - LIMIT, OFFSET & FETCH
  - Column & Table Aliases

#### C7.7. Functions, Aggregation & Grouping

- Functions, Aggregation & Grouping
  - COUNT, SUM & AVG
  - COUNT()
  - SUM()
  - AVG()
  - MIN & MAX
  - MIN()
  - MAX()
  - GROUP BY
  - HAVING vs WHERE
  - Aggregate NULL Semantics
  - FILTER on Aggregates
  - String Functions
  - Numeric Functions
  - Date/Time Functions & date_trunc
  - Regular Expressions
  - GROUPING SETS, ROLLUP & CUBE

#### C7.8. Joins & Set Operations

- Joins & Set Operations
  - INNER JOIN
  - LEFT OUTER JOIN
  - RIGHT & FULL OUTER JOIN
  - RIGHT JOIN
  - FULL JOIN
  - CROSS JOIN
  - Self Join
  - ON vs WHERE in Outer Joins
  - Join Cardinality & Duplicate Rows
  - LATERAL Joins
  - UNION vs UNION ALL
  - UNION ALL
  - INTERSECT & EXCEPT
  - Set Operation Type Compatibility

#### C7.9. Subqueries & CTEs

- Subqueries
  - Scalar Subqueries
  - Multi-row Subqueries
  - Correlated Subqueries
  - EXISTS as Semi/Anti Join
  - Subquery vs Join
- Common Table Expressions
  - WITH Queries
  - WITH RECURSIVE
  - Recursive CTE Cycle Handling
  - CTE Inlining & MATERIALIZED

#### C7.10. Window Functions & Advanced Querying

- Window Functions
  - OVER, PARTITION BY & ORDER BY
  - ROW_NUMBER, RANK & DENSE_RANK
  - LAG & LEAD
  - FIRST_VALUE, LAST_VALUE & NTH_VALUE
  - Running & Moving Aggregates
  - ROWS, RANGE & GROUPS Frames
  - Named Windows
  - Top-N per Group
  - Gaps & Islands
  - Pivoting with FILTER/crosstab

#### C7.11. Data Modeling & Normalization

- Relational Schema Design
  - Entities, Relationships & ER Diagrams
  - Cardinality & Optionality
  - One-to-One, One-to-Many & Many-to-Many
  - Keys in the Relational Model
  - Superkeys & Candidate Keys
  - Natural vs Surrogate Keys
  - Functional Dependencies
- Normalization
  - First Normal Form
  - Second Normal Form
  - Third Normal Form
  - Boyce–Codd Normal Form
  - Insert, Update & Delete Anomalies
  - Denormalization & Trade-offs

#### C7.12. Transactions, ACID & Isolation

- Transactions
  - BEGIN, COMMIT & ROLLBACK
  - Autocommit
  - SAVEPOINT & Partial Rollback
  - Transaction Boundary Design
- ACID
  - Atomicity
  - Consistency
  - Isolation
  - Durability & WAL
- PostgreSQL Isolation Levels
  - Read Committed
  - Repeatable Read / Snapshot Isolation
  - Serializable Snapshot Isolation
  - Dirty, Nonrepeatable, Phantom & Serialization Anomalies
  - Retrying Serialization Failures

#### C7.13. MVCC, Locks & Deadlocks

- MVCC
  - Tuple Versions: xmin, xmax & Snapshots
  - Readers, Writers & Visibility
  - Dead Tuples & Table Bloat
  - Long Transactions & Snapshot Retention
- Locks
  - Table Lock Modes
  - Row Locks & SELECT FOR UPDATE
  - NOWAIT & SKIP LOCKED
  - Advisory Locks
  - pg_locks & Blocking Queries
- Deadlocks
  - Deadlock Detection & Victim Abort
  - Consistent Lock Ordering

#### C7.14. Indexes & Access Methods

- PostgreSQL Indexes
- B-Tree / B+ Tree Concepts
  - Selectivity & Cardinality
  - Unique Indexes
- Composite Indexes
  - Column Order & Leftmost Prefix
  - Covering Indexes & INCLUDE
  - Partial Indexes
  - Expression Indexes
  - GIN Indexes
  - GiST & SP-GiST Indexes
  - BRIN Indexes
  - Hash Indexes
  - Index Write, Storage & Vacuum Cost
  - CREATE INDEX CONCURRENTLY

#### C7.15. Query Planning & Performance

- Query Plans
- EXPLAIN & EXPLAIN ANALYZE
  - BUFFERS, WAL, SETTINGS & Timing
  - Sequential, Index & Bitmap Scans
  - Nested Loop, Hash & Merge Joins
  - Sort, Aggregate & Materialize Nodes
  - Planner Costs, Rows & Width
  - Statistics & ANALYZE
  - Extended Statistics
- Query Optimization
  - Sargability
  - Query Rewriting & Predicate Placement
  - work_mem, Sort/Hash Spill
  - pg_stat_statements

#### C7.16. PostgreSQL Types & Document Features

- PostgreSQL Advanced Types
  - UUID
  - ENUM & DOMAIN
  - Arrays
  - Range & Multirange Types
  - Network Address Types
  - Geometric Types
  - JSON vs JSONB
  - JSONB Operators & SQL/JSON
  - JSONB Indexing with GIN
  - Full-Text Search: tsvector & tsquery
  - Generated Columns

#### C7.17. Views, Functions, Procedures & Triggers

- Views & Database Programmability
  - Views
  - Updatable Views & CHECK OPTION
  - Materialized Views & REFRESH
  - SQL Functions
  - PL/pgSQL
  - Functions vs Procedures
  - Stored Procedures & CALL
  - Routine Parameters IN/OUT
  - Row & Statement Triggers
  - BEFORE, AFTER & INSTEAD OF
  - Trigger Trade-offs & Hidden Side Effects

#### C7.18. Connectivity, Security & Data Safety

- Connections & Pooling
  - PostgreSQL Wire Protocol Overview
  - max_connections & Backend Cost
  - HikariCP vs PgBouncer
  - Session vs Transaction Pooling
  - SQL Injection Defense
  - SQL Parameters
  - Prepared Statements & Parameters
  - Data Encryption
  - pgcrypto
  - PostgreSQL Hosting & Managed Services
  - Roles, GRANT, REVOKE & Least Privilege
  - Row-Level Security
  - TLS Connections & Certificate Verification
  - Logical vs Physical Backup & Restore
  - pg_dump, pg_restore & pg_basebackup
  - WAL Archiving & Point-in-Time Recovery
  - Versioned Schema Migrations

#### C7.19. Partitioning & Large Tables

- Table Partitioning
  - Declarative Partitioning
  - Range, List & Hash Partitioning
  - Choosing a Partition Key
  - Partition Pruning
  - Tuple Routing & Default Partitions
  - Partitioned Indexes & Constraints
  - Attach, Detach & Retention
  - Partitioning Trade-offs

#### C7.20. Replication, Vacuum & Operations

- PostgreSQL Replication
  - Physical Streaming Replication
  - Write-Ahead Log (WAL)
  - Synchronous vs Asynchronous Replication
  - Replication Slots & WAL Retention
  - Logical Replication & Publications
  - Read Replicas & Replication Lag
  - VACUUM & Dead Tuple Reclamation
  - Autovacuum Tuning
  - Transaction ID Freeze & Wraparound
  - REINDEX, CLUSTER & pg_repack
  - System Catalogs & Statistics Views
  - Monitoring, Capacity & Slow-Query Workflow

#### C8.1. ORM Foundations & Technology Boundaries

- JPA, Hibernate & Spring Data JPA
  - JPA as a Specification
  - Hibernate as JPA Provider
  - Spring Data JPA Module
  - ORM vs JDBC / jOOQ / MyBatis
  - EntityManager vs Hibernate Session
  - JPQL vs HQL
  - javax.persistence vs jakarta.persistence

#### C8.2. Entities, Identity & Mapping Basics

- Entities
  - Entity Requirements & No-arg Constructor
  - @Table, @Column & Naming Strategies
  - Field Access vs Property Access
  - Constructors, Setters & Domain Methods
  - equals/hashCode for Entities
  - toString(), Lombok & Lazy Loading Traps
  - Mutable Entities vs Immutable Domain Models

#### C8.3. Identifiers, Generated Values & Value Types

- Identifiers & Generated Values
  - @Id & @GeneratedValue
  - IDENTITY vs SEQUENCE Strategies
  - Sequence allocationSize & Insert Throughput
  - UUID Identifiers
  - Composite IDs with @EmbeddedId / @IdClass
  - @Embeddable Value Objects
  - Enum Mapping: ORDINAL vs STRING
  - AttributeConverter

#### C8.4. Relationships, Ownership & Cascades

- Relationships
  - @ManyToOne
  - @OneToMany
  - @OneToOne
  - @ManyToMany and Join Tables
  - Owning Side, mappedBy & Foreign Keys
  - Cascade Types
  - orphanRemoval
  - Bidirectional Association Synchronization

#### C8.5. Persistence Context, Lifecycle & Flush

- Persistence Context
- Entity Lifecycle
  - First-level Cache / Identity Map
  - Transient, Managed, Detached & Removed
  - persist(), merge(), remove()
  - Flush Modes and Query-time Flush
  - clear(), detach() & refresh()
  - Open Session in View

#### C8.6. Dirty Checking, Write-behind & SQL Generation

- Dirty Checking
  - Loaded State Snapshots
  - Transactional Write-behind
  - save() vs Managed Entity Changes
  - @DynamicUpdate Trade-offs
  - Bulk Updates Bypass Persistence Context
  - JDBC Batching with Hibernate

#### C8.7. Fetching, Lazy Loading & N+1 Control

- Lazy/Eager Loading
- N+1 Problem
- Fetch Joins
  - Eager Loading
  - Hibernate Proxies and Persistent Collections
  - LazyInitializationException
  - @EntityGraph
  - Batch Fetching and default_batch_fetch_size
  - SUBSELECT Fetching
  - MultipleBagFetchException

#### C8.8. Repositories, Queries & Projections

- Repositories
  - CrudRepository vs JpaRepository
  - Derived Query Methods
  - @Query with JPQL and Native SQL
  - Named and Positional Query Parameters
  - JpaSpecificationExecutor / Criteria API
  - Query by Example
  - Interface, DTO and Record Projections
  - Page, Slice, Pageable and Sort

#### C8.9. Transactions, Locking & Concurrency

- JPA Transactions
- Optimistic/Pessimistic Locking
  - @Transactional Boundaries
  - Propagation and Isolation with JPA
  - readOnly Transactions
  - Rollback Rules and Checked Exceptions
  - @Version Column
  - OptimisticLockException and Retry Design
  - Pessimistic Locking

#### C8.10. Schema, Validation & Migrations

- Schema Management with JPA and Migrations
  - hibernate.hbm2ddl.auto / ddl-auto
  - Flyway / Liquibase with JPA
  - @Column nullable, unique and length
  - Bean Validation on Entities
  - Unique Constraints and Index Metadata
  - CreatedDate, LastModifiedDate and Auditing
  - Soft Delete Patterns

#### C8.11. Caching, Performance & Observability

- Hibernate Performance and Observability
  - Second-level Cache
  - Query Cache
  - Hibernate Statistics
  - SQL Logging, p6spy and datasource-proxy
  - Fetch Size and Streaming Results
  - Batch Inserts and Updates
  - Read-only Queries and Hints

#### C8.12. Inheritance, Polymorphism & Advanced Mapping

- Advanced Hibernate Mapping
  - Inheritance Mapping Strategies
  - @MappedSuperclass
  - SINGLE_TABLE Strategy
  - JOINED Strategy
  - TABLE_PER_CLASS Strategy
  - @SecondaryTable
  - @Filter, @Where and Tenant Filters

#### C8.13. Spring Data JPA Internals & Extension Points

- Spring Data JPA Internals
  - Repository Proxies
  - Query Lookup Strategy
  - Custom Repository Implementations
  - Domain Events from Aggregates
  - Repository Transaction Defaults
  - Entity Callbacks and Listeners

#### C8.14. Testing Persistence

- Testing JPA and Hibernate
  - @DataJpaTest
  - TestEntityManager
  - PostgreSQL Testcontainers
  - H2 Dialect Traps
  - Repository Query Tests
  - N+1 Regression Tests

#### C8.15. API Boundaries, DTOs & Production Patterns

- Avoiding ORM Abuse
  - DTO Boundaries and Entity Exposure
  - Aggregate Boundaries
  - Transaction Script vs Rich Domain
  - Jackson Serialization of Entities
  - OSIV Production Trade-off
  - When to Use Native SQL or JDBC

#### C8.16. Interview Scenarios & Troubleshooting

- JPA/Hibernate Troubleshooting
  - Debugging Generated SQL
  - detached entity passed to persist
  - TransientObjectException
  - StaleObjectStateException
  - Connection Leak Symptoms
  - Production Query Spike Investigation

#### C9.1. Authentication vs Authorization

- Authentication vs Authorization
  - Identification vs Authentication
  - Authorization After Authentication
  - Fail-Closed Defaults
  - Session vs Token Authentication Models
  - MFA & Step-up Authentication

#### C9.2. Sessions, Cookies & Browser Storage

- Sessions (Security)
  - Session Fixation
  - HttpOnly, Secure & SameSite Cookies
  - SameSite=Lax vs Strict
  - Why Tokens Must Not Live in localStorage
  - BFF Cookie Sessions for SPAs

#### C9.3. JWT Structure, Claims & Validation

- JWT
  - Header, Payload & Signature
  - iss, aud, exp, sub, nbf & iat
  - Signature Algorithms & alg:none
  - JWKS & Signing-Key Rotation
  - JWT vs Opaque Access Tokens
  - Validating JWT Claims on Every Request

#### C9.4. OAuth 2.0 Grants & Delegation

- OAuth 2.0 Concepts
  - Resource Owner, Client, Authorization Server & Resource Server
  - Scopes & Least-Privilege Delegation
  - Access Tokens
  - Authorization Code Flow with PKCE
  - Why Implicit Grant Is Deprecated
  - Why Resource Owner Password Grant Is Deprecated
  - Client Credentials for Service-to-Service
  - Device Authorization Grant

#### C9.5. OIDC Identity vs OAuth Authorization

- OpenID Connect Concepts
  - OAuth 2.0 Authorization vs OIDC Identity
  - ID Tokens vs Access Tokens
  - ID Token Claim Validation
  - nonce Against Replay
  - UserInfo Endpoint

#### C9.6. Token Management, Rotation & Revocation

- Token Management
  - Short-Lived Access Tokens
  - Refresh Token Rotation & Reuse Detection
  - Token Revocation
  - Bearer Header vs Cookie Transport
  - Audience, Sender-Constrained Tokens & mTLS

#### C9.7. Spring Security Filter Chain (Boot 3 / Security 6)

- Spring Security
  - SecurityFilterChain Beans
  - OncePerRequestFilter
  - SecurityContextHolder
  - Security Context Across Async & Reactive Threads
  - Multiple Filter Chains & Request Matchers
  - OAuth2 Resource Server JWT

#### C9.8. RBAC, ABAC & Method Security

- RBAC
  - Roles, Authorities & Scopes
  - @PreAuthorize & SpEL
  - Attribute-Based Access Control
  - Domain-Level Ownership Checks
  - Broken Access Control & IDOR
  - @EnableMethodSecurity

#### C9.9. XSS & Content-Security-Policy

- XSS
  - Reflected XSS
  - Stored XSS
  - DOM-based XSS
  - Context-Aware Escaping & Framework Sanitization
  - Content-Security-Policy

#### C9.10. CSRF Mechanics

- CSRF
  - CSRF on Cookie-Authenticated Apps
  - Why Bearer APIs Are CSRF-Immune
  - Anti-CSRF Tokens
  - SameSite as a CSRF Control
  - Disabling CSRF Only for Stateless APIs

#### C9.11. SQL Injection & Unsafe Persistence

- SQL Injection
  - Parameterized Queries
  - Second-Order SQL Injection
  - Unsafe Native Queries in Spring Data JPA
  - String Concatenation in ORM Queries

#### C9.12. CORS Misconfigurations

- CORS (Security)
  - CORS Is Browser Enforcement, Not a Firewall
  - Preflight OPTIONS Requests
  - Dynamic Origin Validation
  - Access-Control-Allow-Credentials
  - Wildcard Origin + Credentials Trap

#### C9.13. Password Hashing

- Password Hashing
  - Argon2id
  - Bcrypt Cost Factor ≥ 12
  - Unique Per-User Salts
  - Pepper vs Salt
  - Spring PasswordEncoder

#### C9.14. Secrets Management & Key Scanning

- Secrets Management
  - Runtime Ingest from Secrets Manager or Vault
  - No Secrets in Git, Images or Logs
  - CI/CD Scanning: GitGuardian & TruffleHog
  - Secret Rotation
  - Least-Privilege Credentials

#### C9.15. OWASP Architecture & Cryptographic Failures

- OWASP Basics
  - Broken Access Control (A01)
  - Cryptographic Failures (A02)
  - Defense in Depth: Gateway to Persistence
  - Security Response Headers
  - API Threat Modeling

#### C10.1. Redis Foundations & Why It Is Fast

- Redis Foundations
  - What Redis Is
  - In-Memory Storage
  - Single-Threaded Event Loop
  - RESP Protocol
  - Caching, Sessions & Real-Time Use Cases
  - Real-World Application Patterns

#### C10.2. Environment, Configuration & Clients

- Environment & Configuration
  - Install & Local Setup
  - redis.conf Essentials
  - Logical Databases (db 0…N)
  - Client Connection Model
  - Java / Lettuce / Jedis Clients
  - Connection Pooling

#### C10.3. Keys, Commands & Core Operations

- Keys & Commands
  - Key Naming Conventions
  - EXISTS, DEL, TYPE, SCAN
  - KEYS vs SCAN
  - INFO, MONITOR & Server Introspection

#### C10.4. Data Structures

- Redis Data Structures
  - Strings
  - Hashes
  - Lists
  - Sets
  - Sorted Sets
  - HyperLogLog
  - Bitmaps & Bitfields
  - Choosing the Right Structure

#### C10.5. Caching Patterns & Cache-Aside

- Cache-Aside
  - Cache Hit & Cache Miss
  - Read-Through & Write-Through
  - Write-Behind / Write-Back
  - When Not to Cache
  - Cache Stampede / Thundering Herd

#### C10.6. TTL & Expiration

- TTL
  - EXPIRE, PEXPIRE & TTL Commands
  - Volatile vs Persistent Keys
  - Passive vs Active Expiration
  - TTL Jitter to Avoid Synchronized Expiry

#### C10.7. Cache Invalidation

- Cache Invalidation
  - Invalidate-on-Write
  - Versioned / Namespaced Keys
  - Stale-While-Revalidate
  - Why Invalidation Is Hard

#### C10.8. Distributed Caching

- Distributed Caching
  - Local Cache vs Redis
  - Coherence Across Instances
  - Hot Keys & Skew
  - Maxmemory & Eviction Policies

#### C10.9. Sessions, Tokens & Feature State

- Sessions & Token Storage
  - Session Store Patterns
  - Storing Authentication Tokens
  - Feature Flags & Remote Config
  - Data Deduplication Keys

#### C10.10. Rate Limiting

- Rate Limiting with Redis
  - Fixed Window Counters
  - Sliding Window Patterns
  - Token Bucket / Leaky Bucket
  - Atomicity with INCR & Lua

#### C10.11. Distributed Locks & Inventory

- Distributed Locks
  - SET NX EX Lock Pattern
  - Redlock Trade-offs
  - Lock Safety, Fencing & TTL
  - Real-Time Inventory Reservation

#### C10.12. Pub/Sub, Queues & Real-Time Messaging

- Pub/Sub
  - PUBLISH / SUBSCRIBE
  - Pub/Sub Delivery Limits
  - Lists & Streams as Job Queues
  - Leaderboards with Sorted Sets
  - Redis Streams Overview

#### C10.13. Transactions, Pipelining & Scripting

- Transactions, Pipelining & Scripting
  - MULTI / EXEC & WATCH
  - Pipelining
  - Lua Scripting
  - Atomic Multi-Key Updates

#### C10.14. Persistence & Backup

- Redis Persistence
  - RDB Snapshots
  - AOF Append-Only File
  - RDB vs AOF Trade-offs
  - Backup & Restore

#### C10.15. Replication, Partitioning & Clustering

- Redis Replication
  - Primary/Replica & Lag
  - Partitioning Strategies
  - Redis Cluster Basics
  - Sentinel & Failover

#### C10.16. Security, Memory & Operations

- Security, Memory & Operations
  - Auth, Network Binding & ACLs
  - Benchmarks & Capacity Reality
  - Memory & Fragmentation
  - SLOWLOG & Latency Diagnosis
  - Production Checklist

#### C11.1. Kafka Foundations & Messaging Models

- Kafka Foundations
  - What Kafka Is
  - Distributed Commit Log
  - Kafka vs Traditional Messaging
  - Point-to-Point vs Pub/Sub
  - Analytics, Logs, Integration & Messaging Use Cases
  - Events as Key-Value Records with Timestamps

#### C11.2. Event-Driven Architecture

- Event-Driven Architecture
  - Events, Producers & Consumers
  - Event Brokers & Loose Coupling
  - Event Store & Replay
  - CQRS with Event Streams
  - Event Granularity & Best Practices

#### C11.3. Cluster Architecture & Brokers

- Cluster Architecture
  - Brokers & Clusters
  - Produce → Broker → Consume Workflow
  - KRaft vs ZooKeeper Metadata
  - Replication Factor & Leaders
  - In-Sync Replicas (ISR)

#### C11.4. Topics & Log Anatomy

- Topics
  - Topic Naming & Organization
  - Log Anatomy: Append-Only Segments
  - Time/Size Retention & Compaction
  - Create & Describe Topics
  - Log Compaction

#### C11.5. Partitions & Parallelism

- Partitions
  - Key-Based Partitioning
  - Leaders, Followers & Failover
  - Choosing Partition Count
  - Hot Partitions & Skew

#### C11.6. Producers

- Producers
  - Producer API & Records
  - acks=0 / 1 / all
  - Batch Size & linger.ms
  - Idempotent Producer
  - Producer Retries & Delivery Timeout
  - Key/Value Serialization

#### C11.7. Consumers

- Consumers
  - Consumer API & poll()
  - Subscribe vs Assign
  - Consumer Lag
  - Deserialization & Poison Messages
  - max.poll.interval & Session Timeout

#### C11.8. Consumer Groups & Rebalancing

- Consumer Groups
  - Group Load Balancing
  - One Consumer per Partition per Group
- Consumer Rebalancing
  - Eager vs Cooperative Rebalancing
  - Rebalance Storms & Sticky Assignment

#### C11.9. Offsets & Retention Semantics

- Offsets
  - Auto vs Manual Commit
  - commitSync vs commitAsync
  - earliest / latest / specific Offset
  - __consumer_offsets

#### C11.10. Ordering Guarantees

- Ordering Guarantees
  - Order Within a Partition
  - No Global Topic Order
  - Key Affinity for Related Events
  - max.in.flight.requests & Ordering

#### C11.11. Delivery Semantics

- At-Most/At-Least/Exactly-Once Concepts
  - At-Least-Once
  - Exactly-Once Concepts
  - Kafka Transactions / EOS
  - Effectively-Once via Idempotent Consumers

#### C11.12. Idempotency, Retries & Dead-Letter Queues

- Idempotent Consumers
  - Deduplication Keys & Outbox Markers
- Retries
  - Retry Topics & Backoff
- Dead-Letter Queues
  - DLQ Inspection & Replay

#### C11.13. Schemas, Serialization & Evolution

- Schema Evolution
  - Avro, JSON & Protobuf
  - Schema Registry
  - Backward / Forward Compatibility
  - Avoiding Breaking Schema Changes

#### C11.14. Kafka Internals & Storage

- Kafka Internals
  - Segments, Rolling & Indexes
  - OS Page Cache & Zero-Copy
  - Controller & Metadata
  - MirrorMaker / Cross-Cluster Replication

#### C11.15. Connect, Streams & Ecosystem

- Connect, Streams & Ecosystem
  - Kafka Connect Source & Sink
  - Kafka Streams Basics
  - kSQL / Flink SQL Overview
  - Kafka vs Flink / Pulsar Boundaries
  - Java Client Libraries

#### C11.16. Outbox, Saga & Production Operations

- Outbox Pattern
  - Transactional Outbox with DB
- Saga Pattern
  - Choreography vs Orchestration
  - Lag, Throughput & Alerting
  - TLS, SASL & ACLs
  - Production Checklist

#### C12.1. Reliability Foundations & Failure Modes

- Reliability Foundations
  - Availability, Latency & Correctness
  - Partial Failure in Distributed Systems
  - Blast Radius & Failure Domains
  - Fail-Fast vs Fail-Safe
  - Defense in Depth for Dependencies
  - Critical vs Non-Critical Dependencies

#### C12.2. Timeouts & Deadlines

- Timeouts
  - Connect vs Read/Write Timeouts
  - Deadline / Timeout Propagation
  - End-to-End Timeout Budgets
  - Hanging Calls & Thread/Connection Exhaustion
  - Choosing Timeout Defaults

#### C12.3. Retries & Backoff

- Retries
  - Retryable vs Non-Retryable Errors
  - Retry Amplification & Cascades
  - Retry Budgets
- Exponential Backoff
  - Full / Equal / Decorrelated Jitter
  - Max Attempts & Caps
  - Retry-After & Server Hints

#### C12.4. Idempotency

- Idempotency
  - Idempotency-Key Headers & Stores
  - Naturally Idempotent Operations
  - DB UNIQUE / Upsert Guards
  - Effectively-Once Side Effects
  - Idempotency Record TTL & Replay Windows

#### C12.5. Rate Limiting & Throttling

- Rate Limiting
  - Client-Side vs Server-Side Limits
  - Token Bucket & Leaky Bucket
  - Concurrency Limits
  - Load Shedding Under Overload
  - Per-Tenant Fairness

#### C12.6. Circuit Breakers

- Circuit Breakers
  - Closed, Open & Half-Open
  - Error Rate & Slow-Call Thresholds
  - Fallbacks When Open
  - Breakers vs Retries Interaction
  - Resilience4j / Spring Patterns

#### C12.7. Bulkheads & Isolation

- Bulkheads
  - Thread-Pool / Semaphore Isolation
  - Connection-Pool Isolation
  - Queue & Consumer Isolation
  - Noisy-Neighbor Containment
  - Cell / Shard Isolation

#### C12.8. Backpressure

- Backpressure
  - Bounded Queues & Rejection
  - Slow Consumer Propagation
  - Reactive / Async Backpressure Signals
  - Unbounded Buffer Bloat

#### C12.9. Graceful Degradation & Fallbacks

- Graceful Degradation
  - Disable Non-Critical Features
  - Stale Cache / Last-Known-Good
  - Safe Default Responses
  - Priority Lanes Under Stress
  - Honest UX During Degradation

#### C12.10. Health Checks & Safe Rollouts

- Health Checks
  - Liveness vs Readiness
  - Dependency Probes & Deep Checks
  - Health-Check Anti-Patterns
  - Graceful Shutdown & Drain
  - Rolling Deploy Safety

#### C12.11. Eventual Consistency & Compensation

- Eventual Consistency
  - Read-Your-Writes Expectations
  - Compensating Actions
  - Reconciliation Jobs
  - User-Visible Consistency Trade-offs
  - Inbox/Outbox for Reliable Side Effects

#### C12.12. Failure Recovery

- Failure Recovery
  - Restart vs Self-Heal
  - Poison Messages & Quarantine
  - Runbooks & Manual Intervention
  - Data Repair & Backfills
  - Incident → Postmortem → Prevention

#### C12.13. SLOs, Error Budgets & Reliability Signals

- SLOs & Error Budgets
  - SLI vs SLO vs SLA
  - Error Budgets & Release Policy
  - p50 / p95 / p99 for Reliability
  - Saturation & Golden Signals
  - Alert on User Symptoms

#### C12.14. Chaos, Overload & Production Playbooks

- Chaos, Overload & Playbooks
  - Chaos / Fault Injection
  - Game Days & Resilience Drills
  - Overload Control Playbook
  - Dependency Outage Playbook
  - Production Reliability Checklist

#### C13.1. Testing Strategy & the Pyramid

- Testing Strategy
  - Test Pyramid vs Ice-Cream Cone
  - What to Test vs What Not to Test
  - Risk-Based Test Selection
  - Fast Feedback Loops
  - Testing Trophy / Honeycomb Variants

#### C13.2. Unit Testing

- Unit Testing
  - Arrange–Act–Assert
  - Behavior vs Implementation Coupling
  - Pure Domain / Pure Function Tests
  - Parameterized & Property-Style Inputs
  - Unit-Test Anti-Patterns

#### C13.3. JUnit 5

- JUnit
  - Lifecycle: @BeforeEach / @AfterEach / Extensions
  - Assertions & Assumptions
  - @Nested & Display Names
  - Extension Model
  - JUnit 4 → 5 Migration Notes

#### C13.4. Mockito & Test Doubles

- Mockito
  - Stubs, Mocks, Fakes & Spies
  - verify() & Argument Captors
  - When Not to Mock
  - Strict Stubbing & Unnecessary Stubbing
  - BDDMockito Style

#### C13.5. Integration Testing

- Integration Testing
  - Narrow vs Broad Integration Tests
  - Real Collaborators vs Doubles
  - Test Data Setup & Cleanup
  - Hermetic / Deterministic Integration
  - Shared Fixtures & Pollution

#### C13.6. API & Web-Layer Testing

- API Testing
  - MockMvc
  - WebTestClient
  - REST Assured / HTTP Client Tests
  - Status, Payload, Headers & Errors
  - AuthN/AuthZ in API Tests

#### C13.7. Database Testing

- Database Testing
  - @DataJpaTest
  - @Transactional Rollback Semantics
  - Migration / Flyway Compatibility Checks
  - Asserting SQL Side Effects
  - H2 vs Real PostgreSQL Gaps

#### C13.8. Testcontainers

- Testcontainers
  - GenericContainer & Modules
  - PostgreSQL Container
  - Reuse, Ryuk & CI Resource Cost
  - Kafka / Redis Containers
  - Testcontainers Anti-Patterns

#### C13.9. Contract Testing

- Contract Testing
  - Consumer-Driven Contracts
  - Pact / Spring Cloud Contract
  - Schema Contracts (OpenAPI / AsyncAPI)
  - Breaking Change Detection

#### C13.10. Spring Boot Test Slices & Context

- Spring Boot Testing
  - @SpringBootTest
  - @WebMvcTest
  - @JsonTest
  - @MockBean / @SpyBean Pitfalls
  - ApplicationContext Caching & DirtiesContext

#### C13.11. Async, Messaging & Time

- Async & Messaging Tests
  - Awaitility for Async Assertions
  - Kafka Listener / Producer Tests
  - Clock / Time Abstraction
  - Flaky Test Diagnosis & Quarantine
  - Concurrency & Race Tests

#### C13.12. Load, Performance & Resilience Tests

- Load Testing
  - Latency SLOs in Load Tests
  - k6 / JMeter / Gatling Overview
  - Soak, Spike & Stress Profiles
  - Performance Regression Gates
  - Fault Injection in Test Envs

#### C13.13. Coverage, Mutation & Quality Gates

- Coverage & Quality Gates
  - Line vs Branch Coverage Limits
  - Mutation Testing (PIT)
  - Static Analysis Alongside Tests
  - Meaningful Assertions over Coverage Chasing

#### C13.14. CI Strategy & Production Confidence

- CI Testing Strategy
  - Parallelization & Sharding
  - PR Checks vs Nightly Suites
  - Test Ownership & Failure Triage
  - Shift-Left and Shift-Right Testing
  - Production-Confidence Checklist

#### C14.1. DevOps Foundations & Lifecycle

- DevOps Foundations
  - What Is DevOps
  - DevOps Lifecycle
  - DevOps vs Traditional SDLC
  - Culture, Collaboration & Feedback Loops
  - Automation, Workflow & Pipelines
  - Evolution & Future Trends

#### C14.2. Version Control for Delivery

- Version Control for Delivery
  - Version Control Systems
  - Git Merge Strategies
  - Trunk-Based vs GitFlow for CI
  - Choosing a VCS

#### C14.3. Linux Fundamentals for Containers

- Linux Fundamentals
  - Processes
  - Files & Permissions
  - Environment Variables
  - Signals & Graceful Stop (SIGTERM)
  - Shell Debugging on Hosts & Containers

#### C14.4. Containers & Docker Architecture

- Containers
  - What Is Docker
  - Containers vs Virtual Machines
  - Docker Architecture (Client, Daemon, Images)
  - Essential Docker Commands
  - How Docker Fits DevOps & CI/CD
  - Common Docker Challenges in Teams

#### C14.5. Docker Images & Registries

- Docker Images
  - Image Layers & Build Cache
  - Docker Hub & Public Repositories
  - Private Registries (ECR / Harbor)
  - Push, Pull & Semantic Tagging
  - Digests vs :latest in Production

#### C14.6. Dockerfile & Image Optimization

- Dockerfile
  - Dockerfile Syntax
  - .dockerignore & Build Context
  - Image Size & Layer Best Practices
  - Non-Root USER & Secure Defaults
- Multi-stage Builds
  - Builder Stage vs Runtime Stage
  - Jib & Buildpacks Alternatives

#### C14.7. Docker Compose & Local Stacks

- Docker Compose
  - Services, Networks & Volumes in YAML
  - depends_on & Healthchecks
  - Scaling Services Locally
  - Why Compose Is Not Production Orchestration

#### C14.8. Docker Networking

- Docker Networking
  - Bridge Network (Default & User-Defined)
  - Host, Overlay & Macvlan Modes
  - Port Publishing & EXPOSE
  - Service DNS Between Containers

#### C14.9. Volumes & Container Storage

- Volumes
  - Named Volumes vs Bind Mounts
  - Sharing Data Between Containers
  - Storage Drivers & Data Persistence
  - Backup & Volume Lifecycle

#### C14.10. CI/CD Concepts & Deployment Automation

- CI/CD Concepts
  - Continuous Integration vs Delivery vs Deployment
  - Deployment Automation
  - Immutable Artifacts (Image by Digest)
  - Build → Test → Scan → Push → Deploy
  - Docker as the Build & Test Environment

#### C14.11. Pipeline Tools: GitHub Actions & Jenkins

- GitHub Actions / Jenkins
  - GitHub Actions Workflow Basics
  - Jenkins Pipeline Overview
  - CI Secrets & OIDC to Cloud
  - Dependency & Layer Caching in CI

#### C14.12. Kubernetes Orchestration

- Kubernetes
  - Why Container Orchestration
  - Pods, Deployments, Services & Ingress
  - Docker vs Kubernetes Responsibilities
  - Rolling Updates, Probes & Self-Healing
  - DevOps Best Practices on Kubernetes
  - Docker Swarm (Legacy Contrast)

#### C14.13. AWS ECS & Managed Containers

- AWS ECS for Container Workloads
  - Tasks, Services & Task Definitions
  - ECS/Fargate vs EKS Trade-offs
  - Build → ECR → ECS Deploy Flow

#### C14.14. Infrastructure as Code

- Infrastructure as Code
  - Why IaC Beats Click-Ops
  - Introduction to Terraform
  - AWS CloudFormation
  - State, Drift & Reviewable Infra Changes

#### C14.15. Monitoring & Logging for Delivery

- Monitoring & Logging for Delivery
  - Prometheus & Grafana with Helm
  - Monitoring & Logging Services Overview
  - Golden Signals in Deploy Pipelines
  - Incident Comms (ChatOps Patterns)

#### C14.16. DevSecOps & Container Security

- DevSecOps & Container Security
  - What Is DevSecOps
  - Image CVE Scanning & SBOM
  - Docker Security Best Practices
  - Kubernetes Security Basics
  - Secrets in Images, Compose & Pipelines

#### C15.1. Cloud Foundations & Global Infrastructure

- Cloud Foundations & AWS
  - What Is Cloud Computing
  - What Is AWS
  - Regions, Availability Zones & Edge Locations
  - Shared Responsibility Model
  - Management Console & AWS CLI
  - Free Tier & Account Setup Basics

#### C15.2. IAM & Account Security

- IAM
  - Users, Groups & Roles
  - Policies & Least Privilege
  - Instance Profiles & Roles for EC2
  - MFA for Root & Privileged Users
  - Federation & SAML Overview
  - Explicit Deny & Guardrail Policies

#### C15.3. Secrets Manager & Credential Hygiene

- Secrets Manager
  - Runtime Secret Injection
  - Secret Rotation
  - Secrets Manager vs Parameter Store
  - No Secrets in AMIs, Images or User Data

#### C15.4. EC2 Compute

- EC2
  - Launching & Managing Instances
  - Instance Types & Families
  - On-Demand, Reserved & Spot Pricing
  - AMIs & Golden Images
  - Connecting to Linux/Windows Instances
  - User Data & IMDSv2
  - Elastic Beanstalk Overview

#### C15.5. Lambda & Serverless

- Lambda
  - Event Sources (S3, API Gateway, SQS)
  - Creating & Deploying Functions
  - Timeouts, Memory & Cold Starts
  - Execution Roles & Least Privilege
  - API Gateway Basics

#### C15.6. Containers: ECS, EKS & ECR

- ECS
  - Tasks, Services & Task Definitions
  - ECR Image Registry
  - Fargate vs EC2 Launch Type
- EKS
  - EKS vs ECS Trade-offs
  - Managed Control Plane Basics

#### C15.7. S3 Object Storage

- S3
  - Buckets, Objects & Keys
  - Storage Classes
  - Lifecycle Rules
  - Bucket Policies, Block Public Access & Encryption
  - Static Website & Asset Hosting

#### C15.8. EBS, EFS & Storage Comparison

- EBS, EFS & Storage Choices
  - EBS Volumes, Attach & Snapshots
  - EFS Shared File Storage
  - EBS vs EFS vs S3
  - Glacier & Backup / DR Overview
  - Storage Gateway & Snow Family Overview

#### C15.9. VPC Networking & Security

- VPC Fundamentals
  - Subnets, Route Tables & Internet/NAT Gateways
  - Security Groups
  - NACLs vs Security Groups
  - VPC Peering & Gateway/Interface Endpoints
  - Bastion Hosts & Private Access Patterns

#### C15.10. Load Balancing & Auto Scaling

- Load Balancers (AWS)
  - ALB vs NLB vs Classic
  - Target Groups & Health Checks
  - Listeners, TLS & Path Routing
- Auto Scaling
  - ASG Scaling Policies
  - Health-Based Instance Replacement

#### C15.11. Route 53 & CloudFront

- Route 53
  - Records & Routing Policies
  - Health Checks & DNS Failover
- CloudFront
  - CDN Caching & Origins
  - HTTPS, OAI/OAC & Static Assets

#### C15.12. RDS & Aurora

- RDS
  - Engines, Create & Connectivity
  - Multi-AZ & Read Replicas
  - Automated Backups & Snapshots
  - Aurora Overview
  - RDS vs Aurora

#### C15.13. DynamoDB & Managed Data Stores

- DynamoDB
  - Tables, Partition & Sort Keys
  - On-Demand vs Provisioned Capacity
  - Streams & Lambda Integration
  - ElastiCache Overview
  - Redshift Overview

#### C15.14. SQS, SNS & Application Integration

- SQS
  - Standard vs FIFO Queues
  - Visibility Timeout & DLQ
- SNS
  - Topics & Subscriptions
  - SNS → SQS Fan-out Pattern
  - EventBridge & Kinesis Overview

#### C15.15. CloudWatch, CloudTrail & Operations

- CloudWatch
  - Metrics, Alarms & Dashboards
  - CloudWatch Logs
  - CloudTrail vs CloudWatch
  - Synthetics & Canaries
  - Trusted Advisor & AWS Health Overview

#### C15.16. Cost, IaC & Well-Architected

- Cost, IaC & Well-Architected
  - Cost Explorer, Budgets & Billing Alarms
  - CloudFormation Overview
  - Well-Architected Framework Pillars
  - Organizations & Account Governance Basics
  - Migration Strategies Overview

#### C16.1. Observability Foundations

- Observability Foundations
  - Logs, Metrics & Traces
  - Monitoring vs Observability
  - USE, RED & Golden Signals
  - Emit → Collect → Store → Query → Act
  - Unknown-Unknowns & High-Cardinality Context

#### C16.2. Structured Logging

- Structured Logging
  - JSON Log Schema & Stable Fields
  - MDC / Request Context
  - Levels, Sampling & Volume Control
  - PII Redaction & Secrets in Logs
  - Aggregation: Loki / ELK / CloudWatch Logs

#### C16.3. Metrics Fundamentals

- Metrics
  - Counters & Gauges
  - Histograms, Summaries & Buckets
  - Labels / Dimensions
  - Pull vs Push Metrics
  - Micrometer / Spring Metrics

#### C16.4. Golden Signals & SLIs

- Latency Percentiles
  - p50 / p95 / p99 Tail Latency
  - Why Averages Lie
- Error Rates
  - Availability as an SLI
- Throughput
  - RPS, Concurrency & Saturation Link
- Health Metrics
  - CPU, Memory, Queue & Pool Saturation

#### C16.5. Distributed Tracing

- Distributed Tracing
  - Traces, Spans & Parent-Child Links
  - Attributes, Events & Status
  - Head vs Tail Sampling
  - Jaeger / Zipkin / Tempo / X-Ray
  - Trace-Driven Debugging Across Services

#### C16.6. Correlation & Context Propagation

- Correlation IDs
  - traceparent, W3C Trace Context & Baggage
  - HTTP / Messaging Header Propagation
  - Joining Logs ↔ Metrics ↔ Traces
  - Async / Thread-Pool Context Loss

#### C16.7. OpenTelemetry

- OpenTelemetry Concepts
  - OTel Signals: Logs, Metrics, Traces
  - SDK vs Auto-Instrumentation
  - OpenTelemetry Collector
  - Exporters & Vendors
  - Semantic Conventions

#### C16.8. Prometheus

- Prometheus
  - PromQL Basics
  - Scraping & Service Discovery
  - Recording Rules
  - Prometheus Cardinality Explosions
  - HA, Federation & Long-Term Storage

#### C16.9. Grafana, Dashboards & Visualization

- Grafana
  - Dashboard Design for Incidents
  - RED/USE Dashboard Patterns
  - Variables & Multi-Service Boards
  - Dashboards as Code

#### C16.10. Alerting & On-Call

- Alerting & On-Call
  - Alert on Symptoms, Not Causes
  - Alert Noise, Fatigue & Routing
  - Multi-Window Burn-Rate Alerts
  - Runbooks Linked from Alerts
  - Pager Hygiene & Escalation

#### C16.11. Frontend, RUM & Full-Stack Telemetry

- Frontend & RUM Observability
  - Core Web Vitals (LCP, INP, CLS)
  - Real User Monitoring
  - Frontend Error Tracking
  - Linking Browser Spans to Backend Traces
  - API Latency from the Client Perspective

#### C16.12. Cardinality, Cost & Sampling

- Cardinality, Cost & Sampling
  - Dangerous High-Cardinality Labels
  - Log Volume & Retention Cost
  - Adaptive / Tail-Based Sampling
  - Telemetry Budgets per Service

#### C16.13. Profiling & Continuous Diagnostics

- Profiling & Continuous Diagnostics
  - CPU & Heap Profiles
  - Continuous Profiling
  - JVM Runtime Signals (GC, Threads)
  - Catching Perf Regressions in Prod

#### C16.14. Incident Debugging Playbooks

- Incident Debugging Playbooks
  - Symptom → Signal → Hypothesis → Prove
  - Cross-Service Investigation
  - Customer-Impact-First Triage
  - Post-Incident Telemetry Gaps
  - Observability Interview Checklist

<a id="track-d"></a>

### Track D — LLD, System Design & Distributed Systems

#### D1. Object-Oriented Design

- Encapsulation
- Abstraction
- Composition vs Inheritance
- SOLID
- Coupling/Cohesion
- Interfaces (Design)
- Immutability (Design)

#### D2. Design Patterns

- Strategy
- Factory
- Builder
- Observer
- Adapter
- Decorator
- Facade
- Command
- Template Method
- Chain of Responsibility
- State
- Proxy
- Visitor

#### D3. LLD Interview Problems

- Parking Lot
- Elevator
- Library
- Vending Machine
- Tic-Tac-Toe
- Chess
- Splitwise
- ATM
- Notification Service (LLD)
- Logging Framework
- Rate Limiter (LLD)
- Cache (LLD)
- Movie Ticket Booking (LLD)
- Food Delivery (LLD)

#### D4.1. System Design Foundations, HLD & LLD Boundaries

- System Design Foundations
  - What System Design Is
  - High-Level vs Low-Level Design
  - Components, Interfaces & Data Flow
  - Scalability, Reliability, Performance & Maintainability
  - Design for Requirements, Not Buzzwords

#### D4.2. Requirements, Constraints & Trade-offs

- Requirements & Constraints
  - Functional Requirements
  - Non-Functional Requirements & SLOs
  - Read/Write Mix, Access Patterns & Data Shape
  - Latency, Freshness, Availability & Cost Trade-offs
  - Scope, Assumptions & Explicit Non-Goals

#### D4.3. Scale from One Server to Millions

- Scale from One Server to Millions
  - Single-Server Baseline
  - Separate Web & Data Tiers
  - Horizontal vs Vertical Scaling
  - Stateless vs Stateful Services
  - Redundancy at Every Tier
  - Multi-Datacenter Evolution

#### D4.4. Latency, Throughput & Performance Budgets

- Latency & Throughput
  - p50, p95, p99 & Tail Latency
  - Throughput, Concurrency & Utilization
  - Queueing, Saturation & Little’s Law
  - Memory vs Latency
  - Batching, Compression & Fewer Round Trips

#### D4.5. Load Balancing, Proxies & Traffic Routing

- Load Balancing
  - Layer 4 vs Layer 7 Load Balancing
  - Round Robin, Least Connections & Weighted Routing
  - Health Checks & Failure Removal
  - Sticky Sessions & Why Stateless Is Easier
  - Forward vs Reverse Proxy
  - GeoDNS, Anycast & Global Routing

#### D4.6. Availability, Reliability & Failure Models

- Availability
  - Reliability vs Availability
  - Crash, Omission, Timing & Byzantine Failures
  - Partial Failure Is the Default
  - Single Points of Failure
  - Fault Tolerance, Redundancy & Graceful Degradation
  - Availability Math & Dependency Composition

#### D4.7. CAP, PACELC & Consistency Models

- CAP Theorem
  - Consistency
  - Strong vs Eventual Consistency
  - Eventual Consistency
  - PACELC: Partition and Normal-Operation Trade-offs
  - Read-Your-Writes, Monotonic Reads & Session Guarantees
  - Causal Consistency
  - Linearizability vs Serializability

#### D4.8. Replication, Leaders & Quorums

- Replication
  - Leader/Follower Architecture
  - Synchronous vs Asynchronous Replication
  - Single-Leader vs Multi-Leader
  - Read/Write Quorums
  - Replication Lag & Stale Reads
  - Conflict Detection & Resolution

#### D4.9. Partitioning, Sharding & Consistent Hashing

- Partitioning & Sharding
  - Range vs Hash Partitioning
  - Choosing a Shard / Partition Key
  - Hot Keys, Celebrity Problem & Skew
  - Resharding & Online Data Movement
  - Consistent Hashing
  - Virtual Nodes & Bounded Loads
  - Cross-Shard Queries, Joins & Transactions

#### D4.10. Distributed Time, Ordering & Consensus

- Consensus Concepts
  - Distributed Clock & Time Issues
  - Lamport & Vector Clocks
  - Total vs Partial Ordering
  - Leader Election
  - Gossip Protocols
  - Raft Details
  - Split Brain, Leases & Fencing Tokens

#### D4.11. Delivery Semantics & Idempotency

- Idempotency in Distributed Systems
  - At-Most, At-Least & Effectively-Once Delivery
  - Deduplication Keys & Inbox Tables
  - Retries and Non-Idempotent Side Effects
  - Ordering, Duplicates & Consumer Correctness
  - Why “Exactly Once” Has a Scope

#### D4.12. Distributed Transactions & Workflows

- Distributed Transactions
  - Two-Phase Commit
  - Saga: Orchestration vs Choreography
  - Transactional Outbox & CDC
  - Compensation & Semantic Rollback
  - Durable Workflow Engines

#### D5.1. Data Modeling & Access-Pattern-First Design

- Data Modeling for Systems
  - Entities, Relationships & Invariants
  - Model from Access Patterns
  - Normalization vs Denormalization
  - Secondary Indexes & Write Amplification
  - Retention, Archival, Deletion & Compliance
  - Data Retention Policies

#### D5.2. SQL, NoSQL & Database Selection

- SQL vs NoSQL
  - Relational Databases
  - Key-Value Stores
  - Document Databases
  - Wide-Column Stores
  - Graph Databases
  - Polyglot Persistence & Its Cost

#### D5.3. Database Replication & Read Scaling

- Database Replication
  - Read Replicas
  - Read-After-Write Routing
  - Failover, Promotion & Data Loss Windows
  - Cross-Region Replication

#### D5.4. Database Partitioning & Sharding

- Database Sharding
  - Data Partitioning
  - Hot Partitions
  - Shard Routing & Metadata
  - Global Secondary Indexes
  - Online Schema & Shard Migrations

#### D5.5. Block, File & Object Storage

- Blob & Object Storage
  - Block vs File vs Object Storage
  - Objects, Metadata & Immutable Blobs
  - Pre-Signed Upload / Download Flows
  - Multipart Uploads, Chunking & Checksums
  - Durability, Replication & Erasure Coding

#### D5.6. Caching Architecture & Invalidation

- Caching
  - Local vs Distributed Cache
  - Cache-Aside, Read-Through & Write-Through
  - Write-Back / Write-Behind
  - LRU, LFU, FIFO & TTL
  - Invalidation, Versioned Keys & Freshness
  - Stampede, Penetration & Hot Keys
  - Cold Starts, Warming & Precomputation

#### D5.7. CDN & Edge Delivery

- Content Delivery Networks
  - Edge PoPs, Origins & Cache Keys
  - TTL, Invalidation & Versioned Assets
  - Static vs Dynamic Content Caching
  - Origin Shielding & CDN Failure Fallback
  - Edge Compute & Personalization

#### D5.8. Queues, Pub/Sub & Async Work

- Message Queues
  - Queue vs Publish/Subscribe
  - Producer, Broker & Consumer
  - Load Leveling & Backpressure Buffer
  - Acknowledgements, Visibility Timeout & DLQ
  - Ordering, Partitions & Consumer Groups
  - Poison Messages, Retry & Replay

#### D5.9. Event Streams & Data Pipelines

- Event Streams
  - Append-Only Log vs Queue
  - Event Streaming & Consumer Offsets
  - Batch vs Stream Processing
  - Event Sourcing vs Event Streaming
  - CDC & Materialized Views
  - Lambda vs Kappa Architecture

#### D5.10. Search, Indexes & Probabilistic Structures

- Search Systems
  - Inverted Index
  - Tries & Prefix Search
  - Retrieval, Ranking & Relevance
  - Bloom Filters
  - Indexing Pipeline & Near-Real-Time Refresh
  - Search Sharding & Replication

#### D6.1. API Contracts & Protocol Selection

- API Design Foundations
  - REST
  - gRPC
  - GraphQL Concepts
  - REST vs gRPC vs GraphQL
  - Synchronous vs Asynchronous APIs

#### D6.2. Resource Modeling, Errors & Compatibility

- Resource Modeling
  - API Versioning & Evolution
  - Error Modeling
  - Backward & Forward Compatibility
  - Schema Contracts & Validation
  - Partial Success & Bulk APIs

#### D6.3. Pagination, Filtering & Large Results

- Pagination
  - Offset vs Cursor / Keyset Pagination
  - Filtering & Sorting
  - Stable Sort Keys
  - Pagination under Concurrent Writes
  - Async Exports for Huge Result Sets

#### D6.4. Real-Time Communication

- WebSockets
  - Server-Sent Events
  - Polling vs Long Polling
  - Connection Gateways, Fan-out & Presence
  - Reconnect, Resume Tokens & Missed Events

#### D6.5. API Gateway, Security & Rate Limiting

- API Gateway & Edge Controls
  - Authentication & Authorization
  - Rate Limiting
  - Idempotency Keys
  - API Gateway vs Load Balancer
  - Validation, Quotas & WAF

#### D6.6. Service Communication & Discovery

- Service Communication
  - Service Discovery & Registration
  - Client-Side vs Server-Side Discovery
  - Heartbeats, Leases & Health
  - Service Mesh & Sidecars
  - Consumer-Driven Contract Testing

#### D7.1. Architecture Styles & Service Boundaries

- Architecture Styles
  - Monolith & Modular Monolith
  - Microservices
  - Monolith vs Microservices Trade-offs
  - Event-Driven Architecture
  - Serverless Architecture
  - Service Boundaries & Conway’s Law
  - Strangler Migration from Monolith

#### D7.2. Caching Strategy at System Scale

- Caching Strategies
  - Cache Invalidation
  - Browser, CDN, Service & Database Caches
  - Cache Consistency & Write Policies
  - Cache Failure, Stampede & Bypass

#### D7.3. Overload Protection & Backpressure

- Overload Control
  - Distributed Rate Limiting
  - Load Shedding
  - Backpressure
  - Bounded Queues & Admission Control
  - Priority, Fairness & Tenant Isolation

#### D7.4. Timeouts, Retries & Circuit Breakers

- Failure Containment
  - Timeouts & Deadline Propagation
  - Retries, Backoff & Jitter
  - Circuit Breakers
  - Bulkheads & Failure Domains
  - Cascading Failure Analysis
  - Fallbacks & Graceful Degradation

#### D7.5. High Availability, Failover & Disaster Recovery

- High Availability
  - Single Points of Failure
  - Redundancy
  - Failover
  - Disaster Recovery
  - RTO, RPO, Backups & Restore Testing
  - Active/Active vs Active/Passive

#### D7.6. SLIs, SLOs & Production Readiness

- SLI, SLO & SLA Concepts
  - Service-Level Objectives
  - Service-Level Agreements
  - Availability Calculations
  - Error Budgets & Release Policy
  - Latency, Traffic, Errors & Saturation
  - Production Readiness Review & Runbooks

#### D7.7. Multi-Region Architecture

- Multi-Region Architecture
  - Global Traffic Routing & Locality
  - Data Residency & Sovereignty
  - Cross-Region Replication & Conflict Handling
  - Region Evacuation & Failover Drills
  - Cell-Based Architecture

#### D7.8. Security, Privacy, Cost & Sustainability

- Cross-Cutting Architecture Concerns
  - Threat Modeling & Trust Boundaries
  - Zero Trust & Least Privilege
  - Encryption & Key Management
  - Privacy, Retention & Right to Delete
  - Cost vs Performance Optimization
  - Sustainability & Resource Efficiency

#### D8.1. Back-of-the-Envelope Estimation Method

- Back-of-the-Envelope Estimation
  - Powers of Two, Time & Latency Numbers
  - Average vs Peak & Safety Margins
  - Assumption-Driven Estimates
  - Order-of-Magnitude over False Precision

#### D8.2. Traffic, QPS & Concurrency Estimation

- Requests per Second
  - Read/Write Ratios
  - DAU → Requests/Day → Average/Peak QPS
  - Concurrent Connections
  - Fan-out & Internal Request Amplification

#### D8.3. Storage, Bandwidth & Cache Estimation

- Storage Estimation
  - Bandwidth & Egress Estimation
  - Cache-Size Estimation
  - Database-Growth Estimation
  - Replication, Index & Metadata Overhead
  - Hot, Warm & Cold Retention Tiers

#### D8.4. Capacity Planning & Bottleneck Analysis

- Server & Capacity Requirements
  - CPU, Memory, Disk I/O & Network Limits
  - Utilization Targets & Headroom
  - Capacity Model & Load-Test Validation
  - Cost Envelope & Unit Economics

#### D9.1. The 45–60 Minute Interview Framework

- System Design Interview Framework
  - Time Budget by Interview Phase
  - Clarify Before Drawing Boxes
  - Top-Down Design & Iterative Refinement
  - Drive the Interview Collaboratively
  - Maintain Assumptions & Decision Log

#### D9.2. Requirements & Scope in Interviews

- Requirements Gathering
  - Functional Requirements
  - Non-Functional Requirements
  - Prioritize Core Use Cases
  - Scale, Geography & Tenant Model
  - Consistency, Latency & Availability Targets

#### D9.3. Estimation, APIs & Data Model in Interviews

- Capacity Estimation in Interviews
  - API Design
  - Data Modeling
  - Estimate What Changes the Design
  - Idempotency, Pagination & Error Contracts
  - Schema from Critical Access Patterns

#### D9.4. High-Level Architecture & Request Flows

- High-Level Architecture
  - Critical Read Path
  - Critical Write Path
  - Synchronous vs Asynchronous Boundaries
  - Component Responsibilities & Ownership
  - Diagram Legibility & Data-Flow Labels

#### D9.5. Deep Dives, Scaling & Failure Handling

- Component Deep Dives
  - Scaling the Bottleneck
  - Reliability & Failure Handling
  - What If This Node or Region Dies?
  - Consistency & Correctness
  - Security & Privacy
  - Observability & Operations

#### D9.6. Trade-offs & Senior-Level Communication

- Trade-off Analysis
  - Compare Viable Alternatives
  - Name Residual Risk & Revisit Triggers
  - Avoid Premature Microservices & Sharding
  - Defend Choices and Adapt to Pushback
  - Ownership, Migration & Operational Cost

#### D9.7. Mocks, Deliberate Practice & Company Calibration

- System Design Deliberate Practice
  - Whiteboard / Excalidraw Fluency
  - Timed Mock Interviews & Feedback
  - Design Retrospective & Gap Log
  - Compare Multiple Solutions to One Problem
  - Company/Level-Specific Calibration
  - Build, Scale, Measure, Break & Rebuild

#### D10.1. Design a URL Shortener

- URL Shortener
  - ID Generation & Base62
  - Read-Heavy Cache & Redirect Path
  - Expiry, Analytics & Abuse Prevention

#### D10.2. Design Pastebin

- Pastebin
  - Metadata DB + Object Storage
  - Expiration & Cleanup
  - Hot Content & CDN

#### D10.3. Design a Distributed Rate Limiter

- Distributed Rate Limiter
  - Token Bucket, Leaky Bucket & Sliding Window
  - Distributed Counters & Atomicity
  - Fail-Open vs Fail-Closed

#### D10.4. Design a Key-Value Store

- Distributed Key-Value Store
  - Partitioning & Replication
  - Consistency, Quorums & Conflict Resolution
  - WAL, Memtable & SSTable Concepts

#### D10.5. Design a Unique ID Generator

- Distributed Unique ID Generator
  - UUID vs Database Sequence vs Snowflake
  - Timestamp, Node & Sequence Bits
  - Clock Rollback & Worker-ID Coordination

#### D10.6. Design a Notification System

- Notification System
  - Email, SMS, Push & In-App Channels
  - Priority, Retry, DLQ & Deduplication
  - Preferences, Templates & Rate Limits

#### D10.7. Design a News Feed

- Twitter / News Feed
  - Fan-out on Write vs Read
  - Celebrity / Hot-Key Problem
  - Ranking, Cache & Cursor Pagination

#### D10.8. Design a Chat System

- Chat System
  - WebSocket Gateways & Session Routing
  - Message Ordering, Delivery & Read Receipts
  - Presence, Offline Delivery & Multi-Device Sync

#### D10.9. Design Google Drive / Dropbox

- Dropbox / Google Drive
  - Chunking, Deduplication & Multipart Upload
  - Change Sync & Conflict Resolution
  - Metadata DB vs Blob Storage

#### D10.10. Design YouTube / Video Streaming

- YouTube / Video Streaming
  - Upload, Transcode & Processing Pipeline
  - CDN & Adaptive Bitrate Streaming
  - Metadata, Views & Recommendation Boundaries

#### D10.11. Design Search Autocomplete

- Search Autocomplete
  - Trie / Prefix Index & Top-K
  - Ranking, Freshness & Personalization
  - Caching, Sharding & Hot Prefixes

#### D10.12. Design a Ticket Booking System

- Ticket Booking System
  - Seat Holds, Locks & Expiration
  - Prevent Overselling under Concurrency
  - Flash-Sale Queues, Fairness & Idempotent Payment

#### D10.13. Design Uber / Ride Hailing

- Uber / Ride Hailing
  - Location Updates & Geospatial Indexing
  - Driver Matching & Dispatch
  - Trip State Machine, Pricing & Event Flow

#### D10.14. Design a Payment System

- Payment System
  - Double-Entry Ledger & Immutable Events
  - Idempotency & Exactly-Once Business Effect
  - PSP Workflow, Reconciliation & Refunds

#### D10.15. Design a Distributed Job Scheduler

- Distributed Job Scheduler
  - Scheduling Index / Timing Wheel
  - Leases, Ownership & Failover
  - Retry, Deduplication & Misfires

#### D10.16. Design a Monitoring & Alerting Platform

- Metrics Monitoring & Alerting Platform
  - High-Throughput Metric Ingestion
  - Time-Series Storage & Downsampling
  - Alert Evaluation, Routing & Deduplication

#### D10.17. Design a Distributed Cache

- Distributed Cache
  - Partition, Replicate & Rebalance
  - Eviction, Hot Keys & Stampede
  - Consistency & Node Failure

#### D10.18. Design an Ad-Click Aggregation System

- Ad-Click Event Aggregation
  - Event Ingestion & Partitioning
  - Windowed Aggregation & Late Events
  - Deduplication & Batch Reconciliation

#### D10.19. Design a Web Crawler

- Web Crawler
  - URL Frontier, Priority & Politeness
  - URL/Content Deduplication & Bloom Filters
  - Distributed Fetchers, Retry & Storage

#### D10.20. Design a Proximity / Nearby Service

- Proximity / Nearby Service
  - Geohash, Quadtree & S2 Cells
  - Radius Search & Boundary Expansion
  - Location Updates, Hotspots & Caching

#### D10.21. Design Google Maps

- Maps & Navigation
  - Map Tiles, Object Storage & CDN
  - Road Graph, Routing & Precomputation
  - Live Traffic & ETA Updates

#### D10.22. Design a Distributed Message Queue

- Distributed Message Queue
  - Partitions, Ordering & Replication
  - Offsets, Acknowledgements & Consumer Groups
  - Retention, Replay & Rebalancing

#### D10.23. Design a Distributed Email Service

- Distributed Email Service
  - Queues, Priority & Provider Routing
  - Rate Limits, Reputation & Bounce Handling
  - Templates, Tracking & Idempotency

#### D10.24. Design S3-Like Object Storage

- S3-Like Object Storage
  - Metadata Plane vs Data Plane
  - Chunk Placement, Replication & Erasure Coding
  - Consistency, Checksums & Repair

#### D10.25. Design a Real-Time Leaderboard

- Real-Time Gaming Leaderboard
  - Sorted Sets & Rank Queries
  - Sharding, Top-K & Global Merge
  - Seasons, Ties & Anti-Cheat

#### D10.26. Design a Digital Wallet

- Digital Wallet
  - Ledger vs Derived Balance
  - Transfers, Idempotency & Saga
  - Audit, Reconciliation & Fraud Controls

#### D10.27. Design a Stock Exchange

- Stock Exchange
  - Order Book & Price-Time Priority
  - Deterministic Matching & Sequencing
  - Market Data Fan-out, Durability & Audit

#### D10.28. Design an Online Coding Judge

- Online Coding Judge
  - Secure Sandboxing & Resource Isolation
  - Submission Queue & Language Workers
  - Test Storage, Scoring & Result Streaming

#### D10.29. Design Collaborative Documents

- Google Docs / Collaborative Editing
  - Operational Transform vs CRDT
  - Presence, Offline Edits & Synchronization
  - Snapshots, History & Compaction

#### D10.30. Design an E-Commerce / Food Delivery Platform

- E-Commerce & Food Delivery Platform
  - Catalog, Search & Inventory
  - Order Saga, Payment & Fulfillment
  - Flash Sales, Hot Keys & Fair Admission
  - Delivery Tracking & Event-Driven Updates

<a id="track-e"></a>

### Track E — Applied AI Engineering

#### E1.1. Applied AI Landscape & Engineering Roles

- Applied AI Engineering Landscape
  - AI → ML → Deep Learning → Generative AI
  - Foundation, Language & Multimodal Models
  - AI Engineer vs ML Engineer vs Data Scientist vs Researcher
  - Frontier, Open-Weight, Small & Reasoning Models
  - Deterministic Software vs AI Decision

#### E1.2. AI Power-User & Coding-Agent Workflows

- AI Tool Mastery
  - ChatGPT, Claude, Gemini & Research Tools
  - Compare Model Strengths, Limits & Outputs
  - Cursor, Copilot & Coding-Agent Workflows
  - Repository Research, Refactoring, Debugging & Tests
  - Delegate, Verify & Retain Human Ownership
  - Research Synthesis, Citations & Fact Checking

#### E1.3. Python Essentials for AI Engineers

- Python Essentials
  - Collections
  - Functions, Iterators & Exceptions
  - Classes & Dataclasses
  - Type Hints
  - Modules & Package Management
  - Virtual Environments

#### E1.4. Python AI Backend & Data Stack

- Python AI Backend Engineering
  - Pydantic Models & Validation
  - FastAPI & Typed REST APIs
  - Async/Await, SSE & WebSockets
  - Background Jobs & Queues
  - NumPy Basics
  - Pandas, Jupyter & Data Exploration

#### E2.1. Machine Learning Foundations

- ML, Deep Learning & Generative AI
  - Datasets, Features, Labels & Targets
  - Parameters vs Hyperparameters
  - Training vs Inference
  - Generalization, Distribution Shift & Baselines

#### E2.2. Learning Paradigms & Core ML Problems

- Learning Paradigms
  - Supervised Learning
  - Unsupervised Learning
  - Self-Supervised & Semi-Supervised Learning
  - Reinforcement Learning Concepts
  - Regression & Classification
  - Clustering, Ranking & Recommendation

#### E2.3. Training, Generalization & Classical Evaluation

- Training & Evaluation
  - Train, Validation & Test Splits
  - Loss Functions & Optimization
  - Gradient Descent & Learning Rate
  - Overfitting, Underfitting & Regularization
  - Bias–Variance Trade-off
  - Accuracy, Precision, Recall, F1 & ROC-AUC

#### E2.4. Math for Applied AI — Just in Time

- Math for Applied AI
  - Vectors, Matrices, Tensors & Dot Products
  - Probability, Bayes, Expectation & Sampling
  - Statistics, Correlation & Confidence
  - Derivatives, Gradients & Chain Rule
  - SGD, Adam & Learning-Rate Schedules

#### E2.5. Classical ML with scikit-learn

- Classical ML Practice
  - Linear & Logistic Regression
  - Decision Trees, Random Forests & Gradient Boosting
  - K-Means & PCA
  - Preprocessing & scikit-learn Pipelines
  - Cross-Validation & Hyperparameter Tuning

#### E2.6. Neural Networks & PyTorch Fundamentals

- Neural-Network Concepts
  - Neurons, Weights, Biases & Activations
  - Forward Propagation & Backpropagation
  - PyTorch Tensors & Autograd
  - nn.Module, DataLoaders & Training Loops
  - CNN, RNN & LSTM Context

#### E2.7. Transformers & Attention Internals

- Transformer Architecture
  - Tokenization
  - Tokens, Vocabulary & Special Tokens
  - Token Embeddings & Positional Information
  - Query, Key, Value & Self-Attention
  - Multi-Head & Causal Attention
  - Residuals, LayerNorm, MLP & Transformer Blocks
  - Encoder, Decoder & Encoder–Decoder Families

#### E2.8. LLM Inference, Training Lifecycle & Limitations

- Large Language Model Fundamentals
  - Context Windows & Lost-in-the-Middle
  - Logits, Temperature, Top-p & Sampling
  - Prefill, Decode & KV Cache
  - Pretraining, Instruction Tuning & Alignment
  - Reasoning Models & Test-Time Compute
  - Hallucinations, Bias & Reasoning Failures

#### E3.1. Provider APIs & Direct SDK Integration

- LLM Provider APIs
  - OpenAI API Patterns
  - Anthropic API Patterns
  - Gemini API Patterns
  - Open-Model Inference APIs
  - Thin Provider Abstraction without Framework Lock-in

#### E3.2. Messages, Conversations & Streaming

- Messages & Conversations
  - System, Developer, User, Tool & Assistant Roles
  - Conversation State & Stateless API Calls
  - Streaming Responses
  - Cancellation, Disconnects & Partial Output
  - Usage Metadata & Token Accounting

#### E3.3. Structured Outputs & Typed Extraction

- Structured Outputs
  - JSON Schema & Typed Responses
  - Extraction, Classification & Transformation
  - Validation, Parsing & Repair
  - Refusals, Missing Fields & Partial Results
  - Deterministic Post-Processing

#### E3.4. Tool & Function Calling

- Tool & Function Calling
  - Tool Names, Descriptions & Argument Schemas
  - Model → Tool → Result → Model Loop
  - Parallel vs Sequential Tool Calls
  - Argument Validation & Tool Error Recovery
  - Authorization, Approval & Idempotency

#### E3.5. Model Selection, Routing & API Reliability

- Model Selection
  - Quality, Latency & Cost Trade-offs
  - Capability, Modality & Context Fit
  - Provider Rate Limits
  - Timeouts, Retries & Backoff
  - Task Routing, Fallbacks & Provider Failover

#### E4.1. Prompt Fundamentals & Instruction Design

- Prompt & Instruction Fundamentals
  - Objective, Context, Constraints & Output Contract
  - Zero-Shot Prompting
  - Few-Shot & Example-Driven Prompting
  - Structured Prompts & Delimiters
  - Decomposition & Prompt Chaining
  - Iterative Refinement & Critique

#### E4.2. Context Engineering

- Context Engineering
  - Relevant Context at the Moment of Decision
  - Context Selection, Ordering & Salience
  - Compression, Summarization & Token Budgets
  - Dynamic Context from Retrieval, Tools & State
  - Context Pollution & Lost-in-the-Middle

#### E4.3. Long Conversations & Memory Boundaries

- Conversation Context
  - Sliding-Window History
  - Conversation Summarization
  - Workflow State vs User Memory
  - Provider Prompt / Prefix Caching
  - Forgetting, Retention & User Control

#### E4.4. Prompt Operations & Versioning

- Prompt Operations
  - Templates, Variables & Reusable Components
  - Prompt Unit Tests & Regression Evals
  - Environment-Specific Prompts
  - Prompt/Model Version Tracing

#### E4.5. Output Validation & Prompt-Injection Awareness

- Output Validation
  - Prompt-Injection Awareness
  - Instructions vs Untrusted Content
  - Typed Schemas & Allow-Listed Values
  - Model Output Is Data, Not Authorization
  - Safe Rendering, Escaping & Downstream Use

#### E5.1. Embedding Models & Representation Spaces

- Embeddings
  - Text, Image & Multimodal Embeddings
  - Dimensions, Normalization & Model Compatibility
  - Domain, Language & Task Fit
  - Embedding Versioning & Re-Indexing

#### E5.2. Similarity & Nearest-Neighbor Search

- Vector Similarity
  - Cosine Similarity
  - Dot Product vs Euclidean Distance
  - Exact Nearest Neighbors
  - Approximate Nearest Neighbors
  - Recall, Latency & Memory Trade-offs

#### E5.3. Vector Indexes & Storage

- Vector Indexes
  - HNSW
  - IVF & Product Quantization Concepts
  - PostgreSQL + pgvector
  - Pinecone, Qdrant, Weaviate & Chroma
  - Index Build, Updates, Deletes & Compaction

#### E5.4. Semantic, Keyword & Hybrid Search

- Semantic Search
  - Keyword Search & BM25
  - Dense + Sparse Hybrid Search
  - Metadata & Access-Control Filtering
  - Cross-Encoder Reranking
  - Search Relevance Evaluation

#### E6.1. RAG Architecture & Knowledge Ingestion

- RAG Ingestion
  - Ingest → Index → Retrieve → Augment → Generate
  - PDF, HTML, DOCX, Spreadsheet & OCR Parsing
  - Cleaning, Normalization & Boilerplate Removal
  - Metadata, Provenance & Source URLs
  - Incremental Sync, Deletes & Reprocessing

#### E6.2. Chunking & Document Structure

- Chunking Strategies
  - Fixed, Recursive & Structure-Aware Chunking
  - Semantic Chunking
  - Parent–Child & Small-to-Big Retrieval
  - Overlap, Boundaries & Context Loss
  - Evaluate Chunk Size by Task

#### E6.3. Embedding & Indexing Pipelines

- RAG Embedding & Indexing
  - Indexing Pipeline
  - Batching, Rate Limits & Retry
  - Chunk, Document & ACL Index Schema
  - Versioning & Zero-Downtime Re-Embedding
  - Freshness, CDC & Event-Driven Indexing

#### E6.4. Retrieval & Reranking

- RAG Retrieval
  - Top-K & Candidate Recall
  - Metadata / Tenant / ACL Filtering
  - Dense + Sparse Hybrid Retrieval
  - Reranking & Score Fusion
  - Diversity, Deduplication & MMR

#### E6.5. Query Understanding & Retrieval Planning

- RAG Query Processing
  - Query Rewriting & Normalization
  - Multi-Query Retrieval
  - Query Decomposition
  - HyDE Concepts
  - Route by Corpus, Modality & Intent

#### E6.6. Context Construction, Grounding & Citations

- RAG Context Construction
  - Grounding & Citations
  - Context Ranking & Ordering
  - Context Compression & Token Budget
  - Claim-to-Source Citation Mapping
  - Abstain on Insufficient Evidence

#### E6.7. Advanced, Agentic & Multimodal RAG

- Advanced RAG
  - Agentic Retrieval
  - Corrective & Adaptive RAG
  - Graph RAG Concepts
  - Hierarchical Retrieval
  - Multimodal RAG

#### E6.8. RAG Evaluation & Failure Modes

- RAG Evaluation
  - RAG Failure Modes
  - Retrieval Precision, Recall & NDCG
  - Context Relevance & Coverage
  - Faithfulness & Answer Relevance
  - Citation Correctness & Completeness
  - Poisoning & Access-Control Tests

#### E7.1. Agents vs Deterministic Workflows

- Agent Fundamentals
  - Agent vs Workflow
  - Goal → Decide → Act → Observe → Complete
  - When Not to Use an Agent
  - Autonomy Spectrum & Risk
  - Termination Conditions & Max Steps

#### E7.2. Planning, Decomposition & Verification

- Agent Planning
  - Task Decomposition
  - Dynamic Planning & Replanning
  - Plan–Execute–Verify
  - Reflection & Critique—Use Carefully
  - Deterministic Verification & Assertions

#### E7.3. Agent Workflow Patterns

- Multi-Step Agent Workflows
  - Sequential Workflows
  - Parallel Fan-out / Fan-in
  - Classification & Routing
  - Orchestrator–Worker
  - Evaluator–Optimizer
  - Human-in-the-Loop

#### E7.4. Agent State, Memory & Context

- Agent State
  - Working, Semantic & Episodic Memory
  - Conversation Windows & Summaries
  - Durable Checkpoints & Resumption
  - Memory Extraction, Retrieval & Update
  - Forgetting, Conflicts, Privacy & Retention

#### E7.5. Agent Tool Use, Permissions & Approvals

- Agent Tool Calling
  - Tool Discovery & Selection
  - Least-Privilege Tool Permissions
  - Approval Gates for Consequential Actions
  - Sandboxing & Isolation
  - Idempotent Actions & Duplicate Prevention

#### E7.6. Reliable Long-Running Agents

- Agent Reliability
  - Timeouts, Retries & Backoff
  - Loop Detection & Step Budgets
  - Partial Progress & Compensating Actions
  - Checkpoint, Resume & Replay
  - Escalation & Honest Failure

#### E7.7. Multi-Agent Systems

- Multi-Agent Architectures
  - Supervisor & Specialist Agents
  - Delegation & Handoffs
  - Shared State & Communication
  - Coordination Evals & Failure Modes
  - One Capable Agent vs Multi-Agent

#### E7.8. MCP Architecture & Primitives

- Model Context Protocol Fundamentals
  - Host, Client & Server
  - MCP Tools
  - MCP Resources
  - MCP Prompts
  - MCP vs Direct Function Calling

#### E7.9. Building MCP Servers & Clients

- Build MCP Integrations
  - Server Implementation & Capability Discovery
  - Client Connection & Invocation Lifecycle
  - Errors, Timeouts & Cancellation
  - Authentication & Authorization
  - Remote MCP & Enterprise Integrations

#### E7.10. Production MCP Security & Operations

- Production MCP
  - Trust Boundaries & Consent
  - Tenant Isolation & Scoped Credentials
  - Tool Tracing, Audit & Cost
  - Schema Versioning & Compatibility
  - Prompt Injection through Tools & Resources

#### E8.1. Agent & RAG Frameworks—After Fundamentals

- AI Application Frameworks
  - Workflow Orchestration Frameworks
  - LangGraph State, Nodes, Edges & Persistence
  - LlamaIndex Ingestion & Retrieval
  - Provider Agent SDKs
  - What Frameworks Abstract—and Hide

#### E8.2. Hugging Face & Open-Weight Ecosystem

- Open-Weight AI
  - Hugging Face Hub, Models & Datasets
  - Transformers & Tokenizers Libraries
  - Weights, Checkpoints & Safetensors
  - Licenses, Commercial Use & Supply Chain
  - Hosted Frontier vs Open-Weight Decision

#### E8.3. Local Models, Formats & Quantization

- Run Models Locally
  - Ollama
  - llama.cpp
  - GGUF & Quantized Model Formats
  - FP16/BF16, INT8 & INT4 Quantization
  - Quality, Memory & Throughput Trade-offs

#### E8.4. Model Serving & Inference Optimization

- GPU Inference & Model Serving
  - vLLM & Continuous Batching
  - Prefill vs Decode
  - KV Cache & Prefix Caching
  - Speculative Decoding
  - Tokens/sec, TTFT, Throughput & Tail Latency

#### E8.5. Fine-Tuning & Model Customization

- Fine-Tuning
  - RAG vs Tools vs Fine-Tuning Decision
  - SFT & Instruction Dataset Quality
  - LoRA, QLoRA & PEFT
  - Preference Data, RLHF & DPO Concepts
  - Distillation & Synthetic Data
  - Evaluate Behavior without Regressing Capability

#### E8.6. Multimodal Document & Vision AI

- Multimodal AI
  - Vision–Language Models
  - OCR, Layout & Document Understanding
  - Screenshots, Charts & Diagram Reasoning
  - Diffusion, Generation, Editing & Inpainting
  - Video Understanding & Generation Concepts

#### E8.7. Speech, Realtime & Voice Agents

- Realtime Voice AI
  - Speech-to-Text, Text-to-Speech & Speech-to-Speech
  - Voice Activity Detection & Turn Taking
  - Interruptions & Barge-In
  - Realtime Tool Calling
  - End-to-End Latency & Streaming Audio

#### E8.8. AI Hardware & Distributed Inference

- AI Infrastructure
  - CPU vs GPU, VRAM & Memory Bandwidth
  - CUDA Kernels & Parallelism Concepts
  - Data Parallelism
  - Tensor Parallelism
  - Pipeline Parallelism
  - Distributed Inference & Model Placement

#### E9.1. Evaluation Strategy & Golden Datasets

- AI Evaluation Foundations
  - Why Probabilistic Software Needs Evals
  - Curated, Production & Synthetic Test Cases
  - Rubrics, Failure Taxonomy & Dataset Slices
  - Dataset Versioning & Leakage Prevention
  - Evaluate before Prompt/Model/RAG Changes

#### E9.2. LLM Output Evaluation

- Offline LLM Evaluations
  - Answer Correctness & Task-Specific Metrics
  - Groundedness & Hallucination Measurement
  - Exact Match vs Semantic Similarity
  - LLM-as-Judge, Rubrics & Calibration
  - Human Evaluation & Inter-Rater Agreement

#### E9.3. Retrieval & RAG Evaluation

- Retrieval Evaluation
  - Recall@K, Precision@K, MRR & NDCG
  - Context Relevance & Faithfulness
  - Citation Accuracy & Coverage
  - Component vs End-to-End RAG Evals
  - Chunking/Retrieval/Reranking Ablations

#### E9.4. Agent & Tool-Use Evaluation

- Agent Evaluation
  - Tool Selection & Argument Correctness
  - Task Success, Partial Credit & Side Effects
  - Steps, Latency, Tokens & Cost
  - Trajectory vs Final-Outcome Evaluation
  - Permission, Injection & Destructive-Action Evals

#### E9.5. Regression, Online Experiments & Feedback

- AI Regression Testing
  - Prompt, Model, Retrieval & Agent Regression
  - A/B Testing & Guardrail Metrics
  - Explicit/Implicit User Feedback
  - Shadow, Canary & Progressive Rollout
  - Production Samples → Evals → Improvement Loop

#### E10.1. Production AI Reference Architecture

- Production AI Architecture
  - AI Gateway & Orchestrator
  - Models, Retrieval, Tools & Memory Boundaries
  - Authentication, Tenant Context & Entitlements
  - Version Prompts, Models, Indexes & Tools
  - Quality, Latency, Reliability, Security & Cost

#### E10.2. Streaming, Async Jobs & Backend Infrastructure

- Streaming AI Responses
  - Async Processing
  - Queues & Workers
  - SSE vs WebSocket vs Polling
  - Cancellation, Backpressure & Disconnects
  - Long-Running Job State & Resume

#### E10.3. AI Performance, Caching & Context Efficiency

- AI Performance & Caching
  - Prompt / Prefix Caching
  - Semantic Caching & Correctness Risk
  - Token & Context Budgets
  - Parallel Retrieval & Tool Calls
  - Batching & Connection Pooling

#### E10.4. Reliability, Limits & Graceful Degradation

- Production AI Reliability
  - Timeouts & Deadline Budgets
  - Safe Retries & Backoff
  - Rate Limiting & Admission Control
  - Fallback Models & Deterministic Fallbacks
  - Circuit Breakers & Provider Isolation
  - Graceful Degradation & Human Escalation

#### E10.5. Model Routing & Cost Engineering

- Model Routing
  - Cost per Request, User & Successful Task
  - Small/Fast vs Frontier/Reasoning Models
  - Rules, Classifiers & Dynamic Routing
  - Batch Processing & Deferred Work
  - Context Reduction without Quality Loss
  - Per-Tenant Cost Budgets & Quotas

#### E10.6. AI Observability & Quality Monitoring

- AI Observability
  - Trace Model, Retrieval, Tool & Agent Steps
  - Prompt, Model, Index & Tool Version Tracking
  - Latency, Tokens, Cost & Error Metrics
  - Quality, Groundedness & Task-Success Signals
  - Feedback, Drift & Regression Detection

#### E10.7. AI Product Engineering & Decision Framework

- AI Product Engineering
  - AI-Suitable vs Deterministic Problems
  - UX for Uncertainty, Sources & Editable Outputs
  - Approval, Retry & Human Escalation
  - Task Completion, Acceptance, Retention & Cost/Task
  - Build vs Buy & Provider Lock-In
  - RAG vs Tools vs Agents vs Fine-Tuning vs Open Models

#### E11.1. Prompt Injection & Untrusted Content

- Prompt Injection
  - Indirect Prompt Injection
  - Jailbreaks & Instruction Conflicts
  - Separate Trusted Instructions from Untrusted Data
  - Malicious Tool Output & Cross-Domain Injection
  - Defense in Depth—not Prompt-Only Defenses

#### E11.2. Agent Security, Agency & Tool Abuse

- Agent & Tool Security
  - Excessive Agency
  - Least-Privilege Permission Boundaries
  - The Model Is Never the Authorization Layer
  - Human Approval for Consequential Actions
  - Sandboxing, Idempotency & Audit Logs

#### E11.3. Data, Tenant & RAG Security

- AI Data Security
  - Sensitive Data & PII Handling
  - Production PII Detection & Redaction
  - Provider and Tool Secrets
  - Application Access Control
  - Tenant-Isolated Retrieval & Memory
  - Poisoned Documents & Knowledge Bases
  - Access-Controlled Retrieval before Generation
  - Retention, Encryption & Provider Data Policies

#### E11.4. Input/Output Safety & Responsible AI

- AI Input & Output Safety
  - Schema Validation, Allowlists & Safe Rendering
  - Harmful Content & Moderation Boundaries
  - Bias, Fairness & Dataset Representation
  - Transparency, Sources & User Disclosure
  - Human Oversight & Contestability

#### E11.5. Adversarial Testing & AI Threat Modeling

- Adversarial AI Testing
  - Assets, Actors, Trust Boundaries & Abuse Cases
  - Injection/Jailbreak Red-Team Dataset
  - Tool Abuse & Exfiltration Tests
  - Security Regression Evals
  - AI Security Incident Response

#### E12.1. Project: Intelligent Document Analyzer

- Document-Analysis Platform
  - PDF, DOCX, Image, OCR & Layout
  - Typed Extraction & Validation
  - Questions, Citations & Suggested Actions
  - Golden Evals, PII & Malicious Documents

#### E12.2. Project: Production Enterprise RAG

- Enterprise RAG & Search System
  - 500+ Documents & Incremental Ingestion
  - Hybrid Retrieval, Reranking & Citations
  - ACL-Aware Multi-Tenant Retrieval
  - RAG Evals, Tracing & Hallucination Handling

#### E12.3. Project: AI Customer Support System

- AI Customer-Support System
  - Intent, Routing & Knowledge Retrieval
  - CRM Tools & Ticket Actions
  - Confidence, Approval & Human Escalation
  - Resolution Quality, Latency & Cost/Case

#### E12.4. Project: Repository-Aware Coding Assistant

- Coding Assistant
  - Repository Indexing & Context Selection
  - Search, Edit, Test & Sandboxed Shell Tools
  - Planning, Diff Review & Human Approval
  - Patch Correctness, Test & Security Evals

#### E12.5. Project: AI Research Assistant

- AI Research Assistant
  - Search, Fetch & Source Quality
  - Multi-Source Synthesis & Contradictions
  - Claim-Level Citations & Verification
  - Long-Running Workflow, Checkpoints & Cost

#### E12.6. Project: Tool-Using Productivity Agent

- AI Agent with External Tools
  - Calendar, Email, Tasks, Web & Weather Tools
  - State, Memory & Resumable Workflows
  - Scoped Credentials, Approval & Idempotency
  - Task-Success, Tool & Safety Evals

#### E12.7. Project: Recommendation & Personalization

- Recommendation & Personalization System
  - Candidate Generation & Ranking
  - Embeddings & Online Feedback
  - Cold Start, Exploration & Diversity
  - Bias, Business Metrics & A/B Tests

#### E12.8. Capstone: Multi-Tenant AI Executive Assistant

- Multi-Tenant Production AI Platform
  - Web, Mobile, Document & Voice Inputs
  - Model Router + RAG + Agent + MCP
  - Tenant Memory, Tools & Human Approval
  - Evals, Injection Defense & Access Control
  - Tracing, Reliability, Caching & Cost Budgets

