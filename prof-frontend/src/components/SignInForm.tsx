'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { API_HOST_BASE_URL } from '@/lib/constants';

const formSchema = z.object({
    username: z.string().min(2, {
        message: 'Username must be at least 2 characters.',
    }),
    password: z.string().min(3, {
        message: 'Password must be at least 3 characters.',
    }),
});

export default function ProfileForm() {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
            const data = values;

            const response = await fetch(`${API_HOST_BASE_URL}/auth/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(data).toString(),
            });

            if (response.ok) {
                const result = await response.json();
                // Store the token with the correct key
                localStorage.setItem('token', result.access_token);

                // Show success toast
                toast.success('Login successful! Redirecting...');

                // Redirect after a short delay
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
                return true;
            }

            // Handle invalid credentials
            throw new Error('Invalid Credentials');
        } catch (error: any) {
            // Show error toast
            toast.error(error.message || 'An error occurred during login.');
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
            >
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="compe"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>This is your public display name.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    type={'password'}
                                    placeholder="password"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>This is the password field.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
