// Stack and certifications: one place for the About page and the book pages.
// Every proof points to where the tool was really used, as told by the runbooks
// (AWS projects 1-3, Dev3Pack). A tool without proof is shown without a link.
import type { Locale } from "../i18n/ui";
import { books, bookUrl, chapterUrl } from "./books";
import type { StackIcon } from "./stack-icons";
import udacityCertificate from "../assets/certs/udacity.jpg";
import dev3packCertificate from "../assets/certs/dev3pack.jpg";
import awsPractitionerCertificate from "../assets/certs/aws-ai-practitioner.jpg";
import shefiCertificate from "../assets/certs/shefi.jpg";
import cyfrinBlockchain from "../assets/certs/cyfrin-blockchain.jpg";
import cyfrinSolidity from "../assets/certs/cyfrin-solidity.jpg";
import cyfrinFoundry from "../assets/certs/cyfrin-foundry.jpg";

type L = Record<Locale, string>;

// A proof: a chapter of a book on this site, a page of this site (path after
// the language, e.g. "books/baa-101/glossary/"), or an outside page (a repo).
export type Proof =
  | { label: string; book: string; chapter?: number }
  | { label: string; page: string }
  | { label: string; url: string };

export interface StackItem {
  name: string;
  icon: StackIcon; // see stack-icons.ts
  detail?: L; // what exactly was used, in a few words
  proofs: Proof[];
}

export interface StackGroup {
  title: L;
  icon?: StackIcon;
  items: StackItem[];
}

const aws = (n: number): Proof => ({ label: `AWS ${n}`, book: "aws-scholars", chapter: n });
const d3p = (n: number, label: string): Proof => ({ label, book: "dev3pack", chapter: n });

