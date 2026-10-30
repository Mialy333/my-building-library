---
workedOn: 2026-10-22
---

This book collects the Python mechanisms that run my agents, one per card, with the input, the output and the file where you can read them again. The 68 cards come from four projects: the Dev3Pack bootcamp, two projects of the AWS Nanodegree (AI Support Agent and NovaMart), and my build DRILLS.ai. They are sorted by family, from the layout of the project to the tests. Every card says which project it comes from, and every chapter ends with "In the field": the chapters of my courses and my projects where these mechanisms are at work.

The pure-Python outputs were replayed on October 22 against the code in the repos. For NovaMart, the ones that go through AWS come from the project's evidence (`evidence/`), as the lab account has since been reset. The DRILLS.ai cards (61 to 68) were replayed on October 30 on commit `8f45461`, with no network and no model call.

## How to read a card

Every card follows the same order: in one sentence, why it matters for an agent, an analogy, the mechanism (the useful piece of code), the real input and output, where to read it again, and what to reuse. Like BAA 101, a card holds for anyone; my own path, step by step, is told in the [Dev3Pack](/en/books/dev3pack/) and [AWS Scholars](/en/books/aws-scholars/) books.

## The code read, and who wrote it

**Dev3Pack AI Engineering Bootcamp**

| Code read | Who wrote it |
| --- | --- |
| The course package, `src/bootcamp_agent/` | The course. I call it from every notebook. |
| My 15 submitted notebooks, `submissions/Mialy333/chNN/` | Me. Since October 2, some `TODO(you)` cells are written by the assistant (Claude), and the chapter's log says so. |
| The Gecko capstone, `my-gecko-buyer/` | The course for the structure and the examples; the assistant (Claude), at my request, for the TODOs. |
| The final assignment, `grounded-research-agent/agent.py` | The assistant (Claude), at my request, from the course template. |

"ch06 · cell 13" points to cell 13 of my `ch06` notebook. Week 0 (`w01` to `w12`) is not covered: it was not submitted.

**AI Support Agent**

| Code read | Who wrote it |
| --- | --- |
| `starter/`: `main.py`, `lambda/`, `setup_permissions.py` | The skeleton, the docstrings and the CLI section come from Udacity. The TODOs (tools, memory hook, agent, trace loop) are mine. |
| The trace logging in `main.py` | Added during the revision the reviewer asked for. |

**NovaMart Multi-Agent Support**

| Code read | Who wrote it |
| --- | --- |
| The starter's protected files: `config.py`, `src/agent_observability.py`, `src/agent_utils.py`, `src/agentcore_cli.py`, `src/bedrock_kb_retrieval.py`, `tests/test_agent.py`, `infrastructure/` | Udacity. I read them, I don't change them. |
| `src/agent_orchestrator.py` | The stubs and helpers come from the starter. The TODOs and the extras are mine, from the runbook's excerpts, with the assistant at my request. |
| The step 7 extras: `scripts/`, `frontend_proxy/` | Me, with the assistant, at my request. |

**DRILLS.ai**

| Code read | Who wrote it |
| --- | --- |
| `src/ai_generator/`, `src/integrations/`, `api/`, `tests/` | Me, with the help of ChatGPT and Codex for design, code and iterations. A project base existed before the hackathon pivot. |

## The links

Every path under "Where to read it again" opens the file on GitHub, on the exact line for Python code. The links are pinned to a commit, so they stay right even if the code changes later: `8c4726f` for the Dev3Pack course, `77d2a92` for my-gecko-buyer, `dc60e44` for grounded-research-agent, `1f7c614` for AI Support Agent, `fef122e` for NovaMart, `8f45461` for DRILLS.ai. For a notebook, the link opens the submitted file: GitHub cannot point to a cell, so you find it by the function name given.

## Where each mechanism sits

A request comes in, an answer or a refusal comes out; the numbers point to the cards.

