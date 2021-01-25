# Contribution Guide

Any contribution to Alosaur is more than welcome!

## Reporting Issues

A great way to contribute to the project is to send a detailed report when you
encounter an issue. Please make sure to include a reproduction repository so
that bugs can be reproduced without great efforts. The better a bug can be
reproduced, the faster we can start fixing it!

## Pull Requests

We'd love to see your pull requests, even if it's just to fix a typo!

However, any significant improvement should be associated to an existing feature
request or bug report.

## Getting started

- Fork the Alosaur repository to your own GitHub account and then clone it to
  your local device.
- Coding fix/feature
- Create tests
- Create PR to Alosaur

## Test structure

A great PR, whether it includes a bug fix or a new feature, will often include
tests. To write great tests, let us explain our test structure:

### Unit tests

The unit tests can be found in `*file*.test.ts`.

### E2E tests

We really love e2e tests that can cover all cases. The unit tests can be found
in `e2e/*server_name*.test.ts`. We usually write tests to servers in the
`examples/` folder.

Run all tests:

`deno test -A --config ./src/tsconfig.lib.json`

### How to run examples in project folder?

`deno run -A --config ./src/tsconfig.lib.json examples/di/app.ts`

## Before submiting PR

Run `deno fmt` for formating your code.

# Style guide

We follow the official
[Deno style guide](https://github.com/denoland/deno/blob/master/docs/contributing/style_guide.md)

# Commit Message Guidelines

We follow the
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

For example

`fix(docs): fix typo on DI`

### Scopes

- docs
- router
- middleware
- hooks
- renderer
- di
- openapi
- ...
