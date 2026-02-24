import { SupabaseAuthProvider } from '../app/providers/SupabaseAuthProvider'
import { LoadingProvider } from '../app/providers/LoadingProvider'
import './globals.css'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
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
            <div className="min-h-screen flex">
              <Sidebar />
              <main className="min-h-screen flex-1 min-w-0">
                {children}
              </main>
            </div>
            <ContactUsModal />
          </LoadingProvider>
        </SupabaseAuthProvider>
      </body>
    </html>
  )
}