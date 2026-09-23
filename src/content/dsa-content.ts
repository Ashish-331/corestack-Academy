/**
 * Authored lesson material for the DSA course, keyed by lesson id.
 * Shape mirrors `os-content.ts` ({ id -> content }) so the lookup chain in
 * `lookup.ts` stays uniform. Every lesson here is hand written — nothing in
 * this course should ever fall through to the placeholder generator.
 */
export interface AuthoredQuiz {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface AuthoredLesson {
  html: string;
  quizzes?: AuthoredQuiz[];
  practice?: { prompt: string; hint?: string; solution: string }[];
  draft?: boolean;
}

export const dsaContent: Record<string, AuthoredLesson> = {
  "ds-1-l0": {
    html: `<p class="lead">Complexity analysis is the shared language of engineering interviews. It answers one question: <strong>how does cost grow as input grows?</strong> Not "how many milliseconds" — that depends on the machine — but the shape of the curve.</p>

<h2 id="growth">Growth rates you must recognise</h2>
<table>
  <thead><tr><th>Class</th><th>n = 1,000</th><th>Typical source</th></tr></thead>
  <tbody>
    <tr><td>O(1)</td><td>1</td><td>Hash lookup, array index</td></tr>
    <tr><td>O(log n)</td><td>~10</td><td>Binary search, balanced tree</td></tr>
    <tr><td>O(n)</td><td>1,000</td><td>Single scan</td></tr>
    <tr><td>O(n log n)</td><td>~10,000</td><td>Good sorting, heap ops</td></tr>
    <tr><td>O(n²)</td><td>1,000,000</td><td>Nested loops over the input</td></tr>
    <tr><td>O(2ⁿ)</td><td>astronomical</td><td>Subset enumeration</td></tr>
  </tbody>
</table>

<h2 id="rules">Three rules that do 90% of the work</h2>
<ol>
  <li><strong>Drop constants.</strong> 3n + 20 is O(n). Constants are machine noise.</li>
  <li><strong>Keep the dominant term.</strong> n² + n log n + 400 is O(n²).</li>
  <li><strong>Cost of composition multiplies; cost of sequence takes the max.</strong> Sorting then scanning is O(n log n), not O(n log n + n).</li>
</ol>

<h2 id="amortised">Amortised analysis</h2>
<p>A dynamic array that doubles when full does an O(n) copy occasionally and O(1) appends the rest of the time. Charging each append a constant "tax" pays for the occasional copy, so the <em>amortised</em> cost of <code>push</code> is O(1) even though the <em>worst case</em> single push is O(n).</p>
<pre><code>// capacity doubling: total copies over n pushes &lt;= 2n
let cap = 1, len = 0, buf = new Array(cap);
function push(v) {
  if (len === cap) {           // grow
    cap *= 2;
    const next = new Array(cap);
    for (let i = 0; i &lt; len; i++) next[i] = buf[i];
    buf = next;
  }
  buf[len++] = v;
}</code></pre>

<div class="callout"><strong>Interview favourite —</strong> "What is the complexity of this loop?" Trace the <em>number of iterations as a function of n</em> out loud before answering. <code>for (i = 1; i &lt; n; i *= 2)</code> is O(log n) because the multiplier, not the addend, changes.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Big-O is an upper bound, Big-Θ a tight bound; interviews use O() loosely to mean Θ.</li>
  <li>Always state whether you are talking time or space, and worst case or amortised.</li>
  <li>Amortised O(1) is a guarantee over a <em>sequence</em> of operations, not a single one.</li>
</ol>`,
    quizzes: [
      {
        q: "What is the time complexity of building a binary heap from n unsorted items?",
        options: ["O(n log n)", "O(n)", "O(log n)", "O(n²)"],
        answer: 1,
        explain:
          "Bottom-up heapify costs Σ h·(n/2^h) which converges to O(n). Calling insert n times would be O(n log n) — the sift-down trick is what saves the linear term.",
      },
      {
        q: "A hash table lookup is O(1). What is the honest caveat?",
        options: [
          "None — it is always constant",
          "It is amortised/expected O(1); adversarial keys can degrade it to O(n)",
          "It is O(log n) in practice",
          "It is O(1) only for integers",
        ],
        answer: 1,
        explain:
          "Expected O(1) under a good hash and reasonable load factor. Clustered keys or a load factor ≫ 1 collapse chains into a linear scan.",
      },
    ],
  },
  "ds-1-l1": {
    html: `<p class="lead">Arrays are the only structure the CPU truly loves: contiguous memory means prefetch-friendly, cache-line-sized reads. Almost every "make it faster" answer in an interview starts with "put it in an array".</p>

<h2 id="layout">Why contiguity matters</h2>
<p>Reading <code>a[i]</code> is pointer arithmetic — one multiplication and one add. Walking an array streams sequential cache lines; walking a linked list chases pointers that may live on different pages. On modern hardware that difference is routinely 10–50×.</p>

<h2 id="ops">Cost of each operation</h2>
<table>
  <thead><tr><th>Operation</th><th>Array</th><th>Dynamic array</th></tr></thead>
  <tbody>
    <tr><td>Read by index</td><td>O(1)</td><td>O(1)</td></tr>
    <tr><td>Append at end</td><td>n/a (fixed)</td><td>O(1) amortised</td></tr>
    <tr><td>Insert / delete at front</td><td>O(n)</td><td>O(n) — shifts everything</td></tr>
    <tr><td>Search unsorted</td><td>O(n)</td><td>O(n)</td></tr>
    <tr><td>Search sorted</td><td>O(log n)</td><td>O(log n)</td></tr>
  </tbody>
</table>

<h2 id="strings">Strings are arrays with a twist</h2>
<p>Immutability in Java, Python and JavaScript means every "concatenation" allocates. Building a string in a loop is O(n²); collecting parts in a list and joining once is O(n).</p>
<pre><code>// O(n²) — each += copies the whole string
let s = "";
for (const p of parts) s += p;

// O(n) — single allocation at the end
const s2 = parts.join("");</code></pre>

<div class="callout"><strong>Common pitfall —</strong> using <code>array.splice(0, 1)</code> inside a loop. That is an O(n) shift per iteration, turning an O(n) pass into O(n²). Use a write index instead.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Random access O(1), middle insertion O(n) — pick a different structure if you need cheap middle writes.</li>
  <li>Cache locality is a real, measurable reason to prefer arrays.</li>
  <li>Two-pointer and sliding-window patterns exist precisely because arrays are indexable and sorted-able.</li>
</ol>`,
  },
  "ds-1-l2": {
    html: `<p class="lead">Lists, stacks and queues trade random access for O(1) structural edits. They are the substrate behind undo stacks, schedulers, browsers and BFS.</p>

<h2 id="linked">Linked lists</h2>
<p>A singly linked list gives O(1) insert/delete <em>given the predecessor node</em>, and O(n) to find it. Doubly linked lists add O(1) removal of a node you already hold — which is exactly why LRU caches are hash map + doubly linked list.</p>
<pre><code>function reverse(head) {
  let prev = null, cur = head;
  while (cur) {
    const next = cur.next;   // save
    cur.next = prev;         // flip
    prev = cur;              // advance
    cur = next;
  }
  return prev;               // new head
}</code></pre>

<h2 id="stack">Stacks (LIFO)</h2>
<ul>
  <li><strong>Monotonic stack</strong> — keep the stack strictly increasing/decreasing; solves "next greater element", daily temperatures and largest rectangle in O(n).</li>
  <li><strong>Expression evaluation</strong> — push operands, pop on operator; also the mechanism behind DFS recursion.</li>
</ul>

<h2 id="queue">Queues (FIFO) and deques</h2>
<p>BFS uses a queue to preserve level order. A deque (double-ended queue) gives O(1) at both ends, which is what makes the sliding-window-maximum trick work: store indices whose values are decreasing, drop from the back when a bigger value arrives.</p>
<pre><code>// sliding window maximum, O(n)
const dq = [];                 // indices, values decreasing
for (let i = 0; i &lt; a.length; i++) {
  if (dq[0] &lt;= i - k) dq.shift();          // expired
  while (dq.length &amp;&amp; a[dq.at(-1)] &lt;= a[i]) dq.pop();
  dq.push(i);
  if (i &gt;= k - 1) out.push(a[dq[0]]);
}</code></pre>

<div class="callout"><strong>Interview favourite —</strong> detect a cycle with Floyd's tortoise and hare: slow moves 1, fast moves 2; if they meet there is a cycle, and restarting one pointer from the head makes them meet at the entry.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Linked lists buy O(1) edits at a known node and give up O(1) indexing.</li>
  <li>Monotonic stacks convert many "nearest greater/smaller" problems from O(n²) to O(n).</li>
  <li>Deque + monotonic invariant = sliding window maximum in linear time.</li>
</ol>`,
  },
  "ds-1-l3": {
    html: `<p class="lead">A hash table maps a key to an array index through a hash function. Everything interesting about it is what happens when two keys land on the same index.</p>

<h2 id="pipeline">The pipeline</h2>
<ol>
  <li><strong>Hash</strong> the key to an integer (a good hash avalanche-spreads bits).</li>
  <li><strong>Compress</strong> into the table with <code>h &amp; (capacity - 1)</code> (capacity a power of two).</li>
  <li><strong>Resolve</strong> collisions.</li>
  <li><strong>Resize</strong> when load factor crosses a threshold.</li>
</ol>

<h2 id="collision">Collision strategies</h2>
<table>
  <thead><tr><th>Strategy</th><th>Idea</th><th>Trade-off</th></tr></thead>
  <tbody>
    <tr><td>Chaining</td><td>Linked list / tree per bucket</td><td>Simple, tolerates load &gt; 1; pointer chasing, Java 8 treeifies long buckets</td></tr>
    <tr><td>Linear probing</td><td>Try next slot, then next…</td><td>Cache friendly, but primary clustering</td></tr>
    <tr><td>Quadratic probing</td><td>Try i², 2i²…</td><td>Reduces clustering, needs careful capacity</td></tr>
    <tr><td>Double hashing</td><td>Second hash as step size</td><td>Best distribution, costlier hashing</td></tr>
    <tr><td>Robin Hood / hopscotch</td><td>Steal slots from rich buckets</td><td>Tight probe distributions, complex</td></tr>
  </tbody>
</table>

<h2 id="load">Load factor and resizing</h2>
<p>Load factor α = entries / capacity. Expected probe count for chaining is 1 + α/2; for open addressing it degrades sharply past α ≈ 0.7, which is why Python's dict resizes at 2/3 and Ruby's at 5/8. Resizing rehashes every key — an O(n) spike, amortised over all inserts that led to it.</p>
<pre><code>set(key, value) {
  if ((this.size + 1) / this.cap &gt; 0.75) this.resize(this.cap * 2);
  const i = this.findIndex(key);
  if (!this.slots[i].used) this.size++;
  this.slots[i] = { key, value, used: true, tombstone: false };
}</code></pre>

<div class="callout"><strong>Common pitfall —</strong> forgetting tombstones in open addressing: physically removing an entry breaks the probe chain for keys that collided with it. Mark deleted, don't empty.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>O(1) is <em>expected</em>, and it depends on the hash quality and load factor.</li>
  <li>Resizing is the hidden cost — batch loads are cheaper with a pre-sized table.</li>
  <li>Keys must be immutable while in the table; mutating a key corrupts lookup.</li>
</ol>`,
  },
  "ds-2-l0": {
    html: `<p class="lead">A binary tree is recursion in data form. Most tree problems resolve to "do something at the node, recurse left, recurse right" — the only design decision is <em>when</em> you do the work.</p>

<h2 id="traversals">The four traversals</h2>
<table>
  <thead><tr><th>Order</th><th>Sequence</th><th>Use</th></tr></thead>
  <tbody>
    <tr><td>Pre-order</td><td>root, left, right</td><td>Copy / serialise a tree</td></tr>
    <tr><td>In-order</td><td>left, root, right</td><td>Sorted order in a BST</td></tr>
    <tr><td>Post-order</td><td>left, right, root</td><td>Delete, evaluate expressions, subtree sizes</td></tr>
    <tr><td>Level-order</td><td>BFS by depth</td><td>Width, right-side view, minimum depth</td></tr>
  </tbody>
</table>

<pre><code>function inorder(root) {
  const out = [], stack = [];
  let cur = root;
  while (cur || stack.length) {
    while (cur) { stack.push(cur); cur = cur.left; }
    cur = stack.pop();
    out.push(cur.val);
    cur = cur.right;
  }
  return out;
}</code></pre>

<h2 id="patterns">Patterns that recur constantly</h2>
<ul>
  <li><strong>Height vs depth.</strong> Height is measured bottom-up (post-order); depth top-down (pre-order with a carried parameter).</li>
  <li><strong>Diameter = left height + right height.</strong> Compute heights while updating a global max — O(n) instead of O(n²).</li>
  <li><strong>Lowest common ancestor.</strong> In a BST use value comparisons; in a general tree return the node where left and right recursions both succeed.</li>
  <li><strong>Serialise.</strong> Pre-order with null markers reconstructs uniquely.</li>
</ul>

<div class="callout"><strong>Common pitfall —</strong> "height of an empty tree". Decide explicitly: -1 (edges) or 0 (nodes). Mixing the two conventions is the classic off-by-one in balance checks.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Traversal order is a design decision driven by when a node's answer depends on its children.</li>
  <li>Return two values (e.g. height + validity) instead of re-walking to keep O(n).</li>
  <li>Iterative traversal with an explicit stack avoids stack-overflow on degenerate trees.</li>
</ol>`,
    quizzes: [
      {
        q: "Which traversal of a binary search tree emits keys in sorted order?",
        options: ["Pre-order", "Post-order", "In-order", "Level-order"],
        answer: 2,
        explain: "In-order visits the left subtree (smaller keys), then the node, then the right subtree (larger keys).",
      },
    ],
  },
  "ds-2-l1": {
    html: `<p class="lead">A binary search tree gives O(log n) search <em>only if it stays balanced</em>. Self-balancing trees are bookkeeping that guarantees the shape never degenerates into a linked list.</p>

<h2 id="bst">BST invariant</h2>
<p>For every node: all keys in the left subtree &lt; node key &lt; all keys in the right subtree. The classic bug is validating only immediate children — you must carry a (min, max) range down the recursion.</p>
<pre><code>function isBst(node, lo = -Infinity, hi = Infinity) {
  if (!node) return true;
  if (node.val &lt;= lo || node.val &gt;= hi) return false;
  return isBst(node.left, lo, node.val) &amp;&amp; isBst(node.right, node.val, hi);
}</code></pre>

<h2 id="avl">AVL trees</h2>
<p>Strict balance: the heights of the two child subtrees differ by at most 1. Four rebalance cases (LL, RR, LR, RL) resolve with single or double rotation. Lookup is fast and predictable; rebalancing is frequent, so AVL suits read-heavy workloads.</p>

<h2 id="rb">Red-black trees</h2>
<p>Relaxed balance: root black, no two consecutive reds, equal black height on every root-to-leaf path. Height is bounded by 2·log₂(n+1). Fewer rotations on insert, which is why <code>std::map</code>, <code>TreeMap</code> and the Linux CFS scheduler use red-black trees.</p>
<table>
  <thead><tr><th></th><th>AVL</th><th>Red-black</th></tr></thead>
  <tbody>
    <tr><td>Balance strictness</td><td>±1 height</td><td>≤ 2× optimal height</td></tr>
    <tr><td>Insert rotations</td><td>up to 2</td><td>≤ 2</td></tr>
    <tr><td>Delete rotations</td><td>O(log n)</td><td>≤ 3</td></tr>
    <tr><td>Best at</td><td>read-heavy</td><td>write-heavy</td></tr>
  </tbody>
</table>

<div class="callout"><strong>Interview favourite —</strong> why do databases use B+ trees instead of red-black trees? Because one disk page holds hundreds of keys, so a wide, shallow tree minimises I/O, not comparisons.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Validate a BST with a range, not a parent-child comparison.</li>
  <li>AVL = stricter, faster reads; red-black = cheaper writes.</li>
  <li>Rotations are local: O(1) pointer changes that restore a global invariant.</li>
</ol>`,
  },
  "ds-2-l2": {
    html: `<p class="lead">A binary heap is a complete tree stored in a flat array where the children of <code>i</code> sit at <code>2i+1</code> and <code>2i+2</code>. It gives O(log n) insert and extract-min with zero pointer overhead.</p>

<h2 id="invariant">The invariant</h2>
<p>Min-heap: every parent ≤ its children. Note this is <em>not</em> a sorted structure — the only cheap query is the minimum.</p>
<pre><code>siftUp(i)    { while (i &gt; 0 &amp;&amp; a[parent(i)] &gt; a[i]) swap(i, parent(i)), i = parent(i); }
siftDown(i)  { while (true) { const m = smallestOf(i, 2i+1, 2i+2); if (m === i) break; swap(i, m), i = m; } }</code></pre>

<h2 id="heapify">heapify is O(n)</h2>
<p>Sifting down from the last internal node to the root costs Σ h·(n/2^(h+1)) &lt; n. Building a heap by repeated insertion would be O(n log n) — the bottom-up pass is the whole point.</p>

<h2 id="patterns">Top-K patterns</h2>
<ul>
  <li><strong>K largest</strong> → maintain a <em>min</em>-heap of size k; push everything, evicting the smallest. O(n log k).</li>
  <li><strong>K smallest</strong> → max-heap of size k.</li>
  <li><strong>Merge k sorted lists</strong> → min-heap of the k current heads.</li>
  <li><strong>Running median</strong> → two heaps (max-heap for the lower half, min-heap for the upper) kept within one size of each other.</li>
</ul>

<div class="callout"><strong>Common pitfall —</strong> saying a heap finds "the max in O(1)" — it finds the <em>extremum at the root</em> in O(1); arbitrary search is O(n) because the rest of the heap is unordered.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Heap = array-backed complete tree; locality makes it fast in practice.</li>
  <li>Top-K with a bounded heap beats sorting when k ≪ n.</li>
  <li>Heapsort is O(n log n) in place but not stable and has poor cache behaviour.</li>
</ol>`,
  },
  "ds-2-l3": {
    html: `<p class="lead">A trie (prefix tree) stores strings by shared prefix. Lookup cost depends on the <em>length of the key</em>, not the number of stored keys — the crucial difference from a hash table.</p>

<h2 id="shape">Shape and operations</h2>
<pre><code>class TrieNode { children = new Map(); isWord = false; }

insert(w) { let n = root; for (const c of w) { n = n.children.get(c) ??= new TrieNode(); } n.isWord = true; }
search(w) { const n = walk(w); return !!n?.isWord; }
startsWith(p) { return !!walk(p); }</code></pre>

<h2 id="when">When a trie beats a hash map</h2>
<ul>
  <li>Prefix queries: autocomplete, spell-check, IP longest-prefix match.</li>
  <li>Ordered iteration of keys (DFS gives lexicographic order for free).</li>
  <li>Counting words sharing prefixes — store a counter per node.</li>
</ul>
<p>When a hash map wins: exact lookups on a fixed key set, small alphabets with long keys, or when memory matters. A naive trie over 26 letters costs up to 26 pointers per node.</p>

<h2 id="variants">Variants worth naming</h2>
<ul>
  <li><strong>Compressed / radix tree</strong> — collapse chains of single-child nodes; that is what Linux uses for the radix tree page cache.</li>
  <li><strong>Ternary search tree</strong> — three pointers per node, memory-friendly and still prefix-capable.</li>
  <li><strong>Aho-Corasick</strong> — a trie plus failure links for multi-pattern matching in one pass.</li>
</ul>

<div class="callout"><strong>Interview favourite —</strong> "Word Search II": build a trie of the dictionary, then DFS the grid while walking the trie simultaneously so you prune whole branches that no word starts with.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Trie complexity is O(L) per operation where L is key length.</li>
  <li>Prefix operations are the reason to reach for one.</li>
  <li>Compression is how you keep the memory bill sane.</li>
</ol>`,
  },
  "ds-3-l0": {
    html: `<p class="lead">A graph is just vertices and edges; the difficulty is choosing a representation and a traversal order. BFS explores by distance, DFS by depth — and the choice changes what you can compute cheaply.</p>

<h2 id="repr">Representation</h2>
<table>
  <thead><tr><th></th><th>Adjacency list</th><th>Adjacency matrix</th></tr></thead>
  <tbody>
    <tr><td>Space</td><td>O(V + E)</td><td>O(V²)</td></tr>
    <tr><td>Edge lookup</td><td>O(deg(v))</td><td>O(1)</td></tr>
    <tr><td>Iterate neighbours</td><td>O(deg(v))</td><td>O(V)</td></tr>
    <tr><td>Best for</td><td>sparse graphs (the real world)</td><td>dense graphs, Floyd-Warshall</td></tr>
  </tbody>
</table>

<h2 id="bfs">BFS — shortest path in unweighted graphs</h2>
<pre><code>const dist = new Map([[s, 0]]), q = [s];
while (q.length) {
  const u = q.shift();
  for (const v of adj[u]) {
    if (dist.has(v)) continue;
    dist.set(v, dist.get(u) + 1);
    q.push(v);
  }
}</code></pre>
<p>Add a parent map and you get the actual shortest path by walking back from the target. 0-1 BFS (weights 0 or 1) uses a deque instead of a queue.</p>

<h2 id="dfs">DFS — structure, not distance</h2>
<p>DFS classifies edges into tree, back, forward and cross edges. Back edges mean cycles; the colouring trick (white/grey/black) detects them in undirected and directed graphs alike.</p>

<h2 id="components">Connected components</h2>
<p>Loop over all vertices, launching a traversal from each unvisited one; count launches. Union-Find is often simpler for incrementally-added edges.</p>

<div class="callout"><strong>Common pitfall —</strong> marking nodes visited when you <em>pop</em> them from the queue instead of when you <em>push</em>. That inserts duplicates and can blow up memory.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Adjacency list for sparse graphs; matrices only when V² is affordable.</li>
  <li>BFS = fewest edges; DFS = cycle detection, topological order, connectivity.</li>
  <li>Mark visited on enqueue, not dequeue.</li>
</ol>`,
  },
  "ds-3-l1": {
    html: `<p class="lead">Topological sort linearises a DAG so every edge points forward. It is the algorithm behind build systems, course prerequisites, spreadsheets recalculation and Kubernetes dependency ordering.</p>

<h2 id="kahn">Kahn's algorithm (BFS with in-degrees)</h2>
<pre><code>const indeg = Array(V).fill(0);
for (const [u, v] of edges) indeg[v]++;
const q = indeg.map((d, i) =&gt; d === 0 ? i : -1).filter(i =&gt; i &gt;= 0);
const order = [];
while (q.length) {
  const u = q.shift(); order.push(u);
  for (const v of adj[u]) if (--indeg[v] === 0) q.push(v);
}
// order.length &lt; V  =>  cycle exists</code></pre>
<p>The leftover check is a free cycle detector: any node still having a non-zero in-degree lies on (or feeds) a cycle.</p>

<h2 id="dfs">DFS colouring</h2>
<p>Run DFS; push each node onto a list <em>after</em> its descendants finish; reverse the list. A grey node encountered again is a back edge — a cycle.</p>

<h2 id="uses">Where it shows up</h2>
<ul>
  <li><strong>Build ordering</strong> — compile dependencies before dependents.</li>
  <li><strong>Longest path in a DAG</strong> — relax along a topological order, O(V + E).</li>
  <li><strong>Course schedule</strong> — the canonical LeetCode 207/208 pairing.</li>
  <li><strong>Task scheduling with constraints</strong> — plus a max-concurrency check via a running count.</li>
</ul>

<div class="callout"><strong>Interview favourite —</strong> "How many valid orderings exist?" Kahn's algorithm can enumerate them by trying every zero in-degree node at each step; counting them is exponential (#P-hard), so answer with the algorithm, not a formula.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Topological order exists iff the graph is acyclic and directed.</li>
  <li>Kahn's is iterative and gives you cycle detection for free.</li>
  <li>Any DP over a DAG walks a topological order.</li>
</ol>`,
  },
  "ds-3-l2": {
    html: `<p class="lead">Shortest path algorithms differ in one dimension: can the graph have negative weights? Pick the tool after answering that question.</p>

<h2 id="dijkstra">Dijkstra (non-negative weights)</h2>
<pre><code>const dist = Array(V).fill(Infinity); dist[s] = 0;
const pq = new MinHeap([[0, s]]);
while (pq.size) {
  const [d, u] = pq.pop();
  if (d &gt; dist[u]) continue;          // stale entry
  for (const [v, w] of adj[u]) {
    if (d + w &lt; dist[v]) { dist[v] = d + w; pq.push([dist[v], v]); }
  }
}</code></pre>
<p>Correctness relies on the invariant that a popped node's distance is final — which fails the moment an edge is negative. Complexity O((V + E) log V) with a binary heap.</p>

<h2 id="bf">Bellman-Ford (negative edges, negative cycles)</h2>
<p>Relax every edge V−1 times: O(V·E). A V-th pass that still improves a distance proves a reachable negative cycle.</p>

<h2 id="others">The rest of the toolbox</h2>
<table>
  <thead><tr><th>Algorithm</th><th>Use when</th><th>Cost</th></tr></thead>
  <tbody>
    <tr><td>BFS</td><td>unweighted</td><td>O(V + E)</td></tr>
    <tr><td>0-1 BFS</td><td>weights ∈ {0,1}</td><td>O(V + E)</td></tr>
    <tr><td>Dijkstra</td><td>all weights ≥ 0</td><td>O((V+E) log V)</td></tr>
    <tr><td>Bellman-Ford</td><td>negative weights</td><td>O(V·E)</td></tr>
    <tr><td>Floyd-Warshall</td><td>all pairs, small V</td><td>O(V³)</td></tr>
    <tr><td>A*</td><td>admissible heuristic available</td><td>heuristic-dependent</td></tr>
  </tbody>
</table>

<div class="callout"><strong>Common pitfall —</strong> forgetting the stale-entry check in Dijkstra. Without it the heap grows to O(E) entries and the constant factor explodes.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Dijkstra is greedy; Bellman-Ford is dynamic programming.</li>
  <li>Negative cycles are a modelling smell — usually a hint you want min-cost flow.</li>
  <li>For all pairs on a sparse graph, run Dijkstra from every source.</li>
</ol>`,
    quizzes: [
      {
        q: "Why does Dijkstra fail on graphs with negative edge weights?",
        options: [
          "It cannot handle negative numbers in the heap",
          "A popped node's distance may not be final, so greedy finalisation is wrong",
          "It always produces a cycle",
          "It only works on directed graphs",
        ],
        answer: 1,
        explain:
          "Dijkstra settles a node the first time it is extracted. A negative edge discovered later could still shorten that path, invalidating the settled distance.",
      },
    ],
  },
  "ds-3-l3": {
    html: `<p class="lead">Union-Find (disjoint set union) answers "are these two things connected?" in near-constant amortised time, which makes Kruskal's MST and dynamic connectivity trivial.</p>

<h2 id="dsu">Implementation with the two optimisations</h2>
<pre><code>class DSU {
  constructor(n) { this.p = Array.from({length: n}, (_, i) =&gt; i); this.r = Array(n).fill(0); }
  find(x) { while (this.p[x] !== x) { this.p[x] = this.p[this.p[x]]; x = this.p[x]; } return x; }
  union(a, b) {
    a = this.find(a); b = this.find(b);
    if (a === b) return false;                 // already connected — would create a cycle
    if (this.r[a] &lt; this.r[b]) [a, b] = [b, a];
    this.p[b] = a;
    if (this.r[a] === this.r[b]) this.r[a]++;
    return true;
  }
}</code></pre>
<p>Path compression plus union by rank gives an inverse-Ackermann bound — effectively O(1) for any realistic n.</p>

<h2 id="mst">Minimum spanning trees</h2>
<ul>
  <li><strong>Kruskal</strong> — sort edges by weight, add each that does not close a cycle (DSU check). O(E log E). Great for sparse graphs.</li>
  <li><strong>Prim</strong> — grow one tree outward using a priority queue of frontier edges. O(E log V). Great for dense graphs with an adjacency matrix.</li>
</ul>
<p>Both are greedy and both are provably optimal via the cut property: the lightest edge crossing any cut is in some MST.</p>

<h2 id="uses">Other uses</h2>
<ul>
  <li>Number of connected components after each edge addition.</li>
  <li>Accounts merge / redundant connection.</li>
  <li>Offline LCA (Tarjan) and offline dynamic connectivity.</li>
</ul>

<div class="callout"><strong>Common pitfall —</strong> forgetting that <code>union</code> must compare <em>roots</em>, not raw ids. Comparing raw ids silently creates multiple roots and breaks component counting.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>DSU is the cheapest cycle detector for undirected graphs.</li>
  <li>Never skip path compression — it is one line and turns O(n) into O(α(n)).</li>
  <li>Kruskal sorts edges, Prim grows a frontier; both rely on the cut property.</li>
</ol>`,
  },
  "ds-4-l0": {
    html: `<p class="lead">Two pointers and sliding windows convert "brute force every subarray" O(n²) solutions into single-pass O(n) ones. The precondition is monotonicity: moving one pointer must never make the answer worse.</p>

<h2 id="twopointer">The three two-pointer shapes</h2>
<ol>
  <li><strong>Opposite ends</strong> — sorted array, find a pair summing to a target. Shrink the end whose value is too big/small.</li>
  <li><strong>Fast/slow</strong> — cycle detection, middle of a list, removing duplicates in place.</li>
  <li><strong>Two sequences</strong> — merge two sorted arrays, interval intersection.</li>
</ol>
<pre><code>// pair with target sum in a sorted array
let lo = 0, hi = a.length - 1;
while (lo &lt; hi) {
  const s = a[lo] + a[hi];
  if (s === target) return [lo, hi];
  s &lt; target ? lo++ : hi--;
}</code></pre>

<h2 id="window">Sliding window template</h2>
<pre><code>let left = 0;
for (let right = 0; right &lt; n; right++) {
  add(a[right]);                       // grow
  while (!valid()) shrink(a[left++]);  // shrink until valid
  best = Math.max(best, right - left + 1);
}</code></pre>
<p>The amortised argument: <code>left</code> only ever moves forward, so the whole loop is O(n) even though it is nested.</p>

<h2 id="recognise">How to recognise it</h2>
<ul>
  <li>"Longest / shortest / count of subarrays satisfying X" on a contiguous range.</li>
  <li>The constraint is monotone: extending the window can only hurt (or help) one way.</li>
  <li>The input is sorted, or can be treated as a stream.</li>
</ul>

<div class="callout"><strong>Common pitfall —</strong> recomputing the window's state from scratch each step (e.g. re-summing). Maintain a running aggregate and update it in O(1) on add/remove.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Both pointers move monotonically — that is where the O(n) comes from.</li>
  <li>State what "valid" means before writing the loop.</li>
  <li>Windows answer range questions; hash maps inside the window handle "at most k distinct".</li>
</ol>`,
  },
  "ds-4-l1": {
    html: `<p class="lead">"Binary search on the answer" solves optimisation problems whose feasibility is monotone: if a capacity X works, every capacity above X works too. You binary search X instead of searching the array.</p>

<h2 id="boundary">The boundary template</h2>
<pre><code>// smallest x in [lo, hi] such that feasible(x) is true
let lo = minPossible, hi = maxPossible;
while (lo &lt; hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (feasible(mid)) hi = mid; else lo = mid + 1;
}
return lo;   // first feasible value</code></pre>

<h2 id="problems">Problems that are secretly this</h2>
<ul>
  <li><strong>Koko eating bananas</strong> — feasible(speed) = total hours ≤ h.</li>
  <li><strong>Split array largest sum</strong> — feasible(cap) = number of pieces needed ≤ m.</li>
  <li><strong>Ship packages in D days</strong> — feasible(weight) = days needed ≤ D.</li>
  <li><strong>Kth smallest in a multiplication table</strong> — feasible(x) = count(≤ x) ≥ k.</li>
</ul>

<h2 id="onarray">Classic on-array variants</h2>
<p>Rotated sorted arrays, peak elements and "first bad version" all reduce to a predicate that flips once. Write the predicate first; the loop body follows mechanically.</p>
<pre><code>// find index of first element &gt;= target (lower bound)
let lo = 0, hi = n;
while (lo &lt; hi) { const mid = (lo + hi) &gt;&gt; 1; a[mid] &gt;= target ? hi = mid : lo = mid + 1; }</code></pre>

<div class="callout"><strong>Common pitfall —</strong> infinite loops from <code>mid = (lo + hi) / 2</code> with <code>hi = mid</code>. Use floor for "move hi down" and <code>(lo + hi + 1) / 2</code> when you move lo up.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Binary search needs monotonicity, not sortedness.</li>
  <li>State the search space explicitly — indices, or values of the answer.</li>
  <li>Use a half-open range and one consistent mid rule to avoid off-by-ones.</li>
</ol>`,
  },
  "ds-4-l2": {
    html: `<p class="lead">Backtracking is DFS over a decision tree: choose, explore, un-choose. The recursion tree is also the cost model — pruned branches are the only reason these algorithms finish.</p>

<h2 id="template">The template</h2>
<pre><code>function backtrack(path, choices) {
  if (isGoal(path)) { record(path); return; }
  for (const c of choices) {
    if (!isValid(path, c)) continue;   // prune
    path.push(c);                      // choose
    backtrack(path, nextChoices(c));   // explore
    path.pop();                        // un-choose
  }
}</code></pre>

<h2 id="costs">Cost of each family</h2>
<table>
  <thead><tr><th>Problem</th><th>Tree size</th><th>Notes</th></tr></thead>
  <tbody>
    <tr><td>Subsets</td><td>2ⁿ</td><td>Include/exclude per element</td></tr>
    <tr><td>Permutations</td><td>n!</td><td>Used[] marks taken elements</td></tr>
    <tr><td>Combinations</td><td>C(n, k)</td><td>Start index prevents duplicates</td></tr>
    <tr><td>N-Queens</td><td>≈ n! pruned hard</td><td>Track columns and both diagonals</td></tr>
    <tr><td>Sudoku</td><td>huge, pruned by constraints</td><td>Choose the most constrained cell first</td></tr>
  </tbody>
</table>

<h2 id="pruning">Pruning strategies that matter</h2>
<ul>
  <li><strong>Sort then break</strong> — with sorted candidates, stop the loop when the remaining sum goes negative.</li>
  <li><strong>Skip duplicates</strong> — <code>if (i &gt; start &amp;&amp; a[i] === a[i-1]) continue;</code>.</li>
  <li><strong>Feasibility bound</strong> — remaining sum / remaining slots cannot reach the target.</li>
  <li><strong>MRV heuristic</strong> — pick the variable with the fewest remaining values.</li>
</ul>

<div class="callout"><strong>Common pitfall —</strong> pushing a reference to <code>path</code> into the result set. Copy it (<code>[...path]</code>) or every answer ends up as the same mutated array.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Choose → explore → un-choose; the un-choose is what makes the state reusable.</li>
  <li>Deduplicate at the loop level, not by hashing results.</li>
  <li>Always state the recursion tree size out loud before coding.</li>
</ol>`,
  },
  "ds-4-l3": {
    html: `<p class="lead">Dynamic programming is memoised recursion with a defined order. Every DP answer has four parts: <strong>state</strong>, <strong>transition</strong>, <strong>base case</strong>, <strong>iteration order</strong>. Miss one and the table is garbage.</p>

<h2 id="blueprint">The blueprint</h2>
<ol>
  <li><strong>State.</strong> The minimal set of numbers that uniquely identifies a subproblem. (<code>dp[i]</code>, <code>dp[i][w]</code>, <code>dp[i][j][k]</code>.)</li>
  <li><strong>Transition.</strong> How a state is built from smaller states — the recurrence.</li>
  <li><strong>Base case.</strong> States with no smaller dependencies.</li>
  <li><strong>Order.</strong> An order in which every dependency is computed first (or memoise recursively and stop worrying).</li>
</ol>

<h2 id="worked">Worked: 0/1 knapsack</h2>
<pre><code>// dp[w] = best value with capacity w, items processed one at a time
const dp = Array(W + 1).fill(0);
for (const [wt, val] of items)
  for (let w = W; w &gt;= wt; w--)        // backwards = each item used once
    dp[w] = Math.max(dp[w], dp[w - wt] + val);
return dp[W];</code></pre>
<p>Reverse the inner loop and each item becomes unlimited (unbounded knapsack). That single index direction encodes the entire problem variant.</p>

<h2 id="families">The five families</h2>
<table>
  <thead><tr><th>Family</th><th>Typical state</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>Linear</td><td>dp[i]</td><td>House robber, LIS</td></tr>
    <tr><td>2D grid</td><td>dp[i][j]</td><td>Unique paths, min path sum</td></tr>
    <tr><td>Knapsack</td><td>dp[i][capacity]</td><td>Partition, coin change</td></tr>
    <tr><td>Strings</td><td>dp[i][j] on prefixes</td><td>Edit distance, LCS</td></tr>
    <tr><td>Interval</td><td>dp[l][r]</td><td>Burst balloons, matrix chain</td></tr>
  </tbody>
</table>

<div class="callout"><strong>Interview favourite —</strong> "Can you do it with O(1) space?" If <code>dp[i]</code> depends only on <code>dp[i-1]</code>, keep two variables. Knapsack collapses a whole dimension with a backwards loop.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Write the recurrence in plain English before touching code.</li>
  <li>Memoisation is top-down DP; tabulation is bottom-up — same complexity.</li>
  <li>Loop direction is semantics: backwards means 0/1, forwards means unbounded.</li>
</ol>`,
    quizzes: [
      {
        q: "In the 1D knapsack, why must the capacity loop run backwards?",
        options: [
          "For performance only",
          "So each item is used at most once — dp[w - wt] still refers to the previous item's row",
          "To avoid negative indices",
          "It does not matter; both directions work",
        ],
        answer: 1,
        explain:
          "Iterating downwards reads values that have not been overwritten this iteration, i.e. the state from before this item was considered. Forwards iteration allows reusing the same item multiple times.",
      },
    ],
    practice: [
      {
        prompt: "Given coins [1,2,5] and amount 11, return the fewest coins that make the amount (or -1).",
        hint: "dp[a] = 1 + min(dp[a - c]) over all coins c.",
        solution:
          "dp = Array(amount+1).fill(Infinity); dp[0] = 0; for (const c of coins) for (let a = c; a <= amount; a++) dp[a] = Math.min(dp[a], dp[a-c] + 1); return dp[amount] === Infinity ? -1 : dp[amount];",
      },
    ],
  },
  "ds-4-l4": {
    html: `<p class="lead">Greedy algorithms are faster and simpler than DP — when they are correct. The skill is proving (or refuting) correctness in thirty seconds using an exchange argument.</p>

<h2 id="exchange">The exchange argument</h2>
<p>Show that any optimal solution can be transformed into one that makes the greedy first choice without getting worse. Then induction handles the rest. If you cannot sketch that swap, assume greedy is wrong.</p>

<h2 id="works">Where greedy works</h2>
<table>
  <thead><tr><th>Problem</th><th>Greedy choice</th><th>Why it holds</th></tr></thead>
  <tbody>
    <tr><td>Activity selection</td><td>Earliest finishing time</td><td>Leaves the most room afterwards</td></tr>
    <tr><td>Huffman coding</td><td>Merge two rarest symbols</td><td>Cut property on frequencies</td></tr>
    <tr><td>Jump game</td><td>Track furthest reachable index</td><td>Reachability is monotone</td></tr>
    <tr><td>Interval covering</td><td>Take the interval reaching furthest right</td><td>Same reachability argument</td></tr>
    <tr><td>MST</td><td>Lightest edge across a cut</td><td>Cut property (provably optimal)</td></tr>
  </tbody>
</table>

<h2 id="fails">Where greedy fails</h2>
<p>Coin change with coins {1, 3, 4} and amount 6: greedy takes 4+1+1 (three coins), optimal is 3+3 (two). Local optimality destroyed the global answer — this is a knapsack problem, so use DP.</p>

<h2 id="decision">A decision procedure</h2>
<ol>
  <li>Sort by something. Can you prove the exchange argument? → greedy.</li>
  <li>Do choices interact (capacity, order, negative values)? → DP.</li>
  <li>n ≤ 20? → backtracking; n ≤ 300 with 2D state? → DP; n ≥ 10⁵ and monotone? → greedy or two pointers.</li>
</ol>

<div class="callout"><strong>Interview favourite —</strong> if you propose greedy and the interviewer says "does that always work?", they are inviting the counterexample. Offer one yourself before they find it — it signals exactly the judgement they are testing.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Greedy correctness needs a proof, not intuition.</li>
  <li>Sorting is usually the hidden preprocessing step.</li>
  <li>Constraints hint at the intended complexity class — read them first.</li>
</ol>`,
  },
};
