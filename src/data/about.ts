// The About page text, written by Mialy, section by section.
// FR is hers; EN is Claude's translation, to be validated by Mialy.
// Sections not written yet simply are not listed: the page shows "coming soon".
import type { Locale } from "../i18n/ui";

type L = Record<Locale, string>;

export interface Fact {
  label: L;
  value: L;
}

// 1. What I'm looking for: one short paragraph, then a quick-scan card for recruiters.
export const lookingFor = {
  title: { fr: "Ce que je <em>cherche</em>", en: "What I'm <em>looking for</em>" } as L,
  text: {
    fr: "Je cherche un poste d'<strong>ingénieure IA</strong>, idéalement dans la <strong>finance et les actifs numériques</strong> : dans une fintech, dans l'équipe R&D d'un acteur financier, ou dans un cabinet de conseil tech qui les accompagne. J'y apporte deux langages rarement réunis : celui des agents IA, que j'apprends en construisant, et celui de la gestion d'actifs, que je pratique depuis dix ans.",
    en: "I'm looking for an <strong>AI engineer</strong> role, ideally in <strong>finance and digital assets</strong>: at a fintech, in the R&D team of a financial firm, or at a tech consultancy that serves them. I bring two languages that rarely meet: AI agents, which I learn by building, and asset management, which I've practised for ten years.",
  } as L,
  facts: [
    { label: { fr: "Poste", en: "Role" }, value: { fr: "Ingénieure IA · AI Agent Engineer", en: "AI Engineer · AI Agent Engineer" } },
    { label: { fr: "Secteurs", en: "Sectors" }, value: { fr: "Finance, actifs numériques", en: "Finance, digital assets" } },
    {
      label: { fr: "Où", en: "Where" },
      value: {
        fr: "Paris et Île-de-France, télétravail, ou relocalisation à l'étranger (Suisse, États-Unis…)",
        en: "Paris area, remote, or relocation abroad (Switzerland, United States…)",
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
