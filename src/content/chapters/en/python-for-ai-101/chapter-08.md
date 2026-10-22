---
workedOn: 2026-10-22
---

Six cards on what wraps a function or a resource: the decorator that makes a tool, the docstring that is its contract, a home-made decorator, the context manager, and files with pathlib.

## Card 36 — The `@tool` decorator

**Project.** AI Support Agent (AWS Scholars, chapter 2)

**In one sentence.** `@tool` is a Strands decorator that wraps an ordinary Python function and turns it into a tool the agent can call; it reads the docstring to build the input/output schema shown to the model.

**Why it matters for an agent.** Without this bridge, the model never "sees" the function: it can neither decide to call it nor know which arguments to give it.

**Analogy.** A restaurant menu: each dish (function) has a name and a description (docstring); the customer (the model) orders from that alone, without seeing the kitchen.

**The mechanism.**

```python
@tool
def search_knowledge_base(query: str) -> str:
    """
    Search the Amazon product catalog and support knowledge base.
    Args:
        query: The question or topic to search for
    Returns:
        Relevant information retrieved from the knowledge base
    """
    ...
```

**Input → output.** `query="Platinum tier benefits"` → a string summing up the relevant passages of the Knowledge Base, or `"No relevant information found..."` if nothing matches.

**Where to read it again.** [main.py L192–226](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/main.py#L192-L226)

**To reuse.** Write the Args/Returns docstring as a contract for the model, not as a comment for a human: that text becomes the tool's schema.

## Card 37 — Types and docstring: the tool's contract

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** Type annotations (`customer_id: str`, `-> dict`, `Optional[dict]`) and the docstring describe what the function expects and returns; `@tool` turns them into a tool card that the model reads.

**Why it matters for an agent.** The model never sees the function's body: it picks the tool and fills in its arguments only from the name, the docstring and the `Args` section. A vague docstring gives wrong calls (rubric criterion: a docstring with purpose, parameters and return value).

**Analogy.** The notes that come with an official form: without them, the boxes get filled in at random.

**The mechanism.**

```python
@tool(context=True)
def check_order_status(customer_id: str, order_id: str, tool_context: ToolContext) -> dict:
    """
    Look up one order in DynamoDB and report its status, product, dates
    and amount. Reports facts only - it does NOT decide return eligibility.

    Args:
        customer_id: The customer's unique identifier (e.g. CUST-001)
        order_id: The order identifier (e.g. ORD-27176)
        tool_context: Injected by Strands (not provided by the model)

    Returns:
        Order record plus days_since_order, a not-found message, or an access-denied message
    """
```

**Input → output.** The model receives a `check_order_status` tool with two text parameters (`tool_context` is hidden from it). "I want to return my order ORD-27176" (CUST-001) → a call `check_order_status(customer_id='CUST-001', order_id='ORD-27176')`, visible in the `chat` trace. `Optional[dict]` on `_read_workflow_state` reminds the caller that it must handle `None`.

**Where to read it again.** [`agent_orchestrator.py · check_order_status`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L327) · [`agent_orchestrator.py · _read_workflow_state`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L152).

**To reuse.** The first sentence says when to use the tool; every argument has an example; the `Returns` section also describes the error case; the docstring says what the tool does not do.

## Card 38 — A home-made decorator, with `functools.wraps`

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** A decorator receives a function and returns an enriched version of it; `@tool` above `def f` is the same as `f = tool(f)`, and `functools.wraps` copies the original's name and docstring onto the new function.

**Why it matters for an agent.** The starter's `@tool` adds an X-Ray trace and a log to every tool call, without a single tracing line in the tools themselves. Without `wraps`, Strands would send the model a tool called `wrapper`, with no description.

**Analogy.** The "received on" stamp on every incoming letter: the letter doesn't change, but it is dated.

**The mechanism.**

```python
def _traced(fn):
    @functools.wraps(fn)                         # keep fn's name and docstring
    def wrapper(*args, **kwargs):
        with tracer.subsegment(node_name or name, ...):
            result = fn(*args, **kwargs)
        return result
    return wrapper

def tool(*args, **kwargs):
    if len(args) == 1 and callable(args[0]) and not kwargs:     # used as @tool
        return _strands_tool(_traced(args[0]))
    strands_decorator = _strands_tool(*args, **kwargs)           # used as @tool(...)
    return lambda fn: strands_decorator(_traced(fn))
```

**Input → output.** Replayed: without `wraps`, the decorated `check_order_status` is called `wrapper` and its docstring is `None`; with `wraps`, it keeps `check_order_status` and `Look up one order.` In the project, every `route_to_*` becomes a node of the Service Map (9 nodes on the final screenshot).

**Where to read it again.** [`agent_observability.py · _traced`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_observability.py#L329) · [`agent_observability.py · tool`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_observability.py#L357).

**To reuse.** Tracing, logging and latency measurement in a decorator, not in every function. Always `functools.wraps` in a wrapper.

## Card 39 — The `with` context manager

**Project.** AI Support Agent (AWS Scholars, chapter 2)

**In one sentence.** `with gateway_client:` opens the MCP connection at the start of the block and closes it on the way out, success or exception, with no manual clean-up code.

**Why it matters for an agent.** The Gateway's tool list is only valid while the connection is open; forgetting to close it (or closing it only on success) leaves connections leaking in production.

**Analogy.** Borrowing a book with a librarian who takes it back automatically at the exit, even if you dropped it on the way.

**The mechanism.**

```python
gateway_client = MCPClient(lambda: streamable_http_client(GATEWAY_URL))
with gateway_client:
    gateway_tools = gateway_client.list_tools_sync()
    all_tools = tools + gateway_tools
    agent = Agent(model=model, tools=all_tools, hooks=[memory_hook], system_prompt=SYSTEM_PROMPT)
    response = agent(user_input)
```

**Input → output.** On entering the block, the MCP connection opens and `list_tools_sync()` returns the list of Gateway tools (`order-tracker___get_order`, etc.); on leaving the block (even on an exception), the connection closes.

**Where to read it again.** [main.py L367–398](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/main.py#L367-L398)

**To reuse.** Any outside resource that must be closed reliably (network connection, file, sandbox session) is handled with `with`, never with a manual `open()`/`close()` that an exception can skip.

## Card 40 — The context manager: open, and always close

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** An object used with `with` runs code on entering and leaving a block; `@contextmanager` makes one from a function: the code before `yield` on the way in, the code after `yield` (in a `finally`) on the way out, even if an error occurs.

**Why it matters for an agent.** An X-Ray trace, a lock or an open file must be closed even when a Knowledge Base breaks down. Otherwise the trace is corrupted or the lock stays taken.

**Analogy.** The sign-in book of a vault: you sign on the way in, and the guard logs your exit even if you leave running.

**The mechanism.**

```python
@contextmanager
def trace_kb_retrieval(kb_id: str):
    with tracer.subsegment(f"KnowledgeBase:{label}", namespace='remote', ...) as node:
        yield node

# usage, in bedrock_kb_retrieval.py
with trace_kb_retrieval(kb_id):
    response = _bedrock_agent_runtime.retrieve(knowledgeBaseId=kb_id, ...)
```

**Input → output.** Replayed: a block that raises `ValueError('KB down')` prints `open KnowledgeBase:returns`, then `close KnowledgeBase:returns`, then the error goes up to the caller. In the project, every search becomes a `KnowledgeBase:returns`, `:shipping` or `:warranty` node on the Service Map.

**Where to read it again.** [`agent_observability.py · trace_kb_retrieval`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_observability.py#L375) · [`agent_observability.py · trace_request`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_observability.py#L240) · [`bedrock_kb_retrieval.py · retrieve_from_knowledge_base`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/bedrock_kb_retrieval.py#L41).

**To reuse.** Every "open / close" pair (trace, lock, connection, file) in a context manager. `try/finally` around the `yield`.

## Card 41 — Files with `pathlib`

**Project.** Dev3Pack AI Engineering Bootcamp

**In one sentence.** `Path` handles paths as objects: `/` to join, `.glob` to list, `.read_text` to read, `.stem` for the name without its extension.

**Why it matters for an agent.** The agent's evidence (intents, refusals, receipts) lives in files. An intent that could be overwritten no longer proves anything.

**Analogy.** A ledger where you add pages, never rewriting one.

**The mechanism.**

```python
paths = sorted(directory.glob("*.md"))               # stable order
text = path.read_text(encoding="utf-8")
doc_id = path.stem                                    # "rag-basics.md" -> "rag-basics"

directory.mkdir(parents=True, exist_ok=True)
with path.open("x", encoding="utf-8") as handle:     # "x": refuses to overwrite
    json.dump(asdict(record), handle, indent=2)
```

**Input → output.** The same file opened twice in `"x"` mode → `FileExistsError`. `Path("…/20261004T001635-one-espresso.json").stem` → `20261004T001635-one-espresso`.

**Where to read it again.** [`documents.py · load_corpus`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/documents.py#L67) (course) · [ch06 · cells 7 and 17](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch06/notebook.ipynb) (`load_mini`; the frozen index against a disk that changes) · the *preflight* cell of every notebook, for example [ch01 · cell 2](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch01/notebook.ipynb) (climbs up to `pyproject.toml` with `.parent`) · [`buyer/intent.py · pin, read_pin`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/intent.py#L188) · [`grounded-research-agent/agent.py · CORPUS_DIR`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/agent.py#L42).

**To reuse.** Always `encoding="utf-8"`. `sorted(glob(…))` for a deterministic result. `open("x")` for a write-once log. `Path(__file__).resolve().parent` to find your data, wherever the script is launched from.

## In the field

The chapters of my courses where these mechanisms run for real.

- [Dev3Pack, Session 1](/en/books/dev3pack/session-01/): card 41.
- [Dev3Pack, Session 6](/en/books/dev3pack/session-06/): card 41.
- [Dev3Pack, Final assignment](/en/books/dev3pack/final/): card 41.
- [Dev3Pack, Gecko capstone](/en/books/dev3pack/gecko/): card 41.
- [AWS Scholars, chapter 2 · AI Support Agent](/en/books/aws-scholars/chapter-02/): cards 36 and 39.
- [AWS Scholars, chapter 3 · NovaMart Multi-Agent Support](/en/books/aws-scholars/chapter-03/): cards 37, 38 and 40.
