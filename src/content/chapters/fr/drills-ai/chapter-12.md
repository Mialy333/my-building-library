---
workedOn: 2026-10-30
---

Ce chapitre garde la mémoire des choix : le journal des étapes avec leurs commits, les décisions d'architecture et ce qui les ferait changer, puis la suite, à tester avant de construire.

## Le concept

Une décision s'écrit avec l'option écartée et le critère qui la ferait revoir. Et la suite d'un produit se décide après l'avoir mis entre les mains de vraies personnes, pas avant.

## Le journal

Les dates suivent les commits et les échanges, pas un chronométrage. Certaines branches ont avancé en parallèle.

| Date | Étape | Preuve | Ce que j'en ai tiré |
| --- | --- | --- | --- |
| 24 oct. | Agents spécialisés | [341d733](https://github.com/Mialy333/drills.ai/commit/341d733) | Séparer analyse, roadmap, création et validation |
| 24 oct. | Contrats de comportement | [4a5f86a](https://github.com/Mialy333/drills.ai/commit/4a5f86a) | Un harness de test qui passe sur les deux versions ne prouve rien |
| 24–25 oct. | API et déploiement backend | [52d0bd7](https://github.com/Mialy333/drills.ai/commit/52d0bd7) | La clé reste côté serveur ; CI Python |
| 25 oct. | Refonte UX, pilote MCP pédagogique | [47a18a7](https://github.com/Mialy333/drills.ai/commit/47a18a7) | Installer aussi les dépendances des tests MCP |
| 25 oct. | Premier parcours candidature | [30d5954](https://github.com/Mialy333/drills.ai/commit/30d5954) | Recentrer le produit sur le profil et l'annonce |
| 25 oct. | Profil réutilisé | [b0c5d93](https://github.com/Mialy333/drills.ai/commit/b0c5d93) | Plus de double saisie, plus de génération d'exercices |
| 25 oct. | Import → diagnostic | [6bc6d77](https://github.com/Mialy333/drills.ai/commit/6bc6d77) | L'import seul n'est pas la fin de l'action |
| 25 oct. | Diagnostic lisible | [f35f8ea](https://github.com/Mialy333/drills.ai/commit/f35f8ea) | Preuves colorées, prochaines actions, textes précis |
| 25 oct. | Retrait du service worker | [d6c3f15](https://github.com/Mialy333/drills.ai/commit/d6c3f15) | Un vieux cache peut mélanger les versions |
| 25 oct. | Réparation bornée des preuves | [6e62197](https://github.com/Mialy333/drills.ai/commit/6e62197) | Expliquer un échec sans boucle infinie |
| 25 oct. | IDs de sources contraints | [a43b69c](https://github.com/Mialy333/drills.ai/commit/a43b69c) | Choisir un passage plutôt que réécrire la citation |
| 25 oct. | Barre d'outils du CV | [a9bd3f8](https://github.com/Mialy333/drills.ai/commit/a9bd3f8) | Le brouillon doit pouvoir être travaillé |
| 25 oct. | État partagé FR/EN | [313a4ca](https://github.com/Mialy333/drills.ai/commit/313a4ca) | Changer de langue n'efface pas le dossier |
| 25 oct. | CV structuré, GitHub public | [0dfbbcc](https://github.com/Mialy333/drills.ai/commit/0dfbbcc) | Métadonnées GitHub ≠ preuve de contribution |
| 25 oct. | Offres Greenhouse | [e642c1c](https://github.com/Mialy333/drills.ai/commit/e642c1c) | Une vraie offre rend la suite actionnable |
| 25 oct. | Audio et feedback de pitch | [65d8979](https://github.com/Mialy333/drills.ai/commit/65d8979), [fe9aaea](https://github.com/Mialy333/drills.ai/commit/fe9aaea) | Consentement, enregistrement stable, bonne langue |
| 25 oct. | Ashby et MCP d'opportunités | [7e0e025](https://github.com/Mialy333/drills.ai/commit/7e0e025) | Réutiliser adaptateurs et score, sans accès au dossier |
| 25 oct. | Étapes distinctes et suivi | [5bb6b99](https://github.com/Mialy333/drills.ai/commit/5bb6b99) | Moins de défilement, statuts séparés |
| 25 oct. | Rubriques techniques fixes | [b57e91d](https://github.com/Mialy333/drills.ai/commit/b57e91d) | Évaluer contre un référentiel explicite |
| 25 oct. | Liens et droit au travail | [db0a61b](https://github.com/Mialy333/drills.ai/commit/db0a61b) | Mener jusqu'au site d'envoi ; pays et droits distincts |
| 25 oct. | Onboarding, catégories Python | [af3cb62](https://github.com/Mialy333/drills.ai/commit/af3cb62) | Entrée simplifiée |
| 25 oct. | Périmètre final | [27fdf6e](https://github.com/Mialy333/drills.ai/commit/27fdf6e) | La préparation aux entretiens sort du produit |
| 25 oct. | Opportunités et navigation | [0298741](https://github.com/Mialy333/drills.ai/commit/0298741) | Contrôles à la demande, boutons alignés |
| 25 oct. | Consolidation de l'historique | [854babd](https://github.com/Mialy333/drills.ai/commit/854babd) | Garder les lignées sans réintroduire l'ancien produit |
| 25 oct. | README et illustrations | [801480d](https://github.com/Mialy333/drills.ai/commit/801480d) | Documenter ce qui est livré |
| 25 oct. | Retrait du script de démo | [1ab6844](https://github.com/Mialy333/drills.ai/commit/1ab6844) | Publier seulement la démo réellement faite |
| 26 oct. | Vidéo enregistrée | [dd97942](https://github.com/Mialy333/drills.ai/commit/dd97942) | Une preuve publique du produit |
| 26 oct. | PDF textuel, diagnostic séparé, score visible | [8f45461](https://github.com/Mialy333/drills.ai/commit/8f45461) | Moins d'appels inutiles, mesurer sans surpromettre |
| 30 oct. | Audit du runbook | Branches, code, statuts CI relus | Même commit de référence, aucun changement produit |

## Les décisions d'architecture

Ces ADR condensées rendent les choix explicites. Les critères de réexamen sont des propositions, pas des engagements déjà validés.

| Décision | Écartée ou différée | Pourquoi | La revoir si… |
| --- | --- | --- | --- |
| Cibler la première candidature Agent Engineer | Plateforme de cours généraliste | Problème précis, vécu | Les offres accessibles s'avèrent trop rares |
| Orchestration simple pour le candidat | Quatre agents systématiques | La tâche n'a pas besoin de la chaîne d'exercices | Une évaluation montre un gain net |
| Sorties structurées | Parser du texte libre | Contrat frontend / backend, erreurs contrôlables | Un besoin ne tient pas dans le schéma |
| Références par IDs | Citations recopiées par le modèle | Moins de citations altérées et d'erreurs 502 | Le découpage détruit trop de contexte |
| Score calculé en Python | Pourcentage demandé au modèle | Formule explicable et testable | Une évaluation métier justifie d'autres poids |
| Conditions séparées des compétences | Un seul score | Un bon niveau ne lève pas une restriction de contrat | Les utilisateurs restent dans l'ambiguïté |
| Texte du PDF avant l'IA | Tout PDF envoyé au modèle | Éviter un appel quand le texte est là | Trop d'erreurs de lecture |
| Rédiger après le diagnostic | Tout attendre avant le premier résultat | Retirer du travail du chemin initial | L'attente totale se dégrade |
| Dossier dans le navigateur | Comptes et base de profils | MVP rapide, moins de données centrales | Besoin validé de synchronisation |
| Cinq tableaux publics | Scraping large | Périmètre borné, liens traçables | Les testeurs manquent d'offres pertinentes |
| Outils MCP en lecture seule | Un agent qui postule | Réutiliser sans action externe risquée | Un usage réel le justifie |
| Retirer la préparation d'entretien | Allonger le parcours | Se concentrer sur obtenir l'entretien | Le cœur est validé et la demande revient |
| `main` + miroir Render | Supprimer les branches tout de suite | Ne pas couper un déploiement | Render est passé sur `main` |

## La suite : tester avant d'ajouter

La décision produit : tester le cœur livré avant d'ajouter des comptes, de nouveaux agents ou une nouvelle préparation d'entretien.

**Une première session proposée** (20 à 30 minutes, à mener) :

1. Demander l'accord de la personne et lui expliquer ce que deviennent ses données.
2. Utiliser son profil et une offre qu'elle vise vraiment, ou des données fictives si elle préfère.
3. La laisser traverser les quatre étapes sans guider chaque clic.
4. Noter hésitations, erreurs et attentes, sans garder de contenu personnel inutile.
5. Lui demander d'expliquer le score et les conditions avec ses mots.
6. Voir quelles preuves elle reconnaît, conteste ou veut compléter.
7. Comparer le brouillon à la version qu'elle accepterait d'envoyer.
8. Vérifier qu'elle retrouve l'offre et comprend que l'envoi se fait ailleurs.
9. Recueillir l'issue plus tard, avec son accord.

| Indicateur | Définition proposée | Garde-fou |
| --- | --- | --- |
| Activation | Profil exploitable, annonce, premier diagnostic terminé | Une visite ne compte pas |
| Autonomie | Parcours terminé sans mon aide | Noter l'aide réellement donnée |
| Temps de préparation | Du profil à un document jugé utilisable | Séparer l'attente système et la relecture |
| Corrections factuelles | Faits ajoutés, altérés ou mal interprétés | Un texte fluide n'est pas forcément acceptable |
| Compréhension | Score et éligibilité bien expliqués | Ne pas souffler la réponse |
| Passage à l'action | Candidature déclarée envoyée | Un lien ouvert n'est pas un envoi |
| Retour | Nouvelle offre analysée de soi-même | Ne pas provoquer le retour |
| Entretiens | Entretiens rapportés sur les candidatures suivies | Déclaratif ; aucune causalité établie |

**Le backlog, à arbitrer :** traiter la route de coaching et les descriptions périmées ; obtenir les logs d'exploitation ; construire un petit jeu d'évaluation FR/EN annoté, avec des cas négatifs et des conditions de contrat ; tester plusieurs mises en page de CV ; observer de vrais candidats en reconversion ; mesurer la couverture des offres, le coût, les échecs, les délais et les corrections ; passer Render sur `main` avant de supprimer des branches ; revoir la coordination entre tests et déploiement. Les idées de monétisation restent des hypothèses : aucun chiffre de traction ou de revenu n'est avancé.

## Ce que je retiens

- Chaque décision porte sa condition de retour.
- Le journal montre le chemin, y compris ce que j'ai construit puis retiré.
- La prochaine étape est une observation, pas une fonction.

## La question de défense

> Pourquoi ne pas avoir ajouté des comptes utilisateurs ?

Parce que le besoin n'est pas encore validé. Le dossier dans le navigateur suffit au MVP et évite de stocker des CV sur un serveur. Je le revois si des testeurs ont vraiment besoin de reprendre leur dossier sur un autre appareil, et seulement avec une politique de conservation écrite.
