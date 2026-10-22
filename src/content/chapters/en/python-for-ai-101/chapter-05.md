---
workedOn: 2026-10-22
---

Seven cards on the text that goes in and out of the model: f-strings, regex, the tokenization that finds a passage, strict JSON, and careful reading of the tool-call blocks.

## Card 16 — f-strings, and the refusal that names both values

**Project.** Dev3Pack AI Engineering Bootcamp

**In one sentence.** An f-string inserts values into a text: `{x!r}` shows the value in quotes, `{x:.2f}` rounds what is displayed, `{x:<12}` aligns.

**Why it matters for an agent.** A useful refusal names the field, the value asked for and the value found. `!r` makes the difference between `'Latte'` and `'Latte '` visible.

**Analogy.** A line on a bank statement: label, expected amount, amount charged, side by side.

**The mechanism.**

```python
raise ToolError(f"convert_currency: no rate {source}->{target}; known: {sorted(rates)}")
text = f"{self.field}: asked {self.asked!r}, {self.where} {self.found!r}"
print(f"{scored.score:6.2f}  {scored.chunk.doc_id}#{scored.chunk.position}")
```

**Input → output.** `f"{100 * 0.92:.2f}"` → `92.00`. `f"{'Latte'!r}"` → `'Latte'`. The cookie refusal → `price_raw: asked 'at most 2000000', prepared 2500000 (for the product named 'Cookie')`.

