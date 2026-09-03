import type { TopicContent } from '@/domain/types'

type NetworkingTopicInput = {
  title: string
  sectionTitle: string
  parentTitle?: string
}

const SECTION_FOCUS: Record<string, string> = {
  'Network Foundations & Models': 'layering, encapsulation, latency, and end-to-end communication',
  'Devices, Media & Wireless': 'where forwarding happens and which physical constraints affect delivery',
  'Ethernet & Data Link Layer': 'local frames, MAC learning, broadcast domains, VLANs, and MTU',
  'IP Addressing & Subnetting': 'address ranges, prefixes, routing boundaries, IPv4, and IPv6',
  'Routing, NAT & Network Control': 'next-hop decisions, address translation, control protocols, and failure domains',
  'Transport Layer & Sockets': 'ports, socket identity, stream/datagram semantics, and application framing',
  'TCP Reliability & Performance': 'handshakes, ordering, retransmission, flow control, congestion, and lifecycle state',
  'DNS & Service Discovery': 'hierarchical resolution, records, caching, privacy transports, and failover',
  'TLS & HTTPS': 'identity validation, key agreement, encryption, protocol negotiation, and termination',
  'HTTP Semantics': 'methods, targets, headers, status, representations, safety, and idempotency',
  'HTTP Connections, Caching & Delivery': 'connection reuse, message delimiting, validators, cache keys, and compression',
  'HTTP/2, HTTP/3 & QUIC': 'framing, multiplexing, head-of-line blocking, QUIC streams, and negotiation',
  'Cookies, Sessions & Browser Boundaries': 'origin rules, credential scope, session identity, and backend trust boundaries',
  'Proxies, Load Balancers & CDN': 'traffic steering, health, forwarded identity, edge caching, and graceful draining',
  'API & Realtime Protocols': 'request style, schema contracts, streaming direction, cancellation, and retries',
  'Network Security Fundamentals': 'segmentation, authenticated encryption, filtering, tunnels, and abuse resistance',
  'Cloud & Container Networking': 'virtual networks, gateways, policy boundaries, service discovery, and overlays',
  'Performance & Troubleshooting': 'layered evidence from DNS through transport, TLS, HTTP, and application timing',
  'Java Networking APIs': 'client lifecycle, deadlines, connection reuse, async execution, and non-blocking server I/O',
}

export function createNetworkingTopicContent({
  title,
  sectionTitle,
  parentTitle,
}: NetworkingTopicInput): TopicContent {
  const focus = SECTION_FOCUS[sectionTitle] ?? 'packet flow, protocol guarantees, and failure diagnosis'
  const parent = parentTitle ? ` It is a focused part of ${parentTitle}.` : ''

  return {
    whatIsIt:
      `${title} is part of ${sectionTitle}.${parent} Learn it as one stage in an end-to-end request, ` +
      'including the guarantees it provides and the failures it cannot prevent.',
    whyExists:
      `${title} matters because network failures often look like application failures. ` +
      `It helps reason about ${focus}.`,
    mentalModel:
      `Trace bytes from client to server. At ${title}, identify the endpoint, protocol state, ` +
      'message boundary, timeout, cache, and observable evidence before moving to another layer.',
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: [
          `Place ${title} in the TCP/IP and OSI models without treating either model as implementation law.`,
          'Name the input and output unit: bytes, frame, packet, datagram, stream, or application message.',
          'State addressing, reliability, ordering, flow-control, encryption, and caching guarantees.',
          'Explain timeout, retry, fallback, and the command or metric that verifies the hypothesis.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Layered diagnosis',
        text:
          `Do not explain ${title} in isolation. A complete answer separates DNS resolution, route, ` +
          'transport connection, TLS, HTTP, proxy, and application processing.',
      },
    ],
    internals: [
      {
        type: 'list',
        items: [
          'A socket connection is identified by protocol plus source/destination addresses and ports; a port does not uniquely identify one process globally.',
          'TCP is an ordered byte stream, so application protocols must define their own message boundaries.',
          'Retries interact with method semantics: network success is not proof that an application operation ran exactly once.',
          'Caches and connection pools improve latency but introduce staleness, capacity, and invalidation failure modes.',
        ],
      },
    ],
    failureModes: [
      `Treating ${title} as reliable beyond its documented guarantees.`,
      'Retrying a state-changing operation without idempotency protection.',
      'Using an unbounded timeout or connection pool and creating a resource-exhaustion cascade.',
      'Debugging only at the application layer without DNS, socket, TLS, or packet evidence.',
    ],
    production: {
      reliability: [
        'Set separate DNS, connect, TLS, response-header, idle, and total deadlines where the client supports them.',
        'Bound connection pools and queues; use retry budgets with backoff and jitter.',
        'Design protocol downgrade and region/endpoint failover without weakening security.',
      ],
      observability: [
        'Record resolved endpoint, negotiated protocol/ALPN, connection reuse, status, retries, and phase timings.',
        'Track DNS errors, connect failures, TLS failures, resets, retransmissions, pool wait, and tail latency.',
      ],
      maintainability: [
        'Keep packet captures and verbose client traces free of secrets before sharing them.',
        'Reproduce with dig, curl, openssl, ss/lsof, and tcpdump at the narrowest failing layer.',
      ],
    },
    interview: {
      expectations: [
        `Define ${title} and place it in an end-to-end request.`,
        'Distinguish protocol guarantees from common implementation behavior.',
        'Name one production failure and the evidence used to confirm it.',
      ],
      commonQuestions: [
        `What problem does ${title} solve?`,
        `Where does ${title} sit in the request path?`,
        `How would you diagnose a failure involving ${title}?`,
      ],
      followUps: [
        'Which timeout fires, and is retry safe?',
        'How does a proxy, NAT, CDN, or load balancer change the answer?',
      ],
      misconceptions: [
        `${title} guarantees exactly-once application processing.`,
        'A successful ping proves that HTTPS and the application are healthy.',
      ],
      traps: [
        'Reciting seven OSI layers without tracing a real request.',
        'Confusing TCP flow control with network congestion control.',
      ],
      strongSignals: [
        'Uses packets, streams, messages, and connections precisely.',
        'Includes caching, connection reuse, deadlines, and observable evidence.',
      ],
    },
    keyTakeaways: [
      `${title} belongs to ${sectionTitle}.`,
      `Focus on ${focus}.`,
      'Guarantee → failure mode → timeout → evidence → safe recovery.',
    ],
    interviewQuestions: [
      {
        level: 'basic',
        question: `What is ${title}, and at which network layer does it operate?`,
        answerHint: `Define it within ${sectionTitle}; explain the data unit it consumes and produces.`,
      },
      {
        level: 'intermediate',
        question: `How does ${title} affect latency, reliability, or security?`,
        answerHint: `Discuss ${focus}, including one trade-off.`,
      },
      {
        level: 'advanced',
        question: `How would you prove that ${title} is the failing stage in production?`,
        answerHint: 'Name the phase timing, command, log, metric, or packet evidence and rule out adjacent layers.',
      },
    ],
    flashcards: [
      { front: title, back: `${sectionTitle}: ${focus}.` },
      { front: `${title} debugging rule`, back: 'Locate the layer, capture evidence, then retry or fail over safely.' },
    ],
    quickRevision: [
      `${title} — ${sectionTitle}`,
      `Focus: ${focus}`,
      'Addressing + message boundaries + guarantees',
      'Timeout + evidence + safe recovery',
    ],
  }
}
