'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { signInSchema } from '@/schemas/authSchemas';
import { signIn } from 'next-auth/react';
import { z } from 'zod';

type SignInFormValues = z.infer<typeof signInSchema>;

const SignInPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      setSuccess('Sign-in successful!');
      setError(null);

      // Redirect to home or another page after sign-in
      setTimeout(() => router.push('/'), 2000);
    } catch (err: any) {
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        {error && <Alert variant="error" className="mb-4">{error}</Alert>}
        {success && <Alert variant="success" className="mb-4">{success}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              required
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <div className="mb-6">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              required
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
        <div className="mt-4 text-center">
          <a href="/auth/reset-password" className="text-blue-600">Forgot your password?</a>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
