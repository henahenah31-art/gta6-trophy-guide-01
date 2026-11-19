# GTA VI Trophy Guide — Leonida Legend Tracker

[![gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/henahenah31-art/gta6-trophy-guide-01/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/henahenah31-art/gta6-trophy-guide-01/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden on PlayStation; no online trophies). Each trophy is shown with its official name, description and grade, plus a guide written for this entry in our own words, with its sources named beside it.

## What it does

- **Checklist tracker** — tick trophies off; progress is saved in the browser (localStorage) and can be exported to a JSON file and imported back.
- **Filters** — by kind (story, missable, collectibles, activities, online), by grade, by earned / not-earned, and a search box.
- **Spoiler setting** — hides the names and descriptions of story trophies until they are earned.
- **Roadmap to the Platinum** — six stages built from the official descriptions: story, side strands, activities, collectibles & exploration, robberies & money, cleanup & 100% completion.
- **Missable flags** — one trophy is flagged missable: *Positive Mental Attitude* (a meditation spot reported to be Chapter 1 only). The guide advises a manual save at the start of every chapter, since the game has no mission replay.
- **Detail panel** — every trophy opens its guide with its sources (Exophase, PSNProfiles, PlanetGTA6, OutputLag).

## Use it offline

```sh
node serve.ts
```

Then open <http://localhost:8080>. Any static HTTP server works with `app/` as its root. The app fetches nothing at run time — no network requests, no external fonts or images — so it works with the network off.

## Sources

Trophy names, descriptions and grades are as listed by Exophase and PSNProfiles, cross-checked on PlanetGTA6 and OutputLag (see the `sources` field of each trophy in `app/data/trophies.json`). The guides themselves are original writing for this entry; other guides are cited, never copied.

Unofficial fan guide. Not affiliated with Rockstar Games. No official artwork or logos are used.

## License

MIT — see [LICENSE](LICENSE).
