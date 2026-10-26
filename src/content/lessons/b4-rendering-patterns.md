---
summary: Almost every React screen is built from a few rendering patterns — showing different UI depending on conditions, turning arrays into lists, nesting lists inside lists, and rendering nothing at all. You will learn each pattern, what JSX actually does with values like `0`, `false` and `null`, and how each choice affects state, keys and readability.
difficulty: beginner
minutes: 50
objectives:
  - Choose between if statements, the ternary operator, && and lookup objects for conditional rendering, and explain the trade-offs of each
  - Predict what JSX renders for false, null, undefined, true, empty strings, 0 and NaN, and avoid the "stray 0" bug
  - Render lists from arrays with map, including filtering, sorting without mutation, empty states and correct keys
  - Render nested and grouped data, including recursive trees, with keys that are unique among siblings
  - Explain what returning null from a component does and does not do, and when to hide versus unmount
---

## Introduction

Real interfaces are rarely a fixed block of markup. A dashboard shows a spinner while loading, an error if the request fails, and a table once data arrives. A cart shows "Your cart is empty" or a list of items. A comment thread nests replies inside replies. A banner appears only for users who have not verified their email.

In plain HTML you would handle this by adding and removing DOM nodes by hand. In React you express it in the JSX itself: because JSX is JavaScript, you use ordinary JavaScript — `if`, the `? :` operator, `&&`, `array.map` — to decide what a component returns. React then makes the DOM match ([[b4-rendering-lifecycle]]).

This lesson covers the four patterns that cover almost every case: **conditional rendering**, **rendering lists**, **nested lists**, and **rendering null**. They look simple, and the basic versions are. The details are where real bugs live: a stray `0` appearing on the page, a list item keeping another item's state, a form that resets when a banner appears, or a hidden component that keeps running its effects. Each section explains the pattern, the reasoning behind it, and the edge cases.

## Before you start

- **JSX and embedding expressions with `{}`.** See [[b4-jsx]] and [[b4-jsx-expressions]].
- **Props and components.** See [[b4-props]] and [[b4-component-model]].
- **Array methods** `map`, `filter` and `flatMap`. See [[b1-array-map-filter-reduce]] and [[b1-flat-flatmap]].
- **Truthy and falsy values** in JavaScript — `0`, `''`, `null`, `undefined`, `NaN` and `false` are falsy. See [[b1-boolean-conversion]].
- **Keys**, at least the idea that list items need one. The full story is in [[b4-keys]].

## The intuition

Think of a component as a function that answers the question "what should this part of the screen look like right now?" Rendering patterns are just different ways of phrasing the answer: "if the user is logged in, a greeting; otherwise a login button" is a condition; "one row for each order" is a list; "one section per category, each with its products" is a nested list; and "nothing" is a perfectly good answer too.

Because React re-runs the function whenever data changes, you never write the steps to get from one screen to the next — you only describe each possible screen. The only thing you have to keep in mind is that React compares what you return now with what you returned last time, by position and type. That is why the *shape* of your conditions and lists affects whether components keep their state ([[b4-reconciliation]]).

## What JSX renders for each value

Before the patterns, one table that explains most surprises. When a value appears as a child in JSX — `{value}` — React treats it as follows:

| Value | Renders |
|---|---|
| String, e.g. `'hello'` | The text |
| Number, e.g. `42`, `0`, `NaN` | The number as text — including `0` and `NaN` |
| `''` (empty string) | Nothing visible (an empty text) |
| `true`, `false` | Nothing |
| `null`, `undefined` | Nothing |
| React element | That element |
| Array (or other iterable) | Each item, in order |
| Plain object, e.g. `{ name: 'Ada' }` | Error: `Objects are not valid as a React child` |

You can confirm the subtle rows with React's server renderer, which turns elements into an HTML string:

```jsx title="values.jsx"
import { renderToStaticMarkup } from 'react-dom/server';

console.log(renderToStaticMarkup(
  <p>{null}{undefined}{false}{true}{''}{0}{NaN}</p>
));
```

```output
<p>0NaN</p>
```

Everything vanished except `0` and `NaN`, because they are numbers, and numbers are content. That single fact causes the most common conditional-rendering bug, covered next.

