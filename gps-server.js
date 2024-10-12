const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');

const app = express();
const port = 3001;  // This will run on port 3001
app.use(cors());    // Allow cross-origin requests from your Next.js app

// SSE route to stream live GPS data
app.get('/gps', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // flush the headers to establish SSE connection

  const pythonProcess = spawn('python3', ['gps_reader.py']);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`GPS data: ${data.toString()}`);
    res.write(`data: ${data.toString()}\n\n`);  // Send data to client
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error: ${data.toString()}`);
  });

  // Handle when the client closes the connection
  req.on('close', () => {
    console.log('Client closed connection.');
    pythonProcess.kill(); // Stop Python script when client disconnects
    res.end();
  });
});

app.listen(port, () => {
  console.log(`GPS server running on port ${port}`);
});
