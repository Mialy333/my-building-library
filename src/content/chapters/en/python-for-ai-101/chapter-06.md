---
workedOn: 2026-10-22
---

Seven cards on control flow: comprehensions, walking backwards, the bounded loop, the transition table and closures.

## Card 23 — Comprehensions and iteration tools

**Project.** Dev3Pack AI Engineering Bootcamp

**In one sentence.** A comprehension builds a list, a set or a dict in one line; `next`, `any`, `dict.fromkeys` and `sorted(key=…)` cover most of the rest.

**Why it matters for an agent.** Filtering invented citations, removing duplicate documents, finding a product on the menu: a mistake here becomes a false citation or a wrong purchase.

**Analogy.** Sorting a statement: "every line above €100", "the first line from this supplier, otherwise nothing".

**The mechanism.**

```python
fabricated = [c for c in answer.citations if c not in retrieved_ids]
product = next((p for p in listing["products"] if p["name"] == wanted), None)
unique = list(dict.fromkeys(hits))      # removes duplicates, keeps the order
del state.episodes[:-5]                 # keeps only the last 5
kept = [d for d, s in sorted(best.items(), key=lambda kv: (-kv[1], kv[0]))
        if s >= 0.6 * top][:2]
```

**Input → output.** `['rag-basics', 'rag-basics', 'agent-loops']` → `['rag-basics', 'agent-loops']`. `next(…, None)` on "Latte" → `None`, not an exception. Seven episodes → `['Q3', 'Q4', 'Q5', 'Q6', 'Q7']`. Scores `rag-basics 7.2`, `agent-loops 5.0`, `prompt-injection 3.1` → `['rag-basics', 'agent-loops']` (60% threshold, two at most).

