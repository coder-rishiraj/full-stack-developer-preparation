---
problemId: nc-valid-parentheses
title: Valid Parentheses
source: neetcode
sourceUrl: https://leetcode.com/problems/valid-parentheses/
difficulty: easy
patterns: [stack]
relatedLessons: [a5-stack, a5-parentheses, a14-edge-cases, a14-manual-testing]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

You get a string `s` made only of the six characters `(`, `)`, `{`, `}`, `[` and `]`. Return `true` if the brackets are properly matched, otherwise `false`. Properly matched means:

- every open bracket is closed by a bracket of the same type;
- open brackets are closed in the correct order;
- every close bracket has a corresponding open bracket of the same type.

**Example 1**

- Input: `s = "()[]{}"`
- Output: `true`
- Why: three pairs side by side, each opened and closed with the same type.

**Example 2**

- Input: `s = "(]"`
- Output: `false`
- Why: the `(` is followed by a `]`, which is the wrong type to close it.

**Example 3**

- Input: `s = "([)]"`
- Output: `false`
- Why: each type appears once opened and once closed, but in the wrong order: the `)` arrives while the `[` opened after the `(` is still open.

**Example 4**

- Input: `s = "([])"`
- Output: `true`
- Why: the `[]` pair sits entirely inside the `()` pair.

**What the problem statement guarantees**

- 1 ≤ `s.length` ≤ 10^4.
- `s` consists only of the characters `()[]{}`.

## 2. Practice first: try it before reading on

If you have not solved this yet, stop here. The core idea is short; the marks are in a clean correctness argument and in the edge cases at both ends of the string. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 15 minutes and talk out loud.
2. Before coding, explain why `"([)]"` is invalid in terms of what your method keeps track of.
3. Trace your code on `"([)]"`, `"]"`, `"(("` and `"([]{})"`.

> [!HINT] Hint 1: a small nudge
> When you read a close bracket, which open bracket must it match? Not just any open one of the same type: think about `"([)]"`.

> [!HINT] Hint 2: the kind of tool you need
> The bracket that must close next is always the most recently opened one that is still open. Which structure gives you "the most recent item still present" and lets you remove it?

> [!HINT] Hint 3: almost the whole plan
> Walk the string. On an open bracket, remember it (or the close bracket it needs) on top of a last-in, first-out structure. On a close bracket, the structure must be non-empty and its top must match; remove the top. At the end the structure must be empty. What does each of `"]"` and `"(("` test?

**Check yourself before revealing the walkthrough**

- [ ] `"([)]"` returns false, `"([])"` returns true
- [ ] `"]"` returns false without an exception
- [ ] `"(("` returns false
- [ ] I can explain in two sentences why matching against the most recent open bracket is correct

## 3. Interview script: understand the problem (≈2 min)

**Me:** Three bracket types, and a string is valid when every bracket is closed by the same type, in the right order, and nothing closes that wasn't opened. So `"([])"` is fine because the square pair is nested inside the round one, and `"([)]"` isn't, because the pairs cross.

**Interviewer:** Right.

**Me:** The string only contains bracket characters, so I don't need to skip letters or spaces. And it's at least one character long.

**Interviewer:** Yes.

**Me:** Let me do `"([)]"` by hand. Open round, open square. Then a close round, but the square one is still open and was opened later, so the round one can't close yet. Invalid. So it's not enough to count each type; the order matters. Let me keep that example as my test for any idea that only counts.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^4 | An O(n²) method is about 10^8 simple steps at most, which would still run, but O(n) is easy to reach and is what's expected. Nesting depth is at most n/2 = 5000, so any recursion would be deep; a loop with an explicit stack avoids that. |
| Only the six bracket characters | Every character is either an opener or a closer; no other case to handle. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Crossing pairs such as `"([)]"` are invalid | Matching must be against the most recent open bracket, not any open bracket of the same type. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| A string of odd length can be rejected immediately | Every valid string is a sequence of pairs, so its length is even. It's only a shortcut; the main check would reject it anyway. |

### Edge cases I will keep in mind

