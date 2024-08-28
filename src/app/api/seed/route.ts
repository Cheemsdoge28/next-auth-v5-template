// src/app/api/seed/route.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Clear existing data
    await prisma.student.deleteMany();

    // Seed new data
    await prisma.student.createMany({
      data: [
        {
          name: 'Alice Johnson',
          sex: 'F',
          standard: '10th',
          birth_date: new Date('2006-03-22'),
          receipt_no: 'REC1001',
          mode_of_payment: 'Online',
          fee_received: 1500.00,
          total_fee_amount: 1500.00,
          pending_fee_amount: 0.00,
          book_amount: 200.00,
          shirt: true,
          pant: false,
          formals: true,
          email_id: 'alice.johnson@example.com',
        },
        {
          name: 'Bob Smith',
          sex: 'M',
          standard: '9th',
          birth_date: new Date('2007-07-15'),
          receipt_no: 'REC1002',
          mode_of_payment: 'Cash',
          fee_received: 1200.00,
          total_fee_amount: 1200.00,
          pending_fee_amount: 0.00,
          book_amount: 150.00,
          shirt: true,
          pant: true,
          formals: false,
          email_id: 'bob.smith@example.com',
        },
        {
          name: 'Charlie Brown',
          sex: 'M',
          standard: '11th',
          birth_date: new Date('2005-11-05'),
          receipt_no: 'REC1003',
          mode_of_payment: 'Cheque',
          fee_received: 1800.00,
          total_fee_amount: 1800.00,
          pending_fee_amount: 0.00,
          book_amount: 250.00,
          shirt: true,
          pant: true,
          formals: true,
          email_id: 'charlie.brown@example.com',
        },
        {
          name: 'Diane Prince',
          sex: 'F',
          standard: '12th',
          birth_date: new Date('2004-09-30'),
          receipt_no: 'REC1004',
          mode_of_payment: 'Online',
          fee_received: 2000.00,
          total_fee_amount: 2000.00,
          pending_fee_amount: 0.00,
          book_amount: 300.00,
          shirt: true,
          pant: false,
          formals: true,
          email_id: 'diana.prince@example.com',
        },
      ],
    });

    return new Response(
      JSON.stringify({ message: 'Seed data successfully added.' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error seeding data:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to seed data.' }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
