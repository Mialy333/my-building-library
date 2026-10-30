---
workedOn: 2026-10-26
---

Ce chapitre rassemble ce qui a cassé, comment je l'ai diagnostiqué, ce que les tests vérifient vraiment, et les mesures de latence telles qu'elles sont, sans les embellir.

## Le concept

Une mesure se garde avec ses échecs. Une optimisation se prouve par des chiffres, et quand les chiffres ne prouvent rien, je l'écris.

## Les incidents

| Symptôme | Cause établie ou piste | Ce que j'ai fait |
| --- | --- | --- |
| `ModuleNotFoundError: mcp` au lancement de pytest | SDK absent de l'environnement, interpréteur d'un autre clone | Activer le bon venv, installer les requirements avec MCP |
| Python 3.12 jugé incompatible | Ancien `requires-python >=3.14` | Passé à `>=3.12` |
| `git pull` : « not currently on a branch » | Revue en detached HEAD | Inspecter le travail local, reprendre le clone du MVP |
| `zsh: bad pattern: ^[[200~cd` | Marqueur de collage parasite | Retaper la commande ; Git n'est pas corrompu |
| CV importé, mais parcours à ressaisir | Validation et enchaînement incohérents | Réutiliser l'extraction comme profil ; tests du parcours |
| L'import extrait, sans diagnostic | L'étape suivante peut échouer | Examiner séparément import et diagnostic |
| `502`, `draft_quote:4`, `candidate_quote:0` | Référence rejetée | Correction bornée, puis IDs d'extraits ; le validateur reste |
| Pull réussi, interface ancienne | Ancien service worker, versions mélangées | Worker de retrait, cache ciblé |
| FR/EN remet le dossier à zéro | État non partagé | Clé commune, tests de navigation entre langues |
| Le CV est un seul bloc | Sections insuffisantes | CV structuré, anciens brouillons normalisés, éditeur riche |
| Les boutons de formatage restent actifs | Bascule et sélection à corriger | Barre d'outils adaptée, tests |
| Trop de défilement | Tout dans une seule vue | Étapes distinctes, contrôles à la demande |
| 100 % avec une condition non vérifiée | Compétences et éligibilité confondues | Deux informations séparées |
| Le pourcentage disparaît | L'avertissement remplaçait le score | Score affiché avec l'avertissement, même à 0 |
| « Suivant » bloqué sans stockage | Navigation conditionnée à la sauvegarde | Sauvegarde au mieux, on avance quand même |
| Attente longue au diagnostic | Analyse et rédaction groupées, et d'autres facteurs | Séparer, instrumenter, mesurer |
| Une source d'offres tombe | Réseau ou format du fournisseur | Afficher l'indisponibilité ; aucune annonce fabriquée |
| Audio coupé, feedback dans la mauvaise langue | Parcours intermédiaire | Stabilisé, puis retiré du périmètre |
| Vidéo YouTube floue | Lecture en qualité automatique 240p | Changer la qualité du lecteur, pas le fichier |

## L'ordre de diagnostic d'une panne

1. Noter la page, l'action, le commit et l'heure, sans copier le CV dans un journal public.
2. Vérifier que le frontend appelle le bon backend.
3. Lire la requête dans l'onglet Réseau : endpoint, statut, durée, erreur.
4. Vérifier `/health`, en gardant sa limite : une clé présente n'est pas une clé valide.
5. Comparer la durée réseau et la durée serveur.
6. Lire la ligne de log de l'étape dans Render, avec les accès autorisés.
7. Reproduire avec une entrée fictive.
8. Corriger, et ajouter une vérification qui reproduit l'échec.
9. Vérifier le frontend et le backend séparément.

| Statut | Lecture probable |
| --- | --- |
| 200 | Accepté ; vérifier aussi le contenu |
| 410 | Fonction retirée, pour une requête valide |
| 422 | Entrée non conforme : consentement, longueur, type, PDF |
| 429 | Quota de route ou capacité simultanée atteinte |
| 502 | Sortie refusée, erreur fournisseur ou échec interne masqué |
| 503 | Service non configuré |
| 504 | Délai dépassé |

Le bouton « Annuler » arrête l'attente côté interface. Il ne prouve pas que le fournisseur a arrêté le calcul, ni que la requête ne sera pas facturée.

## Ce que les tests prouvent

Le 26 octobre, sur la version documentée : 120 tests Python, 35 tests de contrats frontend et 35 tests UI réussis ; build Astro et contrôle du contenu public réussis ; quatre exécutions GitHub Actions réussies ; un vrai import PDF et un vrai diagnostic suivi d'une rédaction, avec des données fictives.

Ces 190 tests incluent des composants historiques. Ce ne sont pas 190 scénarios de recrutement. Les tests UI tournent dans jsdom : ils ne remplacent pas Safari, Chrome et mobile. Les tests backend remplacent le modèle par des réponses simulées : un faux modèle.

