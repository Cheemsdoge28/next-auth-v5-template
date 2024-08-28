'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { signUpSchema } from '@/schemas/authSchemas';
import { z } from 'zod';

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUpPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  useEffect(() => {
    // Ensure this code runs only on the client side
    if (!router) {
      console.error('NextRouter was not mounted');
    }
  }, [router]);

  const onSubmit = async (data: SignUpFormValues) => {
    // Handle form submission
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="default" className="mb-4">
            {success}
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              required
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              required
            />
            {errors.password && <p>{errors.password.message}</p>}
          </div>
          <Button type="submit">Sign Up</Button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;