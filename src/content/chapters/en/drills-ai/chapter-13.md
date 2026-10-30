---
workedOn: 2026-10-30
---

The last chapter is for revising. It goes over the project's notions with the question that tests each one, then the defense questions, and what DRILLS.ai shows about my work.

## The concept

The project's common thread: **a credible application needs facts, checks and understandable limits, not just fluent text.** It also holds for the way I present DRILLS.ai.

## The notions, one question each

| Notion | In DRILLS.ai | The defense question |
| --- | --- | --- |
| Specialised agent | Instructions and an output contract for one task | What does the agent really decide? |
| Orchestration | The old Analyst → Coach → Creator → Validator chain | Why is it no longer the current journey? |
| Structured output | Pydantic sent to Responses, Zod in the interface | Does valid JSON guarantee a true analysis? No |
| Constrained reference | Original excerpt IDs, resolved in Python | Why not have the model copy a quote? |
| Grounding | The passage exists in the profile or the posting | What is left to check about its relevance? |
| Deterministic score | Weights 3 / 2 / 1, credit 1 / 0.5 / 0 | What still varies from one run to the next? |
| Eligibility | Administrative conditions apart from skills | Why doesn't a good score lift an internship condition? |
| Consent | `Literal[True]` in the requests, agreement in the interface | Which data leaves, to whom, and when? |
| Untrusted data | CVs and postings treated as data | What protects against an instruction hidden in a posting? |
| Human control | Review and editing before export | What happens when the draft over-reads? |
| Static validation | AST and real assertions in the old validator | Why doesn't it replace running the code? |
| Discriminating harness | Broken and fixed fixtures, same harness | Can a green test prove nothing? |
| Bounded PDF extraction | Subprocess, timeouts, memory, pages | When is AI still needed? |
| Deferred drafting | Assessment first, documents on demand | What work leaves the waiting path? |
| Local reuse | Same profile, same posting, same language → result kept | When must the result be invalidated? |
| Versioned state | Strict schema, dossier expiry | What happens to blocked or corrupted storage? |
| MCP | Tools shared with an external client | Is an MCP endpoint a database or an agent? No |
| Observability | Step, duration, outcome, error code | How do you tell transport, extraction, model and validation apart? |
| CI/CD | Tests, build and deployments apart | Does a green CI prove Render is healthy? No |
| Proof of impact | Time saved and outcomes to measure | Why don't 190 tests prove more interviews? |

## The defense questions

| Question | Defensible answer |
| --- | --- |
| Why not just ChatGPT? | The product organises a reusable, controlled journey. The gain over prompts still has to be measured with users. |
| Do you have several agents? | Yes in the initial prototype. The current journey mostly uses `ApplicationAgent` and Python checks. |
| Do you use RAG? | No vector database and no semantic search. The texts provided are split into references. |
| Does MCP make the analysis true? | No. It exposes tools; the quality of requirements and evidence still needs evaluating. |
| Does the score measure a chance of being hired? | No. Documented coverage of extracted requirements. |
| Did you remove hallucinations? | No. Structure and references are checked, but an interpretation can still be wrong. |
| What performance gain? | Avoided calls and deferred drafting. The runs do not prove a faster first assessment. |
| Do the tests prove the product works? | They check software behaviour. The effect on candidates still has to be tested. |
| Can the candidate apply? | They find the original link and apply themselves. DRILLS.ai sends nothing. |
| The riskiest part? | The quality of interpreted evidence, the supply of suitable jobs, latency, the real value for the candidate. |

## What this project shows

- **Product.** Start from a lived problem, cut the scope, refuse to pile up features, link an analysis to a concrete action.
- **Engineering.** Contracts between frontend and backend, structured outputs, checked references, computation kept apart from interpretation, errors and deployments handled.
- **Quality.** Suitable tests, the difference between an assertion that exists and proof of behaviour, data preserved during fixes, an optimisation measured without inventing the gain.
- **Working with AI.** ChatGPT and Codex assisted me with design, code and iterations. It is work done with that help, not code written without tools.
- **Transparency.** A project base existed before the pivot. The weekend transformed the product; it did not create everything.

In one sentence, for an interview: *I turned a coding-exercise prototype into an application tool for people switching careers into Agent Engineering. You import a CV, choose a posting, see the evidence and the points to clarify, then prepare editable documents before applying. Astro, TypeScript, FastAPI and the OpenAI API, with structured outputs, checked references and a score computed in Python. The MVP is live; its value on real job searches still has to be evaluated.*

## Keeping the runbook up to date

At each major change: note the inspected commit; update the date, the scope and the contracts; add a log line with its proof and its limit; review a decision that changes; date tests and measurements, keep the failures; caption screenshots that became historical; check commands, routes and branches; never turn a backlog idea into an achievement; read again before publishing, to keep out secrets and candidate data.

## What I keep

- A commit proves a change is versioned. A test proves the behaviour it checks. A deployment proves a version is online.
- None of the three, alone, proves the product helps more people get an interview.

## The defense question

> What in DRILLS.ai is checked by code before being shown?

The references of each piece of evidence (they exist in the profile or the posting), the shape of the answer (strict schema), the score and the decision (computed in Python), and the dossier read back in the browser (Zod schema). The meaning of a requirement and the truth of a CV still need a person to review them.
