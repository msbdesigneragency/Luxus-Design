import type { Locale } from "@/lib/i18n";

// Transcribed from the supplied approved reference. Keep the disclosure visible
// until the business confirms these figures and reviews are genuine.
export const referenceContent: Record<Locale, {
  statisticsLabel: string;
  statisticsNote: string;
  reviewNote: string;
  previous: string;
  next: string;
  stars: string;
  statisticLabels: string[];
  reviews: { text: string; attribution: string }[];
}> = {
  fr: {
    statisticsLabel: "LUXUS DESIGN en chiffres",
    statisticsNote: "Chiffres présentés dans la maquette — à confirmer.",
    reviewNote: "Avis présentés dans la maquette — authenticité à confirmer.",
    previous: "Avis précédents",
    next: "Avis suivants",
    stars: "5 étoiles sur 5",
    statisticLabels: ["Années d’expérience", "Projets réalisés", "Clients satisfaits", "Partout au Maroc"],
    reviews: [
      { text: "Un travail remarquable, équipe professionnelle et à l’écoute. Le salon est encore plus beau que ce que j’imaginais.", attribution: "Client, Casablanca" },
      { text: "Très bonne qualité et finition impeccable. Livraison et installation dans les délais. Je recommande !", attribution: "Client, Rabat" },
      { text: "Service au top, du choix dans les tissus et un rendu magnifique. Merci Luxus Design !", attribution: "Client, Marrakech" },
    ],
  },
  en: {
    statisticsLabel: "LUXUS DESIGN in figures",
    statisticsNote: "Figures shown in the design reference — awaiting confirmation.",
    reviewNote: "Reviews shown in the design reference — authenticity awaiting confirmation.",
    previous: "Previous reviews",
    next: "Next reviews",
    stars: "5 out of 5 stars",
    statisticLabels: ["Years of experience", "Completed projects", "Satisfied clients", "Across Morocco"],
    reviews: [
      { text: "Remarkable work, a professional team that really listens. The living room is even more beautiful than I imagined.", attribution: "Client, Casablanca" },
      { text: "Excellent quality and impeccable finishes. Delivery and installation on time. Highly recommended!", attribution: "Client, Rabat" },
      { text: "Great service, a wide choice of fabrics and a beautiful result. Thank you, Luxus Design!", attribution: "Client, Marrakech" },
    ],
  },
  ar: {
    statisticsLabel: "لوكسوس ديزاين بالأرقام",
    statisticsNote: "أرقام واردة في التصميم المرجعي — في انتظار التأكيد.",
    reviewNote: "آراء واردة في التصميم المرجعي — صحتها في انتظار التأكيد.",
    previous: "الآراء السابقة",
    next: "الآراء التالية",
    stars: "5 نجوم من 5",
    statisticLabels: ["سنوات من الخبرة", "مشاريع منجزة", "عملاء راضون", "في جميع أنحاء المغرب"],
    reviews: [
      { text: "عمل رائع وفريق محترف وحسن الاستماع. الصالون أجمل مما كنت أتخيل.", attribution: "عميل، الدار البيضاء" },
      { text: "جودة ممتازة وتشطيبات متقنة. التوصيل والتركيب في الموعد. أنصح بهم!", attribution: "عميل، الرباط" },
      { text: "خدمة ممتازة وخيارات متعددة من الأقمشة ونتيجة رائعة. شكراً لوكسوس ديزاين!", attribution: "عميل، مراكش" },
    ],
  },
};
