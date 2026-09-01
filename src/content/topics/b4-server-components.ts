import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'React Server Components (RSC) are components that run only on the server — their code never ships to the client bundle, they can async/await data directly during render, and they pass serializable output to the client where Client Components hydrate for interactivity.',
  whyExists:
    'SPAs shipped large JS for mostly static UI and duplicated data-fetch logic. RSC reduces bundle size, moves data access to server (secrets, DB), enables streaming HTML, and colocates data with UI without client useEffect waterfalls.',
  mentalModel:
    '"use client" marks interactive boundary. Server components default in App Router. Server fetches and renders to special payload/stream; client components receive props (including server-rendered children as slots). Cannot use useState/useEffect in server components. Composition: Server wraps Client, pass server output as children.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Server component render executes on server per request (or at build for static).',
        'Async server component awaits DB/API during render.',
        'Output serialized into RSC flight format streamed to browser.',
        'Client components bundled separately; hydrate where "use client" appears.',
        'Server can import server-only modules; client cannot import server components (one-way).',
      ],
    },
    {
      type: 'mermaid',
      caption: 'RSC data flow',
      diagram: `flowchart LR
  S[Server Component] --> DB[(Database)]
  S --> Flight[RSC Payload]
  Flight --> C[Client Component]
  C --> DOM[Hydrated UI]`,
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Not SSR replacement',
      text: 'RSC is a component type model. SSR is delivery timing. You can SSR client components and stream server components together in Next.js App Router.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Server component with async fetch',
      code: `// app/page.tsx — Server Component by default
async function ProductPage({ params }: { params: { id: string } }) {
  const product = await db.product.find(params.id);
  return (
    <div>
      <h1>{product.name}</h1>
      <AddToCartButton productId={product.id} /> {/* Client child */}
    </div>
  );
}`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Client boundary',
      code: `'use client';
import { useState } from 'react';

export function AddToCartButton({ productId }: { productId: string }) {
  const [pending, setPending] = useState(false);
  return <button onClick={() => add(productId)} disabled={pending}>Add</button>;
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Flight protocol serializes component tree references not full HTML only.',
        'Client reference props must be serializable — no functions from server to client (except special actions).',
        'Server Actions: async functions marked "use server" invoked from client forms.',
        'Caching: fetch cache and unstable_cache on server control re-fetch.',
        'Partial Prerendering (experimental) mixes static shell + dynamic holes.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Zero client JS for server-only UI',
      'Direct server data access without API layer',
      'Streaming improves TTFB',
    ],
    disadvantages: [
      'Mental model split server/client files',
      'Vendor lock-in patterns strongest in Next.js',
      'Debugging across network boundary harder',
    ],
    alternatives: [
      'Classic SSR + client fetch (React Query)',
      'SSG with ISR for mostly static',
      'Traditional REST + CSR',
    ],
    whenToUse: [
      'Data-heavy read UI, dashboards, product pages',
      'Reduce bundle for static content sections',
    ],
    whenNotToUse: [
      'Highly interactive-only widgets with no server data win',
      'Non-Next framework without RSC support yet',
    ],
  },
  failureModes: [
    'useState in server component — build error.',
    'Import server component into client — forbidden.',
    'Pass non-serializable props (function, Date without serialization).',
    'Accidentally mark entire app "use client" — loses RSC benefits.',
    'N+1 server queries without batching in nested server components.',
  ],
  production: {
    performance: ['Keep client boundaries leaf-level; push data fetch to server'],
    security: ['Secrets and tokens stay server-side only'],
    maintainability: ['Colocate server fetch with UI; clear client boundary files'],
  },
  interview: {
    expectations: [
      'Server vs client component capabilities',
      'Bundle size implications',
      'Cannot use hooks in server components',
    ],
    commonQuestions: [
      'What are React Server Components?',
      'Difference RSC and SSR?',
      'What is use client?',
    ],
    followUps: [
      'Server Actions?',
      'Serialization constraints?',
    ],
    misconceptions: [
      'RSC means no JavaScript on client at all',
      'Server components hydrate on client',
      'Any React app supports RSC identically',
    ],
    traps: ['Saying server components run in browser for hydration'],
    strongSignals: [
      'Server-only execution, no client bundle',
      'Async render on server',
      'Client boundary for interactivity',
    ],
  },
  keyTakeaways: [
    'RSC run on server; code not in client bundle.',
    'Async data fetch during server render.',
    '"use client" marks interactive components.',
    'Props to client must be serializable.',
    'Compose server layout with client islands.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Can you use useState in a Server Component?',
      answerHint: 'No — hooks require client components with "use client".',
    },
    {
      level: 'intermediate',
      question: 'How do RSC reduce bundle size?',
      answerHint: 'Server component code never shipped; only client components and RSC payload.',
    },
    {
      level: 'advanced',
      question: 'RSC vs SSR distinction?',
      answerHint: 'RSC is component model running on server; SSR is rendering timing — can combine streaming RSC over SSR.',
    },
  ],
  flashcards: [
    { front: 'Server Component', back: 'Runs on server; not in client JS bundle' },
    { front: 'use client', back: 'Marks file as Client Component boundary' },
    { front: 'RSC data fetch', back: 'async/await directly in server component render' },
  ],
  quickRevision: [
    'Server = no client bundle',
    'No hooks on server',
    'use client for interactivity',
    'Serializable props only',
    'Streaming flight payload',
    'Not same as SSR alone',
  ],
}
