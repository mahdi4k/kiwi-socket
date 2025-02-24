const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const LIARA_URL = process.env.LIARA_URL || "localhost";

const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

// Use Hamravesh Node Port (3005) dynamically
const PORT = process.env.PORT || 3005;

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

// Start server on 0.0.0.0 (required for external access)
app.listen(3005, () =>
    console.log(`app listening on port 3005 on ${LIARA_URL}`)
  );