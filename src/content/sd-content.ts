export interface SDTopic {
  id: string;
  num: string;
  title: string;
  time: number;
  html: string;
}

export interface SDModule {
  id: string;
  track: string;
  title: string;
  icon: string;
  topics: SDTopic[];
}

export const sdTrackLabels: Record<string, string> = {
  phase0: 'Phase 0 · Prerequisites',
  phase1: 'Phase 1 · LLD Foundations',
  phase2: 'Phase 2 · LLD Patterns & Cases',
  phase3: 'Phase 3 · HLD Foundations',
  phase4: 'Phase 4 · Databases & Storage',
  phase5: 'Phase 5 · Distributed Systems',
  phase6: 'Phase 6 · Reliability & Scalability',
  phase7: 'Phase 7 · Production Engineering',
  phase8: 'Phase 8 · HLD Case Studies',
  phase9: 'Phase 9 · Production Projects',
  phase10: 'Phase 10 · Interview Prep',
  reference: 'Reference',
};

export const sdModules: SDModule[] = [
  {
    id: 'm0a',
    track: 'phase0',
    title: "How Computers & Networks Work",
    icon: '0A',
    topics: [
      {
        id: 'P0-01',
        num: 'P0-01',
        title: "Course Orientation & Methodology",
        time: 5,
        html: `<p>This upgraded course is organized as 11 phases that take you from OS/networking fundamentals to interview readiness. It is <strong>not</strong> a passive read — every sheet ends with something to do, and phases are gated by checkpoints.</p><h4>The 8-step learning loop (per sheet)</h4><ul><li><strong>TEACH</strong> — read the concept, understand the problem it solves.</li><li><strong>EXAMPLE</strong> — study the worked example (with numbers or code).</li><li><strong>VISUALIZE</strong> — redraw the diagram / class diagram from memory.</li><li><strong>TRADEOFF</strong> — write 2 alternatives and why they lose.</li><li><strong>PRACTICAL</strong> — do the sheet's exercise.</li><li><strong>QUIZ</strong> — answer the self-checks without notes.</li><li><strong>DESIGN EXERCISE</strong> — apply it to a mini design.</li><li><strong>REVIEW</strong> — re-read only what you failed to recall.</li></ul><h4>Checkpoints (you may not advance until you pass)</h4><ul><li>G1 → Phase 1: explain TCP vs UDP, HTTP, and latency/throughput/bandwidth in your own words.</li><li>G2 → Phase 3: write a SOLID, UML-documented design for a new system.</li><li>G3 → Phase 4: explain SQL vs NoSQL and draw a replication topology.</li><li>G4 → Phase 5: explain CAP/PACELC and quorums precisely.</li><li>G5 → Phase 8: explain Saga + Outbox + delivery semantics with a payment example.</li><li>G6 → Phase 10: run a full 45-minute mock design without notes.</li></ul><div class="callout callout-tip"><span class="callout-tag">TIP</span>The gate problems live in a separate file (gate-problems.md). Attempt them BEFORE opening the solutions file — that habit is the single highest-leverage interview skill.</div>`
      },
      {
        id: 'P0-02',
        num: 'P0-02',
        title: "Data Structures & Complexity Primer",
        time: 8,
        html: `
<h4>Why this matters</h4>
<p>Every "O(1) lookup" you will claim in an HLD interview, and every data structure you pick in an LLD round, rests on this vocabulary. You need <strong>intuition, not proofs</strong> — interviewers ask "what happens when the data doubles?", never "prove the average case".</p>
<h4>The four structures that show up constantly</h4>
<ul>
<li><strong>Hash map</strong> — average O(1) lookup. Internally: hash the key, index an array of buckets, handle collisions (chaining or open addressing). The cost you pay is the <strong>load factor</strong> (filled buckets / total buckets): beyond ~0.7, collisions grow and lookups degrade toward O(n). This is why real hash maps resize.</li>
<li><strong>Tree / trie</strong> — a balanced tree gives sorted order and O(log n) range scans; a <strong>trie</strong> (prefix tree) makes "every word starting with 'sys'" a walk down one path — the structure behind autocomplete (P8-18).</li>
<li><strong>Graph</strong> — nodes + edges. A social network's "who follows whom" is a graph; a service dependency map is a graph. Store it as an adjacency list (space-efficient) or matrix (fast edge checks, O(V²) space).</li>
<li><strong>Stack / queue / heap</strong> — undo history is a stack; task queues are queues; "nearest free parking spot" and "top-K trending" are heaps.</li>
</ul>
<h4>Complexity you must state cold</h4>
<ul>
<li>O(1): hash lookup, array index. O(log n): binary search, balanced tree, heap push/pop. O(n): a full scan. O(n log n): comparison sort.</li>
<li>The one fact that connects to databases: <strong>an indexed lookup is O(log n) in a B-tree but O(n) in a table scan</strong> — that is the entire reason indexes exist (P4-03).</li>
</ul>
<div class="callout callout-watch"><span class="callout-tag">MISCONCEPTION</span>A hash map is O(1) <em>on average</em>, not worst case. A malicious set of colliding keys can force O(n). That is why some systems use trees or re-hash on attack detection.</div>
<h4>Quick check</h4>
<ul>
<li>Why does a hash map slow down as it fills, even though lookups are "O(1)"?</li>
<li>Which structure would you use to serve "top 10 leaderboard" and why?</li>
<li>Why is a trie, not a sorted array, the natural fit for autocomplete?</li>
</ul>
`
      },
      {
        id: 'P0-03',
        num: 'P0-03',
        title: "How Computers & Networks Communicate",
        time: 10,
        html: `
<h4>What problem does this solve?</h4>
<p>Every architecture diagram you draw is a lie of convenience: those boxes are actually <strong>processes on machines talking over a network</strong>. Before any of it makes sense, you need the physical model underneath — otherwise "the server is down" and "the network dropped a packet" sound like the same thing, and they are not.</p>
<h4>Intuition: it's processes, not boxes</h4>
<ul>
<li>A <strong>server</strong> is a process (like your Node/Java/C++ program) that opened a socket and is <em>listening</em> on a port. A <strong>client</strong> is another process that <em>connects</em> to that port.</li>
<li><strong>IP addresses</strong> route packets between machines. <strong>Ports</strong> (0–65535) address a specific process on that machine — one machine can host thousands of services, each on its own port.</li>
<li>A <strong>socket</strong> is the operating system's handle a process uses to send and receive bytes — think of it as the plug on your end of the pipe.</li>
<li><strong>NAT</strong> lets many machines share one public IP. That is why your laptop can <em>reach</em> the internet, but the internet cannot reach back into it — no one can route a packet "to your laptop" from outside.</li>
</ul>
<h4>The path of one request</h4>
<p><code>app → OS socket → NIC → switches/routers → NIC → OS socket → app</code>. Every box in an HLD diagram is shorthand for several of these hops, and every hop adds latency (see the numbers in P0-07). A "database call" is not magic — it is this entire path, twice.</p>
<h4>Why "the server is down" is four different failures</h4>
<ul>
<li><strong>Process crashed</strong> — the port stops listening. Fix: restart, supervisor.</li>
<li><strong>Wrong port / firewall</strong> — the process is fine; the path to it is blocked. Fix: config.</li>
<li><strong>Network partition</strong> — packets dropped or delayed between machines. Fix: timeouts + retries (P6-03).</li>
<li><strong>Overloaded</strong> — the process is alive but its queue is full. Fix: scale or shed load (P6-04).</li>
</ul>
<p>Loopback (127.0.0.1) and private ranges (10.x, 192.168.x) are addresses that never leave the machine or the local network — knowing them saves you from confusing "it works locally" with "it works on the internet".</p>
<h4>Quick check</h4>
<ul>
<li>What two pieces of information identify "which process on which machine"?</li>
<li>Why can a phone reach a web server, but the server cannot push a connection to the phone (hint: NAT)?</li>
</ul>
`
      },
      {
        id: 'P0-04',
        num: 'P0-04',
        title: "DNS \u2014 How a Request Finds a Server",
        time: 8,
        html: `
<h4>What problem does this solve?</h4>
<p>Humans remember <code>youtube.com</code>; machines route by IP address like <code>142.250.190.78</code>. DNS is the phonebook that maps one to the other — and it runs, invisibly, before <em>every</em> request your system ever serves.</p>
<h4>How resolution works, step by step</h4>
<ol>
<li>The browser checks its own cache, then the OS cache. (A hit here costs ~0 ms.)</li>
<li>On a miss, the query goes to a <strong>recursive resolver</strong> — your ISP's, or a public one like 8.8.8.8.</li>
<li>The resolver walks the hierarchy: <strong>root servers</strong> → the <strong>.com TLD</strong> servers → the domain's <strong>authoritative</strong> name servers → the answer.</li>
<li>The IP is returned and <strong>cached at every layer</strong>, each cache respecting a <strong>TTL</strong> (time-to-live) that says how long it may reuse the answer.</li>
</ol>
<h4>Why DNS matters for system design</h4>
<ul>
<li><strong>It is your first load balancer.</strong> DNS can return different IPs to different users — geo-routing sends the Indian user to the Mumbai region, the American to Virginia.</li>
<li><strong>TTL is a failover dial.</strong> Low TTL (60s) lets you repoint traffic quickly when a region dies; high TTL (24h) reduces lookup traffic but means a bad IP lingers everywhere. Production sits in between.</li>
<li><strong>It is itself a distributed system.</strong> DNS is a planet-scale, heavily cached, eventually-consistent database — a useful "this problem was already solved" reference point (P5-04).</li>
</ul>
<div class="callout callout-watch"><span class="callout-tag">MISCONCEPTION</span>DNS does not make your system highly available by itself. After failover, clients and intermediate resolvers keep using the <em>old</em> IP until the TTL expires. "Change DNS" is a slow failover mechanism — a global load balancer (P7-07) is the fast one.</div>
<h4>Quick check</h4>
<ul>
<li>Why is a cached DNS record not necessarily the current one?</li>
<li>You need to fail over in seconds. Why is DNS alone insufficient?</li>
</ul>
`
      },
      {
        id: 'P0-05',
        num: 'P0-05',
        title: "HTTP/HTTPS Essentials",
        time: 10,
        html: `
<h4>What problem does this solve?</h4>
<p>Nearly every public API in the world speaks HTTP. The interviewer assumes you know it the way a plumber knows pipes: methods, status codes, statelessness, and where TLS fits.</p>
<h4>Methods and the idempotency rule</h4>
<ul>
<li><strong>GET</strong> read (safe, idempotent — retrying is harmless). <strong>PUT</strong>/<strong>DELETE</strong> replace/remove (idempotent by design). <strong>POST</strong> create (not idempotent — retrying can create two resources). <strong>PATCH</strong> partial update.</li>
<li>Why you care: over an unreliable network you will retry. An idempotent retry is free; a non-idempotent retry can double-charge a customer (P5-12).</li>
</ul>
<h4>Status codes worth knowing cold</h4>
<p><code>2xx</code> success · <code>3xx</code> redirect (301 permanent, 302 temporary) · <code>4xx</code> client error (400 bad request, 401 unauthenticated, 403 forbidden, 404 not found, <code>429 too many requests</code>) · <code>5xx</code> server error. Returning 429 with a <code>Retry-After</code> header is how rate limiters talk (P3-12); returning 503 under overload is how you shed load instead of dying (P6-04).</p>
<h4>Statelessness</h4>
<p>Each HTTP request is independent by default. If your app must remember a user across requests, <em>that is a design decision you make</em> — a session cookie or a token — not something HTTP gives you. This is why "stateless server + state in the database" is the scalable default (P3-14).</p>
<h4>Connection lifecycle & HTTP versions</h4>
<ul>
<li><strong>HTTP/1.1</strong>: one request at a time per connection (keep-alive reuses the connection, but a slow response blocks the next request on it — <strong>head-of-line blocking</strong>).</li>
<li><strong>HTTP/2</strong>: multiplexes many requests over one connection as independent streams, so one slow response no longer blocks others. This multiplexing is <em>why gRPC requires HTTP/2</em>.</li>
<li><strong>HTTP/3</strong>: runs over <strong>QUIC</strong> (built on UDP) — a lost packet no longer blocks the whole stream, and connection setup takes fewer round trips. (Simplified mental model — the point is that each version removes a blocking/setup cost.)</li>
</ul>
<h4>HTTPS = HTTP over TLS</h4>
<p>TLS handshake: the client verifies the server's certificate against a trusted CA, both sides agree on encryption keys, then traffic is encrypted. In practice you <strong>terminate TLS at the load balancer</strong>: the LB decrypts, and backend traffic inside the datacenter is plaintext — or re-encrypted with mTLS when services must authenticate each other (P6-08).</p>
<div class="callout callout-tip"><span class="callout-tag">INTERVIEW</span>Assume HTTPS by default and say so once. The interviewer cares that you know <em>where</em> TLS terminates and that POST needs an idempotency key — not that you can recite the handshake.</div>
<h4>Quick check</h4>
<ul>
<li>Which two HTTP methods can you safely retry without any extra work?</li>
<li>Why does gRPC not run on HTTP/1.1?</li>
</ul>
`
      },
      {
        id: 'P0-06',
        num: 'P0-06',
        title: "TCP vs UDP \u2014 Choosing a Transport",
        time: 9,
        html: `
<h4>What problem does this solve?</h4>
<p>Two ways to move bytes, with opposite guarantees. Choosing between them is a real design decision you make per feature — not trivia.</p>
<h4>TCP — reliable, ordered, connected</h4>
<ul>
<li><strong>Connection first</strong>: a 3-way handshake (SYN, SYN-ACK, ACK) before any data. That setup is one round-trip you pay on every fresh connection — the entire reason <strong>connection pooling</strong> exists (P4-08).</li>
<li><strong>Guarantees</strong>: delivery (lost packets are retransmitted), ordering (sequence numbers reorder out-of-order packets), and error checking (checksums).</li>
<li><strong>Flow control</strong> (receiver says "slow down, my buffer is full") and <strong>congestion control</strong> (senders back off when the network is congested) are built in.</li>
<li><strong>Cost</strong>: overhead and latency — a lost packet stalls everything behind it.</li>
</ul>
<h4>UDP — fast, fire-and-forget</h4>
<ul>
<li>No handshake, no delivery guarantee, no ordering. You send a datagram; it may arrive, or not, or out of order.</li>
<li>Lower latency, lower overhead. Perfect when a <em>late</em> packet is worse than a <em>lost</em> one: live video/voice, games, DNS lookups.</li>
</ul>
<div class="callout callout-tradeoff"><span class="callout-tag">TRADEOFF</span>A dropped video frame in a live call is invisible; a dropped byte in a bank transfer is catastrophic. The rule: how does this feature tolerate loss vs. delay? Loss-tolerant + delay-sensitive → UDP (or QUIC). Loss-sensitive → TCP.</div>
<h4>QUIC — the modern middle path</h4>
<p>QUIC (used by HTTP/3) takes UDP's no-stall property and rebuilds reliability on top: fast connection setup, per-stream recovery, built-in encryption. The lesson isn't "UDP won" — it's that the reliability-vs-latency tradeoff is <em>tunable</em>, and modern protocols tune it per stream.</p>
<h4>Where each shows up in this course</h4>
<ul>
<li>HTTP/HTTPS, database connections, file transfer → TCP.</li>
<li>Live video streaming, voice calls, game state, DNS → UDP.</li>
<li>QUIC/HTTP/3 → the transport of a modern CDN edge.</li>
</ul>
<h4>Quick check</h4>
<ul>
<li>Why do you pool TCP connections but not "pool" UDP datagrams?</li>
<li>Name a feature where a late packet is worse than a dropped one — and one where the opposite is true.</li>
</ul>
`
      },
      {
        id: 'P0-07',
        num: 'P0-07',
        title: "Latency, Throughput, Bandwidth + the Numbers Table",
        time: 9,
        html: `
<h4>The problem: three words people use interchangeably</h4>
<ul>
<li><strong>Latency</strong> — how long one request takes (e.g. 120 ms to load a tweet). What users <em>feel</em>.</li>
<li><strong>Throughput</strong> — how many requests the system completes per second (e.g. 50,000 req/s). What decides whether it <em>falls over</em>.</li>
<li><strong>Bandwidth</strong> — how much data a link can carry per second (e.g. 10 Gbps). The width of the pipe, not the speed of one drop.</li>
</ul>
<p>They are related but different: a truck full of hard drives has enormous <em>bandwidth</em> but terrible <em>latency</em>; a system can have high throughput <em>and</em> high latency (1,000 tellers each taking 10 minutes).</p>
<h4>The table that justifies half this course — memorize it</h4>
<table><tr><th>Operation</th><th>Time</th></tr>
<tr><td>L1 cache reference</td><td>~1 ns</td></tr><tr><td>Main memory (RAM)</td><td>~100 ns</td></tr>
<tr><td>SSD random read</td><td>~10–100 µs</td></tr><tr><td>HDD seek</td><td>~10 ms</td></tr>
<tr><td>Round-trip within a datacenter</td><td>~0.5 ms</td></tr><tr><td>Cross-US round-trip</td><td>~150 ms</td></tr></table>
<h4>Why this table decides architectures</h4>
<ul>
<li><strong>Caching exists</strong> because RAM is ~10⁴× faster than SSD: keep the hot set in memory and skip the disk.</li>
<li><strong>CDNs exist</strong> because a cross-continent hop is ~300× a same-datacenter hop: serve from near the user (P3-11).</li>
<li><strong>Batching exists</strong> because one disk seek costs ~100,000 RAM reads: write a batch, not a byte.</li>
<li><strong>Connection pooling exists</strong> because a TCP handshake is a full network round-trip you'd otherwise pay per query.</li>
</ul>
<div class="callout callout-tradeoff"><span class="callout-tag">TRADEOFF</span>Batching raises throughput but hurts latency (a record waits for its batch). Chat optimizes latency; nightly analytics optimizes throughput. Whenever someone says "make it faster", ask: <em>latency or throughput?</em></div>
<h4>Numerical exercise</h4>
<p>A single disk seek (~10 ms) equals roughly how many RAM reads (~100 ns)? Answer: ~100,000. Now explain, in one sentence, why an index that avoids a seek can make a query 100,000× faster (P4-03).</p>
`
      },
    ],
  },
  {
    id: 'm0b',
    track: 'phase0',
    title: "OS & Concurrency Foundations",
    icon: '0B',
    topics: [
      {
        id: 'P0-08',
        num: 'P0-08',
        title: "Concurrency vs Parallelism; Processes vs Threads",
        time: 10,
        html: `
<h4>What problem does this solve?</h4>
<p>These two pairs of words are the most conflated in systems. Getting them right lets you reason about why one design survives load and another melts.</p>
<h4>Concurrency vs parallelism</h4>
<ul>
<li><strong>Concurrency</strong> is about <em>structure</em>: dealing with many tasks at once by interleaving them. One chef, many orders — the chef switches between them.</li>
<li><strong>Parallelism</strong> is about <em>resources</em>: actually executing many things at once. Four chefs, four orders.</li>
<li>You can have concurrency without parallelism (one core time-slicing many threads) and parallelism without concurrency (one big task split across cores).</li>
</ul>
<h4>Processes vs threads</h4>
<ul>
<li><strong>Process</strong>: its own memory space, isolated, expensive to create and to context-switch. A crash is contained.</li>
<li><strong>Thread</strong>: shares the heap with sibling threads, has its own stack. Cheap to switch, but shared state → synchronization (P0-09).</li>
<li>Context switching is never free: saving/restoring registers and caches costs real time — this is why "a thread per request" has a ceiling and why <strong>event loops</strong> exist.</li>
</ul>
<h4>Two server models — the fork in the road</h4>
<ul>
<li><strong>Thread-per-request</strong> (classic Tomcat/Java): simple mental model — one blocked thread per waiting client. But 10,000 blocked threads = 10,000 stacks of memory.</li>
<li><strong>Event loop</strong> (Node, nginx): one thread multiplexes thousands of connections using async I/O. Brilliant when work is I/O-bound (waiting on network/disk); wrong when a request is CPU-bound (one heavy computation blocks everyone).</li>
<li>The GIL is the cautionary example: in some runtimes, many threads still execute one at a time — so "more threads" does not mean "more parallelism" for CPU work.</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">INTERVIEW</span>"CPU-bound vs I/O-bound" is the question behind the model choice — and behind scaling out vs batching. Say which one your system is, out loud, early.</div>
<h4>Quick check</h4>
<ul>
<li>Can you have concurrency on a single core? Parallelism on a single core?</li>
<li>Why does an event loop choke on CPU-bound requests?</li>
</ul>
`
      },
      {
        id: 'P0-09',
        num: 'P0-09',
        title: "Synchronization Basics",
        time: 10,
        html: `
<h4>What problem does this solve?</h4>
<p>Shared state + multiple threads = the classic bug source. These primitives are the vocabulary for both LLD concurrency questions and every HLD claim about "thread-safe" counters.</p>
<h4>The failure vocabulary</h4>
<ul>
<li><strong>Race condition</strong> — the outcome depends on scheduling. Two threads read a balance of 100, each subtracts, both write 60 → one debit vanished (the same "lost update" you will meet in databases, P4-04).</li>
<li><strong>Data race</strong> — two threads touch the same memory with no synchronization; the result is undefined, not just "wrong".</li>
</ul>
<h4>The primitives</h4>
<ul>
<li><strong>Mutex/lock</strong> — mutual exclusion; one holder at a time. Hold it as briefly as possible; never call unknown code while holding it.</li>
<li><strong>Semaphore</strong> — a counter permitting N concurrent holders. A rate limiter is, conceptually, a semaphore (P3-12).</li>
<li><strong>Condition variable</strong> — wait until a predicate becomes true; the building block of blocking queues.</li>
<li><strong>Atomic ops / CAS</strong> — compare-and-swap: "if the value is still X, set it to Y, in one indivisible step." The lock-free foundation of counters and optimistic concurrency.</li>
</ul>
<h4>Deadlock, livelock, starvation</h4>
<ul>
<li><strong>Deadlock</strong> needs four conditions — mutual exclusion, hold-and-wait, no preemption, circular wait. Break <em>any one</em> (e.g. acquire locks in a fixed order) and deadlock becomes impossible.</li>
<li><strong>Livelock</strong> — threads keep reacting to each other without progress (two people stepping aside forever).</li>
<li><strong>Starvation</strong> — one thread never gets the lock because others keep winning.</li>
</ul>
<h4>Locks vs lock-free</h4>
<p>Locks are easy to reason about but block. Lock-free code (CAS loops) never blocks but is far harder to write correctly — reach for it only when you have <em>measured</em> contention, never because it sounds faster.</p>
<h4>Exercise</h4>
<p>Write a program with N threads incrementing a shared counter with no synchronization; observe the lost increments. Fix it with a mutex, then with an atomic. Induce a deadlock with two locks and draw the wait graph.</p>
`
      },
      {
        id: 'P0-10',
        num: 'P0-10',
        title: "OS Concepts That Matter for System Design",
        time: 8,
        html: `
<h4>The problem: designs that "should work" but crawl</h4>
<p>Five OS facts quietly decide whether a system is fast. They are the <em>why</em> behind caching, batching, and append-only storage.</p>
<h4>The five facts</h4>
<ul>
<li><strong>Memory hierarchy</strong> — registers → L1/L2/L3 cache → RAM → SSD → disk; each step is roughly 10–100× slower. Data laid out to fit cache lines (contiguous, small) vastly outperforms pointer-chasing.</li>
<li><strong>Virtual memory & paging</strong> — "memory is cheap" is false at scale. When a machine's working set exceeds RAM, the OS pages to disk, and a page fault (a disk access) turns a 100 ns access into 10 ms — tail latency explodes.</li>
<li><strong>Sequential vs random disk I/O</strong> — random reads pay a seek each time; sequential reads are orders of magnitude faster. This is why databases append to logs and why LSM-trees exist (P4-03).</li>
<li><strong>I/O models</strong> — blocking, non-blocking, async. The event loop (P0-08) is async I/O. File descriptors are the finite resource behind the dreaded "too many open files" — every connection and file holds one.</li>
<li><strong>Buffering & batching</strong> — flushing every byte pays a syscall + disk write each time; buffering amortizes that cost.</li>
</ul>
<h4>How these connect to the rest of the course</h4>
<ul>
<li>Memory hierarchy → why caches live in RAM (P3-09).</li>
<li>Paging → why a cache node at 99% memory can be <em>worse</em> than one at 50%.</li>
<li>Sequential I/O → why write-ahead logs and Kafka are append-only (P7-02).</li>
<li>File descriptors → why one chat server holds a finite number of sockets (P9-05).</li>
</ul>
<h4>Exercise</h4>
<p>Benchmark sequential vs random reads on a 1 GB file. Explain the ~100× gap using seek cost and the memory hierarchy. Then explain why a database prefers an index (a few seeks) over a full scan (millions of seeks).</p>
`
      },
    ],
  },
  {
    id: 'm1a',
    track: 'phase1',
    title: "Object-Oriented Thinking",
    icon: '1A',
    topics: [
      {
        id: 'P1-01',
        num: 'P1-01',
        title: "Why LLD Matters; Thinking in Objects",
        time: 7,
        html: `
<h4>What is an LLD round, really?</h4>
<p>Given a vague prompt ("design a parking lot"), you produce a working, <strong>extensible</strong> object design in 45–60 minutes. The interviewer is not grading cleverness; they are probing <strong>how your design survives change</strong>, because the follow-up is always "…and what if we add X?"</p>
<h4>The one skill that drives everything</h4>
<p>Finding the right objects. Three moves:</p>
<ul>
<li><strong>Nouns → classes.</strong> In "a user books a seat in a show", the nouns User, Booking, Seat, Show are candidate classes.</li>
<li><strong>Verbs → responsibilities.</strong> "book", "cancel", "hold" become methods — and each belongs on the class that owns the data (the <em>Information Expert</em>, P1-09).</li>
<li><strong>"What will change?" → interfaces.</strong> The single most powerful question. If payment methods will change, hide payment behind an interface. If the dice could be rigged, hide the dice (P2-22).</li>
</ul>
<h4>Design for change, not for the spec</h4>
<p>A design that matches today's spec exactly but breaks on the first new feature is a fail. A design where "add electric cars" touches exactly one class is a pass. Extensibility, maintainability, testability — those three words are the rubric, and every later sheet is in service of them.</p>
<div class="callout callout-tip"><span class="callout-tag">HABIT</span>Spend the first 5 minutes listing entities + responsibilities on paper before any code. Candidates who skip this write one god class.</div>
`
      },
      {
        id: 'P1-02',
        num: 'P1-02',
        title: "Abstraction & Encapsulation",
        time: 8,
        html: `
<h4>What problem does this solve?</h4>
<p>Big programs rot when every part can see every other part's internals. Abstraction and encapsulation are the two walls you build against that rot.</p>
<h4>Abstraction — expose <em>what</em>, hide <em>how</em></h4>
<p>An abstraction is a promise about behavior that hides implementation. <code>sort(list)</code> promises "returns sorted" without telling you whether it is quicksort or merge sort. A <code>PaymentProcessor</code> promises <code>pay(amount)</code> without exposing card details. Why it matters: callers depend on the promise, so you can swap the implementation underneath them.</p>
<h4>Encapsulation — protect the invariant</h4>
<p>Encapsulation hides <em>state</em> behind <em>behavior</em> so the object's invariants can never be violated. If <code>balance</code> is a public field, any caller can set it to -500. If it is private with a <code>withdraw()</code> that rejects insufficient funds, the invariant "balance ≥ 0" is enforced in exactly one place.</p>
<ul>
<li>Public fields are a bug magnet — always a smell.</li>
<li>Getters that just expose internal state are usually a smell too; ask what the caller is <em>really</em> trying to do (tell-don't-ask: <code>account.withdraw(x)</code>, not <code>account.balance -= x</code> scattered everywhere).</li>
</ul>
<h4>In C++</h4>
<p>Private by default; <code>const</code> methods for reads; constructors and mutators validate invariants once, centrally; never expose raw owning pointers (own via smart pointers, P1-12).</p>
<div class="callout callout-watch"><span class="callout-tag">MISCONCEPTION</span>Encapsulation is not "adding getters and setters". An object where every field has a public getter/setter is as exposed as one with public fields — it has merely been wrapped in ceremony.</div>
`
      },
      {
        id: 'P1-03',
        num: 'P1-03',
        title: "Inheritance vs Composition",
        time: 9,
        html: `
<h4>The decision that shapes every LLD design</h4>
<p>When two things are related, you either <strong>inherit</strong> (is-a) or <strong>compose</strong> (has-a). The default answer in modern design is: <strong>compose</strong>.</p>
<h4>Inheritance — powerful and rigid</h4>
<p>Inheritance means "a Car <em>is a</em> Vehicle". It shares code and lets you treat subtypes uniformly (polymorphism, P1-04). The cost: deep hierarchies are rigid. Change the base class and every subclass is affected (the <em>fragile base class problem</em>); and a class can only inherit one parent's state in most languages.</p>
<h4>Composition — flexible and explicit</h4>
<p>Composition means "a Duck <em>has a</em> FlyBehavior". You hold a reference to a collaborator and delegate to it. Because the collaborator is an object you can swap at runtime, composition gives you change without editing existing code.</p>
<h4>The Duck example (the classic) — work through it</h4>
<p>Naive: a <code>Duck</code> base with <code>fly()</code> and <code>quack()</code>. Then someone adds a rubber duck — it can't fly — and a wooden duck — it can't quack. Now you are overriding methods to do nothing, and every new duck re-litigates the problem.</p>
<p>Composition fix: <code>Duck</code> <em>holds</em> a <code>FlyBehavior</code> and a <code>QuackBehavior</code>. <code>RubberDuck</code> is built with <code>NoFly</code> + <code>Squeak</code> — zero changes to any existing code. That is the Strategy pattern (P2-09) — composition is how patterns get their power.</p>
<div class="callout callout-watch"><span class="callout-tag">RULE</span>Use inheritance for true <em>interface</em> reuse (a subtype genuinely IS a base), never merely to share code — code sharing is what composition is for.</div>
<h4>Quick check</h4>
<ul>
<li>Which one lets you change behavior at <em>runtime</em> — inheritance or composition?</li>
<li>Why does adding a new duck type require editing zero classes in the composition version?</li>
</ul>
`
      },
      {
        id: 'P1-04',
        num: 'P1-04',
        title: "Polymorphism",
        time: 5,
        html: `<p>The mechanism that makes designs <strong>open for extension, closed for modification</strong> — the engine under most design patterns.</p><h4>The three kinds</h4><ul><li><strong>Subtype (runtime)</strong> — virtual functions dispatch to the actual type: <code>Base* p = new Derived; p-&gt;draw();</code></li><li><strong>Parametric (compile-time)</strong> — templates/generics: one implementation, many types.</li><li><strong>Ad-hoc</strong> — function overloading by signature.</li></ul><h4>In C++</h4><ul><li><code>virtual</code> + <code>override</code> for runtime dispatch; the vtable is the (small) cost.</li><li><code>std::variant</code> and <code>std::function</code> are often cleaner than a hierarchy for "one of N fixed choices".</li></ul><div class="callout callout-tip"><span class="callout-tag">TIP</span>Polymorphism is how you add a new <strong>type</strong> without touching existing <strong>code</strong> — exactly what "extensibility" means in an interview.</div>`
      },
      {
        id: 'P1-05',
        num: 'P1-05',
        title: "Relationships: Association, Aggregation, Composition",
        time: 5,
        html: `<p>Naming and drawing relationships precisely — the grammar of UML (P1-10) and the difference between "has-a" flavors.</p><ul><li><strong>Dependency</strong> (weakest) — a method uses another class transiently (parameter or local).</li><li><strong>Association</strong> — "uses a"; objects know each other but neither owns the other.</li><li><strong>Aggregation</strong> — "has-a"; the part can outlive the whole (a Team has Players; delete the team, players remain).</li><li><strong>Composition</strong> — "owns-a"; the part's lifecycle is bound to the whole (a House has Rooms; delete the house, rooms go with it).</li></ul><p>Why it matters: choosing composition vs aggregation is a <strong>lifecycle decision</strong> — who deletes what, and can the part be shared? Get it wrong and you get dangling references or leaked objects.</p>`
      },
      {
        id: 'P1-06',
        num: 'P1-06',
        title: "Interfaces & Abstract Classes",
        time: 7,
        html: `
<h4>The highest-leverage rule in LLD</h4>
<p><strong>Program to an interface, not an implementation.</strong> When callers depend on a contract instead of a concrete class, you can swap implementations and test with fakes.</p>
<h4>Interface vs abstract class</h4>
<ul>
<li><strong>Interface</strong> (pure virtual in C++): a contract only — no state. <code>IPaymentProcessor { void pay(Amount); }</code></li>
<li><strong>Abstract class</strong>: partial implementation plus unimplemented steps — the hook that Template Method (P2-13) hangs on.</li>
<li>Multiple inheritance of <em>interfaces</em> is fine (a class can be Runnable and Serializable); multiple inheritance of <em>state</em> is dangerous (the diamond problem).</li>
</ul>
<h4>Why it wins, concretely</h4>
<p>An <code>OrderService</code> that depends on <code>IPaymentProcessor</code> can be tested with a fake that records calls — no real card network, no waiting. And adding a wallet provider means writing one new class, not editing <code>OrderService</code>. In an LLD interview, every "hotspot" — payment method, dispatch rule, storage backend, dice — should sit behind an interface, and you should say so out loud.</p>
`
      },
    ],
  },
  {
    id: 'm1b',
    track: 'phase1',
    title: "Design Principles",
    icon: '1B',
    topics: [
      {
        id: 'P1-07',
        num: 'P1-07',
        title: "Dependency Inversion & Dependency Injection",
        time: 8,
        html: `
<h4>The problem: welded-together code</h4>
<p><code>OrderService</code> that does <code>new EmailSender()</code> inside itself is welded to one implementation. You cannot test it without a real mail server, and you cannot change the sender without editing the service. Dependencies should be handed in, not hard-coded.</p>
<h4>Dependency Inversion (the D in SOLID)</h4>
<p>High-level modules must not depend on low-level modules; both depend on abstractions. <code>OrderService</code> depends on <code>INotifier</code>; <code>EmailSender</code> implements it. The arrow of dependence points at the abstraction, not the concrete class.</p>
<h4>Dependency Injection (how you do it)</h4>
<ul>
<li><strong>Constructor injection</strong> — pass the dependency in the constructor. Explicit, immutable, testable. The default.</li>
<li><strong>Setter injection / service locator</strong> — exist, but hide dependencies and allow half-configured objects. Weaker.</li>
</ul>
<p>Why this matters for grading: LLD designs are judged on <strong>testability</strong>. Constructor injection is what makes "inject a fake, unit-test in isolation" possible — and "testable" is a scored criterion, not a nicety.</p>
<h4>Quick check</h4>
<ul>
<li>Which SOLID principle does this implement, and which pattern does it feed into (P1-03)?</li>
<li>Why is constructor injection preferred over a service locator?</li>
</ul>
`
      },
      {
        id: 'P1-08',
        num: 'P1-08',
        title: "SOLID",
        time: 12,
        html: `
<h4>Five principles, one purpose</h4>
<p>SOLID is a checklist that keeps a growing codebase from becoming a god-class tangle. Learn each with its violation and its fix — then treat the whole thing as a compass, not a law.</p>
<h4>S — Single Responsibility</h4>
<p>One reason to change. A <code>Ticket</code> that computes fares, prints receipts, and emails confirmations has three reasons to change. Split: <code>Ticket</code> (data), <code>FareCalculator</code>, <code>ReceiptPrinter</code>.</p>
<h4>O — Open/Closed</h4>
<p>Open for extension, closed for modification. Adding a payment type should mean <em>adding a class</em>, not adding an <code>else-if</code> to existing code. The Strategy pattern (P2-09) is the standard payoff.</p>
<h4>L — Liskov Substitution</h4>
<p>Subtypes must be substitutable for their base. The trap: a <code>Square</code> that inherits <code>Rectangle</code> but breaks <code>setWidth/setHeight</code> (setting one must change the other). If a subtype cannot honor the base contract, the inheritance is simply wrong — that is the test.</p>
<h4>I — Interface Segregation</h4>
<p>No fat interfaces. <code>IWorker { work(); eat(); }</code> forces a robot to eat. Split into <code>IWorkable</code> and <code>IFeedable</code>; clients depend only on what they use.</p>
<h4>D — Dependency Inversion</h4>
<p>Depend on abstractions (P1-07).</p>
<div class="callout callout-watch"><span class="callout-tag">MISCONCEPTION</span>SOLID is not a law to apply dogmatically to a 100-line toy — that produces ceremony. The senior move is to <em>trade off</em>: "I kept this simple because it has only one axis of change." The interviewer wants to hear the judgment, not the acronym.</div>
<h4>Exercise</h4>
<p>Take one 300-line class from anything you have written and split it by SRP. Then show a client that breaks LSP and fix it with composition.</p>
`
      },
      {
        id: 'P1-09',
        num: 'P1-09',
        title: "Cohesion, Coupling & GRASP",
        time: 7,
        html: `
<h4>The measurable qualities behind "clean design"</h4>
<p>When asked "is this a good design?", do not answer with feelings — measure.</p>
<ul>
<li><strong>High cohesion</strong> — a class does one tightly-related thing. <code>Board</code> knows win-checking; it does not also email users.</li>
<li><strong>Low coupling</strong> — few dependencies between classes. <code>Game</code> depends on <code>IDice</code>, not on a specific dice implementation.</li>
<li>They usually move together: splitting a god class raises its cohesion and lowers everyone else's coupling.</li>
</ul>
<h4>GRASP — a shortcut to get it right first try</h4>
<ul>
<li><strong>Information Expert</strong> — put behavior next to the data it needs. The object that owns the data does the work.</li>
<li><strong>Creator</strong> — the class that contains or aggregates an object creates it (a <code>ParkingLot</code> creates <code>Floors</code>).</li>
<li><strong>Controller</strong> — one thin coordinator per use case, delegating to the experts.</li>
<li><strong>Low Coupling / High Cohesion</strong> — evaluate every assignment against these two.</li>
</ul>
<p>These are not new rules — they are <em>why</em> SOLID works, stated as design-time heuristics.</p>
`
      },
    ],
  },
  {
    id: 'm1c',
    track: 'phase1',
    title: "UML & C++ for LLD",
    icon: '1C',
    topics: [
      {
        id: 'P1-10',
        num: 'P1-10',
        title: "UML & Class Diagrams",
        time: 9,
        html: `
<h4>What problem does this solve?</h4>
<p>Your design must be communicable to an interviewer in 30 seconds and implementable by someone else. UML is that shared notation. You need exactly two diagrams: the <strong>class diagram</strong> (structure) and the <strong>sequence diagram</strong> (one flow).</p>
<h4>The class box</h4>
<pre>+----------------------+
|      ClassName       |
+----------------------+
| - field : Type       |
+----------------------+
| + method() : Return  |
+----------------------+</pre>
<h4>The five relationship arrows — this is the part people get wrong</h4>
<ul>
<li><strong>Inheritance</strong> (is-a): solid line, hollow triangle △ pointing at the base.</li>
<li><strong>Association</strong> (uses a): plain solid line.</li>
<li><strong>Aggregation</strong> (has-a, part can outlive whole): hollow diamond ◇ at the owner.</li>
<li><strong>Composition</strong> (owns-a, lifecycle-bound): filled diamond ◆ at the owner.</li>
<li><strong>Dependency</strong> (transient use, weakest): dashed arrow ⇢.</li>
<li><strong>Multiplicity</strong>: 1, 0..1, 0..*, 1..* on each end.</li>
</ul>
<p>The composition-vs-aggregation choice is a <em>lifecycle</em> decision: who deletes what, and can the part be shared? Get it wrong and you get dangling references or leaks.</p>
<h4>Sequence diagram</h4>
<p>Lifelines (vertical) + messages (horizontal arrows) down the page — the right tool for a call flow like an ATM withdrawal, where a class diagram cannot show <em>order</em>.</p>
<div class="callout callout-tip"><span class="callout-tag">HABIT</span>Draw the class diagram <em>before</em> coding in the interview. It is your plan and your communication artifact — and the interviewer grades it.</div>
`
      },
      {
        id: 'P1-11',
        num: 'P1-11',
        title: "Object Modeling End-to-End",
        time: 7,
        html: `
<h4>The repeatable process — run it every time</h4>
<ol>
<li><strong>Requirements</strong> — list features; ask what is in scope.</li>
<li><strong>Entities</strong> — nouns → candidate classes.</li>
<li><strong>Responsibilities</strong> — verbs → methods; assign each to its Information Expert (P1-09).</li>
<li><strong>Relationships</strong> — draw composition/aggregation/association; mind lifecycles (P1-10).</li>
<li><strong>Interfaces</strong> — extract an abstraction at every expected change point (P1-06).</li>
<li><strong>Validate</strong> — walk three "what if we add X?" scenarios; each should touch ~one class.</li>
</ol>
<h4>Your review criteria, always</h4>
<p><strong>Extensibility</strong> (add a feature in one place), <strong>maintainability</strong> (a newcomer can read it), <strong>testability</strong> (each unit testable with fakes, P1-07). If a design fails any of the three, it fails the round.</p>
<div class="callout callout-tip"><span class="callout-tag">GATE</span>G2 lives here: model Snakes & Ladders and Chess fully (diagram + code) before opening the solutions file. Attempt-before-peeking is the single most valuable interview habit.</div>
`
      },
      {
        id: 'P1-12',
        num: 'P1-12',
        title: "C++ Specifics for LLD",
        time: 10,
        html: `
<h4>Interview C++ that reviewers won't flag</h4>
<p>Use the modern, safe subset. Flashy templates and raw pointers read as risk; RAII and value semantics read as "would merge".</p>
<h4>The essentials</h4>
<ul>
<li><strong>RAII</strong> — acquire in the constructor, release in the destructor. No manual <code>new/delete</code>.</li>
<li><strong>Smart pointers</strong> — <code>unique_ptr</code> for ownership, <code>shared_ptr</code> only for genuinely shared lifetimes, raw pointers only as non-owning observers.</li>
<li><strong>Rule of 0</strong> — if you do not manage a resource, define no special members (no destructor/copy/move at all).</li>
<li><strong>const correctness</strong> — mark read-only methods <code>const</code>; pass big objects by <code>const&amp;amp;</code>.</li>
<li><strong>Value semantics</strong> — prefer values, <code>std::optional</code>, and <code>std::variant</code> over pointer-based "maybe".</li>
<li><strong>enum class</strong> — scoped, typed enums instead of magic ints.</li>
<li><strong>Containers</strong> — <code>std::unordered_map</code> for key→value (write a hash for custom keys), <code>std::map</code> when you need order.</li>
</ul>
<h4>A polymorphic interface, done right</h4>
<pre>struct IPayment { virtual void pay(int cents) = 0; virtual ~IPayment() = default; };
struct CardPayment : IPayment { void pay(int cents) override { /* ... */ } };

class Checkout {
  std::unique_ptr&lt;IPayment&gt; payment;   // ownership, not a raw pointer
public:
  explicit Checkout(std::unique_ptr&lt;IPayment&gt; p) : payment(std::move(p)) {}
  void run(int cents) { payment-&gt;pay(cents); }
};</pre>
<p>Note: interface + constructor injection + smart-pointer ownership — P1-06 and P1-07 in one ten-line example.</p>
`
      },
    ],
  },
  {
    id: 'm2a',
    track: 'phase2',
    title: "Design Patterns I \u2014 Creational & Structural",
    icon: '2A',
    topics: [
      {
        id: 'P2-01',
        num: 'P2-01',
        title: "Factory Method",
        time: 11,
        html: `<h4>1 · The problem</h4><p>Your client needs a <code>Vehicle</code>, but it must not know whether it is getting a <code>Car</code> or a <code>Bike</code> — the choice depends on runtime input, and more types will be added later.</p>
<h4>2 · The naive solution</h4><p>At every place you need a vehicle, write <code>if (type == &quot;car&quot;) return new Car(); else if (type == &quot;bike&quot;) ...</code>.</p>
<h4>3 · Why it becomes problematic</h4><p>Every new type forces you to edit <em>every</em> creation site; the selection logic is duplicated N times and inevitably drifts out of sync.</p>
<h4>4 · The pattern</h4><p>Define a factory interface with one method, <code>create()</code>. Subclasses decide which product to build. Callers depend on the factory, never on the concrete product.</p>
<h4>5 · C++ implementation</h4><pre>struct Vehicle { virtual void drive() = 0; virtual ~Vehicle() = default; };
struct Car  : Vehicle { void drive() override { /* ... */ } };
struct Bike : Vehicle { void drive() override { /* ... */ } };

struct VehicleFactory { virtual std::unique_ptr&lt;Vehicle&gt; create() = 0; };
struct CarFactory : VehicleFactory {
  std::unique_ptr&lt;Vehicle&gt; create() override { return std::make_unique&lt;Car&gt;(); }
};</pre>
<h4>6 · Why the pattern helps</h4><p>Creation is centralized behind one method, so adding a type means adding one factory, and callers never change.</p>
<h4>7 · Tradeoffs</h4><p>+ decouples creation from use; − one extra class per product; often overkill for a single product.</p>
<h4>8 · When NOT to use it</h4><p>When there is only one concrete product, or the type is known at compile time — then a template or direct construction is simpler.</p>
<h4>9 · Interview question</h4><p>"How would you add a third vehicle type without touching existing code?" — the answer is a new factory subclass, and the test is whether you instinctively isolated creation.</p>`
      },
      {
        id: 'P2-02',
        num: 'P2-02',
        title: "Abstract Factory",
        time: 11,
        html: `<h4>1 · The problem</h4><p>You must create <em>families</em> of related objects that must be used together — e.g. a GUI toolkit where a Windows button must pair with a Windows checkbox, or payment objects that must all come from the same provider.</p>
<h4>2 · The naive solution</h4><p>Instantiate each member individually wherever it is needed.</p>
<h4>3 · Why it becomes problematic</h4><p>Nothing stops you from pairing a Windows button with a Mac checkbox — incompatible objects, and the mixing is invisible until runtime.</p>
<h4>4 · The pattern</h4><p>An interface with one factory method <em>per family member</em>. A concrete factory produces a consistent family; the client never mixes families.</p>
<h4>5 · C++ implementation</h4><pre>struct Button   { virtual void render() = 0; };
struct Checkbox { virtual void render() = 0; };
struct WinButton : Button { void render() override {} };
struct WinCheck  : Checkbox { void render() override {} };

struct GUIFactory {
  virtual std::unique_ptr&lt;Button&gt;   makeButton()   = 0;
  virtual std::unique_ptr&lt;Checkbox&gt; makeCheckbox() = 0;
};
struct WinFactory : GUIFactory {
  std::unique_ptr&lt;Button&gt;   makeButton()   override { return std::make_unique&lt;WinButton&gt;(); }
  std::unique_ptr&lt;Checkbox&gt; makeCheckbox() override { return std::make_unique&lt;WinCheck&gt;(); }
};</pre>
<h4>6 · Why the pattern helps</h4><p>Family consistency is guaranteed by construction — you cannot accidentally mix platforms.</p>
<h4>7 · Tradeoffs</h4><p>+ guarantees consistency, isolates platform code; − adding a new <em>product type</em> means editing every factory (it trades OCP for product kinds).</p>
<h4>8 · When NOT to use it</h4><p>When no families exist — Factory Method or Builder are then simpler and sufficient.</p>
<h4>9 · Interview question</h4><p>"What breaks when you add a third widget type?" — every concrete factory must implement it. That is the honest cost of Abstract Factory.</p>`
      },
      {
        id: 'P2-03',
        num: 'P2-03',
        title: "Builder",
        time: 10,
        html: `<h4>1 · The problem</h4><p>An object has many parts, some optional, some required — a pizza with size, cheese, pepperoni; a request with a dozen parameters.</p>
<h4>2 · The naive solution</h4><p>Telescoping constructors (one per combination) or an object you <code>new</code> and then configure with setters.</p>
<h4>3 · Why it becomes problematic</h4><p>Call sites become unreadable <code>Pizza(&quot;large&quot;, true, false, ...)</code>, and the settable version can exist half-built with no validation.</p>
<h4>4 · The pattern</h4><p>A builder accumulates parts, validates, then produces the finished object. The object is immutable; the builder is mutable.</p>
<h4>5 · C++ implementation</h4><pre>struct Pizza { std::string size; bool cheese = false, pepperoni = false; };
class PizzaBuilder {
  Pizza p;
public:
  PizzaBuilder&amp; size(std::string s){ p.size = std::move(s); return *this; }
  PizzaBuilder&amp; addCheese(){ p.cheese = true; return *this; }
  PizzaBuilder&amp; addPepperoni(){ p.pepperoni = true; return *this; }
  Pizza build(){ if(p.size.empty()) throw std::runtime_error(&quot;size required&quot;); return p; }
};
// Pizza p = PizzaBuilder{}.size(&quot;large&quot;).addCheese().build();</pre>
<h4>6 · Why the pattern helps</h4><p>Readable call sites, validation in exactly one place (build), and the result cannot be half-configured.</p>
<h4>7 · Tradeoffs</h4><p>+ readable, validated, immutable result; − more code for simple objects.</p>
<h4>8 · When NOT to use it</h4><p>For 2–3 simple fields (use the constructor), or when you need the object usable <em>while</em> partially built — a builder's whole point is that it isn't.</p>
<h4>9 · Interview question</h4><p>"Why not just use setters?" — setters allow invalid intermediate states; the builder makes invalid states unrepresentable.</p>`
      },
      {
        id: 'P2-04',
        num: 'P2-04',
        title: "Singleton",
        time: 9,
        html: `<h4>1 · The problem</h4><p>A resource must have exactly one instance — configuration, a logger, a connection manager. Two instances would be semantically wrong (or corrupting).</p>
<h4>2 · The naive solution</h4><p>A global variable, or <code>new</code> in many places.</p>
<h4>3 · Why it becomes problematic</h4><p>Globals have uncontrolled initialization order and lifetime; <code>new</code>-everywhere can accidentally create several instances that disagree with each other.</p>
<h4>4 · The pattern</h4><p>A class with a private constructor and a static accessor returning the single instance (created lazily, exactly once).</p>
<h4>5 · C++ implementation</h4><pre>class Config {
  Config() = default;
public:
  Config(const Config&amp;) = delete;
  Config&amp; operator=(const Config&amp;) = delete;
  static Config&amp; instance(){ static Config c; return c; } // Meyers singleton, thread-safe
};</pre>
<h4>6 · Why the pattern helps</h4><p>Uniqueness is enforced by the type system; initialization is lazy and thread-safe.</p>
<h4>7 · Tradeoffs</h4><p>+ guaranteed uniqueness, lazy init; − <strong>hidden global state</strong>: it couples everything to one object and destroys testability (you cannot inject a fake).</p>
<h4>8 · When NOT to use it</h4><p><strong>Almost always.</strong> Prefer dependency injection (P1-07). Use Singleton only when multiple instances are <em>semantically</em> wrong — a hardware device handle. Say exactly this in interviews.</p>
<h4>9 · Interview question</h4><p>"Why is a Singleton hard to unit-test?" — because the dependency is hidden; the test cannot substitute a fake. That admission is the senior answer.</p>`
      },
      {
        id: 'P2-05',
        num: 'P2-05',
        title: "Adapter",
        time: 9,
        html: `<h4>1 · The problem</h4><p>A class you need has an incompatible interface — a third-party library, a legacy module, or a service you must not depend on directly.</p>
<h4>2 · The naive solution</h4><p>Rewrite your client to the foreign interface.</p>
<h4>3 · Why it becomes problematic</h4><p>Your whole codebase becomes coupled to a library you do not control; swapping it later means touching every call site.</p>
<h4>4 · The pattern</h4><p>A wrapper that <em>translates</em>: it implements the interface your code expects and delegates to the adaptee's.</p>
<h4>5 · C++ implementation</h4><pre>struct IXmlLogger { virtual void log(const std::string&amp; xml) = 0; };
struct JsonWriter { void write(const std::string&amp; json) { /* ... */ } };

struct JsonWriterAdapter : IXmlLogger {
  JsonWriter&amp; w;
  void log(const std::string&amp; xml) override { w.write(toJson(xml)); }
};</pre>
<h4>6 · Why the pattern helps</h4><p>The foreign interface is isolated in one place; the rest of the code sees only the clean contract.</p>
<h4>7 · Tradeoffs</h4><p>+ isolates change, enables swapping; − one more layer; the adapter must only <em>translate</em> — if it grows business logic it has become something else.</p>
<h4>8 · When NOT to use it</h4><p>When you can change one side's interface directly, or the adaptation is a one-line call — then just call it.</p>
<h4>9 · Interview question</h4><p>"The library ships a v2 with a new API — what changes?" — only the adapter. That is the point.</p>`
      },
      {
        id: 'P2-06',
        num: 'P2-06',
        title: "Decorator",
        time: 11,
        html: `<h4>1 · The problem</h4><p>Objects need optional behaviors stacked at runtime — a coffee can have milk, mocha, an extra shot, in any combination. Enumerating subclasses explodes (2ᴺ combinations).</p>
<h4>2 · The naive solution</h4><p>One subclass per combination: <code>MilkMochaEspresso</code>, <code>MilkEspresso</code>, ...</p>
<h4>3 · Why it becomes problematic</h4><p>Combinatorial explosion: every new topping multiplies the class count, and the hierarchy is unmaintainable.</p>
<h4>4 · The pattern</h4><p>Wrappers that share the wrapped object's interface and add behavior around a delegation call. Decorators nest: each adds its bit, then calls the next.</p>
<h4>5 · C++ implementation</h4><pre>struct Beverage { virtual int cost() const = 0; virtual ~Beverage() = default; };
struct Espresso : Beverage { int cost() const override { return 100; } };

struct AddOn : Beverage {           // decorator base
  std::unique_ptr&lt;Beverage&gt; inner;
  int cost() const override { return inner-&gt;cost() + extra(); }
  virtual int extra() const = 0;
};
struct Milk  : AddOn { int extra() const override { return 20; } };
struct Mocha : AddOn { int extra() const override { return 30; } };

// new Milk(new Mocha(new Espresso()))  → cost 150</pre>
<h4>6 · Why the pattern helps</h4><p>Combinations become composition instead of enumeration — N toppings are N classes, not 2ᴺ.</p>
<h4>7 · Tradeoffs</h4><p>+ open/closed, mix-and-match at runtime; − many small objects, order can matter and surprise, harder to debug a deep stack.</p>
<h4>8 · When NOT to use it</h4><p>When behavior is static per type (just subclass), or you only need 2–3 fixed combinations.</p>
<h4>9 · Interview question</h4><p>"How is a Decorator different from inheritance?" — it adds behavior <em>per instance at runtime</em>; inheritance fixes behavior per class.</p>`
      },
      {
        id: 'P2-07',
        num: 'P2-07',
        title: "Facade",
        time: 9,
        html: `<h4>1 · The problem</h4><p>A client needs a <em>simple</em> entry point to a complex subsystem — compiling code, charging a payment, rendering a PDF — where the right call order spans many classes.</p>
<h4>2 · The naive solution</h4><p>The client calls the eight subsystem classes in the right order, everywhere it needs the operation.</p>
<h4>3 · Why it becomes problematic</h4><p>The sequence knowledge is duplicated across every client; clients are over-coupled to subsystem internals that keep changing.</p>
<h4>4 · The pattern</h4><p>One class exposing a simplified interface that orchestrates the subsystem. Clients call the facade; the facade knows the order.</p>
<h4>5 · C++ implementation</h4><pre>struct PaymentFacade {
  AuthService a; RiskEngine r; Ledger l; Notifier n;
  bool charge(int user, int amt){
    if(!a.auth(user)) return false;
    if(r.score(user, amt) &lt; 50) return false;
    l.debit(user, amt);
    n.receipt(user, amt);
    return true;
  }
};</pre>
<h4>6 · Why the pattern helps</h4><p>One discoverable entry point; subsystem churn stops propagating to clients.</p>
<h4>7 · Tradeoffs</h4><p>+ simple, decoupled clients; − the facade can grow into a god object; power users lose fine-grained control.</p>
<h4>8 · When NOT to use it</h4><p>When the subsystem is already simple — a facade then adds a layer with no benefit.</p>
<h4>9 · Interview question</h4><p>"Where does the facade end and the subsystem begin?" — a facade orchestrates; it must not accumulate business logic of its own.</p>`
      },
      {
        id: 'P2-08',
        num: 'P2-08',
        title: "Proxy",
        time: 9,
        html: `<h4>1 · The problem</h4><p>You need to <em>control access</em> to an object — load it lazily, cache it, check permissions, or reach it over the network.</p>
<h4>2 · The naive solution</h4><p>Scatter the extra logic (cache check, permission check) at every call site.</p>
<h4>3 · Why it becomes problematic</h4><p>Duplication, and the control logic can be bypassed by any caller who forgets it.</p>
<h4>4 · The pattern</h4><p>A surrogate with the same interface as the real object, which adds behavior before/after delegating. The client cannot tell the difference.</p>
<h4>5 · C++ implementation</h4><pre>struct Image { virtual void draw() = 0; };
struct RealImage : Image { void draw() override { /* load from disk, draw */ } };

struct LazyImageProxy : Image {
  std::unique_ptr&lt;RealImage&gt; real;
  void draw() override { if(!real) real = std::make_unique&lt;RealImage&gt;(); real-&gt;draw(); }
};</pre>
<h4>6 · Why the pattern helps</h4><p>Access control is centralized and transparent — the client's code never changes.</p>
<h4>7 · Tradeoffs</h4><p>+ transparent, centralizes control (laziness/caching/auth); − an extra indirection, and it can hide real cost (a "cheap" proxy that secretly loads a big image).</p>
<h4>8 · When NOT to use it</h4><p>When there is no access to control (call directly), or when the proxy starts adding <em>features</em> — that is a Decorator, not a Proxy.</p>
<h4>9 · Interview question</h4><p>"What is the difference between a Proxy and a Decorator?" — Proxy manages <em>access</em>; Decorator adds <em>behavior</em>. Intention is the difference.</p>`
      },
    ],
  },
  {
    id: 'm2b',
    track: 'phase2',
    title: "Design Patterns II \u2014 Behavioral",
    icon: '2B',
    topics: [
      {
        id: 'P2-09',
        num: 'P2-09',
        title: "Strategy",
        time: 11,
        html: `<h4>1 · The problem</h4><p>An algorithm varies and must be chosen at runtime — routing (fastest vs shortest), payment (card vs UPI vs wallet), dispatch (nearest vs highest-rated).</p>
<h4>2 · The naive solution</h4><p>A <code>switch</code>/<code>if-else</code> on a mode flag inside the host class.</p>
<h4>3 · Why it becomes problematic</h4><p>Every new algorithm edits the host class (violating Open/Closed); the host grows fat with every variant; testing one variant drags in the others.</p>
<h4>4 · The pattern</h4><p>Encapsulate each algorithm in its own class behind a common interface; the host holds a reference and delegates. Swap the strategy to change behavior.</p>
<h4>5 · C++ implementation</h4><pre>struct RouteStrategy { virtual std::vector&lt;Point&gt; route(Point a, Point b) = 0; };
struct FastestRoute  : RouteStrategy { std::vector&lt;Point&gt; route(Point a, Point b) override { /* ... */ return {}; } };
struct ShortestRoute : RouteStrategy { std::vector&lt;Point&gt; route(Point a, Point b) override { /* ... */ return {}; } };

class Navigator {
  std::unique_ptr&lt;RouteStrategy&gt; s;
public:
  void set(std::unique_ptr&lt;RouteStrategy&gt; ns){ s = std::move(ns); }
  std::vector&lt;Point&gt; go(Point a, Point b){ return s-&gt;route(a, b); }
};</pre>
<h4>6 · Why the pattern helps</h4><p>New algorithms are new classes — the host never changes; each strategy is unit-testable in isolation; behavior swaps at runtime.</p>
<h4>7 · Tradeoffs</h4><p>+ OCP, testable, swappable; − more classes; the client must know the strategies exist.</p>
<h4>8 · When NOT to use it</h4><p>When there are exactly 2 algorithms that never change (write both functions), or behavior varies by <em>type</em> rather than <em>context</em> (then consider State or Template Method).</p>
<h4>9 · Interview question</h4><p>"You are adding a third routing mode — what changes?" — one new class. If your answer touches Navigator, the design failed the test.</p>`
      },
      {
        id: 'P2-10',
        num: 'P2-10',
        title: "Observer",
        time: 10,
        html: `<h4>1 · The problem</h4><p>When object A changes, several objects must be notified — but A must not know their concrete types, and the set of listeners changes at runtime.</p>
<h4>2 · The naive solution</h4><p>A holds concrete pointers to B, C, D and calls them directly.</p>
<h4>3 · Why it becomes problematic</h4><p>Adding a listener edits A; A is coupled to every listener; there is no way to subscribe or unsubscribe dynamically.</p>
<h4>4 · The pattern</h4><p>A subject keeps a list of observers behind a common interface and notifies each on change. Observers subscribe and unsubscribe themselves.</p>
<h4>5 · C++ implementation</h4><pre>struct Observer { virtual void update(const std::string&amp; event) = 0; };
struct Subject {
  std::vector&lt;Observer*&gt; obs;   // use std::weak_ptr in real code
  void attach(Observer* o){ obs.push_back(o); }
  void notify(const std::string&amp; e){ for(auto* o : obs) o-&gt;update(e); }
};
struct EmailAlert : Observer { void update(const std::string&amp; e) override { /* send email */ } };</pre>
<h4>6 · Why the pattern helps</h4><p>Loose coupling: the subject knows only the Observer interface; listeners attach and detach without touching the subject.</p>
<h4>7 · Tradeoffs</h4><p>+ loose coupling, dynamic subscriptions; − <strong>notification order is undefined</strong>; updates can cascade or re-enter; dangling observers are a real bug (hence weak_ptr).</p>
<h4>8 · When NOT to use it</h4><p>When there is a single listener (just call it), or when notifications must be strictly ordered (use an explicit pipeline/queue).</p>
<h4>9 · Interview question</h4><p>"What happens if an observer throws or re-enters the subject?" — that is the classic bug this pattern does not protect you from; name the mitigation (guard, queue).</p>`
      },
      {
        id: 'P2-11',
        num: 'P2-11',
        title: "Command",
        time: 10,
        html: `<h4>1 · The problem</h4><p>You need to parameterize <em>actions</em> as objects: undo/redo, a queue of tasks, macro recording, or an audit log of what was done.</p>
<h4>2 · The naive solution</h4><p>Every button calls its action directly; "undo" means reverse-engineering each call by hand.</p>
<h4>3 · Why it becomes problematic</h4><p>There is no object representing an action, so you cannot store, queue, log, or reverse it.</p>
<h4>4 · The pattern</h4><p>Wrap "an action + its parameters" in an object with <code>execute()</code> (and <code>undo()</code>). A history stack of commands gives you undo for free.</p>
<h4>5 · C++ implementation</h4><pre>struct Command { virtual void execute() = 0; virtual void undo() = 0; };
struct TextEditor { std::string text; };
struct InsertCommand : Command {
  TextEditor&amp; e; std::string s; size_t pos;
  void execute() override { e.text.insert(pos, s); }
  void undo()    override { e.text.erase(pos, s.size()); }
};
// std::vector&lt;std::unique_ptr&lt;Command&gt;&gt; history;  // undo stack</pre>
<h4>6 · Why the pattern helps</h4><p>Actions become first-class objects you can store, defer, replay, and reverse.</p>
<h4>7 · Tradeoffs</h4><p>+ undo/redo, task queues, logging/audit, macro composition; − a class per operation (verbose), and each command must capture the state it needs to undo (memory).</p>
<h4>8 · When NOT to use it</h4><p>When actions are simple, irreversible, and never queued — a plain method call is then the honest choice.</p>
<h4>9 · Interview question</h4><p>"How would you implement redo?" — two stacks (undo + redo), or a cursor into one history; the point is that Command made it possible at all.</p>`
      },
      {
        id: 'P2-12',
        num: 'P2-12',
        title: "State",
        time: 11,
        html: `<h4>1 · The problem</h4><p>An object's behavior depends on its state, and states change by rules — an elevator (idle/moving/doors), an order lifecycle, an ATM, a vending machine.</p>
<h4>2 · The naive solution</h4><p>A tangle of <code>if (state == IDLE) ... else if (state == MOVING) ...</code> with transitions scattered across methods.</p>
<h4>3 · Why it becomes problematic</h4><p>Transition rules spread over every method; adding a state means editing every method; illegal transitions are easy to introduce and hard to find.</p>
<h4>4 · The pattern</h4><p>Each state is a class; the context delegates to the current state, which performs the action and may switch the context to another state. The state machine lives in the transitions, in one place.</p>
<h4>5 · C++ implementation</h4><pre>struct State { virtual void insertCoin(Context&amp;) = 0; virtual void dispense(Context&amp;) = 0; };
struct NoCoinState : State {
  void insertCoin(Context&amp; c) override { c.state = make_has_coin(); }  // transition
  void dispense(Context&amp;)  override { /* error: insert coin first */ }
};
struct Context { std::unique_ptr&lt;State&gt; state; };
// Context c; c.insertCoin();  // NoCoinState -&gt; HasCoinState</pre>
<h4>6 · Why the pattern helps</h4><p>The transition rules live in exactly one place (the states), new states are new classes (OCP), and illegal transitions become impossible to express.</p>
<h4>7 · Tradeoffs</h4><p>+ explicit, single source of truth for transitions; OCP for new states; − many small classes; overkill for two states.</p>
<h4>8 · When NOT to use it</h4><p>When the state rarely changes or has no behavior attached — then an <code>enum</code> field is the honest, simpler choice.</p>
<h4>9 · Interview question</h4><p>"Where do the transition rules live?" — in the states, not in a big if-else. That single answer usually decides the round.</p>`
      },
      {
        id: 'P2-13',
        num: 'P2-13',
        title: "Template Method",
        time: 9,
        html: `<h4>1 · The problem</h4><p>An algorithm's skeleton is fixed, but some steps vary by subclass — a report generator always collects→formats→exports, but each report formats differently.</p>
<h4>2 · The naive solution</h4><p>Copy the skeleton into every subclass.</p>
<h4>3 · Why it becomes problematic</h4><p>The skeleton is duplicated; changing its order means editing every copy — and copies drift.</p>
<h4>4 · The pattern</h4><p>The base class defines the skeleton as a non-overridable method that calls overridable step methods. Subclasses fill in the steps, not the order.</p>
<h4>5 · C++ implementation</h4><pre>struct ReportGenerator {
  void generate(){ collect(); format(); export_(); }  // skeleton: fixed order
  virtual void collect() = 0;   // steps vary
  virtual void format()  = 0;
  virtual void export_() = 0;
};
struct PdfReport : ReportGenerator { void collect() override {} void format() override {} void export_() override {} };</pre>
<h4>6 · Why the pattern helps</h4><p>The skeleton is enforced once; variation is isolated to well-defined hooks; the order cannot be broken by a subclass.</p>
<h4>7 · Tradeoffs</h4><p>+ skeleton enforced once, hooks isolated; − inheritance-based (less flexible than Strategy, which composes); the "Hollywood principle" (don't call us, we'll call you) can surprise readers.</p>
<h4>8 · When NOT to use it</h4><p>When the algorithm varies in <em>structure</em> (order/loops), not just in steps — use Strategy; or when you need runtime swapping.</p>
<h4>9 · Interview question</h4><p>"Template Method vs Strategy?" — Template Method varies <em>steps</em> via inheritance; Strategy varies the <em>whole algorithm</em> via composition. State the tradeoff.</p>`
      },
      {
        id: 'P2-14',
        num: 'P2-14',
        title: "Chain of Responsibility",
        time: 10,
        html: `<h4>1 · The problem</h4><p>A request should be handled by <em>one of several</em> handlers, decided at runtime — middleware, approval chains, logging levels. The handler set and order should be changeable.</p>
<h4>2 · The naive solution</h4><p>One big <code>if-else</code> over all handlers.</p>
<h4>3 · Why it becomes problematic</h4><p>Order and handler set are hard-coded; you cannot reorder or add handlers dynamically, and the block grows without bound.</p>
<h4>4 · The pattern</h4><p>Each handler holds a reference to the <em>next</em>; it either handles the request or passes it along. The chain is assembled at runtime.</p>
<h4>5 · C++ implementation</h4><pre>struct Request { bool authenticated = false; };
struct Handler {
  std::unique_ptr&lt;Handler&gt; next;
  virtual void handle(Request&amp; r){
    if(next) next-&gt;handle(r);
    else throw std::runtime_error(&quot;unhandled&quot;);
  }
};
struct AuthHandler : Handler {
  void handle(Request&amp; r) override { if(!r.auth) throw std::runtime_error(&quot;unauthorized&quot;); Handler::handle(r); }
};
struct ThrottleHandler : Handler { void handle(Request&amp; r) override { /* limit; then */ Handler::handle(r); } };</pre>
<h4>6 · Why the pattern helps</h4><p>Order and membership are dynamic; each handler keeps a single responsibility; chains compose like middleware.</p>
<h4>7 · Tradeoffs</h4><p>+ dynamic order/composition, SRP per handler; − a request can fall off the end unhandled; tracing a request through a long chain is harder.</p>
<h4>8 · When NOT to use it</h4><p>When the order is fixed and handling is guaranteed (just call in sequence), or when <em>all</em> handlers must run (that is a pipeline/Decorator, not a chain).</p>
<h4>9 · Interview question</h4><p>"What happens if no handler accepts the request?" — the honest answer is it falls off the end; you must decide and say so (throw, default, 404).</p>`
      },
      {
        id: 'P2-15',
        num: 'P2-15',
        title: "Pattern-Selection Cheat Sheet",
        time: 4,
        html: `<p>Given a clue in the problem, here's the pattern to reach for.</p><table><tr><th>Clue in the problem</th><th>Pattern</th></tr><tr><td>"…without hard-coding which class to create"</td><td>Factory Method / Abstract Factory</td></tr><tr><td>"many optional parameters"</td><td>Builder</td></tr><tr><td>"exactly one instance"</td><td>Singleton (then justify, or inject)</td></tr><tr><td>"incompatible interface to a library"</td><td>Adapter</td></tr><tr><td>"add behavior at runtime, stackable"</td><td>Decorator</td></tr><tr><td>"simple API over a complex subsystem"</td><td>Facade</td></tr><tr><td>"algorithm varies at runtime"</td><td>Strategy</td></tr><tr><td>"notify many objects on a change"</td><td>Observer</td></tr><tr><td>"undo / queue / audit actions"</td><td>Command</td></tr><tr><td>"behavior depends on state, transitions"</td><td>State</td></tr><tr><td>"fixed skeleton, varying steps"</td><td>Template Method</td></tr><tr><td>"one of several handlers, dynamic order"</td><td>Chain of Responsibility</td></tr><tr><td>"control access / lazy / remote"</td><td>Proxy</td></tr></table><div class="callout callout-tip"><span class="callout-tag">TIP</span>90% of LLD problems reduce to five patterns: Strategy, State, Command, Observer, Factory. The difficulty is never the pattern — it's finding the right entities and the right state machine.</div>`
      },
    ],
  },
  {
    id: 'm2c',
    track: 'phase2',
    title: "LLD Case Studies I",
    icon: '2C',
    topics: [
      {
        id: 'P2-16',
        num: 'P2-16',
        title: "Parking Lot",
        time: 18,
        html: `
<h4>1 · Requirements</h4>
<ul><li>Multiple floors and spots; vehicle types (bike/car/truck); park/unpark; find a free spot; pay by duration on exit (payment must be pluggable).</li></ul>
<h4>2 · Actors</h4>
<p>Driver, entry gate, exit gate, payment system, (optionally) an attendant/operator.</p>
<h4>3 · Core entities & responsibilities</h4>
<ul>
<li><strong>ParkingLot</strong> — orchestrates park/unpark; owns floors.</li>
<li><strong>Floor</strong> — owns spots; finds a free spot of a type.</li>
<li><strong>Spot</strong> — knows its type and occupied state; subtypes <code>BikeSpot/CarSpot/TruckSpot</code>.</li>
<li><strong>Vehicle</strong> — has a type + plate.</li>
<li><strong>Ticket</strong> — records spot + vehicle + entry time.</li>
<li><strong>PaymentStrategy</strong> — computes the fee from entry/exit times.</li>
</ul>
<h4>4 · Relationships (and why)</h4>
<p><code>ParkingLot ◆ Floor ◆ Spot</code> is <em>composition</em> — a floor has no life outside its lot; a spot none outside its floor (lifecycle-bound, P1-05). <code>Vehicle ◇ Ticket</code> is association — the ticket references the vehicle but neither owns the other.</p>
<h4>5 · Class diagram</h4>
<pre>ParkingLot ──◆ Floor[1..*] ──◆ Spot[1..*]   (abstract)
     │                              │
     ├──◆ Ticket (spot, vehicle, entryTime)   &lt;|-- BikeSpot, CarSpot, TruckSpot
     └──◇ PaymentStrategy &lt;|-- HourlyPayment, FlatPayment
Vehicle ──◇ Ticket</pre>
<h4>6 · Interfaces</h4>
<p><code>IVehicle { VehicleType type(); }</code> · <code>IPaymentStrategy { int fee(entry, exit); }</code> — the two hotspots (new vehicle types, new pricing) sit behind abstractions.</p>
<h4>7 · Enums</h4>
<p><code>VehicleType { BIKE, CAR, TRUCK }</code> · <code>SpotStatus { FREE, OCCUPIED }</code>.</p>
<h4>8 · Design patterns</h4>
<p><strong>Strategy</strong> (payment — the fee varies at runtime), <strong>Factory</strong> (create <code>Spot</code>/<code>Vehicle</code> by type), optionally Singleton for the lot (prefer injection, P1-07).</p>
<h4>9 · SOLID analysis</h4>
<p>OCP — adding <code>ElectricSpot</code> needs no change to <code>Floor</code> if it queries by capability, and a new pricing rule is a new strategy. SRP — fee calculation is its own strategy, not <code>Ticket</code>'s job.</p>
<h4>10 · Key implementation</h4>
<pre>int ParkingLot::park(Vehicle v) {
  for (auto&amp; f : floors)
    if (Spot* s = f.findFree(v.type()))
      return ticket(s, v);   // allocate + record
  throw NoSpace();
}
// findFree: keep a free-list per (floor, type) — a min-heap or
// counter — so &quot;nearest free spot&quot; is O(1), not a scan.</pre>
<h4>11 · Extensibility</h4>
<p>EV charging spots; reservations; per-floor limits; VIP parking; per-vehicle-type fees — each should touch ~one class.</p>
<h4>12 · Concurrency</h4>
<p>Two drivers grabbing the last spot: <code>findFree</code> must be atomic (lock the spot, or CAS its status) — the same lost-update problem as P4-04, one line in an LLD answer.</p>
<h4>13 · Interview follow-ups</h4>
<ul>
<li>"How do you find the nearest free spot in O(1)?" (per-floor-per-type heap).</li>
<li>"Add a flat-rate option for VIPs" — where does it go? (a new strategy).</li>
<li>"What happens when the lot is full at the gate?" (reject + a waiting queue).</li>
</ul>
`
      },
      {
        id: 'P2-17',
        num: 'P2-17',
        title: "Elevator System",
        time: 19,
        html: `
<h4>1 · Requirements</h4>
<ul><li>N elevators in a building; internal + external requests; pick the best car; stop at floors; open/close doors; capacity.</li></ul>
<h4>2 · Actors</h4>
<p>Riders (press buttons), the elevator system (dispatches), each car (moves + serves).</p>
<h4>3 · Core entities & responsibilities</h4>
<ul>
<li><strong>ElevatorCar</strong> — current floor, direction, state; serves its own request queue.</li>
<li><strong>Dispatcher / ElevatorController</strong> — assigns external requests to the best car (a policy).</li>
<li><strong>Door</strong> — open/close, with a safety timeout.</li>
<li><strong>Button</strong> (internal per car; external per floor + direction).</li>
</ul>
<h4>4 · The state machine (the heart of this design)</h4>
<pre>IDLE ──(internal/external request)──▶ MOVING_UP / MOVING_DOWN
MOVING ──(arrive at requested floor)──▶ DOOR_OPEN
DOOR_OPEN ──(timeout / no more stops)──▶ IDLE</pre>
<p>Only valid transitions are expressible — a car cannot "open doors while moving", because the states do not permit it (State pattern, P2-12).</p>
<h4>5 · Class diagram</h4>
<pre>ElevatorController ──◆ ElevatorCar[1..*]
ElevatorCar ──◆ Door ──◇ internalButtons[*]
Floor ──◇ ExternalButton ──▶ ElevatorController
ElevatorCar.state : Idle | MovingUp | MovingDown | DoorOpen</pre>
<h4>6 · Interfaces</h4>
<p><code>IElevatorControl { request(floor, dir); step(); }</code> · <code>IDispatchStrategy { ElevatorCar* pick(cars, floor, dir); }</code>.</p>
<h4>7 · Design patterns</h4>
<p><strong>State</strong> (car lifecycle), <strong>Strategy</strong> (dispatch: simple nearest vs SCAN/LOOK that also considers direction and stops), <strong>Command</strong> (requests as queueable objects → easy to prioritize, e.g. fire alarm).</p>
<h4>8 · SOLID analysis</h4>
<p>OCP — a new dispatch policy is a new strategy, zero changes to cars. SRP — <code>Door</code> does not know about floors; <code>Car</code> does not know about global dispatch.</p>
<h4>9 · Key implementation</h4>
<pre>int ElevatorCar::costTo(int floor, Dir dir) const {
  // distance + penalty for extra stops; used by the dispatcher
  return abs(floor - currentFloor) + pendingStops * STOP_COST;
}
void ElevatorCar::step() {          // one tick of the simulation
  if (dir == UP) { currentFloor++; if (isStop(currentFloor)) openDoors(); }
}</pre>
<h4>10 · Extensibility</h4>
<p>Express/lift-floor mode; maintenance state; fire-alarm override (a priority command); weight sensor; adding a dispatch algorithm.</p>
<h4>11 · Concurrency</h4>
<p>Multiple buttons pressed simultaneously — the car's request set must be thread-safe (a lock or a concurrent set); the dispatcher's "pick" must not double-assign one external request to two cars (claim atomically).</p>
<h4>12 · Interview follow-ups</h4>
<ul>
<li>"Why not let each floor call a specific car directly?" (a dispatcher centralizes policy; floors shouldn't know the fleet).</li>
<li>"How does SCAN/LOOK improve over nearest-first?" (direction-aware servicing avoids starvation).</li>
</ul>
`
      },
      {
        id: 'P2-18',
        num: 'P2-18',
        title: "ATM",
        time: 7,
        html: `<h4>Requirements</h4><ul><li>Insert card → PIN → balance → withdraw (denominations) → dispense → receipt; max/txn, max/day, insufficient funds.</li></ul><h4>Entities</h4><p>ATM, Card, Account, CashDispenser, Keypad, Screen, Printer, Transaction, BankService.</p><h4>Responsibilities</h4><p>ATM is a state machine (Idle→CardInserted→Authenticated→…); CashDispenser handles denominations; BankService is the single source of truth for balances.</p><h4>Class diagram</h4><pre>ATM ──◆ CashDispenser, Keypad, Screen, Printer
ATM ──▶ BankService
ATM.state (State pattern)</pre><h4>Design patterns</h4><p>State (ATM states), Chain of Responsibility (validation: card→PIN→balance→limit), Singleton for ATM (justify/DI).</p><h4>SOLID analysis</h4><p>SRP — dispenser doesn't know balances; DIP — ATM depends on IBankService (testable).</p><h4>Extensibility questions</h4><ul><li>Deposits; multiple currencies; fingerprint auth; mini-statement; denomination availability (greedy vs exact change).</li></ul>`
      },
      {
        id: 'P2-19',
        num: 'P2-19',
        title: "Library Management System",
        time: 7,
        html: `<h4>Requirements</h4><ul><li>Add/search books; issue/return; fines for late return; reservation; member limits; catalog search.</li></ul><h4>Entities</h4><p>Book (metadata), BookItem (physical copy), Member, Librarian, Loan, Reservation, Fine, Catalog.</p><h4>Responsibilities</h4><p>Book = metadata; BookItem = copy with status (available/issued/reserved/lost); Loan tracks due date; Catalog searches.</p><h4>Class diagram</h4><pre>Library ──◆ Catalog ──◇ Book[1..*] ──◆ BookItem[*]
Library ──◆ Member[*]
Member ──◇ Loan ──◇ BookItem
Loan ──◇ Fine</pre><h4>Design patterns</h4><p>Factory (Book by category), Strategy (fine calculation: per-day vs flat), Observer (notify on reservation availability).</p><h4>SOLID analysis</h4><p>SRP — Fine computed separately from Loan; OCP — new search criterion via an interface.</p><h4>Extensibility questions</h4><ul><li>E-books (no physical item); membership tiers; inter-library loan; renewal rules.</li></ul>`
      },
      {
        id: 'P2-20',
        num: 'P2-20',
        title: "Chess",
        time: 20,
        html: `
<h4>1 · Requirements</h4>
<ul><li>8×8 board, 6 piece types, 2 players, legal moves, check/checkmate detection, turn alternation, undo.</li></ul>
<h4>2 · Core entities & responsibilities</h4>
<ul>
<li><strong>Board</strong> — 8×8 of <code>Cell</code>; validates and applies moves; owns the position.</li>
<li><strong>Piece</strong> (abstract) — knows its own <em>geometric</em> moves; subclasses King, Queen, Rook, Bishop, Knight, Pawn.</li>
<li><strong>Move</strong> — from/to (a Command for undo).</li>
<li><strong>Game</strong> — turns, check detection, history, win state.</li>
</ul>
<h4>3 · The key design decision: where "check" lives</h4>
<p>Each <code>Piece</code> computes its <em>geometric</em> moves only — Pawn: forward 1/2, diagonal capture; Knight: the L; Rook: rays. <strong>It does not know about check.</strong> <code>Board</code> validates a move in two stages: (1) piece rules; (2) <strong>simulate the move on a copy and verify your own king is not attacked</strong>. The simulation approach gives you castling, en passant, and checkmate almost for free (checkmate = in check + no legal move).</p>
<h4>4 · Why NOT in Piece (the LSP lesson)</h4>
<p>Check depends on <em>global</em> state (all enemy pieces), not the moving piece's rules. Putting it in <code>Piece</code> would give every piece knowledge of the whole board (coupling), duplicate the logic across six classes, and break when you add a seventh piece. It would also violate LSP — a piece whose moves are legal "except when in check" is not honoring its contract.</p>
<h4>5 · Class diagram</h4>
<pre>Game ──◆ Board ──◆ Cell[64]
Cell ──◇ Piece   (Piece &lt;|-- King, Queen, Rook, Bishop, Knight, Pawn)
Game ──◆ Move[*] (history / undo stack)</pre>
<h4>6 · Interfaces & enums</h4>
<p><code>Color { WHITE, BLACK }</code> · <code>Piece::moves(Board, from) → vector&amp;lt;Pos&amp;gt;</code> (geometric only) · <code>Board::isValid(from, to)</code> (rules + no-self-check).</p>
<h4>7 · Design patterns</h4>
<p><strong>Command</strong> (each <code>Move</code> records the captured piece → undo by popping), <strong>Factory</strong> (build a position from FEN notation), <strong>Strategy</strong> (an AI move-picker later).</p>
<h4>8 · Key implementation</h4>
<pre>std::vector&lt;Pos&gt; Pawn::moves(const Board&amp; b, Pos f) const {
  std::vector&lt;Pos&gt; out; int d = color == WHITE ? 1 : -1;
  if (!b.at({f.r + d, f.c})) out.push_back({f.r + d, f.c});       // forward
  for (int dc : {-1, +1})                                         // captures
    if (auto* t = b.at({f.r + d, f.c + dc}); t &amp;&amp; t-&gt;color != color)
      out.push_back({f.r + d, f.c + dc});
  return out;
}
bool Board::isValid(Pos from, Pos to) {
  if (!piece(from)-&gt;moves(*this, from).contains(to)) return false;
  Board copy = *this; copy.apply(from, to);                        // simulate
  return !copy.kingInCheck(piece(from)-&gt;color);                    // no self-check
}</pre>
<h4>9 · SOLID analysis</h4>
<p>OCP — a new piece = one subclass, zero changes to <code>Board</code>. SRP — move legality in each <code>Piece</code>, check detection in <code>Board</code>, turn management in <code>Game</code>.</p>
<h4>10 · Extensibility</h4>
<p>Castling, en passant, promotion (the correctness traps interviewers check — say where they hook in: <code>Board</code> keeps last-move + rook/has-moved flags); undo; save/replay; timers.</p>
<h4>11 · Interview follow-ups</h4>
<ul>
<li>"Where does 'king can't move into check' live, and why not in Piece?"</li>
<li>"How would you implement undo in O(1)?" (Command stack).</li>
<li>"How do you detect checkmate efficiently?" (in check + zero legal moves).</li>
</ul>
`
      },
      {
        id: 'P2-21',
        num: 'P2-21',
        title: "Tic-Tac-Toe",
        time: 5,
        html: `<h4>Requirements</h4><ul><li>3×3, 2 players, place marks, detect win/draw, restart.</li></ul><h4>Entities</h4><p>Board, Player, Game, Mark (X/O).</p><h4>Responsibilities</h4><p>Board validates and applies moves and detects the winner; Game manages turns.</p><h4>Class diagram</h4><pre>Game ──◆ Board ──◇ Player[2]
Player ──◇ Mark</pre><h4>Design patterns</h4><p>Strategy (next-move policy: human vs bot), Factory (game setup).</p><h4>SOLID analysis</h4><p>SRP — win-check isolated in Board::winner(); OCP — N×N generalization.</p><h4>Extensibility questions</h4><ul><li>N×N board; more players; AI difficulty; undo.</li></ul>`
      },
      {
        id: 'P2-22',
        num: 'P2-22',
        title: "Snake & Ladder",
        time: 15,
        html: `
<h4>1 · Requirements</h4>
<ul><li>10×10 board, snakes and ladders, a dice, N players, win on exactly square 100. Decide the ambiguous rules yourself (say them out loud).</li></ul>
<h4>2 · Core entities & responsibilities</h4>
<ul>
<li><strong>Board</strong> — maps a position through snakes/ladders; <code>resolve(pos) → pos</code>.</li>
<li><strong>Dice</strong> (interface) — <code>roll()</code>.</li>
<li><strong>Player</strong> — id + position.</li>
<li><strong>Game</strong> — the turn loop; owns the rules.</li>
</ul>
<h4>3 · The loop (the whole game)</h4>
<pre>while (no winner):
  roll = dice.roll()
  next = player.pos + roll
  if next &gt; 100: continue          # must land exactly on 100
  player.pos = board.resolve(next) # follow snake / ladder
  if player.pos == 100: winner = player</pre>
<h4>4 · The decisions to state out loud</h4>
<ul>
<li><strong>"On a 6":</strong> pick a rule and say so (common: no extra turn — the interviewer cares that you <em>asked</em>, not which rule).</li>
<li><strong>Two players on one square:</strong> allowed (no constraint).</li>
<li><strong>A ladder landing on a snake head:</strong> define <code>resolve()</code> to apply transitions <em>once</em> (chaining risks an infinite loop if a snake↔ladder point at each other — guard with a visited set, or apply once).</li>
</ul>
<h4>5 · Design patterns & SOLID</h4>
<p><strong>Strategy</strong> — <code>Dice</code> is an interface; a "crooked dice" is a new strategy with zero changes to <code>Game</code> (the classic extensibility test). <strong>Factory</strong> — build the board from config. DIP — <code>Game</code> depends on <code>IDice</code>, not a concrete dice.</p>
<h4>6 · Key implementation</h4>
<pre>struct Dice { virtual int roll() = 0; virtual ~Dice() = default; };
struct NormalDice : Dice { int roll() override { return uniform(1, 6); } };
struct CrookedDice : Dice { int roll() override { return 6; } };   // always 6

class Game {
  std::map&lt;int,int&gt; snakes, ladders;   // head-&gt;tail, start-&gt;end
  std::unique_ptr&lt;Dice&gt; dice;          // injected (P1-07)
public:
  int resolve(int p) const {           // one transition, not a chain
    if (snakes.count(p))  return snakes.at(p);
    if (ladders.count(p)) return ladders.at(p);
    return p;
  }
  Player run() { /* the loop above */ }
};</pre>
<h4>7 · Extensibility</h4>
<p>Different dice; a board loaded from config; "minimum two players" (validate in <code>Game</code>, not <code>Player</code>); a win condition other than 100.</p>
<h4>8 · Interview follow-ups</h4>
<ul>
<li>"How would you add a 'crooked dice' without rewriting the game logic?" (a new <code>Dice</code> — if your answer touches <code>Game</code>, the design failed).</li>
<li>"Why not chain snake→ladder transitions?" (infinite-loop risk).</li>
</ul>
`
      },
    ],
  },
  {
    id: 'm2d',
    track: 'phase2',
    title: "LLD Case Studies II",
    icon: '2D',
    topics: [
      {
        id: 'P2-23',
        num: 'P2-23',
        title: "Movie Ticket Booking",
        time: 8,
        html: `<h4>Requirements</h4><ul><li>Browse cities/cinemas/shows; seat map; book seats (hold→pay→confirm); prevent double-booking; cancellations.</li></ul><h4>Entities</h4><p>City, Cinema, Hall, Show, Seat, Booking, User, PaymentService, LockService.</p><h4>Responsibilities</h4><p>Show holds the seat map; Booking is a state machine (HOLD→PAID→CONFIRMED/CANCELLED/EXPIRED); LockService prevents double-booking.</p><h4>Class diagram</h4><pre>City ──◆ Cinema[*] ──◆ Hall[*] ──◆ Show[*]
Show ──◆ Seat[*] (status: AVAILABLE/HELD/BOOKED)
User ──◇ Booking ──◇ Seat[*]
Booking ──▶ PaymentService
Booking.state (State pattern)</pre><h4>Design patterns</h4><p>State (booking lifecycle), Strategy (payment), Command (book seats → undo = release hold).</p><h4>SOLID analysis</h4><p>SRP — seat-locking separate from payment; OCP — new seat types (recliner, VIP) by subtype.</p><h4>Extensibility questions</h4><ul><li>Hold timeout (TTL); concurrent seat selection; discounts; "can't leave a single seat" adjacency; show cancellation.</li></ul>`
      },
      {
        id: 'P2-24',
        num: 'P2-24',
        title: "Food Delivery (Swiggy/Zomato)",
        time: 7,
        html: `<h4>Requirements</h4><ul><li>Restaurants & menus; place order; assign delivery partner; track status; payment; ratings.</li></ul><h4>Entities</h4><p>Restaurant, MenuItem, Order(+OrderItem), User, DeliveryPartner, Dispatcher, PaymentService, NotificationService.</p><h4>Responsibilities</h4><p>Order = state machine (PLACED→ACCEPTED→PREPARING→PICKED_UP→DELIVERED/CANCELLED); Dispatcher assigns the best available partner.</p><h4>Class diagram</h4><pre>Order ──◆ OrderItem[*] ──▶ MenuItem
Order ──▶ Restaurant, User, DeliveryPartner
Dispatcher ──▶ DeliveryPartner[*]</pre><h4>Design patterns</h4><p>State (order), Strategy (dispatch: nearest vs rating; payment), Observer (status → notifications).</p><h4>SOLID analysis</h4><p>OCP — new dispatch strategy without touching Order; SRP — rating separate from dispatch.</p><h4>Extensibility questions</h4><ul><li>Cancellation after accept (compensation/Saga-lite); multi-restaurant carts; scheduled orders; surge pricing.</li></ul>`
      },
      {
        id: 'P2-25',
        num: 'P2-25',
        title: "Ride Sharing (Uber/Ola)",
        time: 7,
        html: `<h4>Requirements</h4><ul><li>Rider requests ride; match nearest driver; trip lifecycle; fare; payments.</li></ul><h4>Entities</h4><p>Rider, Driver, Trip, LocationManager, MatchingService, FareStrategy, PaymentService.</p><h4>Responsibilities</h4><p>Trip = state machine (REQUESTED→MATCHED→STARTED→COMPLETED); MatchingService finds drivers; FareStrategy computes fare.</p><h4>Class diagram</h4><pre>Rider ──◇ Trip ──◇ Driver
Trip.state (State)
MatchingService ──▶ Driver[*]
Trip ──▶ FareStrategy</pre><h4>Design patterns</h4><p>State, Strategy (fare, matching), Observer (driver/rider notifications).</p><h4>SOLID analysis</h4><p>SRP — fare vs matching vs payment separate; OCP — new fare rule = new strategy.</p><h4>Extensibility questions</h4><ul><li>Pooled rides; driver cancellation; surge multiplier; scheduled rides; multiple stops.</li></ul>`
      },
      {
        id: 'P2-26',
        num: 'P2-26',
        title: "Vending Machine",
        time: 6,
        html: `<h4>Requirements</h4><ul><li>Accept coins; select item; validate price & stock; dispense; return change.</li></ul><h4>Entities</h4><p>VendingMachine, Inventory (item→count), Item, Coin/Money, states (Idle, HasMoney, Dispensing, OutOfStock).</p><h4>Responsibilities</h4><p>VendingMachine is the canonical State-pattern example; Inventory tracks stock; change-making is its own strategy.</p><h4>Class diagram</h4><pre>VendingMachine ──◆ Inventory
VendingMachine.state (State pattern)</pre><h4>Design patterns</h4><p>State (canonical example), Strategy (change-making algorithm).</p><h4>SOLID analysis</h4><p>SRP — inventory vs money vs state separate.</p><h4>Extensibility questions</h4><ul><li>Card payments; multiple currencies; temperature-controlled slots; refund path.</li></ul>`
      },
      {
        id: 'P2-27',
        num: 'P2-27',
        title: "Splitwise (Expense Sharing)",
        time: 18,
        html: `
<h4>1 · Requirements</h4>
<ul><li>Users; groups; add an expense with splits (equal / exact / percent); balances; simplify debts into minimum transactions.</li></ul>
<h4>2 · Core entities & responsibilities</h4>
<ul>
<li><strong>User</strong> — identity.</li>
<li><strong>Group</strong> — a set of users.</li>
<li><strong>Expense</strong> — amount, who paid, participants.</li>
<li><strong>Split</strong> (abstract) — computes each participant's share; subtypes <code>EqualSplit / ExactSplit / PercentSplit</code>.</li>
<li><strong>BalanceSheet</strong> — net owes/owed per user.</li>
<li><strong>SettlementService</strong> — reduces debts to minimal transactions.</li>
</ul>
<h4>3 · The core abstraction: split types</h4>
<p>The split is the thing that changes — equal today, "by weight" tomorrow. Model it as a Strategy (P2-09): <code>Expense</code> holds a <code>Split</code> that computes shares; adding a split type is a new subclass, not a new <code>else-if</code>.</p>
<h4>4 · Class diagram</h4>
<pre>User ──◆ BalanceSheet (owes/owed per user)
Group ──◇ User[*]
Expense ──◆ Split[*] (abstract)
Split &lt;|-- EqualSplit, ExactSplit, PercentSplit
Expense ──▶ User (paidBy)
SettlementService ──▶ BalanceSheet</pre>
<h4>5 · Interfaces & enums</h4>
<p><code>ISplitStrategy { vector&amp;lt;double&amp;gt; compute(total, n, extra); }</code> · <code>ExpenseStatus { SETTLED, PARTIAL, UNSETTLED }</code>.</p>
<h4>6 · Recording an expense (the write path)</h4>
<pre>void Ledger::addExpense(const Expense&amp; e) {
  balance[e.paidBy] += e.amount;                 // payer is owed
  for (size_t i = 0; i &lt; e.participants.size(); ++i)
    balance[e.participants[i]] -= e.shares[i];   // each owes their share
}</pre>
<h4>7 · Simplifying debts (the fun part)</h4>
<p>Net balances are all you need (money is fungible). The minimal-transactions result: greedily match the largest debtor with the largest creditor, settle the smaller magnitude, repeat. For this graph the greedy is optimal — be ready to say so.</p>
<pre>while (debtors &amp;&amp; creditors):
  amt = min(-balance[largest_debtor], balance[largest_creditor])
  emit transfer(debtor -&gt; creditor, amt); update both</pre>
<h4>8 · SOLID analysis</h4>
<p>OCP — a new split type is one subclass. SRP — recording an expense (Ledger) is separate from simplifying debts (SettlementService) is separate from notifying members (Observer).</p>
<h4>9 · Concurrency</h4>
<p>Two expenses added to the same group simultaneously — the balance update must be atomic (per-user lock or serialization), or you reintroduce the lost update (P4-04).</p>
<h4>10 · Interview follow-ups</h4>
<ul>
<li>"Why is the greedy settlement optimal here?" (each transfer settles at least one party fully).</li>
<li>"Add 'split by weight' — what changes?" (one new subclass).</li>
<li>"How do you handle a group of 2 vs a group of 20 differently?" (same model; the balance sheet scales, the settlement loop is O(n log n)).</li>
</ul>
`
      },
      {
        id: 'P2-28',
        num: 'P2-28',
        title: "Notification System (LLD side)",
        time: 7,
        html: `<h4>Requirements</h4><ul><li>Send across channels (email/SMS/push); templates; priority; rate-limit per user; retry on failure.</li></ul><h4>Entities</h4><p>Notification, User, Channel (abstract: Email/Sms/Push), Template, Notifier, RateLimiter, RetryPolicy.</p><h4>Responsibilities</h4><p>Notifier orchestrates send = rateLimit → render → deliver → retry; each Channel knows one provider.</p><h4>Class diagram</h4><pre>Notifier ──◆ Channel[*] (abstract)
Channel &lt;|-- EmailChannel, SmsChannel, PushChannel
Notifier ──◇ Template
Notifier ──▶ RateLimiter, RetryPolicy</pre><h4>Design patterns</h4><p>Strategy (channels), Factory (channel from type), Template Method (send pipeline), Chain of Responsibility (validation).</p><h4>SOLID analysis</h4><p>OCP — new channel = one subclass; SRP — rate limiting separate from delivery.</p><h4>Extensibility questions</h4><ul><li>Batching/digest; user preferences (opt-out); priorities; this exact design scales into the HLD case study P8-11.</li></ul>`
      },
    ],
  },
  {
    id: 'm3a',
    track: 'phase3',
    title: "Requirements & Estimation",
    icon: '3A',
    topics: [
      {
        id: 'P3-01',
        num: 'P3-01',
        title: "Requirements: Functional vs Non-Functional",
        time: 7,
        html: `<p>Every design interview starts by scoping the problem. Skipping this is the single most common reason candidates flounder later — they design for a system nobody asked for.</p>
<h4>Functional requirements — what the system does</h4>
<ul>
<li>The core user actions: "users can post a tweet," "users can shorten a URL," "users can request a ride"</li>
<li>Ask which features are in scope. A real interviewer wants you to explicitly cut scope: "I'll skip payments and focus on the ride-matching flow" is a strong opening move, not a weakness.</li>
<li>Write these as a short numbered list before moving on — it anchors the rest of the interview.</li>
</ul>
<h4>Non-functional requirements — how well it does it</h4>
<ul>
<li><strong>Availability</strong>: can the system tolerate downtime, or does it need 99.99%+ uptime?</li>
<li><strong>Latency</strong>: what response time do users expect (real-time chat vs. batch analytics have wildly different bars)?</li>
<li><strong>Consistency</strong>: does every reader need the latest write immediately, or is "eventually correct" fine?</li>
<li><strong>Durability</strong>: can data ever be lost?</li>
<li><strong>Scalability</strong>: expected growth over the next 1-3 years</li>
</ul>
<div class="callout callout-tradeoff"><span class="callout-tag">TRADEOFF</span>Non-functional requirements are where most of the interesting engineering tradeoffs live. "Strongly consistent bank balance" vs. "eventually consistent like count" are different systems wearing the same word "database."</div>
<div class="callout callout-watch"><span class="callout-tag">WATCH</span>Don't list every non-functional requirement generically. Pick the 2-3 that actually shape this specific system and say why.</div>`
      },
      {
        id: 'P3-02',
        num: 'P3-02',
        title: "Capacity Estimation \u2014 the Full Recipe",
        time: 13,
        html: `
<h4>The problem: "a lot of users" is not a design input</h4>
<p>Every architecture decision — cache or not, replicas or not, shard or not — depends on numbers. Estimation turns "a lot of users" into QPS, storage, and bandwidth that <em>justify</em> those decisions. You do not need precision; you need the right order of magnitude and the decision it implies.</p>
<h4>The recipe, step by step</h4>
<ol>
<li><strong>DAU/MAU</strong> — usually given or assumed; write it down.</li>
<li><strong>Requests/sec</strong> — <code>DAU × requests/user/day ÷ 86,400</code> (round 86,400 → 10⁵). Multiply by a <strong>peak factor</strong> (2–3× average) — you design for peak, not average.</li>
<li><strong>Storage</strong> — <code>bytes/record × records/day × retention period</code>.</li>
<li><strong>Bandwidth</strong> — <code>QPS × average payload size</code>.</li>
<li><strong>Read:write ratio</strong> — the single most decision-shaping number: read-heavy → cache + replicas; write-heavy → sharding.</li>
</ol>
<h4>Worked example — show the arithmetic</h4>
<p>URL shortener: 100M new URLs/month ≈ 40 writes/s average; 100:1 read:write → ~4,000 reads/s. Each record ~500 bytes → 100M × 500 B ≈ 50 GB/month ≈ 2 TB over 3 years.</p>
<p><strong>What the numbers decide:</strong> 4,000 reads/s and 40 writes/s means one database handles writes easily and a cache absorbs virtually all reads — no sharding, no Kafka. The estimate <em>is</em> the argument against over-engineering.</p>
<h4>Latency budgets</h4>
<p>Pick an end-to-end target (feed under 200 ms), then subtract each hop using the P0-07 table (DNS ~10 ms, TLS ~50 ms, network ~50 ms, app ~30 ms, cache ~1 ms…). What remains is the budget for the hard component. This is how you answer "how fast does the deep-dive piece need to be?"</p>
<h4>Availability calculation</h4>
<p>Nines table (P6-01) plus <code>Availability = MTBF / (MTBF + MTTR)</code> — state the target (99.99% for payments) and what it costs.</p>
<div class="callout callout-watch"><span class="callout-tag">MISCONCEPTION</span>The number is never the answer — the <em>decision it justifies</em> is. "4,000 reads/s → cache + read replicas" is the sentence that earns the point.</div>
<h4>Numerical exercise</h4>
<p>Estimate a news feed: 500M MAU, 50M daily posters, users read 5×/day, 100 posts/page, post ≈ 1 KB. Compute read RPS (avg + peak), write RPS, storage for 3 years (text only), and bandwidth — then state the first thing that must scale.</p>
`
      },
      {
        id: 'P3-03',
        num: 'P3-03',
        title: "API Design: REST, gRPC, GraphQL, Versioning",
        time: 13,
        html: `
<h4>The problem: your API is a contract, and contracts change</h4>
<p>An API is the interface between clients and your system — and between your services. Designing it well (REST/gRPC/GraphQL, versioning, pagination, idempotency) is the difference between a system that evolves and one that ossifies.</p>
<h4>REST vs gRPC vs GraphQL — pick by the caller</h4>
<ul>
<li><strong>REST</strong> — resources (nouns) + HTTP verbs; <code>GET /users/123</code>. Human-readable, cacheable by default, universally understood. Costs: over-fetching (whole user when you needed the name) and under-fetching (multiple round trips).</li>
<li><strong>gRPC</strong> — calls methods (<code>getUser(123)</code>) over HTTP/2 with binary Protobuf. Faster, strongly typed, supports streaming and deadlines. Right for <em>internal</em> service-to-service. Less human-readable, less naturally cacheable.</li>
<li><strong>GraphQL</strong> — the client states exactly which fields it wants. Kills over/under-fetching for complex clients (a mobile home screen aggregating many resources). Costs: hard to cache at the HTTP layer, and unbounded nested queries need depth limits.</li>
</ul>
<p><strong>The decision rule:</strong> REST for public APIs, gRPC for internal high-traffic calls, GraphQL when one client must flexibly aggregate many resources.</p>
<h4>Versioning</h4>
<p>URI (<code>/v1/</code>), header, or query param — pick one and be consistent. Prefer <em>additive</em> changes; break only on a major version, and run old + new side by side (P7-09) so clients migrate on their own schedule.</p>
<h4>Pagination — cursor, not offset</h4>
<p>Offset (<code>?offset=100</code>) breaks when rows are inserted between pages (you skip or duplicate). Cursor pagination (<code>?after=&lt;opaque token&gt;</code>) anchors on a stable position — the only correct choice for feeds and timelines.</p>
<h4>Idempotency on writes</h4>
<p>POST is not idempotent; a client retry can create two resources. Accept an <code>Idempotency-Key</code> header and dedupe (P5-12). This one decision is the difference between "correct payment API" and "double-charge lawsuit".</p>
<div class="callout callout-tip"><span class="callout-tag">INTERVIEW</span>"REST out, gRPC in, cursors for pagination, idempotency keys on POST" — that sentence covers 80% of API-design questions before they are asked.</div>
<h4>Exercise</h4>
<p>Write the full API for a payment service: endpoints, verbs, payloads, versioning, an idempotent <code>POST /payments</code>, and cursor pagination on <code>GET /payments</code>.</p>
`
      },
    ],
  },
  {
    id: 'm3b',
    track: 'phase3',
    title: "Communication Patterns",
    icon: '3B',
    topics: [
      {
        id: 'P3-04',
        num: 'P3-04',
        title: "Real-Time Patterns: Polling, Long-Polling, WebSockets, SSE",
        time: 7,
        html: `<p>Four patterns for getting near-real-time updates from a server to a client, in increasing order of efficiency and complexity.</p>
<h4>Polling</h4>
<ul>
<li>Client asks "anything new?" on a fixed interval (e.g. every 5s)</li>
<li>Simple, but wastes requests when there's nothing new, and updates are delayed up to the poll interval</li>
</ul>
<h4>Long-Polling</h4>
<ul>
<li>Client asks, server holds the request open until there's new data (or a timeout), then responds; client immediately re-asks</li>
<li>Fewer wasted round trips than polling, still uses plain HTTP, but ties up a server connection per waiting client</li>
</ul>
<h4>WebSockets</h4>
<ul>
<li>A single persistent, full-duplex connection — both client and server can push messages anytime</li>
<li>Best for high-frequency, bidirectional real-time needs (chat, multiplayer games, live collaboration)</li>
<li>More server resources per open connection; needs sticky routing/connection-aware load balancing</li>
</ul>
<h4>Server-Sent Events (SSE)</h4>
<ul>
<li>Persistent one-way connection, server pushes updates to client over plain HTTP</li>
<li>Simpler than WebSockets when the client never needs to push back (live sports scores, notifications feed)</li>
</ul>
<table>
<tr><th>Pattern</th><th>Direction</th><th>Best for</th></tr>
<tr><td>Polling</td><td>Client-pulled</td><td>Low-frequency updates, simplicity</td></tr>
<tr><td>Long-Polling</td><td>Client-pulled, server-held</td><td>Medium frequency, HTTP-only infra</td></tr>
<tr><td>WebSockets</td><td>Bidirectional</td><td>Chat, gaming, collaborative editing</td></tr>
<tr><td>SSE</td><td>Server-pushed</td><td>Live feeds, notifications, dashboards</td></tr>
</table>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>For a chat app, WebSockets is the expected answer. For a "typeahead suggestions while typing" feature, that's actually just fast synchronous requests, not any of these four — don't force a real-time pattern where none is needed.</div>`
      },
      {
        id: 'P3-05',
        num: 'P3-05',
        title: "Sync vs Async; Push vs Pull",
        time: 13,
        html: `
<h4>The problem: two arrows, four choices</h4>
<p>Every arrow you draw between two boxes is a communication decision hiding four choices: <strong>sync vs async</strong> (does the caller wait?) and <strong>push vs pull</strong> (who initiates data movement?). Get these right and most of your architecture follows; get them wrong and you are bolting on fixes later.</p>
<h4>Synchronous vs asynchronous</h4>
<ul>
<li><strong>Synchronous</strong> — the caller blocks for the response. Simple to reason about. But a slow downstream directly slows (or fails) the caller, and failures <em>cascade</em>: if B is down, everything calling B is stuck.</li>
<li><strong>Asynchronous</strong> — the caller sends a message and moves on; the result arrives later (usually via a queue, P7-01). Decouples in time — the consumer need not even be up. Costs: ordering, retries, and eventual consistency are now your problem.</li>
</ul>
<p><strong>The rule:</strong> synchronous when the caller genuinely needs the result to proceed (checking inventory before confirming an order); asynchronous for background work (sending a confirmation email, generating thumbnails). Ask "should this be sync or async?" out loud for every arrow.</p>
<h4>Push vs pull (the fan-out question)</h4>
<ul>
<li><strong>Push</strong> — the producer sends data to consumers the moment it exists. Low latency. But the producer must track every subscriber, and a slow consumer can be overwhelmed.</li>
<li><strong>Pull</strong> — the consumer requests data when ready. The consumer controls its own pace (natural backpressure); the producer stays simple. Cost: higher latency — data waits to be asked for.</li>
</ul>
<h4>The hybrid fan-out — the answer you will reuse everywhere</h4>
<p>News feeds are the canonical case. <strong>Push</strong> (fan-out-on-write): when a user posts, write it into every follower's precomputed feed — reads are instant, but a celebrity with 100M followers causes 100M writes per post. <strong>Pull</strong> (fan-out-on-read): compute the feed at request time — cheap writes, slow reads. <strong>Hybrid</strong> (what real systems do): push for normal users, pull for accounts above a follower threshold. Twitter (P8-02), Instagram (P8-08), and News Feed (P8-15) are all this one idea plus a twist.</p>
<div class="callout callout-tradeoff"><span class="callout-tag">TRADEOFF</span>Push optimizes read latency and pays in write amplification; pull optimizes write cost and pays in read latency. The hybrid is the standard resolution — and naming both extremes plus their failure mode is the expected interview answer.</div>
<h4>Exercise</h4>
<p>Classify: payment confirmation email, checking inventory before order, feed delivery, webhook delivery. For each, say sync/async and push/pull — and defend.</p>
`
      },
    ],
  },
  {
    id: 'm3c',
    track: 'phase3',
    title: "Traffic Management & Caching",
    icon: '3C',
    topics: [
      {
        id: 'P3-06',
        num: 'P3-06',
        title: "Load Balancers: L4/L7, Algorithms, Health Checks",
        time: 7,
        html: `<p>A load balancer sits in front of a pool of servers and distributes incoming traffic across them, so no single server gets overwhelmed and the system can scale horizontally.</p>
<div class="diagram" data-diagram="loadbalancer"></div>
<h4>Common algorithms</h4>
<ul>
<li><strong>Round robin</strong>: requests cycle through servers in order — simple, assumes servers are equally capable</li>
<li><strong>Least connections</strong>: routes to the server with the fewest active connections — better when requests vary in cost</li>
<li><strong>Weighted round robin</strong>: some servers get more traffic (proportional to declared capacity) — good for mixed hardware</li>
<li><strong>IP hash</strong>: same client always routed to the same server — useful for session affinity (sticky sessions)</li>
</ul>
<h4>Layer 4 vs Layer 7</h4>
<ul>
<li><strong>L4 (transport layer)</strong>: routes based on IP/port only, fast, doesn't inspect content</li>
<li><strong>L7 (application layer)</strong>: routes based on HTTP headers, URL path, cookies — smarter routing (e.g. <code>/api/*</code> to one pool, <code>/static/*</code> to another) at some CPU cost</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>Always mention health checks alongside load balancing — a load balancer that keeps sending traffic to a dead server isn't doing its job. Also mention the load balancer itself needs redundancy (active-passive pair, or DNS round robin across multiple LBs) or it becomes the single point of failure it was meant to eliminate.</div>`
      },
      {
        id: 'P3-07',
        num: 'P3-07',
        title: "Reverse Proxy & API Gateway",
        time: 7,
        html: `<p>Both sit between a client and a server, but they represent opposite sides of the conversation.</p>
<h4>Forward proxy</h4>
<ul>
<li>Sits in front of clients, acting on their behalf</li>
<li>Hides the client's identity from the server (common for corporate networks, VPNs, bypassing content restrictions)</li>
<li>The server doesn't know it's talking to a proxy — it just sees the proxy's IP</li>
</ul>
<h4>Reverse proxy</h4>
<ul>
<li>Sits in front of servers, acting on their behalf</li>
<li>Hides backend server details from the client — client thinks it's talking directly to "the service"</li>
<li>Commonly handles: load balancing, SSL termination, caching, compression, request routing (Nginx, HAProxy, and most load balancers are reverse proxies)</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>In system design interviews, the reverse proxy is the far more common answer — it's essentially what your load balancer/API gateway box represents in most architecture diagrams.</div><h4>API gateway vs load balancer vs direct exposure</h4><p>Three different levels of indirection between a client and your backend services, each solving a different problem.</p>
<h4>Direct exposure</h4>
<ul>
<li>Client talks directly to each backend service</li>
<li>Simplest, but leaks internal architecture to clients and makes cross-cutting concerns (auth, rate limiting) duplicated across every service</li>
</ul>
<h4>Load balancer</h4>
<ul>
<li>Distributes traffic across replicas of the *same* service</li>
<li>Solves scaling a single service horizontally, not routing between different services</li>
</ul>
<h4>API Gateway</h4>
<ul>
<li>A single entry point in front of *many different* backend services (especially in a microservices architecture)</li>
<li>Centralizes auth, rate limiting, request routing/composition, logging, and protocol translation (e.g. REST-in, gRPC-out)</li>
<li>Adds a hop of latency and can become a bottleneck or single point of failure if not itself scaled and made redundant</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>A clean interview line: "Client hits the API gateway, which authenticates and rate-limits the request, then routes it to the right service, which itself sits behind its own load balancer." That sentence alone demonstrates you understand all three layers.</div><div class="callout callout-tip"><span class="callout-tag">TIP</span>One sentence that demonstrates all three layers: "Client hits the gateway (auth + rate limit), which routes to the right service, which sits behind its own load balancer."</div>`
      },
      {
        id: 'P3-08',
        num: 'P3-08',
        title: "Service Discovery",
        time: 6,
        html: `<p>In a fleet of constantly-changing instances, how does one service find another to call? Hard-coded addresses die the moment an instance restarts.</p><ul><li><strong>Registry</strong> (Consul/etcd/K8s DNS) tracks which instances of which services are healthy and where they live.</li><li><strong>Client-side discovery</strong> — the caller queries the registry and picks an instance.</li><li><strong>Server-side discovery</strong> — the caller goes through a router/LB that queries the registry; simpler clients.</li><li>The classic bug: the registry serving <strong>stale entries</strong> for a dead instance — health checks must evict quickly.</li></ul><div class="callout callout-tip"><span class="callout-tag">TIP</span>A service mesh (P7-05) is the upgrade that centralizes retries, mTLS and timeouts on top of discovery — don't conflate the two.</div>`
      },
      {
        id: 'P3-09',
        num: 'P3-09',
        title: "Caching Fundamentals & Eviction Policies",
        time: 13,
        html: `
<h4>The problem: the same read, a million times</h4>
<p>Your product page receives 100,000 requests for the same product. If every request hits PostgreSQL, the database does the same disk reads 100,000 times — and the database, not the app, becomes the bottleneck. A cache stores the hot answer in memory and serves it in ~1 ms instead of ~10 ms + query overhead.</p>
<h4>Why caching works: locality</h4>
<p>Real traffic follows a power law: a tiny fraction of data (the "hot set") gets most requests. Cache that hot set in RAM (P0-07: RAM is ~10⁴× faster than SSD) and you have converted disk-speed into memory-speed for almost all traffic.</p>
<h4>Eviction — what to drop when full</h4>
<ul>
<li><strong>LRU</strong> (least recently used) — the default; fits "recently hot stays hot".</li>
<li><strong>LFU</strong> (least frequently used) — when popularity is stable (a fixed product catalog).</li>
<li><strong>FIFO / TTL</strong> — when staleness itself is the concern.</li>
</ul>
<h4>Cache-aside and its siblings</h4>
<ul>
<li><strong>Cache-aside</strong> — app checks cache, misses, reads DB, populates cache. The default: only what is requested is cached; first request after a miss is slow.</li>
<li><strong>Read-through / write-through / write-back</strong> — the cache sits in front (or writes flow through it) for stronger consistency or faster writes, each with a different risk (write-back risks data loss on cache failure).</li>
</ul>
<h4>Invalidation — the hard part</h4>
<p>Once you cache, you have two copies of the truth and they can disagree. Strategies: TTL (accept bounded staleness) or explicit delete-on-write (correctness-sensitive data). Two failure modes to name: the <strong>thundering herd</strong> (a hot key expires, thousands of misses hammer the DB — fix with request coalescing or jittered TTLs) and the <strong>cache stampede</strong> (a freshly deployed, empty cache — fix by pre-warming).</p>
<h4>Distributed caching</h4>
<p>When the hot set exceeds one machine, shard the cache across nodes with consistent hashing (P4-07). Two facts to state: a dead cache node just becomes guaranteed misses (acceptable — cache is not the source of truth), and a single viral key can overload its one node (fix: replicate that key, or an in-process L1 cache).</p>
<div class="callout callout-watch"><span class="callout-tag">MISCONCEPTION</span>A cache is a performance optimization, never a source of truth — always design the miss path back to the durable store. And caching does not <em>always</em> help: a write-heavy, low-locality workload gains little and adds invalidation bugs.</div>
<h4>Exercise</h4>
<p>Design caching for a 10M-SKU catalog where 1% of SKUs get 90% of reads: policy, eviction, invalidation plan, and what happens when a cache node dies.</p>
`
      },
      {
        id: 'P3-10',
        num: 'P3-10',
        title: "Cache Strategies, Invalidation & Distributed Caching",
        time: 9,
        html: `<p>Four strategies for how an application, cache, and database interact — each with a different consistency/performance tradeoff.</p>
<div class="diagram" data-diagram="cacheaside"></div>
<h4>Cache-aside (lazy loading)</h4>
<ul>
<li>App checks cache first; on a miss, reads from DB and populates the cache</li>
<li>Most common pattern — simple, cache only holds what's actually requested</li>
<li>Risk: first request after a miss is always slow, and cache can go stale if the DB is updated elsewhere</li>
</ul>
<h4>Read-through</h4>
<ul>
<li>The cache itself sits in front of the DB and loads data on a miss (app only ever talks to the cache)</li>
<li>Cleaner app code, same staleness risk as cache-aside</li>
</ul>
<h4>Write-through</h4>
<ul>
<li>Every write goes to the cache *and* the DB synchronously before acknowledging</li>
<li>Cache is always consistent with the DB, but writes are slower (two systems to update)</li>
</ul>
<h4>Write-back (write-behind)</h4>
<ul>
<li>Write goes to the cache immediately, and is asynchronously flushed to the DB later</li>
<li>Fastest writes, but risks data loss if the cache fails before the flush completes</li>
</ul>
<table>
<tr><th>Strategy</th><th>Read speed</th><th>Write speed</th><th>Consistency risk</th></tr>
<tr><td>Cache-aside</td><td>Fast after warm-up</td><td>Normal</td><td>Can go stale</td></tr>
<tr><td>Write-through</td><td>Fast</td><td>Slower</td><td>Low</td></tr>
<tr><td>Write-back</td><td>Fast</td><td>Fastest</td><td>Higher (data loss risk)</td></tr>
</table>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>Cache-aside + a reasonable TTL is the safe default answer for most interview systems. Reach for write-through when correctness after a write matters a lot; write-back only when write throughput is the dominant constraint and some data loss risk is acceptable.</div><h4>Where the cache lives</h4><p>Caching doesn't only happen inside your backend — where you cache changes who benefits and what risks you take on.</p>
<h4>Client-side caching</h4>
<ul>
<li>Browser cache, mobile app local storage, HTTP cache headers (<code>Cache-Control</code>, <code>ETag</code>)</li>
<li>Zero network round trip on a hit — the fastest possible cache</li>
<li>You lose control once it's on the client; hard to force-invalidate a stale value everywhere</li>
</ul>
<h4>Server-side caching</h4>
<ul>
<li>In-memory caches like Redis or Memcached sitting between your app servers and database</li>
<li>You control invalidation centrally, shared across all users</li>
<li>Still requires a network hop from app server to cache, just a much faster one than hitting the DB</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>Use both, for different data: aggressive client-side caching for rarely-changing content (a user's own profile picture), server-side caching for data shared across users (a trending list, product catalog).</div><h4>Invalidation & its failure modes</h4><p>Famously one of the two hard problems in computer science. Once you cache something, you now have two copies of the truth — and they can disagree.</p>
<h4>Strategies</h4>
<ul>
<li><strong>TTL expiration</strong>: simplest — accept some staleness, bound by how long the TTL is</li>
<li><strong>Explicit invalidation on write</strong>: when the DB is updated, actively delete or update the corresponding cache key</li>
<li><strong>Write-through</strong> (see previous topic): avoids the problem by keeping cache and DB in lockstep on every write</li>
</ul>
<h4>Common pitfalls</h4>
<ul>
<li><strong>Thundering herd</strong>: a hot key expires, and thousands of simultaneous requests all miss the cache at once and hammer the DB — mitigate with request coalescing or staggered TTLs</li>
<li><strong>Cache stampede on cold start</strong>: a freshly deployed cache is entirely empty, and every request is a miss — mitigate by pre-warming the cache before cutting over traffic</li>
</ul>
<div class="callout callout-tradeoff"><span class="callout-tag">TRADEOFF</span>Tighter invalidation (write-through, explicit deletes) buys correctness at the cost of complexity and write latency. Looser invalidation (TTL only) is simpler but means users can briefly see stale data.</div>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>For most systems, saying "short TTL plus explicit invalidation on write for anything user-visible and correctness-sensitive" is a strong, practical default.</div><h4>Distributed caching at scale</h4><p>A single cache server eventually can't hold the whole hot dataset in memory, or can't handle the request volume alone. Distributed caching spreads the cache itself across multiple nodes.</p>
<h4>How keys get distributed</h4>
<ul>
<li>Data is partitioned across cache nodes, typically using <strong>consistent hashing</strong> (see P4-07) so adding/removing nodes doesn't reshuffle every key</li>
<li>Each node owns a slice of the keyspace; clients (or a proxy layer) route requests to the right node</li>
</ul>
<h4>Design considerations</h4>
<ul>
<li><strong>Replication</strong>: if a cache node dies and it wasn't replicated, every key it held becomes a guaranteed miss until the DB repopulates it — usually an acceptable tradeoff for a cache (it's not the source of truth) but worth stating</li>
<li><strong>Hot keys</strong>: a single extremely popular key (a viral post) can overload the one node that owns it — mitigate with local (in-process) caching on top, or replicating that specific key across nodes</li>
<li><strong>Redis Cluster / Memcached with consistent hashing</strong> are the common real-world implementations</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>If your estimated hot dataset exceeds what a single reasonably-sized cache instance can hold (tens of GB), that's your justification for saying "we'd need a distributed cache" instead of just "we'd add a cache."</div><div class="callout callout-watch"><span class="callout-tag">WATCH</span>A cache is a performance optimization, never a source of truth. Always have a path back to the durable store on a miss.</div>`
      },
      {
        id: 'P3-11',
        num: 'P3-11',
        title: "CDNs: Caching at the Edge",
        time: 6,
        html: `<p>A Content Delivery Network is a geographically distributed set of servers ("edge nodes") that cache and serve content close to users, cutting latency and origin server load.</p>
<h4>How it works</h4>
<ul>
<li>User requests a static asset (image, video, JS bundle); DNS routes them to the nearest edge node</li>
<li>If the edge node has it cached ("cache hit"), it serves immediately — no round trip to the origin server</li>
<li>On a cache miss, the edge node fetches from origin, caches it, and serves it — subsequent nearby users get a hit</li>
</ul>
<h4>Push vs pull CDNs</h4>
<ul>
<li><strong>Pull</strong>: origin is the source of truth; CDN fetches and caches on first request (lazy) — simpler to operate</li>
<li><strong>Push</strong>: you proactively upload content to the CDN ahead of time — better for content you know will be requested heavily (a big product launch)</li>
</ul>
<h4>What belongs on a CDN</h4>
<ul>
<li>Static assets: images, video, CSS/JS, downloadable files</li>
<li>Increasingly: cacheable API responses too (with short TTLs), for read-heavy, mostly-static data</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>"We'd put static assets and profile images behind a CDN" is a near-automatic point scorer in almost any consumer-facing system design (Instagram, YouTube, Dropbox) — it's low-cost, high-impact, and shows you're thinking beyond just the origin servers.</div>`
      },
      {
        id: 'P3-12',
        num: 'P3-12',
        title: "Rate Limiting: Token Bucket vs Leaky Bucket vs Sliding Window",
        time: 13,
        html: `<div class="diagram" data-diagram="tokenbucket"></div>
<h4>The problem: protect the system from being overwhelmed</h4>
<p>Rate limiting caps how many requests a client may make in a window — against abusive clients, bugs, or legitimate spikes. It is the difference between a system that degrades gracefully and one that falls over.</p>
<h4>The algorithms, and their failure modes</h4>
<ul>
<li><strong>Token bucket</strong> — a bucket refills at a fixed rate up to a capacity; each request spends a token. Allows <em>bursts</em> (as long as tokens last) while enforcing a long-term average. The most common choice (GitHub, Stripe) because occasional bursts are normal user behavior.</li>
<li><strong>Leaky bucket</strong> — requests queue and "leak" out at a constant rate. Smooths bursts into a steady stream — right when the downstream needs constant load, not spikes.</li>
<li><strong>Fixed window</strong> — count per minute. Simple; allows a <strong>2× boundary burst</strong> (requests at 12:59:59 and 1:00:01 both fit).</li>
<li><strong>Sliding window / log</strong> — count over a rolling period. Accurate; slightly more expensive.</li>
</ul>
<h4>The distributed problem — the real interview question</h4>
<p>A naive in-memory counter <em>per app server</em> breaks the moment you have N servers: a client could get N × the limit by hitting different servers. The fix: centralize counters in a fast shared store (Redis <code>INCR + EXPIRE</code>), ideally atomic via a Lua script. At extreme scale, shard the counters by client ID and accept <em>approximate</em> counting rather than a fully synchronous global counter.</p>
<h4>Placement</h4>
<p>Client-side (advisory only), at the <strong>API gateway</strong> (centralized, catches abuse early — the usual answer), or per-service (fine-grained, duplicated logic). Respond with <code>429 + Retry-After</code>.</p>
<div class="callout callout-watch"><span class="callout-tag">MISCONCEPTION</span>Rate limiting is not DDoS protection — a volumetric attack saturates your network before your limiter counts anything. The limiter protects <em>application</em> resources; DDoS needs network-layer defense (P6-08).</div>
<h4>Exercise</h4>
<p>Design a per-user + per-IP limiter at 10k RPS: algorithm, where it lives, the Redis approach, and the fail-open vs fail-closed decision when Redis is down.</p>
`
      },
    ],
  },
  {
    id: 'm3d',
    track: 'phase3',
    title: "Architecture Choices",
    icon: '3D',
    topics: [
      {
        id: 'P3-13',
        num: 'P3-13',
        title: "Scalability: Vertical vs Horizontal + the Scale Ladder",
        time: 8,
        html: `<p>Scalability is a system's ability to handle growing load by adding resources. There are exactly two directions to add them.</p>
<h4>Vertical scaling (scale up)</h4>
<ul>
<li>Add more CPU, RAM, or disk to a single machine</li>
<li>Simple — no architecture changes, no distributed-systems complexity</li>
<li>Hard ceiling — there's a biggest machine money can buy, and it's expensive well before that ceiling</li>
<li>Single point of failure remains: one bigger machine is still one machine</li>
</ul>
<h4>Horizontal scaling (scale out)</h4>
<ul>
<li>Add more machines and distribute load across them</li>
<li>Near-unlimited ceiling, and commodity hardware is cheaper per unit of capacity</li>
<li>Introduces real complexity: load balancing, data partitioning, network calls that can fail, coordination between nodes</li>
</ul>
<div class="callout callout-tradeoff"><span class="callout-tag">TRADEOFF</span>Vertical scaling buys you time and simplicity early. Almost every system at real scale eventually needs to go horizontal — but starting horizontal on day one for a system with 100 users is over-engineering.</div>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>In interviews, say which one you're choosing and why, tied to the estimated scale from your back-of-envelope math — don't default to "obviously horizontal" without justifying it.</div><h4>The ordered ladder (new)</h4><ol><li>Optimize queries & indexes → </li><li>Add a cache → </li><li>Add read replicas → </li><li>Shard writes → </li><li>Split into services → </li><li>Go multi-region</li></ol><p>Each rung is justified by a number, not fashion. "At 1k QPS a single box + cache is fine; at 100k we shard" is the mature answer.</p>`
      },
      {
        id: 'P3-14',
        num: 'P3-14',
        title: "Monolith vs Microservices; Stateful vs Stateless",
        time: 12,
        html: `
<h4>The problem: one deployable, or many?</h4>
<p>This is the architecture decision with the most organizational (not just technical) consequences — and the one most often made for fashion instead of reason.</p>
<h4>Monolith vs microservices</h4>
<ul>
<li><strong>Monolith</strong> — one codebase, one deploy, usually one DB. Simple to develop, test, and deploy early; no network between internal components. Costs: everything scales together (even the one hot part), and a bug anywhere can take down everything.</li>
<li><strong>Microservices</strong> — independently deployable services, each owning its data. Independent scaling, deploys, even languages. Costs: network calls where you had function calls (latency + failure modes), service discovery, and distributed transactions (P5-11).</li>
</ul>
<p><strong>The truth that matters:</strong> microservices solve <em>organizational</em> scaling (many teams shipping independently) more than <em>technical</em> scaling — a well-sharded modular monolith handles enormous technical load. Most companies start as a monolith and split out a service when a specific part clearly needs independent scaling or ownership.</p>
<h4>Stateful vs stateless services</h4>
<ul>
<li><strong>Stateless</strong> — each request carries what is needed; state lives in the DB/cache/token. Any server can serve any request → trivial to scale horizontally. <strong>The default.</strong></li>
<li><strong>Stateful</strong> — the server holds client state in memory (a session, an open WebSocket). Requires <em>sticky sessions</em> and complicates failover (losing the server loses the state).</li>
<li>When state is unavoidable (chat's live connections, P8-03), say so explicitly and externalize what you can (Redis directory) — that candor is the senior signal.</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">INTERVIEW</span>"I'd start with a modular monolith and split out the [specific component] once it needs independent scaling" is the mature, realistic answer. Defaulting to microservices "because it sounds advanced" is a common failing grade.</div>
<h4>Exercise</h4>
<p>Argue for a monolith for a 3-engineer team's app, and for microservices at a 30-team org — two minutes each, with the specific trigger that flips the decision.</p>
`
      },
    ],
  },
  {
    id: 'm4a',
    track: 'phase4',
    title: "Data Modeling & Indexing",
    icon: '4A',
    topics: [
      {
        id: 'P4-01',
        num: 'P4-01',
        title: "SQL vs NoSQL \u2014 Choosing from Access Patterns",
        time: 8,
        html: `<p>The most consequential early decision in most system design interviews, and one that should follow from requirements, not habit.</p>
<h4>SQL (relational)</h4>
<ul>
<li>Fixed schema, tables with rows/columns, relationships enforced via foreign keys</li>
<li>Strong consistency and ACID transactions by default</li>
<li>Powerful querying (joins, aggregations) via SQL</li>
<li>Vertical scaling is natural; horizontal scaling (sharding) is possible but harder to get right</li>
<li>Best for: data with clear relationships and where correctness/consistency matters (orders, payments, inventory)</li>
</ul>
<h4>NoSQL (non-relational)</h4>
<ul>
<li>Flexible or schema-less; several sub-types:</li>
</ul>
<p>- <strong>Document</strong> (MongoDB): JSON-like documents, good for nested, varied data</p>
<p>- <strong>Key-value</strong> (DynamoDB, Redis): simplest model, extremely fast lookups by key</p>
<p>- <strong>Wide-column</strong> (Cassandra): optimized for huge write volumes, flexible columns per row</p>
<p>- <strong>Graph</strong> (Neo4j): optimized for relationship-heavy queries (social graphs, recommendations)</p>
<ul>
<li>Built for horizontal scale from the ground up, often trades strict consistency for availability/partition tolerance</li>
<li>Best for: massive scale, flexible/evolving schemas, or access patterns that are naturally key-value or document-shaped</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>Don't default to NoSQL just because a system is "at scale" — plenty of huge systems run on sharded SQL. Justify the choice against your actual access patterns and consistency needs from the requirements step.</div>
<div class="callout callout-watch"><span class="callout-tag">WATCH</span>"NoSQL is more scalable" is a half-truth people repeat without justifying it — SQL databases can scale horizontally too (see sharding), it's just more engineering effort than most NoSQL systems require out of the box.</div>`
      },
      {
        id: 'P4-02',
        num: 'P4-02',
        title: "Normalization vs Denormalization",
        time: 6,
        html: `<p>Two opposing philosophies for structuring relational data.</p>
<h4>Normalization</h4>
<ul>
<li>Split data into multiple related tables to eliminate redundancy (each fact stored in exactly one place)</li>
<li>Prevents update anomalies (change a user's name once, not in every row that referenced it)</li>
<li>Costs query performance: retrieving a full picture often requires multiple joins</li>
</ul>
<h4>Denormalization</h4>
<ul>
<li>Deliberately duplicate data across tables/documents to avoid joins at read time</li>
<li>Much faster reads for the duplicated data</li>
<li>Costs write complexity: the same fact now lives in multiple places and must be kept in sync on every update</li>
</ul>
<div class="callout callout-tradeoff"><span class="callout-tag">TRADEOFF</span>Normalize for systems where writes and data integrity dominate (transactional, financial systems). Denormalize for read-heavy systems where query speed matters more than storage or write simplicity (a social feed showing username + avatar next to every post, rather than joining to the users table on every read).</div>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>"We'd denormalize the author's display name onto each post to avoid a join on every feed read, accepting we need to update it in the background if a user changes their name" is a complete, interview-ready answer.</div>`
      },
      {
        id: 'P4-03',
        num: 'P4-03',
        title: "Indexing: B-tree, Hash, LSM-tree",
        time: 13,
        html: `
<h4>The problem: finding one row among millions</h4>
<p>Your <code>users</code> table has 100 million rows. The query <code>SELECT * FROM users WHERE email = &#x27;x@y.com&#x27;</code> without an index must read <em>every row</em> — O(n), millions of disk reads. An index turns that into O(log n), a handful of reads. That is the entire reason indexes exist.</p>
<h4>Intuition: a book's index vs reading the whole book</h4>
<p>To find "sharding" in a 1,000-page book you either read every page, or flip to the index and jump straight to page 612. A database index is the same: a separate, sorted structure that maps values → row locations. The cost: you must <em>maintain</em> that structure on every write.</p>
<h4>Three index structures, and when each wins</h4>
<ul>
<li><strong>B-tree</strong> — a sorted, balanced tree. O(log n) point lookups <em>and</em> range scans (<code>BETWEEN</code>, <code>ORDER BY</code>). The relational default; the workhorse behind Postgres and MySQL.</li>
<li><strong>Hash index</strong> — O(1) exact-match lookups, but <em>no range scans</em> (there is no order). Right only for "fetch by exact key".</li>
<li><strong>LSM-tree</strong> — writes go to an in-memory buffer (memtable), which is flushed to sorted files on disk and <em>compacted</em> in the background. <strong>Write-optimized</strong> (sequential writes, no in-place updates), but a read may touch several files. Cassandra and RocksDB use these.</li>
</ul>
<h4>The trade you are making</h4>
<p>Every index costs <strong>storage</strong> and <strong>write performance</strong> — each insert must also update the index. A write-heavy table with a dozen indexes loses; a read-heavy table with a few well-chosen indexes wins. Column order matters in a composite index: <code>(user_id, created_at)</code> serves "all posts by this user in time order", but is useless for "all posts at a given time".</p>
<div class="callout callout-watch"><span class="callout-tag">COMMON MISCONCEPTION</span>"Add an index" is not a universal fix — it is a read-speed-vs-write-speed tradeoff. Saying <em>which</em> index, on <em>which columns</em>, in <em>which order</em>, and what it costs on writes, is the senior answer.</div>
<h4>Numerical exercise</h4>
<p>A 100M-row table, one disk seek ~1 ms. A table scan reads ~10⁷ rows ≈ how long? A B-tree lookup reads ~27 nodes ≈ how long? (The gap is why indexes feel like magic.)</p>
`
      },
      {
        id: 'P4-04',
        num: 'P4-04',
        title: "Transactions: ACID vs BASE & Isolation Levels",
        time: 14,
        html: `
<h4>The problem: two transactions, one balance</h4>
<p>Two customers withdraw from the same account at the same time. Both read balance = 100. Both write balance = 60. One withdrawal silently vanished — this is a <strong>lost update</strong>, and it is what ACID transactions and isolation levels exist to prevent.</p>
<h4>ACID, in one line each</h4>
<ul>
<li><strong>Atomicity</strong> — all or nothing; no partial writes.</li>
<li><strong>Consistency</strong> — a transaction moves the DB between valid states, honoring constraints.</li>
<li><strong>Isolation</strong> — concurrent transactions do not see each other's intermediate state.</li>
<li><strong>Durability</strong> — once committed, a write survives a crash.</li>
</ul>
<h4>Isolation levels — the real depth</h4>
<table><tr><th>Level</th><th>Prevents</th><th>Still allows</th></tr>
<tr><td>Read uncommitted</td><td>—</td><td>dirty reads, everything</td></tr>
<tr><td>Read committed (PG default)</td><td>dirty reads</td><td>non-repeatable reads, phantoms</td></tr>
<tr><td>Repeatable read</td><td>dirty + non-repeatable</td><td>phantoms (in many DBs)</td></tr>
<tr><td>Serializable</td><td>everything</td><td>— (slowest, most blocking)</td></tr></table>
<h4>The anomalies that actually bite</h4>
<ul>
<li><strong>Lost update</strong> — two txns read-then-write; one write is lost. Fix: an atomic <code>UPDATE … SET bal = bal - x</code> (read-modify-write in the DB), or an optimistic version check, or <code>SELECT … FOR UPDATE</code>.</li>
<li><strong>Write skew</strong> — two txns read overlapping data and make <em>conflicting decisions</em> (the on-call doctor problem: both see "another doctor is on call", both leave). Needs serializable or a targeted lock.</li>
<li><strong>Phantom</strong> — a txn's re-query sees rows another txn inserted (double-booking a seat). Needs range/predicate locks — or, better, a schema constraint that makes the invariant impossible to violate (a unique index on <code>(seat_id, show_id)</code>).</li>
</ul>
<div class="callout callout-tradeoff"><span class="callout-tag">TRADEOFF</span>Serializable is correct but slow. Most production systems run read-committed + careful design (atomic updates, unique constraints) and reach for stronger isolation only where money or inventory is at stake. Saying <em>that</em> — rather than "use serializable everywhere" — is the senior answer.</div>
<h4>Optimistic vs pessimistic concurrency</h4>
<p>Pessimistic: lock the row up front (<code>FOR UPDATE</code>) — safe, blocks others. Optimistic: proceed, then verify a version number on commit; retry on conflict — no locks, best under low contention. Pick by contention, not by habit.</p>
<h4>Exercise</h4>
<p>Write two interleaved transactions that produce (a) a lost update, (b) a double-booking. Fix each with a lock <em>and</em> with a version check; say which you would choose and why.</p>
`
      },
    ],
  },
  {
    id: 'm4b',
    track: 'phase4',
    title: "Replication & Partitioning",
    icon: '4B',
    topics: [
      {
        id: 'P4-05',
        num: 'P4-05',
        title: "Replication: Leader-Follower, Multi-Leader, Leaderless",
        time: 14,
        html: `
<h4>The problem: one machine cannot do everything</h4>
<p>As reads grow, one database becomes a single point of failure <em>and</em> a throughput ceiling. Replication — keeping copies on multiple machines — buys you two things: <strong>availability</strong> (survive a node loss) and <strong>read scaling</strong> (spread reads across copies).</p>
<h4>Three topologies</h4>
<ul>
<li><strong>Leader-follower</strong> — one leader accepts all writes; followers replicate from it and serve reads. Simple to reason about (one source of truth). The leader is a single point of failure for writes until a follower is promoted.</li>
<li><strong>Multi-leader</strong> — several nodes accept writes (one per datacenter, or for offline apps). Better write availability and locality; the price is <strong>write conflicts</strong> between leaders (P5-06).</li>
<li><strong>Leaderless</strong> (Dynamo-style) — any replica accepts writes; quorums (P5-05) reconcile. Maximum write availability; conflicts again possible.</li>
</ul>
<h4>Synchronous vs asynchronous replication</h4>
<ul>
<li><strong>Synchronous</strong> — the leader waits for followers to confirm before acknowledging. No data loss on leader failure; higher write latency.</li>
<li><strong>Asynchronous</strong> — the leader acknowledges immediately, replicates in the background. Fast writes; a leader crash can lose the most recent writes.</li>
</ul>
<h4>Replication lag — what users actually complain about</h4>
<p>With async replication, followers lag the leader. Three user-visible anomalies, each with a named fix:</p>
<div class="diagram" data-diagram="replication"></div>
<ul>
<li><strong>"I posted but my feed doesn't show it"</strong> — read-your-writes violated. Fix: read your own writes from the leader.</li>
<li><strong>"The data went backwards between refreshes"</strong> — monotonic reads violated. Fix: pin the user to one replica.</li>
<li><strong>"A reply appeared before its parent"</strong> — consistent prefix violated. Fix: causally-related writes replicate in order.</li>
</ul>
<div class="callout callout-tradeoff"><span class="callout-tag">TRADEOFF</span>Leader-follower with async replication is the pragmatic default — fast, simple, a small acceptable risk window. Reach for multi-leader (multi-DC, offline) or leaderless (write availability during partitions) only when avoiding conflict-resolution complexity matters less than those properties.</div>
<h4>Exercise</h4>
<p>A user posts a comment and it disappears on refresh. Name the anomaly, then give three concrete fixes and their costs.</p>
`
      },
      {
        id: 'P4-06',
        num: 'P4-06',
        title: "Data Partitioning & Sharding",
        time: 13,
        html: `
<h4>The problem: one database cannot hold it all</h4>
<p>When a single machine cannot hold the data or handle the write volume, you split (<strong>shard</strong>) it across machines. Sharding is how writes — not just reads — scale.</p>
<h4>Ways to split</h4>
<ul>
<li><strong>Horizontal (sharding)</strong> — split <em>rows</em> across machines: users A–M on shard 1, N–Z on shard 2. Each shard has the full schema, a subset of rows.</li>
<li><strong>Vertical</strong> — split <em>tables/columns</em> across machines: user profiles on one DB, activity logs on another.</li>
<li><strong>Directory-based</strong> — a lookup service maps each key to its shard. Flexible; adds a dependency that can bottleneck.</li>
</ul>
<h4>The shard key is everything</h4>
<p>Pick the key wrong and you have recreated the hotspot you were trying to escape:</p>
<div class="diagram" data-diagram="sharding"></div>
<ul>
<li><strong>Even distribution</strong> — sharding by <code>country</code> when 80% of users are in one country is a hotspot. Sharding by signup date sends all new-user traffic to one shard.</li>
<li><strong>Match your dominant query</strong> — if you always query by <code>user_id</code>, shard by <code>user_id</code> so each query hits one shard, not all of them.</li>
</ul>
<h4>The hidden costs you must name</h4>
<ul>
<li><strong>Cross-shard joins and transactions are gone</strong> — a query spanning shards must fan out and merge, and a transaction spanning shards needs 2PC/saga (P5-11). You denormalize to avoid this.</li>
<li><strong>Resharding is expensive</strong> — changing the shard count later is disruptive; that is exactly the problem consistent hashing (P4-07) minimizes.</li>
</ul>
<div class="callout callout-watch"><span class="callout-tag">COMMON MISCONCEPTION</span>Sharding is not automatically better than replication, and "we are at scale so we shard" is a non-answer. Replication scales <em>reads</em>; sharding scales <em>writes and storage</em>. Name which one is your actual bottleneck first.</div>
<h4>Exercise</h4>
<p>Pick a shard key for (a) users, (b) tweets, (c) a multi-tenant SaaS — and state the hotspot each avoids, plus which query now crosses shards.</p>
`
      },
      {
        id: 'P4-07',
        num: 'P4-07',
        title: "Consistent Hashing + Virtual Nodes",
        time: 13,
        html: `
<h4>The problem: distributing keys when the cluster changes</h4>
<p>You distribute keys across N cache or DB nodes. The naive rule <code>hash(key) % N</code> works — until N changes. Add one node and <em>almost every key remaps</em> to a different node, flushing your caches and reshuffling your data in one giant storm. Resharding should not be a catastrophe.</p>
<h4>Intuition: a ring, not a modulo</h4>
<p>Place both nodes and keys on the same circle (hash space 0 … 2³²−1). A key belongs to the <strong>first node clockwise</strong> from it. Now adding or removing a node only moves the keys between it and its neighbor — a fraction of the keyspace, not the whole thing.</p>
<div class="diagram" data-diagram="consistenthash"></div>
<h4>Why virtual nodes matter</h4>
<p>With one point per node on the ring, load is lopsided and a single failure dumps everything onto one neighbor. Fix: map each physical node to <strong>many points</strong> (virtual nodes) scattered around the ring. Load evens out statistically, and a dead node's keys spread across many survivors instead of one.</p>
<h4>Where it is used</h4>
<p>Distributed caches (Redis Cluster, Memcached), distributed databases (Cassandra, DynamoDB), CDN routing — any cluster that grows and shrinks over time. In an interview, naming consistent hashing in a partitioning or caching deep-dive is a strong, expected signal.</p>
<div class="callout callout-watch"><span class="callout-tag">COMMON MISCONCEPTION</span>Consistent hashing minimizes <em>how much moves</em>, not how evenly data sits — evenness is what virtual nodes add. And it does not solve replication: moving a key still requires the <em>data</em> to be copied. Both facts are favorite follow-ups.</div>
<h4>Exercise</h4>
<p>On a ring with 3 nodes, add a 4th. Show exactly which keys move. Then explain why virtual nodes make a node failure less painful.</p>
`
      },
      {
        id: 'P4-08',
        num: 'P4-08',
        title: "Connection Pooling & the DB Scaling Ladder",
        time: 11,
        html: `
<h4>The problem: connections are expensive</h4>
<p>Opening a database connection costs a TCP handshake (a network round-trip, P0-06) <em>plus</em> the database's authentication and session setup. If every query opened a fresh connection, the overhead would dominate the query itself.</p>
<h4>The fix: a pool</h4>
<p>A connection pool keeps a fixed set of open connections and reuses them. An app thread borrows one, runs its query, returns it. Setup cost is paid once per connection, not per query.</p>
<h4>Pool sizing — the part people get wrong</h4>
<ul>
<li><strong>Too small</strong> → threads queue waiting for a connection; throughput starves.</li>
<li><strong>Too large</strong> → you oversubscribe the database: Postgres defaults to ~100 connections, and a pool of 5,000 connections across 50 app servers will exhaust it.</li>
<li>The classic outage: 50 servers × 100 pooled connections = 5,000 DB connections → "why is the database down?" → <em>connection exhaustion</em>. A pooler (pgbouncer-style) sits in front and multiplexes many app connections onto few DB connections.</li>
</ul>
<h4>The database scaling ladder</h4>
<p>Take each rung only when the previous stops working — with a number justifying it:</p>
<ol>
<li><strong>Indexes & query tuning</strong> — often 10–100× for free.</li>
<li><strong>Cache</strong> the hot set (P3-09).</li>
<li><strong>Read replicas</strong> for read scale (P4-05).</li>
<li><strong>Shard writes</strong> (P4-06).</li>
<li><strong>Specialized stores</strong> (search, time-series) when the access pattern changes.</li>
</ol>
<div class="callout callout-tip"><span class="callout-tag">INTERVIEW</span>"At 1k QPS a single box + cache + indexes is fine; at 100k QPS of reads I add replicas; at 50k writes/s I shard." Ordering the ladder with numbers is the difference between a strong and a decent database answer.</div>
`
      },
    ],
  },
  {
    id: 'm4c',
    track: 'phase4',
    title: "Specialized Storage",
    icon: '4C',
    topics: [
      {
        id: 'P4-09',
        num: 'P4-09',
        title: "Object Storage & Distributed File Systems",
        time: 6,
        html: `<p>Not all data belongs in a database. Large, unstructured files — images, videos, backups, documents — are usually stored differently.</p>
<h4>Object storage (e.g. S3, GCS, Azure Blob)</h4>
<ul>
<li>Stores files ("objects") as opaque blobs with metadata, addressed by a key, not a file path hierarchy</li>
<li>Virtually unlimited horizontal scale, built-in durability (data replicated across multiple devices/zones automatically), pay-per-use</li>
<li>Not designed for frequent small updates to a file — you replace the whole object, not patch part of it</li>
<li>The default answer for storing user-uploaded content (photos, videos, documents) in almost every modern system design</li>
</ul>
<h4>Distributed file systems (e.g. HDFS, GFS)</h4>
<ul>
<li>Present a more traditional file/directory interface, but data is split into blocks and distributed (and replicated) across many machines</li>
<li>Historically used for big data processing pipelines (Hadoop ecosystem) where jobs need file-like access to huge datasets</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>When a design involves photos, videos, or file uploads (Instagram, Dropbox, YouTube), "store the actual file bytes in object storage like S3, and just keep the metadata (owner, size, URL, timestamps) in the database" is close to the universally correct answer — don't put binary blobs directly in your relational database.</div>`
      },
      {
        id: 'P4-10',
        num: 'P4-10',
        title: "Search: Inverted Index at Scale",
        time: 7,
        html: `<p>The data structure that makes full-text search fast, underlying systems like Elasticsearch and, at a conceptual level, web search engines.</p>
<h4>The core idea</h4>
<ul>
<li>A normal (forward) index maps documents → words they contain</li>
<li>An <strong>inverted index</strong> flips this: it maps each word → the list of documents that contain it</li>
<li>Searching for a word becomes a direct lookup instead of scanning every document</li>
</ul>
<h4>How search queries use it</h4>
<ul>
<li>A multi-word query looks up each term's document list, then intersects/ranks them (documents containing all terms rank higher)</li>
<li>Ranking typically uses relevance scoring (like TF-IDF or BM25): rarer, more concentrated terms score higher</li>
</ul>
<h4>In system design interviews</h4>
<ul>
<li>For search-heavy features (Twitter search, product search), the practical answer is "we'd offload search to a dedicated engine like Elasticsearch, which maintains inverted indexes over the content, rather than building this from scratch or running <code>LIKE '%query%'</code> against the primary database"</li>
<li>The primary database stays the source of truth; the search index is a derived, denormalized copy kept in sync (often via a message queue capturing writes)</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>Explicitly saying "search index is separate from the source-of-truth database, kept in sync asynchronously" heads off a common interviewer follow-up before they even ask it.</div>`
      },
      {
        id: 'P4-11',
        num: 'P4-11',
        title: "Bloom Filters",
        time: 6,
        html: `<p>A probabilistic data structure that answers "is this element possibly in the set?" using a tiny fraction of the memory a real set would need — at the cost of occasional false positives.</p>
<h4>How it works</h4>
<ol>
<li>A bit array of size m, all bits start at 0</li>
<li>To add an element, run it through k different hash functions, each pointing to a bit position, and set those bits to 1</li>
<li>To check membership, hash the element the same way and check if all k positions are 1</li>
</ol>
<h4>The guarantee</h4>
<ul>
<li><strong>No false negatives</strong>: if it says "not in the set," that's always correct</li>
<li><strong>Possible false positives</strong>: it might say "in the set" for something that isn't — because those bits happened to be set by other elements</li>
</ul>
<h4>Where it's used</h4>
<ul>
<li>Checking if a username is already taken before hitting the database (fast pre-check, DB is the final source of truth)</li>
<li>Web crawlers checking if a URL has already been visited without storing every URL in memory</li>
<li>Databases (Cassandra, HBase) using them to avoid unnecessary disk reads for keys that definitely don't exist</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>The recurring pattern is "cheap, memory-efficient filter in front of an expensive, authoritative lookup" — use a Bloom filter to skip the expensive check most of the time, but never as the sole source of truth, because of false positives.</div>`
      },
      {
        id: 'P4-12',
        num: 'P4-12',
        title: "Redis as a Data Layer",
        time: 10,
        html: `
<h4>The problem: hot, structured, fast data</h4>
<p>Between your app and your durable database there is a class of data that must be <em>fast</em> (sub-millisecond) and <em>structured</em> (lists, sets, sorted sets, counters) — sessions, leaderboards, rate-limit counters, "who liked this". Redis is the in-memory data-structure server for exactly that.</p>
<h4>Map the problem to the structure</h4>
<table><tr><th>Structure</th><th>Classic use</th></tr>
<tr><td>String</td><td>cache value; counter via <code>INCR</code></td></tr>
<tr><td>Hash</td><td>user session, object fields</td></tr>
<tr><td>List</td><td>capped timeline, simple queue</td></tr>
<tr><td>Set</td><td>dedup, "who liked this"</td></tr>
<tr><td>Sorted set</td><td>leaderboard, top-K by score</td></tr>
<tr><td>Stream</td><td>append-only log, consumer groups (a mini-Kafka)</td></tr></table>
<h4>The rules that keep you honest</h4>
<ul>
<li><strong>Rate limiter</strong> = <code>INCR + EXPIRE</code> (P3-12). <strong>Session store</strong> = hash with TTL. <strong>Connection directory</strong> = hash (P8-03).</li>
<li>Redis is a <strong>cache / derived store, not the ledger</strong>. Anything that must not be lost belongs in the durable database. Redis <em>has</em> persistence (RDB snapshots, AOF log), but its default posture is speed over durability.</li>
<li>A cache node at 99% memory can be <em>worse</em> than one at 50% — eviction and paging (P0-10) destroy tail latency.</li>
</ul>
<div class="callout callout-watch"><span class="callout-tag">COMMON MISCONCEPTION</span>"Add Redis" is not a scaling plan. The senior answer maps the specific problem to a specific data structure and states what happens when Redis restarts and loses its contents.</div>
<h4>Exercise</h4>
<p>For a leaderboard, a shopping cart, a dedup set, and a sliding-window counter — name the Redis structure and the exact commands, and say what you lose if Redis crashes.</p>
`
      },
    ],
  },
  {
    id: 'm5a',
    track: 'phase5',
    title: "Consistency",
    icon: '5A',
    topics: [
      {
        id: 'P5-01',
        num: 'P5-01',
        title: "Why Distributed Systems Are Hard",
        time: 10,
        html: `
<h4>What is a distributed system?</h4>
<p>A system where a machine you have never heard of can stop you from getting your work done. The moment your design has <em>two</em> computers cooperating, you inherit five hard problems that a single machine simply does not have:</p>
<ul>
<li><strong>Partial failure</strong> — some nodes die while others keep working; and from the outside you cannot distinguish "down" from "just slow".</li>
<li><strong>Unreliable network</strong> — messages are delayed, dropped, or duplicated.</li>
<li><strong>No shared clock</strong> — every machine's clock drifts (P5-07).</li>
<li><strong>No global state</strong> — you cannot atomically observe the whole system.</li>
<li><strong>Unbounded latency</strong> — a call can take arbitrarily long, not just "slow".</li>
</ul>
<p>These are the "eight fallacies of distributed computing" restated. The crucial consequence: <strong>a distributed system is one that forces you to handle failure as part of normal operation</strong>, not as an exception.</p>
<h4>The through-line of this entire phase</h4>
<p>Every tool in Phase 5 exists to make one of those five problems survivable:</p>
<ul>
<li>Partial failure + no global state → <strong>quorums</strong> (P5-05), <strong>heartbeats</strong> (P5-08).</li>
<li>Unreliable network → <strong>retries + idempotency</strong> (P5-12).</li>
<li>No shared clock → <strong>logical clocks</strong> (P5-07).</li>
<li>Disagreement despite failures → <strong>consensus</strong> (P5-09).</li>
</ul>
<p>Learn them in that light — as <em>answers to a specific problem</em> — and nothing in this phase will feel like a list of buzzwords.</p>
<h4>Exercise</h4>
<p>List five things that can go wrong when Service A calls Service B. For each, name the tool from this phase that mitigates it.</p>
`
      },
      {
        id: 'P5-02',
        num: 'P5-02',
        title: "CAP Theorem, Properly",
        time: 12,
        html: `<div class="diagram" data-diagram="cap"></div>
<h4>Build the scenario first</h4>
<p>You have a database replicated across two nodes, A and B, so a user's write goes to both. The network cable between them is cut — a <strong>network partition</strong>. Both nodes are alive; they just cannot talk.</p>
<p>Now a user on A's side writes "balance = 50", and a user on B's side writes "balance = 80". The two nodes now disagree. You have a choice:</p>
<ul>
<li><strong>Let both sides keep accepting writes</strong> — the system stays <em>available</em>, but the two copies <em>diverge</em> (inconsistent), and reconciling later is painful.</li>
<li><strong>Refuse one side's writes</strong> — the system stays <em>consistent</em> (one copy is authoritative), but that side's users get errors (unavailable).</li>
</ul>
<p>That choice — <em>during a partition</em> — is what CAP is about.</p>
<h4>The theorem, stated precisely</h4>
<p>CAP says a distributed system cannot guarantee all three of <strong>C</strong>onsistency (every read sees the latest write), <strong>A</strong>vailability (every request gets a non-error response), and <strong>P</strong>artition tolerance (the system keeps working despite a network split) — <em>at the same time</em>.</p>
<p>Since partitions <em>will</em> happen (cables get cut), P is not optional in a real distributed system. So the practical reading is: <strong>during a partition, do you sacrifice C or A?</strong></p>
<div class="callout callout-watch"><span class="callout-tag">COMMON MISCONCEPTIONS</span>
CAP does <em>not</em> mean "pick any two of the three forever". It is about behavior <em>during a partition specifically</em>. A database is not "CP" as a permanent identity — it is a decision about what happens when nodes cannot talk. Saying "this database is CP" as if it were true all the time is the single most common CAP error.</div>
<h4>Which way do real systems lean?</h4>
<ul>
<li><strong>Banking / payments → consistency</strong>: refuse the transaction rather than risk two conflicting balances (a double-spend is worse than an error).</li>
<li><strong>Social feeds, DNS, shopping carts → availability</strong>: serve a slightly stale feed rather than an error page.</li>
</ul>
<h4>Quick check</h4>
<ul>
<li>Why is P not really a choice in a distributed system?</li>
<li>State, in one sentence, what "CP" actually means — and what it does not mean.</li>
</ul>
`
      },
      {
        id: 'P5-03',
        num: 'P5-03',
        title: "PACELC: the Tradeoff During Normal Operation",
        time: 11,
        html: `
<h4>The gap CAP leaves open</h4>
<p>CAP only talks about <em>during a partition</em> — and partitions are rare. But there is a tradeoff you make <em>every single request, all day long, in normal operation</em>. PACELC names it.</p>
<h4>The full statement</h4>
<ul>
<li><strong>If Partitioned</strong>: choose between <strong>A</strong>vailability and <strong>C</strong>onsistency — that is CAP.</li>
<li><strong>Else</strong> (no partition, the normal case): choose between <strong>L</strong>atency and <strong>C</strong>onsistency.</li>
</ul>
<h4>Why the "else" branch matters more day-to-day</h4>
<p>Most of the time nothing is broken — the system is just processing traffic. Yet a strongly consistent system still pays a cost on <em>every</em> write: it must confirm the write across replicas before acknowledging, which adds a network round-trip. An eventually consistent system acknowledges immediately and propagates in the background — faster, but a reader might briefly see stale data.</p>
<h4>Concrete example</h4>
<ul>
<li><strong>DynamoDB</strong>: AP under partition, and favors Latency normally (eventual consistency by default).</li>
<li><strong>MongoDB (default)</strong>: CP-leaning under partition, favors Consistency over latency normally.</li>
<li><strong>Cassandra</strong>: AP, tunable per query.</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">INTERVIEW</span>Bringing up PACELC <em>after</em> CAP signals you understand the interesting tradeoff exists even when nothing is broken — not only during rare outages. That is a strong, cheap differentiator.</div>
<h4>Quick check</h4>
<ul>
<li>Why is the "else" branch of PACELC the one that affects your users every day?</li>
</ul>
`
      },
      {
        id: 'P5-04',
        num: 'P5-04',
        title: "Consistency Models \u2014 a Real Spectrum",
        time: 13,
        html: `
<h4>The problem: "strong vs eventual" is too coarse</h4>
<p>Saying a system is "eventually consistent" hides a spectrum of guarantees. Different guarantees cost different amounts of latency, and the skill is picking the <em>weakest</em> one that still satisfies the user.</p>
<h4>The spectrum, from strongest to weakest</h4>
<ul>
<li><strong>Linearizability</strong> — every operation appears to take effect atomically at one instant, consistent with real time. If write W finishes before read R starts, R must see W. The gold standard; the most expensive.</li>
<li><strong>Serializability</strong> — transactions execute as if in <em>some</em> serial order. This is an <em>isolation</em> property about transactions, not a real-time property about individual operations. <strong>Linearizability ≠ serializability — they answer different questions.</strong></li>
<li><strong>Causal consistency</strong> — causally-related writes are seen in order (a reply never appears before its parent), but unrelated writes may be seen in any order. The sweet spot for social features: comments and their replies need order; two strangers' posts do not.</li>
<li><strong>Read-your-writes</strong> — you always see your own recent writes (your comment appears immediately after you post it), even if others see it later.</li>
<li><strong>Monotonic reads</strong> — you never see data "go backwards" between refreshes.</li>
<li><strong>Consistent prefix</strong> — you never see a reply before its parent.</li>
<li><strong>Eventual consistency</strong> — replicas converge, eventually, if writes stop.</li>
</ul>
<h4>The skill: match the guarantee to the data</h4>
<ul>
<li>Bank balance → <strong>linearizable</strong>. Reading a stale balance causes real harm.</li>
<li>Like count → <strong>eventual</strong>. Off by a few for two seconds is fine.</li>
<li>Comment thread → <strong>causal</strong>. Ordering between a comment and its reply matters.</li>
<li>"Did my payment go through?" → <strong>read-your-writes</strong>.</li>
</ul>
<div class="callout callout-watch"><span class="callout-tag">COMMON MISCONCEPTION</span>Consistency is not binary. Real systems mix levels per data type — strongly consistent for balances, eventually consistent for counts. Treating it as one global setting is the telltale sign of a memorized answer.</div>
<h4>Exercise</h4>
<p>For each of (account balance, comment + its reply, like count, "did my payment succeed"), name the <em>weakest</em> consistency that suffices — and what breaks if you use one level weaker.</p>
`
      },
      {
        id: 'P5-05',
        num: 'P5-05',
        title: "Quorum Reads & Writes",
        time: 12,
        html: `
<h4>The problem: how many nodes must confirm?</h4>
<p>With N replicas of a piece of data, a write or read should not have to touch all N (slow, and any one failure blocks you). But touching too few risks reading stale data. Quorums let you <em>tune</em> exactly that.</p>
<h4>The rule</h4>
<p>Define <strong>W</strong> = replicas that must acknowledge a write, <strong>R</strong> = replicas that must respond to a read.</p>
<ul>
<li>If <strong>W + R &gt; N</strong>, every read set and write set overlap on at least one replica — so a read is guaranteed to see the latest write. Strong consistency.</li>
<li>If <strong>W + R ≤ N</strong>, reads might miss the latest write — faster, but eventual.</li>
</ul>
<h4>Worked example, N = 3</h4>
<ul>
<li><strong>W=3, R=1</strong>: every write must reach all 3 (slow writes), but any single replica read is guaranteed fresh.</li>
<li><strong>W=1, R=1</strong>: fastest possible; no consistency guarantee (you may read stale data).</li>
<li><strong>W=2, R=2</strong>: the common practical default — any one node can be down and you still have read-write overlap.</li>
</ul>
<h4>Why this matters</h4>
<p>Quorums let you say something precise — "this operation uses W=2, R=2" — instead of hand-waving "it is eventually consistent". Systems like Cassandra and DynamoDB expose exactly these knobs per query. It is also the mechanism behind <em>tolerating</em> node failure: with W=2 you can lose one of three replicas and still serve writes.</p>
<div class="callout callout-watch"><span class="callout-tag">COMMON MISCONCEPTION</span>A quorum is a majority of the <em>replicas of that key</em>, not a majority of all nodes in the cluster. (Relatedly, "sloppy quorums" and hinted handoff let a write be accepted by a non-home node during failure and forwarded later — availability, at a temporary consistency cost.)</div>
<h4>Numerical exercise</h4>
<p>N=4. Pick W and R for (a) fastest possible, (b) strong consistency, (c) strong consistency while tolerating one node down.</p>
`
      },
      {
        id: 'P5-06',
        num: 'P5-06',
        title: "Conflict Resolution & Anti-Entropy",
        time: 13,
        html: `
<h4>The problem: two writers, one key</h4>
<p>The moment you allow more than one writer — multi-leader replication, leaderless writes, or two devices editing offline — two writes to the same key can happen <em>concurrently</em>, with neither causally after the other. Now the replicas disagree, and something must decide.</p>
<h4>Resolution strategies, from simple to correct</h4>
<ul>
<li><strong>Last-write-wins (LWW)</strong> — keep the write with the newest timestamp. Simple, and wrong in subtle ways: a clock that is 5 minutes behind (P5-07) or two genuinely concurrent writes both "win" one replica each, and one is <em>silently lost</em>.</li>
<li><strong>Version vectors</strong> — each node counts its own updates in a vector <code>[a, b, c]</code>. Comparing vectors tells you precisely whether one version is an ancestor of the other, or whether they are <em>concurrent</em>. Concurrent versions are kept and merged (by the app, or on next read) — no silent loss.</li>
<li><strong>CRDTs</strong> — data structures designed so concurrent updates <em>merge without coordination</em> (counters, sets, text). The payoff is collaborative editing (P8-20); intro-level only here.</li>
</ul>
<h4>Keeping replicas in sync</h4>
<ul>
<li><strong>Read repair</strong> — a read notices stale or missing replicas and fixes them on the spot.</li>
<li><strong>Anti-entropy</strong> — a background process hashes each replica's data and compares. <strong>Merkle trees</strong> (hash trees) make this cheap: only subtrees whose hashes differ need to be transferred, so two 1 TB replicas can find their 3 differences in logarithmic comparisons.</li>
</ul>
<div class="callout callout-tradeoff"><span class="callout-tag">TRADEOFF</span>LWW buys simplicity at the price of silent data loss; version vectors/CRDTs buy correctness at the price of complexity and storage. Dropbox (offline file edits) and DynamoDB sit on opposite sides of this line — name which side each is on and why.</div>
<h4>Exercise</h4>
<p>Two devices edit the same note offline. Walk through what LWW does (loses an edit) and what a version vector does (keeps both). Which does a note-taking app need?</p>
`
      },
    ],
  },
  {
    id: 'm5b',
    track: 'phase5',
    title: "Time, Election & Consensus",
    icon: '5B',
    topics: [
      {
        id: 'P5-07',
        num: 'P5-07',
        title: "Time & Ordering: Lamport & Vector Clocks",
        time: 13,
        html: `
<h4>The problem: there is no shared clock</h4>
<p>Every machine's clock drifts, and NTP corrections are coarse. If you order events by wall-clock time across machines, a machine whose clock is 5 minutes slow will make a <em>newer</em> write look <em>older</em> — and last-write-wins (P5-06) will silently drop the new one. This is a real class of production bug.</p>
<h4>Happens-before, and how to track it</h4>
<ul>
<li><strong>Happens-before (→)</strong>: event a happens-before b if they are on the same process and a precedes b, or if a is a message send and b is its receive (causality flows along messages).</li>
<li><strong>Lamport clock</strong> — each process keeps a counter, incremented on every event; every message carries the sender's counter and the receiver jumps past it. Guarantee: <strong>if a→b then C(a) &lt; C(b)</strong>. But the converse is false — C(a) &lt; C(b) does <em>not</em> prove a caused b. Lamport gives you an order, not the causal story.</li>
<li><strong>Vector clock</strong> — a counter <em>per process</em>: <code>[A=3, B=1]</code>. Comparing vectors tells you whether one event happened-before the other, or whether they are concurrent. This is the precise tool, and what version vectors (P5-06) are built on.</li>
<li><strong>Total-order broadcast</strong> — if you truly need one global order across all nodes (everyone agrees "this is next"), that requires <em>consensus</em> (P5-09), not clocks alone.</li>
</ul>
<div class="callout callout-watch"><span class="callout-tag">COMMON MISCONCEPTION</span>"Order by timestamp" is not a correctness mechanism — timestamps are wall-clock values that lie. Logical clocks were invented precisely because timestamps lie.</div>
<h4>Exercise</h4>
<p>Three events across two nodes: A sends to B, B processes, B sends to A. Assign Lamport timestamps, then show why Lamport cannot tell a concurrent pair from a causal pair — and how a vector clock can.</p>
`
      },
      {
        id: 'P5-08',
        num: 'P5-08',
        title: "Leader Election, Failure Detection, Split-Brain & Fencing",
        time: 14,
        html: `
<h4>The problem: who is in charge, and what if two think they are?</h4>
<p>In a leader-follower system, when the leader dies, the followers must elect a new one — automatically, and without <strong>split-brain</strong> (two nodes both believing they are leader).</p>
<h4>Detecting failure</h4>
<ul>
<li><strong>Heartbeats</strong> — nodes periodically signal "I am alive"; missed heartbeats trigger suspicion.</li>
<li><strong>Naive timeouts misfire</strong> — a brief network blip can look like death and trigger an unnecessary election. Real systems use timeouts well above expected jitter, and <strong>φ-accrual detectors</strong> express a <em>suspicion level</em> (0 to 1) instead of a binary up/down.</li>
</ul>
<h4>Electing without split-brain</h4>
<p>Election requires a <strong>majority (quorum)</strong>. Because any two majorities overlap, it is impossible for two different nodes to both win a majority — so split-brain <em>elections</em> are prevented. But majority-based election only stops two nodes from being <em>elected</em>; it does not stop the <em>old</em> leader (partitioned away, unaware) from continuing to write.</p>
<h4>Fencing tokens — the fix for the old leader</h4>
<p>Every election issues a monotonically-increasing <strong>fencing token</strong> (a number). Every write carries its leader's token; storage remembers the highest token it has seen and <strong>rejects any write with a lower one</strong>. The paused old leader wakes up and writes — storage says no. This is the correct, industry-standard recipe for "only one writer, ever".</p>
<div class="callout callout-tip"><span class="callout-tag">INTERVIEW</span>"Majority quorum for election + fencing token enforced by storage" is the complete, senior answer to "how do you prevent split-brain?" — and it connects directly to leases (P5-10) and Raft (P5-09).</div>
<h4>Exercise</h4>
<p>A leader is paused by GC for 2 minutes, then resumes and writes. Trace what happens with and without fencing tokens.</p>
`
      },
      {
        id: 'P5-09',
        num: 'P5-09',
        title: "Consensus: Raft (& Paxos in Context)",
        time: 15,
        html: `
<h4>The problem consensus solves</h4>
<p>Several nodes must <em>agree on a single value or order</em> — "who is leader", "what is the next entry in the log" — even while some nodes fail and messages are delayed. That agreement, despite failures, is the hard problem underneath replicated state machines and leader election.</p>
<h4>The core idea (why majorities work)</h4>
<p>A proposal is only accepted if a <strong>majority</strong> agrees. Because any two majorities must overlap by at least one node, two conflicting values can never both get majority approval. That overlap is the entire trick — it is what makes split-brain impossible, in one sentence.</p>
<h4>Raft, step by step</h4>
<ul>
<li><strong>Leader election</strong> — time is divided into <em>terms</em>; a node that stops hearing from the leader starts an election, asks for votes, and wins with a majority. The term number is the fencing token from P5-08.</li>
<li><strong>Log replication</strong> — the leader appends entries to its log and replicates them to followers; an entry is <em>committed</em> once stored on a majority.</li>
<li><strong>Safety</strong> — a node can only win an election if its log is at least as up-to-date as a majority's, so a newly elected leader never has a <em>shorter</em> history than committed entries. The committed prefix is therefore never lost.</li>
<li><strong>Membership changes</strong> — adding/removing nodes happens through the log itself, so the cluster never has two conflicting configurations.</li>
</ul>
<h4>Paxos and the coordination stores</h4>
<p>Paxos is the original, provably correct algorithm — notoriously hard to implement, which is <em>why Raft exists</em> (same guarantees, designed for understandability). <strong>etcd and ZooKeeper are Raft-backed coordination stores</strong>: leader election, configuration, locks, watches. In an interview you say "we'd use etcd/ZooKeeper for leader election" and move on — unless the interviewer wants the algorithm, in which case you have the majority story above.</p>
<div class="callout callout-watch"><span class="callout-tag">COMMON MISCONCEPTION</span>Consensus is not voting on everything. It is a <em>slow, quorum-gated</em> mechanism you use for the rare decisions that must be unanimous — leadership, membership, a replicated log — not for every data write.</div>
<h4>Exercise</h4>
<p>Walk through a Raft election after the leader crashes: who starts it, who can win, and why the new leader's log is guaranteed safe.</p>
`
      },
      {
        id: 'P5-10',
        num: 'P5-10',
        title: "Distributed Locks & Leases",
        time: 13,
        html: `
<h4>The problem: a naive lock is broken</h4>
<p>You need "only one worker runs this job at a time" across 10 machines. The naive answer — a Redis key with a TTL — fails in a specific way: worker A takes the lock, then gets <strong>paused by garbage collection longer than the TTL</strong>. The lock expires; worker B takes it. A resumes, still believing it owns the lock — and now two workers run the job.</p>
<h4>Why TTL alone cannot save you</h4>
<p>Checking "is it still mine?" before acting helps, but there is always a race window between the check and the act — and in a pause, any window is hit eventually. The root cause: the lock's <em>authority</em> and the protected resource's <em>memory of who is allowed</em> are not connected.</p>
<h4>The correct recipe: leases + fencing tokens</h4>
<ul>
<li><strong>Lease</strong> — a lock with time-bounded ownership; the holder must finish before expiry or renew.</li>
<li><strong>Fencing token</strong> — the lease carries a monotonically-increasing number; the protected resource rejects any operation whose token is lower than the highest it has seen (P5-08). When the paused worker A finally writes with its stale token, the resource refuses.</li>
<li>Practical shape: take a lease in a coordination store (etcd/ZooKeeper) that hands out fencing tokens, and have the storage side enforce them.</li>
</ul>
<h4>Redlock, briefly</h4>
<p>Redlock is Redis's distributed-lock algorithm; it is widely used and widely debated (its safety depends on timing assumptions). The takeaway for interviews: for correctness-critical work, prefer <em>fencing + leases</em>; know that Redlock exists and is contested.</p>
<div class="callout callout-tip"><span class="callout-tag">INTERVIEW</span>"For a job that must run once across 10 workers, I'd use a lease with a fencing token in etcd/ZooKeeper, not a bare Redis SET NX" — that sentence demonstrates you know <em>why</em> naive locks fail.</div>
<h4>Exercise</h4>
<p>Design the lock for a once-per-day job; show exactly where the naive version double-runs, and how the fencing token stops it.</p>
`
      },
    ],
  },
  {
    id: 'm5c',
    track: 'phase5',
    title: "Distributed Transactions",
    icon: '5C',
    topics: [
      {
        id: 'P5-11',
        num: 'P5-11',
        title: "Distributed Transactions: 2PC, Saga, Outbox, CDC",
        time: 15,
        html: `
<h4>The problem: a transaction that spans machines</h4>
<p>A single database gives you ACID for free. But a transaction across <em>multiple services, each with its own database</em> — "reserve inventory, charge payment, create shipment" — has no single ACID boundary. This is the distributed transaction problem.</p>
<h4>Two-phase commit (2PC) — the strong option</h4>
<ul>
<li><strong>Prepare</strong>: a coordinator asks every participant "can you commit?" — each locks its resources and answers yes/no.</li>
<li><strong>Commit</strong>: if all said yes, everyone commits; if any said no, everyone rolls back.</li>
<li><strong>Cost</strong>: participants hold locks the whole time (<em>blocking</em>), and if the coordinator crashes mid-protocol, participants can be stuck waiting. Strong, but fragile and unscalable across services.</li>
</ul>
<h4>Saga — the available option</h4>
<p>Break the transaction into a sequence of <em>local</em> transactions, each with a <strong>compensation</strong> that undoes it if a later step fails. Example: (1) reserve inventory, (2) charge, (3) ship. If step 3 fails, run compensations for 1–2 (release inventory, refund). No long-held locks, high availability — but the system is <em>eventually consistent</em> during the saga, and compensations must be designed (not every action is perfectly reversible).</p>
<h4>Orchestration vs choreography</h4>
<ul>
<li><strong>Orchestration</strong> — one coordinator drives the saga step by step. Easy to see the whole flow; the coordinator is a single point of failure (mitigated, but a SPOF).</li>
<li><strong>Choreography</strong> — services react to each other's events; no central coordinator. No SPOF, but the flow is spread out and hard to trace.</li>
</ul>
<h4>The outbox pattern — the atomic "DB write + publish" problem</h4>
<p>A saga step must <em>commit its DB change and publish its event</em> — but those are two systems, and you cannot atomically do both. If the DB commits and the publish fails, the next step never runs. The outbox fixes it: write the business change <em>and</em> the event into an <strong>outbox table in one local transaction</strong>; a relay reads the outbox and publishes (at-least-once). Atomicity is now local; delivery is reliable.</p>
<h4>CDC — the alternative to the outbox</h4>
<p>Change data capture tails the database's own log (WAL/binlog, via Debezium) and streams changes. When you already have a log, you do not need a second one (the outbox). Use CDC when you want <em>all</em> changes streamed; use the outbox when you need a curated, semantic event.</p>
<div class="callout callout-tradeoff"><span class="callout-tag">TRADEOFF</span>2PC: strong, blocking, coordinator SPOF, doesn't scale. Saga: available, scalable, eventually consistent, real compensation complexity. Modern microservice systems overwhelmingly choose sagas — and name why.</div>
<h4>Exercise</h4>
<p>Order flow (reserve → charge → ship) fails at "charge". Write the compensations. Then design the outbox table + relay for the "charge" step.</p>
`
      },
      {
        id: 'P5-12',
        num: 'P5-12',
        title: "Delivery Semantics & Idempotency",
        time: 14,
        html: `
<h4>The problem: the lost response</h4>
<p>A client sends a request. The server processes it. The response is lost. The client, not knowing whether it succeeded, retries — and the server just double-charged a customer or created a duplicate order. <em>This</em> is the problem idempotency solves, and it is the single most-tested concept in distributed-systems interviews.</p>
<h4>The delivery-semantics taxonomy</h4>
<ul>
<li><strong>At-most-once</strong> — send once, no retries. May <em>lose</em> messages. Fine for metrics pings; wrong for money.</li>
<li><strong>At-least-once</strong> — retry until acknowledged. May <em>duplicate</em>. This is what retries give you.</li>
<li><strong>Exactly-once</strong> — <strong>impossible in general</strong>. The final acknowledgment can always be lost, which forces a resend, which forces deduplication — there is no protocol that removes the need for the receiver to dedupe.</li>
</ul>
<h4>The honest recipe: effectively-once</h4>
<p><strong>At-least-once delivery + idempotent processing = effectively-once.</strong> You cannot make delivery exact, but you can make <em>processing</em> idempotent:</p>
<ul>
<li><strong>Idempotency key</strong> — the client generates a unique key per logical operation (a payment, an order) and sends it with the request; the server stores the key (unique-constrained) and, on a repeat, returns the <em>original</em> result instead of re-executing.</li>
<li><strong>Deduplication store</strong> — for events, the consumer records processed event IDs and skips duplicates.</li>
</ul>
<div class="callout callout-watch"><span class="callout-tag">COMMON MISCONCEPTION</span>"Exactly-once" is a marketing word; "effectively-once" is an engineering result. Being able to state the difference — and that the receiver <em>must</em> dedupe — is a senior signal.</div>
<h4>Why this connects everywhere</h4>
<ul>
<li>Payments (P8-05): the idempotency key is the whole safety mechanism.</li>
<li>Notification fan-out (P8-11): dedup by notification ID so users never get two pushes.</li>
<li>Retries (P6-03): retry only idempotent operations, or carry an idempotency key.</li>
</ul>
<h4>Exercise</h4>
<p>A payment API receives the same request twice (timeout + retry). Design it so the customer is charged exactly once — write the key schema and the retry path.</p>
`
      },
      {
        id: 'P5-13',
        num: 'P5-13',
        title: "Network Partitions & Partial-Failure Drills",
        time: 11,
        html: `
<h4>Put the whole phase together</h4>
<p>Everything in Phase 5 exists to survive specific failures. This sheet is the drill: walk a cluster through each failure and say, precisely, what happens.</p>
<h4>The drills</h4>
<ul>
<li><strong>Node down</strong> — heartbeats miss → suspicion (P5-08). Leaderless: another replica answers, hinted handoff remembers the write for the dead node. Leader-based: failover elects a new leader (P5-09).</li>
<li><strong>Slow network</strong> — timeouts fire; retries with backoff + jitter (P6-03); idempotency keys prevent double-effects (P5-12).</li>
<li><strong>Partition (A | B | C)</strong> — only a <em>majority side</em> can elect a leader or reach quorum (P5-05); the minority side must refuse writes or risk split-brain.</li>
<li><strong>Partition heals</strong> — the two sides diverged while apart; they reconcile via anti-entropy + version vectors (P5-06).</li>
</ul>
<h4>Worked example</h4>
<p>A 5-node cluster splits 2 | 3. Which side elects a leader? <strong>The 3-side</strong> (it has a majority). Which side serves writes? <strong>The 3-side</strong> (a quorum of 3 exists). What happens when it heals? The 2-side re-syncs — discarding uncommitted writes and merging committed ones, using version vectors to resolve any divergence.</p>
<div class="callout callout-tip"><span class="callout-tag">INTERVIEW</span>"What happens when this node dies?" is the single most common steering question in system-design interviews. If you cannot answer it for every box in your diagram, that is exactly the gap the interviewer will probe.</div>
<h4>Exercise</h4>
<p>Repeat the 2|3 drill for a 4-node cluster split 2|2. What changes? (Answer: no side has a majority — neither can elect a leader or reach a 3-quorum; the cluster is effectively down for writes until the partition heals. This is why clusters use odd node counts.)</p>
`
      },
    ],
  },
  {
    id: 'm6a',
    track: 'phase6',
    title: "Availability & Resilience",
    icon: '6A',
    topics: [
      {
        id: 'P6-01',
        num: 'P6-01',
        title: "Availability Math & SLOs/SLIs/Error Budgets",
        time: 12,
        html: `
<h4>The problem: "is it reliable enough?" has no answer without numbers</h4>
<p>"Highly available" is a feeling; "99.95%" is a contract. Availability math and SLOs turn reliability into something you can measure, promise, and budget.</p>
<h4>Availability math</h4>
<ul>
<li><strong>Availability = MTBF / (MTBF + MTTR)</strong> — mean time between failures, over that plus mean time to recover. You improve availability by failing less <em>often</em> (MTBF) or recovering <em>faster</em> (MTTR) — the second is usually far cheaper.</li>
<li>The nines: 99% ≈ 3.65 days/yr · 99.9% ≈ 8.8 h · 99.99% ≈ 52 min · 99.999% ≈ 5 min.</li>
<li>Each additional nine costs <em>disproportionately</em> more engineering. A note-taking app does not need five nines — justify the target against what the system actually needs.</li>
</ul>
<h4>SLI → SLO → SLA</h4>
<ul>
<li><strong>SLI</strong> (indicator) — what you measure: p99 latency, error rate, uptime.</li>
<li><strong>SLO</strong> (objective) — the internal target: "99.95% availability, p99 under 200 ms".</li>
<li><strong>SLA</strong> (agreement) — the external contract, with consequences (credits, penalties) for breach.</li>
</ul>
<h4>The error budget — the tool that changes how you ship</h4>
<p><strong>Error budget = 1 − SLO.</strong> If your SLO is 99.95%, you are allowed 0.05% unreliability — about 4.4 hours a month. When the budget is burning fast, you freeze risky deploys; when it is healthy, you can afford to move fast. It converts "reliability vs velocity" into an explicit bank account.</p>
<h4>Latency budgets — the same idea per request</h4>
<p>Pick an end-to-end target (feed under 200 ms), then subtract each hop's cost using the P0-07 table — DNS, TLS, network, app, cache, DB. What remains is the budget for the component you are about to deep-dive. This is how you answer "how fast does this component need to be?"</p>
<div class="callout callout-watch"><span class="callout-tag">COMMON MISCONCEPTION</span>Average latency hides the worst experiences. Report <strong>p99</strong> (or p95/p999): "1% of users wait over 2 seconds" is the number that matters, and "average is fine" is how outages sneak up on you.</div>
<h4>Numerical exercise</h4>
<p>A service has SLO "99.95% availability, p99 under 200 ms". Compute the monthly error budget in minutes. Then name the SLI you would dashboard and the one alert you would page on.</p>
`
      },
      {
        id: 'P6-02',
        num: 'P6-02',
        title: "Fault Tolerance: Redundancy & Failover",
        time: 6,
        html: `<p>At scale, hardware fails constantly — disks die, machines crash, network links drop. Designing for failure as the default, not the exception, is what separates a resilient design from a fragile one.</p>
<h4>Core techniques</h4>
<ul>
<li><strong>Redundancy</strong>: run multiple copies of every critical component (servers, databases, even data centers) so no single failure takes the system down</li>
<li><strong>Failover</strong>: automatically routing traffic to a healthy replica when the primary fails, ideally without user-visible impact</li>
<li><strong>Health checks & heartbeats</strong>: components periodically signal "I'm alive"; missed heartbeats trigger failover</li>
<li><strong>Graceful degradation</strong>: when a non-critical dependency fails, serve a reduced experience instead of a hard error (e.g., show a feed without personalized ranking if the ranking service is down)</li>
<li><strong>Replication across availability zones/regions</strong>: protects against an entire data center going offline</li>
</ul>
<div class="callout callout-tradeoff"><span class="callout-tag">TRADEOFF</span>Redundancy costs money and adds coordination complexity (keeping replicas in sync). The right amount of redundancy is proportional to how costly downtime actually is for that specific system.</div>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>When you draw a component in an interview, ask yourself "what happens when this dies?" If you don't have an answer, that's exactly the gap the interviewer will probe.</div>`
      },
      {
        id: 'P6-03',
        num: 'P6-03',
        title: "Timeouts, Retries, Exponential Backoff + Jitter",
        time: 13,
        html: `
<h4>The problem: the most common self-inflicted outage</h4>
<p>Two mistakes, usually made together: <strong>no timeouts</strong>, and <strong>retries that synchronize into a storm</strong>. Service A calls Service B with no timeout; B degrades to 10 seconds. A's threads pile up waiting; A's pool saturates; A stops answering <em>its</em> callers. Then every client retries at the same cadence, and the instant B recovers, it is hit by a synchronized wall of retries and dies again.</p>
<h4>The four rules</h4>
<ul>
<li><strong>Set a timeout</strong> — bounded waiting: p99 of the dependency + headroom (e.g. B's p99 is 400 ms → timeout at 1 s). An unbounded wait exhausts threads/connections (P0-08).</li>
<li><strong>Retry only idempotent operations</strong> — a retried POST can double-charge (P5-12). If it is not idempotent, carry an idempotency key.</li>
<li><strong>Exponential backoff + full jitter</strong> — wait 100 ms → 200 ms → 400 ms… <em>with a random component</em>. Without jitter, 1,000 retrying clients stay synchronized and re-form the storm. With full jitter, their retries spread across the window.</li>
<li><strong>Deadline propagation</strong> — pass the overall request deadline down every hop (gRPC deadlines). A late answer is a wrong answer; stop the whole tree on time, not hop by hop.</li>
</ul>
<h4>The retry storm, quantified</h4>
<p>1,000 clients retry a dead endpoint every 100 ms with no jitter → up to 10,000 req/s hammering it the moment it returns. With full jitter across a 400 ms window, the same retries spread to ~2,500 req/s, and they never synchronize. That is why jitter is not optional.</p>
<div class="callout callout-tip"><span class="callout-tag">INTERVIEW</span>The ordering of the resilience tools — timeout → retry+backoff → circuit breaker → bulkhead → shed — is itself the senior answer to "what happens when a dependency gets slow?"</div>
<h4>Exercise</h4>
<p>Design the retry policy for a payments call: timeout, max attempts, backoff base, jitter — and state which operations may retry and which may not.</p>
`
      },
      {
        id: 'P6-04',
        num: 'P6-04',
        title: "Circuit Breakers, Bulkheads, Backpressure, Load Shedding",
        time: 13,
        html: `
<h4>The problem: one slow dependency must not take down the system</h4>
<p>Service A calls B, C, and D. B gets slow. Without protection, A's threads pile up waiting on B, A's resources are consumed, and A becomes slow for <em>everyone</em> — the failure cascades. Four tools stop this, and they fire in order.</p>
<h4>1 · Circuit breaker</h4>
<p>Wrap calls to a dependency and track failures. After a threshold, the circuit <strong>opens</strong> — further calls fail <em>immediately</em> without even trying the dependency. After a cooldown, it goes <strong>half-open</strong>: a single probe request checks if the dependency recovered; success closes the circuit, failure reopens it. This protects the struggling dependency from being hammered and protects you from wasting resources on it.</p>
<h4>2 · Bulkhead</h4>
<p>Isolate resource pools <em>per dependency</em>. If B is allowed at most 20 of A's 200 threads, then even a catastrophic B cannot starve C and D — the failure is contained in B's compartment, like watertight ship compartments.</p>
<h4>3 · Backpressure</h4>
<p>Use <em>bounded</em> queues and buffers. When a queue fills, slow or reject producers instead of accepting unbounded work. TCP flow control is the original backpressure: the receiver advertises a window, and the sender stops when it is full.</p>
<h4>4 · Load shedding</h4>
<p>Under overload, drop low-priority work <em>fast</em>. Returning a 503 in 1 ms to 20% of requests beats returning everything in 10 seconds. Shed the cheap, non-critical path (recommendations, analytics) and keep the core (checkout, post).</p>
<div class="callout callout-tradeoff"><span class="callout-tag">TRADEOFF</span>Every one of these trades a bit of availability or completeness for <em>stability</em>. The judgment is in the order and the thresholds: fail fast on a dead dependency, isolate its pool, shed non-critical work — and keep the critical path correct.</div>
<h4>Exercise</h4>
<p>Diagram all four for a service with 3 dependencies, and explain the order they engage as one dependency degrades from slow → dead → recovering.</p>
`
      },
      {
        id: 'P6-05',
        num: 'P6-05',
        title: "Graceful Degradation & Fallbacks",
        time: 6,
        html: `<p>When a non-critical dependency fails, serve a reduced-but-functional experience instead of a hard error.</p><ul><li>Feed page depends on ranking → fall back: personalized → generic → cached → static.</li><li>Search down → show recent items instead of ranked results.</li><li>The rule: degrade the <strong>non-critical</strong> path; keep the core transaction (pay, post, book) strictly correct.</li><li>Feature flags (P7-09) are your degradation levers — flip a kill switch without a deploy.</li></ul><div class="callout callout-tradeoff"><span class="callout-tag">TRADEOFF</span>Degradation trades quality for availability — always the right call for a read path, never an excuse to corrupt a write path.</div>`
      },
    ],
  },
  {
    id: 'm6b',
    track: 'phase6',
    title: "Operations & Security",
    icon: '6B',
    topics: [
      {
        id: 'P6-06',
        num: 'P6-06',
        title: "Disaster Recovery: Backups, RPO/RTO, Multi-Region",
        time: 13,
        html: `
<h4>The problem: replication is not backup</h4>
<p>Replication protects you from <em>hardware failure</em>. It does <strong>not</strong> protect you from a bad deploy, a wrong <code>UPDATE</code> that nukes a table, or ransomware — those faithfully replicate to every copy. Only <em>backups</em> save you from logical destruction. This is the distinction that separates a disaster-recovery plan from a wish.</p>
<h4>The two numbers you must name</h4>
<ul>
<li><strong>RPO — Recovery Point Objective</strong>: how much data you can afford to lose, measured in time. RPO = 0 means no committed write may be lost.</li>
<li><strong>RTO — Recovery Time Objective</strong>: how fast you must be back up.</li>
<li>They pull against cost: RPO = 0 requires <em>synchronous</em> replication to a standby; RTO under 15 minutes requires <em>automated</em> failover plus a tested runbook. Manual anything will not meet it.</li>
</ul>
<h4>Backups & the drill</h4>
<ul>
<li>Full + incremental + continuous WAL archiving; store immutable and cross-account (so a compromised account cannot delete its own backups).</li>
<li><strong>An untested restore is not a backup.</strong> Quarterly: restore snapshot + replay WAL into a scratch environment and verify balances match the ledger. This is the step almost everyone skips — and the one that fails on the bad day.</li>
</ul>
<h4>Multi-region: active-passive vs active-active</h4>
<ul>
<li><strong>Active-passive</strong> — one region serves, a standby replicates. Cheap; failover is slower and may lose a little (async) or nothing (sync).</li>
<li><strong>Active-active</strong> — both regions serve. Expensive; you now have multi-leader replication with real conflict/consistency complexity (P4-05, P5-06).</li>
<li>The payments trick (P8-05): even active-active systems often pin an account's writes to one "home region" to preserve local ACID.</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">INTERVIEW</span>Opening any DR discussion with "payments: RPO = 0, RTO under 15 min" is a fast, senior-sounding move — it shows you know the two numbers are the entire contract.</div>
<h4>Exercise</h4>
<p>For a payments DB, design the replication + failover + backup/restore plan to hit RPO = 0, RTO under 15 min — and list what you would destroy and restore in a quarterly drill to prove it.</p>
`
      },
      {
        id: 'P6-07',
        num: 'P6-07',
        title: "Observability: Logs, Metrics, Traces, Alerting",
        time: 8,
        html: `<p>At scale, you can't SSH into a server and read a log file to understand what's happening — observability is how you understand a distributed system's behavior from the outside.</p>
<h4>The three pillars</h4>
<ul>
<li><strong>Logs</strong>: discrete, timestamped events ("user 123 login failed") — best for debugging a specific incident after the fact</li>
<li><strong>Metrics</strong>: numeric measurements over time (request rate, error rate, latency percentiles) — best for dashboards, alerting, and spotting trends</li>
<li><strong>Traces</strong>: follow a single request as it moves across multiple services, showing where time was spent — essential in microservices where one user action might touch a dozen services</li>
</ul>
<h4>Why this matters in a design interview</h4>
<ul>
<li>Bringing up "we'd emit metrics like p99 latency and error rate, with alerting on thresholds" in your wrap-up shows production maturity beyond just making the happy path work</li>
<li>Distributed tracing (e.g. using a correlation ID passed through every service call) is the direct answer to "how would you debug why a request was slow" in a microservices design</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>Mentioning <strong>p99 latency</strong> specifically (not just average) signals real production experience — averages hide the worst experiences a meaningful fraction of your users actually have.</div><h4>Alerting & the RED/USE methods (new)</h4><ul><li><strong>RED</strong> for services: Rate, Errors, Duration (p99, not average).</li><li><strong>USE</strong> for infrastructure: Utilization, Saturation, Errors.</li><li><strong>Alert on symptoms</strong> (error rate, p99, burn rate) not causes; separate pages from tickets.</li><li>Structured logs + a correlation ID threaded through every hop is how you debug one slow request across 4 services.</li></ul><div class="callout callout-tip"><span class="callout-tag">TIP</span>In a wrap-up, "we'd emit p99 latency and error rate, alerting on thresholds" shows production maturity beyond the happy path.</div>`
      },
      {
        id: 'P6-08',
        num: 'P6-08',
        title: "Security Fundamentals for System Design",
        time: 13,
        html: `
<h4>The problem: a system that works is not a system that is safe</h4>
<p>Security in system design is usually a short checklist — but a <em>correct</em> one. You are not designing a crypto protocol; you are placing standard controls correctly.</p>
<h4>Authentication & authorization (the familiar part)</h4>
<ul>
<li><strong>AuthN</strong> (who you are): sessions vs <strong>JWT</strong> (stateless, verifiable by signature — but hard to revoke before expiry); <strong>OAuth 2.0 / OIDC</strong> for "log in with Google" and delegated access.</li>
<li><strong>AuthZ</strong> (what you may do): <strong>RBAC</strong> (roles → permissions; simple, ubiquitous) vs <strong>ABAC</strong> (attributes — user, resource, time; flexible, complex).</li>
</ul>
<h4>The rest of the checklist — what most candidates miss</h4>
<ul>
<li><strong>In transit</strong> — TLS at the edge; <strong>mTLS</strong> between services (both sides prove identity — what TLS alone does <em>not</em> do).</li>
<li><strong>At rest</strong> — encrypt disks/DB/objects; protects against stolen media, not against app-level bugs (know the boundary).</li>
<li><strong>Passwords</strong> — hash with bcrypt/argon2. Hashing ≠ encryption: you must never be able to "decrypt" a password back.</li>
<li><strong>API abuse</strong> — DDoS (volumetric vs application-layer), WAF, rate limiting as one layer (insufficient alone, P3-12), input validation (SQLi, XSS).</li>
<li><strong>Least privilege + secrets management</strong> — services get the minimum permissions; secrets live in a vault, never in code.</li>
<li><strong>Threat-modeling-lite</strong> — for each component: who can touch it, and how could they abuse it?</li>
</ul>
<h4>The one-liner that covers a public API</h4>
<p>"TLS at the edge, mTLS between services, JWT auth with RBAC at the gateway, rate limiting + WAF, secrets in a vault, data encrypted at rest." Saying that once — then moving on to the system-specific problem — is exactly the right depth.</p>
<div class="callout callout-watch"><span class="callout-tag">COMMON MISCONCEPTION</span>Encryption at rest does not protect against a SQL injection that reads the data through the application — the app has the keys. Each control protects against a specific threat; name the threat, not just the control.</div>
<h4>Exercise</h4>
<p>List the security controls for a public payments API, and say what mTLS adds that TLS alone does not.</p>
`
      },
    ],
  },
  {
    id: 'm7a',
    track: 'phase7',
    title: "Async & Streaming at Scale",
    icon: '7A',
    topics: [
      {
        id: 'P7-01',
        num: 'P7-01',
        title: "Message Queues & Pub/Sub",
        time: 8,
        html: `<p>The core building blocks for decoupling producers and consumers in an asynchronous architecture.</p>
<div class="diagram" data-diagram="queue"></div>
<h4>Message queues (point-to-point)</h4>
<ul>
<li>Producer puts a message on a queue; exactly one consumer picks it up and processes it</li>
<li>Once processed, the message is removed — good for distributing work items across a pool of workers (e.g. image resize jobs)</li>
<li>Examples: SQS, RabbitMQ</li>
</ul>
<h4>Publish/Subscribe (pub/sub)</h4>
<ul>
<li>Producer publishes to a topic; every subscriber to that topic gets its own copy of the message</li>
<li>Good for fan-out: one event, many independent consumers reacting to it (e.g. "order placed" triggers inventory update, email, and analytics, independently)</li>
<li>Examples: Kafka, SNS, Google Pub/Sub</li>
</ul>
<h4>Why they matter in design interviews</h4>
<ul>
<li>Absorb traffic spikes: producers can write faster than consumers process, without dropping requests, because the queue buffers the backlog</li>
<li>Decouple failure domains: a consumer being down doesn't block the producer, messages just wait</li>
<li>Enable retries: a failed message can be retried or moved to a dead-letter queue instead of being silently lost</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>Whenever you have a slow, non-critical-path operation (sending an email, generating a thumbnail, updating a search index), moving it off the synchronous request path and onto a queue is a strong, easy design win to mention.</div>`
      },
      {
        id: 'P7-02',
        num: 'P7-02',
        title: "Kafka Concepts",
        time: 7,
        html: `<p>Kafka is a <strong>distributed commit log</strong> — not a task queue. That one sentence explains most of its behavior.</p><ul><li><strong>Topic / partition</strong> — a topic is split into partitions; <strong>ordering is guaranteed only within a partition</strong>.</li><li><strong>Consumer groups</strong> — consumers in a group share partitions (each partition → one consumer); groups get independent copies (that's your pub/sub).</li><li><strong>Offsets</strong> — consumers track their position; reprocessing = reset the offset.</li><li><strong>Retention & replication</strong> — messages kept for a time/size window; partitions replicated; acks control durability vs latency.</li><li><strong>ISR</strong> — in-sync replicas; a write is "committed" when ISR acks.</li></ul><h4>Kafka vs RabbitMQ/SQS</h4><ul><li>Kafka: high-throughput log, replay, ordering per key — event backbone.</li><li>RabbitMQ/SQS: per-message routing, per-message ack, dead-letter queues — work queues.</li><li>Need global order for one entity? Partition by its key — and accept that other entities interleave.</li></ul><div class="callout callout-watch"><span class="callout-tag">WATCH</span>"Just use Kafka" is the classic over-engineering answer. If you need a work queue with retries and don't need replay/ordering, a plain queue is simpler and safer.</div>`
      },
      {
        id: 'P7-03',
        num: 'P7-03',
        title: "Batch vs Stream Processing",
        time: 6,
        html: `<p>Two philosophies for processing large volumes of data, trading off latency against efficiency and complexity.</p>
<h4>Batch processing</h4>
<ul>
<li>Data is collected over a period, then processed all at once (e.g. nightly analytics jobs, monthly billing runs)</li>
<li>High throughput, efficient use of resources (can optimize for the whole dataset at once), but results are only as fresh as the last batch run</li>
<li>Tools: Hadoop, Spark (batch mode)</li>
</ul>
<h4>Stream processing</h4>
<ul>
<li>Data is processed continuously, record by record (or in small micro-batches), as it arrives</li>
<li>Low latency — results reflect near-real-time state — but more complex infrastructure and harder to reason about (out-of-order events, windowing)</li>
<li>Tools: Kafka Streams, Flink, Spark Streaming</li>
</ul>
<div class="callout callout-tradeoff"><span class="callout-tag">TRADEOFF</span>Batch is simpler and cheaper per unit of data processed; stream is necessary when the business need is genuinely real-time (fraud detection, live dashboards, trending topics). Don't reach for streaming infrastructure for a report that only needs to be accurate as of yesterday.</div>`
      },
      {
        id: 'P7-04',
        num: 'P7-04',
        title: "Event-Driven Architecture; Event Sourcing & CQRS",
        time: 8,
        html: `<p>An architectural style where services communicate primarily by producing and reacting to events, rather than calling each other directly.</p>
<h4>Core idea</h4>
<ul>
<li>A service publishes an event describing something that happened ("OrderPlaced", "UserSignedUp") without knowing or caring who's listening</li>
<li>Other services subscribe to the events they care about and react independently</li>
</ul>
<h4>Benefits</h4>
<ul>
<li>Loose coupling: producers don't need to know about consumers, so you can add new consumers without touching the producer</li>
<li>Natural audit trail: the event log itself is a record of everything that happened in the system</li>
<li>Scales fan-out cleanly (see pub/sub, previous lesson)</li>
</ul>
<h4>Costs</h4>
<ul>
<li>Harder to trace a single user action across a system — you can no longer just follow a call stack, you have to follow an event trail (this is exactly why observability/tracing, covered later, matters more in event-driven systems)</li>
<li>Eventual consistency by nature — a consumer might process an event seconds after it happened</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>When a system has many independent things that need to react to the same action (a "checkout completed" triggering inventory, shipping, email, analytics, loyalty points), naming event-driven architecture with pub/sub as the backbone is a strong, senior-sounding answer.</div><h4>Event sourcing & CQRS (new)</h4><ul><li><strong>Event sourcing</strong> — don't store current state; store the events and fold them (<code>state = fold(events)</code>). A bank ledger is naturally event-sourced — every movement is an event.</li><li><strong>CQRS</strong> — separate the write model from the read model; each optimized independently. A high-QPS query view can be a denormalized projection of the event log.</li><li><strong>The costs</strong> — eventual consistency between models, replay/rebuild logic, and more moving parts. Reach for these only when the read/write asymmetry actually demands them.</li></ul><div class="callout callout-tip"><span class="callout-tag">TIP</span>When "one checkout completed" must trigger inventory, shipping, email, analytics and loyalty — independently — event-driven + pub/sub is the senior answer.</div>`
      },
      {
        id: 'P7-05',
        num: 'P7-05',
        title: "Service Mesh & mTLS at Scale",
        time: 5,
        html: `<p>In a microservices fleet, retries/timeouts/mTLS/observability would otherwise be re-implemented per service, per language. A mesh centralizes them.</p><ul><li><strong>Sidecar proxy</strong> — a lightweight proxy beside each instance intercepts traffic.</li><li><strong>What it centralizes</strong> — mTLS, retries, timeouts, circuit breaking (P6-03/04), metrics/tracing (P6-07).</li><li><strong>When it's worth it</strong> — many services, many languages, strict security posture. For 5 services it's often more ops than value.</li></ul>`
      },
    ],
  },
  {
    id: 'm7b',
    track: 'phase7',
    title: "Deploy & Operate",
    icon: '7B',
    topics: [
      {
        id: 'P7-06',
        num: 'P7-06',
        title: "Serverless vs Traditional Hosting",
        time: 5,
        html: `<p>An increasingly common alternative to running and managing your own servers continuously.</p>
<h4>Serverless (e.g. AWS Lambda, Cloud Functions)</h4>
<ul>
<li>You deploy individual functions; the cloud provider handles provisioning, scaling, and only charges for actual execution time</li>
<li>Scales to zero (no cost when idle) and scales up automatically under load</li>
<li><strong>Cold starts</strong> add latency when a function hasn't run recently; long-running or stateful workloads are a poor fit; vendor lock-in is real</li>
</ul>
<h4>Traditional server-based hosting</h4>
<ul>
<li>You provision and manage servers (or containers) that run continuously</li>
<li>Full control over the runtime environment, predictable latency (no cold starts), better for long-running or stateful processes</li>
<li>You pay for capacity whether or not it's being used, and you own the scaling/ops burden</li>
</ul>
<div class="callout callout-tradeoff"><span class="callout-tag">TRADEOFF</span>Serverless is a strong fit for spiky, event-driven, short-lived workloads (image processing on upload, webhook handlers). Traditional hosting wins for steady, high-throughput, latency-sensitive core services where cold starts and per-invocation billing don't make sense.</div>`
      },
      {
        id: 'P7-07',
        num: 'P7-07',
        title: "Multi-Region & Edge Architecture",
        time: 7,
        html: `<p>One region is a single point of failure; users are everywhere. Multi-region is the answer — with a price.</p><ul><li><strong>Geo-routing</strong> — DNS or anycast sends users to the nearest region.</li><li><strong>Data residency</strong> — compliance (GDPR) may require data to stay in a region.</li><li><strong>Consistency per data type</strong> — user profiles: replicate async (eventual). Balances: pin an account's writes to one "home region" to keep local ACID (the trick from P8-05).</li><li><strong>Edge</strong> — CDN for static, edge functions for light compute near users; the region is for stateful/authoritative work.</li></ul><div class="callout callout-tradeoff"><span class="callout-tag">TRADEOFF</span>Active-active is the expensive choice: full sync + conflict resolution (P5-06). Active-passive with a tested failover meets most RTOs for far less.</div>`
      },
      {
        id: 'P7-08',
        num: 'P7-08',
        title: "Containers & Orchestration",
        time: 7,
        html: `<p>Containers won because they make "works on my machine" true: an image bundles the app + its runtime, and runs identically anywhere.</p><ul><li><strong>Image vs container</strong> — an image is a layered, immutable filesystem; a container is a running instance.</li><li><strong>Container vs VM</strong> — containers share the host kernel (lighter); VMs virtualize hardware (heavier isolation).</li><li><strong>Kubernetes concepts</strong> — Pod (smallest unit), Deployment (desired replicas), Service (stable endpoint), Ingress (external entry), HPA (autoscale on metrics).</li><li><strong>Why you care in system design</strong> — "horizontal scaling" in the real world is "the deployment has 20 replicas behind a Service" — the box-and-arrow from P3-06 made concrete.</li></ul>`
      },
      {
        id: 'P7-09',
        num: 'P7-09',
        title: "Deployment Strategies, Health Checks, Feature Flags",
        time: 8,
        html: `<p>How a change goes live without downtime — and without a bad deploy taking everything down.</p><h4>Health checks</h4><ul><li><strong>Liveness</strong> — "restart me if I hang" (deadlock detection).</li><li><strong>Readiness</strong> — "don't send me traffic yet" (still warming up).</li><li>They differ: a live-but-not-ready pod must be restarted vs simply drained.</li></ul><h4>Deployment strategies</h4><ul><li><strong>Rolling</strong> — replace instances gradually; zero downtime, slow.</li><li><strong>Blue/green</strong> — run old + new side by side, cut over instantly; needs 2× infra.</li><li><strong>Canary</strong> — route 1% to the new version, watch metrics, expand or roll back.</li><li><strong>Feature flags</strong> — decouple deploy from release: ship dark, flip the flag. The flag is also your kill switch (P6-05).</li></ul>`
      },
      {
        id: 'P7-10',
        num: 'P7-10',
        title: "Testing in Production: Load, Stress, Soak, Chaos",
        time: 7,
        html: `<p>"It passed unit tests" says nothing about production. These four tell the truth.</p><ul><li><strong>Load test</strong> — expected traffic; verify you meet SLOs (P6-01).</li><li><strong>Stress test</strong> — push until it breaks; find the ceiling and the failure mode.</li><li><strong>Soak test</strong> — sustained load for hours/days; leaks and slow degradation only show over time.</li><li><strong>Chaos / failure injection</strong> — kill nodes, add latency, partition the network; verify P6-03/04 actually hold.</li></ul><div class="callout callout-tip"><span class="callout-tag">TIP</span>The discipline: every test is measured against an SLO, not vibes. "p99 stayed under 200ms at 10k rps, then doubled at 14k" is a result; "it felt fine" is not.</div>`
      },
      {
        id: 'P7-11',
        num: 'P7-11',
        title: "Database Migrations & Schema Evolution",
        time: 7,
        html: `<p>Renaming a column on a 1B-row table while it's live is the test of whether you understand production.</p><h4>Expand / contract (zero-downtime pattern)</h4><ol><li>Add the new column/table (expand) — additive, safe.</li><li>Dual-write: write to both old and new.</li><li>Backfill: copy history in batches.</li><li>Switch reads to the new.</li><li>Stop writing the old; drop it (contract).</li></ol><ul><li>Online migration tools (gh-ost / pt-online-schema-change) do this without table locks.</li><li>Backfill large tables in batches with a cursor, not one giant UPDATE that locks for hours.</li></ul>`
      },
      {
        id: 'P7-12',
        num: 'P7-12',
        title: "Capacity Planning & Cost",
        time: 5,
        html: `<p>Estimates (P3-02) become instance counts and a bill. Senior engineers know the number, not just the architecture.</p><ul><li>Right-size from your QPS/storage estimates; add a headroom policy (e.g. 2× peak, min 3 replicas).</li><li>Over-provisioning wastes money; under-provisioning causes the 2am page. The error budget (P6-01) is the tiebreaker.</li><li>Cost levers: reserved vs spot instances, storage tiering (hot/cold), CDN offload (the cheapest win).</li></ul><div class="callout callout-tip"><span class="callout-tag">TIP</span>In interviews, ending with "and this runs on roughly N nodes costing $X/month" — even roughly — is a differentiator almost nobody does.</div>`
      },
    ],
  },
  {
    id: 'm8a',
    track: 'phase8',
    title: "Tier 1 \u2014 Flagship Case Studies",
    icon: '8A',
    topics: [
      {
        id: 'P8-00',
        num: 'P8-00',
        title: "The 22-Step Case-Study Framework",
        time: 7,
        html: `<p>Run every case study through these steps. Steps 1–5 are mandatory; 21–22 are what make an answer senior. Do <strong>not</strong> memorize diagrams — learn to produce them.</p><ol><li><strong>Clarify requirements</strong> — ask, scope in/out.</li><li><strong>Functional requirements</strong> — numbered list.</li><li><strong>Non-functional requirements</strong> — the 2–3 that shape THIS system.</li><li><strong>Scale assumptions</strong> — DAU/MAU, reads/writes, payloads.</li><li><strong>Capacity estimation</strong> — RPS (avg/peak), storage, bandwidth.</li><li><strong>API design</strong> — 3–6 endpoints.</li><li><strong>Data model</strong> — tables/collections, key fields.</li><li><strong>High-level architecture</strong> — boxes & arrows.</li><li><strong>Read & write paths</strong> — trace one of each.</li><li><strong>Database choice</strong> — SQL/NoSQL + why.</li><li><strong>Cache strategy</strong> — what, where, policy.</li><li><strong>Partitioning</strong> — shard key + why.</li><li><strong>Replication</strong> — topology + consistency.</li><li><strong>Async processing</strong> — what moves off the request path.</li><li><strong>Failure scenarios</strong> — what dies, what happens.</li><li><strong>Bottlenecks</strong> — the 1–2 real constraints.</li><li><strong>Scaling strategy</strong> — the ladder.</li><li><strong>Security</strong> — controls.</li><li><strong>Observability</strong> — metrics/alerts.</li><li><strong>Tradeoffs</strong> — the explicit compromises.</li><li><strong>At 10× scale?</strong> — what changes.</li><li><strong>At 100× scale?</strong> — what fundamentally changes.</li></ol><div class="callout callout-tip"><span class="callout-tag">TIP</span>Each case study below ends with a "Principles combined" note — the composition is the point, not the diagram.</div>`
      },
      {
        id: 'P8-01',
        num: 'P8-01',
        title: "URL Shortener (TinyURL)",
        time: 20,
        html: `
<h4>1 · Clarify requirements (the questions to ask)</h4>
<ul>
<li>Shorten + redirect only, or analytics, custom aliases, expiration too?</li>
<li>Redirect as 301 (permanent) or 302 (temporary)? Who is the caller — browser, app, API?</li>
<li>What scale are we designing for — and is this read-heavy or write-heavy?</li>
</ul>
<p>A strong candidate cuts scope early: "I'll focus on shorten + redirect with optional expiry and custom aliases; analytics I'll note as eventual."</p>
<h4>2 · Functional requirements</h4>
<ul>
<li><code>shorten(longUrl, alias?, expiry?) → code</code></li>
<li><code>redirect(code) → 301/302 to longUrl</code></li>
<li>Uniqueness of codes; optional custom alias + expiry.</li>
</ul>
<h4>3 · Non-functional requirements</h4>
<p>Redirect latency (under ~100 ms), high availability, code uniqueness. Analytics/counts can be eventually consistent (P5-04).</p>
<h4>4 · Scale estimation — show the arithmetic</h4>
<ul>
<li>100M new URLs/month ÷ 30 days ÷ 86,400 s ≈ <strong>~40 writes/s</strong> average.</li>
<li>100:1 read:write → <strong>~4,000 reads/s</strong> (people click far more than they shorten).</li>
<li>Storage: ~500 B/row × 100M = <strong>~50 GB/month ≈ 2 TB over 3 years</strong>.</li>
</ul>
<p><strong>What these numbers decide:</strong> 40 writes/s is trivial for one database; 4,000 reads/s is the whole battle — solved by a cache, not by exotic infrastructure. The estimate is the argument against over-engineering.</p>
<h4>5 · API design</h4>
<p><code>POST /shorten {long_url, alias?, expiry?} → {code}</code> · <code>GET /{code} → 301 Location: long_url</code>.</p>
<h4>6 · Data model</h4>
<p><code>urls(code PK, long_url, user_id, created_at, expiry)</code> + an async <code>clicks</code> counter (not on the redirect path).</p>
<h4>7 · Simplest architecture (version 1)</h4>
<p>Client → one app server → one Postgres table. It works — for 40 writes/s and maybe a few hundred reads/s.</p>
<h4>8 · Read path (the hot path)</h4>
<ol>
<li>Browser requests <code>GET /abc123</code>.</li>
<li>App checks the cache; hit → 301 immediately.</li>
<li>Miss → query Postgres → populate cache → 301.</li>
</ol>
<h4>9 · Write path</h4>
<ol>
<li>Validate the URL; generate a code; insert; return the code.</li>
<li>Analytics increment goes to a queue — never on the redirect path.</li>
</ol>
<h4>10 · Identify the bottleneck</h4>
<p>At 4,000 reads/s, Postgres becomes the ceiling — the read path, not writes. So: cache.</p>
<h4>11 · Scale it, step by step</h4>
<ul>
<li><strong>Cache-aside + TTL</strong> (P3-09) for the hot codes — traffic follows a Pareto distribution, a small set gets most clicks.</li>
<li><strong>Read replicas</strong> (P4-05) when even cache misses overpressure the DB.</li>
<li><strong>Shard by code hash</strong> (P4-06) when a single DB outgrows storage/writes — consistent hashing (P4-07) so adding shards does not reshuffle everything.</li>
</ul>
<h4>12 · ID generation — the classic deep-dive</h4>
<ul>
<li><strong>Auto-increment + base62</strong> — collision-free, but a single counter is a bottleneck and leaks total URL count.</li>
<li><strong>Range allocation</strong> — give each app server a pre-allocated range of IDs; no shared counter per write.</li>
<li><strong>Hash + collision check</strong> — distributed with no coordination, but needs a uniqueness check per write.</li>
</ul>
<h4>13 · Failure handling</h4>
<p>Cache dies → DB absorbs (fine at 4k rps). DB leader dies → failover. Code collision → retry. What is the single point of failure, and what removes it?</p>
<h4>14 · Consistency</h4>
<p>The redirect mapping is strongly consistent (it is the source of truth); click counts are eventual.</p>
<h4>15 · Tradeoffs</h4>
<p><strong>301 vs 302:</strong> 301 is cacheable by browsers/CDNs (saves us traffic but we stop seeing the clicks); 302 lets us count every click. Pick 301 + async counters. Counter vs range vs hash IDs (above).</p>
<h4>16 · 10× / 100×</h4>
<p><strong>10×</strong> (40k rps): more shards, geo-redundant cache — same shape. <strong>100×</strong> (400k rps): global LB + regional pools, snowflake-style distributed IDs. The lesson: <em>read-heavy tiny-payload systems scale by caching, not redesign.</em></p>
<h4>17 · Interview follow-ups</h4>
<ul>
<li>"How do you prevent duplicate codes across shards?"</li>
<li>"A URL expires mid-click — what happens on the read path?"</li>
<li>"Where do you put the analytics, and why not synchronously?"</li>
</ul>
<h4>18 · Your exercise</h4>
<p>Redesign it so each <em>user</em> has a namespace (user-scoped short links). What changes in the data model and the read path?</p>
<div class="callout callout-tip"><span class="callout-tag">PRINCIPLES</span>P3-09 (cache) + P4-05/06/07 (replication/sharding) + P5-12 (collisions) + P3-02 (estimation driving every choice).</div>
`
      },
      {
        id: 'P8-02',
        num: 'P8-02',
        title: "Twitter (Microblogging + Timeline)",
        time: 22,
        html: `
<h4>1 · Clarify</h4>
<p>Post tweets, follow, home timeline, like/retweet? DMs? Scope: timeline is the hard part; say so.</p>
<h4>2 · Functional / 3 · Non-functional</h4>
<ul>
<li>FR: post (≤280 chars), follow, timeline, like/retweet.</li>
<li>NFR: timeline under ~200 ms; massive read skew (reads can outnumber writes 1000:1); counts may be eventual (P5-04).</li>
</ul>
<h4>4 · Scale estimation</h4>
<ul>
<li>300M MAU, 500M tweets/day → <strong>~6k writes/s</strong> average.</li>
<li>Timeline reads: users check ~10×/day → ~35k reads/s average, <strong>~100k+ reads/s peak</strong>.</li>
<li>The skew that matters: a few accounts have 10⁸ followers — the <strong>celebrity problem</strong>.</li>
</ul>
<h4>5 · API</h4>
<p><code>POST /tweets</code> · <code>GET /timeline?cursor=</code> · <code>POST /follow</code> · <code>GET /tweets/{id}</code>.</p>
<h4>6 · Data model</h4>
<p><code>users</code>, <code>tweets(tweet_id, author_id, text, ts)</code>, <code>follows(follower_id, followee_id)</code>. Key idea: the timeline is a <strong>cached list of tweet IDs</strong>, not content — content is fetched by ID, keeping the timeline cache tiny.</p>
<h4>7 · Simplest architecture (v1)</h4>
<p>One app server + one SQL DB: <code>SELECT tweets FROM follows JOIN tweets ORDER BY ts</code> at read time. Works at small scale.</p>
<h4>8–9 · Read & write paths (v1)</h4>
<p>Write: insert tweet. Read: join follows × tweets, sort, return. The read is a join over a skewed graph — it gets slow fast.</p>
<h4>10 · Bottleneck</h4>
<p>The read-path join, and the write fan-out for high-follower accounts.</p>
<h4>11 · Scale it — fan-out, with the hybrid</h4>
<ul>
<li><strong>Push (fan-out-on-write)</strong>: on post, write the tweet ID into every follower's timeline cache (Redis list, capped at ~800 IDs). Reads are now instant — but a celebrity post writes 100M timelines.</li>
<li><strong>Pull (fan-out-on-read)</strong>: compute the feed by querying followees at read time. Cheap writes; slow reads for heavy followers.</li>
<li><strong>Hybrid (the answer)</strong>: push for normal users; above a follower threshold, skip the push and <em>merge</em> the celebrity's posts at read time (P3-05).</li>
</ul>
<h4>12 · Failure handling</h4>
<p>Fan-out worker lag → a post appears late (acceptable, eventual). A celebrity post bursts the queue → the threshold prevents it. Timeline cache node dies → rebuild from tweet store.</p>
<h4>13 · Consistency</h4>
<p>Timeline is eventual; a user's own post must be read-your-writes (insert into their own timeline synchronously). Counts eventual.</p>
<h4>14 · Tradeoffs</h4>
<p>Push (fast reads, expensive writes) vs pull (cheap writes, slow reads) → hybrid. Storing IDs vs content in the cache → IDs (small, hydrate on read).</p>
<h4>15 · 10× / 100×</h4>
<p><strong>10×</strong>: bigger fan-out pools, per-region timeline caches. <strong>100×</strong>: pull-on-read for more users; the social graph becomes its own specialized (graph) store.</p>
<h4>16 · Interview follow-ups</h4>
<ul>
<li>"How do you keep the timeline cache from growing unbounded?" (cap + eviction).</li>
<li>"Where does the celebrity threshold live, and what happens as it changes?"</li>
</ul>
<h4>17 · Your exercise</h4>
<p>Add retweets-with-comment. Does it break fan-out? (Answer: it is a tweet + a reference — fan-out by reference, hydrate on read.)</p>
<div class="callout callout-tip"><span class="callout-tag">PRINCIPLES</span>P3-05 (hybrid push/pull) + P4-06 (skew-aware sharding) + P3-09 (cache IDs, not content) + P5-04 (eventual counts).</div>
`
      },
      {
        id: 'P8-03',
        num: 'P8-03',
        title: "Chat: Messenger / WhatsApp",
        time: 22,
        html: `
<h4>1 · Clarify</h4>
<p>1:1 and group chat; delivery/read receipts; presence; history; offline delivery. Scale: how many concurrent connections?</p>
<h4>2 · Functional / 3 · Non-functional</h4>
<ul>
<li>FR: send/receive 1:1 and group messages, receipts, presence, history.</li>
<li>NFR: low-latency delivery (< 100 ms), <strong>messages never lost</strong>, support ~100M+ concurrent connections.</li>
</ul>
<h4>4 · Scale</h4>
<p>Connection-heavy, not payload-heavy: hundreds of millions of small frequent messages; the dominant resource is <em>open sockets</em> (each is a file descriptor, P0-10).</p>
<h4>5 · API</h4>
<p><code>WS /connect</code> (or <code>POST /messages</code>), <code>GET /history?conversation=&amp;amp;before=</code>, read-receipt events over the socket.</p>
<h4>6 · Data model</h4>
<p><code>messages(msg_id, conv_id, sender, ts, content, status)</code>, <code>conversations</code>, and — the crux — a <strong>connection directory</strong> in Redis: <code>user_id → which chat server holds their live socket</code>.</p>
<h4>7 · Simplest architecture (v1)</h4>
<p>One chat server holds all sockets in memory, stores messages in one DB. Works for thousands of connections.</p>
<h4>8 · Why v1 breaks</h4>
<p>One machine hits its file-descriptor and memory ceiling; and a horizontally-scaled fleet has a new problem — <em>the recipient is connected to a different server</em>. How does a message find them?</p>
<h4>9 · Scale it: the connection directory</h4>
<p>Chat servers are <strong>stateful</strong> (each holds live sockets) — the exception to the stateless default (P3-14). A Redis directory maps <code>user_id → chat_server</code>; a send looks up the recipient's server and routes there (or to a queue/push if offline).</p>
<h4>10 · Read & write paths</h4>
<ul>
<li><strong>Send</strong>: persist the message to durable storage <em>first</em> (durability before delivery) → look up the recipient's server → deliver live, or queue + push if offline.</li>
<li><strong>Read</strong>: history from the message store, paginated by cursor.</li>
</ul>
<h4>11 · Failure handling</h4>
<p>A chat server dies → clients reconnect to another; the directory must be kept consistent (entries expire). Message ordering under reconnect: store <code>msg_id</code>/timestamp and sort on the client. The rule: <strong>store, then deliver</strong> — never deliver-then-store.</p>
<h4>12 · Consistency</h4>
<p>Message history is strongly consistent (durable store); presence and typing indicators are ephemeral and lossy — a "typing…" indicator does not need durability (P3-04).</p>
<h4>13 · Tradeoffs</h4>
<p>Durability-first (store then deliver — tiny latency cost, no loss) vs deliver-first (fast, lossy). Group fan-out: deliver to each online member's socket, queue offline members — the same hybrid instinct as feeds.</p>
<h4>14 · 10× / 100×</h4>
<p><strong>10×</strong>: bigger fleet, regional chat servers, sharded directory. <strong>100×</strong>: group chat becomes publish/subscribe (P7-01); the connection graph is geo-sharded.</p>
<h4>15 · Interview follow-ups</h4>
<ul>
<li>"How do you deliver to a user connected to two devices?" (fan out to all their sessions).</li>
<li>"How do you guarantee ordering for one conversation?" (per-conversation partition + sequence numbers).</li>
<li>"End-to-end encryption?" (the server relays ciphertext; WhatsApp's model — it never sees plaintext).</li>
</ul>
<h4>16 · Your exercise</h4>
<p>Design online presence ("user X is online") that is accurate enough but cheap — and say exactly where staleness is acceptable.</p>
<div class="callout callout-tip"><span class="callout-tag">PRINCIPLES</span>P3-04 (WebSockets) + P3-14 (stateful is unavoidable here) + P4-05 (durability) + P7-01 (queue for offline).</div>
`
      },
      {
        id: 'P8-04',
        num: 'P8-04',
        title: "Uber / Ride-Hailing Backend",
        time: 13,
        html: `<h4>Requirements</h4>
<p>Functional: riders request rides, match with nearby available drivers, track ride in real time, handle payment. Non-functional: low-latency matching, accurate real-time location tracking, high availability (this is a live, safety-relevant service).</p>
<h4>Estimate</h4>
<p>Constant high-frequency location updates from every active driver (e.g. every few seconds) — this write volume, not the ride-request volume itself, is usually the dominant load.</p>
<h4>High-level design</h4>
<p><code>Driver app → Location update stream → Geospatial index (live driver locations) + Rider app → Match request → Matching service (nearest available drivers) → Trip service (state machine: requested → matched → in-progress → completed) → Payment</code>. This combines proximity search (P8-19) with a real-time state machine and a matching algorithm.</p>
<h4>Deep dive: driver matching & location tracking at frequency</h4>
<ul>
<li>Driver locations are the geospatial-indexing problem (P8-19) at very high update frequency — using geohashing with an in-memory store (Redis geo commands) rather than a disk-backed index is typically necessary given the update rate</li>
<li><strong>Matching</strong>: given a rider's location, query nearby available drivers via the geo index, then apply matching logic (closest, but also factoring in driver rating, ETA, surge state) — this is intentionally a separate service from the geo index itself, since matching logic changes far more often than location storage</li>
<li>Trip state (requested/accepted/in-progress/completed) is a natural fit for an explicit <strong>state machine</strong>, ensuring only valid transitions happen (e.g. can't complete a trip that was never accepted) and giving a clean audit trail</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>Distinguishing "storing/querying where drivers are" (a geospatial + high-write-throughput problem) from "deciding which driver gets this ride" (a matching/ranking problem) as two separate concerns is the mark of a strong answer here.</div><h4>Framework quick-pass</h4><ul><li><strong>Dominant load:</strong> location pings every ~4s from every active driver — writes, not ride requests.</li><li><strong>Store:</strong> live locations in an in-memory geo store (Redis GEO/geohash), sharded by <strong>geohash cell</strong>.</li><li><strong>10×:</strong> smaller cells; matching sharded per city.</li><li><strong>100×:</strong> hot-city clusters; location becomes a stream (P7-03).</li></ul><div class="callout callout-tip"><span class="callout-tag">TIP</span>Principles combined: geo indexing + P3-04 (persistent connection) + the Trip state machine (P2-25) + P4-06 (geohash sharding).</div>`
      },
      {
        id: 'P8-05',
        num: 'P8-05',
        title: "Payment System",
        time: 24,
        html: `
<h4>1 · Clarify</h4>
<p>Accept payments, record money movement, refunds. The one question that matters: <strong>what is the correctness bar?</strong> (Answer: no lost money, no double charge — correctness beats availability.)</p>
<h4>2 · Functional / 3 · Non-functional</h4>
<ul>
<li>FR: authorize + capture a payment, refund, query status, idempotency.</li>
<li>NFR: <strong>no lost or double money</strong>, full audit trail, authorize p99 < 1 s, RPO = 0 (P6-06).</li>
</ul>
<h4>4 · Scale</h4>
<p>1M tx/day ≈ <strong>12 tps avg, ~100 tps peak</strong>. The point: this is a <em>correctness</em> problem, not a volume problem — you will not need Kafka; you need isolation and idempotency.</p>
<h4>5 · API</h4>
<p><code>POST /payments {idempotency_key, amount, method}</code> → 201 · <code>POST /refunds {payment_id, idempotency_key}</code> · <code>GET /payments/{id}</code>.</p>
<h4>6 · Data model — the heart of the design</h4>
<ul>
<li><code>payments(id, idempotency_key UNIQUE, status, amount, …)</code>.</li>
<li><strong>Double-entry ledger</strong>: <code>ledger_entries(txn_id, account, debit, credit)</code> where <strong>debit ≡ credit, always</strong>. Every movement is a balanced pair; the ledger IS the audit trail and the reconciliation input.</li>
</ul>
<h4>7 · Simplest architecture (v1)</h4>
<p>API → one Postgres with ACID. At 100 tps this is genuinely enough — <em>and the correct starting answer</em>.</p>
<h4>8–9 · Read & write paths</h4>
<ul>
<li><strong>Write (authorize)</strong>: check idempotency key → hold → authorize with the card network → record the ledger entry (atomic) → capture.</li>
<li><strong>Read</strong>: status / balance from the ledger.</li>
</ul>
<h4>10 · The invariants, and how to enforce them</h4>
<ul>
<li><strong>Idempotency (P5-12)</strong> — the client sends an idempotency key; the server stores it (unique-constrained) and, on a repeat, returns the <em>original</em> result. A PSP timeout + retry can never double-charge.</li>
<li><strong>Isolation (P4-04)</strong> — the balance transfer is serializable; shard by <code>account_id</code> so one account's balance lives on one shard → local ACID.</li>
<li><strong>RPO = 0 (P6-06)</strong> — synchronous replication to a standby region.</li>
<li><strong>Outbox (P5-11)</strong> — calling the PSP must be atomic with the DB state change: write the intent + publish via the outbox.</li>
</ul>
<h4>11 · Failure handling</h4>
<p>PSP timeout after debit → retry with the <em>same idempotency key</em> — the exact scenario that motivates effectively-once. Ledger crash → failover with no lost commits (sync replication). Reconciliation job (P7-03 batch) diffs our ledger against the PSP's daily report and flags mismatches.</p>
<h4>12 · Consistency</h4>
<p>Strong everywhere money moves; eventual for dashboards/reports (a read replica). You do not cache money — cache only idempotency-key responses (short TTL).</p>
<h4>13 · Tradeoffs</h4>
<p>Strong consistency + sync replication (slower, correct) vs eventual (fast, dangerous) — for money the choice is made for you. Hold/capture vs single charge (hold lets you verify inventory/risk before committing).</p>
<h4>14 · 10× / 100×</h4>
<p><strong>10×</strong>: more ledger shards; async settlement scaled. <strong>100×</strong>: multi-region active-active <em>per account home region</em> — an account's writes pinned to one region to preserve local ACID.</p>
<h4>15 · Interview follow-ups</h4>
<ul>
<li>"What if the ledger and the PSP disagree?" (reconciliation + the PSP report is the arbiter).</li>
<li>"Why not eventual consistency for the ledger?" (double-spend).</li>
</ul>
<h4>16 · Your exercise</h4>
<p>Design a transfer between two <em>different banks</em> (two ledgers): the saga + outbox across the hop, and what happens if the coordinator crashes between the two local commits.</p>
<div class="callout callout-tip"><span class="callout-tag">PRINCIPLES</span>P4-04 (isolation) + P5-12 (idempotency keys are the star) + P5-11 (outbox/saga) + P6-06 (RPO=0) + P6-08 (PCI). This is the final exam of Phase 5.</div>
`
      },
      {
        id: 'P8-06',
        num: 'P8-06',
        title: "Distributed Key-Value Store (Redis/DynamoDB)",
        time: 22,
        html: `
<h4>1 · Clarify</h4>
<p>Design a key-value store like Redis/DynamoDB: <code>get/put/delete</code> with predictable latency. The twist: it must stay correct and available as nodes are added, removed, and fail — that is the whole exercise.</p>
<h4>2 · Functional / 3 · Non-functional</h4>
<ul>
<li>FR: <code>get(key)</code>, <code>put(key, value)</code>, <code>delete(key)</code>.</li>
<li>NFR: horizontal scalability, <strong>tunable</strong> consistency/availability, fault tolerance.</li>
</ul>
<h4>4 · Scale</h4>
<p>Not a QPS number — the interesting dimension is <em>membership churn</em>: nodes joining, leaving, and dying while the system stays correct.</p>
<h4>5 · API</h4>
<p><code>get(key)</code> · <code>put(key, value, quorum?)</code> · <code>delete(key)</code>.</p>
<h4>6 · Data model</h4>
<p><code>key → value + version</code> (a version vector per key, P5-07, for conflict resolution).</p>
<h4>7 · Simplest architecture (v1)</h4>
<p>One node, a hash map in memory. Correct and fast — until the machine dies or runs out of RAM.</p>
<h4>8 · Scale it — the three ideas that make it distributed</h4>
<ul>
<li><strong>Partitioning (P4-07)</strong> — consistent hashing + virtual nodes spreads keys across nodes so the cluster grows/shrinks without reshuffling the keyspace.</li>
<li><strong>Replication (P4-05)</strong> — each key lives on N nodes (commonly 3), leaderless, so any replica can serve a write.</li>
<li><strong>Tunable consistency (P5-05)</strong> — expose W and R; <code>W+R &amp;gt; N</code> for strong reads, <code>W+R ≤ N</code> for fast/eventual.</li>
</ul>
<h4>9–10 · Read & write paths</h4>
<ul>
<li><strong>Write</strong>: hash key → its N replicas → ack once W respond.</li>
<li><strong>Read</strong>: ask R replicas → return the freshest version; repair stale ones on the spot (read repair).</li>
</ul>
<h4>11 · Failure handling</h4>
<p>Node down → hinted handoff (a neighbor accepts the write and forwards on recovery). Permanent loss → redistribute its keys. On heal, diverged replicas reconcile via <strong>anti-entropy with Merkle trees</strong> (P5-06) — only differing subtrees are compared/transferred.</p>
<h4>12 · Conflict resolution</h4>
<p>Leaderless writes can conflict. <strong>LWW</strong> (last-write-wins) is simple but silently drops concurrent writes; <strong>version vectors</strong> preserve both and push merging to the application or next read.</p>
<h4>13 · Tradeoffs</h4>
<p>LWW (simple, lossy) vs version vectors (correct, complex) — P5-06. Strong quorums (correct, slower) vs weak quorums (fast, stale).</p>
<h4>14 · 10× / 100×</h4>
<p>More nodes, better gossip/compaction — <em>the architecture does not change</em>. That is the point: get partitioning + replication + quorums right, and scale is a knob.</p>
<h4>15 · Interview follow-ups</h4>
<ul>
<li>"What happens to a write while its home node is down?" (hinted handoff).</li>
<li>"How does a new node know which keys it owns?" (ring + gossip).</li>
</ul>
<h4>16 · Your exercise</h4>
<p>Add a <code>scan(prefix)</code> operation. How does consistent hashing (random key order) conflict with range/prefix scans — and what structure fixes it?</p>
<div class="callout callout-tip"><span class="callout-tag">CAPSTONE</span>Every Phase 5 fundamental converges here. Walk it fluently and you have demonstrated the fundamentals as one connected system, not a list of facts.</div>
`
      },
    ],
  },
  {
    id: 'm8b',
    track: 'phase8',
    title: "Tier 2 \u2014 Focused Case Studies",
    icon: '8B',
    topics: [
      {
        id: 'P8-07',
        num: 'P8-07',
        title: "Pastebin",
        time: 8,
        html: `<h4>Requirements</h4>
<p>Functional: paste text, get a shareable link, optional expiration and syntax highlighting. Non-functional: durability of pastes, fast reads, reasonable write latency.</p>
<h4>Estimate</h4>
<p>Similar shape to a URL shortener but with variable, larger payloads (up to a few MB of text) instead of a short URL string — storage estimates dominate over QPS here.</p>
<h4>High-level design</h4>
<p><code>Client → Load Balancer → App servers → Object storage (paste content) + Database (metadata: id, owner, expiry, size, storage pointer)</code>. Short ID generation reuses the same approach as the URL shortener (P8-01).</p>
<h4>Deep dive: where content lives</h4>
<ul>
<li>Storing large text blobs directly in a relational database bloats table size and hurts index performance — store paste *content* in object storage (S3-style), and keep only metadata + a pointer in the database</li>
<li>Expiration: a background job (or TTL feature on the object store) sweeps expired pastes, rather than checking expiry on every single read</li>
</ul>
<div class="callout callout-tradeoff"><span class="callout-tag">TRADEOFF</span>This is essentially the URL shortener's ID-generation problem plus the file-storage pattern from object storage (P4-09) combined — a good example of how most case studies are built from the same fundamentals recombined.</div><h4>Framework quick-pass</h4><ul><li><strong>The one new idea:</strong> content is a blob → object storage; metadata (id, owner, expiry, pointer) in SQL.</li><li><strong>Expiry:</strong> TTL/background sweep, not per-read checks.</li><li><strong>Why not blobs in Postgres?</strong> row bloat, index size, WAL cost.</li></ul>`
      },
      {
        id: 'P8-08',
        num: 'P8-08',
        title: "Instagram (Photo Sharing Feed)",
        time: 13,
        html: `<h4>Requirements</h4>
<p>Functional: upload photos, follow users, view a feed of followed users' posts, like/comment. Non-functional: feed loads fast, high read:write ratio, eventual consistency acceptable for likes/counts.</p>
<h4>Estimate</h4>
<p>Read-heavy: feed views vastly outnumber uploads (often 100:1+). Photo storage dominates capacity planning — millions of uploads/day at several MB each.</p>
<h4>High-level design</h4>
<p><code>Client → LB → App servers → (Metadata DB for posts/users/follows) + (Object storage for images) + (Cache for hot feeds/posts) + (CDN for image delivery)</code>. Image upload path: generate multiple resolutions (thumbnail, full) asynchronously via a queue-driven worker.</p>
<h4>Deep dive: feed generation (the classic hard part)</h4>
<ul>
<li><strong>Fan-out-on-write (push)</strong>: when a user posts, immediately write it into every follower's precomputed feed — feed reads are instant, but a celebrity with millions of followers causes millions of writes per post</li>
<li><strong>Fan-out-on-read (pull)</strong>: feed is computed at request time by querying all followed users' recent posts and merging — cheap writes, but slow reads and heavy DB load for users following thousands of accounts</li>
<li><strong>Hybrid (what real systems do)</strong>: push for most users; for celebrity accounts above a follower threshold, skip the push and merge their posts in at read time</li>
</ul>
<div class="diagram" data-diagram="fanout"></div>
<div class="callout callout-tradeoff"><span class="callout-tag">TRADEOFF</span>This mirrors P3-05 (push vs pull) directly — the hybrid approach is the standard, expected answer once you've named both extremes and their failure mode.</div><h4>Framework quick-pass</h4><ul><li><strong>This study's lesson is media + cache eviction, not fan-out (that's Twitter's).</strong></li><li><strong>Write path:</strong> upload → async multi-resolution generation (queue) → object storage + CDN.</li><li><strong>Cache:</strong> hot-feed caching + LRU eviction of cold feeds.</li><li><strong>10×/100×:</strong> the CDN absorbs virtually all image traffic; origin only serves cold content.</li></ul>`
      },
      {
        id: 'P8-09',
        num: 'P8-09',
        title: "Video Streaming: YouTube / Netflix",
        time: 13,
        html: `<h4>Requirements</h4>
<p>Functional: upload video, transcode into multiple qualities, stream to viewers, resume playback. Non-functional: smooth playback across varying network conditions, huge storage/bandwidth scale, global low-latency delivery.</p>
<h4>Estimate</h4>
<p>Storage and bandwidth-dominated: video is orders of magnitude larger than text/image content; a single popular video can be requested millions of times.</p>
<h4>High-level design</h4>
<p><code>Upload → Transcoding pipeline (async, queue-driven) → Object storage (multiple resolutions/formats) → CDN → Client (adaptive streaming)</code>. Metadata (title, description, view counts) lives in a separate database from the video bytes themselves.</p>
<h4>Deep dive: adaptive bitrate streaming & delivery</h4>
<ul>
<li>Uploaded video is transcoded into multiple resolutions/bitrates (240p to 4K) and split into small chunks — this is CPU-intensive and always done asynchronously via a worker queue, never inline with the upload request</li>
<li><strong>Adaptive bitrate streaming (e.g. HLS/DASH)</strong>: the client requests progressively higher or lower quality chunks based on measured network conditions in real time, rather than committing to one quality for the whole video</li>
<li>Nearly all actual video bytes are served from a <strong>CDN</strong>, not the origin — origin servers mainly serve cold/rarely-watched content; this is the highest-leverage caching decision in the whole system</li>
<li>View counts and engagement metrics are naturally high-write, low-consistency-need data — a strong candidate for eventual consistency and batched/approximate counting rather than exact real-time counts</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>The transcoding pipeline being fully asynchronous (upload returns immediately, "processing" state shown to the uploader) is the detail that shows you understand this can't be a synchronous request-response flow.</div><h4>Framework quick-pass</h4><ul><li><strong>Netflix's differentiator:</strong> pre-positioning content at ISPs (Open Connect) + per-title encoding — same architecture, edge-optimized.</li><li><strong>The two hard parts:</strong> transcoding is CPU-heavy and must be async; nearly all bytes are served from the CDN, origin only for cold content.</li><li><strong>View counts:</strong> approximate/eventual (P5-04) — never exact on the hot path.</li></ul>`
      },
      {
        id: 'P8-10',
        num: 'P8-10',
        title: "File Storage & Sync: Dropbox / Google Drive",
        time: 12,
        html: `<h4>Requirements</h4>
<p>Functional: upload/download files, sync changes across devices, share files, version history. Non-functional: strong durability (never lose a file), reasonable sync latency, support for very large files.</p>
<h4>Estimate</h4>
<p>Storage-dominated: average user might store tens of GB; at scale this is petabytes. Uploads/downloads are bandwidth-heavy, not just request-heavy.</p>
<h4>High-level design</h4>
<p><code>Client (watches local folder for changes) → App servers (metadata: files, versions, folders, permissions) → Object storage (actual file bytes) → Notification service (tells other devices to sync)</code>. Metadata DB tracks file hierarchy and version pointers; file content lives in object storage, chunked for large files.</p>
<h4>Deep dive: efficient sync</h4>
<ul>
<li><strong>Chunking</strong>: split files into fixed-size blocks; only upload/download the blocks that changed, not the whole file — saves bandwidth enormously for small edits to large files</li>
<li><strong>Deduplication</strong>: hash each chunk; if an identical chunk already exists (even from a different file/user), just reference it instead of storing it again</li>
<li><strong>Conflict resolution</strong>: if the same file is edited offline on two devices, detect the conflict via version vectors/timestamps and either merge or create a conflicted copy, rather than silently overwriting</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>The chunking + hashing approach is the single most important "senior" detail interviewers look for in Dropbox specifically — naive "just re-upload the whole file" answers stand out as under-baked.</div><h4>Framework quick-pass</h4><ul><li><strong>The senior detail:</strong> chunking + content-addressed dedup — only changed blocks upload; identical chunks are referenced, not stored twice.</li><li><strong>Conflicts:</strong> offline edits detected via version vectors (P5-06).</li><li><strong>Drive's addition:</strong> real-time co-editing needs OT or CRDTs — deep-dived in P8-20.</li></ul>`
      },
      {
        id: 'P8-11',
        num: 'P8-11',
        title: "Notification System (Push / Email / SMS Fan-out)",
        time: 10,
        html: `<h4>Requirements</h4>
<p>Functional: send notifications (push, email, SMS) triggered by events across the platform, respect user preferences, avoid duplicate/spam sends. Non-functional: high throughput fan-out, reliable delivery (or at-least-once with dedup), doesn't slow down the services that trigger notifications.</p>
<h4>Estimate</h4>
<p>A single popular event (a viral post, a breaking-news alert) can trigger notification fan-out to millions of users nearly simultaneously — the write/send volume can spike far above baseline.</p>
<h4>High-level design</h4>
<p><code>Triggering service publishes event → Message queue/pub-sub → Notification service (applies user preferences/dedup) → Provider-specific senders (push gateway, email service, SMS gateway) → Delivery/failure tracking</code>. This is event-driven architecture (P7-04) applied end to end.</p>
<h4>Deep dive: fan-out without becoming the bottleneck</h4>
<ul>
<li>The triggering service should never call the notification system synchronously — it publishes an event and moves on (P3-05, async communication), so a slow notification pipeline never slows down the core user action that triggered it</li>
<li><strong>Idempotency</strong> (P5-12) matters a lot here: at-least-once delivery from the queue means the same event could be processed twice — dedup by a unique notification ID before actually sending, so users don't get duplicate pushes</li>
<li><strong>User preference and rate limiting</strong>: check opt-in/opt-out and per-user notification frequency caps before sending, and batch/digest low-priority notifications instead of sending each individually</li>
<li>Different channels (push/email/SMS) have very different latency, cost, and reliability characteristics — route through channel-specific worker pools so a slow SMS provider doesn't back up push notifications</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>This case study is a clean showcase for P7-01 (pub/sub) + P5-12 (idempotency) together — framing it that way in an interview demonstrates fluent reuse of fundamentals rather than a bespoke design.</div><h4>Framework quick-pass</h4><ul><li><strong>The hard part:</strong> idempotent fan-out (P5-12) + channel isolation (slow SMS must not block push — a bulkhead, P6-04).</li><li><strong>Never synchronous:</strong> the trigger publishes an event and moves on (P3-05).</li></ul>`
      },
      {
        id: 'P8-12',
        num: 'P8-12',
        title: "API Rate Limiter (as a system)",
        time: 9,
        html: `<h4>Requirements</h4>
<p>Functional: limit each client to N requests per time window, return 429 when exceeded. Non-functional: the limiter itself must be low-latency (it's on every request's critical path) and must work correctly across a horizontally scaled fleet.</p>
<h4>Estimate</h4>
<p>The limiter runs on every single request across the whole system, so its own latency budget is extremely tight (single-digit milliseconds) — it can't be the bottleneck it's trying to prevent.</p>
<h4>High-level design</h4>
<p><code>Client → API Gateway (rate limiter check) → distributed counter store (Redis) → allow/deny → backend services</code>. Algorithm choice is P3-12 (token bucket, typically) applied at the gateway layer.</p>
<h4>Deep dive: making it work distributed</h4>
<ul>
<li>A naive in-memory counter per app server breaks the moment you have more than one server — a client could get N requests allowed *per server*, defeating the limit</li>
<li>Centralize counters in a fast shared store like <strong>Redis</strong>, using atomic increment operations (<code>INCR</code> + <code>EXPIRE</code>) to avoid race conditions between concurrent requests</li>
<li>At very high scale, even Redis can become a bottleneck — shard the rate-limit counters by client ID, and consider allowing small inaccuracy (approximate counting) in exchange for avoiding a fully synchronous global counter</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>The distributed-counter problem is the entire point of this case study — a correct single-server rate limiter is trivial; the interview is really testing P4-06/P4-07 (sharding, consistent hashing) applied to a concrete, latency-critical problem.</div><h4>Framework quick-pass</h4><ul><li><strong>The entire point:</strong> the distributed counter — in-memory per-server breaks at N servers.</li><li><strong>Fix:</strong> Redis <code>INCR+EXPIRE</code>, shard counters by client, accept approximate counting at extreme scale.</li><li><strong>Latency budget:</strong> single-digit ms — it's on every request's critical path.</li></ul>`
      },
      {
        id: 'P8-13',
        num: 'P8-13',
        title: "Search System (Twitter / product search)",
        time: 10,
        html: `<h4>Requirements</h4>
<p>Functional: search tweets by keyword, get relevant/recent results. Non-functional: near-real-time indexing of new tweets (search should find a tweet within seconds of posting), fast query response.</p>
<h4>Estimate</h4>
<p>Massive, constantly growing write volume (every tweet must be indexed) combined with a read-heavy, latency-sensitive query path.</p>
<h4>High-level design</h4>
<p><code>Tweet write path → Message queue → Indexing workers → Inverted index (e.g. Elasticsearch cluster) ← Search query path ← App servers ← Client</code>. The primary tweet database remains the source of truth; the search index is a derived, asynchronously updated copy.</p>
<h4>Deep dive: keeping the index fresh at scale</h4>
<ul>
<li>This directly applies P4-10 (inverted index): tweets are indexed by term, so a query like "system design" retrieves and intersects the posting lists for both words</li>
<li>Indexing happens <strong>asynchronously</strong> via the queue — a small delay (seconds) between posting and searchability is an acceptable tradeoff for not blocking the tweet-post path on a full-text indexing operation</li>
<li>The search index cluster is <strong>sharded</strong> (by tweet ID range or hash) and <strong>replicated</strong>, so both indexing throughput and query throughput scale horizontally</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>This case study is a good one to explicitly connect to P4-10 — say "this is the inverted index pattern applied to Twitter's specific write volume and freshness requirements" to show you're recombining fundamentals, not memorizing case studies independently.</div><h4>Framework quick-pass</h4><ul><li><strong>Write path:</strong> content → queue → indexing workers → inverted index (Elasticsearch).</li><li><strong>Freshness:</strong> async, seconds of lag is fine; the index is a derived copy, DB stays source of truth.</li><li><strong>Scale:</strong> the index cluster is sharded + replicated.</li></ul>`
      },
      {
        id: 'P8-14',
        num: 'P8-14',
        title: "Web Crawler",
        time: 11,
        html: `<h4>Requirements</h4>
<p>Functional: given seed URLs, discover and download web pages, extract new links, avoid re-crawling the same page endlessly. Non-functional: massive horizontal scale, politeness (don't overwhelm any single site), handle the effectively-infinite size of the web.</p>
<h4>Estimate</h4>
<p>Billions of URLs to track; crawl frequency varies by content type (news sites crawled far more often than static pages).</p>
<h4>High-level design</h4>
<p><code>URL frontier (queue of URLs to crawl) → Fetcher workers (download pages) → Parser (extract content + new links) → Duplicate/seen-URL check → New URLs back into frontier → Storage</code>. Deeply queue/worker-driven — this is fundamentally a distributed job processing system.</p>
<h4>Deep dive: the two hard sub-problems</h4>
<ul>
<li><strong>Avoiding re-crawling the same URL</strong>: checking billions of URLs against a "seen" set naively is memory-prohibitive — a <strong>Bloom filter</strong> (P4-11) gives a fast, memory-efficient "definitely not seen, or maybe seen" check before an expensive definitive lookup</li>
<li><strong>Politeness & prioritization</strong>: the URL frontier isn't a single FIFO queue — it needs per-domain queues with rate limiting (don't hit the same site's server with 10,000 simultaneous requests) and priority ordering (crawl high-value/frequently-changing pages more often)</li>
<li><strong>Avoiding traps</strong>: some sites generate infinite URLs (calendar pages, session IDs in URLs) — cap crawl depth per domain and detect URL patterns that look like infinite generators</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>A crawler is really a distributed queue-and-worker system (P7-01) wearing a specific domain's clothes — recognizing that shape early lets you spend deep-dive time on the two genuinely hard, crawler-specific problems above instead of re-deriving basic queueing.</div><h4>Framework quick-pass</h4><ul><li><strong>Seen-set at billions of URLs:</strong> a Bloom filter in front of an authoritative store (P4-11).</li><li><strong>Politeness:</strong> per-domain queues with rate limits + priority ordering.</li><li><strong>Traps:</strong> infinite URL generators — cap depth, detect patterns.</li></ul>`
      },
      {
        id: 'P8-15',
        num: 'P8-15',
        title: "News Feed (Facebook)",
        time: 11,
        html: `<h4>Requirements</h4>
<p>Functional: show a personalized, ranked feed of posts from friends/followed pages, not strictly chronological. Non-functional: feed loads fast, ranking should feel relevant, handle a huge and constantly growing pool of candidate posts.</p>
<h4>Estimate</h4>
<p>Similar to Instagram/Twitter's write/read shape, plus an added ranking computation layer that those simpler timelines don't need.</p>
<h4>High-level design</h4>
<p>Builds directly on the fan-out pattern from P8-08/P8-02: <code>Post creation → Fan-out (hybrid push/pull) → Candidate post pool per user → Ranking service → Ranked feed → Client</code>. The new piece versus a plain timeline is the <strong>ranking service</strong> sitting between "candidate posts" and "what's actually shown."</p>
<h4>Deep dive: ranking without breaking the read path</h4>
<ul>
<li>Ranking (by predicted engagement, recency, relationship strength) is computed on a <strong>bounded candidate set</strong> (e.g. the most recent few hundred posts from followed accounts), not the entire history — bounding the input keeps ranking latency acceptable</li>
<li>Ranking can be precomputed periodically and refreshed (similar to typeahead's offline aggregation, P8-18) rather than fully recomputed on every single feed load, trading a little freshness for a lot of latency</li>
<li>Feature/signal computation (engagement predictions) is typically its own service the feed-serving path calls, keeping the ranking model's complexity isolated from the core fan-out/serving infrastructure</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>The clean way to present this case study: "this is the Twitter/Instagram fan-out problem, plus a ranking layer" — showing you see it as a composition of already-covered fundamentals rather than a brand-new problem.</div><h4>Framework quick-pass</h4><ul><li><strong>The addition over Twitter/Instagram:</strong> a ranking layer between candidate posts and what's shown.</li><li><strong>Don't break the read path:</strong> bound the candidate set (recent few hundred), precompute scores, isolate the model (P3-05 async refresh).</li></ul>`
      },
      {
        id: 'P8-16',
        num: 'P8-16',
        title: "Ticketmaster (Event Ticketing)",
        time: 21,
        html: `
<h4>1 · Clarify</h4>
<p>Browse events, pick seats, reserve, buy. The defining question: <strong>what happens when 1M people try to buy 20k seats at the same instant?</strong> The design must survive a spike, not a steady average.</p>
<h4>2 · Functional / 3 · Non-functional</h4>
<ul>
<li>FR: browse, seat map, hold seats, pay, confirm, cancel.</li>
<li>NFR: <strong>no seat is ever sold twice</strong> (correctness > availability — the opposite of most consumer systems), fair ordering under contention.</li>
</ul>
<h4>4 · Scale</h4>
<p>Extremely bursty: near-zero traffic, then an enormous simultaneous spike at sale open. Design for the spike.</p>
<h4>5 · API</h4>
<p><code>GET /shows/{id}/seats</code> · <code>POST /hold {show_id, seats}</code> → 200/409 · <code>POST /confirm {hold_id}</code> · <code>POST /cancel</code>.</p>
<h4>6 · Data model</h4>
<p><code>shows</code>, <code>seats(show_id, seat_id, status)</code> where status ∈ AVAILABLE / HELD / BOOKED, <code>holds(hold_id, seats, expiry)</code>, <code>bookings</code>.</p>
<h4>7 · Simplest architecture (v1)</h4>
<p>App + one DB. Works until the sale opens and a million requests hit seat-selection at once — the DB serializes them and dies.</p>
<h4>8 · Scale it — the two mechanisms</h4>
<ul>
<li><strong>Virtual waiting room</strong> — admit users into seat selection at a controlled rate (a queue at the front door, like rate limiting applied to admission, P3-12). This protects the strongly-consistent core from being overwhelmed.</li>
<li><strong>Seat holds</strong> — selecting a seat places a short TTL lock (e.g. 10 min); it auto-releases if checkout is abandoned, returning the seat to availability.</li>
</ul>
<h4>9–10 · Read & write paths</h4>
<ul>
<li><strong>Read</strong>: seat map (cacheable, slightly stale is fine).</li>
<li><strong>Write (hold)</strong>: atomically claim the seat <em>if</em> still AVAILABLE — the one operation that must be strongly consistent.</li>
</ul>
<h4>11 · Consistency — the point of the whole case</h4>
<p>This is the one system in the course that unambiguously needs <strong>strong consistency</strong> (P4-04): a race between two users for one seat must resolve to exactly one winner, every time. Enforce it cheaply — a unique constraint on <code>(show_id, seat_id)</code> makes a double-booking <em>impossible to express</em>, rather than relying on serializable transactions everywhere.</p>
<h4>12 · Failure handling</h4>
<p>Hold expires mid-checkout → seat returns to availability (the TTL sweep). Payment succeeds but confirm fails → the hold must still be honored or refunded (idempotency, P5-12). Waiting room dies → fail open to the seat map, which is now the throttle point.</p>
<h4>13 · Tradeoffs</h4>
<p>Consistency vs availability — deliberately the opposite of the feeds: here you refuse rather than risk a double-sale. Holds (good UX, temporary inventory lock) vs instant purchase (no stale holds, worse UX under failure).</p>
<h4>14 · 10× / 100×</h4>
<p><strong>10×</strong>: shard seats by show, scale the waiting room. <strong>100×</strong>: the hold store becomes a dedicated low-latency layer; the admission queue is global and multi-region.</p>
<h4>15 · Interview follow-ups</h4>
<ul>
<li>"Why not just serializable transactions?" (correct, but you can encode the invariant as a constraint — cheaper and clearer).</li>
<li>"How long should the hold be, and what happens when it expires mid-payment?"</li>
</ul>
<h4>16 · Your exercise</h4>
<p>Add "a user may hold at most 6 seats per show". Where does that rule live, and what breaks if it lives in the seat-claim path?</p>
<div class="callout callout-tip"><span class="callout-tag">PRINCIPLES</span>P4-04 (isolation + constraints) + P3-12 (admission throttle) + P5-12 (idempotent confirm) — the counterexample that proves consistency is not always "eventual by default".</div>
`
      },
      {
        id: 'P8-17',
        num: 'P8-17',
        title: "Food Delivery",
        time: 10,
        html: `<h4>Requirements</h4><p>Functional: browse restaurants, order, dispatch a partner, track status, pay, rate. Non-functional: low-latency dispatch, correct order state, cancellations handled cleanly.</p><h4>High-level design</h4><p><code>Order service (state machine: PLACED→ACCEPTED→PREPARING→PICKED_UP→DELIVERED/CANCELLED) + Dispatch (nearest available partner) + Payment + Notifications</code>.</p><h4>Deep dive: the 3-way lifecycle & cancellation</h4><ul><li><strong>Three actors, one order:</strong> restaurant, partner, customer — each sees a different view of the same state machine.</li><li><strong>Cancellation compensation</strong> — cancelled after accept → refund + partner reassignment: a Saga (P5-11).</li><li><strong>Dispatch</strong> — nearest available partner via geo lookup (P8-04's index), then rating/ETA tie-breaks.</li></ul><h4>Framework quick-pass</h4><ul><li><strong>10×:</strong> dispatch sharded per city.</li><li><strong>100×:</strong> hot-city clusters; the state machine stays, the matching becomes stream-driven.</li></ul><div class="callout callout-tip"><span class="callout-tag">TIP</span>Principles combined: Uber's geo + a restaurant-side state machine + Saga compensation — a composition of P8-04, P2-24 and P5-11.</div>`
      },
    ],
  },
  {
    id: 'm8c',
    track: 'phase8',
    title: "Tier 3 \u2014 Self-Solve Case Studies",
    icon: '8C',
    topics: [
      {
        id: 'P8-18',
        num: 'P8-18',
        title: "Typeahead / Autocomplete",
        time: 10,
        html: `<h4>Requirements</h4>
<p>Functional: as a user types, suggest the most likely completions/searches in real time. Non-functional: extremely low latency (feels instant, <100ms), suggestions should reflect popularity/recency.</p>
<h4>Estimate</h4>
<p>Very high QPS relative to data size — every keystroke can trigger a request, so this is a latency-critical, read-dominated problem even though the underlying dataset (search terms) is comparatively small.</p>
<h4>High-level design</h4>
<p><code>Client (debounced input) → App servers → In-memory Trie or precomputed top-K cache → Response</code>. A separate, offline/async pipeline aggregates real search query logs to periodically rebuild the ranked suggestion data.</p>
<h4>Deep dive: serving structure</h4>
<ul>
<li><strong>Trie (prefix tree)</strong>: each node represents a character; walking down from the root by typed characters reaches a subtree of all matching completions — natural fit for prefix matching, but a naive trie doesn't rank efficiently</li>
<li>Store the <strong>top-K most popular completions at each trie node</strong>, precomputed offline, so a lookup is just "walk to this prefix's node, return its precomputed top-K" — O(prefix length), not a live ranking computation</li>
<li>Update this ranking data periodically (e.g. hourly, from query logs) rather than in real time on every search — freshness within an hour is more than sufficient and avoids expensive live aggregation</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>The key insight interviewers want is separating the <strong>fast read path</strong> (precomputed, cached, trie-based) from the <strong>slow update path</strong> (periodic batch aggregation of real query popularity) — trying to rank live on every keystroke is the common beginner mistake here.</div><h4>Framework quick-pass</h4><ul><li><strong>Solve it yourself first (25 min), then check:</strong> separate the fast read path (precomputed, cached) from the slow update path (batch aggregation of query logs).</li><li><strong>Serving:</strong> a trie with top-K precomputed at each node; rank refreshed hourly, not per keystroke.</li></ul>`
      },
      {
        id: 'P8-19',
        num: 'P8-19',
        title: "Yelp / Nearby Friends (Proximity Search)",
        time: 11,
        html: `<h4>Requirements</h4>
<p>Functional: given a user's location, find nearby businesses/friends within a radius, sorted by distance. Non-functional: fast proximity queries at scale, reasonably fresh location data (for moving entities like "nearby friends").</p>
<h4>Estimate</h4>
<p>The core challenge isn't raw QPS — it's that naive distance calculation (comparing a query point against every stored point) doesn't scale, regardless of how few or many queries there are.</p>
<h4>High-level design</h4>
<p><code>Client (lat/lng) → App servers → Geospatial index → Ranked nearby results</code>. Static entities (businesses) use a less frequently updated index; dynamic entities (friends' live locations) need a structure that supports fast updates too.</p>
<h4>Deep dive: geospatial indexing</h4>
<ul>
<li><strong>Geohashing</strong>: encode latitude/longitude into a single string where nearby locations share string prefixes — turns 2D proximity search into a 1D range/prefix query a normal database index can handle efficiently</li>
<li><strong>Quadtrees</strong>: recursively divide the map into four quadrants, subdividing further wherever point density is high — gives a naturally variable-resolution index (dense cities get finer grid cells than sparse rural areas)</li>
<li>For <strong>moving entities</strong> (nearby friends), the index needs efficient updates as well as reads — geohash-based approaches in a database with good range-index support (or Redis's built-in geospatial commands) handle this better than a static quadtree rebuilt periodically</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>Naming geohashing specifically and explaining *why* it works (turning 2D proximity into a 1D prefix match) is a strong differentiator — many candidates know "you need some kind of geo index" without being able to say how one actually functions.</div><h4>Framework quick-pass</h4><ul><li><strong>Solve it yourself first, then check:</strong> naive distance-to-everything doesn't scale.</li><li><strong>The trick:</strong> geohash (2D proximity → 1D prefix) or a quadtree; moving entities need an update-friendly index (Redis GEO).</li></ul>`
      },
      {
        id: 'P8-20',
        num: 'P8-20',
        title: "Google Drive Collaboration (OT/CRDT Deep Dive)",
        time: 11,
        html: `<p>The deepest single deep-dive in the course: how do two people type in one doc at Google-Docs scale?</p><h4>The pieces</h4><ul><li><strong>Presence</strong> — WebSockets (P3-04); who's editing, where their cursor is.</li><li><strong>The core problem</strong> — two users insert at the same position concurrently; naive last-write-wins corrupts the doc.</li><li><strong>OT (Operational Transform)</strong> — transform concurrent operations against each other before applying; historically needs a central server to serialize. Google Docs' approach.</li><li><strong>CRDTs</strong> — data structures that merge without coordination (a text CRDT = sequence of characters with unique IDs + tombstones); no central server required, but more metadata per keystroke.</li></ul><div class="callout callout-tradeoff"><span class="callout-tag">TRADEOFF</span>OT: proven, centralized, complex transform functions. CRDTs: decentralized, simpler concurrency story, heavier representation. Both are valid; naming the tradeoff is the senior answer.</div><h4>Framework quick-pass</h4><ul><li><strong>Combines:</strong> P8-10 (chunking/sync) + P3-04 (WebSockets) + P5-06 (conflict-free merge). Do this one last.</li></ul>`
      },
    ],
  },
  {
    id: 'm9a',
    track: 'phase9',
    title: "Projects \u2014 Beginner",
    icon: '9A',
    topics: [
      {
        id: 'P9-01',
        num: 'P9-01',
        title: "Project: URL Shortener (REST + Postgres + Redis)",
        time: 7,
        html: `<h4>Requirements</h4><ul><li>Shorten, redirect (301), custom alias, click count, expiry.</li></ul><h4>Architecture</h4><p>FastAPI/Express → Postgres (urls table, <code>code</code> PK) + Redis (hot-code cache, cache-aside) + nginx.</p><h4>Tech</h4><p>Python/Node, Postgres, Redis, Docker, wrk/k6.</p><h4>Milestones</h4><ol><li>DB schema + shorten/redirect.</li><li>Cache-aside + TTL.</li><li>ID generation (range allocation).</li><li>Containerize + nginx.</li><li>Load test.</li></ol><h4>Failure scenarios to test</h4><ul><li>Kill Redis — does redirect still work?</li><li>Kill the Postgres replica.</li><li>Fill the cache.</li></ul><h4>Load-testing tasks</h4><ul><li>Redirect p99 with and without cache; find your QPS ceiling.</li></ul><h4>Scaling challenge</h4><p>What breaks first at 10×? (Hint: single Postgres writer.)</p><h4>Questions you must answer yourself</h4><ul><li>Why 301 not 302?</li><li>Why is <code>code</code> the shard key?</li><li>Where does the cache live relative to nginx?</li></ul>`
      },
      {
        id: 'P9-02',
        num: 'P9-02',
        title: "Project: REST API with PostgreSQL + Redis",
        time: 7,
        html: `<h4>Requirements</h4><ul><li>CRUD notes, users, JWT auth, paginated lists, full-text search.</li></ul><h4>Architecture</h4><p>API → Postgres (indexes + a read replica) + Redis (sessions + hot lists) + nginx.</p><h4>Tech</h4><p>Postgres (pg_trgm / full-text), Redis, JWT.</p><h4>Milestones</h4><ol><li>Schema + CRUD.</li><li>Cursor pagination.</li><li>Auth.</li><li>Indexes + <code>EXPLAIN ANALYZE</code>.</li><li>Replica + cache.</li><li>Containerize.</li></ol><h4>Failure scenarios to test</h4><ul><li>Replica lag (read-your-writes!).</li><li>Cache stampede on a hot note.</li></ul><h4>Load-testing tasks</h4><ul><li>Before/after each index; before/after cache.</li></ul><h4>Scaling challenge</h4><p>Which query is O(n) without an index, and why does cursor pagination fix the offset problem?</p><h4>Questions you must answer yourself</h4><ul><li>What does <code>EXPLAIN ANALYZE</code> tell you?</li><li>Why is the session in Redis, not in the app server?</li></ul>`
      },
    ],
  },
  {
    id: 'm9b',
    track: 'phase9',
    title: "Projects \u2014 Intermediate",
    icon: '9B',
    topics: [
      {
        id: 'P9-03',
        num: 'P9-03',
        title: "Project: Distributed Rate Limiter",
        time: 7,
        html: `<h4>Requirements</h4><ul><li>Sliding-window + token-bucket limiter, per-user/per-IP, correct across N servers, 429 + Retry-After, admin console.</li></ul><h4>Architecture</h4><p>App servers → Redis (INCR+EXPIRE counters, sharded by client) + a Lua script for atomicity.</p><h4>Tech</h4><p>Redis, Lua, nginx (<code>limit_req</code> as a comparison baseline).</p><h4>Milestones</h4><ol><li>Single-server limiter.</li><li>Redis-backed.</li><li>Lua atomic.</li><li>Distributed-correctness test.</li><li>Dashboard.</li></ol><h4>Failure scenarios to test</h4><ul><li>Redis down — fail-open or fail-closed?</li><li>Clock skew between servers.</li></ul><h4>Load-testing tasks</h4><ul><li>Limiter overhead at 10k rps; prove no client exceeds N.</li></ul><h4>Scaling challenge</h4><p>What does approximate counting buy you, and where should the limiter live?</p><h4>Questions you must answer yourself</h4><ul><li>Why Lua?</li><li>How do you avoid the boundary-burst of a fixed window?</li></ul>`
      },
      {
        id: 'P9-04',
        num: 'P9-04',
        title: "Project: Notification Service with a Queue",
        time: 8,
        html: `<h4>Requirements</h4><ul><li>Publish events → fan out to email/SMS/push; retries with backoff; dedup; per-user rate limits; delivery tracking.</li></ul><h4>Architecture</h4><p>Producer → RabbitMQ (or Redis Streams) → per-channel workers → providers; an outbox table for the "DB + queue" atomicity problem.</p><h4>Tech</h4><p>RabbitMQ/Redis Streams, Postgres (outbox), a fake email/SMS provider.</p><h4>Milestones</h4><ol><li>Queue → workers.</li><li>Retries/DLQ.</li><li>Outbox pattern.</li><li>Dedup.</li><li>Rate limits.</li><li>Dashboard.</li></ol><h4>Failure scenarios to test</h4><ul><li>Provider down (backpressure + DLQ).</li><li>Duplicate delivery (dedup).</li><li>Outbox relay crash (at-least-once).</li></ul><h4>Load-testing tasks</h4><ul><li>Fan out one event to 100k users; measure tail latency.</li></ul><h4>Scaling challenge</h4><p>Why can't you publish to the queue and commit the DB in one atomic step — and what does exactly-once actually require here?</p><h4>Questions you must answer yourself</h4><ul><li>Where does the dedup ID come from?</li><li>How do slow SMS workers avoid blocking push?</li></ul>`
      },
      {
        id: 'P9-05',
        num: 'P9-05',
        title: "Project: Chat System with WebSockets",
        time: 8,
        html: `<h4>Requirements</h4><ul><li>1:1 + group chat, delivery/read receipts, presence, offline queue, history.</li></ul><h4>Architecture</h4><p>WebSocket servers (stateful) + Redis connection directory (<code>user_id → server</code>) + durable message store (Postgres) + queue for offline.</p><h4>Tech</h4><p>WebSockets (Node/Go/Java), Redis pub/sub (cross-server fan-out), Postgres.</p><h4>Milestones</h4><ol><li>1:1 delivery.</li><li>Connection directory.</li><li>Group fan-out.</li><li>Presence.</li><li>Offline queue.</li><li>Receipts.</li></ol><h4>Failure scenarios to test</h4><ul><li>A chat server dies (clients reconnect; directory cleanup).</li><li>Message ordering under reconnect.</li></ul><h4>Load-testing tasks</h4><ul><li>How many concurrent sockets can one server hold? (file-descriptor limits!)</li></ul><h4>Scaling challenge</h4><p>What breaks if two servers claim the same user?</p><h4>Questions you must answer yourself</h4><ul><li>Why is the directory in Redis, not Postgres?</li><li>Where is durability enforced — before or after delivery?</li></ul>`
      },
    ],
  },
  {
    id: 'm9c',
    track: 'phase9',
    title: "Projects \u2014 Advanced",
    icon: '9C',
    topics: [
      {
        id: 'P9-06',
        num: 'P9-06',
        title: "Project: News Feed",
        time: 8,
        html: `<h4>Requirements</h4><ul><li>Posts, follows, ranked feed (recency + engagement), hybrid fan-out.</li></ul><h4>Architecture</h4><p>Postgres (graph + posts) → fan-out workers (queue) → Redis timeline cache (capped ID list) → hydrate + rank on read.</p><h4>Tech</h4><p>Postgres, Redis, RabbitMQ/Kafka, k6.</p><h4>Milestones</h4><ol><li>Naive pull feed.</li><li>Push fan-out.</li><li>Hybrid (celebrity threshold).</li><li>Ranking.</li><li>Cache eviction.</li></ol><h4>Failure scenarios to test</h4><ul><li>Fan-out lag (feed temporarily missing a post).</li><li>Celebrity post bursts.</li></ul><h4>Load-testing tasks</h4><ul><li>Feed p99 for a normal user vs a 1M-follower celebrity.</li></ul><h4>Scaling challenge</h4><p>Why cache IDs not content, and what happens on a cache miss?</p><h4>Questions you must answer yourself</h4><ul><li>Where does the celebrity threshold live?</li><li>How do you cap the timeline cache?</li></ul>`
      },
      {
        id: 'P9-07',
        num: 'P9-07',
        title: "Project: File Storage & Sync System",
        time: 8,
        html: `<h4>Requirements</h4><ul><li>Upload/download; chunked sync (only changed blocks); dedup by content hash; version history.</li></ul><h4>Architecture</h4><p>Metadata service (Postgres) + chunk store (MinIO/S3) + content-hash index + sync workers + notifications.</p><h4>Tech</h4><p>MinIO (S3-compatible), Postgres, Redis, WebSockets/SSE for sync push.</p><h4>Milestones</h4><ol><li>Upload.</li><li>Chunking.</li><li>Dedup.</li><li>Version pointers.</li><li>Sync-on-change.</li><li>Conflict copies.</li></ol><h4>Failure scenarios to test</h4><ul><li>Partial upload (resume).</li><li>Missing chunk (rebuild).</li><li>Two-device conflict.</li></ul><h4>Load-testing tasks</h4><ul><li>Dedup hit rate; large-file upload throughput.</li></ul><h4>Scaling challenge</h4><p>How does dedup interact with encryption, and what's the metadata-vs-chunk sharding decision?</p><h4>Questions you must answer yourself</h4><ul><li>Which blocks upload after a small edit to a 2GB file?</li></ul>`
      },
      {
        id: 'P9-08',
        num: 'P9-08',
        title: "Project: Distributed Key-Value Store",
        time: 9,
        html: `<h4>Requirements</h4><ul><li>get/put/delete across 3+ nodes; consistent hashing + virtual nodes; tunable W/R; replica repair.</li></ul><h4>Architecture</h4><p>Nodes on a hash ring; gossip membership; per-key version vectors; read-repair + hinted handoff.</p><h4>Tech</h4><p>Go/Python, gRPC between nodes (or in-memory with a client library).</p><h4>Milestones</h4><ol><li>Single node.</li><li>Ring.</li><li>Virtual nodes.</li><li>Replication.</li><li>Quorum reads/writes.</li><li>Version vectors.</li><li>Node failure/rejoin.</li></ol><h4>Failure scenarios to test</h4><ul><li>Kill a node mid-write.</li><li>Partition 2|1.</li><li>Rejoin with stale data.</li></ul><h4>Load-testing tasks</h4><ul><li>Rebalancing cost when adding a node.</li></ul><h4>Scaling challenge</h4><p>Why version vectors, not timestamps? What does a sloppy quorum hide?</p><h4>Questions you must answer yourself</h4><ul><li>What moves when the 4th node joins?</li></ul>`
      },
      {
        id: 'P9-09',
        num: 'P9-09',
        title: "Project: Event-Driven E-Commerce Backend",
        time: 9,
        html: `<h4>Requirements</h4><ul><li>Order → payment → inventory → shipping → notifications, all via events; idempotent consumers; outbox + CDC; reconciliation.</li></ul><h4>Architecture</h4><p>Order service → Kafka → payment/inventory/shipping consumers (own DBs) → saga orchestrator (or choreography) → notification fan-out.</p><h4>Tech</h4><p>Kafka, Postgres ×4, outbox + Debezium (CDC), k6.</p><h4>Milestones</h4><ol><li>Monolith order flow.</li><li>Split services.</li><li>Events.</li><li>Outbox.</li><li>Saga + compensation.</li><li>Idempotency end-to-end.</li><li>Reconciliation job.</li></ol><h4>Failure scenarios to test</h4><ul><li>Payment succeeds but shipping fails (compensation).</li><li>Duplicate events (idempotency).</li><li>Kafka partition skew.</li></ul><h4>Load-testing tasks</h4><ul><li>Order throughput; consumer lag.</li></ul><h4>Scaling challenge</h4><p>Orchestration vs choreography — which did you build and why? Where can you STILL double-charge a customer, and what closes that hole?</p><h4>Questions you must answer yourself</h4><ul><li>Which consumer's failure blocks the order, and which shouldn't?</li></ul>`
      },
    ],
  },
  {
    id: 'm10a',
    track: 'phase10',
    title: "Interview Preparation",
    icon: '10',
    topics: [
      {
        id: 'P10-01',
        num: 'P10-01',
        title: "What a System-Design Interview Actually Tests",
        time: 6,
        html: `<p>A system design interview asks you to architect a large-scale system on a whiteboard in 35-45 minutes: something like Twitter, Uber, or a URL shortener. There's no single correct answer. You're graded on process, not a specific diagram.</p>
<h4>What's actually being tested</h4>
<ul>
<li>Can you turn a vague prompt into concrete, scoped requirements</li>
<li>Can you estimate scale (users, requests/sec, storage) and let that scale drive your design</li>
<li>Can you produce a coherent high-level architecture, then go deep on the hard part</li>
<li>Can you name tradeoffs out loud instead of pretending there's one right answer</li>
<li>Can you communicate like someone the interviewer would want running point on a real project</li>
</ul>
<h4>How it differs from a coding interview</h4>
<ul>
<li>No single correct output — the interviewer cares about your reasoning trail</li>
<li>Ambiguity is the point, not an obstacle. Asking good clarifying questions is scored.</li>
<li>Depth beats breadth. Racing through 10 shallow ideas loses to nailing 2-3 hard problems.</li>
<li>It's collaborative. The interviewer will nudge, interrupt, and push back — that's normal, not a sign you're failing.</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>Interviewers usually decide in the first 10 minutes whether you have a workable process. Nail requirements-gathering and estimation before you draw a single box.</div>`
      },
      {
        id: 'P10-02',
        num: 'P10-02',
        title: "The Interview Framework (9 steps)",
        time: 7,
        html: `<p>A repeatable structure so you're never staring at a blank whiteboard. Say it out loud as you go — it signals process.</p><ol><li><strong>Requirements (3–5 min)</strong> — functional + the 2–3 NFRs that matter; scope out loudly.</li><li><strong>Estimation (3–5 min)</strong> — DAU → RPS avg/peak → storage → bandwidth; let numbers drive decisions.</li><li><strong>API (2–3 min)</strong> — 3–6 endpoints; versioning + idempotency where relevant.</li><li><strong>Data model (2–3 min)</strong> — tables/collections + key fields + shard key.</li><li><strong>Architecture (10 min)</strong> — clients → LB/gateway → services → cache → DB → queue.</li><li><strong>Deep dive (15 min)</strong> — follow the interviewer's steer to the hardest 1–2 components.</li><li><strong>Bottlenecks (2 min)</strong> — the real constraints.</li><li><strong>Failure handling (2 min)</strong> — "what dies and what happens".</li><li><strong>Tradeoffs (2 min)</strong> — the explicit compromises.</li></ol><div class="diagram" data-diagram="framework"></div><div class="callout callout-tip"><span class="callout-tag">TIP</span>Interviewers usually decide in the first 10 minutes whether you have a workable process. Nail requirements + estimation before drawing a single box.</div>`
      },
      {
        id: 'P10-03',
        num: 'P10-03',
        title: "Answer-Quality Rubric",
        time: 6,
        html: `<p>Calibrate your answers against this. Most candidates plateau at "decent".</p><table><tr><th>Level</th><th>What it looks like</th></tr><tr><td>Weak</td><td>No requirements; jumps to a diagram; name-drops "Kafka + microservices"; no numbers; one "right" answer; can't handle a failure question.</td></tr><tr><td>Decent</td><td>Lists requirements; correct but generic diagram; states one option; handles the obvious failure; no estimation or estimation with no consequence.</td></tr><tr><td>Strong</td><td>Scopes + cuts scope; estimation that changes a decision; API + data model; alternatives named and picked with reasons; walks a read AND write path; handles a failure + mitigation.</td></tr><tr><td>Senior</td><td>All of Strong, plus: names the 2–3 NFRs that shape the system; separates strong vs eventual consistency per data type; answers 10×/100× with specific changes; anticipates the next question; admits what they'd simplify.</td></tr></table><div class="callout callout-tip"><span class="callout-tag">TIP</span>Self-score every mock against this table, then rewrite the "senior" parts you missed.</div>`
      },
      {
        id: 'P10-04',
        num: 'P10-04',
        title: "Common Mistakes That Sink Candidates",
        time: 5,
        html: `<p>Most failed system design interviews aren't failed on technical knowledge — they're failed on process.</p>
<h4>The recurring failure patterns</h4>
<ul>
<li><strong>Jumping straight to a diagram</strong> before requirements or scale are clear — you end up designing the wrong system, confidently</li>
<li><strong>Silence</strong> — thinking for 90 seconds without narrating loses the interviewer even when your final answer is fine</li>
<li><strong>One "right" answer syndrome</strong> — presenting a design as the only option instead of naming alternatives and tradeoffs</li>
<li><strong>Over-engineering early</strong> — reaching for Kafka and 12 microservices for a system that a single service and a Postgres read replica would handle at the stated scale</li>
<li><strong>Ignoring the interviewer's steer</strong> — if they ask "what happens when this node dies," that's a direct signal about where to go deep; don't change the subject</li>
<li><strong>Never revisiting non-functional requirements</strong> — stating "we need low latency" in minute 3 and never mentioning caching or CDNs again</li>
</ul>
<div class="callout callout-watch"><span class="callout-tag">WATCH</span>Silence is the most underrated failure mode. Narrate your thinking even when you're unsure — "I'm weighing SQL vs NoSQL here, leaning NoSQL because..." is worth more than a long silent pause that ends in the same answer.</div>`
      },
      {
        id: 'P10-05',
        num: 'P10-05',
        title: "Question Bank",
        time: 6,
        html: `<h4>Beginner (🟢)</h4><ul><li>URL shortener</li><li>Pastebin</li><li>REST API design</li><li>cache for a hot key</li><li>rate limiter (single machine)</li><li>Tic-Tac-Toe / Parking Lot (LLD)</li><li>"design the DB for a blog"</li></ul><h4>Intermediate (🟡)</h4><ul><li>Instagram</li><li>Chat / Messenger</li><li>Notification system</li><li>Rate limiter (distributed)</li><li>Search / typeahead</li><li>Ticketmaster</li><li>Uber</li><li>Food delivery</li><li>Splitwise / Elevator / Vending Machine (LLD)</li></ul><h4>Advanced (🔴)</h4><ul><li>Payment system</li><li>Distributed KV store</li><li>News feed with ranking</li><li>Web crawler</li><li>Dropbox / Drive collaboration</li><li>"100% consistent across regions"</li><li>Metrics & monitoring pipeline</li></ul><p>Each: 45 minutes, full framework, then self-score on P10-03.</p>`
      },
      {
        id: 'P10-06',
        num: 'P10-06',
        title: "Mock Interview Plan",
        time: 5,
        html: `<ul><li>6–8 mocks minimum: 4 beginner/intermediate, 2 advanced, 1–2 LLD.</li><li>Use a real whiteboard or excalidraw; <strong>record yourself</strong> and review for narration + silence.</li><li>After each: diff your design against the Phase 8 walkthrough; write one thing you'll change.</li><li>For LLD rounds: 45–60 min of working code + the extensibility questions — that's the Phase 2 skill.</li></ul><div class="callout callout-tip"><span class="callout-tag">TIP</span>Silence is the most underrated failure mode. Narrate even when unsure — "I'm weighing SQL vs NoSQL here, leaning NoSQL because…" beats a 90-second pause ending in the same answer.</div>`
      },
      {
        id: 'P10-07',
        num: 'P10-07',
        title: "Final Checklist",
        time: 5,
        html: `<p>The night before: reload the framework (P10-02), the rubric (P10-03), and the capstone (P8-06). Then run one cold 45-minute mock.</p><ul><li>The 9-step framework, from memory.</li><li>The numbers table (P0-07) and the nines table (P6-01).</li><li>The default-safe answers (REF-02).</li><li>The capstone: consistent hashing + quorums + version vectors, fluently.</li></ul>`
      },
    ],
  },
  {
    id: 'mref',
    track: 'reference',
    title: "Reference",
    icon: 'R',
    topics: [
      {
        id: 'REF-01',
        num: 'REF-01',
        title: "Numbers & Nines Cheat Sheet",
        time: 5,
        html: `<h4>Latency numbers (memorize)</h4><table><tr><th>Operation</th><th>Time</th></tr><tr><td>L1 cache</td><td>~1 ns</td></tr><tr><td>RAM</td><td>~100 ns</td></tr><tr><td>SSD random read</td><td>~10–100 µs</td></tr><tr><td>HDD seek</td><td>~10 ms</td></tr><tr><td>Datacenter round-trip</td><td>~0.5 ms</td></tr><tr><td>Cross-US round-trip</td><td>~150 ms</td></tr></table><h4>Availability nines</h4><table><tr><th>Nines</th><th>Downtime/year</th><th>Typical for</th></tr><tr><td>99%</td><td>~3.65 days</td><td>Internal tools</td></tr><tr><td>99.9%</td><td>~8.7 hours</td><td>Consumer apps</td></tr><tr><td>99.99%</td><td>~52 minutes</td><td>Payments, core APIs</td></tr><tr><td>99.999%</td><td>~5 minutes</td><td>Telecom, critical infra</td></tr></table><h4>Quick estimation</h4><ul><li>86,400 s/day ≈ 10⁵; round aggressively.</li><li>QPS = requests/day ÷ 10⁵ × peak factor (2–3×).</li><li>Storage = bytes/record × records/day × retention. Bandwidth = QPS × payload.</li></ul>`
      },
      {
        id: 'REF-02',
        num: 'REF-02',
        title: "Interview Cheat Sheet",
        time: 6,
        html: `<h4>The framework, in one screen</h4>
<ol>
<li>Clarify functional + non-functional requirements. Explicitly scope out what you won't cover.</li>
<li>Estimate: DAU, QPS (avg + peak), storage, bandwidth.</li>
<li>Define 3-5 core API endpoints.</li>
<li>Draw the high-level design: client, LB, services, DB, cache, queue.</li>
<li>Deep dive wherever the interviewer steers you.</li>
<li>Wrap up: bottlenecks, single points of failure, what you'd improve with more time.</li>
</ol>
<h4>Default-safe answers when you're unsure</h4>
<ul>
<li>Read-heavy system, correctness-tolerant → <strong>cache-aside + eventual consistency</strong></li>
<li>Write-heavy, needs correctness → <strong>strong consistency, ACID transaction, leader-follower replication</strong></li>
<li>Static assets (images/video/files) → <strong>object storage + CDN</strong>, never in the primary DB</li>
<li>Slow/non-critical work → <strong>move it off the request path onto a queue</strong></li>
<li>Growing dataset that needs to scale writes → <strong>shard, using consistent hashing</strong></li>
<li>One dependency failing shouldn't take down the system → <strong>circuit breaker + graceful degradation</strong></li>
</ul>
<h4>Tradeoff phrases that always sound senior</h4>
<ul>
<li>"This needs strong consistency because X; that needs eventual consistency because Y."</li>
<li>"I'd start simple here and only add [complexity] once [specific scale trigger] is hit."</li>
<li>"The failure mode I'm worried about is X, so I'd mitigate it with Y."</li>
</ul>
<div class="callout callout-tip"><span class="callout-tag">TIP</span>Revisit this page the night before an interview — it's the fastest way to reload the whole framework and default answers into working memory.</div>`
      },
      {
        id: 'REF-03',
        num: 'REF-03',
        title: "Glossary (expanded)",
        time: 8,
        html: `<table>
<tr><th>Term</th><th>Definition</th></tr>
<tr><td>ACID</td><td>Atomicity, Consistency, Isolation, Durability — transactional guarantees in traditional databases</td></tr>
<tr><td>Availability</td><td>Percentage of time a system is operational and responding</td></tr>
<tr><td>BASE</td><td>Basically Available, Soft state, Eventually consistent — the NoSQL-leaning alternative to ACID</td></tr>
<tr><td>Bloom filter</td><td>Probabilistic structure for fast "definitely not present, or maybe present" checks</td></tr>
<tr><td>CAP theorem</td><td>During a partition, choose Consistency or Availability — can't have both</td></tr>
<tr><td>CDN</td><td>Content Delivery Network — caches static content geographically close to users</td></tr>
<tr><td>Circuit breaker</td><td>Stops calling a failing dependency after a threshold, to prevent cascading failure</td></tr>
<tr><td>Consistent hashing</td><td>Distributes keys across nodes so adding/removing a node reshuffles minimal data</td></tr>
<tr><td>Denormalization</td><td>Duplicating data to avoid joins, trading storage/write complexity for read speed</td></tr>
<tr><td>Eventual consistency</td><td>Replicas converge to the same value over time, but may briefly disagree</td></tr>
<tr><td>Fan-out</td><td>Distributing one write/event to many recipients (feeds, notifications)</td></tr>
<tr><td>Idempotency</td><td>Applying an operation multiple times has the same effect as applying it once</td></tr>
<tr><td>Latency</td><td>Time for a single request to complete</td></tr>
<tr><td>Load balancer</td><td>Distributes incoming traffic across a pool of servers</td></tr>
<tr><td>Leader-follower</td><td>One node accepts writes; others replicate from it and typically serve reads</td></tr>
<tr><td>PACELC</td><td>Extends CAP: even without a partition, trade off Latency vs Consistency</td></tr>
<tr><td>Partitioning/Sharding</td><td>Splitting data across multiple machines to scale storage/throughput</td></tr>
<tr><td>Quorum</td><td>Minimum number of nodes that must agree/respond for an operation to succeed</td></tr>
<tr><td>Rate limiting</td><td>Capping how many requests a client can make in a time window</td></tr>
<tr><td>Replication</td><td>Keeping multiple copies of data across machines for availability/read scaling</td></tr>
<tr><td>Reverse proxy</td><td>Sits in front of servers, hides backend details from clients</td></tr>
<tr><td>Saga pattern</td><td>Distributed transaction as a sequence of local transactions with compensations</td></tr>
<tr><td>Sharding</td><td>See Partitioning</td></tr>
<tr><td>Sticky session</td><td>Routing a client's requests to the same server every time (needed for stateful servers)</td></tr>
<tr><td>Strong consistency</td><td>Every read reflects the most recent write, immediately</td></tr>
<tr><td>Throughput</td><td>Number of requests a system can process per unit time</td></tr>
<tr><td>TTL</td><td>Time To Live — how long cached/stored data remains valid before expiring</td></tr>
<tr><td>Vertical scaling</td><td>Adding more resources (CPU/RAM) to a single machine</td></tr>
<tr><td>Horizontal scaling</td><td>Adding more machines to distribute load</td></tr>
<tr><td>Write-through</td><td>Writing to cache and DB synchronously on every write</td></tr>
<tr><td>Write-back</td><td>Writing to cache immediately, DB asynchronously afterward</td></tr>
</table><h4>Added terms</h4><table><tr><th>Term</th><th>Definition</th></tr><tr><td>Linearizability</td><td>Each op appears to take effect atomically at one instant, consistent with real time</td></tr><tr><td>Serializability</td><td>Transactions execute as if in some serial order (an isolation property)</td></tr><tr><td>Causal consistency</td><td>Causally-related writes are seen in order; unrelated writes may reorder</td></tr><tr><td>Read-your-writes</td><td>A user always sees their own recent writes immediately</td></tr><tr><td>Replication lag</td><td>Delay between a write on the leader and its visibility on replicas</td></tr><tr><td>Multi-leader / leaderless</td><td>Multiple write points (multi-DC, offline) / any replica accepts writes</td></tr><tr><td>Quorum (W/R)</td><td>Min write/read acks among N replicas; W+R>N ⇒ read-write overlap</td></tr><tr><td>Vector clock</td><td>Per-node counters that detect concurrent versions</td></tr><tr><td>Lamport clock</td><td>Logical counter honoring happens-before (one direction only)</td></tr><tr><td>Fencing token</td><td>Monotonic number granted at election; storage rejects stale tokens</td></tr><tr><td>Lease</td><td>Time-bounded ownership (a lock with an expiry)</td></tr><tr><td>Split-brain</td><td>Two nodes both believing they are leader</td></tr><tr><td>Lost update</td><td>Two txns read then write; one write is silently lost</td></tr><tr><td>Write skew</td><td>Concurrent txns make conflicting decisions from overlapping reads</td></tr><tr><td>LSM-tree</td><td>Write-optimized index: memtable → sorted files → compaction</td></tr><tr><td>Connection pool</td><td>Reused DB connections to avoid per-request TCP/session setup</td></tr><tr><td>RPO / RTO</td><td>Max acceptable data loss (time) / max time to recover</td></tr><tr><td>SLO / SLI / error budget</td><td>Target / measurement / 1−SLO bank account</td></tr><tr><td>Backpressure</td><td>Slowing producers when queues fill (bounded buffers)</td></tr><tr><td>Bulkhead</td><td>Isolating resource pools per dependency</td></tr><tr><td>Load shedding</td><td>Dropping low-priority work under overload</td></tr><tr><td>Outbox pattern</td><td>Write business change + event atomically; a relay publishes</td></tr><tr><td>CDC</td><td>Tail the DB log to stream changes (Debezium)</td></tr><tr><td>At-most / at-least / exactly-once</td><td>May lose / may duplicate / impossible in general</td></tr><tr><td>Effectively-once</td><td>At-least-once delivery + idempotent consumer</td></tr><tr><td>Event sourcing / CQRS</td><td>State = fold(events) / separate read & write models</td></tr><tr><td>Geohash / quadtree</td><td>2D proximity → 1D prefix / recursive 2D subdivision</td></tr><tr><td>Merkle tree</td><td>Hash tree that makes large-data comparison cheap (anti-entropy)</td></tr><tr><td>CRDT / OT</td><td>Conflict-free replicated data types / operational transform</td></tr><tr><td>Adaptive bitrate (HLS/DASH)</td><td>Client switches quality per chunk based on network</td></tr><tr><td>Blue/green, canary, rolling</td><td>Instant cutover / percent rollout / gradual replace</td></tr><tr><td>Feature flag</td><td>Ship dark, release via config (also your kill switch)</td></tr><tr><td>Liveness vs readiness</td><td>Restart me / route to me</td></tr><tr><td>mTLS</td><td>Mutual TLS — both sides prove identity</td></tr><tr><td>Double-entry ledger</td><td>debit ≡ credit; every movement balanced & auditable</td></tr></table>`
      },
    ],
  },
];
