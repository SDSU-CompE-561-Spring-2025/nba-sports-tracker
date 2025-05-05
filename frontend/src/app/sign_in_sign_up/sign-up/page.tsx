"use client"

import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { API_HOST_BASE_URL } from '@/lib/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from "zod"

function SignUpPage() {

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
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_name: '',
      email: '',
      password: '',
    },
  })

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
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      return true;
    }
    throw new Error('Invalid Credentials');
  }

  return (
    <Form {...form}>
      <h2>Sign Up</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 w-full justify-center">
        <FormField
          control={form.control}
          name="user_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
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
                <Input placeholder="Enter email" {...field} />
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
                <Input placeholder="Enter Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Sign Up</Button>
        <div className='flex items-center gap-4 text-sm'>
          <span>Already have an Account?</span>
          <a href="/sign_in_sign_up/sign-in" className='border rounded p-2 border-blue-500 text-blue-700'>Sign In here</a>
        </div>
      </form>
    </Form>
  )
}

export default SignUpPage;