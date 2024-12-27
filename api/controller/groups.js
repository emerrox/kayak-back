import dbConnect from '../database.js';

export function createGroups ( name, calendarId ){
    const groups = readJSON('groups.json');
    const newGroup = {
      id: (groups.length + 1).toString(),
      name: name,
      calendarId: calendarId
    };
    groups.push(newGroup);
}

export async function getFromGroups(groupId) {
  const db = await dbConnect()
  const groupQueryRes = await db.execute('SELECT * FROM groups where id = ?;',[groupId])
  if (groupQueryRes.rows.length < 1) {
    return null
  }
  return groupQueryRes.rows[0]  
}