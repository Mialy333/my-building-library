---
workedOn: 2026-10-22
---

Six cards on the shape of the data an agent handles: the dictionary and careful reading with .get(), the frozen dataclass, exact numbers, bytes and the hash, and identifiers.

## Card 6 — The dictionary, a light contract

**Project.** Dev3Pack AI Engineering Bootcamp

**In one sentence.** A `dict` stores values under names (the keys), like a form with labeled boxes.

**Why it matters for an agent.** The trace, a loop's receipt, a tool's answer are all dicts. A missing key makes the next step crash, or worse, makes it go quiet.

**Analogy.** A bank transfer slip: every box has a name (IBAN, amount). Without an amount, the counter rejects it.

**The mechanism.**

```python
answer_fields = {"answer", "citations", "confidence", "needs_human_review"}
healthy = answer_fields <= good["body"].keys()   # are all the boxes there?
tag_index.setdefault(tag, []).append(doc_id)       # creates the list on the first pass
new_state = {**state, "rejected": reason}          # a copy, one box changed
```

**Input → output.** Three tagged documents → `tag_index["retrieval"] == ['rag-basics', 'evaluation-basics']`. `{**state, "rejected": "x"}` returns a new dict; `state` does not change.

**Where to read it again.** [ch14 · cell 9](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch14/notebook.ipynb) (`smoke`, the `<=` test) · [ch06 · cell 13](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch06/notebook.ipynb) (the tag index) · [ch08 · cell 28](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch08/notebook.ipynb) (`storm_step`) · [ch05 · cells 13 and 24](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch05/notebook.ipynb) (`receipt`, `chat.setdefault("calls", 0)`).

**To reuse.** Check a payload with `REQUIRED <= data.keys()` before reading it. Build an index with `setdefault`. Produce a new state with `{**old, key: value}` instead of changing the old one.

## Card 7 — Chaining `.get()`

**Project.** AI Support Agent (AWS Scholars, chapter 2)

**In one sentence.** `memory.get("content", {}).get("text", "").strip()` provides a default value at every level of a nested dictionary, so it never raises a `KeyError`, even if a key is missing anywhere along the chain.

**Why it matters for an agent.** Memory, Gateway and Knowledge Base answers are outside JSON, not guaranteed to have exactly the expected shape; direct bracket access (`data["content"]["text"]`) crashes the whole turn at the first missing key.

**Analogy.** Asking for "the city, otherwise nothing" rather than demanding a full address: if the postcode is missing, you still get something usable.

**The mechanism.**

```python
for memory in memories:
    text = memory.get("content", {}).get("text", "").strip()
    if text:
        context_snippets.append(f"[{strategy_type}] {text}")
```

**Input → output.** A memory item `{"content": {}}` (with no `"text"`) → `text = ""` → the item is simply skipped (`if text:` is false), instead of crashing the whole loop.