**Where to read it again.** [`agent.py · fabricated`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/agent.py#L138) (course) · [ch10 · cell 20](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch10/notebook.ipynb) (`next`) · [ch08 · cell 30](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch08/notebook.ipynb) (`dict.fromkeys`) · [ch11 · cell 8](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch11/notebook.ipynb) (`del …[:-5]`) · [ch12 · cell 16](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch12/notebook.ipynb) (`any(wildcard(s) …)`) · [`grounded-research-agent/agent.py · kept_docs`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/agent.py#L252) · [`retrieval.py · zip(…, strict=True)`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/retrieval.py#L83).

**To reuse.** `next(gen, None)` to search without crashing. `dict.fromkeys` to remove duplicates without losing the order. `zip(a, b, strict=True)` when two lists must have the same length (`retrieval.py`).

## Card 24 — A list comprehension with a filter

**Project.** AI Support Agent (AWS Scholars, chapter 2)

**In one sentence.** `[o for o in orders.values() if o["customer_id"] == cid]` builds the filtered list of a customer's orders in a single expression, instead of a `for` loop plus `append`.

**Why it matters for an agent.** A Lambda tool that answers "my orders" must filter a dataset on every call; the readability of this line matters when the code is read by a reviewer who only has a few minutes.

**Analogy.** Sorting your mail as you take it out of the letterbox, rather than taking everything out first and sorting it on the table.

**The mechanism.**

```python
cid = params.get("customer_id", "").upper()
result = [o for o in orders.values() if o["customer_id"] == cid]
```

**Input → output.** `cid="CUST-123"` on the mock dataset → a list of 2 dicts (`ORD-001`, `ORD-002`); the orders of `CUST-456` don't appear.

**Where to read it again.** [order\_tracker.py L121–127](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/lambda/order_tracker.py#L121-L127)

**To reuse.** As soon as the logic is "a filter + a transformation", the comprehension is the idiomatic Python way: shorter to write and quicker to read than a manual loop.

## Card 25 — Comprehensions and `**` unpacking

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** A comprehension builds a list or a dict in one expression; `**d` turns a dict into keyword arguments, or merges its keys into a new dict.

**Why it matters for an agent.** The same `guardrail_settings()` function feeds `create_guardrail` and `update_guardrail` (the tuning script): a single source of truth for the safety policies.

**Analogy.** A pre-filled form handed in as it is at two different counters.

**The mechanism.**

```python
update_expr_parts = [f"{k} = :{k}" for k in updates]
expr_values = {f":{k}": v for k, v in updates.items()}

response = bedrock_client.create_guardrail(**guardrail_settings())
return {'success': False, **denied}
```

**Input → output.** Replayed: `{'inventory_agent': 'facts'}` → `SET inventory_agent = :inventory_agent, version = :new_version` and `{':inventory_agent': 'facts'}`, the exact format of an `UpdateExpression`. `{'success': False, **{'access_denied': True, 'message': 'x'}}` → `{'success': False, 'access_denied': True, 'message': 'x'}`.

**Where to read it again.** [`agent_orchestrator.py · _update_workflow_state`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L177) · [`agent_orchestrator.py · topics_config`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1573) · [`agent_orchestrator.py · create_guardrail(**…)`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1677) · [`tune_guardrail.py · _update_draft`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/scripts/tune_guardrail.py#L81).

**To reuse.** A function that returns a configuration dict, unpacked with `**` wherever it is used. A comprehension as long as it fits on one readable line; a loop otherwise.

## Card 26 — `reversed()` + early exit

**Project.** AI Support Agent (AWS Scholars, chapter 2)

**In one sentence.** The memory save walks through `agent.messages` backwards with `reversed()` and leaves with `break` as soon as the last user message AND the last assistant message are found.

**Why it matters for an agent.** A conversation's history only grows; looking for "the last pair" from the start would mean scanning the whole history again on every turn, at a cost that grows with the conversation.

**Analogy.** Looking for your keys in the last pocket you put them in, not by emptying every bag one by one from the first.

**The mechanism.**

```python
for message in reversed(messages):
    content = message.get("content", [])
    if not content or "text" not in content[0]:
        continue
    if message.get("role") == "assistant" and agent_response is None:
        agent_response = content[0]["text"]
    elif message.get("role") == "user" and customer_query is None:
        customer_query = content[0]["text"]
    if customer_query and agent_response:
        break
```

**Input → output.** A 40-message history → the loop stops once the last 2 or 3 relevant messages are found, not after reading all 40.

**Where to read it again.** [main.py L161–170](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/main.py#L161-L170)

**To reuse.** To find "the most recent item that meets a condition" in a list, walk it with `reversed()` and leave as soon as it is found, rather than scanning the whole list in the normal order.

## Card 27 — The bounded loop: exits first

**Project.** Dev3Pack AI Engineering Bootcamp

**In one sentence.** An agent loop checks its stop conditions before every action, and always returns the same receipt, whatever the exit.

**Why it matters for an agent.** With no exit, the loop keeps running, spends, and ends in a traceback. Four exits are enough: answer, repetition, budget, tool error.

**Analogy.** A bank card's limit: checked before the payment, not after.

**The mechanism.**

```python
for step in plan:
    name, args = step["tool"], step.get("args", {})
    if name == "answer":
        return receipt(steps, "answered", answer=args["text"])
    if (name, args) == previous:                # the same call twice
        return receipt(steps, "repeated_call", refusal=...)
    if len(steps) >= budget:                    # the budget, BEFORE the call
        return receipt(steps, "budget", refusal=...)
    try:
        result = tools[name](**args)            # the dict becomes keyword arguments
    except ToolError as error:                  # the error becomes a refusal
        return receipt(steps, "tool_error", refusal=...)
    steps.append({"tool": name, "args": args, "result": result})
    previous = (name, args)
```

**Input → output.** `echo("a")` twice → `stopped_because = 'repeated_call'`. `echo`, then `answer` → `answer = 'done'`.

**Where to read it again.** [ch05 · cells 13 and 24](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch05/notebook.ipynb) (`run_loop`, then `respond`, the challenge bot) · [`agent.py · a single retry`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/agent.py#L118) when the JSON is broken (course) · [`grounded-research-agent/agent.py · for attempt in (1, 2)`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/agent.py#L281) · [ch08 · cell 28](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch08/notebook.ipynb) (`MAX_VISITS`).

**To reuse.** Write the exit `return`s before the body. A single receipt format: `steps`, `stopped_because`, `answer`, `refusal`. Every exit other than the answer writes a sentence for a reader.

## Card 28 — The transition table

**Project.** Dev3Pack AI Engineering Bootcamp

**In one sentence.** A dict whose keys are `(state, event)` pairs describes the whole graph; a missing pair is refused.

**Why it matters for an agent.** The agent cannot answer before it has searched. The ban is a missing key, visible at a glance.

**Analogy.** A payment's path: entered, approved, sent. "Sent" straight from "entered" does not exist.

**The mechanism.**

```python
TRANSITIONS = {
    ("planning", "plan_ready"): "retrieving",
    ("retrieving", "hits"): "answering",
    ("answering", "answered"): "done",
}
target = TRANSITIONS.get((current, name))      # None if the pair does not exist
new = {"state": target, "visited": [*state["visited"], target], "rejected": None}
```

**Input → output.** `plan_ready` from `planning` → `retrieving`, `visited = ['planning', 'retrieving']`. `answered` from `planning` → `rejected = "'answered' is not a declared event in state 'planning'"`.

**Where to read it again.** [ch08 · cells 20, 22, 26 and 28](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch08/notebook.ipynb).

**To reuse.** A tuple as a dict key. `.get`, which returns `None` instead of raising. `[*old, new]` for a fresh list. A visit counter to bound the retries.

## Card 29 — Closures: tools packed with their rules

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** A function defined inside another keeps access to the enclosing function's variables, even after that function has finished.

**Why it matters for an agent.** Each `build_*_agent()` defines its tools inside, with their constants (`return_windows`). No global variable, and every agent stands on its own (rubric criterion: "self-contained" builders).

**Analogy.** An adviser who goes to a meeting with the branch's price list in their bag.

**The mechanism.**

```python
def build_refund_agent() -> Agent:
    return_windows = {'Standard': 30, 'Premium': 60}

    @tool(context=True)
    def initiate_refund(customer_id, order_id, reason, tool_context):
        window = return_windows.get(tier, return_windows['Standard'])   # captured
        ...

# Orchestrator: one dict shared by the hooks and the routing tools
turn = {'session_id': session_id, 'customer_id': None, 'request': '', ...}
turn.update(session_id=sid, customer_id=cid, request=request)        # mutate, never rebind
```

**Input → output.** A Premium customer whose order is 45 days old → `window = 60` → return possible; Standard → `window = 30` → refusal. The `turn` dict is changed in place (`turn.update`): if it were reassigned (`turn = {...}`) in a hook, the tools would still see the old one.

**Where to read it again.** [`agent_orchestrator.py · return_windows`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L456) · [`agent_orchestrator.py · turn`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1159).

**To reuse.** An agent's tools defined inside its builder. State shared between inner functions = a dict or an object you change, never a variable you reassign.

## In the field

The chapters of my courses and my projects where these mechanisms run for real.

- [Dev3Pack, Session 5](/en/books/dev3pack/session-05/): card 27.
- [Dev3Pack, Session 8](/en/books/dev3pack/session-08/): cards 23, 27 and 28.
- [Dev3Pack, Session 10](/en/books/dev3pack/session-10/): card 23.
- [Dev3Pack, Session 11](/en/books/dev3pack/session-11/): card 23.
- [Dev3Pack, Session 12](/en/books/dev3pack/session-12/): card 23.
- [Dev3Pack, Final assignment](/en/books/dev3pack/final/): cards 23 and 27.
- [AWS Scholars, chapter 2 · AI Support Agent](/en/books/aws-scholars/chapter-02/): cards 24 and 26.
- [AWS Scholars, chapter 3 · NovaMart Multi-Agent Support](/en/books/aws-scholars/chapter-03/): cards 25 and 29.
