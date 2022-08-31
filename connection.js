// Do not change this file
require("dotenv").config();
const { MongoClient } = require("mongodb");

async function main(callback) {
  try {
    await MongoClient.connect(process.env.MONGO_URI, (err, db) => {
      if (err) {
        console.log("Database error: " + err);
      } else {
        console.log("Successful database connection and db is: ", db);
      }
    });
  } catch (error) {
    console.log("Database error: " + error);
  } finally {
    MongoClient.close();
  }
}

module.exports = main;
