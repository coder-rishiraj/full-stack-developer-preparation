---
problemId: nc-simplify-path
title: Simplify Path
source: neetcode
sourceUrl: https://leetcode.com/problems/simplify-path/
difficulty: medium
patterns: [stack, string-parsing]
relatedLessons: [a5-stack, a5-deque, a1-strings-stringbuilder, a2-array-string-traversal, a14-edge-cases]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

You get an absolute Unix-style file path: a string that starts with `/`. Rewrite it in canonical form. In the input, `.` means "the current directory", `..` means "the parent directory", and several slashes in a row count as one. Any other name made of periods, such as `...` or `....`, is an ordinary directory name. The canonical path starts with a single `/`, separates directory names with exactly one `/`, has no trailing `/` (unless the whole path is the root `/`), and contains no `.` or `..` entries.

**Example 1**

- Input: `path = "/home/user/Documents/../Pictures"`
- Output: `"/home/user/Pictures"`
- Why: `..` leaves `Documents` and goes back to `user`, and from there into `Pictures`.

**Example 2**

- Input: `path = "/.../a/../b/c/../d/./"`
- Output: `"/.../b/d"`
- Why: `...` is a directory name, not a command. Then `a` is entered and left, `b` is entered, `c` is entered and left, `d` is entered, `.` stays put, and the trailing slash is dropped.

Two short ones worth remembering: `"/../"` gives `"/"`, because the root has no parent and going up from it stays at the root; and `"/home//foo/"` gives `"/home/foo"`.

**What the problem statement guarantees**

- 1 ≤ `path.length` ≤ 3000.
- `path` consists of English letters, digits, `.`, `/` and `_`.
- `path` is a valid absolute Unix path (it starts with `/`).

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 20 minutes and talk out loud.
2. Write down five inputs that could break a careless solution before you write any code. Make sure at least one contains `...`.
3. Walk `"/a/./b/../../c/"` by hand and say what you are remembering at each step.
4. Write the code, then trace `"/../"` and `"/.../a/../b"`.

Open a hint only after two minutes without progress.

> [!HINT] Hint 1: a small nudge
> Forget the slashes for a moment. What are the meaningful pieces of the path, and what does each kind of piece do to "where you are"?

> [!HINT] Hint 2: the kind of tool you need
> Going into a directory adds a name at the end of where you are; `..` removes the most recently added name. Which data structure adds and removes at the same end? You will also need to read it back from the oldest name to the newest at the end.

> [!HINT] Hint 3: almost the whole plan
> Split the path on `/`. Skip empty pieces and `.`. On `..`, remove the last name if there is one. Anything else is a name: add it. At the end, join the names with `/` from the first to the last, with a leading `/`, and return `/` if there are none.

**Check yourself before revealing the walkthrough**

- [ ] `"/../"` returns `"/"`, not an exception and not an empty string
- [ ] `"/.../a/../b"` returns `"/.../b"`
- [ ] `"/home//foo/"` returns `"/home/foo"`, with no trailing slash
- [ ] I can say what I do with the pieces that `split` returns empty

## 3. Interview script: understand the problem (≈2 min)

**Me:** Let me restate: I get an absolute path and return its canonical form: one leading slash, single slashes between names, no trailing slash unless it's just the root, and no `.` or `..` left in it. `.` means stay, `..` means go up one level. Right?

**Interviewer:** Right.

**Me:** What does `..` do at the root? In Unix the root is its own parent.

**Interviewer:** It stays at the root.

**Me:** Good, so `"/../"` is `"/"`, and I must not fail on it. What about names like `...`?

**Interviewer:** Any other sequence of periods is a valid name.

**Me:** So only the exact pieces `.` and `..` are special. A name like `..a` or `a..` is also just a name. Multiple slashes collapse to one?

**Interviewer:** Yes.

**Me:** Can the input be relative, without a leading slash?

**Interviewer:** No, it's always a valid absolute path.

**Me:** And the characters are letters, digits, periods, slashes and underscores, up to 3000 of them. I don't need to think about symbolic links or the real file system: this is purely textual?

**Interviewer:** Purely textual.

