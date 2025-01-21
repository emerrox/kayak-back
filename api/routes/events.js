import { Router } from 'express';
import { getFromGroups } from '../controller/groups.js';
import { getUserGroupsByEmail } from '../controller/groups_users.js';
import { createServiceCalendar } from '../controller/calendar.js';
import { getUserRole } from '../controller/roles.js';
import { getEmailFromToken } from '../controller/login.js';

const router = Router();

router.get('/', async (req, res) => {
    const user_email = await getEmailFromToken(req.headers.authorization);
    const events = [];
    if (!user_email) {
        return res.status(401).json({ message: "Access token no encontrado" });
    }

    try {
        const groupsQuery = await getUserGroupsByEmail(user_email)
        const calendar = await createServiceCalendar()

        if (groupsQuery.length === 0) {
            return res.status(400).json({ message: "El usuario no pertenece a ningún grupo" });
        }
        
        for (const group of groupsQuery) {
            const groupQuery = await getFromGroups(group.group_id)
            const calendar_id = groupQuery.calendar_id;
            const role = await getUserRole(calendar_id,user_email)

            const eventsResponse = await calendar.events.list({
                calendarId: calendar_id,
                singleEvents: true,
                orderBy: 'startTime',
              });
      
              const formattedEvents = eventsResponse.data.items.map((event) => ({
                group_id: group.group_id,
                group_name: group.group_name,
                event_id: event.id,
                summary: event.summary,
                start: event.start.dateTime || event.start.date,
                end: event.end.dateTime || event.end.date,
                role: role,
                extendedProperties: event.extendedProperties || {},
            }));
    
            events.push(...formattedEvents); 
        }

        res.status(200).json({events})
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar los eventos' });
    }
});

router.post('/', async (req, res) => {
    const user_email = await getEmailFromToken(req.headers.authorization);
    const { group_id, event } = req.body;

    
    try {
        const groupQuery = await getFromGroups(group_id);
        if (!groupQuery) {
            return res.status(404).json({ message: "Grupo no encontrado" });
        }

        const calendar_id = groupQuery.calendar_id;
        const role = await getUserRole(calendar_id, user_email);

        if (role !== 'owner' && role !== 'writer') {
            return res.status(403).json({ message: "No tienes permisos para crear eventos en este calendario" });
        }

        const calendar = await createServiceCalendar()

        const newEvent = await calendar.events.insert({
            calendarId: calendar_id,
            resource: event,
        });

        res.status(201).json({ message: "Evento creado exitosamente", event: newEvent.data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el evento' });
    }
});

router.delete('/', async (req, res) => {
    const user_email = await getEmailFromToken(req.headers.authorization);
    const { group_id, event_id } = req.body;

    try {
        const groupQuery = await getFromGroups(group_id);
        if (!groupQuery) {
            return res.status(404).json({ message: "Grupo no encontrado" });
        }

        const calendar_id = groupQuery.calendar_id;
        const role = await getUserRole(calendar_id, user_email);

        if (role !== 'owner' && role !== 'writer') {
            return res.status(403).json({ message: "No tienes permisos para eliminar eventos en este calendario" });
        }

        const calendar = await createServiceCalendar();

        const deletedEvent = calendar.events.delete({
            calendarId: calendar_id,
            eventId: event_id,
        });

        res.status(200).json({ message: "Evento eliminado exitosamente", event: deletedEvent.data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el evento' });
    }
});

router.patch('/', async (req, res) => {
    const user_email = await getEmailFromToken(req.headers.authorization);
    const { group_id, event_id, event } = req.body;

    try {
        const groupQuery = await getFromGroups(group_id);
        if (!groupQuery) {
            return res.status(404).json({ message: "Grupo no encontrado" });
        }

        const calendar_id = groupQuery.calendar_id;
        const role = await getUserRole(calendar_id, user_email);

        if (role !== 'owner' && role !== 'writer') {
            return res.status(403).json({ message: "No tienes permisos para editar eventos en este calendario" });
        }

        const calendar = await createServiceCalendar();

        const updatedEvent = calendar.events.update({
            calendarId: calendar_id,
            eventId: event_id,
            resource: event,
        });

        res.status(200).json({ message: "Evento actualizado exitosamente", event: updatedEvent.data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el evento' });
    }
});

export default router;