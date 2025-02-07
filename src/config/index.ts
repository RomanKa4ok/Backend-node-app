import 'dotenv/config';
import type { Environment } from 'src/common/constants';

export type Config = {
    PORT: string;
    DATABASE_URL: string;
    NODE_ENV: Environment;
    MONGO_LOGS: boolean;
    MONGO_DATABASE_URL: string;
    JWT_SECRET: string;
}

const {
    PORT,
    DATABASE_URL,
    NODE_ENV,
    MONGO_DATABASE_URL,
    MONGO_LOGS,
    JWT_SECRET,
} = process.env; 

const config: Config = {
    PORT: PORT || '3000',
    DATABASE_URL: DATABASE_URL || '',
    NODE_ENV: NODE_ENV as Environment || '' ,
    MONGO_DATABASE_URL: MONGO_DATABASE_URL || '' ,
    MONGO_LOGS: MONGO_LOGS === '1',
    JWT_SECRET: JWT_SECRET || ''
}

export default config;