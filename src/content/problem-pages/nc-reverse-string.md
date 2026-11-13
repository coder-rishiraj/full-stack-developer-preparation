---
problemId: nc-reverse-string
title: Reverse String
source: neetcode
sourceUrl: https://leetcode.com/problems/reverse-string/
difficulty: easy
patterns: [two-pointers]
relatedLessons: [a2-two-pointers, a2-array-string-traversal, a1-recursion, a14-edge-cases]
companies: []
timeToSolve: 5
---

## 1. Problem restatement

You get a `char[] s`. Reverse it **in place**: after the method returns, the same array must hold the characters in the opposite order. The method returns nothing, so the judge looks at the array it passed in. The extra memory you use must be O(1).

**Example 1**

- Input: `s = ['h', 'e', 'l', 'l', 'o']`
- Output: the array now holds `['o', 'l', 'l', 'e', 'h']`
- Why: the first character goes to the last slot, the second to the second-to-last, and so on. The middle `'l'` of this odd-length array stays where it is.

**Example 2**

- Input: `s = ['H', 'a', 'n', 'n', 'a', 'h']`
- Output: the array now holds `['h', 'a', 'n', 'n', 'a', 'H']`
- Why: reversal is on characters, not on letters ignoring case. `'H'` and `'h'` are different characters, so they trade places.

**What the problem statement guarantees**

- 1 ≤ `s.length` ≤ 10^5, so the array is never empty.
- Every `s[i]` is a printable ASCII character: letters, digits, the space and punctuation are all just characters to move.
- The work must be done in the array you are given, with O(1) extra memory.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. It takes five minutes, and the point is not the idea but a clean loop with the right stopping condition. Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 5 minutes and talk out loud.
2. Say what "O(1) extra memory" rules out before you write anything.
3. Write the code, then trace it on `['h', 'e', 'l', 'l', 'o']` and on `['a', 'b']`.
4. Count how many times each slot is written.

> [!HINT] Hint 1: a small nudge
> Where does `s[0]` have to end up? And the character that is currently there, where does it go? Look at those two slots as a pair.

> [!HINT] Hint 2: the kind of tool you need
> Slots pair up from the outside in: first with last, second with second-to-last. Two indices, one at each end, can walk toward each other and handle one pair per step.

> [!HINT] Hint 3: almost the whole plan
> Start one index at 0 and the other at `s.length - 1`. While the left one is smaller than the right one, swap the two characters through a temporary variable, then move both indices inward. Ask yourself what happens if you keep going until the left index reaches the end of the array.

**Check yourself before revealing the walkthrough**

- [ ] My method works for one character and for two
- [ ] It leaves the middle character of an odd-length array in place
- [ ] It uses a fixed number of extra variables, whatever the length
- [ ] I can say why stopping halfway is not an optimisation but a requirement

## 3. Interview script: understand the problem (≈1 min)

**Me:** So I reverse the array itself: after the call, the same `char[]` holds the characters back to front, and I return nothing.

**Interviewer:** Yes.

**Me:** And O(1) extra memory means I can't build a reversed copy and copy it back, even though that would leave the right contents.

**Interviewer:** Right. The copy is O(n).

**Me:** The array has at least one character, up to 10^5, all printable ASCII. So I don't need to think about surrogate pairs or combining characters: one `char` is one character here. Spaces and punctuation are moved like letters.

**Interviewer:** Correct.

**Me:** Let me do `['h', 'e', 'l', 'l', 'o']` by hand. Slot 0 and slot 4 trade: `o e l l h`. Slot 1 and slot 3 trade: `o l l e h`. Slot 2 is its own mirror, so it stays. Done after two swaps.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^5 | Never empty, so no special case for n = 0, though the loop I write handles it anyway. A recursive solution would go about 5 × 10^4 calls deep, which matters (section 4). Indices fit easily in an `int`. |
| Printable ASCII | One `char` is one character, so reversing `char`s reverses the text. No arithmetic on the characters, so no overflow question. |
| In place, O(1) extra memory | No second array and no recursion stack proportional to n. The reversal must happen by moving characters inside `s`. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| A reversed copy copied back does not count as in place | Approach 1 is only a baseline; the answer is the swap loop. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| Nobody else reads or writes `s` while the method runs | In-place reversal passes through half-reversed states. Single-threaded use is the normal assumption. |

### Edge cases I will keep in mind

- One character: nothing to do; the loop must not run.
- Two characters: exactly one swap.
- Odd length: the middle character stays put.
- A palindrome such as `racecar`: the result equals the input, and the swaps still happen.

## 4. Think out loud: from first idea to best solution

### Approach 1: Reversed copy, then copy back

#### What I say out loud