**In the Dev3Pack bootcamp**

1. A question comes in; a regex guard (card 18) stops hidden orders.
2. Retrieval looks for passages: tokens, set, IDF (card 20). Nothing found: refusal, with no call to the model.
3. The model is called through a `Protocol` (card 43), with a time limit (card 49).
4. Its output goes through strict JSON (card 21) and becomes a dataclass (card 8).
5. The checks run: exceptions (card 30), exact numbers (card 9). One wrong field: refusal.
6. Answer, action or refusal: everything ends up in the trace and the receipt, dicts (card 6) written to files (card 41).

**In AI Support Agent**

1. A request comes in through the asynchronous entrypoint (card 50).
2. The memory hook injects the customer's context (card 44).
3. The agent picks among its `@tool` tools (card 36).
4. The MCP Gateway's tools open inside a `with` block (card 39); behind it, the Lambda answers with its single contract (card 34).
5. The calculation goes through the Code Interpreter, with a fallback if the call fails (card 31).
6. The tool-call blocks are read for the trace (card 22), then the exchange is saved to memory with `reversed` and `break` (card 26); the answer goes out.

**In NovaMart**

1. The request comes from the browser or the terminal, over HTTP with a Cognito token, into `lambda_handler` or the Runtime's entrypoint (card 56).
2. The configuration is loaded on demand (card 4) and the Strands Orchestrator takes over (card 42).
3. Before the invocation, a hook reads the session header with a regex (card 45).
4. The `route_to_*` tools (cards 37 and 29) read and write the WorkflowState in DynamoDB, under a condition (cards 12 and 13).
5. The Inventory and Refund workers check the facts (cards 12, 14, 32 and 33); the PolicyAgent queries the three Knowledge Bases in parallel (card 51), each search in an X-Ray segment (card 40).
6. After the invocation, a hook guarantees rule 6: the CommunicationAgent answers last (card 45). Out comes the answer or the refusal.
7. All along, every tool is traced by a decorator (card 38) and its metrics go to CloudWatch through the logs (card 58).

**In DRILLS.ai**

1. The CV and the posting come in through a strict request, with typed consent (card 61); the middleware marks every private response (card 64).
2. A two-slot semaphore and a bounded wait frame the operation (card 65).
3. A PDF is read in a bounded subprocess (card 67); postings arrive from five sources in parallel (card 66), filtered by regex (card 18).
4. The texts are split into windows (card 63), and the model picks IDs in a schema built at runtime (card 62).
5. Rejected evidence becomes an error code, never CV text (card 30); out come the assessment or the refusal.
6. In the tests, the model is replaced by an `AsyncMock` (card 68).

## The map of the 68 cards

Cards 61 to 68 come from DRILLS.ai. They sit in their family, at the end of each chapter, so the other cards keep their numbers.

**[Chapter 2 · Organizing the project](/en/books/python-for-ai-101/chapter-02/)**

| # | Notion | The problem it prevents | Project |
| --- | --- | --- | --- |
| 1 | One file, several commands | Test code that differs from the deployed code | NovaMart |
| 2 | A local CLI with `argparse` + `asyncio.run()` | No way to test an async function locally | AI Support Agent |
| 3 | Configuration and environment | A key in the code | Dev3Pack |
| 4 | Lazy configuration | A hard-coded resource or model ID | NovaMart |
| 5 | Clients and logger at module level | A connection recreated on every tool call | NovaMart |

**[Chapter 3 · Data](/en/books/python-for-ai-101/chapter-03/)**

