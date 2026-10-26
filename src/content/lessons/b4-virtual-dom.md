---
summary: The "virtual DOM" is React's in-memory description of the UI — a tree of plain JavaScript objects that your components return — which React compares between renders to decide what to change in the real DOM. You will learn what these objects look like, why React works this way, what it does and does not make faster, and where the approach runs out.
difficulty: intermediate
minutes: 45
objectives:
  - Explain what the virtual DOM is in React, and distinguish React elements, components, fibers and DOM nodes
  - Trace how JSX becomes element objects and how those objects lead to DOM changes
  - Explain why React describes UI as data instead of changing the DOM directly, and what that buys
  - Evaluate the claim "the virtual DOM is faster than the real DOM" and describe React's real cost model
  - Identify the limitations of the virtual DOM approach and the techniques or alternatives that address them
---

## Introduction

Before frameworks like React, updating a page meant writing code that changed the DOM step by step: find the element, change its text, add a class, remove a row, insert a new one. That **imperative** style is fine for a single button. In a large application it becomes the main source of bugs, because every piece of code that changes data must also remember every place on the screen that shows that data — and the order of operations matters. Forget one, and the screen lies to the user.

React takes a different approach. Your component does not change the screen; it returns a **description** of what the screen should look like for the current data. That description is a tree of ordinary JavaScript objects. When data changes, the component returns a new description, React compares it with the previous one, and React makes the necessary DOM changes itself. The in-memory description, and the technique of comparing descriptions to update the real page, is what people call the **virtual DOM**.

The term is popular and often misunderstood. Some think it is a copy of the browser's DOM; some think it makes React faster than hand-written JavaScript; some confuse it with the Shadow DOM. None of these is quite right. This lesson explains what the objects actually are, what the approach gives you, what it costs, and where its limits are — which is exactly what interviewers probe when they ask "what is the virtual DOM?"

## Before you start

- **JSX** — the HTML-like syntax that compiles to JavaScript function calls. See [[b4-jsx]].
- **Components** — functions that return JSX. See [[b4-component-model]].
- **The browser DOM** — the live tree of nodes the browser renders, and how changing it triggers style, layout and paint. See [[b3-dom]] and [[b3-reflow-repaint]].
- **The rendering lifecycle** — render computes, commit changes the DOM. See [[b4-rendering-lifecycle]].

## The intuition

Think about editing a long contract with a colleague. One way is to phone them and dictate edits as you think of them: "on page 4, change 'thirty' to 'sixty'; actually wait, on page 3…". Every instruction must be precise, and if you forget one, the documents diverge. Another way is to write the complete new version of the contract on your own copy, then run a comparison tool that produces a list of tracked changes, and send only that list. You never had to think about *how* to transform one version into the other — only about what the new version should say.

React's virtual DOM is the second way. Your components write "the complete new version" as cheap JavaScript objects. React's comparison step — [[b4-reconciliation]] — produces the list of changes. The commit step applies them to the real DOM.

The analogy breaks in one respect: React does not compare the *entire* app on every update. It re-renders and compares only the part of the tree under the component whose state changed.

## What the virtual DOM actually is

In React, the "virtual DOM" is not one specific object. It is a name for two kinds of in-memory structure working together:

1. **React elements** — the immutable objects your components return on each render. They describe *what* the UI should be.
2. **Fibers** — React's long-lived internal objects, one for each component instance and DOM node on screen. They remember what was rendered last time, the state of each component, and the real DOM node each host element maps to. See [[b4-fiber]].

The React team's own documentation rarely uses the term "virtual DOM" today; it talks about elements, rendering and reconciliation. You will still meet the term everywhere, and it is a reasonable shorthand for "React keeps a lightweight description of the UI in memory and diffs it".

It helps to keep four things apart:

| Thing | What it is | Created when | Lifetime |
|---|---|---|---|
| Component | A function (or class) you write | When you write your code | The whole program |
| React element | Plain object `{ type, key, props }` describing one piece of UI | Every time JSX is evaluated during a render | Until the next render replaces it |
| Fiber | React's internal record for one instance at one position | When that instance mounts | Until it unmounts; reused across renders |
| DOM node | The browser's real object, e.g. an `HTMLDivElement` | During commit, when the element is first mounted | Until React removes it |

## From JSX to element objects

