---
problemId: cses-repetitions
title: Repetitions
source: cses
sourceUrl: https://cses.fi/problemset/task/1069
difficulty: easy
patterns: [introductory, string-traversal]
relatedLessons: [a2-array-string-traversal, a1-java-syntax-competitive, a1-strings-stringbuilder, a14-edge-cases]
companies: []
timeToSolve: 5
---

## 1. Problem restatement

You get a DNA sequence: a string of n characters, each one of `A`, `C`, `G` or `T`. A repetition is a block of consecutive positions that all hold the same character. Print the length of the longest repetition.

**Example 1**

- Input: `ATTCGGGA`
- Output: `3`
- Why: the blocks of equal characters are `A`, `TT`, `C`, `GGG`, `A`. The longest is `GGG`, with length 3.

**Example 2**

- Input: `ACGT`
- Output: `1`
- Why: no two neighbours are equal, so every block has length 1. A single character always counts as a block, so the answer is never 0.

**What the problem statement guarantees**

- The input is one line holding the string.
- 1 ≤ n ≤ 10^6, so the string is never empty.
- Every character is `A`, `C`, `G` or `T`.
- Time limit: 1 second.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. It looks trivial, and it is a good test of whether your loop handles the first and the last character correctly. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 5 minutes.
2. Write a complete program that reads standard input and writes standard output.
3. Before running it, trace it by hand on `ATTCGGG` (the longest block is at the end), `GGGG` and `A`.
4. State how many character comparisons your program does for a string of a million characters.

Open a hint only after a minute without progress.

> [!HINT] Hint 1: a small nudge
> Checking every possible block is far too much work at a million characters. Instead, read the string left to right. When you look at one character, what single fact about the characters just before it do you need?

> [!HINT] Hint 2: the kind of tool you need
> One pass, two counters: the length of the block that ends at the current character, and the best length seen so far. The current block either grows by one or restarts at one.

> [!HINT] Hint 3: almost the whole plan
> Start both counters at 1. For each position from the second onward, compare the character with the previous one: equal means the current length grows, different means it restarts at 1. Update the best after every character, not only when a block ends; then check `ATTCGGG` again.

**Check yourself before revealing the walkthrough**

- [ ] My program prints `3` for `ATTCGGGA` and for `ATTCGGG`
- [ ] It prints `1` for `A` and `4` for `GGGG`
- [ ] It does a constant amount of work per character
- [ ] It reads a 10^6-character line without a `Scanner`

## 3. Interview script: understand the problem (≈1 min)

Posed in an interview, this is a warm-up. The questions worth asking are about the input format and the boundaries, because the algorithm itself is short.

**Me:** Let me restate: I read one string of DNA letters and print the length of the longest block of consecutive equal letters.

**Interviewer:** Yes.

**Me:** Consecutive, so `ATA` has longest block 1, not 2: the two `A`s are separated?

**Interviewer:** Correct.

**Me:** How long can the string be, and what's the time limit?

**Interviewer:** Up to a million characters, at least one. One second.

**Me:** Then quadratic is out: a million squared is 10^12. I want one pass. And the whole string is on one line?

**Interviewer:** Yes, a single line.

**Me:** A million characters on one line: `BufferedReader.readLine()` handles that fine. I'll avoid `Scanner`, which is noticeably slower on large inputs.

**Me:** Quick example: `ATTCGGGA`. Blocks: `A`, `TT`, `C`, `GGG`, `A`. Answer 3.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^6 | The string is never empty, so the answer is at least 1. Anything quadratic (10^12 steps) is far too slow; one pass is about 10^6 comparisons. |
| Characters are `A`, `C`, `G`, `T` | The alphabet does not matter to the algorithm: I only compare neighbours for equality. |
| Time limit 1 s | Reading a million characters is part of the cost; `BufferedReader` reads it in a small fraction of the limit. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| The string is one line | One `readLine()` reads all of it. |
| "Repetition" means consecutive equal characters | I compare each character with its neighbour; I never count letters across the whole string. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The line may carry stray spaces around the string | I `trim()` it, so a trailing space is not counted as a character. (`readLine` already removes `\n`, `\r` and `\r\n` terminators.) |
| The answer fits in an `int` | It is at most 10^6. |

