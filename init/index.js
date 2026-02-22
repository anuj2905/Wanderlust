require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL;

async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log("✅ Connected to MongoDB Atlas");

    await initDB();
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Connection error:", err);
  }
}

const initDB = async () => {
  await Listing.deleteMany({});

  const updatedData = initData.data.map((obj) => ({
    ...obj,
    owner: "686373d3529fc509d3501634", // your user id
    category: obj.category || "Beach", // default category
  }));

  await Listing.insertMany(updatedData);
  console.log("✅ Data initialized successfully");
};

main();