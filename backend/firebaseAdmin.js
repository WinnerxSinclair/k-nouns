import admin from 'firebase-admin'
import dotenv from 'dotenv'

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId:   process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Make sure to replace escaped newlines if you store the key as an env var:
    privateKey:  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
})

export default admin