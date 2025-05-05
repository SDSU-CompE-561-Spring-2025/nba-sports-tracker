
// app/account_page/page.tsx
import AccountForm from "./AccountForm";
import { apiFetch } from "@/lib/api";

interface User {
  id: number;
  username: string;
  email: string;
}

export default async function AccountPage() {
  const userId = 5; 
  const user = await apiFetch<User>(`/auth/user/${userId}`);

  return (
    <main className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
      <AccountForm
        userId={user.id}
        initialUsername={user.username}
        initialEmail={user.email}
      />
    </main>
  );
}

