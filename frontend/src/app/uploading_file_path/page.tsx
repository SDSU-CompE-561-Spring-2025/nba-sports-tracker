import { AudioUploader } from "@/components/audio-uploader"

export default function AudioUploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Upload Audio</h1>
          <p className="mt-2 text-slate-600">Share your audio files with us. We support MP3, WAV, and OGG formats.</p>
        </div>

        <AudioUploader />
      </div>
    </div>
  )
}
