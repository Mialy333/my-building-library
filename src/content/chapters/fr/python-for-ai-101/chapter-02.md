---
workedOn: 2026-10-22
---

Cinq fiches sur la façon de ranger un projet d'agent : un seul fichier pour plusieurs commandes, une ligne de commande pour tester en local, la configuration lue dans l'environnement, et les clients créés une seule fois.

## Fiche 1 — Un fichier, plusieurs commandes

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** `if __name__ == '__main__'` n'exécute un bloc que si le fichier est lancé directement ; `sys.argv` y lit la commande tapée, et `sys.path` dit où chercher les modules à importer.

**Pourquoi pour un agent.** Le même fichier sert au test local (`test`, `chat`), au déploiement (`deploy`) et au serveur du Runtime (`serve`). Le code testé est donc exactement le code déployé.

**Analogie.** Un seul dossier client, plusieurs guichets : chacun l'ouvre à la page qui le concerne.

**Le mécanisme.**

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

**Entrée → sortie.** `python src/agent_orchestrator.py chat` → `sys.argv == ['src/agent_orchestrator.py', 'chat']` → `run_chat()`. Importé par `tests/test_agent.py`, le même fichier n'exécute aucune commande : `__name__` vaut alors `'agent_orchestrator'`. Dans le paquet du Runtime, sans argument, le fichier marqueur fait choisir `serve`.

**Où le relire.** [`agent_orchestrator.py · sys.path`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L53) · [`agent_orchestrator.py · __main__`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L2381).

**À réutiliser.** Un point d'entrée unique avec des sous-commandes `test`, `chat`, `deploy`, `serve`. Le chemin des imports calculé depuis `__file__`, jamais depuis le dossier courant.

## Fiche 2 — CLI locale `argparse` + `asyncio.run()`

**Projet.** AI Support Agent (AWS Scholars, chapitre 2)

**En une phrase.** Le bloc `if __name__ == "__main__":` transforme `invoke()` (une coroutine) en commande testable localement, via `argparse` pour lire les arguments et `asyncio.run()` pour exécuter la coroutine depuis du code synchrone.

**Pourquoi pour un agent.** Sans ce pont, la seule façon de tester `invoke()` serait de déployer d'abord — ce qui rend chaque itération coûteuse.

**Analogie.** Une télécommande universelle : un seul bouton synchrone (« appuyer ») qui déclenche en coulisses un mécanisme qui, lui, tourne en continu.

**Le mécanisme.**

```python
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("payload", type=str)
    args = parser.parse_args()
    response = asyncio.run(invoke(json.loads(args.payload)))
    print(response)
```

**Entrée → sortie.** `uv run main.py '{"prompt": "Hello", ...}'` → la coroutine `invoke()` s'exécute jusqu'au bout et sa réponse s'imprime dans le terminal (seulement si `main()` remplace `app.run()`, qui lui démarre un serveur local et ignore l'argument).

