import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import {limiter} from './middleware/rate-limit.js';
import {requestLogger, errorLogger} from './middleware/logger.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(limiter);

app.get('/', (_, res) => {
  res.json({message: 'SprintSync API'});
});

app.use('/api', routes);

app.use(errorLogger);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
