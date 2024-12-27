# API Endpoints

## Groups
| Endpoint | Method | Requirements |
| --- | --- | --- |
| `/groups` | `POST` | `body {name: "id of the group to create"}, authorization: true` |
| `/groups` | `DELETE` | `body {id: "id of the group to delete"}, authorization: true` |

## Authentication
| Endpoint | Method | Requirements |
| --- | --- | --- |
| `/login` | `POST` | `body {access_token: "access token from Google OAuth2.0"}` |
| `/logout` | `POST` | `authorization: true` |

## Group Users
| Endpoint | Method | Requirements |
| --- | --- | --- |
| `/groupsUsers` | `GET` | `authorization: true` |
| `/groupsUsers` | `POST` | `body {invite_token: "invitation token from URL"}, authorization: true` |
| `/groupsUsers` | `DELETE` | `body {groupId: "id of the group the user wants to exit"}, authorization: true` |
| `/groupsUsers` | `PATCH` | `body {groupId: "id of the group the user wants to exit"}, authorization: true` |

## Invites
| Endpoint | Method | Requirements |
| --- | --- | --- |
| `/invites` | `POST` | `body {groupId}, authorization: true` |

## Events
| Endpoint | Method | Requirements |
| --- | --- | --- |
| `/events` | `GET` | `authorization: true` |
| `/events` | `POST` | `body {group_id, event: "event details"}, authorization: true` |
| `/events` | `DELETE` | `body {group_id, event_id}, authorization: true` |
| `/events` | `PATCH` | `body {group_id, event_id, event: "updated event details"}, authorization: true` |