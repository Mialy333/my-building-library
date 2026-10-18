---
workedOn: 2026-10-04
---

The first challenge, "Build for a Friend", asked for a tool built in one weekend for someone close to you. I made *One step* for my sister. She writes everything on her mind in one block, and the tool suggests a single 10-minute action to do right away. The model runs in her browser and nothing is sent to a server.

## The concept

A small model stays useful if you give it a narrow task and let the code frame what it produces. Here, the JSON format is required, the code cuts the list and the interface sets the tone.

## What I did

- I ran Gemma 2 2B in Chrome with WebLLM. My sister has nothing to install.
- Before building, I tested the model for 20 minutes on 3 real cases. The first suggested action was right, but the lists contained invented tasks.
- I cut the answer format down to 2 fields and took "this can wait" out of the model. That text is now fixed in the interface. The model stopped inventing tasks.
- My sister tested it the same evening on her computer. The first answer came in 4.5 seconds.
- The code was written with Claude Code.

## What I keep

- The less you ask of the model, the more reliable it is.
- A test by the real person shows what my tests don't. My sister wanted to see the tasks set aside again.
- You can ship in under 24 hours if the MVP fits in 5 lines.

## The defense question

> Why not use a closed API?

What my sister writes is private. In the browser, her text never leaves her computer, and using it costs nothing.

Submitted on October 5.