## Conditional Rendering {#b4-conditional-rendering}

**Conditional rendering** means returning different JSX depending on some condition — state, props or derived data. React has no special syntax for it: you use JavaScript's own conditionals. The question is which form fits which situation.

### `if` statements and early returns

Outside JSX, you can use a normal `if`. This is the clearest form when whole screens differ, especially for loading and error states:

```jsx
function OrderPage({ order, error }) {
  if (error) {
    return <ErrorMessage error={error} />;
  }
  if (!order) {
    return <Spinner />;
  }
  return <OrderDetails order={order} />;
}
```

Each case reads top to bottom, and the "happy path" at the end does not need to worry about missing data. One rule applies: **all hooks must be called before the first early return**, because hooks must run in the same order on every render ([[b4-rules-of-hooks]]).

You can also assign JSX to a variable and use it later, which helps when only one part of a larger layout varies:

```jsx
let actionButton;
if (user.isAdmin) {
  actionButton = <button>Edit settings</button>;
} else {
  actionButton = <button>Request access</button>;
}
return <header><h1>{team.name}</h1>{actionButton}</header>;
```

### The ternary operator: one of two

Inside JSX you cannot write an `if` statement, because JSX braces accept only expressions. The conditional (ternary) operator `condition ? a : b` is an expression, so it is the standard way to choose between two pieces of inline UI:

```jsx
<button onClick={toggle}>
  {isPlaying ? 'Pause' : 'Play'}
</button>

{cart.length === 0 ? <EmptyCart /> : <CartItems items={cart} />}
```

Ternaries become hard to read when nested (`a ? b : c ? d : e`). When there are more than two cases, use early returns, a lookup object, or a small component instead.

### `&&`: something or nothing

When the alternative is "render nothing", `condition && <Element />` is the common short form:

```jsx
{isOverdue && <span className="badge">Overdue</span>}
```

It works because of how `&&` evaluates in JavaScript: if the left side is falsy, the expression's value *is the left side*; otherwise it is the right side. When `isOverdue` is `false`, the expression is `false`, and React renders nothing for `false`.

The trap is that the expression's value is the left side itself, not a boolean. If the left side is a number that happens to be `0`, the result is `0` — and React renders numbers:

```jsx title="StrayZero.jsx"
import { renderToStaticMarkup } from 'react-dom/server';

function Inbox({ unread }) {
  return (
    <p>
      {unread.length && <b>{unread.length} new</b>}
      {unread.length > 0 && <b>{unread.length} new</b>}
    </p>
  );
}

console.log(renderToStaticMarkup(<Inbox unread={[]} />));
console.log(renderToStaticMarkup(<Inbox unread={['hi', 'yo']} />));
```

```output
<p>0</p>
<p><b>2 new</b><b>2 new</b></p>
```

With an empty inbox, the first line puts a lone `0` on the page; the second renders nothing. With two messages, both lines behave the same, which is why the bug often survives testing. **Make the left side of `&&` a real boolean**: compare (`count > 0`), or convert (`Boolean(count)`, `!!count`). The same applies to `NaN`, which can appear after a failed numeric calculation.

### `||` and `??`: fallbacks

To show a value or a fallback, use `??` (nullish coalescing) or `||`:

```jsx
<p>{user.nickname ?? user.fullName}</p>
<p>Bio: {user.bio || 'No bio yet'}</p>
```

`??` falls back only for `null` and `undefined`; `||` falls back for every falsy value, including `''` and `0`. Choose deliberately: for a score of `0`, `score ?? '—'` shows `0`, while `score || '—'` shows the dash.

### Lookup objects for many cases

When a value selects among several options, an object (or `Map`) is often clearer than a chain of conditions:

```jsx
const STATUS_BADGE = {
  pending: <Badge tone="grey">Pending</Badge>,
  shipped: <Badge tone="blue">Shipped</Badge>,
  delivered: <Badge tone="green">Delivered</Badge>,
};

function OrderStatus({ status }) {
  return STATUS_BADGE[status] ?? <Badge tone="red">Unknown</Badge>;
}
```

