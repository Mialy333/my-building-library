---
workedOn: 2026-10-22
---

Six cards on the agent seen as a Python object: what it holds, what is injected into it, the hooks around it, the interface you implement for it, and memory copied per user.

## Card 42 — The agent is a Python object

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** A Strands `Agent` brings together a model (`BedrockModel`), a system prompt and a list of tools; it can be called like a function (`agent(prompt)`), keeps its history in `agent.messages` and a state invisible to the model in `agent.state`.

**Why it matters for an agent.** Emptying `agent.messages` before each request stops one customer from inheriting another's conversation. Writing the session's customer into `agent.state`, and reading it back in the tool through `ToolContext`, makes customer isolation independent of the prompt.

**Analogy.** An adviser: their job description (prompt), their tools (access to the systems), their notebook (messages) cleared between two customers, and the current customer's badge (state) that the systems check.

**The mechanism.**

```python
model = BedrockModel(model_id=config.WORKER_MODEL_ID, temperature=0.1,
                     region_name=config.AWS_REGION)
return Agent(model=model, system_prompt=system_prompt,
             tools=[check_order_status, get_customer_tier, list_customer_orders])

# _run_worker: one routing step
agent.messages = []                                              # fresh history
agent.state.set('session_customer_id', customer_id)              # bound customer
agent_result = agent(prompt)                                     # reasoning + tool loop
result = str(agent_result)                                       # final text
getattr(agent_result, 'stop_reason', '') == 'guardrail_intervened'

# inside a tool
bound = tool_context.agent.state.get('session_customer_id')
if bound and customer_id != bound:
    return {'found': False, 'access_denied': True, ...}
```

