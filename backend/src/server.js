import express from 'express';
import notesRoutes from './routes/notesroutes.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
connectDB();

app.use('/api/notes', notesRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// mongodb+srv://saadcsekuet_db_user:TliAjHGT7ut93Zuc@cluster0.bxctic5.mongodb.net/?appName=Cluster0