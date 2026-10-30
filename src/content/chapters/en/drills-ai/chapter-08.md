---
workedOn: 2026-10-26
---

After the assessment come the documents: a CV and a personal pitch that the candidate reviews and edits. Then tracking: which postings, which status, which sending date. All without an account, in the browser.

## The concept

The human stays in charge of what goes out in their name. The system offers a draft; the candidate corrects it, confirms the export, and declares the sending themselves. Opening a link never counts as a sent application. This human-in-the-loop step is at the heart of the product.

## From a block of text to a CV

Feedback from the first tries led to:

- separating target title, profile, projects, experience, education and skills, when the data exists;
- keeping the dates, project names, contributions and results actually provided;
- avoiding generic phrases and invented qualities;
- offering bold, italic, underline, links and alignment, with Tiptap;
- fixing the formatting buttons, which did not toggle off;
- restoring sections in old drafts that had too little structure;
- keeping the edited document and its layout;
- asking for a review before export.

PDF export goes through the browser's print function. "ATS-friendly" describes an intent of readability and structure, not certified compatibility with every ATS. The written pitch is still available. A full cover letter and personalised outreach were in the first brief: they are not MVP deliverables.

## The dossier in the browser

<figure class="diagram"><svg viewBox="0 0 340 340" role="img" aria-labelledby="d-store-The same dossier in FR and EN-t"><title id="d-store-The same dossier in FR and EN-t">Where the candidate&#x27;s dossier lives</title><rect class="d-key" x="20" y="8" width="300" height="48" rx="10"/><text class="d-s" x="170" y="27" text-anchor="middle">dossier key</text><text class="d-m" x="170" y="43" text-anchor="middle">drills.application.v1</text><polyline class="d-l" points="110,56 90,94"/><polygon class="d-head" points="90,94 96.4,89.5 90.1,86.1"/><polyline class="d-l" points="230,56 250,94"/><polygon class="d-head" points="250,94 249.9,86.1 243.6,89.5"/><rect class="d-box" x="14" y="94" width="152" height="56" rx="10"/><text class="d-m" x="90" y="119" text-anchor="middle">sessionStorage</text><text class="d-s" x="90" y="133" text-anchor="middle">default · 1 day</text><rect class="d-box" x="174" y="94" width="152" height="56" rx="10"/><text class="d-m" x="250" y="119" text-anchor="middle">localStorage</text><text class="d-s" x="250" y="133" text-anchor="middle">opt-in · 30 days</text><polyline class="d-l" points="90,150 150,192"/><polygon class="d-head" points="150,192 146.3,185.0 142.2,190.9"/><polyline class="d-l" points="250,150 190,192"/><polygon class="d-head" points="190,192 197.8,190.9 193.7,185.0"/><rect class="d-box" x="20" y="192" width="300" height="50" rx="10"/><text class="d-t" x="170" y="214.5" text-anchor="middle">Read back and validated by Zod</text><text class="d-s" x="170" y="228.5" text-anchor="middle">expiry checked when read</text><polyline class="d-l" points="170,242 170,274"/><polygon class="d-head" points="170,274 173.6,267.0 166.4,267.0"/><rect class="d-box" x="20" y="274" width="300" height="50" rx="10"/><text class="d-t" x="170" y="296.5" text-anchor="middle">The same dossier in FR and EN</text><text class="d-s" x="170" y="310.5" text-anchor="middle">old texts are not translated</text></svg><figcaption>No account, no server database: the dossier stays in the browser that created it.</figcaption></figure>

Everything goes through browser storage:


- sessionStorage by default, with a logical expiry of one day;
- a copy in localStorage when opted in, which expires 30 days after saving;
- Zod validation on every read;
- the same dossier in FR and EN;
- a history of at most 100 entries;
- statuses `analysed`, `sent`, `interview`, `offer`, `rejected`;
- the sending date and notes kept when an analysis is run again.

Expiry is checked on read: it is not a server purge. Switching language keeps the data, but does not translate an old text. The dossier keeps one set of documents at a time: the history does not archive every CV version sent to every company.

The "manage my dossier" button erases the dossier in this browser. It deletes neither PDFs already downloaded nor processing already done by a provider. Contacts typed only in the export editor stay in the browser; those in the imported CV are part of the processed document.

## What I keep

- A fluent draft is not a correct draft: the review is part of the product.
- The action that commits the candidate (sending) stays theirs, and it is declared, not inferred from a click.
- A memory has an owner and an end date, even in a browser.

## The Python mechanisms

This chapter is mostly on the browser side, in TypeScript. The Python counterpart of "read back and validate what was stored" is in [My Python for AI 101, chapter 9 · Agents and their interfaces](/en/books/python-for-ai-101/chapter-09/): card 47, copies and memory filed per user.

## The defense question

> What does the system do when the draft over-reads a project?

Nothing on its own: the candidate corrects it. That is what the editor is for, and the export asks for confirmation. References are checked for presence, not for the truth of every sentence.

> What happens to blocked or corrupted storage?

The dossier read back goes through a strict Zod schema: invalid or expired content is not used. And if saving fails, the candidate can still move on in the open page.
