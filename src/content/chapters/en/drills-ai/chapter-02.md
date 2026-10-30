---
workedOn: 2026-10-26
---

A static Astro interface, a FastAPI API, an application agent, and Python code that checks what the model returns. The candidate's dossier stays in their browser.

## The concept

The component is called `ApplicationAgent`, but the application drives the workflow. The model analyses and drafts; code splits the texts, checks the references and computes the score. It is not an autonomous loop that decides to browse the web, run code or apply.

## The diagram

<figure class="diagram"><svg viewBox="0 0 340 470" role="img" aria-labelledby="d-arch-en-t"><title id="d-arch-en-t">Architecture of the DRILLS.ai MVP</title><rect class="d-ghost" x="4" y="6" width="332" height="92" rx="12"/><text class="d-s" x="14" y="22" text-anchor="start">BROWSER</text><rect class="d-key" x="14" y="32" width="144" height="54" rx="10"/><text class="d-t" x="86" y="56.5" text-anchor="middle">Candidate</text><text class="d-s" x="86" y="70.5" text-anchor="middle">Astro · TypeScript</text><rect class="d-box" x="188" y="32" width="140" height="54" rx="10"/><text class="d-t" x="258" y="56.5" text-anchor="middle">Dossier</text><text class="d-s" x="258" y="70.5" text-anchor="middle">in the browser</text><polyline class="d-l" points="158,59 188,59"/><polygon class="d-head" points="188,59 181.0,55.4 181.0,62.6"/><polygon class="d-head" points="158,59 165.0,62.6 165.0,55.4"/><rect class="d-box" x="14" y="120" width="144" height="48" rx="10"/><text class="d-t" x="86" y="141.5" text-anchor="middle">FastAPI API</text><text class="d-s" x="86" y="155.5" text-anchor="middle">Render</text><rect class="d-box" x="188" y="120" width="140" height="48" rx="10"/><text class="d-t" x="258" y="141.5" text-anchor="middle">Public GitHub</text><text class="d-s" x="258" y="155.5" text-anchor="middle">metadata</text><polyline class="d-l" points="86,86 86,120"/><polygon class="d-head" points="86,120 89.6,113.0 82.4,113.0"/><polyline class="d-l" points="130,86 130,104 258,104 258,120"/><polygon class="d-head" points="258,120 261.6,113.0 254.4,113.0"/><rect class="d-box" x="14" y="196" width="144" height="48" rx="10"/><text class="d-t" x="86" y="224.5" text-anchor="middle">ApplicationAgent</text><rect class="d-box" x="188" y="196" width="140" height="48" rx="10"/><text class="d-t" x="258" y="224.5" text-anchor="middle">OpenAI Responses</text><polyline class="d-l" points="86,168 86,196"/><polygon class="d-head" points="86,196 89.6,189.0 82.4,189.0"/><polyline class="d-l" points="158,220 188,220"/><polygon class="d-head" points="188,220 181.0,216.4 181.0,223.6"/><polygon class="d-head" points="158,220 165.0,223.6 165.0,216.4"/><rect class="d-key" x="14" y="272" width="144" height="54" rx="10"/><text class="d-t" x="86" y="296.5" text-anchor="middle">Python validation</text><text class="d-s" x="86" y="310.5" text-anchor="middle">references · score</text><polyline class="d-l" points="86,244 86,272"/><polygon class="d-head" points="86,272 89.6,265.0 82.4,265.0"/><polyline class="d-l d-acc" points="14,299 6,299 6,144 14,144"/><polygon class="d-head d-acc" points="14,144 7.0,140.4 7.0,147.6"/><rect class="d-box" x="188" y="340" width="140" height="48" rx="10"/><text class="d-t" x="258" y="361.5" text-anchor="middle">Public job boards</text><text class="d-s" x="258" y="375.5" text-anchor="middle">Greenhouse · Ashby</text><polyline class="d-l" points="158,156 173,156 173,364 188,364"/><polygon class="d-head" points="188,364 181.0,360.4 181.0,367.6"/><rect class="d-box d-dashbox" x="188" y="414" width="140" height="48" rx="10"/><text class="d-t" x="258" y="435.5" text-anchor="middle">MCP client</text><text class="d-s" x="258" y="449.5" text-anchor="middle">external, if linked</text><polyline class="d-l d-dash" points="258,414 258,388"/><polygon class="d-head" points="258,388 254.4,395.0 261.6,395.0"/><polyline class="d-l d-dash" points="188,438 86,438 86,326"/><polygon class="d-head" points="86,326 82.4,333.0 89.6,333.0"/></svg><figcaption>What runs in the MVP. The plum arrow: the result goes through Python validation before it returns to the API. Dotted: the MCP surface, which shares the job boards and the score but cannot see the dossier.</figcaption></figure>

