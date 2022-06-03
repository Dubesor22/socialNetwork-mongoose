const nodemailer = require("nodemailer");
const {USER , PASS}  = process.env
require("dotenv").config();


let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: 
  {user: USER,
  pass: PASS},
});

module.exports = transporter;
