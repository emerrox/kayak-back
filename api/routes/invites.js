import express from 'express';
import crypto from 'crypto';
import dbConnect from '../database.js';
import { getUserRoleByGroupId } from '../controller/roles.js';
import { getEmailFromToken } from '../controller/login.js';

const router = express.Router();

router.post('/',async(req,res)=>{
    const {groupId, usesRemaining} = req.body;
    const user_email = await getEmailFromToken(req.headers.authorization);
    
    const role = await getUserRoleByGroupId(groupId, user_email)
    
    if (role != 'writer') {
        
        return res.status(401).json({ error: 'No tienes permisos para invitar a usuarios a este grupo.' });
    }
    try {
        const token = crypto.randomUUID();
        const id = crypto.randomUUID();
    
        const db = await dbConnect();

        await db.execute('INSERT INTO group_invites (id, token, group_id, uses_remaining) VALUES (?,?,?,?);', [id,token, groupId, usesRemaining]);
    
        const invitationLink = `https://kayak-plus.vercel.app/?token=${token}`;
        return res.status(200).json({link: invitationLink})
    } catch (error) {
        console.error('Error al generar el enlace de invitación:', error.message);
      }
})

router.get('/', async (req, res) => {
    try {
        const { groupId } = req.query; // Si groupId viene como parámetro de consulta
        if (!groupId) {
            return res.status(400).json({ error: 'groupId es requerido.' });
        }

        const user_email = await getEmailFromToken(req.headers.authorization);
        const role = await getUserRoleByGroupId(groupId, user_email);

        if (role !== 'writer') {
            return res.status(403).json({ error: 'No tienes permisos para invitar a usuarios a este grupo.' });
        }

        const db = await dbConnect();
        const queryRes = await db.execute('SELECT * FROM group_invites WHERE group_id = ?;', [groupId]);

        if (!queryRes.rows || queryRes.rows.length < 1) {
            return res.status(404).json({ error: 'No hay enlaces disponibles para este grupo.' });
        }

        const token = queryRes.rows[0]?.token;
        if (!token) {
            return res.status(500).json({ error: 'El token no está disponible.' });
        }

        const invitationLink = `https://kayak-plus.vercel.app/?token=${token}`;
        return res.status(200).json({ link: invitationLink });

    } catch (error) {
        console.error('Error al generar el enlace de invitación:', error.message);
        return res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' });
    }
});


export default router