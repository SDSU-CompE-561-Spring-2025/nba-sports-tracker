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
import { redirect } from "next/navigation";

const formSchema = z.object({
    username: z.string(),
    password: z.string()
});

type FormValues = z.infer<typeof formSchema>;


export default function SignInForm() {
    const { token } = useAuth();               // ② grab the JWT
    if (token) (
        console.log("Success") // ① if token, redirect to dashboard
        //redirect("/dashboard"); // ③ if no token, render sign in page
    )

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