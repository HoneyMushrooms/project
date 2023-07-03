import rateLimit from 'express-rate-limit';

export default rateLimit({
	windowMs: 50 * 60 * 1000, // 1 hour
	max: 50, // Limit each IP to 100 requests per `window` 
})