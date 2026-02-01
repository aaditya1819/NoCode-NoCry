import express, { Request, Response, NextFunction } from 'express';
import 'dotenv/config';
console.log("🟢 server.ts is starting up...");
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';
import userRouter from './routes/userRoutes.js';
import projectRouter from './routes/projectRoutes.js';
import prisma from './lib/prisma.js';

const app = express();
const port = 3000;

const corsOptions = {
    origin: process.env.TRUSTED_ORIGINS?.split(',') || [],
    credentials: true,
}

// REQUEST LOGGER
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
    next();
});

console.log("🟢 Middleware setup starting...");
app.use(cors(corsOptions));
console.log("🟢 CORS configured");

// Better Auth mount
app.use('/api/auth', toNodeHandler(auth));
console.log("🟢 Auth handler configured");

app.use(express.json({ limit: '50mb' }));
console.log("🟢 JSON middleware configured");

// Health check
app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.get('/api/health', async (req: Request, res: Response) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: 'ok', database: 'connected' });
    } catch (err: any) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

console.log("🟢 Routes setup starting...");
app.use('/api/user', userRouter);
app.use('/api/project', projectRouter);
console.log("🟢 Routes configured");

// Global Error Handler
app.use((err: any, req: any, res: any, next: any) => {
    console.error("🔥 GLOBAL ERROR 🔥", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
});

// FORCE PROCESS TO STAY ALIVE
setInterval(() => {
    // console.log("💓 Heartbeat...");
}, 30000);

app.listen(port, () => {
    console.log(`🚀 Server is listening on http://localhost:${port}`);
    console.log("🟢 Ready for requests!");
});