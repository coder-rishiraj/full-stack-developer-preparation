---
summary: Interview problems are deliberately underspecified, and the first few minutes decide whether you solve the problem that was asked. You will learn which questions change the algorithm or the output, how to confirm the answers with examples, and what to do when the interviewer will not answer.
difficulty: beginner
minutes: 35
objectives:
  - Explain why interview prompts are underspecified and what clarifying signals to an interviewer
  - Choose the two to five questions that most change the algorithm or the output for a given problem
  - Turn the answers into a short written spec, confirmed by walking the given example and one edge example
  - State a reasonable assumption out loud when a question goes unanswered, and adapt when corrected
  - Trace how a single clarified rule (such as whether touching intervals merge) changes the code
---

## Introduction

An interviewer reads out: *"Given a list of meeting times, merge the ones that overlap."* You could start typing within ten seconds. Many candidates do, and many of them lose the round in those ten seconds, because the sentence leaves out half of what you need to know. Do `[1, 3]` and `[3, 5]` overlap? Is the list sorted? Can it be empty? Should you return a new list or modify the one you were given? Each answer changes the code, and two of them change it in a way that no amount of later testing will reveal, because your tests will be built on the same wrong assumption.

**Clarifying requirements** means asking a small number of targeted questions before you design anything, so that an ambiguous prompt becomes a concrete specification: what the input can look like, what exactly must be returned, how large the input can be, and which rules (in-place, invalid input, ties) apply. It usually takes two to four minutes of a forty-five-minute interview.

The habit matters for two reasons. In the interview itself, it is graded: most coding rubrics have a line for "understood the problem" or "gathered requirements", and an interviewer watching you ask the right question is collecting evidence for it. More importantly, it is the job. Engineers who start building before agreeing on what "done" means ship the wrong feature, and every team has a story about it. The interview is a forty-five-minute simulation of that first conversation.

This lesson is the first step of a sequence that the rest of the module follows: clarify, then [[a14-brute-force-first|describe a brute force]], then [[a14-deriving-optimization|derive the optimisation]], while [[a14-thinking-aloud|thinking aloud]], [[a14-clean-coding|writing clean code]] and finally [[a14-manual-testing|testing by hand]].

## Before you start

You need very little:

- **Big-O notation** — so that an answer like "n can be up to a million" means something to you. See [[a1-big-o]] and [[a1-time-complexity]].
- **A few standard problems** — the walkthroughs use Two Sum ([[a2-hashing]]), merging intervals ([[a2-intervals]]) and top-k frequency ([[a7-top-k]]). You do not need to have solved them; the lesson explains what each asks.

## The intuition

Think of a contractor asked to "build a deck behind the house". A good one does not show up the next morning with timber. They ask how big, what height, whether it needs stairs, and what it has to hold — a barbecue or a hot tub — because a hot tub changes the foundation, and finding that out after the posts are set means starting again.

Coding interview prompts work the same way. Most details do not matter, but a few change the foundation: whether the input is sorted decides between two pointers and a hash map; whether you return indices or values decides whether sorting is even allowed; whether the input can reach a million elements decides whether an O(n²) idea is acceptable. Your job in the first minutes is to find those few load-bearing details and settle them.

The analogy stops in one place. A homeowner rarely hides requirements on purpose, but an interviewer often does: the prompt is left vague precisely to see whether you notice. Asking is not a sign that you are lost. Not asking is a missed signal.

## Why interview prompts leave things out

Interview problems are short because they are spoken or pasted into a shared editor, and short descriptions are ambiguous. Some omissions are accidental, but many are designed. An interviewer who wants to know whether you think about duplicates will not write "the array may contain duplicates" — they will leave it out and see whether you ask.

There is also a practical reason. Most problems come with one or two examples, and examples are **partial specifications**: they show what the output looks like for one input but say nothing about inputs they do not cover. The example `[1,3],[2,6],[8,10],[15,18] → [1,6],[8,10],[15,18]` shows that overlapping intervals merge. It says nothing about touching intervals, empty input or unsorted input. If you treat the example as the full spec, you will fill the gaps with guesses.

## The four areas to ask about

Good clarifying questions fall into four areas. You will not ask about all four on every problem; the skill is choosing the questions in each area that would change *your* solution.

