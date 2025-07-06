// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const passportLocalMongoose = require("passport-local-mongoose");

// const userSchema = new Schema({
//     email: {
//         type: String,
//         required: true,
//     }
// });

// userSchema.plugin(passportLocalMongoose);

// module.exports = mongoose.model("User", userSchema);



const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
  // 🔥 NO NEED to define username & password here if using passport-local-mongoose
});

userSchema.plugin(passportLocalMongoose); // ✅ Adds username & password automatically

module.exports = mongoose.model("User", userSchema);
