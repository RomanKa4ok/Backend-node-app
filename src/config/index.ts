import 'dotenv/config';

export type Config = {
    PORT: string;
    DATABASE_URL: string;
    NODE_ENV: string;
}

const {
    PORT,
    DATABASE_URL,
    NODE_ENV
} = process.env;

const config: Config = {
    PORT: PORT || '3000',
    DATABASE_URL: DATABASE_URL || '',
    NODE_ENV: NODE_ENV || 'local'
}

export default config;