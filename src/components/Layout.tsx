import Navbar from './Navbar'
import Footer from './Footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="sticky top-0 bg-white z-10 border-b">
        <Navbar />
      </header>
      <main className="w-full flex justify-center bg-neutral-50 min-h-full">{children}</main>
      <Footer />
    </div>
  )
}