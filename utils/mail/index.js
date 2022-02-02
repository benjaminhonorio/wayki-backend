const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid");

exports.welcomeEmail = async (username, email) => {
  const options = {
    apiKey: process.env.API_KEY_SENDGRID,
  };

  let transporter = nodemailer.createTransport(sgTransport(options));

  let info = await transporter.sendMail({
    from: `${process.env.FROM_EMAIL_SENDGRID}`, // sender address
    to: `${email}`, // list of receivers
    subject: "Bienvenido a Wayki!", // Subject line
    text: `Hola, ${username} bienvenido a nuestra aplicacion Wayki!`, // plain text body
    html: `<b>Hola, ${username} bienvenido</b>`, // html body
  });
};

exports.changePassword = async (username, email, id) => {
  const options = {
    apiKey: process.env.API_KEY_SENDGRID,
  };

  let transporter = nodemailer.createTransport(sgTransport(options));

  let info = await transporter.sendMail({
    from: `${process.env.FROM_EMAIL_SENDGRID}`, // sender address
    to: `${email}`, // list of receivers
    subject: "Recupera tu contraseña", // Subject line
    text: `Hola, ${username}. Has clic en el siguiente link para poder recuperar tu contraseña: ${process.env.PASSWORD_RESET_URL}/${id}`, // plain text body
    html: `<b>Hola, ${username} Has clic en el siguiente link para poder recuperar tu contraseña: ${process.env.PASSWORD_RESET_URL}/${id}</b>`, // html body
  });
};
