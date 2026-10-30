---
workedOn: 2026-10-22
---

Four cards on data that comes from AWS: reading DynamoDB, writing to it under a condition, converting its types at the boundary, and waiting for a resource without waiting forever.

## Card 12 — Reading DynamoDB: composite key, `query`, sorting

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** `get_item` reads one item by its full key, `query` reads every item of the same partition, and `.get('Item')` returns `None` when nothing is found instead of raising a `KeyError`.

**Why it matters for an agent.** The InventoryAgent must never invent an order. A missing order must become a clear answer ("No order ORD-X found"), not a crash or a hallucination.

**Analogy.** A filing cabinet sorted by customer (the partition), then by order number (the sort key): to pull out a record, you need both.

**The mechanism.**

```python
# Orders table: customer_id = partition key, order_id = sort key -> both required
item = table.get_item(Key={'customer_id': customer_id, 'order_id': order_id}).get('Item')

response = table.query(KeyConditionExpression=Key('customer_id').eq(customer_id))
orders.sort(key=lambda o: o.get('order_date', ''), reverse=True)
```

**Input → output.** Replayed: `{}.get('Item')` → `None`. Three orders dated `2026-08-01`, `2026-09-15` and undated → order `['B', 'A', 'C']`: ISO `YYYY-MM-DD` dates sort as text, and a missing date (`''`) goes to the end of the list. A `get_item` with only the `order_id` → `ValidationException: The provided key element does not match the schema` (trap E2 of the cheat sheet).

**Where to read it again.** [`agent_orchestrator.py · check_order_status`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L324) · [`agent_orchestrator.py · list_customer_orders`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L423).

**To reuse.** Always `.get('Item')`, then an explicit "not found" message. A `lambda` as the sort key, with a default value for missing fields.

## Card 13 — Writing under a condition: optimistic locking

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** A `ConditionExpression` makes DynamoDB check a condition at the very moment of the write, atomically; if it fails, you read again, wait a little longer each time, and retry a bounded number of times.

**Why it matters for an agent.** Several agents write to the same WorkflowState row. Without a condition, the last one to write erases the others' work without anyone noticing.

**Analogy.** The double check on a transfer: it only goes out if the balance read at the start has not moved in between.

**The mechanism.**

```python
table.put_item(Item=state, ConditionExpression='attribute_not_exists(session_id)')

for attempt in range(max_retries):
    try:
        table.update_item(..., ConditionExpression='version = :expected_version')
        return _read_workflow_state(session_id)
    except dynamodb.meta.client.exceptions.ConditionalCheckFailedException:
        if attempt == max_retries - 1:
            raise RuntimeError(f"WorkflowState update failed after {max_retries} retries ...")
        expected_version = int(_read_workflow_state(session_id)['version'])
        time.sleep(0.1 * (attempt + 1))
```

**Input → output.** Replayed: successive waits of `[0.1, 0.2]` seconds, then `RuntimeError` on the third failure. In the project, a return's WorkflowState goes from `version 0` (`initialize_session`) to `1` (Inventory), `2` (Refund), `3` (Communication); each write carries the version read before calling the worker.

**Where to read it again.** [`agent_orchestrator.py · _create_workflow_state`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L122) · [`agent_orchestrator.py · _update_workflow_state`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L166).

**To reuse.** A `version` field on every shared state. Read the version before the work, write with `version = :expected`. A bounded retry with back-off, and a message that names the session when it fails.

## Card 14 — Types at the boundaries: `Decimal`, dates, streams

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** What comes out of AWS is not always native JSON: DynamoDB returns `Decimal`s, `invoke_agent_runtime` a stream to read with `.read()`, and two dates can only be subtracted if they are in the same time zone.

**Why it matters for an agent.** A tool whose answer cannot be serialized makes the agent's whole turn fail. A wrongly computed date grants or refuses a return by mistake.

**Analogy.** A cheque in a foreign currency: you have to convert it before cashing it.

**The mechanism.**

```python
def _to_json_safe(item: dict) -> dict:
    return json.loads(json.dumps(item, default=str))          # Decimal -> str

start = datetime.strptime(date_str, '%Y-%m-%d').replace(tzinfo=timezone.utc)
return (datetime.now(timezone.utc) - start).days              # timedelta -> int

body = response['response'].read()                            # StreamingBody -> bytes
return json.loads(body)
```

**Input → output.** Replayed: `json.dumps({'total_orders': Decimal('5')})` → `Object of type Decimal is not JSON serializable`; with `_to_json_safe` → `{'customer_id': 'CUST-001', 'total_orders': '5'}`. Order of `2026-08-23`, today `2026-10-22` → `60` days. A date with no time zone minus a UTC date → `can't subtract offset-naive and offset-aware datetimes`.

**Where to read it again.** [`agent_orchestrator.py · _to_json_safe`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L219) · [`agent_orchestrator.py · _days_since`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L235) · [`agent_orchestrator.py · invoke_agent`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L2102).

**To reuse.** Convert at the output of every tool with `default=str`. Every date in "aware" UTC. The day count done in the code and passed to the model (`days_since_order`), never left to the model.

## Card 15 — Paginator and bounded wait

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** A paginator chains the pages of an AWS API; a `while` loop with a deadline waits for a resource to be ready without ever running forever.

**Why it matters for an agent.** Agent resources (guardrail, Memory, Runtime) take time to become ready. Deploying them means waiting for their status, with a limit.

**Analogy.** Leafing through a bank statement page by page to the last one; and calling customer service every 3 minutes, but hanging up after an hour.

**The mechanism.**

```python
for page in cf.get_paginator('list_exports').paginate():
    for export in page['Exports']:
        exports[export['Name']] = export['Value']

deadline = time.time() + 120
while time.time() < deadline:
    status = bedrock_client.get_guardrail(guardrailIdentifier=guardrail_id)['status']
    if status == 'READY':
        break
    if status == 'FAILED':
        raise RuntimeError(f"Guardrail {guardrail_id} is in FAILED status")
    time.sleep(3)
```

**Input → output.** At deployment, the guardrail goes from `CREATING` to `READY` in a few seconds, then the numbered version is published (`2` in the final project, `jtjyz5e3odep`). The Memory waits for `ACTIVE` for up to 300 s; a `FAILED` status raises an error with `failureReason` instead of waiting.

**Where to read it again.** [`config.py · _load_cf_exports`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/config.py#L50) · [`agent_orchestrator.py · publish_guardrail_version`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1619) · [`agent_orchestrator.py · configure_memory`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1806).

**To reuse.** Every API that "lists" goes through a paginator. Every wait has a deadline and handles the failure state explicitly.

## In the field

The chapters of my courses and my projects where these mechanisms run for real.

- [AWS Scholars, chapter 3 · NovaMart Multi-Agent Support](/en/books/aws-scholars/chapter-03/): cards 12, 13, 14 and 15.
