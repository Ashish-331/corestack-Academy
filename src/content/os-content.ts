export interface OSLesson {
  mod: string;
  title: string;
  level: string;
  time: string;
  industry: string;
  prev: string | null;
  next: string | null;
  content: string;
}

export const osLessons: Record<string, OSLesson> = {
  "m0l0": {
    mod: "MODULE 0 — Foundation",
    title: "What is an Operating System?",
    level: "Beginner",
    time: "25 min",
    industry: "Core Concept",
    prev: null,
    next: "m0l1",
    content: `
<h2>The Problem Without an OS</h2>
<p>Imagine you write a program. It needs to print text. Where do you <em>send</em> that text? The keyboard? The monitor? Which monitor — HDMI port 1 or 2? And what if another program also wants to print at the same time?</p>
<p>Without an OS, <strong>every single program</strong> would need to know the exact hardware details of every machine it runs on. Your program would need drivers for every possible printer, every GPU, every disk type. That's insane.</p>

<div class="callout analogy">
Think of an OS like a hotel manager. The hotel has rooms (RAM), kitchens (CPU), storage (disk), and staff (hardware). Guests (programs) don't directly manage rooms — they ask the manager. The manager allocates rooms, prevents two guests from booking the same room, and handles all the logistics. Guests just say "I need a room with a sea view" — they don't wire up the plumbing themselves.
</div>

<h2>Formal Definition</h2>
<p>An <strong>Operating System</strong> is system software that:</p>
<ul>
  <li><strong>Manages hardware resources</strong> (CPU, RAM, disk, I/O devices)</li>
  <li><strong>Provides an abstraction layer</strong> — programs talk to the OS, not the hardware directly</li>
  <li><strong>Enforces fairness and isolation</strong> — multiple programs share resources without crashing each other</li>
  <li><strong>Offers services</strong> via system calls (file read, network open, memory allocation)</li>
</ul>

<h2>The Two Modes: User Space vs Kernel Space</h2>
<p>This is the most important concept in OS — and most beginners skip it. Every modern CPU has (at least) two privilege modes:</p>

<div class="diagram">
  <div class="d-title">CPU Privilege Rings</div>
<span class="highlight">RING 0 — KERNEL MODE</span>
  └─ Can execute ANY instruction
  └─ Can access ALL memory addresses
  └─ Can talk directly to hardware
  └─ Lives here: Linux kernel, Windows NT kernel

<span class="highlight2">RING 3 — USER MODE</span>
  └─ Restricted instruction set
  └─ Can only access its own memory
  └─ Must ask kernel for hardware access
  └─ Lives here: your browser, your Python script, every app

<span class="highlight3">BOUNDARY: System Call Interface</span>
  └─ The only legal way to cross rings
  └─ read(), write(), fork(), open(), mmap()...
</div>

<p>When your Python script calls <code>open("file.txt")</code>, here's what actually happens:</p>
<ol>
  <li>Python calls the C library's <code>fopen()</code></li>
  <li>C library issues the <strong>syscall</strong> instruction (<code>syscall</code> on x86-64; the older <code>int 0x80</code> is the legacy 32-bit path)</li>
  <li>CPU <em>switches to kernel mode</em></li>
  <li>Kernel handles the file open, checks permissions</li>
  <li>CPU <em>returns to user mode</em> with a file descriptor (an integer)</li>
  <li>Your code now has <code>fd = 3</code> and has no idea how the disk works</li>
</ol>

<div class="callout industry-note">
In real industry work, you'll use <strong>strace</strong> on Linux to trace every system call a process makes. When a production server is behaving oddly, <code>strace -p &lt;pid&gt;</code> shows you exactly which syscalls it's making — and where it might be stuck. This is day-1 ops knowledge.
</div>

<h2>What Services Does an OS Provide?</h2>
<table>
  <tr><th>Service</th><th>What It Does</th><th>Example Syscall</th></tr>
  <tr><td>Process Management</td><td>Create, run, kill processes</td><td>fork(), exec(), kill()</td></tr>
  <tr><td>Memory Management</td><td>Allocate/free RAM, virtual memory</td><td>mmap(), brk(), munmap()</td></tr>
  <tr><td>File System</td><td>Files, directories, permissions</td><td>open(), read(), write()</td></tr>
  <tr><td>I/O Management</td><td>Keyboard, screen, disk, network</td><td>read(), write(), ioctl()</td></tr>
  <tr><td>Networking</td><td>Sockets, TCP/IP stack</td><td>socket(), connect(), send()</td></tr>
  <tr><td>Security</td><td>Users, permissions, isolation</td><td>chmod(), setuid()</td></tr>
</table>

<div class="callout deepdive">
<strong>Why can't user programs just bypass the OS?</strong> The CPU enforces it. When your program tries to execute a privileged instruction (like directly writing to a disk register) while in Ring 3, the CPU raises a <em>General Protection Fault</em>. The OS catches the trap and typically kills the program with SIGSEGV. (Strictly, the everyday segfault you see from dereferencing a bad pointer is a <em>page fault</em> on an unmapped address, not a GPF — both are hardware traps the kernel turns into the same signal.) Hardware enforces the OS's authority — the OS isn't just software policy, it's backed by CPU architecture.
</div>

<div class="quiz-section">
  <h3><span class="qico">◉</span> Check Your Understanding</h3>
  <div class="quiz-q">
    <p>Your Python program calls open("data.txt"). At what point does CPU mode switch to kernel mode?</p>
    <div class="quiz-options">
      <div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. When Python imports the os module</div>
      <div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. When the C library issues a system call instruction</div>
      <div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. When the file is actually read from disk</div>
      <div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. It never switches — Python handles files directly</div>
    </div>
    <div class="quiz-explain">The mode switch happens at the system call boundary — a special CPU instruction (syscall/int 0x80) that triggers a trap handler in the kernel. The Python/C layers above it are still user mode.</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div>

<div class="quiz-section"><h3><span class="qico">◉</span> Check Your Understanding</h3>
<div class="quiz-q">
    <p>Which of these operations does <em>not</em> require a transition to kernel mode?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Reading a file from disk</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Adding two integers in a register</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Allocating memory with mmap()</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Opening a network socket</div></div>
    <div class="quiz-explain">Arithmetic on registers is an unprivileged instruction — the CPU executes it directly in Ring 3 with no OS involvement. Every operation touching hardware or shared kernel state (files, memory maps, sockets) must trap into Ring 0 via a system call.</div>
  </div>
<div class="quiz-q">
    <p>Why can a user program not simply execute a privileged instruction to bypass the OS?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. The compiler refuses to emit it</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. The CPU raises a fault because the program is in Ring 3</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. The instruction is encrypted</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. It can — OS protection is only a convention</div></div>
    <div class="quiz-explain">Protection is enforced by <em>hardware</em>, not politeness. Attempting a privileged instruction while the CPU is in Ring 3 raises a general protection fault, which traps into the kernel. The OS&rsquo;s authority rests on the CPU architecture itself — that is why it cannot be circumvented in software.</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div><div class="practice"><h3><span class="pico">✎</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied — check every digit.</p>
<div class="prob">
  <div class="prob-q"><span class="prob-n">1</span><div>Trace every user↔kernel transition in this C fragment, and state which lines cross the boundary:
 <pre class="mini">int x = 5;
FILE *f = fopen("data.txt", "r");
x = x * 2;
fread(buf, 1, 100, f);
fclose(f);</pre></div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m0l0_p1')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m0l0_p1')">Show solution</button></div>
  <div class="hint" id="h_m0l0_p1">Only operations needing hardware or kernel-managed state cross the boundary. Note also that the C library buffers I/O, which affects how many crossings actually occur.</div>
  <div class="sol" id="s_m0l0_p1"><pre class="mini">int x = 5;                     user mode only  (register/stack write)
fopen("data.txt","r")          CROSSES -> open() syscall
x = x * 2;                     user mode only  (arithmetic)
fread(buf,1,100,f)             CROSSES -> read() syscall (maybe)
fclose(f)                      CROSSES -> close() syscall</pre>
<p><strong>Three crossings</strong>, each involving: save user registers → switch to Ring 0 → run the handler → restore → return to Ring 3.</p>
<p>The subtlety on <code>fread</code>: the C library keeps its own buffer (typically 4 KB). The first fread triggers a real <code>read()</code> syscall that fetches 4 KB; subsequent small freads are served from the user-space buffer with <strong>no syscall at all</strong>. This is exactly why buffered I/O is faster than raw syscalls — you can confirm it with <code>strace -c ./prog</code>, which counts actual syscalls made.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">2</span><div>A colleague says "system calls are just function calls into the kernel". Explain precisely why this is wrong.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m0l0_p2')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m0l0_p2')">Show solution</button></div>
  <div class="hint" id="h_m0l0_p2">Compare what happens to the stack, the privilege level, and the instruction used.</div>
  <div class="sol" id="s_m0l0_p2"><p>An ordinary function call is a <code>call</code> instruction: it pushes a return address and jumps, all within the same privilege level and the same address space. Nothing about the security state changes.</p>
<p>A system call is a deliberate, controlled <strong>trap</strong>:</p>
<ul>
<li>It uses a special instruction (<code>syscall</code> on x86-64, <code>svc</code> on ARM) — not <code>call</code>.</li>
<li>The CPU switches from Ring 3 to Ring 0 and to a <em>different, kernel-owned stack</em>. User code cannot choose where execution lands.</li>
<li>Entry is only ever at a fixed, kernel-registered handler address, dispatched by a syscall number in a register. You cannot jump to an arbitrary kernel address — that would defeat the entire protection model.</li>
<li>The kernel must validate every pointer argument, because they come from an untrusted source.</li>
</ul>
<p>The practical consequence is cost: a function call is a few cycles, while a syscall is hundreds to thousands once privilege switching and (post-Spectre/Meltdown) page-table isolation are accounted for. That gap is the entire reason for buffered I/O, <code>vDSO</code> for cheap calls like <code>gettimeofday()</code>, and <code>io_uring</code> for batching.</p></div>
</div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>The OS is an abstraction layer plus a resource arbiter — programs target the OS, not the hardware.</li><li>Ring 0 (kernel) versus Ring 3 (user) is enforced by the CPU, not by convention.</li><li>The system call interface is the only legal crossing point between the two.</li><li>Syscalls are traps, not function calls — hundreds of times more expensive, which is why I/O is buffered.</li></ul></div>`
  },
  "m0l1": {
    mod: "MODULE 0 — Foundation",
    title: "OS Types & Evolution",
    level: "Beginner",
    time: "20 min",
    industry: "Background",
    prev: "m0l0",
    next: "m0l2",
    content: `
<h2>Why Does History Matter Here?</h2>
<p>Knowing <em>why</em> each OS type was invented forces you to understand the problem it solves — which is exactly how interview questions are structured ("why would you use a real-time OS over a general-purpose one?").</p>

<h2>The Evolution Timeline</h2>

<h3>1. Batch Systems (1950s–60s)</h3>
<p>No interactive users. Programs (jobs) were submitted on <strong>punch cards</strong>, batched together, run one after another.</p>
<div class="callout analogy">
Like dropping off your laundry at a laundromat, leaving, and picking it up later. You don't stand there watching. Efficient for the laundromat (machine never idle), terrible turnaround if your job was at the back of the pile.
</div>
<p><strong>Problem:</strong> CPU was idle during I/O (disk reads). Huge waste. This led to...</p>

<h3>2. Multiprogrammed Systems (1960s)</h3>
<p>Keep multiple jobs <em>in memory at once</em>. When Job A waits for I/O, CPU switches to Job B.</p>
<p><strong>CPU utilisation went from ~40% to ~90%+.</strong> This is the core idea behind all modern OSes.</p>

<h3>3. Time-Sharing Systems (1970s — Unix era)</h3>
<p>Multiple <em>interactive users</em> on the same machine simultaneously. The OS rapidly switches between users so fast that each thinks they have the CPU to themselves.</p>
<p>Unix (1969, Bell Labs) was born from this need. <strong>Everything in modern OS descends from these ideas.</strong></p>

<h3>4. Real-Time OS (RTOS)</h3>
<p>Guarantees a <strong>deadline</strong> for task completion. Two types:</p>
<ul>
  <li><strong>Hard real-time:</strong> Missing a deadline is a system failure. (Airbag controller, pacemaker, spacecraft flight computer)</li>
  <li><strong>Soft real-time:</strong> Missing a deadline degrades quality but isn't catastrophic. (Video streaming, phone calls)</li>
</ul>
<div class="callout warning">
A hard RTOS does NOT mean "fast." It means <strong>predictable</strong>. An RTOS response might be slower in average case than Linux, but it guarantees it never exceeds X microseconds. Linux has variable, unpredictable latency — unacceptable for a car's ABS system.
</div>

<h3>5. Distributed OS</h3>
<p>Multiple machines, each with its own OS, but the combined system presents a <strong>single unified image</strong> to users. The complexity of multiple nodes is hidden.</p>
<div class="callout industry-note">
In practice today, true distributed OSes are rare. What we have instead is <strong>distributed systems</strong> (Kubernetes, distributed databases) where the coordination logic lives in middleware — not the OS itself. When interviewers ask about "distributed OS," they often mean distributed systems concepts: consistency, fault tolerance, CAP theorem.
</div>

<h3>6. Parallel OS</h3>
<p>Manages <strong>multiple CPUs/cores on one machine</strong> (SMP — Symmetric Multiprocessing). Linux is an SMP OS. Your laptop with 8 cores runs a parallel OS.</p>

<h2>Modern OS Examples & Where They Fit</h2>
<table>
  <tr><th>OS</th><th>Type</th><th>Used In</th></tr>
  <tr><td>Linux (mainline)</td><td>General purpose, SMP</td><td>Servers, Android, embedded</td></tr>
  <tr><td>Windows 11</td><td>General purpose, SMP</td><td>Desktop, gaming</td></tr>
  <tr><td>FreeRTOS</td><td>Hard RTOS</td><td>Microcontrollers, IoT</td></tr>
  <tr><td>VxWorks</td><td>Hard RTOS</td><td>Mars rovers, aircraft</td></tr>
  <tr><td>macOS / Darwin</td><td>Unix-based, SMP</td><td>Desktop, laptops</td></tr>
  <tr><td>QNX</td><td>Microkernel RTOS</td><td>Car infotainment (BMW, GM)</td></tr>
</table>

<div class="quiz-section"><h3><span class="qico">◉</span> Check Your Understanding</h3>
<div class="quiz-q">
    <p>What distinguishes a <em>hard</em> real-time system from a fast general-purpose one?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. It has a faster CPU</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. It guarantees a bounded worst-case response time</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. It runs more processes concurrently</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. It never uses interrupts</div></div>
    <div class="quiz-explain">Hard real-time means <em>predictable</em>, not fast. An RTOS may have a worse average latency than Linux while guaranteeing it never exceeds a stated bound. For an airbag controller a guaranteed 5 ms beats an average 1 ms with an occasional 50 ms outlier — the outlier is a fatality.</div>
  </div>
<div class="quiz-q">
    <p>Multiprogramming was introduced primarily to solve which problem?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Users could not share files</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. The CPU sat idle during I/O waits</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Memory was too small</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Programs crashed too often</div></div>
    <div class="quiz-explain">In batch systems the CPU stalled completely whenever a job waited on I/O, pushing utilisation as low as 40%. Keeping several jobs resident lets the CPU switch to another whenever one blocks, raising utilisation above 90%. Every modern OS still rests on this idea.</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div>

<div class="practice"><h3><span class="pico">&#9998;</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied &mdash; check every digit.</p>
<div class="prob"><div class="prob-q"><span class="prob-n">1</span><div>For each system below, state whether a general-purpose OS or a hard real-time OS is appropriate, and justify in one sentence: (a) an airbag deployment controller, (b) a video streaming server, (c) an insulin pump, (d) a CI build farm.</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m0l1_p1')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m0l1_p1')">Show solution</button></div><div class="hint" id="h_m0l1_p1">Ask what happens when a deadline is missed. If the answer is "someone is harmed" it is hard real-time; if it is "quality degrades" it is soft.</div><div class="sol" id="s_m0l1_p1"><p><strong>(a) Airbag controller &mdash; hard RTOS.</strong> Deployment must occur within a bounded window measured in milliseconds; a late airbag is worse than none. Missing the deadline is a fatality, so a guaranteed worst-case response is mandatory. Typically FreeRTOS, AUTOSAR OS or similar.</p>
<p><strong>(b) Video streaming server &mdash; general-purpose OS.</strong> This is <em>soft</em> real-time: a late frame causes a visible stutter, not a failure. Linux with appropriate buffering is ideal, and throughput matters more than worst-case latency.</p>
<p><strong>(c) Insulin pump &mdash; hard RTOS.</strong> Dose timing and volume are safety-critical; an unbounded scheduling delay could deliver the wrong amount. Also subject to medical-device certification, which general-purpose kernels cannot readily satisfy.</p>
<p><strong>(d) CI build farm &mdash; general-purpose OS.</strong> No deadlines at all; the goal is maximum throughput. A build finishing two seconds late costs nothing, so you want the scheduler optimising for utilisation.</p>
<p><strong>The distinguishing question is never "is it fast?"</strong> It is "what is the consequence of missing a deadline, and is the worst case bounded?" An RTOS often has <em>worse</em> average latency than Linux while guaranteeing it never exceeds a stated ceiling.</p></div></div>
<div class="prob"><div class="prob-q"><span class="prob-n">2</span><div>Multiprogramming raised CPU utilisation from roughly 40% to over 90%. Explain the mechanism, and describe what limits the benefit as you add ever more concurrent jobs.</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m0l1_p2')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m0l1_p2')">Show solution</button></div><div class="hint" id="h_m0l1_p2">Think about what the CPU was doing during I/O in a batch system, and what new resource becomes scarce as the job count rises.</div><div class="sol" id="s_m0l1_p2"><p><strong>The mechanism.</strong> In a batch system a job holds the CPU even while waiting for I/O, so the processor idles through every disk read. Multiprogramming keeps several jobs resident in memory; when job A blocks on I/O, the OS immediately dispatches job B. The CPU now idles only when <em>every</em> resident job is blocked simultaneously, which becomes unlikely as the count rises.</p>
<p>If a job spends fraction <em>p</em> of its time blocked on I/O, then with <em>n</em> independent jobs the CPU is idle only when all are blocked &mdash; probability p<sup>n</sup>. So utilisation = 1 &minus; p<sup>n</sup>. With p = 0.8: one job gives 20%, five jobs give 67%, ten jobs give 89%.</p>
<p><strong>What limits it.</strong> Two things. First, diminishing returns &mdash; the curve flattens, so going from 10 to 20 jobs adds very little. Second and decisively, <strong>memory</strong>: every resident job needs frames, and past a point each job&rsquo;s share falls below its working set. The system then begins <strong>thrashing</strong>, page-fault rates explode, and CPU utilisation <em>collapses</em> rather than improving (Module 6).</p>
<p>This produces the counter-intuitive result that adding more jobs to a busy system can reduce throughput &mdash; and it is why a naive scheduler that reacts to low CPU utilisation by admitting more work makes the situation catastrophically worse.</p></div></div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>Batch → multiprogrammed → time-sharing: each step solved the previous one&rsquo;s idle-CPU problem.</li><li>Hard RTOS means <strong>predictable</strong>, not fast; soft RTOS degrades gracefully.</li><li>True distributed OSes are rare — modern practice puts coordination in middleware (Kubernetes).</li></ul></div>`
  },
  "m0l2": {
    mod: "MODULE 0 — Foundation",
    title: "OS Architecture",
    level: "Intermediate",
    time: "50 min",
    industry: "Design Pattern",
    prev: "m0l1",
    next: "m1l0",
    content: `
<h2>How Is the OS Itself Structured?</h2>
<p>The OS is not one monolithic blob. Different architectural approaches make different trade-offs between performance, stability, and security.</p>

<h3>1. Monolithic Kernel</h3>
<p>The <strong>entire OS</strong> — file system, drivers, memory manager, scheduler — runs as one giant program in kernel mode.</p>
<div class="diagram">
  <div class="d-title">Monolithic Architecture</div>
USER SPACE:  [ App A ]  [ App B ]  [ App C ]
                ↕  syscall interface  ↕
KERNEL SPACE: <span class="highlight">[ Scheduler | Memory Mgr | FS | Device Drivers | Networking ]</span>
              Everything in one address space, one privilege level
HARDWARE:     [ CPU ]  [ RAM ]  [ Disk ]  [ NIC ]
</div>

<p><strong>Pros:</strong> Fast (no message passing between components), mature, Linux does this.</p>
<p><strong>Cons:</strong> A bug in one driver can crash the entire kernel. A faulty GPU driver kills your whole system. (This is why Linux kernel panics happen.)</p>

<h3>2. Microkernel</h3>
<p>The kernel does <em>minimal work</em> — just scheduling, IPC (inter-process communication), and basic memory. Everything else (file systems, drivers, networking) runs as <strong>user-space servers</strong>.</p>
<div class="diagram">
  <div class="d-title">Microkernel Architecture</div>
USER SPACE:  [ App ]  <span class="highlight2">[ FS Server ]</span>  <span class="highlight2">[ Driver Server ]</span>  <span class="highlight2">[ Net Server ]</span>
                          ↕     message passing (IPC)     ↕
KERNEL SPACE: <span class="highlight">[ IPC | Basic Scheduler | Address Space Mgmt ]</span>   ← tiny!
HARDWARE:     [ CPU ]  [ RAM ]  [ Disk ]
</div>
<p><strong>Pros:</strong> A buggy driver crashes only its server process, not the kernel. More secure. Easier to port.</p>
<p><strong>Cons:</strong> IPC overhead makes it slower than monolithic for many operations.</p>
<p><strong>Examples:</strong> Mach (basis of macOS/iOS), QNX, L4, MINIX 3.</p>

<h3>3. Hybrid Kernel</h3>
<p>Windows NT, macOS/XNU — these pull some services back into kernel space for performance, while maintaining microkernel-like structure. Pragmatic middle ground.</p>

<h3>4. Exokernel (academic)</h3>
<p>Kernel does almost nothing except <strong>multiplex hardware</strong>. Applications directly manage their own abstractions. Ultra-high performance but extreme complexity for developers. Mostly a research concept (MIT Exokernel project).</p>

<div class="callout industry-note">
<strong>Linux is monolithic — but with loadable kernel modules (LKM).</strong> You can add/remove drivers at runtime without rebooting. <code>modprobe nvidia</code> loads the NVIDIA kernel module. This is how Linux keeps the performance of monolithic while gaining some of the modularity benefits. In real work, you'll deal with LKMs when writing device drivers or custom kernel extensions.
</div>

<h2>Boot Sequence (What happens when you press Power?)</h2>
<ol>
  <li><strong>BIOS/UEFI:</strong> Firmware checks hardware (POST), finds bootable drive</li>
  <li><strong>Bootloader (GRUB):</strong> Loads the kernel image into RAM</li>
  <li><strong>Kernel initialisation:</strong> Sets up memory management, interrupts, scheduler</li>
  <li><strong>Init/Systemd:</strong> First user-space process (PID 1), starts all services</li>
  <li><strong>Login:</strong> Shell or display manager ready</li>
</ol>

<div class="callout deepdive">
<strong>PID 1 is special.</strong> It's the ancestor of every process on the system. When a process's parent dies without waiting for it, the orphaned process is adopted by PID 1 (systemd or init). If PID 1 crashes, the kernel panics. This is why containerised systems (Docker) have their own PID 1 challenge — the container's PID 1 must handle signals properly, or zombie processes accumulate.
</div>

<div class="quiz-section">
  <h3><span class="qico">◉</span> Check Your Understanding</h3>
  <div class="quiz-q">
    <p>In a microkernel OS, a bug in the file system driver would:</p>
    <div class="quiz-options">
      <div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Crash the entire kernel immediately</div>
      <div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Crash only the file system server process</div>
      <div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Be ignored since drivers run in kernel mode</div>
      <div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Crash all user applications simultaneously</div>
    </div>
    <div class="quiz-explain">In a microkernel, drivers run as user-space servers. A buggy driver is just a crashing user-space process — the kernel stays alive, and the driver can potentially be restarted.</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div>

<div class="practice"><h3><span class="pico">✎</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied — check every digit.</p>
<div class="prob">
  <div class="prob-q"><span class="prob-n">1</span><div>Compare monolithic and microkernel designs on: performance, fault isolation, and ease of
 extension. Then explain why Linux — monolithic — is not actually inflexible.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m0l2_p1')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m0l2_p1')">Show solution</button></div>
  <div class="hint" id="h_m0l2_p1">Think about what crossing the user/kernel boundary costs, and what loadable modules provide.</div>
  <div class="sol" id="s_m0l2_p1"><table class="calc"><tr><th></th><th>Monolithic</th><th>Microkernel</th></tr>
<tr><td>Performance</td><td><strong>Faster</strong> — subsystems call each other directly as functions</td><td>Slower — every interaction is IPC with mode switches and copying</td></tr>
<tr><td>Fault isolation</td><td>Poor — one bad driver panics the whole kernel</td><td><strong>Strong</strong> — a driver is a user process; it crashes and restarts alone</td></tr>
<tr><td>Extension</td><td>Rebuild or load a module into kernel space</td><td><strong>Easy</strong> — start a new user-space server</td></tr></table>
<p><strong>Why Linux is not inflexible:</strong> loadable kernel modules give runtime extensibility without a reboot — <code>modprobe</code> inserts code into the running kernel. Linux gets monolithic performance with much of the modularity benefit, while keeping the weakness: an LKM runs in Ring 0, so a buggy module still panics the machine.</p>
<p>Modern Linux narrows even that gap. <strong>FUSE</strong> runs filesystems in user space, <strong>uio</strong>/<strong>vfio</strong> and DPDK/SPDK do the same for drivers, and <strong>eBPF</strong> runs sandboxed, verifier-checked programs inside the kernel — microkernel-style safety without the IPC cost. The strict monolithic/microkernel dichotomy is largely historical now.</p></div>
</div>
</div>

<div class="quiz-section"><h3><span class="qico">&#9673;</span> Check Your Understanding</h3>
<div class="quiz-q"><p>Why does a microkernel typically perform worse than a monolithic kernel for a file read?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Microkernels use slower algorithms</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. The request crosses the user/kernel boundary several times via IPC</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Microkernels cannot use DMA</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Microkernels lack a page cache</div></div><div class="quiz-explain">In a monolithic kernel the VFS layer calls the filesystem code, which calls the driver &mdash; all ordinary function calls inside one address space. In a microkernel each of those is a separate user-space server, so the path becomes application &rarr; kernel &rarr; FS server &rarr; kernel &rarr; driver server &rarr; kernel &rarr; back, with a mode switch and message copy at every hop. The algorithms are identical; the boundary crossings are the cost.</div></div>
<div class="quiz-q"><p>Your Docker container accumulates zombie processes. What is the underlying cause?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. The container has insufficient memory</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. The application runs as PID 1 and does not reap adopted orphans</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Docker disables the wait() syscall</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Container filesystems cannot store process state</div></div><div class="quiz-explain">On a normal system PID 1 is init/systemd, which reaps orphans automatically. In a container your application <em>is</em> PID 1 and inherits that duty &mdash; but most applications never call <code>wait()</code> for processes they did not spawn. Orphans re-parented to it become permanent zombies. Fix with <code>docker run --init</code>, a minimal init such as tini, or by handling SIGCHLD yourself.</div></div>
<div class="quiz-q"><p>What does a loadable kernel module give Linux that a pure monolithic design lacks?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Fault isolation equivalent to a microkernel</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Runtime extensibility without recompiling or rebooting</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. The ability to run drivers in user space</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Immunity to kernel panics</div></div><div class="quiz-explain">LKMs let you insert and remove code from a running kernel &mdash; <code>modprobe</code> loads a driver without a reboot. That is modularity of <em>deployment</em>, not of <em>protection</em>: the module still executes in Ring 0 with full privileges, so a bug in it panics the machine exactly as built-in code would. FUSE and eBPF are the mechanisms that provide genuine isolation.</div></div>
<button class="quiz-reset" onclick="resetQuiz(this)">&#8634; Reset these questions</button></div>

<h2>Virtualisation &mdash; Running an OS Inside an OS</h2>
<p>Everything so far assumed one OS owning the hardware. Virtualisation breaks that assumption: a
<strong>hypervisor</strong> (or virtual machine monitor) multiplexes real hardware among several
complete guest operating systems, each believing it is alone. It is the same abstraction trick the
OS plays on processes, applied one level down.</p>

<div class="diagram"><div class="d-title">Type-1 vs Type-2 hypervisor</div>TYPE-1 (bare metal)                TYPE-2 (hosted)

 +------+ +------+ +------+          +------+ +------+
 |Guest | |Guest | |Guest |          |Guest | |Guest |
 |  OS  | |  OS  | |  OS  |          |  OS  | |  OS  |
 +------+ +------+ +------+          +------+ +------+
 +------------------------+          +----------------+
 |      HYPERVISOR        |          |   HYPERVISOR   |  &lt;- an app
 +------------------------+          +----------------+
 +------------------------+          +------------------------+
 |       HARDWARE         |          |        HOST OS         |
 +------------------------+          +------------------------+
                                     +------------------------+
                                     |       HARDWARE         |
                                     +------------------------+

 hypervisor IS the OS                 runs as a process on a
 lowest overhead                      normal desktop OS
 ESXi, Xen, Hyper-V,                  extra layer -&gt; more overhead
 KVM (Linux kernel is the             convenient for development
 hypervisor)                          VirtualBox, VMware Workstation,
                                      QEMU without KVM</div>

<h3>The Classical Requirement</h3>
<p>Popek and Goldberg (1974) proved a machine is virtualisable if every <strong>sensitive</strong>
instruction &mdash; one that reads or changes privileged state &mdash; is also <strong>privileged</strong>,
meaning it traps when executed in user mode. The hypervisor can then run the guest kernel
deprivileged and emulate each trap. This is <em>trap-and-emulate</em>.</p>

<div class="callout warning">
<strong>x86 famously failed this test.</strong> Seventeen instructions &mdash; <code>POPF</code> being the
classic example &mdash; were sensitive but <em>not</em> privileged: in user mode they silently did the
wrong thing instead of trapping. The guest kernel would get a plausible but incorrect result and no
opportunity to intervene. VMware's answer in 1999 was <strong>binary translation</strong>, rewriting the
guest's kernel instruction stream on the fly to replace the offending instructions. Xen took a
different route with <strong>paravirtualisation</strong>: modify the guest kernel to call the hypervisor
explicitly rather than executing sensitive instructions at all. Both were engineering heroics to
work around a CPU design flaw.
</div>

<p>Intel VT-x and AMD-V (2005&ndash;2006) fixed it in hardware by adding a new privilege dimension:
<strong>root</strong> mode for the hypervisor and <strong>non-root</strong> mode for guests, each with its
own full ring 0&ndash;3 stack. A guest kernel now genuinely runs in ring 0 of non-root mode, and
sensitive operations cause a <em>VM exit</em> to the hypervisor. Trap-and-emulate finally works on
x86, which is why KVM &mdash; a comparatively small kernel module &mdash; can do what once required
binary translation.</p>

<h3>The Two Hard Problems</h3>
<div class="code-block"><pre>1. MEMORY -- the guest has its own page tables, but the
   &quot;physical&quot; addresses it produces are not real.

   guest virtual -&gt; guest physical -&gt; host physical
                 ^                 ^
            guest page table   hypervisor mapping

   Software answer: SHADOW PAGE TABLES. The hypervisor keeps
   a hidden table mapping guest-virtual straight to
   host-physical, and must intercept every guest page-table
   write to keep it in sync. Correct, and very expensive.

   Hardware answer: NESTED PAGING (Intel EPT / AMD RVI).
   The MMU walks BOTH levels itself. No interception needed.
   Cost: a TLB miss may now walk up to 24 tables instead of 4
   -- which is why huge pages matter even more inside a VM.

2. I/O -- a guest driver talks to hardware that is not there.

   EMULATION      hypervisor pretends to be an e1000 NIC.
                  Works with unmodified guests. Slow: every
                  register access is a VM exit.

   PARAVIRTUAL    guest uses a virtio driver written to talk
   (virtio)       to the hypervisor over a shared ring buffer.
                  Requires guest support; near-native speed.
                  This is the normal choice on KVM.

   PASSTHROUGH    give the guest the real device via IOMMU
   (SR-IOV)       remapping. Native speed, no sharing (or
                  hardware-level sharing with SR-IOV virtual
                  functions). Used for GPUs and high-speed NICs.</pre></div>

<h2>Containers &mdash; Virtualising the OS, Not the Machine</h2>
<p>A VM virtualises <em>hardware</em> and needs a whole guest kernel. A container virtualises the
<em>operating system interface</em>: processes share the host kernel but each sees a private view of
the system. It is not a lightweight VM &mdash; it is a different mechanism entirely.</p>

<div class="diagram"><div class="d-title">Virtual machines vs containers</div>VIRTUAL MACHINES                  CONTAINERS

 +-----------+ +-----------+      +-----------+ +-----------+
 |    App    | |    App    |      |    App    | |    App    |
 +-----------+ +-----------+      +-----------+ +-----------+
 | Bins/Libs | | Bins/Libs |      | Bins/Libs | | Bins/Libs |
 +-----------+ +-----------+      +-----------+ +-----------+
 | GUEST OS  | | GUEST OS  |      +---------------------------+
 |  ~1 GB    | |  ~1 GB    |      |   CONTAINER RUNTIME       |
 +-----------+ +-----------+      +---------------------------+
 +---------------------------+    +---------------------------+
 |       HYPERVISOR          |    |     SHARED HOST KERNEL    |
 +---------------------------+    +---------------------------+
 |         HARDWARE          |    |         HARDWARE          |
 +---------------------------+    +---------------------------+

 boot time   ~30-60 s            ~50 ms
 size        GB                  MB
 isolation   STRONG (hardware)   weaker (shared kernel)
 guest OS    any                 must match host kernel
 density     tens per host       hundreds per host</div>

<p>Two kernel features do the work:</p>
<ul>
  <li><strong>Namespaces</strong> control what a process can <em>see</em>. There are several kinds
      &mdash; PID (its own process tree, where the container's init is PID 1), mount (its own
      filesystem view), network (its own interfaces and ports), UTS (hostname), IPC, user (UID
      mapping, so root inside maps to an unprivileged UID outside), and cgroup.</li>
  <li><strong>cgroups</strong> control what a process can <em>use</em> &mdash; CPU shares and quotas,
      memory limits, block-I/O bandwidth, PID counts. A memory limit is enforced by the same OOM
      machinery covered in Module 6, applied per group.</li>
</ul>

<div class="code-block"><pre>$ docker run --rm -it --memory=512m --cpus=1.5 alpine sh

What the kernel actually does:

  clone(CLONE_NEWPID | CLONE_NEWNS | CLONE_NEWNET |
        CLONE_NEWUTS | CLONE_NEWIPC | CLONE_NEWUSER, ...)
        -&gt; the new process gets fresh namespaces

  write to /sys/fs/cgroup/memory.max      = 536870912
  write to /sys/fs/cgroup/cpu.max         = &quot;150000 100000&quot;
        -&gt; 1.5 cores&#x27; worth of CPU time per 100 ms period

  pivot_root into the image&#x27;s layered filesystem
  apply the seccomp profile (blocks ~44 dangerous syscalls)
  drop all capabilities except a small default set
  execve(&quot;/bin/sh&quot;)

No kernel booted. No firmware. It is a PROCESS -- one with a
restricted view of the system. Confirm it from the host:

  $ ps aux | grep sh        # the container&#x27;s shell is visible
  $ ls /proc/&lt;pid&gt;/ns/      # its namespace identifiers</pre></div>

<div class="callout deepdive">
<strong>The isolation boundary is the real difference.</strong> A VM's boundary is the virtual hardware
interface, enforced by the CPU. Escaping means defeating VT-x, so the attack surface is narrow.
A container's boundary is the <strong>syscall interface</strong> &mdash; roughly 400 system calls, all
reachable, all sharing one kernel. A single kernel privilege-escalation bug can be a container
escape, which is why <code>seccomp-bpf</code> filters restrict the callable set and why capabilities
are dropped by default. It is also why multi-tenant platforms often run containers <em>inside</em>
lightweight VMs &mdash; AWS Fargate uses Firecracker microVMs, and gVisor interposes a user-space
kernel &mdash; buying the container's density with something closer to the VM's boundary.
</div>

<div class="callout industry-note">
<strong>Why a container starts in milliseconds.</strong> There is no kernel to boot, no firmware, no
device probing &mdash; <code>docker run</code> is fundamentally <code>clone()</code> with extra namespace
flags, plus mounting a layered filesystem and applying cgroup limits. That is the same
<code>clone()</code> from the Threads module, given more flags. A VM must boot a real kernel through
the whole sequence in Module 0: firmware, bootloader, kernel init, PID 1, services. This is also why
containers cannot run a different kernel from the host &mdash; a Linux container needs a Linux kernel,
which is precisely what Docker Desktop's hidden Linux VM provides on macOS and Windows.
</div>

<div class="quiz-section"><h3><span class="qico">&#9673;</span> Check Your Understanding</h3>
<div class="quiz-q"><p>Why did x86 originally require binary translation or paravirtualisation to be virtualised?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. It had too few registers</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Some sensitive instructions did not trap in user mode</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. It lacked an MMU</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Its clock speed was too low</div></div><div class="quiz-explain">Popek and Goldberg require every sensitive instruction to be privileged so it traps and the hypervisor can emulate it. On x86, seventeen instructions including <code>POPF</code> were sensitive but not privileged &mdash; in user mode they silently misbehaved instead of trapping, so the guest kernel got a wrong answer with no chance to intervene. VT-x and AMD-V fixed this by adding root/non-root modes.</div></div>
<div class="quiz-q"><p>What is the main performance cost of nested paging (EPT/RVI) compared with native execution?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Guest memory writes must be intercepted by the hypervisor</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. A TLB miss may require walking both guest and host page tables &mdash; up to 24 lookups</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. The guest cannot use virtual memory at all</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Page faults are disabled inside the guest</div></div><div class="quiz-explain">Nested paging removes the need to intercept guest page-table writes &mdash; that was the cost of the older shadow page-table approach. What remains is walk depth: each of the 4 guest levels must itself be translated through 4 host levels, so a miss can cost up to 24 memory references instead of 4. This is why huge pages matter even more inside a VM than on bare metal.</div></div>
<div class="quiz-q"><p>A container and a VM both run on one host. Which statement is accurate?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. The container has its own kernel</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. The container is a process with restricted namespaces and cgroups, sharing the host kernel</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. The VM shares the host kernel</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Both boot their own firmware</div></div><div class="quiz-explain">A container is an ordinary process created by <code>clone()</code> with namespace flags, limited by cgroups, sharing the single host kernel. That is why it starts in milliseconds and why a Linux container cannot run on a Windows kernel &mdash; Docker Desktop quietly runs a Linux VM to provide one. A VM by contrast boots a complete guest kernel on virtual hardware.</div></div>
<div class="quiz-q"><p>Why do multi-tenant platforms such as AWS Fargate run containers inside lightweight VMs?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. To allow containers to use more memory</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. To get hardware-enforced isolation, since a container escape only needs one kernel bug</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Because containers cannot access the network otherwise</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. To let containers run a different CPU architecture</div></div><div class="quiz-explain">A container&rsquo;s isolation boundary is the syscall interface &mdash; a large attack surface where a single kernel privilege-escalation bug can mean escape into another tenant&rsquo;s workload. A VM&rsquo;s boundary is enforced by the CPU itself. Firecracker microVMs give near-container startup times with a hardware boundary, which is the right trade when tenants are mutually untrusted.</div></div>
<button class="quiz-reset" onclick="resetQuiz(this)">&#8634; Reset these questions</button></div>
<div class="practice"><h3><span class="pico">&#9998;</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied &mdash; check every digit.</p>
<div class="prob"><div class="prob-q"><span class="prob-n">1</span><div>You must run 200 instances of a stateless Python web service on one 64-core, 256&nbsp;GB host.
Compare VMs and containers on memory footprint, startup time and isolation. Then state when your
answer would change.</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m0l2_p2')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m0l2_p2')">Show solution</button></div><div class="hint" id="h_m0l2_p2">Estimate the fixed per-instance overhead of each approach before considering the application itself.</div><div class="sol" id="s_m0l2_p2"><pre class="mini">VMs (each with a guest OS)
  guest OS      ~1 GB RAM x 200      = 200 GB
  app itself    ~200 MB   x 200      =  40 GB
                                       -------
                                       240 GB of 256 GB
  -> barely fits, almost nothing left for page cache
  -> boot time ~30-60 s each
  -> isolation: hardware-enforced

Containers (shared kernel)
  kernel        one copy             = ~1 GB
  app itself    ~200 MB x 200        =  40 GB
  shared libs   page cache, shared once across all
                                       -------
                                       ~41 GB of 256 GB
  -> comfortable, ~215 GB headroom
  -> start time ~50 ms each
  -> isolation: namespaces + cgroups + seccomp</pre>
<p><strong>Containers, clearly.</strong> The guest-OS tax is 200&nbsp;GB of pure duplication for identical copies of the same kernel. Containers also make autoscaling practical: 50&nbsp;ms starts let you react to load in real time, where 60&nbsp;s boots force you to over-provision.</p>
<p><strong>When the answer changes:</strong></p>
<ul>
<li><strong>Mutually untrusted tenants.</strong> If the 200 instances belong to 200 customers running arbitrary code, one kernel bug is a cross-tenant breach. Use microVMs (Firecracker) &mdash; they recover most of the density while restoring a hardware boundary.</li>
<li><strong>Different kernels needed.</strong> A Windows service, or one needing a specific kernel version or out-of-tree module, cannot share the host kernel.</li>
<li><strong>Compliance.</strong> Some regimes mandate hardware-level isolation regardless of technical argument.</li>
<li><strong>Kernel-level workloads</strong> &mdash; anything loading modules or requiring full root on a real kernel.</li>
</ul></div></div>
<div class="prob"><div class="prob-q"><span class="prob-n">2</span><div>A container is limited to 512&nbsp;MB with <code>--memory=512m</code>. The application inside
reads <code>/proc/meminfo</code>, sees 256&nbsp;GB, sizes its cache accordingly, and is killed. Explain
precisely what happened and how to fix it.</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m0l2_p3')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m0l2_p3')">Show solution</button></div><div class="hint" id="h_m0l2_p3">Which isolation mechanism limits memory, and which one controls what the process can see? They are not the same feature.</div><div class="sol" id="s_m0l2_p3"><p><strong>What happened.</strong> The limit is enforced by <strong>cgroups</strong>, but <code>/proc/meminfo</code> is provided by the <strong>host&rsquo;s procfs</strong>, which is not namespaced for memory figures. cgroups control what a process may <em>use</em>; namespaces control what it may <em>see</em> &mdash; and there is no "meminfo namespace". So the JVM, Go runtime or application heuristic reads the host&rsquo;s 256&nbsp;GB, sizes a cache for a machine that large, allocates past 512&nbsp;MB, and the cgroup OOM killer terminates it. Exit code 137 (128 + SIGKILL) is the signature.</p>
<p><strong>Fixes, best first:</strong></p>
<ul>
<li><strong>Make the runtime cgroup-aware.</strong> Modern JVMs honour container limits by default (<code>UseContainerSupport</code>, on since JDK 10) and read the cgroup value rather than <code>/proc/meminfo</code>. Go 1.19+ has <code>GOMEMLIMIT</code>. Set these explicitly rather than relying on autodetection.</li>
<li><strong>Configure the limit explicitly</strong> &mdash; pass <code>-Xmx400m</code> or an equivalent cache bound rather than letting the application guess. Always leave headroom below the cgroup limit for non-heap memory: thread stacks, metaspace, native buffers.</li>
<li><strong>Read the cgroup file directly</strong> if writing the code yourself: <code>/sys/fs/cgroup/memory.max</code> on cgroup v2, or <code>/sys/fs/cgroup/memory/memory.limit_in_bytes</code> on v1.</li>
<li><strong>LXCFS</strong> can present a namespaced <code>/proc/meminfo</code> reflecting the cgroup limit, which fixes unmodifiable legacy applications.</li>
</ul>
<p>The general lesson is that containers provide <em>incomplete</em> virtualisation of the OS interface. The same trap catches CPU-count detection: <code>nproc</code> and <code>availableProcessors()</code> may report all 64 host cores despite a <code>--cpus=1.5</code> quota, so thread pools get sized 40&times; too large.</p></div></div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>Monolithic = fast, fragile. Microkernel = robust, IPC overhead. Hybrid = pragmatic compromise.</li><li>Linux is monolithic but extensible at runtime via loadable kernel modules.</li><li>Boot: firmware (UEFI) → bootloader → kernel init → PID 1 → services.</li><li>PID 1 adopts orphans; in containers your app <em>is</em> PID 1, hence <code>--init</code>.</li></ul></div>`
  },
  "m1l0": {
    mod: "MODULE 1 — Processes",
    title: "Process Fundamentals",
    level: "Beginner",
    time: "20 min",
    industry: "Core Concept",
    prev: "m0l2",
    next: "m1l1",
    content: `
<h2>Program vs Process — A Crucial Distinction</h2>
<p>A <strong>program</strong> is a static file on disk — bytes, instructions, data. A <strong>process</strong> is a program in execution — it has its own memory, its own CPU registers, its own state. It's <em>alive</em>.</p>

<div class="callout analogy">
A program is a recipe. A process is an actual cook following that recipe in a specific kitchen, with specific ingredients, at a specific step right now. You can run the same recipe (program) as 100 different cooks (processes) simultaneously — each in their own kitchen (memory space), each at a different step.
</div>

<p>When you run <code>python script.py</code> twice in two terminals, you have <strong>one program, two processes</strong> — each with independent memory, independent file descriptors, independent execution state.</p>

<h2>What a Process Contains</h2>
<div class="diagram">
  <div class="d-title">Process Memory Layout (Linux x86-64)</div>
<span class="highlight">HIGH ADDRESS (kernel space — not accessible)</span>
┌─────────────────────────────────┐ 0xFFFFFFFFFFFFFFFF
│         KERNEL SPACE            │
├─────────────────────────────────┤ 
│ <span class="highlight2">Stack</span>  ← grows downward          │  Local variables, return addresses
│         ↓                       │  Each function call pushes a stack frame
├─────────────────────────────────┤
│         (unmapped gap)          │  Catches stack overflow
├─────────────────────────────────┤
│ <span class="highlight3">Heap</span>   ↑ grows upward            │  malloc()/new — dynamic allocation
├─────────────────────────────────┤
│ BSS Segment                     │  Uninitialised global variables
├─────────────────────────────────┤
│ Data Segment                    │  Initialised globals & statics
├─────────────────────────────────┤
│ <span class="highlight">Text Segment</span>                    │  Program code (read-only)
└─────────────────────────────────┘ 0x0000000000000000
</div>

<h2>Creating a Process: fork() and exec()</h2>
<p>On Unix/Linux, every process (except PID 1) is created by <strong>cloning an existing process</strong>.</p>

<div class="code-block" data-lang="C">
<pre><span class="cm">/* How a shell runs a command like "ls -la" */</span>
<span class="type">pid_t</span> pid = <span class="fn">fork</span>();   <span class="cm">/* Clone current process */</span>

<span class="kw">if</span> (pid == <span class="num">0</span>) {
    <span class="cm">/* We are the child process */</span>
    <span class="fn">execv</span>(<span class="str">"/bin/ls"</span>, args);   <span class="cm">/* Replace memory with "ls" program */</span>
    <span class="cm">/* If exec succeeds, this line never runs */</span>
} <span class="kw">else</span> {
    <span class="cm">/* We are the parent (the shell) */</span>
    <span class="fn">waitpid</span>(pid, &status, <span class="num">0</span>);  <span class="cm">/* Wait for child to finish */</span>
    printf(<span class="str">"ls exited with code %d\n"</span>, status);
}</pre>
</div>

<p><strong>fork()</strong> creates an almost-identical copy of the calling process. It returns <strong>0 to the child</strong> and the <strong>child's PID to the parent</strong>. That's how one function call produces two separate execution paths.</p>

<div class="callout deepdive">
<strong>Copy-on-Write (CoW):</strong> fork() doesn't actually copy all memory immediately — that would be hugely expensive. Instead, the kernel marks all pages as shared and read-only. When <em>either</em> process writes to a page, <em>then</em> the kernel copies just that page. If the child immediately calls exec(), it never writes anything, so no copy ever happens. This makes fork()+exec() extremely efficient — critical for shell performance when spawning thousands of short-lived processes.
</div>

<h2>Implicit vs Explicit Processes</h2>
<ul>
  <li><strong>User Process:</strong> Started by a user — your browser, terminal, python script</li>
  <li><strong>System Process:</strong> Started by the OS at boot — kernel threads, daemons (systemd-journald, sshd, cron)</li>
  <li><strong>Daemon:</strong> Background service with no controlling terminal. Usually ends in 'd' (httpd, sshd, dockerd)</li>
</ul>

<div class="callout industry-note">
<strong>In a production Linux environment</strong>, understanding the process tree is essential. <code>pstree</code> shows the hierarchy. <code>ps aux</code> shows all processes. <code>top</code> / <code>htop</code> show resource usage. When debugging a memory leak or CPU spike, the first thing you do is identify the offending process, then use <code>strace</code>, <code>perf</code>, or profilers to investigate further.
</div>

<div class="quiz-section"><h3><span class="qico">◉</span> Check Your Understanding</h3>
<div class="quiz-q">
    <p>What does <code>fork()</code> return, and to whom?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. 0 to both processes</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. The child&rsquo;s PID to the parent, and 0 to the child</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. The parent&rsquo;s PID to the child</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. 1 on success</div></div>
    <div class="quiz-explain">One call returns twice, in two different processes. The child receives 0 (it can find its own PID with getpid()), while the parent receives the child&rsquo;s PID so it can wait on it later. A negative return means the fork failed. This asymmetry is what lets a single code path split into two.</div>
  </div>
<div class="quiz-q">
    <p>Why does <code>fork()</code> not copy the parent&rsquo;s entire memory immediately?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. It does copy everything</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Copy-on-write shares pages until one side writes</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Memory is never copied at all</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Only the stack is copied</div></div>
    <div class="quiz-explain">Copy-on-write marks every page read-only and shared. A copy of an individual page happens only on the first write to it. Since the overwhelmingly common pattern is fork() followed immediately by exec() — which discards the address space entirely — most pages are never copied at all. This is what makes process creation on Unix cheap enough to be used casually in shell pipelines.</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div>

<div class="practice"><h3><span class="pico">&#9998;</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied &mdash; check every digit.</p>
<div class="prob"><div class="prob-q"><span class="prob-n">1</span><div>What does this program print, and how many processes exist at the end? Explain the tree.
<pre class="mini">int main() {
    fork();
    fork();
    printf("hello\n");
    return 0;
}</pre></div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m1l0_p1')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m1l0_p1')">Show solution</button></div><div class="hint" id="h_m1l0_p1">Each fork() doubles the number of processes running the subsequent code. Draw the tree level by level.</div><div class="sol" id="s_m1l0_p1"><pre class="mini">Start:            P0
After fork #1:    P0, A            (2 processes)
After fork #2:    P0, A, B, C      (4 processes)
                  P0 -> A (1st), B (2nd)
                  A  -> C (2nd)

Each of the 4 reaches printf.</pre>
<p><strong>"hello" is printed 4 times</strong>, and 4 processes exist (the original plus 3 children). In general <em>n</em> sequential forks yield 2<sup><em>n</em></sup> processes.</p>
<p><strong>A subtle trap.</strong> If output is redirected to a file, stdout becomes <em>block-buffered</em> rather than line-buffered. Text written before a fork sits in the userspace buffer and is <em>duplicated into every child</em>, so you can see more than 4 lines. Calling <code>fflush(stdout)</code> before forking, or writing to a terminal (line-buffered), avoids it. This catches people out regularly in exam questions.</p></div></div>
<div class="prob"><div class="prob-q"><span class="prob-n">2</span><div>Explain why <code>fork()</code> on a process using 4&nbsp;GB of RAM completes in well under a millisecond, and describe the one situation where copy-on-write becomes expensive.</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m1l0_p2')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m1l0_p2')">Show solution</button></div><div class="hint" id="h_m1l0_p2">What is actually duplicated at fork time? Then think about what happens on the first write to a shared page.</div><div class="sol" id="s_m1l0_p2"><p><strong>Why it is fast.</strong> <code>fork()</code> does not copy the 4&nbsp;GB. It copies the <em>page tables</em> and marks every entry read-only in both parent and child, incrementing a reference count on each physical page. Both processes then share the same physical frames. The work is proportional to the number of page-table entries, not to the memory volume &mdash; and with 2&nbsp;MB huge pages or a sparse address space, that is a small number.</p>
<p><strong>When it becomes expensive.</strong> On the first <em>write</em> to any shared page, the CPU raises a protection fault; the kernel allocates a fresh frame, copies 4&nbsp;KB, updates that process&rsquo;s page table and restarts the instruction. If the child goes on to write across most of its address space, you eventually pay for the entire 4&nbsp;GB copy &mdash; in many small, fault-driven instalments that are <em>slower</em> in total than one bulk copy would have been.</p>
<p><strong>The classic real-world case is Redis.</strong> Its background save forks a child to snapshot the dataset. If the parent continues taking heavy writes during the save, page after page is copied and memory usage can approach 2&times; the dataset size &mdash; sometimes triggering the OOM killer. Hence the <code>vm.overcommit_memory=1</code> guidance in the Redis documentation. Garbage collectors that touch every object cause the same problem, which is why Android moved away from its fork-based Zygote model for some workloads.</p></div></div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>A <strong>program</strong> is a file; a <strong>process</strong> is a program in execution with its own address space.</li><li>Memory layout: text, data, BSS, heap (grows up), stack (grows down).</li><li><code>fork()</code> returns twice — 0 to the child, the child&rsquo;s PID to the parent.</li><li>Copy-on-write makes fork() cheap; exec() then replaces the image entirely.</li></ul></div>`
  },
  "m1l1": {
    mod: "MODULE 1 — Processes",
    title: "Process States & PCB",
    level: "Beginner",
    time: "25 min",
    industry: "Core Concept",
    prev: "m1l0",
    next: "m1l2",
    content: `
<h2>Process States</h2>
<p>A process doesn't just run or not run. It moves through several states during its lifetime. Understanding this is critical for debugging and for scheduler design.</p>

<div class="diagram">
  <div class="d-title">Process State Diagram (5-State Model)</div>

        <span class="highlight">NEW</span> ─── admitted ──→ <span class="highlight">READY</span>
                               ↑     ↓
                     interrupt │   scheduler dispatch
                               │     ↓
                            <span class="highlight2">RUNNING</span>
                               │     ↓
                 I/O or event  │   exit
                    request    ↓     ↓
                          <span class="highlight3">WAITING</span>     <span class="highlight">TERMINATED</span>
                               │
                    I/O done   │
                               ↓
                            <span class="highlight">READY</span>
</div>

<table>
  <tr><th>State</th><th>What's Happening</th><th>Linux Name</th></tr>
  <tr><td>New</td><td>Process being created (fork in progress)</td><td>—</td></tr>
  <tr><td>Ready</td><td>In RAM, waiting for CPU time</td><td>TASK_RUNNING (in run queue)</td></tr>
  <tr><td>Running</td><td>Currently executing on CPU</td><td>TASK_RUNNING (on CPU)</td></tr>
  <tr><td>Waiting (Blocked)</td><td>Waiting for I/O, lock, sleep, signal</td><td>TASK_INTERRUPTIBLE / TASK_UNINTERRUPTIBLE</td></tr>
  <tr><td>Terminated</td><td>Process finished, waiting for parent to collect exit code</td><td>EXIT_ZOMBIE</td></tr>
</table>

<div class="callout warning">
<strong>Zombie Process:</strong> When a process exits, it doesn't immediately disappear. It becomes a zombie — its PCB stays in memory so the parent can call <code>wait()</code> and collect its exit status. If the parent never calls wait(), the zombie lingers. On a long-running server, thousands of zombie processes can exhaust the process table. Fix: always wait() for children, or use signal handlers for SIGCHLD.
</div>

<h2>The Process Control Block (PCB)</h2>
<p>For every process, the kernel maintains a data structure called the <strong>Process Control Block</strong>. In Linux, this is <code>struct task_struct</code> in the kernel source — it has roughly 155 members and occupies about 7&nbsp;KB (check yours with <code>pahole -C task_struct vmlinux</code>). Here's what matters:</p>

<div class="diagram">
  <div class="d-title">Process Control Block</div>
struct task_struct (Linux PCB) — selected fields:
├── <span class="highlight">pid_t pid</span>              — Process ID (unique integer)
├── <span class="highlight">pid_t ppid</span>             — Parent's PID
├── <span class="highlight">long state</span>             — Current state (RUNNING, SLEEPING, etc.)
├── <span class="highlight2">struct mm_struct *mm</span>   — Memory map (page tables, heap, stack)
├── <span class="highlight2">struct files_struct</span>    — Open file descriptors (fd table)
├── <span class="highlight3">struct thread_struct</span>   — CPU register state (saved when not running)
│   ├── rip (instruction pointer)
│   ├── rsp (stack pointer)
│   └── general registers (rax, rbx...)
├── uid, gid                  — Owner (for permissions)
├── nice, priority            — Scheduling priority
└── struct list_head tasks    — Links to other task_structs in the run queue
</div>

<p>The PCB is what the scheduler saves and restores. When the OS stops your process and runs another, it saves your CPU state into your PCB. When it comes back to you, it loads your PCB back into the CPU. This is <strong>context switching</strong>.</p>

<div class="callout deepdive">
<strong>File descriptor table in the PCB:</strong> When you call <code>open("file.txt")</code>, the kernel adds an entry to your process's fd table and returns an integer (say, 3). That integer is just an index into this table. <code>stdin</code> is always fd 0, <code>stdout</code> is fd 1, <code>stderr</code> is fd 2. This is why <code>2>&1</code> in bash means "redirect fd 2 to the same place as fd 1."
</div>

<div class="quiz-section">
  <h3><span class="qico">◉</span> Check Your Understanding</h3>
  <div class="quiz-q">
    <p>A server process spawns worker child processes but never calls wait(). What happens over time?</p>
    <div class="quiz-options">
      <div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Children are automatically cleaned up by the kernel</div>
      <div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Children become orphans and run forever</div>
      <div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Dead children become zombies, filling the process table</div>
      <div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. The parent crashes when it runs out of memory</div>
    </div>
    <div class="quiz-explain">Zombie processes accumulate — each dead child keeps its PCB in memory until the parent calls wait(). With thousands of zombies, the system can't create new processes (process table exhausted). Fix: handle SIGCHLD or periodically call waitpid() with WNOHANG.</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div>

<div class="quiz-section"><h3><span class="qico">◉</span> Check Your Understanding</h3>
<div class="quiz-q">
    <p>A process is in state <code>D</code> (uninterruptible sleep) in <code>ps</code> output and will not respond to <code>kill -9</code>. Why?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. It is a zombie awaiting reaping</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. It is blocked in a kernel operation that cannot be interrupted</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. It is running at real-time priority</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. It has masked SIGKILL</div></div>
    <div class="quiz-explain">TASK_UNINTERRUPTIBLE means the process is inside a kernel operation — typically disk or NFS I/O — that cannot be safely aborted midway without corrupting kernel state. Signals, including SIGKILL, are queued but not delivered until the operation completes. Persistent D state usually indicates failing storage or a hung network mount. Note SIGKILL genuinely cannot be masked; the reason here is different.</div>
  </div>
<div class="quiz-q">
    <p>What exactly does a zombie process still consume?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Its full address space and open files</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Only its PCB entry, holding the exit status</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Nothing at all</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. One CPU core</div></div>
    <div class="quiz-explain">On exit, the kernel releases the address space, file descriptors and other resources — but keeps the task_struct so the parent can retrieve the exit status via wait(). A zombie therefore consumes a process-table slot and a PID, not memory or CPU. The danger is exhausting the PID space, after which no new process can be created system-wide.</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div><div class="practice"><h3><span class="pico">✎</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied — check every digit.</p>
<div class="prob">
  <div class="prob-q"><span class="prob-n">1</span><div>Explain what happens to a child process in each case, and name the resulting state:
 (a) the child exits and the parent calls <code>wait()</code>;
 (b) the child exits and the parent never calls <code>wait()</code>;
 (c) the parent exits while the child is still running.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m1l1_p1')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m1l1_p1')">Show solution</button></div>
  <div class="hint" id="h_m1l1_p1">Two distinct terms are needed: one for a dead child not yet reaped, and one for a live child whose parent has died.</div>
  <div class="sol" id="s_m1l1_p1"><p><strong>(a) Normal reaping.</strong> The child becomes a zombie momentarily; <code>wait()</code> retrieves the exit status and the kernel frees the task_struct. The PID is released. This is the correct pattern.</p>
<p><strong>(b) Zombie leak.</strong> The child stays a <strong>zombie</strong> (state <code>Z</code>, shown as <code>&lt;defunct&gt;</code>) indefinitely, holding a PID and a process-table slot. A long-running server that forks per request and never reaps will exhaust the PID space, after which <em>every</em> fork on the system fails with EAGAIN. Fixes: call <code>waitpid(-1, &amp;st, WNOHANG)</code> in a loop from a SIGCHLD handler, or set <code>signal(SIGCHLD, SIG_IGN)</code> to have the kernel auto-reap.</p>
<p><strong>(c) Orphan, then re-parented.</strong> The child keeps running — losing a parent does not kill it. The kernel immediately re-parents it to PID 1 (or the nearest subreaper), which reaps it when it eventually exits. Orphans are therefore harmless; zombies are the problem.</p>
<p><strong>The container trap:</strong> inside Docker, PID 1 is your application, not systemd. Most applications do not reap adopted orphans, so zombies accumulate. Hence <code>docker run --init</code> or a minimal init such as tini.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">2</span><div>Why does a context switch require saving the program counter and stack pointer, and what would break if only the general-purpose registers were saved?</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m1l1_p2')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m1l1_p2')">Show solution</button></div>
  <div class="hint" id="h_m1l1_p2">Ask what each register is actually for when execution resumes.</div>
  <div class="sol" id="s_m1l1_p2"><p>The <strong>program counter</strong> holds the address of the next instruction. Without it the kernel has no idea where the process was in its own code — resumption would have to guess an address, which means executing arbitrary instructions. The process would crash instantly or corrupt itself.</p>
<p>The <strong>stack pointer</strong> identifies the process&rsquo;s current stack frame: its local variables, saved return addresses and the entire call chain. Restore the wrong SP and the process operates on someone else&rsquo;s stack — returning from the current function would jump to a foreign return address. This is precisely the corruption that stack-smashing attacks exploit deliberately.</p>
<p>General-purpose registers hold in-flight values, so losing them corrupts the current computation — bad, but locally contained. Losing PC or SP destroys <em>control flow itself</em>, which is unrecoverable. That is why they are architecturally saved first and restored last.</p></div>
</div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>Five states: New → Ready ⇄ Running → Waiting → Terminated.</li><li>Linux <code>D</code> state (uninterruptible sleep) does not respond even to SIGKILL — usually a storage or NFS symptom.</li><li><strong>Zombie</strong> = dead child not yet reaped (holds a PID). <strong>Orphan</strong> = live child whose parent died (adopted by PID 1).</li><li>The PCB (<code>task_struct</code>) is what the scheduler saves and restores on every switch.</li></ul></div>`
  },
  "m1l2": {
    mod: "MODULE 1 — Processes",
    title: "Context Switching",
    level: "Intermediate",
    time: "25 min",
    industry: "Performance Critical",
    prev: "m1l1",
    next: "m2l0",
    content: `
<h2>What Exactly Is a Context Switch?</h2>
<p>Your CPU has only one set of registers at a time. When the OS decides to stop running Process A and start Process B, it needs to:</p>
<ol>
  <li><strong>Save</strong> all of Process A's CPU state (all registers, program counter, stack pointer) into A's PCB</li>
  <li><strong>Load</strong> Process B's saved state from B's PCB into the CPU registers</li>
  <li>Jump to Process B's program counter — it resumes exactly where it left off</li>
</ol>

<div class="diagram">
  <div class="d-title">Context Switch Timeline</div>
Process A: ████████░░░░░░░░░░░░░████████░░░░
               ↑               ↑
         save A's state   restore A's state
               ↓               ↑
Process B: ░░░░████████████████░░░░░░░░░░░░
               ↑           ↑
         load B's state   save B's state

          [OVERHEAD: pure wasted CPU time]
          [No useful work happens during switch]
</div>

<h2>Why Context Switches Are Expensive</h2>
<p>The direct cost (saving ~hundreds of registers) is small. The <strong>indirect cost</strong> is huge:</p>
<ul>
  <li><strong>TLB flush:</strong> The CPU's Translation Lookaside Buffer (address translation cache) gets invalidated when switching processes. Next process gets cache misses until it warms up.</li>
  <li><strong>CPU cache pollution:</strong> The L1/L2 caches contain Process A's data. Process B's cache misses are expensive (100s of CPU cycles each).</li>
  <li><strong>Pipeline flush:</strong> The CPU's instruction pipeline is invalidated.</li>
</ul>

<div class="callout analogy">
Context switching is like a surgeon stopping an operation, carefully documenting everything (which instrument is where, how deep the incision is, patient vitals), going to perform a different surgery, then returning and reading all the notes to get back up to speed. The actual documentation takes a moment; the mental re-orientation is the real cost.
</div>

<h2>How Long Does a Context Switch Take?</h2>
<p>On modern hardware: <strong>1–10 microseconds</strong> for the switch itself. But with cache effects, effective cost can be <strong>10–100× higher</strong> for the first few milliseconds after a switch.</p>

<div class="callout industry-note">
<strong>This is why threads exist</strong> — threads within the same process share the same address space and page tables. A thread switch doesn't flush the TLB. Much cheaper. This is also why languages like Go (goroutines) and Erlang (lightweight processes) use <em>user-space scheduling</em> — they implement their own lightweight context switches that avoid kernel involvement entirely, running millions of goroutines on a handful of OS threads.
</div>

<h2>Voluntary vs Involuntary Context Switches</h2>
<ul>
  <li><strong>Voluntary (voluntary context switch):</strong> Process blocks on I/O, sleep(), mutex, or explicitly yields. Process chose to give up CPU.</li>
  <li><strong>Involuntary (preemption):</strong> Scheduler forcibly removes process from CPU because its time quantum expired. Process had no say.</li>
</ul>

<p>In Linux, <code>/proc/&lt;pid&gt;/status</code> shows <code>voluntary_ctxt_switches</code> and <code>nonvoluntary_ctxt_switches</code>. High involuntary switches can mean your process is CPU-bound and being preempted constantly — or the system is overloaded.</p>

<div class="code-block" data-lang="LINUX">
<pre><span class="cm"># Check context switches for a process</span>
cat /proc/1234/status | grep ctxt

<span class="cm"># Output:</span>
voluntary_ctxt_switches:    4521   <span class="cm"># Blocked for I/O etc.</span>
nonvoluntary_ctxt_switches:  89    <span class="cm"># Forcibly preempted</span></pre>
</div>

<h2>Measuring the Real Cost</h2>
<p>The direct cost of a switch &mdash; storing and reloading registers &mdash; is small and fixed.
The <em>indirect</em> cost is variable, much larger, and is what actually determines whether your
system feels fast.</p>

<div class="diagram"><div class="d-title">Where the time actually goes</div>DIRECT COST (unavoidable, small)
  save registers to PCB        ~  50-100 cycles
  load registers from new PCB  ~  50-100 cycles
  update scheduler structures  ~ 100-200 cycles
                                 --------------
                                 ~ 1-10 microseconds total

INDIRECT COST (variable, large)
  TLB flush / miss storm       ~ 100-300 cycles PER miss
  L1/L2 cache reload transient ~ thousands of misses
  branch predictor reset       ~ mispredicts until retrained
                                 --------------
                                 can be 10-100x the direct cost</div>

<p>Overhead as a fraction of useful work depends entirely on the quantum:</p>

<table class="calc">
  <tr><th>Quantum</th><th>Switch cost</th><th>Overhead</th><th>Verdict</th></tr>
  <tr><td>0.2 ms</td><td>0.2 ms</td><td>50.0%</td><td><span class="bad">Half the CPU wasted</span></td></tr>
  <tr><td>1 ms</td><td>0.2 ms</td><td>16.67%</td><td>Too costly</td></tr>
  <tr><td>4 ms</td><td>0.2 ms</td><td>4.76%</td><td><span class="good">Reasonable</span></td></tr>
  <tr><td>100 ms</td><td>0.2 ms</td><td>0.20%</td><td>Negligible overhead, poor response</td></tr>
</table>

<div class="callout deepdive">
<strong>Why the indirect cost dominates.</strong> Saving 16 general-purpose registers is perhaps a
hundred cycles. But the incoming process finds the L1/L2 caches full of the <em>outgoing</em>
process's data, and the TLB either flushed or tagged with a different address space. Every early
memory access is a miss costing 100&ndash;300 cycles. A process needs thousands of accesses to
re-warm its working set, so the effective penalty can be 10&ndash;100&times; the register-save cost.
This is called the <strong>cache reload transient</strong>.
</div>

<h2>What Makes a Switch Cheaper</h2>
<ul>
  <li><strong>Thread switch within a process:</strong> same address space, same page tables &mdash;
      no TLB flush and the caches stay largely warm. Typically 3&ndash;5&times; cheaper than a process switch.</li>
  <li><strong>ASIDs / PCIDs:</strong> modern CPUs tag TLB entries with an address-space identifier so
      entries from several processes coexist. This removes the full flush, though the entries still
      compete for space.</li>
  <li><strong>User-space scheduling:</strong> goroutines, Java virtual threads and async runtimes switch
      entirely in user mode &mdash; no trap, no privilege change, often under 100 ns.</li>
</ul>

<div class="callout warning">
<strong>Post-Spectre reality.</strong> Kernel page-table isolation (KPTI), introduced to mitigate Meltdown,
switches page tables on <em>every</em> user&harr;kernel transition. This measurably increased both syscall
and context-switch costs &mdash; syscall-heavy workloads saw regressions in the 5&ndash;30% range on
older CPUs lacking PCID support. It is a rare case of a security fix with a directly observable
scheduling cost.
</div>

<div class="quiz-section"><h3><span class="qico">&#9673;</span> Check Your Understanding</h3>
<div class="quiz-q"><p>A context switch costs 0.2&nbsp;ms and the scheduler uses a 1&nbsp;ms quantum. Roughly what fraction of CPU time is lost to switching?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. 0.2%</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. 2%</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. 17%</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. 50%</div></div><div class="quiz-explain">Each cycle is 1&nbsp;ms of work plus 0.2&nbsp;ms of overhead = 1.2&nbsp;ms total, so overhead is 0.2/1.2 &asymp; <strong>16.7%</strong>. Raising the quantum to 4&nbsp;ms drops this to about 4.8%. This is exactly why very small quanta are impractical no matter how good they look for responsiveness.</div></div>
<div class="quiz-q"><p>Why is switching between two threads of the same process cheaper than switching between two processes?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Threads have fewer registers to save</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. The address space and page tables are shared, so no TLB flush is needed</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Thread switches never enter the kernel</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Threads do not have their own stacks</div></div><div class="quiz-explain">Threads share the address space, so the page-table base register is unchanged and the TLB stays valid. Caches also remain relevant because the memory being touched belongs to the same process. Registers saved are the same in number, and a kernel-level thread switch does still enter the kernel &mdash; the saving is in the memory-system state.</div></div>
<div class="quiz-q"><p><code>/proc/&lt;pid&gt;/status</code> shows very high <code>nonvoluntary_ctxt_switches</code> and near-zero voluntary ones. What does this indicate?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. The process is blocking on I/O constantly</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. The process is CPU-bound and being preempted by the scheduler</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. The process is deadlocked</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. The process is a zombie</div></div><div class="quiz-explain">Voluntary switches happen when a process <em>chooses</em> to yield &mdash; blocking on I/O, a lock or sleep. Non-voluntary switches are forced preemptions when the quantum expires. An overwhelming majority of non-voluntary switches means the process always has work to do and keeps being interrupted: it is CPU-bound, or the machine is oversubscribed.</div></div>
<button class="quiz-reset" onclick="resetQuiz(this)">&#8634; Reset these questions</button></div>
<div class="practice"><h3><span class="pico">&#9998;</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied &mdash; check every digit.</p>
<div class="prob"><div class="prob-q"><span class="prob-n">1</span><div>A system performs 8,000 context switches per second. Each switch costs 5&nbsp;&micro;s of direct overhead, plus an estimated 20&nbsp;&micro;s of cache-reload penalty. What percentage of one CPU core is consumed purely by switching?</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m1l2_p1')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m1l2_p1')">Show solution</button></div><div class="hint" id="h_m1l2_p1">Compute the total overhead time per second, then express it as a fraction of one second of CPU time.</div><div class="sol" id="s_m1l2_p1"><pre class="mini">Per switch:  5 us direct + 20 us indirect = 25 us
Per second:  8000 x 25 us = 200,000 us = 200 ms

Fraction of one core = 200 ms / 1000 ms = <b>20%</b></pre>
<p>One fifth of a core is doing no useful work whatsoever. On a 4-core machine that is 5% of total capacity &mdash; tolerable. On a single-core embedded device it is severe.</p>
<p>The practical lesson: switch <em>rate</em> matters as much as switch cost. Reducing switches by raising the quantum, using thread pools instead of thread-per-request, or moving to async I/O attacks the 8,000 figure directly, which is usually easier than making each switch faster.</p></div></div>
<div class="prob"><div class="prob-q"><span class="prob-n">2</span><div>Explain why a machine can show 100% CPU utilisation while doing very little useful work. Give two distinct mechanisms and how you would tell them apart.</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m1l2_p2')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m1l2_p2')">Show solution</button></div><div class="hint" id="h_m1l2_p2">One mechanism involves memory, the other involves the scheduler itself. Think about what tools report and what each would show.</div><div class="sol" id="s_m1l2_p2"><p><strong>Mechanism 1 &mdash; thrashing.</strong> Processes have too few frames, so they page-fault continuously. The CPU appears busy but is largely in iowait, waiting on disk. Distinguishing signal: <code>vmstat 1</code> shows high <code>si</code>/<code>so</code> (swap in/out) and <code>top</code> shows high <code>%wa</code>. Fix: reduce the degree of multiprogramming or add RAM.</p>
<p><strong>Mechanism 2 &mdash; context-switch storm.</strong> Too many runnable threads with a small quantum, or heavy lock contention causing constant block/wake cycles. The CPU genuinely executes instructions, but a large share are scheduler and cache-reload work. Distinguishing signal: <code>vmstat 1</code> shows a very high <code>cs</code> column (tens or hundreds of thousands per second) with low <code>si</code>/<code>so</code>; <code>%sy</code> (system time) is high relative to <code>%us</code>. Fix: reduce thread count, use a pool sized to the cores, or fix the contended lock.</p>
<p>The two are told apart primarily by <strong>where the time goes</strong>: thrashing parks the CPU in iowait, a switch storm burns it in system time. A third possibility worth ruling out is a spinlock loop, which shows as high user time with no progress.</p></div></div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>A context switch saves the CPU state into the old PCB and loads it from the new one.</li><li>The direct cost is small; TLB flushes and cache pollution dominate the real cost.</li><li>Thread switches within one process are cheaper — the address space and page tables are shared.</li><li><code>/proc/&lt;pid&gt;/status</code> distinguishes voluntary from involuntary switches — a useful diagnostic.</li></ul></div>`
  },
  "m2l0": {
    mod: "MODULE 2 — CPU Scheduling",
    title: "Scheduling Concepts",
    level: "Beginner",
    time: "20 min",
    industry: "Core Concept",
    prev: "m1l2",
    next: "m2l1",
    content: `
<h2>The Fundamental Problem</h2>
<p>At any moment, there might be 50 processes in the <em>Ready</em> state. Only 4 CPU cores. Which 4 processes run? In what order? For how long? That's the CPU scheduler's job.</p>

<p>The scheduler makes these decisions constantly — potentially thousands of times per second.</p>

<h2>Scheduling Goals (They Conflict!)</h2>
<table>
  <tr><th>Metric</th><th>Definition</th><th>Who Benefits</th></tr>
  <tr><td><strong>CPU Utilisation</strong></td><td>% of time CPU is doing useful work</td><td>System owner</td></tr>
  <tr><td><strong>Throughput</strong></td><td>Processes completed per unit time</td><td>System owner</td></tr>
  <tr><td><strong>Turnaround Time</strong></td><td>Total time from submission to completion</td><td>Batch users</td></tr>
  <tr><td><strong>Waiting Time</strong></td><td>Total time spent in Ready queue</td><td>Interactive users</td></tr>
  <tr><td><strong>Response Time</strong></td><td>Time until first response (key for interactive)</td><td>Interactive users</td></tr>
  <tr><td><strong>Fairness</strong></td><td>Similar processes get similar CPU time</td><td>All users</td></tr>
</table>

<div class="callout warning">
These goals <strong>conflict with each other</strong>. Maximising throughput often means running long jobs without interruption (bad for response time). Maximising response time means frequent preemption (bad for throughput). All scheduler design is about choosing which trade-offs to make for your workload.
</div>

<h2>Preemptive vs Non-Preemptive</h2>
<p><strong>Non-preemptive (cooperative):</strong> A process runs until it voluntarily gives up the CPU (blocks on I/O, terminates, or yields). The scheduler only kicks in then.</p>
<p><strong>Preemptive:</strong> The OS can forcibly remove a process from the CPU using a timer interrupt, even if it's in the middle of running. All modern OSes are preemptive.</p>

<div class="callout analogy">
Non-preemptive scheduling is like a movie night where whoever is talking must finish their complete thought before anyone else can speak. Preemptive is like a moderator with a timer — after 2 minutes, you stop, no matter where you are, and the next person gets to talk.
</div>

<h2>When Does the Scheduler Run?</h2>
<p>The scheduler is invoked at these points:</p>
<ol>
  <li>A process terminates</li>
  <li>A process blocks (waiting for I/O, sleep, lock)</li>
  <li>A new process is created (maybe it should run immediately)</li>
  <li><strong>Timer interrupt fires</strong> (the preemption mechanism — hardware sends interrupt every ~4ms)</li>
  <li>An I/O completion wakes a blocked process (it might preempt the current runner)</li>
</ol>

<h2>Key Formula</h2>
<p>Before the algorithms, memorise these:</p>
<div class="diagram">
  <div class="d-title">Scheduling Metrics</div>
<span class="highlight">Arrival Time (AT)</span>  = when process enters the ready queue
<span class="highlight">Burst Time (BT)</span>    = how long the process needs the CPU
<span class="highlight">Completion Time (CT)</span> = when process finishes

<span class="highlight2">Turnaround Time (TAT)</span> = CT − AT
<span class="highlight2">Waiting Time (WT)</span>     = TAT − BT  (or: time in ready queue)
<span class="highlight2">Response Time</span>         = time of first CPU access − AT
</div>

<div class="quiz-section"><h3><span class="qico">◉</span> Check Your Understanding</h3>
<div class="quiz-q">
    <p>Which metric matters most for an interactive desktop application?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Throughput</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Response time</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. CPU utilisation</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Turnaround time</div></div>
    <div class="quiz-explain">Response time is the delay before a process produces its <em>first</em> output after a request. A user notices the lag between clicking and seeing something happen, not the total job duration. Throughput and utilisation matter to the machine&rsquo;s owner; turnaround matters for batch work.</div>
  </div>
<div class="quiz-q">
    <p>Given TAT = 26 ms and BT = 3 ms, what is the waiting time?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. 29 ms</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. 23 ms</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. 26 ms</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. 8.7 ms</div></div>
    <div class="quiz-explain">WT = TAT − BT = 26 − 3 = 23 ms. Turnaround is total time in the system; subtracting the time actually spent executing leaves the time spent queueing. Memorise the chain: CT → TAT = CT − AT → WT = TAT − BT.</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div>

<div class="practice"><h3><span class="pico">&#9998;</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied &mdash; check every digit.</p>
<div class="prob"><div class="prob-q"><span class="prob-n">1</span><div>A process set produces these results. Fill in the missing values.
<table class="calc"><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Completion</th><th>TAT</th><th>Waiting</th></tr>
<tr><td>P1</td><td>0</td><td>5</td><td>5</td><td>?</td><td>?</td></tr>
<tr><td>P2</td><td>1</td><td>3</td><td>8</td><td>?</td><td>?</td></tr>
<tr><td>P3</td><td>2</td><td>8</td><td>16</td><td>?</td><td>?</td></tr>
<tr><td>P4</td><td>3</td><td>2</td><td>18</td><td>?</td><td>?</td></tr></table></div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m2l0_p1')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m2l0_p1')">Show solution</button></div><div class="hint" id="h_m2l0_p1">TAT = Completion &minus; Arrival. WT = TAT &minus; Burst. Compute in that order, never the reverse.</div><div class="sol" id="s_m2l0_p1"><pre class="mini">P1: TAT = 5  - 0 = 5    WT = 5  - 5 = 0
P2: TAT = 8  - 1 = 7    WT = 7  - 3 = 4
P3: TAT = 16 - 2 = 14   WT = 14 - 8 = 6
P4: TAT = 18 - 3 = 15   WT = 15 - 2 = 13

Average TAT = (5 + 7 + 14 + 15) / 4 = <b>10.25 ms</b>
Average WT  = (0 + 4 + 6 + 13)  / 4 = <b>5.75 ms</b></pre>
<p>Sanity check: average WT should equal average TAT minus average burst. Average burst = (5+3+8+2)/4 = 4.5, and 10.25 &minus; 4.5 = 5.75. It matches, so the arithmetic is consistent.</p>
<p>Note P4 &mdash; a 2&nbsp;ms job that waited 13&nbsp;ms. Short jobs stuck behind long ones dominate the average, which is exactly what SJF and SRTF are designed to fix.</p></div></div>
<div class="prob"><div class="prob-q"><span class="prob-n">2</span><div>A scheduler maximises throughput. Another minimises response time. Explain why these goals conflict, and give a workload where each choice is clearly correct.</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m2l0_p2')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m2l0_p2')">Show solution</button></div><div class="hint" id="h_m2l0_p2">Consider what each goal implies about how often you preempt.</div><div class="sol" id="s_m2l0_p2"><p><strong>Why they conflict.</strong> Maximising throughput means minimising overhead, which means preempting as rarely as possible &mdash; let each job run to completion and avoid context-switch and cache-reload costs. Minimising response time means the opposite: preempt frequently so every process gets the CPU soon after becoming runnable. Every switch that improves responsiveness is work not spent on useful computation.</p>
<p><strong>Throughput wins &mdash; an overnight batch render farm.</strong> No user is waiting; a frame finishing at 03:14 rather than 03:12 is irrelevant. Use long quanta or non-preemptive scheduling, keep caches warm, and maximise frames per hour. Linux exposes this as <code>SCHED_BATCH</code>.</p>
<p><strong>Response time wins &mdash; an interactive desktop or a trading terminal.</strong> The user perceives any delay above roughly 100&nbsp;ms as lag. Here you accept 5&ndash;10% of the CPU going to switching overhead in exchange for the machine feeling immediate. A short quantum and aggressive preemption of wakers is correct.</p>
<p>Real systems refuse to choose globally. Linux keeps separate scheduling classes (<code>SCHED_BATCH</code> versus <code>SCHED_NORMAL</code>), and MLFQ infers the answer per process by watching whether it exhausts its quantum or blocks early &mdash; giving interactive work responsiveness and batch work throughput on the same machine.</p></div></div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>TAT = CT − AT. WT = TAT − BT. Response time = first CPU access − AT.</li><li>Scheduling goals genuinely conflict — throughput versus response time is the central tension.</li><li>All modern general-purpose OSes are preemptive, driven by a timer interrupt.</li></ul></div>`
  },
  "m2l1": {
    mod: "MODULE 2 — CPU Scheduling",
    title: "FCFS, SJF & SRTF",
    level: "Intermediate",
    time: "35 min",
    industry: "Algorithm Design",
    prev: "m2l0",
    next: "m2l2",
    content: `
<h2>Algorithm 1: FCFS — First Come First Served</h2>
<p>Simplest scheduler possible. The process that arrives first runs first. <strong>Non-preemptive.</strong></p>

<h3>Worked Example</h3>
<table>
  <tr><th>Process</th><th>Arrival Time</th><th>Burst Time</th></tr>
  <tr><td>P1</td><td>0</td><td>24 ms</td></tr>
  <tr><td>P2</td><td>1</td><td>3 ms</td></tr>
  <tr><td>P3</td><td>2</td><td>3 ms</td></tr>
</table>

<div class="diagram"><div class="d-title">Gantt Chart — FCFS</div>+-------------------------+----+----+
|            P1           | P2 | P3 |
+-------------------------+----+----+
0                         24   27   30</div>
<table class="calc"><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Completion</th><th>TAT</th><th>Waiting</th></tr><tr><td><strong>P1</strong></td><td>0</td><td>24</td><td>24</td><td>24</td><td>0</td></tr><tr><td><strong>P2</strong></td><td>1</td><td>3</td><td>27</td><td>26</td><td>23</td></tr><tr><td><strong>P3</strong></td><td>2</td><td>3</td><td>30</td><td>28</td><td>25</td></tr><tr class="tfoot"><td colspan="4">Average</td><td><strong>26.00</strong></td><td><strong>16.00</strong></td></tr></table>

<div class="callout deepdive">
<strong>How to read this:</strong> P2 arrives at t=1 but P1 holds the CPU until t=24.
So P2 waits 24 − 1 = 23 ms before it even starts. Waiting time is
<code>Turnaround − Burst</code>, which for P2 is 26 − 3 = 23 ms. Always compute
completion times from the Gantt chart first, then derive TAT and WT — never the reverse.
</div>

<div class="callout warning">
<strong>Convoy Effect:</strong> P2 and P3 are 3 ms jobs that waited 23 ms and 25 ms
because one 24 ms job arrived first. One long process holds up every short process behind it.
Average waiting time is <strong>16.00 ms</strong> — most of it pure queueing. This is FCFS's fatal flaw
for interactive systems.
</div>

<h2>Algorithm 2: SJF — Shortest Job First</h2>
<p>Run the process with the shortest burst time next. <strong>Non-preemptive.</strong> Provably optimal
for minimising average waiting time <em>when all processes are available at the same time</em>.</p>

<h3>Worked Example — all arrive at t=0</h3>
<table>
  <tr><th>Process</th><th>Arrival</th><th>Burst</th></tr>
  <tr><td>P1</td><td>0</td><td>6</td></tr>
  <tr><td>P2</td><td>0</td><td>8</td></tr>
  <tr><td>P3</td><td>0</td><td>7</td></tr>
  <tr><td>P4</td><td>0</td><td>3</td></tr>
</table>

<p>SJF picks in ascending burst order: P4(3) → P1(6) → P3(7) → P2(8).</p>
<div class="diagram"><div class="d-title">Gantt Chart — SJF</div>+----+-------+--------+---------+
| P4 |   P1  |   P3   |    P2   |
+----+-------+--------+---------+
0    3       9        16        24</div>
<table class="calc"><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Completion</th><th>TAT</th><th>Waiting</th></tr><tr><td><strong>P1</strong></td><td>0</td><td>6</td><td>9</td><td>9</td><td>3</td></tr><tr><td><strong>P2</strong></td><td>0</td><td>8</td><td>24</td><td>24</td><td>16</td></tr><tr><td><strong>P3</strong></td><td>0</td><td>7</td><td>16</td><td>16</td><td>9</td></tr><tr><td><strong>P4</strong></td><td>0</td><td>3</td><td>3</td><td>3</td><td>0</td></tr><tr class="tfoot"><td colspan="4">Average</td><td><strong>13.00</strong></td><td><strong>7.00</strong></td></tr></table>

<p>Average waiting time is <strong>7.00 ms</strong>. Compare: the same four jobs under FCFS
in arrival order P1→P2→P3→P4 would give avg WT
<strong>10.25 ms</strong>. SJF is a large win.</p>

<div class="callout warning">
<strong>The catch:</strong> we don't know burst times in advance. SJF requires knowing how long each
process will run — impossible in general. Two workarounds: (1) the user supplies an estimate
(batch systems), (2) predict from history via exponential averaging.
</div>

<h3>Predicting the Next Burst (Exponential Average)</h3>
<div class="code-block"><pre>tau(n+1) = alpha * t(n) + (1 - alpha) * tau(n)

  t(n)      = actual CPU burst duration of the nth burst
  tau(n)    = our prediction for the nth burst
  tau(n+1)  = prediction for the NEXT burst
  alpha     = weighting factor, 0 &lt;= alpha &lt;= 1

alpha = 0.5  -&gt; equal weight to recent burst and accumulated history  (typical)
alpha = 1    -&gt; only the most recent burst matters (no history)
alpha = 0    -&gt; prediction never updates (useless)

Worked: tau(0)=10, alpha=0.5, actual bursts 6, 4, 6, 4 ...
  tau(1) = 0.5*6  + 0.5*10 = 8.0
  tau(2) = 0.5*4  + 0.5*8  = 6.0
  tau(3) = 0.5*6  + 0.5*6  = 6.0
  tau(4) = 0.5*4  + 0.5*6  = 5.0</pre></div>

<h2>Algorithm 3: SRTF — Shortest Remaining Time First</h2>
<p>The <strong>preemptive</strong> version of SJF. Whenever a new process arrives, if its burst is
shorter than the <em>remaining</em> time of the running process, preempt.</p>

<h3>Worked Example</h3>
<table>
  <tr><th>Process</th><th>Arrival</th><th>Burst</th></tr>
  <tr><td>P1</td><td>0</td><td>8</td></tr>
  <tr><td>P2</td><td>1</td><td>4</td></tr>
  <tr><td>P3</td><td>2</td><td>9</td></tr>
  <tr><td>P4</td><td>3</td><td>5</td></tr>
</table>

<div class="code-block"><pre>t=0 : only P1 present            -&gt; P1 runs
t=1 : P2 arrives, burst 4 &lt; P1 remaining 7   -&gt; PREEMPT, P2 runs
t=2 : P3 arrives, burst 9 &gt; P2 remaining 3   -&gt; P2 continues
t=3 : P4 arrives, burst 5 &gt; P2 remaining 2   -&gt; P2 continues
t=5 : P2 finishes. Remaining: P1=7, P3=9, P4=5 -&gt; P4 runs (shortest)
t=10: P4 finishes. Remaining: P1=7, P3=9       -&gt; P1 runs
t=17: P1 finishes.                              -&gt; P3 runs
t=26: P3 finishes.</pre></div>

<div class="diagram"><div class="d-title">Gantt Chart — SRTF</div>+----+-----+------+--------+----------+
| P1 |  P2 |  P4  |   P1   |    P3    |
+----+-----+------+--------+----------+
0    1     5      10       17         26</div>
<table class="calc"><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Completion</th><th>TAT</th><th>Waiting</th></tr><tr><td><strong>P1</strong></td><td>0</td><td>8</td><td>17</td><td>17</td><td>9</td></tr><tr><td><strong>P2</strong></td><td>1</td><td>4</td><td>5</td><td>4</td><td>0</td></tr><tr><td><strong>P3</strong></td><td>2</td><td>9</td><td>26</td><td>24</td><td>15</td></tr><tr><td><strong>P4</strong></td><td>3</td><td>5</td><td>10</td><td>7</td><td>2</td></tr><tr class="tfoot"><td colspan="4">Average</td><td><strong>13.00</strong></td><td><strong>6.50</strong></td></tr></table>

<p>Average waiting time <strong>6.50 ms</strong>, versus
<strong>7.75 ms</strong> for non-preemptive SJF on the same set.
Preemption buys a real improvement — at the cost of more context switches.</p>

<div class="callout industry-note">
<strong>What Linux actually does today.</strong> Linux used the <strong>Completely Fair Scheduler (CFS)</strong>
from 2007 (kernel 2.6.23) until <strong>kernel 6.6 (October 2023)</strong>, when CFS was replaced by
<strong>EEVDF</strong> — Earliest Eligible Virtual Deadline First. EEVDF keeps CFS's red-black tree
and virtual runtime, but instead of always picking the smallest vruntime it computes a
<em>lag</em> (service owed) per task and picks the <em>eligible</em> task with the earliest virtual
deadline. Latency-sensitive tasks request smaller slices, get earlier deadlines, and so preempt
sooner — which is what the old <code>latency_nice</code> patches were trying to achieve. The main
tunable is now <code>/sys/kernel/debug/sched/base_slice_ns</code>. SJF/SRTF principles survive in
I/O schedulers and database query planners far more than in CPU scheduling.
</div>

<div class="quiz-section"><h3><span class="qico">◉</span> Check Your Understanding</h3>
<div class="quiz-q">
    <p>Three processes all arrive at t=0: P1(BT=10), P2(BT=2), P3(BT=5). What is the average waiting time under non-preemptive SJF?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. 2.33 ms</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. 3 ms</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. 4.33 ms</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. 5.67 ms</div></div>
    <div class="quiz-explain">SJF runs shortest first: P2(0→2), P3(2→7), P1(7→17). Waiting times are the start times here because all arrive at 0: P2=0, P3=2, P1=7. Average = (0+2+7)/3 = <strong>3 ms</strong>. Note the average turnaround is different: (2+7+17)/3 = 8.67 ms — do not confuse the two.</div>
  </div>
<div class="quiz-q">
    <p>Under SRTF, when is the scheduler forced to make a decision?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Only when a process terminates</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Only when the time quantum expires</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Whenever a process arrives or the running process finishes</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. At fixed 10 ms intervals</div></div>
    <div class="quiz-explain">SRTF is event-driven, not quantum-driven. A new arrival may have a shorter burst than the remaining time of the running process, so every arrival is a potential preemption point. Completion is the other decision point. There is no fixed quantum — that is Round Robin.</div>
  </div>
<div class="quiz-q">
    <p>Why is SJF described as "provably optimal" yet almost never used as-is for CPU scheduling?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. It causes too many context switches</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Burst times are not knowable in advance</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. It violates mutual exclusion</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. It only works on single-core systems</div></div>
    <div class="quiz-explain">The optimality proof (exchange argument: swapping a longer job ahead of a shorter one never decreases total waiting time) is sound. The obstacle is purely practical — the scheduler cannot know a process&rsquo;s next burst length. Real schedulers either estimate it (exponential averaging) or sidestep the problem entirely (MLFQ learns behaviour; EEVDF uses proportional share).</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div>

<div class="practice"><h3><span class="pico">✎</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied — check every digit.</p>
<div class="prob">
  <div class="prob-q"><span class="prob-n">1</span><div>Given the following process set, draw the Gantt chart and compute average TAT and average WT under <strong>FCFS</strong>.
  <table><tr><th>Process</th><th>Arrival</th><th>Burst</th></tr>
  <tr><td>P1</td><td>0</td><td>7</td></tr><tr><td>P2</td><td>2</td><td>4</td></tr>
  <tr><td>P3</td><td>4</td><td>1</td></tr><tr><td>P4</td><td>5</td><td>4</td></tr></table></div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m2l1_p1')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m2l1_p1')">Show solution</button></div>
  <div class="hint" id="h_m2l1_p1">FCFS ignores burst length entirely. Order strictly by arrival time: P1, P2, P3, P4. The CPU is never idle here because each next process has already arrived by the time the previous one ends.</div>
  <div class="sol" id="s_m2l1_p1"><div class="diagram"><div class="d-title">FCFS</div>+--------+-----+----+-----+
|   P1   |  P2 | P3 |  P4 |
+--------+-----+----+-----+
0        7     11   12    16</div><table class="calc"><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Completion</th><th>TAT</th><th>Waiting</th></tr><tr><td><strong>P1</strong></td><td>0</td><td>7</td><td>7</td><td>7</td><td>0</td></tr><tr><td><strong>P2</strong></td><td>2</td><td>4</td><td>11</td><td>9</td><td>5</td></tr><tr><td><strong>P3</strong></td><td>4</td><td>1</td><td>12</td><td>8</td><td>7</td></tr><tr><td><strong>P4</strong></td><td>5</td><td>4</td><td>16</td><td>11</td><td>7</td></tr><tr class="tfoot"><td colspan="4">Average</td><td><strong>8.75</strong></td><td><strong>4.75</strong></td></tr></table><p>Average TAT = <strong>8.75 ms</strong>, Average WT = <strong>4.75 ms</strong>.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">2</span><div>Same process set. Now compute <strong>non-preemptive SJF</strong>. Does it beat FCFS, and by how much?</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m2l1_p2')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m2l1_p2')">Show solution</button></div>
  <div class="hint" id="h_m2l1_p2">At t=0 only P1 is available, so P1 must run 0→7 regardless. The interesting decision happens at t=7, when P2, P3 and P4 have all arrived — pick the shortest burst among them.</div>
  <div class="sol" id="s_m2l1_p2"><div class="diagram"><div class="d-title">SJF (non-preemptive)</div>+--------+----+-----+-----+
|   P1   | P3 |  P2 |  P4 |
+--------+----+-----+-----+
0        7    8     12    16</div><table class="calc"><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Completion</th><th>TAT</th><th>Waiting</th></tr><tr><td><strong>P1</strong></td><td>0</td><td>7</td><td>7</td><td>7</td><td>0</td></tr><tr><td><strong>P2</strong></td><td>2</td><td>4</td><td>12</td><td>10</td><td>6</td></tr><tr><td><strong>P3</strong></td><td>4</td><td>1</td><td>8</td><td>4</td><td>3</td></tr><tr><td><strong>P4</strong></td><td>5</td><td>4</td><td>16</td><td>11</td><td>7</td></tr><tr class="tfoot"><td colspan="4">Average</td><td><strong>8.00</strong></td><td><strong>4.00</strong></td></tr></table><p>Average WT = <strong>4.00 ms</strong> versus FCFS <strong>4.75 ms</strong> — an improvement of 0.75 ms per process. P3 (burst 1) is served immediately after P1 instead of queueing behind P2.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">3</span><div>Same process set under <strong>SRTF</strong>. Compare all three algorithms and explain the ranking.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m2l1_p3')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m2l1_p3')">Show solution</button></div>
  <div class="hint" id="h_m2l1_p3">Check for a preemption at t=2: P2 arrives with burst 4, while P1 has 5 remaining. 4 < 5, so P1 is preempted.</div>
  <div class="sol" id="s_m2l1_p3"><div class="diagram"><div class="d-title">SRTF</div>+----+----+----+----+-----+------+
| P1 | P2 | P3 | P2 |  P4 |  P1  |
+----+----+----+----+-----+------+
0    2    4    5    7     11     16</div><table class="calc"><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Completion</th><th>TAT</th><th>Waiting</th></tr><tr><td><strong>P1</strong></td><td>0</td><td>7</td><td>16</td><td>16</td><td>9</td></tr><tr><td><strong>P2</strong></td><td>2</td><td>4</td><td>7</td><td>5</td><td>1</td></tr><tr><td><strong>P3</strong></td><td>4</td><td>1</td><td>5</td><td>1</td><td>0</td></tr><tr><td><strong>P4</strong></td><td>5</td><td>4</td><td>11</td><td>6</td><td>2</td></tr><tr class="tfoot"><td colspan="4">Average</td><td><strong>7.00</strong></td><td><strong>3.00</strong></td></tr></table>
<p>Ranking by average waiting time: SRTF <strong>3.00</strong> &lt; SJF <strong>4.00</strong> &lt; FCFS <strong>4.75</strong> ms.</p>
<p>SRTF wins because preemption lets short jobs (P3, burst 1) cut ahead of a long job that is already running. SJF cannot do this — once P1 starts it runs to completion. FCFS is worst because it cannot reorder at all. The cost SRTF pays is invisible in these numbers: extra context switches, each with the TLB and cache penalty from Module 1.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">4</span><div><strong>Conceptual.</strong> A process has predicted burst τ(0) = 10 ms and α = 0.5. Its next four actual bursts are 6, 4, 6, 4 ms. Compute τ(1) through τ(4). What happens to the prediction if α is set to 0?</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m2l1_p4')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m2l1_p4')">Show solution</button></div>
  <div class="hint" id="h_m2l1_p4">Apply τ(n+1) = α·t(n) + (1−α)·τ(n) repeatedly. For the second part, substitute α = 0 into the formula and see which term survives.</div>
  <div class="sol" id="s_m2l1_p4"><div class="code-block"><pre>tau(1) = 0.5*6 + 0.5*10 = 3 + 5   = 8.0 ms
tau(2) = 0.5*4 + 0.5*8  = 2 + 4   = 6.0 ms
tau(3) = 0.5*6 + 0.5*6  = 3 + 3   = 6.0 ms
tau(4) = 0.5*4 + 0.5*6  = 2 + 3   = 5.0 ms</pre></div><p>With <strong>α = 0</strong> the formula collapses to τ(n+1) = τ(n): the prediction is frozen at its initial value forever and never learns from observed behaviour. With α = 1 it collapses to τ(n+1) = t(n), pure last-value prediction with no smoothing — jumpy and over-reactive to a single unusual burst.</p></div>
</div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>Always build the Gantt chart first; derive CT → TAT = CT − AT → WT = TAT − BT from it.</li><li>FCFS is simple and starvation-free but suffers the convoy effect.</li><li>SJF minimises average waiting time but needs unknowable future information.</li><li>SRTF is preemptive SJF — better averages, more context switches, and it can starve long jobs.</li><li>Linux replaced CFS with <strong>EEVDF in kernel 6.6 (2023)</strong>; neither is SJF-based.</li></ul></div>`
  },
  "m2l2": {
    mod: "MODULE 2 — CPU Scheduling",
    title: "Round Robin & Multilevel Queues",
    level: "Intermediate",
    time: "40 min",
    industry: "Production Systems",
    prev: "m2l1",
    next: "m2l3",
    content: `
<h2>Round Robin (RR) — The Basis of Interactive Systems</h2>
<p>Each process gets a fixed slice of CPU called a <strong>time quantum</strong> (typically 4–100 ms).
When the quantum expires the process is preempted and moved to the <em>back</em> of the ready queue.
RR is essentially FCFS plus preemption.</p>

<div class="callout analogy">
Round Robin is taking turns at a buffet. Everyone gets 2 minutes at the counter, then steps to the
back of the line. Nobody starves, nobody monopolises — but if the line is long you get served
in small doses rather than all at once.
</div>

<h3>Worked Example — quantum = 4 ms</h3>
<table>
  <tr><th>Process</th><th>Arrival</th><th>Burst</th></tr>
  <tr><td>P1</td><td>0</td><td>24</td></tr>
  <tr><td>P2</td><td>0</td><td>3</td></tr>
  <tr><td>P3</td><td>0</td><td>3</td></tr>
</table>

<div class="diagram"><div class="d-title">Gantt Chart — Round Robin (q = 4)</div>+-----+----+----+---------------------+
|  P1 | P2 | P3 |          P1         |
+-----+----+----+---------------------+
0     4    7    10                    30</div>
<table class="calc"><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Completion</th><th>TAT</th><th>Waiting</th></tr><tr><td><strong>P1</strong></td><td>0</td><td>24</td><td>30</td><td>30</td><td>6</td></tr><tr><td><strong>P2</strong></td><td>0</td><td>3</td><td>7</td><td>7</td><td>4</td></tr><tr><td><strong>P3</strong></td><td>0</td><td>3</td><td>10</td><td>10</td><td>7</td></tr><tr class="tfoot"><td colspan="4">Average</td><td><strong>15.67</strong></td><td><strong>5.67</strong></td></tr></table>

<p>P2 and P3 need only 3 ms, less than the 4 ms quantum, so they release the CPU voluntarily and
finish early. P1 is then left alone and runs its remaining slices back to back.</p>

<div class="callout deepdive">
<strong>Response time is the point.</strong> Under FCFS this same workload gives P2 a waiting time of
21 ms. Under RR it is 4 ms. Average waiting time is actually similar or slightly worse under RR
(5.67 ms here) — <em>RR does not optimise average waiting time.</em> It optimises how quickly
every process gets its <em>first</em> taste of CPU, which is what makes a machine feel responsive.
</div>

<h3>Choosing the Quantum — a Real Trade-off</h3>
<p>Same four processes — P1(5), P2(3), P3(6), P4(2), arriving at t = 0,1,2,3 — scheduled at four
different quanta. Every figure below is computed, not estimated:</p>

<table class="calc">
  <tr><th>Quantum</th><th>Avg Waiting</th><th>Avg Turnaround</th><th>CPU segments (≈ switches)</th></tr>
  <tr><td><strong>1 ms</strong></td><td>6.50 ms</td><td>10.50 ms</td><td>13</td></tr><tr><td><strong>2 ms</strong></td><td>7.25 ms</td><td>11.25 ms</td><td>8</td></tr><tr><td><strong>4 ms</strong></td><td>7.00 ms</td><td>11.00 ms</td><td>5</td></tr><tr><td><strong>8 ms</strong></td><td>5.25 ms</td><td>9.25 ms</td><td>3</td></tr>
</table>

<p>As the quantum grows, the number of context switches falls and average waiting time generally
improves — but responsiveness degrades, because a newly arrived interactive process may now wait
a full long quantum behind each queued process. At q = 8 no process is ever preempted at all: RR
has silently <strong>degenerated into FCFS</strong>.</p>

<div class="diagram"><div class="d-title">q = 1 (maximum preemption)</div>+----+----+----+----+----+----+----+----+----+----+----+----+----+----+
| P1 | P2 | P1 | P3 | P2 | P4 | P1 | P3 | P2 | P4 | P1 | P3 | P1 | P3 |
+----+----+----+----+----+----+----+----+----+----+----+----+----+----+
0    1    2    3    4    5    6    7    8    9    10   11   12   13   16</div>
<div class="diagram"><div class="d-title">q = 8 (degenerates to FCFS)</div>+------+----+-------+----+
|  P1  | P2 |   P3  | P4 |
+------+----+-------+----+
0      5    8       14   16</div>

<div class="code-block"><pre>Rule of thumb used in practice:

  quantum &gt;&gt; context-switch cost      (else overhead dominates)
  quantum &lt;= typical interactive burst (else responsiveness suffers)

If a context switch costs 10 microseconds and the quantum is 10 ms,
overhead is 0.1% -- acceptable.
If the quantum were 100 microseconds, overhead would be 10% -- unacceptable.

Classic guidance: ~80% of CPU bursts should be SHORTER than the quantum.</pre></div>

<h2>Priority Scheduling</h2>
<p>Every process carries a priority number; the scheduler always picks the highest priority
runnable process. Can be preemptive or non-preemptive. (Convention here: <strong>lower number =
higher priority</strong>, as in most textbooks and in Linux's internal priority values.)</p>

<h3>Worked Example — non-preemptive</h3>
<table>
  <tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Priority</th></tr>
  <tr><td>P1</td><td>0</td><td>10</td><td>3</td></tr>
  <tr><td>P2</td><td>1</td><td>1</td><td>1</td></tr>
  <tr><td>P3</td><td>2</td><td>2</td><td>4</td></tr>
  <tr><td>P4</td><td>3</td><td>1</td><td>5</td></tr>
  <tr><td>P5</td><td>4</td><td>5</td><td>2</td></tr>
</table>

<div class="diagram"><div class="d-title">Gantt Chart — Priority (non-preemptive, low number = high priority)</div>+-----------+----+------+----+----+
|     P1    | P2 |  P5  | P3 | P4 |
+-----------+----+------+----+----+
0           10   11     16   18   19</div>
<table class="calc"><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Completion</th><th>TAT</th><th>Waiting</th></tr><tr><td><strong>P1</strong></td><td>0</td><td>10</td><td>10</td><td>10</td><td>0</td></tr><tr><td><strong>P2</strong></td><td>1</td><td>1</td><td>11</td><td>10</td><td>9</td></tr><tr><td><strong>P3</strong></td><td>2</td><td>2</td><td>18</td><td>16</td><td>14</td></tr><tr><td><strong>P4</strong></td><td>3</td><td>1</td><td>19</td><td>16</td><td>15</td></tr><tr><td><strong>P5</strong></td><td>4</td><td>5</td><td>16</td><td>12</td><td>7</td></tr><tr class="tfoot"><td colspan="4">Average</td><td><strong>12.80</strong></td><td><strong>9.00</strong></td></tr></table>

<p>P1 starts at t=0 as the only runnable process and, being non-preemptive, keeps the CPU until
t=10 even though higher-priority P2 and P5 arrive meanwhile. After that the queue is drained
strictly by priority: P2(1) → P5(2) → P3(4) → P4(5).</p>

<div class="callout warning">
<strong>Starvation.</strong> A low-priority process may never run if higher-priority work keeps arriving.
The classic fix is <strong>aging</strong>: increase a process's priority the longer it waits. Legend has it
an IBM 7094 shut down at MIT in 1973 still had a job from 1967 queued and never run.
</div>

<div class="callout deepdive">
<strong>Priority inversion</strong> is the subtler danger. A high-priority task H waits on a mutex held by
a low-priority task L; a medium-priority task M then preempts L, so H is effectively blocked by M —
an inversion of the intended order. This bug nearly ended the <strong>Mars Pathfinder</strong> mission in 1997:
the lander kept resetting until JPL remotely enabled <em>priority inheritance</em>, which temporarily
boosts L to H's priority while it holds the lock.
</div>

<h2>Multilevel Queue Scheduling</h2>
<p>Processes are <strong>permanently</strong> assigned to one queue by type. Each queue has its own
algorithm; the scheduler picks which queue to serve.</p>

<div class="diagram"><div class="d-title">Multilevel Queue</div>+-----------------------------------------------+
| QUEUE 1: System / kernel threads              |  highest priority
|          algorithm: FCFS                      |
+-----------------------------------------------+
| QUEUE 2: Interactive (browser, terminal, UI)  |  high
|          algorithm: Round Robin, small q      |
+-----------------------------------------------+
| QUEUE 3: Interactive batch (editors, compile) |  medium
|          algorithm: Round Robin, large q      |
+-----------------------------------------------+
| QUEUE 4: Batch (encoding, backup, ML training)|  low
|          algorithm: FCFS                      |
+-----------------------------------------------+

Strict priority between queues:
  Queue 1 must be EMPTY before Queue 2 is served, and so on.
  =&gt; Queues 3 and 4 can starve. Some systems instead give each
     queue a guaranteed CPU share (e.g. 60/30/10 percent).</div>

<h2>Multilevel Feedback Queue (MLFQ)</h2>
<p>The practical refinement: processes <strong>move between</strong> queues based on observed behaviour.
MLFQ does not need to know burst times in advance — it <em>learns</em> them.</p>

<ol>
  <li>A new process enters the <strong>highest</strong> priority queue.</li>
  <li>If it uses its entire quantum without blocking → <strong>demote</strong> it (it is CPU-bound).</li>
  <li>If it blocks before the quantum expires → keep its level (it is I/O-bound / interactive).</li>
  <li>Periodically <strong>boost every process</strong> back to the top queue to prevent starvation and to
      handle processes that change behaviour partway through.</li>
</ol>

<div class="code-block"><pre>Why rule 4 matters -- two classic MLFQ attacks:

GAMING: a process issues a pointless I/O just before its quantum expires,
        so it never gets demoted and hogs high priority forever.
        Fix: account CPU time cumulatively across the whole queue level,
             not per-quantum (&quot;better accounting&quot;).

CHANGED BEHAVIOUR: a long compile (CPU-bound, demoted to the bottom)
        finishes and the process becomes interactive -- but it is stuck
        in the lowest queue.
        Fix: periodic priority boost of ALL processes to the top queue.</pre></div>

<div class="callout industry-note">
<strong>Who actually uses what.</strong> <strong>Windows</strong> uses a genuine 32-level priority scheme with
boosting and aging — a real MLFQ. <strong>macOS</strong> uses a similar multi-level scheme.
<strong>Linux is the exception:</strong> its normal-class scheduler is <em>not</em> an MLFQ. CFS used a single
red-black tree keyed on virtual runtime, and since kernel 6.6 <strong>EEVDF</strong> uses lag plus virtual
deadlines. Both are <em>proportional-share</em> designs, not multi-queue ones. Linux does keep
separate scheduling <em>classes</em> (SCHED_FIFO and SCHED_RR for real-time, then SCHED_NORMAL,
SCHED_BATCH, SCHED_IDLE) which are consulted in strict order — but that is a class hierarchy,
not feedback-driven queue demotion. <code>nice -n 10 ./backup.sh</code> adjusts weight within
SCHED_NORMAL; it does not move the process to a different queue.
</div>

<div class="quiz-section"><h3><span class="qico">◉</span> Check Your Understanding</h3>
<div class="quiz-q">
    <p>A Round Robin scheduler has a 4 ms quantum and a context switch costs 0.2 ms. What fraction of CPU time is lost to switching, assuming every process uses its full quantum?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. About 0.2%</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. About 5%</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. About 20%</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. None — switches are free</div></div>
    <div class="quiz-explain">Each cycle is 4 ms of useful work plus 0.2 ms of overhead = 4.2 ms total. Overhead fraction = 0.2 / 4.2 ≈ 4.8%, so about 5%. Halving the quantum to 2 ms would roughly double this to ~9%. This is exactly why very small quanta are impractical.</div>
  </div>
<div class="quiz-q">
    <p>Under Round Robin, what happens as the quantum grows very large?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. It behaves like SJF</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. It behaves like FCFS</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. It behaves like priority scheduling</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Average waiting time approaches zero</div></div>
    <div class="quiz-explain">If the quantum exceeds every process&rsquo;s burst time, no process is ever preempted — each simply runs to completion in arrival order. That is precisely FCFS. You can see this above at q = 8, where the Gantt chart has no preemption at all.</div>
  </div>
<div class="quiz-q">
    <p>Which statement about the Linux scheduler is correct as of kernel 6.6 and later?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Linux uses a 32-level multilevel feedback queue</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Linux uses CFS, which is an MLFQ variant</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Linux uses EEVDF, a proportional-share scheduler that replaced CFS</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Linux uses SRTF for all normal processes</div></div>
    <div class="quiz-explain">EEVDF (Earliest Eligible Virtual Deadline First) replaced CFS in kernel 6.6, released October 2023. Both are proportional-share designs built on a red-black tree of virtual runtimes — neither is a multilevel feedback queue. Windows is the mainstream OS that genuinely uses a 32-level MLFQ.</div>
  </div>
<div class="quiz-q">
    <p>A high-priority thread H blocks on a mutex held by low-priority thread L. Medium-priority thread M, which needs no locks, then becomes runnable and preempts L. What is this called, and what is the standard fix?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Deadlock; fix with the Banker&rsquo;s algorithm</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Priority inversion; fix with priority inheritance</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Convoy effect; fix with a larger quantum</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Thrashing; fix by adding RAM</div></div>
    <div class="quiz-explain">H is blocked by M despite outranking it — priority inversion. Priority inheritance temporarily raises L to H&rsquo;s priority for as long as L holds the lock, so M cannot preempt it. This is the fix JPL uploaded to Mars Pathfinder in 1997.</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div>

<div class="practice"><h3><span class="pico">✎</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied — check every digit.</p>
<div class="prob">
  <div class="prob-q"><span class="prob-n">1</span><div>Processes P1(BT=5, AT=0), P2(BT=3, AT=1), P3(BT=6, AT=2), P4(BT=2, AT=3).
 Draw the Gantt chart and compute average waiting time under Round Robin with <strong>q = 2</strong>.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m2l2_p1')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m2l2_p1')">Show solution</button></div>
  <div class="hint" id="h_m2l2_p1">Maintain the ready queue explicitly as a list. The subtle part: when a process is preempted at time t, any process that <em>arrived</em> at or before t joins the queue <em>before</em> the preempted process re-joins the back.</div>
  <div class="sol" id="s_m2l2_p1"><div class="diagram"><div class="d-title">RR, q = 2</div>+----+----+----+----+----+----+----+----+----+
| P1 | P2 | P3 | P1 | P4 | P2 | P3 | P1 | P3 |
+----+----+----+----+----+----+----+----+----+
0    2    4    6    8    10   11   13   14   16</div><p>Average waiting time = <strong>7.25 ms</strong>, average turnaround = <strong>11.25 ms</strong>, with 8 CPU segment boundaries.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">2</span><div>Repeat the same process set with <strong>q = 4</strong>. Which quantum gave a better average waiting time, and does that make the larger quantum strictly better?</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m2l2_p2')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m2l2_p2')">Show solution</button></div>
  <div class="hint" id="h_m2l2_p2">Compute both, then think about what average waiting time does NOT capture — specifically, how long a newly arrived process waits before its first CPU access.</div>
  <div class="sol" id="s_m2l2_p2"><div class="diagram"><div class="d-title">RR, q = 4</div>+-----+----+-----+----+----+----+
|  P1 | P2 |  P3 | P4 | P1 | P3 |
+-----+----+-----+----+----+----+
0     4    7     11   13   14   16</div>
<p>q=4 gives average WT <strong>7.00 ms</strong> versus <strong>7.25 ms</strong> at q=2, and needs fewer switches (5 segments versus 8).</p>
<p>But larger is not strictly better. Average WT hides <em>response time</em> — the delay before a process first touches the CPU. With a big quantum, an interactive process arriving behind two compute-bound jobs waits up to two full quanta before its first response. On a desktop that is felt directly as lag. This is why real systems pick a quantum in the 4–100 ms band rather than maximising it.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">3</span><div><strong>Priority + starvation.</strong> Using the priority table from the worked example above, suppose a new
 priority-1 process arrives every 3 ms, each with a 2 ms burst. What happens to P4 (priority 5), and what
 mechanism prevents it?</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m2l2_p3')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m2l2_p3')">Show solution</button></div>
  <div class="hint" id="h_m2l2_p3">Ask whether the ready queue ever empties of priority-1 work. Compare the arrival rate (one job per 3 ms) against the service demand (2 ms of CPU per job).</div>
  <div class="sol" id="s_m2l2_p3"><p>The priority-1 stream consumes 2 ms of CPU every 3 ms, so it never fully drains, and a strict priority scheduler always prefers it. P4 at priority 5 is <strong>starved indefinitely</strong> — it may never run despite needing only 1 ms.</p>
<p>The fix is <strong>aging</strong>: raise a waiting process&rsquo;s priority as its wait time grows. For example, promote by one level per 500 ms of waiting. P4 would climb 5 → 4 → 3 → 2 → 1 within about 2 seconds and then be scheduled. Aging converts a starvation-prone scheduler into a merely unfair one, which is an acceptable trade.</p>
<p>Note this is <em>starvation</em>, not deadlock: the system is making progress the whole time, one particular process is just never selected. See Module 4 for the full distinction.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">4</span><div><strong>Design question.</strong> You are tuning an MLFQ for a machine that runs both a nightly
 database backup and an interactive IDE. Describe how each process ends up in a different queue,
 and identify one way the backup could cheat its way into the top queue.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m2l2_p4')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m2l2_p4')">Show solution</button></div>
  <div class="hint" id="h_m2l2_p4">Think about what each workload does when it gets the CPU: does it exhaust its quantum, or block early on I/O?</div>
  <div class="sol" id="s_m2l2_p4"><p>The IDE is <strong>I/O-bound</strong>: it runs a millisecond or two reacting to a keystroke, then blocks waiting for the next one. Because it blocks before its quantum expires, MLFQ keeps it at high priority — exactly right, since it needs fast response and little total CPU.</p>
<p>The backup is <strong>CPU-bound</strong>: it consumes every full quantum it is given, so MLFQ demotes it step by step to the bottom queue. It still makes steady progress whenever no interactive work is pending, but it never delays the IDE.</p>
<p><strong>The cheat:</strong> if the backup issues a token I/O operation just before each quantum expires, it appears interactive and is never demoted — it retains top priority while consuming nearly all the CPU. The defence is cumulative accounting: track total CPU consumed at a given priority level across all quanta, and demote once the budget is exhausted regardless of how the process yields.</p></div>
</div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>RR optimises <em>response</em> time, not average waiting time.</li><li>Quantum too small → switching overhead dominates; too large → RR degenerates into FCFS.</li><li>Priority scheduling risks <strong>starvation</strong> (fix: aging) and <strong>priority inversion</strong> (fix: priority inheritance).</li><li>MLFQ learns whether a process is interactive or CPU-bound instead of being told.</li><li>Windows uses a real 32-level MLFQ; <strong>Linux does not</strong> — it uses proportional share (CFS, then EEVDF since 6.6).</li></ul></div>`
  },
  "m2l3": {
    mod: "MODULE 2 — CPU Scheduling",
    title: "Real-Time & Multiprocessor Scheduling",
    level: "Advanced",
    time: "40 min",
    industry: "Systems Engineering",
    prev: "m2l2",
    next: "m3l0",
    content: `
<h2>A Different Kind of Correctness</h2>
<p>Every scheduler so far optimised an <em>average</em> &mdash; mean waiting time, mean turnaround,
throughput. A real-time scheduler optimises nothing of the sort. It has one job: make sure every
task finishes before its <strong>deadline</strong>. A result that is correct but late is simply wrong.</p>

<p>Real-time tasks are usually <strong>periodic</strong>, described by two numbers:</p>

<div class="code-block"><pre>A periodic real-time task is described by:

  C  = worst-case compute time per activation
  T  = period -- how often it is released
  D  = deadline (very commonly D = T, assumed throughout)

  utilisation of one task  = C / T
  total utilisation U      = sum of all C / T

Example: a task needing 2 ms of CPU every 10 ms
  C = 2, T = 10, utilisation = 0.2 (20% of one core)

The scheduling question is no longer &quot;what is the average wait?&quot;
but &quot;can EVERY task always finish within T?&quot;.</pre></div>

<h2>Rate Monotonic Scheduling (RMS)</h2>
<p><strong>Static</strong> priorities assigned once, before the system runs: <em>the shorter the period,
the higher the priority.</em> That is the entire rule. Preemptive, simple enough to implement in a
few hundred bytes of firmware, and provably optimal among all fixed-priority schemes &mdash; if any
static assignment can meet the deadlines, rate monotonic can.</p>

<h3>The Liu &amp; Layland Bound</h3>
<p>RMS comes with a famous <em>sufficient</em> schedulability test. For <em>n</em> tasks, if total CPU
utilisation stays under n(2<sup>1/n</sup> &minus; 1), the set is guaranteed schedulable:</p>

<table class="calc">
  <tr><th>Tasks (n)</th><th>Utilisation bound</th><th>As %</th></tr>
  <tr><td>1</td><td>1.0000</td><td>100.0%</td></tr><tr><td>2</td><td>0.8284</td><td>82.8%</td></tr><tr><td>3</td><td>0.7798</td><td>78.0%</td></tr><tr><td>4</td><td>0.7568</td><td>75.7%</td></tr><tr><td>5</td><td>0.7435</td><td>74.3%</td></tr><tr><td>10</td><td>0.7177</td><td>71.8%</td></tr>
  <tr class="tfoot"><td>n &rarr; &infin;</td><td>ln 2 = 0.6931</td><td>69.3%</td></tr>
</table>

<div class="callout warning">
<strong>The test is sufficient, not necessary.</strong> Failing it does <em>not</em> prove the task set
is unschedulable &mdash; it only means the simple bound cannot prove that it is. Many sets above
69% run perfectly under RMS; you then have to check by exact analysis or simulation. But if you
pass the bound, no further work is needed.
</div>

<h3>Worked Example &mdash; a set that passes</h3>
<table>
  <tr><th>Task</th><th>Compute time C</th><th>Period T (= deadline)</th><th>Utilisation C/T</th></tr>
  <tr><td>T1</td><td>1</td><td>4</td><td>0.250</td></tr>
  <tr><td>T2</td><td>2</td><td>6</td><td>0.333</td></tr>
  <tr><td>T3</td><td>1</td><td>12</td><td>0.083</td></tr>
</table>

<p>Total U = <strong>0.6667</strong>, and the bound for 3 tasks is <strong>0.7798</strong>.
Since 0.6667 &le; 0.7798 the set is <strong class="good">guaranteed schedulable</strong>.
RMS priority order follows the periods: T1 (4) &gt; T2 (6) &gt; T3 (12).</p>

<p>Simulating one full hyperperiod (LCM of 4, 6, 12 = 12):</p>
<div class="diagram"><div class="d-title">RMS schedule, hyperperiod 0&ndash;12</div>+----+----+----+----+----+----+----+----+
| T1 | T2 | T3 | T1 | -- | T2 | T1 | -- |
+----+----+----+----+----+----+----+----+
0    1    3    4    5    6    8    9    12</div>
<p>Deadlines missed: <strong class="good">none</strong>. Note the idle slots at t=5 and t=9 &mdash;
the processor has 33% headroom, exactly as the utilisation figure predicted.</p>

<h2>Earliest Deadline First (EDF)</h2>
<p><strong>Dynamic</strong> priorities, recomputed continuously: whichever task has the nearest
<em>absolute</em> deadline runs now. EDF is optimal among <em>all</em> scheduling algorithms on one
processor, and its test is as simple as it gets &mdash; <strong>U &le; 1.0</strong>. If the work fits in
the available CPU time at all, EDF will schedule it.</p>

<h3>Where RMS Fails and EDF Succeeds</h3>
<table>
  <tr><th>Task</th><th>C</th><th>T</th><th>C/T</th></tr>
  <tr><td>T1</td><td>2</td><td>5</td><td>0.400</td></tr>
  <tr><td>T2</td><td>4</td><td>7</td><td>0.571</td></tr>
</table>

<p>U = <strong>0.9714</strong>. The RMS bound for 2 tasks is <strong>0.8284</strong>, so
0.9714 &gt; 0.8284 &mdash; the bound is exceeded and gives no guarantee. But U &le; 1, so EDF
guarantees success. Simulating both over 35 time units:</p>

<div class="diagram"><div class="d-title">RMS &mdash; T1 always wins, T2 starves</div>+----+----+----+----+----+----+----+----+----+----+----+----+----+----+----+----+----+
| T1 | T2 | T1 | T2 | T1 | T2 | -- | T2 | T1 | T2 | T1 | T2 | T1 | T2 | T1 | T2 | -- |
+----+----+----+----+----+----+----+----+----+----+----+----+----+----+----+----+----+
0    2    5    7    10   12   13   14   15   17   20   22   25   27   30   32   34   35</div>
<p><strong class="bad">RMS misses a deadline: T2 at t=7.</strong> T1 has the shorter period so it always
wins, and T2 &mdash; needing 4 units out of every 7 &mdash; is repeatedly squeezed out.</p>

<div class="diagram"><div class="d-title">EDF &mdash; priorities swap as deadlines approach</div>+----+-----+----+-----+----+----+----+----+----+-----+----+----+----+----+----+
| T1 |  T2 | T1 |  T2 | T1 | T2 | T1 | T2 | T1 |  T2 | T1 | T2 | T1 | T2 | -- |
+----+-----+----+-----+----+----+----+----+----+-----+----+----+----+----+----+
0    2     6    8     12   14   15   17   20   22    26   28   30   32   34   35</div>
<p><strong class="good">EDF misses nothing.</strong> When T2's deadline draws nearer than T1's, T2
runs first. Priorities invert dynamically, which fixed-priority RMS can never do.</p>

<div class="callout deepdive">
<strong>So why does anyone still use RMS?</strong> Three reasons. <em>Predictability under overload:</em>
if an EDF system is momentarily over-subscribed it can suffer a <strong>domino effect</strong> where
missing one deadline cascades into missing many, and which task fails is hard to predict. Under RMS,
overload degrades gracefully &mdash; the lowest-priority (longest-period) task misses first, every
time, and you can design for that. <em>Cost:</em> RMS priorities are computed once at design time;
EDF must track absolute deadlines and re-sort the ready queue continuously. <em>Certification:</em>
avionics and automotive standards favour static analysis, and a fixed-priority system is far easier
to prove correct. Linux offers both: <code>SCHED_FIFO</code>/<code>SCHED_RR</code> are fixed-priority,
and <code>SCHED_DEADLINE</code> (kernel 3.14+) is a genuine EDF implementation with
constant-bandwidth-server admission control.
</div>

<h2>Priority Inversion &mdash; the Real-Time Killer</h2>
<p>A schedulability proof assumes a high-priority task can always preempt. Shared locks break that
assumption.</p>

<div class="code-block"><pre>PRIORITY INVERSION

  H = high priority     needs lock L
  M = medium priority   needs no lock
  L = low priority      holds lock L

  L acquires lock ......... L running
  H becomes ready ......... H preempts L, tries to take L&#x27;s lock, BLOCKS
  M becomes ready ......... M preempts L (M outranks L)
                            H is now waiting on L, which cannot run
                            because M is running.
  =&gt; H is effectively blocked by M, which it outranks.
     The inversion lasts as long as M wants the CPU -- UNBOUNDED.

PRIORITY INHERITANCE (the fix)

  When H blocks on a lock held by L, L temporarily INHERITS
  H&#x27;s priority for as long as it holds that lock.
  M can no longer preempt L. L finishes its critical section
  quickly, releases the lock, drops back to its own priority,
  and H proceeds.
  =&gt; blocking time is bounded by L&#x27;s critical section length,
     which is what schedulability analysis requires.

  Linux: PTHREAD_PRIO_INHERIT on a pthread mutex, and
         rt_mutex internally in the kernel.</pre></div>

<div class="callout industry-note">
<strong>Mars Pathfinder, July 1997.</strong> The lander began resetting repeatedly, days into the
mission. A high-priority bus-management task blocked on a mutex held by a low-priority
meteorological task, while a medium-priority communications task &mdash; needing no lock &mdash; kept
preempting the low-priority one. The watchdog saw the bus task miss its deadline and reset the
spacecraft. VxWorks supported priority inheritance but it had been <em>disabled</em> for performance.
JPL reproduced the fault on the ground replica, then uploaded a C patch that flipped the flag on the
mutex, 200 million kilometres away. The mission was saved. The engineering lesson is that
schedulability analysis is void unless blocking time is bounded &mdash; which is precisely what
priority inheritance guarantees.
</div>

<h2>Multiprocessor Scheduling</h2>
<p>With multiple cores the question changes from "which task next?" to "which task, on which core?"
&mdash; and the second half matters more than it first appears.</p>

<div class="diagram"><div class="d-title">Two ways to organise multiprocessor scheduling</div>GLOBAL QUEUE                      PER-CPU QUEUES

  +---------------------+          +------+ +------+ +------+
  |   one shared queue  |          | CPU0 | | CPU1 | | CPU2 |
  |  [T1][T2][T3][T4]   |          | [T1] | | [T3] | | [T5] |
  +---------------------+          | [T2] | | [T4] | | [T6] |
     |      |      |               +------+ +------+ +------+
   CPU0   CPU1   CPU2                  ^        ^
                                       +--------+
  + automatic load balance             periodic load balancing
  + no core ever idles while             migrates tasks between
    work is pending                      queues when imbalanced
  - ONE LOCK on the queue =
    contention, does not scale        + no shared lock -&gt; scales
  - tasks bounce between cores        + cache affinity preserved
    destroying cache affinity         - needs explicit balancing
                                      - a core can idle while
  Used by: small SMP systems            another is backlogged

                                      Used by: Linux, FreeBSD ULE,
                                               Windows -- everything
                                               modern</div>

<h3>Processor Affinity</h3>
<p>A task that has been running on core 0 has its working set in core 0's L1 and L2 caches. Migrating
it to core 3 abandons all of that, and the task restarts cold. Schedulers therefore prefer to keep
a task where it was &mdash; <strong>soft affinity</strong> as a preference, or <strong>hard affinity</strong>
pinned by the programmer with <code>taskset</code> or <code>sched_setaffinity()</code>.</p>

<div class="callout warning">
<strong>Affinity and load balancing are in direct conflict.</strong> Perfect balance means migrating
tasks to idle cores; perfect affinity means never migrating at all. Every multiprocessor scheduler
picks a point between the two, and Linux only migrates when the imbalance exceeds a threshold that
grows with the cost of the move &mdash; migrating within an L3-sharing core cluster is cheap, across
NUMA nodes it is expensive.
</div>

<h3>NUMA</h3>
<p>On multi-socket servers, memory is physically attached to a particular socket. A core reaching
memory on its own node pays perhaps 80&nbsp;ns; reaching the other node's memory can cost 130&nbsp;ns
or more. Scheduling a thread away from its memory imposes a permanent tax on every access it makes.
Inspect the topology with <code>numactl --hardware</code> and pin with
<code>numactl --cpunodebind=0 --membind=0</code> &mdash; standard practice for databases and JVMs on
large servers.</p>

<div class="quiz-section"><h3><span class="qico">&#9673;</span> Check Your Understanding</h3>
<div class="quiz-q"><p>Three periodic tasks have total utilisation U = 0.74. The RMS bound for n=3 is 0.7798. What can you conclude?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. The set is guaranteed schedulable under RMS</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. The set definitely cannot be scheduled</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Only EDF can schedule it</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Nothing without simulating</div></div><div class="quiz-explain">0.74 &le; 0.7798, so the sufficient condition holds and RMS is <em>guaranteed</em> to meet every deadline &mdash; no further analysis needed. Note the asymmetry: passing the bound proves schedulability, but failing it proves nothing either way, since the bound is conservative.</div></div>
<div class="quiz-q"><p>A task set has U = 0.95 with 2 tasks. RMS misses deadlines; EDF does not. Why?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. EDF has lower overhead</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. EDF reorders priorities dynamically as deadlines approach</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. RMS cannot preempt tasks</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. EDF runs tasks in parallel</div></div><div class="quiz-explain">RMS priorities are fixed by period, so the shorter-period task <em>always</em> wins even when the other is about to miss its deadline. EDF recomputes on every scheduling decision and lets the more urgent task run, whichever it is. This dynamic reordering is why EDF achieves full 100% utilisation while RMS is limited to about 69% in the worst case.</div></div>
<div class="quiz-q"><p>Why do avionics and automotive systems often prefer RMS despite EDF&rsquo;s higher utilisation?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. EDF is patented</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. RMS degrades predictably under overload and is easier to certify</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. EDF cannot handle periodic tasks</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. RMS needs less memory</div></div><div class="quiz-explain">Under transient overload EDF can suffer a domino effect where one missed deadline cascades unpredictably. RMS fails in a fixed, analysable order &mdash; the longest-period task first &mdash; so designers know in advance what will degrade. Static priorities are also far easier to verify formally, which certification standards such as DO-178C reward.</div></div>
<div class="quiz-q"><p>A scheduler migrates a thread from core 0 to core 5 on a different socket. What is the main hidden cost?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. The thread&rsquo;s priority is reset</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Cold caches plus, on NUMA, permanently remote memory access</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. The thread must be re-linked</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Migration requires a full context switch of every core</div></div><div class="quiz-explain">The thread abandons its warm L1/L2 (and possibly L3) working set and restarts with cache misses. Worse on a multi-socket machine: its memory pages remain allocated on the original NUMA node, so <em>every</em> subsequent access pays the remote penalty &mdash; roughly 80&nbsp;ns local versus 130&nbsp;ns remote &mdash; for the rest of the thread&rsquo;s life, not just during warm-up.</div></div>
<button class="quiz-reset" onclick="resetQuiz(this)">&#8634; Reset these questions</button></div>
<div class="practice"><h3><span class="pico">&#9998;</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied &mdash; check every digit.</p>
<div class="prob"><div class="prob-q"><span class="prob-n">1</span><div>Three periodic tasks: T1(C=1, T=3), T2(C=2, T=8), T3(C=1, T=10).
(a) Compute total utilisation. (b) Apply the RMS bound for n=3. (c) State the RMS priority order.
(d) Is the set schedulable?</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m2l3_p1')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m2l3_p1')">Show solution</button></div><div class="hint" id="h_m2l3_p1">Utilisation of each task is C/T. The bound is n(2^(1/n) &minus; 1); for n = 3 that is about 0.7798.</div><div class="sol" id="s_m2l3_p1"><pre class="mini">(a) U = 1/3 + 2/8 + 1/10
      = 0.3333 + 0.2500 + 0.1000
      = <b>0.6833</b>

(b) RMS bound for n=3 = 3(2^(1/3) - 1) = <b>0.7798</b>

(c) Shorter period = higher priority:
      T1 (T=3)  &gt;  T2 (T=8)  &gt;  T3 (T=10)

(d) 0.6833 &lt;= 0.7798  ->  <b>GUARANTEED SCHEDULABLE</b></pre>
<p>The set passes the sufficient test, so no simulation is needed &mdash; RMS will meet every deadline. There is about 32% CPU headroom, which in a real design you would deliberately keep for interrupt handling and future growth.</p>
<p>Worth noting: even if U had been 0.85 and failed the bound, the set might <em>still</em> be schedulable. You would then perform exact response-time analysis or simulate the hyperperiod (LCM of 3, 8, 10 = 120) rather than concluding failure.</p></div></div>
<div class="prob"><div class="prob-q"><span class="prob-n">2</span><div>A high-priority task H (period 10&nbsp;ms) shares a mutex with low-priority task L. L&rsquo;s critical
section takes 2&nbsp;ms. A medium-priority task M runs for 15&nbsp;ms and needs no lock. Trace what
happens with and without priority inheritance, and give H&rsquo;s worst-case blocking time in each case.</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m2l3_p2')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m2l3_p2')">Show solution</button></div><div class="hint" id="h_m2l3_p2">Without inheritance, ask what stops L from finishing its critical section. With inheritance, ask whether M can still preempt L.</div><div class="sol" id="s_m2l3_p2"><p><strong>Without priority inheritance:</strong></p>
<pre class="mini">t=0   L acquires the mutex, starts its 2 ms critical section
t=1   H is released, preempts L, tries the mutex -> BLOCKS
      L resumes (it holds the lock, H is waiting)
t=1+  M is released. M outranks L, so M PREEMPTS L.
      L still holds the mutex. H is still blocked.
t=16  M finishes its 15 ms
      L resumes, completes the remaining 1 ms of its section
t=17  L releases the mutex; H finally runs

H's blocking time = 1 ms (L's remainder) + 15 ms (M) = <b>16 ms</b>
H's period is 10 ms -> <b>DEADLINE MISSED</b>.

And the bound is not really 16 ms: any number of medium-priority
tasks could arrive, so the blocking time is UNBOUNDED. No
schedulability analysis is possible.</pre>
<p><strong>With priority inheritance:</strong></p>
<pre class="mini">t=0   L acquires the mutex
t=1   H blocks on it -> L INHERITS H's priority
t=1+  M is released but CANNOT preempt L
      (L is temporarily running at H's priority)
t=2   L finishes its critical section, releases the mutex,
      drops back to low priority
      H acquires the mutex and runs immediately

H's blocking time = <b>1 ms</b> -- bounded by the length of
L's critical section, and nothing else.</pre>
<p>The key change is not the raw number but that it is now <em>bounded and known at design time</em>. Schedulability analysis extends to <code>U + B/T &le; bound</code>, where B is the worst-case blocking; with unbounded B no such analysis exists. This is exactly the Mars Pathfinder fault and exactly the fix that was uploaded.</p></div></div>
<div class="prob"><div class="prob-q"><span class="prob-n">3</span><div><strong>Design.</strong> A 32-core dual-socket server runs a latency-sensitive service that is
currently spread across all cores by the default scheduler. Tail latency is poor and inconsistent.
Explain the likely causes and describe a concrete tuning strategy.</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m2l3_p3')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m2l3_p3')">Show solution</button></div><div class="hint" id="h_m2l3_p3">Think about what the scheduler is free to do to a thread between requests, and where that thread&rsquo;s memory physically lives.</div><div class="sol" id="s_m2l3_p3"><p><strong>Likely causes, in order of impact:</strong></p>
<p><strong>1. NUMA remote access.</strong> With two sockets, memory allocated while running on socket 0 stays on socket 0. If the scheduler later runs that thread on socket 1, every memory access crosses the interconnect &mdash; roughly 130&nbsp;ns instead of 80&nbsp;ns, permanently. Confirm with <code>numastat</code> (look for high <code>numa_miss</code>) and <code>numactl --hardware</code>.</p>
<p><strong>2. Migration destroying cache affinity.</strong> Each migration abandons a warm L1/L2 working set. Even within a socket this costs a burst of misses; the effect shows up precisely as inconsistent <em>tail</em> latency rather than a worse median, because only migrated requests pay it.</p>
<p><strong>3. Interference from unrelated work.</strong> Kernel threads, interrupt handlers and background jobs share the cores, so a request can land behind them.</p>
<p><strong>Tuning strategy:</strong></p>
<ul>
<li><strong>Pin threads to one NUMA node</strong> along with their memory: <code>numactl --cpunodebind=0 --membind=0</code>. This eliminates cause 1 outright and is usually the single largest win.</li>
<li><strong>Set hard affinity</strong> per worker with <code>sched_setaffinity()</code> or <code>taskset</code>, one worker per core, so the scheduler never migrates them.</li>
<li><strong>Isolate the cores</strong> with the <code>isolcpus</code> or <code>nohz_full</code> boot parameters, or a cpuset cgroup, so no other work is scheduled there. Steer device interrupts to the non-isolated cores via <code>/proc/irq/*/smp_affinity</code>.</li>
<li><strong>Measure percentiles, not means.</strong> Track p99 and p99.9 before and after &mdash; tail latency is the metric that is actually broken here.</li>
</ul>
<p>The trade-off is deliberate: you are sacrificing the scheduler&rsquo;s ability to balance load in exchange for predictability. That is the right call for a latency-sensitive service and the wrong call for a throughput-oriented batch workload, which wants every core busy regardless of locality.</p></div></div>
</div>

<div class="takeaways"><h3>&#9889; Key Takeaways</h3><ul><li>Real-time correctness is about <strong>deadlines</strong>, not averages &mdash; a late answer is a wrong answer.</li><li><strong>RMS</strong>: static priorities by period, sufficient bound n(2<sup>1/n</sup>&minus;1) &rarr; 69.3%.</li><li><strong>EDF</strong>: dynamic priorities by absolute deadline, optimal on one CPU, test is simply U &le; 1.</li><li>RMS is still preferred where <em>predictable</em> overload behaviour and certification matter.</li><li><strong>Priority inheritance</strong> bounds blocking time &mdash; without it, schedulability analysis is meaningless.</li><li>Multiprocessor: per-CPU queues plus periodic load balancing; <strong>affinity and balance are in tension</strong>.</li><li>On NUMA, migrating a thread away from its memory taxes every subsequent access.</li></ul></div>`
  },
  "m3l0": {
    mod: "MODULE 3 — Synchronisation",
    title: "Critical Section Problem",
    level: "Intermediate",
    time: "20 min",
    industry: "Very Common Bug Source",
    prev: "m2l3",
    next: "m3l1",
    content: `
<h2>The Race Condition — The Source of Endless Bugs</h2>
<p>Two processes (or threads) access shared data concurrently, and the outcome depends on the exact timing of their execution. The program produces different results on different runs. These bugs are notoriously hard to reproduce.</p>

<div class="code-block" data-lang="C">
<pre><span class="cm">/* Shared variable */</span>
<span class="kw">int</span> counter = <span class="num">0</span>;

<span class="cm">/* Thread 1 and Thread 2 both run this: */</span>
<span class="kw">void</span> <span class="fn">increment</span>() {
    counter++;   <span class="cm">/* Looks atomic. Is NOT. */</span>
}

<span class="cm">/* At machine level, counter++ is THREE operations:
   1. LOAD:  register = counter   (read from memory)
   2. ADD:   register = register + 1
   3. STORE: counter = register   (write to memory)

   If Thread 1 and Thread 2 interleave:
   T1: LOAD  (gets 0)
   T2: LOAD  (gets 0)   ← T2 loaded before T1 stored!
   T1: ADD   (gets 1)
   T2: ADD   (gets 1)
   T1: STORE (writes 1)
   T2: STORE (writes 1) ← LOST UPDATE! Counter should be 2
*/</span></pre>
</div>

<p>Run 1000 threads each doing <code>counter++</code> 1000 times — expected result: 1,000,000. Actual result: somewhere between 500,000 and 1,000,000 depending on luck. <em>This is a race condition.</em></p>

<h2>The Critical Section</h2>
<p>The portion of code that accesses shared resources and <strong>must not be executed by more than one process simultaneously</strong>.</p>

<div class="code-block" data-lang="C">
<pre><span class="kw">while</span> (<span class="fn">true</span>) {
    <span class="cm">/* Entry section — ask permission to enter CS */</span>
    <span class="fn">entry_section</span>();
    
    <span class="cm">/* ======= CRITICAL SECTION ======= */</span>
    counter++;     <span class="cm">/* shared resource access */</span>
    <span class="cm">/* ================================= */</span>
    
    <span class="cm">/* Exit section — release for others */</span>
    <span class="fn">exit_section</span>();
    
    <span class="cm">/* Remainder section — non-critical work */</span>
    <span class="fn">do_other_stuff</span>();
}</pre>
</div>

<h2>Requirements for a Correct Solution</h2>
<p>Any solution to the critical section problem must satisfy all three:</p>

<table>
  <tr><th>Requirement</th><th>Meaning</th></tr>
  <tr><td><strong>Mutual Exclusion</strong></td><td>At most one process inside the CS at any time</td></tr>
  <tr><td><strong>Progress</strong></td><td>If no process is in the CS and some want to enter, decision on who enters must be made in finite time. Processes outside CS can't block others.</td></tr>
  <tr><td><strong>Bounded Waiting</strong></td><td>After requesting entry, a process waits at most N times before it gets in. No starvation.</td></tr>
</table>

<h2>Peterson's Solution (2 processes)</h2>
<p>Classic software-only solution for 2 processes. Pedagogically important.</p>

<div class="code-block" data-lang="C">
<pre><span class="kw">int</span> turn;          <span class="cm">/* whose turn is it */</span>
<span class="kw">bool</span> flag[<span class="num">2</span>];      <span class="cm">/* flag[i] = process i wants to enter */</span>

<span class="cm">/* Process i's entry section: */</span>
flag[i] = <span class="kw">true</span>;         <span class="cm">/* "I want to enter" */</span>
turn = j;               <span class="cm">/* "but you go first if you want" */</span>
<span class="kw">while</span> (flag[j] && turn == j);  <span class="cm">/* busy wait */</span>

<span class="cm">/* CRITICAL SECTION */</span>

<span class="cm">/* Exit section: */</span>
flag[i] = <span class="kw">false</span>;</pre>
</div>

<div class="callout warning">
<strong>Peterson's solution fails on modern CPUs</strong> without memory barriers. Modern CPUs and compilers reorder instructions for performance. The stores to <code>flag</code> and <code>turn</code> might be reordered by the CPU. In real code, you must use <strong>memory barriers</strong> (<code>__sync_synchronize()</code> or C11 atomics). Peterson's is a theoretical answer — not production code.
</div>

<div class="callout deepdive">
<strong>Dekker's Solution</strong> was the first known correct software solution (1960s). Peterson's (1981) is simpler and more intuitive. Both are two-process algorithms. Generalising them to n processes (Lamport&rsquo;s Bakery algorithm) costs O(n) shared variables and an O(n) scan per entry, which scales poorly — which is why hardware support (test-and-set, compare-and-swap) became the practical foundation for synchronisation.
</div>

<div class="quiz-section"><h3><span class="qico">◉</span> Check Your Understanding</h3>
<div class="quiz-q">
    <p>Which requirement does a solution satisfy if it guarantees a waiting process eventually enters its critical section?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Mutual exclusion</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Progress</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Bounded waiting</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Atomicity</div></div>
    <div class="quiz-explain">Bounded waiting places a finite limit on how many times other processes may enter the critical section after you have requested entry. Mutual exclusion says at most one process is inside; progress says the decision of who enters next cannot be deferred indefinitely by processes that are not even competing. A solution can satisfy the first two and still starve one unlucky process — bounded waiting is what rules that out.</div>
  </div>
<div class="quiz-q">
    <p>Why does Peterson&rsquo;s algorithm fail on modern multicore CPUs without memory barriers?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. It only supports two processes</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. CPUs and compilers reorder the stores to flag and turn</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. It requires a hardware atomic instruction</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Interrupts corrupt the turn variable</div></div>
    <div class="quiz-explain">The algorithm&rsquo;s correctness depends on <code>flag[i] = true</code> becoming visible to the other core <em>before</em> the read of <code>flag[j]</code>. Store buffers and out-of-order execution allow that write to be delayed, so both processes can observe stale flags and enter simultaneously. A memory fence (or C11 atomics with seq_cst ordering) restores the required ordering. The two-process limitation is real but is a separate issue.</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div><div class="practice"><h3><span class="pico">✎</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied — check every digit.</p>
<div class="prob">
  <div class="prob-q"><span class="prob-n">1</span><div>Two threads run <code>balance = balance + 100</code> and <code>balance = balance - 50</code>
 concurrently on an initial balance of 1000. List every possible final value and the interleaving
 that produces each.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m3l0_p1')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m3l0_p1')">Show solution</button></div>
  <div class="hint" id="h_m3l0_p1">Expand each statement into LOAD, compute, STORE. A lost update occurs when both threads load before either stores.</div>
  <div class="sol" id="s_m3l0_p1"><p>Each statement is three machine operations:</p>
<pre class="mini">T1: LOAD r1 &lt;- balance ; ADD r1,100 ; STORE balance &lt;- r1
T2: LOAD r2 &lt;- balance ; SUB r2, 50 ; STORE balance &lt;- r2</pre>
<p><strong>Final value 1050</strong> (correct) — either thread runs entirely before the other:
<code>T1 L,A,S then T2 L,S,S</code> gives 1100 then 1050. The reverse order gives 950 then 1050.</p>
<p><strong>Final value 1100</strong> — both load 1000, T2 stores 950, then T1 stores 1100. T2&rsquo;s update is lost.</p>
<p><strong>Final value 950</strong> — both load 1000, T1 stores 1100, then T2 stores 950. T1&rsquo;s update is lost.</p>
<p>So the outcomes are <strong>1050, 1100 or 950</strong>, depending purely on timing. Only 1050 is correct, and the wrong answers appear non-deterministically — which is what makes race conditions so difficult to reproduce and debug. Note that both threads may also read a torn value on architectures without atomic word access, though on x86-64 an aligned 64-bit load is atomic.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">2</span><div>Show that this "solution" for two processes violates one of the three requirements. Which one, and how?
 <pre class="mini">/* Process i */
while (turn != i)
    ;              /* busy wait */
/* critical section */
turn = j;</pre></div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m3l0_p2')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m3l0_p2')">Show solution</button></div>
  <div class="hint" id="h_m3l0_p2">Consider what happens when one process simply does not want to enter its critical section.</div>
  <div class="sol" id="s_m3l0_p2"><p>It satisfies <strong>mutual exclusion</strong> — <code>turn</code> holds a single value, so only one process passes the loop. It also satisfies <strong>bounded waiting</strong>, since the processes strictly alternate.</p>
<p>It violates <strong>progress</strong>. The algorithm enforces <em>strict alternation</em>: after P0 leaves, <code>turn</code> becomes 1, so P0 cannot re-enter until P1 has taken its turn. If P1 is busy with unrelated work — or has terminated entirely — P0 is blocked indefinitely even though the critical section is completely free.</p>
<p>This breaks the progress requirement precisely as stated: a process <em>outside</em> its critical section (P1, doing something else) is preventing a process that wants to enter (P0) from doing so. Peterson&rsquo;s algorithm fixes this by adding the <code>flag[]</code> array, so a process that does not want entry sets its flag false and is skipped rather than being waited for.</p></div>
</div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>Three requirements: <strong>mutual exclusion</strong>, <strong>progress</strong>, <strong>bounded waiting</strong>. All three are needed.</li><li><code>counter++</code> is three machine operations — that gap is where every race condition lives.</li><li>Strict alternation gives mutual exclusion but violates progress.</li><li>Peterson&rsquo;s is correct in theory but needs memory barriers on real hardware.</li></ul></div>`
  },
  "m3l1": {
    mod: "MODULE 3 — Synchronisation",
    title: "Semaphores & Mutexes",
    level: "Intermediate",
    time: "20 min",
    industry: "Used Daily",
    prev: "m3l0",
    next: "m3l2",
    content: `
<h2>Hardware Solution: Test-and-Set</h2>
<p>Modern CPUs provide <strong>atomic</strong> read-modify-write instructions that complete as one uninterruptible hardware operation.</p>

<div class="code-block" data-lang="C"><pre><span class="cm">/* CONCEPTUAL definition (Dijkstra, 1965).
   Both operations must execute ATOMICALLY -- the OS guarantees
   this by disabling interrupts on a uniprocessor, or by using a
   hardware atomic instruction such as compare-and-swap. */</span>

<span class="cm">/* P / wait / down / proberen */</span>
<span class="kw">void</span> <span class="fn">wait</span>(Semaphore *S) {
    S-&gt;value--;
    <span class="kw">if</span> (S-&gt;value &lt; <span class="num">0</span>) {
        add_to_queue(S, current_process);
        block();          <span class="cm">/* sleep: consumes NO cpu */</span>
    }
}

<span class="cm">/* V / signal / up / verhogen */</span>
<span class="kw">void</span> <span class="fn">signal</span>(Semaphore *S) {
    S-&gt;value++;
    <span class="kw">if</span> (S-&gt;value &lt;= <span class="num">0</span>) {
        P = remove_from_queue(S);
        wakeup(P);        <span class="cm">/* move P to the ready queue */</span>
    }
}</pre></div>

<div class="callout warning">
<strong>Blocking, not spinning.</strong> Textbooks often first show <code>while (S &lt;= 0);</code> — a
<em>spinlock</em>, which burns CPU while waiting. Real semaphores <strong>block</strong>: the waiting process is
removed from the ready queue and consumes nothing until woken. Note the sign convention above —
when <code>value</code> is negative, its magnitude is exactly the number of waiting processes.
Spinning is only appropriate when the wait is expected to be shorter than the cost of two context
switches, which is why the kernel keeps both primitives.
</div>

<h3>Two Types of Semaphores</h3>
<table>
  <tr><th>Type</th><th>Initial Value</th><th>Use</th></tr>
  <tr><td><strong>Binary Semaphore (Mutex)</strong></td><td>1</td><td>Mutual exclusion — only 1 process in CS</td></tr>
  <tr><td><strong>Counting Semaphore</strong></td><td>N</td><td>Allow up to N concurrent accesses (e.g., N database connections)</td></tr>
</table>

<div class="code-block" data-lang="C">
<pre><span class="cm">/* Binary semaphore for mutual exclusion */</span>
Semaphore mutex = <span class="num">1</span>;

<span class="fn">wait</span>(mutex);       <span class="cm">/* P: enter if > 0, block if 0 */</span>
<span class="cm">/* CRITICAL SECTION */</span>
<span class="fn">signal</span>(mutex);     <span class="cm">/* V: wake one waiting process */</span>

<span class="cm">/* Counting semaphore for N resource slots */</span>
Semaphore db_connections = <span class="num">10</span>;  <span class="cm">/* max 10 concurrent DB connections */</span>

<span class="fn">wait</span>(db_connections);      <span class="cm">/* grab a connection slot */</span>
<span class="fn">use_database</span>();
<span class="fn">signal</span>(db_connections);   <span class="cm">/* release slot */</span></pre>
</div>

<h2>Mutex vs Semaphore — A Critical Distinction</h2>
<table>
  <tr><th>Feature</th><th>Mutex</th><th>Semaphore</th></tr>
  <tr><td>Ownership</td><td>Yes — only the locker can unlock</td><td>No — anyone can signal</td></tr>
  <tr><td>Purpose</td><td>Mutual exclusion only</td><td>Mutual exclusion + signalling</td></tr>
  <tr><td>Value range</td><td>0 or 1 (locked/unlocked)</td><td>Any non-negative integer</td></tr>
  <tr><td>Priority inheritance</td><td>Often supported</td><td>Usually not</td></tr>
</table>

<div class="callout warning">
<strong>A semaphore is NOT a mutex</strong> because a mutex has ownership — only the thread that locked it can unlock it. A semaphore can be signalled by any thread. This matters for debugging and for priority inversion. In production code, use <strong>mutexes</strong> for mutual exclusion and semaphores for <strong>signalling between threads</strong>.
</div>

<h2>Monitor — The High-Level Abstraction</h2>
<p>A <strong>monitor</strong> is a language-level construct (supported by Java, C#, etc.) that bundles shared data with the procedures that operate on it. Only one thread can be active inside a monitor at a time — mutual exclusion is <em>automatic</em>.</p>

<div class="code-block" data-lang="Java">
<pre><span class="cm">// Java synchronized = monitor</span>
<span class="kw">class</span> <span class="type">BankAccount</span> {
    <span class="kw">private int</span> balance = <span class="num">1000</span>;
    
    <span class="kw">synchronized void</span> <span class="fn">deposit</span>(<span class="kw">int</span> amount) {
        balance += amount;  <span class="cm">// Only one thread at a time</span>
    }
    
    <span class="kw">synchronized void</span> <span class="fn">withdraw</span>(<span class="kw">int</span> amount) {
        <span class="kw">while</span> (balance < amount) {
            <span class="fn">wait</span>();       <span class="cm">// Release monitor, sleep</span>
        }
        balance -= amount;
        <span class="fn">notifyAll</span>();  <span class="cm">// Wake waiting threads</span>
    }
}</pre>
</div>

<div class="callout industry-note">
In modern C++ (C++11 onwards), use <code>std::mutex</code>, <code>std::lock_guard</code>, and <code>std::condition_variable</code>. In Python, use <code>threading.Lock()</code> and <code>threading.Condition()</code>. In Go, use <code>sync.Mutex</code> or channels. The concepts are identical across all languages — only syntax differs. Understanding semaphores and monitors from first principles means you can work in any language.
</div>

<div class="quiz-section"><h3><span class="qico">◉</span> Check Your Understanding</h3>
<div class="quiz-q">
    <p>What is the essential difference between a mutex and a binary semaphore?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. A mutex is faster</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. A mutex has ownership — only the locker may unlock it</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. A semaphore cannot be used for mutual exclusion</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. A mutex works only between threads of one process</div></div>
    <div class="quiz-explain">Ownership is the defining distinction, and it has real consequences: it enables priority inheritance (the fix for priority inversion), error detection when the wrong thread unlocks, and recursive locking. A binary semaphore may be signalled by any thread, which is exactly what you want for <em>signalling</em> between threads but wrong for protecting a critical section.</div>
  </div>
<div class="quiz-q">
    <p>A counting semaphore is initialised to 5. Ten threads each call wait(). How many proceed and what is the semaphore&rsquo;s value?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. 10 proceed, value −5</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. 5 proceed, value 0, five threads blocked</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. 5 proceed, value 5</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. All block</div></div>
    <div class="quiz-explain">Each successful wait() decrements the counter; when it reaches 0 further callers block. Five threads proceed and five are queued. In implementations that allow negative values, the magnitude of the negative number conveniently equals the number of waiting threads — but the observable behaviour is the same either way.</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div><div class="practice"><h3><span class="pico">✎</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied — check every digit.</p>
<div class="prob">
  <div class="prob-q"><span class="prob-n">1</span><div>You have a connection pool of 10 database connections shared by 50 worker threads. Write the
 semaphore logic, and explain what happens when an eleventh thread arrives.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m3l1_p1')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m3l1_p1')">Show solution</button></div>
  <div class="hint" id="h_m3l1_p1">This calls for a counting semaphore sized to the resource, plus a mutex if the pool data structure itself is mutated.</div>
  <div class="sol" id="s_m3l1_p1"><pre class="mini">sem_t   slots;              /* counting: how many connections free */
pthread_mutex_t pool_lock;  /* protects the pool list itself      */

sem_init(&amp;slots, 0, 10);    /* 10 connections available */

/* Worker thread */
sem_wait(&amp;slots);                  /* blocks if all 10 are in use */
pthread_mutex_lock(&amp;pool_lock);
conn = pool_take();                /* mutate the free-list safely */
pthread_mutex_unlock(&amp;pool_lock);

use_connection(conn);

pthread_mutex_lock(&amp;pool_lock);
pool_return(conn);
pthread_mutex_unlock(&amp;pool_lock);
sem_post(&amp;slots);                  /* wake one waiting worker */</pre>
<p><strong>The eleventh thread blocks</strong> inside <code>sem_wait</code> — the counter is already 0. It sleeps in the kernel consuming no CPU, and is woken by whichever worker calls <code>sem_post</code> first.</p>
<p>Two mechanisms are needed because they solve different problems: the <em>semaphore</em> counts a finite resource (how many connections exist), while the <em>mutex</em> provides mutual exclusion over the pool data structure. Using only a mutex would serialise all 50 workers down to one at a time; using only a semaphore would leave the free-list open to corruption.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">2</span><div>What is wrong with this code, and what is the consequence?
 <pre class="mini">wait(mutex);
if (error) return -1;    /* early exit */
/* critical section */
signal(mutex);</pre></div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m3l1_p2')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m3l1_p2')">Show solution</button></div>
  <div class="hint" id="h_m3l1_p2">Trace the path taken when error is true.</div>
  <div class="sol" id="s_m3l1_p2"><p>On the error path the function returns <strong>while still holding the mutex</strong>. It is never signalled, so the next thread to call <code>wait(mutex)</code> blocks forever, and so does every thread after it. A single error path silently deadlocks the entire subsystem — and it will only manifest when that rare error actually occurs, typically in production.</p>
<p>Fixes, in increasing order of robustness:</p>
<ul>
<li><strong>goto cleanup</strong> — the idiomatic C approach: a single exit point that always unlocks.</li>
<li><strong>RAII</strong> in C++: <code>std::lock_guard</code> releases in its destructor on <em>every</em> exit path, including exceptions.</li>
<li><strong>defer</strong> in Go: <code>mu.Lock(); defer mu.Unlock()</code>.</li>
<li><strong>with</strong> in Python: <code>with lock:</code>.</li>
</ul>
<p>Every one of these encodes the same principle: tie lock release to <em>scope exit</em> rather than to a specific line, so no future edit can introduce a path that skips it.</p></div>
</div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li><code>wait()</code>/P decrements and may block; <code>signal()</code>/V increments and may wake a waiter.</li><li>Binary semaphore (init 1) for mutual exclusion; counting semaphore (init N) for N resources.</li><li>A <strong>mutex has an owner</strong>; a semaphore does not. Ownership enables priority inheritance.</li><li>Never return from a function while holding a lock — use RAII, defer, or a single cleanup exit.</li></ul></div>`
  },
  "m3l2": {
    mod: "MODULE 3 — Synchronisation",
    title: "Classic Synchronisation Problems",
    level: "Advanced",
    time: "25 min",
    industry: "Interview Staple",
    prev: "m3l1",
    next: "m4l0",
    content: `
<h2>Why These Problems Matter</h2>
<p>These three problems are canonical templates. Every real-world concurrency challenge is a variant of one of them. Databases, web servers, OS kernels — they all use these patterns.</p>

<h2>1. Producer–Consumer (Bounded Buffer)</h2>
<p>A producer creates data and puts it in a shared buffer. A consumer takes data from the buffer. The buffer has limited size N.</p>
<p><strong>Problems to solve:</strong> Producer must wait if buffer full. Consumer must wait if buffer empty. Buffer access must be mutually exclusive.</p>

<div class="code-block" data-lang="C">
<pre>Semaphore mutex = <span class="num">1</span>;     <span class="cm">/* buffer access lock */</span>
Semaphore empty = N;      <span class="cm">/* N empty slots initially */</span>
Semaphore full  = <span class="num">0</span>;     <span class="cm">/* 0 full slots initially */</span>

<span class="cm">/* PRODUCER: */</span>
<span class="kw">while</span> (<span class="kw">true</span>) {
    item = <span class="fn">produce</span>();
    <span class="fn">wait</span>(empty);          <span class="cm">/* wait for empty slot */</span>
    <span class="fn">wait</span>(mutex);          <span class="cm">/* lock buffer */</span>
    buffer[in] = item;
    in = (in + <span class="num">1</span>) % N;
    <span class="fn">signal</span>(mutex);        <span class="cm">/* unlock buffer */</span>
    <span class="fn">signal</span>(full);         <span class="cm">/* notify consumer: one more item */</span>
}

<span class="cm">/* CONSUMER: */</span>
<span class="kw">while</span> (<span class="kw">true</span>) {
    <span class="fn">wait</span>(full);           <span class="cm">/* wait for item */</span>
    <span class="fn">wait</span>(mutex);          <span class="cm">/* lock buffer */</span>
    item = buffer[out];
    out = (out + <span class="num">1</span>) % N;
    <span class="fn">signal</span>(mutex);        <span class="cm">/* unlock buffer */</span>
    <span class="fn">signal</span>(empty);        <span class="cm">/* one more empty slot */</span>
    <span class="fn">consume</span>(item);
}</pre>
</div>

<div class="callout industry-note">
<strong>This is literally how message queues work:</strong> Kafka, RabbitMQ, Redis queues — producers send messages, consumers receive them, a buffer (the queue) sits between. The OS-level implementation uses the exact semaphore pattern above. When a Kafka consumer group can't keep up with producers, its offset falls behind — the "buffer" (topic partition) is filling faster than consumed.
</div>

<h2>2. Readers–Writers Problem</h2>
<p>A shared database. Many readers can read simultaneously (no harm). But a writer needs exclusive access — no readers or writers while writing.</p>
<p><strong>Readers-preference solution:</strong></p>

<div class="code-block" data-lang="C">
<pre>Semaphore rw_mutex = <span class="num">1</span>;  <span class="cm">/* exclusive access for writers */</span>
Semaphore mutex    = <span class="num">1</span>;  <span class="cm">/* protects read_count */</span>
<span class="kw">int</span> read_count = <span class="num">0</span>;

<span class="cm">/* READER: */</span>
<span class="fn">wait</span>(mutex);
read_count++;
<span class="kw">if</span> (read_count == <span class="num">1</span>)    <span class="cm">/* first reader locks out writers */</span>
    <span class="fn">wait</span>(rw_mutex);
<span class="fn">signal</span>(mutex);
<span class="cm">/* READ the data */</span>
<span class="fn">wait</span>(mutex);
read_count--;
<span class="kw">if</span> (read_count == <span class="num">0</span>)    <span class="cm">/* last reader frees writers */</span>
    <span class="fn">signal</span>(rw_mutex);
<span class="fn">signal</span>(mutex);

<span class="cm">/* WRITER: */</span>
<span class="fn">wait</span>(rw_mutex);          <span class="cm">/* exclusive access */</span>
<span class="cm">/* WRITE the data */</span>
<span class="fn">signal</span>(rw_mutex);</pre>
</div>

<div class="callout warning">
<strong>Starvation problem:</strong> With readers-preference, a continuous stream of readers can lock out writers indefinitely. Fix: writers-preference (new readers wait if a writer is waiting). In practice, most databases implement read-write locks with fairness policies. PostgreSQL uses MVCC (Multi-Version Concurrency Control) to avoid this entirely — readers never block writers.
</div>

<h2>3. Dining Philosophers</h2>
<p>5 philosophers sit at a table. Between each pair is one fork (5 forks total). A philosopher thinks, then needs both adjacent forks to eat, then puts them down. <strong>Model for deadlock-prone resource allocation.</strong></p>

<div class="callout warning">
<strong>Naive solution deadlocks:</strong> If all 5 philosophers simultaneously pick up their left fork, none can pick up their right fork. All wait forever. <strong>Deadlock.</strong>
</div>

<p><strong>Fix:</strong> One of these approaches:</p>
<ol>
  <li><strong>Asymmetry:</strong> Odd philosophers pick left-then-right; even pick right-then-left. Breaks the circular wait.</li>
  <li><strong>At most 4 philosophers:</strong> Only allow 4 to pick up forks at once (counting semaphore initialised to 4)</li>
  <li><strong>Pick up both atomically:</strong> A philosopher picks up both forks in one critical section or neither. No partial acquisition.</li>
</ol>

<div class="callout industry-note">
<strong>Real-world equivalent:</strong> Distributed systems where nodes need two locks (say, locks on two database rows) to complete a transaction. If node A holds lock on row 1 and waits for row 2, while node B holds row 2 and waits for row 1 — that's a distributed deadlock, the dining philosophers problem at scale. Databases detect this with a wait-for graph and abort one transaction to break the cycle.
</div>

<div class="practice"><h3><span class="pico">✎</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied — check every digit.</p>
<div class="prob">
  <div class="prob-q"><span class="prob-n">1</span><div>In the bounded-buffer solution, what happens if the producer executes
 <code>wait(mutex)</code> <em>before</em> <code>wait(empty)</code> instead of after?</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m3l2_p1')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m3l2_p1')">Show solution</button></div>
  <div class="hint" id="h_m3l2_p1">Imagine the buffer is completely full when the producer arrives.</div>
  <div class="sol" id="s_m3l2_p1"><p><strong>Deadlock.</strong> With the buffer full, the producer acquires <code>mutex</code>, then blocks on <code>wait(empty)</code> because no slot is free — <em>while still holding the mutex</em>.</p>
<p>The consumer now arrives to remove an item, which is exactly what would free a slot. It calls <code>wait(mutex)</code> and blocks, because the producer holds it. Neither can proceed: the producer waits for a slot only the consumer can create, and the consumer waits for a mutex only the producer can release.</p>
<p>All four Coffman conditions are present — mutual exclusion on the mutex, hold-and-wait by the producer, no preemption of semaphores, and a two-process circular wait.</p>
<p><strong>The rule this illustrates:</strong> always acquire the <em>counting</em> semaphore (the resource) before the <em>mutex</em> (the lock), and release in the reverse order. More generally, establish a global lock-ordering discipline and never block on a resource while holding a lock.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">2</span><div>Give three distinct solutions to the Dining Philosophers deadlock and identify which Coffman
 condition each one breaks.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m3l2_p2')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m3l2_p2')">Show solution</button></div>
  <div class="hint" id="h_m3l2_p2">Recall the four conditions: mutual exclusion, hold-and-wait, no preemption, circular wait.</div>
  <div class="sol" id="s_m3l2_p2"><p><strong>1. Asymmetry (resource ordering).</strong> Odd-numbered philosophers take the left fork first, even-numbered take the right. Equivalently, number the forks globally and require everyone to acquire the lower number first. This breaks <strong>circular wait</strong> — with a total ordering on resources, a cycle is impossible. This is the standard fix in real systems, where it is called lock ordering.</p>
<p><strong>2. Allow at most four philosophers at the table</strong> (a counting semaphore initialised to 4). With five forks and only four contenders, at least one philosopher can always obtain both. This breaks <strong>hold-and-wait</strong> in aggregate by ensuring the demand can never exhaust the supply.</p>
<p><strong>3. Atomic acquisition of both forks.</strong> A philosopher takes both forks inside one critical section or takes neither — no partial acquisition. This breaks <strong>hold-and-wait</strong> directly: a philosopher never holds one fork while waiting for another.</p>
<p>A fourth option, breaking <strong>no preemption</strong>: use a timeout, so a philosopher who cannot get the second fork within a deadline puts the first one back and retries. Beware that a naive version causes <em>livelock</em>, where everyone retries in lockstep forever — real implementations add randomised backoff, exactly as Ethernet does for collisions.</p></div>
</div>
</div>

<div class="quiz-section"><h3><span class="qico">&#9673;</span> Check Your Understanding</h3>
<div class="quiz-q"><p>In the bounded-buffer solution, why must the producer call <code>wait(empty)</code> <em>before</em> <code>wait(mutex)</code>?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. It is faster that way</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Otherwise a full buffer causes deadlock &mdash; the producer sleeps holding the mutex</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. The semaphores must be acquired alphabetically</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. mutex must always be acquired last for correctness of the count</div></div><div class="quiz-explain">If the producer takes the mutex first and then finds the buffer full, it sleeps on <code>empty</code> while still holding the mutex. The consumer &mdash; the only party that could free a slot &mdash; then blocks trying to acquire that mutex. Classic circular wait. The rule generalises: acquire the resource semaphore before the lock, and release in reverse order.</div></div>
<div class="quiz-q"><p>In the readers-preference solution to readers&ndash;writers, what is the failure mode?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Readers can corrupt each other&rsquo;s data</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Writers can be starved indefinitely by a continuous stream of readers</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Only one reader can read at a time</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. The read_count variable is unprotected</div></div><div class="quiz-explain">The first reader locks out writers and the last one releases them. If readers keep arriving before the count reaches zero, <code>rw_mutex</code> is never signalled and a waiting writer never runs. The system makes progress throughout &mdash; so this is starvation, not deadlock. Writers-preference variants and fair queueing fix it; PostgreSQL sidesteps it entirely with MVCC, where readers never block writers.</div></div>
<div class="quiz-q"><p>Five philosophers each pick up their left fork simultaneously. What has occurred, and which Coffman condition does the "at most four seated" rule eliminate?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Starvation; eliminates mutual exclusion</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Deadlock; eliminates hold-and-wait by capping demand below supply</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Livelock; eliminates no-preemption</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Race condition; eliminates circular wait</div></div><div class="quiz-explain">All five hold one fork and wait for another that will never be released &mdash; deadlock. Limiting the table to four contenders for five forks guarantees at least one philosopher can obtain both, so the aggregate demand can always be satisfied. The asymmetric-ordering solution attacks a different condition, breaking <em>circular wait</em> by imposing a total order on resources.</div></div>
<div class="quiz-q"><p>A philosopher who cannot get the second fork puts the first one down, waits a fixed interval, and retries. All five do this in lockstep forever. What is this called?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Deadlock</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Starvation</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Livelock</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Priority inversion</div></div><div class="quiz-explain">The processes are not blocked &mdash; they are actively executing, changing state, and consuming CPU &mdash; yet no one makes progress. That is <strong>livelock</strong>, distinct from deadlock where processes are blocked and idle. The standard fix is randomised exponential backoff, so the symmetry breaks; Ethernet&rsquo;s collision handling uses the same idea.</div></div>
<button class="quiz-reset" onclick="resetQuiz(this)">&#8634; Reset these questions</button></div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>Producer–consumer: <code>empty</code> and <code>full</code> counting semaphores, plus a mutex. Order matters.</li><li>Always acquire the resource semaphore before the mutex, and release in reverse order.</li><li>Readers–writers has a starvation trade-off; databases sidestep it with MVCC.</li><li>Dining philosophers is the canonical circular-wait illustration — break it with lock ordering.</li></ul></div>`
  },
  "m4l0": {
    mod: "MODULE 4 — Deadlocks",
    title: "Deadlock Conditions",
    level: "Intermediate",
    time: "20 min",
    industry: "Critical for Reliability",
    prev: "m3l2",
    next: "m4l1",
    content: `
<h2>What is a Deadlock?</h2>
<p>A set of processes is deadlocked when <strong>every process in the set is waiting for an event that can only be caused by another process in the set.</strong> Nobody can make progress. Ever.</p>

<div class="callout analogy">
Two cars on a one-lane bridge from opposite ends. Car A won't reverse until Car B moves. Car B won't reverse until Car A moves. Both wait indefinitely. Deadlock.
</div>

<h2>The Four Necessary Conditions (Coffman, 1971)</h2>
<p>A deadlock can only occur if <strong>all four</strong> conditions hold simultaneously:</p>

<table>
  <tr><th>Condition</th><th>Meaning</th><th>Example</th></tr>
  <tr><td><strong>1. Mutual Exclusion</strong></td><td>At least one resource is held in non-shareable mode</td><td>A printer can only be used by one process at a time</td></tr>
  <tr><td><strong>2. Hold and Wait</strong></td><td>A process holds at least one resource while waiting for more</td><td>Process holds Lock A, waits for Lock B</td></tr>
  <tr><td><strong>3. No Preemption</strong></td><td>Resources can't be forcibly taken from a process — only voluntarily released</td><td>Can't take a database lock from a running transaction</td></tr>
  <tr><td><strong>4. Circular Wait</strong></td><td>P1 waits for P2, P2 waits for P3, P3 waits for P1</td><td>A cycle in the wait-for graph</td></tr>
</table>

<div class="callout warning">
Eliminating ANY ONE of these four conditions prevents deadlock. This is the foundation of all deadlock prevention strategies.
</div>

<h2>Resource Allocation Graph (RAG)</h2>
<p>Visual tool to detect and reason about deadlocks.</p>
<ul>
  <li><strong>Process nodes:</strong> circles (P1, P2)</li>
  <li><strong>Resource nodes:</strong> rectangles with dots (each dot = one instance)</li>
  <li><strong>Request edge:</strong> P → R (process requests resource)</li>
  <li><strong>Assignment edge:</strong> R → P (resource assigned to process)</li>
</ul>

<div class="diagram"><div class="d-title">Resource Allocation Graph — deadlock present</div>Single-instance resources. Circles = processes, boxes = resources.

        request                assignment
   (P1) --------&gt; [R2] ................&gt; (P2)
    ^                                      |
    | assignment                           | request
    |                                      v
   [R1] &lt;---------------------------------- 
        (P2 requests R1, which is assigned to P1)

Read the cycle:  P1 -&gt; R2 -&gt; P2 -&gt; R1 -&gt; P1

  P1 holds R1 and is waiting for R2
  P2 holds R2 and is waiting for R1

Neither can proceed. With ONE instance of each resource,
a cycle in the graph means DEADLOCK.

------------------------------------------------------------
Multi-instance resources:
  a cycle is NECESSARY but NOT SUFFICIENT.
  If R2 had two instances, the second could satisfy P1
  and the cycle would resolve itself.</div>

<h2>Four Strategies to Handle Deadlocks</h2>
<table>
  <tr><th>Strategy</th><th>Approach</th><th>Cost</th><th>Used Where</th></tr>
  <tr><td><strong>Prevention</strong></td><td>Ensure at least one Coffman condition can never hold</td><td>Restrictive, resource waste</td><td>Some embedded systems</td></tr>
  <tr><td><strong>Avoidance</strong></td><td>Dynamically check if granting a request would lead to deadlock</td><td>Must know max needs upfront</td><td>Batch systems (Banker's)</td></tr>
  <tr><td><strong>Detection + Recovery</strong></td><td>Let deadlock happen, detect it, recover</td><td>Recovery overhead</td><td>Databases</td></tr>
  <tr><td><strong>Ignore (Ostrich)</strong></td><td>Pretend deadlocks don't happen, reboot when they do</td><td>Occasional system freeze</td><td>Windows, Linux desktop!</td></tr>
</table>

<div class="callout industry-note">
<strong>Linux and Windows use the Ostrich algorithm for most resource types.</strong> Deadlocks are rare in well-designed systems, and the overhead of constant avoidance/detection isn't worth it for general OS purposes. However, <strong>databases (MySQL, PostgreSQL, Oracle) implement deadlock detection</strong> — they maintain a wait-for graph and periodically check for cycles. When found, they abort the "cheapest" transaction to break the cycle.
</div>

<div class="quiz-section"><h3><span class="qico">◉</span> Check Your Understanding</h3>
<div class="quiz-q">
    <p>Which of the four Coffman conditions is broken by requiring processes to request all resources at once?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Mutual exclusion</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Hold and wait</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. No preemption</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Circular wait</div></div>
    <div class="quiz-explain">All-or-nothing acquisition means a process never holds one resource while waiting for another — that is precisely hold-and-wait. The cost is poor utilisation: a process must reserve everything it might need for its entire lifetime, even resources used only briefly at the end.</div>
  </div>
<div class="quiz-q">
    <p>In a resource allocation graph with <em>multiple</em> instances per resource, what does a cycle indicate?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Deadlock is certain</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Deadlock is possible but not certain</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. No deadlock is possible</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. The graph is malformed</div></div>
    <div class="quiz-explain">With single instances, a cycle means deadlock. With multiple instances a cycle is <em>necessary but not sufficient</em> — another instance of the contested resource may be released by a process outside the cycle, breaking it. You must run the detection algorithm rather than relying on the picture.</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div>

<div class="practice"><h3><span class="pico">&#9998;</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied &mdash; check every digit.</p>
<div class="prob"><div class="prob-q"><span class="prob-n">1</span><div>For each mitigation, name which Coffman condition it eliminates and give one practical cost: (a) require all resources to be requested at once, (b) impose a global lock ordering, (c) allow the OS to forcibly reclaim resources, (d) make a resource shareable.</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m4l0_p1')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m4l0_p1')">Show solution</button></div><div class="hint" id="h_m4l0_p1">The four conditions are mutual exclusion, hold-and-wait, no preemption, and circular wait.</div><div class="sol" id="s_m4l0_p1"><p><strong>(a) All-at-once acquisition &rarr; eliminates <em>hold-and-wait</em>.</strong> A process never holds one resource while waiting for another. <em>Cost:</em> severe under-utilisation &mdash; a process must reserve everything it might need for its whole lifetime, including resources used only briefly at the end. It also needs to know its full requirement in advance, which is often impossible.</p>
<p><strong>(b) Global lock ordering &rarr; eliminates <em>circular wait</em>.</strong> With a total order on resources, a cycle cannot form. <em>Cost:</em> requires discipline across the entire codebase and every library; one call site violating the order reintroduces the bug. This is nonetheless the standard fix in real systems, because the runtime cost is zero.</p>
<p><strong>(c) Forcible reclamation &rarr; eliminates <em>no preemption</em>.</strong> <em>Cost:</em> the victim must roll back to a checkpoint, so all work since then is lost, and it only applies to resources whose state can be saved and restored. You cannot meaningfully preempt a half-written file or a printer mid-page.</p>
<p><strong>(d) Making a resource shareable &rarr; eliminates <em>mutual exclusion</em>.</strong> <em>Cost:</em> only possible for genuinely shareable resources such as read-only files. Most interesting resources (printers, write locks, exclusive device access) are inherently exclusive, so this is rarely available &mdash; it is the least practical of the four in general.</p></div></div>
<div class="prob"><div class="prob-q"><span class="prob-n">2</span><div>Two threads deadlock in production. Thread A holds lock <code>accounts</code> and waits for <code>orders</code>;
thread B holds <code>orders</code> and waits for <code>accounts</code>. Draw the wait-for graph, verify all four
Coffman conditions, and give the minimal code change that prevents recurrence.</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m4l0_p2')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m4l0_p2')">Show solution</button></div><div class="hint" id="h_m4l0_p2">The wait-for graph has just two nodes. For the fix, ask which single condition is cheapest to break without changing the resources themselves.</div><div class="sol" id="s_m4l0_p2"><pre class="mini">Wait-for graph:

     +--------&gt; A --------+
     |                    |
     |  waits for orders  |  waits for accounts
     |                    v
     +-------- B &lt;--------+

  A -&gt; B  (A wants orders, held by B)
  B -&gt; A  (B wants accounts, held by A)

A cycle of length 2 = DEADLOCK (single-instance locks).</pre>
<p><strong>All four conditions verified:</strong></p>
<ul>
<li><em>Mutual exclusion</em> &mdash; both are exclusive write locks.</li>
<li><em>Hold and wait</em> &mdash; each holds one lock while requesting the second.</li>
<li><em>No preemption</em> &mdash; neither lock can be taken away; the holder must release it.</li>
<li><em>Circular wait</em> &mdash; the two-node cycle above.</li>
</ul>
<p><strong>Minimal fix: impose a global lock ordering.</strong> Rank the locks (alphabetically, or by a fixed numeric ID) and require every thread to acquire in that order &mdash; <code>accounts</code> always before <code>orders</code>. Thread B must now take <code>accounts</code> first, so it can no longer hold <code>orders</code> while waiting. The cycle is structurally impossible.</p>
<p>This breaks <em>circular wait</em>, which is almost always the right condition to attack: it costs nothing at runtime, needs no OS support, and requires no advance knowledge of resource needs. Enforce it by routing all lock acquisition through a helper that sorts by ID, so no call site can get the order wrong.</p></div></div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>Four Coffman conditions: mutual exclusion, hold-and-wait, no preemption, circular wait. <strong>All four</strong> must hold.</li><li>Breaking any single one prevents deadlock.</li><li>Single-instance resources: a cycle in the RAG <em>is</em> deadlock. Multi-instance: a cycle is necessary but not sufficient.</li><li>Linux and Windows largely use the ostrich algorithm; databases genuinely detect and recover.</li></ul></div>`
  },
  "m4l1": {
    mod: "MODULE 4 — Deadlocks",
    title: "Banker's Algorithm",
    level: "Advanced",
    time: "35 min",
    industry: "Algorithm Design",
    prev: "m4l0",
    next: "m4l2",
    content: `
<h2>Deadlock Avoidance — the idea</h2>
<p>Prevention works by structurally forbidding one of the four Coffman conditions, which is
restrictive and wasteful. <strong>Avoidance</strong> is less blunt: allow any request in principle, but
before granting it, check whether the resulting state could still lead to everyone finishing.
If not, make the requester wait.</p>

<h2>Safe, Unsafe, and Deadlocked States</h2>
<p>A state is <strong>safe</strong> if there exists at least one <em>safe sequence</em> — an ordering of processes
in which each can obtain everything it still needs from the currently free resources plus whatever
the earlier processes in the sequence release when they finish.</p>

<div class="diagram"><div class="d-title">State Classification</div>+-----------------------------------------------------+
|  SAFE                                               |
|  A safe sequence exists.                            |
|  Deadlock is IMPOSSIBLE from here.                  |
|                                                     |
|   +---------------------------------------------+   |
|   |  UNSAFE                                     |   |
|   |  No safe sequence exists.                   |   |
|   |  Deadlock is POSSIBLE -- but not certain.   |   |
|   |                                             |   |
|   |    +-----------------------------------+    |   |
|   |    |  DEADLOCKED                       |    |   |
|   |    |  Circular wait already exists.    |    |   |
|   |    +-----------------------------------+    |   |
|   +---------------------------------------------+   |
+-----------------------------------------------------+

KEY POINT: unsafe does NOT mean deadlocked. It means the OS can
no longer GUARANTEE that deadlock is avoidable, so a conservative
algorithm refuses to enter that region at all.</div>

<h2>The Banker's Algorithm</h2>
<p>Dijkstra's analogy: a banker never commits so much cash to loans that some customer cannot
eventually be paid out in full. Each customer declares a credit limit up front; the banker grants
a drawdown only if, in the worst case, every customer can still be satisfied one after another.</p>

<div class="code-block"><pre>Data structures  (n processes, m resource types)

  Available[m]        free instances of each resource
  Max[n][m]           maximum each process will ever need (declared up front)
  Allocation[n][m]    currently held by each process
  Need[n][m]          Max - Allocation   (still outstanding)</pre></div>

<h3>The Safety Algorithm</h3>
<div class="code-block"><pre>Work   = Available          (copy)
Finish = [false] * n

loop:
    find an i with  Finish[i] == false  AND  Need[i] &lt;= Work
    if found:
        Work    = Work + Allocation[i]     # it finishes and releases everything
        Finish[i] = true
        repeat
    else:
        break

if all Finish[i] == true:  SAFE
else:                      UNSAFE</pre></div>

<h2>Worked Example</h2>
<p>Five processes, three resource types A, B, C. <strong>Available = [3, 3, 2]</strong>.</p>

<div class="mat-row">
<table class="calc mat"><tr><th>Allocation</th><th>A</th><th>B</th><th>C</th></tr><tr><td><strong>P0</strong></td><td>0</td><td>1</td><td>0</td></tr><tr><td><strong>P1</strong></td><td>2</td><td>0</td><td>0</td></tr><tr><td><strong>P2</strong></td><td>3</td><td>0</td><td>2</td></tr><tr><td><strong>P3</strong></td><td>2</td><td>1</td><td>1</td></tr><tr><td><strong>P4</strong></td><td>0</td><td>0</td><td>2</td></tr></table>
<table class="calc mat"><tr><th>Max</th><th>A</th><th>B</th><th>C</th></tr><tr><td><strong>P0</strong></td><td>7</td><td>5</td><td>3</td></tr><tr><td><strong>P1</strong></td><td>3</td><td>2</td><td>2</td></tr><tr><td><strong>P2</strong></td><td>9</td><td>0</td><td>2</td></tr><tr><td><strong>P3</strong></td><td>2</td><td>2</td><td>2</td></tr><tr><td><strong>P4</strong></td><td>4</td><td>3</td><td>3</td></tr></table>
<table class="calc mat"><tr><th>Need = Max − Alloc</th><th>A</th><th>B</th><th>C</th></tr><tr><td><strong>P0</strong></td><td>7</td><td>4</td><td>3</td></tr><tr><td><strong>P1</strong></td><td>1</td><td>2</td><td>2</td></tr><tr><td><strong>P2</strong></td><td>6</td><td>0</td><td>0</td></tr><tr><td><strong>P3</strong></td><td>0</td><td>1</td><td>1</td></tr><tr><td><strong>P4</strong></td><td>4</td><td>3</td><td>1</td></tr></table>
</div>

<p>First compute <strong>Need</strong> by subtracting element-wise. Then run the safety algorithm:</p>
<div class="diagram"><div class="d-title">Safety Algorithm Trace</div>Step 1: Need[P1] = [1, 2, 2]  &lt;=  Work = [3, 3, 2]   OK
        Work = [3, 3, 2] + Alloc[P1] [2, 0, 0] = [5, 3, 2]
        Finish[P1] = true

Step 2: Need[P3] = [0, 1, 1]  &lt;=  Work = [5, 3, 2]   OK
        Work = [5, 3, 2] + Alloc[P3] [2, 1, 1] = [7, 4, 3]
        Finish[P3] = true

Step 3: Need[P0] = [7, 4, 3]  &lt;=  Work = [7, 4, 3]   OK
        Work = [7, 4, 3] + Alloc[P0] [0, 1, 0] = [7, 5, 3]
        Finish[P0] = true

Step 4: Need[P2] = [6, 0, 0]  &lt;=  Work = [7, 5, 3]   OK
        Work = [7, 5, 3] + Alloc[P2] [3, 0, 2] = [10, 5, 5]
        Finish[P2] = true

Step 5: Need[P4] = [4, 3, 1]  &lt;=  Work = [10, 5, 5]   OK
        Work = [10, 5, 5] + Alloc[P4] [0, 0, 2] = [10, 5, 7]
        Finish[P4] = true

All processes finished  =&gt;  SAFE
Safe sequence: P1 -&gt; P3 -&gt; P0 -&gt; P2 -&gt; P4</div>

<div class="callout deepdive">
<strong>Why P0 cannot go first.</strong> Need[P0] = [7, 4, 3] but Work starts at [3, 3, 2] — P0 needs 7 of A
and only 3 are free. P1 needs just [1, 2, 2], which fits, so P1 runs, finishes, and returns its
[2, 0, 0] to the pool. That release is what unblocks the rest. The safe sequence is not unique:
P1 -> P3 -> P0 -> P2 -> P4 is the one this algorithm finds, but others exist. You only
need to demonstrate <em>one</em>.
</div>

<h3>The Resource-Request Algorithm</h3>
<p>When process P<sub>i</sub> actually requests resources, three tests run in order:</p>
<div class="code-block"><pre>1. if Request[i] &gt; Need[i]      -&gt; ERROR: exceeds declared maximum
2. if Request[i] &gt; Available    -&gt; WAIT: not enough free right now
3. otherwise, PRETEND to grant it:
       Available  = Available  - Request[i]
       Allocation[i] = Allocation[i] + Request[i]
       Need[i]    = Need[i]    - Request[i]
   then run the Safety Algorithm on this hypothetical state.
       SAFE   -&gt; commit the grant
       UNSAFE -&gt; roll back all three lines, make the process wait</pre></div>

<h4>Scenario 1 — P1 requests (1, 0, 2)</h4>
<p>Check: (1,0,2) ≤ Need[P1] [1, 2, 2] ✓ and (1,0,2) ≤ Available [3, 3, 2] ✓. Pretend-grant gives
Available = [2, 3, 0], Allocation[P1] = [3, 0, 2], Need[P1] = [0, 2, 0].</p>
<p>Safety check on the new state: <strong class="good">SAFE</strong>, sequence
P1 -> P3 -> P0 -> P2 -> P4. <strong>Request granted.</strong></p>

<h4>Scenario 2 — from that new state, P0 requests (0, 2, 0)</h4>
<p>Check: (0,2,0) ≤ Need[P0] [7, 4, 3] ✓ and (0,2,0) ≤ Available [2, 3, 0] ✓. Both preliminary tests pass,
so a naive allocator would grant it. Run the safety check:</p>
<p><strong class="bad">UNSAFE — no safe sequence exists.</strong> The request is refused and P0 blocks,
even though the resources are physically sitting free.</p>

<div class="callout warning">
<strong>This is the whole point of the algorithm.</strong> The resources <em>are</em> available. A first-come
allocator would hand them over and the system might later deadlock. Banker's refuses because it
cannot prove every process could still finish afterwards. It is deliberately
<strong>conservative</strong>: it rejects some requests that would in fact have been harmless.
</div>

<h4>Scenario 3 — P4 requests (3, 3, 0)</h4>
<p>Available is [2, 3, 0]; the request needs 3 of B but only 3 are free. Rejected at test 2 —
<strong>P4 simply waits</strong>. No safety check is even needed.</p>

<div class="callout deepdive">
<strong>Complexity and why nobody ships this.</strong> One safety check is O(n² × m); it runs on
<em>every</em> resource request. Worse, the algorithm requires each process to declare its maximum
resource needs in advance, which real programs cannot do — a web server has no idea how many file
descriptors it will need. The process and resource counts must also be fixed. So general-purpose
kernels do not use Banker's. It survives in specialised batch and safety-critical embedded systems,
and in exams — where it is a superb test of whether you can execute a precise algorithm by hand.
</div>

<div class="quiz-section"><h3><span class="qico">◉</span> Check Your Understanding</h3>
<div class="quiz-q">
    <p>A state is <em>unsafe</em>. What does that tell you?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. The system is deadlocked right now</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Deadlock is possible but not certain</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. At least one process has crashed</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. All resources are exhausted</div></div>
    <div class="quiz-explain">Unsafe means no safe sequence can be proven — the OS can no longer guarantee that every process could finish. Deadlock may still never occur, because processes often request far less than their declared maximum. Banker&rsquo;s is conservative by design and refuses to enter the unsafe region at all.</div>
  </div>
<div class="quiz-q">
    <p>In the worked example, why is the safe sequence found as P1 → P3 → P0 → P2 → P4 rather than starting with P0?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. P0 has the lowest priority</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Need[P0] exceeds the initially available resources</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. P0 already holds too many resources</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. The algorithm always starts with P1</div></div>
    <div class="quiz-explain">Need[P0] = [7, 4, 3] requires 7 instances of A, but only 3 are free at the start. P0 cannot be the first to finish. P1 needs only [1, 2, 2], which fits within [3, 3, 2], so it runs first and releases [2, 0, 0] back into the pool — which is what makes progress possible for the others.</div>
  </div>
<div class="quiz-q">
    <p>A request passes both preliminary tests (within Need, within Available) but the safety check returns UNSAFE. What does the algorithm do?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Grant it — the resources are free</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Roll back the hypothetical grant and block the process</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Terminate the requesting process</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Preempt resources from another process</div></div>
    <div class="quiz-explain">The grant is only ever hypothetical until the safety check passes. On UNSAFE, all three modifications (Available, Allocation, Need) are reversed and the process waits until the state changes — typically when some other process releases resources. Nothing is terminated and nothing is preempted; that is the detection-and-recovery approach, not avoidance.</div>
  </div>
<div class="quiz-q">
    <p>Which requirement makes the Banker&rsquo;s algorithm impractical for a general-purpose OS?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. It needs specialised hardware support</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Processes must declare maximum resource needs in advance</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. It only works with a single resource type</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. It cannot detect circular wait</div></div>
    <div class="quiz-explain">Advance declaration of maximum needs is the blocking obstacle — real applications genuinely cannot predict their peak requirements. The O(n²m) cost per request is a secondary problem. General-purpose systems instead use detection with recovery (databases) or simply ignore deadlock (the ostrich approach used by Linux and Windows for most resource types).</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div>

<div class="practice"><h3><span class="pico">✎</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied — check every digit.</p>
<div class="prob">
  <div class="prob-q"><span class="prob-n">1</span><div>Five processes, four resource types A B C D. <strong>Available = [1, 5, 2, 0]</strong>.
 <div class="mat-row"><table class="calc mat"><tr><th>Allocation</th><th>A</th><th>B</th><th>C</th><th>D</th></tr><tr><td><strong>P0</strong></td><td>0</td><td>0</td><td>1</td><td>2</td></tr><tr><td><strong>P1</strong></td><td>1</td><td>0</td><td>0</td><td>0</td></tr><tr><td><strong>P2</strong></td><td>1</td><td>3</td><td>5</td><td>4</td></tr><tr><td><strong>P3</strong></td><td>0</td><td>6</td><td>3</td><td>2</td></tr><tr><td><strong>P4</strong></td><td>0</td><td>0</td><td>1</td><td>4</td></tr></table><table class="calc mat"><tr><th>Max</th><th>A</th><th>B</th><th>C</th><th>D</th></tr><tr><td><strong>P0</strong></td><td>0</td><td>0</td><td>1</td><td>2</td></tr><tr><td><strong>P1</strong></td><td>1</td><td>7</td><td>5</td><td>0</td></tr><tr><td><strong>P2</strong></td><td>2</td><td>3</td><td>5</td><td>6</td></tr><tr><td><strong>P3</strong></td><td>0</td><td>6</td><td>5</td><td>2</td></tr><tr><td><strong>P4</strong></td><td>0</td><td>6</td><td>5</td><td>6</td></tr></table></div>
 Compute the <strong>Need</strong> matrix and determine whether the state is safe. If it is, give a safe sequence.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m4l1_p1')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m4l1_p1')">Show solution</button></div>
  <div class="hint" id="h_m4l1_p1">Need = Max − Allocation, element by element. Then look for any process whose entire Need row fits inside Work = Available. Take it, add its Allocation to Work, and repeat.</div>
  <div class="sol" id="s_m4l1_p1"><table class="calc mat"><tr><th>Need</th><th>A</th><th>B</th><th>C</th><th>D</th></tr><tr><td><strong>P0</strong></td><td>0</td><td>0</td><td>0</td><td>0</td></tr><tr><td><strong>P1</strong></td><td>0</td><td>7</td><td>5</td><td>0</td></tr><tr><td><strong>P2</strong></td><td>1</td><td>0</td><td>0</td><td>2</td></tr><tr><td><strong>P3</strong></td><td>0</td><td>0</td><td>2</td><td>0</td></tr><tr><td><strong>P4</strong></td><td>0</td><td>6</td><td>4</td><td>2</td></tr></table>
<div class="diagram"><div class="d-title">Safety trace</div>Step 1: Need[P0]=[0, 0, 0, 0] &lt;= Work=[1, 5, 2, 0]  -&gt; Work=[1, 5, 3, 2]
Step 2: Need[P2]=[1, 0, 0, 2] &lt;= Work=[1, 5, 3, 2]  -&gt; Work=[2, 8, 8, 6]
Step 3: Need[P1]=[0, 7, 5, 0] &lt;= Work=[2, 8, 8, 6]  -&gt; Work=[3, 8, 8, 6]
Step 4: Need[P3]=[0, 0, 2, 0] &lt;= Work=[3, 8, 8, 6]  -&gt; Work=[3, 14, 11, 8]
Step 5: Need[P4]=[0, 6, 4, 2] &lt;= Work=[3, 14, 11, 8]  -&gt; Work=[3, 14, 12, 12]

SAFE. Sequence: P0 -&gt; P2 -&gt; P1 -&gt; P3 -&gt; P4</div>
<p>The state is <strong class="good">SAFE</strong> with sequence <strong>P0 → P2 → P1 → P3 → P4</strong>.</p>
<p>P0 goes first because Need[P0] = [0, 0, 0, 0] is already all zeros — it has everything it asked for and can finish immediately, releasing [0, 0, 1, 2].</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">2</span><div>From that same initial state, process P1 requests <code>[0, 4, 2, 0]</code>. Should the banker grant it? Work through all three tests.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m4l1_p2')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m4l1_p2')">Show solution</button></div>
  <div class="hint" id="h_m4l1_p2">Test 1: is the request within Need[P1]? Test 2: is it within Available? Only if both pass do you run the full safety algorithm on the hypothetical state.</div>
  <div class="sol" id="s_m4l1_p2"><p><strong>Test 1:</strong> Request [0,4,2,0] ≤ Need[P1] [0, 7, 5, 0]? Yes — 0≤0, 4≤7, 2≤5, 0≤0. Passes.</p>
<p><strong>Test 2:</strong> Request [0,4,2,0] ≤ Available [1, 5, 2, 0]? Yes — 0≤1, 4≤5, 2≤2, 0≤0. Passes.</p>
<p><strong>Test 3:</strong> pretend-grant, then run the safety algorithm. Result: <strong class="good">SAFE</strong>, sequence P0 → P2 → P1 → P3 → P4.</p>
<p><strong>Decision: grant the request.</strong></p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">3</span><div><strong>Conceptual.</strong> Explain why the Banker&rsquo;s algorithm may deny a request for resources that are
 physically free and sitting idle. Is this a bug or intended behaviour?</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m4l1_p3')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m4l1_p3')">Show solution</button></div>
  <div class="hint" id="h_m4l1_p3">Consider what the algorithm is trying to guarantee, and what information it has that a simple first-come allocator does not.</div>
  <div class="sol" id="s_m4l1_p3"><p>It is entirely intended. Banker&rsquo;s does not ask "can I satisfy this request?" — that is the easy question, answered by comparing against Available. It asks the much stronger question: <em>"if I grant this, can I still guarantee that every process will eventually finish, even in the worst case where each one demands its full declared maximum?"</em></p>
<p>Granting resources that are free may leave too little in reserve to complete <em>any</em> process, which is precisely the unsafe region. Scenario 2 above is exactly this case: (0,2,0) is available, but handing it over means no process can be guaranteed to finish.</p>
<p>The cost of this guarantee is reduced utilisation — some safe-in-practice requests get refused, and resources sit idle that could have been used. That is the deliberate trade: Banker&rsquo;s buys an absolute safety guarantee with a measure of throughput. Systems that prefer throughput use detection and recovery instead, accepting occasional deadlock in exchange for never refusing an available resource.</p></div>
</div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li><strong>Need = Max − Allocation.</strong> Compute this first, every time.</li><li>Safety algorithm: repeatedly find a process whose Need fits in Work, add its Allocation to Work, mark it finished.</li><li><strong>Unsafe ≠ deadlocked</strong> — unsafe means the guarantee is lost, not that deadlock has occurred.</li><li>A request is granted only if the <em>hypothetical</em> post-grant state is safe; otherwise it is rolled back.</li><li>Requires advance declaration of maximum needs and costs O(n²m) per request — hence exam-only, not production.</li></ul></div>`
  },
  "m4l2": {
    mod: "MODULE 4 — Deadlocks",
    title: "Detection & Recovery",
    level: "Intermediate",
    time: "35 min",
    industry: "Database Engineering",
    prev: "m4l1",
    next: "m5l0",
    content: `
<h2>Deadlock Detection</h2>
<p>Instead of preventing or avoiding deadlock, let it happen — then detect and recover. This is what real databases do.</p>

<h3>Wait-For Graph (Single Instance Resources)</h3>
<p>Simplified RAG — just processes, no resource nodes. Pi → Pj means "Pi is waiting for a resource held by Pj."</p>
<p><strong>Deadlock exists if and only if there's a cycle in the wait-for graph.</strong></p>

<h3>Detection Algorithm (Multi-instance)</h3>
<p>Similar to Banker's Safety Algorithm but without the Max matrix (we don't need to know max needs):</p>

<div class="code-block" data-lang="Pseudocode">
<pre>Work = Available.copy()
Finish[i] = (Allocation[i] == 0) ? true : false

<span class="kw">loop</span>:
    Find i where: Finish[i] == false AND Request[i] <= Work
    If found:
        Work = Work + Allocation[i]
        Finish[i] = true
    Else: Break

If Finish[i] == false for any i:
    → Process i is DEADLOCKED</pre>
</div>

<h2>When to Run Detection?</h2>
<ul>
  <li><strong>Every N minutes:</strong> Periodic. Deadlocks may persist for a while. Acceptable for non-critical systems.</li>
  <li><strong>When CPU utilisation drops sharply:</strong> Suggests processes are all blocked — possible deadlock.</li>
  <li><strong>Every resource request:</strong> Immediate detection but expensive overhead.</li>
</ul>

<h2>Deadlock Recovery</h2>
<h3>Option 1: Process Termination</h3>
<ul>
  <li><strong>Abort all deadlocked processes:</strong> Simple. Expensive — all work lost.</li>
  <li><strong>Abort one at a time:</strong> Run detection after each abort. Stop when deadlock broken. Which to abort first? Choose by: lowest priority, shortest job, fewest resources held, farthest from completion.</li>
</ul>

<h3>Option 2: Resource Preemption</h3>
<p>Forcibly take a resource from one process and give it to another.</p>
<ul>
  <li><strong>Selecting a victim:</strong> Minimise cost (resources held, time invested, rollback difficulty)</li>
  <li><strong>Rollback:</strong> Process that lost resources must roll back to a safe checkpoint</li>
  <li><strong>Starvation prevention:</strong> Can't always pick the same process as victim — add a cost counter</li>
</ul>

<div class="callout industry-note">
<strong>PostgreSQL detects deadlocks</strong> using a wait-for graph built from its lock manager. When a cycle is detected (default: after 1 second of waiting), it aborts one of the transactions with: <code>ERROR: deadlock detected — DETAIL: Process 12345 waits for ShareLock on transaction 678; blocked by process 9012.</code> The aborted transaction must be retried by the application. This is why robust database applications always implement <strong>retry logic with exponential backoff</strong> on deadlock errors.
</div>

<h2>Starvation vs Deadlock — Know the Difference</h2>
<table>
  <tr><th></th><th>Deadlock</th><th>Starvation</th></tr>
  <tr><td>Definition</td><td>Processes wait for each other — circular</td><td>Process waits indefinitely but system is making progress</td></tr>
  <tr><td>System state</td><td>System also blocked (no progress)</td><td>System makes progress, one process left behind</td></tr>
  <tr><td>Fix</td><td>Break circular wait</td><td>Aging / priority boost for waiting processes</td></tr>
  <tr><td>Detection</td><td>Cycle in RAG</td><td>Process wait time > threshold</td></tr>
</table>

<h2>Detection: Let It Happen, Then Find It</h2>
<p>Prevention is restrictive and avoidance needs advance knowledge. The third option is to allow
deadlock, run a detection algorithm periodically, and recover when one is found. This is what real
database engines do.</p>

<h2>Wait-For Graph (single-instance resources)</h2>
<p>Collapse the resource-allocation graph by removing resource nodes: draw an edge
P<sub>i</sub> &rarr; P<sub>j</sub> whenever P<sub>i</sub> waits for something held by P<sub>j</sub>.</p>

<div class="diagram"><div class="d-title">Wait-For Graph</div>Resource-allocation graph:          Wait-for graph:

  (P1) --&gt; [R1] --&gt; (P2)               (P1) -----&gt; (P2)
   ^                  |                  ^           |
   |                  v                  |           v
  [R2] &lt;----------- (P3)                (P3) &lt;-------+

Edge Pi -&gt; Pj means &quot;Pi is waiting for a resource held by Pj&quot;.

A cycle in the wait-for graph means DEADLOCK
  -- but ONLY for single-instance resources.
Cost to detect: O(n^2) using cycle detection on n processes.
The graph must be maintained continuously and searched
periodically, which is itself the overhead of this approach.</div>

<h2>Detection Algorithm (multi-instance)</h2>
<p>Structurally similar to the Banker's safety algorithm, but it uses the <strong>current
Request</strong> matrix rather than Max &mdash; we no longer care what a process might eventually
want, only what it is blocked on right now.</p>

<div class="code-block"><pre>Work   = Available
Finish[i] = true  if Allocation[i] is all zeros   (holds nothing -&gt; cannot be deadlocked)
          = false otherwise

loop:
    find i with Finish[i] == false AND Request[i] &lt;= Work
    if found:
        Work = Work + Allocation[i]      # assume it completes and releases
        Finish[i] = true
        repeat
    else:
        break

Any i with Finish[i] == false is DEADLOCKED.

Note the difference from Banker&#x27;s: this uses REQUEST (what the
process is blocked on now), not MAX (what it might ever need).
Detection asks &quot;is anyone stuck?&quot;, not &quot;could anyone get stuck?&quot;.</pre></div>

<h3>Worked Example &mdash; no deadlock</h3>
<p>Five processes, three resource types, <strong>Available = [0, 0, 0]</strong>.</p>
<table class="calc mat"><tr><th>Process</th><th>Alloc A B C</th><th>Request A B C</th></tr>
<tr><td><strong>P0</strong></td><td>0 1 0</td><td>0 0 0</td></tr>
<tr><td><strong>P1</strong></td><td>2 0 0</td><td>2 0 2</td></tr>
<tr><td><strong>P2</strong></td><td>3 0 3</td><td>0 0 0</td></tr>
<tr><td><strong>P3</strong></td><td>2 1 1</td><td>1 0 0</td></tr>
<tr><td><strong>P4</strong></td><td>0 0 2</td><td>0 0 2</td></tr></table>
<div class="diagram"><div class="d-title">Detection trace &mdash; safe</div>P0: Request [0, 0, 0] &lt;= Work [0, 0, 0]  -&gt; reclaim [0, 1, 0], Work = [0, 1, 0]
P2: Request [0, 0, 0] &lt;= Work [0, 1, 0]  -&gt; reclaim [3, 0, 3], Work = [3, 1, 3]
P1: Request [2, 0, 2] &lt;= Work [3, 1, 3]  -&gt; reclaim [2, 0, 0], Work = [5, 1, 3]
P3: Request [1, 0, 0] &lt;= Work [5, 1, 3]  -&gt; reclaim [2, 1, 1], Work = [7, 2, 4]
P4: Request [0, 0, 2] &lt;= Work [7, 2, 4]  -&gt; reclaim [0, 0, 2], Work = [7, 2, 6]

All processes completed. NO DEADLOCK.
Sequence: P0 -&gt; P2 -&gt; P1 -&gt; P3 -&gt; P4</div>
<p>Even with nothing free, P0 holds resources and is requesting nothing, so it can finish and
release [0,1,0]. That release cascades and everyone completes.</p>

<h3>The same state, one request different</h3>
<p>Now suppose <strong>P2 requests one additional unit of C</strong>, so Request[P2] = [0,0,1]:</p>
<div class="diagram"><div class="d-title">Detection trace &mdash; deadlocked</div>P0: Request [0, 0, 0] &lt;= Work [0, 0, 0]  -&gt; reclaim [0, 1, 0], Work = [0, 1, 0]

No further process can proceed.
DEADLOCKED: P1, P2, P3, P4</div>
<p>P0 still completes, but its [0,1,0] cannot satisfy any remaining request. Four processes are
permanently blocked.</p>

<div class="callout deepdive">
<strong>One request changed the outcome entirely.</strong> P2 was previously the process that broke the
logjam &mdash; it needed nothing, so it could finish and free [3,0,3]. Once it starts waiting, that
release never happens. This is why detection must run against live state and cannot be cached.
</div>

<h2>When to Run Detection</h2>
<table>
  <tr><th>Trigger</th><th>Cost</th><th>Latency to discovery</th></tr>
  <tr><td>On every resource request</td><td>Very high</td><td>Immediate</td></tr>
  <tr><td>Fixed interval (e.g. every 60&nbsp;s)</td><td>Low</td><td>Up to one interval</td></tr>
  <tr><td>When CPU utilisation drops below a threshold</td><td>Low</td><td>Heuristic</td></tr>
  <tr><td>After a lock wait exceeds a timeout</td><td>Low</td><td>Bounded by the timeout</td></tr>
</table>

<h2>Recovery</h2>
<p><strong>Process termination</strong> &mdash; abort all deadlocked processes (simple, maximum work
lost), or abort one at a time re-running detection after each (cheaper, but detection runs
repeatedly). Victim choice should weigh priority, CPU time already invested, resources held, and
how many processes must be aborted in total.</p>

<p><strong>Resource preemption</strong> &mdash; take a resource away and give it to another process.
This requires three decisions: victim selection, <strong>rollback</strong> to a safe checkpoint (a
process that loses a resource mid-operation usually cannot simply continue), and
<strong>starvation prevention</strong>, since always picking the cheapest victim may mean the same
process is chosen every time. Track how often each process has been victimised and factor it in.</p>

<div class="callout industry-note">
<strong>How PostgreSQL does it.</strong> Every lock wait starts a timer set by
<code>deadlock_timeout</code> (default 1&nbsp;s). Only when that expires does PostgreSQL build a
wait-for graph and search for a cycle &mdash; so the common case of a brief wait costs nothing. On
finding a cycle it aborts the transaction that detected it, emitting
<code>ERROR: deadlock detected</code> with SQLSTATE <code>40P01</code>. The application is expected
to retry. <strong>MySQL/InnoDB</strong> detects immediately rather than on a timer and rolls back the
transaction that has modified the fewest rows. In both cases the correct client-side pattern is a
retry loop with exponential backoff and jitter &mdash; deadlock is a normal, expected condition in a
concurrent database, not a bug to be eliminated.
</div>

<div class="quiz-section"><h3><span class="qico">&#9673;</span> Check Your Understanding</h3>
<div class="quiz-q"><p>How does the detection algorithm differ from the Banker&rsquo;s safety algorithm?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. It uses the Request matrix instead of the Max matrix</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. It does not use the Available vector</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. It runs in O(n) instead of O(n&sup2;m)</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. It only works for single-instance resources</div></div><div class="quiz-explain">Detection asks whether anyone is stuck <em>right now</em>, so it only needs what each process is currently blocked on &mdash; the Request matrix. Banker&rsquo;s asks whether anyone <em>could</em> become stuck, which requires the worst-case Max declaration. Dropping the Max requirement is exactly why detection is usable in real systems where maximum needs are unknowable.</div></div>
<div class="quiz-q"><p>In the multi-instance detection algorithm, why is <code>Finish[i]</code> initialised to <em>true</em> for a process holding no resources?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Such a process has already terminated</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. It holds nothing, so it cannot be part of a circular wait</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. It always has the highest priority</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. To make the algorithm terminate faster</div></div><div class="quiz-explain">Deadlock requires hold-and-wait: a process must be holding something others need while waiting itself. A process holding nothing contributes no edge that could complete a cycle, so it can be excluded immediately. It may still be waiting, but its wait cannot be part of the deadlock.</div></div>
<div class="quiz-q"><p>A cycle exists in a resource-allocation graph with <em>multiple</em> instances of each resource. What can you conclude?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Deadlock definitely exists</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Deadlock may exist &mdash; run the detection algorithm</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Deadlock definitely does not exist</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. The graph is invalid</div></div><div class="quiz-explain">With multiple instances a cycle is <strong>necessary but not sufficient</strong>. Another instance of a contested resource may be freed by a process outside the cycle, breaking it. Only with exactly one instance of each resource does a cycle guarantee deadlock. You must run the algorithm rather than trusting the picture.</div></div>
<div class="quiz-q"><p>PostgreSQL reports <code>ERROR: deadlock detected</code>. What should a well-written application do?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Restart the database server</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Retry the transaction with exponential backoff</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Increase deadlock_timeout to hide the error</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Switch the isolation level to READ UNCOMMITTED</div></div><div class="quiz-explain">Deadlock is a normal outcome of concurrent transactions, not a fault. The engine has already rolled back one transaction to break the cycle, so the correct response is to retry &mdash; with backoff and jitter so the competing transactions do not immediately collide again. Raising <code>deadlock_timeout</code> only delays detection; changing isolation level does not remove lock cycles and introduces correctness problems.</div></div>
<button class="quiz-reset" onclick="resetQuiz(this)">&#8634; Reset these questions</button></div>
<div class="practice"><h3><span class="pico">&#9998;</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied &mdash; check every digit.</p>
<div class="prob"><div class="prob-q"><span class="prob-n">1</span><div>Four processes, one resource type with <strong>7 total instances</strong>, none currently available.
<table class="calc"><tr><th>Process</th><th>Allocation</th><th>Request</th></tr>
<tr><td>P0</td><td>2</td><td>1</td></tr><tr><td>P1</td><td>1</td><td>0</td></tr>
<tr><td>P2</td><td>3</td><td>2</td></tr><tr><td>P3</td><td>1</td><td>3</td></tr></table>
Is the system deadlocked? Show the trace.</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m4l2_p1')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m4l2_p1')">Show solution</button></div><div class="hint" id="h_m4l2_p1">Start with Work = Available = 0. Look for a process requesting no more than Work &mdash; remember a process requesting 0 can always finish.</div><div class="sol" id="s_m4l2_p1"><pre class="mini">Work = 0

P1: Request 1... wait, Request[P1] = 0 &lt;= Work 0  OK
    Work = 0 + Alloc[P1] 1 = 1

P0: Request 1 &lt;= Work 1  OK
    Work = 1 + Alloc[P0] 2 = 3

P2: Request 2 &lt;= Work 3  OK
    Work = 3 + Alloc[P2] 3 = 6

P3: Request 3 &lt;= Work 6  OK
    Work = 6 + Alloc[P3] 1 = 7

All finished. <b>NO DEADLOCK.</b>
Sequence: P1 -> P0 -> P2 -> P3</pre>
<p>P1 is the key: it requests nothing, so it can complete even with zero resources free, and its single released instance is enough to unblock P0. Check the arithmetic &mdash; total allocation 2+1+3+1 = 7, matching the 7 instances with 0 available, so the state is internally consistent.</p></div></div>
<div class="prob"><div class="prob-q"><span class="prob-n">2</span><div>Take the same table but change Request[P1] from 0 to 2. Is the system deadlocked now? Which processes are involved?</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m4l2_p2')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m4l2_p2')">Show solution</button></div><div class="hint" id="h_m4l2_p2">Re-run from Work = 0. If no process can proceed on the first pass, the algorithm terminates immediately.</div><div class="sol" id="s_m4l2_p2"><pre class="mini">Work = 0

P0: Request 1 &lt;= 0 ?  NO
P1: Request 2 &lt;= 0 ?  NO
P2: Request 2 &lt;= 0 ?  NO
P3: Request 3 &lt;= 0 ?  NO

No process can proceed on the first pass.
<b>DEADLOCKED: P0, P1, P2, P3</b>  (all four)</pre>
<p>With nothing available and every process requesting at least one instance, no one can make progress, and no one will release anything because they are all blocked. All four are in the deadlock.</p>
<p>The single changed value removed the only process that could complete unaided. This is characteristic of resource deadlock: systems sit close to the boundary, and one extra request tips them over.</p></div></div>
<div class="prob"><div class="prob-q"><span class="prob-n">3</span><div><strong>Applied.</strong> A payments service running on PostgreSQL logs roughly 40 deadlock errors per hour.
Transactions update an <code>accounts</code> row and then an <code>audit_log</code> row &mdash; but a
few code paths do it in the opposite order. Diagnose the root cause and give both an immediate
mitigation and a permanent fix.</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m4l2_p3')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m4l2_p3')">Show solution</button></div><div class="hint" id="h_m4l2_p3">Which of the four Coffman conditions is being created by the inconsistent ordering? Which one is the cheapest to eliminate in application code?</div><div class="sol" id="s_m4l2_p3"><p><strong>Root cause: inconsistent lock ordering creating circular wait.</strong> Transaction A locks <code>accounts</code> then wants <code>audit_log</code>; transaction B locks <code>audit_log</code> then wants <code>accounts</code>. Each holds what the other needs &mdash; a two-node cycle in the wait-for graph. PostgreSQL detects it after <code>deadlock_timeout</code> and aborts one.</p>
<p><strong>Immediate mitigation:</strong> wrap the transaction in a retry loop &mdash; catch SQLSTATE <code>40P01</code>, retry up to 3 times with exponential backoff plus jitter. This makes the errors invisible to users and is correct because the aborted transaction was rolled back cleanly. It treats the symptom, and the deadlocks continue to occur.</p>
<p><strong>Permanent fix: impose a global lock order.</strong> Mandate that every transaction touches <code>accounts</code> before <code>audit_log</code>, without exception. A total ordering on resources makes a cycle impossible &mdash; this is the same resource-ordering solution used for Dining Philosophers, and it eliminates the <em>circular wait</em> condition outright.</p>
<p>Supporting measures: enforce ordering in a shared data-access layer rather than trusting each call site; keep transactions short to shrink the collision window; and where an audit row is genuinely independent, write it outside the transaction or via an append-only path that takes no conflicting lock. Set <code>log_lock_waits = on</code> to catch new offenders early.</p></div></div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>Detection uses a wait-for graph (single instance) or a Banker&rsquo;s-like scan without the Max matrix.</li><li>Recovery options: abort processes, or preempt resources and roll back to a checkpoint.</li><li>Victim selection should minimise cost and must avoid always choosing the same process (starvation).</li><li><strong>Deadlock</strong>: circular wait, no progress anywhere. <strong>Starvation</strong>: the system progresses, one process is left behind.</li></ul></div>`
  },
  "m5l0": {
    mod: "MODULE 5 — Threads",
    title: "Threads vs Processes",
    level: "Intermediate",
    time: "20 min",
    industry: "Used Every Day",
    prev: "m4l2",
    next: "m5l1",
    content: `
<h2>The Motivation for Threads</h2>
<p>A web server gets 10,000 requests per second. Option 1: fork() a new process per request — extremely expensive (fork cost + memory per process). Option 2: use threads — lightweight, share memory, much cheaper to create.</p>

<p>A thread is a <strong>unit of execution within a process</strong>. All threads in a process share the same address space but have their own stack and register state.</p>

<div class="diagram">
  <div class="d-title">Process vs Thread</div>
<span class="highlight">PROCESS</span>
├── Virtual address space (private)
├── Code (text segment)
├── Heap
├── Open files
├── Signal handlers
└── Thread 1
    ├── <span class="highlight2">Stack (private)</span>
    └── <span class="highlight2">Registers (private)</span>

<span class="highlight">MULTITHREADED PROCESS</span>
├── Virtual address space (SHARED)
├── Code (SHARED)
├── Heap (SHARED)
├── Open files (SHARED)
└── Thread 1          Thread 2          Thread 3
    ├── Stack (priv)  ├── Stack (priv)  ├── Stack (priv)
    └── Regs (priv)   └── Regs (priv)   └── Regs (priv)
</div>

<h2>Benefits of Threads</h2>
<ul>
  <li><strong>Responsiveness:</strong> GUI thread stays responsive while worker thread does computation</li>
  <li><strong>Resource sharing:</strong> Threads share code, heap, file descriptors — no IPC needed for communication</li>
  <li><strong>Economy:</strong> Thread creation is 10–100× cheaper than process creation</li>
  <li><strong>Scalability:</strong> Threads run in true parallel on multi-core CPUs</li>
</ul>

<h2>Threading Issues</h2>
<p>The shared memory that makes threads efficient is also their danger:</p>
<ul>
  <li><strong>Race conditions:</strong> All the synchronisation problems from Module 3</li>
  <li><strong>fork() in multithreaded programs:</strong> fork() duplicates only the calling thread. If other threads held locks, the forked process has locked mutexes with no thread to unlock them → deadlock. This is why you should only call exec() immediately after fork() in multithreaded programs.</li>
  <li><strong>Signal handling:</strong> Which thread should handle SIGINT? SIGSEGV? Complex rules.</li>
  <li><strong>Thread-local storage (TLS):</strong> Sometimes you WANT private data per thread (e.g., errno variable — must be per-thread, not shared).</li>
</ul>

<div class="callout industry-note">
<strong>Thread pools</strong> are the standard production pattern. Creating/destroying threads is expensive even if cheaper than processes. A thread pool creates N threads at startup and reuses them. Java's <code>ExecutorService</code>, Python's <code>ThreadPoolExecutor</code>, and Go's goroutine scheduler all implement thread pool concepts. Understanding the underlying thread model helps you tune pool sizes — typically: for CPU-bound work, pool size = CPU cores; for I/O-bound work, pool size = much larger (threads spend most time waiting).
</div>

<div class="quiz-section"><h3><span class="qico">◉</span> Check Your Understanding</h3>
<div class="quiz-q">
    <p>What do threads within one process <em>not</em> share?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. The heap</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Their stack and registers</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Open file descriptors</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Global variables</div></div>
    <div class="quiz-explain">Each thread needs its own stack (for its own call chain and locals) and its own register set including the program counter — otherwise they could not execute independently. Everything else, including the heap, globals and the fd table, is shared. That sharing is what makes threads fast and simultaneously what makes them dangerous.</div>
  </div>
<div class="quiz-q">
    <p>Why is calling <code>fork()</code> in a multithreaded program hazardous?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. It duplicates every thread, wasting memory</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Only the calling thread survives, so mutexes held by others stay locked forever</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. It always fails with EAGAIN</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Threads cannot call fork() at all</div></div>
    <div class="quiz-explain">The child gets a copy of the address space but only <em>one</em> thread — the caller. Any mutex held by another thread at fork time is copied in the locked state, with no thread in existence to release it. The child deadlocks on first use. This is why POSIX permits only async-signal-safe functions between fork() and exec() in a threaded program.</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div>

<div class="practice"><h3><span class="pico">&#9998;</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied &mdash; check every digit.</p>
<div class="prob"><div class="prob-q"><span class="prob-n">1</span><div>A web server must handle 10,000 concurrent connections. Compare (a) one process per connection, (b) one OS thread per connection, (c) an event loop, and (d) virtual threads &mdash; on memory, switching cost and code complexity.</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m5l0_p1')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m5l0_p1')">Show solution</button></div><div class="hint" id="h_m5l0_p1">Estimate the per-unit memory cost of each model, then multiply by 10,000.</div><div class="sol" id="s_m5l0_p1"><table class="calc">
<tr><th>Model</th><th>Memory for 10,000</th><th>Switch cost</th><th>Complexity</th></tr>
<tr><td>Process per connection</td><td>~10&nbsp;MB each &rarr; <span class="bad">100&nbsp;GB</span></td><td>Highest (TLB flush)</td><td>Low &mdash; full isolation</td></tr>
<tr><td>Thread per connection</td><td>~1&nbsp;MB stack each &rarr; <span class="bad">10&nbsp;GB virtual</span></td><td>1&ndash;10&nbsp;&micro;s</td><td>Low &mdash; but needs locking</td></tr>
<tr><td>Event loop</td><td><span class="good">~50&nbsp;MB total</span></td><td><span class="good">None &mdash; no switching</span></td><td><span class="bad">High &mdash; callback inversion</span></td></tr>
<tr><td>Virtual threads</td><td><span class="good">~2&nbsp;KB each &rarr; 20&nbsp;MB</span></td><td><span class="good">~100&nbsp;ns, user space</span></td><td><span class="good">Low &mdash; reads sequentially</span></td></tr>
</table>
<p><strong>(a) Processes</strong> are eliminated immediately &mdash; 100&nbsp;GB is absurd, and this is why the pre-fork Apache model capped out in the hundreds of connections.</p>
<p><strong>(b) Threads</strong> are borderline. The 10&nbsp;GB is <em>virtual</em> address space and only touched pages are resident, so it can work, but 10,000 kernel threads impose real scheduler pressure. This is the C10K problem.</p>
<p><strong>(c) Event loop</strong> is what nginx and Node.js do, and it is genuinely efficient. The cost is paid by the programmer: control flow inverts into callbacks or promises, and a single blocking call anywhere stalls the entire loop.</p>
<p><strong>(d) Virtual threads</strong> deliver the event loop&rsquo;s efficiency with the threaded model&rsquo;s straight-line readability &mdash; the runtime parks a virtual thread on a blocking call and reuses the carrier. This is why Go and Java 21 converged here, and for a new service it is the default choice.</p></div></div>
<div class="prob"><div class="prob-q"><span class="prob-n">2</span><div>A team replaces a mutex-protected counter with 8 threads incrementing 8 separate counters, summed at the end. Throughput barely improves. What is likely happening and how would you fix it?</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m5l0_p2')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m5l0_p2')">Show solution</button></div><div class="hint" id="h_m5l0_p2">The lock is gone, so the problem is at a lower level. Consider how CPU caches move data between cores and what unit they operate on.</div><div class="sol" id="s_m5l0_p2"><p><strong>False sharing.</strong> The 8 counters are almost certainly adjacent in memory &mdash; 8 &times; 8 bytes = 64 bytes, which fits in a <em>single cache line</em>. CPU caches maintain coherence at cache-line granularity, not per variable. Every increment by any thread invalidates that line in all 7 other cores&rsquo; caches, forcing a coherence round-trip.</p>
<p>The threads never touch each other&rsquo;s data logically, but the hardware cannot tell &mdash; so they serialise on the cache-coherence protocol just as thoroughly as they did on the mutex, sometimes worse.</p>
<p><strong>The fix: pad each counter onto its own cache line.</strong></p>
<pre class="mini">struct alignas(64) PaddedCounter {
    uint64_t value;
    char pad[56];        // fill the rest of the 64-byte line
};
PaddedCounter counters[8];</pre>
<p>Each counter now owns a line exclusively, and the cores stop fighting. Speedups of 5&ndash;10&times; from this change alone are common.</p>
<p>Language support: C++17 offers <code>std::hardware_destructive_interference_size</code>, Java has <code>@Contended</code>, and Go programmers pad structs manually. Diagnose it with <code>perf c2c</code>, which reports cache-line contention directly. It is worth remembering that removing a lock does not guarantee removing contention.</p></div></div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>Threads share the address space, heap, globals and file descriptors; they own their stack and registers.</li><li>Thread creation is roughly 10–100× cheaper than process creation.</li><li>The shared memory that makes threads fast is the source of every race condition.</li><li>Thread pools: size ≈ core count for CPU-bound work, much larger for I/O-bound work.</li></ul></div>`
  },
  "m5l1": {
    mod: "MODULE 5 — Threads",
    title: "Thread Models & Linux Threads",
    level: "Advanced",
    time: "30 min",
    industry: "Systems Programming",
    prev: "m5l0",
    next: "m6l0",
    content: `
<h2>Three Thread Models</h2>

<h3>1. User-Level Threads (N:1)</h3>
<p>N user threads map to 1 kernel thread. Thread management is done by a user-space library — kernel doesn't know about individual threads.</p>
<p><strong>Pros:</strong> Ultra-fast thread switch (no syscall), portable.</p>
<p><strong>Cons:</strong> One blocking syscall blocks ALL threads. Can't use multiple CPUs (kernel sees only 1 thread).</p>

<h3>2. Kernel-Level Threads (1:1)</h3>
<p>Each user thread maps to one kernel thread. Kernel manages all threads directly.</p>
<p><strong>Pros:</strong> True parallelism on multi-core. One blocking thread doesn't block others.</p>
<p><strong>Cons:</strong> Thread creation requires syscall. Context switch is expensive (mode switch).</p>
<p><strong>Used by:</strong> Linux (pthreads), Windows threads.</p>

<h3>3. Hybrid Threads (M:N)</h3>
<p>M user threads map to N kernel threads (N ≤ M). User-space scheduler maps user threads to kernel threads dynamically.</p>
<p><strong>Pros:</strong> Best of both worlds in theory.</p>
<p><strong>Cons:</strong> Complex. Hard to implement correctly.</p>
<p><strong>Examples:</strong> Go's goroutine scheduler (GOMAXPROCS kernel threads, millions of goroutines).</p>

<h2>Linux Threads: clone() — The Truth</h2>
<p>Linux doesn't have a separate "create thread" syscall. Both processes and threads are created by <code>clone()</code> with different flags:</p>

<div class="code-block" data-lang="C">
<pre><span class="cm">/* fork() is clone() with NO sharing: */</span>
<span class="fn">clone</span>(SIGCHLD, ...);  <span class="cm">/* new address space, new files, new everything */</span>

<span class="cm">/* pthread_create() is clone() WITH sharing: */</span>
<span class="fn">clone</span>(CLONE_VM | CLONE_FS | CLONE_FILES | CLONE_SIGHAND | CLONE_THREAD, ...);
<span class="cm">/* CLONE_VM:    share address space (same heap, same code) */</span>
<span class="cm">/* CLONE_FILES: share file descriptor table */</span>
<span class="cm">/* CLONE_SIGHAND: share signal handlers */</span>

<span class="cm">/* In Linux kernel, EVERY thread is a task_struct.
   "Thread" and "process" are the same concept at kernel level.
   The difference is only what they share. */</span></pre>
</div>

<div class="callout deepdive">
<strong>This is why <code>ps aux</code> doesn't show threads by default but <code>ps -eLf</code> does.</strong> Each Linux thread has its own PID (called LWP — LightWeight Process id). A process with 4 threads has 4 entries in the kernel's task table. <code>getpid()</code> returns the thread group ID (the "process" PID), while <code>gettid()</code> returns the individual thread's ID.
</div>

<h2>pthreads in Practice</h2>

<div class="code-block" data-lang="C">
<pre><span class="cm">/* POSIX Threads — the standard Linux thread API */</span>
<span class="type">pthread_t</span> thread_id;
<span class="type">pthread_mutex_t</span> lock = PTHREAD_MUTEX_INITIALIZER;

<span class="kw">void</span>* <span class="fn">worker</span>(<span class="kw">void</span>* arg) {
    <span class="fn">pthread_mutex_lock</span>(&lock);
    counter++;                          <span class="cm">/* protected critical section */</span>
    <span class="fn">pthread_mutex_unlock</span>(&lock);
    <span class="kw">return</span> NULL;
}

<span class="kw">int</span> <span class="fn">main</span>() {
    <span class="fn">pthread_create</span>(&thread_id, NULL, worker, NULL);  <span class="cm">/* create thread */</span>
    <span class="fn">pthread_join</span>(thread_id, NULL);                   <span class="cm">/* wait for it */</span>
    <span class="kw">return</span> <span class="num">0</span>;
}</pre>
</div>

<div class="callout industry-note">
<strong>Java Threads</strong> map to OS threads (1:1 model via JVM). Each <code>new Thread()</code> creates a kernel thread. Java's virtual threads (introduced in Java 21 as Project Loom) are M:N — millions of virtual threads on a small pool of OS threads, similar to Go's goroutines. This is the future of Java concurrency and directly addresses the scalability limits of 1:1 thread models.
</div>

<h2>Why the Mapping Model Matters</h2>
<p>A "thread" exists at two levels: the one your program creates, and the one the kernel schedules.
How those two map onto each other decides whether a blocking call stalls one thread or all of them,
and whether you can use more than one core.</p>

<div class="diagram"><div class="d-title">Three mapping models</div>N:1  USER-LEVEL                  1:1  KERNEL-LEVEL

 [T1][T2][T3][T4]  user           [T1] [T2] [T3] [T4]   user
   \   |   |   /                    |    |    |    |
    +--+---+--+                      |    |    |    |
         |                           v    v    v    v
      [ KT ]        kernel        [KT1][KT2][KT3][KT4]  kernel
         |                           |    |    |    |
      [ CPU ]                     [C0] [C1] [C2] [C3]

 one blocking call blocks ALL      each maps to its own
 cannot use &gt;1 core                kernel thread; true parallel


M:N  HYBRID   (Go, Java 21 virtual threads)

 [g1][g2][g3] ... [g100000]        millions, cheap (~2 KB stack)
        user-space scheduler
     |          |          |
  [KT1]      [KT2]      [KT3]      a few, = GOMAXPROCS / core count
     |          |          |
   [C0]       [C1]       [C2]

 runtime moves user threads between kernel threads;
 a blocking call parks the goroutine, not the kernel thread</div>

<h2>Comparing the Three</h2>
<table>
  <tr><th></th><th>N:1 user-level</th><th>1:1 kernel-level</th><th>M:N hybrid</th></tr>
  <tr><td>Switch cost</td><td><span class="good">~100&nbsp;ns</span></td><td>1&ndash;10&nbsp;&micro;s</td><td><span class="good">~100&nbsp;ns</span> in user space</td></tr>
  <tr><td>True parallelism</td><td><span class="bad">No &mdash; one core only</span></td><td><span class="good">Yes</span></td><td><span class="good">Yes</span></td></tr>
  <tr><td>Blocking syscall</td><td><span class="bad">Stalls every thread</span></td><td><span class="good">Stalls one thread</span></td><td>Runtime reschedules</td></tr>
  <tr><td>Practical thread count</td><td>Thousands</td><td>Thousands</td><td><span class="good">Millions</span></td></tr>
  <tr><td>Implementation</td><td>Simple</td><td>Simple</td><td><span class="bad">Complex</span></td></tr>
  <tr><td>Used by</td><td>Old Java green threads, GNU Pth</td><td>Linux NPTL, Windows</td><td>Go, Java 21 Loom, Erlang</td></tr>
</table>

<div class="callout deepdive">
<strong>Why M:N nearly died, then came back.</strong> Solaris and early Linux both tried M:N and
abandoned it &mdash; the interaction between two schedulers produced pathological cases, and signal
delivery and debugging became extremely hard. Linux settled on 1:1 with NPTL in 2003. What changed
since is that the runtime, not the OS, now owns the mapping: Go and Loom control their own
scheduling points at channel operations and blocking calls, so the runtime always knows when a
user thread yields. The hard part was never the model &mdash; it was coordinating two schedulers that
could not see each other.
</div>

<h2>How Many Threads Should You Create?</h2>
<p>For CPU-bound work, more threads than cores buys nothing and costs switching. Amdahl's law bounds
the benefit anyway &mdash; with just 10% of the work inherently serial:</p>

<table class="calc">
  <tr><th>Cores</th><th>Speedup (10% serial)</th><th>Efficiency</th></tr>
  <tr><td>2 cores</td><td>1.82&times;</td><td>91%</td></tr><tr><td>4 cores</td><td>3.08&times;</td><td>77%</td></tr><tr><td>8 cores</td><td>4.71&times;</td><td>59%</td></tr><tr><td>16 cores</td><td>6.40&times;</td><td>40%</td></tr><tr><td>32 cores</td><td>7.80&times;</td><td>24%</td></tr><tr><td>64 cores</td><td>8.77&times;</td><td>14%</td></tr>
</table>

<p>At 64 cores you get under 10&times; and waste 85% of the hardware. For <strong>I/O-bound</strong> work
the calculus inverts: threads spend most of their life blocked, so you want far more of them than
cores &mdash; which is exactly the workload virtual threads and goroutines were built for.</p>

<div class="code-block"><pre>Sizing rule of thumb:

  CPU-bound   threads = number of cores        (maybe cores + 1)
  I/O-bound   threads = cores / (1 - blocked_fraction)

Example: 8 cores, threads block 90% of the time
  threads = 8 / (1 - 0.9) = 80 threads

With virtual threads / goroutines the question mostly
disappears -- create one per task and let the runtime
multiplex them onto the available cores.</pre></div>

<div class="callout warning">
<strong>Virtual threads do not make blocking free.</strong> A Java virtual thread that blocks on a
<code>synchronized</code> block or a native call <em>pins</em> its carrier platform thread, so the
scheduler cannot reuse it &mdash; scalability collapses back to the platform-thread pool size.
Use <code>ReentrantLock</code> rather than <code>synchronized</code> in virtual-thread code. Go has
an analogous issue with cgo calls.
</div>

<div class="quiz-section"><h3><span class="qico">&#9673;</span> Check Your Understanding</h3>
<div class="quiz-q"><p>In an N:1 (user-level) threading model, one thread makes a blocking <code>read()</code> syscall. What happens?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Only that thread blocks</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Every thread in the process blocks</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. The kernel creates a new thread automatically</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. The read is converted to non-blocking</div></div><div class="quiz-explain">The kernel sees only one thread of execution and has no knowledge of the user-level threads multiplexed onto it. Blocking that single kernel thread blocks the lot. This is the fundamental limitation of pure N:1, and the reason 1:1 became the mainstream model.</div></div>
<div class="quiz-q"><p>On Linux, what is the actual difference between a process and a thread?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Threads use a different kernel structure than task_struct</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Only the flags passed to clone() &mdash; both are task_structs</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Threads are scheduled by a separate thread scheduler</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Processes have PIDs, threads have no kernel identity</div></div><div class="quiz-explain">Linux has a single abstraction: the <code>task_struct</code>. <code>fork()</code> is <code>clone()</code> with almost no sharing; <code>pthread_create()</code> is <code>clone()</code> with CLONE_VM, CLONE_FILES, CLONE_SIGHAND, CLONE_THREAD and others. Threads do have kernel identity &mdash; each has a unique TID (visible via <code>gettid()</code> and <code>ps -eLf</code>) while sharing a thread-group ID that <code>getpid()</code> returns.</div></div>
<div class="quiz-q"><p>A workload is 20% inherently serial. What is the maximum speedup achievable with unlimited cores?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Unlimited</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. 20&times;</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. 5&times;</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. 80&times;</div></div><div class="quiz-explain">Amdahl&rsquo;s law: as core count approaches infinity the parallel portion approaches zero time, leaving only the serial fraction. Maximum speedup = 1 / serial_fraction = 1 / 0.2 = <strong>5&times;</strong>. No amount of hardware overcomes the serial section &mdash; which is why reducing the serial fraction matters more than adding cores.</div></div>
<div class="quiz-q"><p>Why should virtual-thread code in Java 21 prefer <code>ReentrantLock</code> over <code>synchronized</code>?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. ReentrantLock is faster in all cases</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. synchronized pins the virtual thread to its carrier thread</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. synchronized does not work with virtual threads</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. ReentrantLock uses less memory</div></div><div class="quiz-explain">A virtual thread blocked inside a <code>synchronized</code> block cannot be unmounted from its carrier platform thread &mdash; it is <em>pinned</em>. The carrier is consumed while doing nothing, so effective concurrency falls back to the small platform-thread pool. <code>ReentrantLock</code> is virtual-thread aware and parks the virtual thread while releasing the carrier for other work.</div></div>
<button class="quiz-reset" onclick="resetQuiz(this)">&#8634; Reset these questions</button></div>
<div class="practice"><h3><span class="pico">&#9998;</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied &mdash; check every digit.</p>
<div class="prob"><div class="prob-q"><span class="prob-n">1</span><div>A server handles requests that spend 5&nbsp;ms on CPU and 45&nbsp;ms waiting on a database. The machine has 8 cores. How many threads should the pool have to keep all cores busy, and what is the theoretical peak throughput?</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m5l1_p1')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m5l1_p1')">Show solution</button></div><div class="hint" id="h_m5l1_p1">Work out what fraction of a thread&rsquo;s lifetime is spent blocked, then use threads = cores / (1 - blocked_fraction). For throughput, consider what the CPU time per request implies.</div><div class="sol" id="s_m5l1_p1"><pre class="mini">Total per request = 5 ms CPU + 45 ms wait = 50 ms
Blocked fraction  = 45 / 50 = 0.9

threads = cores / (1 - blocked) = 8 / 0.1 = <b>80 threads</b>

Throughput ceiling is set by CPU, not thread count:
  each request needs 5 ms of CPU
  8 cores provide 8000 ms of CPU per second
  max = 8000 / 5 = <b>1600 requests/second</b></pre>
<p>With 80 threads, at any instant roughly 8 are running and 72 are blocked on the database &mdash; exactly saturating the cores.</p>
<p>Two cautions. Adding threads beyond 80 cannot raise throughput because the CPU is already the bottleneck; it only adds memory (each platform thread reserves ~1&nbsp;MB of stack) and switching overhead. And 80 concurrent database connections may exceed what the database will accept &mdash; the real limit is often the connection pool, not the thread pool.</p>
<p>This is precisely the workload where virtual threads shine: create one per request, let the runtime park them on the blocking call, and drop the tuning question entirely.</p></div></div>
<div class="prob"><div class="prob-q"><span class="prob-n">2</span><div>Explain why <code>fork()</code> in a multithreaded program is dangerous, and what the POSIX rule is for what you may safely do in the child.</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m5l1_p2')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m5l1_p2')">Show solution</button></div><div class="hint" id="h_m5l1_p2">Only the calling thread is duplicated. Think about what state the other threads might have been holding at the instant of the fork.</div><div class="sol" id="s_m5l1_p2"><p>The child gets a full copy of the address space but <strong>only one thread</strong> &mdash; the one that called <code>fork()</code>. Every other thread simply does not exist in the child.</p>
<p>The danger is any lock those threads held. Suppose thread B held the malloc arena lock at the moment thread A forked. In the child, that mutex exists in the copied memory <em>in the locked state</em>, and thread B does not exist to unlock it. The first call to <code>malloc()</code> in the child blocks forever. The same applies to stdio locks, logging locks, and any library mutex.</p>
<p><strong>The POSIX rule:</strong> between <code>fork()</code> and <code>exec()</code> in a multithreaded program you may call only <strong>async-signal-safe</strong> functions. That excludes <code>malloc</code>, <code>printf</code>, and most of the standard library. In practice: fork, then immediately exec, doing nothing but <code>dup2</code>/<code>close</code>/<code>_exit</code> in between.</p>
<p>Mitigations: <code>pthread_atfork()</code> registers handlers to acquire locks before the fork and release them after in both processes &mdash; fragile and hard to get right across libraries. <code>posix_spawn()</code> is the modern answer, implemented with <code>vfork</code>+<code>exec</code> or <code>clone</code> to avoid the window entirely. This is also why Python&rsquo;s multiprocessing moved its default start method away from plain <code>fork</code> on macOS, and why Python 3.14 changed the Linux default to <code>forkserver</code>.</p></div></div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>N:1 (user-level) is fast to switch but one blocking call stalls every thread.</li><li>1:1 (kernel-level) gives true parallelism — the model used by Linux pthreads and Windows.</li><li>M:N (hybrid) powers Go goroutines and Java 21 virtual threads.</li><li>On Linux both processes and threads are <code>task_struct</code>s created by <code>clone()</code>; only the sharing flags differ.</li></ul></div>`
  },
  "m6l0": {
    mod: "MODULE 6 — Memory Management",
    title: "Address Spaces & Paging",
    level: "Intermediate",
    time: "30 min",
    industry: "Core OS Knowledge",
    prev: "m5l1",
    next: "m6l1",
    content: `
<h2>The Core Problem</h2>
<p>RAM is finite (say 16GB). You're running 50 processes. Their combined memory demand far exceeds 16GB. How does every process believe it has the full 64-bit address space to itself? And how does the OS prevent process A from reading process B's memory?</p>
<p>Answer: <strong>Virtual Memory + Paging.</strong></p>

<h2>Logical vs Physical Address Space</h2>
<ul>
  <li><strong>Logical (virtual) address:</strong> The address the CPU generates in user mode. Each process has its own virtual address space (0 to 2^48 on x86-64). Process thinks it has RAM starting at address 0.</li>
  <li><strong>Physical address:</strong> Actual location in RAM chips. Managed by the OS.</li>
</ul>
<p>The <strong>Memory Management Unit (MMU)</strong> — hardware inside the CPU — translates virtual addresses to physical addresses on every memory access.</p>

<h2>Paging</h2>
<p>Physical memory is divided into fixed-size chunks called <strong>frames</strong>. Virtual memory is divided into same-sized chunks called <strong>pages</strong>. Typical page size: <strong>4KB</strong>.</p>

<div class="diagram">
  <div class="d-title">Virtual to Physical Address Translation</div>
Virtual Address (48-bit):  [ Page Number (36 bits) | Offset (12 bits) ]
                                       │                      │
                               Page Table lookup              │
                                       ↓                      │
Physical Address:         [ Frame Number          | Offset (12 bits) ]
                                       ↓
                              Actual RAM location

4KB page = 2^12 bytes → 12-bit offset
A 4GB virtual space → 2^20 pages → page table needs 1 million entries!
</div>

<h3>Page Table Entry (PTE)</h3>
<div class="diagram">
  <div class="d-title">Page Table Entry Fields</div>
[ Frame Number | <span class="highlight">Valid</span> | <span class="highlight2">Dirty</span> | <span class="highlight3">Referenced</span> | Protection | ... ]

<span class="highlight">Valid (Present) bit</span>: 1 = page is in RAM. 0 = page is on disk (causes page fault)
<span class="highlight2">Dirty bit</span>:          1 = page was modified since loaded. Must write back to disk on evict.
<span class="highlight3">Referenced bit</span>:     1 = page was recently accessed. Used by page replacement algorithms.
Protection bits:      Read/Write/Execute permissions per page.
</div>

<h2>The Translation Lookaside Buffer (TLB)</h2>
<p>Page table lookups require reading from RAM (expensive — 100+ cycles). So the MMU has a hardware cache of recent translations called the <strong>TLB</strong>.</p>
<ul>
  <li><strong>TLB hit:</strong> Translation found in TLB. ~1 cycle. Fast.</li>
  <li><strong>TLB miss:</strong> Must walk page table in RAM. ~100+ cycles. Then cache in TLB.</li>
  <li>TLB typically holds 64–1024 entries. Hit rate ~99% for well-behaved programs.</li>
</ul>

<div class="callout warning">
<strong>TLB flush on context switch:</strong> When switching processes, the TLB is invalidated (different process has different virtual-to-physical mappings). This is a major cost of context switching. Modern CPUs mitigate this with <strong>Address Space IDs (ASIDs)</strong> — tag each TLB entry with a process identifier so entries from different processes can coexist without flushing.
</div>

<h2>Multi-Level Page Tables</h2>
<p>A single-level page table for a 64-bit address space would need 2^52 entries × 8 bytes = petabytes of RAM just for the page table. Solution: multi-level (hierarchical) page tables.</p>
<p>Linux uses a 4-level (or 5-level) page table: PGD → PUD → PMD → PTE. Only the levels actually used are allocated in RAM — sparse address spaces need very little memory for their page tables.</p>

<div class="callout deepdive">
<strong>Huge Pages (2MB and 1GB pages):</strong> For large databases and high-performance computing, using 4KB pages means millions of TLB entries needed. Linux supports <em>hugepages</em> (2MB or 1GB pages). With 2MB pages, you need 512× fewer TLB entries for the same memory → massively better TLB hit rate. PostgreSQL, JVM, and Redis all benefit from huge pages. In production, you'll often see <code>/proc/meminfo</code> showing HugePages allocation for database servers.
</div>

<div class="quiz-section">
  <h3><span class="qico">◉</span> Check Your Understanding</h3>
  <div class="quiz-q">
    <p>If a page's "Dirty bit" is 0 when the OS evicts it, what happens?</p>
    <div class="quiz-options">
      <div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. The page is simply discarded — no disk write needed</div>
      <div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. The page must be written to disk before eviction</div>
      <div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. The page cannot be evicted</div>
      <div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. A page fault is triggered immediately</div>
    </div>
    <div class="quiz-explain">If dirty=0, the page's content in RAM is identical to the copy on disk (it was never modified). Evicting it simply means marking it not present — no write needed. This makes clean page eviction very cheap.</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div>

<div class="practice"><h3><span class="pico">✎</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied — check every digit.</p>
<div class="prob">
  <div class="prob-q"><span class="prob-n">1</span><div>A system uses 32-bit virtual addresses and 4 KB pages.
 (a) How many bits are the offset? (b) How many pages in the virtual address space?
 (c) With 4-byte page-table entries, how large is a single-level page table per process?
 (d) Why is this a problem, and how do multi-level tables fix it?</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m6l0_p1')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m6l0_p1')">Show solution</button></div>
  <div class="hint" id="h_m6l0_p1">4 KB = 2^12. Offset bits come straight from the page size; the remaining bits index the page number.</div>
  <div class="sol" id="s_m6l0_p1"><p><strong>(a)</strong> 4 KB = 2<sup>12</sup> bytes → <strong>12 offset bits</strong>.</p>
<p><strong>(b)</strong> 32 − 12 = 20 bits of page number → 2<sup>20</sup> = <strong>1,048,576 pages</strong>.</p>
<p><strong>(c)</strong> 2<sup>20</sup> entries × 4 bytes = 2<sup>22</sup> = <strong>4 MB per process</strong>.</p>
<p><strong>(d)</strong> 4 MB of page table <em>per process</em>, which must be resident whether or not the process uses that much memory. With 100 processes that is 400 MB of pure overhead — and nearly all of it maps nothing, since a typical process uses a tiny, sparse fraction of its 4 GB space.</p>
<p><strong>Multi-level tables</strong> exploit that sparsity. Split the 20-bit page number into two 10-bit halves: an outer table of 1024 entries pointing to inner tables of 1024 entries each. Only the inner tables covering pages the process actually uses are allocated. A process touching 1 MB of memory needs the outer table (4 KB) plus one inner table (4 KB) = <strong>8 KB instead of 4 MB</strong>. The cost is an extra memory reference per translation — which is exactly what the TLB exists to hide.</p>
<p>x86-64 extends this to four levels (PGD → PUD → PMD → PTE), and five for very large address spaces.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">2</span><div>A memory access takes 100 ns. A TLB lookup takes 10 ns and the TLB hit rate is 98%.
 Compute the effective memory access time with a single-level page table. Then recompute with a
 90% hit rate and comment.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m6l0_p2')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m6l0_p2')">Show solution</button></div>
  <div class="hint" id="h_m6l0_p2">On a hit: TLB lookup + one memory access. On a miss: TLB lookup + page-table read + the actual access.</div>
  <div class="sol" id="s_m6l0_p2"><p><strong>At 98% hit rate:</strong></p>
<pre class="mini">hit  (0.98): 10 + 100        = 110 ns
miss (0.02): 10 + 100 + 100  = 210 ns

EAT = 0.98(110) + 0.02(210) = 107.8 + 4.2 = 112 ns</pre>
<p>Only 12% slower than raw memory, despite address translation being required on every single access.</p>
<p><strong>At 90% hit rate:</strong></p>
<pre class="mini">EAT = 0.90(110) + 0.10(210) = 99 + 21 = 120 ns</pre>
<p>Dropping 8 percentage points of hit rate costs 8 ns — a 7% slowdown. The relationship is linear in the miss rate, and the penalty grows sharply with multi-level tables: on x86-64 a full four-level walk needs <em>four</em> memory accesses, making a miss cost 10 + 400 + 100 = 510 ns. At a 90% hit rate that gives an EAT of 150 ns, a 50% penalty.</p>
<p>This is precisely why huge pages matter: a 2 MB page covers 512 times more memory per TLB entry, so a database with a large working set gets far fewer misses without any change to the hardware.</p></div>
</div>
</div>

<div class="quiz-section"><h3><span class="qico">&#9673;</span> Check Your Understanding</h3>
<div class="quiz-q"><p>A 32-bit system uses 4&nbsp;KB pages. How many bits of the virtual address are the offset?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. 10 bits</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. 12 bits</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. 20 bits</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. 32 bits</div></div><div class="quiz-explain">The offset must address every byte within one page. 4&nbsp;KB = 2<sup>12</sup> bytes, so 12 bits. The remaining 32 &minus; 12 = 20 bits are the page number, giving 2<sup>20</sup> = ~1 million pages. Page size always determines offset width directly &mdash; an 8&nbsp;KB page would give 13 offset bits.</div></div>
<div class="quiz-q"><p>Why do multi-level page tables use less memory than a single-level table for a typical process?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. The entries are smaller</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Only the second-level tables covering pages actually in use are allocated</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. They are compressed in memory</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. They are stored on disk instead of RAM</div></div><div class="quiz-explain">A typical process uses a tiny, sparse fraction of its address space &mdash; some code near the bottom, a stack near the top, and a gap of nothing in between. A single-level table must have an entry for every possible page regardless. A multi-level table allocates an inner table only where pages exist, so the enormous empty region costs a handful of null outer entries rather than millions of unused PTEs.</div></div>
<div class="quiz-q"><p>A database server enables 2&nbsp;MB huge pages. What is the primary benefit?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Disk reads become faster</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Each TLB entry covers 512&times; more memory, so TLB misses fall sharply</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Memory is automatically compressed</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Page faults are eliminated entirely</div></div><div class="quiz-explain">A TLB has a fixed number of entries &mdash; often only a few hundred to a couple of thousand. With 4&nbsp;KB pages, 1,024 entries cover just 4&nbsp;MB, so a database with a 64&nbsp;GB buffer pool misses constantly. With 2&nbsp;MB pages the same entries cover 2&nbsp;GB. Fewer misses means fewer page-table walks, and gains of 5&ndash;15% on large-footprint workloads are typical. Page faults still occur; it is translation caching that improves.</div></div>
<button class="quiz-reset" onclick="resetQuiz(this)">&#8634; Reset these questions</button></div>

<h2>Inverted Page Tables</h2>
<p>Every scheme so far keeps <strong>one page table per process</strong>, indexed by virtual page number.
With a 64-bit address space and hundreds of processes, that is a great deal of metadata even with
multi-level tables. An <strong>inverted</strong> page table turns the problem around: keep
<em>one table for the whole machine</em>, with one entry per <em>physical frame</em>.</p>

<div class="diagram"><div class="d-title">Conventional vs inverted page table</div>CONVENTIONAL (per-process, indexed by virtual page)

  Process A page table        Process B page table
  +-----+--------+            +-----+--------+
  | vpn | frame  |            | vpn | frame  |
  |  0  |   17   |            |  0  |   93   |
  |  1  |   42   |            |  1  |   17   |   &lt;- both can map
  | ... |  ...   |            | ... |  ...   |      frame 17
  +-----+--------+            +-----+--------+

  size grows with the VIRTUAL address space, per process
  translation = direct INDEX, O(1)


INVERTED (one table for the machine, indexed by frame)

  +-------+-------+-------+
  | frame |  pid  |  vpn  |
  |   0   |   -   |   -   |
  |   1   |  104  |   9   |
  |   2   |  237  |   0   |
  |  ...  |  ...  |  ...  |
  +-------+-------+-------+
   one entry per PHYSICAL frame -- 16 GB / 4 KB = 4M entries

  size grows with PHYSICAL memory only
  translation = SEARCH for (pid, vpn) -&gt; hashed in practice

  16 GB machine, 4 KB pages, 8-byte entries:
     4,194,304 entries x 8 = 32 MB TOTAL for the whole system
  versus a 4 MB per-process table x 100 processes = 400 MB</div>

<div class="callout deepdive">
<strong>The trade-off is stark.</strong> Memory use becomes proportional to <em>physical</em> RAM rather
than to the sum of all virtual address spaces &mdash; a machine with 16&nbsp;GB needs about 4 million
entries no matter how many processes run, or how sparse their address spaces are. But translation
now requires a <em>search</em> rather than an index, because the table is ordered by frame, not by
page. A linear scan would be catastrophic, so real implementations hash (pid, page) to a bucket and
chain collisions &mdash; adding one or two extra memory references per TLB miss.
</div>

<p>Inverted tables also complicate <strong>shared memory</strong>: two processes mapping the same frame at
different virtual addresses cannot both be recorded, since there is only one entry per frame.
Implementations need auxiliary structures to handle it.</p>

<p><strong>Where you find them:</strong> IBM PowerPC and POWER, and older UltraSPARC and IA-64 designs.
x86-64 uses conventional hierarchical tables, which is why the four-level walk is the case you
should know first. The concept remains worth understanding &mdash; it is the clearest illustration
that a page table is a <em>data structure choice</em>, with the usual space-versus-time consequences.</p>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>Virtual address = page number + offset; the offset width is fixed by the page size.</li><li>The MMU translates on every access; the <strong>TLB</strong> caches recent translations and makes it affordable.</li><li>A single-level table is impractically large — multi-level tables allocate only what a sparse address space uses.</li><li>Huge pages (2 MB / 1 GB) cut TLB pressure dramatically for large-footprint workloads.</li></ul></div>`
  },
  "m6l1": {
    mod: "MODULE 6 — Memory Management",
    title: "Virtual Memory & Demand Paging",
    level: "Intermediate",
    time: "20 min",
    industry: "Core OS Knowledge",
    prev: "m6l0",
    next: "m6l2",
    content: `
<h2>Virtual Memory: The Big Idea</h2>
<p>Not all of a process's pages need to be in RAM at the same time. The OS keeps only the <strong>working set</strong> of actively used pages in RAM. Everything else lives on disk (the swap partition). Pages are loaded on demand.</p>

<p>This enables:</p>
<ul>
  <li>Running programs larger than physical RAM</li>
  <li>Sharing pages between processes (shared libraries like libc.so loaded once)</li>
  <li>Memory-mapped files (mmap)</li>
  <li>Efficient fork() via copy-on-write</li>
</ul>

<h2>Demand Paging</h2>
<p>Pages are loaded into RAM only when they're actually accessed — not at program load time.</p>

<h3>Page Fault Sequence</h3>
<div class="diagram">
  <div class="d-title">Page Fault Handling</div>
1. CPU generates virtual address X
2. MMU looks up page table entry for X
3. Valid bit = 0 → <span class="highlight2">PAGE FAULT</span> (hardware trap to OS)
4. OS page fault handler runs:
   a. Is this a valid access? (Is address X in process's valid range?)
      NO → Segmentation Fault → kill process
      YES → continue
   b. Find a free frame in RAM
      (if none free → run page replacement algorithm)
   c. Read the required page from disk into the free frame
   d. Update page table: set frame number, valid=1
   e. Restart the faulting instruction
5. CPU re-executes the instruction — this time, page is in RAM, no fault
</div>

<p><strong>Page fault cost:</strong> ~10 milliseconds (disk seek + read). CPU could do ~10 million operations in that time. This is why thrashing (continuous page faulting) kills performance.</p>

<h2>Swapping</h2>
<p>When RAM is full, the OS moves inactive pages to disk (<strong>swap space</strong>) to make room.</p>

<div class="callout warning">
<strong>Swap on SSDs is acceptable; on HDDs it's catastrophic for performance.</strong> An HDD random access takes ~10ms. If your system is heavily swapping, it will feel completely unresponsive. Check: <code>vmstat 1</code> on Linux — the <code>si</code> (swap-in) and <code>so</code> (swap-out) columns. High values = you're swapping = add RAM or reduce memory usage.
</div>

<h2>Copy-on-Write (CoW) Revisited</h2>
<div class="diagram">
  <div class="d-title">Copy-on-Write after fork()</div>
After fork():
Parent's page P  ────→  [Physical Frame 42]  ←────  Child's page P
                         (marked read-only, shared)

Child tries to write to page P:
→ Hardware raises protection fault
→ OS allocates new frame 43
→ Copies content of frame 42 to frame 43
→ Updates child's page table: P → Frame 43 (now writable)
→ Restarts the write instruction

Parent still has page P → Frame 42 (unchanged)
Child now has its own copy of the page
</div>

<h2>Memory-Mapped Files (mmap)</h2>
<p>Instead of read()/write() syscalls, map a file directly into the process's virtual address space. Accessing the mapped memory IS the file I/O — the OS handles paging transparently.</p>

<div class="callout industry-note">
<strong>Databases rely heavily on mmap.</strong> SQLite uses mmap for its database file. LMDB (used in OpenLDAP) is entirely mmap-based. The OS page cache becomes the database buffer pool — read caching is free. However, mmap has downsides: the OS controls eviction (database has no control), and on crashes the write-behind to disk is not guaranteed without explicit msync() calls. This is a major engineering trade-off in database design.
</div>

<div class="quiz-section"><h3><span class="qico">◉</span> Check Your Understanding</h3>
<div class="quiz-q">
    <p>A page fault occurs on a valid address that is currently swapped out. What does the OS do?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Terminate the process with SIGSEGV</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Find a free frame, read the page from disk, update the table, restart the instruction</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Ignore the fault and continue</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Immediately compact memory</div></div>
    <div class="quiz-explain">This is a legitimate demand-paging fault. The handler allocates a frame (running page replacement if none is free), reads the page in, sets the valid bit and frame number, then <em>restarts the faulting instruction</em> — which now succeeds. The process is never aware it happened, apart from the delay. SIGSEGV is reserved for genuinely invalid addresses.</div>
  </div>
<div class="quiz-q">
    <p>Why is <code>fork()</code> fast even for a process using 2 GB of RAM?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. The kernel compresses the address space</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Copy-on-write shares the pages read-only until one side writes</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Only 4 KB is ever copied</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. The child shares the parent&rsquo;s page table permanently</div></div>
    <div class="quiz-explain">CoW copies only the page <em>tables</em>, marking every entry read-only in both processes. Physical pages are shared until one writes, which triggers a protection fault and copies that single page. A 2 GB process forks in roughly the time it takes to duplicate its page tables — and if the child immediately execs, almost nothing is ever copied.</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div>

<div class="practice"><h3><span class="pico">&#9998;</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied &mdash; check every digit.</p>
<div class="prob"><div class="prob-q"><span class="prob-n">1</span><div>Memory access takes 100&nbsp;ns. A page fault takes 8&nbsp;ms to service. Compute the effective access time if (a) one access in 1,000 faults, and (b) one in 400,000. What fault rate keeps the slowdown under 10%?</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m6l1_p1')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m6l1_p1')">Show solution</button></div><div class="hint" id="h_m6l1_p1">EAT = (1 &minus; p)&middot;memory + p&middot;fault_time. Convert 8&nbsp;ms to nanoseconds before mixing units.</div><div class="sol" id="s_m6l1_p1"><pre class="mini">8 ms = 8,000,000 ns

(a) p = 1/1000 = 0.001
    EAT = 0.999(100) + 0.001(8,000,000)
        = 99.9 + 8000 = <b>8099.9 ns</b>
    Slowdown vs 100 ns = <b>81x</b>

(b) p = 1/400,000 = 0.0000025
    EAT = 0.9999975(100) + 0.0000025(8,000,000)
        = 99.99975 + 20 = <b>120 ns</b>
    Slowdown = 1.2x  (20% -- still noticeable)

For under 10% slowdown we need EAT &lt;= 110 ns:
    100 + p(8,000,000 - 100) &lt;= 110
    p &lt;= 10 / 7,999,900
    p &lt;= <b>1 fault per ~800,000 accesses</b></pre>
<p>The result is startling: a fault rate as low as <strong>one in a thousand</strong> makes memory 81&times; slower. Demand paging only works because real fault rates are of the order of one in a million, thanks to locality of reference.</p>
<p>This asymmetry &mdash; 100&nbsp;ns versus 8,000,000&nbsp;ns, a factor of 80,000 &mdash; is why thrashing is so catastrophic and why replacement algorithm quality matters so much. It is also why NVMe swap (roughly 100&nbsp;&micro;s) is qualitatively different from spinning-disk swap: the same fault rate becomes ~1&nbsp;&micro;s EAT instead of 8&nbsp;&micro;s.</p></div></div>
<div class="prob"><div class="prob-q"><span class="prob-n">2</span><div>Explain how <code>mmap</code> makes reading a file faster than <code>read()</code>, and give two situations where <code>mmap</code> is the wrong choice.</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m6l1_p2')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m6l1_p2')">Show solution</button></div><div class="hint" id="h_m6l1_p2">Count the number of times the data is copied in each approach.</div><div class="sol" id="s_m6l1_p2"><p><strong>Why mmap can be faster.</strong> With <code>read()</code> the kernel copies from the page cache into your buffer &mdash; one full copy of every byte, plus a syscall per call. With <code>mmap</code> the file&rsquo;s page-cache pages are mapped directly into your address space: accessing the memory <em>is</em> the file access. There is <strong>zero copying</strong> and no syscall per access, only a page fault on first touch of each page. For repeated random access over a large file this is a substantial win, and pages shared between processes are cached once system-wide.</p>
<p><strong>Wrong choice 1 &mdash; sequential streaming of a huge file.</strong> Reading a 100&nbsp;GB file once, front to back, gains nothing from mapping: each page is touched exactly once, so you pay a page fault per 4&nbsp;KB with no reuse. A plain <code>read()</code> with a large buffer, or better <code>posix_fadvise(POSIX_FADV_SEQUENTIAL)</code>, lets the kernel read ahead in big chunks. Mapping also floods the page cache and evicts genuinely hot data.</p>
<p><strong>Wrong choice 2 &mdash; when you need durability control or robust error handling.</strong> Writes to a mapping reach disk whenever the kernel decides, unless you call <code>msync()</code>. Worse, an I/O error surfaces as a <strong>SIGBUS</strong> at an arbitrary instruction rather than an error return you can check &mdash; and if the file is truncated underneath you, touching the mapping kills the process. Databases care deeply about this: it is a central argument in the well-known "Are You Sure You Want to Use MMAP in Your Database?" critique, and why PostgreSQL manages its own buffer pool rather than mapping data files.</p></div></div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>Demand paging loads pages only on first access, so programs can exceed physical RAM.</li><li>A page fault costs milliseconds — around 10 million CPU cycles.</li><li>Copy-on-write makes <code>fork()</code> cheap and underpins efficient process creation.</li><li><code>mmap</code> maps files into the address space; the page cache becomes the buffer pool.</li></ul></div>`
  },
  "m6l2": {
    mod: "MODULE 6 — Memory Management",
    title: "Page Replacement Algorithms",
    level: "Intermediate",
    time: "45 min",
    industry: "Algorithm Design",
    prev: "m6l1",
    next: "m6l3",
    content: `
<h2>The Problem</h2>
<p>RAM is full and a page fault occurs. The OS must evict something. Evict the wrong page and it
will be needed again immediately, causing another fault. The goal of a replacement algorithm is to
minimise total page faults over the reference stream.</p>

<p>Throughout this lesson we use one <strong>reference string</strong> and <strong>3 frames</strong>:</p>
<div class="code-block"><pre>Reference string:  7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2
Frames available:  3</pre></div>

<div class="callout warning">
<strong>Exam technique.</strong> Do not try to compute fault counts in your head. Draw the frame table
column by column, mark each column as hit or fault, and total at the end. Every trace below is
laid out exactly as you should reproduce it on paper.
</div>

<h2>Algorithm 1: OPT (Optimal / Belady's MIN)</h2>
<p>Evict the page whose <em>next</em> use is furthest in the future. Provably minimises page faults —
and impossible to implement, since it requires knowledge of future references. Its value is as a
<strong>benchmark</strong>: it tells you how much room for improvement a real algorithm has.</p>
<table class="calc trace"><tr><th>t</th><th>Ref</th><th>F0</th><th>F1</th><th>F2</th><th>Fault?</th><th>Evicted</th></tr><tr><td>1</td><td><strong>7</strong></td><td class="hot">7</td><td></td><td></td><td><span class="bad">FAULT</span></td><td>—</td></tr><tr><td>2</td><td><strong>0</strong></td><td>7</td><td class="hot">0</td><td></td><td><span class="bad">FAULT</span></td><td>—</td></tr><tr><td>3</td><td><strong>1</strong></td><td>7</td><td>0</td><td class="hot">1</td><td><span class="bad">FAULT</span></td><td>—</td></tr><tr><td>4</td><td><strong>2</strong></td><td>0</td><td>1</td><td class="hot">2</td><td><span class="bad">FAULT</span></td><td>7</td></tr><tr><td>5</td><td><strong>0</strong></td><td class="hot">0</td><td>1</td><td>2</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>6</td><td><strong>3</strong></td><td>0</td><td>2</td><td class="hot">3</td><td><span class="bad">FAULT</span></td><td>1</td></tr><tr><td>7</td><td><strong>0</strong></td><td class="hot">0</td><td>2</td><td>3</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>8</td><td><strong>4</strong></td><td>2</td><td>3</td><td class="hot">4</td><td><span class="bad">FAULT</span></td><td>0</td></tr><tr><td>9</td><td><strong>2</strong></td><td class="hot">2</td><td>3</td><td>4</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>10</td><td><strong>3</strong></td><td>2</td><td class="hot">3</td><td>4</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>11</td><td><strong>0</strong></td><td>2</td><td>3</td><td class="hot">0</td><td><span class="bad">FAULT</span></td><td>4</td></tr><tr><td>12</td><td><strong>3</strong></td><td>2</td><td class="hot">3</td><td>0</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>13</td><td><strong>2</strong></td><td class="hot">2</td><td>3</td><td>0</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>14</td><td><strong>1</strong></td><td>2</td><td>0</td><td class="hot">1</td><td><span class="bad">FAULT</span></td><td>3</td></tr><tr><td>15</td><td><strong>2</strong></td><td class="hot">2</td><td>0</td><td>1</td><td><span class="good">hit</span></td><td>—</td></tr></table>
<p><strong>OPT: 8 page faults.</strong></p>

<h2>Algorithm 2: FIFO</h2>
<p>Evict the page that has been resident longest, regardless of how heavily it is used. Simple to
implement (a queue) but blind to actual usage.</p>
<table class="calc trace"><tr><th>t</th><th>Ref</th><th>F0</th><th>F1</th><th>F2</th><th>Fault?</th><th>Evicted</th></tr><tr><td>1</td><td><strong>7</strong></td><td class="hot">7</td><td></td><td></td><td><span class="bad">FAULT</span></td><td>—</td></tr><tr><td>2</td><td><strong>0</strong></td><td>7</td><td class="hot">0</td><td></td><td><span class="bad">FAULT</span></td><td>—</td></tr><tr><td>3</td><td><strong>1</strong></td><td>7</td><td>0</td><td class="hot">1</td><td><span class="bad">FAULT</span></td><td>—</td></tr><tr><td>4</td><td><strong>2</strong></td><td>0</td><td>1</td><td class="hot">2</td><td><span class="bad">FAULT</span></td><td>7</td></tr><tr><td>5</td><td><strong>0</strong></td><td class="hot">0</td><td>1</td><td>2</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>6</td><td><strong>3</strong></td><td>1</td><td>2</td><td class="hot">3</td><td><span class="bad">FAULT</span></td><td>0</td></tr><tr><td>7</td><td><strong>0</strong></td><td>2</td><td>3</td><td class="hot">0</td><td><span class="bad">FAULT</span></td><td>1</td></tr><tr><td>8</td><td><strong>4</strong></td><td>3</td><td>0</td><td class="hot">4</td><td><span class="bad">FAULT</span></td><td>2</td></tr><tr><td>9</td><td><strong>2</strong></td><td>0</td><td>4</td><td class="hot">2</td><td><span class="bad">FAULT</span></td><td>3</td></tr><tr><td>10</td><td><strong>3</strong></td><td>4</td><td>2</td><td class="hot">3</td><td><span class="bad">FAULT</span></td><td>0</td></tr><tr><td>11</td><td><strong>0</strong></td><td>2</td><td>3</td><td class="hot">0</td><td><span class="bad">FAULT</span></td><td>4</td></tr><tr><td>12</td><td><strong>3</strong></td><td>2</td><td class="hot">3</td><td>0</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>13</td><td><strong>2</strong></td><td class="hot">2</td><td>3</td><td>0</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>14</td><td><strong>1</strong></td><td>3</td><td>0</td><td class="hot">1</td><td><span class="bad">FAULT</span></td><td>2</td></tr><tr><td>15</td><td><strong>2</strong></td><td>0</td><td>1</td><td class="hot">2</td><td><span class="bad">FAULT</span></td><td>3</td></tr></table>
<p><strong>FIFO: 12 page faults</strong> — 4 more than OPT.</p>

<h2>Algorithm 3: LRU (Least Recently Used)</h2>
<p>Evict the page unused for the longest time. Relies on <strong>temporal locality</strong>: a page
untouched for a long while is unlikely to be needed soon. LRU is the best practical approximation
to OPT for typical workloads.</p>
<table class="calc trace"><tr><th>t</th><th>Ref</th><th>F0</th><th>F1</th><th>F2</th><th>Fault?</th><th>Evicted</th></tr><tr><td>1</td><td><strong>7</strong></td><td class="hot">7</td><td></td><td></td><td><span class="bad">FAULT</span></td><td>—</td></tr><tr><td>2</td><td><strong>0</strong></td><td>7</td><td class="hot">0</td><td></td><td><span class="bad">FAULT</span></td><td>—</td></tr><tr><td>3</td><td><strong>1</strong></td><td>7</td><td>0</td><td class="hot">1</td><td><span class="bad">FAULT</span></td><td>—</td></tr><tr><td>4</td><td><strong>2</strong></td><td>0</td><td>1</td><td class="hot">2</td><td><span class="bad">FAULT</span></td><td>7</td></tr><tr><td>5</td><td><strong>0</strong></td><td>1</td><td>2</td><td class="hot">0</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>6</td><td><strong>3</strong></td><td>2</td><td>0</td><td class="hot">3</td><td><span class="bad">FAULT</span></td><td>1</td></tr><tr><td>7</td><td><strong>0</strong></td><td>2</td><td>3</td><td class="hot">0</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>8</td><td><strong>4</strong></td><td>3</td><td>0</td><td class="hot">4</td><td><span class="bad">FAULT</span></td><td>2</td></tr><tr><td>9</td><td><strong>2</strong></td><td>0</td><td>4</td><td class="hot">2</td><td><span class="bad">FAULT</span></td><td>3</td></tr><tr><td>10</td><td><strong>3</strong></td><td>4</td><td>2</td><td class="hot">3</td><td><span class="bad">FAULT</span></td><td>0</td></tr><tr><td>11</td><td><strong>0</strong></td><td>2</td><td>3</td><td class="hot">0</td><td><span class="bad">FAULT</span></td><td>4</td></tr><tr><td>12</td><td><strong>3</strong></td><td>2</td><td>0</td><td class="hot">3</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>13</td><td><strong>2</strong></td><td>0</td><td>3</td><td class="hot">2</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>14</td><td><strong>1</strong></td><td>3</td><td>2</td><td class="hot">1</td><td><span class="bad">FAULT</span></td><td>0</td></tr><tr><td>15</td><td><strong>2</strong></td><td>3</td><td>1</td><td class="hot">2</td><td><span class="good">hit</span></td><td>—</td></tr></table>
<p><strong>LRU: 10 page faults.</strong></p>

<div class="callout deepdive">
<strong>Summary for this reference string, 3 frames:</strong>
OPT = <strong>8</strong>, LRU = <strong>10</strong>, FIFO = <strong>12</strong> faults.
The ordering OPT ≤ LRU ≤ FIFO is typical but <em>not</em> guaranteed for every string — LRU can occasionally
lose to FIFO on an adversarial pattern. What <em>is</em> guaranteed is that no algorithm beats OPT.
</div>

<h2>Belady's Anomaly</h2>
<p>Intuition says more frames must mean fewer faults. For FIFO that intuition is <strong>false</strong>.</p>

<div class="code-block"><pre>Reference string:  1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5</pre></div>

<table class="calc">
  <tr><th>Algorithm</th><th>3 frames</th><th>4 frames</th><th>More frames helped?</th></tr>
  <tr><td><strong>FIFO</strong></td><td>9 faults</td><td>10 faults</td>
      <td><span class="bad">No — got worse</span></td></tr>
  <tr><td>LRU</td><td>10 faults</td><td>8 faults</td><td><span class="good">Yes</span></td></tr>
  <tr><td>OPT</td><td>7 faults</td><td>6 faults</td><td><span class="good">Yes</span></td></tr>
</table>

<p>Giving FIFO an <em>extra</em> frame increased faults from 9 to 10. This is
<strong>Belady's Anomaly</strong>, and it is a favourite exam question.</p>

<div class="callout deepdive">
<strong>Why LRU and OPT are immune.</strong> Both are <em>stack algorithms</em>: the set of pages held with
<em>n</em> frames is always a subset of the set held with <em>n+1</em> frames. Adding a frame can therefore only
add pages, never displace one that would have been kept — so faults can never increase. FIFO
violates this property because eviction order depends on load order, not on the reference pattern,
and adding a frame reshuffles that order entirely.
</div>

<h2>Algorithm 4: Clock (Second-Chance) — the practical LRU</h2>
<p>True LRU would require updating a timestamp on <em>every single memory access</em> — billions per
second. No hardware does this. Real systems approximate it with a single <strong>reference bit</strong> per
page, set automatically by the MMU on access.</p>

<div class="diagram"><div class="d-title">Clock / Second-Chance Algorithm</div>Pages in a circular list, each with a reference bit:

        [A:1] -&gt; [B:0] -&gt; [C:1] -&gt; [D:1] -&gt; [E:0]
          ^
       clock hand

On a fault, inspect the page under the hand:
   ref bit = 0  -&gt;  EVICT it, place new page here, advance hand
   ref bit = 1  -&gt;  clear it to 0, advance hand, try the next page

A page therefore survives one sweep after being touched -- its
&quot;second chance&quot;. Pages touched often keep re-setting their bit
and are effectively never evicted; untouched pages fall to 0
and are reclaimed on the next pass.

Worst case: every bit is 1, the hand sweeps the whole ring
clearing bits, and returns to evict the original page --
degenerating to FIFO.</div>

<div class="callout industry-note">
<strong>What Linux really does.</strong> Linux does not use a plain clock. It maintains <strong>two LRU lists per
memory zone</strong> — <em>active</em> and <em>inactive</em> — and requires a page to be referenced <em>twice</em> before it
is promoted to the active list, which resists one-off scans (a large <code>cp</code> or backup) evicting
your working set. Reclaim pressure moves pages from the tail of the active list to the inactive
list, and reclaims from the tail of the inactive list. Inspect it with
<code>grep -E 'Active|Inactive' /proc/meminfo</code>. Modern kernels (5.18+) also offer
<strong>MGLRU</strong> (Multi-Generational LRU), which extends this to several generations and measurably
improves behaviour under memory pressure — it is enabled by default in recent Android and
ChromeOS builds.
</div>

<h2>Thrashing</h2>
<p>When a process is given fewer frames than its <strong>working set</strong> — the pages it actively needs
right now — it faults continuously. Every fault costs milliseconds of disk I/O, so the process
makes almost no forward progress.</p>

<div class="code-block"><pre>The thrashing spiral:

  processes get too few frames
        v
  page fault rate rises
        v
  CPU sits idle waiting on disk
        v
  scheduler sees LOW CPU utilisation
        v
  scheduler admits MORE processes to &quot;use up&quot; the idle CPU
        v
  even fewer frames per process
        v
  ... worse thrashing. CPU utilisation collapses toward 0%.

The system is 100% busy and accomplishing nothing.</pre></div>

<p><strong>The working-set model.</strong> Define W(t, Δ) as the set of distinct pages referenced in the
last Δ references. If the sum of all processes' working-set sizes exceeds available frames,
thrashing is inevitable. The fix is to <em>suspend</em> (swap out) whole processes until the remainder
fit — reducing the degree of multiprogramming, which is the opposite of what a naive
utilisation-driven scheduler would do.</p>

<p><strong>Page-Fault Frequency (PFF)</strong> is the practical control loop: measure each process's fault
rate directly, and if it exceeds an upper threshold give the process more frames; if it drops
below a lower threshold, take some away.</p>

<div class="quiz-section"><h3><span class="qico">◉</span> Check Your Understanding</h3>
<div class="quiz-q">
    <p>For the reference string 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2 with 3 frames, how many faults does FIFO incur?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. 8</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. 10</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. 12</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. 15 — every reference faults</div></div>
    <div class="quiz-explain">FIFO takes <strong>12</strong> faults here, LRU 10, OPT 8. Note that the first 3 references are always compulsory (cold-start) faults for any algorithm with empty frames — the algorithms only start to differ from the 4th reference onward.</div>
  </div>
<div class="quiz-q">
    <p>Which algorithms are immune to Belady&rsquo;s Anomaly?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. FIFO only</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. LRU and OPT (stack algorithms)</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. All page-replacement algorithms</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Only OPT</div></div>
    <div class="quiz-explain">LRU and OPT are stack algorithms — the page set held with n frames is always a subset of the set held with n+1 frames, so extra frames can never cause extra faults. FIFO lacks this property and can get worse with more memory, as demonstrated in the table above.</div>
  </div>
<div class="quiz-q">
    <p>A page&rsquo;s reference bit is 1 when the clock hand reaches it. What happens?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. It is evicted immediately</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. The bit is cleared to 0 and the hand moves on</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. The page is written to disk</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. The page is locked in memory permanently</div></div>
    <div class="quiz-explain">It gets its "second chance": the bit is cleared and the hand advances. If the page is referenced again before the hand comes back round, the bit is re-set and it survives again. Only a page still showing 0 when the hand arrives is evicted. Writing to disk is governed by the <em>dirty</em> bit, which is a separate matter.</div>
  </div>
<div class="quiz-q">
    <p>System-wide CPU utilisation has collapsed to 5%, disk I/O is saturated, and the run queue is long. What is happening and what is the correct response?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Deadlock — run the Banker&rsquo;s algorithm</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Thrashing — reduce the degree of multiprogramming</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Starvation — apply priority aging</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Convoy effect — shrink the time quantum</div></div>
    <div class="quiz-explain">Low CPU utilisation combined with saturated disk and a long run queue is the signature of thrashing: processes spend all their time waiting on page faults. Admitting more processes makes it worse. The correct response is to suspend processes (or add RAM) so the remaining working sets fit in memory.</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div>

<div class="practice"><h3><span class="pico">✎</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied — check every digit.</p>
<div class="prob">
  <div class="prob-q"><span class="prob-n">1</span><div>Reference string <code>2, 3, 2, 1, 5, 2, 4, 5, 3, 2, 5, 2</code> with <strong>3 frames</strong>.
 Compute the number of page faults under <strong>FIFO</strong> and under <strong>LRU</strong>. Show your frame table.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m6l2_p1')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m6l2_p1')">Show solution</button></div>
  <div class="hint" id="h_m6l2_p1">Set out a column per reference. For FIFO, track the order pages were loaded and always evict the oldest. For LRU, track the order pages were last <em>used</em> — a hit reorders the recency list, which is the crucial difference.</div>
  <div class="sol" id="s_m6l2_p1"><h4>FIFO — 9 faults</h4><table class="calc trace"><tr><th>t</th><th>Ref</th><th>F0</th><th>F1</th><th>F2</th><th>Fault?</th><th>Evicted</th></tr><tr><td>1</td><td><strong>2</strong></td><td class="hot">2</td><td></td><td></td><td><span class="bad">FAULT</span></td><td>—</td></tr><tr><td>2</td><td><strong>3</strong></td><td>2</td><td class="hot">3</td><td></td><td><span class="bad">FAULT</span></td><td>—</td></tr><tr><td>3</td><td><strong>2</strong></td><td class="hot">2</td><td>3</td><td></td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>4</td><td><strong>1</strong></td><td>2</td><td>3</td><td class="hot">1</td><td><span class="bad">FAULT</span></td><td>—</td></tr><tr><td>5</td><td><strong>5</strong></td><td>3</td><td>1</td><td class="hot">5</td><td><span class="bad">FAULT</span></td><td>2</td></tr><tr><td>6</td><td><strong>2</strong></td><td>1</td><td>5</td><td class="hot">2</td><td><span class="bad">FAULT</span></td><td>3</td></tr><tr><td>7</td><td><strong>4</strong></td><td>5</td><td>2</td><td class="hot">4</td><td><span class="bad">FAULT</span></td><td>1</td></tr><tr><td>8</td><td><strong>5</strong></td><td class="hot">5</td><td>2</td><td>4</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>9</td><td><strong>3</strong></td><td>2</td><td>4</td><td class="hot">3</td><td><span class="bad">FAULT</span></td><td>5</td></tr><tr><td>10</td><td><strong>2</strong></td><td class="hot">2</td><td>4</td><td>3</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>11</td><td><strong>5</strong></td><td>4</td><td>3</td><td class="hot">5</td><td><span class="bad">FAULT</span></td><td>2</td></tr><tr><td>12</td><td><strong>2</strong></td><td>3</td><td>5</td><td class="hot">2</td><td><span class="bad">FAULT</span></td><td>4</td></tr></table>
<h4>LRU — 7 faults</h4><table class="calc trace"><tr><th>t</th><th>Ref</th><th>F0</th><th>F1</th><th>F2</th><th>Fault?</th><th>Evicted</th></tr><tr><td>1</td><td><strong>2</strong></td><td class="hot">2</td><td></td><td></td><td><span class="bad">FAULT</span></td><td>—</td></tr><tr><td>2</td><td><strong>3</strong></td><td>2</td><td class="hot">3</td><td></td><td><span class="bad">FAULT</span></td><td>—</td></tr><tr><td>3</td><td><strong>2</strong></td><td>3</td><td class="hot">2</td><td></td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>4</td><td><strong>1</strong></td><td>3</td><td>2</td><td class="hot">1</td><td><span class="bad">FAULT</span></td><td>—</td></tr><tr><td>5</td><td><strong>5</strong></td><td>2</td><td>1</td><td class="hot">5</td><td><span class="bad">FAULT</span></td><td>3</td></tr><tr><td>6</td><td><strong>2</strong></td><td>1</td><td>5</td><td class="hot">2</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>7</td><td><strong>4</strong></td><td>5</td><td>2</td><td class="hot">4</td><td><span class="bad">FAULT</span></td><td>1</td></tr><tr><td>8</td><td><strong>5</strong></td><td>2</td><td>4</td><td class="hot">5</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>9</td><td><strong>3</strong></td><td>4</td><td>5</td><td class="hot">3</td><td><span class="bad">FAULT</span></td><td>2</td></tr><tr><td>10</td><td><strong>2</strong></td><td>5</td><td>3</td><td class="hot">2</td><td><span class="bad">FAULT</span></td><td>4</td></tr><tr><td>11</td><td><strong>5</strong></td><td>3</td><td>2</td><td class="hot">5</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>12</td><td><strong>2</strong></td><td>3</td><td>5</td><td class="hot">2</td><td><span class="good">hit</span></td><td>—</td></tr></table>
<p>LRU takes <strong>7</strong> faults versus FIFO&rsquo;s <strong>9</strong>. LRU benefits because page 2 is referenced repeatedly throughout, and LRU keeps recently used pages while FIFO evicts page 2 purely for being old.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">2</span><div>Same reference string, now with <strong>4 frames</strong>, under <strong>OPT</strong>. How many faults, and how does the count compare to LRU with 4 frames?</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m6l2_p2')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m6l2_p2')">Show solution</button></div>
  <div class="hint" id="h_m6l2_p2">At each fault, look forward in the string and evict whichever resident page is next needed furthest away (or never again).</div>
  <div class="sol" id="s_m6l2_p2"><table class="calc trace"><tr><th>t</th><th>Ref</th><th>F0</th><th>F1</th><th>F2</th><th>F3</th><th>Fault?</th><th>Evicted</th></tr><tr><td>1</td><td><strong>2</strong></td><td class="hot">2</td><td></td><td></td><td></td><td><span class="bad">FAULT</span></td><td>—</td></tr><tr><td>2</td><td><strong>3</strong></td><td>2</td><td class="hot">3</td><td></td><td></td><td><span class="bad">FAULT</span></td><td>—</td></tr><tr><td>3</td><td><strong>2</strong></td><td class="hot">2</td><td>3</td><td></td><td></td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>4</td><td><strong>1</strong></td><td>2</td><td>3</td><td class="hot">1</td><td></td><td><span class="bad">FAULT</span></td><td>—</td></tr><tr><td>5</td><td><strong>5</strong></td><td>2</td><td>3</td><td>1</td><td class="hot">5</td><td><span class="bad">FAULT</span></td><td>—</td></tr><tr><td>6</td><td><strong>2</strong></td><td class="hot">2</td><td>3</td><td>1</td><td>5</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>7</td><td><strong>4</strong></td><td>2</td><td>3</td><td>5</td><td class="hot">4</td><td><span class="bad">FAULT</span></td><td>1</td></tr><tr><td>8</td><td><strong>5</strong></td><td>2</td><td>3</td><td class="hot">5</td><td>4</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>9</td><td><strong>3</strong></td><td>2</td><td class="hot">3</td><td>5</td><td>4</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>10</td><td><strong>2</strong></td><td class="hot">2</td><td>3</td><td>5</td><td>4</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>11</td><td><strong>5</strong></td><td>2</td><td>3</td><td class="hot">5</td><td>4</td><td><span class="good">hit</span></td><td>—</td></tr><tr><td>12</td><td><strong>2</strong></td><td class="hot">2</td><td>3</td><td>5</td><td>4</td><td><span class="good">hit</span></td><td>—</td></tr></table>
<p>OPT with 4 frames: <strong>5 faults</strong>. LRU with 4 frames: <strong>6 faults</strong>. The gap between them is the headroom a smarter practical algorithm could theoretically capture.</p>
<p>Full comparison for this string:</p>
<table class="calc"><tr><th>Frames</th><th>FIFO</th><th>LRU</th><th>OPT</th></tr>
<tr><td>3</td><td>9</td><td>7</td><td>6</td></tr>
<tr><td>4</td><td>6</td><td>6</td><td>5</td></tr></table></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">3</span><div><strong>Belady&rsquo;s Anomaly.</strong> Verify the anomaly yourself: run FIFO on
 <code>1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5</code> with 3 frames and then with 4 frames. Confirm faults increase, and
 explain in one sentence why LRU cannot behave this way.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m6l2_p3')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m6l2_p3')">Show solution</button></div>
  <div class="hint" id="h_m6l2_p3">Be meticulous with the 4-frame case — the anomaly is easy to miss with a sloppy table. Count compulsory faults too.</div>
  <div class="sol" id="s_m6l2_p3"><p>FIFO with 3 frames: <strong>9 faults</strong>. FIFO with 4 frames: <strong>10 faults</strong>. Adding a frame made it <em>worse</em> by 1.</p>
<p>LRU cannot do this because it is a <strong>stack algorithm</strong>: the set of pages resident under n frames is always a subset of the set resident under n+1 frames, so an extra frame can only ever add a page that would otherwise have been missing — it can never cause a page that would have been retained to be evicted.</p>
<p>Verified: LRU on the same string gives 10 faults at 3 frames and 8 at 4 — monotonically better, as required.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">4</span><div><strong>Applied.</strong> A server shows 92% CPU in iowait, load average 40, and <code>vmstat 1</code> reports
 <code>si</code>/<code>so</code> columns in the thousands. Someone proposes raising the worker-process count
 from 40 to 80 "because CPU is mostly idle". Evaluate this proposal.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m6l2_p4')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m6l2_p4')">Show solution</button></div>
  <div class="hint" id="h_m6l2_p4">What is iowait actually measuring here, and what do non-zero si/so columns tell you about memory pressure?</div>
  <div class="sol" id="s_m6l2_p4"><p>The proposal is exactly backwards and would make the outage worse.</p>
<p>High <code>si</code>/<code>so</code> means pages are being swapped in and out continuously — the machine is <strong>thrashing</strong>. The CPU looks idle only because every process is blocked on disk I/O for page faults, not because there is spare capacity to exploit. Doubling the workers halves the frames available to each, raising the fault rate further and deepening the spiral described above.</p>
<p>Correct actions, in order: (1) <em>reduce</em> the worker count so the combined working set fits in RAM; (2) measure actual per-worker RSS to size the pool properly; (3) add RAM or move to a larger instance; (4) if swapping to a spinning disk, move swap to SSD as a stopgap. Watch <code>si</code>/<code>so</code> return to ~0 to confirm the fix — that, not CPU utilisation, is the signal that matters here.</p></div>
</div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>For the standard 15-reference string with 3 frames: <strong>OPT 8, LRU 10, FIFO 12</strong> faults.</li><li>OPT is unimplementable — it exists to bound how good a real algorithm could be.</li><li><strong>Belady&rsquo;s Anomaly:</strong> more frames can mean more faults under FIFO. LRU and OPT are immune because they are stack algorithms.</li><li>Clock / second-chance approximates LRU with one reference bit; Linux refines this into active/inactive lists and MGLRU.</li><li>Thrashing is diagnosed by <em>low</em> CPU utilisation with high paging — the cure is fewer processes, not more.</li></ul></div>`
  },
  "m6l3": {
    mod: "MODULE 6 — Memory Management",
    title: "Contiguous Allocation & Segmentation",
    level: "Intermediate",
    time: "35 min",
    industry: "Foundation",
    prev: "m6l2",
    next: "m7l0",
    content: `
<h2>Before Paging: Contiguous Allocation</h2>
<p>Module 6 introduced paging, which solves memory allocation so cleanly that it is easy to forget
there was a problem. This lesson covers what came first — and why the fragmentation it suffers
from is the reason paging exists at all.</p>

<p>In <strong>contiguous allocation</strong>, each process occupies one unbroken block of physical memory.
The hardware needs only two registers to enforce protection:</p>

<div class="diagram"><div class="d-title">Base and Limit Registers</div>Physical memory

  0 +---------------------+
    |   Operating System  |
    +---------------------+  &lt;-- base   = 300040
    |                     |
    |   Process P1        |  limit = 120900
    |                     |
    +---------------------+  &lt;-- base + limit = 420940
    |   free hole         |
    +---------------------+
    |   Process P2        |
    +---------------------+
    |   free hole         |
max +---------------------+

On EVERY memory reference the CPU checks:

     base &lt;= address &lt; base + limit    -&gt;  allowed
     otherwise                         -&gt;  TRAP: addressing error

Two registers, one comparison, complete isolation between
processes. Cheap in hardware -- and completely inflexible,
because a process must fit in one contiguous run of memory.</div>

<h2>The Placement Problem</h2>
<p>Memory becomes a patchwork of allocated blocks and free <strong>holes</strong>. When a new process needs
<em>n</em> bytes, which hole should it get?</p>

<p>Worked example — free holes of <strong>100, 500, 200, 300, 600 KB</strong> (in that order), and
processes requesting <strong>212, 417, 112, 426 KB</strong> in sequence:</p>

<h3>First Fit — take the first hole that is big enough</h3>
<div class="diagram"><div class="d-title">First Fit</div>Initial holes (KB): [100, 500, 200, 300, 600]

  request 212 KB -&gt; hole #2 (500 KB), leaves 288 KB fragment
  request 417 KB -&gt; hole #5 (600 KB), leaves 183 KB fragment
  request 112 KB -&gt; hole #2 (288 KB), leaves 176 KB fragment
  request 426 KB -&gt; NO HOLE LARGE ENOUGH (request fails)

Final holes: [100, 176, 200, 300, 183]
Requests satisfied: 3 of 4</div>

<h3>Best Fit — take the smallest hole that is big enough</h3>
<div class="diagram"><div class="d-title">Best Fit</div>Initial holes (KB): [100, 500, 200, 300, 600]

  request 212 KB -&gt; hole #4 (300 KB), leaves 88 KB fragment
  request 417 KB -&gt; hole #2 (500 KB), leaves 83 KB fragment
  request 112 KB -&gt; hole #3 (200 KB), leaves 88 KB fragment
  request 426 KB -&gt; hole #5 (600 KB), leaves 174 KB fragment

Final holes: [100, 83, 88, 88, 174]
Requests satisfied: 4 of 4</div>

<h3>Worst Fit — take the largest hole</h3>
<div class="diagram"><div class="d-title">Worst Fit</div>Initial holes (KB): [100, 500, 200, 300, 600]

  request 212 KB -&gt; hole #5 (600 KB), leaves 388 KB fragment
  request 417 KB -&gt; hole #2 (500 KB), leaves 83 KB fragment
  request 112 KB -&gt; hole #5 (388 KB), leaves 276 KB fragment
  request 426 KB -&gt; NO HOLE LARGE ENOUGH (request fails)

Final holes: [100, 83, 200, 300, 276]
Requests satisfied: 3 of 4</div>

<div class="callout deepdive">
<strong>The result is counter-intuitive.</strong> On this classic workload, <strong>best fit</strong> places all four
processes, while first fit and worst fit each fail on the last request despite having enough total
free memory. Yet best fit is not generally superior — it tends to leave a scatter of tiny unusable
slivers, and it must scan every hole. Simulation studies consistently find <strong>first fit is the best
practical choice</strong>: comparable storage utilisation to best fit, and faster. Worst fit performs
poorly on both counts.
</div>

<h2>Fragmentation — the fatal flaw</h2>
<table>
  <tr><th></th><th>External Fragmentation</th><th>Internal Fragmentation</th></tr>
  <tr><td><strong>What</strong></td><td>Free memory exists but is split into scattered holes, none individually large enough</td>
      <td>Memory allocated to a process exceeds what it requested; the surplus inside the block is unusable</td></tr>
  <tr><td><strong>Cause</strong></td><td>Variable-size allocation and deallocation over time</td>
      <td>Fixed-size allocation units that rarely match request sizes exactly</td></tr>
  <tr><td><strong>Example</strong></td><td>300 KB free in three 100 KB holes; a 150 KB request fails</td>
      <td>A 4 KB page holding a 100-byte allocation wastes 3996 bytes</td></tr>
  <tr><td><strong>Fix</strong></td><td>Compaction, or paging</td><td>Smaller allocation units (with more overhead)</td></tr>
</table>

<div class="callout warning">
<strong>The 50-percent rule.</strong> Analysis of first fit shows that for every N allocated blocks, about
0.5N blocks are lost to external fragmentation — meaning roughly <strong>one third of memory can become
unusable</strong>. That is a catastrophic overhead, and it is what motivated the move to paging.
</div>

<p><strong>Compaction</strong> shuffles all allocated blocks to one end, merging the holes into one large
region. It works only if relocation is dynamic (base register updated as the process moves), and
it is extremely expensive — the system must halt while potentially gigabytes are copied.</p>

<h2>Segmentation</h2>
<p>Contiguous allocation forces one block per process. <strong>Segmentation</strong> refines this: a process is
divided into logical segments — code, data, stack, heap — each contiguous but placed independently.
This matches how programmers actually think about a program.</p>

<div class="code-block"><pre>A logical address under segmentation is a PAIR:

        &lt;segment number, offset&gt;

Segment table (per process), one entry per segment:

   Seg | Base   | Limit  | Purpose
   ----+--------+--------+------------------
    0  |  1400  |  1000  | code   (read+exec)
    1  |  6300  |   400  | data   (read+write)
    2  |  4300  |  1100  | stack  (read+write)
    3  |  3200  |  1500  | heap   (read+write)

Translating logical address &lt;2, 852&gt;:
    segment 2 -&gt; base 4300, limit 1100
    is 852 &lt; 1100 ?  yes
    physical address = 4300 + 852 = 5152

Translating logical address &lt;1, 900&gt;:
    segment 1 -&gt; limit 400
    is 900 &lt; 400 ?  NO  -&gt;  TRAP: segmentation fault</pre></div>

<div class="callout deepdive">
<strong>This is where the name "segmentation fault" comes from.</strong> Exceeding a segment's limit raised a
hardware trap on segmented architectures. Linux on x86-64 uses a flat memory model with paging
rather than true segmentation, but the error name survived — today it means an invalid page access,
not a segment-limit violation.
</div>

<p><strong>Segmentation still suffers external fragmentation</strong>, because segments are variable-sized
contiguous blocks. The solution that finally worked was to combine both ideas — divide memory into
<em>fixed-size</em> pages, eliminating external fragmentation entirely and accepting a small amount of
internal fragmentation in the last page of each allocation. That is paging, and it is why Module 6
exists.</p>

<div class="quiz-section"><h3><span class="qico">◉</span> Check Your Understanding</h3>
<div class="quiz-q">
    <p>Free holes of 100, 500, 200, 300, 600 KB. Under <strong>first fit</strong>, which hole does a 212 KB request receive?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. The 600 KB hole</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. The 500 KB hole</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. The 300 KB hole</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. The 200 KB hole</div></div>
    <div class="quiz-explain">First fit scans from the beginning and takes the first hole that is large enough. 100 KB is too small, so the 500 KB hole is chosen, leaving a 288 KB fragment. Best fit would have picked the 300 KB hole (the tightest fit), and worst fit the 600 KB hole.</div>
  </div>
<div class="quiz-q">
    <p>A system has 300 KB free, spread across three 100 KB holes. A 150 KB request fails. What is this?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Internal fragmentation</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. External fragmentation</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Thrashing</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. A memory leak</div></div>
    <div class="quiz-explain">Sufficient memory exists in total, but it is not <em>contiguous</em> — that is external fragmentation. Internal fragmentation is the opposite: memory wasted <em>inside</em> an allocated block, such as a 4 KB page holding a 100-byte object. Compaction or paging fixes external fragmentation.</div>
  </div>
<div class="quiz-q">
    <p>Why does paging eliminate external fragmentation entirely?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Pages are allocated contiguously</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Any free frame can hold any page, so no contiguity is required</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. The OS compacts memory continuously</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Pages are compressed</div></div>
    <div class="quiz-explain">Because every frame is the same fixed size, any free frame will serve for any page. A process&rsquo;s pages can be scattered arbitrarily across physical memory and the page table hides the scattering. There is never a "hole too small to use" — the only waste is internal fragmentation in the final partial page, averaging half a page per allocation.</div>
  </div>
<div class="quiz-q">
    <p>Translate logical address &lt;1, 900&gt; using the segment table above (segment 1: base 6300, limit 400).</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Physical address 7200</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Physical address 6300</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. A trap — offset exceeds the segment limit</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Physical address 900</div></div>
    <div class="quiz-explain">The offset 900 is checked against the segment limit of 400 first. Since 900 ≥ 400, the reference is outside the segment and the hardware raises an addressing trap rather than computing any physical address. This bounds check on every access is what makes segmentation a protection mechanism as well as an allocation one.</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div>

<div class="practice"><h3><span class="pico">✎</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied — check every digit.</p>
<div class="prob">
  <div class="prob-q"><span class="prob-n">1</span><div>Free holes, in order: <strong>250, 700, 150, 400, 900 KB</strong>. Requests arrive in sequence for
 <strong>350, 180, 640, 220 KB</strong>. Show the placement and the resulting holes under
 <strong>first fit</strong> and <strong>best fit</strong>. Does either fail?</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m6l3_p1')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m6l3_p1')">Show solution</button></div>
  <div class="hint" id="h_m6l3_p1">Process the requests strictly in order, updating the hole list after each placement. For best fit, compare every hole large enough and pick the smallest.</div>
  <div class="sol" id="s_m6l3_p1"><p><strong>First fit:</strong></p>
<pre class="mini">holes: [250, 700, 150, 400, 900]
 350 -> hole 2 (700), leaves 350   -> [250, 350, 150, 400, 900]
 180 -> hole 1 (250), leaves  70   -> [ 70, 350, 150, 400, 900]
 640 -> hole 5 (900), leaves 260   -> [ 70, 350, 150, 400, 260]
 220 -> hole 2 (350), leaves 130   -> [ 70, 130, 150, 400, 260]
All 4 requests satisfied.</pre>
<p><strong>Best fit:</strong></p>
<pre class="mini">holes: [250, 700, 150, 400, 900]
 350 -> hole 4 (400), leaves  50   -> [250, 700, 150,  50, 900]
 180 -> hole 1 (250), leaves  70   -> [ 70, 700, 150,  50, 900]
 640 -> hole 2 (700), leaves  60   -> [ 70,  60, 150,  50, 900]
 220 -> hole 5 (900), leaves 680   -> [ 70,  60, 150,  50, 680]
All 4 requests satisfied.</pre>
<p>Both succeed here, but note the difference in the resulting memory profile. Best fit leaves fragments of 70, 60, 150, 50 and 680 KB — four slivers under 160 KB that are unlikely ever to be usable. First fit leaves a more even spread. This is the classic criticism of best fit: it optimises each individual placement while degrading the pool as a whole.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">2</span><div>A segment table holds: seg 0 (base 219, limit 600), seg 1 (base 2300, limit 14),
 seg 2 (base 90, limit 100), seg 3 (base 1327, limit 580).
 Translate: &lt;0, 430&gt;, &lt;1, 10&gt;, &lt;2, 500&gt;, &lt;3, 400&gt;.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m6l3_p2')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m6l3_p2')">Show solution</button></div>
  <div class="hint" id="h_m6l3_p2">For each, check offset < limit first. Only then add the base.</div>
  <div class="sol" id="s_m6l3_p2"><pre class="mini">&lt;0, 430&gt;: 430 &lt; 600  OK  ->  219 + 430  = 649
&lt;1,  10&gt;:  10 &lt;  14  OK  -> 2300 +  10  = 2310
&lt;2, 500&gt;: 500 &lt; 100  NO  ->  TRAP (segmentation fault)
&lt;3, 400&gt;: 400 &lt; 580  OK  -> 1327 + 400  = 1727</pre>
<p>Only the third reference fails: offset 500 lies well outside segment 2, which is just 100 bytes long. Notice that the limit check always precedes the addition — the hardware never computes an out-of-bounds physical address, so a faulty program cannot even accidentally name memory belonging to another process.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">3</span><div><strong>Conceptual.</strong> A system uses 4 KB pages. A process allocates 100 objects of 100 bytes each
 via separate 4 KB mappings. Quantify the waste and name the fragmentation type. Then explain why the
 system still prefers this over contiguous allocation.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m6l3_p3')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m6l3_p3')">Show solution</button></div>
  <div class="hint" id="h_m6l3_p3">Compute requested bytes versus bytes actually committed, then ask which kind of fragmentation lives inside an allocation unit.</div>
  <div class="sol" id="s_m6l3_p3"><p>Requested: 100 × 100 bytes = <strong>10 KB</strong>. Committed: 100 × 4 KB = <strong>400 KB</strong>. Waste = 390 KB, or <strong>97.5%</strong> — this is <strong>internal fragmentation</strong>, memory lost inside allocated units.</p>
<p>(In reality a heap allocator would pack all 100 objects into a handful of pages; the scenario is deliberately pathological to isolate the effect.)</p>
<p><strong>Why paging is still preferred:</strong> internal fragmentation is <em>bounded and predictable</em> — at most one page minus one byte per allocation, averaging half a page. External fragmentation under contiguous allocation is <em>unbounded and pathological</em>: by the 50-percent rule about a third of memory becomes unusable, and worse, a large request can fail outright while plenty of total memory remains free. A predictable ceiling on waste beats an unpredictable failure mode.</p>
<p>Paging also delivers what contiguous allocation fundamentally cannot: non-contiguous physical placement, demand loading, page-level protection, copy-on-write sharing, and swapping at page granularity rather than whole-process granularity.</p></div>
</div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>Contiguous allocation needs only base and limit registers — cheap, but a process must fit in one unbroken block.</li><li><strong>First fit</strong> is the best practical placement policy; best fit leaves unusable slivers, worst fit is poor at both.</li><li><strong>External</strong> fragmentation = free memory scattered in unusable holes. <strong>Internal</strong> = waste inside an allocated unit.</li><li>The 50-percent rule: first fit can lose roughly one third of memory to external fragmentation.</li><li>Segmentation matches the programmer&rsquo;s view (code/data/stack/heap) but still fragments externally.</li><li>Fixed-size pages eliminate external fragmentation entirely — that is why paging won.</li></ul></div>`
  },
  "m7l0": {
    mod: "MODULE 7 — Storage & I/O",
    title: "File Systems",
    level: "Intermediate",
    time: "20 min",
    industry: "Daily Relevance",
    prev: "m6l3",
    next: "m7l3",
    content: `
<h2>What a File System Does</h2>
<p>The file system is the OS's answer to: "How do we organise bits on disk so they're findable, nameable, permission-controlled, and survive crashes?"</p>
<p>A file system provides: <strong>files</strong> (named byte sequences), <strong>directories</strong> (namespace / naming), <strong>metadata</strong> (permissions, timestamps, owner), and <strong>persistence</strong> (survives power off).</p>

<h2>The Inode — Heart of Unix File Systems</h2>
<p>Every file in ext4/xfs/btrfs is represented by an <strong>inode</strong> (index node). The inode stores everything <em>about</em> a file except its name.</p>

<div class="diagram">
  <div class="d-title">Inode Structure (ext4)</div>
struct inode {
    <span class="highlight">mode_t i_mode</span>          — file type + permissions (rwxrwxrwx)
    <span class="highlight">uid_t i_uid</span>            — owner user ID
    <span class="highlight">gid_t i_gid</span>            — owner group ID
    <span class="highlight2">loff_t i_size</span>          — file size in bytes
    <span class="highlight2">struct timespec</span>        — atime, mtime, ctime (access/modify/change)
    <span class="highlight3">block_t i_block[15]</span>    — pointers to data blocks:
                               [0..11]: direct block pointers
                               [12]:    single indirect pointer
                               [13]:    double indirect pointer
                               [14]:    triple indirect pointer
    nlink_t i_nlinks       — number of hard links to this inode
}
</div>

<div class="callout deepdive">
<strong>Hard links vs Symbolic links:</strong> A directory entry is just a mapping of name → inode number. Hard links are multiple directory entries pointing to the SAME inode. <code>rm file.txt</code> decrements the link count; the inode is deleted only when count reaches 0. A symbolic link (symlink) is a separate inode whose content is a path string. If the target is deleted, symlinks become dangling. <code>ln file.txt hardlink</code> vs <code>ln -s file.txt softlink</code>.
</div>

<h2>Directory Structure</h2>
<p>A directory is just a special file whose contents is a list of (filename → inode number) mappings.</p>

<div class="code-block" data-lang="LINUX">
<pre><span class="cm"># See inode numbers</span>
ls -i /etc/hosts
  <span class="num">1234567</span> /etc/hosts

<span class="cm"># See how many hard links a file has</span>
stat /etc/hosts
  Inode: 1234567   Links: 1

<span class="cm"># / root directory always inode 2 in ext4</span>
ls -id /
  <span class="num">2</span> /</pre>
</div>

<h2>File System Types</h2>
<table>
  <tr><th>FS</th><th>OS</th><th>Key Feature</th></tr>
  <tr><td>ext4</td><td>Linux</td><td>Journaling, mature, reliable. Default on most Linux systems.</td></tr>
  <tr><td>xfs</td><td>Linux</td><td>High performance, scales to huge files. Used on RHEL servers.</td></tr>
  <tr><td>btrfs</td><td>Linux</td><td>Copy-on-write, snapshots, checksums. Modern but controversial reliability.</td></tr>
  <tr><td>NTFS</td><td>Windows</td><td>Journaling, ACLs, compression, encryption.</td></tr>
  <tr><td>APFS</td><td>macOS/iOS</td><td>CoW, encryption, snapshots, designed for SSDs.</td></tr>
  <tr><td>tmpfs</td><td>Linux</td><td>In-memory file system. /tmp on modern systems. Lost on reboot.</td></tr>
  <tr><td>procfs (/proc)</td><td>Linux</td><td>Virtual FS exposing kernel data as files. /proc/cpuinfo, /proc/meminfo</td></tr>
</table>

<h2>Journaling</h2>
<p>Without journaling, a crash mid-write leaves the file system in an inconsistent state. Repair (<code>fsck</code>) could take hours on large disks.</p>
<p>Journaling: before modifying file system structures, write a <em>journal entry</em> (log of intended changes) first. On crash, replay the journal to complete or undo the partial operation.</p>

<div class="callout industry-note">
<strong>In production:</strong> <code>df -h</code> (disk usage), <code>du -sh /var/log/*</code> (directory sizes), <code>lsof</code> (open files — crucial for "can't delete file that's still in use"), <code>inotifywait</code> (monitor file changes). Understanding inodes matters when you see "disk full" with <code>df</code> reporting 0% full — you've run out of inodes (<code>df -i</code> shows inode usage). A directory with millions of small files exhausts inodes before exhausting space.
</div>

<div class="quiz-section"><h3><span class="qico">◉</span> Check Your Understanding</h3>
<div class="quiz-q">
    <p><code>df</code> reports the disk is 60% full, yet writes fail with "No space left on device". What is the most likely cause?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. The disk is failing</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Inode exhaustion</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. A quota limit</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. The filesystem is mounted read-only</div></div>
    <div class="quiz-explain">A filesystem allocates a fixed number of inodes at format time. Millions of tiny files (mail spools, session caches, CI artefacts) can exhaust the inode table while leaving most data blocks free. <code>df -i</code> reveals this immediately. A read-only mount would give EROFS, a different error.</div>
  </div>
<div class="quiz-q">
    <p>You delete a 10 GB log file but free space does not increase. Why?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. The filesystem needs fsck</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. A process still holds the file open, so the inode link count is not zero</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. The file went to a trash folder</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. The deletion is buffered and will apply later</div></div>
    <div class="quiz-explain">Unlinking removes the directory entry, but the inode is only freed when both the link count <em>and</em> the open-descriptor count reach zero. A running process holding the file open keeps the blocks allocated. <code>lsof | grep deleted</code> identifies the culprit; restarting or signalling the process releases the space. This is a routine production incident with log files.</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div><div class="practice"><h3><span class="pico">✎</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied — check every digit.</p>
<div class="prob">
  <div class="prob-q"><span class="prob-n">1</span><div>An ext4 inode has 12 direct pointers, plus single, double and triple indirect pointers.
 Block size is 4 KB and each pointer is 4 bytes. Compute the maximum file size.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m7l0_p1')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m7l0_p1')">Show solution</button></div>
  <div class="hint" id="h_m7l0_p1">Each 4 KB block holds 4096/4 = 1024 pointers. Work out the reach of each tier separately, then sum.</div>
  <div class="sol" id="s_m7l0_p1"><pre class="mini">Pointers per block = 4096 / 4 = 1024

Direct:     12          x 4 KB =        48 KB
Single ind: 1024        x 4 KB =         4 MB
Double ind: 1024^2      x 4 KB =         4 GB
Triple ind: 1024^3      x 4 KB =         4 TB
                                 ----------------
Maximum  ~= 4 TB + 4 GB + 4 MB + 48 KB  ~= 4 TB</pre>
<p>The triple-indirect tier dominates so completely that the others are rounding error. Note the elegance of the design: a small file needs only the 12 direct pointers, so access is a single block read with no indirection at all. Cost scales with file size rather than being imposed uniformly — the common case stays fast.</p>
<p>Reading byte 5,000,000 of a large file requires: read the inode → read the single-indirect block → read the data block. Three I/Os, of which the first two are almost always cached.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">2</span><div>Explain the difference between a hard link and a symbolic link. What happens to each when the
 original file is deleted, and why can hard links not span filesystems?</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m7l0_p2')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m7l0_p2')">Show solution</button></div>
  <div class="hint" id="h_m7l0_p2">A directory entry maps a name to an inode number. Consider what each link type actually stores.</div>
  <div class="sol" id="s_m7l0_p2"><p>A <strong>hard link</strong> is simply another directory entry pointing at the <em>same inode</em>. There is no "original" — all names are equal peers, and the inode&rsquo;s link count records how many exist. Deleting one name decrements the count; the data is freed only at zero. So after <code>rm original</code>, the hard link still works perfectly and the data is fully intact.</p>
<p>A <strong>symbolic link</strong> is a distinct inode whose contents are a <em>path string</em>. Deleting the target leaves the symlink pointing nowhere — it becomes <em>dangling</em>, and opening it fails with ENOENT.</p>
<p><strong>Why hard links cannot cross filesystems:</strong> inode numbers are only meaningful within a single filesystem. Inode 5,000 on <code>/home</code> and inode 5,000 on <code>/var</code> are entirely unrelated. A directory entry stores just the number, with no way to name a different filesystem, so the link would be ambiguous. Symlinks store a path — which the kernel resolves from scratch each time — so they cross filesystems freely.</p>
<p>Hard links to directories are also forbidden (except <code>.</code> and <code>..</code>, created by the kernel), because they would allow cycles in the directory graph and break tree-walking tools.</p></div>
</div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>An inode holds every attribute of a file <em>except its name</em>; names live in directory entries.</li><li>Indirect pointer tiers keep small-file access fast while still supporting terabyte files.</li><li><code>df -i</code> for inode exhaustion; <code>lsof | grep deleted</code> for space not freed after deletion.</li><li>Hard links share an inode and cannot cross filesystems; symlinks store a path and can.</li></ul></div>`
  },
  "m7l3": {
    mod: "MODULE 7 — Storage & I/O",
    title: "File Allocation & Free Space",
    level: "Intermediate",
    time: "40 min",
    industry: "Filesystem Design",
    prev: "m7l0",
    next: "m7l1",
    content: `
<h2>Three Ways to Lay a File on Disk</h2>
<p>A file is a sequence of bytes; a disk is an array of fixed-size blocks. The <em>allocation
method</em> is how the filesystem records which blocks belong to which file &mdash; and the choice
determines whether random access is fast, whether the disk fragments, and how large a file can be.</p>

<h3>1. Contiguous Allocation</h3>
<div class="diagram"><div class="d-title">Contiguous allocation</div>Directory entry stores just: start block + length

  file &quot;report.txt&quot;: start = 19, length = 6

  block: 17  18  19  20  21  22  23  24  25  26
        [  ][  ][##][##][##][##][##][##][  ][  ]
                  \_______ report.txt _______/

+ Simplest possible metadata: two numbers per file
+ FASTEST sequential read -- the head barely moves
+ Random access is trivial arithmetic: block = start + offset/blocksize

- EXTERNAL FRAGMENTATION: free space fragments into unusable holes
- A file CANNOT GROW if the next block is taken
- You must know the final size WHEN YOU CREATE the file
  (and over-estimating wastes the difference permanently)</div>
<p><strong>Verdict:</strong> excellent read performance, fatal flaws elsewhere. Used today only where
files are written once and never grow &mdash; ISO9660 on optical media, and some read-only embedded
images.</p>

<h3>2. Linked Allocation</h3>
<div class="diagram"><div class="d-title">Linked allocation</div>Each block stores the address of the next. Directory holds
first and last.

  file &quot;log.txt&quot;: start = 9

  [ 9 ]---&gt; [ 4 ]---&gt; [ 22 ]---&gt; [ 13 ]---&gt; NULL
  data      data      data       data

+ NO external fragmentation -- any free block will do
+ File grows freely; no size declaration needed

- RANDOM ACCESS IS O(n): to read block 500 you must read
  the 499 blocks before it, one disk seek each
- A single corrupted pointer orphans the entire rest of the file
- Pointer consumes space in every block, so the usable
  block size is no longer a power of two</div>
<p><strong>Verdict:</strong> no external fragmentation and files grow freely, but random access is
hopeless. <strong>FAT</strong> improves on it by pulling all the pointers out into one File Allocation
Table that can be cached in RAM &mdash; following the chain then costs no disk reads at all, which is
why FAT was viable on floppies and is still used on SD cards and EFI partitions.</p>

<h3>3. Indexed Allocation &mdash; the inode</h3>
<div class="diagram"><div class="d-title">Indexed allocation</div>All pointers for a file collected into ONE index block.

  inode -&gt; index block 19
                 +--------+
                 |   9    |  -&gt; data block 0
                 |   4    |  -&gt; data block 1
                 |  22    |  -&gt; data block 2
                 |  13    |  -&gt; data block 3
                 |  ...   |
                 +--------+

+ Direct random access: block N is entry N in the index
+ No external fragmentation
+ Corruption is contained -- one bad pointer loses one block

- The index block itself costs space, wasteful for tiny files
- ONE index block limits maximum file size:
  a 4 KB block with 4-byte pointers = 1024 pointers
  = 1024 x 4 KB = only 4 MB per file.
  Solved by the multi-level scheme below.</div>

<h3>Multi-level index: how ext4 supports huge files</h3>
<p>One index block holds only so many pointers. Unix solves this with tiered indirection &mdash;
12 direct pointers, then single, double and triple indirect blocks:</p>

<div class="diagram"><div class="d-title">ext2/ext3 inode block pointers</div>inode i_block[15]

  [0..11]  ------------------------------&gt; 12 data blocks   (48 KB)

  [12] single indirect --&gt; [block of 1024 ptrs] --&gt; 1024 blocks   (4 MB)

  [13] double indirect --&gt; [1024 ptrs] --&gt; [1024 ptrs each] 
                                        --&gt; 1,048,576 blocks (4 GB)

  [14] triple indirect --&gt; [1024] --&gt; [1024] --&gt; [1024]
                                        --&gt; 1,073,741,824 blocks (4 TB)

With 4 KB blocks and 4-byte pointers: 4096/4 = 1024 pointers
per indirect block.</div>

<table class="calc">
  <tr><th>Tier</th><th>Blocks reachable</th><th>Bytes covered</th><th>Disk reads to fetch</th></tr>
  <tr><td>12 direct</td><td>12</td><td>48 KB</td><td><strong>1</strong></td></tr>
  <tr><td>Single indirect</td><td>1,024</td><td>4 MB</td><td>2</td></tr>
  <tr><td>Double indirect</td><td>1,048,576</td><td>4 GB</td><td>3</td></tr>
  <tr><td>Triple indirect</td><td>1,073,741,824</td><td>4 TB</td><td>4</td></tr>
  <tr class="tfoot"><td colspan="2">Maximum file size</td><td><strong>~4 TB</strong></td><td></td></tr>
</table>

<div class="callout deepdive">
<strong>The design is deliberately asymmetric.</strong> Small files &mdash; the overwhelming majority on
any real system &mdash; are reached in a <em>single</em> read via the direct pointers. Cost grows only
as files do. Verify against the table: byte 100 needs 1 read (direct), byte 5,000,000 needs 3
(double indirect), and byte 10,000,000,000 needs 4 (triple indirect). Since indirect blocks are cached after
first use, sequential streaming of a large file pays the indirection cost once, not per block.
</div>

<div class="callout industry-note">
<strong>What ext4 actually does now.</strong> Indirect blocks are inefficient for very large contiguous
files &mdash; a 1&nbsp;GB file needs ~256,000 pointers describing blocks that are mostly consecutive.
ext4 therefore defaults to <strong>extents</strong>: a single record saying "12,000 blocks starting at
block 98,304". Four extents fit directly in the inode, and a large contiguous file may need just one.
This cuts metadata dramatically and speeds up <code>fsck</code>, delete and truncate. Extent trees
are also what btrfs, XFS and NTFS (as "runs") use. The indirect-block scheme remains the standard
teaching model and is still present in ext4 for backward compatibility.
</div>

<h2>Free-Space Management</h2>
<p>The mirror-image problem: the filesystem must also know which blocks are <em>free</em>, and answer
"give me a free block" quickly, ideally near the file's other blocks.</p>

<h3>Bit Vector (bitmap)</h3>
<div class="diagram"><div class="d-title">Bit vector free-space map</div>One bit per block: 1 = free, 0 = allocated

  block:  0  1  2  3  4  5  6  7  8  9 10 11 ...
  bitmap: 0  0  1  1  1  0  0  1  1  1  1  0

  Blocks 2,3,4 are free -- and CONSECUTIVE, which the
  bit pattern makes immediately visible.

Finding the first free block = find the first set bit,
a single CPU instruction (bsf/ctz) per 64 blocks.

Finding N CONSECUTIVE free blocks = scan for N adjacent
1-bits. This is what makes extents practical.</div>

<table class="calc">
  <tr><th>Disk size</th><th>4 KB blocks</th><th>Bitmap size</th><th>Overhead</th></tr>
  <tr><td>1 GB</td><td>262,144</td><td>0.03 MB</td><td>0.0031%</td></tr><tr><td>500 GB</td><td>131,072,000</td><td>15.62 MB</td><td>0.0031%</td></tr><tr><td>4,000 GB</td><td>1,048,576,000</td><td>125.00 MB</td><td>0.0031%</td></tr>
</table>

<p>The overhead is <strong>0.003%</strong> regardless of disk size &mdash; three megabytes of bitmap per
hundred gigabytes. Cheap, and the representation has a decisive advantage: finding a <em>run</em> of
consecutive free blocks is a scan for consecutive zero bits, which CPUs do extremely fast with
word-at-a-time tests. That directly supports contiguous allocation and extents.</p>

<h3>Linked List and Grouping</h3>
<div class="diagram"><div class="d-title">Linked list and grouping</div>LINKED FREE LIST
  superblock -&gt; [free 3] -&gt; [free 8] -&gt; [free 12] -&gt; ...
  each free block stores the address of the next

  + zero extra space: the pointers live in blocks that
    are free anyway
  - to find 100 contiguous blocks you must WALK the list
  - traversal costs a disk read per block

GROUPING
  first free block stores the addresses of the next N
  free blocks; the last of those points to the next group

  + one read yields N free block addresses instead of 1

COUNTING
  store (start address, run length) pairs instead of
  individual blocks -- exploits the fact that free blocks
  usually cluster

  [ (3, 5) ] [ (14, 2) ] [ (31, 9) ]
    5 free      2 free     9 free
    from 3      from 14    from 31

  + very compact when free space is not badly fragmented
  + directly answers &quot;where is a run of 9 free blocks?&quot; </div>

<div class="callout warning">
<strong>Why the bitmap wins in practice.</strong> A linked free list makes allocating <em>one</em> block
trivial &mdash; take the head. But allocating 100 <em>adjacent</em> blocks requires walking the list
hunting for neighbours, which may mean many disk reads. Modern filesystems care enormously about
contiguity (it is the difference between 0.5 MB/s and 67 MB/s on a spinning disk), so they use
bitmaps, usually split per block-group so allocation stays local to the file's inode.
</div>

<div class="callout deepdive">
<strong>Delayed allocation.</strong> ext4 does not choose blocks at <code>write()</code> time at all. It
holds dirty pages in memory and picks the blocks only at flush &mdash; by which point it knows the
file's final size and can select one large contiguous extent instead of scattering blocks as the
file grew. This measurably reduces fragmentation. The trade-off is a wider window in which a crash
loses data, which is why the 2009 ext4 "empty file after crash" controversy led to special-casing
the common rename-over-a-file pattern.
</div>

<div class="quiz-section"><h3><span class="qico">&#9673;</span> Check Your Understanding</h3>
<div class="quiz-q"><p>Which allocation method makes reading byte 5,000,000 of a large file <em>slowest</em>?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Contiguous</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Linked</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Indexed with multi-level tiers</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Extent-based</div></div><div class="quiz-explain">Linked allocation offers no random access at all &mdash; reaching block 1,220 means reading the 1,219 blocks before it to follow the pointer chain, each a separate disk access. Contiguous computes the address arithmetically (1 read), and multi-level indexed needs 3 reads at that offset. This is precisely why linked allocation is obsolete except in FAT, which caches the whole chain in RAM.</div></div>
<div class="quiz-q"><p>An inode has 12 direct pointers, 4&nbsp;KB blocks, and 4-byte pointers. Why is reading a 30&nbsp;KB file faster per byte than reading a 3&nbsp;GB file?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Small files are stored in the inode itself</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. 30 KB fits in the direct pointers &mdash; one read, no indirection</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Large files are always fragmented</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. The page cache only holds small files</div></div><div class="quiz-explain">30&nbsp;KB is 8 blocks, well within the 12 direct pointers, so the block address is already in the inode &mdash; a single read. A 3&nbsp;GB file lies in the double-indirect tier, needing two extra metadata reads before any data. The design deliberately optimises the common case, since most files on a real system are small.</div></div>
<div class="quiz-q"><p>Why do modern filesystems prefer a bitmap over a linked free list?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Bitmaps use less disk space</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Bitmaps make finding <em>consecutive</em> free blocks fast</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Linked lists cannot represent large disks</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Bitmaps survive crashes automatically</div></div><div class="quiz-explain">Both are space-efficient (a linked list uses blocks that are free anyway; a bitmap costs ~0.003%). The decisive advantage is contiguity: a run of free blocks is a run of set bits, findable with word-at-a-time CPU instructions. A linked list would have to be walked, with a disk read per hop. Since contiguous layout is worth two orders of magnitude on a spinning disk, that capability dominates.</div></div>
<div class="quiz-q"><p>What problem do <em>extents</em> solve that indirect blocks do not?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. They allow files larger than 4 TB</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. They replace thousands of pointers to consecutive blocks with one (start, length) record</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. They eliminate the need for inodes</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. They prevent external fragmentation</div></div><div class="quiz-explain">A 1&nbsp;GB contiguous file needs roughly 256,000 individual block pointers under the indirect scheme, even though the blocks are consecutive. One extent record &mdash; start plus length &mdash; describes the same thing. This shrinks metadata, speeds up <code>fsck</code>, truncate and delete, and improves locality. Extents do not by themselves raise the size ceiling or remove fragmentation.</div></div>
<button class="quiz-reset" onclick="resetQuiz(this)">&#8634; Reset these questions</button></div>
<div class="practice"><h3><span class="pico">&#9998;</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied &mdash; check every digit.</p>
<div class="prob"><div class="prob-q"><span class="prob-n">1</span><div>A filesystem uses 2&nbsp;KB blocks and 4-byte pointers, with an inode holding 10 direct
pointers plus single, double and triple indirect. (a) How many pointers fit in one indirect block?
(b) Compute the maximum file size. (c) How many disk reads to fetch the block at byte offset 3,000,000?</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m7l3_p1')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m7l3_p1')">Show solution</button></div><div class="hint" id="h_m7l3_p1">Pointers per block = block size / pointer size. Work through the tiers in order, subtracting each tier&rsquo;s reach as you go.</div><div class="sol" id="s_m7l3_p1"><pre class="mini">(a) pointers per block = 2048 / 4 = <b>512</b>

(b) direct : 10        x 2 KB =        20 KB
    single : 512       x 2 KB =         1 MB
    double : 512^2     x 2 KB =       512 MB
             (262,144 blocks)
    triple : 512^3     x 2 KB =       256 GB
             (134,217,728 blocks)
                                 -------------
    maximum = <b>~256.5 GB</b>  (triple tier dominates)

(c) byte 3,000,000 -> block index 3,000,000 / 2048 = 1464

    direct covers blocks 0-9          -> no  (1464 &gt; 9)
    subtract 10          -> 1454
    single covers next 512 (0-511)    -> no  (1454 &gt; 511)
    subtract 512         -> 942
    double covers next 262,144        -> YES (942 &lt; 262,144)

    Reads: double-indirect block, then the second-level
    block, then the data block = <b>3 disk reads</b></pre>
<p>Note how sharply the ceiling depends on block size: doubling to 4&nbsp;KB blocks doubles the pointers per block to 1,024, and since the triple tier scales with the <em>cube</em> of that number, the maximum jumps from 256&nbsp;GB to about 4&nbsp;TB &mdash; a 16&times; increase from a 2&times; change.</p></div></div>
<div class="prob"><div class="prob-q"><span class="prob-n">2</span><div>A 2&nbsp;TB disk uses 4&nbsp;KB blocks. (a) How many blocks? (b) How large is the free-space
bitmap, and what percentage of the disk is that? (c) Give one scenario where a counting
(run-length) representation would be much smaller, and one where it would be much larger.</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m7l3_p2')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m7l3_p2')">Show solution</button></div><div class="hint" id="h_m7l3_p2">Blocks = disk size / block size. A bitmap needs one bit per block; divide by 8 for bytes.</div><div class="sol" id="s_m7l3_p2"><pre class="mini">(a) 2 TB / 4 KB = 2 x 1024^4 / 4096
                = <b>536,870,912 blocks</b>

(b) bitmap = 536,870,912 bits / 8 = 67,108,864 bytes
           = <b>64 MB</b>

    overhead = 64 MB / 2 TB = <b>0.003%</b></pre>
<p><strong>(c) Counting is much smaller</strong> on a freshly formatted or lightly used disk. If the free space is one contiguous run, the entire free map is a single record: <code>(start=1000, length=536,000,000)</code> &mdash; about 12 bytes, versus 64&nbsp;MB for the bitmap. A five-million-fold saving.</p>
<p><strong>Counting is much larger</strong> on a badly fragmented disk where free and used blocks alternate. In the pathological case of every other block free, you need one (start, length) record per free block: 268 million records at ~12 bytes each is over <strong>3&nbsp;GB</strong> &mdash; nearly 50&times; worse than the bitmap.</p>
<p>The bitmap&rsquo;s virtue is that its size is <em>fixed and predictable</em> regardless of fragmentation, which matters more to a filesystem designer than being optimal in the best case. Real systems hedge: ext4 uses per-block-group bitmaps, and XFS maintains B+ trees of free extents keyed by both offset and size, giving fast answers to "a run of exactly N blocks near here?".</p></div></div>
<div class="prob"><div class="prob-q"><span class="prob-n">3</span><div><strong>Applied.</strong> A media server stores 2,000 video files averaging 4&nbsp;GB, written once
and read sequentially many times. A second server stores 50 million log fragments averaging 8&nbsp;KB,
appended constantly. Recommend an allocation strategy and block size for each, with justification.</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m7l3_p3')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m7l3_p3')">Show solution</button></div><div class="hint" id="h_m7l3_p3">Consider the access pattern, how the files grow, and for the second case what resource runs out first.</div><div class="sol" id="s_m7l3_p3"><p><strong>Media server &mdash; extent-based allocation, large blocks (or a large filesystem cluster size).</strong></p>
<p>Files are written once, never grow, and are read start-to-finish. That is the ideal case for extents: a 4&nbsp;GB file can be described by a handful of records, or even one, giving near-contiguous layout and letting the disk stream at full sequential speed. Large blocks (64&nbsp;KB clusters, or XFS with a big allocation-group size) further cut metadata and seek count. Internal fragmentation is irrelevant &mdash; wasting 32&nbsp;KB inside the last block of a 4&nbsp;GB file is 0.0008%. <strong>XFS</strong> is the conventional choice here and was built for exactly this workload. Preallocating with <code>fallocate()</code> before writing lets the allocator pick one clean extent.</p>
<p><strong>Log server &mdash; small blocks, and inode count is the real constraint.</strong></p>
<p>50 million files at 8&nbsp;KB is only ~400&nbsp;GB of data, but it needs <strong>50 million inodes</strong>. The default ext4 ratio of one inode per 16&nbsp;KB would give roughly 26 million on a 400&nbsp;GB volume &mdash; you would hit "No space left on device" with the disk half empty, the <code>df -i</code> failure mode from the File Systems lesson. Format with <code>mkfs.ext4 -i 8192</code> (or <code>-N 60000000</code>) to provision enough. Use 4&nbsp;KB blocks: with 8&nbsp;KB files, 64&nbsp;KB blocks would waste 87% of the space to internal fragmentation.</p>
<p>Better still, question the design. 50 million tiny files is a workload filesystems handle badly whatever you tune &mdash; directory lookups, backup times and <code>fsck</code> all degrade. Appending to a smaller number of larger segment files, or using an LSM-tree store, avoids the problem rather than accommodating it. This is why Kafka writes large append-only segment files instead of one file per message.</p></div></div>
</div>

<div class="takeaways"><h3>&#9889; Key Takeaways</h3><ul><li><strong>Contiguous</strong>: fastest reads, but external fragmentation and files cannot grow.</li><li><strong>Linked</strong>: no fragmentation, but random access is O(n). FAT fixes this by caching the table in RAM.</li><li><strong>Indexed</strong>: direct random access; one index block caps file size, so Unix tiers it.</li><li>ext2/3 inode: 12 direct + single/double/triple indirect &rarr; ~4 TB, and small files still cost <strong>one read</strong>.</li><li><strong>Extents</strong> replace thousands of pointers with (start, length) &mdash; what ext4, XFS and btrfs actually use.</li><li>Free space: <strong>bitmaps</strong> cost ~0.003% and make finding <em>consecutive</em> free blocks fast.</li><li>Counting/run-length is compact on clean disks, catastrophic on fragmented ones.</li></ul></div>`
  },
  "m7l1": {
    mod: "MODULE 7 — Storage & I/O",
    title: "Disk Scheduling & RAID",
    level: "Intermediate",
    time: "40 min",
    industry: "Infrastructure Engineering",
    prev: "m7l3",
    next: "m7l2",
    content: `
<h2>HDD Mechanics — Why Scheduling Exists</h2>
<p>A hard disk has a physical arm that must <strong>seek</strong> to the right track, then wait for the right
sector to rotate underneath it. These mechanical delays dominate everything else.</p>

<ul>
  <li><strong>Seek time:</strong> 3–10 ms average. The dominant cost, and the only one scheduling can reduce.</li>
  <li><strong>Rotational latency:</strong> ~4.2 ms average at 7200 RPM (half a revolution).</li>
  <li><strong>Transfer time:</strong> negligible once positioned — 100+ MB/s.</li>
</ul>

<p>A random access costs ~10 ms; sequential streaming runs at 100+ MB/s. That gap of several orders
of magnitude is the entire justification for disk scheduling: <strong>reorder requests to minimise
total head movement.</strong></p>

<div class="callout warning">
<strong>Standard exam setup — used for every algorithm below.</strong>
Request queue (cylinder numbers, in arrival order): <code>98, 183, 37, 122, 14, 124, 65, 67</code>.
Head starts at cylinder <strong>53</strong>. Disk spans cylinders 0–199.
Compute total head movement in cylinders.
</div>

<h2>FCFS — First Come First Served</h2>
<p>Service strictly in arrival order. Fair, trivially simple, and terrible.</p>
<div class="diagram"><div class="d-title">FCFS</div>Head starts at 53
Order serviced: 53 -&gt; 98 -&gt; 183 -&gt; 37 -&gt; 122 -&gt; 14 -&gt; 124 -&gt; 65 -&gt; 67

Seek total: 45 + 85 + 146 + 85 + 108 + 110 + 59 + 2 = 640 cylinders -- the head zigzags wildly across the platter</div>

<h2>SSTF — Shortest Seek Time First</h2>
<p>Always service the <em>closest</em> pending request. A greedy heuristic.</p>
<div class="diagram"><div class="d-title">SSTF</div>Head starts at 53
Order serviced: 53 -&gt; 65 -&gt; 67 -&gt; 37 -&gt; 14 -&gt; 98 -&gt; 122 -&gt; 124 -&gt; 183

Seek total: 12 + 2 + 30 + 23 + 84 + 24 + 2 + 59 = 236 cylinders</div>

<div class="callout deepdive">
<strong>Watch the turn at cylinder 67.</strong> From 67 the candidates are 37 (distance 30) and 98
(distance 31). SSTF is purely greedy, so it turns <em>back down</em> to 37 rather than continuing
upward — it has no notion of sweep direction. This is precisely what distinguishes SSTF from
SCAN, and it is the step most often got wrong. SSTF gives <strong>236 cylinders</strong> here,
which is better than SCAN on this particular workload.
</div>

<div class="callout warning">
<strong>Starvation.</strong> SSTF can indefinitely postpone requests far from the head: a steady stream of
nearby requests means a request at cylinder 190 may never be served. FCFS and the SCAN family
are all starvation-free.
</div>

<h2>SCAN — the Elevator Algorithm</h2>
<p>The head sweeps in one direction servicing everything in its path, continues to the <em>end of the
disk</em>, then reverses. Like a lift that runs to the top floor before coming back down.</p>
<div class="diagram"><div class="d-title">SCAN (heading up first, travelling to cylinder 199)</div>Head starts at 53
Order serviced: 53 -&gt; 65 -&gt; 67 -&gt; 98 -&gt; 122 -&gt; 124 -&gt; 183 -&gt; 199 -&gt; 37 -&gt; 14

Seek total: 12 + 2 + 31 + 24 + 2 + 59 + 16 + 162 + 23 = 331 cylinders</div>

<p>Note SCAN travels all the way to cylinder 199 even though the highest request is 183 — that
wasted 16 + 16 = 32 cylinders of travel is exactly what LOOK eliminates.</p>

<h2>LOOK — SCAN without the pointless trip</h2>
<p>Identical to SCAN, but reverses at the <em>last request</em> in each direction instead of the physical
end of the disk. This is what real implementations do; textbooks often say "SCAN" but draw LOOK.</p>
<div class="diagram"><div class="d-title">LOOK</div>Head starts at 53
Order serviced: 53 -&gt; 65 -&gt; 67 -&gt; 98 -&gt; 122 -&gt; 124 -&gt; 183 -&gt; 37 -&gt; 14

Seek total: 12 + 2 + 31 + 24 + 2 + 59 + 146 + 23 = 299 cylinders</div>

<h2>C-SCAN and C-LOOK — uniform wait times</h2>
<p>SCAN has a fairness flaw: just after the head reverses, cylinders it has only just passed must
wait almost two full sweeps. <strong>C-SCAN</strong> (circular) services requests in one direction only, then
jumps straight back to the start without servicing anything on the return. Wait time becomes
far more uniform. <strong>C-LOOK</strong> is the same idea without running to the physical edges.</p>
<div class="diagram"><div class="d-title">C-SCAN</div>Head starts at 53
Order serviced: 53 -&gt; 65 -&gt; 67 -&gt; 98 -&gt; 122 -&gt; 124 -&gt; 183 -&gt; 199 -&gt; 0 -&gt; 14 -&gt; 37

Seek total: 12 + 2 + 31 + 24 + 2 + 59 + 16 + 199 + 14 + 23 = 382 cylinders</div>
<div class="diagram"><div class="d-title">C-LOOK</div>Head starts at 53
Order serviced: 53 -&gt; 65 -&gt; 67 -&gt; 98 -&gt; 122 -&gt; 124 -&gt; 183 -&gt; 14 -&gt; 37

Seek total: 12 + 2 + 31 + 24 + 2 + 59 + 169 + 23 = 322 cylinders</div>

<h2>Comparison — same workload, all six algorithms</h2>
<table class="calc">
  <tr><th>Algorithm</th><th>Total head movement</th><th>Starvation-free?</th></tr>
  <tr><td><strong>FCFS</strong></td><td>640 cyl</td><td>Yes</td></tr><tr><td><strong>SSTF</strong></td><td>236 cyl</td><td>No</td></tr><tr><td><strong>SCAN</strong></td><td>331 cyl</td><td>Yes</td></tr><tr><td><strong>LOOK</strong></td><td>299 cyl</td><td>Yes</td></tr><tr><td><strong>CSCAN</strong></td><td>382 cyl</td><td>Yes</td></tr><tr><td><strong>CLOOK</strong></td><td>322 cyl</td><td>Yes</td></tr>
</table>

<div class="callout deepdive">
<strong>Do not memorise a winner.</strong> On this workload SSTF happens to give the smallest total, but
its ranking is workload-dependent and it can starve requests. C-SCAN moves the most yet delivers
the most predictable latency. "Best" depends on whether you are optimising throughput or
worst-case response — the same trade-off you saw in CPU scheduling.
</div>

<div class="callout industry-note">
<strong>None of this applies to SSDs.</strong> Flash has no arm and no rotation — every LBA costs roughly the
same ~0.1 ms, so reordering by "distance" is meaningless. Linux ships
<code>none</code> (noop) and <code>mq-deadline</code> for flash, <code>bfq</code> for desktop
interactivity, and <code>kyber</code> for fast multi-queue devices. Inspect and change it live:
<code>cat /sys/block/nvme0n1/queue/scheduler</code>. On cloud NVMe the correct choice is usually
<code>none</code> — the device's own controller reorders better than the kernel can. What <em>does</em> still
matter on SSDs is write amplification, the FTL, and TRIM. Disk-arm scheduling is now largely a
historical topic, which is exactly why exams still love it.
</div>

<h2>RAID — Redundant Array of Independent Disks</h2>
<table>
  <tr><th>Level</th><th>Technique</th><th>Usable capacity</th><th>Survives</th><th>Typical use</th></tr>
  <tr><td><strong>RAID 0</strong></td><td>Striping only</td><td>N × disk</td>
      <td><span class="bad">Nothing — any failure loses all</span></td><td>Scratch space, caches</td></tr>
  <tr><td><strong>RAID 1</strong></td><td>Mirroring</td><td>N/2 × disk</td><td>1 disk per mirror</td><td>Boot/OS drives</td></tr>
  <tr><td><strong>RAID 5</strong></td><td>Striping + distributed parity</td><td>(N−1) × disk</td><td>1 disk</td><td>General file servers</td></tr>
  <tr><td><strong>RAID 6</strong></td><td>Striping + double parity</td><td>(N−2) × disk</td><td>2 disks</td><td>Large arrays</td></tr>
  <tr><td><strong>RAID 10</strong></td><td>Mirrored pairs, striped</td><td>N/2 × disk</td><td>1 per mirror</td><td>Databases</td></tr>
</table>

<div class="code-block"><pre>Worked capacity example -- six 4 TB disks:

  RAID 0  : 6 x 4 TB = 24 TB usable, zero redundancy
  RAID 1  : 6 / 2 x 4 = 12 TB usable  (three mirrored pairs)
  RAID 5  : (6 - 1) x 4 = 20 TB usable, survives 1 failure
  RAID 6  : (6 - 2) x 4 = 16 TB usable, survives 2 failures
  RAID 10 : 6 / 2 x 4 = 12 TB usable, best random-write performance

The RAID 5 write penalty: every small write requires
  read old data + read old parity + write new data + write new parity
  = 4 physical I/Os for 1 logical write.
RAID 10 needs only 2 (write to each mirror), which is why
databases overwhelmingly choose RAID 10 over RAID 5.</pre></div>

<div class="callout warning">
<strong>RAID is not backup.</strong> RAID protects against <em>drive failure only</em>. It does nothing about
accidental deletion, ransomware, filesystem corruption, controller failure, fire, or theft —
all of which are faithfully replicated to every disk instantly. You need RAID <em>and</em> backups,
ideally following 3-2-1: three copies, two media types, one off-site.
</div>

<div class="callout deepdive">
<strong>Why RAID 5 is discouraged for large modern drives.</strong> When one disk fails, rebuilding parity
requires reading <em>every sector of every surviving disk</em>. On 16 TB drives that takes many hours to
days, during which the array has no redundancy and the surviving disks are under maximum stress —
precisely when a second failure is most likely. With an unrecoverable-read-error rate around
1 in 10¹⁴ bits, a full rebuild of a large array has a genuinely material chance of hitting a URE
and failing. Hence RAID 6 or RAID 10 for anything large.
</div>

<div class="quiz-section"><h3><span class="qico">◉</span> Check Your Understanding</h3>
<div class="quiz-q">
    <p>Queue 98, 183, 37, 122, 14, 124, 65, 67 with the head at 53. Under <strong>SSTF</strong>, which cylinder is serviced immediately after 67?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. 98 — continue upward</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. 37 — it is closer</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. 14 — the lowest pending</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. 122 — next in the queue</div></div>
    <div class="quiz-explain">From 67: distance to 37 is 30, distance to 98 is 31. SSTF is purely greedy on distance and has no sweep direction, so it turns back to 37. This single step is the difference between SSTF (total 236) and SCAN/LOOK, which would carry on upward.</div>
  </div>
<div class="quiz-q">
    <p>Which algorithm gives the most <em>uniform</em> waiting time across all cylinders?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. SSTF</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. FCFS</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. C-SCAN</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. SCAN</div></div>
    <div class="quiz-explain">C-SCAN services in one direction only and returns without serving anything, so every cylinder is visited once per full cycle at a regular interval. Plain SCAN is unfair to cylinders just behind the reversal point — they wait nearly two sweeps. SSTF is the least uniform of all and can starve outlying requests entirely.</div>
  </div>
<div class="quiz-q">
    <p>You provision a cloud VM backed by NVMe SSD. Which I/O scheduler is usually the right default?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. bfq, for fairness</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. none — let the device reorder</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. C-SCAN, to reduce seeks</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. SSTF, for shortest seeks</div></div>
    <div class="quiz-explain">NVMe has no seek time, so cylinder-distance heuristics are meaningless and the kernel reordering only adds CPU overhead and latency. <code>none</code> passes requests straight to a device whose own controller has far better visibility into internal parallelism. bfq is aimed at desktop interactivity on slower devices.</div>
  </div>
<div class="quiz-q">
    <p>Eight 4 TB disks in RAID 6. What is the usable capacity and how many simultaneous disk failures survive?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. 32 TB, 0 failures</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. 28 TB, 1 failure</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. 24 TB, 2 failures</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. 16 TB, 4 failures</div></div>
    <div class="quiz-explain">RAID 6 sacrifices two disks&rsquo; worth of capacity to double parity: (8 − 2) × 4 TB = 24 TB usable, tolerating any 2 simultaneous failures. That second parity block is precisely what protects you during the long, high-stress rebuild window after the first failure.</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div>

<div class="practice"><h3><span class="pico">✎</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied — check every digit.</p>
<div class="prob">
  <div class="prob-q"><span class="prob-n">1</span><div>Request queue <code>176, 79, 34, 60, 92, 11, 41, 114</code>, head starts at cylinder <strong>50</strong>,
 disk spans 0–199, head initially moving <strong>upward</strong>.
 Compute total head movement for <strong>FCFS</strong> and <strong>SSTF</strong>.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m7l1_p1')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m7l1_p1')">Show solution</button></div>
  <div class="hint" id="h_m7l1_p1">For FCFS just sum |next − current| down the queue in the given order. For SSTF, repeatedly pick the nearest unserviced request — and check carefully whether it lies above or below the head each time.</div>
  <div class="sol" id="s_m7l1_p1"><h4>FCFS</h4><div class="diagram"><div class="d-title">FCFS</div>Order: 50 -&gt; 176 -&gt; 79 -&gt; 34 -&gt; 60 -&gt; 92 -&gt; 11 -&gt; 41 -&gt; 114
Total: 126 + 97 + 45 + 26 + 32 + 81 + 30 + 73 = 510 cylinders</div>
<h4>SSTF</h4><div class="diagram"><div class="d-title">SSTF</div>Order: 50 -&gt; 41 -&gt; 34 -&gt; 11 -&gt; 60 -&gt; 79 -&gt; 92 -&gt; 114 -&gt; 176
Total: 9 + 7 + 23 + 49 + 19 + 13 + 22 + 62 = 204 cylinders</div>
<p>SSTF reduces movement from <strong>510</strong> to <strong>204</strong> cylinders — a 60% saving on this workload.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">2</span><div>Same queue and head position. Now compute <strong>SCAN</strong> and <strong>LOOK</strong>. How much travel does LOOK save, and why exactly?</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m7l1_p2')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m7l1_p2')">Show solution</button></div>
  <div class="hint" id="h_m7l1_p2">SCAN must reach cylinder 199 before reversing; LOOK reverses at the highest pending request. The difference is twice the gap between them.</div>
  <div class="sol" id="s_m7l1_p2"><h4>SCAN</h4><div class="diagram"><div class="d-title">SCAN</div>Order: 50 -&gt; 60 -&gt; 79 -&gt; 92 -&gt; 114 -&gt; 176 -&gt; 199 -&gt; 41 -&gt; 34 -&gt; 11
Total: 10 + 19 + 13 + 22 + 62 + 23 + 158 + 7 + 23 = 337 cylinders</div>
<h4>LOOK</h4><div class="diagram"><div class="d-title">LOOK</div>Order: 50 -&gt; 60 -&gt; 79 -&gt; 92 -&gt; 114 -&gt; 176 -&gt; 41 -&gt; 34 -&gt; 11
Total: 10 + 19 + 13 + 22 + 62 + 135 + 7 + 23 = 291 cylinders</div>
<p>LOOK saves <strong>46 cylinders</strong>. SCAN runs from the highest request (176) out to the edge at 199 and must come back — 23 cylinders out and 23 back = 46 wasted. LOOK simply turns around at 176. Real kernels implement LOOK-style behaviour for exactly this reason.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">3</span><div>Same queue. Compute <strong>C-SCAN</strong> and <strong>C-LOOK</strong>, and explain why C-SCAN moves the head furthest of all yet is still preferred in some systems.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m7l1_p3')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m7l1_p3')">Show solution</button></div>
  <div class="hint" id="h_m7l1_p3">C-SCAN goes up to 199, jumps to 0, then continues upward. Count the full-disk return sweep as head movement.</div>
  <div class="sol" id="s_m7l1_p3"><h4>C-SCAN</h4><div class="diagram"><div class="d-title">C-SCAN</div>Order: 50 -&gt; 60 -&gt; 79 -&gt; 92 -&gt; 114 -&gt; 176 -&gt; 199 -&gt; 0 -&gt; 11 -&gt; 34 -&gt; 41
Total: 10 + 19 + 13 + 22 + 62 + 23 + 199 + 11 + 23 + 7 = 389 cylinders</div>
<h4>C-LOOK</h4><div class="diagram"><div class="d-title">C-LOOK</div>Order: 50 -&gt; 60 -&gt; 79 -&gt; 92 -&gt; 114 -&gt; 176 -&gt; 11 -&gt; 34 -&gt; 41
Total: 10 + 19 + 13 + 22 + 62 + 165 + 23 + 7 = 321 cylinders</div>
<p>C-SCAN totals <strong>389 cylinders</strong> — the largest figure here, because the 199-to-0 return sweep is pure repositioning that services nothing.</p>
<p>It is nonetheless preferred where <em>predictability</em> beats raw throughput. Under C-SCAN every cylinder is guaranteed service once per cycle at a steady interval, so worst-case latency is bounded and roughly equal everywhere. Under SSTF a request at the far edge might wait arbitrarily long. For a system with latency SLAs, a slightly worse average with a much better worst case is the right trade.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">4</span><div><strong>Applied capacity planning.</strong> You have twelve 8 TB drives for a database server with a
 heavy random-write workload. Compare RAID 5, RAID 6 and RAID 10 on usable capacity, failure tolerance
 and write cost. Which do you choose?</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m7l1_p4')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m7l1_p4')">Show solution</button></div>
  <div class="hint" id="h_m7l1_p4">Work out capacity for each, then count how many physical I/Os each configuration needs to service one small logical write.</div>
  <div class="sol" id="s_m7l1_p4"><table class="calc">
<tr><th>Level</th><th>Usable</th><th>Survives</th><th>Physical I/O per small write</th></tr>
<tr><td>RAID 5</td><td>(12−1) × 8 = <strong>88 TB</strong></td><td>1 disk</td><td>4 (read data, read parity, write data, write parity)</td></tr>
<tr><td>RAID 6</td><td>(12−2) × 8 = <strong>80 TB</strong></td><td>2 disks</td><td>6 (two parity blocks to maintain)</td></tr>
<tr><td>RAID 10</td><td>12/2 × 8 = <strong>48 TB</strong></td><td>1 per mirror (up to 6 total, if they fall in different pairs)</td><td>2 (one write per mirror)</td></tr>
</table>
<p><strong>Choose RAID 10.</strong> The workload is random-write heavy, and RAID 10&rsquo;s 2 I/Os per write versus RAID 5&rsquo;s 4 and RAID 6&rsquo;s 6 is a decisive 2–3× throughput advantage. Rebuilds are also dramatically faster and safer: restoring a failed RAID 10 disk copies its mirror directly, whereas RAID 5/6 must read all eleven surviving 8 TB drives in full.</p>
<p>You pay for this with capacity — 48 TB instead of 88 TB. If the requirement were bulk archival storage rather than transactional writes, RAID 6 would be the better answer. And in either case, RAID is still not a backup.</p></div>
</div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>For the standard queue (head 53): FCFS 640, <strong>SSTF 236</strong>, <strong>SCAN 331</strong>, LOOK 299, C-SCAN 382, C-LOOK 322 cylinders.</li><li>SSTF is greedy and can reverse direction mid-sweep — that is what separates it from SCAN.</li><li>SCAN runs to the disk edge; LOOK turns at the last request. LOOK is what real systems implement.</li><li>C-SCAN/C-LOOK trade extra movement for uniform, bounded waiting times.</li><li>On SSDs and NVMe, seek-based scheduling is obsolete — use <code>none</code> or <code>mq-deadline</code>.</li><li><strong>RAID is not backup</strong>, and RAID 5 is risky on large modern drives due to long, fragile rebuilds.</li></ul></div>`
  },
  "m7l2": {
    mod: "MODULE 7 — Storage & I/O",
    title: "I/O Subsystem",
    level: "Intermediate",
    time: "30 min",
    industry: "Systems Understanding",
    prev: "m7l1",
    next: "m8l0",
    content: `
<h2>The I/O Problem</h2>
<p>I/O devices are enormously diverse — keyboards, disks, GPUs, network cards, USB devices. The OS must provide a uniform interface to all of them, while hiding hardware specifics from applications.</p>

<h2>I/O Hardware Basics</h2>
<p>Each device has a <strong>controller</strong> (small processor on the device). The CPU communicates with controllers via:</p>
<ul>
  <li><strong>I/O ports:</strong> Special CPU instructions (in/out on x86). Legacy approach.</li>
  <li><strong>Memory-mapped I/O (MMIO):</strong> Device registers appear as memory addresses. CPU reads/writes them like RAM. Modern approach. GPU registers, NIC registers are MMIO.</li>
</ul>

<h2>Three Ways for CPU to Do I/O</h2>

<h3>1. Programmed I/O (Polling)</h3>
<p>CPU continuously checks if device is ready. Wastes CPU cycles. Used only for tiny transfers or where latency is critical (keyboard, simple microcontrollers).</p>

<h3>2. Interrupt-Driven I/O</h3>
<p>CPU starts I/O, does other work. Device raises hardware interrupt when done. CPU saves state, runs interrupt handler, resumes previous work.</p>
<p>Good for slow devices (disk, network). Bad for ultra-high-rate devices — interrupt overhead becomes dominant.</p>

<h3>3. DMA (Direct Memory Access)</h3>
<p>The DMA controller handles the data transfer between device and RAM <em>directly</em>, without CPU involvement. CPU programs the DMA (source, destination, size), then goes off to do useful work. DMA interrupts CPU only when entire transfer is complete.</p>
<p>This is how modern disk I/O and networking works — NIC DMAs network packets directly into RAM without the CPU touching each byte.</p>

<h2>Device Driver Architecture</h2>
<div class="diagram">
  <div class="d-title">I/O Software Layers</div>
<span class="highlight">User Process</span>: open("/dev/sda"), read(fd, buf, 4096)
                         ↓
<span class="highlight">Kernel I/O Interface</span>: uniform read/write/ioctl API
                         ↓
<span class="highlight2">Device-Independent Software</span>: buffering, error handling, scheduling, caching
                         ↓
<span class="highlight3">Device Driver</span>: device-specific code — knows the hardware registers
                         ↓
<span class="highlight">Interrupt Handler</span>: handles I/O completion interrupts
                         ↓
<span class="highlight">Hardware</span>: actual disk, NIC, GPU
</div>

<h2>Kernel I/O Buffering</h2>
<p>Why does the OS buffer I/O?</p>
<ul>
  <li><strong>Speed mismatch:</strong> Process produces data faster than device can accept (or vice versa)</li>
  <li><strong>Transfer size mismatch:</strong> Application writes 1 byte, disk works in 4KB sectors</li>
  <li><strong>Copy semantics:</strong> When write() returns, application can modify its buffer; kernel keeps a copy safe</li>
</ul>
<p>Types: single buffer, double buffer (producer/consumer), circular buffer (ring buffer for streams).</p>

<div class="callout industry-note">
<strong>This is why fsync() exists.</strong> When you call write() on Linux, data goes into the kernel's page cache (an in-RAM buffer). write() returns immediately. The data reaches disk later — could be seconds later. If the system crashes before flush, you lose data. <code>fsync(fd)</code> blocks until all data and metadata is flushed to disk. Databases call fsync() after each committed transaction to guarantee durability. SSD manufacturers sometimes fake fsync acknowledgements — a known problem causing data loss on cheap SSDs.
</div>

<h2>Costing a Single Disk Read</h2>
<p>Before comparing I/O techniques it helps to know where the time actually goes. A 4&nbsp;KB random
read from a 7200&nbsp;RPM drive with a 5&nbsp;ms average seek and 100&nbsp;MB/s transfer rate:</p>

<div class="code-block"><pre>Seek time            5.000 ms   (move the arm to the track)
Rotational latency   4.167 ms   (half a revolution at 7200 RPM:
                                60000 ms/min / 7200 / 2)
Transfer time        0.0391 ms   (4 KB at 100 MB/s)
                     --------
Total                9.206 ms

Transfer is 0.4% of the total. The rest is waiting for
physics. An NVMe SSD does the same read in ~0.1 ms with
no moving parts -- roughly 90x faster.</pre></div>

<p>The transfer is <strong>0.4%</strong> of the total. Everything else is mechanical positioning. This
single fact explains why the OS batches, caches, reorders and prefetches so aggressively &mdash; and
why an SSD, which removes both mechanical terms, is not merely faster but a different kind of device.</p>

<h2>Three Ways to Move Data</h2>
<table>
  <tr><th></th><th>Programmed I/O</th><th>Interrupt-driven</th><th>DMA</th></tr>
  <tr><td>CPU during transfer</td><td><span class="bad">Busy polling</span></td><td>Free, interrupted per unit</td><td><span class="good">Free until completion</span></td></tr>
  <tr><td>Interrupts per 4&nbsp;KB</td><td>0 (no interrupts, but 100% CPU)</td><td>Up to one per byte/word</td><td><span class="good">1</span></td></tr>
  <tr><td>Good for</td><td>Tiny transfers, embedded</td><td>Slow, sporadic devices</td><td>Bulk data</td></tr>
  <tr><td>Example</td><td>Reading a GPIO pin</td><td>Keyboard, mouse</td><td>Disk, NIC, GPU</td></tr>
</table>

<div class="diagram"><div class="d-title">DMA transfer sequence</div>1. CPU programs the DMA controller:
     source = disk controller buffer
     destination = physical address 0x7F3A0000
     count = 4096 bytes
2. CPU issues the command and RESUMES OTHER WORK
3. DMA controller and disk transfer data directly to RAM,
   stealing occasional memory-bus cycles from the CPU
   (&quot;cycle stealing&quot;)
4. On completion, DMA raises ONE interrupt
5. CPU runs the completion handler and wakes the waiting process

The CPU touched zero bytes of the 4096 transferred.

Note step 3: the CPU and DMA contend for the memory bus, so
a large transfer does slow the CPU slightly even though it
is not executing the copy.</div>

<div class="callout deepdive">
<strong>Interrupts can themselves become the bottleneck.</strong> A 10&nbsp;Gbps NIC receiving small
packets can generate over a million interrupts per second &mdash; enough to consume entire cores in
interrupt handling and leave nothing for the application. This is <em>receive livelock</em>. Linux
solves it with <strong>NAPI</strong>: on the first interrupt the driver <em>disables</em> further
interrupts and switches to polling, draining the ring buffer in batches, then re-enables interrupts
when traffic subsides. The system adaptively picks whichever technique fits the current load &mdash;
interrupts when idle, polling when busy.
</div>

<h2>The Layered Model</h2>
<div class="diagram"><div class="d-title">I/O software layers</div>  User process        read(fd, buf, 4096)
        |                                        formats requests,
        v                                        buffers in libc
  System-call interface   uniform read/write/ioctl
        |
        v
  Device-independent layer   naming, protection, buffering,
        |                    caching, block-size abstraction,
        |                    I/O scheduling
        v
  Device driver              knows THIS device&#x27;s registers,
        |                    translates to hardware commands
        v
  Interrupt handler          signals completion, wakes waiters
        |
        v
  Hardware                   disk / NIC / GPU

Each layer exists so the one above it can ignore a detail.
Only the driver knows the hardware; only the interrupt
handler knows about completion timing.</div>

<h2>Why the Kernel Buffers</h2>
<ul>
  <li><strong>Speed mismatch:</strong> a process writes faster than a disk accepts; the buffer absorbs bursts.</li>
  <li><strong>Size mismatch:</strong> the application writes 1 byte, the device wants 4&nbsp;KB blocks.</li>
  <li><strong>Copy semantics:</strong> once <code>write()</code> returns, you may reuse your buffer immediately &mdash;
      the kernel holds its own copy, so later modifications cannot corrupt the in-flight write.</li>
  <li><strong>Read-ahead:</strong> detecting a sequential pattern, the kernel fetches subsequent blocks
      before you ask, turning later reads into cache hits.</li>
</ul>

<div class="callout warning">
<strong><code>write()</code> returning does not mean the data is on disk.</strong> It means the data
reached the page cache in RAM. The kernel flushes later &mdash; controlled by
<code>vm.dirty_ratio</code> and friends, typically within 30&nbsp;seconds. A power loss in that window
loses the write silently. <code>fsync(fd)</code> blocks until the data <em>and</em> the metadata are
durable, which is why databases call it on every commit and why <code>fsync</code> performance
dominates transaction throughput.
</div>

<div class="callout industry-note">
<strong>Modern Linux I/O is moving past syscalls entirely.</strong> Each <code>read()</code> costs a
mode switch, and post-Spectre that is expensive. <strong><code>io_uring</code></strong> (kernel 5.1+)
replaces it with two shared ring buffers &mdash; submission and completion &mdash; mapped into user
space. An application queues thousands of operations and reaps results with <em>zero</em> syscalls in
the steady state. It is the biggest change to Linux I/O in decades and is now used by
QEMU, RocksDB, Ceph and Nginx. The same idea drives kernel bypass in DPDK and SPDK, where the NIC or
SSD is mapped directly into a user-space driver and the kernel is removed from the data path
altogether.
</div>

<div class="quiz-section"><h3><span class="qico">&#9673;</span> Check Your Understanding</h3>
<div class="quiz-q"><p>What is the principal advantage of DMA over interrupt-driven I/O for a 4&nbsp;MB transfer?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. DMA does not require any interrupts at all</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. The CPU is not involved in moving the data and gets one interrupt instead of thousands</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. DMA transfers are always faster than the disk can supply data</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. DMA bypasses the page cache</div></div><div class="quiz-explain">Under interrupt-driven I/O the CPU copies each unit and takes an interrupt per unit &mdash; for 4&nbsp;MB that is an enormous number of interrupts and copies. DMA has the controller write straight into RAM and raise a <em>single</em> completion interrupt. DMA does still use one interrupt; the win is the elimination of per-unit CPU work.</div></div>
<div class="quiz-q"><p>Your application calls <code>write()</code> and it returns successfully. The machine loses power two seconds later. Is the data safe?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Yes &mdash; write() only returns after the disk confirms</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. No &mdash; the data may still be in the page cache</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Yes, if the file was opened for writing</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Only if the file is smaller than one block</div></div><div class="quiz-explain"><code>write()</code> returns once the data is in the kernel page cache, typically microseconds later. The actual flush happens asynchronously, usually within 30&nbsp;seconds. Only <code>fsync()</code> (or opening with O_SYNC/O_DSYNC) guarantees durability. This is why databases call <code>fsync</code> at commit &mdash; and why a lying <code>fsync</code> implementation in cheap hardware causes real data loss.</div></div>
<div class="quiz-q"><p>A 10&nbsp;Gbps NIC under small-packet load generates over a million interrupts per second, starving the application of CPU. What does Linux&rsquo;s NAPI do about it?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Drops packets until the rate falls</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Disables interrupts and switches the driver to polling until traffic subsides</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Moves all interrupts to a single dedicated core</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Increases the interrupt priority</div></div><div class="quiz-explain">NAPI switches technique based on load. On the first interrupt it masks further interrupts and polls the receive ring in batches &mdash; amortising the cost across many packets &mdash; then re-enables interrupts when the ring drains. Interrupts are efficient when traffic is sparse; polling is efficient when it is dense. NAPI gets both.</div></div>
<div class="quiz-q"><p>What problem does <code>io_uring</code> primarily solve?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Disk fragmentation</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Per-operation syscall overhead</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Filesystem corruption after crashes</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Inode exhaustion</div></div><div class="quiz-explain">Every traditional <code>read()</code>/<code>write()</code> costs a user&rarr;kernel mode switch, made more expensive by Spectre/Meltdown mitigations. <code>io_uring</code> uses shared submission and completion ring buffers mapped into user space, so an application can queue and complete thousands of operations with no syscalls in the steady state.</div></div>
<button class="quiz-reset" onclick="resetQuiz(this)">&#8634; Reset these questions</button></div>
<div class="practice"><h3><span class="pico">&#9998;</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied &mdash; check every digit.</p>
<div class="prob"><div class="prob-q"><span class="prob-n">1</span><div>A 7200&nbsp;RPM disk has 4&nbsp;ms average seek and 150&nbsp;MB/s transfer rate. Compute the time for (a) a random 4&nbsp;KB read and (b) a sequential 1&nbsp;MB read. What is the effective throughput of each?</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m7l2_p1')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m7l2_p1')">Show solution</button></div><div class="hint" id="h_m7l2_p1">Rotational latency is half a revolution: 60000 / RPM / 2 milliseconds. Both reads pay seek and rotation once; only the transfer term differs.</div><div class="sol" id="s_m7l2_p1"><pre class="mini">Rotational latency = 60000 / 7200 / 2 = 4.167 ms

(a) Random 4 KB read
    seek      4.000 ms
    rotation  4.167 ms
    transfer  4 KB / 150 MB/s = 0.026 ms
    total   = <b>8.19 ms</b>
    throughput = 4 KB / 8.19 ms = <b>0.49 MB/s</b>

(b) Sequential 1 MB read
    seek      4.000 ms
    rotation  4.167 ms
    transfer  1 MB / 150 MB/s = 6.67 ms
    total   = <b>14.84 ms</b>
    throughput = 1 MB / 14.84 ms = <b>67.4 MB/s</b></pre>
<p>Sequential access delivers <strong>138&times;</strong> the throughput of random access on the same hardware, despite each operation taking only 1.8&times; longer. The fixed 8.17&nbsp;ms positioning cost is amortised over 256&times; more data.</p>
<p>This ratio is why B-trees use large nodes, why databases prefer sequential scans over many random seeks past a certain selectivity, and why log-structured designs (LSM trees) convert random writes into sequential ones. It is also why the same code can be 100&times; slower on a spinning disk than on an SSD, where the ratio collapses to roughly 1:1.</p></div></div>
<div class="prob"><div class="prob-q"><span class="prob-n">2</span><div><strong>Applied.</strong> A logging service calls <code>write()</code> for each log line and <code>fsync()</code>
after every line, achieving only 90 lines/second on a disk whose <code>fsync</code> takes about 11&nbsp;ms.
Explain the bottleneck and give three options with their durability trade-offs.</div></div><div class="prob-actions"><button class="btn-mini" aria-expanded="false" onclick="toggleBox('h_m7l2_p2')">Hint</button><button class="btn-mini solve" aria-expanded="false" onclick="toggleBox('s_m7l2_p2')">Show solution</button></div><div class="hint" id="h_m7l2_p2">Compute what 11&nbsp;ms per fsync implies as a hard ceiling. Then consider what can be changed: the frequency of fsync, the number of writers per fsync, or the hardware.</div><div class="sol" id="s_m7l2_p2"><p><strong>The bottleneck is fsync latency, and the maths is exact:</strong> 1000&nbsp;ms / 11&nbsp;ms = ~90 operations per second. The service is not CPU- or bandwidth-bound; it is bound by how fast the device can confirm durability. Nothing in the application will exceed 90 lines/s while each line demands its own fsync.</p>
<p><strong>Option 1 &mdash; group commit / batching.</strong> Buffer lines for a few milliseconds and fsync once for the batch. At 50 lines per fsync, throughput rises to ~4,500 lines/s. <em>Trade-off:</em> a crash loses up to one batch window (a few ms of logs). This is what databases do for commits and is almost always the right answer.</p>
<p><strong>Option 2 &mdash; drop per-line fsync entirely.</strong> Let the kernel flush on its own schedule. Throughput becomes limited only by memory bandwidth &mdash; hundreds of thousands of lines/s. <em>Trade-off:</em> a crash can lose up to 30&nbsp;seconds of logs. For application logs this is usually acceptable; for an audit or financial journal it is not.</p>
<p><strong>Option 3 &mdash; faster durable storage.</strong> An enterprise NVMe SSD with power-loss protection completes fsync in ~0.05&nbsp;ms, giving ~20,000 ops/s with full per-line durability. <em>Trade-off:</em> cost. Note that a consumer SSD without a capacitor-backed write cache may simply <em>lie</em> about fsync completion &mdash; fast, and not actually durable.</p>
<p><strong>Recommendation:</strong> option 1. It preserves near-durability, needs no hardware change, and is a small code change. Combine with option 3 if the log is genuinely an audit record.</p></div></div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>Polling wastes CPU; interrupts suit slow devices; <strong>DMA</strong> moves bulk data without CPU involvement.</li><li>Memory-mapped I/O exposes device registers as ordinary memory addresses.</li><li>Kernel buffering absorbs speed and transfer-size mismatches, and provides copy semantics.</li><li><code>write()</code> only reaches the page cache — <code>fsync()</code> is what guarantees durability.</li></ul></div>`
  },
  "m8l0": {
    mod: "MODULE 8 — Security",
    title: "OS Security Fundamentals",
    level: "Intermediate",
    time: "25 min",
    industry: "Critical for Every Engineer",
    prev: "m7l2",
    next: "m9l0",
    content: `
<h2>Security Goals</h2>
<p>OS security aims to enforce three properties (CIA):</p>
<ul>
  <li><strong>Confidentiality:</strong> Only authorised entities can read data</li>
  <li><strong>Integrity:</strong> Only authorised entities can modify data</li>
  <li><strong>Availability:</strong> System remains usable (DoS prevention)</li>
</ul>

<h2>Authentication — Who Are You?</h2>
<p>The OS must verify user identity before granting access. Three factors:</p>
<ul>
  <li><strong>Something you know:</strong> Password, PIN</li>
  <li><strong>Something you have:</strong> Hardware token, phone (TOTP)</li>
  <li><strong>Something you are:</strong> Fingerprint, face recognition</li>
</ul>

<h3>Password Storage</h3>
<p>Never store plaintext passwords. Unix/Linux stores passwords as: <code>hash(salt + password)</code> in <code>/etc/shadow</code>. The salt prevents rainbow table attacks (pre-computed hash dictionaries).</p>
<p>Modern systems use <strong>bcrypt</strong> or <strong>Argon2</strong> — deliberately slow hash functions. Makes brute force attacks expensive even with GPUs.</p>

<h2>Protection Domains & Access Control</h2>
<p>A <strong>protection domain</strong> is a set of (resource, operations) pairs — what objects can be accessed and how. Each process runs in a protection domain.</p>

<h3>Access Control Matrix</h3>
<div class="diagram">
  <div class="d-title">Access Control Matrix</div>
               File1    File2    Printer    Process3
Process1:      r, w     r        print      wakeup
Process2:      r        r, w     —          —
Process3:      —        r        print      —

Implementing the full matrix wastes space (mostly empty).
Solutions:
<span class="highlight">ACL (Access Control List)</span>: Store by column — for each object, who can do what.
<span class="highlight2">Capability List</span>: Store by row — for each process, what it can do.
</div>

<h3>Unix Permission Model</h3>
<p>A simplified ACL: owner/group/others × read/write/execute.</p>
<div class="code-block" data-lang="LINUX">
<pre><span class="cm"># ls -la output</span>
-rwxr-xr-- 1 alice devs 4096 May 2025 script.sh
│││││││││
│││││││└└─ Other: r-- (read only)
│││││└└──── Group (devs): r-x (read + execute)
│││└└─────── Owner (alice): rwx (all)
││└────────── Regular file (- = file, d = dir, l = link)
│└─────────── file type

chmod 755 file  = rwxr-xr-x (owner full, group/other read+exec)
chmod 644 file  = rw-r--r-- (owner read/write, others read only)</pre>
</div>

<h2>Setuid — Controlled Privilege Escalation</h2>
<p>A common need: users must change their own password (needs to write to <code>/etc/shadow</code>, root-owned). Solution: <strong>setuid bit</strong>.</p>
<p>When a setuid program runs, it runs with the <em>owner's</em> privileges, not the caller's. <code>/usr/bin/passwd</code> is owned by root and has setuid set. When you run it, it temporarily runs as root, enough to update /etc/shadow.</p>

<div class="callout warning">
<strong>Setuid is a massive attack surface.</strong> A bug in a setuid-root program = privilege escalation to root. The infamous 2021 <code>pkexec</code> (Polkit) CVE-2021-4034 was a setuid-root buffer overflow exploitable by any local user for 12 years. Keep setuid programs minimal and audited. This is why container security, namespaces, and capabilities (fine-grained privilege splitting) were developed — to replace coarse setuid.
</div>

<h2>Linux Capabilities</h2>
<p>Instead of "root can do everything," Linux capabilities split root privileges into ~40 fine-grained capabilities:</p>
<ul>
  <li><code>CAP_NET_BIND_SERVICE:</code> Bind to ports below 1024 (without being full root)</li>
  <li><code>CAP_SYS_PTRACE:</code> Attach to other processes with ptrace</li>
  <li><code>CAP_KILL:</code> Send signals to any process</li>
  <li><code>CAP_CHOWN:</code> Change file ownership</li>
</ul>

<div class="callout industry-note">
<strong>This is the foundation of container security.</strong> Docker containers drop most capabilities by default. A container with only <code>CAP_NET_BIND_SERVICE</code> can run a web server on port 80 without any other root privileges. Kubernetes security policies and Pod Security Admission control which capabilities containers can have. Understanding Linux capabilities is essential for writing secure Dockerfiles and Kubernetes manifests.
</div>

<h2>Security Levels (Bell-LaPadula Model)</h2>
<p>Military/government classification model:</p>
<ul>
  <li><strong>Simple Security Property (No-Read-Up):</strong> A subject can't read objects at higher classification level</li>
  <li><strong>★-Property (No-Write-Down):</strong> A subject can't write to objects at lower classification level (prevents leaking classified info to unclassified docs)</li>
</ul>
<p>Bell-LaPadula focuses on confidentiality. Biba model (complementary) focuses on integrity. SELinux and AppArmor implement mandatory access control (MAC) inspired by these models for modern Linux systems.</p>

<div class="quiz-section">
  <h3><span class="qico">◉</span> Final Check</h3>
  <div class="quiz-q">
    <p>A web server process needs to bind to port 80 on Linux. What's the most secure approach?</p>
    <div class="quiz-options">
      <div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Run the process as root</div>
      <div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Set the setuid bit on the web server binary</div>
      <div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Grant only CAP_NET_BIND_SERVICE capability to the process</div>
      <div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Disable the port restriction in the kernel</div>
    </div>
    <div class="quiz-explain">Granting only the specific capability needed follows the Principle of Least Privilege. The process can bind port 80 but has no other elevated privileges. Running as root gives it unrestricted system access — a single exploit then owns the entire system.</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div>

<div style="margin-top:48px; padding:32px; background:rgba(0,229,255,0.05); border:1px solid rgba(0,229,255,0.2); border-radius:8px; text-align:center;">
  <div style="font-family:'Syne',sans-serif; font-size:24px; font-weight:800; margin-bottom:12px;">Course Complete</div>
  <p style="color:var(--muted); max-width:480px; margin:0 auto;">You've covered every unit in UCS05B12 plus the industry context that turns exam knowledge into engineering skill. Review any module using the sidebar — and revisit the quiz sections regularly to reinforce.</p>
</div>

<div class="practice"><h3><span class="pico">✎</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied — check every digit.</p>
<div class="prob">
  <div class="prob-q"><span class="prob-n">1</span><div>A web application must read <code>/etc/ssl/private/server.key</code> (root-owned, mode 0600) at
 startup, then serve traffic on port 443. Design the least-privilege deployment and explain each choice.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m8l0_p1')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m8l0_p1')">Show solution</button></div>
  <div class="hint" id="h_m8l0_p1">Separate what is needed at startup from what is needed at runtime, and consider capabilities rather than full root.</div>
  <div class="sol" id="s_m8l0_p1"><p><strong>The key insight: privilege is needed only at startup, not during operation.</strong></p>
<ol>
<li><strong>Start as root</strong>, read the key into memory, and bind port 443.</li>
<li><strong>Immediately drop privileges</strong> — <code>setgid()</code> then <code>setuid()</code> to an unprivileged service account (order matters: setuid first and you can no longer change group).</li>
<li>Verify the drop actually worked by checking that <code>setuid(0)</code> now <em>fails</em>. A surprising number of exploits stem from an unchecked drop.</li>
</ol>
<p><strong>Better still, avoid root entirely:</strong></p>
<ul>
<li>Grant <code>CAP_NET_BIND_SERVICE</code> to the binary or the systemd unit, allowing a low port bind without any other root power.</li>
<li>Make the key readable by a dedicated group and add the service account to it — no root read required.</li>
<li>Under systemd, use <code>User=</code>, <code>AmbientCapabilities=CAP_NET_BIND_SERVICE</code>, <code>NoNewPrivileges=yes</code>, <code>ProtectSystem=strict</code>, <code>PrivateTmp=yes</code>.</li>
</ul>
<p><strong>Why this matters:</strong> if the server is later compromised through a request-parsing bug, the attacker inherits only the service account — not root. They cannot read <code>/etc/shadow</code>, load kernel modules, or touch other services. The blast radius is contained to what that one process legitimately needed, which is the entire point of least privilege.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">2</span><div>Under Bell-LaPadula, a Secret-cleared user tries to (a) read an Unclassified file and
 (b) write to an Unclassified file. Which is permitted? Explain the reasoning, and why it feels backwards.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m8l0_p2')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m8l0_p2')">Show solution</button></div>
  <div class="hint" id="h_m8l0_p2">Recall the two rules: no read up, no write down. Bell-LaPadula protects confidentiality, not integrity.</div>
  <div class="sol" id="s_m8l0_p2"><p><strong>(a) Reading Unclassified: PERMITTED.</strong> The simple security property forbids reading <em>up</em> (above your clearance). Reading down is fine — a Secret-cleared subject may read anything at or below Secret.</p>
<p><strong>(b) Writing Unclassified: FORBIDDEN.</strong> The ★-property forbids writing <em>down</em>. A Secret-cleared subject may only write at Secret or above.</p>
<p><strong>Why it feels backwards:</strong> intuitively a trusted user should be able to write anywhere. But Bell-LaPadula defends against <em>information flow</em>, not user malice. If a Secret subject could write to an Unclassified file, it could — deliberately or through malware acting with its privileges — copy classified content downward where anyone can read it. Blocking write-down closes that channel regardless of intent. A Trojan running with your clearance cannot leak what it reads.</p>
<p>The rule is often summarised as <strong>"no read up, no write down"</strong>, or "write up, read down".</p>
<p><strong>Biba is the exact mirror</strong> for integrity: "no read down, no write up". A high-integrity process must not read low-integrity data (it could be corrupted) nor may low-integrity subjects write to high-integrity objects. The two models are complementary, and real systems such as SELinux blend elements of both.</p></div>
</div>
</div>

<div class="quiz-section"><h3><span class="qico">&#9673;</span> Check Your Understanding</h3>
<div class="quiz-q"><p>Why does <code>/etc/shadow</code> store a random salt alongside each password hash?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. To make the hash function run faster</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. To defeat precomputed rainbow tables and hide identical passwords</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. To allow the password to be recovered if forgotten</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. To compress the stored hash</div></div><div class="quiz-explain">A unique per-user salt means an attacker cannot precompute one table of hashes and test it against every account &mdash; they must attack each password individually. It also ensures two users who chose the same password produce different stored hashes, so the file does not leak that fact. Salts are not secret; their value is purely in defeating amortised attacks. Slowness (bcrypt, Argon2) is a separate, complementary defence.</div></div>
<div class="quiz-q"><p>A service needs to bind port 443 and read a root-owned key file, then serve traffic. Which design best follows least privilege?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Run the entire service as root</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Set the setuid bit on the binary</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Grant CAP_NET_BIND_SERVICE and drop to an unprivileged user after startup</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Make the key world-readable so no privilege is needed</div></div><div class="quiz-explain">Privilege is required only briefly at startup. Granting the single capability needed for the port bind &mdash; rather than all of root &mdash; and dropping to a service account before handling any untrusted input means a later compromise yields only that account. Option D trades a privilege problem for a much worse confidentiality problem: any local user could then steal the private key.</div></div>
<div class="quiz-q"><p>Under Bell-LaPadula, a Secret-cleared process attempts to write to an Unclassified file. What happens and why?</p><div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. Allowed &mdash; higher clearance may write anywhere</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. Denied by the &#9733;-property (no write down)</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Allowed only if the file is empty</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Denied by the simple security property</div></div><div class="quiz-explain">The &#9733;-property forbids writing to a lower classification, because doing so could move classified content somewhere unclassified readers can see it &mdash; whether deliberately or via malware running with that clearance. The simple security property is the other rule (no <em>read</em> up). Together: "no read up, no write down". Biba inverts both for integrity.</div></div>
<button class="quiz-reset" onclick="resetQuiz(this)">&#8634; Reset these questions</button></div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>CIA: confidentiality, integrity, availability.</li><li>Passwords are stored as salted hashes using deliberately slow functions (bcrypt, Argon2).</li><li>ACLs store permissions per object; capability lists store them per subject.</li><li>Linux <strong>capabilities</strong> split root into ~40 fine-grained privileges — the modern replacement for setuid.</li><li>Bell-LaPadula = confidentiality ("no read up, no write down"); Biba = integrity (the mirror image).</li></ul></div>`
  },
  "m9l0": {
    mod: "MODULE 9 — IPC",
    title: "Interprocess Communication",
    level: "Intermediate",
    time: "35 min",
    industry: "Core Concept",
    prev: "m8l0",
    next: null,
    content: `
<h2>Why Processes Need to Talk</h2>
<p>Module 1 established that every process gets its own private virtual address space — that
isolation is the whole point. But isolation makes cooperation impossible without help. A shell
pipeline, a web server handing work to a backend, a browser's renderer talking to its GPU process:
all of these need a controlled channel across the isolation boundary. That channel is
<strong>Inter-Process Communication (IPC)</strong>.</p>

<div class="callout analogy">
Two people in separate soundproof offices. They can slide notes under the door (message passing —
safe, but every note costs a trip), or they can knock through a shared hatch into a common room
both can reach (shared memory — fast, but now they must agree who is allowed in and when, or
they will collide).
</div>

<h2>The Two Fundamental Models</h2>
<div class="diagram"><div class="d-title">Message Passing vs Shared Memory</div>MESSAGE PASSING                     SHARED MEMORY

 +---------+     +---------+        +---------+   +---------+
 | Proc A  |     | Proc B  |        | Proc A  |   | Proc B  |
 +----+----+     +----+----+        +----+----+   +----+----+
      |   send        ^  receive         |             |
      v               |                  v             v
 +---------------------------+       +---------------------+
 |         KERNEL            |       |  SHARED MEMORY PAGE |
 |  (copies the message)     |       |  (mapped into BOTH  |
 +---------------------------+       |   address spaces)   |
                                     +---------------------+
                                        kernel involved ONLY
                                        at setup time

 - kernel copies data: 2 copies      - zero copies after setup
 - synchronisation is implicit       - YOU must synchronise
 - easy to get right                 - fast but error-prone
 - works across machines             - same machine only</div>

<h2>1. Pipes</h2>
<p>The oldest and most-used Unix IPC mechanism. A pipe is a unidirectional byte stream with a
kernel-managed buffer (64 KB on Linux by default).</p>

<div class="code-block" data-lang="BASH"><pre>$ ps aux | grep nginx | wc -l

The shell creates two pipes and three processes. Each process&#x27;s
stdout is wired to the next one&#x27;s stdin via dup2().

  ps ---&gt; [pipe] ---&gt; grep ---&gt; [pipe] ---&gt; wc

Flow control is automatic and is the elegant part:
  - if the buffer is FULL,  write() BLOCKS  (producer throttled)
  - if the buffer is EMPTY, read()  BLOCKS  (consumer waits)
This is the bounded-buffer producer-consumer problem from Module 3,
solved inside the kernel and handed to you for free.</pre></div>

<div class="code-block" data-lang="C"><pre>int fd[2];
pipe(fd);              /* fd[0] = read end, fd[1] = write end */

if (fork() == 0) {
    close(fd[0]);                        /* child writes only */
    write(fd[1], &quot;hello&quot;, 5);
    close(fd[1]);                        /* EOF for the reader */
    _exit(0);
} else {
    close(fd[1]);                        /* parent reads only */
    char buf[16];
    int n = read(fd[0], buf, sizeof buf);
    close(fd[0]);
}</pre></div>

<div class="callout warning">
<strong>Always close the unused end.</strong> A reader only sees EOF when <em>every</em> copy of the write
descriptor is closed. Forget the parent's <code>close(fd[1])</code> and <code>read()</code> blocks
forever — a classic hang. Conversely, writing to a pipe whose read end is closed raises
<strong>SIGPIPE</strong>, which by default kills your process. That is why
<code>curl … | head</code> sometimes reports "broken pipe".
</div>

<p><strong>Named pipes (FIFOs)</strong> — created with <code>mkfifo</code> — have a filesystem path, so
unrelated processes can use them. Anonymous pipes require a shared ancestor.</p>

<h2>2. Message Queues</h2>
<p>Kernel-maintained lists of discrete, typed messages. Unlike pipes, boundaries are preserved: a
100-byte message is read as exactly one 100-byte message, never split or merged. Messages persist
until read, and can be read out of order by type.</p>

<h2>3. Shared Memory — the fastest option</h2>
<p>The kernel maps the same physical frames into two processes' page tables. After setup, data
transfer involves <em>no kernel involvement whatsoever</em> — a write by A is instantly visible to B
because they are literally the same RAM.</p>

<div class="code-block" data-lang="C"><pre>/* POSIX shared memory */
int fd = shm_open(&quot;/mybuf&quot;, O_CREAT | O_RDWR, 0600);
ftruncate(fd, 4096);
void *p = mmap(NULL, 4096, PROT_READ | PROT_WRITE,
               MAP_SHARED, fd, 0);

/* p now points at memory both processes can see.
   The kernel is out of the loop from here on --
   which also means it will NOT protect you. */

strcpy(p, &quot;visible to the other process immediately&quot;);</pre></div>

<div class="callout warning">
<strong>Shared memory gives you zero synchronisation.</strong> It is raw concurrent access to the same
bytes — every race condition from Module 3 applies in full. You must pair it with a semaphore,
a mutex placed in the shared region itself (<code>pthread_mutexattr_setpshared</code>), or atomics.
Shared memory is the <em>mechanism</em>; synchronisation is still your job.
</div>

<h2>4. Sockets</h2>
<p>The only mechanism here that works both locally and across a network. <strong>Unix domain sockets</strong>
(<code>AF_UNIX</code>) stay on one machine and skip the entire TCP/IP stack, making them far faster
than loopback TCP — this is how Docker, systemd, X11 and most database clients talk locally
(<code>/var/run/docker.sock</code>).</p>

<h2>5. Signals</h2>
<p>Asynchronous notifications — the smallest possible IPC, carrying only a number.</p>
<div class="code-block" data-lang="BASH"><pre>kill -TERM 1234     # polite: &quot;please shut down&quot;  (catchable)
kill -KILL 1234     # SIGKILL: cannot be caught or ignored
kill -HUP  1234     # convention: &quot;reload your config&quot;

Signal-handler safety: a handler can interrupt your code at ANY
instruction. Only async-signal-safe functions are legal inside one.
printf() and malloc() are NOT safe -- if the handler fires while
malloc() holds its internal lock, calling malloc() again deadlocks.
Standard practice: set a volatile sig_atomic_t flag and return;
do the real work in the main loop.</pre></div>

<h2>Choosing a Mechanism</h2>
<table>
  <tr><th>Mechanism</th><th>Speed</th><th>Direction</th><th>Across machines?</th><th>Typical use</th></tr>
  <tr><td>Pipe / FIFO</td><td>Good</td><td>One-way</td><td>No</td><td>Shell pipelines, parent↔child</td></tr>
  <tr><td>Message queue</td><td>Good</td><td>Two-way</td><td>No</td><td>Typed, prioritised messages</td></tr>
  <tr><td><strong>Shared memory</strong></td><td><strong>Fastest</strong></td><td>Two-way</td><td>No</td><td>Bulk data, databases, video buffers</td></tr>
  <tr><td>Unix socket</td><td>Good</td><td>Two-way</td><td>No</td><td>Docker, systemd, local DB clients</td></tr>
  <tr><td>TCP socket</td><td>Slowest</td><td>Two-way</td><td><strong>Yes</strong></td><td>Networked services</td></tr>
  <tr><td>Signal</td><td>Fast</td><td>One-way</td><td>No</td><td>Notifications only, no payload</td></tr>
</table>

<div class="callout industry-note">
<strong>Where you meet this in production.</strong> <code>docker ps</code> talks to the daemon over the Unix
socket at <code>/var/run/docker.sock</code> — mounting that socket into a container is a well-known
privilege-escalation risk, because socket access is effectively root on the host.
<strong>PostgreSQL</strong> uses shared memory for its buffer pool, sized by <code>shared_buffers</code>, which
is why it needs kernel SHM limits tuned. <strong>Chrome</strong> gives each tab its own process and uses
shared memory plus its Mojo IPC layer to move rendered frames without copying. And
<code>systemctl reload nginx</code> is simply SIGHUP delivered to the master process.
</div>

<div class="quiz-section"><h3><span class="qico">◉</span> Check Your Understanding</h3>
<div class="quiz-q">
    <p>Why is shared memory faster than message passing for bulk data transfer?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. It compresses the data automatically</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. After setup, no kernel involvement or copying is needed</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. It uses a dedicated hardware channel</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. It bypasses virtual memory entirely</div></div>
    <div class="quiz-explain">Message passing requires the kernel to copy data from the sender&rsquo;s buffer into kernel space and out again to the receiver — two copies and two mode switches per message. Shared memory maps the same physical frames into both address spaces, so after the one-time setup, a write by one process is already visible to the other. The trade-off is that you must provide your own synchronisation.</div>
  </div>
<div class="quiz-q">
    <p>A parent forks a child and creates a pipe, but forgets to close the write end in the parent. The child writes data then exits. What happens to the parent&rsquo;s read()?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. It returns the data, then EOF normally</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. It reads the data, then blocks forever waiting for EOF</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. It raises SIGPIPE</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. It returns an error immediately</div></div>
    <div class="quiz-explain">EOF on a pipe is signalled only when <em>all</em> write descriptors are closed. The parent still holds an open copy of fd[1], so the kernel cannot know no more data is coming, and read() blocks indefinitely. This is one of the most common pipe bugs. SIGPIPE is the opposite situation — writing to a pipe whose read end has closed.</div>
  </div>
<div class="quiz-q">
    <p>Which IPC mechanism preserves message boundaries?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. A pipe</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. A message queue</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Shared memory</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. A TCP socket</div></div>
    <div class="quiz-explain">Message queues store discrete typed messages: send 100 bytes and the receiver reads exactly that 100-byte message. Pipes and TCP sockets are byte <em>streams</em> — two 50-byte writes may arrive as one 100-byte read or be split arbitrarily, so applications must frame their own messages. Shared memory has no concept of a message at all.</div>
  </div>
<div class="quiz-q">
    <p>You need two processes on the same machine to exchange a 4 GB video buffer with minimum latency. Best choice?</p>
    <div class="quiz-options"><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">A. TCP socket on loopback</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">B. A named pipe</div><div class="quiz-opt" role="button" tabindex="0" data-correct="1" onclick="answer(this, true)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">C. Shared memory with a semaphore</div><div class="quiz-opt" role="button" tabindex="0" data-correct="0" onclick="answer(this, false)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">D. Signals</div></div>
    <div class="quiz-explain">Shared memory avoids copying 4 GB entirely — both processes address the same physical frames. Every other option copies the data through the kernel at least once, which for 4 GB is enormously expensive. The semaphore (or a pshared mutex) is required because shared memory provides no synchronisation of its own. Signals cannot carry a payload at all.</div>
  </div>
<button class="quiz-reset" onclick="resetQuiz(this)">↺ Reset these questions</button></div>

<div class="practice"><h3><span class="pico">✎</span> Practice Problems</h3><p class="practice-lead">Work these on paper first. Solutions are computed, not copied — check every digit.</p>
<div class="prob">
  <div class="prob-q"><span class="prob-n">1</span><div>Write out, step by step, what the kernel does when you run
 <code>cat file.txt | grep error | wc -l</code>. How many processes and how many pipes are created,
 and what happens if <code>wc</code> exits early?</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m9l0_p1')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m9l0_p1')">Show solution</button></div>
  <div class="hint" id="h_m9l0_p1">The shell forks one process per pipeline stage and creates one pipe between each adjacent pair. Think about dup2() rewiring stdin/stdout, and about what SIGPIPE does.</div>
  <div class="sol" id="s_m9l0_p1"><p><strong>3 processes, 2 pipes.</strong> The shell:</p>
<ol>
<li>Calls <code>pipe()</code> twice, obtaining two pairs of descriptors.</li>
<li>Forks three children.</li>
<li>In <code>cat</code>: <code>dup2(pipe1[1], STDOUT_FILENO)</code>, closes both raw ends, then <code>execvp("cat", …)</code>.</li>
<li>In <code>grep</code>: <code>dup2(pipe1[0], STDIN_FILENO)</code> and <code>dup2(pipe2[1], STDOUT_FILENO)</code>, closes all raw ends, execs.</li>
<li>In <code>wc</code>: <code>dup2(pipe2[0], STDIN_FILENO)</code>, closes, execs.</li>
<li>The parent shell closes <em>all</em> pipe descriptors (critical — otherwise no stage ever sees EOF) and waits on the last process.</li>
</ol>
<p><strong>If <code>wc</code> exits early:</strong> pipe2 has no reader. The next time <code>grep</code> writes to it, the kernel delivers <strong>SIGPIPE</strong>, whose default action terminates grep. That in turn closes pipe1&rsquo;s read end, so <code>cat</code> receives SIGPIPE on its next write and dies too. The pipeline tears down backwards from the consumer — which is exactly why <code>yes | head -5</code> terminates instead of running forever.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">2</span><div>Two processes share a memory region containing a single counter. Both run
 <code>counter++</code> one million times. The final value is 1,342,887 instead of 2,000,000.
 Explain precisely why, and give two correct fixes.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m9l0_p2')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m9l0_p2')">Show solution</button></div>
  <div class="hint" id="h_m9l0_p2">Recall from Module 3 that counter++ is not one machine instruction. Shared memory removed the isolation but supplied nothing in its place.</div>
  <div class="sol" id="s_m9l0_p2"><p><code>counter++</code> compiles to three separate operations: LOAD from memory, ADD 1 in a register, STORE back. With two processes running concurrently on different cores, the interleaving <em>LOAD(A) LOAD(B) ADD(A) ADD(B) STORE(A) STORE(B)</em> causes both to read the same old value and write back the same new one — <strong>one increment is silently lost</strong>. Roughly 660,000 such collisions occurred here.</p>
<p>Shared memory gives concurrent access to the same physical frames and <em>nothing else</em>. It provides no mutual exclusion whatsoever; that remains entirely the programmer&rsquo;s responsibility.</p>
<p><strong>Fix 1 — a process-shared mutex.</strong> Place a <code>pthread_mutex_t</code> inside the shared region itself and initialise it with <code>pthread_mutexattr_setpshared(&amp;attr, PTHREAD_PROCESS_SHARED)</code>. Lock around the increment. (A mutex on each process&rsquo;s private stack would not work — each would lock its own copy.)</p>
<p><strong>Fix 2 — an atomic operation.</strong> Use <code>__atomic_fetch_add(&amp;counter, 1, __ATOMIC_SEQ_CST)</code> or C11 <code>atomic_fetch_add</code>. The CPU performs read-modify-write as one uninterruptible instruction (<code>LOCK XADD</code> on x86), so no interleaving is possible. For a single counter this is considerably faster than a mutex.</p>
<p>A POSIX semaphore in shared memory (<code>sem_init</code> with <code>pshared=1</code>) is a third valid answer.</p></div>
</div>
<div class="prob">
  <div class="prob-q"><span class="prob-n">3</span><div><strong>Design.</strong> You are building a log-shipping agent: many application processes generate log
 lines, one collector process batches them and ships them off-box. Choose an IPC mechanism and justify
 it against two alternatives you rejected.</div></div>
  <div class="prob-actions"><button class="btn-mini" onclick="toggleBox('h_m9l0_p3')">Hint</button><button class="btn-mini solve" onclick="toggleBox('s_m9l0_p3')">Show solution</button></div>
  <div class="hint" id="h_m9l0_p3">Consider the number of writers, whether message boundaries matter, what happens when the collector is slow or restarts, and whether the writers should ever block.</div>
  <div class="sol" id="s_m9l0_p3"><p><strong>Choice: a Unix domain socket in SOCK_DGRAM mode</strong> (or one named pipe per writer, with framing).</p>
<p><em>Why:</em> it handles many-to-one naturally — every application process connects to one well-known path such as <code>/run/logd.sock</code>, and the kernel demultiplexes. Datagram mode preserves message boundaries, so a log line is never split across reads or merged with the next one. The collector can restart and writers simply reconnect. This is precisely what <code>systemd-journald</code> and <code>rsyslog</code> do with <code>/dev/log</code>.</p>
<p><em>Rejected — shared memory ring buffer:</em> fastest option and the right answer at extreme volume, but it demands a lock-free multi-producer design or a shared mutex, plus careful handling of a writer that crashes mid-write and leaves the structure inconsistent. Enormous complexity for a workload measured in thousands of lines per second, not millions.</p>
<p><em>Rejected — a single named pipe shared by all writers:</em> tempting, and writes under <code>PIPE_BUF</code> (4096 bytes on Linux) are atomic so lines would not interleave. But a pipe has one buffer: when the collector falls behind, the buffer fills and <strong>every application process blocks on write()</strong>. Logging must never stall the application. A datagram socket drops messages under pressure instead, which is the correct failure mode for logs.</p></div>
</div>
</div>

<div class="takeaways"><h3>⚡ Key Takeaways</h3><ul><li>Isolation is the default; IPC is the controlled exception to it.</li><li>Two models: <strong>message passing</strong> (kernel copies, implicitly synchronised) and <strong>shared memory</strong> (no copies, you synchronise).</li><li>Pipes give free flow control — a full buffer blocks the writer, an empty one blocks the reader.</li><li>Close unused pipe ends or you will hang waiting for an EOF that never comes.</li><li>Shared memory is the fastest and the most dangerous — it supplies no mutual exclusion.</li><li>Unix domain sockets beat loopback TCP locally and underpin Docker, systemd and local DB connections.</li></ul></div>`
  }
};

export const osLessonOrder: string[] = [
  "m0l0", "m0l1", "m0l2", "m1l0", "m1l1", "m1l2", "m2l0", "m2l1", "m2l2", "m2l3", "m3l0", "m3l1", "m3l2", "m4l0", "m4l1", "m4l2", "m5l0", "m5l1", "m6l0", "m6l1", "m6l2", "m6l3", "m7l0", "m7l3", "m7l1", "m7l2", "m8l0", "m9l0"
];
