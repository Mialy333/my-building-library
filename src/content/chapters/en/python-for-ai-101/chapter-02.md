---
workedOn: 2026-10-22
---

Five cards on how to lay out an agent project: one file for several commands, a command line to test locally, configuration read from the environment, and clients created only once.

## Card 1 — One file, several commands

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** `if __name__ == '__main__'` runs a block only if the file is launched directly; `sys.argv` reads the command typed there, and `sys.path` tells Python where to look for the modules to import.

**Why it matters for an agent.** The same file serves local testing (`test`, `chat`), deployment (`deploy`) and the Runtime's server (`serve`). So the code tested is exactly the code deployed.

**Analogy.** A single customer file, several counters: each one opens it at the page that concerns it.

**The mechanism.**

```python
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # starter/
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))                   # src/

if __name__ == '__main__':
    command = sys.argv[1] if len(sys.argv) > 1 else ''
    if not command and os.path.exists(os.path.join(_SRC_DIR, _RUNTIME_MARKER)):
        command = 'serve'                       # inside the AgentCore package
    if command == 'deploy':
        deploy_all()
    elif command == 'test':
        run_test_scenarios()
```

**Input → output.** `python src/agent_orchestrator.py chat` → `sys.argv == ['src/agent_orchestrator.py', 'chat']` → `run_chat()`. Imported by `tests/test_agent.py`, the same file runs no command: `__name__` is then `'agent_orchestrator'`. Inside the Runtime package, with no argument, the marker file makes it choose `serve`.

**Where to read it again.** [`agent_orchestrator.py · sys.path`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L53) · [`agent_orchestrator.py · __main__`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L2381).

**To reuse.** A single entry point with `test`, `chat`, `deploy`, `serve` subcommands. The import path computed from `__file__`, never from the current folder.

## Card 2 — A local CLI with `argparse` + `asyncio.run()`

**Project.** AI Support Agent (AWS Scholars, chapter 2)

**In one sentence.** The `if __name__ == "__main__":` block turns `invoke()` (a coroutine) into a command you can test locally, with `argparse` to read the arguments and `asyncio.run()` to run the coroutine from synchronous code.

**Why it matters for an agent.** Without this bridge, the only way to test `invoke()` would be to deploy first, which makes every iteration costly.

**Analogy.** A universal remote: a single synchronous button ("press") that triggers, behind the scenes, a mechanism that keeps running.

**The mechanism.**

```python
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("payload", type=str)
    args = parser.parse_args()
    response = asyncio.run(invoke(json.loads(args.payload)))
    print(response)
```

**Input → output.** `uv run main.py '{"prompt": "Hello", ...}'` → the `invoke()` coroutine runs to the end and its answer is printed in the terminal (only if `main()` replaces `app.run()`, which starts a local server and ignores the argument).