| # | Notion | The problem it prevents | Project |
| --- | --- | --- | --- |
| 6 | The dictionary, a light contract | A receipt or an answer with a missing box | Dev3Pack |
| 7 | Chaining `.get()` | A crash on an incomplete memory or API answer | AI Support Agent |
| 8 | The frozen dataclass | An intent changed along the way | Dev3Pack |
| 9 | Exact numbers | A rounding error that lets a price through | Dev3Pack |
| 10 | Bytes, base64 and fingerprint | Signing other bytes than the ones checked | Dev3Pack |
| 11 | Identifiers: `random.choices` vs `uuid.uuid4()` | A session ID that collides | AI Support Agent |
| 61 | The strict Pydantic model and typed consent | Data sent without agreement, an extra field accepted | DRILLS.ai |
| 62 | A schema built at runtime: `create_model` and `Literal` | An invented evidence ID | DRILLS.ai |

**[Chapter 4 · AWS data](/en/books/python-for-ai-101/chapter-04/)**

| # | Notion | The problem it prevents | Project |
| --- | --- | --- | --- |
| 12 | Reading DynamoDB: composite key, `query`, sorting | A `KeyError` on a missing order | NovaMart |
| 13 | Writing under a condition: optimistic locking | Two agents overwriting each other | NovaMart |
| 14 | Types at the boundaries: `Decimal`, dates, streams | A tool that crashes while serializing its answer | NovaMart |
| 15 | Paginator and bounded wait | A truncated list, an endless wait | NovaMart |

**[Chapter 5 · Text](/en/books/python-for-ai-101/chapter-05/)**

| # | Notion | The problem it prevents | Project |
| --- | --- | --- | --- |
| 16 | f-strings, and the refusal that names both values | A refusal that says neither what nor why | Dev3Pack |
| 17 | f-strings and format specifiers | Badly sorted keys, a silent error message | NovaMart |
| 18 | Regular expressions | A hidden order obeyed, a secret in a log | Dev3Pack |
| 19 | Validating and unpacking with a regex | An ARN split badly by hand | AI Support Agent |
| 20 | From words to sets: tokens, `set`, IDF | An answer with no source | Dev3Pack |
| 21 | Strict JSON | A model output half accepted | Dev3Pack |
| 22 | Defensive parsing of `toolUse` / `toolResult` blocks | A tool-call proof you can't show the reviewer | AI Support Agent |
| 63 | Overlapping windows over a text | A sentence cut in two between two excerpts | DRILLS.ai |

**[Chapter 6 · Control flow](/en/books/python-for-ai-101/chapter-06/)**

| # | Notion | The problem it prevents | Project |
| --- | --- | --- | --- |
| 23 | Comprehensions and iteration tools | An invented citation that slips through | Dev3Pack |
| 24 | A list comprehension with a filter | A manual loop to filter orders | AI Support Agent |
| 25 | Comprehensions and `**` unpacking | Two guardrail configurations that drift apart | NovaMart |
| 26 | `reversed()` + early exit | Scanning the whole history for the last pair of messages | AI Support Agent |
| 27 | The bounded loop: exits first | A loop that keeps running and spending | Dev3Pack |
| 28 | The transition table | Answering before searching | Dev3Pack |
| 29 | Closures: tools packed with their rules | Business constants in global variables | NovaMart |

**[Chapter 7 · Errors and guardrails](/en/books/python-for-ai-101/chapter-07/)**

| # | Notion | The problem it prevents | Project |
| --- | --- | --- | --- |
| 30 | Exceptions: raise, catch, turn into a refusal | A traceback instead of a refusal | Dev3Pack |
| 31 | `try/except` with a degraded fallback | A conversation turn that crashes entirely | AI Support Agent |
| 32 | boto3 exceptions | A traceback instead of an answer | NovaMart |
| 33 | The guardrail in the code, and idempotence | A return granted outside the window, or twice | NovaMart |
| 34 | A single response contract | A Lambda that breaks the API Gateway contract on a forgotten branch | AI Support Agent |
| 35 | State with no side effects | Data leaking from one Lambda invocation to the next | AI Support Agent |

**[Chapter 8 · Decorators, context and files](/en/books/python-for-ai-101/chapter-08/)**

