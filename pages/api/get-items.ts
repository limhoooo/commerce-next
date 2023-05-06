// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Client } from '@notionhq/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const notion = new Client({
  auth: 'secret_124V28FISLuJqvpnsrieGWNZ2UTGkDZN5fFjgid0K8M',
})
const dataBaseId = '21c787cf9b444b26a54260c5903da929'

async function getItems() {
  try {
    const response = await notion.databases.query({
      database_id: dataBaseId,
      sorts: [
        {
          property: 'price',
          direction: 'ascending',
        },
      ],
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
    const response = await getItems()
    res.status(200).json({ items: response?.results, message: `성공` })
  } catch (error) {
    res.status(400).json({ message: `실패 ` })
  }
}