JSX is not HTML and not a string. A compiler (Babel, TypeScript, esbuild, Oxc or SWC) turns each JSX tag into a function call. With React's automatic runtime, `<p className="note">Hi</p>` compiles to roughly `jsx('p', { className: 'note', children: 'Hi' })`, and that call returns an object. You can inspect these objects directly:

```jsx title="inspect-elements.jsx"
import { createElement } from 'react';

function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

const card = (
  <div className="card" key="c1">
    <Greeting name="Ada" />
    <p>Welcome back</p>
  </div>
);

console.log(typeof card);
console.log(card.$$typeof);
console.log(card.type, card.key);
console.log(Object.keys(card.props));

const [first, second] = card.props.children;
console.log(first.type === Greeting, first.props);
console.log(second.type, second.props);

const handMade = createElement('p', null, 'Welcome back');
console.log(handMade.type, handMade.props);

console.log(Greeting({ name: 'Ada' }).props);
console.log(Object.isFrozen(card));
```

Run with React 19 in development mode, this prints:

```output
object
Symbol(react.transitional.element)
div c1
[ 'className', 'children' ]
true { name: 'Ada' }
p { children: 'Welcome back' }
p { children: 'Welcome back' }
{ children: [ 'Hello, ', 'Ada' ] }
true
```

Several facts fall out of this output.

**An element is a plain object.** It has a `type`, a `key` and `props`. Children are just another prop, `props.children`. There are no DOM methods, no layout, no event listeners — nothing that costs much to create.

**`$$typeof` marks it as a genuine element.** It is a `Symbol`, which cannot be produced by `JSON.parse`. That is a security measure: if a server returned JSON shaped like an element and your code tried to render it, React would reject it, because JSON cannot contain the symbol. React 19 uses `Symbol(react.transitional.element)`; React 18 and earlier used `Symbol(react.element)`.

**A component element does not contain the component's output.** `<Greeting name="Ada" />` is just `{ type: Greeting, props: { name: 'Ada' } }`. React has not called `Greeting` yet. It will call it during rendering, when it reaches that element. Calling it by hand (the second-to-last line) shows what it would return: another element, an `<h1>` whose children are the two text pieces.

**JSX and `createElement` produce the same thing.** `createElement('p', null, 'Welcome back')` builds an identical element. See [[b4-create-element]].

**Elements are immutable.** In development, React freezes each element (`Object.isFrozen` prints `true`) so that accidental mutation fails loudly. In production builds the freeze is skipped for speed, but the rule is the same: you never change an element; you render a new one. That immutability is what makes comparing "before" and "after" trustworthy.

## How an update flows through the virtual DOM

Here is what happens when a state change leads to new elements and finally to DOM changes.

```mermaid title="From render output to DOM changes"
flowchart LR
    S["State changes"] --> R["Render: components return new elements"]
    R --> D["Reconcile: compare with fibers from last render"]
    D --> F["Fibers flagged: update, insert, delete"]
    F --> C["Commit: apply flagged changes to the real DOM"]
```

Suppose a `Cart` component renders `<span>Items: {count}</span>` and `count` changes from 2 to 3. During rendering, `Cart` returns a new element whose child text is `3`. React compares it with what the `<span>` fiber holds from last time: same type `span`, so keep the DOM node; text differs, so record an update. In the commit phase React sets the text on the existing `<span>` node. Nothing else in the DOM is touched, even though `Cart` returned elements for its whole subtree.

Crucially, **React compares the new elements with its own record of the previous render, not with the live DOM.** It never reads the DOM to discover what changed. You can see this by changing a node behind React's back:

```jsx title="OutsideEdit.jsx"
import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function Status() {
  const [count, setCount] = useState(0);
  const [tick, setTick] = useState(0);
  return (
    <div>
      <span id="label">Status: ready</span>
      <span id="count">{count}</span>
      <button id="inc" onClick={() => setCount(count + 1)}>increment</button>
      <button id="tick" onClick={() => setTick(tick + 1)}>re-render</button>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<Status />);

// Later, in the browser console:
const label = document.getElementById('label');
const count = document.getElementById('count');
const show = (step) => console.log(`${step}:`, label.textContent, '|', count.textContent);

label.textContent = 'Status: edited outside React';  // edit both spans directly
count.textContent = '99';
show('after manual edit');
// click "re-render", then run:  show('after re-render')
// click "increment", then run:  show('after count=1')
```

