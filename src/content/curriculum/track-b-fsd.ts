import type { Priority } from '@/domain/types'
import type { SectionSeed, TopicSeed } from './build'

const SD = ['frontend-sd'] as const
const M78 = [7, 8]
const M910 = [9, 10]

function item(
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  const { tags, executionPriority, ...rest } = extra
  const months = priority === 'tier1' ? M78 : M910
  return {
    id,
    title,
    priority,
    months: extra.months ?? months,
    tags: [...SD, ...(tags ?? [])],
    executionPriority:
      executionPriority ?? (priority === 'tier1' ? 'p0' : priority === 'tier2' ? 'p1' : 'later'),
    ...rest,
  }
}

function nest(
  parent: string,
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  return item(id, title, priority, {
    ...extra,
    curriculumLevel: 'nested-concept',
    parentTopicId: parent,
  })
}

function practice(
  parent: string,
  id: string,
  title: string,
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  return nest(parent, id, title, extra.priority ?? 'tier1', {
    ...extra,
    kind: 'system-design',
    tags: ['practice', ...(extra.tags ?? [])],
  })
}

function section(id: string, title: string, order: number, topics: TopicSeed[]): SectionSeed {
  return {
    id,
    track: 'B',
    title,
    order,
    defaultKind: 'system-design',
    defaultDepth: 'deep',
    topics,
  }
}

/**
 * B6.1–B6.14 — Frontend system design for interviews.
 * Protocols, XSS/CORS internals, and service-worker APIs stay in B3;
 * React testing/state libraries stay in B4; CSS a11y tokens stay in B5.
 * Structure follows RADIO + widget LLD + product HLD (GreatFrontEnd / Namaste),
 * written as original interview notes — not copied course text.
 */
