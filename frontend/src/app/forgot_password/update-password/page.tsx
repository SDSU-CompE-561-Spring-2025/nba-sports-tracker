"use-client"
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage,Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { API_HOST_BASE_URL } from '@/lib/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

function ForgotPasswordPage() {

  const [userName, setUserName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("user_name") ?? "";
    setUserName(name);
  }, [])
  

  const formSchema = z.object({
      verification_code: z.string().min(6, { message: "Verification Code must be 6 characters" })
      .max(6, { message: "Verification Code must be 6 characters" })
    })
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        verification_code: '',
      },
    })
  
    async function onSubmit(values: z.infer<typeof formSchema>) {
      const response = await fetch(`${API_HOST_BASE_URL}/auth/user/verify/${userName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body:  values.verification_code,
      });
  
      if (response.ok) {
        setTimeout(() => {
          window.location.href = '/forgot_password/update-password';
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
        name="verification_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Enter Verification Code</FormLabel>
            <FormControl>
              <Input placeholder="Enter Verification Code" {...field} />
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

export default ForgotPasswordPage;