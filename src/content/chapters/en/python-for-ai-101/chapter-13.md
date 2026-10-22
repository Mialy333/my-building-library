---
workedOn: 2026-10-22
---

The cards, summed up in rules to put in place from the first day of a new Python project for AI. Each project left me its own checklist; I keep them as they are, in the order you put the rules in a new repo. Each rule points to its cards.

## From Dev3Pack

1. **The contract first.** The model's output is a frozen dataclass, read by a strict parser: no missing field, no extra field (cards [8](/en/books/python-for-ai-101/chapter-03/) and [21](/en/books/python-for-ai-101/chapter-05/)).
2. **One seam per outside service.** A `Protocol`, a real client, a fake that records its calls; the agent receives the client as a parameter (card [43](/en/books/python-for-ai-101/chapter-09/)).
3. **Settings in the environment.** A safe default value, a closed list, no key ever printed (card [3](/en/books/python-for-ai-101/chapter-02/)).
4. **Money in integers.** Raw unit plus the number of digits after the point; `Decimal` to read a text; `None` refused (card [9](/en/books/python-for-ai-101/chapter-03/)).
5. **Record the request before acting.** A file written once, in `"x"` mode, before the action exists (card [41](/en/books/python-for-ai-101/chapter-08/)).
6. **Loop exits before the body.** Answer, repetition, budget, tool error, and always the same receipt (card [27](/en/books/python-for-ai-101/chapter-06/)).
7. **Allowed states in a table.** Any missing pair is refused (card [28](/en/books/python-for-ai-101/chapter-06/)).
8. **One exception per kind of refusal.** Turned into a readable sentence that names the field and both values; `raise … from` to keep the cause (cards [16](/en/books/python-for-ai-101/chapter-05/) and [30](/en/books/python-for-ai-101/chapter-07/)).
9. **Dangerous shapes as regex.** Compiled once, tested both ways, applied outside quotations (card [18](/en/books/python-for-ai-101/chapter-05/)).
10. **Every URL goes through the guard, with a time limit.** Scheme, host, resolved addresses; a `timeout` on every call, a thread if the client has none (cards [48](/en/books/python-for-ai-101/chapter-10/) and [49](/en/books/python-for-ai-101/chapter-10/)).
11. **Secrets never leave.** Masked in logs with a fingerprint, refused at commit time by a scan, keys kept outside the repo (cards [10](/en/books/python-for-ai-101/chapter-03/) and [53](/en/books/python-for-ai-101/chapter-11/)).
12. **Offline tests from day one.** Network blocked in `conftest.py`, one test per expected refusal; memory copied and kept separate per user (cards [47](/en/books/python-for-ai-101/chapter-09/) and [59](/en/books/python-for-ai-101/chapter-12/)).

## From AI Support Agent

1. **The docstring first.** Every `@tool` tool documents its Args/Returns as a contract: that is the text the model reads, not the function's name (card [36](/en/books/python-for-ai-101/chapter-08/)).
2. **Memory in hooks, never in the loop.** A `HookProvider` class that subscribes to events, not an `if` added to the entrypoint (card [44](/en/books/python-for-ai-101/chapter-09/)).
3. **Every outside connection under `with`.** Gateway, sandbox, file: closing guaranteed even on an exception (card [39](/en/books/python-for-ai-101/chapter-08/)).
4. **The entrypoint is `async def` from day one.** Even if nothing inside is concurrent yet (card [50](/en/books/python-for-ai-101/chapter-10/)).
5. **A local test path before deployment.** `argparse` + `asyncio.run()` to call the entrypoint without waiting for a full deployment (card [2](/en/books/python-for-ai-101/chapter-02/)).
6. **Chained `.get()` on all outside data.** Memory, Gateway, Knowledge Base: never direct bracket access on JSON you don't control (card [7](/en/books/python-for-ai-101/chapter-03/)).
7. **Every outside call has a fallback.** A `try/except` that degrades the service rather than letting the exception rise to the customer (card [31](/en/books/python-for-ai-101/chapter-07/)).
8. **Tool-call proofs are logged in structured form.** Name, input, result: not only the model's final answer (card [22](/en/books/python-for-ai-101/chapter-05/)).
9. **IDs have the right guarantee.** `uuid.uuid4()` for what must never collide, `random.choices` for what only has to be readable (card [11](/en/books/python-for-ai-101/chapter-03/)).

## From NovaMart

1. **One entry point, several commands.** `test`, `chat`, `deploy`, `serve` in the same file; imports computed from `__file__` (card [1](/en/books/python-for-ai-101/chapter-02/)).
2. **Settings in the environment.** A single `config.py`, no resource or model ID hard-coded, no network call at import (card [4](/en/books/python-for-ai-101/chapter-02/)).
3. **Clients created once.** At module level, with the region from the config; one logger per module (card [5](/en/books/python-for-ai-101/chapter-02/)).
4. **Every tool has its contract.** Annotated types, a docstring that says when to use it, every argument with an example, the error case described (card [37](/en/books/python-for-ai-101/chapter-08/)).
5. **Tools kept in their builder.** With their business constants; a builder returns a single agent (cards [29](/en/books/python-for-ai-101/chapter-06/) and [42](/en/books/python-for-ai-101/chapter-09/)).
6. **Data converted at the boundary.** `default=str` for `Decimal`, UTC dates, days computed by the code (card [14](/en/books/python-for-ai-101/chapter-04/)).
7. **Shared state is versioned.** A conditional write on `version`, a bounded retry with back-off (card [13](/en/books/python-for-ai-101/chapter-04/)).
8. **The code checks again before writing.** Every rule with a real effect checked in the tool, an idempotent write (card [33](/en/books/python-for-ai-101/chapter-07/)).
9. **Errors stay readable.** In a tool, return the error as data; in the plumbing, a named exception with the fix (card [32](/en/books/python-for-ai-101/chapter-07/)).
10. **Critical rules in a hook.** The prompt announces, the code guarantees; the session's identity in `agent.state`, history cleared on every request (cards [42](/en/books/python-for-ai-101/chapter-09/) and [45](/en/books/python-for-ai-101/chapter-09/)).
11. **Parallelize the independent, chain the dependent.** `ThreadPoolExecutor` + `as_completed` + a `try` per future; sequential as soon as a step reads the previous one; a lock on every "create if missing" (cards [51](/en/books/python-for-ai-101/chapter-10/) and [52](/en/books/python-for-ai-101/chapter-10/)).
12. **Trace without clutter.** A decorator with `functools.wraps`, a context manager for everything that opens and closes, per-agent metrics inside a `try` (cards [38](/en/books/python-for-ai-101/chapter-08/), [40](/en/books/python-for-ai-101/chapter-08/) and [58](/en/books/python-for-ai-101/chapter-11/)).
13. **Validate before deploying, authenticate at the entrance.** Every variable checked at once; the identity read from a token validated on the server side (cards [54](/en/books/python-for-ai-101/chapter-11/) and [56](/en/books/python-for-ai-101/chapter-11/)).
14. **Measure before tuning.** A fixed set of cases, an "expected versus obtained" loop, the reports kept in `evidence/` (card [60](/en/books/python-for-ai-101/chapter-12/)).
