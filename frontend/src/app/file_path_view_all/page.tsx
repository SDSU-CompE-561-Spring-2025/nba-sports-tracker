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

    const invoices = [
        {
          invoice: "INV001",
          paymentStatus: "Paid",
          totalAmount: "$250.00",
          paymentMethod: "Credit Card",
        },
        {
          invoice: "INV002",
          paymentStatus: "Pending",
          totalAmount: "$150.00",
          paymentMethod: "PayPal",
        },
        {
          invoice: "INV003",
          paymentStatus: "Unpaid",
          totalAmount: "$350.00",
          paymentMethod: "Bank Transfer",
        },
        {
          invoice: "INV004",
          paymentStatus: "Paid",
          totalAmount: "$450.00",
          paymentMethod: "Credit Card",
        },
        {
          invoice: "INV005",
          paymentStatus: "Paid",
          totalAmount: "$550.00",
          paymentMethod: "PayPal",
        },
        {
          invoice: "INV006",
          paymentStatus: "Pending",
          totalAmount: "$200.00",
          paymentMethod: "Bank Transfer",
        },
        {
          invoice: "INV007",
          paymentStatus: "Unpaid",
          totalAmount: "$300.00",
          paymentMethod: "Credit Card",
        },
      ]

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
        //<>
        //</><div>
        //</>    <h1>User Audio Files</h1>
        //</>    {audioData.length === 0 ? (
        //</>        <p>No audio data found.</p>
        //</>    ) : (
        //</>        <ul>
        //</>            {audioData.map((audio) => (
        //</>                <li key={audio.track_id}>
        //</>                    <p><strong>Name:</strong> {audio.audio_name}</p>
        //</>                    <p><strong>Created At:</strong> {audio.created_at}</p>
        //</>                    <p><strong>File Path:</strong> {audio.file_path}</p>
        //</>                    <hr />
        //</>                </li>
        //</>            ))}
        //</>        </ul>
        //</>    )}
        //</></div>
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px] text-center font-bold">Name</TableHead>
            <TableHead className="text-center font-bold">Path</TableHead>
            <TableHead className="text-center font-bold">Time Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audioData.map((audio) => (
            <TableRow key={audio.track_id}>
              <TableCell className="font-medium text-center">{audio.audio_name}</TableCell>
              <TableCell className="text-center">{audio.file_path}</TableCell>
              <TableCell className="text-center">{audio.created_at}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} className="w-[150px] text-center"></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      //</>
    );
}
