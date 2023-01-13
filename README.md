# Rhyme Bot

This is very simple example of telegram bot via nodejs (node-telegram-bot-api).

<br>

Teches: Javascript, Node.js, PostgreSQL, Docker, Telegram (BotFather).

<hr>

### How to start prod

1) git clone
2) setup .env file (example in db.js file)
3) start something of that:

```
docker compose up
```

```
docker-compose up
```

4) check logs and enjoy

<hr>

#### How to start dev

1) setup postgresql in docker, for example:
   `docker run --name postgresdb -e POSTGRES_USER=admin
   -e POSTGRES_PASSWORD=adminpass -e POSTGRES_DB=music-bot-db
   -d -p 5432:5432 postgres:15.1-alpine`
2) install packages - `npm i`
3) run app instance - `npm run-script dev`

