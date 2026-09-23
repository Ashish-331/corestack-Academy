import { dbmsModules } from './dbms-content';

export type LessonKind = "reading" | "lab" | "case" | "quiz";

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface PracticeProblem {
  prompt: string;
  hint?: string;
  solution: string;
}

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  kind: LessonKind;
  summary: string;
  /** Quiz questions embedded in this lesson */
  quizzes?: QuizQuestion[];
  /** Practice problems embedded in this lesson */
  practice?: PracticeProblem[];
}

export interface Module {
  id: string;
  title: string;
  summary: string;
  lessons: Lesson[];
}

export interface Course {
  slug: string;
  title: string;
  short: string;
  tagline: string;
  description: string;
  category: "Systems" | "Data" | "Architecture" | "Networks" | "Programming";
  level: "Beginner" | "Intermediate" | "Advanced";
  icon: string;
  accent: string; // tailwind gradient classes
  glow: string;
  tags: string[];
  outcomes: string[];
  author: string;
  updated: string;
  modules: Module[];
}

const L = (
  id: string,
  title: string,
  minutes: number,
  kind: LessonKind,
  summary: string,
  quizzes?: QuizQuestion[],
  practice?: PracticeProblem[],
): Lesson => ({
  id, title, minutes, kind, summary,
  ...(quizzes && { quizzes }),
  ...(practice && { practice }),
});

const M = (id: string, title: string, summary: string, lessons: Lesson[]): Module => ({
  id,
  title,
  summary,
  lessons,
});

