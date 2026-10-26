---
summary: Keys are how you tell React which item is which when a list changes, and, more generally, how React decides whether a component is "the same one" as last render. You will learn how React uses keys, how to choose stable ones, exactly why array-index keys corrupt state, and how to use identity on purpose to keep or reset a component's state.
difficulty: intermediate
minutes: 50
objectives:
  - Explain what a key is, how React uses it during reconciliation, and why keys are only unique among siblings
  - Choose a stable key for a list from the data, and recognise unstable choices such as random values
  - Demonstrate and explain the bugs that array-index keys cause when a list is reordered, filtered or prepended
  - Explain component identity as type plus key plus position, and predict when state is preserved or reset
  - Use a key deliberately to reset a component's state when the entity it shows changes
---

## Introduction

Render a list in React without keys and the browser console shows a warning: `Each child in a list should have a unique "key" prop.` Many developers silence it by adding `key={index}` and move on. Usually nothing seems wrong. Then one day someone deletes the first row of a table and the comment they were typing jumps to a different row, or a checked checkbox ends up next to the wrong item. That bug comes straight from the key.

A **key** is a special attribute you give to elements in a list so that React can match each element to the same item across renders. Without that information, React can only match items by their position. Position changes whenever items are inserted, removed or sorted. The data moves, but the state and DOM nodes React keeps for each position stay where they were.

Keys are part of a larger idea called **component identity**: how React decides that the component at some place in the tree is "the same component" as last time, so it should keep its state, or a different one, so its state should be thrown away. Once you understand identity, keys stop being a warning to silence and become a tool. You can use them to keep state when items move, and to reset state on purpose, for example to give each chat contact a fresh message draft.

This lesson builds on [[b4-reconciliation]], which explains the general rules React uses to compare renders. Here the focus is the one rule you control directly.

## Before you start

- **Rendering lists** with `array.map` returning JSX. See [[b4-rendering-lists]] and [[b1-array-map-filter-reduce]].
- **State belongs to a component instance** and survives re-renders. See [[b4-state]].
- **Reconciliation basics**: same type at the same position means update, different type means replace. See [[b4-reconciliation]].
- **Controlled and uncontrolled inputs**, meaning where an input's value is stored. See [[b4-controlled]] and [[b4-uncontrolled]].

## The intuition

Picture a cloakroom. Guests hand in coats and the attendant hangs them on numbered hooks: first guest on hook 1, second on hook 2, and so on. If the attendant remembers coats by hook number, everything works until the first guest leaves early and everyone else shuffles down a hook. Now the coat on hook 1 is handed to the person who used to be second in line. Nobody's coat moved. The people moved, and the attendant was tracking hooks instead of people.

A cloakroom ticket fixes this. The ticket identifies the *guest*, not the hook, so coats go back to the right people however the line changes.

In React, the "coats" are the things attached to each list item: component state, the DOM node with its focus and typed text, running effects. The hook number is the array index. A key from your data is the ticket. Give React a ticket that belongs to the item itself, and the right state follows the right item.

## How React uses keys

When React reconciles a list of children, it needs to pair each new child with an old one. Without keys, it pairs them by index: old child 0 with new child 0, and so on. With keys, it pairs them by key: the new child with key `"b"` is matched with whatever old child had key `"b"`, wherever it was. Then:

- A key that exists in both renders keeps its component instance, state and DOM node. React updates it with the new props and, if its position changed, moves its DOM node.
- A key that is new is mounted from scratch.
- A key that disappeared is unmounted. Its state is destroyed and its effects are cleaned up.

A key is only meaningful **among siblings**. React compares keys within one parent's list of children, never across the whole app, so two different lists can both use `key="1"` without any problem. A few more rules complete the picture:

- **Put the key on the outermost element returned from `map`.** That is the element React sees as the list's child. A key placed on an element inside a child component does nothing for the list.
- **`key` is not a prop.** React takes it out before calling your component. Reading `props.key` gives `undefined`, and in development React logs a warning saying that `key` is not a prop. If the component needs the ID, pass it separately: `<Row key={item.id} id={item.id} />`.
- **Keys are compared as strings.** `key={1}` and `key="1"` are the same key, and React warns about duplicate keys if both appear among siblings.
- **Fragments can have keys** when you need to return several elements per item, but only with the long form `<Fragment key={id}>`. The `<>…</>` shorthand cannot take attributes. See [[b4-react-fragment]].

