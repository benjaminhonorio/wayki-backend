const app = require("./app");
const http = require("http");
const config = require("./config");
const { DATABASE, PORT } = config;
const { connect } = require("./database");

connect({
  protocol: DATABASE.protocol,
  url: DATABASE.url,
  username: DATABASE.username,
  password: DATABASE.password,
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
