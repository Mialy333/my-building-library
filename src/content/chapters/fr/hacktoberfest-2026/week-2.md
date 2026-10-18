---
workedOn: 2026-10-18
---

Le thème de la Week 2 était « Side Hustle ». J'ai construit *Late Pay Radar*, un outil local pour les freelances. Il classe les factures impayées selon le risque de retard de paiement et rédige la relance adaptée. Le titre vient d'un cas réel. Mon modèle donnait 82 % de risque de retard à mon client, qui a payé 15 jours en avance.

## Le concept

Un modèle ne vaut quelque chose que s'il est comparé à une règle simple, testé sur des données qu'il n'a jamais vues, et entouré de contrôles qui ne dépendent pas de lui.

## Ce que j'ai fait

- J'ai fait un backtest de TabPFN sur 1 561 factures publiques du Barnet Council. Au départ, le modèle recopiait la réponse la plus fréquente.
- J'ai corrigé l'évaluation avec des règles simples pour comparer, la ROC-AUC, et un seuil choisi en dehors des données de test. Le modèle fait jeu égal avec la règle « ce client a déjà payé en retard » (0,688 contre 0,687). Il a un léger avantage sur les nouveaux clients.
- J'ai construit un agent Strands avec Gemma. Le tri, les dates, les montants et les mentions obligatoires sont calculés par le code.
- Le garde-fou laissait passer une relance inventée quand l'outil n'était pas appelé. Je l'ai corrigé pour qu'il bloque en cas de doute.
- J'ai ajouté un import de PDF avec confirmation humaine, un test sans réseau et un test fresh clone.
- Le code a été écrit avec Claude Code.

## Ce que je retiens

- Une égalité honnête vaut mieux qu'un faux gagnant.
- Un garde-fou vérifie avec des données que le code connaît, jamais avec ce que le modèle a bien voulu chercher.
- Un score de 82 % décrit les données d'entraînement, pas mon client.

## La question de défense

> Ton modèle bat-il une règle simple ?

Non pour décider oui ou non, et il fait jeu égal pour classer les factures. Il apporte seulement un léger avantage sur les clients sans historique. C'est pour ça que l'outil utilise un routage hybride.

Soumis le 18 octobre.