```output
after manual edit: Status: edited outside React | 99
after re-render: Status: edited outside React | 99
after count=1: Status: edited outside React | 1
```

After the edit, "re-render" makes `Status` render again with identical output. React compares new elements with old elements, finds no differences, and changes nothing — so the manual edits survive. Clicking "increment" changes React's own output for the count, so React writes `1`, overwriting the `99`. The label is never corrected, because as far as React knows it never changed. This is why code outside React must not modify DOM nodes React owns: the two will silently disagree.

## Why React works this way

Describing UI as data and diffing it gives React four practical advantages.

**Declarative code.** You write one function from state to UI, covering every case. You never write transition code like "if the list had 3 items and now has 4, append one". This removes an entire category of bugs where the screen falls out of sync with the data. See [[b4-declarative-vs-imperative]].

**Batched, minimal DOM writes.** Because React has the whole new description before touching the DOM, it can apply all changes in one commit, after all updates from an event have been processed. Code that interleaves DOM reads and writes can force the browser to recalculate layout repeatedly ([[b3-layout-thrashing]]); React's render-then-commit structure avoids that by design.

**State preserved across updates.** Because React knows which description matches which existing DOM node and component instance, it can keep focus, scroll position, input contents and component state while changing everything around them.

**One component model, many targets.** Elements describe UI abstractly; `type: 'div'` only means something to a particular renderer. React DOM turns elements into browser DOM nodes; React Native turns them into native iOS and Android views; other renderers target terminals (Ink), 3D scenes (react-three-fiber) or PDF documents. The component and reconciliation logic are shared; only the commit step differs. This is why `react` and `react-dom` are separate packages ([[b4-react-dom]]).

The approach also makes rendering **interruptible**. Because the description lives in memory and the DOM is changed only at commit, React can work on a new description, pause, and throw it away if something more urgent arrives, without the user ever seeing a half-finished screen. That is the basis of concurrent rendering ([[b4-concurrent-rendering]]).

## Is the virtual DOM faster than the real DOM?

No — and saying so is a common interview trap. The virtual DOM adds work: React must call your components, allocate element objects, and compare them with the previous ones *before* making the same DOM changes a careful programmer would make directly. For any single, known update — "set this span's text to 3" — direct DOM code is faster, because it skips all of that.

What the virtual DOM provides is **good-enough performance without hand-optimising every update**. The DOM operations React performs are close to minimal, the extra JavaScript work is usually small, and you get it while writing simple declarative code. The realistic comparison is not "React vs perfect hand-written DOM code" but "React vs the imperative code a team would actually maintain" — which tends to over-update, rebuild with `innerHTML`, or interleave layout reads and writes.

A useful cost model for one update:

| Step | Cost grows with | Typical size |
|---|---|---|
| Rendering components | Number of components in the re-rendered subtree, and the work each does | Often the dominant cost |
| Diffing elements | Number of elements those components return | Cheap per element |
| DOM mutations | Number of nodes that actually changed | Small when updates are targeted |
| Browser style, layout, paint | What changed and how much of the page it affects | Depends on CSS and DOM size |

The takeaway is that React performance work is mostly about **rendering less** — fewer components, less work per render — rather than about the DOM. See [[b4-performance-model]].

## Virtual DOM vs Shadow DOM

The names are similar; the concepts are unrelated.

| | Virtual DOM | Shadow DOM |
|---|---|---|
| What it is | A library technique: an in-memory UI description that is diffed | A browser standard: a hidden, encapsulated DOM subtree attached to an element |
| Provided by | React (and other libraries) | The browser, as part of Web Components |
| Purpose | Efficient, declarative updates | Style and markup encapsulation |
| Exists in the page? | No — it is JavaScript objects | Yes — real DOM nodes, rendered by the browser |

You can use both together: a React component can render into a shadow root. See [[b3-dom-shadow-dom-intro]].

## Virtual DOM Limitations {#b4-virtual-dom-limitations}

The virtual DOM approach has real costs and blind spots. Knowing them tells you when React needs help — and why other frameworks chose differently.

### Work scales with the size of what re-renders, not with what changed

This is the central limitation. When state changes, React must re-run the component that owns it and, by default, all of its descendants, then compare every element they return — even if the final DOM change is one character of text. A form with 200 fields whose state lives at the top re-renders all 200 field components on every keystroke.

