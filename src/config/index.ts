import 'dotenv/config';

export type Config = {
    PORT: string;
    DATABASE_URL: string;
}

const {
    PORT,
    DATABASE_URL
} = process.env;

const config: Config = {
    PORT: PORT || '3000',
    DATABASE_URL: DATABASE_URL || ''
}

export default config;