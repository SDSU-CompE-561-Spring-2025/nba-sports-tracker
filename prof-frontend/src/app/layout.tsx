import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';
import { RootProviders } from '@/providers/RootProviders';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Budget Buddy',
	description: 'A budgeting app to help you manage your finances',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
		>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased text-center text-5xl p-5`}
			>
				<Toaster />

				<RootProviders>
					<Navbar />
					<div className={'relative flex h-screen w-full flex-col'}>
						<div className={'w-full'}>{children}</div>
					</div>
					<Footer />
				</RootProviders>
			</body>
		</html>
	);
}
