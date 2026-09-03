import type { ReactInterviewItem } from './types'

export const JAVA_INTERVIEW_NETWORKING: ReactInterviewItem[] = [
  {
    id: 'url-request-lifecycle',
    question: 'What happens when you enter an HTTPS URL?',
    relatedTopicIds: ['c4-url-request-lifecycle', 'c4-dns', 'c4-tcp-handshake', 'c4-tls13-handshake'],
    answer: [
      {
        type: 'paragraph',
        text: 'Parse the URL; check policy and caches; resolve DNS; choose an address/route; establish TCP or QUIC; complete TLS and ALPN; send HTTP through proxies/CDNs/load balancers; process the response and update caches. A strong answer includes connection reuse and separates DNS, connect, TLS, TTFB, and body timing.',
      },
    ],
  },
  {
    id: 'osi-tcpip',
    question: 'OSI vs TCP/IP model?',
    relatedTopicIds: ['c4-osi-model', 'c4-tcpip-model', 'c4-encapsulation'],
    answer: [
      {
        type: 'paragraph',
        text: 'OSI is a seven-layer conceptual reference model. The practical Internet suite is commonly grouped as application, transport, internet, and link. Use both to locate responsibilities, but do not force real protocols into one perfect layer.',
      },
    ],
  },
  {
    id: 'tcp-udp',
    question: 'TCP vs UDP?',
    relatedTopicIds: ['c4-tcp-vs-udp', 'c4-udp', 'c4-tcp'],
    answer: [
      {
        type: 'paragraph',
        text: 'TCP provides a connection-oriented, reliable, ordered byte stream with flow and congestion control. UDP preserves datagram boundaries but does not guarantee delivery, uniqueness, or order. Applications such as QUIC can implement reliability and multiplexing above UDP.',
      },
    ],
  },
  {
    id: 'tcp-handshake-close',
    question: 'Explain TCP connection establishment and termination.',
    relatedTopicIds: ['c4-tcp-handshake', 'c4-tcp-termination', 'c4-time-wait'],
    answer: [
      {
        type: 'paragraph',
        text: 'SYN, SYN-ACK, ACK exchanges initial sequence state. A graceful full-duplex close normally uses FIN/ACK independently in each direction; RST aborts. TIME_WAIT belongs to the active closer so delayed segments expire and the final ACK can be retransmitted.',
      },
    ],
  },
  {
    id: 'flow-vs-congestion',
    question: 'TCP flow control vs congestion control?',
    relatedTopicIds: ['c4-tcp-flow-control', 'c4-tcp-congestion-control'],
    answer: [
      {
        type: 'paragraph',
        text: 'Flow control protects the receiver using its advertised receive window. Congestion control protects the network using a congestion window adjusted from loss/latency signals. Effective sending is bounded by both.',
      },
    ],
  },
  {
    id: 'dns-resolution',
    question: 'How does DNS resolution work?',
    relatedTopicIds: ['c4-dns-hierarchy', 'c4-recursive-iterative-dns', 'c4-dns-cache-ttl'],
    answer: [
      {
        type: 'paragraph',
        text: 'A stub asks a recursive resolver. On a cache miss, that resolver follows iterative referrals from root to TLD to the authoritative server, validates if configured, caches by TTL, and returns records. Negative answers are cached too.',
      },
    ],
  },
  {
    id: 'dns-records-failover',
    question: 'A vs AAAA vs CNAME, and why is DNS failover not instant?',
    relatedTopicIds: ['c4-dns-records', 'c4-dns-failure'],
    answer: [
      {
        type: 'paragraph',
        text: 'A and AAAA map names to IPv4 and IPv6 addresses; CNAME aliases one name to another. Recursive resolvers, OSes, applications, and clients cache answers until TTL or longer operational limits, while existing connections can keep using the old endpoint.',
      },
    ],
  },
  {
    id: 'tls-handshake',
    question: 'What does the TLS 1.3 handshake accomplish?',
    relatedTopicIds: ['c4-tls13-handshake', 'c4-certificates-pki', 'c4-forward-secrecy'],
    answer: [
      {
        type: 'paragraph',
        text: 'It negotiates parameters, performs ephemeral key agreement, authenticates the server certificate/hostname, derives traffic keys, and verifies the transcript. A full TLS 1.3 handshake takes one RTT; HTTPS over a cold TCP connection also pays TCP setup first.',
      },
    ],
  },
  {
    id: 'sni-alpn',
    question: 'SNI vs ALPN?',
    relatedTopicIds: ['c4-sni-alpn', 'c4-tls'],
    answer: [
      {
        type: 'paragraph',
        text: 'SNI communicates the target server name so a shared endpoint can select the right certificate. ALPN negotiates the application protocol, such as h2 or http/1.1. Both are carried in the TLS handshake.',
      },
    ],
  },
  {
    id: 'http-safety-idempotency',
    question: 'Safe vs idempotent HTTP methods?',
    relatedTopicIds: ['c4-method-properties', 'c4-http-retries'],
    answer: [
      {
        type: 'paragraph',
        text: 'Safe methods are intended not to change server state. Idempotent means repeating the same request has the same intended effect as one execution; response codes may differ. Network retries still require care, especially for POST—use an idempotency key for retriable side effects.',
      },
    ],
  },
  {
    id: 'http-cache-validation',
    question: 'How do Cache-Control, ETag, and Vary work together?',
    relatedTopicIds: ['c4-cache-control', 'c4-etag-last-modified', 'c4-vary'],
    answer: [
      {
        type: 'paragraph',
        text: 'Cache-Control defines freshness and storage policy. A stale cached response can be revalidated with If-None-Match and ETag, yielding 304. Vary adds selected request headers to the cache key; omitting a relevant header can leak or serve the wrong representation.',
      },
    ],
  },
  {
    id: 'http-versions',
    question: 'HTTP/1.1 vs HTTP/2 vs HTTP/3?',
    relatedTopicIds: ['c4-http', 'c4-http2', 'c4-http3'],
    answer: [
      {
        type: 'paragraph',
        text: 'HTTP/1.1 uses textual messages and commonly multiple reusable TCP connections. HTTP/2 keeps HTTP semantics but adds binary frames, multiplexed streams, flow control, and HPACK over TCP. HTTP/3 maps semantics to QUIC over UDP with independent loss recovery, QPACK, integrated TLS 1.3, and connection migration.',
      },
    ],
  },
  {
    id: 'cors-not-security',
    question: 'What is CORS, and why is it not server-side authorization?',
    relatedTopicIds: ['c4-cors', 'c4-same-origin-policy', 'c4-cors-simple-preflight'],
    answer: [
      {
        type: 'paragraph',
        text: 'CORS is a browser mechanism that lets a server relax the same-origin policy for scripts. Non-browser clients can send requests regardless of CORS. The API must authenticate and authorize every request; preflight permission is not user permission.',
      },
    ],
  },
  {
    id: 'proxy-load-balancer',
    question: 'Reverse proxy vs Layer-4 vs Layer-7 load balancer?',
    relatedTopicIds: ['c4-reverse-proxies', 'c4-l4-vs-l7-lb', 'c4-load-balancers'],
    answer: [
      {
        type: 'paragraph',
        text: 'A reverse proxy accepts traffic for upstream servers and can terminate TLS, route, cache, or buffer. An L4 balancer routes connections using transport metadata without HTTP semantics. An L7 balancer parses HTTP and can route by host, path, header, or cookie at higher processing cost.',
      },
    ],
  },
  {
    id: 'websocket-sse',
    question: 'WebSocket vs Server-Sent Events?',
    relatedTopicIds: ['c4-websocket', 'c4-sse', 'c4-realtime-protocols'],
    answer: [
      {
        type: 'paragraph',
        text: 'WebSocket is a long-lived bidirectional framed channel after an HTTP upgrade/handshake. SSE is server-to-client text events over HTTP with browser reconnection support. SSE is simpler for notifications; WebSocket fits interactive two-way messaging.',
      },
    ],
  },
  {
    id: 'network-timeouts',
    question: 'Why should clients have separate network timeouts?',
    relatedTopicIds: ['c4-timeouts-retries-jitter', 'c4-connection-budget'],
    answer: [
      {
        type: 'paragraph',
        text: 'DNS, connection establishment, TLS, response headers, idle reads, pool acquisition, and total request time are different failure stages. One giant timeout hides the cause and consumes resources. Retries need a total deadline, a retry budget, exponential backoff, jitter, and safe operation semantics.',
      },
    ],
  },
  {
    id: 'network-debugging',
    question: 'How do you debug “the API is unreachable”?',
    relatedTopicIds: ['c4-layered-debugging', 'c4-dig-nslookup', 'c4-curl-openssl'],
    answer: [
      {
        type: 'paragraph',
        text: 'Confirm name resolution and returned address, route/reachability, target port and socket listener, TCP/QUIC connect, TLS certificate/SNI/ALPN, HTTP status/headers, proxy path, then application health. Use dig, traceroute where useful, nc/curl, openssl, ss/lsof, and packet capture—not ping alone.',
      },
    ],
  },
  {
    id: 'api-gateway',
    question: 'API gateway vs reverse proxy?',
    relatedTopicIds: ['c4-api-gateway', 'c4-reverse-proxies', 'c4-gateway-policies'],
    answer: [
      {
        type: 'paragraph',
        text: 'Both proxy requests to upstream services. An API gateway packages API-specific policy such as authentication, quotas, rate limits, transformations, version routing, and developer analytics. Keep business logic out of the gateway and define trusted forwarded-header boundaries.',
      },
    ],
  },
  {
    id: 'java-httpclient',
    question: 'How should Java HttpClient timeouts and async calls be configured?',
    relatedTopicIds: ['c4-java-httpclient', 'c4-httpclient-timeouts', 'c4-httpclient-async'],
    answer: [
      {
        type: 'paragraph',
        text: 'Configure a connect timeout on the shared HttpClient and a request timeout on each HttpRequest; apply an overall business deadline around async composition. Reuse the client for connection pooling and HTTP/2. sendAsync returns CompletableFuture, so handle exceptional completion, cancellation, executor/context behavior, and response-body consumption.',
      },
    ],
  },
]
