// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, Cart } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { authOption } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function updateCart(item: Cart) {
  try {
    const response = await prisma.cart.update({
      where: {
        id: item.id,
      },
      data: {
        quantity: item.quantity,
        amount: item.amount,
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
  const { item } = JSON.parse(req.body)

  try {
    if (session == null) {
      res.status(200).json({ items: [], message: `no session` })
      return
    }
    const wishlist = await updateCart(item)
    console.log(wishlist)

    res.status(200).json({ items: wishlist, message: `성공` })
  } catch (error) {
    res.status(400).json({ message: `실패 ` })
  }
}
