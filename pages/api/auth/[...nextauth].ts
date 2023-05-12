import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: String(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.NEXT_PUBLIC_GOOGLE_SECRET_KEY),
    }),
  ],
  session: {
    strategy: 'database',
    // 24시간
    maxAge: 1 * 24 * 60 * 60,
  },
})
