import React from 'react'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { GoogleOAuthProvider } from '@react-oauth/google'

export default function Google() {
  const signInHandler = (credentialResponse: CredentialResponse) => {
    fetch(`/api/auth/sign-up?credential=${credentialResponse.credential}`)
      .then((res) => res.json())
      .then((data) => console.log(data))
  }
  return (
    <GoogleOAuthProvider
      clientId={String(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)}
    >
      <div className="flex">
        <GoogleLogin
          onSuccess={(credentialResponse) => () =>
            signInHandler(credentialResponse)}
          onError={() => {
            console.log('Login Failed')
          }}
        />
      </div>
    </GoogleOAuthProvider>
  )
}
