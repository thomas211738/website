
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import {PORT} from './config.js';
import mongoose from 'mongoose';

const app = express();

const mongoDBURL = process.env.mongoDBURL;

app.get('/', (req, res) => {
    return res.send('NEW KTP WEBSITE!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

mongoose.connect(mongoDBURL).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.log('Error connecting to MongoDB', err);
});
