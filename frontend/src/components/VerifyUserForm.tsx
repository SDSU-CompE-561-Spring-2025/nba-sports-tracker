"use client"

import React from 'react'
import { Button } from './ui/button'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from './ui/form'
import { Input } from './ui/input'
import { API_HOST_BASE_URL } from '@/lib/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { getUser } from '@/lib/auth'
import { toast } from 'sonner'



function VerifyUserForm() {

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
    try {
    const token = localStorage.getItem("accessToken")
    if(!token) {
      throw Error("No Token exists for user")
    }
    const res = await getUser();
     if(res.user_name != values.user_name) {
        throw Error("Username provided is wrong")
     }
     const response = await fetch(`${API_HOST_BASE_URL}/auth/user/verify/newcoderequest`, {
      method: 'PUT',
      headers: {
        token: token
      },
    });

    if (response.ok) {
      setTimeout(() => {
        window.location.href = '/forgot_password/verify-code';
      }, 2000);
      return true;
    }
    throw new Error('Invalid Credentials');

    }
    catch(err: any) {
      toast.error(err.message ?? "Error!!")
    }
    
   
  }

  return (
    <Form {...form}>
    <h2>Forgot Password Step 1 of 3</h2>
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
  )
}

export default VerifyUserForm