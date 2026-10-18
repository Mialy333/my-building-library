---
workedOn: 2026-10-07
---

Le thème de la Week 1, « Touch Grass », demandait un projet qui éloigne les gens de l'écran et les emmène dehors. J'ai construit *autumn-walks*, un agent qui m'envoie chaque matin sur Telegram une balade d'automne dans Paris. La balade est construite à partir des arbres de la ville et de la météo du jour.

## Le concept

Dans un agent, le modèle s'occupe de ce qui demande du langage. Ce qui n'a qu'une bonne réponse, comme les distances ou le choix des arrêts, est calculé par le code.

## Ce que j'ai fait

- J'ai filtré le jeu de données « Les arbres » de Paris Data (220 174 lignes) dans une base SQLite. Il reste 2 445 arbres d'automne dans 5 arrondissements.
- J'ai construit un agent Strands avec Gemma (`gemma4:e2b`), qui tourne en local avec Ollama. Il a deux outils, la météo et les arbres. Sans system prompt, Gemma n'appelait aucun outil.
- Quand Gemma choisissait les arrêts, les boucles faisaient 5 km et certains lieux n'existaient pas. Le code choisit maintenant les arrêts, et Gemma rédige le message.
- L'agent garde une mémoire des balades, et les rues des deux dernières sont exclues. Le message part sur Telegram chaque matin à 8 h 30.
- Le code a été écrit avec Claude Code.

## Ce que je retiens

- Le system prompt fait partie de l'outil.
- La géométrie n'est pas une tâche de langage.
- Il faut prévoir l'usage réel au milieu de la semaine, pas à la fin.

## La question de défense

> Pourquoi Gemma ne choisit-il pas lui-même les arbres ?

Quand il le faisait, les boucles faisaient 5 km et certains lieux n'existaient pas. Le code garantit des arrêts réels sur moins de 4 km, et Gemma s'occupe du texte, ce qu'il fait bien.

Soumis le 10 octobre. Je n'ai pas pu faire les balades avant la clôture, et le post le dit : le bot fonctionne, mais il n'a pas encore servi dehors.
