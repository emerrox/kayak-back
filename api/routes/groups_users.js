import { Router } from 'express';
import dbConnect from '../database.js';
import { addUserToGroup, removeUserFromCalendar, shareCalendar } from '../controller/groups_users.js';
import { createServiceCalendar } from '../controller/calendar.js';
import { getFromGroups } from '../controller/groups.js';
import { getFromUsersByEmail } from '../controller/users.js';
import { getUserRoleByGroupId, updateUserRoleByGroupId } from '../controller/roles.js';
import { getEmailFromToken } from '../controller/login.js';


const router = Router();

router.get('/', async (req, res) => {
  const user_email = await getEmailFromToken(req.headers.authorization);

  if (!user_email) {
    return res.status(401).json({ error: 'Email not found.' });
  }

  try {
    const db = await dbConnect();

    const query = `
      SELECT g.id AS id, g.name AS name
      FROM users u
      INNER JOIN users_groups ug ON u.id = ug.user_id
      INNER JOIN groups g ON ug.group_id = g.id
      WHERE u.email = ?;
    `;

    const result = await db.execute(query, [user_email]);
    const groups = result.rows;

    if (groups.length === 0) {
      return res.status(404).json({ error: 'No groups found for this user.' });
    }

    res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'An error occurred while fetching groups.' });
  }
});

router.get('/:groupId', async (req, res) => {
  const user_email = await getEmailFromToken(req.headers.authorization);
  const groupId = req.params.groupId;
  if (!user_email) {
    return res.status(401).json({ error: 'Email not found.' });
  }

  try {
    const user = await getFromUsersByEmail(user_email);
    const group = await getFromGroups(groupId);
    const role = await getUserRoleByGroupId(groupId, user.id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found.' });
    }

    res.status(200).json({ ...group, role });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'An error occurred while fetching group.' });
  }
});

router.post('/', async(req, res) => {
  const user_email = await getEmailFromToken(req.headers.authorization);
  const invite_token = req.body.invite_token
  
  if (!user_email) {
    return res.status(401).json({ error: 'Email not found.' });
  }

  if (!invite_token) {
    return res.status(400).json({ error: 'Invite token not found.' });
  }

  try {
    const db = await dbConnect();
    const inviteResult = await db.execute(`SELECT group_id FROM group_invites WHERE token = ?;`, [invite_token]);
    const invite = inviteResult.rows[0];

    if (!invite) {
      return res.status(404).json({ error: 'Invalid or expired invite link.' });
    }

    let user = await getFromUsersByEmail(user_email) || await createUser(user_email);
    const group = await getFromGroups(invite.group_id)

    shareCalendar(group.calendar_id, user_email, 'reader')
    addUserToGroup(user.id, invite.group_id)

    res.status(200).json(group)
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'An error occurred while adding groups.' });
  }
});

router.delete('/', async(req, res) => {
  const user_email = await getEmailFromToken(req.headers.authorization);
  const { groupId } = req.body;
  try {
    const db = await dbConnect();
    const user = await getFromUsersByEmail(user_email);
    const group = await getFromGroups(groupId);
    const calendar = await createServiceCalendar()

    removeUserFromCalendar(calendar, group.calendar_id, user_email)
    await db.execute('DELETE FROM users_groups WHERE user_id = ? AND group_id = ?;', [user.id, groupId]);
    
    res.status(200).json({ message: 'Usuario eliminado del grupo correctamente.' });
  } catch (error) {
    res.status(400).json({error: error})
  }
});

router.patch('/', async (req, res) => {
  const userEmail = await getEmailFromToken(req.headers.authorization);
  const { groupId, newRole, email } = req.body;

  if (!groupId || !userEmail || !newRole || !email) {
    return res.status(400).json({ error: 'Faltan datos obligatorios.' });
  }

  try {
    const success = await updateUserRoleByGroupId(groupId, email, newRole);
    
    if (success) {
      res.status(200).json({
        message: `Rol actualizado correctamente a ${newRole} para el usuario ${email}.`,
        role: newRole
      });
    } else {
      res.status(500).json({ error: 'No se pudo actualizar el rol.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Ocurrió un error al actualizar el rol.' });
  }
});

export default router;
