---
workedOn: 2026-10-26
---

Le frontend est sur GitHub Pages, le backend sur Render. Deux hébergeurs, deux déploiements qui ne se savent pas l'un l'autre. Ce chapitre décrit comment le produit est livré, protégé, observé, et comment revenir en arrière.

## Le concept

Chaque preuve dit une seule chose. Un commit prouve qu'un changement est versionné ; une CI verte, que ses tests passent ; un `/health` vert, que le service répond. Aucune ne prouve, seule, que le parcours fonctionne en ligne.

## La topologie de livraison

<figure class="diagram"><svg viewBox="0 0 340 420" role="img" aria-labelledby="d-deliv-fr-t"><title id="d-deliv-fr-t">Topologie de livraison</title><rect class="d-box" x="70" y="8" width="200" height="46" rx="10"/><text class="d-t" x="170" y="28.5" text-anchor="middle">Dépôt GitHub</text><text class="d-s" x="170" y="42.5" text-anchor="middle">Mialy333/drills.ai</text><polyline class="d-l" points="130,54 83,88"/><polygon class="d-head" points="83,88 90.8,86.8 86.6,81.0"/><polyline class="d-l" points="210,54 257,88"/><polygon class="d-head" points="257,88 253.4,81.0 249.2,86.8"/><rect class="d-key" x="8" y="88" width="150" height="48" rx="10"/><text class="d-m" x="83" y="109" text-anchor="middle">main</text><text class="d-s" x="83" y="123" text-anchor="middle">branche par défaut</text><rect class="d-box" x="182" y="88" width="150" height="48" rx="10"/><text class="d-m" x="257" y="109" text-anchor="middle">feat/hackathon-mvp</text><text class="d-s" x="257" y="123" text-anchor="middle">miroir temporaire</text><polyline class="d-l d-dash" points="158,112 182,112"/><polygon class="d-head" points="182,112 175.0,108.4 175.0,115.6"/><polyline class="d-l" points="83,136 83,166"/><polygon class="d-head" points="83,166 86.6,159.0 79.4,159.0"/><polyline class="d-l" points="257,136 257,166"/><polygon class="d-head" points="257,166 260.6,159.0 253.4,159.0"/><rect class="d-box" x="8" y="166" width="150" height="62" rx="10"/><text class="d-t" x="83" y="187.5" text-anchor="middle">Workflow Pages</text><text class="d-s" x="83" y="201.5" text-anchor="middle">build Astro avec</text><text class="d-s" x="83" y="215.5" text-anchor="middle">DRILLS_API_URL</text><rect class="d-box" x="182" y="166" width="150" height="62" rx="10"/><text class="d-t" x="257" y="187.5" text-anchor="middle">Render</text><text class="d-s" x="257" y="201.5" text-anchor="middle">pip install -r</text><text class="d-s" x="257" y="215.5" text-anchor="middle">requirements-mcp.txt</text><polyline class="d-l" points="83,228 83,258"/><polygon class="d-head" points="83,258 86.6,251.0 79.4,251.0"/><polyline class="d-l" points="257,228 257,258"/><polygon class="d-head" points="257,258 260.6,251.0 253.4,251.0"/><rect class="d-key" x="8" y="258" width="150" height="50" rx="10"/><text class="d-t" x="83" y="280.5" text-anchor="middle">GitHub Pages</text><text class="d-s" x="83" y="294.5" text-anchor="middle">/drills.ai/ · FR et EN</text><rect class="d-key" x="182" y="258" width="150" height="50" rx="10"/><text class="d-t" x="257" y="280.5" text-anchor="middle">API FastAPI</text><text class="d-s" x="257" y="294.5" text-anchor="middle">uvicorn · /health</text><polyline class="d-l" points="158,283 182,283"/><polygon class="d-head" points="182,283 175.0,279.4 175.0,286.6"/><text class="d-s d-halo" x="170" y="326" text-anchor="middle">appels API</text><rect class="d-ghost" x="8" y="344" width="324" height="66" rx="12"/><text class="d-s" x="20" y="366" text-anchor="start">CI à part : Full-stack validation,</text><text class="d-s" x="20" y="384" text-anchor="start">Python agent pipeline tests.</text><text class="d-s d-a" x="20" y="402" text-anchor="start">En parallèle : pas une barrière avant publication.</text></svg><figcaption>Deux hébergeurs, deux déploiements indépendants. Une CI verte ne prouve pas que Render a redéployé le bon commit.</figcaption></figure>

