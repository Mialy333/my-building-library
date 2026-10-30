---
workedOn: 2026-10-22
---

Six fiches sur la forme des données qu'un agent manipule : le dictionnaire et sa lecture prudente avec .get(), la dataclass figée, les nombres exacts, les octets et le hash, et les identifiants.

## Fiche 6 — Le dictionnaire, un contrat léger

**Projet.** Dev3Pack AI Engineering Bootcamp

**En une phrase.** Un `dict` range des valeurs sous des noms (les clés), comme une fiche aux cases étiquetées.

**Pourquoi pour un agent.** La trace, le reçu d'une boucle, la réponse d'un outil sont des dicts. Une clé absente fait planter l'étape suivante, ou pire, la fait se taire.

**Analogie.** Un bordereau de virement : chaque case a un nom (IBAN, montant). Sans montant, le guichet le rejette.

**Le mécanisme.**

```python
answer_fields = {"answer", "citations", "confidence", "needs_human_review"}
healthy = answer_fields <= good["body"].keys()   # toutes les cases sont là ?
tag_index.setdefault(tag, []).append(doc_id)       # crée la liste au premier passage
new_state = {**state, "rejected": reason}          # une copie, une case changée
```

**Entrée → sortie.** Trois documents tagués → `tag_index["retrieval"] == ['rag-basics', 'evaluation-basics']`. `{**state, "rejected": "x"}` rend un nouveau dict ; `state` ne change pas.

**Où le relire.** [ch14 · cellule 9](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch14/notebook.ipynb) (`smoke`, le test `<=`) · [ch06 · cellule 13](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch06/notebook.ipynb) (index des tags) · [ch08 · cellule 28](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch08/notebook.ipynb) (`storm_step`) · [ch05 · cellules 13 et 24](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch05/notebook.ipynb) (`receipt`, `chat.setdefault("calls", 0)`).

**À réutiliser.** Vérifier un payload avec `REQUIRED <= data.keys()` avant de le lire. Construire un index avec `setdefault`. Produire un nouvel état avec `{**old, clé: valeur}` plutôt que modifier l'ancien.

## Fiche 7 — Chaînage de `.get()`

**Projet.** AI Support Agent (AWS Scholars, chapitre 2)

**En une phrase.** `memory.get("content", {}).get("text", "").strip()` fournit une valeur par défaut à chaque étage d'un dictionnaire imbriqué, donc il ne lève jamais de `KeyError` même si une clé manque n'importe où dans la chaîne.

**Pourquoi pour un agent.** Les réponses mémoire, Gateway et Knowledge Base sont des JSON externes, pas garantis d'avoir exactement la forme attendue ; un accès direct par crochets (`data["content"]["text"]`) plante le tour entier à la première clé absente.

**Analogie.** Demander « la ville, sinon rien » plutôt que d'exiger une adresse complète : s'il manque le code postal, on obtient quand même quelque chose d'utilisable.

**Le mécanisme.**

```python
for memory in memories:
    text = memory.get("content", {}).get("text", "").strip()
    if text:
        context_snippets.append(f"[{strategy_type}] {text}")
```

**Entrée → sortie.** Un item mémoire `{"content": {}}` (sans `"text"`) → `text = ""` → l'item est simplement ignoré (`if text:` est faux), au lieu de faire planter la boucle entière.

