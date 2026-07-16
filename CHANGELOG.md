# Changelog

All notable changes to Alosaur will be documented in this file.

## [v2.0.0] - 2026-07-16

### 🚀 Deno 2.x Support

This release adds full compatibility with Deno 2.x and is the recommended version for all new projects.

### What's Changed

#### Bug Fixes
- **fix: preserve Deno 2 enum members in OpenAPI docs** — Enum members defined with `const` were being dropped by the Deno 2 type-checker; they are now correctly preserved in generated OpenAPI schemas.
- **fix: resolve failing "Deno 2.x" CI job** ([#214](https://github.com/alosaur/alosaur/pull/214)):
  - **Race condition** — `console.log("Server start in")` was called in `app.listen()` before `Deno.serve()` had bound to the TCP port. The log is now emitted inside the `onListen` callback (fired by Deno only _after_ the port is open), eliminating `ECONNREFUSED` errors in e2e tests.
  - **Content-Type charset case** — Deno 2.x returns `charset=UTF-8` (uppercase). Updated assertions to match the new casing.
  - **Static HTML body** — Updated `StaticIndexHtmlText` test constant to exactly match the file on disk.
- **docs: fix typo in README.md** ([#212](https://github.com/alosaur/alosaur/pull/212)) — "parametrs" → "parameters".

### Upgrade Guide

No breaking changes from v1.x. Update your Deno version to 2.x and import from the same entry points:

```ts
import { App, Area, Controller, Get } from "https://deno.land/x/alosaur/mod.ts";
```

**Full Changelog**: https://github.com/alosaur/alosaur/compare/v1.1.1...v2.0.0

---

## [v1.1.1] - 2024-03-03

- Fix performance in lite handler

**Full Changelog**: https://github.com/alosaur/alosaur/compare/v1.1.0...v1.1.1

## [v1.1.0] - 2024-02-23

- feat: Replaced by the faster and simpler `Deno.serve()` ([#207](https://github.com/alosaur/alosaur/pull/207))

**Full Changelog**: https://github.com/alosaur/alosaur/compare/v1.0.0...v1.1.0

## [v1.0.0] - 2024-02-19

### Breaking Changes
- Update to Deno 1.40
- New DI container, removed `microsoft/tsyringe` ([#204](https://github.com/alosaur/alosaur/pull/204))
- Added ES decorators ([#205](https://github.com/alosaur/alosaur/pull/205))

**Full Changelog**: https://github.com/alosaur/alosaur/compare/v0.38.0...v1.0.0
