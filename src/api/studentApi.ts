import type StudentInterface from '@/types/StudentInterface';

export const getStudentApi = async (): Promise<StudentInterface[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}stundets`);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    const groups = await response.json() as StudentInterface[];
    return groups;
  }
  catch (err) {
    console.log('>>> getStudentApi', err);
    return [] as StudentInterface[];
  }
};
