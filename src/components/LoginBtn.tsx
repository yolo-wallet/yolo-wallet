import { useSession, signIn, signOut } from 'next-auth/react'
export default function LoginBtn() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button
          onClick={(e) => {
            // https://stackoverflow.com/questions/74180557/next-auth-next-autherrorclient-fetch-error-networkerror-when-attempting-to
            e.preventDefault()
            signOut()
          }}
        >
          Sign out
        </button>
      </>
    )
  }

  return (
    <>
      Not signed in <br />
      <button
        onClick={(e) => {
          // https://stackoverflow.com/questions/74180557/next-auth-next-autherrorclient-fetch-error-networkerror-when-attempting-to
          e.preventDefault()
          signIn()
        }}
      >
        Sign in
      </button>
    </>
  )
}
