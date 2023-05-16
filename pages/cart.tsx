import { CountControl } from '@/components/CountControl'
import styled from '@emotion/styled'
import { IconX } from '@tabler/icons-react'
import { IconRefresh } from '@tabler/icons-react'
import Image from 'next/image'
import React, { useEffect, useState, useMemo } from 'react'

interface CartItem {
  name: string
  productId: number
  price: number
  quantity: number
  amount: number
  image_url: string
}
export default function Cart() {
  const [data, setData] = useState<CartItem[]>([])

  const dilveryAmount = 5000
  const discountAmount = 0

  const amount = useMemo(() => {
    return data
      .map((item) => item.amount)
      .reduce((prev, curr) => prev + curr, 0)
  }, [])
  useEffect(() => {
    const mockData: CartItem[] = [
      {
        name: '신발1',
        productId: 100,
        price: 20000,
        quantity: 2,
        amount: 40000,
        image_url: 'https://picsum.photos/id/50/1000/600/',
      },
      {
        name: '신발2',
        productId: 100,
        price: 102220,
        quantity: 1,
        amount: 102220,
        image_url: 'https://picsum.photos/id/48/1000/600/',
      },
    ]
    setData(mockData)
  }, [])
  return (
    <div>
      <span className="text-2xl mb-3">Cart ({data.length})</span>
      <div className="flex">
        <div className="flex flex-col p-4 space-y-4 flex-1">
          {data.map((item, idx) => (
            <Item key={idx} {...item} />
          ))}
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
          </div>
        </div>
      </div>
    </div>
  )
}

const Item = (props: CartItem) => {
  const [quantity, setQuantity] = useState<number | ''>(props.quantity)
  const [amount, setAmount] = useState<number>(props.quantity)
  useEffect(() => {
    if (quantity) {
      setAmount(quantity * props.price)
    }
  }, [quantity, props.price])
  return (
    <div className="w-full flex p-4" style={{ borderBottom: '1px solid grey' }}>
      <Image src={props.image_url} width={155} height={155} alt={props.name} />
      <div className="flex flex-col ml-4">
        <span className="font-semibold mb-2">{props.name}</span>
        <span className="font-semibold mb-2">
          가격 : {props.price.toLocaleString('ko-kr')} 원
        </span>
        <div className="flex items-center space-x-4">
          <CountControl value={quantity} setValue={setQuantity} />
          <IconRefresh />
        </div>
      </div>
      <div className="flex ml-auto space-x-4">
        <span>{amount.toLocaleString('ko-kr')} 원</span>
        <IconX />
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