React gives you tools to narrow this: keep state close to where it is used ([[b4-state-colocation]]), pass expensive content as `children`, skip unchanged subtrees with [[b4-react-memo|memo]], or let the React Compiler add memoisation automatically ([[b4-react-compiler-performance]]). But the underlying model remains "re-run and compare", and those tools are things you have to apply.

### Memory overhead

React holds the element tree from each render briefly, plus fibers for every instance — two copies of each fiber that has been updated, because of double buffering ([[b4-fiber-tree]]). For typical apps this is negligible; for screens with tens of thousands of nodes, it adds measurable memory and garbage-collection pressure.

### Very large lists

Rendering 10,000 rows means 10,000 sets of elements, fibers and DOM nodes, and re-rendering the list compares all of them. The virtual DOM cannot make that cheap. The fix is to not render what the user cannot see: list **virtualization** renders only the visible rows ([[b4-virtualization]]), and pagination avoids loading them at all ([[b4-pagination-rendering]]).

### High-frequency updates

Driving an animation, a drag operation or a scroll-linked effect at 60 frames per second through React state means rendering, diffing and committing up to sixty times a second, within a frame budget of about 16 ms ([[b3-frame-budget]]). For simple cases that is fine; for complex trees it drops frames. The usual approach is to keep fast-changing values out of React state: animate with CSS, write to the DOM through a ref inside a `requestAnimationFrame` loop ([[b3-raf]]), or use an animation library that does so.

### Imperative browser features

Some things cannot be described as "what the UI should look like": giving an input focus, scrolling to an element, measuring a node's size, playing a video, selecting text. The virtual DOM has no representation for these actions. You use refs to reach the real DOM node and call browser APIs directly from effects or event handlers ([[b4-refs]], [[b4-measuring-dom]], [[b4-focus-management]]).

### Conflicts with code that changes the DOM directly

As the example above showed, React assumes it is the only thing changing the nodes it renders. Libraries that manipulate the DOM themselves — older jQuery plugins, some chart and map libraries, rich-text editors — and browser extensions or in-browser translation tools that rewrite text nodes can put the DOM out of step with React's records. The symptoms range from stale content to crashes such as `NotFoundError: Failed to execute 'removeChild' on 'Node'` when React tries to remove a node that is no longer where it expects. The standard pattern is to render an empty container element that React never changes, and let the other library own everything inside it, set up and torn down in an effect:

```jsx
function MapView({ center }) {
  const containerRef = useRef(null);
  useEffect(() => {
    const map = createThirdPartyMap(containerRef.current, { center });
    return () => map.destroy();
  }, [center]);
  return <div ref={containerRef} className="map" />;  // React never renders children here
}
```

### The diff is heuristic, not minimal

React's diff assumes a type change means a new subtree and does not track moves between parents. Wrapping a component in a new element, or moving it to another container, remounts it and loses its state; reordering a keyed list can move more nodes than strictly needed ([[b4-diffing]]). Correctness is never affected, but state loss surprises people.

### Startup cost

Before the first render, the browser must download, parse and execute React and React DOM, then build the element and fiber trees for the whole initial UI. For content-heavy pages this delays the first meaningful paint compared with server-sent HTML. Server rendering and React Server Components exist partly to address this ([[b4-ssr]], [[b4-server-components]]).

### Alternatives that avoid a virtual DOM

Other frameworks respond to these limits differently:

| Approach | Example | How updates work | Trade-off |
|---|---|---|---|
| Virtual DOM with runtime diff | React, Preact | Re-run components, diff elements, patch DOM | Simple mental model; work scales with re-rendered subtree |
| Virtual DOM plus compiler hints | Vue 3 | Compiler marks which parts of a template are dynamic, so the diff skips static parts | Less diffing; templates are more constrained than JSX |
| Fine-grained reactivity (signals) | Solid, Svelte 5, Preact Signals | Each piece of state knows exactly which DOM nodes depend on it and updates them directly; components run once | Minimal update work; different mental model with its own pitfalls |

Svelte's author argued in 2018 that the virtual DOM is "pure overhead" — work that a compiler can eliminate by knowing ahead of time which DOM nodes depend on which data. The counter-argument is that React's model — "the UI is a function of state, re-run it" — is simpler to reason about, works with ordinary JavaScript, and enables concurrent rendering. Both positions are defensible; what matters in an interview is being able to explain the trade.