| Service | Configuration | Point d'attention |
| --- | --- | --- |
| GitHub Pages | `main` → workflow Deploy to GitHub Pages | Base Astro `/drills.ai/`, avec le slash final |
| Render | `feat/hackathon-mvp` dans `render.yaml` | Miroir temporaire de `main`, pas une branche concurrente |
| Runtime Render | Python 3.12.10 et plan free déclarés | Le tableau de bord réel n'a pas été relu |
| Build backend | `pip install -r requirements-mcp.txt` | Inclut les requirements de l'API et le SDK MCP |
| Démarrage | `uvicorn api.main:app --host 0.0.0.0 --port $PORT` | Port fourni par l'hébergeur |
| Santé | `/health` | Ne teste pas une requête OpenAI |
| Frontend | `DRILLS_API_URL` → `PUBLIC_DRILLS_API_URL` | Injectée au build GitHub Actions |
| Secret | Environnement du backend | Jamais dans le site statique |

## La CI : ce qu'elle vérifie, et ce qu'elle ne vérifie pas

La CI/CD tient en trois workflows.

| Workflow | Contrôles |
| --- | --- |
| Full-stack validation | Contrats frontend, build, tests UI, suite Python hors ligne |
| Python agent pipeline tests | Python 3.12 et la suite pytest complète |
| Deploy to GitHub Pages | Installation npm, build, publication |

**Attention au mot « gate ».** Le workflow Pages dépend de son propre build, pas de la réussite de Full-stack validation. Les workflows peuvent tourner en parallèle. Publier seulement si tous les tests passent demanderait une coordination de plus. Les quatre exécutions liées au commit documenté ont réussi ; leurs statuts ont été relus le 30 octobre, sans relancer les suites.

## Modifier sans perdre l'historique

```bash
git switch main
git pull --ff-only
git switch -c feat/nom-du-changement
```

Puis : la modification, les tests, le diff relu, un commit des seuls fichiers voulus, une PR vers `main`. Tant que Render suit la branche miroir, je la synchronise explicitement, si elle est propre :

```bash
git fetch origin
git switch feat/hackathon-mvp
git merge --ff-only origin/main
git push origin feat/hackathon-mvp
```

Un refus de fast-forward signale une divergence à examiner. Je ne le contourne pas par un force-push. Passer Render sur `main` est prévu, pas fait : vérifier `main`, changer la branche dans les réglages Render, mettre `branch: main` dans `render.yaml`, vérifier le déploiement, et seulement ensuite supprimer des branches. Changer le YAML seul ne prouve pas que le service a suivi.

## Routes et limites

| Route | Usage | Limite déclarée |
| --- | --- | --- |
| `GET /health` | Santé, présence d'une clé | Aucune génération |
| `POST /api/profile-import` | Lecture du PDF | 3 par minute, 10 par heure |
| `POST /api/assessment` | Diagnostic sans brouillons | 3 par minute, 20 par heure |
| `POST /api/application-drafts` | Rédaction différée | 3 par minute, 20 par heure |
| `POST /api/application` | Ancien parcours complet | 3 par minute, 20 par heure |
| `GET /api/jobs` | Liste d'offres | 10 par minute |
| `/mcp/` | Transport MCP, si activé | Corps borné ; pas forcément les mêmes quotas |
| `POST /api/drills`, routes interview | Fonctions retirées | 410 pour une requête valide |
| `POST /api/coach` | Compagnon historique | Encore actif, 10 par minute, absent du parcours |

