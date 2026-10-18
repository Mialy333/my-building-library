---
workedOn: 2026-10-04
---

Le premier challenge, « Build for a Friend », demandait de construire en un week-end un outil utile à un proche. J'ai fait *One step* pour ma sœur. Elle écrit d'un bloc tout ce qu'elle a en tête, et l'outil lui propose une seule action de 10 minutes à faire tout de suite. Le modèle tourne dans son navigateur et rien n'est envoyé à un serveur.

## Le concept

Un petit modèle reste utile si on lui donne une tâche réduite et si le code encadre ce qu'il produit. Ici, le format JSON est imposé, le code coupe la liste et l'interface fixe le ton.

## Ce que j'ai fait

- J'ai fait tourner Gemma 2 2B dans Chrome avec WebLLM. Ma sœur n'a rien à installer.
- Avant de construire, j'ai testé le modèle pendant 20 minutes sur 3 cas réels. La première action proposée était bonne, mais les listes contenaient des tâches inventées.
- J'ai réduit le format de réponse à 2 champs et retiré « ça peut attendre » du modèle. Ce texte est maintenant fixe dans l'interface. Le modèle n'a plus inventé de tâche.
- Ma sœur l'a testé le soir même sur son ordinateur. La première réponse est arrivée en 4,5 secondes.
- Le code a été écrit avec Claude Code.

## Ce que je retiens

- Moins on demande au modèle, plus il est fiable.
- Le test par la vraie personne montre ce que mes tests ne montrent pas. Ma sœur voulait revoir les tâches mises de côté.
- On peut livrer en moins de 24 heures si le MVP tient en 5 lignes.

## La question de défense

> Pourquoi ne pas utiliser une API fermée ?

Ce qu'écrit ma sœur est intime. Dans le navigateur, son texte ne quitte pas son ordinateur, et l'usage ne coûte rien.

Soumis le 5 octobre.