> "The simplest correct thing: make a copy of the array, then write the copy back in reverse order. That's O(n) time and clearly correct, but the copy is O(n) extra memory, which the problem rules out. I'll say it as a baseline and then remove the copy."

#### Intuition

Slot `i` must end up holding the character that was originally at `n − 1 − i`. If the originals are saved somewhere, each slot can be filled directly without worrying that its source has already been overwritten.

#### Algorithm

1. `copy = s.clone()`.
2. For each `i` from 0 to n − 1: `s[i] = copy[n − 1 − i]`.

#### Why it is correct

`copy` is never modified, so every read sees an original character, and each slot `i` receives exactly the character from position n − 1 − i.

#### Dry run

`s = ['a', 'b', 'c', 'd']`, `copy = ['a', 'b', 'c', 'd']`

| i | copy[n − 1 − i] | `s` afterwards |
|---|---|---|
| 0 | `d` | `d b c d` |
| 1 | `c` | `d c c d` |
| 2 | `b` | `d c b d` |
| 3 | `a` | `d c b a` |

The middle rows show why the copy is needed here: after step 1, the original `a` and `b` exist only in `copy`.

#### Java code

```java title="Approach 1: reversed copy, copied back"
class Solution {
    public void reverseString(char[] s) {
        int n = s.length;
        char[] copy = s.clone();          // O(n) extra memory: this is what breaks the requirement
        for (int i = 0; i < n; i++) {
            s[i] = copy[n - 1 - i];
        }
    }
}
```

#### Time complexity

**O(n)**, where n is `s.length`: one O(n) clone and one O(n) loop.

#### Space complexity

**O(n) auxiliary space** for the copy. That is the reason this is not an acceptable answer, even though the array ends up correct.

#### The bridge to the next approach

> "Why did I need the copy? Because writing slot 0 destroys the character that slot n − 1 needs. But slot 0 and slot n − 1 need exactly each other's characters. If I handle them together, as a swap, nothing is lost, and the only temporary storage is one `char`. Then the same holds for slots 1 and n − 2, and so on inward."

### Approach 2: Swap from both ends (recommended)

#### What I say out loud

> "Two indices, `left` at 0 and `right` at n − 1. While `left < right`, swap `s[left]` and `s[right]` with a temporary, then move `left` up and `right` down. When they meet or cross, every pair has been swapped exactly once."

> "It has to stop in the middle. If I ran the loop over the whole array, every pair would be swapped twice and I'd put the array back the way it was."

#### Intuition

Reversal pairs slot `i` with slot `n − 1 − i`, and the pairs do not overlap. Each pair is an independent two-element exchange, so the pairs can be processed one at a time, from the outside in, with a single `char` of temporary storage. This is the opposite-ends form of [[a2-two-pointers|Two Pointers]].

#### Algorithm

1. `left = 0`, `right = n − 1`.
2. While `left < right`: swap `s[left]` and `s[right]` through `tmp`; `left++`; `right--`.

#### Why it is correct

**The invariant:** at the top of each iteration, `right = n − 1 − left`; slots outside `[left, right]` already hold their final characters, and slots inside `[left, right]` still hold their original characters.

- At the start the outside is empty and nothing has been touched.
- A step swaps `s[left]` and `s[right]`, both still original. Slot `left` now holds the original `s[n − 1 − left]` and slot `right` holds the original `s[left]`, which is what reversal wants for both. The window shrinks by one at each end, so the invariant holds again.
- The loop stops when `left ≥ right`. Then the inside is empty (even n) or the single middle slot, which is its own mirror (odd n). Every slot holds its final character.
- Each pair is swapped exactly once, because the window only shrinks.

**The 20-second version to say to the interviewer:**

> "Slot i and slot n − 1 − i need each other's characters, and those pairs don't overlap. So I swap them pair by pair from the outside in. Everything outside the window is final, everything inside is untouched. When the pointers meet, the window is empty or a single middle slot, so it's reversed. One temp variable, n/2 swaps."

#### Dry run

`s = ['h', 'e', 'l', 'l', 'o']`

| left | right | Swap | `s` afterwards |
|---|---|---|---|
| 0 | 4 | `h` ↔ `o` | `o e l l h` |
| 1 | 3 | `e` ↔ `l` | `o l l e h` |
| 2 | 2 | stop: `left` is not `< right` | `o l l e h` |

Two swaps for five characters; the middle `l` is never touched.

#### Java code

```java title="Approach 2: swap from both ends (recommended)"
class Solution {
    public void reverseString(char[] s) {
        int left = 0;
        int right = s.length - 1;
        while (left < right) {
            char tmp = s[left];
            s[left] = s[right];
            s[right] = tmp;
            left++;
            right--;
        }
    }
}
```

#### Time complexity

