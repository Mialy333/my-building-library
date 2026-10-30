---
workedOn: 2026-10-26
---

The frontend is on GitHub Pages, the backend on Render. Two hosts, two deployments that know nothing of each other. This chapter describes how the product is delivered, protected, observed, and how to roll back.

## The concept

Each proof says one thing. A commit proves a change is versioned; a green CI, that its tests pass; a green `/health`, that the service answers. None of them alone proves the journey works online.

## The delivery topology

<figure class="diagram"><svg viewBox="0 0 340 420" role="img" aria-labelledby="d-deliv-en-t"><title id="d-deliv-en-t">Delivery topology</title><rect class="d-box" x="70" y="8" width="200" height="46" rx="10"/><text class="d-t" x="170" y="28.5" text-anchor="middle">GitHub repository</text><text class="d-s" x="170" y="42.5" text-anchor="middle">Mialy333/drills.ai</text><polyline class="d-l" points="130,54 83,88"/><polygon class="d-head" points="83,88 90.8,86.8 86.6,81.0"/><polyline class="d-l" points="210,54 257,88"/><polygon class="d-head" points="257,88 253.4,81.0 249.2,86.8"/><rect class="d-key" x="8" y="88" width="150" height="48" rx="10"/><text class="d-m" x="83" y="109" text-anchor="middle">main</text><text class="d-s" x="83" y="123" text-anchor="middle">default branch</text><rect class="d-box" x="182" y="88" width="150" height="48" rx="10"/><text class="d-m" x="257" y="109" text-anchor="middle">feat/hackathon-mvp</text><text class="d-s" x="257" y="123" text-anchor="middle">temporary mirror</text><polyline class="d-l d-dash" points="158,112 182,112"/><polygon class="d-head" points="182,112 175.0,108.4 175.0,115.6"/><polyline class="d-l" points="83,136 83,166"/><polygon class="d-head" points="83,166 86.6,159.0 79.4,159.0"/><polyline class="d-l" points="257,136 257,166"/><polygon class="d-head" points="257,166 260.6,159.0 253.4,159.0"/><rect class="d-box" x="8" y="166" width="150" height="62" rx="10"/><text class="d-t" x="83" y="187.5" text-anchor="middle">Pages workflow</text><text class="d-s" x="83" y="201.5" text-anchor="middle">Astro build with</text><text class="d-s" x="83" y="215.5" text-anchor="middle">DRILLS_API_URL</text><rect class="d-box" x="182" y="166" width="150" height="62" rx="10"/><text class="d-t" x="257" y="187.5" text-anchor="middle">Render</text><text class="d-s" x="257" y="201.5" text-anchor="middle">pip install -r</text><text class="d-s" x="257" y="215.5" text-anchor="middle">requirements-mcp.txt</text><polyline class="d-l" points="83,228 83,258"/><polygon class="d-head" points="83,258 86.6,251.0 79.4,251.0"/><polyline class="d-l" points="257,228 257,258"/><polygon class="d-head" points="257,258 260.6,251.0 253.4,251.0"/><rect class="d-key" x="8" y="258" width="150" height="50" rx="10"/><text class="d-t" x="83" y="280.5" text-anchor="middle">GitHub Pages</text><text class="d-s" x="83" y="294.5" text-anchor="middle">/drills.ai/ · FR and EN</text><rect class="d-key" x="182" y="258" width="150" height="50" rx="10"/><text class="d-t" x="257" y="280.5" text-anchor="middle">FastAPI API</text><text class="d-s" x="257" y="294.5" text-anchor="middle">uvicorn · /health</text><polyline class="d-l" points="158,283 182,283"/><polygon class="d-head" points="182,283 175.0,279.4 175.0,286.6"/><text class="d-s d-halo" x="170" y="326" text-anchor="middle">API calls</text><rect class="d-ghost" x="8" y="344" width="324" height="66" rx="12"/><text class="d-s" x="20" y="366" text-anchor="start">Separate CI: Full-stack validation,</text><text class="d-s" x="20" y="384" text-anchor="start">Python agent pipeline tests.</text><text class="d-s d-a" x="20" y="402" text-anchor="start">In parallel: not a gate before publishing.</text></svg><figcaption>Two hosts, two independent deployments. A green CI does not prove Render redeployed the right commit.</figcaption></figure>

| Service | Configuration | Watch out |
| --- | --- | --- |
| GitHub Pages | `main` → Deploy to GitHub Pages workflow | Astro base `/drills.ai/`, with the trailing slash |
| Render | `feat/hackathon-mvp` in `render.yaml` | Temporary mirror of `main`, not a competing branch |
| Render runtime | Python 3.12.10 and free plan declared | The real dashboard was not checked again |
| Backend build | `pip install -r requirements-mcp.txt` | Includes the API requirements and the MCP SDK |
| Start | `uvicorn api.main:app --host 0.0.0.0 --port $PORT` | Port provided by the host |
| Health | `/health` | Does not test an OpenAI request |
| Frontend | `DRILLS_API_URL` → `PUBLIC_DRILLS_API_URL` | Injected at the GitHub Actions build |
| Secret | Backend environment | Never in the static site |

