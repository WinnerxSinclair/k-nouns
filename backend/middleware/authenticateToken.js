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
    // This verifies signature, expiry, and issuer all at once
    const decoded = await admin.auth().verifyIdToken(idToken)
    req.user = decoded     // contains uid, email, etc.
   
    const profile = await User.findOneAndUpdate(
      { uid: decoded.uid },
      {},            // no-op update
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
   
    req.profile = profile;
    
    next()
  } catch (err) {
    console.warn('Firebase verify failed:', err.message)
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}


