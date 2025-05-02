const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.DB_HOST);

let db = null;

const getCollection = (name) => {
  return db?.collection(name);
};

const connect = async () => {
  await client.connect();
  console.log("Connected successfully to server");

  db = client.db("botik");
};

module.exports = { connect, getCollection };
