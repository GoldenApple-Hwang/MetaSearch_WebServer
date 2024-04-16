// models/neo4jModel.js
const neo4j = require('neo4j-driver');
const neo4jAddress = process.env.NEO4J_ADDRESS;
const dbUserName = process.env.NEO4J_USER;
const dbPassword = process.env.NEO4J_PASSWORD;

const driver = neo4j.driver(
  neo4jAddress,
  neo4j.auth.basic(dbUserName, dbPassword)
);

function session(options) {
  return driver.session(options);
}

module.exports = { session, driver };
