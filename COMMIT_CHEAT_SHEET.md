# Commit Message Cheat Sheet

TL;DR: Keep the subject short (<=50 chars), use imperative mood, separate header/body, explain why (not how), and use common types (see **Common types** below) when helpful.

## Common types (Conventional Commits - quick)
- feat – a new feature is introduced with the changes
- fix – a bug fix has occurred
- chore – changes that do not relate to a fix or feature and don't modify src or test files (for example updating dependencies)
- refactor – refactored code that neither fixes a bug nor adds a feature
- docs – updates to documentation such as a the README or other markdown files
- style – changes that do not affect the meaning of the code, likely related to code formatting such as white-space, missing semi-colons, and so on.
- test – including new or correcting previous tests
- perf – performance improvements
- ci – continuous integration related
- build – changes that affect the build system or external dependencies
- revert – reverts a previous commit

## Structure

Commit messages should follow this minimal structure:

Header (one line)

Optional body (one or more paragraphs)

Optional footer (references, breaking changes)

## Header rules
- Format: `type(scope): short subject`
  - `type` examples: feat, fix, docs, style, refactor, perf, test, chore
  - `scope` is optional and describes the area (e.g., `ui`, `api`)
- Use imperative mood: "Add", "Fix", "Update" (not "Added" or "Fixes")
- Lower-case subject (except proper nouns)
- No trailing period
- Keep it <= 50 characters when possible

Good: `feat(auth): add JWT refresh endpoint`
Bad: `Added a refresh token endpoint.`

## Body (optional)
- Leave a blank line between header and body
- Explain *what* and *why*, not *how*
- Wrap lines at ~72 characters
- Use bullet points for lists or to explain tradeoffs

Example body:

```
Add server-side support for JWT refresh tokens.

This allows short-lived access tokens while keeping long-lived
refresh tokens for session continuity. The change introduces a new
`/refresh` endpoint and validates refresh tokens against the DB.
```

## Footer (optional)
- Reference issues: `Refs #123` or `Closes #123` (use `Closes` to auto-close)
- Mention breaking changes: `BREAKING CHANGE: description`

## Quick pre-commit checklist
- [ ] Is the subject <= 50 chars and imperative? 
- [ ] Did I include a scope if it clarifies the change?
- [ ] Did I write a body only when it helps explain _why_?
- [ ] Did I reference relevant issues or breaking changes?
- [ ] Is the message clear to someone unfamiliar with the change?

Keep it short, consistent, and useful — future you (and reviewers) will thank you.

## Full Commit Example

```
fix(parser): return empty AST for empty input

When the parser receives an empty string it previously threw an
uncaught error which caused the calling flow to crash. This change
returns an empty AST instead and adds a unit test covering the case.

BREAKING CHANGE: Parser now returns an empty AST object for empty
input instead of throwing; callers that depended on the exception
should be updated to handle the empty-AST case.

Closes #SG42
```