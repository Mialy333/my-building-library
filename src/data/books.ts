import type { Locale, UiKey } from "../i18n/ui";
import type { ImageMetadata } from "astro";
import type { TechIcon } from "./tech-icons";
// Illustrated intros of the live demos: each demo's own social-preview image (og-image.png
// in the docs/ folder of its repo), copied here so Astro can optimize it.
import groundedResearchDemo from "../assets/demos/grounded-research-agent.png";
import geckoBuyerDemo from "../assets/demos/my-gecko-buyer.png";
// DRILLS.ai: the home screenshot of its README (docs/images/home-en.jpg at commit 8f45461).
import drillsHome from "../assets/demos/drills-home.jpg";

export type BookColor = "sage" | "apricot" | "rose";
export type Shelf = "fundamentals" | "journeys" | "path" | "builds";
export const shelfOrder: Shelf[] = ["fundamentals", "journeys", "path", "builds"];

type L = Record<Locale, string>;

// A tool or model used in a chapter. partner: a Hacktoberfest partner technology
// the chapter competed with (featured or partner category).
export interface Tech {
  name: string;
  icon: TechIcon; // see tech-icons.ts
  partner?: boolean;
}

export interface Chapter {
  number: number;
  kind: "chapter" | "session" | "step";
  code?: string;
  slug?: string;
  title: L;
  published: boolean;
  teaser?: L;
  concepts?: number[];
  repo?: string;
  // Theme of a challenge (Hacktoberfest), the same in both languages.
  theme?: string;
  // Tools and models used, shown with their icons at the end of the chapter.
  stack?: Tech[];
  // Extra links shown at the end of a chapter, after the code link.
  post?: string;
  demo?: string;
  video?: string;
  // A live demo worth showing off: its illustrated intro becomes a poster on the book
  // page and at the top of the chapter (DemoCard.astro). Needs `demo` (the link).
  showcase?: { image: ImageMetadata; title: string; alt: L; text: L };
}

export interface Book {
  slug: string;
  name: L;
  shelf: Shelf;
  color?: BookColor;
  living?: boolean;
  forthcoming?: boolean;
  gauge?: boolean;
  tags?: string[];
  description?: L;
  heading: { text: L; accent: L };
  meta?: L;
  summary?: Record<Locale, string[]>;
  callout?: { label: L; text: L };
  repo?: string;
  // art: the drawing on the cover's screen; it grows with the published chapters.
  // Without art, the screen shows the bars.
  cover: { title: L; accent: L; subtitle: L; info: L; bars: number[]; art?: "plant" | "cloud" | "garland" };
  chapters: Chapter[];
}

const session = (number: number, fr: string, en: string, extra: Partial<Chapter> = {}): Chapter => ({
  number, kind: "session", title: { fr, en }, published: false, ...extra,
});

const concept = (number: number, fr: string, en: string, extra: Partial<Chapter> = {}): Chapter => ({
  number, kind: "chapter", title: { fr, en }, published: false, ...extra,
});

