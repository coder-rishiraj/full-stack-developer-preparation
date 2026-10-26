---
summary: A stack is a collection where the last item added is the first one removed. You will learn why that single rule makes stacks the natural tool for nesting, undoing and deferring work, how to use one correctly in Java, and how to spot stack problems in interviews.
difficulty: beginner
minutes: 40
objectives:
  - Explain last-in, first-out order and trace push, pop and peek on paper
  - Implement a resizable array-backed stack and derive the cost of each operation
  - Use ArrayDeque as a stack in Java and explain why the legacy Stack class is avoided
  - Solve Min Stack and Decode String by deciding exactly what each stack entry must remember
  - Recognise problems where an explicit stack replaces recursion or resolves nested structure
---

## Introduction

Think about the "undo" button in a text editor. You type a word, then bold it, then delete a line. Pressing undo once restores the line — the *most recent* change. Pressing it again removes the bold. The editor must always undo the newest change first, never an old one in the middle. To do that it keeps the changes in a pile where the newest is always on top.

That pile is a **stack**: a collection where you can only add an item to the top, look at the top, or remove the top. The rule that the last item added is the first one removed is called **LIFO (last in, first out)**. It sounds like a restriction, and it is one — but the restriction is exactly what many problems need. Whenever a problem says "the most recent unfinished thing must be finished first", a stack models it directly.

You meet that shape constantly. A bracket that opens last must close first, so checking `{[()]}` is a stack problem. A function that is called last must return first, so the computer runs every program on a **call stack**. Depth-first search goes as deep as possible and backs up to the most recent branching point, which is again "most recent first". Browser history, compiler parsers and expression evaluators all rely on the same structure.

This lesson builds the stack from its definition, shows how it is stored in memory, teaches the Java API you should use, and then works through problems where the hard part is deciding *what to push*. The stack is also the foundation for [[a5-monotonic-stack]], [[a5-next-greater-smaller]] and [[a5-parentheses]], which build directly on what you learn here.

## Before you start

- **Arrays and resizing** — how an array is a fixed block of memory and how a dynamic array grows by copying. See [[a1-arraylist]].
- **Big-O and amortised cost** — what O(1) means and why an occasional expensive step can still average out to O(1). See [[a1-time-complexity]].
- **Recursion** — what happens when a method calls itself. It helps for the section on the call stack. See [[a1-recursion]].

## The intuition

Picture a stack of plates in a cafeteria. Clean plates are put on top, and people take plates from the top. Nobody pulls a plate from the middle. The plate that has waited longest is at the bottom and will be used last.

The analogy captures the access rule, but be careful with one detail: a real pile of plates has no limit you can check, while a programming stack lets you ask whether it is empty and how many items it holds. Those checks matter — popping from an empty stack is the most common stack bug.

Here is the same idea as a sequence of operations. Each row shows the stack after the operation, with the top on the right.

| Operation | Stack (bottom → top) | Returned |
|---|---|---|
| `push(4)` | `[4]` | — |
| `push(9)` | `[4, 9]` | — |
| `peek()` | `[4, 9]` | `9` |
| `push(1)` | `[4, 9, 1]` | — |
| `pop()` | `[4, 9]` | `1` |
| `pop()` | `[4]` | `9` |

Notice that the items come out in the reverse of the order they went in. **Reversal** is one of the three things stacks are good at; the other two are **matching** (pairing each closing item with the most recent opening one) and **deferring** (keeping work aside until something later lets you finish it).

## The stack operations

A stack is an **abstract data type**: it is defined by what operations it offers and how they behave, not by how it is stored. The essential operations are:

- **push(x)** adds `x` on top.
- **pop()** removes the top item and returns it.
- **peek()** (also called `top`) returns the top item without removing it.
- **isEmpty()** and **size()** report how many items there are.

