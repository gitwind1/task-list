FROM ruby:3.3.5-alpine3.20

RUN apk add --no-cache build-base linux-headers git bash nodejs npm redis postgresql-dev postgresql-client tzdata

ENV BUNDLER_VERSION=2.4.0
ENV RAILS_ENV=production

RUN gem install bundler -v $BUNDLER_VERSION

WORKDIR /app

COPY Gemfile Gemfile.lock /app/

RUN bundle install --without development test

COPY . /app

EXPOSE 3000

CMD ["sh", "-c", "redis-server & bundle exec rails server -b 0.0.0.0 -p 3000"]
