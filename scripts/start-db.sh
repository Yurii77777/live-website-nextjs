#!/bin/bash

# Script to start the Docker container with PostgreSQL
# If the container does not start or is not healthy, the script will exit with an error

set -e

echo "🚀 Starting Docker container with PostgreSQL..."

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null && ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed"
    exit 1
fi

# Start the container
if command -v docker-compose &> /dev/null; then
    docker-compose up -d
else
    docker compose up -d
fi

echo "⏳ Waiting for the database to be ready..."

# Maximum wait time (in seconds)
MAX_WAIT=60
ELAPSED=0
INTERVAL=2

# Waiting for the container to be healthy
while [ $ELAPSED -lt $MAX_WAIT ]; do
    # Check the health status of the container
    HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' live-website-db 2>/dev/null || echo "none")

    if [ "$HEALTH_STATUS" = "healthy" ]; then
        echo "✅ PostgreSQL is ready to work!"
        exit 0
    elif [ "$HEALTH_STATUS" = "none" ]; then
        # If healthcheck is not configured, check if the container is running
        IS_RUNNING=$(docker inspect --format='{{.State.Running}}' live-website-db 2>/dev/null || echo "false")
        if [ "$IS_RUNNING" = "true" ]; then
            echo "⚠️  Healthcheck is not configured, but the container is running"
            sleep 5  # Additional pause for database initialization
            exit 0
        fi
    fi

    echo "⏳ Waiting... ($ELAPSED/$MAX_WAIT seconds)"
    sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
done

echo "❌ Error: PostgreSQL did not start in $MAX_WAIT seconds"
echo "Check the logs: docker-compose logs postgres"
exit 1
