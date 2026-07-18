# Evaluation set

Use `cases.json` for blind trigger tests and `route-quality-cases.json` for adversarial route-separation checks. A passing artifact must also satisfy the graph validator: shared edges, one local branch, unique route segments, one origin-to-destination path per route, and a visible proof checkpoint. Give a fresh agent the prompt and the Skill without the expected result, then score with `skills/via-route/references/eval.md`.

The seed set balances eight expected triggers with four expected skips. Expand toward 20–30 real tasks after the first user sessions; synthetic cases alone cannot prove adoption or decision speed.
