---
workedOn: 2026-10-30
---

This chapter keeps the memory of the choices: the log of the steps with their commits, the architecture decisions and what would change them, then what comes next, to test before building.

## The concept

A decision is written with the option set aside and the criterion that would reopen it. And what comes next for a product is decided after putting it in real people's hands, not before.

## The log

The dates follow the commits and the conversations, not a stopwatch. Some branches moved in parallel.

| Date | Step | Proof | What I took from it |
| --- | --- | --- | --- |
| Oct 24 | Specialised agents | [341d733](https://github.com/Mialy333/drills.ai/commit/341d733) | Split analysis, roadmap, creation and validation |
| Oct 24 | Behaviour contracts | [4a5f86a](https://github.com/Mialy333/drills.ai/commit/4a5f86a) | A test harness that passes on both versions proves nothing |
| Oct 24–25 | API and backend deployment | [52d0bd7](https://github.com/Mialy333/drills.ai/commit/52d0bd7) | The key stays server-side; Python CI |
| Oct 25 | UX rework, teaching MCP pilot | [47a18a7](https://github.com/Mialy333/drills.ai/commit/47a18a7) | Also install the MCP test dependencies |
| Oct 25 | First application journey | [30d5954](https://github.com/Mialy333/drills.ai/commit/30d5954) | Refocus the product on the profile and the posting |
| Oct 25 | Profile reused | [b0c5d93](https://github.com/Mialy333/drills.ai/commit/b0c5d93) | No more typing twice, no more exercise generation |
| Oct 25 | Import → assessment | [6bc6d77](https://github.com/Mialy333/drills.ai/commit/6bc6d77) | Import alone is not the end of the action |
| Oct 25 | Readable assessment | [f35f8ea](https://github.com/Mialy333/drills.ai/commit/f35f8ea) | Coloured evidence, next actions, precise texts |
| Oct 25 | Service worker removed | [d6c3f15](https://github.com/Mialy333/drills.ai/commit/d6c3f15) | An old cache can mix versions |
| Oct 25 | Bounded evidence repair | [6e62197](https://github.com/Mialy333/drills.ai/commit/6e62197) | Explain a failure without an endless loop |
| Oct 25 | Constrained source IDs | [a43b69c](https://github.com/Mialy333/drills.ai/commit/a43b69c) | Choose a passage rather than rewrite the quote |
| Oct 25 | CV toolbar | [a9bd3f8](https://github.com/Mialy333/drills.ai/commit/a9bd3f8) | The draft must be workable |
| Oct 25 | Shared FR/EN state | [313a4ca](https://github.com/Mialy333/drills.ai/commit/313a4ca) | Switching language does not erase the dossier |
| Oct 25 | Structured CV, public GitHub | [0dfbbcc](https://github.com/Mialy333/drills.ai/commit/0dfbbcc) | GitHub metadata ≠ proof of contribution |
| Oct 25 | Greenhouse postings | [e642c1c](https://github.com/Mialy333/drills.ai/commit/e642c1c) | A real posting makes the next step actionable |
| Oct 25 | Audio and pitch feedback | [65d8979](https://github.com/Mialy333/drills.ai/commit/65d8979), [fe9aaea](https://github.com/Mialy333/drills.ai/commit/fe9aaea) | Consent, stable recording, right language |
| Oct 25 | Ashby and opportunities MCP | [7e0e025](https://github.com/Mialy333/drills.ai/commit/7e0e025) | Reuse adapters and score, with no access to the dossier |
| Oct 25 | Separate steps and tracking | [5bb6b99](https://github.com/Mialy333/drills.ai/commit/5bb6b99) | Less scrolling, separate statuses |
| Oct 25 | Fixed technical rubrics | [b57e91d](https://github.com/Mialy333/drills.ai/commit/b57e91d) | Evaluate against an explicit reference |
| Oct 25 | Links and right to work | [db0a61b](https://github.com/Mialy333/drills.ai/commit/db0a61b) | Lead to the sending site; country and rights kept apart |
| Oct 25 | Onboarding, Python categories | [af3cb62](https://github.com/Mialy333/drills.ai/commit/af3cb62) | Simpler entry |
| Oct 25 | Final scope | [27fdf6e](https://github.com/Mialy333/drills.ai/commit/27fdf6e) | Interview preparation leaves the product |
| Oct 25 | Opportunities and navigation | [0298741](https://github.com/Mialy333/drills.ai/commit/0298741) | Controls on demand, aligned buttons |
| Oct 25 | History consolidation | [854babd](https://github.com/Mialy333/drills.ai/commit/854babd) | Keep the lineages without bringing back the old product |
| Oct 25 | README and illustrations | [801480d](https://github.com/Mialy333/drills.ai/commit/801480d) | Document what is delivered |
| Oct 25 | Demo script removed | [1ab6844](https://github.com/Mialy333/drills.ai/commit/1ab6844) | Only publish the demo actually made |
| Oct 26 | Recorded video | [dd97942](https://github.com/Mialy333/drills.ai/commit/dd97942) | A public proof of the product |
| Oct 26 | Text PDF, separate assessment, visible score | [8f45461](https://github.com/Mialy333/drills.ai/commit/8f45461) | Fewer useless calls, measure without overpromising |
| Oct 30 | Runbook audit | Branches, code, CI statuses read again | Same reference commit, no product change |

## The architecture decisions

These condensed ADRs make the choices explicit. The review criteria are proposals, not commitments already validated.

| Decision | Set aside or deferred | Why | Review it if… |
| --- | --- | --- | --- |
| Target the first Agent Engineer application | General course platform | A precise, lived problem | Accessible postings turn out too rare |
| Simple orchestration for the candidate | Four agents every time | The task does not need the exercise chain | An evaluation shows a net gain |
| Structured outputs | Parsing free text | Frontend / backend contract, controllable errors | A need does not fit the schema |
| References by IDs | Quotes copied by the model | Fewer altered quotes and 502 errors | Splitting destroys too much context |
| Score computed in Python | Percentage asked from the model | Explainable, testable formula | A business evaluation justifies other weights |
| Conditions apart from skills | A single score | A good level does not lift a contract restriction | Users stay confused |
| PDF text before AI | Every PDF sent to the model | Avoid a call when the text is there | Too many reading errors |
| Draft after the assessment | Wait for everything before the first result | Remove work from the initial path | Total waiting gets worse |
| Dossier in the browser | Accounts and a profile database | Fast MVP, less central data | A validated need for sync |
| Five public boards | Broad scraping | Bounded scope, traceable links | Testers lack relevant postings |
| Read-only MCP tools | An agent that applies | Reuse without risky outside action | A real use justifies it |
| Remove interview preparation | Make the journey longer | Focus on getting the interview | The core is validated and the demand comes back |
| `main` + Render mirror | Delete the branches right away | Do not cut a deployment | Render has moved to `main` |

## What comes next: test before adding

The product decision: test the delivered core before adding accounts, new agents or a new interview preparation.

**A first session, proposed** (20 to 30 minutes, to run):

1. Ask for the person's agreement and explain what happens to their data.
2. Use their profile and a posting they really want, or fictional data if they prefer.
3. Let them go through the four steps without guiding each click.
4. Note hesitations, errors and waits, without keeping needless personal content.
5. Ask them to explain the score and the conditions in their own words.
6. See which evidence they recognise, dispute or want to add.
7. Compare the draft with the version they would agree to send.
8. Check they find the posting and understand that sending happens elsewhere.
9. Collect the outcome later, with their agreement.

| Indicator | Proposed definition | Safeguard |
| --- | --- | --- |
| Activation | Usable profile, posting, first assessment finished | A visit does not count |
| Autonomy | Journey finished without my help | Note the help actually given |
| Preparation time | From the profile to a document judged usable | Separate system waiting and reviewing |
| Factual corrections | Facts added, altered or misread | A fluent text is not necessarily acceptable |
| Understanding | Score and eligibility explained correctly | Do not hint the answer |
| Taking action | Application declared sent | An opened link is not a sending |
| Return | New posting analysed on their own | Do not prompt the return |
| Interviews | Interviews reported on tracked applications | Self-reported; no causality established |

**The backlog, to decide on:** handle the coaching route and the outdated descriptions; get the operations logs; build a small annotated FR/EN evaluation set, with negative cases and contract conditions; test several CV layouts; watch real career changers; measure job coverage, cost, failures, delays and corrections; move Render to `main` before deleting branches; review the coordination between tests and deployment. Monetisation ideas remain hypotheses: no traction or revenue figure is put forward.

## What I keep

- Each decision carries its own condition for going back.
- The log shows the path, including what I built and then removed.
- The next step is an observation, not a feature.

## The defense question

> Why didn't you add user accounts?

Because the need is not validated yet. The dossier in the browser is enough for the MVP and avoids storing CVs on a server. I would review it if testers really need to pick up their dossier on another device, and only with a written retention policy.
