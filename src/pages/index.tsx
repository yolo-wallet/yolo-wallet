import { Inter } from 'next/font/google'
import LoginBtn from '@/components/sample/LoginBtn'
import RootLayout from '@/components/Layout'
import LandingPage from './landingPage'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <RootLayout>
        <LandingPage />
      </RootLayout>
      <LoginBtn />
    </>
  )
}