- **No account.** No sync across devices, no server memory of the dossier, no vector database of CVs.
- **Job search does not depend on the profile.** The CV is not sent to the job boards.
- **The MCP surface** shares the job-board adapters and the score rules, but it cannot read a browser's dossier.

## Who does what

| Component | Responsibility | Nature |
| --- | --- | --- |
| `ApplicationAgent.import_pdf()` | Read the text; use OpenAI if local extraction fails | Classic extraction, then AI if needed |
| `ApplicationAgent.assess()` | Identify role, scope and requirements; link the evidence | Structured AI call |
| `ApplicationAgent.draft()` | Draft CV and pitch from the kept assessment | Separate structured AI call |
| `source_excerpts()` | Split the texts into numbered excerpts | Deterministic code |
| `resolve_selection()` | Replace the chosen IDs with the original passages | Deterministic code |
| `validate_requirements()`, `validate_analysis()` | Check the references and some consistency rules | Deterministic code |
| `calculate_match()` | Compute the score and the decision | Deterministic code |
| `prepare()` / `POST /api/application` | Produce the old full result | Compatibility with older clients |

Three rows out of eight call the model. The other five are code you can test without a network.

## The stack

| Layer | Tool | Role |
| --- | --- | --- |
| Frontend | Astro, TypeScript, HTML, CSS | Static bilingual pages; interactions in the browser |
| Editor | Tiptap | Structured, editable CV with a word-processor toolbar |
| Frontend validation | Zod | Response contracts and the browser dossier |
| API | FastAPI, Uvicorn, Python | Candidate operations and integrations |
| Backend validation | Pydantic v2 | Typed inputs and outputs; unexpected fields rejected |
| AI | OpenAI Python SDK, Responses API, Structured Outputs | PDF fallback, profile / posting comparison, drafting |
| Default model in the code | `gpt-4o-2024-08-06` | Overridable with `OPENAI_APPLICATION_MODEL`; the actual value on Render was not checked |
| PDF | `pypdf==6.21.2` | Text extraction in a bounded subprocess |
| Network | httpx | Reading the Greenhouse and Ashby boards |
| Limits | SlowAPI, asyncio semaphore | Per-route limits; two candidate operations at a time per process |
| MCP | `mcp[cli]==2.3.0` | Optional stateless Streamable HTTP server |
| State | sessionStorage; localStorage when opted in | Dossier in the browser, no account database |
| Tests | pytest, Node tests, jsdom | Offline mocked backend, contracts, DOM interactions |
| Delivery | GitHub Actions, GitHub Pages, Render | Checks; frontend and backend hosted separately |

The declared versions are ranges (Astro `^7.4.1`, Zod `^4.6.7`, OpenAI SDK `>=2,<4`). The npm lockfile is the reference for the frontend. Render installs from the requirements files, which do not pin every dependency: `uv.lock` alone does not make this Python deployment reproducible.

A dependency in the repository is not necessarily used by the MVP. Pyodide, the old agents, the lessons and the exercises are the legacy of the first version.

## Where to read the code

| Path | To understand |
| --- | --- |
| [`src/pages/[lang]/apply.astro`](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/src/pages/%5Blang%5D/apply.astro) | The profile, opportunities, assessment and documents screens |
| [`src/scripts/application.ts`](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/src/scripts/application.ts) | Navigation, import, API calls, candidate actions |
| [`src/lib/application-state.ts`](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/src/lib/application-state.ts) | Validating and keeping the dossier |
| [`src/ai_generator/application.py`](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/src/ai_generator/application.py) | Active agent, references, score, generation |
| [`src/ai_generator/pdf_text.py`](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/src/ai_generator/pdf_text.py) | Bounded PDF extraction |
| [`src/integrations/jobs.py`](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/src/integrations/jobs.py) | Job sources and cache |
| [`api/main.py`](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/api/main.py), [`api/mcp_app.py`](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/api/mcp_app.py) | HTTP routes, errors, limits, MCP tools |
| `src/ai_generator/orchestrator.py`, `agents/` | The historical phase 1 architecture |
| `render.yaml`, `.github/workflows/` | Deployment and CI |

## What I keep

- Calling a component an "agent" does not make it autonomous. I can say what it decides: analysing and drafting, inside a frame set by code.
- What the model produces goes through code before it reaches the screen.
- Present in the repository does not mean used by the product.

## The Python mechanisms

- [My Python for AI 101, chapter 5 · Text](/en/books/python-for-ai-101/chapter-05/): card 21 (strict JSON) writes by hand the boundary that Pydantic holds here, with `extra="forbid"`.

## The defense question

> Do you have several agents?

Yes in the initial prototype. The current candidate journey mostly uses `ApplicationAgent` and checks in Python.

> Do you use RAG?

No. No vector database and no semantic search over a corpus. The texts the candidate provides are split into numbered excerpts, which the model references.