export const courses: Course[] = [
  // ─── Operating Systems ─────────────────────────────────────────────
  {
    slug: "operating-systems",
    title: "Operating Systems",
    short: "OS",
    tagline: "Processes, scheduling, memory and everything the kernel does for you.",
    description:
      "A complete ground-up tour of modern operating systems — from the boot sequence and system calls to virtual memory, concurrency primitives, deadlocks and file systems. Every chapter pairs the theory you need for interviews with hands-on labs written in C and Python.",
    category: "Systems",
    level: "Intermediate",
    icon: "cpu",
    accent: "from-violet-500 via-indigo-500 to-blue-500",
    glow: "shadow-indigo-500/30",
    tags: ["Concurrency", "Scheduling", "Virtual Memory", "Deadlocks", "Linux"],
    outcomes: [
      "Explain how a process is created, scheduled and destroyed",
      "Compare paging, segmentation and demand paging trade-offs",
      "Write race-free code with mutexes, semaphores and monitors",
      "Detect, avoid and recover from deadlocks using Banker's algorithm",
    ],
    author: "Systems Track",
    updated: "Feb 2026",
    modules: [
      M("os-m0", "Foundation", "Foundation", [
        L("m0l0", "What is an Operating System?", 25, "reading", "Foundation · What is an Operating System?"),
        L("m0l1", "OS Types & Evolution", 20, "reading", "Foundation · OS Types & Evolution"),
        L("m0l2", "OS Architecture", 50, "reading", "Foundation · OS Architecture"),
      ]),
      M("os-m1", "Processes", "Processes", [
        L("m1l0", "Process Fundamentals", 20, "reading", "Processes · Process Fundamentals"),
        L("m1l1", "Process States & PCB", 25, "reading", "Processes · Process States & PCB"),
        L("m1l2", "Context Switching", 25, "reading", "Processes · Context Switching"),
      ]),
      M("os-m2", "CPU Scheduling", "CPU Scheduling", [
        L("m2l0", "Scheduling Concepts", 20, "reading", "CPU Scheduling · Scheduling Concepts"),
        L("m2l1", "FCFS, SJF & SRTF", 35, "reading", "CPU Scheduling · FCFS, SJF & SRTF"),
        L("m2l2", "Round Robin & Multilevel Queues", 40, "reading", "CPU Scheduling · Round Robin & Multilevel Queues"),
        L("m2l3", "Real-Time & Multiprocessor Scheduling", 40, "reading", "CPU Scheduling · Real-Time & Multiprocessor Scheduling"),
      ]),
      M("os-m3", "Synchronisation", "Synchronisation", [
        L("m3l0", "Critical Section Problem", 20, "reading", "Synchronisation · Critical Section Problem"),
        L("m3l1", "Semaphores & Mutexes", 20, "reading", "Synchronisation · Semaphores & Mutexes"),
        L("m3l2", "Classic Synchronisation Problems", 25, "reading", "Synchronisation · Classic Synchronisation Problems"),
      ]),
      M("os-m4", "Deadlocks", "Deadlocks", [
        L("m4l0", "Deadlock Conditions", 20, "reading", "Deadlocks · Deadlock Conditions"),
        L("m4l1", "Banker's Algorithm", 35, "reading", "Deadlocks · Banker's Algorithm"),
        L("m4l2", "Detection & Recovery", 35, "reading", "Deadlocks · Detection & Recovery"),
      ]),
      M("os-m5", "Threads", "Threads", [
        L("m5l0", "Threads vs Processes", 20, "reading", "Threads · Threads vs Processes"),
        L("m5l1", "Thread Models & Linux Threads", 30, "reading", "Threads · Thread Models & Linux Threads"),
      ]),
      M("os-m6", "Memory Management", "Memory Management", [
        L("m6l0", "Address Spaces & Paging", 30, "reading", "Memory Management · Address Spaces & Paging"),
        L("m6l1", "Virtual Memory & Demand Paging", 20, "reading", "Memory Management · Virtual Memory & Demand Paging"),
        L("m6l2", "Page Replacement Algorithms", 45, "reading", "Memory Management · Page Replacement Algorithms"),
        L("m6l3", "Contiguous Allocation & Segmentation", 35, "reading", "Memory Management · Contiguous Allocation & Segmentation"),
      ]),
      M("os-m7", "Storage & I/O", "Storage & I/O", [
        L("m7l0", "File Systems", 20, "reading", "Storage & I/O · File Systems"),
        L("m7l1", "Disk Scheduling & RAID", 40, "reading", "Storage & I/O · Disk Scheduling & RAID"),
        L("m7l2", "I/O Subsystem", 30, "reading", "Storage & I/O · I/O Subsystem"),
        L("m7l3", "File Allocation & Free Space", 40, "reading", "Storage & I/O · File Allocation & Free Space"),
      ]),
      M("os-m8", "Security", "Security", [
        L("m8l0", "OS Security Fundamentals", 25, "reading", "Security · OS Security Fundamentals"),
      ]),
      M("os-m9", "IPC", "IPC", [
        L("m9l0", "Interprocess Communication", 35, "reading", "IPC · Interprocess Communication"),
      ]),
    ],
  },

  // ─── DBMS ──────────────────────────────────────────────────────────
  {
    slug: "dbms",
    title: "Database Management Systems",
    short: "DBMS",
    tagline: "From ER diagrams to query plans, transactions and indexes.",
    description:
      "Learn how a relational engine really works. Model data properly, write SQL that the optimiser loves, understand B+ tree indexes and storage layout, and reason about ACID, isolation levels and concurrency control with confidence.",
    category: "Data",
    level: "Intermediate",
    icon: "database",
    accent: "from-emerald-500 via-teal-500 to-cyan-500",
    glow: "shadow-emerald-500/30",
    tags: ["SQL", "Normalization", "Indexing", "Transactions", "Query Plans"],
    outcomes: [
      "Design normalised schemas up to BCNF and know when to denormalise",
      "Read an EXPLAIN plan and fix a slow query",
      "Explain ACID, isolation levels and the anomalies each one allows",
      "Choose the right index for a given access pattern",
    ],
    author: "Data Track",
    updated: "Jan 2026",
    modules: dbmsModules.map((dm, i) =>
      M(`db-m${i + 1}`, dm.title, dm.meta, [
        L(dm.id, dm.title, 30, "reading", `${dm.title} · ${dm.meta}`, dm.quiz as QuizQuestion[], dm.practice as PracticeProblem[]),
      ]),
    ),
  },

  // ─── System Design ─────────────────────────────────────────────────
  {
    slug: "system-design",
    title: "System Design",
    short: "SD",
    tagline: "Design systems that survive real traffic — and real interviews.",
    description:
      "A structured framework for designing large scale systems: estimate load, pick storage, add caching, shard, replicate, queue, and defend your trade-offs. Includes eight full case studies drawn from real interview loops.",
    category: "Architecture",
    level: "Advanced",
    icon: "network",
    accent: "from-orange-500 via-rose-500 to-pink-500",
    glow: "shadow-rose-500/30",
    tags: ["Scalability", "Caching", "Sharding", "CAP", "Microservices"],
    outcomes: [
      "Run a 45-minute design interview with a repeatable framework",
      "Do back-of-the-envelope capacity estimates in under 5 minutes",
      "Choose consistency models and justify CAP/PACELC trade-offs",
      "Design for failure: retries, timeouts, circuit breakers, backpressure",
    ],
    author: "Architecture Track",
    updated: "Feb 2026",
    modules: [
      M("sd-m0a", "How Computers & Networks Work", "How Computers & Networks Work", [
        L("P0-01", "Course Orientation & Methodology", 5, "reading", "How Computers & Networks Work · Course Orientation & Methodology"),
        L("P0-02", "Data Structures & Complexity Primer", 8, "reading", "How Computers & Networks Work · Data Structures & Complexity Primer"),
        L("P0-03", "How Computers & Networks Communicate", 10, "reading", "How Computers & Networks Work · How Computers & Networks Communicate"),
        L("P0-04", "DNS — How a Request Finds a Server", 8, "reading", "How Computers & Networks Work · DNS — How a Request Finds a Server"),
        L("P0-05", "HTTP/HTTPS Essentials", 10, "reading", "How Computers & Networks Work · HTTP/HTTPS Essentials"),
        L("P0-06", "TCP vs UDP — Choosing a Transport", 9, "reading", "How Computers & Networks Work · TCP vs UDP — Choosing a Transport"),
        L("P0-07", "Latency, Throughput, Bandwidth + the Numbers Table", 9, "reading", "How Computers & Networks Work · Latency, Throughput, Bandwidth + the Numbers Table"),
      ]),
      M("sd-m0b", "OS & Concurrency Foundations", "OS & Concurrency Foundations", [
        L("P0-08", "Concurrency vs Parallelism; Processes vs Threads", 10, "reading", "OS & Concurrency Foundations · Concurrency vs Parallelism; Processes vs Threads"),
        L("P0-09", "Synchronization Basics", 10, "reading", "OS & Concurrency Foundations · Synchronization Basics"),
        L("P0-10", "OS Concepts That Matter for System Design", 8, "reading", "OS & Concurrency Foundations · OS Concepts That Matter for System Design"),
      ]),
      M("sd-m1a", "Object-Oriented Thinking", "Object-Oriented Thinking", [
        L("P1-01", "Why LLD Matters; Thinking in Objects", 7, "reading", "Object-Oriented Thinking · Why LLD Matters; Thinking in Objects"),
        L("P1-02", "Abstraction & Encapsulation", 8, "reading", "Object-Oriented Thinking · Abstraction & Encapsulation"),
        L("P1-03", "Inheritance vs Composition", 9, "reading", "Object-Oriented Thinking · Inheritance vs Composition"),
        L("P1-04", "Polymorphism", 5, "reading", "Object-Oriented Thinking · Polymorphism"),
        L("P1-05", "Relationships: Association, Aggregation, Composition", 5, "reading", "Object-Oriented Thinking · Relationships: Association, Aggregation, Composition"),
        L("P1-06", "Interfaces & Abstract Classes", 7, "reading", "Object-Oriented Thinking · Interfaces & Abstract Classes"),
      ]),
      M("sd-m1b", "Design Principles", "Design Principles", [
        L("P1-07", "Dependency Inversion & Dependency Injection", 8, "reading", "Design Principles · Dependency Inversion & Dependency Injection"),
        L("P1-08", "SOLID", 12, "reading", "Design Principles · SOLID"),
        L("P1-09", "Cohesion, Coupling & GRASP", 7, "reading", "Design Principles · Cohesion, Coupling & GRASP"),
      ]),
      M("sd-m1c", "UML & C++ for LLD", "UML & C++ for LLD", [
        L("P1-10", "UML & Class Diagrams", 9, "reading", "UML & C++ for LLD · UML & Class Diagrams"),
        L("P1-11", "Object Modeling End-to-End", 7, "reading", "UML & C++ for LLD · Object Modeling End-to-End"),
        L("P1-12", "C++ Specifics for LLD", 10, "reading", "UML & C++ for LLD · C++ Specifics for LLD"),
      ]),
      M("sd-m2a", "Design Patterns I — Creational & Structural", "Design Patterns I — Creational & Structural", [
        L("P2-01", "Factory Method", 11, "reading", "Design Patterns I — Creational & Structural · Factory Method"),
        L("P2-02", "Abstract Factory", 11, "reading", "Design Patterns I — Creational & Structural · Abstract Factory"),
        L("P2-03", "Builder", 10, "reading", "Design Patterns I — Creational & Structural · Builder"),
        L("P2-04", "Singleton", 9, "reading", "Design Patterns I — Creational & Structural · Singleton"),
        L("P2-05", "Adapter", 9, "reading", "Design Patterns I — Creational & Structural · Adapter"),
        L("P2-06", "Decorator", 11, "reading", "Design Patterns I — Creational & Structural · Decorator"),
        L("P2-07", "Facade", 9, "reading", "Design Patterns I — Creational & Structural · Facade"),
        L("P2-08", "Proxy", 9, "reading", "Design Patterns I — Creational & Structural · Proxy"),
      ]),
      M("sd-m2b", "Design Patterns II — Behavioral", "Design Patterns II — Behavioral", [
        L("P2-09", "Strategy", 11, "reading", "Design Patterns II — Behavioral · Strategy"),
        L("P2-10", "Observer", 10, "reading", "Design Patterns II — Behavioral · Observer"),
        L("P2-11", "Command", 10, "reading", "Design Patterns II — Behavioral · Command"),
        L("P2-12", "State", 11, "reading", "Design Patterns II — Behavioral · State"),
        L("P2-13", "Template Method", 9, "reading", "Design Patterns II — Behavioral · Template Method"),
        L("P2-14", "Chain of Responsibility", 10, "reading", "Design Patterns II — Behavioral · Chain of Responsibility"),
        L("P2-15", "Pattern-Selection Cheat Sheet", 4, "reading", "Design Patterns II — Behavioral · Pattern-Selection Cheat Sheet"),
      ]),
      M("sd-m2c", "LLD Case Studies I", "LLD Case Studies I", [
        L("P2-16", "Parking Lot", 18, "reading", "LLD Case Studies I · Parking Lot"),
        L("P2-17", "Elevator System", 19, "reading", "LLD Case Studies I · Elevator System"),
        L("P2-18", "ATM", 7, "reading", "LLD Case Studies I · ATM"),
        L("P2-19", "Library Management System", 7, "reading", "LLD Case Studies I · Library Management System"),
        L("P2-20", "Chess", 20, "reading", "LLD Case Studies I · Chess"),
        L("P2-21", "Tic-Tac-Toe", 5, "reading", "LLD Case Studies I · Tic-Tac-Toe"),
        L("P2-22", "Snake & Ladder", 15, "reading", "LLD Case Studies I · Snake & Ladder"),
      ]),
      M("sd-m2d", "LLD Case Studies II", "LLD Case Studies II", [
        L("P2-23", "Movie Ticket Booking", 8, "reading", "LLD Case Studies II · Movie Ticket Booking"),
        L("P2-24", "Food Delivery (Swiggy/Zomato)", 7, "reading", "LLD Case Studies II · Food Delivery (Swiggy/Zomato)"),
        L("P2-25", "Ride Sharing (Uber/Ola)", 7, "reading", "LLD Case Studies II · Ride Sharing (Uber/Ola)"),
        L("P2-26", "Vending Machine", 6, "reading", "LLD Case Studies II · Vending Machine"),
        L("P2-27", "Splitwise (Expense Sharing)", 18, "reading", "LLD Case Studies II · Splitwise (Expense Sharing)"),
        L("P2-28", "Notification System (LLD side)", 7, "reading", "LLD Case Studies II · Notification System (LLD side)"),
      ]),
      M("sd-m3a", "Requirements & Estimation", "Requirements & Estimation", [
        L("P3-01", "Requirements: Functional vs Non-Functional", 7, "reading", "Requirements & Estimation · Requirements: Functional vs Non-Functional"),
        L("P3-02", "Capacity Estimation — the Full Recipe", 13, "reading", "Requirements & Estimation · Capacity Estimation — the Full Recipe"),
        L("P3-03", "API Design: REST, gRPC, GraphQL, Versioning", 13, "reading", "Requirements & Estimation · API Design: REST, gRPC, GraphQL, Versioning"),
      ]),
      M("sd-m3b", "Communication Patterns", "Communication Patterns", [
        L("P3-04", "Real-Time Patterns: Polling, Long-Polling, WebSockets, SSE", 7, "reading", "Communication Patterns · Real-Time Patterns: Polling, Long-Polling, WebSockets, SSE"),
        L("P3-05", "Sync vs Async; Push vs Pull", 13, "reading", "Communication Patterns · Sync vs Async; Push vs Pull"),
      ]),
      M("sd-m3c", "Traffic Management & Caching", "Traffic Management & Caching", [
        L("P3-06", "Load Balancers: L4/L7, Algorithms, Health Checks", 7, "reading", "Traffic Management & Caching · Load Balancers: L4/L7, Algorithms, Health Checks"),
        L("P3-07", "Reverse Proxy & API Gateway", 7, "reading", "Traffic Management & Caching · Reverse Proxy & API Gateway"),
        L("P3-08", "Service Discovery", 6, "reading", "Traffic Management & Caching · Service Discovery"),
        L("P3-09", "Caching Fundamentals & Eviction Policies", 13, "reading", "Traffic Management & Caching · Caching Fundamentals & Eviction Policies"),
        L("P3-10", "Cache Strategies, Invalidation & Distributed Caching", 9, "reading", "Traffic Management & Caching · Cache Strategies, Invalidation & Distributed Caching"),
        L("P3-11", "CDNs: Caching at the Edge", 6, "reading", "Traffic Management & Caching · CDNs: Caching at the Edge"),
        L("P3-12", "Rate Limiting: Token Bucket vs Leaky Bucket vs Sliding Window", 13, "reading", "Traffic Management & Caching · Rate Limiting: Token Bucket vs Leaky Bucket vs Sliding Window"),
      ]),
      M("sd-m3d", "Architecture Choices", "Architecture Choices", [
        L("P3-13", "Scalability: Vertical vs Horizontal + the Scale Ladder", 8, "reading", "Architecture Choices · Scalability: Vertical vs Horizontal + the Scale Ladder"),
        L("P3-14", "Monolith vs Microservices; Stateful vs Stateless", 12, "reading", "Architecture Choices · Monolith vs Microservices; Stateful vs Stateless"),
      ]),
      M("sd-m4a", "Data Modeling & Indexing", "Data Modeling & Indexing", [
        L("P4-01", "SQL vs NoSQL — Choosing from Access Patterns", 8, "reading", "Data Modeling & Indexing · SQL vs NoSQL — Choosing from Access Patterns"),
        L("P4-02", "Normalization vs Denormalization", 6, "reading", "Data Modeling & Indexing · Normalization vs Denormalization"),
        L("P4-03", "Indexing: B-tree, Hash, LSM-tree", 13, "reading", "Data Modeling & Indexing · Indexing: B-tree, Hash, LSM-tree"),
        L("P4-04", "Transactions: ACID vs BASE & Isolation Levels", 14, "reading", "Data Modeling & Indexing · Transactions: ACID vs BASE & Isolation Levels"),
      ]),
      M("sd-m4b", "Replication & Partitioning", "Replication & Partitioning", [
        L("P4-05", "Replication: Leader-Follower, Multi-Leader, Leaderless", 14, "reading", "Replication & Partitioning · Replication: Leader-Follower, Multi-Leader, Leaderless"),
        L("P4-06", "Data Partitioning & Sharding", 13, "reading", "Replication & Partitioning · Data Partitioning & Sharding"),
        L("P4-07", "Consistent Hashing + Virtual Nodes", 13, "reading", "Replication & Partitioning · Consistent Hashing + Virtual Nodes"),
        L("P4-08", "Connection Pooling & the DB Scaling Ladder", 11, "reading", "Replication & Partitioning · Connection Pooling & the DB Scaling Ladder"),
      ]),
      M("sd-m4c", "Specialized Storage", "Specialized Storage", [
        L("P4-09", "Object Storage & Distributed File Systems", 6, "reading", "Specialized Storage · Object Storage & Distributed File Systems"),
        L("P4-10", "Search: Inverted Index at Scale", 7, "reading", "Specialized Storage · Search: Inverted Index at Scale"),
        L("P4-11", "Bloom Filters", 6, "reading", "Specialized Storage · Bloom Filters"),
        L("P4-12", "Redis as a Data Layer", 10, "reading", "Specialized Storage · Redis as a Data Layer"),
      ]),
      M("sd-m5a", "Consistency", "Consistency", [
        L("P5-01", "Why Distributed Systems Are Hard", 10, "reading", "Consistency · Why Distributed Systems Are Hard"),
        L("P5-02", "CAP Theorem, Properly", 12, "reading", "Consistency · CAP Theorem, Properly"),
        L("P5-03", "PACELC: the Tradeoff During Normal Operation", 11, "reading", "Consistency · PACELC: the Tradeoff During Normal Operation"),
        L("P5-04", "Consistency Models — a Real Spectrum", 13, "reading", "Consistency · Consistency Models — a Real Spectrum"),
        L("P5-05", "Quorum Reads & Writes", 12, "reading", "Consistency · Quorum Reads & Writes"),
        L("P5-06", "Conflict Resolution & Anti-Entropy", 13, "reading", "Consistency · Conflict Resolution & Anti-Entropy"),
      ]),
      M("sd-m5b", "Time, Election & Consensus", "Time, Election & Consensus", [
        L("P5-07", "Time & Ordering: Lamport & Vector Clocks", 13, "reading", "Time, Election & Consensus · Time & Ordering: Lamport & Vector Clocks"),
        L("P5-08", "Leader Election, Failure Detection, Split-Brain & Fencing", 14, "reading", "Time, Election & Consensus · Leader Election, Failure Detection, Split-Brain & Fencing"),
        L("P5-09", "Consensus: Raft (& Paxos in Context)", 15, "reading", "Time, Election & Consensus · Consensus: Raft (& Paxos in Context)"),
        L("P5-10", "Distributed Locks & Leases", 13, "reading", "Time, Election & Consensus · Distributed Locks & Leases"),
      ]),
      M("sd-m5c", "Distributed Transactions", "Distributed Transactions", [
        L("P5-11", "Distributed Transactions: 2PC, Saga, Outbox, CDC", 15, "reading", "Distributed Transactions · Distributed Transactions: 2PC, Saga, Outbox, CDC"),
        L("P5-12", "Delivery Semantics & Idempotency", 14, "reading", "Distributed Transactions · Delivery Semantics & Idempotency"),
        L("P5-13", "Network Partitions & Partial-Failure Drills", 11, "reading", "Distributed Transactions · Network Partitions & Partial-Failure Drills"),
      ]),
      M("sd-m6a", "Availability & Resilience", "Availability & Resilience", [
        L("P6-01", "Availability Math & SLOs/SLIs/Error Budgets", 12, "reading", "Availability & Resilience · Availability Math & SLOs/SLIs/Error Budgets"),
        L("P6-02", "Fault Tolerance: Redundancy & Failover", 6, "reading", "Availability & Resilience · Fault Tolerance: Redundancy & Failover"),
        L("P6-03", "Timeouts, Retries, Exponential Backoff + Jitter", 13, "reading", "Availability & Resilience · Timeouts, Retries, Exponential Backoff + Jitter"),
        L("P6-04", "Circuit Breakers, Bulkheads, Backpressure, Load Shedding", 13, "reading", "Availability & Resilience · Circuit Breakers, Bulkheads, Backpressure, Load Shedding"),
        L("P6-05", "Graceful Degradation & Fallbacks", 6, "reading", "Availability & Resilience · Graceful Degradation & Fallbacks"),
      ]),
      M("sd-m6b", "Operations & Security", "Operations & Security", [
        L("P6-06", "Disaster Recovery: Backups, RPO/RTO, Multi-Region", 13, "reading", "Operations & Security · Disaster Recovery: Backups, RPO/RTO, Multi-Region"),
        L("P6-07", "Observability: Logs, Metrics, Traces, Alerting", 8, "reading", "Operations & Security · Observability: Logs, Metrics, Traces, Alerting"),
        L("P6-08", "Security Fundamentals for System Design", 13, "reading", "Operations & Security · Security Fundamentals for System Design"),
      ]),
      M("sd-m7a", "Async & Streaming at Scale", "Async & Streaming at Scale", [
        L("P7-01", "Message Queues & Pub/Sub", 8, "reading", "Async & Streaming at Scale · Message Queues & Pub/Sub"),
        L("P7-02", "Kafka Concepts", 7, "reading", "Async & Streaming at Scale · Kafka Concepts"),
        L("P7-03", "Batch vs Stream Processing", 6, "reading", "Async & Streaming at Scale · Batch vs Stream Processing"),
        L("P7-04", "Event-Driven Architecture; Event Sourcing & CQRS", 8, "reading", "Async & Streaming at Scale · Event-Driven Architecture; Event Sourcing & CQRS"),
        L("P7-05", "Service Mesh & mTLS at Scale", 5, "reading", "Async & Streaming at Scale · Service Mesh & mTLS at Scale"),
      ]),
      M("sd-m7b", "Deploy & Operate", "Deploy & Operate", [
        L("P7-06", "Serverless vs Traditional Hosting", 5, "reading", "Deploy & Operate · Serverless vs Traditional Hosting"),
        L("P7-07", "Multi-Region & Edge Architecture", 7, "reading", "Deploy & Operate · Multi-Region & Edge Architecture"),
        L("P7-08", "Containers & Orchestration", 7, "reading", "Deploy & Operate · Containers & Orchestration"),
        L("P7-09", "Deployment Strategies, Health Checks, Feature Flags", 8, "reading", "Deploy & Operate · Deployment Strategies, Health Checks, Feature Flags"),
        L("P7-10", "Testing in Production: Load, Stress, Soak, Chaos", 7, "reading", "Deploy & Operate · Testing in Production: Load, Stress, Soak, Chaos"),
        L("P7-11", "Database Migrations & Schema Evolution", 7, "reading", "Deploy & Operate · Database Migrations & Schema Evolution"),
        L("P7-12", "Capacity Planning & Cost", 5, "reading", "Deploy & Operate · Capacity Planning & Cost"),
      ]),
      M("sd-m8a", "Tier 1 — Flagship Case Studies", "Tier 1 — Flagship Case Studies", [
        L("P8-00", "The 22-Step Case-Study Framework", 7, "reading", "Tier 1 — Flagship Case Studies · The 22-Step Case-Study Framework"),
        L("P8-01", "URL Shortener (TinyURL)", 20, "reading", "Tier 1 — Flagship Case Studies · URL Shortener (TinyURL)"),
        L("P8-02", "Twitter (Microblogging + Timeline)", 22, "reading", "Tier 1 — Flagship Case Studies · Twitter (Microblogging + Timeline)"),
        L("P8-03", "Chat: Messenger / WhatsApp", 22, "reading", "Tier 1 — Flagship Case Studies · Chat: Messenger / WhatsApp"),
        L("P8-04", "Uber / Ride-Hailing Backend", 13, "reading", "Tier 1 — Flagship Case Studies · Uber / Ride-Hailing Backend"),
        L("P8-05", "Payment System", 24, "reading", "Tier 1 — Flagship Case Studies · Payment System"),
        L("P8-06", "Distributed Key-Value Store (Redis/DynamoDB)", 22, "reading", "Tier 1 — Flagship Case Studies · Distributed Key-Value Store (Redis/DynamoDB)"),
      ]),
      M("sd-m8b", "Tier 2 — Focused Case Studies", "Tier 2 — Focused Case Studies", [
        L("P8-07", "Pastebin", 8, "reading", "Tier 2 — Focused Case Studies · Pastebin"),
        L("P8-08", "Instagram (Photo Sharing Feed)", 13, "reading", "Tier 2 — Focused Case Studies · Instagram (Photo Sharing Feed)"),
        L("P8-09", "Video Streaming: YouTube / Netflix", 13, "reading", "Tier 2 — Focused Case Studies · Video Streaming: YouTube / Netflix"),
        L("P8-10", "File Storage & Sync: Dropbox / Google Drive", 12, "reading", "Tier 2 — Focused Case Studies · File Storage & Sync: Dropbox / Google Drive"),
        L("P8-11", "Notification System (Push / Email / SMS Fan-out)", 10, "reading", "Tier 2 — Focused Case Studies · Notification System (Push / Email / SMS Fan-out)"),
        L("P8-12", "API Rate Limiter (as a system)", 9, "reading", "Tier 2 — Focused Case Studies · API Rate Limiter (as a system)"),
        L("P8-13", "Search System (Twitter / product search)", 10, "reading", "Tier 2 — Focused Case Studies · Search System (Twitter / product search)"),
        L("P8-14", "Web Crawler", 11, "reading", "Tier 2 — Focused Case Studies · Web Crawler"),
        L("P8-15", "News Feed (Facebook)", 11, "reading", "Tier 2 — Focused Case Studies · News Feed (Facebook)"),
        L("P8-16", "Ticketmaster (Event Ticketing)", 21, "reading", "Tier 2 — Focused Case Studies · Ticketmaster (Event Ticketing)"),
        L("P8-17", "Food Delivery", 10, "reading", "Tier 2 — Focused Case Studies · Food Delivery"),
      ]),
      M("sd-m8c", "Tier 3 — Self-Solve Case Studies", "Tier 3 — Self-Solve Case Studies", [
        L("P8-18", "Typeahead / Autocomplete", 10, "reading", "Tier 3 — Self-Solve Case Studies · Typeahead / Autocomplete"),
        L("P8-19", "Yelp / Nearby Friends (Proximity Search)", 11, "reading", "Tier 3 — Self-Solve Case Studies · Yelp / Nearby Friends (Proximity Search)"),
        L("P8-20", "Google Drive Collaboration (OT/CRDT Deep Dive)", 11, "reading", "Tier 3 — Self-Solve Case Studies · Google Drive Collaboration (OT/CRDT Deep Dive)"),
      ]),
      M("sd-m9a", "Projects — Beginner", "Projects — Beginner", [
        L("P9-01", "Project: URL Shortener (REST + Postgres + Redis)", 7, "reading", "Projects — Beginner · Project: URL Shortener (REST + Postgres + Redis)"),
        L("P9-02", "Project: REST API with PostgreSQL + Redis", 7, "reading", "Projects — Beginner · Project: REST API with PostgreSQL + Redis"),
      ]),
      M("sd-m9b", "Projects — Intermediate", "Projects — Intermediate", [
        L("P9-03", "Project: Distributed Rate Limiter", 7, "reading", "Projects — Intermediate · Project: Distributed Rate Limiter"),
        L("P9-04", "Project: Notification Service with a Queue", 8, "reading", "Projects — Intermediate · Project: Notification Service with a Queue"),
        L("P9-05", "Project: Chat System with WebSockets", 8, "reading", "Projects — Intermediate · Project: Chat System with WebSockets"),
      ]),
      M("sd-m9c", "Projects — Advanced", "Projects — Advanced", [
        L("P9-06", "Project: News Feed", 8, "reading", "Projects — Advanced · Project: News Feed"),
        L("P9-07", "Project: File Storage & Sync System", 8, "reading", "Projects — Advanced · Project: File Storage & Sync System"),
        L("P9-08", "Project: Distributed Key-Value Store", 9, "reading", "Projects — Advanced · Project: Distributed Key-Value Store"),
        L("P9-09", "Project: Event-Driven E-Commerce Backend", 9, "reading", "Projects — Advanced · Project: Event-Driven E-Commerce Backend"),
      ]),
      M("sd-m10a", "Interview Preparation", "Interview Preparation", [
        L("P10-01", "What a System-Design Interview Actually Tests", 6, "reading", "Interview Preparation · What a System-Design Interview Actually Tests"),
        L("P10-02", "The Interview Framework (9 steps)", 7, "reading", "Interview Preparation · The Interview Framework (9 steps)"),
        L("P10-03", "Answer-Quality Rubric", 6, "reading", "Interview Preparation · Answer-Quality Rubric"),
        L("P10-04", "Common Mistakes That Sink Candidates", 5, "reading", "Interview Preparation · Common Mistakes That Sink Candidates"),
        L("P10-05", "Question Bank", 6, "reading", "Interview Preparation · Question Bank"),
        L("P10-06", "Mock Interview Plan", 5, "reading", "Interview Preparation · Mock Interview Plan"),
        L("P10-07", "Final Checklist", 5, "reading", "Interview Preparation · Final Checklist"),
      ]),
      M("sd-mref", "Reference", "Reference", [
        L("REF-01", "Numbers & Nines Cheat Sheet", 5, "reading", "Reference · Numbers & Nines Cheat Sheet"),
        L("REF-02", "Interview Cheat Sheet", 6, "reading", "Reference · Interview Cheat Sheet"),
        L("REF-03", "Glossary (expanded)", 8, "reading", "Reference · Glossary (expanded)"),
      ]),
    ],
  },

  // ─── Computer Networks (unchanged) ────────────────────────────────
  {
    slug: "computer-networks",
    title: "Computer Networks",
    short: "CN",
    tagline: "Packets, protocols and the path from your browser to a server.",
    description:
      "Follow a single HTTP request through every layer of the stack. DNS, TCP handshakes, congestion control, TLS, routing, NAT and the modern web protocols (HTTP/2, HTTP/3, QUIC) — explained with packet-level detail.",
    category: "Networks",
    level: "Intermediate",
    icon: "globe",
    accent: "from-sky-500 via-blue-500 to-indigo-500",
    glow: "shadow-sky-500/30",
    tags: ["TCP/IP", "DNS", "TLS", "Routing", "HTTP/3"],
    outcomes: [
      "Answer 'what happens when you type a URL' at packet level",
      "Explain TCP reliability, flow control and congestion control",
      "Read a Wireshark capture of a TLS 1.3 handshake",
      "Compare HTTP/1.1, HTTP/2 and HTTP/3 head-of-line behaviour",
    ],
    author: "Networks Track",
    updated: "Dec 2025",
    modules: [
      M("cn-1", "Models & Physical Reality", "Layers, encapsulation and the wire.", [
        L("cn-1-l0", "OSI vs TCP/IP Models", 12, "reading", "Seven layers, four layers, and what actually ships packets."),
        L("cn-1-l1", "Encapsulation & Framing", 13, "reading", "Headers, MTU, fragmentation and Ethernet frames."),
      ]),
      M("cn-2", "Link & Network Layer", "Getting a packet to the right machine.", [
        L("cn-2-l0", "MAC, ARP and Switching", 14, "reading", "Address resolution, switch tables, collision vs broadcast domains."),
        L("cn-2-l1", "IPv4, Subnetting and CIDR", 18, "lab", "Subnet math drills with worked answers."),
        L("cn-2-l2", "Routing: RIP, OSPF, BGP", 17, "reading", "Distance vector vs link state vs path vector."),
        L("cn-2-l3", "NAT, DHCP and IPv6", 14, "reading", "Why your laptop has a private address."),
      ]),
      M("cn-3", "Transport Layer", "Reliability built on an unreliable network.", [
        L("cn-3-l0", "UDP vs TCP", 12, "reading", "Trade-offs, headers and when datagrams win."),
        L("cn-3-l1", "TCP Handshake, Teardown & States", 16, "reading", "SYN/ACK, TIME_WAIT and the full state machine."),
        L("cn-3-l2", "Flow Control & Sliding Windows", 15, "reading", "Receiver windows, zero-window probes, Nagle."),
        L("cn-3-l3", "Congestion Control", 18, "case", "Slow start, AIMD, Reno, CUBIC and BBR compared."),
      ]),
      M("cn-4", "Application Layer & Security", "The protocols you use every day.", [
        L("cn-4-l0", "DNS Resolution End to End", 15, "reading", "Recursive vs iterative, records, caching, DNSSEC."),
        L("cn-4-l1", "HTTP/1.1 → HTTP/2 → HTTP/3", 18, "reading", "Pipelining, multiplexing, QUIC over UDP."),
        L("cn-4-l2", "TLS 1.3 Handshake", 16, "reading", "Key exchange, certificates, forward secrecy, 0-RTT."),
        L("cn-4-l3", "What Happens When You Type a URL", 20, "case", "The classic end-to-end walkthrough, done properly."),
      ]),
    ],
  },

  // ─── DSA (unchanged) ──────────────────────────────────────────────
  {
    slug: "dsa",
    title: "Data Structures & Algorithms",
    short: "DSA",
    tagline: "Patterns, complexity and 150 curated problems.",
    description:
      "Not another problem dump — a pattern-first curriculum. Master the fourteen recurring patterns behind almost every interview question, with complexity analysis, template code and a spaced-repetition problem set.",
    category: "Programming",
    level: "Beginner",
    icon: "binary",
    accent: "from-fuchsia-500 via-purple-500 to-violet-500",
    glow: "shadow-fuchsia-500/30",
    tags: ["Big-O", "Graphs", "DP", "Two Pointers", "Trees"],
    outcomes: [
      "Analyse time and space complexity fluently, including amortised cost",
      "Recognise which of the 14 patterns a new problem belongs to",
      "Implement graph traversals, heaps and tries from scratch",
      "Build DP solutions bottom-up from a clear recurrence",
    ],
    author: "Programming Track",
    updated: "Feb 2026",
    modules: [
      M("ds-1", "Complexity & Core Structures", "The vocabulary of efficiency.", [
        L("ds-1-l0", "Big-O, Big-Θ and Amortised Analysis", 15, "reading", "Growth rates, dominant terms, dynamic array doubling."),
        L("ds-1-l1", "Arrays, Strings and Dynamic Arrays", 13, "reading", "Memory layout, cache locality, slicing costs."),
        L("ds-1-l2", "Linked Lists, Stacks and Queues", 15, "reading", "Singly/doubly, monotonic stacks, deque tricks."),
        L("ds-1-l3", "Hash Tables Under the Hood", 16, "reading", "Hashing, collisions, open addressing vs chaining."),
      ]),
      M("ds-2", "Trees & Heaps", "Hierarchical data.", [
        L("ds-2-l0", "Binary Trees & Traversals", 15, "reading", "Recursive and iterative pre/in/post/level order."),
        L("ds-2-l1", "BSTs, AVL and Red-Black Trees", 18, "reading", "Rotations, balance invariants and their costs."),
        L("ds-2-l2", "Heaps & Priority Queues", 14, "reading", "Sift up/down, heapify in O(n), top-K patterns."),
        L("ds-2-l3", "Tries & Prefix Problems", 13, "reading", "Autocomplete, word search, memory trade-offs."),
      ]),
      M("ds-3", "Graphs", "Everything is a graph.", [
        L("ds-3-l0", "Representations, BFS and DFS", 16, "reading", "Adjacency list vs matrix, visited sets, connected components."),
        L("ds-3-l1", "Topological Sort & Cycle Detection", 15, "reading", "Kahn's algorithm and DFS colouring."),
        L("ds-3-l2", "Shortest Paths: Dijkstra & Bellman-Ford", 18, "reading", "Relaxation, negative edges, A* preview."),
        L("ds-3-l3", "Union-Find & MST", 16, "reading", "Path compression, union by rank, Kruskal and Prim."),
      ]),
      M("ds-4", "Algorithmic Patterns", "The reusable playbook.", [
        L("ds-4-l0", "Two Pointers & Sliding Window", 16, "reading", "Fixed and variable windows with templates."),
        L("ds-4-l1", "Binary Search on Answer", 15, "reading", "Predicate framing and the boundary template."),
        L("ds-4-l2", "Backtracking & Recursion Trees", 17, "reading", "Permutations, subsets, pruning strategies."),
        L("ds-4-l3", "Dynamic Programming Blueprint", 22, "case", "State, transition, base case; 1D/2D and knapsack family."),
        L("ds-4-l4", "Greedy vs DP: Choosing Correctly", 14, "reading", "Exchange arguments and when greedy actually works."),
      ]),
    ],
  },

  // ─── OOPS (unchanged) ─────────────────────────────────────────────
  {
    slug: "oops",
    title: "Object Oriented Design",
    short: "OOD",
    tagline: "SOLID principles, design patterns and clean low-level design.",
    description:
      "The bridge between coding and architecture. Master encapsulation, polymorphism and composition, then apply SOLID and the classic Gang-of-Four patterns to real low-level design interviews such as parking lots, elevators and Splitwise.",
    category: "Programming",
    level: "Intermediate",
    icon: "boxes",
    accent: "from-amber-500 via-orange-500 to-red-500",
    glow: "shadow-amber-500/30",
    tags: ["SOLID", "Patterns", "UML", "LLD", "Refactoring"],
    outcomes: [
      "Model a domain with clean classes, interfaces and relationships",
      "Apply all five SOLID principles to real code",
      "Pick the right design pattern instead of forcing one",
      "Ace low-level design interviews with UML-backed answers",
    ],
    author: "Programming Track",
    updated: "Nov 2025",
    modules: [
      M("oo-1", "OOP Foundations", "The four pillars, precisely defined.", [
        L("oo-1-l0", "Encapsulation & Abstraction", 12, "reading", "Information hiding and designing to an interface."),
        L("oo-1-l1", "Inheritance vs Composition", 15, "reading", "Fragile base classes and why composition usually wins."),
        L("oo-1-l2", "Polymorphism & Dynamic Dispatch", 14, "reading", "Static vs dynamic binding, vtables, duck typing."),
        L("oo-1-l3", "UML Class & Sequence Diagrams", 13, "reading", "Notation you can actually draw in an interview."),
      ]),
      M("oo-2", "SOLID Principles", "Five rules that keep code changeable.", [
        L("oo-2-l0", "Single Responsibility & Open/Closed", 15, "reading", "Reasons to change, extension without modification."),
        L("oo-2-l1", "Liskov, Interface Segregation, DIP", 17, "reading", "Substitutability contracts and dependency inversion."),
        L("oo-2-l2", "Code Smells & Refactoring Moves", 16, "lab", "Before/after refactors of a 300-line God class."),
      ]),
      M("oo-3", "Design Patterns", "GoF, but only the ones you will use.", [
        L("oo-3-l0", "Creational: Factory, Builder, Singleton", 18, "reading", "Object creation without coupling to concretes."),
        L("oo-3-l1", "Structural: Adapter, Decorator, Facade, Proxy", 18, "reading", "Composing objects into larger structures."),
        L("oo-3-l2", "Behavioural: Strategy, Observer, State, Command", 20, "reading", "Encapsulating algorithms and interaction."),
        L("oo-3-l3", "Quiz: Name that pattern", 10, "quiz", "Ten code snippets, ten patterns."),
      ]),
      M("oo-4", "Low-Level Design Interviews", "Putting it all together.", [
        L("oo-4-l0", "Design a Parking Lot", 20, "case", "Requirements, entities, pricing strategy, concurrency."),
        L("oo-4-l1", "Design an Elevator System", 20, "case", "State machines, scheduling policy, extensibility."),
        L("oo-4-l2", "Design Splitwise", 22, "case", "Expense splitting, balance simplification, observer notifications."),
      ]),
    ],
  },
];

export const getCourse = (slug: string) => courses.find((c) => c.slug === slug);

export const courseStats = (c: Course) => {
  const lessons = c.modules.flatMap((m) => m.lessons);
  const minutes = lessons.reduce((a, l) => a + l.minutes, 0);
  return {
    lessons: lessons.length,
    modules: c.modules.length,
    minutes,
    hours: Math.round((minutes / 60) * 10) / 10,
  };
};

export const allLessons = (c: Course) =>
  c.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title })));

export const totalLessonCount = courses.reduce((a, c) => a + courseStats(c).lessons, 0);
