---
problemId: nc-product-of-array-except-self
title: Product of Array Except Self
source: neetcode
sourceUrl: https://leetcode.com/problems/product-of-array-except-self/
difficulty: medium
patterns: [arrays-hashing, hashing, prefix-sum]
relatedLessons: [a2-prefix-suffix, a2-array-string-traversal, a14-edge-cases, a14-deriving-optimization]
companies: []
timeToSolve: 20
---

## 1. Problem restatement

You get an integer array `nums`. Return a new array `answer` of the same length where `answer[i]` is the product of every element of `nums` except the one at position i. The solution must run in O(n) time and must not use division.

**Example 1**

- Input: `nums = [2, 3, 4, 5]`
- Output: `[60, 40, 30, 24]`
- Why: `answer[0] = 3 × 4 × 5 = 60`, `answer[1] = 2 × 4 × 5 = 40`, `answer[2] = 2 × 3 × 5 = 30`, `answer[3] = 2 × 3 × 4 = 24`.

**Example 2**

- Input: `nums = [3, 0, -2, 4]`
- Output: `[0, -24, 0, 0]`
- Why: every product that includes the 0 is 0. Only `answer[1]` leaves the 0 out: `3 × (−2) × 4 = −24`.

**What the problem statement guarantees**

- 2 ≤ `nums.length` ≤ 10^5.
- −30 ≤ `nums[i]` ≤ 30.
- The product of any prefix or any suffix of `nums` fits in a 32-bit integer, and so does every `answer[i]`.
- The algorithm must run in O(n) time without using the division operation.
- Follow-up in the statement: use O(1) extra space, where the output array does not count as extra space.

## 2. Practice first: try it before reading on

If you have not solved this problem yourself yet, stop here. The "no division" rule is the whole problem: it removes the shortcut most people think of first.

**How to practise**

1. Set a timer for 20 minutes and talk out loud.
2. Solve Example 2 by hand, and notice which factors each `answer[i]` is made of.
3. State the slow solution and its cost for n = 10^5.
4. Look for products that several answers share, and decide how to compute each shared piece once.
5. Code it, trace both examples, then try the follow-up's space limit.

> [!HINT] Hint 1: a small nudge
> Write `answer[2]` for a five-element array as a product. Which factors come before position 2, and which come after it? Does `answer[3]` reuse any of that work?

> [!HINT] Hint 2: the kind of tool you need
> Every answer is "the product of everything to my left" times "the product of everything to my right". Both of those can be built for all positions in a single sweep each, one from the left and one from the right, each step extending the previous one by one element.

> [!HINT] Hint 3: almost the whole plan
> Sweep left to right, writing into the output the product of everything strictly before each position (1 for position 0). Then sweep right to left with one running variable holding the product of everything strictly after the current position: multiply the output entry by it, then fold the current element into it. Trace Example 2 to check that zeros need no special case.

**Check yourself before revealing the walkthrough**

- [ ] My solution never divides, and runs in O(n)
- [ ] It returns `[0, -24, 0, 0]` for `[3, 0, -2, 4]` and `[0, 0, 0]` for `[0, 5, 0]`
- [ ] It handles n = 2: `[7, -3]` gives `[-3, 7]`
- [ ] I can say how much extra space it uses, and whether the output array counts

## 3. Interview script: understand the problem (≈2 min)

**Me:** For each position, I return the product of all the other elements. The result is a new array, same length. And I may not use division at all?

**Interviewer:** Correct, no division. And it should be O(n).

**Me:** Can the values be zero or negative?

**Interviewer:** Values are between −30 and 30, so yes to both.

**Me:** Zeros matter, I'll come back to them. How long is the array?

**Interviewer:** Between 2 and 10^5.

**Me:** So at least two elements: every answer is a product of at least one number, never an empty product I'd have to define. Values up to 30 in absolute value over 10^5 elements could produce enormous products. Is there a guarantee about size?

**Interviewer:** The product of any prefix or suffix fits in a 32-bit integer, and so does each answer.

**Me:** Then I'll use `int`, and I'll make sure the values I store are prefix or suffix products, so the guarantee covers them. Can I modify `nums`?

