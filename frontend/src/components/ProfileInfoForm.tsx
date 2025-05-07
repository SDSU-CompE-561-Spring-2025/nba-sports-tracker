// app/account_page/ProfileInfoForm.tsx
"use client";

import { useState } from "react";
import { useForm }  from "react-hook-form";
import { apiFetch } from "@/lib/api";

import { Label }     from "@/components/ui/label"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input }    from "@/components/ui/input";
import { Button }   from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast }    from "@/components/ui/use-toast";

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

export default function ProfileInfoForm({ userId, initialUsername, initialEmail }: Props) {
    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState(initialUsername);
    const [email, setEmail] = useState(initialEmail);
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
  
    const handleSave = async () => {
      setLoading(true);
      try {
        await apiFetch(`/auth/user/update/username/${userId}`, {
          method: "PUT",
          body: JSON.stringify({ user_name: username }),
        });
        await apiFetch(`/auth/user/update/email/${userId}`, {
          method: "PUT",
          body: JSON.stringify({ email: email }),
        });
        toast("Profile updated");
        setEditing(false);
      } catch (err: any) {
        toast.error(err.message || "Failed to update profile");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Account Info</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm text-gray-400">Username</Label>
            <Input
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={!editing}
              className="text-base"
            />
          </div>
          <div>
            <Label className="text-sm text-gray-400">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={!editing}
              className="text-base"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {editing ? (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setUsername(initialUsername);
                  setEmail(initialEmail);
                  setEditing(false);
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>Edit</Button>
          )}
        </CardFooter>
      </Card>
    );
  }