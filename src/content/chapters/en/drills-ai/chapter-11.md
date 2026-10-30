---
workedOn: 2026-10-26
---

This chapter gathers what broke, how I diagnosed it, what the tests really check, and the latency measurements as they are, without dressing them up.

## The concept

A measurement is kept with its failures. An optimisation is proven by numbers, and when the numbers prove nothing, I write that down.

## The incidents

| Symptom | Established cause or lead | What I did |
| --- | --- | --- |
| `ModuleNotFoundError: mcp` when starting pytest | SDK missing from the environment, interpreter from another clone | Activate the right venv, install the requirements with MCP |
| Python 3.12 deemed incompatible | Old `requires-python >=3.14` | Moved to `>=3.12` |
| `git pull`: "not currently on a branch" | Review in detached HEAD | Inspect local work, go back to the MVP clone |
| `zsh: bad pattern: ^[[200~cd` | Stray paste marker | Retype the command; Git is not corrupted |
| CV imported, but path to retype | Inconsistent validation and flow | Reuse the extraction as the profile; journey tests |
| Import extracts, no assessment | The next step can fail | Look at import and assessment separately |
| `502`, `draft_quote:4`, `candidate_quote:0` | Reference rejected | Bounded correction, then excerpt IDs; the validator stays |
| Pull succeeded, old interface | Old service worker, mixed versions | Retirement worker, targeted cache |
| FR/EN resets the dossier | State not shared | Common key, tests navigating between languages |
| The CV is one block | Not enough sections | Structured CV, old drafts normalised, rich editor |
| Formatting buttons stay on | Toggle and selection to fix | Adapted toolbar, tests |
| Too much scrolling | Everything in one view | Separate steps, controls on demand |
| 100% with an unchecked condition | Skills and eligibility mixed up | Two separate pieces of information |
| The percentage disappears | The warning replaced the score | Score shown with the warning, even at 0 |
| "Next" blocked without storage | Navigation tied to saving | Best-effort saving, you move on anyway |
| Long wait on the assessment | Analysis and drafting grouped, and other factors | Split, instrument, measure |
| A job source goes down | Network or provider format | Show it as unavailable; no fabricated postings |
| Audio cut, feedback in the wrong language | Intermediate journey | Stabilised, then removed from scope |
| Blurry YouTube video | Playback at automatic 240p | Change the player quality, not the file |

## The order to diagnose a failure

1. Note the page, the action, the commit and the time, without copying the CV into a public log.
2. Check the frontend calls the right backend.
3. Read the request in the Network tab: endpoint, status, duration, error.
4. Check `/health`, keeping its limit in mind: a key present is not a valid key.
5. Compare network duration and server duration.
6. Read the step's log line in Render, with authorised access.
7. Reproduce with fictional input.
8. Fix it, and add a check that reproduces the failure.
9. Check frontend and backend separately.

| Status | Likely reading |
| --- | --- |
| 200 | Accepted; check the content too |
| 410 | Removed feature, for a valid request |
| 422 | Invalid input: consent, length, type, PDF |
| 429 | Route quota or concurrent capacity reached |
| 502 | Output rejected, provider error or masked internal failure |
| 503 | Service not configured |
| 504 | Timeout exceeded |

The "Cancel" button stops the wait in the interface. It does not prove the provider stopped computing, or that the request will not be billed.

## What the tests prove

On October 26, on the documented version: 120 Python tests, 35 frontend contract tests and 35 UI tests passed; Astro build and public-content check passed; four GitHub Actions runs passed; a real PDF import and a real assessment followed by drafting, with fictional data.

These 190 tests include historical components. They are not 190 hiring scenarios. The UI tests run in jsdom: they do not replace Safari, Chrome and mobile. The backend tests replace the model with mocked answers: a fake model.

| Family | What it brings |
| --- | --- |
| `test_application.py` | Evidence, score, bounded correction, PDF, analysis and drafting split |
| `test_api.py` | API contracts and errors |
| `test_jobs.py` | Adapters and job filter |
| `test_opportunities_mcp.py` | MCP tools and shared rules |
| `application-ui.test.mjs` | Import, journey, deferred drafting, errors, score, storage |
| `home-ui.test.mjs`, `progress-ui.test.mjs` | Entry, resume and tracking |

## Latency, without dressing it up

One-off measurements on October 26, same small fictional profile, same fictional posting. Not a production average, not a percentile, not a load test.

| Run | Total time observed | Server duration reported |
| --- | ---: | ---: |
| Old full endpoint, before publishing | 14.94 s | 8.052 s |
| New text PDF import | 8.34 s | 1.648 s |
| New assessment alone, first run | 14.25 s | 9.354 s |
| Deferred drafting of that assessment | 8.73 s | 4.228 s |
| Old full endpoint, second run | 13.46 s | 7.403 s |
| New assessment alone, second run | 18.31 s | 12.966 s |

**Conclusion: these runs do not show lower latency for the first assessment.** Splitting the steps, extracting the PDF without a model and reusing an unchanged result remove useless work, but the overall result stays variable. Deferred drafting adds a second request if the candidate asks for documents. The gap between total and server duration does not let me blame OpenAI or Render: Render's private logs were not accessible. No model change was made after these measurements.

## What remains to evaluate

| Dimension | Current limit | Useful measure |
| --- | --- | --- |
| Requirements | The model can miss or overweight some | Annotated postings, agreement with human review |
| Evidence | Textual presence is not relevance | Review of each requirement / evidence link |
| Score | Heuristic threshold and weights | User understanding, comparison with a business grid |
| Language | Instructions do not guarantee the output language | FR/EN review, profiles and postings in different languages |
| Documents | Over-reading, repetition, generic tone | Number and nature of human corrections |
| PDF | Reading order, OCR, tables, columns | Varied corpus, AI fallback rate |
| Postings | Five boards, word filter | Relevance on real searches |
| Performance | First assessment variable | p50 / p95 durations per step |
| Cost | No unit cost established | Tokens and cost per assessment |
| Effect | No effect on interviews shown | Applications sent, answers received |

## The debt found on October 30

- **A historical route still active.** `POST /api/coach` still calls `MentorAgent` if a key is configured. It does not have the same limits or logs as the candidate operations (it uses `logger.exception`). To switch off or review.
- **Outdated descriptions.** The FastAPI description still talks about exercise generation; the 410 message of the old route suggests a removed interview preparation; the npm package is still called `python-drills`.
- **Compatibility kept.** The `interview_questions` field is still filled on the backend, without bringing the interface back.
- **Limited protection.** CORS is not authentication; in-memory quotas are not a spending cap.
- **Long inputs and complex PDFs** deserve a dedicated review.
- **The local dossier** is not encrypted by the app, nor recoverable on another device.

These are backlog items, not fixes already made.

## What I keep

- I keep the worst run next to the best one.
- A test says what it checks, no more: 190 tests do not prove more interviews.
- Debt is written down, even when it is not fixed.

## The Python mechanisms

- [My Python for AI 101, chapter 12 · Testing and evaluating](/en/books/python-for-ai-101/chapter-12/): card 59, pytest and `monkeypatch`, to remove the key, switch off the limiter, or replace the model with a planned answer.

## The defense question

> What performance gain did you get?

Avoided calls and deferred drafting. My runs do not prove the first assessment is faster, and I do not claim it.

> What is still the riskiest?

The quality of the interpreted evidence, the number of truly suitable postings, latency, and the real value for the candidate.
