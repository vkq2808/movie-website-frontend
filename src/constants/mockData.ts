export const categories: Array<CategoryItem> = [
  {
    title: 'Trang chủ',
    path: '/',
  },
  {
    title: 'Phim mới',
    path: '/movies/news'
  },
  {
    title: 'Phim bộ',
    path: '/movies/series'
  },
  {
    title: 'Anime',
    path: '/movies/anime'
  },
  {
    title: 'Kinh dị',
    path: '/movies/s?genre=horror'
  }
]

export type CategoryItem = {
  title: string;
  path: string;
}