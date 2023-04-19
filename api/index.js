import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoute from './routes/auth.js'; 
import usersRoute from './routes/users.js'; 
import postsRoute from './routes/posts.js';
import cors from 'cors';

const app = express(); 
dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`connected!`)
    } catch (error) {
        throw error
    }    
}

mongoose.connection.on('disconnected', () => {
    console.log("disconnected!!!")
})

// middlewares

// var corsOptions = {
//     origin: "https://galaxystays.onrender.com"
// }
var corsOptions = {
    origin: "http://localhost:3000"
}

app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/auth/', authRoute);
app.use('/api/users/', usersRoute);
app.use('/api/posts/', postsRoute);

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
    connect(); 
    console.log(`connected on port ${PORT}`)
})