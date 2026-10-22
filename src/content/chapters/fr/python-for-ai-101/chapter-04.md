---
workedOn: 2026-10-22
---

Quatre fiches sur les données qui viennent d'AWS : lire DynamoDB, y écrire sous condition, convertir ses types à la frontière, et attendre une ressource sans attendre sans fin.

## Fiche 12 — Lire DynamoDB : clé composite, `query`, tri

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** `get_item` lit un élément par sa clé complète, `query` lit tous les éléments d'une même partition, et `.get('Item')` renvoie `None` quand rien n'est trouvé au lieu de lever une `KeyError`.

**Pourquoi pour un agent.** L'InventoryAgent ne doit jamais inventer une commande. Une absence doit devenir une réponse claire (« No order ORD-X found »), pas un plantage ni une hallucination.

**Analogie.** Un classeur rangé par client (la partition), puis par numéro de commande (le tri) : pour sortir une fiche, il faut les deux.

**Le mécanisme.**

```python
# Orders table: customer_id = partition key, order_id = sort key -> both required
item = table.get_item(Key={'customer_id': customer_id, 'order_id': order_id}).get('Item')

response = table.query(KeyConditionExpression=Key('customer_id').eq(customer_id))
orders.sort(key=lambda o: o.get('order_date', ''), reverse=True)
```

**Entrée → sortie.** Rejoué : `{}.get('Item')` → `None`. Trois commandes datées `2026-08-01`, `2026-09-15` et sans date → ordre `['B', 'A', 'C']` : les dates ISO `YYYY-MM-DD` se trient comme du texte, et une date absente (`''`) part en fin de liste. Un `get_item` avec le seul `order_id` → `ValidationException: The provided key element does not match the schema` (piège E2 du pense-bête).

**Où le relire.** [`agent_orchestrator.py · check_order_status`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L324) · [`agent_orchestrator.py · list_customer_orders`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L423).

**À réutiliser.** Toujours `.get('Item')`, puis un message « not found » explicite. `lambda` comme clé de tri, avec une valeur par défaut pour les champs manquants.

## Fiche 13 — Écrire sous condition : le verrou optimiste

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** Une `ConditionExpression` fait vérifier une condition par DynamoDB au moment même de l'écriture, de façon atomique ; si elle échoue, on relit, on attend un peu plus à chaque fois, et on réessaie un nombre borné de fois.

**Pourquoi pour un agent.** Plusieurs agents écrivent dans la même ligne WorkflowState. Sans condition, le dernier qui écrit efface le travail des autres sans que personne ne le voie.

**Analogie.** Le double contrôle d'un virement : il ne part que si le solde lu au départ n'a pas bougé entre-temps.

**Le mécanisme.**

```python
table.put_item(Item=state, ConditionExpression='attribute_not_exists(session_id)')

for attempt in range(max_retries):
    try:
        table.update_item(..., ConditionExpression='version = :expected_version')
        return _read_workflow_state(session_id)
    except dynamodb.meta.client.exceptions.ConditionalCheckFailedException:
        if attempt == max_retries - 1:
            raise RuntimeError(f"WorkflowState update failed after {max_retries} retries ...")
        expected_version = int(_read_workflow_state(session_id)['version'])
        time.sleep(0.1 * (attempt + 1))
```

**Entrée → sortie.** Rejoué : attentes successives `[0.1, 0.2]` seconde, puis `RuntimeError` au troisième échec. Côté projet, le WorkflowState d'un retour passe de `version 0` (`initialize_session`) à `1` (Inventory), `2` (Refund), `3` (Communication) ; chaque écriture porte la version lue avant d'appeler le worker.

**Où le relire.** [`agent_orchestrator.py · _create_workflow_state`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L122) · [`agent_orchestrator.py · _update_workflow_state`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L166).

**À réutiliser.** Un champ `version` sur tout état partagé. Lire la version avant le travail, écrire avec `version = :expected`. Retry borné avec back-off, et un message qui nomme la session à l'échec.

