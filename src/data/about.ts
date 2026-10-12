// The About page text, written by Mialy, section by section.
// FR is hers; EN is Claude's translation, to be validated by Mialy.
// Sections not written yet simply are not listed: the page shows "coming soon".
import type { Locale } from "../i18n/ui";
import type { Proof } from "./credentials";
import womenInDefiCertificate from "../assets/initiatives/women-in-defi.jpg";

type L = Record<Locale, string>;

export interface Fact {
  label: L;
  value: L;
}

// 1. What I'm looking for: one short paragraph, then a quick-scan card for recruiters.
export const lookingFor = {
  title: { fr: "Ce que je <em>cherche</em>", en: "What I'm <em>looking for</em>" } as L,
  text: {
    fr: "Je cherche à rejoindre une équipe qui construit des <strong>agents et assistants IA</strong>, en <strong>contrat de professionnalisation</strong> pour aller au bout de ma formation à Ada Tech School, ou en CDI. La finance et les actifs numériques me sont familiers, mais ce qui m'attire avant tout, ce sont les projets où la fiabilité compte : un assistant qui cite ses sources, ou qui sait dire qu'il ne sait pas. J'y apporte deux langages rarement réunis : celui des agents IA, que j'apprends en construisant, et celui de la gestion d'actifs, que je pratique depuis dix ans.",
    en: "I'm looking to join a team that builds <strong>AI agents and assistants</strong>, on a <strong>work-study contract</strong> (French <em>contrat de professionnalisation</em>) to complete my training at Ada Tech School, or on a permanent contract. Finance and digital assets are familiar ground, but what draws me most are projects where reliability matters: an assistant that cites its sources, or knows to say it doesn't know. I bring two languages that rarely meet: AI agents, which I learn by building, and asset management, which I've practised for ten years.",
  } as L,
  facts: [
    { label: { fr: "Poste", en: "Role" }, value: { fr: "Ingénieure IA · Développeuse d'agents IA", en: "AI Engineer · AI agent developer" } },
    {
      label: { fr: "Contrat", en: "Contract" },
      value: { fr: "Contrat de professionnalisation (formation Ada Tech School) ou CDI", en: "Work-study contract (Ada Tech School training) or permanent contract" },
    },
    { label: { fr: "Secteurs", en: "Sectors" }, value: { fr: "Finance, actifs numériques, industrie", en: "Finance, digital assets, industry" } },
    {
      label: { fr: "Où", en: "Where" },
      value: {
        fr: "Paris et Île-de-France, télétravail ; ouverte à une mobilité à l'étranger à terme",
        en: "Paris area, remote; open to moving abroad later on",
      },
    },
    { label: { fr: "Disponibilité", en: "Availability" }, value: { fr: "Immédiate", en: "Immediately" } },
    {
      label: { fr: "Langues", en: "Languages" },
      value: {
        fr: "Français (langue maternelle) · Anglais courant, ma langue de travail · Chinois mandarin (débutante)",
        en: "French (native) · English, fluent, my working language · Mandarin Chinese (beginner)",
      },
    },
  ] as Fact[],
};

// 2. What I bring: five strengths, each shown by facts rather than labels.
// Soft skills are in there too, as things done: explaining, checking, helping.
export interface Strength {
  title: L;
  text: L;
  proofs: { label: L; proof: Proof }[]; // where to see it on the site (may be empty)
}

const same = (text: string): L => ({ fr: text, en: text });

