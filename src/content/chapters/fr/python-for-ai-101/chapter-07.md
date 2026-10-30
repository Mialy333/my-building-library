---
workedOn: 2026-10-22
---

Six fiches sur ce qui se passe quand ça casse : l'exception transformée en refus, le repli dégradé, les erreurs boto3, la règle revérifiée dans le code, le contrat de réponse unique et l'état sans effet de bord.

## Fiche 30 — Les exceptions : lever, attraper, transformer en refus

**Projet.** Dev3Pack AI Engineering Bootcamp

**En une phrase.** Une exception interrompt le flux normal ; on crée ses propres classes (`ToolError`, `Refused`) pour savoir exactement quoi attraper, puis on les transforme en refus lisibles.

**Pourquoi pour un agent.** Un délai dépassé ou un outil en panne ne doit jamais remonter en traceback. Et attraper trop large cache les vrais bugs.

**Analogie.** Un rejet de prélèvement porte un motif codé (provision insuffisante), pas « erreur ».

**Le mécanisme.**

```python
class ToolError(Exception):
    """Raised when a tool's arguments are invalid. Message is safe to show the model."""

try:
    with urllib.request.urlopen(request, timeout=5) as response:
        return json.loads(response.read())["rates"]
except urllib.error.HTTPError as error:        # le serveur a répondu (403…)
    raise ToolError(f"fetch_rates: frankfurter.dev answered HTTP {error.code}") from error
except Exception as error:                     # hors ligne, DNS, délai
    raise ToolError(f"fetch_rates: could not reach frankfurter.dev ({type(error).__name__})") from error
```

**Entrée → sortie.** ch02 : `TimeoutLLM` lève `TimeoutError` ; `answer_with_timeout` rend `"The model did not respond."`, sans citation, `needs_human_review=True`. `raise … from error` garde la cause : `__cause__` vaut le `JSONDecodeError` d'origine.

