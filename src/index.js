import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './models/index.js';
import apiRoutes from './routes/index.js';

// 👉 NEW Swagger imports
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));

// 👉 Mount Swagger before API routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api', apiRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Welcome to the Client Management API');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start Server after DB Connect
const PORT = process.env.PORT || 3001;

db.sequelize.authenticate()
  .then(() => {
    console.log('DB connected');
    return db.sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });
