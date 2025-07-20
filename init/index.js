require("dotenv").config(); // ✅ Load .env

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("❌ Connection error:", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  await Listing.deleteMany({});

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "686373d3529fc509d3501634", // use your real user id
  }));

  await Listing.insertMany(initData.data);
  console.log("✅ Data initialized successfully");
};

initDB();
