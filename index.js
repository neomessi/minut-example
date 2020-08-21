const Minut = require('minut')
const routes = require('./ctrl/routes')

const minut = new Minut(__dirname, routes);
minut.run('dev');