import pino from 'pino';
import { ENV } from '@config/EnvConfig';

export const logger = pino({
  level: ENV.LOG_LEVEL,
  transport: {
    target: 'pino-pretty',
    options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
  },
});
