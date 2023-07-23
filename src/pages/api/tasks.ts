import type { NextApiRequest, NextApiResponse } from "next";
import mysql from 'mysql2/promise';
import type { ResultSetHeader } from 'mysql2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'todo_db'
  });

  if (req.method === 'GET') {
    const [rows] = await connection.execute('SELECT * FROM `tasks` WHERE `deleted_at` IS NULL');
  
    res.status(200).json({ tasks: rows });
  } else if (req.method === 'POST') {
    const { title, description } = req.body;

    const [result] = await connection.execute<ResultSetHeader>('INSERT INTO `tasks` (`title`, `description`) VALUES (?, ?)', [title || null, description || null]);

    res.status(201).json({ task: { id: result.insertId, title, description } });
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
