---
workedOn: 2026-10-26
---

Une interface Astro statique, une API FastAPI, un agent de candidature, et du code Python qui vérifie ce que le modèle renvoie. Le dossier du candidat reste dans son navigateur.

## Le concept

Le composant s'appelle `ApplicationAgent`, mais c'est l'application qui pilote le workflow. Le modèle analyse et rédige ; le code découpe les textes, vérifie les références et calcule le score. Ce n'est pas une boucle autonome qui décide de naviguer sur le Web, d'exécuter du code ou de postuler.

## Le schéma

<figure class="diagram"><svg viewBox="0 0 340 470" role="img" aria-labelledby="d-arch-fr-t"><title id="d-arch-fr-t">Architecture du MVP de DRILLS.ai</title><rect class="d-ghost" x="4" y="6" width="332" height="92" rx="12"/><text class="d-s" x="14" y="22" text-anchor="start">NAVIGATEUR</text><rect class="d-key" x="14" y="32" width="144" height="54" rx="10"/><text class="d-t" x="86" y="56.5" text-anchor="middle">Candidat</text><text class="d-s" x="86" y="70.5" text-anchor="middle">Astro · TypeScript</text><rect class="d-box" x="188" y="32" width="140" height="54" rx="10"/><text class="d-t" x="258" y="56.5" text-anchor="middle">Dossier</text><text class="d-s" x="258" y="70.5" text-anchor="middle">dans le navigateur</text><polyline class="d-l" points="158,59 188,59"/><polygon class="d-head" points="188,59 181.0,55.4 181.0,62.6"/><polygon class="d-head" points="158,59 165.0,62.6 165.0,55.4"/><rect class="d-box" x="14" y="120" width="144" height="48" rx="10"/><text class="d-t" x="86" y="141.5" text-anchor="middle">API FastAPI</text><text class="d-s" x="86" y="155.5" text-anchor="middle">Render</text><rect class="d-box" x="188" y="120" width="140" height="48" rx="10"/><text class="d-t" x="258" y="141.5" text-anchor="middle">GitHub public</text><text class="d-s" x="258" y="155.5" text-anchor="middle">métadonnées</text><polyline class="d-l" points="86,86 86,120"/><polygon class="d-head" points="86,120 89.6,113.0 82.4,113.0"/><polyline class="d-l" points="130,86 130,104 258,104 258,120"/><polygon class="d-head" points="258,120 261.6,113.0 254.4,113.0"/><rect class="d-box" x="14" y="196" width="144" height="48" rx="10"/><text class="d-t" x="86" y="224.5" text-anchor="middle">ApplicationAgent</text><rect class="d-box" x="188" y="196" width="140" height="48" rx="10"/><text class="d-t" x="258" y="224.5" text-anchor="middle">OpenAI Responses</text><polyline class="d-l" points="86,168 86,196"/><polygon class="d-head" points="86,196 89.6,189.0 82.4,189.0"/><polyline class="d-l" points="158,220 188,220"/><polygon class="d-head" points="188,220 181.0,216.4 181.0,223.6"/><polygon class="d-head" points="158,220 165.0,223.6 165.0,216.4"/><rect class="d-key" x="14" y="272" width="144" height="54" rx="10"/><text class="d-t" x="86" y="296.5" text-anchor="middle">Validation Python</text><text class="d-s" x="86" y="310.5" text-anchor="middle">références · score</text><polyline class="d-l" points="86,244 86,272"/><polygon class="d-head" points="86,272 89.6,265.0 82.4,265.0"/><polyline class="d-l d-acc" points="14,299 6,299 6,144 14,144"/><polygon class="d-head d-acc" points="14,144 7.0,140.4 7.0,147.6"/><rect class="d-box" x="188" y="340" width="140" height="48" rx="10"/><text class="d-t" x="258" y="361.5" text-anchor="middle">Offres publiques</text><text class="d-s" x="258" y="375.5" text-anchor="middle">Greenhouse · Ashby</text><polyline class="d-l" points="158,156 173,156 173,364 188,364"/><polygon class="d-head" points="188,364 181.0,360.4 181.0,367.6"/><rect class="d-box d-dashbox" x="188" y="414" width="140" height="48" rx="10"/><text class="d-t" x="258" y="435.5" text-anchor="middle">Client MCP</text><text class="d-s" x="258" y="449.5" text-anchor="middle">externe, si connecté</text><polyline class="d-l d-dash" points="258,414 258,388"/><polygon class="d-head" points="258,388 254.4,395.0 261.6,395.0"/><polyline class="d-l d-dash" points="188,438 86,438 86,326"/><polygon class="d-head" points="86,326 82.4,333.0 89.6,333.0"/></svg><figcaption>Ce qui tourne dans le MVP. La flèche prune : le résultat repasse par la validation Python avant de revenir à l&#x27;API. En pointillés : la surface MCP, qui partage les offres et le score mais ne voit pas le dossier.</figcaption></figure>

- **Pas de compte.** Pas de synchronisation entre appareils, pas de mémoire serveur du dossier, pas de base vectorielle de CV.
- **La recherche d'offres ne dépend pas du profil.** Le CV n'est pas envoyé aux plateformes d'annonces.
- **La surface MCP** partage les adaptateurs d'offres et les règles de score, mais elle ne peut pas lire le dossier d'un navigateur.

## Qui fait quoi

