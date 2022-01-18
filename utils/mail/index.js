const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid");
const config = require("../../config");

exports.run = async (username) => {
  const options = {
    apiKey: config.SENDGRID_API_KEY,
  };

  let transporter = nodemailer.createTransport(sgTransport(options));

  let info = await transporter.sendMail({
    from: "'benjamin' <benjaminfx.16@gmail.com>", // sender address
    to: "benjaminhonorio.12@gmail.com", // list of receivers
    subject: "Correo de prueba", // Subject line
    text: "Prueba Sendgrid NodeJs", // plain text body
    html: `<b>Hola, ${username} bienvenido</b>`, // html body
  });
};
