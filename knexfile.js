require("dotenv").config();
const pg = require("pg");
pg.defaults.ssl = false;

console.info("----------------------------");
console.info("process.env.POSTGRES_DEV_HOST =>", process.env.NODE_ENV);
console.info("----------------------------");


module.exports = {
    local: {
        client: "pg",
        useNullAsDefault: true,
        connection: {
            host: process.env.POSTGRES_DEV_HOST,
            port: process.env.POSTGRES_DEV_PORT,
            user: process.env.POSTGRES_DEV_USER,
            password: process.env.POSTGRES_DEV_PASSWORD,
            database: process.env.POSTGRES_DEV_DATABASE,
        },
        migrations: {
            directory: "./db/migrations",
        },
        seeds: {
            directory: "./db/seeds",
        },
    },
    development: {
      //
    },
    production: {
       //
    },

};