| Composant | Responsabilité | Nature |
| --- | --- | --- |
| `ApplicationAgent.import_pdf()` | Lire le texte ; utiliser OpenAI si l'extraction locale échoue | Extraction classique, puis IA si besoin |
| `ApplicationAgent.assess()` | Identifier rôle, périmètre et exigences ; relier les preuves | Appel IA structuré |
| `ApplicationAgent.draft()` | Rédiger CV et présentation à partir du diagnostic conservé | Appel IA structuré distinct |
| `source_excerpts()` | Découper les textes en extraits numérotés | Code déterministe |
| `resolve_selection()` | Remplacer les IDs choisis par les passages originaux | Code déterministe |
| `validate_requirements()`, `validate_analysis()` | Vérifier les références et certaines cohérences | Code déterministe |
| `calculate_match()` | Calculer le score et la décision | Code déterministe |
| `prepare()` / `POST /api/application` | Produire l'ancien résultat complet | Compatibilité avec les anciens clients |

Trois lignes sur huit appellent le modèle. Les cinq autres sont du code qu'on peut tester sans réseau.

## La stack

| Couche | Outil | Rôle |
| --- | --- | --- |
| Frontend | Astro, TypeScript, HTML, CSS | Pages statiques bilingues ; interactions dans le navigateur |
| Éditeur | Tiptap | CV structuré et modifiable, barre d'outils de traitement de texte |
| Validation frontend | Zod | Contrats de réponse et dossier du navigateur |
| API | FastAPI, Uvicorn, Python | Opérations candidat et intégrations |
| Validation backend | Pydantic v2 | Entrées et sorties typées ; champ inattendu refusé |
| IA | SDK Python OpenAI, Responses API, Structured Outputs | Secours PDF, comparaison profil / offre, rédaction |
| Modèle par défaut dans le code | `gpt-4o-2024-08-06` | Surchargeable par `OPENAI_APPLICATION_MODEL` ; la valeur réelle sur Render n'a pas été relue |
| PDF | `pypdf==6.21.2` | Extraction du texte dans un sous-processus borné |
| Réseau | httpx | Lecture des tableaux Greenhouse et Ashby |
| Limites | SlowAPI, sémaphore asyncio | Limites par route ; deux opérations candidat à la fois par processus |
| MCP | `mcp[cli]==2.3.0` | Serveur optionnel Streamable HTTP, sans état |
| État | sessionStorage ; localStorage sur option | Dossier dans le navigateur, aucune base de comptes |
| Tests | pytest, tests Node, jsdom | Backend simulé hors ligne, contrats, interactions DOM |
| Livraison | GitHub Actions, GitHub Pages, Render | Vérifications ; frontend et backend hébergés à part |

Les versions déclarées sont des plages (Astro `^7.4.1`, Zod `^4.6.7`, SDK OpenAI `>=2,<4`). Le lockfile npm fait foi pour le frontend. Render installe depuis les fichiers requirements, qui ne figent pas toutes les dépendances : la présence d'`uv.lock` ne rend pas, à elle seule, ce déploiement Python reproductible.

Une dépendance présente dans le dépôt n'est pas forcément utilisée par le MVP. Pyodide, les anciens agents, les cours et les exercices sont l'héritage de la première version.

## Où lire le code

| Chemin | Pour comprendre |
| --- | --- |
| [`src/pages/[lang]/apply.astro`](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/src/pages/%5Blang%5D/apply.astro) | Les écrans profil, opportunités, diagnostic, documents |
| [`src/scripts/application.ts`](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/src/scripts/application.ts) | Navigation, import, appels API, actions du candidat |
| [`src/lib/application-state.ts`](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/src/lib/application-state.ts) | Validation et conservation du dossier |
| [`src/ai_generator/application.py`](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/src/ai_generator/application.py) | Agent actif, références, score, génération |
| [`src/ai_generator/pdf_text.py`](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/src/ai_generator/pdf_text.py) | Extraction PDF bornée |
| [`src/integrations/jobs.py`](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/src/integrations/jobs.py) | Sources d'annonces et cache |
| [`api/main.py`](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/api/main.py), [`api/mcp_app.py`](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/api/mcp_app.py) | Routes HTTP, erreurs, limites, outils MCP |
| `src/ai_generator/orchestrator.py`, `agents/` | L'architecture historique de la phase 1 |
| `render.yaml`, `.github/workflows/` | Déploiement et CI |

## Ce que je retiens

- Appeler un composant « agent » ne le rend pas autonome. Je sais dire ce qu'il décide : analyser et rédiger, dans un cadre fixé par le code.
- Ce que le modèle produit passe par du code avant d'arriver à l'écran.
- Présent dans le dépôt ne veut pas dire utilisé par le produit.

## Les mécanismes Python

- [My Python for AI 101, chapitre 5 · Le texte](/fr/books/python-for-ai-101/chapter-05/) : la fiche 21 (le JSON strict) écrit à la main la frontière que Pydantic tient ici, avec `extra="forbid"`.

## La question de défense

> Avez-vous plusieurs agents ?

Oui dans le prototype initial. Le parcours candidat actuel utilise surtout `ApplicationAgent` et des contrôles en Python.

> Utilisez-vous un RAG ?

Non. Pas de base vectorielle ni de recherche sémantique sur un corpus. Les textes fournis par le candidat sont découpés en extraits numérotés, que le modèle référence.
