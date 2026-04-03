import dotenv from 'dotenv';
import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';

dotenv.config();

function validateRequiredEnv() {
  const requiredVariables = ['MONGODB_URI', 'CLIENT_URL', 'ADMIN_EMAIL', 'ADMIN_PASSWORD', 'AUTH_SECRET'];
  const missingVariables = requiredVariables.filter((key) => !process.env[key]?.trim());

  if (missingVariables.length) {
    throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}`);
  }
}

const app = createApp();
const port = Number(process.env.PORT || 5000);

validateRequiredEnv();
await connectDatabase();

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `Port ${port} is already in use. Stop the other process or run this app with a different PORT.`
    );
    console.error(`PowerShell example: $env:PORT=${port + 1}; npm start`);
    process.exit(1);
  }

  throw error;
});
