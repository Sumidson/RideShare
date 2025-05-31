// app/layout.tsx
import './globals.css';
import Navbar from '../components/Navbar'; // <-- import Navbar

export const metadata = {
  title: 'Carpooling App',
  description: 'Next.js carpooling app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar /> {/* Render Navbar here */}
        <main>{children}</main>
      </body>
    </html>
  );
}
