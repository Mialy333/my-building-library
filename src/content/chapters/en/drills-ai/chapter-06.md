---
workedOn: 2026-10-26
---

The assessment compares a profile with a posting. The model identifies the requirements and links evidence to them. The danger: reworded, or invented, quotes that look as if they came from the CV.

## The concept

The model does not copy a quote: it picks the ID of an excerpt from a list imposed by the schema. Code then puts the original passage back in its place.

<figure class="shot"><img src="/drills/assessment-en.jpg" alt="The Assessment screen of a fictional example, with requirements and their evidence." width="1348" height="926" loading="lazy" decoding="async"><figcaption>A fictional assessment, captured on October 25, 2026, before the October 26 fix that keeps the score visible next to a condition to check. It is not the current interface.</figcaption></figure>

## The sequence

<figure class="diagram"><svg viewBox="0 0 340 576" role="img" aria-labelledby="d-seq-en-t"><title id="d-seq-en-t">Sequence of the assessment, then the drafting</title><rect class="d-box" x="4.0" y="6" width="80" height="28" rx="8"/><text class="d-m" x="44" y="24" text-anchor="middle">UI</text><line class="d-l d-dash d-life" x1="44" y1="34" x2="44" y2="570"/><rect class="d-box" x="92.0" y="6" width="80" height="28" rx="8"/><text class="d-m" x="132" y="24" text-anchor="middle">FastAPI</text><line class="d-l d-dash d-life" x1="132" y1="34" x2="132" y2="570"/><rect class="d-box" x="178.0" y="6" width="80" height="28" rx="8"/><text class="d-m" x="218" y="24" text-anchor="middle">OpenAI</text><line class="d-l d-dash d-life" x1="218" y1="34" x2="218" y2="570"/><rect class="d-box" x="258.0" y="6" width="80" height="28" rx="8"/><text class="d-m" x="298" y="24" text-anchor="middle">Python</text><line class="d-l d-dash d-life" x1="298" y1="34" x2="298" y2="570"/><polyline class="d-l" points="44,58 132,58"/><polygon class="d-head" points="132,58 125.0,54.4 125.0,61.6"/><text class="d-s d-halo" x="50" y="53" text-anchor="start">profile, posting, language, consent</text><polyline class="d-l" points="132,82 150,82 150,92 136,92"/><polygon class="d-head" points="136,92 143.0,95.6 143.0,88.4"/><text class="d-s d-halo" x="156" y="90" text-anchor="start">numbered excerpts + schema</text><polyline class="d-l" points="132,118 218,118"/><polygon class="d-head" points="218,118 211.0,114.4 211.0,121.6"/><text class="d-s d-halo" x="138" y="113" text-anchor="start">choose references, analyse</text><polyline class="d-l d-dash" points="218,148 132,148"/><polygon class="d-head" points="132,148 139.0,151.6 139.0,144.4"/><text class="d-s d-halo" x="138" y="143" text-anchor="start">structured requirements</text><polyline class="d-l" points="132,178 298,178"/><polygon class="d-head" points="298,178 291.0,174.4 291.0,181.6"/><text class="d-s d-halo" x="138" y="173" text-anchor="start">resolve the IDs, check</text><rect class="d-frame" x="118" y="190" width="194" height="126" rx="6"/><text class="d-s d-halo d-a" x="124" y="202" text-anchor="start">if a fixable evidence error</text><polyline class="d-l d-dash" points="298,222 132,222"/><polygon class="d-head" points="132,222 139.0,225.6 139.0,218.4"/><text class="d-s d-halo" x="138" y="217" text-anchor="start">error code</text><polyline class="d-l" points="132,252 218,252"/><polygon class="d-head" points="218,252 211.0,248.4 211.0,255.6"/><text class="d-s d-halo" x="138" y="247" text-anchor="start">one corrective attempt</text><polyline class="d-l d-dash" points="218,282 132,282"/><polygon class="d-head" points="132,282 139.0,285.6 139.0,278.4"/><text class="d-s d-halo" x="138" y="277" text-anchor="start">new selection</text><polyline class="d-l" points="132,312 298,312"/><polygon class="d-head" points="298,312 291.0,308.4 291.0,315.6"/><text class="d-s d-halo" x="138" y="307" text-anchor="start">new validation</text><polyline class="d-l d-dash" points="298,342 132,342"/><polygon class="d-head" points="132,342 139.0,345.6 139.0,338.4"/><text class="d-s d-halo" x="138" y="337" text-anchor="start">checked result or error</text><polyline class="d-l d-acc d-dash" points="132,372 44,372"/><polygon class="d-head d-acc" points="44,372 51.0,375.6 51.0,368.4"/><text class="d-s d-halo" x="50" y="367" text-anchor="start">assessment + score if computable</text><line class="d-l d-dash" x1="8" y1="396" x2="332" y2="396"/><text class="d-s d-halo d-a" x="170" y="392" text-anchor="middle">later, on request</text><polyline class="d-l" points="44,420 132,420"/><polygon class="d-head" points="132,420 125.0,416.4 125.0,423.6"/><text class="d-s d-halo" x="50" y="415" text-anchor="start">request documents</text><polyline class="d-l" points="132,450 218,450"/><polygon class="d-head" points="218,450 211.0,446.4 211.0,453.6"/><text class="d-s d-halo" x="138" y="445" text-anchor="start">draft from the kept assessment</text><polyline class="d-l d-dash" points="218,480 132,480"/><polygon class="d-head" points="132,480 139.0,483.6 139.0,476.4"/><text class="d-s d-halo" x="138" y="475" text-anchor="start">CV sections + pitch</text><polyline class="d-l" points="132,510 298,510"/><polygon class="d-head" points="298,510 291.0,506.4 291.0,513.6"/><text class="d-s d-halo" x="138" y="505" text-anchor="start">check the sources</text><polyline class="d-l d-acc d-dash" points="132,540 44,540"/><polygon class="d-head d-acc" points="44,540 51.0,543.6 51.0,536.4"/><text class="d-s d-halo" x="50" y="535" text-anchor="start">drafts to review</text></svg><figcaption>Two separate calls: the assessment first, the drafting later. Each has at most one corrective attempt. &quot;Python&quot; means the reference validation and the score computation.</figcaption></figure>

