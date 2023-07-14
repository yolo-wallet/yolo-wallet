import { Inter } from 'next/font/google'
import LoginBtn from '@/components/sample/LoginBtn'
import RootLayout from '@/components/Layout'
// import Test from './sanity-sample'
import LandingPage from '../components/landingPage'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <RootLayout>
        {/* <Test/> */}
        <LandingPage />
      </RootLayout>
      <LoginBtn />
    </>
  )
}
