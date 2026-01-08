import dotenvFlow from "dotenv-flow";
import { neon } from "@neondatabase/serverless";

process.env.NODE_ENV = process.env.NODE_ENV || "development";
dotenvFlow.config();

// Neon SQL client
const sql = neon(process.env.DATABASE_URL);

// Dummy users
const DUMMY_USERS = [
  { firstName: "John", lastName: "Doe", email: "john@example.com" },
  { firstName: "Max", lastName: "Schwarz", email: "max@example.com" },
];

async function initDB() {
  // 1️⃣ Create tables
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      image_url TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS likes (
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
      PRIMARY KEY(user_id, post_id)
    );
  `;

  // 2️⃣ Seed dummy users
  for (const user of DUMMY_USERS) {
    await sql`
      INSERT INTO users (first_name, last_name, email)
      VALUES (${user.firstName}, ${user.lastName}, ${user.email})
      ON CONFLICT (email) DO NOTHING;
    `;
  }

  console.log("✅ Users, Posts, and Likes tables initialized");
}

// Run script
initDB()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ DB init failed:", err);
    process.exit(1);
  });
