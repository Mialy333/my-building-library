---
workedOn: 2026-10-18
---

The Week 2 theme was "Side Hustle". I built *Late Pay Radar*, a local tool for freelancers. It ranks unpaid invoices by risk of late payment and drafts the right reminder. The title comes from a real case. My model gave my client an 82% risk of paying late, and they paid 15 days early.

## The concept

A model is only worth something if it's compared with a simple rule, tested on data it has never seen, and surrounded by checks that don't depend on it.

## What I did

- I backtested TabPFN on 1,561 public invoices from Barnet Council. At first, the model just copied the most frequent answer.
- I fixed the evaluation with simple rules to compare against, ROC-AUC, and a threshold chosen outside the test data. The model ties with the rule "this client has paid late before" (0.688 vs 0.687). It has a slight edge on new clients.
- I built a Strands agent with Gemma. Sorting, dates, amounts and mandatory legal mentions are computed by the code.
- The guardrail let an invented reminder through when the tool wasn't called. I fixed it so it blocks when in doubt.
- I added a PDF import with human confirmation, an offline test and a fresh-clone test.
- The code was written with Claude Code.

## What I keep

- An honest tie is better than a fake winner.
- A guardrail checks against data the code knows, never against what the model chose to look up.
- An 82% score describes the training data, not my client.

## The defense question

> Does your model beat a simple rule?

Not for a yes-or-no decision, and it ties for ranking invoices. It only brings a slight edge on clients with no history. That's why the tool uses hybrid routing.

Submitted on October 18.
