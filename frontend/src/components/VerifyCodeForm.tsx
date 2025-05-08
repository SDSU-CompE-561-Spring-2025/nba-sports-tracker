"use client"

import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from './ui/form'
import { Input } from './ui/input'
import { API_HOST_BASE_URL } from '@/lib/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { LockKeyhole } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card'

function VerifyCodeForm() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("user_name") ?? "";
    setUserName(name);
  }, [])


  const formSchema = z.object({
    verification_code: z
      .string()
      .min(6, { message: "Verification Code must be 6 characters" })
      .max(6, { message: "Verification Code must be 6 characters" }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      verification_code: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(`${API_HOST_BASE_URL}/auth/user/verify?user_name=${userName}&verification_code=${values.verification_code}`, {
        method: 'PUT',
      });
  
      if (response.ok && response.body.is_verified) {
        setTimeout(() => {
          window.location.href = '/forgot_password/update-password';
        }, 2000);
        return true;
      }
      throw new Error('Invalid Credentials')

    }
    catch(err: any) {
      toast.error(err.message ?? "Error with the code")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-2">
          <div className="bg-primary/10 p-3 rounded-full">
            <LockKeyhole className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
        <CardDescription className="text-center">Step 2 of 3: Enter verification code</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="verification_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter 6-digit code" {...field} className="h-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" onClick={form.handleSubmit(onSubmit)}>
          Continue
        </Button>
      </CardFooter>
    </Card>
  )
}

export default VerifyCodeForm
