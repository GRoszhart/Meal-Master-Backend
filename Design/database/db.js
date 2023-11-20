const pgp = require('pg-promise')();

const connectionString = 'postgres://postgres:gtroszy@localhost:5432/MealMaster';

const db = pgp(connectionString);

module.exports = db;