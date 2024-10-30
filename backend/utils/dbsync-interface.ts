import { Pool } from "pg";

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: parseInt(process.env.POSTGRES_PORT || '5432')
});

export async function performQuery(query: string) {
    try {
        const connection = await pool.connect();
        const result = await connection.query(query);

        connection.release();
        return result;
    } catch(error) {
        console.error('Error executing query: ' + query, error);
        throw error;
    }
}

export default pool;