"use client";

import { useEffect, useState } from "react";
import { API_HOST_BASE_URL } from '@/lib/constants'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion";
 
export function InputDemo() {
  return <Input type="email" placeholder="Email" />
}


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

    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = audioData.filter(audio =>
        audio.audio_name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-full max-w-3xl p-6 bg-blue-700 rounded-2xl shadow-lg overflow-x-hidden">
            {/* Search Bar */}
        <div className="flex justify-start mb-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audio name..."
            className="w-=50 max-w-sm px-4 py-2 rounded-lg border border-gray-600 bg-blue-900 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
          />
        </div>
        <Table>
        <TableHeader>
        <TableRow className="text-center transition duration-200 ease-in-out hover:bg-blue-600 hover:scale-[.97]">
          {['Name', 'Path', 'Time Created'].map((header, i) => (
            <TableHead
            key={i}
            className="text-center font-bold text-white px-4 py-2"
          >
            <div className="flex justify-center">
              <span className="bg-blue-400 hover:bg-blue-300 text-white rounded-full px-4 py-1 transition-transform duration-300 ease-in-out hover:scale-110">
                {header}
              </span>
            </div>
          </TableHead>
          ))}
        </TableRow>
      </TableHeader>
        <TableBody>
        <AnimatePresence>
          {filteredData.map((audio) => (
            <motion.tr
            key={audio.track_id}
            layout
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.15 }}
            className="transition-all duration-200 ease-in-out hover:bg-blue-500 hover:scale-[.97]"
          >
            <TableCell className="text-center">
              <span className="px-3 py-1 text-white ">
                {audio.audio_name}
              </span>
            </TableCell>
            <TableCell className="text-center">
              <span className="px-3 py-1 text-white">
                {audio.file_path}
              </span>
            </TableCell>
            <TableCell className="text-center">
              <span className="px-3 py-1 text-white">
                {audio.created_at}
              </span>
            </TableCell>
          </motion.tr>
          ))}
          <TableRow className="transition duration-200 ease-in-out hover:bg-blue-700 hover:scale-[.97]">
            <TableCell colSpan={3} className="w-[150px] text-center"></TableCell>
          </TableRow>
          </AnimatePresence>
        </TableBody>
      </Table>
      </div>
      </div>
      //</>
    );
}