### Edge cases I will keep in mind

- n = 1: the answer is 1.
- The whole string is one character (`GGGG`, or 10^6 `T`s): the answer is n.
- The longest block is at the very end (`ATTCGGG`): the classic place to forget an update.
- No repeats at all (`ACGT`): answer 1.

## 4. Think out loud: from first idea to best solution

The naive idea is to try every substring and check whether all its characters are equal: O(n^2) substrings, each checked in up to O(n), so O(n^3), or O(n^2) if each start extends until the first mismatch. Even O(n^2) is about 5 × 10^11 steps on a million identical characters, so it is not numbered as an approach; it serves as the reference in the tests. The fix is to stop restarting from every position: a block, once measured, never needs to be looked at again.

### Approach 1: Measure each block, then jump past it

#### What I say out loud

> "The string is a sequence of blocks. I'll find them one at a time: from the start of a block, move a second index forward while the character stays the same. The distance is the block's length. Then the next block starts exactly where that one ended, so I jump there. Every character is visited once."

#### Intuition

Starting a fresh scan at every position wastes work, because a position inside a block can never start a longer block than the block's own start. So only block starts matter, and the next block start is wherever the current block ends. This is the two-index "group consecutive equal elements" walk from [[a2-array-string-traversal|Array and String Traversal]].

#### Algorithm

1. Read the line `s`; let n be its length. Set `best = 0`, `i = 0`.
2. While `i < n`: set `j = i`; advance `j` while `j < n` and `s[j] == s[i]`. The block is `s[i..j−1]` with length `j − i`; update `best`. Set `i = j`.
3. Print `best`.

#### Why it is correct

- **Every block is measured exactly.** At the top of the loop, `i` is the first character of a block (true at 0, and after each jump `s[j] ≠ s[i]` or `j = n`). The inner loop stops at the first different character or the end of the string, so `j − i` is the block's full length.
- **No block is missed.** The jumps go from each block's start to the next block's start, so the blocks are visited in order until `i = n`.
- **The last block needs no special case.** The inner loop stops at `j = n`, and the update happens right after it, inside the outer loop.

#### Dry run

Input `ATTCGGGA`, n = 8

| i | s[i] | j after the inner loop | Block | Length | best |
|---|---|---|---|---|---|
| 0 | A | 1 | `A` | 1 | 1 |
| 1 | T | 3 | `TT` | 2 | 2 |
| 3 | C | 4 | `C` | 1 | 2 |
| 4 | G | 7 | `GGG` | 3 | 3 |
| 7 | A | 8 | `A` | 1 | 3 |

`i = 8 = n`, the loop ends. Output `3`.

#### Java code

```java title="Approach 1: measure each block and jump past it"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        String s = in.readLine().trim();
        int n = s.length();
        int best = 0;
        int i = 0;
        while (i < n) {
            int j = i;
            while (j < n && s.charAt(j) == s.charAt(i)) {
                j++;                          // extend the block that starts at i
            }
            best = Math.max(best, j - i);     // the block is s[i..j-1]
            i = j;                            // the next block starts where this one ended
        }
        System.out.println(best);
    }
}
```

#### Time complexity

**O(n)**, where n is the string length. The inner loop looks nested, but `j` only moves forward and `i` jumps to `j`, so the inner loop's total work over the whole run is n steps plus one failed comparison per block. Reading the line is also O(n).

#### Space complexity

**O(1) auxiliary space** beyond the input string itself (which `readLine` must hold: about 2 MB for 10^6 characters, as Java strings of these letters typically store one byte per character in current JDKs, but that is an implementation detail).

