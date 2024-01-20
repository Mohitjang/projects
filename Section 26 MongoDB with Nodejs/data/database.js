// importing mongodb third party package
const mongodb = require("mongodb");

// creating object of mongodb client
const MongoClient = mongodb.MongoClient;

let database;

async function connect() {
  // to connect our mongodb database to our mongo client
  const client = await MongoClient.connect("mongodb://localhost:27017");
  database = client.db("blog");
}

function getDb() {
  if (!database) {
    throw { message: "Database connection is not established!" };
  }
  return database;
}

module.exports = {
  connectToDatabase: connect,
  getDb: getDb,  
};
