import type StudentInterface from '@/types/StudentInterface';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchStudents = async (): Promise<StudentInterface[]> => {
  const res = await fetch('http://localhost:3000/api/students');
  if (!res.ok) throw new Error('Ошибка загрузки студентов');
  return res.json();
};

const deleteStudent = async (id: number): Promise<void> => {
  const res = await fetch(`http://localhost:3000/api/students/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Ошибка удаления студента');
};

interface NewStudent {
  first_name: string;
  last_name: string;
  midle_name?: string;
  group_id: number;
}

const addStudent = async (student: NewStudent): Promise<StudentInterface> => {
  const res = await fetch('http://localhost:3000/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  if (!res.ok) throw new Error('Ошибка добавления студента');
  return res.json();
};

const useStudents = () => {
  const queryClient = useQueryClient();

  const query = useQuery<StudentInterface[], Error>({
    queryKey: ['students'],
    queryFn: fetchStudents,
    staleTime: 1000 * 60, 
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const addMutation = useMutation({
    mutationFn: addStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  return {
    ...query,
    deleteStudent: deleteMutation.mutateAsync,
    addStudent: addMutation.mutateAsync,
  };
};

export default useStudents;