| Area | Typical questions | What the answer changes |
|---|---|---|
| **Input shape** | Can it be empty? Sorted? Duplicates? Negative numbers? Null entries? Characters limited to `a`–`z`? | Base cases; whether two pointers or binary search apply; whether a 26-slot array can replace a map |
| **Output** | Indices or values? One answer or all? Any order or a specific order? What if there is no answer? | Return type; whether you can sort (sorting loses original indices); early exit versus full enumeration; sentinel values |
| **Scale** | How large can `n` be? Range of values? Does it fit in memory? | The target time complexity; `int` versus `long`; recursion depth |
| **Rules** | May I modify the input? Is extra memory allowed? Will input always be valid? | In-place algorithms; defensive copies; whether to validate or throw |

A useful filter before asking anything: **would a different answer make me write different code?** "Are the numbers integers?" matters if you plan to use them as array indices or hash keys. "What language are the strings in?" usually does not. Questions that pass the filter are worth the time; questions that do not make you look like you are stalling.

### Scale is the question that picks the algorithm

Of all clarifying questions, "how large can the input be?" carries the most information, because it tells you how fast your solution has to be. A typical judge or interviewer expects something like 10⁷–10⁸ simple operations to be fine. So `n ≤ 20` hints at exponential search over subsets, `n ≤ 5,000` permits O(n²), and `n` up to 10⁵ or 10⁶ needs O(n log n) or O(n). The full table, and how to use it to steer the optimisation, is in [[a14-deriving-optimization]]. Here the point is to ask: knowing the bound before you design saves you from polishing a quadratic idea for a million-element input.

The value range matters too. If values can reach 10⁹ and you add two of them, the sum overflows Java's `int` (maximum 2,147,483,647). One question — "what range are the values in?" — tells you to use `long`. See [[a1-java-syntax-competitive]] for how overflow behaves in Java.

## Confirming with examples

Questions alone are not enough, because both sides can agree on words while picturing different things. "Overlapping" might mean "sharing at least one point" to you and "sharing a positive length of time" to the interviewer. Examples remove that gap.

Do two things before designing:

1. **Walk the given example aloud.** Say the input, say what you expect, and say *why*: "`[1,3]` and `[2,6]` share the range 2 to 3, so they become `[1,6]`." This confirms you read the problem the same way the interviewer did.
2. **Propose one edge example of your own** and state the output you think is correct: "And for `[1,3],[3,5]` I'd return `[1,5]` — is that right?" A concrete example is far easier for the interviewer to confirm or correct than an abstract question.

Then **write the spec down** in a comment or at the top of the shared editor: a few lines with input assumptions, output format and constraints. It costs thirty seconds, it is something you can point to later, and it is the source of the edge cases you will test at the end (see [[a14-edge-cases]] and [[a14-manual-testing]]).

## When the interviewer will not answer

Sometimes the reply is "what do you think?" or "your choice". That is not a trick; it is an invitation to make a sensible engineering decision and own it. Respond with an **explicit assumption** and a reason:

> "I'll assume the input fits in memory and isn't sorted, so I'll sort a copy. If it were already sorted I could skip that step and save the O(n log n)."

Three things make this work. You name the assumption clearly enough that it can be corrected. You pick the more general case when it costs little (handling unsorted input also handles sorted input). And you mention what would change if the assumption were different, which shows you understand why the question mattered. If the interviewer later says "actually, it's sorted", adapt without fuss.

## Worked walkthrough 1: Two Sum

The prompt: *"Given an array of integers and a target, find two numbers that add up to the target."*

| You ask | Typical answer | Why it matters |
|---|---|---|
| Return the two numbers, or their indices? | Indices | If indices are needed, sorting the array destroys them; that rules out the sort-and-two-pointers approach unless you sort index pairs |
| Is exactly one solution guaranteed? | Yes | You can return at the first match; otherwise you must decide what to return for none (empty array? `null`?) and for many |
| Can I use the same element twice? | No | Decides whether you check the map *before* inserting the current element |
| Is the array sorted? | No | Sorted input would allow O(1) extra space with two pointers |