#### The bridge to the next approach

> "That's linear and correct, but there are two loops and two indices to get right. I can carry the same information in one counter: the length of the block that ends at the current character. Then it's a single loop with one comparison per step."

### Approach 2: One pass with a running block length

#### What I say out loud

> "I keep `run`, the length of the block ending at position i, and `best`. Each new character either equals the previous one, so `run` grows, or it doesn't, so `run` restarts at 1. I update `best` after every character, so the block at the end of the string is counted without an extra line after the loop."

#### Intuition

The only fact the next step needs about the past is how long the current block is. Equal neighbour: same block, one longer. Different neighbour: a new block of length 1. The longest block is the largest value `run` ever takes.

#### Algorithm

1. Read `s`. Set `best = 1`, `run = 1` (the first character is a block of length 1).
2. For `i` from 1 to n − 1: if `s[i] == s[i−1]`, `run++`; otherwise `run = 1`. Then `best = max(best, run)`.
3. Print `best`.

#### Why it is correct

**Invariant:** after processing position `i`, `run` is the length of the block that ends at `i`, and `best` is the longest block that ends anywhere in `0..i`.

- It holds after position 0: `run = best = 1`.
- If `s[i] == s[i−1]`, the block ending at `i` is the block ending at `i − 1` plus one character. If not, it is just `s[i]`. Either way the update sets `run` correctly, and taking the maximum keeps `best` correct.
- Every block ends at some position, so after the last position `best` is the longest block overall, including one that ends at n − 1.

The spoken version: "`run` is the length of the block ending here; equal neighbour extends it, different neighbour resets it to one. I take the max after every step, so the answer is the largest `run` ever seen, and the last block is counted like any other."

#### Dry run

Input `CCAAAG`, n = 6

| i | s[i−1], s[i] | Equal? | run | best |
|---|---|---|---|---|
| 0 | — | — | 1 | 1 |
| 1 | C, C | yes | 2 | 2 |
| 2 | C, A | no | 1 | 2 |
| 3 | A, A | yes | 2 | 2 |
| 4 | A, A | yes | 3 | 3 |
| 5 | A, G | no | 1 | 3 |

Output `3`.

#### Java code

```java title="Approach 2: one pass with a running length (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        String s = in.readLine().trim();
        int best = 1;                          // n >= 1, so the answer is at least 1
        int run = 1;                           // length of the block ending at i
        for (int i = 1; i < s.length(); i++) {
            if (s.charAt(i) == s.charAt(i - 1)) {
                run++;
            } else {
                run = 1;
            }
            best = Math.max(best, run);        // every step, so the last block counts
        }
        System.out.println(best);
    }
}
```

#### Time complexity

**O(n)**: one comparison and one `max` per character, plus O(n) to read the line. Measured as a fresh `java Main < input` run on 10^6 characters, both approaches took about 70–80 ms in total, most of it JVM start-up (an empty program takes about 60 ms on the same machine).

#### Space complexity

**O(1) auxiliary space** beyond the input string.

### Alternative: read characters as a stream, without storing the line

You could read the input one byte at a time from a buffered stream and keep only the previous character, `run` and `best`. That makes the auxiliary space O(1) including the input. It only wins when the input is too large to hold in memory, which a 10^6-character line (about a megabyte or two) is not; for this problem `readLine` is simpler and equally fast.

## 5. Comparison table

n = length of the string. No hashing or randomness, so expected and worst case agree.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Naive: check every substring (prose only) | O(n^2) to O(n^3) | O(n^2) to O(n^3) | O(1) |
| 1. Measure each block and jump | O(n) | O(n) | O(1) beyond the input string |
| 2. Running block length | O(n) | O(n) | O(1) beyond the input string |
| Alt. Byte-by-byte stream | O(n) | O(n) | O(1) including the input |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Naive | Matches the definition word for word | Far too slow at 10^6 | Only as a test reference |
| 1. Measure each block | Makes the blocks explicit; last block handled by the loop shape | Two loops and two indices; the amortized argument must be explained | When you also need each block's start and end (run-length encoding) |
| 2. Running length | One loop, one comparison per step | Easy to break by moving the `max` into the `else` branch | The default answer |
| Alt. Stream | Constant memory even for huge inputs | More I/O code | Inputs too large for memory |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2, with the `max` taken after every character.

