#!/usr/bin/env bash
set -euo pipefail

if [ "${RUN_MIGRATIONS:-0}" = "1" ]; then
    echo "Running database migrations..."
    alembic upgrade head
else
    echo "Skipping migrations (RUN_MIGRATIONS != 1)."
fi

echo "Starting application..."
exec "$@"
