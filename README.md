# API Endpoints

You need to authenticate any request with a jwt token
`headers: {
          "Content-Type": "application/json", 
          "Authorization": token
          }`


## Authentication
These endpoint handle user authentication and create the JWT authentication token.
| Endpoint | Method | Requirements | Description |
| --- | --- | --- | --- |
| `/login` | `POST` | `body {access_token: "access token from Google OAuth2.0"}` | Logs in using a Google OAuth2.0 access token. |


## Groups
These endpoints allow for group management.
| Endpoint | Method | Requirements | Description |
| --- | --- | --- | --- |
| `/groups` | `POST` | `body {name: "id of the group to create"}` | Creates a new group. |
| `/groups` | `DELETE` | `body {id: "id of the group to delete"}` | Deletes an existing group. |


## Group Users
These endpoints manage users within groups.
| Endpoint | Method | Requirements | Description |
| --- | --- | --- | --- |
| `/groupsUsers` | `GET` |  | Retrieves the list of users in a group. |
| `/groupsUsers` | `POST` | `body {invite_token: "invitation token from URL"}` | Adds a user to a group using an invitation token. |
| `/groupsUsers` | `DELETE` | `body {groupId: "id of the group the user wants to exit"}` | Removes a user from a group. |
| `/groupsUsers` | `PATCH` | `body {groupId: "id of the group the user wants to exit"}` | Updates user information in a group. |

## Invites
These endpoints handle group invitations.
| Endpoint | Method | Requirements | Description |
| --- | --- | --- | --- |
| `/invites` | `POST` | `body {groupId}` | Sends an invitation to join a group. |

## Events
These endpoints manage events within groups.
| Endpoint | Method | Requirements | Description |
| --- | --- | --- | --- |
| `/events` | `GET` |  | Retrieves the list of events in a group. |
| `/events` | `POST` | `body {group_id, event: "event details"}` | Creates a new event in a group. |
| `/events` | `DELETE` | `body {group_id, event_id}` | Deletes an event from a group. |
| `/events` | `PATCH` | `body {group_id, event_id, event: "updated event details"}` | Updates an existing event in a group. |