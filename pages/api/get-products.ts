// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getOrderBy } from '../../constants/products'

const prisma = new PrismaClient()

async function getProducts(
  skip: number,
  take: number,
  category: number,
  orderBy: string,
  contains: string
) {
  const containsCondition =
    contains && contains !== ''
      ? {
          name: { contains },
        }
      : undefined
  const where =
    category && category !== -1
      ? {
          category_id: category,
          ...containsCondition,
        }
      : containsCondition
      ? containsCondition
      : undefined
  try {
    const response = await prisma.products.findMany({
      skip,
      take,
      ...getOrderBy(orderBy),
      where,
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
    const { skip, take, category, orderBy, contains } = req.query
    if (!skip || !take) {
      res.status(400).json({ message: `skip or take 가 없습니다 ` })
      return
    }
    const products = await getProducts(
      Number(skip),
      Number(take),
      Number(category),
      String(orderBy),
      String(contains)
    )
    res.status(200).json({ items: products, message: `성공` })
  } catch (error) {
    res.status(400).json({ message: `실패 ` })
  }
}
