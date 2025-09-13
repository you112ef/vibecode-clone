const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const codeExecutionService = require('./services/codeExecution');
const dockerService = require('./services/docker');
const aiService = require('./services/ai');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/execute', async (req, res) => {
  try {
    const { code, language, stdin } = req.body;
    const result = await codeExecutionService.execute(code, language, stdin);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/complete', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    const result = await aiService.generateCompletion(prompt, context);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Client ${socket.id} joined room ${roomId}`);
  });

  socket.on('code-change', (data) => {
    socket.to(data.roomId).emit('code-update', data);
  });

  socket.on('run-code', async (data) => {
    try {
      const result = await codeExecutionService.execute(
        data.code, 
        data.language || 'javascript',
        data.stdin
      );
      
      socket.emit('execution-result', result);
    } catch (error) {
      socket.emit('execution-error', { error: error.message });
    }
  });

  socket.on('terminal-input', async (data) => {
    try {
      const result = await dockerService.executeCommand(data.command);
      socket.emit('terminal-output', result);
    } catch (error) {
      socket.emit('terminal-error', { error: error.message });
    }
  });

  socket.on('ai-request', async (data) => {
    try {
      const result = await aiService.generateCompletion(data.prompt, data.context);
      socket.emit('ai-response', result);
    } catch (error) {
      socket.emit('ai-error', { error: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, server };