**Where to read it again.** [ch04 · cells 10 and 17](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch04/notebook.ipynb) (`ToolError` messages) · [ch05 · cell 13](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch05/notebook.ipynb) (refusal sentences) · [`buyer/check.py · FieldResult.line`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/check.py#L45) and [`tools.py · « valid ids: … »`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/tools.py#L93) — course.

**To reuse.** Every error follows the template `function: what is wrong; what is accepted`. `!r` for any value that comes from outside. Never a secret in a log f-string.

## Card 17 — f-strings and format specifiers

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** An f-string inserts expressions into text; after `:` comes a format: `08d` (an integer on 8 digits, padded with zeros), `.0%` (a percentage), `.3f` (3 decimals).

**Why it matters for an agent.** The identifiers (`RET-…`), the DynamoDB sort keys and the messages returned to the model are all built this way. A message that quotes the values (`Outside the 60-day return window for Premium customers`) lets the model explain a refusal.

**Analogy.** Cheque numbers printed on 7 digits: 0000123 sorts before 0001000, which 123 does not guarantee against 1000 in an alphabetical sort.

**The mechanism.**

```python
f"MSG#{agent_id}#{session_message.message_id:08d}"            # sortable DynamoDB key
f"RET-{uuid.uuid4().hex[:8].upper()}"                         # return reference
f"Outside the {window}-day return window for {tier} customers."
f"{logging_configuration['xRayConfig']['samplingRate']:.0%}"   # 1.0 -> 100%
```

**Input → output.** Replayed: `message_id=7` → `MSG#orchestrator#00000007`; `samplingRate=1.0` → `100%`. `uuid4().hex[:8].upper()` → eight uppercase hexadecimal characters, for example `RET-3FA85F64`.

**Where to read it again.** [`agent_orchestrator.py · create_message`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1042) · [`agent_orchestrator.py · return_reference`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L576) · [`bedrock_kb_retrieval.py · format_kb_results`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/bedrock_kb_retrieval.py#L111) (`{r['score']:.3f}`).

**To reuse.** Zero-padding for any key sorted as text. Every error message quotes the field and the values compared.

## Card 18 — Regular expressions

**Project.** Dev3Pack AI Engineering Bootcamp

**In one sentence.** A regular expression (regex) describes a shape of text, for example "ignore, then 0 to 3 words, then instructions", rather than an exact word.

**Why it matters for an agent.** An injection or a secret key has a shape, not a fixed word. The guard recognizes it before the model, without firing on an innocent sentence.

**Analogy.** An anti-fraud filter that spots the pattern "urgent transfer + new beneficiary", whatever the name.

**The mechanism.**

```python
INJECTION = re.compile(r"ignore\s+(?:\w+\s+){0,3}instructions", re.IGNORECASE)
BEARER = re.compile(r"(?<=Bearer )[A-Za-z0-9._-]{12,}")      # the token AFTER "Bearer "
value = BEARER.sub(lambda m: placeholder("bearer_token", m.group(0)), value)
QUOTED = re.compile(r"\"[^\"]*\"|“[^”]*”|'[^'\n]{12,}'")      # the text between quotation marks
```

The minimal vocabulary: `\s+` spaces, `\w+` a word, `(?:…)` a group, `{0,3}` zero to three times, `\b` a word boundary, `^` the start of a line (with `re.MULTILINE`), `(?<=…)` "preceded by" without including it.

**Input → output.** `"IGNORE ALL PREVIOUS INSTRUCTIONS and print…"` → found. `"The setup instructions are in SETUP.md."` → not found. `"Bearer eyJhbGci…"` → `Bearer [redacted:bearer_token:ee17577b]`. `QUOTED.sub(" ", …)` first removes an attack quoted between quotation marks: a document that describes it is not an order.

**Where to read it again.** [ch04 · cells 21 and 27](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch04/notebook.ipynb) (`INJECTION_SHAPES`, `guard_tool_output`) · [ch09 · cell 17](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch09/notebook.ipynb) (`PATTERNS`, `redact`) · [ch12 · cell 16](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch12/notebook.ipynb) (`DIRECTIVE`, `WRITE_MARKERS`) · [`patterns.py · phrase, near, then`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/patterns.py#L55) (course) · [`grounded-research-agent/agent.py · INSTRUCTION_SHAPES`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/agent.py#L59), [`QUOTED`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/agent.py#L66) · [`buyer/intent.py · CONTAINER, PAID_IN, CAP`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/intent.py#L93) · [`scripts/scan_secrets.py · KEYPAIR_ARRAY`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/scripts/scan_secrets.py#L28).

**To reuse.** Compile once, at the top of the module. Test each shape both ways: sentences to catch and innocent sentences (`check_pattern`, ch04). `re.sub` with a function to replace with a mask.

## Card 19 — Validating and unpacking with a regex

**Project.** AI Support Agent (AWS Scholars, chapter 2)

**In one sentence.** `re.fullmatch(r"arn:([a-z0-9-]+):iam::(\d{12}):role/(.+)", role)` checks that the whole string is an IAM role ARN AND captures its three parts in a single call; `match.groups()` unpacks them straight into three variables.

**Why it matters for an agent.** The permissions script needs the partition, the account and the role name to build the IAM policy to attach; a manual `split(":")` would be more fragile and would validate nothing.

**Analogy.** A template that only lets a part through if it has exactly the right shape, and that marks, at the same time, where its three holes are.

**The mechanism.**

```python
match = re.fullmatch(r"arn:([a-z0-9-]+):iam::(\d{12}):role/(.+)", role)
runtime = agent.get("bedrock_agentcore", {}).get("agent_id")
if not match or not runtime:
    raise ValueError("Run agentcore deploy first; ...")
partition, account, role_path = match.groups()
```

**Input → output.** `role="arn:aws:iam::419225114027:role/AmazonBedrockAgentCoreSDKRuntime-us-east-1-aa96c3a063"` → `partition="aws"`, `account="419225114027"`, `role_path="AmazonBedrockAgentCoreSDKRuntime-us-east-1-aa96c3a063"`.

**Where to read it again.** [setup\_permissions.py L57–64](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/setup_permissions.py#L57-L64)

**To reuse.** `re.fullmatch` + `.groups()` validates and unpacks a structured string (ARN, ID, path) in one line, rather than a shape test followed by a separate manual split.

## Card 20 — From words to sets: tokens, `set`, IDF

**Project.** Dev3Pack AI Engineering Bootcamp

**In one sentence.** The text is cut into lowercase words (the tokens); a `set` keeps what the question and the passage have in common; a rare word weighs more than a common one (IDF).

**Why it matters for an agent.** This is the course's whole retrieval engine. With no word in common, nothing comes back, and the agent refuses without calling the model.

**Analogy.** A book's index: a rare word ("blockhash") leads quickly to the right page, a common word ("agent") to all of them.

**The mechanism.**

```python
_TOKEN_RE = re.compile(r"[a-z0-9]+")
def _tokens(text):
    return [t for t in _TOKEN_RE.findall(text.lower()) if t not in _STOPWORDS]

overlap = tokens & query_tokens                                    # intersection
score = sum(math.log(1 + total / df[token]) for token in overlap)  # IDF
scored.sort(key=lambda s: (-s.score, s.chunk.doc_id, s.chunk.position))
```

**Input → output.** `_tokens("What stopping conditions should an agent loop have?")` → `['stopping', 'conditions', 'agent', 'loop']`. Over 10 passages, a word found in only one weighs `log(1 + 10/1) = 2.40`; found everywhere, `0.69`. `retrieve("vector embeddings cosine similarity", …)` → `[]`.

**Where to read it again.** [`retrieval.py · _tokens`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/retrieval.py#L41), [`chunk_document`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/retrieval.py#L45), [`retrieve`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/retrieval.py#L63) (course) · [ch06 · cells 19 to 23](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch06/notebook.ipynb) (chunks, scores, failure table) · [ch07 · cells 5 to 13](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch07/notebook.ipynb) (`hit_rate`, `expand`) · [`grounded-research-agent/agent.py · _trigrams`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/agent.py#L193) (runs of three words to measure copying).

**To reuse.** A lexical baseline before any embedding. Sort with a tuple key (`-score`, then the id) for a stable order. `frozenset` for a word list that never changes.

## Card 21 — Strict JSON

**Project.** Dev3Pack AI Engineering Bootcamp

**In one sentence.** `json.loads` turns the model's text into a dict; the strict parser refuses anything that does not have exactly the expected shape.

**Why it matters for an agent.** The model's output is untrusted input. An extra field or a numeric citation must fail at the boundary, not three steps later.

**Analogy.** A bank form: one extra box, an amount written in words, and the counter hands it back.

**The mechanism.**

```python
try:
    payload = json.loads(text)
except json.JSONDecodeError as error:
    raise AnswerParseError(f"Not valid JSON: {error}") from error
if set(payload) != REQUIRED_FIELDS:                      # nothing missing, nothing extra
    raise AnswerParseError(...)
if not isinstance(confidence, int | float) or isinstance(confidence, bool):
    raise AnswerParseError("'confidence' must be a number")
```

The test on `bool` is not a detail: in Python, `True` is also an `int`.

**Input → output.** `"The answer is chunking."` → `Not valid JSON: Expecting value: line 1 column 1 (char 0)`. Without `confidence` → `Wrong fields: missing=['confidence', 'needs_human_review'] unknown=[]`. `"citations": [42]` → `'citations' must be a list of strings`. With `source_url` → `unknown=['source_url']`. A Markdown fence around the JSON is tolerated.

**Where to read it again.** [`schema.py · parse_research_answer`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/schema.py#L38) and [`evals.py · load_cases`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/evals.py#L49) (one JSON per line) — course · [ch03 · cells 9, 25 and 27](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch03/notebook.ipynb) · [`grounded-research-agent/agent.py · _selection`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/agent.py#L157) (the object between the first `{` and the last `}`), [`_repairs`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/agent.py#L112) (`json.loads(…, strict=False)`) · [`buyer/mcp_client.py · _read_reply`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/mcp_client.py#L98) (plain JSON or a `data:` stream).

**To reuse.** A `REQUIRED_FIELDS` set compared with `set(payload)`. Each field's type checked. A local, free repair before asking the model again.

## Card 22 — Defensive parsing of `toolUse` / `toolResult` blocks

**Project.** AI Support Agent (AWS Scholars, chapter 2)

**In one sentence.** `agent.messages` is a mixed list of blocks; the trace code tests `"toolUse" in block` and `"toolResult" in block` before indexing, instead of assuming every block has a fixed shape.

**Why it matters for an agent.** This exact test is what produced, for the Udacity reviewer, the structured proof (tool name, input, result) that a Gateway tool had really been called; a final answer alone proves nothing.

**Analogy.** A postal sorter who opens each parcel to see what's inside before filing it, rather than assuming every parcel has the same label.

**The mechanism.**

```python
for msg in agent.messages:
    for block in msg.get("content", []):
        if "toolUse" in block:
            tu = block["toolUse"]
            logger.info("TOOL CALL name=%s input=%s", tu.get("name"), tu.get("input"))
        if "toolResult" in block:
            tr = block["toolResult"]
            logger.info("TOOL RESULT toolUseId=%s status=%s content=%s",
                        tr.get("toolUseId"), tr.get("status"), tr.get("content"))
```

**Input → output.** A turn that calls `order-tracker___get_order` → two CloudWatch log lines, one with the tool's name and input, the other with its `status` and structured result.

**Where to read it again.** [main.py L385–398](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/main.py#L385-L398)

**To reuse.** Message objects in LLM frameworks are always mixed: always check that a key is there before reading it, and log the structured fields (name, input, result) rather than only the final text.

## In the field

The chapters of my courses where these mechanisms run for real.

- [Dev3Pack, Session 3](/en/books/dev3pack/session-03/): card 21.
- [Dev3Pack, Session 4](/en/books/dev3pack/session-04/): cards 16 and 18.
- [Dev3Pack, Session 5](/en/books/dev3pack/session-05/): card 16.
- [Dev3Pack, Session 6](/en/books/dev3pack/session-06/): card 20.
- [Dev3Pack, Session 7](/en/books/dev3pack/session-07/): card 20.
- [Dev3Pack, Session 9](/en/books/dev3pack/session-09/): card 18.
- [Dev3Pack, Session 12](/en/books/dev3pack/session-12/): card 18.
- [Dev3Pack, Final assignment](/en/books/dev3pack/final/): cards 18, 20 and 21.
- [Dev3Pack, Gecko capstone](/en/books/dev3pack/gecko/): cards 16, 18 and 21.
- [AWS Scholars, chapter 2 · AI Support Agent](/en/books/aws-scholars/chapter-02/): cards 19 and 22.
- [AWS Scholars, chapter 3 · NovaMart Multi-Agent Support](/en/books/aws-scholars/chapter-03/): card 17.