The same idea works for components: `const icons = { info: InfoIcon, warning: WarningIcon }; const Icon = icons[level]; return <Icon />;`. The variable holding a component must start with a capital letter, or JSX treats it as an HTML tag name.

### Conditional attributes and classes

Conditions apply to props as well as children. Pass `undefined` to omit an attribute entirely, and compute class names with a ternary or a template string:

```jsx
<button
  disabled={!form.isValid}
  aria-busy={isSaving}
  className={isPrimary ? 'btn btn-primary' : 'btn'}
  title={tooltip ?? undefined}
>
  Save
</button>
```

### Conditions decide identity: keep positions stable

Each form of conditional rendering also tells React *which* component is at each position, and React keeps state only for the same type at the same position ([[b4-component-identity]]). Two practical rules follow.

First, `{condition && <A />}` keeps its slot when false, so siblings after it do not shift. This keeps the form's state when the banner toggles:

```jsx
<div>
  {showBanner && <Banner />}
  <SignupForm />
</div>
```

Second, if two branches of a ternary render the *same* component type, React treats them as one instance and keeps its state. `{isEditing ? <Field mode="edit" /> : <Field mode="view" />}` is one `Field` whose prop changes. Give the branches different `key`s if they should start fresh ([[b4-keys]]).

### Unmounting versus hiding

Conditionally rendering a component *unmounts* it when the condition is false: its state is destroyed, its effects are cleaned up, and its DOM is removed. Showing it again mounts a fresh instance. That is usually what you want — a closed modal should forget its half-filled form.

Sometimes you want the opposite: switching tabs should not lose what the user typed or the scroll position. Then keep the component mounted and hide it — with the `hidden` attribute, a CSS class, or, in React 19.2 and later, the `<Activity mode="hidden">` component, which hides a subtree while preserving its state. Hidden components still cost memory, and with CSS hiding they still render on updates, so use this for a few heavy panels, not hundreds of items.

```quiz
Q: What does `{items.length && <List items={items} />}` render when `items` is an empty array?
- [ ] Nothing
- [x] The text 0
- [ ] An empty List component
- [ ] It throws an error
> `items.length` is 0, which is falsy, so `&&` returns its left side: the number 0. React renders numbers as text, so a stray "0" appears. Write `items.length > 0 && …` so the left side is a boolean.
```

## Rendering Lists {#b4-rendering-lists}

**Rendering a list** means turning an array of data into an array of elements. React renders an array child by rendering each element in order, so the standard pattern is `array.map` inside JSX:

```jsx
function ContactList({ contacts }) {
  return (
    <ul>
      {contacts.map((contact) => (
        <li key={contact.id}>
          {contact.name} — {contact.email}
        </li>
      ))}
    </ul>
  );
}
```

`map` returns a new array of `<li>` elements, and React renders them as children of the `<ul>`. Three details matter.

**Each item needs a `key`.** The key must identify the *item*, not its position — usually an ID from the data — and be unique among its siblings. React uses it to match items between renders, so state and DOM stay with the right item when the list changes. Index keys cause real bugs when lists are reordered or filtered; [[b4-stable-keys]] and [[b4-index-key-danger]] explain both in depth. In development, React warns `Each child in a list should have a unique "key" prop.` when keys are missing.

**The key goes on the outermost element returned from `map`.** If you extract the row into a component, the key goes on the component, not inside it:

```jsx
{contacts.map((contact) => (
  <ContactRow key={contact.id} contact={contact} />
))}
```

**The callback must return the element.** An arrow function with parentheses returns its body; one with braces needs an explicit `return`. Forgetting it renders nothing, silently:

```jsx
{contacts.map((c) => { <li key={c.id}>{c.name}</li>; })}        // returns undefined: renders nothing
{contacts.map((c) => { return <li key={c.id}>{c.name}</li>; })} // correct
{contacts.map((c) => <li key={c.id}>{c.name}</li>)}             // correct
```

### Filtering, sorting and transforming

Prepare the array with ordinary array methods before (or while) mapping. Do this during render; it is derived data, so it does not need its own state or an effect ([[b4-derived-state]]).