export const bring = {
  title: { fr: "Ce que j'<em>apporte</em>", en: "What I <em>bring</em>" } as L,
  // Each strength is told with the STAR method: situation, task, action, result.
  items: [
    {
      title: { fr: "Construction d'agents IA", en: "Building AI agents" },
      text: {
        fr: "Dans mon Nanodegree, NovaMart avait besoin d'un support client capable de traiter commandes, retours et questions sur ses conditions de vente. Ma mission : un système multi-agents déployé sur AWS, qui ne répond que sur des faits vérifiés et résiste aux tentatives de détournement. J'ai construit cinq agents coordonnés par un orchestrateur, trois bases documentaires interrogées en parallèle, un garde-fou contre les sujets interdits et les données personnelles, et un suivi de chaque étape dans X-Ray. Résultat : 120/120 aux tests du projet, 14/14 aux tests du garde-fou, et un projet validé par le mentor Udacity.",
        en: "In my Nanodegree, NovaMart needed customer support that could handle orders, returns and questions about its terms. My task: a multi-agent system on AWS that only answers from verified facts and resists hijacking attempts. I built five agents coordinated by an orchestrator, three document bases queried in parallel, a guardrail against banned topics and personal data, and tracing of every step in X-Ray. Result: 120/120 on the project tests, 14/14 on the guardrail tests, and a project approved by the Udacity mentor.",
      },
      proofs: [{ label: same("AWS 3"), proof: { label: "AWS 3", book: "aws-scholars", chapter: 3 } }],
    },
    {
      title: { fr: "Vulgarisation", en: "Explaining simply" },
      text: {
        fr: "En gestion d'actifs, je traduisais déjà les stratégies des gérants et des quants pour les clients. En me formant aux agents IA, les notions se sont vite empilées, chacune liée à un outil ou à un cloud. Je me suis fixé un but : garder seulement ce qui vaut pour n'importe quel agent, et l'expliquer simplement. J'ai écrit BAA 101 : chaque chapitre part d'un vrai projet, débarrassé de ses détails, et un glossaire de 54 notions s'ouvre en bulle dans le texte. Résultat : onze chapitres publiés, en français et en anglais.",
        en: "In asset management, I already translated the strategies of portfolio managers and quants for clients. As I trained in AI agents, concepts piled up fast, each tied to a tool or a cloud. I set myself a goal: keep only what holds for any agent, and explain it simply. I wrote BAA 101: each chapter starts from a real project, stripped of its specifics, and a 54-term glossary opens as a bubble in the text. Result: eleven chapters published, in French and English.",
      },
      proofs: [
        { label: same("BAA 101"), proof: { label: "BAA 101", book: "baa-101" } },
        { label: { fr: "Glossaire", en: "Glossary" }, proof: { label: "Glossary", page: "books/baa-101/glossary/" } },
      ],
    },
    {
      title: { fr: "Rigueur", en: "Rigour" },
      text: {
        fr: "Pendant Dev3Pack, mon agent tournait sur un modèle installé sur ma machine. Il fallait fixer un délai au-delà duquel il abandonne, sinon il pouvait attendre indéfiniment. J'avais une estimation en tête ; plutôt que de m'y fier, j'ai mesuré : 1,9 seconde au premier appel, 0,3 ensuite. Résultat : un délai de 3 secondes fondé sur la mesure, alors que mon estimation était fausse. Même réflexe quand un test n'avait pas tourné : je l'ai déclaré au lieu d'inventer un chiffre.",
        en: "During Dev3Pack, my agent ran on a model installed on my own machine. I had to set a time limit after which it gives up, or it could wait forever. I had an estimate in mind; rather than trust it, I measured: 1.9 seconds on the first call, 0.3 after that. Result: a 3-second limit based on measurement, while my estimate had been wrong. Same reflex when a test hadn't run: I declared it instead of making up a number.",
      },
      proofs: [
        { label: same("Dev3Pack S2"), proof: { label: "Dev3Pack S2", book: "dev3pack", chapter: 2 } },
        { label: same("S8"), proof: { label: "S8", book: "dev3pack", chapter: 8 } },
      ],
    },
    {
      title: { fr: "Esprit d'équipe", en: "Team spirit" },
      text: {
        fr: "Lors du hackathon de sélection pour l'accélérateur Dev3Pack, nous construisions SafeHaven Money quand l'ordinateur de ma coéquipière a lâché. Il fallait quand même livrer l'application dans les temps. J'ai repris tout le travail et je l'ai terminée avec Codex. Résultat : l'application a été livrée à temps, présentée au jury, et j'ai intégré l'accélérateur Dev3Pack. Pendant le Nanodegree, j'ai aussi répondu aux questions d'autres étudiants sur le forum Udacity.",
        en: "At the selection hackathon for the Dev3Pack accelerator, we were building SafeHaven Money when my teammate's computer gave out. We still had to deliver the app on time. I took over all the work and finished it with Codex. Result: the app was delivered on time and presented to the jury, and I joined the Dev3Pack accelerator. During the Nanodegree, I also answered other students' questions on the Udacity forum.",
      },
      proofs: [],
    },
    {
      title: { fr: "Expertise en finance", en: "Finance expertise" },
      text: {
        fr: "Une école de commerce majeure Finance, un MBA Trading & Asset Management, puis dix ans en gestion d'actifs, notamment chez Crédit Agricole CIB, Candriam et Northern Trust. Je sais ce que les équipes financières attendent d'un outil : des chiffres justes, et une explication pour chacun.",
        en: "A business school degree with a Finance major, an MBA in Trading & Asset Management, then ten years in asset management, including at Crédit Agricole CIB, Candriam and Northern Trust. I know what finance teams expect from a tool: accurate numbers, and an explanation for each one.",
      },
      proofs: [],
    },
  ] as Strength[],
};

