# Model fit and evaluation

Snapshot date: 2026-07-27.

via is an amplifier for an already capable coding model, not a substitute for one. The relevant unit is the complete agent system:

```text
model capability × reasoning setting × agent harness × tools × task context
```

That is why via does not impose a release-date rule, parameter-count rule, or benchmark cutoff. A strong model in a weak harness may be unable to inspect the repository or render the artifact. A smaller model in a well-designed harness may handle a bounded decision well. Public benchmark results are measurements of those combinations, not pure intelligence scores.

## Required behavior

A good via host can usually:

- infer the intended engineering outcome from an incomplete or conversational request;
- find three consequential routes when they exist, and avoid inventing them when they do not;
- inspect relevant repository evidence and use tools without losing the planning thread;
- represent real overlap, divergence, convergence, and endpoints without decorating the graph;
- emit RouteSpec reliably enough that validation needs no more than a small repair;
- preserve a useful written recommendation alongside the SVG.

If these abilities are missing, the schema becomes overhead. Typical failure signs are three renamed copies of one idea, confident but unsupported estimates, decorative topology, repeated JSON repair, or a map that says less than the normal answer.

## Current model guidance

This list is a maintained snapshot rather than an allowlist.

| provider | quality-first | balanced starting point | note |
| --- | --- | --- | --- |
| OpenAI | GPT-5.6 Sol | GPT-5.6 Terra | Start around medium reasoning for ordinary planning and raise it only when the decision benefits. Codex may select a suitable configuration automatically when model and effort are not pinned. |
| Anthropic | Claude Opus 5 | Claude Sonnet 5 | Anthropic positions these for complex agentic coding, with Opus as the higher-capability choice and Sonnet as the practical default. |
| Google | Gemini 3.1 Pro | Gemini 3.6 Flash | Prefer Pro for ambiguous, multi-system decisions; test Flash on bounded tasks where latency matters. |

Other models are welcome when they demonstrate the required behavior. Avoid maintaining a long brand leaderboard in the public README; model catalogs change faster than via's interface contract.

## Benchmarks as weak signals

[SWE-bench Verified](https://www.swebench.com/) measures whether a model-agent system resolves human-confirmed GitHub issues. [Terminal-Bench](https://www.tbench.ai/) measures agents on end-to-end terminal tasks and explicitly consists of both a task dataset and an execution harness. Both are relevant signals for repository inspection and tool use.

Neither directly measures via's central behavior: understanding an open planning question, forming useful alternatives, and expressing their engineering topology. Scores also change with scaffolding, tools, budgets, attempts, and benchmark version. Do not write rules such as “SWE-bench ≥ 60%” into the Skill.

## Small compatibility check

Before recommending a new model-and-harness combination, run three raw tasks without telling the model the expected graph:

1. A genuine architecture choice whose routes share one start and one outcome.
2. A choice with partial endpoint sharing, such as two available starting states leading to one release-ready result.
3. A tiny or already-fixed task that should not invoke via.

The combination fits when the first two produce materially different, startable routes; topology follows the work; the third stays a normal answer; RouteSpec validates with at most a small repair; and the SVG adds decision value rather than merely repeating the text.

This check is intentionally behavioral. Re-run it after material changes to the model, reasoning setting, harness, Skill prompt, or renderer.

## Product rule

Keep model selection outside the runtime Skill. The Skill should continue to assume that the host model is capable and give it a light scaffold. Model recommendations, benchmark interpretation, and compatibility history belong in repository documentation so they do not consume context on every via invocation.

## Sources

- [OpenAI: Using GPT-5.6](https://developers.openai.com/api/docs/guides/latest-model.md)
- [Codex manual](https://developers.openai.com/codex/codex-manual.md)
- [Anthropic: Models overview](https://docs.anthropic.com/en/docs/about-claude/models/overview)
- [Google: Gemini models](https://ai.google.dev/gemini-api/docs/models)
- [SWE-bench](https://github.com/SWE-bench/SWE-bench)
- [Terminal-Bench](https://github.com/laude-institute/terminal-bench)