All of these touch only the top, which is why they can each run in O(1) time no matter how many items the stack holds. Nothing else is offered on purpose. If you find yourself needing the fifth item from the top, or searching the stack for a value, a stack is the wrong structure — use a list, a deque or a hash map instead.

### How a stack is stored

There are two common ways to store a stack.

An **array-backed stack** keeps items in an array, with the bottom at index `0` and a counter `size` saying how many slots are used. The top is at index `size - 1`. Push writes into index `size` and increments it; pop decrements `size` and reads that slot. When the array is full, push allocates a larger array (typically double the size) and copies everything across.

A **linked stack** keeps each item in a node that points to the node below it, and remembers only the top node. Push creates a node pointing at the old top; pop moves the top pointer down one node. It never needs to copy, but every item costs an extra object with a pointer, and the nodes are scattered in memory.

In practice array-backed stacks are faster: their items sit next to each other in memory, which the CPU cache handles far better than chasing pointers between separate objects. That is why Java's recommended stack, `ArrayDeque`, is array-backed.

Here is a complete array-backed stack. Writing it once makes the cost of each operation obvious.

```java title="ArrayStack.java"
import java.util.Arrays;
import java.util.NoSuchElementException;

public class ArrayStack<T> {
    private Object[] items = new Object[2];   // tiny on purpose, to show growth
    private int size = 0;                     // also the index of the next free slot

    public void push(T x) {
        if (size == items.length) {
            items = Arrays.copyOf(items, items.length * 2);  // double when full
        }
        items[size++] = x;
    }

    @SuppressWarnings("unchecked")
    public T pop() {
        if (size == 0) throw new NoSuchElementException("stack is empty");
        T top = (T) items[--size];
        items[size] = null;                   // let the garbage collector reclaim it
        return top;
    }

    @SuppressWarnings("unchecked")
    public T peek() {
        if (size == 0) throw new NoSuchElementException("stack is empty");
        return (T) items[size - 1];
    }

    public boolean isEmpty() { return size == 0; }

    public static void main(String[] args) {
        ArrayStack<Integer> s = new ArrayStack<>();
        for (int i = 1; i <= 5; i++) {
            s.push(i);
            System.out.println("push " + i + " -> capacity " + s.items.length);
        }
        StringBuilder popped = new StringBuilder();
        while (!s.isEmpty()) popped.append(s.pop()).append(' ');
        System.out.println("popped: " + popped.toString().trim());
    }
}
```

```output
push 1 -> capacity 2
push 2 -> capacity 2
push 3 -> capacity 4
push 4 -> capacity 4
push 5 -> capacity 8
popped: 5 4 3 2 1
```

Three details are worth reading closely. `size` does double duty: it is both the count and the index where the next push goes, which keeps push and pop to a single array access each. `pop` sets the vacated slot to `null`; without that line the array would keep a reference to an object the program no longer uses, and the garbage collector could not free it — a small but real memory leak. And `pop` and `peek` throw a clear exception on an empty stack instead of returning a garbage value.

### Why push is O(1) even though it sometimes copies

Most pushes write one slot. A push that finds the array full copies every element, which costs O(n). So is push O(n)? Only occasionally. Count the total work for `n` pushes starting from capacity 1: the copies happen at sizes 1, 2, 4, 8, …, up to `n`, and those copy costs add up to `1 + 2 + 4 + … + n`, which is less than `2n`. Add the `n` ordinary writes and the total is under `3n` for `n` pushes — a constant amount per push on average. This is called **amortised O(1)**: any single push may be slow, but no sequence of pushes is slow on average. Pop and peek are O(1) in the strict sense.

Doubling is what makes this work. If the array grew by a fixed amount, say 10 slots each time, the copies would happen every 10 pushes and cost 10, 20, 30, …, which adds up to O(n²) over `n` pushes.

## Stacks in Java

Java has three candidates, and the choice is a common interview signal.

