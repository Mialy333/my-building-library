---
workedOn: 2026-10-26
---

DRILLS.ai est l'outil que j'ai construit pendant le hackathon OpenAI DevDay, dans la catégorie Impact → New Opportunities → Jobs. Il aide les personnes en reconversion à décrocher leurs premiers entretiens d'Agent Engineer. Il relie leurs expériences aux exigences d'une offre, puis prépare une candidature qu'elles relisent, modifient et envoient elles-mêmes.

<figure class="shot"><img src="/drills/home-en.jpg" alt="L&#x27;accueil de DRILLS.ai, en anglais, avec le bouton pour commencer une candidature." width="1363" height="936" loading="lazy" decoding="async"><figcaption>L&#x27;accueil de DRILLS.ai, capture du 25 octobre 2026 avec un exemple fictif.</figcaption></figure>

## Le concept

Un outil de candidature doit dire ce qu'il garantit, et ce qu'il ne garantit pas. Le contrat du MVP fixe les entrées, les sorties, la place de l'humain, et ce qui reste hors contrat.

## Le problème de départ

Après une dizaine d'années en finance de marché, je me suis reconvertie vers le développement, puis vers l'Agent Engineering : Ada Tech School, puis le programme Future Agent Engineer d'Udacity et AWS. Le problème n'était pas d'apprendre une technologie de plus. C'était de savoir quoi faire de tout mon parcours : expériences, formations, projets, connaissances métier, et compétences techniques encore en construction.

Trois questions reviennent à chaque offre :

1. Mon profil apporte-t-il des preuves pertinentes pour cette offre ?
2. Quelles exigences comptent vraiment, et lesquelles restent à clarifier ?
3. Quelle prochaine action rend ma candidature plus crédible ?

La cible, ce sont des personnes en reconversion qui ont déjà des bases de développement et des projets. Elles ne repartent pas de zéro. Mais elles ne doivent pas présenter leurs années dans un autre métier comme des années d'ingénierie. Les offres visées : stage, alternance ou apprentissage, et premier emploi lié à la construction d'agents IA. Le titre de l'offre ne suffit pas : les missions et le niveau attendu comptent.

## La promesse a changé deux fois

<figure class="diagram"><svg viewBox="0 0 340 306" role="img" aria-labelledby="d-promise-fr-t"><title id="d-promise-fr-t">Évolution de la promesse de DRILLS.ai</title><rect class="d-box" x="20" y="8" width="300" height="72" rx="10"/><text class="d-s" x="170" y="30" text-anchor="middle">PROTOTYPE INITIAL</text><text class="d-t" x="170" y="47" text-anchor="middle">Apprendre et pratiquer</text><text class="d-t" x="170" y="64" text-anchor="middle">avec des exercices de code ciblés</text><polyline class="d-l" points="170,80 170,110"/><polygon class="d-head" points="170,110 173.6,103.0 166.4,103.0"/><rect class="d-box" x="20" y="110" width="300" height="72" rx="10"/><text class="d-s" x="170" y="132" text-anchor="middle">PIVOT INTERMÉDIAIRE</text><text class="d-t" x="170" y="149" text-anchor="middle">Évaluer son profil, préparer</text><text class="d-t" x="170" y="166" text-anchor="middle">candidature et entretiens</text><polyline class="d-l d-acc" points="170,182 170,212"/><polygon class="d-head d-acc" points="170,212 173.6,205.0 166.4,205.0"/><rect class="d-key" x="20" y="212" width="300" height="72" rx="10"/><text class="d-s" x="170" y="234" text-anchor="middle">MVP FINAL</text><text class="d-t" x="170" y="251" text-anchor="middle">Préparer une candidature pour</text><text class="d-t" x="170" y="268" text-anchor="middle">décrocher ses premiers entretiens</text><text class="d-s d-halo d-a" x="180" y="201" text-anchor="start">− préparation entretiens</text></svg><figcaption>La promesse a changé deux fois. La préparation aux entretiens a été construite, puis retirée du parcours public.</figcaption></figure>

