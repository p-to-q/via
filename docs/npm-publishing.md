# npm publishing notes

Snapshot date: 2026-07-19.

Package name: `@afkv/via`

Source repository: `p-to-q/via`

## Current status

`@afkv/via@0.3.7` is the current published npm release with public access. `0.3.8` is the next candidate in this repository.

```bash
npm view @afkv/via@0.3.7 version
NPM_CONFIG_USERCONFIG=/tmp/via-empty-npmrc npm install --global @afkv/via@0.3.7 --dry-run
```

The package is configured for public npm publishing:

- `package.json` name is `@afkv/via`
- `publishConfig.access` is `public`
- package files are restricted to the CLI, Skill, example, SVG asset, README, LICENSE, and NOTICE
- `npm pack --dry-run` is part of `npm run check`

Initial registry lookup on 2026-07-19 returned `E404`, so the scoped package was not published at that moment.

Authentication check on 2026-07-19 returned:

```text
npm ERR! code E401
npm ERR! 401 Unauthorized - GET https://registry.npmjs.org/-/whoami
```

That meant the machine did not have a valid npm login for publishing at the time. Do not change the package name to work around auth; authenticate the intended [p → q] npm account or configure a scoped automation token.

A real `npm publish --access public` attempt for the next candidate package also failed before any version was published:

```text
npm ERR! code E404
npm ERR! 404 Not Found - PUT https://registry.npmjs.org/@p-to-q%2fvia - Not found
```

Given the earlier `npm whoami` E401, that attempt was treated as an authentication/scope readiness blocker, not as a successful registry reservation.

After npm authentication was configured, `npm whoami` returned a valid account, but a real publish attempt still failed:

```text
npm ERR! code E403
npm ERR! 403 Forbidden - Two-factor authentication or granular access token with bypass 2fa enabled is required to publish packages.
```

This means the next publish requires either an interactive one-time password (`npm publish --access public --otp <code>`) or a granular npm access token with publish permission and 2FA bypass enabled for this package/scope.

After a 2FA-bypass token was configured, another real publish attempt for `@p-to-q/via` failed with:

```text
npm ERR! code E404
npm ERR! 404 Not Found - PUT https://registry.npmjs.org/@p-to-q%2fvia - Scope not found
```

This means the npm organization/scope `@p-to-q` must exist on npm and the publishing account must have permission for that scope before `@p-to-q/via` can be published.

Decision for 0.3.5: publish the first npm package as `@afkv/via` from the maintainer account, while keeping the GitHub repository at `p-to-q/via`. Move to `@p-to-q/via` later only after the npm organization scope exists and ownership/redirect messaging is planned.

`@afkv/via@0.3.5` was then published successfully. `npm access get status @afkv/via` returned `public`, `npm view @afkv/via@0.3.5 version` returned `0.3.5`, and unauthenticated install dry-run succeeded.

## Publish command

Only publish after the release process is complete:

```bash
npm whoami
npm version <next-patch> --no-git-tag-version
npm run check
npm publish --access public --otp <code>
npm view @afkv/via version
```

After npm confirms the version, create the matching GitHub release tag from the same commit. Do not tag first if npm publication is still blocked.

## Package contents

The npm package should be much smaller than the GitHub repository. It should include:

- CLI entrypoint and scripts;
- `skills/via-route`;
- the default example spec and SVG;
- README, LICENSE, NOTICE;
- supporting docs that help agents and builders understand the product: design system, product architecture, Skill landscape, and agent surface notes.

It should exclude:

- GitHub workflows and issue templates;
- eval corpora and local test fixtures;
- release-note history;
- generated output folders;
- repository-only contribution and governance files unless a registry user needs them at runtime.

The 0.3.8 release audit intentionally includes the small set of adjacent design and research documents. They are available when an agent or builder needs deeper context but are not loaded by the Skill on normal turns. Evaluation corpora, tests, release history, and contributor administration remain in GitHub.

## Release gate

Before bumping and tagging:

1. Confirm npm auth with `npm whoami`.
2. Confirm package availability/ownership for `@afkv/via`.
3. Run `npm run check`.
4. Run the release-shape validator or an equivalent package/plugin version check.
5. Publish to npm and verify with `npm view`.
6. Only then create the GitHub tag and release notes.

## Decision

README may mention npm as the primary install path because `npm view @afkv/via version` now returns a real version.
