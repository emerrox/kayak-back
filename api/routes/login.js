import express from 'express';
import jwt from 'jsonwebtoken';
import dbConnect from '../database.js';
import { OAuth2Client } from 'google-auth-library';
import { createUser } from '../controller/users.js';

const router = express.Router();
const CLIENT_ID = process.env.CLIENT_ID
const client = new OAuth2Client(CLIENT_ID);

router.post('/', async (req, res) => {
  const credential = req.body.credential;

  if (!credential) {
    return res.status(400).json({ error: "The OAuth ID token is required." });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userEmail = payload.email;

    const db = await dbConnect();
    const usersQuery = `
      SELECT id
      FROM users
      WHERE email = ?;
    `;
    const usersResult = await db.execute(usersQuery, [userEmail]);
    const user = usersResult.rows.length ? usersResult.rows[0] : null;

    if (!user) {
      createUser(userEmail);
    }

    const token = jwt.sign({ email: userEmail }, 'skibidi-toilet', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error verifying the ID token." });
  }
});

export default router;
