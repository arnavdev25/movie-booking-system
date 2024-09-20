/**
 * Fastify plugin for Redis Cache.
 * Provides Redis Cache.
 * @file Redis Cache Plugin
 * @module Redis Cache Plugin
 * @category plugins
 * @subcategory cache
 */


import Redis from 'redis';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file


// Create and configure the Redis client
const redisClient = Redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});


// Connect the Redis client
(async () => {
    try {
        await redisClient.connect();
        console.log('Redis connected successfully');
    }

    catch (error) {
        console.error('Redis connection error:', error);
    }
})();



// Export the Redis client to be used in other files
export default redisClient;