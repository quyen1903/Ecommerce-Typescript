import express from 'express';
import Redis from 'ioredis';

const redis = new Redis();

export const checkCache = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const cachedData = await redis.get('cachedData');
  
    if (cachedData) {
      res.send(JSON.parse(cachedData));
    } else {
      next(); // Continue to the route handler if data is not in the cache
    }
};