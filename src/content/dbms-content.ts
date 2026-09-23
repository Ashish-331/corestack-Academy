export interface DBMSQuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface DBMSPractice {
  prompt: string;
  solution: string;
}

export interface DBMSModule {
  id: string;
  unit: string;
  num: string;
  title: string;
  syllabus: boolean;
  meta: string;
  notes: string;
  quiz: DBMSQuizQuestion[];
  practice: DBMSPractice[];
}

export interface DBMSUnit {
  id: string;
  label: string;
}

export const dbmsUnits: DBMSUnit[] = [
  {
    "id": "u1",
    "label": "Unit I · Foundations"
  },
  {
    "id": "u2",
    "label": "Unit II · SQL & Queries"
  },
  {
    "id": "u3",
    "label": "Unit III · Design & Storage"
  },
  {
    "id": "u4",
    "label": "Unit IV · Transactions"
  },
  {
    "id": "beyond",
    "label": "Beyond Syllabus"
  }
];

export const dbmsModules: DBMSModule[] = [
  {
    id: "m1",
    unit: "u1",
    num: "01",
    title: "Database Fundamentals & Architecture",
    syllabus: true,
    meta: "Data abstraction · DDL/DML/DCL · Three-schema architecture",
    notes: `
    <div class="starter">
    <div class="defbox"><div class="dlabel">Definition &mdash; in plain English</div>A <strong>database</strong> is an organized, shared collection of related data. A <strong>DBMS (Database Management System)</strong> is the software that sits between your programs and that data &mdash; it stores it, answers questions about it, protects it, and keeps it correct even when many users touch it at once. Examples you may have heard of: MySQL, PostgreSQL, Oracle, SQLite.</div>
    <div class="intuitbox"><div class="dlabel">Intuition &mdash; how to think about it</div>Think of a DBMS as a <strong>librarian for your data</strong>. Without one, everyone rummages through the shelves (raw files) themselves &mdash; books get misplaced, duplicated, and torn. With a librarian, you just <em>ask</em> for what you want; the librarian knows where everything is, keeps one authoritative copy, decides who may borrow what, and never lets two people scribble in the same book at the same time. The 'three levels of abstraction' are just the librarian showing different people different views: the reader sees a catalogue card (view level), the librarian sees the full catalogue (logical level), and only the storeroom staff care about which physical shelf the book sits on (physical level).</div>
    <h3 class="kt-head">Key terms you must know</h3>
    <table class="reftable"><tr><th>Term</th><th>Meaning</th></tr><tr><td><strong>Database</strong></td><td>An organized collection of related data, stored so it can be shared and queried.</td></tr><tr><td><strong>DBMS</strong></td><td>The software that manages the database &mdash; storage, queries, security, consistency.</td></tr><tr><td><strong>Schema</strong></td><td>The overall design/blueprint of the database (its tables and rules). Changes rarely.</td></tr><tr><td><strong>Instance</strong></td><td>The actual data in the database at one moment. Changes constantly.</td></tr><tr><td><strong>Data abstraction</strong></td><td>Hiding storage details behind layers (physical &rarr; logical &rarr; view).</td></tr><tr><td><strong>Data independence</strong></td><td>The guarantee that changing one layer does not force rewrites of the layer above.</td></tr><tr><td><strong>Metadata</strong></td><td>Data about the data &mdash; table names, column types, constraints; stored in the data dictionary.</td></tr></table>
    </div>

    <p>A database is a self-describing collection of related data, managed so that many programs and users can share it without stepping on each other. A <strong>DBMS</strong> is the software layer that makes that possible: it stores, retrieves, secures, and keeps the data consistent, so applications never touch raw files directly.</p>

    <h3>Why not just use files?</h3>
    <ul>
      <li><strong>Data redundancy & inconsistency</strong> — the same fact duplicated across files, updated in one place and forgotten in another.</li>
      <li><strong>Difficulty in accessing data</strong> — every new question needs a new program.</li>
      <li><strong>Data isolation</strong> — data scattered across formats/files.</li>
      <li><strong>Integrity problems</strong> — constraints buried in application code, easy to violate.</li>
      <li><strong>Atomicity & concurrency problems</strong> — partial updates, race conditions with multiple users.</li>
      <li><strong>Security problems</strong> — hard to grant fine-grained access at the file level.</li>
    </ul>

    <h3>Data abstraction — the three levels</h3>
    <p>DBMS hides <em>how</em> data is stored behind layers, so higher levels don't break when lower levels change.</p>
    <table class="reftable">
      <tr><th>Level</th><th>Also called</th><th>Concerned with</th></tr>
      <tr><td>Physical level</td><td>Internal schema</td><td>How data is actually stored — blocks, files, indexes, compression.</td></tr>
      <tr><td>Logical level</td><td>Conceptual schema</td><td>What data is stored and what relationships hold — the ER/relational design.</td></tr>
      <tr><td>View level</td><td>External schema</td><td>What a specific user/app sees — a subset or reshaping of the logical level.</td></tr>
    </table>

    <h3>Data independence</h3>
    <p>The ability to change a schema at one level without rewriting the level above it.</p>
    <ul>
      <li><strong>Physical data independence</strong> — change storage/index structure without touching the logical schema or applications. Relatively easy to achieve.</li>
      <li><strong>Logical data independence</strong> — change the conceptual schema (add a table, split a table) without rewriting every application/view. Harder, because applications are written against the logical schema directly.</li>
    </ul>

    <h3>ANSI/SPARC three-schema architecture</h3>
    <p>This is literally the abstraction levels above, formalized as a design principle: External schemas (many) → Conceptual schema (one) → Internal schema (one). Mappings between adjacent levels are what deliver data independence.</p>

    <h3>DBMS languages</h3>
    <table class="reftable">
      <tr><th>Language</th><th>Full form</th><th>Commands</th><th>Job</th></tr>
      <tr><td>DDL</td><td>Data Definition Language</td><td><code>CREATE, ALTER, DROP, TRUNCATE</code></td><td>Defines structure — schema, tables, constraints.</td></tr>
      <tr><td>DML</td><td>Data Manipulation Language</td><td><code>SELECT, INSERT, UPDATE, DELETE</code></td><td>Reads/writes the actual data.</td></tr>
      <tr><td>DCL</td><td>Data Control Language</td><td><code>GRANT, REVOKE</code></td><td>Controls who can do what.</td></tr>
      <tr><td>TCL</td><td>Transaction Control Language</td><td><code>COMMIT, ROLLBACK, SAVEPOINT</code></td><td>Controls transaction boundaries.</td></tr>
    </table>
    <p>DML is further split: <strong>procedural DML</strong> (user specifies what data and how to get it — relational algebra) vs <strong>declarative/non-procedural DML</strong> (user specifies what data, DBMS figures out how — SQL, relational calculus).</p>

    <div class="callout"><div class="ctitle">Common exam trap</div>Students mix up "data independence" with "abstraction." Abstraction is the layered <em>view</em>; independence is the <em>guarantee</em> that changing one layer doesn't ripple into the next. One is structure, the other is a property of that structure.</div>

    <h3>DBMS users</h3>
    <ul>
      <li><strong>DBA (Database Administrator)</strong> — schema definition, storage/access control, authorization, routine maintenance.</li>
      <li><strong>Application programmers</strong> — write programs against the DB via DML embedded in host languages or APIs.</li>
      <li><strong>Sophisticated users</strong> — interact via query languages directly.</li>
      <li><strong>Naive/end users</strong> — interact via fixed forms/apps built on top.</li>
    </ul>

<h3>Worked: the three-schema architecture and data independence</h3><div class="worked"><div class="wtitle">Worked example &mdash; what each level insulates you from</div><div class="codeblock"><pre>THE THREE-SCHEMA ARCHITECTURE, and what each boundary buys you.

   +---------------------------------------------------------+
   |  EXTERNAL LEVEL   many views, one per user group         |
   |    payroll_view(emp_id, name, salary)                    |
   |    directory_view(name, dept, extension)                 |
   +---------------------------------------------------------+
                  ^  LOGICAL DATA INDEPENDENCE
                  |  change the conceptual schema without
                  |  rewriting applications  (HARDER)
   +---------------------------------------------------------+
   |  CONCEPTUAL LEVEL   one community schema                 |
   |    Employee(emp_id, name, dept_id, salary, hire_date)    |
   |    Department(dept_id, dept_name, budget)                |
   +---------------------------------------------------------+
                  ^  PHYSICAL DATA INDEPENDENCE
                  |  change storage without touching the
                  |  conceptual schema  (EASIER)
   +---------------------------------------------------------+
   |  INTERNAL LEVEL   files, pages, B+ tree indexes,         |
   |                   compression, partitioning              |
   +---------------------------------------------------------+

WHY PHYSICAL INDEPENDENCE IS EASY:
   Adding an index changes only the internal level. The conceptual
   schema is untouched, so nothing above notices. Only the mapping
   between internal and conceptual must absorb the change.

WHY LOGICAL INDEPENDENCE IS HARD:
   Splitting Employee into Employee + Salary changes the conceptual
   schema itself. Every external view defined on it must be redefined,
   and applications written directly against the conceptual schema
   (rather than a view) break. This is why the view layer matters:
   it is the insulation that makes logical independence achievable
   at all.</pre></div></div><h3>The four SQL sublanguages</h3><table class="reftable"><tr><th>Sublanguage</th><th>Statements</th><th>Purpose</th></tr><tr><td><strong>DDL</strong></td><td>CREATE, ALTER, DROP, TRUNCATE</td><td>Define and change <em>structure</em></td></tr><tr><td><strong>DML</strong></td><td>SELECT, INSERT, UPDATE, DELETE</td><td>Query and change <em>data</em></td></tr><tr><td><strong>DCL</strong></td><td>GRANT, REVOKE</td><td>Control <em>access</em></td></tr><tr><td><strong>TCL</strong></td><td>COMMIT, ROLLBACK, SAVEPOINT</td><td>Delimit <em>transactions</em></td></tr></table><div class="callout"><div class="ctitle">A frequent exam distinction</div><code>DELETE</code> is DML &mdash; row-by-row, logged, rollback-able, fires triggers. <code>TRUNCATE</code> is DDL &mdash; deallocates whole pages, far faster, usually not rollback-able, and does not fire row triggers. <code>DROP</code> removes the table itself.</div>

<h3>Worked: the six file-system problems a DBMS solves</h3><div class="worked"><div class="wtitle">Worked example &mdash; why databases exist at all</div><div class="codeblock"><pre>DBMS vs FILE SYSTEM -- the six problems, with a concrete case.

A university keeps student records in flat files. Each department
maintains its own copy.

  PROBLEM                  WHAT ACTUALLY HAPPENS
  -----------------------  ---------------------------------------------
  Redundancy               A student&#x27;s address sits in the registrar&#x27;s
                           file, the library&#x27;s file and the hostel file.
  Inconsistency            She moves house. Registrar updates; library
                           does not. Two &quot;true&quot; addresses now exist.
  Access difficulty        &quot;Which students borrowed a book AND owe fees?&quot;
                           needs a new program written from scratch --
                           the files have no query language.
  Isolation                Registrar uses CSV, library uses a binary
                           format. Combining them means custom parsers.
  Integrity                &quot;GPA must be 0-10&quot; is enforced in whichever
                           programs remember to check. One that forgets
                           writes 47.
  Atomicity                Transferring a fee payment crashes halfway:
                           debited from one file, never credited to the
                           other. No mechanism exists to undo it.
  Concurrency              Two clerks read the same seat count (1),
                           both allocate it, both write 0. Two students,
                           one seat.
  Security                 File permissions are all-or-nothing. You
                           cannot grant &quot;may read names but not grades&quot;.

A DBMS answers every one of these with a specific mechanism -- a
schema and normalization for redundancy, SQL for access, constraints
for integrity, transactions for atomicity and concurrency, and GRANT
for fine-grained security. That mapping IS the subject of this course.</pre></div></div><h3>Schema versus instance</h3><div class="worked"><div class="wtitle">Worked example &mdash; structure vs contents</div><div class="codeblock"><pre>SCHEMA vs INSTANCE -- a distinction worth being precise about.

  SCHEMA    the STRUCTURE, defined once, changes rarely.
            Analogous to a class declaration or a struct type.

            Student(roll INT PK, name VARCHAR(50), cgpa DECIMAL(4,2))

  INSTANCE  the DATA held at one moment, changes constantly.
            Analogous to the set of live objects.

            (101, &#x27;Meera&#x27;, 8.75)
            (102, &#x27;Arjun&#x27;, 9.10)

Every INSERT changes the instance; only ALTER TABLE changes the schema.
When a textbook says &quot;the database&quot;, context decides which is meant --
&quot;design the database&quot; means the schema; &quot;back up the database&quot; means
the instance.</pre></div></div>

<div class="takeaways"><div class="tk-title">Key takeaways</div><ul><li>A DBMS exists to remove redundancy, isolation, integrity and concurrency problems inherent to flat files.</li><li>Three schema levels: <strong>external</strong> (views), <strong>conceptual</strong> (community schema), <strong>internal</strong> (storage).</li><li><strong>Physical</strong> independence is easy; <strong>logical</strong> independence is hard because applications bind to the conceptual schema.</li><li>The view layer is what makes logical independence attainable in practice.</li><li>DDL structure, DML data, DCL access, TCL transactions.</li><li><code>DELETE</code> (DML, row-wise, rollback-able) vs <code>TRUNCATE</code> (DDL, page-wise, fast).</li></ul></div>`,
    quiz: [
      { q: `Which type of data independence is harder to achieve in practice, and why?`, options: ["Physical — because disk formats vary by vendor", "Logical — because applications are written directly against the logical/conceptual schema", "Logical — because SQL cannot express joins across schema versions", "Physical — because indexes cannot be rebuilt online"], answer: 1, explain: `Physical independence only requires the mapping between internal and conceptual schema to absorb storage changes. Logical independence requires every application built on the conceptual schema to keep working when that schema itself changes — much harder to isolate.` },
      { q: `A DBA writes <span class="inline-code">ALTER TABLE students ADD COLUMN gpa DECIMAL(3,2);</span> — which sublanguage is this?`, options: ["DML", "DCL", "DDL", "TCL"], answer: 2, explain: `ALTER changes structure, not data — that is DDL, alongside CREATE, DROP, and TRUNCATE.` },
      { q: `The external (view) level of the three-schema architecture primarily exists to:`, options: ["Store the physical file layout", "Give different users/applications a tailored, restricted picture of the same underlying data", "Replace the need for a conceptual schema", "Enforce referential integrity constraints"], answer: 1, explain: `The view level lets a payroll app see salary columns while a directory app sees only names/departments — same underlying conceptual schema, different external presentations.` },
    ],
    practice: [
      { prompt: `A college has one shared MS-Excel file for "Students" used independently by the Admissions office and the Library office, each keeping their own copy. List three concrete problems this setup will hit within a year, and name which classic file-system limitation each one is.`, solution: `<ol>
       <li><strong>A student's address changes.</strong> Admissions updates their copy; Library doesn't know. → <em>Data inconsistency</em> from redundancy.</li>
       <li><strong>Library wants "list all students who owe a fine AND are on academic probation."</strong> That fact lives in two separate files with no link. → <em>Difficulty in accessing data / data isolation</em>.</li>
       <li><strong>Two staff members edit the same row at the same time</strong> during term registration, and one person's edit silently overwrites the other's. → <em>Concurrent access anomaly</em> (no concurrency control).</li>
     </ol>` },
      { prompt: `Classify each of the following DBA actions as DDL, DML, DCL, or TCL: (a) building a new index on a table, (b) rolling back a failed batch update, (c) letting a junior analyst read but not write the orders table, (d) inserting 500 new rows from a CSV import.`, solution: `(a) <code>CREATE INDEX</code> → <strong>DDL</strong> (structure).<br>(b) <code>ROLLBACK</code> → <strong>TCL</strong> (transaction boundary).<br>(c) <code>GRANT SELECT ON orders TO analyst;</code> → <strong>DCL</strong> (permission).<br>(d) <code>INSERT INTO ... VALUES ...</code> → <strong>DML</strong> (data).` },
    ],
  },
  {
    id: "m2",
    unit: "u1",
    num: "02",
    title: "Entity-Relationship Modeling",
    syllabus: true,
    meta: "Entities & attributes · cardinality · EER · ER-to-relational mapping",
    notes: `
    <div class="starter">
    <div class="defbox"><div class="dlabel">Definition &mdash; in plain English</div>The <strong>Entity-Relationship (ER) model</strong> is a diagramming language used to <em>design</em> a database before building it. You identify the <strong>entities</strong> (the things: Student, Course), their <strong>attributes</strong> (the facts about them: name, roll_no), and the <strong>relationships</strong> between them (a Student <em>enrolls in</em> a Course).</div>
    <div class="intuitbox"><div class="dlabel">Intuition &mdash; how to think about it</div>An ER diagram is the <strong>architect's floor plan</strong> of a database. Nobody builds a house by laying bricks straight away &mdash; you first sketch rooms (entities), their features (attributes) and the doors connecting them (relationships). Cardinality is just the question 'how many doors?': can one Student enroll in many Courses? Can one Course hold many Students? If both answers are yes, that is a many-to-many relationship. Once the floor plan is agreed, converting it to real tables (ER-to-relational mapping) is almost mechanical &mdash; which is exactly why we draw the plan first.</div>
    <h3 class="kt-head">Key terms you must know</h3>
    <table class="reftable"><tr><th>Term</th><th>Meaning</th></tr><tr><td><strong>Entity</strong></td><td>A real-world thing we store data about (Student, Course). Drawn as a rectangle.</td></tr><tr><td><strong>Attribute</strong></td><td>A property of an entity (name, gpa). Drawn as an oval.</td></tr><tr><td><strong>Relationship</strong></td><td>An association between entities (Student <em>enrolls in</em> Course). Drawn as a diamond.</td></tr><tr><td><strong>Cardinality</strong></td><td>How many of one entity can link to how many of another: 1:1, 1:N, M:N.</td></tr><tr><td><strong>Primary key</strong></td><td>The attribute that uniquely identifies each entity instance (underlined in diagrams).</td></tr><tr><td><strong>Weak entity</strong></td><td>An entity that cannot be identified on its own; it depends on a 'parent' entity (double rectangle).</td></tr><tr><td><strong>Participation</strong></td><td>Total (every instance must take part in the relationship) vs partial (some may not).</td></tr></table>
    </div>

    <p>The ER model is a blueprint language: before you write a single <code>CREATE TABLE</code>, you sketch what things exist (entities), what describes them (attributes), and how they relate (relationships). It's deliberately implementation-free — you're modeling the problem, not the database yet.</p>

    <h3>Core building blocks</h3>
    <table class="reftable">
      <tr><th>Concept</th><th>Definition</th><th>Notation</th></tr>
      <tr><td>Entity</td><td>A distinguishable real-world object — a specific student, a specific order.</td><td>Rectangle</td></tr>
      <tr><td>Entity set</td><td>A collection of entities of the same type, sharing the same attributes.</td><td>Rectangle (the set)</td></tr>
      <tr><td>Attribute</td><td>A property that describes an entity.</td><td>Ellipse</td></tr>
      <tr><td>Relationship</td><td>An association among two or more entities.</td><td>Diamond</td></tr>
    </table>

    <h3>Attribute types</h3>
    <ul>
      <li><strong>Simple</strong> vs <strong>composite</strong> — <code>age</code> is simple; <code>name</code> splitting into <code>first_name</code> + <code>last_name</code> is composite.</li>
      <li><strong>Single-valued</strong> vs <strong>multivalued</strong> — a person has one <code>dob</code> but possibly several <code>phone_numbers</code> (drawn as a double ellipse).</li>
      <li><strong>Stored</strong> vs <strong>derived</strong> — <code>age</code> can be derived from <code>dob</code> (dashed ellipse); storing both risks inconsistency.</li>
      <li><strong>NULL attribute</strong> — value unknown or not applicable.</li>
    </ul>

    <h3>Keys</h3>
    <table class="reftable">
      <tr><th>Key</th><th>Meaning</th></tr>
      <tr><td>Super key</td><td>Any attribute set that uniquely identifies a tuple (may contain extra, non-essential attributes).</td></tr>
      <tr><td>Candidate key</td><td>A <em>minimal</em> super key — remove any attribute and it stops being unique.</td></tr>
      <tr><td>Primary key</td><td>The candidate key chosen by the designer to be "the" identifier.</td></tr>
      <tr><td>Foreign key</td><td>An attribute in one relation that references the primary key of another — this is how relationships survive into the relational model.</td></tr>
    </table>

    <h3>Relationships: degree, cardinality, participation</h3>
    <ul>
      <li><strong>Degree</strong> — how many entity sets participate: binary (2), ternary (3), etc.</li>
      <li><strong>Cardinality ratio</strong> — 1:1, 1:N, or M:N. A <code>Department HAS Employee</code> is 1:N (one dept, many employees). <code>Student ENROLLS Course</code> is M:N.</li>
      <li><strong>Participation constraint</strong> — <strong>total</strong> (every entity must participate — double line) vs <strong>partial</strong> (optional — single line). Every <code>Employee</code> must belong to a <code>Department</code> (total); a <code>Department</code> need not currently have any <code>Manager</code> assigned (partial).</li>
    </ul>

    <h3>Weak entities</h3>
    <p>An entity set with no primary key of its own — it borrows uniqueness from an owner entity via an <strong>identifying relationship</strong>. Example: <code>Dependent</code> (spouse/child of an employee) is only unique in combination with the owning <code>Employee</code>'s key. Drawn with a double rectangle; its own partial key is a <strong>discriminator</strong>, underlined with a dashed line.</p>

    <h3>Advanced (Enhanced) ER — EER</h3>
    <ul>
      <li><strong>Generalization</strong> — bottom-up: combine common attributes of several entity sets into a superclass (<code>Car</code> + <code>Truck</code> → <code>Vehicle</code>).</li>
      <li><strong>Specialization</strong> — top-down: split a superclass into subclasses with distinct attributes (<code>Employee</code> → <code>Engineer</code>, <code>Manager</code>).</li>
      <li>Constraints on specialization: <strong>disjoint</strong> (an entity belongs to at most one subclass) vs <strong>overlapping</strong>; <strong>total</strong> (every superclass member must be in some subclass) vs <strong>partial</strong>.</li>
      <li><strong>Aggregation</strong> — treats a relationship itself as a higher-level entity, so it can participate in further relationships. Needed when a relationship (e.g. <code>Works_On(Employee, Project)</code>) itself needs to relate to a third entity (e.g. which <code>Manager</code> supervises that assignment).</li>
    </ul>

    <h3>Mapping ER to relational schema — the rules</h3>
    <ol>
      <li><strong>Strong entity</strong> → its own table, simple/composite attributes become columns, primary key carries over.</li>
      <li><strong>Weak entity</strong> → its own table, but primary key = discriminator + owner's primary key (as a foreign key).</li>
      <li><strong>1:1 relationship</strong> → post the primary key of either side as a foreign key on the other (prefer the side with total participation).</li>
      <li><strong>1:N relationship</strong> → post the primary key of the "1" side as a foreign key on the "N" side.</li>
      <li><strong>M:N relationship</strong> → create a new junction/bridge table holding both foreign keys (+ any relationship attributes); this table's primary key is usually the combination of both.</li>
      <li><strong>Multivalued attribute</strong> → its own table with a foreign key back to the owning entity.</li>
      <li><strong>Generalization/specialization</strong> → several strategies: single table with a type discriminator column, or one table per subclass with FK to superclass table, or fully collapse into one table (tradeoffs: normalization vs query simplicity vs NULL sparsity).</li>
    </ol>

<h3>Worked: the seven ER-to-relational mapping rules</h3><div class="worked"><div class="wtitle">Worked example &mdash; turning any ER diagram into tables</div><div class="codeblock"><pre>ER-TO-RELATIONAL MAPPING, the seven rules that cover every exam question.

1. STRONG ENTITY -&gt; its own table; the entity key becomes the primary key.
      Employee(emp_id PK, name, salary)

2. WEAK ENTITY -&gt; its own table; PK = owner&#x27;s PK + the partial key (discriminator).
      Dependent(emp_id PK/FK, dep_name PK, relationship)
      -- the FK to Employee must be ON DELETE CASCADE: a dependent
         cannot exist without its owner.

3. 1:1 RELATIONSHIP -&gt; post the FK into EITHER side; prefer the side with
   TOTAL participation, so the column is never NULL.
      Employee(emp_id PK, ..., office_id FK UNIQUE)

4. 1:N RELATIONSHIP -&gt; post the &quot;1&quot; side&#x27;s key as an FK on the &quot;N&quot; side.
      Employee(emp_id PK, ..., dept_id FK)      -- never the reverse

5. M:N RELATIONSHIP -&gt; a NEW junction table; PK = both FKs together.
      Enrollment(student_id PK/FK, course_id PK/FK, grade)
      -- relationship attributes such as &#x27;grade&#x27; live here

6. MULTIVALUED ATTRIBUTE -&gt; a NEW table; PK = owner key + the value.
      EmpPhone(emp_id PK/FK, phone PK)
      -- this is exactly what 1NF demands

7. GENERALIZATION / SPECIALIZATION -&gt; three options:
      (a) one table per subclass, sharing the superclass key
      (b) one table for the superclass with all subclass columns nullable
      (c) both, with the superclass holding the shared columns
      Choose (a) when subclasses differ a lot, (b) when they barely differ.

COUNTING TABLES: an ER diagram with 3 strong entities, 1 weak entity,
2 M:N relationships and 1 multivalued attribute maps to
3 + 1 + 2 + 1 = 7 tables. 1:N relationships add NO tables -- they
only add a foreign key column.</pre></div></div><h3>Cardinality and participation notation</h3><table class="reftable"><tr><th>Notation</th><th>Meaning</th><th>Drawn as</th></tr><tr><td>1:1</td><td>Each side relates to at most one of the other</td><td>single lines</td></tr><tr><td>1:N</td><td>One parent, many children</td><td>crow's foot on the N side</td></tr><tr><td>M:N</td><td>Many on both sides</td><td>crow's foot both ends</td></tr><tr><td>Total participation</td><td>Every entity <em>must</em> take part</td><td>double line</td></tr><tr><td>Partial participation</td><td>Participation is optional</td><td>single line</td></tr></table>

<div class="takeaways"><div class="tk-title">Key takeaways</div><ul><li>A <strong>weak entity</strong> has no key of its own &mdash; it borrows the owner's key plus a discriminator.</li><li>1:N adds a <em>foreign key</em>, never a new table. M:N <em>always</em> needs a junction table.</li><li>Relationship attributes live in the junction table.</li><li>Multivalued attributes become their own table &mdash; this is 1NF in ER form.</li><li><strong>Total</strong> participation (double line) is mandatory; <strong>partial</strong> (single line) is optional.</li><li>Count tables as: strong entities + weak entities + M:N relationships + multivalued attributes.</li></ul></div>`,
    quiz: [
      { q: `A <code>Dependent</code> entity has no meaning or uniqueness outside of the <code>Employee</code> who claims them. What ER concept is this?`, options: ["Aggregation", "Weak entity with identifying relationship", "Multivalued attribute", "Generalization"], answer: 1, explain: `Dependent cannot be uniquely identified by its own attributes alone — it needs the owning Employee's key plus a partial key (discriminator, e.g. dependent's first name) to be unique. Classic weak entity.` },
      { q: `Mapping a pure M:N relationship (say, Student–Course enrollment with no extra attributes) to the relational model requires:`, options: ["Posting the Course key as a foreign key into Student", "Posting the Student key as a foreign key into Course", "A separate junction table holding both keys", "Merging Student and Course into one table"], answer: 2, explain: `Neither side can hold a single foreign key to the other because each side can relate to many rows on the other side — you need a bridge table whose rows represent individual (student, course) pairs.` },
      { q: `"Every Manager must supervise at least one Department, but a Department can (temporarily) have no assigned Manager." This describes:`, options: ["Total participation on Manager's side, partial on Department's side", "Total participation on both sides", "Partial participation on both sides", "A weak entity relationship"], answer: 0, explain: `Total participation = mandatory involvement (drawn with a double line) on the Manager side; partial = optional (single line) on the Department side.` },
    ],
    practice: [
      { prompt: `Design (in words/bullet form, no diagram needed) the ER model for a hospital: Patients get admitted to Rooms, are treated by Doctors, and each treatment prescribes Medicines. Identify: entities, at least one weak entity, one M:N relationship, and the participation constraints you'd choose.`, solution: `<strong>Entities:</strong> Patient (PK: patient_id), Doctor (PK: doctor_id), Room (PK: room_no), Medicine (PK: med_code).<br><br>
     <strong>Weak entity:</strong> Prescription — only meaningful tied to a specific (Patient, Doctor, date) treatment event; its discriminator could be a line-item number, uniqueness comes from the owning Treatment.<br><br>
     <strong>M:N relationship:</strong> Treats(Doctor, Patient) — a doctor treats many patients, a patient may be treated by several doctors (specialists). Bridge table <code>Treats(doctor_id, patient_id, treatment_date, notes)</code>.<br><br>
     <strong>Participation:</strong> Patient→Room is total on Patient (every admitted patient must occupy a room) but partial on Room (a room can sit empty). Patient→Doctor (Treats) is total on Patient during admission but partial on Doctor (a doctor may have zero current patients).` },
      { prompt: `You have this ER fragment: <code>Employee(1) --- works_in --- (N)Department</code>, both strong entities, no attributes on the relationship. Write the two resulting relational tables with correctly placed foreign keys.`, solution: `<div class="codeblock"><span class="k">CREATE TABLE</span> Department (
  dept_id     INT <span class="k">PRIMARY KEY</span>,
  dept_name   VARCHAR(50)
);

<span class="k">CREATE TABLE</span> Employee (
  emp_id      INT <span class="k">PRIMARY KEY</span>,
  emp_name    VARCHAR(50),
  dept_id     INT <span class="k">REFERENCES</span> Department(dept_id)  <span class="c">-- FK on the N side</span>
);</div>The foreign key goes on the "many" side (Employee), pointing to the "one" side (Department) — never the reverse, or one employee row couldn't reference multiple departments' worth of employees correctly.` },
    ],
  },
  {
    id: "m3",
    unit: "u1",
    num: "03",
    title: "Relational Model, Algebra & Tuple Calculus",
    syllabus: true,
    meta: "Relations, keys · algebra operators · TRC syntax",
    notes: `
    <div class="starter">
    <div class="defbox"><div class="dlabel">Definition &mdash; in plain English</div>The <strong>relational model</strong> says: store <em>everything</em> as tables (called relations). <strong>Relational algebra</strong> is a small set of operations (select rows, pick columns, join tables&hellip;) that you combine to answer any question &mdash; it is the <em>procedural</em> maths underneath SQL. <strong>Tuple relational calculus</strong> describes the same answers <em>declaratively</em>: you state what the result must look like, not how to compute it.</div>
    <div class="intuitbox"><div class="dlabel">Intuition &mdash; how to think about it</div>If tables are ingredients, <strong>relational algebra is the recipe</strong> &mdash; step 1 filter, step 2 join, step 3 keep two columns. Relational calculus is instead the <strong>order you give a chef</strong>: 'I want a dish that is spicy and vegetarian' &mdash; no steps, just conditions the result must satisfy. SQL feels like calculus (you declare what you want) but the database engine secretly compiles it into algebra (a step-by-step plan). Remember the two Greek letters that matter most: &sigma; (sigma) <em>selects rows</em>, &pi; (pi) <em>picks columns</em>. Sigma = sieve for rows; pi = pick columns.</div>
    <h3 class="kt-head">Key terms you must know</h3>
    <table class="reftable"><tr><th>Term</th><th>Meaning</th></tr><tr><td><strong>Relation</strong></td><td>A table: a set of tuples over named attributes. No duplicate rows in pure theory.</td></tr><tr><td><strong>Tuple</strong></td><td>One row of a relation.</td></tr><tr><td><strong>Domain</strong></td><td>The set of allowed values for an attribute (e.g. integers, dates).</td></tr><tr><td><strong>Candidate key</strong></td><td>Any minimal set of attributes that uniquely identifies a tuple.</td></tr><tr><td><strong>Primary key</strong></td><td>The candidate key chosen as the official identifier.</td></tr><tr><td><strong>Foreign key</strong></td><td>An attribute in one table that refers to the primary key of another &mdash; the glue between tables.</td></tr><tr><td><strong>&sigma; (select)</strong></td><td>Algebra operator that filters <em>rows</em> by a condition.</td></tr><tr><td><strong>&pi; (project)</strong></td><td>Algebra operator that keeps only certain <em>columns</em>.</td></tr><tr><td><strong>&#8904; (join)</strong></td><td>Combines rows of two tables that match on a condition.</td></tr></table>
    </div>

    <p>The relational model represents everything — entities <em>and</em> relationships — as tables. A <strong>relation</strong> is a set of tuples over a fixed set of attributes, each drawn from a domain. Order of rows and columns doesn't matter; duplicate rows, strictly, aren't allowed (SQL relaxes this in practice).</p>

    <h3>Relational algebra — the procedural query language</h3>
    <p>Every operator takes one or two relations and produces a new relation (closure property) — which is exactly what lets you chain operators into expressions.</p>
    <table class="reftable">
      <tr><th>Operator</th><th>Symbol</th><th>Meaning</th></tr>
      <tr><td>Select</td><td>σ<sub>condition</sub>(R)</td><td>Filter rows matching a condition.</td></tr>
      <tr><td>Project</td><td>π<sub>attrs</sub>(R)</td><td>Keep only listed columns, drop duplicates.</td></tr>
      <tr><td>Union</td><td>R ∪ S</td><td>Rows in R or S (must be union-compatible: same arity & domains).</td></tr>
      <tr><td>Set difference</td><td>R − S</td><td>Rows in R but not in S.</td></tr>
      <tr><td>Cartesian product</td><td>R × S</td><td>Every row of R paired with every row of S.</td></tr>
      <tr><td>Rename</td><td>ρ<sub>x</sub>(R)</td><td>Rename a relation (or its attributes) — needed to combine a relation with itself.</td></tr>
    </table>
    <p>These six are the <strong>fundamental/primitive</strong> operators — everything else is derived shorthand:</p>
    <table class="reftable">
      <tr><th>Derived operator</th><th>Definition in terms of primitives</th></tr>
      <tr><td>Intersection R ∩ S</td><td>R − (R − S)</td></tr>
      <tr><td>Theta join R ⋈<sub>θ</sub> S</td><td>σ<sub>θ</sub>(R × S)</td></tr>
      <tr><td>Natural join R ⋈ S</td><td>Theta join on equality of common attributes, duplicate columns collapsed</td></tr>
      <tr><td>Division R ÷ S</td><td>Rows of R that pair with <em>every</em> row of S ("students who cleared all courses in set S")</td></tr>
    </table>

    <h3>Joins in more depth</h3>
    <ul>
      <li><strong>Equi-join</strong> — theta join where θ is strictly equality.</li>
      <li><strong>Natural join</strong> — equi-join on same-named attributes with the duplicate column removed automatically. Most common in practice/SQL.</li>
      <li><strong>Outer joins</strong> (not primitive, but essential): <strong>left outer</strong> keeps unmatched rows from the left relation (padding with NULLs), <strong>right outer</strong> the reverse, <strong>full outer</strong> keeps both sides' unmatched rows.</li>
    </ul>

    <div class="callout"><div class="ctitle">Worked example</div>
    Given <code>Employee(emp_id, name, dept_id)</code> and <code>Department(dept_id, dept_name)</code>, "names of employees in the 'Sales' department":<br><br>
    π<sub>name</sub>(σ<sub>dept_name='Sales'</sub>(Employee ⋈ Department))<br><br>
    Join first to attach dept_name onto each employee row, filter for Sales, then project just the name.</div>

    <h3>Tuple Relational Calculus (TRC)</h3>
    <p>Where algebra says <em>how</em> to compute the answer step by step (procedural), calculus says <em>what</em> the answer looks like (declarative) — closer to how SQL actually reads. General form:</p>
    <div class="codeblock">{ t | P(t) }</div>
    <p>"The set of all tuples t such that predicate P(t) is true." <code>t</code> ranges over tuples; <code>t.A</code> accesses attribute A of tuple t.</p>
    <ul>
      <li><strong>Existential quantifier ∃</strong> — "there exists a tuple such that..."</li>
      <li><strong>Universal quantifier ∀</strong> — "for all tuples..." — used for division-style "for every" queries.</li>
    </ul>
    <div class="callout"><div class="ctitle">Worked example</div>
    "Names of employees in Sales" in TRC:<br><br>
    { t.name | ∃ e ∈ Employee ( t.name = e.name ∧ ∃ d ∈ Department ( d.dept_id = e.dept_id ∧ d.dept_name = 'Sales' ) ) }</div>
    <p>A formula must be <strong>safe</strong> — restricted so it only ever ranges over finite, existing tuples (otherwise it could denote an infinite relation, e.g. "all tuples NOT in R").</p>
    <p>Codd's theorem: relational algebra, safe TRC, and safe domain relational calculus are all <strong>equivalent in expressive power</strong> — anything one can express, the others can too.</p>

<h3>The six primitive operators &mdash; everything else is derived</h3><table class="reftable"><tr><th>Operator</th><th>Symbol</th><th>Arity</th><th>Note</th></tr><tr><td>Select</td><td>&sigma;</td><td>unary</td><td>Filters <em>rows</em> by a predicate</td></tr><tr><td>Project</td><td>&pi;</td><td>unary</td><td>Keeps <em>columns</em>; removes duplicates</td></tr><tr><td>Union</td><td>&cup;</td><td>binary</td><td>Requires union-compatibility</td></tr><tr><td>Set difference</td><td>&minus;</td><td>binary</td><td>Requires union-compatibility</td></tr><tr><td>Cartesian product</td><td>&times;</td><td>binary</td><td>Every pairing</td></tr><tr><td>Rename</td><td>&rho;</td><td>unary</td><td>Needed for self-joins</td></tr><tr><td><em>Join</em></td><td>&#8904;</td><td>derived</td><td>&sigma;(R &times; S)</td></tr><tr><td><em>Intersection</em></td><td>&cap;</td><td>derived</td><td>R &minus; (R &minus; S)</td></tr><tr><td><em>Division</em></td><td>&divide;</td><td>derived</td><td>Shown above</td></tr></table><h3>Worked: the division operator</h3><div class="worked"><div class="wtitle">Worked example &mdash; "for every" queries</div><div class="codeblock"><pre>DIVISION -- &quot;students who took EVERY compulsory course&quot;.

Enrolled(student, course)          Compulsory(course)
 -----------------------            ----------------
  Ann    DB                          DB
  Ann    OS                          OS
  Ann    AI
  Bob    DB
  Cara   DB
  Cara   OS

Enrolled / Compulsory  =  { student | for every c in Compulsory,
                                      (student, c) is in Enrolled }

Check each student against {DB, OS}:
  Ann   has DB yes, OS yes   -&gt;  INCLUDED   (AI is extra, harmless)
  Bob   has DB yes, OS NO    -&gt;  excluded
  Cara  has DB yes, OS yes   -&gt;  INCLUDED

Result = { Ann, Cara }

Expressed with the basic operators (division is derived, not primitive):

    T1 = pi_student(Enrolled)                    -- all students
    T2 = (T1 x Compulsory) - Enrolled            -- (student,course) pairs MISSING
    T3 = pi_student(T2)                          -- students missing something
    RESULT = T1 - T3                             -- students missing nothing

In SQL the same idea is the classic double-NOT-EXISTS:

    SELECT s.student FROM Students s
    WHERE NOT EXISTS (
      SELECT 1 FROM Compulsory c
      WHERE NOT EXISTS (
        SELECT 1 FROM Enrolled e
        WHERE e.student = s.student AND e.course = c.course));</pre></div></div><div class="callout"><div class="ctitle">Spotting division in an exam</div>Any question containing <em>&ldquo;every&rdquo;</em>, <em>&ldquo;all&rdquo;</em> or <em>&ldquo;in every case&rdquo;</em> is a division problem. In SQL it becomes either double-<code>NOT EXISTS</code>, or a <code>GROUP BY &hellip; HAVING COUNT(DISTINCT &hellip;) = (SELECT COUNT(*) FROM &hellip;)</code>.</div>

<h3>Worked: composing an algebra expression step by step</h3><div class="worked"><div class="wtitle">Worked example &mdash; and why operator order matters</div><div class="codeblock"><pre>BUILDING A QUERY UP, operator by operator.

Schema:  Employee(eid, name, dept_id, salary)
         Department(dept_id, dname, budget)

Query: &quot;names of employees in Sales earning over 50000&quot;

Step 1 -- restrict Department to Sales FIRST (filter early, it is cheap):
    T1 = sigma[dname = &#x27;Sales&#x27;] (Department)

Step 2 -- join to Employee on the common attribute:
    T2 = Employee |x| T1
    (natural join matches on dept_id, the shared column)

Step 3 -- apply the salary restriction:
    T3 = sigma[salary &gt; 50000] (T2)

Step 4 -- project just the name:
    RESULT = pi[name] (T3)

Composed into one expression:

    pi[name] ( sigma[salary &gt; 50000] ( Employee |x| sigma[dname=&#x27;Sales&#x27;](Department) ) )

WHY THE ORDER MATTERS: pushing sigma[dname=&#x27;Sales&#x27;] BELOW the join
means the join processes only Sales departments instead of all of them.
That is exactly the &#x27;predicate pushdown&#x27; the optimizer performs
automatically (Module 07) -- here you can see why it helps.

The equivalent SQL:

    SELECT e.name
    FROM Employee e JOIN Department d ON e.dept_id = d.dept_id
    WHERE d.dname = &#x27;Sales&#x27; AND e.salary &gt; 50000;

Same result; the optimizer chooses the evaluation order itself.</pre></div></div>

<div class="takeaways"><div class="tk-title">Key takeaways</div><ul><li>Six primitives: &sigma;, &pi;, &cup;, &minus;, &times;, &rho;. Join, intersection and division are derived.</li><li><strong>Closure</strong>: every operator returns a relation, so expressions nest arbitrarily.</li><li>&pi; removes duplicates &mdash; relational algebra is set-based, SQL is bag-based by default.</li><li><strong>Division</strong> answers &ldquo;for every&rdquo;; in SQL it is double-<code>NOT EXISTS</code>.</li><li>TRC variables range over <em>tuples</em>, DRC variables over <em>domain values</em>.</li><li>A calculus formula must be <strong>safe</strong> to guarantee a finite result.</li></ul></div>`,
    quiz: [
      { q: `Why must relational algebra operators always return a relation, never a bare set of values?`, options: ["Because SQL requires it", "So operator outputs can be fed as input to other operators — this \"closure\" property is what allows nested/chained expressions", "Because relations are faster to store than lists", "It is only a convention, not a requirement"], answer: 1, explain: `Closure is the entire point: σ, π, ⋈ etc. take relations and return relations, so you can write arbitrarily deep expressions like π(σ(R ⋈ S)) — exactly like function composition.` },
      { q: `Which single relational algebra query correctly answers "names of students who have taken every course in the Compulsory set"?`, options: ["A join between Student and Compulsory", "Set difference between Student and Compulsory", "Division of the Student-Course enrollment relation by the Compulsory course set", "Union of Student and Compulsory"], answer: 2, explain: `"For every X in set S" is the textbook signature of the division operator ÷ — it returns rows from R that pair with all rows of S.` },
      { q: `In TRC, a formula that is not "safe" is disallowed because:`, options: ["It runs too slowly", "It could define an infinite relation (e.g. from an unrestricted negation)", "It cannot be translated into SQL", "Safety only affects domain calculus, not tuple calculus"], answer: 1, explain: `An expression like {t | ¬(t ∈ R)} ranges over every tuple NOT in R — unbounded and undefined over an infinite domain. Safety restricts quantifiers/negation to range only over existing, finite relations.` },
    ],
    practice: [
      { prompt: `Given <code>Student(sid, sname, dept_id)</code> and <code>Department(dept_id, dname)</code>, write a relational algebra expression for "names of students not in the Computer Science department."`, solution: `π<sub>sname</sub>(σ<sub>dname≠'Computer Science'</sub>(Student ⋈ Department))<br><br>Equivalently via set difference: π<sub>sname</sub>(Student) − π<sub>sname</sub>(σ<sub>dname='Computer Science'</sub>(Student ⋈ Department))<br><br>The first form is simpler and preferred — filter first, then project.` },
      { prompt: `Translate to TRC: "IDs of employees who earn more than their own manager." Assume <code>Employee(emp_id, salary, mgr_id)</code> where <code>mgr_id</code> references another employee's <code>emp_id</code>.`, solution: `{ e.emp_id | e ∈ Employee ∧ ∃ m ∈ Employee ( m.emp_id = e.mgr_id ∧ e.salary > m.salary ) }<br><br>Read it as: for tuple e, there must exist some tuple m in the same relation that is e's manager (m.emp_id = e.mgr_id) and e's salary exceeds m's salary. This is a self-join pattern expressed declaratively — note there's no explicit "join" keyword, the existential quantifier does that work.` },
    ],
  },
  {
    id: "m4",
    unit: "u2",
    num: "04",
    title: "SQL Core — DDL, DML, DCL, Joins",
    syllabus: true,
    meta: "CREATE/INSERT/UPDATE · all join types · GROUP BY/HAVING",
    notes: `
    <div class="starter">
    <div class="defbox"><div class="dlabel">Definition &mdash; in plain English</div><strong>SQL (Structured Query Language)</strong> is the standard language for talking to relational databases. With it you create tables (DDL), read and change data (DML), and control access (DCL). A <strong>join</strong> combines rows from two tables using a matching column &mdash; it is how you reassemble information that good design deliberately split apart.</div>
    <div class="intuitbox"><div class="dlabel">Intuition &mdash; how to think about it</div>SQL reads almost like English: <code>SELECT name FROM students WHERE gpa &gt; 8</code> literally means 'give me the names of students whose GPA is above 8'. The mental picture for a join: you have a Students sheet and a Departments sheet, and each student row carries a dept_id &mdash; a join is you running your finger from that dept_id across to the matching row in the Departments sheet and stapling the two rows together. INNER JOIN keeps only rows that found a partner; LEFT JOIN also keeps left-side rows that found none (filling the gaps with NULL). And remember the logical order the database thinks in: FROM &rarr; WHERE &rarr; GROUP BY &rarr; HAVING &rarr; SELECT &rarr; ORDER BY &mdash; which is why you cannot use a SELECT alias inside WHERE.</div>
    <h3 class="kt-head">Key terms you must know</h3>
    <table class="reftable"><tr><th>Term</th><th>Meaning</th></tr><tr><td><strong>SELECT / FROM / WHERE</strong></td><td>Choose columns / name the table / filter rows.</td></tr><tr><td><strong>INNER JOIN</strong></td><td>Keep only rows that match in both tables.</td></tr><tr><td><strong>LEFT (OUTER) JOIN</strong></td><td>Keep every left-table row; unmatched right side becomes NULL.</td></tr><tr><td><strong>GROUP BY</strong></td><td>Collapse rows into groups so you can aggregate per group (COUNT, SUM, AVG&hellip;).</td></tr><tr><td><strong>HAVING</strong></td><td>A WHERE that runs <em>after</em> grouping &mdash; filters whole groups.</td></tr><tr><td><strong>NULL</strong></td><td>'Value unknown/absent'. It is not 0 and not empty string; test it with IS NULL, never = NULL.</td></tr><tr><td><strong>DISTINCT</strong></td><td>Removes duplicate rows from the result.</td></tr></table>
    </div>

    <p>SQL is the industry-standard, non-procedural realization of relational algebra + calculus: you say what you want, the query optimizer (Module 07) decides how to get it.</p>

    <h3>DDL essentials</h3>
    <div class="codeblock"><span class="k">CREATE TABLE</span> employees (
  emp_id     INT <span class="k">PRIMARY KEY</span>,
  name       VARCHAR(50) <span class="k">NOT NULL</span>,
  dept_id    INT,
  salary     DECIMAL(10,2) <span class="k">CHECK</span> (salary > 0),
  <span class="k">FOREIGN KEY</span> (dept_id) <span class="k">REFERENCES</span> departments(dept_id)
);

<span class="k">ALTER TABLE</span> employees <span class="k">ADD COLUMN</span> hire_date DATE;
<span class="k">DROP TABLE</span> employees;          <span class="c">-- removes structure + data</span>
<span class="k">TRUNCATE TABLE</span> employees;      <span class="c">-- removes data, keeps structure, faster than DELETE, not rollback-able in most engines</span></div>

    <h3>DML essentials</h3>
    <div class="codeblock"><span class="k">INSERT INTO</span> employees (emp_id, name, dept_id, salary)
<span class="k">VALUES</span> (101, <span class="s">'Meera'</span>, 3, 65000);

<span class="k">UPDATE</span> employees <span class="k">SET</span> salary = salary * 1.1 <span class="k">WHERE</span> dept_id = 3;

<span class="k">DELETE FROM</span> employees <span class="k">WHERE</span> emp_id = 101;</div>

    <h3>SELECT anatomy, in logical execution order</h3>
    <p>SQL is <em>written</em> SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY, but it's <em>executed</em> almost the opposite direction:</p>
    <div class="codeblock">FROM  →  WHERE  →  GROUP BY  →  HAVING  →  SELECT  →  ORDER BY</div>
    <p>This is why you can't reference a SELECT alias in WHERE (WHERE runs before SELECT is evaluated) but you can in ORDER BY (runs last).</p>

    <h3>Joins — the full picture</h3>
    <table class="reftable">
      <tr><th>Join</th><th>Keeps</th></tr>
      <tr><td>INNER JOIN</td><td>Only rows with a match on both sides.</td></tr>
      <tr><td>LEFT (OUTER) JOIN</td><td>All left rows; unmatched right columns become NULL.</td></tr>
      <tr><td>RIGHT (OUTER) JOIN</td><td>All right rows; unmatched left columns become NULL.</td></tr>
      <tr><td>FULL (OUTER) JOIN</td><td>All rows from both sides, NULLs where unmatched.</td></tr>
      <tr><td>CROSS JOIN</td><td>Cartesian product — every row × every row, no ON condition.</td></tr>
      <tr><td>SELF JOIN</td><td>A table joined to itself (via aliases) — e.g. employee-to-manager.</td></tr>
    </table>
    <div class="codeblock"><span class="c">-- self join: employee alongside their manager's name</span>
<span class="k">SELECT</span> e.name <span class="k">AS</span> employee, m.name <span class="k">AS</span> manager
<span class="k">FROM</span> employees e
<span class="k">LEFT JOIN</span> employees m <span class="k">ON</span> e.mgr_id = m.emp_id;</div>

    <h3>Aggregates, GROUP BY, HAVING</h3>
    <p><code>COUNT, SUM, AVG, MIN, MAX</code> collapse many rows into one. <code>GROUP BY</code> buckets rows before aggregating. <code>WHERE</code> filters rows <em>before</em> grouping; <code>HAVING</code> filters groups <em>after</em> aggregation — that distinction is the single most-tested SQL concept.</p>
    <div class="codeblock"><span class="k">SELECT</span> dept_id, AVG(salary) <span class="k">AS</span> avg_sal
<span class="k">FROM</span> employees
<span class="k">WHERE</span> hire_date > <span class="s">'2020-01-01'</span>       <span class="c">-- filters rows first</span>
<span class="k">GROUP BY</span> dept_id
<span class="k">HAVING</span> AVG(salary) > 50000        <span class="c">-- filters resulting groups</span>
<span class="k">ORDER BY</span> avg_sal <span class="k">DESC</span>;</div>

    <h3>Set operations</h3>
    <table class="reftable">
      <tr><th>SQL</th><th>Relational algebra equivalent</th></tr>
      <tr><td>UNION / UNION ALL</td><td>∪ (UNION removes duplicates, UNION ALL doesn't)</td></tr>
      <tr><td>INTERSECT</td><td>∩</td></tr>
      <tr><td>MINUS / EXCEPT</td><td>−</td></tr>
    </table>
    <p>All three require the two SELECTs to be <strong>union-compatible</strong>: same number of columns, compatible types, in the same order.</p>

<h3>Worked: logical execution order &mdash; and the two errors it explains</h3><div class="worked"><div class="wtitle">Worked example &mdash; why WHERE and HAVING are not interchangeable</div><div class="codeblock"><pre>SQL is WRITTEN in one order and EXECUTED in another. This single fact
explains most beginner errors.

  WRITTEN                    EXECUTED
  -------                    --------
  SELECT   ...        5      1.  FROM / JOIN     build the working set
  FROM     ...        1      2.  WHERE           filter individual ROWS
  WHERE    ...        2      3.  GROUP BY        collapse rows into groups
  GROUP BY ...        3      4.  HAVING          filter GROUPS
  HAVING   ...        4      5.  SELECT          evaluate expressions, aliases
  ORDER BY ...        6      6.  ORDER BY        sort the final result
  LIMIT    ...        7      7.  LIMIT           truncate

CONSEQUENCE 1 -- you cannot use a SELECT alias in WHERE:
    SELECT salary*12 AS annual FROM emp WHERE annual &gt; 100000;   -- ERROR
    ...because WHERE (step 2) runs before SELECT (step 5) creates &#x27;annual&#x27;.
    SELECT salary*12 AS annual FROM emp ORDER BY annual;         -- WORKS
    ...because ORDER BY (step 6) runs after SELECT.

CONSEQUENCE 2 -- you cannot put an aggregate in WHERE:
    WHERE AVG(salary) &gt; 50000     -- ERROR: no groups exist yet at step 2
    HAVING AVG(salary) &gt; 50000    -- correct: groups exist by step 4</pre></div></div><h3>Worked: join row counts and the NULL trap</h3><div class="worked"><div class="wtitle">Worked example &mdash; counting rows through each join type</div><div class="codeblock"><pre>Join row counts, made concrete.
Employees: 500 rows, 20 of which have dept_id = NULL
Departments: 10 rows, all matched by at least one employee

  INNER JOIN      480 rows   only matching pairs; the 20 NULLs vanish
  LEFT JOIN       500 rows   all employees; dept columns NULL for those 20
  RIGHT JOIN      480 rows   all departments; every dept has a match here
  FULL OUTER      500 rows   union of both sides&#x27; preserved rows
  CROSS JOIN    5,000 rows   500 x 10, no ON condition

THE NULL TRAP -- this silently converts a LEFT JOIN into an INNER JOIN:

    SELECT e.name, d.dept_name
    FROM employees e
    LEFT JOIN departments d ON e.dept_id = d.dept_id
    WHERE d.dept_name = &#x27;Sales&#x27;;        -- &lt;-- kills the outer join

    The 20 unmatched rows have d.dept_name = NULL, and
    NULL = &#x27;Sales&#x27; is UNKNOWN, not TRUE, so WHERE discards them.
    Fix: put the condition in the ON clause, or test
    WHERE d.dept_name = &#x27;Sales&#x27; OR d.dept_name IS NULL.</pre></div></div>

<h3>Worked: GROUP BY and HAVING, step by step</h3><div class="worked"><div class="wtitle">Worked example &mdash; with the NULL rules that get tested</div><div class="codeblock"><pre>GROUP BY, HAVING and the aggregate rules, on real numbers.

    Employee
    eid  name   dept  salary
    1    Ann    10    90000
    2    Bob    10    60000
    3    Cara   20    75000
    4    Dev    20    45000
    5    Esha   30    50000

    SELECT dept, COUNT(*) AS n, AVG(salary) AS avg_sal
    FROM Employee
    GROUP BY dept
    HAVING COUNT(*) &gt; 1;

  Step 1 FROM      all 5 rows
  Step 2 WHERE     (none) -&gt; still 5 rows
  Step 3 GROUP BY  dept 10 -&gt; {Ann, Bob}
                   dept 20 -&gt; {Cara, Dev}
                   dept 30 -&gt; {Esha}
  Step 4 HAVING    COUNT(*) &gt; 1 keeps dept 10 and 20, DROPS dept 30
  Step 5 SELECT    compute COUNT and AVG per surviving group

    dept  n  avg_sal
    10    2  75000
    20    2  60000

THE GOLDEN RULE: every column in SELECT must be either
  (a) named in GROUP BY, or
  (b) wrapped in an aggregate function.

    SELECT dept, name, AVG(salary) FROM Employee GROUP BY dept;
                  ^^^^ ERROR -- which of the two names in dept 10?

NULL BEHAVIOUR, which is tested constantly:
    COUNT(*)        counts ROWS, including those with NULLs
    COUNT(col)      counts NON-NULL values only
    AVG/SUM/MIN/MAX ignore NULLs entirely
    GROUP BY        treats all NULLs as ONE group

    With salaries {90000, NULL, 60000}:
        COUNT(*) = 3,  COUNT(salary) = 2,  AVG(salary) = 75000
    -- note AVG divides by 2, not 3. A NULL is not a zero.</pre></div></div>

<div class="takeaways"><div class="tk-title">Key takeaways</div><ul><li>Execution order is <strong>FROM &rarr; WHERE &rarr; GROUP BY &rarr; HAVING &rarr; SELECT &rarr; ORDER BY</strong>.</li><li><code>WHERE</code> filters rows before grouping; <code>HAVING</code> filters groups after.</li><li>SELECT aliases are usable in <code>ORDER BY</code> but not in <code>WHERE</code>.</li><li>A <code>WHERE</code> condition on the right table of a LEFT JOIN silently makes it an INNER JOIN.</li><li>Comparisons with NULL yield UNKNOWN &mdash; use <code>IS NULL</code>, never <code>= NULL</code>.</li><li><code>UNION</code> deduplicates (costly); <code>UNION ALL</code> just concatenates.</li></ul></div>`,
    quiz: [
      { q: `Why does <span class="inline-code">WHERE AVG(salary) > 50000</span> throw an error while <span class="inline-code">HAVING AVG(salary) > 50000</span> works?`, options: ["WHERE only accepts string comparisons", "WHERE is evaluated before grouping/aggregation happens, so aggregate values don't exist yet", "HAVING is faster so it's always preferred", "There is no real difference, it's a style choice"], answer: 1, explain: `Logical execution order is FROM→WHERE→GROUP BY→HAVING→SELECT. WHERE filters raw rows before any grouping exists, so an aggregate function has nothing to operate on yet. HAVING runs after grouping, when aggregates are computed.` },
      { q: `A LEFT JOIN between Employees (500 rows) and Departments (10 rows) on dept_id, where 20 employees have a NULL/unmatched dept_id, will return:`, options: ["480 rows", "500 rows, with department columns NULL for the 20 unmatched", "520 rows", "10 rows, one per department"], answer: 1, explain: `LEFT JOIN preserves every row from the left table regardless of match; unmatched right-side columns simply come back as NULL. Row count from the left table is preserved (assuming dept_id is unique in Departments).` },
      { q: `UNION and UNION ALL differ in that:`, options: ["UNION ALL requires fewer columns", "UNION removes duplicate rows across the two result sets, UNION ALL keeps them", "UNION is only valid for numeric columns", "UNION ALL sorts the result, UNION does not"], answer: 1, explain: `Both need union-compatible SELECTs, but UNION performs an implicit dedup pass (costlier), UNION ALL just concatenates results.` },
    ],
    practice: [
      { prompt: `Given <code>Orders(order_id, customer_id, amount, order_date)</code>, write a query for "customers with more than 3 orders and total spend over 10,000, ordered by total spend descending."`, solution: `<div class="codeblock"><span class="k">SELECT</span> customer_id,
       COUNT(*) <span class="k">AS</span> order_count,
       SUM(amount) <span class="k">AS</span> total_spend
<span class="k">FROM</span> Orders
<span class="k">GROUP BY</span> customer_id
<span class="k">HAVING</span> COUNT(*) > 3 <span class="k">AND</span> SUM(amount) > 10000
<span class="k">ORDER BY</span> total_spend <span class="k">DESC</span>;</div>Both conditions belong in HAVING because both depend on aggregated (grouped) values — neither exists at the raw-row stage where WHERE operates.` },
      { prompt: `Write a query returning every department, including departments that currently have zero employees, along with their employee count.`, solution: `<div class="codeblock"><span class="k">SELECT</span> d.dept_name, COUNT(e.emp_id) <span class="k">AS</span> emp_count
<span class="k">FROM</span> Departments d
<span class="k">LEFT JOIN</span> Employees e <span class="k">ON</span> d.dept_id = e.dept_id
<span class="k">GROUP BY</span> d.dept_name;</div>An INNER JOIN would silently drop empty departments since they'd have no matching Employee rows. LEFT JOIN from Departments keeps them, and <code>COUNT(e.emp_id)</code> (not <code>COUNT(*)</code>) correctly reports 0 rather than counting a phantom NULL row.` },
    ],
  },
  {
    id: "m5",
    unit: "u2",
    num: "05",
    title: "Advanced SQL — Subqueries, Views, Triggers, Embedded/Dynamic SQL",
    syllabus: true,
    meta: "Correlated subqueries · updatable views · trigger timing · SQLCA/cursors",
    notes: `
    <div class="starter">
    <div class="defbox"><div class="dlabel">Definition &mdash; in plain English</div><strong>Advanced SQL</strong> is the toolbox beyond single queries: a <strong>subquery</strong> is a query nested inside another; a <strong>view</strong> is a saved query that behaves like a virtual table; a <strong>trigger</strong> is code the database runs automatically when data changes; <strong>embedded/dynamic SQL</strong> is how ordinary programs (C, Java&hellip;) send SQL at run time.</div>
    <div class="intuitbox"><div class="dlabel">Intuition &mdash; how to think about it</div>A subquery is a <strong>question inside a question</strong>: 'find employees paid more than <em>the average salary</em>' &mdash; the inner question computes the average, the outer one uses it. The one distinction that matters: an <em>uncorrelated</em> subquery runs once (like looking up one fact and reusing it), while a <em>correlated</em> subquery re-runs for every outer row (like re-checking a fact for each person &mdash; powerful but potentially slow). A view is a <strong>saved camera angle</strong> on your data &mdash; the data isn't copied, you just always look at it from that angle. A trigger is a <strong>tripwire</strong>: 'whenever anyone inserts a row here, automatically do this.'</div>
    <h3 class="kt-head">Key terms you must know</h3>
    <table class="reftable"><tr><th>Term</th><th>Meaning</th></tr><tr><td><strong>Subquery</strong></td><td>A SELECT nested inside another statement.</td></tr><tr><td><strong>Correlated subquery</strong></td><td>Inner query references the outer row, so it re-executes per row.</td></tr><tr><td><strong>View</strong></td><td>A named, stored query used like a table; virtual by default.</td></tr><tr><td><strong>Materialized view</strong></td><td>A view whose result is physically stored (and must be refreshed).</td></tr><tr><td><strong>Trigger</strong></td><td>Stored code fired automatically BEFORE/AFTER INSERT, UPDATE or DELETE.</td></tr><tr><td><strong>Cursor</strong></td><td>A pointer that lets a host program walk through query results row by row.</td></tr><tr><td><strong>Embedded SQL</strong></td><td>SQL written inside a host language, precompiled.</td></tr><tr><td><strong>Dynamic SQL</strong></td><td>SQL built as a string and executed at run time.</td></tr></table>
    </div>

    <h3>Subqueries</h3>
    <ul>
      <li><strong>Scalar subquery</strong> — returns exactly one value, usable anywhere an expression is expected.</li>
      <li><strong>Nested (uncorrelated) subquery</strong> — inner query runs once, independent of the outer query.</li>
      <li><strong>Correlated subquery</strong> — inner query references a column from the outer query, so it conceptually re-runs once per outer row.</li>
    </ul>
    <div class="codeblock"><span class="c">-- uncorrelated: runs the inner SELECT once</span>
<span class="k">SELECT</span> name <span class="k">FROM</span> Employees
<span class="k">WHERE</span> salary > (<span class="k">SELECT</span> AVG(salary) <span class="k">FROM</span> Employees);

<span class="c">-- correlated: inner query depends on outer row 'e'</span>
<span class="k">SELECT</span> e.name <span class="k">FROM</span> Employees e
<span class="k">WHERE</span> e.salary > (
  <span class="k">SELECT</span> AVG(salary) <span class="k">FROM</span> Employees
  <span class="k">WHERE</span> dept_id = e.dept_id     <span class="c">-- refers to outer 'e'</span>
);  <span class="c">-- "earns more than their own department's average"</span></div>
    <table class="reftable">
      <tr><th>Operator</th><th>Use</th></tr>
      <tr><td>IN / NOT IN</td><td>Value matches any/none in the subquery's result list.</td></tr>
      <tr><td>EXISTS / NOT EXISTS</td><td>True if the subquery returns at least one row — usually paired with correlation, often faster than IN on large sets.</td></tr>
      <tr><td>ANY / SOME</td><td>True if comparison holds against at least one returned value.</td></tr>
      <tr><td>ALL</td><td>True if comparison holds against every returned value.</td></tr>
    </table>

    <h3>Views</h3>
    <p>A view is a stored query presented as if it were a table — it has no data of its own (unless materialized).</p>
    <div class="codeblock"><span class="k">CREATE VIEW</span> high_earners <span class="k">AS</span>
<span class="k">SELECT</span> emp_id, name, salary <span class="k">FROM</span> Employees <span class="k">WHERE</span> salary > 80000;</div>
    <ul>
      <li>A view is <strong>updatable</strong> only if it maps unambiguously back to one base table's rows — no aggregates, no GROUP BY, no DISTINCT, no joins across multiple tables (engine-dependent specifics vary).</li>
      <li>A <strong>materialized view</strong> physically stores its result and needs periodic/triggered refresh — trades staleness for read speed.</li>
      <li>Views are a first-class <strong>security mechanism</strong> (see Module 09): expose only permitted rows/columns without granting access to the base table.</li>
    </ul>

    <h3>Triggers</h3>
    <p>Procedural code the DBMS fires automatically in response to a DML event.</p>
    <table class="reftable">
      <tr><th>Axis</th><th>Options</th></tr>
      <tr><td>Timing</td><td>BEFORE / AFTER / INSTEAD OF (the last mainly for views)</td></tr>
      <tr><td>Event</td><td>INSERT / UPDATE / DELETE</td></tr>
      <tr><td>Granularity</td><td>Row-level (fires once per affected row) vs statement-level (fires once per statement)</td></tr>
    </table>
    <div class="codeblock"><span class="k">CREATE TRIGGER</span> audit_salary_change
<span class="k">AFTER UPDATE</span> <span class="k">OF</span> salary <span class="k">ON</span> Employees
<span class="k">FOR EACH ROW</span>
<span class="k">BEGIN</span>
  <span class="k">INSERT INTO</span> SalaryAudit (emp_id, old_sal, new_sal, changed_at)
  <span class="k">VALUES</span> (:OLD.emp_id, :OLD.salary, :NEW.salary, NOW());
<span class="k">END</span>;</div>
    <div class="callout"><div class="ctitle">Caution</div>Triggers are invisible business logic — powerful but a debugging trap. An UPDATE that "mysteriously" cascades into other tables is almost always a trigger. Use them for auditing/integrity, not core application logic.</div>

    <h3>Embedded SQL vs Dynamic SQL</h3>
    <ul>
      <li><strong>Embedded SQL</strong> — SQL statements written directly inside a host language (C, Java via JDBC-like precompilers), prefixed <code>EXEC SQL</code>, resolved at compile time. Uses a <strong>cursor</strong> to step through multi-row results one at a time, and an <strong>SQLCA (SQL Communication Area)</strong> to report status/error codes back to the host program after each statement.</li>
      <li><strong>Dynamic SQL</strong> — the SQL text itself is built and decided at run time (e.g. a search form generating a WHERE clause based on which filters the user picked). More flexible, harder to optimize ahead of time, and the classic vector for SQL injection if built by string concatenation instead of parameterized queries.</li>
    </ul>

<h3>Worked: correlated vs uncorrelated subqueries</h3><div class="worked"><div class="wtitle">Worked example &mdash; and how optimizers decorrelate them</div><div class="codeblock"><pre>CORRELATED vs UNCORRELATED subqueries -- and why it matters for cost.

UNCORRELATED: the inner query is independent, evaluated ONCE.

    SELECT name FROM employees
    WHERE salary &gt; (SELECT AVG(salary) FROM employees);
                    ^ no reference to the outer query

CORRELATED: the inner query references the outer row, so conceptually
it re-runs PER OUTER ROW.

    SELECT e.name FROM employees e
    WHERE e.salary &gt; (SELECT AVG(s.salary) FROM employees s
                      WHERE s.dept_id = e.dept_id);
                                          ^^^^^^^^ outer reference

    -- &quot;employees earning above their own department&#x27;s average&quot;
    -- 500 employees =&gt; conceptually 500 inner executions

Modern optimizers frequently DECORRELATE this into a single join
against a grouped derived table, which is what you would write by hand:

    SELECT e.name
    FROM employees e
    JOIN (SELECT dept_id, AVG(salary) AS avg_sal
          FROM employees GROUP BY dept_id) d
      ON e.dept_id = d.dept_id
    WHERE e.salary &gt; d.avg_sal;

EXISTS vs IN vs JOIN
    EXISTS  stops at the first match -- best for &quot;does any row exist?&quot;
    IN      fine for small, static lists
    NOT IN  DANGEROUS: if the subquery returns even one NULL, the whole
            predicate becomes UNKNOWN and the query returns ZERO rows.
            Use NOT EXISTS instead -- it is null-safe.</pre></div></div><h3>Worked: window functions</h3><div class="worked"><div class="wtitle">Worked example &mdash; ranking without collapsing rows</div><div class="codeblock"><pre>WINDOW FUNCTIONS -- aggregate without collapsing rows.

GROUP BY collapses; a window function keeps every row and adds a
computed column alongside it.

    SELECT name, dept_id, salary,
           AVG(salary)  OVER (PARTITION BY dept_id)            AS dept_avg,
           RANK()       OVER (PARTITION BY dept_id
                              ORDER BY salary DESC)            AS rank_in_dept,
           salary - LAG(salary) OVER (ORDER BY hire_date)      AS diff_from_prev
    FROM employees;

  name    dept  salary   dept_avg  rank_in_dept
  Ann      3     90000     70000        1
  Bob      3     70000     70000        2
  Cara     3     50000     70000        3

  -- every original row survives; the aggregate rides alongside

RANK vs DENSE_RANK vs ROW_NUMBER, on salaries 90, 70, 70, 50:
    ROW_NUMBER   1, 2, 3, 4     always distinct, ties broken arbitrarily
    RANK         1, 2, 2, 4     ties share, then SKIPS
    DENSE_RANK   1, 2, 2, 3     ties share, no gap

&quot;Top 3 earners per department&quot; is the canonical use:

    SELECT * FROM (
      SELECT name, dept_id, salary,
             DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) r
      FROM employees) t
    WHERE r &lt;= 3;</pre></div></div><h3>Worked: CTEs and recursive queries</h3><div class="worked"><div class="wtitle">Worked example &mdash; walking a hierarchy</div><div class="codeblock"><pre>COMMON TABLE EXPRESSIONS and RECURSION.

A CTE names a subquery, making complex SQL readable:

    WITH dept_avg AS (
      SELECT dept_id, AVG(salary) AS avg_sal
      FROM employees GROUP BY dept_id
    )
    SELECT e.name FROM employees e
    JOIN dept_avg d ON e.dept_id = d.dept_id
    WHERE e.salary &gt; d.avg_sal;

RECURSIVE CTEs walk hierarchies -- the org chart, bill of materials,
graph traversal. Two parts joined by UNION ALL:

    WITH RECURSIVE chain AS (
      -- anchor: where to start
      SELECT emp_id, name, mgr_id, 1 AS depth
      FROM employees WHERE emp_id = 101

      UNION ALL

      -- recursive step: joins the CTE back to the base table
      SELECT e.emp_id, e.name, e.mgr_id, c.depth + 1
      FROM employees e
      JOIN chain c ON e.mgr_id = c.emp_id
    )
    SELECT * FROM chain;

    -- returns employee 101, then everyone reporting to them,
    -- then everyone reporting to THOSE people, and so on until
    -- the recursive step produces no new rows.

ALWAYS bound the recursion (AND depth &lt; 10) when the data might
contain a cycle, or the query will not terminate.</pre></div></div>

<div class="takeaways"><div class="tk-title">Key takeaways</div><ul><li>A <strong>correlated</strong> subquery references the outer row and conceptually re-runs per row.</li><li><code>NOT IN</code> with any NULL in the subquery returns <em>zero rows</em> &mdash; use <code>NOT EXISTS</code>.</li><li>Window functions aggregate <em>without</em> collapsing rows; <code>GROUP BY</code> collapses.</li><li><code>RANK</code> skips after ties, <code>DENSE_RANK</code> does not, <code>ROW_NUMBER</code> never ties.</li><li>A <strong>recursive CTE</strong> = anchor query <code>UNION ALL</code> a step that joins back to itself.</li><li>A view is a stored query; a <strong>materialized view</strong> stores the <em>result</em> and needs refreshing.</li></ul></div>`,
    quiz: [
      { q: `A correlated subquery is distinct from an uncorrelated one because:`, options: ["It always returns more rows", "It references a column from the outer query, conceptually re-evaluating per outer row", "It cannot use aggregate functions", "It must appear in the FROM clause"], answer: 1, explain: `The defining trait is the reference back to the outer query's current row — that dependency is exactly what makes it "correlated."` },
      { q: `Which is generally true of view updatability?`, options: ["All views are updatable by default", "A view built with GROUP BY and aggregate functions is not meaningfully updatable, since individual base rows can't be recovered from an aggregated row", "Materialized views are always updatable", "Updatability has nothing to do with how the view is defined"], answer: 1, explain: `If a view row is the SUM of five base rows, there is no well-defined way to push an UPDATE on that summed value back down into the five originals — hence not updatable.` },
      { q: `The main risk with Dynamic SQL that doesn't apply the same way to Embedded (static) SQL is:`, options: ["Slower disk I/O", "SQL injection, when query text is built via string concatenation of user input", "Inability to use JOINs", "Requirement for a DBA to approve each query"], answer: 1, explain: `Because dynamic SQL text is assembled at runtime, unsanitized user input can alter the query's logic if concatenated directly rather than passed as bound parameters.` },
    ],
    practice: [
      { prompt: `Write a query using EXISTS to find all customers who have placed at least one order over 5000 — and explain in one line why EXISTS often outperforms IN here.`, solution: `<div class="codeblock"><span class="k">SELECT</span> c.customer_id, c.name
<span class="k">FROM</span> Customers c
<span class="k">WHERE EXISTS</span> (
  <span class="k">SELECT</span> 1 <span class="k">FROM</span> Orders o
  <span class="k">WHERE</span> o.customer_id = c.customer_id <span class="k">AND</span> o.amount > 5000
);</div>EXISTS can short-circuit — it stops scanning as soon as one matching row is found — while IN typically has to materialize the full subquery result set first (though modern optimizers often rewrite one into the other; the conceptual difference is still worth knowing).` },
      { prompt: `Design a BEFORE INSERT trigger on an <code>Orders</code> table that prevents inserting an order with a negative <code>amount</code>.`, solution: `<div class="codeblock"><span class="k">CREATE TRIGGER</span> prevent_negative_amount
<span class="k">BEFORE INSERT ON</span> Orders
<span class="k">FOR EACH ROW</span>
<span class="k">BEGIN</span>
  <span class="k">IF</span> :NEW.amount < 0 <span class="k">THEN</span>
    RAISE_ERROR(<span class="s">'Order amount cannot be negative'</span>);
  <span class="k">END IF</span>;
<span class="k">END</span>;</div>BEFORE (not AFTER) matters here — you need to intercept and reject the row before it's actually written, not audit it after the fact. A CHECK constraint would be the simpler, declarative way to do this same thing in practice; the trigger is shown for the pattern.` },
    ],
  },
  {
    id: "m6",
    unit: "u2",
    num: "06",
    title: "Integrity Constraints & Domain Relational Calculus",
    syllabus: true,
    meta: "Constraint types · assertions · DRC · QUEL",
    notes: `
    <div class="starter">
    <div class="defbox"><div class="dlabel">Definition &mdash; in plain English</div><strong>Integrity constraints</strong> are the rules a database enforces automatically so bad data can never get in: values must come from the right domain, primary keys can't be NULL or repeat, and foreign keys must point at rows that actually exist. <strong>Domain relational calculus (DRC)</strong> is a formal query notation where variables stand for individual column values.</div>
    <div class="intuitbox"><div class="dlabel">Intuition &mdash; how to think about it</div>Constraints are the <strong>bouncers at the door</strong> of your database. You state the rules once &mdash; 'GPA must be between 0 and 10', 'every enrollment must refer to a real student' &mdash; and the DBMS enforces them on every insert and update, no matter which application (or careless intern) tries the write. This is far safer than trusting every program to check: programs forget; the bouncer never does. Referential integrity is simply 'no pointing at ghosts': a foreign key may not reference a row that isn't there, and the ON DELETE rules (CASCADE / SET NULL / RESTRICT) decide what happens to the pointers when the target row is removed.</div>
    <h3 class="kt-head">Key terms you must know</h3>
    <table class="reftable"><tr><th>Term</th><th>Meaning</th></tr><tr><td><strong>Domain constraint</strong></td><td>Value must belong to the column's declared type/range.</td></tr><tr><td><strong>Entity integrity</strong></td><td>Primary key: never NULL, always unique.</td></tr><tr><td><strong>Referential integrity</strong></td><td>A foreign key must match an existing primary key (or be NULL).</td></tr><tr><td><strong>CHECK</strong></td><td>A custom row-level rule, e.g. CHECK (gpa BETWEEN 0 AND 10).</td></tr><tr><td><strong>Assertion</strong></td><td>A CHECK-like rule over the whole database, not just one row.</td></tr><tr><td><strong>ON DELETE CASCADE</strong></td><td>Deleting a parent row automatically deletes rows referencing it.</td></tr><tr><td><strong>DRC</strong></td><td>Query formalism whose variables range over column values (vs tuples in TRC).</td></tr></table>
    </div>

    <h3>Integrity constraints</h3>
    <table class="reftable">
      <tr><th>Constraint</th><th>Enforces</th></tr>
      <tr><td>Domain constraint</td><td>A column's value must come from its declared type/domain (e.g. INT, or a CHECK-bounded range).</td></tr>
      <tr><td>Entity integrity</td><td>Primary key columns can never be NULL and must be unique.</td></tr>
      <tr><td>Referential integrity</td><td>A foreign key value must either be NULL or match an existing primary key value in the referenced table.</td></tr>
      <tr><td>Key constraint</td><td>Uniqueness on a candidate key (UNIQUE), possibly more than one per table.</td></tr>
    </table>
    <p>Referential integrity violations on delete/update are handled by <strong>referential actions</strong>:</p>
    <ul>
      <li><code>CASCADE</code> — propagate the delete/update to matching child rows.</li>
      <li><code>SET NULL</code> — set the child's FK to NULL.</li>
      <li><code>RESTRICT</code> / <code>NO ACTION</code> — reject the operation if children exist.</li>
    </ul>

    <h3>Assertions</h3>
    <p>A <code>CHECK</code> constraint validates a condition on a single row of a single table. An <strong>assertion</strong> is a stronger, standalone integrity rule that can span multiple tables — e.g. "total loan amount across all branches cannot exceed total deposits." Assertions are checked on every relevant update, which makes them expensive and rarely implemented fully by real engines (most push the same logic into triggers instead).</p>
    <div class="codeblock"><span class="k">CREATE ASSERTION</span> total_balance_check
<span class="k">CHECK</span> (
  (<span class="k">SELECT</span> SUM(loan_amt) <span class="k">FROM</span> Loans) <=
  (<span class="k">SELECT</span> SUM(deposit_amt) <span class="k">FROM</span> Deposits)
);</div>

    <h3>Domain Relational Calculus (DRC)</h3>
    <p>Like TRC, but variables range over single <strong>domain values</strong> (individual attribute values) rather than whole tuples. General form:</p>
    <div class="codeblock">{ &lt;x₁, x₂, ..., xₙ&gt; | P(x₁, x₂, ..., xₙ) }</div>
    <div class="callout"><div class="ctitle">Worked example</div>
    "Names of employees earning over 50000" — Employee(name, salary):<br><br>
    { &lt;n&gt; | ∃ s ( &lt;n, s&gt; ∈ Employee ∧ s > 50000 ) }</div>
    <p>DRC underlies <strong>QBE (Query-by-Example)</strong>, a table-skeleton visual query language built on this domain-variable idea.</p>

    <h3>QUEL (historical context)</h3>
    <p>QUEL was the query language of the INGRES project (UC Berkeley, 1970s) — SQL's major early rival, based more directly on tuple relational calculus with a <code>RANGE OF ... IS ...</code> declaration followed by <code>RETRIEVE</code>/<code>APPEND</code>/<code>REPLACE</code>/<code>DELETE</code> commands instead of SELECT/INSERT/UPDATE/DELETE. It largely lost out to SQL commercially once SQL became the ANSI/ISO standard, but it's worth knowing as the road not taken — a cleaner calculus-based syntax that never reached SQL's ubiquity.</p>

<h3>Worked: referential actions and when to choose each</h3><div class="worked"><div class="wtitle">Worked example &mdash; what CASCADE actually does</div><div class="codeblock"><pre>REFERENTIAL ACTIONS -- what happens to children when the parent changes.

    Department(dept_id PK, name)
    Employee(emp_id PK, name, dept_id FK -&gt; Department)

    Employee rows: (1,&#x27;Ann&#x27;,10) (2,&#x27;Bob&#x27;,10) (3,&#x27;Cara&#x27;,20)

DELETE FROM Department WHERE dept_id = 10;

  ON DELETE action      Result on Employee rows 1 and 2
  --------------------  ----------------------------------------------
  NO ACTION / RESTRICT  DELETE REJECTED -- children still reference 10
                        (RESTRICT checks immediately; NO ACTION defers
                         to end of statement, otherwise identical here)
  CASCADE               Rows 1 and 2 are DELETED too
  SET NULL              dept_id becomes NULL for rows 1 and 2
                        (fails if the column is declared NOT NULL)
  SET DEFAULT           dept_id becomes its DEFAULT value
                        (that default must itself exist in Department)

Choosing correctly:
  CASCADE   when the child cannot exist alone -- OrderLine under Order,
            Dependent under Employee. Deleting the parent is meaningful.
  RESTRICT  when accidental parent deletion must be prevented -- the
            safest default for reference/lookup tables.
  SET NULL  when the relationship is optional -- an employee can be
            temporarily unassigned to a department.

THE CONSTRAINT HIERARCHY
  Domain      -- value must be from a declared type/range   (CHECK, data type)
  Entity      -- primary key unique and NOT NULL
  Referential -- foreign key matches an existing parent, or is NULL
  User-defined-- arbitrary business rules  (CHECK, assertions, triggers)</pre></div></div><h3>Worked: the same query in TRC and DRC</h3><div class="worked"><div class="wtitle">Worked example &mdash; tuple variables vs domain variables</div><div class="codeblock"><pre>DRC vs TRC -- the same query in both calculi.

Query: names of employees in the &#x27;Sales&#x27; department.

TUPLE relational calculus -- variables range over WHOLE TUPLES:

    { t.name | Employee(t) AND
               EXISTS d ( Department(d) AND
                          d.dept_id = t.dept_id AND
                          d.dname   = &#x27;Sales&#x27; ) }

DOMAIN relational calculus -- variables range over INDIVIDUAL VALUES,
one per column position:

    { n | EXISTS i, dno ( Employee(i, n, dno) AND
                          EXISTS dn ( Department(dno, dn) AND
                                      dn = &#x27;Sales&#x27; ) ) }

The distinction, stated once: in TRC you write t.name to reach into a
tuple; in DRC every attribute is already its own bound variable, so
Employee(i, n, dno) means &quot;there is an Employee row whose three columns
are i, n and dno&quot;. QBE is the practical language built on DRC.

SAFETY -- why unrestricted negation is banned in both:

    { t | NOT Employee(t) }

This denotes every tuple in the universe that is not in Employee --
infinite, and impossible to compute. A SAFE formula constrains every
variable to range over an existing relation, so the answer is always
a finite subset of the database. Both calculi are equivalent in
expressive power to relational algebra ONLY when restricted to safe
formulas.</pre></div></div><div class="callout"><div class="ctitle">CHECK vs assertion vs trigger</div>A <code>CHECK</code> is evaluated per row within one table. An <strong>assertion</strong> is schema-level and may span tables &mdash; powerful, but so expensive that most engines (including PostgreSQL and MySQL) never implemented it. A <strong>trigger</strong> is the practical substitute: procedural code fired on insert/update/delete, able to enforce anything, at the cost of hiding logic outside the schema.</div>

<div class="takeaways"><div class="tk-title">Key takeaways</div><ul><li>Four constraint classes: <strong>domain</strong>, <strong>entity</strong>, <strong>referential</strong>, user-defined.</li><li>Referential actions: CASCADE, SET NULL, SET DEFAULT, RESTRICT/NO ACTION.</li><li>CASCADE when the child cannot exist alone; RESTRICT as the safe default for lookup tables.</li><li>A foreign key may be NULL &mdash; that means &ldquo;no relationship&rdquo;, not a violation.</li><li><strong>TRC</strong> variables range over tuples; <strong>DRC</strong> variables over single domain values.</li><li>Only <strong>safe</strong> formulas guarantee a finite result &mdash; unrestricted negation is banned.</li></ul></div>`,
    quiz: [
      { q: `A foreign key referencing a deleted parent row would violate referential integrity. Which referential action would automatically delete the dependent child rows too?`, options: ["SET NULL", "RESTRICT", "CASCADE", "NO ACTION"], answer: 2, explain: `CASCADE propagates the delete down to matching child rows automatically. SET NULL would keep the child rows but null out the FK; RESTRICT/NO ACTION would block the delete entirely while children exist.` },
      { q: `What distinguishes an assertion from a CHECK constraint?`, options: ["Assertions can only be numeric", "A CHECK is scoped to a single table's row; an assertion can enforce a condition spanning multiple tables", "CHECK constraints run faster in all engines", "There is no real difference"], answer: 1, explain: `CHECK is row/table-local. Assertions are standalone, can reference multiple tables, and must be re-verified on any update that could affect the condition — which is why they're expensive and rarely fully supported.` },
      { q: `In Domain Relational Calculus, the variables in the tuple range over:`, options: ["Whole tuples of a relation", "Individual domain (attribute) values", "Only primary key columns", "Relation names"], answer: 1, explain: `That is the defining difference from TRC: DRC variables are bound to single values from a domain, not entire tuples.` },
    ],
    practice: [
      { prompt: `Write a table definition demonstrating all four integrity constraint types (domain, entity, referential, key/unique) in one CREATE TABLE for an <code>Enrollment(student_id, course_id, grade)</code> table.`, solution: `<div class="codeblock"><span class="k">CREATE TABLE</span> Enrollment (
  student_id  INT <span class="k">NOT NULL</span>,                          <span class="c">-- domain: must be INT</span>
  course_id   INT <span class="k">NOT NULL</span>,
  grade       CHAR(1) <span class="k">CHECK</span> (grade <span class="k">IN</span> (<span class="s">'A'</span>,<span class="s">'B'</span>,<span class="s">'C'</span>,<span class="s">'D'</span>,<span class="s">'F'</span>)),  <span class="c">-- domain constraint</span>
  <span class="k">PRIMARY KEY</span> (student_id, course_id),               <span class="c">-- entity integrity</span>
  <span class="k">UNIQUE</span> (student_id, course_id),                    <span class="c">-- key constraint (redundant w/ PK here, shown for illustration)</span>
  <span class="k">FOREIGN KEY</span> (student_id) <span class="k">REFERENCES</span> Student(student_id)
    <span class="k">ON DELETE CASCADE</span>,                              <span class="c">-- referential integrity + action</span>
  <span class="k">FOREIGN KEY</span> (course_id) <span class="k">REFERENCES</span> Course(course_id)
    <span class="k">ON DELETE RESTRICT</span>
);</div>` },
      { prompt: `Translate to DRC: "IDs of students enrolled in course 'CS101'" given Enrollment(student_id, course_id).`, solution: `{ &lt;s&gt; | ∃ c ( &lt;s, c&gt; ∈ Enrollment ∧ c = <span class="inline-code">'CS101'</span> ) }<br><br>Each domain variable (s for student_id, c for course_id) is bound individually — contrast with TRC where a single tuple variable <code>t</code> would carry the whole row and you'd write <code>t.course_id = 'CS101'</code>.` },
    ],
  },
  {
    id: "m7",
    unit: "u2",
    num: "07",
    title: "Query Processing & Optimization",
    syllabus: true,
    meta: "Parsing → optimization → execution · join algorithms · heuristics",
    notes: `
    <div class="starter">
    <div class="defbox"><div class="dlabel">Definition &mdash; in plain English</div><strong>Query processing</strong> is everything the database does between receiving your SQL and returning rows: parse it, translate it to relational algebra, let the <strong>optimizer</strong> pick the cheapest execution plan, then run that plan. The optimizer's job is crucial because the same query can often be answered a thousand different ways with wildly different costs.</div>
    <div class="intuitbox"><div class="dlabel">Intuition &mdash; how to think about it</div>You give the database a destination, not a route &mdash; the optimizer is the <strong>GPS</strong>. 'Get me all Delhi customers who ordered last week' can be driven many ways: scan every order then check the city, or use an index to jump straight to Delhi customers first. The GPS estimates the traffic (row counts, index availability) and picks a route. Two rules of thumb explain most of optimization: <em>filter early</em> (push selections down so you carry fewer rows into expensive joins) and <em>choose the right join algorithm</em> (nested-loop for tiny tables, hash join for big unsorted ones, merge join when both sides are already sorted).</div>
    <h3 class="kt-head">Key terms you must know</h3>
    <table class="reftable"><tr><th>Term</th><th>Meaning</th></tr><tr><td><strong>Parser</strong></td><td>Checks syntax and builds a parse tree from your SQL.</td></tr><tr><td><strong>Logical plan</strong></td><td>The query as a relational-algebra expression.</td></tr><tr><td><strong>Physical plan</strong></td><td>The actual algorithms chosen (which index, which join method).</td></tr><tr><td><strong>Cost-based optimization</strong></td><td>Estimating each plan's cost from table statistics and picking the cheapest.</td></tr><tr><td><strong>Heuristic optimization</strong></td><td>Rule-of-thumb rewrites: push selections/projections down, do restrictive joins first.</td></tr><tr><td><strong>Nested-loop join</strong></td><td>For each row of one table, scan the other. Simple; fine when one side is small.</td></tr><tr><td><strong>Hash join</strong></td><td>Build a hash table on the smaller input, probe with the larger. Great for big equi-joins.</td></tr><tr><td><strong>Merge join</strong></td><td>Sort (or use sorted) inputs and zip them together.</td></tr></table>
    </div>

    <h3>The query processing pipeline</h3>
    <div class="codeblock">SQL query
   ↓  parser + scanner (syntax check, build parse tree)
Parse tree
   ↓  translator (to relational algebra expression)
Logical query plan (algebra expression)
   ↓  query optimizer (rewrite + cost estimation, pick access paths)
Physical query plan (concrete algorithm choices, execution order)
   ↓  execution engine
Result</div>

    <h3>Why optimize?</h3>
    <p>The same SQL query can be evaluated by many different, logically-equivalent relational algebra expressions — and their <strong>costs</strong> (disk I/O, mainly, since disk access dwarfs CPU cost) can differ by orders of magnitude. The optimizer's job is to find a low-cost physical plan without exhaustively trying all of them (the search space is huge).</p>

    <h3>Heuristic (rule-based) optimization</h3>
    <p>Rewrite the algebra tree using rules that are "almost always" beneficial, before even estimating costs:</p>
    <ul>
      <li><strong>Predicate/selection pushdown</strong> — apply σ as early as possible (right after the base relations), shrinking intermediate results before expensive joins.</li>
      <li><strong>Projection pushdown</strong> — apply π early too, dropping unneeded columns as soon as possible.</li>
      <li><strong>Combine cascaded selections/projections</strong> into single passes.</li>
      <li><strong>Reorder joins</strong> to compute the smallest intermediate relations first.</li>
      <li>Prefer using an available <strong>index</strong> over σ's full linear scan when a predicate matches an indexed column.</li>
    </ul>

    <h3>Cost-based optimization</h3>
    <p>Beyond heuristics, the optimizer estimates the actual cost (usually in disk block I/O) of candidate plans using statistics — table cardinalities, column selectivity/histograms, index availability — and picks the cheapest. This is why keeping table statistics up to date (<code>ANALYZE</code>/<code>UPDATE STATISTICS</code>) matters for real-world performance.</p>

    <h3>Join algorithms (how a join is physically executed)</h3>
    <table class="reftable">
      <tr><th>Algorithm</th><th>How it works</th><th>Best when</th></tr>
      <tr><td>Nested-loop join</td><td>For each row in outer relation, scan inner relation for matches.</td><td>One side is small, or an index exists on the inner join column (index nested-loop).</td></tr>
      <tr><td>Sort-merge join</td><td>Sort both relations on the join key, then merge in one linear pass.</td><td>Both relations already sorted or sorting is cheap; equality joins.</td></tr>
      <tr><td>Hash join</td><td>Build an in-memory hash table on the smaller relation's join key, probe with the larger relation.</td><td>Large unsorted relations, equality joins, enough memory for the hash table.</td></tr>
    </table>

    <h3>Pipelining vs materialization</h3>
    <p>When evaluating a chain of operators, the engine can either <strong>materialize</strong> each intermediate result to disk/temp storage before feeding it to the next operator, or <strong>pipeline</strong> — stream tuples directly from one operator into the next without ever fully writing the intermediate result out. Pipelining saves I/O but isn't always possible (e.g. sort-merge join needs to see a full sorted relation before it can merge).</p>

<h3>Worked: costing four join algorithms on the same query</h3><div class="worked"><div class="wtitle">Worked example &mdash; why the optimizer's choice matters so much</div><div class="codeblock"><pre>Join Employees (br = 1000 blocks) with Departments (bs = 500 blocks).

BLOCK NESTED LOOP, 3 buffer pages (1 in, 1 out, 1 scan)
    cost = br + (br * bs)
         = 1000 + 1000*500
         = 501,000 block reads

BLOCK NESTED LOOP, 102 buffer pages (100 usable for the outer)
    outer read once           = 1000
    inner rescanned per chunk = ceil(1000/100) = 10 passes * 500
    cost = 1000 + 10*500      = 6,000 block reads
    -- a 100x improvement from memory alone, no algorithm change

SORT-MERGE JOIN (both inputs unsorted)
    sort r + sort s + merge   ~ 32,000 block reads
    -- and the output arrives sorted, which may serve ORDER BY for free

HASH JOIN (equality only, enough memory for the build side)
    partition both + probe    = 3 * (br + bs)
                              = 3 * 1500 = 4,500 block reads
    -- usually the winner for large unsorted equality joins

Ranking here:  hash (4,500)  &lt;  BNL-with-memory (6,000)  &lt;  sort-merge (32,000)  &lt;&lt;  BNL-3-pages (501,000)

The lesson: the SAME logical join has costs spanning two orders of
magnitude. That gap is what the optimizer exists to navigate.</pre></div></div><h3>Worked: selectivity and cardinality estimation</h3><div class="worked"><div class="wtitle">Worked example &mdash; how the optimizer guesses row counts</div><div class="codeblock"><pre>Estimating how many rows survive a predicate.

Employees: 100,000 rows
  dept_id  has 50 distinct values
  status   has 2 distinct values
  salary   ranges 20,000 .. 200,000

SELECT * FROM Employees WHERE dept_id = 7

    selectivity = 1 / distinct(dept_id) = 1/50 = 0.02
    estimated rows = 100,000 * 0.02 = 2,000

SELECT * FROM Employees WHERE dept_id = 7 AND status = &#x27;active&#x27;

    assuming INDEPENDENCE (the optimizer&#x27;s usual assumption):
    combined selectivity = 0.02 * 0.5 = 0.01
    estimated rows = 1,000

SELECT * FROM Employees WHERE salary &gt; 150000

    uniform-distribution estimate:
    (200,000 - 150,000) / (200,000 - 20,000) = 50/180 = 0.278
    estimated rows = 27,800

WHY ESTIMATES GO WRONG: the independence assumption. If nearly every
employee in dept 7 happens to be &#x27;active&#x27;, the true count is ~2,000,
not 1,000. The optimizer then under-estimates, may pick a nested loop
expecting few rows, and the query runs orders of magnitude slow.
This is why HISTOGRAMS (and, in modern engines, multi-column
statistics) exist -- and why ANALYZE matters.</pre></div></div><div class="callout"><div class="ctitle">Reading a real plan</div>Run <code>EXPLAIN ANALYZE &lt;query&gt;</code> in PostgreSQL and compare the <em>estimated</em> row count with the <em>actual</em>. A large divergence &mdash; say estimated 10, actual 400,000 &mdash; is the single most useful diagnostic in query tuning: it tells you the optimizer chose its plan on bad information, and the fix is usually <code>ANALYZE</code>, extended statistics, or rewriting the predicate.</div>

<div class="takeaways"><div class="tk-title">Key takeaways</div><ul><li>Cost is measured in <strong>block I/O</strong>; CPU is usually negligible beside it.</li><li>The same join can span two orders of magnitude in cost &mdash; algorithm and memory both matter.</li><li>Hash join wins for large unsorted <em>equality</em> joins; it cannot do ranges.</li><li>Sort-merge costs more but returns sorted output, which can pay for an ORDER BY.</li><li>Selectivity &asymp; 1/distinct-values; predicates are combined assuming independence.</li><li>Estimates fail when columns correlate &mdash; compare estimated vs actual in <code>EXPLAIN ANALYZE</code>.</li></ul></div>`,
    quiz: [
      { q: `Predicate pushdown is applied primarily to:`, options: ["Reduce the number of SQL keywords used", "Shrink intermediate relation sizes early, before costly operations like joins run on them", "Increase the number of disk seeks for accuracy", "Simplify the SQL parser"], answer: 1, explain: `By filtering (σ) as close to the base relations as possible, fewer rows flow into subsequent, more expensive operators like joins — directly cutting I/O cost.` },
      { q: `A hash join is generally preferred over nested-loop join when:`, options: ["Both relations are tiny and already indexed", "Both relations are large, unsorted, and the join is an equality join", "The join condition is a range comparison (>, <)", "No memory is available for a hash table"], answer: 1, explain: `Hash join builds an in-memory hash table on the smaller relation's key and probes with the larger one in roughly linear time — but it only works for equality joins (you can't hash a range condition meaningfully) and needs enough memory for the build side.` },
      { q: `Why does the query optimizer rely on cost estimation rather than exhaustively evaluating every logically equivalent plan?`, options: ["Exhaustive search is illegal under SQL standard", "The number of equivalent plans grows too large (especially with many joins) to evaluate all of them in reasonable time", "Cost estimation is always more accurate than exhaustive search", "Modern databases don't use cost estimation anymore"], answer: 1, explain: `The number of possible join orderings alone grows factorially with the number of relations — cost-based search with pruning (and heuristics to shrink the space first) is the practical alternative to brute force.` },
    ],
    practice: [
      { prompt: `Given the query <code>SELECT name FROM Employees e JOIN Departments d ON e.dept_id = d.dept_id WHERE d.location = 'Delhi';</code>, describe (in words) how a heuristic optimizer would rewrite the naive algebra plan π<sub>name</sub>(σ<sub>location='Delhi'</sub>(Employees ⋈ Departments)) for better performance.`, solution: `The naive plan joins the full Employees and Departments tables first, then filters. A heuristic optimizer pushes the selection down: since <code>location</code> only belongs to Departments, apply σ<sub>location='Delhi'</sub> to Departments <em>before</em> the join — producing a much smaller filtered Departments relation to join against. Rewritten: π<sub>name</sub>(Employees ⋈ σ<sub>location='Delhi'</sub>(Departments)). It would also push the projection early, keeping only <code>dept_id</code> from Departments and <code>name, dept_id</code> from Employees going into the join, dropping every other column before the expensive join step.` },
      { prompt: `A table Orders has 10 million rows, a small lookup table Currencies has 5 rows, and you're joining them on currency_code (equality). Which join algorithm would you expect the optimizer to pick, and why?`, solution: `Almost certainly a <strong>hash join</strong> (or an index nested-loop join if Currencies has an index and Orders is the outer/probing side) — build the hash table on the tiny Currencies relation (5 rows, trivial memory cost), then stream all 10 million Orders rows through as probes. A sort-merge join would waste time sorting 10 million rows unnecessarily; a plain nested-loop with Orders as the inner relation would be catastrophic (10M × 5 comparisons is fine, but the reverse — Currencies as outer, Orders scanned 5 times — is still far worse than one hash-table build + one linear pass).` },
    ],
  },
  {
    id: "m8",
    unit: "u3",
    num: "08",
    title: "Functional Dependencies & Normalization",
    syllabus: true,
    meta: "1NF–5NF, BCNF · Armstrong's axioms · lossless & dependency-preserving decomposition",
    notes: `
    <div class="starter">
    <div class="defbox"><div class="dlabel">Definition &mdash; in plain English</div><strong>Normalization</strong> is the step-by-step process of restructuring tables to remove harmful redundancy. It is driven by <strong>functional dependencies (FDs)</strong>: statements like 'roll_no determines name' (roll_no &rarr; name), meaning if you know the roll number you know the name. The normal forms (1NF, 2NF, 3NF, BCNF) are increasingly strict health checks based on those FDs.</div>
    <div class="intuitbox"><div class="dlabel">Intuition &mdash; how to think about it</div>Redundancy is the disease; anomalies are the symptoms; normalization is the cure. Picture one giant table storing student + department + department head in every row. The head's name is repeated thousands of times (redundancy), so: renaming the head means updating thousands of rows and missing one creates contradiction (update anomaly); you can't record a new department until it has a student (insertion anomaly); deleting the last student of a department erases the department itself (deletion anomaly). Normalization splits that giant table so <strong>every fact is stored exactly once</strong>. The 3NF slogan says it all: every non-key column must depend on <em>the key, the whole key, and nothing but the key</em>.</div>
    <h3 class="kt-head">Key terms you must know</h3>
    <table class="reftable"><tr><th>Term</th><th>Meaning</th></tr><tr><td><strong>Functional dependency</strong></td><td>X &rarr; Y: knowing X fixes Y (roll_no &rarr; name).</td></tr><tr><td><strong>1NF</strong></td><td>Every cell holds a single atomic value &mdash; no lists inside a cell.</td></tr><tr><td><strong>2NF</strong></td><td>1NF + no partial dependency (nothing depends on just a piece of a composite key).</td></tr><tr><td><strong>3NF</strong></td><td>2NF + no transitive dependency (non-key &rarr; non-key chains banned).</td></tr><tr><td><strong>BCNF</strong></td><td>Stricter 3NF: every determinant must be a candidate key.</td></tr><tr><td><strong>Anomaly</strong></td><td>Insert/update/delete going wrong because facts are duplicated.</td></tr><tr><td><strong>Decomposition</strong></td><td>Splitting a table; must be lossless (joins back exactly) and ideally dependency-preserving.</td></tr><tr><td><strong>Closure (X&#8314;)</strong></td><td>All attributes derivable from X using the FDs &mdash; the tool for finding keys.</td></tr></table>
    </div>

    <p>Normalization is the systematic process of decomposing tables to eliminate redundancy and the update/insert/delete anomalies redundancy causes — driven entirely by <strong>functional dependencies (FDs)</strong>.</p>

    <h3>Functional dependency, formally</h3>
    <p><code>X → Y</code> ("X functionally determines Y") means: for any two tuples that agree on X, they must also agree on Y. X is the determinant.</p>

    <h3>Armstrong's axioms — deriving all FDs from a given set</h3>
    <table class="reftable">
      <tr><th>Axiom</th><th>Rule</th></tr>
      <tr><td>Reflexivity</td><td>If Y ⊆ X, then X → Y (trivial FD)</td></tr>
      <tr><td>Augmentation</td><td>If X → Y, then XZ → YZ for any Z</td></tr>
      <tr><td>Transitivity</td><td>If X → Y and Y → Z, then X → Z</td></tr>
    </table>
    <p>From these, useful derived rules follow: union (X→Y, X→Z ⟹ X→YZ), decomposition (X→YZ ⟹ X→Y and X→Z), pseudo-transitivity. The <strong>closure</strong> of an attribute set X⁺ is every attribute functionally determined by X — computing it is how you test candidate keys and check if a decomposition lost information.</p>

    <h3>The normal form ladder</h3>
    <table class="reftable">
      <tr><th>Form</th><th>Requires</th><th>Eliminates</th></tr>
      <tr><td>1NF</td><td>Every attribute holds a single, atomic value — no repeating groups or nested tables.</td><td>Multi-valued columns.</td></tr>
      <tr><td>2NF</td><td>1NF + no <strong>partial dependency</strong> — every non-key attribute must depend on the <em>whole</em> of a composite primary key, not just part of it.</td><td>Redundancy caused by a subset of the key determining an attribute.</td></tr>
      <tr><td>3NF</td><td>2NF + no <strong>transitive dependency</strong> — a non-key attribute must not depend on another non-key attribute.</td><td>Redundancy where non-key attributes determine other non-key attributes.</td></tr>
      <tr><td>BCNF</td><td>For every non-trivial FD X → Y, X must be a superkey. Stricter than 3NF.</td><td>Anomalies 3NF still allows when overlapping candidate keys exist.</td></tr>
      <tr><td>4NF</td><td>BCNF + no non-trivial <strong>multivalued dependency</strong> (X ↠ Y) unless X is a superkey.</td><td>Redundancy from two independent multivalued facts jammed into one table.</td></tr>
      <tr><td>5NF (PJNF)</td><td>No non-trivial <strong>join dependency</strong> that isn't implied by the candidate keys.</td><td>Redundancy only visible when decomposing into 3+ tables and rejoining.</td></tr>
    </table>

    <div class="callout"><div class="ctitle">2NF vs 3NF, the way it actually clicks</div>
    2NF is about a <em>part</em> of the key determining something (only relevant with composite keys). 3NF is about a <em>non-key column</em> determining another non-key column — a chain: key → A → B, where B should really live in its own table keyed by A.</div>

    <h3>BCNF vs 3NF — the subtle gap</h3>
    <p>3NF permits one specific anomaly BCNF forbids: when a relation has <strong>overlapping composite candidate keys</strong>, 3NF may allow an FD X → Y where X is a candidate key already but Y is prime (part of another candidate key) — this exception exists purely to guarantee 3NF decomposition can always be both lossless <em>and</em> dependency-preserving. BCNF has no such exception, which means a BCNF decomposition can sometimes lose dependency-preservation (an FD becomes impossible to check without a join).</p>

    <h3>Decomposition properties — the two things you must never lose</h3>
    <ul>
      <li><strong>Lossless-join decomposition</strong> — joining the decomposed tables back together must reconstruct exactly the original relation, no spurious extra rows. Test: for a 2-way split R1, R2, it's lossless iff (R1 ∩ R2) is a superkey of R1 or of R2.</li>
      <li><strong>Dependency-preserving decomposition</strong> — every original FD must still be checkable without needing to join tables back together. Losing this means integrity checks get expensive or silently unenforced.</li>
    </ul>
    <p>3NF decomposition (via a standard synthesis algorithm) can always guarantee both properties simultaneously. BCNF decomposition always guarantees lossless-join, but <strong>may sacrifice dependency preservation</strong> — a real, examinable tradeoff.</p>

    <div class="callout"><div class="ctitle">Beyond the syllabus: denormalization</div>Real systems sometimes deliberately reintroduce redundancy (denormalize) after normalizing, trading write-time consistency risk for read-time speed — e.g. storing a precomputed <code>order_total</code> column instead of joining/summing line items on every read. Know when to normalize (OLTP, correctness-critical) vs when controlled denormalization is defensible (read-heavy analytics/reporting).</div>

<h3>Worked: computing a closure and finding every candidate key</h3><div class="worked"><div class="wtitle">Worked example &mdash; attribute closure X<sup>+</sup></div><div class="codeblock"><pre>Given F = { A-&gt;BC,  CD-&gt;E,  B-&gt;D,  E-&gt;A }

Compute A+ :

  start        A+ = {A}
  apply A-&gt;BC    A+ = {A, B, C}          (added B, C)
  apply B-&gt;D     A+ = {A, B, C, D}          (added D)
  apply CD-&gt;E    A+ = {A, B, C, D, E}          (added E)

A+ = {A, B, C, D, E} = all of R,  therefore A is a SUPERKEY.
No proper subset of {A} exists, so A is a CANDIDATE KEY.

Testing every subset the same way gives all candidate keys:
  {A},  {BC},  {CD},  {E}</pre></div></div><div class="callout"><div class="ctitle">Why closure is the master tool</div>Every normalization question reduces to a closure computation. <em>Is X a superkey?</em> Compute X<sup>+</sup> and see if it covers R. <em>Does F imply X&rarr;Y?</em> Check Y &sube; X<sup>+</sup>. <em>Is a decomposition lossless?</em> Check whether the shared attributes' closure covers one fragment. Learn this one algorithm and the rest follows.</div><h3>Worked: 3NF versus BCNF, and the price of BCNF</h3><div class="worked"><div class="wtitle">Worked example &mdash; the classic Student&ndash;Teacher&ndash;Course relation</div><div class="codeblock"><pre>Relation R(S, T, C)   -- Student, Teacher, Course
FDs:  SC -&gt; T     (a student in a course has one teacher)
      T  -&gt; C     (each teacher teaches exactly one course)

Candidate keys:  {CS}, {ST}
Prime attributes: C, S, T

3NF check: for T -&gt; C, is C prime?  YES (C is in candidate key SC)
           =&gt; the &quot;or Y is prime&quot; escape clause applies
           =&gt; R IS in 3NF                       violations: none

BCNF check: for T -&gt; C, is T a superkey?
            T+ = {C, T}  != R
            =&gt; T is NOT a superkey
            =&gt; R is NOT in BCNF                 violating FD: T -&gt; C

Decompose on the violating FD:  R1(T, C)   R2(S, T)

Lossless?  R1 n R2 = {T},  {T}+ = {C, T}
           that determines all of R1(T,C)  =&gt;  LOSSLESS  YES

Dependency preserving?  T -&gt; C lives inside R1        kept
                        SC -&gt; T needs S, C and T together,
                        but no fragment holds all three  LOST

=&gt; This is the classic tradeoff: BCNF cost us dependency preservation.</pre></div></div><h3>Worked: canonical (minimal) cover</h3><div class="worked"><div class="wtitle">Worked example &mdash; reducing an FD set to its minimal form</div><div class="codeblock"><pre>F = { A-&gt;BC,  B-&gt;C,  A-&gt;B,  AB-&gt;C }

Step 1 — split every RHS into single attributes:
        A-&gt;B,  A-&gt;C,  B-&gt;C,  AB-&gt;C

Step 2 — remove extraneous LHS attributes:
        remove A from LHS of AB-&gt;C
        (AB-&gt;C becomes B-&gt;C, a duplicate)

Step 3 — remove redundant FDs:
        drop redundant A-&gt;C   (already implied by the rest)
        drop redundant B-&gt;C   (already implied by the rest)

Canonical cover Fc = { A-&gt;B,  B-&gt;C }

Verified: Fc and F have identical closures on every attribute subset.</pre></div></div><div class="callout"><div class="ctitle">Exam technique</div>Always work in this order: (1) compute closures to find all candidate keys, (2) mark the prime attributes, (3) test each FD against the BCNF rule &ldquo;is the determinant a superkey?&rdquo;, (4) only if it fails, apply the 3NF escape clause &ldquo;is the dependent attribute prime?&rdquo;. Skipping straight to pattern-matching normal forms is where marks are lost.</div>

<div class="takeaways"><div class="tk-title">Key takeaways</div><ul><li>X<sup>+</sup> (attribute closure) is the single algorithm behind keys, superkeys, implication and lossless tests.</li><li>A candidate key is a minimal attribute set whose closure is the whole relation.</li><li><strong>BCNF</strong>: every non-trivial determinant must be a superkey. <strong>3NF</strong> adds the escape clause &ldquo;&hellip;or the dependent attribute is prime&rdquo;.</li><li>That escape clause is exactly why 3NF can always be lossless <em>and</em> dependency-preserving, while BCNF guarantees only lossless.</li><li>Binary decomposition is lossless iff the shared attributes form a superkey of at least one fragment.</li><li>Canonical cover: split right-hand sides, drop extraneous left-hand attributes, drop redundant FDs.</li></ul></div>`,
    quiz: [
      { q: `A relation <code>Enrollment(student_id, course_id, student_name, grade)</code> with PK (student_id, course_id) has <code>student_id → student_name</code>. This is:`, options: ["A transitive dependency, violating 3NF", "A partial dependency, violating 2NF", "A multivalued dependency, violating 4NF", "Not a normalization violation at all"], answer: 1, explain: `student_name depends on only part of the composite key (student_id alone, not the full student_id+course_id) — that's the textbook definition of a partial dependency, a 2NF violation.` },
      { q: `What is the precise difference between 3NF and BCNF?`, options: ["BCNF applies only to tables with a single candidate key", "3NF allows one narrow exception (when the determinant is itself a candidate key overlapping with another) that BCNF does not permit", "3NF and BCNF are identical in every case", "BCNF is only relevant to multivalued dependencies"], answer: 1, explain: `3NF's third condition includes an "or Y is a prime attribute" escape clause that BCNF drops entirely — that gap is precisely what can make a BCNF decomposition fail to preserve all original dependencies.` },
      { q: `A lossless-join decomposition of R into R1 and R2 is guaranteed when:`, options: ["R1 and R2 have the same number of columns", "R1 ∩ R2 is a superkey of at least one of R1 or R2", "R1 and R2 share no attributes at all", "R has been reduced to 1NF"], answer: 1, explain: `This is the standard lossless-join test for binary decompositions — if the common attribute set can uniquely determine all of one side, joining back reconstructs the original exactly, without spurious rows.` },
    ],
    practice: [
      { prompt: `Normalize this table to 3NF. <code>Invoice(invoice_id, customer_id, customer_name, customer_city, product_id, product_name, qty, unit_price)</code>. Identify the FDs first, then decompose.`, solution: `<strong>FDs:</strong><br>
     invoice_id → customer_id (assume one customer per invoice)<br>
     customer_id → customer_name, customer_city (transitive: invoice_id → customer_id → customer_name)<br>
     product_id → product_name, unit_price<br>
     (invoice_id, product_id) → qty<br><br>
     <strong>Decomposition (3NF):</strong>
     <div class="codeblock">Customer(customer_id, customer_name, customer_city)
Product(product_id, product_name, unit_price)
Invoice(invoice_id, customer_id)
InvoiceLine(invoice_id, product_id, qty)</div>
     Every non-key attribute now depends only on its own table's full key, and there's no non-key → non-key chain left anywhere.` },
      { prompt: `Explain why <code>R(A, B, C)</code> with FDs A → B and B → C is NOT in 3NF, and show the lossless, dependency-preserving 3NF decomposition.`, solution: `Candidate key is A (A → B → C means A → C too, by transitivity, so A alone determines everything). But B → C means non-key attribute C is transitively determined via non-key attribute B — a direct 3NF transitive-dependency violation.<br><br>
     <strong>Decomposition:</strong> R1(A, B) with FD A→B, R2(B, C) with FD B→C.<br>
     <strong>Lossless check:</strong> R1 ∩ R2 = {B}, and B → C means B is a candidate key of R2 — so the decomposition is lossless.<br>
     <strong>Dependency-preserving check:</strong> A→B is checkable in R1 alone, B→C is checkable in R2 alone — both original FDs survive without needing a join. Both properties hold.` },
    ],
  },
  {
    id: "m9",
    unit: "u3",
    num: "09",
    title: "Database Security & Authorization",
    syllabus: true,
    meta: "GRANT/REVOKE · views as security · encryption basics",
    notes: `
    <div class="starter">
    <div class="defbox"><div class="dlabel">Definition &mdash; in plain English</div><strong>Database security</strong> controls who may see or change what. Its core mechanism in SQL is <strong>authorization</strong>: GRANT gives a user or role specific privileges (SELECT, INSERT&hellip;) on specific objects, REVOKE takes them back. Views and encryption add finer control and protection.</div>
    <div class="intuitbox"><div class="dlabel">Intuition &mdash; how to think about it</div>Think of an <strong>office building with keycards</strong>. A privilege is a keycard for one door (SELECT on Employees). A role is a labelled lanyard &mdash; 'analyst' &mdash; holding a bundle of cards, so you badge people by job instead of issuing cards one by one. WITH GRANT OPTION means 'you may photocopy your card for others' &mdash; convenient, but when your card is cancelled every photocopy dies with it (cascading revoke). A view used for security is a <strong>window that shows only part of a room</strong>: give the intern SELECT on a view without the salary column, and the column simply doesn't exist in their world.</div>
    <h3 class="kt-head">Key terms you must know</h3>
    <table class="reftable"><tr><th>Term</th><th>Meaning</th></tr><tr><td><strong>Privilege</strong></td><td>A specific right on an object: SELECT, INSERT, UPDATE, DELETE, EXECUTE&hellip;</td></tr><tr><td><strong>GRANT / REVOKE</strong></td><td>Give / take away privileges.</td></tr><tr><td><strong>Role</strong></td><td>A named bundle of privileges assigned to users (analyst, admin).</td></tr><tr><td><strong>WITH GRANT OPTION</strong></td><td>Recipient may pass the privilege on; revoking cascades.</td></tr><tr><td><strong>View-based security</strong></td><td>Expose a restricted view instead of the base table.</td></tr><tr><td><strong>SQL injection</strong></td><td>Attack that smuggles SQL through user input; defeated by parameterized queries.</td></tr><tr><td><strong>Encryption</strong></td><td>At rest (files on disk) and in transit (TLS) &mdash; protects data even if stolen.</td></tr></table>
    </div>

    <h3>Authorization model</h3>
    <p>SQL's authorization is privilege-based: a user (or role) is granted specific rights on specific objects.</p>
    <div class="codeblock"><span class="k">GRANT SELECT, INSERT ON</span> Employees <span class="k">TO</span> analyst_role;
<span class="k">GRANT SELECT ON</span> Employees <span class="k">TO</span> intern <span class="k">WITH GRANT OPTION</span>;  <span class="c">-- intern can re-grant this privilege to others</span>
<span class="k">REVOKE INSERT ON</span> Employees <span class="k">FROM</span> analyst_role;</div>
    <table class="reftable">
      <tr><th>Privilege type</th><th>Examples</th></tr>
      <tr><td>Object privileges</td><td>SELECT, INSERT, UPDATE, DELETE, REFERENCES, EXECUTE — on tables/views/procedures</td></tr>
      <tr><td>System privileges</td><td>CREATE TABLE, CREATE USER, ALTER SYSTEM — administrative</td></tr>
      <tr><td>Roles</td><td>Named bundles of privileges assigned to users, so permissions are managed at the role level, not per-user</td></tr>
    </table>
    <p><code>REVOKE</code> with <code>CASCADE</code> also strips privileges the revoked user had, in turn, granted to others (chained via WITH GRANT OPTION) — an important, often-missed consequence.</p>

    <h3>Views as a security mechanism</h3>
    <p>Instead of granting direct table access, expose a view that shows only permitted rows/columns.</p>
    <div class="codeblock"><span class="k">CREATE VIEW</span> public_directory <span class="k">AS</span>
<span class="k">SELECT</span> name, department, office_ext <span class="k">FROM</span> Employees;  <span class="c">-- salary column hidden entirely</span>

<span class="k">GRANT SELECT ON</span> public_directory <span class="k">TO</span> all_staff;   <span class="c">-- no direct access to Employees table</span></div>
    <p>Row-level restriction: <code>CREATE VIEW my_dept_only AS SELECT * FROM Employees WHERE dept_id = CURRENT_DEPT();</code> — each user effectively sees only their own department's rows.</p>

    <h3>Encryption</h3>
    <ul>
      <li><strong>Encryption at rest</strong> — data files/backups encrypted on disk, protecting against stolen physical media or filesystem-level snooping.</li>
      <li><strong>Encryption in transit</strong> — TLS between client and DB server, protecting against network interception.</li>
      <li><strong>Column-level encryption</strong> — specific sensitive columns (SSNs, card numbers) encrypted independently, even from users with broad table access.</li>
      <li><strong>Password/credential hashing</strong> — passwords are never stored in plaintext or reversibly encrypted; a one-way hash (with salt) is stored, so even a DB breach doesn't directly expose credentials.</li>
    </ul>
    <div class="callout"><div class="ctitle">Beyond the syllabus: SQL injection</div>The most common real-world DB security failure isn't a broken GRANT — it's an application building SQL strings by concatenating unsanitized user input (see Module 05's Dynamic SQL). A form field containing <code>' OR '1'='1</code> can rewrite a WHERE clause's logic entirely. Defense: parameterized queries/prepared statements, never string-built SQL from user input, plus least-privilege GRANTs as a second line of defense.</div>

<h3>Worked: privilege propagation and CASCADE revocation</h3><div class="worked"><div class="wtitle">Worked example &mdash; grant graphs</div><div class="codeblock"><pre>GRANT / REVOKE and the propagation problem.

    GRANT SELECT, INSERT ON employees TO analyst;
    GRANT SELECT ON employees TO lead WITH GRANT OPTION;

    -- &#x27;lead&#x27; may now pass the privilege on:
    GRANT SELECT ON employees TO junior;      -- issued BY lead

    Grant graph:      DBA ---&gt; lead ---&gt; junior
                          \\--&gt; analyst

    REVOKE SELECT ON employees FROM lead CASCADE;

    -- junior&#x27;s access came from lead&#x27;s grant, which no longer exists,
    -- so it is revoked too. The whole subtree collapses:
    Result:           DBA ---&gt; analyst        (lead and junior lose access)

    REVOKE ... RESTRICT would instead REFUSE the revoke while
    dependent grants exist -- forcing you to clean up explicitly.

RBAC -- why roles beat direct grants
    Without roles: 200 employees x 15 privileges = 3000 grant statements,
                   and every job change means auditing all of them.
    With roles:    GRANT ... TO role_analyst;      (15 statements, once)
                   GRANT role_analyst TO alice;    (1 statement per person)
    Revoking a person&#x27;s access becomes a single REVOKE of the role.</pre></div></div><h3>Worked: SQL injection and why parameterization is the fix</h3><div class="worked"><div class="wtitle">Worked example &mdash; data becoming code</div><div class="codeblock"><pre>SQL INJECTION -- the mechanism, and the only reliable fix.

VULNERABLE (string concatenation):

    query = &quot;SELECT * FROM users WHERE name = &#x27;&quot; + userInput + &quot;&#x27;&quot;;

    userInput = alice                -&gt; ... WHERE name = &#x27;alice&#x27;
    userInput = &#x27; OR &#x27;1&#x27;=&#x27;1          -&gt; ... WHERE name = &#x27;&#x27; OR &#x27;1&#x27;=&#x27;1&#x27;
                                        returns EVERY row
    userInput = &#x27;; DROP TABLE users;--
                                     -&gt; two statements; the -- comments
                                        out the trailing quote

The root cause: user DATA is being parsed as SQL CODE. No amount of
escaping or blacklisting fixes this reliably.

SAFE (parameterized / prepared statement):

    PreparedStatement ps = conn.prepareStatement(
        &quot;SELECT * FROM users WHERE name = ?&quot;);
    ps.setString(1, userInput);

The query is parsed and planned ONCE, with a placeholder. The value is
sent separately and can never change the parse tree -- &#x27; OR &#x27;1&#x27;=&#x27;1
is simply searched for as a literal name. This is a structural
guarantee, not a filter that can be bypassed.

DEFENCE IN DEPTH
    1. Parameterized queries               -- eliminates the class
    2. Least privilege                     -- the web user needs no DROP
    3. Views                               -- expose only needed columns/rows
    4. Input validation                    -- helpful, NEVER sufficient alone</pre></div></div><div class="callout"><div class="ctitle">Discretionary vs mandatory access control</div><strong>DAC</strong> (what SQL GRANT implements) lets the <em>owner</em> of an object decide who may use it &mdash; flexible, but privileges spread in ways nobody tracks. <strong>MAC</strong> assigns every subject a clearance and every object a classification, and the <em>system</em> enforces the rules regardless of owner wishes &mdash; used where leakage must be structurally impossible.</div>

<h3>The threat model at a glance</h3><table class="reftable"><tr><th>Threat</th><th>Mechanism</th><th>Primary defence</th></tr><tr><td>SQL injection</td><td>User input parsed as SQL code</td><td>Parameterized queries</td></tr><tr><td>Privilege escalation</td><td>Over-granted rights, chained GRANTs</td><td>Least privilege, roles, audit the grant graph</td></tr><tr><td>Inference attack</td><td>Aggregate queries leak individual values</td><td>Query restriction, minimum group size, differential privacy</td></tr><tr><td>Data at rest theft</td><td>Stolen disk or backup</td><td>Transparent data encryption (TDE)</td></tr><tr><td>Data in transit</td><td>Network sniffing</td><td>TLS on every connection</td></tr><tr><td>Insider misuse</td><td>Legitimate credentials, illegitimate use</td><td>Auditing, separation of duties</td></tr></table><h3>Worked: the inference problem</h3><div class="worked"><div class="wtitle">Worked example &mdash; how aggregates leak individual rows</div><div class="codeblock"><pre>THE INFERENCE PROBLEM -- when aggregates leak individuals.

A statistical database permits only aggregates, never raw rows.
That sounds safe. It is not.

    Allowed:  SELECT AVG(salary) FROM emp WHERE dept = &#x27;Legal&#x27;;
    Blocked:  SELECT salary FROM emp WHERE name = &#x27;Ann&#x27;;

But if the attacker knows Ann is the only woman in Legal:

    SELECT AVG(salary) FROM emp
    WHERE dept = &#x27;Legal&#x27; AND gender = &#x27;F&#x27;;      -- returns Ann&#x27;s exact salary

Or, by differencing two permitted aggregates:

    SELECT SUM(salary) FROM emp WHERE dept=&#x27;Legal&#x27;;            -- 500000
    SELECT SUM(salary) FROM emp WHERE dept=&#x27;Legal&#x27;
                                 AND name &lt;&gt; &#x27;Ann&#x27;;            -- 440000
    -- Ann earns exactly 60000

DEFENCES
    minimum query set size   refuse any aggregate over fewer than k rows
    query set overlap limit  refuse queries that differ by too few rows
    noise addition           perturb results slightly -- the basis of
                             DIFFERENTIAL PRIVACY, which bounds
                             mathematically how much any single
                             individual&#x27;s presence can change an answer

This is why &quot;we only expose aggregates&quot; is not, by itself, a
privacy guarantee.</pre></div></div>

<div class="takeaways"><div class="tk-title">Key takeaways</div><ul><li><code>GRANT &hellip; WITH GRANT OPTION</code> lets a grantee re-grant, creating a dependency chain.</li><li><code>REVOKE &hellip; CASCADE</code> collapses the whole subtree; <code>RESTRICT</code> refuses while dependents exist.</li><li><strong>Roles</strong> turn an O(users&times;privileges) problem into O(users + privileges).</li><li>Views enforce least privilege at column and row granularity without per-column grants.</li><li>SQL injection is <em>data parsed as code</em>; only <strong>parameterized queries</strong> eliminate it structurally.</li><li>Store passwords as <strong>salted one-way hashes</strong> &mdash; never encrypted, never plaintext.</li></ul></div>`,
    quiz: [
      { q: `Why is granting a role SELECT-only access via a view often preferred over granting SELECT directly on the base table?`, options: ["Views are always faster than tables", "A view can hide specific columns/rows the base table exposes, enforcing least-privilege access without a separate permission per column", "Views automatically encrypt data", "There is no functional difference"], answer: 1, explain: `A view lets you present a deliberately narrowed slice of a table (fewer columns, filtered rows) and grant access to only that slice — least privilege without needing column-level GRANT statements everywhere.` },
      { q: `A user was granted SELECT WITH GRANT OPTION and re-granted it to two colleagues. What happens to those colleagues' access if the original grant is REVOKEd with CASCADE?`, options: ["Nothing — their access is independent", "Their access is revoked too, since it was chained from the original grant", "Only the DBA can decide manually", "CASCADE only affects DELETE statements, not REVOKE"], answer: 1, explain: `CASCADE on REVOKE propagates through the grant chain — since the colleagues' access originated from a grant that no longer exists, it's stripped too.` },
      { q: `Passwords should be stored in a database as:`, options: ["Plaintext, for easy password recovery", "Reversibly encrypted, so support staff can decrypt them if needed", "A salted one-way hash, so the original password can never be recovered even from stolen data", "Base64-encoded strings"], answer: 2, explain: `Hashing (with a per-user salt) is one-way by design — even a full database breach shouldn't hand an attacker usable plaintext passwords. Encryption is reversible with a key; hashing is not, which is exactly the property you want here.` },
    ],
    practice: [
      { prompt: `Design a GRANT scheme for three roles on an Employees(emp_id, name, dept_id, salary, ssn) table: (1) HR staff need full access, (2) Managers need to see everyone's name/dept but only their own team's salary, (3) all employees need to see only their own row.`, solution: `<div class="codeblock"><span class="c">-- 1. HR: full access</span>
<span class="k">GRANT SELECT, INSERT, UPDATE, DELETE ON</span> Employees <span class="k">TO</span> hr_role;

<span class="c">-- 2. Managers: view hiding SSN, salary filtered by row</span>
<span class="k">CREATE VIEW</span> team_view <span class="k">AS</span>
<span class="k">SELECT</span> emp_id, name, dept_id,
       <span class="k">CASE WHEN</span> dept_id = CURRENT_MANAGER_DEPT() <span class="k">THEN</span> salary <span class="k">ELSE NULL END AS</span> salary
<span class="k">FROM</span> Employees;
<span class="k">GRANT SELECT ON</span> team_view <span class="k">TO</span> manager_role;

<span class="c">-- 3. Self-service: row-level restriction to own record, no SSN/salary columns</span>
<span class="k">CREATE VIEW</span> my_profile <span class="k">AS</span>
<span class="k">SELECT</span> emp_id, name, dept_id <span class="k">FROM</span> Employees
<span class="k">WHERE</span> emp_id = CURRENT_USER_ID();
<span class="k">GRANT SELECT ON</span> my_profile <span class="k">TO</span> employee_role;</div>SSN is never exposed through any of the three views/grants — direct table access to Employees itself should never be granted to Managers or general employees.` },
      { prompt: `A junior developer writes: <code>query = "SELECT * FROM Users WHERE username = '" + input + "'";</code> to check a login form. Show the injection input that bypasses authentication, and the fix.`, solution: `<strong>Attack input</strong> for the <code>input</code> field: <code>' OR '1'='1</code><br><br>
     Resulting query becomes: <code>SELECT * FROM Users WHERE username = '' OR '1'='1'</code> — the OR clause is always true, so it returns every row in Users, and the application likely just checks "did I get a row back" to decide login success.<br><br>
     <strong>Fix — parameterized query (prepared statement), never string concatenation:</strong>
     <div class="codeblock">PreparedStatement stmt = conn.prepareStatement(
  <span class="s">"SELECT * FROM Users WHERE username = ?"</span>
);
stmt.setString(1, input);  <span class="c">// treated strictly as data, never as SQL syntax</span></div>` },
    ],
  },
  {
    id: "m10",
    unit: "u3",
    num: "10",
    title: "Storage Structures, Indexing & Hashing",
    syllabus: true,
    meta: "File organization · B/B+-trees · static & dynamic hashing",
    notes: `
    <div class="starter">
    <div class="defbox"><div class="dlabel">Definition &mdash; in plain English</div>This module is about <strong>where the data physically lives and how we find it fast</strong>. Files can be organized as heaps (unordered), sequential (sorted), or hashed. An <strong>index</strong> is a separate lookup structure &mdash; almost always a <strong>B+-tree</strong> &mdash; that maps key values to row locations so the database can jump straight to matching rows instead of scanning everything.</div>
    <div class="intuitbox"><div class="dlabel">Intuition &mdash; how to think about it</div>An index is exactly the <strong>index at the back of a textbook</strong>: instead of reading 800 pages to find 'normalization', you check the index and jump to page 412. A B+-tree keeps that index sorted and shallow (3&ndash;4 levels even for millions of rows), so any lookup is a handful of page reads, and because all values sit linked together at the leaf level, <em>range</em> queries ('gpa between 7 and 9') are a jump-then-walk. Hashing is a different trick: a formula turns the key directly into a bucket number &mdash; brilliant for exact matches ('roll_no = 42'), useless for ranges, because the formula scatters nearby keys apart on purpose. Rule of thumb: B+-tree = sorted phone book, hashing = coat-check tokens.</div>
    <h3 class="kt-head">Key terms you must know</h3>
    <table class="reftable"><tr><th>Term</th><th>Meaning</th></tr><tr><td><strong>Heap file</strong></td><td>Rows stored wherever there is space. Fast insert, slow search.</td></tr><tr><td><strong>Sequential file</strong></td><td>Rows kept sorted on a key. Good for ranges, costly to maintain.</td></tr><tr><td><strong>Index</strong></td><td>Auxiliary structure mapping key values to record locations.</td></tr><tr><td><strong>Primary / clustering index</strong></td><td>Index on the attribute that dictates the file's physical order (one per file).</td></tr><tr><td><strong>Secondary index</strong></td><td>Index on any other attribute (many allowed).</td></tr><tr><td><strong>Dense vs sparse</strong></td><td>Entry for every record vs one per block (sparse needs sorted file).</td></tr><tr><td><strong>B+-tree</strong></td><td>Balanced tree; data pointers only in linked leaves &mdash; the default database index.</td></tr><tr><td><strong>Static vs dynamic hashing</strong></td><td>Fixed bucket count (overflow chains) vs growing gracefully (extendible/linear).</td></tr></table>
    </div>

    <h3>File organization</h3>
    <table class="reftable">
      <tr><th>Organization</th><th>Description</th><th>Best for</th></tr>
      <tr><td>Heap (unordered)</td><td>Records placed wherever there's space; no particular order.</td><td>Fast inserts; full scans for reads.</td></tr>
      <tr><td>Sequential</td><td>Records physically sorted by a key.</td><td>Range queries, ordered reads; slower inserts (may need reorganization).</td></tr>
      <tr><td>Hashed</td><td>A hash function on the key maps directly to a storage bucket.</td><td>Fast exact-match lookups; poor for range queries.</td></tr>
      <tr><td>Clustered</td><td>Rows physically stored in the same order as (usually) the primary index.</td><td>Range scans on the clustering key; only one clustered organization per table.</td></tr>
    </table>

    <h3>Indexing basics</h3>
    <p>An index is an auxiliary structure trading extra storage + write overhead for much faster reads on the indexed column(s).</p>
    <table class="reftable">
      <tr><th>Index type</th><th>Meaning</th></tr>
      <tr><td>Primary index</td><td>Built on the ordering key of a sequentially-organized file (one entry per block).</td></tr>
      <tr><td>Clustering index</td><td>Built on a non-key field that still determines physical row order (rows sharing a value are stored together).</td></tr>
      <tr><td>Secondary index</td><td>Built on a non-ordering field; doesn't affect physical storage order, points to record locations.</td></tr>
      <tr><td>Dense index</td><td>One index entry for <em>every</em> search-key value in the file.</td></tr>
      <tr><td>Sparse index</td><td>One index entry per block (not per record) — smaller, but requires a sequential file underneath to find the exact record from the block start.</td></tr>
    </table>

    <h3>B-tree and B+-tree</h3>
    <p>Both are balanced, multi-way search trees — every leaf is at the same depth, guaranteeing predictable I/O cost — but they differ in one critical way:</p>
    <ul>
      <li><strong>B-tree</strong> — data (or pointers to data) can live in internal nodes as well as leaves.</li>
      <li><strong>B+-tree</strong> — all actual data pointers live only in leaf nodes; internal nodes hold only routing keys. Leaf nodes are additionally linked in a chain, making range scans a simple leaf-to-leaf traversal instead of repeated tree descents.</li>
    </ul>
    <p>B+-trees are what virtually every real relational DBMS index actually uses, precisely because of that leaf-chaining property — range queries (<code>BETWEEN</code>, <code>ORDER BY</code>) become cheap sequential leaf scans.</p>
    <p>Both structures guarantee O(log n) search, insert, and delete, and self-balance via node splits/merges to stay within a fixed fan-out (order) range.</p>

    <h3>Hashing for file/index organization</h3>
    <table class="reftable">
      <tr><th>Type</th><th>How it handles growth</th><th>Weakness</th></tr>
      <tr><td>Static hashing</td><td>Fixed number of buckets, chosen up front.</td><td>Performance degrades badly as data grows past the planned capacity (overflow chains).</td></tr>
      <tr><td>Dynamic (extendible) hashing</td><td>Directory of bucket pointers doubles as needed; a global depth / local depth scheme lets buckets split individually.</td><td>Extra directory indirection level; more complex implementation.</td></tr>
      <tr><td>Linear hashing</td><td>Grows one bucket at a time in a predictable round-robin order, no directory needed.</td><td>Can leave some buckets more loaded than others between splits.</td></tr>
    </table>

    <div class="callout"><div class="ctitle">Beyond the syllabus: bitmap indexes</div>For columns with very few distinct values (e.g. gender, boolean flags, status codes), a bitmap index — one bit vector per distinct value, marking which rows have it — is far more compact and fast for AND/OR combination queries than a B+-tree would be. B+-trees win for high-cardinality columns (IDs, timestamps); bitmap indexes win for low-cardinality ones. This is a real interview question.</div>

<h3>Worked: computing B+ tree order and height</h3><div class="worked"><div class="wtitle">Worked example &mdash; how many disk reads to find a row in a million?</div><div class="codeblock"><pre>Block = 4096 bytes,  search key = 12 bytes,  pointer = 8 bytes.

A node with n pointers holds n-1 keys, so:

    (n-1) * 12  +  n * 8   &lt;=  4096
        12n - 12 + 8n      &lt;=  4096
               20n         &lt;=  4108
                 n         &lt;=  205.4

    ORDER n = 205 pointers per node  (204 keys)

Height for 1,000,000 records, assuming the usual worst-case
half-full assumption (ceil(n/2) = 103 pointers per node):

    leaf capacity      = 102 records
    leaves needed      = ceil(1,000,000 / 102) = 9,804
    level above        = ceil(9,804 / 103) = 96
    level above that   = ceil(96 / 103) = 1          &lt;- root
    HEIGHT = 3 levels

At 100% occupancy the same index needs only 3 levels.

Why this matters: 3 levels means a point lookup costs 3 block
reads -- and the root (and usually the whole second level) stays
cached in memory, so in practice it is closer to ONE disk read.
A million-row table is searched in a single I/O.</pre></div></div><h3>Worked: a node split, step by step</h3><div class="worked"><div class="wtitle">Worked example &mdash; insertion causing a leaf split</div><div class="codeblock"><pre>Inserting into a B+ tree of order 4 (max 3 keys per node).

Start:            [ 10 | 20 | 30 ]        (leaf is full)

Insert 25:
  1. 25 belongs in this leaf, but there is no room.
  2. SPLIT the leaf at the midpoint:
         left  [ 10 | 20 ]      right [ 25 | 30 ]
  3. COPY UP the smallest key of the right half (25) into the parent.
     (In a B+ tree the key is COPIED, not moved -- every key must
      still appear in a leaf. In a B-tree it would be MOVED UP.)

         parent          [ 25 ]
                        /      \\
             [ 10 | 20 ]        [ 25 | 30 ]
                        &lt;-------&gt;
                        leaves stay linked for range scans

If the parent were also full, the split propagates upward; if the
root splits, the tree grows one level. This is why B+ trees stay
perfectly balanced -- they grow at the ROOT, never at the leaves.</pre></div></div><h3>Choosing an index type</h3><table class="reftable"><tr><th>Structure</th><th>Equality lookup</th><th>Range scan</th><th>Notes</th></tr><tr><td>B+ tree</td><td>O(log n) &mdash; 3&ndash;4 I/O</td><td><span class="ok">Excellent</span> &mdash; walk linked leaves</td><td>The default for a reason</td></tr><tr><td>Hash index</td><td><span class="ok">O(1) &mdash; ~1 I/O</span></td><td><span class="bad">Useless</span> &mdash; hashing destroys order</td><td>Only for <code>=</code> predicates</td></tr><tr><td>Bitmap</td><td>Fast for low cardinality</td><td>N/A</td><td>Cheap AND/OR across columns</td></tr></table><div class="callout"><div class="ctitle">The fanout insight</div>B+ trees are shallow because the fanout is huge &mdash; roughly 200 here. Height grows with log<sub>200</sub>(n), so going from a million to a <em>billion</em> rows adds only one level. That is the whole reason databases use B+ trees rather than binary trees, whose height would be ~20 for the same data.</div>

<div class="takeaways"><div class="tk-title">Key takeaways</div><ul><li>Order n from (n&minus;1)&middot;key + n&middot;pointer &le; block size.</li><li>A B+ tree over a million rows is typically <strong>3 levels</strong> &mdash; and the upper levels are cached, so lookups approach one physical I/O.</li><li>B+ trees store data only in <strong>linked leaves</strong>, making range scans a linear walk.</li><li>Splits copy the separator <em>up</em> in a B+ tree (B-trees move it), and the tree grows at the root.</li><li>Hash indexes beat B+ trees for equality only, and are useless for ranges and ORDER BY.</li><li>Bitmap indexes suit low-cardinality columns; B+ trees waste space there.</li></ul></div>`,
    quiz: [
      { q: `What is the defining structural difference between a B-tree and a B+-tree?`, options: ["B+-trees are not balanced", "In a B+-tree, all data pointers live only in leaf nodes (leaves are also linked), while B-trees can store data in internal nodes too", "B-trees only support equality search", "B+-trees have no internal nodes"], answer: 1, explain: `That leaf-only-data-plus-linked-leaves design is exactly why B+-trees dominate real database indexes — range scans become a simple linear walk across linked leaves instead of repeated tree traversals.` },
      { q: `A sparse index requires the underlying file to be:`, options: ["Hashed", "Sequentially ordered on the search key", "Stored entirely in memory", "Unordered (heap)"], answer: 1, explain: `A sparse index only has one entry per block, not per record — to actually locate a specific record within that block, the DBMS must scan sequentially from the block's start, which only works if the file is sorted on that key.` },
      { q: `For a boolean "is_active" column with only two distinct values across 50 million rows, which index type is typically most space- and query-efficient?`, options: ["B+-tree", "Bitmap index", "Sparse index", "Hashed index"], answer: 1, explain: `Bitmap indexes are built exactly for low-cardinality columns — a compact bit vector per distinct value, and cheap bitwise AND/OR across multiple bitmap conditions. A B+-tree on a 2-value column wastes space and gives little selectivity benefit.` },
    ],
    practice: [
      { prompt: `You have a table with 10 million rows and need to support both frequent exact-match lookups on <code>order_id</code> (primary key) and frequent range queries like "orders placed between two dates" on <code>order_date</code>. Design an indexing strategy — which type(s) on which column(s), and why.`, solution: `<strong>order_id (PK, exact-match lookups):</strong> a B+-tree primary/clustering index — exact match is O(log n), and since it's the primary key you likely want the table physically clustered on it anyway for fast point lookups.<br><br>
     <strong>order_date (range queries):</strong> a B+-tree <em>secondary</em> index on order_date. The leaf-chaining property is exactly what makes "between two dates" cheap — once you find the starting leaf via the tree, you walk the linked leaves forward until you pass the end date, touching only relevant leaf blocks.<br><br>
     A hashed index would be wrong for order_date specifically — hashing destroys ordering, so a range query would degrade to a near-full scan. Hashing would only make sense if all your order_date queries were exact-match (rare in practice).` },
      { prompt: `Explain, step by step, why a static hash file with 100 buckets starts to perform badly once the table grows to 5× its originally planned size — and how dynamic (extendible) hashing avoids the same fate.`, solution: `<strong>Static hashing failure mode:</strong> the bucket count (100) was fixed at creation time based on expected size. As rows grow to 5× the plan, each bucket's expected load also grows roughly 5×, causing buckets to overflow their allocated space. Overflow is typically handled with chained overflow blocks — but every overflow block added means an extra disk access on every lookup that hashes into that bucket, degrading search from near-O(1) toward O(n) in the worst affected buckets.<br><br>
     <strong>Dynamic (extendible) hashing fix:</strong> instead of a fixed bucket count, a directory of bucket pointers can double in size on demand (tracked via a "global depth"), and individual overflowing buckets can split independently (tracked via each bucket's own "local depth") without touching every other bucket. Growth is absorbed incrementally and locally, so lookup cost stays close to O(1) even as the table grows well past its original planned size.` },
    ],
  },
  {
    id: "m11",
    unit: "u4",
    num: "11",
    title: "Transactions & ACID",
    syllabus: true,
    meta: "Transaction states · ACID · serializability · schedule properties",
    notes: `
    <div class="starter">
    <div class="defbox"><div class="dlabel">Definition &mdash; in plain English</div>A <strong>transaction</strong> is a group of database operations that must succeed or fail <em>as one unit</em>. The <strong>ACID</strong> properties are the contract: Atomicity (all or nothing), Consistency (rules never end up violated), Isolation (concurrent transactions don't corrupt each other), Durability (once committed, survives crashes). <strong>Serializability</strong> is the correctness yardstick for running transactions at the same time.</div>
    <div class="intuitbox"><div class="dlabel">Intuition &mdash; how to think about it</div>The classic picture is a <strong>bank transfer</strong>: move &#8377;500 from A to B = debit A, credit B. If the system dies between the two steps, money has vanished &mdash; unacceptable. Atomicity makes the pair a single indivisible action: both happen or neither does. Isolation answers a different question: if two transfers run <em>simultaneously</em>, could they interleave into nonsense? A schedule is <strong>serializable</strong> if its outcome equals <em>some</em> one-at-a-time ordering &mdash; concurrency for speed, with the safety of a queue. COMMIT means 'make it permanent'; ROLLBACK means 'pretend I never started'.</div>
    <h3 class="kt-head">Key terms you must know</h3>
    <table class="reftable"><tr><th>Term</th><th>Meaning</th></tr><tr><td><strong>Transaction</strong></td><td>A logical unit of work: one or more reads/writes treated as indivisible.</td></tr><tr><td><strong>Atomicity</strong></td><td>All operations happen, or none do.</td></tr><tr><td><strong>Consistency</strong></td><td>A transaction takes the DB from one valid state to another.</td></tr><tr><td><strong>Isolation</strong></td><td>Concurrent transactions behave as if they ran alone.</td></tr><tr><td><strong>Durability</strong></td><td>Committed changes survive power loss and crashes.</td></tr><tr><td><strong>COMMIT / ROLLBACK</strong></td><td>Finalize a transaction / undo it completely.</td></tr><tr><td><strong>Schedule</strong></td><td>The interleaved order of operations from concurrent transactions.</td></tr><tr><td><strong>Serializable schedule</strong></td><td>Equivalent to some serial (one-by-one) execution &mdash; the gold standard.</td></tr><tr><td><strong>Dirty read</strong></td><td>Reading data written by a transaction that hasn't committed (and may vanish).</td></tr></table>
    </div>

    <h3>What a transaction is</h3>
    <p>A transaction is a single logical unit of work — a sequence of one or more operations (reads/writes) that must execute as an indivisible whole. The canonical example: transferring money between two bank accounts is <em>two</em> writes (debit A, credit B) that must both happen, or neither.</p>

    <h3>Transaction states</h3>
    <div class="codeblock">Active → Partially Committed → Committed
   ↓             ↓
 Failed  →  Aborted (rolled back)</div>
    <p><strong>Active</strong>: executing. <strong>Partially committed</strong>: last statement executed, but not yet durably written. <strong>Committed</strong>: durably persisted, success. <strong>Failed</strong>: normal execution can't continue. <strong>Aborted</strong>: rolled back to before the transaction started, database restored to its prior consistent state.</p>

    <h3>ACID properties</h3>
    <table class="reftable">
      <tr><th>Property</th><th>Guarantees</th></tr>
      <tr><td><strong>A</strong>tomicity</td><td>All of a transaction's operations happen, or none do — no partial effects survive a failure.</td></tr>
      <tr><td><strong>C</strong>onsistency</td><td>A transaction takes the database from one valid state to another, respecting all declared constraints.</td></tr>
      <tr><td><strong>I</strong>solation</td><td>Concurrently running transactions don't see each other's intermediate, uncommitted state.</td></tr>
      <tr><td><strong>D</strong>urability</td><td>Once committed, changes survive any subsequent crash — must be on stable storage.</td></tr>
    </table>
    <p>Atomicity + Durability are enforced by the <strong>recovery manager</strong> (Module 13). Isolation is enforced by <strong>concurrency control</strong> (Module 12). Consistency is a joint responsibility — partly the application (writing correct transactions), partly the DBMS (enforcing constraints).</p>

    <h3>Schedules</h3>
    <p>A <strong>schedule</strong> is the actual chronological interleaving of operations from multiple concurrent transactions.</p>
    <ul>
      <li><strong>Serial schedule</strong> — transactions run one completely after another, no interleaving. Always correct, but no concurrency benefit.</li>
      <li><strong>Non-serial (concurrent) schedule</strong> — operations interleaved for throughput; correctness now needs to be verified.</li>
      <li><strong>Serializable schedule</strong> — a non-serial schedule whose <em>effect</em> is equivalent to some serial schedule. This is the actual goal: get concurrency's speed with serial execution's guaranteed correctness.</li>
    </ul>

    <h3>Testing serializability — conflict vs view</h3>
    <ul>
      <li><strong>Conflicting operations</strong> — two operations from different transactions on the same data item, at least one a write.</li>
      <li><strong>Conflict serializability</strong> — a schedule can be transformed into a serial schedule by swapping non-conflicting adjacent operations. Tested via a <strong>precedence graph</strong>: a node per transaction, an edge Ti→Tj if Ti has an operation that conflicts with, and comes before, one of Tj's. <strong>The schedule is conflict-serializable iff this graph has no cycle.</strong></li>
      <li><strong>View serializability</strong> — a weaker, less commonly tested condition based on read-from relationships and final writes; every conflict-serializable schedule is view-serializable, but not vice versa.</li>
    </ul>

    <h3>Recoverability of schedules</h3>
    <ul>
      <li><strong>Recoverable schedule</strong> — if Tj reads a value written by Ti, Ti must commit before Tj commits (otherwise a rollback of Ti after Tj commits leaves an uncommittable inconsistency).</li>
      <li><strong>Cascadeless schedule</strong> — stronger: Tj can only read a value from Ti <em>after</em> Ti has already committed — eliminates cascading rollbacks entirely.</li>
      <li><strong>Strict schedule</strong> — strongest: even overwriting an uncommitted write is disallowed until the writer commits or aborts.</li>
    </ul>

<h3>Worked: testing conflict serializability with a precedence graph</h3><div class="worked"><div class="wtitle">Worked example &mdash; a serializable schedule</div><div class="codeblock"><pre>Schedule S1:
  r1(A) w1(A) r2(A) w2(A) r1(B) w1(B) r2(B) w2(B)

Conflicting pairs (same item, at least one write, different txns):
  r1(A) before w2(A)   =&gt;  edge T1 -&gt; T2
  w1(A) before r2(A)   =&gt;  edge T1 -&gt; T2
  w1(A) before w2(A)   =&gt;  edge T1 -&gt; T2
  r1(B) before w2(B)   =&gt;  edge T1 -&gt; T2
  w1(B) before r2(B)   =&gt;  edge T1 -&gt; T2
  w1(B) before w2(B)   =&gt;  edge T1 -&gt; T2

Precedence graph edges: T1-&gt;T2
Cycle present? NO

=&gt; CONFLICT-SERIALIZABLE, equivalent to the serial order T1 then T2</pre></div></div><div class="worked"><div class="wtitle">Worked example &mdash; a non-serializable schedule</div><div class="codeblock"><pre>Schedule S2:
  r1(A) w2(A) w1(A) r2(B) w1(B) w2(B)

Conflicting pairs (same item, at least one write, different txns):
  r1(A) before w2(A)   =&gt;  edge T1 -&gt; T2
  w2(A) before w1(A)   =&gt;  edge T2 -&gt; T1
  r2(B) before w1(B)   =&gt;  edge T2 -&gt; T1
  w1(B) before w2(B)   =&gt;  edge T1 -&gt; T2

Precedence graph edges: T1-&gt;T2, T2-&gt;T1
Cycle present? YES

   T1 -&gt; T2 (w1(A) then ... no) and T2 -&gt; T1 both appear.
=&gt; NOT conflict-serializable: no serial order can satisfy both.</pre></div></div><div class="callout"><div class="ctitle">The method, in four steps</div>(1) List every pair of operations on the <em>same data item</em> from <em>different transactions</em> where at least one is a write. (2) Draw edge T<sub>i</sub>&rarr;T<sub>j</sub> for each, in schedule order. (3) Look for a cycle. (4) No cycle &rArr; conflict-serializable, and any topological order of the graph is an equivalent serial schedule.</div><h3>Isolation levels and the anomalies they permit</h3><table class="reftable"><tr><th>Isolation level</th><th>Dirty read</th><th>Non-repeatable read</th><th>Phantom read</th><th>Typical implementation</th></tr><tr><td>READ UNCOMMITTED</td><td><span class="bad">possible</span></td><td><span class="bad">possible</span></td><td><span class="bad">possible</span></td><td>no read locks at all</td></tr><tr><td>READ COMMITTED</td><td><span class="ok">prevented</span></td><td><span class="bad">possible</span></td><td><span class="bad">possible</span></td><td>short read locks, or MVCC snapshot per statement</td></tr><tr><td>REPEATABLE READ</td><td><span class="ok">prevented</span></td><td><span class="ok">prevented</span></td><td><span class="bad">possible*</span></td><td>long read locks, or MVCC snapshot per transaction</td></tr><tr><td>SERIALIZABLE</td><td><span class="ok">prevented</span></td><td><span class="ok">prevented</span></td><td><span class="ok">prevented</span></td><td>predicate/range locks, or SSI</td></tr></table><p class="fine">*Under the SQL standard REPEATABLE READ permits phantoms. InnoDB's next-key locking and PostgreSQL's snapshot isolation both prevent them in practice, which is a common source of confusion between the standard and real engines.</p><div class="codeblock"><pre>The three read anomalies, precisely:

DIRTY READ            T2 reads a value T1 wrote but has not committed.
                      If T1 aborts, T2 acted on data that never existed.
   T1: w(A=200)
   T2:            r(A)=200        &lt;-- dirty
   T1: abort                      &lt;-- A reverts; T2 is now wrong

NON-REPEATABLE READ   T2 reads the SAME ROW twice and gets different values,
                      because T1 committed an UPDATE in between.
   T2: r(A)=100
   T1: w(A=200), commit
   T2: r(A)=200                   &lt;-- same query, different answer

PHANTOM READ          T2 runs the SAME QUERY twice and gets a different SET
                      OF ROWS, because T1 committed an INSERT/DELETE matching
                      the predicate.
   T2: SELECT count(*) FROM emp WHERE dept=3   -&gt; 5
   T1: INSERT INTO emp(dept) VALUES (3), commit
   T2: SELECT count(*) FROM emp WHERE dept=3   -&gt; 6   &lt;-- phantom

The distinction that gets tested: non-repeatable read is about a ROW changing;
phantom is about the ROW SET changing. Row locks stop the first but not the
second -- you need predicate/range locks (or SSI) to stop phantoms.</pre></div>

<div class="takeaways"><div class="tk-title">Key takeaways</div><ul><li><strong>ACID</strong>: Atomicity and Durability come from the recovery manager, Isolation from concurrency control, Consistency is shared with the application.</li><li>A schedule is <strong>conflict-serializable</strong> iff its precedence graph is acyclic.</li><li>Only operations on the same item, from different transactions, with at least one write, conflict.</li><li>Any topological order of an acyclic precedence graph is an equivalent serial schedule.</li><li><strong>Non-repeatable read</strong> = a row changed. <strong>Phantom</strong> = the row set changed.</li><li>Recoverable schedule: never commit before every transaction you read from has committed.</li></ul></div>`,
    quiz: [
      { q: `Which ACID property is directly enforced by the concurrency control subsystem (Module 12), as opposed to the recovery manager?`, options: ["Atomicity", "Isolation", "Durability", "Consistency, entirely"], answer: 1, explain: `Isolation — keeping concurrent transactions from seeing each other's uncommitted intermediate state — is precisely concurrency control's job. Atomicity and durability are recovery manager responsibilities.` },
      { q: `In a precedence graph built to test conflict serializability, what does a cycle indicate?`, options: ["The schedule is definitely conflict-serializable", "The schedule is NOT conflict-serializable — no equivalent serial ordering exists", "The transactions will deadlock at runtime", "Nothing; cycles are ignored in this test"], answer: 1, explain: `A cycle means Ti must conceptually come both before and after Tj (directly or transitively) — impossible in any serial ordering, so no equivalent serial schedule exists. Acyclic ⟺ conflict-serializable.` },
      { q: `A schedule where Tj reads data written by Ti, and Tj commits before Ti commits, is:`, options: ["Always fine, no issue", "Not recoverable — if Ti later aborts, Tj has already committed based on a value that never really existed durably", "Automatically cascadeless", "Strict by definition"], answer: 1, explain: `This is the exact failure recoverability is defined to prevent: once Tj commits, it cannot be undone, but it depended on Ti's uncommitted write — if Ti then aborts, there's no way to fix the now-permanent Tj.` },
    ],
    practice: [
      { prompt: `Given schedule S: R1(A), W2(A), W1(A), R2(B), W1(B), commit T1, commit T2 (Ti(x) = transaction i's operation on item x) — determine whether S is conflict-serializable by building the precedence graph.`, solution: `<strong>Identify conflicting pairs (same item, at least one write, different transactions, in schedule order):</strong><br>
     • R1(A) before W2(A) → conflict on A → edge T1 → T2<br>
     • W2(A) before W1(A) → conflict on A → edge T2 → T1<br><br>
     <strong>Precedence graph:</strong> T1 → T2 and T2 → T1 — a 2-node cycle.<br><br>
     <strong>Conclusion:</strong> S is <strong>NOT conflict-serializable</strong>. Intuitively: T1 reads A before T2's write, but then T1 itself writes A after T2 — there's no way to order T1 and T2 serially that respects both facts simultaneously.` },
      { prompt: `Explain, with a two-transaction example, why a "recoverable but not cascadeless" schedule is considered dangerous in practice even though it technically satisfies the recoverability condition.`, solution: `<strong>Example schedule:</strong> W1(A)=100, R2(A) [T2 reads A=100, still uncommitted], W2(B) based on A, commit T2, then T1 aborts.<br><br>
     This schedule IS recoverable in the strict definitional sense only if T1 commits before T2 does — but if the interleaving instead lets T2 commit first (having read T1's uncommitted write), and T1 then aborts, the schedule was never actually recoverable to begin with; more commonly the danger scenario is: T2 reads T1's uncommitted A, and before either commits, T1 aborts. Now T2's read was based on a value that officially never existed. If T2 has already propagated that value further (e.g. displayed it, or a third transaction T3 read from T2), <strong>every dependent transaction must also cascade-abort</strong> — potentially unwinding a long chain of otherwise-fine work. Cascadeless schedules prevent this entirely by only allowing reads of already-committed data, at the cost of slightly reduced concurrency (readers must wait for writers to commit).` },
    ],
  },
  {
    id: "m12",
    unit: "u4",
    num: "12",
    title: "Concurrency Control",
    syllabus: true,
    meta: "2PL · timestamp ordering · validation · multiversion · granularity",
    notes: `
    <div class="starter">
    <div class="defbox"><div class="dlabel">Definition &mdash; in plain English</div><strong>Concurrency control</strong> is how the DBMS lets many transactions run at once <em>without</em> producing wrong results. The main tool is <strong>locking</strong>: shared (S) locks for reading, exclusive (X) locks for writing, coordinated by <strong>two-phase locking (2PL)</strong>. Alternatives include timestamp ordering and multiversion schemes (MVCC).</div>
    <div class="intuitbox"><div class="dlabel">Intuition &mdash; how to think about it</div>Locks are <strong>library rules</strong>: many people may read the same reference book together (shared lock), but someone editing it needs it checked out exclusively (exclusive lock) &mdash; and while they hold it, nobody else may even read. Two-phase locking adds one discipline: <strong>collect all the locks you need first (growing phase), and once you release any, you may not acquire more (shrinking phase)</strong> &mdash; this single rule guarantees serializability. The price is <strong>deadlock</strong>: T1 holds A and wants B, T2 holds B and wants A &mdash; two people each holding one chopstick, waiting forever for the other. The system breaks the tie by picking a victim and rolling it back.</div>
    <h3 class="kt-head">Key terms you must know</h3>
    <table class="reftable"><tr><th>Term</th><th>Meaning</th></tr><tr><td><strong>S lock / X lock</strong></td><td>Shared = many readers together; exclusive = one writer, no one else.</td></tr><tr><td><strong>2PL</strong></td><td>Two-phase locking: grow (acquire only), then shrink (release only). Guarantees serializability.</td></tr><tr><td><strong>Strict 2PL</strong></td><td>Hold X locks until commit &mdash; also prevents cascading rollbacks. What real systems use.</td></tr><tr><td><strong>Deadlock</strong></td><td>A cycle of transactions each waiting for the other's lock. Detected via waits-for graph; a victim is aborted.</td></tr><tr><td><strong>Timestamp ordering</strong></td><td>Order conflicts by transaction start time instead of locks.</td></tr><tr><td><strong>MVCC</strong></td><td>Keep old versions so readers never block writers &mdash; used by PostgreSQL, Oracle, MySQL/InnoDB.</td></tr><tr><td><strong>Lock granularity</strong></td><td>Lock a row, page, or whole table; intention locks make mixing sizes safe.</td></tr></table>
    </div>

    <h3>Lock-based protocols</h3>
    <table class="reftable">
      <tr><th>Lock type</th><th>Behavior</th></tr>
      <tr><td>Shared (S) lock</td><td>Multiple transactions can hold an S-lock on the same item simultaneously — allows concurrent reads.</td></tr>
      <tr><td>Exclusive (X) lock</td><td>Only one transaction can hold an X-lock; no other lock (S or X) can be held simultaneously — required for writes.</td></tr>
    </table>

    <h3>Two-Phase Locking (2PL)</h3>
    <p>Every transaction is split into two phases:</p>
    <ul>
      <li><strong>Growing phase</strong> — a transaction may acquire locks, but release none.</li>
      <li><strong>Shrinking phase</strong> — a transaction may release locks, but acquire none.</li>
    </ul>
    <p><strong>Theorem: 2PL guarantees conflict-serializability</strong> — this is the whole reason it's the industry-standard baseline. But basic 2PL is still vulnerable to cascading rollbacks, since it allows releasing a lock (and thus another transaction reading that data) before commit.</p>
    <table class="reftable">
      <tr><th>Variant</th><th>Rule</th><th>Guarantees</th></tr>
      <tr><td>Basic 2PL</td><td>Growing then shrinking, no other constraint.</td><td>Conflict-serializability only.</td></tr>
      <tr><td>Strict 2PL</td><td>All X-locks held until commit/abort.</td><td>Serializability + cascadelessness (avoids dirty reads of writes).</td></tr>
      <tr><td>Rigorous 2PL</td><td>ALL locks (S and X) held until commit/abort.</td><td>Serializability + strictness — the strongest, most common in practice.</td></tr>
    </table>

    <h3>Deadlock</h3>
    <p>2PL's growing/shrinking discipline solves serializability but introduces deadlock risk (two transactions each holding a lock the other needs).</p>
    <ul>
      <li><strong>Prevention</strong> — impose an ordering on transactions to rule out deadlock structurally: <strong>wait-die</strong> (older transaction waits for younger; younger dies and restarts if it needs a lock held by older) or <strong>wound-wait</strong> (older transaction "wounds" — forces abort of — younger; younger waits for older).</li>
      <li><strong>Detection</strong> — periodically build a <strong>wait-for graph</strong> (edge Ti→Tj if Ti waits for a lock Tj holds); a cycle means deadlock, resolved by aborting a "victim" transaction.</li>
      <li><strong>Avoidance</strong> — similar to OS resource allocation (Banker's-algorithm style), rarely used for DB locking specifically since it requires knowing resource needs in advance.</li>
      <li><strong>Timeout-based</strong> — simplest, crudest: abort a transaction if it waits too long, regardless of whether it's actually deadlocked.</li>
    </ul>

    <h3>Timestamp ordering protocol</h3>
    <p>No locks at all — each transaction gets a unique timestamp at start; every data item tracks the highest read-timestamp (R-TS) and write-timestamp (W-TS) it has seen. A read/write is only allowed if it doesn't violate timestamp order (i.e. an operation from an "older" transaction arriving "too late" relative to a "younger" one that already touched the item gets rejected and that transaction restarted with a fresh timestamp). Guarantees serializability equivalent to timestamp order, deadlock-free by construction (no waiting), but can cause more restarts under high contention.</p>

    <h3>Validation (optimistic) technique</h3>
    <p>Bet that conflicts are rare: let transactions run freely against private copies, then at commit time run three phases —</p>
    <ol>
      <li><strong>Read phase</strong> — read values, compute writes, but only to a local workspace.</li>
      <li><strong>Validation phase</strong> — check that this transaction's read/write set doesn't conflict with concurrently validated transactions.</li>
      <li><strong>Write phase</strong> — if validation passes, apply writes to the real database.</li>
    </ol>
    <p>Best when conflicts are genuinely rare (low contention workloads) — no locking overhead during execution, but a failed validation means discarding all the transaction's work and restarting.</p>

    <h3>Multiple granularity locking</h3>
    <p>Locks can be requested at different levels of a hierarchy: database → table → page/block → row. Locking the whole table is coarse (cheap to manage, blocks concurrency); locking individual rows is fine-grained (expensive to manage many locks, high concurrency). <strong>Intention locks</strong> (IS, IX, SIX) are placed on ancestor nodes to signal "a finer-grained lock exists somewhere below me," letting the system quickly detect conflicts without scanning every descendant.</p>

    <h3>Multiversion concurrency control (MVCC)</h3>
    <p>Instead of blocking readers behind writers, keep multiple versions of each data item. A read always sees a consistent snapshot as of its start time (or its transaction's timestamp), while writers create new versions rather than overwriting in place. This is how most modern production databases (PostgreSQL, MySQL/InnoDB, Oracle) actually implement isolation in practice — readers essentially never block writers and vice versa, at the cost of extra storage for old versions and periodic garbage collection (vacuuming) of versions no longer visible to any active transaction.</p>

<h3>Worked: a strict 2PL schedule, lock by lock</h3><div class="worked"><div class="wtitle">Worked example &mdash; why strict 2PL prevents cascading aborts</div><div class="codeblock"><pre>Two transactions under STRICT 2PL. Lock modes: S = shared, X = exclusive.

 time  T1                      T2                      lock table
 ----  ----------------------  ----------------------  --------------------
  1    lock-X(A)  granted                              A: X by T1
  2    read(A)
  3    write(A)
  4                            lock-S(A)  BLOCKED      T2 waits on A
  5    lock-X(B)  granted                              A: X by T1, B: X by T1
  6    write(B)
  7    COMMIT -&gt; release all                           (locks freed)
  8                            lock-S(A)  granted      A: S by T2
  9                            read(A)                 sees T1&#x27;s committed value
 10                            COMMIT

GROWING phase for T1 = steps 1..6 (acquires, never releases)
SHRINKING phase      = step 7 only (strict 2PL defers ALL releases to commit)

Because T1 held its X-locks until commit, T2 could never read an
uncommitted value =&gt; no dirty read, no cascading abort.

Basic 2PL would allow releasing A at step 5, letting T2 read it at
step 6 -- and if T1 then aborted, T2 would have to abort too
(CASCADING ROLLBACK). That is precisely what strict 2PL buys you.</pre></div></div><h3>Worked: deadlock, and how wait-die / wound-wait break it</h3><div class="worked"><div class="wtitle">Worked example &mdash; the wait-for cycle</div><div class="codeblock"><pre>DEADLOCK under 2PL, and the two prevention schemes.

 T1 (older, ts=10)          T2 (younger, ts=20)
 lock-X(A)  granted
                            lock-X(B)  granted
 lock-X(B)  BLOCKED  &lt;-------------- held by T2
                            lock-X(A)  BLOCKED  &lt;---- held by T1

 Wait-for graph:   T1 -&gt; T2 -&gt; T1      CYCLE  =&gt;  DEADLOCK

WAIT-DIE  (non-preemptive; older waits, younger dies)
   T1 (older) requests B held by T2 (younger)  -&gt;  T1 WAITS
   T2 (younger) requests A held by T1 (older)  -&gt;  T2 DIES, restarts
   =&gt; cycle broken; the older transaction always makes progress

WOUND-WAIT (preemptive; older wounds, younger waits)
   T1 (older) requests B held by T2 (younger)  -&gt;  T2 is WOUNDED (aborted)
   T2 restarts later and waits for older transactions
   =&gt; cycle broken; again the older transaction wins

Both schemes use timestamps to impose a total order, making a cycle
structurally impossible. Neither can starve a transaction, because a
restarted transaction KEEPS ITS ORIGINAL TIMESTAMP -- so it grows
older and eventually always wins.</pre></div></div><h3>Worked: timestamp ordering rejects a late read</h3><div class="worked"><div class="wtitle">Worked example &mdash; lock-free concurrency control</div><div class="codeblock"><pre>TIMESTAMP ORDERING. Each item X keeps R-TS(X) and W-TS(X).
TS(T1)=10, TS(T2)=20.  Initially R-TS(A)=W-TS(A)=0.

 op        rule checked                              outcome
 --------  ----------------------------------------  --------------------
 r2(A)     TS(T2)=20 &gt;= W-TS(A)=0        OK          read; R-TS(A)=20
 w2(A)     TS(T2)=20 &gt;= R-TS(A)=20       OK          write; W-TS(A)=20
 r1(A)     TS(T1)=10 &lt;  W-TS(A)=20       VIOLATION   T1 ROLLED BACK
                                                     (it would read a value
                                                      written by a younger txn
                                                      -- too late)
 w1(A)     TS(T1)=10 &lt;  R-TS(A)=20       VIOLATION   would also be rejected

Rules, stated once:
   read(X)  by T:  reject if TS(T) &lt; W-TS(X), else read and
                   R-TS(X) = max(R-TS(X), TS(T))
   write(X) by T:  reject if TS(T) &lt; R-TS(X) or TS(T) &lt; W-TS(X),
                   else write and W-TS(X) = TS(T)

Deadlock-free by construction (nobody ever waits) -- but restart-prone
under contention, which is the tradeoff against locking.</pre></div></div>

<div class="takeaways"><div class="tk-title">Key takeaways</div><ul><li>2PL guarantees conflict-serializability but <strong>not</strong> deadlock-freedom.</li><li><strong>Strict 2PL</strong> holds X-locks to commit &rarr; no cascading aborts. <strong>Rigorous</strong> holds all locks &rarr; strongest, and the common default.</li><li>A cycle in the <strong>wait-for graph</strong> is a deadlock; break it by aborting a victim.</li><li>Wait-die and wound-wait both use timestamps to make cycles structurally impossible.</li><li>Restarted transactions keep their original timestamp, which is what prevents starvation.</li><li>Timestamp ordering never waits, so it cannot deadlock &mdash; but it restarts heavily under contention.</li></ul></div>`,
    quiz: [
      { q: `What does the "two-phase" in Two-Phase Locking actually guarantee, and what does it NOT automatically prevent?`, options: ["It guarantees serializability but not deadlock-freedom", "It guarantees deadlock-freedom but not serializability", "It guarantees both serializability and deadlock-freedom", "It guarantees neither, it's purely a naming convention"], answer: 0, explain: `The growing/shrinking discipline is exactly what forces conflict-serializability (provable theorem) — but nothing about that discipline prevents two transactions from each waiting on a lock the other holds, so deadlock remains possible and must be handled separately.` },
      { q: `Under wound-wait deadlock prevention, if an older transaction Ti requests a lock held by a younger transaction Tj:`, options: ["Ti waits for Tj to finish", "Tj is forced to abort (\"wounded\"), and Ti proceeds", "Ti is aborted instead", "Both transactions are aborted"], answer: 1, explain: `Wound-wait: older wounds (forces abort of) younger when older needs a lock younger holds. (The complementary case — younger requesting a lock held by older — has the younger transaction wait.)` },
      { q: `Optimistic (validation-based) concurrency control is best suited to workloads where:`, options: ["Conflicts between transactions are frequent and predictable", "Conflicts are rare, so the cost of occasionally restarting a transaction is lower than constant locking overhead", "All transactions are read-only", "Deadlock must be structurally impossible"], answer: 1, explain: `Optimistic control bets against contention — no locking cost during execution, but a failed validation discards all work done so far. Under high-conflict workloads, that discard cost dominates and pessimistic (lock-based) approaches usually win instead.` },
    ],
    practice: [
      { prompt: `Two transactions: T1 wants to update a row it currently holds a shared lock on ("lock upgrade" from S to X); T2 concurrently also wants to upgrade its S-lock on the same row to X. Explain the deadlock this creates and name the classic term for it.`, solution: `Both T1 and T2 hold S-locks on the same row simultaneously (S-locks are compatible with each other, so both were granted). Each now wants to upgrade to X, which requires being the <em>sole</em> lock holder — so each must wait for the other's S-lock to be released before its own upgrade can proceed. Neither will release its S-lock (each is waiting to upgrade, not to finish), so both wait forever. This is the classic <strong>"conversion deadlock" / "upgrade deadlock"</strong> pattern — one of the most common real deadlocks in practice (e.g. two transactions both running <code>SELECT ... FOR UPDATE</code>-style reads on the same row before writing). Real systems typically avoid it either by detecting and aborting one party, or by disallowing S-lock coexistence when an upgrade is pending (a form of upgrade-lock priority).` },
      { prompt: `Contrast strict 2PL with MVCC on one specific point: what happens to a long-running read transaction when a concurrent write transaction wants to modify the same row, under each scheme?`, solution: `<strong>Strict 2PL:</strong> the reader holds an S-lock until it commits. The writer's X-lock request on that row is blocked and must wait until the reader commits (releasing its lock) — the writer is stalled for the reader's entire remaining duration.<br><br>
     <strong>MVCC:</strong> the reader is working against a snapshot version taken at its start time. The writer can proceed immediately, creating a <em>new version</em> of the row rather than overwriting the one the reader is using — the reader keeps seeing its original consistent snapshot, the writer is never blocked by the reader, and vice versa. This is precisely why MVCC-based systems are favored for read-heavy, high-concurrency production workloads — readers and writers stop blocking each other, at the cost of storing (and eventually garbage-collecting) multiple row versions.` },
    ],
  },
  {
    id: "m13",
    unit: "u4",
    num: "13",
    title: "Crash Recovery",
    syllabus: true,
    meta: "Log-based recovery · WAL · checkpoints · shadow paging",
    notes: `
    <div class="starter">
    <div class="defbox"><div class="dlabel">Definition &mdash; in plain English</div><strong>Crash recovery</strong> is how a database keeps its ACID promises when the power dies mid-flight. The core mechanism is the <strong>log</strong>: an append-only journal of every change, governed by <strong>write-ahead logging (WAL)</strong> &mdash; the log record must reach disk before the data page it describes. After a crash: <strong>redo</strong> committed work, <strong>undo</strong> uncommitted work.</div>
    <div class="intuitbox"><div class="dlabel">Intuition &mdash; how to think about it</div>Recovery is a <strong>ship's logbook</strong>. Before touching anything, the crew writes down what they are about to do; if the ship loses power, the recovered logbook tells exactly which actions completed and which were mid-flight. WAL is the iron rule 'write the diary entry before doing the deed' &mdash; if the deed happened, there is guaranteed to be a diary entry to undo or redo it. Restart is then mechanical: transactions whose COMMIT is in the log get <em>redone</em> (their changes may not have reached the data files); transactions with no COMMIT get <em>undone</em> (their partial changes must vanish). A <strong>checkpoint</strong> is a bookmark saying 'everything before here is already safe on disk', so recovery doesn't replay history from day one.</div>
    <h3 class="kt-head">Key terms you must know</h3>
    <table class="reftable"><tr><th>Term</th><th>Meaning</th></tr><tr><td><strong>Log</strong></td><td>Append-only record of every change: &lt;T, item, old value, new value&gt;.</td></tr><tr><td><strong>WAL</strong></td><td>Write-Ahead Logging: log record hits disk before the modified data page.</td></tr><tr><td><strong>Redo</strong></td><td>Reapply changes of committed transactions after a crash.</td></tr><tr><td><strong>Undo</strong></td><td>Reverse changes of transactions that never committed.</td></tr><tr><td><strong>Deferred vs immediate update</strong></td><td>Write data only after commit (undo never needed) vs write anytime (need both undo and redo).</td></tr><tr><td><strong>Checkpoint</strong></td><td>A synchronization point that bounds how far back recovery must scan.</td></tr><tr><td><strong>Shadow paging</strong></td><td>Alternative to logs: update a copy of pages, atomically swap the page table on commit.</td></tr></table>
    </div>

    <h3>Failure classification</h3>
    <ul>
      <li><strong>Transaction failure</strong> — logical error or deadlock victim; only that transaction's effects need undoing.</li>
      <li><strong>System crash</strong> — power loss, OS crash; volatile memory (buffer pool) contents lost, disk contents assumed intact.</li>
      <li><strong>Disk (media) failure</strong> — physical storage corrupted/lost; requires restoring from backup + replaying logs since that backup.</li>
    </ul>

    <h3>Log-based recovery & Write-Ahead Logging (WAL)</h3>
    <p>The core rule that makes recovery possible at all: <strong>a log record describing a write must reach stable storage before the actual data write it describes does.</strong> This way, even if the system crashes mid-write, the log has enough information to redo or undo that write on restart.</p>
    <p>A log record typically holds: transaction ID, data item, old value (for undo), new value (for redo).</p>
    <table class="reftable">
      <tr><th>Update strategy</th><th>Rule</th><th>Recovery needs</th></tr>
      <tr><td>Deferred update</td><td>Writes are buffered and only applied to the actual database after commit (write log first, then apply).</td><td>Only REDO of committed transactions is ever needed — nothing uncommitted was ever written to the DB.</td></tr>
      <tr><td>Immediate update</td><td>Writes may be applied to the database before commit, as long as the log record was written first.</td><td>Needs both UNDO (for uncommitted transactions active at crash time) and REDO (for committed ones not yet flushed to disk).</td></tr>
    </table>

    <h3>Checkpoints</h3>
    <p>Replaying the entire log from the beginning of time after every crash is unworkable. A <strong>checkpoint</strong> periodically: (1) forces all log records currently in memory to stable storage, (2) forces all modified buffer pages to disk, (3) writes a checkpoint record to the log. On recovery, you only need to scan back to the most recent checkpoint (plus track which transactions were active at that point) — not the entire log history.</p>

    <h3>Shadow paging</h3>
    <p>An alternative to logging entirely: maintain two page tables — a <strong>current page table</strong> (in use) and a <strong>shadow page table</strong> (untouched copy, from before the transaction started). Writes go to <em>new</em> disk blocks, never overwriting the original; the current page table is updated to point at these new blocks. On commit, the shadow table is simply discarded and the current table becomes the new shadow. On crash/abort before commit, just discard the current table — the shadow (original) is untouched and instantly valid, no undo needed at all.</p>
    <div class="callout"><div class="ctitle">Why shadow paging isn't the industry default</div>No undo logic needed sounds great, but: (1) data gets fragmented across disk since writes never reuse old blocks in place, hurting locality/performance; (2) it's inherently awkward with concurrent transactions (each would need its own shadow, or coordination overhead reappears); (3) garbage collection of abandoned old pages adds its own complexity. Log-based (WAL) recovery won out industry-wide because it composes far better with high-concurrency, high-throughput systems.</div>

    <h3>Buffer management & the two rules that matter most</h3>
    <ul>
      <li><strong>Force policy</strong> — must all of a transaction's modified pages be flushed to disk at commit time? "Force" simplifies recovery (no REDO needed) but hurts commit latency. Most systems are <strong>no-force</strong> (rely on WAL + REDO instead) for performance.</li>
      <li><strong>Steal policy</strong> — can an uncommitted transaction's modified pages be written to disk before commit (e.g. to free buffer space)? "No-steal" simplifies recovery (no UNDO needed) but limits buffer flexibility. Most systems are <strong>steal</strong> (rely on WAL + UNDO instead) for performance.</li>
    </ul>
    <p>Real systems (via the ARIES-style algorithm — beyond syllabus but the industry-standard name to know) are <strong>steal + no-force</strong>, which is the most performant but requires both UNDO and REDO logic — exactly why WAL is designed the way it is.</p>

<h3>Worked: full ARIES-style recovery from a real log</h3><div class="worked"><div class="wtitle">Worked example &mdash; analysis &rarr; redo &rarr; undo</div><div class="codeblock"><pre>A log with a checkpoint, then a crash. Deferred vs immediate matters,
so assume the industry-standard STEAL / NO-FORCE (undo+redo needed).

    &lt;T1 start&gt;
    &lt;T1, A, 100, 200&gt;          old=100  new=200
    &lt;T1 commit&gt;
    &lt;T2 start&gt;
    &lt;T2, B, 50, 80&gt;
    &lt;checkpoint {T2}&gt;          &lt;-- only T2 was active at this point
    &lt;T3 start&gt;
    &lt;T3, C, 10, 40&gt;
    &lt;T2, D, 5, 15&gt;
    &lt;T2 commit&gt;
    &lt;T4 start&gt;
    &lt;T4, E, 70, 90&gt;
    ***** CRASH *****

ANALYSIS pass -- start at the checkpoint, scan forward:
    active at checkpoint      = {T2}
    T3 start seen             -&gt; add T3
    T2 commit seen            -&gt; move T2 to committed
    T4 start seen             -&gt; add T4
    =&gt; REDO list  = {T2}            committed after the checkpoint
       UNDO list  = {T3, T4}        started but never committed

REDO pass -- scan FORWARD from the checkpoint, reapply NEW values
    for everything on the redo list, in log order:
        B = 80          (from &lt;T2,B,50,80&gt;)
        D = 15          (from &lt;T2,D,5,15&gt;)
    (T1 committed BEFORE the checkpoint, so it is already durable --
     that is the entire purpose of a checkpoint.)

UNDO pass -- scan BACKWARD, restore OLD values for the undo list:
        E = 70          (undo &lt;T4,E,70,90&gt;)
        C = 10          (undo &lt;T3,C,10,40&gt;)
    then write &lt;T3 abort&gt; and &lt;T4 abort&gt; to the log.

FINAL STATE: A=200, B=80, C=10, D=15, E=70
             T1, T2 durable.  T3, T4 rolled back completely.

Note the directions: REDO goes forward (earliest to latest, so the
final value wins), UNDO goes backward (latest to earliest, so the
original value is restored). Getting these backwards is a classic
exam error.</pre></div></div><h3>Why the buffer policy decides what recovery must support</h3><table class="reftable"><tr><th>Policy</th><th>Meaning</th><th>Recovery needs</th></tr><tr><td>No-steal, force</td><td>Uncommitted pages never written; committed pages flushed at commit</td><td><span class="ok">Neither undo nor redo</span> &mdash; but terrible performance</td></tr><tr><td>Steal, force</td><td>Uncommitted pages may be written; commit forces a flush</td><td>UNDO only</td></tr><tr><td>No-steal, no-force</td><td>Uncommitted pages held; commit does not flush</td><td>REDO only</td></tr><tr><td><strong>Steal, no-force</strong></td><td>Buffer manager is unconstrained &mdash; the practical choice</td><td><strong>Both UNDO and REDO</strong> &mdash; what ARIES implements</td></tr></table><div class="callout"><div class="ctitle">Write-ahead logging, in one line</div>The log record must reach stable storage <em>before</em> the data page it describes. That single ordering rule is what makes both undo and redo possible after any crash, at any instant.</div>

<div class="takeaways"><div class="tk-title">Key takeaways</div><ul><li><strong>WAL</strong>: the log record always reaches disk before the corresponding data page.</li><li>Recovery is three passes: <strong>analysis</strong> (who was active), <strong>redo</strong> (forward, committed), <strong>undo</strong> (backward, uncommitted).</li><li>A <strong>checkpoint</strong> bounds how far back recovery must scan.</li><li>REDO applies <em>new</em> values scanning forward; UNDO restores <em>old</em> values scanning backward.</li><li><strong>Steal / no-force</strong> is the standard buffer policy and requires both undo and redo.</li><li>Deferred update needs redo only; immediate update with force needs undo only.</li></ul></div>`,
    quiz: [
      { q: `The Write-Ahead Logging rule requires that:`, options: ["Data must be written to disk before its log record", "A log record describing a change must reach stable storage before the corresponding data write does", "Logs and data must be written simultaneously, atomically", "Logging is optional if checkpoints are frequent"], answer: 1, explain: `WAL is the foundational rule of log-based recovery — the log always "gets there first," so on a crash mid-write, there's always enough information in the log to redo or undo the incomplete operation.` },
      { q: `Under a deferred-update strategy, why does recovery only ever need REDO, never UNDO?`, options: ["UNDO is never possible technically", "Writes are never applied to the actual database until after the transaction commits, so nothing uncommitted was ever written that would need undoing", "Deferred update doesn't use logging at all", "REDO and UNDO are the same operation in this scheme"], answer: 1, explain: `If a transaction's writes are held in a buffer and only flushed to the real DB post-commit, then by definition, any write actually visible in the DB came from a committed transaction — there's nothing uncommitted to undo. A crash before commit just discards the buffered writes.` },
      { q: `A "steal, no-force" buffer management policy (the industry-standard combination) requires that the recovery system support:`, options: ["Neither UNDO nor REDO", "UNDO only", "REDO only", "Both UNDO and REDO"], answer: 3, explain: `"Steal" (uncommitted pages can reach disk early) means UNDO is needed for transactions active at crash time. "No-force" (committed pages aren't guaranteed flushed at commit) means REDO is needed for committed transactions not yet on disk. Together: both UNDO and REDO must be supported — which is exactly what WAL-based recovery (e.g. ARIES) is built to do.` },
    ],
    practice: [
      { prompt: `A system crashes. From the log, transaction T1 has both a &lt;T1, start&gt; and &lt;T1, commit&gt; record; transaction T2 has &lt;T2, start&gt; but no commit record. Describe exactly what the recovery process should do to each.`, solution: `<strong>T1 (committed):</strong> since it committed but the crash may have happened before its dirty pages were flushed to disk (no-force policy), recovery must <strong>REDO</strong> all of T1's writes from the log, reapplying its new values to guarantee durability.<br><br>
     <strong>T2 (not committed at crash time):</strong> its effects must never become visible — recovery must <strong>UNDO</strong> any of T2's writes that may have already reached disk (steal policy), restoring the old values recorded in its log entries, then treat T2 as aborted.<br><br>
     This UNDO-committed-losers / REDO-committed-winners split is exactly the standard two-pass structure real recovery algorithms (ARIES-style) follow.` },
      { prompt: `Explain why checkpointing doesn't just mean "wipe the log" — what specifically does a checkpoint record need to preserve, and why is a naive "delete everything before the checkpoint" wrong?`, solution: `A checkpoint record must preserve the <strong>list of transactions that were still active (uncommitted) at the moment of the checkpoint</strong>. Naively deleting the entire log before the checkpoint would be wrong because a transaction that was active at checkpoint time might have written log records <em>before</em> the checkpoint that are still needed for UNDO if that transaction never commits and the system later crashes. The correct rule: recovery scans backward only to the earliest log record belonging to the oldest transaction that was still active at the most recent checkpoint — not simply to the checkpoint's own timestamp. That's why checkpoints record "active transaction list," not just a cutoff point.` },
    ],
  },
  {
    id: "m14",
    unit: "u4",
    num: "14",
    title: "Object-Oriented & Object-Relational Databases",
    syllabus: true,
    meta: "OODB concepts · ADTs · OR-DBMS features",
    notes: `
    <div class="starter">
    <div class="defbox"><div class="dlabel">Definition &mdash; in plain English</div><strong>Object-oriented databases (OODB)</strong> store data as objects &mdash; with identity, nested structure, methods and inheritance &mdash; just like in an OO programming language. <strong>Object-relational databases (ORDBMS)</strong> take the opposite path: keep the relational core and SQL, but extend it with rich types, inheritance and user-defined functions. Modern PostgreSQL is the classic ORDBMS.</div>
    <div class="intuitbox"><div class="dlabel">Intuition &mdash; how to think about it</div>The problem both attack is the <strong>impedance mismatch</strong> &mdash; the awkward translation between the object world of your program (nested, pointer-linked, typed) and the flat rows of tables. It's like doing your thinking in one language and filing every report in another: possible, but you spend half your effort translating. OODBs say 'store the objects as-is'; ORDBMSs say 'teach SQL richer types instead'. Industry mostly chose the second (plus ORM libraries like Hibernate as interpreters), because giving up SQL, declarative queries, and a mature optimizer proved too expensive.</div>
    <h3 class="kt-head">Key terms you must know</h3>
    <table class="reftable"><tr><th>Term</th><th>Meaning</th></tr><tr><td><strong>Object identity (OID)</strong></td><td>A system-wide identifier independent of the object's values.</td></tr><tr><td><strong>Impedance mismatch</strong></td><td>The friction of converting between program objects and flat tables.</td></tr><tr><td><strong>ADT</strong></td><td>Abstract data type: a user-defined type with its own operations.</td></tr><tr><td><strong>Inheritance</strong></td><td>Subtypes/subtables reuse and extend parent definitions.</td></tr><tr><td><strong>Persistence</strong></td><td>Objects that outlive the program that created them.</td></tr><tr><td><strong>ORDBMS</strong></td><td>Relational engine + object features (typed columns, UDFs) &mdash; e.g. PostgreSQL.</td></tr><tr><td><strong>ORM</strong></td><td>Object-Relational Mapper (Hibernate, Django ORM): library that automates the translation.</td></tr></table>
    </div>

    <h3>Why object-oriented databases exist</h3>
    <p>Relational databases store flat tuples; real applications (especially CAD, multimedia, engineering, and object-oriented software in general) work with complex, nested, richly-typed objects. Mapping between "objects in code" and "rows in tables" (the so-called <strong>object-relational impedance mismatch</strong>) is a persistent source of complexity — ORMs exist specifically to paper over this gap. OODBs were proposed to close that gap by making the database itself store objects directly.</p>

    <h3>Core OODB concepts</h3>
    <table class="reftable">
      <tr><th>Concept</th><th>Meaning in a database context</th></tr>
      <tr><td>Object identity (OID)</td><td>Every object has a unique, system-generated identity independent of its attribute values — unlike a relational primary key, which is a value that could theoretically change.</td></tr>
      <tr><td>Encapsulation</td><td>An object bundles its data with the methods/operations that act on it; the database stores behavior, not just structure.</td></tr>
      <tr><td>Inheritance</td><td>Object classes can be organized in a class hierarchy; a subclass inherits attributes and methods from its superclass.</td></tr>
      <tr><td>Complex/nested objects</td><td>An object's attribute can itself be another object (or a collection of objects), directly — no need to flatten into multiple joined tables.</td></tr>
      <tr><td>Polymorphism</td><td>The same operation can behave differently depending on the object's actual (sub)class.</td></tr>
    </table>

    <h3>Object-Relational DBMS (OR-DBMS)</h3>
    <p>Rather than replacing the relational model outright, OR-DBMSs (PostgreSQL is the textbook real-world example) extend it with object-oriented features while keeping SQL and tables as the foundation:</p>
    <ul>
      <li><strong>Abstract Data Types (ADTs)</strong> / user-defined types — a column can hold a custom composite type, not just INT/VARCHAR.</li>
      <li><strong>Arrays and nested collections</strong> as column types directly.</li>
      <li><strong>Table inheritance</strong> — a table can inherit columns from a parent table.</li>
      <li><strong>User-defined functions and operators</strong> usable inside SQL queries.</li>
      <li>Still fully relational underneath — queried with (extended) SQL, not a separate object query language.</li>
    </ul>

    <h3>OODB vs relational vs OR-DBMS — the practical comparison</h3>
    <table class="reftable">
      <tr><th></th><th>Relational</th><th>OODB</th><th>OR-DBMS</th></tr>
      <tr><td>Data model</td><td>Flat tuples/tables</td><td>Objects, classes, identity, inheritance</td><td>Tables + object features layered on top</td></tr>
      <tr><td>Query language</td><td>SQL</td><td>OQL (Object Query Language) or navigational access</td><td>Extended SQL</td></tr>
      <tr><td>Maturity/ecosystem</td><td>Extremely mature, huge tooling</td><td>Niche, mostly CAD/engineering/scientific domains</td><td>Mature, mainstream (PostgreSQL, Oracle)</td></tr>
      <tr><td>Why it "lost"</td><td>—</td><td>Never reached SQL's tooling/ecosystem/standardization; ORMs solved the impedance mismatch more pragmatically for most business apps</td><td>Effectively won as the pragmatic middle ground</td></tr>
    </table>

<h3>Worked: the impedance mismatch and the three responses to it</h3><div class="worked"><div class="wtitle">Worked example &mdash; why ORMs and OR-DBMS won over pure OODBs</div><div class="codeblock"><pre>THE IMPEDANCE MISMATCH, concretely.

An application object:

    class Employee {
        int      id;
        String   name;
        Address  address;        // a nested OBJECT
        String[] phones;         // a COLLECTION
        Employee manager;        // a REFERENCE to another object
    }

Pure relational storage requires flattening all of it:

    Employee(id PK, name, street, city, zip, mgr_id FK)
    EmpPhone(id FK, phone)                        -- 1NF forces a table

    Loading one Employee now needs a JOIN plus a second query for
    phones -- and the application must reassemble the object graph
    by hand. That reassembly work is the impedance mismatch.

THREE RESPONSES, and why one won:

  PURE OODB          store objects directly, navigate by pointer.
                     Solved the mismatch completely -- and lost SQL,
                     declarative querying, mature tooling and
                     vendor independence. Never reached the mainstream.

  ORM layer          keep the relational database, generate the
                     mapping code. Hibernate, Django ORM, ActiveRecord.
                     Pragmatic; became the default answer.

  OR-DBMS            extend the relational model with object features
                     while keeping SQL. PostgreSQL composite types,
                     arrays, inheritance, JSONB. This is what actually
                     shipped in mainstream engines.

PostgreSQL, doing exactly this:

    CREATE TYPE address AS (street TEXT, city TEXT, zip TEXT);
    CREATE TABLE employee (
        id      SERIAL PRIMARY KEY,
        name    TEXT,
        addr    address,        -- composite type, no join needed
        phones  TEXT[],         -- array column
        mgr_id  INT REFERENCES employee(id)
    );
    SELECT name, (addr).city, phones[1] FROM employee;

OID vs PRIMARY KEY -- the conceptual difference:
    A primary key is a VALUE drawn from the data (an email, an ID).
    Change the value and identity becomes ambiguous.
    An OID is SYSTEM-GENERATED and content-independent, so identity
    survives any attribute change. Two objects with identical
    attribute values are still distinct objects.</pre></div></div>

<h3>Worked: JSONB in practice</h3><div class="worked"><div class="wtitle">Worked example &mdash; object-relational features, used well and badly</div><div class="codeblock"><pre>WHEN TO USE JSONB -- and when it is a mistake.

PostgreSQL lets you store a document inside a relational row:

    CREATE TABLE product (
        id      SERIAL PRIMARY KEY,
        sku     TEXT UNIQUE NOT NULL,      -- structured, queried, constrained
        price   NUMERIC(10,2) NOT NULL,    -- structured
        attrs   JSONB                      -- genuinely variable
    );

    INSERT INTO product (sku, price, attrs) VALUES
      (&#x27;TS-001&#x27;, 19.99, &#x27;{&quot;size&quot;:&quot;M&quot;,&quot;colour&quot;:&quot;blue&quot;,&quot;material&quot;:&quot;cotton&quot;}&#x27;),
      (&#x27;MG-002&#x27;,  8.50, &#x27;{&quot;capacity_ml&quot;:350,&quot;microwave_safe&quot;:true}&#x27;);

    -- a mug has no size; a t-shirt has no capacity. A fixed schema
    -- would need dozens of mostly-NULL columns.

    SELECT sku FROM product WHERE attrs-&gt;&gt;&#x27;colour&#x27; = &#x27;blue&#x27;;
    CREATE INDEX ON product USING GIN (attrs);   -- indexable

GOOD REASONS
    genuinely heterogeneous attributes across rows
    third-party API payloads stored verbatim
    rapidly evolving fields not worth a migration each time

BAD REASON -- avoiding schema design
    Putting price inside JSONB means:
      - no NOT NULL, no CHECK (price &gt; 0), no numeric type safety
      - no foreign keys out of it
      - the optimizer has poor statistics on JSON paths
      - every consumer must agree on the key name, with nothing enforcing it

THE RULE: structure what you query and constrain; use JSONB for the
genuinely unstructured remainder. A table that is one id column plus
one JSONB blob has thrown away every advantage of a relational
database while keeping all its overhead.</pre></div></div>

<div class="takeaways"><div class="tk-title">Key takeaways</div><ul><li>The <strong>impedance mismatch</strong> is the gap between object graphs and flat, 1NF tables.</li><li>Pure <strong>OODBs</strong> solved it but sacrificed SQL, tooling and standardisation.</li><li><strong>ORMs</strong> and <strong>OR-DBMS</strong> extensions won by keeping the relational foundation.</li><li><strong>OID</strong> is system-generated and content-independent; a primary key is a data value.</li><li>PostgreSQL composite types, arrays and JSONB are OR-DBMS features in everyday use.</li><li>Reach for JSONB when the shape is genuinely variable &mdash; not to avoid designing a schema.</li></ul></div>`,
    quiz: [
      { q: `Object identity (OID) differs from a relational primary key in that:`, options: ["OID is always a string, primary keys are always integers", "OID is a system-generated identity independent of attribute values, so it stays stable even if every attribute value changes; a primary key is itself a value", "Primary keys are unique but OIDs are not", "There is no real difference"], answer: 1, explain: `A relational primary key is a value drawn from the data itself (an email, an ID number) — change that value and, in principle, "who" the row refers to could be ambiguous. OID is assigned by the system independent of content, so identity survives any attribute change.` },
      { q: `PostgreSQL supporting user-defined composite types and array columns, while still being queried through SQL, is an example of:`, options: ["A pure OODB", "An Object-Relational DBMS (OR-DBMS)", "A NoSQL document store", "A hierarchical database"], answer: 1, explain: `OR-DBMSs keep the relational/SQL foundation but extend it with object-oriented features like ADTs — exactly the PostgreSQL pattern described.` },
      { q: `A key practical reason pure OODBs never achieved mainstream adoption comparable to relational/OR-DBMS systems is:`, options: ["They were technically inferior in every way to relational systems", "ORMs and OR-DBMS extensions solved most of the same impedance-mismatch problem more pragmatically, without abandoning SQL's mature tooling and standardization", "Object-oriented programming itself became unpopular", "OODBs cannot store complex nested objects"], answer: 1, explain: `The market largely solved the "objects vs tables" gap by layering ORMs over relational databases (or by extending relational databases with object features, i.e. OR-DBMS) rather than switching to a wholesale different, less standardized data model.` },
    ],
    practice: [
      { prompt: `A CAD (Computer-Aided Design) application needs to store deeply nested part assemblies (an assembly contains sub-assemblies, which contain parts, which have their own geometric attributes and behaviors). Argue, in a few sentences, why this is a case where OODB-style modeling has a genuine practical edge over pure relational modeling.`, solution: `A relational model would need to flatten this nested structure into multiple normalized tables (Assembly, SubAssembly, Part, Geometry) connected by foreign keys, and every read of a complete assembly would require several joins to reconstruct the nested object the application actually needs. An OODB can store the assembly as a genuinely nested object graph — a sub-assembly is directly an attribute of its parent assembly, no join required to reassemble it — and can attach behavior (methods like "compute total weight" or "check collision") directly to the objects rather than as separate application logic. For deeply recursive, behavior-rich, non-tabular domains like CAD, that's a real structural fit, which is exactly why OODBs found their actual niche adoption in CAD/engineering/scientific computing rather than typical business/transactional systems (where flat relational data + SQL's tooling maturity wins decisively).` },
      { prompt: `Explain what "impedance mismatch" means concretely, using a simple example of a <code>Person</code> object with a list-valued <code>phone_numbers</code> attribute being persisted to a relational database.`, solution: `In application code, a <code>Person</code> object naturally holds <code>phone_numbers</code> as a single in-memory list attribute directly attached to the object. A relational schema cannot store a list in one column (1NF, Module 08) — it must be split into a separate <code>PhoneNumbers(person_id, phone)</code> table, and reconstructing the original object requires a join + collecting matching rows back into a list in application code. That translation step — flattening a rich in-memory object graph into normalized tables on write, and reassembling it on read — <em>is</em> the impedance mismatch. ORMs (e.g. Hibernate, SQLAlchemy) exist specifically to automate this translation so application developers don't hand-write it every time; OODBs instead avoided the mismatch altogether by storing the object structure directly, at the cost of the relational ecosystem's tooling and standardization.` },
    ],
  },
  {
    id: "m15",
    unit: "beyond",
    num: "15",
    title: "NoSQL & Distributed Databases",
    syllabus: false,
    meta: "CAP theorem · document/KV/column/graph stores · sharding & replication",
    notes: `
    <div class="starter">
    <div class="defbox"><div class="dlabel">Definition &mdash; in plain English</div><strong>NoSQL</strong> ('not only SQL') is an umbrella term for databases that drop the relational model to gain scale, flexibility, or speed: document stores (MongoDB), key-value stores (Redis), wide-column stores (Cassandra), graph databases (Neo4j). A <strong>distributed database</strong> spreads data across many machines; the <strong>CAP theorem</strong> says that during a network partition you must choose between consistency and availability.</div>
    <div class="intuitbox"><div class="dlabel">Intuition &mdash; how to think about it</div>Relational databases mostly <strong>scale up</strong> (buy a bigger machine); NoSQL systems are built to <strong>scale out</strong> (add more cheap machines). Two moves make that possible: <strong>sharding</strong> &mdash; slicing data across machines like splitting a phone book A&ndash;M / N&ndash;Z between two volumes &mdash; and <strong>replication</strong> &mdash; keeping copies so a dead machine loses nothing. CAP is the resulting dilemma: when machines can't reach each other (partition), a bank refuses answers rather than risk wrong balances (chooses C), while a social feed keeps serving slightly stale posts (chooses A) &mdash; 'eventual consistency' means the copies will agree once the network heals.</div>
    <h3 class="kt-head">Key terms you must know</h3>
    <table class="reftable"><tr><th>Term</th><th>Meaning</th></tr><tr><td><strong>Document store</strong></td><td>JSON-like documents, flexible schema (MongoDB).</td></tr><tr><td><strong>Key-value store</strong></td><td>A giant dictionary: key &rarr; blob. Blazing fast (Redis).</td></tr><tr><td><strong>Wide-column store</strong></td><td>Sparse rows with dynamic columns, built for write-heavy scale (Cassandra).</td></tr><tr><td><strong>Graph database</strong></td><td>Nodes + edges as first-class data; great for relationships (Neo4j).</td></tr><tr><td><strong>Sharding</strong></td><td>Horizontal partitioning of data across machines.</td></tr><tr><td><strong>Replication</strong></td><td>Keeping copies of data on multiple machines for safety and read scale.</td></tr><tr><td><strong>CAP theorem</strong></td><td>Under a partition, pick consistency or availability &mdash; not both.</td></tr><tr><td><strong>Eventual consistency</strong></td><td>Replicas may briefly disagree but converge over time.</td></tr><tr><td><strong>BASE</strong></td><td>Basically Available, Soft state, Eventually consistent &mdash; the loose counterpart of ACID.</td></tr></table>
    </div>

    <div class="callout"><div class="ctitle">Not on your syllabus — but expect it in interviews</div>Every modern system design interview and most real production stacks now mix relational with at least one non-relational store. This module exists because "the syllabus stops at Unit IV" doesn't mean the industry did.</div>

    <h3>Why NoSQL exists at all</h3>
    <p>Relational databases enforce a rigid schema and strong (ACID) consistency — excellent for correctness, but that rigidity and coordination overhead becomes a bottleneck at massive, horizontally-distributed scale (think: a social network's activity feed, or a global e-commerce catalog). NoSQL trades some of relational's guarantees for horizontal scalability and schema flexibility.</p>

    <h3>The CAP theorem</h3>
    <p>In a distributed system, you can only guarantee two of the following three simultaneously, in the presence of a network partition:</p>
    <table class="reftable">
      <tr><th>Property</th><th>Meaning</th></tr>
      <tr><td><strong>C</strong>onsistency</td><td>Every read receives the most recent write (or an error) — all nodes see the same data at the same time.</td></tr>
      <tr><td><strong>A</strong>vailability</td><td>Every request receives a (non-error) response, without guarantee it's the most recent write.</td></tr>
      <tr><td><strong>P</strong>artition tolerance</td><td>The system keeps operating despite network partitions between nodes.</td></tr>
    </table>
    <p>Since network partitions are a fact of distributed life (P is non-negotiable in practice), the real-world choice is CP vs AP: during a partition, do you refuse requests to stay consistent (CP — e.g. HBase, MongoDB in certain configurations), or keep serving requests and reconcile consistency later (AP — e.g. Cassandra, DynamoDB)?</p>

    <h3>ACID vs BASE</h3>
    <p>NoSQL systems often describe their consistency model as <strong>BASE</strong> instead of ACID: <strong>B</strong>asically <strong>A</strong>vailable, <strong>S</strong>oft state, <strong>E</strong>ventually consistent — the system will become consistent over time, without guaranteeing it at every instant, in exchange for higher availability and throughput.</p>

    <h3>The four NoSQL families</h3>
    <table class="reftable">
      <tr><th>Type</th><th>Data model</th><th>Example</th><th>Good fit for</th></tr>
      <tr><td>Key-Value</td><td>Simple key → opaque value blob</td><td>Redis, DynamoDB</td><td>Caching, session storage, extremely simple lookups</td></tr>
      <tr><td>Document</td><td>Key → semi-structured document (JSON/BSON), nested fields queryable</td><td>MongoDB, CouchDB</td><td>Content management, catalogs, evolving schemas</td></tr>
      <tr><td>Column-family (wide-column)</td><td>Rows with dynamic, sparse columns grouped into column families</td><td>Cassandra, HBase</td><td>Massive write throughput, time-series, log data</td></tr>
      <tr><td>Graph</td><td>Nodes + edges, relationships are first-class</td><td>Neo4j, Amazon Neptune</td><td>Social networks, recommendation engines, fraud detection — anything relationship-heavy</td></tr>
    </table>

    <h3>Sharding vs replication</h3>
    <ul>
      <li><strong>Sharding (horizontal partitioning)</strong> — splitting a dataset across multiple machines, each holding a distinct subset of rows (e.g. by hash of a key, or by range). Scales write throughput and storage, but cross-shard queries/joins become expensive.</li>
      <li><strong>Replication</strong> — copying the same data across multiple machines. Scales read throughput and provides fault tolerance, but raises the consistency question: does a read always hit the latest write (synchronous replication, slower) or might it see stale data (asynchronous replication, faster, eventually consistent)?</li>
      <li>Most large-scale systems combine both: shard for scale, replicate each shard for availability.</li>
    </ul>

    <h3>When to actually reach for each</h3>
    <div class="callout"><div class="ctitle">The honest interview answer</div>"Use relational" is still correct far more often than tech marketing suggests: if your data is naturally tabular, relationships matter, and you need strong consistency (financial records, inventory, anything with real integrity constraints) — relational + normalization is still the right default. Reach for NoSQL when you have a specific scale, schema-flexibility, or access-pattern need the relational model genuinely fights against (e.g. a graph database when your core queries are all "friends of friends," not because it's newer).</div>

<h3>Worked: CAP, and the quorum arithmetic behind it</h3><div class="worked"><div class="wtitle">Worked example &mdash; why the real choice is CP vs AP</div><div class="codeblock"><pre>CAP, stated precisely -- and why &quot;pick two&quot; is misleading.

  C  every read sees the most recent write, or an error
  A  every request receives a non-error response
  P  the system keeps working despite dropped/delayed messages
     between nodes

The theorem: during a PARTITION you must sacrifice C or A.

Partitions are not optional in a real network -- cables fail, switches
reboot, nodes garbage-collect. So P is mandatory, and the genuine
choice is only ever CP vs AP:

    NETWORK PARTITION -- node1 and node2 cannot talk

    CP  (choose consistency)
        node2 REFUSES the read/write rather than serve stale data.
        Availability drops; correctness holds.
        HBase, MongoDB (default), etcd, ZooKeeper, Spanner

    AP  (choose availability)
        node2 SERVES its possibly-stale local copy and reconciles later.
        Always up; may briefly disagree with itself.
        Cassandra, DynamoDB, Riak, CouchDB

    CA  is not achievable in a distributed system -- a single node
        has no partitions, but then it is not distributed.

QUORUMS give tunable middle ground. With N replicas, W write acks and
R read acks:

    W + R &gt; N   guarantees a read overlaps the latest write
                (strong consistency)

    N=3, W=2, R=2  -&gt;  2+2 &gt; 3   strong, tolerates 1 node down
    N=3, W=1, R=1  -&gt;  1+1 &lt; 3   fast, eventually consistent
    N=3, W=3, R=1  -&gt;  fast reads, writes fail if ANY node is down

BASE, the AP-world counterpart to ACID:
    Basically Available -- Soft state -- Eventual consistency</pre></div></div><h3>The four NoSQL families</h3><table class="reftable"><tr><th>Family</th><th>Data model</th><th>Best at</th><th>Examples</th></tr><tr><td>Key&ndash;value</td><td>opaque blob by key</td><td>Caching, sessions &mdash; O(1) by key</td><td>Redis, DynamoDB</td></tr><tr><td>Document</td><td>JSON/BSON documents</td><td>Variable schema, whole-object reads</td><td>MongoDB, CouchDB</td></tr><tr><td>Column-family</td><td>sparse rows, column groups</td><td>Huge write volume, time series</td><td>Cassandra, HBase</td></tr><tr><td>Graph</td><td>nodes and edges</td><td>Multi-hop traversal</td><td>Neo4j, Neptune</td></tr></table><h3>Worked: sharding vs replication</h3><div class="worked"><div class="wtitle">Worked example &mdash; choosing a shard key</div><div class="codeblock"><pre>SHARDING vs REPLICATION -- different problems, often confused.

REPLICATION: the SAME data on several nodes.
    Solves: read scale, fault tolerance.
    Does NOT solve: write scale, or a dataset too big for one machine.

SHARDING: DIFFERENT data on each node.
    Solves: write scale, dataset size.
    Costs: cross-shard joins and transactions become expensive or
           impossible; a bad shard key creates hotspots.

Choosing a shard key -- the decision that is hardest to reverse:

    BAD   shard by timestamp
          every new write lands on the newest shard -&gt; one hot node,
          the rest idle
    BAD   shard by country when 80% of users are in one country
          -&gt; permanently unbalanced
    GOOD  shard by hash(user_id)
          even distribution, and all of one user&#x27;s rows stay together
          so per-user queries hit exactly one shard

Real systems combine both: shard for capacity, then replicate each
shard for durability. A 6-node cluster might be 3 shards x 2 replicas.</pre></div></div>

<div class="takeaways"><div class="tk-title">Key takeaways</div><ul><li>Partition tolerance is mandatory in practice, so CAP is really <strong>CP vs AP</strong>.</li><li><strong>W + R &gt; N</strong> gives strong consistency from a quorum system.</li><li><strong>BASE</strong> (basically available, soft state, eventual consistency) is the AP counterpart to ACID.</li><li><strong>Replication</strong> buys read scale and durability; <strong>sharding</strong> buys write scale and capacity.</li><li>The shard key is the hardest decision to reverse &mdash; hash a high-cardinality attribute.</li><li>Pick the family by access pattern: key&ndash;value for lookups, document for objects, column-family for write volume, graph for traversal.</li></ul></div>`,
    quiz: [
      { q: `Given that network partitions are unavoidable in real distributed systems, the practical CAP tradeoff mostly comes down to:`, options: ["Choosing between Consistency and Availability, since Partition tolerance can't realistically be dropped", "Choosing between Consistency and Partition tolerance", "There is no real tradeoff, all three are always achievable", "Choosing whether to use SQL or NoSQL syntax"], answer: 0, explain: `Since P is essentially mandatory for any real distributed system, the meaningful design decision during an actual partition event is CP (refuse/delay requests to stay consistent) vs AP (keep serving, accept temporary inconsistency).` },
      { q: `A social network needs to answer "friends of friends who also like hiking" as a core, frequent query. Which NoSQL family is purpose-built for this access pattern?`, options: ["Key-value store", "Document store", "Column-family store", "Graph database"], answer: 3, explain: `Graph databases treat relationships as first-class citizens with efficient traversal — exactly what multi-hop "friends of friends" queries need. The other three would require expensive application-level joins or denormalization to answer this efficiently.` },
      { q: `Sharding and replication solve different problems. Which statement correctly distinguishes them?`, options: ["Sharding copies the same data to multiple machines; replication splits data across machines", "Sharding splits data across machines (scaling writes/storage); replication copies the same data across machines (scaling reads/fault tolerance)", "They are the same technique with different names", "Neither technique is used in real production systems"], answer: 1, explain: `Sharding = horizontal partitioning (different data on different machines). Replication = duplication (same data on multiple machines). They solve complementary problems and are typically combined.` },
    ],
    practice: [
      { prompt: `A startup is building a financial ledger system that must never show an inconsistent account balance, even during a partial network outage. A separate team is building a "trending posts" feed for the same app, where showing slightly stale data for a few seconds is completely acceptable. Recommend a data store approach (relational vs NoSQL type, and CP vs AP leaning) for each, with reasoning.`, solution: `<strong>Financial ledger:</strong> a relational database (or a CP-leaning distributed store) with full ACID transactions is the right call. Correctness — no double-spends, no lost updates, no reading a half-committed balance — matters far more than raw throughput here, and the domain is naturally tabular/relational (accounts, transactions, balances) with strict integrity constraints. Choosing availability over consistency in this domain risks showing an incorrect balance, which is unacceptable for money.<br><br>
     <strong>Trending posts feed:</strong> an AP-leaning NoSQL store (e.g. a document or column-family store, or a key-value cache like Redis in front of it) fits well. The team has explicitly said a few seconds of staleness is fine — so trading strict consistency for higher availability and read throughput at scale is a legitimate, deliberate choice here, not a compromise forced by ignorance. This is the CAP tradeoff made consciously per-use-case rather than picking one database technology for the whole system.` },
      { prompt: `Explain in your own words why "eventually consistent" is a meaningfully weaker guarantee than ACID's "isolation," and give a concrete scenario where that weakness could visibly confuse a user.`, solution: `ACID isolation guarantees that at the moment a transaction commits, any subsequent read (from any client, anywhere) sees that committed value — there is a single, immediately-consistent view of the data. "Eventually consistent" only guarantees that <em>if no further writes occur</em>, all replicas will <em>eventually</em> converge to the same value — but offers no bound on when "eventually" actually is, and different clients can see different values in the meantime.<br><br>
     <strong>Concrete scenario:</strong> a user updates their profile picture on an eventually-consistent social platform. They immediately refresh their own profile page (which happens to be served by a replica that already received the update) and see the new picture. A friend, viewing the same profile seconds later from a different replica that hasn't yet received the propagated write, still sees the old picture. Both are "correct" reads under the eventually-consistent model — but from a user's perspective, this looks like a bug ("why does my friend see my old photo?"), which is exactly the kind of user-facing tradeoff a team must consciously accept when choosing AP over CP.` },
    ],
  },
  {
    id: "m16",
    unit: "beyond",
    num: "16",
    title: "Real-World SQL Practice & Performance",
    syllabus: false,
    meta: "EXPLAIN plans · window functions · N+1 problem · index strategy",
    notes: `
    <div class="starter">
    <div class="defbox"><div class="dlabel">Definition &mdash; in plain English</div>This module is the <strong>practice layer</strong>: how to read an execution plan (EXPLAIN), when the optimizer uses your indexes, window functions for analytics, and the traps that make production apps slow (like the N+1 query problem).</div>
    <div class="intuitbox"><div class="dlabel">Intuition &mdash; how to think about it</div>The single habit that separates 'knows SQL' from 'makes SQL fast' is asking the database <strong>how it plans to run your query</strong> &mdash; EXPLAIN is the recipe card the optimizer wrote. If it says 'Seq Scan' on a million-row table for a query that returns 5 rows, you're reading the whole book to find one page: probably a missing (or unusable) index. The N+1 problem is death by a thousand cuts: fetch 100 orders (1 query), then loop fetching each customer (100 more) &mdash; 101 round trips where one JOIN would do. And window functions are aggregates that <strong>don't collapse rows</strong>: 'show every employee AND their department's average' in one pass &mdash; GROUP BY answers per-group questions, windows answer per-row-with-context questions.</div>
    <h3 class="kt-head">Key terms you must know</h3>
    <table class="reftable"><tr><th>Term</th><th>Meaning</th></tr><tr><td><strong>EXPLAIN</strong></td><td>Shows the optimizer's chosen plan; EXPLAIN ANALYZE actually runs it with timings.</td></tr><tr><td><strong>Seq scan vs index scan</strong></td><td>Read every row vs jump via the index &mdash; the first thing to check in a plan.</td></tr><tr><td><strong>Sargable</strong></td><td>A predicate that can use an index; wrapping the column in a function usually breaks it.</td></tr><tr><td><strong>Covering index</strong></td><td>Index containing every column the query needs &mdash; table never touched.</td></tr><tr><td><strong>Window function</strong></td><td>Aggregate computed OVER a partition without collapsing rows (ROW_NUMBER, RANK, moving averages).</td></tr><tr><td><strong>N+1 problem</strong></td><td>One query plus one-per-row follow-ups; fix with a JOIN or batched IN query.</td></tr><tr><td><strong>Composite index</strong></td><td>Multi-column index; column order decides which queries it can serve.</td></tr></table>
    </div>

    <div class="callout"><div class="ctitle">Not on your syllabus — but this is what actually gets asked in interviews</div>Unit II covers SQL syntax; this module covers what separates someone who knows SQL syntax from someone who can make a slow production query fast.</div>

    <h3>Reading an execution plan</h3>
    <p>Every major DBMS lets you ask "how would you actually run this?" before running it:</p>
    <div class="codeblock"><span class="k">EXPLAIN ANALYZE</span>
<span class="k">SELECT</span> * <span class="k">FROM</span> Orders <span class="k">WHERE</span> customer_id = 42;</div>
    <p>Key things to look for in the output:</p>
    <ul>
      <li><strong>Seq Scan / Full Table Scan</strong> — reading every row; fine for small tables, a red flag on large ones if you expected an index to be used.</li>
      <li><strong>Index Scan / Index Seek</strong> — using an index to jump directly to relevant rows.</li>
      <li><strong>Estimated vs actual row count</strong> — a huge gap usually means outdated table statistics, confusing the optimizer into a bad plan.</li>
      <li><strong>Join algorithm chosen</strong> — nested loop, hash, or merge join (Module 07) — and whether it matches what you'd expect given table sizes.</li>
    </ul>

    <h3>Window functions</h3>
    <p>Unlike GROUP BY, window functions compute an aggregate <em>without</em> collapsing rows — each row keeps its identity while gaining a computed value based on a "window" of related rows.</p>
    <div class="codeblock"><span class="c">-- rank employees by salary within their department, without losing any row</span>
<span class="k">SELECT</span> name, dept_id, salary,
       RANK() <span class="k">OVER</span> (<span class="k">PARTITION BY</span> dept_id <span class="k">ORDER BY</span> salary <span class="k">DESC</span>) <span class="k">AS</span> dept_rank,
       SUM(salary) <span class="k">OVER</span> (<span class="k">PARTITION BY</span> dept_id) <span class="k">AS</span> dept_total,
       salary - LAG(salary) <span class="k">OVER</span> (<span class="k">PARTITION BY</span> dept_id <span class="k">ORDER BY</span> salary) <span class="k">AS</span> gap_from_prev
<span class="k">FROM</span> Employees;</div>
    <table class="reftable">
      <tr><th>Function</th><th>Use</th></tr>
      <tr><td>ROW_NUMBER()</td><td>Unique sequential number per row within a partition.</td></tr>
      <tr><td>RANK() / DENSE_RANK()</td><td>Ranking with (RANK) or without (DENSE_RANK) gaps after ties.</td></tr>
      <tr><td>LAG() / LEAD()</td><td>Access a preceding/following row's value — great for period-over-period comparisons.</td></tr>
      <tr><td>SUM/AVG ... OVER()</td><td>Running totals, moving averages, group totals attached to every row.</td></tr>
    </table>

    <h3>The N+1 query problem</h3>
    <p>The single most common real-world ORM performance bug: fetching a list of N parent records, then issuing one additional query <em>per parent</em> to fetch related child records (N+1 total queries) instead of one query with a JOIN or a single batched IN-clause query.</p>
    <div class="codeblock"><span class="c">-- the N+1 anti-pattern (pseudocode, what an ORM often does by default)</span>
orders = SELECT * FROM Orders;                     <span class="c">-- 1 query</span>
for order in orders:
    items = SELECT * FROM OrderItems WHERE order_id = order.id;  <span class="c">-- N queries!</span>

<span class="c">-- fixed: one query total</span>
<span class="k">SELECT</span> o.*, i.* <span class="k">FROM</span> Orders o
<span class="k">JOIN</span> OrderItems i <span class="k">ON</span> i.order_id = o.id;</div>

    <h3>Index strategy that actually matters</h3>
    <ul>
      <li><strong>Covering index</strong> — an index that includes every column a query needs, so the engine never has to touch the underlying table row at all after the index lookup.</li>
      <li><strong>Composite index column order</strong> — an index on <code>(dept_id, salary)</code> serves queries filtering on <code>dept_id</code> alone, or <code>dept_id + salary</code> together, but does <em>not</em> efficiently serve a query filtering on <code>salary</code> alone — leftmost-prefix rule.</li>
      <li><strong>Over-indexing cost</strong> — every index speeds reads but slows every write (each INSERT/UPDATE/DELETE must also update every index) — indexing everything is not free.</li>
      <li><strong>Low-selectivity columns</strong> (Module 10's bitmap-index discussion) usually aren't worth a B+-tree index at all.</li>
    </ul>

<h3>Worked: the N+1 query problem</h3><div class="worked"><div class="wtitle">Worked example &mdash; 101 queries where 2 would do</div><div class="codeblock"><pre>THE N+1 QUERY PROBLEM -- the most common ORM performance bug.

Rendering 100 blog posts with their authors:

  NAIVE (what a lazy-loading ORM does by default)
      SELECT * FROM posts LIMIT 100;                    -- 1 query
      then, per post:
      SELECT * FROM authors WHERE id = ?;               -- 100 queries
      TOTAL: 101 round trips

      At 1 ms network latency each, that is ~101 ms of pure waiting,
      and the database does 100 trivial index lookups it need not have.

  FIX A -- JOIN (one round trip)
      SELECT p.*, a.name
      FROM posts p JOIN authors a ON p.author_id = a.id
      LIMIT 100;                                        -- 1 query

  FIX B -- batch the second query (two round trips)
      SELECT * FROM posts LIMIT 100;
      SELECT * FROM authors WHERE id IN (...);          -- 1 query
      TOTAL: 2. Often preferable to a join when the author rows are
      large and heavily duplicated across posts.

  In ORMs this is &#x27;eager loading&#x27;:
      Django    .select_related(&#x27;author&#x27;)  /  .prefetch_related(...)
      Hibernate JOIN FETCH
      Rails     .includes(:author)

DIAGNOSING IT: enable query logging and count. A page issuing 101
queries where 2 would do is almost always this pattern.</pre></div></div><h3>Worked: five reasons an index is ignored</h3><div class="worked"><div class="wtitle">Worked example &mdash; sargability</div><div class="codeblock"><pre>WHEN AN INDEX IS NOT USED -- five reasons, all common.

1. FUNCTION APPLIED TO THE COLUMN
       WHERE YEAR(hire_date) = 2023          -- index on hire_date UNUSED
       WHERE hire_date &gt;= &#x27;2023-01-01&#x27;
         AND hire_date &lt;  &#x27;2024-01-01&#x27;       -- index USED (sargable)

2. LEADING WILDCARD
       WHERE name LIKE &#x27;%smith&#x27;              -- UNUSED: cannot seek
       WHERE name LIKE &#x27;smith%&#x27;              -- USED: prefix seek

3. IMPLICIT TYPE CONVERSION
       WHERE phone = 9876543210              -- phone is VARCHAR -&gt; UNUSED
       WHERE phone = &#x27;9876543210&#x27;            -- USED

4. LOW SELECTIVITY
       WHERE status = &#x27;active&#x27;               -- 95% of rows match
       A full scan is genuinely CHEAPER than an index lookup plus
       95,000 random row fetches. The optimizer is correct to skip it.

5. WRONG COLUMN ORDER IN A COMPOSITE INDEX
       INDEX (last_name, first_name)
       WHERE first_name = &#x27;Ann&#x27;              -- UNUSED: not the leading column
       WHERE last_name  = &#x27;Roy&#x27;              -- USED
       WHERE last_name  = &#x27;Roy&#x27;
         AND first_name = &#x27;Ann&#x27;              -- USED, fully
       A composite index works left-to-right, like a phone book sorted
       by surname then forename.

COVERING INDEX -- the index alone answers the query, so the table is
never touched:
       INDEX (dept_id, salary)
       SELECT salary FROM employees WHERE dept_id = 3;
       -- both columns are in the index -&gt; &#x27;index-only scan&#x27;</pre></div></div><h3>Worked: reading EXPLAIN ANALYZE</h3><div class="worked"><div class="wtitle">Worked example &mdash; finding the real bottleneck</div><div class="codeblock"><pre>READING EXPLAIN ANALYZE -- what to look for, in order.

    EXPLAIN ANALYZE
    SELECT * FROM orders WHERE customer_id = 42;

    Seq Scan on orders  (cost=0.00..18334.00 rows=9 width=44)
                        (actual time=0.014..85.2 rows=11 loops=1)
      Filter: (customer_id = 42)
      Rows Removed by Filter: 999989

  1. SEQ SCAN on a large table with a selective filter
     -&gt; a missing index. 999,989 rows read and thrown away.

  2. Compare ESTIMATED rows (9) with ACTUAL rows (11)
     -&gt; close here, so the statistics are healthy. A large divergence
        (estimated 9, actual 400,000) means the optimizer planned on
        bad information: run ANALYZE, or add extended statistics.

  3. Check LOOPS. &#x27;loops=1000&#x27; on an inner node means that node ran
     1000 times -- the signature of a nested loop over a large outer.

  4. Read the TOTAL TIME at the top node, and find the child that
     accounts for most of it. Optimise that, not the query you
     happen to find suspicious.

After CREATE INDEX ON orders(customer_id):

    Index Scan using orders_customer_id_idx on orders
        (cost=0.42..8.44 rows=9 width=44)
        (actual time=0.021..0.038 rows=11 loops=1)

    85.2 ms -&gt; 0.038 ms. Roughly 2000x, from one index.</pre></div></div>

<div class="takeaways"><div class="tk-title">Key takeaways</div><ul><li><strong>N+1</strong>: one query per row instead of one for all. Fix with a join or a batched <code>IN</code>.</li><li>Wrapping an indexed column in a function makes the predicate <strong>non-sargable</strong> &mdash; rewrite as a range.</li><li>A leading wildcard (<code>LIKE '%x'</code>) cannot use a B-tree index.</li><li>Composite indexes work <strong>left to right</strong> &mdash; column order is a design decision.</li><li>A <strong>covering index</strong> answers the query without touching the table.</li><li>In <code>EXPLAIN ANALYZE</code>, compare <em>estimated</em> with <em>actual</em> rows &mdash; divergence means stale statistics.</li></ul></div>`,
    quiz: [
      { q: `A query on a 50-million-row table shows "Seq Scan" in its EXPLAIN output despite filtering on an indexed column, with a WHERE clause the index should serve well. The most likely explanation is:`, options: ["Sequential scans are always faster on large tables", "Outdated table statistics are misleading the optimizer's cost estimate, or the filter isn't actually selective enough for the index to help", "The database doesn't support indexes on that data type", "EXPLAIN output is unreliable and should be ignored"], answer: 1, explain: `A well-indexed column showing an unexpected seq scan is the classic signal to check whether ANALYZE/statistics are stale (optimizer misjudging row counts) — or, alternately, that the predicate genuinely matches too large a fraction of the table for an index to be worth the extra I/O over a scan.` },
      { q: `The key structural difference between GROUP BY aggregation and a window function is:`, options: ["Window functions are always slower", "GROUP BY collapses rows into one per group; window functions compute aggregates while keeping every original row intact", "Window functions can only be used with COUNT()", "There is no structural difference"], answer: 1, explain: `That row-preservation is the entire point of window functions — you get an aggregate value (rank, running total, previous row's value) attached to each individual row, rather than losing row-level detail the way GROUP BY does.` },
      { q: `A composite index on (dept_id, salary) will efficiently serve which of these queries?`, options: ["WHERE salary > 50000 (alone)", "WHERE dept_id = 3 AND salary > 50000", "Both equally well", "Neither"], answer: 1, explain: `The leftmost-prefix rule: a composite index is usable for queries filtering on a left-aligned prefix of its columns. Filtering on dept_id alone, or dept_id+salary together, can use this index; filtering on salary alone cannot, since the index is physically ordered by dept_id first.` },
    ],
    practice: [
      { prompt: `Write a query using a window function to find, for each department, the top 2 highest-paid employees (not just the single highest) — without collapsing any rows via GROUP BY.`, solution: `<div class="codeblock"><span class="k">SELECT</span> name, dept_id, salary
<span class="k">FROM</span> (
  <span class="k">SELECT</span> name, dept_id, salary,
         RANK() <span class="k">OVER</span> (<span class="k">PARTITION BY</span> dept_id <span class="k">ORDER BY</span> salary <span class="k">DESC</span>) <span class="k">AS</span> rnk
  <span class="k">FROM</span> Employees
) ranked
<span class="k">WHERE</span> rnk <= 2;</div>RANK() is computed per-department (PARTITION BY dept_id) ordered by salary descending, then the outer query filters to just ranks 1 and 2. Using RANK (not ROW_NUMBER) means genuine salary ties both correctly get rank 1, which is usually the intended behavior for "top N" — worth explicitly deciding whether ties should both count or not.` },
      { prompt: `An API endpoint lists 100 blog posts, and for each post makes a separate query to fetch its author's name — 101 total queries per page load. Rewrite this as a single, efficient query pattern and name the anti-pattern being fixed.`, solution: `<strong>Anti-pattern:</strong> the N+1 query problem (1 query for posts + N queries for authors).<br><br>
     <strong>Fix — single JOIN query:</strong>
     <div class="codeblock"><span class="k">SELECT</span> p.id, p.title, p.body, a.name <span class="k">AS</span> author_name
<span class="k">FROM</span> Posts p
<span class="k">JOIN</span> Authors a <span class="k">ON</span> p.author_id = a.id
<span class="k">ORDER BY</span> p.created_at <span class="k">DESC</span>
<span class="k">LIMIT</span> 100;</div>
     One round trip to the database instead of 101, fetching exactly the same data. If for some reason a JOIN genuinely isn't viable, the next-best fix is batching: collect all distinct author_ids from the 100 posts first, then issue one <code>SELECT * FROM Authors WHERE id IN (...)</code> — still just 2 queries total instead of 101.` },
    ],
  },
];