## Split, choose, restore

1. **Split.** `source_excerpts()` cuts the profile and the posting into windows of at most 600 characters, with a step of 500: two neighbouring windows overlap.
2. **Constrain.** The IDs (`profile_0`, `job_0`…) are imposed in the selection schema: the model cannot invent one, or mix the sources.
3. **Restore.** `resolve_selection()` replaces each chosen ID with the original passage, then checks it is there.

From the repository (code written with the help of ChatGPT and Codex):

```python
def source_excerpts(text: str, prefix: str) -> dict[str, str]:
    """Bounded overlapping slices, each preserved verbatim from the approved input."""
    excerpts = {}
    for start in range(0, len(text), 500):
        excerpt = text[start:start + 600].strip()
        if len(excerpt) >= 8:
            excerpts[f"{prefix}_{len(excerpts)}"] = excerpt
    return excerpts
```

More rules follow. A `not_documented` item must not carry a candidate quote. Two requirements with the same name are rejected. On a fixable evidence error, one corrective retry is made; after that, the error goes up with a code (`candidate_quote:0`, for example), never with the CV's text.

This fixed the reworded quotes, which caused rejections and 502 errors. It does not check that the chosen passage really shows the skill, or that the CV tells the truth.

## Inputs are data

The CV and the posting are treated as data, never as instructions. A posting can contain a sentence that looks like an order. Instructions against prompt injection are not enough alone: the model's limited scope, never running candidate code, constrained references and human review each reduce a different risk.

Consent is enforced by the type: `consent: Literal[True]`. A request without agreement is rejected before any call. Requests to the Responses API go out with `store=False`, which does not mean "no retention at the provider".

## Residence and right to work

The profile can state a country of residence, a country concerned by the right to work, and a declared status: unknown, yes, restricted, or sponsorship needed.

Living in France is not enough to establish a right to work. Nationality never becomes a factor of the technical score. A declaration documents a declared condition; it is not an administrative check, and it does not settle an internship-agreement or graduation-date requirement.

## What I keep

- The less the model writes, the less there is to check: it chooses, code copies.
- The grounding checked here is textual: the reference exists, but does it prove the skill?
- The correction is capped at one attempt, to explain a failure without an endless loop.

## The Python mechanisms

- [My Python for AI 101, chapter 3 · Data](/en/books/python-for-ai-101/chapter-03/): card 61, the strict Pydantic model and the `Literal[True]` consent; card 62, the schema built at runtime that only accepts existing IDs.
- [My Python for AI 101, chapter 5 · Text](/en/books/python-for-ai-101/chapter-05/): card 63, the overlapping windows of `source_excerpts()`.
- [My Python for AI 101, chapter 7 · Errors and guardrails](/en/books/python-for-ai-101/chapter-07/): card 30, an exception (`EvidenceError`) caught and turned into a safe answer, with a code and no personal text.
- [My Python for AI 101, chapter 5 · Text](/en/books/python-for-ai-101/chapter-05/): card 21, strict JSON, to compare with the Pydantic schema of Structured Outputs.

## The defense question

> Why not ask the model to copy a quote freely?

Because it rewords it. An altered quote can no longer be found in the CV, and validation rejects it. By choosing an ID, the model can only point to a passage that exists; code puts back the exact text.

> Does valid JSON guarantee a true analysis?

No. The schema guarantees the shape. The meaning of a requirement and the relevance of a piece of evidence still need reviewing.
