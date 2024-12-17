import { readJSON } from "../utils";

export function createGroup ( name, calendarId ){
    const groups = readJSON('groups.json');
    const newGroup = {
      id: (groups.length + 1).toString(),
      name: name,
      calendarId: calendarId
    };
    groups.push(newGroup);
}