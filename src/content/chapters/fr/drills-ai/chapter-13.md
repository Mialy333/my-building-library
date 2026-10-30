---
workedOn: 2026-10-30
---

Le dernier chapitre sert à réviser. Il reprend les notions du projet avec la question qui les met à l'épreuve, puis les questions de soutenance, et ce que DRILLS.ai permet de montrer de mon travail.

## Le concept

Le fil rouge du projet : **une candidature crédible exige des faits, des contrôles et des limites compréhensibles, pas seulement un texte fluide.** Il vaut aussi pour la façon dont je présente DRILLS.ai.

## Les notions, une question chacune

| Notion | Dans DRILLS.ai | La question de défense |
| --- | --- | --- |
| Agent spécialisé | Des instructions et un contrat de sortie dédiés à une tâche | Qu'est-ce que l'agent décide réellement ? |
| Orchestration | L'ancienne chaîne Analyst → Coach → Creator → Validator | Pourquoi n'est-elle plus le parcours actuel ? |
| Sortie structurée | Pydantic envoyé à Responses, Zod dans l'interface | Un JSON valide garantit-il une analyse vraie ? Non |
| Référence contrainte | IDs d'extraits originaux, résolus en Python | Pourquoi ne pas faire recopier une citation ? |
| Ancrage documentaire | Le passage existe dans le profil ou l'annonce | Que reste-t-il à vérifier sur sa pertinence ? |
| Score déterministe | Poids 3 / 2 / 1, crédit 1 / 0,5 / 0 | Qu'est-ce qui varie encore d'un run à l'autre ? |
| Éligibilité | Conditions administratives séparées des compétences | Pourquoi un bon score ne lève-t-il pas une condition de stage ? |
| Consentement | `Literal[True]` dans les requêtes, accord dans l'interface | Quelles données partent, vers qui, et quand ? |
| Données non fiables | CV et annonces traités comme des données | Quelle protection contre une consigne cachée dans une annonce ? |
| Contrôle humain | Relecture et édition avant l'export | Que se passe-t-il quand le brouillon surinterprète ? |
| Validation statique | AST et vraies assertions dans l'ancien validateur | Pourquoi ne remplace-t-elle pas une exécution ? |
| Harness discriminant | Fixtures cassée et corrigée, même harness | Un test vert peut-il ne rien prouver ? |
| Extraction PDF bornée | Sous-processus, délais, mémoire, pages | Quand l'IA est-elle encore nécessaire ? |
| Rédaction différée | Diagnostic d'abord, documents sur demande | Quel travail sort du chemin d'attente ? |
| Réutilisation locale | Même profil, même annonce, même langue → résultat gardé | Quand faut-il invalider le résultat ? |
| État versionné | Schéma strict, expiration du dossier | Que devient un stockage bloqué ou corrompu ? |
| MCP | Outils partagés avec un client externe | Un endpoint MCP est-il une base ou un agent ? Non |
| Observabilité | Étape, durée, issue, code d'erreur | Comment distinguer transport, extraction, modèle et validation ? |
| CI/CD | Tests, build et déploiements séparés | Une CI verte prouve-t-elle la santé de Render ? Non |
| Preuve d'impact | Temps gagné et résultats à mesurer | Pourquoi 190 tests ne prouvent-ils pas plus d'entretiens ? |

## Les questions de soutenance

| Question | Réponse défendable |
| --- | --- |
| Pourquoi pas simplement ChatGPT ? | Le produit organise un parcours réutilisable et contrôlé. Le gain par rapport à des prompts reste à mesurer avec des utilisateurs. |
| Avez-vous plusieurs agents ? | Oui dans le prototype initial. Le parcours actuel utilise surtout `ApplicationAgent` et des contrôles Python. |
| Utilisez-vous un RAG ? | Pas de base vectorielle ni de recherche sémantique. Les textes fournis sont découpés en références. |
| MCP rend-il l'analyse vraie ? | Non. Il expose des outils ; la qualité des exigences et des preuves reste à évaluer. |
| Le score mesure-t-il une chance d'embauche ? | Non. Une couverture documentée sur des exigences extraites. |
| Avez-vous supprimé les hallucinations ? | Non. Structure et références sont contrôlées, mais une interprétation peut rester fausse. |
| Quel gain de performance ? | Des appels évités et une rédaction différée. Les essais ne prouvent pas un premier diagnostic plus rapide. |
| Les tests prouvent-ils le succès du produit ? | Ils vérifient des comportements du logiciel. L'effet sur les candidats reste à tester. |
| Le candidat peut-il postuler ? | Il retrouve le lien d'origine et postule lui-même. DRILLS.ai n'envoie rien. |
| Le plus risqué ? | La qualité des preuves interprétées, l'offre d'emplois adaptés, la latence, la valeur réelle pour le candidat. |

## Ce que ce projet montre

- **Produit.** Partir d'un problème vécu, réduire le périmètre, refuser d'empiler les fonctions, relier une analyse à une action concrète.
- **Ingénierie.** Des contrats entre frontend et backend, des sorties structurées, des références vérifiées, le calcul séparé de l'interprétation, les erreurs et les déploiements gérés.
- **Qualité.** Des tests adaptés, la différence entre une assertion présente et une preuve de comportement, les données préservées pendant les corrections, une optimisation mesurée sans inventer le gain.
- **Travail avec l'IA.** ChatGPT et Codex m'ont assistée pour la conception, le code et les itérations. C'est un travail fait avec cette aide, pas du code écrit sans outil.
- **Transparence.** Une base de projet existait avant le pivot. Le week-end a transformé le produit ; il n'a pas tout créé.

En une phrase, pour un entretien : *j'ai transformé un prototype d'exercices de programmation en outil de candidature pour les personnes en reconversion vers l'Agent Engineering. On importe un CV, on choisit une offre, on voit les preuves et les points à clarifier, puis on prépare des documents modifiables avant de postuler. Astro, TypeScript, FastAPI et l'API OpenAI, avec des sorties structurées, des références vérifiées et un score calculé en Python. Le MVP est en ligne ; sa valeur sur de vraies recherches d'emploi reste à évaluer.*

## Tenir le runbook à jour

À chaque évolution importante : noter le commit inspecté ; mettre à jour la date, le périmètre et les contrats ; ajouter une ligne au journal avec sa preuve et sa limite ; revoir une décision qui change ; dater tests et mesures, garder les échecs ; légender les captures devenues historiques ; vérifier commandes, routes et branches ; ne jamais transformer une idée du backlog en réalisation ; relire avant publication pour exclure secrets et données de candidats.

## Ce que je retiens

- Un commit prouve qu'un changement est versionné. Un test prouve le comportement qu'il vérifie. Un déploiement prouve qu'une version est en ligne.
- Aucun des trois, seul, ne prouve que le produit aide davantage de personnes à obtenir un entretien.

## La question de défense

> Qu'est-ce qui, dans DRILLS.ai, est vérifié par du code avant d'être montré ?

Les références de chaque preuve (elles existent dans le profil ou l'annonce), la forme de la réponse (schéma strict), le score et la décision (calculés en Python), et le dossier relu dans le navigateur (schéma Zod). Le sens d'une exigence et la vérité d'un CV, eux, restent à relire par une personne.