| # | Notion | The problem it prevents | Project |
| --- | --- | --- | --- |
| 36 | The `@tool` decorator | A tool the model doesn't know how to call properly | AI Support Agent |
| 37 | Types and docstring: the tool's contract | A tool the model calls wrongly | NovaMart |
| 38 | A home-made decorator, with `functools.wraps` | A traced tool that loses its name and docstring | NovaMart |
| 39 | The `with` context manager | A Gateway connection left open after an error | AI Support Agent |
| 40 | The context manager: open, and always close | A trace segment never closed | NovaMart |
| 41 | Files with `pathlib` | Evidence overwritten | Dev3Pack |
| 64 | Middleware: one rule for every response | A CV kept in a cache | DRILLS.ai |

**[Chapter 9 · Agents and their interfaces](/en/books/python-for-ai-101/chapter-09/)**

| # | Notion | The problem it prevents | Project |
| --- | --- | --- | --- |
| 42 | The agent is a Python object | A customer who inherits another's context | NovaMart |
| 43 | `Protocol` and dependency injection | Tests that depend on the network | Dev3Pack |
| 44 | `HookProvider` / `HookRegistry`, classes as plugins | Memory logic mixed into the agent's code | AI Support Agent |
| 45 | Hooks: a rule enforced by the code | An "always" rule the model forgets | NovaMart |
| 46 | Inheriting an interface: `SessionRepository` | Session memory lost on restart | NovaMart |
| 47 | Copies and per-user memory | Memory leaking from one user to another | Dev3Pack |

**[Chapter 10 · Network, time and concurrency](/en/books/python-for-ai-101/chapter-10/)**

| # | Notion | The problem it prevents | Project |
| --- | --- | --- | --- |
| 48 | Careful networking: `urlsplit`, `ipaddress`, `urllib` | A tool turned inward (SSRF) | Dev3Pack |
| 49 | Time, timeouts and thread | An endless wait | Dev3Pack |
| 50 | The asynchronous `@app.entrypoint` | A runtime that blocks on one request | AI Support Agent |
| 51 | Parallel fan-out: `ThreadPoolExecutor` and `as_completed` | Three slow searches one after the other | NovaMart |
| 52 | Lock, per-thread context, lazy singleton | A resource created twice by two threads | NovaMart |
| 65 | The semaphore and the bounded wait | Requests piling up, an endless wait | DRILLS.ai |
| 66 | Async fan-out: `asyncio.gather` | A source that is down taken for "no postings" | DRILLS.ai |

**[Chapter 11 · Deploying and tooling](/en/books/python-for-ai-101/chapter-11/)**

| # | Notion | The problem it prevents | Project |
| --- | --- | --- | --- |
| 53 | `subprocess`: calling another program | A committed key | Dev3Pack |
| 54 | `subprocess` and validation before deployment | A 15-minute deployment that leaves incomplete | NovaMart |
| 55 | Reading code without running it: the `ast` module | Running an untrusted file to read its settings | AI Support Agent |
| 56 | HTTP entry points: the Runtime's entrypoint and Lambda | A customer pretending to be another | NovaMart |
| 57 | The MCP server: a function becomes a tool | A check reserved for a single agent | Dev3Pack |
| 58 | Metrics through the logs (EMF) | Telemetry that needs a missing permission | NovaMart |
| 67 | The bounded subprocess: time, memory, CPU | A booby-trapped PDF that blocks the server | DRILLS.ai |

**[Chapter 12 · Testing and evaluating](/en/books/python-for-ai-101/chapter-12/)**

| # | Notion | The problem it prevents | Project |
| --- | --- | --- | --- |
| 59 | Tests with pytest | A grade that depends on the wifi | Dev3Pack |
| 60 | Testing the structure, evaluating the behaviour | A guardrail tuned by feel | NovaMart |
| 68 | `AsyncMock`: replacing an async call | Tests that cost API credit | DRILLS.ai |
