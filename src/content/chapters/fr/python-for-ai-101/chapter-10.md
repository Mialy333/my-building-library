---
workedOn: 2026-10-22
---

Cinq fiches sur l'attente : le réseau vérifié avant l'appel, le délai borné par un thread, l'entrypoint asynchrone, le fan-out parallèle et le verrou.

## Fiche 48 — Le réseau prudent : `urlsplit`, `ipaddress`, `urllib`

**Projet.** Dev3Pack AI Engineering Bootcamp

**En une phrase.** Avant d'appeler une URL, on la découpe, on vérifie le protocole (https), l'hôte et l'adresse IP ; ensuite seulement on l'appelle, avec un délai maximal.

**Pourquoi pour un agent.** Un outil qui va chercher l'URL qu'on lui donne peut être pointé vers l'intérieur (`169.254.169.254`, la machine locale) : c'est la SSRF.

**Analogie.** Vérifier l'IBAN du bénéficiaire avant le virement, pas après.

**Le mécanisme.**

```python
parts = urlsplit(url)
if parts.scheme != "https" or not parts.hostname:
    return False
ip = ipaddress.ip_address(address)
public = ip.is_global and not (ip.is_private or ip.is_loopback or ip.is_link_local)
resolved = {info[4][0] for info in socket.getaddrinfo(host, parts.port or 443)}
return bool(resolved) and all(_is_public(a) for a in resolved)   # TOUTES publiques
```

**Entrée → sortie.** `http://169.254.169.254/latest/meta-data/` → hôte `169.254.169.254`, `is_global` → `False`. `ip_address(int("2130706433"))` → `127.0.0.1` : un nombre qui cache la machine locale. `is_public_url("http://example.com")` → `False` (pas https) ; `is_public_url("https://10.0.0.5")` → `False`.

