#!/usr/bin/env bash
# Vercel install step.
#
# Vercel does not support private git submodules: its clone token is scoped to
# micazev.com alone, so content/ (github.com/micazev/micazev-content) comes back
# empty and gatsby-source-filesystem fails on the missing content/notes path.
# See https://github.com/vercel/community/discussions/44
#
# CONTENT_TOKEN is a fine-grained GitHub PAT with Contents:Read on
# micazev-content, set in the Vercel project's environment variables.
set -euo pipefail

if [ -n "${CONTENT_TOKEN:-}" ]; then
  git config --global \
    url."https://x-access-token:${CONTENT_TOKEN}@github.com/".insteadOf \
    "https://github.com/"
else
  echo "warning: CONTENT_TOKEN is not set; the private submodule will not clone" >&2
fi

# --remote builds the content repo's latest main rather than the commit this
# repo pins, so a save in the CMS (/admin) goes live without bumping the
# submodule pointer here.
git submodule update --init --recursive --remote

# A preview of a branch builds the content branch of the same name when one
# exists, so a change that needs new content can be previewed before either
# side is merged. Production (main) and branches without a twin keep main.
ref="${VERCEL_GIT_COMMIT_REF:-}"
if [ -n "$ref" ] && [ "$ref" != "main" ] &&
  git -C content ls-remote --exit-code --heads origin "$ref" >/dev/null; then
  echo "content: using branch $ref"
  git -C content fetch --depth 1 origin "refs/heads/$ref"
  git -C content checkout --detach FETCH_HEAD
fi

if [ ! -d content/notes ]; then
  echo "error: content/notes is missing after submodule update." >&2
  echo "       Check that CONTENT_TOKEN is set and still valid (fine-grained" >&2
  echo "       PATs expire) and grants Contents:Read on micazev/micazev-content." >&2
  exit 1
fi

npm install
