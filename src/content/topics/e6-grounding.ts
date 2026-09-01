import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: "Grounding in RAG ties LLM answers to retrieved source chunks via inline citations, span references, or structured source metadata. Citations let users verify claims and reduce hallucination risk when the model must stay within evidence.",
  whyExists: "Pure generation drifts from documents. Production RAG systems need traceability for compliance, debugging bad answers, and user trust. Grounding forces the model to quote or reference retrieved passages rather than invent facts.",
  mentalModel: "Retrieval supplies evidence slots; generation fills answers only from those slots. Each factual sentence should map to chunk_id + offset or page. If no chunk supports a claim, the system abstains or says unknown.",
  howItWorks: [
    {
      type: "list",
      items: [
        "Retrieve top-k chunks with scores and metadata (doc_id, page, section).",
        "Prompt instructs: answer only from context; cite [1][2] per claim.",
        "Post-process: verify cited indices exist; optional NLI check claim ⊆ chunk.",
        "UI renders footnotes linking to original PDF/HTML spans.",
        "Abstention policy when max similarity below threshold or no supporting span.",
      ],
    },
  ],
  example: [
    {
      type: "code",
      language: "text",
      caption: "Grounded prompt pattern",
      code: `Context:
[1] Refund policy: returns within 30 days with receipt.
[2] Shipping: free over $50.

Question: Can I return after 45 days?
Answer using only context. Cite [n] per sentence.`,
    },
  ],
  production: {
    reliability: [
      "Abstain below similarity threshold",
      "Log chunk_ids used per answer",
    ],
    security: [
      "Strip PII from cited spans in logs",
      "AuthZ on source documents",
    ],
    observability: [
      "Track citation rate and orphan claims",
    ],
  },
  tradeoffs: {
    advantages: [
      "Reduces hallucination",
      "Audit trail for compliance",
      "User can verify",
    ],
    disadvantages: [
      "Verbose prompts cost tokens",
      "Citation format brittle",
      "NLI adds latency",
    ],
    alternatives: [
      "Tool-calling with fetch_doc(id)",
      "Structured JSON answer + sources array",
    ],
    whenToUse: [
      "Support bots",
      "Legal/medical summaries",
      "Enterprise search",
    ],
    whenNotToUse: [
      "Creative writing without sources",
      "When latency budget forbids verification",
    ],
  },
  failureModes: [
    "Model cites wrong index",
    "Paraphrase not in chunk but sounds right",
    "Stale chunks after doc update",
    "Over-citation noise",
  ],
  interview: {
    expectations: [
      "Explain citation grounding vs fine-tuning",
      "Abstention when retrieval weak",
    ],
    commonQuestions: [
      "How reduce hallucination in RAG?",
      "What if model ignores context?",
    ],
    followUps: [
      "Automated faithfulness metrics?",
      "Inline vs footnote citations?",
    ],
    misconceptions: [
      "Grounding eliminates all hallucinations",
      "More chunks always better for grounding",
    ],
    traps: [
      "No threshold → confident wrong answers",
    ],
    strongSignals: [
      "Mentions RAGAS faithfulness",
      "Abstain + log sources",
    ],
  },
  keyTakeaways: [
    "Ground = answer anchored to retrieved spans",
    "Citations enable verification",
    "Abstain when evidence weak",
    "Post-check claims against chunks",
    "Log source_ids for audit",
  ],
  interviewQuestions: [
    {
      level: "basic",
      question: "Why citations in RAG?",
      answerHint: "Trace claims to source chunks; reduce hallucination; compliance.",
    },
    {
      level: "intermediate",
      question: "What if LLM cites nonexistent [3]?",
      answerHint: "Validate indices; rerank prompt; NLI entailment check; penalize in eval.",
    },
    {
      level: "advanced",
      question: "Faithfulness metrics?",
      answerHint: "RAGAS faithfulness, NLI entailment, human eval on claim-source pairs.",
    },
  ],
  flashcards: [
    {
      front: "Grounding in RAG",
      back: "Answers tied to retrieved source spans with citations",
    },
    {
      front: "Abstention trigger",
      back: "Low retrieval score or no supporting chunk for claim",
    },
  ],
  quickRevision: [
    "Retrieve → cite → generate",
    "Abstain if weak evidence",
    "Validate citation indices",
    "Log chunk_ids",
    "NLI optional faithfulness",
    "UI link to sources",
    "Compliance audit trail",
  ],
}
