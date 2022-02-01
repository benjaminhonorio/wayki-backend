require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.body.token;
  if (!token)
    return res
      .status(401)
      .json({ error: true, message: "Acceso denegado - No hay token" });
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "Token inválido" });
  }
};

module.exports = verifyToken;
