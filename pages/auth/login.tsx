import styled from '@emotion/styled'
import GoogleLogin from '../../components/GoogleLogin'
import React from 'react'
const LoginBox = styled.div`
  display: flex;
  height: 70vh;
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
