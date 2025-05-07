// app/account_page/AudioFilesList.tsx
"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface AudioFile {
  id:   number;
  name: string;
  path: string;
}

interface Props {
  files: AudioFile[];
}

export default function AudioFilesList({ files }: Props) {
  const [list, setList] = useState<AudioFile[]>(files);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleDelete = async (audioId: number) => {
    try {
      await apiFetch(`/auth/audio/delete/${audioId}`, { method: "DELETE" });
      setList(prev => prev.filter(f => f.id !== audioId));
      toast("File deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSave = async (audioId: number) => {
    const file = list.find(f => f.id === audioId);
    if (!file) return;
    try {
      await apiFetch(`/auth/audio/update/${audioId}`, {
        method: "PUT",
        body: JSON.stringify({ audio_name: file.name, file_path: file.path }),
      });
      toast("File updated");
      setEditingId(null);
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Saved Audio Files</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {list.length > 0 && (
          <div className="flex items-center space-x-2 px-4">
            <div className="w-8 text-base font-semibold text-gray-300">#</div>
            <div className="w-1/3 text-base font-semibold text-gray-300">Audio Name</div>
            <div className="flex-1 text-base font-semibold text-gray-300">Filepath</div>
            <div className="w-32" />
          </div>
        )}
        {list.length === 0 ? (
          <p>No saved files yet.</p>
        ) : (
          list.map((file, idx) => (
            <div key={file.id} className="flex items-center space-x-2">
              <div className="w-8 text-base text-gray-100">{idx + 1}</div>
              <Input
                value={file.name}
                onChange={e => {
                  const newName = e.currentTarget.value;
                  setList(prev =>
                    prev.map(f =>
                      f.id === file.id ? { ...f, name: newName } : f
                    )
                  );
                }}
                disabled={editingId !== file.id}
                className="w-1/3 text-base"
              />
              <Input
                value={file.path}
                onChange={e => {
                  const newPath = e.currentTarget.value;
                  setList(prev =>
                    prev.map(f =>
                      f.id === file.id ? { ...f, path: newPath } : f
                    )
                  );
                }}
                disabled={editingId !== file.id}
                className="flex-1 text-base"
              />
              {editingId === file.id ? (
                <>
                  <Button size="sm" onClick={() => handleSave(file.id)}>
                    Save
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" onClick={() => setEditingId(file.id)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(file.id)}>
                    Delete
                  </Button>
                </>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
