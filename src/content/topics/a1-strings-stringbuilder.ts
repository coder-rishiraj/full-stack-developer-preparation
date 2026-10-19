import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A **String** in Java is frozen text. **charAt**, **length**, **equals**, and **substring** read it. They do not edit it. **StringBuilder** is a growable buffer of characters: you **append**, then call **toString** once.',
  whyExists:
    '**result = result + c** inside a loop copies the whole string on every iteration. A palindrome, an anagram, or a compressed string is a few characters of logic on top of that. The loop is fine. The copying is what times out.',
  mentalModel:
    'A **String** is a finished sentence. You can look at letter **i**, and you can write a new sentence, but you cannot erase a letter in place. A **StringBuilder** is the scratch paper. **toString** copies the scratch paper into a finished sentence at the end.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'What you can ask a **String**.',
        '**equals** versus **==**.',
        'Why **+** in a loop is quadratic.',
        '**StringBuilder**, then one **toString**.',
        'Anagrams with **int[26]**.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 1 — A String does not change',
    },
    {
      type: 'list',
      items: [
        '**s.length()** is the number of **char** values. **s.charAt(i)** is the character at index **i**, in **O(1)**. Indexes start at 0.',
        '**s.substring(begin, end)** returns a new string from **begin** inclusive to **end** exclusive. **substring(1, 4)** of **"abcde"** is **"bcd"**. Off-by-one here is the usual bug.',
        'Since Java 7, **substring** copies those characters. It is **O(k)** for a piece of length **k**, not a free view onto the old string.',
        'There is no **s.setCharAt**. To change a character you build a new string, or you work on a **char[]** from **toCharArray()** and build the string at the end.',
        '**String** is a safe **HashMap** key because its contents cannot change after it is created. **hashCode** is cached.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 2 — equals compares the letters',
    },
    {
      type: 'list',
      items: [
        '**s == t** asks whether **s** and **t** are the same object in memory.',
        '**s.equals(t)** asks whether the characters match.',
        'Two strings built separately can hold **"hi"** and still fail **==**. Interviews want **equals**.',
        '**"hi" == "hi"** can be true because of interning of literals. Do not learn the wrong lesson from that. Content checks use **equals**.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 3 — Plus in a loop copies everything so far',
    },
    {
      type: 'list',
      items: [
        '**bad += c** does not edit **bad**. It allocates a new string, copies every character already in **bad**, then adds **c**.',
        'The first addition copies 1 character, the next copies 2, then 3, up to **n**. The total copying is about **1 + 2 + … + n**, which is **O(n²)**.',
        'A few concatenations in one expression, such as a label plus a number, are fine. The problem is the loop.',
        '**String.valueOf(n)** turns a number into text. Append that, do not **+** it inside the loop.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'The loop that copies, and the buffer that does not',
      code: `// BAD: O(n^2) total copying
String bad = "";
for (int i = 0; i < n; i++) bad += (char)('a' + i);

// GOOD
StringBuilder sb = new StringBuilder(n);
for (int i = 0; i < n; i++) sb.append((char)('a' + i));
String good = sb.toString();`,
    },
    {
      type: 'heading',
      text: 'Step 4 — StringBuilder is the buffer',
    },
    {
      type: 'list',
      items: [
        '**new StringBuilder(n)** reserves room for about **n** characters, so it does not resize on every append when you know the length.',
        '**append** adds a character, a string, or a number at the end. Most appends are **O(1)** amortized, the same idea as **ArrayList**.',
        '**reverse**, **delete**, and **setCharAt** edit the buffer in place.',
        '**toString()** copies the buffer into a real **String** once. That copy is **O(n)**, paid a single time.',
        '**String.join(",", parts)** is the shortcut when you already have the pieces and only need separators.',
        '**StringBuffer** is the old synchronized cousin. Contest and interview code wants **StringBuilder**. The lock is wasted on one thread.',
      ],
    },
    {
      type: 'table',
      headers: ['Job', 'String', 'StringBuilder'],
      rows: [
        ['Append inside a loop', '**O(n²)** total copying', '**O(n)** amortized'],
        ['**charAt**', 'O(1)', 'O(1) via **charAt**'],
        ['Reverse', 'A new string, O(n)', 'In the buffer, O(n)'],
        ['Share across threads', 'Safe, because it cannot change', 'Not synchronized'],
      ],
    },
    {
      type: 'heading',
      text: 'Step 5 — Anagrams count letters',
    },
    {
      type: 'list',
      items: [
        'For lowercase English, **int[26]** is the frequency table. **cnt[c - \'a\']++** records one **c**.',
        'Two strings are anagrams when the 26 counts match. One array: increment for **s**, decrement for **t**, then every slot must be 0.',
        'That is **O(n)** time and **O(1)** extra space. Sorting both strings is **O(n log n)** and also works, but the count is the one to reach for first.',
        'Letters outside a–z, or full Unicode, do not fit in 26. Use a **HashMap**, or **codePointAt** if the problem is really about Unicode code points rather than Java **char** values.',
        'A palindrome usually does not need a builder. Two indexes walk inward with **charAt**, after you skip characters the problem says to ignore.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'One count array for a lowercase anagram',
      code: `int[] cnt = new int[26];
for (char c : s.toCharArray()) cnt[c - 'a']++;
// compare cnt arrays for anagram`,
    },
    {
      type: 'quiz',
      title: 'Check your understanding — strings',
      questions: [
        {
          prompt: 'Why is **s += c** inside a loop of length n a problem?',
          options: [
            'StringBuilder is required by the compiler',
            'Each plus copies the whole string so far, so the total work is about O(n²)',
            'char cannot be added to a String',
            'It is O(n) and always fine',
          ],
          answer: 1,
          explanation: 'Each concatenation allocates a new **String** and copies every character already stored. The copies add up to a triangle: 1 + 2 + … + n.',
        },
        {
          prompt: '**s == t** is true. What do you know?',
          options: [
            'The characters match, always',
            's and t are the same object. The characters might also match, but == did not check that.',
            'They are both empty',
            'equals would return false',
          ],
          answer: 1,
          explanation: '**==** is identity. **equals** is the character-by-character check. Use **equals** for content.',
        },
        {
          prompt: '**"abcde".substring(1, 4)** is which string?',
          options: ['abcd', 'bcd', 'bcde', 'abc'],
          answer: 1,
          explanation: 'The start index is inclusive and the end index is exclusive. Indexes 1, 2, and 3 are **b**, **c**, **d**.',
        },
        {
          prompt: 'When do you call **toString** on a StringBuilder?',
          options: [
            'After every append',
            'Once, when the buffer is finished',
            'Never. append returns a String.',
            'Only if the length is 1',
          ],
          answer: 1,
          explanation: '**append** only grows the buffer. **toString** is the one copy into an immutable **String**. Doing it every iteration throws away the point of the builder.',
        },
        {
          prompt: 'Two lowercase words, anagram or not, in O(n). What do you count?',
          options: [
            'A HashSet of characters only',
            'int[26], increment one word and decrement the other',
            'StringBuilder.reverse and equals',
            'One nested loop per character',
          ],
          answer: 1,
          explanation: 'A set loses counts: **"aab"** and **"abb"** would look similar and are not anagrams. The 26 counters must all return to zero.',
        },
      ],
    },
  ],
  example: [
    {
      type: 'heading',
      text: 'A palindrome walks inward',
    },
    {
      type: 'list',
      items: [
        '**l** starts at 0 and **r** starts at **length - 1**.',
        'Skip characters the problem ignores, then compare **charAt(l)** with **charAt(r)**. A mismatch is not a palindrome.',
        'Move **l** right and **r** left. Each character is looked at a constant number of times, so this is **O(n)** and needs no **StringBuilder**.',
        'Build with a **StringBuilder** only when the answer is a new string: compression, reversal, or a join.',
      ],
    },
  ],
  complexity: {
    average: 'StringBuilder append is O(1) amortized. n concatenations with + are O(n²).',
    worst: 'substring of length k copies O(k) characters.',
    space: 'The builder’s buffer is O(n).',
  },
  patternRecognition: [
    'The result is built one character at a time → StringBuilder.',
    'Anagram or frequency of letters → int[26], or a map if the alphabet is open.',
    'Two pointers on text → charAt, or a char array.',
    'Parsing digits yourself with an index, when split would allocate a lot.',
  ],
  commonMistakes: [
    '+= on a String inside a loop.',
    '== where the problem asked whether the text matches.',
    'Treating the end index of substring as inclusive.',
    'Assuming substring is free. It copies.',
  ],
  tradeoffs: {
    advantages: ['An immutable String is a safe map key', 'StringBuilder makes building linear'],
    disadvantages: ['You cannot edit a String in place', 'A Java char is not always one Unicode code point'],
    alternatives: ['char[] when you truly edit in place', 'A byte buffer when the contest input itself is the bottleneck'],
    whenToUse: ['StringBuilder for any output you assemble', 'int[26] for lowercase anagrams'],
    whenNotToUse: ['Two or three fixed pieces joined once. A single + is fine.'],
  },
  failureModes: [
    'Time limit from repeated String concatenation.',
    'A surrogate pair counted as two characters when the problem meant one code point.',
  ],
  interview: {
    expectations: ['Say that String is immutable', 'Build with StringBuilder', 'Count an anagram instead of sorting, when the alphabet is small'],
    commonQuestions: ['Valid Anagram', 'Valid Palindrome', 'String Compression'],
    followUps: ['String versus StringBuffer?', 'What about Unicode code points?'],
    misconceptions: ['Concatenating in a loop is O(n)'],
    traps: ['== versus equals'],
    strongSignals: ['Passes a capacity to new StringBuilder(n) when n is known'],
  },
  keyTakeaways: [
    'String does not change. + in a loop copies a triangle of characters, O(n²).',
    'StringBuilder appends, then toString once.',
    'equals is content. == is identity.',
    'Lowercase anagrams: int[26] and c - a.',
    'substring’s end index is exclusive, and the slice is copied.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why a StringBuilder in a loop?',
      answerHint: 'Each String concatenation copies the entire result so far. n of those copies are O(n²). Appends on a builder are amortized O(n) altogether.',
    },
    {
      level: 'intermediate',
      question: 'How do you test an anagram of lowercase letters in O(n)?',
      answerHint: 'An array of 26. Increment for the first string, decrement for the second. Every count must end at zero.',
    },
    {
      level: 'advanced',
      question: 'What does substring cost since Java 7?',
      answerHint: 'It copies the characters into a new array. A slice of length k is O(k), not a view of the original.',
    },
  ],
  flashcards: [
    { front: 'String equality', back: 's.equals(t) for the characters. == asks if they are the same object.' },
    { front: 'Lowercase anagram counts', back: 'int[26]. Index with c - \'a\'.' },
  ],
  quickRevision: [
    'String is immutable',
    'StringBuilder for a loop of appends',
    'equals, not ==',
    'charAt and toCharArray',
    'int[26] for a–z',
    'substring end is exclusive',
  ],
}
