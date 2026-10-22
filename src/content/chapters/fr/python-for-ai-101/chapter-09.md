---
workedOn: 2026-10-22
---

Six fiches sur l'agent vu comme un objet Python : ce qu'il contient, ce qu'on lui injecte, les hooks qui l'encadrent, l'interface qu'on implémente pour lui, et la mémoire copiée par utilisateur.

## Fiche 42 — L'agent est un objet Python

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** Un `Agent` Strands assemble un modèle (`BedrockModel`), un prompt système et une liste d'outils ; il est appelable comme une fonction (`agent(prompt)`), garde son historique dans `agent.messages` et un état invisible du modèle dans `agent.state`.

**Pourquoi pour un agent.** Vider `agent.messages` avant chaque requête empêche un client d'hériter de la conversation d'un autre. Écrire le client de la session dans `agent.state`, et le relire dans l'outil via `ToolContext`, rend l'isolation client indépendante du prompt.

**Analogie.** Un conseiller : sa fiche de poste (prompt), ses outils (accès aux systèmes), son carnet de notes (messages) qu'on remet à zéro entre deux clients, et le badge du client en cours (state) que les systèmes vérifient.

**Le mécanisme.**

```python
model = BedrockModel(model_id=config.WORKER_MODEL_ID, temperature=0.1,
                     region_name=config.AWS_REGION)
return Agent(model=model, system_prompt=system_prompt,
             tools=[check_order_status, get_customer_tier, list_customer_orders])

# _run_worker: one routing step
agent.messages = []                                              # fresh history
agent.state.set('session_customer_id', customer_id)              # bound customer
agent_result = agent(prompt)                                     # reasoning + tool loop
result = str(agent_result)                                       # final text
getattr(agent_result, 'stop_reason', '') == 'guardrail_intervened'

# inside a tool
bound = tool_context.agent.state.get('session_customer_id')
if bound and customer_id != bound:
    return {'found': False, 'access_denied': True, ...}
```

**Entrée → sortie.** Rejoué : `getattr(obj, 'stop_reason', '')` → `end_turn` sur un objet qui l'a, `''` sinon, sans exception. Test adversarial « sonde d'isolation » (CUST-002 demande les données de CUST-001) → refus. Les températures suivent le rubric : 0.0 pour router et récupérer, 0.1 pour les faits et décisions, 0.2 pour la synthèse, 0.3 pour la rédaction.

**Où le relire.** [`agent_orchestrator.py · build_inventory_agent`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L293) · [`agent_orchestrator.py · _run_worker`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1243) · [`agent_orchestrator.py · _check_customer_scope`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L256) · [`agent_orchestrator.py · _guardrail_intervened`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L972).

**À réutiliser.** Un builder par agent qui renvoie un seul `Agent`. Historique vidé par requête. L'identité de session dans `agent.state`, vérifiée dans chaque outil qui lit ou écrit des données client. Le motif commun des routages factorisé dans une seule fonction (`_run_worker`).

## Fiche 43 — `Protocol` et injection de dépendances

**Projet.** Dev3Pack AI Engineering Bootcamp

**En une phrase.** Un `Protocol` décrit la méthode qu'un objet doit avoir (`complete(system, user) -> str`) ; on passe cet objet en paramètre au lieu de le créer à l'intérieur.

**Pourquoi pour un agent.** On remplace le vrai modèle par `FakeLLM`, le réseau par une fonction, la blockchain par un enregistrement, sans toucher à l'agent. C'est ce qui rend tout testable hors ligne.

**Analogie.** Une prise électrique standard : tout appareil qui a la bonne fiche se branche.

**Le mécanisme.**

```python
class LLMClient(Protocol):
    def complete(self, system: str, user: str) -> str: ...

class FakeLLM:                                   # n'hérite de rien : il a la méthode
    def complete(self, system, user):
        self.calls.append((system, user))         # chaque appel est noté
        ...

def convert_currency(amount, source, target, fetch=fetch_rates):   # dépendance injectable
    rates = fetch(source)
```

**Entrée → sortie.** `FakeLLM(responses={"hello": "Hi!"})` : « Say HELLO » → `Hi!` ; « bye » → la réponse par défaut ; `len(llm.calls)` → `2`. `convert_currency(100, "USD", "EUR", fetch=lambda base: {"EUR": 0.5})` → `100 USD = 50.00 EUR`, sans réseau.

