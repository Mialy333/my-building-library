---
workedOn: 2026-10-22
---

Deux fiches pour finir : des tests qui tournent hors ligne, et une boucle « attendu contre obtenu » qui mesure le comportement.

## Fiche 59 — Les tests avec pytest

**Projet.** Dev3Pack AI Engineering Bootcamp

**En une phrase.** Un test est une fonction `test_…` qui affirme un résultat ; pytest fournit des outils prêts : `tmp_path`, `monkeypatch`, `parametrize`, et les *fixtures*.

**Pourquoi pour un agent.** Les tests du buyer tournent réseau coupé : un test qui tente d'appeler Internet échoue. La note ne dépend donc ni du wifi, ni d'un service extérieur.

**Analogie.** Un contrôle interne qui rejoue chaque mois les mêmes opérations témoins.

**Le mécanisme.**

```python
@pytest.fixture(autouse=True)          # s'applique à TOUS les tests du dossier
def no_network(monkeypatch: pytest.MonkeyPatch) -> None:
    def blocked(*_: Any, **__: Any) -> None:
        raise OSError("tests are offline: the network is blocked")
    monkeypatch.setattr(socket.socket, "connect", blocked)
    monkeypatch.setattr(socket, "create_connection", blocked)

@pytest.mark.parametrize(("status", "code", "error"), [(401, "key-invalid", "…"), (429, "rate-limited", "…")])
def test_each_refusal_prints_the_servers_message(home, capsys, status, code, error): ...
```

**Entrée → sortie.** `uv run pytest` : `98 passed, 2 skipped` dans `my-gecko-buyer` (4 oct) ; `7 passed, 2 skipped` dans `grounded-research-agent`.

**Où le relire.** [`my-gecko-buyer/tests/conftest.py · no_network`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/tests/conftest.py#L17) · [`tests/test_mainnet_wallet.py · parametrize`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/tests/test_mainnet_wallet.py#L141) (`tmp_path`, `monkeypatch.setenv`) — cours · [`grounded-research-agent/tests/test_contract.py`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/tests/test_contract.py#L220) (le timeout attrapé en moins d'une seconde, la citation inventée retirée) · les cellules `check("chNN-eN", …)` de chaque notebook.

**À réutiliser.** Bloquer le réseau dans `conftest.py` dès le premier test. Un test par refus attendu, nommé comme une phrase. `parametrize` pour rejouer la même règle sur plusieurs cas. `tmp_path` pour écrire des fichiers jetables.

## Fiche 60 — Tester la structure, évaluer le comportement

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** `unittest` organise des tests en classes ; `inspect.getsource` et `ast` lisent la structure d'une fonction sans l'exécuter ; une boucle « attendu contre obtenu » sur un jeu de cas fixe mesure le comportement d'un système d'IA.

**Pourquoi pour un agent.** Le correcteur Udacity vérifie que mon code contient bien `ThreadPoolExecutor` et `submit`. Et le guardrail ne se règle pas à l'impression : chaque définition de topic est mesurée sur les mêmes cas avant d'être publiée.

**Analogie.** L'audit vérifie que la procédure existe (structure) ; le backtest vérifie qu'elle donne les bons résultats (comportement).

**Le mécanisme.**

```python
source = inspect.getsource(self.ao.build_policy_agent)
tree = ast.parse(source)
uses_pool = any(isinstance(node, ast.Name) and node.id == 'ThreadPoolExecutor'
                for node in ast.walk(tree))

for expected, source, text in CASES:
    r = RUNTIME.apply_guardrail(guardrailIdentifier=..., guardrailVersion=version,
                                source=source, content=[{'text': {'text': text}}])
    got = 'BLOCKED' if r['action'] == 'GUARDRAIL_INTERVENED' else 'ALLOWED'
    ok += got == expected                          # True counts as 1
```

**Entrée → sortie.** Rejoué sur `build_policy_agent` : `ThreadPoolExecutor` trouvé, `1` appel à `submit`. Trois cas, deux bons → `2/3`. Dans le projet : `tests/test_agent.py all` → 120/120 ; tests adversariaux → 5 attaques sur 5 bloquées avec la bonne politique, la question maths autorisée (134,96 $).

**Où le relire.** [`test_agent.py · TestTask2`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/tests/test_agent.py#L109) · [`test_agent.py · ast.walk`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/tests/test_agent.py#L282) · [`tune_guardrail.py · _evaluate`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/scripts/tune_guardrail.py#L100) · [`adversarial_test.py · apply_guardrail`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/scripts/adversarial_test.py#L77).

**À réutiliser.** Un jeu de cas fixe (autorisés et bloqués) écrit avant de régler. Mesurer sur la version DRAFT, publier seulement la meilleure. Garder les rapports d'évaluation dans `evidence/`.

## Sur le terrain

Les chapitres de mes formations et de mes projets où ces mécanismes tournent pour de vrai.

- [Dev3Pack, Final assignment](/fr/books/dev3pack/final/) : fiche 59.
- [Dev3Pack, Gecko capstone](/fr/books/dev3pack/gecko/) : fiche 59.
- [AWS Scholars, chapitre 3 · NovaMart Multi-Agent Support](/fr/books/aws-scholars/chapter-03/) : fiche 60.
- [DRILLS.ai, chapitre 4 · Phase 1 : des agents qui fabriquent des exercices](/fr/books/drills-ai/chapter-04/) : fiche 60.
- [DRILLS.ai, chapitre 11 · Incidents, mesures et limites](/fr/books/drills-ai/chapter-11/) : fiche 59.