```jsx
import { Fragment } from 'react';

function Glossary({ terms }) {
  return (
    <dl>
      {terms.map((term) => (
        <Fragment key={term.id}>
          <dt>{term.word}</dt>
          <dd>{term.definition}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

## Stable Keys {#b4-stable-keys}

A **stable key** is a key that stays attached to the same item for as long as the item exists. It does not change when the list is reordered, filtered or added to, and no two siblings share it. Stability is what lets React's matching work. If an item's key changes between renders, React treats it as a different item, and if two items share a key, React cannot tell them apart.

A good key has three properties:

1. **Unique among siblings.** Two children of the same parent never share a key.
2. **Stable across renders.** The same item gets the same key every time, regardless of its position.
3. **Belongs to the item.** It comes from the item's data, not from where the item happens to be in the array or from when the render happened.

### Where good keys come from

**IDs from the data source.** Database rows, API resources and records from a store almost always have a primary key: `user.id`, `order.orderNumber`, `product.sku`. Use it. This is the right answer in the great majority of cases.

```jsx
function OrderList({ orders }) {
  return (
    <ul>
      {orders.map((order) => (
        <OrderRow key={order.id} order={order} />
      ))}
    </ul>
  );
}
```

**IDs generated when the item is created.** Items created on the client, such as a new todo, a row added to a form, or a file picked for upload, may not have a server ID yet. Generate one *once*, at creation, and store it with the item:

```jsx
function addTodo(text) {
  setTodos((todos) => [...todos, { id: crypto.randomUUID(), text, done: false }]);
}
```

The ID is generated in an event handler and saved in state, so it stays the same on every later render. `crypto.randomUUID()` is available in all modern browsers in secure contexts (HTTPS or localhost) and in Node.js. An incrementing counter stored outside the component also works.

**A natural unique value.** If the items are unique strings, such as tag names, country codes or file paths in one folder, the value itself can be the key.

**A composite key.** When uniqueness comes from a combination of fields, join them into one string:

```jsx
<ShiftCell key={`${row.date}|${row.employeeId}`} row={row} />
```

Make sure the combination really is unique, and pick a separator that cannot appear inside the values.

### Unstable keys

These choices look like keys but break the rules:

| Key | Why it fails | Symptom |
|---|---|---|
| `Math.random()` or `crypto.randomUUID()` called during render | A new key every render, so every item is "new" each time | Every item remounts on every render: state reset, inputs lose focus, effects re-run, slow |
| Array index for a list that changes | The key follows the position, not the item | State and DOM attach to the wrong item after insert, delete or sort |
| A value that can repeat, such as `item.name` | Two siblings share a key | Duplicate key warning; items can be duplicated or dropped |
| A field the user can edit, such as `item.title` | Editing changes the key | The item remounts while being edited, and the input loses focus |

The random-key mistake is especially costly because it hides the warning while making things worse. React no longer complains about missing keys, but it destroys and recreates every list item on each render.

### Stable keys and performance

Stable keys also make updates cheaper. When an item is inserted at the top of a keyed list, React creates one new DOM node and inserts it. With index keys, React instead updates the content of every existing item and creates a new one at the end, because each position now holds different data. The worked example in [[b4-diffing]] shows the exact DOM operations for both. With stable keys, a `memo`-wrapped row that did not change can also skip rendering, because its instance and props are matched correctly. See [[b4-react-memo]].

> [!TIP] Let the linter help
> The `react/jsx-key` rule in `eslint-plugin-react` reports missing keys in `map` calls. `react/no-array-index-key` warns about index keys so that each one is a conscious decision.

## Why Array-Index Keys Are Dangerous {#b4-index-key-danger}

Using the array index as a key (`items.map((item, i) => <Row key={i} … />)`) tells React that "the item at position 0" is the same item from render to render, whatever data is there. Index keys behave exactly like having no keys at all. React adds the index for you, and the only difference is that you have hidden the warning. The danger is that **state and DOM stay with the position while the data moves**.

### The bug, step by step

Here is a shopping list in which each row has its own note field. The note is local state inside `Row`.

```jsx title="ShoppingList.jsx"
import { useState } from 'react';

