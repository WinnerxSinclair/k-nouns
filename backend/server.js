import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import { v4 as uuid } from 'uuid'
import { logger } from './logger.js'
import mongoSanitize from 'express-mongo-sanitize'
import cors from 'cors'
import dotenv from 'dotenv'
import tokenUsageRoutes from './routes/tokenUsageRoutes.js'
import deckRoutes from './routes/deckRoutes.js'
import cardRoutes from './routes/cardRoutes.js'
import claudeRoutes from './routes/claudeRoutes.js'
import userRoutes from './routes/userRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import tagRoutes from './routes/tagRoutes.js'
import shareRoutes from './routes/shareRoutes.js'
import { authenticateToken, requireVerifiedEmail } from './middleware/authenticateToken.js'


dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: /http:\/\/localhost:\d+/,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(helmet());
app.use(mongoSanitize());
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


app.use((req, res, next) => {
  req.id = uuid();
  next();
});

app.use(morgan(':method :url :status - :response-time ms :req[id]', {
  stream: { write: msg => logger.info(msg.trim()) }
}))



app.use('/api/tokenUsage', requireVerifiedEmail, tokenUsageRoutes);
app.use('/api/decks', requireVerifiedEmail, deckRoutes);
app.use('/api/cards', requireVerifiedEmail, cardRoutes);
app.use('/api/ai', requireVerifiedEmail, claudeRoutes)
app.use('/api/user', requireVerifiedEmail, userRoutes);
app.use('/api/review', requireVerifiedEmail, reviewRoutes);
app.use('/api/tags', requireVerifiedEmail, tagRoutes);
app.use('/api/share', requireVerifiedEmail, shareRoutes)
app.get('/ping', (_, res) => res.send('pong'));

app.use((err, _req, res, _next) => {
  console.error(err);        
  res.status(500).json({ message: 'internal server error' });
});




mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));



app.listen(3000, () => {
  console.log('server urnning')
})

export default app


