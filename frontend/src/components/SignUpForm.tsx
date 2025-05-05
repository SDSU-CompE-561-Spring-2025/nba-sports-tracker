"use client";

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

import { API_HOST_BASE_URL } from '@/lib/constants';



export default function SignUpForm() {
    const formSchema = z.object({
        user_name: z.string().min(3, {
            message: 'Username must be at least 3 characters.',
        }),
        password: z.string().min(6, {
            message: 'Password must be at least 6 characters.',
        }),
        email: z.string().email({
            message: 'Invalid email address.',
        }),
    
    });

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            user_name: '',
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
            const data = values;
    
            const response = await fetch(`${API_HOST_BASE_URL}/auth/make_user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (response.ok) {
                // const result = await response.json();
                // toast('Everything went wrong');
                // localStorage.setItem('accessToken', result.access_token);
    
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
                return true;
            }
            throw new Error('Invalid Credentials');
      }


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
            >
                <FormField
                    control={form.control}
                    name="user_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Username"
                                    {...field}
                                />
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
                                <Input
                                    type={'Email'}
                                    placeholder="Enter you email here"
                                    {...field}
                                />
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    type={'password'}
                                    placeholder="Password"
                                    {...field}
                                />
                            </FormControl>
                            
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button variant={"outline"} type={"submit"} className={"mt-5"}>
                    Sign Up
                </Button>
            </form>
        </Form>
    );
}