**Interviewer:** Better not.

**Me:** By hand on `[3, 0, -2, 4]`: position 0 multiplies 0, −2 and 4, which is 0. Position 1 skips the zero: 3 × −2 × 4 = −24. Positions 2 and 3 include the zero, so 0. Answer `[0, -24, 0, 0]`.

### Given constraints

| Constraint | How it shapes the solution |
|---|---|
| 2 ≤ n ≤ 10^5 | O(n²) is about 10^10 multiplications, too slow. Every answer has at least one factor. |
| −30 ≤ `nums[i]` ≤ 30 | Zeros occur, so "total product divided by `nums[i]`" would divide by zero even if division were allowed. Negatives occur, so signs flip; nothing changes in the algorithm. |
| Every prefix product, suffix product and `answer[i]` fits in 32 bits | `int` is enough for every value I store, provided each stored value is a prefix or suffix product or an answer. |
| O(n) time, no division | Rules out the quadratic loop and the "divide the total" shortcut. |
| Follow-up: O(1) extra space, output not counted | Reuse the output array as working storage. |

### Clarifications confirmed by the interviewer

| Clarification | How it shapes the solution |
|---|---|
| `nums` should not be modified | Working values go into the output array or local variables, not into `nums`. |

### My assumptions

| Assumption | Why I state it |
|---|---|
| "Extra space" excludes the returned array, as in the follow-up | Then the recommended version uses O(1) extra space. If the interviewer counts the output, nothing below O(n) is possible, because the output itself has n entries. |

### Edge cases I will keep in mind

- No zero, one zero, two or more zeros: `[2, 3, 4, 5]`, `[3, 0, -2, 4]`, `[0, 5, 0]`.
- Negative values, including an odd number of them.
- n = 2: each answer is simply the other element.
- The largest input, with products near the 32-bit limit.

## 4. Think out loud: from first idea to best solution

Throughout, **n** is the length of `nums`.

### Approach 1: Brute force (multiply the others for each position)

#### What I say out loud

> "Directly: for each i, multiply every `nums[j]` with j ≠ i. It's correct by definition, and it's n times n − 1 multiplications, about 10^10 for 10^5 elements, which is too slow. But it shows me the structure: answers for neighbouring positions share almost all of their factors, and I'm recomputing them every time."

#### Intuition

The definition of `answer[i]` is a product over all other positions; compute it literally.

#### Algorithm

1. For each i: set `product = 1`; for each j ≠ i, `product *= nums[j]`; store `answer[i] = product`.

#### Why it is correct

For each i, the inner loop multiplies exactly the elements at positions other than i, which is the definition of `answer[i]`.

One subtlety: a partial product here (everything before position i times a few elements after it) is neither a prefix nor a suffix, so the statement's guarantee does not cover it, and it can overflow `int`. For example, `[30, 30, 30, 30, 0, 30, 30, 30, 30, 0]` meets every guarantee (all its prefix and suffix products are at most 30^4 = 810,000 or 0), yet for i = 4 the inner loop reaches 30^8 ≈ 6.6 × 10^11 before it multiplies by the last zero. That does not break the result in Java: `int` multiplication is defined to wrap around modulo 2^32, so the final value is the true product modulo 2^32, and the true answer fits in an `int`, so the two are equal. That is a property of Java's arithmetic, not of the algorithm; in C++, signed overflow is undefined behaviour.

#### Dry run

`nums = [2, 3, 4, 5]`

| i | Factors multiplied | answer[i] |
|---|---|---|
| 0 | 3 × 4 × 5 | 60 |
| 1 | 2 × 4 × 5 | 40 |
| 2 | 2 × 3 × 5 | 30 |
| 3 | 2 × 3 × 4 | 24 |

#### Java code

```java title="Approach 1: brute force"
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] answer = new int[n];
        for (int i = 0; i < n; i++) {
            int product = 1;
            for (int j = 0; j < n; j++) {
                if (j != i) {
                    product *= nums[j];
                }
            }
            answer[i] = product;
        }
        return answer;
    }
}
```

#### Time complexity