- A close bracket with nothing open, such as `"]"` or `"]("`: false, and no exception from popping an empty stack.
- Openers left over at the end, such as `"(("`: false.
- Wrong type, `"(]"`, and crossing pairs, `"([)]"`.
- Deep nesting at the largest size: 5000 openers then 5000 closers.

## 4. Think out loud: from first idea to best solution

### Approach 1: Remove adjacent pairs until nothing changes

#### What I say out loud

> "The simplest picture: in any valid string, the innermost pair is an opener immediately followed by its closer, like `()`. If I delete it, what's left is still valid. So I can keep deleting `()`, `[]` and `{}` until none is left, and the string was valid exactly when it becomes empty. Each pass is linear and might delete only one pair, so this is O(n²)."

#### Intuition

A valid string always contains an adjacent matched pair somewhere, and deleting one never changes whether the string is valid. Repeatedly deleting pairs therefore shrinks a valid string all the way to empty, and gets stuck on a non-empty string for an invalid one.

#### Algorithm

1. Repeat: replace every `"()"`, then every `"[]"`, then every `"{}"` with the empty string.
2. Stop when a pass changes nothing.
3. Return whether the string is empty.

#### Why it is correct

Two facts carry the argument.

- **Deleting an adjacent matched pair preserves validity, in both directions.** If `s` is valid, the pair `xy` that I delete closes immediately after opening, so removing it leaves every other bracket matched to the same partner, in the same order: still valid. Conversely, if `s` with `xy` removed is valid, putting `xy` back in a single position adds a pair that crosses nothing, so `s` is valid.
- **A non-empty valid string always contains an adjacent matched pair.** Take the open bracket whose partner closes first; nothing can sit between them, because anything between would have to be a complete pair that closes even earlier.

So a valid string keeps losing pairs until it is empty. An invalid string can never become empty: if it did, running the deletions backwards (the second half of the first fact) would show that it was valid. The loop always ends because every pass that changes the string makes it shorter.

#### Dry run

`s = "([]{})"`

| Pass | After `"()"` | After `"[]"` | After `"{}"` |
|---|---|---|---|
| 1 | `([]{})` (none) | `({})` | `()` |
| 2 | (empty) | (empty) | (empty) |
| 3 | no change: stop | | |

The result is empty, so `true`. For `"([)]"` the first pass finds no adjacent pair, nothing changes, and the result `"([)]"` is not empty: `false`.

#### Java code

```java title="Approach 1: delete adjacent pairs until nothing changes"
class Solution {
    public boolean isValid(String s) {
        String previous;
        do {
            previous = s;
            s = s.replace("()", "").replace("[]", "").replace("{}", "");
        } while (!s.equals(previous));
        return s.isEmpty();
    }
}
```

#### Time complexity

**O(n²) in the worst case**, where n is `s.length()`. Each pass does three `replace` calls and one comparison, each linear in the current length, and a pass that changes the string removes at least one pair, so there are at most n/2 + 1 passes. Deep nesting such as `"((((...))))"` reaches that: each pass removes only the innermost `()`. The best case is O(n): side-by-side pairs, as in Example 1, vanish in one pass.

#### Space complexity

**O(n) auxiliary space**: each pass builds new strings of up to n characters (old ones become garbage).

#### The bridge to the next approach

> "The waste is that every pass rescans the whole string to find the next pair, even though the only new pair after a deletion is the one formed by the characters on either side of the hole. If I read left to right and keep the not-yet-matched openers in order, then when a closer arrives, the only opener it can pair with is the last one I kept. That's a stack, and it does all the deletions in one pass."

### Approach 2: A stack of expected closers (recommended)

#### What I say out loud

> "I walk the string once with a stack. When I see an opener, I push the closer it needs: `)` for `(`, and so on. When I see a closer, the stack must not be empty and its top must be exactly this closer; then I pop. If either check fails, it's invalid. At the end the stack must be empty, otherwise something was never closed. I'll use `ArrayDeque<Character>`, not `java.util.Stack`."

> "Pushing the expected closer instead of the opener means the match is a single equality check, with no lookup table."

#### Intuition

Proper nesting means that, at any moment, the open brackets that are still unmatched must be closed in reverse order of opening. So the next closer has exactly one legal partner: the most recently opened bracket that is still open. A stack keeps the open brackets in opening order with the most recent on top. See [[a5-parentheses|Parentheses problems]] for this pattern in general.

