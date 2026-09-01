import type { TopicContent } from '@/domain/types'

export type JsLanguageInput = {
  title: string
  whatIsIt: string
  whyExists: string
  mentalModel: string
  how: string[]
  callout: { title: string; text: string; variant: 'note' | 'warning' | 'tip' | string }
  example: string
  exampleCaption?: string
  internals?: string[]
  takeaways: string[]
  revision: string[]
  flashcards: Array<[string, string] | string[]>
  questions: {
    level: 'basic' | 'intermediate' | 'advanced' | string
    question: string
    answerHint: string
  }[]
  pitfalls?: string[]
  interview: {
    expectations: string[]
    commonQuestions: string[]
    traps?: string[]
    misconceptions?: string[]
    strongSignals?: string[]
  }
}

/** Builds QC-complete JavaScript language notes from topic-specific evidence. */
export function jsLanguageTopic(input: JsLanguageInput): TopicContent {
  return {
    whatIsIt: input.whatIsIt,
    whyExists: input.whyExists,
    mentalModel: input.mentalModel,
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: input.how,
      },
      {
        type: 'callout',
        variant: (['note', 'warning', 'tip'].includes(input.callout.variant)
          ? input.callout.variant
          : 'warning') as 'note' | 'warning' | 'tip',
        title: input.callout.title,
        text: input.callout.text,
      },
    ],
    example: [
      {
        type: 'code',
        language: 'javascript',
        caption: input.exampleCaption ?? `${input.title} in practice`,
        code: input.example,
      },
    ],
    internals: input.internals?.length
      ? [{ type: 'list', items: input.internals }]
      : undefined,
    failureModes: input.pitfalls,
    interview: {
      expectations: input.interview.expectations,
      commonQuestions: input.interview.commonQuestions,
      traps: input.interview.traps ?? [],
      misconceptions: input.interview.misconceptions ?? [],
      strongSignals: input.interview.strongSignals ?? [],
      followUps: [],
    },
    keyTakeaways: input.takeaways,
    quickRevision: input.revision,
    flashcards: input.flashcards.map(([front, back]) => ({
      front: front ?? '',
      back: back ?? '',
    })),
    interviewQuestions: input.questions.map((q) => ({
      level: (['basic', 'intermediate', 'advanced'].includes(q.level)
        ? q.level
        : 'intermediate') as 'basic' | 'intermediate' | 'advanced',
      question: q.question,
      answerHint: q.answerHint,
    })),
    commonMistakes: input.pitfalls,
  }
}
