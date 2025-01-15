import { Router } from 'express';
import dbConnect from '../database.js';
import { addUserToGroup, removeUserFromCalendar, shareCalendar } from '../controller/groups_users.js';
import { createServiceCalendar } from '../controller/calendar.js';
import { getFromGroups } from '../controller/groups.js';
import { createUser, getFromUsersByEmail } from '../controller/users.js';
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

    const grRes = await Promise.all(
      groups.map(async (el) => {
        const role = await getUserRoleByGroupId(el.id, user_email);
        return { ...el, role }; 
      })
    );

    res.status(200).json(grRes);
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
    const group = await getFromGroups(groupId);
    const role = await getUserRoleByGroupId(groupId, user_email);

    if (!group) {
      return res.status(404).json({ error: 'Group not found.' });
    }

    const usersQuery = `
      SELECT u.email, u.id, u.name
      FROM users u
      JOIN users_groups gu ON u.id = gu.user_id
      WHERE gu.group_id = ?;
    `;
    const db = await dbConnect();
    const usersResult = await db.execute(usersQuery, [groupId]);
    const users = usersResult.rows;

    // Obtener el rol de cada usuario
    const usersWithRoles = await Promise.all(users.map(async (user) => {
      const userRole = await getUserRoleByGroupId(groupId, user.email);
      return {id:user.id, email: user.email, name: user.name, role: userRole };
    }));

    res.status(200).json({ ...group, role, users: usersWithRoles, prueba: 'prueba' });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'An error occurred while fetching group.' });
  }
});

router.post('/', async(req, res) => {
  const user_email = await getEmailFromToken(req.headers.authorization);
  const invite_token = req.body.invite_token
  const name = req.body.name
  
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

    let user = await getFromUsersByEmail(user_email) || await createUser(user_email, name);
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
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'token not found.' });
  }
  const { groupId } = req.body;
  const { email } = req.body;
  try {
    const db = await dbConnect();
    const user = await getFromUsersByEmail(email);
    const group = await getFromGroups(groupId);
    const calendar = await createServiceCalendar()

    removeUserFromCalendar(calendar, group.calendar_id, email )
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
