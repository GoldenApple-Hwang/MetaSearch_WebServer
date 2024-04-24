// models/neo4jModel.js
import { driver as _driver, auth } from 'neo4j-driver';
const neo4jAddress = process.env.NEO4J_ADDRESS;
const dbUserName = process.env.NEO4J_USER;
const dbPassword = process.env.NEO4J_PASSWORD;

const driver = _driver(
  neo4jAddress,
  auth.basic(dbUserName, dbPassword)
);

function session(options) {
  return driver.session(options);
}

export default { session, driver };
