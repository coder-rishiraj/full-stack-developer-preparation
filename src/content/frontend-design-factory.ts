import type { ContentBlock, TopicContent } from "@/domain/types";

type Design = {
  problem: string;
  functional: string[];
  nonFunctional: string[];
  scale: string[];
  capacity: string[];
  api: string[];
  dataModel: string[];
  architecture: string[];
  flow: string[];
  storage: string[];
  caching: string[];
  async: string[];
  scaling: string[];
  consistency: string[];
  reliability: string[];
  failure: string[];
  security: string[];
  observability: string[];
  bottlenecks: string[];
  alternatives: string[];
  tradeoffs: string[];
  followUps: string[];
  evolution: { stage: string; description: string; bottleneck?: string }[];
};

type Input = {
  whatIsIt: string;
  whyExists: string;
  mentalModel: string;
  how: string[];
  callout: { title: string; text: string; variant: "note" | "warning" | "tip" };
  example: string;
  takeaways: string[];
  revision: string[];
  flashcards: [string, string][];
  questions: {
    level: "basic" | "intermediate" | "advanced";
    question: string;
    answerHint: string;
  }[];
  advantages: string[];
  disadvantages: string[];
  alternatives: string[];
  whenToUse: string[];
  whenNotToUse: string[];
  failureModes: string[];
  production: NonNullable<TopicContent["production"]>;
  interview: NonNullable<TopicContent["interview"]>;
  design: Design;
};

const list = (items: string[]): ContentBlock => ({ type: "list", items });

/** Builds a complete, client-oriented system-design lesson from topic-specific evidence. */
export function frontendDesignTopic(input: Input): TopicContent {
  const d = input.design;
  return {
    whatIsIt: input.whatIsIt,
    whyExists: input.whyExists,
    mentalModel: input.mentalModel,
    howItWorks: [
      { type: "paragraph", text: input.how[0] },
      list(input.how.slice(1)),
      {
        type: "callout",
        variant: input.callout.variant,
        title: input.callout.title,
        text: input.callout.text,
      },
    ],
    example: [
      { type: "paragraph", text: input.example },
      {
        type: "table",
        headers: ["Client decision", "Reason"],
        rows: input.how
          .slice(1, 4)
          .map((item, index) => [`Step ${index + 1}`, item]),
      },
    ],
    tradeoffs: {
      advantages: input.advantages,
      disadvantages: input.disadvantages,
      alternatives: input.alternatives,
      whenToUse: input.whenToUse,
      whenNotToUse: input.whenNotToUse,
    },
    failureModes: input.failureModes,
    production: input.production,
    interview: input.interview,
    keyTakeaways: input.takeaways,
    quickRevision: input.revision,
    flashcards: input.flashcards.map(([front, back]) => ({ front, back })),
    interviewQuestions: input.questions,
    systemDesign: {
      problem: d.problem,
      requirements: {
        functional: d.functional,
        nonFunctional: d.nonFunctional,
      },
      scaleAssumptions: d.scale,
      capacityEstimates: d.capacity,
      api: [
        {
          type: "paragraph",
          text: "The browser treats API contracts as versioned dependencies: validate response shape, attach trace context, and expose domain errors rather than raw HTTP details.",
        },
        list(d.api),
      ],
      dataModel: [
        {
          type: "paragraph",
          text: "Keep a normalized client view where identity and update ordering matter; derive screen-specific projections rather than duplicating server records.",
        },
        list(d.dataModel),
      ],
      highLevelArchitecture: [
        {
          type: "paragraph",
          text: "Route shell, feature boundary, query/cache layer, local interaction state, and transport adapter have separate responsibilities.",
        },
        list(d.architecture),
      ],
      diagram: {
        mermaid: `flowchart LR\n  U[User interaction] --> R[Route and feature boundary]\n  R --> S[Client state and cache]\n  S --> A[Typed API adapter]\n  A --> G[API gateway]\n  G --> B[Domain services]\n  B --> A\n  A --> S\n  S --> R`,
        caption:
          "Frontend system-design boundary: the client owns rendering, interaction state, cache policy, and graceful degradation.",
      },
      dataFlow: d.flow,
      storage: d.storage,
      caching: d.caching,
      asyncProcessing: d.async,
      scaling: d.scaling,
      consistency: d.consistency,
      reliability: d.reliability,
      failureScenarios: d.failure,
      security: d.security,
      observability: d.observability,
      bottlenecks: d.bottlenecks,
      alternatives: d.alternatives,
      tradeoffs: d.tradeoffs,
      interviewFollowUps: d.followUps,
      evolution: d.evolution,
    },
  };
}
