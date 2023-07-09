import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import api from '@/clientAPI'
import { User } from '@/types/api'

type UserInfoHooks = [UserInfo: User, isLoading: boolean]

// * 유저 정보를 관리하는 hooks입니다.
const useUserInfo = () => {
  const [isloading, setIsLoading] = useState(true)
  const [userInfo, setUserInfo] = useState({} as User)
  const [email, setEmail] = useState('')
  const session = useSession()

  const fetchUserInfo = useCallback(() => {
    if (!email) return
    if (process.env.NODE_ENV === 'development') console.log('유저 정보를 가져옵니다....')
    api(`/api/user?email=${email}`).then((res) => {
      setUserInfo(res.data)
      setIsLoading(false)
    })
  }, [email])

  useEffect(() => {
    if (session?.data) setEmail(session.data.user.email ? session.data.user.email : '')
    if (session.status !== 'authenticated') setIsLoading(true)
  }, [session, session.status, session?.data?.user.email])

  useEffect(() => {
    fetchUserInfo()
  }, [email, fetchUserInfo])

  const userInfoHooks: UserInfoHooks = [userInfo, isloading]
  return userInfoHooks
}

export default useUserInfo
