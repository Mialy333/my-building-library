---
workedOn: 2026-10-22
---

Six cards on what happens when things break: the exception turned into a refusal, the degraded fallback, boto3 errors, the rule checked again in the code, the single response contract and state with no side effects.

## Card 30 — Exceptions: raise, catch, turn into a refusal

**Project.** Dev3Pack AI Engineering Bootcamp

**In one sentence.** An exception interrupts the normal flow; you create your own classes (`ToolError`, `Refused`) to know exactly what to catch, then turn them into readable refusals.

**Why it matters for an agent.** A timeout or a broken tool must never surface as a traceback. And catching too broadly hides the real bugs.

**Analogy.** A rejected direct debit carries a coded reason (insufficient funds), not "error".

**The mechanism.**

```python
class ToolError(Exception):
    """Raised when a tool's arguments are invalid. Message is safe to show the model."""

try:
    with urllib.request.urlopen(request, timeout=5) as response:
        return json.loads(response.read())["rates"]
except urllib.error.HTTPError as error:        # the server answered (403…)
    raise ToolError(f"fetch_rates: frankfurter.dev answered HTTP {error.code}") from error
except Exception as error:                     # offline, DNS, timeout
    raise ToolError(f"fetch_rates: could not reach frankfurter.dev ({type(error).__name__})") from error
```

**Input → output.** ch02: `TimeoutLLM` raises `TimeoutError`; `answer_with_timeout` returns `"The model did not respond."`, with no citation, `needs_human_review=True`. `raise … from error` keeps the cause: `__cause__` holds the original `JSONDecodeError`.

