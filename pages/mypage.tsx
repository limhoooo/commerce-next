import { CountControl } from '@/components/CountControl'
import { ORDER_STATUS_MAP } from '@/constants/products'
import styled from '@emotion/styled'
import { Badge, Button } from '@mantine/core'
import { Orders, OrderItem, Cart } from '@prisma/client'
import { IconX } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
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
  const queryClient = useQueryClient()

  const updateOrderFetch = async (status: number) => {
    console.log(props.id)

    const response = await fetch('/api/update-order', {
      method: 'POST',
      body: JSON.stringify({ id: props.id, status, userId: props.userId }),
    })
    const data = await response.json()
    return data.items
  }
  const { mutate: updateOrderStatus, isLoading } = useMutation<
    unknown,
    unknown,
    number,
    any
  >((status: number) => updateOrderFetch(status), {
    // Optimistic updates
    onMutate: async (status) => {
      await queryClient.cancelQueries(['getOrder'])
      const previous = queryClient.getQueryData(['getOrder'])
      console.log(previous)
      queryClient.setQueryData<Cart[]>(['getCart'], (old) =>
        old?.map((c) => {
          if (c.id === props.id) {
            return { ...c, status: status }
          }
          return c
        })
      )
      return { previous }
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(['getOrder'], context.previous)
    },
    onSuccess(data, variables, context) {
      console.log('onSuccess')
      queryClient.invalidateQueries(['getOrder'])
    },
  })

  const handlePayment = () => {
    // 주문상태 5로 변경
    updateOrderStatus(5)
  }
  const handleCancel = () => {
    // 주문상태 -1로 변경
    updateOrderStatus(-1)
  }
  return (
    <div
      className="w-full flex flex-col p-4 rounded-md"
      style={{ border: '1px solid grey' }}
    >
      <div className="flex ml-4">
        <Badge color={props.status < 1 ? 'red' : ''} className="mb-2">
          {ORDER_STATUS_MAP[props.status + 1]}
        </Badge>
        <IconX className="ml-auto" onClick={handleCancel} />
      </div>
      {props.orderItems.map((item, idx) => (
        <Item key={idx} {...item} />
      ))}
      <div className="flex mt-4">
        <div className="flex flex-col">
          <span className="mb-2">주문정보</span>
          <span>받는사람: {props.receiver ?? '입력필요'}</span>
          <span>주소: {props.address ?? '입력필요'}</span>
          <span>연락처: {props.phoneNumber ?? '입력필요'}</span>
        </div>
        <div className="flex flex-col ml-auto mr-4 text-right">
          <span className="font-semibold mb-2">
            합계 금액:{' '}
            <span className="text-red-500">
              {props.orderItems
                .map((item) => item.amount)
                .reduce((prev, curr) => prev + curr, 0)
                .toLocaleString('ko-kr')}
            </span>
          </span>
          <span className="text-zinc-400 mt-auto mb-auto">
            주문일자:{' '}
            {format(new Date(props.createdAt), 'yyyy년 M월 d일 HH:mm:ss')}
          </span>
          <Button
            style={{ backgroundColor: 'black', color: 'white' }}
            onClick={handlePayment}
          >
            결제처리
          </Button>
        </div>
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