function Row({ label }) {
  const [note, setNote] = useState('');
  return (
    <li>
      {label}{' '}
      <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="note" />
    </li>
  );
}

export default function ShoppingList() {
  const [items, setItems] = useState([
    { id: 'a', label: 'Apples' },
    { id: 'b', label: 'Bread' },
    { id: 'c', label: 'Cheese' },
  ]);

  return (
    <>
      <button onClick={() => setItems(items.slice(1))}>Remove first</button>
      <ul>
        {items.map((item, index) => (
          <Row key={index} label={item.label} />   // the bug: key is the position
        ))}
      </ul>
    </>
  );
}
```

Type "organic" into the note next to Apples, then click "Remove first". This is what the page shows, compared with the same code using `key={item.id}`:

| Step | `key={index}` | `key={item.id}` |
|---|---|---|
| Before | Apples [organic], Bread [ ], Cheese [ ] | Apples [organic], Bread [ ], Cheese [ ] |
| After removing Apples | **Bread [organic]**, Cheese [ ] | Bread [ ], Cheese [ ] |

With index keys, the note "organic" is now attached to Bread. Here is why. Before the click the keys were `0, 1, 2`, holding Apples, Bread and Cheese. After the click the array is `[Bread, Cheese]`, with keys `0, 1`. React matches key 0 with key 0: same type, same key, so it keeps that `Row` instance, including its `note` state of "organic", and gives it the new `label` "Bread". Key 1 is kept and given "Cheese". Key 2 no longer exists, so React unmounts the instance that had been showing Cheese. The Apples row was never removed. React removed the last row and relabelled the others.

With `key={item.id}`, React sees that key `a` disappeared and unmounts exactly that instance. The rows for `b` and `c` keep their own (empty) notes.

### What goes wrong in practice

The same mismatch shows up in many forms, depending on what is attached to each position:

- **Component state** ends up on the wrong row, as above: expanded or collapsed panels, edit mode, local form values.
- **Uncontrolled DOM state** follows the DOM node, not the data. The text typed into an `<input defaultValue=…>`, a checkbox's checked state, focus, text selection and scroll position inside a row all stay at the position.
- **Effects and subscriptions** keep running for the old item. A row that subscribed to `item.id` in an effect with an empty dependency array keeps listening to the old ID after its data changes.
- **Animations** play on the wrong element. Enter and exit transitions run on the last row instead of the one actually added or removed.
- **Performance** gets worse. Prepending one item changes the data at every position, so every row receives new props and re-renders, and every changed text node is rewritten.

The operations that trigger these bugs are exactly the ones real lists support: **inserting anywhere except the end, deleting anywhere except the end, sorting, filtering, and drag-and-drop reordering**.

### When an index key is acceptable

An index key is safe only when all of these hold:

1. The list is never reordered, filtered or inserted into except at the end, or never changes at all.
2. The items have no state of their own: no local component state, no uncontrolled inputs, no effects tied to the item.
3. The items have no stable ID you could use anyway.

A static list of navigation links, the bullet points of a rendered paragraph, or skeleton placeholders during loading all meet this bar. Even then, an ID from the data is no extra effort if one exists, and it stays correct if the list later becomes editable. That is how most index-key bugs are born: a list that was static when written, and became sortable six months later.

```quiz
Q: A table of users uses `key={index}` and each row has a local "selected" checkbox state. The user selects the third row and then sorts the table by name so that this user moves to row 1. What do they see?
- [ ] The checkbox moves to row 1 with the user
- [x] The checkbox stays on row 3, now showing a different user
- [ ] All checkboxes are cleared because sorting remounts the rows
- [ ] React throws an error about changed keys
> With index keys, the instance at position 3 keeps key 2 and its state. Sorting only changes which user's props it receives. The selection belongs to the position, so it now appears next to whichever user sorted into row 3.

