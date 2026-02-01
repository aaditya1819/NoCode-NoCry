import "dotenv/config";
import pg from "pg";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in environment variables");
}

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new pg.Pool({
    connectionString,
    ssl: connectionString.includes('sslmode=require') || connectionString.includes('neon') ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export default prisma 