import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: "Java Stream API (java.util.stream) models bulk data ops as a pipeline of intermediate ops (map/filter/sorted) and terminal ops (collect/reduce/count)—lazy until terminal, often clearer than loops in interviews.",
  whyExists: "Loops hide intent; streams express filter-map-collect pipelines and optional parallelism. Interviewers test grouping, flatMap, collectors, and primitive streams.",
  mentalModel: "Water pipe: elements flow through filters/transformers; the terminal valve opens flow and produces a result.",
  howItWorks: [
    {
      type: "list",
      items: [
        "Source → intermediate ops (lazy) → terminal (eager).",
        "No reuse after terminal; each stream consumed once.",
        "collect(Collectors.groupingBy) for frequency maps.",
        "flatMap flattens nested lists or Optional chains.",
        "Avoid side effects in lambdas; map beats peek for transforms.",
      ],
    },
  ],
  example: [
    {
      type: "paragraph",
      text: "Group trimmed words by length, then take the longest-length bucket—one pipeline with groupingBy and optional max by key.",
    },
  ],
  templates: [
    {
      language: "java",
      caption: "Stream pipeline skeleton",
      code: `List<String> words = list.stream()
    .filter(s -> !s.isBlank())
    .map(String::trim)
    .toList();
Map<Integer, Long> freq = words.stream()
    .collect(Collectors.groupingBy(String::length, Collectors.counting()));`,
    },
  ],
  tradeoffs: {
    advantages: [
      "Declarative pipelines",
      "Rich collectors",
    ],
    disadvantages: [
      "Harder to debug than loops",
      "Boxing in Stream<Integer>",
    ],
    alternatives: [
      "Enhanced for-loops",
      "Records + explicit steps",
    ],
    whenToUse: [
      "Filter/map/aggregate in one pass",
    ],
    whenNotToUse: [
      "Tight numeric hot loops without profiling",
    ],
  },
  failureModes: [
    "Reusing stream after terminal",
    "parallelStream on small n or IO-bound work",
    "Null elements without filter",
  ],
  production: {
    performance: [
      "Use IntStream/LongStream for numeric bulk",
      "Avoid parallelStream unless profiled CPU-bound",
    ],
    maintainability: [
      "Keep pipelines short; extract named methods",
    ],
    reliability: [
      "Handle empty Optional from findFirst/min/max",
    ],
  },
  interview: {
    expectations: [
      "Lazy vs terminal",
      "groupingBy/counting",
      "flatMap vs map",
    ],
    commonQuestions: [
      "Most frequent element via streams?",
      "Difference map vs flatMap?",
    ],
    followUps: [
      "Custom collector?",
      "parallelStream pitfalls?",
    ],
    misconceptions: [
      "Streams always multithreaded",
      "peek is for mapping",
    ],
    traps: [
      "Mutating external list in forEach",
    ],
    strongSignals: [
      "Names collectors correctly",
      "Avoids parallelStream by default",
    ],
  },
  keyTakeaways: [
    "Terminal op triggers pipeline",
    "Intermediates are lazy",
    "Collectors.groupingBy/counting",
    "flatMap flattens one level",
    "One stream → one terminal",
  ],
  interviewQuestions: [
    {
      level: "basic",
      question: "Lazy vs eager in streams?",
      answerHint: "Intermediate ops lazy until terminal executes.",
    },
    {
      level: "intermediate",
      question: "groupingBy vs toMap?",
      answerHint: "groupingBy groups into lists; toMap needs merge function on duplicate keys.",
    },
    {
      level: "advanced",
      question: "When parallelStream?",
      answerHint: "Large CPU-bound pure ops on in-memory data; not IO; measure first.",
    },
  ],
  flashcards: [
    {
      front: "Terminal operation",
      back: "Eager; triggers pipeline e.g. collect, reduce, forEach",
    },
    {
      front: "flatMap",
      back: "Map to stream then flatten one level",
    },
  ],
  quickRevision: [
    "Source → intermediate → terminal",
    "Lazy until terminal",
    "groupingBy/counting",
    "flatMap flatten",
    "No stream reuse",
    "Careful parallelStream",
    "Method references",
  ],
  patternRecognition: [
    "Frequency via groupingBy",
    "Top-K often clearer with heap",
  ],
  commonMistakes: [
    "Side effects in peek",
    "Boxing overhead on primitives",
  ],
}
