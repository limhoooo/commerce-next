import { CountControl } from '@/components/CountControl'
import { CATEGORY_MAP } from '@/constants/products'
import styled from '@emotion/styled'
import { Button } from '@mantine/core'
import { products, Cart } from '@prisma/client'
import { IconX } from '@tabler/icons-react'
import { IconRefresh } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState, useMemo } from 'react'

interface CartItem extends Cart {
  name: string
  price: number
  image_url: string
}
export default function CartPage() {
  const router = useRouter()

  const dilveryAmount = 5000
  const discountAmount = 0
  const getCart = async () => {
    const res = await fetch(`/api/get-cart`)
    const data = await res.json()
    return data.items
  }
  const { data: cart } = useQuery<Cart[]>([`getCart`], () => getCart())
  console.log(cart)

  const amount = useMemo(() => {
    if (cart == null) {
      return 0
    }
    return cart
      .map((item) => item.amount)
      .reduce((prev, curr) => prev + curr, 0)
  }, [cart])

  const getProductsFetch = async () => {
    const res = await fetch(`/api/get-products?skip=0&take=3`)
    const data = await res.json()
    return data.items
  }
  const { data: products } = useQuery<products[]>([`getProducts`], () =>
    getProductsFetch()
  )

  const handleOrder = () => {}
  return (
    <div>
      <span className="text-2xl mb-3">Cart ({cart ? cart.length : 0})</span>
      <div className="flex">
        <div className="flex flex-col p-4 space-y-4 flex-1">
          {cart && cart.length > 0 ? (
            cart.map((item, idx) => <Item key={idx} {...item} />)
          ) : (
            <div>장바구니가 비었습니다.</div>
          )}
        </div>
        <div className="px-4">
          <div
            className="flex flex-col p-4 space-y-4"
            style={{ minWidth: 300, border: '1px solid grey' }}
          >
            <div>Info</div>
            <Row>
              <span>금액</span>
              <span>{amount.toLocaleString('ko-kr')} 원</span>
            </Row>
            <Row>
              <span>배송비</span>
              <span>{dilveryAmount.toLocaleString('ko-kr')} 원</span>
            </Row>
            <Row>
              <span>할인 금액</span>
              <span>{discountAmount.toLocaleString('ko-kr')} 원</span>
            </Row>
            <Row>
              <span className="font-semibold">결제 금액</span>
              <span className="font-semibold text-red-500">
                {(amount + dilveryAmount - discountAmount).toLocaleString(
                  'ko-kr'
                )}{' '}
                원
              </span>
            </Row>

            <Button
              style={{ backgroundColor: 'black' }}
              radius="xl"
              size="md"
              styles={{
                root: { height: 48 },
              }}
              onClick={() => handleOrder}
            >
              구매하기
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-32">
        <p>추천상품</p>
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
    </div>
  )
}

const Item = (props: CartItem) => {
  const [quantity, setQuantity] = useState<number | ''>(props.quantity)
  const [amount, setAmount] = useState<number>(props.quantity)
  const router = useRouter()

  useEffect(() => {
    if (quantity) {
      setAmount(quantity * props.price)
    }
  }, [quantity, props.price])

  const handleUpdate = () => {}
  const handleDelete = () => {}

  return (
    <div className="w-full flex p-4" style={{ borderBottom: '1px solid grey' }}>
      <Image
        src={props.image_url}
        width={155}
        height={155}
        alt={props.name}
        onClick={() => router.push(`/products/${props.productId}`)}
      />
      <div className="flex flex-col ml-4">
        <span className="font-semibold mb-2">{props.name}</span>
        <span className="font-semibold mb-2">
          가격 : {props.price.toLocaleString('ko-kr')} 원
        </span>
        <div className="flex items-center space-x-4">
          <CountControl value={quantity} setValue={setQuantity} />
          <IconRefresh onClick={handleUpdate} />
        </div>
      </div>
      <div className="flex ml-auto space-x-4">
        <span>{amount.toLocaleString('ko-kr')} 원</span>
        <IconX onClick={handleDelete} />
      </div>
    </div>
  )
}

const Row = styled.div`
  display: flex;
  * ~ * {
    margin-left: auto;
  }
`