**Où le relire.** [`llm.py · LLMClient`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/llm.py#L20), [`FakeLLM`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/llm.py#L26), [`get_client`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/llm.py#L111) — cours · [ch02 · cellules 5, 12 et 26](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch02/notebook.ipynb) · [ch04 · cellule 17](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch04/notebook.ipynb) · [`buyer/mcp_client.py · Gecko, HostedGecko, RecordedGecko`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/mcp_client.py#L29), [`buyer/ledger.py · Chain`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/ledger.py#L19), [`buyer/signer.py · Signer`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/signer.py#L60) — cours · [`grounded-research-agent/agent.py · YourAgent(client=None)`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/agent.py#L209).

**À réutiliser.** Un `Protocol` par service extérieur : modèle, API, chaîne. Un faux qui note ses appels, pour pouvoir affirmer « zéro appel au modèle ». Le *recorded lane*, c'est ce faux rempli avec de vraies réponses enregistrées.

## Fiche 44 — `HookProvider` / `HookRegistry`, classes comme plugins

**Projet.** AI Support Agent (AWS Scholars, chapitre 2)

**En une phrase.** Une classe qui implémente `HookProvider` s'abonne à des événements du cycle de vie de l'agent (message ajouté, fin d'invocation) via `registry.add_callback`, sans modifier le code de la boucle principale.

**Pourquoi pour un agent.** La mémoire cross-session doit s'exécuter « avant » (injecter le contexte) et « après » (sauvegarder l'échange) chaque tour — exactement les deux moments qu'un hook expose.

**Analogie.** Un service de voiturier à l'entrée et à la sortie d'un restaurant : il agit avant qu'on entre et après qu'on sort, sans jamais toucher à ce qui se passe à table.

**Le mécanisme.**

```python
class MemoryHook(HookProvider):
    def register_hooks(self, registry: HookRegistry) -> None:
        registry.add_callback(MessageAddedEvent, self.retrieve_customer_context)
        registry.add_callback(AfterInvocationEvent, self.save_support_interaction)
```

**Entrée → sortie.** Un nouveau message utilisateur déclenche `retrieve_customer_context`, qui préfixe le message par `"Customer Context:\n..."` avant que l'agent ne le voie ; la fin du tour déclenche `save_support_interaction`, qui écrit l'échange en mémoire.

**Où le relire.** [main.py L99–188](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/main.py#L99-L188)

**À réutiliser.** Toute logique transverse (mémoire, logging, audit, garde-fou) se greffe en écrivant une classe qui s'abonne aux événements du framework, jamais en éditant la boucle principale de l'agent.

## Fiche 45 — Les hooks : une règle appliquée par le code

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** Un hook est une fonction que Strands appelle à un moment précis du cycle de l'agent (avant l'invocation, après) ; une expression régulière y extrait les champs d'un en-tête de texte.

**Pourquoi pour un agent.** La règle 6 (« le CommunicationAgent répond toujours en dernier ») était dans le prompt, mais le cas 10 des tests adversariaux a montré que Haiku pouvait refuser seul. Le hook `_end_turn` vérifie et appelle le CommunicationAgent si besoin : la règle ne dépend plus de l'obéissance du modèle.

**Analogie.** Le contrôle de conformité en fin de journée : quoi qu'ait fait le conseiller, aucun dossier ne sort sans le courrier standard au client.

**Le mécanisme.**

```python
def _start_turn(event: BeforeInvocationEvent) -> None:
    match = re.search(r'\[Session ID:\s*([^\]]+)\]\s*\[Customer ID:\s*([^\]]+)\]\s*(.*)', text, re.S)
    sid, cid, request = (part.strip() for part in match.groups())
    if sid != turn['session_id']:
        event.agent.messages.clear()                # new session: no leak
    turn.update(session_id=sid, customer_id=cid, request=request, communication_done=False)

def _end_turn(event: AfterInvocationEvent) -> None:
    if turn['communication_done']:
        return
    route_to_communication_agent(session_id=turn['session_id'], ...)   # Rule 6 in code

orchestrator = Agent(..., hooks=[_start_turn, _end_turn])
```

**Entrée → sortie.** Rejoué : `"[Session ID: ab12cd34] [Customer ID: CUST-001] I want to return\nmy order ORD-27176"` → `('ab12cd34', 'CUST-001', 'I want to return\nmy order ORD-27176')` ; `re.S` laisse `.` traverser le retour à la ligne. Après correctif, la trace X-Ray du cas 10 montre Orchestrator → `initialize_session` → CommunicationAgent, aucun worker.

**Où le relire.** [`agent_orchestrator.py · _start_turn`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1162) · [`agent_orchestrator.py · _end_turn`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1389).

**À réutiliser.** Toute règle « toujours » ou « jamais » à enjeu est écrite dans un hook ou un outil, le prompt ne fait que l'annoncer. Un en-tête structuré dans le message, parsé par une regex avec groupes nommés ou numérotés.

## Fiche 46 — Hériter d'une interface : `SessionRepository`

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** Une classe peut hériter d'une interface (une classe dont les méthodes sont à fournir) ; le framework appelle ces méthodes sans savoir comment elles stockent les données.

**Pourquoi pour un agent.** Strands n'a pas de stockage de session DynamoDB (le `DynamoDbSessionStorage` de l'énoncé n'existe pas). En implémentant `SessionRepository`, `RepositorySessionManager` persiste la conversation de l'Orchestrator dans DynamoDB, et elle survit au redémarrage du process.

**Analogie.** Une norme de prise électrique : n'importe quel fabricant peut produire l'appareil, tant qu'il respecte la forme de la prise.

**Le mécanisme.**

```python
class DynamoDBSessionRepository(SessionRepository):
    def __init__(self, table_name: str = SESSIONS_TABLE):
        self.table = dynamodb.Table(table_name)

    def create_session(self, session: Session, **kwargs) -> Session:
        self._put(session.session_id, 'SESSION', session.to_dict())
        return session

    def create_message(self, session_id, agent_id, session_message, **kwargs) -> None:
        self._put(session_id, f"MSG#{agent_id}#{session_message.message_id:08d}",
                  session_message.to_dict())

Agent(..., agent_id='orchestrator',
      session_manager=RepositorySessionManager(session_id=session_id,
                                               session_repository=DynamoDBSessionRepository()))
```

**Entrée → sortie.** `scripts/session_demo.py` construit l'Orchestrator deux fois avec le même `session_id` (redémarrage simulé) : au second tour, il retrouve la commande citée au premier. La table contient alors des clés `SESSION`, `AGENT#orchestrator`, `MSG#orchestrator#00000001`, triées grâce au zéro-padding.

**Où le relire.** [`agent_orchestrator.py · DynamoDBSessionRepository`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L997) · [`agent_orchestrator.py · list_messages`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1056) · [`scripts/session_demo.py · main`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/scripts/session_demo.py#L45).

**À réutiliser.** Quand un framework accepte une interface, l'implémenter plutôt que de contourner le framework. `**kwargs` dans les signatures pour tolérer les arguments ajoutés par une future version du SDK. Le JSON stocké dans un seul attribut évite les problèmes de types DynamoDB.

## Fiche 47 — Copies et mémoire par utilisateur

**Projet.** Dev3Pack AI Engineering Bootcamp

**En une phrase.** En Python, deux noms peuvent désigner le même objet ; `copy.deepcopy` crée un objet indépendant, et une clé `(user_id, key)` sépare les utilisateurs.

**Pourquoi pour un agent.** Une mémoire partagée par erreur fait passer la préférence d'Ana chez Bruno. Une valeur rangée sans copie change quand l'appelant la modifie.

**Analogie.** Photocopier un document avant de l'archiver : l'original peut être raturé, la copie archivée reste.

**Le mécanisme.**

```python
def remember(self, user_id, key, value):
    owner = self._owner(user_id)                        # refuse un id vide
    self._values[(owner, key)] = copy.deepcopy(value)   # copie à l'entrée

def recall(self, user_id, key):
    owner = self._owner(user_id)
    if (owner, key) not in self._values:
        return None
    return copy.deepcopy(self._values[(owner, key)])    # copie à la sortie
```

**Entrée → sortie.** `v = {"tags": ["a"]}` rangé avec `deepcopy`, puis `v["tags"].append("b")` : la mémoire garde `['a']`. Rangé sans copie, la même valeur devient `['a', 'b', 'c']` au fil des modifications.

**Où le relire.** [ch11 · cellules 6, 8, 16 et 20](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch11/notebook.ipynb) (`SessionState`, `MemoryStore`, l'expiration avec `date`) · [`grounded-research-agent/tests/test_contract.py · test_memory_is_capped_reset_and_kept_per_user`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/tests/test_contract.py#L272).

**À réutiliser.** Copier à l'entrée et à la sortie d'un stockage. `@staticmethod` pour une validation qui n'a pas besoin de l'objet. Une date d'expiration par souvenir.

## Sur le terrain

Les chapitres de mes formations où ces mécanismes tournent pour de vrai.

- [Dev3Pack, Session 2](/fr/books/dev3pack/session-02/) : fiche 43.
- [Dev3Pack, Session 4](/fr/books/dev3pack/session-04/) : fiche 43.
- [Dev3Pack, Session 11](/fr/books/dev3pack/session-11/) : fiche 47.
- [Dev3Pack, Final assignment](/fr/books/dev3pack/final/) : fiches 43 et 47.
- [Dev3Pack, Gecko capstone](/fr/books/dev3pack/gecko/) : fiche 43.
- [AWS Scholars, chapitre 2 · AI Support Agent](/fr/books/aws-scholars/chapter-02/) : fiche 44.
- [AWS Scholars, chapitre 3 · NovaMart Multi-Agent Support](/fr/books/aws-scholars/chapter-03/) : fiches 42, 45 et 46.