export const stack: StackGroup[] = [
  {
    title: { fr: "Langages", en: "Languages" },
    items: [
      { name: "Python", icon: "brand-python", proofs: [aws(1), aws(2), aws(3), { label: "Dev3Pack", book: "dev3pack" }] },
      {
        name: "TypeScript", icon: "brand-typescript",
        detail: { fr: "ce site (Astro)", en: "this site (Astro)" },
        proofs: [{ label: "GitHub", url: "https://github.com/Mialy333/my-building-library" }],
      },
      {
        name: "JavaScript", icon: "brand-javascript",
        detail: { fr: "front NovaMart (Cognito)", en: "NovaMart front end (Cognito)" },
        proofs: [{ label: "GitHub", url: "https://github.com/Mialy333/novamart-multi-agent-support" }],
      },
      {
        name: "React", icon: "brand-react",
        // Honest detail: these apps were built with the help of AI coding tools (Codex, Bolt.new).
        detail: {
          fr: "React Native et web, avec l'aide d'outils d'IA",
          en: "React Native and web, built with AI coding tools",
        },
        proofs: [
          { label: "SafeHaven Money", url: "https://github.com/Mialy333/SafeHaven/tree/main/app" },
          { label: "B-Wiize", url: "https://github.com/Mialy333/B-Wiize_Tech" },
          { label: "DeFi PulseX", url: "https://github.com/Mialy333/DeFi-PulseX" },
        ],
      },
    ],
  },
  {
    title: { fr: "AWS", en: "AWS" },
    icon: "brand-aws",
    items: [
      {
        name: "Amazon Bedrock AgentCore", icon: "cloud-computing",
        detail: { fr: "Runtime, Gateway, Memory", en: "Runtime, Gateway, Memory" },
        proofs: [aws(1), aws(2), aws(3)],
      },
      { name: "Bedrock Knowledge Bases", icon: "books", detail: { fr: "RAG, S3 Vectors", en: "RAG, S3 Vectors" }, proofs: [aws(2), aws(3)] },
      { name: "Bedrock Guardrails", icon: "shield-check", proofs: [aws(3)] },
      { name: "Bedrock Evaluations", icon: "ruler-measure", detail: { fr: "LLM-as-judge", en: "LLM-as-judge" }, proofs: [aws(1)] },
      { name: "AWS Lambda", icon: "lambda", proofs: [aws(1), aws(2), aws(3)] },
      { name: "Amazon API Gateway", icon: "api", proofs: [aws(2)] },
      { name: "Amazon DynamoDB", icon: "database", proofs: [aws(1), aws(3)] },
      { name: "Amazon S3", icon: "bucket", proofs: [aws(1), aws(2), aws(3)] },
      { name: "AWS CloudFormation", icon: "stack-2", proofs: [aws(1), aws(3)] },
      { name: "CloudWatch & X-Ray", icon: "chart-dots-3", detail: { fr: "logs et traces", en: "logs and traces" }, proofs: [aws(3)] },
      { name: "Amazon Cognito", icon: "user-shield", proofs: [aws(3)] },
    ],
  },
  {
    title: { fr: "Agents", en: "Agents" },
    items: [
      { name: "Strands Agents", icon: "robot", proofs: [aws(2), aws(3)] },
      { name: "MCP", icon: "plug", proofs: [aws(1), aws(2), d3p(12, "Dev3Pack S12"), d3p(13, "S13"), d3p(17, "Gecko")] },
      { name: "Ollama", icon: "cpu", detail: { fr: "modèles locaux", en: "local models" }, proofs: [d3p(2, "Dev3Pack S2"), d3p(16, "Final")] },
    ],
  },
  {
    title: { fr: "Blockchain & DeFi", en: "Blockchain & DeFi" },
    items: [
      {
        name: "Solana", icon: "currency-solana",
        detail: { fr: "un agent qui achète on-chain", en: "an agent that buys on-chain" },
        proofs: [d3p(17, "Gecko"), { label: "SafeHaven Money", url: "https://github.com/Mialy333/SafeHaven" }],
      },
      {
        name: "XRP Ledger", icon: "currency-xrp",
        detail: { fr: "résidence XRPL Commons", en: "XRPL Commons residency" },
        proofs: [
          { label: "B-Wiize", url: "https://github.com/Mialy333/B-Wiize_Tech" },
          { label: "Demo Day", url: "https://www.youtube.com/watch?v=wKpopgjP5Fc" },
          { label: "LinkedIn", url: "https://www.linkedin.com/posts/mialyratsimbazafy75_hi-everyone-heres-a-recap-of-my-experience-share-7325571310082842624-Sscv/" },
        ],
      },
      {
        name: "DeFi", icon: "coins",
        // Hackathon prototypes, left unfinished: said plainly in the detail.
        detail: { fr: "SheFi, puis des prototypes de hackathon, inachevés", en: "SheFi, then hackathon prototypes, unfinished" },
        proofs: [
          { label: "SheFi", page: "about/#cert-title" },
          { label: "DeFi PulseX", url: "https://github.com/Mialy333/DeFi-PulseX" },
          { label: "Alpha Whispr", url: "https://farhack2026.vercel.app" },
          { label: "ENS SplitBook", url: "https://ens-splitbook.vercel.app" },
        ],
      },
      {
        name: "Solidity", icon: "currency-ethereum",
        detail: { fr: "premiers contrats", en: "first contracts" },
        proofs: [
          { label: "Cyfrin", page: "about/#cert-title" },
          { label: "GitHub", url: "https://github.com/Mialy333/30-days-of-solidity-submissions/tree/main/submissions/Mialy333" },
        ],
      },
      {
        name: "Foundry", icon: "hammer",
        proofs: [{ label: "Cyfrin", page: "about/#cert-title" }],
      },
    ],
  },
];

// A programme and the certificates it gave, in the order they were earned.
// AWS AI & ML Scholars has two stages: the open challenge, then the Nanodegree
// for those selected. Dev3Pack has one. Every text here comes from Mialy
// (programme figures) or the runbooks (scores, dates).
export interface CertStage {
  title: string;
  kind: L;
  date?: L; // shown when known
  about: L; // one or two sentences: what this certificate stands for
  verify?: { label: L; url: string }; // official verification page, when one exists
  extra?: { label: L; url: string }; // a second official proof
  image: ImageMetadata; // picture of the certificate, shown as a thumbnail
  imageAlt: L;
  id?: string;
}

