#!/usr/bin/env sh

NGINX_TAG=1.23-alpine
PORT=$1

if [ -z "$PORT" ]; then
  PORT=8080
fi

echo "Exposing on port $PORT. Add a port number after this command to use something different"

docker run -d --rm -p "$PORT":80 -v "$PWD"/demo:/usr/share/nginx/html -w /app nginx:"$NGINX_TAG"
