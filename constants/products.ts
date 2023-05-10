export const CATEGORY_MAP = ['SNEAKERS', 'T-SHIRT', 'PANTS', 'CAP', 'HOODIE']
export const TAKE = 9
export const FILTERS = [
  { label: '최신순', value: 'latest' },
  { label: '높은가격순', value: 'expensive' },
  { label: '낮은가격순', value: 'cheap' },
]
export const getOrderBy = (orderBy?: string) =>
  orderBy
    ? orderBy === 'latest'
      ? { orderBy: { createdAt: 'desc' } }
      : orderBy === 'expensive'
      ? { orderBy: { price: 'desc' } }
      : { orderBy: { price: 'asc' } }
    : undefined
