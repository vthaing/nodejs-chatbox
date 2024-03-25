import * as process from 'process';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  mongoDbUrl: process.env.MONGO_DATABASE_URL,
});
