const log = console.log;

const path = require("path");
const express = require("express");
const app = express();

const port = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, "public")));

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.get("*", (req, res) => {
  const pageRoutes = ["/"];
  if (!pageRoutes.includes(req.url)) {
    res.status(404).send("404 - Not Found");
  }

  res.sendFile(path.join(__dirname, "/public/index.html"));
});

server.listen(port, () => {
  log(`listening on port ${port}...`);
});
