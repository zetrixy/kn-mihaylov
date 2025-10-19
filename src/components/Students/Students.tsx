'use client';

import useStudents from '@/hooks/useStudents';
import type StudentInterface from '@/types/StudentInterface';
import styles from './Student.module.scss';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface NewStudentForm {
  first_name: string;
  last_name: string;
  midle_name: string;
  group_id: number;
}

const Students = (): React.ReactElement => {
const { data: students = [], addStudent, deleteStudent } = useStudents(); 

  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset } = useForm<NewStudentForm>();

  const handleDelete = async (id: number) => {
  try {
    await deleteStudent(id); 
    } catch (err) {
      console.error('Ошибка при удалении студента', err);
    }
  };

  const onSubmit = async (data: NewStudentForm) => {
    try {
      await addStudent(data);
      reset();
      setShowForm(false);
    } catch (err) {
      console.error('Ошибка при добавлении студента', err);
    }
  };

  return (
    <div className="Students">
      {students.map((stud: StudentInterface) => (
        <Student key={stud.id} student={stud} onDelete={handleDelete} />
      ))}
     <button className={styles.AddButton} onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Отмена' : 'Добавить студента'}
      </button>

      {showForm && (
        <div className={styles.FormContainer}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.Form}>
            <input {...register('last_name', { required: true })} placeholder="Фамилия" />
            <input {...register('first_name', { required: true })} placeholder="Имя" />
            <input {...register('midle_name')} placeholder="Отчество" />
            <input
              type="number"
              {...register('group_id', { required: true })}
              placeholder="Номер группы"
            />
            <button type="submit" className={styles.SubmitButton}>Сохранить</button>
          </form>
        </div>
      )}
    </div>
  );
};

interface Props {
  student: StudentInterface;
  onDelete: (id: number) => void;
}

const Student = ({ student, onDelete }: Props): React.ReactElement => {
  const onDeleteHandler = (): void => {
    onDelete(student.id);
  };

  return (
    <div className={`${styles.Student} ${student.isDeleted ? styles['--isDeleted'] : '' }`}>
      {student.last_name}
      {' '}
      {student.first_name}
      {' '}
      {student.midle_name}
      {' '}
      {`(группа ${student.group_id})`}
      <button onClick={onDeleteHandler} className={styles.DeleteButton}>
        Удалить
      </button>
    </div>
  );
};

export default Students;