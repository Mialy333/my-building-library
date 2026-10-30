---
workedOn: 2026-10-24
---

Le premier DRILLS servait à apprendre et à pratiquer. Une annonce alimentait une analyse de compétences, puis une roadmap, puis un exercice Python ciblé. Il y avait de la progression, du code dans le navigateur et un compagnon.

## Le concept

Un exercice convaincant à la lecture peut être faux, ou ne rien tester. Un validateur doit séparer ce qu'il a contrôlé de ce qu'il n'a pas prouvé.

## Le pipeline de la phase 1

<figure class="diagram"><svg viewBox="0 0 340 520" role="img" aria-labelledby="d-pipe-fr-t"><title id="d-pipe-fr-t">Pipeline historique de génération d&#x27;exercices</title><rect class="d-box" x="40" y="8" width="260" height="50" rx="10"/><text class="d-t" x="170" y="37.5" text-anchor="middle">Description de poste</text><polyline class="d-l" points="170,58 170,80"/><polygon class="d-head" points="170,80 173.6,73.0 166.4,73.0"/><rect class="d-box" x="40" y="80" width="260" height="50" rx="10"/><text class="d-t" x="170" y="102.5" text-anchor="middle">AnalystAgent</text><text class="d-s" x="170" y="116.5" text-anchor="middle">compétences</text><polyline class="d-l" points="170,130 170,152"/><polygon class="d-head" points="170,152 173.6,145.0 166.4,145.0"/><rect class="d-box" x="40" y="152" width="260" height="50" rx="10"/><text class="d-t" x="170" y="174.5" text-anchor="middle">CoachAgent</text><text class="d-s" x="170" y="188.5" text-anchor="middle">roadmap</text><polyline class="d-l" points="170,202 170,224"/><polygon class="d-head" points="170,224 173.6,217.0 166.4,217.0"/><rect class="d-box" x="40" y="224" width="260" height="50" rx="10"/><text class="d-t" x="170" y="246.5" text-anchor="middle">DrillCreatorAgent</text><text class="d-s" x="170" y="260.5" text-anchor="middle">exercice et harness</text><polyline class="d-l" points="170,274 170,296"/><polygon class="d-head" points="170,296 173.6,289.0 166.4,289.0"/><rect class="d-box" x="40" y="296" width="260" height="50" rx="10"/><text class="d-t" x="170" y="318.5" text-anchor="middle">ValidatorAgent</text><text class="d-s" x="170" y="332.5" text-anchor="middle">contrôles statiques + revue IA</text><polyline class="d-l" points="170,346 170,364"/><polygon class="d-head" points="170,364 173.6,357.0 166.4,357.0"/><polygon class="d-box" points="170,364.0 280.0,400 170,436.0 60.0,400"/><text class="d-t" x="170" y="396" text-anchor="middle">Validation</text><text class="d-t" x="170" y="413" text-anchor="middle">acceptée ?</text><rect class="d-key" x="8" y="462" width="150" height="50" rx="10"/><text class="d-t" x="83" y="484.5" text-anchor="middle">Payload</text><text class="d-s" x="83" y="498.5" text-anchor="middle">vers le navigateur</text><rect class="d-box" x="182" y="462" width="150" height="50" rx="10"/><text class="d-t" x="257" y="484.5" text-anchor="middle">Erreur</text><text class="d-s" x="257" y="498.5" text-anchor="middle">de pipeline</text><polyline class="d-l" points="60,400 40,400 40,462"/><polygon class="d-head" points="40,462 43.6,455.0 36.4,455.0"/><text class="d-s d-halo" x="44" y="428" text-anchor="start">oui</text><polyline class="d-l" points="280,400 300,400 300,462"/><polygon class="d-head" points="300,462 303.6,455.0 296.4,455.0"/><text class="d-s d-halo" x="296" y="428" text-anchor="end">non</text></svg><figcaption>Phase 1 : DrillOrchestrator.generate() enchaîne quatre agents spécialisés, toujours dans le même ordre. Ce parcours n&#x27;est plus public.</figcaption></figure>

`DrillOrchestrator.generate()` est l'orchestrateur : il coordonne ces étapes de façon déterministe : toujours le même ordre, sans que le modèle choisisse la suite. Chaque agent est spécialisé par ses instructions et son contrat de sortie. Aucun framework de graphe n'était nécessaire pour cette chaîne.