| Version | Promesse | Ce que le produit contenait |
| --- | --- | --- |
| Prototype initial | Apprendre et pratiquer avec des exercices de code ciblés | Roadmap, génération d'exercices, validation, progression, compagnon |
| Pivot intermédiaire | Évaluer son profil, préparer candidature et entretiens | CV, matching, pitch audio, feedback, exercices techniques fixes |
| MVP final | Préparer une candidature pour décrocher ses premiers entretiens | Profil → opportunités → diagnostic → documents → candidature sur le site d'origine, et suivi |

J'ai construit la préparation aux entretiens, puis je l'ai retirée du parcours public. C'est une décision de périmètre : arriver jusqu'à la candidature comptait plus que multiplier les fonctions. « Décrocher ses premiers entretiens » décrit le but du produit, pas un résultat garanti.

## Le contrat du MVP

| Élément | Contrat |
| --- | --- |
| Entrée | Profil saisi ou CV en PDF, texte complet d'une annonce, langue FR ou EN, consentement ; GitHub et conditions de candidature facultatifs |
| Profil | Au moins 50 caractères, au plus 16 000 dans la requête d'analyse, conditions comprises |
| Annonce | De 50 à 20 000 caractères ; un lien seul ne remplace pas le texte |
| PDF | 4 MiB au plus ; extraction à relire ; pas de ressaisie après un import réussi |
| Diagnostic | Rôle, périmètre, exigences, preuves, explications, prochaines actions, score quand il est calculable |
| Documents | Sections de CV et présentation personnelle, modifiables avant export |
| Action finale | Lien HTTPS vers l'annonce ou le formulaire d'origine ; le candidat envoie lui-même |
| Suivi | Offres analysées, statuts déclarés, date d'envoi, notes |
| Contrôle humain | Relecture des faits, correction des formulations, confirmation avant export, déclaration de l'envoi |
| Hors contrat | Probabilité d'embauche, certification de compétences, vérification administrative, envoi automatique |

**Le budget d'appels IA.** L'extraction d'un PDF peut se passer de l'IA. L'analyse fait un appel, avec au plus une tentative corrective si une preuve est refusée. La rédaction, demandée ensuite, a son propre appel et au plus une correction. Chaque opération est plafonnée par le délai de l'API. Ce n'est donc pas « un seul appel pour tout le parcours ».

## Ce qui est livré

| Livrable | Où | État |
| --- | --- | --- |
| Application bilingue | GitHub Pages, `/fr/` et `/en/` | Livrée |
| API métier | `api/main.py`, Render | Livrée, essayée le 26 octobre |
| Agent de candidature | `src/ai_generator/application.py` | Livré |
| Recherche d'offres | `src/integrations/jobs.py` | Livrée, couverture limitée |
| Aperçu d'un dépôt GitHub | `src/lib/github-project.ts` | Livré |
| Édition et export du CV | `src/lib/cv-editor.ts`, `cv-layout.ts` | Livrés |
| Suivi des candidatures | `application-history.ts`, page de suivi | Livré |
| Surface MCP | `api/mcp_app.py` | Implémentée ; connexion d'un client à vérifier à part |
| Tests et CI | `tests/`, `.github/workflows/` | 120 tests Python et 70 tests frontend réussis le 26 octobre |
| Documentation | README, `docs/BRANCHES.md`, `docs/images/` | Livrée |
| Vidéo | YouTube | Publiée |
| Effet sur les candidatures | Tests avec de vrais candidats | À mener |

## Comment j'ai travaillé

ChatGPT et Codex m'ont assistée pour la conception, le code et les itérations. DRILLS.ai n'est donc pas du code écrit sans outil. Cette aide au développement est une chose ; les appels à OpenAI que fait l'application pour les candidats en sont une autre.

Une base de projet existait avant le pivot. Le week-end du hackathon a transformé le produit et produit un parcours candidat qui fonctionne : il n'est pas exact de dire que tout le dépôt est né de zéro pendant ces deux jours.

## Ce que je retiens

- Écrire ce qui est hors contrat compte autant que ce qui est dedans.
- Retirer une fonction déjà construite peut être la bonne décision.
- Un but n'est pas une garantie : aucun résultat d'embauche n'est revendiqué.

## La question de défense

> Le score mesure-t-il une chance d'embauche ?

Non. Il mesure la part des exigences extraites de l'annonce que le profil documente. La probabilité d'embauche est explicitement hors contrat.
