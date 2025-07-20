if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
console.log(process.env);

// Required Modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Models
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const User = require("./models/user.js");

// Utilities
const wrapAsync = require("./until/wrapasync.js");
const ExpressError = require("./until/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// Routers
const userRouter = require("./routes/user.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");

// MongoDB Connection
const dbUrl = process.env.ATLASDB_URL;
async function main() {
  await mongoose.connect(dbUrl);
}
main().catch((err) => console.log(err));

// App Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Session Store Setup
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Error in mongo session store", err);
});

// Session Configuration
const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOption));
app.use(flash());

// Passport Authentication Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash & User Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use(userRouter);

// 🏨 Booking Flow Routes
app.get("/bookings/:id/details", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("bookings/guest-details", { listing });
});

app.post("/bookings/:id/payment", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  const guestData = req.body;
  res.render("bookings/payment", { listing, guestData });
});

app.post("/bookings/:id/receipt", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  const booking = req.body;
  res.render("bookings/receipt", { listing, booking });
});

// Error Handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Start Server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
