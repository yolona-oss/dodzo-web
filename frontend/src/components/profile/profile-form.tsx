'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useUser } from '@/redux/actions/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as API from '@/api';
import { useAppDispatch } from '@/redux/store';
import { newNotify } from '@/redux/features/notify/notifySlice';

const formSchema = z
.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional()
    .or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
})
.refine(
    data => {
        if (data.password || data.confirmPassword) {
            return data.password === data.confirmPassword;
        }
        return true;
    },
    {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    },
);

export function ProfileForm() {
    const { user, isLoading } = useUser();
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        values: {
            name: user?.name || '',
            email: user?.email || '',
            password: '',
            confirmPassword: '',
        },
    });

    const updateProfile = useMutation({
        mutationFn: (values: z.infer<typeof formSchema>) =>
            API.updateProfile({
                name: values.name,
                email: values.email,
                ...(values.password ? { password: values.password } : {}),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            form.reset({ password: '', confirmPassword: '' });
            dispatch(newNotify({
                title: 'Profile updated',
                description: 'Your profile has been updated successfully.',
                variant: 'success',
            }))
        },
        onError: () => {
            dispatch(
                newNotify({
                    title: 'Error',
                    description: 'There was an error updating your profile.',
                    variant: 'warning',
                })
            )
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Card className="mt-10 max-w-2xl mx-auto">
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">User Profile</h2>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(values => updateProfile.mutate(values))}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="Leave blank to keep current"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="Leave blank to keep current"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={updateProfile.isPending}
                        >
                            {updateProfile.isPending ? 'Updating...' : 'Update Profile'}
                        </Button>
                    </form>
                </Form>
            </div>
        </Card>
    );
}
