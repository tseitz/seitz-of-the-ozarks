import sirv from "sirv";
import http from "http";
import polka from "polka";
import io from "socket.io";
import compression from "compression";
import * as sapper from "@sapper/server";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

const server = http.createServer();

let numUsers = 0;
io(server).on("connection", function (socket) {
  ++numUsers;
  let message = "Server: A new user has joined the chat";
  socket.emit("user joined", { message, numUsers });
  socket.broadcast.emit("user joined", { message, numUsers });

  socket.on("message", function (msg) {
    db.collection("chat").insertOne({ message: msg }, function (err, r) {
      assert.equal(null, err);
      assert.equal(1, r.insertedCount);
    });
    socket.broadcast.emit("message", msg);
  });

  socket.on("disconnect", function () {
    --numUsers;
    socket.broadcast.emit("user left", numUsers);
  });

  socket.on("user disconnect", function (name) {
    socket.broadcast.emit("message", `Server: ${name} has left the chat.`);
  });
});

polka({ server })
  .use(
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware()
  )
  .listen(PORT, (err) => {
    if (err) console.log("error", err);
  });
