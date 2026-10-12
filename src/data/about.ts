// The About page text, written by Mialy, section by section.
// FR is hers; EN is Claude's translation, to be validated by Mialy.
// Sections not written yet simply are not listed: the page shows "coming soon".
import type { Locale } from "../i18n/ui";
import type { Proof } from "./credentials";

type L = Record<Locale, string>;

export interface Fact {
  label: L;
  value: L;
}

// 1. What I'm looking for: one short paragraph, then a quick-scan card for recruiters.
export const lookingFor = {
  title: { fr: "Ce que je <em>cherche</em>", en: "What I'm <em>looking for</em>" } as L,
  text: {
    fr: "Je cherche à rejoindre une équipe qui construit des <strong>agents et assistants IA</strong>, en <strong>alternance</strong> pour aller au bout de ma formation à Ada Tech School, ou en CDI. La finance et les actifs numériques me sont familiers, mais ce qui m'attire avant tout, ce sont les projets où la fiabilité compte : un assistant qui cite ses sources, ou qui sait dire qu'il ne sait pas. J'y apporte deux langages rarement réunis : celui des agents IA, que j'apprends en construisant, et celui de la gestion d'actifs, que je pratique depuis dix ans.",
    en: "I'm looking to join a team that builds <strong>AI agents and assistants</strong>, as a <strong>work-study apprentice</strong> to complete my training at Ada Tech School, or on a permanent contract. Finance and digital assets are familiar ground, but what draws me most are projects where reliability matters: an assistant that cites its sources, or knows to say it doesn't know. I bring two languages that rarely meet: AI agents, which I learn by building, and asset management, which I've practised for ten years.",
  } as L,
  facts: [
    { label: { fr: "Poste", en: "Role" }, value: { fr: "Ingénieure IA · Développeuse d'agents IA", en: "AI Engineer · AI agent developer" } },
    {
      label: { fr: "Contrat", en: "Contract" },
      value: { fr: "Alternance (formation Ada Tech School) ou CDI", en: "Work-study (Ada Tech School training) or permanent contract" },
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
  items: [
    {
      title: { fr: "Je construis des agents IA complets.", en: "I build complete AI agents." },
      text: {
        fr: "Outils, recherche dans des documents, garde-fous, suivi de chaque étape, et des tests pour vérifier que tout marche. Mon chatbot de support sur AWS a obtenu 0,92 à l'évaluation automatique. Mon agent de recherche Dev3Pack a eu 15/15 sur des questions qu'il n'avait jamais vues.",
        en: "Tools, document search, guardrails, tracing every step, and tests to check that it all works. My support chatbot on AWS scored 0.92 in automated evaluation. My Dev3Pack research agent got 15/15 on questions it had never seen.",
      },
      proofs: [
        { label: same("AWS 1"), proof: { label: "AWS 1", book: "aws-scholars", chapter: 1 } },
        { label: same("Dev3Pack Final"), proof: { label: "Dev3Pack Final", book: "dev3pack", chapter: 16 } },
      ],
    },
    {
      title: { fr: "J'explique simplement ce qui est compliqué.", en: "I explain complicated things simply." },
      text: {
        fr: "En gestion d'actifs, je traduisais les stratégies des gérants et des quants pour les clients. Je fais la même chose avec l'IA, et c'est tout le but de BAA 101 et de son glossaire.",
        en: "In asset management, I translated the strategies of portfolio managers and quants for clients. I do the same with AI, and that is the whole point of BAA 101 and its glossary.",
      },
      proofs: [
        { label: same("BAA 101"), proof: { label: "BAA 101", book: "baa-101" } },
        { label: { fr: "Glossaire", en: "Glossary" }, proof: { label: "Glossary", page: "books/baa-101/glossary/" } },
      ],
    },
    {
      title: { fr: "Je vérifie avant d'affirmer.", en: "I check before I claim." },
      text: {
        fr: "Pendant Dev3Pack, j'avais estimé la vitesse de mon modèle. Je me trompais : j'ai mesuré, et c'est la mesure qui a tranché. Quand un test n'avait pas tourné, je l'ai dit au lieu de donner un chiffre au hasard.",
        en: "During Dev3Pack, I had estimated how fast my model was. I was wrong: I measured, and the measurement settled it. When a test hadn't run, I said so instead of giving a made-up number.",
      },
      proofs: [
        { label: same("Dev3Pack S2"), proof: { label: "Dev3Pack S2", book: "dev3pack", chapter: 2 } },
        { label: same("S8"), proof: { label: "S8", book: "dev3pack", chapter: 8 } },
      ],
    },
    {
      title: { fr: "Je suis là pour l'équipe.", en: "I show up for the team." },
      text: {
        fr: "Pendant le Nanodegree, j'ai répondu aux questions d'autres étudiants sur le forum Udacity. En hackathon, sur SafeHaven Money, l'ordinateur de ma coéquipière a lâché : j'ai dû tout reprendre, et j'ai terminé l'application avec Codex.",
        en: "During the Nanodegree, I answered other students' questions on the Udacity forum. At a hackathon, while building SafeHaven Money, my teammate's computer gave out: I had to take everything over, and I finished the app with Codex.",
      },
      proofs: [],
    },
    {
      title: { fr: "Mon expertise en finance.", en: "My expertise in finance." },
      text: {
        fr: "Une école de commerce majeure Finance, un MBA Trading & Asset Management, puis dix ans en gestion d'actifs, notamment chez Crédit Agricole CIB, Candriam et Northern Trust. Je sais ce que les équipes financières attendent d'un outil : des chiffres justes, et une explication pour chacun.",
        en: "A business school degree with a Finance major, an MBA in Trading & Asset Management, then ten years in asset management, including at Crédit Agricole CIB, Candriam and Northern Trust. I know what finance teams expect from a tool: accurate numbers, and an explanation for each one.",
      },
      proofs: [],
    },
  ] as Strength[],
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
        fr: "Formation de développeuse fullstack à Ada Tech School. Il me reste à valider le diplôme, en alternance.",
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
      title: { fr: "Les agents IA", en: "AI agents" },
      text: {
        fr: "AWS & AI Scholars, le bootcamp Dev3Pack, et SafeHaven Money.",
        en: "AWS & AI Scholars, the Dev3Pack bootcamp, and SafeHaven Money.",
      },
    },
  ] as Period[],
};
