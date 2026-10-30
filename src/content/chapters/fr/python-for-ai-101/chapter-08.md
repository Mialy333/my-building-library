---
workedOn: 2026-10-22
---

Six fiches sur ce qui enveloppe une fonction ou une ressource : le décorateur qui fait un outil, la docstring qui en est le contrat, le décorateur maison, le context manager, et les fichiers avec pathlib.

## Fiche 36 — Le décorateur `@tool`

**Projet.** AI Support Agent (AWS Scholars, chapitre 2)

**En une phrase.** `@tool` est un décorateur Strands qui enveloppe une fonction Python ordinaire et en fait un outil que l'agent peut appeler ; il lit le docstring pour construire le schéma d'entrée/sortie exposé au modèle.

**Pourquoi pour un agent.** Sans ce pont, le modèle ne « voit » jamais la fonction : il ne peut ni décider de l'appeler, ni savoir quels arguments lui donner.

**Analogie.** Un menu de restaurant : chaque plat (fonction) a un nom et une description (docstring) ; le client (le modèle) commande sur cette seule base, sans voir la cuisine.

**Le mécanisme.**

```python
@tool
def search_knowledge_base(query: str) -> str:
    """
    Search the Amazon product catalog and support knowledge base.
    Args:
        query: The question or topic to search for
    Returns:
        Relevant information retrieved from the knowledge base
    """
    ...
```

**Entrée → sortie.** `query="Platinum tier benefits"` → une chaîne de texte résumant les passages pertinents du Knowledge Base, ou `"No relevant information found..."` si rien ne correspond.

