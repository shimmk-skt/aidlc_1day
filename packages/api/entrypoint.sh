#!/bin/sh
set -e

echo "Running database migration..."
node dist/config/migrate.js

echo "Running database seed..."
node dist/config/seed.js

echo "Starting application..."
exec node dist/index.js
