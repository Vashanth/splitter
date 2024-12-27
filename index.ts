import express from 'express';
import router from './routes';
import connectDB from './database/db';

const app = express();
const port = process.env.PORT || 3000;

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

