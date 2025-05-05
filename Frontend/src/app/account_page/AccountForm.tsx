
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { apiFetch } from "@/lib/api";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast"

interface Props {
  userId: number;
  initialUsername: string;
  initialEmail: string;
}

type FormValues = {
  username: string;
  email: string;
  currentPassword: string;
  newPassword: string;
};

export default function AccountForm({ userId, initialUsername, initialEmail }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      username: initialUsername ?? "",
      email:    initialEmail   ?? "",
      currentPassword: "",
      newPassword: "",
    },
  })
  

  // Single submit handler for all fields
  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      // Update username if changed
      if (values.username !== initialUsername) {
        await apiFetch(`/auth/user/update/username/${userId}`, {
          method: "PUT",
          body: JSON.stringify({ username: values.username }),
        });
        toast("Username updated!");
    }

      // Update email if changed
      if (values.email !== initialEmail) {
        await apiFetch(`/auth/user/update/email/${userId}`, {
          method: "PUT",
          body: JSON.stringify({ email: values.email }),
        });
        toast("Email updated!");
    }

      // Update password if newPassword provided
      if (values.newPassword) {
        await apiFetch(`/auth/user/update/password/${userId}`, {
          method: "PUT",
          body: JSON.stringify({
            current_password: values.currentPassword,
            new_password: values.newPassword,
          }),
        });
        toast("Password changed!");
    }
    } catch (err: any) {
        toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <h2 className="text-xl font-semibold">Account Settings</h2>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Current Password */}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter>
        <small className="text-gray-500">Manage your profile information securely.</small>
      </CardFooter>
    </Card>
  );
}
