import 'dotenv/config';
import type { Environment } from 'src/common/constants';

export type Config = {
    PORT: string;
    DATABASE_URL: string;
    NODE_ENV: Environment;
}

const {
    PORT,
    DATABASE_URL,
    NODE_ENV,
} = process.env; 

const config: Config = {
    PORT: PORT || '3000',
    DATABASE_URL: DATABASE_URL || '',
    NODE_ENV: NODE_ENV as Environment || '' ,
}

export default config;