#### Algorithm

1. If `n` is odd, return `false`.
2. For each character `c`:
   - `(`, `[`, `{`: push `)`, `]`, `}` respectively.
   - a closer: if the stack is empty or `pop()` is not `c`, return `false`.
3. Return whether the stack is empty.

#### Why it is correct

**The invariant:** after reading a prefix of `s` without returning, the stack holds, from bottom to top, the closers needed by the prefix's unmatched openers, in the order those openers appeared; and the prefix with those openers removed is properly matched.

- **Why it never wrongly says `true`.** Each closer is paired with the most recent unmatched opener, and only if the types agree. Pairs formed this way are nested or side by side, never crossing: when a closer pairs with the top opener, every opener opened after it has already been closed. If the stack is empty at the end, every opener has been closed by its own type and every closer had a partner, which is the definition of valid.
- **Why it never wrongly says `false`.** Suppose `s` is valid and the closer at position `j` arrives. Its true partner, at some position `i`, must be the most recent unmatched opener: any opener after `i` that is still open would have to close after `j`, which would make its pair cross `(i, j)`. So the top of the stack is exactly the partner, the types match, and the check passes. At the end every opener has been closed, so the stack is empty.

**The 20-second version to say to the interviewer:**

> "In a valid string, a closer must match the most recently opened bracket that's still open; anything else would make two pairs cross. The stack holds the open brackets in order with the newest on top, so I compare each closer with the top and pop. A closer with an empty stack, a type mismatch, or leftovers at the end are exactly the three ways to be invalid. One pass, O(n)."

#### Dry run

`s = "([]{})"` (stack shown bottom to top)

| Char | Action | Stack after |
|---|---|---|
| `(` | push `)` | `)` |
| `[` | push `]` | `) ]` |
| `]` | pop `]`, matches | `)` |
| `{` | push `}` | `) }` |
| `}` | pop `}`, matches | `)` |
| `)` | pop `)`, matches | empty |
| end | stack empty | return `true` |

`s = "([)]"`

| Char | Action | Stack after |
|---|---|---|
| `(` | push `)` | `)` |
| `[` | push `]` | `) ]` |
| `)` | pop `]`, which is not `)` | return `false` |

#### Java code

```java title="Approach 2: stack of expected closers (recommended)"
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public boolean isValid(String s) {
        if (s.length() % 2 == 1) {
            return false;
        }
        Deque<Character> stack = new ArrayDeque<>();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '(') {
                stack.push(')');
            } else if (c == '[') {
                stack.push(']');
            } else if (c == '{') {
                stack.push('}');
            } else if (stack.isEmpty() || stack.pop() != c) {
                return false;
            }
        }
        return stack.isEmpty();
    }
}
```

#### Time complexity

**O(n) in every case.** One pass; each character does at most one push or one pop, and `ArrayDeque` push and pop are amortised constant time. The boxing of `char` to `Character` does not allocate here: `Character.valueOf` is documented to cache every value from `\u0000` to `\u007F`, which covers all six brackets.

#### Space complexity

**O(n) auxiliary space in the worst case.** A valid string needs up to n/2 entries (n/2 openers followed by n/2 closers); an invalid even-length string of only openers fills the stack to n before the final check fails.

### Alternative: one counter per bracket type

With a single bracket type, a counter is enough: add 1 for `(`, subtract 1 for `)`, fail if it ever goes negative, succeed if it ends at 0. That is O(n) time and O(1) space, and it is correct for one type because all openers are interchangeable.

With several types, counters lose the order between types. On `"([)]"`, one counter per type never goes negative and both end at 0, so the counters say `true`, but the answer is `false`. A single shared counter is even weaker: it accepts `"(]"`. Use counters only when the interviewer restricts the input to one bracket type; in that case they are the better answer because they need no stack.

## 5. Comparison table

