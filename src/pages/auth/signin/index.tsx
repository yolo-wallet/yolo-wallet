import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import {
  ClientSafeProvider,
  LiteralUnion,
  getProviders,
  signIn,
} from 'next-auth/react'
import { BuiltInProviderType } from 'next-auth/providers'
import { useRouter } from 'next/router'

type Props = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >
}

export default function SignPage({ providers }: Props) {
  // const router = useRouter()
  // const callbackUrl = (router.query.callbackUrl as string) || '/'
  return (
    <div>
      {Object.values(providers).map((provider) => {
        return (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id, { callbackUrl: '/' })}>
              Sign in with {provider.name}
            </button>
          </div>
        )
      })}
    </div>
  )
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)
  if (session) {
    return { redirect: { destination: '/' } }
  }
  const providers = await getProviders()
  return {
    props: { providers: providers ?? [] },
  }
}

// reference
// https://next-auth.js.org/configuration/pages
