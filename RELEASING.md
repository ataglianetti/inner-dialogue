# Releasing

How to ship a new version of `inner-dialogue` to npm. This is the canonical reference — if anything in this doc gets stale, fix it here first.

## What CI does

The `Publish to npm` workflow (`.github/workflows/publish.yml`) runs on every push to a `v*` tag. It:

1. Verifies `package.json` version matches the tag (catches "I tagged v2.3.0 but bumped to 2.4.0" mistakes)
2. Smoke-tests the CLI (install, doctor, update --dry-run)
3. Does `npm pack --dry-run` to validate the package
4. Publishes via npm Trusted Publishing (OIDC, no token) with `--provenance`

If any of those fail, the publish doesn't happen — fix the issue, delete the tag locally and remotely, re-tag.

## Steps to ship a release

### 1. Decide the version bump

Semver against the published behavior:

| Change kind | Bump | Examples |
|---|---|---|
| Bug fix, doc fix, internal refactor | patch (2.2.0 → 2.2.1) | Fix profile.md regex, fix typo in modality |
| New persona/modality/structure, new CLI flag, new optional behavior | minor (2.2.0 → 2.3.0) | Add somatic modality, add `--quiet` flag |
| Breaking change to CLI flags, file layout, or version.json schema | major (2.x → 3.0.0) | Rename `--modalities` → `--approaches`, change `.therapy/` structure |

When in doubt, lean toward minor — installed users get framework updates via the updater anyway, and the hash-diff updater is tolerant of new files.

### 2. Bump `package.json`

```bash
# Pick one:
npm version patch   # 2.2.0 → 2.2.1
npm version minor   # 2.2.0 → 2.3.0
npm version major   # 2.2.0 → 3.0.0
```

`npm version` updates `package.json`, commits the change, and creates a matching git tag.

If you'd rather edit `package.json` by hand, do that and then `git commit -am "Release vX.Y.Z"` — but **don't tag yet**. Tag last.

### 3. Update `CHANGELOG.md`

Add an entry at the top under the new version heading. Match the existing style:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added / Changed / Fixed
- Brief description of what changed and why.
```

Categories: `Added`, `Changed`, `Fixed`, `Deprecated`, `Removed`, `Security`. Skip categories that don't apply.

Commit with: `git commit -am "Update changelog for vX.Y.Z"`

### 4. Tag (if you didn't use `npm version`)

```bash
git tag vX.Y.Z
```

The `v` prefix matters — CI looks for tags starting with `v`.

### 5. Push commits and tag

```bash
git push origin main
git push origin vX.Y.Z
```

Or in one shot: `git push origin main --follow-tags`

### 6. Watch CI

Go to the [Actions tab](https://github.com/ataglianetti/inner-dialogue/actions). The `Publish to npm` workflow should run within ~30 seconds of the tag push. Wait for it to go green.

### 7. Verify the publish landed

```bash
npx inner-dialogue@latest --version
```

Should print the new version. (npm can take a minute to propagate — if it shows the old version, wait 60s and retry.)

Also check [npmjs.com/package/inner-dialogue](https://www.npmjs.com/package/inner-dialogue) — the new version should be listed with a green "provenance" badge (proves it came from this GitHub Actions workflow).

### 8. Publish the GitHub Release

The tag push publishes to npm but does **not** create a GitHub Release — that's a separate manual step, and it's the one most likely to get skipped (2.7.0 and 2.7.1 shipped without one until they were backfilled). The Releases page is what people browsing the repo see, so keep it current.

The tag already exists, so you're only attaching notes:

```bash
gh release create vX.Y.Z --verify-tag --latest \
  --title "vX.Y.Z — <theme>" \
  --notes-file <notes.md>
```

- **Title:** themed, matching the existing style — `vX.Y.Z — <short theme>` (e.g. "v2.6.0 — Persona Adherence").
- **Body:** adapt the CHANGELOG entry into prose — a lead line, the key changes as bullets, a closing note on what reaches existing installs. Don't paste the raw changelog.
- **`--latest`** marks it the current release. When backfilling an *older* version that was skipped, use `--latest=false` so it doesn't steal the Latest pointer.
- Credit community PRs by number (e.g. "Landed via #12, #9") so contributors get linked.

Verify with `gh release list` — the newest version should carry the "Latest" badge, with no gaps in the version history.

## If something goes wrong

### Tag pushed but CI failed

1. Look at the CI logs to see why
2. Fix the issue on `main`
3. Delete the local and remote tag:
   ```bash
   git tag -d vX.Y.Z
   git push origin :refs/tags/vX.Y.Z
   ```
4. Re-tag and push (the tag now points at the fix)

### Published a broken version

Don't unpublish — npm allows it within 72 hours but it's disruptive (people who installed it get errors). Instead:

1. Fix the bug
2. Ship a patch release (vX.Y.Z+1)
3. Optionally deprecate the broken version: `npm deprecate inner-dialogue@X.Y.Z "Broken — use vX.Y.Z+1"`

Users running `npx inner-dialogue@latest` automatically get the new version.

### Need to publish manually (CI is broken)

You'll need npm publish access on the account. From a clean clone of the repo at the tagged commit:

```bash
npm install -g npm@latest
npm publish --access public --provenance
```

This bypasses CI. Prefer fixing CI over making this a habit — provenance attestations only work cleanly from the trusted CI environment.

## Credential hygiene

The publish workflow uses **npm Trusted Publishing** (OIDC) — no npm token is stored anywhere. If you ever need to publish manually from your laptop, you'll authenticate interactively via `npm login`. Don't create long-lived npm tokens; they're not needed.

If a token is ever created (e.g., for a temporary bootstrap), revoke it immediately after use:
- npm.com → avatar → Access Tokens → Revoke
- GitHub repo → Settings → Secrets → delete `NPM_TOKEN` if it exists