| Famille | Ce qu'elle apporte |
| --- | --- |
| `test_application.py` | Preuves, score, correction bornée, PDF, analyse et rédaction séparées |
| `test_api.py` | Contrats d'API et erreurs |
| `test_jobs.py` | Adaptateurs et filtre d'offres |
| `test_opportunities_mcp.py` | Outils MCP et règles partagées |
| `application-ui.test.mjs` | Import, parcours, rédaction différée, erreurs, score, stockage |
| `home-ui.test.mjs`, `progress-ui.test.mjs` | Entrée, reprise et suivi |

## La latence, sans embellissement

Mesures ponctuelles du 26 octobre, même petit profil fictif, même annonce fictive. Ce n'est ni une moyenne de production, ni un percentile, ni un test de charge.

| Essai | Temps total observé | Durée serveur annoncée |
| --- | ---: | ---: |
| Ancien endpoint complet, avant publication | 14,94 s | 8,052 s |
| Nouvel import PDF textuel | 8,34 s | 1,648 s |
| Nouveau diagnostic seul, premier essai | 14,25 s | 9,354 s |
| Rédaction différée de ce diagnostic | 8,73 s | 4,228 s |
| Ancien endpoint complet, second essai | 13,46 s | 7,403 s |
| Nouveau diagnostic seul, second essai | 18,31 s | 12,966 s |

**Conclusion : ces essais ne montrent pas une baisse de latence du premier diagnostic.** Séparer les étapes, extraire le PDF sans modèle et réutiliser un résultat inchangé retirent du travail inutile, mais le résultat global reste variable. La rédaction différée ajoute une seconde requête si le candidat demande ses documents. L'écart entre durée totale et durée serveur ne permet pas d'attribuer l'attente à OpenAI ou à Render : les logs privés de Render n'étaient pas accessibles. Aucun changement de modèle n'a été fait à la suite de ces mesures.

## Ce qui reste à évaluer

| Dimension | Limite actuelle | Mesure utile |
| --- | --- | --- |
| Exigences | Le modèle peut en oublier ou en surpondérer | Offres annotées, accord avec une revue humaine |
| Preuves | Présence textuelle n'est pas pertinence | Revue de chaque lien exigence / preuve |
| Score | Seuil et poids heuristiques | Compréhension des utilisateurs, comparaison à une grille métier |
| Langue | Les consignes ne garantissent pas la langue de sortie | Revue FR/EN, profils et annonces en langues différentes |
| Documents | Surinterprétation, répétitions, ton générique | Nombre et nature des corrections humaines |
| PDF | Ordre de lecture, OCR, tableaux, colonnes | Corpus varié, taux de secours IA |
| Offres | Cinq tableaux, filtre par mots | Pertinence sur de vraies recherches |
| Performance | Premier diagnostic variable | Durées p50 / p95 par étape |
| Coût | Aucun coût unitaire établi | Tokens et coût par diagnostic |
| Effet | Aucun effet sur les entretiens démontré | Candidatures envoyées, réponses obtenues |

## La dette relevée le 30 octobre

- **Une route historique encore active.** `POST /api/coach` appelle encore `MentorAgent` si une clé est configurée. Elle n'a pas les mêmes limites ni les mêmes logs que les opérations candidat (elle utilise `logger.exception`). À couper ou à revoir.
- **Des descriptions périmées.** La description FastAPI parle encore de génération d'exercices ; le message 410 de l'ancienne route suggère une préparation d'entretien retirée ; le paquet npm s'appelle toujours `python-drills`.
- **De la compatibilité conservée.** Le champ `interview_questions` est encore rempli côté backend, sans réactiver l'interface.
- **Une protection limitée.** CORS n'est pas une authentification ; les quotas en mémoire ne sont pas un plafond de dépenses.
- **Les entrées longues et les PDF complexes** méritent une revue dédiée.
- **Le dossier local** n'est pas chiffré par l'application, ni récupérable sur un autre appareil.

Ce sont des éléments du backlog, pas des corrections faites.

## Ce que je retiens

- Je garde le pire essai à côté du meilleur.
- Un test dit ce qu'il vérifie, pas plus : 190 tests ne prouvent pas plus d'entretiens.
- La dette s'écrit, même quand elle n'est pas corrigée.

## Les mécanismes Python

- [My Python for AI 101, chapitre 12 · Tester et évaluer](/fr/books/python-for-ai-101/chapter-12/) : fiche 59, pytest et `monkeypatch`, pour couper la clé, couper le limiteur, ou remplacer le modèle par une réponse prévue ; fiche 68, `AsyncMock` pour les méthodes asynchrones de l'agent.

## La question de défense

> Quel gain de performance avez-vous obtenu ?

Des appels évités et une rédaction différée. Mes essais ne prouvent pas que le premier diagnostic est plus rapide, et je ne le prétends pas.

> Qu'est-ce qui reste le plus risqué ?

La qualité des preuves interprétées, le nombre d'offres vraiment adaptées, la latence, et la valeur réelle pour le candidat.
