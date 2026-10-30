---
workedOn: 2026-10-26
---

On Sunday, October 25, I moved the starting point: start from the candidate and the posting, rather than from a learning program. This chapter follows the journey that came out of it, from importing the CV to choosing the posting.

## The concept

Each step must lead to the next without making the candidate redo what they already gave. And each outside source (PDF, GitHub, job boards) is read with its limits, without drawing more from it than it says.

## The four-step journey

<figure class="diagram"><svg viewBox="0 0 340 392" role="img" aria-labelledby="d-journey-en-t"><title id="d-journey-en-t">The four-step candidate journey</title><rect class="d-box" x="10" y="8" width="252" height="54" rx="10"/><text class="d-t" x="136" y="32.5" text-anchor="middle">1 · Profile</text><text class="d-s" x="136" y="46.5" text-anchor="middle">PDF or typed → editable text</text><polyline class="d-l" points="136,62 136,82"/><polygon class="d-head" points="136,82 139.6,75.0 132.4,75.0"/><rect class="d-box" x="10" y="82" width="252" height="54" rx="10"/><text class="d-t" x="136" y="106.5" text-anchor="middle">2 · Opportunities</text><text class="d-s" x="136" y="120.5" text-anchor="middle">search or pasted posting</text><polyline class="d-l" points="136,136 136,156"/><polygon class="d-head" points="136,156 139.6,149.0 132.4,149.0"/><rect class="d-box" x="10" y="156" width="252" height="54" rx="10"/><text class="d-t" x="136" y="180.5" text-anchor="middle">3 · Assessment</text><text class="d-s" x="136" y="194.5" text-anchor="middle">evidence, conditions, actions</text><polyline class="d-l" points="136,210 136,230"/><polygon class="d-head" points="136,230 139.6,223.0 132.4,223.0"/><rect class="d-box" x="10" y="230" width="252" height="54" rx="10"/><text class="d-t" x="136" y="254.5" text-anchor="middle">4 · Documents</text><text class="d-s" x="136" y="268.5" text-anchor="middle">editable CV and pitch</text><polyline class="d-l d-acc" points="136,284 136,304"/><polygon class="d-head d-acc" points="136,304 139.6,297.0 132.4,297.0"/><rect class="d-key" x="10" y="304" width="252" height="54" rx="10"/><text class="d-t" x="136" y="328.5" text-anchor="middle">Original site</text><text class="d-s" x="136" y="342.5" text-anchor="middle">the candidate applies there</text><rect class="d-ghost" x="276" y="8" width="56" height="276" rx="12"/><text class="d-s" x="304" y="146" text-anchor="middle" transform="rotate(-90 304 146)">APPLICATION TRACKING</text></svg><figcaption>Four steps, then the link to the original posting. Tracking is a separate page, open at any time.</figcaption></figure>

| Step | Action | Expected answer |
| --- | --- | --- |
| Profile | Import a PDF or type your experience | A reusable, editable text |
| Opportunities | Search or paste a posting | The full description and its original link |
| Assessment | Run the comparison | Skills documented, partial or not documented, conditions apart, next actions |
| Documents | Request then edit CV and pitch | Drafts based on the profile, export, access to the site to apply |

The first idea: above 60% matching, prepare; below, work on the gaps. The final code is more careful (see [chapter 7](/en/books/drills-ai/chapter-07/)). Tracking is a page of its own; interview preparation is no longer a fifth step.

## Importing the CV without typing it twice

First problem reported: importing a CV still asked you to write out your path, or only returned the extracted text, with no assessment. The chain now reuses the imported text.

<figure class="shot"><img src="/drills/profile-en.jpg" alt="The Profile screen: importing a PDF CV and editable profile text." width="1348" height="926" loading="lazy" decoding="async"><figcaption>The Profile step: the imported CV becomes editable text. Screenshot from October 25, 2026, fictional example.</figcaption></figure>

