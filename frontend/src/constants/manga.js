export const STATUS_OPTIONS = [
  { label: 'Đang đọc', value: 'reading' },
  { label: 'Đã đọc', value: 'completed' },
  { label: 'Muốn mua', value: 'wishlist' },
]

export const SORT_OPTIONS = [
  { label: 'Mới thêm', value: 'createdAt' },
  { label: 'Đánh giá', value: 'rating' },
  { label: 'Tiến độ đọc', value: 'progress' },
  { label: 'Tên truyện', value: 'title' },
]

export const PIE_COLORS = ['#ff7a59', '#ffd166', '#5f9df7', '#2ec4b6', '#b9f18c', '#ff99c8']

export const EMPTY_FORM = {
  title: '',
  authors: '',
  genres: '',
  synopsis: '',
  coverImage: '',
  totalChapters: 0,
  ownedChapters: 0,
  rating: 0,
  status: 'reading',
  priceEstimate: 0,
  jikanId: '',
}

export const DEFAULT_FILTERS = {
  status: 'all',
  genre: 'all',
  sortBy: 'createdAt',
  order: 'desc',
  search: '',
}
