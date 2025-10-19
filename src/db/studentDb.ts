import sqlite3 from 'sqlite3';

import type StudentInterface from '@/types/StudentInterface';
import { resolve } from 'path';
import { rejects } from 'assert';

sqlite3.verbose();

export const getStudentDb = async (): Promise<StudentInterface[]> => {
  const db = new sqlite3.Database(process.env.DB ?? './db/vki-web.db');

  const students = await new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM student';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        db.close();
        return;
      }
      resolve(rows);
      db.close();
    });
  });

  return students as StudentInterface[];
};

export const deleteStudentDb = async (id: number): Promise<void> => {
  const db = new sqlite3.Database(process.env.DB ?? "./db/vki-web.db");

  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM student WHERE id = ?";

    db.run(sql, [id], function (err) {
      if (err) {
        reject(err);
      } else {
        console.log(`Удалено строк: ${this.changes}`);
        resolve();
      }
    });

    db.close();
  });
};

interface NewStudent {
  first_name: string;
  last_name: string;
  midle_name?: string;
  group_id: number;
}

export const addStudentDb = async (student: NewStudent): Promise<NewStudent & { id: number }> => {
  const db = new sqlite3.Database(process.env.DB ?? './db/vki-web.db');

  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO student (first_name, last_name, midle_name, group_id)
      VALUES (?, ?, ?, ?)
    `;

    db.run(
      sql,
      [student.first_name, student.last_name, student.midle_name, student.group_id],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...student });
        }
      }
    );

    db.close();
  });
};
