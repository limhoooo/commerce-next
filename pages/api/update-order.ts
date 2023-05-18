// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, Cart } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { authOption } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function updateOrder(id: number, status: number) {
  try {
    const response = await prisma.orders.update({
      where: {
        id,
      },
      data: {
        status,
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
  const { id, status } = JSON.parse(req.body)

  try {
    if (session == null) {
      res.status(200).json({ items: [], message: `no session` })
      return
    }
    const wishlist = await updateOrder(id, status)
    console.log(wishlist)

    res.status(200).json({ items: wishlist, message: `성공` })
  } catch (error) {
    res.status(400).json({ message: `실패 ` })
  }
}
