FROM golang:1.12.17-alpine3.11 AS build
RUN apk --no-cache add gcc g++ make ca-certificates git
RUN mkdir /app
WORKDIR /app

COPY go.mod go.sum ./

# Dependency install
RUN go get -d -v

#disable crosscompiling 
ENV CGO_ENABLED=0

#compile linux only
ENV GOOS=linux

COPY db_host db_host
COPY middleware middleware
COPY models models
COPY retry retry
COPY satuankerja satuankerja
COPY jabatan jabatan
COPY eventuser eventuser
COPY jobAttendance jobAttendance
COPY deviceToken deviceToken
COPY notificationWorker notificationWorker
COPY utils utils

RUN go install ./...

FROM alpine:3.7

WORKDIR /usr/bin

ARG POSTGRESQL_HOST
ARG POSTGRESQL_PORT

ENV TZ=Asia/Jakarta
RUN apk --update add tzdata && \
    cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
    
COPY --from=build /go/bin .
