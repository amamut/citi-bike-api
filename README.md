# city-bike-api

## Setup

Install docker engine locally: https://docs.docker.com/install/
Install yarn: https://classic.yarnpkg.com/en/docs/install/

## Running dev version

1. `docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=example mongo`
2. `yarn install --pure-lockfile`
3. `yarn dev`

## Running prod version (with Redis Caching)

1. `docker-compose up`

Default cache ttl is 10 seconds.
In Production Mode: Cron job ingests stations every 2 minutes and replaces collection.

## Ingestion

To populate the db locally when developing use command:`yarn ingest`.
Place on cron to keep up to date.

## Testing

1. Mongo running locally: `docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=example mongo`
2. `yarn test`
