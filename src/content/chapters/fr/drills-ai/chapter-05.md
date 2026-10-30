---
workedOn: 2026-10-26
---

Le dimanche 25 octobre, j'ai déplacé le point de départ : partir du candidat et de l'offre, plutôt que d'un programme d'apprentissage. Ce chapitre suit le parcours qui en est sorti, de l'import du CV au choix de l'offre.

## Le concept

Chaque étape doit mener à la suivante sans faire refaire au candidat ce qu'il a déjà fourni. Et chaque source extérieure (PDF, GitHub, offres) est lue avec ses limites, sans en tirer plus qu'elle ne dit.

## Le parcours en quatre étapes

<figure class="diagram"><svg viewBox="0 0 340 392" role="img" aria-labelledby="d-journey-fr-t"><title id="d-journey-fr-t">Le parcours candidat en quatre étapes</title><rect class="d-box" x="10" y="8" width="252" height="54" rx="10"/><text class="d-t" x="136" y="32.5" text-anchor="middle">1 · Profil</text><text class="d-s" x="136" y="46.5" text-anchor="middle">PDF ou saisie → texte modifiable</text><polyline class="d-l" points="136,62 136,82"/><polygon class="d-head" points="136,82 139.6,75.0 132.4,75.0"/><rect class="d-box" x="10" y="82" width="252" height="54" rx="10"/><text class="d-t" x="136" y="106.5" text-anchor="middle">2 · Opportunités</text><text class="d-s" x="136" y="120.5" text-anchor="middle">recherche ou annonce collée</text><polyline class="d-l" points="136,136 136,156"/><polygon class="d-head" points="136,156 139.6,149.0 132.4,149.0"/><rect class="d-box" x="10" y="156" width="252" height="54" rx="10"/><text class="d-t" x="136" y="180.5" text-anchor="middle">3 · Diagnostic</text><text class="d-s" x="136" y="194.5" text-anchor="middle">preuves, conditions, actions</text><polyline class="d-l" points="136,210 136,230"/><polygon class="d-head" points="136,230 139.6,223.0 132.4,223.0"/><rect class="d-box" x="10" y="230" width="252" height="54" rx="10"/><text class="d-t" x="136" y="254.5" text-anchor="middle">4 · Documents</text><text class="d-s" x="136" y="268.5" text-anchor="middle">CV et présentation éditables</text><polyline class="d-l d-acc" points="136,284 136,304"/><polygon class="d-head d-acc" points="136,304 139.6,297.0 132.4,297.0"/><rect class="d-key" x="10" y="304" width="252" height="54" rx="10"/><text class="d-t" x="136" y="328.5" text-anchor="middle">Site d&#x27;origine</text><text class="d-s" x="136" y="342.5" text-anchor="middle">le candidat postule lui-même</text><rect class="d-ghost" x="276" y="8" width="56" height="276" rx="12"/><text class="d-s" x="304" y="146" text-anchor="middle" transform="rotate(-90 304 146)">SUIVI DES CANDIDATURES</text></svg><figcaption>Quatre étapes, puis le lien vers l&#x27;offre d&#x27;origine. Le suivi est une page à part, ouverte à tout moment.</figcaption></figure>

| Étape | Action | Réponse attendue |
| --- | --- | --- |
| Profil | Importer un PDF ou saisir son expérience | Un texte réutilisable et modifiable |
| Opportunités | Chercher ou coller une annonce | La description complète et son lien d'origine |
| Diagnostic | Lancer la comparaison | Compétences documentées, partielles ou non documentées, conditions à part, prochaines actions |
| Documents | Demander puis modifier CV et présentation | Brouillons fondés sur le profil, export, accès au site pour postuler |

L'idée de départ : au-dessus de 60 % de matching, préparer ; en dessous, travailler les écarts. Le code final est plus prudent (voir [le chapitre 7](/fr/books/drills-ai/chapter-07/)). Le suivi est une page transversale ; la préparation aux entretiens n'est plus une cinquième étape.

## Importer le CV sans double saisie

Premier problème remonté : importer un CV demandait encore de rédiger son parcours, ou ne donnait que le texte extrait, sans diagnostic. La chaîne réutilise maintenant le texte importé.

