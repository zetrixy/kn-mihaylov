interface StudentInterface {
  id: number;
  first_name: string;
  last_name: string;
  midle_name: string;
  group_id: Int32Array;
  isDeleted?: boolean;
};

export default StudentInterface;
