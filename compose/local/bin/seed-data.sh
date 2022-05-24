#!/bin/bash

docker-compose exec -it backend python manage.py loaddata user userprofile project review asset media feedback
