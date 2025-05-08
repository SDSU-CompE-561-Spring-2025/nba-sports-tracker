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
import { useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";



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

    const { logout } = useAuth()
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedTrackId, setSelectedTrackId] = useState<number | null>(null);

    const tableRef = useRef<HTMLDivElement | null>(null);
    const deleteButtonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const fetchAudio = async () => {
            try {
                // Retrieve the token (e.g., from local storage)
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    console.error("No token found");
                    return;
                }

                // Fetch audio data using the token
                const res = await fetch(`${API_HOST_BASE_URL}/auth/audio/get_audios`, {
                    headers: {
                        token: token, // Send only the token
                    },
                });
                if (!res.ok) {
                  logout(); // Clear context and token
                  router.push("/sign_in_sign_up/sign-in"); // Redirect to sign-in
                  return;
              }
                const data = await res.json();
                setAudioData(data);
            } catch (err) {
                console.error("Error fetching audio data:", err);
            }
        };

        fetchAudio();
    }, []);

    const filteredData = audioData.filter(audio =>
        audio.audio_name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          const target = event.target as Node;
      
          if (
            tableRef.current &&
            !tableRef.current.contains(target) &&
            deleteButtonRef.current &&
            !deleteButtonRef.current.contains(target)
          ) {
            setSelectedTrackId(null);
          }
        };
      
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-full max-w-3xl p-6 bg-blue-700 rounded-2xl shadow-lg overflow-x-hidden">
            {/* Search Bar */}
            <div className="flex justify-between items-center mb-4">
  {/* Search Input */}
  <input
    type="text"
    style={{ fontSize: "1rem" }}
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search audio name..."
    className="w-full max-w-55 px-4 py-2 rounded-lg border border-gray-600 bg-blue-900 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-200 text-12"
  />

  {/* Delete Button (only shown if a row is selected) */}
  {selectedTrackId !== null && (
  <button
  style={{ fontSize: "1.5rem" }}
  ref={deleteButtonRef}
    onClick={async () => {
      const confirmed = window.confirm("Are you sure you want to delete this audio?");
      if (!confirmed) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const res = await fetch(`${API_HOST_BASE_URL}/auth/audio/delete/${selectedTrackId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const msg = await res.text(); // Your backend returns a text response
        if (!res.ok) throw new Error(msg || "Failed to delete");

        // Update state
        setAudioData(prev => prev.filter(audio => audio.track_id !== selectedTrackId));
        setSelectedTrackId(null);

        alert(msg); // optional: show success message
      } catch (err: any) {
        alert("Error: " + (err.message || "Unknown error deleting audio"));
        console.error("Delete failed:", err);
      }
    }}
    className="ml-4 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-500 transition duration-200 hover:scale-[1.05]"
  >
    Delete
  </button>
)}
</div>
    <div ref={tableRef}>
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
            onClick={() => setSelectedTrackId(audio.track_id)}
            className={`transition-all duration-200 ease-in-out cursor-pointer ${
              selectedTrackId === audio.track_id ? "bg-blue-300 scale-[.99] hover:scale-[.97]" : "hover:bg-blue-500 hover:scale-[.97]"
            }`}
            //className="transition-all duration-200 ease-in-out hover:bg-blue-500 hover:scale-[.97]"
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
      </div>
      //</>
    );
}
