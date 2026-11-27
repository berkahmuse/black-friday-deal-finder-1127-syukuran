// Rendering for DealLens: the deal board, the deal detail page, and the
// cross-store comparison tables. All text comes from deals.js; nothing is
// fetched at run time.

import { DEALS, COMPARES, CHECKED_DAY } from "./deals.js";
import { VERDICTS, saving, pctOff, money, moneyShort, totals } from "./verdicts.js";

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function verdictBadge(v) {
  const m = VERDICTS[v];
  return `<span class="badge badge-${v}">${m.label}</span>`;
}

export function dealCard(d) {
  return `<article class="card card-${d.verdict}">
    <div class="card-top"><span class="store">${esc(d.store)}</span>${verdictBadge(d.verdict)}</div>
    <h3><a href="#/deal/${d.id}">${esc(d.name)}</a></h3>
    <p class="cat">${esc(d.category)}</p>
    <div class="prices"><span class="sale">${money(d.sale)}</span>
      <span class="usual">${money(d.usual)}</span>
      <span class="off">−${pctOff(d)}%</span></div>
    <p class="save">You save ${money(saving(d))} · ${esc(VERDICTS[d.verdict].blurb)}</p>
    <p class="meta">Checked ${CHECKED_DAY} · <a class="store-link" href="${esc(d.link)}" target="_blank" rel="noopener">View at ${esc(d.store)} ↗</a></p>
  </article>`;
}

function compareTable(c) {
  const best = Math.min(...c.rows.map((r) => r.price));
  const rows = c.rows.map((r) => `<tr${r.price === best ? ' class="best-row"' : ""}>
    <td>${esc(r.store)}</td><td class="num">${money(r.price)}</td>
    <td>${r.price === best ? "<strong>Cheapest</strong>" : "+" + money(r.price - best).slice(1) + " more"}</td>
    <td><a href="${esc(r.link)}" target="_blank" rel="noopener">View ↗</a></td></tr>`).join("");
  return `<section class="compare"><h3>Same product, compared: ${esc(c.product)}</h3>
    <p>${esc(c.note)}</p>
    <table><thead><tr><th>Store</th><th>Price</th><th>vs cheapest</th><th></th></tr></thead><tbody>${rows}</tbody></table></section>`;
}

export function renderBoard(state, filtered) {
  const t = totals(DEALS);
  const shownSaved = filtered.reduce((s, d) => s + saving(d), 0);
  const top = [...DEALS].sort((a, b) => VERDICTS[a.verdict].rank - VERDICTS[b.verdict].rank || pctOff(b) - pctOff(a)).slice(0, 3);
  const hero = top.map((d) => `<a class="hero-card" href="#/deal/${d.id}">
      ${verdictBadge(d.verdict)}<strong>${esc(d.name)}</strong>
      <span class="hero-price">${money(d.sale)} <s>${money(d.usual)}</s> · −${pctOff(d)}% at ${esc(d.store)}</span></a>`).join("");
  const cards = filtered.map(dealCard).join("") || `<p class="empty">No deals match those filters. Loosen a filter to see more.</p>`;
  const compares = COMPARES.map(compareTable).join("");
  return `
  <section class="hero"><h2>Today's sharpest cuts</h2><div class="hero-row">${hero}</div></section>
  <section class="stats" aria-label="Deal summary">
    <div><strong>${t.count}</strong><span>real deals checked</span></div>
    <div><strong>${t.newLows}</strong><span>new lowest prices</span></div>
    <div><strong>${t.strong}</strong><span>strong deals</span></div>
    <div><strong>${moneyShort(t.totalSaved)}</strong><span>total saving if you bought one of each</span></div>
    <div><strong>${t.medianPct}%</strong><span>median discount</span></div>
  </section>
  <p class="showing">Showing <strong>${filtered.length}</strong> of ${DEALS.length} deals · combined saving on screen: <strong>${money(shownSaved)}</strong></p>
  <div class="grid">${cards}</div>
  <section class="compare-block"><h2>Same product, different stores — who is actually cheapest?</h2>${compares}</section>
  <section class="method"><h2>How these deals were checked</h2>
    <p>Every price on this page was read by the maker on <strong>${CHECKED_DAY}</strong> in a deals roundup that names the store (Tom's Guide, Yahoo Shopping, MacRumors, WalletHub, Topsave) or in the store's own Black Friday announcement. Each card names its source. The verdict is the maker's honest call: <strong>NEW LOW</strong> means the lowest price the sources have tracked, <strong>STRONG DEAL</strong> a real cut worth buying, <strong>FAIR DEAL</strong> a small or previously seen cut, and <strong>ROUTINE SALE</strong> a discount so thin it is barely a deal — two deals on this page carry that label on purpose, because a finder that never says "skip it" cannot be trusted. Prices move; always confirm the live price at the store before you buy. Store links open the store's own search for the product.</p>
  </section>`;
}

export function renderDetail(d) {
  const related = DEALS.filter((x) => x.category === d.category && x.id !== d.id).slice(0, 4);
  const compare = COMPARES.find((c) => c.product === d.name || c.rows.some((r) => r.store === d.store && c.product.includes(d.name.split(" ").slice(0, 3).join(" "))));
  return `
  <p class="back"><a href="#/">← All deals</a></p>
  <article class="detail">
    <div class="detail-head"><span class="store big">${esc(d.store)}</span>${verdictBadge(d.verdict)}</div>
    <h2>${esc(d.name)}</h2>
    <p class="cat">${esc(d.category)}</p>
    <div class="price-box">
      <div><span class="lbl">Sale price</span><strong class="sale big">${money(d.sale)}</strong></div>
      <div><span class="lbl">Usual price</span><strong class="usual big">${money(d.usual)}</strong></div>
      <div><span class="lbl">You save</span><strong class="save big">${money(saving(d))} (−${pctOff(d)}%)</strong></div>
    </div>
    <p class="verdict-line"><strong>${VERDICTS[d.verdict].label}:</strong> ${esc(VERDICTS[d.verdict].blurb)}.</p>
    <h3>Why this verdict</h3>
    <p>${esc(d.evidence)}</p>
    <h3>Where the price was read</h3>
    <p>Source: ${esc(d.source)}. Price checked ${CHECKED_DAY}. Store link opens ${esc(d.store)}'s own search for this product — confirm the live price there before buying, as Black Friday prices move through the day.</p>
    <p><a class="cta" href="${esc(d.link)}" target="_blank" rel="noopener">View at ${esc(d.store)} ↗</a></p>
    ${compare ? compareTable(compare) : ""}
    <h3>More in ${esc(d.category)}</h3>
    <div class="grid small">${related.map(dealCard).join("")}</div>
  </article>`;
}
