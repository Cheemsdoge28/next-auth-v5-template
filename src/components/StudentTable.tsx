import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

interface ShadCNTableProps {
  data: any[];
}

const ShadCNTable: React.FC<ShadCNTableProps> = ({ data }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Standard</TableHead>
          <TableHead>Fee Received</TableHead>
          <TableHead>Total Fee</TableHead>
          <TableHead>Pending Fee</TableHead>
          <TableHead>Book Amount</TableHead>
          <TableHead> Uniform </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((student) => (
          <TableRow key={student.student_id}>
            <TableCell>{student.student_id}</TableCell>
            <TableCell>{student.name}</TableCell>
            <TableCell>{student.email_id}</TableCell>
            <TableCell>{student.standard}</TableCell>
            <TableCell>{student.fee_received}</TableCell>
            <TableCell>{student.total_fee_amount}</TableCell>
            <TableCell>{student.pending_fee_amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ShadCNTable;
