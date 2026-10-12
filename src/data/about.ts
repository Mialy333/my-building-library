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
