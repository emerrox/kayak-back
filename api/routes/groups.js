import { Router } from 'express';
import dbConnect from '../database.js';
import crypto from 'crypto';
import { shareCalendar } from '../controller/groups_users.js';
import { createServiceCalendar } from '../controller/calendar.js';
import { getEmailFromToken } from '../controller/login.js';
import { getUserRoleByGroupId } from '../controller/roles.js';
const router = Router();

router.post('/', async (req, res) => {
  const name = req.body.name;
  const user_email = await getEmailFromToken(req.headers.authorization);

  if (!user_email) {
    return res.status(401).json({ error: 'Usuario no autenticado.' });
  }

  const newCalendar = {
    summary: `Calendario de ${name}`,
    description: `Calendario asociado al grupo: ${name}`,
    timeZone: 'Europe/Madrid',
  };

  try {
    const db = await dbConnect();
    const calendar = await createServiceCalendar()

    const calendarResponse = await calendar.calendars.insert({
      requestBody: newCalendar,
    });
    const calendarId = calendarResponse.data.id;

    await shareCalendar(calendarId, user_email, 'writer', calendar);

    const userQuery = await db.execute('SELECT id FROM users WHERE email = ?;', [user_email]);
    let user = userQuery.rows[0];

    if (!user) {
      await db.execute('INSERT INTO users (id, email) VALUES (?, ?);', [crypto.randomUUID(), user_email]);
      const newUserQuery = await db.execute('SELECT id FROM users WHERE email = ?;', [user_email]);
      user = newUserQuery.rows[0];
    }

    const groupId = crypto.randomUUID();
    await db.execute('INSERT INTO groups (id, name, calendar_id) VALUES (?, ?, ?);', [groupId, name, calendarId]);

    await db.execute('INSERT INTO users_groups (user_id, group_id) VALUES (?, ?);', [user.id, groupId]);

    res.status(201).json({
      message: 'Grupo y calendario creados correctamente.',
      group: { id: groupId, name, calendar_id: calendarId },
      calendar: calendarResponse.data,
    });
  } catch (error) {
    console.error('Error al crear el calendario:', error);
    res.status(500).json({ error: 'Error al crear el calendario para el grupo.' });
  }
});


router.delete('/', async (req, res) => {
  const id = req.body.id;
  const user_email = await getEmailFromToken(req.headers.authorization);
  const role = getUserRoleByGroupId(id, user_email);

  if (user_email === null) {
    return res.status(403).json({ message: 'No tienes permisos para eliminar este grupo' });
  }

  if (role == 'reader') {
    return res.status(403).json({ message: 'No tienes permisos para eliminar este grupo' });
  }

  try {
    const db = await dbConnect();

    const groupQuery = await db.execute('SELECT calendar_id FROM groups WHERE id = ?;', [id]);
    
    if (groupQuery.rows.length === 0) {
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }

    const calendarId = groupQuery.rows[0].calendar_id;

    await db.execute('DELETE FROM users_groups WHERE group_id = ?;', [id]);

    await db.execute('DELETE FROM groups WHERE id = ?;', [id]);

    const calendarService = await createServiceCalendar()
    await calendarService.calendars.delete({
      calendarId: calendarId,
    });

    res.json({ message: 'Grupo y calendario eliminados' });

  } catch (error) {
    console.error('Error al eliminar grupo o calendario:', error);
    res.status(500).json({ error: 'Error al eliminar el grupo y/o calendario.' });
  }
});

export default router;