**O(n²) in the worst case** (every case, in fact): n outer iterations, each with n − 1 multiplications. For n = 10^5 that is about 10^10.

#### Space complexity

**O(1) auxiliary space**, not counting the output array.

#### The bridge to the next approach

> "The obvious shortcut is to multiply everything once and divide by `nums[i]`. That's forbidden, and it's also fragile: with a zero in the array it divides by zero. So let me look at what `answer[i]` is made of instead. It's everything to the left of i times everything to the right of i. And 'everything to the left of i' is just 'everything to the left of i − 1' times `nums[i - 1]`. So all the left products come out of one sweep, all the right products out of another sweep, and each answer is one multiplication."

### Alternative: total product divided by `nums[i]` (not allowed)

The statement forbids division, but an interviewer may ask why it would be hard even if it were allowed. Dividing the total by `nums[i]` fails as soon as the array has a zero, and the fix needs cases:

- **No zeros:** `answer[i] = total / nums[i]`, exact because `nums[i]` divides the total.
- **Exactly one zero, at position z:** `answer[z]` is the product of all the other (non-zero) elements, and every other answer is 0, because it includes the zero.
- **Two or more zeros:** every answer is 0, because every "all but one" product still contains a zero.

It is O(n) time and O(1) extra space. It is worth one sentence to show you see it, and why the statement rules it out; then move on.

### Approach 2: Prefix and suffix product arrays

#### What I say out loud

> "Two helper arrays. `prefix[i]` is the product of `nums[0..i-1]`, so `prefix[0] = 1`, the empty product. `suffix[i]` is the product of `nums[i+1..n-1]`, so `suffix[n-1] = 1`. Each is filled in one sweep, extending the previous entry by one element. Then `answer[i] = prefix[i] * suffix[i]`."

> "Zeros need no special case: a zero to the left of i makes `prefix[i]` zero, and the zero at i itself is in neither product, which is exactly 'except self'."

#### Intuition

`answer[i]` = (product strictly left of i) × (product strictly right of i). Both families of products are running products, like the running sums in [[a2-prefix-suffix|Prefix and Suffix Arrays]], with 1 as the starting value instead of 0.

#### Algorithm

1. `prefix[0] = 1`; for i from 1 to n − 1: `prefix[i] = prefix[i - 1] * nums[i - 1]`.
2. `suffix[n - 1] = 1`; for i from n − 2 down to 0: `suffix[i] = suffix[i + 1] * nums[i + 1]`.
3. For each i: `answer[i] = prefix[i] * suffix[i]`.

#### Why it is correct

By induction, `prefix[i]` is the product of `nums[0..i-1]`: true for i = 0 (empty product, 1), and each step multiplies in the next element. The mirror argument gives `suffix[i]` = product of `nums[i+1..n-1]`. Every position other than i is in exactly one of the two ranges and position i is in neither, so the product is `answer[i]`.

**Overflow:** `prefix[i]` is the product of a prefix of `nums`, and `suffix[i]` of a suffix, so the statement guarantees both fit in an `int`; `prefix[i] * suffix[i]` is `answer[i]`, which is guaranteed to fit too. Every value this approach computes is covered by the guarantee.

#### Dry run

`nums = [2, 3, 4, 5]`

| i | nums[i] | prefix[i] (product before i) | suffix[i] (product after i) | answer[i] |
|---|---|---|---|---|
| 0 | 2 | 1 | 3 × 4 × 5 = 60 | 60 |
| 1 | 3 | 2 | 4 × 5 = 20 | 40 |
| 2 | 4 | 2 × 3 = 6 | 5 | 30 |
| 3 | 5 | 2 × 3 × 4 = 24 | 1 | 24 |

#### Java code

```java title="Approach 2: prefix and suffix arrays"
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] prefix = new int[n]; // prefix[i] = product of nums[0..i-1]
        int[] suffix = new int[n]; // suffix[i] = product of nums[i+1..n-1]
        prefix[0] = 1;
        for (int i = 1; i < n; i++) {
            prefix[i] = prefix[i - 1] * nums[i - 1];
        }
        suffix[n - 1] = 1;
        for (int i = n - 2; i >= 0; i--) {
            suffix[i] = suffix[i + 1] * nums[i + 1];
        }
        int[] answer = new int[n];
        for (int i = 0; i < n; i++) {
            answer[i] = prefix[i] * suffix[i];
        }
        return answer;
    }
}
```

