import type { Locale } from "../i18n/ui";

type L = Record<Locale, string>;

export interface Term {
  term: L;
  definition: L;
  concepts?: number[];
  // Journey chapters where the term was met: { book slug, chapter slug }.
  usedIn?: { book: string; chapter: string }[];
  // Books whose chapters may turn the term into a bubble. Without scope: every book.
  // Used for Python words ("set", "Exception", "Decimal") that mean something else in
  // ordinary sentences ("set aside", "the token's decimals"). A scoped term can also
  // become a bubble when it is written alone as inline code (`ThreadPoolExecutor`).
  scope?: string[];
  // Only as inline code, never in running text: for words like "lambda" or "yield"
  // whose plain-text meaning is another thing (an AWS Lambda, a financial yield).
  inCode?: boolean;
}

export const glossary: Term[] = [
  {
    term: { fr: "ADR", en: "ADR" },
    definition: {
      fr: "Architecture Decision Record : une page qui consigne une décision technique, l'option écartée, et la mesure chiffrée qui la ferait changer.",
      en: "Architecture Decision Record: a page that records a technical decision, the option set aside, and the numeric measurement that would change it.",
    },
  },
  {
    term: { fr: "Agent", en: "Agent" },
    definition: {
      fr: "Un programme qui utilise un modèle de langage pour décider quoi faire (chercher, appeler un outil, répondre, refuser), en boucle, avec des règles d'arrêt.",
      en: "A program that uses a language model to decide what to do (search, call a tool, answer, refuse), in a loop, with stopping rules.",
    },
    concepts: [2],
  },
  {
    term: { fr: "Appel d'outil", en: "Tool call" },
    definition: {
      fr: "La demande du modèle d'exécuter un outil avec des arguments précis. C'est lui qu'on lit dans la trace, pas la réponse finale.",
      en: "The model's request to run a tool with specific arguments. That's what you read in the trace, not the final answer.",
    },
    concepts: [3, 8],
    usedIn: [{ book: "hacktoberfest-2026", chapter: "week-1" }, { book: "hacktoberfest-2026", chapter: "week-2" }],
  },
  {
    term: { fr: "Base de connaissances", en: "Knowledge base" },
    definition: {
      fr: "Un ensemble de documents découpés et indexés que l'agent interroge avant de répondre. Une base non synchronisée renvoie du vide, sans erreur.",
      en: "A set of documents, split and indexed, that the agent queries before answering. An unsynced base returns nothing, with no error.",
    },
    concepts: [7],
  },
  {
    term: { fr: "Boucle d'agent", en: "Agent loop" },
    definition: {
      fr: "Le cycle message → modèle → appel d'outil → résultat → modèle, répété jusqu'à une réponse ou une sortie prévue.",
      en: "The cycle message → model → tool call → result → model, repeated until an answer or a planned exit.",
    },
    concepts: [2],
  },
  {
    term: { fr: "Budget", en: "Budget" },
    definition: {
      fr: "Le nombre maximal d'appels qu'une boucle d'agent peut faire, vérifié avant chaque appel, jamais après.",
      en: "The maximum number of calls an agent loop may make, checked before each call, never after.",
    },
    concepts: [2],
  },
  {
    term: { fr: "Chunk (passage)", en: "Chunk (passage)" },
    definition: {
      fr: "Un morceau de document que la récupération peut renvoyer. Un passage trop court peut perdre la phrase qui répond.",
      en: "A piece of a document that retrieval can return. A passage that's too short can lose the sentence that answers.",
    },
    concepts: [7],
  },
  {
    term: { fr: "Citation", en: "Citation" },
    definition: {
      fr: "L'identifiant du document qui soutient une réponse. Une citation juste ne prouve pas que la phrase vient du document.",
      en: "The ID of the document that supports an answer. A correct citation doesn't prove the sentence comes from the document.",
    },
    concepts: [5, 9],
  },
  {
    term: { fr: "Cold start", en: "Cold start" },
    definition: {
      fr: "La lenteur du premier appel à un service qui vient de démarrer. On la mesure : c'est un nombre, pas un verdict de panne.",
      en: "The slowness of the first call to a service that just started. You measure it: it's a number, not a failure verdict.",
    },
  },
  {
    term: { fr: "Corpus", en: "Corpus" },
    definition: {
      fr: "L'ensemble des documents sur lesquels l'agent a le droit de s'appuyer.",
      en: "The set of documents the agent is allowed to rely on.",
    },
    concepts: [7],
  },
  {
    term: { fr: "Diff", en: "Diff" },
    definition: {
      fr: "La liste exacte des lignes ajoutées et supprimées dans un fichier. C'est lui qui fait foi, pas ce que l'assistant annonce.",
      en: "The exact list of lines added and removed in a file. It's what counts, not what the assistant announces.",
    },
    concepts: [1],
  },
  {
    term: { fr: "Échec silencieux", en: "Silent failure" },
    definition: {
      fr: "Une erreur qui ressemble à une réponse normale, comme « aucun résultat » alors qu'il y en a. Le pire type d'erreur.",
      en: "An error that looks like a normal answer, like \"no results\" when there are some. The worst kind of error.",
    },
    concepts: [6],
  },
  {
    term: { fr: "Faux modèle", en: "Fake model" },
    definition: {
      fr: "Un modèle déterministe aux réponses prévues. Il teste le circuit, pas le jugement : un test vert sur lui prouve la tuyauterie.",
      en: "A deterministic model with scripted answers. It tests the circuit, not the judgment: a green test on it proves the plumbing.",
    },
    concepts: [9],
  },
  {
    term: { fr: "Garde d'URL", en: "URL guard" },
    definition: {
      fr: "Un contrôle qui décide, sur la seule chaîne de caractères et avant toute requête, si une adresse est autorisée : protocole, adresse publique, domaine permis.",
      en: "A check that decides, on the string alone and before any request, whether an address is allowed: protocol, public address, permitted domain.",
    },
    concepts: [3],
  },
  {
    term: { fr: "Golden set", en: "Golden set" },
    definition: {
      fr: "Un petit jeu de questions de référence, chacune étiquetée avec le comportement attendu : répondre, citer, ou refuser.",
      en: "A small set of reference questions, each labeled with the expected behavior: answer, cite, or refuse.",
    },
    concepts: [9],
  },
  {
    term: { fr: "Grounding (ancrage)", en: "Grounding" },
    definition: {
      fr: "Le fait qu'une réponse soit réellement soutenue par le document qu'elle cite.",
      en: "The fact that an answer is actually supported by the document it cites.",
    },
    concepts: [7, 9],
  },
  {
    term: { fr: "Guardrail", en: "Guardrail" },
    definition: {
      fr: "Un filtre appliqué aux entrées et aux sorties du modèle : contenus dangereux, données personnelles, sujets interdits. Il se teste comme du code, faux positifs compris.",
      en: "A filter applied to the model's inputs and outputs: harmful content, personal data, denied topics. It's tested like code, false positives included.",
    },
    concepts: [4],
    usedIn: [{ book: "hacktoberfest-2026", chapter: "week-2" }],
  },
  {
    term: { fr: "Hallucination d'action", en: "Action hallucination" },
    definition: {
      fr: "L'agent affirme avoir agi sans l'avoir fait, par exemple en donnant un numéro de ticket inventé. Le texte de la réponse ne prouve rien.",
      en: "The agent claims to have acted without doing so, for example by giving an invented ticket number. The answer's text proves nothing.",
    },
    concepts: [1],
  },
  {
    term: { fr: "Harness", en: "Harness" },
    definition: {
      fr: "Tout ce qui entoure le modèle : la boucle qui le fait tourner, les instructions, les outils, les traces, les évaluations. Un harness géré fait tourner la boucle à votre place, avec moins de contrôle.",
      en: "Everything around the model: the loop that runs it, the instructions, the tools, the traces, the evaluations. A managed harness runs the loop for you, with less control.",
    },
    concepts: [2],
  },
  {
    term: { fr: "Hit rate @k", en: "Hit rate @k" },
    definition: {
      fr: "La part des questions dont le document attendu figure parmi les k premiers résultats de la recherche.",
      en: "The share of questions whose expected document is among the top k search results.",
    },
    concepts: [7],
  },
  {
    term: { fr: "Hook", en: "Hook" },
    definition: {
      fr: "Du code déclenché à un moment précis de la vie de l'agent, avant ou après un appel, pour imposer une règle que le prompt ne garantit pas.",
      en: "Code triggered at a precise moment in the agent's life, before or after a call, to enforce a rule the prompt doesn't guarantee.",
    },
    concepts: [11],
  },
  {
    term: { fr: "Idempotence", en: "Idempotence" },
    definition: {
      fr: "Relancer une action ne change pas le résultat : un retour déjà initié n'est pas initié deux fois, une ressource existante est réutilisée.",
      en: "Running an action again doesn't change the result: a return already started isn't started twice, an existing resource is reused.",
    },
    concepts: [11],
  },
  {
    term: { fr: "Injection de prompt", en: "Prompt injection" },
    definition: {
      fr: "Un ordre caché dans un texte (document, page, sortie d'outil, nom de produit) qui tente de piloter le modèle. On le traite comme une donnée, jamais comme une instruction.",
      en: "An order hidden in a text (document, page, tool output, product name) that tries to steer the model. You treat it as data, never as an instruction.",
    },
    concepts: [4],
  },
  {
    term: { fr: "Intention épinglée", en: "Pinned intent" },
    definition: {
      fr: "Ce qui a été demandé, écrit avant que l'action existe. Chaque vérification compare l'action à cette épingle, jamais à elle-même.",
      en: "What was asked, written down before the action exists. Every check compares the action to that pin, never to itself.",
    },
    concepts: [11],
  },
  {
    term: { fr: "LLM", en: "LLM" },
    definition: {
      fr: "Large Language Model : le modèle de langage qui génère du texte et choisit les outils à appeler.",
      en: "Large Language Model: the language model that generates text and chooses which tools to call.",
    },
  },
  {
    term: { fr: "LLM-as-judge", en: "LLM-as-judge" },
    definition: {
      fr: "Un modèle qui note les réponses d'un autre selon un critère. Il lit le texte, mais ne voit ni les appels d'outils ni ce qui a été écrit en base.",
      en: "A model that scores another model's answers against a criterion. It reads the text, but sees neither the tool calls nor what was written to the database.",
    },
    concepts: [9],
  },
  {
    term: { fr: "Masquage (redaction)", en: "Redaction" },
    definition: {
      fr: "Remplacer un secret (clé, token, e-mail) par une étiquette avec une empreinte avant d'écrire un log, sans supprimer le champ. Même secret, même étiquette.",
      en: "Replacing a secret (key, token, email) with a label carrying a fingerprint before writing a log, without deleting the field. Same secret, same label.",
    },
    concepts: [8],
  },
  {
    term: { fr: "MCP", en: "MCP" },
    definition: {
      fr: "Model Context Protocol : un standard pour exposer des outils et des sources de données à n'importe quel agent. Un outil MCP se découvre par son nom, sa description et son schéma.",
      en: "Model Context Protocol: a standard for exposing tools and data sources to any agent. An MCP tool is discovered by its name, description and schema.",
    },
    concepts: [3],
  },
  {
    term: { fr: "Mémoire de session", en: "Session memory" },
    definition: {
      fr: "L'historique d'une conversation, qui disparaît quand elle se termine.",
      en: "The history of one conversation, which disappears when it ends.",
    },
    concepts: [10],
  },
  {
    term: { fr: "Mémoire long terme", en: "Long-term memory" },
    definition: {
      fr: "Ce qui survit d'une session à l'autre, rangé par utilisateur : faits, préférences, résumés. Sans propriétaire ni limite, elle fuit et contamine les tests.",
      en: "What survives from one session to the next, filed per user: facts, preferences, summaries. Without an owner or a limit, it leaks and contaminates tests.",
    },
    concepts: [10],
    usedIn: [{ book: "hacktoberfest-2026", chapter: "week-1" }],
  },
  {
    term: { fr: "Orchestrateur", en: "Orchestrator" },
    definition: {
      fr: "Dans un système multi-agents, l'agent qui ne répond jamais lui-même : il route le travail vers des agents spécialisés.",
      en: "In a multi-agent system, the agent that never answers itself: it routes the work to specialist agents.",
    },
    concepts: [2],
  },
  {
    term: { fr: "Outil borné", en: "Bounded tool" },
    definition: {
      fr: "Un outil qui valide ses arguments avant d'agir, refuse en nommant les valeurs valides, et reste en lecture seule par défaut.",
      en: "A tool that validates its arguments before acting, refuses by naming the valid values, and stays read-only by default.",
    },
    concepts: [3],
  },
  {
    term: { fr: "Parser", en: "Parser" },
    definition: {
      fr: "Le code qui lit la sortie du modèle et la rejette si elle ne respecte pas le schéma : format, champs exacts, types, bornes.",
      en: "The code that reads the model's output and rejects it if it doesn't match the schema: format, exact fields, types, bounds.",
    },
    concepts: [5],
  },
  {
    term: { fr: "Politique de rétention", en: "Retention policy" },
    definition: {
      fr: "Ce qu'une mémoire garde, pourquoi, comment le corriger, quand ça expire, et ce qu'elle refuse de garder. Écrite avant le premier enregistrement.",
      en: "What a memory keeps, why, how to correct it, when it expires, and what it refuses to keep. Written before the first record.",
    },
    concepts: [10],
  },
  {
    term: { fr: "Prompt système", en: "System prompt" },
    definition: {
      fr: "Les instructions fixes données au modèle avant toute conversation. Une règle y réduit un comportement sans l'éliminer, et un prompt trop long est moins bien suivi.",
      en: "The fixed instructions given to the model before any conversation. A rule there reduces a behavior without eliminating it, and a prompt that's too long is followed less well.",
    },
    concepts: [4, 11],
    usedIn: [{ book: "hacktoberfest-2026", chapter: "week-1" }],
  },
  {
    term: { fr: "RAG", en: "RAG" },
    definition: {
      fr: "Retrieval-Augmented Generation : chercher des passages dans une base, puis répondre à partir d'eux, en les citant.",
      en: "Retrieval-Augmented Generation: search for passages in a base, then answer from them, citing them.",
    },
    concepts: [7],
  },
  {
    term: { fr: "Récupération (retrieval)", en: "Retrieval" },
    definition: {
      fr: "L'étape qui cherche dans le corpus les passages utiles à une question, avant d'appeler le modèle. Rien trouvé : on refuse sans appel.",
      en: "The step that searches the corpus for passages useful to a question, before calling the model. Nothing found: refuse without a call.",
    },
    concepts: [6, 7],
  },
  {
    term: { fr: "Refus", en: "Refusal" },
    definition: {
      fr: "Une réponse explicite « je ne peux pas répondre » : pas de citation, confiance nulle, relecture humaine. Un état, pas un crash.",
      en: "An explicit \"I can't answer\": no citation, zero confidence, human review. A state, not a crash.",
    },
    concepts: [6],
  },
  {
    term: { fr: "Refus excessif", en: "Over-refusal" },
    definition: {
      fr: "Refuser aussi ce à quoi l'agent aurait pu répondre. Sûr, mais moins utile ; on le mesure autant que les erreurs.",
      en: "Also refusing what the agent could have answered. Safe, but less useful; you measure it as much as errors.",
    },
    concepts: [4, 6],
  },
  {
    term: { fr: "Retry correctif", en: "Corrective retry" },
    definition: {
      fr: "Un second essai unique où l'on renvoie au modèle l'erreur de son premier essai. Au-delà, refus signalé.",
      en: "A single second attempt where the model gets back the error from its first one. Beyond that, a flagged refusal.",
    },
    concepts: [5],
    usedIn: [{ book: "hacktoberfest-2026", chapter: "week-2" }],
  },
  {
    term: { fr: "Rollback", en: "Rollback" },
    definition: {
      fr: "Le retour à la dernière version qui marchait, décrit d'avance par une action, un nombre et une unité.",
      en: "Going back to the last version that worked, described in advance by an action, a number and a unit.",
    },
  },
  {
    term: { fr: "Schéma", en: "Schema" },
    definition: {
      fr: "La forme obligatoire d'une donnée : ses champs, leurs types, leurs bornes.",
      en: "The required shape of a piece of data: its fields, their types, their bounds.",
    },
    concepts: [5],
    usedIn: [{ book: "hacktoberfest-2026", chapter: "weekend" }],
  },
  {
    term: { fr: "Seam (couture)", en: "Seam" },
    definition: {
      fr: "Le point de contact unique entre l'agent et n'importe quel modèle : une seule méthode, et l'on change de fournisseur sans toucher à l'agent.",
      en: "The single point of contact between the agent and any model: one method, and you switch providers without touching the agent.",
    },
  },
  {
    term: { fr: "Seau d'échec", en: "Failure bucket" },
    definition: {
      fr: "La catégorie dans laquelle on range une panne avant de la corriger : recherche, choix d'outil, consigne non suivie, format.",
      en: "The category a failure goes into before you fix it: retrieval, tool choice, instruction not followed, format.",
    },
    concepts: [8],
  },
  {
    term: { fr: "Skill", en: "Skill" },
    definition: {
      fr: "Une fiche d'instructions que l'assistant charge seulement quand la tâche correspond. Elle se juge à la différence qu'elle fait, preuve à l'appui.",
      en: "An instruction sheet the assistant loads only when the task matches. It's judged by the difference it makes, with evidence.",
    },
  },
  {
    term: { fr: "Slot filling", en: "Slot filling" },
    definition: {
      fr: "Remplir les paramètres d'un outil au fil de la conversation : garder ce qui est donné, demander un seul champ manquant à la fois, agir dès que tout est là.",
      en: "Filling a tool's parameters during the conversation: keep what's given, ask for one missing field at a time, act as soon as everything is there.",
    },
    concepts: [3],
  },
  {
    term: { fr: "Smoke test", en: "Smoke test" },
    definition: {
      fr: "Un test rapide lancé juste après un déploiement, conçu pour pouvoir dire « ce déploiement est mauvais ».",
      en: "A quick test run right after a deployment, designed to be able to say \"this deployment is bad\".",
    },
  },
  {
    term: { fr: "SSRF", en: "SSRF" },
    definition: {
      fr: "Server-Side Request Forgery : pousser un outil qui va chercher des URL à appeler une adresse interne ou privée à la place de l'attaquant.",
      en: "Server-Side Request Forgery: getting a tool that fetches URLs to call an internal or private address on the attacker's behalf.",
    },
    concepts: [3],
  },
  {
    term: { fr: "Surconfiance", en: "Overconfidence" },
    definition: {
      fr: "Une confiance affichée plus haute que ce que les sources justifient, par exemple 1.0 sur un seul document.",
      en: "A displayed confidence higher than the sources justify, for example 1.0 on a single document.",
    },
    concepts: [5],
  },
  {
    term: { fr: "Table de transitions", en: "Transition table" },
    definition: {
      fr: "La liste des couples (état, événement) autorisés et de l'état où chacun mène. Tout couple absent est refusé, et l'état ne bouge pas.",
      en: "The list of allowed (state, event) pairs and the state each one leads to. Any missing pair is refused, and the state doesn't move.",
    },
    concepts: [2],
  },
  {
    term: { fr: "Température", en: "Temperature" },
    definition: {
      fr: "Le réglage du hasard dans la génération. À 0, les réponses et les appels d'outils deviennent plus stables, sans devenir parfaits.",
      en: "The setting for randomness in generation. At 0, answers and tool calls become more stable, without becoming perfect.",
    },
  },
  {
    term: { fr: "Timeout", en: "Timeout" },
    definition: {
      fr: "Une durée maximale d'attente. Passé ce délai, on abandonne l'appel et on renvoie un refus lisible, au lieu d'attendre sans fin.",
      en: "A maximum waiting time. Past it, you abandon the call and return a readable refusal, instead of waiting forever.",
    },
    concepts: [6],
  },
  {
    term: { fr: "Trace", en: "Trace" },
    definition: {
      fr: "Le journal d'un run : chaque étape (recherche, appel au modèle, appel d'outil, décision) avec ses arguments et son résultat.",
      en: "The log of a run: every step (search, model call, tool call, decision) with its arguments and result.",
    },
    concepts: [8],
  },
  {
    term: { fr: "Verrouillage optimiste", en: "Optimistic locking" },
    definition: {
      fr: "Chaque écriture porte la version lue juste avant ; si la version a changé entre-temps, l'écriture est refusée. Deux agents ne peuvent pas s'écraser en silence.",
      en: "Every write carries the version read just before it; if the version changed in the meantime, the write is refused. Two agents can't silently overwrite each other.",
    },
    concepts: [11],
  },
  // Hacktoberfest 2026 (October 2026): 16 terms added from the runbook.
  {
    term: { fr: "Inférence dans le navigateur (WebGPU)", en: "In-browser inference (WebGPU)" },
    definition: {
      fr: "La page télécharge le modèle une fois, puis la carte graphique de l'ordinateur le fait tourner directement dans le navigateur : rien à installer, rien n'est envoyé.",
      en: "The page downloads the model once, then the computer's graphics card runs it directly in the browser: nothing to install, nothing is sent.",
    },
    usedIn: [{ book: "hacktoberfest-2026", chapter: "weekend" }],
  },
  {
    term: { fr: "Sortie structurée", en: "Structured output" },
    definition: {
      fr: "Demander au modèle de répondre dans un format fixe (du JSON), pour que l'interface affiche toujours la même chose, au même endroit.",
      en: "Asking the model to answer in a fixed format (JSON), so the interface always shows the same thing, in the same place.",
    },
    concepts: [5],
    usedIn: [{ book: "hacktoberfest-2026", chapter: "weekend" }],
  },
  {
    term: { fr: "Données ouvertes (open data)", en: "Open data" },
    definition: {
      fr: "Des données publiées par une institution, que n'importe qui peut télécharger et réutiliser gratuitement, souvent sous licence ouverte.",
      en: "Data published by an institution, that anyone can download and reuse for free, often under an open licence.",
    },
    usedIn: [{ book: "hacktoberfest-2026", chapter: "week-1" }],
  },
  {
    term: { fr: "Tâche planifiée", en: "Scheduled job" },
    definition: {
      fr: "Un programme que la machine lance toute seule à heure fixe, par exemple chaque matin.",
      en: "A program the machine starts on its own at a set time, for example every morning.",
    },
    concepts: [11],
    usedIn: [{ book: "hacktoberfest-2026", chapter: "week-1" }],
  },
  {
    term: { fr: "Modèle de fondation tabulaire", en: "Tabular foundation model" },
    definition: {
      fr: "Un modèle déjà entraîné sur des millions de tableaux synthétiques : on lui donne un petit tableau d'exemples et il prédit les lignes suivantes, sans long entraînement.",
      en: "A model already trained on millions of synthetic tables: you give it a small table of examples and it predicts the next rows, without long training.",
    },
    usedIn: [{ book: "hacktoberfest-2026", chapter: "week-2" }],
  },
  {
    term: { fr: "Backtest", en: "Backtest" },
    definition: {
      fr: "Tester une méthode sur le passé : on fait comme si on ignorait l'issue des cas récents, on prédit, puis on compare à ce qui s'est vraiment passé.",
      en: "Testing a method on the past: you act as if you didn't know how recent cases turned out, you predict, then you compare with what really happened.",
    },
    concepts: [9],
    usedIn: [{ book: "hacktoberfest-2026", chapter: "week-2" }],
  },
  {
    term: { fr: "Fuite de données (data leakage)", en: "Data leakage" },
    definition: {
      fr: "Quand le modèle voit par erreur une information qu'il n'aurait pas eue au moment de prédire (par exemple la date de paiement) : le score paraît excellent, mais il est faux.",
      en: "When the model sees by mistake a piece of information it wouldn't have had at prediction time (for example the payment date): the score looks excellent, but it's false.",
    },
    concepts: [9],
    usedIn: [{ book: "hacktoberfest-2026", chapter: "week-2" }],
  },
  {
    term: { fr: "Taux de base", en: "Base rate" },
    definition: {
      fr: "La proportion « normale » dans les données. Un modèle qui répète toujours la réponse la plus fréquente a l'air bon sans rien comprendre.",
      en: "The “normal” proportion in the data. A model that always repeats the most frequent answer looks good without understanding anything.",
    },
    concepts: [9],
    usedIn: [{ book: "hacktoberfest-2026", chapter: "week-2" }],
  },
  {
    term: { fr: "ROC-AUC", en: "ROC-AUC" },
    definition: {
      fr: "Une note entre 0,5 (hasard) et 1 (parfait) qui mesure si le modèle classe bien les cas à risque avant les autres.",
      en: "A score between 0.5 (chance) and 1 (perfect) that measures whether the model ranks risky cases ahead of the others.",
    },
    concepts: [9],
    usedIn: [{ book: "hacktoberfest-2026", chapter: "week-2" }],
  },
  {
    term: { fr: "Seuil de décision", en: "Decision threshold" },
    definition: {
      fr: "Le score à partir duquel on dit « oui ». On le choisit sur une tranche de données à part, jamais sur les données du test final.",
      en: "The score from which you say “yes”. You choose it on a separate slice of data, never on the final test data.",
    },
    concepts: [9],
    usedIn: [{ book: "hacktoberfest-2026", chapter: "week-2" }],
  },
  {
    term: { fr: "Calibration", en: "Calibration" },
    definition: {
      fr: "Un score de 80 % est bien calibré si, sur beaucoup de cas notés 80 %, environ 8 sur 10 se réalisent. Un seul cas ne peut pas le prouver.",
      en: "An 80% score is well calibrated if, over many cases scored 80%, about 8 in 10 happen. A single case can't prove it.",
    },
    concepts: [9],
    usedIn: [{ book: "hacktoberfest-2026", chapter: "week-2" }],
  },
  {
    term: { fr: "Routage hybride", en: "Hybrid routing" },
    definition: {
      fr: "Choisir la méthode selon le cas : par exemple un modèle pour un nouveau client, et l'historique du client sinon.",
      en: "Choosing the method case by case: for example a model for a new client, and the client's history otherwise.",
    },
    concepts: [11],
    usedIn: [{ book: "hacktoberfest-2026", chapter: "week-2" }],
  },
  {
    term: { fr: "Fail closed", en: "Fail closed" },
    definition: {
      fr: "En cas de doute, le garde-fou bloque plutôt que de laisser passer. Un garde-fou qui ne vérifie rien quand le modèle n'appelle pas l'outil échoue « ouvert ».",
      en: "When in doubt, the guard blocks rather than lets through. A guard that checks nothing when the model doesn't call the tool “fails open”.",
    },
    concepts: [8, 11],
    usedIn: [{ book: "hacktoberfest-2026", chapter: "week-2" }],
  },
  {
    term: { fr: "Test fresh clone", en: "Fresh-clone test" },
    definition: {
      fr: "Cloner son propre dépôt dans un dossier vide et suivre uniquement le README, comme un inconnu, pour voir si ça marche.",
      en: "Cloning your own repo into an empty folder and following only the README, like a stranger, to see if it works.",
    },
    concepts: [1],
    usedIn: [{ book: "hacktoberfest-2026", chapter: "week-2" }],
  },
  {
    term: { fr: "Licence open-weights", en: "Open-weights licence" },
    definition: {
      fr: "Des poids ouverts ne veulent pas dire « libre de vendre » : un modèle peut être gratuit pour un prototype et interdit dans un produit payant.",
      en: "Open weights don't mean “free to sell”: a model can be free for a prototype and off-limits in a paid product.",
    },
    usedIn: [{ book: "hacktoberfest-2026", chapter: "week-2" }],
  },
  {
    term: { fr: "Télémétrie", en: "Telemetry" },
    definition: {
      fr: "Les statistiques d'usage qu'un logiciel envoie à son éditeur. Certains outils en envoient par défaut ; on peut les couper.",
      en: "The usage statistics a piece of software sends to its publisher. Some tools send them by default; you can turn them off.",
    },
    usedIn: [{ book: "hacktoberfest-2026", chapter: "week-2" }],
  },
  // My Python for AI 101 (sources: the glossaries of the three runbooks with a
  // "My Python for AI 101" section). Scoped to that book: these words keep their
  // ordinary meaning in the other chapters.
  {
    term: { fr: "base64", en: "base64" },
    definition: {
      fr: "Une façon d'écrire des octets en texte simple pour les transporter ; le contenu ne change pas.",
      en: "A way to write bytes as plain text so they can travel; the content does not change.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Compréhension", en: "Comprehension" },
    definition: {
      fr: "Une ligne qui construit une liste, un set ou un dict à partir d'une autre collection, avec un filtre éventuel.",
      en: "One line that builds a list, a set or a dict from another collection, with an optional filter.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Dataclass", en: "Dataclass" },
    definition: {
      fr: "Une classe déclarée par ses champs typés ; avec frozen=True, l'objet ne peut plus être modifié.",
      en: "A class declared by its typed fields; with frozen=True, the object can no longer be changed.",
    },
    concepts: [5],
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Decimal", en: "Decimal" },
    definition: {
      fr: "Le type Python qui calcule en décimal exact, sans les erreurs d'arrondi du float. DynamoDB en renvoie, et JSON ne sait pas les écrire tels quels.",
      en: "The Python type that computes in exact decimal, without the rounding errors of float. DynamoDB returns them, and JSON cannot write them as they are.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Décorateur", en: "Decorator" },
    definition: {
      fr: "Une fonction qui en reçoit une autre et en renvoie une version enrichie, écrite @nom au-dessus du def.",
      en: "A function that receives another one and returns an enriched version of it, written @name above the def.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "deepcopy", en: "deepcopy" },
    definition: {
      fr: "Une copie complète d'un objet et de tout ce qu'il contient, indépendante de l'original.",
      en: "A full copy of an object and everything it contains, independent of the original.",
    },
    concepts: [10],
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-09" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Dictionnaire (dict)", en: "Dictionary (dict)" },
    definition: {
      fr: "Une collection de valeurs rangées sous des clés ; la forme de la trace, des reçus et des réponses JSON.",
      en: "A collection of values stored under keys; the shape of the trace, the receipts and the JSON answers.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Docstring", en: "Docstring" },
    definition: {
      fr: "Le texte entre triples guillemets sous un def ; un framework d'agent ou un serveur MCP en fait la description de l'outil que lit le modèle.",
      en: "The text between triple quotes under a def; an agent framework or an MCP server turns it into the tool description the model reads.",
    },
    concepts: [3],
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Exception", en: "Exception" },
    definition: {
      fr: "Un signal d'erreur qui interrompt le flux normal ; on la lève (raise), on l'attrape (except) et on la transforme en refus.",
      en: "An error signal that interrupts the normal flow; you raise it, catch it (except) and turn it into a refusal.",
    },
    concepts: [6],
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "f-string", en: "f-string" },
    definition: {
      fr: "Une chaîne préfixée par f où {valeur} est remplacé ; un format optionnel suit les deux-points (!r, :.2f, :08d).",
      en: "A string prefixed with f where {value} is replaced; an optional format follows the colon (!r, :.2f, :08d).",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Fixture", en: "Fixture" },
    definition: {
      fr: "Une fonction que pytest exécute avant un test pour préparer le terrain (dossier jetable, réseau coupé).",
      en: "A function pytest runs before a test to prepare the ground (a throwaway folder, the network cut off).",
    },
    concepts: [9],
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-12" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Hash (empreinte)", en: "Hash (fingerprint)" },
    definition: {
      fr: "Un résumé court et fixe d'un texte (SHA-256) : le même texte donne toujours la même empreinte, sans le révéler.",
      en: "A short, fixed summary of a text (SHA-256): the same text always gives the same fingerprint, without revealing it.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "IDF", en: "IDF" },
    definition: {
      fr: "Inverse Document Frequency : un mot présent dans peu de passages pèse plus dans le score de récupération.",
      en: "Inverse Document Frequency: a word found in few passages weighs more in the retrieval score.",
    },
    concepts: [7],
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Injection de dépendances", en: "Dependency injection" },
    definition: {
      fr: "Passer à une fonction l'objet dont elle a besoin (modèle, réseau) au lieu de le créer dedans, pour pouvoir le remplacer par un faux.",
      en: "Passing a function the object it needs (model, network) instead of creating it inside, so it can be swapped for a fake.",
    },
    concepts: [9],
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "ipaddress", en: "ipaddress" },
    definition: {
      fr: "Le module Python qui lit une adresse IP et dit si elle est publique, privée ou locale.",
      en: "The Python module that reads an IP address and tells whether it is public, private or local.",
    },
    concepts: [3],
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "monkeypatch", en: "monkeypatch" },
    definition: {
      fr: "L'outil pytest qui remplace temporairement une fonction ou une variable d'environnement pendant un test.",
      en: "The pytest tool that temporarily replaces a function or an environment variable during a test.",
    },
    concepts: [9],
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-12" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "pathlib", en: "pathlib" },
    definition: {
      fr: "Le module Python qui manipule les chemins de fichiers comme des objets (Path, /, glob, read_text).",
      en: "The Python module that handles file paths as objects (Path, /, glob, read_text).",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Protocol", en: "Protocol" },
    definition: {
      fr: "En Python, un contrat défini par des méthodes : une classe le respecte dès qu'elle a ces méthodes, sans héritage.",
      en: "In Python, a contract defined by methods: a class meets it as soon as it has those methods, without inheritance.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Regex (expression régulière)", en: "Regex (regular expression)" },
    definition: {
      fr: "Un motif qui décrit une forme de texte plutôt qu'un mot exact ; sert aux gardes d'injection, au masquage et à lire un en-tête.",
      en: "A pattern that describes a shape of text rather than an exact word; used by injection guards, redaction and to read a header.",
    },
    concepts: [4],
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "set (ensemble)", en: "set" },
    definition: {
      fr: "Une collection sans doublon ; & donne les éléments communs, <= vérifie qu'un ensemble est inclus dans un autre.",
      en: "A collection with no duplicates; & gives the shared elements, <= checks that one set is contained in another.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "subprocess", en: "subprocess" },
    definition: {
      fr: "Le module Python qui lance un autre programme (git, une CLI) et récupère son code de retour et sa sortie.",
      en: "The Python module that launches another program (git, a CLI) and gets back its exit code and output.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Thread", en: "Thread" },
    definition: {
      fr: "Un fil d'exécution parallèle ; join(timeout) permet d'attendre une réponse au plus N secondes.",
      en: "A parallel thread of execution; join(timeout) lets you wait for an answer for N seconds at most.",
    },
    concepts: [6],
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Tokenisation", en: "Tokenization" },
    definition: {
      fr: "Le découpage d'un texte en mots minuscules (tokens) avant de les comparer.",
      en: "Cutting a text into lowercase words (tokens) before comparing them.",
    },
    concepts: [7],
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-05" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Type hint", en: "Type hint" },
    definition: {
      fr: "L'annotation du type attendu (str, list[str], str | None) ; Python ne l'impose pas, mais les frameworks d'agent et MCP la lisent.",
      en: "The annotation of the expected type (str, list[str], str | None); Python does not enforce it, but agent frameworks and MCP read it.",
    },
    concepts: [3],
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-11" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "ARN", en: "ARN" },
    definition: {
      fr: "Amazon Resource Name : l'identifiant unique d'une ressource AWS, de la forme arn:partition:service:région:compte:ressource.",
      en: "Amazon Resource Name: the unique identifier of an AWS resource, shaped arn:partition:service:region:account:resource.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "ast", en: "ast" },
    definition: {
      fr: "Le module Python qui transforme du code source en arbre de syntaxe, qu'on analyse sans exécuter le code.",
      en: "The Python module that turns source code into a syntax tree you can analyse without running the code.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "async", en: "async" },
    definition: {
      fr: "Le mot-clé qui déclare une coroutine : une fonction qui peut être suspendue et reprise (await), pour traiter plusieurs requêtes sans bloquer le programme.",
      en: "The keyword that declares a coroutine: a function that can be suspended and resumed (await), to handle several requests without blocking the program.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "argparse", en: "argparse" },
    definition: {
      fr: "Le module Python qui transforme les arguments de la ligne de commande en objets Python.",
      en: "The Python module that turns command-line arguments into Python objects.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "asyncio.run", en: "asyncio.run" },
    definition: {
      fr: "Démarre et exécute une fonction asynchrone (coroutine) depuis du code synchrone.",
      en: "Starts and runs an asynchronous function (coroutine) from synchronous code.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Code Interpreter", en: "Code Interpreter" },
    definition: {
      fr: "Un service qui exécute du code généré dans un environnement isolé, pour obtenir un calcul exact plutôt qu'une estimation du modèle.",
      en: "A service that runs generated code in an isolated environment, to get an exact calculation rather than the model's estimate.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Context manager", en: "Context manager" },
    definition: {
      fr: "Un objet utilisé avec with, qui exécute du code à l'entrée et à la sortie d'un bloc ; la ressource est refermée même en cas d'erreur.",
      en: "An object used with with, which runs code on entering and leaving a block; the resource is closed even if an error occurs.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Repli dégradé (fallback)", en: "Fallback" },
    definition: {
      fr: "Un chemin de code de secours exécuté quand l'appel principal échoue, pour renvoyer un résultat partiel plutôt qu'une erreur.",
      en: "A back-up code path run when the main call fails, to return a partial result rather than an error.",
    },
    concepts: [6],
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Sans état (stateless)", en: "Stateless" },
    definition: {
      fr: "Se dit d'une fonction ou d'un handler qui ne garde aucun état entre deux appels, et peut donc être rappelé sans effet de bord.",
      en: "Said of a function or handler that keeps no state between two calls, so it can be called again with no side effect.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-07" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "random.choices", en: "random.choices" },
    definition: {
      fr: "Tire des éléments au hasard (avec remise) dans une séquence ; utile pour des identifiants de démo lisibles.",
      en: "Draws items at random (with replacement) from a sequence; handy for readable demo IDs.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "re.fullmatch", en: "re.fullmatch" },
    definition: {
      fr: "Vérifie qu'une chaîne correspond entièrement à un motif regex, et capture au passage ses groupes.",
      en: "Checks that a whole string matches a regex pattern, and captures its groups along the way.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-05" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "uuid.uuid4", en: "uuid.uuid4" },
    definition: {
      fr: "Génère un identifiant aléatoire de 128 bits, unique en pratique ; sert aux ID de session.",
      en: "Generates a random 128-bit identifier, unique in practice; used for session IDs.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "__call__", en: "__call__" },
    definition: {
      fr: "La méthode qui rend un objet appelable comme une fonction : agent(prompt).",
      en: "The method that makes an object callable like a function: agent(prompt).",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-09" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "__file__", en: "__file__" },
    definition: {
      fr: "Le chemin du fichier Python en cours d'exécution.",
      en: "The path of the Python file being run.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-02" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "__getattr__", en: "__getattr__" },
    definition: {
      fr: "Au niveau d'un module, la fonction appelée quand on lit un attribut absent ; permet des valeurs calculées à la demande.",
      en: "At module level, the function called when a missing attribute is read; allows values computed on demand.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-02" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "__name__", en: "__name__" },
    definition: {
      fr: "Vaut '__main__' quand le fichier est lancé directement, sinon le nom du module.",
      en: "Equals '__main__' when the file is launched directly, otherwise the module's name.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-02" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "agent.messages", en: "agent.messages" },
    definition: {
      fr: "L'historique de conversation qu'un agent Strands relit à chaque appel.",
      en: "The conversation history a Strands agent reads again on every call.",
    },
    concepts: [10],
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-05" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "agent.state", en: "agent.state" },
    definition: {
      fr: "Le stockage clé-valeur d'un agent Strands, invisible pour le modèle, lisible par ses outils.",
      en: "A Strands agent's key-value storage, invisible to the model, readable by its tools.",
    },
    concepts: [10],
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-09" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "as_completed", en: "as_completed" },
    definition: {
      fr: "Parcourt des futures dans l'ordre où elles se terminent.",
      en: "Walks through futures in the order in which they finish.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Back-off", en: "Back-off" },
    definition: {
      fr: "Une attente qui s'allonge à chaque nouvelle tentative après un échec.",
      en: "A wait that grows longer with each new attempt after a failure.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-04" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "boto3", en: "boto3" },
    definition: {
      fr: "Le SDK AWS pour Python. Deux interfaces : client (le format brut de l'API) ou resource (des objets aux types Python).",
      en: "The AWS SDK for Python. Two interfaces: client (the API's raw format) or resource (objects with Python types).",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "ClientError", en: "ClientError" },
    definition: {
      fr: "L'exception que boto3 lève pour toute erreur AWS ; le motif est dans exc.response['Error']['Code'].",
      en: "The exception boto3 raises for any AWS error; the reason is in exc.response['Error']['Code'].",
    },
    concepts: [6],
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-07" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Closure", en: "Closure" },
    definition: {
      fr: "Une fonction interne qui garde l'accès aux variables de la fonction qui l'a créée.",
      en: "An inner function that keeps access to the variables of the function that created it.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "ConditionExpression", en: "ConditionExpression" },
    definition: {
      fr: "Une condition que DynamoDB vérifie au moment même de l'écriture, de façon atomique.",
      en: "A condition DynamoDB checks at the very moment of the write, atomically.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-04" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "@contextmanager", en: "@contextmanager" },
    definition: {
      fr: "Le décorateur qui fabrique un context manager à partir d'une fonction avec yield.",
      en: "The decorator that makes a context manager from a function with yield.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-08" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "ContextVar", en: "ContextVar" },
    definition: {
      fr: "Une variable dont la valeur dépend du contexte d'exécution courant.",
      en: "A variable whose value depends on the current execution context.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-10" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "EMF", en: "EMF" },
    definition: {
      fr: "Embedded Metric Format : un log JSON dont CloudWatch extrait automatiquement des métriques.",
      en: "Embedded Metric Format: a JSON log from which CloudWatch extracts metrics automatically.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "@app.entrypoint", en: "@app.entrypoint" },
    definition: {
      fr: "Le décorateur qui fait d'une fonction le gestionnaire des requêtes du Runtime AgentCore.",
      en: "The decorator that makes a function the request handler of the AgentCore Runtime.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "functools.wraps", en: "functools.wraps" },
    definition: {
      fr: "Recopie le nom et la docstring de la fonction d'origine sur son wrapper.",
      en: "Copies the original function's name and docstring onto its wrapper.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Future", en: "Future" },
    definition: {
      fr: "La promesse du résultat d'une tâche lancée dans un thread.",
      en: "The promise of the result of a task started in a thread.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-10" }],
    scope: ["python-for-ai-101"],
    inCode: true,
  },
  {
    term: { fr: "inspect", en: "inspect" },
    definition: {
      fr: "Le module d'introspection : il récupère par exemple le code source d'une fonction.",
      en: "The introspection module: it gets, for example, the source code of a function.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-12" }],
    scope: ["python-for-ai-101"],
    inCode: true,
  },
  {
    term: { fr: "lambda", en: "lambda" },
    definition: {
      fr: "Une fonction anonyme d'une seule expression : lambda o: o['order_date'].",
      en: "An anonymous one-expression function: lambda o: o['order_date'].",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-04" }],
    scope: ["python-for-ai-101"],
    inCode: true,
  },
  {
    term: { fr: "lambda_handler", en: "lambda_handler" },
    definition: {
      fr: "Le point d'entrée d'une fonction AWS Lambda : il reçoit (event, context) et renvoie un dict.",
      en: "The entry point of an AWS Lambda function: it receives (event, context) and returns a dict.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "load_dotenv", en: "load_dotenv" },
    definition: {
      fr: "Copie les variables d'un fichier .env dans os.environ.",
      en: "Copies the variables of a .env file into os.environ.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-02" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Optional", en: "Optional" },
    definition: {
      fr: "L'annotation Optional[T] : une valeur de type T, ou None.",
      en: "The Optional[T] annotation: a value of type T, or None.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-08" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Paginator", en: "Paginator" },
    definition: {
      fr: "Un objet boto3 qui enchaîne automatiquement les pages d'une API.",
      en: "A boto3 object that chains the pages of an API automatically.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "SequentialToolExecutor", en: "SequentialToolExecutor" },
    definition: {
      fr: "L'exécuteur Strands qui lance les outils d'un tour l'un après l'autre.",
      en: "The Strands executor that runs a turn's tools one after the other.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-10" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "SessionRepository", en: "SessionRepository" },
    definition: {
      fr: "L'interface Strands à implémenter pour stocker les sessions où l'on veut.",
      en: "The Strands interface to implement to store sessions wherever you want.",
    },
    concepts: [10],
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "Singleton paresseux", en: "Lazy singleton" },
    definition: {
      fr: "Un objet créé une seule fois, au premier besoin, puis réutilisé.",
      en: "An object created only once, the first time it is needed, then reused.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "StreamingBody", en: "StreamingBody" },
    definition: {
      fr: "Un corps de réponse AWS sous forme de flux, à lire avec .read().",
      en: "An AWS response body in the form of a stream, to read with .read().",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-04" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "sys.argv", en: "sys.argv" },
    definition: {
      fr: "La liste des arguments de la ligne de commande.",
      en: "The list of command-line arguments.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-02" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "sys.path", en: "sys.path" },
    definition: {
      fr: "La liste des dossiers où Python cherche les modules à importer.",
      en: "The list of folders where Python looks for the modules to import.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-02" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "ThreadPoolExecutor", en: "ThreadPoolExecutor" },
    definition: {
      fr: "Un groupe de threads qui exécute des tâches en parallèle, adapté à l'attente réseau.",
      en: "A pool of threads that runs tasks in parallel, suited to waiting on the network.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-01" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "threading.Lock", en: "threading.Lock" },
    definition: {
      fr: "Un verrou : un seul thread à la fois exécute le bloc protégé.",
      en: "A lock: only one thread at a time runs the protected block.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-10" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "timedelta", en: "timedelta" },
    definition: {
      fr: "La durée obtenue en soustrayant deux dates ; .days donne les jours.",
      en: "The duration you get by subtracting two dates; .days gives the days.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-04" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "ToolContext", en: "ToolContext" },
    definition: {
      fr: "L'objet que Strands injecte dans un outil context=True ; il donne accès à l'agent appelant.",
      en: "The object Strands injects into a context=True tool; it gives access to the calling agent.",
    },
    concepts: [10],
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-09" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "unittest", en: "unittest" },
    definition: {
      fr: "Le framework de tests de la bibliothèque standard (TestCase, setUp).",
      en: "The standard library's test framework (TestCase, setUp).",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-12" }],
    scope: ["python-for-ai-101"],
  },
  {
    term: { fr: "yield", en: "yield" },
    definition: {
      fr: "Suspend une fonction ; dans un context manager, sépare l'entrée de la sortie.",
      en: "Suspends a function; in a context manager, separates the way in from the way out.",
    },
    usedIn: [{ book: "python-for-ai-101", chapter: "chapter-08" }],
    scope: ["python-for-ai-101"],
    inCode: true,
  },
];

// Anchor of a term on the glossary page, e.g. "Appel d'outil" -> "appel-d-outil".
// Used by the glossary page (id) and by the links and bubbles in the chapters.
export const termId = (entry: Term, locale: Locale) =>
  entry.term[locale]
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const letterOf = (word: string) =>
  word.normalize("NFD").replace(/[̀-ͯ]/g, "").charAt(0).toUpperCase();

export function glossaryByLetter(locale: Locale) {
  const sorted = [...glossary].sort((a, b) =>
    a.term[locale].localeCompare(b.term[locale], locale, { sensitivity: "base" }),
  );
  const groups = new Map<string, Term[]>();
  for (const entry of sorted) {
    const letter = letterOf(entry.term[locale]);
    groups.set(letter, [...(groups.get(letter) ?? []), entry]);
  }
  return [...groups.entries()].map(([letter, terms]) => ({ letter, terms }));
}
