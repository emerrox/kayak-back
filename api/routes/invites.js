import express from 'express';
import crypto from 'crypto';
import dbConnect from '../database.js';
import { getUserRoleByGroupId } from '../controller/roles.js';

const router = express.Router();

router.post('/',async(req,res)=>{
    const {groupId, usesRemaining} = req.body;
    const user_email = req.cookies.user_email;
    console.log('aqui1');
    
    const role = await getUserRoleByGroupId(groupId, user_email)
    
    if (role != 'writer') {
        
        return res.status(401)
    }
    try {
        const token = crypto.randomUUID();
        const id = crypto.randomUUID();
    
        const db = await dbConnect();

        await db.execute('INSERT INTO group_invites (id, token, group_id, uses_remaining) VALUES (?,?,?,?);', [id,token, groupId, usesRemaining]);
    
        const invitationLink = `https://kayak-plus.vercel.app/?token=${token}`;
        res.status(200).json({link: invitationLink})
    } catch (error) {
        console.error('Error al generar el enlace de invitación:', error.message);
      }
})



export default router