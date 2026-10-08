# Verification — October 8, 2026

Verified in a local in-app browser, using the rendered page and real controls.

| Check | Result |
| --- | --- |
| Initial selected bout | Allen vs Duncan, bout 1/12, Main Event |
| All 12 navigation selections | Exact Cito profile IDs and source opponent order matched |
| All 24 fighter images | Loaded with positive natural dimensions; exact event-card URLs |
| Main Card / Prelims | 5 / 7, original source order |
| Personal picks | Started blank; a disposable Allen / Submission / R3 / High / notes pick survived refresh |
| My Picks | Correct winner, method, round, confidence, and notes; remaining 11 blank |
| Decision | Disabled round and cleared previous round selection |
| Keyboard | Right advanced to bout 2, left returned to bout 1; right in notes did not switch fights |
| Recording geometry | At 1920×1080, all four corners × three sizes passed: safe stage did not intersect reserved rectangle; portraits, tape, navigation, winner/method/round/confidence all visible |
| Default camera | 380×300 at x=1540, y=780 |
| Guide toggle | Hidden guide preserved camera reservation |
| My Picks in recording | Panel stayed above reserved rectangle |
| Scroll | Safe stage remained clipped outside fixed reserved camera area |
| Metric | Height 188.0 cm both; reach 190.5/200.7 cm; 10.2 cm difference; weight 84.4/83.9 kg |
| Recent/stats | Correct two profiles' actual source fields and fight entries displayed |
| Mobile | 390×844, responsive card strip, both portraits and tape, no horizontal document overflow |
| Fullscreen | Control invokes browser Fullscreen API; embedded preview does not expose a granted fullscreen state. Browser-dependent fallback message is implemented. |

The disposable QA pick was cleared and a subsequent refresh showed 0/12. No predictions are prepopulated in deployed source. External images can become unavailable after these checks, in which case the silhouette fallback applies.