**Is it optimal?** In the worst case a correct algorithm must inspect essentially every character (changing any single unread character could create a longer block), so there is an Ω(n) worst-case lower bound, and Approach 2 is O(n) with O(1) extra space.

**When to stop:** right there. Mention Approach 1 only if the interviewer wants run-length encoding next.

## 7. Interview script: code it and test it

### What I say while coding

> "`BufferedReader.readLine()`, trimmed. A million characters on one line is fine for it."

> "`best` and `run` both start at 1, because the string has at least one character."

> "The loop starts at index 1 and compares with `i − 1`, so I never read before the start."

> "I update `best` after every character, inside the loop, not when a block ends. That way there is no final update to forget."

### Testing out loud

**Normal case:** `ATTCGGGA`. `run` goes 1, 2, 1, 1, 2, 3, 1 for positions 1 to 7; `best` ends at 3. Correct.

**Longest block at the end:** `ATTCGGG`. `run` reaches 3 at the last position, and the `max` on that same iteration makes `best = 3`. A version that updates `best` only on a change would never see this block (section 11).

**n = 1:** `A`. The loop does not run; `best = 1` is printed.

**One repeated character:** `GGGG`. `run` goes 2, 3, 4; `best = 4`. For 10^6 `T`s it prints 1,000,000, which the tests check.

**No repeats:** `ACGT`. `run` resets to 1 every time; `best` stays 1.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | about 30 s | "Consecutive", n ≥ 1, one line, limits |
| Explain | about 30 s | Naive is O(n^2) or worse; one pass with a running length |
| Code | 1–2 min | Approach 2 |
| Trace | 1 min | `ATTCGGG`, `A`, `GGGG` |

The time should go into the end-of-string trace. If you are stuck, write the run lengths under each character of `ATTCGGGA` by hand; the update rule is visible in that row of numbers.

## 9. Interviewer challenges

### About correctness

#### Your inner `while` in Approach 1 is nested in another loop. Isn't that O(n^2)?

**What they are testing:** amortized reasoning about nested loops.

**How to reason:** count how far `j` moves in total, not per outer iteration.

**What I say:** "No. `j` never moves backwards, and `i` jumps to `j`, so across the whole run `j` advances at most n times. Each outer iteration adds one failed comparison, and there are at most n blocks. That's O(n) total."

**Nuance:** the naive version that restarts `j` from `i + 1` for every `i` is genuinely O(n^2) on a string of one repeated letter. The jump `i = j` is what makes the difference.

#### What happens if the longest block is at the very end?

**What they are testing:** whether you know the classic off-by-one in run-length code.

**How to reason:** check where `best` is updated relative to where a block ends.

**What I say:** "I update `best` after every character, including the last one, so a block that ends at the last position is counted in the final iteration. If I updated only when the character changes, the last block would never trigger an update, and `ATTCGGG` would print 2."

**Nuance:** the update-on-change style is fine if you add `best = max(best, run)` once after the loop. Updating every step is simpler to get right.

### About input and output

#### Why `BufferedReader` and not `Scanner`?

**What they are testing:** awareness of Java I/O cost at CSES input sizes.

**How to reason:** for a single line, both read all of it; the difference is overhead.

**What I say:** "`Scanner` tokenizes with regular expressions and is noticeably slower on large inputs. For one million-character line, `scanner.next()` would probably still pass, but `BufferedReader.readLine()` is the habit that keeps working when there are 10^6 separate numbers."

