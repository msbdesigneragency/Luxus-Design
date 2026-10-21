const base = "http://127.0.0.1:3001";
const slugs = [
  "salon-signature",
  "salon-harmonie",
  "salon-lignes-douces",
  "salon-ecru",
  "salon-modulaire",
  "salon-mineral",
  "salon-ivoire",
  "chambre-velours",
  "lit-coffre",
  "salon-bleu",
  "salon-confort",
];
const paths = [
  "",
  "salons",
  "sur-mesure",
  "realisations",
  "a-propos",
  "contact",
  "confidentialite",
  "mentions-legales",
  "services",
  "services/papier-peint",
  "services/tissus-couleurs",
  "services/eclairage",
  ...slugs.map((s) => "realisations/" + s),
];
let count = 0;
const failures = [];
for (const locale of ["fr", "en", "ar"])
  for (const path of paths) {
    const response = await fetch(`${base}/${locale}/${path}`);
    const text = await response.text();
    if (response.status !== 200) failures.push([locale, path, response.status]);
    if (!text.includes(`lang="${locale}"`))
      failures.push([locale, path, "incorrect lang"]);
    if (locale === "ar" && !text.includes('dir="rtl"'))
      failures.push([locale, path, "missing RTL"]);
    count++;
  }
for (const path of ["/fr/inconnue", "/xx", "/fr/realisations/inconnu"]) {
  const response = await fetch(base + path);
  if (response.status !== 404)
    failures.push([path, "expected 404", response.status]);
}
const quote = {
  name: "Test local",
  phone: "+212600000000",
  city: "Ville test",
  type: "0",
  service: "0",
  dimensions: "3m",
  details: "Vérification locale du formulaire.",
  consent: true,
  locale: "fr",
  website: "",
};
for (const [body, expected] of [
  [{}, 400],
  [quote, 503],
  [{ ...quote, phone: "invalid" }, 400],
  [{ ...quote, consent: false }, 400],
  [{ ...quote, website: "spam" }, 400],
]) {
  const response = await fetch(base + "/api/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (response.status !== expected)
    failures.push(["quote", expected, response.status]);
}
const cross = await fetch(base + "/api/quote", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Origin: "https://invalid.example",
  },
  body: JSON.stringify(quote),
});
if (cross.status !== 403) failures.push(["cross-origin", cross.status]);
console.log(
  JSON.stringify(
    { pagesChecked: count, apiChecks: 6, invalidRouteChecks: 3, failures },
    null,
    2,
  ),
);
if (failures.length) process.exitCode = 1;
