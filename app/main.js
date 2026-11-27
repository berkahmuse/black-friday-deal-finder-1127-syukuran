// DealLens entry point: hash routing (#/ board, #/deal/<id> detail) plus the
// filter bar. Filter changes rewrite the URL query string and re-render,
// so every filtered view is a real state of the site.

import { DEALS, STORES, CATEGORIES } from "./deals.js";
import { readState, stateToQuery, applyFilters, DEFAULTS } from "./filters.js";
import { sortDeals } from "./verdicts.js";
import { renderBoard, renderDetail } from "./views.js";

const app = document.getElementById("app");
const bar = document.getElementById("filters");

function option(value, label, current) {
  return `<option value="${value}"${value === current ? " selected" : ""}>${label}</option>`;
}

function renderFilters(state) {
  bar.innerHTML = `
    <label>Search <input id="f-q" type="search" placeholder="Search products, stores…" value="${state.q.replace(/"/g, "&quot;")}"></label>
    <label>Category <select id="f-cat">${option("all", "All categories", state.category)}${CATEGORIES.map((c) => option(c, c, state.category)).join("")}</select></label>
    <label>Store <select id="f-store">${option("all", "All stores", state.store)}${STORES.map((s) => option(s, s, state.store)).join("")}</select></label>
    <label>Min. discount <select id="f-min">${[0, 20, 30, 40, 50].map((n) => option(String(n), n === 0 ? "Any discount" : n + "% off or more", String(state.minPct))).join("")}</select></label>
    <label>Verdict <select id="f-verdict">${option("all", "Any verdict", state.verdict)}${[["new-low", "New low"], ["strong", "Strong deal"], ["fair", "Fair deal"], ["routine", "Routine sale"]].map(([v, l]) => option(v, l, state.verdict)).join("")}</select></label>
    <label>Sort <select id="f-sort">${[["best", "Best deal first"], ["pct", "Biggest % off"], ["saved", "Biggest $ saving"], ["price-asc", "Price: low to high"], ["price-desc", "Price: high to low"]].map(([v, l]) => option(v, l, state.sort)).join("")}</select></label>
    <button id="f-reset" type="button">Reset</button>`;
  const go = () => {
    const next = {
      q: document.getElementById("f-q").value,
      category: document.getElementById("f-cat").value,
      store: document.getElementById("f-store").value,
      minPct: Number(document.getElementById("f-min").value),
      verdict: document.getElementById("f-verdict").value,
      sort: document.getElementById("f-sort").value,
    };
    history.replaceState(null, "", stateToQuery(next) + "#/");
    render();
  };
  bar.querySelectorAll("input,select").forEach((el) => el.addEventListener(el.tagName === "INPUT" ? "input" : "change", go));
  document.getElementById("f-reset").addEventListener("click", () => {
    history.replaceState(null, "", "#/");
    render();
  });
}

function render() {
  const state = readState();
  const hash = location.hash || "#/";
  if (hash.startsWith("#/deal/")) {
    const deal = DEALS.find((d) => d.id === hash.slice(7));
    bar.innerHTML = "";
    bar.style.display = "none";
    app.innerHTML = deal ? renderDetail(deal) : `<p class="empty">No such deal. <a href="#/">Back to all deals</a>.</p>`;
    document.title = deal ? deal.name + " — DealLens" : "DealLens";
    window.scrollTo(0, 0);
    return;
  }
  renderFilters(state);
  bar.style.display = "";
  const filtered = sortDeals(applyFilters(state), state.sort);
  app.innerHTML = renderBoard(state, filtered);
  document.title = "DealLens — Real Black Friday deals, checked 27 Nov 2026";
}

window.addEventListener("hashchange", render);
render();