```java title="StackBasics.java"
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Stack;

public class StackBasics {
    public static void main(String[] args) {
        Deque<String> stack = new ArrayDeque<>();
        stack.push("a");
        stack.push("b");
        stack.push("c");                       // c is now on top

        System.out.println(stack);             // iterates from top to bottom
        System.out.println(stack.peek());      // look at the top, do not remove
        System.out.println(stack.pop());       // remove the top
        System.out.println(stack.pop());
        System.out.println(stack.size());
        System.out.println(stack.pop());
        System.out.println(stack.peek());      // empty: peek returns null
        try {
            stack.pop();                       // empty: pop throws
        } catch (java.util.NoSuchElementException e) {
            System.out.println("pop on empty: " + e.getClass().getSimpleName());
        }

        Stack<String> legacy = new Stack<>();
        legacy.push("a");
        legacy.push("b");
        legacy.push("c");
        System.out.println(legacy);            // iterates from bottom to top
    }
}
```

```output
[c, b, a]
c
c
b
1
a
null
pop on empty: NoSuchElementException
[a, b, c]
```

**Use `ArrayDeque` through the `Deque` interface.** `push`, `pop` and `peek` all work on the front of the deque, which plays the role of the top. It is array-backed, unsynchronised and fast. Note the asymmetry on an empty stack: `peek()` returns `null` while `pop()` throws `NoSuchElementException`. `ArrayDeque` also refuses `null` elements (pushing `null` throws `NullPointerException`), precisely so that a `null` from `peek` can only mean "empty".

**Avoid `java.util.Stack`.** It dates from Java 1.0 and extends `Vector`, so every method is `synchronized` — you pay for locking you almost never need. Worse, because it *is* a `Vector`, it exposes `get(i)`, `add(i, x)` and `remove(i)`, which let code reach into the middle of the "stack" and break the LIFO rule. Its iteration order is also the opposite of `ArrayDeque`'s, as the output shows: printing a `Stack` lists the bottom first. The `Stack` Javadoc itself recommends `Deque` instead.

**`LinkedList` also implements `Deque`** and works as a stack, but each element is a separate node object, so it is slower and uses more memory. Its one advantage is that it accepts `null`.

> [!TIP] Store indices, not values
> When a problem asks for a distance or a width — "how many days until a warmer day?" — push the *index* of each element rather than its value. The value is always available as `a[index]`, but you cannot recover an index from a value.

## The call stack: the stack you already use

Every time a Java method is called, the Java Virtual Machine (JVM) pushes a **stack frame** holding that call's parameters, local variables and the place to return to. When the method returns, its frame is popped and execution continues in the caller. The method that was called last always finishes first — that is LIFO.

Recursion is therefore a stack in disguise. A recursive depth-first search pushes a frame for each node it descends into and pops back when a branch is exhausted. This has a practical consequence: the call stack has a fixed size per thread, so very deep recursion — say, a depth-first search down a path of 100,000 nodes — can throw `StackOverflowError`. The exact depth limit depends on the JVM's thread stack size and the size of each frame, so do not rely on a specific number.

The fix is to manage the stack yourself. An **explicit stack** lives on the heap, which is far larger, and holds exactly the state you choose. Here is depth-first search written both ways on a small graph:

```java title="IterativeDfs.java"
import java.util.*;

public class IterativeDfs {
    static List<List<Integer>> graph = List.of(
        List.of(1, 2),   // 0
        List.of(3),      // 1
        List.of(3, 4),   // 2
        List.of(),       // 3
        List.of()        // 4
    );

    static void recursive(int u, boolean[] seen, List<Integer> order) {
        seen[u] = true;
        order.add(u);
        for (int v : graph.get(u)) if (!seen[v]) recursive(v, seen, order);
    }

    static List<Integer> iterative(int start) {
        List<Integer> order = new ArrayList<>();
        boolean[] seen = new boolean[graph.size()];
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(start);
        while (!stack.isEmpty()) {
            int u = stack.pop();
            if (seen[u]) continue;            // a node can be pushed more than once
            seen[u] = true;
            order.add(u);
            List<Integer> next = graph.get(u);
            // push neighbours in reverse so the first neighbour is popped first
            for (int i = next.size() - 1; i >= 0; i--) {
                if (!seen[next.get(i)]) stack.push(next.get(i));
            }
        }
        return order;
    }

    public static void main(String[] args) {
        List<Integer> rec = new ArrayList<>();
        recursive(0, new boolean[graph.size()], rec);
        System.out.println("recursive: " + rec);
        System.out.println("iterative: " + iterative(0));
    }
}
```

