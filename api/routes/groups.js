import { Router } from 'express';
import dbConnect from '../database.js';
import crypto from 'crypto';
import { shareCalendar } from '../controller/groups_users.js';
import { createServiceCalendar } from '../controller/calendar.js';
const router = Router();

router.post('/', async (req, res) => {
  const name = req.body.name;
  const user_email = req.cookies.user_email;

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

    // Crear el calendario con la cuenta de servicio
    const calendarResponse = await calendar.calendars.insert({
      requestBody: newCalendar,
    });
    const calendarId = calendarResponse.data.id;

    // Compartir el calendario con el usuario como writer
    await shareCalendar(calendarId, user_email, 'writer', calendar);

    // Verificar si el usuario ya existe en la base de datos
    const userQuery = await db.execute('SELECT id FROM users WHERE email = ?;', [user_email]);
    let user = userQuery.rows[0];

    if (!user) {
      await db.execute('INSERT INTO users (id, email) VALUES (?, ?);', [crypto.randomUUID(), user_email]);
      const newUserQuery = await db.execute('SELECT id FROM users WHERE email = ?;', [user_email]);
      user = newUserQuery.rows[0];
    }

    // Crear un nuevo grupo
    const groupId = crypto.randomUUID();
    await db.execute('INSERT INTO groups (id, name, calendar_id) VALUES (?, ?, ?);', [groupId, name, calendarId]);

    // Relacionar el usuario con el grupo en users_groups
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

  try {
    // Conectar a la base de datos
    const db = await dbConnect();

    const groupQuery = await db.execute('SELECT calendar_id FROM groups WHERE id = ?;', [id]);
    
    if (groupQuery.rows.length === 0) {
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }

    const calendarId = groupQuery.rows[0].calendar_id;

    // Eliminar relaciones en users_groups
    await db.execute('DELETE FROM users_groups WHERE group_id = ?;', [id]);

    // Eliminar el grupo de la base de datos
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

// router.get('/', authenticate, async (req, res) => {
//   try {
//     const db = await dbConnect();
//     const groups = await db.execute('SELECT * FROM groups;');
//     res.json(groups.rows);
//   } catch (error) {
//     console.error('Error al obtener grupos:', error);
//     res.status(500).json({ error: 'Error al obtener los grupos.' });
//   }
// });

// router.get('/:id', authenticate, async (req, res) => {
//   try {
//     const db = await dbConnect();
//     const groupQuery = await db.execute('SELECT * FROM groups WHERE id = ?;', [req.params.id]);
//     const group = groupQuery.rows[0];

//     if (group) {
//       const usersQuery = await db.execute(
//         'SELECT u.id, u.name, u.email FROM users u JOIN users_groups ug ON u.id = ug.user_id WHERE ug.group_id = ?;',
//         [req.params.id]
//       );
//       group.users = usersQuery.rows;
//       res.json(group);
//     } else {
//       res.status(404).json({ message: 'Grupo no encontrado' });
//     }
//   } catch (error) {
//     console.error('Error al obtener grupo:', error);
//     res.status(500).json({ error: 'Error al obtener el grupo.' });
//   }
// });
