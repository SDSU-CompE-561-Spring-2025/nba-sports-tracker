"use client"

import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from './ui/form'
import { Input } from './ui/input'
import { API_HOST_BASE_URL } from '@/lib/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

function ChangePasswordForm() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("user_name") ?? "";
    setUserName(name);
  }, [])


  const formSchema = z.object({
    password: z.string().min(6, { message: "Verification Code must be 6 characters" })
      .max(6, { message: "Verification Code must be 6 characters" }),
    confirm_password: z.string().min(6, { message: "Verification Code must be 6 characters" })
      .max(6, { message: "Verification Code must be 6 characters" })
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirm_password: ''
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch(`${API_HOST_BASE_URL}/auth/user/verify/${userName}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: values.password,
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
      <h2>Forgot-Password Step 2 of 2</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 w-full justify-center">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter a new password</FormLabel>
              <FormControl>
                <Input placeholder="Enter Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="Confirm Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Change Password</Button>
      </form>
    </Form>
  )
}

export default ChangePasswordForm