**Input → output.** Replayed: `getattr(obj, 'stop_reason', '')` → `end_turn` on an object that has it, `''` otherwise, with no exception. "Isolation probe" adversarial test (CUST-002 asks for CUST-001's data) → refusal. The temperatures follow the rubric: 0.0 to route and retrieve, 0.1 for facts and decisions, 0.2 for synthesis, 0.3 for writing.

**Where to read it again.** [`agent_orchestrator.py · build_inventory_agent`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L293) · [`agent_orchestrator.py · _run_worker`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1243) · [`agent_orchestrator.py · _check_customer_scope`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L256) · [`agent_orchestrator.py · _guardrail_intervened`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L972).

**To reuse.** One builder per agent that returns a single `Agent`. History cleared on every request. The session's identity in `agent.state`, checked in every tool that reads or writes customer data. The shared routing pattern factored into a single function (`_run_worker`).

## Card 43 — `Protocol` and dependency injection

**Project.** Dev3Pack AI Engineering Bootcamp

**In one sentence.** A `Protocol` describes the method an object must have (`complete(system, user) -> str`); you pass that object in as a parameter instead of creating it inside.

**Why it matters for an agent.** You swap the real model for `FakeLLM`, the network for a function, the blockchain for a recording, without touching the agent. That is what makes everything testable offline.

**Analogy.** A standard power socket: any device with the right plug fits.

**The mechanism.**

```python
class LLMClient(Protocol):
    def complete(self, system: str, user: str) -> str: ...

class FakeLLM:                                   # inherits nothing: it has the method
    def complete(self, system, user):
        self.calls.append((system, user))         # every call is recorded
        ...

def convert_currency(amount, source, target, fetch=fetch_rates):   # injectable dependency
    rates = fetch(source)
```

**Input → output.** `FakeLLM(responses={"hello": "Hi!"})`: "Say HELLO" → `Hi!`; "bye" → the default answer; `len(llm.calls)` → `2`. `convert_currency(100, "USD", "EUR", fetch=lambda base: {"EUR": 0.5})` → `100 USD = 50.00 EUR`, with no network.

**Where to read it again.** [`llm.py · LLMClient`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/llm.py#L20), [`FakeLLM`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/llm.py#L26), [`get_client`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/llm.py#L111) — course · [ch02 · cells 5, 12 and 26](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch02/notebook.ipynb) · [ch04 · cell 17](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch04/notebook.ipynb) · [`buyer/mcp_client.py · Gecko, HostedGecko, RecordedGecko`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/mcp_client.py#L29), [`buyer/ledger.py · Chain`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/ledger.py#L19), [`buyer/signer.py · Signer`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/signer.py#L60) — course · [`grounded-research-agent/agent.py · YourAgent(client=None)`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/agent.py#L209).

**To reuse.** One `Protocol` per outside service: model, API, chain. A fake that records its calls, so you can claim "zero calls to the model". The *recorded lane* is that fake, filled with real recorded answers.

## Card 44 — `HookProvider` / `HookRegistry`, classes as plugins

**Project.** AI Support Agent (AWS Scholars, chapter 2)

**In one sentence.** A class that implements `HookProvider` subscribes to events in the agent's life cycle (message added, end of invocation) through `registry.add_callback`, without changing the code of the main loop.

**Why it matters for an agent.** Cross-session memory must run "before" (inject the context) and "after" (save the exchange) every turn: exactly the two moments a hook exposes.

**Analogy.** A valet service at the door of a restaurant: it acts before you go in and after you come out, without ever touching what happens at the table.

**The mechanism.**

```python
class MemoryHook(HookProvider):
    def register_hooks(self, registry: HookRegistry) -> None:
        registry.add_callback(MessageAddedEvent, self.retrieve_customer_context)
        registry.add_callback(AfterInvocationEvent, self.save_support_interaction)
```

**Input → output.** A new user message triggers `retrieve_customer_context`, which prefixes the message with `"Customer Context:\n..."` before the agent sees it; the end of the turn triggers `save_support_interaction`, which writes the exchange to memory.

**Where to read it again.** [main.py L99–188](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/main.py#L99-L188)

**To reuse.** Any cross-cutting logic (memory, logging, audit, guardrail) plugs in as a class that subscribes to the framework's events, never by editing the agent's main loop.

## Card 45 — Hooks: a rule enforced by the code

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** A hook is a function that Strands calls at a precise moment in the agent's cycle (before the invocation, after it); a regular expression there extracts the fields of a text header.

**Why it matters for an agent.** Rule 6 ("the CommunicationAgent always answers last") was in the prompt, but case 10 of the adversarial tests showed that Haiku could refuse on its own. The `_end_turn` hook checks and calls the CommunicationAgent if needed: the rule no longer depends on the model obeying.

**Analogy.** The end-of-day compliance check: whatever the adviser did, no file leaves without the standard letter to the customer.

**The mechanism.**

```python
def _start_turn(event: BeforeInvocationEvent) -> None:
    match = re.search(r'\[Session ID:\s*([^\]]+)\]\s*\[Customer ID:\s*([^\]]+)\]\s*(.*)', text, re.S)
    sid, cid, request = (part.strip() for part in match.groups())
    if sid != turn['session_id']:
        event.agent.messages.clear()                # new session: no leak
    turn.update(session_id=sid, customer_id=cid, request=request, communication_done=False)

def _end_turn(event: AfterInvocationEvent) -> None:
    if turn['communication_done']:
        return
    route_to_communication_agent(session_id=turn['session_id'], ...)   # Rule 6 in code

orchestrator = Agent(..., hooks=[_start_turn, _end_turn])
```

**Input → output.** Replayed: `"[Session ID: ab12cd34] [Customer ID: CUST-001] I want to return\nmy order ORD-27176"` → `('ab12cd34', 'CUST-001', 'I want to return\nmy order ORD-27176')`; `re.S` lets `.` cross the line break. After the fix, the X-Ray trace of case 10 shows Orchestrator → `initialize_session` → CommunicationAgent, no worker.

**Where to read it again.** [`agent_orchestrator.py · _start_turn`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1162) · [`agent_orchestrator.py · _end_turn`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1389).

**To reuse.** Every "always" or "never" rule that matters is written in a hook or a tool; the prompt only announces it. A structured header in the message, parsed by a regex with named or numbered groups.

## Card 46 — Inheriting an interface: `SessionRepository`

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** A class can inherit an interface (a class whose methods are left to be provided); the framework calls those methods without knowing how they store the data.

**Why it matters for an agent.** Strands has no DynamoDB session storage (the `DynamoDbSessionStorage` of the brief doesn't exist). By implementing `SessionRepository`, `RepositorySessionManager` saves the Orchestrator's conversation to DynamoDB, and it survives a process restart.

**Analogy.** A plug standard: any manufacturer can make the appliance, as long as it fits the shape of the socket.

**The mechanism.**

```python
class DynamoDBSessionRepository(SessionRepository):
    def __init__(self, table_name: str = SESSIONS_TABLE):
        self.table = dynamodb.Table(table_name)

    def create_session(self, session: Session, **kwargs) -> Session:
        self._put(session.session_id, 'SESSION', session.to_dict())
        return session

    def create_message(self, session_id, agent_id, session_message, **kwargs) -> None:
        self._put(session_id, f"MSG#{agent_id}#{session_message.message_id:08d}",
                  session_message.to_dict())

Agent(..., agent_id='orchestrator',
      session_manager=RepositorySessionManager(session_id=session_id,
                                               session_repository=DynamoDBSessionRepository()))
```

**Input → output.** `scripts/session_demo.py` builds the Orchestrator twice with the same `session_id` (a simulated restart): on the second turn, it finds the order mentioned in the first. The table then holds the keys `SESSION`, `AGENT#orchestrator`, `MSG#orchestrator#00000001`, sorted thanks to zero-padding.

**Where to read it again.** [`agent_orchestrator.py · DynamoDBSessionRepository`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L997) · [`agent_orchestrator.py · list_messages`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1056) · [`scripts/session_demo.py · main`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/scripts/session_demo.py#L45).

**To reuse.** When a framework accepts an interface, implement it rather than working around the framework. `**kwargs` in the signatures, to tolerate arguments added by a future version of the SDK. Storing the JSON in a single attribute avoids DynamoDB type problems.

## Card 47 — Copies and per-user memory

**Project.** Dev3Pack AI Engineering Bootcamp

**In one sentence.** In Python, two names can point to the same object; `copy.deepcopy` creates an independent object, and a `(user_id, key)` key keeps users apart.

**Why it matters for an agent.** A memory shared by mistake carries Ana's preference over to Bruno. A value stored without a copy changes when the caller modifies it.

**Analogy.** Photocopying a document before filing it: the original can be scribbled on, the filed copy stays as it was.

**The mechanism.**

```python
def remember(self, user_id, key, value):
    owner = self._owner(user_id)                        # refuses an empty id
    self._values[(owner, key)] = copy.deepcopy(value)   # copy on the way in

def recall(self, user_id, key):
    owner = self._owner(user_id)
    if (owner, key) not in self._values:
        return None
    return copy.deepcopy(self._values[(owner, key)])    # copy on the way out
```

**Input → output.** `v = {"tags": ["a"]}` stored with `deepcopy`, then `v["tags"].append("b")`: the memory keeps `['a']`. Stored without a copy, the same value becomes `['a', 'b', 'c']` as changes pile up.

**Where to read it again.** [ch11 · cells 6, 8, 16 and 20](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch11/notebook.ipynb) (`SessionState`, `MemoryStore`, expiry with `date`) · [`grounded-research-agent/tests/test_contract.py · test_memory_is_capped_reset_and_kept_per_user`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/tests/test_contract.py#L272).

**To reuse.** Copy on the way into storage and on the way out. `@staticmethod` for a validation that does not need the object. An expiry date for each memory.

## In the field

The chapters of my courses where these mechanisms run for real.

- [Dev3Pack, Session 2](/en/books/dev3pack/session-02/): card 43.
- [Dev3Pack, Session 4](/en/books/dev3pack/session-04/): card 43.
- [Dev3Pack, Session 11](/en/books/dev3pack/session-11/): card 47.
- [Dev3Pack, Final assignment](/en/books/dev3pack/final/): cards 43 and 47.
- [Dev3Pack, Gecko capstone](/en/books/dev3pack/gecko/): card 43.
- [AWS Scholars, chapter 2 · AI Support Agent](/en/books/aws-scholars/chapter-02/): card 44.
- [AWS Scholars, chapter 3 · NovaMart Multi-Agent Support](/en/books/aws-scholars/chapter-03/): cards 42, 45 and 46.
