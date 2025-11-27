require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authHandler = require('./api/auth');
const notesHandler = require('./api/notes');
const uploadHandler = require('./api/upload');
const chatHandler = require('./api/chat');

const app = express();
app.use(bodyParser.json());

// routes (mimic vercel endpoints)
app.post('/api/auth/register', authHandler);
app.post('/api/auth/login', authHandler);
app.post('/api/notes', notesHandler);
app.get('/api/notes', notesHandler);
app.post('/api/upload', uploadHandler);
app.post('/api/chat', chatHandler);
app.get('/api/chat', chatHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Local server running on port', PORT));
