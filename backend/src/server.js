import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import colors from 'colors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import notesRoutes from './routes/notesroutes.js';
import { connectDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// ✅ __dirname সঠিকভাবে সেটআপ (ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);  // ✅ dirname ব্যবহার করুন, resolve নয়!

// CORS (শুধু ডেভেলপমেন্টে)
if (process.env.NODE_ENV !== "production") {
    app.use(cors({
        origin: ['http://localhost:5173', 'http://localhost:5174'],
        credentials: true,
    }));
}

app.use(express.json());
app.use(rateLimiter);

// API Routes
app.use('/api/notes', notesRoutes);

// ✅ Static Files Serving (NODE_ENV চেক ছাড়া - সবসময় চালু)
const frontendPath = path.join(__dirname, "../../frontend/dist");
const indexPath = path.join(__dirname, "../../frontend/dist/index.html");

if (fs.existsSync(indexPath)) {
    console.log("📁 Serving frontend from:", frontendPath);
    console.log("✅ Index exists:", true);
    
    // CSP হেডার ফিক্স
    app.use((req, res, next) => {
        res.setHeader("Content-Security-Policy", 
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline' https:; " +
            "style-src 'self' 'unsafe-inline' https:; " +
            "img-src 'self' https:; " +
            "font-src 'self' https:; " +
            "connect-src 'self' http://localhost:* https:; " +
            "frame-src 'none';"
        );
        next();
    });
    
    // Static files সার্ভ করুন
    app.use(express.static(frontendPath));
    
    // React Router সাপোর্ট (API রুটের পরে)
    app.get("*", (req, res) => {
        if (!req.url.startsWith('/api/')) {
            res.sendFile(indexPath);
        }
    });
} else {
    console.log("⚠️ Frontend dist not found. Run 'npm run build' in frontend folder.");
    console.log("🔍 Looking for:", indexPath);
}

// সার্ভার শুরু
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`.green.bold);
    });
}).catch(err => {
    console.error("Database connection failed:".red.bold, err);
    process.exit(1);
});