Q: Why is `key={Math.random()}` worse than leaving keys out entirely?
- [ ] Random numbers can collide and React will crash
- [x] Every render produces new keys, so React unmounts and remounts every item each time, losing all state and focus
- [ ] Keys must be strings, so numbers are ignored
- [ ] It is not worse; it silences the warning and works the same way
> Without keys, React falls back to matching by index, which at least reuses instances. With a fresh random key every render, no key ever matches the previous render, so every item is treated as new: its state resets, its DOM node is recreated, and an input being typed into loses focus after every keystroke.
```

## Component Identity {#b4-component-identity}

**Component identity** is React's answer to the question "is this the same component as last render?" If the answer is yes, React keeps the instance: its state, refs, effects and DOM nodes. If the answer is no, React unmounts the old one and mounts a new one with fresh state. Keys are one input to that decision. The full rule has three parts.

> React considers a component the same when it has **the same type**, **the same key** (or no key in both renders), at **the same position** under the same parent.

The position counts as part of the identity because React stores state on its internal tree ([[b4-fiber-tree]]), not inside the component function. Your function is just code that React calls. The state belongs to the slot in the tree where React rendered it.

### Same identity, different props: state is kept

```jsx
function Scoreboard({ isPlayerA }) {
  return isPlayerA ? <Counter person="Alice" /> : <Counter person="Bob" />;
}
```

In the source code these look like two separate counters. To React, they are a `Counter` at the same position, with no key, in both cases: one component whose `person` prop changes. Switching players keeps the count, so Bob inherits Alice's score. That is correct behaviour by React's rules, but rarely what was intended.

### Different identity: state is reset

Any of the three parts can change the identity:

```jsx
// Different key: React sees two different counters
return isPlayerA
  ? <Counter key="Alice" person="Alice" />
  : <Counter key="Bob" person="Bob" />;
```

```jsx
// Different type at the same position: always a remount
return isEditing ? <EditForm /> : <Preview />;
```

```jsx
// Different position: the counter moves from child 0 to child 1
return showBanner
  ? <div><Banner /><Counter /></div>
  : <div><Counter /></div>;
```

With keys `"Alice"` and `"Bob"`, each player gets an independent counter that starts at zero whenever it appears. Note that the *hidden* player's state is destroyed, not kept on the side. Coming back to Alice starts her at zero again. A type change always remounts. In the last example, `Counter` is the first child in one branch and the second in the other, so React sees different positions and the counter resets whenever the banner toggles. Writing `{showBanner && <Banner />}<Counter />` instead keeps `Counter` at index 1 in both cases, because `false` still occupies a slot.

### Using a key to reset state on purpose

The most useful application of identity is resetting a component when the thing it shows changes. Imagine a chat app: when you switch contacts, the message draft should clear.

```jsx
function Messenger({ contacts }) {
  const [selectedId, setSelectedId] = useState(contacts[0].id);
  const contact = contacts.find((c) => c.id === selectedId);

  return (
    <div className="messenger">
      <ContactList contacts={contacts} selectedId={selectedId} onSelect={setSelectedId} />
      <Chat key={contact.id} contact={contact} />
    </div>
  );
}

