import rateLimit from 'express-rate-limit';

export const attendanceRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many attendance requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});