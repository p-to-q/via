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

## Practical threshold

Treat the model-agent combination as ready when it can inspect a repository, form three materially distinct routes from an ambiguous engineering task, and emit valid RouteSpec with at most one small repair. This is deliberately a behavioral threshold: parameter count, release date, and a single benchmark score are weak substitutes for running the actual interaction.

## Models to evaluate

The following are representative current candidates, not a ranking, minimum tier, or claim of completed via certification. Prefer the balanced coding model already native to the user's agent before paying for the largest model.

| ecosystem | representative candidates | why they belong in the test set |
| --- | --- | --- |
| OpenAI | GPT-5.6 Terra; Sol for unusually difficult decisions | Current Codex guidance can balance model and reasoning effort automatically; Terra is the capability/cost starting point rather than the maximum tier. |
| Anthropic | Claude Sonnet 5; Opus only when the task warrants it | Sonnet is the practical coding baseline, while Opus is a quality-first comparison point. |
| Google | Gemini 3.6 Flash; Gemini 3.1 Pro for harder topology | Flash provides a latency-oriented test and Pro a complex-reasoning comparison. |
| Moonshot AI | Kimi K2.7 Code; Kimi K3 | Moonshot positions these for coding and long-horizon coding, making them relevant Chinese-developed candidates. |
| DeepSeek | DeepSeek V4 Flash; V4 Pro | The current API exposes both speed-oriented and stronger reasoning variants that should be tested separately in the same harness. |
| Alibaba Qwen | Qwen3.7 Max and current Qwen coding variants | Qwen's current catalog includes general reasoning and coding-focused models suitable for Chinese and bilingual repository work. |
| Z.ai / Zhipu | GLM-5 or GLM-5.2 | Current GLM releases include coding-oriented agent use and belong in a cross-provider compatibility pass. |

Do not infer certification from inclusion in this table. Record a model as a proven fit only after the small compatibility check below, including the exact model, reasoning setting, agent harness, and date. Avoid maintaining a brand leaderboard in the public README; model catalogs change faster than via's interface contract.

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
- [Moonshot AI: Kimi thinking and coding models](https://platform.moonshot.ai/docs/guide/use-kimi-k2-thinking-model)
- [DeepSeek API models](https://api-docs.deepseek.com/quick_start/pricing)
- [Alibaba Model Studio model catalog](https://help.aliyun.com/zh/model-studio/getting-started/models)
- [Z.ai model documentation](https://docs.z.ai/guides/llm/glm-4.5)
- [SWE-bench](https://github.com/SWE-bench/SWE-bench)
- [Terminal-Bench](https://github.com/laude-institute/terminal-bench)