Four short questions, and the solution is fully determined: a single pass with a hash map from value to index, checking for the complement before inserting the current element. The check-then-insert order follows directly from the answer to the third question; [[a2-hashing]] derives it in full.

## Worked walkthrough 2: merging intervals

The prompt from the introduction: *"Given a list of meeting times, merge the ones that overlap."* Here is how a strong candidate might open, with the interviewer's replies:

> **Candidate:** Let me restate it: I get a list of intervals, each with a start and an end, and I return a list where any intervals that overlap are combined into one. A few questions. Is the input sorted by start time?
>
> **Interviewer:** Not necessarily.
>
> **Candidate:** If one meeting ends at 3 and another starts at 3, do they count as overlapping?
>
> **Interviewer:** Yes, merge them.
>
> **Candidate:** Should I return a new list, or is it fine to sort and modify the input array?
>
> **Interviewer:** Leave the input alone.
>
> **Candidate:** And roughly how many intervals — thousands, millions?
>
> **Interviewer:** Up to 10⁴.
>
> **Candidate:** Great. So for the example, `[1,3],[2,6],[8,10],[15,18]` gives `[1,6],[8,10],[15,18]`, and for `[1,3],[3,5]` I'd return `[1,5]`. Empty input returns an empty list. With 10⁴ intervals, sorting at O(n log n) is comfortably fast.

Four questions, one restatement and two examples took about ninety seconds. Notice what each answer produced. "Not sorted" means a sort step. "Touching intervals merge" decides one comparison operator. "Leave the input alone" means copying before sorting. "10⁴" confirms that O(n log n) is fine and that nothing more clever is needed.

The program below implements the clarified spec, with the touching-interval rule as a parameter so you can see how much depends on it.

```java title="MergeIntervals.java"
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MergeIntervals {

    /**
     * Merges overlapping intervals. If mergeTouching is true, [1,3] and [3,5]
     * count as overlapping because they share the point 3.
     */
    static int[][] merge(int[][] intervals, boolean mergeTouching) {
        if (intervals.length == 0) return new int[0][];
        int[][] sorted = intervals.clone();               // clarified: do not mutate input
        Arrays.sort(sorted, (a, b) -> Integer.compare(a[0], b[0]));

        List<int[]> merged = new ArrayList<>();
        int[] current = sorted[0].clone();
        for (int i = 1; i < sorted.length; i++) {
            int[] next = sorted[i];
            boolean overlaps = mergeTouching ? next[0] <= current[1] : next[0] < current[1];
            if (overlaps) {
                current[1] = Math.max(current[1], next[1]);
            } else {
                merged.add(current);
                current = next.clone();
            }
        }
        merged.add(current);
        return merged.toArray(new int[0][]);
    }

    public static void main(String[] args) {
        int[][] meetings = {{3, 5}, {1, 3}, {8, 10}, {9, 12}};
        System.out.println("touching merges: " + Arrays.deepToString(merge(meetings, true)));
        System.out.println("touching stays:  " + Arrays.deepToString(merge(meetings, false)));
        System.out.println("input unchanged: " + Arrays.deepToString(meetings));
        System.out.println("empty input:     " + Arrays.deepToString(merge(new int[0][], true)));
    }
}
```

```output
touching merges: [[1, 5], [8, 12]]
touching stays:  [[1, 3], [3, 5], [8, 12]]
input unchanged: [[3, 5], [1, 3], [8, 10], [9, 12]]
empty input:     []
```

The difference between the first two lines is a single character: `<=` versus `<`. Both versions pass the interviewer's original example, because that example has no touching intervals. Had you guessed wrong and not asked, every test you wrote would have agreed with your guess, and the bug would surface only when the interviewer tried `[1,3],[3,5]`.

The third line shows the "leave the input alone" rule being honoured. `intervals.clone()` copies the outer array, so sorting it does not reorder the caller's array. The clone is shallow — both arrays point at the same inner `int[]` objects — which is why the code also clones `current` and `next` before changing an end time. Without those inner clones, `current[1] = ...` would silently edit the caller's intervals. A rule you clarified is a rule you then have to check in your own code.

> [!TIP] Put the spec in the code
> Comments such as `// clarified: do not mutate input` are worth writing in an interview. They show the interviewer that the answer was heard, and they remind you, twenty minutes later, why the copy is there.

