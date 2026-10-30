---
workedOn: 2026-10-22
---

Two cards to finish: tests that run offline, and an "expected versus obtained" loop that measures behaviour.

## Card 59 — Tests with pytest

**Project.** Dev3Pack AI Engineering Bootcamp

**In one sentence.** A test is a `test_…` function that asserts a result; pytest provides ready-made tools: `tmp_path`, `monkeypatch`, `parametrize`, and *fixtures*.

**Why it matters for an agent.** The buyer's tests run with the network cut off: a test that tries to reach the Internet fails. So the grade depends neither on the wifi nor on an outside service.

**Analogy.** An internal control that replays the same sample transactions every month.

**The mechanism.**

```python
@pytest.fixture(autouse=True)          # applies to ALL the tests in the folder
def no_network(monkeypatch: pytest.MonkeyPatch) -> None:
    def blocked(*_: Any, **__: Any) -> None:
        raise OSError("tests are offline: the network is blocked")
    monkeypatch.setattr(socket.socket, "connect", blocked)
    monkeypatch.setattr(socket, "create_connection", blocked)

@pytest.mark.parametrize(("status", "code", "error"), [(401, "key-invalid", "…"), (429, "rate-limited", "…")])
def test_each_refusal_prints_the_servers_message(home, capsys, status, code, error): ...
```

**Input → output.** `uv run pytest`: `98 passed, 2 skipped` in `my-gecko-buyer` (October 4); `7 passed, 2 skipped` in `grounded-research-agent`.

**Where to read it again.** [`my-gecko-buyer/tests/conftest.py · no_network`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/tests/conftest.py#L17) · [`tests/test_mainnet_wallet.py · parametrize`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/tests/test_mainnet_wallet.py#L141) (`tmp_path`, `monkeypatch.setenv`) — course · [`grounded-research-agent/tests/test_contract.py`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/tests/test_contract.py#L220) (the timeout caught in under a second, the invented citation removed) · the `check("chNN-eN", …)` cells of every notebook.

**To reuse.** Block the network in `conftest.py` from the very first test. One test per expected refusal, named like a sentence. `parametrize` to replay the same rule on several cases. `tmp_path` to write throwaway files.

## Card 60 — Testing the structure, evaluating the behaviour

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** `unittest` organizes tests in classes; `inspect.getsource` and `ast` read a function's structure without running it; an "expected versus obtained" loop over a fixed set of cases measures an AI system's behaviour.

**Why it matters for an agent.** The Udacity grader checks that my code does contain `ThreadPoolExecutor` and `submit`. And the guardrail is not tuned by feel: each topic definition is measured on the same cases before it is published.

**Analogy.** The audit checks that the procedure exists (structure); the backtest checks that it gives the right results (behaviour).

**The mechanism.**

```python
source = inspect.getsource(self.ao.build_policy_agent)
tree = ast.parse(source)
uses_pool = any(isinstance(node, ast.Name) and node.id == 'ThreadPoolExecutor'
                for node in ast.walk(tree))

for expected, source, text in CASES:
    r = RUNTIME.apply_guardrail(guardrailIdentifier=..., guardrailVersion=version,
                                source=source, content=[{'text': {'text': text}}])
    got = 'BLOCKED' if r['action'] == 'GUARDRAIL_INTERVENED' else 'ALLOWED'
    ok += got == expected                          # True counts as 1
```

**Input → output.** Replayed on `build_policy_agent`: `ThreadPoolExecutor` found, `1` call to `submit`. Three cases, two right → `2/3`. In the project: `tests/test_agent.py all` → 120/120; adversarial tests → 5 attacks out of 5 blocked with the right policy, the maths question allowed ($134.96).

**Where to read it again.** [`test_agent.py · TestTask2`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/tests/test_agent.py#L109) · [`test_agent.py · ast.walk`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/tests/test_agent.py#L282) · [`tune_guardrail.py · _evaluate`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/scripts/tune_guardrail.py#L100) · [`adversarial_test.py · apply_guardrail`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/scripts/adversarial_test.py#L77).

**To reuse.** A fixed set of cases (allowed and blocked) written before tuning. Measure on the DRAFT version, publish only the best one. Keep the evaluation reports in `evidence/`.

## In the field

The chapters of my courses and my projects where these mechanisms run for real.

- [Dev3Pack, Final assignment](/en/books/dev3pack/final/): card 59.
- [Dev3Pack, Gecko capstone](/en/books/dev3pack/gecko/): card 59.
- [AWS Scholars, chapter 3 · NovaMart Multi-Agent Support](/en/books/aws-scholars/chapter-03/): card 60.
- [DRILLS.ai, chapter 4 · Phase 1: agents that make exercises](/en/books/drills-ai/chapter-04/): card 60.
- [DRILLS.ai, chapter 11 · Incidents, measurements and limits](/en/books/drills-ai/chapter-11/): card 59.