```output
recursive: [0, 1, 3, 2, 4]
iterative: [0, 1, 3, 2, 4]
```

Two lines in the iterative version carry the reasoning. Neighbours are pushed in reverse because the last one pushed is popped first; pushing them in reverse makes the first neighbour come out first, matching the recursive order. And the `if (seen[u]) continue` check is needed because node 3 is pushed twice — once as a neighbour of 1 and once as a neighbour of 2 — before it is visited. Marking nodes when they are popped, and skipping repeats, keeps the visit order identical to recursion. Tree traversals in [[a6-dfs]] use the same conversion.

## Worked example: Min Stack

**Problem.** Design a stack that supports `push`, `pop`, `top` and `getMin` — the smallest value currently in the stack — all in O(1) time.

**Naive approach.** Keep an ordinary stack and, in `getMin`, scan all items. That is O(n) per call. Keeping a single `min` variable fails too: when the minimum is popped, you have no idea what the next-smallest value is without scanning again.

**Deriving the better idea.** The key observation is that a stack only ever changes at the top. So the minimum of the stack, when the top item is `x`, is `min(x, minimum of everything below x)` — and everything below `x` does not change until `x` is popped. If each entry remembers "the minimum of the stack at the moment I was pushed", then after any pop the new top already knows the right answer.

The cleanest way to store that is a second stack that moves in lockstep with the first:

```java title="MinStack.java"
import java.util.ArrayDeque;
import java.util.Deque;

public class MinStack {
    private final Deque<Integer> values = new ArrayDeque<>();
    private final Deque<Integer> mins = new ArrayDeque<>();   // mins.peek() = min of values

    public void push(int x) {
        values.push(x);
        // the new minimum is either x or the minimum of everything below it
        mins.push(mins.isEmpty() ? x : Math.min(x, mins.peek()));
    }

    public void pop() {
        values.pop();
        mins.pop();                            // the two stacks always have equal size
    }

    public int top()    { return values.peek(); }
    public int getMin() { return mins.peek(); }

    public static void main(String[] args) {
        MinStack s = new MinStack();
        s.push(5);
        s.push(3);
        s.push(7);
        s.push(3);
        System.out.println("min = " + s.getMin());
        s.pop();                               // removes the second 3
        System.out.println("min = " + s.getMin());
        s.pop();                               // removes 7
        s.pop();                               // removes the first 3
        System.out.println("min = " + s.getMin() + ", top = " + s.top());
    }
}
```

```output
min = 3
min = 3
min = 5, top = 5
```

Trace the two stacks (top on the right):

| After | `values` | `mins` | `getMin()` |
|---|---|---|---|
| `push(5)` | `[5]` | `[5]` | 5 |
| `push(3)` | `[5, 3]` | `[5, 3]` | 3 |
| `push(7)` | `[5, 3, 7]` | `[5, 3, 3]` | 3 |
| `push(3)` | `[5, 3, 7, 3]` | `[5, 3, 3, 3]` | 3 |
| `pop()` | `[5, 3, 7]` | `[5, 3, 3]` | 3 |
| `pop()`, `pop()` | `[5]` | `[5]` | 5 |