```quiz
Q: What does a React element created by `<UserCard id={7} />` contain?
- [ ] The DOM nodes that UserCard renders
- [ ] The result of calling UserCard with id 7
- [x] An object whose type is the UserCard function and whose props are { id: 7 }
- [ ] A copy of the browser's DOM subtree for the card
> An element is only a description: type, key and props. React has not called UserCard yet; it does that during rendering when it reaches this element. DOM nodes are created later, in the commit phase.

Q: A colleague says "React is fast because the virtual DOM is faster than the real DOM." What is the most accurate response?
- [ ] Correct: JavaScript objects are always faster than DOM nodes, so React beats hand-written DOM code
- [x] The virtual DOM adds work on top of the DOM changes; it gives near-minimal DOM updates with declarative code, but targeted hand-written DOM code is faster for a known update
- [ ] Wrong: React does not use a virtual DOM at all
- [ ] Correct: React skips the browser's layout and paint steps
> React must render components and diff elements before making the same DOM changes a careful programmer would make directly. Its value is getting close-to-minimal updates without writing transition code by hand, not raw speed.

Q: Which problem is the virtual DOM least able to solve on its own?
- [ ] Keeping an input's focus when unrelated text on the page changes
- [ ] Applying all DOM changes from one event at once
- [x] Rendering a 50,000-row table quickly
- [ ] Rendering the same components to iOS and Android views
> React still has to create elements, fibers and DOM nodes for every row, and compare them on each update. Large lists need virtualization or pagination. The other three are things the virtual DOM approach provides directly.
```

## How it works internally

When React renders a component, it calls the function and gets back an element tree. It then walks that tree together with the existing fiber tree ([[b4-fiber-work-loop]]). For each element it either reuses the fiber at that position — copying the new props onto a work-in-progress version — or creates a new fiber; fibers left unmatched are marked for deletion. Host fibers (for `div`, `span` and so on) hold a pointer to their real DOM node in a field called `stateNode`.

Elements are thrown away after they have been reconciled; fibers persist. So the "virtual DOM" that lives across renders is really the fiber tree, while elements are the short-lived messages that tell React what each part of the tree should become. When the work is finished, React commits: it walks the fibers marked with changes and calls DOM methods on their `stateNode`s. For a newly mounted host element, React creates the DOM node during the render phase but only attaches it to the document during commit.

## In real systems

**Debugging with DevTools.** The React DevTools Components tab shows the component tree — the fibers — with each component's props, state and hooks. The browser's Elements tab shows the real DOM. When they disagree with your expectations, compare the two: the component tree explains *why* something rendered, the DOM shows *what* was committed. See [[b4-react-devtools]].

**Integrating non-React widgets.** Maps, charts, code editors and video players often come as imperative libraries. Teams wrap them in a component that renders one empty container and drives the library from effects, exactly as in the `MapView` example.

**Large-data screens.** Admin tables, logs and feeds use virtualization libraries such as TanStack Virtual or react-window, because rendering every row through the virtual DOM is the bottleneck.

**Cross-platform products.** Teams that ship web and mobile apps share component logic, hooks and state management between React DOM and React Native, because both run the same reconciler.

## Trade-offs and alternatives

The virtual DOM is a trade of CPU work for simplicity. You pay for rendering and diffing on every update, and in return you write UI as a pure function of state, get batched near-minimal DOM writes, keep state across updates, and target several platforms. For most applications the overhead is small compared with network and layout costs; it becomes a problem with very large trees, very frequent updates, or a slow first load on weak devices.

Use plain DOM APIs for tiny, isolated widgets where a framework is unnecessary, and for imperative operations inside React via refs. Consider signal-based frameworks when an app is dominated by many small, very frequent updates and you are willing to adopt their model. Within React, reduce render scope before reaching for anything else.

## Common mistakes

> [!MISTAKE] Confusing the virtual DOM with the Shadow DOM
> The virtual DOM is React's in-memory description; the Shadow DOM is a browser feature for encapsulating a subtree's markup and styles. They solve unrelated problems.

**Believing every state change rebuilds the page.** React re-renders components, but commits only the DOM nodes that differ. A re-render with identical output changes nothing in the DOM.

**Believing the virtual DOM prevents unnecessary renders.** It prevents unnecessary *DOM writes*. Components still re-run when their parent renders. Reducing render work is up to you.

