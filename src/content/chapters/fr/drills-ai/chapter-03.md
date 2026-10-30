---
workedOn: 2026-10-30
---

Avant de toucher au produit, je repars d'un état connu. Pendant le hackathon, plusieurs branches, des worktrees et des revues en detached HEAD ont coexisté. Reprendre proprement est une compétence à part entière.

## Le concept

Un push ne sauvegarde que ce qui est commité. Avant de modifier quoi que ce soit, je regarde l'état réel du clone, pas celui que je crois connaître.

## Avant de modifier un clone existant

```bash
git status --short --branch
git branch -vv
git log --oneline --decorate --branches --not --remotes
git worktree list
```

- Les fichiers modifiés ou non suivis ne partent pas avec un push.
- Un résultat vide pour le `git log` ne prouve pas que les worktrees sont propres.
- Un worktree en detached HEAD peut contenir du travail utile sans être sur une branche.
- Je ne supprime pas un ancien worktree et je ne force pas un checkout avant d'avoir inspecté et sauvegardé son travail.
- Je ne lance pas `git pull` depuis une revue détachée en espérant mettre à jour la branche de production.

Pour reprendre proprement, un nouveau clone :

```bash
git clone https://github.com/Mialy333/drills.ai.git
cd drills.ai
git switch main
git status --short --branch
```

Sur un clone propre et déjà sur la bonne branche : `git pull --ff-only`. S'il refuse, je lis la divergence au lieu de la remplacer par un reset destructif.

## Installer

Prérequis : Git, Node.js 22, Python 3.12 et uv.

```bash
npm ci
uv venv --python 3.12 .venv
source .venv/bin/activate
uv pip install -r requirements-devday.txt -r requirements-mcp.txt
python -c "import sys; print(sys.executable); print(sys.version)"
```

La dernière ligne sert à vérifier l'interpréteur. Si l'environnement d'un autre projet est activé, je le désactive d'abord : le prompt `(.venv)` ne prouve pas que l'interpréteur appartient au dossier courant.

Le backend lit `OPENAI_API_KEY` dans son environnement ou dans un fichier `.env` ignoré par Git. La clé n'est jamais commitée, ni mise dans une variable `PUBLIC_`. `git check-ignore .env` confirme que le fichier est bien ignoré.

## Les variables utiles

| Variable | Où | Rôle |
| --- | --- | --- |
| `OPENAI_API_KEY` | Backend seulement | Authentification OpenAI |
| `OPENAI_APPLICATION_MODEL` | Backend, facultatif | Modèle de l'analyse, de la rédaction et de l'import IA |
| `DRILLS_CORS_ORIGINS` | Backend | Origines frontend autorisées |
| `DRILLS_ENABLE_MCP` | Backend | `true` pour monter `/mcp/` |
| `DRILLS_MCP_HOSTS` | Backend, facultatif | Hôtes MCP autorisés en plus |
| `RENDER_EXTERNAL_HOSTNAME` | Fourni par Render | Nom d'hôte autorisé par la sécurité de transport MCP |
| `DRILLS_API_URL` | Variable GitHub Actions | Adresse du backend injectée au build |
| `PUBLIC_DRILLS_API_URL` | Build frontend | Adresse publique de l'API, jamais une clé |

En développement, le client vise `http://127.0.0.1:8000`. En production, une variable d'API absente ou invalide rend le service indisponible dans l'interface. Changer Render seul ne modifie pas un frontend statique déjà construit.

## Démarrer les deux terminaux

```bash
# Terminal backend, depuis la racine du clone
source .venv/bin/activate
python -m uvicorn api.main:app --reload --port 8000

# Terminal frontend, depuis la même racine
npm run dev -- --port 4321 --strictPort
```

Le frontend local s'ouvre sur `http://localhost:4321/drills.ai/fr/` : le préfixe `/drills.ai/` vient de la configuration Astro. Pour tester MCP, je lance le backend avec `DRILLS_ENABLE_MCP=true` devant la commande.

## Vérifier avant de toucher au produit

```bash
curl --fail http://127.0.0.1:8000/health
python -m pytest -q
npm run test:contracts
npm run build
npm run test:ui
```

`test:ui` utilise le build : l'ordre compte. Les tests backend simulent les appels au modèle. Un `/health` vert dit que le service répond et s'il a une clé ; il ne vérifie ni le crédit API ni une génération complète.

- Bon clone, bonne branche, interpréteur identifié.
- Dépendances frontend et backend installées.
- Aucun secret suivi par Git.
- API et frontend sur leurs ports.
- Tests et build vérifiés sur le commit réellement utilisé.

## Ce qui s'est passé avec les branches

Le projet a eu dix lignes de travail : `devday-codex`, `feat/agent-orchestration`, `feat/validator-hardening`, `feat/behavioral-validator-tests`, `feat/fastapi-multi-agent-backend`, `feat/drills-ai-ux-refactor`, `feat/offline-first-session`, `feat/ux-journey-audit`, `feat/hackathon-mvp` et `main`.

Les sorties du terminal montraient un clone principal modifié, un worktree UX propre, et des revues en detached HEAD, dont une avec des fichiers non commités et non suivis. Un `git diff --stat` contre une autre branche affichait beaucoup de suppressions. Ce n'était pas la preuve que le travail avait disparu, surtout pour les fichiers non suivis.

Un clone dédié au MVP a isolé le produit final. La consolidation du 25 octobre a rattaché 31 commits qui manquaient à son historique, en gardant le contenu du MVP et les auteurs et dates d'origine. Ce n'était pas une fusion aveugle de toutes les branches. Au 30 octobre, les dix branches existent encore, et `main` et `feat/hackathon-mvp` désignent le même commit.

Pour les contributions GitHub, ce sont les commits admissibles sur la branche par défaut qui comptent, pas le nombre de pushes. Aucune manipulation de dates n'a été nécessaire.

## Ce que je retiens

- Avant de réparer, je regarde : statut, branches, commits non poussés, worktrees.
- Un diff plein de suppressions ne dit rien des fichiers non suivis.
- `/health` vert : le service répond. Rien de plus.

## Les mécanismes Python

- [My Python for AI 101, chapitre 2 · Organiser le projet](/fr/books/python-for-ai-101/chapter-02/) : fiche 3, la configuration par variables d'environnement, avec une clé qui ne quitte jamais le serveur.

## La question de défense

> Ton `git pull` refuse : « not currently on a branch ». Que fais-tu ?

Je suis en detached HEAD, sur une revue. J'inspecte d'abord le travail local et je le sauvegarde si besoin. Puis je reprends le clone et la branche du MVP, au lieu d'improviser une fusion.
