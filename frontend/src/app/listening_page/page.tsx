'use client';

import { useAuth } from '@/context/AuthContext';
import { API_HOST_BASE_URL } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Page() {

  const { logout } = useAuth()
    const router = useRouter();
    useEffect(() => {
      const checkAudioEndpoint = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          if (!token) {
            logout(); // Clear context and token
            router.push("/sign_in_sign_up/sign-in"); // Redirect to sign-in
            return;
          }
    
          const res = await fetch(`${API_HOST_BASE_URL}/auth/audio/get_audios`, {
            headers: {
              token: token,
            },
          });
    
          if (!res.ok) {
            logout(); // Clear context and token
            router.push("/sign_in_sign_up/sign-in"); // Redirect to sign-in
            return;
        }
    
          // Optionally parse to ensure it's valid JSON (can be removed if not needed)
          await res.json();
        } catch (err) {
          console.error("Error checking audio endpoint:", err);
        }
      };
    
      checkAudioEndpoint();
    }, []);

  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/') && (file.type === 'audio/mpeg' || file.type === 'audio/wav')) {
      const url = URL.createObjectURL(file);
      setAudioSrc(url);
    } else {
      alert('Please select a valid MP3 or WAV file.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-6 bg-white shadow-lg rounded-2xl w-full max-w-md">
        <h1 className="text-2xl font-semibold text-indigo-700 mb-6">Play Your Audio File</h1>

        {/* Use label for clean click trigger */}
        <label htmlFor="audio-upload" className="cursor-pointer inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200">
          Choose File
        </label>
        <input
          id="audio-upload"
          type="file"
          accept="audio/mp3,audio/wav"
          onChange={handleFileChange}
          className="hidden"
        />

        {audioSrc && (
          <audio
            controls
            src={audioSrc}
            className="w-full mt-6 rounded-md border border-indigo-300"
          >
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </div>
  );
}
