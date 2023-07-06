import addUser from '@/transections/addUser'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_ID || '',
      clientSecret: process.env.GOOGLE_OAUTH_SECRET || ''
    })
  ],
  callbacks: {
    async session({ session }) {
      return session
    },
    async signIn({ user: { id, name, email, image } }) {
      // * 로그인에 성공했으나 유저 정보가 없다면 반드시 false를 리턴해야 합니다.
      if (!id || !name || !email || !image) return false

      const isSuccess = await addUser({ id, name, email, image })
      return isSuccess
    }
  },
  pages: {
    signIn: '/auth/signin'
  }
}
export default NextAuth(authOptions)
