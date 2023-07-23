import type { NextApiRequest, NextApiResponse } from "next";
import mysql from 'mysql2/promise';
import { ResultSetHeader } from 'mysql2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'todo_db'
  });

  if (req.method === 'PUT') {
    const { title, description, completed } = req.body;

    const [result] = await connection.execute<ResultSetHeader>('UPDATE `tasks` SET `title` = ?, `description` = ?, `completed` = ? WHERE `id` = ?', [title || null, description || null, completed, id || null]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Task updated successfully.' });
    } else {
      res.status(404).json({ message: 'Task not found.' });
    }
    return;
  }

  if (req.method === 'DELETE') {
    await connection.execute('UPDATE `tasks` SET `deleted_at` = NOW() WHERE `id` = ?', [id]);

    res.status(204).end();
    return;
  }
}
