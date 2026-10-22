---
workedOn: 2026-10-22
---

Five cards on waiting: the network checked before the call, the time limit bounded by a thread, the asynchronous entrypoint, the parallel fan-out and the lock.

## Card 48 — Careful networking: `urlsplit`, `ipaddress`, `urllib`

**Project.** Dev3Pack AI Engineering Bootcamp

**In one sentence.** Before calling a URL, you split it, check the scheme, the host and the IP address; only then do you call it, with a maximum wait.

**Why it matters for an agent.** A tool that fetches whatever URL it is given can be pointed inward (`169.254.169.254`, the local machine): that is SSRF.

**Analogy.** Checking the beneficiary's IBAN before the transfer, not after.

**The mechanism.**

```python
parts = urlsplit(url)
if parts.scheme != "https" or not parts.hostname:
    return False
ip = ipaddress.ip_address(address)
public = ip.is_global and not (ip.is_private or ip.is_loopback or ip.is_link_local)
resolved = {info[4][0] for info in socket.getaddrinfo(host, parts.port or 443)}
return bool(resolved) and all(_is_public(a) for a in resolved)   # ALL public
```

**Input → output.** `http://169.254.169.254/latest/meta-data/` → host `169.254.169.254`, `is_global` → `False`. `ip_address(int("2130706433"))` → `127.0.0.1`: a number hiding the local machine. `is_public_url("http://example.com")` → `False` (not https); `is_public_url("https://10.0.0.5")` → `False`.

