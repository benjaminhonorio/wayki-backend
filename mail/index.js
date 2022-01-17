const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid");

exports.run = async (username) => {
  var options = {
    apiKey:
      "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",
  };

  // Sengrid Secret API Key
  // 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

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
