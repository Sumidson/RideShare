import { AuthProvider } from '../app/providers/AuthProvider'
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
        <AuthProvider>
          <LoadingProvider>
            <Navbar />
            {children}
          </LoadingProvider>
        </AuthProvider>
      </body>
    </html>
  )
}