import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useRef, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

// secret_hCA1p3xaQpc7T4NaDQ0cHClYcak40lWebSDNXfgF0Ou
export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null)

  // const [products, setProducts] = useState<
  //   {
  //     id: string
  //     properties: { id: string }[]
  //   }[]
  // >([])
  const [products, setProducts] = useState<
    {
      id: string
      name: string
      createdAt: string
    }[]
  >([])
  // useEffect(() => {
  //   fetch(`/api/get-items`)
  //     .then((res) => res.json())
  //     .then((data) => setProducts(data.items))
  // }, [])
  useEffect(() => {
    fetch(`/api/get-products`)
      .then((res) => res.json())
      .then((data) => setProducts(data.items))
  }, [])
  const handleClick = () => {
    if (!inputRef.current || !inputRef.current.value) {
      alert('name을 넣어주세요')
      return
    }
    fetch(`/api/add-item?name=${inputRef.current.value}`)
      .then((res) => res.json())
      .then((data) => console.log(data))
  }
  const getDetailHandle = (pageId: string, propertyId: string) => {
    fetch(`/api/get-detail?pageId=${pageId}&propertyId=${propertyId}`)
      .then((res) => res.json())
      // .then((data) => alert(JSON.stringify(data)))
      .then((data) => console.log(data.detail))
  }
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div>
        <input
          ref={inputRef}
          className="placeholder:italic placeholder:text-slate-400 block bg-white w-95 border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
          placeholder="Search for anything..."
          type="text"
          name="search"
        />
        <button onClick={handleClick}>click</button>
      </div>
      <div>
        <p>Product List</p>
        {/* {products &&
          products.map((item) => (
            <div key={item.id}>
              {JSON.stringify(item)}{' '}
              {item.properties &&
                Object.entries(item.properties).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => getDetailHandle(item.id, value.id)}
                  >
                    {key}
                  </button>
                ))}
            </div>
          ))} */}
        {products &&
          products.map((item) => (
            <div key={item.id}>
              {item.name}
              <span>{item.createdAt}</span>
            </div>
          ))}
      </div>
    </main>
  )
}