```jsx
function ProductList({ products, maxPrice, sortBy }) {
  const visible = products
    .filter((p) => p.price <= maxPrice)
    .toSorted((a, b) => a[sortBy] < b[sortBy] ? -1 : a[sortBy] > b[sortBy] ? 1 : 0);

  return (
    <ul>
      {visible.map((p) => (
        <li key={p.id}>{p.name}: ${p.price}</li>
      ))}
    </ul>
  );
}
```

`toSorted` (ES2023) returns a sorted copy. Do not call `products.sort(...)` on a prop or state array: `sort` mutates the array in place, which changes data React is holding from the previous render. Use `toSorted`, or copy first with `[...products].sort(...)` ([[b4-update-state-arrays]]). `filter` and `map` always return new arrays, so they are safe.

If filtering or sorting a very large array is measurably slow, wrap the computation in `useMemo` ([[b4-usememo]]).

### Empty, loading and error states

A list component should decide what to show when there is nothing to list. `map` over an empty array returns an empty array, which renders nothing — often leaving a confusing blank space. Make the empty case explicit:

```jsx
if (orders.length === 0) {
  return <p className="empty">No orders yet. Your purchases will appear here.</p>;
}
return <ul>{orders.map((o) => <OrderRow key={o.id} order={o} />)}</ul>;
```

Distinguish "still loading" (often `null` or a `status` field) from "loaded and empty" (`[]`): treating both as empty shows "No orders" for a split second before the data arrives. See [[b4-loading-states]].

### Things you cannot render directly

Objects are not renderable; render their fields. `{user}` throws `Objects are not valid as a React child`; `{user.name}` works. Dates must be formatted first (`date.toLocaleDateString()`). Arrays of primitives render as concatenated text — `{[1, 2, 3]}` renders `123` — which is rarely what you want; map them to elements.

### Large lists

Rendering thousands of rows is slow, because each one becomes elements, component calls and DOM nodes. Paginate or virtualize long lists so only the visible rows are rendered ([[b4-virtualization]]).

## Nested Lists {#b4-nested-lists}

**Nested lists** are lists inside lists: categories containing products, days containing appointments, threads containing comments. In React you render them by mapping inside a map, giving each level its own keys.

```jsx title="Menu.jsx"
import { renderToStaticMarkup } from 'react-dom/server';

const menu = [
  { id: 'starters', name: 'Starters', dishes: [{ id: 1, name: 'Soup' }, { id: 2, name: 'Salad' }] },
  { id: 'mains', name: 'Mains', dishes: [{ id: 1, name: 'Risotto' }] },
];

function Menu({ sections }) {
  return (
    <div>
      {sections.map((section) => (
        <section key={section.id}>
          <h3>{section.name}</h3>
          <ul>
            {section.dishes.map((dish) => (
              <li key={dish.id}>{dish.name}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

console.log(renderToStaticMarkup(<Menu sections={menu} />));
```

```output
<div><section><h3>Starters</h3><ul><li>Soup</li><li>Salad</li></ul></section><section><h3>Mains</h3><ul><li>Risotto</li></ul></section></div>
```

Notice that `Soup` and `Risotto` both have `id: 1`, and that is fine. Keys only need to be **unique among siblings**: the dishes in each `<ul>` are a separate list of siblings, so React never compares a starter's key with a main's key. The outer list is keyed by section ID, the inner lists by dish ID.

### Extract the inner level into a component

Two nested `map`s in one component are readable; three are not. Extracting each level into its own component gives every level a name, its own props, and its own place to hold state, and keeps keys obvious:

```jsx
function Menu({ sections }) {
  return sections.map((section) => (
    <MenuSection key={section.id} section={section} />
  ));
}

function MenuSection({ section }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <section>
      <h3 onClick={() => setCollapsed(!collapsed)}>{section.name}</h3>
      {!collapsed && (
        <ul>
          {section.dishes.map((dish) => <li key={dish.id}>{dish.name}</li>)}
        </ul>
      )}
    </section>
  );
}
```

Each `MenuSection` now has its own `collapsed` state, and because sections are keyed by ID, the collapsed state stays with the right section if the menu is reordered. A component can return an array, as `Menu` does here; React renders it like any other array child.

### Flattening groups into one list

Some layouts need groups flattened into a single run of siblings — a definition list with a `<dt>` per section followed by `<dd>`s for its items, or a table with group header rows. There are two ways to do it, and they have different key rules.

