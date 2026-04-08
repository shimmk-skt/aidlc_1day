import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/inventrix',
  dbMaxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS || '20'),
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'change-me-refresh-in-production',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  tossSecretKey: process.env.TOSS_SECRET_KEY || '',
  easypostApiKey: process.env.EASYPOST_API_KEY || '',
  bedrockClaudeModelId: process.env.BEDROCK_CLAUDE_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0',
  bedrockImageModelId: process.env.BEDROCK_IMAGE_MODEL_ID || 'amazon.nova-canvas-v1:0',
};
