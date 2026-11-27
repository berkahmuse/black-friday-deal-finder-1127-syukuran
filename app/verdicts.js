// Verdicts and money maths for DealLens. Every percentage and saving shown
// on the site is computed here from the deal's own sale and usual prices,
// so the numbers on a card always add up.

export const VERDICTS = {
  "new-low": { label: "NEW LOW", rank: 0, blurb: "Lowest price tracked" },
  strong: { label: "STRONG DEAL", rank: 1, blurb: "A real cut, worth buying" },
  fair: { label: "FAIR DEAL", rank: 2, blurb: "Genuine cut, but small or seen before" },
  routine: { label: "ROUTINE SALE", rank: 3, blurb: "Barely a deal — buy only if you need it" },
};

export function saving(deal) {
  return Math.round((deal.usual - deal.sale) * 100) / 100;
}

export function pctOff(deal) {
  return Math.round((1 - deal.sale / deal.usual) * 100);
}

export function money(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function moneyShort(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

// Best first: verdict rank, then biggest % off, then biggest $ saving.
export function bestFirst(a, b) {
  const r = VERDICTS[a.verdict].rank - VERDICTS[b.verdict].rank;
  if (r !== 0) return r;
  const p = pctOff(b) - pctOff(a);
  if (p !== 0) return p;
  return saving(b) - saving(a);
}

export function sortDeals(list, sort) {
  const out = [...list];
  if (sort === "pct") out.sort((a, b) => pctOff(b) - pctOff(a) || saving(b) - saving(a));
  else if (sort === "saved") out.sort((a, b) => saving(b) - saving(a));
  else if (sort === "price-asc") out.sort((a, b) => a.sale - b.sale);
  else if (sort === "price-desc") out.sort((a, b) => b.sale - a.sale);
  else out.sort(bestFirst);
  return out;
}

export function totals(list) {
  const totalSaved = list.reduce((s, d) => s + saving(d), 0);
  const newLows = list.filter((d) => d.verdict === "new-low").length;
  const strong = list.filter((d) => d.verdict === "strong").length;
  const medianPct = [...list].map(pctOff).sort((a, b) => a - b)[Math.floor(list.length / 2)];
  return { count: list.length, totalSaved, newLows, strong, medianPct };
}
