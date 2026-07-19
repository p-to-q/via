# Evaluation set

Use `cases.json` for blind trigger tests and `route-quality-cases.json` for adversarial route-separation checks. The validator checks whether RouteSpec is structurally renderable; topology quality belongs to evaluation and model judgment. Give a fresh agent the prompt and the Skill without the expected result, then score with `skills/via-route/references/eval.md`.

The seed set balances eight expected triggers with four expected skips. Expand toward 20–30 real tasks after the first user sessions; synthetic cases alone cannot prove adoption or decision speed.
