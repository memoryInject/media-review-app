FROM python:3.9-slim-buster

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN apt-get update \
    # dependencies for building Python packages
    && apt-get install -y build-essential \
    # psycopg2 dependencies
    && apt-get install -y libpq-dev \
    # Translations dependencies
    && apt-get install -y gettext \
    # cleaning up unused files
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/lib/apt/lists/*

# Requirements are installed here to ensure they will be cached.
COPY ./requirements.txt /requirements.txt
RUN pip install -r /requirements.txt
RUN pip install ipython
RUN pip install flask

COPY ./compose/test/backend/entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//g' /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY ./compose/test/backend/start.sh /start.sh
RUN sed -i 's/\r$//g' /start.sh
RUN chmod +x /start.sh

COPY ./compose/test/backend/celery/worker/start.sh /start-celery-worker.sh
RUN sed -i 's/\r$//g' /start-celery-worker.sh
RUN chmod +x /start-celery-worker.sh

COPY ./compose/test/backend/celery/flower/start.sh /start-celery-flower.sh
RUN sed -i 's/\r$//g' /start-celery-flower.sh
RUN chmod +x /start-celery-flower.sh

COPY ./compose/test/backend/flask/start.sh /start-flask.sh
RUN sed -i 's/\r$//g' /start-flask.sh
RUN chmod +x /start-flask.sh

WORKDIR /app
COPY ./backend ./ 

# COPY flask service files
COPY ./compose/test/backend/flask/app.py ./
COPY ./compose/test/backend/flask/flush.sh ./
COPY ./compose/test/backend/flask/load.sh ./
RUN sed -i 's/\r$//g' ./flush.sh
RUN chmod +x ./flush.sh
RUN sed -i 's/\r$//g' ./load.sh
RUN chmod +x ./load.sh

ENTRYPOINT ["/entrypoint.sh"]