**Où le relire.** [main.py L146–149](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/main.py#L146-L149)

**À réutiliser.** Face à une réponse JSON/API imprévisible — le cas de presque tous les outils IA — enchaîner `.get(clé, défaut)` plutôt que `data[clé][clé2]` : ça échoue en douceur, jamais en exception.

## Fiche 8 — La dataclass figée

**Projet.** Dev3Pack AI Engineering Bootcamp

**En une phrase.** `@dataclass` déclare une fiche aux champs nommés et typés ; `frozen=True` interdit de la modifier après sa création.

**Pourquoi pour un agent.** Une réponse ou une intention qui peut changer en route ne prouve plus rien. L'intention épinglée doit rester celle du départ.

**Analogie.** Un ordre de bourse horodaté : on ne le réécrit pas, on en passe un autre.

**Le mécanisme.**

```python
@dataclass(frozen=True)
class ResearchAnswer:
    answer: str
    citations: tuple[str, ...]      # un tuple, lui aussi impossible à modifier
    confidence: float
    needs_human_review: bool

@dataclass
class SessionState:
    episodes: list[str] = field(default_factory=list)   # une liste neuve par objet
```

**Entrée → sortie.** `answer.confidence = 1.0` → `FrozenInstanceError: cannot assign to field 'confidence'`. `asdict(answer)` → un dict prêt pour `json.dump`. Deux `SessionState()` n'ont jamais la même liste.

**Où le relire.** [`schema.py · ResearchAnswer`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/schema.py#L31), [`documents.py · Document`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/documents.py#L29), [`agent.py · TraceEvent, AgentResult`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/agent.py#L49) — cours · [ch06 · cellule 5](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch06/notebook.ipynb) (`MiniDocument`) · [ch11 · cellule 6](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch11/notebook.ipynb) (`SessionState`) · [`my-gecko-buyer/buyer/intent.py · IntentRecord`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/intent.py#L74), [`Menu.from_list_stores`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/intent.py#L39) · [`buyer/check.py · FieldResult`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/check.py#L36).

**À réutiliser.** Tout ce qui sort d'un modèle ou d'un outil devient une dataclass figée. `tuple` plutôt que `list` dans un objet figé. `field(default_factory=list)` pour une valeur par défaut modifiable. Un `@classmethod from_xxx(cls, data)` pour construire l'objet depuis un JSON.

## Fiche 9 — Les nombres exacts

**Projet.** Dev3Pack AI Engineering Bootcamp

**En une phrase.** L'argent se compte en entiers, dans la plus petite unité du token ; un texte comme « 2.5 » se convertit avec `Decimal`, jamais avec `float`.

**Pourquoi pour un agent.** Un agent qui paie compare des montants au budget. Une erreur d'arrondi suffit à faire passer un prix trop haut.

**Analogie.** La banque compte en centimes, pas en euros à virgule.

**Le mécanisme.**

```python
budget_raw = int(Decimal(cap.group(1)) * (10**item.decimals))   # "2" -> 2000000
if prepared.price_raw is None:                                    # montant inconnu
    return refuse("price_raw", f"at most {intent.budget_raw}", None)
if prepared.price_raw > intent.budget_raw:                        # entiers comparés
    return refuse("price_raw", f"at most {intent.budget_raw}", prepared.price_raw)
```

**Entrée → sortie.** `0.1 + 0.2` → `0.30000000000000004`. `Decimal("0.1") + Decimal("0.2")` → `0.3`. `int(Decimal("2.5") * 10**6)` → `2500000`. `1_000_000` vaut un million : l'underscore aide seulement à lire.

**Où le relire.** [`my-gecko-buyer/buyer/intent.py · parse_intent`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/intent.py#L166) (le plafond « up to ») · [`buyer/check.py · check_price`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/check.py#L119) · [ch10 · cellule 20](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch10/notebook.ipynb) (`plan_purchase`, `total = price_raw * quantity`) · [ch10 · cellule 19](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch10/notebook.ipynb) (prix en `1_000_000`).

**À réutiliser.** Stocker `price_raw: int` et `decimals: int`. Convertir un texte humain une seule fois, avec `Decimal`. Garder `None` pour « montant inconnu », et refuser dessus.

## Fiche 10 — Octets, base64 et empreinte

**Projet.** Dev3Pack AI Engineering Bootcamp

**En une phrase.** Une transaction est une suite d'octets (`bytes`) ; base64 l'écrit en texte pour la transporter ; une empreinte SHA-256 résume un texte sans le révéler.

**Pourquoi pour un agent.** L'agent doit signer exactement les octets vérifiés : un octet changé fait une autre transaction. Et un log ne doit jamais montrer un secret.

**Analogie.** Base64, c'est l'enveloppe qui transporte un chèque : le contenu ne change pas. L'empreinte, ce sont les quatre derniers chiffres d'une carte.

**Le mécanisme.**

```python
raw = bytearray(base64.b64decode(signed_b64))    # texte -> octets modifiables
raw[-1] ^= 0x01                                    # change un bit du dernier octet
tampered = base64.b64encode(bytes(raw)).decode()   # octets -> texte

fingerprint = hashlib.sha256(secret.encode()).hexdigest()[:8]
```

**Entrée → sortie.** `b"hello bytes"` → `aGVsbG8gYnl0ZXM=`. Après le changement → `aGVsbG8gYnl0ZXI=`, soit `b'hello byter'` : `verify` le voit. L'empreinte de `sk-a1b2c3d4e5f60718293a` → `4e3ecbe6`, la même à chaque fois. `store_address("dev3mialy333")`, calculée à partir des octets `b"receipts"` et du nom, → `65Zhzi9nXbfuHC6y79VdKtMSzni5mPQJrg1G7BarAaCX`, l'adresse réelle de mon store.

**Où le relire.** [`my-gecko-buyer/buyer/agent.py · _tamper`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/agent.py#L209) (la carte « tampered ») · [`buyer/prepared.py · base64.b64decode`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/prepared.py#L60) · [`buyer/letmebuy.py · store_address`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/letmebuy.py#L50) — cours · [ch09 · cellule 17](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch09/notebook.ipynb) (`placeholder`).

**À réutiliser.** `str.encode()` et `bytes.decode()` aux frontières. Comparer une transaction octet par octet, jamais à l'œil. Masquer un secret par `étiquette + sha256[:8]` : on peut dire « c'est le même » sans le montrer.

## Fiche 11 — Identifiants : `random.choices` vs `uuid.uuid4()`

**Projet.** AI Support Agent (AWS Scholars, chapitre 2)

**En une phrase.** `refund_processor.py` tire un ID de remboursement lisible avec `random.choices()` sur un alphabet choisi ; `main.py` génère un ID de session garanti unique avec `uuid.uuid4()` — deux fonctions pour deux garanties différentes.

**Pourquoi pour un agent.** Un ID de démo doit juste être lisible dans un ticket de support ; un ID de session doit, lui, ne jamais entrer en collision entre deux clients ou deux machines — confondre les deux outils introduirait soit un ID imbuvable, soit un vrai risque de collision.

**Analogie.** Un numéro de ticket de vestiaire (court, lisible, tiré au hasard) contre un numéro de série de passeport (long, conçu pour être unique dans le monde entier).

**Le mécanisme.**

```python
def _new_refund_id() -> str:
    return "REF-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=8))

session_id = payload.get("session_id") or str(uuid.uuid4())
```

**Entrée → sortie.** `_new_refund_id()` → par ex. `"REF-7KQZX2P9"` (8 caractères, 36^8 combinaisons possibles) ; `session_id` absent du payload → une chaîne UUID v4 de 36 caractères garantie pratiquement unique.

**Où le relire.** [refund\_processor.py L29–38](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/lambda/refund_processor.py#L29-L38) · [main.py L349](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/main.py#L349)

**À réutiliser.** Pour un ID de démo lisible par un humain → `random.choices` sur un alphabet choisi ; pour un ID qui ne doit jamais collisionner entre sessions ou machines → `uuid.uuid4()`.

## Sur le terrain

Les chapitres de mes formations et de mes projets où ces mécanismes tournent pour de vrai.

- [Dev3Pack, Session 5](/fr/books/dev3pack/session-05/) : fiche 6.
- [Dev3Pack, Session 6](/fr/books/dev3pack/session-06/) : fiches 6 et 8.
- [Dev3Pack, Session 8](/fr/books/dev3pack/session-08/) : fiche 6.
- [Dev3Pack, Session 9](/fr/books/dev3pack/session-09/) : fiche 10.
- [Dev3Pack, Session 10](/fr/books/dev3pack/session-10/) : fiche 9.
- [Dev3Pack, Session 11](/fr/books/dev3pack/session-11/) : fiche 8.
- [Dev3Pack, Session 14](/fr/books/dev3pack/session-14/) : fiche 6.
- [Dev3Pack, Gecko capstone](/fr/books/dev3pack/gecko/) : fiches 8, 9 et 10.
- [AWS Scholars, chapitre 2 · AI Support Agent](/fr/books/aws-scholars/chapter-02/) : fiches 7 et 11.
