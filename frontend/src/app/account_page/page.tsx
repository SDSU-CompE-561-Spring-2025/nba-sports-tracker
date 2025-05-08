// app/account_page/page.tsx
"use client";

import { useState, useEffect } from "react";
import ProfileInfoForm from "@/components/ProfileInfoForm";
import AudioFilesList  from "@/components/AudioFileList";
import { apiFetch }    from "@/lib/api";
import { toast } from "sonner";

type RawAudio = {
  track_id:   number;
  file_path:  string;
  audio_name: string;
};

interface AudioFile {
  id:   number;
  path: string;
  name: string;
}

interface User {
  user_name: string;
  email:     string;
}

export default function AccountPage() {
  const [user, setUser]       = useState<User | null>(null);
  const [files, setFiles]     = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_BASE!;

  useEffect(() => {
    // 1) Grab raw token
    const rawToken = localStorage.getItem("accessToken");
    // 2) If it's null, bail (or redirect)
    if (!rawToken) {
      setLoading(false);
      return;
    }
    // 3) Now TS knows `token` is a string
    const token: string = rawToken;

    async function fetchAccount(): Promise<void> {
      try {
        // build headers with a guaranteed string
        const headers: HeadersInit = {
          "Content-Type": "application/json",
          token,                // no more null!
        };

        // fetch user
        const userRes = await fetch(`${API}/auth/user/`, { headers });
        if (!userRes.ok) throw new Error("Failed to load user");
        const u: User = await userRes.json();
        setUser(u);

        // fetch audio
        const audioRes = await fetch(`${API}/auth/audio/get_audios/`, {
          headers,
        });
        if (!audioRes.ok) throw new Error("Failed to load audio files");
        const raw: RawAudio[] = await audioRes.json();
        setFiles(
          raw.map((r) => ({
            id:   r.track_id,
            path: r.file_path,
            name: r.audio_name,
          }))
        );
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAccount();
  }, []);

  if (loading) {
    return <p className="text-center p-4">Loading account…</p>;
  }
  if (!user) {
    return <p className="text-center p-4 text-destructive">Not signed in.</p>;
  }

  return (
    <main className="p-4 max-w-2xl mx-auto space-y-8">
      <ProfileInfoForm
        initialUsername={user.user_name}
        initialEmail={user.email}
      />
      <AudioFilesList files={files} />
    </main>
  );
}