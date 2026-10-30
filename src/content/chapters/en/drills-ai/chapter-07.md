---
workedOn: 2026-10-26
---

The model qualifies the requirements. The percentage and the decision are computed in Python. This chapter gives the exact formula, an example, and what the score does not say.

## The concept

A score is computed by a formula you can explain and test. You do not ask the model for a percentage.

## The formula

The score only takes requirements of kind `skill`.

| Priority | Weight | Evidence status | Credit |
| --- | ---: | --- | ---: |
| `core` | 3 | `documented` | 1 |
| `important` | 2 | `partial` | 0.5 |
| `supporting` | 1 | `not_documented` | 0 |

```text
score = round(100 × sum(weight × credit) / sum(weight))
```

**A teaching example**, not a real candidate: core Python, documented (3 × 1), important API integration, partial (2 × 0.5), supporting framework, not documented (1 × 0). The score is `round(100 × 4/6) = 67`.

## The decision

<figure class="diagram"><svg viewBox="0 0 340 458" role="img" aria-labelledby="d-score-en-t"><title id="d-score-en-t">From the assessment to the decision</title><rect class="d-box" x="40" y="8" width="280" height="46" rx="10"/><text class="d-t" x="180" y="28.5" text-anchor="middle">Requirements extracted by the model</text><text class="d-s" x="180" y="42.5" text-anchor="middle">kind · priority · evidence status</text><polyline class="d-l" points="180,54 180,84"/><polygon class="d-head" points="180,84 183.6,77.0 176.4,77.0"/><rect class="d-box d-qbox" x="40" y="92" width="280" height="56" rx="10"/><text class="d-t" x="180" y="116" text-anchor="middle">Role in scope and</text><text class="d-t" x="180" y="133" text-anchor="middle">skills to assess?</text><polyline class="d-l" points="40,120 26,120 26,392"/><polygon class="d-head" points="26,392 29.6,385.0 22.4,385.0"/><text class="d-s d-halo" x="30" y="112" text-anchor="start">no</text><polyline class="d-l" points="180,148 180,186"/><polygon class="d-head" points="180,186 183.6,179.0 176.4,179.0"/><text class="d-s d-halo" x="186" y="172" text-anchor="start">yes</text><rect class="d-box" x="40" y="186" width="280" height="46" rx="10"/><text class="d-s" x="180" y="205" text-anchor="middle">round(100 × Σ weight×credit / Σ weight)</text><text class="d-s" x="180" y="219" text-anchor="middle">skills only · computed in Python</text><polyline class="d-l" points="180,232 180,264"/><polygon class="d-head" points="180,264 183.6,257.0 176.4,257.0"/><rect class="d-box d-qbox" x="40" y="264" width="280" height="56" rx="10"/><text class="d-t" x="180" y="288" text-anchor="middle">≥ 60, core skills and</text><text class="d-t" x="180" y="305" text-anchor="middle">conditions documented?</text><polyline class="d-l" points="170,320 170,392"/><polygon class="d-head" points="170,392 173.6,385.0 166.4,385.0"/><text class="d-s d-halo" x="176" y="360" text-anchor="start">no</text><polyline class="d-l d-acc" points="290,320 290,392"/><polygon class="d-head d-acc" points="290,392 293.6,385.0 286.4,385.0"/><text class="d-s d-halo" x="296" y="360" text-anchor="start">yes</text><rect class="d-box" x="8" y="392" width="104" height="56" rx="10"/><text class="d-m" x="60" y="417" text-anchor="middle">review_scope</text><text class="d-s" x="60" y="431" text-anchor="middle">no score</text><rect class="d-box" x="118" y="392" width="104" height="56" rx="10"/><text class="d-m" x="170" y="417" text-anchor="middle">strengthen</text><text class="d-s" x="170" y="431" text-anchor="middle">add evidence</text><rect class="d-key" x="228" y="392" width="104" height="56" rx="10"/><text class="d-m" x="280" y="417" text-anchor="middle">prepare</text><text class="d-s" x="280" y="431" text-anchor="middle">prepare docs</text></svg><figcaption>The model qualifies the requirements; the percentage and the decision are computed by calculate_match(), in Python.</figcaption></figure>

- `review_scope`: no score, if the role is out of scope or uncertain, or if there is no skill to assess.
- `prepare`: the score reaches 60, every `core` skill is documented, and so is every eligibility condition.
- `strengthen`: every other case where a score exists.

So the 60 threshold is not enough if a core skill or an eligibility condition remains undocumented. Even then, the candidate can still prepare their documents.

From the repository (code written with the help of ChatGPT and Codex):

```python
def calculate_match(requirements: list[Requirement], scope: str) -> tuple[int | None, str]:
    skills = [item for item in requirements if item.kind == "skill"]
    weights = {"core": 3, "important": 2, "supporting": 1}
    coverage = {"documented": 1, "partial": 0.5, "not_documented": 0}
    total = sum(weights[item.priority] for item in skills)
    score = round(100 * sum(weights[item.priority] * coverage[item.status] for item in skills) / total) if total else None
    if scope != "in_scope":
        score = None
    unresolved_core = any(item.priority == "core" and item.status != "documented" for item in skills)
    unresolved_eligibility = any(item.kind == "eligibility" and item.status != "documented" for item in requirements)
    decision = "review_scope" if score is None else (
        "prepare" if score >= 60 and not unresolved_core and not unresolved_eligibility else "strengthen"
    )
    return score, decision
```

## What the screen must show

The score and the conditions are shown together. A 0 is shown as 0. A condition to check does not erase the percentage: that was a bug, fixed on October 26. An out-of-scope role does not get an invented percentage to fill the screen.

## The reproducibility limit

The formula is deterministic for a given list of requirements. But extracting the requirements, their priority and their status come from the model, and can change from one analysis to the next. The threshold and the weights are heuristics, not a validated business grid.

## What I keep

- The model judges, code computes: the formula can be tested without a network.
- A skill and an administrative condition are not mixed in one number.
- It is a coverage score: it measures documented coverage, never a chance of being hired.

## The defense question

> Why doesn't a high score settle an internship condition?

Because eligibility conditions are not in the score: only skills are. An undocumented condition blocks the `prepare` decision, whatever the percentage.

> What can still vary from one run to the next?

The requirements themselves: their list, priority and status come from the model. The formula does not.
