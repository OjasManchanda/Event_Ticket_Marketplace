const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });


const mongoose = require("mongoose");
const initData = require("./data.js");
const Ticket = require("../models/ticket.js");

const MONGO_URL = process.env.ATLASDB_URL;


async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to Atlas");
}

const initDB = async () => {
  await Ticket.deleteMany({});
  await Ticket.insertMany(initData);
  console.log("Data successfully inserted");
};

main()
  .then(initDB)
  .then(() => mongoose.connection.close())
  .catch((err) => console.error(err));
