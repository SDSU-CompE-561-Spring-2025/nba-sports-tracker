'use client';

import React, { useState } from 'react';

export default function Page() {
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

        <label className="block mb-6">
          <input
            type="file"
            accept="audio/mp3,audio/wav"
            onChange={handleFileChange}
            className="hidden"
            id="audio-upload"
          />
          <span
            className="inline-block cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            onClick={() => document.getElementById('audio-upload')?.click()}
          >
            Choose File
          </span>
        </label>

        {audioSrc && (
          <audio
            controls
            src={audioSrc}
            className="w-full mt-4 rounded-md border border-indigo-300"
          >
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </div>
  );
}