// 2 bis. My values: each one backed by a fact (STAR). No value without a fact:
// a third one will come when Mialy has found it, not before.
export const values = {
  title: { fr: "Mes <em>valeurs</em>", en: "My <em>values</em>" } as L,
  items: [
    {
      title: { fr: "Innovation", en: "Innovation" },
      text: {
        fr: "Fin juillet 2026, en plein Nanodegree, AWS a mis en maintenance l'outil sur lequel mon premier projet était prévu. Il fallait quand même livrer un chatbot de support qui envoie chaque message vers le bon comportement. Plutôt que de bricoler l'ancienne méthode, j'ai reconstruit le projet sur le harness managé d'AgentCore, alors tout récent : tout le routage vit dans les règles du prompt. Résultat : un projet validé, noté 0,92 à l'évaluation automatique.",
        en: "In late July 2026, in the middle of my Nanodegree, AWS put the tool my first project was planned on into maintenance. I still had to deliver a support chatbot that sends each message to the right behaviour. Rather than patch the old approach, I rebuilt the project on AgentCore's managed harness, then brand new: all the routing lives in the prompt's rules. Result: an approved project, scored 0.92 in automated evaluation.",
      },
      proofs: [{ label: same("AWS 1"), proof: { label: "AWS 1", book: "aws-scholars", chapter: 1 } }],
    },
    {
      title: { fr: "Contribuer", en: "Giving back" },
      text: {
        fr: "Women In DeFi cherchait des mentors pour son programme Intro to Web3 Squad 4.0. J'ai postulé et j'ai animé une session d'1 h 30 pour un groupe d'environ 400 participantes : les bases de la blockchain, puis la confiance en soi dans les choix de carrière et la visibilité. Women In DeFi m'a remis un certificat d'appréciation. Pendant le bootcamp Dev3Pack, j'ai aussi signalé deux bugs du cours dans des issues publiques, avec leur cause et un correctif proposé. Et j'écris sur Dev.to ce que j'apprends en construisant.",
        en: "Women In DeFi was looking for mentors for its Intro to Web3 Squad 4.0 programme. I applied and led a 90-minute session for a group of about 400 participants: blockchain basics, then confidence in career choices and visibility. Women In DeFi gave me a certificate of appreciation. During the Dev3Pack bootcamp, I also reported two course bugs in public issues, with their cause and a proposed fix. And I write on Dev.to about what I learn while building.",
      },
      proofs: [
        { label: same("Women In DeFi"), proof: { label: "Women In DeFi", page: "about/#initiatives-title" } },
        { label: same("Issue #15"), proof: { label: "Issue #15", url: "https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/issues/15" } },
        { label: same("Issue #16"), proof: { label: "Issue #16", url: "https://github.com/Gecko-Academy/dev3pack-cohort-2026-09/issues/16" } },
        { label: same("Issue #12 (Gecko)"), proof: { label: "Issue #12", url: "https://github.com/Gecko-Academy/Dev3Pack-Gecko-Capstone-Project/issues/12" } },
        { label: same("Dev.to"), proof: { label: "Dev.to", url: "https://dev.to/mialy333" } },
      ],
    },
  ] as Strength[],
};

// 5. What inspires me.
export interface Inspiration {
  name: string;
  channel: string;
  url: string;
  text: L;
}

