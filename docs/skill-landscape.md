# Skill landscape — July 2026

Popularity is not quality. This audit keeps four signals separate:

- repository attention: stars and forks;
- public installation counters: useful but may include repeat installs and updates;
- community discussion: evidence of interest and criticism;
- artifact quality: verified by reading the Skill, scripts, tests, and failure reports.

Snapshot date: 2026-07-19. Repository counts came from the linked GitHub repository pages/API; install counters came from [skills.sh](https://skills.sh/); discussion scores came from the linked Hacker News threads. All counts are rounded because they change continuously. This is a design research snapshot, not a leaderboard.

## Widely adopted repositories

| repository | visible adoption signal | implementation pattern | lesson for via |
| --- | ---: | --- | --- |
| [obra/superpowers](https://github.com/obra/superpowers) | 257k stars; ~2.3m skills.sh installs | 14 workflow skills, multi-host packaging, hooks, many test fixtures | distribution works; global hard gates and long planning are too heavy for via |
| [mattpocock/skills](https://github.com/mattpocock/skills) | 176k stars; ~9.7m installs | dozens of short, verb-like skills with explicit deprecated/in-progress states | stay atomic and retire weak skills publicly |
| [anthropics/skills](https://github.com/anthropics/skills) | 162k stars; ~2.5m installs | concise control files plus deterministic helpers and conditional references | treat renderer and validator as black boxes |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 107k stars; ~520k installs | searchable local design data, CLI, marketplace/update path | query knowledge when needed instead of putting it in the prompt |
| [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) | 90k stars | 78-line Skill, one memorable promise, benchmarks, installers | a visible before/after and a tiny promise travel well |
| [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | 85k stars | 108-line Skill, strong single behavior, correctness benchmark, many hosts | strong constraint beats a general methodology |
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 79k stars; ~297k installs | explicit trigger phrases, fixed deliverables, eval files | connect each trigger to one visible artifact |
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | 65k stars; ~2.3m installs | strong anti-slop positioning and examples, but very long Skills | positioning helps discovery; thousand-line prompts are not the model |
| [mvanhorn/last30days-skill](https://github.com/mvanhorn/last30days-skill) | 53k stars; ~24k installs | real Reddit/X/HN toolchain, doctor, fixtures, eval, security/CI; very large Skill | complex runtime justifies machinery, but via is not that runtime |

Install counters were observed on [skills.sh](https://skills.sh/) on 2026-07-19 and may include repeat installation or updates. They are not unique-user counts.

## Community discussion

Hacker News provides both adoption and strong criticism:

- [Agent Skills](https://news.ycombinator.com/item?id=46871173): 544 points / 260 comments. Users want discoverable capabilities but report unreliable triggering and poor directory scanning.
- [Addy Osmani Agent Skills](https://news.ycombinator.com/item?id=48015397): 376 / 212. Some users adopt narrow API/UI skills; others removed Superpowers because native planning was faster and cheaper.
- [SkillsBench](https://news.ycombinator.com/item?id=47040430): 364 / 171. Discussion emphasizes feedback and measurement over chained instructions.
- [TDD Skill](https://news.ycombinator.com/item?id=48398925): 251 / 109. The central challenge: if a short prompt already works, the Skill must add domain knowledge, a tool, or a reliable artifact.
- [Agent Skills Leaderboard](https://news.ycombinator.com/item?id=46697908): download rankings were challenged as platform-biased and missing descriptions/install commands.
- [Agent-skills-eval](https://news.ycombinator.com/item?id=48046023): users want A/B evaluation because a Skill may make performance worse.

Reddit RSS confirms relevant field reports, but does not reliably expose scores, so no popularity number is claimed:

- [1,800+ logged sessions, 400+ skills, most over-engineered](https://www.reddit.com/r/ClaudeCode/comments/1uyn9tm/)
- [A 12-word prompt can beat a 200-word prompt](https://www.reddit.com/r/ClaudeCode/comments/1uv9m73/)
- [A directory with notes from actually using the skills](https://www.reddit.com/r/ClaudeCode/comments/1uylt6z/)
- [A narrow release command became habitual](https://www.reddit.com/r/ClaudeCode/comments/1uyfn37/)

Public X search did not reliably expose original post text and interaction counts without authentication. This audit does not turn search snippets into evidence.

## What via adopts

1. one sentence: a Git-tree/Google Map interface for vibe coding decisions;
2. visible result on first use;
3. short trigger/control Skill;
4. deterministic scripts;
5. one-command build;
6. skip path when the map adds no value;
7. graph and trigger evals before distribution;
8. multi-host packaging only after the artifact proves useful.

What it rejects: mandatory planning, generic engineering doctrine, exact token claims, three cosmetic options, and popularity metrics presented as quality.
