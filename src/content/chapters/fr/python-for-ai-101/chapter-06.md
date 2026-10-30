---
workedOn: 2026-10-22
---

Sept fiches sur le contrôle du flux : les compréhensions, le parcours à l'envers, la boucle bornée, la table de transitions et les closures.

## Fiche 23 — Compréhensions et outils d'itération

**Projet.** Dev3Pack AI Engineering Bootcamp

**En une phrase.** Une compréhension construit une liste, un set ou un dict en une ligne ; `next`, `any`, `dict.fromkeys` et `sorted(key=…)` couvrent l'essentiel du reste.

**Pourquoi pour un agent.** Filtrer les citations inventées, dédoublonner des documents, trouver un produit au menu : une erreur ici devient une fausse citation ou un mauvais achat.

**Analogie.** Trier un relevé : « toutes les lignes au-dessus de 100 € », « la première ligne de ce fournisseur, sinon rien ».

**Le mécanisme.**

```python
fabricated = [c for c in answer.citations if c not in retrieved_ids]
product = next((p for p in listing["products"] if p["name"] == wanted), None)
unique = list(dict.fromkeys(hits))      # dédoublonne en gardant l'ordre
del state.episodes[:-5]                 # ne garde que les 5 derniers
kept = [d for d, s in sorted(best.items(), key=lambda kv: (-kv[1], kv[0]))
        if s >= 0.6 * top][:2]
```

**Entrée → sortie.** `['rag-basics', 'rag-basics', 'agent-loops']` → `['rag-basics', 'agent-loops']`. `next(…, None)` sur « Latte » → `None`, pas une exception. Sept épisodes → `['Q3', 'Q4', 'Q5', 'Q6', 'Q7']`. Scores `rag-basics 7.2`, `agent-loops 5.0`, `prompt-injection 3.1` → `['rag-basics', 'agent-loops']` (seuil 60 %, deux au plus).