Every operation does a constant number of stack operations, so all four are O(1); the extra space is O(n). The duplicate `3` shows why the naive "track one minimum" idea fails and why this design handles repeats without special cases. An equivalent design stores pairs `(value, minSoFar)` in a single stack. A space-saving variant pushes onto `mins` only when `x <= mins.peek()` and pops from it only when the popped value equals `mins.peek()` — but the `<=` must not be `<`, or popping one of two equal minimums would lose the other.

The general lesson: **each stack entry can carry whatever extra state the problem needs**, as long as that state depends only on the entry and the entries below it.

## Worked example: Decode String

**Problem.** Expand an encoded string where `k[text]` means `text` repeated `k` times. Encodings can nest: `3[a2[c]]` becomes `accaccacc`.

**Why a stack.** When the scan reaches `[`, it cannot finish the outer level yet — it must first decode everything inside, which may contain more brackets. That is "defer until a closing event": on `[`, save the outer level's progress; on `]`, finish the inner level and resume the saved outer one. The most recently opened level is always the next one to close, so the saved levels form a stack.

**What to push.** At each `[` we need to remember two things: the repeat count `k` that applies to the bracket, and the text built so far at the enclosing level. Two stacks hold them.

```java title="DecodeString.java"
import java.util.ArrayDeque;
import java.util.Deque;

public class DecodeString {

    static String decode(String s) {
        Deque<Integer> counts = new ArrayDeque<>();        // repeat count of each open '['
        Deque<StringBuilder> outer = new ArrayDeque<>();   // text built before each '['
        StringBuilder current = new StringBuilder();       // text of the innermost level
        int k = 0;

        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) {
                k = k * 10 + (c - '0');                    // counts can have several digits
            } else if (c == '[') {
                counts.push(k);                            // save this level's state...
                outer.push(current);
                current = new StringBuilder();             // ...and start a fresh level
                k = 0;
            } else if (c == ']') {
                int times = counts.pop();
                StringBuilder parent = outer.pop();
                parent.append(current.toString().repeat(times));
                current = parent;                          // return to the enclosing level
            } else {
                current.append(c);
            }
        }
        return current.toString();
    }

    public static void main(String[] args) {
        System.out.println(decode("3[a]2[bc]"));
        System.out.println(decode("3[a2[c]]"));
        System.out.println(decode("2[abc]3[cd]ef"));
        System.out.println(decode("10[x]"));
    }
}
```

```output
aaabcbc
accaccacc
abcabccdcdcdef
xxxxxxxxxx
```

Dry run on `3[a2[c]]`:

| Char | Action | `counts` | `outer` | `current` |
|---|---|---|---|---|
| `3` | `k = 3` | `[]` | `[]` | `""` |
| `[` | save level | `[3]` | `[""]` | `""` |
| `a` | append | `[3]` | `[""]` | `"a"` |
| `2` | `k = 2` | `[3]` | `[""]` | `"a"` |
| `[` | save level | `[3, 2]` | `["", "a"]` | `""` |
| `c` | append | `[3, 2]` | `["", "a"]` | `"c"` |
| `]` | `"a" + "c"×2` | `[3]` | `[""]` | `"acc"` |
| `]` | `"" + "acc"×3` | `[]` | `[]` | `"accaccacc"` |

Two traps are visible in the code. The count is built digit by digit (`k * 10 + digit`), so `10[x]` works; reading only one character would decode it as `0[x]` after a stray `1`. And `k` is reset to `0` after it is pushed, so the next bracket does not inherit an old count. The running time is governed by the size of the *output*, not the input: a character inside `d` levels of brackets is copied once each time one of those brackets closes, so the work is at most the output length times the nesting depth. The stacks hold one entry per currently open bracket, so their size is the nesting depth.

Decode String is closely related to evaluating expressions, where the saved state is a partial result and an operator instead of a string and a count — see [[a5-expression]].