export const books: Book[] = [
  {
    slug: "baa-101",
    name: { fr: "BAA 101", en: "BAA 101" },
    shelf: "fundamentals",
    color: "sage",
    living: true,
    description: {
      fr: "Les fondamentaux des agents IA, tirés de ce que mes formations et mes challenges m'apprennent.",
      en: "The fundamentals of AI agents, drawn from what the journeys teach me.",
    },
    heading: { text: { fr: "Building AI Agents ", en: "Building AI Agents " }, accent: { fr: "101", en: "101" } },
    summary: {
      fr: ["Les bases pour construire un agent IA, et seulement les bases. Chaque chapitre vient d'une leçon apprise sur un vrai projet, puis en est détaché pour valoir pour n'importe quel agent."],
      en: ["The basics of building an AI agent, and only the basics. Each chapter comes from a lesson learned on a real project, then is stripped of its specifics so it holds for any agent."],
    },
    callout: {
      label: { fr: "Règle d'entrée", en: "Entry rule" },
      text: {
        fr: "Un concept entre ici seulement s'il vaut pour <em>n'importe quel agent</em>, quels que soient le framework, le cloud ou le modèle.",
        en: "A concept gets in only if it holds for <em>any agent</em>, whatever the framework, the cloud or the model.",
      },
    },
    cover: {
      title: { fr: "BAA ", en: "BAA " },
      accent: { fr: "101", en: "101" },
      subtitle: { fr: "Building AI Agents 101", en: "Building AI Agents 101" },
      info: { fr: "FR·EN", en: "FR·EN" },
      bars: [30, 55, 80, 100],
      art: "plant",
    },
    chapters: [
      concept(1, "Vérifier l'effet, pas la parole", "Verify the effect, not the claim", { published: true }),
      concept(2, "La boucle d'agent et ses sorties", "The agent loop and its exits", { published: true }),
      concept(3, "L'outil vu par le modèle", "The tool as the model sees it", { published: true }),
      concept(4, "Une donnée n'est jamais un ordre", "Data is never an order", { published: true }),
      concept(5, "La sortie du modèle est une donnée non fiable", "The model's output is untrusted data", { published: true }),
      concept(6, "Le refus est un état", "Refusal is a state", { published: true }),
      concept(7, "La bonne page doit arriver", "The right page must arrive", { published: true }),
      concept(8, "Lire l'appel d'outil, pas la réponse", "Read the tool call, not the answer", { published: true }),
      concept(9, "Évaluer sans se mentir", "Evaluate without lying to yourself", { published: true }),
      concept(10, "La mémoire a un propriétaire", "Memory has an owner", { published: true }),
      concept(11, "Ce qui doit toujours arriver s'impose dans le code", "What must always happen is enforced in code", { published: true }),
      concept(12, "Doser l'autonomie", "Dosing autonomy", { published: true }),
    ],
  },
  {
    slug: "aws-scholars",
    name: { fr: "AWS Scholars", en: "AWS Scholars" },
    shelf: "journeys",
    color: "apricot",
    gauge: true,
    heading: { text: { fr: "Future Agent ", en: "Future Agent " }, accent: { fr: "Engineer", en: "Engineer" } },
    meta: { fr: "AWS AI & ML Scholars · Udacity · 3 projets validés", en: "AWS AI & ML Scholars · Udacity · 3 projects approved" },
    summary: {
      fr: [
        "Le parcours Future Agent Engineer du programme AWS AI & ML Scholars : trois projets de support client sur Amazon Bedrock AgentCore, tous validés par le mentor Udacity.",
        "Un chatbot dont tout le routage vit dans le prompt système, puis un agent Strands avec outils, RAG et mémoire long terme, puis un système de cinq agents qui coopèrent derrière un guardrail.",
      ],
      en: [
        "The Future Agent Engineer track of the AWS AI & ML Scholars program: three customer support projects on Amazon Bedrock AgentCore, all approved by the Udacity mentor.",
        "A chatbot whose routing lives entirely in its system prompt, then a Strands agent with tools, RAG and long-term memory, then a system of five cooperating agents behind a guardrail.",
      ],
    },
    callout: {
      label: { fr: "Fil rouge", en: "Common thread" },
      text: { fr: "Lire l'appel d'outil, <em>pas la réponse.</em>", en: "Read the tool call, <em>not the answer.</em>" },
    },
    cover: {
      title: { fr: "Future Agent ", en: "Future Agent " },
      accent: { fr: "Engineer", en: "Engineer" },
      subtitle: { fr: "AWS AI & ML Scholars", en: "AWS AI & ML Scholars" },
      info: { fr: "AWS", en: "AWS" },
      bars: [70, 45, 90],
      art: "cloud",
    },
    chapters: [
      {
        number: 1, kind: "chapter", published: true,
        title: { fr: "Customer Support Chatbot with Amazon Bedrock AgentCore", en: "Customer Support Chatbot with Amazon Bedrock AgentCore" },
        concepts: [1, 4, 9, 11],
        teaser: {
          fr: "Tout le routage dans le prompt, 0.92 à l'évaluation, et des numéros de ticket inventés que seul DynamoDB a révélés.",
          en: "All routing in the prompt, 0.92 on evaluation, and invented ticket numbers that only DynamoDB revealed.",
        },
        repo: "https://github.com/Mialy333/support-chatbot-bedrock-agentcore",
      },
      {
        number: 2, kind: "chapter", published: true,
        title: { fr: "AI Support Agent", en: "AI Support Agent" },
        concepts: [2, 3, 8, 10],
        teaser: {
          fr: "Six outils, quatre sources, une infrastructure montée à la main : valider chaque couche seule avant de l'empiler.",
          en: "Six tools, four sources, infrastructure built by hand: validate each layer alone before stacking it.",
        },
        repo: "https://github.com/Mialy333/agentcore-customer-support-agent",
      },
      {
        number: 3, kind: "chapter", published: true,
        title: { fr: "NovaMart Multi-Agent Support", en: "NovaMart Multi-Agent Support" },
        concepts: [4, 8, 10, 11],
        teaser: {
          fr: "Cinq agents Strands, trois Knowledge Bases interrogées en parallèle, un guardrail : 120/120.",
          en: "Five Strands agents, three knowledge bases queried in parallel, one guardrail: 120/120.",
        },
        repo: "https://github.com/Mialy333/novamart-multi-agent-support",
      },
    ],
  },
  {
    slug: "dev3pack",
    name: { fr: "Dev3Pack", en: "Dev3Pack" },
    shelf: "journeys",
    color: "rose",
    gauge: true,
    heading: { text: { fr: "Dev3Pack AI Engineering ", en: "Dev3Pack AI Engineering " }, accent: { fr: "Bootcamp", en: "Bootcamp" } },
    meta: { fr: "14.09 → 02.10.2026 · Certificat obtenu", en: "14.09 → 02.10.2026 · Certificate earned" },
    summary: {
      fr: [
        "Trois semaines pour construire un assistant de recherche « source-grounded » : il répond à des questions de développeur à partir de six documents, cite le document utilisé, et refuse quand rien ne soutient la réponse.",
        "Bootcamp terminé : 5 100/5 100 points sur le parcours, final assignment à 100 %, certificat obtenu.",
      ],
      en: [
        "Three weeks to build a source-grounded research assistant: it answers developer questions from six documents, cites the document it used, and refuses when nothing backs the answer.",
        "Bootcamp completed: 5,100/5,100 points on the track, final assignment at 100%, certificate earned.",
      ],
    },
    callout: {
      label: { fr: "Fil rouge", en: "Common thread" },
      text: {
        fr: "Un agent que l'on a construit, testé, et que l'on <em>sait défendre.</em>",
        en: "An agent you built, tested, and <em>can defend.</em>",
      },
    },
    repo: "https://github.com/Mialy333/dev3pack-submissions/tree/ch01/submissions/Mialy333",
    cover: {
      title: { fr: "Dev3", en: "Dev3" },
      accent: { fr: "Pack", en: "Pack" },
      subtitle: { fr: "AI Engineering Bootcamp", en: "AI Engineering Bootcamp" },
      info: { fr: "3 SEM.", en: "3 WKS" },
      bars: [25, 60, 40, 85],
      art: "garland",
    },
    chapters: [
      session(1, "Configurer l'assistant", "Setting up the assistant", {
        published: true,
        concepts: [1],
        teaser: {
          fr: "Un filtre tags, deux changements refusés, et une règle : seul le diff fait foi.",
          en: "A tags filter, two rejected changes, and one rule: only the diff counts.",
        },
      }),
      session(2, "L'adapter de modèle", "The model adapter", {
        published: true,
        concepts: [6],
        teaser: {
          fr: "Une seule porte vers tous les modèles, une panne qui devient un refus, et un délai fixé par la mesure.",
          en: "One door to every model, an outage that becomes a refusal, and a timeout set by measurement.",
        },
      }),
      session(3, "Sorties structurées", "Structured outputs", {
        published: true,
        concepts: [4, 5, 6],
        teaser: {
          fr: "Un parser strict, un seul retry, et un golden set testé avant d'être étiqueté.",
          en: "A strict parser, a single retry, and a golden set tested before it's labeled.",
        },
      }),
      session(4, "Outils bornés", "Bounded tools", {
        published: true,
        concepts: [3, 4],
        teaser: {
          fr: "Un outil valide avant d'agir, et ce qu'il renvoie est une donnée, jamais un ordre.",
          en: "A tool validates before acting, and what it returns is data, never an order.",
        },
      }),
      session(5, "Mini-agent déterministe", "A deterministic mini-agent", {
        published: true,
        concepts: [2],
        teaser: {
          fr: "Une boucle qui s'arrête toujours, en disant pourquoi : quatre sorties, un budget compté avant l'appel.",
          en: "A loop that always stops, and says why: four exits, a budget counted before the call.",
        },
      }),
      session(6, "Baseline de récupération", "Retrieval baseline", {
        published: true,
        concepts: [6, 7],
        teaser: {
          fr: "Une recherche par mots, un chargeur qui refuse, et des verdicts lus dans les résultats, pas dans le score.",
          en: "A word-based search, a loader that refuses, and verdicts read in the results, not in the score.",
        },
      }),
      session(7, "Métriques de récupération et d'ancrage", "Retrieval and grounding metrics", {
        published: true,
        concepts: [7, 9],
        teaser: {
          fr: "Un correctif à 100 % qui casse les cas inédits, et un faux modèle tricheur qui obtient 50 %.",
          en: "A fix at 100% that breaks unseen cases, and a cheating fake model that scores 50%.",
        },
      }),
      session(8, "Boucles et graphes", "Loops and graphs", {
        published: true,
        concepts: [2],
        teaser: {
          fr: "Chaîne, boucle ou réflexion : compter les appels, et une table où un refus ne devient jamais une réponse.",
          en: "Chain, loop or reflection: count the calls, and a table where a refusal never becomes an answer.",
        },
      }),
      session(9, "Tracer et évaluer", "Tracing and evaluation", {
        published: true,
        concepts: [8],
        teaser: {
          fr: "La trace dit où est la panne, et les secrets y entrent masqués, jamais supprimés.",
          en: "The trace says where the failure is, and secrets go in masked, never deleted.",
        },
      }),
      session(10, "Skills et ADR", "Skills and ADRs", {
        published: true,
        concepts: [4],
        teaser: {
          fr: "Un acheteur qui refuse avant de payer, un ADR avec son seuil de retour, et un skill jugé sur preuve.",
          en: "A buyer that refuses before paying, an ADR with its reversal threshold, and a skill judged on evidence.",
        },
      }),
      session(11, "État et mémoire", "State and memory", {
        published: true,
        concepts: [10],
        teaser: {
          fr: "Une mémoire rangée par propriétaire, plafonnée, et une politique écrite avant le premier enregistrement.",
          en: "Memory filed by owner, capped, with a policy written before the first record.",
        },
      }),
      session(12, "Architecture MCP", "MCP architecture", {
        published: true,
        concepts: [3],
        teaser: {
          fr: "Seize outils annoncés, deux qui font bouger l'argent : lire un serveur MCP comme un prospectus.",
          en: "Sixteen advertised tools, two that move money: reading an MCP server like a prospectus.",
        },
      }),
      session(13, "Sécuriser un serveur MCP", "Securing an MCP server", {
        published: true,
        concepts: [3],
        teaser: {
          fr: "Décider avant d'ouvrir la connexion, et ne cocher une attestation que si elle est vraie.",
          en: "Decide before opening the connection, and tick an attestation only if it's true.",
        },
      }),
      session(14, "Déployer et exploiter", "Deploying and operating", {
        published: true,
        teaser: {
          fr: "Un smoke test doit pouvoir échouer, et la phrase de rollback s'écrit avant la panne.",
          en: "A smoke test must be able to fail, and the rollback sentence is written before the outage.",
        },
      }),
      {
        number: 15, kind: "step", code: "cap01", slug: "cap01", published: true,
        concepts: [9],
        title: { fr: "Notebook du final", en: "The final's notebook" },
        teaser: {
          fr: "Une évaluation verte sur un faux modèle prouve la tuyauterie, pas la fiabilité.",
          en: "A green evaluation on a fake model proves the plumbing, not reliability.",
        },
      },
      {
        number: 16, kind: "step", code: "Final", slug: "final", published: true,
        concepts: [5, 7, 9, 11],
        title: { fr: "Final assignment", en: "Final assignment" },
        teaser: {
          fr: "Quatre retouches de prompt sans effet stable, puis une idée : le modèle choisit, le code recopie. 15/15.",
          en: "Four prompt tweaks with no stable effect, then one idea: the model chooses, the code copies. 15/15.",
        },
        repo: "https://github.com/Mialy333/grounded-research-agent",
        demo: "https://mialy333.github.io/grounded-research-agent/",
        showcase: {
          image: groundedResearchDemo,
          title: "Grounded Research Library",
          alt: {
            fr: "La salle de lecture de la démo : six livres sur l'étagère, et une fiche de demande tamponnée « Not in our collection » pour une question hors des livres.",
            en: "The demo's reading room: six books on the shelf, and a call slip stamped \"Not in our collection\" for a question outside the books.",
          },
          text: {
            fr: "Un assistant de recherche qui ne répond qu'à partir de ses six livres : il recopie le passage mot pour mot, cite le livre, et refuse quand la réponse n'est pas sur l'étagère. 15/15 au grader privé ; la démo rejoue de vrais runs.",
            en: "A research assistant that only answers from its six books: it copies the passage word for word, cites the book, and refuses when the answer is not on the shelf. 15/15 on the private grader; the demo replays real runs.",
          },
        },
      },
      {
        number: 17, kind: "step", code: "Gecko", slug: "gecko", published: true,
        concepts: [1, 4, 6, 11],
        title: { fr: "Gecko capstone", en: "Gecko capstone" },
        teaser: {
          fr: "Un acheteur qui épingle la demande, vérifie chaque champ, et ne signe que si tout concorde : un vrai achat sur devnet.",
          en: "A buyer that pins the request, checks every field, and signs only if everything matches: a real purchase on devnet.",
        },
        repo: "https://github.com/Mialy333/my-gecko-buyer",
        demo: "https://mialy333.github.io/my-gecko-buyer/",
        showcase: {
          image: geckoBuyerDemo,
          title: "Gecko Café",
          alt: {
            fr: "Le Gecko Café, sous un store prune : un ticket « One latte » refusé, parce que 5.00 dépasse le budget de 2.00.",
            en: "The Gecko Café, under a plum awning: a \"One latte\" ticket declined, because 5.00 is over the 2.00 budget.",
          },
          text: {
            fr: "Un agent qui commande un café sur Solana devnet et vérifie l'addition : il note la commande d'abord, contrôle sept points avant de signer et, si un seul est faux, nomme le champ et ne paie rien. 2 cafés payés, 12 additions refusées, 0 mauvais paiement.",
            en: "An agent that orders a coffee on Solana devnet and checks the bill: it writes the order down first, checks seven things before signing and, if one is wrong, names the field and pays nothing. 2 coffees paid, 12 bad bills refused, 0 wrong payments.",
          },
        },
      },
    ],
  },
  {
    // Hacktoberfest 2026, published chapter by chapter: one chapter after each DEV post.
    // Source: the Claude Doc runbook "Hacktoberfest 2026", section
    // "Le livre Hacktoberfest 2026 pour My Building Library".
    slug: "hacktoberfest-2026",
    name: { fr: "Hacktoberfest 2026", en: "Hacktoberfest 2026" },
    shelf: "journeys",
    color: "apricot",
    gauge: true,
    heading: { text: { fr: "Hacktoberfest ", en: "Hacktoberfest " }, accent: { fr: "2026", en: "2026" } },
    meta: { fr: "02.10 → 01.11.2026 · MLH × DEV · En cours", en: "02.10 → 01.11.2026 · MLH × DEV · In progress" },
    summary: {
      fr: [
        "Open-Source AI Challenges : un mois pour construire chaque semaine un petit projet neuf avec de l'IA open-source au cœur (modèles open-weight, inférence locale, framework d'agent), le remettre à une vraie personne et le raconter sur DEV.",
        "Cinq challenges MLH × DEV, un thème révélé chaque lundi.",
      ],
      en: [
        "Open-Source AI Challenges: one month to build a small new project every week with open-source AI at its core (open-weight models, local inference, an agent framework), hand it to a real person and tell the story on DEV.",
        "Five MLH × DEV challenges, a theme revealed every Monday.",
      ],
    },
    callout: {
      label: { fr: "Fil rouge", en: "Common thread" },
      text: {
        fr: "Des agents IA utiles à de vraies personnes, <em>construits avec des modèles open-source.</em>",
        en: "AI agents that help real people, <em>built with open-source models.</em>",
      },
    },
    cover: {
      // \u00AD = soft hyphen: lets "Hacktoberfest" break as "Hacktober-/fest" on a narrow cover.
      title: { fr: "Hacktober\u00AD", en: "Hacktober\u00AD" },
      accent: { fr: "fest", en: "fest" },
      subtitle: { fr: "Open-Source AI Challenges", en: "Open-Source AI Challenges" },
      info: { fr: "5 SEM.", en: "5 WKS" },
      bars: [35, 60, 85, 50, 70],
    },
    chapters: [
      {
        number: 1, kind: "step", code: "Weekend", slug: "weekend", published: true,
        theme: "Build for a Friend",
        concepts: [5, 11],
        title: { fr: "Une seule chose à faire", en: "Just one thing to do" },
        teaser: {
          fr: "Un outil pour ma sœur, qui tourne dans son navigateur et lui propose une seule action à la fois.",
          en: "A tool for my sister that runs in her browser and suggests one action at a time.",
        },
        stack: [
          { name: "Gemma 2 2B", icon: "brain", partner: true },
          { name: "WebLLM", icon: "browser" },
          { name: "WebGPU", icon: "si-webgpu" },
          { name: "Chrome", icon: "brand-chrome" },
          { name: "HTML / JS", icon: "brand-html5" },
          { name: "Render", icon: "si-render" },
          { name: "Claude Code", icon: "si-claude" },
        ],
        repo: "https://github.com/Mialy333/one-step",
        post: "https://dev.to/mialy333/when-everything-feels-urgent-i-built-my-sister-a-tool-that-gives-her-just-one-next-step-3hg7",
        demo: "https://one-step-jypm.onrender.com",
      },
      {
        number: 2, kind: "step", code: "Week 1", slug: "week-1", published: true,
        theme: "Touch Grass",
        concepts: [3, 10, 11],
        title: { fr: "Le modèle rédige, le code calcule", en: "The model writes, the code computes" },
        teaser: {
          fr: "Un agent qui m'envoie chaque matin sur Telegram une balade d'automne dans Paris.",
          en: "An agent that sends me an autumn walk through Paris on Telegram every morning.",
        },
        stack: [
          { name: "Gemma (gemma4:e2b)", icon: "brain", partner: true },
          { name: "Ollama", icon: "si-ollama" },
          { name: "Strands Agents", icon: "robot" },
          { name: "Python", icon: "brand-python" },
          { name: "SQLite", icon: "si-sqlite" },
          { name: "Paris Data", icon: "trees" },
          { name: "Open-Meteo", icon: "cloud-rain" },
          { name: "Telegram", icon: "brand-telegram" },
          { name: "launchd", icon: "clock" },
          { name: "uv", icon: "si-uv" },
          { name: "Claude Code", icon: "si-claude" },
        ],
        repo: "https://github.com/Mialy333/autumn-walks",
        post: "https://dev.to/mialy333/i-built-an-ai-that-sends-me-on-autumn-walks-then-i-got-sick-56o9",
      },
      {
        number: 3, kind: "step", code: "Week 2", slug: "week-2", published: true,
        theme: "Side Hustle",
        concepts: [1, 5, 8, 9, 11],
        title: { fr: "82 % de risque, payée 15 jours en avance", en: "82% risk, paid 15 days early" },
        teaser: {
          fr: "Un outil local qui classe les factures impayées selon le risque de retard et rédige la relance.",
          en: "A local tool that ranks unpaid invoices by risk of late payment and drafts the reminder.",
        },
        stack: [
          { name: "TabPFN-3.5", icon: "table", partner: true },
          { name: "Gemma (gemma4:e2b)", icon: "brain", partner: true },
          { name: "Ollama", icon: "si-ollama" },
          { name: "Strands Agents", icon: "robot" },
          { name: "Python", icon: "brand-python" },
          { name: "Streamlit", icon: "si-streamlit" },
          { name: "uv", icon: "si-uv" },
          { name: "Claude Code", icon: "si-claude" },
        ],
        repo: "https://github.com/Mialy333/late-pay-radar",
        post: "https://dev.to/mialy333/my-model-gave-my-client-an-82-risk-of-paying-late-they-paid-15-days-early-35ih",
        video: "https://youtu.be/sccG2NXpBWw",
      },
      {
        number: 4, kind: "step", code: "Week 3", slug: "week-3", published: false,
        title: { fr: "Thème révélé le 19 octobre", en: "Theme revealed on October 19" },
      },
      {
        number: 5, kind: "step", code: "Week 4", slug: "week-4", published: false,
        title: { fr: "Thème révélé le 26 octobre", en: "Theme revealed on October 26" },
      },
    ],
  },
  {
    // My Python for AI 101: the Python mechanisms behind my projects, one card per
    // mechanism, 60 cards sorted by family. Sources: the "My Python for AI 101" sections
    // of the Claude Doc runbooks "Dev3Pack AI Engineering Bootcamp", "AgentCore — Agent
    // Support Client" and "AgentCore — NovaMart Multi-Agent Support (Projet #3)".
    // Placed after Hacktoberfest so the numbers of the books already published do not change.
    slug: "python-for-ai-101",
    name: { fr: "My Python for AI 101", en: "My Python for AI 101" },
    shelf: "fundamentals",
    color: "rose",
    description: {
      fr: "Les mécanismes Python qui font tourner mes agents, une fiche par mécanisme.",
      en: "The Python mechanisms that run my agents, one card per mechanism.",
    },
    heading: { text: { fr: "My Python for AI ", en: "My Python for AI " }, accent: { fr: "101", en: "101" } },
    meta: { fr: "Dev3Pack · AWS Scholars · 60 fiches", en: "Dev3Pack · AWS Scholars · 60 cards" },
    summary: {
      fr: [
        "Les mécanismes Python qui font tourner mes agents, une fiche par mécanisme, avec l'entrée, la sortie et le fichier où les relire. Les fiches viennent de trois projets : le bootcamp Dev3Pack, puis AI Support Agent et NovaMart, deux projets du Nanodegree AWS.",
        "60 fiches classées par famille, de l'organisation du projet jusqu'aux tests. Chaque chapitre finit par les chapitres de mes formations où on voit ces mécanismes sur le terrain, et le livre se ferme sur trois checklists pour le prochain projet.",
      ],
      en: [
        "The Python mechanisms that run my agents, one per card, with the input, the output and the file where you can read them again. The cards come from three projects: the Dev3Pack bootcamp, then AI Support Agent and NovaMart, two projects of the AWS Nanodegree.",
        "60 cards sorted by family, from the layout of the project to the tests. Every chapter ends with the chapters of my courses where these mechanisms are seen in the field, and the book closes on three checklists for the next project.",
      ],
    },
    callout: {
      label: { fr: "Format d'une fiche", en: "Card format" },
      text: {
        fr: "En une phrase, pourquoi pour un agent, une analogie, le mécanisme, l'entrée et la sortie réelles, <em>où le relire.</em>",
        en: "In one sentence, why it matters for an agent, an analogy, the mechanism, the real input and output, <em>where to read it again.</em>",
      },
    },
    cover: {
      title: { fr: "Python ", en: "Python " },
      accent: { fr: "101", en: "101" },
      subtitle: { fr: "My Python for AI 101", en: "My Python for AI 101" },
      info: { fr: "60 FICHES", en: "60 CARDS" },
      bars: [45, 70, 55, 90, 65],
    },
    chapters: [
      concept(1, "Mode d'emploi et carte", "How to read it, and the map", {
        published: true,
        teaser: {
          fr: "Trois projets, qui a écrit quel code, où chaque mécanisme intervient, et la carte des 60 fiches.",
          en: "Three projects, who wrote which code, where each mechanism sits, and the map of the 60 cards.",
        },
      }),
      concept(2, "Organiser le projet", "Organizing the project", {
        published: true,
        teaser: {
          fr: "Un fichier, plusieurs commandes, et des réglages qui ne sont jamais écrits dans le code.",
          en: "One file, several commands, and settings that are never written in the code.",
        },
      }),
      concept(3, "Les données", "Data", {
        published: true,
        concepts: [5, 11],
        teaser: {
          fr: "Une case manquante, une intention modifiée en route, un arrondi qui fait passer un prix : ce que la forme des données évite.",
          en: "A missing box, an intent changed along the way, a rounding error that lets a price through: what the shape of the data prevents.",
        },
      }),
      concept(4, "Les données AWS", "AWS data", {
        published: true,
        concepts: [1, 11],
        teaser: {
          fr: "Une commande absente qui devient une réponse claire, et deux agents qui ne s'écrasent plus.",
          en: "A missing order that becomes a clear answer, and two agents that no longer overwrite each other.",
        },
      }),
      concept(5, "Le texte", "Text", {
        published: true,
        concepts: [4, 5, 7, 8],
        teaser: {
          fr: "Un refus qui nomme les deux valeurs, une forme reconnue par regex, un JSON accepté seulement s'il est exact.",
          en: "A refusal that names both values, a shape recognized by regex, JSON accepted only if it is exact.",
        },
      }),
      concept(6, "Le contrôle", "Control flow", {
        published: true,
        concepts: [2, 6],
        teaser: {
          fr: "Les sorties d'abord, une table où une paire absente est refusée, et des outils rangés avec leurs règles.",
          en: "Exits first, a table where a missing pair is refused, and tools packed with their rules.",
        },
      }),
      concept(7, "Les erreurs et les garde-fous", "Errors and guardrails", {
        published: true,
        concepts: [6, 11],
        teaser: {
          fr: "Un traceback qui devient un refus lisible, et une règle que le code garantit même si le modèle se trompe.",
          en: "A traceback that becomes a readable refusal, and a rule the code guarantees even if the model is wrong.",
        },
      }),
      concept(8, "Décorateurs, contexte et fichiers", "Decorators, context and files", {
        published: true,
        concepts: [3, 8],
        teaser: {
          fr: "La docstring que lit le modèle, une trace jamais laissée ouverte, une preuve jamais écrasée.",
          en: "The docstring the model reads, a trace never left open, evidence never overwritten.",
        },
      }),
      concept(9, "Les agents et leurs interfaces", "Agents and their interfaces", {
        published: true,
        concepts: [3, 10, 11],
        teaser: {
          fr: "Un faux modèle à la place du vrai, une règle « toujours » tenue par un hook, une mémoire qui ne fuit pas.",
          en: "A fake model in place of the real one, an \"always\" rule kept by a hook, memory that does not leak.",
        },
      }),
      concept(10, "Le réseau, le temps et la concurrence", "Network, time and concurrency", {
        published: true,
        concepts: [6, 7],
        teaser: {
          fr: "Une URL vérifiée avant l'appel, une attente bornée, trois recherches lancées en même temps.",
          en: "A URL checked before the call, a bounded wait, three searches started at the same time.",
        },
      }),
      concept(11, "Déployer et outiller", "Deploying and tooling", {
        published: true,
        concepts: [1, 3],
        teaser: {
          fr: "Un déploiement validé avant de partir, une identité lue dans un token, une fonction devenue outil MCP.",
          en: "A deployment validated before it leaves, an identity read from a token, a function turned into an MCP tool.",
        },
      }),
      concept(12, "Tester et évaluer", "Testing and evaluating", {
        published: true,
        concepts: [9],
        teaser: {
          fr: "Des tests réseau coupé, et un guardrail mesuré avant d'être publié.",
          en: "Tests with the network cut off, and a guardrail measured before it is published.",
        },
      }),
      concept(13, "Les checklists du prochain projet", "The checklists for the next project", {
        published: true,
        concepts: [11],
        teaser: {
          fr: "Trois checklists, une par projet, dans l'ordre où on pose les règles dans un nouveau repo.",
          en: "Three checklists, one per project, in the order you put the rules in a new repo.",
        },
      }),
    ],
  },
  {
    // DRILLS.ai: my own build, from the OpenAI DevDay hackathon (Builds shelf).
    // Source: the project runbook "Runbook — DRILLS.ai", version of commit 8f45461
    // (26 Oct 2026), audited on 30 Oct 2026. Code written with ChatGPT and Codex.
    slug: "drills-ai",
    name: { fr: "DRILLS.ai", en: "DRILLS.ai" },
    shelf: "builds",
    color: "sage",
    description: {
      fr: "Mon outil de candidature pour les personnes en reconversion vers l'Agent Engineering, construit pendant le hackathon OpenAI DevDay.",
      en: "My application tool for people switching careers into Agent Engineering, built during the OpenAI DevDay hackathon.",
    },
    heading: { text: { fr: "DRILLS", en: "DRILLS" }, accent: { fr: ".ai", en: ".ai" } },
    meta: { fr: "Hackathon OpenAI DevDay · octobre 2026 · MVP en ligne", en: "OpenAI DevDay hackathon · October 2026 · MVP live" },
    summary: {
      fr: [
        "J'ai transformé un prototype d'exercices de programmation en outil de candidature pour les personnes en reconversion vers l'Agent Engineering. On importe un CV, on choisit une offre, on voit les preuves et les points à clarifier, puis on prépare des documents modifiables avant de postuler soi-même.",
        "Astro, TypeScript, FastAPI et l'API OpenAI, avec des sorties structurées, des références vérifiées et un score calculé en Python. Construit avec l'assistance de ChatGPT et Codex. Le MVP est en ligne ; sa valeur sur de vraies recherches d'emploi reste à évaluer.",
      ],
      en: [
        "I turned a coding-exercise prototype into an application tool for people switching careers into Agent Engineering. You import a CV, choose a posting, see the evidence and the points to clarify, then prepare editable documents before applying yourself.",
        "Astro, TypeScript, FastAPI and the OpenAI API, with structured outputs, checked references and a score computed in Python. Built with the help of ChatGPT and Codex. The MVP is live; its value on real job searches still has to be evaluated.",
      ],
    },
    callout: {
      label: { fr: "Fil rouge", en: "Common thread" },
      text: {
        fr: "Une candidature crédible exige des faits, des contrôles et des limites compréhensibles, <em>pas seulement un texte fluide.</em>",
        en: "A credible application needs facts, checks and understandable limits, <em>not just fluent text.</em>",
      },
    },
    repo: "https://github.com/Mialy333/drills.ai",
    cover: {
      // \u200B = zero-width space: lets ".ai" go to the next line on a narrow cover.
      title: { fr: "DRILLS\u200B", en: "DRILLS\u200B" },
      accent: { fr: ".ai", en: ".ai" },
      subtitle: { fr: "OpenAI DevDay hackathon", en: "OpenAI DevDay hackathon" },
      info: { fr: "MVP", en: "MVP" },
      bars: [40, 75, 55, 95],
    },
    chapters: [
      concept(1, "Le problème et le contrat", "The problem and the contract", {
        published: true,
        concepts: [2, 12],
        teaser: {
          fr: "Trois questions de reconvertie, une promesse qui a changé deux fois, et ce qui reste hors contrat.",
          en: "Three career-changer questions, a promise that changed twice, and what stays out of the contract.",
        },
        demo: "https://mialy333.github.io/drills.ai/en/",
        video: "https://www.youtube.com/watch?v=rpC7ADxf-kI",
        showcase: {
          image: drillsHome,
          title: "DRILLS.ai",
          alt: {
            fr: "L'accueil de DRILLS.ai : une application rétro qui propose de préparer sa première candidature d'Agent Engineer.",
            en: "The DRILLS.ai home page: a retro app that offers to prepare your first Agent Engineer application.",
          },
          text: {
            fr: "Un CV, une offre, un diagnostic qui montre ses preuves, puis des documents à relire avant de postuler soi-même. Capture du 25 octobre 2026, avec un exemple fictif.",
            en: "A CV, a posting, an assessment that shows its evidence, then documents to review before applying yourself. Screenshot from October 25, 2026, with a fictional example.",
          },
        },
      }),
      concept(2, "L'architecture", "The architecture", {
        published: true,
        concepts: [11, 12],
        teaser: {
          fr: "Un composant nommé agent, un workflow piloté par l'application, et cinq étapes sur huit écrites en code.",
          en: "A component named agent, a workflow driven by the app, and five steps out of eight written in code.",
        },
        stack: [
          { name: "Astro", icon: "brand-astro" },
          { name: "TypeScript", icon: "brand-typescript" },
          { name: "Tiptap", icon: "edit" },
          { name: "Zod", icon: "si-zod" },
          { name: "Python", icon: "brand-python" },
          { name: "FastAPI", icon: "si-fastapi" },
          { name: "Pydantic", icon: "si-pydantic" },
          { name: "OpenAI Responses API", icon: "brand-openai" },
          { name: "pypdf", icon: "file-type-pdf" },
          { name: "MCP", icon: "si-mcp" },
          { name: "pytest", icon: "si-pytest" },
          { name: "uv", icon: "si-uv" },
          { name: "GitHub Actions", icon: "si-githubactions" },
          { name: "GitHub Pages", icon: "si-githubpages" },
          { name: "Render", icon: "si-render" },
          { name: "ChatGPT / Codex", icon: "brand-openai" },
        ],
      }),
      concept(3, "Installer et reprendre sans rien perdre", "Setting up and resuming without losing anything", {
        published: true,
        concepts: [1],
        teaser: {
          fr: "Dix branches, des worktrees, une revue détachée : regarder l'état réel du clone avant de réparer.",
          en: "Ten branches, worktrees, a detached review: look at the clone's real state before fixing.",
        },
      }),
      concept(4, "Phase 1 : des agents qui fabriquent des exercices", "Phase 1: agents that make exercises", {
        published: true,
        concepts: [1, 5, 9],
        teaser: {
          fr: "Quatre agents en chaîne, un validateur qui dit ce qu'il n'a pas prouvé, et un test qui doit échouer sur le bug.",
          en: "Four agents in a chain, a validator that says what it did not prove, and a test that must fail on the bug.",
        },
      }),
      concept(5, "Phase 2 : le pivot vers la candidature", "Phase 2: the pivot to job applications", {
        published: true,
        concepts: [1, 6, 11],
        teaser: {
          fr: "Quatre étapes, un PDF lu dans un sous-processus borné, et une panne d'offres jamais déguisée en liste vide.",
          en: "Four steps, a PDF read in a bounded subprocess, and a job-board outage never disguised as an empty list.",
        },
        demo: "https://mialy333.github.io/drills.ai/en/",
      }),
      concept(6, "Le diagnostic : choisir une référence, pas la recopier", "The assessment: choose a reference, don't copy it", {
        published: true,
        concepts: [4, 5, 11],
        teaser: {
          fr: "Des extraits numérotés, un modèle qui choisit un ID, et le code qui remet le passage exact.",
          en: "Numbered excerpts, a model that picks an ID, and code that puts back the exact passage.",
        },
      }),
      concept(7, "Le score calculé par le code", "The score computed by code", {
        published: true,
        concepts: [9, 11],
        teaser: {
          fr: "Poids 3, 2, 1, crédit 1, 0,5, 0 : un 67 qu'on peut refaire à la main, et une condition qu'aucun score ne lève.",
          en: "Weights 3, 2, 1, credit 1, 0.5, 0: a 67 you can redo by hand, and a condition no score lifts.",
        },
      }),
      concept(8, "Les documents, le dossier et le suivi", "Documents, the dossier and tracking", {
        published: true,
        concepts: [10, 12],
        teaser: {
          fr: "Un brouillon à relire, un dossier qui expire dans le navigateur, et un envoi que seul le candidat déclare.",
          en: "A draft to review, a dossier that expires in the browser, and a sending only the candidate declares.",
        },
      }),
      concept(9, "MCP : trois outils en lecture seule", "MCP: three read-only tools", {
        published: true,
        concepts: [3, 4, 12],
        teaser: {
          fr: "Chercher, lire, scorer : trois outils qui ne voient ni le dossier, ni le modèle, et ne postulent pas.",
          en: "Search, read, score: three tools that see neither the dossier nor the model, and do not apply.",
        },
      }),
      concept(10, "Déployer et exploiter", "Deploying and operating", {
        published: true,
        concepts: [1, 8],
        teaser: {
          fr: "Deux hébergeurs, une CI qui n'est pas une barrière, et des logs qui disent où, jamais quoi.",
          en: "Two hosts, a CI that is not a gate, and logs that say where, never what.",
        },
        demo: "https://mialy333.github.io/drills.ai/en/",
        video: "https://www.youtube.com/watch?v=rpC7ADxf-kI",
      }),
      concept(11, "Incidents, mesures et limites", "Incidents, measurements and limits", {
        published: true,
        concepts: [6, 8, 9],
        teaser: {
          fr: "Dix-neuf incidents, 190 tests qui ne prouvent pas plus d'entretiens, et une latence gardée telle quelle.",
          en: "Nineteen incidents, 190 tests that do not prove more interviews, and latency kept as it is.",
        },
      }),
      concept(12, "Décisions, journal et suite", "Decisions, log and next steps", {
        published: true,
        concepts: [9, 12],
        teaser: {
          fr: "Vingt-neuf étapes avec leurs commits, treize décisions avec leur condition de retour, et un test à mener.",
          en: "Twenty-nine steps with their commits, thirteen decisions with their condition for going back, and a test to run.",
        },
      }),
      concept(13, "Ce que je sais défendre", "What I can defend", {
        published: true,
        concepts: [4, 5, 9, 11, 12],
        teaser: {
          fr: "Vingt notions, une question chacune, et dix réponses de soutenance qui ne promettent rien de trop.",
          en: "Twenty notions, one question each, and ten defense answers that promise nothing too much.",
        },
      }),
    ],
  },
  {
    slug: "my-path",
    name: { fr: "Mon parcours", en: "My path" },
    shelf: "path",
    forthcoming: true,
    description: { fr: "De la gestion d'actifs à l'AI Engineering.", en: "From asset management to AI engineering." },
    heading: { text: { fr: "Mon ", en: "My " }, accent: { fr: "parcours", en: "path" } },
    cover: {
      title: { fr: "Mon ", en: "My " },
      accent: { fr: "parcours", en: "path" },
      subtitle: { fr: "", en: "" },
      info: { fr: "", en: "" },
      bars: [],
    },
    chapters: [],
  },
  {
    // Builds: the agents Mialy designs on her own, from the BAA 101 concepts.
    // Placeholder until the first project: shown as "coming soon", no invented title.
    slug: "my-agents",
    name: { fr: "Mes agents", en: "My agents" },
    shelf: "builds",
    forthcoming: true,
    description: {
      fr: "Les agents IA que je construis par moi-même, à partir des notions de BAA 101.",
      en: "The AI agents I build on my own, from the BAA 101 concepts.",
    },
    heading: { text: { fr: "Mes ", en: "My " }, accent: { fr: "agents", en: "agents" } },
    cover: {
      title: { fr: "Mes ", en: "My " },
      accent: { fr: "agents", en: "agents" },
      subtitle: { fr: "", en: "" },
      info: { fr: "", en: "" },
      bars: [],
    },
    chapters: [],
  },
];