With a keyed `Fragment` per group, each group's items stay in their own nested array, so item keys need only be unique within the group:

```jsx
import { Fragment } from 'react';

<dl>
  {sections.map((section) => (
    <Fragment key={section.id}>
      <dt>{section.name}</dt>
      {section.dishes.map((dish) => <dd key={dish.id}>{dish.name}</dd>)}
    </Fragment>
  ))}
</dl>
```

With `flatMap`, everything ends up in *one* array of siblings, so keys must be unique across all groups. Dish ID `1` appears in two sections, so combine it with the section ID:

```jsx title="FlatMenu.jsx"
import { renderToStaticMarkup } from 'react-dom/server';

const menu = [
  { id: 'starters', name: 'Starters', dishes: [{ id: 1, name: 'Soup' }, { id: 2, name: 'Salad' }] },
  { id: 'mains', name: 'Mains', dishes: [{ id: 1, name: 'Risotto' }] },
];

function FlatMenu({ sections }) {
  return (
    <dl>
      {sections.flatMap((section) => [
        <dt key={`section-${section.id}`}>{section.name}</dt>,
        ...section.dishes.map((dish) => (
          <dd key={`${section.id}-${dish.id}`}>{dish.name}</dd>
        )),
      ])}
    </dl>
  );
}

console.log(renderToStaticMarkup(<FlatMenu sections={menu} />));
```

```output
<dl><dt>Starters</dt><dd>Soup</dd><dd>Salad</dd><dt>Mains</dt><dd>Risotto</dd></dl>
```

Using `key={dish.id}` alone here would give two siblings the key `1`, and React would warn about duplicate keys in the browser.

### Recursive data: trees of any depth

Comment threads, file explorers, org charts and nested menus have no fixed depth. Render them with a **recursive component** — one that renders itself for each child:

```jsx title="FileTree.jsx"
import { renderToStaticMarkup } from 'react-dom/server';

const files = {
  name: 'src',
  children: [
    { name: 'App.jsx' },
    { name: 'components', children: [{ name: 'Button.jsx' }, { name: 'Card.jsx' }] },
  ],
};

function FileTree({ node }) {
  return (
    <li>
      {node.name}
      {node.children && (
        <ul>
          {node.children.map((child) => (
            <FileTree key={child.name} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

console.log(renderToStaticMarkup(<ul><FileTree node={files} /></ul>));
```

```output
<ul><li>src<ul><li>App.jsx</li><li>components<ul><li>Button.jsx</li><li>Card.jsx</li></ul></li></ul></li></ul>
```

The base case is a node without `children`, which renders just its name. File names are unique within a folder, so they work as keys among siblings; for comments, use comment IDs. Very deep or very large trees should render children lazily (only when a node is expanded), both for speed and to keep the DOM small.

> [!TIP] Shape the data before rendering
> If the API returns a flat array (`[{ id, parentId, … }]`), build the nested structure once — grouping by `parentId` with `Map` or `Object.groupBy` (ES2024) — before rendering. Searching the whole array inside every nested `map` turns rendering into O(n²) work.

## Rendering null {#b4-rendering-null}

**Rendering null** means a component returns `null` to show nothing on the screen. It is how a component says "there is nothing for me to display right now", and it is the right tool when the decision belongs inside the component.

```jsx
function SaleBanner({ sale }) {
  if (!sale || sale.endsAt < Date.now()) {
    return null;
  }
  return <aside className="banner">{sale.title}: {sale.discount}% off</aside>;
}
```

The parent can render `<SaleBanner sale={currentSale} />` unconditionally; the banner decides for itself whether it appears. The same works for warnings that only apply to some users, permission-gated buttons, and empty decorations.

React 18 and later also accept `undefined` as a return value (earlier versions threw an error), and `false` renders nothing as well. Prefer an explicit `return null`: it tells the reader that "nothing" is intended rather than a forgotten `return`.

### Returning null does not unmount the component

This is the key fact about rendering null, and the one that surprises people. A component that returns `null` is still **mounted**: React still calls it on every render, its state is kept, and its effects still run. Only its output is empty.

