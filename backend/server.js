const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const authRoutes = require('./routes/auth');
const complaintsRoutes = require('./routes/complaints');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: 'http://localhost:5173' } });

connectDB();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintsRoutes);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
});

const PORT = process.env.PORT || 5000;
console.log('MONGO_URI:', process.env.MONGO_URI);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));