#### Time complexity

**O(n) in the worst case**: three loops of at most n iterations, each doing one multiplication.

#### Space complexity

**O(n) auxiliary space**: the `prefix` and `suffix` arrays, 2n `int`s, plus the output, which is not counted.

#### The bridge to the next approach

> "The follow-up wants O(1) extra space. Where can I save? I'm required to return an n-element array anyway, so I can build the prefix products directly in it. For the suffix side, I only ever use `suffix[i]` once, at position i, as I sweep from the right; I don't need the whole array, just the current value. So one running variable replaces it."

### Approach 3: Output array as prefix, running suffix (recommended)

#### What I say out loud

> "First sweep, left to right: `answer[i]` = product of everything before i. Second sweep, right to left, with a variable `suffix` that starts at 1 and holds the product of everything after the current position. At each i, multiply `answer[i]` by `suffix`, and then multiply `suffix` by `nums[i]` so it's ready for i − 1. The order matters: use `suffix` first, then extend it, otherwise `nums[i]` would leak into its own answer."

#### Intuition

The same decomposition as Approach 2. The prefix products live in the output array, which has to be allocated anyway, and the suffix products are consumed in the same order they are produced, so only the latest one needs to exist.

#### Algorithm

1. `answer[0] = 1`; for i from 1 to n − 1: `answer[i] = answer[i - 1] * nums[i - 1]`.
2. `suffix = 1`; for i from n − 1 down to 0: `answer[i] *= suffix`; then `suffix *= nums[i]`.

#### Why it is correct

**The invariant of the second loop: when the loop reaches position i, `suffix` is the product of `nums[i+1..n-1]`, and `answer[i]` still holds the product of `nums[0..i-1]`.**

- Before the loop, i = n − 1: `suffix = 1` (empty product), and the first loop left `answer[n-1]` = product of everything before it.
- At position i, `answer[i] *= suffix` makes it left-product × right-product, which is the answer. Then `suffix *= nums[i]` makes it the product of `nums[i..n-1]`, the right-product for position i − 1. Position i − 1 has not been touched by the second loop, so it still holds its left-product.
- The loop visits every position once, so every entry ends as its answer.