export const TRACK_B_FSD_SECTIONS: SectionSeed[] = [
  section('B6.1', 'Interview Method', 152, [
    item('b6-radio-framework', 'RADIO Framework'),
    nest('b6-radio-framework', 'b6-radio-requirements', 'Requirements & Constraints'),
    nest('b6-radio-framework', 'b6-radio-architecture', 'Architecture Sketch'),
    nest('b6-radio-framework', 'b6-radio-data', 'Data Model & Ownership'),
    nest('b6-radio-framework', 'b6-radio-interface', 'Interface & API Contracts'),
    nest('b6-radio-framework', 'b6-radio-optimizations', 'Optimizations (Perf, A11y, i18n)'),
    item('b6-sd-question-types', 'Question Types: Apps vs Widgets'),
    nest('b6-sd-question-types', 'b6-sd-app-hld', 'Application / Product HLD'),
    nest('b6-sd-question-types', 'b6-sd-widget-lld', 'UI Component / Widget LLD'),
    nest('b6-sd-question-types', 'b6-sd-hybrid-question', 'Hybrid: Widget Inside a Product'),
    item('b6-sd-evaluation', 'Evaluation Criteria & Timeboxing'),
    nest('b6-sd-evaluation', 'b6-sd-common-mistakes', 'Common Interview Mistakes'),
    nest('b6-sd-evaluation', 'b6-sd-time-split', 'Time Split in a 45-Minute Round'),
  ]),

  section('B6.2', 'Application Architecture', 153, [
    item('b6-large-app-architecture', 'Large-Application Architecture'),
    nest('b6-large-app-architecture', 'b6-spa-vs-mpa', 'SPA vs MPA Trade-offs'),
    nest('b6-large-app-architecture', 'b6-rendering-strategy', 'CSR, SSR, SSG & Streaming Choice'),
    nest('b6-large-app-architecture', 'b6-folder-feature', 'Feature Boundaries & Folder Structure'),
    nest('b6-large-app-architecture', 'b6-config-driven-ui', 'Config-Driven UI'),
    item('b6-error-handling', 'Frontend Error Handling'),
    nest('b6-error-handling', 'b6-error-boundaries-sd', 'Error Boundaries at Product Edges'),
    nest('b6-error-handling', 'b6-retry-fallback', 'Retry, Timeout & Fallback UI'),
    nest('b6-error-handling', 'b6-empty-error-states', 'Empty, Partial & Degraded States'),
    item('b6-seo-architecture', 'SEO-Aware Frontend Architecture', 'tier2'),
    nest('b6-seo-architecture', 'b6-ssr-seo', 'SSR, Metadata & Crawlability', 'tier2'),
    nest('b6-seo-architecture', 'b6-forms-checkout-ux', 'Forms, Checkout & Conversion UX', 'tier2'),
  ]),

  section('B6.3', 'Component & Widget LLD', 154, [
    item('b6-component-architecture', 'Component Architecture'),
    nest('b6-component-architecture', 'b6-compound-headless', 'Compound & Headless Components'),
    nest('b6-component-architecture', 'b6-composition-boundaries', 'Composition vs Configuration'),
    nest('b6-component-architecture', 'b6-shimmer-ui', 'Shimmer / Skeleton Loading'),
    nest('b6-component-architecture', 'b6-widget-autocomplete', 'Autocomplete / Typeahead'),
    nest('b6-component-architecture', 'b6-widget-dropdown', 'Dropdown Menu'),
    nest('b6-component-architecture', 'b6-widget-carousel', 'Image Carousel'),
    nest('b6-component-architecture', 'b6-widget-modal', 'Modal Dialog'),
    nest('b6-component-architecture', 'b6-widget-data-table', 'Data Table'),
    nest('b6-component-architecture', 'b6-widget-poll', 'Poll Widget'),
    nest('b6-component-architecture', 'b6-widget-accordion', 'Accordion'),
    nest('b6-component-architecture', 'b6-widget-nested-comments', 'Nested Comments'),
    nest('b6-component-architecture', 'b6-widget-rich-text', 'Rich Text Editor'),
  ]),

  section('B6.4', 'State Architecture', 155, [
    item('b6-state-architecture', 'State Architecture'),
    nest('b6-state-architecture', 'b6-client-server-url-state', 'Client, Server & URL State'),
    nest('b6-state-architecture', 'b6-store-boundaries', 'Store Boundaries & Ownership'),
    nest('b6-state-architecture', 'b6-optimistic-sd', 'Optimistic UI & Rollback'),
    nest('b6-state-architecture', 'b6-derived-normalized', 'Derived vs Normalized State'),
  ]),

  section('B6.5', 'API Layer', 156, [
    item('b6-api-layer', 'API-Layer Design'),
    nest('b6-api-layer', 'b6-bff', 'BFF & Aggregation'),
    nest('b6-api-layer', 'b6-rest-gql-choice', 'REST vs GraphQL vs RPC at the Client'),
    nest('b6-api-layer', 'b6-pagination-contracts', 'List Contracts: Offset, Cursor, Relay'),
    nest('b6-api-layer', 'b6-error-envelopes', 'Error Envelopes & Idempotency'),
  ]),

  section('B6.6', 'Frontend Authentication', 157, [
    item('b6-authentication', 'Frontend Authentication', 'tier1', {
      related: ['c9-authentication'],
    }),
    nest('b6-authentication', 'b6-session-vs-token', 'Session Cookies vs Tokens on the Client'),
    nest('b6-authentication', 'b6-protected-routes-sd', 'Protected Routes & Auth Gates'),
    nest('b6-authentication', 'b6-authorization-ui', 'Authorization in the UI'),
    nest('b6-authentication', 'b6-auth-refresh', 'Refresh, Logout & Session Expiry'),
  ]),

  section('B6.7', 'Lists, Search & Pagination', 158, [
    item('b6-pagination', 'Pagination / Infinite Scrolling'),
    nest('b6-pagination', 'b6-infinite-scrolling', 'Infinite Scrolling'),
    nest('b6-pagination', 'b6-cursor-vs-offset', 'Cursor vs Offset Pagination'),
    nest('b6-pagination', 'b6-virtualization-sd', 'Windowing & Virtualization'),
    item('b6-search-architecture', 'Search & Autocomplete Architecture'),
    nest('b6-search-architecture', 'b6-search-debounce', 'Debounce, Cancel & Stale Responses'),
    nest('b6-search-architecture', 'b6-search-ranking-ux', 'Ranking, Empty States & No-Results'),
    nest('b6-search-architecture', 'b6-search-prefetch', 'Prefetch & Typeahead Caching'),
  ]),

  section('B6.8', 'Realtime UI', 159, [
    item('b6-realtime-ui', 'Real-time UI'),
    nest('b6-realtime-ui', 'b6-polling-vs-push', 'Polling vs WebSocket vs SSE'),
    nest('b6-realtime-ui', 'b6-presence-typing', 'Presence, Typing & Read Receipts'),
    nest('b6-realtime-ui', 'b6-event-ordering', 'Ordering, Gaps & Replay'),
    nest('b6-realtime-ui', 'b6-reconnect-backoff', 'Reconnect, Backoff & Fan-out'),
  ]),

  section('B6.9', 'Frontend Performance', 160, [
    item('b6-performance', 'Frontend Performance'),
    nest('b6-performance', 'b6-core-web-vitals-sd', 'Core Web Vitals as Design Constraints'),
    nest('b6-performance', 'b6-rendering-patterns-sd', 'Rendering Patterns at Product Scale'),
    nest('b6-performance', 'b6-network-build-opt', 'Network & Build Optimization Choices'),
    nest('b6-performance', 'b6-perf-budgets', 'Performance Budgets & Monitoring'),
    nest('b6-performance', 'b6-js-main-thread', 'Main-Thread Work & Interaction Latency'),
  ]),

  section('B6.10', 'Caching & Offline', 161, [
    item('b6-caching', 'Frontend Caching'),
    nest('b6-caching', 'b6-http-cache-strategy', 'HTTP Caching Strategy'),
    nest('b6-caching', 'b6-api-swr', 'API Cache & Stale-While-Revalidate'),
    nest('b6-caching', 'b6-memory-cache', 'In-Memory Cache & Request Deduping'),
    item('b6-offline-pwa', 'Offline & PWA Strategy'),
    nest('b6-offline-pwa', 'b6-sw-strategy', 'Service Worker Caching Strategies'),
    nest('b6-offline-pwa', 'b6-offline-queue', 'Offline Queue, Sync & Conflict UI'),
  ]),

  section('B6.11', 'Frontend Security Architecture', 162, [
    item('b6-fe-security-architecture', 'Frontend Security Architecture'),
    nest('b6-fe-security-architecture', 'b6-xss-csrf-design', 'XSS & CSRF as Design Choices'),
    nest('b6-fe-security-architecture', 'b6-security-headers-sd', 'Headers, SRI & iframe Isolation'),
    nest('b6-fe-security-architecture', 'b6-third-party-scripts', 'Third-Party Scripts & Supply Chain'),
    nest('b6-fe-security-architecture', 'b6-untrusted-html', 'Untrusted HTML, Markdown & Embeds'),
  ]),

  section('B6.12', 'Observability', 163, [
    item('b6-observability', 'Frontend Observability'),
    nest('b6-observability', 'b6-telemetry', 'Telemetry & Real User Monitoring'),
    nest('b6-observability', 'b6-alerting-fe', 'Alerting on Client Failures'),
    nest('b6-observability', 'b6-session-replay', 'Session Replay & Privacy', 'tier2'),
  ]),

  section('B6.13', 'A11y, i18n & Design Systems', 164, [
    item('b6-a11y-sd', 'Accessibility in Large Apps', 'tier1', { tags: ['a11y'] }),
    nest('b6-a11y-sd', 'b6-keyboard-scale', 'Keyboard & Focus at App Scale', 'tier1', {
      tags: ['a11y'],
    }),
    nest('b6-a11y-sd', 'b6-a11y-perf', 'A11y, Performance & Dynamic Content', 'tier1', {
      tags: ['a11y'],
    }),
    item('b6-i18n', 'Internationalization'),
    nest('b6-i18n', 'b6-rtl-sd', 'RTL, Locale Routing & Copy Length'),
    nest('b6-i18n', 'b6-icu-plurals', 'ICU, Plurals & Date/Number Formats'),
    item('b6-design-systems-sd', 'Design Systems (System Design)'),
    nest('b6-design-systems-sd', 'b6-token-governance', 'Tokens, Versioning & Governance'),
    nest('b6-design-systems-sd', 'b6-ds-adoption', 'Adoption, Overrides & Multi-Brand'),
  ]),

  section('B6.14', 'HLD Case Studies & Microfrontends', 165, [
    item('b6-hld-practice', 'HLD Practice Cases'),
    practice('b6-hld-practice', 'b6-practice-social-feed', 'Practice: News Feed / Infinite Social Feed'),
    practice('b6-hld-practice', 'b6-practice-google-docs', 'Practice: Google Docs Frontend'),
    practice('b6-hld-practice', 'b6-practice-youtube', 'Practice: YouTube Frontend'),
    practice('b6-hld-practice', 'b6-practice-slack', 'Practice: Chat App (Messenger / Slack)'),
    practice('b6-hld-practice', 'b6-practice-gmail', 'Practice: Email Client (Gmail / Outlook)'),
    practice('b6-hld-practice', 'b6-practice-uber', 'Practice: Uber Web App'),
    practice('b6-hld-practice', 'b6-practice-trading', 'Practice: Trading Dashboard'),
    practice('b6-hld-practice', 'b6-practice-pinterest', 'Practice: Pinterest Masonry'),
    practice('b6-hld-practice', 'b6-practice-netflix', 'Practice: Video Streaming (Netflix)'),
    practice('b6-hld-practice', 'b6-practice-amazon', 'Practice: E-commerce Marketplace'),
    practice('b6-hld-practice', 'b6-practice-airbnb', 'Practice: Travel Booking'),
    practice('b6-hld-practice', 'b6-practice-instagram', 'Practice: Photo Sharing'),
    practice('b6-hld-practice', 'b6-practice-spotify', 'Practice: Music Streaming'),
    practice('b6-hld-practice', 'b6-practice-zoom', 'Practice: Video Conferencing'),
    practice('b6-hld-practice', 'b6-practice-sheets', 'Practice: Collaborative Spreadsheet'),
    practice('b6-hld-practice', 'b6-practice-figma', 'Practice: Design / Drawing Tool'),
    practice('b6-hld-practice', 'b6-practice-analytics', 'Practice: Analytics Dashboard', {
      priority: 'tier2',
    }),
    practice('b6-hld-practice', 'b6-practice-kanban', 'Practice: Kanban Board', { priority: 'tier2' }),
    practice('b6-hld-practice', 'b6-practice-live-commentary', 'Practice: Live Commentary', {
      priority: 'tier2',
    }),
    item('b6-micro-frontends', 'Micro-frontends Concepts'),
    nest('b6-micro-frontends', 'b6-mfe-when-not', 'When Not to Use Microfrontends'),
    nest('b6-micro-frontends', 'b6-mfe-integration', 'Integration: Build, Runtime & Routing'),
    nest('b6-micro-frontends', 'b6-mfe-shared-deps', 'Shared Dependencies & Design System'),
  ]),
]
