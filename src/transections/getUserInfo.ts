import { YOLO_USER_DOC_TYPE } from './../constants/constants'
import client from '@/service/sanity'

type UserInfo = {
  _rev: string
  _type: string
  name: string
  _id: string
  _updatedAt: string
  email: string
  image: string
  _createdAt: string
}

export type UserInfoResponse = {
  userId: string
  name: string
  email: string
  image: string
}

export async function getUserByEamilTransaction(email: string) {
  try {
    const userInfo: UserInfo[] = await client.fetch(`*[_type == "${YOLO_USER_DOC_TYPE}" && email == "${email}"]`)
    if (userInfo.length !== 1) throw new Error('증복 가입된 이메일 입니다. 관리자에게 문의해주세요.')
    const userInfoResponse: UserInfoResponse = {
      userId: userInfo[0]._id,
      name: userInfo[0].name,
      email: userInfo[0].email,
      image: userInfo[0].image
    }
    return userInfoResponse
  } catch (error) {
    console.error(error)
    return []
  }
}
