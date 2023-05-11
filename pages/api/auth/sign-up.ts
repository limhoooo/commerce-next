// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import jwtDecode from 'jwt-decode'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

async function SignUp(credential: string) {
  const decoded: { name: string; email: string; picture: string } =
    jwtDecode(credential)
  try {
    const response = await prisma.user.upsert({
      where: {
        email: decoded.email,
      },
      update: {
        name: decoded.name,
        image: decoded.picture,
      },
      create: {
        email: decoded.email,
        name: decoded.name,
        image: decoded.picture,
      },
    })
    console.log(response)
    return response
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  items?: any
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { credential } = req.query
    console.log(credential)

    const products = await SignUp(String(credential))
    res.status(200).json({ items: products, message: `성공` })
  } catch (error) {
    res.status(400).json({ message: `실패 ` })
  }
}