**Me:** One by hand: `"/a/./b/../../c/"`. Pieces: `a` (in a), `.` (stay), `b` (in a/b), `..` (back to a), `..` (back to root), `c` (in c). Result `"/c"`.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| The path is absolute (starts with `/`) | There is always a root to fall back to. No need to handle relative paths or keep leading `..` entries. |
| `.` = stay, `..` = parent, other period sequences are names | Only the two exact tokens are special. A test like "starts with a period" is wrong. |
| Repeated slashes count as one; no trailing slash in the output | Empty pieces between slashes are ignored, and the output is rebuilt from scratch rather than edited. |
| Length ≤ 3000; letters, digits, `.`, `/`, `_` | Small input. Any linear solution is plenty; the risk is correctness, not speed. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| `..` at the root stays at the root | Removing from an empty collection must be a no-op, not an error. |
| The task is purely textual (no file system, no links) | No I/O; the answer depends only on the string. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| I build a new string; the input is not reused | Java strings are immutable anyway; I say it so nobody expects an in-place answer. |

### Edge cases I will keep in mind

- The root itself, written in different ways: `"/"`, `"//"`, `"/."`, `"/.."`, `"/a/.."`.
- `..` at the root, also after other names: `"/../"`, `"/a/../.."`.
- Names made of periods: `"/..."`, `"/...."`, `"/..a"`, `"/a.."`, `"/.a"`.
- Repeated and trailing slashes: `"/home//foo/"`.
- Going up several levels: `"/a/./b/../../c/"`.

## 4. Think out loud: from first idea to best solution

### Approach 1: Split into names, keep a stack of directories (recommended)

#### What I say out loud

> "My first instinct is text replacement: replace `//` with `/`, remove `/./`, remove `name/..`. But each rule changes the text the others look at, `/.../` looks a lot like the patterns, and `..` at the root needs its own rule. That's fragile. Let me instead work with the pieces between slashes, because each piece has a clear meaning."

> "If I split on `/`, I get empty pieces from repeated or leading slashes, `.` pieces, `..` pieces and names. Empty and `.` do nothing. A name goes one level deeper; `..` undoes the most recent level. 'Undo the most recent' is a stack. At the end I need the names from the oldest to the newest, so I'll use a deque: push and pop at the back, and iterate from the front."

#### Intuition

The current directory is a list of names from the root down. Entering a directory appends a name; `..` removes the last one. Only the end of the list ever changes, so it is a stack, and the canonical path is that stack read from bottom to top. This is the "stack as history" use from [[a5-stack|Stack]]; a [[a5-deque|deque]] gives both the stack operations and front-to-back iteration.

#### Algorithm

1. Split `path` on `/`.
2. For each piece: skip it if it is empty or `.`; if it is `..`, remove the last directory if there is one; otherwise add it as the last directory.
3. If there are no directories, return `"/"`.
4. Otherwise append `/` + name for each directory, from the first to the last, and return that.

#### Why it is correct

**The invariant:** after processing a piece, the deque holds exactly the directories of the current location, from the root down.

- **It starts true:** before any piece, the location is the root, with no names.
- **Each piece keeps it:** an empty piece comes from two slashes in a row, or a leading slash, and means nothing. `.` means stay. A name means "go into it", which appends it. `..` means "go to the parent", which removes the last name, and at the root (empty deque) there is no parent, so the location stays the root, which matches the clarification.
- **Only the exact strings `.` and `..` are special.** The comparison uses `equals`, so `...`, `..a` and `a..` are names, as required.
- **The output is canonical by construction:** it is built from scratch with one `/` before each name, so there is exactly one leading slash, single separators, no trailing slash, and no `.` or `..` (they never enter the deque). The empty case returns `/`.

**The 20-second version to say to the interviewer:**

> "The current location is a list of names from the root. A name appends, `..` removes the last one if there is one, and empty pieces and `.` do nothing. Only the end changes, so it's a stack. I rebuild the output from that stack, so the format is canonical by construction."

#### Dry run

`path = "/x//./y/../z/"`. `split("/")` returns `["", "x", "", ".", "y", "..", "z"]`: the leading slash gives the first empty piece, the double slash gives the empty piece in the middle, and Java's `split` drops trailing empty pieces, so the final `/` adds nothing.

| Piece | Action | Deque (first → last) |
|---|---|---|
| `""` | skip | `[]` |
| `x` | add | `[x]` |
| `""` | skip | `[x]` |
| `.` | skip | `[x]` |
| `y` | add | `[x, y]` |
| `..` | remove last | `[x]` |
| `z` | add | `[x, z]` |

Output: `"/x/z"`.

#### Java code

```java title="Approach 1: split + stack of directories (recommended)"
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public String simplifyPath(String path) {
        Deque<String> dirs = new ArrayDeque<>();   // first = nearest the root, last = current directory
        for (String part : path.split("/")) {
            if (part.isEmpty() || part.equals(".")) {
                continue;                          // "//" or "." changes nothing
            }
            if (part.equals("..")) {
                dirs.pollLast();                   // go up; at the root this is a no-op (returns null)
            } else {
                dirs.addLast(part);                // any other name, including "..."
            }
        }
        if (dirs.isEmpty()) {
            return "/";
        }
        StringBuilder out = new StringBuilder();
        for (String dir : dirs) {                  // iterates first to last: root side first
            out.append('/').append(dir);
        }
        return out.toString();
    }
}
```