<figure class="shot"><img src="/drills/profile-en.jpg" alt="L&#x27;écran Profil : import d&#x27;un CV en PDF et texte du profil modifiable." width="1348" height="926" loading="lazy" decoding="async"><figcaption>L&#x27;étape Profil : le CV importé devient un texte modifiable. Capture du 25 octobre 2026, exemple fictif.</figcaption></figure>

<figure class="diagram"><svg viewBox="0 0 340 430" role="img" aria-labelledby="d-pdf-fr-t"><title id="d-pdf-fr-t">Import d&#x27;un CV en PDF</title><rect class="d-box" x="20" y="8" width="300" height="50" rx="10"/><text class="d-t" x="170" y="30.5" text-anchor="middle">PDF + consentement</text><text class="d-s" x="170" y="44.5" text-anchor="middle">4 MiB au plus</text><polyline class="d-l" points="170,58 170,82"/><polygon class="d-head" points="170,82 173.6,75.0 166.4,75.0"/><rect class="d-box" x="20" y="82" width="300" height="62" rx="10"/><text class="d-t" x="170" y="103.5" text-anchor="middle">Extraction locale (pypdf)</text><text class="d-s" x="170" y="117.5" text-anchor="middle">sous-processus · 4 s · 3 s CPU</text><text class="d-s" x="170" y="131.5" text-anchor="middle">256 MiB · 1 à 10 pages</text><polyline class="d-l" points="120,144 120,170"/><polygon class="d-head" points="120,170 123.6,163.0 116.4,163.0"/><polygon class="d-box" points="120,170.0 220.0,206 120,242.0 20.0,206"/><text class="d-t" x="120" y="202" text-anchor="middle">Texte</text><text class="d-t" x="120" y="219" text-anchor="middle">exploitable ?</text><rect class="d-box" x="236" y="182" width="96" height="48" rx="10"/><text class="d-t" x="284" y="203.5" text-anchor="middle">Secours IA</text><text class="d-s" x="284" y="217.5" text-anchor="middle">PDF → OpenAI</text><polyline class="d-l" points="220,206 236,206"/><polygon class="d-head" points="236,206 229.0,202.4 229.0,209.6"/><text class="d-s d-halo" x="228" y="196" text-anchor="middle">non</text><polyline class="d-l" points="120,242 120,284"/><polygon class="d-head" points="120,284 123.6,277.0 116.4,277.0"/><text class="d-s d-halo" x="128" y="268" text-anchor="start">oui</text><polyline class="d-l d-dash" points="284,230 284,284"/><polygon class="d-head" points="284,284 287.6,277.0 280.4,277.0"/><rect class="d-key" x="20" y="284" width="300" height="50" rx="10"/><text class="d-t" x="170" y="306.5" text-anchor="middle">Le texte remplit le profil</text><text class="d-s" x="170" y="320.5" text-anchor="middle">pas de double saisie</text><polyline class="d-l" points="170,334 170,362"/><polygon class="d-head" points="170,362 173.6,355.0 166.4,355.0"/><rect class="d-box" x="20" y="362" width="300" height="50" rx="10"/><text class="d-t" x="170" y="384.5" text-anchor="middle">Le candidat relit</text><text class="d-s" x="170" y="398.5" text-anchor="middle">puis passe aux opportunités</text></svg><figcaption>Depuis le 26 octobre : l&#x27;extraction textuelle passe d&#x27;abord, sans appel au modèle. Le secours IA ne sert que si le texte n&#x27;est pas exploitable.</figcaption></figure>

L'extraction `pypdf` tourne dans un sous-processus : 4 secondes au plus en temps écoulé, 3 secondes de CPU, 256 MiB de mémoire, de 1 à 10 pages pour la voie rapide. Les pages peu textuelles, certains glyphes invalides, les documents chiffrés et les textes trop longs sont refusés par cette voie : ils passent au secours IA. Extrait du dépôt (code écrit avec l'assistance de ChatGPT et Codex) :

```python
resource.setrlimit(resource.RLIMIT_AS, (256 * 1024 * 1024, 256 * 1024 * 1024))
resource.setrlimit(resource.RLIMIT_CPU, (3, 3))
```

Ces bornes réduisent les risques et l'attente. Elles ne garantissent pas l'ordre de lecture d'un PDF en colonnes. Et le serveur exige aujourd'hui une clé OpenAI configurée avant l'opération, même quand la voie textuelle suffit.