n = `s.length()`. Nothing is hashed or randomised, so expected and worst case differ only where noted.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Remove adjacent pairs | O(n²) (O(n) on side-by-side pairs) | O(n²) | O(n) |
| 2. Stack of expected closers | O(n) | O(n) | O(n) |
| Alternative: counters | O(n) | O(n) | O(1), but wrong for more than one type |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Remove adjacent pairs | Three lines; the correctness argument is about pairs, which is a nice way to explain validity | Quadratic on deep nesting; creates many temporary strings | As a spoken baseline, or a quick check in a script |
| 2. Stack | Linear, one pass, stops at the first error | Needs a stack and care with the empty-stack case | The answer to give |
| Counters | O(1) space | Accepts crossing pairs such as `"([)]"` | Only when there is a single bracket type |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2. Mention the pair-deletion idea in one sentence if it helps explain why the stack works.

**Is it optimal?** In time, yes: in the worst case a correct algorithm must read essentially every character, since for a valid string, changing any one bracket into a different one of the six makes it invalid. That is an Ω(n) worst-case lower bound. In space, O(n) is needed in the worst case by this method: after reading k openers the algorithm must remember their types in order to check the closers that follow.

**When it's better in practice:** for a single bracket type, use the counter. If memory is tight with several types, a `char[]` of size n with a top index does the same job as the `Deque` without boxing or growth; that is the version in the revision card.

**When to stop:** after the stack version is coded and traced on `"([)]"`, `"]"` and `"(("`.

## 7. Interview script: code it and test it

### What I say while coding

> "Odd length is rejected immediately; it can't be pairs."

> "For an opener, I push the closer it needs, so the later check is one comparison."

> "For a closer: `stack.isEmpty() || stack.pop() != c`. The `||` short-circuits, so I never pop an empty stack."

> "At the end, `return stack.isEmpty()`, not `return true`: leftover openers mean invalid."

### Testing out loud

**Normal case:** `"([]{})"`, as in the dry run. Every closer matches the top; the stack ends empty. `true`.

**Crossing pairs:** `"([)]"`: the `)` meets `]` on top. `false`.

**Closer first:** `"]"` is odd length, rejected at once. `"]("` is even: the first character is a closer, the stack is empty, so `false` without popping.

**Leftover openers:** `"(("`: two pushes, no closers, the stack is not empty at the end. `false`.

**Wrong type:** `"(]"`: the top is `)`, not `]`. `false`.

**Deepest nesting:** 5000 `(` then 5000 `)`: the stack grows to 5000 and empties. `true`, in linear time.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1–2 min | Crossing pairs invalid; only bracket characters |
| Idea | 1–2 min | Why the most recent open bracket must close first; mention that counters fail on `"([)]"` |
| Code | 3–4 min | Approach 2 |
| Trace | 2–3 min | `"([)]"`, `"]("`, `"(("` |

Spend the time on the correctness sentence and on the two end conditions (empty stack on a closer, non-empty stack at the end). If stuck, delete innermost pairs by hand on paper and notice which bracket each closer deletes.

## 9. Interviewer challenges

### About correctness

#### Why must a closer match the most recent unmatched opener, rather than any open bracket of its type?

**What they are testing:** whether you can justify the stack, not just use it.

**How to reason:** suppose a closer at `j` matches an opener at `i`, while an opener at `k`, with `i < k < j`, is still open.

**What I say:** "Then the bracket opened at `k` closes after `j`, so its pair starts inside `(i, j)` and ends outside it. That's two crossing pairs, which the 'correct order' rule forbids. So in a valid string the partner is always the most recent unmatched opener, and checking the top of the stack is enough."

**Nuance:** this is the same fact as "a valid string always contains an adjacent pair", which is why Approach 1 also works.

#### Why do you need `stack.isEmpty()` at the end?

**What they are testing:** the second end condition.

**How to reason:** find an input where every closer matched but something is still open.

