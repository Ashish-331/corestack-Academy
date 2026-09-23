/**
 * Authored lesson material for the Computer Networks course, keyed by lesson id.
 * Same shape as `dsa-content.ts`; nothing here falls back to the placeholder
 * generator.
 */
import type { AuthoredLesson } from "./dsa-content";

export const cnContent: Record<string, AuthoredLesson> = {
  "cn-1-l0": {
    html: `<p class="lead">Two layering models describe the same network. OSI has seven named layers and is the vocabulary people use in conversation; TCP/IP has four (sometimes five) and is what actually ships packets.</p>

<h2 id="osi">OSI — the vocabulary</h2>
<table>
  <thead><tr><th>#</th><th>Layer</th><th>Unit</th><th>What it decides</th><th>Examples</th></tr></thead>
  <tbody>
    <tr><td>7</td><td>Application</td><td>data</td><td>What the message means</td><td>HTTP, DNS, SMTP</td></tr>
    <tr><td>6</td><td>Presentation</td><td>data</td><td>Encoding, compression, TLS record crypto</td><td>TLS, JPEG</td></tr>
    <tr><td>5</td><td>Session</td><td>data</td><td>Dialogs, checkpoints, recovery</td><td>RPC sessions</td></tr>
    <tr><td>4</td><td>Transport</td><td>segment</td><td>Which process, reliability, ordering</td><td>TCP, UDP, QUIC</td></tr>
    <tr><td>3</td><td>Network</td><td>packet</td><td>Which host, best path</td><td>IP, ICMP, BGP</td></tr>
    <tr><td>2</td><td>Data link</td><td>frame</td><td>Which NIC on this link, error detect</td><td>Ethernet, Wi-Fi, ARP</td></tr>
    <tr><td>1</td><td>Physical</td><td>bits</td><td>Voltages, photons, radio</td><td>1000BASE-T, 802.11ax</td></tr>
  </tbody>
</table>

<h2 id="tcpip">TCP/IP — the implementation</h2>
<p>Layers 5–6–7 collapse into the application layer (TLS sits inside it in practice), and layers 1–2 become "the link". What remains: <strong>link → internet → transport → application</strong>. Every real packet you will ever inspect carries exactly these four header groups.</p>

<h2 id="why">Why layering at all?</h2>
<ul>
  <li><strong>Substitutability</strong> — swap Ethernet for Wi-Fi and TCP never notices.</li>
  <li><strong>Testability</strong> — each layer has an independent failure mode and tool (ping for L3, <code>ss</code> for L4, curl for L7).</li>
  <li><strong>Cost</strong> — each layer adds a header, and every header costs bytes and CPU.</li>
</ul>

<div class="callout"><strong>Interview favourite —</strong> "Which layer does TLS live on?" Honestly: between 4 and 5 — it is a session/presentation service implemented above TCP. Saying "layer 6" is the textbook answer; explaining the ambiguity is the senior one.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>OSI is a reference model; TCP/IP is the deployed reality.</li>
  <li>Encapsulation means every layer's payload is the layer above's complete message.</li>
  <li>Each layer solves one problem: links, host-to-host, process-to-process, application semantics.</li>
</ol>`,
  },
  "cn-1-l1": {
    html: `<p class="lead">Every layer wraps the one above in its own header. By the time an HTTP response reaches the wire it has four headers, a maximum size, and a CRC.</p>

<h2 id="stack">The nesting</h2>
<pre><code>HTTP response
  [ TCP | seq, ack, ports, window
      [ IP | src, dst, ttl, proto
          [ Ethernet | mac_dst, mac_src, type, CRC ] ] ]</code></pre>
<p>On receive, each layer strips its own header and hands the payload up — the inverse operation. MTU refers to the largest frame payload a link can carry (1500 bytes on classic Ethernet, ~1450–1460 on PPPoE, 9000 with jumbo frames).</p>

<h2 id="mtu">Fragmentation and why everyone avoids it</h2>
<p>An IP packet larger than the MTU is fragmented. Fragments are reassembled only at the final destination, and losing one fragment discards the whole packet — which is catastrophic for TCP, because one lost fragment causes retransmission of the entire segment. Hence:</p>
<ul>
  <li><strong>TCP MSS</strong> is negotiated in the SYN (typically 1460 = 1500 − 20 IP − 20 TCP).</li>
  <li><strong>PMTUD</strong> discovers the path MTU using ICMP "fragmentation needed" messages. Firewalls that block ICMP break it and produce the infamous "black hole" hang.</li>
  <li><strong>QUIC</strong> sets its datagram size conservatively (~1252 bytes) precisely to avoid fragmentation.</li>
</ul>

<h2 id="ethernet">Ethernet framing</h2>
<p>Preamble + SFD, then dst MAC (6), src MAC (6), EtherType (2), payload (46–1500), then a 32-bit CRC. The minimum payload of 46 bytes is why tiny packets still occupy 64 bytes of wire time.</p>

<div class="callout"><strong>Common pitfall —</strong> confusing MTU with MSS. MTU is a link-layer limit including IP headers; MSS is a TCP option about payload only. <code>MSS = MTU − 40</code> for IPv4.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Encapsulation is header-per-layer; decapsulation is the reverse on receive.</li>
  <li>MTU mismatch causes fragmentation, and fragmentation amplifies loss.</li>
  <li>MSS clamping and PMTUD are the practical fixes.</li>
</ol>`,
  },
  "cn-2-l0": {
    html: `<p class="lead">IP addresses get a packet to a network; MAC addresses get a frame across one link. ARP is the glue that translates between them.</p>

<h2 id="mac">MAC addresses and switching</h2>
<p>A MAC address is 48 bits, usually burned into the NIC; the first half identifies the vendor (OUI). Switches learn by inspection: when a frame arrives on port 3 from MAC X, they record <code>X → port 3</code> in the CAM table. Unknown destinations flood to all ports; broadcast always floods within the VLAN.</p>
<ul>
  <li><strong>Collision domain</strong> — full duplex switched Ethernet has none per port.</li>
  <li><strong>Broadcast domain</strong> — one VLAN; a router is the boundary.</li>
  <li><strong>Loops</strong> — bridging loops melt networks, so STP (802.1D) elects a root and blocks redundant links.</li>
</ul>

<h2 id="arp">ARP in four packets</h2>
<pre><code>1. Who has 192.168.1.20? tell 192.168.1.5      (link-layer broadcast, ff:ff:ff:ff:ff:ff)
2. 192.168.1.20 is at aa:bb:cc:dd:ee:01        (unicast reply, cached by everyone who saw it)
3. unicast frame to aa:bb:cc:dd:ee:01
4. cache entry expires in ~60s..24h depending on OS</code></pre>
<p>Crossing a router changes the frame: the source/destination MAC are rewritten hop by hop while the source/destination IP stay end-to-end (minus NAT). That single observation explains most "why can't I reach it" debugging.</p>

<h2 id="attacks">Security notes</h2>
<ul>
  <li><strong>ARP spoofing</strong> — gratuitous replies poison caches; mitigated by Dynamic ARP Inspection and static entries for gateways.</li>
  <li><strong>DHCP snooping</strong> and <strong>802.1X</strong> limit who may speak on a port at all.</li>
</ul>

<div class="callout"><strong>Interview favourite —</strong> "Does ARP cross a router?" No. ARP is link-local broadcast; to reach a remote subnet a host ARPs for its <em>gateway</em> instead.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>MACs are per-link; IPs are end-to-end.</li>
  <li>Switches learn MAC→port; routers route IP prefixes.</li>
  <li>ARP resolves the next hop's MAC and never leaves the segment.</li>
</ol>`,
  },
  "cn-2-l1": {
    html: `<p class="lead">Subnetting is arithmetic you must do without a calculator. Everything reduces to one question: how many host bits are left?</p>

<h2 id="cider">CIDR notation</h2>
<table>
  <thead><tr><th>Prefix</th><th>Mask</th><th>Addresses</th><th>Usable hosts</th></tr></thead>
  <tbody>
    <tr><td>/24</td><td>255.255.255.0</td><td>256</td><td>254</td></tr>
    <tr><td>/25</td><td>255.255.255.128</td><td>128</td><td>126</td></tr>
    <tr><td>/26</td><td>255.255.255.192</td><td>64</td><td>62</td></tr>
    <tr><td>/28</td><td>255.255.255.240</td><td>16</td><td>14</td></tr>
    <tr><td>/30</td><td>255.255.255.252</td><td>4</td><td>2 (classic point-to-point)</td></tr>
    <tr><td>/31</td><td>255.255.255.254</td><td>2</td><td>2 (RFC 3021 p2p)</td></tr>
    <tr><td>/32</td><td>255.255.255.255</td><td>1</td><td>host route</td></tr>
  </tbody>
</table>

<h2 id="method">The 60-second method</h2>
<ol>
  <li><strong>Block size</strong> = 2^(32 − prefix). For /26 that is 64.</li>
  <li><strong>Network address</strong> = the largest multiple of the block size ≤ the IP's relevant octet.</li>
  <li><strong>Broadcast</strong> = network + block size − 1.</li>
  <li><strong>Range</strong> = network + 1 … broadcast − 1.</li>
</ol>
<pre><code>Q: which subnet does 10.34.19.221/26 belong to?
block   = 256 - 192 = 64
multiples of 64 in the 4th octet: 0, 64, 128, 192
221 falls in 192..255  =>  network 10.34.19.192/26
broadcast = 10.34.19.255, hosts = .193 - .254 (62 usable)</code></pre>

<h2 id="private">Private ranges and VPC thinking</h2>
<ul>
  <li><code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, <code>192.168.0.0/16</code> are private (RFC 1918).</li>
  <li>Cloud VPCs reserve a few addresses per subnet (AWS five: network, VPC router, DNS, future, broadcast) — so /28 gives 11 usable, not 16.</li>
  <li>Plan room to grow: carving a /26 today means renumbering later; routing is prefix-based, so align your boundaries with failure domains.</li>
</ul>

<div class="callout"><strong>Common pitfall —</strong> "256 usable addresses in a /24". Two are reserved (network and broadcast), and on a router interface the gateway also consumes one. Quote usable counts, not raw counts.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Prefix = how many bits identify the network; the rest identify hosts.</li>
  <li>Block size arithmetic solves every subnet question in one line.</li>
  <li>Design for future splits — routing and firewalls both care about alignment.</li>
</ol>`,
    quizzes: [
      {
        q: "How many usable host addresses exist in 192.168.4.0/29?",
        options: ["8", "6", "5", "16"],
        answer: 1,
        explain: "/29 leaves 3 host bits = 8 addresses; minus network and broadcast = 6 usable.",
      },
    ],
  },
  "cn-2-l2": {
    html: `<p class="lead">Routing algorithms differ by what they advertise to whom. Distance vector shares a routing table with neighbours; link state floods the whole topology; path vector shares the full AS path.</p>

<h2 id="rip">RIP — distance vector</h2>
<ul>
  <li>Hop count metric, max 15 hops (16 = infinity).</li>
  <li>Periodic full-table broadcasts every 30 s; slow convergence.</li>
  <li><strong>Count-to-infinity</strong> fixed with split horizon (don't advertise a route back out the interface you learned it on), poison reverse, and hold-down timers.</li>
</ul>

<h2 id="ospf">OSPF — link state</h2>
<ul>
  <li>Each router floods Link State Advertisements; every router builds the identical topology map and runs Dijkstra locally.</li>
  <li>Cost is bandwidth-derived, so it picks genuinely better paths.</li>
  <li>Areas reduce flooding and table size; area 0 is the backbone that everything transits.</li>
  <li>Fast, loop-free convergence — the enterprise IGP of choice (IS-IS is its ISP cousin).</li>
</ul>

<h2 id="bgp">BGP — path vector</h2>
<p>BGP is the routing protocol of the internet and it is a <em>policy</em> protocol, not a shortest-path one. It exchanges AS_PATH, NEXT_HOP and local-pref / MED attributes over TCP port 179, and prefers routes by: highest local-pref → shortest AS path → lowest origin → lowest MED → eBGP over iBGP → lowest router id.</p>
<pre><code>router bgp 65001
  neighbor 203.0.113.9 remote-as 64512
  network 198.51.100.0 mask 255.255.255.0
  ! outbound policy
  neighbor 203.0.113.9 route-map PREF-OUT out</code></pre>
<p>Because decisions are policy-driven, a misconfiguration can withdraw a prefix and black-hole it globally — exactly what happened in well-documented outages at Facebook (2021) and Cloudflare (2019).</p>

<table>
  <thead><tr><th></th><th>RIP</th><th>OSPF</th><th>BGP</th></tr></thead>
  <tbody>
    <tr><td>Algorithm</td><td>distance vector</td><td>link state</td><td>path vector</td></tr>
    <tr><td>Metric</td><td>hops</td><td>cost</td><td>policy attributes</td></tr>
    <tr><td>Scope</td><td>tiny LANs</td><td>one org / IGP</td><td>between orgs / EGP</td></tr>
    <tr><td>Transport</td><td>UDP 520</td><td>IP proto 89</td><td>TCP 179</td></tr>
  </tbody>
</table>

<div class="callout"><strong>Interview favourite —</strong> "Why does the internet not use OSPF?" Scale and trust. OSPF assumes cooperative routers in one admin domain; BGP assumes independent ones with conflicting interests.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>IGPs optimise paths inside a trust domain; BGP negotiates between them.</li>
  <li>Link state = global map + local Dijkstra; distance vector = neighbour gossip.</li>
  <li>BGP's real job is expressing business policy, which is why it is fragile.</li>
</ol>`,
  },
  "cn-2-l3": {
    html: `<p class="lead">IPv4 ran out in 2019. NAT is the reason the internet still works, and DHCP is the reason nobody configures addresses by hand.</p>

<h2 id="nat">How NAT works</h2>
<p>A NAT box rewrites the source IP and port of outbound packets, remembering the mapping so replies can be translated back. Overloading (PAT/NAPT) multiplexes thousands of private hosts over one public IP using the 16-bit port space.</p>
<pre><code>inside  192.168.1.7:51322  ->  outside 203.0.113.4:40001  ->  93.184.216.34:443
return  93.184.216.34:443  ->  203.0.113.4:40001       ->  192.168.1.7:51322</code></pre>
<p>Consequences you will be asked about:</p>
<ul>
  <li><strong>Inbound is impossible by default</strong> — hence port forwarding, UPnP, and hole punching.</li>
  <li><strong>Breaks end-to-end transparency</strong> — FTP's embedded addresses, SIP, and P2P all need helpers (ALGs, STUN/TURN).</li>
  <li><strong>State exhaustion</strong> — a CGNAT box has a finite NAT table; SYN floods or too many concurrent flows fill it.</li>
  <li><strong>Hides the origin</strong> — good for privacy, terrible for logging attribution.</li>
</ul>

<h2 id="dhcp">DHCP in four steps</h2>
<pre><code>DISCOVER (client, broadcast 255.255.255.255, 0.0.0.0)
OFFER    (server: proposed ip, lease, options)
REQUEST  (client: "I accept that offer")
ACK      (server: confirmed, with subnet, router, dns, lease time)</code></pre>
<p>At 50% of the lease the client renews (unicast REQUEST); at 87.5% it will try any server. Options 3 (router), 6 (DNS), 15 (domain), 42 (NTP), 66/67 (PXE) are the ones you actually meet.</p>

<h2 id="ipv6">IPv6 essentials</h2>
<ul>
  <li><strong>128-bit</strong> addresses in eight hex groups; <code>2001:db8::/32</code> is documentation space, <code>::1</code> loopback, <code>fe80::/10</code> link-local.</li>
  <li>No broadcast — multicast and anycast instead. No ARP — NDP over ICMPv6.</li>
  <li>No NAT required: every device can be globally addressable, with firewall policy providing the protection.</li>
  <li>Transition: dual stack, tunnels (6in4, DS-Lite), translation (NAT64/DNS64).</li>
</ul>

<div class="callout"><strong>Common pitfall —</strong> "NAT is a security feature." It blocks unsolicited inbound as a side effect, but a stateful firewall does that properly and without breaking end-to-end connectivity.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>NAT is a stateful address+port rewrite; state table size is a real capacity limit.</li>
  <li>DHCP DORA is broadcast-driven and lease-based.</li>
  <li>IPv6 restores end-to-end addressing and replaces ARP with NDP.</li>
</ol>`,
  },
  "cn-3-l0": {
    html: `<p class="lead">UDP is IP plus ports and a checksum. That is the whole feature list — and the reason everything latency-sensitive is built on it.</p>

<h2 id="headers">Headers</h2>
<table>
  <thead><tr><th>TCP (20+ bytes)</th><th>UDP (8 bytes)</th></tr></thead>
  <tbody>
    <tr><td>src port, dst port</td><td>src port, dst port</td></tr>
    <tr><td>sequence, ack</td><td>length, checksum</td></tr>
    <tr><td>flags, window, options</td><td colspan="2">—</td></tr>
  </tbody>
</table>
<p>UDP gives you multiplexing and integrity checking. No handshake, no ordering, no retransmission, no congestion control, no flow control.</p>

<h2 id="when">When each wins</h2>
<ul>
  <li><strong>UDP</strong> — DNS (one query, one reply: a handshake would triple latency), DHCP, RTP video/voice, gaming state, NTP, telemetry, and QUIC/HTTP3 which rebuilds reliability above it.</li>
  <li><strong>TCP</strong> — anything where a missing byte is unacceptable: HTTP/1.1 and /2, SSH, mail, databases, file transfer.</li>
</ul>

<h2 id="udp pitfalls">Reliability patterns over UDP</h2>
<p>Applications add back what they need, selectively: sequence numbers for loss detection, application-level ACKs for critical messages, FEC for streams where retransmission is too late, and rate limiting to be a good citizen.</p>
<pre><code>// a UDP server is ~10 lines; note there is no connection state
const s = dgram.createSocket("udp4");
s.on("message", (msg, rinfo) =&gt; s.send(Buffer.from(msg), rinfo.port, rinfo.address));
s.bind(53);</code></pre>

<div class="callout"><strong>Interview favourite —</strong> "Is UDP unreliable?" It is <em>unreliable by design</em>: it makes no promises, so you can build exactly the reliability profile you need instead of accepting TCP's.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>UDP header = 8 bytes; no connection, no state, no guarantees.</li>
  <li>Choose UDP when timeliness beats completeness.</li>
  <li>QUIC chose UDP because middleboxes reliably pass it and the OS lets userland evolve the protocol.</li>
</ol>`,
  },
  "cn-3-l1": {
    html: `<p class="lead">Three packets create a connection and four tear it down. The state machine around them explains almost every weird TCP error message you have seen.</p>

<h2 id="establish">Connection establishment</h2>
<pre><code>client                         server
  --- SYN, seq=x  ----------&gt;          LISTEN -&gt; SYN_RCVD
  &lt;-- SYN+ACK, seq=y, ack=x+1 --
  --- ACK, ack=y+1  ---------&gt;         SYN_RCVD -&gt; ESTABLISHED</code></pre>
<p>Why three and not two? The final ACK confirms that <em>both</em> sides have heard each other's initial sequence number — otherwise an old duplicate SYN could create a phantom connection.</p>
<p>The SYN queue is vulnerable to <strong>SYN floods</strong>; defences are SYN cookies (encode state in the sequence number, allocate nothing until the ACK), backlog tuning and SYN proxying at the edge.</p>

<h2 id="teardown">Teardown and the states that confuse people</h2>
<pre><code>FIN -&gt;  FIN_WAIT_1  -&gt;  &lt;- ACK        (peer: CLOSE_WAIT)
&lt;- FIN    FIN_WAIT_2  -&gt;  ACK -&gt;  TIME_WAIT</code></pre>
<ul>
  <li><strong>TIME_WAIT</strong> lasts 2×MSL (1–4 minutes) so a duplicate final ACK can be re-sent and old segments die out. Exhaustion shows up as "cannot assign requested address"; fix with port ranges, <code>tcp_tw_reuse</code>, or persistent connections.</li>
  <li><strong>CLOSE_WAIT</strong> pile-up on the server means the application never called <code>close()</code> — a file-descriptor leak, not a network problem.</li>
  <li><strong>RST</strong> skips the dance entirely: port closed, or an abort. Idle keepalive timeouts also surface as RSTs from NAT devices.</li>
</ul>

<h2 id="options">Options worth knowing</h2>
<ul>
  <li><strong>MSS</strong> — avoids fragmentation.</li>
  <li><strong>Window scale</strong> — multiplies the 16-bit window up to 1 GB for long fat networks.</li>
  <li><strong>SACK</strong> — tells the sender exactly which ranges arrived, so one loss does not rewind everything.</li>
  <li><strong>Timestamps</strong> — RTT measurement and PAWS protection against wrapped sequence numbers.</li>
</ul>

<div class="callout"><strong>Interview favourite —</strong> "Why does TIME_WAIT exist on the <em>active closer</em>?" Because the active closer sent the final ACK and must be able to retransmit it if it was lost.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Three-way handshake synchronises sequence numbers in both directions.</li>
  <li>TIME_WAIT is a feature; treat mass exhaustion as a capacity smell.</li>
  <li>Window scale + SACK are what make TCP usable on modern networks.</li>
</ol>`,
  },
  "cn-3-l2": {
    html: `<p class="lead">Flow control protects the <em>receiver</em>. Congestion control protects the <em>network</em>. They are different problems and TCP solves both with separate windows.</p>

<h2 id="sliding">Sliding window mechanics</h2>
<p>The receiver advertises a window (<code>rwnd</code>) in every ACK: how many bytes past the last acknowledged byte it is willing to accept. The sender may have that many bytes unacknowledged at once — that is the whole pipe in flight.</p>
<pre><code>bytes:   1 ....... 1000  |  1001 ......... 3000  |  3001 ....
         acked           |  in flight (&lt;= rwnd)  |  cannot send yet</code></pre>
<p>Effective throughput is bounded by <strong>window ÷ RTT</strong>. A 64 KB window over a 100 ms path caps you at ~5 Mbps no matter how fat the link is — this is why window scaling exists.</p>

<h2 id="zerowindow">Zero window and silly window syndrome</h2>
<ul>
  <li><strong>Zero-window probes</strong> — when the receiver advertises 0, the sender keeps probing with 1-byte segments until space frees up.</li>
  <li><strong>Nagle's algorithm</strong> — coalesce small writes until the previous segment is ACKed. Great for telnet, terrible for interactive protocols; disable with <code>TCP_NODELAY</code>.</li>
  <li><strong>Delayed ACK</strong> — the receiver waits up to ~40 ms hoping to piggyback. Nagle + delayed ACK together cause the classic 40 ms latency spike on chatty protocols.</li>
</ul>

<h2 id="practical">Practical tuning</h2>
<ul>
  <li>Enable window scaling and set <code>net.ipv4.tcp_rmem/wmem</code> generously for high-BDP links.</li>
  <li>Use persistent connections and batch app-layer writes instead of many tiny sends.</li>
  <li>Watch <code>ss -ti</code>: <code>rcv_space</code>, <code>cwnd</code> and retrans counters tell you whether you are receiver- or network-limited.</li>
</ul>

<div class="callout"><strong>Common pitfall —</strong> blaming the network for a throughput cap that is actually a 64 KB window over a high-RTT path. Compute BDP (bandwidth × delay) first.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Two windows: receiver-advertised <code>rwnd</code> and sender-computed <code>cwnd</code>.</li>
  <li>Throughput ≤ window / RTT — the fundamental limit.</li>
  <li>Nagle + delayed ACK is the classic latency foot-gun.</li>
</ol>`,
  },
  "cn-3-l3": {
    html: `<p class="lead">Congestion control is how a sender discovers available bandwidth without a signal from the network. The modern algorithms are all variations on "probe up, cut down".</p>

<h2 id="aimd">The core loop: AIMD</h2>
<ol>
  <li><strong>Slow start</strong> — <code>cwnd</code> doubles every RTT (exponential) until <code>ssthresh</code> or loss.</li>
  <li><strong>Congestion avoidance</strong> — add one MSS per RTT (linear probing).</li>
  <li><strong>On loss</strong> — multiplicative decrease: <code>ssthresh = cwnd/2</code>, <code>cwnd</code> resets or halves.</li>
</ol>
<pre><code>RTT:    1    2    3    4    5     6     7
cwnd:   1    2    4    8   16    17    18     <- slow start, then +1 per RTT
loss:                         ^ ssthresh = 8, cwnd halved</code></pre>

<h2 id="algo">The algorithm zoo</h2>
<table>
  <thead><tr><th>Algorithm</th><th>Loss signal</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td>Tahoe</td><td>packet loss</td><td>Resets to slow start on any loss</td></tr>
    <tr><td>Reno</td><td>3 dup ACKs / timeout</td><td>Fast retransmit + fast recovery</td></tr>
    <tr><td>CUBIC</td><td>loss</td><td>Cubic growth function; Linux default since 2.6.19</td></tr>
    <tr><td>BBR</td><td>bandwidth + RTT model</td><td>Models bottleneck, not loss; big gains on lossy links</td></tr>
    <tr><td>Vegas / DCTCP</td><td>delay / ECN</td><td>Proactive, used in datacenters</td></tr>
  </tbody>
</table>

<h2 id="fairness">Fairness and bufferbloat</h2>
<ul>
  <li><strong>AIMD fairness</strong> — two flows sharing a bottleneck converge to equal shares (the sawtooth interleave).</li>
  <li><strong>Bufferbloat</strong> — oversized buffers add hundreds of ms of queue delay; SQM/fq_codel/CAKE fix it at the router.</li>
  <li><strong>ECN</strong> — routers mark instead of drop, letting senders react before loss.</li>
</ul>

<div class="callout"><strong>Interview favourite —</strong> "Why does BBR help on satellite links?" Because it does not wait for loss; loss-based algorithms read a deep buffer's delay as available capacity and never speed up. BBR estimates the delivery rate and RTT directly.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Slow start is not slow — it is exponential.</li>
  <li>Loss-based algorithms compete badly with delay; bufferbloat is the symptom.</li>
  <li>cwnd, ssthresh and the sawtooth shape are the three things to draw from memory.</li>
</ol>`,
    quizzes: [
      {
        q: "During TCP slow start, how does cwnd grow?",
        options: ["Linearly, +1 MSS per RTT", "Exponentially, doubling per RTT", "It stays fixed until loss", "It halves every RTT"],
        answer: 1,
        explain:
          "Each ACK adds MSS to cwnd, so a full window of ACKs per RTT doubles it — exponential growth until ssthresh, after which congestion avoidance adds one MSS per RTT.",
      },
    ],
  },
  "cn-4-l0": {
    html: `<p class="lead">DNS turns a name into an address through a cache hierarchy. Its design — heavily cached, UDP-first, hierarchical — is why the web feels instant.</p>

<h2 id="tree">The hierarchy</h2>
<pre><code>root (.)            -> a.root-servers.net ... 13 anycast identities
  .com   TLD        -> managed by Verisign
    example.com     -> the domain's authoritative nameservers
      www           -> A 93.184.216.34, AAAA 2606:2800:...</code></pre>

<h2 id="resolution">Recursive vs iterative</h2>
<p>Your stub resolver asks a <em>recursive</em> resolver (8.8.8.8, 1.1.1.1, or your ISP's). That resolver does the <em>iterative</em> walk: root → TLD → authoritative, caching each answer. The distinction is a favourite interview question — one side does the work, the other delegates it.</p>

<h2 id="records">Record types you must know</h2>
<table>
  <thead><tr><th>Type</th><th>Meaning</th><th>Note</th></tr></thead>
  <tbody>
    <tr><td>A / AAAA</td><td>IPv4 / IPv6 address</td><td>the everyday lookup</td></tr>
    <tr><td>CNAME</td><td>alias to another name</td><td>cannot coexist with other records at the same name</td></tr>
    <tr><td>ALIAS/ANAME</td><td>apex-safe alias</td><td>provider-resolved, not in the RFC</td></tr>
    <tr><td>MX</td><td>mail exchanger</td><td>priority + host</td></tr>
    <tr><td>NS</td><td>delegation</td><td>which servers answer authoritatively</td></tr>
    <tr><td>TXT</td><td>free text</td><td>SPF, DKIM, ACME challenges</td></tr>
    <tr><td>SOA</td><td>zone metadata</td><td>serial drives zone transfers</td></tr>
    <tr><td>SRV</td><td>service discovery</td><td>used by SIP, XMPP, Kubernetes headless</td></tr>
  </tbody>
</table>

<h2 id="caching">TTL and caching</h2>
<p>TTL is a promise: "you may reuse this answer for N seconds". Short TTLs make failovers fast but load authoritative servers; long TTLs make changes slow to propagate. Negative answers are cached too (SOA minimum), which is why a freshly created subdomain can appear broken for minutes.</p>

<h2 id="security">DNSSEC and privacy</h2>
<ul>
  <li><strong>DNSSEC</strong> — a chain of RRSIG/DNSKEY signatures from the root to your zone, validated by the resolver; it provides integrity, not confidentiality. Trust anchor is the root KSK.</li>
  <li><strong>DoT / DoH</strong> — encrypt the resolver leg so intermediaries cannot read your lookups.</li>
  <li><strong>Cache poisoning</strong> — the Kaminsky attack; mitigated by randomised ports and query IDs plus DNSSEC.</li>
</ul>

<div class="callout"><strong>Interview favourite —</strong> "Where can DNS resolution fail?" Stub config, local cache poisoning, UDP loss with a 2-second timeout, a resolver outage, a delegation loop, or an expired zone. Listing five failure points is the answer they want.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Recursion is a service; iteration is the walk up the tree.</li>
  <li>TTL governs both propagation speed and authoritative load.</li>
  <li>DNSSEC signs records; DoH/DoT encrypt the transport.</li>
</ol>`,
  },
  "cn-4-l1": {
    html: `<p class="lead">The three HTTP generations are a case study in removing round trips. Each one attacks the head-of-line blocking that the previous one introduced.</p>

<h2 id="h1">HTTP/1.1</h2>
<ul>
  <li>Text protocol, one request per connection at a time.</li>
  <li><strong>Pipelining</strong> (sending many requests without waiting) existed but was unusable: responses must come back in order, so one slow response blocks everything.</li>
  <li>Workarounds that defined web performance for a decade: connection reuse with <code>keep-alive</code>, domain sharding, sprite sheets, inlining.</li>
</ul>

<h2 id="h2">HTTP/2 (2015)</h2>
<ul>
  <li>Binary framing: one TCP connection, many interleaved <strong>streams</strong>, each with an ID.</li>
  <li>HPACK header compression with a static/dynamic table.</li>
  <li>Server push (largely abandoned) and stream priorities (reworked in 2022's RFC 9218).</li>
  <li>Fixes application-level HOL blocking, but <strong>TCP-level HOL blocking remains</strong>: one lost segment stalls every stream because TCP's byte stream must be ordered.</li>
</ul>

<h2 id="h3">HTTP/3 / QUIC (2022)</h2>
<ul>
  <li>Runs over UDP with its own reliability: per-stream ordering, so a lost packet only stalls its own stream.</li>
  <li><strong>1-RTT handshake</strong> combining transport + TLS, and <strong>0-RTT</strong> resumption (with replay caveats).</li>
  <li>Connection IDs survive IP changes — mobile handoff no longer kills the connection.</li>
  <li>Mandatory TLS 1.3; header field compression is QPACK (HPACK adapted for out-of-order delivery).</li>
</ul>

<table>
  <thead><tr><th></th><th>HTTP/1.1</th><th>HTTP/2</th><th>HTTP/3</th></tr></thead>
  <tbody>
    <tr><td>Transport</td><td>TCP</td><td>TCP</td><td>QUIC / UDP</td></tr>
    <tr><td>Framing</td><td>text</td><td>binary</td><td>binary</td></tr>
    <tr><td>Multiplexing</td><td>no</td><td>yes</td><td>yes, per stream</td></tr>
    <tr><td>HOL blocking</td><td>application + TCP</td><td>TCP only</td><td>none within a connection</td></tr>
    <tr><td>Handshake cost</td><td>TCP + TLS</td><td>TCP + TLS</td><td>1-RTT (0-RTT on resume)</td></tr>
  </tbody>
</table>

<div class="callout"><strong>Interview favourite —</strong> "Why is HTTP/3 over UDP?" Not because UDP is better, but because TCP is fixed in the kernel and middleboxes would break new TCP options. QUIC in userland can be upgraded without an OS update.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>HOL blocking exists at two layers; HTTP/2 fixed one, HTTP/3 fixed both.</li>
  <li>Header compression matters: headers dominate small requests.</li>
  <li>QUIC's connection ID is what makes it mobile-friendly.</li>
</ol>`,
  },
  "cn-4-l2": {
    html: `<p class="lead">TLS 1.3 stripped the handshake to one round trip, removed every legacy primitive, and made forward secrecy mandatory. Here is what actually crosses the wire.</p>

<h2 id="h112">TLS 1.2 (for contrast)</h2>
<pre><code>ClientHello -&gt;
                             &lt;- ServerHello, Certificate, ServerKeyExchange,
                                ServerHelloDone
ClientKeyExchange, ChangeCipherSpec, Finished -&gt;
                             &lt;- ChangeCipherSpec, Finished
(2 round trips before any application data)</code></pre>

<h2 id="h13">TLS 1.3</h2>
<pre><code>ClientHello (key_share: x25519 pub, supported_versions=1.3) -&gt;
                             &lt;- ServerHello (key_share), {EncryptedExtensions},
                                {Certificate}, {CertificateVerify}, {Finished}
{Finished} -&gt;
[Application Data]  &lt;-&gt;   ... one round trip, everything after ServerHello is encrypted</code></pre>
<ul>
  <li><strong>Key exchange</strong> — (EC)DHE only: X25519 or P-256. RSA key transport is gone, so static-RSA captures can no longer be decrypted later.</li>
  <li><strong>Cipher suites</strong> — AEAD only: AES-GCM, AES-CCM, ChaCha20-Poly1305. No CBC, no RC4, no MD5/SHA-1.</li>
  <li><strong>Forward secrecy</strong> — every session uses an ephemeral DH secret, so compromising the server's long-term key does not unlock past captures.</li>
  <li><strong>0-RTT (early data)</strong> — a resumed session can send data in the first flight, but it is not replay-protected: only for idempotent requests, and servers must dedupe.</li>
</ul>

<h2 id="cert">Certificates and trust</h2>
<p>The server presents a chain: leaf → intermediate → root (the root is trusted from the client's store). Validation checks signature chain, validity window, hostname (SAN, not CN), revocation (OCSP stapling preferred over blocking CRL fetches), and optionally Certificate Transparency logs. Let's Encrypt automated ACME issuance and made the web default-HTTPS.</p>

<h2 id="reading">Reading it in Wireshark</h2>
<p>Unless you hold the private keys (SSLKEYLOGFILE works in Firefox/Chrome), you will see only IPs, ports, TCP/QUIC metadata, SNI in the ClientHello, and certificate lengths. The SNI is still plaintext in TLS 1.3 — ECH (Encrypted Client Hello) is the fix rolling out.</p>

<div class="callout"><strong>Interview favourite —</strong> "Why is 0-RTT risky?" Replay. An attacker can capture the early-data flight and replay it to the same server within the ticket window, so use it only for safe, idempotent requests.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>TLS 1.3 = one round trip, DHE only, AEAD only.</li>
  <li>Forward secrecy is the headline property; 1.2 with RSA key transport had none.</li>
  <li>0-RTT trades a round trip for replay risk.</li>
</ol>`,
  },
  "cn-4-l3": {
    html: `<p class="lead">The interview classic, done properly. Every step below is a place where things fail — and naming those failure points is what separates a rehearsed answer from a real one.</p>

<h2 id="steps">The sequence</h2>
<ol>
  <li><strong>URL parsing.</strong> Scheme, host, port, path, query, fragment. HSTS may force HTTPS before anything else happens.</li>
  <li><strong>DNS.</strong> Browser cache → OS cache → resolver. Recursive walk up the tree; answer A/AAAA with a TTL. Failure: NXDOMAIN, timeout, captive-portal hijack.</li>
  <li><strong>ARP / routing.</strong> Find the next hop's MAC (the gateway, if off-subnet). Failure: no gateway, ARP cache miss with a dropped packet.</li>
  <li><strong>TCP (or QUIC) handshake.</strong> SYN → SYN/ACK → ACK. Failure: RST (nothing listening), SYN drop (firewall), retransmission on loss.</li>
  <li><strong>TLS handshake.</strong> Certificate chain validation, key exchange, cipher negotiation. Failure: expired/invalid cert, clock skew, missing intermediate, TLS interception appliance.</li>
  <li><strong>HTTP request.</strong> Method, path, headers (Host, User-Agent, Accept, Cookie, Accept-Encoding), body if any.</li>
  <li><strong>Server path.</strong> Load balancer → CDN edge (cache hit returns immediately) → reverse proxy → app server → cache → database. Each hop is a timeout budget.</li>
  <li><strong>Response.</strong> Status code, headers (<code>Content-Type</code>, <code>Cache-Control</code>, <code>Content-Encoding: br</code>, <code>Set-Cookie</code>), body.</li>
  <li><strong>Browser rendering.</strong> Parse HTML → DOM; CSS → CSSOM; blocking scripts delay; layout, paint, composite. Sub-resources trigger more DNS/TCP/TLS in parallel.</li>
</ol>

<h2 id="numbers">Where the milliseconds go</h2>
<table>
  <thead><tr><th>Step</th><th>Typical cost</th><th>Optimisation</th></tr></thead>
  <tbody>
    <tr><td>DNS (cold)</td><td>20–150 ms</td><td>cache, prefetch, low TTL on failover records</td></tr>
    <tr><td>TCP handshake</td><td>1 RTT</td><td>keep-alive, edge PoPs, QUIC</td></tr>
    <tr><td>TLS 1.3</td><td>1 RTT</td><td>session resumption, 0-RTT for idempotent</td></tr>
    <tr><td>TTFB</td><td>10–500 ms</td><td>CDN, caching, DB indexes</td></tr>
    <tr><td>Render</td><td>100–1000 ms</td><td>less JS, no render-blocking CSS, HTTP/2/3</td></tr>
  </tbody>
</table>

<div class="callout"><strong>Interview favourite —</strong> "What if the page is blank but the network tab shows 200?" You have moved from network to rendering: a JS exception, a blocked parser, or a CSS/font stall. The question tests whether you know where the network ends.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>DNS, TCP, TLS are three separate round-trip costs; each is optimisable.</li>
  <li>Caching happens at four layers: browser, CDN, reverse proxy, database.</li>
  <li>Always finish with a failure mode per step — that is the depth signal.</li>
</ol>`,
    practice: [
      {
        prompt: "Trace a request to https://api.example.com/v1/users from your laptop and list every header your client sends.",
        hint: "Use curl -v and separate the DNS/TCP/TLS phases from the HTTP exchange.",
        solution:
          "curl -v https://api.example.com/v1/users shows: DNS resolution, TCP SYN/SYN-ACK, TLS ClientHello/ServerHello, then the request headers (Host, User-Agent, Accept, Accept-Encoding) and the response status, headers (Cache-Control, Content-Type, Content-Length) and body.",
      },
    ],
  },
};
