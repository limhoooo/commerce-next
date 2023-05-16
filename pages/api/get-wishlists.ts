// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { authOption } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function getWishlists(userId: string) {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId,
      },
    })
    const productId = wishlist?.productIds
      .split(',')
      .map((item) => Number(item))

    if (productId && productId.length <= 0) return []
    const response = await prisma.products.findMany({
      where: {
        id: {
          in: productId,
        },
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
  const session = await unstable_getServerSession(req, res, authOption)

  try {
    if (session == null) {
      res.status(200).json({ items: [], message: `no session` })
      return
    }
    const wishlist = await getWishlists(String(session.id))

    res.status(200).json({ items: wishlist, message: `성공` })
  } catch (error) {
    res.status(400).json({ message: `실패 ` })
  }
}
