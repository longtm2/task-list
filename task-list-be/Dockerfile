# syntax=docker/dockerfile:1

ARG RUBY_VERSION=3.4.10
FROM ruby:${RUBY_VERSION}-slim

WORKDIR /rails

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential git libpq-dev libvips pkg-config postgresql-client && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

ENV BUNDLE_PATH="/bundle" \
    GEM_HOME="/bundle" \
    PATH="/bundle/bin:${PATH}"

RUN groupadd --system --gid 1000 rails && \
    useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash && \
    mkdir -p /bundle /rails && \
    chown -R rails:rails /bundle /rails

USER rails:rails

COPY --chown=rails:rails Gemfile Gemfile.lock ./
RUN bundle install

COPY --chown=rails:rails . .

EXPOSE 3000

CMD ["./bin/rails", "server", "-b", "0.0.0.0", "-p", "3000"]
