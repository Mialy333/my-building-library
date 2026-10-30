---
workedOn: 2026-10-26
---

Le diagnostic compare un profil à une annonce. Le modèle y identifie les exigences et y relie des preuves. Le danger : des citations reformulées, ou inventées, qui ont l'air de venir du CV.

## Le concept

Le modèle ne recopie pas une citation : il choisit l'identifiant d'un extrait parmi une liste imposée par le schéma. Le code remet ensuite le passage original à sa place : c'est une référence contrainte.

<figure class="shot"><img src="/drills/assessment-en.jpg" alt="L&#x27;écran Diagnostic d&#x27;un exemple fictif, avec les exigences et leurs preuves." width="1348" height="926" loading="lazy" decoding="async"><figcaption>Un diagnostic fictif, capturé le 25 octobre 2026, avant la correction du 26 octobre qui garde le score visible à côté d&#x27;une condition à vérifier. Ce n&#x27;est pas l&#x27;interface actuelle.</figcaption></figure>

## La séquence

<figure class="diagram"><svg viewBox="0 0 340 576" role="img" aria-labelledby="d-seq-fr-t"><title id="d-seq-fr-t">Séquence du diagnostic puis de la rédaction</title><rect class="d-box" x="4.0" y="6" width="80" height="28" rx="8"/><text class="d-m" x="44" y="24" text-anchor="middle">Interface</text><line class="d-l d-dash d-life" x1="44" y1="34" x2="44" y2="570"/><rect class="d-box" x="92.0" y="6" width="80" height="28" rx="8"/><text class="d-m" x="132" y="24" text-anchor="middle">FastAPI</text><line class="d-l d-dash d-life" x1="132" y1="34" x2="132" y2="570"/><rect class="d-box" x="178.0" y="6" width="80" height="28" rx="8"/><text class="d-m" x="218" y="24" text-anchor="middle">OpenAI</text><line class="d-l d-dash d-life" x1="218" y1="34" x2="218" y2="570"/><rect class="d-box" x="258.0" y="6" width="80" height="28" rx="8"/><text class="d-m" x="298" y="24" text-anchor="middle">Python</text><line class="d-l d-dash d-life" x1="298" y1="34" x2="298" y2="570"/><polyline class="d-l" points="44,58 132,58"/><polygon class="d-head" points="132,58 125.0,54.4 125.0,61.6"/><text class="d-s d-halo" x="50" y="53" text-anchor="start">profil, annonce, langue, consentement</text><polyline class="d-l" points="132,82 150,82 150,92 136,92"/><polygon class="d-head" points="136,92 143.0,95.6 143.0,88.4"/><text class="d-s d-halo" x="156" y="90" text-anchor="start">extraits numérotés + schéma</text><polyline class="d-l" points="132,118 218,118"/><polygon class="d-head" points="218,118 211.0,114.4 211.0,121.6"/><text class="d-s d-halo" x="138" y="113" text-anchor="start">choisir des références, analyser</text><polyline class="d-l d-dash" points="218,148 132,148"/><polygon class="d-head" points="132,148 139.0,151.6 139.0,144.4"/><text class="d-s d-halo" x="138" y="143" text-anchor="start">exigences structurées</text><polyline class="d-l" points="132,178 298,178"/><polygon class="d-head" points="298,178 291.0,174.4 291.0,181.6"/><text class="d-s d-halo" x="138" y="173" text-anchor="start">résoudre les IDs, vérifier</text><rect class="d-frame" x="118" y="190" width="194" height="126" rx="6"/><text class="d-s d-halo d-a" x="124" y="202" text-anchor="start">si erreur de preuve corrigeable</text><polyline class="d-l d-dash" points="298,222 132,222"/><polygon class="d-head" points="132,222 139.0,225.6 139.0,218.4"/><text class="d-s d-halo" x="138" y="217" text-anchor="start">code d&#x27;erreur</text><polyline class="d-l" points="132,252 218,252"/><polygon class="d-head" points="218,252 211.0,248.4 211.0,255.6"/><text class="d-s d-halo" x="138" y="247" text-anchor="start">une seule tentative corrective</text><polyline class="d-l d-dash" points="218,282 132,282"/><polygon class="d-head" points="132,282 139.0,285.6 139.0,278.4"/><text class="d-s d-halo" x="138" y="277" text-anchor="start">nouvelle sélection</text><polyline class="d-l" points="132,312 298,312"/><polygon class="d-head" points="298,312 291.0,308.4 291.0,315.6"/><text class="d-s d-halo" x="138" y="307" text-anchor="start">nouvelle validation</text><polyline class="d-l d-dash" points="298,342 132,342"/><polygon class="d-head" points="132,342 139.0,345.6 139.0,338.4"/><text class="d-s d-halo" x="138" y="337" text-anchor="start">résultat contrôlé ou erreur</text><polyline class="d-l d-acc d-dash" points="132,372 44,372"/><polygon class="d-head d-acc" points="44,372 51.0,375.6 51.0,368.4"/><text class="d-s d-halo" x="50" y="367" text-anchor="start">diagnostic + score si calculable</text><line class="d-l d-dash" x1="8" y1="396" x2="332" y2="396"/><text class="d-s d-halo d-a" x="170" y="392" text-anchor="middle">plus tard, à la demande</text><polyline class="d-l" points="44,420 132,420"/><polygon class="d-head" points="132,420 125.0,416.4 125.0,423.6"/><text class="d-s d-halo" x="50" y="415" text-anchor="start">demande de documents</text><polyline class="d-l" points="132,450 218,450"/><polygon class="d-head" points="218,450 211.0,446.4 211.0,453.6"/><text class="d-s d-halo" x="138" y="445" text-anchor="start">rédiger depuis le diagnostic</text><polyline class="d-l d-dash" points="218,480 132,480"/><polygon class="d-head" points="132,480 139.0,483.6 139.0,476.4"/><text class="d-s d-halo" x="138" y="475" text-anchor="start">sections de CV + présentation</text><polyline class="d-l" points="132,510 298,510"/><polygon class="d-head" points="298,510 291.0,506.4 291.0,513.6"/><text class="d-s d-halo" x="138" y="505" text-anchor="start">contrôle des sources</text><polyline class="d-l d-acc d-dash" points="132,540 44,540"/><polygon class="d-head d-acc" points="44,540 51.0,543.6 51.0,536.4"/><text class="d-s d-halo" x="50" y="535" text-anchor="start">brouillons à relire</text></svg><figcaption>Deux appels séparés : le diagnostic d&#x27;abord, la rédaction ensuite. Chacun a au plus une tentative corrective. « Python » désigne la validation des références et le calcul du score.</figcaption></figure>

