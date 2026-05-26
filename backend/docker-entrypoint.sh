#!/bin/sh

echo "Waiting for database to be ready..."
sleep 5

echo "Running database migrations..."
npm run migrate

echo "Starting application..."
npm start
