const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid");
const config = require("../../config");

exports.run = async (username, email) => {
  const options = {
    apiKey: config.SENDGRID_API_KEY,
  };

  let transporter = nodemailer.createTransport(sgTransport(options));

  let info = await transporter.sendMail({
    from: "maicolsana12@gmail.com", // sender address
    to: `${email}`, // list of receivers
    subject: "Correo de prueba", // Subject line
    text: "Prueba Sendgrid NodeJs", // plain text body
    html: `<b>Hola, ${username} bienvenido</b>`, // html body
  });
};
