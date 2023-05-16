import CustomEditor from '@/components/Editor'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Carousel from 'nuka-carousel'

import React, { useEffect, useState } from 'react'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { GetServerSidePropsContext } from 'next'
import { products, Cart } from '@prisma/client'
import { format } from 'date-fns'
import { CATEGORY_MAP } from '@/constants/products'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@mantine/core'
import { IconHeart, IconHeartbeat, IconShoppingCart } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import { CountControl } from '@/components/CountControl'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const product = await fetch(
    `http://localhost:3000/api/get-product?id=${context.params?.id}`
  )
    .then((res) => res.json())
    .then((data) => data.items)

  return {
    props: {
      product: { ...product, images: [product.image_url, product.image_url] },
    },
  }
}

export default function Products(props: {
  product: products & { images: string[] }
}) {
  const [index, setIndex] = useState(0)
  const { data: session } = useSession()
  const [quantity, setQuantity] = useState<number | ''>(1)
  const router = useRouter()
  const { id: productId } = router.query
  const queryClient = useQueryClient()
  const [editorState] = useState<EditorState | undefined>(
    props.product.contents
      ? EditorState.createWithContent(
          convertFromRaw(JSON.parse(props.product.contents))
        )
      : EditorState.createEmpty()
  )
  const product = props.product

  const fetchWishList = async () => {
    const response = await fetch(`/api/get-wishlist`)
    const data = await response.json()
    return data.items
  }
  const { data: wishlist } = useQuery(['getWishlist'], () => fetchWishList())

  const validate = (type: 'cart' | 'order') => {
    if (!quantity) return alert('최소수량을 입력해주세요')
    addCart({
      productId: product.id,
      quantity,
      amount: product.price * quantity,
    })
  }
  const postWishlist = async (productId: string) => {
    const response = await fetch('/api/update-wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    })
    const data = await response.json()
    return data.items
  }
  const { mutate, isLoading } = useMutation<unknown, unknown, string, any>(
    (productId: string) => postWishlist(productId),
    {
      // Optimistic updates
      onMutate: async (productId) => {
        await queryClient.cancelQueries(['getWishlist'])
        const previous = queryClient.getQueryData(['getWishlist'])
        console.log(previous)
        queryClient.setQueryData<string[]>(['getWishlist'], (old) =>
          old
            ? old.includes(String(productId))
              ? old.filter((id) => id !== String(productId))
              : old.concat(String(productId))
            : []
        )
        return { previous }
      },
      onError: (error, _, context) => {
        queryClient.setQueryData(['getWishlist'], context.previous)
      },
      onSuccess(data, variables, context) {
        console.log('onSuccess')
        queryClient.invalidateQueries(['getWishlist'])
      },
    }
  )

  const createCart = async (item: Omit<Cart, 'id' | 'userId'>) => {
    const response = await fetch('/api/add-cart', {
      method: 'POST',
      body: JSON.stringify({ item }),
    })
    const data = await response.json()
    return data.items
  }
  const { mutate: addCart } = useMutation<
    unknown,
    unknown,
    Omit<Cart, 'id' | 'userId'>,
    any
  >((item) => createCart(item), {
    onSuccess() {
      router.push('/cart')
    },
  })

  const isWished = wishlist ? wishlist.includes(productId) : false
  return (
    <>
      {product && productId ? (
        <div className="flex flex-row">
          <div style={{ maxWidth: 600, marginRight: 52 }}>
            <Carousel
              animation="fade"
              slideIndex={index}
              // autoplay
              withoutControls
              wrapAround
            >
              {product.images.map((item) => (
                <Image
                  key={`url-${item}`}
                  src={item}
                  alt="image"
                  width={600}
                  height={600}
                  layout="responsive"
                />
              ))}
            </Carousel>
            <div className="flex space-x-4 mt-2">
              {product.images.map((item, idx) => (
                <div key={`thumb-${idx}-url`} onClick={() => setIndex(idx)}>
                  <Image src={item} alt="image" width={100} height={100} />
                </div>
              ))}
            </div>
            {editorState && <CustomEditor editorState={editorState} readOnly />}
          </div>
          <div style={{ maxWidth: 600 }} className="flex flex-col space-y-6">
            <div className="text-lg text-zinc-400">
              {CATEGORY_MAP[product.category_id - 1]}
            </div>
            <div className="text-4xl font-semibold">{product.name}</div>
            <div className="text-lg">
              {product.price.toLocaleString('ko-kr')}원
            </div>
            <div>
              <span className="text-lg">수량</span>
              <CountControl value={quantity} setValue={setQuantity} />
            </div>
            <div className="flex space-x-3">
              <Button
                leftIcon={<IconShoppingCart size={20} stroke={1.5} />}
                style={{ backgroundColor: 'black' }}
                radius="xl"
                size="md"
                styles={{
                  root: { paddingRight: 14, height: 48 },
                }}
                onClick={() => {
                  if (session == null) {
                    alert('로그인이 필요한 기능입니다.')
                    router.push('/auth/login')
                    return
                  }
                  validate('cart')
                }}
              >
                장바구니
              </Button>
              <Button
                // loading={isLoading}
                disabled={wishlist == null}
                leftIcon={
                  isWished ? (
                    <IconHeart size={20} stroke={1.5} />
                  ) : (
                    <IconHeartbeat size={20} stroke={1.5} />
                  )
                }
                style={{ backgroundColor: isWished ? 'red' : 'grey' }}
                radius="xl"
                size="md"
                styles={{
                  root: { paddingRight: 14, height: 48 },
                }}
                onClick={() => {
                  if (session == null) {
                    alert('로그인이 필요한 기능입니다.')
                    router.push('/auth/login')
                    return
                  }
                  mutate(String(productId))
                }}
              >
                찜하기
              </Button>
            </div>

            <div className="text-sm text-zinc-300">
              등록일자 : {format(new Date(product.createdAt), 'yyyy년 M월 d일')}
            </div>
          </div>
        </div>
      ) : (
        <div>로딩중</div>
      )}
    </>
  )
}
