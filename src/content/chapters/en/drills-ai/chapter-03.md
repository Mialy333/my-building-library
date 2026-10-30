---
workedOn: 2026-10-30
---

Before touching the product, I start again from a known state. During the hackathon, several branches, worktrees and detached-HEAD reviews lived side by side. Resuming cleanly is a skill in its own right.

## The concept

A push only saves what is committed. Before changing anything, I look at the real state of the clone, not the one I think I know.

## Before changing an existing clone

```bash
git status --short --branch
git branch -vv
git log --oneline --decorate --branches --not --remotes
git worktree list
```

- Modified or untracked files do not leave with a push.
- An empty result for the `git log` does not prove the worktrees are clean.
- A worktree in detached HEAD can hold useful work without being on a branch.
- I do not delete an old worktree or force a checkout before inspecting and saving its work.
- I do not run `git pull` from a detached review hoping to update the production branch.

To resume cleanly, a new clone:

```bash
git clone https://github.com/Mialy333/drills.ai.git
cd drills.ai
git switch main
git status --short --branch
```

On a clean clone already on the right branch: `git pull --ff-only`. If it refuses, I read the divergence instead of replacing it with a destructive reset.

## Installing

Prerequisites: Git, Node.js 22, Python 3.12 and uv.

```bash
npm ci
uv venv --python 3.12 .venv
source .venv/bin/activate
uv pip install -r requirements-devday.txt -r requirements-mcp.txt
python -c "import sys; print(sys.executable); print(sys.version)"
```

The last line checks the interpreter. If another project's environment is active, I deactivate it first: the `(.venv)` prompt does not prove the interpreter belongs to the current folder.

The backend reads `OPENAI_API_KEY` from its environment or from a `.env` file ignored by Git. The key is never committed, and never put in a `PUBLIC_` variable. `git check-ignore .env` confirms the file is ignored.

## Useful variables

| Variable | Where | Role |
| --- | --- | --- |
| `OPENAI_API_KEY` | Backend only | OpenAI authentication |
| `OPENAI_APPLICATION_MODEL` | Backend, optional | Model for analysis, drafting and AI import |
| `DRILLS_CORS_ORIGINS` | Backend | Allowed frontend origins |
| `DRILLS_ENABLE_MCP` | Backend | `true` to mount `/mcp/` |
| `DRILLS_MCP_HOSTS` | Backend, optional | Extra allowed MCP hosts |
| `RENDER_EXTERNAL_HOSTNAME` | Provided by Render | Host name allowed by the MCP transport security |
| `DRILLS_API_URL` | GitHub Actions variable | Backend address injected at build time |
| `PUBLIC_DRILLS_API_URL` | Frontend build | Public API address, never a key |

In development, the client targets `http://127.0.0.1:8000`. In production, a missing or invalid API variable makes the service unavailable in the interface. Changing Render alone does not change a static frontend that is already built.

## Starting the two terminals

```bash
# Backend terminal, from the root of the clone
source .venv/bin/activate
python -m uvicorn api.main:app --reload --port 8000

# Frontend terminal, from the same root
npm run dev -- --port 4321 --strictPort
```

The local frontend opens at `http://localhost:4321/drills.ai/fr/`: the `/drills.ai/` prefix comes from the Astro configuration. To test MCP, I start the backend with `DRILLS_ENABLE_MCP=true` in front of the command.

## Checking before touching the product

```bash
curl --fail http://127.0.0.1:8000/health
python -m pytest -q
npm run test:contracts
npm run build
npm run test:ui
```

`test:ui` uses the build: the order matters. The backend tests mock the model calls. A green `/health` says the service answers and whether it has a key; it checks neither the API credit nor a full generation.

- Right clone, right branch, interpreter identified.
- Frontend and backend dependencies installed.
- No secret tracked by Git.
- API and frontend on their ports.
- Tests and build checked on the commit actually used.

## What happened with the branches

The project had ten lines of work: `devday-codex`, `feat/agent-orchestration`, `feat/validator-hardening`, `feat/behavioral-validator-tests`, `feat/fastapi-multi-agent-backend`, `feat/drills-ai-ux-refactor`, `feat/offline-first-session`, `feat/ux-journey-audit`, `feat/hackathon-mvp` and `main`.

The terminal showed a modified main clone, a clean UX worktree, and detached-HEAD reviews, one with uncommitted and untracked files. A `git diff --stat` against another branch showed many deletions. That was not proof the work had disappeared, especially for untracked files.

A clone dedicated to the MVP isolated the final product. The October 25 consolidation attached 31 commits missing from its history, keeping the MVP content and the original authors and dates. It was not a blind merge of every branch. On October 30, the ten branches still exist, and `main` and `feat/hackathon-mvp` point to the same commit.

For GitHub contributions, what counts is eligible commits on the default branch, not the number of pushes. No date manipulation was needed.

## What I keep

- Before fixing, I look: status, branches, unpushed commits, worktrees.
- A diff full of deletions says nothing about untracked files.
- A green `/health`: the service answers. Nothing more.

## The Python mechanisms

- [My Python for AI 101, chapter 2 · Organizing the project](/en/books/python-for-ai-101/chapter-02/): card 3, configuration through environment variables, with a key that never leaves the server.

## The defense question

> Your `git pull` refuses: "not currently on a branch". What do you do?

I am in detached HEAD, on a review. I first inspect the local work and save it if needed. Then I go back to the MVP clone and branch, instead of improvising a merge.
