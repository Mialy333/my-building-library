---
workedOn: 2026-10-22
---

Les fiches, résumées en règles à poser dès le premier jour d'un nouveau projet Python pour l'IA. Chaque projet m'a laissé sa propre checklist ; je les garde telles quelles, dans l'ordre où on pose les règles dans un nouveau repo. Chaque règle renvoie à ses fiches.

## Depuis Dev3Pack

1. **Le contrat d'abord.** La sortie du modèle est une dataclass figée, lue par un parseur strict : ni champ manquant, ni champ en trop (fiches [8](/fr/books/python-for-ai-101/chapter-03/) et [21](/fr/books/python-for-ai-101/chapter-05/)).
2. **Une couture par service extérieur.** Un `Protocol`, un vrai client, un faux qui note ses appels ; l'agent reçoit le client en paramètre (fiche [43](/fr/books/python-for-ai-101/chapter-09/)).
3. **Les réglages dans l'environnement.** Une valeur par défaut sûre, une liste fermée, aucune clé affichée (fiche [3](/fr/books/python-for-ai-101/chapter-02/)).
4. **L'argent en entiers.** Unité brute plus décimales ; `Decimal` pour lire un texte ; `None` refusé (fiche [9](/fr/books/python-for-ai-101/chapter-03/)).
5. **Noter la demande avant d'agir.** Un fichier écrit une fois, en mode `"x"`, avant que l'action existe (fiche [41](/fr/books/python-for-ai-101/chapter-08/)).
6. **Les sorties de boucle avant le corps.** Réponse, répétition, budget, erreur d'outil, et toujours le même reçu (fiche [27](/fr/books/python-for-ai-101/chapter-06/)).
7. **Les états autorisés dans une table.** Tout couple absent est refusé (fiche [28](/fr/books/python-for-ai-101/chapter-06/)).
8. **Une exception par type de refus.** Transformée en phrase lisible qui nomme le champ et les deux valeurs ; `raise … from` pour garder la cause (fiches [16](/fr/books/python-for-ai-101/chapter-05/) et [30](/fr/books/python-for-ai-101/chapter-07/)).
9. **Les formes dangereuses en regex.** Compilées une fois, testées dans les deux sens, appliquées hors des citations (fiche [18](/fr/books/python-for-ai-101/chapter-05/)).
10. **Toute URL passe le garde, avec un délai.** Schéma, hôte, adresses résolues ; `timeout` sur chaque appel, thread si le client n'en a pas (fiches [48](/fr/books/python-for-ai-101/chapter-10/) et [49](/fr/books/python-for-ai-101/chapter-10/)).
11. **Les secrets ne sortent jamais.** Masqués dans les logs par une empreinte, refusés au commit par un scan, clés hors du repo (fiches [10](/fr/books/python-for-ai-101/chapter-03/) et [53](/fr/books/python-for-ai-101/chapter-11/)).
12. **Des tests hors ligne dès le premier jour.** Réseau bloqué dans `conftest.py`, un test par refus attendu ; la mémoire copiée et cloisonnée par utilisateur (fiches [47](/fr/books/python-for-ai-101/chapter-09/) et [59](/fr/books/python-for-ai-101/chapter-12/)).

## Depuis AI Support Agent

1. **Le docstring d'abord.** Chaque outil `@tool` documente ses Args/Returns comme un contrat — c'est ce texte que le modèle lit, pas le nom de la fonction (fiche [36](/fr/books/python-for-ai-101/chapter-08/)).
2. **La mémoire en hooks, jamais dans la boucle.** Une classe `HookProvider` qui s'abonne aux événements, pas un `if` ajouté dans l'entrypoint (fiche [44](/fr/books/python-for-ai-101/chapter-09/)).
3. **Toute connexion externe sous `with`.** Gateway, sandbox, fichier : fermeture garantie même sur exception (fiche [39](/fr/books/python-for-ai-101/chapter-08/)).
4. **L'entrypoint est `async def` dès le premier jour.** Même si rien n'est encore concurrent à l'intérieur (fiche [50](/fr/books/python-for-ai-101/chapter-10/)).
5. **Un chemin de test local avant le déploiement.** `argparse` + `asyncio.run()` pour appeler l'entrypoint sans attendre un déploiement complet (fiche [2](/fr/books/python-for-ai-101/chapter-02/)).
6. **`.get()` en chaîne sur toute donnée externe.** Mémoire, Gateway, Knowledge Base : jamais un accès direct par crochets sur un JSON qu'on ne contrôle pas (fiche [7](/fr/books/python-for-ai-101/chapter-03/)).
7. **Chaque appel externe a un repli.** `try/except` qui dégrade le service plutôt que de laisser remonter l'exception jusqu'au client (fiche [31](/fr/books/python-for-ai-101/chapter-07/)).
8. **Les preuves d'appel d'outil se loggent en structuré.** Nom, input, résultat — pas seulement la réponse finale du modèle (fiche [22](/fr/books/python-for-ai-101/chapter-05/)).
9. **Les ID ont la bonne garantie.** `uuid.uuid4()` pour ce qui ne doit jamais collisionner, `random.choices` pour ce qui doit juste être lisible (fiche [11](/fr/books/python-for-ai-101/chapter-03/)).

