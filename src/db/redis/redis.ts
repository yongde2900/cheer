import { Redis } from 'ioredis';

const redis = new Redis(6379, 'localhost');

export default redis;
