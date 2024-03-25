import * as process from 'process';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3005,
  brandId: process.env.BRAND_ID,
  chatBoxLibraryUrl: process.env.CHATBOX_LIBRARY_URL,
});
