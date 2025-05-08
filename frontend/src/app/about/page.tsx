"use client";

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect } from 'react';

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About Us - The Audio Hub';
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-[#D62828] tracking-wide">About Us</h1>

      <Card className="bg-[#4BC4E2] p-6 shadow-lg rounded-2xl">
        <CardContent>
          <p className="text-[#D62828] text-lg font-light leading-relaxed">
            We are a group of CompE students who decided to make an audio playing website. We allow users to play audio stored on their hard drives through our website or they can upload them to our database, and then they can play it from there!
          </p>
        </CardContent>
      </Card>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-4 bg-[#4BC4E2] shadow-md rounded-2xl">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-2 text-[#D62828] underline">Functionality</h2>
            <ul className="list-disc pl-5 text-[#D62828] text-base space-y-2">
              <li>Upload audio and file path to the database via the Upload File Path page.</li>
              <li>Listen to audio files directly from your hard drive using the Listening Page.</li>
              <li>Access your uploaded content in the Dashboard and play it directly from the web.</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="p-4 bg-[#4BC4E2] shadow-md rounded-2xl">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-2 text-[#D62828] underline">Our Vision</h2>
            <p className="text-[#D62828] text-base">
              We aim to provide a seamless and user-friendly way to store and play audio files using the web.
            </p>
          </CardContent>
        </Card>
        <Card className="p-4 bg-[#4BC4E2] shadow-md rounded-2xl">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-2 text-[#D62828] underline">Our Team</h2>
            <ul className="list-disc pl-5 text-[#D62828] text-base space-y-1">
              <li>Christian Kassab</li>
              <li>Logan Hall</li>
              <li>Sai Nampalli</li>
              <li>Noah Molla</li>
              <li>Laith Oraha</li>
              <li>Sean Hashem</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
