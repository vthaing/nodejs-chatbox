import * as process from 'process';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  mongoDbUrl: process.env.MONGO_DATABASE_URL,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  redisPassword: process.env.REDIS_PASSWORD,
});