```quiz
Q: You push 1, 2, 3 onto an empty stack, pop once, then push 4. What does peek() return, and what is the stack from bottom to top?
- [ ] 1; the stack is [1, 2, 4]
- [x] 4; the stack is [1, 2, 4]
- [ ] 3; the stack is [1, 2, 3, 4]
- [ ] 2; the stack is [2, 4]
> The pop removes 3, the most recent push, leaving [1, 2]. Pushing 4 puts it on top, so peek returns 4. Answers that keep 3 forget that pop removed it; answers that return 1 confuse a stack with a queue.

Q: Why does the Min Stack store a second stack of minimums instead of one `min` variable?
- [ ] A variable cannot hold negative numbers
- [x] After the current minimum is popped, a single variable cannot tell you the next-smallest value without scanning
- [ ] Two stacks make push faster than one
- [ ] It is required because ArrayDeque has no getMin method
> The stack changes only at the top, so storing the minimum at every height lets the answer after any pop be read in O(1). A single variable is correct until the minimum is popped, after which recomputing it costs O(n).

Q: In Java, which is the best choice for a stack in new code?
- [ ] java.util.Stack, because its name says what it is
- [ ] LinkedList, because nodes never need resizing
- [x] ArrayDeque used through the Deque interface
- [ ] An int[] with no size counter
> ArrayDeque is array-backed, unsynchronised and does not expose indexed access. Stack extends Vector, so it pays for synchronisation and lets code break LIFO with get(i) and add(i, x). LinkedList works but allocates a node per element.
```

## In real systems

**Undo and redo.** Editors keep an undo stack of changes. Undo pops the latest change, reverses it, and pushes it onto a redo stack; making a new edit clears the redo stack, because the old "future" no longer applies.

**Call stacks and stack traces.** When a Java program throws an exception, the stack trace you read is a print-out of the call stack at that moment, top frame first. Understanding LIFO is what lets you read it: the first line is where the error happened, and each line below is the caller that led there.

**Parsers and compilers.** Compilers check that brackets, `begin`/`end` blocks and XML or HTML tags are properly nested using stacks, and classic expression evaluation uses an operand stack. The Java Virtual Machine itself is a stack machine: bytecode instructions such as `iadd` pop two values from an operand stack and push the result.

**Browser history.** The back button behaves like popping a stack of visited pages; forward uses a second stack, in the same way undo and redo do.

## Trade-offs and alternatives

| Need | Use | Why |
|---|---|---|
| Most recent item first (nesting, undo, DFS) | Stack (`ArrayDeque`) | O(1) access to exactly the item needed |
| Oldest item first (arrival order, BFS) | Queue — see [[a5-queue]] | A stack would process newest first and starve old items |
| Add or remove at both ends | Deque — see [[a5-deque]] | One structure covers both stack and queue access |
| Look up or remove arbitrary items | `HashMap` or `ArrayList` | A stack gives no access below the top |
| Smallest item first | `PriorityQueue` | Orders by value, not by arrival |

Recursion and an explicit stack are interchangeable in power. Recursion is usually shorter and easier to read; an explicit stack avoids `StackOverflowError` on deep inputs and lets you pause, inspect or store the pending work. Choose recursion first for clarity and switch when depth could reach the tens of thousands.

## Common mistakes

> [!MISTAKE] Popping without checking for empty
> In matching problems, a closing bracket with nothing on the stack means the input is invalid. Calling `pop()` on an empty `ArrayDeque` throws `NoSuchElementException` (and `Stack.pop()` throws `EmptyStackException`). Check `isEmpty()` first and treat that case as an answer, not a crash.

**Forgetting the leftovers.** After the scan ends, items still on the stack are unfinished work: unmatched opening brackets, or elements that never found an answer. Validation problems must return `stack.isEmpty()`, not `true`.

**Pushing values when indices were needed.** If the answer involves distances, widths or positions, push indices. Pushing values loses that information, and with duplicate values you cannot recover it.

**Mixing up `peek` and `pop`.** `peek` leaves the item in place. Using `peek` where the algorithm needed `pop` creates an infinite loop in `while` conditions that test the top.