## Fiche 14 — Les types aux frontières : `Decimal`, dates, flux

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** Ce qui sort d'AWS n'est pas toujours du JSON natif : DynamoDB renvoie des `Decimal`, `invoke_agent_runtime` un flux à lire avec `.read()`, et deux dates ne se soustraient que si elles sont dans le même fuseau.

**Pourquoi pour un agent.** Un outil dont la réponse ne se sérialise pas fait échouer tout le tour de l'agent. Une date mal calculée fait accorder ou refuser un retour à tort.

**Analogie.** Un chèque en devise étrangère : il faut le convertir avant de l'encaisser.

**Le mécanisme.**

```python
def _to_json_safe(item: dict) -> dict:
    return json.loads(json.dumps(item, default=str))          # Decimal -> str

start = datetime.strptime(date_str, '%Y-%m-%d').replace(tzinfo=timezone.utc)
return (datetime.now(timezone.utc) - start).days              # timedelta -> int

body = response['response'].read()                            # StreamingBody -> bytes
return json.loads(body)
```

**Entrée → sortie.** Rejoué : `json.dumps({'total_orders': Decimal('5')})` → `Object of type Decimal is not JSON serializable` ; avec `_to_json_safe` → `{'customer_id': 'CUST-001', 'total_orders': '5'}`. Commande du `2026-08-23`, aujourd'hui `2026-10-22` → `60` jours. Une date sans fuseau moins une date UTC → `can't subtract offset-naive and offset-aware datetimes`.

**Où le relire.** [`agent_orchestrator.py · _to_json_safe`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L219) · [`agent_orchestrator.py · _days_since`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L235) · [`agent_orchestrator.py · invoke_agent`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L2102).

**À réutiliser.** Convertir à la sortie de chaque outil avec `default=str`. Toutes les dates en UTC « aware ». Le calcul de jours fait dans le code et transmis au modèle (`days_since_order`), jamais laissé au modèle.

## Fiche 15 — Paginator et attente bornée

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** Un paginator enchaîne les pages d'une API AWS ; une boucle `while` avec une échéance (`deadline`) attend qu'une ressource soit prête sans jamais tourner indéfiniment.

**Pourquoi pour un agent.** Les ressources d'agent (guardrail, Memory, Runtime) mettent du temps à devenir prêtes. Les déployer exige d'attendre leur statut, avec une limite.

**Analogie.** Feuilleter un relevé bancaire page par page jusqu'à la dernière ; et appeler le service client toutes les 3 minutes, mais raccrocher au bout d'une heure.

**Le mécanisme.**

```python
for page in cf.get_paginator('list_exports').paginate():
    for export in page['Exports']:
        exports[export['Name']] = export['Value']

deadline = time.time() + 120
while time.time() < deadline:
    status = bedrock_client.get_guardrail(guardrailIdentifier=guardrail_id)['status']
    if status == 'READY':
        break
    if status == 'FAILED':
        raise RuntimeError(f"Guardrail {guardrail_id} is in FAILED status")
    time.sleep(3)
```

**Entrée → sortie.** Au déploiement, le guardrail passe de `CREATING` à `READY` en quelques secondes, puis la version numérotée est publiée (`2` dans le projet final, `jtjyz5e3odep`). La Memory attend `ACTIVE` jusqu'à 300 s ; un statut `FAILED` lève une erreur avec `failureReason` au lieu d'attendre.

**Où le relire.** [`config.py · _load_cf_exports`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/config.py#L50) · [`agent_orchestrator.py · publish_guardrail_version`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1619) · [`agent_orchestrator.py · configure_memory`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1806).

**À réutiliser.** Toute API qui « liste » passe par un paginator. Toute attente a une échéance et traite explicitement l'état d'échec.

## Sur le terrain

Les chapitres de mes formations où ces mécanismes tournent pour de vrai.

- [AWS Scholars, chapitre 3 · NovaMart Multi-Agent Support](/fr/books/aws-scholars/chapter-03/) : fiches 12, 13, 14 et 15.