**Where to read it again.** [ch02 · cell 26](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch02/notebook.ipynb) (`answer_with_timeout`) · [ch04 · cell 14](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch04/notebook.ipynb) (`fetch_rates`, from the most specific to the broadest) · [ch05 · cell 19](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch05/notebook.ipynb) (the error that would escape the loop) · [`config.py · ConfigError`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/config.py#L23) (never a secret in the message) · [`buyer/check.py · Refused`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/check.py#L52) carries a `FieldResult`; [`NotYetWritten`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/check.py#L27) : a check not yet written never lets a signature through — course.

**To reuse.** One exception class per kind of refusal. Catch from the most specific to the most general. `raise X from error` to keep the cause. An exception that carries an object (`Refused.result`) rather than plain text.

## Card 31 — `try/except` with a degraded fallback

**Project.** AI Support Agent (AWS Scholars, chapter 2)

**In one sentence.** If the call to the Code Interpreter fails, the `except` branch computes a simplified result (loyalty-tier discount only) instead of letting the exception rise and crash the whole conversation turn.

**Why it matters for an agent.** A customer asking for their discount should never receive a stack trace; a partial but correct result beats a raw error.

**Analogy.** A supermarket checkout whose card reader breaks down: the cashier takes cash rather than sending the customer away with nothing.

**The mechanism.**

```python
try:
    with code_session(REGION) as session:
        response = session.invoke("executeCode", {"code": code, "language": "python", "clearContext": True})
        ...
except Exception as e:
    logger.warning("Code Interpreter unavailable, using fallback: %s", e)
    tier_discount_pct = tier_rates.get(tier, 0.0)
    final_total = round(order_total * (1 - tier_discount_pct), 2)
    ...
```

**Input → output.** Code Interpreter unavailable, `tier="Gold"`, `order_total=150` → no exception visible to the customer: `final_total=135.0` with `"note": "Computed with fallback..."`.

**Where to read it again.** [main.py L290–316](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/main.py#L290-L316)

**To reuse.** Every outside call (API, sandbox, Lambda) in production should have an explicit fallback branch: the user gets a best-effort answer, never an exception trace.

## Card 32 — boto3 exceptions

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** boto3 always raises `ClientError`; the real reason is in `exc.response['Error']['Code']`. You handle the expected case, re-raise the others (`raise` alone), and `raise ... from exc` replaces a technical error with a clear message without losing the cause.

**Why it matters for an agent.** In a tool, an unhandled exception stops the agent. Returning a readable error dict lets the model explain the problem to the customer; swallowing every error would hide the real outages.

**Analogy.** A rejected transfer carries a reason code: "insufficient funds" is handled, "account closed" goes up to the manager.

**The mechanism.**

```python
try:
    _create_workflow_state(session_id, customer_id)
except ClientError as exc:
    if exc.response['Error']['Code'] != 'ConditionalCheckFailedException':
        raise                          # unknown error: propagate
# expected case: session already exists -> clear the previous turn and continue

except ClientError as exc:             # inside a tool: an answer, not a crash
    return {'found': False, 'error': f"DynamoDB error: {exc.response['Error']['Message']}"}

raise ConfigError("No AWS credentials found. ...") from exc
```

**Input → output.** A second message in the same `chat` → the expected `ConditionalCheckFailedException` → `Session … already existed: previous results cleared for this new request (version N)`. An unreachable table → `{'found': False, 'error': 'DynamoDB error: …'}`, which the agent rephrases for the customer.

**Where to read it again.** [`agent_orchestrator.py · initialize_session`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1369) · [`agent_orchestrator.py · check_order_status (error)`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L350) · [`config.py · ConfigError`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/config.py#L66).

**To reuse.** Never `except Exception: pass`. In a tool, return the error as data; in the plumbing, raise a named exception with the instruction to fix it.

## Card 33 — The guardrail in the code, and idempotence

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** Before any write, the tool checks the business rule again itself; and replaying the same request returns the existing result instead of creating a second one.

**Why it matters for an agent.** The RefundAgent decides, but an LLM can be wrong or be manipulated (the "admin mode" case of the adversarial tests). The code is the last line of defence before the real effect.

**Analogy.** The adviser approves the loan, but the system refuses any amount above the ceiling; and an order entered twice is executed only once.

**The mechanism.**

```python
if order.get('status') == 'return_initiated':                 # idempotency
    return {'success': True, 'already_initiated': True,
            'return_reference': order.get('return_reference'), ...}
if order.get('status') != 'delivered':
    return {'success': False, 'message': f"Order status is '{order.get('status')}'; ..."}
if days is None or days > window:                              # re-check the LLM decision
    return {'success': False, 'message': f"Outside the {window}-day return window ..."}

orders_table.update_item(..., ConditionExpression='#s = :delivered', ...)   # still delivered?
```

**Input → output.** "Admin mode" adversarial test on ORD-27180: not blocked by the guardrail, but the return is refused by the agents (95 days > 60). A second request on an order already being returned → the same `RET-…` reference, `already_initiated: True`.

**Where to read it again.** [`agent_orchestrator.py · initiate_refund`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L520) · [`agent_orchestrator.py · checks`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L557).

**To reuse.** "The LLM decides, the code guarantees": every rule with a real effect (money, status, access) is checked again in the tool that writes. A conditional write on the expected state, and an idempotent return.

## Card 34 — A single response contract

**Project.** AI Support Agent (AWS Scholars, chapter 2)

**In one sentence.** Every branch of the `order_tracker.py` Lambda handler goes through a single helper, `_response(status_code, body)`, which guarantees the exact shape that API Gateway's proxy integration expects (`statusCode`, `headers`, a `body` serialized to a JSON string).

**Why it matters for an agent.** If a single branch forgot to serialize the `body` to JSON or to add the right header, API Gateway would return an opaque error to the agent, hard to trace back to the real cause in the Lambda.

**Analogy.** An official form always filled in the same format, so the counter that receives it never has to guess where to look.

**The mechanism.**

```python
def _response(status_code: int, body: dict) -> dict:
    return {
        "statusCode": status_code,
        "headers":    {"Content-Type": "application/json"},
        "body":       json.dumps(body),
    }
```

**Input → output.** `_response(404, {"error": "Order ORD-999 not found"})` → the exact dict that API Gateway expects from a proxy integration, ready to go back to the client with no further change.

**Where to read it again.** [order\_tracker.py L74–86](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/lambda/order_tracker.py#L74-L86)

**To reuse.** As soon as several code paths must return the same output format (an API, a protocol, an integration contract), centralize it in one small function: the cheapest guard against a format bug that only shows up in production.

## Card 35 — State with no side effects

**Project.** AI Support Agent (AWS Scholars, chapter 2)

**In one sentence.** `_orders()` and `_customers()` are called again on every Lambda invocation and return a brand-new literal dict each time, rather than reading a mutable global variable defined once at module level.

**Why it matters for an agent.** AWS Lambda sometimes reuses the same execution environment between two invocations; a data structure changed by a previous invocation would still be visible to the next one, for a different customer.

**Analogy.** A whiteboard wiped and redrawn completely before each meeting, rather than hoping nobody left notes from the last one.

**The mechanism.**

```python
def _orders():
    """Return the mock order database."""
    return {
        "ORD-001": {...},
        ...
    }
```

**Input → output.** Two successive invocations of the same Lambda → two `orders` dicts that are physically different in memory, so no accidental change to one can affect the other.

**Where to read it again.** [order\_tracker.py L23–71](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/lambda/order_tracker.py#L23-L71)

**To reuse.** In a serverless/stateless handler, never change a module-level data structure between two calls: prefer a function that returns a fresh copy every time.

## In the field

The chapters of my courses where these mechanisms run for real.

- [Dev3Pack, Session 2](/en/books/dev3pack/session-02/): card 30.
- [Dev3Pack, Session 4](/en/books/dev3pack/session-04/): card 30.
- [Dev3Pack, Session 5](/en/books/dev3pack/session-05/): card 30.
- [Dev3Pack, Gecko capstone](/en/books/dev3pack/gecko/): card 30.
- [AWS Scholars, chapter 2 · AI Support Agent](/en/books/aws-scholars/chapter-02/): cards 31, 34 and 35.
- [AWS Scholars, chapter 3 · NovaMart Multi-Agent Support](/en/books/aws-scholars/chapter-03/): cards 32 and 33.
