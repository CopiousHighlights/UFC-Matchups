# UFC Matchups

A personal predictions desk for **UFC Fight Night: Allen vs Duncan**, designed for recording a YouTube breakdown in OBS at 1920 × 1080.

## Features

- Complete Cito card: five Main Card bouts and seven Prelims, in source order.
- 24 fighter profiles matched by their Cito profile paths, with actual UFC-hosted portraits.
- Aligned tale of the tape, imperial/metric conversion, neutral size-difference highlights.
- Source-listed finish rate, striking accuracy, takedown accuracy, and up to three recent completed fights per fighter.
- Blank personal predictions: winner, method, optional finish round, confidence, and notes. Browser-local persistence, My Picks summary, JSON export.
- Previous/Next buttons and left/right shortcuts that ignore typing and native select fields.
- Recording Mode with an OBS camera reservation: Small 320 × 240, Medium 380 × 300, Large 480 × 360; all four corners supported. Guide and notes can be hidden independently. No camera permissions requested.
- Responsive mobile layout and fullscreen control (subject to the browser granting fullscreen).

## Recording

Open the site in a desktop browser at 1920 × 1080, select **Recording Mode**, and add your camera as a separate OBS source. Medium / bottom right reserves exactly **380 × 300 pixels**, beginning at x=1540, y=780. Hide the guide when ready to record. Put the browser at 100% zoom for matching pixel dimensions.

The comparison sits in a clipped, scrollable safe stage above a bottom-corner reservation or below a top-corner reservation. It reserves a horizontal strip as well as the actual camera rectangle, giving predictable protection when scrolling, switching fights, and opening My Picks. The card navigator scrolls independently. Essential portraits, tape, and prediction controls fit together at 1080p for all three camera sizes. Smaller screens can scroll within the safe stage.

## Data provenance

Primary event: https://cito.gg/ufc/events/ufc-fight-night-october-10-2026

Retrieved October 8, 2026 through Cito's visible event page and all 24 linked profiles. The event card supplies pairings, grouping, ordering, profile IDs, records, flags, and portrait URLs. Profiles supply nicknames, age, measurements, stance, finish rate, accuracy percentages, and recent fights. No fighter names are used as database join keys. `dist/event.json` is the source snapshot delivered to the browser; `scripts/build_data.py` and `data/source/recent-fights.txt` preserve the transcribed inputs and conversion.

This is a **fixed Cito snapshot**, not a live feed or independent UFC verification. The timestamp records the successful source capture, not the last browser refresh or rebuild. Images stay at their actual external URLs; an unavailable photo renders a generic silhouette.

Source limitations:

- Missing reach for Otari Tanzilovi and Felipe Franco; missing takedown accuracy for Allen Frye Jr. and RJ Harris. Null values display “Not available”; actual zero percentages remain zero.
- Listed profile weights are not event weigh-ins and may reflect a different division or an older bout. Age is source-listed, not recalculated for the event date.
- Allen's event-card US flag conflicts with the profile's Brazil flag; the event-card flag is used.
- Recent matchup labels and method abbreviations are retained from the profiles. Cito does not explain the sample/denominator for these accuracy metrics in the captured view; percentages are not recast as event-specific statistics.
- Prediction round choices 1–5 are personal input options, not confirmation of scheduled bout length. Decision disables and clears the round.

If event JSON cannot load, the site shows an explicit failure and accepts an event snapshot JSON with valid unique bout IDs and matching fighter IDs. No fallback card or fabricated statistics are supplied. Source photo rights remain with their owners; no generated fighter faces are included. This project is not affiliated with UFC or Cito.

## Run locally

No install or build step is necessary. From this directory:

```sh
python -m http.server 4174 --directory dist
```

Open http://localhost:4174. Do not open index.html directly as a file, because the browser must fetch the JSON snapshot. Python rebuilds the captured inputs with `python scripts/build_data.py`; it does not fetch fresh Cito data or advance the source timestamp. Run `python scripts/validate_data.py` to validate the snapshot.

## Files

| Path | Purpose |
| --- | --- |
| `dist/index.html` | Semantic page, controls, source fallback |
| `dist/styles.css` | Broadcast theme and camera-safe responsive layouts |
| `dist/app.js` | Comparison, personal picks, persistence, keyboard controls |
| `dist/event.json` | Source-backed event and fighter snapshot |
| `scripts/build_data.py` | Reproducible conversion of captured source inputs |
| `scripts/validate_data.py` | Pairing, identity, range, and missing-data checks |
| `data/source/recent-fights.txt` | Captured recent-fight fields |
| `QA.md` | Completed browser verification |

Predictions stay in your browser's local storage and are never committed to this repository. They are separate for this event and bout IDs. Clearing browser storage removes saved picks; use Download My Picks for a backup. A local preview and the published site use different browser storage origins.
