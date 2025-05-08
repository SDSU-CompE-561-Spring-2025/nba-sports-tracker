"use client";

import { useEffect, useState, useRef } from "react";
import { API_HOST_BASE_URL } from "@/lib/constants";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Trash2, FileAudio, Calendar, FolderOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/badge";

type AudioRecord = {
  track_id: number;
  user_id: number;
  audio_name: string;
  created_at: string;
  file_path: string;
};

export default function ViewFilePaths() {
  const [audioData, setAudioData] = useState<AudioRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrackId, setSelectedTrackId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const tableRef = useRef<HTMLDivElement | null>(null);
  const deleteButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const fetchAudio = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("No token found");
          return;
        }

        const res = await fetch(`${API_HOST_BASE_URL}/auth/audio/get_audios`, {
          headers: {
            token: token,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setAudioData(data);
      } catch (err) {
        console.error("Error fetching audio data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudio();
  }, []);

  const filteredData = audioData.filter((audio) =>
    audio.audio_name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleDelete = async () => {
    if (!selectedTrackId) return;

    const confirmed = window.confirm("Are you sure you want to delete this audio?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("accessToken");
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

      const msg = await res.text();
      if (!res.ok) throw new Error(msg || "Failed to delete");

      setAudioData((prev) => prev.filter((audio) => audio.track_id !== selectedTrackId));
      setSelectedTrackId(null);

      alert(msg);
    } catch (err: any) {
      alert("Error: " + (err.message || "Unknown error deleting audio"));
      console.error("Delete failed:", err);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Invalid Date";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Card className="w-full max-w-5xl shadow-xl border-slate-700">
        <CardHeader className="bg-slate-800 border-b border-slate-700 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-2xl font-bold text-white flex items-center">
              <FileAudio className="mr-2 h-6 w-6 text-cyan-400" />
              Audio Files
            </CardTitle>

            <div className="relative w-full md:w-auto flex-1 md:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search audio files..."
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 w-full focus-visible:ring-cyan-500"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-slate-300">
                {filteredData.length} {filteredData.length === 1 ? "file" : "files"} found
              </div>

              {selectedTrackId !== null && (
                <Button ref={deleteButtonRef} onClick={handleDelete} variant="destructive" size="sm" className="gap-1">
                  <Trash2 className="h-4 w-4" />
                  Delete Selected
                </Button>
              )}
            </div>

            <div ref={tableRef} className="rounded-md border border-slate-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-800 hover:bg-slate-800">
                    <TableHead className="text-slate-300 font-medium">
                      <div className="flex items-center gap-2">
                        <FileAudio className="h-4 w-4 text-cyan-400" />
                        File Name
                      </div>
                    </TableHead>
                    <TableHead className="text-slate-300 font-medium">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4 text-cyan-400" />
                        Path
                      </div>
                    </TableHead>
                    <TableHead className="text-slate-300 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-cyan-400" />
                        Created
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center text-slate-400">
                        Loading audio files...
                      </TableCell>
                    </TableRow>
                  ) : filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center text-slate-400">
                        No audio files found
                      </TableCell>
                    </TableRow>
                  ) : (
                    <AnimatePresence>
                      {filteredData.map((audio) => (
                        <motion.tr
                          key={audio.track_id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => setSelectedTrackId(audio.track_id)}
                          className={`cursor-pointer transition-colors ${
                            selectedTrackId === audio.track_id
                              ? "bg-cyan-950/40 hover:bg-cyan-950/60"
                              : "hover:bg-slate-800"
                          }`}
                        >
                          <TableCell>
                            <div className="font-medium text-white">{audio.audio_name}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-slate-300 font-mono truncate max-w-[200px] md:max-w-[300px]">
                              {audio.file_path}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-600">
                              {audio.created_at ? formatDate(audio.created_at) : "No Date Available"}
                            </Badge>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
