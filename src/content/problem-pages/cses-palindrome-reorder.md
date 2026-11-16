---
problemId: cses-palindrome-reorder
title: Palindrome Reorder
source: cses
sourceUrl: https://cses.fi/problemset/task/1755
difficulty: easy
patterns: [introductory, frequency-counting, strings, construction]
relatedLessons: [a1-strings-stringbuilder, a2-frequency-counting, a3-counting-sort, a9-permutations, a1-java-syntax-competitive, a14-brute-force-first]
companies: []
timeToSolve: 15
---

## 1. Problem restatement

You get a string of capital letters A–Z. Rearrange its letters so that the result is a palindrome (it reads the same forwards and backwards) and print it. Any such palindrome is accepted. If no arrangement is a palindrome, print `NO SOLUTION`. This is a whole program: it reads standard input and writes standard output.

**Example 1**

- Input: `AAAACACBA`
- Output: `AACABACAA` (the statement's answer; `AAACBCAAA` is equally correct)
- Why: the input has six A, two C and one B. `AACABACAA` uses exactly those letters and reads the same backwards.

**Example 2** (an extra example from the official tests)

- Input: `ABZ`
- Output: `NO SOLUTION`
- Why: in a palindrome of length 3 the first and last letters are equal, but all three letters here are different.

**What the problem statement guarantees**

- 1 ≤ n ≤ 10^6, where n is the length of the string.
- The string consists only of the characters A–Z.
- Any valid palindrome is accepted.
- Time limit: 1 second (memory limit 512 MB).

## 2. Practice first: try it before reading on

If you have not solved this yourself yet, stop here. There are two questions: *when* is a palindrome possible, and how do you build one fast for a million letters? Everything below this section stays hidden until you ask for it.

**How to practise**

1. Set a timer for 15 minutes.
2. By hand, decide `AAB`, `AB`, `AABB`, `AAABB` and `ABC`: build a palindrome or explain why there is none.
3. State an exact rule for when a palindrome exists, and argue both directions.
4. Write the program, and estimate how long building and printing a million characters takes with your method.

Open a hint only after a few minutes without progress.

> [!HINT] Hint 1: a small nudge
> In a palindrome, position i and position n − 1 − i hold the same letter. What does that force about how many times each letter occurs?

> [!HINT] Hint 2: the kind of tool you need
> Letters come in mirror pairs, except possibly one letter in the exact centre when n is odd. So only the number of each letter matters. There are only 26 letters.

> [!HINT] Hint 3: almost the whole plan
> Count each letter. If more than one letter has an odd count, print `NO SOLUTION`. Otherwise build the left half from count/2 copies of each letter, put the odd letter's leftover copy in the middle, and append the left half reversed. Build it all in one `StringBuilder` and print once.

**Check yourself before revealing the walkthrough**

- [ ] I can prove my existence rule in both directions
- [ ] My program prints `ABA` (or another palindrome) for `AAB`, and `NO SOLUTION` for `AB`
- [ ] A letter with an odd count of 3 or more keeps all its copies in my output
- [ ] My output is built in one buffer, not with `+=` on a `String` or one `print` per character

## 3. Interview script: understand the problem (≈2 min)

Treat it as if an interviewer had posed it. The questions are about the exact output, which of many answers to give, and the size of the output.

**Me:** I rearrange all the letters, using each exactly as many times as it appears, into a palindrome. If several palindromes are possible, can I print any of them?

**Interviewer:** Yes, any valid one.

**Me:** And when it's impossible, exactly `NO SOLUTION` on one line. The input is one line of capitals A to Z, up to 10^6 characters?

**Interviewer:** Correct.

**Me:** Small cases. `AAB` gives `ABA`. `AB` can't work: a length-2 palindrome has two equal letters. `AABB` gives `ABBA`. `AAABB`: A three times, B twice; `ABABA` works, so an odd count is fine if it's only one letter. `ABC` fails. So far the rule looks like "at most one letter with an odd count".

**Interviewer:** Fine. Anything about performance?

**Me:** The output can be a million characters. I'll build it in one `StringBuilder` and print it once; appending to a `String` in a loop would copy the string every time.

### Given constraints

These are in the original problem statement.

| Constraint | How it shapes the solution |
|---|---|
| 1 ≤ n ≤ 10^6 | Trying arrangements is hopeless; O(n) or O(n log n). Read the line with `BufferedReader`. |
| Characters A–Z only | 26 counters in an `int[26]`, no map needed. |
| Any valid palindrome accepted | I choose the easiest one to build; my checks must test validity, not compare to one string. |
| Time limit 1 s | One output buffer, printed once. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| Any palindrome of the letters is accepted | I build the alphabetically smallest one, which falls out of the construction. |
| `NO SOLUTION` exactly, when impossible | That literal string, nothing else. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| The line may end in `\r\n` or have trailing spaces | I `trim()` the line; it costs nothing. |

### Edge cases I will keep in mind

- n = 1: the letter itself.
- n = 2 with different letters: `NO SOLUTION`.
- A letter with an odd count of 3 or more, such as `AAABB`: one copy in the middle, the rest split between the halves.
- One letter repeated 10^6 times: the output equals the input.
- Two odd counts in an otherwise huge string: `NO SOLUTION`, found after counting.

## 4. Think out loud: from first idea to best solution

**When is a palindrome possible?** In a palindrome of length n, position i and position n − 1 − i hold the same letter. For i < n − 1 − i these positions form pairs, and if n is odd the centre position (n − 1)/2 stands alone. Each pair contributes 2 to one letter's count and the centre contributes 1, so at most one letter (the centre one) has an odd count. Conversely, if at most one count is odd, the construction in Approach 2 builds a palindrome. So the exact rule is **at most one letter has an odd count**. (When n is even, the counts add up to an even number, so "at most one odd" means "none odd"; when n is odd, exactly one.)

### Alternative: try the arrangements in order

This rung is factorial: at n = 12 with all letters different it takes 1.2 s (measured) to try all 479,001,600 arrangements. It is not a numbered approach, but it is where everyone starts.

#### What I say out loud

> "The direct way: generate the arrangements of the letters and return the first one that is a palindrome. If I go through them in alphabetical order with next-permutation, starting from the sorted string, duplicate letters don't produce repeated arrangements, and the first palindrome I meet is the alphabetically smallest. But there can be n! arrangements: useless beyond a dozen letters, and the input has up to a million."

#### Intuition

A palindrome of these letters is one of their arrangements; check each.

#### Algorithm

1. Sort the letters (the smallest arrangement).
2. Repeat: if the current arrangement is a palindrome, print it and stop; otherwise move to the next larger arrangement.
3. If there is no next arrangement, print `NO SOLUTION`.

Next arrangement: find the rightmost i with p[i] < p[i + 1]; swap p[i] with the rightmost letter larger than it; reverse everything after i.

#### Why it is correct

- Next-permutation visits every distinct arrangement of the letters exactly once, in increasing alphabetical order, starting from the sorted one. So if any arrangement is a palindrome, the search reaches one, and the first it reaches is the smallest.
- It prints `NO SOLUTION` only after checking every arrangement.

#### Dry run

Input `AAAACACBA`. Sorted: `AAAAAABCC`. There are 9! / (6! · 1! · 2!) = 252 distinct arrangements.

| Step | Arrangement | Palindrome? |
|---|---|---|
| 1 | `AAAAAABCC` | no |
| 2 | `AAAAAACBC` | no |
| 3 | `AAAAAACCB` | no |
| … | … | no |
| 56 | `AAACBCAAA` | yes: print it |

The 56th arrangement (counted with a script) is the first palindrome. Prints `AAACBCAAA`.

#### Java code

```java title="Alternative: try arrangements in alphabetical order (factorial time)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        char[] s = in.readLine().trim().toCharArray();
        String answer = firstPalindromicPermutation(s);
        System.out.println(answer == null ? "NO SOLUTION" : answer);
    }

    /** Visits the distinct orderings of s in increasing order; returns the first palindrome. */
    static String firstPalindromicPermutation(char[] s) {
        char[] p = s.clone();
        Arrays.sort(p);                            // the smallest ordering comes first
        do {
            if (isPalindrome(p)) {
                return new String(p);
            }
        } while (nextPermutation(p));
        return null;                               // no ordering reads the same both ways
    }

    static boolean isPalindrome(char[] p) {
        for (int i = 0, j = p.length - 1; i < j; i++, j--) {
            if (p[i] != p[j]) {
                return false;
            }
        }
        return true;
    }

    /** Rearranges p into the next larger ordering; false when p is already the largest. */
    static boolean nextPermutation(char[] p) {
        int i = p.length - 2;
        while (i >= 0 && p[i] >= p[i + 1]) {
            i--;                                   // p[i + 1..] is non-increasing
        }
        if (i < 0) {
            return false;
        }
        int j = p.length - 1;
        while (p[j] <= p[i]) {
            j--;                                   // the rightmost letter larger than p[i]
        }
        char t = p[i];
        p[i] = p[j];
        p[j] = t;
        for (int a = i + 1, b = p.length - 1; a < b; a++, b--) {
            t = p[a];
            p[a] = p[b];
            p[b] = t;                              // make the suffix as small as possible
        }
        return true;
    }
}
```

#### Time complexity

**O(A · n)** where A is the number of distinct arrangements visited, up to n! / (c_A! · c_B! · … · c_Z!) for letter counts c: each step is O(n). When there is no palindrome it visits all of them. Measured: 0.13 s for 11 different letters, 1.2 s for 12.

#### Space complexity

**O(n)** for the working copy.

#### The bridge to the next approach

> "Most arrangements are thrown away because a letter can't find its mirror partner. I already know the rule: letters must pair up, with at most one left over. So instead of searching, I can pair letters directly. If I sort the string, equal letters are adjacent, and pairing is a walk from left to right."

### Approach 1: Sort, then pair neighbours

#### What I say out loud

> "I sort the letters. Then I walk the sorted array: two equal neighbours are a pair, and one copy goes into the left half; a letter without a partner is the centre, and if I find a second such letter, there is no solution. The answer is the left half, the centre, and the left half reversed."

#### Intuition

In sorted order, each letter's copies are consecutive, so pairing consecutive equal letters pairs up every letter except one leftover per odd count.

#### Algorithm

1. Read the line into a `char[]` and sort it.
2. i = 0. While i < n: if s[i] = s[i + 1], append s[i] to `half` and advance by 2; otherwise, if a middle letter is already set, print `NO SOLUTION`; else set `middle = s[i]` and advance by 1.
3. Print `half + middle + reverse(half)`, built in one `StringBuilder`.

#### Why it is correct

- **Each letter's block is handled in isolation.** Pairs are taken greedily from the start of the block, so a block of c copies yields ⌊c/2⌋ pairs and, if c is odd, one unpaired letter at its end (the next element is a different letter or the end of the array).
- **`NO SOLUTION` exactly when two counts are odd.** An unpaired letter appears once per odd count; the second one triggers `NO SOLUTION`, which is correct by the rule above.
- **The output is valid.** `half` + `middle` + reverse(`half`) is a palindrome by construction, and it contains 2 · ⌊c/2⌋ copies of each letter plus the odd letter's extra copy: exactly c copies of every letter.

#### Dry run

Input `AAAACACBA`. Sorted: `AAAAAABCC`.

| i | s[i], s[i + 1] | Action | half | middle |
|---|---|---|---|---|
| 0 | A, A | pair | A | |
| 2 | A, A | pair | AA | |
| 4 | A, A | pair | AAA | |
| 6 | B, C | unpaired B | AAA | B |
| 7 | C, C | pair | AAAC | B |
| 9 | | end | | |

Output `AAAC` + `B` + `CAAA` = `AAACBCAAA`. For `ABZ`, A is unpaired at i = 0, B at i = 1: `NO SOLUTION`.

#### Java code

```java title="Approach 1: sort, then pair neighbours"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        char[] s = in.readLine().trim().toCharArray();
        int n = s.length;

        Arrays.sort(s);                            // equal letters become neighbours
        StringBuilder half = new StringBuilder(n / 2);
        char middle = 0;                           // 0: no unpaired letter yet
        int i = 0;
        while (i < n) {
            if (i + 1 < n && s[i] == s[i + 1]) {   // a pair: one copy on each side
                half.append(s[i]);
                i += 2;
            } else {                               // a letter left without a partner
                if (middle != 0) {
                    System.out.println("NO SOLUTION");
                    return;
                }
                middle = s[i];
                i++;
            }
        }
        StringBuilder out = new StringBuilder(n + 1);
        out.append(half);
        if (middle != 0) {
            out.append(middle);
        }
        out.append(half.reverse()).append('\n');
        System.out.print(out);
    }
}
```

#### Time complexity

**O(n log n)** for a comparison sort, then O(n) for the walk and the output. (For large `char[]` arrays, current JDKs actually sort by counting, in O(n + 65,536); that is an implementation detail of `Arrays.sort`, not part of its contract.) Measured: about 0.07 s for the whole program at n ≈ 10^6.

#### Space complexity

**O(n)** for the character array, the half and the output buffer.

#### The bridge to the next approach

> "The sort is only grouping letters, and there are just 26 of them. Counting them in an `int[26]` gives the same information in one pass, with no sort to explain. And I can build the half straight from the counts."

### Approach 2: Count letters, build half + middle + reversed half (recommended)

#### What I say out loud

> "I count each letter. If more than one count is odd, there's no palindrome. Otherwise the left half is count/2 copies of each letter from A to Z, the middle is the odd letter's extra copy if there is one, and the right half is the left half reversed. One pass to count, 26 checks, one pass to build: O(n)."

#### Intuition

A palindrome is a half, an optional centre and the mirror of the half. The counts tell me exactly what goes in each part.

#### Algorithm

1. Read the line; `count[c]++` for each character.
2. Find the letters with odd counts. If there are two or more, print `NO SOLUTION`.
3. `half` = for c from A to Z, count[c] / 2 copies of c.
4. Output `half`, then the odd letter (if any), then `half` reversed, from one `StringBuilder`.

#### Why it is correct

- **`NO SOLUTION` only when impossible:** two odd counts break the rule proved above.
- **Otherwise the output is a palindrome:** the right part is the exact mirror of the left, around an optional single centre.
- **It uses exactly the input's letters:** letter c appears 2 · ⌊count[c]/2⌋ times in the halves, plus once in the middle if count[c] is odd, which totals count[c].
- **It is also the alphabetically smallest palindrome** (not required, but useful for testing): a palindrome is determined by its first ⌊n/2⌋ letters, which must be exactly ⌊count[c]/2⌋ copies of each letter; the middle letter is forced; and the smallest arrangement of the half is the sorted one.

**The 20-second version:** "In a palindrome letters come in mirror pairs plus at most one centre letter, so at most one count may be odd, and that's also enough. I count the 26 letters, reject two odd counts, and print half the copies of each letter in order, the odd letter, and the half reversed, all from one `StringBuilder`."

#### Dry run

Input `AAAACACBA`. Counts: A = 6, B = 1, C = 2.

| Letter | count | Odd? | Added to half |
|---|---|---|---|
| A | 6 | no | AAA |
| B | 1 | yes (the only one) | (nothing; B is the middle) |
| C | 2 | no | C |

half = `AAAC`, middle = `B`, output `AAACBCAAA`. For `ABZ`: A, B and Z are odd, and the second one found triggers `NO SOLUTION`.

#### Java code

```java title="Approach 2: count letters, half + middle + reversed half (recommended)"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        String s = in.readLine().trim();
        int n = s.length();

        int[] count = new int[26];
        for (int i = 0; i < n; i++) {
            count[s.charAt(i) - 'A']++;
        }
        int oddLetter = -1;
        for (int c = 0; c < 26; c++) {
            if (count[c] % 2 == 1) {
                if (oddLetter != -1) {             // a second odd count: no palindrome
                    System.out.println("NO SOLUTION");
                    return;
                }
                oddLetter = c;
            }
        }
        StringBuilder half = new StringBuilder(n / 2);
        for (int c = 0; c < 26; c++) {
            for (int k = 0; k < count[c] / 2; k++) {
                half.append((char) ('A' + c));     // half of every letter, A to Z
            }
        }
        StringBuilder out = new StringBuilder(n + 1);
        out.append(half);
        if (oddLetter != -1) {
            out.append((char) ('A' + oddLetter));  // the one unpaired copy goes in the centre
        }
        out.append(half.reverse()).append('\n');
        System.out.print(out);
    }
}
```

#### Time complexity

**O(n + 26) = O(n):** one counting pass, 26 parity checks, and n characters appended. Measured: about 0.08 s for the whole program at n ≈ 10^6, JVM start included.

#### Space complexity

**O(1)** for the counts; O(n) for the output buffer, which holds the output itself.

## 5. Comparison table

n is the string length; the alphabet has 26 letters.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| Alt. Try arrangements in order | O(A · n), A = distinct arrangements visited | O(n! · n) with all letters different | O(n) |
| 1. Sort, pair neighbours | O(n log n) | O(n log n) (counting sort in current JDKs for large `char[]`) | O(n) |
| 2. Count, half + middle + mirror | O(n) | O(n) | O(26) counts plus the O(n) output |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| Alt. Arrangements | No insight needed; finds the smallest palindrome | Factorial; 1.2 s at 12 letters | Never beyond tiny inputs |
| 1. Sort and pair | Uses only "equal neighbours"; works for any alphabet | A sort that is not needed for 26 letters | Large or unknown alphabets |
| 2. Count | Linear, deterministic, simplest proof | Tied to a small known alphabet (use a map otherwise) | The answer to give |

## 6. Which solution to give, and when to stop optimizing

**The solution to give:** Approach 2. It is O(n), which is optimal since the whole output has n characters to write, its proof is the pairing argument, and it builds the alphabetically smallest palindrome without trying. State the existence rule before coding.

Stop there. The remaining risks are output speed (one `StringBuilder`), keeping all copies of an odd letter, and the exact `NO SOLUTION` text.

## 7. Interview script: code it and test it

### What I say while coding

> "The odd letter contributes count/2 copies to each half like every other letter, plus one in the middle. For `AAABB` that's half `AB`, middle `A`: `ABABA`."

> "I build the output in one `StringBuilder` with its final capacity and print it once. String concatenation in a loop would copy the whole string each time, quadratic at 10^6."

> "`half.reverse()` reverses the builder in place, so I append the left half to the output before reversing it."

### Testing out loud

**Example `AAAACACBA`:** half `AAAC`, middle `B`: `AAACBCAAA`. Different from the statement's `AACABACAA`, and equally valid: same letters, reads the same backwards.

**`ABZ`:** three odd counts, `NO SOLUTION`.

**`A`:** half empty, middle `A`: `A`.

**`AB`:** two odd counts: `NO SOLUTION`.

**`AAABB`:** A = 3 (odd), B = 2: half `AB`, middle `A`, output `ABABA`, all five letters kept.

**10^6 letters:** one counting pass and one buffer of 10^6 + 1 characters.

**Official tests:** all three programs on this page print a valid answer on the 12 official CSES tests stored with this site (n up to 15), run on a real JVM; each answer is checked for being a palindrome of the same letters, or `NO SOLUTION` exactly when none exists, rather than compared with one string. On those 12 tests the programs' outputs also happen to equal the official outputs, which are the alphabetically smallest palindromes too. The tests for this page add strings of 10^6 letters.

**About the site's Check panel:** it compares your output with the official one first, and a different valid palindrome is marked "check by hand". That is expected for this problem.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify, small cases | 3 min | Any palindrome accepted; `AAB`, `AB`, `AAABB` by hand |
| Existence rule | 2 min | At most one odd count, both directions |
| Construction | 2 min | Half, middle, mirror |
| Code | 4 min | Counts, odd check, one `StringBuilder` |
| Test | 3 min | Example, `ABZ`, `A`, `AAABB` |

If the rule does not come, draw the mirror pairs of a palindrome and ask what each pair contributes to a letter's count.

## 9. Interviewer challenges

### About correctness

#### Prove that one odd count is always fine.

**What they are testing:** the "if" direction, not only "only if".

**How to reason:** give a construction and check it uses every letter.

**What I say:** "With at most one odd count, I put ⌊c/2⌋ copies of each letter in the left half, the same in the mirrored right half, and the odd letter's remaining single copy in the centre. Each letter is used 2⌊c/2⌋ times, plus once if c is odd, which is c. The string is a palindrome because the right half is the reversed left half around a single centre."

**Nuance:** the rule depends only on parities, so for n even it reads "all counts even", and for n odd "exactly one odd".

#### Your output differs from the expected one. Why is it still right?

**What they are testing:** handling problems with many correct answers.

**How to reason:** state what the judge checks.

**What I say:** "The statement accepts any palindrome made of the input's letters. Mine reads the same backwards and has the same letter counts, so it's valid. My tests check exactly those two properties, not equality with one string."

**Nuance:** my programs happen to produce the alphabetically smallest palindrome, so they are also deterministic, which makes them easy to test; but that is my choice, not a requirement.

### About implementation

#### Why not `result += letter` or `System.out.print(letter)` in a loop?

**What they are testing:** Java string and output costs at 10^6 characters.

**How to reason:** `String` is immutable; every `System.out.print` call has a fixed overhead (locking, encoding).

**What I say:** "`+=` on a `String` copies the whole string each time, so building half a million characters is quadratic: my version with `+=` took 7.8 s at n ≈ 10^6. Printing one character per `print` call took 1.25 s, over the limit. One `StringBuilder` and one print takes 0.08 s. I measured all three."

**Nuance:** the time limit is 1 s; the slow variants are correct and still fail.

## 10. Follow-up questions the interviewer might ask

**"Print the alphabetically smallest palindrome."**
Approach 2 already does: the half in A-to-Z order, the forced middle, the mirror.

**"Count how many different palindromes can be made."**
Only the half is free: (⌊n/2⌋)! / ∏ ⌊c/2⌋!, a multinomial coefficient, modulo a prime with factorials and inverse factorials. O(n).

**"Characters can be any Unicode letter, not just A–Z."**
Count in a `HashMap<Character, Integer>` (or sort and pair as in Approach 1); the rule and construction are unchanged. O(n) expected or O(n log n).

**"Remove the fewest letters so that a palindrome can be made."**
Every odd count but one must lose a letter: remove max(0, odd − 1) letters, where odd is the number of letters with odd counts.

**"Is the string itself a palindrome, ignoring non-letters?"**
Two pointers from both ends, no counting: [[nc-valid-palindrome|Valid Palindrome]].

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **"Every count must be even."** That forbids odd-length answers such as `ABA`; one odd count is allowed.
- **"n odd means exactly one odd count, so check n's parity."** The parity of n is not enough: `ABC` has odd length and three odd counts. Count the odd letters.
- **Comparing with the sample output when testing.** Any palindrome of the letters is accepted; check validity.

### Implementation mistakes

> [!MISTAKE] Dropping the extra copies of the odd letter
> Adding to the half only the letters with an even count (and just the centre for the odd one) loses copies: for `AAABB` the output is `BAB`, three letters instead of five (verified). The odd letter contributes count/2 copies to each half, like every other letter, and one to the middle.

- **Building with `+=` or printing per character.** Correct but too slow at 10^6: 7.8 s and 1.25 s measured.
- **Reversing the half before appending it to the left side.** `StringBuilder.reverse()` works in place; append the left half first.
- **Printing `NO SOLUTION` with different wording or case.** The judge compares the text.

## 12. Pattern recognition

**The pattern:** counting a small alphabet, then constructing from the counts. Rearrangement problems ("can these letters form …?") depend only on the letter counts, so count first and decide existence from the counts, then build.

**Signals in the problem statement:**

- "Reorder", "rearrange", "permutation of the letters": the order of the input is irrelevant, only counts matter.
- Palindrome plus rearranging: the parity of the counts decides.
- A fixed small alphabet (A–Z): an `int[26]`, not a map or a sort.

**Related problems in this list:**

- [[nc-valid-anagram|Valid Anagram]]: two strings are rearrangements of each other exactly when their letter counts match.
- [[nc-group-anagrams|Group Anagrams]]: letter counts as the key that identifies rearrangements.
- [[cses-creating-strings|Creating Strings]]: listing all the rearrangements, which is where next-permutation is the right tool.
- [[nc-valid-palindrome|Valid Palindrome]]: checking a palindrome in place, with two pointers.

**Takeaway:** if a question is about rearranging, the letter counts are the whole input; decide existence from them and build the answer from them in one pass.

## 13. 60-second revision card

**Key insight:** a palindrome is mirror pairs plus at most one centre letter, so it exists exactly when at most one letter has an odd count.

**Invariant:** each letter contributes ⌊c/2⌋ copies to each half and, if c is odd, one centre copy.

**Complexity:** O(n) time, O(1) besides the output.

**Code skeleton:**

```java title="Palindrome Reorder, count and mirror"
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Main {
    public static void main(String[] args) throws IOException {
        String s = new BufferedReader(new InputStreamReader(System.in)).readLine().trim();
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) count[s.charAt(i) - 'A']++;
        int odd = -1;
        for (int c = 0; c < 26; c++) {
            if (count[c] % 2 == 1) {
                if (odd != -1) { System.out.println("NO SOLUTION"); return; }
                odd = c;
            }
        }
        StringBuilder half = new StringBuilder();
        for (int c = 0; c < 26; c++) for (int k = 0; k < count[c] / 2; k++) half.append((char) ('A' + c));
        StringBuilder out = new StringBuilder(half);
        if (odd != -1) out.append((char) ('A' + odd));
        System.out.println(out.append(half.reverse()));
    }
}
```

**Main traps:**

- At most one odd count, not "all even".
- The odd letter still contributes count/2 to each half.
- One `StringBuilder`, one print.

**What to say in one breath:** "Only letter counts matter. A palindrome pairs letters around at most one centre, so at most one count can be odd, and then half of each letter, the odd one in the middle and the mirror give a valid answer, the alphabetically smallest in fact. O(n) with 26 counters and one `StringBuilder`."
