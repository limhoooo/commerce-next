import { CountControl } from '@/components/CountControl'
import { CATEGORY_MAP, ORDER_STATUS_MAP } from '@/constants/products'
import styled from '@emotion/styled'
import { Badge, Button } from '@mantine/core'
import { products, Cart, Orders, OrderItem } from '@prisma/client'
import { IconX } from '@tabler/icons-react'
import { IconRefresh } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState, useMemo } from 'react'

interface OrderItemDetail extends OrderItem {
  name: string
  image_url: string
}
interface OrderDetail extends Orders {
  orderItems: OrderItemDetail[]
}

export default function MyPage() {
  const router = useRouter()

  const getOrder = async () => {
    const res = await fetch(`/api/get-order`)
    const data = await res.json()
    return data.items
  }
  const { data: order } = useQuery<
    { items: OrderDetail[] },
    unknown,
    OrderDetail[]
  >([`getOrder`], () => getOrder())
  return (
    <div>
      <span className="text-2xl mb-3">
        주문내역 ({order ? order.length : 0})
      </span>
      <div className="flex">
        <div className="flex flex-col p-4 space-y-4 flex-1">
          {order && order.length > 0 ? (
            order.map((item, idx) => <DetailItem key={idx} {...item} />)
          ) : (
            <div>주문내역이 비었습니다.</div>
          )}
        </div>
      </div>
    </div>
  )
}

const DetailItem = (props: OrderDetail) => {
  return (
    <div
      className="w-full flex p-4 rounded-md"
      style={{ border: '1px solid grey' }}
    >
      <div className="flex ml-4">
        <Badge color={props.status === 0 ? 'red' : ''} className="mb-2">
          {ORDER_STATUS_MAP[props.status + 1]}
        </Badge>
        {props.orderItems.map((item, idx) => (
          <Item key={idx} {...item} />
        ))}
      </div>
    </div>
  )
}
const Item = (props: OrderItemDetail) => {
  const [quantity, setQuantity] = useState<number | ''>(props.quantity)
  const [amount, setAmount] = useState<number>(props.quantity)
  const router = useRouter()
  useEffect(() => {
    if (quantity) {
      setAmount(quantity * props.price)
    }
  }, [quantity, props.price])

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
        </div>
      </div>
      <div className="flex ml-auto space-x-4">
        <span>{amount.toLocaleString('ko-kr')} 원</span>
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
