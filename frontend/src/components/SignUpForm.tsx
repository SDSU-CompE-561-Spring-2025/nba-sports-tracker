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

import { API_HOST_BASE_URL } from '@/lib/constants';

import { useAuth } from '@/context/AuthContext'
import { redirect } from 'next/navigation';
import { toast } from 'sonner';



export default function SignUpForm() {
  const { token } = useAuth();               // ② grab the JWT
  if (token) redirect("/dashboard"); // ③ if no token, render sign in/sign up page

  const formSchema = z.object({
    user_name: z.string().min(8, { message: "Username must be at least 8 characters" })
      .max(40, { message: "Username must be at most 64 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" })
      .max(64, { message: "Password must be at most 64 characters" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
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
    try {

      const data = values;

      const response = await fetch(`${API_HOST_BASE_URL}/auth/make_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if(response.status == 405 || response.status == 400) {
        throw Error("User already Exists. Try Again!")
      }
      else if (response.ok) {
        toast.success("Welcome back!");
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
      
    }
    catch (err: any) {
      // Show an error message
      toast.error(err.message || "Login failed");
    }
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