## Worked walkthrough 3: top k frequent words

The prompt: *"Return the k most frequent words in a list."* The obvious approach is counting with a hash map and selecting the top k (see [[a2-frequency-counting]] and [[a7-top-k]]). The questions that matter:

- **How are ties ordered?** If `"love"` and `"i"` both appear twice and k = 1, which wins? A common answer is "alphabetical order breaks ties". That turns a frequency-only comparator into a two-key comparator — higher count first, then smaller word first — and it changes which heap you use for the top-k selection. Get it wrong and the output differs whenever counts tie, which in word data is constantly.
- **Must the output be sorted?** "Most frequent first" means you cannot return the heap's contents in arbitrary order; you must sort or drain it.
- **What if k exceeds the number of distinct words?** Return them all, or is that invalid input? Usually the problem guarantees `k` is valid, but asking costs five seconds.
- **Case and punctuation?** Is `"The"` the same word as `"the"`? For a cleaned-up interview list the answer is usually "assume lowercase words", but for a real text it would matter enormously.

The tie-break question is the one that most candidates miss and the one that most changes the code. It is also an example of a general rule: **whenever an answer involves ordering, ask what happens on ties.**

## How many questions, and when to stop

Two to five well-chosen questions is typical. Fewer than two on a non-trivial problem usually means something load-bearing was missed. More than six or seven, especially questions that would not change your code, starts to look like stalling, and it uses time you will need later.

Prioritise in this order: questions that change the **algorithm** (scale, sortedness, duplicates), then questions that change the **output contract** (indices versus values, order, no-answer case), then questions that change **edge handling** (empty input, invalid input). You can also defer the last group: "I'll come back to empty input when I test" is fine, as long as you do come back.

If the interviewer signals impatience — "assume standard constraints" or "let's get to the approach" — take the hint. State your remaining assumptions in one sentence and move on.

> [!NOTE] Coding versus system design
> In a coding round you clarify inputs, outputs and edge cases. In a system design round (see [[d3-parking-lot]] for a design-flavoured example) you clarify actors, scale, latency and consistency requirements, and the clarification phase is longer — often five to ten minutes — because the design depends on it even more heavily. The skill is the same: find the details that change the solution.

## Common mistakes

> [!MISTAKE] Asking, then ignoring the answer
> The interviewer says "the array may be empty", and ten minutes later the code reads `nums[0]` on the first line. Asking only helps if the answer lands in the code. Write the clarified rules down where you can see them, and check your code against them before declaring it done.

**Treating the example as the whole spec.** Examples show typical cases. They rarely include empty input, duplicates, negative numbers or ties. If your understanding comes only from the example, the gaps are filled by assumption.

**Asking generic questions.** "Can the input be null?" asked mechanically on every problem tells the interviewer little. "If two words have the same count, which comes first?" tells them you have already thought about how the output will be built.

**Asking ten questions before saying anything about an approach.** Clarifying is a few minutes, not a third of the interview. If you have many questions, ask the ones that change the algorithm now and park the rest.

**Assuming silently.** If you decide that the input is sorted because the example happened to be sorted, and never say so, the interviewer cannot correct you. A stated assumption that turns out wrong costs a minute. An unstated one can cost the round.

**Returning the wrong type.** Returning values when indices were asked for, or a 1-based index when 0-based was expected, fails every test even when the algorithm is perfect.

## Interview perspective

Interviewers grade this phase on whether your questions were *relevant* and whether the answers *shaped your solution*. A candidate who asks three pointed questions and then writes code that visibly reflects each answer scores far better than one who runs through a memorised checklist.

> [!INTERVIEW] What a strong opening sounds like
> "So I'm given an unsorted list of intervals and I return the merged list without modifying the input. Touching intervals merge, and n is up to ten thousand, so sorting first is affordable. Let me check the example: `[1,3]` and `[2,6]` overlap on 2 to 3, so they become `[1,6]`, and the other two stand alone. Sound right?"

Questions you might be asked about this skill:

