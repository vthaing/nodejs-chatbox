import * as process from 'process';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  mongoDbUrl: process.env.MONGO_DATABASE_URL,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  redisPassword: process.env.REDIS_PASSWORD,
  chatBoxInitEndpoint: process.env.CHAT_BOX_INIT_ENDPOINT,
  chatBoxConversationEndpoint: process.env.CHAT_BOX_CONVERSATION_ENDPOINT,
  messageAttachmentPath: process.env.MESSAGE_ATTACHMENT_PATH,
  messageAttachmentDisk: process.env.MESSAGE_ATTACHMENT_DISK,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: '3600s',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExpiresIn: '4400s',
});
