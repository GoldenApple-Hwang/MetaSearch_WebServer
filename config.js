import dotenv from 'dotenv';

console.log('Starting app...');
dotenv.config();
console.log('Environment variables loaded...');
console.log(`NEO4J_ADDRESS: ${process.env.NEO4J_ADDRESS}`);
