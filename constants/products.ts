// 상태관리툴 추가시 category api 호출때 값 넣어주는걸로 변경 예정
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

export const ORDER_STATUS_MAP = [
  '주문취소',
  '주문대기',
  '결제대기',
  '결제완료',
  '배송대기',
  '배송중',
  '배송완료',
  '환불대기',
  '환불완료',
  '반품대기',
  '반품완료',
]