**Où le relire.** [ch04 · cellule 14](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch04/notebook.ipynb) (`allowed_url`, `fetch_rates` avec `User-Agent` et `timeout=5`) · [ch13 · cellules 7 et 11](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch13/notebook.ipynb) (`fetch_guard`, chaque redirection revérifiée) · [`my-gecko-buyer/server/guard.py · is_public_url`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/server/guard.py#L31) · [`buyer/mcp_client.py · _post`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/mcp_client.py#L42) (`urllib.request.Request` avec les en-têtes MCP, cours) · [ch14 · cellule 15](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch14/notebook.ipynb) (`http_request` : `HTTPError` = le serveur a répondu ; `OSError` = personne n'écoute).

**À réutiliser.** La liste blanche d'hôtes en configuration, jamais en argument. Refuser un nom qu'on ne peut pas résoudre. Un `timeout` sur chaque appel. Distinguer « le serveur a dit non » de « le serveur est injoignable ».

## Fiche 49 — Temps, délais et thread

**Projet.** Dev3Pack AI Engineering Bootcamp

**En une phrase.** `time.perf_counter()` mesure une durée ; un `threading.Thread` attendu avec `join(timeout)` borne un appel qui n'a pas de délai à lui.

**Pourquoi pour un agent.** Un modèle local peut ne jamais répondre. L'agent doit refuser au bout de N secondes, pas laisser l'utilisateur attendre.

**Analogie.** Un ordre à cours limité qui expire en fin de séance.

**Le mécanisme.**

```python
worker = threading.Thread(target=call, daemon=True)
worker.start()
worker.join(self.timeout_s)                # attend au plus timeout_s secondes
if worker.is_alive():
    raise ProviderTimeout(f"no answer within {self.timeout_s} s")

started = time.perf_counter()
elapsed_ms = round((time.perf_counter() - started) * 1000)
```

**Entrée → sortie.** Une tâche de 2 s attendue 0,2 s → `is_alive()` vaut `True`, et la fonction rend la main en moins de 400 ms.

**Où le relire.** [`grounded-research-agent/agent.py · _complete`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/agent.py#L215) (`timeout_s = 90`) · [ch14 · cellules 5 et 9](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch14/notebook.ipynb) (`elapsed_ms`, le cold start) · [ch02 · cellule 35](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch02/notebook.ipynb) (`time.monotonic`) · [ch10 · cellule 11](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch10/notebook.ipynb) (l'ADR : un délai de 3 s, choisi sur une mesure).

**À réutiliser.** `perf_counter` pour mesurer, pas `time.time`. `daemon=True` pour qu'un thread bloqué n'empêche pas le programme de finir. Un délai dépassé devient un refus marqué pour relecture, pas un crash.

## Fiche 50 — Entrée asynchrone `@app.entrypoint`

**Projet.** AI Support Agent (AWS Scholars, chapitre 2)

**En une phrase.** `invoke()` est déclarée `async def` et décorée `@app.entrypoint` : le runtime AgentCore l'appelle comme une coroutine à chaque requête entrante.

**Pourquoi pour un agent.** Un agent déployé doit pouvoir traiter plusieurs requêtes sans que l'une bloque les autres ; la forme asynchrone de l'entrypoint est ce qui rend ça possible, même si le corps de la fonction d'aujourd'hui est en grande partie séquentiel.

**Analogie.** Un standard téléphonique qui peut mettre un appel en attente et en prendre un autre, plutôt qu'une seule ligne qui doit se libérer avant de sonner à nouveau.

**Le mécanisme.**

```python
@app.entrypoint
async def invoke(payload, context=None):
    user_input = payload.get("prompt", "")
    actor_id = payload.get("customer_id", "anonymous")
    session_id = payload.get("session_id") or str(uuid.uuid4())
    ...
```

**Entrée → sortie.** `{"prompt": "Can you track order ORD-001?", "customer_id": "CUST-123", "session_id": "t1"}` → une chaîne de réponse texte (le statut de livraison, le numéro de suivi).

**Où le relire.** [main.py L337–351](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/main.py#L337-L351)

**À réutiliser.** Déclarer `async def` l'entrypoint d'un agent déployé (AgentCore, FastAPI, Lambda) dès le départ, même si rien n'est encore concurrent à l'intérieur : ça ne coûte rien et évite une réécriture plus tard.

## Fiche 51 — Le fan-out parallèle : `ThreadPoolExecutor` et `as_completed`

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** `submit` lance une fonction dans un thread et renvoie aussitôt un `Future` (une promesse de résultat) ; `as_completed` rend les futures dans l'ordre où elles **finissent** ; `future.result()` donne la valeur ou relève l'erreur du thread.

**Pourquoi pour un agent.** Les trois Knowledge Bases sont indépendantes : les interroger en parallèle coûte la durée de la plus lente, pas la somme. C'est le cœur du rubric RAG (`ThreadPoolExecutor(max_workers=3)` + `as_completed()`). À l'inverse, Inventory puis Refund dépendent l'un de l'autre : là, l'Orchestrator force le séquentiel.

**Analogie.** Trois analystes interrogés en même temps, chacun sur sa classe d'actifs ; on lit les notes au fur et à mesure qu'elles arrivent.

**Le mécanisme.**

```python
with ThreadPoolExecutor(max_workers=3) as executor:
    futures = {executor.submit(_run_retriever, domain, agent, query): domain
               for domain, agent in retrievers.items()}
    for future in as_completed(futures):
        domain = futures[future]
        try:
            _, text = future.result()
            results[domain] = text
        except Exception as exc:                 # one KB down does not sink the others
            results[domain] = f"[{domain} retriever error: {exc}]"

orchestrator = Agent(..., tool_executor=SequentialToolExecutor())   # dependent steps
```

**Entrée → sortie.** Rejoué avec trois tâches de 0,3 s, 0,1 s et 0,2 s : ordre d'arrivée `['Shipping', 'Warranty', 'Returns']`, durée totale `0.3 s` au lieu de `0.6 s`. Dans le projet, l'exécution parallèle par défaut de Strands lançait le RefundAgent avant que l'InventoryAgent ait écrit ses faits : d'où `SequentialToolExecutor`.

**Où le relire.** [`agent_orchestrator.py · search_all_policies`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L720) · [`agent_orchestrator.py · ThreadPoolExecutor`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L772) · [`agent_orchestrator.py · SequentialToolExecutor`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1434).

**À réutiliser.** Paralléliser les tâches indépendantes d'attente réseau ; un `try` par future ; résultat assemblé dans un ordre fixe, pas dans l'ordre d'arrivée. Séquentiel dès qu'une étape lit ce que la précédente écrit.

## Fiche 52 — Verrou, contexte par thread, singleton paresseux

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** `threading.Lock` garantit qu'un seul thread exécute un bloc à la fois ; une `ContextVar` porte une valeur propre au contexte d'exécution ; un singleton paresseux crée un objet coûteux une seule fois, au premier besoin.

**Pourquoi pour un agent.** Le Runtime sert plusieurs requêtes en parallèle : le graphe des 5 agents ne doit être construit qu'une fois, et le flux de logs des métriques créé une seule fois.

**Analogie.** La clé unique de la salle des archives : un seul employé à la fois, et le premier arrivé allume la lumière pour tout le monde.

**Le mécanisme.**

```python
_metrics_lock = threading.Lock()
with _metrics_lock:
    if _metrics_stream['name'] is None:          # created once, whatever the thread
        _metrics_logs.create_log_stream(...)
        _metrics_stream['name'] = name

lock, graph = threading.Lock(), {}
def _orchestrator():
    with lock:
        if 'agent' not in graph:
            graph['agent'] = build_agent_graph()  # built on the first request only
    return graph['agent']
```

**Entrée → sortie.** Premier appel au Runtime : construction du graphe (plusieurs secondes) ; appels suivants : réutilisation immédiate. Le traceur X-Ray utilise une `ContextVar` pour savoir sous quel nœud rattacher un sous-segment ; les threads du `ThreadPoolExecutor` n'héritent pas de ce contexte, d'où un mécanisme de repli qui garde la Service Map connectée.

**Où le relire.** [`agent_orchestrator.py · _metrics_lock`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L924) · [`agent_orchestrator.py · _orchestrator`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L2348) · [`agent_observability.py · ContextVar`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_observability.py#L184).

**À réutiliser.** Tout « créer si absent » partagé entre threads sous un verrou. Les objets coûteux (graphe d'agents, clients) construits au premier appel puis réutilisés.

## Sur le terrain

Les chapitres de mes formations où ces mécanismes tournent pour de vrai.

- [Dev3Pack, Session 2](/fr/books/dev3pack/session-02/) : fiche 49.
- [Dev3Pack, Session 4](/fr/books/dev3pack/session-04/) : fiche 48.
- [Dev3Pack, Session 10](/fr/books/dev3pack/session-10/) : fiche 49.
- [Dev3Pack, Session 13](/fr/books/dev3pack/session-13/) : fiche 48.
- [Dev3Pack, Session 14](/fr/books/dev3pack/session-14/) : fiches 48 et 49.
- [Dev3Pack, Final assignment](/fr/books/dev3pack/final/) : fiche 49.
- [Dev3Pack, Gecko capstone](/fr/books/dev3pack/gecko/) : fiche 48.
- [AWS Scholars, chapitre 2 · AI Support Agent](/fr/books/aws-scholars/chapter-02/) : fiche 50.
- [AWS Scholars, chapitre 3 · NovaMart Multi-Agent Support](/fr/books/aws-scholars/chapter-03/) : fiches 51 et 52.
