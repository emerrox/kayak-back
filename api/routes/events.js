import { Router } from 'express';
import authenticate from '../authenticate.js';
import { readJSON, writeJSON } from '../utils.js';

const router = Router();

router.get('/', (req, res) => {
    const access_token = req.cookies.access_token;
    const user_email = req.cookies.user_email;

    if (!access_token) {
       return res.status(401).json({message: 'token no encontrado'})
    }

    res.status(200).json({message: 'hola' + user_email})
});

export default router;