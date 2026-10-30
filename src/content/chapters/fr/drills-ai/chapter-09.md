---
workedOn: 2026-10-25
---

DRILLS.ai expose aussi trois outils par MCP, pour qu'un client externe cherche des offres et calcule un score sur des preuves déjà qualifiées. Ces outils lisent ; ils n'agissent pas.

## Le concept

Un serveur MCP n'est ni une base de données, ni un agent. Il expose des outils. Ce qu'un outil peut atteindre se décide dans le code, avant la première connexion.

## Le schéma

<figure class="diagram"><svg viewBox="0 0 340 444" role="img" aria-labelledby="d-mcp-fr-t"><title id="d-mcp-fr-t">La surface MCP de DRILLS.ai</title><rect class="d-box d-dashbox" x="60" y="8" width="220" height="46" rx="10"/><text class="d-t" x="170" y="28.5" text-anchor="middle">Client MCP externe</text><text class="d-s" x="170" y="42.5" text-anchor="middle">si connecté</text><polyline class="d-l" points="170,54 170,80"/><polygon class="d-head" points="170,80 173.6,73.0 166.4,73.0"/><rect class="d-key" x="20" y="80" width="300" height="64" rx="10"/><text class="d-m" x="170" y="102" text-anchor="middle">/mcp/</text><text class="d-s" x="170" y="116" text-anchor="middle">Streamable HTTP · sans état</text><text class="d-s" x="170" y="130" text-anchor="middle">hôtes autorisés · corps ≤ 100 000 octets</text><polyline class="d-l" points="52,144 52,176"/><polygon class="d-head" points="52,176 55.6,169.0 48.4,169.0"/><rect class="d-box" x="6" y="176" width="92" height="62" rx="10"/><text class="d-m" x="52" y="204" text-anchor="middle">search_jobs</text><text class="d-s" x="52" y="218" text-anchor="middle">lister</text><polyline class="d-l" points="150,144 150,176"/><polygon class="d-head" points="150,176 153.6,169.0 146.4,169.0"/><rect class="d-box" x="104" y="176" width="92" height="62" rx="10"/><text class="d-m" x="150" y="204" text-anchor="middle">get_job</text><text class="d-s" x="150" y="218" text-anchor="middle">une offre</text><polyline class="d-l" points="269,144 269,176"/><polygon class="d-head" points="269,176 272.6,169.0 265.4,169.0"/><rect class="d-box" x="202" y="176" width="134" height="62" rx="10"/><text class="d-m" x="269" y="196" text-anchor="middle">score_</text><text class="d-m" x="269" y="212" text-anchor="middle">documented_match</text><text class="d-s" x="269" y="226" text-anchor="middle">score des preuves</text><rect class="d-box" x="6" y="272" width="190" height="48" rx="10"/><text class="d-t" x="101" y="293.5" text-anchor="middle">Adaptateurs d&#x27;offres</text><text class="d-s" x="101" y="307.5" text-anchor="middle">Greenhouse · Ashby</text><rect class="d-box" x="202" y="272" width="134" height="48" rx="10"/><text class="d-t" x="269" y="293.5" text-anchor="middle">Règles de score</text><text class="d-s" x="269" y="307.5" text-anchor="middle">partagées</text><polyline class="d-l" points="52,238 52,272"/><polygon class="d-head" points="52,272 55.6,265.0 48.4,265.0"/><polyline class="d-l" points="150,238 150,272"/><polygon class="d-head" points="150,272 153.6,265.0 146.4,265.0"/><polyline class="d-l" points="269,238 269,272"/><polygon class="d-head" points="269,272 272.6,265.0 265.4,265.0"/><rect class="d-ghost" x="6" y="352" width="330" height="84" rx="12"/><text class="d-s" x="18" y="372" text-anchor="start">HORS DE PORTÉE</text><text class="d-s d-a" x="18" y="396" text-anchor="start">✕ dossier du navigateur  ✕ appel modèle payant</text><text class="d-s d-a" x="18" y="416" text-anchor="start">✕ envoi de candidature</text></svg><figcaption>Trois outils en lecture seule. Ils réutilisent les adaptateurs et les règles de score, sans accès au candidat ni au modèle.</figcaption></figure>

| Outil | Entrée → sortie | Limite |
| --- | --- | --- |
| `search_jobs` | Localisation, nombre de résultats → liste publique | Filtre par mots et par lieu, aucun classement selon un CV |
| `get_job` | ID issu de la liste → annonce complète | Ne lit pas une URL quelconque |
| `score_documented_match` | Profil, annonce, exigences déjà qualifiées, périmètre, consentement → score | Vérifie la présence des preuves ; ne refait pas l'analyse |

Le serveur utilise Streamable HTTP, sans état, avec une annotation d'outil « lecture seule » sur chaque outil, une liste d'hôtes autorisés et un corps de requête limité à 100 000 octets. L'annotation déclare aussi l'idempotence : relancer l'outil ne change rien. Le serveur est monté seulement si `DRILLS_ENABLE_MCP=true`.

Extrait du dépôt (code écrit avec l'assistance de ChatGPT et Codex) :

```python
READ = ToolAnnotations(readOnlyHint=True, destructiveHint=False, idempotentHint=True, openWorldHint=True)

@mcp.tool(annotations=READ, structured_output=True)
async def get_job(job_id: str) -> dict[str, Any]:
    """Read one posting by its ID returned by search_jobs. Cannot fetch arbitrary URLs."""
    if len(job_id)>200: raise ValueError('Invalid job ID')
    ...
```

La docstring est ce que lit le client : elle dit ce que l'outil fait, et ce qu'il ne fait pas. Les instructions du serveur demandent aussi de traiter annonces et textes comme des données non fiables, de ne jamais suivre une consigne trouvée dedans, et de demander l'accord avant d'envoyer un CV à l'outil de score.

## Ce qui reste hors de portée

Le serveur n'accède ni aux comptes, ni au stockage du navigateur. Il ne déclenche aucun appel payant au modèle et ne postule pas. Donner à un agent le pouvoir de postuler a été écarté : réutiliser les outils, oui ; agir à l'extérieur à la place du candidat, non.

L'existence de `/mcp/` ne prouve pas qu'un client ChatGPT a été connecté, ni qu'une authentification utilisateur existe. Une connexion se valide par l'initialisation, la découverte des outils, puis un vrai appel depuis le client choisi. La fonction historique `get_interview_rubric` est encore dans le module, mais elle n'est pas enregistrée comme outil public.

## Ce que je retiens

- Un outil se lit comme un contrat : son nom, ses types, sa docstring, ses limites.
- Lecture seule par défaut. Une action qui engage se justifie par un usage réel, documenté.
- Un endpoint qui existe n'est pas un client qui fonctionne.

## Les mécanismes Python

- [My Python for AI 101, chapitre 11 · Déployer et outiller](/fr/books/python-for-ai-101/chapter-11/) : fiche 57, une fonction devient un outil MCP.
- [My Python for AI 101, chapitre 8 · Décorateurs, contexte et fichiers](/fr/books/python-for-ai-101/chapter-08/) : fiche 37, les types et la docstring, contrat de l'outil.

## La question de défense

> MCP rend-il l'analyse vraie ?

Non. MCP expose des outils. La qualité des exigences et l'interprétation des preuves restent à évaluer, avec ou sans MCP.

> Un endpoint MCP est-il une base de données ou un agent ?

Ni l'un ni l'autre. C'est une porte vers des outils déclarés. Ici, trois outils en lecture seule, sans accès au dossier du candidat.