**Where to read it again.** [main.py L408–420](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/main.py#L408-L420)

**To reuse.** `argparse` + `asyncio.run()` is the standard pair to give a command-line interface to any async function, whatever server wraps it in production.

## Card 3 — Configuration and environment

**Project.** Dev3Pack AI Engineering Bootcamp

**In one sentence.** Settings come from environment variables (`os.environ`, a `.env` file); the code validates them and refuses to start if something is missing, without ever printing the key.

**Why it matters for an agent.** A key written in the code ends up on GitHub. A misspelled provider must fail at startup, not in the middle of a run.

**Analogy.** A safe whose code is not written on the door.

**The mechanism.**

```python
def load_settings(env: Mapping[str, str] | None = None, dotenv_path=None) -> Settings:
    if env is None:
        load_dotenv(dotenv_path)
        env = os.environ
    provider = env.get("BOOTCAMP_PROVIDER", "fake").strip() or "fake"
    if provider not in KNOWN_PROVIDERS:
        raise ConfigError(f"Unknown BOOTCAMP_PROVIDER {provider!r}; expected one of {KNOWN_PROVIDERS}")
```

**Input → output.** `load_settings(env={})` → `Settings(provider='fake', model=None, api_key=None, base_url=None)`. `{"BOOTCAMP_PROVIDER": "gpt-9"}` → `Unknown BOOTCAMP_PROVIDER 'gpt-9'; expected one of ('fake', 'ollama', 'anthropic', 'openai')`. Anthropic with no key → `… needs an API key in the environment; see .env.example. (The key itself is never printed.)`

**Where to read it again.** [`config.py · load_settings`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/config.py#L35) and [`llm.get_client`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/llm.py#L111) — course · [ch02 · cell 22](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch02/notebook.ipynb) · [ch13 · cell 23](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch13/notebook.ipynb) (`GECKO_LIVE`: the real mode is switched on explicitly) · [ch14 · cell 15](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch14/notebook.ipynb) (`SMOKE_URL` missing: nothing is called) · [`buyer/mcp_client.py · GECKO_MCP_URL`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/mcp_client.py#L37) (with a default value).

**To reuse.** An injectable `env` parameter, to test without touching the real environment. A safe default value (`fake`). A closed list of accepted values. Costly actions behind an explicit variable.

## Card 4 — Lazy configuration

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** `load_dotenv()` copies the `.env` file into `os.environ`; a `__getattr__` function defined at module level computes a value only when it is asked for, then keeps it in a cache.

**Why it matters for an agent.** Table and bucket names and model IDs change from one account to another. Read from the environment and the CloudFormation exports, they are never written in the code (rubric criterion: "Models via config.\* constants only").

**Analogy.** A safe at the counter: you only open it when a customer asks for what's inside, and you keep the copy at hand for the next one.

**The mechanism.**

```python
load_dotenv()                                   # .env -> os.environ

def __getattr__(name: str):                     # called only for a missing attribute
    if name in _LAZY:
        value = _LAZY[name]()                   # e.g. reads a CloudFormation export
        if name not in ('RETURNS_KB_ID', ..., 'GUARDRAIL_VERSION'):
            globals()[name] = value             # cached: next read skips __getattr__
        return value
    raise AttributeError(f"module 'config' has no attribute '{name}'")
```

**Input → output.** Replayed on a test module: two reads of `ORDERS_TABLE` → `udacity-agentcore-orders` twice, but a single call to the loader (`loader calls: ['ORDERS_TABLE']`). The KB IDs and the guardrail are not cached, so the `.env` is read again each time. With no stack deployed, the access raises `ConfigError` with the instruction "Deploy infrastructure/starter\_stack.yaml first".

**Where to read it again.** [`config.py · load_dotenv`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/config.py#L23) · [`config.py · __getattr__`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/config.py#L175).

**To reuse.** One `config.py` module as the only source of settings; importing it makes no network call; values that may change during a session (an edited `.env`) are not cached.

## Card 5 — Clients and logger at module level

**Project.** NovaMart Multi-Agent Support (AWS Scholars, chapter 3)

**In one sentence.** Code written outside any function runs only once, at the first import: that is where you create the AWS clients and the logger, then shared by every function.

**Why it matters for an agent.** An agent calls its tools dozens of times per request. Creating a new boto3 client on every call adds latency and pointless connections.

**Analogy.** The switchboard installed once for the whole floor, rather than a line pulled for each call.

**The mechanism.**

```python
logger   = logging.getLogger(__name__)
dynamodb = boto3.resource('dynamodb', region_name=config.AWS_REGION)   # Python types
logs_client = boto3.client('logs', region_name=config.AWS_REGION)     # raw API format

logger.warning("Blocked cross-customer access: session %s requested %s", bound, customer_id)
```

**Input → output.** `boto3.client('dynamodb')` returns `{'customer_id': {'S': 'CUST-001'}}`; `boto3.resource('dynamodb').Table(...)` returns `{'customer_id': 'CUST-001'}`. The project uses `resource` for DynamoDB, `client` for everything else. The logger carries the module's name (`agent_orchestrator`), which can be filtered in CloudWatch.

**Where to read it again.** [`agent_orchestrator.py · logger`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L70) · [`agent_orchestrator.py · boto3 clients`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L100).

**To reuse.** One client per service, created once, with the region from the config. `%s` in log messages rather than an f-string: the text is only formatted if the log is emitted.

## In the field

The chapters of my courses where these mechanisms run for real.

- [Dev3Pack, Session 2](/en/books/dev3pack/session-02/): card 3.
- [Dev3Pack, Session 13](/en/books/dev3pack/session-13/): card 3.
- [Dev3Pack, Session 14](/en/books/dev3pack/session-14/): card 3.
- [Dev3Pack, Gecko capstone](/en/books/dev3pack/gecko/): card 3.
- [AWS Scholars, chapter 2 · AI Support Agent](/en/books/aws-scholars/chapter-02/): card 2.
- [AWS Scholars, chapter 3 · NovaMart Multi-Agent Support](/en/books/aws-scholars/chapter-03/): cards 1, 4 and 5.
