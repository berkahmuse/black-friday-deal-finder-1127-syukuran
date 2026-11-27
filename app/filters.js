// Filter state for DealLens. The state lives in the URL (query string plus
// hash route) so a filtered view is shareable and the screenshots of a
// filtered board are a real state of the site, not a mock.

import { DEALS } from "./deals.js";
import { pctOff } from "./verdicts.js";

export const DEFAULTS = { q: "", category: "all", store: "all", minPct: 0, verdict: "all", sort: "best" };

export function readState() {
  const p = new URLSearchParams(location.search);
  return {
    q: p.get("q") || "",
    category: p.get("category") || "all",
    store: p.get("store") || "all",
    minPct: Number(p.get("min") || 0),
    verdict: p.get("verdict") || "all",
    sort: p.get("sort") || "best",
  };
}

export function stateToQuery(state) {
  const p = new URLSearchParams();
  if (state.q) p.set("q", state.q);
  if (state.category !== "all") p.set("category", state.category);
  if (state.store !== "all") p.set("store", state.store);
  if (state.minPct > 0) p.set("min", String(state.minPct));
  if (state.verdict !== "all") p.set("verdict", state.verdict);
  if (state.sort !== "best") p.set("sort", state.sort);
  const s = p.toString();
  return s ? "?" + s : "";
}

export function applyFilters(state) {
  const q = state.q.trim().toLowerCase();
  return DEALS.filter((d) => {
    if (q && !(d.name + " " + d.store + " " + d.category).toLowerCase().includes(q)) return false;
    if (state.category !== "all" && d.category !== state.category) return false;
    if (state.store !== "all" && d.store !== state.store) return false;
    if (state.verdict !== "all" && d.verdict !== state.verdict) return false;
    if (pctOff(d) < state.minPct) return false;
    return true;
  });
}
