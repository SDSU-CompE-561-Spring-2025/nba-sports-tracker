"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Upload, X, Play, Pause, Volume2 } from "lucide-react"
import { upload } from "@vercel/blob/client"
import { cn } from "@/lib/utils"

export function AudioUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Check if file is an audio file
      if (!selectedFile.type.startsWith("audio/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an audio file (MP3, WAV, OGG)",
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)

      // Create a local URL for the file for preview
      const localUrl = URL.createObjectURL(selectedFile)
      setAudioUrl(localUrl)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + 5
        })
      }, 300)

      // Upload to Vercel Blob
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload-audio",
        onProgress: (progress) => {
          // This won't work locally, but would work in production
          console.log(`Upload progress: ${progress}%`)
        },
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Update the audio URL to the permanent one
      setAudioUrl(blob.url)

      toast({
        title: "Upload successful",
        description: "Your audio file has been uploaded.",
      })
    } catch (error) {
      console.error("Upload failed:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setAudioUrl(null)
    setIsPlaying(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center">Audio Uploader</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-4",
              file ? "border-slate-300 bg-slate-50" : "border-slate-200 hover:border-slate-300",
            )}
          >
            {!file ? (
              <>
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-slate-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-900">Drag and drop your audio file here</p>
                  <p className="text-xs text-slate-500 mt-1">MP3, WAV, or OGG up to 100MB</p>
                </div>
                <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                  Select File
                </Button>
                <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={handleFileChange} />
              </>
            ) : (
              <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <Volume2 className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {audioUrl && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={togglePlayPause}>
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <audio ref={audioRef} src={audioUrl} className="hidden" onEnded={() => setIsPlaying(false)} />
                      <div className="w-full">
                        <audio
                          controls
                          src={audioUrl}
                          className="w-full h-8"
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {isUploading && (
                  <div className="mb-4">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-slate-500 mt-1 text-right">{uploadProgress}% uploaded</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={!file || isUploading} onClick={handleUpload}>
            {isUploading ? "Uploading..." : "Upload Audio"}
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </>
  )
}