**O(n) in every case.** The loop runs ⌊n/2⌋ times, each a constant-time swap.

#### Space complexity

**O(1) auxiliary space**: two indices and one `char`.

### Alternative: recursion

A recursive version, `reverse(s, left + 1, right − 1)` after swapping the ends, does the same swaps. It is **not** O(1) extra memory: each call adds a stack frame, and the depth is ⌊n/2⌋, up to 5 × 10^4 frames at the largest input. Java does not guarantee tail-call elimination, so the frames really are kept. Whether that depth actually overflows depends on the JVM's thread stack size, which you do not control in an interview, so it is a risk as well as a violation of the memory requirement. Mention it only to say why you do not use it.

## 5. Comparison table

n = `s.length`. Nothing hashes or sorts, so expected and worst case coincide.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Reversed copy | O(n) | O(n) | O(n) |
| 2. Swap from both ends | O(n) | O(n) | O(1) |
| Alternative: recursion | O(n) | O(n) | O(n) stack |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Reversed copy | No aliasing to think about | Breaks the O(1) memory requirement | Only as a baseline sentence |
| 2. Swap from both ends | O(1) memory, ⌊n/2⌋ swaps, five lines | None worth naming | The answer |
| Alternative: recursion | Short | O(n) stack, depth up to 5 × 10^4 | Never here |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2.

**Is it optimal?** Yes, in the model where an algorithm reads and writes one array slot at a time. In the worst case, for example when every character differs from its mirror, every slot except the middle one of an odd-length array holds the wrong character and must be written at least once, so at least n − 1 writes are needed: an Ω(n) worst-case lower bound. (If the input is a palindrome, no slot needs to change, but an algorithm cannot know that without reading every character outside the middle, which is again Ω(n) in the worst case.) The swap loop does ⌊n/2⌋ swaps, n writes in total, with O(1) extra space.

**When to stop:** once the swap loop is written and traced on an odd and an even length. There is nothing further to optimise; do not spend time on XOR-swap tricks.

## 7. Interview script: code it and test it

### What I say while coding

> "`left` at 0, `right` at the last index. The condition is `left < right`, strictly: when they're equal it's the middle slot, which doesn't move."

> "Swap through a temporary `char`, then move both pointers. No return value; the caller sees the array."

### Testing out loud

**Normal case:** `['h', 'e', 'l', 'l', 'o']`. Swap 0 and 4, then 1 and 3, then `left == right == 2` stops the loop. Result `o l l e h`. Correct.

**Even length:** `['H', 'a', 'n', 'n', 'a', 'h']`. Swap 0 and 5, 1 and 4, 2 and 3; then `left = 3`, `right = 2`, stop. Result `h a n n a H`.

**One character:** `['a']`. `left = 0`, `right = 0`, the loop does not run. The array is unchanged, which is its reverse.

**Two characters:** `['a', 'b']`. One swap, then `left = 1`, `right = 0`, stop. Result `b a`.

**Palindrome:** `racecar`. Three swaps of equal characters; the array is unchanged, as it should be.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 30 s | In place, O(1) memory, at least one character |
| Baseline | 15 s | Copy and copy back, O(n) memory, not coded |
| Code | 1–2 min | Approach 2 |
| Trace | 1–2 min | Odd length, even length, one character |

This is usually a warm-up or the first part of a longer question. Finish it quickly and cleanly, and save the time for what comes next. If you freeze, draw the array and connect each slot to its mirror with an arc: the pairs are the algorithm.

## 9. Interviewer challenges

### About correctness

#### Why `left < right` and not `left <= right`, and not a loop over the whole array?

**What they are testing:** whether you understand the stopping point or memorised it.

**How to reason:** count how many times each pair is swapped under each condition.

**What I say:** "`left <= right` is harmless: the extra iteration swaps the middle slot with itself. Looping `i` over the whole array and swapping `i` with `n − 1 − i` is wrong: each pair gets swapped twice, once from each side, so the array ends up exactly as it started."

**Nuance:** the full-loop bug is silent on palindromes, where the answer equals the input, so a test with only `racecar` would not catch it.

#### Is your solution really O(1) space? What about recursion?

**What they are testing:** whether you count the call stack as memory.

**How to reason:** each recursive call adds a frame that lives until the deepest call returns.

**What I say:** "The loop uses two `int`s and a `char`, whatever n is. A recursive version makes ⌊n/2⌋ nested calls, so O(n) stack, up to 5 × 10^4 frames here, and Java does not guarantee to remove tail calls. That's O(n) memory and a stack-overflow risk."

**Nuance:** in a language that guarantees tail-call elimination, a tail-recursive version would run in constant stack, but that is a property of the language, not of the algorithm.

### About trade-offs

#### Could you swap without a temporary, with XOR?

