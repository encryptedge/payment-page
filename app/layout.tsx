import { Inter } from 'next/font/google'

import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'RCS CTF Payment Portal',
    description: 'RCS CTF Payment Portal',
}

interface RootLayoutProps {
    children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en">
            <body className={`${inter.className} text-text`}>
                {children}
                <Toaster />
            </body>
        </html>
    )
}
