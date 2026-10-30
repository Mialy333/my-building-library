---
workedOn: 2026-10-26
---

Le modèle qualifie les exigences. Le pourcentage et la décision, eux, sont calculés en Python. Ce chapitre donne la formule exacte, un exemple, et ce que le score ne dit pas.

## Le concept

Un score se calcule par une formule qu'on peut expliquer et tester. On ne demande pas un pourcentage au modèle.

## La formule

Le score ne prend que les exigences de type `skill`.

| Priorité | Poids | État de preuve | Crédit |
| --- | ---: | --- | ---: |
| `core` | 3 | `documented` | 1 |
| `important` | 2 | `partial` | 0,5 |
| `supporting` | 1 | `not_documented` | 0 |

```text
score = round(100 × somme(poids × crédit) / somme(poids))
```

**Un exemple pédagogique**, pas un vrai candidat : Python central et documenté (3 × 1), intégration d'API importante et partielle (2 × 0,5), framework complémentaire non documenté (1 × 0). Le score vaut `round(100 × 4/6) = 67`.

## La décision

<figure class="diagram"><svg viewBox="0 0 340 458" role="img" aria-labelledby="d-score-fr-t"><title id="d-score-fr-t">Du diagnostic à la décision</title><rect class="d-box" x="40" y="8" width="280" height="46" rx="10"/><text class="d-t" x="180" y="28.5" text-anchor="middle">Exigences extraites par le modèle</text><text class="d-s" x="180" y="42.5" text-anchor="middle">type · priorité · état de preuve</text><polyline class="d-l" points="180,54 180,84"/><polygon class="d-head" points="180,84 183.6,77.0 176.4,77.0"/><rect class="d-box d-qbox" x="40" y="92" width="280" height="56" rx="10"/><text class="d-t" x="180" y="116" text-anchor="middle">Rôle dans le périmètre</text><text class="d-t" x="180" y="133" text-anchor="middle">et compétences évaluables ?</text><polyline class="d-l" points="40,120 26,120 26,392"/><polygon class="d-head" points="26,392 29.6,385.0 22.4,385.0"/><text class="d-s d-halo" x="30" y="112" text-anchor="start">non</text><polyline class="d-l" points="180,148 180,186"/><polygon class="d-head" points="180,186 183.6,179.0 176.4,179.0"/><text class="d-s d-halo" x="186" y="172" text-anchor="start">oui</text><rect class="d-box" x="40" y="186" width="280" height="46" rx="10"/><text class="d-s" x="180" y="205" text-anchor="middle">round(100 × Σ poids×crédit / Σ poids)</text><text class="d-s" x="180" y="219" text-anchor="middle">compétences seulement · calcul Python</text><polyline class="d-l" points="180,232 180,264"/><polygon class="d-head" points="180,264 183.6,257.0 176.4,257.0"/><rect class="d-box d-qbox" x="40" y="264" width="280" height="56" rx="10"/><text class="d-t" x="180" y="288" text-anchor="middle">≥ 60, compétences core</text><text class="d-t" x="180" y="305" text-anchor="middle">et conditions documentées ?</text><polyline class="d-l" points="170,320 170,392"/><polygon class="d-head" points="170,392 173.6,385.0 166.4,385.0"/><text class="d-s d-halo" x="176" y="360" text-anchor="start">non</text><polyline class="d-l d-acc" points="290,320 290,392"/><polygon class="d-head d-acc" points="290,392 293.6,385.0 286.4,385.0"/><text class="d-s d-halo" x="296" y="360" text-anchor="start">oui</text><rect class="d-box" x="8" y="392" width="104" height="56" rx="10"/><text class="d-m" x="60" y="417" text-anchor="middle">review_scope</text><text class="d-s" x="60" y="431" text-anchor="middle">pas de score</text><rect class="d-box" x="118" y="392" width="104" height="56" rx="10"/><text class="d-m" x="170" y="417" text-anchor="middle">strengthen</text><text class="d-s" x="170" y="431" text-anchor="middle">à renforcer</text><rect class="d-key" x="228" y="392" width="104" height="56" rx="10"/><text class="d-m" x="280" y="417" text-anchor="middle">prepare</text><text class="d-s" x="280" y="431" text-anchor="middle">à préparer</text></svg><figcaption>Le modèle qualifie les exigences ; le pourcentage et la décision sont calculés par calculate_match(), en Python.</figcaption></figure>

- `review_scope` : pas de score, si le rôle est hors périmètre ou incertain, ou s'il n'y a aucune compétence à évaluer.
- `prepare` : le score atteint 60, toutes les compétences `core` sont documentées, et toutes les conditions d'éligibilité aussi.
- `strengthen` : tous les autres cas où un score existe.

Le seuil de 60 ne suffit donc pas si une compétence centrale ou une condition d'éligibilité reste non documentée. Même dans ce cas, le candidat garde la possibilité de préparer ses documents.

Extrait du dépôt (code écrit avec l'assistance de ChatGPT et Codex) :

```python
def calculate_match(requirements: list[Requirement], scope: str) -> tuple[int | None, str]:
    skills = [item for item in requirements if item.kind == "skill"]
    weights = {"core": 3, "important": 2, "supporting": 1}
    coverage = {"documented": 1, "partial": 0.5, "not_documented": 0}
    total = sum(weights[item.priority] for item in skills)
    score = round(100 * sum(weights[item.priority] * coverage[item.status] for item in skills) / total) if total else None
    if scope != "in_scope":
        score = None
    unresolved_core = any(item.priority == "core" and item.status != "documented" for item in skills)
    unresolved_eligibility = any(item.kind == "eligibility" and item.status != "documented" for item in requirements)
    decision = "review_scope" if score is None else (
        "prepare" if score >= 60 and not unresolved_core and not unresolved_eligibility else "strengthen"
    )
    return score, decision
```

## Ce que l'écran doit montrer

Le score et les conditions s'affichent ensemble. Un 0 s'affiche comme 0. Une condition à vérifier n'efface pas le pourcentage : c'était un bug, corrigé le 26 octobre. Un rôle hors périmètre ne reçoit pas un pourcentage inventé pour remplir l'écran.

## La limite de reproductibilité

La formule est déterministe pour une liste d'exigences donnée. Mais l'extraction des exigences, leur priorité et leur statut viennent du modèle, et peuvent changer d'une analyse à l'autre. Le seuil et les poids sont des heuristiques, pas une grille métier validée.

## Ce que je retiens

- Le modèle juge, le code calcule : la formule se teste sans réseau.
- Une compétence et une condition administrative ne se mélangent pas dans un même chiffre.
- C'est un score de couverture : il mesure une couverture documentée, jamais une chance d'embauche.

## La question de défense

> Pourquoi un score élevé ne résout-il pas une condition de stage ?

Parce que les conditions d'éligibilité ne sont pas dans le score : seules les compétences le sont. Une condition non documentée bloque la décision `prepare`, quel que soit le pourcentage.

> Qu'est-ce qui peut encore varier d'un run à l'autre ?

Les exigences elles-mêmes : leur liste, leur priorité et leur statut viennent du modèle. La formule, non.
