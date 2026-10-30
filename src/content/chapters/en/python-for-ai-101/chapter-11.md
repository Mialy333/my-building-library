---
workedOn: 2026-10-22
---

Six cards on what surrounds the agent: calling another program, reading code without running it, receiving an HTTP request, exposing a tool as an MCP server, and measuring through the logs.

## Card 53 — `subprocess`: calling another program

**Project.** Dev3Pack AI Engineering Bootcamp

**In one sentence.** `subprocess.run` launches a command (here `git`) and gets its output back as text.

**Why it matters for an agent.** The key scan reads what is about to be committed. The signer refuses to read a key stored inside a git repo.

**Analogy.** Asking the department next door for the statement rather than copying it by hand.

**The mechanism.**

```python
done = subprocess.run(
    ["git", *args], capture_output=True, text=True, errors="ignore", check=True
)
out = subprocess.run(
    ["git", "-C", str(path.parent), "rev-parse", "--is-inside-work-tree"],
    capture_output=True, text=True, timeout=10,
)
```

**Input → output.** Inside the repo → `returncode = 0`, `stdout = 'true'`. `errors="ignore"`: a committed PNG no longer crashes the scan (the October 4 fix, reported in Gecko issue #12).

**Where to read it again.** [`my-gecko-buyer/scripts/scan_secrets.py · _git`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/scripts/scan_secrets.py#L62) · [`buyer/signer.py · inside_git_repo`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/signer.py#L71) (course) · the *preflight* cell, for example [ch01 · cell 2](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch01/notebook.ipynb) (`git clone` on Colab).

**To reuse.** Arguments as a list, never a string passed to the shell. A `timeout`. `capture_output=True, text=True`. Catch `OSError` and `subprocess.SubprocessError`.

## Card 54 — `subprocess` and validation before deployment

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** `subprocess.run` launches an outside program with a list of arguments and returns its exit code; validating every input before launching it avoids a late failure.

**Why it matters for an agent.** The Runtime is deployed with the `agentcore` CLI, driven from Python. An `agentcore deploy` takes 10 to 20 minutes: leaving with an empty KB ID would give a Runtime whose retrievers stay silent.

**Analogy.** Checking that every document of a loan file is there before sending it to the committee, rather than waiting three weeks for a refusal over a missing page.

**The mechanism.**

```python
result = subprocess.run([cli_path(), *args], cwd=PROJECT_ROOT, env=env,
                        capture_output=capture, text=True)
if check and result.returncode != 0:
    raise RuntimeError(f"agentcore {' '.join(args)} failed (exit {result.returncode})")

missing = [key for key, value in runtime_env.items() if not value]
if missing:
    raise ValueError(f"Missing runtime environment values: {', '.join(missing)}")
if not guardrail_version or str(guardrail_version).upper() == 'DRAFT':
    raise ValueError("GUARDRAIL_VERSION must be a numbered version, not DRAFT")
```

**Input → output.** Replayed: `{'RETURNS_KB_ID': 'ABC', 'SHIPPING_KB_ID': '', 'GUARDRAIL_VERSION': '2'}` → `missing = ['SHIPPING_KB_ID']` → immediate stop. `shutil.which('agentcore')` first checks that the CLI exists. The arguments are a list, never a concatenated string: no risk of injection through a file name.

**Where to read it again.** [`agentcore_cli.py · run`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agentcore_cli.py#L103) · [`agent_orchestrator.py · deploy_to_agentcore_runtime`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1738).

**To reuse.** A validation function that lists every missing item at once. `subprocess.run` with a list, `check` on the exit code, `capture_output` when you want to show the error.

## Card 55 — Reading code without running it: the `ast` module

**Project.** AI Support Agent (AWS Scholars, chapter 2)

**In one sentence.** `setup_permissions.py` reads the values of `KB_ID`, `MEMORY_ID`, `REGION` in `main.py` by parsing its text with `ast.parse()`, without ever importing or running that file.

**Why it matters for an agent.** A setup script called during development may hit a `main.py` that is still incomplete or contains an error; importing it would crash the setup script for a reason that has nothing to do with the permissions to set.

**Analogy.** Reading a book's table of contents to know what it is about, without reading it all or following its instructions.

**The mechanism.**

```python
def read_settings(source):
    settings = {}
    for node in ast.parse(source).body:
        if isinstance(node, ast.Assign):
            names = [target.id for target in node.targets if isinstance(target, ast.Name)]
        ...
            try:
                settings[name] = ast.literal_eval(node.value)
            except (ValueError, TypeError):
                settings[name] = None
```

**Input → output.** The text of `main.py` (never imported) → `{"KB_ID": "AFJJCJNMED", "MEMORY_ID": "CustomerSupportMemory-D0IRyF6feE", "REGION": "us-east-1"}`.

**Where to read it again.** [setup\_permissions.py L21–45](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/setup_permissions.py#L21-L45)

**To reuse.** To read settings in a source file that may be untrusted or unfinished, parse it with `ast` rather than importing it: there is no way to run broken or malicious code by accident.

## Card 56 — HTTP entry points: the Runtime's entrypoint and Lambda

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** An agent server receives a request as a dict and returns a dict: `@app.entrypoint` does it for AgentCore Runtime, `lambda_handler(event, context)` for a Lambda function.

**Why it matters for an agent.** This is the boundary with the outside world. The proxy Lambda reads the customer's identity from the Cognito token, never from the request body: a customer cannot pretend to be someone else by editing the page.

**Analogy.** The bank counter: the ID is checked at the desk, not the name written on the slip.

**The mechanism.**

```python
@app.entrypoint                                     # POST /invocations on the Runtime
def invoke(payload, context=None):
    prompt = payload.get('prompt') or payload.get('message') or ''
    ...
    return {'result': text, 'session_id': session_id, 'trace_id': tracer.last_trace_id}

def lambda_handler(event, context):                 # Lambda behind a Function URL
    try:
        customer_id, name = _authenticated_customer(event)   # from the Cognito token
    except PermissionError as exc:
        return _response(401, {'error': str(exc)})
    ...

def _claims(token: str) -> dict:                    # JWT payload, base64url without padding
    payload = token.split('.')[1]
    return json.loads(base64.urlsafe_b64decode(payload + '=' * (-len(payload) % 4)))
```

**Input → output.** Replayed: a 27-character base64url payload → `-27 % 4 = 1` `=` sign added → `{'client_id': 'abc'}`. Without the padding, `b64decode` raises an error. A request with no `Authorization` header → `401 Missing bearer token`; a message of more than 2,000 characters → `400`.

**Where to read it again.** [`agent_orchestrator.py · run_serve`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L2324) · [`lambda_function.py · lambda_handler`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/frontend_proxy/lambda_function.py#L104) · [`lambda_function.py · _authenticated_customer`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/frontend_proxy/lambda_function.py#L69) · [`lambda_function.py · _claims`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/frontend_proxy/lambda_function.py#L52).

**To reuse.** The identity always comes from a token validated on the server side. Business errors turned into HTTP codes (400, 401, 502). Inputs bounded (length, `session_id` format) before any costly call.

## Card 57 — The MCP server: a function becomes a tool

**Project.** Dev3Pack AI Engineering Bootcamp

**In one sentence.** With the MCP SDK, a typed and documented Python function becomes a tool that any agent can call; `mcp.tool()` registers it.

**Why it matters for an agent.** The seven-field check becomes a service open to other agents, and it holds no key: it can judge, never pay.

**Analogy.** An IBAN-checking counter: you ask it whether the details are right, it does not make the transfer.

**The mechanism.**

```python
mcp = MCPServer("gecko-check")

def check_purchase(intent: dict[str, Any], prepared_answer: dict[str, Any],
                   rpc_url: str | None = None) -> dict[str, Any]:
    """Compare a prepared purchase with the pinned intent; refuse on the first mismatch."""
    ...

mcp.tool()(check_purchase)       # same effect as @mcp.tool() above the def

if __name__ == "__main__":       # only when the file is run, not imported
    mcp.run()
```

On the client side, `async def main()`, `async with stdio_client(server) …` and `await session.call_tool(…)` wait for the answer without blocking; `asyncio.run(main())` starts it all.

**Input → output.** `server/try_client.py` asks about the "two bags of beans" case and receives `{"passed": false, "field": "quantity", "asked": 2, "found": 1, "note": ""}`.

**Where to read it again.** [`my-gecko-buyer/server/check_server.py · check_purchase`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/server/check_server.py#L34) and [`server/try_client.py`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/server/try_client.py) (project 03) · [ch12 · cells 6 to 16](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch12/notebook.ipynb) (reading and sorting a server's surface) · [ch13 · cell 5](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch13/notebook.ipynb) (declaring a read-only tool).

**To reuse.** The type hints become the input schema, the docstring the description. One tool, one responsibility. The URL checked before any network call. `ROOT = Path(__file__).resolve().parents[1]` and `sys.path.insert(0, str(ROOT))` to run the script from anywhere.

## Card 58 — Metrics through the logs (EMF)

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** A JSON log in EMF (Embedded Metric Format) is turned into metrics by CloudWatch; botocore lets you hook a function onto a step of every request, here to add the header that switches that format on.

**Why it matters for an agent.** The Runtime's execution role did not have the `PutMetricData` permission, but it could write logs. So the per-agent metrics (invocations, latency, guardrail blocks) go through the logs, and feed the `NovaMart-Agents` dashboard.

**Analogy.** A well-labelled accounting entry: the general ledger is enough, and the reporting is drawn from it automatically.

**The mechanism.**

```python
_metrics_logs.meta.events.register(
    'before-sign.logs.PutLogEvents',
    lambda request, **kwargs: request.headers.__setitem__('x-amzn-logs-format', 'json/emf'),
)
payload = {
    '_aws': {'Timestamp': ..., 'CloudWatchMetrics': [{'Namespace': 'NovaMart/Agents',
             'Dimensions': [['Agent']], 'Metrics': [{'Name': 'AgentLatencyMs', ...}]}]},
    'Agent': agent_name, 'AgentInvocations': 1, 'AgentLatencyMs': round(latency_ms, 1),
}
try:
    _metrics_logs.put_log_events(..., logEvents=[{'message': json.dumps(payload), ...}])
except Exception as exc:
    logger.warning("Metric emission failed for %s: %s", agent_name, exc)   # never break the reply
```

**Input → output.** In the project: the dashboard shows the invocations per agent and a peak of 5 blocks on `OrchestratorAgent` (the 5 adversarial attacks). The native `AWS/Bedrock/Guardrails` metric did not come up; only the home-made metric did.

**Where to read it again.** [`agent_orchestrator.py · botocore event`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L919) · [`agent_orchestrator.py · _emit_agent_metrics`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L927) · [`scripts/create_dashboard.py · main`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/scripts/create_dashboard.py#L73).

**To reuse.** One metric per agent with an `Agent` dimension. Emission inside a `try` that never breaks the answer. Check the role's permissions before choosing the mechanism (API or logs).

## Card 67 — The bounded subprocess: time, memory, CPU

**Project.** DRILLS.ai (Builds, OpenAI DevDay hackathon)

**In one sentence.** `asyncio.create_subprocess_exec` starts a second Python; `wait_for` bounds the time, `resource.setrlimit` bounds memory and CPU in the child, and `finally` kills the process if it is still running.

**Why it matters for an agent.** Reading an unknown PDF means running a parser on untrusted data. In a separate process, an endless loop or a memory blow-up does not block the server.

**Analogy.** Having a suspicious parcel opened in a separate room, with a stopwatch, rather than in the middle of the office.

**The mechanism.**

```python
async def extract_pdf_text(data: bytes) -> str | None:
    process = None
    try:
        process = await asyncio.create_subprocess_exec(sys.executable, str(Path(__file__).resolve()),
            stdin=asyncio.subprocess.PIPE, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.DEVNULL)
        output, _ = await asyncio.wait_for(process.communicate(data), timeout=4)
        ...
    except (OSError, ValueError, UnicodeError, asyncio.TimeoutError):
        return None
    finally:
        if process is not None and process.returncode is None:
            process.kill()
            await process.wait()

# In the child:
resource.setrlimit(resource.RLIMIT_AS, (256 * 1024 * 1024, 256 * 1024 * 1024))
resource.setrlimit(resource.RLIMIT_CPU, (3, 3))
```

**Input → output.** Replayed: a one-line text PDF → the exact sentence, with no model call. `b"not a pdf"` or a text that is too short → `None`, and the AI fallback takes over. The `test_pdf_worker_is_killed_on_timeout` test checks that a child that is too slow gets killed.

**Where to read it.** [`pdf_text.py · extract_pdf_text`](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/src/ai_generator/pdf_text.py#L27) · [the child part](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/src/ai_generator/pdf_text.py#L44).

**To reuse.** Untrusted data, separate parser, limits in the child, `kill` in a `finally`. It is not a security sandbox: it is a bound.

## In the field

The chapters of my courses and my projects where these mechanisms run for real.

- [Dev3Pack, Session 1](/en/books/dev3pack/session-01/): card 53.
- [Dev3Pack, Session 12](/en/books/dev3pack/session-12/): card 57.
- [Dev3Pack, Session 13](/en/books/dev3pack/session-13/): card 57.
- [Dev3Pack, Gecko capstone](/en/books/dev3pack/gecko/): cards 53 and 57.
- [AWS Scholars, chapter 2 · AI Support Agent](/en/books/aws-scholars/chapter-02/): card 55.
- [AWS Scholars, chapter 3 · NovaMart Multi-Agent Support](/en/books/aws-scholars/chapter-03/): cards 54, 56 and 58.
- [DRILLS.ai, chapter 4 · Phase 1: agents that make exercises](/en/books/drills-ai/chapter-04/): cards 53 and 55.
- [DRILLS.ai, chapter 5 · Phase 2: the pivot to job applications](/en/books/drills-ai/chapter-05/): cards 53 and 67.
- [DRILLS.ai, chapter 9 · MCP: three read-only tools](/en/books/drills-ai/chapter-09/): card 57.
