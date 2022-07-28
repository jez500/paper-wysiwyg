#!/usr/bin/env sh

NGINX_TAG=1.23-alpine
PORT=$1

if [ -z "$PORT" ]; then
  PORT=8080
fi

docker run -d -p "$PORT":80 -v "$PWD"/demo:/usr/share/nginx/html -w /app node:"$NGINX_TAG" "$@"