Le créateur produisait notamment `broken_code`, `fixed_solution` et `hidden_test_harness`. Le risque : un exercice qui a l'air juste, mais dont la solution est fausse ou dont le test ne distingue rien.

## Le durcissement du validateur

- Parsing AST du code cassé, de la solution et du harness de test, sans les exécuter.
- Une vraie assertion dans le harness, pas seulement le mot « assert » dans une chaîne ou un commentaire.
- Refus d'un code cassé identique à la solution.
- Une roadmap non vide.
- Une roadmap qui reprend des compétences de l'annonce, et une dernière étape qui vise une compétence analysée.
- Des erreurs séparées des avertissements.
- Une consigne au modèle : ne jamais prétendre avoir exécuté le code.

Voici la vérification de l'assertion, extraite du dépôt (code écrit avec l'assistance de ChatGPT et Codex) :

```python
def _has_test_assertion(tree: ast.Module | None) -> bool:
    """Require a real assert statement or a pytest-style assert call in the AST."""
    if tree is None:
        return False
    for node in ast.walk(tree):
        if isinstance(node, ast.Assert):
            return True
        ...
    return False
```

`ast.walk` parcourt l'arbre du code sans le lancer. Un `assert` écrit dans un commentaire n'est pas un nœud `ast.Assert` : il ne passe pas.

**La limite.** Réussir ces contrôles statiques ne prouve pas que la solution fonctionne. Le validateur le dit lui-même, par un avertissement : il faut encore exécuter le harness contre les deux versions du code.

## Le harness discriminant

Les tests de comportement ont ensuite utilisé des fixtures fixes et de confiance. Le même harness doit échouer sur une version connue comme cassée, et réussir sur la version corrigée.

| Harness | Code cassé | Code corrigé | Ce que ça prouve |
| --- | --- | --- | --- |
| Discriminant | Échoue | Réussit | Le test voit le bug |
| Cas heureux seulement | Réussit | Réussit | Rien sur le bug |

Le sous-processus qui lance ces fixtures n'est pas une sandbox de production pour du code généré. Le MVP final n'exécute aucun code des candidats.

## Le compagnon et le pilote MCP pédagogique

Cette phase a aussi exploré une progression avec reprise locale, des quiz, des feedbacks et des leçons, un compagnon contextuel (`MentorAgent`), un pilote MCP pédagogique (dont un calculateur), et beaucoup de réglages d'affichage.

Ce MCP pédagogique n'est pas le serveur MCP d'opportunités ajouté ensuite. Une technologie explorée pour apprendre ne devient pas automatiquement une intégration du produit candidat.

## Ce que cette phase a apporté au pivot

Surtout de la méthode : des contrats explicites, une validation avant affichage, la différence entre contrôle statique et preuve d'exécution, des tests hors ligne, un backend séparé, une gestion des erreurs. La génération d'exercices a quitté le parcours public : `POST /api/drills` renvoie désormais 410 pour une requête valide.

## Ce que je retiens

- Un test vert peut ne rien prouver : il faut le voir échouer sur le bug.
- Le validateur dit ce qu'il n'a pas vérifié, au lieu de laisser croire.
- Une chaîne fixe d'agents suffit quand l'ordre des étapes est connu.

## Les mécanismes Python

- [My Python for AI 101, chapitre 11 · Déployer et outiller](/fr/books/python-for-ai-101/chapter-11/) : fiche 55, lire du code sans l'exécuter avec `ast` ; fiche 53, `subprocess` pour lancer les fixtures avec un délai.
- [My Python for AI 101, chapitre 12 · Tester et évaluer](/fr/books/python-for-ai-101/chapter-12/) : fiche 60, tester la structure puis évaluer le comportement.

## La question de défense

> Un test vert peut-il ne rien prouver sur le bug ?

Oui. Un harness limité au cas heureux réussit sur la version cassée comme sur la version corrigée. Je vérifie que le même harness échoue sur l'une et réussit sur l'autre.

> Pourquoi la validation statique ne remplace-t-elle pas une exécution ?

Elle lit la forme du code : syntaxe, présence d'une assertion, différence entre les deux versions. Elle ne dit pas si la solution donne le bon résultat.
