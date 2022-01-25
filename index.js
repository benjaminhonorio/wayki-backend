const app = require("./app");
const http = require("http");
const config = require("./config");

const PORT = config.PORT;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