## Découper, choisir, restaurer

1. **Découper.** `source_excerpts()` coupe le profil et l'annonce en fenêtres de 600 caractères au plus, avec un pas de 500 : deux fenêtres voisines se chevauchent.
2. **Contraindre.** Les IDs (`profile_0`, `job_0`…) sont imposés dans le schéma de sélection : le modèle ne peut pas en inventer un, ni mélanger les sources.
3. **Restaurer.** `resolve_selection()` remplace chaque ID choisi par le passage original, puis vérifie sa présence.

Extrait du dépôt (code écrit avec l'assistance de ChatGPT et Codex) :

```python
def source_excerpts(text: str, prefix: str) -> dict[str, str]:
    """Bounded overlapping slices, each preserved verbatim from the approved input."""
    excerpts = {}
    for start in range(0, len(text), 500):
        excerpt = text[start:start + 600].strip()
        if len(excerpt) >= 8:
            excerpts[f"{prefix}_{len(excerpts)}"] = excerpt
    return excerpts
```

D'autres règles suivent. Un élément `not_documented` ne doit pas porter de citation du candidat. Deux exigences du même nom sont refusées. En cas d'erreur de preuve corrigeable, un seul retry correctif est fait ; ensuite, l'erreur remonte avec un code (`candidate_quote:0`, par exemple), jamais avec le texte du CV.

Cela a réglé le problème des citations reformulées, qui provoquaient des rejets et des erreurs 502. Cela ne vérifie pas que le passage choisi démontre vraiment la compétence, ni que le CV dit vrai.

## Les entrées sont des données

Le CV et l'annonce sont traités comme des données, jamais comme des instructions. Une annonce peut contenir une phrase qui ressemble à un ordre. Les consignes contre l'injection de prompt ne suffisent pas seules : le périmètre limité du modèle, l'absence d'exécution du code candidat, les références contraintes et la relecture humaine réduisent chacun un risque différent.

Le consentement est imposé par le type : `consent: Literal[True]`. Une requête sans accord est refusée avant tout appel. Les requêtes vers l'API Responses partent avec `store=False`, ce qui ne veut pas dire « aucune conservation chez le fournisseur ».

## Résidence et droit au travail

Le profil peut indiquer un pays de résidence, un pays concerné par le droit de travailler, et un état déclaré : inconnu, oui, restreint, ou besoin de sponsoring.

Résider en France ne suffit pas à établir un droit au travail. La nationalité ne devient jamais un facteur du score technique. Une déclaration documente une condition déclarée ; elle ne vaut pas vérification administrative, et elle ne résout pas une exigence de convention de stage ou de date de diplôme.

## Ce que je retiens

- Moins le modèle rédige, moins il y a à vérifier : il choisit, le code recopie.
- L'ancrage vérifié est textuel : la référence existe, mais prouve-t-elle la compétence ?
- La correction est bornée à une tentative, pour expliquer un échec sans boucle infinie.

## Les mécanismes Python

- [My Python for AI 101, chapitre 7 · Les erreurs et les garde-fous](/fr/books/python-for-ai-101/chapter-07/) : fiche 30, une exception (`EvidenceError`) attrapée puis transformée en réponse sûre, avec un code et sans texte personnel.
- [My Python for AI 101, chapitre 5 · Le texte](/fr/books/python-for-ai-101/chapter-05/) : fiche 21, le JSON strict, à comparer au schéma Pydantic des Structured Outputs.

## La question de défense

> Pourquoi ne pas demander au modèle de recopier librement une citation ?

Parce qu'il la reformule. Une citation altérée ne se retrouve plus dans le CV, et la validation la rejette. En choisissant un ID, le modèle ne peut désigner qu'un passage qui existe ; le code remet le texte exact.

> Un JSON valide garantit-il une analyse vraie ?

Non. Une sortie structurée garantit la forme. Le sens d'une exigence et la pertinence d'une preuve restent à relire.
