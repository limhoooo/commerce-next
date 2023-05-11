import React from 'react'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'

export default function Google() {
  const signInHandler = (credentialResponse: CredentialResponse) => {
    fetch(`/api/auth/sign-up?credential=${credentialResponse.credential}`)
      .then((res) => res.json())
      .then((data) => console.log(data))
  }
  return (
    <div className="flex">
      <GoogleLogin
        onSuccess={(credentialResponse) => () =>
          signInHandler(credentialResponse)}
        onError={() => {
          console.log('Login Failed')
        }}
      />
    </div>
  )
}