- **"What would you clarify on an array problem?"** Empty input, sortedness, duplicates, value range (for overflow), indices versus values, and whether the input may be modified — then say which of those matter for *this* problem.
- **"The interviewer is vague about constraints. What do you do?"** State a reasonable assumption out loud with a reason, mention what you would do differently under the other assumption, and proceed.
- **"How is clarifying different in a design interview?"** Coding: inputs, outputs, edges. Design: users, scale, latency, consistency and what is out of scope.

## Practice

For each prompt, write the two to four questions that would most change your solution, and for each question, the two different solutions its answers would lead to.

1. *"Find the duplicate number in an array."* (Hint: can you modify the array? How many duplicates? What range are the values in?)
2. *"Return the longest palindromic substring."* (Hint: what if several have the same length? Is the empty string a valid input?)
3. *"Given a binary tree, return its values level by level."* (Hint: left to right? Zigzag? Empty tree?) See [[a6-bfs]].
4. *"Design a function that returns the median of a stream of numbers."* (Hint: how many numbers? Even count — average of the two middles, or the lower one?) See [[a7-running-median]].
5. Take the `merge` method above and list every clarified rule it depends on. For each, point at the exact line that implements it.

## Quick revision {#quick-revision}

- Interview prompts are deliberately underspecified; clarifying is graded and mirrors real engineering.
- Ask only questions whose answer would change your code. Filter: "would a different answer make me write something different?"
- Four areas: input shape (empty, sorted, duplicates, negatives), output (indices or values, order, none found), scale (`n`, value range), rules (in-place, extra memory, invalid input).
- Scale picks the algorithm: `n ≤ 20` exponential, `≤ 5,000` quadratic, `10⁵–10⁶` needs O(n log n) or O(n).
- Whenever output involves ordering, ask about ties.
- Confirm with examples: walk the given one aloud, propose one edge example with its expected output.
- Write a short spec in the editor; it becomes your test list later.
- No answer? State an explicit assumption with a reason, prefer the general case, adapt if corrected.
- Typical budget: two to five questions, two to four minutes.

## Key takeaways {#key-takeaways}

- The first minutes decide whether you solve the problem that was actually asked; a wrong assumption cannot be caught by tests built on the same assumption.
- Good questions are tailored: they target the few details that change the algorithm, the output contract or the edge handling.
- Examples are partial specifications. Confirm your reading by walking the given example and proposing one edge example of your own.
- When a question goes unanswered, state your assumption explicitly and say what would change if it were different.
- A clarified rule must then visibly shape the code — and you should check the code against each rule before declaring it done.

```quiz
Q: You are asked to "return the two numbers that add to the target" and plan to sort the array and use two pointers. Which clarifying question most directly threatens that plan?
- [ ] Can the numbers be negative?
- [x] Should I return the numbers themselves or their original indices?
- [ ] What language should I use?
- [ ] Can the array contain more than 100 elements?
> Sorting reorders the array, so the original indices are lost. If indices are required, plain sort-and-two-pointers no longer works without carrying the indices along, and a single-pass hash map becomes the natural choice. Negative numbers do not break two pointers on a sorted array, and the array size changes only the time budget, not the approach.

Q: The interviewer replies "your choice" when you ask whether the input array is sorted. What is the strongest response?
- [ ] Assume it is sorted, since that allows a faster solution, and do not mention it
- [ ] Keep asking until the interviewer gives a definite answer
- [x] Say you will assume it is unsorted and sort a copy, and note that a sorted input would let you skip that O(n log n) step
- [ ] Write two complete solutions, one for each case
> An explicit assumption that handles the general case, plus a remark about what would change, shows you understand why the question mattered and keeps you moving. Silently assuming the convenient case risks a wrong solution the interviewer cannot correct; insisting or writing two solutions wastes time.

Q: In the merge-intervals walkthrough, both `<` and `<=` versions pass the interviewer's original example. Why?
- [ ] Because Java treats `<` and `<=` the same for arrays
- [ ] Because the example is sorted
- [x] Because the example contains no intervals that only touch at an endpoint, so the two rules never disagree on it
- [ ] Because the bug only appears with negative numbers
> The two operators differ only when one interval starts exactly where the previous one ends. The example has no such pair, so it cannot distinguish them. This is why examples are partial specifications and why you propose your own edge example during clarification.
```
