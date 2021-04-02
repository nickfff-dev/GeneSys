# docker/backend/Dockerfile

FROM python:3.8.3-alpine

WORKDIR /app
ADD ./backend/requirements.txt /app/backend/

RUN \
    apk add --no-cache postgresql-libs && \
    apk add --no-cache --virtual .build-deps postgresql-dev gcc musl-dev python3-dev libffi-dev openssl-dev cargo 

RUN pip install --upgrade pip
RUN pip install gunicorn
RUN pip install psycopg2-binary

RUN pip install -r backend/requirements.txt
RUN apk --purge del .build-deps

ADD ./docker /app/docker
ADD ./backend /app/backend