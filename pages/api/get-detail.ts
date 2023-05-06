// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Client } from '@notionhq/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const notion = new Client({
  auth: 'secret_124V28FISLuJqvpnsrieGWNZ2UTGkDZN5fFjgid0K8M',
})
const dataBaseId = '21c787cf9b444b26a54260c5903da929'

async function getDetail(pageId: string, propertyId: string) {
  try {
    const response = await notion.pages.properties.retrieve({
      page_id: pageId,
      property_id: propertyId,
    })
    console.log(response)
    return response
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  detail?: any
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { pageId, propertyId } = req.query
    const response: any = await getDetail(String(pageId), String(propertyId))
    res.status(200).json({ detail: response.results, message: `성공` })
  } catch (error) {
    res.status(400).json({ message: `실패 ` })
  }
}