## Depuis NovaMart

1. **Un point d'entrée, plusieurs commandes.** `test`, `chat`, `deploy`, `serve` dans le même fichier ; imports calculés depuis `__file__` (fiche [1](/fr/books/python-for-ai-101/chapter-02/)).
2. **Les réglages dans l'environnement.** Un `config.py` unique, aucun ID de ressource ni de modèle en dur, aucun appel réseau à l'import (fiche [4](/fr/books/python-for-ai-101/chapter-02/)).
3. **Les clients créés une fois.** Au niveau module, avec la région de la config ; un logger par module (fiche [5](/fr/books/python-for-ai-101/chapter-02/)).
4. **Chaque outil a son contrat.** Types annotés, docstring qui dit quand l'utiliser, chaque argument avec un exemple, le cas d'erreur décrit (fiche [37](/fr/books/python-for-ai-101/chapter-08/)).
5. **Les outils rangés dans leur builder.** Avec leurs constantes métier ; un builder renvoie un seul agent (fiches [29](/fr/books/python-for-ai-101/chapter-06/) et [42](/fr/books/python-for-ai-101/chapter-09/)).
6. **Les données converties à la frontière.** `default=str` pour `Decimal`, dates UTC, jours calculés par le code (fiche [14](/fr/books/python-for-ai-101/chapter-04/)).
7. **L'état partagé est versionné.** Écriture conditionnelle sur `version`, retry borné avec back-off (fiche [13](/fr/books/python-for-ai-101/chapter-04/)).
8. **Le code revérifie avant d'écrire.** Toute règle à effet réel contrôlée dans l'outil, écriture idempotente (fiche [33](/fr/books/python-for-ai-101/chapter-07/)).
9. **Les erreurs restent lisibles.** Dans un outil, renvoyer l'erreur comme donnée ; dans la plomberie, une exception nommée avec la correction (fiche [32](/fr/books/python-for-ai-101/chapter-07/)).
10. **Les règles critiques dans un hook.** Le prompt annonce, le code garantit ; identité de session dans `agent.state`, historique vidé par requête (fiches [42](/fr/books/python-for-ai-101/chapter-09/) et [45](/fr/books/python-for-ai-101/chapter-09/)).
11. **Paralléliser l'indépendant, enchaîner le dépendant.** `ThreadPoolExecutor` + `as_completed` + `try` par future ; séquentiel dès qu'une étape lit la précédente ; verrou sur tout « créer si absent » (fiches [51](/fr/books/python-for-ai-101/chapter-10/) et [52](/fr/books/python-for-ai-101/chapter-10/)).
12. **Tracer sans polluer.** Décorateur avec `functools.wraps`, context manager pour tout ce qui s'ouvre et se ferme, métriques par agent dans un `try` (fiches [38](/fr/books/python-for-ai-101/chapter-08/), [40](/fr/books/python-for-ai-101/chapter-08/) et [58](/fr/books/python-for-ai-101/chapter-11/)).
13. **Valider avant de déployer, authentifier à l'entrée.** Toutes les variables vérifiées d'un coup ; identité lue dans un token validé côté serveur (fiches [54](/fr/books/python-for-ai-101/chapter-11/) et [56](/fr/books/python-for-ai-101/chapter-11/)).
14. **Mesurer avant de régler.** Un jeu de cas fixe, une boucle « attendu contre obtenu », les rapports gardés dans `evidence/` (fiche [60](/fr/books/python-for-ai-101/chapter-12/)).
