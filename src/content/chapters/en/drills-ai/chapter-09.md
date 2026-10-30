---
workedOn: 2026-10-25
---

DRILLS.ai also exposes three tools over MCP, so an external client can search postings and compute a score on evidence already qualified. These tools read; they do not act.

## The concept

An MCP server is neither a database nor an agent. It exposes tools. What a tool can reach is decided in code, before the first connection.

## The diagram

<figure class="diagram"><svg viewBox="0 0 340 444" role="img" aria-labelledby="d-mcp-en-t"><title id="d-mcp-en-t">The DRILLS.ai MCP surface</title><rect class="d-box d-dashbox" x="60" y="8" width="220" height="46" rx="10"/><text class="d-t" x="170" y="28.5" text-anchor="middle">External MCP client</text><text class="d-s" x="170" y="42.5" text-anchor="middle">if linked</text><polyline class="d-l" points="170,54 170,80"/><polygon class="d-head" points="170,80 173.6,73.0 166.4,73.0"/><rect class="d-key" x="20" y="80" width="300" height="64" rx="10"/><text class="d-m" x="170" y="102" text-anchor="middle">/mcp/</text><text class="d-s" x="170" y="116" text-anchor="middle">Streamable HTTP · stateless</text><text class="d-s" x="170" y="130" text-anchor="middle">allowed hosts · body ≤ 100,000 bytes</text><polyline class="d-l" points="52,144 52,176"/><polygon class="d-head" points="52,176 55.6,169.0 48.4,169.0"/><rect class="d-box" x="6" y="176" width="92" height="62" rx="10"/><text class="d-m" x="52" y="204" text-anchor="middle">search_jobs</text><text class="d-s" x="52" y="218" text-anchor="middle">list</text><polyline class="d-l" points="150,144 150,176"/><polygon class="d-head" points="150,176 153.6,169.0 146.4,169.0"/><rect class="d-box" x="104" y="176" width="92" height="62" rx="10"/><text class="d-m" x="150" y="204" text-anchor="middle">get_job</text><text class="d-s" x="150" y="218" text-anchor="middle">one posting</text><polyline class="d-l" points="269,144 269,176"/><polygon class="d-head" points="269,176 272.6,169.0 265.4,169.0"/><rect class="d-box" x="202" y="176" width="134" height="62" rx="10"/><text class="d-m" x="269" y="196" text-anchor="middle">score_</text><text class="d-m" x="269" y="212" text-anchor="middle">documented_match</text><text class="d-s" x="269" y="226" text-anchor="middle">evidence score</text><rect class="d-box" x="6" y="272" width="190" height="48" rx="10"/><text class="d-t" x="101" y="293.5" text-anchor="middle">Job-board adapters</text><text class="d-s" x="101" y="307.5" text-anchor="middle">Greenhouse · Ashby</text><rect class="d-box" x="202" y="272" width="134" height="48" rx="10"/><text class="d-t" x="269" y="293.5" text-anchor="middle">Score rules</text><text class="d-s" x="269" y="307.5" text-anchor="middle">shared</text><polyline class="d-l" points="52,238 52,272"/><polygon class="d-head" points="52,272 55.6,265.0 48.4,265.0"/><polyline class="d-l" points="150,238 150,272"/><polygon class="d-head" points="150,272 153.6,265.0 146.4,265.0"/><polyline class="d-l" points="269,238 269,272"/><polygon class="d-head" points="269,272 272.6,265.0 265.4,265.0"/><rect class="d-ghost" x="6" y="352" width="330" height="84" rx="12"/><text class="d-s" x="18" y="372" text-anchor="start">OUT OF REACH</text><text class="d-s d-a" x="18" y="396" text-anchor="start">✕ browser dossier  ✕ paid model call</text><text class="d-s d-a" x="18" y="416" text-anchor="start">✕ sending an application</text></svg><figcaption>Three read-only tools. They reuse the adapters and the score rules, with no access to the candidate or the model.</figcaption></figure>

| Tool | Input → output | Limit |
| --- | --- | --- |
| `search_jobs` | Location, number of results → public list | Filter by words and place, no ranking by CV |
| `get_job` | ID from the list → full posting | Does not read an arbitrary URL |
| `score_documented_match` | Profile, posting, requirements already qualified, scope, consent → score | Checks the evidence is present; does not redo the analysis |

The server uses stateless Streamable HTTP, read-only tool annotations, a list of allowed hosts and a request body capped at 100,000 bytes. The annotation also declares idempotence: running the tool again changes nothing. The server is mounted only if `DRILLS_ENABLE_MCP=true`.

From the repository (code written with the help of ChatGPT and Codex):

```python
READ = ToolAnnotations(readOnlyHint=True, destructiveHint=False, idempotentHint=True, openWorldHint=True)

@mcp.tool(annotations=READ, structured_output=True)
async def get_job(job_id: str) -> dict[str, Any]:
    """Read one posting by its ID returned by search_jobs. Cannot fetch arbitrary URLs."""
    if len(job_id)>200: raise ValueError('Invalid job ID')
    ...
```

The docstring is what the client reads: it says what the tool does, and what it does not. The server instructions also ask to treat postings and texts as untrusted data, never to follow an instruction found inside them, and to ask permission before sending a CV to the scoring tool.

## What stays out of reach

The server reaches neither accounts nor browser storage. It triggers no paid model call and does not apply. Giving an agent the power to apply was ruled out: reusing the tools, yes; acting outside on the candidate's behalf, no.

The existence of `/mcp/` does not prove a ChatGPT client was connected, or that user authentication exists. A connection is validated by initialisation, tool discovery, then a real call from the chosen client. The historical `get_interview_rubric` function is still in the module, but it is not registered as a public tool.

## What I keep

- A tool reads like a contract: its name, its types, its docstring, its limits.
- Read-only by default. An action that commits is justified by a real, documented use.
- An endpoint that exists is not a client that works.

## The Python mechanisms

- [My Python for AI 101, chapter 11 · Deploying and tooling](/en/books/python-for-ai-101/chapter-11/): card 57, a function becomes an MCP tool.
- [My Python for AI 101, chapter 8 · Decorators, context and files](/en/books/python-for-ai-101/chapter-08/): card 37, types and docstring, the tool's contract.

## The defense question

> Does MCP make the analysis true?

No. MCP exposes tools. The quality of the requirements and the reading of the evidence still need evaluating, with or without MCP.

> Is an MCP endpoint a database or an agent?

Neither. It is a door to declared tools. Here, three read-only tools, with no access to the candidate's dossier.
