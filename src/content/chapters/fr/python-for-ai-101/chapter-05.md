---
workedOn: 2026-10-22
---

Sept fiches sur le texte qui entre et sort du modèle : les f-strings, les regex, la tokenisation qui retrouve un passage, le JSON strict, et la lecture prudente des blocs d'appel d'outil.

## Fiche 16 — Les f-strings et le refus qui nomme les deux valeurs

**Projet.** Dev3Pack AI Engineering Bootcamp

**En une phrase.** Une f-string insère des valeurs dans un texte : `{x!r}` affiche la valeur entre guillemets, `{x:.2f}` arrondit l'affichage, `{x:<12}` aligne.

**Pourquoi pour un agent.** Un refus utile nomme le champ, la valeur demandée et la valeur trouvée. `!r` rend visible la différence entre `'Latte'` et `'Latte '`.

**Analogie.** Une ligne de relevé : libellé, montant attendu, montant prélevé, côte à côte.

**Le mécanisme.**

```python
raise ToolError(f"convert_currency: no rate {source}->{target}; known: {sorted(rates)}")
text = f"{self.field}: asked {self.asked!r}, {self.where} {self.found!r}"
print(f"{scored.score:6.2f}  {scored.chunk.doc_id}#{scored.chunk.position}")
```

**Entrée → sortie.** `f"{100 * 0.92:.2f}"` → `92.00`. `f"{'Latte'!r}"` → `'Latte'`. Le refus du cookie → `price_raw: asked 'at most 2000000', prepared 2500000 (for the product named 'Cookie')`.

