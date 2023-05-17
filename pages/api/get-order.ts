// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OrderItem, PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { authOption } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function getOrder(userId: string) {
  try {
    // orders 테이블에서 나의 주문들을 조회한다.
    const orders = await prisma.orders.findMany({
      where: {
        userId,
      },
    })

    let response = []
    // orders 안에 있는 orderItemIds 로 orderItem을 꺼내고 products 테이블에서 이미지 등 정보를 조회한다.

    for (const order of orders) {
      let orderItems: OrderItem[] = []
      for (const id of order.orderItemIds
        .split(',')
        .map((item) => Number(item))) {
        const res: OrderItem[] = await prisma.$queryRaw`
        SELECT i.id,quantity,amount, i.price, name, image_url,productId 
        FROM OrderItem as i
        JOIN products as p 
        ON i.productId = p.id
        WHERE i.id = ${id}
        `
        orderItems.push.apply(orderItems, res)
      }
      response.push({ ...order, orderItems })
    }

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
    const wishlist = await getOrder(String(session.id))

    res.status(200).json({ items: wishlist, message: `성공` })
  } catch (error) {
    res.status(400).json({ message: `실패 ` })
  }
}
