// Stack and certifications: one place for the About page and the book pages.
// Every proof points to where the tool was really used, as told by the runbooks
// (AWS projects 1-3, Dev3Pack). A tool without proof is shown without a link.
import type { Locale } from "../i18n/ui";
import { books, bookUrl, chapterUrl } from "./books";
import type { StackIcon } from "./stack-icons";
import udacityCertificate from "../assets/certs/udacity.jpg";
import dev3packCertificate from "../assets/certs/dev3pack.jpg";
import awsPractitionerCertificate from "../assets/certs/aws-ai-practitioner.jpg";

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
        // Honest detail: both apps were built with AI coding tools (Codex, Bolt.new).
        detail: {
          fr: "React Native et web, avec l'aide d'outils d'IA",
          en: "React Native and web, built with AI coding tools",
        },
        proofs: [
          { label: "SafeHaven Money", url: "https://github.com/Mialy333/SafeHaven/tree/main/app" },
          { label: "B-Wiize", url: "https://github.com/Mialy333/B-Wiize_Tech" },
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
];

// A programme and the certificates it gave, in the order they were earned.
// AWS AI & ML Scholars has two stages: the open challenge, then the Nanodegree
// for those selected. Dev3Pack has one. Every text here comes from Mialy
// (programme figures) or the runbooks (scores, dates).
export interface CertStage {
  title: string;
  kind: L;
  date: L;
  about: L; // one or two sentences: what this certificate stands for
  verify: { label: L; url: string };
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