**Overflow:** every value stored in `answer` during the first loop is a prefix product; every value of `suffix` is a suffix product (its last value, after position 0, is the whole array's product, which is also a prefix product); every final `answer[i]` is an answer. All are covered by the statement's guarantee.

**The 25-second version to say to the interviewer:**

> "Each answer is the product of everything to its left times everything to its right. The first pass writes the left products into the output. The second pass goes right to left with one variable holding the product of everything to the right; I multiply it in, then fold the current element into it. Zeros need no special case, because position i's own value is in neither product. O(n) time, O(1) extra space besides the output."

#### Dry run

`nums = [3, 0, -2, 4]` (the case with a zero)

After the first loop: `answer = [1, 3, 0, 0]` (1; 3; 3 × 0; 3 × 0 × −2).

| i | nums[i] | suffix before | answer[i] = answer[i] × suffix | suffix after (× nums[i]) |
|---|---|---|---|---|
| 3 | 4 | 1 | 0 × 1 = 0 | 4 |
| 2 | −2 | 4 | 0 × 4 = 0 | −8 |
| 1 | 0 | −8 | 3 × −8 = −24 | 0 |
| 0 | 3 | 0 | 1 × 0 = 0 | 0 |

Result `[0, -24, 0, 0]`. Position 1 is the only one whose two products both avoid the zero, because the zero sits at position 1 itself.

#### Java code

```java title="Approach 3: output array + running suffix (recommended)"
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] answer = new int[n];
        answer[0] = 1;
        for (int i = 1; i < n; i++) {
            answer[i] = answer[i - 1] * nums[i - 1]; // product of everything before i
        }
        int suffix = 1; // product of everything after i
        for (int i = n - 1; i >= 0; i--) {
            answer[i] *= suffix;
            suffix *= nums[i]; // extend only after use, so nums[i] never enters its own answer
        }
        return answer;
    }
}
```

#### Time complexity

**O(n) in the worst case**: two loops of n iterations with constant work each.

#### Space complexity

**O(1) auxiliary space**, beyond the returned array: one `int` variable and loop counters. Counting the output, O(n), which no solution can avoid.

## 5. Comparison table

n = length of `nums`. Nothing hashes, so expected and worst case coincide. Space excludes the returned array.

| Approach | Expected time | Worst-case time | Auxiliary space |
|---|---|---|---|
| 1. Brute force | O(n²) | O(n²) | O(1) |
| Alt. Divide the total | O(n) | O(n) | O(1) |
| 2. Prefix and suffix arrays | O(n) | O(n) | O(n) |
| 3. Output as prefix, running suffix | O(n) | O(n) | O(1) |

| Approach | Pros | Cons | When to pick it |
|---|---|---|---|
| 1. Brute force | Literal definition | About 10^10 steps at the limits | Baseline only |
| Alt. Divide the total | Short | Forbidden here; three zero cases; overflow-sensitive in general | When division is allowed and you handle zeros |
| 2. Prefix and suffix arrays | Easiest to explain and trace | 2n extra `int`s | As the step before Approach 3, or if clarity matters more than memory |
| 3. Output as prefix, running suffix | O(1) extra space, two short loops | The "use, then extend" order must be right | The answer to give |

## 6. Which solution to give, and when to stop optimizing

Give Approach 3, ideally after saying Approach 2 in a sentence or two: the arrays make the idea easy to see, and removing them is a small, explainable step. O(n) time is optimal in the worst case, since the output alone has n entries to write; O(1) extra space is optimal. Once both loops are traced on a zero case and the overflow guarantee is mapped to the stored values, stop.

## 7. Interview script: code it and test it

### What I say while coding

> "`answer[0] = 1`: nothing is to the left of position 0, and the empty product is 1."

> "First loop from 1: `answer[i] = answer[i - 1] * nums[i - 1]`. Note the `i - 1` on `nums`: I'm extending by the element *before* i, not by `nums[i]`."

> "Second loop from the right, `suffix` starts at 1. Multiply first, then extend. If I swapped those two lines, `nums[i]` would be in its own answer."

### Testing out loud

**No zeros:** `[2, 3, 4, 5]`. First loop: `[1, 2, 6, 24]`. Second loop multiplies by 1, 5, 20, 60 from the right: `[60, 40, 30, 24]`.

**One zero:** `[3, 0, -2, 4]`, traced above: `[0, -24, 0, 0]`.

**Two zeros:** `[0, 5, 0]`. First loop: `[1, 0, 0]`. Second loop: i = 2, `answer[2] = 0 × 1 = 0`, suffix 0; i = 1, `0 × 0 = 0`, suffix 0; i = 0, `1 × 0 = 0`. Result `[0, 0, 0]`: every position has another zero.

**Negatives:** `[-1, 2, -3]`. First loop: `[1, -1, -2]`. Second loop: i = 2, −2 × 1 = −2, suffix −3; i = 1, −1 × −3 = 3, suffix −6; i = 0, 1 × −6 = −6. Result `[-6, 3, -2]`. Check: 2 × −3 = −6, −1 × −3 = 3, −1 × 2 = −2.

**n = 2:** `[7, -3]`. First loop: `[1, 7]`. Second loop: `answer[1] = 7`, suffix −3; `answer[0] = 1 × −3 = −3`. Result `[-3, 7]`.

## 8. Time plan for the interview

| Phase | Time | What to get done |
|---|---|---|
| Clarify | 1–2 min | Zeros, negatives, size, the 32-bit guarantee, does the output count as space |
| Brute force and division | 1–2 min | Both in a sentence; why division fails on zeros |
| Left times right | 2–3 min | Approach 2 with a hand table |
| Reduce space | 2 min | Output array as prefix, running suffix |
| Code | 3–4 min | Two loops |
| Test | 3 min | No zero, one zero, two zeros, n = 2 |

The idea "left product times right product" is the step people get stuck on. If it does not come, write out `answer[i]` for every i of a five-element array as explicit products and look at the columns: the shared pieces are visible on paper.

## 9. Interviewer challenges

### About the design

#### Why not compute the total product and divide?

**What they are testing:** whether you see beyond the rule to the reason.

**How to reason:** run division on an input with one zero, then with two.

**What I say:** "Apart from being forbidden, it breaks on zeros. With one zero the total is 0, so every division gives 0, but the answer at the zero's position is the product of everything else, which can be non-zero; and dividing by that zero throws. I'd need to count zeros and handle 0, 1, and 2-or-more separately. Left times right needs no cases at all."

**Nuance:** under modular arithmetic (answers mod a prime p), division becomes multiplication by a modular inverse, which does not exist for elements divisible by p. Prefix and suffix products work in any setting where you can multiply, which is why they are the robust technique.

#### Why do you multiply `answer[i]` by `suffix` before updating `suffix`?

**What they are testing:** whether you understand the loop invariant.

**How to reason:** `suffix` must describe "strictly after i" at the moment it is used for position i.

**What I say:** "At position i, `suffix` must be the product of everything after i. If I extended it with `nums[i]` first, it would include `nums[i]` and position i would multiply by itself. On `[2, 3, 4, 5]` that returns `[120, 120, 120, 120]`: every entry becomes the full product."

**Nuance:** the first loop has the same issue in a different form: it must use `nums[i - 1]`, not `nums[i]`.

### About complexity

#### Is this really O(1) space? You allocate an n-element array.

**What they are testing:** whether you know the convention and say it explicitly.

**How to reason:** separate the output, which any solution must produce, from working memory.

**What I say:** "The returned array is the output, and the problem's follow-up says it doesn't count. Besides it I use one integer, so O(1) extra space. If you count the output, it's O(n), and no algorithm can do better, since it has to return n numbers."

**Nuance:** Approach 2 really uses 2n extra integers. The improvement is real, but only because the output array is used as scratch space before it holds the final values.

#### Can the products overflow?

**What they are testing:** whether you connect the guarantee to the code.

**How to reason:** list every value the code stores and check that each is a prefix product, a suffix product or an answer.

**What I say:** "Values up to 30 in absolute value over 10^5 elements could be astronomically large, but the statement guarantees every prefix and suffix product and every answer fits in 32 bits. In my code the first loop stores prefix products, `suffix` is always a suffix product, and the final entries are answers. So nothing I store overflows."

**Nuance:** the brute force multiplies partial products that are neither prefixes nor suffixes, and those can overflow; in Java it still returns the right answer, because `int` arithmetic wraps modulo 2^32 and the true answer fits. Without the guarantee, use `long` (products up to about 9.2 × 10^18), `BigInteger`, or answers modulo a prime.

## 10. Follow-up questions the interviewer might ask

**"Return the answers modulo 10^9 + 7, with no guarantee on size."**
Reduce after every multiplication, computing in `long`: map each element into `[0, MOD)` first (negative values need `Math.floorMod`), then `(a * b) % MOD` with both factors below MOD, so the product stays under about 10^18 and fits in a `long`. Same two loops, O(n) time, O(1) extra space. Division would now need modular inverses, which fail for multiples of the modulus; prefix and suffix products need none.

**"Many queries: the product of `nums[l..r]`."**
Prefix products with division answer it in O(1) only if no zeros and division is allowed. Robustly: a [[a12-segment-trees|segment tree]] or a sparse table over products, O(log n) or O(1) per query; or count zeros with prefix sums and keep prefix products of non-zero values modulo a prime.

**"Sum of all elements except self?"**
Here subtraction is allowed and has no zero problem: `answer[i] = total - nums[i]`, O(n) time, O(1) extra space. The reason products are harder is that division by zero is undefined while subtraction always works.

**"The array is a stream and you must answer as elements arrive?"**
Each `answer[i]` depends on elements that have not arrived yet, so nothing final can be output before the stream ends. You can maintain prefix products as you go, but the right-hand halves require the full input.

## 11. Common mistakes: reasoning and implementation

### Reasoning mistakes

- **Treating "no division" as a style rule.** It is the crux. Being able to say why division also fails on zeros shows you understood the problem, not just the rule.
- **Special-casing zeros in the prefix/suffix solution.** Not needed: position i's own value is in neither product. Extra zero logic only adds bugs.
- **Saying O(1) space without the caveat.** State that the output array is excluded, as the statement's follow-up does.

### Implementation mistakes

> [!MISTAKE] Extending the running suffix before using it
> Writing `suffix *= nums[i]` above `answer[i] *= suffix` puts each element into its own answer. On `[2, 3, 4, 5]` it returns `[120, 120, 120, 120]` instead of `[60, 40, 30, 24]`.

> [!MISTAKE] Using `nums[i]` instead of `nums[i - 1]` in the first loop
> `answer[i] = answer[i - 1] * nums[i]` makes `answer[i]` include the element at i. On `[2, 3, 4, 5]` the full method then returns `[60, 60, 60, 60]`: the first loop builds `[1, 3, 12, 60]`, products that include the element itself, and the second loop multiplies in the right-hand products.

- **Starting a product at 0.** The empty product is 1. With `answer[0] = 0` (or `suffix = 0`), every result is 0.
- **Dividing anyway.** Even with zero handling, the solution violates the statement.
- **Modifying `nums` to save space.** It changes the caller's data, and the follow-up does not need it.

## 12. Pattern recognition

**The pattern:** prefix and suffix aggregates. When each answer combines "everything before me" with "everything after me", compute the before-values in a left sweep and the after-values in a right sweep, and combine them.

**Signals in the problem statement:**

- "All elements except this one", or "everything to the left and to the right".
- An inverse operation (division, subtraction) is forbidden or unsafe.
- O(n) required, where the obvious answer recomputes almost the same thing for each position.

**Related problems in this list:**

- [[nc-trapping-rain-water|Trapping Rain Water]]: the water at each bar depends on the maximum to its left and the maximum to its right, a prefix and a suffix aggregate.
- [[nc-range-sum-query-2d-immutable|Range Sum Query 2D - Immutable]]: prefix sums precomputed once, in two dimensions.
- [[nc-maximum-product-subarray|Maximum Product Subarray]]: running products with zeros and sign flips.
- [[cses-static-range-sum-queries|Static Range Sum Queries]] (CSES): the basic prefix-sum table for range queries.

**Takeaway:** "except self" means "left part times right part"; build each in one sweep with 1 as the empty product, and keep only one running value when the sweep order matches the use order.

## 13. 60-second revision card

**Key insight:** `answer[i]` = (product of everything left of i) × (product of everything right of i). No division, so zeros need no special case.

**Invariant (second loop):** at position i, `suffix` = product of `nums[i+1..n-1]` and `answer[i]` = product of `nums[0..i-1]`. Use `suffix`, then extend it.

**Complexity:** O(n) time, O(1) extra space excluding the output. Every stored value is a prefix product, a suffix product or an answer, all guaranteed to fit in an `int`.

**Code skeleton:**

```java title="Left pass, right pass" fragment="public int[] productExceptSelf(int[] nums)"
int n = nums.length;
int[] answer = new int[n];
answer[0] = 1;
for (int i = 1; i < n; i++) answer[i] = answer[i - 1] * nums[i - 1]; // left products
int suffix = 1;
for (int i = n - 1; i >= 0; i--) {
    answer[i] *= suffix;   // times right product
    suffix *= nums[i];     // then extend
}
return answer;
```

**Main traps:**

- Use `suffix` before multiplying `nums[i]` into it.
- First loop multiplies by `nums[i - 1]`, not `nums[i]`.
- Empty products are 1, not 0.
- Division is forbidden, and would break on zeros anyway.

**What to say in one breath:** "Brute force is O(n²) and dividing the total is forbidden and breaks on zeros. Each answer is the product to the left times the product to the right. I write the left products into the output, then sweep from the right with one running suffix product, multiplying it in before extending it. O(n) time, O(1) extra space besides the output."