```jsx title="Notice.jsx"
import { useState, useEffect } from 'react';

function Notice({ show }) {
  const [count] = useState(5);

  useEffect(() => {
    console.log(`Notice effect ran, count = ${count}`);
  }, [count]);

  if (!show) return null;
  return <em>{count}</em>;
}
```

Render `<Notice show={false} />`, then change it to `<Notice show={true} />`:

```output
Notice effect ran, count = 5
```

The effect ran on mount even though nothing was displayed, and when `show` became `true` the component appeared with the state it had been holding all along — `5`. It was never unmounted. Contrast this with the parent writing `{show && <Notice />}`: then `Notice` is genuinely unmounted while hidden, its effects do not run, its state is discarded, and showing it again mounts a new instance.

| | Component returns `null` | Parent renders `{cond && <Child />}` |
|---|---|---|
| Child function called? | Yes, every render | No, while hidden |
| State | Kept | Destroyed; fresh on next show |
| Effects | Keep running (and re-run on dependency changes) | Cleaned up; set up again on next show |
| DOM | None | None |
| Who decides | The child | The parent |

So the choice is not cosmetic. If a hidden component should stop subscribing, polling or listening, it must be unmounted — put the condition in the parent. If the component should keep its state while invisible, returning `null` (or hiding with CSS) keeps it.

### Hooks come before `return null`

A component that returns early must call all its hooks first. This is broken:

```jsx
function Profile({ user }) {
  if (!user) return null;
  const [tab, setTab] = useState('posts');  // called only on some renders
  // ...
}
```

When `user` goes from missing to present, the number of hooks changes between renders, and React throws `Rendered more hooks than during the previous render.` Move every hook above the early return ([[b4-rules-of-hooks]]).

### Class components

A class component's `render` method can return `null` too. As with function components, the instance stays mounted, and lifecycle methods such as `componentDidUpdate` still run.

## How it works internally

All four patterns produce the same thing: a tree of elements in which some positions hold `null`, `false` or arrays. During reconciliation ([[b4-reconciliation]]), React treats each child slot by position. A slot that holds `false` or `null` is an empty slot — nothing is created for it — but it still occupies its index, which is why `{cond && <A />}` does not shift later siblings. An array child is reconciled as a keyed list in its own right: React matches its items by key within that array only, which is why keys are scoped to siblings and why each nested `map` needs keys only unique within itself.

A component returning `null` still has a fiber ([[b4-fiber-tree]]) with its hooks and effects; it simply has no child fibers. A component removed by its parent's condition has its fiber deleted, which is what destroys its state and runs its cleanups.

## Worked example: a task board

This board combines every pattern: an early return while loading, a list of columns, a nested list of tasks per column, a ternary for empty columns, conditional text and a conditional class.

```jsx title="Board.jsx"
import { renderToStaticMarkup } from 'react-dom/server';

const STATUS_LABELS = { todo: 'To do', doing: 'In progress', done: 'Done' };

function TaskItem({ task }) {
  return (
    <li className={task.urgent ? 'urgent' : undefined}>
      {task.title}
      {task.assignee ? ` (${task.assignee})` : ' (unassigned)'}
    </li>
  );
}

function Column({ status, tasks }) {
  return (
    <section>
      <h2>{STATUS_LABELS[status]}</h2>
      {tasks.length === 0 ? (
        <p>Nothing here</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      )}
    </section>
  );
}

function Board({ tasks, showDone }) {
  if (tasks === null) return <p>Loading…</p>;

  const statuses = showDone ? ['todo', 'doing', 'done'] : ['todo', 'doing'];
  return (
    <main>
      {statuses.map((status) => (
        <Column
          key={status}
          status={status}
          tasks={tasks.filter((t) => t.status === status)}
        />
      ))}
    </main>
  );
}

const tasks = [
  { id: 't1', title: 'Write spec', status: 'done', assignee: 'Mia' },
  { id: 't2', title: 'Fix login bug', status: 'doing', assignee: 'Raj', urgent: true },
  { id: 't3', title: 'Update docs', status: 'doing' },
];

console.log(renderToStaticMarkup(<Board tasks={null} showDone={false} />));
console.log(renderToStaticMarkup(<Board tasks={tasks} showDone={false} />));
```

