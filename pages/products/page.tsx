import { categories, products } from '@prisma/client'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { Input, Pagination, SegmentedControl, Select } from '@mantine/core'
import { CATEGORY_MAP, FILTERS, TAKE } from '@/constants/products'
import { IconSearch } from '@tabler/icons-react'
import useDebounce from './../../hooks/useDebounce'
import { useQuery } from '@tanstack/react-query'

export default function Products() {
  const [activePage, setPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string>('-1')
  // const [total, setTotal] = useState(0)
  // const [categories, setCategories] = useState<categories[]>([])
  // const [products, setProducts] = useState<products[]>([])
  const [keyward, setKeyward] = useState<string>('')

  const [selectedFilter, setSelectedFilter] = useState<string | null>(
    FILTERS[0].value
  )

  // 디바운스 키워드
  const debouncedKeyword = useDebounce<string>(keyward)

  const categoryHandler = (data: string) => {
    setPage(1)
    setSelectedCategory(data)
  }
  // useEffect(() => {
  //   fetch(`/api/get-categories`)
  //     .then((res) => res.json())
  //     .then((data) => setCategories(data.items))
  // }, [])

  // useEffect(() => {
  //   fetch(
  //     `/api/get-products-count?category=${selectedCategory}&contains=${debouncedKeyword}`
  //   )
  //     .then((res) => res.json())
  //     .then((data) => setTotal(Math.ceil(data.items / TAKE)))
  // }, [selectedCategory, debouncedKeyword])

  // useEffect(() => {
  //   const skip = TAKE * (activePage - 1)
  //   fetch(
  //     `/api/get-products?skip=${skip}&take=${TAKE}&category=${selectedCategory}&orderBy=${selectedFilter}&contains=${debouncedKeyword}`
  //   )
  //     .then((res) => res.json())
  //     .then((data) => setProducts(data.items))
  // }, [activePage, selectedCategory, selectedFilter, debouncedKeyword])

  const getCategoriesFetch = async () => {
    const res = await fetch(`/api/get-categories`)
    const data = await res.json()
    return data.items
  }
  const getProductscountFetch = async () => {
    const res = await fetch(
      `/api/get-products-count?category=${selectedCategory}&contains=${debouncedKeyword}`
    )
    const data = await res.json()
    return Math.ceil(data.items / TAKE)
  }
  const getProductsFetch = async () => {
    const res = await fetch(
      `/api/get-products?skip=${
        TAKE * (activePage - 1)
      }&take=${TAKE}&category=${selectedCategory}&orderBy=${selectedFilter}&contains=${debouncedKeyword}`
    )
    const data = await res.json()
    return data.items
  }
  const { data: categories } = useQuery<categories[]>(['getCategories'], () =>
    getCategoriesFetch()
  )

  const { data: total } = useQuery<number>(
    ['getProductscount', selectedCategory, debouncedKeyword],
    () => getProductscountFetch()
  )

  const { data: products, isFetching } = useQuery<products[]>(
    [
      `getProducts`,
      TAKE,
      activePage,
      selectedCategory,
      selectedFilter,
      debouncedKeyword,
    ],
    () => getProductsFetch()
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyward(e.target.value)
  }
  return (
    <div className="px-36 mt-36 mb-36">
      <div className="mb-4">
        <Input
          icon={<IconSearch />}
          placeholder="Search"
          value={keyward}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <Select
          value={selectedFilter}
          onChange={setSelectedFilter}
          data={FILTERS}
        />
      </div>
      {categories && (
        <div className="mb-4">
          <SegmentedControl
            value={selectedCategory}
            onChange={(data) => categoryHandler(data)}
            color="dark"
            data={[
              { label: 'ALL', value: '-1' },
              ...categories.map((item) => ({
                label: item.name,
                value: String(item.id),
              })),
            ]}
          />
        </div>
      )}
      {isFetching && <div>로딩중입니다.</div>}
      {products && (
        <div className="grid grid-cols-3 gap-16">
          {products.map((item) => (
            <div key={item.id} style={{ maxWidth: '500px' }}>
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
      <div className="w-full flex mt-5">
        {total !== 0 && total && (
          <Pagination
            className="m-auto"
            value={activePage}
            onChange={setPage}
            total={total}
          />
        )}
      </div>
    </div>
  )
}
