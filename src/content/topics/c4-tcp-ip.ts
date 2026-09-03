import type { TopicContent } from '@/domain/types'

export const tcpIpContent: TopicContent = {
  whatIsIt:
    'TCP/IP is the Internet protocol suite: IP routes packets between hosts; TCP provides reliable, ordered, byte-stream delivery with congestion control on top of IP. Application protocols (HTTP, TLS) sit above TCP at the transport layer.',
  whyExists:
    'Raw IP is unreliable — packets drop, reorder, duplicate. TCP abstracts a reliable pipe so HTTP servers and clients can send request/response without reimplementing retransmission, flow control, and ordering.',
  mentalModel:
    'IP = postcards (best effort, may lose). TCP = phone call (connection, acknowledgments, retransmit lost segments). Three-way handshake opens; four-way close tears down. Ports multiplex many services on one IP.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Layer', 'Protocol', 'Role'],
      rows: [
        ['Application', 'HTTP, DNS, TLS', 'App semantics'],
        ['Transport', 'TCP, UDP', 'End-to-end delivery, ports'],
        ['Network', 'IP (v4/v6)', 'Host addressing, routing'],
        ['Link', 'Ethernet, Wi-Fi', 'Local frame delivery'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'TCP three-way handshake',
      diagram: `sequenceDiagram
  participant C as Client
  participant S as Server
  C->>S: SYN (seq=x)
  S->>C: SYN-ACK (seq=y, ack=x+1)
  C->>S: ACK (ack=y+1)
  Note over C,S: Connection ESTABLISHED`,
    },
    {
      type: 'list',
      items: [
        'IP address identifies an interface/host path; a port identifies a transport endpoint that the OS maps to a socket.',
        'TCP segments: sequence numbers, ACKs, window for flow control.',
        'Congestion control (Cubic, BBR) adapts send rate to network.',
        'UDP: no connection, no guarantee — DNS, QUIC base, video.',
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  App[HTTP/TLS] --> TCP[TCP : reliable stream]
  TCP --> IP[IP : routing]
  IP --> NIC[Network interface]
  subgraph OSI simplified
    L7[Application] --> L4[Transport TCP/UDP]
    L4 --> L3[Network IP]
    L3 --> L2[Link]
  end`,
    caption: 'HTTP rides on TCP which rides on IP',
  },
  example: [
    {
      type: 'code',
      language: 'text',
      caption: 'Socket addressing',
      code: `Client connects to 203.0.113.10:443
  → IP routes to host 203.0.113.10
  → TCP connects to port 443 (HTTPS daemon)
  → TLS then HTTP run over byte stream`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Java Socket (conceptual)',
      code: `try (Socket socket = new Socket("api.example.com", 443);
     OutputStream out = socket.getOutputStream();
     InputStream in = socket.getInputStream()) {
  // TLS wraps streams in real HTTPS client
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'SYN backlog: listen queue before accept(); overflow → dropped SYNs.',
        'TIME_WAIT: closing side waits 2MSL for stray segments — many short connections exhaust ports.',
        'Nagle algorithm batches small sends; TCP_NODELAY disables for low latency.',
        'MTU/path MTU: IP fragmentation avoided; TCP MSS negotiated in handshake.',
        'NAT rewrites IP:port; breaks some P2P; connection tracking tables have limits.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Reliable ordered delivery simplifies application code',
      'Flow and congestion control protect network',
      'Universal support across stacks and firewalls',
    ],
    disadvantages: [
      'Connection setup latency (handshake + TLS)',
      'Head-of-line blocking in TCP stream',
      'STATE in middleboxes (NAT, firewalls)',
    ],
    alternatives: [
      'UDP + QUIC (HTTP/3) — TLS integrated, multiplexed streams',
      'UDP for loss-tolerant realtime',
    ],
    whenToUse: [
      'HTTP/1.1, HTTP/2 over TCP',
      'Any protocol needing reliable byte stream',
    ],
    whenNotToUse: [
      'Real-time media where late data is useless (often UDP)',
      'When connection setup cost dominates (consider QUIC/UDP)',
    ],
  },
  failureModes: [
    'SYN flood / full accept queue → connection timeouts.',
    'Port exhaustion from TIME_WAIT on client side.',
    'Packet loss → retransmit latency spikes.',
    'Firewall drops non-standard ports.',
    'MTU black holes → hung connections without PMTUD.',
  ],
  interview: {
    expectations: [
      'Explain 3-way handshake and why SYN',
      'TCP vs UDP trade-offs',
      'Role of IP vs TCP vs application layer',
    ],
    commonQuestions: [
      'What happens in TCP handshake?',
      'TCP vs UDP?',
      'What is a port?',
      'Why TIME_WAIT?',
    ],
    followUps: [
      'How does HTTP relate to TCP?',
      'Head-of-line blocking in HTTP/2 vs QUIC?',
    ],
    misconceptions: [
      'TCP guarantees message boundaries (it’s a byte stream)',
      'One HTTP request = one new TCP connection always',
      'IP and TCP are the same thing',
    ],
    traps: ['Confusing OSI 7 layers with TCP/IP 4 layers numbering'],
    strongSignals: [
      'Draws handshake sequence correctly',
      'Mentions ports, reliability, ordering separately',
      'Connects to TLS/HTTP layering',
    ],
  },
  keyTakeaways: [
    'IP routes; TCP reliable ordered stream; ports demux services.',
    'SYN, SYN-ACK, ACK opens connection.',
    'UDP fast/unreliable; TCP reliable with overhead.',
    'HTTP sits above TCP (often TLS in between).',
    'TIME_WAIT and NAT are production concerns.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does TCP provide that IP alone does not?',
      answerHint: 'Reliability, ordering, retransmission, flow control, ports.',
    },
    {
      level: 'intermediate',
      question: 'Describe the TCP three-way handshake.',
      answerHint: 'SYN → SYN-ACK → ACK; exchanges initial sequence numbers.',
    },
    {
      level: 'advanced',
      question: 'What is TIME_WAIT and when is it a problem?',
      answerHint: '2MSL wait after close; many short-lived client connections exhaust ephemeral ports.',
    },
  ],
  flashcards: [
    { front: 'TCP vs UDP', back: 'TCP: reliable stream; UDP: datagrams, no guarantee' },
    { front: '3-way handshake', back: 'SYN, SYN-ACK, ACK' },
    { front: 'Port purpose', back: 'Multiplex services on one IP address' },
  ],
  quickRevision: [
    'IP = routing, best effort',
    'TCP = reliable byte stream',
    'Port = process endpoint',
    'SYN SYN-ACK ACK',
    'UDP for DNS/QUIC base',
    'TIME_WAIT 2MSL',
    'HTTP over TCP (+ TLS)',
  ],
}

export const content = tcpIpContent
