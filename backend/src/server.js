import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import colors from 'colors';

import notesRoutes from './routes/notesroutes.js';
import { connectDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;


//middleware
const corsOptions = {
    origin: ['http://localhost:5173','http://localhost:5174'],
}
app.use(cors(corsOptions));
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

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});


// mongodb+srv://saadcsekuet_db_user:TliAjHGT7ut93Zuc@cluster0.bxctic5.mongodb.net/?appName=Cluster0