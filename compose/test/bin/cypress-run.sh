#!/bin/bash

docker-compose -f docker-compose.test.yml run -it cypress cypress run
