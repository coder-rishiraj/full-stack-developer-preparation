export type TrackId = 'A' | 'B' | 'C' | 'D' | 'E'

export type Priority = 'tier1' | 'tier2' | 'tier3'

/** Job-switch urgency; intentionally separate from knowledge importance. */
export type ExecutionPriority = 'p0' | 'p1' | 'p2' | 'later'

export type CurriculumLevel = 'classified-item' | 'nested-concept'

export type TopicKind =
  | 'theory'
  | 'dsa-pattern'
  | 'system-design'
  | 'lld'
  | 'capstone'

export type StudyStatus =
  | 'not_started'
  | 'learning'
  | 'first_pass'
  | 'interview_ready'
  | 'needs_revision'

export type DsaStatus =
  | 'not_attempted'
  | 'attempted'
  | 'could_not_solve'
  | 'solved_with_hint'
  | 'solved_independently'
  | 'revision_due'
  | 'mastered'

export type Confidence = 1 | 2 | 3 | 4 | 5

export type EstimatedDepth = 'shallow' | 'medium' | 'deep'

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'callout'; variant?: 'note' | 'warning' | 'tip'; title?: string; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'code'; language: string; code: string; caption?: string }
  | { type: 'mermaid'; diagram: string; caption?: string }

export type CodeBlock = {
  language: string
  code: string
  caption?: string
}

export type ComplexityTable = {
  best?: string
  average?: string
  worst?: string
  space?: string
  notes?: string
}

export type Tradeoffs = {
  advantages: string[]
  disadvantages: string[]
  alternatives: string[]
  whenToUse: string[]
  whenNotToUse: string[]
}

export type ProductionNotes = {
  performance?: string[]
  scalability?: string[]
  reliability?: string[]
  security?: string[]
  observability?: string[]
  maintainability?: string[]
  cost?: string[]
}

export type InterviewSection = {
  expectations: string[]
  commonQuestions: string[]
  followUps: string[]
  misconceptions: string[]
  traps: string[]
  strongSignals: string[]
}

export type InterviewQ = {
  level: 'basic' | 'intermediate' | 'advanced'
  question: string
  answerHint?: string
}

export type Flashcard = {
  front: string
  back: string
}

export type SystemDesignSections = {
  problem: string
  requirements: { functional: string[]; nonFunctional: string[] }
  scaleAssumptions: string[]
  capacityEstimates: string[]
  api: ContentBlock[]
  dataModel: ContentBlock[]
  highLevelArchitecture: ContentBlock[]
  diagram?: { mermaid: string; caption?: string }
  dataFlow: string[]
  storage: string[]
  caching: string[]
  asyncProcessing: string[]
  scaling: string[]
  consistency: string[]
  reliability: string[]
  failureScenarios: string[]
  security: string[]
  observability: string[]
  bottlenecks: string[]
  alternatives: string[]
  tradeoffs: string[]
  interviewFollowUps: string[]
  evolution: { stage: string; description: string; bottleneck?: string }[]
}

export type TopicMeta = {
  id: string
  track: TrackId
  sectionId: string
  sectionTitle: string
  title: string
  /** Knowledge importance from the source syllabus (red/orange/yellow). */
  priority: Priority
  /** Practical ordering for the current job-switch plan. */
  executionPriority: ExecutionPriority
  /** Nested concepts remain studyable but do not inflate classified-item counts. */
  curriculumLevel: CurriculumLevel
  /** Nested concepts remain browsable without inflating classified counts. */
  parentTopicId?: string
  targetMonths: number[]
  prerequisites: string[]
  relatedTopics: string[]
  nextTopics: string[]
  usedInCapstone?: string
  estimatedDepth: EstimatedDepth
  kind: TopicKind
  tags: string[]
  contentReady: boolean
}

