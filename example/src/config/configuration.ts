import * as process from 'process';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3005,
  brandId: process.env.BRAND_ID,
  chatBoxSecretKey: process.env.CHATBOX_SECRET_KEY,
  chatBoxLibraryUrl: process.env.CHATBOX_LIBRARY_URL,
});