**Using `Stack`'s indexed methods.** Code that calls `stack.get(0)` on a `java.util.Stack` is no longer using a stack. If you need the bottom element, rethink the data structure.

## Interview perspective

Stack questions test whether you recognise the LIFO shape and whether you can decide what each stack entry must store. Say both out loud.

> [!INTERVIEW] How to talk about a stack solution
> "The most recently opened bracket must be closed first, so I'll keep unmatched openers on a stack. Each character is pushed at most once and popped at most once, so the scan is O(n) time and O(n) space in the worst case, when everything is an opener."

Questions you should be ready for:

- **Valid Parentheses** — push openers, match on closers, return whether the stack is empty. Taught fully in [[a5-parentheses]].
- **Min Stack** — store the minimum at each height. Follow-up: can you use less memory? Push to the minimum stack only on `x <= currentMin`.
- **Evaluate Reverse Polish Notation** — push numbers; an operator pops two and pushes the result. The second value popped is the *left* operand. See [[a5-expression]].
- **Decode String** — save the count and the outer text on `[`, combine on `]`.
- **Implement a queue using stacks** — two stacks, one for input and one for output, with amortised O(1) operations. See [[a5-queue]].
- **Why is a single-pass stack algorithm O(n) when it has a `while` loop inside a `for` loop?** Because each element is pushed once and popped at most once, the inner loop runs at most `n` times *in total* across the whole scan. This argument is the heart of [[a5-monotonic-stack]].

## Practice

1. **Reverse a string with a stack**, then explain why `new StringBuilder(s).reverse()` is better in real code.
2. **Min Stack, memory-light version.** Push onto the minimum stack only when needed, and test it with repeated minimum values.
3. **Baseball Game.** Process a list of operations (`"5"`, `"+"`, `"D"`, `"C"`) that add, sum, double or cancel previous scores.
4. **Simplify Path.** Turn `/a/./b/../../c/` into `/c` by pushing directory names and popping on `..`.
5. **Iterative inorder traversal.** Rewrite recursive inorder traversal of a binary tree with an explicit stack.
6. **Asteroid Collision.** Moving asteroids collide; use a stack of survivors and decide what happens when a left-moving asteroid meets the top.

The DSA explorer lists the matching problems under this topic; start with *Valid Parentheses*, *Min Stack* and *Evaluate Reverse Polish Notation*.

## Quick revision {#quick-revision}

- Stack = LIFO: push, pop and peek all work at the top in O(1) (push is amortised O(1) when backed by a doubling array).
- Three uses: reversing order, matching openers with closers, deferring work until a later event resolves it.
- Java: `Deque<T> s = new ArrayDeque<>()` with `push`/`pop`/`peek`. Empty: `peek` → `null`, `pop` → `NoSuchElementException`. No `null` elements.
- Avoid `java.util.Stack`: synchronised, extends `Vector`, allows indexed access, iterates bottom-first.
- Recursion uses the call stack; deep recursion → `StackOverflowError`; an explicit stack on the heap avoids it.
- Push indices when distances or widths matter.
- Each stack entry may carry extra state (Min Stack: minimum so far; Decode String: count and outer text).
- Single-pass stack algorithms are O(n): each element is pushed once and popped at most once.
- Always check empty before popping, and check leftovers after the scan.

## Key takeaways {#key-takeaways}

- A stack gives access only to the most recently added item, and that restriction matches every "finish the newest unfinished thing first" problem.
- An array-backed stack is O(1) per operation, with doubling making push amortised O(1); in Java, use `ArrayDeque`.
- The call stack is why recursion and explicit stacks are interchangeable, and why very deep recursion can overflow.
- The hard part of a stack problem is deciding what each entry must remember; design that first, then the code follows.
- The "each element pushed and popped once" argument turns nested-looking loops into O(n) algorithms and underlies monotonic stacks.
