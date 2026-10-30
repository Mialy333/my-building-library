---
workedOn: 2026-10-26
---

DRILLS.ai is the tool I built during the OpenAI DevDay hackathon, in the Impact → New Opportunities → Jobs category. It helps career changers land their first Agent Engineer interviews. It links their experience to the requirements of a job posting, then prepares an application that they review, edit and send themselves.

<figure class="shot"><img src="/drills/home-en.jpg" alt="The DRILLS.ai home page, with the button to start an application." width="1363" height="936" loading="lazy" decoding="async"><figcaption>The DRILLS.ai home page, screenshot from October 25, 2026, with a fictional example.</figcaption></figure>

## The concept

An application tool has to say what it guarantees, and what it does not. The MVP contract sets the inputs, the outputs, the place of the human, and what stays out of the contract.

## The starting problem

After about ten years in capital markets, I switched to software development, then to Agent Engineering: Ada Tech School, then the Future Agent Engineer program by Udacity and AWS. The problem was not learning one more technology. It was knowing what to do with my whole path: experience, courses, projects, domain knowledge, and technical skills still being built.

Three questions come back with every posting:

1. Does my profile bring relevant evidence for this posting?
2. Which requirements really matter, and which ones still need clarifying?
3. What next action makes my application more credible?

The target: career changers who already have development basics and projects. They are not starting from zero. But they must not present their years in another job as years of engineering. The roles in scope: internship, work-study or apprenticeship, and first job building AI agents. The job title is not enough: the duties and the expected level matter.

## The promise changed twice

<figure class="diagram"><svg viewBox="0 0 340 306" role="img" aria-labelledby="d-promise-en-t"><title id="d-promise-en-t">How the DRILLS.ai promise changed</title><rect class="d-box" x="20" y="8" width="300" height="72" rx="10"/><text class="d-s" x="170" y="30" text-anchor="middle">INITIAL PROTOTYPE</text><text class="d-t" x="170" y="47" text-anchor="middle">Learn and practise</text><text class="d-t" x="170" y="64" text-anchor="middle">with targeted coding exercises</text><polyline class="d-l" points="170,80 170,110"/><polygon class="d-head" points="170,110 173.6,103.0 166.4,103.0"/><rect class="d-box" x="20" y="110" width="300" height="72" rx="10"/><text class="d-s" x="170" y="132" text-anchor="middle">INTERMEDIATE PIVOT</text><text class="d-t" x="170" y="149" text-anchor="middle">Assess your profile, prepare</text><text class="d-t" x="170" y="166" text-anchor="middle">application and interviews</text><polyline class="d-l d-acc" points="170,182 170,212"/><polygon class="d-head d-acc" points="170,212 173.6,205.0 166.4,205.0"/><rect class="d-key" x="20" y="212" width="300" height="72" rx="10"/><text class="d-s" x="170" y="234" text-anchor="middle">FINAL MVP</text><text class="d-t" x="170" y="251" text-anchor="middle">Prepare an application</text><text class="d-t" x="170" y="268" text-anchor="middle">to land your first interviews</text><text class="d-s d-halo d-a" x="180" y="201" text-anchor="start">− interview prep removed</text></svg><figcaption>The promise changed twice. Interview preparation was built, then removed from the public journey.</figcaption></figure>

| Version | Promise | What the product contained |
| --- | --- | --- |
| Initial prototype | Learn and practise with targeted coding exercises | Roadmap, exercise generation, validation, progress, companion |
| Intermediate pivot | Assess your profile, prepare application and interviews | CV, matching, audio pitch, feedback, fixed technical exercises |
| Final MVP | Prepare an application to land your first interviews | Profile → opportunities → assessment → documents → application on the original site, and tracking |

I built interview preparation, then removed it from the public journey. It is a scope decision: getting all the way to the application mattered more than adding features. "Land your first interviews" describes the product's goal, not a guaranteed result.

## The MVP contract

| Item | Contract |
| --- | --- |
| Input | Typed profile or PDF CV, full text of a posting, FR or EN, consent; GitHub and application conditions optional |
| Profile | At least 50 characters, at most 16,000 in the analysis request, conditions included |
| Posting | 50 to 20,000 characters; a link alone does not replace the text |
| PDF | 4 MiB at most; extraction to review; no retyping after a successful import |
| Assessment | Role, scope, requirements, evidence, explanations, next actions, score when it can be computed |
| Documents | CV sections and a personal pitch, editable before export |
| Final action | HTTPS link to the original posting or form; the candidate sends it themselves |
| Tracking | Analysed postings, declared statuses, sending date, notes |
| Human control | Fact review, wording fixes, confirmation before export, declaring the sending |
| Out of contract | Hiring probability, skill certification, administrative checks, automatic sending |

**The AI call budget.** Extracting a PDF can skip AI. The analysis makes one call, with at most one corrective attempt if a piece of evidence is rejected. Drafting, requested later, has its own call and at most one correction. Each operation is capped by the API timeout. So it is not "a single call for the whole journey".

## What is delivered

| Deliverable | Where | Status |
| --- | --- | --- |
| Bilingual app | GitHub Pages, `/fr/` and `/en/` | Delivered |
| Business API | `api/main.py`, Render | Delivered, tried on October 26 |
| Application agent | `src/ai_generator/application.py` | Delivered |
| Job search | `src/integrations/jobs.py` | Delivered, limited coverage |
| GitHub repo preview | `src/lib/github-project.ts` | Delivered |
| CV editing and export | `src/lib/cv-editor.ts`, `cv-layout.ts` | Delivered |
| Application tracking | `application-history.ts`, tracking page | Delivered |
| MCP surface | `api/mcp_app.py` | Implemented; a client connection to check separately |
| Tests and CI | `tests/`, `.github/workflows/` | 120 Python tests and 70 frontend tests passed on October 26 |
| Documentation | README, `docs/BRANCHES.md`, `docs/images/` | Delivered |
| Video | YouTube | Published |
| Effect on applications | Tests with real candidates | To run |

## How I worked

ChatGPT and Codex assisted me with design, code and iterations. So DRILLS.ai is not code written without tools. That development help is one thing; the OpenAI calls the app makes for candidates are another.

A project base existed before the pivot. The hackathon weekend transformed the product and produced a working candidate journey: it is not accurate to say the whole repository was born from scratch in those two days.

## What I keep

- Writing what is out of the contract matters as much as what is in it.
- Removing a feature already built can be the right decision.
- A goal is not a guarantee: no hiring result is claimed.

## The defense question

> Does the score measure a chance of being hired?

No. It measures the share of the requirements extracted from the posting that the profile documents. Hiring probability is explicitly out of the contract.
