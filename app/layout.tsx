import { SupabaseAuthProvider } from '../app/providers/SupabaseAuthProvider'
import { LoadingProvider } from '../app/providers/LoadingProvider'
import './globals.css'
import Navbar from '../components/Navbar'
import ContactUsModal from '../components/ContactUsModal'

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
            <div className="min-h-screen">
              {children}
            </div>
            <ContactUsModal />
          </LoadingProvider>
        </SupabaseAuthProvider>
      </body>
    </html>
  )
}