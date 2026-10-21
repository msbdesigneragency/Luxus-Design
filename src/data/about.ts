import type { Locale } from "@/lib/i18n";

export const about: Record<Locale, { title: string; items: { title: string; text: string }[] }> = {
  fr: {
    title: "Notre vision de l’intérieur",
    items: [
      { title: "Des espaces à vivre", text: "Un intérieur se pense autour de celles et ceux qui l’habitent : leurs habitudes, leurs envies et leur façon de recevoir." },
      { title: "L’harmonie des matières", text: "Mobilier, tissus, couleurs et lumière se répondent pour composer un ensemble cohérent, chaleureux et personnel." },
      { title: "Le sens du détail", text: "Les proportions, les textures et les finitions donnent à chaque espace son caractère, sans perdre de vue le confort au quotidien." },
    ],
  },
  en: {
    title: "Our approach to interiors",
    items: [
      { title: "Spaces for living", text: "An interior begins with the people who live in it: their routines, their wishes and the way they welcome others." },
      { title: "Materials in harmony", text: "Furniture, fabrics, colour and light work together to create a coherent, warm and personal interior." },
      { title: "Attention to detail", text: "Proportions, textures and finishes give each space its character, with everyday comfort always in mind." },
    ],
  },
  ar: {
    title: "رؤيتنا للتصميم الداخلي",
    items: [
      { title: "مساحات للحياة", text: "يبدأ تصميم الداخل بمن يسكنه: عاداتهم ورغباتهم وطريقتهم في استقبال الضيوف." },
      { title: "تناغم الخامات", text: "يتكامل الأثاث مع الأقمشة والألوان والإضاءة لتكوين فضاء متناسق ودافئ يعكس شخصيتكم." },
      { title: "العناية بالتفاصيل", text: "تمنح النسب والملمس والتشطيبات كل مساحة طابعها الخاص مع الاهتمام بالراحة اليومية." },
    ],
  },
};
