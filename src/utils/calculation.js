/**
 * Utilitas Matematika & Format
 */
export const angka = (n, digit = 4) =>
  new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: digit,
    maximumFractionDigits: digit,
  }).format(n);

export const bertanda = (n) =>
  (n > 0 ? "+" : n < 0 ? "−" : "") + angka(Math.abs(n));

export const sigmoid = (x) => 1 / (1 + Math.exp(-x));

export const logit = (p) => Math.log(p / (1 - p));
