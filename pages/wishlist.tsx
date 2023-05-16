import { CATEGORY_MAP } from '@/constants/products'
import { products } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function Wishlist() {
  const router = useRouter()
  const getProductsFetch = async () => {
    const res = await fetch(`/api/get-wishlists`)
    const data = await res.json()
    return data.items
  }
  const { data: products } = useQuery<products[]>([`getProducts`], () =>
    getProductsFetch()
  )
  return (
    <div>
      <p className="text-2xl">내가 찜한 상품</p>
      {products && (
        <div className="grid grid-cols-3 gap-16">
          {products.map((item) => (
            <div
              key={item.id}
              style={{ maxWidth: '500px', cursor: 'pointer' }}
              onClick={() => router.push(`/products/${item.id}`)}
            >
              <Image
                className="rounded"
                alt={item.name}
                src={item.image_url ?? ''}
                width={500}
                height={300}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNcvmBZPQAGUQJu8FicRAAAAABJRU5ErkJggg=="
              />
              <div className="flex">
                <span>{item.name}</span>
                <span className="ml-auto">
                  {item.price.toLocaleString('ko-KR')}원
                </span>
              </div>
              <span className="text-zinc-400">
                {CATEGORY_MAP[Number(item.category_id - 1)]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
