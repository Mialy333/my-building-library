---
workedOn: 2026-10-26
---

Après le diagnostic viennent les documents : un CV et une présentation personnelle que le candidat relit et modifie. Puis le suivi : quelles offres, quel statut, quelle date d'envoi. Le tout sans compte, dans le navigateur.

## Le concept

L'humain garde la main sur ce qui part en son nom. Le système propose un brouillon ; le candidat corrige, confirme l'export, et déclare lui-même l'envoi. Ouvrir un lien ne compte jamais comme une candidature envoyée. Ce contrôle humain est au cœur du produit.

## Du bloc de texte au CV

Les retours des premiers essais ont conduit à :

- séparer titre visé, profil, projets, expériences, formation et compétences, quand les données existent ;
- garder les dates, les noms de projets, les contributions et les résultats réellement fournis ;
- éviter les formules génériques et les qualités inventées ;
- proposer gras, italique, souligné, liens et alignement, avec Tiptap ;
- corriger les boutons de formatage, qui ne se désactivaient pas ;
- restaurer des rubriques dans les anciens brouillons trop peu structurés ;
- conserver le document modifié et sa mise en page ;
- demander une relecture avant l'export.

L'export PDF passe par la fonction d'impression du navigateur. « ATS-friendly » décrit une intention de lisibilité et de structure, pas une compatibilité certifiée avec tous les ATS. La présentation écrite reste disponible. Une lettre de motivation complète et la prospection personnalisée étaient dans le brief de départ : elles ne sont pas des livrables du MVP.

## Le dossier dans le navigateur

<figure class="diagram"><svg viewBox="0 0 340 340" role="img" aria-labelledby="d-store-Le même dossier en FR et en EN-t"><title id="d-store-Le même dossier en FR et en EN-t">Où vit le dossier du candidat</title><rect class="d-key" x="20" y="8" width="300" height="48" rx="10"/><text class="d-s" x="170" y="27" text-anchor="middle">clé du dossier</text><text class="d-m" x="170" y="43" text-anchor="middle">drills.application.v1</text><polyline class="d-l" points="110,56 90,94"/><polygon class="d-head" points="90,94 96.4,89.5 90.1,86.1"/><polyline class="d-l" points="230,56 250,94"/><polygon class="d-head" points="250,94 249.9,86.1 243.6,89.5"/><rect class="d-box" x="14" y="94" width="152" height="56" rx="10"/><text class="d-m" x="90" y="119" text-anchor="middle">sessionStorage</text><text class="d-s" x="90" y="133" text-anchor="middle">par défaut · 1 jour</text><rect class="d-box" x="174" y="94" width="152" height="56" rx="10"/><text class="d-m" x="250" y="119" text-anchor="middle">localStorage</text><text class="d-s" x="250" y="133" text-anchor="middle">sur option · 30 jours</text><polyline class="d-l" points="90,150 150,192"/><polygon class="d-head" points="150,192 146.3,185.0 142.2,190.9"/><polyline class="d-l" points="250,150 190,192"/><polygon class="d-head" points="190,192 197.8,190.9 193.7,185.0"/><rect class="d-box" x="20" y="192" width="300" height="50" rx="10"/><text class="d-t" x="170" y="214.5" text-anchor="middle">Relu et validé par Zod</text><text class="d-s" x="170" y="228.5" text-anchor="middle">expiration vérifiée à la lecture</text><polyline class="d-l" points="170,242 170,274"/><polygon class="d-head" points="170,274 173.6,267.0 166.4,267.0"/><rect class="d-box" x="20" y="274" width="300" height="50" rx="10"/><text class="d-t" x="170" y="296.5" text-anchor="middle">Le même dossier en FR et en EN</text><text class="d-s" x="170" y="310.5" text-anchor="middle">les anciens textes ne sont pas traduits</text></svg><figcaption>Aucun compte, aucune base serveur : le dossier reste dans le navigateur qui l&#x27;a créé.</figcaption></figure>

Tout passe par le stockage navigateur :


- sessionStorage par défaut, avec une expiration logique d'un jour ;
- une copie en localStorage sur option, qui expire 30 jours après la sauvegarde ;
- une validation Zod à chaque lecture ;
- le même dossier en FR et en EN ;
- un historique de 100 entrées au plus ;
- des statuts `analysed`, `sent`, `interview`, `offer`, `rejected` ;
- la date d'envoi et les notes conservées quand on relance une analyse.

L'expiration est vérifiée à la lecture : ce n'est pas une purge serveur. Changer de langue garde les données, mais ne traduit pas un ancien texte. Le dossier garde un seul jeu de documents à la fois : l'historique n'archive pas chaque version de CV envoyée à chaque entreprise.

Le bouton « gérer mon dossier » efface le dossier dans ce navigateur. Il ne supprime ni les PDF déjà téléchargés, ni un traitement déjà fait par un fournisseur. Les contacts saisis seulement dans l'éditeur d'export restent dans le navigateur ; ceux qui figurent dans le CV importé font partie du document traité.

## Ce que je retiens

- Un brouillon fluide n'est pas un brouillon juste : la relecture fait partie du produit.
- L'action qui engage le candidat (envoyer) reste la sienne, et elle est déclarée, pas déduite d'un clic.
- Une mémoire a un propriétaire et une date de fin, même dans un navigateur.

## Les mécanismes Python

Ce chapitre est surtout côté navigateur, en TypeScript. Le pendant Python de « relire et valider ce qu'on a stocké » est dans [My Python for AI 101, chapitre 9 · Les agents et leurs interfaces](/fr/books/python-for-ai-101/chapter-09/) : fiche 47, des copies et une mémoire rangée par utilisateur.

## La question de défense

> Que fait le système quand le brouillon surinterprète un projet ?

Rien seul : c'est le candidat qui corrige. L'éditeur sert à ça, et l'export demande une confirmation. Les références sont vérifiées pour leur présence, pas pour la vérité de chaque phrase.

> Que devient un stockage bloqué ou corrompu ?

Le dossier relu passe par un schéma Zod strict : un contenu invalide ou expiré n'est pas utilisé. Et si la sauvegarde échoue, le candidat peut quand même avancer dans la page ouverte.
