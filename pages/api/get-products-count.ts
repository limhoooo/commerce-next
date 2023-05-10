// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

async function getProductsCount(category: number) {
  const where =
    category && category !== -1
      ? {
          where: {
            category_id: category,
          },
        }
      : undefined
  try {
    const response = await prisma.products.count(where)
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
    const { category } = req.query
    const products = await getProductsCount(Number(category))
    res.status(200).json({ items: products, message: `성공` })
  } catch (error) {
    res.status(400).json({ message: `실패 ` })
  }
}
