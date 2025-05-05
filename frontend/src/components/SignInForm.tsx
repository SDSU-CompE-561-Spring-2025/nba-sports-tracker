"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

//auth
import { toast } from 'sonner';
import { login as apiLogin, type LoginData } from '@/lib/auth'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  username: z.string().min(8, { message: "Username must be at least 8 characters" })
  .max(40, { message: "Username must be at most 64 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
    .max(64, { message: "Password must be at most 64 characters" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
});

type FormValues = z.infer<typeof formSchema>;


export default function SignInForm() {
    // 1. Define your form.
    const router = useRouter();
    
    const { login: contextLogin } = useAuth();    // pull in the login

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { username: '', password: '' },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        
        try {
          const { access_token } = await apiLogin(values as LoginData)

          // 2) let the context know about it
          contextLogin(access_token)
    
          toast.success('Welcome back!')
          router.replace('/')
        } catch (err: any) {
          toast.error(err.message || 'Login failed')
        }
      });

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className="space-y-3"
            >
                <FormField
                    control={form.control}
                    name="username"
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
                    Submit
                </Button>
            </form>
        </Form>
    );
}