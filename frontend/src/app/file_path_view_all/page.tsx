"use client";

import { useEffect, useState } from "react";
import { API_HOST_BASE_URL } from '@/lib/constants'

type AudioRecord = {
    track_id: number;
    user_id: number;
    audio_name: string;
    created_at: string;
    file_path: string;
};

export default function ViewFilePaths() {
    const [audioData, setAudioData] = useState<AudioRecord[]>([]);

    const [userId, setUserId] = useState<number>(1);

    useEffect(() => {
        if (!userId) return;

        const fetchAudio = async () => {
            try {
                const res = await fetch(`${API_HOST_BASE_URL}/auth/audio/get_audios/${userId}`);
                if (!res.ok) throw new Error("Failed to fetch");

                const data = await res.json();
                setAudioData(data);
            } catch (err) {
                console.error("Error fetching audio data:", err);
            }
        };

        fetchAudio();
    }, []);

    return (
        <div>
            <h1>User Audio Files</h1>
            {audioData.length === 0 ? (
                <p>No audio data found.</p>
            ) : (
                <ul>
                    {audioData.map((audio) => (
                        <li key={audio.track_id}>
                            <p><strong>Name:</strong> {audio.audio_name}</p>
                            <p><strong>Created At:</strong> {audio.created_at}</p>
                            <p><strong>File Path:</strong> {audio.file_path}</p>
                            <hr />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}