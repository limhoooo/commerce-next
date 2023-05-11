import { useSession, signIn, signOut } from 'next-auth/react'
import Button from './Button'

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <br />
        <Button onClick={() => signOut()}>Sign out</Button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <br />
      <Button onClick={() => signIn()}>Sign in</Button>
    </>
  )
}