**Nuance:** `readLine` returns the line without its terminator (`\n`, `\r` or `\r\n`), so line endings are not a problem; the `trim()` only guards against stray spaces.

## 10. Follow-up questions the interviewer might ask

**"Also print which character forms the longest block, and where it starts."**
Record the start index whenever `best` improves: the start is `i − run + 1`. Same O(n) time, O(1) space.

**"Output the run-length encoding instead (`ATTCGGGA` → `A1T2C1G3A1`)."**
Approach 1 is the natural shape: each block gives one `char` and one length; append them to a `StringBuilder`. O(n) time, O(n) output.

**"What if you may change at most k characters to make the longest block?"**
That is a different problem: a sliding window where the window is valid if its length minus its most frequent letter's count is at most k, as in [[nc-longest-repeating-character-replacement|Longest Repeating Character Replacement]]. O(n) time with a count per letter.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Counting letters instead of blocks.** The answer for `ATATA` is 1, not 3: occurrences must be consecutive.
- **Assuming the nested loop in Approach 1 is quadratic.** It is linear because `i` jumps to `j`.

### Implementation mistakes

> [!MISTAKE] Updating the best only when the character changes
> With `if (equal) run++; else { best = max(best, run); run = 1; }` and no update after the loop, the last block is never compared. Run once: `ATTCGGG` prints 2 instead of 3, `GGGG` prints 0, and `A` prints 0 (with `best` starting at 0). `ATTCGGGA` still prints 3, which is why the examples alone do not catch it.

- **Starting `best` at 0 and the loop at index 1.** For `A` the loop never runs and the program prints 0. Start `best` at 1, or include position 0 in the loop.
- **Comparing `s[i]` with `s[i + 1]` and looping to n − 1 inclusive.** That reads one character past the end and throws `StringIndexOutOfBoundsException`.

## 12. Pattern recognition

**The pattern:** one-pass scan with a running state. The state is "how long is the block ending here", which is enough to extend or restart it, plus the best value seen.

**Signals in the problem statement:**

- "Longest consecutive", "longest block", "longest streak".
- Elements are compared only with their neighbour.
- A large n (10^6) that rules out anything quadratic.

**Related problems in this list:**

- [[cses-weird-algorithm|Weird Algorithm]]: the first CSES warm-up, where the lesson is the type of the values and buffered output.
- [[cses-increasing-array|Increasing Array]]: another one-pass scan whose state is a single number (the running maximum).
- [[nc-longest-repeating-character-replacement|Longest Repeating Character Replacement]]: the same "longest block of one letter", with k changes allowed.
- [[nc-longest-turbulent-subarray|Longest Turbulent Subarray]]: a running length that grows or resets based on the neighbour comparison.

**Takeaway:** for "longest run" problems, keep the length of the run ending at the current position and update the answer every step; then the last run needs no special case.

## 13. 60-second revision card

**Key insight:** the length of the block ending at `i` is one more than at `i − 1` if the characters match, otherwise 1.

**Invariant:** after position `i`, `run` is the block length ending at `i`, `best` the longest block ending in `0..i`.

**Complexity:** O(n) time, O(1) auxiliary space beyond the input line.

**Code skeleton:**

```java title="Repetitions in a few lines"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws IOException {
        String s = new BufferedReader(new InputStreamReader(System.in)).readLine().trim();
        int best = 1, run = 1;
        for (int i = 1; i < s.length(); i++) {
            run = s.charAt(i) == s.charAt(i - 1) ? run + 1 : 1;
            best = Math.max(best, run);
        }
        System.out.println(best);
    }
}
```

**Main traps:**

- Update `best` every step, or the last block is lost (`ATTCGGG` → 2).
- `best` starts at 1 because n ≥ 1.
- `readLine()`, not `Scanner`.

**What to say in one breath:** "I scan once, keeping the length of the block that ends at the current character: it grows on an equal neighbour and resets to one otherwise. I take the max after every character, so the final block counts. O(n) time, O(1) extra space."
