FROM node:12 as builder
RUN mkdir /build
WORKDIR /build
COPY . .
RUN ["yarn", "install", "--pure-lockfile"]
RUN ["yarn", "build"]
RUN ["rm", "-rf", "node_modules"]
ENV NODE_ENV=production
RUN ["yarn", "install", "--pure-lockfile"]

FROM node:12

RUN apt-get update && apt-get -y install cron
COPY ingest-cron /etc/cron.d/ingest-cron
RUN chmod 0644 /etc/cron.d/ingest-cron

RUN mkdir /application
ADD package.json index.js /application/
COPY --from=builder /build/dist /application/dist/
COPY --from=builder /build/node_modules /application/node_modules/
WORKDIR /application

ENV NODE_ENV=production
ENV ENV=prod
ENV CACHE=1
ENV DEBUG=0
ENV DB_URI=mongodb://root:example@mongo
ENV REDIS_HOST=redis

RUN crontab /etc/cron.d/ingest-cron
RUN touch /var/log/cron.log

ENTRYPOINT ["yarn", "start"]