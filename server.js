const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

// Use Hamravesh Node Port (32571) dynamically
const PORT = process.env.PORT || 32571;

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
server.listen(PORT, '0.0.0.0', () => {
    const publicHost = process.env.PUBLIC_HOST || '600b4657-489e-4f71-b9f0-af5ec8811d17.hsvc.ir';
    console.log(`WebSocket server running at ws://${publicHost}:${PORT}`);
});