**Where to read it again.** [ch04 · cell 14](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch04/notebook.ipynb) (`allowed_url`, `fetch_rates` with `User-Agent` and `timeout=5`) · [ch13 · cells 7 and 11](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch13/notebook.ipynb) (`fetch_guard`, every redirect checked again) · [`my-gecko-buyer/server/guard.py · is_public_url`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/server/guard.py#L31) · [`buyer/mcp_client.py · _post`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/mcp_client.py#L42) (`urllib.request.Request` with the MCP headers, course) · [ch14 · cell 15](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch14/notebook.ipynb) (`http_request`: `HTTPError` = the server answered; `OSError` = nobody is listening).

**To reuse.** The host allowlist lives in configuration, never in an argument. Refuse a name that cannot be resolved. A `timeout` on every call. Tell "the server said no" apart from "the server cannot be reached".

## Card 49 — Time, timeouts and thread

**Project.** Dev3Pack AI Engineering Bootcamp

**In one sentence.** `time.perf_counter()` measures a duration; a `threading.Thread` waited on with `join(timeout)` bounds a call that has no time limit of its own.

**Why it matters for an agent.** A local model may never answer. The agent must refuse after N seconds, not leave the user waiting.

**Analogy.** A limit order that expires at the close.

**The mechanism.**

```python
worker = threading.Thread(target=call, daemon=True)
worker.start()
worker.join(self.timeout_s)                # waits timeout_s seconds at most
if worker.is_alive():
    raise ProviderTimeout(f"no answer within {self.timeout_s} s")

started = time.perf_counter()
elapsed_ms = round((time.perf_counter() - started) * 1000)
```

**Input → output.** A 2 s task waited on for 0.2 s → `is_alive()` is `True`, and the function hands back control in under 400 ms.

**Where to read it again.** [`grounded-research-agent/agent.py · _complete`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/agent.py#L215) (`timeout_s = 90`) · [ch14 · cells 5 and 9](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch14/notebook.ipynb) (`elapsed_ms`, the cold start) · [ch02 · cell 35](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch02/notebook.ipynb) (`time.monotonic`) · [ch10 · cell 11](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch10/notebook.ipynb) (the ADR: a 3 s timeout, chosen from a measurement).

**To reuse.** `perf_counter` to measure, not `time.time`. `daemon=True` so a stuck thread does not stop the program from ending. A timeout becomes a refusal flagged for review, not a crash.

## Card 50 — The asynchronous `@app.entrypoint`

**Project.** AI Support Agent (AWS Scholars, chapter 2)

**In one sentence.** `invoke()` is declared `async def` and decorated with `@app.entrypoint`: the AgentCore runtime calls it as a coroutine for every incoming request.

**Why it matters for an agent.** A deployed agent must be able to handle several requests without one blocking the others; the asynchronous form of the entrypoint is what makes that possible, even if the body of today's function is mostly sequential.

**Analogy.** A switchboard that can put one call on hold and take another, rather than a single line that must be free before it rings again.

**The mechanism.**

```python
@app.entrypoint
async def invoke(payload, context=None):
    user_input = payload.get("prompt", "")
    actor_id = payload.get("customer_id", "anonymous")
    session_id = payload.get("session_id") or str(uuid.uuid4())
    ...
```

**Input → output.** `{"prompt": "Can you track order ORD-001?", "customer_id": "CUST-123", "session_id": "t1"}` → a text answer (the delivery status, the tracking number).

**Where to read it again.** [main.py L337–351](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/main.py#L337-L351)

**To reuse.** Declare a deployed agent's entrypoint `async def` (AgentCore, FastAPI, Lambda) from the start, even if nothing inside is concurrent yet: it costs nothing and avoids a rewrite later.

## Card 51 — Parallel fan-out: `ThreadPoolExecutor` and `as_completed`

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** `submit` starts a function in a thread and returns a `Future` (a promise of a result) straight away; `as_completed` hands back the futures in the order in which they **finish**; `future.result()` gives the value or raises the thread's error again.

**Why it matters for an agent.** The three Knowledge Bases are independent: querying them in parallel costs the time of the slowest one, not the sum. That is the core of the RAG rubric (`ThreadPoolExecutor(max_workers=3)` + `as_completed()`). Inventory then Refund, on the other hand, depend on each other: there, the Orchestrator forces sequential order.

**Analogy.** Three analysts asked at the same time, each about their own asset class; you read the notes as they come in.

**The mechanism.**

```python
with ThreadPoolExecutor(max_workers=3) as executor:
    futures = {executor.submit(_run_retriever, domain, agent, query): domain
               for domain, agent in retrievers.items()}
    for future in as_completed(futures):
        domain = futures[future]
        try:
            _, text = future.result()
            results[domain] = text
        except Exception as exc:                 # one KB down does not sink the others
            results[domain] = f"[{domain} retriever error: {exc}]"

orchestrator = Agent(..., tool_executor=SequentialToolExecutor())   # dependent steps
```

**Input → output.** Replayed with three tasks of 0.3 s, 0.1 s and 0.2 s: arrival order `['Shipping', 'Warranty', 'Returns']`, total time `0.3 s` instead of `0.6 s`. In the project, Strands' default parallel execution started the RefundAgent before the InventoryAgent had written its facts: hence `SequentialToolExecutor`.

**Where to read it again.** [`agent_orchestrator.py · search_all_policies`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L720) · [`agent_orchestrator.py · ThreadPoolExecutor`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L772) · [`agent_orchestrator.py · SequentialToolExecutor`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1434).

**To reuse.** Run in parallel the independent tasks that wait on the network; one `try` per future; the result assembled in a fixed order, not in the order of arrival. Sequential as soon as a step reads what the previous one writes.

## Card 52 — Lock, per-thread context, lazy singleton

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** `threading.Lock` guarantees that only one thread runs a block at a time; a `ContextVar` carries a value specific to the current execution context; a lazy singleton creates a costly object only once, the first time it is needed.

**Why it matters for an agent.** The Runtime serves several requests in parallel: the graph of the 5 agents must be built only once, and the metrics log stream created only once.

**Analogy.** The single key to the archive room: one employee at a time, and the first one in turns on the light for everyone.

**The mechanism.**

```python
_metrics_lock = threading.Lock()
with _metrics_lock:
    if _metrics_stream['name'] is None:          # created once, whatever the thread
        _metrics_logs.create_log_stream(...)
        _metrics_stream['name'] = name

lock, graph = threading.Lock(), {}
def _orchestrator():
    with lock:
        if 'agent' not in graph:
            graph['agent'] = build_agent_graph()  # built on the first request only
    return graph['agent']
```

**Input → output.** First call to the Runtime: the graph is built (several seconds); following calls: immediate reuse. The X-Ray tracer uses a `ContextVar` to know which node to attach a subsegment to; the `ThreadPoolExecutor` threads don't inherit that context, hence a fallback mechanism that keeps the Service Map connected.

**Where to read it again.** [`agent_orchestrator.py · _metrics_lock`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L924) · [`agent_orchestrator.py · _orchestrator`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L2348) · [`agent_observability.py · ContextVar`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_observability.py#L184).

**To reuse.** Every "create if missing" shared between threads goes under a lock. Costly objects (agent graph, clients) built on the first call, then reused.

## In the field

The chapters of my courses where these mechanisms run for real.

- [Dev3Pack, Session 2](/en/books/dev3pack/session-02/): card 49.
- [Dev3Pack, Session 4](/en/books/dev3pack/session-04/): card 48.
- [Dev3Pack, Session 10](/en/books/dev3pack/session-10/): card 49.
- [Dev3Pack, Session 13](/en/books/dev3pack/session-13/): card 48.
- [Dev3Pack, Session 14](/en/books/dev3pack/session-14/): cards 48 and 49.
- [Dev3Pack, Final assignment](/en/books/dev3pack/final/): card 49.
- [Dev3Pack, Gecko capstone](/en/books/dev3pack/gecko/): card 48.
- [AWS Scholars, chapter 2 · AI Support Agent](/en/books/aws-scholars/chapter-02/): card 50.
- [AWS Scholars, chapter 3 · NovaMart Multi-Agent Support](/en/books/aws-scholars/chapter-03/): cards 51 and 52.
