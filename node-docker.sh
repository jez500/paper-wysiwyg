#!/usr/bin/env sh

NODE_TAG=14.20.0-alpine

docker run -it --rm -v "$PWD":/app -w /app node:"$NODE_TAG" "$@"
