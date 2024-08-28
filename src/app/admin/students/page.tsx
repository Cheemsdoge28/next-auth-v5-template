import prisma from '@/lib/prisma';
import { Student } from '@prisma/client';
import ShadCNTable from '@/components/StudentTable';

// Define a type for your page props
type Props = {
  students: Student[];
};

// The main page component
const StudentsPage = async () => {
  // Fetch students data using Prisma
  const students: Student[] = await prisma.student.findMany();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Students</h1>
      <ShadCNTable data={students} />
    </div>
  );
};

export default StudentsPage;

export const revalidate = 10;
