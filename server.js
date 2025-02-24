const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const LIARA_URL = process.env.LIARA_URL || "localhost";
const cors = require("cors");

app.use(
    cors({
      origin: "*", // Allow all origins
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
    })
  );

const io = new Server(server, {
    cors: {
      origin: "*", // Allow frontend connections
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
    },
  });
  
// Use Hamravesh Node Port (3005) dynamically
const PORT = process.env.PORT || 3000;


 


io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinConversation', ({ conversationId }) => {
        socket.join(conversationId);
        console.log(`User ${socket.id} joined conversation ${conversationId}`);
    });

    socket.on('sendMessage', ({ conversationId, message }) => {
        io.to(conversationId).emit('newMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
app.get("/", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(`<h1>✅ Socket.IO Running on Port: ${PORT}</h1>`);
  
    // Check if WebSocket Server is initialized
    if (io) {
      res.write(`<p>🟢 WebSocket Server is initialized</p>`);
    } else {
      res.write(`<p>🔴 WebSocket Server is NOT initialized</p>`);
    }
  
    // Display connected clients
    const clients = io.sockets.sockets.size;
    res.write(`<p>👥 Connected Clients: ${clients}</p>`);
  
    res.end();
  });
  
// Start server on 0.0.0.0 (required for external access)
app.listen(3000, "0.0.0.0",() =>
    console.log(`app listening on port 3000 on ${LIARA_URL}`)
  );