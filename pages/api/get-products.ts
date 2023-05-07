// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Client } from '@notionhq/client'
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

async function getProducts() {
  try {
    // const response = await prisma.products.findMany()
    const response = await prisma.products.findMany()
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
    const products = await getProducts()
    res.status(200).json({ items: products, message: `성공` })
  } catch (error) {
    res.status(400).json({ message: `실패 ` })
  }
}
