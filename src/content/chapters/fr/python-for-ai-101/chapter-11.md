---
workedOn: 2026-10-22
---

Six fiches sur ce qui entoure l'agent : appeler un autre programme, lire du code sans l'exécuter, recevoir une requête HTTP, exposer un outil en serveur MCP, et mesurer par les logs.

## Fiche 53 — `subprocess` : appeler un autre programme

**Projet.** Dev3Pack AI Engineering Bootcamp

**En une phrase.** `subprocess.run` lance une commande (ici `git`) et récupère sa sortie comme texte.

**Pourquoi pour un agent.** Le scan de clés lit ce qui va être commité. Le signeur refuse de lire une clé rangée dans un repo git.

**Analogie.** Demander le relevé au service d'à côté plutôt que le recopier à la main.

**Le mécanisme.**

```python
done = subprocess.run(
    ["git", *args], capture_output=True, text=True, errors="ignore", check=True
)
out = subprocess.run(
    ["git", "-C", str(path.parent), "rev-parse", "--is-inside-work-tree"],
    capture_output=True, text=True, timeout=10,
)
```

**Entrée → sortie.** Dans le repo → `returncode = 0`, `stdout = 'true'`. `errors="ignore"` : un PNG commité ne fait plus planter le scan (le correctif du 4 oct, signalé dans l'issue Gecko #12).

**Où le relire.** [`my-gecko-buyer/scripts/scan_secrets.py · _git`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/scripts/scan_secrets.py#L62) · [`buyer/signer.py · inside_git_repo`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/signer.py#L71) (cours) · la cellule *preflight*, par exemple [ch01 · cellule 2](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch01/notebook.ipynb) (`git clone` sur Colab).

**À réutiliser.** Les arguments en liste, jamais une chaîne passée au shell. Un `timeout`. `capture_output=True, text=True`. Attraper `OSError` et `subprocess.SubprocessError`.

## Fiche 54 — `subprocess` et validation avant déploiement

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** `subprocess.run` lance un programme externe avec une liste d'arguments et renvoie son code de retour ; valider toutes les entrées avant de le lancer évite un échec tardif.

**Pourquoi pour un agent.** Le Runtime se déploie avec la CLI `agentcore`, pilotée depuis Python. Un `agentcore deploy` dure 10 à 20 minutes : partir avec un KB ID vide donnerait un Runtime aux retrievers muets.

**Analogie.** Vérifier que toutes les pièces du dossier de prêt sont là avant de l'envoyer au comité, plutôt que d'attendre trois semaines un refus pour pièce manquante.

**Le mécanisme.**

```python
result = subprocess.run([cli_path(), *args], cwd=PROJECT_ROOT, env=env,
                        capture_output=capture, text=True)
if check and result.returncode != 0:
    raise RuntimeError(f"agentcore {' '.join(args)} failed (exit {result.returncode})")

missing = [key for key, value in runtime_env.items() if not value]
if missing:
    raise ValueError(f"Missing runtime environment values: {', '.join(missing)}")
if not guardrail_version or str(guardrail_version).upper() == 'DRAFT':
    raise ValueError("GUARDRAIL_VERSION must be a numbered version, not DRAFT")
```

**Entrée → sortie.** Rejoué : `{'RETURNS_KB_ID': 'ABC', 'SHIPPING_KB_ID': '', 'GUARDRAIL_VERSION': '2'}` → `missing = ['SHIPPING_KB_ID']` → arrêt immédiat. `shutil.which('agentcore')` vérifie d'abord que la CLI existe. Les arguments sont une liste, jamais une chaîne concaténée : aucun risque d'injection par un nom de fichier.

**Où le relire.** [`agentcore_cli.py · run`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agentcore_cli.py#L103) · [`agent_orchestrator.py · deploy_to_agentcore_runtime`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1738).

**À réutiliser.** Une fonction de validation qui liste tous les manques d'un coup. `subprocess.run` avec une liste, `check` sur le code de retour, `capture_output` quand on veut afficher l'erreur.

## Fiche 55 — Lire du code sans l'exécuter : le module `ast`

**Projet.** AI Support Agent (AWS Scholars, chapitre 2)

**En une phrase.** `setup_permissions.py` lit les valeurs de `KB_ID`, `MEMORY_ID`, `REGION` dans `main.py` en parsant son texte avec `ast.parse()`, sans jamais `import`-er ni exécuter ce fichier.

**Pourquoi pour un agent.** Un script de configuration appelé pendant le développement peut tomber sur un `main.py` encore incomplet ou contenant une erreur ; l'importer planterait le script de setup pour une raison qui n'a rien à voir avec les permissions à poser.

**Analogie.** Lire la table des matières d'un livre pour savoir de quoi il parle, sans avoir besoin de le lire en entier ni de suivre ses instructions.

**Le mécanisme.**

```python
def read_settings(source):
    settings = {}
    for node in ast.parse(source).body:
        if isinstance(node, ast.Assign):
            names = [target.id for target in node.targets if isinstance(target, ast.Name)]
        ...
            try:
                settings[name] = ast.literal_eval(node.value)
            except (ValueError, TypeError):
                settings[name] = None
```

**Entrée → sortie.** Le texte de `main.py` (jamais importé) → `{"KB_ID": "AFJJCJNMED", "MEMORY_ID": "CustomerSupportMemory-D0IRyF6feE", "REGION": "us-east-1"}`.

**Où le relire.** [setup\_permissions.py L21–45](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/setup_permissions.py#L21-L45)

**À réutiliser.** Pour lire une configuration dans un fichier source potentiellement non fiable ou inachevé, parser avec `ast` plutôt qu'importer : impossible d'exécuter accidentellement du code cassé ou malveillant.

## Fiche 56 — Les entrées HTTP : entrypoint du Runtime et Lambda

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** Un serveur d'agent reçoit une requête sous forme de dict et renvoie un dict : `@app.entrypoint` le fait pour AgentCore Runtime, `lambda_handler(event, context)` pour une fonction Lambda.

**Pourquoi pour un agent.** C'est la frontière avec le monde extérieur. La Lambda proxy lit l'identité du client dans le token Cognito, jamais dans le corps de la requête : un client ne peut pas se faire passer pour un autre en modifiant la page.

**Analogie.** Le guichet de la banque : on vérifie la pièce d'identité au comptoir, pas le nom écrit sur le bordereau.

**Le mécanisme.**

```python
@app.entrypoint                                     # POST /invocations on the Runtime
def invoke(payload, context=None):
    prompt = payload.get('prompt') or payload.get('message') or ''
    ...
    return {'result': text, 'session_id': session_id, 'trace_id': tracer.last_trace_id}

def lambda_handler(event, context):                 # Lambda behind a Function URL
    try:
        customer_id, name = _authenticated_customer(event)   # from the Cognito token
    except PermissionError as exc:
        return _response(401, {'error': str(exc)})
    ...

def _claims(token: str) -> dict:                    # JWT payload, base64url without padding
    payload = token.split('.')[1]
    return json.loads(base64.urlsafe_b64decode(payload + '=' * (-len(payload) % 4)))
```

**Entrée → sortie.** Rejoué : un payload base64url de 27 caractères → `-27 % 4 = 1` signe `=` ajouté → `{'client_id': 'abc'}`. Sans le padding, `b64decode` lève une erreur. Une requête sans en-tête `Authorization` → `401 Missing bearer token` ; un message de plus de 2 000 caractères → `400`.

**Où le relire.** [`agent_orchestrator.py · run_serve`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L2324) · [`lambda_function.py · lambda_handler`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/frontend_proxy/lambda_function.py#L104) · [`lambda_function.py · _authenticated_customer`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/frontend_proxy/lambda_function.py#L69) · [`lambda_function.py · _claims`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/frontend_proxy/lambda_function.py#L52).

**À réutiliser.** L'identité vient toujours d'un token validé côté serveur. Les erreurs métier converties en codes HTTP (400, 401, 502). Les entrées bornées (longueur, format de `session_id`) avant tout appel coûteux.

## Fiche 57 — Le serveur MCP : une fonction devient un outil

**Projet.** Dev3Pack AI Engineering Bootcamp

**En une phrase.** Avec le SDK MCP, une fonction Python typée et documentée devient un outil que n'importe quel agent peut appeler ; `mcp.tool()` l'enregistre.

**Pourquoi pour un agent.** La vérification des sept champs devient un service ouvert à d'autres agents, qui ne détient aucune clé : il peut juger, jamais payer.

**Analogie.** Un guichet de vérification d'IBAN : on lui demande si c'est bon, il ne fait pas le virement.

**Le mécanisme.**

```python
mcp = MCPServer("gecko-check")

def check_purchase(intent: dict[str, Any], prepared_answer: dict[str, Any],
                   rpc_url: str | None = None) -> dict[str, Any]:
    """Compare a prepared purchase with the pinned intent; refuse on the first mismatch."""
    ...

mcp.tool()(check_purchase)       # même effet que @mcp.tool() au-dessus du def

if __name__ == "__main__":       # seulement quand le fichier est lancé, pas importé
    mcp.run()
```

Côté client, `async def main()`, `async with stdio_client(server) …` et `await session.call_tool(…)` attendent la réponse sans bloquer ; `asyncio.run(main())` lance le tout.

**Entrée → sortie.** `server/try_client.py` pose la question du cas « two bags of beans » et reçoit `{"passed": false, "field": "quantity", "asked": 2, "found": 1, "note": ""}`.

**Où le relire.** [`my-gecko-buyer/server/check_server.py · check_purchase`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/server/check_server.py#L34) et [`server/try_client.py`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/server/try_client.py) (projet 03) · [ch12 · cellules 6 à 16](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch12/notebook.ipynb) (lire et classer la surface d'un serveur) · [ch13 · cellule 5](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch13/notebook.ipynb) (déclarer un outil en lecture seule).

**À réutiliser.** Les type hints deviennent le schéma d'entrée, la docstring la description. Un outil, une responsabilité. L'URL vérifiée avant tout appel réseau. `ROOT = Path(__file__).resolve().parents[1]` et `sys.path.insert(0, str(ROOT))` pour lancer le script de n'importe où.

## Fiche 58 — Des métriques par les logs (EMF)

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** Un log JSON au format EMF (Embedded Metric Format) est transformé en métriques par CloudWatch ; botocore permet d'accrocher une fonction à une étape de chaque requête, ici pour ajouter l'en-tête qui active ce format.

**Pourquoi pour un agent.** Le rôle d'exécution du Runtime n'avait pas la permission `PutMetricData`, mais pouvait écrire des logs. Les métriques par agent (invocations, latence, blocages du guardrail) passent donc par les logs, et alimentent le dashboard `NovaMart-Agents`.

**Analogie.** Une écriture comptable bien libellée : le grand livre suffit, et le reporting en est extrait automatiquement.

**Le mécanisme.**

```python
_metrics_logs.meta.events.register(
    'before-sign.logs.PutLogEvents',
    lambda request, **kwargs: request.headers.__setitem__('x-amzn-logs-format', 'json/emf'),
)
payload = {
    '_aws': {'Timestamp': ..., 'CloudWatchMetrics': [{'Namespace': 'NovaMart/Agents',
             'Dimensions': [['Agent']], 'Metrics': [{'Name': 'AgentLatencyMs', ...}]}]},
    'Agent': agent_name, 'AgentInvocations': 1, 'AgentLatencyMs': round(latency_ms, 1),
}
try:
    _metrics_logs.put_log_events(..., logEvents=[{'message': json.dumps(payload), ...}])
except Exception as exc:
    logger.warning("Metric emission failed for %s: %s", agent_name, exc)   # never break the reply
```

**Entrée → sortie.** Dans le projet : le dashboard montre les invocations par agent et un pic de 5 blocages sur `OrchestratorAgent` (les 5 attaques adversariales). La métrique native `AWS/Bedrock/Guardrails` n'est pas remontée ; seule la métrique maison l'a été.

**Où le relire.** [`agent_orchestrator.py · événement botocore`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L919) · [`agent_orchestrator.py · _emit_agent_metrics`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L927) · [`scripts/create_dashboard.py · main`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/scripts/create_dashboard.py#L73).

**À réutiliser.** Une métrique par agent avec une dimension `Agent`. L'émission dans un `try` qui ne casse jamais la réponse. Vérifier les permissions du rôle avant de choisir le mécanisme (API ou logs).

## Sur le terrain

Les chapitres de mes formations où ces mécanismes tournent pour de vrai.

- [Dev3Pack, Session 1](/fr/books/dev3pack/session-01/) : fiche 53.
- [Dev3Pack, Session 12](/fr/books/dev3pack/session-12/) : fiche 57.
- [Dev3Pack, Session 13](/fr/books/dev3pack/session-13/) : fiche 57.
- [Dev3Pack, Gecko capstone](/fr/books/dev3pack/gecko/) : fiches 53 et 57.
- [AWS Scholars, chapitre 2 · AI Support Agent](/fr/books/aws-scholars/chapter-02/) : fiche 55.
- [AWS Scholars, chapitre 3 · NovaMart Multi-Agent Support](/fr/books/aws-scholars/chapter-03/) : fiches 54, 56 et 58.
