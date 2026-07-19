# via evaluation

Forward-test with fresh agents and raw tasks. Do not provide the expected route or prior diagnosis.

## Scorecard (0–2 each)

| dimension | 0 | 1 | 2 |
| --- | --- | --- | --- |
| trigger | intrusive or missed | debatable | appears only when useful |
| separation | cosmetic variants | one weak difference | each route gives a consequential reason to choose it |
| topology | fabricated or misleading | valid path but meaningful structure flattened | topology faithfully matches the actual work |
| budget honesty | exact guess | range only | range with honest width; no precision claim |
| proof | absent | generic end node | shared or route-specific proof checkpoint in the graph |
| scan speed | report-like | understandable | recommendation in 10s, choice in 30s |
| startability | another plan needed | partial | selected route can start immediately |

Passing score: at least 11/14, with no zero in trigger, separation, topology, or proof.

Evaluate the result, not whether the model followed a prescribed reasoning recipe. Strong models may discover useful route distinctions or topology that this guide does not anticipate. Penalize invented options and unusable choices; do not penalize a different but well-supported structure.

Evaluate scan speed on the SVG itself. Do not penalize the accompanying answer for containing useful route explanations, evidence, recommendation, or feedback. Penalize only repetition that adds no decision value.

Do not score host-native thinking panels, progress traces, or reasoning summaries as via output noise. Confirm only that the Skill does not suppress them or demand a private raw chain-of-thought transcript.

## Fake-route test

Compare every pair. Fail the set when a pair gives the user no consequential reason to choose differently after considering signals such as:

- change boundary and dependencies;
- node sequence and action labels;
- risk/reversibility position;
- proof method;
- best/wrong conditions.

Routes need not differ on every signal. One important, well-supported boundary can create a real choice.

Renaming `quick`, `balanced`, and `robust` does not create routes. Each route must give the user a real reason to choose differently.

## Task families

Test tiny fixes (expected skip), open-ended plan questions (expected three-option map when credible), migrations, UI redesigns, API integrations, performance diagnosis, data cleanup, test strategy, compatibility refactors, and research-heavy product decisions.

## Continuation test

Run a short multi-turn sequence: open decision → route selection → implementation follow-up → material constraint change. Expect one map on the open decision, no new map for selection or straightforward implementation, and a redraw only if the changed constraint genuinely changes the available paths or topology.