export type TopicContent = {
  whatIsIt?: string
  whyExists?: string
  mentalModel?: string
  howItWorks?: ContentBlock[]
  architecture?: { mermaid?: string; caption?: string }
  example?: ContentBlock[]
  implementation?: CodeBlock[]
  internals?: ContentBlock[]
  complexity?: ComplexityTable
  tradeoffs?: Tradeoffs
  failureModes?: string[]
  production?: ProductionNotes
  interview?: InterviewSection
  keyTakeaways: string[]
  interviewQuestions: InterviewQ[]
  flashcards: Flashcard[]
  quickRevision: string[]
  patternRecognition?: string[]
  commonMistakes?: string[]
  variations?: string[]
  templates?: CodeBlock[]
  systemDesign?: SystemDesignSections
}

export type Topic = TopicMeta & { content?: TopicContent }

export type DsaProblem = {
  id: string
  name: string
  source: 'cses' | 'neetcode250'
  sourceUrl: string
  sourceId?: string
  urlVerified: boolean
  /** NeetCode / CSES section slug (e.g. sliding-window, introductory). */
  category: string
  primaryTopic: string
  primaryPattern: string
  secondaryPatterns: string[]
  difficulty: 'easy' | 'medium' | 'hard' | 'unknown'
  priority: Priority
  /** 1-based order within the source list. */
  listOrder: number
}

export type RevisionSlot = {
  id: string
  name: string
  task: string
  /** Calendar date `YYYY-MM-DD` in the local timezone. */
  date: string
  completedAt?: string
  clashBumped?: boolean
}

export type TopicProgress = {
  status: StudyStatus
  confidence: Confidence
  firstStudied?: string
  lastStudied?: string
  lastRevised?: string
  revisionCount: number
  nextRevision?: string
  /** Full Memora-style spaced schedule populated when the topic is first studied. */
  revisionSchedule?: RevisionSlot[]
}

export type ProblemAttempt = {
  at: string
  outcome: DsaStatus
  note?: string
}

export type ProblemProgress = {
  status: DsaStatus
  attempts: number
  solvedIndependently: boolean
  solvedWithHints: boolean
  solutionViewed: boolean
  lastAttempted?: string
  lastSolved?: string
  revisionCount: number
  nextRevision?: string
  confidence: Confidence
  attemptHistory: ProblemAttempt[]
}

/** User-authored bullet points layered on a curriculum (or custom) topic. */
export type TopicOverlay = {
  keyTakeaways?: string[]
  quickRevision?: string[]
  patternRecognition?: string[]
  commonMistakes?: string[]
  failureModes?: string[]
  variations?: string[]
  /** Free-form extra bullets shown as "Your additions". */
  extraPoints?: string[]
}

export type OverlayListField = keyof TopicOverlay

/** User-created topic stored only in personal progress (IndexedDB). */
export type CustomTopic = {
  id: string
  title: string
  track: TrackId
  /** Curriculum section id (e.g. B4.1) or custom section id (CUSTOM-B-…). */
  sectionId: string
  sectionTitle: string
  priority: Priority
  executionPriority: ExecutionPriority
  targetMonths: number[]
  tags: string[]
  whatIsIt?: string
  whyExists?: string
  mentalModel?: string
  keyTakeaways: string[]
  quickRevision: string[]
  createdAt: string
  updatedAt: string
}

export type UserState = {
  version: 1
  theme: 'light' | 'dark' | 'system'
  /** Optional interview target date `YYYY-MM-DD` — fills Rev 8 on study schedules. */
  interviewDate?: string
  topics: Record<string, TopicProgress>
  problems: Record<string, ProblemProgress>
  notes: Record<string, string>
  bookmarks: string[]
  /** Extra points layered onto curriculum topic ids (and custom topic ids). */
  topicOverlays: Record<string, TopicOverlay>
  /** User-authored topics, keyed by id (`custom-…`). */
  customTopics: Record<string, CustomTopic>
  currentFocus: {
    learning?: string
    upNext?: string
  }
}

export type TrackInfo = {
  id: TrackId
  name: string
  shortName: string
  description: string
  accent: string
}

export type SectionInfo = {
  id: string
  track: TrackId
  title: string
  order: number
}
