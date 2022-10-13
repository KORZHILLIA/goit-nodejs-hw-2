const nodemailer = require("nodemailer");

const { UKRNET_PASSWORD } = process.env;
const from = "kiev_drum2006@ukr.net";

const mailConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: "kiev_drum2006@ukr.net",
    pass: UKRNET_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(mailConfig);

const sendMail = async (mail) => {
  try {
    await transporter.sendMail({ ...mail, from });
    return true;
  } catch (error) {
    return error.message;
  }
};

module.exports = sendMail;
