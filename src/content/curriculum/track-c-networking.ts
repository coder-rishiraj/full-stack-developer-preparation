import type { Priority } from '@/domain/types'
import type { SectionSeed, TopicSeed } from './build'

const NETWORKING = ['networking', 'web'] as const
const M12 = [1, 2]
const M45 = [4, 5]

function item(
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  const { tags, executionPriority, ...rest } = extra
  return {
    id,
    title,
    priority,
    months: extra.months ?? (priority === 'tier1' ? M12 : M45),
    tags: [...NETWORKING, ...(tags ?? [])],
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

function section(id: string, title: string, order: number, topics: TopicSeed[]): SectionSeed {
  return {
    id,
    track: 'C',
    title,
    order,
    defaultKind: 'theory',
    defaultDepth: 'deep',
    topics,
  }
}

/** C4.1–C4.18 — networking fundamentals shaped for backend/full-stack interviews. */
export const TRACK_C_NETWORKING_SECTIONS: SectionSeed[] = [
  section('C4.1', 'Network Foundations & Models', 46, [
    item('c4-networking-basics', 'Computer Networking Fundamentals'),
    nest('c4-networking-basics', 'c4-network-purpose', 'Why Networks Exist'),
    nest('c4-networking-basics', 'c4-network-types', 'LAN, WAN, PAN & Internet'),
    nest('c4-networking-basics', 'c4-client-server-peer', 'Client–Server vs Peer-to-Peer'),
    nest('c4-networking-basics', 'c4-bandwidth-throughput-latency', 'Bandwidth, Throughput, Latency & Jitter'),
    item('c4-tcp-ip', 'TCP/IP Concepts'),
    nest('c4-tcp-ip', 'c4-osi-model', 'OSI Seven-Layer Model'),
    nest('c4-tcp-ip', 'c4-tcpip-model', 'TCP/IP Model'),
    nest('c4-tcp-ip', 'c4-osi-vs-tcpip', 'OSI vs TCP/IP'),
    nest('c4-tcp-ip', 'c4-encapsulation', 'Encapsulation: Data, Segment, Packet & Frame'),
  ]),

  section('C4.2', 'Devices, Media & Wireless', 47, [
    item('c4-network-devices', 'Network Devices', 'tier2'),
    nest('c4-network-devices', 'c4-nic', 'Network Interface Card & MAC Address', 'tier2'),
    nest('c4-network-devices', 'c4-hub-switch-router', 'Hub vs Switch vs Router', 'tier2'),
    nest('c4-network-devices', 'c4-modem-access-point', 'Modem, Gateway & Wireless Access Point', 'tier2'),
    nest('c4-network-devices', 'c4-physical-layer', 'Physical Layer & Signaling', 'tier3'),
    nest('c4-network-devices', 'c4-transmission-media', 'Copper, Fiber & Radio Media', 'tier3'),
    nest('c4-network-devices', 'c4-transmission-modes', 'Simplex, Half-Duplex & Full-Duplex', 'tier3'),
    item('c4-wireless-networks', 'Wireless Networks', 'tier3'),
    nest('c4-wireless-networks', 'c4-wifi-standards', 'Wi-Fi & IEEE 802.11', 'tier3'),
    nest('c4-wireless-networks', 'c4-bluetooth', 'Bluetooth & Short-Range Networking', 'tier3'),
    nest('c4-wireless-networks', 'c4-wireless-interference', 'Channels, Interference & Roaming', 'tier3'),
  ]),

  section('C4.3', 'Ethernet & Data Link Layer', 48, [
    item('c4-ethernet-data-link', 'Ethernet & Data Link Layer', 'tier2'),
    nest('c4-ethernet-data-link', 'c4-ethernet-frame', 'Ethernet Frame & MTU', 'tier2'),
    nest('c4-ethernet-data-link', 'c4-mac-addressing', 'MAC Addressing & Broadcast Domains', 'tier2'),
    nest('c4-ethernet-data-link', 'c4-layer2-switching', 'Layer-2 Switching & MAC Tables', 'tier2'),
    nest('c4-ethernet-data-link', 'c4-vlan', 'VLANs & 802.1Q Tags', 'tier2'),
    nest('c4-ethernet-data-link', 'c4-framing', 'Framing', 'tier3'),
    nest('c4-ethernet-data-link', 'c4-error-detection', 'CRC & Error Detection', 'tier3'),
    nest('c4-ethernet-data-link', 'c4-link-flow-control', 'Link-Layer Flow Control & ARQ', 'tier3'),
  ]),

  section('C4.4', 'IP Addressing & Subnetting', 49, [
    item('c4-ip-addressing', 'Internet Protocol & Addressing'),
    nest('c4-ip-addressing', 'c4-ipv4-address', 'IPv4 Address Structure'),
    nest('c4-ip-addressing', 'c4-ipv4-header', 'IPv4 Datagram Header', 'tier2'),
    nest('c4-ip-addressing', 'c4-cidr', 'CIDR & Subnet Masks'),
    nest('c4-ip-addressing', 'c4-subnetting', 'Network, Broadcast & Host Ranges'),
    nest('c4-ip-addressing', 'c4-vlsm-supernetting', 'VLSM & Supernetting', 'tier2'),
    nest('c4-ip-addressing', 'c4-private-public-ip', 'Private, Public, Loopback & Link-Local IPs'),
    nest('c4-ip-addressing', 'c4-ipv4-vs-ipv6', 'IPv4 vs IPv6'),
    nest('c4-ip-addressing', 'c4-ipv6-addressing', 'IPv6 Addressing & Neighbor Discovery', 'tier2'),
  ]),

  section('C4.5', 'Routing, NAT & Network Control', 50, [
    item('c4-routing-nat', 'Routing & Network Boundaries'),
    nest('c4-routing-nat', 'c4-default-gateway', 'Default Gateway & Routing Table'),
    nest('c4-routing-nat', 'c4-static-dynamic-routing', 'Static vs Dynamic Routing', 'tier2'),
    nest('c4-routing-nat', 'c4-distance-link-state', 'Distance-Vector vs Link-State Routing', 'tier2'),
    nest('c4-routing-nat', 'c4-ospf-bgp', 'OSPF & BGP Awareness', 'tier2'),
    nest('c4-routing-nat', 'c4-nat-pat', 'NAT, PAT & Port Exhaustion'),
    nest('c4-routing-nat', 'c4-arp-ndp', 'ARP vs IPv6 NDP'),
    nest('c4-routing-nat', 'c4-dhcp', 'DHCP Lease Lifecycle'),
    nest('c4-routing-nat', 'c4-icmp', 'ICMP, Errors & Reachability'),
  ]),

  section('C4.6', 'Transport Layer & Sockets', 51, [
    item('c4-transport-layer', 'Transport Layer'),
    nest('c4-transport-layer', 'c4-ports-sockets', 'Ports, Sockets & the Five-Tuple'),
    nest('c4-transport-layer', 'c4-tcp-vs-udp', 'TCP vs UDP'),
    nest('c4-transport-layer', 'c4-udp', 'UDP Datagrams, Loss & Ordering'),
    nest('c4-transport-layer', 'c4-socket-lifecycle', 'bind, listen, accept & connect'),
    nest('c4-transport-layer', 'c4-stream-vs-message', 'Byte Streams vs Message Boundaries'),
    nest('c4-transport-layer', 'c4-sctp-awareness', 'SCTP Awareness', 'tier3'),
    nest('c4-transport-layer', 'c4-quic-overview', 'QUIC Transport Overview', 'tier2'),
  ]),

  section('C4.7', 'TCP Reliability & Performance', 52, [
    item('c4-tcp', 'Transmission Control Protocol'),
    nest('c4-tcp', 'c4-tcp-handshake', 'TCP Three-Way Handshake'),
    nest('c4-tcp', 'c4-tcp-termination', 'FIN, RST & Connection Termination'),
    nest('c4-tcp', 'c4-sequence-ack', 'Sequence Numbers, ACKs & Retransmission'),
    nest('c4-tcp', 'c4-tcp-flow-control', 'Receive Window & Flow Control'),
    nest('c4-tcp', 'c4-tcp-congestion-control', 'Slow Start & Congestion Control'),
    nest('c4-tcp', 'c4-time-wait', 'TIME_WAIT & Ephemeral-Port Exhaustion'),
    nest('c4-tcp', 'c4-syn-accept-backlog', 'SYN Queue, Accept Queue & Backlog'),
    nest('c4-tcp', 'c4-nagle-delayed-ack', 'Nagle, Delayed ACK & TCP_NODELAY', 'tier2'),
    nest('c4-tcp', 'c4-mtu-mss-pmtud', 'MTU, MSS & Path MTU Discovery', 'tier2'),
  ]),

  section('C4.8', 'DNS & Service Discovery', 53, [
    item('c4-dns', 'Domain Name System', 'tier1', { related: ['c15-route53'] }),
    nest('c4-dns', 'c4-dns-hierarchy', 'Root, TLD & Authoritative Servers'),
    nest('c4-dns', 'c4-recursive-iterative-dns', 'Recursive vs Iterative Resolution'),
    nest('c4-dns', 'c4-dns-records', 'A, AAAA, CNAME, MX, TXT, NS & SRV'),
    nest('c4-dns', 'c4-dns-cache-ttl', 'Caching, TTL & Negative Answers'),
    nest('c4-dns', 'c4-dns-transport', 'UDP, TCP, DoT, DoH & DoQ', 'tier2'),
    nest('c4-dns', 'c4-dnssec', 'DNSSEC & Cache-Poisoning Defense', 'tier2'),
    nest('c4-dns', 'c4-svcb-https-records', 'SVCB & HTTPS Records', 'tier2'),
    nest('c4-dns', 'c4-service-discovery', 'Service Discovery & Split-Horizon DNS'),
    nest('c4-dns', 'c4-dns-failure', 'DNS Failure, Stale Cache & Failover'),
  ]),

  section('C4.9', 'TLS & HTTPS', 54, [
    item('c4-tls', 'Transport Layer Security'),
    nest('c4-tls', 'c4-https', 'HTTPS'),
    nest('c4-tls', 'c4-tls13-handshake', 'TLS 1.3 Handshake'),
    nest('c4-tls', 'c4-certificates-pki', 'Certificates, PKI & Chain Validation'),
    nest('c4-tls', 'c4-sni-alpn', 'SNI & ALPN'),
    nest('c4-tls', 'c4-forward-secrecy', 'Forward Secrecy & AEAD'),
    nest('c4-tls', 'c4-tls-resumption', 'Session Resumption & Replay-Safe 0-RTT', 'tier2'),
    nest('c4-tls', 'c4-mtls', 'Mutual TLS'),
    nest('c4-tls', 'c4-tls-termination', 'TLS Termination & Re-Encryption'),
    nest('c4-tls', 'c4-cert-operations', 'Certificate Rotation, Revocation & OCSP Stapling', 'tier2'),
  ]),

  section('C4.10', 'HTTP Semantics', 55, [
    item('c4-http', 'HTTP'),
    nest('c4-http', 'c4-http-message', 'Request & Response Message Structure'),
    nest('c4-http', 'c4-http-methods', 'HTTP Methods'),
    nest('c4-http', 'c4-method-properties', 'Safe, Idempotent & Cacheable Methods'),
    nest('c4-http', 'c4-headers', 'HTTP Headers'),
    nest('c4-http', 'c4-status-codes', 'HTTP Status Codes'),
    nest('c4-http', 'c4-uri-url-origin', 'URI, URL, Authority & Origin'),
    nest('c4-http', 'c4-content-types-mime', 'Media Types, MIME & Content-Type'),
    nest('c4-http', 'c4-content-negotiation', 'Content Negotiation'),
    nest('c4-http', 'c4-http-retries', 'Retries, Idempotency Keys & Duplicate Effects'),
  ]),

  section('C4.11', 'HTTP Connections, Caching & Delivery', 56, [
    item('c4-keep-alive', 'Connection Reuse & Keep-Alive'),
    nest('c4-keep-alive', 'c4-connection-pooling', 'Connection Pooling'),
    nest('c4-keep-alive', 'c4-http1-pipelining', 'HTTP/1.1 Pipelining & Head-of-Line Blocking', 'tier2'),
    nest('c4-keep-alive', 'c4-content-length-chunked', 'Content-Length, Chunked Transfer & Trailers'),
    nest('c4-keep-alive', 'c4-streaming-range', 'Streaming & Range Requests'),
    item('c4-http-caching', 'HTTP Caching'),
    nest('c4-http-caching', 'c4-cache-control', 'Cache-Control Directives'),
    nest('c4-http-caching', 'c4-etag-last-modified', 'ETag, Last-Modified & Conditional Requests'),
    nest('c4-http-caching', 'c4-cache-privacy', 'Public, Private, no-cache & no-store'),
    nest('c4-http-caching', 'c4-vary', 'Vary & Cache-Key Correctness'),
    nest('c4-http-caching', 'c4-compression', 'gzip, Brotli & Compression Trade-Offs'),
  ]),

  section('C4.12', 'HTTP/2, HTTP/3 & QUIC', 57, [
    item('c4-http2', 'HTTP/2', 'tier2'),
    nest('c4-http2', 'c4-http2-frames-streams', 'Binary Frames & Streams', 'tier2'),
    nest('c4-http2', 'c4-http2-multiplexing', 'Multiplexing & TCP Head-of-Line Blocking', 'tier2'),
    nest('c4-http2', 'c4-hpack', 'HPACK Header Compression', 'tier2'),
    nest('c4-http2', 'c4-http2-flow-control', 'Stream & Connection Flow Control', 'tier2'),
    nest('c4-http2', 'c4-http2-priorities-push', 'Priorities & Why Server Push Declined', 'tier2'),
    item('c4-http3', 'HTTP/3', 'tier2'),
    nest('c4-http3', 'c4-quic-streams', 'QUIC Streams & Loss Isolation', 'tier2'),
    nest('c4-http3', 'c4-qpack', 'QPACK Header Compression', 'tier2'),
    nest('c4-http3', 'c4-quic-connection-migration', 'Connection IDs & Migration', 'tier2'),
    nest('c4-http3', 'c4-h3-discovery-fallback', 'Alt-Svc, HTTPS Records, ALPN & Fallback', 'tier2'),
  ]),

  section('C4.13', 'Cookies, Sessions & Browser Boundaries', 58, [
    item('c4-cookies', 'Cookies', 'tier1', { related: ['b3-cookies'] }),
    nest('c4-cookies', 'c4-cookie-attributes', 'Domain, Path, Expires & Max-Age'),
    nest('c4-cookies', 'c4-secure-httponly-samesite', 'Secure, HttpOnly & SameSite'),
    nest('c4-cookies', 'c4-cookie-scope-prefixes', 'Cookie Scope, __Host- & __Secure- Prefixes', 'tier2'),
    item('c4-sessions', 'Sessions', 'tier1', { related: ['c9-sessions'] }),
    nest('c4-sessions', 'c4-session-id-store', 'Session IDs & Server-Side Stores'),
    nest('c4-sessions', 'c4-sticky-vs-shared-session', 'Sticky vs Shared Sessions'),
    nest('c4-sessions', 'c4-session-fixation', 'Session Rotation & Fixation Defense'),
    item('c4-cors', 'CORS', 'tier1', { related: ['b3-cors', 'c9-cors-security'] }),
    nest('c4-cors', 'c4-same-origin-policy', 'Same-Origin Policy'),
    nest('c4-cors', 'c4-cors-simple-preflight', 'Simple Requests & Preflight'),
    nest('c4-cors', 'c4-cors-credentials', 'Credentials, Origins & Cache Variation'),
  ]),

  section('C4.14', 'Proxies, Load Balancers & CDN', 59, [
    item('c4-reverse-proxies', 'Reverse Proxies'),
    nest('c4-reverse-proxies', 'c4-forward-vs-reverse-proxy', 'Forward vs Reverse Proxy'),
    nest('c4-reverse-proxies', 'c4-proxy-forwarded-headers', 'Forwarded & X-Forwarded-* Headers'),
    nest('c4-reverse-proxies', 'c4-proxy-buffering-timeouts', 'Buffering, Timeouts & Request Limits'),
    nest('c4-reverse-proxies', 'c4-api-gateway', 'API Gateway'),
    nest('c4-reverse-proxies', 'c4-gateway-policies', 'Gateway Authentication, Rate Limits & Routing'),
    item('c4-load-balancers', 'Load Balancers', 'tier1', { related: ['d4-load-balancing', 'c15-load-balancers'] }),
    nest('c4-load-balancers', 'c4-l4-vs-l7-lb', 'Layer 4 vs Layer 7 Load Balancing'),
    nest('c4-load-balancers', 'c4-lb-algorithms', 'Round Robin, Least Connections & Hashing'),
    nest('c4-load-balancers', 'c4-health-readiness-draining', 'Health Checks, Readiness & Connection Draining'),
    nest('c4-load-balancers', 'c4-sticky-sessions', 'Session Affinity & Long-Lived Connections'),
    item('c4-cdn', 'Content Delivery Networks', 'tier1', { related: ['d5-cdn', 'c15-cloudfront'] }),
    nest('c4-cdn', 'c4-edge-cache', 'Edge Caching & Origin Shield'),
    nest('c4-cdn', 'c4-cache-invalidation', 'Invalidation, Purge & Versioned Assets'),
    nest('c4-cdn', 'c4-anycast-geo-routing', 'Anycast & Geo-Routing', 'tier2'),
  ]),

  section('C4.15', 'API & Realtime Protocols', 60, [
    item('c4-rest', 'REST', 'tier1', { tags: ['api'], related: ['d6-rest'] }),
    nest('c4-rest', 'c4-rest-resources', 'Resources, Representations & Uniform Interface'),
    nest('c4-rest', 'c4-rest-pagination-errors', 'Pagination, Errors & Versioning'),
    nest('c4-rest', 'c4-json', 'JSON'),
    nest('c4-rest', 'c4-rpc', 'RPC vs REST'),
    nest('c4-rest', 'c4-openapi', 'OpenAPI & Swagger Contracts'),
    nest('c4-rest', 'c4-problem-details', 'Problem Details Error Responses'),
    nest('c4-rest', 'c4-graphql-over-http', 'GraphQL over HTTP', 'tier2'),
    item('c4-grpc', 'gRPC', 'tier2', { tags: ['api'], related: ['d6-grpc'] }),
    nest('c4-grpc', 'c4-protobuf', 'Protocol Buffers & Schema Evolution', 'tier2'),
    nest('c4-grpc', 'c4-grpc-streaming', 'Unary, Client, Server & Bidirectional Streaming', 'tier2'),
    nest('c4-grpc', 'c4-grpc-deadlines', 'Deadlines, Cancellation & Status Codes', 'tier2'),
    item('c4-realtime-protocols', 'Realtime Web Protocols'),
    nest('c4-realtime-protocols', 'c4-websocket', 'WebSocket Handshake, Frames & Heartbeats'),
    nest('c4-realtime-protocols', 'c4-sse', 'Server-Sent Events'),
    nest('c4-realtime-protocols', 'c4-long-polling', 'Long Polling'),
    nest('c4-realtime-protocols', 'c4-webhooks', 'Webhooks, Signatures & Retries'),
    nest('c4-realtime-protocols', 'c4-webtransport', 'WebTransport', 'tier3'),
  ]),

  section('C4.16', 'Network Security Fundamentals', 61, [
    item('c4-network-security', 'Network Security Fundamentals'),
    nest('c4-network-security', 'c4-authentication-authorization', 'Authentication vs Authorization'),
    nest('c4-network-security', 'c4-encryption-transit', 'Encryption in Transit'),
    nest('c4-network-security', 'c4-firewalls', 'Firewalls & Stateful Filtering'),
    nest('c4-network-security', 'c4-network-segmentation', 'Segmentation, DMZ & Zero Trust'),
    nest('c4-network-security', 'c4-vpn-tunnels', 'VPN, Tunnels & IPsec', 'tier2'),
    nest('c4-network-security', 'c4-ids-ips', 'IDS & IPS', 'tier2'),
    nest('c4-network-security', 'c4-ddos-syn-flood', 'DDoS, SYN Floods & Rate Limiting'),
    nest('c4-network-security', 'c4-mac-filtering', 'MAC Filtering Limitations', 'tier3'),
  ]),

  section('C4.17', 'Cloud & Container Networking', 62, [
    item('c4-cloud-networking', 'Cloud Networking', 'tier2', { related: ['c15-vpc'] }),
    nest('c4-cloud-networking', 'c4-vpc-subnets', 'VPCs & Public/Private Subnets', 'tier2'),
    nest('c4-cloud-networking', 'c4-internet-nat-gateway', 'Internet Gateway vs NAT Gateway', 'tier2'),
    nest('c4-cloud-networking', 'c4-security-groups-nacl', 'Security Groups vs Network ACLs', 'tier2'),
    nest('c4-cloud-networking', 'c4-cloud-dns-discovery', 'Cloud DNS & Service Discovery', 'tier2'),
    nest('c4-cloud-networking', 'c4-container-networking', 'Container Ports, Bridges & Overlay Networks', 'tier2'),
    nest('c4-cloud-networking', 'c4-kubernetes-networking', 'Kubernetes Pod, Service & Ingress Networking', 'tier2'),
    nest('c4-cloud-networking', 'c4-service-mesh', 'Service Mesh & Sidecar Proxies', 'tier2'),
  ]),

  section('C4.18', 'Performance & Troubleshooting', 63, [
    item('c4-network-troubleshooting', 'Network Troubleshooting'),
    nest('c4-network-troubleshooting', 'c4-url-request-lifecycle', 'What Happens When You Enter a URL?'),
    nest('c4-network-troubleshooting', 'c4-ping-traceroute', 'ping, ICMP & traceroute'),
    nest('c4-network-troubleshooting', 'c4-dig-nslookup', 'dig, nslookup & DNS Diagnosis'),
    nest('c4-network-troubleshooting', 'c4-curl-openssl', 'curl & openssl s_client'),
    nest('c4-network-troubleshooting', 'c4-ss-lsof', 'ss, netstat & lsof'),
    nest('c4-network-troubleshooting', 'c4-tcpdump-wireshark', 'tcpdump & Wireshark', 'tier2'),
    nest('c4-network-troubleshooting', 'c4-layered-debugging', 'Layered Connectivity Diagnosis'),
    item('c4-network-performance', 'Network Performance'),
    nest('c4-network-performance', 'c4-latency-budget-rtt', 'RTT & End-to-End Latency Budgets'),
    nest('c4-network-performance', 'c4-packet-loss-retransmission', 'Packet Loss, Retransmission & Tail Latency'),
    nest('c4-network-performance', 'c4-timeouts-retries-jitter', 'Timeouts, Retries, Backoff & Jitter'),
    nest('c4-network-performance', 'c4-bandwidth-delay-product', 'Bandwidth–Delay Product', 'tier2'),
    nest('c4-network-performance', 'c4-qos-traffic-shaping', 'QoS, Token Bucket & Leaky Bucket', 'tier2'),
    nest('c4-network-performance', 'c4-connection-budget', 'DNS, Connect, TLS, TTFB & Download Timing'),
  ]),

  section('C4.19', 'Java Networking APIs', 64, [
    item('c4-java-networking-apis', 'Java Networking APIs'),
    nest('c4-java-networking-apis', 'c4-java-uri-url', 'URI, URL & InetAddress'),
    nest('c4-java-networking-apis', 'c4-java-httpclient', 'Java 11+ HttpClient'),
    nest('c4-java-networking-apis', 'c4-httpclient-timeouts', 'Connect, Request & Read Timeouts'),
    nest('c4-java-networking-apis', 'c4-httpclient-async', 'sendAsync & CompletableFuture'),
    nest('c4-java-networking-apis', 'c4-httpclient-pooling', 'Connection Reuse, HTTP/2 & Pooling'),
    nest('c4-java-networking-apis', 'c4-spring-http-clients', 'RestClient, WebClient & HTTP Interfaces'),
    nest('c4-java-networking-apis', 'c4-server-socket-nio', 'ServerSocket, Channels & Selectors', 'tier2'),
    nest('c4-java-networking-apis', 'c4-netty', 'Netty Event Loop & Channels', 'tier2'),
  ]),
]
