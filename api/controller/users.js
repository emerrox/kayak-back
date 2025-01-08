import dbConnect from '../database.js';
import crypto from 'crypto';
export async function getFromUsers(userId) {
    const db = await dbConnect()
    const groupQueryRes = await db.execute('SELECT * FROM users where id = ?;',[userId])
    if (groupQueryRes.rows.length < 1) {
      return null
    }
    return groupQueryRes.rows[0]  
}

export async function getFromUsersByEmail(email) {
    const db = await dbConnect()
    const groupQueryRes = await db.execute('SELECT * FROM users where email = ?;',[email])
    if (groupQueryRes.rows.length < 1) {
      return null
    }
    return groupQueryRes.rows[0]  
}

export async function createUser(email, name) {
    const db = await dbConnect()
    const id = crypto.randomUUID()
    await db.execute("INSERT INTO users (id, email, name) values(?,?,?)",[id, email, name])
    return {id:id,email:email}
}