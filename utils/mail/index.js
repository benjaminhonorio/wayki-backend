const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid");
const config = require("../../config");

exports.run = async (username) => {
  var options = {
    apiKey: config.SENGRID_API_KEY,
  };

  let transporter = nodemailer.createTransport(sgTransport(options));

  let info = await transporter.sendMail({
    from: "'Michael Sanabria' <maicolsana12@gmail.com>", // sender address
    to: "maicolsana12@gmail.com", // list of receivers
    subject: "Correo de prueba", // Subject line
    text: "Prueba Sendgrid NodeJs", // plain text body
    html: `<b>Hola, ${username} la prueba ha funcionado</b>`, // html body
  });
};

// email()
//   .then(() => console.log('Email sent :)'))
//   .catch((e) => console.log(e));
