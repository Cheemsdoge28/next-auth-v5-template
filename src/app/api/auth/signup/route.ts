// /pages/api/auth/signup.ts

import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(400).json({ error: 'User already exists.' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user, default role is 'user'
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: 'user', // Default role
    },
  });

  res.status(201).json({ message: 'User created successfully', user });
}
