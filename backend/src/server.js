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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(__filename);

//middleware
if(process.env.NODE_ENV !== "production"){
    const corsOptions = {
        origin: ['http://localhost:5173','http://localhost:5174'],
    }
    app.use(cors(corsOptions));
}


app.use(express.json());
app.use(rateLimiter);

// app.use((req, res, next) => {
//     let methodColor;
//     switch (req.method) {
//         case 'GET':
//             methodColor = colors.green;
//             break;
//         case 'POST':
//             methodColor = colors.blue;
//             break;
//         case 'PUT':
//             methodColor = colors.yellow;
//             break;
//         case 'DELETE':
//             methodColor = colors.red;
//             break;
//         default:            
//             methodColor = colors.white;
//     }
//     console.log(methodColor(`${req.method} ${req.url}`));
//     next();
// });

app.use('/api/notes', notesRoutes);

if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "../../frontend/dist");
    const indexPath = path.join(__dirname, "../../frontend/dist/index.html");
    
    console.log("📁 Frontend path:", frontendPath);
    console.log("📄 Index path:", indexPath);
    console.log("✅ Index exists:", fs.existsSync(indexPath)); 
    
    app.use(express.static(frontendPath));

    app.get("*", (req, res) => {
        res.sendFile(indexPath);
    })
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`.green.bold);
    });
}).catch(err => {
    console.error("Database connection failed:".red.bold, err);
    process.exit(1);
});


// // mongodb+srv://saadcsekuet_db_user:TliAjHGT7ut93Zuc@cluster0.bxctic5.mongodb.net/?appName=Cluster0
