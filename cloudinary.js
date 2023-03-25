const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: "drk5fmnnc",
  api_key: "932557588174391",
  api_secret: "mKkP7iO9Tn1OWgk6GqvylbJdj1E"
})

module.exports = cloudinary;