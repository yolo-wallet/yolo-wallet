import { YOLO_USER_DOC_TYPE } from './../constants/constants'
import client from '@/service/sanity'

type User = {
  id: string
  name: string
  email: string
  image: string
}

export default async function addUser({ id, name, email, image }: User) {
  try {
    await client.createIfNotExists({
      _id: id,
      _type: YOLO_USER_DOC_TYPE,
      name,
      email,
      image
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
