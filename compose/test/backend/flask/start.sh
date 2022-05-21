#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset

export FLASK_ENV=development
flask run -h 0.0.0.0 -p 4000
