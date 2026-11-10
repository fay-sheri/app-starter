import { Pool } from "pg";


const connectionString = process.env.DATABASE_URL;

export const pool = new Pool(
  connectionString
    ? { connectionString }
    : {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      },
);

pool.on('error', (err) => {
  console.error('idle pg client error', err)
})

// process.on('SIGTERM', async () => {
//   await pool.end()   // 优雅关：等借出的还回来再断
//   process.exit(0)
// })