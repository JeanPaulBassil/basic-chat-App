const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
let currentId = 1;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected" + currentId);
  io.emit("user Connected", currentId++);

  socket.on("chat message", (msg, name, id) => {
    console.log(`message:${msg}, name:${name}, id:${id}`);
    if (name) {
      io.emit("chat message", msg, name);
    } else {
      io.emit("user name", msg, id);
    }
  });

  socket.on("typing", (name, id) => {
    io.emit("typing", name, id);
  });

  socket.on("not typing", (name, id) => {
    io.emit("not typing", name, id);
  });
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
