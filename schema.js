// const joi = require("joi");
// const review = require("./models/review");


// module.exports.listingSchema = joi.object({
//     listing: joi.object({
//         title: joi.string().required(),
//         description: joi.string().required(),
//         location: joi.string().required(),
//         country: joi.string().required(),
//         price: joi.number().required().min(0),
//         image: joi.string().allow("", null)  // ✅ use lowercase
//     }).required()
// });


// module.exports.reviewSchema = joi.object({
//     review : joi.object({
//         rating : joi.number().required().min(1).max(5),
//         comment : joi.string().required(),
//     }).required()
// });


// schema.js
const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    category: Joi.string().required() // ✅ allow category
  }).required()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required()
  }).required()
});

