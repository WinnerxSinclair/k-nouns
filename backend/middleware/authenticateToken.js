// middleware/authenticateToken.js
import admin from '../firebaseAdmin.js'
import User from '../models/user.js'
export async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const match = authHeader.match(/^Bearer (.+)$/)
  if (!match) {
    return res.status(401).json({ message: 'No authentication token provided' })
  }

  const idToken = match[1]
  try {
    
    const decoded = await admin.auth().verifyIdToken(idToken, true);

    req.user = decoded     
   
    const profile = await User.findOneAndUpdate(
      { uid: decoded.uid },
      {},           
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
   
    req.profile = profile;
    
    next()
  } catch (err) {
    console.warn('Firebase verify failed:', err.message)
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export const requireVerifiedEmail = [authenticateToken, (req, res, next) => {
  if(!req.user.email_verified) return res.status(403).json({ message: 'verify email required' });
  next();
}];


