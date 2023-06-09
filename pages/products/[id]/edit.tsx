import CustomEditor from '@/components/Editor'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Carousel from 'nuka-carousel'

const images = [
  {
    original: 'https://picsum.photos/id/1018/1000/600/',
    thumbnail: 'https://picsum.photos/id/1018/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1015/1000/600/',
    thumbnail: 'https://picsum.photos/id/1015/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/250/150/',
  },
  {
    original:
      'https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/4v.jpg',
    thumbnail:
      'https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/4v.jpg',
  },
]

import React, { useCallback, useEffect, useState } from 'react'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'

export default function Products() {
  const [index, setIndex] = useState(0)
  const router = useRouter()
  const { id: productId } = router.query
  const [editorState, setEditorState] = useState<EditorState | undefined>(
    undefined
  )
  const handleSave = async () => {
    if (!editorState) return
    const contentState = editorState.getCurrentContent()
    try {
      const res = await fetch(`/api/update-product`, {
        method: 'POST',
        body: JSON.stringify({
          id: productId,
          contents: JSON.stringify(convertToRaw(contentState)),
        }),
      })
      await res.json()
      alert('저장되었습니다.')
    } catch (error) {
      console.error(error)
    }
  }
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/get-product?id=${productId}`)
      const data = await res.json()
      if (data.items.contents) {
        const content = convertFromRaw(JSON.parse(data.items.contents))
        const newState = EditorState.createWithContent(content)
        setEditorState(newState)
      } else {
        const newState = EditorState.createEmpty()
        setEditorState(newState)
      }
    } catch (error) {
      console.error(error)
    }
  }, [productId])

  useEffect(() => {
    productId && fetchData()
  }, [productId, fetchData])
  return (
    <>
      <Carousel
        animation="fade"
        slideIndex={index}
        autoplay
        withoutControls
        wrapAround
      >
        {images.map((item) => (
          <Image
            key={item.original}
            src={item.original}
            alt="image"
            width={1000}
            height={600}
            layout="responsive"
          />
        ))}
      </Carousel>
      <div style={{ display: 'flex', cursor: 'pointer' }}>
        {images.map((item, idx) => (
          <div key={idx} onClick={() => setIndex(idx)}>
            <Image src={item.original} alt="image" width={100} height={60} />
          </div>
        ))}
      </div>
      {editorState && (
        <CustomEditor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          onSave={handleSave}
        />
      )}
    </>
  )
}