**Où le relire.** [ch02 · cellule 26](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch02/notebook.ipynb) (`answer_with_timeout`) · [ch04 · cellule 14](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch04/notebook.ipynb) (`fetch_rates`, du plus précis au plus large) · [ch05 · cellule 19](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch05/notebook.ipynb) (l'erreur qui s'échapperait de la boucle) · [`config.py · ConfigError`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/config.py#L23) (jamais de secret dans le message) · [`buyer/check.py · Refused`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/check.py#L52) porte un `FieldResult` ; [`NotYetWritten`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/check.py#L27) : une check non écrite ne laisse jamais passer une signature — cours.

**À réutiliser.** Une classe d'exception par type de refus. Attraper du plus précis au plus général. `raise X from error` pour garder la cause. Une exception qui porte un objet (`Refused.result`) plutôt qu'un simple texte.

## Fiche 31 — `try/except` avec repli dégradé

**Projet.** AI Support Agent (AWS Scholars, chapitre 2)

**En une phrase.** Si l'appel au Code Interpreter échoue, la branche `except` recalcule un résultat simplifié (remise de palier fidélité uniquement) au lieu de laisser l'exception remonter et faire planter tout le tour de conversation.

**Pourquoi pour un agent.** Un client qui demande son escompte ne devrait jamais recevoir une stack trace ; un résultat partiel mais correct vaut mieux qu'une erreur brute.

**Analogie.** Une caisse de supermarché dont le lecteur de carte tombe en panne : la caissière encaisse en liquide plutôt que de renvoyer le client sans rien.

**Le mécanisme.**

```python
try:
    with code_session(REGION) as session:
        response = session.invoke("executeCode", {"code": code, "language": "python", "clearContext": True})
        ...
except Exception as e:
    logger.warning("Code Interpreter unavailable, using fallback: %s", e)
    tier_discount_pct = tier_rates.get(tier, 0.0)
    final_total = round(order_total * (1 - tier_discount_pct), 2)
    ...
```

**Entrée → sortie.** Code Interpreter indisponible, `tier="Gold"`, `order_total=150` → pas d'exception visible côté client : `final_total=135.0` avec `"note": "Computed with fallback..."`.

**Où le relire.** [main.py L290–316](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/main.py#L290-L316)

**À réutiliser.** Tout appel externe (API, sandbox, Lambda) en production devrait avoir une branche de repli explicite : l'utilisateur reçoit une réponse best-effort, jamais une trace d'exception.

## Fiche 32 — Les exceptions boto3

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** boto3 lève toujours `ClientError` ; le vrai motif est dans `exc.response['Error']['Code']`. On traite le cas attendu, on relance (`raise` seul) les autres, et `raise ... from exc` remplace une erreur technique par un message clair sans perdre la cause.

**Pourquoi pour un agent.** Dans un outil, une exception non gérée interrompt l'agent. Renvoyer un dict d'erreur lisible permet au modèle d'expliquer le problème au client ; avaler toutes les erreurs cacherait les vraies pannes.

**Analogie.** Un rejet de virement porte un code motif : « provision insuffisante » se traite, « compte clôturé » remonte au responsable.

**Le mécanisme.**

```python
try:
    _create_workflow_state(session_id, customer_id)
except ClientError as exc:
    if exc.response['Error']['Code'] != 'ConditionalCheckFailedException':
        raise                          # unknown error: propagate
# expected case: session already exists -> clear the previous turn and continue

except ClientError as exc:             # inside a tool: an answer, not a crash
    return {'found': False, 'error': f"DynamoDB error: {exc.response['Error']['Message']}"}

raise ConfigError("No AWS credentials found. ...") from exc
```

**Entrée → sortie.** Deuxième message dans le même `chat` → `ConditionalCheckFailedException` attendue → `Session … already existed: previous results cleared for this new request (version N)`. Une table inaccessible → `{'found': False, 'error': 'DynamoDB error: …'}`, que l'agent reformule pour le client.

**Où le relire.** [`agent_orchestrator.py · initialize_session`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1369) · [`agent_orchestrator.py · check_order_status (erreur)`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L350) · [`config.py · ConfigError`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/config.py#L66).

**À réutiliser.** Jamais de `except Exception: pass`. Dans un outil, renvoyer l'erreur comme donnée ; dans la plomberie, lever une exception nommée avec la consigne de correction.

## Fiche 33 — Le garde-fou dans le code, et l'idempotence

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** Avant toute écriture, l'outil revérifie la règle métier lui-même ; et rejouer la même demande renvoie le résultat existant au lieu d'en créer un second.

**Pourquoi pour un agent.** Le RefundAgent décide, mais un LLM peut se tromper ou être manipulé (cas « admin mode » des tests adversariaux). Le code est la dernière ligne de défense avant l'effet réel.

**Analogie.** Le conseiller valide le crédit, mais le système refuse tout montant au-delà du plafond ; et un ordre saisi deux fois n'est exécuté qu'une fois.

**Le mécanisme.**

```python
if order.get('status') == 'return_initiated':                 # idempotency
    return {'success': True, 'already_initiated': True,
            'return_reference': order.get('return_reference'), ...}
if order.get('status') != 'delivered':
    return {'success': False, 'message': f"Order status is '{order.get('status')}'; ..."}
if days is None or days > window:                              # re-check the LLM decision
    return {'success': False, 'message': f"Outside the {window}-day return window ..."}

orders_table.update_item(..., ConditionExpression='#s = :delivered', ...)   # still delivered?
```

**Entrée → sortie.** Test adversarial « admin mode » sur ORD-27180 : non bloqué par le guardrail, mais retour refusé par les agents (95 jours > 60). Une seconde demande sur une commande déjà en retour → la même référence `RET-…`, `already_initiated: True`.

**Où le relire.** [`agent_orchestrator.py · initiate_refund`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L520) · [`agent_orchestrator.py · contrôles`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L557).

**À réutiliser.** « Le LLM décide, le code garantit » : toute règle à effet réel (argent, statut, accès) est revérifiée dans l'outil qui écrit. Une écriture conditionnelle sur l'état attendu, et un retour idempotent.

## Fiche 34 — Contrat de réponse centralisé

**Projet.** AI Support Agent (AWS Scholars, chapitre 2)

**En une phrase.** Chaque branche du handler Lambda `order_tracker.py` repasse par un seul helper `_response(status_code, body)`, qui garantit la forme exacte attendue par l'intégration proxy d'API Gateway (`statusCode`, `headers`, un `body` JSON sérialisé en chaîne).

**Pourquoi pour un agent.** Si une seule branche oubliait de sérialiser le `body` en JSON ou d'ajouter le bon header, API Gateway renverrait une erreur opaque côté agent, difficile à relier à la vraie cause côté Lambda.

**Analogie.** Un formulaire administratif à remplir toujours dans le même format, pour que le guichet qui le reçoit n'ait jamais à deviner où chercher l'information.

**Le mécanisme.**

```python
def _response(status_code: int, body: dict) -> dict:
    return {
        "statusCode": status_code,
        "headers":    {"Content-Type": "application/json"},
        "body":       json.dumps(body),
    }
```

**Entrée → sortie.** `_response(404, {"error": "Order ORD-999 not found"})` → le dict exact qu'API Gateway attend en sortie d'une intégration proxy, prêt à repartir vers le client sans transformation supplémentaire.

**Où le relire.** [order\_tracker.py L74–86](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/lambda/order_tracker.py#L74-L86)

**À réutiliser.** Dès que plusieurs chemins de code doivent renvoyer le même format de sortie (une API, un protocole, un contrat d'intégration), centraliser dans une petite fonction — le garde-fou le moins cher contre un bug de format qui ne se voit qu'en production.

## Fiche 35 — État sans effet de bord

**Projet.** AI Support Agent (AWS Scholars, chapitre 2)

**En une phrase.** `_orders()` et `_customers()` sont rappelées à chaque invocation Lambda et renvoient chaque fois un dict littéral neuf, plutôt que de lire une variable globale mutable définie une seule fois au niveau du module.

**Pourquoi pour un agent.** AWS Lambda réutilise parfois le même environnement d'exécution entre deux invocations ; une structure de données mutée par une invocation précédente resterait visible à l'invocation suivante, pour un client différent.

**Analogie.** Un tableau blanc qu'on efface et redessine entièrement avant chaque réunion, plutôt que d'espérer que personne n'a laissé de notes de la réunion précédente.

**Le mécanisme.**

```python
def _orders():
    """Return the mock order database."""
    return {
        "ORD-001": {...},
        ...
    }
```

**Entrée → sortie.** Deux invocations successives de la même Lambda → deux dicts `orders` physiquement différents en mémoire, donc aucune mutation accidentelle de l'un ne peut affecter l'autre.

**Où le relire.** [order\_tracker.py L23–71](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/lambda/order_tracker.py#L23-L71)

**À réutiliser.** Dans un handler serverless/stateless, ne jamais muter une structure de données au niveau module entre deux appels — préférer une fonction qui renvoie une copie fraîche à chaque fois.

## Sur le terrain

Les chapitres de mes formations et de mes projets où ces mécanismes tournent pour de vrai.

- [Dev3Pack, Session 2](/fr/books/dev3pack/session-02/) : fiche 30.
- [Dev3Pack, Session 4](/fr/books/dev3pack/session-04/) : fiche 30.
- [Dev3Pack, Session 5](/fr/books/dev3pack/session-05/) : fiche 30.
- [Dev3Pack, Gecko capstone](/fr/books/dev3pack/gecko/) : fiche 30.
- [AWS Scholars, chapitre 2 · AI Support Agent](/fr/books/aws-scholars/chapter-02/) : fiches 31, 34 et 35.
- [AWS Scholars, chapitre 3 · NovaMart Multi-Agent Support](/fr/books/aws-scholars/chapter-03/) : fiches 32 et 33.
- [DRILLS.ai, chapitre 5 · Phase 2 : le pivot vers la candidature](/fr/books/drills-ai/chapter-05/) : fiche 31.
- [DRILLS.ai, chapitre 6 · Le diagnostic](/fr/books/drills-ai/chapter-06/) : fiche 30.
