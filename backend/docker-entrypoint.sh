#!/bin/sh

# Wait for database to be available
echo "Waiting for database..."
while ! nc -z db 3306; do
  sleep 1
done

echo "Database is ready! Running migrations..."
python manage.py migrate

echo "Starting server..."
exec gunicorn backend.wsgi:application --bind 0.0.0.0:8000