# city-bike-api

## Running dev version

1. `docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=example mongo`
2. Install Redis locally or set env var to turn off caching: `export CACHE=0`
3. `yarn install --pure-lockfile`
4. `yarn dev`

Default cache ttl is 10 seconds.
In Production Mode: Cron job ingests stations every 2 minutes and replaces collection.

## Running prod version

1. `docker-compose up`

## Ingestion

To populate the db locally when developing use command:`yarn ingest`.
Place on cron to keep up to date.

## Testing

1. `yarn test`
