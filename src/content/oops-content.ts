/**
 * Authored lesson material for the Object Oriented Design course, keyed by
 * lesson id. Same shape as `dsa-content.ts`; no lesson here falls back to the
 * placeholder generator.
 */
import type { AuthoredLesson } from "./dsa-content";

export const oopsContent: Record<string, AuthoredLesson> = {
  "oo-1-l0": {
    html: `<p class="lead">Abstraction decides <em>what</em> a type means to the outside world; encapsulation enforces that decision by hiding how it works. They are a pair: one is a contract, the other is the wall around the implementation.</p>

<h2 id="abstraction">Abstraction: design to an interface</h2>
<p>A good abstraction exposes a small vocabulary of operations and hides every decision that could change. <code>account.withdraw(50)</code> is a good abstraction. <code>account.balance = account.balance - 50</code> is not, because it publishes the invariant ("balance never goes negative") to every caller.</p>

<h2 id="encapsulation">Encapsulation: guard the invariants</h2>
<p>Private fields are not about secrecy, they are about <em>invariant maintenance</em>. If only the class can mutate state, only the class can be blamed when the invariant breaks.</p>
<pre><code>class Account {
  #balance = 0;
  constructor(private readonly id: string, starting: number) {
    if (starting &lt; 0) throw new Error("cannot open a negative account");
    this.#balance = starting;
  }
  withdraw(amount: number): boolean {
    if (amount &lt;= 0) return false;        // validation in ONE place
    if (amount &gt; this.#balance) return false;
    this.#balance -= amount;              // invariant preserved
    return true;
  }
  get balance() { return this.#balance; }  // read-only view
}</code></pre>

<h2 id="smells">Leaks that break both</h2>
<ul>
  <li><strong>Getters/setters on everything</strong> — a class with a getter and setter per field is a struct with extra steps; behaviour belongs with the data.</li>
  <li><strong>Returning mutable internals</strong> — hand out a copy or an unmodifiable view.</li>
  <li><strong>Feature envy</strong> — a method that reads another object's state more than its own belongs over there.</li>
</ul>

<div class="callout"><strong>Interview favourite —</strong> "Why not make everything public?" Because every public field is a promise you can never break. Narrow surfaces are what let you refactor the internals later.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Abstraction is the contract; encapsulation is the enforcement mechanism.</li>
  <li>Tell, don't ask — move behaviour to the object that owns the state.</li>
  <li>Every public member is permanent API surface; be stingy.</li>
</ol>`,
  },
  "oo-1-l1": {
    html: `<p class="lead">Inheritance is the strongest coupling relationship in OOP: the subclass is compiled against the parent's protected internals. Composition delegates — it keeps the seam.</p>

<h2 id="inheritance">When inheritance is right</h2>
<ul>
  <li>A genuine <strong>is-a</strong> relationship that survives every method (a <code>SavingsAccount</code> <em>is a</em> <code>Account</code>).</li>
  <li>You control the base class and it was designed for extension.</li>
  <li>You need polymorphic substitution in a framework's hook methods.</li>
</ul>

<h2 id="fragile">Why deep hierarchies rot</h2>
<pre><code>class ArrayList extends AbstractList { /* ... */ }
// requirement change: "we also need an immutable, audited list"
// inheritance answer:  AuditedImmutableArrayList  ->  2x2 = 4 classes next time
// composition answer:  new ArrayList(new AuditLog(), Unmodifiable.of(...))</code></pre>
<p>Two orthogonal dimensions multiply into a combinatorial explosion of subclasses. Composition keeps each dimension as an injected dependency.</p>

<h2 id="compose">Composition + delegation</h2>
<pre><code>class ReportService {
  constructor(private readonly repo: Repo, private readonly renderer: Renderer) {}
  async build(id: string) { return this.renderer.render(await this.repo.load(id)); }
}</code></pre>
<p>Swap <code>renderer</code> for a PDF or HTML implementation without touching the service. Testing is trivial with a stub. That is the whole argument.</p>

<table>
  <thead><tr><th></th><th>Inheritance</th><th>Composition</th></tr></thead>
  <tbody>
    <tr><td>Coupling</td><td>compile-time, tight</td><td>runtime, loose</td></tr>
    <tr><td>Reuse</td><td>by specialisation</td><td>by delegation</td></tr>
    <tr><td>Testability</td><td>needs the real base</td><td>inject a fake</td></tr>
    <tr><td>Flexibility</td><td>static hierarchy</td><td>changeable at runtime</td></tr>
  </tbody>
</table>

<div class="callout"><strong>Rule of thumb —</strong> "prefer composition, inherit for polymorphism only." Inherit when you intend to be substituted; compose when you intend to use.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Inheritance breaks encapsulation: subclasses depend on parent internals.</li>
  <li>Orthogonal variations should be dependencies, not subclasses.</li>
  <li>Keep hierarchies shallow — one level of intended substitution.</li>
</ol>`,
  },
  "oo-1-l2": {
    html: `<p class="lead">Polymorphism lets one call site mean different things at runtime. It is the mechanism behind every framework callback, plugin system and strategy switch you have ever used.</p>

<h2 id="kinds">Three kinds</h2>
<table>
  <thead><tr><th>Kind</th><th>Resolved</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>Ad-hoc (overloading)</td><td>compile time</td><td><code>add(int, int)</code> vs <code>add(double, double)</code></td></tr>
    <tr><td>Parametric (generics)</td><td>compile time</td><td><code>List&lt;T&gt;</code>, <code>Map&lt;K,V&gt;</code></td></tr>
    <tr><td>Subtype (dynamic dispatch)</td><td>runtime</td><td><code>shape.area()</code></td></tr>
  </tbody>
</table>

<h2 id="vtable">How dynamic dispatch actually works</h2>
<p>Each class gets a vtable: an array of function pointers indexed per virtual method. Each object carries a pointer to its class's vtable. <code>shape.area()</code> becomes "load vtable, load slot 3, call". That is one extra indirection — the reason C++ has <code>final</code> and why JITs inline hot virtual calls.</p>

<h2 id="duck">Duck typing vs interfaces</h2>
<p>Python/JS dispatch by name at runtime — anything with a <code>.area()</code> works, no declaration needed. Fast to write, but a typo surfaces only when that line executes. Interfaces move the check to compile time and document the contract explicitly.</p>
<pre><code>// substitution in action — no switch anywhere
for (const shape of shapes) total += shape.area();</code></pre>

<div class="callout"><strong>Common pitfall —</strong> using polymorphism as a substitute for data. If your subclass only differs by a constant, you want a constructor argument, not three classes.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Overloading and generics are compile-time; subtype polymorphism is runtime.</li>
  <li>A vtable is the cost of dynamic dispatch: one indirection per call.</li>
  <li>Replace <code>switch (type)</code> chains with polymorphism only when the set of types is open.</li>
</ol>`,
  },
  "oo-1-l3": {
    html: `<p class="lead">In an LLD interview the diagram <em>is</em> the answer: it communicates your model in ten seconds and lets the interviewer poke at specific decisions. You need three notations, nothing more.</p>

<h2 id="class">Class diagram relationships</h2>
<table>
  <thead><tr><th>Relationship</th><th>UML</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td>Association</td><td>solid line</td><td>"uses / knows about"</td></tr>
    <tr><td>Aggregation</td><td>hollow diamond</td><td>"has-a", parts survive (Department ◇ Professor)</td></tr>
    <tr><td>Composition</td><td>filled diamond</td><td>"owns", parts die with the whole (House ◆ Room)</td></tr>
    <tr><td>Dependency</td><td>dashed arrow</td><td>parameter or local use only</td></tr>
    <tr><td>Inheritance</td><td>hollow triangle</td><td>is-a</td></tr>
    <tr><td>Realisation</td><td>dashed triangle</td><td>implements interface</td></tr>
  </tbody>
</table>
<pre><code>+-----------+        1      * +----------+
|  Parking  ◆--------------|  Floor   |
+-----------+              +----------+
       | 1                        | *
       |                          |
       | *                        |
  +----------+  implements  +-----------+
  |  Ticket  |--------------| Pricable  |
  +----------+              +-----------+</code></pre>

<h2 id="sequence">Sequence diagrams</h2>
<p>Lifelines down the page, time flowing downward, arrows for calls, dashed arrows for returns. Draw one for the <em>happy path</em> and one for the most interesting failure — the failure one is what interviewers remember.</p>
<pre><code>Client -> Service: book(slotId)
Service -> Repo: lockSlot(slotId)
Repo --> Service: Slot
Service -> Pricer: quote(slot, hours)
Pricer --> Service: Money
Service --> Client: Ticket</code></pre>

<h2 id="practical">Practical tips</h2>
<ul>
  <li>Boxes first, relationships second, attributes last.</li>
  <li>Name interfaces after capabilities (<code>Refundable</code>, <code>Exportable</code>), not implementations.</li>
  <li>Say multiplicities out loud — 1-to-many vs many-to-many changes the storage design.</li>
  <li>Annotate the extension point: "add a <code>MotorcycleSpot</code> by implementing <code>Spot</code>".</li>
</ul>

<div class="callout"><strong>Common pitfall —</strong> drawing twenty classes in the first five minutes. Three well-named classes with clear responsibilities beat a wall of nouns every time.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Aggregation vs composition is about lifecycle ownership.</li>
  <li>Draw the happy path plus one failure path in sequence form.</li>
  <li>Always state the extension point — that is the LLD payoff.</li>
</ol>`,
  },
  "oo-2-l0": {
    html: `<p class="lead">SRP and OCP are about one thing: <strong>reasons to change</strong>. SRP says a type should have exactly one; OCP says adding a new behaviour should not require editing existing, working code.</p>

<h2 id="srp">Single Responsibility Principle</h2>
<p>Not "do one thing" but "have one reason to change, i.e. one stakeholder". A <code>Report</code> class that computes content, formats HTML and emails it has three reasons to change: the business rules, the presentation, and the delivery channel.</p>
<pre><code>// before: three responsibilities in one class
class Report {
  calculate() { /* business rules */ }
  toHtml()    { /* presentation */ }
  send()      { /* smtp details  */ }
}

// after: each collaborator changes for one reason
const report = new Report(new PayrollCalculator(), new HtmlFormatter(), new SmtpMailer());</code></pre>

<h2 id="ocp">Open/Closed Principle</h2>
<p>Open for extension, closed for modification. The classic violation is a <code>switch</code> on a type enum that grows every quarter — every new shape means editing (and re-testing) a stable function.</p>
<pre><code>// closed for modification: new discount types plug in
interface Discount { apply(total: number): number; }
class Checkout {
  constructor(private readonly discounts: Discount[]) {}
  total(): number {
    return this.discounts.reduce((t, d) =&gt; d.apply(t), this.subtotal());
  }
}</code></pre>

<h2 id="smells">Smells that betray violations</h2>
<ul>
  <li>Methods named <code>doXAndThenY</code>.</li>
  <li>Imports of presentation or transport concerns inside domain logic.</li>
  <li>Long <code>if/else</code> chains on a type code, duplicated in three files.</li>
  <li>A test file with 400 lines of setup for one class.</li>
</ul>

<div class="callout"><strong>Interview favourite —</strong> "How do you add a new payment provider?" The OCP answer names the interface, the registry/factory, and the fact that no existing file changes.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Count reasons to change, not lines of code.</li>
  <li>OCP is achieved with abstraction + polymorphism, not with clever configuration.</li>
  <li>Splitting a class is cheap; splitting a released API is not.</li>
</ol>`,
  },
  "oo-2-l1": {
    html: `<p class="lead">LSP, ISP and DIP are the three principles people quote and rarely apply. Together they describe substitutable, narrow, inverted dependencies — the ingredients of testable code.</p>

<h2 id="lsp">Liskov Substitution</h2>
<p>A subtype must be usable anywhere the base type is expected, without the caller knowing. The famous counterexample: <code>Square extends Rectangle</code>. <code>setWidth(4); setHeight(5); assert area() === 25</code> fails for a square.</p>
<pre><code>// LSP violation — the caller must know the concrete type
class Penguin extends Bird { fly() { throw new Error("penguins cannot fly"); } }

// fix: narrow the hierarchy
interface Bird { eat(): void }
interface FlyingBird extends Bird { fly(): void }</code></pre>
<p>Rules of thumb: never strengthen preconditions, never weaken postconditions, never throw from a method the parent declared safe, honour the history constraint (immutability stays immutable).</p>

<h2 id="isp">Interface Segregation</h2>
<p>Clients should not depend on methods they do not use. A fat <code>Repository&lt;T&gt;</code> with <code>find</code>, <code>save</code>, <code>streamAll</code>, <code>purge</code> forces every implementation to stub the rest. Split by client need.</p>

<h2 id="dip">Dependency Inversion</h2>
<p>High-level policy should not depend on low-level detail; both should depend on an abstraction owned by the <em>high-level</em> side.</p>
<pre><code>// detail depends on abstraction — the arrow points inward
interface Mailer { send(to: string, body: string): Promise&lt;void&gt; }
class OrderService { constructor(private mailer: Mailer) {} }
class SmtpMailer implements Mailer { /* the detail */ }</code></pre>

<div class="callout"><strong>Interview favourite —</strong> "Why is DIP not just dependency injection?" DIP is the design rule about who owns the abstraction; DI is the mechanism that supplies the implementation.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>LSP is a contract on behaviour, not signatures.</li>
  <li>Interfaces with 8+ methods are a smell; split by consumer.</li>
  <li>The abstraction belongs to the caller, which is why domain layers define ports.</li>
</ol>`,
  },
  "oo-2-l2": {
    html: `<p class="lead">Refactoring is changing structure without changing behaviour, verified by tests. It is a discipline of small steps, each leaving the code green.</p>

<h2 id="smells">Smells and their fixes</h2>
<table>
  <thead><tr><th>Smell</th><th>Symptom</th><th>Refactoring</th></tr></thead>
  <tbody>
    <tr><td>God class</td><td>300+ lines, 12 fields, does everything</td><td>Extract Class by cohesive field groups</td></tr>
    <tr><td>Long method</td><td>80 lines, 6 nesting levels</td><td>Extract Function, replace nested ifs with guards</td></tr>
    <tr><td>Duplicated code</td><td>same 15 lines in 4 places</td><td>Extract then parameterise</td></tr>
    <tr><td>Primitive obsession</td><td>raw strings for currency, email, ids</td><td>Introduce Value Object</td></tr>
    <tr><td>Feature envy</td><td>method reads another object constantly</td><td>Move Method</td></tr>
    <tr><td>Shotgun surgery</td><td>one concept change = 9 file edits</td><td>Inline then re-extract around the real seam</td></tr>
    <tr><td>Commented-out code</td><td>graveyard block</td><td>Delete; git remembers</td></tr>
  </tbody>
</table>

<h2 id="worked">Worked: un-nesting with guard clauses</h2>
<pre><code>// before
function pay(e) {
  if (e != null) {
    if (e.isActive) {
      if (!e.paid) { /* 40 lines */ }
    }
  }
}

// after — happy path at indentation zero
function pay(e) {
  if (!e) return;
  if (!e.isActive) return;
  if (e.paid) return;
  /* 40 lines, un-nested */
}</code></pre>

<h2 id="safety">Doing it safely</h2>
<ol>
  <li>Pin the behaviour with characterisation tests before touching anything.</li>
  <li>One refactoring per commit; run the suite between steps.</li>
  <li>Use the IDE's automated moves for renames and method extraction.</li>
  <li>Stop when the design is good enough — there is no trophy for zero duplication.</li>
</ol>

<div class="callout"><strong>Common pitfall —</strong> refactoring and adding a feature in the same change. When it breaks you cannot tell which half did it.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Smells are heuristics pointing at a coupling problem, not crimes.</li>
  <li>Guard clauses flatten logic and expose the happy path.</li>
  <li>Value objects kill primitive obsession and centralise validation.</li>
</ol>`,
  },
  "oo-3-l0": {
    html: `<p class="lead">Creational patterns isolate <em>how objects come into existence</em>. Use them when construction has rules — many variants, expensive setup, or a strict "only one" constraint.</p>

<h2 id="factory">Factory Method &amp; Abstract Factory</h2>
<pre><code>interface Transport { deliver(cargo: string): string }
class Truck implements Transport { deliver(c) { return "road: " + c; } }
class Ship  implements Transport { deliver(c) { return "sea: " + c;  } }

function createTransport(kind: "road" | "sea"): Transport {
  return kind === "sea" ? new Ship() : new Truck();   // the only place with "new"
}</code></pre>
<p>Abstract Factory goes one step further: a factory per <em>family</em> (e.g. <code>DarkWidgetFactory</code> producing button + menu that belong together).</p>

<h2 id="builder">Builder</h2>
<p>For constructors with too many optional parameters — the telescoping-constructor smell.</p>
<pre><code>const req = new HttpRequestBuilder("https://api.dev")
  .header("Authorization", token)
  .timeout(2_000)
  .retries(3)
  .build();</code></pre>
<p>Builders also enforce ordering rules (you cannot <code>build()</code> before <code>url()</code>) and produce immutable results.</p>

<h2 id="singleton">Singleton — and why to be careful</h2>
<pre><code>class Config {
  static #instance: Config;
  private constructor() {}
  static get instance() { return (this.#instance ??= new Config()); }
}</code></pre>
<p>Problems: hidden global state, hard to fake in tests, and a concurrency hazard during lazy initialisation (guard with a lock or eager-initialise). In DI codebases, register a single instance in the container instead — same guarantee, none of the coupling.</p>

<h2 id="prototype">Prototype</h2>
<p>Clone an expensive object and tweak it. Deep-clone carefully: nested mutable references are where the bugs live.</p>

<div class="callout"><strong>Interview favourite —</strong> "When would you not use Singleton?" Whenever two instances could ever plausibly exist (two tenants, two databases) and whenever you need to assert against it in a test.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Factories centralise <code>new</code> so variants are a one-line change.</li>
  <li>Builders tame parameter explosions and enforce construction rules.</li>
  <li>Prefer container-managed singletons over the Singleton pattern.</li>
</ol>`,
  },
  "oo-3-l1": {
    html: `<p class="lead">Structural patterns compose objects into larger structures. They all answer the same question: how do I add capability or adapt shape without editing what already works?</p>

<h2 id="adapter">Adapter</h2>
<p>Converts one interface into another — the fix for "this library is perfect but its API is wrong".</p>
<pre><code>interface PaymentGateway { charge(cents: number): Promise&lt;void&gt; }
class StripeAdapter implements PaymentGateway {
  constructor(private stripe: StripeClient) {}
  charge(cents) { return this.stripe.paymentIntents.create({ amount: cents, currency: "usd" }); }
}</code></pre>

<h2 id="decorator">Decorator</h2>
<p>Same interface, added behaviour, stackable at runtime. This is how logging, retries, metrics and caching wrap a service without touching it.</p>
<pre><code>class RetryingPayment implements PaymentGateway {
  constructor(private inner: PaymentGateway, private tries = 3) {}
  async charge(cents) {
    for (let i = 1; ; i++) {
      try { return await this.inner.charge(cents); }
      catch (e) { if (i === this.tries) throw e; await sleep(2 ** i * 50); }
    }
  }
}
const gateway = new MetricsPayment(new RetryingPayment(new StripeAdapter(client)));</code></pre>

<h2 id="facade">Facade</h2>
<p>One simple front door over a messy subsystem. A <code>CheckoutFacade</code> that calls inventory, pricing, payment and notifications in order hides the orchestration from callers — and gives you one place to add transactions.</p>

<h2 id="proxy">Proxy</h2>
<p>Same interface, controls <em>access</em>: lazy loading, permission checks, remote stubs, rate limiting. Decorator adds behaviour; Proxy controls access. The code looks identical — the intent differs.</p>

<h2 id="others">Also worth naming</h2>
<ul>
  <li><strong>Composite</strong> — tree of objects treated uniformly (DOM nodes, menu items).</li>
  <li><strong>Bridge</strong> — split an abstraction from its implementation so both vary (Shape ↔ Renderer).</li>
  <li><strong>Flyweight</strong> — share intrinsic state across many objects (glyphs, particles).</li>
</ul>

<div class="callout"><strong>Common pitfall —</strong> stacking five decorators before extracting an interface. If a wrapper has no distinct reason to exist, it is noise.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Adapter changes the interface; Decorator keeps it and adds behaviour.</li>
  <li>Decorator chains are the idiomatic way to add cross-cutting concerns.</li>
  <li>Facade is about simplifying an API; Proxy is about mediating access.</li>
</ol>`,
  },
  "oo-3-l2": {
    html: `<p class="lead">Behavioural patterns allocate responsibilities between objects. Four of them — Strategy, Observer, State, Command — cover most real-world needs.</p>

<h2 id="strategy">Strategy</h2>
<p>Swap an algorithm behind a stable interface. Removes <code>if (mode === "express")</code> from business code and makes each pricing rule independently testable.</p>
<pre><code>type Shipping = (weightKg: number) =&gt; number;
const standard: Shipping = w =&gt; 5 + w;
const express:  Shipping = w =&gt; 12 + 2 * w;
const free:     Shipping = () =&gt; 0;
const cost = (s: Shipping, w: number) =&gt; s(w);</code></pre>

<h2 id="observer">Observer</h2>
<p>One subject, many interested parties, no coupling between them. Event emitters, pub/sub, reactive streams and webhooks are all this pattern.</p>
<pre><code>class OrderEvents {
  #subs = new Set&lt;(o: Order) =&gt; void&gt;();
  subscribe(fn) { this.#subs.add(fn); return () =&gt; this.#subs.delete(fn); }
  emit(order) { for (const fn of this.#subs) fn(order); }
}</code></pre>
<p>Watch for: memory leaks from unsubscribed listeners, ordering guarantees, and error isolation so one failing handler cannot kill the emit loop.</p>

<h2 id="state">State</h2>
<p>Replace a status enum plus switch statements with one object per state, each knowing its allowed transitions.</p>
<pre><code>interface OrderState { next(o: Order): void; label: string }
const paid: OrderState = { label: "paid", next: o =&gt; o.transition(shipped) };
const shipped: OrderState = { label: "shipped", next: o =&gt; o.transition(delivered) };
// illegal transitions become impossible instead of "an if we forgot"</code></pre>

<h2 id="command">Command</h2>
<p>Wrap a request as an object so it can be queued, logged, undone or replayed. Every audit log and undo stack is a command history.</p>
<pre><code>interface Command { execute(): Promise&lt;void&gt;; undo?(): Promise&lt;void&gt; }
const commands: Command[] = [];
async function run(cmd: Command) { await cmd.execute(); commands.push(cmd); }</code></pre>

<div class="callout"><strong>Interview favourite —</strong> Strategy vs State: both delegate to a pluggable object, but Strategy's parts are independent while State's know about each other's transitions.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Strategy kills conditional algorithm selection.</li>
  <li>Observer decouples producers from consumers — and leaks if you forget to unsubscribe.</li>
  <li>State turns illegal transitions into type errors.</li>
  <li>Command gives you undo, queuing and audit for free.</li>
</ol>`,
  },
  "oo-3-l3": {
    html: `<p class="lead">Ten snippets, ten patterns. For each one, name the pattern, then name the <em>reason</em> it applies — matching a name to code is easy, justifying the choice is the interview skill.</p>

<h2 id="round1">Rounds 1–5</h2>
<ol>
  <li>A class whose constructor is <code>private</code> and exposes <code>static get()</code>. <em>Singleton.</em></li>
  <li>A <code>ReportBuilder</code> whose every method returns <code>this</code>. <em>Builder.</em></li>
  <li><code>JsonAdapter implements Logger</code> wrapping a third-party <code>SyslogClient</code>. <em>Adapter.</em></li>
  <li><code>class CachedRepo implements Repo</code> holding another <code>Repo</code> and memoising reads. <em>Decorator (or Proxy, if it is gating access).</em></li>
  <li><code>PricingRules.select(region)</code> returning one of several <code>Pricing</code> objects. <em>Factory Method / Strategy registry.</em></li>
</ol>

<h2 id="round2">Rounds 6–10</h2>
<ol>
  <li><code>button.onClick(() =&gt; save())</code> with many listeners. <em>Observer.</em></li>
  <li><code>OrderState.paid.next(order)</code> deciding the next state. <em>State.</em></li>
  <li>A <code>MoveCursorCommand</code> with <code>execute()</code> and <code>undo()</code> stored in a history array. <em>Command.</em></li>
  <li><code>new CssRenderer() / new SvgRenderer()</code> injected into <code>Shape</code>. <em>Bridge.</em></li>
  <li><code>File.open(path)</code> returning a lazily-loaded handle that reads on first access. <em>Virtual Proxy.</em></li>
</ol>

<div class="callout"><strong>Scoring yourself —</strong> if you can name the pattern but not the trade-off (what breaks, what it costs, when to skip it), you are memorising rather than designing. Every pattern buys something and charges something.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Patterns are vocabulary for design conversations, not goals.</li>
  <li>Always answer with pattern + trade-off + alternative considered.</li>
  <li>Refactoring <em>towards</em> a pattern when a need appears beats designing it in up front.</li>
</ol>`,
    quizzes: [
      {
        q: "A class wrapping another with the SAME interface purely to add retry logic is which pattern?",
        options: ["Adapter", "Decorator", "Facade", "Singleton"],
        answer: 1,
        explain:
          "Same interface + added behaviour = Decorator. An Adapter would change the interface; a Facade would simplify a subsystem behind a new one.",
      },
      {
        q: "You need to add a second database vendor without touching service code. Which two patterns combine best?",
        options: [
          "Singleton + Observer",
          "Abstract Factory + Dependency Inversion",
          "Flyweight + Command",
          "Proxy + Composite",
        ],
        answer: 1,
        explain:
          "The services depend on an abstraction (DIP); a per-vendor Abstract Factory produces the whole family of repository implementations.",
      },
    ],
  },
  "oo-4-l0": {
    html: `<p class="lead">A parking lot is the canonical LLD warm-up. It tests whether you can move from vague requirements to entities, then to an extensible pricing and spot-allocation design.</p>

<h2 id="req">Requirements (state them, then refine)</h2>
<ul>
  <li>Multiple floors, each with a fixed mix of spot types (motorcycle, compact, large).</li>
  <li>Vehicles enter, get a spot and a ticket; they exit and pay.</li>
  <li>Pricing depends on vehicle type and duration; rates change often.</li>
  <li>Support multiple gates and a display of free spots per type.</li>
</ul>

<h2 id="model">Core model</h2>
<pre><code>enum SpotType { MOTORCYCLE, COMPACT, LARGE }
interface Vehicle { plate: string; type: SpotType; fits(s: Spot): boolean }

class Spot {
  constructor(readonly id: string, readonly type: SpotType) {}
  isFree = true;
}

class Ticket {
  constructor(readonly spot: Spot, readonly entry: Date) {}
  readonly id = crypto.randomUUID();
  exit?: Date;
}

class Lot {
  #spots: Spot[] = [];
  #active = new Map&lt;string, Ticket&gt;();

  park(v: Vehicle): Ticket | null {
    const spot = this.#spots.find(s =&gt; s.isFree &amp;&amp; v.fits(s));
    if (!spot) return null;                        // explicit failure, not an exception
    spot.isFree = false;
    const t = new Ticket(spot, new Date());
    this.#active.set(v.plate, t);
    return t;
  }
  unpark(v: Vehicle, pricer: Pricer) {
    const t = this.#active.get(v.plate);
    if (!t) throw new Error("no active ticket");
    t.exit = new Date();
    return pricer.charge(t, v);                    // strategy injected
  }
}</code></pre>

<h2 id="extensible">Designing for change</h2>
<ul>
  <li><strong>Pricing</strong> → <code>Pricer</code> strategy: flat, hourly, per-minute, day-capped, weekend surcharge. Inject, never hard-code.</li>
  <li><strong>Allocation</strong> → <code>AllocationPolicy</code>: first-fit, best-fit (smallest spot that fits), nearest-to-lift.</li>
  <li><strong>Payment</strong> → <code>PaymentProcessor</code> abstraction so card/UPI/cash plug in.</li>
  <li><strong>Display</strong> → observer pattern; the board subscribes to occupancy changes.</li>
</ul>

<h2 id="concurrency">Concurrency</h2>
<p>Two gates can race for the last spot. Serialise allocation per lot with a lock (or a DB transaction with <code>SELECT … FOR UPDATE</code> on the candidate spot), and make the ticket idempotent on plate so a retry cannot create two tickets.</p>

<div class="callout"><strong>Interview favourite —</strong> "Where does this scale break?" A single in-memory lot. At multi-site scale the lot becomes a service, spots are rows, and allocation moves into a transactional query with a partial index on <code>is_free</code>.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Model the lifecycle (enter → allocate → ticket → exit → charge) before the classes.</li>
  <li>Strategy for pricing, policy object for allocation, observer for the display.</li>
  <li>Race conditions on shared counters are the follow-up question — be ready.</li>
</ol>`,
  },
  "oo-4-l1": {
    html: `<p class="lead">An elevator system pushes two things at once: a clean state machine and a scheduling policy that must be explainable in one sentence.</p>

<h2 id="states">The car state machine</h2>
<table>
  <thead><tr><th>State</th><th>Meaning</th><th>Leaves when</th></tr></thead>
  <tbody>
    <tr><td>IDLE</td><td>no pending requests</td><td>A call arrives</td></tr>
    <tr><td>MOVING_UP / MOVING_DOWN</td><td>travelling toward next stop</td><td>Reaches a requested floor or the end of the queue</td></tr>
    <tr><td>DOORS_OPEN</td><td>loading</td><td>Timeout or all passengers boarded</td></tr>
    <tr><td>MAINTENANCE</td><td>out of service</td><td>Manual reset</td></tr>
  </tbody>
</table>
<pre><code>class Elevator {
  state: "idle" | "up" | "down" = "idle";
  current = 1;
  #stops = new Set&lt;number&gt;();

  request(floor: number) {
    this.#stops.add(floor);
    if (this.state === "idle") this.state = floor &gt; this.current ? "up" : "down";
  }
  tick() {
    if (this.state === "idle" || !this.#stops.size) return (this.state = "idle");
    this.current += this.state === "up" ? 1 : -1;
    if (this.#stops.has(this.current)) {
      this.#stops.delete(this.current);
      this.openDoors();
      if (!this.#stops.size) this.state = "idle";
    }
  }
}</code></pre>

<h2 id="scheduling">Scheduling policies</h2>
<ul>
  <li><strong>FCFS</strong> — trivially fair, terrible ride times.</li>
  <li><strong>SCAN / LOOK</strong> — keep going in one direction serving stops, then reverse (like disk scheduling). LOOK reverses at the last request instead of the top floor.</li>
  <li><strong>Destination dispatch</strong> — passengers key in their floor at the lobby, the controller batches them into cars. The real-world optimiser for high-rises.</li>
</ul>

<h2 id="multi">Multi-car coordination</h2>
<p>A <code>Controller</code> assigns each call to a car using a cost function: estimated arrival time, direction match, current load. Keep the cost function a strategy object so you can swap policies without touching the cars.</p>

<h2 id="edge">Edge cases worth naming out loud</h2>
<ul>
  <li>Door obstruction and safety sensor overrides.</li>
  <li>Fire alarm → all cars return to the ground floor and open.</li>
  <li>Power failure → cars report position, queue is rebuilt or cleared.</li>
  <li>Overload → refuse to move, alarm, keep doors open.</li>
</ul>

<div class="callout"><strong>Interview favourite —</strong> "Why LOOK over FCFS?" Because SCAN/LOOK bound wait time by direction instead of arrival order, halving average travel in busy buildings.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Model each car as a state machine with explicit legal transitions.</li>
  <li>Isolate the scheduling policy behind an interface.</li>
  <li>Name the failure modes — safety behaviour is part of the design, not an afterthought.</li>
</ol>`,
  },
  "oo-4-l2": {
    html: `<p class="lead">Splitwise looks like a CRUD app and then reveals the two hard parts: representing arbitrary splits without losing money, and simplifying a mesh of balances into the fewest transfers.</p>

<h2 id="model">Entities</h2>
<ul>
  <li><strong>User</strong> — id, name, email.</li>
  <li><strong>Group</strong> — members, expenses; supports non-group expenses too.</li>
  <li><strong>Expense</strong> — payer, amount, currency, timestamp, and a <code>SplitStrategy</code> describing who owes what.</li>
  <li><strong>Balance</strong> — a directed edge: A owes B an amount.</li>
</ul>

<h2 id="split">Split strategies</h2>
<pre><code>interface SplitStrategy { compute(amount: number, participants: User[]): Map&lt;User, number&gt; }

class EqualSplit implements SplitStrategy {
  compute(amount, ps) {
    const base = Math.floor((amount / ps.length) * 100) / 100;
    const shares = new Map(ps.map(p =&gt; [p, base]));
    // give the remainder (from rounding) to the first participant — cents never vanish
    const leftover = amount - base * ps.length;
    if (leftover) shares.set(ps[0], base + leftover);
    return shares;
  }
}
// PercentSplit, ExactSplit, SharesSplit (weights) implement the same interface</code></pre>

<h2 id="balances">Keeping balances consistent</h2>
<p>On each expense: credit the payer, debit each participant. Store the net edge per pair so two mutual debts collapse into one number.</p>
<pre><code>balance(from, to) += share;   // from owes to
// simplify: for each pair, keep only the larger-signed direction
net[a][b] = net[a][b] - net[b][a];
if (net[a][b] &gt; 0) keep (a owes b, net[a][b]); else keep (b owes a, -net[a][b]);</code></pre>
<p>Minimum-transfers simplification is greedy on max-debtor/max-creditor pairs and terminates in at most n−1 settlements; the general minimum-flow version is NP-hard, so say "greedy is what production apps ship".</p>

<h2 id="cross">Multi-currency</h2>
<p>Store amounts in minor units (integer cents) plus a currency code; convert at the rate captured <em>at expense time</em>, never retroactively. This is also where you mention value objects and rounding policy.</p>

<h2 id="notifications">Notifications</h2>
<p>Observer: balance-change events fan out to push, email and digest workers. Persist a <code>notification</code> row so retries are idempotent, and debounce "you are owed ₹12" spam.</p>

<div class="callout"><strong>Interview favourite —</strong> "How do you avoid floating-point drift?" Integer minor units, a single rounding owner (the split strategy), and a documented remainder policy.</div>

<h2 id="takeaways">Key takeaways</h2>
<ol>
  <li>Splits are a strategy object; rounding lives in exactly one place.</li>
  <li>Store net pairwise balances so debts collapse to one edge per pair.</li>
  <li>Money is integer minor units + currency, never a float.</li>
  <li>Notifications are observers over balance-change events.</li>
</ol>`,
  },
};
