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
