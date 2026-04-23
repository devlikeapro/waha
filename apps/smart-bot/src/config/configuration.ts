export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  webhookSecret: process.env.WH_SECRET || 'secret',
  database: {
    url: process.env.POSTGRES_URL,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  rateLimit: parseInt(process.env.RATE_LIMIT || '100', 10),
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  adminPhone: process.env.ADMIN_PHONE,
  visionUrl: process.env.VISION_URL || 'http://vision-worker:8000',
  dashboardApiKey: process.env.DASHBOARD_API_KEY,
});