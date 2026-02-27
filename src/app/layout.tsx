import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from '@/components/providers/ClientProviders';
import Navbar from '@/components/layout/Navbar';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'SyncSphere | Social Connectivity Reimagined',
  description: 'Connect, share, and discover creative content on SyncSphere.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background min-h-screen text-foreground selection:bg-primary/10 selection:text-primary">
        <FirebaseClientProvider>
          <ClientProviders>
            <div className="relative flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
            </div>
          </ClientProviders>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