**What they are testing:** whether you know the trick and its trap, and judge whether it is worth it.

**How to reason:** `a ^= b; b ^= a; a ^= b;` swaps two distinct variables. If both refer to the same slot, the first line sets it to zero.

**What I say:** "Yes, `s[l] ^= s[r]; s[r] ^= s[l]; s[l] ^= s[r];`, and with `left < right` the two slots are always distinct, so it's safe here. But it saves one local variable, which is not memory that matters, and it's harder to read. I'd keep the temporary."

**Nuance:** with `left <= right`, the XOR version would zero the middle character of an odd-length array, so the trick and the loose condition together are a real bug.

## 10. Follow-up questions the interviewer might ask

**"What if you get a `String` instead of a `char[]`?"**
Java strings are immutable, so "in place" is impossible: convert with `toCharArray()`, run the same swap loop, and build a new `String`, or use `new StringBuilder(str).reverse()`. O(n) time and O(n) space, which is the minimum because the result is a new string.

**"Reverse only a part of the array, from index `i` to index `j`."**
Start `left = i`, `right = j` and run the same loop. O(j − i) time, O(1) space. This is the building block of [[nc-rotate-array|Rotate Array]], which rotates by reversing the whole array and then two parts of it.

**"Reverse the order of the words in a sentence, in place."**
Reverse the whole array, then reverse each word back; each character is swapped at most twice in total. O(n) time, O(1) extra space.

**"What if the text could contain any Unicode, such as emoji?"**
Then one character can be two `char`s (a surrogate pair), and reversing `char`s would split it into an invalid sequence. You would reverse by code point instead, or by grapheme cluster if combining marks matter. The constraints here (printable ASCII) rule this out, which is worth saying in one sentence.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Treating a copy-and-copy-back as in place.** The array ends up right, but the memory is O(n). The statement asks for O(1).
- **Calling recursion O(1) space** because it allocates no array. The stack frames are memory.

### Implementation mistakes

> [!MISTAKE] Swapping across the whole array
> `for (int i = 0; i < n; i++) swap(s, i, n - 1 - i)` swaps each pair twice and leaves the array unchanged. Stop at the middle: `left < right`, or `i < n / 2`.

- **`right = s.length`** instead of `s.length - 1`: the first swap reads past the end and throws `ArrayIndexOutOfBoundsException`.
- **Assigning without a temporary,** `s[left] = s[right]; s[right] = s[left];`: the second line copies back the value just written, so both slots end up holding the right-hand character.
- **Returning a new array** from a `void` method's logic and assigning it to the parameter: `s = reversed` changes the local reference only; the caller's array is untouched.

## 12. Pattern recognition

**The pattern:** two pointers from opposite ends moving toward each other, handling one mirror pair per step.

**Signals in the problem statement:**

- "In place", "reverse", "O(1) extra memory".
- A rule that relates position `i` to position `n − 1 − i`.

**Related problems in this list:**

- [[nc-valid-palindrome|Valid Palindrome]]: the same pointers, comparing instead of swapping, and skipping characters that do not count.
- [[nc-valid-palindrome-ii|Valid Palindrome II]]: the same comparison with one deletion allowed.
- [[nc-rotate-array|Rotate Array]]: three in-place range reversals.
- [[nc-merge-strings-alternately|Merge Strings Alternately]]: two indices over two sequences, a simpler cousin of the same bookkeeping.
- [[nc-reverse-linked-list|Reverse Linked List]]: reversal again, but with pointers instead of indices.

**Takeaway:** when slot `i` and slot `n − 1 − i` belong together, walk two pointers in from both ends and handle each pair once; stop when they meet.

## 13. 60-second revision card

**Key insight:** slot `i` and slot `n − 1 − i` need each other's characters, so swap them pair by pair.

**Invariant:** slots outside `[left, right]` are final; slots inside are untouched originals.

**Complexity:** O(n) time, ⌊n/2⌋ swaps, O(1) auxiliary space. Ω(n) worst-case lower bound: when every character differs from its mirror, every slot except an odd-length middle must be written.

**Code skeleton:**

```java title="Reverse String in seven lines"
class Solution {
    public void reverseString(char[] s) {
        for (int l = 0, r = s.length - 1; l < r; l++, r--) {
            char t = s[l]; s[l] = s[r]; s[r] = t;
        }
    }
}
```

**Main traps:**

- Stop at the middle, or every pair is swapped twice.
- Swap through a temporary.
- Recursion is O(n) stack, not O(1).

**What to say in one breath:** "Two pointers at both ends; swap and move inward while left is less than right. Each mirror pair is swapped once, outside the window is final, inside is untouched. O(n) time, O(1) space, and recursion would cost O(n) stack, so I use the loop."
