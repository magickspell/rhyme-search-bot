import {Sequelize} from 'sequelize';
import {config} from 'dotenv';
config()

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  }
)

/** for connection in docker use "postgresql" container name for db
 *  and DB_HOST="postgresql" in .env (name could be changed)
 *
 *  .env example:
 *
 *  # Bot
 * BOT_TOKEN="tokenForTelegramBot"
 *
 * # App
 * PORT=5000
 *
 * # database conection
 * DB_NAME="music-bot-db"
 * DB_USER="admin"
 * DB_PASSWORD="adminpass"
 * DB_HOST="postgresql"
 * DB_PORT=5432
 *
 *  */