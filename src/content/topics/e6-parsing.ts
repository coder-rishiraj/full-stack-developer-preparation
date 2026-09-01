import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: "Document parsing converts PDFs, HTML, DOCX, slides, and tables into clean text (and optional structure) for chunking—handling layout, headers, footers, OCR, and embedded images.",
  whyExists: "Raw bytes are unusable for embeddings. Parsing quality determines whether chunks contain coherent sentences vs broken columns, headers repeated on every page, or lost table data.",
  mentalModel: "Reverse the authoring layout: detect reading order, strip boilerplate, preserve headings as metadata, OCR scanned pages. Parser output is markdown-like structure + plain text fallback.",
  howItWorks: [
    {
      type: "list",
      items: [
        "Format-specific loaders (PyMuPDF, Tika, Unstructured).",
        "Layout analysis: blocks, columns, tables.",
        "OCR for scanned PDFs (Tesseract, cloud OCR).",
        "Extract title, headings, page numbers into metadata.",
        "Normalize whitespace; dedupe repeated headers/footers.",
      ],
    },
  ],
  example: [
    {
      type: "paragraph",
      text: "Two-column PDF parsed row-wise merges unrelated sentences—use layout-aware parser or per-column extraction before chunking.",
    },
  ],
  production: {
    reliability: [
      "Fallback parser chain",
      "Human review queue for low confidence OCR",
    ],
    maintainability: [
      "Parser version in chunk metadata",
    ],
    cost: [
      "OCR only when text layer empty",
    ],
  },
  tradeoffs: {
    advantages: [
      "Unlocks enterprise PDFs",
      "Structure aids chunk boundaries",
    ],
    disadvantages: [
      "Fragile on complex layouts",
      "OCR cost/latency",
    ],
    alternatives: [
      "Vision LLM page describe",
      "Manual curation for critical docs",
    ],
    whenToUse: [
      "PDF-heavy corpora",
    ],
    whenNotToUse: [
      "Already clean markdown API",
    ],
  },
  failureModes: [
    "Table → garbled text",
    "Header on every chunk",
    "Wrong reading order",
    "Scanned PDF without OCR",
  ],
  interview: {
    expectations: [
      "Layout vs naive text extract",
      "OCR when needed",
    ],
    commonQuestions: [
      "Parse PDF for RAG?",
    ],
    followUps: [
      "Tables in RAG?",
    ],
    misconceptions: [
      "pdf.extractText() enough",
    ],
    traps: [
      "Chunk before cleaning headers",
    ],
    strongSignals: [
      "Layout-aware pipeline",
      "OCR fallback",
    ],
  },
  keyTakeaways: [
    "Parsing quality = RAG ceiling",
    "Layout-aware for PDFs",
    "OCR scanned docs",
    "Strip repeated headers",
    "Preserve heading metadata",
  ],
  interviewQuestions: [
    {
      level: "basic",
      question: "Why not plain PDF text extract?",
      answerHint: "Loses layout; columns merge; tables break; headers repeat.",
    },
    {
      level: "intermediate",
      question: "Handle tables?",
      answerHint: "HTML/markdown table serialize; or row JSON; specialized table parsers.",
    },
    {
      level: "advanced",
      question: "Vision LLM vs traditional parse?",
      answerHint: "Vision good on messy scans; costlier; hybrid: OCR + layout + VLM for hard pages.",
    },
  ],
  flashcards: [
    {
      front: "Layout-aware parsing",
      back: "Respect columns, blocks, reading order vs raw text dump",
    },
    {
      front: "OCR trigger",
      back: "When PDF has no selectable text layer",
    },
  ],
  quickRevision: [
    "Format-specific loaders",
    "Layout reading order",
    "OCR scanned PDFs",
    "Strip headers footers",
    "Table serialization",
    "Title in metadata",
    "Parser version tag",
  ],
}
