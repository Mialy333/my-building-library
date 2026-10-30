---
---

## The principle

Give the model the autonomy the task needs, no more. When the steps are known, code chains them. And an action that commits someone (sending, paying, publishing) is confirmed by a human, or checked by code before it exists.

## Why it matters

Every decision left to the model costs calls, and opens failures that then have to be checked. Calling a component an "agent" does not say what it decides. And an action taken on someone's behalf cannot always be undone: an application sent, a payment signed.

## The mechanism

<figure class="diagram"><svg viewBox="0 0 340 352" role="img" aria-labelledby="d-ladder-en-t"><title id="d-ladder-en-t">Dosing an agent&#x27;s autonomy</title><rect class="d-box" x="48" y="8" width="284" height="62" rx="10"/><text class="d-t" x="190" y="36.5" text-anchor="middle">Fixed chain</text><text class="d-s" x="190" y="50.5" text-anchor="middle">code decides every step</text><polyline class="d-l" points="190,70 190,94"/><polygon class="d-head" points="190,94 193.6,87.0 186.4,87.0"/><rect class="d-box" x="48" y="94" width="284" height="62" rx="10"/><text class="d-t" x="190" y="122.5" text-anchor="middle">App-driven workflow</text><text class="d-s" x="190" y="136.5" text-anchor="middle">the model analyses or drafts at one step</text><polyline class="d-l" points="190,156 190,180"/><polygon class="d-head" points="190,180 193.6,173.0 186.4,173.0"/><rect class="d-box" x="48" y="180" width="284" height="62" rx="10"/><text class="d-t" x="190" y="208.5" text-anchor="middle">Agent loop</text><text class="d-s" x="190" y="222.5" text-anchor="middle">the model picks the next tool</text><polyline class="d-l" points="190,242 190,266"/><polygon class="d-head" points="190,266 193.6,259.0 186.4,259.0"/><rect class="d-key" x="48" y="266" width="284" height="62" rx="10"/><text class="d-t" x="190" y="294.5" text-anchor="middle">Action that commits</text><text class="d-s" x="190" y="308.5" text-anchor="middle">a human confirms, or code checks</text><polyline class="d-l d-acc" points="18,12 18,334"/><polygon class="d-head d-acc" points="18,334 21.6,327.0 14.4,327.0"/><text class="d-s d-a" x="30" y="176" text-anchor="middle" transform="rotate(-90 30 176)">more autonomy, more checks</text></svg><figcaption>Each step gives the model more decisions, and calls for more checks. You only go up when the task needs it.</figcaption></figure>

1. **Ask what the agent really decides.** Picking the next tool, or only analysing and drafting at a step fixed by code?
2. **Take the lowest step that is enough.** A fixed chain or an app-driven workflow when the order of steps is known; a loop when the model really has to choose. Count the calls of each option.
3. **Read-only tools by default.** A tool that acts outside is justified by a real use, written down in an architecture decision.
4. **The last action goes to a human, or to a check in code.** The human reviews, corrects and confirms; or code compares the action with the pinned request before running it.
5. **Record the human action explicitly.** An opened link is not a sent application; the person declares the sending.
6. **Review the level of autonomy on evidence.** Go up a step when an evaluation shows a net gain, not because you can.

## In the field

- [Dev3Pack, Session 8](/en/books/dev3pack/session-08/): chain, loop or reflection. The chain costs one call, reflection two to three: count before you choose.
- [Dev3Pack, Gecko](/en/books/dev3pack/gecko/): the agent may pay, but only if every field matches the pinned request. Autonomy is granted, and bounded by code.
- [DRILLS.ai, chapter 2](/en/books/drills-ai/chapter-02/): `ApplicationAgent` carries the name of an agent, but the application drives the workflow. The model analyses and drafts; it does not browse, run anything or apply.
- [DRILLS.ai, chapter 8](/en/books/drills-ai/chapter-08/): the candidate reviews, edits, confirms the export and declares the sending.
- [DRILLS.ai, chapter 9](/en/books/drills-ai/chapter-09/): three read-only MCP tools. Giving an agent the power to apply was ruled out.

## The question to ask

> What does this agent decide on its own, and what happens if it is wrong?