`pollLast` returns `null` on an empty deque, which is exactly the "stay at the root" behaviour. `removeLast` would throw `NoSuchElementException` on `"/../"`.

#### Time complexity

**O(n) in the worst case**, where n is the length of `path`. `split` walks the string once and copies each character into at most one piece. (In current JDKs a one-character pattern that is not a regex metacharacter, such as `"/"`, takes a fast path that does not use the regex engine; that is implementation behaviour, but either way the work for this pattern is linear.) Each piece costs one comparison of at most a few characters plus at most one deque operation, which is O(1) amortized because `ArrayDeque` doubles its capacity when full. Building the output appends each kept character once, O(n) amortized for the `StringBuilder`.

#### Space complexity

**O(n) auxiliary space**: the array of pieces and the deque hold at most n characters' worth of strings in total. The output string is up to n characters as well and is not counted.

#### The bridge to the next approach

> "That's linear and short. If you'd rather I didn't use `split`, for instance because it allocates an array of pieces, I can scan the characters myself. And there's a neat trick: the output I'm building is itself a stack. Its last segment is the current directory, so `..` can just cut the output back to its last slash."

### Approach 2: Single scan, using the output as the stack

#### What I say out loud

> "I'll scan the path with an index. Skip slashes, then read up to the next slash: that's one piece. I apply the same rules, but instead of a deque I append `/name` straight to a `StringBuilder`. For `..` I cut the builder back to its last slash, which removes the last name. At the root the builder is empty, `lastIndexOf` returns −1, and I clamp to 0 so nothing happens."

#### Intuition

The output is the deque written out with slashes. So "remove the last name" is "truncate after the last `/`", and the deque disappears.

#### Algorithm

1. `out` = empty builder, `i = 0`.
2. While `i < n`: skip slashes; mark `start = i`; advance `i` to the next slash or the end. The piece is `path[start, i)`.
3. If the piece is empty or `.`, continue. If it is `..`, set the builder's length to `max(0, out.lastIndexOf("/"))`. Otherwise append `/` and the piece.
4. Return `out`, or `"/"` if it is empty.

#### Why it is correct

The builder always equals the output Approach 1 would build from its deque at the same moment: appending `/name` mirrors `addLast`, and truncating at the last `/` removes exactly the last `/name`, mirroring `pollLast` (and doing nothing when the builder is empty). Pieces are recognised by their length and characters, so only exactly `.` and `..` are special. The final result is therefore the same canonical path.

#### Dry run

`path = "/.../a/../b"`

| Piece | Action | `out` after |
|---|---|---|
| `...` | length 3, a name: append | `"/..."` |
| `a` | append | `"/.../a"` |
| `..` | last `/` is at index 4: cut to length 4 | `"/..."` |
| `b` | append | `"/.../b"` |

Output: `"/.../b"`.

#### Java code

```java title="Approach 2: single scan, output as the stack"
class Solution {
    public String simplifyPath(String path) {
        StringBuilder out = new StringBuilder();   // the answer so far, also used as the stack
        int n = path.length();
        int i = 0;
        while (i < n) {
            while (i < n && path.charAt(i) == '/') {
                i++;                               // skip any run of slashes
            }
            int start = i;
            while (i < n && path.charAt(i) != '/') {
                i++;                               // the next piece is path[start, i)
            }
            int len = i - start;
            if (len == 0 || (len == 1 && path.charAt(start) == '.')) {
                continue;                          // trailing slashes, or "."
            }
            if (len == 2 && path.charAt(start) == '.' && path.charAt(start + 1) == '.') {
                // Pop: cut back to the last '/'. At the root lastIndexOf is -1 and nothing changes.
                out.setLength(Math.max(0, out.lastIndexOf("/")));
            } else {
                out.append('/').append(path, start, i);
            }
        }
        return out.length() == 0 ? "/" : out.toString();
    }
}
```

#### Time complexity

**O(n) in the worst case.** The forward scan visits each character of `path` once. Each `lastIndexOf("/")` searches backwards from the end of `out` and passes only over the last name and its slash, which `setLength` then deletes; every character is appended at most once, so it can be passed over by such a search and deleted at most once. Appends are O(1) amortized.

#### Space complexity

**O(1) auxiliary space beyond the output.** The builder is the answer itself (up to n characters); apart from it there are only a few indices. `toString` makes one more copy of the answer, which is also output.