<figure class="diagram"><svg viewBox="0 0 340 430" role="img" aria-labelledby="d-pdf-en-t"><title id="d-pdf-en-t">Importing a PDF CV</title><rect class="d-box" x="20" y="8" width="300" height="50" rx="10"/><text class="d-t" x="170" y="30.5" text-anchor="middle">PDF + consent</text><text class="d-s" x="170" y="44.5" text-anchor="middle">4 MiB at most</text><polyline class="d-l" points="170,58 170,82"/><polygon class="d-head" points="170,82 173.6,75.0 166.4,75.0"/><rect class="d-box" x="20" y="82" width="300" height="62" rx="10"/><text class="d-t" x="170" y="103.5" text-anchor="middle">Local extraction (pypdf)</text><text class="d-s" x="170" y="117.5" text-anchor="middle">subprocess · 4 s · 3 s CPU</text><text class="d-s" x="170" y="131.5" text-anchor="middle">256 MiB · 1 to 10 pages</text><polyline class="d-l" points="120,144 120,170"/><polygon class="d-head" points="120,170 123.6,163.0 116.4,163.0"/><polygon class="d-box" points="120,170.0 220.0,206 120,242.0 20.0,206"/><text class="d-t" x="120" y="202" text-anchor="middle">Usable</text><text class="d-t" x="120" y="219" text-anchor="middle">text?</text><rect class="d-box" x="236" y="182" width="96" height="48" rx="10"/><text class="d-t" x="284" y="203.5" text-anchor="middle">AI fallback</text><text class="d-s" x="284" y="217.5" text-anchor="middle">PDF → OpenAI</text><polyline class="d-l" points="220,206 236,206"/><polygon class="d-head" points="236,206 229.0,202.4 229.0,209.6"/><text class="d-s d-halo" x="228" y="196" text-anchor="middle">no</text><polyline class="d-l" points="120,242 120,284"/><polygon class="d-head" points="120,284 123.6,277.0 116.4,277.0"/><text class="d-s d-halo" x="128" y="268" text-anchor="start">yes</text><polyline class="d-l d-dash" points="284,230 284,284"/><polygon class="d-head" points="284,284 287.6,277.0 280.4,277.0"/><rect class="d-key" x="20" y="284" width="300" height="50" rx="10"/><text class="d-t" x="170" y="306.5" text-anchor="middle">The text fills the profile</text><text class="d-s" x="170" y="320.5" text-anchor="middle">no typing it twice</text><polyline class="d-l" points="170,334 170,362"/><polygon class="d-head" points="170,362 173.6,355.0 166.4,355.0"/><rect class="d-box" x="20" y="362" width="300" height="50" rx="10"/><text class="d-t" x="170" y="384.5" text-anchor="middle">The candidate reviews it</text><text class="d-s" x="170" y="398.5" text-anchor="middle">then moves to opportunities</text></svg><figcaption>Since October 26: text extraction comes first, with no model call. The AI fallback only runs when the text is not usable.</figcaption></figure>

The `pypdf` extraction runs in a subprocess: 4 seconds of wall time at most, 3 seconds of CPU, 256 MiB of memory, 1 to 10 pages for the fast path. Pages with little text, some invalid glyphs, encrypted documents and texts that are too long are refused by this path: they go to the AI fallback. From the repository (code written with the help of ChatGPT and Codex):

```python
resource.setrlimit(resource.RLIMIT_AS, (256 * 1024 * 1024, 256 * 1024 * 1024))
resource.setrlimit(resource.RLIMIT_CPU, (3, 3))
```

These bounds reduce risk and waiting. They do not guarantee the reading order of a multi-column PDF. And the server currently requires a configured OpenAI key before the operation, even when the text path is enough.

## GitHub: enrich without over-reading

The browser accepts the URL of a public GitHub repository and reads its metadata: name, description, main language, fork or not. It then asks the candidate to state their contribution.

It is not a code audit, not a commit analysis, not proof of authorship. The repository's content is not run. Arbitrary URLs, private repositories and unexpected parameters are out of the contract.

## Job postings: what is really connected

<figure class="shot"><img src="/drills/opportunities-en.jpg" alt="The Opportunities screen: searching postings or pasting one." width="1363" height="936" loading="lazy" decoding="async"><figcaption>The Opportunities step: search a posting or paste one with its link. Screenshot from October 25, 2026, fictional example.</figcaption></figure>

| Source | Configured boards |
| --- | --- |
| Greenhouse | Anthropic, Databricks, Scale AI |
| Ashby | Mistral AI, Dust |

The adapters read the public APIs, clean the HTML, deduplicate by URL and cap the list at 60 postings. Reads run in parallel, with a 12-second network timeout. A complete answer can stay cached for 300 seconds. **A source that is down is never disguised as "no postings"**: that would be a silent failure.

The filter works on words: the title must target an entry level (internship, junior, work-study…), an engineering job, and the text must talk about agents. Senior, staff, principal, lead, manager, director and head titles are excluded.

```python
if re.search(r'\b(senior|staff|principal|lead|manager|director|head)\b', title, re.I): return None
```

This filter can miss a good posting or keep an imperfect one. What is not delivered: an exhaustive market database, ranking postings by profile, LinkedIn, or automatically reading any URL. The other path remains pasting the full text of a posting.

## Removing interviews

An intermediate version recorded the pitch in the browser, had it transcribed by the OpenAI API, and gave feedback on clarity, evidence and relevance. Technical preparation moved to cases written in advance, with explicit rubrics (including Python debugging and refactoring). A teaching rubric is not proof of a question a company really asks.

I removed this preparation from the journey. The `/api/interview/transcribe`, `/api/interview/feedback` and `/api/interview/technical` routes return 410 for a valid request, and the `prepare` page redirects to the application.

## What I keep

- A successful import is not the end of the expected action: it must lead to the assessment.
- A source says no more than what it contains: GitHub metadata does not prove a contribution.
- An outage is shown as an outage.

## The Python mechanisms

- [My Python for AI 101, chapter 11 · Deploying and tooling](/en/books/python-for-ai-101/chapter-11/): card 53, `subprocess`, here with memory and CPU limits.
- [My Python for AI 101, chapter 7 · Errors and guardrails](/en/books/python-for-ai-101/chapter-07/): card 31, the degraded fallback (failed extraction returns `None`, and the AI fallback takes over).
- [My Python for AI 101, chapter 5 · Text](/en/books/python-for-ai-101/chapter-05/): card 18, the regular expressions of the job filter.
- [My Python for AI 101, chapter 10 · Network, time and concurrency](/en/books/python-for-ai-101/chapter-10/): card 48, checking that a link really is `https` before keeping it.

## The defense question

> Does the GitHub link prove the candidate wrote the project?

No. I read public metadata: name, description, language, fork. The contribution is stated by the candidate.
