---
workedOn: 2026-10-07
---

The Week 1 theme, "Touch Grass", asked for a project that takes people away from the screen and outdoors. I built *autumn-walks*, an agent that sends me an autumn walk through Paris on Telegram every morning. The walk is built from the city's trees and the day's weather.

## The concept

In an agent, the model handles what takes language. Anything with only one right answer, like distances or the choice of stops, is computed by the code.

## What I did

- I filtered the "Les arbres" dataset from Paris Data (220,174 rows) into a SQLite database. That leaves 2,445 autumn trees in 5 arrondissements.
- I built a Strands agent with Gemma (`gemma4:e2b`), running locally with Ollama. It has two tools, weather and trees. Without a system prompt, Gemma called no tool at all.
- When Gemma chose the stops, the loops were 5 km long and some places didn't exist. The code now chooses the stops, and Gemma writes the message.
- The agent keeps a memory of past walks, and the streets from the last two are excluded. The message goes out on Telegram every morning at 8:30.
- The code was written with Claude Code.

## What I keep

- The system prompt is part of the tool.
- Geometry is not a language task.
- Real-world use should be planned mid-week, not at the end.

## The defense question

> Why doesn't Gemma choose the trees itself?

When it did, the loops were 5 km long and some places didn't exist. The code guarantees real stops within 4 km, and Gemma handles the text, which it does well.

Submitted on October 10. I couldn't do the walks before the deadline, and the post says so: the bot works, but it hasn't been used outdoors yet.