**Où le relire.** [main.py L408–420](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/main.py#L408-L420)

**À réutiliser.** `argparse` + `asyncio.run()` est le combo standard pour donner une interface ligne de commande à n'importe quelle fonction async, indépendamment du serveur qui l'enveloppera en production.

## Fiche 3 — Configuration et environnement

**Projet.** Dev3Pack AI Engineering Bootcamp

**En une phrase.** Les réglages viennent des variables d'environnement (`os.environ`, fichier `.env`) ; le code les valide et refuse de démarrer si c'est incomplet, sans jamais afficher la clé.

**Pourquoi pour un agent.** Une clé écrite dans le code finit sur GitHub. Un fournisseur mal orthographié doit échouer au démarrage, pas au milieu d'un run.

**Analogie.** Un coffre dont le code n'est pas écrit sur la porte.

**Le mécanisme.**

```python
def load_settings(env: Mapping[str, str] | None = None, dotenv_path=None) -> Settings:
    if env is None:
        load_dotenv(dotenv_path)
        env = os.environ
    provider = env.get("BOOTCAMP_PROVIDER", "fake").strip() or "fake"
    if provider not in KNOWN_PROVIDERS:
        raise ConfigError(f"Unknown BOOTCAMP_PROVIDER {provider!r}; expected one of {KNOWN_PROVIDERS}")
```

**Entrée → sortie.** `load_settings(env={})` → `Settings(provider='fake', model=None, api_key=None, base_url=None)`. `{"BOOTCAMP_PROVIDER": "gpt-9"}` → `Unknown BOOTCAMP_PROVIDER 'gpt-9'; expected one of ('fake', 'ollama', 'anthropic', 'openai')`. Anthropic sans clé → `… needs an API key in the environment; see .env.example. (The key itself is never printed.)`

**Où le relire.** [`config.py · load_settings`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/config.py#L35) et [`llm.get_client`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/llm.py#L111) — cours · [ch02 · cellule 22](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch02/notebook.ipynb) · [ch13 · cellule 23](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch13/notebook.ipynb) (`GECKO_LIVE` : le mode réel s'active explicitement) · [ch14 · cellule 15](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch14/notebook.ipynb) (`SMOKE_URL` absent : rien n'est appelé) · [`buyer/mcp_client.py · GECKO_MCP_URL`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/mcp_client.py#L37) (avec une valeur par défaut).

**À réutiliser.** Un paramètre `env` injectable, pour tester sans toucher au vrai environnement. Une valeur par défaut sûre (`fake`). Une liste fermée de valeurs acceptées. Les actions coûteuses derrière une variable explicite.

## Fiche 4 — La configuration paresseuse

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** `load_dotenv()` copie le fichier `.env` dans `os.environ` ; une fonction `__getattr__` définie au niveau d'un module calcule une valeur seulement quand on la demande, puis la garde en cache.

**Pourquoi pour un agent.** Les noms de tables, de buckets et les ID de modèles changent d'un compte à l'autre. Lus dans l'environnement et les exports CloudFormation, ils ne sont jamais écrits dans le code (critère du rubric : « Models via config.\* constants only »).

**Analogie.** Un coffre au guichet : on ne l'ouvre que quand un client demande son contenu, et on garde la copie sous la main pour le suivant.

**Le mécanisme.**

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

**Entrée → sortie.** Rejoué sur un module de test : deux lectures de `ORDERS_TABLE` → `udacity-agentcore-orders` deux fois, mais un seul appel au chargeur (`loader calls: ['ORDERS_TABLE']`). Les KB IDs et le guardrail ne sont pas mis en cache, pour relire le `.env` à chaque fois. Sans stack déployée, l'accès lève `ConfigError` avec la consigne « Deploy infrastructure/starter\_stack.yaml first ».

**Où le relire.** [`config.py · load_dotenv`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/config.py#L23) · [`config.py · __getattr__`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/config.py#L175).

**À réutiliser.** Un module `config.py` comme seule source des réglages ; l'import ne fait aucun appel réseau ; les valeurs susceptibles de changer en cours de session (`.env` modifié) ne sont pas mises en cache.

## Fiche 5 — Clients et logger au niveau module

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** Le code écrit hors de toute fonction s'exécute une seule fois, au premier import : c'est là qu'on crée les clients AWS et le logger, partagés ensuite par toutes les fonctions.

**Pourquoi pour un agent.** Un agent appelle ses outils des dizaines de fois par requête. Recréer un client boto3 à chaque appel ajoute de la latence et des connexions inutiles.

**Analogie.** Le standard téléphonique installé une fois pour tout l'étage, plutôt qu'une ligne tirée à chaque appel.

**Le mécanisme.**

```python
logger   = logging.getLogger(__name__)
dynamodb = boto3.resource('dynamodb', region_name=config.AWS_REGION)   # Python types
logs_client = boto3.client('logs', region_name=config.AWS_REGION)     # raw API format

logger.warning("Blocked cross-customer access: session %s requested %s", bound, customer_id)
```

**Entrée → sortie.** `boto3.client('dynamodb')` renvoie `{'customer_id': {'S': 'CUST-001'}}` ; `boto3.resource('dynamodb').Table(...)` renvoie `{'customer_id': 'CUST-001'}`. Le projet utilise `resource` pour DynamoDB, `client` pour tout le reste. Le logger porte le nom du module (`agent_orchestrator`), filtrable dans CloudWatch.

**Où le relire.** [`agent_orchestrator.py · logger`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L70) · [`agent_orchestrator.py · clients boto3`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L100).

**À réutiliser.** Un client par service, créé une fois, avec la région venue de la config. `%s` dans les messages de log plutôt qu'une f-string : le texte n'est formaté que si le log est émis.

## Sur le terrain

Les chapitres de mes formations et de mes projets où ces mécanismes tournent pour de vrai.

- [Dev3Pack, Session 2](/fr/books/dev3pack/session-02/) : fiche 3.
- [Dev3Pack, Session 13](/fr/books/dev3pack/session-13/) : fiche 3.
- [Dev3Pack, Session 14](/fr/books/dev3pack/session-14/) : fiche 3.
- [Dev3Pack, Gecko capstone](/fr/books/dev3pack/gecko/) : fiche 3.
- [AWS Scholars, chapitre 2 · AI Support Agent](/fr/books/aws-scholars/chapter-02/) : fiche 2.
- [AWS Scholars, chapitre 3 · NovaMart Multi-Agent Support](/fr/books/aws-scholars/chapter-03/) : fiches 1, 4 et 5.
- [DRILLS.ai, chapitre 3 · Installer et reprendre sans rien perdre](/fr/books/drills-ai/chapter-03/) : fiche 3.
- [DRILLS.ai, chapitre 10 · Déployer et exploiter](/fr/books/drills-ai/chapter-10/) : fiche 3.