function Chat({ contact }) {
  const [draft, setDraft] = useState('');
  return (
    <section>
      <textarea
        value={draft}
        placeholder={`Message ${contact.name}`}
        onChange={(e) => setDraft(e.target.value)}
      />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

Without the key, `Chat` is the same instance for every contact, and the half-typed message to one person stays in the box when you switch to another, which could end with it being sent to the wrong person. With `key={contact.id}`, each contact gets its own identity. Switching contacts unmounts one `Chat` and mounts a fresh one, so the draft, any other local state, and any effects all start clean.

The alternative is an effect that watches `contact.id` and calls `setDraft('')`. It is worse: the component first renders once with the stale draft, the effect then resets it and causes a second render, and you have to remember to reset every piece of state by hand. The key resets everything at once and never shows a stale frame. See [[b4-resetting-state]] and [[b4-keys-state-reset]].

### Keeping state across identity changes

Sometimes you need the opposite: state that survives even though the component unmounts. There are three standard options.

- **Lift the state up** to a parent that stays mounted, and pass it down as props ([[b4-lifting-state]]). The chat app could keep a map of drafts by contact ID in `Messenger` if drafts should be remembered per contact.
- **Keep the component mounted and hide it**, for example with CSS, so its identity never changes. React 19.2 adds an `<Activity mode="hidden">` component for this purpose. It hides a subtree while keeping its state.
- **Store the state outside React**, in a URL parameter, `localStorage` or a store, and read it back when the component mounts.

### Identity pitfalls

**Components defined inside other components** get a new type on every render, so they remount every time. Define components at module level. This rule is explained in [[b4-diffing]].

**Moving a component to a different parent** is a different position. React does not track moves across parents, so the state is lost, even with the same key. Keys are only compared among siblings.

**Conditional wrappers** change the parent type or the depth. `{isCard ? <Card><Editor /></Card> : <Editor />}` puts `Editor` at a different depth in each branch, so it remounts. Render the wrapper in both cases and change its styling instead.

## How it works internally

During reconciliation, React's child reconciler compares the new elements with the existing child fibers ([[b4-fiber-work-loop]]). For a list, it first walks both sequences in order while the keys line up, updating matching fibers in place. At the first mismatch, it puts the remaining old fibers into a `Map` keyed by their key, using the index for unkeyed ones. Then it goes through the remaining new elements, looking each key up in the map. A hit with the same type reuses that fiber and its state. A miss, or the same key with a different type, creates a new fiber. Anything left in the map is deleted. Reused fibers whose relative order changed are flagged for a DOM move.

Because keys are stored on fibers, a key changing for the same item is indistinguishable from "old item removed, new item added". That is exactly what makes `key` work as a reset switch on a single component. React compares `key` before type, and a mismatch means a new instance. Duplicate keys break the map lookup: React warns `Encountered two children with the same key` in development, and the result can be duplicated or missing children.

## In real systems

**Data tables and feeds.** Sortable, filterable, paginated tables key rows by record ID, so selection, expansion and inline editing stay with the right record. Infinite feeds key by post ID, so prepending new posts does not re-render or remount the existing ones.

**Forms with dynamic fields.** "Add another address" forms give each field group an ID when it is created. Form libraries such as React Hook Form's `useFieldArray` generate and expose an `id` for each entry for this reason, and their docs tell you to use it as the key rather than the index.

**Resetting screens.** Profile editors, document views and detail panels use `key={entityId}` so that switching entities starts with a clean form, clean scroll position and fresh effects.

**Animation libraries.** Libraries that animate items entering and leaving a list rely on keys to tell a moved item from a removed-and-added one. Unstable keys make every item animate in on every render.

## Trade-offs and alternatives

| Choice | Use when | Cost |
|---|---|---|
| ID from the data | Almost always | Needs the data to carry an ID |
| ID generated at creation | Client-created items without server IDs | Must be stored with the item; remember to keep it when saving |
| Index | Static lists with no per-item state | Silent bugs if the list later becomes dynamic |
| Changing a key to reset | A subtree's state should restart when an entity changes | Remounting discards all state and DOM in that subtree, and effects re-run |
| Effect that resets state | Only part of the state should reset | Extra render with stale values, easy to forget a field |

Resetting with a key is cheap for small subtrees, but remounting a large, expensive subtree costs more than updating it. If only one field needs to reset, adjusting it directly (or deriving it) may be better.

## Common mistakes

> [!MISTAKE] Silencing the key warning with the index
> `key={index}` removes the warning but not the problem, because it is exactly what React does when no key is given. Use an ID that belongs to the item. If the data has none, give each item one when it is created.

**Generating keys during render.** `key={crypto.randomUUID()}` inside `map` gives every item a new identity on every render. Generate IDs once and store them.

**Putting the key on the wrong element.** In `items.map((item) => <Row item={item} />)`, the key belongs on `<Row key={item.id} …/>`, not on the `<li>` inside `Row`.

**Expecting `props.key` to work.** React does not pass the key to the component. Pass the ID as a separate prop if the component needs it.

**Using a value that is not unique.** Names, titles and prices repeat. Duplicate keys produce warnings and unpredictable list behaviour.

**Using an editable field as the key.** If the key is `item.title` and the user edits the title, the item remounts mid-edit and the input loses focus.

**Expecting separate state from a ternary.** `{a ? <Panel /> : <Panel />}` is one panel. Give the branches different keys if they should be independent.

## Interview perspective

Keys are a favourite React interview topic because a short question shows whether a candidate understands reconciliation or just avoids warnings.

> [!INTERVIEW] What a strong answer sounds like
> "Keys let React match list items across renders. Without them, React matches by position, so when items are inserted, deleted or sorted, the state and DOM attached to each position end up showing different data. An index key behaves exactly like no key. I use a stable ID from the data, generate one at creation if needed, and never generate keys during render. More generally, React keeps a component's state only if it has the same type, key and position, so changing a key is also the cleanest way to reset a component."

Questions to prepare:

- **Why does React need keys?** To identify siblings across renders, so instances, state and DOM are matched to the right item.
- **Why not use the index?** It ties identity to position, causing misplaced state and wasted updates when the list changes order or contents.
- **When is the index acceptable?** Static lists that never reorder and whose items have no state.
- **Do keys need to be globally unique?** No, only among siblings.
- **What happens when a key changes?** React unmounts the old instance and mounts a new one, resetting all its state and re-running its effects.
- **Is `key` available as a prop?** No; pass the value separately.
- **How do you reset a form when the selected user changes?** `<UserForm key={userId} />` rather than an effect that clears each field.

A common follow-up is *"What happens with duplicate keys?"* React warns, and it may duplicate or drop children, because its key map can hold only one entry per key.

## Practice

1. **Reproduce the bug.** Build the shopping list with index keys, type into a note, delete the first item, and observe the note moving. Switch to ID keys and confirm the fix.
2. **Sort a stateful table.** Add a "selected" checkbox to each row of a user table with a sort button. Show the bug with index keys, then fix it.
3. **Generate IDs correctly.** Build a todo app where new items get an ID at creation. Verify with React DevTools that adding an item at the top does not remount the existing ones.
4. **Reset with a key.** Build the messenger example, first without the key to see the draft leak between contacts, then with it.
5. **Remember drafts instead.** Change the messenger so that each contact's draft is remembered when you switch away and back. Decide where the state must live and why a key alone cannot do it.

## Quick revision {#quick-revision}

- A key identifies an element among its siblings across renders. React matches list children by key, or by index if there are no keys.
- Matched key: instance, state and DOM kept (moved if needed). New key: mounted. Missing key: unmounted.
- Keys are unique among siblings only; put them on the outermost element returned from `map`.
- `key` is not passed as a prop (`props.key` is `undefined`). Keys are compared as strings, so `1` and `"1"` collide.
- Use `<Fragment key={id}>` to key a group of elements; `<>` cannot take a key.
- Stable key = unique, unchanged across renders, belongs to the item. Sources: data IDs, IDs generated at creation, unique natural values, composite keys.
- Never generate keys during render (`Math.random()`, `randomUUID()` in `map`), because everything remounts every render.
- Index keys = no keys. State, uncontrolled input values, focus and effects stay with the position when items are inserted, deleted, sorted or filtered.
- Index is acceptable only for static lists with no per-item state.
- **Identity = type + key + position.** Same identity means state kept; any change means remount with fresh state.
- `key={entity.id}` resets a component when the entity changes, which is better than an effect that clears state.
- To keep state across a remount: lift it up, keep the component mounted (or use `<Activity>` in React 19.2), or store it outside React.

## Key takeaways {#key-takeaways}

- Keys tell React which item is which, so the state and DOM attached to an item follow that item when the list changes.
- A good key comes from the item itself, stays the same for its whole life, and is unique among its siblings.
- Array-index keys tie state to positions, so inserting, deleting or sorting shows one item's state next to another item's data.
- React keeps a component only when its type, key and position match the previous render. Changing any of them gives a fresh instance.
- Changing a key on purpose is the simplest, most complete way to reset a component when the thing it displays changes.
