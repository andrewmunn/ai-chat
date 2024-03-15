import dotenv from 'dotenv';
import app from './app';
import mongoose from 'mongoose';

dotenv.config();

mongoose.set('debug', true);
mongoose.connect(process.env.MONGO_URI!!)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));


const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
