FROM ruby:3.3.5-alpine3.20

ENV BUNDLER_VERSION=2.4.18 \
    PATH=/usr/local/bundle/bin:$PATH

RUN apk --no-cache add \
    build-base \
    linux-headers \
    git \
    tzdata \
    nodejs \
    npm \
    yarn \
    sqlite-dev \
    curl-dev \
    libffi-dev \
    zlib-dev \
    bash

RUN gem install bundler -v "$BUNDLER_VERSION"