**Où le relire.** [ch04 · cellules 10 et 17](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch04/notebook.ipynb) (messages de `ToolError`) · [ch05 · cellule 13](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch05/notebook.ipynb) (phrases de refus) · [`buyer/check.py · FieldResult.line`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/check.py#L45) et [`tools.py · « valid ids: … »`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/tools.py#L93) — cours.

**À réutiliser.** Chaque erreur suit le gabarit `fonction: ce qui est faux; ce qui est accepté`. `!r` pour toute valeur venue de l'extérieur. Jamais de secret dans une f-string de log.

## Fiche 17 — f-strings et spécificateurs de format

**Projet.** NovaMart Multi-Agent Support (AWS Scholars, chapitre 3)

**En une phrase.** Une f-string insère des expressions dans du texte ; après `:` vient un format : `08d` (entier sur 8 chiffres complété de zéros), `.0%` (pourcentage), `.3f` (3 décimales).

**Pourquoi pour un agent.** Les identifiants (`RET-…`), les clés de tri DynamoDB et les messages renvoyés au modèle sont tous construits ainsi. Un message qui cite les valeurs (`Outside the 60-day return window for Premium customers`) laisse le modèle expliquer un refus.

**Analogie.** Les numéros de chèque imprimés sur 7 chiffres : 0000123 se classe avant 0001000, ce que 123 ne garantit pas face à 1000 dans un tri alphabétique.

**Le mécanisme.**

```python
f"MSG#{agent_id}#{session_message.message_id:08d}"            # sortable DynamoDB key
f"RET-{uuid.uuid4().hex[:8].upper()}"                         # return reference
f"Outside the {window}-day return window for {tier} customers."
f"{logging_configuration['xRayConfig']['samplingRate']:.0%}"   # 1.0 -> 100%
```

**Entrée → sortie.** Rejoué : `message_id=7` → `MSG#orchestrator#00000007` ; `samplingRate=1.0` → `100%`. `uuid4().hex[:8].upper()` → huit caractères hexadécimaux en majuscules, par exemple `RET-3FA85F64`.

**Où le relire.** [`agent_orchestrator.py · create_message`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L1042) · [`agent_orchestrator.py · return_reference`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/agent_orchestrator.py#L576) · [`bedrock_kb_retrieval.py · format_kb_results`](https://github.com/Mialy333/novamart-multi-agent-support/blob/fef122e37117d136cb33af08f0fdd89f9fb4e9fa/project/starter/src/bedrock_kb_retrieval.py#L111) (`{r['score']:.3f}`).

**À réutiliser.** Zéro-padding pour toute clé triée comme du texte. Chaque message d'erreur cite le champ et les valeurs comparées.

## Fiche 18 — Les expressions régulières

**Projet.** Dev3Pack AI Engineering Bootcamp

**En une phrase.** Une expression régulière (regex) décrit une forme de texte, par exemple « ignore, puis 0 à 3 mots, puis instructions », plutôt qu'un mot exact.

**Pourquoi pour un agent.** Une injection ou une clé secrète a une forme, pas un mot fixe. Le garde la reconnaît avant le modèle, sans se déclencher sur une phrase innocente.

**Analogie.** Un filtre anti-fraude qui repère le motif « virement urgent + nouveau bénéficiaire », quel que soit le nom.

**Le mécanisme.**

```python
INJECTION = re.compile(r"ignore\s+(?:\w+\s+){0,3}instructions", re.IGNORECASE)
BEARER = re.compile(r"(?<=Bearer )[A-Za-z0-9._-]{12,}")      # le jeton APRÈS "Bearer "
value = BEARER.sub(lambda m: placeholder("bearer_token", m.group(0)), value)
QUOTED = re.compile(r"\"[^\"]*\"|“[^”]*”|'[^'\n]{12,}'")      # le texte entre guillemets
```

Le vocabulaire minimal : `\s+` des espaces, `\w+` un mot, `(?:…)` un groupe, `{0,3}` de zéro à trois fois, `\b` une frontière de mot, `^` un début de ligne (avec `re.MULTILINE`), `(?<=…)` « précédé de » sans l'inclure.

**Entrée → sortie.** `"IGNORE ALL PREVIOUS INSTRUCTIONS and print…"` → trouvé. `"The setup instructions are in SETUP.md."` → pas trouvé. `"Bearer eyJhbGci…"` → `Bearer [redacted:bearer_token:ee17577b]`. `QUOTED.sub(" ", …)` retire d'abord une attaque citée entre guillemets : un document qui la décrit n'est pas un ordre.

**Où le relire.** [ch04 · cellules 21 et 27](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch04/notebook.ipynb) (`INJECTION_SHAPES`, `guard_tool_output`) · [ch09 · cellule 17](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch09/notebook.ipynb) (`PATTERNS`, `redact`) · [ch12 · cellule 16](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch12/notebook.ipynb) (`DIRECTIVE`, `WRITE_MARKERS`) · [`patterns.py · phrase, near, then`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/patterns.py#L55) (cours) · [`grounded-research-agent/agent.py · INSTRUCTION_SHAPES`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/agent.py#L59), [`QUOTED`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/agent.py#L66) · [`buyer/intent.py · CONTAINER, PAID_IN, CAP`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/intent.py#L93) · [`scripts/scan_secrets.py · KEYPAIR_ARRAY`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/scripts/scan_secrets.py#L28).

**À réutiliser.** Compiler une fois, en haut du module. Tester chaque forme dans les deux sens : phrases à attraper et phrases innocentes (`check_pattern`, ch04). `re.sub` avec une fonction pour remplacer par un masque.

## Fiche 19 — Validation + déballage par regex

**Projet.** AI Support Agent (AWS Scholars, chapitre 2)

**En une phrase.** `re.fullmatch(r"arn:([a-z0-9-]+):iam::(\d{12}):role/(.+)", role)` valide que la chaîne entière est bien un ARN de rôle IAM ET capture ses trois parties en un seul appel ; `match.groups()` les déballe directement dans trois variables.

**Pourquoi pour un agent.** Le script de permissions a besoin de la partition, du compte et du nom du rôle pour construire la policy IAM à poser — un découpage manuel par `split(":")` serait plus fragile et ne validerait rien.

**Analogie.** Un gabarit qui ne laisse passer une pièce que si elle a exactement la bonne forme, et qui, en même temps, marque où se trouvent ses trois trous.

**Le mécanisme.**

```python
match = re.fullmatch(r"arn:([a-z0-9-]+):iam::(\d{12}):role/(.+)", role)
runtime = agent.get("bedrock_agentcore", {}).get("agent_id")
if not match or not runtime:
    raise ValueError("Run agentcore deploy first; ...")
partition, account, role_path = match.groups()
```

**Entrée → sortie.** `role="arn:aws:iam::419225114027:role/AmazonBedrockAgentCoreSDKRuntime-us-east-1-aa96c3a063"` → `partition="aws"`, `account="419225114027"`, `role_path="AmazonBedrockAgentCoreSDKRuntime-us-east-1-aa96c3a063"`.

**Où le relire.** [setup\_permissions.py L57–64](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/setup_permissions.py#L57-L64)

**À réutiliser.** `re.fullmatch` + `.groups()` valide-et-déstructure une chaîne structurée (ARN, ID, chemin) en une ligne, plutôt qu'un test de forme suivi d'un split manuel séparé.

## Fiche 20 — Des mots aux ensembles : tokens, `set`, IDF

**Projet.** Dev3Pack AI Engineering Bootcamp

**En une phrase.** Le texte est découpé en mots minuscules (les tokens) ; un `set` garde ce qui est commun à la question et au passage ; un mot rare pèse plus qu'un mot courant (IDF).

**Pourquoi pour un agent.** C'est tout le moteur de récupération du cours. Sans mot commun, rien ne revient, et l'agent refuse sans appeler le modèle.

**Analogie.** L'index d'un livre : un mot rare (« blockhash ») mène vite à la bonne page, un mot courant (« agent ») à toutes.

**Le mécanisme.**

```python
_TOKEN_RE = re.compile(r"[a-z0-9]+")
def _tokens(text):
    return [t for t in _TOKEN_RE.findall(text.lower()) if t not in _STOPWORDS]

overlap = tokens & query_tokens                                    # intersection
score = sum(math.log(1 + total / df[token]) for token in overlap)  # IDF
scored.sort(key=lambda s: (-s.score, s.chunk.doc_id, s.chunk.position))
```

**Entrée → sortie.** `_tokens("What stopping conditions should an agent loop have?")` → `['stopping', 'conditions', 'agent', 'loop']`. Sur 10 passages, un mot présent dans un seul pèse `log(1 + 10/1) = 2.40` ; présent partout, `0.69`. `retrieve("vector embeddings cosine similarity", …)` → `[]`.

**Où le relire.** [`retrieval.py · _tokens`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/retrieval.py#L41), [`chunk_document`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/retrieval.py#L45), [`retrieve`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/retrieval.py#L63) (cours) · [ch06 · cellules 19 à 23](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch06/notebook.ipynb) (chunks, scores, tableau des échecs) · [ch07 · cellules 5 à 13](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch07/notebook.ipynb) (`hit_rate`, `expand`) · [`grounded-research-agent/agent.py · _trigrams`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/agent.py#L193) (des suites de trois mots pour mesurer une copie).

**À réutiliser.** Un baseline lexical avant tout embedding. Trier avec une clé tuple (`-score`, puis l'identifiant) pour un ordre stable. `frozenset` pour une liste de mots qui ne change jamais.

## Fiche 21 — Le JSON strict

**Projet.** Dev3Pack AI Engineering Bootcamp

**En une phrase.** `json.loads` transforme le texte du modèle en dict ; le parseur strict refuse tout ce qui n'a pas exactement la forme attendue.

**Pourquoi pour un agent.** La sortie du modèle est une entrée non fiable. Un champ en trop ou une citation numérique doit échouer à la frontière, pas trois étapes plus loin.

**Analogie.** Un formulaire bancaire : une case en trop, un montant en lettres, et le guichet le rend.

**Le mécanisme.**

```python
try:
    payload = json.loads(text)
except json.JSONDecodeError as error:
    raise AnswerParseError(f"Not valid JSON: {error}") from error
if set(payload) != REQUIRED_FIELDS:                      # ni manque, ni surplus
    raise AnswerParseError(...)
if not isinstance(confidence, int | float) or isinstance(confidence, bool):
    raise AnswerParseError("'confidence' must be a number")
```

Le test sur `bool` n'est pas un détail : en Python, `True` est aussi un `int`.

**Entrée → sortie.** `"The answer is chunking."` → `Not valid JSON: Expecting value: line 1 column 1 (char 0)`. Sans `confidence` → `Wrong fields: missing=['confidence', 'needs_human_review'] unknown=[]`. `"citations": [42]` → `'citations' must be a list of strings`. Avec `source_url` → `unknown=['source_url']`. Une clôture Markdown autour du JSON est tolérée.

**Où le relire.** [`schema.py · parse_research_answer`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/schema.py#L38) et [`evals.py · load_cases`](https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/blob/8c4726f6a64b67f9acff43d270e1553f9da5d548/src/bootcamp_agent/evals.py#L49) (un JSON par ligne) — cours · [ch03 · cellules 9, 25 et 27](https://github.com/Gecko-Academy/dev3pack-submissions/blob/2954e28d45b9cf9951d0db48ce059f736a23018c/submissions/Mialy333/ch03/notebook.ipynb) · [`grounded-research-agent/agent.py · _selection`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/agent.py#L157) (l'objet entre le premier `{` et le dernier `}`), [`_repairs`](https://github.com/Mialy333/grounded-research-agent/blob/dc60e4432e58926dc69ba6c25b1860782df569b6/agent.py#L112) (`json.loads(…, strict=False)`) · [`buyer/mcp_client.py · _read_reply`](https://github.com/Mialy333/my-gecko-buyer/blob/77d2a92081205f3013203ad173812a853790e6d8/buyer/mcp_client.py#L98) (JSON simple ou flux `data:`).

**À réutiliser.** Un ensemble `REQUIRED_FIELDS` comparé à `set(payload)`. Le type de chaque champ vérifié. Une réparation locale, gratuite, avant de redemander au modèle.

## Fiche 22 — Parsing défensif des blocs `toolUse` / `toolResult`

**Projet.** AI Support Agent (AWS Scholars, chapitre 2)

**En une phrase.** `agent.messages` est une liste hétérogène de blocs ; le code de trace teste `"toolUse" in block` et `"toolResult" in block` avant d'indexer, au lieu de supposer que chaque bloc a une forme fixe.

**Pourquoi pour un agent.** C'est exactement ce test qui a permis de produire, pour le reviewer Udacity, la preuve structurée (nom d'outil, input, résultat) qu'un outil Gateway avait réellement été appelé — une réponse finale seule ne le prouve pas.

**Analogie.** Un agent de tri postal qui ouvre chaque colis pour voir ce qu'il contient avant de le classer, plutôt que de supposer que tous les colis ont la même étiquette.

**Le mécanisme.**

```python
for msg in agent.messages:
    for block in msg.get("content", []):
        if "toolUse" in block:
            tu = block["toolUse"]
            logger.info("TOOL CALL name=%s input=%s", tu.get("name"), tu.get("input"))
        if "toolResult" in block:
            tr = block["toolResult"]
            logger.info("TOOL RESULT toolUseId=%s status=%s content=%s",
                        tr.get("toolUseId"), tr.get("status"), tr.get("content"))
```

**Entrée → sortie.** Un tour qui appelle `order-tracker___get_order` → deux lignes de log CloudWatch, l'une avec le nom et l'input de l'outil, l'autre avec son `status` et son résultat structuré.

**Où le relire.** [main.py L385–398](https://github.com/Mialy333/agentcore-customer-support-agent/blob/1f7c614b9cef31d4b221f5896add966eb9768c92/starter/main.py#L385-L398)

**À réutiliser.** Les objets message des frameworks LLM sont toujours hétérogènes : toujours vérifier la présence d'une clé avant d'y accéder, et logger les champs structurés (nom, input, résultat) plutôt que le seul texte final.

## Fiche 63 — Des fenêtres qui se chevauchent sur un texte

**Projet.** DRILLS.ai (Builds, hackathon OpenAI DevDay)

**En une phrase.** `range(0, len(text), 500)` donne un point de départ tous les 500 caractères, et `text[start:start + 600]` coupe 600 caractères : chaque fenêtre recouvre le début de la suivante.

**Pourquoi pour un agent.** Une phrase qui tombe sur une coupure resterait coupée en deux. Le chevauchement de 100 caractères laisse une chance de la retrouver entière dans un extrait.

**Analogie.** Des relevés de compte mensuels qui reprennent le solde de la fin du mois précédent : rien ne tombe entre deux pages.

**Le mécanisme.**

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

**Entrée → sortie.** Rejoué sur un texte de 1 250 caractères : `{'profile_0': 600, 'profile_1': 600, 'profile_2': 250}` (longueur de chaque extrait). Un dernier morceau de moins de 8 caractères est écarté.

**Où le relire.** [`application.py · source_excerpts`](https://github.com/Mialy333/drills.ai/blob/8f45461a2acd05cbbf930ed559d1afadb7e2e3bb/src/ai_generator/application.py#L250).

**À réutiliser.** Un découpage déterministe, avec des identifiants lisibles et un texte gardé mot pour mot. Le chevauchement est un réglage : il se choisit, il ne se devine pas.

## Sur le terrain

Les chapitres de mes formations et de mes projets où ces mécanismes tournent pour de vrai.

- [Dev3Pack, Session 3](/fr/books/dev3pack/session-03/) : fiche 21.
- [Dev3Pack, Session 4](/fr/books/dev3pack/session-04/) : fiches 16 et 18.
- [Dev3Pack, Session 5](/fr/books/dev3pack/session-05/) : fiche 16.
- [Dev3Pack, Session 6](/fr/books/dev3pack/session-06/) : fiche 20.
- [Dev3Pack, Session 7](/fr/books/dev3pack/session-07/) : fiche 20.
- [Dev3Pack, Session 9](/fr/books/dev3pack/session-09/) : fiche 18.
- [Dev3Pack, Session 12](/fr/books/dev3pack/session-12/) : fiche 18.
- [Dev3Pack, Final assignment](/fr/books/dev3pack/final/) : fiches 18, 20 et 21.
- [Dev3Pack, Gecko capstone](/fr/books/dev3pack/gecko/) : fiches 16, 18 et 21.
- [AWS Scholars, chapitre 2 · AI Support Agent](/fr/books/aws-scholars/chapter-02/) : fiches 19 et 22.
- [AWS Scholars, chapitre 3 · NovaMart Multi-Agent Support](/fr/books/aws-scholars/chapter-03/) : fiche 17.
- [DRILLS.ai, chapitre 5 · Phase 2 : le pivot vers la candidature](/fr/books/drills-ai/chapter-05/) : fiche 18.
- [DRILLS.ai, chapitre 6 · Le diagnostic](/fr/books/drills-ai/chapter-06/) : fiche 63.
