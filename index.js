const assert = require('assert');
const Minut = require('minut')
const MongoClient = require('mongodb').MongoClient;
const routes = require('./ctrl/routes')
require('dotenv').config()

// ~*~ poolSize: 10
MongoClient.connect(
    process.env.DB_CON_STR,
    {
        // useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    async (err, client) => {
        assert.equal(null, err);

        console.log("Connected successfully to Mongo DB server");
        const mongodb = await client.db(process.env.DB_NAME);

        const minut = new Minut(__dirname, routes, mongodb);
        minut.run();
});