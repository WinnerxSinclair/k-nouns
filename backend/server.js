import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import path from 'path'
import cors from 'cors'
import dotenv from 'dotenv'
import tokenUsageRoutes from './routes/tokenUsageRoutes.js'
import flashcardRoutes from './routes/flashcardRoutes.js'
import claudeRoutes from './routes/claudeRoutes.js'
import userRoutes from './routes/userRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import { authenticateToken } from './middleware/authenticateToken.js'

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: /http:\/\/localhost:\d+/,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/login', (req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src  'self'",
      "style-src   'self'",
      "connect-src 'self' https://identitytoolkit.googleapis.com",
      "img-src     'self' data:",
      "object-src  'none'",
      "frame-ancestors 'none'",
    ].join('; ')
  )
  // fall through to static file serving
  next()
})
app.get('/register', (req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src  'self'",
      "style-src   'self'",
      "connect-src 'self' https://identitytoolkit.googleapis.com",
      "img-src     'self' data:",
      "object-src  'none'",
      "frame-ancestors 'none'",
    ].join('; ')
  )
  // fall through to static file serving
  next()
})





app.use('/api/tokenUsage', tokenUsageRoutes);
app.use('/api/card_collections', authenticateToken, flashcardRoutes);
app.use('/api/ai', authenticateToken, claudeRoutes)
app.use('/api/user', authenticateToken, userRoutes);
app.use('/api/review', authenticateToken, reviewRoutes);



const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));



app.listen(3000, () => {
  console.log('server urnning')
})


