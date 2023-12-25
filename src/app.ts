import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/users.routes';
import cors from 'cors'
import loginRoutes from './routes/login.routes';
import tilesRoutes from './routes/tiles.routes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:3001' 
}));

app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'your_default_mongo_connection_string';

console.log(`Connecting to MongoDB with URI: ${MONGO_URI}`);

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/users', userRoutes);
app.use('/users', loginRoutes);
app.use('/tiles', tilesRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


export default app;