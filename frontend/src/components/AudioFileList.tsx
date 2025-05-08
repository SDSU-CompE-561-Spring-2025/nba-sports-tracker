"use client";

import { useState } from "react";
import { apiFetch }    from "@/lib/api";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button }      from "@/components/ui/button";
import { Input }       from "@/components/ui/input";
import { useToast }    from "@/components/ui/use-toast";

interface AudioFile {
  id:   number;
  path: string;
  name: string;
}

interface Props {
  files: AudioFile[];
}

export default function AudioFilesList({ files }: Props) {
  const { toast } = useToast();

  // 1) Keep your own copy of paths so the inputs stay in sync
  const [list, setList] = useState<AudioFile[]>(files);

  // 2) Track which row is being edited
  const [editingId, setEditingId] = useState<number | null>(null);

  // 3) Handlers

  // Delete is unchanged
  const handleDelete = async (audioId: number) => {
    await apiFetch(`/auth/audio/delete/${audioId}`, { method: "DELETE" });
    setList((l) => l.filter((f) => f.id !== audioId));
    toast("File removed");
  };

  // Rename now only does the API call; it takes the new path
  const handleSave = async (audioId: number) => {
    const file = list.find((f) => f.id === audioId);
    if (!file) return;
    await apiFetch(`/auth/audio/update/${audioId}`, {
      method: "PUT",
      body: JSON.stringify({ audio_name: file.name, file_path: file.path }),
    });
    toast("File renamed");
    setEditingId(null);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Saved Audio Files</h2>
      </CardHeader>

      <CardContent className="space-y-4">
        {list.length === 0 ? (
          <p>No saved files yet.</p>
        ) : (
          list.map((file, idx) => (
            <div key={file.id} className="flex items-center space-x-2">
              {/* 1-based index */}
              <div className="w-6 text-base text-foreground">{idx + 1}.</div>

              {/* Audio Name (controlled) */}
              <Input
                value={file.name}
                disabled={editingId !== file.id}
                onChange={(e) => {
                  // 1) grab value synchronously
                  const newName = e.currentTarget.value;
                  // 2) update state
                  setList((prev) =>
                    prev.map((f) =>
                      f.id === file.id ? { ...f, name: newName } : f
                    )
                  );
                }}
                className="w-1/3 text-base text-foreground"
              />

              {/* File Path (controlled) */}
              <Input
                value={file.path}
                disabled={editingId !== file.id}
                onChange={(e) => {
                  // grab it immediately
                  const newPath = e.currentTarget.value;
                  setList((prev) =>
                    prev.map((f) =>
                      f.id === file.id ? { ...f, path: newPath } : f
                    )
                  );
                }}
                className="flex-1 text-base text-foreground"
              />

              {/* Actions */}
              {editingId === file.id ? (
                <>
                  <Button size="sm" onClick={() => handleSave(file.id)}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" onClick={() => setEditingId(file.id)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(file.id)}
                  >
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
