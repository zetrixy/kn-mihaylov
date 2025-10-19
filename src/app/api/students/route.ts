import { getStudentDb } from '@/db/studentDb';
import { addStudentDb } from '@/db/studentDb';
import { type NextApiRequest } from 'next/types';

export async function GET(): Promise<Response> {
  const students = await getStudentDb();

  return new Response(JSON.stringify(students), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export async function POST(req: NextApiRequest): Promise<Response> {
  try {
    const body = await req.json();
    const { first_name, last_name, midle_name, group_id } = body;

    if (!first_name || !last_name || !group_id) {
      return new Response(
        JSON.stringify({ error: 'Не все обязательные поля заполнены' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newStudent = await addStudentDb({
      first_name,
      last_name,
      midle_name,
      group_id,
    });

    return new Response(JSON.stringify(newStudent), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err: any) {
    console.error('Ошибка при добавлении студента:', err);
    return new Response(
      JSON.stringify({ error: 'Ошибка при добавлении студента' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
