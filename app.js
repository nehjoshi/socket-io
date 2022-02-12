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
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id);
    })
})

server.listen(port, () => {
    console.log("Listening on port " + port);
})