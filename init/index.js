const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const rawData = require("./data.js");
const Ticket = require("../models/ticket.js");

const MONGO_URL = process.env.ATLASDB_URL;

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to Atlas");

    const fixedData = rawData.map(ticket => ({
      eventName: ticket.eventName,
      eventDate: ticket.eventDate,

      pricePerTicket: ticket.pricePerTicket,
      ticketsAvailable: ticket.ticketsAvailable ?? ticket.totalSeats,

      basePrice: ticket.basePrice ?? ticket.pricePerTicket,
      totalSeats: ticket.totalSeats,

      owner: ticket.owner,
      location: ticket.location,
      eventCategory: ticket.eventCategory,
      description: ticket.description,
    }));

    await Ticket.deleteMany({});
    const inserted = await Ticket.insertMany(fixedData);

    console.log(`Inserted ${inserted.length} tickets`);
    await mongoose.connection.close();
  } catch (err) {
    console.error("SEED ERROR:", err);
    process.exit(1);
  }
}

seedDB();