**Où le relire.** [`agent.py · fabricated`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/agent.py#L138) (cours) · [ch10 · cellule 20](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch10/notebook.ipynb) (`next`) · [ch08 · cellule 30](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch08/notebook.ipynb) (`dict.fromkeys`) · [ch11 · cellule 8](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch11/notebook.ipynb) (`del …[:-5]`) · [ch12 · cellule 16](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch12/notebook.ipynb) (`any(wildcard(s) …)`) · [`grounded-research-agent/agent.py · kept_docs`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/agent.py#L252) · [`retrieval.py · zip(…, strict=True)`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/retrieval.py#L83).

**À réutiliser.** `next(gen, None)` pour chercher sans planter. `dict.fromkeys` pour dédoublonner sans perdre le rang. `zip(a, b, strict=True)` quand deux listes doivent avoir la même longueur (`retrieval.py`).

## Fiche 24 — Compréhension de liste avec filtre

**Projet.** AI Support Agent (AWS Scholars, chapitre 2)

**En une phrase.** `[o for o in orders.values() if o["customer_id"] == cid]` construit la liste filtrée des commandes d'un client en une seule expression, au lieu d'une boucle `for` plus `append`.

**Pourquoi pour un agent.** Un outil Lambda qui répond à « mes commandes » doit filtrer un ensemble de données à chaque appel ; la lisibilité de cette ligne compte quand le code est relu par un reviewer qui n'a que quelques minutes.

**Analogie.** Trier son courrier directement en le sortant de la boîte, plutôt que de tout sortir d'abord puis trier sur la table.

**Le mécanisme.**

```python
cid = params.get("customer_id", "").upper()
result = [o for o in orders.values() if o["customer_id"] == cid]
```

**Entrée → sortie.** `cid="CUST-123"` sur le jeu de données mock → une liste de 2 dicts (`ORD-001`, `ORD-002`), les commandes de `CUST-456` n'y apparaissent pas.

**Où le relire.** [order\_tracker.py L121–127](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/lambda/order_tracker.py#L121-L127)

**À réutiliser.** Dès que la logique est « un filtre + une transformation », la compréhension est l'écriture idiomatique Python — plus courte à écrire et plus rapide à relire qu'une boucle manuelle.

## Fiche 25 — Compréhensions et dépaquetage `**`

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** Une compréhension construit une liste ou un dict en une expression ; `**d` transforme un dict en arguments nommés, ou fusionne ses clés dans un nouveau dict.

**Pourquoi pour un agent.** La même fonction `guardrail_settings()` alimente `create_guardrail` et `update_guardrail` (script de tuning) : une seule source de vérité pour les politiques de sécurité.

**Analogie.** Un formulaire pré-rempli qu'on dépose tel quel à deux guichets différents.

**Le mécanisme.**

```python
update_expr_parts = [f"{k} = :{k}" for k in updates]
expr_values = {f":{k}": v for k, v in updates.items()}

response = bedrock_client.create_guardrail(**guardrail_settings())
return {'success': False, **denied}
```

**Entrée → sortie.** Rejoué : `{'inventory_agent': 'facts'}` → `SET inventory_agent = :inventory_agent, version = :new_version` et `{':inventory_agent': 'facts'}`, le format exact d'une `UpdateExpression`. `{'success': False, **{'access_denied': True, 'message': 'x'}}` → `{'success': False, 'access_denied': True, 'message': 'x'}`.

**Où le relire.** [`agent_orchestrator.py · _update_workflow_state`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L177) · [`agent_orchestrator.py · topics_config`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1573) · [`agent_orchestrator.py · create_guardrail(**…)`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1677) · [`tune_guardrail.py · _update_draft`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/scripts/tune_guardrail.py#L81).

**À réutiliser.** Une fonction qui renvoie un dict de configuration, dépaquetée avec `**` partout où elle sert. Une compréhension tant qu'elle tient sur une ligne lisible ; une boucle sinon.

## Fiche 26 — `reversed()` + arrêt anticipé

**Projet.** AI Support Agent (AWS Scholars, chapitre 2)

**En une phrase.** La sauvegarde mémoire parcourt `agent.messages` à l'envers avec `reversed()` et sort du côté avec `break` dès que le dernier message utilisateur ET le dernier message assistant sont trouvés.

**Pourquoi pour un agent.** L'historique d'une conversation ne fait que grandir ; chercher « la dernière paire » en partant du début voudrait dire rescanner tout l'historique à chaque tour, pour un coût qui augmente avec la conversation.

**Analogie.** Chercher ses clés en commençant par la dernière poche où on les a mises, pas en vidant tous ses sacs un par un depuis le premier.

**Le mécanisme.**

```python
for message in reversed(messages):
    content = message.get("content", [])
    if not content or "text" not in content[0]:
        continue
    if message.get("role") == "assistant" and agent_response is None:
        agent_response = content[0]["text"]
    elif message.get("role") == "user" and customer_query is None:
        customer_query = content[0]["text"]
    if customer_query and agent_response:
        break
```

**Entrée → sortie.** Un historique de 40 messages → la boucle s'arrête dès les 2-3 derniers messages pertinents trouvés, pas après avoir lu les 40.

**Où le relire.** [main.py L161–170](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/main.py#L161-L170)

**À réutiliser.** Pour chercher « le plus récent élément qui correspond à une condition » dans une liste, parcourir en `reversed()` et sortir dès que trouvé, plutôt que de scanner toute la liste dans le sens normal.

## Fiche 27 — La boucle bornée : les sorties d'abord

**Projet.** Dev3Pack AI Engineering Bootcamp

**En une phrase.** Une boucle d'agent vérifie ses conditions d'arrêt avant chaque action, et rend toujours le même reçu, quelle que soit la sortie.

**Pourquoi pour un agent.** Sans sortie, la boucle tourne, dépense et finit en traceback. Quatre sorties suffisent : réponse, répétition, budget, erreur d'outil.

**Analogie.** Le plafond d'une carte bancaire : vérifié avant le paiement, pas après.

**Le mécanisme.**

```python
for step in plan:
    name, args = step["tool"], step.get("args", {})
    if name == "answer":
        return receipt(steps, "answered", answer=args["text"])
    if (name, args) == previous:                # le même appel deux fois
        return receipt(steps, "repeated_call", refusal=...)
    if len(steps) >= budget:                    # le budget, AVANT l'appel
        return receipt(steps, "budget", refusal=...)
    try:
        result = tools[name](**args)            # le dict devient des arguments nommés
    except ToolError as error:                  # l'erreur devient un refus
        return receipt(steps, "tool_error", refusal=...)
    steps.append({"tool": name, "args": args, "result": result})
    previous = (name, args)
```

**Entrée → sortie.** Deux fois `echo("a")` → `stopped_because = 'repeated_call'`. `echo`, puis `answer` → `answer = 'done'`.

**Où le relire.** [ch05 · cellules 13 et 24](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch05/notebook.ipynb) (`run_loop`, puis `respond`, le bot du challenge) · [`agent.py · une seule relance`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/agent.py#L118) quand le JSON est cassé (cours) · [`grounded-research-agent/agent.py · for attempt in (1, 2)`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/agent.py#L281) · [ch08 · cellule 28](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch08/notebook.ipynb) (`MAX_VISITS`).

**À réutiliser.** Écrire les `return` de sortie avant le corps. Un seul format de reçu : `steps`, `stopped_because`, `answer`, `refusal`. Chaque sortie autre que la réponse écrit une phrase pour un lecteur.

## Fiche 28 — La table de transitions

**Projet.** Dev3Pack AI Engineering Bootcamp

**En une phrase.** Un dict dont les clés sont des paires `(état, événement)` décrit tout le graphe ; une paire absente est refusée.

**Pourquoi pour un agent.** L'agent ne peut pas répondre avant d'avoir cherché. L'interdiction est une clé absente, visible d'un coup d'œil.

**Analogie.** Le circuit d'un paiement : saisi, validé, envoyé. « Envoyé » depuis « saisi » n'existe pas.

**Le mécanisme.**

```python
TRANSITIONS = {
    ("planning", "plan_ready"): "retrieving",
    ("retrieving", "hits"): "answering",
    ("answering", "answered"): "done",
}
target = TRANSITIONS.get((current, name))      # None si la paire n'existe pas
new = {"state": target, "visited": [*state["visited"], target], "rejected": None}
```

**Entrée → sortie.** `plan_ready` depuis `planning` → `retrieving`, `visited = ['planning', 'retrieving']`. `answered` depuis `planning` → `rejected = "'answered' is not a declared event in state 'planning'"`.

**Où le relire.** [ch08 · cellules 20, 22, 26 et 28](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch08/notebook.ipynb).

**À réutiliser.** Un tuple comme clé de dict. `.get` qui rend `None` au lieu de lever. `[*ancienne, nouvel]` pour une liste neuve. Un compteur de visites pour borner les relances.

## Fiche 29 — Les closures : des outils rangés avec leurs règles

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** Une fonction définie dans une autre garde l'accès aux variables de la fonction englobante, même après que celle-ci a terminé.

**Pourquoi pour un agent.** Chaque `build_*_agent()` définit ses outils à l'intérieur, avec leurs constantes (`return_windows`). Pas de variable globale, et chaque agent est autonome (critère du rubric : builders « self-contained »).

**Analogie.** Un conseiller qui part en rendez-vous avec la grille tarifaire de son agence dans sa sacoche.

**Le mécanisme.**

```python
def build_refund_agent() -> Agent:
    return_windows = {'Standard': 30, 'Premium': 60}

    @tool(context=True)
    def initiate_refund(customer_id, order_id, reason, tool_context):
        window = return_windows.get(tier, return_windows['Standard'])   # captured
        ...

# Orchestrator: one dict shared by the hooks and the routing tools
turn = {'session_id': session_id, 'customer_id': None, 'request': '', ...}
turn.update(session_id=sid, customer_id=cid, request=request)        # mutate, never rebind
```

**Entrée → sortie.** Un client Premium dont la commande a 45 jours → `window = 60` → retour possible ; Standard → `window = 30` → refus. Le dict `turn` est modifié en place (`turn.update`) : s'il était réassigné (`turn = {...}`) dans un hook, les outils verraient encore l'ancien.

**Où le relire.** [`agent_orchestrator.py · return_windows`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L456) · [`agent_orchestrator.py · turn`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1159).

**À réutiliser.** Les outils d'un agent définis dans son builder. Un état partagé entre fonctions internes = un dict ou un objet qu'on modifie, jamais une variable qu'on réassigne.

## Sur le terrain

Les chapitres de mes formations et de mes projets où ces mécanismes tournent pour de vrai.

- [Dev3Pack, Session 5](/fr/books/dev3pack/session-05/) : fiche 27.
- [Dev3Pack, Session 8](/fr/books/dev3pack/session-08/) : fiches 23, 27 et 28.
- [Dev3Pack, Session 10](/fr/books/dev3pack/session-10/) : fiche 23.
- [Dev3Pack, Session 11](/fr/books/dev3pack/session-11/) : fiche 23.
- [Dev3Pack, Session 12](/fr/books/dev3pack/session-12/) : fiche 23.
- [Dev3Pack, Final assignment](/fr/books/dev3pack/final/) : fiches 23 et 27.
- [AWS Scholars, chapitre 2 · AI Support Agent](/fr/books/aws-scholars/chapter-02/) : fiches 24 et 26.
- [AWS Scholars, chapitre 3 · NovaMart Multi-Agent Support](/fr/books/aws-scholars/chapter-03/) : fiches 25 et 29.