**Where to read it again.** [main.py L146–149](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/main.py#L146-L149)

**To reuse.** Facing an unpredictable JSON/API answer (the case of almost every AI tool), chain `.get(key, default)` rather than `data[key][key2]`: it fails gently, never with an exception.

## Card 8 — The frozen dataclass

**Project.** Dev3Pack AI Engineering Bootcamp

**In one sentence.** `@dataclass` declares a record with named, typed fields; `frozen=True` forbids changing it after it is created.

**Why it matters for an agent.** An answer or an intent that can change along the way no longer proves anything. The pinned intent must stay the one from the start.

**Analogy.** A time-stamped stock order: you don't rewrite it, you place another one.

**The mechanism.**

```python
@dataclass(frozen=True)
class ResearchAnswer:
    answer: str
    citations: tuple[str, ...]      # a tuple, which can't be changed either
    confidence: float
    needs_human_review: bool

@dataclass
class SessionState:
    episodes: list[str] = field(default_factory=list)   # a fresh list for each object
```

**Input → output.** `answer.confidence = 1.0` → `FrozenInstanceError: cannot assign to field 'confidence'`. `asdict(answer)` → a dict ready for `json.dump`. Two `SessionState()` never share the same list.

**Where to read it again.** [`schema.py · ResearchAnswer`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/schema.py#L31), [`documents.py · Document`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/documents.py#L29), [`agent.py · TraceEvent, AgentResult`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/agent.py#L49) — course · [ch06 · cell 5](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch06/notebook.ipynb) (`MiniDocument`) · [ch11 · cell 6](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch11/notebook.ipynb) (`SessionState`) · [`my-gecko-buyer/buyer/intent.py · IntentRecord`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/intent.py#L74), [`Menu.from_list_stores`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/intent.py#L39) · [`buyer/check.py · FieldResult`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/check.py#L36).

**To reuse.** Everything that comes out of a model or a tool becomes a frozen dataclass. `tuple` rather than `list` inside a frozen object. `field(default_factory=list)` for a mutable default value. A `@classmethod from_xxx(cls, data)` to build the object from JSON.

## Card 9 — Exact numbers

**Project.** Dev3Pack AI Engineering Bootcamp

**In one sentence.** Money is counted in integers, in the token's smallest unit; a text like "2.5" is converted with `Decimal`, never with `float`.

**Why it matters for an agent.** An agent that pays compares amounts to a budget. One rounding error is enough to let a price that is too high through.

**Analogy.** The bank counts in cents, not in euros with a decimal point.

**The mechanism.**

```python
budget_raw = int(Decimal(cap.group(1)) * (10**item.decimals))   # "2" -> 2000000
if prepared.price_raw is None:                                    # unknown amount
    return refuse("price_raw", f"at most {intent.budget_raw}", None)
if prepared.price_raw > intent.budget_raw:                        # integers compared
    return refuse("price_raw", f"at most {intent.budget_raw}", prepared.price_raw)
```

**Input → output.** `0.1 + 0.2` → `0.30000000000000004`. `Decimal("0.1") + Decimal("0.2")` → `0.3`. `int(Decimal("2.5") * 10**6)` → `2500000`. `1_000_000` is one million: the underscore only helps reading.

**Where to read it again.** [`my-gecko-buyer/buyer/intent.py · parse_intent`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/intent.py#L166) (the "up to" cap) · [`buyer/check.py · check_price`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/check.py#L119) · [ch10 · cell 20](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch10/notebook.ipynb) (`plan_purchase`, `total = price_raw * quantity`) · [ch10 · cell 19](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch10/notebook.ipynb) (prices in `1_000_000`).

**To reuse.** Store `price_raw: int` and `decimals: int`. Convert a human text only once, with `Decimal`. Keep `None` for "unknown amount", and refuse on it.

## Card 10 — Bytes, base64 and fingerprint

**Project.** Dev3Pack AI Engineering Bootcamp

**In one sentence.** A transaction is a sequence of bytes (`bytes`); base64 writes it as text so it can travel; a SHA-256 fingerprint sums up a text without revealing it.

**Why it matters for an agent.** The agent must sign exactly the bytes it checked: one changed byte makes another transaction. And a log must never show a secret.

**Analogy.** Base64 is the envelope that carries a cheque: the content does not change. The fingerprint is the last four digits of a card.

**The mechanism.**

```python
raw = bytearray(base64.b64decode(signed_b64))    # text -> mutable bytes
raw[-1] ^= 0x01                                    # flips one bit of the last byte
tampered = base64.b64encode(bytes(raw)).decode()   # bytes -> text

fingerprint = hashlib.sha256(secret.encode()).hexdigest()[:8]
```

**Input → output.** `b"hello bytes"` → `aGVsbG8gYnl0ZXM=`. After the change → `aGVsbG8gYnl0ZXI=`, that is `b'hello byter'`: `verify` sees it. The fingerprint of `sk-a1b2c3d4e5f60718293a` → `4e3ecbe6`, the same every time. `store_address("dev3mialy333")`, computed from the bytes `b"receipts"` and the name, → `65Zhzi9nXbfuHC6y79VdKtMSzni5mPQJrg1G7BarAaCX`, the real address of my store.

**Where to read it again.** [`my-gecko-buyer/buyer/agent.py · _tamper`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/agent.py#L209) (the "tampered" card) · [`buyer/prepared.py · base64.b64decode`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/prepared.py#L60) · [`buyer/letmebuy.py · store_address`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/letmebuy.py#L50) — course · [ch09 · cell 17](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch09/notebook.ipynb) (`placeholder`).

**To reuse.** `str.encode()` and `bytes.decode()` at the boundaries. Compare a transaction byte by byte, never by eye. Mask a secret with `label + sha256[:8]`: you can say "it's the same one" without showing it.

## Card 11 — Identifiers: `random.choices` vs `uuid.uuid4()`

**Project.** AI Support Agent (AWS Scholars, chapter 2)

**In one sentence.** `refund_processor.py` draws a readable refund ID with `random.choices()` from a chosen alphabet; `main.py` generates a session ID that is guaranteed unique with `uuid.uuid4()`: two functions for two different guarantees.

**Why it matters for an agent.** A demo ID only has to be readable in a support ticket; a session ID, on the other hand, must never collide between two customers or two machines. Mixing up the two tools would bring either an unreadable ID or a real risk of collision.

**Analogy.** A cloakroom ticket number (short, readable, drawn at random) versus a passport serial number (long, designed to be unique worldwide).

**The mechanism.**

```python
def _new_refund_id() -> str:
    return "REF-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=8))

session_id = payload.get("session_id") or str(uuid.uuid4())
```

**Input → output.** `_new_refund_id()` → for example `"REF-7KQZX2P9"` (8 characters, 36^8 possible combinations); `session_id` missing from the payload → a 36-character UUID v4 string, unique for all practical purposes.

**Where to read it again.** [refund\_processor.py L29–38](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/lambda/refund_processor.py#L29-L38) · [main.py L349](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/main.py#L349)

**To reuse.** For a demo ID that a human reads → `random.choices` from a chosen alphabet; for an ID that must never collide between sessions or machines → `uuid.uuid4()`.

## Card 61 — The strict Pydantic model and typed consent

**Project.** DRILLS.ai (Builds, OpenAI DevDay hackathon)

**In one sentence.** A `BaseModel` class describes a request field by field; `extra="forbid"` rejects any extra field, and `Literal[True]` accepts only one value: true.

**Why it matters for an agent.** A candidate's data only goes to the model with their agreement. If agreement is a type, a request without it is rejected before any call, with no `if` forgotten somewhere.

**Analogy.** A subscription form: an unticked "I agree" box, or a note added by hand, and the file is sent back.

**The mechanism.**

```python
class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

class ApplicationRequest(StrictModel):
    candidate_text: str = Field(min_length=50, max_length=16_000)
    job_description: str = Field(min_length=50, max_length=20_000)
    output_language: Literal["fr", "en"] = "fr"
    consent: Literal[True]
```

**Input → output.** Replayed on October 30: `consent=True` → request accepted, language `fr` by default. `consent=False` → `literal_error ('consent',) Input should be True`. An extra `salary` field → `extra_forbidden ('salary',) Extra inputs are not permitted`. In the API, these errors become a 422.

**Where to read it.** [`application.py · StrictModel, ApplicationRequest`](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/src/ai_generator/application.py#L22).

**To reuse.** A strict base class for every input. Length bounds in the type, not in a separate function. A mandatory agreement is written `Literal[True]`.

## Card 62 — A schema built at runtime: `create_model` and `Literal`

**Project.** DRILLS.ai (Builds, OpenAI DevDay hackathon)

**In one sentence.** `create_model` builds a Pydantic class while the program runs; with `Literal[tuple(ids)]`, a field only accepts the IDs that exist for this request.

**Why it matters for an agent.** The schema sent to the model lists the only excerpts it may cite. It can neither invent an ID nor take an excerpt of the posting for an excerpt of the CV.

**Analogy.** A transfer form with a pre-filled list of payees: you choose, you don't type.

**The mechanism.**

```python
def selection_schema(profile: dict[str, str], posting: dict[str, str], *, assessment_only=False):
    # Enum constraints prevent the model from inventing IDs or mixing sources.
    profile_id = Literal[tuple(profile)]
    posting_id = Literal[tuple(posting)]
    requirement = create_model("RequirementSelection", __base__=Requirement,
        posting_quote=(posting_id, ...), candidate_quote=(profile_id | None, ...))
    ...
```

**Input → output.** Replayed with two profile excerpts and one posting excerpt. In the generated JSON Schema, `candidate_quote` becomes `{"enum": ["profile_0", "profile_1"]}` or `null`, and `posting_quote` becomes `{"const": "job_0"}`.

**Where to read it.** [`application.py · selection_schema`](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/src/ai_generator/application.py#L260) · [`resolve_selection`](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/src/ai_generator/application.py#L276), which then puts back the original passages.

**To reuse.** When the model has to point at something, give it the closed list in the schema. `X | None` to say "no evidence" without inventing an empty value.

## In the field

The chapters of my courses and my projects where these mechanisms run for real.

- [Dev3Pack, Session 5](/en/books/dev3pack/session-05/): card 6.
- [Dev3Pack, Session 6](/en/books/dev3pack/session-06/): cards 6 and 8.
- [Dev3Pack, Session 8](/en/books/dev3pack/session-08/): card 6.
- [Dev3Pack, Session 9](/en/books/dev3pack/session-09/): card 10.
- [Dev3Pack, Session 10](/en/books/dev3pack/session-10/): card 9.
- [Dev3Pack, Session 11](/en/books/dev3pack/session-11/): card 8.
- [Dev3Pack, Session 14](/en/books/dev3pack/session-14/): card 6.
- [Dev3Pack, Gecko capstone](/en/books/dev3pack/gecko/): cards 8, 9 and 10.
- [AWS Scholars, chapter 2 · AI Support Agent](/en/books/aws-scholars/chapter-02/): cards 7 and 11.
- [DRILLS.ai, chapter 6 · The assessment](/en/books/drills-ai/chapter-06/): cards 61 and 62.