## 5. Comparison table

n = length of `path`. Nothing is hashed or randomized, so expected and worst case coincide.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Split + deque | O(n) | O(n) | O(n) |
| 2. Single scan, output as stack | O(n) | O(n) | O(1) beyond the output |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Split + deque | Each rule is one readable line; hard to get wrong | Allocates the pieces array and the deque | The default answer |
| 2. Single scan | No `split`, no extra collection | Index arithmetic and the clamp at the root are easy to get wrong | When the interviewer forbids `split` or asks about allocation |

## 6. Which solution to give, and when to stop optimizing

**Give Approach 1.** Both are linear, which is optimal in the worst case: the output can be as long as the input, and any character left unread could change it (a `..` at the end removes a name), so there is an Ω(n) worst-case lower bound. With n ≤ 3000 the real risk is a wrong edge case, not speed, and Approach 1 makes each rule a single readable line. Offer Approach 2 only if asked to avoid `split` or extra allocation. Spend leftover time tracing `"/../"`, `"/..."` and a trailing slash, not on micro-optimizations.

## 7. Interview script: code it and test it

### What I say while coding

> "Split on slash. The pieces include empty strings for the leading slash and for double slashes; I skip those along with `.`."

> "For `..` I use `pollLast`, not `removeLast`, because at the root the deque is empty and going up should just do nothing."

> "Everything else is a name, even `...`. I compare with `equals`, never `startsWith`."

> "At the end: empty deque means root. Otherwise slash plus name for each, iterating from the front, which is the root side."

### Testing out loud

**Normal case:** `"/home/user/Documents/../Pictures"`. Deque `[home, user, Documents]`, then `..` gives `[home, user]`, then `[home, user, Pictures]`. `"/home/user/Pictures"`. Correct.

**Up from the root:** `"/../"`. Pieces `["", ".."]`. `..` on an empty deque: `pollLast` returns null, nothing changes. Empty deque, return `"/"`. Correct.

**Repeated and trailing slashes:** `"/home//foo/"`. Pieces `["", "home", "", "foo"]` (the trailing empty piece is dropped by `split`; it would be skipped anyway). `[home, foo]`, `"/home/foo"`. Correct.

**Period names:** `"/.../a/../b"`. `...` is not `.` or `..`, so it is added; `a` is added and removed; `b` is added. `"/.../b"`. Correct.

**Several levels up:** `"/a/./b/../../c/"`. `[a]`, `.` skipped, `[a, b]`, `[a]`, `[]`, `[c]`. `"/c"`. Correct.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Understand and clarify | 2 min | `..` at the root, period names, purely textual |
| Choose the representation | 1–2 min | Pieces between slashes; current location as a stack |
| Code | 4–5 min | Split, four cases, rebuild |
| Trace edge cases | 3 min | `"/../"`, `"/.../a/../b"`, `"/home//foo/"` |
| Complexity and follow-ups | the rest | Offer the single-scan version if asked |

This problem is short to code; the time goes into the clarifying questions and the edge-case traces. If you are stuck, write the pieces of an example on the whiteboard as a list and say what each one does to "where am I": the stack appears on its own.

## 9. Interviewer challenges

### About the design

#### Why a deque and not a `Stack` or a `List`?

**What they are testing:** whether you chose the structure for the operations you need.

**How to reason:** list the operations: add at the end, remove at the end (possibly when empty), and iterate from the beginning at the end.

**What I say:** "I need stack operations plus iteration from the bottom. `ArrayDeque` with `addLast` and `pollLast` gives both, and `pollLast` returns null instead of throwing on an empty deque. An `ArrayList` would work just as well with `remove(size - 1)` guarded by an emptiness check. I avoid `java.util.Stack` because it's synchronized legacy code, and its iteration order is easy to confuse."

**Nuance:** if you `push` onto an `ArrayDeque`, it adds at the front, and iterating then goes from the newest name to the oldest: the path comes out reversed.

#### Why not just use string replacement?

**What they are testing:** whether you can see why a local rewrite fails on a structural problem.

**How to reason:** each rewrite changes the context of the others, and the patterns overlap with legal names.

**What I say:** "Replacing `/./` and `name/..` needs repeated passes, because removing one `..` can expose another, and the patterns have to avoid matching inside `...` or `..a`. Getting every rule and its order right is harder than processing pieces with a stack, and repeated passes can be quadratic."

**Nuance:** a rewrite loop can be made correct, but in `"/a/b/c/../../.."` each pass that removes one innermost `name/..` exposes the next, so it needs one pass per level. The stack handles the nesting in a single left-to-right pass.

