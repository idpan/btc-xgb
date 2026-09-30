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

/**
 * Generator Data Pohon Dummy (Deterministik)
 */
export function buatPohonDummy(jumlah = 100) {
  let seed = 7;
  const acak = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  return Array.from({ length: jumlah }, (_, i) => ({
    id: i + 1,
    leafId: Math.floor(acak() * 16),
    leafScore: (acak() - 0.47) * 0.36 * (1 - i / (jumlah * 1.4)),
  }));
}
