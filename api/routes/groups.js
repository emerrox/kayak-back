import { Router } from 'express';
import authenticate from '../authenticate.js';
import { google } from 'googleapis';
import dbConnect from '../database.js';
import User from  '../models/Users.js';
// import User from '../models/User.js';
import Group from '../models/Groups.js';
import GroupsUsers from '../models/GroupsUser.js';

const router = Router();

// const oauth2Client = new google.auth.OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   process.env.REDIRECT_URI
// );

router.get('/', authenticate, (req, res) => {
  const groups = readJSON('groups.json');
  res.json(groups);
});

router.get('/:id', authenticate, (req, res) => {
  const groups = readJSON('groups.json');
  const group = groups.find(g => g.id === req.params.id);
  if (group) {
    const users = readJSON('groups_users.json');
    let user = [];
    users.map((u) => {
      if (u.userId == req.params.id) {
        user.push(u.userId);
      }
    });
    group.users = user;
    res.json(group);
  } else {
    res.status(404).json({ message: 'Grupo no encontrado' });
  }
});


router.post('/', async (req, res) => {
  const name = req.body.name;
  const access_token = req.cookies.access_token;
  const user_email = req.cookies.user_email;

  if (!access_token || !user_email) {
    return res.status(401).json({ error: 'Usuario no autenticado.' });
  }

  // Crear un nuevo OAuth2Client para esta solicitud
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
  );
  oauth2Client.setCredentials({ access_token });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const newCalendar = {
    summary: `Calendario de ${name}`,
    description: `Calendario asociado al grupo: ${name}`,
    timeZone: 'Europe/Madrid',
  };

  try {
    await dbConnect();
    // Crear el calendario
    const calendarResponse = await calendar.calendars.insert({
      requestBody: newCalendar,
    });

    const calendarId = calendarResponse.data.id;

    let user = await User.findOne({ email: user_email });
    if (!user) {
      user = await User.create({ email: user_email, name: 'Sin nombre' });
    }

    // **3. Crear un nuevo grupo y almacenarlo en MongoDB**
    const group = await Group.create({
      name: name,
      cal_id: calendarId,
    });

    // **4. Relacionar el usuario con el grupo en Groups_Users**
    await GroupsUsers.create({
      userId: user._id,
      groupId: group._id,
    });

    res.status(201).json({
      message: 'Grupo y calendario creados correctamente.',
      group: group,
      calendar: calendarResponse.data,
    });
  } catch (error) {
    console.error('Error al crear el calendario:', error);
    res.status(504).json({ error: 'Error al crear el calendario para el grupo.' });
  }
});


router.delete('/:id', authenticate, (req, res) => {
  let groups = readJSON('groups');
  groups = groups.filter(g => g.id !== req.params.id);
  writeJSON('groups', groups);

  let users_g = readJSON('groups_users');
  users_g = users_g.filter(u => u.groupId !== req.params.id);
  writeJSON('groups_users', users_g);

  res.json({ message: 'Grupo eliminado' });
});

export default router;
