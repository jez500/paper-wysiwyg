#!/usr/bin/env sh

NODE_TAG=14.20.0-alpine

docker run -it -v "$PWD":/app -w /app node:14.20.0-alpine "$@"
