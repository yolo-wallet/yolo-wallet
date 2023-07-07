import api from '@/clientAPI'
import { UserInfoResponse } from '@/transections/getUserInfo'
import { useSession } from 'next-auth/react'
import { useState, useEffect, useCallback } from 'react'

type UserInfoHooks = [UserInfo: UserInfoResponse, isLoading: boolean]

// * 유저 정보를 관리하는 hooks입니다.
const useUserInfo = () => {
  const [isloading, setIsLoading] = useState(true)
  const [userInfo, setUserInfo] = useState({} as UserInfoResponse)
  const [email, setEmail] = useState('')
  const session = useSession()

  const fetchUserInfo = useCallback(() => {
    if (!email) return
    if (process.env.NODE_ENV === 'development') console.log('유저 정보를 가져옵니다....')
    api(`/api/user?email=${email}`).then((res) => {
      setUserInfo(res.data)
    })
  }, [email])

  useEffect(() => {
    if (session?.data) setEmail(session.data.user.email ? session.data.user.email : '')
    if (session.status === 'authenticated') setIsLoading(false)
    if (session.status === 'loading') setIsLoading(true)
  }, [session, session.status, session?.data?.user.email])

  useEffect(() => {
    fetchUserInfo()
  }, [email, fetchUserInfo])

  const userInfoHooks: UserInfoHooks = [userInfo, isloading]
  return userInfoHooks
}

export default useUserInfo
