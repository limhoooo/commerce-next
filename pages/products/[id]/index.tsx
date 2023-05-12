import CustomEditor from '@/components/Editor'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Carousel from 'nuka-carousel'

import React, { useEffect, useState } from 'react'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { GetServerSidePropsContext } from 'next'
import { products } from '@prisma/client'
import { format } from 'date-fns'
import { CATEGORY_MAP } from '@/constants/products'

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
  const router = useRouter()
  const { id: productId } = router.query
  const [editorState] = useState<EditorState | undefined>(
    props.product.contents
      ? EditorState.createWithContent(
          convertFromRaw(JSON.parse(props.product.contents))
        )
      : EditorState.createEmpty()
  )
  const product = props.product

  // useEffect(() => {
  //   productId &&
  //     fetch(`/api/get-product?id=${productId}`)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log(data)
  //         if (data.items.contents) {
  //           setEditorState(
  //             EditorState.createWithContent(
  //               convertFromRaw(JSON.parse(data.items.contents))
  //             )
  //           )
  //         } else {
  //           setEditorState(EditorState.createEmpty())
  //         }
  //       })
  // }, [productId])
  return (
    <>
      {product && productId ? (
        <div className="p-24 flex flex-row">
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
