FROM node:12

RUN apt-get update && apt-get -y install cron
COPY ingest-cron /etc/cron.d/ingest-cron
RUN chmod 0644 /etc/cron.d/ingest-cron

RUN mkdir /application
ADD . /application
WORKDIR /application

ENV NODE_ENV=production
ENV ENV=prod
ENV CACHE=1
ENV DEBUG=0
ENV DB_URI=mongodb://root:example@mongo
ENV REDIS_HOST=redis
RUN ["yarn", "install", "--pure-lockfile"]

RUN crontab /etc/cron.d/ingest-cron
RUN touch /var/log/cron.log

ENTRYPOINT ["yarn", "start"]