```output
<p>Loading…</p>
<main><section><h2>To do</h2><p>Nothing here</p></section><section><h2>In progress</h2><ul><li class="urgent">Fix login bug (Raj)</li><li>Update docs (unassigned)</li></ul></section></main>
```

Walk through the decisions:

- **`tasks === null`** means "not loaded yet" and gets an early return. An empty array would mean "loaded, no tasks" and still show the columns — the two cases are deliberately different.
- **The columns list** is keyed by status string, which is unique and stable. `showDone` is `false`, so the Done column is not rendered at all and `Write spec` never appears.
- **Each column** filters the tasks during render — derived data, no extra state — and uses a ternary to choose between an empty message and the nested list.
- **Each task** is keyed by its ID. `className={task.urgent ? 'urgent' : undefined}` adds the class only for urgent tasks; for the others, `undefined` means no `class` attribute at all, as the output shows. The assignee text uses a ternary with a fallback.

If a task moves from "In progress" to "Done", its `TaskItem` moves to a different column — a different parent — so React unmounts it in one column and mounts it in the other. Any local state in `TaskItem` (such as an "expanded" flag) would reset. If that matters, lift the state up into the board, keyed by task ID.

## In real systems

**Data-driven screens.** Every page that fetches data follows the loading → error → empty → content pattern. Libraries such as TanStack Query return `isPending`, `isError` and `data` precisely so components can branch on them with early returns.

**Feature flags and permissions.** Components like `<RequirePermission role="admin">` or `<FeatureFlag name="new-checkout">` render their children or `null`. Because returning `null` keeps the component mounted, gates that must stop work (such as polling) should be implemented by not rendering the child at all.

**Tables and grouped lists.** Admin tables group rows under header rows (`flatMap` with composite keys or keyed fragments); calendars nest days inside weeks; e-commerce pages nest products in categories.

**Trees.** File explorers, threaded comments and nested navigation menus use recursive components, usually with lazy loading of children for large trees.

## Trade-offs and alternatives

| Pattern | Best for | Watch out for |
|---|---|---|
| Early `return` | Whole-component alternatives: loading, error, empty | Hooks must come first |
| Ternary `a ? b : c` | Two inline alternatives | Nesting quickly becomes unreadable |
| `cond && <X />` | Show-or-nothing | Numbers on the left (`0`, `NaN`) render |
| `??` / `\|\|` | Fallback values | `\|\|` also replaces `0` and `''` |
| Lookup object | Many cases keyed by a value | Missing keys need a default |
| Return `null` in child | Child decides its own visibility | Child stays mounted; effects keep running |
| Condition in parent | Parent decides; hidden child should stop work | State is lost when hidden |
| CSS / `hidden` / `<Activity>` | Keep state of hidden panels (tabs) | Hidden content still costs memory |

## Common mistakes

> [!MISTAKE] The stray 0
> `{count && <Badge count={count} />}` renders `0` when `count` is zero, because `&&` returns the falsy number and React renders numbers. Use `count > 0 && …` so the left side is a boolean.

**Missing or index keys in lists.** Missing keys trigger a warning; index keys hide it but misplace state when the list is sorted, filtered or prepended. Use IDs from the data ([[b4-stable-keys]]).

**Forgetting `return` in a `map` callback with braces.** The callback returns `undefined` and nothing renders, with no error.

**Mutating while preparing a list.** `items.sort()` or `items.reverse()` mutates props or state in place. Use `toSorted`, `toReversed` or a copy.

**Treating "loading" and "empty" the same.** Showing "No results" before the data arrives misleads users. Represent "not loaded" separately from `[]`.

**Expecting `return null` to stop effects.** The component is still mounted. Move the condition to the parent if the hidden component must stop working.

**Hooks after an early return.** The hook count changes between renders and React throws. Call all hooks before any `return`.

**Rendering an object.** `{user}` throws. Render specific fields or format the value.

**Changing structure in branches.** Returning `<div><Banner /><Form /></div>` in one branch and `<div><Form /></div>` in another moves `Form` to a different position, resetting it. Use `{showBanner && <Banner />}` so positions stay stable.

## Interview perspective

