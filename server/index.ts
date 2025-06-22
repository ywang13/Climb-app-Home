import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Start Python FastAPI backend
const pythonProcess = spawn('python', ['main.py'], {
  cwd: path.join(__dirname, '..', 'backend'),
  stdio: 'inherit'
});

// Handle Python process exit
pythonProcess.on('exit', (code) => {
  console.log(`Python backend exited with code ${code}`);
  process.exit(code || 0);
});

// Proxy API requests to Python backend
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Backend service unavailable' });
  }
}));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist', 'public')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'public', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  pythonProcess.kill();
  process.exit(0);
});

process.on('SIGINT', () => {
  pythonProcess.kill();
  process.exit(0);
});