**Où le relire.** [main.py L192–226](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/main.py#L192-L226)

**À réutiliser.** Écrire le docstring Args/Returns comme un contrat destiné au modèle, pas comme un commentaire pour un humain : c'est ce texte qui devient le schéma de l'outil.

## Fiche 37 — Types et docstring : le contrat de l'outil

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** Les annotations de type (`customer_id: str`, `-> dict`, `Optional[dict]`) et la docstring décrivent ce que la fonction attend et renvoie ; `@tool` les transforme en fiche d'outil que le modèle lit.

**Pourquoi pour un agent.** Le modèle ne voit jamais le corps de la fonction : il choisit l'outil et remplit ses arguments uniquement à partir du nom, de la docstring et de la section `Args`. Une docstring floue donne des appels faux (critère du rubric : docstring avec but, paramètres et retour).

**Analogie.** La notice d'un formulaire administratif : sans elle, les cases sont remplies au hasard.

**Le mécanisme.**

```python
@tool(context=True)
def check_order_status(customer_id: str, order_id: str, tool_context: ToolContext) -> dict:
    """
    Look up one order in DynamoDB and report its status, product, dates
    and amount. Reports facts only - it does NOT decide return eligibility.

    Args:
        customer_id: The customer's unique identifier (e.g. CUST-001)
        order_id: The order identifier (e.g. ORD-27176)
        tool_context: Injected by Strands (not provided by the model)

    Returns:
        Order record plus days_since_order, a not-found message, or an access-denied message
    """
```

**Entrée → sortie.** Le modèle reçoit un outil `check_order_status` à deux paramètres texte (`tool_context` lui est caché). « I want to return my order ORD-27176 » (CUST-001) → appel `check_order_status(customer_id='CUST-001', order_id='ORD-27176')`, visible dans la trace `chat`. `Optional[dict]` sur `_read_workflow_state` rappelle que l'appelant doit gérer `None`.

**Où le relire.** [`agent_orchestrator.py · check_order_status`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L327) · [`agent_orchestrator.py · _read_workflow_state`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L152).

**À réutiliser.** La première phrase dit quand utiliser l'outil ; chaque argument a un exemple ; la section `Returns` décrit aussi le cas d'erreur ; la docstring dit ce que l'outil ne fait pas.

## Fiche 38 — Le décorateur maison, avec `functools.wraps`

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** Un décorateur reçoit une fonction et en renvoie une version enrichie ; `@tool` au-dessus de `def f` équivaut à `f = tool(f)`, et `functools.wraps` recopie le nom et la docstring de l'original sur la nouvelle fonction.

**Pourquoi pour un agent.** Le `@tool` du starter ajoute une trace X-Ray et un log à chaque appel d'outil, sans une ligne de traçage dans les outils eux-mêmes. Sans `wraps`, Strands enverrait au modèle un outil nommé `wrapper`, sans description.

**Analogie.** Le tampon « reçu le » apposé sur chaque courrier entrant : le courrier ne change pas, mais il est horodaté.

**Le mécanisme.**

```python
def _traced(fn):
    @functools.wraps(fn)                         # keep fn's name and docstring
    def wrapper(*args, **kwargs):
        with tracer.subsegment(node_name or name, ...):
            result = fn(*args, **kwargs)
        return result
    return wrapper

def tool(*args, **kwargs):
    if len(args) == 1 and callable(args[0]) and not kwargs:     # used as @tool
        return _strands_tool(_traced(args[0]))
    strands_decorator = _strands_tool(*args, **kwargs)           # used as @tool(...)
    return lambda fn: strands_decorator(_traced(fn))
```

**Entrée → sortie.** Rejoué : sans `wraps`, `check_order_status` décoré s'appelle `wrapper` et sa docstring vaut `None` ; avec `wraps`, il garde `check_order_status` et `Look up one order.` Dans le projet, chaque `route_to_*` devient un nœud de la Service Map (9 nœuds sur la capture finale).

**Où le relire.** [`agent_observability.py · _traced`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_observability.py#L329) · [`agent_observability.py · tool`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_observability.py#L357).

**À réutiliser.** Le traçage, le log et la mesure de latence dans un décorateur, pas dans chaque fonction. Toujours `functools.wraps` dans un wrapper.

## Fiche 39 — Context manager `with`

**Projet.** AI Support Agent (AWS Scholars, chapitre 2)

**En une phrase.** `with gateway_client:` ouvre la connexion MCP au début du bloc et la ferme à la sortie, succès ou exception, sans code de nettoyage manuel.

**Pourquoi pour un agent.** La liste d'outils du Gateway n'est valide que tant que la connexion est ouverte ; oublier de la fermer (ou la fermer seulement en cas de succès) laisse des connexions qui fuient en production.

**Analogie.** Emprunter un livre à la bibliothèque avec un bibliothécaire qui le reprend automatiquement à la sortie, même si on l'a laissé tomber en chemin.

**Le mécanisme.**

```python
gateway_client = MCPClient(lambda: streamable_http_client(GATEWAY_URL))
with gateway_client:
    gateway_tools = gateway_client.list_tools_sync()
    all_tools = tools + gateway_tools
    agent = Agent(model=model, tools=all_tools, hooks=[memory_hook], system_prompt=SYSTEM_PROMPT)
    response = agent(user_input)
```

**Entrée → sortie.** À l'entrée du bloc, la connexion MCP s'ouvre et `list_tools_sync()` renvoie la liste des outils Gateway (`order-tracker___get_order`, etc.) ; à la sortie du bloc (même sur exception), la connexion se ferme.

**Où le relire.** [main.py L367–398](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/main.py#L367-L398)

**À réutiliser.** Toute ressource externe à fermer de façon fiable (connexion réseau, fichier, session de sandbox) se manipule avec `with`, jamais avec un `open()`/`close()` manuel qu'une exception peut sauter.

## Fiche 40 — Le context manager : ouvrir, et toujours refermer

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** Un objet utilisé avec `with` exécute du code à l'entrée et à la sortie d'un bloc ; `@contextmanager` en fabrique un à partir d'une fonction : le code avant `yield` à l'entrée, celui après `yield` (dans un `finally`) à la sortie, même si une erreur survient.

**Pourquoi pour un agent.** Une trace X-Ray, un verrou ou un fichier ouvert doivent être refermés même quand une Knowledge Base tombe en panne. Sinon la trace est corrompue ou le verrou reste pris.

**Analogie.** Le registre d'entrée d'une salle des coffres : on signe en entrant, et le gardien note la sortie même si on part en courant.

**Le mécanisme.**

```python
@contextmanager
def trace_kb_retrieval(kb_id: str):
    with tracer.subsegment(f"KnowledgeBase:{label}", namespace='remote', ...) as node:
        yield node

# usage, in bedrock_kb_retrieval.py
with trace_kb_retrieval(kb_id):
    response = _bedrock_agent_runtime.retrieve(knowledgeBaseId=kb_id, ...)
```

**Entrée → sortie.** Rejoué : un bloc qui lève `ValueError('KB down')` affiche `open KnowledgeBase:returns`, puis `close KnowledgeBase:returns`, puis l'erreur remonte à l'appelant. Dans le projet, chaque recherche devient un nœud `KnowledgeBase:returns`, `:shipping` ou `:warranty` sur la Service Map.

**Où le relire.** [`agent_observability.py · trace_kb_retrieval`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_observability.py#L375) · [`agent_observability.py · trace_request`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_observability.py#L240) · [`bedrock_kb_retrieval.py · retrieve_from_knowledge_base`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/bedrock_kb_retrieval.py#L41).

**À réutiliser.** Toute paire « ouvrir / fermer » (trace, verrou, connexion, fichier) dans un context manager. `try/finally` autour du `yield`.

## Fiche 41 — Les fichiers avec `pathlib`

**Projet.** Dev3Pack AI Engineering Bootcamp

**En une phrase.** `Path` manipule les chemins comme des objets : `/` pour assembler, `.glob` pour lister, `.read_text` pour lire, `.stem` pour le nom sans extension.

**Pourquoi pour un agent.** Les preuves de l'agent (intentions, refus, reçus) sont des fichiers. Une intention qui pourrait être écrasée ne prouve plus rien.

**Analogie.** Un registre où l'on ajoute des pages, sans jamais en réécrire une.

**Le mécanisme.**

```python
paths = sorted(directory.glob("*.md"))               # ordre stable
text = path.read_text(encoding="utf-8")
doc_id = path.stem                                    # "rag-basics.md" -> "rag-basics"

directory.mkdir(parents=True, exist_ok=True)
with path.open("x", encoding="utf-8") as handle:     # "x" : refuse d'écraser
    json.dump(asdict(record), handle, indent=2)
```

**Entrée → sortie.** Le même fichier ouvert deux fois en mode `"x"` → `FileExistsError`. `Path("…/20261004T001635-one-espresso.json").stem` → `20261004T001635-one-espresso`.

**Où le relire.** [`documents.py · load_corpus`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/documents.py#L67) (cours) · [ch06 · cellules 7 et 17](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch06/notebook.ipynb) (`load_mini` ; l'index figé face au disque qui change) · la cellule *preflight* de chaque notebook, par exemple [ch01 · cellule 2](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch01/notebook.ipynb) (remonte jusqu'à `pyproject.toml` avec `.parent`) · [`buyer/intent.py · pin, read_pin`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/intent.py#L188) · [`grounded-research-agent/agent.py · CORPUS_DIR`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/agent.py#L42).

**À réutiliser.** Toujours `encoding="utf-8"`. `sorted(glob(…))` pour un résultat déterministe. `open("x")` pour un journal à écriture unique. `Path(__file__).resolve().parent` pour trouver ses données, d'où qu'on lance le script.

## Fiche 64 — Le middleware : une règle pour toutes les réponses

**Projet.** DRILLS.ai (Builds, hackathon OpenAI DevDay)

**En une phrase.** `@app.middleware("http")` enregistre une fonction qui entoure chaque requête : elle laisse passer la requête avec `call_next`, puis modifie la réponse avant qu'elle parte.

**Pourquoi pour un agent.** Une réponse qui contient un CV ne doit jamais être gardée en cache. Écrite une fois dans le middleware, la règle vaut pour toutes les routes privées, même celles qu'on ajoutera.

**Analogie.** Le tampon « confidentiel » posé au service courrier sur chaque pli qui sort, quel que soit le bureau qui l'a écrit.

**Le mécanisme.**

```python
@app.middleware("http")
async def private_application_responses(request: Request, call_next):
    started = perf_counter()
    response = await call_next(request)
    if request.url.path in {"/api/application", "/api/assessment", ...} or request.url.path.startswith("/mcp/"):
        response.headers["Cache-Control"] = "no-store"
        response.headers["Server-Timing"] = f"application;dur={(perf_counter()-started)*1000:.0f}"
    return response
```

**Entrée → sortie.** Rejoué avec le client de test FastAPI : `POST /api/assessment` avec un corps vide → `422`, `Cache-Control: no-store`, `Server-Timing: application;dur=3`. `GET /health` → pas d'en-tête `Cache-Control` ajouté. Même une erreur garde la règle.

**Où le relire.** [`api/main.py · private_application_responses`](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/api/main.py#L85).

**À réutiliser.** Ce qui doit valoir pour toutes les réponses va dans un middleware, pas dans chaque route. `perf_counter()` pour mesurer une durée.

## Sur le terrain

Les chapitres de mes formations et de mes projets où ces mécanismes tournent pour de vrai.

- [Dev3Pack, Session 1](/fr/books/dev3pack/session-01/) : fiche 41.
- [Dev3Pack, Session 6](/fr/books/dev3pack/session-06/) : fiche 41.
- [Dev3Pack, Final assignment](/fr/books/dev3pack/final/) : fiche 41.
- [Dev3Pack, Gecko capstone](/fr/books/dev3pack/gecko/) : fiche 41.
- [AWS Scholars, chapitre 2 · AI Support Agent](/fr/books/aws-scholars/chapter-02/) : fiches 36 et 39.
- [AWS Scholars, chapitre 3 · NovaMart Multi-Agent Support](/fr/books/aws-scholars/chapter-03/) : fiches 37, 38 et 40.
- [DRILLS.ai, chapitre 9 · MCP : trois outils en lecture seule](/fr/books/drills-ai/chapter-09/) : fiche 37.
- [DRILLS.ai, chapitre 10 · Déployer et exploiter](/fr/books/drills-ai/chapter-10/) : fiche 64.