## GitHub : enrichir sans surinterpréter

Le navigateur accepte l'URL d'un dépôt public GitHub et lit ses métadonnées : nom, description, langage principal, fork ou non. Il demande ensuite au candidat de préciser sa contribution.

Ce n'est ni un audit du code, ni une analyse des commits, ni une preuve d'auteur. Le contenu du dépôt n'est pas exécuté. Les URL quelconques, les dépôts privés et les paramètres inattendus sont hors contrat.

## Les offres : ce qui est vraiment connecté

<figure class="shot"><img src="/drills/opportunities-en.jpg" alt="L&#x27;écran Opportunités : recherche d&#x27;offres ou collage d&#x27;une annonce." width="1363" height="936" loading="lazy" decoding="async"><figcaption>L&#x27;étape Opportunités : chercher une offre ou coller une annonce et son lien. Capture du 25 octobre 2026, exemple fictif.</figcaption></figure>

| Source | Tableaux configurés |
| --- | --- |
| Greenhouse | Anthropic, Databricks, Scale AI |
| Ashby | Mistral AI, Dust |

Les adaptateurs lisent les API publiques, nettoient le HTML, dédupliquent par URL et limitent la liste à 60 offres. Les lectures partent en parallèle, avec un délai réseau de 12 secondes. Une réponse complète peut rester en cache 300 secondes. **Une source en panne n'est jamais déguisée en absence d'offres** : ce serait un échec silencieux.

Le filtre repose sur des mots, cherchés par regex : le titre doit viser un niveau débutant (stage, junior, alternance…), un métier d'ingénierie, et le texte doit parler d'agents. Les titres senior, staff, principal, lead, manager, director et head sont exclus.

```python
if re.search(r'\b(senior|staff|principal|lead|manager|director|head)\b', title, re.I): return None
```

Ce filtre peut manquer une bonne offre ou en garder une imparfaite. Ce qui n'est pas livré : une base exhaustive du marché, un classement des offres selon le profil, LinkedIn, ou la lecture automatique de n'importe quelle URL. L'autre voie reste le collage du texte complet d'une annonce.

## Le retrait des entretiens

Une version intermédiaire enregistrait le pitch dans le navigateur, le faisait transcrire par l'API OpenAI et donnait un feedback sur la clarté, les preuves et la pertinence. La préparation technique est passée à des cas rédigés à l'avance, avec des rubriques explicites (dont debugging et refactoring Python). Une rubrique pédagogique n'est pas la preuve d'une question vraiment posée par une entreprise.

J'ai retiré cette préparation du parcours. Les routes `/api/interview/transcribe`, `/api/interview/feedback` et `/api/interview/technical` renvoient 410 pour une requête valide, et la page `prepare` redirige vers la candidature.

## Ce que je retiens

- Un import réussi n'est pas la fin de l'action attendue : il doit mener au diagnostic.
- Une source lue n'en dit pas plus que ce qu'elle contient : des métadonnées GitHub ne prouvent pas une contribution.
- Une panne s'affiche comme une panne.

## Les mécanismes Python

- [My Python for AI 101, chapitre 11 · Déployer et outiller](/fr/books/python-for-ai-101/chapter-11/) : fiche 53, `subprocess`, ici avec des limites de mémoire et de CPU.
- [My Python for AI 101, chapitre 7 · Les erreurs et les garde-fous](/fr/books/python-for-ai-101/chapter-07/) : fiche 31, le repli dégradé (l'extraction qui échoue renvoie `None`, et le secours IA prend le relais).
- [My Python for AI 101, chapitre 5 · Le texte](/fr/books/python-for-ai-101/chapter-05/) : fiche 18, les expressions régulières du filtre d'offres.
- [My Python for AI 101, chapitre 10 · Le réseau, le temps et la concurrence](/fr/books/python-for-ai-101/chapter-10/) : fiche 48, vérifier qu'un lien est bien en `https` avant de le garder.

## La question de défense

> Le lien GitHub prouve-t-il que le candidat a écrit le projet ?

Non. Je lis des métadonnées publiques : nom, description, langage, fork. La contribution, c'est le candidat qui la précise.
