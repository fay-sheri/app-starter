import { Pool } from "pg";


const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL 没配");
}

export const pool = new Pool(
  {connectionString}
);

pool.on('error', (err) => {
  console.error('idle pg client error', err)
})

// process.on('SIGTERM', async () => {
//   await pool.end()   // 优雅关：等借出的还回来再断
//   process.exit(0)
// })