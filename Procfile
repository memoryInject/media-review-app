release: bash ./release-tasks.sh
web: cd backend && daphne config.asgi:application --port $PORT --bind 0.0.0.0 -v2