**Changing React-owned DOM nodes directly.** Setting `textContent`, adding children or removing nodes that React rendered makes the DOM disagree with React's records. Use state, or give imperative code its own empty container.

**Thinking elements are DOM nodes.** `const el = <div />` gives you a plain object; you cannot call `el.focus()` or measure it. Use a ref to get the DOM node after commit.

**Mutating elements or props.** Elements are immutable descriptions; mutating them (or the props objects inside) breaks React's comparisons. Create new ones.

## Interview perspective

"What is the virtual DOM?" is among the most common React interview questions. A weak answer stops at "a copy of the DOM in memory". A strong answer describes elements as plain objects, explains reconciliation and commit, gives the real reasons for the design, and corrects the speed myth unprompted.

> [!INTERVIEW] What a strong answer sounds like
> "Components return React elements — plain, immutable objects with a type, props and key — describing what the UI should look like. On an update React renders new elements, compares them with its record of the previous render, and applies only the differences to the real DOM in one commit. The point isn't that it's faster than the DOM — direct DOM code is faster for a known change — it's that you get near-minimal updates while writing declarative code, plus things like preserved state, batching, interruptible rendering and multiple renderers."

Questions to prepare:

- **What is the virtual DOM?** An in-memory tree of element objects (and, in modern React, the fiber tree) that React diffs to compute DOM changes.
- **What is the difference between a React element, a component and a DOM node?** Description object; function that produces descriptions; real browser object created in commit.
- **Is the virtual DOM faster than the DOM?** No; it adds work. It is efficient enough and makes updates declarative.
- **Virtual DOM vs Shadow DOM?** Library diffing technique vs browser encapsulation standard.
- **When does the virtual DOM become a bottleneck?** Large re-rendered subtrees, huge lists, very frequent updates; fix with colocation, memoisation, virtualization, refs for animation.
- **How do Svelte or Solid differ?** They track dependencies at a fine grain (signals, or compile-time analysis) and update DOM nodes directly, without re-running components and diffing.

## Practice

1. **Inspect elements.** Log a few JSX expressions in a React project — a DOM element, a component element, a fragment, an element with a `key` — and explain each field you see.
2. **Watch only changes commit.** Build a component that renders a list and a counter. Open DevTools' Elements panel, change the counter, and confirm only the counter's text node flashes.
3. **Break and fix an integration.** Render a list and, in an effect, append a `<li>` to it with `appendChild`. Observe what happens when React later adds or removes items, then fix it by giving the imperative code its own container.
4. **Measure render cost.** Put 2,000 rows in a list whose parent holds a text input's state. Profile typing, then move the input's state into its own component and profile again.

## Quick revision {#quick-revision}

- "Virtual DOM" = React's in-memory description of the UI: short-lived **elements** returned by components, plus long-lived **fibers** that remember the last render.
- A React element is a plain, immutable object: `$$typeof`, `type`, `key`, `props` (children are `props.children`). Frozen in development.
- `$$typeof` is a Symbol (`react.transitional.element` in React 19), so JSON cannot forge elements.
- A component element does not contain the component's output; React calls the component during rendering.
- Update flow: state change → render new elements → reconcile against fibers → commit only the differences to the real DOM.
- React compares with its own previous render, not with the live DOM; external DOM edits are invisible to it.
- Benefits: declarative code, batched near-minimal DOM writes, preserved state, multiple renderers, interruptible rendering.
- Not faster than direct DOM manipulation; it adds rendering and diffing work.
- Limitations: work scales with the re-rendered subtree; memory; huge lists; high-frequency updates; imperative needs (focus, measurement); conflicts with outside DOM mutation; heuristic diff; startup cost.
- Alternatives: Vue (VDOM plus compiler hints), Solid/Svelte 5 (signals, no VDOM diff).
- Not the Shadow DOM.

## Key takeaways {#key-takeaways}

- The virtual DOM is React's practice of describing UI as plain objects and diffing successive descriptions, rather than changing the DOM step by step.
- Elements are cheap, immutable descriptions; fibers are React's persistent records; DOM nodes are only created or changed during commit.
- The design buys declarative code, batched updates, preserved state and multiple render targets — not raw speed over hand-written DOM code.
- Its main cost is that update work grows with the size of the re-rendered subtree, which is why React performance work focuses on rendering less.
- Large lists, rapid animations, imperative browser features and outside DOM mutation are the places where you must step outside the virtual DOM or help it.
