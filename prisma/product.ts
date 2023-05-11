import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// category에 맞게 랜덤 생성
const rendomCategory = () => {
  const number = Math.floor(Math.random() * 5)
  const category = ['SNEAKERS', 'T-SHIRT', 'PANTS', 'CAP', 'HOODIE']
  const categoryName = category[number]
  return {
    number,
    categoryName,
  }
}

/**
 *  임의 data 100개 만들기
 *  > yarn ts-node prisma/product.ts
 *
 */
//picsum.photos/id/1019/1000/600/
https: const productData: Prisma.productsCreateInput[] = Array.apply(
  null,
  Array(100)
).map((_, index) => {
  const { number, categoryName } = rendomCategory()
  return {
    name: `Dark Jean (${categoryName} - ${index})`,
    category_id: Number(number) + 1,
    contents: `{"blocks":[{"key":"br96i","text":"Dark Jean ${
      index + 1
    }","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`,
    // image_url: `https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/${
    //   index + (1 % 10) === 0 ? 10 : (index + 1) % 10
    // } .jpg`,
    image_url: `https://picsum.photos/id/${index}/1000/600/`,
    price: Math.floor(Math.random() * (100000 - 20000) + 20000),
  }
})

async function main() {
  // await prisma.products.deleteMany({})
  const CATEGORY_MAP = ['SNEAKERS', 'T-SHIRT', 'PANTS', 'CAP', 'HOODIE']
  CATEGORY_MAP.forEach(async (c, i) => {
    const product = await prisma.categories.upsert({
      where: {
        id: i + 1,
      },
      update: {
        name: c,
      },
      create: {
        name: c,
      },
    })
    console.log(product.id)
  })

  for (const p of productData) {
    const product = await prisma.products.create({
      data: p,
    })
    console.log(product.id)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
