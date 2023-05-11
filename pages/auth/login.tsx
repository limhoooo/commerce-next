import styled from '@emotion/styled'
import GoogleLogin from '../../components/GoogleLogin'
import React from 'react'
const LoginBox = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
`
export default function Login() {
  return (
    <LoginBox>
      <GoogleLogin />
    </LoginBox>
  )
}