Les opérations candidat partagent un sémaphore de 2 places par processus. Elles ont une limite globale de 95 secondes ; le client OpenAI a un délai de 90 secondes et `max_retries=0`. La tentative corrective métier n'est pas un retry réseau. Ces limites par IP et par processus protègent une démo : ce n'est ni une authentification, ni un plafond de dépenses, ni une limite partagée entre plusieurs instances.

Extrait du dépôt (code écrit avec l'assistance de ChatGPT et Codex) :

```python
application_slots = asyncio.Semaphore(2)

async def run_application_operation(operation, stage="application"):
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=503, detail="Application service is not configured.")
    if application_slots.locked():
        raise HTTPException(status_code=429, detail="Application service is busy. Please try again shortly.")
    async with application_slots:
        ...
        result = await asyncio.wait_for(operation(), timeout=95)
```

Un seul appel anonyme à `/health` part à l'ouverture de l'application, pour que le réveil de l'hôte (le cold start) se fasse pendant la saisie. Ce n'est pas un keep-alive, et cela ne garantit pas une instance chaude.

## Journaliser sans exposer

Le parcours candidat journalise des durées et des codes fixes, jamais le texte du CV, de l'annonce ou des brouillons :

```text
PDF extraction route=text duration_ms=...
Application stage=assessment duration_ms=... outcome=ok
Application preparation rejected: candidate_quote:0
```

Les réponses privées portent `Cache-Control: no-store` et `Server-Timing`. La durée serveur n'inclut pas tout le transport réseau.

## Revenir en arrière

Pour un rollback : identifier le dernier commit sain, faire un revert contrôlé sur la branche de travail, relire le diff et les tests, puis resynchroniser les références de déploiement. Jamais de réinitialisation brutale de l'historique distant, ni d'effacement des dossiers des navigateurs pour réparer une panne de code. Un retour d'urgence par l'hébergeur doit ensuite être réconcilié avec Git.

## Avant une démo

- Ouvrir le lien normal dans un navigateur de test, sans dossier personnel.
- Vérifier le commit déployé, côté frontend et côté backend.
- `/health`, puis un vrai parcours avec consentement et données fictives.
- Importer un PDF textuel, coller une annonce et son lien, lire score et conditions.
- Demander les documents, modifier une phrase, tester l'export.
- Vérifier que l'envoi n'est compté qu'après une action explicite.
- Changer de langue, et vérifier que le dossier reste.
- Garder la vidéo publiée en secours, en la présentant comme un enregistrement.

## Ce que je retiens

- Deux déploiements indépendants, donc deux vérifications.
- Une limite de démo n'est pas une sécurité : je dis ce qu'elle protège.
- Les logs disent où et combien de temps, jamais quoi.

## Les mécanismes Python

- [My Python for AI 101, chapitre 10 · Le réseau, le temps et la concurrence](/fr/books/python-for-ai-101/chapter-10/) : fiche 65, le sémaphore à deux places et l'attente de 95 secondes.
- [My Python for AI 101, chapitre 8 · Décorateurs, contexte et fichiers](/fr/books/python-for-ai-101/chapter-08/) : fiche 64, le middleware qui pose `no-store` et `Server-Timing`.
- [My Python for AI 101, chapitre 10 · Le réseau, le temps et la concurrence](/fr/books/python-for-ai-101/chapter-10/) : fiche 49, mesurer une durée et borner une attente (ici en version asyncio, avec `wait_for`) ; fiche 52, le verrou, à comparer au sémaphore à deux places.
- [My Python for AI 101, chapitre 2 · Organiser le projet](/fr/books/python-for-ai-101/chapter-02/) : fiche 3, refuser de travailler sans configuration (ici, 503 sans clé).

## La question de défense

> Une CI verte prouve-t-elle la santé de Render ?

Non. Render et GitHub Pages déploient chacun de leur côté. Il faut vérifier le commit déployé et faire un vrai appel, avec des données fictives.
