import ProfileInfoForm from "@/components/ProfileInfoForm";
import AudioFilesList   from "@/components/AudioFileList";
import { apiFetch }     from "@/lib/api";

type RawAudio = {
  track_id: number;
  file_path: string;
  audio_name: string;
};

interface AudioFile {
  id:   number;
  path: string;
  name: string;
}

interface User {
  id: number;
  username: string;
  email: string;
}

export default async function AccountPage() {
  const userId = 5;
  
  // fetch the user and the typed audio‐file objects in parallel
  const [ user, rawFiles ] = await Promise.all([
    apiFetch<User>(`/auth/user/${userId}`),
    apiFetch<RawAudio[]>(`/auth/audio/get_audios/${userId}`)
  ]);

  const files: AudioFile[] = rawFiles.map(r => ({
    id:   r.track_id,
    path: r.file_path,
    name: r.audio_name,
  }));

  return (
    <main className="p-4 max-w-2xl mx-auto space-y-8">
      <ProfileInfoForm
        userId={user.id}
        initialUsername={user.username}
        initialEmail={user.email}
      />
      {/* now `files` is AudioFile[] */}
      <AudioFilesList files={files} />
    </main>
  );
}