These patterns appear in nearly every React coding exercise, and interviewers watch for the classic bugs. Talking through *why* you choose a pattern is a strong signal.

> [!INTERVIEW] What a strong answer sounds like
> "For loading and error states I use early returns. Inline, I use a ternary for two options and `&&` for show-or-nothing, making sure the left side is a boolean so a `0` doesn't render. Lists use `map` with a stable ID as the key on the outermost element. Returning `null` renders nothing but keeps the component mounted with its state and effects; if I want it unmounted, the parent shouldn't render it."

Questions to prepare:

- **What are the ways to render conditionally in React?** `if`/early return, variables, ternary, `&&`, `??`/`||`, lookup objects, separate components.
- **Why does `{list.length && <List />}` sometimes show 0?** `&&` returns the left operand when falsy; `0` is a number and React renders it.
- **What do `true`, `false`, `null` and `undefined` render?** Nothing.
- **Why do lists need keys, and where do they go?** To match items across renders; on the outermost element returned from `map`.
- **Do keys in nested lists need to be globally unique?** No, only among siblings; flattening into one array changes who the siblings are.
- **What is the difference between returning `null` and not rendering a component?** Returning `null` keeps it mounted (state and effects alive); not rendering it unmounts it.
- **How would you render a comment thread of arbitrary depth?** A recursive component that renders itself for each reply, keyed by comment ID.

## Practice

1. **Find the bug.** A notification bell renders `{notifications.length && <Count n={notifications.length} />}`. Explain what users see with no notifications and fix it two different ways.
2. **Status page.** Build a component with `status` of `'idle' | 'loading' | 'error' | 'success'`. Implement it with early returns, then with a lookup object, and compare.
3. **Sortable, filterable list.** Render a product list with a price filter and a sort selector. Use `toSorted`, show an empty state, and confirm the original array is never mutated.
4. **Grouped table.** Render transactions grouped by month in one `<tbody>` with a header row per month, first with keyed fragments, then with `flatMap` and composite keys.
5. **Recursive comments.** Render a nested comment thread from a flat array of `{ id, parentId, text }`. Build the tree first, then render it recursively with collapsible replies.
6. **Null versus unmount.** Write a component that polls an API every second in an effect. Show that returning `null` does not stop the polling, and that conditionally rendering it from the parent does.

## Quick revision {#quick-revision}

- Conditional rendering uses plain JavaScript: early `return`, variables, `? :`, `&&`, `??`/`||`, lookup objects.
- JSX renders strings and numbers (including `0` and `NaN`); renders nothing for `true`, `false`, `null`, `undefined`, `''`; throws for plain objects.
- `cond && <X />` returns `cond` when falsy → a numeric `0` appears. Use `count > 0 &&`.
- `??` falls back on `null`/`undefined` only; `||` on any falsy value.
- Hooks before early returns, always.
- `{cond && <A />}` keeps its slot when false, so siblings keep their positions and state.
- Same component type in both ternary branches = one instance (state kept); use different keys to separate.
- Conditional rendering unmounts (state lost); hiding (CSS, `hidden`, React 19.2 `<Activity>`) keeps state.
- Lists: `array.map` returning elements; key on the outermost element; stable ID, unique among siblings.
- Prepare lists during render: `filter`, `map`, `toSorted` (never `sort` on props/state).
- Handle empty and loading states explicitly; "not loaded" ≠ `[]`.
- Nested lists: keys unique per sibling list; extract inner levels into components; `flatMap` merges siblings, so use composite keys; recursive components for trees.
- Returning `null`: renders nothing but the component stays mounted — state kept, effects run. Parent condition unmounts it.

## Key takeaways {#key-takeaways}

- Rendering patterns are ordinary JavaScript inside JSX; choose the form that reads most clearly for the number of cases.
- Know what JSX renders for each value — especially that `0` and `NaN` render — and keep the left side of `&&` boolean.
- Lists are `map` plus a stable key on the outermost element; keys need to be unique only among siblings.
- Nested and recursive data are rendered by nesting maps or components, with keys chosen per sibling list.
- Returning `null` hides a component's output but keeps it mounted; whether a component should be hidden or unmounted is a real design decision about its state and effects.
