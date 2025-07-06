const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const wrapasync = require("../until/wrapasync.js");
const userController = require("../controllers/user.js");



router
    .route("/signup")
    .get((req, res) => {res.render("users/signUp")})    // GET signup form
    .post( wrapasync(userController.signUp));           // POST signup




router
    .route("/login")
    .get((req, res) => res.render("users/login.ejs"))      // GET login form
    .post( saveRedirectUrl,
     passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
     }),
     (userController.login));                // POST login


// GET logout
router.get("/logout", (userController.logout));

module.exports = router;
