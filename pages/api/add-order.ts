// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, Cart, OrderItem } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { authOption } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function addOrder(
  userId: string,
  items: Omit<OrderItem, 'id'>[],
  orderInfo?: { receiver: string; address: string; phoneNumber: string }
) {
  try {
    // order item 들을 만든다.

    let orderItemIds = []
    for (const item of items) {
      const orderItem = await prisma.orderItem.create({
        data: {
          ...item,
        },
      })
      console.log(orderItem.id)
      orderItemIds.push(orderItem.id)
    }
    // 만들어진 orderItemIds 를 포함한 order를 만든다.
    console.log(JSON.stringify(orderItemIds))

    const response = await prisma.orders.create({
      data: {
        userId,
        orderItemIds: orderItemIds.join(','),
        ...orderInfo,
        status: 0,
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
  const { items, orderInfo } = JSON.parse(req.body)

  try {
    if (session == null) {
      res.status(200).json({ items: [], message: `no session` })
      return
    }
    const wishlist = await addOrder(String(session.id), items, orderInfo)
    console.log(wishlist)

    res.status(200).json({ items: wishlist, message: `성공` })
  } catch (error) {
    res.status(400).json({ message: `실패 ` })
  }
}
