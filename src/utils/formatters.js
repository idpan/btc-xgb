export function formatUSD(value) {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return (
    "$" + Number(value).toLocaleString("id-ID", { maximumFractionDigits: 0 })
  );
}

export function formatCountdown(totalSeconds) {
  const s = Math.max(0, totalSeconds);
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  return `${h}:${m}`;
}

export function pointsToString(points) {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}
