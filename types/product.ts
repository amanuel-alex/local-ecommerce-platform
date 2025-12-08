export interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  discount_percentage?: number
  rating: number
  review_count: number
  image_url: string
  seller_name: string
  seller_avatar?: string
  is_new?: boolean
  is_bestseller?: boolean
  stock_quantity: number
  tags?: string[]
  category: string
  created_at: string
  updated_at: string
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  product_count: number
}

export interface Seller {
  id: string
  name: string
  avatar_url?: string
  rating: number
  total_sales: number
  joined_date: string
  is_verified: boolean
}