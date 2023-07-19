import { useState, useEffect, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'

import api from '@/clientAPI'
import { User } from '@/types/api'

type UserInfoHooks = [UserInfo: User, isLoading: boolean, isLoggedIn: boolean]

// * 유저 정보를 관리하는 hooks입니다.
const useUserInfo = () => {
  const [isloading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState({} as User)
  const [email, setEmail] = useState('')
  const session = useSession()

  const fetchUserInfo = useCallback(() => {
    if (!email) return
    setIsLoading(true)
    api(`/api/user?email=${email}`)
      .then((res) => {
        setUserInfo(res.data)
        if (session.status === 'authenticated') setIsLoggedIn(true)
        else setIsLoggedIn(false)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [email, session.status])

  useEffect(() => {
    if (session.data?.user?.email) {
      setEmail(session.data?.user?.email)
    }
  }, [session])

  useEffect(() => {
    fetchUserInfo()
  }, [email, fetchUserInfo])

  const userInfoHooks: UserInfoHooks = [userInfo, isloading, isLoggedIn]
  return userInfoHooks
}

export default useUserInfo
