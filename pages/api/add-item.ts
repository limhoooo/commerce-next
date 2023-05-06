// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Client } from '@notionhq/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const notion = new Client({
  auth: 'secret_124V28FISLuJqvpnsrieGWNZ2UTGkDZN5fFjgid0K8M',
})
const dataBaseId = '21c787cf9b444b26a54260c5903da929'

async function addItem(name: string) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: dataBaseId },
      properties: {
        title: [{ text: { content: name } }],
      },
    })
    console.log(response)
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { name } = req.query

  if (!name) {
    return res.status(400).json({ message: 'no name' })
  }

  try {
    await addItem(String(name))
    res.status(200).json({ message: `성공 ${name}` })
  } catch (error) {
    res.status(400).json({ message: `실패 ` })
  }
}
