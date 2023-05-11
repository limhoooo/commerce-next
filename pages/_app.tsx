import '@/styles/globals.css'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
// import { GoogleOAuthProvider } from '@react-oauth/google'
import { SessionProvider } from 'next-auth/react'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: Infinity },
    },
  })
  return (
    // <GoogleOAuthProvider
    //   clientId={String(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)}
    // >
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </SessionProvider>
    // </GoogleOAuthProvider>
  )
}