**What I say:** "`"(("` has no closers, so no check ever fails. Without the final check I'd return true. The stack still holds two entries, and that's exactly the 'every open bracket is closed' rule failing."

**Nuance:** the odd-length shortcut does not cover this: `"(("` has even length.

### About the implementation

#### Why `ArrayDeque` and not `java.util.Stack`?

**What they are testing:** knowledge of the Java collections.

**How to reason:** compare design, not just whether it works.

**What I say:** "`Stack` is a legacy class that extends `Vector`, so every operation is synchronized, and it exposes index access that breaks the stack abstraction. The JDK documentation recommends a `Deque` such as `ArrayDeque` for stack use. For speed I could also use a `char[]` with a top index, which avoids boxing entirely."

**Nuance:** `ArrayDeque.pop()` on an empty deque throws `NoSuchElementException`, which is why the emptiness check comes first in the condition.

## 10. Follow-up questions the interviewer might ask

**"What if the string also contains other characters, like letters?"**
Skip anything that is not a bracket. Same O(n) time and O(n) space.

**"What if there is only one bracket type?"**
A counter replaces the stack: +1, −1, fail if negative, succeed if zero at the end. O(n) time, O(1) space.

**"What is the minimum number of brackets to add to make a single-type string valid?"**
Track `open` and `added`: on `)` with `open == 0`, increment `added`; otherwise decrement `open`. The answer is `added + open`. O(n) time, O(1) space.

**"What is the length of the longest valid substring?"**
That is Longest Valid Parentheses: a stack of indices, with the index just before the current valid run kept at the bottom, gives O(n) time and O(n) space.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Counting each type separately.** It accepts `"([)]"`, because counts ignore the order between types.
- **Thinking the odd-length check is the only end condition.** `"(("` has even length and is still invalid.

### Implementation mistakes

> [!MISTAKE] Popping without checking that the stack is empty
> `if (stack.pop() != c) return false;` throws `NoSuchElementException` on `"]("`: the first character is a closer and the `ArrayDeque` is empty. Check `stack.isEmpty()` first, and let `||` short-circuit.

- **Returning `true` after the loop instead of `stack.isEmpty()`.** That returns `true` for `"(("`.
- **Comparing boxed values with `==` between two `Character` objects.** In this code one side is a `char`, so the comparison unboxes and is safe. Comparing two `Character` objects with `==` compares references; it happens to work for these ASCII characters because of the documented cache, but `equals` states the intent.
- **Using `peek()` and forgetting to pop** after a match. The matched entry stays on the stack, so the stack never empties and even `"()"` returns `false`.

## 12. Pattern recognition

**The pattern:** a stack of pending items, where each new closing item must match the most recent pending one.

**Signals in the problem statement:**

- "Closed in the correct order": nesting, so the last one opened is the first to close.
- Several kinds of opening and closing items that must pair by kind.

**Related problems in this list:**

- [[nc-baseball-game|Baseball Game]]: each operation acts on the most recent surviving score, the same last-in, first-out access.
- [[nc-evaluate-reverse-polish-notation|Evaluate Reverse Polish Notation]]: operators consume the most recent values on a stack.
- [[nc-decode-string|Decode String]]: nested brackets again, with a stack holding what to resume after each `]`.
- [[nc-generate-parentheses|Generate Parentheses]]: builds every valid string of one type, using the counter rule (never close more than you've opened) as the constraint.
- [[nc-simplify-path|Simplify Path]]: a stack of pending directories, where `..` pops the most recent.

**Takeaway:** whenever things must be closed in the reverse of the order they were opened, keep the open ones on a stack and match each closer against the top.

## 13. 60-second revision card

**Key insight:** in a valid string, each closer matches the most recently opened bracket that is still open; otherwise two pairs would cross.

**Invariant:** the stack holds the closers still owed, most recent on top.

**Complexity:** O(n) time, O(n) auxiliary space. Ω(n) worst-case time lower bound: in a valid string, changing any one bracket makes it invalid.

**Code skeleton:**

```java title="Valid Parentheses with a char array as the stack"
class Solution {
    public boolean isValid(String s) {
        char[] stack = new char[s.length()];
        int top = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '(') stack[top++] = ')';
            else if (c == '[') stack[top++] = ']';
            else if (c == '{') stack[top++] = '}';
            else if (top == 0 || stack[--top] != c) return false;
        }
        return top == 0;
    }
}
```

**Main traps:**

- Check for an empty stack before popping.
- Return `stack.isEmpty()`, not `true`.
- Counters per type accept `"([)]"`.

**What to say in one breath:** "Push the closer each opener needs; on a closer, the stack must be non-empty and its top must equal it; at the end the stack must be empty. The most recent open bracket must close first, or pairs would cross. O(n) time, O(n) space, `ArrayDeque` rather than `Stack`."
