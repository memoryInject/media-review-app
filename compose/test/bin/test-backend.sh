#!/bin/bash

docker-compose -f docker-compose.test.yml exec -it backend python manage.py test 
