import { Router } from 'express';
import { readJSON, writeJSON } from '../utils.js';
import authenticate from '../authenticate.js';
import { google } from 'googleapis';

const router = Router();

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
  const { name } = req.body;
  const authToken = req.cookies.authToken;
  console.log(req.cookies);
  
  if (!authToken) {
    return res.status(401).json({ error: 'Usuario no autenticado.' });
  }

  try {
    const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
    oAuth2Client.setCredentials({ access_token: authToken });

    const groups = readJSON('groups.json');
    const newGroup = {
      id: (groups.length + 1).toString(),
      name: name
    };
    groups.push(newGroup);
    writeJSON('groups.json', groups);

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const newCalendar = {
      summary: `Calendario de ${name}`,
      description: `Calendario asociado al grupo: ${name}`,
      timeZone: 'Europe/Madrid'
    };

    const calendarResponse = await calendar.calendars.insert({
      requestBody: newCalendar
    });

    newGroup.calendarId = calendarResponse.data.id;
    writeJSON('groups.json', groups);

    res.status(201).json({ group: newGroup, calendar: calendarResponse.data });

  } catch (error) {
    console.error('Error al crear el calendario:', error);
    res.status(500).json({ error: 'Error al crear el calendario para el grupo.' });
  }
});

router.delete('/:id', authenticate, (req, res) => {
  let groups = readJSON('groups.json');
  groups = groups.filter(g => g.id !== req.params.id);
  writeJSON('groups.json', groups);

  let users_g = readJSON('groups_users.json');
  users_g = users_g.filter(u => u.groupId !== req.params.id);
  writeJSON('groups_users.json', users_g);

  res.json({ message: 'Grupo eliminado' });
});

export default router;
