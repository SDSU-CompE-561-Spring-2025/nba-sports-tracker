"use client"
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { API_HOST_BASE_URL } from '@/lib/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from "zod"
function ForgotPasswordPage() {

  const formSchema = z.object({
    user_name: z.string().min(8, { message: "Username must be at least 8 characters" })
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_name: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch(`${API_HOST_BASE_URL}/auth/user/verify/newcoderequest/${values.user_name}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      localStorage.setItem('user_name', values.user_name);
      setTimeout(() => {
        window.location.href = '/forgot_password/update-password';
      }, 2000);
      return true;
    }
    throw new Error('Invalid Credentials');
  }

  return (
    <Form {...form}>
      <h2>Forgot-Password Step 1 of 2</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 w-full justify-center">
        <FormField
          control={form.control}
          name="user_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter your username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Next</Button>
      </form>
    </Form>
  );
}

export default ForgotPasswordPage;