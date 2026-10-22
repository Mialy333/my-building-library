---
workedOn: 2026-10-22
---

Ce livre range les mécanismes Python qui font tourner mes agents, une fiche par mécanisme, avec l'entrée, la sortie et le fichier où les relire. Les 60 fiches viennent de trois projets : le bootcamp Dev3Pack et deux projets du Nanodegree AWS, AI Support Agent et NovaMart. Elles sont classées par famille, de l'organisation du projet jusqu'aux tests. Chaque fiche dit de quel projet elle vient, et chaque chapitre finit par « Sur le terrain » : les chapitres de mes formations où on voit ces mécanismes à l'œuvre.

Les sorties en Python pur ont été rejouées le 22 octobre sur le code des repos. Pour NovaMart, celles qui passent par AWS viennent des preuves du projet (`evidence/`), car le compte du lab a depuis été réinitialisé.

## Comment lire une fiche

Chaque fiche suit le même ordre : en une phrase, pourquoi ça compte pour un agent, une analogie, le mécanisme (l'extrait de code utile), l'entrée et la sortie réelles, où le relire, et ce qu'on réutilise. Comme BAA 101, la fiche vaut pour n'importe qui ; mon parcours, étape par étape, est raconté dans les livres [Dev3Pack](/fr/books/dev3pack/) et [AWS Scholars](/fr/books/aws-scholars/).

## Le code lu, et qui l'a écrit

**Dev3Pack AI Engineering Bootcamp**

| Code lu | Qui l'a écrit |
| --- | --- |
| Le package du cours, `src/bootcamp_agent/` | Le cours. Je l'appelle depuis chaque notebook. |
| Mes 15 notebooks rendus, `submissions/Mialy333/chNN/` | Moi. Depuis le 2 octobre, certaines cellules `TODO(you)` sont écrites par l'assistant (Claude), et le journal du chapitre le signale. |
| Le capstone Gecko, `my-gecko-buyer/` | Le cours pour la structure et les exemples ; l'assistant (Claude), à ma demande, pour les TODO. |
| Le final assignment, `grounded-research-agent/agent.py` | L'assistant (Claude), à ma demande, à partir du gabarit du cours. |

« ch06 · cellule 13 » renvoie à la cellule 13 de mon notebook `ch06`. La semaine 0 (`w01` à `w12`) n'est pas couverte : elle n'a pas été rendue.

**AI Support Agent**

| Code lu | Qui l'a écrit |
| --- | --- |
| `starter/` : `main.py`, `lambda/`, `setup_permissions.py` | Le squelette, les docstrings et la section CLI viennent de Udacity. Les TODO (outils, hook mémoire, agent, boucle de trace) sont de moi. |
| Le logging de trace dans `main.py` | Ajouté lors de la révision demandée par le reviewer. |

**NovaMart Multi-Agent Support**

| Code lu | Qui l'a écrit |
| --- | --- |
| Les fichiers protégés du starter : `config.py`, `src/agent_observability.py`, `src/agent_utils.py`, `src/agentcore_cli.py`, `src/bedrock_kb_retrieval.py`, `tests/test_agent.py`, `infrastructure/` | Udacity. Je les lis, je ne les modifie pas. |
| `src/agent_orchestrator.py` | Les stubs et helpers viennent du starter. Les TODO et les extras sont de moi, à partir des extraits du runbook, avec l'assistant à ma demande. |
| Les extras de l'étape 7 : `scripts/`, `frontend_proxy/` | Moi, avec l'assistant, à ma demande. |

## Les liens

Chaque chemin de « Où le relire » ouvre le fichier sur GitHub, à la ligne exacte pour le code Python. Les liens sont figés sur un commit, donc ils restent justes même si le code change ensuite : `8c4726f` pour le cours Dev3Pack, `77d2a92` pour my-gecko-buyer, `dc60e44` pour grounded-research-agent, `1f7c614` pour AI Support Agent, `fef122e` pour NovaMart. Pour un notebook, le lien ouvre le fichier rendu : GitHub ne sait pas pointer une cellule, on la retrouve grâce au nom de fonction indiqué.

## Où chaque mécanisme intervient

Une demande entre, une réponse ou un refus sort ; les numéros renvoient aux fiches.

**Dans le bootcamp Dev3Pack**

1. Une question entre ; une garde par regex (fiche 18) écarte les ordres cachés.
2. La récupération cherche les passages : tokens, set, IDF (fiche 20). Rien trouvé : refus, sans appel au modèle.
3. Le modèle est appelé à travers un `Protocol` (fiche 43), avec un délai (fiche 49).
4. Sa sortie passe un JSON strict (fiche 21) et devient une dataclass (fiche 8).
5. Les vérifications tournent : exceptions (fiche 30), nombres exacts (fiche 9). Un champ faux : refus.
6. Réponse, action ou refus : tout finit dans la trace et le reçu, des dicts (fiche 6) écrits dans des fichiers (fiche 41).

**Dans AI Support Agent**

1. Une requête entre par l'entrypoint asynchrone (fiche 50).
2. Le hook mémoire injecte le contexte du client (fiche 44).
3. L'agent choisit parmi ses outils `@tool` (fiche 36).
4. Les outils de la Gateway MCP s'ouvrent dans un bloc `with` (fiche 39) ; derrière, la Lambda répond avec son contrat unique (fiche 34).
5. Le calcul passe par le Code Interpreter, avec un repli si l'appel échoue (fiche 31).
6. Les blocs d'appel d'outil sont lus pour la trace (fiche 22), puis l'échange est sauvegardé en mémoire avec `reversed` et `break` (fiche 26) ; la réponse sort.

**Dans NovaMart**

1. La demande arrive du navigateur ou du terminal, par HTTP avec un token Cognito, dans `lambda_handler` ou l'entrypoint du Runtime (fiche 56).
2. La configuration est chargée à la demande (fiche 4) et l'Orchestrator Strands prend la main (fiche 42).
3. Avant l'invocation, un hook lit l'en-tête de session par regex (fiche 45).
4. Les outils `route_to_*` (fiches 37 et 29) lisent et écrivent le WorkflowState dans DynamoDB, sous condition (fiches 12 et 13).
5. Les workers Inventory et Refund vérifient les faits (fiches 12, 14, 32 et 33) ; le PolicyAgent interroge les trois Knowledge Bases en parallèle (fiche 51), chaque recherche dans un segment X-Ray (fiche 40).
6. Après l'invocation, un hook garantit la règle 6 : le CommunicationAgent répond en dernier (fiche 45). Sortent la réponse ou le refus.
7. Tout du long, chaque outil est tracé par un décorateur (fiche 38) et ses métriques partent dans CloudWatch par les logs (fiche 58).

## La carte des 60 fiches

**[Chapitre 2 · Organiser le projet](/fr/books/python-for-ai-101/chapter-02/)**

| # | Notion | Le problème qu'elle évite | Projet |
| --- | --- | --- | --- |
| 1 | Un fichier, plusieurs commandes | Un code de test différent du code déployé | NovaMart |
| 2 | CLI locale `argparse` + `asyncio.run()` | Pas de moyen de tester localement une fonction async | AI Support Agent |
| 3 | Configuration et environnement | Une clé dans le code | Dev3Pack |
| 4 | La configuration paresseuse | Un ID de ressource ou de modèle en dur | NovaMart |
| 5 | Clients et logger au niveau module | Une connexion recréée à chaque appel d'outil | NovaMart |

**[Chapitre 3 · Les données](/fr/books/python-for-ai-101/chapter-03/)**

| # | Notion | Le problème qu'elle évite | Projet |
| --- | --- | --- | --- |
| 6 | Le dictionnaire, un contrat léger | Un reçu ou une réponse avec une case manquante | Dev3Pack |
| 7 | Chaînage de `.get()` | Un crash sur une réponse mémoire/API incomplète | AI Support Agent |
| 8 | La dataclass figée | Une intention modifiée en route | Dev3Pack |
| 9 | Les nombres exacts | Un arrondi qui fait passer un prix | Dev3Pack |
| 10 | Octets, base64 et empreinte | Signer d'autres octets que ceux vérifiés | Dev3Pack |
| 11 | Identifiants : `random.choices` vs `uuid.uuid4()` | Un ID de session qui collisionne | AI Support Agent |

**[Chapitre 4 · Les données AWS](/fr/books/python-for-ai-101/chapter-04/)**

| # | Notion | Le problème qu'elle évite | Projet |
| --- | --- | --- | --- |
| 12 | Lire DynamoDB : clé composite, `query`, tri | Une `KeyError` sur une commande absente | NovaMart |
| 13 | Écrire sous condition : le verrou optimiste | Deux agents qui s'écrasent l'un l'autre | NovaMart |
| 14 | Les types aux frontières : `Decimal`, dates, flux | Un outil qui plante en sérialisant sa réponse | NovaMart |
| 15 | Paginator et attente bornée | Une liste tronquée, une attente sans fin | NovaMart |

**[Chapitre 5 · Le texte](/fr/books/python-for-ai-101/chapter-05/)**

| # | Notion | Le problème qu'elle évite | Projet |
| --- | --- | --- | --- |
| 16 | Les f-strings et le refus qui nomme les deux valeurs | Un refus qui ne dit pas quoi ni pourquoi | Dev3Pack |
| 17 | f-strings et spécificateurs de format | Des clés mal triées, un message d'erreur muet | NovaMart |
| 18 | Les expressions régulières | Un ordre caché obéi, un secret dans un log | Dev3Pack |
| 19 | Validation + déballage par regex | Un ARN mal découpé à la main | AI Support Agent |
| 20 | Des mots aux ensembles : tokens, `set`, IDF | Une réponse sans source | Dev3Pack |
| 21 | Le JSON strict | Une sortie de modèle acceptée à moitié | Dev3Pack |
| 22 | Parsing défensif des blocs `toolUse` / `toolResult` | Une preuve d'appel d'outil qu'on ne peut pas produire au reviewer | AI Support Agent |

**[Chapitre 6 · Le contrôle](/fr/books/python-for-ai-101/chapter-06/)**

| # | Notion | Le problème qu'elle évite | Projet |
| --- | --- | --- | --- |
| 23 | Compréhensions et outils d'itération | Une citation inventée qui passe | Dev3Pack |
| 24 | Compréhension de liste avec filtre | Une boucle manuelle pour filtrer des commandes | AI Support Agent |
| 25 | Compréhensions et dépaquetage `**` | Deux configurations du guardrail qui divergent | NovaMart |
| 26 | `reversed()` + arrêt anticipé | Scanner tout l'historique pour la dernière paire de messages | AI Support Agent |
| 27 | La boucle bornée : les sorties d'abord | Une boucle qui tourne et dépense | Dev3Pack |
| 28 | La table de transitions | Répondre avant d'avoir cherché | Dev3Pack |
| 29 | Les closures : des outils rangés avec leurs règles | Des constantes métier en variables globales | NovaMart |

**[Chapitre 7 · Les erreurs et les garde-fous](/fr/books/python-for-ai-101/chapter-07/)**

| # | Notion | Le problème qu'elle évite | Projet |
| --- | --- | --- | --- |
| 30 | Les exceptions : lever, attraper, transformer en refus | Un traceback à la place d'un refus | Dev3Pack |
| 31 | `try/except` avec repli dégradé | Un tour de conversation qui plante entièrement | AI Support Agent |
| 32 | Les exceptions boto3 | Un traceback à la place d'une réponse | NovaMart |
| 33 | Le garde-fou dans le code, et l'idempotence | Un retour accordé hors fenêtre, ou deux fois | NovaMart |
| 34 | Contrat de réponse centralisé | Une Lambda qui casse le contrat API Gateway sur une branche oubliée | AI Support Agent |
| 35 | État sans effet de bord | Une donnée qui fuit d'une invocation Lambda à l'autre | AI Support Agent |

**[Chapitre 8 · Décorateurs, contexte et fichiers](/fr/books/python-for-ai-101/chapter-08/)**

| # | Notion | Le problème qu'elle évite | Projet |
| --- | --- | --- | --- |
| 36 | Le décorateur `@tool` | Un outil que le modèle ne sait pas appeler correctement | AI Support Agent |
| 37 | Types et docstring : le contrat de l'outil | Un outil que le modèle appelle mal | NovaMart |
| 38 | Le décorateur maison, avec `functools.wraps` | Un outil tracé qui perd son nom et sa docstring | NovaMart |
| 39 | Context manager `with` | Une connexion Gateway qui reste ouverte après une erreur | AI Support Agent |
| 40 | Le context manager : ouvrir, et toujours refermer | Un segment de trace jamais fermé | NovaMart |
| 41 | Les fichiers avec `pathlib` | Une preuve écrasée | Dev3Pack |

**[Chapitre 9 · Les agents et leurs interfaces](/fr/books/python-for-ai-101/chapter-09/)**

| # | Notion | Le problème qu'elle évite | Projet |
| --- | --- | --- | --- |
| 42 | L'agent est un objet Python | Un client qui hérite du contexte d'un autre | NovaMart |
| 43 | `Protocol` et injection de dépendances | Des tests qui dépendent du réseau | Dev3Pack |
| 44 | `HookProvider` / `HookRegistry`, classes comme plugins | De la logique mémoire mélangée au code de l'agent | AI Support Agent |
| 45 | Les hooks : une règle appliquée par le code | Une règle « toujours » que le modèle oublie | NovaMart |
| 46 | Hériter d'une interface : `SessionRepository` | Une mémoire de session perdue au redémarrage | NovaMart |
| 47 | Copies et mémoire par utilisateur | Une mémoire qui fuit d'un utilisateur à l'autre | Dev3Pack |

**[Chapitre 10 · Le réseau, le temps et la concurrence](/fr/books/python-for-ai-101/chapter-10/)**

| # | Notion | Le problème qu'elle évite | Projet |
| --- | --- | --- | --- |
| 48 | Le réseau prudent : `urlsplit`, `ipaddress`, `urllib` | Un outil tourné vers l'intérieur (SSRF) | Dev3Pack |
| 49 | Temps, délais et thread | Une attente sans fin | Dev3Pack |
| 50 | Entrée asynchrone `@app.entrypoint` | Un runtime qui bloque sur une requête | AI Support Agent |
| 51 | Le fan-out parallèle : `ThreadPoolExecutor` et `as_completed` | Trois recherches lentes l'une après l'autre | NovaMart |
| 52 | Verrou, contexte par thread, singleton paresseux | Une ressource créée deux fois par deux threads | NovaMart |

**[Chapitre 11 · Déployer et outiller](/fr/books/python-for-ai-101/chapter-11/)**

| # | Notion | Le problème qu'elle évite | Projet |
| --- | --- | --- | --- |
| 53 | `subprocess` : appeler un autre programme | Une clé commitée | Dev3Pack |
| 54 | `subprocess` et validation avant déploiement | Un déploiement de 15 min qui part incomplet | NovaMart |
| 55 | Lire du code sans l'exécuter : le module `ast` | Exécuter un fichier non fiable pour lire sa config | AI Support Agent |
| 56 | Les entrées HTTP : entrypoint du Runtime et Lambda | Un client qui se fait passer pour un autre | NovaMart |
| 57 | Le serveur MCP : une fonction devient un outil | Une vérification réservée à un seul agent | Dev3Pack |
| 58 | Des métriques par les logs (EMF) | Une télémétrie qui exige une permission absente | NovaMart |

**[Chapitre 12 · Tester et évaluer](/fr/books/python-for-ai-101/chapter-12/)**

| # | Notion | Le problème qu'elle évite | Projet |
| --- | --- | --- | --- |
| 59 | Les tests avec pytest | Une note qui dépend du wifi | Dev3Pack |
| 60 | Tester la structure, évaluer le comportement | Un guardrail réglé à l'impression | NovaMart |