export const inspirations = {
  title: { fr: "Mes sources d'<em>inspiration</em>", en: "What <em>inspires</em> me" } as L,
  items: [
    {
      name: "Nick Saraev",
      channel: "YouTube",
      url: "https://www.youtube.com/@nicksaraev",
      text: {
        fr: "Pour ses explications claires sur le fonctionnement interne des agents IA. Il rend un point technique pédagogique, et même intéressant.",
        en: "For his clear explanations of how AI agents work inside. He makes a technical point easy to follow, and even interesting.",
      },
    },
    {
      name: "Marina Mogilko",
      channel: "Silicon Valley Girl",
      url: "https://www.youtube.com/@SiliconValleyGirl",
      text: {
        fr: "Je la suis depuis sept ans. J'apprécie son évolution, ses analyses et ses interventions au cœur de la Silicon Valley. C'est elle qui m'a confortée dans l'envie de me lancer dans la tech.",
        en: "I've followed her for seven years. I value how she has grown, her insights and her talks from inside Silicon Valley. She is the one who confirmed my wish to move into tech.",
      },
    },
  ] as Inspiration[],
};

// 3. My path in short: one line per period, internships left out.
// The full story is the "My path" book (shelf Path), still forthcoming.
export interface Period {
  years: string;
  title: L;
  text: L;
}

export const path = {
  title: { fr: "Mon parcours en <em>bref</em>", en: "My path in <em>short</em>" } as L,
  book: "my-path",
  bookLine: {
    fr: "L'histoire complète deviendra un livre de la bibliothèque :",
    en: "The full story will become a book in the library:",
  } as L,
  periods: [
    {
      years: "2012 – 2016",
      title: { fr: "Les débuts en finance", en: "Starting out in finance" },
      text: {
        fr: "Programme Grande École, majeure Finance, à Clermont School of Business (ex-ESC Clermont) en 2015, puis MBA Trading & Asset Management à l'ESLSCA Business School Paris en 2016. Premiers postes à Paris, chez Crédit Agricole CIB, puis à Tokyo, en conseil financier.",
        en: "Master in Management (Grande École programme), Finance major, at Clermont School of Business (formerly ESC Clermont) in 2015, then an MBA in Trading & Asset Management at ESLSCA Business School Paris in 2016. First roles in Paris, at Crédit Agricole CIB, then in Tokyo, in financial advisory.",
      },
    },
    {
      years: "2017 – 2020",
      title: { fr: "Luxembourg", en: "Luxembourg" },
      text: {
        fr: "Junior Client Portfolio Manager sur des fonds multi-actifs chez Candriam, puis commerciale institutionnelle chez Northern Trust.",
        en: "Junior Client Portfolio Manager on multi-asset funds at Candriam, then institutional sales at Northern Trust.",
      },
    },
    {
      years: "2019 – 2021",
      title: { fr: "Mon premier projet à moi", en: "My first venture" },
      text: {
        fr: "En parallèle, Mialy Ericka : de la stratégie de communication digitale pour des femmes entrepreneures.",
        en: "On the side, Mialy Ericka: digital communication strategy for women entrepreneurs.",
      },
    },
    {
      years: "2022 – 2023",
      title: { fr: "Paris", en: "Paris" },
      text: { fr: "Conseillère en gestion de patrimoine.", en: "Wealth management advisor." },
    },
    {
      years: "2024",
      title: { fr: "Je passe au code", en: "I switch to code" },
      text: {
        fr: "Formation de développeuse fullstack à Ada Tech School. Il me reste à valider le diplôme, en contrat de professionnalisation.",
        en: "Fullstack developer training at Ada Tech School. The diploma is still to be completed, through a work-study contract.",
      },
    },
    {
      years: "2025",
      title: { fr: "Le Web3", en: "Web3" },
      text: {
        fr: "Résidence Aquarium chez XRPL Commons, puis création de B-Wiize.",
        en: "Aquarium residency at XRPL Commons, then founding B-Wiize.",
      },
    },
    {
      years: "2026",
      title: { fr: "Du Web3 aux agents IA", en: "From Web3 to AI agents" },
      text: {
        fr: "J'entre dans l'écosystème Dev3Pack en janvier, avec un premier bootcamp pour apprendre Solidity, puis je suis SheFi (saison 15), un programme d'initiation à la DeFi. Ensuite viennent SafeHaven Money, une session de mentorat chez Women In DeFi, AWS AI & ML Scholars et, de ma propre initiative, le bootcamp AI Engineering de Dev3Pack.",
        en: "I join the Dev3Pack ecosystem in January, with a first bootcamp to learn Solidity, then follow SheFi (season 15), a DeFi education programme. Then come SafeHaven Money, a mentoring session at Women In DeFi, AWS AI & ML Scholars and, on my own initiative, Dev3Pack's AI Engineering bootcamp.",
      },
    },
  ] as Period[],
};

