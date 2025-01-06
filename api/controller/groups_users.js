import dbConnect from '../database.js';
import { createServiceCalendar } from './calendar.js';


export async function removeUserFromCalendar( calendar, calendarId, userEmail) {
  try {
      await calendar.acl.delete({
        calendarId: calendarId,
        ruleId: `user:${userEmail}`,
      });
  } catch (error) {
    console.error('Error removing user from calendar:', error);
    return error
  }
}

export async function shareCalendar(calendarId, email, role, calendar) {
  try {
    if (!calendar) {
      calendar = await createServiceCalendar();
    }
    await calendar.acl.insert({
      calendarId,
      requestBody: {
        role: role,
        scope: {
          type: 'user',
          value: email,
        },
      },
    });
  } catch (error) {
    console.error('Error al compartir el calendario:', error.message);
  }
}

export async function addUserToGroup(userId,groupId) {
  const db = await dbConnect();
  const userResult = await db.execute(`SELECT * FROM users_groups WHERE user_id = ? AND group_id = ?;`, [userId,groupId]);
  if (userResult.rows.length > 1) {
    return 'user ' + userId + ' alrady on group ' + groupId
  }

  await db.execute('INSERT INTO users_groups (user_id, group_id) VALUES (?, ?);', [userId, groupId]);

  return 'succesfully added'
}

export async function addUserToGroupByEmail(email,groupId) {
  const db = await dbConnect();
  const userResult = await db.execute(`SELECT id FROM users WHERE email = ?;`, [email]);
  if (userResult.rows.length > 0) {
    await addUserToGroup(userResult.rows[0],groupId)
  }
  throw new Error("cant add group");
}

export async function getUserGroupsByEmail(email) {
  try {
    const db = await dbConnect();
    const query = `
      SELECT g.id AS group_id, g.name AS group_name
      FROM users u
      INNER JOIN users_groups ug ON u.id = ug.user_id
      INNER JOIN groups g ON ug.group_id = g.id
      WHERE u.email = ?;
    `;

    const result = await db.execute(query, [email]);
    return result.rows;
  } catch (error) {
    console.error('Error al obtener los grupos del usuario:', error.message);
    throw new Error('Error al consultar los grupos del usuario.');
  }
}