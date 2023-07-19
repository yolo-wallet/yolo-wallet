import RootLayout from '@/components/Layout'
import LandingPage from '../components/landingPage'

export default function Home() {
  return (
    <div className="bg-slate-100">
      <RootLayout>
        <LandingPage />
      </RootLayout>
    </div>
  )
}
