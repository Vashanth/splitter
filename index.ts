import express from 'express';
import cors from 'cors';
import router from './routes';
import connectDB from './core/db';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors({
  origin: [process.env.FRONTEND_URL ?? 'http://localhost:3000', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());

// (req, res, next) => {
//   console.log('CORS check for:', req.headers.origin);
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
//   if (req.method === 'OPTIONS') {
//       res.sendStatus(204); // Preflight request response
//   } else {
//       next();
//   }
// }

app.use('/', router);

async function startServer() {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;