### About the edge cases

#### What happens with `..` at the root?

**What they are testing:** the most common crash on this problem.

**How to reason:** what does the deque look like, and what does the removal call do on an empty deque?

**What I say:** "The deque is empty, and `pollLast` returns null without changing anything, so we stay at the root, which is what Unix does. If I'd used `removeLast` or `pop`, it would throw `NoSuchElementException` on `"/../"`."

**Nuance:** in the single-scan version, the same case is the `Math.max(0, …)` clamp, because `lastIndexOf` returns −1 on an empty builder and `setLength(-1)` would throw.

## 10. Follow-up questions the interviewer might ask

**"What if the path could be relative?"**
Then a `..` with nothing to pop cannot be dropped: `"../../a"` must keep both `..` entries. Push `..` when the stack is empty or its top is already `..`, and do not add the leading slash. Still O(n).

**"What if you also had a current working directory and had to resolve a relative path against it?"**
Start the stack with the working directory's names, then process the relative path's pieces with the same rules. An absolute input resets the stack. O(length of both).

**"What if the file system had symbolic links?"**
Then the problem is no longer textual: `a/..` is not necessarily the directory you started in, because `a` may point elsewhere. You would have to resolve each component against the file system as you go, so the answer needs I/O, not just the string.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Treating anything that starts with a period as special.** Only exactly `.` and `..` are. With `startsWith("..")`, `"/.../a/../b"` returns `"/b"` instead of `"/.../b"`.
- **Editing the string in place with replacements** instead of rebuilding it from its pieces.
- **Forgetting that the root has no parent**, and so not planning for an empty stack.

### Implementation mistakes

> [!MISTAKE] Popping an empty stack
> `removeLast()` or `pop()` on an empty `ArrayDeque` throws `NoSuchElementException`, so `"/../"` crashes. Use `pollLast()` or check `isEmpty()` first.

> [!MISTAKE] Pushing at the front and iterating from the front
> `ArrayDeque.push` adds at the head. Iterating that deque goes from the newest name to the oldest, so `"/home/user/Pictures"` comes back as `"/Pictures/user/home"`.

- **Returning an empty string for the root.** When nothing is left, the answer is `"/"`.
- **Leaving a trailing slash** by appending `name + "/"` instead of `"/" + name`.
- **Not skipping empty pieces** from `split`, which turns `"//"` into extra slashes.

## 12. Pattern recognition

**The pattern:** a stack that represents "where I am" in a nested structure. Going in pushes, going out pops, and the stack read from bottom to top is the current position.

**Signals in the problem statement:**

- Tokens that open a level and tokens that close the most recent one.
- An instruction to "undo the last step".
- The answer is the state at the end, read from the oldest level to the newest.

**Related problems in this list:**

- [[nc-valid-parentheses|Valid Parentheses]]: an opener pushes, a closer must pop its matching opener.
- [[nc-decode-string|Decode String]]: `[` saves the current context on a stack, `]` restores it.
- [[nc-evaluate-reverse-polish-notation|Evaluate Reverse Polish Notation]]: tokens processed left to right against a stack.
- [[nc-asteroid-collision|Asteroid Collision]]: a newcomer cancels the most recent survivors.

**Takeaway:** when a sequence of moves can be undone one level at a time, keep the levels on a stack and build the answer from it at the end.

## 13. 60-second revision card

**Key insight:** the current directory is a stack of names. Name: push. `..`: pop if not empty. Empty piece or `.`: nothing.

**Invariant:** after each piece, the stack holds the directories from the root down to the current location.

**Complexity:** O(n) time, O(n) auxiliary space, n = path length.

**Code skeleton:**

```java title="Simplify Path core" fragment="public String simplifyPath(String path)"
Deque<String> dirs = new ArrayDeque<>();
for (String part : path.split("/")) {
    if (part.isEmpty() || part.equals(".")) continue;
    if (part.equals("..")) dirs.pollLast();     // no-op at the root
    else dirs.addLast(part);                   // "..." is a name
}
StringBuilder out = new StringBuilder();
for (String dir : dirs) out.append('/').append(dir);
return out.length() == 0 ? "/" : out.toString();
```

**Main traps:**

- `..` at the root: `pollLast`, not `removeLast`.
- `...` is a name: compare with `equals`.
- Empty result is `"/"`; no trailing slash.
- Iterate from the root side (`addLast` + normal iteration).

**What to say in one breath:** "Split on slash, skip empty pieces and dots, pop on `..` if there's anything to pop, push any other name, then join from the bottom with a leading slash, returning slash for an empty stack. Linear time and space."
