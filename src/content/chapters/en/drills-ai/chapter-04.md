---
workedOn: 2026-10-24
---

The first DRILLS was for learning and practice. A job posting fed a skills analysis, then a roadmap, then a targeted Python exercise. There was progress tracking, code in the browser and a companion.

## The concept

An exercise that looks right can be wrong, or test nothing. A validator has to separate what it checked from what it did not prove.

## The phase 1 pipeline

<figure class="diagram"><svg viewBox="0 0 340 520" role="img" aria-labelledby="d-pipe-en-t"><title id="d-pipe-en-t">Historical exercise-generation pipeline</title><rect class="d-box" x="40" y="8" width="260" height="50" rx="10"/><text class="d-t" x="170" y="37.5" text-anchor="middle">Job description</text><polyline class="d-l" points="170,58 170,80"/><polygon class="d-head" points="170,80 173.6,73.0 166.4,73.0"/><rect class="d-box" x="40" y="80" width="260" height="50" rx="10"/><text class="d-t" x="170" y="102.5" text-anchor="middle">AnalystAgent</text><text class="d-s" x="170" y="116.5" text-anchor="middle">skills</text><polyline class="d-l" points="170,130 170,152"/><polygon class="d-head" points="170,152 173.6,145.0 166.4,145.0"/><rect class="d-box" x="40" y="152" width="260" height="50" rx="10"/><text class="d-t" x="170" y="174.5" text-anchor="middle">CoachAgent</text><text class="d-s" x="170" y="188.5" text-anchor="middle">roadmap</text><polyline class="d-l" points="170,202 170,224"/><polygon class="d-head" points="170,224 173.6,217.0 166.4,217.0"/><rect class="d-box" x="40" y="224" width="260" height="50" rx="10"/><text class="d-t" x="170" y="246.5" text-anchor="middle">DrillCreatorAgent</text><text class="d-s" x="170" y="260.5" text-anchor="middle">exercise and harness</text><polyline class="d-l" points="170,274 170,296"/><polygon class="d-head" points="170,296 173.6,289.0 166.4,289.0"/><rect class="d-box" x="40" y="296" width="260" height="50" rx="10"/><text class="d-t" x="170" y="318.5" text-anchor="middle">ValidatorAgent</text><text class="d-s" x="170" y="332.5" text-anchor="middle">static checks + AI review</text><polyline class="d-l" points="170,346 170,364"/><polygon class="d-head" points="170,364 173.6,357.0 166.4,357.0"/><polygon class="d-box" points="170,364.0 280.0,400 170,436.0 60.0,400"/><text class="d-t" x="170" y="396" text-anchor="middle">Validation</text><text class="d-t" x="170" y="413" text-anchor="middle">accepted?</text><rect class="d-key" x="8" y="462" width="150" height="50" rx="10"/><text class="d-t" x="83" y="484.5" text-anchor="middle">Payload</text><text class="d-s" x="83" y="498.5" text-anchor="middle">to the browser</text><rect class="d-box" x="182" y="462" width="150" height="50" rx="10"/><text class="d-t" x="257" y="484.5" text-anchor="middle">Error</text><text class="d-s" x="257" y="498.5" text-anchor="middle">pipeline error</text><polyline class="d-l" points="60,400 40,400 40,462"/><polygon class="d-head" points="40,462 43.6,455.0 36.4,455.0"/><text class="d-s d-halo" x="44" y="428" text-anchor="start">yes</text><polyline class="d-l" points="280,400 300,400 300,462"/><polygon class="d-head" points="300,462 303.6,455.0 296.4,455.0"/><text class="d-s d-halo" x="296" y="428" text-anchor="end">no</text></svg><figcaption>Phase 1: DrillOrchestrator.generate() runs four specialised agents, always in the same order. This journey is no longer public.</figcaption></figure>

`DrillOrchestrator.generate()` is the orchestrator: it runs these steps deterministically: always the same order, without the model choosing what comes next. Each agent is specialised by its instructions and its output contract. No graph framework was needed for this chain.

The creator produced, among other things, `broken_code`, `fixed_solution` and `hidden_test_harness`. The risk: an exercise that looks right, but whose solution is wrong or whose test tells nothing apart.

## Hardening the validator

- AST parsing of the broken code, the solution and the test harness, without running them.
- A real assertion in the harness, not just the word "assert" in a string or a comment.
- Rejecting broken code identical to the solution.
- A non-empty roadmap.
- A roadmap that uses skills from the posting, and a last step that targets an analysed skill.
- Errors kept apart from warnings.
- An instruction to the model: never claim to have run the code.

Here is the assertion check, taken from the repository (code written with the help of ChatGPT and Codex):

```python
def _has_test_assertion(tree: ast.Module | None) -> bool:
    """Require a real assert statement or a pytest-style assert call in the AST."""
    if tree is None:
        return False
    for node in ast.walk(tree):
        if isinstance(node, ast.Assert):
            return True
        ...
    return False
```

`ast.walk` goes through the code's tree without running it. An `assert` written in a comment is not an `ast.Assert` node: it does not pass.

**The limit.** Passing these static checks does not prove the solution works. The validator says so itself, with a warning: the harness still has to run against both versions of the code.

## The discriminating harness

The behaviour tests then used fixed, trusted fixtures. The same harness must fail on a version known to be broken, and pass on the fixed version.

| Harness | Broken code | Fixed code | What it proves |
| --- | --- | --- | --- |
| Discriminating | Fails | Passes | The test sees the bug |
| Happy path only | Passes | Passes | Nothing about the bug |

The subprocess that runs these fixtures is not a production sandbox for generated code. The final MVP runs no candidate code.

## The companion and the teaching MCP pilot

This phase also explored progress with local resume, quizzes, feedback and lessons, a contextual companion (`MentorAgent`), a teaching MCP pilot (including a calculator), and many display tweaks.

That teaching MCP is not the opportunities MCP server added later. A technology explored for learning does not automatically become an integration of the candidate product.

## What this phase brought to the pivot

Mostly method: explicit contracts, validation before display, the difference between a static check and proof of execution, offline tests, a separate backend, error handling. Exercise generation left the public journey: `POST /api/drills` now returns 410 for a valid request.

## What I keep

- A green test can prove nothing: you have to see it fail on the bug.
- The validator says what it did not check, instead of letting you believe.
- A fixed chain of agents is enough when the order of steps is known.

## The Python mechanisms

- [My Python for AI 101, chapter 11 · Deploying and tooling](/en/books/python-for-ai-101/chapter-11/): card 55, reading code without running it with `ast`; card 53, `subprocess` to run the fixtures with a timeout.
- [My Python for AI 101, chapter 12 · Testing and evaluating](/en/books/python-for-ai-101/chapter-12/): card 60, testing the structure, then evaluating the behaviour.

## The defense question

> Can a green test prove nothing about the bug?

Yes. A harness limited to the happy path passes on the broken version and on the fixed one. I check that the same harness fails on one and passes on the other.

> Why doesn't static validation replace running the code?

It reads the code's shape: syntax, presence of an assertion, difference between the two versions. It does not say whether the solution gives the right result.
