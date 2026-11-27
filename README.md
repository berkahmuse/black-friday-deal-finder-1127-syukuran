# DealLens — Real Black Friday Deals, Checked Today

[![make.fun](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/c/black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/berkahmuse/black-friday-deal-finder-1127-syukuran/rank.svg)](https://make.fun/c/black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/berkahmuse/black-friday-deal-finder-1127-syukuran/reward.svg)](https://make.fun/c/black-friday-deal-finder-01)

A Black Friday / Cyber Monday deal finder for the [make.fun Black Friday deal finder bounty](https://make.fun/c/black-friday-deal-finder-01).

**48 real deals** from 7 stores (Amazon, Best Buy, Target, Walmart, Costco, Kohl's, GameStop) across 11 categories. Every price was found and checked by the maker on 27 November 2026, reading the price in a deals roundup that names the store (Tom's Guide, Yahoo Shopping, MacRumors, WalletHub, Topsave) or in the store's own Black Friday announcement — each card shows the sale price, the usual price, the discount, the store link, when the price was checked, and the source it was read in. Each deal also carries an honest verdict — **NEW LOW** (8), **STRONG DEAL** (34), **FAIR DEAL** (4) or **ROUTINE SALE** (2) — with the evidence behind it, so shoppers can tell a true bargain from a routine sale. Two deals are labelled ROUTINE on purpose: a finder that never says "skip it" cannot be trusted.

## What it does

- Search across products, stores and categories
- Filter by category, store, minimum discount and verdict; sort by best deal, biggest % off, biggest $ saving, or price
- A detail page for every deal with its full verdict evidence, source and check time
- The same product compared across stores — three comparisons (Switch 2 + Mario Kart World bundle at 4 stores, AirPods Pro 3 at 3, Dyson V9 at 2)
- A "Today's sharpest cuts" hero, a stats strip (deals, new lows, total saving, median discount) and a methodology note
- Works on desktop and on a phone; fully static, zero network requests

## Run it

```sh
node serve.ts        # http://localhost:8080
```

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```
