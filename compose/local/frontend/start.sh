#!/bin/sh

set -o errexit
set -o nounset

export NODE_OPTIONS=--openssl-legacy-provider

npm run start
