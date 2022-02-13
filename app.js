const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'https://nj-socket-io-chat.netlify.app',
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log("User with ID: " + socket.id + " joined room: " + data);
    })

    socket.on("send_message", data => {
        console.log(data);
        socket.to(data.id).emit("receive_message", data);
    });

    socket.on("typing", (data) => {
        console.log(data.name + " is typing...");
        socket.to(data.id).emit("typing", data.name);
    });
    socket.on("not_typing", (data) => {
        socket.to(data.id).emit("not_typing");
    })

    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id);
    })
})

server.listen(port, () => {
    console.log("Listening on port " + port);
})