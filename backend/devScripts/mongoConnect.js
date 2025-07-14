import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();
let isConnected = false;
export const mongoConnect = async () => {
  if(isConnected) return;
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log('mongodb connected');
    isConnected = true;
  }catch(err){
    console.error(err);
    process.exit(1);
  }
}