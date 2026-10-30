---
---

## Le principe

On donne au modèle l'autonomie dont la tâche a besoin, pas plus. Quand les étapes sont connues, le code les enchaîne. Et une action qui engage quelqu'un (envoyer, payer, publier) est confirmée par un humain, ou vérifiée par le code avant d'exister.

## Pourquoi c'est important

Chaque décision laissée au modèle coûte des appels, et ouvre des pannes qu'il faut ensuite contrôler. Appeler un composant « agent » ne dit pas ce qu'il décide. Et une action faite au nom de quelqu'un ne se rattrape pas toujours : une candidature partie, un paiement signé.

## Le mécanisme

<figure class="diagram"><svg viewBox="0 0 340 352" role="img" aria-labelledby="d-ladder-fr-t"><title id="d-ladder-fr-t">Doser l&#x27;autonomie d&#x27;un agent</title><rect class="d-box" x="48" y="8" width="284" height="62" rx="10"/><text class="d-t" x="190" y="36.5" text-anchor="middle">Chaîne fixe</text><text class="d-s" x="190" y="50.5" text-anchor="middle">le code décide de chaque étape</text><polyline class="d-l" points="190,70 190,94"/><polygon class="d-head" points="190,94 193.6,87.0 186.4,87.0"/><rect class="d-box" x="48" y="94" width="284" height="62" rx="10"/><text class="d-t" x="190" y="122.5" text-anchor="middle">Workflow piloté par l&#x27;application</text><text class="d-s" x="190" y="136.5" text-anchor="middle">le modèle analyse ou rédige à une étape</text><polyline class="d-l" points="190,156 190,180"/><polygon class="d-head" points="190,180 193.6,173.0 186.4,173.0"/><rect class="d-box" x="48" y="180" width="284" height="62" rx="10"/><text class="d-t" x="190" y="208.5" text-anchor="middle">Boucle d&#x27;agent</text><text class="d-s" x="190" y="222.5" text-anchor="middle">le modèle choisit l&#x27;outil suivant</text><polyline class="d-l" points="190,242 190,266"/><polygon class="d-head" points="190,266 193.6,259.0 186.4,259.0"/><rect class="d-key" x="48" y="266" width="284" height="62" rx="10"/><text class="d-t" x="190" y="294.5" text-anchor="middle">Action qui engage</text><text class="d-s" x="190" y="308.5" text-anchor="middle">l&#x27;humain confirme, ou le code vérifie</text><polyline class="d-l d-acc" points="18,12 18,334"/><polygon class="d-head d-acc" points="18,334 21.6,327.0 14.4,327.0"/><text class="d-s d-a" x="30" y="176" text-anchor="middle" transform="rotate(-90 30 176)">plus d&#x27;autonomie, plus de contrôles</text></svg><figcaption>Chaque marche donne plus de décisions au modèle, et demande plus de contrôles. On monte seulement si la tâche l&#x27;exige.</figcaption></figure>

1. **Demander ce que l'agent décide réellement.** Choisir l'outil suivant, ou seulement analyser et rédiger à une étape fixée par le code ?
2. **Prendre la marche la plus basse qui suffit.** Une chaîne fixe ou un workflow piloté par l'application quand l'ordre des étapes est connu ; une boucle quand le modèle doit vraiment choisir. Compter les appels de chaque option.
3. **Des outils en lecture seule par défaut.** Un outil qui agit à l'extérieur se justifie par un usage réel, écrit dans une décision d'architecture.
4. **La dernière action à l'humain, ou à une vérification en code.** L'humain relit, corrige et confirme ; ou le code compare l'action à la demande épinglée avant de l'exécuter.
5. **Enregistrer l'action humaine explicitement.** Un lien ouvert n'est pas une candidature envoyée ; c'est la personne qui déclare l'envoi.
6. **Revoir le niveau d'autonomie sur preuve.** Monter d'une marche si une évaluation montre un gain net, pas parce que c'est possible.

## Sur le terrain

- [Dev3Pack, Session 8](/fr/books/dev3pack/session-08/) : chaîne, boucle ou réflexion. La chaîne coûte un appel, la réflexion deux à trois : on compte avant de choisir.
- [Dev3Pack, Gecko](/fr/books/dev3pack/gecko/) : l'agent peut payer, mais seulement si chaque champ concorde avec la demande épinglée. L'autonomie est accordée, et bornée par le code.
- [DRILLS.ai, chapitre 2](/fr/books/drills-ai/chapter-02/) : `ApplicationAgent` porte le nom d'agent, mais c'est l'application qui pilote le workflow. Le modèle analyse et rédige ; il ne navigue pas, n'exécute rien et ne postule pas.
- [DRILLS.ai, chapitre 8](/fr/books/drills-ai/chapter-08/) : le candidat relit, modifie, confirme l'export et déclare lui-même l'envoi.
- [DRILLS.ai, chapitre 9](/fr/books/drills-ai/chapter-09/) : trois outils MCP en lecture seule. Donner à un agent le pouvoir de postuler a été écarté.

## La question à se poser

> Qu'est-ce que cet agent décide seul, et qu'est-ce qui se passe s'il se trompe ?
