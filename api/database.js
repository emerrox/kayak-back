import { createClient } from "@libsql/client";

const TURSO_URL = process.env.TURSO_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

let cached = global.turso;

if (!cached) {
  cached = global.turso = { client: null };
}

async function dbConnect() {
  if (cached.client) {
    return cached.client;
  }

  try {
    const client = createClient({
      url: TURSO_URL,
      authToken: TURSO_AUTH_TOKEN,
    });

    // Probar la conexión inicial
    await client.execute("SELECT 1;");

    cached.client = client;
    return client;
  } catch (error) {
    console.error("Error connecting to Turso:", error);
    throw new Error("Failed to connect to Turso database");
  }
}

export default dbConnect;