// 4. My initiatives: what I started or lead outside a job.
// Links and screenshots are optional: an initiative shows them only once they
// exist. Repos are linked; live apps behind a login are not, until the login is removed.
export interface Initiative {
  name: string;
  role: L;
  when: L;
  status?: L; // e.g. "on pause"
  text: L;
  links?: { label: L; url: string }[];
  image?: { src: ImageMetadata; alt: L }; // a screenshot in src/assets/initiatives/
}

export const initiatives = {
  title: { fr: "Mes <em>initiatives</em>", en: "My <em>initiatives</em>" } as L,
  items: [
    {
      name: "Dev3Pack",
      role: { fr: "Country Lead, chapitre France", en: "Country Lead, France chapter" },
      when: { fr: "depuis septembre 2026", en: "since September 2026" },
      text: {
        fr: "Je connais l'écosystème Dev3Pack de l'intérieur depuis janvier 2026. J'anime aujourd'hui sa communauté française : je recrute des participants et j'organise des événements. Un engagement que je mène à côté, parce qu'il me tient à cœur.",
        en: "I have known the Dev3Pack ecosystem from the inside since January 2026. Today I run its French community: I recruit participants and organise events. It's something I do alongside my work, because I care about it.",
      },
    },
    {
      name: "SafeHaven Money",
      role: { fr: "cofondatrice et CEO", en: "co-founder and CEO" },
      when: { fr: "depuis mai 2026", en: "since May 2026" },
      status: { fr: "en pause", en: "on pause" },
      text: {
        fr: "Une plateforme de stablecoins pilotée à la voix, pour les freelances et les entrepreneurs des pays où l'inflation ronge les revenus. Construite sur Solana, avec LI.FI.",
        en: "A voice-first stablecoin platform for freelancers and entrepreneurs in countries where inflation eats into their income. Built on Solana, with LI.FI.",
      },
      links: [{ label: { fr: "Code", en: "Code" }, url: "https://github.com/Mialy333/SafeHaven" }],
    },
    {
      name: "Women In DeFi",
      role: { fr: "mentore, Intro to Web3 Squad 4.0", en: "mentor, Intro to Web3 Squad 4.0" },
      when: { fr: "mai 2026", en: "May 2026" },
      text: {
        fr: "Une session d'1 h 30 pour un groupe d'environ 400 participantes : les bases de la blockchain, la confiance en soi dans les choix de carrière et la visibilité.",
        en: "A 90-minute session for a group of about 400 participants: blockchain basics, confidence in career choices, and visibility.",
      },
      image: {
        src: womenInDefiCertificate,
        alt: {
          fr: "Certificat d'appréciation Women In DeFi remis à Mialy Ratsimbazafy pour son mentorat dans le programme Intro to Web3 Squad 4.0, 30 mai 2026",
          en: "Women In DeFi certificate of appreciation given to Mialy Ratsimbazafy for her mentorship in the Intro to Web3 Squad 4.0 programme, May 30, 2026",
        },
      },
    },
    {
      name: "B-Wiize → Pop Wallet",
      role: { fr: "fondatrice", en: "founder" },
      when: { fr: "2025", en: "2025" },
      text: {
        fr: "Une application Web3 gamifiée pour apprendre aux étudiants à gérer leur budget, construite sur le XRP Ledger. Fin 2025, elle est devenue Pop Wallet, avec ses dix premiers utilisateurs.",
        en: "A gamified Web3 app that teaches students to manage their budget, built on the XRP Ledger. In late 2025 it became Pop Wallet, with its first ten users.",
      },
      links: [{ label: { fr: "Code de B-Wiize", en: "B-Wiize code" }, url: "https://github.com/Mialy333/B-Wiize_Tech" }],
    },
  ] as Initiative[],
};
