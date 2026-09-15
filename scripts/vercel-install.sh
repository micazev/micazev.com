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

git submodule update --init --recursive

if [ ! -d content/notes ]; then
  echo "error: content/notes is missing after submodule update." >&2
  echo "       Check that CONTENT_TOKEN is set and still valid (fine-grained" >&2
  echo "       PATs expire) and grants Contents:Read on micazev/micazev-content." >&2
  exit 1
fi

npm install
