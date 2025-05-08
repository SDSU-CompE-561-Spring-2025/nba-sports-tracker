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
  id:        number;
  user_name: string;
  email:     string;
}

export default function AccountPage() {
  const [user, setUser]     = useState<User | null>(null);
  const [files, setFiles]   = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("No token found");
      setLoading(false);
      return;
    }

    Promise.all([
      apiFetch<User>("/auth/user/", {
        headers: { token: token },
      }),
      apiFetch<RawAudio[]>("/auth/audio/get_audios/", {
        headers: { token: token },
      }),
    ])
      .then(([u, raw]) => {
        setUser(u);
        setFiles(
          raw.map((r) => ({
            id:   r.track_id,
            path: r.file_path,
            name: r.audio_name,
          }))
        );
      })
      .catch((err) => {
        console.error("Failed to fetch account data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
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
        userId={user.id}
        initialUsername={user.user_name}
        initialEmail={user.email}
      />
      <AudioFilesList files={files} />
    </main>
  );
}