'use client';

import { FaGithub, FaGoogle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '@/redux/actions/auth';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginSchema = z.infer<typeof loginSchema>;

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
    const { mutate: login, isPending } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = handleSubmit(data => {
        login(data);
    });

    return (
        <div className="grid gap-6 w-full">
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        {...register('email')}
                    />
                    {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="********"
                        {...register('password')}
                    />
                    {errors.password && (
                        <p className="text-sm text-destructive">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                            'Sign in'
                        )}
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" disabled={isPending}>
                        <FaGithub className="mr-2 h-4 w-4" />
                        GitHub
                    </Button>
                    <Button variant="outline" type="button">
                        <FaGoogle className="mr-2 h-4 w-4" />
                        Google
                    </Button>
                </div>
            </form>

            <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="text-primary hover:underline">
                    Sign up
                </Link>
            </div>
        </div>
    );
}