export const baa = books.find((b) => b.slug === "baa-101");

export const conceptsOf = (chapter: Chapter): Chapter[] =>
  (chapter.concepts ?? [])
    .map((n) => baa?.chapters.find((c) => c.number === n))
    .filter((c): c is Chapter => c !== undefined);

export const appliedIn = (concept: Chapter) =>
  books
    .filter((b) => b !== baa)
    .flatMap((b) =>
      b.chapters
        .filter((c) => c.published && (c.concepts ?? []).includes(concept.number))
        .map((chapter) => ({ book: b, chapter })),
    );

export const pad = (n: number) => String(n).padStart(2, "0");
export const publishedCount = (book: Book) => book.chapters.filter((c) => c.published).length;
export const progressPercent = (book: Book) =>
  book.chapters.length ? Math.round((publishedCount(book) / book.chapters.length) * 100) : 0;
export const isInProgress = (book: Book) =>
  !!book.gauge && publishedCount(book) < book.chapters.length;
export const bookNumber = (book: Book) => pad(books.indexOf(book) + 1);
export const bookUrl = (locale: Locale, book: Book) => `/${locale}/books/${book.slug}/`;
// The chapter's slug in URLs and file names; also the key of the "read" stamp.
export const chapterSlug = (chapter: Chapter) => chapter.slug ?? `${chapter.kind}-${pad(chapter.number)}`;
export const chapterUrl = (locale: Locale, book: Book, chapter: Chapter) =>
  `/${locale}/books/${book.slug}/${chapterSlug(chapter)}/`;
export const chapterLabel = (chapter: Chapter, t: (key: UiKey) => string) =>
  chapter.code ?? `${t(chapter.kind === "session" ? "label.session" : "label.chapter")} ${pad(chapter.number)}`;
// The label followed by the challenge theme when there is one: "Weekend · Build for a Friend".
// Used on the book page; the short label stays in breadcrumbs and cross-links.
export const chapterLabelWithTheme = (chapter: Chapter, t: (key: UiKey) => string) =>
  chapter.theme ? `${chapterLabel(chapter, t)} · ${chapter.theme}` : chapterLabel(chapter, t);

export function latestChapters() {
  return books
    .flatMap((book) => book.chapters.filter((c) => c.published).map((chapter) => ({ book, chapter })))
    .reverse();
}

export const stats = {
  openBooks: books.filter((b) => !b.forthcoming).length,
  publishedChapters: books.reduce((n, b) => n + publishedCount(b), 0),
  livingBooks: books.filter((b) => b.living).length,
};