export interface Certification {
  title: string;
  issuer: string;
  about?: L; // the programme in one sentence, when it has several stages
  source?: { label: L; url: string }; // official page of the programme
  book?: string; // the book that tells this programme, when there is one
  stages: CertStage[];
}

const verify = (url: string) => ({ label: { fr: "Vérifier", en: "Verify" }, url });

export const certifications: Certification[] = [
  {
    title: "AWS AI & ML Scholars",
    issuer: "Udacity · AWS",
    about: {
      fr: "Un programme en deux étapes : un challenge ouvert à tous, puis un Nanodegree pour les mieux classés.",
      en: "A two-stage programme: a challenge open to all, then a Nanodegree for the top performers.",
    },
    // Figures (100,000 learners, top 4,500, dates) checked on AWS's official page.
    source: {
      label: { fr: "Le programme sur le site d'AWS", en: "The programme on AWS's website" },
      url: "https://aws.amazon.com/about-aws/our-impact/scholars/",
    },
    book: "aws-scholars",
    stages: [
      {
        // A Udacity course certificate, not the AWS Certified AI Practitioner exam:
        // the label says "course certificate" so the two are never confused.
        title: "AWS AI Practitioner Challenge",
        kind: { fr: "Certificat de cours", en: "Course certificate" },
        date: { fr: "13 juin 2026", en: "June 13, 2026" },
        about: {
          fr: "De mars à juin 2026, nous étions 100 000 à relever le challenge, avec deux projets à rendre.",
          en: "From March to June 2026, 100,000 of us took on the challenge, with two projects to complete.",
        },
        verify: verify("https://www.udacity.com/certificate/e/6312df26-3d77-11f1-a28a-cba2c0c47bf3"),
        image: awsPractitionerCertificate,
        imageAlt: {
          fr: "Certificat de cours Udacity AWS AI Practitioner Challenge, décerné à Mialy Ratsimbazafy le 13 juin 2026",
          en: "Udacity AWS AI Practitioner Challenge course certificate, awarded to Mialy Ratsimbazafy on June 13, 2026",
        },
      },
      {
        title: "Future AWS Agent Engineer",
        kind: { fr: "Nanodegree", en: "Nanodegree" },
        date: { fr: "6 octobre 2026", en: "October 6, 2026" },
        about: {
          fr: "Les 4 500 meilleurs du challenge ont été sélectionnés pour ce Nanodegree. Je suis allée jusqu'au bout : trois projets validés par le mentor Udacity.",
          en: "The top 4,500 from the challenge were selected for this Nanodegree. I saw it through: three projects approved by the Udacity mentor.",
        },
        verify: verify("https://www.udacity.com/certificate/e/c2ce036c-900d-11f1-adc8-3f80681b4872"),
        image: udacityCertificate,
        imageAlt: {
          fr: "Certificat Udacity Future AWS Agent Engineer, décerné à Mialy Ratsimbazafy le 6 octobre 2026",
          en: "Udacity Future AWS Agent Engineer certificate, awarded to Mialy Ratsimbazafy on October 6, 2026",
        },
      },
    ],
  },
  {
    title: "AI Engineering Bootcamp",
    issuer: "Dev3Pack",
    book: "dev3pack",
    stages: [
      {
        title: "AI Engineering Bootcamp",
        kind: { fr: "Certificat de fin de parcours", en: "Certificate of completion" },
        date: { fr: "octobre 2026", en: "October 2026" },
        about: {
          fr: "Trois semaines (14 septembre → 2 octobre 2026) pour construire un agent de recherche ancré dans ses sources. Parcours noté 5 100/5 100, final assignment 15/15, Gecko capstone rendu et défendu à l'oral.",
          en: "Three weeks (September 14 → October 2, 2026) to build a source-grounded research agent. Graded track 5,100/5,100, final assignment 15/15, Gecko capstone delivered and defended orally.",
        },
        id: "0MEIAR4GV9KF",
        verify: verify("https://app.dev3pack.xyz/api/bootcamp-cert?certificateId=0meiar4gv9kf&v=4"),
        extra: {
          label: { fr: "Résultat 15/15", en: "15/15 result" },
          url: "https://github.com/Gecko-Academy/dev3pack-submissions/blob/main/finals/Mialy333/result.json",
        },
        image: dev3packCertificate,
        imageAlt: {
          fr: "Certificat de fin de parcours Dev3Pack AI Engineering Bootcamp, délivré à Mialy, ID 0MEIAR4GV9KF",
          en: "Dev3Pack AI Engineering Bootcamp certificate of completion, issued to Mialy, ID 0MEIAR4GV9KF",
        },
      },
    ],
  },
  {
    title: "Cyfrin Updraft",
    issuer: "Cyfrin",
    about: {
      fr: "Trois cours de développement blockchain, du fonctionnement d'une blockchain jusqu'aux outils de test des smart contracts.",
      en: "Three blockchain development courses, from how a blockchain works to the tools that test smart contracts.",
    },
    stages: [
      {
        title: "Blockchain Basics",
        kind: { fr: "Badge de cours", en: "Course badge" },
        about: { fr: "Comment fonctionne une blockchain : blocs, transactions, portefeuilles, smart contracts.", en: "How a blockchain works: blocks, transactions, wallets, smart contracts." },
        verify: verify("https://profiles.cyfrin.io/u/mialy333/achievements/blockchain-basics"),
        image: cyfrinBlockchain,
        imageAlt: { fr: "Badge Cyfrin Updraft « Blockchain Course »", en: "Cyfrin Updraft \"Blockchain Course\" badge" },
      },
      {
        title: "Solidity 101",
        kind: { fr: "Badge de cours", en: "Course badge" },
        about: { fr: "Écrire ses premiers smart contracts en Solidity.", en: "Writing first smart contracts in Solidity." },
        verify: verify("https://profiles.cyfrin.io/u/mialy333/achievements/solidity"),
        image: cyfrinSolidity,
        imageAlt: { fr: "Badge Cyfrin Updraft « Solidity 101 Course »", en: "Cyfrin Updraft \"Solidity 101 Course\" badge" },
      },
      {
        title: "Foundry 101",
        kind: { fr: "Badge de cours", en: "Course badge" },
        about: { fr: "Tester et déployer des smart contracts avec Foundry.", en: "Testing and deploying smart contracts with Foundry." },
        verify: verify("https://profiles.cyfrin.io/u/mialy333/achievements/foundry"),
        image: cyfrinFoundry,
        imageAlt: { fr: "Badge Cyfrin Updraft « Foundry 101 Course »", en: "Cyfrin Updraft \"Foundry 101 Course\" badge" },
      },
    ],
  },
  {
    title: "SheFi Season 15",
    issuer: "SheFi",
    stages: [
      {
        // No public verification page: the certificate is shown, without a "Verify" link.
        title: "SheFi Season 15",
        kind: { fr: "Certificat de fin de programme", en: "Certificate of completion" },
        date: { fr: "2 février 2026", en: "February 2, 2026" },
        about: {
          fr: "Un programme d'éducation à la DeFi et au Web3, suivi en début d'année, avant de passer aux agents IA.",
          en: "A DeFi and Web3 education programme, taken early in the year, before moving on to AI agents.",
        },
        image: shefiCertificate,
        imageAlt: {
          fr: "Certificat de fin de programme SheFi, saison 15, délivré à Mialy Ratsimbazafy le 2 février 2026",
          en: "SheFi season 15 certificate of completion, issued to Mialy Ratsimbazafy on February 2, 2026",
        },
      },
    ],
  },
];

// Turns a proof into a link for the current language.
export function proofHref(proof: Proof, locale: Locale): string | null {
  if ("url" in proof) return proof.url;
  if ("page" in proof) return `/${locale}/${proof.page}`;
  const book = books.find((b) => b.slug === proof.book);
  if (!book) return null;
  if (proof.chapter === undefined) return bookUrl(locale, book);
  const chapter = book.chapters.find((c) => c.number === proof.chapter);
  return chapter?.published ? chapterUrl(locale, book, chapter) : null;
}

// The certificate a book page shows: the last one its programme gave.
export const certificationOf = (bookSlug: string): CertStage | undefined =>
  certifications.find((c) => c.book === bookSlug)?.stages.at(-1);
