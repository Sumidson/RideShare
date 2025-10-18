import { SupabaseAuthProvider } from '../app/providers/SupabaseAuthProvider'
import { LoadingProvider } from '../app/providers/LoadingProvider'
import './globals.css'
import Navbar from '../components/Navbar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SupabaseAuthProvider>
          <LoadingProvider>
            <Navbar />
            {children}
          </LoadingProvider>
        </SupabaseAuthProvider>
      </body>
    </html>
  )
}