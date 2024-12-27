import { createServiceCalendar } from "./calendar.js";
import { getFromGroups } from "./groups.js";

export async function getUserRole(calendarId, email) {
    try {
        const calendar = await createServiceCalendar();
        // Recuperar la lista de permisos (ACLs) del calendario
        const response = await calendar.acl.list({
        calendarId,
        });

        // Buscar el permiso del usuario por su email
        const userAcl = response.data.items.find((acl) => acl.scope.type === 'user' && acl.scope.value === email);

        // Retornar el rol del usuario si se encuentra, o null si no tiene permisos
        return userAcl ? userAcl.role : null;
    } catch (error) {
        console.error('Error al recuperar el rol del usuario:', error.message);
    }
}

export async function getUserRoleByGroupId(groupId, email) {
    try {
        const group = await getFromGroups(groupId)
        const calendarId= group.calendar_id
        console.log(calendarId);

        // Recuperar el rol del usuario en el calendario
        const res = await getUserRole(calendarId, email);
        return res
    } catch (error) {
        console.error('Error al recuperar el rol del usuario en el grupo:', error.message);
        throw new Error('No se pudo recuperar el rol del usuario en el grupo.');
    }
}

export async function updateUserRole(calendarId, email, role) {
    try {
        const calendar = await createServiceCalendar();

        await calendar.acl.update({
        calendarId,
        ruleId: `user:${email}`, 
        requestBody: {
            role: role, 
            scope: {
            type: 'user',
            value: email, 
            },
        },
        });

        console.log(`Rol del usuario ${email} actualizado a ${role} en el calendario ${calendarId}.`);
        return true;
    } catch (error) {
        console.error(`Error al actualizar el rol del usuario ${email}:`, error.message);
        return false;
    }
}

export async function updateUserRoleByGroupId(groupId, email, role) {
    const group = await getFromGroups(groupId)
    const calId= group.calendar_id
    return await updateUserRole(calId,email,role)
}