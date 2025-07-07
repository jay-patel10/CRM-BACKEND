import { Sequelize, DataTypes } from 'sequelize';
import config from '../config/config.js'; // ✅ use .js, not esm if CLI needs it

// Import models
import User from './user.js';
import Client from './client.js';

const db = {};
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialize Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port || 3306,
    dialect: dbConfig.dialect,
    logging: false,
    define: {
      freezeTableName: true, // prevent plural table names
      underscored: false     // use camelCase
    }
  }
);

// Test DB connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');
  } catch (err) {
    console.error('❌ Database connection error:', err);
  }
})();

// Initialize models
User.init(sequelize, DataTypes);
Client.init(sequelize, DataTypes);

// Add to db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Client = Client;

// Setup associations
Object.values(db).forEach(model => {
  if (model.associate) {
    model.associate(db);
  }
});

export default db;
