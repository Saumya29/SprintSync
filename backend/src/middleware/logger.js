// Dev: Logs to local files (logs/access.log, logs/error.log)
// Prod: Would stream to ELK stack for centralized logging

import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.join(dirname, '../../logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, {recursive: true});
}

const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), {flags: 'a'});
const errorLogStream = fs.createWriteStream(path.join(logDir, 'error.log'), {flags: 'a'});

morgan.token('user-id', (req) => req.user?.id || 'anonymous');

const logFormat = (tokens, req, res) => JSON.stringify({
  method: tokens.method(req, res),
  path: tokens.url(req, res),
  userId: tokens['user-id'](req, res),
  latency: `${tokens['response-time'](req, res)}ms`
});

export const requestLogger = morgan(logFormat, {
  stream: {
    write: (message) => {
      console.log(message.trim());
      accessLogStream.write(message);
    }
  }
});

export const errorLogger = (err, req, res, _next) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    userId: req.user?.id || 'anonymous',
    error: {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  };

  const errorMessage = JSON.stringify(errorLog);
  console.error(errorMessage);
  errorLogStream.write(`${errorMessage}\n`);

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
};