## CI: what it checks, and what it does not

The CI/CD fits in three workflows.

| Workflow | Checks |
| --- | --- |
| Full-stack validation | Frontend contracts, build, UI tests, offline Python suite |
| Python agent pipeline tests | Python 3.12 and the full pytest suite |
| Deploy to GitHub Pages | npm install, build, publishing |

**Careful with the word "gate".** The Pages workflow depends on its own build, not on Full-stack validation passing. Workflows can run in parallel. Publishing only when every test passes would need extra coordination. The four runs attached to the documented commit passed; their statuses were read again on October 30, without rerunning the suites.

## Changing without losing history

```bash
git switch main
git pull --ff-only
git switch -c feat/name-of-the-change
```

Then: the change, the tests, the diff read, a commit of the intended files only, a PR to `main`. As long as Render follows the mirror branch, I sync it explicitly, if it is clean:

```bash
git fetch origin
git switch feat/hackathon-mvp
git merge --ff-only origin/main
git push origin feat/hackathon-mvp
```

A refused fast-forward signals a divergence to look at. I do not work around it with a force-push. Moving Render to `main` is planned, not done: check `main`, change the branch in the Render settings, set `branch: main` in `render.yaml`, check the deployment, and only then delete branches. Changing the YAML alone does not prove the service followed.

## Routes and limits

| Route | Use | Declared limit |
| --- | --- | --- |
| `GET /health` | Health, key present or not | No generation |
| `POST /api/profile-import` | Reading the PDF | 3 per minute, 10 per hour |
| `POST /api/assessment` | Assessment without drafts | 3 per minute, 20 per hour |
| `POST /api/application-drafts` | Deferred drafting | 3 per minute, 20 per hour |
| `POST /api/application` | Old full journey | 3 per minute, 20 per hour |
| `GET /api/jobs` | Job list | 10 per minute |
| `/mcp/` | MCP transport, if enabled | Bounded body; not necessarily the same quotas |
| `POST /api/drills`, interview routes | Removed features | 410 for a valid request |
| `POST /api/coach` | Historical companion | Still active, 10 per minute, not in the journey |

Candidate operations share a 2-slot semaphore per process. They have an overall limit of 95 seconds; the OpenAI client has a 90-second timeout and `max_retries=0`. The business corrective attempt is not a network retry. These per-IP and per-process rate limits protect a demo: they are not authentication, not a spending cap, and not a limit shared across instances.

From the repository (code written with the help of ChatGPT and Codex):

```python
application_slots = asyncio.Semaphore(2)

async def run_application_operation(operation, stage="application"):
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=503, detail="Application service is not configured.")
    if application_slots.locked():
        raise HTTPException(status_code=429, detail="Application service is busy. Please try again shortly.")
    async with application_slots:
        ...
        result = await asyncio.wait_for(operation(), timeout=95)
```

A single anonymous call to `/health` goes out when the app opens, so the host's wake-up (the cold start) happens while the candidate types. It is not a keep-alive, and it does not guarantee a warm instance.

## Logging without exposing

The candidate journey logs durations and fixed codes, never the text of the CV, the posting or the drafts:

```text
PDF extraction route=text duration_ms=...
Application stage=assessment duration_ms=... outcome=ok
Application preparation rejected: candidate_quote:0
```

Private responses carry `Cache-Control: no-store` and `Server-Timing`. The server duration does not include all the network transport.

## Rolling back

Find the last healthy commit, make a controlled revert on the working branch, read the diff and the tests, then resync the deployment references. Never a brutal reset of the remote history, nor wiping browser dossiers to fix a code failure. An emergency rollback through the host must then be reconciled with Git.

## Before a demo

- Open the normal link in a test browser, with no personal dossier.
- Check the deployed commit, frontend and backend.
- `/health`, then a real journey with consent and fictional data.
- Import a text PDF, paste a posting and its link, read score and conditions.
- Request the documents, edit a sentence, test the export.
- Check that sending only counts after an explicit action.
- Switch language, and check the dossier stays.
- Keep the published video as a backup, presented as a recording.

## What I keep

- Two independent deployments, so two checks.
- A demo limit is not security: I say what it protects.
- Logs say where and how long, never what.

## The Python mechanisms

- [My Python for AI 101, chapter 10 · Network, time and concurrency](/en/books/python-for-ai-101/chapter-10/): card 49, measuring a duration and bounding a wait (here the asyncio version, with `wait_for`); card 52, the lock, to compare with the two-slot semaphore.
- [My Python for AI 101, chapter 2 · Organizing the project](/en/books/python-for-ai-101/chapter-02/): card 3, refusing to work without configuration (here, 503 without a key).

## The defense question

> Does a green CI prove Render is healthy?

No. Render and GitHub Pages each deploy on their own. You have to check the deployed commit and make a real call, with fictional data.
