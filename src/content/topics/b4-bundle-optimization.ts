import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Bundle optimization reduces JavaScript payload and parse cost through tree shaking, minification, compression, intelligent chunking, dependency auditing, and eliminating duplicate polyfills — maximizing cache efficiency and minimizing time-to-interactive.',
  whyExists:
    'Every KB of JS must download, parse, and compile before interactivity. Unused library code, duplicate dependencies, and un-split monoliths directly hurt Core Web Vitals. Optimization is mandatory for production React apps at scale.',
  mentalModel:
    'Measure first (bundle analyzer), then cut: remove dead imports, replace heavy libs, split routes, externalize or lazy heavy widgets, hash filenames for immutable caching, Brotli at CDN. Parse cost scales with bundle size on mobile.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Tree shaking: ESM static imports let bundler drop unused exports (sideEffects: false in package.json).',
        'Minification: Terser/esbuild shrinks identifiers and syntax.',
        'Code splitting: dynamic import creates separate cached chunks.',
        'Manual chunks: vendor (react), ui-lib, per-feature isolation.',
        'Analyze: rollup-plugin-visualizer, webpack-bundle-analyzer, source-map-explorer.',
      ],
    },
    {
      type: 'table',
      headers: ['Technique', 'Impact'],
      rows: [
        ['Route code splitting', 'Large initial bundle reduction'],
        ['Replace moment → date-fns/dayjs', 'Remove 200KB+ legacy lib'],
        ['Import lodash-es/debounce only', 'Avoid full lodash'],
        ['compression (brotli/gzip)', 'Transfer size −70%'],
        ['Long cache immutable assets', 'Repeat visit instant'],
        ['Bundle size CI budget', 'Prevent regressions'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Optimize measured paths',
      text: 'Do not memo every component before cutting 400KB chart library from main chunk. Profile bundle and runtime together.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'typescript',
      caption: 'Vite manual chunks',
      code: `// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
        },
      },
    },
    target: 'es2020',
    sourcemap: true, // for production analysis only
  },
});`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Tree-shake friendly imports',
      code: `// BAD — may pull entire library
import _ from 'lodash';
_.debounce(fn, 300);

// GOOD
import debounce from 'lodash-es/debounce';`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'CommonJS modules harder to tree-shake than ESM.',
        'sideEffects: false incorrect → removes needed CSS init.',
        'Duplicate React versions from nested deps — dedupe in bundler resolve.',
        'Polyfills: @vitejs/plugin-legacy adds cost — target modern browsers when possible.',
        'Source maps excluded from prod deploy or served separately for security.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Faster load and TTI especially on mobile',
      'Better cache hit rates with hashed chunks',
      'CI budgets prevent team regressions',
    ],
    disadvantages: [
      'Aggressive splitting increases HTTP/connection overhead (HTTP/2 mitigates)',
      'Manual chunk tuning maintenance',
      'Over-tree-shaking can break side-effect imports',
    ],
    alternatives: [
      'SSR/RSC moves some logic server-side — smaller client bundle',
      'Micro-frontends for org-scale separation',
    ],
    whenToUse: [
      'Every production build pipeline',
      'Before adding large dependencies',
    ],
    whenNotToUse: [
      'Premature micro-optimization before measuring',
      'Splitting below ~20KB chunks excessively',
    ],
  },
  failureModes: [
    'Importing entire icon pack — 500KB for 3 icons.',
    'moment.js locales bundled by default.',
    'No compression on CDN — gzip not enabled.',
    'Caching index.html with old chunk hashes — 404 on deploy.',
    'Barrel files (index.ts re-export everything) defeat tree shaking.',
  ],
  production: {
    performance: [
      'Bundle analyzer in CI; fail PR over budget threshold',
      'Brotli + long-cache immutable for /assets/*',
      'Short/no-cache index.html',
      'Dependency review for size (bundlephobia)',
    ],
    observability: ['Web Vitals; track JS bytes transferred in RUM'],
    maintainability: ['Document manual chunk strategy; periodic dep audit'],
    cost: ['Smaller bundles reduce CDN egress marginally'],
  },
  interview: {
    expectations: [
      'Tree shaking concept',
      'Code splitting + vendor chunks',
      'Measure before optimize',
    ],
    commonQuestions: [
      'How reduce React bundle size?',
      'What is tree shaking?',
      'Immutable caching strategy?',
    ],
    followUps: [
      'Barrel file problem?',
      'moment vs dayjs?',
    ],
    misconceptions: [
      'Minification same as tree shaking',
      'Smaller gzip equals smaller parse time linearly always',
      'Production React build includes dev tools by default (it does not)',
    ],
    traps: ['Listing useMemo before bundle analysis'],
    strongSignals: [
      'Analyzer-driven workflow',
      'manualChunks vendor split',
      'lodash-es specific imports',
      'content-hash + immutable cache',
    ],
  },
  keyTakeaways: [
    'Measure bundle; tree shake, split, compress.',
    'Route split + vendor chunk highest impact.',
    'Import only needed modules — avoid barrel bloat.',
    'Brotli/gzip on CDN; immutable hash for assets.',
    'CI bundle budget prevents regressions.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is tree shaking?',
      answerHint: 'Dead code elimination — bundler drops unused ESM exports at build time.',
    },
    {
      level: 'intermediate',
      question: 'Why separate vendor chunk?',
      answerHint: 'react/react-dom change rarely — long cache separate from app code that changes often.',
    },
    {
      level: 'advanced',
      question: 'Why barrel files hurt bundle size?',
      answerHint: 'Re-export all may prevent shaking if bundler cannot prove unused exports side-effect free.',
    },
  ],
  flashcards: [
    { front: 'Tree shaking', back: 'Remove unused ESM exports at build' },
    { front: 'manualChunks', back: 'Bundler config to isolate vendor/feature chunks' },
    { front: 'immutable cache', back: 'Hash filename + long max-age for static assets' },
  ],
  quickRevision: [
    'Analyze bundle first',
    'Tree shake ESM imports',
    'Route + vendor split',
    'Specific imports not whole lib',
    'Brotli + hashed assets',
    'CI size budget',
  ],
}
