const options = require('../knexfile.js');
const environment = process.env.NODE_ENV || 'development';
const config = options[environment];

module.exports = require('knex')(config);
