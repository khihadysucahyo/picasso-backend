FROM python:3.6-alpine

RUN apk update && \
    apk add postgresql-dev \
    gcc \
    python3-dev \
    musl-dev && \
    pip3 install -U pip setuptools && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt /

WORKDIR /

RUN pip install -r ./requirements.txt --no-cache-dir

COPY . /app/

WORKDIR /app

ENV FLASK_APP=app.py
CMD flask run -h 0.0.0.0 -p 80
